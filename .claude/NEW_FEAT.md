# Novas Features — Baseadas no projeto de referência

> Análise comparativa entre `spotify-fulldemo` (nosso) e `react-typescript-spotify` (referência).
> Listadas apenas features que existem na referência e não existem aqui.

---

## Estratégia de branches

**Commit de referência:** `83c8a6d` (`fix: yarn.lock`) — HEAD atual de `main`.

Cada feature tem sua própria branch, todas partindo deste commit. Nunca de outra feature branch.

```bash
# Criar branch de uma feature (padrão)
git checkout -b feat/<nome> 83c8a6d

# Ao concluir: PR → main (ou merge manual)
# NÃO fazer merge de feature A dentro de feature B
```

| Feature              | Branch                   | Commit base |
| -------------------- | ------------------------ | ----------- |
| **PlayerBar**        | `feat/player-bar`        | `83c8a6d`   |
| MobileTabBar         | `feat/mobile-tabbar`     | `83c8a6d`   |
| Profile page         | `feat/profile-page`      | `83c8a6d`   |
| Settings page        | `feat/settings-page`     | `83c8a6d`   |
| Recently Played      | `feat/recently-played`   | `83c8a6d`   |
| Heart / salvar track | `feat/heart-save-track`  | `83c8a6d`   |
| NowPlaying panel     | `feat/now-playing-panel` | `83c8a6d`   |

**Comandos prontos para copiar:**

```bash
git checkout -b feat/player-bar 83c8a6d
git checkout -b feat/mobile-tabbar 83c8a6d
git checkout -b feat/profile-page 83c8a6d
git checkout -b feat/settings-page 83c8a6d
git checkout -b feat/recently-played 83c8a6d
git checkout -b feat/heart-save-track 83c8a6d
git checkout -b feat/now-playing-panel 83c8a6d
```

---

## Padrões Obrigatórios — ler antes de implementar qualquer feature

Todo código novo deve seguir os padrões abaixo sem exceção. São os contratos do projeto.

---

### 1. Imports — `@/modules` e alias `@/`

Libs externas **nunca** importadas diretamente. Sempre via barrel `@/modules`:

```ts
// ❌ errado
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// ✅ correto
import { useNavigate, Heart, useQuery } from "@/modules";
```

Imports internos sempre com alias `@/`, nunca caminhos relativos entre pastas:

```ts
// ❌ errado
import { ErrorState } from "../../ui/ErrorState";
import { useSpotifyApi } from "../useSpotifyApi";

// ✅ correto
import { ErrorState } from "@/components/ui/ErrorState";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
```

Se precisar importar nova lib externa: **adicionar ao `src/modules/index.ts` primeiro**, depois usar via `@/modules`.

---

### 2. Internacionalização — zero string hardcoded

Toda string visível ao usuário usa `t()`. Sem exceção:

```tsx
// ❌ errado
<h1>Perfil</h1>
<button>Salvar</button>

// ✅ correto
const { t } = useTranslation(); // de @/modules
<h1>{t("PAGES.PROFILE.title")}</h1>
<button>{t("PAGES.PROFILE.saveButton")}</button>
```

Estrutura de chaves:

- Páginas: `PAGES.NOME_DA_PAGINA.*`
- Componentes: `COMPONENTS.NOME_DO_COMPONENTE.*`

**Ambos os arquivos devem ser atualizados ao mesmo tempo:**

- `src/utils/texts/texts.pt.json` — PT-BR (idioma padrão)
- `src/utils/texts/texts.en.json` — EN-US

---

### 3. CSS — somente CSS custom properties e tokens Tailwind

Nunca cores hexadecimais ou RGB hardcoded. Usar os tokens definidos em `src/index.css`:

```tsx
// ❌ errado
className = "bg-[#121212] text-[#ffffff] border-[#333]";

// ✅ correto
className = "bg-bg text-text-primary border-border";
className = "bg-surface hover:bg-surface-hover";
className = "text-accent hover:text-accent-muted";
```

Tokens disponíveis: `bg-bg`, `bg-surface`, `bg-surface-hover`, `text-text-primary`, `text-text-muted`, `text-accent`, `text-accent-muted`, `border-border`, `border-accent`. Para gradientes de hero: `var(--color-hero-start)`.

