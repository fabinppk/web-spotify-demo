import { getArtistsString } from "@/utils";
import { Play, useNavigate } from "@/modules";

interface AlbumTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
}

interface AlbumTrackRowProps {
  track: AlbumTrack;
  index: number;
  formattedDuration: string;
  onPlay: () => void;
}

export function AlbumTrackRow({
  track,
  index,
  formattedDuration,
  onPlay,
}: Readonly<AlbumTrackRowProps>) {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPlay();
    }
  };

  return (
    <div
      onClick={onPlay}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${track.name} by ${getArtistsString(track.artists)}`}
      className="grid grid-cols-[2rem_1fr_4rem] gap-4 px-2 py-2 rounded hover:bg-[#ffffff10] cursor-pointer group items-center"
    >
      <div className="flex items-center justify-end w-full">
        <Play className="w-4 h-4 text-text-primary fill-text-primary hidden group-hover:block" />
        <span className="text-sm font-medium text-text-muted group-hover:hidden">
          {index + 1}
        </span>
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-sm truncate font-medium text-text-primary">
          {track.name}
        </span>
        <span className="text-xs text-text-muted truncate">
          {track.artists.map((artist, i) => (
            <span key={artist.id}>
              {i > 0 && ", "}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/artist/${artist.id}`);
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className="hover:text-text-primary hover:underline"
              >
                {artist.name}
              </button>
            </span>
          ))}
        </span>
      </div>

      <span className="text-xs text-text-muted text-right">
        {formattedDuration}
      </span>
    </div>
  );
}
