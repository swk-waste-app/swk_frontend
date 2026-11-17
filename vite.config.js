import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolveBrand } from './brand.defaults.js'

const DEFAULT_THEME_COLOR = '#195d3c'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The deployment's identity (name, colours, locale) comes from VITE_BRAND_*
  // variables with the defaults in brand.defaults.js. See WHITE_LABEL.md.
  const brand = resolveBrand(loadEnv(mode, process.cwd(), 'VITE_'))
  const themeColor = brand.primaryColor || DEFAULT_THEME_COLOR

  const brandHtml = {
    name: 'brand-html',
    transformIndexHtml: (html) =>
      html
        .replaceAll('%BRAND_NAME%', brand.name)
        .replaceAll('%BRAND_TAGLINE%', brand.tagline)
        .replaceAll('%BRAND_THEME_COLOR%', themeColor),
  }

  return {
    plugins: [
      react(),
      brandHtml,
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png', 'favicon-64.png'],
        manifest: {
          name: brand.name,
          short_name: brand.name,
          description: brand.tagline,
          theme_color: themeColor,
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
              urlPattern: ({ url }) => /\/api\/(?!auth\/)/.test(url.pathname) && url.origin !== self.location.origin,
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
  }
})
