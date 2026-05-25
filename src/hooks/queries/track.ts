import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";
import { useCurrentUserProfile } from "./me";

export const useTrack = (trackId: string) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "track", trackId],
    queryFn: () => requireApi(api).tracks.getTrack(trackId),
    enabled: api !== null && !!trackId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSavedTracks = (limit = 50, offset = 0) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "me", "tracks", limit, offset],
    queryFn: () => requireApi(api).tracks.getUserSavedTracks({ limit, offset }),
    enabled: api !== null,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserTopTracks = (artistId: string) => {
  const api = useSpotifyApi();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const market = profile?.country;
  const query = useQuery({
    queryKey: ["spotify", "me", artistId, "top-tracks", market],
    queryFn: () =>
      requireApi(api).tracks.getUserTopTracks({
        time_range: "medium_term",
        limit: 10,
      }),
    enabled: api !== null && !!artistId && profile !== undefined,
    staleTime: 10 * 60 * 1000,
  });
  return { ...query, isLoading: query.isLoading || profileLoading };
};
