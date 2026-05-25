import { HomeSection } from "./HomeSection";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaylistCard } from "./PlaylistCard";
import { ScrollArrow } from "@/components/ui/ScrollArrow";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

interface PlaylistCarouselProps {
  title: string;
  playlists: Playlist[];
  isLoading: boolean;
  onPlay: () => void;
}

export function PlaylistCarousel({
  title,
  playlists,
  isLoading,
  onPlay,
}: Readonly<PlaylistCarouselProps>) {
  const { scrollRef, canScrollLeft, canScrollRight, scroll } =
    useCarouselScroll(playlists);

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
      <div className="relative overflow-hidden">
        {canScrollLeft && (
          <ScrollArrow dir="left" onClick={() => scroll("left")} />
        )}
        <div
          ref={scrollRef}
          data-testid="scroll-container"
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={onPlay}
            />
          ))}
        </div>
        {canScrollRight && (
          <ScrollArrow dir="right" onClick={() => scroll("right")} />
        )}
      </div>
    </HomeSection>
  );
}
