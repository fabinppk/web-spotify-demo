import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";
import { useCurrentUserProfile } from "./me";

export const usePlaylist = (playlistId: string) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "playlist", playlistId],
    queryFn: () => requireApi(api).playlists.getPlaylist(playlistId),
    enabled: api !== null && !!playlistId,
  });
};

export const useUserPlaylists = (limit = 50, offset = 0) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "playlists", "me", limit, offset],
    queryFn: () =>
      requireApi(api).playlists.getCurrentUserPlaylists({ limit, offset }),
    enabled: api !== null,
  });
};

export const useFeaturedPlaylists = (limit = 20) => {
  const api = useSpotifyApi();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const market = profile?.country;
  const query = useQuery({
    queryKey: ["spotify", "playlists", "featured", limit, market],
    queryFn: () =>
      requireApi(api).search.search("featured", ["playlist"], { market }),
    enabled: api !== null && profile !== undefined,
  });
  return { ...query, isLoading: query.isLoading || profileLoading };
};

export const useMadeForYouPlaylists = (limit = 20) => {
  const api = useSpotifyApi();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const market = profile?.country;
  const query = useQuery({
    queryKey: ["spotify", "playlists", "made-for-you", limit, market],
    queryFn: () =>
      requireApi(api).search.search("for me", ["playlist"], { market }),
    enabled: api !== null && profile !== undefined,
  });
  return { ...query, isLoading: query.isLoading || profileLoading };
};
