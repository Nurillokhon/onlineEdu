import { scan } from 'react-scan'
import setupLocatorUI from '@locator/runtime'

// Dev-only tooling, loaded by the `eduflow-devtools` plugin in vite.config.ts
// ahead of the app entry so React Scan can instrument React DOM in time.

// Outlines components as they re-render.
scan({
  enabled: true,
  log: false,
})

// Alt/Option + click on any element opens its source in the editor. The `jsx`
// adapter reads the data-locatorjs-id attributes added by the Babel step in
// vite.config.ts; the `react` adapter would rely on fiber `_debugSource`, which
// React 19 no longer provides.
setupLocatorUI({
  adapter: 'jsx',
})
