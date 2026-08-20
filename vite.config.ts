import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { transformAsync } from '@babel/core'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

/**
 * Loads the dev-only tooling (React Scan, LocatorJS) ahead of the app entry.
 *
 * React Scan has to instrument React DOM before it registers itself, so it
 * cannot be imported from main.tsx — the static react-dom import there is
 * evaluated first. Injecting it into <head> makes it the first module the page
 * runs. `apply: 'serve'` keeps it out of production builds entirely.
 */
function devtools(): Plugin {
  return {
    name: 'eduflow-devtools',
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

/**
 * Stamps every JSX element with the file and line it came from, which is what
 * LocatorJS reads to open the source in the editor. React 19 dropped fiber
 * `_debugSource`, and @vitejs/plugin-react v6 transforms JSX with oxc rather
 * than Babel, so the transform runs here as its own pre-step instead of as a
 * plugin-react Babel option.
 */
function locatorSourceIds(): Plugin {
  return {
    name: 'locatorjs-source-ids',
    apply: 'serve',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.includes('/src/') || !/\.[jt]sx$/.test(id)) return null
      const result = await transformAsync(code, {
        filename: id,
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        parserOpts: { plugins: ['typescript', 'jsx'] },
        plugins: [['@locator/babel-jsx/dist', { env: 'development' }]],
      })
      if (!result?.code) return null
      return { code: result.code, map: result.map }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [locatorSourceIds(), react(), tailwindcss(), devtools()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
