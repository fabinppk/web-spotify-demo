import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  renderHook,
  waitFor,
  // act
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("../useSpotifyApi", () => ({ useSpotifyApi: vi.fn() }));

import { useSpotifyApi } from "../useSpotifyApi";
import {
  useCurrentUserProfile,
  useSearchQuery,
  useInfiniteSearchQuery,
  useArtist,
  useFollowedArtists,
  useInfiniteFollowedArtists,
  useTopArtists,
  useInfiniteArtistAlbums,
  useArtistTopTracks,
  useAlbum,
  useSavedAlbums,
  useTrack,
  useSavedTracks,
  useUserTopTracks,
  useUserPlaylists,
  useCategories,
  useCategoryPlaylists,
  useNewReleases,
  useCurrentPlayback,
  useCurrentlyPlaying,
  useAvailableDevices,
} from "../useSpotifyQueries";

const mockApi = {
  getCurrentUserProfile: vi.fn(),
  search: { search: vi.fn() },
  artists: {
    getArtist: vi.fn(),
    getFollowedArtists: vi.fn(),
    getTopArtists: vi.fn(),
    getArtistAlbums: vi.fn(),
    getArtistTopTracks: vi.fn(),
  },
  albums: { getAlbum: vi.fn(), getUserSavedAlbums: vi.fn() },
  tracks: {
    getTrack: vi.fn(),
    getUserSavedTracks: vi.fn(),
    getUserTopTracks: vi.fn(),
  },
  playlists: { getCurrentUserPlaylists: vi.fn() },
  browse: {
    getCategories: vi.fn(),
    getCategoryPlaylists: vi.fn(),
    getNewReleases: vi.fn(),
  },
  playback: {
    getCurrentPlayback: vi.fn(),
    getCurrentlyPlaying: vi.fn(),
    getAvailableDevices: vi.fn(),
  },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
}

