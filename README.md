# eduFlow

A React + Vite + TypeScript scaffold for a learning-platform frontend, built with Feature-Sliced Design (FSD) architecture and a Material Design 3 UI.

## Tech stack

- [Vite](https://vite.dev/)
- [React 19](https://react.dev/)
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com/)
- [Material Web](https://github.com/material-components/material-web) via [@lit/react](https://lit.dev/docs/frameworks/react/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check and build for production
```

## Project structure (Feature-Sliced Design)

Source code under `src/` is organized into layers, imported strictly one-way:

```
app → pages → widgets → features → entities → shared
```

A layer may only import from layers below it (e.g. `features` may import from `entities` and `shared`, never the reverse). Each slice (folder) exposes its contents only through its own `index.ts` — nothing outside a slice reaches into its internal files directly.

## Authentication

Auth is currently mock/demo: any email/password combination succeeds on `/login`, and any values succeed on `/register` — there is no real backend. Requests are simulated with a delay in `entities/*/api/requests.ts`; swap those function bodies for real `fetch` calls against `API_BASE_URL` (see `src/shared/config/env.ts`) once a backend exists.
