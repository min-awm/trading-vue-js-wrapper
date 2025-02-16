import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue2 from "@vitejs/plugin-vue2";
import { viteSingleFile } from "vite-plugin-singlefile";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    drop: ["console", "debugger"],
  },
  plugins: [vue2(), viteSingleFile(), cssInjectedByJsPlugin()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      formats: ["es"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      vue: "vue/dist/vue.min.js",
    },
  },
});
