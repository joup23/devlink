import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  server: {
    proxy: {
      '/images': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
