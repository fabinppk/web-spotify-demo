import { Skeleton } from "@/components/ui/skeleton";
import { PlayIcon, PauseIcon } from "@/components/icons/player";
import { useNavigate, useTranslation } from "@/modules";

interface MiniPlayerProps {
  track: Track | undefined;
  isLoading: boolean;
  isPlaying: boolean;
  albumImageUrl: string | undefined;
  contextPlaylistId: string | null;
  onPlayPause: () => void;
}

export function MiniPlayer({
  track,
  isLoading,
  isPlaying,
  albumImageUrl,
  contextPlaylistId,
  onPlayPause,
}: Readonly<MiniPlayerProps>) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-10 h-10 rounded shrink-0" />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
      </>
    );
  }

  return (
    <>
      {track ? (
        <img
          src={albumImageUrl}
          alt={track.album?.name}
          className="w-10 h-10 rounded shrink-0 object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded shrink-0 bg-surface" />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        {contextPlaylistId ? (
          <button
            onClick={() => navigate("/playlist/" + contextPlaylistId)}
            className="hover:underline cursor-pointer text-text text-sm font-bold truncate text-left"
          >
            {track ? track.name : t("COMPONENTS.PLAYER.nothingPlaying")}
          </button>
        ) : (
          <span className="text-text text-sm font-bold truncate">
            {track ? track.name : t("COMPONENTS.PLAYER.nothingPlaying")}
          </span>
        )}
        {track && (
          <span className="text-text-muted text-xs truncate">
            {track.artists.map((a, i) => (
              <span key={a.id}>
                {i > 0 && ", "}
                <button
                  onClick={() => navigate("/artist/" + a.id)}
                  className="hover:underline cursor-pointer"
                >
                  {a.name}
                </button>
              </span>
            ))}
          </span>
        )}
      </div>

      <button
        onClick={onPlayPause}
        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shrink-0"
        aria-label={
          isPlaying ? t("COMPONENTS.PLAYER.pause") : t("COMPONENTS.PLAYER.play")
        }
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
    </>
  );
}
