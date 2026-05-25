import { useParams, toast, useTranslation } from "@/modules";
import { usePlaylist } from "@/hooks";
import { ErrorState } from "@/components/ui/ErrorState";
import { PlaylistDetailSkeleton } from "@/components/features/playlist/PlaylistDetailSkeleton";
import { PlaylistHeader } from "@/components/features/playlist/PlaylistHeader";
import { PlaylistTrackList } from "@/components/features/playlist/PlaylistTrackList";

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: playlist, isLoading, isError, refetch } = usePlaylist(id ?? "");

  if (isLoading) return <PlaylistDetailSkeleton />;
  if (isError || !playlist) {
    return (
      <ErrorState
        message="Failed to load playlist."
        onRetry={() => refetch()}
      />
    );
  }

  const playlistItems = playlist.items?.items ?? [];

  return (
    <div className="flex flex-col min-h-full" data-testid="playlist-detail">
      <PlaylistHeader
        playlist={playlist}
        onPlay={() => toast.info(t("COMPONENTS.PLAYER.comingSoon"))}
      />
      <div className="flex-1 px-6 py-4">
        <PlaylistTrackList items={playlistItems} />
      </div>
    </div>
  );
}
