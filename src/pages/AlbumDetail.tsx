import { useParams, useNavigate, useTranslation, Play, Heart } from "@/modules";
import {
  useAlbum,
  useAlbumTracks,
  useCurrentlyPlaying,
} from "@/hooks/useSpotifyQueries";
import { usePlaybackControls } from "@/hooks/useSpotifyMutations";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatDuration, formatTotalDuration } from "@/utils";
import { AlbumDetailSkeleton } from "@/components/features/album/AlbumDetailSkeleton";
import { AlbumTrackRow } from "@/components/features/album/AlbumTrackRow";

export default function AlbumDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Pagination note: currently fetches first 50 tracks only. Long albums (live recordings,
  // compilations) may exceed this. Implement useInfiniteQuery or load-more button.
  const {
    data: album,
    isLoading: albumLoading,
    isError: albumError,
    refetch: refetchAlbum,
  } = useAlbum(id ?? "");
  const {
    data: tracksData,
    isLoading: tracksLoading,
    isError: tracksError,
    refetch: refetchTracks,
  } = useAlbumTracks(id ?? "");
  const { data: currentlyPlaying } = useCurrentlyPlaying();
  const { play, pause } = usePlaybackControls();

  const isLoading = albumLoading || tracksLoading;
  const isError = albumError || tracksError;

  if (isLoading) return <AlbumDetailSkeleton />;
  if (isError || !album) {
    return (
      <ErrorState
        message={t("PAGES.ALBUM_DETAIL.errorMessage")}
        onRetry={() => {
          refetchAlbum();
          refetchTracks();
        }}
      />
    );
  }

  const tracks = tracksData?.items ?? [];
  const currentTrackId = currentlyPlaying?.item?.id;
  const isPlaying = currentlyPlaying?.is_playing ?? false;
  const totalDurationMs = tracks.reduce(
    (sum: number, track: Pick<Track, "duration_ms">) =>
      sum + (track.duration_ms ?? 0),
    0,
  );
  const coverImage = album.images?.[0]?.url;
  const releaseYear = album.release_date
    ? Number.parseInt(album.release_date.slice(0, 4), 10)
    : null;

  return (
    <div className="flex flex-col min-h-full" data-testid="album-detail">
      {/* Gradient header */}
      <div className="bg-[linear-gradient(180deg,var(--color-hero-album-start)_0%,var(--color-bg)_100%)] p-8">
        <div className="flex items-end gap-6">
          {coverImage ? (
            <img
              src={coverImage}
              alt={album.name}
              className="w-48 h-48 rounded-sm object-cover shrink-0 shadow-2xl"
              data-testid="album-cover"
            />
          ) : (
            <div
              className="w-48 h-48 rounded-sm bg-surface shrink-0 shadow-2xl"
              data-testid="album-cover-placeholder"
            />
          )}
          <div className="flex flex-col gap-2 min-w-0">
            <span className="text-text-muted text-xs font-semibold uppercase tracking-widest">
              {t("PAGES.ALBUM_DETAIL.albumType")}
            </span>
            <h1 className="text-text-primary text-4xl md:text-5xl font-bold truncate">
              {album.name}
            </h1>
            <p className="text-text-muted text-sm flex flex-wrap items-center gap-1">
              {album.artists?.[0] && (
                <button
                  onClick={() => navigate(`/artist/${album.artists[0].id}`)}
                  className="hover:text-text-primary hover:underline font-semibold"
                  data-testid="album-artist-link"
                >
                  {album.artists[0].name}
                </button>
              )}
              {releaseYear && (
                <>
                  <span>·</span>
                  <span>{releaseYear}</span>
                </>
              )}
              <span>·</span>
              <span>{album.tracks?.total ?? tracks.length} songs</span>
              {totalDurationMs > 0 && (
                <>
                  <span>,</span>
                  <span>{formatTotalDuration(totalDurationMs)}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() => play.mutate({ context_uri: album.uri })}
            aria-label="Play album"
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </button>
          {/* Wire up save/unsave album using useLibraryControls when implemented */}
          <button
            aria-label="Like album"
            className="w-8 h-8 rounded-full border border-text-muted flex items-center justify-center hover:border-text-primary transition-colors"
          >
            <Heart className="w-4 h-4 text-text-muted" />
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 bg-bg px-6 py-4">
        <div className="sticky top-0 z-10 bg-bg grid grid-cols-[2rem_1fr_4rem] gap-4 px-2 py-2 border-b border-border mb-2">
          <span className="text-text-muted text-xs font-semibold text-right">
            #
          </span>
          <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
            {t("PAGES.ALBUM_DETAIL.title")}
          </span>
          <span className="text-text-muted text-xs font-semibold uppercase tracking-wider text-right">
            {t("PAGES.ALBUM_DETAIL.duration")}
          </span>
        </div>

        {tracks.map((track: Track, index: number) => {
          if (!track) return null;
          return (
            <AlbumTrackRow
              key={`${track.id}-${index}`}
              track={track}
              index={index}
              isCurrentTrack={track.id === currentTrackId}
              isActiveAndPlaying={track.id === currentTrackId && isPlaying}
              formattedDuration={formatDuration(track.duration_ms)}
              onPlay={() =>
                play.mutate({
                  context_uri: album.uri,
                  offset: { position: index },
                })
              }
              onPause={() => pause.mutate(undefined)}
            />
          );
        })}

        {tracks.length === 0 && (
          <p className="text-text-muted text-sm text-center py-12">
            This album has no tracks.
          </p>
        )}
      </div>
    </div>
  );
}
