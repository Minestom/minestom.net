import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import bracketed_spans_plugin from "markdown-it-bracketed-spans"
import container_plugin from "markdown-it-container"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minestom",
  description:
    "A multithreaded, open-source library for developing high-performance Minecraft servers.",
  markdown: {
    breaks: true,
    config(md) {
      md.use(tabsMarkdownPlugin);
      md.use(bracketed_spans_plugin)
      md.use(container_plugin, 'alert', {
        render(tokens, idx) {
          const token = tokens[idx]
          const type = token.info.trim().split(' ')[1] || 'info'
          if (token.nesting === 1) {
            return `<div class="alert alert-${type}">
                      <div class="alert-header">${type.toUpperCase()}</div>
                        <div class="alert-content">\n`
          } else {
            return `</div></div>\n`
          }
        }
      })
    }
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#ff6c32" }],
  ],
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local"
    },
    logo: "/minestom-logo.png",
    nav: [
      { text: "Libraries", link: "/libraries" },
      // { text: "Showcase", link: "/showcase/introduction" },
      { text: "Wiki", link: "/docs/getting-started/introduction" },
      { text: "Javadoc", link: "https://javadoc.minestom.net" },
    ],

    sidebar: {
      // "/showcase": [
      //   {
      //     text: "Introduction",
      //     link: "/showcase/introduction",
      //   },
      //
      //   // Showcase example
      //   {
      //     text: "Showcase",
      //     items: [{ text: "Example Server", link: "/showcase/example" }],
      //   },
      // ],
      "/docs/": [
        {
          text: "Getting Started",
          items: [
            { 
              text: "Introduction",
              link: "/docs/getting-started/introduction",
            },
          ]
        },
        {
          text: "Setup",
          items: [
            { text: "Dependencies", link: "/docs/setup/dependencies" },
            {
              text: "Your First Server",
              link: "/docs/setup/your-first-server",
            },
          ],
        },
        {
          text: "Thread Architecture",
          items: [
            {
              text: "Thread Safety in the JVM",
              link: "/docs/thread-architecture/thread-safety",
            },
            {
              text: "Acquirable API",
              link: "/docs/thread-architecture/acquirable-api",
              items: [
                {
                  text: "The Inside",
                  link: "/docs/thread-architecture/acquirable-api/inside-the-api",
                },
              ],
            },
          ],
        },
        {
          text: "World",
          items: [
            { text: "Instances", link: "/docs/world/instances" },
            {
              text: "Chunk Management",
              link: "/docs/world/chunk-management",
              items: [
                { text: "Anvil Loader", link: "/docs/world/anvilloader" },
                { text: "Lighting", link: "/docs/world/lightloader" },
              ],
            },
            { text: "Blocks", link: "/docs/world/blocks" },
            { text: "Coordinates", link: "/docs/world/coordinates" },
            { text: "Generation", link: "/docs/world/generation" },
            { text: "Batch", link: "/docs/world/batch" },
          ],
        },
        {
          text: "Feature",
          items: [
            { text: "Adventure", link: "/docs/feature/adventure" },
            {
              text: "Player Capabilities",
              link: "/docs/feature/player-capabilities",
            },
            {
              text: "Events",
              link: "/docs/feature/events",
              items: [
                {
                  text: "Implementation",
                  link: "/docs/feature/events/implementation",
                },
                {
                  text: "Server List Ping",
                  link: "/docs/feature/events/server-list-ping",
                },
              ],
            },
            { text: "Items", link: "/docs/feature/items" },
            {
              text: "Entities",
              link: "/docs/feature/entities",
              items: [{ text: "AI", link: "/docs/feature/entities/ai" }],
            },
            { text: "Tags", link: "/docs/feature/tags" },
            { text: "Schedulers", link: "/docs/feature/schedulers" },
            { text: "Commands", link: "/docs/feature/commands" },
            { text: "Inventories", link: "/docs/feature/inventories" },
            { text: "Player UUID", link: "/docs/feature/player-uuid" },
            { text: "Player Skin", link: "/docs/feature/player-skin" },
            { text: "Advancements", link: "/docs/feature/advancements" },
            {
              text: "Map Rendering",
              link: "/docs/feature/map-rendering",
              items: [
                {
                  text: "GLFW Map Rendering",
                  link: "/docs/feature/map-rendering/glfwmaprendering",
                },
              ],
            },
            { text: "Query System", link: "/docs/feature/query" },
            { text: "Open to LAN", link: "/docs/feature/open-to-lan" },
          ],
        },
        {
          "text": "Compatibility",
          "items": [
            { "text": "Proxies", "link": "/docs/compatibility/proxies" },
            { "text": "Unsupported Versions", "link": "/docs/compatibility/unsupported-versions" }
          ]
        }
      ],
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/minestom/Minestom",
      },
      {
        icon: "discord",
        link: "https://discord.gg/pkFRvqB",
      },
    ],
  },
});
