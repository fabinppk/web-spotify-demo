import { useMemo } from "react";
import { useAuth } from "./useAuth";
import { SpotifyApi } from "@/api";

export function useSpotifyApi(): SpotifyApi | null {
  const { accessToken, isLoading } = useAuth();

  return useMemo(() => {
    if (isLoading || !accessToken) return null;
    return new SpotifyApi(accessToken);
  }, [accessToken, isLoading]);
}
