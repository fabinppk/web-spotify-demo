import { Link, Play } from "@/modules";

interface PlaylistCardProps {
  playlist: Playlist;
  onPlay: () => void;
}

export function PlaylistCard({
  playlist,
  onPlay,
}: Readonly<PlaylistCardProps>) {
  const image = playlist.images?.[0]?.url;
  const initials = playlist.name.slice(0, 2).toUpperCase();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay();
  };

  return (
    <div data-testid="playlist-card" className="w-40 shrink-0 group relative">
      <Link
        to={`/playlist/${playlist.id}`}
        className="flex flex-col gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
      >
        <div className="w-40 h-40 rounded-md overflow-hidden bg-surface-hover">
          {image ? (
            <img
              src={image}
              alt={playlist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-bold text-2xl">
              {initials}
            </div>
          )}
        </div>

        <div className="px-0.5">
          <p className="text-text-primary text-sm font-semibold truncate">
            {playlist.name}
          </p>
          {playlist.description && (
            <p className="text-text-muted text-xs truncate mt-0.5">
              {playlist.description}
            </p>
          )}
        </div>
      </Link>

      {/* Play/pause sits outside Link to avoid nested interactive elements.
          Positioned absolute from the outer div: image is h-40 (160px),
          button is h-9 (36px), bottom-2 (8px) → top = 160 - 36 - 8 = 116px */}
      <button
        aria-label={`Play ${playlist.name}`}
        onClick={handlePlay}
        className="absolute top-[116px] right-2 w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
      >
        <Play className="w-4 h-4 text-black fill-black ml-0.5" />
      </button>
    </div>
  );
}
