import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks", () => ({
  useArtist: vi.fn(),
  useArtistTopTracks: vi.fn(),
  useInfiniteArtistAlbums: vi.fn(),
  useIntersectionObserver: vi.fn(() => ({ current: null })),
}));
vi.mock("@/modules", () => ({
  useParams: vi.fn(() => ({ id: "artist-1" })),
  useTranslation: () => ({ t: (k: string) => k }),
  Play: () => <svg />,
  toast: { info: vi.fn() },
}));
vi.mock("@/components/features/artist/ArtistDetailSkeleton", () => ({
  ArtistDetailSkeleton: () => <div data-testid="artist-skeleton" />,
}));
vi.mock("@/components/features/artist/TopTracksChart", () => ({
  TopTracksChart: () => <div data-testid="top-tracks-chart" />,
}));
vi.mock("@/components/features/search/SearchAlbumCard", () => ({
  SearchAlbumCard: ({ album }: { album: Album }) => (
    <div data-testid="album-card">{album.name}</div>
  ),
}));

import {
  useArtist,
  useArtistTopTracks,
  useInfiniteArtistAlbums,
} from "@/hooks";
import ArtistDetail from "../ArtistDetail";

const mockArtist: Artist = {
  id: "artist-1",
  name: "Test Artist",
  images: [{ url: "http://img.jpg", width: 300, height: 300 }],
  genres: ["rock"],
  followers: { total: 1000000 },
  popularity: 80,
  type: "artist",
  uri: "spotify:artist:artist-1",
  external_urls: { spotify: "" },
  href: "",
};

const mockAlbumsPage = {
  items: [
    {
      id: "alb-1",
      name: "Album One",
      images: [],
      artists: [],
      release_date: "2023-01-01",
      total_tracks: 10,
      type: "album",
    },
  ],
  next: null,
  total: 1,
};

function setupMocks(
  overrides: {
    artistLoading?: boolean;
    artistError?: boolean;
    artist?: Artist | null;
    albumsLoading?: boolean;
  } = {},
) {
  vi.mocked(useArtist).mockReturnValue({
    data: overrides.artist !== undefined ? overrides.artist : mockArtist,
    isLoading: overrides.artistLoading ?? false,
    isError: overrides.artistError ?? false,
    refetch: vi.fn(),
  } as never);

  vi.mocked(useArtistTopTracks).mockReturnValue({
    data: { tracks: [] },
  } as never);

  vi.mocked(useInfiniteArtistAlbums).mockReturnValue({
    data: { pages: [mockAlbumsPage] },
    isLoading: overrides.albumsLoading ?? false,
    refetch: vi.fn(),
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  } as never);
}

describe("ArtistDetail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows skeleton when loading", () => {
    setupMocks({ artistLoading: true });
    render(<ArtistDetail />);
    expect(screen.getByTestId("artist-skeleton")).toBeInTheDocument();
  });

  it("shows ErrorState when artist fetch fails", () => {
    setupMocks({ artistError: true, artist: null });
    render(<ArtistDetail />);
    expect(
      screen.getByText("PAGES.ARTIST_DETAIL.errorMessage"),
    ).toBeInTheDocument();
  });

  it("renders artist name", () => {
    setupMocks();
    render(<ArtistDetail />);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders artist photo when image available", () => {
    setupMocks();
    render(<ArtistDetail />);
    expect(screen.getByTestId("artist-photo")).toBeInTheDocument();
  });

  it("renders photo placeholder when no image", () => {
    setupMocks({ artist: { ...mockArtist, images: [] } });
    render(<ArtistDetail />);
    expect(screen.getByTestId("artist-photo-placeholder")).toBeInTheDocument();
  });

  it("renders TopTracksChart", () => {
    setupMocks();
    render(<ArtistDetail />);
    expect(screen.getByTestId("top-tracks-chart")).toBeInTheDocument();
  });

  it("renders album cards", () => {
    setupMocks();
    render(<ArtistDetail />);
    expect(screen.getByTestId("album-card")).toBeInTheDocument();
    expect(screen.getByText("Album One")).toBeInTheDocument();
  });

  it("shows no albums message when empty", () => {
    vi.mocked(useInfiniteArtistAlbums).mockReturnValue({
      data: { pages: [{ items: [], next: null, total: 0 }] },
      isLoading: false,
      refetch: vi.fn(),
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as never);
    vi.mocked(useArtist).mockReturnValue({
      data: mockArtist,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);
    vi.mocked(useArtistTopTracks).mockReturnValue({
      data: { tracks: [] },
    } as never);
    render(<ArtistDetail />);
    expect(
      screen.getByText("PAGES.ARTIST_DETAIL.noAlbums"),
    ).toBeInTheDocument();
  });

  it("renders follow button", () => {
    setupMocks();
    render(<ArtistDetail />);
    expect(screen.getByText("PAGES.ARTIST_DETAIL.follow")).toBeInTheDocument();
  });

  it("renders artist detail container", () => {
    setupMocks();
    render(<ArtistDetail />);
    expect(screen.getByTestId("artist-detail")).toBeInTheDocument();
  });
});
