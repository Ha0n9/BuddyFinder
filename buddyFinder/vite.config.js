import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      global: 'globalThis',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'FrontendTest/test-setup.js',
    include: ['FrontendTest/**/*.test.{js,jsx,ts,tsx}'],
  },
})
