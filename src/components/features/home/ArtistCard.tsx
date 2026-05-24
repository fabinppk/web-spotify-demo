import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: Readonly<ArtistCardProps>) {
  const { t } = useTranslation();
  const image = artist.images?.[0]?.url;
  const initials = artist.name.slice(0, 2).toUpperCase();

  return (
    <div className="w-40 shrink-0 group">
      <Link
        to={`/artist/${artist.id}`}
        className="flex flex-col gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
      >
        <div className="w-40 h-40 rounded-full overflow-hidden bg-surface-hover">
          {image ? (
            <img
              src={image}
              alt={artist.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/20 text-accent font-bold text-2xl">
              {initials}
            </div>
          )}
        </div>
        <div className="px-0.5 text-center">
          <p className="text-text-primary text-sm font-semibold truncate">
            {artist.name}
          </p>
          <p className="text-text-muted text-xs mt-0.5">{t("COMPONENTS.SEARCH.artistLabel")}</p>
        </div>
      </Link>
    </div>
  );
}
