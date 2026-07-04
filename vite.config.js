import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// IMPORTANTE: "base" debe ser el nombre exacto de tu repositorio de GitHub Pages
export default defineConfig({
  base: '/material-informatico-sitt/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.png'],
      manifest: {
        name: 'Inventario Informático SITT',
        short_name: 'Inv. SITT',
        description: 'Inventario de material informático — SITT, H. XXV Ayuntamiento de Tijuana',
        theme_color: '#0FB8A6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/material-informatico-sitt/',
        scope: '/material-informatico-sitt/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        navigateFallbackDenylist: [/^\/api/]
      }
    })
  ]
});
