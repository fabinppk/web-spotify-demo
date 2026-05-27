import { Skeleton } from "@/components/ui/skeleton";
import { AddToLibraryIcon } from "@/components/icons/player";
import { useNavigate, useTranslation } from "@/modules";

interface TrackInfoProps {
  track: Track | undefined;
  isLoading: boolean;
  albumImageUrl: string | undefined;
  saved: boolean;
  onSave: () => void;
}

export function TrackInfo({
  track,
  isLoading,
  albumImageUrl,
  saved,
  onSave,
}: Readonly<TrackInfoProps>) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-14 h-14 rounded shrink-0" />
        <div className="flex flex-col gap-1 min-w-0">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </>
    );
  }

  if (!track) {
    return (
      <span className="text-text-muted text-xs">
        {t("COMPONENTS.PLAYER.nothingPlaying")}
      </span>
    );
  }

  return (
    <>
      <div className="relative shrink-0 mr-4">
        <img
          src={albumImageUrl}
          alt="Album Cover"
          className="w-14 h-14 object-cover rounded"
        />
      </div>

      <div className="min-w-0">
        <p className="text-text font-bold text-sm truncate" title={track.name}>
          {track.name}
        </p>
        <span className="text-text-muted text-xs truncate block">
          {track.artists.map((a, i) => (
            <span key={a.id}>
              {i > 0 && ", "}
              <button
                onClick={() => navigate("/artist/" + a.id)}
                className="hover:text-text hover:underline"
              >
                {a.name}
              </button>
            </span>
          ))}
        </span>
      </div>

      <button
        onClick={onSave}
        className="ml-3 shrink-0 hover:opacity-80 transition-opacity"
        aria-label={t("COMPONENTS.PLAYER.addToLibrary")}
      >
        <AddToLibraryIcon saved={saved} />
      </button>
    </>
  );
}
