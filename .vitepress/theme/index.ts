// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Libraries from "./layout/Libraries.vue";
import LatestVersion from "./components/LatestVersion.vue";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    app.component("Libraries", Libraries);
    app.component("LatestVersion", LatestVersion);
    enhanceAppWithTabs(app);
  },
} satisfies Theme;
