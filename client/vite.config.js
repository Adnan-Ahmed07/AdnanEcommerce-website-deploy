import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'  // Correct usage for ES modules

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Tailwind doesn't need to be imported here
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
