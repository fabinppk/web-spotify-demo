import { useMutation, useQueryClient } from "@/modules";
import { useSpotifyApi } from "./useSpotifyApi";

export const useLibraryControls = () => {
  const api = useSpotifyApi();
  const queryClient = useQueryClient();

  const invalidateLibrary = () => {
    queryClient.invalidateQueries({ queryKey: ["spotify", "me"] });
  };

  const saveTrack = useMutation({
    mutationFn: (trackId: string) => {
      if (!api) throw new Error("Not authenticated");
      return api.tracks.saveTracks([trackId]);
    },
    onSuccess: invalidateLibrary,
  });

  const removeTrack = useMutation({
    mutationFn: (trackId: string) => {
      if (!api) throw new Error("Not authenticated");
      return api.tracks.removeTracks([trackId]);
    },
    onSuccess: invalidateLibrary,
  });

  const saveAlbum = useMutation({
    mutationFn: (albumId: string) => {
      if (!api) throw new Error("Not authenticated");
      return api.albums.saveAlbums([albumId]);
    },
    onSuccess: invalidateLibrary,
  });

  const removeAlbum = useMutation({
    mutationFn: (albumId: string) => {
      if (!api) throw new Error("Not authenticated");
      return api.albums.removeAlbums([albumId]);
    },
    onSuccess: invalidateLibrary,
  });

  return { saveTrack, removeTrack, saveAlbum, removeAlbum };
};

export const usePlaylistControls = () => {
  const api = useSpotifyApi();
  const queryClient = useQueryClient();

  const invalidatePlaylists = () => {
    queryClient.invalidateQueries({ queryKey: ["spotify", "playlists"] });
  };

  const addToPlaylist = useMutation({
    mutationFn: ({
      playlistId,
      uris,
    }: {
      playlistId: string;
      uris: string[];
    }) => {
      if (!api) throw new Error("Not authenticated");
      return api.playlists.addItemsToPlaylist(playlistId, { uris });
    },
    onSuccess: invalidatePlaylists,
  });

  const removeFromPlaylist = useMutation({
    mutationFn: ({
      playlistId,
      tracks,
    }: {
      playlistId: string;
      tracks: Array<{ uri: string }>;
    }) => {
      if (!api) throw new Error("Not authenticated");
      return api.playlists.removeItemsFromPlaylist(playlistId, tracks);
    },
    onSuccess: invalidatePlaylists,
  });

  return { addToPlaylist, removeFromPlaylist };
};
