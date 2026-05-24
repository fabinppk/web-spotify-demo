interface ExternalUrls {
  spotify: string;
}

interface Image {
  url: string;
  height?: number;
  width?: number;
}

interface Followers {
  href?: string;
  total: number;
}

interface ProfileInterface {
  id: string;
  display_name: string;
  email: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  images: Image[];
  type: string;
  uri: string;
  country?: string;
  product?: string;
  explicit_content?: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
}

// Artist
interface Artist {
  external_urls: ExternalUrls;
  followers?: Followers;
  genres?: string[];
  href: string;
  id: string;
  images?: Image[];
  name: string;
  popularity?: number;
  type: "artist";
  uri: string;
}

interface ArtistTopTracks {
  tracks: Track[];
}

interface ArtistAlbums {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: Album[];
}

// Album
interface Album {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets?: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  restrictions?: { reason: "market" | "product" | "explicit" };
  type: "album";
  uri: string;
  artists: Artist[];
  tracks?: {
    href: string;
    limit: number;
    next?: string;
    offset: number;
    previous?: string;
    total: number;
    items: Track[];
  };
  copyrights?: { text: string; type: "C" | "P" }[];
  external_ids?: Record<string, string>;
  genres?: string[];
  label?: string;
  popularity?: number;
}

// Track
interface Track {
  album?: Album;
  artists: Artist[];
  available_markets?: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids?: Record<string, string>;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: "track";
    uri: string;
  };
  restrictions?: { reason: "market" | "product" | "explicit" };
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

interface SavedTrack {
  added_at: string;
  track: Track;
}

interface SavedAlbum {
  added_at: string;
  album: Album;
}

// Playlist
interface Playlist {
  collaborative: boolean;
  description?: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    external_urls: ExternalUrls;
    followers?: Followers;
    href: string;
    id: string;
    type: "user";
    uri: string;
    display_name?: string;
  };
  public?: boolean;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
    items?: PlaylistTrack[];
  };
  items?: PaginatedResponse<PlaylistItem>;
  type: "playlist";
  uri: string;
}

interface PlaylistTrack {
  added_at: string;
  added_by: {
    external_urls: ExternalUrls;
    followers?: Followers;
    href: string;
    id: string;
    type: "user";
    uri: string;
  };
  is_local: boolean;
  track: Track | null;
}

interface Episode {
  id: string;
  name: string;
  type: "episode";
  uri: string;
}

interface PlaylistItem {
  added_at: string;
  added_by: {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: "user";
    uri: string;
  };
  is_local: boolean;
  item: Track | Episode | null;
}

// Search
interface SearchResult {
  artists?: PaginatedResponse<Artist>;
  albums?: PaginatedResponse<Album>;
  tracks?: PaginatedResponse<Track>;
  playlists?: PaginatedResponse<Playlist>;
}

// Pagination
interface PaginatedResponse<T> {
  href: string;
  limit: number;
  next?: string;
  offset: number;
  previous?: string;
  total: number;
  items: T[];
}

type UserSavedAlbums = PaginatedResponse<SavedAlbum>;
type UserSavedTracks = PaginatedResponse<SavedTrack>;
type UserPlaylists = PaginatedResponse<Playlist>;

// Browse
interface FeaturedPlaylists {
  message?: string;
  playlists: PaginatedResponse<Playlist>;
}

interface NewReleases {
  albums: PaginatedResponse<Album>;
}

interface Category {
  href: string;
  icons: Image[];
  id: string;
  name: string;
}

type Categories = PaginatedResponse<Category>;

// Recommendations
interface RecommendationSeed {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href?: string;
  id: string;
  initialPoolSize: number;
  type: "artist" | "track" | "genre";
}

interface Recommendations {
  seeds: RecommendationSeed[];
  tracks: Track[];
}

interface AudioFeatures {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: "audio_features";
  uri: string;
  valence: number;
}
