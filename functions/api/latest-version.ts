const GITHUB_API_URL = "https://api.github.com/repos/Minestom/Minestom/commits";
const CACHE_TTL_SECONDS = 600; // 10 minutes
const KV_TTL_SECONDS = 1800; // 30 minutes
const KV_KEY = "LATEST_VERSION";

export interface Env {
  GH_API_TOKEN: string;
  KV_CACHE: KVNamespace;
}

async function fetchLatestVersion(token: string): Promise<string> {
  const response = await fetch(GITHUB_API_URL, {
    headers: {
      "X-Source": "Cloudflare-Workers",
      "User-Agent": "Cloudflare-Workers",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed with status ${response.status}`);
  }

  const commits = (await response.json()) as any[];
  if (commits.length > 0) {
    return commits[0].sha.substring(0, 10);
  }
  return "";
}

async function getCachedVersion(cache: KVNamespace): Promise<string | null> {
  return cache.get(KV_KEY);
}

async function cacheVersion(
  cache: KVNamespace,
  version: string,
): Promise<void> {
  await cache.put(KV_KEY, version, {
    expirationTtl: KV_TTL_SECONDS,
  });
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    const cachedVersion = await getCachedVersion(context.env.KV_CACHE);
    if (cachedVersion) {
      console.info("GitHub API response was already cached.");
      return new Response(JSON.stringify({ latestVersion: cachedVersion }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const latestVersion = await fetchLatestVersion(context.env.GH_API_TOKEN);

    await cacheVersion(context.env.KV_CACHE, latestVersion);
    console.info("Successfully cached API response.");

    return new Response(JSON.stringify({ latestVersion }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `max-age=${CACHE_TTL_SECONDS}`,
      },
    });
  } catch (err: any) {
    console.error("Error fetching latest version:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `max-age=${CACHE_TTL_SECONDS}`,
      },
    });
  }
};
