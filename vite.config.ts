import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' gera um build que funciona de qualquer pasta ou servidor estático
// (inclusive o `iniciar.py`), sem depender de uma URL raiz.
export default defineConfig({
  base: './',
  server: { host: '0.0.0.0' },
  preview: { host: '0.0.0.0' },
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 800 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
  },
})
