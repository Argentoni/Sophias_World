import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: { host: true, port: 5173 },
  build: { target: "es2022", sourcemap: true },
  plugins: [
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["icons/*.png"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,json,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false
      }
    })
  ]
});
