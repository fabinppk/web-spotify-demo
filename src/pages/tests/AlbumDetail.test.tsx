import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useSpotifyQueries", () => ({
  useAlbum: vi.fn(),
  useAlbumTracks: vi.fn(),
}));
vi.mock("@/modules", () => ({
  useParams: vi.fn(() => ({ id: "album-1" })),
  useNavigate: vi.fn(() => vi.fn()),
  useTranslation: () => ({ t: (k: string) => k }),
  Play: () => <svg />,
  Heart: () => <svg />,
  toast: { info: vi.fn() },
}));
vi.mock("@/components/features/album/AlbumDetailSkeleton", () => ({
  AlbumDetailSkeleton: () => <div data-testid="album-skeleton" />,
}));
vi.mock("@/components/features/album/AlbumTrackRow", () => ({
  AlbumTrackRow: ({ track }: { track: Track }) => (
    <div data-testid="track-row">{track.name}</div>
  ),
}));

import { useAlbum, useAlbumTracks } from "@/hooks/useSpotifyQueries";
import AlbumDetail from "../AlbumDetail";

const mockAlbum = {
  id: "album-1",
  name: "Test Album",
  images: [{ url: "http://cover.jpg", width: 300, height: 300 }],
  artists: [{ id: "a-1", name: "Test Artist" }],
  release_date: "2023-05-15",
  total_tracks: 2,
  type: "album",
  tracks: { total: 2, items: [] },
};

const mockTracks = {
  items: [
    {
      id: "t-1",
      name: "Track One",
      duration_ms: 210000,
      artists: [{ id: "a-1", name: "Test Artist" }],
    },
    {
      id: "t-2",
      name: "Track Two",
      duration_ms: 185000,
      artists: [{ id: "a-1", name: "Test Artist" }],
    },
  ],
};

function setupMocks(
  overrides: {
    albumLoading?: boolean;
    albumError?: boolean;
    album?: typeof mockAlbum | null;
    tracksLoading?: boolean;
    tracksError?: boolean;
    tracks?: typeof mockTracks | null;
  } = {},
) {
  vi.mocked(useAlbum).mockReturnValue({
    data: overrides.album !== undefined ? overrides.album : mockAlbum,
    isLoading: overrides.albumLoading ?? false,
    isError: overrides.albumError ?? false,
    refetch: vi.fn(),
  } as never);
  vi.mocked(useAlbumTracks).mockReturnValue({
    data: overrides.tracks !== undefined ? overrides.tracks : mockTracks,
    isLoading: overrides.tracksLoading ?? false,
    isError: overrides.tracksError ?? false,
    refetch: vi.fn(),
  } as never);
}

describe("AlbumDetail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows skeleton when loading", () => {
    setupMocks({ albumLoading: true });
    render(<AlbumDetail />);
    expect(screen.getByTestId("album-skeleton")).toBeInTheDocument();
  });

  it("shows ErrorState on error", () => {
    setupMocks({ albumError: true, album: null });
    render(<AlbumDetail />);
    expect(
      screen.getByText("PAGES.ALBUM_DETAIL.errorMessage"),
    ).toBeInTheDocument();
  });

  it("renders album name", () => {
    setupMocks();
    render(<AlbumDetail />);
    expect(screen.getByText("Test Album")).toBeInTheDocument();
  });

  it("renders album cover image", () => {
    setupMocks();
    render(<AlbumDetail />);
    expect(screen.getByTestId("album-cover")).toBeInTheDocument();
  });

  it("renders placeholder when no cover", () => {
    setupMocks({ album: { ...mockAlbum, images: [] } });
    render(<AlbumDetail />);
    expect(screen.getByTestId("album-cover-placeholder")).toBeInTheDocument();
  });

  it("renders artist link", () => {
    setupMocks();
    render(<AlbumDetail />);
    expect(screen.getByTestId("album-artist-link")).toBeInTheDocument();
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders release year", () => {
    setupMocks();
    render(<AlbumDetail />);
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("renders track rows", () => {
    setupMocks();
    render(<AlbumDetail />);
    expect(screen.getAllByTestId("track-row")).toHaveLength(2);
    expect(screen.getByText("Track One")).toBeInTheDocument();
    expect(screen.getByText("Track Two")).toBeInTheDocument();
  });

  it("shows empty message when no tracks", () => {
    setupMocks({ tracks: { items: [] } });
    render(<AlbumDetail />);
    expect(screen.getByText("This album has no tracks.")).toBeInTheDocument();
  });

  it("renders album detail container", () => {
    setupMocks();
    render(<AlbumDetail />);
    expect(screen.getByTestId("album-detail")).toBeInTheDocument();
  });
});
