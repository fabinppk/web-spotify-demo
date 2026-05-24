import { getArtistsString } from "@/utils";
import { useNavigate } from "react-router-dom";

interface SearchAlbumCardProps {
  album: Album;
  subtitle?: string;
  onNavigate?: () => void;
}

export function SearchAlbumCard({
  album,
  subtitle,
  onNavigate,
}: Readonly<SearchAlbumCardProps>) {
  const navigate = useNavigate();
  const image = album.images?.[0]?.url;
  const resolvedSubtitle = subtitle ?? getArtistsString(album.artists);

  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.();
        navigate(`/album/${album.id}`);
      }}
      className="flex flex-col gap-2 p-3 bg-surface-hover rounded-lg hover:bg-border transition-colors cursor-pointer text-left w-full"
    >
      {image ? (
        <img
          src={image}
          alt={album.name}
          className="w-full aspect-square object-cover rounded"
        />
      ) : (
        <div className="w-full aspect-square bg-border rounded" />
      )}
      <span className="text-text-primary text-sm font-medium truncate">
        {album.name}
      </span>
      {resolvedSubtitle && (
        <span className="text-text-muted text-xs truncate">
          {resolvedSubtitle}
        </span>
      )}
    </button>
  );
}
