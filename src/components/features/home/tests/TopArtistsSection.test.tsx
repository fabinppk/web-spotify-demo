import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockUseInfiniteTopArtists = vi.fn();

vi.mock("@/hooks", () => ({
  useInfiniteTopArtists: (...args: unknown[]) =>
    mockUseInfiniteTopArtists(...args),
  useIntersectionObserver: () => ({ current: null }),
}));
vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));
vi.mock("../ArtistCard", () => ({
  ArtistCard: ({ artist }: { artist: Artist }) => (
    <div data-testid="artist-card">{artist.name}</div>
  ),
}));

import { TopArtistsSection } from "../TopArtistsSection";

const makeArtist = (id: string, name: string) =>
  ({
    id,
    name,
    images: [],
    genres: [],
    popularity: 80,
    followers: { total: 1000 },
    uri: `spotify:artist:${id}`,
    external_urls: { spotify: "" },
    href: "",
    type: "artist",
  }) as Artist;

describe("TopArtistsSection", () => {
  it("shows skeletons when loading", () => {
    mockUseInfiniteTopArtists.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    render(<TopArtistsSection />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders artist cards", () => {
    mockUseInfiniteTopArtists.mockReturnValue({
      data: {
        pages: [
          {
            items: [
              makeArtist("a1", "Artist One"),
              makeArtist("a2", "Artist Two"),
            ],
          },
        ],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    render(<TopArtistsSection />);
    expect(screen.getAllByTestId("artist-card")).toHaveLength(2);
    expect(screen.getByText("Artist One")).toBeInTheDocument();
  });

  it("returns null on error", () => {
    mockUseInfiniteTopArtists.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    const { container } = render(<TopArtistsSection />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when no artists", () => {
    mockUseInfiniteTopArtists.mockReturnValue({
      data: { pages: [{ items: [] }] },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    const { container } = render(<TopArtistsSection />);
    expect(container.firstChild).toBeNull();
  });

  it("renders section title", () => {
    mockUseInfiniteTopArtists.mockReturnValue({
      data: { pages: [{ items: [makeArtist("a1", "Art")] }] },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    render(<TopArtistsSection />);
    expect(screen.getByText("COMPONENTS.HOME.topArtists")).toBeInTheDocument();
  });
});
