import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv, type Plugin } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import { seoPrerender } from "./vite/seo-prerender"

const shortcutIcon = [{ src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" }]

/** Cloudflare Web Analytics (cookieless) when a beacon token is configured. */
function cloudflareAnalytics(token: string | undefined): Plugin {
  return {
    name: "emaskuy:cf-analytics",
    apply: "build",
    transformIndexHtml: () =>
      token
        ? [
            {
              tag: "script",
              injectTo: "body",
              attrs: {
                defer: true,
                src: "https://static.cloudflareinsights.com/beacon.min.js",
                "data-cf-beacon": JSON.stringify({ token, spa: true }),
              },
            },
          ]
        : [],
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    react(),
    cloudflareAnalytics(loadEnv(mode, process.cwd(), "VITE_").VITE_CF_BEACON_TOKEN),
    seoPrerender(),
    VitePWA({
      // New builds (daily content) take over on the next navigation.
      registerType: "autoUpdate",
      injectRegister: "script-defer",
      manifest: {
        id: "/",
        name: "EmasKuy — Harga Emas Hari Ini",
        short_name: "EmasKuy",
        description: "Harga emas live per gram, grafik, serta kalkulator zakat dan investasi emas.",
        lang: "id",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#0a0b0e",
        background_color: "#0a0b0e",
        categories: ["finance", "news"],
        icons: [
          { src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          { name: "Kalkulator Zakat Emas", short_name: "Zakat", url: "/kalkulator/zakat", icons: shortcutIcon },
          { name: "Kalkulator Investasi Emas", short_name: "Kalkulator", url: "/kalkulator", icons: shortcutIcon },
          { name: "Portofolio Emas", short_name: "Portofolio", url: "/portofolio", icons: shortcutIcon },
        ],
      },
      workbox: {
        // App shell only: route HTML, images and the price APIs are not
        // precached (prices have their own localStorage fallback). Only the
        // latin font subsets are fetched up front, to spare mobile data.
        globPatterns: ["**/*.{js,css}", "assets/*-latin-wght-normal-*.woff2", "index.html", "logo.svg", "icons/*.png"],
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/\.[a-z0-9]+$/i],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // public/ images keep their names across deploys, so revalidate.
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === "image",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "ek-images", expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 3600 } },
          },
          {
            urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === "font",
            handler: "CacheFirst",
            options: { cacheName: "ek-fonts", expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 3600 } },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
