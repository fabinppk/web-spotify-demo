import { useQuery, useInfiniteQuery } from "@/modules";
import { useSpotifyApi } from "@/hooks/useSpotifyApi";
import { requireApi } from "./requireApi";

export const useSearchQuery = (
  query: string,
  types: ("track" | "artist" | "album" | "playlist" | "show" | "episode")[] = [
    "track",
    "artist",
    "album",
  ],
  limit = 10,
) => {
  const api = useSpotifyApi();
  return useQuery({
    queryKey: ["spotify", "search", query, types, limit],
    queryFn: () => requireApi(api).search.search(query, types, { limit }),
    enabled: api !== null && query.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useInfiniteSearchQuery = (
  query: string,
  types: ("track" | "artist" | "album" | "playlist" | "show" | "episode")[] = [
    "artist",
  ],
  limit = 10,
) => {
  const api = useSpotifyApi();
  return useInfiniteQuery({
    queryKey: ["spotify", "search", "infinite", query, types, limit],
    queryFn: ({ pageParam }) =>
      requireApi(api).search.search(query, types, { limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: SearchResult) => {
      const next = lastPage.artists?.next ?? lastPage.albums?.next;
      if (!next) return undefined;
      return Number(new URL(next).searchParams.get("offset"));
    },
    enabled: api !== null && query.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