describe("useCurrentUserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches current user profile", async () => {
    const mockProfile = { id: "user1", display_name: "Test", country: "BR" };
    mockApi.getCurrentUserProfile.mockResolvedValue(mockProfile);
    const { result } = renderHook(() => useCurrentUserProfile(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockProfile);
  });

  it("is disabled when api is null", () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { result } = renderHook(() => useCurrentUserProfile(), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useSearchQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches search results", async () => {
    const mockResult = { artists: { items: [{ id: "a1" }] } };
    mockApi.search.search.mockResolvedValue(mockResult);
    const { result } = renderHook(
      () => useSearchQuery("metallica", ["artist"], 10),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.search.search).toHaveBeenCalledWith(
      "metallica",
      ["artist"],
      { limit: 10 },
    );
  });

  it("is disabled when query is empty", () => {
    const { result } = renderHook(() => useSearchQuery("", ["artist"]), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("is disabled when api is null", () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { result } = renderHook(() => useSearchQuery("rock", ["artist"]), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useInfiniteSearchQuery — getNextPageParam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("parses offset from artists.next URL", async () => {
    const page1 = {
      artists: {
        items: [{ id: "a1" }],
        next: "https://api.spotify.com/v1/search?offset=10&limit=10",
      },
    };
    mockApi.search.search.mockResolvedValue(page1);
    const { result } = renderHook(
      () => useInfiniteSearchQuery("top", ["artist"], 10),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("returns no next page when artists.next is null", async () => {
    const page1 = {
      artists: { items: [{ id: "a1" }], next: null },
    };
    mockApi.search.search.mockResolvedValue(page1);
    const { result } = renderHook(
      () => useInfiniteSearchQuery("top", ["artist"], 10),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  it("is disabled when query is empty", () => {
    const { result } = renderHook(() => useInfiniteSearchQuery(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useArtist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches artist by id", async () => {
    const mockArtist = { id: "artist1", name: "Test Artist" };
    mockApi.artists.getArtist.mockResolvedValue(mockArtist);
    const { result } = renderHook(() => useArtist("artist1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.artists.getArtist).toHaveBeenCalledWith("artist1");
  });

  it("is disabled when artistId is empty", () => {
    const { result } = renderHook(() => useArtist(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useFollowedArtists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches followed artists", async () => {
    const mockData = { artists: { items: [], total: 0 } };
    mockApi.artists.getFollowedArtists.mockResolvedValue(mockData);
    const { result } = renderHook(() => useFollowedArtists(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.artists.getFollowedArtists).toHaveBeenCalledWith({
      limit: 50,
    });
  });

  it("is disabled when api is null", () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { result } = renderHook(() => useFollowedArtists(), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useInfiniteFollowedArtists — cursor pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("parses after cursor from next URL", async () => {
    const page1 = {
      artists: {
        items: [{ id: "a1" }],
        next: "https://api.spotify.com/v1/me/following?after=cursor123&type=artist",
      },
    };
    mockApi.artists.getFollowedArtists.mockResolvedValue(page1);
    const { result } = renderHook(() => useInfiniteFollowedArtists(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("returns no next page when artists.next is null", async () => {
    const page1 = { artists: { items: [], next: null } };
    mockApi.artists.getFollowedArtists.mockResolvedValue(page1);
    const { result } = renderHook(() => useInfiniteFollowedArtists(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });
});

describe("useTopArtists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches top artists with default limit", async () => {
    const mockData = { artists: [{ id: "a1" }] };
    mockApi.artists.getTopArtists.mockResolvedValue(mockData);
    const { result } = renderHook(() => useTopArtists(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.artists.getTopArtists).toHaveBeenCalledWith({ limit: 20 });
  });
});

describe("useInfiniteArtistAlbums — offset pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("parses offset from next URL", async () => {
    const page1 = {
      items: [],
      next: "https://api.spotify.com/v1/artists/a1/albums?offset=8&limit=8",
    };
    mockApi.artists.getArtistAlbums.mockResolvedValue(page1);
    const { result } = renderHook(() => useInfiniteArtistAlbums("a1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });

  it("returns no next page when next is null", async () => {
    mockApi.artists.getArtistAlbums.mockResolvedValue({
      items: [],
      next: null,
    });
    const { result } = renderHook(() => useInfiniteArtistAlbums("a1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(false);
  });

  it("is disabled when artistId is empty", () => {
    const { result } = renderHook(() => useInfiniteArtistAlbums(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useArtistTopTracks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches top tracks after profile loads", async () => {
    mockApi.getCurrentUserProfile.mockResolvedValue({ country: "BR" });
    mockApi.artists.getArtistTopTracks.mockResolvedValue({ tracks: [] });
    const { result } = renderHook(() => useArtistTopTracks("artist1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.artists.getArtistTopTracks).toHaveBeenCalledWith("artist1", {
      market: "BR",
    });
  });

  it("is disabled when artistId is empty", () => {
    mockApi.getCurrentUserProfile.mockResolvedValue({ country: "BR" });
    const { result } = renderHook(() => useArtistTopTracks(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useAlbum", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches album by id", async () => {
    const mockAlbum = { id: "album1", name: "Test Album" };
    mockApi.albums.getAlbum.mockResolvedValue(mockAlbum);
    const { result } = renderHook(() => useAlbum("album1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockAlbum);
  });

  it("is disabled when albumId is empty", () => {
    const { result } = renderHook(() => useAlbum(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useSavedAlbums", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches saved albums", async () => {
    const mockData = { items: [], total: 0 };
    mockApi.albums.getUserSavedAlbums.mockResolvedValue(mockData);
    const { result } = renderHook(() => useSavedAlbums(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.albums.getUserSavedAlbums).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
    });
  });
});

describe("useTrack", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches track by id", async () => {
    const mockTrack = { id: "t1", name: "Track 1" };
    mockApi.tracks.getTrack.mockResolvedValue(mockTrack);
    const { result } = renderHook(() => useTrack("t1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTrack);
  });

  it("is disabled when trackId is empty", () => {
    const { result } = renderHook(() => useTrack(""), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useSavedTracks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches saved tracks with default params", async () => {
    mockApi.tracks.getUserSavedTracks.mockResolvedValue({ items: [] });
    const { result } = renderHook(() => useSavedTracks(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.tracks.getUserSavedTracks).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
    });
  });
});

describe("useUserTopTracks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches user top tracks after profile loads", async () => {
    mockApi.getCurrentUserProfile.mockResolvedValue({ country: "BR" });
    mockApi.tracks.getUserTopTracks.mockResolvedValue({ items: [] });
    const { result } = renderHook(() => useUserTopTracks("artist1"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.tracks.getUserTopTracks).toHaveBeenCalled();
  });
});

describe("useUserPlaylists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches current user playlists", async () => {
    const mockData = { items: [], total: 0 };
    mockApi.playlists.getCurrentUserPlaylists.mockResolvedValue(mockData);
    const { result } = renderHook(() => useUserPlaylists(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.playlists.getCurrentUserPlaylists).toHaveBeenCalledWith({
      limit: 50,
      offset: 0,
    });
  });
});

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches browse categories", async () => {
    mockApi.browse.getCategories.mockResolvedValue({
      categories: { items: [] },
    });
    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.browse.getCategories).toHaveBeenCalledWith({ limit: 50 });
  });
});

describe("useCategoryPlaylists", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches playlists for a category", async () => {
    mockApi.browse.getCategoryPlaylists.mockResolvedValue({
      playlists: { items: [] },
    });
    const { result } = renderHook(() => useCategoryPlaylists("pop"), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.browse.getCategoryPlaylists).toHaveBeenCalledWith("pop", {
      limit: 20,
    });
  });

  it("is disabled when categoryId is undefined", () => {
    const { result } = renderHook(() => useCategoryPlaylists(undefined), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useNewReleases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches new releases", async () => {
    mockApi.browse.getNewReleases.mockResolvedValue({ albums: { items: [] } });
    const { result } = renderHook(() => useNewReleases(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockApi.browse.getNewReleases).toHaveBeenCalledWith({
      limit: 20,
      offset: 0,
    });
  });
});

describe("useCurrentPlayback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches current playback state", async () => {
    const mockPlayback = { is_playing: true, item: null };
    mockApi.playback.getCurrentPlayback.mockResolvedValue(mockPlayback);
    const { result } = renderHook(() => useCurrentPlayback(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPlayback);
  });

  it("is disabled when api is null", () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { result } = renderHook(() => useCurrentPlayback(), {
      wrapper: createWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
  });
});

describe("useCurrentlyPlaying", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches currently playing track", async () => {
    const mockData = { is_playing: true, item: { id: "t1" } };
    mockApi.playback.getCurrentlyPlaying.mockResolvedValue(mockData);
    const { result } = renderHook(() => useCurrentlyPlaying(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});

describe("useAvailableDevices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("fetches available devices", async () => {
    const mockDevices = { devices: [{ id: "dev1", name: "My Device" }] };
    mockApi.playback.getAvailableDevices.mockResolvedValue(mockDevices);
    const { result } = renderHook(() => useAvailableDevices(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockDevices);
  });
});
