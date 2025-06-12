import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // serve per risolvere il path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), //  ora puoi usare '@/...' negli import
    },
  },
})
