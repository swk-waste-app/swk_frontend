import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'favicon-64.png'],
      manifest: {
        name: 'Taka Kipawa — Waste Management & Upcycling',
        short_name: 'Taka Kipawa',
        description: 'Schedule waste pickups, earn rewards and shop upcycled products across Ghana.',
        theme_color: '#15803d',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        // Precache only the app shell; photos are cached lazily the first time
        // they are viewed, so installing the app stays light on mobile data.
        globPatterns: ['**/*.{js,css,html}', '*.png', 'favicon-64.png'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ sameOrigin, url }) => sameOrigin && /\/assets\/.+\.(?:png|jpe?g|webp|svg)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'swk-local-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // API responses: try the network, fall back to a day-old cache when
            // offline. Auth endpoints are deliberately excluded.
            urlPattern: /^https?:\/\/(?:swk-backend\.onrender\.com|localhost:6060)\/api\/(?!auth\/)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'swk-api',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 80, maxAgeSeconds: 24 * 60 * 60 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'swk-images',
              expiration: { maxEntries: 120, maxAgeSeconds: 30 * 24 * 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'swk-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
})
