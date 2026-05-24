# Spotify Web Player

> SPA React que consome a Spotify Web API com autenticação PKCE, player integrado, suporte a temas e internacionalização PT-BR / EN-US.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/fabinppk/web-spotify-demo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)

---

## Funcionalidades

- **Autenticação** via OAuth 2.0 PKCE — sem client secret exposto
- **Dashboard** com playlists em destaque, seção "Made For You" e listagem de artistas com infinite scroll
- **Detalhe de artista** — discografia em carrossel e botão de seguir
- **Detalhe de álbum** — tracklist completa com duração total
- **Busca** com infinite scroll — artistas e álbuns por demanda
- **Player Web Playback SDK** integrado (requer Spotify Premium)
- **Tema claro / escuro** — persiste no `localStorage`, aplicado antes do primeiro render (sem flash)
- **Internacionalização** PT-BR / EN-US — persiste no `localStorage`

---

## Stack

### Core

| Tecnologia      | Versão | Papel                           |
| --------------- | ------ | ------------------------------- |
| React           | 18.3   | UI framework                    |
| TypeScript      | 5.5    | Type safety                     |
| Vite            | 5.4    | Build tool e dev server         |
| React Router v6 | 6.26   | Roteamento SPA com lazy loading |

### Estado

| Tecnologia                 | Papel                                   |
| -------------------------- | --------------------------------------- |
| TanStack Query v5          | Server state — cache, stale time, retry |
| Zustand                    | Client state — player, content atual    |
| Context API + `useReducer` | Auth state e Theme state                |

### UI

| Tecnologia            | Papel                                                                |
| --------------------- | -------------------------------------------------------------------- |
| Tailwind CSS v4       | Utility-first CSS com tokens de tema via CSS custom properties       |
| shadcn/ui (base-nova) | Componentes acessíveis (Avatar, Button, Input, ScrollArea, Skeleton) |
| Lucide React          | Ícones                                                               |

### Outros

| Tecnologia               | Papel                             |
| ------------------------ | --------------------------------- |
| Axios                    | HTTP client                       |
| i18next + react-i18next  | Internacionalização PT-BR / EN-US |
| Spotify Web Playback SDK | Streaming in-browser              |

### Qualidade

| Tecnologia                 | Papel                               |
| -------------------------- | ----------------------------------- |
| Vitest + Testing Library   | Testes unitários e de componente    |
| ESLint + typescript-eslint | Linting                             |
| Prettier                   | Formatação                          |
| Husky                      | Git hooks (pre-commit e commit-msg) |
| commitlint                 | Conventional commits enforced       |

---

## Pré-requisitos

- **Node.js** 20+
- **npm** ou **yarn**
- Conta no **Spotify** (Premium para o player)
- App registrado no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

---

## Setup

### 1. Clone e instale

```bash
git clone https://github.com/fabinppk/web-spotify-demo.git
cd web-spotify-demo
npm install
```

### 2. Configure as variáveis de ambiente

Crie `.env` na raiz:

```env
VITE_CLIENT_ID=seu_client_id_aqui
VITE_REDIRECT_URI=http://127.0.0.1:3000/
```

> **Importante:** a `VITE_REDIRECT_URI` deve ser idêntica à URI cadastrada no Spotify Developer Dashboard. Em produção, substitua pelo domínio do deploy (ex: `https://seu-app.vercel.app/`).

### 3. Configure o Spotify App

