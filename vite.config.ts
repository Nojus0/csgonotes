import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import viteTsconfigPaths from "vite-tsconfig-paths"
import path from "path"
import { viteMangleClassNames } from "./src/lib/vite-mangle-classnames"
import { viteSingleFile } from "vite-plugin-singlefile"
import { createHtmlPlugin } from "vite-plugin-html"

export default defineConfig({
  plugins: [
    viteTsconfigPaths(),
    solidPlugin(),
    viteMangleClassNames(),
    viteSingleFile({
      inlinePattern: ["assets/*.css", "assets/*.js"],
      useRecommendedBuildConfig: false,
      deleteInlinedFiles: true,
    }),
    createHtmlPlugin({
      minify: false,
    }),
  ],
  assetsInclude: ["**.woff2"],
  build: {
    target: "esnext",
    assetsInlineLimit: 15150,
    cssCodeSplit: false,
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@Assets": path.join(__dirname, "./src/Assets"),
    },
  },
})
