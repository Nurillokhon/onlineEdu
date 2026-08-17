# React + Vite FSD Scaffold — Design

Date: 2026-08-13
Status: Approved

## Maqsad

`eduFlow` papkasida yangi React + Vite loyihasini scaffold qilish: Tailwind CSS,
TanStack Query, React Router DOM (`createBrowserRouter`, public/private route
bo'linishi), Material Design 3 (Material Web), Zustand o'rnatilgan va
Feature-Sliced Design (FSD) strukturasiga solingan holda.

Bu — kelajakdagi ilova uchun poydevor (skeleton). Real backend, real biznes
logika keyingi bosqichlarda ustiga qurilyapti.

## Qamrov (Scope)

Kiradi:
- Vite + React + TypeScript loyihasi
- Tailwind CSS v4 (`@tailwindcss/vite`)
- TanStack Query v5 (+ devtools, faqat dev muhitida)
- React Router DOM, `createBrowserRouter` bilan public/private route bo'linishi
- Material Web (`@material/web`) — `@lit/react` orqali tipizatsiyalangan React
  wrapper'lar bilan
- Zustand (auth state uchun, `persist` middleware bilan)
- FSD qatlamlari: `app / pages / widgets / features / entities / shared`
- Demo/mock auth oqimi: Login, Register, Logout, Private route guard
- Namuna sahifalar: Home, Login, Register, Profile, 404 (Not Found)
- Namuna widget: Navbar (private layout), AuthLayout (public layout)

Kirmaydi (keyingi bosqich):
- Real backend/API integratsiyasi (hozircha mock funksiyalar)
- Avtomatik test yozish (unit/e2e) — talab qilinmagan
- Dark mode toggle (theme tokenlar dark uchun ham tayyorlanadi, lekin
  UI'da almashtirish tugmasi yo'q)
- FSD import qoidalarini majburlovchi lint plagini (`steiger` va h.k.) —
  eslatma sifatida qoldiriladi, o'rnatilmaydi

## Texnologik qarorlar va sabablari

### Material Web + React integratsiyasi

`@material/web` — Lit asosidagi web-component'lar. React propslarni ko'pincha
attribute sifatida uzatadi, bu web-component property'lari bilan har doim ham
to'g'ri ishlamaydi (masalan, controlled `value`).

Yechim: Lit jamoasining rasmiy `@lit/react` paketidagi `createComponent()`
funksiyasi — web-component klassini tekshirib, propslarni to'g'ri property
sifatida, event'larni esa `onClick`/`onInput` kabi React konventsiyasida
uzatuvchi wrapper yaratadi. Har bir ishlatiladigan Material Web elementi uchun
shu tarzda bitta wrapper yoziladi (`shared/ui/material/*.ts`), so'ngra
`shared/ui/` ostida qulayroq API (`<Button variant="filled">`,
`<TextField label="Email">`) bilan qayta eksport qilinadi.

### Theming

Faqat `--md-sys-color-*` CSS custom property'lari `app/styles/material-theme.css`
faylida `:root` (light) va `.dark` yoki `@media (prefers-color-scheme: dark)`
(dark, tayyorlab qo'yiladi lekin ishlatilmaydi) uchun belgilanadi. Material Web
komponentlari typography/shape uchun ichki default qiymatlarga ega — ularni
qayta belgilash shart emas.

Boshlang'ich qiymatlar — Google Material Theme Builder'ning standart (baseline,
seed `#6750A4`) sxemasi. Bu faqat boshlang'ich nuqta: brend rangi kerak bo'lsa,
https://material-foundation.github.io/material-theme-builder/ orqali yangi
token'lar generatsiya qilib, shu faylga almashtiriladi.

### Tailwind ↔ M3 ko'prigi

Tailwind v4'ning CSS-first `@theme` blokida M3 ranglari Tailwind rang
utility'lariga bog'lanadi:

```css
@theme {
  --color-primary: var(--md-sys-color-primary);
  --color-on-primary: var(--md-sys-color-on-primary);
  --color-surface: var(--md-sys-color-surface);
  --color-on-surface: var(--md-sys-color-on-surface);
  --color-background: var(--md-sys-color-background);
  --color-outline: var(--md-sys-color-outline);
}
```

Printsip: Tailwind — layout/spacing (`flex`, `gap`, `p-4`) uchun; Material Web
komponentlari — o'z Shadow DOM'i ichidagi ko'rinish uchun (Tailwind class'lari
Shadow DOM ichiga kira olmaydi — bu kutilgan holat, muammo emas).

### Auth — demo/mock

Real backend yo'qligi sababli, `entities/user/api/userApi.ts`da
`setTimeout`-asosli soxta tarmoq so'rovlari yoziladi (login, register). Bu
funksiyalar TanStack Query'ning `useMutation` hook'lari ichida chaqiriladi —
muvaffaqiyatli bo'lganda Zustand `userStore`ga yoziladi. Kelajakda real API'ga
o'tishda faqat shu ikki funksiya ichini almashtirish kifoya, chaqiruvchi
kod (komponentlar) o'zgarmaydi.

`userStore` — Zustand `persist` middleware bilan (`localStorage`), shuning
uchun sahifa yangilansa ham login holati saqlanadi.

`ProfilePage`da qo'shimcha `useQuery` namunasi (soxta statistika) — TanStack
Query'ning query tomonini ham ko'rsatish uchun.

## Arxitektura — FSD papka strukturasi

```
src/
├── app/
│   ├── providers/
│   │   ├── QueryProvider.tsx      # QueryClientProvider + devtools (dev only)
│   │   └── index.ts
│   ├── routes/
│   │   ├── router.tsx              # createBrowserRouter daraxti
│   │   ├── PrivateRoute.tsx        # guard: auth yo'q -> /login
│   │   ├── PublicRoute.tsx         # guard: auth bor -> /
│   │   └── paths.ts                # route path konstantalari
│   ├── styles/
│   │   ├── index.css                # @import "tailwindcss"; + @theme bridge
│   │   └── material-theme.css        # M3 --md-sys-color-* tokenlar
│   └── App.tsx                       # provider'lar + RouterProvider
├── pages/
│   ├── home/{ui/HomePage.tsx, index.ts}
│   ├── login/{ui/LoginPage.tsx, index.ts}
│   ├── register/{ui/RegisterPage.tsx, index.ts}
│   ├── profile/{ui/ProfilePage.tsx, index.ts}
│   └── not-found/{ui/NotFoundPage.tsx, index.ts}
├── widgets/
│   ├── navbar/{ui/Navbar.tsx, index.ts}          # private layout uchun
│   └── auth-layout/{ui/AuthLayout.tsx, index.ts}  # public (login/register) uchun
├── features/
│   └── auth/
│       ├── login-by-credentials/{ui/LoginForm.tsx, index.ts}
│       ├── register-account/{ui/RegisterForm.tsx, index.ts}
│       └── logout/{ui/LogoutButton.tsx, index.ts}
├── entities/
│   └── user/
│       ├── model/{userStore.ts, types.ts, index.ts}   # zustand + persist
│       ├── api/{userApi.ts, index.ts}                  # mock login/register (mutation)
│       └── index.ts
├── shared/
│   ├── ui/
│   │   ├── material/            # @lit/react createComponent wrapper'lari
│   │   │   ├── filled-button.ts, outlined-button.ts, text-button.ts
│   │   │   ├── outlined-text-field.ts
│   │   │   ├── icon-button.ts, icon.ts
│   │   │   └── circular-progress.ts
│   │   ├── Button/{Button.tsx, index.ts}        # variant="filled|outlined|text"
│   │   ├── TextField/{TextField.tsx, index.ts}   # controlled value/onChange
│   │   ├── Card/{Card.tsx, index.ts}              # Tailwind+M3 token asosida div
│   │   ├── Spinner/{Spinner.tsx, index.ts}         # circular-progress wrapper
│   │   └── index.ts
│   ├── config/{env.ts, index.ts}
│   └── lib/{useAuth.ts, index.ts}                  # userStore'dan qulay selector hook
├── main.tsx
└── vite-env.d.ts
```

Qat'iy import qoidasi: `app → pages → widgets → features → entities → shared`.
Yuqori qatlam pastkisini import qiladi, hech qachon aksincha emas. Har bir
slice papkasi `index.ts` orqali public API'sini ochadi — tashqaridan slice
ichidagi fayllarga to'g'ridan-to'g'ri (`entities/user/model/userStore.ts`)
emas, balki `entities/user`dan import qilinadi.

Absolute import: `tsconfig.json` va `vite.config.ts`da `@/*` → `src/*` alias
sozlanadi (masalan `import { useAuth } from '@/shared/lib'`).

## Routing daraxti

```
createBrowserRouter([
  {
    element: <PublicRoute />,        // auth bor bo'lsa -> <Navigate to="/" />
    children: [
      { element: <AuthLayout />, children: [
        { path: '/login',    element: <LoginPage /> },
        { path: '/register', element: <RegisterPage /> },
      ]},
    ],
  },
  {
    element: <PrivateRoute />,       // auth yo'q bo'lsa -> <Navigate to="/login" />
    children: [
      { element: <Navbar />, children: [   // Navbar o'zi <nav> + <main><Outlet /></main> qaytaradi
        { path: '/',        element: <HomePage /> },
        { path: '/profile', element: <ProfilePage /> },
      ]},
    ],
  },
  { path: '*', element: <NotFoundPage /> },   // hammaga ochiq
])
```

`PrivateRoute`/`PublicRoute` — `entities/user`dagi `useAuthStore`ni o'qib,
`<Outlet />` yoki `<Navigate />` qaytaradigan layout-route komponentlar
(`app/routes/`da joylashadi, chunki bu routing infratuzilmasi — pages emas).
`Navbar` (`widgets/navbar`) va `AuthLayout` (`widgets/auth-layout`) ham xuddi
shunday — ikkalasi ham o'z ichida `<Outlet />` render qiladigan layout-route
sifatida ishlatiladi, alohida "MainLayout" widget'iga hojat yo'q.

## Paketlar

**dependencies:** `react-router-dom`, `@tanstack/react-query`, `zustand`,
`@material/web`, `lit`, `@lit/react`

**devDependencies:** `tailwindcss`, `@tailwindcss/vite`,
`@tanstack/react-query-devtools`

Versiyalar pin qilinmaydi — `npm install` orqali eng so'nggi barqaror
versiyalar o'rnatiladi (kutilayotgan major versiyalar: Tailwind v4, TanStack
Query v5, React Router v6/v7 — barchasida `createBrowserRouter` mavjud).

