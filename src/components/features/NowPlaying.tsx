import { useTranslation, useNavigate } from "@/modules";
import { useCurrentlyPlaying } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";

export function NowPlaying() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useCurrentlyPlaying();

  const track = data?.item;
  const albumImageUrl =
    track?.album?.images?.[0]?.url ?? track?.album?.images?.[1]?.url;

  return (
    <aside className="hidden xl:flex flex-col w-64 shrink-0 bg-surface rounded-lg p-4 gap-4 h-full overflow-hidden">
      <h2 className="text-text font-bold text-sm uppercase tracking-wider">
        {t("COMPONENTS.NOW_PLAYING.title")}
      </h2>

      {isLoading && (
        <>
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </>
      )}

      {!isLoading && !track && (
        <p className="text-text-muted text-sm text-center mt-4">
          {t("COMPONENTS.NOW_PLAYING.nothingPlaying")}
        </p>
      )}

      {!isLoading && track && (
        <>
          <button
            onClick={() => navigate(`/album/${track.album?.id}`)}
            className="w-full aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            aria-label={track.album?.name}
          >
            {albumImageUrl ? (
              <img
                src={albumImageUrl}
                alt={track.album?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-surface-hover rounded-lg" />
            )}
          </button>

          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-text font-bold text-sm truncate">{track.name}</p>
            <p className="text-text-muted text-xs truncate">
              {track.artists.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && ", "}
                  <button
                    onClick={() => navigate(`/artist/${a.id}`)}
                    className="hover:text-text hover:underline"
                  >
                    {a.name}
                  </button>
                </span>
              ))}
            </p>
            {track.album && (
              <p className="text-text-muted text-xs truncate opacity-70">
                {track.album.name}
              </p>
            )}
          </div>

          {data?.is_playing && (
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 bg-accent rounded-sm animate-eq-bar1" />
              <span className="w-1 bg-accent rounded-sm animate-eq-bar2" />
              <span className="w-1 bg-accent rounded-sm animate-eq-bar3" />
            </div>
          )}
        </>
      )}
    </aside>
  );
}
