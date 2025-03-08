import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.mjs'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist', // Explicit output directory
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          state: ['@reduxjs/toolkit', 'react-redux'],
          // Add other heavy dependencies here
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit (in KB)
    minify: 'terser', // Enable minification
    sourcemap: false // Disable in production
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] // Pre-bundle dependencies
  }
})