## Taxminlar (Assumptions)

- Loyiha tili: TypeScript
- Package manager: npm
- Til: barcha UI matnlari va kod izohlari ushbu hujjatdagi kabi minimal
  (interfeys matnlari ingliz yoki o'zbek bo'lishi muhim emas — scaffold
  bosqichida placeholder matnlar ishlatiladi)
- Git repo hali mavjud emas — scaffold boshida `git init` qilinadi va
  boshlang'ich commit yaratiladi

## Muvaffaqiyat mezoni (Success criteria)

- `npm run dev` xatosiz ishga tushadi, `/login` sahifasi ochiladi (auth yo'q
  bo'lgani uchun `/` dan redirect bo'ladi)
- Login form orqali (istalgan email/parol bilan, chunki mock) tizimga kirilsa,
  `/` ga redirect bo'ladi va Navbar ko'rinadi
- Sahifani yangilashda (`F5`) login holati saqlanadi (Zustand persist)
- Logout bosilsa `/login`ga qaytariladi
- `/profile`da mock statistika `useQuery` orqali (qisqa loading holati bilan)
  ko'rsatiladi
- Noto'g'ri manzilga kirilsa (masalan `/xyz`) 404 sahifa ko'rinadi
- `npm run build` xatosiz TypeScript va Vite build'ini yakunlaydi
