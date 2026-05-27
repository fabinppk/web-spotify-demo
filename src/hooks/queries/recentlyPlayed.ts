import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useRecentlyPlayed = (limit = 8) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "recently-played", limit],
    queryFn: () => requireApi(api).tracks.getRecentlyPlayed(limit),
    enabled: api !== null,
    staleTime: 2 * 60 * 1000,
  });
};
