const mockArtist: Artist = {
  id: "artist123",
  name: "Mock Artist",
  images: [],
  genres: [],
  popularity: 80,
  followers: { href: undefined, total: 1000 },
  external_urls: { spotify: "https://open.spotify.com/artist/artist123" },
  href: "https://api.spotify.com/v1/artists/artist123",
  type: "artist",
  uri: "spotify:artist:artist123",
};

export const getArtistTopTracks = (): { tracks: Track[] } => {
  return {
    tracks: [
      {
        id: "track1",
        name: "Top Track One",
        popularity: 95,
        duration_ms: 210000,
        disc_number: 1,
        track_number: 1,
        explicit: false,
        is_local: false,
        type: "track",
        uri: "spotify:track:track1",
        href: "https://api.spotify.com/v1/tracks/track1",
        external_urls: { spotify: "https://open.spotify.com/track/track1" },
        artists: [mockArtist],
      },
      {
        id: "track2",
        name: "Top Track Two",
        popularity: 88,
        duration_ms: 195000,
        disc_number: 1,
        track_number: 2,
        explicit: false,
        is_local: false,
        type: "track",
        uri: "spotify:track:track2",
        href: "https://api.spotify.com/v1/tracks/track2",
        external_urls: { spotify: "https://open.spotify.com/track/track2" },
        artists: [mockArtist],
      },
      {
        id: "track3",
        name: "Top Track Three",
        popularity: 76,
        duration_ms: 230000,
        disc_number: 1,
        track_number: 3,
        explicit: true,
        is_local: false,
        type: "track",
        uri: "spotify:track:track3",
        href: "https://api.spotify.com/v1/tracks/track3",
        external_urls: { spotify: "https://open.spotify.com/track/track3" },
        artists: [mockArtist],
      },
    ],
  };
};

export const getArtistAlbums = (): ArtistAlbums => {
  return {
    href: "https://api.spotify.com/v1/artists/artist123/albums",
    items: [],
    limit: 20,
    next: undefined,
    offset: 0,
    previous: undefined,
    total: 0,
  };
};
