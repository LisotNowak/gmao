import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // En dev, activer le SW pour pouvoir tester le mode offline
      devOptions: {
        enabled: true,
      },
      // Utilise notre service-worker.js personnalisé
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'service-worker.js',
      injectManifest: {
        // Pas de precache Workbox — notre SW gère tout en natif
        injectionPoint: undefined,
      },
      manifest: {
        name: "GMAO",
        short_name: "GMAO",
        theme_color: "#1976d2",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
})
