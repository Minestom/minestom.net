// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Implementations from "./layout/Implementations.vue";
import Libraries from "./layout/Libraries.vue";
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
    app.component("Implementations", Implementations);
    app.component("Libraries", Libraries);
    enhanceAppWithTabs(app);
  },
} satisfies Theme;
