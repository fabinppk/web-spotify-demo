export function getArtistsString(artists: Artist[] | undefined) {
  return artists?.map((a) => a.name).join(", ");
}
