import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    solidPlugin(),
    VitePWA({
      includeAssets: [
        "favicon.svg",
        "favicon.ico",
        "robots.txt",
        "apple-touch-icon.png",
      ],
      workbox: {
        // maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,ttf,wav}"],
        runtimeCaching: [
          {
            handler: "CacheFirst",
            // ogg or webm files
            urlPattern: /\.(?:ogg|webm)$/,
            options: {
              cacheName: "content-cache",
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365 * 2, // 2 years
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "Encrypted Todos",
        short_name: "Encrypted Todos",
        id: "encrypted-todos",
        start_url: "/",
        description: "A Secure todo list.",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/maskable_icon_x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/maskable_icon_x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
});
