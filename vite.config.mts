import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: "solid-jsx",
      providerImportSource: "solid-mdx",
      remarkPlugins: [remarkGfm],
    }),
    solid(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
  },
});
