import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
  },
})
