import { useTranslation } from "react-i18next";
import { LibraryIcon } from "@/components/icons/sidebar";

interface SidebarHeaderProps {
  filter: FilterType;
  searchOpen: boolean;
  searchQuery: string;
  onFilterChange: (f: FilterType) => void;
  onSearchOpen: () => void;
  onSearchChange: (q: string) => void;
  onSearchBlur: () => void;
}

export function SidebarHeader({
  filter,
  onFilterChange,
}: Readonly<SidebarHeaderProps>) {
  const { t } = useTranslation();

  const FILTERS: { key: FilterType; label: string }[] = [
    { key: "playlists", label: t("COMPONENTS.SIDEBAR.filterPlaylists") },
    { key: "artists", label: t("COMPONENTS.SIDEBAR.filterArtists") },
    { key: "albums", label: t("COMPONENTS.SIDEBAR.filterAlbums") },
  ];

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center mb-4 gap-2 text-text-muted hover:text-text transition-colors font-bold text-sm">
        <LibraryIcon />
        <span>{t("COMPONENTS.SIDEBAR.yourLibrary")}</span>
      </div>

      <div className="flex gap-2 flex-wrap mb-3">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(filter === key ? "all" : key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              filter === key
                ? "bg-text text-bg"
                : "bg-border text-text hover:bg-surface-hover"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
