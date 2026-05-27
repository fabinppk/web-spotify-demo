import { useQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useCategories = (limit = 50) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "categories", limit],
    queryFn: () => requireApi(api).browse.getCategories({ limit }),
    enabled: api !== null,
    staleTime: 60 * 60 * 1000,
  });
};

export const useCategoryPlaylists = (
  categoryId: string | undefined,
  limit = 20,
) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "category-playlists", categoryId, limit],
    queryFn: () =>
      requireApi(api).browse.getCategoryPlaylists(categoryId!, { limit }),
    enabled: api !== null && !!categoryId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useNewReleases = (limit = 20, offset = 0) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "new-releases", limit, offset],
    queryFn: () => requireApi(api).browse.getNewReleases({ limit, offset }),
    enabled: api !== null,
    staleTime: 10 * 60 * 1000,
  });
};
