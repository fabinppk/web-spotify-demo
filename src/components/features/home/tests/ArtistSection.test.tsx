import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockUseInfiniteSearchQuery = vi.fn();

vi.mock("@/hooks", () => ({
  useInfiniteSearchQuery: (...args: unknown[]) =>
    mockUseInfiniteSearchQuery(...args),
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

import { ArtistSection } from "../ArtistSection";

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

describe("ArtistSection", () => {
  it("shows skeletons when loading", () => {
    mockUseInfiniteSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    render(<ArtistSection />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders artist cards when loaded", () => {
    mockUseInfiniteSearchQuery.mockReturnValue({
      data: {
        pages: [{ artists: { items: [makeArtist("a1", "Artist One")] } }],
      },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    render(<ArtistSection />);
    expect(screen.getByTestId("artist-card")).toBeInTheDocument();
    expect(screen.getByText("Artist One")).toBeInTheDocument();
  });

  it("returns null on error", () => {
    mockUseInfiniteSearchQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    const { container } = render(<ArtistSection />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when no artists and not loading", () => {
    mockUseInfiniteSearchQuery.mockReturnValue({
      data: { pages: [{ artists: { items: [] } }] },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    const { container } = render(<ArtistSection />);
    expect(container.firstChild).toBeNull();
  });

  it("renders section title", () => {
    mockUseInfiniteSearchQuery.mockReturnValue({
      data: { pages: [{ artists: { items: [makeArtist("a1", "Art")] } }] },
      isLoading: false,
      isError: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
    render(<ArtistSection />);
    expect(
      screen.getByText("COMPONENTS.HOME.artistsYouFollow"),
    ).toBeInTheDocument();
  });
});
