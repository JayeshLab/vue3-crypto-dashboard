import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true
      },
      manifest: {
        name: 'vue3-crypto-dashboard',
        short_name: 'vue3-crypto-dashboard',
        description: 'Vue 3 Cryptocurrency Dashboard',
        theme_color: '#4DBA87'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import']
      }
    }
  }
})
