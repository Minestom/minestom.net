addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});

const GITHUB_API_URL =
  "https://api.github.com/search/repositories?q=topic:minestom-implementation";
const CACHE_TTL_SECONDS = 600; // 10 minutes
const KV_TTL_SECONDS = 1800; // 30 minutes
const KV_KEY = "IMPLEMENTATIONS";

async function handleRequest(event) {
  const request = event.request;

  // First, try to fetch the cached response from Workers KV
  let response = await GITHUB_REPOS.get(KV_KEY, "json");

  if (!response) {
    // If not in KV, check the temporary cache
    const cache = caches.default;
    response = await cache.match(request);

    if (!response) {
      // If not in any cache, fetch from GitHub API
      response = await fetch(GITHUB_API_URL, {
        headers: { "User-Agent": "cloudflare-worker-github" },
      });
      const repos = await response.json();

      // Transform data
      const transformed = repos.items.map((repo) => ({
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        preRelease: repo.releases_url
          ? repo.releases_url.endsWith("prereleases")
          : false,
        url: repo.html_url,
      }));

      response = new Response(JSON.stringify(transformed), {
        headers: { "Content-Type": "application/json" },
      });

      // Store in KV
      event.waitUntil(
        GITHUB_REPOS.put(KV_KEY, JSON.stringify(transformed), {
          expirationTtl: KV_TTL_SECONDS,
        }),
      );

      // Also store in temporary cache
      response.headers.append("Cache-Control", `max-age=${CACHE_TTL_SECONDS}`);
      event.waitUntil(cache.put(request, response.clone()));
    }
  } else {
    // If found in KV, create a new response
    response = new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return response;
}
