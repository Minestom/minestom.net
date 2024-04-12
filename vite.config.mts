import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import Pages from "vite-plugin-pages";

// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: "solid-jsx",
      providerImportSource: "solid-mdx",
      remarkPlugins: [remarkGfm],
    }),
    solid(),
    Pages({
      extensions: ["mdx"],
      dirs: [{ dir: "docs", baseRoute: "" }],
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      docs: path.resolve(__dirname, "./docs"),
    },
  },
  build: {
    target: "esnext",
  },
});
