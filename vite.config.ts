import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start'
import { viteTsConfigPaths } from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({ server: { preset: 'vercel' } }),
  ],
  build: {
    cssMinify: false,
  },
})