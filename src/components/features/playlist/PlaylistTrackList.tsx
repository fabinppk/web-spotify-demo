import { toast, useTranslation } from "@/modules";
import { TrackRow } from "../TrackRow";

interface PlaylistTrackListProps {
  items: PlaylistItem[];
}

export function PlaylistTrackList({
  items,
}: Readonly<PlaylistTrackListProps>) {
  const { t } = useTranslation();

  const tracks = items.filter(
    (i): i is PlaylistItem & { item: Track } => i.item?.type === "track",
  );

  if (tracks.length === 0) {
    return (
      <p className="text-text-muted text-sm text-center py-12">
        {t("PAGES.PLAYLIST_DETAIL.noTracks")}
      </p>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 px-2 py-2 border-b border-border mb-2">
        <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
          {t("PAGES.PLAYLIST_DETAIL.titleColumn")}
        </span>
      </div>
      {tracks.map((playlistItem) => (
        <TrackRow
          key={playlistItem.item.id}
          track={playlistItem.item}
          onPlay={() => toast.info(t("COMPONENTS.PLAYER.comingSoon"))}
        />
      ))}
    </div>
  );
}
