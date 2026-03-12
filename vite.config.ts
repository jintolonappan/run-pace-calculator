import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/run-pace-calculator/',
  plugins: [react()],
  build: {
    sourcemap: false,
  },
})