No [Developer Dashboard](https://developer.spotify.com/dashboard), no seu app:

- **Redirect URIs**: adicione `http://127.0.0.1:3000/` (dev) e a URL de produção
- **APIs used**: marque **Web API** e **Web Playback SDK**

### 4. Rode

```bash
npm run dev
# → http://127.0.0.1:3000
```

---

## Scripts

```bash
npm run dev        # Dev server com HMR em http://127.0.0.1:3000
npm run build      # tsc + vite build → pasta dist/
npm run preview    # Preview do build de produção local
npm run lint       # ESLint em todos os arquivos
npm run test       # Vitest em modo watch
npm run coverage   # Vitest com relatório de cobertura (thresholds: 60%)
```

### Rodar um único arquivo de teste

```bash
npx vitest run src/app/tests/App.test.tsx
```

---

## Arquitetura

```
src/
├── api/              # Services da Spotify Web API (album, artist, browse, playback, search, track, user)
├── app/              # App.tsx, rotas, definições de rota
├── assets/           # SVGs e imagens
├── components/
│   ├── features/     # Componentes de domínio (Search, ArtistCard, PlaylistCard, TrackRow…)
│   ├── icons/        # Ícones customizados
│   ├── layout/       # Header, MainPanel
│   └── ui/           # Componentes genéricos (EmptyState, ErrorState, Skeleton, ScrollArrow…)
├── context/          # AuthContext + AuthProvider, ThemeContext + ThemeProvider
├── hooks/            # useAuthToken, useSpotifyApi, useSpotifyQueries, useSpotifyMutations,
│                     # useSpotifyPlayer, useTheme, useIntersectionObserver, useCarouselScroll
├── pages/            # Dashboard, Login, ArtistDetail, AlbumDetail
├── services/         # auth.service.ts (PKCE flow), i18n.service.ts
├── stores/           # usePlayerStore, useContentStore (Zustand)
├── types/            # Declarações globais: spotify.d.ts, theme.d.ts, playback.d.ts
└── utils/            # Helpers, enums, textos de tradução (PT/EN)
```

### Provider stack (`App.tsx`)

```
QueryClientProvider
  └── AuthProvider
        └── RouterProvider
              └── ThemeProvider
```

### Fluxo de autenticação (PKCE)

1. Usuário clica em "Entrar com Spotify"
2. `redirectToSpotifyAuthorize()` gera `code_verifier` → `code_challenge` (SHA-256 + base64url) via Web Crypto API
3. Redirect para `accounts.spotify.com/authorize`
4. Callback na raiz `/` → `getToken(code)` troca o code por `access_token` + `refresh_token`
5. `useAuthToken` gerencia refresh automático antes de expirar
6. `useSpotifyApi` injeta o token em todas as requisições via instância Axios

### Gerenciamento de estado

| Dado                        | Onde vive                             | Por quê                                    |
| --------------------------- | ------------------------------------- | ------------------------------------------ |
| Dados da API Spotify        | TanStack Query                        | Cache automático, deduplicação, stale time |
| Player (device_id, estado)  | Zustand `usePlayerStore`              | Acesso global sem prop drilling            |
| Conteúdo atual (aba, query) | Zustand `useContentStore`             | Simples, sem side effects                  |
| Tema                        | Context + `useReducer` + localStorage | Precisa aplicar classe no `<html>`         |
| Auth                        | Context + `useState` + localStorage   | Token compartilhado em toda a app          |
| Idioma                      | i18next + localStorage                | Padrão da lib                              |

---

## Temas

Dois temas disponíveis: **dark** (padrão) e **light**.

- Tokens definidos em `src/index.css` via CSS custom properties (`--color-bg`, `--color-surface`, `--color-accent`, `--color-hero-start`, etc.)
- `ThemeProvider` aplica `.dark` ou `.light` no `document.documentElement` antes do primeiro render — sem flash de conteúdo
- Toggle no `Header` via ícone ☀️/🌙
- Preferência salva em `localStorage` com chave `"theme"`

---

## Internacionalização

Idiomas suportados: **PT-BR** (padrão) e **EN-US**.

- Arquivos de tradução em `src/utils/texts/texts.pt.json` e `texts.en.json`
- Toggle no `Header` via ícone 🌐 + label `PT`/`EN`
- Preferência salva em `localStorage` com chave `"language"`
- Cobertura: Login, ArtistDetail, AlbumDetail, Search, ErrorState, NavHeader, seções Home

---

## Deploy

### Vercel (recomendado)

O projeto vem com `vercel.json` configurado:

```json
{
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

As rewrites garantem que o React Router funcione corretamente em todas as rotas.

**Passos:**

1. Conecte o repositório no [Vercel Dashboard](https://vercel.com)
2. Framework preset: **Vite**
3. Adicione as variáveis de ambiente:
   - `VITE_CLIENT_ID` → seu Spotify Client ID
   - `VITE_REDIRECT_URI` → `https://seu-dominio.vercel.app/`
4. No Spotify Developer Dashboard, adicione a URL de produção como Redirect URI

### Build manual

```bash
npm run build
# output em dist/ — sirva com qualquer servidor estático com suporte a SPA rewrites
```

---

## Git e Commits

### Hooks (Husky)

- **pre-commit**: executa `npm run build` + `npm run coverage` — commit bloqueado se falhar
- **commit-msg**: valida formato via `commitlint`

### Conventional Commits

```
<tipo>: <descrição curta>

Tipos: feat | fix | chore | refactor | test | docs | style | perf | ci
```

---

## Testes

```bash
npm run test       # watch mode
npm run coverage   # run + relatório de cobertura
```

- **Framework**: Vitest + jsdom
- **Utilities**: Testing Library (React, DOM, user-event)
- **Setup**: `tests/setup.ts` executa `cleanup` após cada teste
- **Cobertura mínima**: 60% (lines, branches, functions, statements)
- **Localização**: `src/**/tests/` ou `src/**/__tests__/`

> **Atenção:** `App.tsx` tem side effects no escopo do módulo (validação de env, `matchMedia`). Testes que importam App devem stubbar `VITE_CLIENT_ID`, `VITE_REDIRECT_URI` e `matchMedia` **antes** do import usando `import()` dinâmico. Ver `src/app/tests/App.test.tsx`.

---

## Variáveis de Ambiente

| Variável            | Obrigatória | Descrição                                                                 |
| ------------------- | ----------- | ------------------------------------------------------------------------- |
| `VITE_CLIENT_ID`    | ✅          | Client ID do app no Spotify Developer Dashboard                           |
| `VITE_REDIRECT_URI` | ✅          | URI de redirecionamento OAuth (deve ser idêntica à cadastrada no Spotify) |

> A ausência de qualquer uma delas lança erro em `App.tsx` na inicialização.
