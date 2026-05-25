import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchApi } from "../search.api";
import { SpotifyApiClient } from "../base.api";

// Mock the SpotifyApiClient
vi.mock("../base.api", () => ({
  SpotifyApiClient: vi.fn(),
}));

describe("SearchApi", () => {
  let SearchApi: SearchApi;
  let mockApiClient: {
    get: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockApiClient = {
      get: vi.fn(),
    };

    SearchApi = new SearchApi(mockApiClient as unknown as SpotifyApiClient);
  });

  describe("search", () => {
    it("should search for multiple types with basic parameters", async () => {
      const mockSearchResult = {
        albums: { items: [] },
        artists: { items: [] },
        tracks: { items: [] },
      };
      mockApiClient.get.mockResolvedValue(mockSearchResult);

      const result = await SearchApi.search("test query", [
        "album",
        "artist",
        "track",
      ]);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "test query",
        type: "album,artist,track",
      });
      expect(result).toEqual(mockSearchResult);
    });

    it("should search with all optional parameters", async () => {
      const mockSearchResult = {
        albums: { items: [] },
      };
      mockApiClient.get.mockResolvedValue(mockSearchResult);

      const options = {
        market: "US",
        limit: 20,
        offset: 10,
        include_external: "audio" as const,
      };

      const result = await SearchApi.search("test", ["album"], options);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "test",
        type: "album",
        market: "US",
        limit: 20,
        offset: 10,
        include_external: "audio",
      });
      expect(result).toEqual(mockSearchResult);
    });

    it("should handle single type search", async () => {
      const mockSearchResult = {
        tracks: { items: [{ id: "track1", name: "Test Track" }] },
      };
      mockApiClient.get.mockResolvedValue(mockSearchResult);

      const result = await SearchApi.search("love", ["track"]);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "love",
        type: "track",
      });
      expect(result).toEqual(mockSearchResult);
    });

    it("should handle all available types", async () => {
      const mockSearchResult = {
        albums: { items: [] },
        artists: { items: [] },
        playlists: { items: [] },
        tracks: { items: [] },
        shows: { items: [] },
        episodes: { items: [] },
      };
      mockApiClient.get.mockResolvedValue(mockSearchResult);

      const result = await SearchApi.search("test", [
        "album",
        "artist",
        "playlist",
        "track",
        "show",
        "episode",
      ]);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "test",
        type: "album,artist,playlist,track,show,episode",
      });
      expect(result).toEqual(mockSearchResult);
    });
  });

  describe("searchAlbums", () => {
    it("should search for albums without options", async () => {
      const mockAlbumsResult = {
        albums: { items: [{ id: "album1", name: "Test Album" }] },
      };
      mockApiClient.get.mockResolvedValue(mockAlbumsResult);

      const result = await SearchApi.searchAlbums("beatles");

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "beatles",
        type: "album",
      });
      expect(result).toEqual(mockAlbumsResult);
    });

    it("should search for albums with options", async () => {
      const mockAlbumsResult = { albums: { items: [] } };
      mockApiClient.get.mockResolvedValue(mockAlbumsResult);

      const options = {
        market: "GB",
        limit: 15,
        offset: 5,
      };

      const result = await SearchApi.searchAlbums("rock", options);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "rock",
        type: "album",
        market: "GB",
        limit: 15,
        offset: 5,
      });
      expect(result).toEqual(mockAlbumsResult);
    });
  });

  describe("searchArtists", () => {
    it("should search for artists without options", async () => {
      const mockArtistsResult = {
        artists: { items: [{ id: "artist1", name: "Test Artist" }] },
      };
      mockApiClient.get.mockResolvedValue(mockArtistsResult);

      const result = await SearchApi.searchArtists("coldplay");

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "coldplay",
        type: "artist",
      });
      expect(result).toEqual(mockArtistsResult);
    });

    it("should search for artists with options", async () => {
      const mockArtistsResult = { artists: { items: [] } };
      mockApiClient.get.mockResolvedValue(mockArtistsResult);

      const options = {
        market: "CA",
        limit: 10,
      };

      const result = await SearchApi.searchArtists("jazz", options);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "jazz",
        type: "artist",
        market: "CA",
        limit: 10,
      });
      expect(result).toEqual(mockArtistsResult);
    });
  });

  describe("searchPlaylists", () => {
    it("should search for playlists without options", async () => {
      const mockPlaylistsResult = {
        playlists: { items: [{ id: "playlist1", name: "Test Playlist" }] },
      };
      mockApiClient.get.mockResolvedValue(mockPlaylistsResult);

      const result = await SearchApi.searchPlaylists("workout");

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "workout",
        type: "playlist",
      });
      expect(result).toEqual(mockPlaylistsResult);
    });

    it("should search for playlists with options", async () => {
      const mockPlaylistsResult = { playlists: { items: [] } };
      mockApiClient.get.mockResolvedValue(mockPlaylistsResult);

      const options = {
        market: "DE",
        limit: 25,
        offset: 0,
      };

      const result = await SearchApi.searchPlaylists("chill", options);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "chill",
        type: "playlist",
        market: "DE",
        limit: 25,
        offset: 0,
      });
      expect(result).toEqual(mockPlaylistsResult);
    });
  });

  describe("searchTracks", () => {
    it("should search for tracks without options", async () => {
      const mockTracksResult = {
        tracks: { items: [{ id: "track1", name: "Test Track" }] },
      };
      mockApiClient.get.mockResolvedValue(mockTracksResult);

      const result = await SearchApi.searchTracks("bohemian rhapsody");

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "bohemian rhapsody",
        type: "track",
      });
      expect(result).toEqual(mockTracksResult);
    });

    it("should search for tracks with options", async () => {
      const mockTracksResult = { tracks: { items: [] } };
      mockApiClient.get.mockResolvedValue(mockTracksResult);

      const options = {
        market: "FR",
        limit: 50,
        offset: 20,
        include_external: "audio" as const,
      };

      const result = await SearchApi.searchTracks("love song", options);

      expect(mockApiClient.get).toHaveBeenCalledWith("/search", {
        q: "love song",
        type: "track",
        market: "FR",
        limit: 50,
        offset: 20,
        include_external: "audio",
      });
      expect(result).toEqual(mockTracksResult);
    });
  });

  describe("error handling", () => {
    it("should handle API errors gracefully", async () => {
      const apiError = new Error("API Error");
      mockApiClient.get.mockRejectedValue(apiError);

      await expect(SearchApi.search("test", ["track"])).rejects.toThrow(
        "API Error",
      );
    });
  });
});
