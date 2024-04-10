import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/MiniLevelEditor/',
  plugins: [vue()],
  define: {
    __APP_MODE: JSON.stringify((process.env.VITE_APP_MODE ?? 'with_server').toUpperCase()),
  },
  resolve: {
    alias: {
      '@common': fileURLToPath(new URL('./../common', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/MiniLevelEditor/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/MiniLevelEditor\/api/, ''),
      },
    },
  },
})
