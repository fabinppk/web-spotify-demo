import { lazy, Suspense } from "react";
import { useOutlet } from "@/modules";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentStore } from "@/stores/useContentStore";
import { MainContent } from "@/utils";
import { NavHeader } from "@/components/features/home/NavHeader";
import { useNavHeader } from "@/hooks";
import { TopArtistsSection } from "@/components/features/home/TopArtistsSection";
import { MadeForYouSection } from "@/components/features/home/MadeForYouSection";
import { FeaturedPlaylistSection } from "@/components/features/home/FeaturedPlaylistSection";

const Search = lazy(() =>
  import("@/components/features/Search").then((m) => ({ default: m.Search })),
);

export function MainPanel() {
  const outlet = useOutlet();
  const { currentContent } = useContentStore();
  const { activeFilter, setActiveFilter } = useNavHeader();

  if (currentContent === MainContent.BROWSE) {
    return (
      <Suspense
        fallback={
          <div className="p-8">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        }
      >
        <Search />
      </Suspense>
    );
  }

  if (outlet) return outlet;

  const showPlaylists = activeFilter === "All" || activeFilter === "Playlists";
  const showArtists = activeFilter === "All" || activeFilter === "Artists";

  return (
    <>
      <NavHeader active={activeFilter} onChange={setActiveFilter} />
      <div className="p-4 flex flex-col gap-6">
        {showPlaylists && <MadeForYouSection />}
        {showPlaylists && <FeaturedPlaylistSection />}
        {showArtists && <TopArtistsSection />}
      </div>
    </>
  );
}
