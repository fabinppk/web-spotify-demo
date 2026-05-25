import { useQuery, useInfiniteQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";
import { useCurrentUserProfile } from "./me";

export const useArtist = (artistId: string) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "artist", artistId],
    queryFn: () => requireApi(api).artists.getArtist(artistId),
    enabled: api !== null && !!artistId,
  });
};

export const useArtistAlbums = (artistId: string, limit = 10, offset = 0) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "artist", artistId, "albums", limit, offset],
    queryFn: () =>
      requireApi(api).artists.getArtistAlbums(artistId, {
        include_groups: "album,single,compilation",
        limit,
        ...(offset > 0 && { offset }),
      }),
    enabled: api !== null && !!artistId,
  });
};

export const useInfiniteArtistAlbums = (artistId: string, limit = 8) => {
  const api = useSpotifyApi();
  return useInfiniteQuery({
    queryKey: ["spotify", "artist", artistId, "albums", "infinite", limit],
    queryFn: ({ pageParam }) =>
      requireApi(api).artists.getArtistAlbums(artistId, {
        include_groups: "album,single,compilation",
        limit,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PaginatedResponse<Album>) => {
      if (!lastPage.next) return undefined;
      return Number(new URL(lastPage.next).searchParams.get("offset"));
    },
    enabled: api !== null && !!artistId,
  });
};

export const useArtistTopTracks = (artistId: string) => {
  const api = useSpotifyApi();
  const { data: profile, isLoading: profileLoading } = useCurrentUserProfile();
  const market = profile?.country;
  const query = useQuery({
    queryKey: ["spotify", "artist", artistId, "top-tracks", market],
    queryFn: () =>
      requireApi(api).artists.getArtistTopTracks(artistId, { market }),
    enabled: api !== null && !!artistId && profile !== undefined,
  });
  return { ...query, isLoading: query.isLoading || profileLoading };
};

export const useFollowedArtists = (limit = 50) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "me", "following", "artists", limit],
    queryFn: () => requireApi(api).artists.getFollowedArtists({ limit }),
    enabled: api !== null,
  });
};

export const useInfiniteFollowedArtists = (limit = 20) => {
  const api = useSpotifyApi();
  return useInfiniteQuery({
    queryKey: ["spotify", "me", "following", "artists", "infinite", limit],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      requireApi(api).artists.getFollowedArtists({ limit, after: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: { artists: PaginatedResponse<Artist> }) => {
      const next = lastPage.artists.next;
      if (!next) return undefined;
      return new URL(next).searchParams.get("after") ?? undefined;
    },
    enabled: api !== null,
  });
};

export const useTopArtists = (limit = 20) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "me", "top", "artists", limit],
    queryFn: () => requireApi(api).artists.getTopArtists({ limit }),
    enabled: api !== null,
  });
};
