import { useCallback } from "react";
import { useTranslation } from "@/modules";
import { HomeSection } from "./HomeSection";
import { ArtistCard } from "./ArtistCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteTopArtists, useIntersectionObserver } from "@/hooks";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

export function TopArtistsSection() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTopArtists(20);

  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver(onIntersect);

  if (isError) return null;

  if (isLoading) {
    return (
      <HomeSection title={t("COMPONENTS.HOME.topArtists")}>
        <div className="flex gap-4 flex-wrap">
          {SKELETON_KEYS.map((key) => (
            <div
              key={key}
              className="flex flex-col items-center gap-2 w-40 shrink-0"
            >
              <Skeleton className="w-40 h-40 rounded-full" />
              <Skeleton className="h-3 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      </HomeSection>
    );
  }

  const artists = data?.pages.flatMap((p) => p.items ?? []) ?? [];

  if (!artists.length) return null;

  return (
    <HomeSection title={t("COMPONENTS.HOME.topArtists")}>
      <div className="flex gap-4 flex-wrap">
        {artists.map((artist: Artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-4 mt-2" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}
    </HomeSection>
  );
}
