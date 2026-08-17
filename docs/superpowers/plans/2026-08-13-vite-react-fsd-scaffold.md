# React + Vite FSD Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a React + Vite + TypeScript app in `eduFlow/` with Tailwind CSS v4, TanStack Query, React Router (`createBrowserRouter`, public/private route split), Material Web (Material Design 3) via `@lit/react`, Zustand, laid out as Feature-Sliced Design (FSD).

**Architecture:** FSD layers `app → pages → widgets → features → entities → shared`, each slice exposing a single `index.ts` public API. Material Web custom elements are wrapped once via `@lit/react`'s `createComponent` in `shared/ui/material/*`, then re-exported through friendlier `shared/ui` components (`Button`, `TextField`, `Card`, `Spinner`). Auth is demo/mock: `entities/user` holds a Zustand store (persisted to `localStorage`) plus TanStack Query hooks wrapping `setTimeout`-based fake requests. `PrivateRoute`/`PublicRoute` guard components in `app/routes` read the store and redirect via `react-router-dom`.

**Tech Stack:** Vite, React 19 (via `react-ts` template), TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), TanStack Query v5, `react-router-dom`, `@material/web` + `lit` + `@lit/react`, Zustand.

**Spec:** `docs/superpowers/specs/2026-08-13-vite-react-fsd-scaffold-design.md`

## Global Constraints

- Language: TypeScript everywhere (no `.js`/`.jsx` app source files).
- Package manager: npm only.
- No automated test framework is installed (explicit spec non-goal). Verification per task is `npx tsc --noEmit`, `npm run build`, and — in the final task — a manual `npm run dev` walkthrough matching the spec's Success Criteria section.
- FSD import direction is one-way: `app → pages → widgets → features → entities → shared`. A lower layer never imports a higher one. Every slice folder exposes its contents only via its own `index.ts`; nothing outside a slice imports a file inside it directly.
- Path alias `@/*` resolves to `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- Tailwind utility classes are for layout/spacing only. Material Web components render their own look from `--md-sys-color-*` custom properties (Shadow DOM blocks Tailwind from styling their internals) — this is expected, not a bug.
- **Deviation from the written spec, fixed during planning:** the spec listed `useAuth` under `shared/lib/`, but that hook reads `entities/user`'s Zustand store, which would violate the very layer rule above (shared is beneath entities). This plan places it at `entities/user/lib/useAuth.ts` instead. `shared/lib/` is not created — nothing else needs it yet (YAGNI).
- Versions are not pinned in this plan; `npm install` resolves latest stable. Expected majors: Tailwind v4, TanStack Query v5, React Router v6/v7 (both export `createBrowserRouter` from `react-router-dom`).
- **Pre-flight deviation, confirmed with the human partner before execution:** the spec's file tree also listed `shared/ui/material/icon.ts` and `icon-button.ts`, but no task in this plan renders an icon, so they were dropped from Task 4 as dead code (YAGNI) — add them later the same way as the other wrappers if a page ever needs one. `shared/config/env.ts` and `.env.example` stay despite being similarly unused today; unlike the icon wrappers they're normal, expected scaffolding for any Vite project and cost nothing to keep.

---

### Task 1: Scaffold the Vite project and establish the git baseline

**Files:**
- Create: entire Vite `react-ts` template (merged into repo root) — `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/App.css`, `src/index.css`, `src/vite-env.d.ts`, `src/assets/react.svg`, `public/vite.svg`
- Modify: `package.json` (`name` field)

**Interfaces:**
- Produces: a buildable Vite+React+TS project (`npm run dev`, `npm run build` both work) that later tasks overwrite piece by piece.

- [ ] **Step 1: Scaffold into a throwaway subfolder (repo root already has `docs/` and `.git/`, so it isn't empty)**

Run:
```bash
npm create vite@latest .tmp-vite-scaffold -- --template react-ts
```

Expected: a `.tmp-vite-scaffold/` directory is created containing the template files. This command is fully non-interactive because both the target dir and `--template` are supplied.

- [ ] **Step 2: Merge the scaffold into the repo root, excluding any nested `.git`**

Run:
```bash
rsync -a --exclude='.git' .tmp-vite-scaffold/ .
rm -rf .tmp-vite-scaffold
```

Expected: `ls` at repo root now shows `docs/`, `package.json`, `index.html`, `vite.config.ts`, `src/`, `public/`, etc., alongside the existing `.git/`.

- [ ] **Step 3: Fix the package name**

Open `package.json`, change `"name": ".tmp-vite-scaffold"` (or similar) to `"name": "eduflow"`.

- [ ] **Step 4: Install dependencies**

Run:
```bash
npm install
```

Expected: exits 0, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 5: Verify the default scaffold builds**

Run:
```bash
npm run build
```

Expected: exits 0, produces `dist/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Vite + React + TypeScript project"
```

---

### Task 2: Install project dependencies and configure the `@/*` path alias

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`

**Interfaces:**
- Consumes: Task 1's `vite.config.ts` (default `defineConfig({ plugins: [react()] })`) and `tsconfig.app.json` (default `compilerOptions`).
- Produces: `@/*` resolves to `src/*` in both the Vite dev/build pipeline and TypeScript. All of `react-router-dom`, `@tanstack/react-query`, `zustand`, `@material/web`, `lit`, `@lit/react` are installed as dependencies; `tailwindcss`, `@tailwindcss/vite`, `@tanstack/react-query-devtools` as devDependencies. (`@tailwindcss/vite` itself is wired into `vite.config.ts` in Task 3, not here — this task only installs it.)

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install react-router-dom @tanstack/react-query zustand @material/web lit @lit/react
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D tailwindcss @tailwindcss/vite @tanstack/react-query-devtools
```

- [ ] **Step 3: Add the `@` alias to `vite.config.ts`**

Read the current `vite.config.ts` first (Task 1's default), then replace its contents with:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

(The Tailwind plugin is added to this `plugins` array in Task 3 — don't add it yet.)

- [ ] **Step 4: Add the matching alias to `tsconfig.app.json`**

Read the current `tsconfig.app.json`. Inside the existing `compilerOptions` object, add:

```json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}
```

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Expected: both exit 0 (no source uses `@/` yet, so this only confirms the config files themselves are syntactically valid and the alias doesn't break the build).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.app.json
git commit -m "Install core dependencies and configure @/* path alias"
```

### Task 3: Tailwind CSS v4 + Material Design 3 baseline theme

**Files:**
- Create: `src/app/styles/material-theme.css`
- Create: `src/app/styles/index.css`
- Modify: `vite.config.ts` (add the Tailwind plugin)
- Modify: `src/main.tsx` (point the CSS import at the new file)
- Modify: `index.html` (title, Roboto + Material Symbols font links)

**Interfaces:**
- Consumes: Task 2's `vite.config.ts` (`plugins: [react()]`).
- Produces: importing `./app/styles/index.css` gives Tailwind utilities plus a `@theme` bridge exposing `bg-primary`, `text-on-primary`, `bg-secondary`, `text-on-secondary`, `bg-background`, `text-on-background`, `bg-surface`, `text-on-surface`, `bg-surface-container`, `border-outline`/`text-outline`, `bg-error`, `text-on-error` (and the matching `--md-sys-color-*` raw custom properties, for direct use inside inline `style` when a Material Web attribute is needed instead of a Tailwind class).

- [ ] **Step 1: Add the Tailwind plugin to Vite**

Read `vite.config.ts` (from Task 2), then update it to:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Create the M3 baseline color tokens**

Create `src/app/styles/material-theme.css`:

```css
/*
 * Material Design 3 baseline color scheme (Material Theme Builder default
 * seed #6750A4). Regenerate at
 * https://material-foundation.github.io/material-theme-builder/ once a real
 * brand seed color is chosen.
 */
