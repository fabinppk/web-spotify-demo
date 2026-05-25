import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";

vi.mock("../useSpotifyApi", () => ({ useSpotifyApi: vi.fn() }));

import { useSpotifyApi } from "../useSpotifyApi";
import {
  usePlaybackControls,
  useLibraryControls,
  usePlaylistControls,
} from "../useSpotifyMutations";

const mockApi = {
  playback: {
    startResumePlayback: vi.fn(),
    pausePlayback: vi.fn(),
    skipToNext: vi.fn(),
    skipToPrevious: vi.fn(),
    seekToPosition: vi.fn(),
    setPlaybackVolume: vi.fn(),
    setRepeatMode: vi.fn(),
    toggleShuffle: vi.fn(),
    transferPlayback: vi.fn(),
  },
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

describe("usePlaybackControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSpotifyApi).mockReturnValue(mockApi as never);
  });

  it("play calls startResumePlayback", async () => {
    mockApi.playback.startResumePlayback.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.play.mutateAsync({});
    });
    expect(mockApi.playback.startResumePlayback).toHaveBeenCalled();
  });

  it("play throws Not authenticated when api is null", async () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await expect(result.current.play.mutateAsync({})).rejects.toThrow(
      "Not authenticated",
    );
  });

  it("pause calls pausePlayback", async () => {
    mockApi.playback.pausePlayback.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.pause.mutateAsync("device-1");
    });
    expect(mockApi.playback.pausePlayback).toHaveBeenCalledWith("device-1");
  });

  it("pause throws Not authenticated when api is null", async () => {
    vi.mocked(useSpotifyApi).mockReturnValue(null);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await expect(result.current.pause.mutateAsync("device-1")).rejects.toThrow(
      "Not authenticated",
    );
  });

  it("next calls skipToNext", async () => {
    mockApi.playback.skipToNext.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.next.mutateAsync("device-1");
    });
    expect(mockApi.playback.skipToNext).toHaveBeenCalled();
  });

  it("previous calls skipToPrevious", async () => {
    mockApi.playback.skipToPrevious.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.previous.mutateAsync("device-1");
    });
    expect(mockApi.playback.skipToPrevious).toHaveBeenCalled();
  });

  it("seek calls seekToPosition with positionMs and deviceId", async () => {
    mockApi.playback.seekToPosition.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.seek.mutateAsync({
        positionMs: 30000,
        deviceId: "dev",
      });
    });
    expect(mockApi.playback.seekToPosition).toHaveBeenCalledWith(30000, "dev");
  });

  it("setVolume calls setPlaybackVolume", async () => {
    mockApi.playback.setPlaybackVolume.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.setVolume.mutateAsync({ volumePercent: 80 });
    });
    expect(mockApi.playback.setPlaybackVolume).toHaveBeenCalledWith(
      80,
      undefined,
    );
  });

  it("setRepeat calls setRepeatMode", async () => {
    mockApi.playback.setRepeatMode.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.setRepeat.mutateAsync({ state: "track" });
    });
    expect(mockApi.playback.setRepeatMode).toHaveBeenCalledWith(
      "track",
      undefined,
    );
  });

  it("setShuffle calls toggleShuffle", async () => {
    mockApi.playback.toggleShuffle.mockResolvedValue(undefined);
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.setShuffle.mutateAsync({ state: true });
    });
    expect(mockApi.playback.toggleShuffle).toHaveBeenCalledWith(
      true,
      undefined,
    );
  });

  it("transferPlayback invalidates both playback and devices queries", async () => {
    mockApi.playback.transferPlayback.mockResolvedValue(undefined);
    const { wrapper, queryClient } = createWrapper();
    const spy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.transferPlayback.mutateAsync({
        deviceIds: ["dev-1"],
      });
    });
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["spotify", "playback"] }),
    );
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["spotify", "devices"] }),
    );
  });

  it("play onSuccess invalidates playback query", async () => {
    mockApi.playback.startResumePlayback.mockResolvedValue(undefined);
    const { wrapper, queryClient } = createWrapper();
    const spy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => usePlaybackControls(), { wrapper });
    await act(async () => {
      await result.current.play.mutateAsync({});
    });
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ["spotify", "playback"] }),
    );
  });
});

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
});
