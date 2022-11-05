import {defineConfig, splitVendorChunkPlugin} from "vite";
import solidPlugin from "vite-plugin-solid";
import pathsPlugin from "vite-tsconfig-paths";
import {serviceWorker} from "./src/lib/vite-service-worker";

export default defineConfig({
    plugins: [
        pathsPlugin(),
        solidPlugin(),
        splitVendorChunkPlugin(),
        serviceWorker({
            manifest: {
                short_name: 'Notes',
                name: 'CS:GO Notes',
                start_url: '/',
                scope: '/',
                theme_color: '#4caf50',
                background_color: '#4caf50',
                display: 'standalone',
                orientation: 'portrait',
                description: "A CS:GO Themed Notes Web App with AES256 Encryption.",
                icons: [
                    {
                        src: '/static/icons/icon.svg',
                        type: 'image/svg+xml',
                        sizes: 'any',
                        purpose: 'any',
                    },
                    {
                        src: "/static/icons/icon.png",
                        type: "image/png",
                        sizes: "128x128",
                        purpose: "any"
                    }
                ],
                screenshots: []
            }
        })
    ],
    build: {
        target: "esnext",
    },
});