:root {
  --md-sys-color-primary: #6750a4;
  --md-sys-color-on-primary: #ffffff;
  --md-sys-color-primary-container: #eaddff;
  --md-sys-color-on-primary-container: #21005d;
  --md-sys-color-secondary: #625b71;
  --md-sys-color-on-secondary: #ffffff;
  --md-sys-color-secondary-container: #e8def8;
  --md-sys-color-on-secondary-container: #1d192b;
  --md-sys-color-tertiary: #7d5260;
  --md-sys-color-on-tertiary: #ffffff;
  --md-sys-color-tertiary-container: #ffd8e4;
  --md-sys-color-on-tertiary-container: #31111d;
  --md-sys-color-error: #b3261e;
  --md-sys-color-on-error: #ffffff;
  --md-sys-color-error-container: #f9dedc;
  --md-sys-color-on-error-container: #410e0b;
  --md-sys-color-background: #fffbfe;
  --md-sys-color-on-background: #1c1b1f;
  --md-sys-color-surface: #fffbfe;
  --md-sys-color-on-surface: #1c1b1f;
  --md-sys-color-surface-variant: #e7e0ec;
  --md-sys-color-on-surface-variant: #49454f;
  --md-sys-color-surface-container: #f3edf7;
  --md-sys-color-outline: #79747e;
  --md-sys-color-outline-variant: #cac4d0;
  --md-sys-color-inverse-surface: #313033;
  --md-sys-color-inverse-on-surface: #f4eff4;
  --md-sys-color-inverse-primary: #d0bcff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --md-sys-color-primary: #d0bcff;
    --md-sys-color-on-primary: #381e72;
    --md-sys-color-primary-container: #4f378b;
    --md-sys-color-on-primary-container: #eaddff;
    --md-sys-color-secondary: #ccc2dc;
    --md-sys-color-on-secondary: #332d41;
    --md-sys-color-secondary-container: #4a4458;
    --md-sys-color-on-secondary-container: #e8def8;
    --md-sys-color-tertiary: #efb8c8;
    --md-sys-color-on-tertiary: #492532;
    --md-sys-color-tertiary-container: #633b48;
    --md-sys-color-on-tertiary-container: #ffd8e4;
    --md-sys-color-error: #f2b8b5;
    --md-sys-color-on-error: #601410;
    --md-sys-color-error-container: #8c1d18;
    --md-sys-color-on-error-container: #f9dedc;
    --md-sys-color-background: #1c1b1f;
    --md-sys-color-on-background: #e6e1e5;
    --md-sys-color-surface: #1c1b1f;
    --md-sys-color-on-surface: #e6e1e5;
    --md-sys-color-surface-variant: #49454f;
    --md-sys-color-on-surface-variant: #cac4d0;
    --md-sys-color-surface-container: #211f26;
    --md-sys-color-outline: #938f99;
    --md-sys-color-outline-variant: #49454f;
    --md-sys-color-inverse-surface: #e6e1e5;
    --md-sys-color-inverse-on-surface: #313033;
    --md-sys-color-inverse-primary: #6750a4;
  }
}
```

- [ ] **Step 3: Create the Tailwind entry point that bridges to the M3 tokens**

Create `src/app/styles/index.css`:

```css
@import "tailwindcss";
@import "./material-theme.css";

