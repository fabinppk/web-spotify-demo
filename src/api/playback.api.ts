import { SpotifyApiClient } from "./base.api";

export class PlaybackApi {
  constructor(private readonly apiClient: SpotifyApiClient) {}

  async getCurrentPlayback(
    market?: string,
    additionalTypes?: string,
  ): Promise<PlaybackState | null> {
    const params: Record<string, string> = {};
    if (market) params.market = market;
    if (additionalTypes) params.additional_types = additionalTypes;

    try {
      return await this.apiClient.get<PlaybackState>("/me/player", params);
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

  async transferPlayback(deviceIds: string[], play = false): Promise<void> {
    return this.apiClient.put("/me/player", { device_ids: deviceIds, play });
  }

  async getAvailableDevices(): Promise<{ devices: Device[] }> {
    return this.apiClient.get<{ devices: Device[] }>("/me/player/devices");
  }

  async getCurrentlyPlaying(
    market?: string,
    additionalTypes?: string,
  ): Promise<CurrentlyPlaying | null> {
    const params: Record<string, string> = {};
    if (market) params.market = market;
    if (additionalTypes) params.additional_types = additionalTypes;

    try {
      return await this.apiClient.get<CurrentlyPlaying>(
        "/me/player/currently-playing",
        params,
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

  async startResumePlayback(options?: {
    device_id?: string;
    context_uri?: string;
    uris?: string[];
    offset?: { position?: number; uri?: string };
    position_ms?: number;
  }): Promise<void> {
    const endpoint = options?.device_id
      ? `/me/player/play?device_id=${options.device_id}`
      : "/me/player/play";
    const body = options ? { ...options } : {};
    delete body.device_id;
    return this.apiClient.put(
      endpoint,
      Object.keys(body).length > 0 ? body : null,
    );
  }

  async pausePlayback(deviceId?: string): Promise<void> {
    const endpoint = deviceId
      ? `/me/player/pause?device_id=${deviceId}`
      : "/me/player/pause";
    return this.apiClient.put(endpoint);
  }

  async skipToNext(deviceId?: string): Promise<void> {
    const endpoint = deviceId
      ? `/me/player/next?device_id=${deviceId}`
      : "/me/player/next";
    return this.apiClient.post(endpoint);
  }

  async skipToPrevious(deviceId?: string): Promise<void> {
    const endpoint = deviceId
      ? `/me/player/previous?device_id=${deviceId}`
      : "/me/player/previous";
    return this.apiClient.post(endpoint);
  }

  async seekToPosition(positionMs: number, deviceId?: string): Promise<void> {
    const params: Record<string, string | number> = { position_ms: positionMs };
    if (deviceId) params.device_id = deviceId;
    return this.apiClient.put("/me/player/seek", null, { params });
  }

  async setRepeatMode(
    state: "track" | "context" | "off",
    deviceId?: string,
  ): Promise<void> {
    const params: Record<string, string> = { state };
    if (deviceId) params.device_id = deviceId;
    return this.apiClient.put("/me/player/repeat", null, { params });
  }

  async setPlaybackVolume(
    volumePercent: number,
    deviceId?: string,
  ): Promise<void> {
    if (volumePercent < 0 || volumePercent > 100) {
      throw new Error("Volume percent must be between 0 and 100");
    }
    const params: Record<string, string | number> = {
      volume_percent: volumePercent,
    };
    if (deviceId) params.device_id = deviceId;
    return this.apiClient.put("/me/player/volume", null, { params });
  }

  async toggleShuffle(state: boolean, deviceId?: string): Promise<void> {
    const params: Record<string, string | boolean> = { state };
    if (deviceId) params.device_id = deviceId;
    return this.apiClient.put("/me/player/shuffle", null, { params });
  }

  async getRecentlyPlayedTracks(options?: {
    limit?: number;
    after?: number;
    before?: number;
  }): Promise<{
    href: string;
    limit: number;
    next?: string;
    cursors: { after?: string; before?: string };
    total?: number;
    items: Array<{
      track: Track;
      played_at: string;
      context?: {
        type: string;
        href: string;
        external_urls: { spotify: string };
        uri: string;
      };
    }>;
  }> {
    return this.apiClient.get("/me/player/recently-played", options);
  }

  async getUserQueue(): Promise<{
    currently_playing?: Track;
    queue: Track[];
  }> {
    return this.apiClient.get("/me/player/queue");
  }

  async addItemToPlaybackQueue(uri: string, deviceId?: string): Promise<void> {
    const params: Record<string, string> = { uri };
    if (deviceId) params.device_id = deviceId;
    return this.apiClient.post("/me/player/queue", null, { params });
  }
}
