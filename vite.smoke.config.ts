import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Builds the render smoke test as a self-contained IIFE that can be evaluated
 * inside jsdom. Used by `npm run smoke`.
 */
export default defineConfig({
  plugins: [react()],
  ssr: { noExternal: true },
  build: {
    ssr: true,
    outDir: 'dist-smoke',
    emptyOutDir: true,
    rollupOptions: {
      input: 'scripts/smoke-entry.tsx',
      output: { format: 'iife', inlineDynamicImports: true, entryFileNames: 'smoke.js' },
    },
  },
})
