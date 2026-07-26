import { defineConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";
import container_plugin from "markdown-it-container"
import { redirectsPlugin, writeRedirects } from "./redirects";

const SIDEBAR_ORDER = [
  "introduction.md",

  "setup",
  "dependencies.md",
  "your-first-server.md",

  "world",
  "instances.md",
  "blocks.md",
  "terrain-generation.md",
  "loading.md",
  "lighting.md",
  "coordinates.md",
  "block-batches.md",

  "feature",
  "adventure.md",
  "items.md",
  "events.md",
  "player-capabilities.md",
  "entities",
  "ai.md",
  "tags.md",
  "schedulers.md",
  "commands.md",
  "inventories.md",
  "player-uuid.md",
  "player-skin.md",
  "advancements.md",
  "map-rendering.md",
  "locator-bar.md",
  "motd.md",
  "open-to-lan.md",

  "compatibility",
  "proxies.md",
  "unsupported-versions.md",

  "thread-architecture",
  "thread-safety.md",
  "acquirable-api",
  "inside-the-api.md",
];

// https://vitepress.dev/reference/site-config
const config = withSidebar({
  title: "Minestom",
  description:
    "A multithreaded, open-source library for developing high-performance Minecraft servers.",
  markdown: {
    breaks: true,
    config(md) {
      md.use(tabsMarkdownPlugin);
      for (const type of ['note', 'info', 'tip', 'warning', 'danger', 'success', 'important']) {
        md.use(container_plugin, type, {
          render(tokens, idx) {
            if (tokens[idx].nesting === 1) {
              return `<div class="alert alert-${type}">
                <div class="alert-header">${type.toUpperCase()}</div>
                  <div class="alert-content">\n`
            } else {
              return `</div></div>\n`
            }
          }
        })
      }
    }
  },
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["meta", { name: "theme-color", content: "#ff6c32" }],
  ],
  cleanUrls: true,

  rewrites: {
    "docs/:path+/index.md": "docs/:path+.md",
  },

  buildEnd(siteConfig) {
    writeRedirects(siteConfig.outDir);
  },

  vite: {
    plugins: [redirectsPlugin()],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local"
    },
    logo: "/minestom-logo.png",
    nav: [
      { text: "Libraries", link: "/libraries" },
      // { text: "Showcase", link: "/showcase/introduction" },
      { text: "Wiki", link: "/docs/introduction" },
      { text: "Javadoc", link: "https://javadoc.minestom.net" },
    ],

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
}, [
  {
    documentRootPath: "/",
    scanStartPath: "docs",
    resolvePath: "/docs/",
    useTitleFromFileHeading: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    hyphenToSpace: true,
    capitalizeFirst: true,
    excludePattern: ["faq/"],
    manualSortFileNameByPriority: SIDEBAR_ORDER,
  },
]);

function normalizeSidebar(items: any[], isCategory = true): void {
  for (const item of items) {
    if (isCategory && item.items) {
      delete item.link;
    } else if (typeof item.link === "string") {
      item.link = item.link.replace(/(?:^|\/)index\.md$/, "");
    }

    if (item.items) normalizeSidebar(item.items, false);
  }
}

for (const group of Object.values(config.themeConfig.sidebar as Record<string, any>)) {
  normalizeSidebar(group.items);
}

export default defineConfig(config);
