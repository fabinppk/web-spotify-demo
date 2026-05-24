# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://127.0.0.1:3000
npm run build      # tsc + vite build
npm run lint       # eslint
npm run test       # vitest watch
npm run coverage   # vitest run with coverage report
```

Run a single test file:
```bash
npx vitest run src/app/tests/App.test.tsx
```

## Environment

Requires `.env` with:
- `VITE_CLIENT_ID` — Spotify app client ID
- `VITE_REDIRECT_URI` — OAuth redirect URI (must match `http://127.0.0.1:3000/`)

`App.tsx` throws at module scope if either is missing.

## Architecture

React 18 + TypeScript SPA using Spotify Web API.

**Provider stack** (`App.tsx`): `QueryClientProvider` → `AuthProvider` → `RouterProvider`

**State layers:**
- Server state: TanStack Query (5 min stale time, 1 retry)
- Client/auth state: Zustand + `AuthProvider` context (`src/context/AuthProvider`)
- Theme: persisted in `localStorage`, applied to `document.documentElement` before first render (avoids flash)

**Routing** (`src/app/`): React Router v6 browser router. All pages lazy-loaded with `Suspense`/`PageLoader`. `ProtectedRoute` wraps all authenticated routes. Route tree:
- `/` → Dashboard (protected, layout shell)
  - `playlist/:id`, `album/:id`, `artist/:id`, `profile`, `settings`
- `/login` → Login

**Path alias:** `@` → `src/`

**UI:** shadcn/ui (`base-nova` style), Tailwind CSS v4 via `@tailwindcss/vite`, Lucide icons. Add shadcn components with `npx shadcn add <component>`.

## Testing

Tests use Vitest + jsdom + Testing Library. Setup file: `tests/setup.ts` (runs `cleanup` after each test).

Tests co-locate under `src/**/tests/` or `src/**/__tests__/`.

**Critical:** `App.tsx` has module-scope side effects (env validation, `matchMedia` call). Test files that import App must stub `VITE_CLIENT_ID`, `VITE_REDIRECT_URI`, and `matchMedia` **before** the import — use dynamic `import()` after stubbing. See `src/app/tests/App.test.tsx` for the pattern.

Coverage thresholds: 60% lines/branches/functions/statements. Pre-commit hook runs full build + coverage — both must pass.

## Commits

Conventional commits enforced (`feat:`, `fix:`, `chore:`, etc.). Pre-commit runs `npm run build` and `npm run coverage`.
