import { SpotifyApiClient } from "./base.api";
import { ArtistApi } from "./artist.api";
import { AlbumApi } from "./album.api";
import { TrackApi } from "./track.api";
import { PlaylistApi } from "./playlist.api";
import { PlaybackApi } from "./playback.api";
import { SearchApi } from "./search.api";
import { BrowseApi } from "./browse.api";

export class SpotifyApi {
  private readonly apiClient: SpotifyApiClient;

  // Service instances
  public artists: ArtistApi;
  public albums: AlbumApi;
  public tracks: TrackApi;
  public playlists: PlaylistApi;
  public playback: PlaybackApi;
  public search: SearchApi;
  public browse: BrowseApi;

  constructor(accessToken: string) {
    this.apiClient = new SpotifyApiClient(accessToken);

    // Initialize all services
    this.artists = new ArtistApi(this.apiClient);
    this.albums = new AlbumApi(this.apiClient);
    this.tracks = new TrackApi(this.apiClient);
    this.playlists = new PlaylistApi(this.apiClient);
    this.playback = new PlaybackApi(this.apiClient);
    this.search = new SearchApi(this.apiClient);
    this.browse = new BrowseApi(this.apiClient);
  }

  /**
   * Update the access token for all API calls.
   * @param accessToken New access token
   */
  updateAccessToken(accessToken: string): void {
    this.apiClient.updateToken(accessToken);
  }

  /**
   * Get the current user's profile information.
   */
  async getCurrentUserProfile() {
    return this.apiClient.get<ProfileInterface>("/me");
  }

  /**
   * Get a user's profile information.
   * @param userId The user's Spotify user ID.
   */
  async getUserProfile(userId: string) {
    return this.apiClient.get(`/users/${userId}`);
  }

  /**
   * Get detailed profile information about the current user.
   */
  async getCurrentUser() {
    return this.apiClient.get("/me");
  }
}

// Export individual services as well for more granular imports
export {
  SpotifyApiClient,
  ArtistApi,
  AlbumApi,
  TrackApi,
  PlaylistApi,
  PlaybackApi,
  SearchApi,
  BrowseApi,
};