@theme {
  --color-primary: var(--md-sys-color-primary);
  --color-on-primary: var(--md-sys-color-on-primary);
  --color-secondary: var(--md-sys-color-secondary);
  --color-on-secondary: var(--md-sys-color-on-secondary);
  --color-background: var(--md-sys-color-background);
  --color-on-background: var(--md-sys-color-on-background);
  --color-surface: var(--md-sys-color-surface);
  --color-on-surface: var(--md-sys-color-on-surface);
  --color-surface-container: var(--md-sys-color-surface-container);
  --color-outline: var(--md-sys-color-outline);
  --color-error: var(--md-sys-color-error);
  --color-on-error: var(--md-sys-color-on-error);
}

body {
  margin: 0;
  font-family: 'Roboto', system-ui, sans-serif;
}
```

- [ ] **Step 4: Point `main.tsx` at the new stylesheet**

Read `src/main.tsx`. Change the `import './index.css'` line to:

```ts
import './app/styles/index.css'
```

Leave the rest of `main.tsx` (the default `<App />` render) untouched for now — Task 8 rewrites it fully.

- [ ] **Step 5: Add Roboto + Material Symbols fonts and update the title**

Read `index.html`. Change `<title>Vite + React + TS</title>` to `<title>eduFlow</title>`, and add inside `<head>`, before `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
```

- [ ] **Step 6: Verify**

```bash
npm run build
grep -o "box-sizing" dist/assets/*.css | head -1
```

Expected: build exits 0, and the `grep` prints `box-sizing` (confirms Tailwind's preflight reset made it into the compiled CSS).

- [ ] **Step 7: Commit**

```bash
git add vite.config.ts src/app/styles src/main.tsx index.html
git commit -m "Add Tailwind v4 and Material Design 3 baseline theme"
```

---

### Task 4: Shared layer — env config and Material Web UI wrappers

**Files:**
- Create: `src/shared/config/env.ts`
- Create: `.env.example`
- Modify: `src/vite-env.d.ts` (type the custom env var)
- Create: `src/shared/ui/material/filled-button.ts`
- Create: `src/shared/ui/material/outlined-button.ts`
- Create: `src/shared/ui/material/text-button.ts`
- Create: `src/shared/ui/material/outlined-text-field.ts`
- Create: `src/shared/ui/material/circular-progress.ts`
- Create: `src/shared/ui/Button/Button.tsx`, `src/shared/ui/Button/index.ts`
- Create: `src/shared/ui/TextField/TextField.tsx`, `src/shared/ui/TextField/index.ts`
- Create: `src/shared/ui/Card/Card.tsx`, `src/shared/ui/Card/index.ts`
- Create: `src/shared/ui/Spinner/Spinner.tsx`, `src/shared/ui/Spinner/index.ts`
- Create: `src/shared/ui/index.ts`

**Interfaces:**
- Consumes: Task 2's installed `@material/web`/`lit`/`@lit/react`; Task 3's `--md-sys-color-*` / `bg-*`/`text-*` Tailwind tokens.
- Produces (all re-exported from `src/shared/ui/index.ts`):
  - `Button({ variant?: 'filled' | 'outlined' | 'text', disabled?: boolean, onClick?: MouseEventHandler, children: ReactNode })`
  - `TextField({ label: string, value: string, onChange: (value: string) => void, type?: 'text' | 'email' | 'password', required?: boolean, errorText?: string })`
  - `Card({ children: ReactNode, className?: string })`
  - `Spinner({ label?: string })`
  - `API_BASE_URL: string` from `src/shared/config/env.ts` (not re-exported through `shared/ui` — imported directly as `@/shared/config/env`).

- [ ] **Step 1: `shared/config/env.ts` and its env typing**

Create `src/shared/config/env.ts`:

```ts
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'https://api.example.com'
```

Create `.env.example` at the repo root:

```
VITE_API_BASE_URL=https://api.example.com
```

Read `src/vite-env.d.ts` and replace its contents with:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

- [ ] **Step 2: Material Web wrapper files**

Each file registers one custom element (side-effect import) and wraps it with `@lit/react`'s `createComponent` so React can pass typed props/events. (Only the elements actually consumed by `Button`, `TextField`, and `Spinner` below are wrapped here — no icon/icon-button wrapper, since nothing in this plan renders an icon; add one later the same way if a page ever needs it.)

Create `src/shared/ui/material/filled-button.ts`:

```ts
import { createComponent } from '@lit/react'
import { MdFilledButton as MdFilledButtonElement } from '@material/web/button/filled-button.js'
import React from 'react'

export const MdFilledButton = createComponent({
  tagName: 'md-filled-button',
  elementClass: MdFilledButtonElement,
  react: React,
  events: { onClick: 'click' },
})
```

Create `src/shared/ui/material/outlined-button.ts`:

```ts
import { createComponent } from '@lit/react'
import { MdOutlinedButton as MdOutlinedButtonElement } from '@material/web/button/outlined-button.js'
import React from 'react'

export const MdOutlinedButton = createComponent({
  tagName: 'md-outlined-button',
  elementClass: MdOutlinedButtonElement,
  react: React,
  events: { onClick: 'click' },
})
```

Create `src/shared/ui/material/text-button.ts`:

```ts
import { createComponent } from '@lit/react'
import { MdTextButton as MdTextButtonElement } from '@material/web/button/text-button.js'
import React from 'react'

export const MdTextButton = createComponent({
  tagName: 'md-text-button',
  elementClass: MdTextButtonElement,
  react: React,
  events: { onClick: 'click' },
})
```

Create `src/shared/ui/material/outlined-text-field.ts`:

```ts
import { createComponent } from '@lit/react'
import { MdOutlinedTextField as MdOutlinedTextFieldElement } from '@material/web/textfield/outlined-text-field.js'
import React from 'react'

export const MdOutlinedTextField = createComponent({
  tagName: 'md-outlined-text-field',
  elementClass: MdOutlinedTextFieldElement,
  react: React,
  events: { onInput: 'input', onChange: 'change' },
})
```

Create `src/shared/ui/material/circular-progress.ts`:

```ts
import { createComponent } from '@lit/react'
import { MdCircularProgress as MdCircularProgressElement } from '@material/web/progress/circular-progress.js'
import React from 'react'

export const MdCircularProgress = createComponent({
  tagName: 'md-circular-progress',
  elementClass: MdCircularProgressElement,
  react: React,
})
```

**If any of these five imports fails to resolve** (`Cannot find module '@material/web/...'`), the file moved — run `find node_modules/@material/web -iname "*<component>*"` to find the real path and fix the import; the wrapper shape (`createComponent` call) stays the same.

- [ ] **Step 3: `Button`**

Create `src/shared/ui/Button/Button.tsx`:

```tsx
import type { ReactNode, MouseEventHandler } from 'react'
import { MdFilledButton } from '../material/filled-button'
import { MdOutlinedButton } from '../material/outlined-button'
import { MdTextButton } from '../material/text-button'

export type ButtonVariant = 'filled' | 'outlined' | 'text'

interface ButtonProps {
  variant?: ButtonVariant
  disabled?: boolean
  onClick?: MouseEventHandler
  children: ReactNode
}

export function Button({ variant = 'filled', disabled, onClick, children }: ButtonProps) {
  if (variant === 'outlined') {
    return (
      <MdOutlinedButton disabled={disabled} onClick={onClick}>
        {children}
      </MdOutlinedButton>
    )
  }
  if (variant === 'text') {
    return (
      <MdTextButton disabled={disabled} onClick={onClick}>
        {children}
      </MdTextButton>
    )
  }
  return (
    <MdFilledButton disabled={disabled} onClick={onClick}>
      {children}
    </MdFilledButton>
  )
}
```

Create `src/shared/ui/Button/index.ts`:

```ts
export { Button } from './Button'
export type { ButtonVariant } from './Button'
```

- [ ] **Step 4: `TextField`**

Create `src/shared/ui/TextField/TextField.tsx`:

```tsx
import { MdOutlinedTextField } from '../material/outlined-text-field'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  required?: boolean
  errorText?: string
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  required,
  errorText,
}: TextFieldProps) {
  return (
    <div className="w-full">
      <MdOutlinedTextField
        label={label}
        value={value}
        type={type}
        required={required}
        error={Boolean(errorText)}
        errorText={errorText ?? ''}
        onInput={(event: Event) => onChange((event.target as HTMLElement & { value: string }).value)}
      />
    </div>
  )
}
```

Create `src/shared/ui/TextField/index.ts`:

```ts
export { TextField } from './TextField'
```

- [ ] **Step 5: `Card` and `Spinner`**

Create `src/shared/ui/Card/Card.tsx`:

```tsx
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-xl p-6 shadow-sm bg-surface-container text-on-surface ${className}`}>
      {children}
    </div>
  )
}
```

Create `src/shared/ui/Card/index.ts`:

```ts
export { Card } from './Card'
```

Create `src/shared/ui/Spinner/Spinner.tsx`:

```tsx
import { MdCircularProgress } from '../material/circular-progress'

interface SpinnerProps {
  label?: string
}

export function Spinner({ label = 'Yuklanmoqda…' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-4" role="status">
      <MdCircularProgress indeterminate />
      <span className="text-on-surface">{label}</span>
    </div>
  )
}
```

Create `src/shared/ui/Spinner/index.ts`:

```ts
export { Spinner } from './Spinner'
```

- [ ] **Step 6: Barrel export**

Create `src/shared/ui/index.ts`:

```ts
export { Button } from './Button'
export type { ButtonVariant } from './Button'
export { TextField } from './TextField'
export { Card } from './Card'
export { Spinner } from './Spinner'
```

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: exits 0. (Nothing imports these yet, so `npm run build` alone wouldn't catch dead-code type errors — `tsc --noEmit` type-checks every file in `include` regardless of whether it's imported.)

- [ ] **Step 8: Commit**

```bash
git add .env.example src/vite-env.d.ts src/shared
git commit -m "Add shared env config and Material Web UI wrappers"
```

### Task 5: `entities/user` — model, auth hook, mock API

**Files:**
- Create: `src/entities/user/model/types.ts`
- Create: `src/entities/user/model/userStore.ts`
- Create: `src/entities/user/lib/useAuth.ts`
- Create: `src/entities/user/api/requests.ts`
- Create: `src/entities/user/api/queries.ts`
- Create: `src/entities/user/index.ts`

**Interfaces:**
- Consumes: Task 2's `zustand` and `@tanstack/react-query`.
- Produces (all re-exported from `src/entities/user/index.ts`):
  - `useAuth(): { user: User | null, isAuthenticated: boolean, login: (user: User) => void, logout: () => void }`
  - `useLoginMutation()` — TanStack `useMutation` result; `.mutate({ email, password }, { onSuccess: (user: User) => void })`
  - `useRegisterMutation()` — `.mutate({ name, email, password }, { onSuccess: (user: User) => void })`
  - `useProfileStatsQuery()` — TanStack `useQuery` result with `.data?: ProfileStats`, `.isLoading: boolean`
  - types `User { id: string, name: string, email: string }` and `ProfileStats { coursesCompleted: number, hoursLearned: number, streakDays: number }`

- [ ] **Step 1: Types**

Create `src/entities/user/model/types.ts`:

```ts
export interface User {
  id: string
  name: string
  email: string
}
```

- [ ] **Step 2: Zustand store with persistence**

Create `src/entities/user/model/userStore.ts`:

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from './types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'eduflow-auth' },
  ),
)
```

- [ ] **Step 3: `useAuth` selector hook**

Create `src/entities/user/lib/useAuth.ts`:

```ts
import { useAuthStore } from '../model/userStore'

export function useAuth() {
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  return { user, isAuthenticated, login, logout }
}
```

- [ ] **Step 4: Mock requests**

Create `src/entities/user/api/requests.ts`:

```ts
import type { User } from '../model/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface ProfileStats {
  coursesCompleted: number
  hoursLearned: number
  streakDays: number
}

function delay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

// Demo/mock only — swap these bodies for real `fetch` calls against
// `API_BASE_URL` (see src/shared/config/env.ts) once a backend exists. The
// signatures below are what the rest of the app depends on, so keep them
// stable when doing that swap.
export async function loginRequest(payload: LoginPayload): Promise<User> {
  return delay({
    id: 'demo-user-1',
    name: payload.email.split('@')[0],
    email: payload.email,
  })
}

export async function registerRequest(payload: RegisterPayload): Promise<User> {
  return delay({
    id: 'demo-user-1',
    name: payload.name,
    email: payload.email,
  })
}

export async function fetchProfileStats(): Promise<ProfileStats> {
  return delay({
    coursesCompleted: 4,
    hoursLearned: 37,
    streakDays: 12,
  })
}
```

- [ ] **Step 5: TanStack Query hooks**

Create `src/entities/user/api/queries.ts`:

```ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { loginRequest, registerRequest, fetchProfileStats } from './requests'
import type { LoginPayload, RegisterPayload } from './requests'

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerRequest(payload),
  })
}

export function useProfileStatsQuery() {
  return useQuery({
    queryKey: ['profile-stats'],
    queryFn: fetchProfileStats,
  })
}
```

- [ ] **Step 6: Public API barrel**

Create `src/entities/user/index.ts`:

```ts
export { useAuth } from './lib/useAuth'
export { useLoginMutation, useRegisterMutation, useProfileStatsQuery } from './api/queries'
export type { User } from './model/types'
export type { ProfileStats } from './api/requests'
```

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: exits 0.

- [ ] **Step 8: Commit**

```bash
git add src/entities
git commit -m "Add entities/user: auth store, useAuth hook, mock API"
```

---

### Task 6: `features/auth` — login, register, logout

**Files:**
- Create: `src/features/auth/login-by-credentials/ui/LoginForm.tsx`, `.../index.ts`
- Create: `src/features/auth/register-account/ui/RegisterForm.tsx`, `.../index.ts`
- Create: `src/features/auth/logout/ui/LogoutButton.tsx`, `.../index.ts`

**Interfaces:**
- Consumes: Task 4's `Button`/`TextField` (`@/shared/ui`); Task 5's `useAuth`/`useLoginMutation`/`useRegisterMutation` (`@/entities/user`); `useNavigate` from `react-router-dom` (Task 2).
- Produces: `LoginForm` (`@/features/auth/login-by-credentials`), `RegisterForm` (`@/features/auth/register-account`), `LogoutButton` (`@/features/auth/logout`) — all zero-prop components.

- [ ] **Step 1: `LoginForm`**

Create `src/features/auth/login-by-credentials/ui/LoginForm.tsx`:

```tsx
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@/shared/ui'
import { useAuth, useLoginMutation } from '@/entities/user'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const loginMutation = useLoginMutation()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (user) => {
          login(user)
          navigate('/', { replace: true })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <TextField label="Parol" type="password" value={password} onChange={setPassword} required />
      <Button variant="filled">{loginMutation.isPending ? 'Kirilmoqda…' : 'Kirish'}</Button>
    </form>
  )
}
```

Create `src/features/auth/login-by-credentials/index.ts`:

```ts
export { LoginForm } from './ui/LoginForm'
```

- [ ] **Step 2: `RegisterForm`**

Create `src/features/auth/register-account/ui/RegisterForm.tsx`:

```tsx
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@/shared/ui'
import { useAuth, useRegisterMutation } from '@/entities/user'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const registerMutation = useRegisterMutation()
  const navigate = useNavigate()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: (user) => {
          login(user)
          navigate('/', { replace: true })
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <TextField label="Ism" value={name} onChange={setName} required />
      <TextField label="Email" type="email" value={email} onChange={setEmail} required />
      <TextField label="Parol" type="password" value={password} onChange={setPassword} required />
      <Button variant="filled">
        {registerMutation.isPending ? "Ro'yxatdan o'tilmoqda…" : "Ro'yxatdan o'tish"}
      </Button>
    </form>
  )
}
```

Create `src/features/auth/register-account/index.ts`:

```ts
export { RegisterForm } from './ui/RegisterForm'
```

- [ ] **Step 3: `LogoutButton`**

Create `src/features/auth/logout/ui/LogoutButton.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui'
import { useAuth } from '@/entities/user'

export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Button variant="text" onClick={handleLogout}>
      Chiqish
    </Button>
  )
}
```

Create `src/features/auth/logout/index.ts`:

```ts
export { LogoutButton } from './ui/LogoutButton'
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/features
git commit -m "Add auth features: LoginForm, RegisterForm, LogoutButton"
```

### Task 7: Widgets and pages

**Files:**
- Create: `src/widgets/navbar/ui/Navbar.tsx`, `.../index.ts`
- Create: `src/widgets/auth-layout/ui/AuthLayout.tsx`, `.../index.ts`
- Create: `src/pages/home/ui/HomePage.tsx`, `.../index.ts`
- Create: `src/pages/login/ui/LoginPage.tsx`, `.../index.ts`
- Create: `src/pages/register/ui/RegisterPage.tsx`, `.../index.ts`
- Create: `src/pages/profile/ui/ProfilePage.tsx`, `.../index.ts`
- Create: `src/pages/not-found/ui/NotFoundPage.tsx`, `.../index.ts`

**Interfaces:**
- Consumes: Task 4's `Card`/`Spinner` (`@/shared/ui`); Task 5's `useAuth`/`useProfileStatsQuery` (`@/entities/user`); Task 6's `LoginForm`/`RegisterForm`/`LogoutButton`; `NavLink`/`Outlet`/`Link` from `react-router-dom`.
- Produces: `Navbar` and `AuthLayout` — both layout-route components (no props; render `<Outlet />` internally, used directly as a route's `element` in Task 8's router tree). `HomePage`, `LoginPage`, `RegisterPage`, `ProfilePage`, `NotFoundPage` — zero-prop page components.

- [ ] **Step 1: `Navbar` (private layout)**

Create `src/widgets/navbar/ui/Navbar.tsx`:

```tsx
import { NavLink, Outlet } from 'react-router-dom'
import { LogoutButton } from '@/features/auth/logout'
import { useAuth } from '@/entities/user'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-full text-sm ${isActive ? 'bg-primary text-on-primary' : 'text-on-surface'}`

export function Navbar() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <nav className="flex items-center justify-between px-6 py-3 bg-surface-container">
        <span className="text-lg font-medium">eduFlow</span>
        <div className="flex items-center gap-2">
          <NavLink to="/" end className={linkClass}>
            Bosh sahifa
          </NavLink>
          <NavLink to="/profile" className={linkClass}>
            Profil
          </NavLink>
          {user ? <span className="px-2 text-sm opacity-70">{user.name}</span> : null}
          <LogoutButton />
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
```

Create `src/widgets/navbar/index.ts`:

```ts
export { Navbar } from './ui/Navbar'
```

- [ ] **Step 2: `AuthLayout` (public layout)**

Create `src/widgets/auth-layout/ui/AuthLayout.tsx`:

```tsx
import { Outlet } from 'react-router-dom'
import { Card } from '@/shared/ui'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card>
          <Outlet />
        </Card>
      </div>
    </div>
  )
}
```

Create `src/widgets/auth-layout/index.ts`:

```ts
export { AuthLayout } from './ui/AuthLayout'
```

- [ ] **Step 3: `HomePage`**

Create `src/pages/home/ui/HomePage.tsx`:

```tsx
import { useAuth } from '@/entities/user'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-medium">Xush kelibsiz{user ? `, ${user.name}` : ''}!</h1>
      <p className="text-on-surface opacity-80">
        Bu — eduFlow ilovasining bosh sahifasi. FSD tuzilmasi va routing shu yerdan boshlanadi.
      </p>
    </div>
  )
}
```

Create `src/pages/home/index.ts`:

```ts
export { HomePage } from './ui/HomePage'
```

- [ ] **Step 4: `LoginPage` and `RegisterPage`**

Create `src/pages/login/ui/LoginPage.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth/login-by-credentials'

export function LoginPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Kirish</h1>
      <LoginForm />
      <p className="text-sm text-center">
        Akkountingiz yo'qmi?{' '}
        <Link to="/register" className="text-primary">
          Ro'yxatdan o'ting
        </Link>
      </p>
    </div>
  )
}
```

Create `src/pages/login/index.ts`:

```ts
export { LoginPage } from './ui/LoginPage'
```

Create `src/pages/register/ui/RegisterPage.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/register-account'

export function RegisterPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Ro'yxatdan o'tish</h1>
      <RegisterForm />
      <p className="text-sm text-center">
        Akkountingiz bormi?{' '}
        <Link to="/login" className="text-primary">
          Kiring
        </Link>
      </p>
    </div>
  )
}
```

Create `src/pages/register/index.ts`:

```ts
export { RegisterPage } from './ui/RegisterPage'
```

- [ ] **Step 5: `ProfilePage`**

Create `src/pages/profile/ui/ProfilePage.tsx`:

```tsx
import { useProfileStatsQuery, useAuth } from '@/entities/user'
import { Spinner, Card } from '@/shared/ui'

export function ProfilePage() {
  const { user } = useAuth()
  const { data, isLoading } = useProfileStatsQuery()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-medium">Profil</h1>
      <p>{user?.email}</p>
      {isLoading ? (
        <Spinner label="Statistika yuklanmoqda…" />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <p className="text-sm opacity-70">Kurslar</p>
            <p className="text-2xl">{data?.coursesCompleted}</p>
          </Card>
          <Card>
            <p className="text-sm opacity-70">Soatlar</p>
            <p className="text-2xl">{data?.hoursLearned}</p>
          </Card>
          <Card>
            <p className="text-sm opacity-70">Streak</p>
            <p className="text-2xl">{data?.streakDays}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
```

Create `src/pages/profile/index.ts`:

```ts
export { ProfilePage } from './ui/ProfilePage'
```

- [ ] **Step 6: `NotFoundPage`**

Create `src/pages/not-found/ui/NotFoundPage.tsx`:

```tsx
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-on-surface">
      <h1 className="text-3xl font-medium">404</h1>
      <p>Sahifa topilmadi.</p>
      <Link to="/" className="text-primary">
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
```

Create `src/pages/not-found/index.ts`:

```ts
export { NotFoundPage } from './ui/NotFoundPage'
```

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit -p tsconfig.app.json
```

Expected: exits 0.

- [ ] **Step 8: Commit**

```bash
git add src/widgets src/pages
git commit -m "Add Navbar/AuthLayout widgets and Home/Login/Register/Profile/NotFound pages"
```

---

### Task 8: Routing, providers, and final wiring

**Files:**
- Create: `src/app/routes/paths.ts`
- Create: `src/app/routes/PrivateRoute.tsx`
- Create: `src/app/routes/PublicRoute.tsx`
- Create: `src/app/routes/router.tsx`
- Create: `src/app/providers/QueryProvider.tsx`, `src/app/providers/index.ts`
- Create: `src/app/App.tsx`
- Modify: `src/main.tsx`
- Delete: `src/App.tsx`, `src/App.css`, `src/index.css`, `src/assets/react.svg` (default Vite template files, now fully replaced)

**Interfaces:**
- Consumes: Task 5's `useAuth`; Task 7's `Navbar`, `AuthLayout`, `HomePage`, `LoginPage`, `RegisterPage`, `ProfilePage`, `NotFoundPage`; Task 2's `@tanstack/react-query` and `@tanstack/react-query-devtools`.
- Produces: `App` (`src/app/App.tsx`, default export via named export `App`), rendered by `main.tsx`. This is the top of the tree — nothing later consumes it.

- [ ] **Step 1: Route paths**

Create `src/app/routes/paths.ts`:

```ts
export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
} as const
```

- [ ] **Step 2: Guards**

Create `src/app/routes/PrivateRoute.tsx`:

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/entities/user'
import { paths } from './paths'

export function PrivateRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to={paths.login} replace />
}
```

Create `src/app/routes/PublicRoute.tsx`:

```tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/entities/user'
import { paths } from './paths'

export function PublicRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to={paths.home} replace /> : <Outlet />
}
```

- [ ] **Step 3: Router tree**

Create `src/app/routes/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ProfilePage } from '@/pages/profile'
import { NotFoundPage } from '@/pages/not-found'
import { Navbar } from '@/widgets/navbar'
import { AuthLayout } from '@/widgets/auth-layout'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import { paths } from './paths'

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: paths.login, element: <LoginPage /> },
          { path: paths.register, element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <Navbar />,
        children: [
          { path: paths.home, element: <HomePage /> },
          { path: paths.profile, element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
```

- [ ] **Step 4: Query provider**

Create `src/app/providers/QueryProvider.tsx`:

```tsx
import { useState } from 'react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={client}>
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}
```

Create `src/app/providers/index.ts`:

```ts
export { QueryProvider } from './QueryProvider'
```

- [ ] **Step 5: `App` root**

Create `src/app/App.tsx`:

```tsx
import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './providers'
import { router } from './routes/router'

export function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  )
}
```

- [ ] **Step 6: Wire up `main.tsx` and delete the old default files**

Read `src/main.tsx`, then replace its contents with:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './app/styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Delete the now-unused default template files:

```bash
rm src/App.tsx src/App.css src/index.css
rm -rf src/assets
```

- [ ] **Step 7: Build verification**

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Expected: both exit 0.

- [ ] **Step 8: Manual dev-server verification**

Run `npm run dev`, open the printed local URL, and walk through the spec's success criteria one by one:

1. Navigating to `/` redirects to `/login` (not authenticated yet).
2. On `/login`, enter any email/password and submit — the button shows "Kirilmoqda…" briefly (mock delay), then redirects to `/` and the Navbar appears with your name.
3. Refresh the page (`F5`) — you stay logged in (Zustand `persist` restored from `localStorage`).
4. Click "Profil" in the Navbar — `/profile` loads, briefly shows the `Spinner`, then shows three stat cards.
5. Click "Chiqish" — redirects to `/login`, and navigating back to `/` bounces you to `/login` again.
6. Visit a nonexistent path, e.g. `/xyz` — the 404 page renders.
7. On `/login` while already authenticated (log in again, then manually navigate the browser to `/login`) — you're redirected straight to `/`.

Stop the dev server once all seven checks pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Wire up routing, providers, and app entry point"
```

---

## Plan Self-Review Notes

- **Spec coverage:** every file in the spec's FSD tree has a creating task, except `shared/lib/useAuth.ts`, which was relocated to `entities/user/lib/useAuth.ts` — see the Global Constraints deviation note above (the original placement broke the spec's own layer rule). All five spec pages, both widgets, the three auth features, the Zustand store with `persist`, both TanStack Query hooks (mutation in Login/Register, query in Profile), the `@theme` Tailwind↔M3 bridge, and all seven success criteria (Task 8 Step 8) are each covered by a specific task.
- **Placeholder scan:** no TBD/TODO; every step shows complete file contents, not descriptions.
- **Type consistency check:** `User { id, name, email }` (Task 5) is the same shape used in `loginRequest`/`registerRequest` return values (Task 5) and read in `HomePage`/`Navbar`/`ProfilePage` (Task 7) as `user.name`/`user.email`. `ProfileStats { coursesCompleted, hoursLearned, streakDays }` (Task 5) matches the fields read in `ProfilePage` (Task 7). `useAuth()`'s returned shape (`user`, `isAuthenticated`, `login`, `logout`) matches every call site (`PrivateRoute`, `PublicRoute`, `LoginForm`, `RegisterForm`, `LogoutButton`, `Navbar`, `HomePage`, `ProfilePage`).

