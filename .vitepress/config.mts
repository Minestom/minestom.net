import { defineConfig } from "vitepress";
import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Minestom",
  description: "Minestom documentation & information",
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin);
    },
  },
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/minestom-logo.png",
    nav: [
      { text: "Docs", link: "/docs/introduction" },
      { text: "Implementations", link: "/implementations" },
      { text: "Libraries", link: "/libraries" },
    ],

    sidebar: [
      {
        text: "Introduction",
        link: "/docs/introduction",
      },
      {
        text: "Setup",
        items: [
          { text: "Dependencies", link: "/docs/setup/dependencies" },
          { text: "Your First Server", link: "/docs/setup/your-first-server" },
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
            link: "/docs/thread-architecture/acquirable-api/README",
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
            link: "/docs/world/chunk-management/README",
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
            link: "/docs/feature/events/README",
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
            link: "/docs/feature/entities/README",
            items: [{ text: "AI", link: "/docs/feature/entities/ai" }],
          },
          { text: "Tags", link: "/docs/feature/tags" },
          { text: "Schedulers", link: "/docs/feature/schedulers" },
          { text: "Commands", link: "/docs/feature/commands" },
          { text: "Inventories", link: "/docs/feature/inventories" },
          { text: "Player UUID", link: "/docs/feature/player-uuid" },
          { text: "Player Skin", link: "/docs/feature/player-skin" },
          { text: "Permissions", link: "/docs/feature/permissions" },
          { text: "Advancements", link: "/docs/feature/advancements" },
          {
            text: "Map Rendering",
            link: "/docs/feature/map-rendering/README",
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
        text: "Expansion",
        items: [
          { text: "Extensions", link: "/docs/expansion/extensions" },
          {
            text: "Scripting",
            link: "/docs/expansion/scripting/README",
            items: [
              {
                text: "WIP Commands",
                link: "/docs/expansion/scripting/wip-commands",
              },
              {
                text: "WIP Java Interoperability",
                link: "/docs/expansion/scripting/wip-java-interoperability",
              },
            ],
          },
        ],
      },
    ],
  },
});
