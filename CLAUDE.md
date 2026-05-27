# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://127.0.0.1:3000
npm run build      # tsc + vite build
npm run lint       # eslint (coverage/ and dist/ excluded)
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

React 18 + TypeScript SPA using Spotify Web API with PKCE OAuth.

**Provider stack** (`App.tsx`): `QueryClientProvider` → `AuthProvider` → `RouterProvider` → `ThemeProvider`

**State layers:**

- Server state: TanStack Query (5 min stale time, 1 retry)
- Client state: Zustand — `usePlayerStore` (device_id, player state), `useContentStore` (current tab, search query)
- Auth state: `AuthProvider` context with `useState` + localStorage
- Theme state: `ThemeProvider` context with `useReducer` (actions: SET, TOGGLE) + localStorage — applied to `document.documentElement` before first render (avoids flash)
- Language: i18next + localStorage (`"language"` key) — persisted via `i18n.on("languageChanged")` event in `i18n.service.ts`

**Routing** (`src/app/`): React Router v6 browser router. All pages lazy-loaded with `Suspense`/`PageLoader`. `ProtectedRoute` wraps all authenticated routes. Route tree:

- `/` → Dashboard (protected, layout shell)
  - `playlist/:id`, `album/:id`, `artist/:id`, `profile`, `settings`
- `/login` → Login

**Path alias:** `@` → `src/`

**UI:** shadcn/ui (`base-nova` style), Tailwind CSS v4 via `@tailwindcss/vite`, Lucide icons. Add shadcn components with `npx shadcn add <component>`.

## Authentication

PKCE flow implemented in `src/services/auth.service.ts`:

1. `redirectToSpotifyAuthorize()` — generates `code_verifier` + `code_challenge` (SHA-256 via Web Crypto API), stores verifier in localStorage, redirects to Spotify
2. `getToken(code)` — exchanges code for `access_token` + `refresh_token`
3. `getRefreshToken(refreshToken)` — refreshes expired tokens
4. `useAuthToken` hook manages automatic refresh and token storage
5. `useSpotifyApi` injects token into all requests via Axios instance

`REQUIRED_SCOPES` list in `auth.service.ts` contains all Spotify API scopes.

## API Layer

All Spotify API calls go through service classes in `src/api/`:

- `AlbumService` — album detail, tracks, saved albums
- `ArtistService` — artist, top tracks, albums, followed artists, follow/unfollow
- `BrowseService` — categories, featured playlists, new releases
- `PlaybackService` — current playback, currently playing, devices, play/pause/seek/skip
- `PlaylistService` — user playlists, playlist detail
- `SearchService` — search with limit/offset support
- `TrackService` — track detail, saved tracks
- `UserService` — current user profile

All services extend `SpotifyApiClient` (base Axios instance with auth header injection).

## React Query Hooks

All server state goes through `src/hooks/useSpotifyQueries.ts`:

- `useSearchQuery(query, types, limit)` — standard search
- `useInfiniteSearchQuery(query, types, limit)` — infinite scroll search (offset-based, uses `next` URL from Spotify response to get next page param)
- `useInfiniteFollowedArtists(limit)` — cursor-based infinite scroll (uses `after` param from `next` URL)
- `useArtist`, `useArtistAlbums`, `useArtistTopTracks`
- `useAlbum`, `useAlbumTracks`
- `useFeaturedPlaylists`, `useMadeForYouPlaylists`
- `useCurrentPlayback`, `useCurrentlyPlaying`, `useAvailableDevices`
- `useTopArtists`, `useFollowedArtists`
- `useSavedTracks`, `useSavedAlbums`

Mutations in `src/hooks/useSpotifyMutations.ts`: `usePlaybackControls` (play/pause/seek/next/prev/volume).

## Custom Hooks

- `useIntersectionObserver(callback, options?)` — wraps `IntersectionObserver` API, returns `ref` to attach to sentinel element. Used for infinite scroll.
- `useCarouselScroll(items)` — manages horizontal scroll state (canScrollLeft, canScrollRight, scroll fn) for playlist carousels
- `useSpotifyPlayer()` — initializes Spotify Web Playback SDK, manages player state
- `useTheme()` — reads theme from ThemeContext, exposes `theme` and `toggleTheme`
- `useAuth()` — reads auth state, exposes `login`, `logout`, `isAuthenticated`

