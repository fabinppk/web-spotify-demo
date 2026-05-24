import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCurrentUserProfile } from "../../hooks/useSpotifyQueries";
import { useState } from "react";
import { useContentStore } from "../../stores/useContentStore";
import { MainContent } from "../../utils/enums";
import { SpotifyLogo, BrowseIcon } from "../icons/home";

export function Header() {
  const { data: profile } = useCurrentUserProfile();
  const { setCurrentContent, setSearchQuery: setStoreSearchQuery } =
    useContentStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setStoreSearchQuery(searchQuery.trim());
      setCurrentContent(MainContent.BROWSE);
    }
  };

  const avatarUrl = profile?.images?.[0]?.url;
  const displayName = profile?.display_name ?? "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-1 h-16 bg-bg/95 backdrop-blur shrink-0"
      data-testid="header-element"
    >
      <div className="flex items-center gap-2 pl-2">
        <button
          className="flex items-center justify-center"
          aria-label="Spotify"
        >
          <SpotifyLogo />
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg mx-6">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What do you want to play?"
            className="pl-4 pr-10 bg-surface border-border text-text-primary placeholder:text-text-muted focus-visible:ring-accent h-10 rounded-full"
            data-testid="searchbar-element"
          />
          <button
            type="button"
            onClick={() => setCurrentContent(MainContent.BROWSE)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
            aria-label="Browse"
          >
            <BrowseIcon />
          </button>
        </form>
      </div>

      <div
        className="flex items-center gap-3 pr-2"
        data-testid="accountbar-element"
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-accent text-bg text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
