import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useSpotifyQueries", () => ({ useSearchQuery: vi.fn() }));
vi.mock("@/stores/useContentStore", () => ({ useContentStore: vi.fn() }));
vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));
vi.mock("@/components/features/search/SearchArtistCard", () => ({
  SearchArtistCard: ({ artist }: { artist: Artist }) => (
    <div data-testid="artist-card">{artist.name}</div>
  ),
}));
vi.mock("@/components/features/search/SearchAlbumCard", () => ({
  SearchAlbumCard: ({ album }: { album: Album }) => (
    <div data-testid="album-card">{album.name}</div>
  ),
}));

import { useSearchQuery } from "@/hooks/useSpotifyQueries";
import { useContentStore } from "@/stores/useContentStore";
import { Search } from "../Search";

const mockStore = (query: string) => {
  vi.mocked(useContentStore).mockReturnValue({
    searchQuery: query,
    setCurrentContent: vi.fn(),
    currentContent: "PLAYER",
    setSearchQuery: vi.fn(),
  } as never);
};

const mockQuery = (overrides: Partial<ReturnType<typeof useSearchQuery>>) => {
  vi.mocked(useSearchQuery).mockReturnValue({
    data: undefined,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as never);
};

describe("Search", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows EmptyState when no search query", () => {
    mockStore("");
    mockQuery({});
    render(<Search />);
    expect(
      screen.getByText("COMPONENTS.SEARCH.emptyTitle"),
    ).toBeInTheDocument();
  });

  it("shows skeletons when loading with a query", async () => {
    mockStore("beatles");
    mockQuery({ isLoading: true });
    render(<Search />);
    await waitFor(() =>
      expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0),
    );
  });

  it("shows ErrorState on error", () => {
    mockStore("beatles");
    mockQuery({ error: new Error("api error") });
    render(<Search />);
    expect(
      screen.getByText("COMPONENTS.SEARCH.errorMessage"),
    ).toBeInTheDocument();
  });

  it("renders artist cards from results", () => {
    mockStore("beatles");
    mockQuery({
      data: {
        artists: {
          items: [
            {
              id: "a1",
              name: "The Beatles",
              images: [],
              genres: [],
              followers: { total: 0 },
              popularity: 0,
              type: "artist",
              uri: "spotify:artist:a1",
            },
          ],
        },
        albums: { items: [] },
      } as never,
    });
    render(<Search />);
    expect(screen.getByTestId("artist-card")).toBeInTheDocument();
    expect(screen.getByText("The Beatles")).toBeInTheDocument();
  });

  it("renders album cards from results", () => {
    mockStore("beatles");
    mockQuery({
      data: {
        artists: { items: [] },
        albums: {
          items: [
            {
              id: "al1",
              name: "Abbey Road",
              images: [],
              artists: [],
              release_date: "1969",
              total_tracks: 17,
              type: "album",
            },
          ],
        },
      } as never,
    });
    render(<Search />);
    expect(screen.getByTestId("album-card")).toBeInTheDocument();
    expect(screen.getByText("Abbey Road")).toBeInTheDocument();
  });

  it("shows section headers when results present", () => {
    mockStore("beatles");
    mockQuery({
      data: {
        artists: {
          items: [
            {
              id: "a1",
              name: "Artist",
              images: [],
              genres: [],
              followers: { total: 0 },
              popularity: 0,
              type: "artist",
              uri: "u",
            },
          ],
        },
        albums: {
          items: [
            {
              id: "al1",
              name: "Album",
              images: [],
              artists: [],
              release_date: "2020",
              total_tracks: 5,
              type: "album",
            },
          ],
        },
      } as never,
    });
    render(<Search />);
    expect(
      screen.getByText("COMPONENTS.SEARCH.artistsSection"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("COMPONENTS.SEARCH.albumsSection"),
    ).toBeInTheDocument();
  });
});