---

### 4. Props — sempre `Readonly<Props>`

```tsx
// ❌ errado
export function Card({ title, onClick }: CardProps) { ... }

// ✅ correto
export function Card({ title, onClick }: Readonly<CardProps>) { ... }
```

---

### 5. Playback — toast stub obrigatório

Não existe controle de playback ativo. Todo ponto de play/pause usa:

```tsx
onClick={() => toast.info(t("COMPONENTS.PLAYER.comingSoon"))}
```

`toast` importado de `@/modules`. Nunca chamar `usePlaybackControls` ou APIs de playback reais.

---

### 6. Query hooks — domínio em `src/hooks/queries/`

Cada domínio tem seu arquivo em `src/hooks/queries/`:

```
src/hooks/queries/
  artist.ts   album.ts   track.ts
  browse.ts   me.ts      playlist.ts
  search.ts   index.ts   requireApi.ts
```

Padrão obrigatório dentro de cada hook:

```ts
import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useMinhaQuery = (id: string) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "dominio", id], // chave hierárquica
    queryFn: () => requireApi(api).dominio.metodo(id), // nunca api!
    enabled: api !== null && !!id, // guard duplo obrigatório
  });
};
```

Novo hook → **exportar via `src/hooks/queries/index.ts`** (já tem `export *` do domínio certo). Chega ao consumidor via `@/hooks` (barrel de hooks também re-exporta `queries`).

---

### 7. Skeleton — keys como string, nunca index

```tsx
// ❌ errado — key numérico do map
{
  [1, 2, 3, 4].map((_, i) => <Skeleton key={i} />);
}

// ✅ correto — array de strings estável
const SKELETON_KEYS = ["s1", "s2", "s3", "s4"];
{
  SKELETON_KEYS.map((key) => <Skeleton key={key} />);
}
```

---

### 8. Ordem de guards em componentes com dados

```tsx
if (isLoading) return <ComponenteSkeleton />;   // 1º: loading
if (isError)   return <ErrorState ... />;        // 2º: erro com onRetry
if (!data)     return null;                      // 3º: dado ausente

// render normal
```

`ErrorState` sempre com `onRetry={() => refetch()}`.

---

### 9. Tipos globais — `.d.ts` em `src/types/`

Tipos de domínio novos vão em arquivos `.d.ts` separados (sem `import`/`export` — são globais):

```
src/types/spotify.d.ts     ← entidades Spotify (Artist, Album, Track…)
src/types/favorites.d.ts   ← FavoriteItem, FavoritesState, FavoritesAction
src/types/theme.d.ts       ← Theme, ThemeState, ThemeAction
```

Interfaces globais não precisam de import em nenhum arquivo. Se criar novo domínio com tipos próprios, criar `src/types/nome.d.ts`.

---

### 10. Mutações — em `useSpotifyMutations.ts`, com invalidação

```ts
const saveTrack = useMutation({
  mutationFn: (trackId: string) => {
    if (!api) throw new Error("Not authenticated");
    return api.tracks.saveTracks([trackId]);
  },
  onSuccess: () =>
    queryClient.invalidateQueries({ queryKey: ["spotify", "me"] }),
});
```

Agrupadas por domínio (`useLibraryControls`, `usePlaylistControls`). Nunca mutar sem invalidar cache.

---

### 11. Exports — páginas default, componentes named

```ts
// Páginas (src/pages/)
export default function Profile() { ... }

// Componentes (src/components/)
export function ProfileCard() { ... }
```

---

### 12. API layer — `src/api/*.api.ts`

Novos endpoints: adicionar ao arquivo de API do domínio correto (`track.api.ts`, `artist.api.ts`, etc.):

```ts
async getRecentlyPlayed(limit = 20): Promise<RecentlyPlayedResponse> {
  return this.apiClient.get<RecentlyPlayedResponse>(
    "/me/player/recently-played",
    { limit }
  );
}
```

Nunca chamar `fetch` diretamente. Sempre via `this.apiClient`.

---

## Resumo da comparação

