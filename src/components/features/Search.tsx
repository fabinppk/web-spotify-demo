import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchQuery } from "@/hooks/useSpotifyQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useContentStore } from "@/stores/useContentStore";
import { MainContent } from "@/utils";
import { SearchArtistCard } from "@/components/features/search/SearchArtistCard";
import { SearchAlbumCard } from "@/components/features/search/SearchAlbumCard";

function useDebounced(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function Search() {
  const { searchQuery: initialQuery, setCurrentContent } = useContentStore();
  const handleNavigate = () => setCurrentContent(MainContent.ALBUMS);
  const debouncedQuery = useDebounced(initialQuery, 300);
  const { t } = useTranslation();

  const { data, isLoading, error, refetch } = useSearchQuery(debouncedQuery, [
    "artist",
    "album",
  ]);

  const artists = (data?.artists?.items ?? []).filter(Boolean) as Artist[];
  const albums = (data?.albums?.items ?? []).filter(Boolean) as Album[];

  return (
    <div className="p-6 flex flex-col gap-6">
      {!debouncedQuery && (
        <EmptyState
          title={t("COMPONENTS.SEARCH.emptyTitle")}
          description={t("COMPONENTS.SEARCH.emptyDescription")}
        />
      )}

      {debouncedQuery && isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6", "sk-7"].map(
            (id) => (
              <div key={id} className="flex flex-col gap-2">
                <Skeleton className="aspect-square w-full rounded" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ),
          )}
        </div>
      )}

      {debouncedQuery && error && (
        <ErrorState
          message={t("COMPONENTS.SEARCH.errorMessage")}
          onRetry={() => refetch()}
        />
      )}

      {debouncedQuery && data && (
        <div className="flex flex-col gap-8">
          {artists.length > 0 && (
            <section>
              <h2 className="text-text-primary font-bold mb-3">
                {t("COMPONENTS.SEARCH.artistsSection")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {artists.map((artist) => (
                  <SearchArtistCard
                    key={artist.id}
                    artist={artist}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <h2 className="text-text-primary font-bold mb-3">
                {t("COMPONENTS.SEARCH.albumsSection")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <SearchAlbumCard
                    key={album.id}
                    album={album}
                    onNavigate={handleNavigate}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
