import { useTranslation, toast } from "@/modules";
import { useRecentlyPlayed } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentlyPlayedCard } from "./RecentlyPlayedCard";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

export function RecentlyPlayedSection() {
  const { t } = useTranslation();
  const { data, isLoading } = useRecentlyPlayed(20);

  if (isLoading) {
    return (
      <section>
        <h2 className="text-text text-2xl font-bold mb-4">
          {t("COMPONENTS.HOME.recentlyPlayed")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-16 rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (!data?.items?.length) return null;

  const seen = new Set<string>();
  const unique = data.items
    .filter(({ track }) => {
      if (seen.has(track.id)) return false;
      seen.add(track.id);
      return true;
    })
    .slice(0, 8);

  const handlePlay = () => {
    toast.info(t("COMPONENTS.PLAYER.comingSoon"));
  };

  return (
    <section>
      <h2 className="text-text text-2xl font-bold mb-4">
        {t("COMPONENTS.HOME.recentlyPlayed")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
        {unique.map(({ track }) => (
          <RecentlyPlayedCard
            key={track.id}
            item={{
              id: track.id,
              name: track.name,
              imageUrl:
                track.album?.images?.[2]?.url ?? track.album?.images?.[0]?.url,
              type: "track",
              uri: track.uri,
              navigationPath: `/album/${track.album?.id}`,
              subtitle: track.artists.map((a) => a.name).join(", "),
            }}
            onPlay={handlePlay}
            onPause={handlePlay}
            isActive={false}
            isPlaying={false}
          />
        ))}
      </div>
    </section>
  );
}
