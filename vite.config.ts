import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.GITHUB_PAGES === "true" ? "/Sophias_World/" : "/";

export default defineConfig({
  base,
  server: { host: true, port: 5173 },
  build: { target: "es2022", sourcemap: true },
  plugins: [
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: ["icons/*.png"],
      manifest: {
        name: "Sophia's World",
        short_name: "Sophia",
        description: "Joguinho de faz-de-conta da Sofia",
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "landscape",
        background_color: "#FAF4E8",
        theme_color: "#FAF4E8",
        lang: "pt-BR",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,json,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false
      }
    })
  ]
});
