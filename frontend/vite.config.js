import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: process.env.VITE_CACHE_DIR || '../.tmp/frontend-vite-cache',
  server: {
    proxy: {
      '/api': process.env.BACKEND_PROXY_TARGET || 'http://127.0.0.1:5000',
    },
  },
})
