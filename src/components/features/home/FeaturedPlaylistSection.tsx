import { useFeaturedPlaylists } from "@/hooks";
import { PlaylistCarousel } from "./PlaylistCarousel";
import { toast, useTranslation } from "@/modules";

export function FeaturedPlaylistSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useFeaturedPlaylists(10);

  if (isError) return null;

  const playlists = (data?.playlists?.items ?? []).filter(
    (item: Playlist | null) => item !== null,
  );

  return (
    <PlaylistCarousel
      title={t("COMPONENTS.HOME.featuredPlaylists")}
      playlists={playlists}
      isLoading={isLoading}
      onPlay={() => toast.info(t("COMPONENTS.PLAYER.comingSoon"))}
    />
  );
}