| Feature                 | Referência           | Nosso                    |
| ----------------------- | -------------------- | ------------------------ |
| Página Profile          | ✅ `/profile`        | ❌ só no header dropdown |
| Página Settings         | ✅ `/settings`       | ❌ só no header dropdown |
| Recently Played na Home | ✅ grid 8 tracks     | ❌                       |
| MobileTabBar            | ✅ bottom nav mobile | ❌ sem navegação mobile  |
| NowPlaying panel        | ✅ painel xl direito | ❌ removido com SDK      |
| Heart / salvar track    | ✅ botão em TrackRow | ❌ API existe, sem UI    |
| PlayerBar completo      | ✅ com SDK           | ❌ removido (sem SDK)    |

---

## Feature 1 — Página Profile (`/profile`) · branch: `feat/profile-page`

**O que é:** Rota dedicada com avatar grande, display name, contagem de seguidores e badge do plano Spotify (free/premium).

**Por que implementar:** Referência usa `Badge` do shadcn que já temos instalado. API `useCurrentUserProfile` já existe e está sendo usada no `Header`. Zero novo endpoint.

**Arquivos a criar:**

- `src/pages/Profile.tsx`

**Arquivos a modificar:**

- `src/app/routeDefinitions.tsx` — adicionar rota `profile` como filho do Dashboard
- `src/components/layout/Sidebar.tsx` — adicionar link "Perfil"
- `src/utils/texts/texts.pt.json` + `texts.en.json` — chaves `PAGES.PROFILE.*`

**UI esperada:**

```
[Avatar 144x144]  Perfil
                  Nome do usuário (texto grande)
                  1.234 seguidores · [Badge: free/premium]
```

**Esforço estimado:** Baixo — é só uma página de exibição, sem formulário, sem novo hook.

---

## Feature 2 — Página Settings (`/settings`) · branch: `feat/settings-page`

**O que é:** Rota dedicada com seções de configuração. Referência tem apenas "Appearance" (theme toggle). Podemos expandir com Language toggle — algo que a referência não tem, mas nós já temos infraestrutura.

**Por que implementar:** Melhora navegabilidade, remove itens do dropdown do Header, dá espaço para crescer.

**Seções:**

1. **Appearance** — theme toggle (dark/light) via `useTheme()`
2. **Language** — toggle PT/EN via `i18n.changeLanguage()` — diferencial sobre a referência

**Arquivos a criar:**

- `src/pages/Settings.tsx`

**Arquivos a modificar:**

- `src/app/routeDefinitions.tsx` — adicionar rota `settings`
- `src/components/layout/Sidebar.tsx` — link "Configurações"
- `src/utils/texts/texts.pt.json` + `texts.en.json` — chaves `PAGES.SETTINGS.*`
- `src/components/layout/Header.tsx` — trocar itens de theme/language do dropdown por link "Configurações"

**Esforço estimado:** Baixo.

---

## Feature 3 — Recently Played Section na Home · branch: `feat/recently-played`

**O que é:** Grid 2×4 (mobile) / 2×4 (desktop) de tracks ouvidas recentemente. Cada card tem imagem do álbum, nome da track, artistas. Clique navega para o álbum. Botão de play → toast stub (igual ao padrão atual).

**Por que implementar:** Endpoint `/me/player/recently-played` já está nos scopes (`user-read-recently-played` está em `REQUIRED_SCOPES`). É a seção mais visível que falta na Home.

**Arquivos a criar:**

- `src/hooks/queries/player.ts` — `useRecentlyPlayed(limit)` com `useQuery`
- `src/components/features/home/RecentlyPlayedSection.tsx`
- `src/components/features/home/RecentlyPlayedCard.tsx`

**Arquivos a modificar:**

- `src/api/track.api.ts` — adicionar `getRecentlyPlayed(limit)` → `GET /me/player/recently-played`
- `src/pages/Dashboard.tsx` — renderizar `<RecentlyPlayedSection />` antes das demais seções
- `src/utils/texts/texts.pt.json` + `texts.en.json` — `COMPONENTS.HOME.recentlyPlayed`

**Comportamento:**

