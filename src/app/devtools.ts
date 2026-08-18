import { scan } from 'react-scan'

// Dev-only re-render highlighting. Loaded by the `react-scan-dev` plugin in
// vite.config.ts, which injects it ahead of the app entry so React Scan can
// instrument React DOM before it initialises.
scan({
  enabled: true,
  log: false,
})
