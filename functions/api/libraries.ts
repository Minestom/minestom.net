const API_PER_PAGE = 100; // GitHub API allows up to 100 items per page
const API_MAX_PAGES = 10; // Limit to prevent abuse
const GITHUB_API_URL =
    `https://api.github.com/search/repositories?q=topic:minestom-library&per_page=${API_PER_PAGE}`;
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

function transformGitHubApiResponse(json: any[]): Repository[] {
    return json.filter(repo => repo.archived === false)
        .map(repo => ({
            owner: repo.owner.login,
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            preRelease: false, // TODO
            url: repo.html_url,
        }));
}

async function fetchGithubSearchAPI(token: string, page: number = 1): Promise<any> {
    const response = await fetch(`${GITHUB_API_URL}&page=${page}`, {
        headers: {
            "X-Source": "Cloudflare-Workers",
            "User-Agent": "Cloudflare-Workers",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed with status ${response.status}`);
    }
    return await response.json();
}

async function fetchGitHubRepositories(token: string): Promise<Repository[]> {
    const firstPage = await fetchGithubSearchAPI(token);
    const items = [...firstPage.items];

    const totalCount = Math.min(firstPage.total_count, API_PER_PAGE * API_MAX_PAGES);
    let currentPage = 1;

    while (items.length < totalCount && currentPage++ < API_MAX_PAGES) {
        const nextPage = await fetchGithubSearchAPI(token, currentPage);
        items.push(...nextPage.items);
    }

    return transformGitHubApiResponse(items);
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
