import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

// Keep these aliases in sync with "paths" in tsconfig.app.json.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': src(''),
      '@app': src('app'),
      '@components': src('components'),
      '@config': src('config'),
      '@data': src('data'),
      '@features': src('features'),
      '@hooks': src('hooks'),
      '@layouts': src('layouts'),
      '@lib': src('lib'),
      '@pages': src('pages'),
      '@styles': src('styles'),
    },
  },
  server: { port: 5173, open: false },
  build: {
    rollupOptions: {
      output: {
        // Libraries change rarely: keep them in their own cached chunks.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
