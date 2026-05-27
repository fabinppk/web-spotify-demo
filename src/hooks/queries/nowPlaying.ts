import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useCurrentlyPlaying = () => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "playback", "currently-playing"],
    queryFn: () => requireApi(api).playback.getCurrentlyPlaying(),
    enabled: api !== null,
    refetchInterval: (query) =>
      (query.state.data as { is_playing?: boolean } | null)?.is_playing
        ? 10000
        : 30000,
    staleTime: 0,
  });
};