- Deduplicar por `track.id` (usuário pode ter ouvido a mesma música várias vezes)
- Máximo 8 itens
- Click no card → navega para `/album/:id`
- Botão play → `toast.info(t("COMPONENTS.PLAYER.comingSoon"))`
- Skeleton enquanto carrega (grid 2×4 de `h-16 rounded-lg`)

**Esforço estimado:** Médio — precisa de hook novo + 2 componentes novos.

---

## Feature 4 — MobileTabBar · branch: `feat/mobile-tabbar`

**O que é:** Barra de navegação inferior fixa em mobile (`md:hidden`), substituindo a sidebar que desaparece em telas pequenas. Tabs: Home, Search, Library, Profile.

**Por que implementar:** Atualmente em mobile não há forma de navegar entre seções — a sidebar some e não há substituto. Quebra a UX em dispositivos menores.

**Tabs:**
| Tab | Ícone | Ação |
|---|---|---|
| Home | `House` | `setCurrentContent(PLAYER)` + `navigate("/")` |
| Busca | `Search` | `setCurrentContent(BROWSE)` + `navigate("/")` |
| Biblioteca | `Library` | `setCurrentContent(PLAYLISTS)` + `navigate("/")` |
| Perfil | `User` | `navigate("/profile")` |

**Arquivos a criar:**

- `src/components/layout/MobileTabBar.tsx`

**Arquivos a modificar:**

- `src/pages/Dashboard.tsx` — renderizar `<MobileTabBar />` (ou em `App.tsx` abaixo do `RouterProvider`)
- `src/index.css` — adicionar `pb-16 md:pb-0` no conteúdo principal para não ficar sob a tab bar

**Esforço estimado:** Baixo — puro UI, zero API.

---

## Feature 5 — Botão Heart / Salvar Track · branch: `feat/heart-save-track`

**O que é:** Botão de coração em cada `AlbumTrackRow` e `PlaylistTrackRow` para salvar/remover track da biblioteca. Estado inicial vem de `checkSavedTracks`. Toggle via `saveTrack` / `removeTrack`.

**Por que implementar:** API, mutations e scopes já existem (`user-library-modify`, `user-library-read`). É a única interação com a biblioteca que está na camada de API mas sem nenhum ponto de entrada na UI.

**Arquivos a criar:**

- `src/hooks/queries/tracks.ts` — `useCheckSavedTracks(ids: string[])`

**Arquivos a modificar:**

- `src/components/features/album/AlbumTrackRow.tsx` — adicionar `<Heart />` com toggle
- `src/components/features/playlist/PlaylistTrackList.tsx` — idem
- `src/hooks/useSpotifyMutations.ts` — expor `useLibraryControls` (já tem `saveTrack` + `removeTrack`, só falta exportar)

**Comportamento:**

- Coração preenchido = salvo (`fill-accent`)
- Coração vazio = não salvo (`text-text-muted`)
- Otimistic update: toggle imediato, rollback em erro
- `checkSavedTracks` em batch para todas as tracks da lista (uma request para N tracks)

**Esforço estimado:** Médio — hook novo de check + wiring em dois componentes.

---

## Feature 6 — NowPlaying Panel (read-only, sem SDK) · branch: `feat/now-playing-panel`

**O que é:** Painel lateral direito (`xl:flex hidden`) mostrando a track que está tocando no momento em qualquer dispositivo Spotify do usuário. Usa `useCurrentlyPlaying` (polling) — não requer SDK, apenas leitura.

**Por que implementar:** `useCurrentlyPlaying` já existe e funciona. É uma seção premium de UX que não requer o Web Playback SDK (apenas lê o estado, não controla). Diferencial visual claro.

**Arquivos a criar:**

- `src/components/features/NowPlaying.tsx` — exibe album art, track name, artistas, badge "Tocando agora"

**Arquivos a modificar:**

- `src/pages/Dashboard.tsx` — layout flex com `NowPlaying` à direita do conteúdo principal

**Comportamento:**

- `isLoading` → skeleton (imagem + 2 textos)
- `!track` → "Nada tocando no momento" (empty state)
- Tem track → album art grande + nome + artistas + nome do álbum
- Clique na imagem → navega para `/album/:id`
- Polling automático via `refetchInterval` no hook (já configurado)
- Visível apenas em `xl` (≥ 1280px)

