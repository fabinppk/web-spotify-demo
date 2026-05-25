import { useCallback } from "react";
import { useParams, Play, useTranslation } from "@/modules";
import { useArtist, usePlaybackControls } from "@/hooks";
import { useInfiniteArtistAlbums } from "@/hooks/useSpotifyQueries";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { ErrorState } from "@/components/ui/ErrorState";
import { ArtistDetailSkeleton } from "@/components/features/artist/ArtistDetailSkeleton";
import { SearchAlbumCard } from "@/components/features/search/SearchAlbumCard";

export default function ArtistDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const {
    data: artist,
    isLoading: artistLoading,
    isError: artistError,
    refetch: refetchArtist,
  } = useArtist(id ?? "");

  const {
    data: albumsData,
    isLoading: albumsLoading,
    isError: albumsError,
    refetch: refetchAlbums,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteArtistAlbums(id ?? "", 8);

  const { play } = usePlaybackControls();

  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(onIntersect);

  const isLoading = artistLoading || albumsLoading;
  const isError = artistError || albumsError;

  const albums = (albumsData?.pages.flatMap((p) => p.items ?? []) ?? []).filter(
    Boolean,
  ) as Album[];
  const artistImage = artist?.images?.[0]?.url;

  if (isLoading) return <ArtistDetailSkeleton />;
  if (isError || !artist) {
    return (
      <ErrorState
        message={t("PAGES.ARTIST_DETAIL.errorMessage")}
        onRetry={() => {
          refetchArtist();
          refetchAlbums();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-full" data-testid="artist-detail">
      {/* Hero */}
      <div className="bg-[linear-gradient(180deg,var(--color-hero-start)_0%,var(--color-bg)_100%)] p-8">
        <div className="flex items-center gap-6">
          {artistImage ? (
            <img
              src={artistImage}
              alt={artist.name}
              className="w-32 h-32 rounded-full object-cover shrink-0 shadow-2xl"
              data-testid="artist-photo"
            />
          ) : (
            <div
              className="w-32 h-32 rounded-full bg-surface shrink-0 shadow-2xl"
              data-testid="artist-photo-placeholder"
            />
          )}
          <div className="flex flex-col gap-2 min-w-0">
            <h1 className="text-text-primary text-4xl md:text-6xl font-bold truncate">
              {artist.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => play.mutate({ context_uri: artist.uri })}
            aria-label="Play artist"
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </button>
          <button
            aria-label="Follow artist"
            className="px-6 py-2 rounded-full border border-text-muted text-text-muted text-sm font-semibold hover:border-text hover:text-text transition-colors"
          >
            {t("PAGES.ARTIST_DETAIL.follow")}
          </button>
        </div>
      </div>

      {/* Albums */}
      <div className="flex-1 bg-bg px-6 py-6">
        <section>
          <h2 className="text-text-primary text-2xl font-bold mb-4">
            {t("PAGES.ARTIST_DETAIL.albumsSection")}
          </h2>

          {albums.length > 0 ? (
            <>
              <div
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4"
                data-testid="albums-scroll-container"
              >
                {albums.map((album) => (
                  <SearchAlbumCard
                    key={album.id}
                    album={album}
                    subtitle={
                      album.release_date
                        ? album.release_date.slice(0, 4)
                        : undefined
                    }
                  />
                ))}
              </div>
              <div ref={sentinelRef} className="h-4 mt-4" />
              {isFetchingNextPage && (
                <div className="flex justify-center py-4">
                  <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}
            </>
          ) : (
            <p className="text-text-muted text-sm text-center py-12">
              {t("PAGES.ARTIST_DETAIL.noAlbums")}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
