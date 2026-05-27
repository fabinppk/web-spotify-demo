import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("../useSpotifyApi", () => ({ useSpotifyApi: vi.fn() }));

import { useSpotifyApi } from "../useSpotifyApi";
import {
  useLibraryControls,
  usePlaylistControls,
} from "../useSpotifyMutations";

const mockApi = {
  tracks: { saveTracks: vi.fn(), removeTracks: vi.fn() },
  albums: { saveAlbums: vi.fn(), removeAlbums: vi.fn() },
  playlists: {
    addItemsToPlaylist: vi.fn(),
    removeItemsFromPlaylist: vi.fn(),
  },
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
  };
}

describe("useLibraryControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("saveTrack calls saveTracks with wrapped array", async () => {
    mockApi.tracks.saveTracks.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLibraryControls(), { wrapper });
    await act(async () => {
      await result.current.saveTrack.mutateAsync("track-1");
    });
    expect(mockApi.tracks.saveTracks).toHaveBeenCalledWith(["track-1"]);
  });

  it("removeTrack calls removeTracks", async () => {
    mockApi.tracks.removeTracks.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLibraryControls(), { wrapper });
    await act(async () => {
      await result.current.removeTrack.mutateAsync("track-1");
    });
    expect(mockApi.tracks.removeTracks).toHaveBeenCalledWith(["track-1"]);
  });

  it("saveAlbum calls saveAlbums", async () => {
    mockApi.albums.saveAlbums.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLibraryControls(), { wrapper });
    await act(async () => {
      await result.current.saveAlbum.mutateAsync("album-1");
    });
    expect(mockApi.albums.saveAlbums).toHaveBeenCalledWith(["album-1"]);
  });

  it("saveTrack throws Not authenticated when api null", async () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLibraryControls(), { wrapper });
    await expect(result.current.saveTrack.mutateAsync("t1")).rejects.toThrow(
      "Not authenticated",
    );
  });
});

describe("usePlaylistControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("addToPlaylist calls addItemsToPlaylist", async () => {
    mockApi.playlists.addItemsToPlaylist.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaylistControls(), { wrapper });
    await act(async () => {
      await result.current.addToPlaylist.mutateAsync({
        playlistId: "pl-1",
        uris: ["uri1"],
      });
    });
    expect(mockApi.playlists.addItemsToPlaylist).toHaveBeenCalledWith("pl-1", {
      uris: ["uri1"],
    });
  });

  it("removeFromPlaylist calls removeItemsFromPlaylist", async () => {
    mockApi.playlists.removeItemsFromPlaylist.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaylistControls(), { wrapper });
    await act(async () => {
      await result.current.removeFromPlaylist.mutateAsync({
        playlistId: "pl-1",
        tracks: [{ uri: "uri1" }],
      });
    });
    expect(mockApi.playlists.removeItemsFromPlaylist).toHaveBeenCalledWith(
      "pl-1",
      [{ uri: "uri1" }],
    );
  });

  it("addToPlaylist throws Not authenticated when api null", async () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaylistControls(), { wrapper });
    await expect(
      result.current.addToPlaylist.mutateAsync({
        playlistId: "pl-1",
        uris: [],
      }),
    ).rejects.toThrow("Not authenticated");
  });

  it("saveAlbum onSuccess invalidates library query", async () => {
    mockApi.albums.saveAlbums.mockResolvedValue(undefined);
    const { wrapper, queryClient } = createWrapper();
    const spy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useLibraryControls(), { wrapper });
    await act(async () => {
      await result.current.saveAlbum.mutateAsync("album-1");
    });
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["spotify", "me"] }),
    );
  });
});
