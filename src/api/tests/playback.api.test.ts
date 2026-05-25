import { describe, it, expect, vi, beforeEach } from "vitest";
import { PlaybackApi as PlaybackApiServices } from "../playback.api";
import type { SpotifyApiClient } from "../base.api";

const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
} as unknown as SpotifyApiClient;

const PlaybackApi = new PlaybackApiServices(mockApiClient);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PlaybackApi", () => {
  describe("getCurrentPlayback", () => {
    it("should get current playback state with parameters", async () => {
      mockApiClient.get = vi.fn().mockResolvedValue("playback-state");
      const result = await PlaybackApi.getCurrentPlayback("US", "episode");
      expect(mockApiClient.get).toHaveBeenCalledWith("/me/player", {
        market: "US",
        additional_types: "episode",
      });
      expect(result).toBe("playback-state");
    });

    it("should get current playback state without parameters", async () => {
      mockApiClient.get = vi.fn().mockResolvedValue("playback-state");
      const result = await PlaybackApi.getCurrentPlayback();
      expect(mockApiClient.get).toHaveBeenCalledWith("/me/player", {});
      expect(result).toBe("playback-state");
    });

    it("should return null for 204 status (no active device)", async () => {
      const error = { response: { status: 204 } };
      mockApiClient.get = vi.fn().mockRejectedValue(error);
      const result = await PlaybackApi.getCurrentPlayback();
      expect(result).toBeNull();
    });

    it("should throw error for non-204 errors", async () => {
      const error = new Error("API Error");
      mockApiClient.get = vi.fn().mockRejectedValue(error);
      await expect(PlaybackApi.getCurrentPlayback()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("transferPlayback", () => {
    it("should transfer playback with play=false", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.transferPlayback(["device1", "device2"]);
      expect(mockApiClient.put).toHaveBeenCalledWith("/me/player", {
        device_ids: ["device1", "device2"],
        play: false,
      });
    });

    it("should transfer playback with play=true", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.transferPlayback(["device1"], true);
      expect(mockApiClient.put).toHaveBeenCalledWith("/me/player", {
        device_ids: ["device1"],
        play: true,
      });
    });
  });

  describe("getAvailableDevices", () => {
    it("should get available devices", async () => {
      const devices = { devices: [{ id: "device1", name: "Speaker" }] };
      mockApiClient.get = vi.fn().mockResolvedValue(devices);
      const result = await PlaybackApi.getAvailableDevices();
      expect(mockApiClient.get).toHaveBeenCalledWith("/me/player/devices");
      expect(result).toEqual(devices);
    });
  });

  describe("getCurrentlyPlaying", () => {
    it("should get currently playing with parameters", async () => {
      mockApiClient.get = vi.fn().mockResolvedValue("currently-playing");
      const result = await PlaybackApi.getCurrentlyPlaying("US", "episode");
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/me/player/currently-playing",
        {
          market: "US",
          additional_types: "episode",
        },
      );
      expect(result).toBe("currently-playing");
    });

    it("should get currently playing without parameters", async () => {
      mockApiClient.get = vi.fn().mockResolvedValue("currently-playing");
      const result = await PlaybackApi.getCurrentlyPlaying();
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/me/player/currently-playing",
        {},
      );
      expect(result).toBe("currently-playing");
    });

    it("should return null for 204 status (no track playing)", async () => {
      const error = { response: { status: 204 } };
      mockApiClient.get = vi.fn().mockRejectedValue(error);
      const result = await PlaybackApi.getCurrentlyPlaying();
      expect(result).toBeNull();
    });

    it("should throw error for non-204 errors", async () => {
      const error = new Error("API Error");
      mockApiClient.get = vi.fn().mockRejectedValue(error);
      await expect(PlaybackApi.getCurrentlyPlaying()).rejects.toThrow(
        "API Error",
      );
    });
  });

  describe("startResumePlayback", () => {
    it("should start playback without options", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.startResumePlayback();
      expect(mockApiClient.put).toHaveBeenCalledWith("/me/player/play", null);
    });

    it("should start playback with device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      const options = {
        device_id: "device1",
        context_uri: "spotify:album:123",
      };
      await PlaybackApi.startResumePlayback(options);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/play?device_id=device1",
        {
          context_uri: "spotify:album:123",
        },
      );
    });

    it("should start playbook with full options", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      const options = {
        context_uri: "spotify:album:123",
        uris: ["spotify:track:456"],
        offset: { position: 1 },
        position_ms: 30000,
      };
      await PlaybackApi.startResumePlayback(options);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/play",
        options,
      );
    });
  });

  describe("pausePlayback", () => {
    it("should pause playback without device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.pausePlayback();
      expect(mockApiClient.put).toHaveBeenCalledWith("/me/player/pause");
    });

    it("should pause playback with device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.pausePlayback("device1");
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/pause?device_id=device1",
      );
    });
  });

  describe("skipToNext", () => {
    it("should skip to next track without device_id", async () => {
      mockApiClient.post = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.skipToNext();
      expect(mockApiClient.post).toHaveBeenCalledWith("/me/player/next");
    });

    it("should skip to next track with device_id", async () => {
      mockApiClient.post = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.skipToNext("device1");
      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/me/player/next?device_id=device1",
      );
    });
  });

  describe("skipToPrevious", () => {
    it("should skip to previous track without device_id", async () => {
      mockApiClient.post = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.skipToPrevious();
      expect(mockApiClient.post).toHaveBeenCalledWith("/me/player/previous");
    });

    it("should skip to previous track with device_id", async () => {
      mockApiClient.post = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.skipToPrevious("device1");
      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/me/player/previous?device_id=device1",
      );
    });
  });

  describe("seekToPosition", () => {
    it("should seek to position without device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.seekToPosition(30000);
      expect(mockApiClient.put).toHaveBeenCalledWith("/me/player/seek", null, {
        params: { position_ms: 30000 },
      });
    });

    it("should seek to position with device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.seekToPosition(45000, "device1");
      expect(mockApiClient.put).toHaveBeenCalledWith("/me/player/seek", null, {
        params: { position_ms: 45000, device_id: "device1" },
      });
    });
  });

  describe("setRepeatMode", () => {
    it("should set repeat mode without device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.setRepeatMode("track");
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/repeat",
        null,
        {
          params: { state: "track" },
        },
      );
    });

    it("should set repeat mode with device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.setRepeatMode("context", "device1");
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/repeat",
        null,
        {
          params: { state: "context", device_id: "device1" },
        },
      );
    });
  });

  describe("setPlaybackVolume", () => {
    it("should set volume without device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.setPlaybackVolume(50);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/volume",
        null,
        {
          params: { volume_percent: 50 },
        },
      );
    });

    it("should set volume with device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.setPlaybackVolume(75, "device1");
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/volume",
        null,
        {
          params: { volume_percent: 75, device_id: "device1" },
        },
      );
    });

    it("should throw error for volume below 0", async () => {
      await expect(PlaybackApi.setPlaybackVolume(-1)).rejects.toThrow(
        "Volume percent must be between 0 and 100",
      );
    });

    it("should throw error for volume above 100", async () => {
      await expect(PlaybackApi.setPlaybackVolume(101)).rejects.toThrow(
        "Volume percent must be between 0 and 100",
      );
    });

    it("should accept volume at boundary values", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.setPlaybackVolume(0);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/volume",
        null,
        {
          params: { volume_percent: 0 },
        },
      );

      await PlaybackApi.setPlaybackVolume(100);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/volume",
        null,
        {
          params: { volume_percent: 100 },
        },
      );
    });
  });

  describe("toggleShuffle", () => {
    it("should toggle shuffle on without device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.toggleShuffle(true);
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/shuffle",
        null,
        {
          params: { state: true },
        },
      );
    });

    it("should toggle shuffle off with device_id", async () => {
      mockApiClient.put = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.toggleShuffle(false, "device1");
      expect(mockApiClient.put).toHaveBeenCalledWith(
        "/me/player/shuffle",
        null,
        {
          params: { state: false, device_id: "device1" },
        },
      );
    });
  });

  describe("getRecentlyPlayedTracks", () => {
    it("should get recently played tracks without options", async () => {
      const recentTracks = {
        items: [],
        href: "https://api.spotify.com",
        limit: 20,
        cursors: {},
      };
      mockApiClient.get = vi.fn().mockResolvedValue(recentTracks);
      const result = await PlaybackApi.getRecentlyPlayedTracks();
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/me/player/recently-played",
        undefined,
      );
      expect(result).toEqual(recentTracks);
    });

    it("should get recently played tracks with options", async () => {
      const recentTracks = {
        items: [],
        href: "https://api.spotify.com",
        limit: 10,
        cursors: {},
      };
      mockApiClient.get = vi.fn().mockResolvedValue(recentTracks);
      const options = { limit: 10, after: 1234567890, before: 1234567900 };
      const result = await PlaybackApi.getRecentlyPlayedTracks(options);
      expect(mockApiClient.get).toHaveBeenCalledWith(
        "/me/player/recently-played",
        options,
      );
      expect(result).toEqual(recentTracks);
    });
  });

  describe("getUserQueue", () => {
    it("should get user queue", async () => {
      const queue = {
        currently_playing: { id: "track1" },
        queue: [{ id: "track2" }],
      };
      mockApiClient.get = vi.fn().mockResolvedValue(queue);
      const result = await PlaybackApi.getUserQueue();
      expect(mockApiClient.get).toHaveBeenCalledWith("/me/player/queue");
      expect(result).toEqual(queue);
    });
  });

  describe("addItemToPlaybackQueue", () => {
    it("should add item to queue without device_id", async () => {
      mockApiClient.post = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.addItemToPlaybackQueue("spotify:track:123");
      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/me/player/queue",
        null,
        {
          params: { uri: "spotify:track:123" },
        },
      );
    });

    it("should add item to queue with device_id", async () => {
      mockApiClient.post = vi.fn().mockResolvedValue(undefined);
      await PlaybackApi.addItemToPlaybackQueue("spotify:track:456", "device1");
      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/me/player/queue",
        null,
        {
          params: { uri: "spotify:track:456", device_id: "device1" },
        },
      );
    });
  });
});