**Esforço estimado:** Baixo — hook já existe, é só componente novo + wiring no layout.

---

## Feature 7 — PlayerBar completo (REST API, sem SDK) · branch: `feat/player-bar`

**O que é:** Barra de player fixa no rodapé com TrackInfo (esquerda), controles de transporte + seek bar (centro) e volume + extras (direita). Versão mobile tem MiniPlayer compacto. Controla o dispositivo Spotify ativo via REST API — **não requer Web Playback SDK**.

**Contexto de remoção:** O commit `e0b899a` removeu toda a infraestrutura de playback. O SDK foi removido corretamente (nunca funcionou sem conta Premium e device ativo). A PlayerBar REST-only pode ser restaurada — ela apenas envia comandos ao dispositivo ativo, sem criar device no browser.

---

### O que restaurar do git (commit `e0b899a`)

Restaurar **exatamente** esses arquivos via `git show e0b899a -- <path> | patch -p1` ou recriação manual:

| Arquivo                            | Status                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/api/playback.api.ts`          | Restaurar completo — `PlaybackApi` com 10 métodos REST                                                |
| `src/hooks/queries/playback.ts`    | Restaurar — `useCurrentPlayback`, `useCurrentlyPlaying`, `useAvailableDevices`, `useRecentlyPlayed`   |
| `src/types/playback.d.ts`          | Restaurar — `Device`, `PlaybackContext`, `PlaybackState`, `CurrentlyPlaying`                          |
| `src/hooks/useSpotifyMutations.ts` | Restaurar `usePlaybackControls` (play, pause, next, previous, seek, setVolume, setRepeat, setShuffle) |

### O que NÃO restaurar (removido com razão)

| Arquivo                                    | Motivo                                                         |
| ------------------------------------------ | -------------------------------------------------------------- |
| `src/hooks/useSpotifyPlayer.ts`            | Inicialização do Spotify Web Playback SDK — não queremos SDK   |
| `src/types/spotify-sdk.d.ts`               | Tipos do SDK (`Window.Spotify`, `SpotifyPlayer`) — não usados  |
| `src/stores/usePlayerStore.ts`             | Armazenava `deviceId` do player SDK — sem SDK, sem necessidade |
| `src/stores/tests/usePlayerStore.test.ts`  | Teste do store acima                                           |
| `src/hooks/tests/useSpotifyPlayer.test.ts` | Teste do hook SDK                                              |

### Auth scopes a restaurar (`src/services/auth.service.ts`)

```ts
// Adicionar de volta ao REQUIRED_SCOPES:
"user-read-playback-state",
"user-modify-playback-state",
"user-read-currently-playing",
"user-read-recently-played",
// NÃO restaurar: "streaming" — era para o SDK
```

> **Atenção:** alterar `REQUIRED_SCOPES` força re-login de todos os usuários existentes (scope validation no `AuthProvider`). É o comportamento correto.

---

### Novos arquivos a criar (UI components)

Baseados na referência (`react-typescript-spotify`), adaptados aos padrões do projeto:

```
src/components/layout/PlayerBar.tsx
src/components/layout/player/
  TrackInfo.tsx
  PlaybackControls.tsx
  ExtraControls.tsx
  MiniPlayer.tsx
src/components/icons/player/
  index.tsx   ← SVG icons (Shuffle, Prev, Next, Play, Pause, Repeat, etc.)
