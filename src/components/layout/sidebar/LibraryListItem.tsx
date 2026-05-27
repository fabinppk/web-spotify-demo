import { SidebarPlayIcon } from "@/components/icons/sidebar";

function PlayButtonOverlay({
  onPlay,
}: Readonly<{ onPlay: (e: React.MouseEvent) => void }>) {
  return (
    <button
      onClick={onPlay}
      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[inherit]"
      aria-label="Play"
    >
      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg text-bg">
        <SidebarPlayIcon />
      </div>
    </button>
  );
}

interface LibraryListItemProps {
  item: LibraryItem;
  onNavigate: (item: LibraryItem) => void;
  onPlay: (item: LibraryItem, e: React.MouseEvent) => void;
}

export function LibraryListItem({
  item,
  onNavigate,
  onPlay,
}: Readonly<LibraryListItemProps>) {
  return (
    <div
      onClick={() => onNavigate(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNavigate(item);
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex items-center gap-3 px-2 py-2 rounded hover:bg-surface-hover transition-colors text-left w-full cursor-pointer"
    >
      <div
        className={`relative shrink-0 w-12 h-12 ${item.isArtist ? "rounded-full" : "rounded"} overflow-hidden bg-border`}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface-hover" />
        )}
        <PlayButtonOverlay
          onPlay={(e) => {
            e.stopPropagation();
            onPlay(item, e);
          }}
        />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-text text-sm font-medium truncate leading-tight">
          {item.name}
        </span>
        <span className="text-text-muted text-xs truncate leading-tight mt-0.5">
          {item.subtitle}
        </span>
      </div>
    </div>
  );
}
