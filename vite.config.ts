import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import pathsPlugin from "vite-tsconfig-paths";

// ! No Vendor js file ?

export default defineConfig({
  plugins: [pathsPlugin(), solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
