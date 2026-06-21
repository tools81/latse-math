import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'latse-app' with whatever you name your GitHub repository
export default defineConfig({
  plugins: [react()],
  base: '/latse-math/',
})
