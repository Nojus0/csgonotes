import { defineConfig, splitVendorChunkPlugin } from "vite";
import solidPlugin from "vite-plugin-solid";
import pathsPlugin from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [pathsPlugin(), solidPlugin(), splitVendorChunkPlugin()],
  build: {
    target: "esnext",
  },
});
