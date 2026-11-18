import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative paths, so the site works on GitHub Pages under /family-tree/
  // (and anywhere else) without knowing the address in advance.
  base: './',
})
