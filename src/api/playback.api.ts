import { SpotifyApiClient } from "./base.api";

export class PlaybackApi {
  constructor(private readonly apiClient: SpotifyApiClient) {}

  async getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
    try {
      return await this.apiClient.get<CurrentlyPlaying>(
        "/me/player/currently-playing",
      );
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error as { response: { status: number } }).response?.status === 204
      ) {
        return null;
      }
      throw error;
    }
  }
}
