import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteSearchQuery } from "@/hooks/useSpotifyQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useContentStore } from "@/stores/useContentStore";
import { MainContent } from "@/utils";

function useDebounced(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function Search() {
  const navigate = useNavigate();
  const { searchQuery: initialQuery, setCurrentContent } = useContentStore();

  const debouncedQuery = useDebounced(initialQuery, 300);

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchQuery(debouncedQuery, ["artist", "album"]);

  const artists = data?.pages.flatMap((p) => p.artists?.items ?? []) ?? [];
  const albums = data?.pages.flatMap((p) => p.albums?.items ?? []) ?? [];

  return (
    <div className="p-6 flex flex-col gap-6">
      {!debouncedQuery && (
        <EmptyState
          title="Search for music"
          description="Find songs, artists, albums, and playlists"
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
        <ErrorState message="Search failed" onRetry={() => refetch()} />
      )}

      {debouncedQuery && data && (
        <div className="flex flex-col gap-8">
          {artists.length > 0 && (
            <section>
              <h2 className="text-text-primary font-bold mb-3">Artists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {artists.filter(Boolean).map((artist: Artist) => (
                  <button
                    key={artist.id}
                    type="button"
                    onClick={() => {
                      navigate("/artist/" + artist.id);
                      setCurrentContent(MainContent.ALBUMS);
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-surface-hover rounded-lg hover:bg-border transition-colors cursor-pointer text-left"
                  >
                    {artist.images?.[0]?.url ? (
                      <img
                        src={artist.images[0].url}
                        alt={artist.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-border" />
                    )}
                    <span className="text-text-primary text-sm font-medium text-center truncate w-full">
                      {artist.name}
                    </span>
                    <span className="text-text-muted text-xs">Artist</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <h2 className="text-text-primary font-bold mb-3">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {albums.filter(Boolean).map((album: Album) => (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => {
                      navigate("/album/" + album.id);
                      setCurrentContent(MainContent.ALBUMS);
                    }}
                    className="flex flex-col gap-2 p-3 bg-surface-hover rounded-lg hover:bg-border transition-colors cursor-pointer text-left w-full"
                  >
                    {album.images?.[0]?.url ? (
                      <img
                        src={album.images[0].url}
                        alt={album.name}
                        className="w-full aspect-square object-cover rounded"
                      />
                    ) : (
                      <div className="w-full aspect-square bg-border rounded" />
                    )}
                    <span className="text-text-primary text-sm font-medium truncate">
                      {album.name}
                    </span>
                    <span className="text-text-muted text-xs truncate">
                      {album.artists.map((a) => a.name).join(", ")}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {hasNextPage && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 rounded-full bg-surface-hover hover:bg-border text-text-primary text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Carregando..." : "Ver mais"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
