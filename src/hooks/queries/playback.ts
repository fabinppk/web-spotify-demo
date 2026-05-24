import { useQuery } from "@tanstack/react-query";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useCurrentPlayback = () => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "playback", "current"],
    queryFn: () => requireApi(api).playback.getCurrentPlayback(),
    enabled: api !== null,
    refetchInterval: (query) => {
      return (query.state.data as { is_playing?: boolean } | null)?.is_playing
        ? 10000
        : 5000;
    },
    staleTime: 0,
  });
};

export const useCurrentlyPlaying = () => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "playback", "currently-playing"],
    queryFn: () => requireApi(api).playback.getCurrentlyPlaying(),
    enabled: api !== null,
    refetchInterval: (query) => {
      return (query.state.data as { is_playing?: boolean } | null)?.is_playing
        ? 1000
        : 5000;
    },
    staleTime: 0,
  });
};

export const useAvailableDevices = () => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "devices"],
    queryFn: () => requireApi(api).playback.getAvailableDevices(),
    enabled: api !== null,
    staleTime: 30 * 1000,
  });
};

export const useRecentlyPlayed = (limit = 20) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "recently-played", limit],
    queryFn: () => requireApi(api).playback.getRecentlyPlayedTracks({ limit }),
    enabled: api !== null,
    staleTime: 2 * 60 * 1000,
  });
};
