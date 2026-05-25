import {
  useMadeForYouPlaylists,
  useCurrentPlayback,
  usePlaybackControls,
} from "@/hooks";
import { usePlayerStore } from "@/stores";
import { PlaylistCarousel } from "./PlaylistCarousel";
import { useTranslation } from "react-i18next";

export function MadeForYouSection() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useMadeForYouPlaylists(10);
  const { data: playback } = useCurrentPlayback();
  const { play, pause } = usePlaybackControls();
  const { deviceId } = usePlayerStore();

  if (isError) return null;

  const playlists = (data?.playlists?.items ?? []).filter(
    (item: Playlist | null) => item !== null,
  );

  return (
    <PlaylistCarousel
      title={t("COMPONENTS.HOME.madeForYou")}
      playlists={playlists}
      isLoading={isLoading}
      activeContextUri={playback?.context?.uri ?? null}
      isPlaybackActive={playback?.is_playing ?? false}
      onPlay={(uri) =>
        play.mutate({ context_uri: uri, device_id: deviceId ?? undefined })
      }
      onPause={() => pause.mutate(deviceId ?? undefined)}
    />
  );
}
