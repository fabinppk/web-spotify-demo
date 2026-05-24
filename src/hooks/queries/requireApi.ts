export function requireApi<T>(api: T | null): T {
  if (api === null) throw new Error("Spotify API not initialized");
  return api;
}