```

---

### Adaptações obrigatórias em relação à referência

| Problema na referência                                                  | Correção para nosso projeto                                                                   |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `import { Volume2 } from "lucide-react"`                                | `import { Volume2 } from "@/modules"`                                                         |
| `import { Slider } from "../../ui/slider"`                              | `import { Slider } from "@/components/ui/slider"` — verificar se shadcn Slider está instalado |
| `import type { Track } from "../../../types/spotify"`                   | não necessário — tipo global via `.d.ts`                                                      |
| `text-[#b3b3b3]` hardcoded                                              | `text-text-muted`                                                                             |
| `bg-[#282828]` hardcoded                                                | `bg-surface`                                                                                  |
| `style={{ color: "rgb(186,186,186)" }}` inline                          | `className="text-text-muted"`                                                                 |
| `fill: "#1db954"` nos SVGs ativos                                       | `fill: "var(--color-accent)"`                                                                 |
| Strings hardcoded: `"Nothing playing"`, aria-labels                     | `t("COMPONENTS.PLAYER.*")` com chaves em PT/EN                                                |
| Imports relativos `../../ui/`                                           | `@/components/ui/`                                                                            |
| `import { useCurrentPlayback } from "../../hooks/useSpotifyQueries"`    | `import { useCurrentPlayback } from "@/hooks"`                                                |
| `import { usePlaybackControls } from "../../hooks/useSpotifyMutations"` | `import { usePlaybackControls } from "@/hooks"`                                               |
| Props sem `Readonly<>` (TrackInfo)                                      | `Readonly<TrackInfoProps>`                                                                    |
| `formatMs()` local em PlaybackControls                                  | usar `formatDuration` de `@/utils` (já existe)                                                |

---

### Arquivos a modificar

| Arquivo                         | Mudança                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `src/api/index.ts`              | Adicionar `PlaybackApi` ao objeto composto da API                                            |
| `src/hooks/queries/index.ts`    | `export * from "./playback"`                                                                 |
| `src/hooks/index.ts`            | Re-exportar `usePlaybackControls` (já re-exporta `useSpotifyMutations`)                      |
| `src/pages/Dashboard.tsx`       | Renderizar `<PlayerBar />` no rodapé do layout                                               |
| `src/modules/index.ts`          | Adicionar `Volume2, VolumeX` se não estiverem (já podem estar via lucide)                    |
| `src/utils/texts/texts.pt.json` | Chaves `COMPONENTS.PLAYER.*` (já tem `comingSoon`) — adicionar `nothingPlaying`, aria-labels |
| `src/utils/texts/texts.en.json` | Idem em inglês                                                                               |

---

### Novas chaves i18n necessárias

```json
// COMPONENTS.PLAYER.*
"nothingPlaying": "Nada tocando",
"previous": "Faixa anterior",
"next": "Próxima faixa",
"play": "Reproduzir",
"pause": "Pausar",
"shuffle": "Modo aleatório",
"repeat": "Repetir",
"volume": "Volume",
"mute": "Silenciar",
"unmute": "Ativar som",
"addToLibrary": "Adicionar à biblioteca",
"queue": "Fila",
"connectDevice": "Conectar dispositivo"
```

---

### Verificação antes de fechar a branch

```bash
npx tsc --noEmit          # zero erros TypeScript
npm run coverage          # 280+ testes passando (PlayerBar sem testes novos é ok)
npm run build             # build limpo
```

**Fluxo manual de teste:**

1. Abrir o app com uma música tocando no Spotify (celular/desktop)
2. PlayerBar aparece no rodapé com track info
3. Play/pause, next, previous funcionam
4. Seek bar move a posição
5. Volume slider muda o volume
6. Shuffle e repeat fazem toggle
7. Mobile: MiniPlayer compacto com play/pause
8. Sem música tocando: PlayerBar mostra "Nada tocando" (ou fica oculta)

---

## Prioridade sugerida

| #   | Feature              | Impacto                      | Esforço | Prioridade |
| --- | -------------------- | ---------------------------- | ------- | ---------- |
| 1   | MobileTabBar         | Alto — UX quebrada em mobile | Baixo   | 🔴 Alta    |
| 2   | Página Profile       | Médio — rota faltante        | Baixo   | 🟡 Média   |
| 3   | Página Settings      | Médio — organiza header      | Baixo   | 🟡 Média   |
| 4   | Recently Played      | Alto — enriquece Home        | Médio   | 🟡 Média   |
| 5   | Heart / Salvar Track | Médio — interatividade real  | Médio   | 🟡 Média   |
| 6   | NowPlaying Panel     | Baixo — visual, xl only      | Baixo   | 🟢 Baixa   |

---

## Fora do escopo

**PlayerBar completo** (TrackInfo + PlaybackControls + volume + seek + shuffle/repeat) — requer Spotify Web Playback SDK + conta Premium ativa. Implementado na referência mas deliberadamente removido aqui. Substituído por toast `comingSoon` em todos os pontos de play/pause.
