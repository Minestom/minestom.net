import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const redirects: Record<string, string> = {
  // https://github.com/Minestom/minestom.net/pull/45
  "/docs/feature/events/implementation": "/docs/feature/events#implementation",
  "/docs/feature/events/server-list-ping": "/docs/feature/motd",
  // https://github.com/Minestom/minestom.net/pull/53
  "/docs/feature/map-rendering/glfwmaprendering": "/docs/feature/map-rendering",
};

function renderRedirect(newUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <link rel="canonical" href="${newUrl}">
        <meta http-equiv="refresh" content="0; url=${newUrl}">
        <script>location.replace(${JSON.stringify(newUrl)} + location.search + location.hash)</script>
      </head>
      <body></body>
    </html>
  `;
}

export function writeRedirects(outputDirectory: string): void {
  const lines: string[] = [];

  for (const [oldUrl, newUrl] of Object.entries(redirects)) {
    const oldPath = path.join(outputDirectory, `${oldUrl}.html`);
    fs.mkdirSync(path.dirname(oldPath), { recursive: true });
    fs.writeFileSync(oldPath, renderRedirect(newUrl));
    lines.push(`${oldUrl} ${newUrl} 301`);
  }

  // send real 301 response (only on Cloudflare Pages)
  fs.writeFileSync(path.join(outputDirectory, "_redirects"), lines.join("\n") + "\n");
}

export function redirectsPlugin(): Plugin {
  return {
    name: "minestom-redirects",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const [requestPath, query] = (request.url ?? "").split("?");
        const url = requestPath.length > 1 ? requestPath.replace(/\/+$/, "") : requestPath;
        const target = redirects[url];

        if (target === undefined) {
          next();
          return;
        }

        let location = target;
        if (query) {
          const hash = location.indexOf("#");
          location = hash === -1
            ? `${location}?${query}`
            : `${location.slice(0, hash)}?${query}${location.slice(hash)}`;
        }

        response.statusCode = 302;
        response.setHeader("Location", location);
        response.end();
      });
    },
  };
}
