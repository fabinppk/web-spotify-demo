import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface SearchArtistCardProps {
  artist: Artist;
  onNavigate?: () => void;
}

export function SearchArtistCard({
  artist,
  onNavigate,
}: Readonly<SearchArtistCardProps>) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const image = artist.images?.[0]?.url;
  const initials = artist.name.slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => {
        onNavigate?.();
        navigate(`/artist/${artist.id}`);
      }}
      className="flex flex-col items-center gap-2 p-4 bg-surface-hover rounded-lg hover:bg-border transition-colors cursor-pointer text-left w-full"
    >
      <div className="w-24 h-24 rounded-full overflow-hidden bg-border shrink-0">
        {image ? (
          <img
            src={image}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-bold text-xl">
            {initials}
          </div>
        )}
      </div>
      <span className="text-text-primary text-sm font-medium text-center truncate w-full">
        {artist.name}
      </span>
      <span className="text-text-muted text-xs">
        {t("COMPONENTS.SEARCH.artistLabel")}
      </span>
    </button>
  );
}