## Theme System

Two themes: `dark` (default) and `light`.

CSS custom properties defined in `src/index.css`:

- `--color-bg`, `--color-surface`, `--color-surface-hover` — backgrounds
- `--color-accent`, `--color-accent-muted` — green accent
- `--color-hero-start`, `--color-hero-album-start` — gradient start colors for artist/album detail pages
- `--color-text`, `--color-text-muted` — text colors
- `--color-border` — borders

Both light and dark variants defined. ThemeProvider applies `.dark` or `.light` class to `<html>`.
Skeletons use `bg-muted` (shadcn token) and `bg-[var(--color-bg)]` / `bg-[linear-gradient(...,var(--color-hero-start),...)]` — NOT hardcoded hex values.

## Internationalisation

Two languages: `pt` (default) and `en`. Configured in `src/services/i18n.service.ts`.

Translation files: `src/utils/texts/texts.pt.json` and `texts.en.json`.

Key structure:

```
PAGES.LOGIN.*
PAGES.DASHBOARD.*
PAGES.ARTIST_DETAIL.*
PAGES.ALBUM_DETAIL.*
COMPONENTS.HEADER.*
COMPONENTS.SEARCH.*
COMPONENTS.ERROR_STATE.*
COMPONENTS.HOME.*
COMPONENTS.NAV_HEADER.*
```

Usage in components: `const { t } = useTranslation(); t("PAGES.LOGIN.loginButton")`.

Language persisted via `i18n.on("languageChanged")` → `localStorage.setItem("language", lng)`.
Init reads from localStorage: if no saved lang, defaults to `"pt"`.

## Dashboard Layout

Home (`/`) renders `MainPanel` which shows three sections:

1. `MadeForYouSection` — playlist carousel (search "for me")
2. `FeaturedPlaylistSection` — playlist carousel (search "featured")
3. `ArtistSection` — infinite scroll grid using `useInfiniteSearchQuery("top", ["artist"], 2)` with `IntersectionObserver` sentinel

Search mode (`MainContent.BROWSE`) replaces the home with `<Search />` (lazy loaded).

## Infinite Scroll Pattern

Sentinel element approach using `useIntersectionObserver`:

```tsx
const onIntersect = useCallback(() => {
  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

const sentinelRef = useIntersectionObserver(onIntersect);
// ...
<div ref={sentinelRef} className="h-4" />;
{
  isFetchingNextPage && <spinner />;
}
```

Offset-based pagination: `getNextPageParam` parses offset from `next` URL returned by Spotify.
Cursor-based pagination (followed artists): `getNextPageParam` parses `after` from `next` URL.

## Testing

Tests use Vitest + jsdom + Testing Library. Setup file: `tests/setup.ts` (runs `cleanup` after each test).

Tests co-locate under `src/**/tests/` or `src/**/__tests__/`.

**Critical:** `App.tsx` has module-scope side effects (env validation, `matchMedia` call). Test files that import App must stub `VITE_CLIENT_ID`, `VITE_REDIRECT_URI`, and `matchMedia` **before** the import — use dynamic `import()` after stubbing. See `src/app/tests/App.test.tsx` for the pattern.

Coverage thresholds: 60% lines/branches/functions/statements (configured in `vitest.config.ts`). Pre-commit hook runs full build + coverage — both must pass.

## ESLint

Config: `eslint.config.js` (flat config). Global ignores: `dist/`, `coverage/`.
Test files override: `@typescript-eslint/no-explicit-any` and `no-unused-vars` are OFF in test files.
`.d.ts` files override: `@typescript-eslint/no-explicit-any` is OFF.

## Deploy

Vercel is the target. `vercel.json` is configured with:

- `outputDirectory: "dist"`
- SPA rewrites (`/(.*) → /index.html`) so React Router works on all routes

Required environment variables in Vercel dashboard:

- `VITE_CLIENT_ID`
- `VITE_REDIRECT_URI` (must match the URL added to Spotify app's redirect URIs)

## Commits

Conventional commits enforced (`feat:`, `fix:`, `chore:`, etc.). Pre-commit runs `npm run build` and `npm run coverage`.
