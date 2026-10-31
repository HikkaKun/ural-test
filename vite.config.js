import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), svgr()],
})
