const GITHUB_API_URL =
    "https://api.github.com/search/repositories?q=topic:minestom-library";
const CACHE_TTL_SECONDS = 600; // 10 minutes
const KV_TTL_SECONDS = 1800; // 30 minutes
const KV_KEY = "LIBRARIES";

export type Repository = {
    owner: string;
    name: string;
    description: string;
    stars: number;
    preRelease: boolean;
    url: string;
};

export interface Env {
    GH_API_TOKEN: string;
    KV_CACHE: KVNamespace;
}

function transformGitHubApiResponse(json: any): Repository[] {
    return json.items
        .filter((repo: any) => repo.archived === false)
        .map((repo: any) => ({
            owner: repo.owner.login,
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            url: repo.html_url,
        }));
}

async function fetchGitHubRepositories(token: string): Promise<Repository[]> {
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

    const data = await response.json();
    return transformGitHubApiResponse(data);
}

async function getCachedRepositories(
    cache: KVNamespace,
): Promise<Repository[] | null> {
    return cache.get<Repository[]>(KV_KEY, "json");
}

async function cacheRepositories(
    cache: KVNamespace,
    repositories: Repository[],
): Promise<void> {
    await cache.put(KV_KEY, JSON.stringify(repositories), {
        expirationTtl: KV_TTL_SECONDS,
    });
}

export const onRequest: PagesFunction<Env> = async (context) => {
    try {
        const cachedResponse = await getCachedRepositories(context.env.KV_CACHE);
        if (cachedResponse) {
            console.info("GitHub API response was already cached.");
            return new Response(JSON.stringify(cachedResponse), {
                headers: {"Content-Type": "application/json"},
            });
        }

        const repositories = (await fetchGitHubRepositories(
            context.env.GH_API_TOKEN,
        ));

        await cacheRepositories(context.env.KV_CACHE, repositories);
        console.info("Successfully cached API response.");

        return new Response(JSON.stringify(repositories), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": `max-age=${CACHE_TTL_SECONDS}`,
            },
        });
    } catch (err: any) {
        console.error("Error fetching GitHub repositories:", err);
        return new Response(JSON.stringify({error: err.message}), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": `max-age=${CACHE_TTL_SECONDS}`,
            },
        });
    }
};
