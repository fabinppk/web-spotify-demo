import { HomeSection } from "./HomeSection";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistCard } from "./PlaylistCard";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

interface PlaylistListedProps {
  title: string;
  playlists: Playlist[];
  isLoading: boolean;
  onPlay: () => void;
}

export function PlaylistListed({
  title,
  playlists,
  isLoading,
  onPlay,
}: Readonly<PlaylistListedProps>) {
  if (isLoading) {
    return (
      <HomeSection title={title}>
        <div className="flex gap-4">
          {SKELETON_KEYS.map((key) => (
            <div key={key} className="flex flex-col gap-2 w-40 shrink-0">
              <Skeleton className="w-40 h-40 rounded-md" />
              <Skeleton className="h-3 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </HomeSection>
    );
  }

  if (!playlists.length) return null;

  return (
    <HomeSection title={title}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-8">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onPlay={onPlay} />
        ))}
      </div>
    </HomeSection>
  );
}
