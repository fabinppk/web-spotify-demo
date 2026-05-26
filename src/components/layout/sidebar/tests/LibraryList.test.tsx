import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));
vi.mock("../LibraryListItem", () => ({
  LibraryListItem: ({ item }: { item: LibraryItem }) => (
    <div data-testid="library-item">{item.name}</div>
  ),
}));

import { LibraryList } from "../LibraryList";

const mockItems: LibraryItem[] = [
  {
    id: "1",
    name: "Playlist A",
    imageUrl: undefined,
    subtitle: "Playlist",
    type: "playlist",
    uri: "spotify:playlist:1",
    isArtist: false,
  },
  {
    id: "2",
    name: "Artist B",
    imageUrl: undefined,
    subtitle: "Artist",
    type: "artist",
    uri: "spotify:artist:2",
    isArtist: true,
  },
];

describe("LibraryList", () => {
  it("shows skeletons when loading", () => {
    render(
      <LibraryList
        isLoading
        items={[]}
        searchQuery=""
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders LibraryListItem for each item", () => {
    render(
      <LibraryList
        isLoading={false}
        items={mockItems}
        searchQuery=""
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("library-item")).toHaveLength(2);
    expect(screen.getByText("Playlist A")).toBeInTheDocument();
    expect(screen.getByText("Artist B")).toBeInTheDocument();
  });

  it("shows empty library message when no items and no query", () => {
    render(
      <LibraryList
        isLoading={false}
        items={[]}
        searchQuery=""
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(
      screen.getByText("COMPONENTS.SIDEBAR.emptyLibrary"),
    ).toBeInTheDocument();
  });

  it("shows no results message when query has no matches", () => {
    render(
      <LibraryList
        isLoading={false}
        items={[]}
        searchQuery="xyz"
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(
      screen.getByText("COMPONENTS.SIDEBAR.noResults"),
    ).toBeInTheDocument();
  });
});
