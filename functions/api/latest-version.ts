import { XMLParser } from "fast-xml-parser";

const MAVEN_URL =
    "https://repo1.maven.org/maven2/net/minestom/minestom/maven-metadata.xml";
const CACHE_TTL_SECONDS = 600; // 10 minutes
const KV_TTL_SECONDS = 1800; // 30 minutes
const KV_KEY = "LATEST_VERSION";

export interface Env {
    KV_CACHE: KVNamespace;
}

async function fetchLatestVersion(): Promise<string> {
    const response = await fetch(MAVEN_URL, {
        headers: {
            "X-Source": "Cloudflare-Workers",
            "User-Agent": "Cloudflare-Workers",
        },
    });

    if (!response.ok) {
        throw new Error(`Maven request failed with status ${response.status}`);
    }

    const text = await response.text();

    const parser = new XMLParser();
    const data = parser.parse(text);
    const latestId = data.metadata.versioning.latest;

    return latestId;
}

async function getCachedVersion(cache: KVNamespace): Promise<string | null> {
    return cache.get(KV_KEY);
}

async function cacheVersion(
    cache: KVNamespace,
    version: string
): Promise<void> {
    await cache.put(KV_KEY, version, {
        expirationTtl: KV_TTL_SECONDS,
    });
}

export const onRequest: PagesFunction<Env> = async (context) => {
    try {
        const cachedVersion = await getCachedVersion(context.env.KV_CACHE);
        if (cachedVersion) {
            console.info("Maven response was already cached.");
            return new Response(JSON.stringify({ latestVersion: cachedVersion }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        const latestVersion = await fetchLatestVersion();

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
