import { useState, useMemo } from "react";
import { useNavigate, useTranslation, Heart } from "@/modules";
import {
  useUserPlaylists,
  useSavedAlbums,
  useFollowedArtists,
  usePlaybackControls,
} from "@/hooks";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { SidebarHeader } from "@/components/layout/sidebar/SidebarHeader";
import { LibraryList } from "@/components/layout/sidebar/LibraryList";
import { getArtistsString } from "@/utils";

export function Sidebar() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: playlistsData, isLoading: playlistsLoading } =
    useUserPlaylists(50);
  const { data: albumsData, isLoading: albumsLoading } = useSavedAlbums(50);
  const { data: artistsData, isLoading: artistsLoading } =
    useFollowedArtists(50);
  const { play } = usePlaybackControls();
  const { deviceId } = usePlayerStore();

  const isLoading = playlistsLoading || albumsLoading || artistsLoading;

  const allItems = useMemo<LibraryItem[]>(() => {
    const items: LibraryItem[] = [];

    if (filter === "all" || filter === "playlists") {
      playlistsData?.items?.filter(Boolean).forEach((p) => {
        items.push({
          id: p.id,
          name: p.name,
          imageUrl: p.images?.[0]?.url,
          subtitle: `${t("COMPONENTS.SIDEBAR.playlistSubtitle")} • ${p.owner?.display_name ?? "Spotify"}`,
          type: "playlist",
          uri: `spotify:playlist:${p.id}`,
          isArtist: false,
        });
      });
    }
    if (filter === "all" || filter === "artists") {
      artistsData?.artists?.items?.filter(Boolean).forEach((a) => {
        items.push({
          id: a.id,
          name: a.name,
          imageUrl: a.images?.[0]?.url,
          subtitle: t("COMPONENTS.SIDEBAR.artistSubtitle"),
          type: "artist",
          uri: `spotify:artist:${a.id}`,
          isArtist: true,
        });
      });
    }
    if (filter === "all" || filter === "albums") {
      albumsData?.items?.filter(Boolean).forEach(({ album }) => {
        items.push({
          id: album.id,
          name: album.name,
          imageUrl: album.images?.[0]?.url,
          subtitle: `${t("COMPONENTS.SIDEBAR.albumSubtitle")} • ${getArtistsString(album.artists)}`,
          type: "album",
          uri: `spotify:album:${album.id}`,
          isArtist: false,
        });
      });
    }

    return items;
  }, [playlistsData, albumsData, artistsData, filter, t]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    const q = searchQuery.toLowerCase();
    return allItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [allItems, searchQuery]);

  const handleItemClick = (item: LibraryItem) => {
    if (item.type === "playlist") navigate("/playlist/" + item.id);
    else if (item.type === "artist") navigate("/artist/" + item.id);
    else navigate("/album/" + item.id);
  };

  const handlePlay = (item: LibraryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    play.mutate({ context_uri: item.uri, device_id: deviceId ?? undefined });
  };

  return (
    <aside
      className="hidden md:flex flex-col w-72 lg:w-80 shrink-0 h-full bg-surface rounded-lg overflow-hidden"
      data-testid="sidebar-element"
    >
      <button
        onClick={() => navigate("/favorites")}
        className="flex items-center gap-3 mx-3 mt-2 px-3 py-2 rounded-md text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
      >
        <Heart size={16} />
        {t("COMPONENTS.SIDEBAR.favorites")}
      </button>
      <SidebarHeader
        filter={filter}
        searchOpen={searchOpen}
        searchQuery={searchQuery}
        onFilterChange={setFilter}
        onSearchOpen={() => setSearchOpen(true)}
        onSearchChange={setSearchQuery}
        onSearchBlur={() => {
          if (!searchQuery) setSearchOpen(false);
        }}
      />
      <LibraryList
        isLoading={isLoading}
        items={filteredItems}
        searchQuery={searchQuery}
        onNavigate={handleItemClick}
        onPlay={handlePlay}
      />
    </aside>
  );
}
