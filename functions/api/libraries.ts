/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const GITHUB_API_URL =
  "https://api.github.com/search/repositories?q=topic:minestom-library";
const CACHE_TTL_SECONDS = 600; // 10 minutes
const KV_TTL_SECONDS = 1800; // 30 minutes
const KV_KEY = "LIBRARIES";

export interface Env {
  GH_API_TOKEN: string;
  KV_CACHE: KVNamespace;
}

type Repository = {
  owner: string;
  name: string;
  description: string;
  stars: number;
  url: string;
};

function transformGitHubApiResponse(json: any): Repository[] {
  return json.items.map((repo: any) => ({
    owner: repo.owner.login,
    name: repo.name,
    description: repo.description,
    stars: repo.stargazers_count,
    url: repo.html_url,
  }));
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    let cachedReponse: Repository[] | null = await env.KV_CACHE.get(
      KV_KEY,
      "json",
    );
    if (cachedReponse != null) {
      console.info("GitHub API response was already cached.");
      return new Response(JSON.stringify(cachedReponse), {
        headers: { "Content-Type": "application/json" },
      });
    }
    try {
      let value = await fetch(GITHUB_API_URL, {
        headers: {
          "X-Source": "Cloudflare-Workers",
          "User-Agent": "Cloudflare-Workers",
          Authorization: `Bearer ${env.GH_API_TOKEN}`,
        },
      });
      let transformed = JSON.stringify(
        transformGitHubApiResponse(await value.json()),
      );
      await env.KV_CACHE.put(KV_KEY, transformed, {
        expirationTtl: KV_TTL_SECONDS,
      });
      console.info("Successfully cached API response.");
      return new Response(transformed, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `max-age=${CACHE_TTL_SECONDS}`,
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify(err), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `max-age=${CACHE_TTL_SECONDS}`,
        },
      });
    }
  },
};
