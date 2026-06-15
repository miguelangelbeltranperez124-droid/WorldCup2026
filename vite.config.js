import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png", "favicon.png"],
      workbox: {
        // No interceptar las llamadas al proxy de resultados
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: "Mundial 2026",
        short_name: "Mundial 26",
        description: "Partidos, grupos y cuadro del Mundial 2026 en vivo",
        lang: "es",
        theme_color: "#080b16",
        background_color: "#080b16",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  server: { port: 5173 },
});
