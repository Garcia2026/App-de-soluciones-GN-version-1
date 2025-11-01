import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}']
      },
      manifest: {
        name: "Soluciones Integrales GN",
        short_name: "GN Soluciones",
        description: "Sistema de Control Interno empresarial con tecnología avanzada",
        start_url: "/",
        id: "gn-soluciones-app",
        display: "standalone",
        background_color: "#111827",
        theme_color: "#10b981",
        orientation: "portrait-primary",
        categories: ["business", "productivity", "finance"],
        lang: "es-GT",
        scope: "/",
        prefer_related_applications: false,
        shortcuts: [
          {
            "name": "Nueva Cotización",
            "short_name": "Cotizar",
            "description": "Crear nueva cotización rápidamente",
            "url": "/cotizaciones",
            "icons": [{ "src": "/icon-192x192.png", "sizes": "192x192" }]
          },
          {
            "name": "Dashboard",
            "short_name": "Panel",
            "description": "Abrir panel principal",
            "url": "/dashboard",
            "icons": [{ "src": "/icon-192x192.png", "sizes": "192x192" }]
          }
        ],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'  
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          charts: ['chart.js', 'vue-chartjs'],
          pdf: ['jspdf', 'jspdf-autotable'],
        },
      },
    },
  },
})