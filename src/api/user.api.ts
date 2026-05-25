import { SpotifyApiClient } from "./base.api";

export class UserService {
  constructor(private readonly apiClient: SpotifyApiClient) {}

  /**
   * Get the current user's profile information.
   */
  async getCurrentUserProfile(): Promise<ProfileInterface> {
    return this.apiClient.get<ProfileInterface>("/me");
  }
}
