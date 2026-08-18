import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Loads React Scan ahead of the app entry during `vite dev`.
 *
 * React Scan has to instrument React DOM before it registers itself, so it
 * cannot be imported from main.tsx — the static react-dom import there is
 * evaluated first. Injecting it into <head> makes it the first module the page
 * runs. `apply: 'serve'` keeps it out of production builds entirely.
 */
function reactScanDev(): Plugin {
  return {
    name: 'react-scan-dev',
    apply: 'serve',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module', src: '/src/app/devtools.ts' },
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), reactScanDev()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
