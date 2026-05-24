import { useQuery } from "@tanstack/react-query";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useAlbum = (albumId: string) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "album", albumId],
    queryFn: () => requireApi(api).albums.getAlbum(albumId),
    enabled: api !== null && !!albumId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useAlbumTracks = (albumId: string, limit = 50, offset = 0) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "album", albumId, "tracks", limit, offset],
    queryFn: () =>
      requireApi(api).albums.getAlbumTracks(albumId, { limit, offset }),
    enabled: api !== null && !!albumId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSavedAlbums = (limit = 50, offset = 0) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "me", "albums", limit, offset],
    queryFn: () => requireApi(api).albums.getUserSavedAlbums({ limit, offset }),
    enabled: api !== null,
    staleTime: 5 * 60 * 1000,
  });
};
