export const queryStaleTime = 5 * 60 * 1000; // 5 minutes
export const queryRetry = 1; // Retry failed queries once

export const MAX_IDS_PER_REQUEST = 20; // Spotify API limits to 20 IDs for certain endpoints (e.g., get multiple artists, albums, tracks)
export const MAX_SEARCH_TYPES = 3; // Spotify API allows searching for up to 3 types at once (album, artist, track, playlist, show, episode)
