import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useCurrentUserProfile = () => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "me"],
    queryFn: () => requireApi(api).getCurrentUserProfile(),
    enabled: api !== null,
    staleTime: 10 * 60 * 1000,
  });
};
