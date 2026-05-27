import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks", () => ({ usePlaylist: vi.fn() }));
vi.mock("@/modules", () => ({
  useParams: vi.fn(() => ({ id: "pl-1" })),
  useTranslation: () => ({ t: (k: string) => k }),
  toast: { info: vi.fn() },
}));
vi.mock("@/components/features/playlist/PlaylistDetailSkeleton", () => ({
  PlaylistDetailSkeleton: () => <div data-testid="playlist-skeleton" />,
}));
vi.mock("@/components/features/playlist/PlaylistHeader", () => ({
  PlaylistHeader: ({ playlist }: { playlist: { name: string } }) => (
    <div data-testid="playlist-header">{playlist.name}</div>
  ),
}));
vi.mock("@/components/features/playlist/PlaylistTrackList", () => ({
  PlaylistTrackList: () => <div data-testid="playlist-track-list" />,
}));

import { usePlaylist } from "@/hooks";
import PlaylistDetail from "../PlaylistDetail";

const mockPlaylist = {
  id: "pl-1",
  name: "My Playlist",
  description: "A test playlist",
  images: [],
  owner: { display_name: "User" },
  tracks: { total: 5 },
  items: { items: [{ track: { id: "t-1", name: "Track" } }] },
};

describe("PlaylistDetail", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows skeleton when loading", () => {
    vi.mocked(usePlaylist).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    } as never);
    render(<PlaylistDetail />);
    expect(screen.getByTestId("playlist-skeleton")).toBeInTheDocument();
  });

  it("shows ErrorState on error", () => {
    vi.mocked(usePlaylist).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch: vi.fn(),
    } as never);
    render(<PlaylistDetail />);
    expect(
      screen.getByText("PAGES.PLAYLIST_DETAIL.errorMessage"),
    ).toBeInTheDocument();
  });

  it("renders PlaylistHeader with playlist name", () => {
    vi.mocked(usePlaylist).mockReturnValue({
      data: mockPlaylist,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);
    render(<PlaylistDetail />);
    expect(screen.getByTestId("playlist-header")).toBeInTheDocument();
    expect(screen.getByText("My Playlist")).toBeInTheDocument();
  });

  it("renders PlaylistTrackList", () => {
    vi.mocked(usePlaylist).mockReturnValue({
      data: mockPlaylist,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);
    render(<PlaylistDetail />);
    expect(screen.getByTestId("playlist-track-list")).toBeInTheDocument();
  });

  it("renders playlist detail container", () => {
    vi.mocked(usePlaylist).mockReturnValue({
      data: mockPlaylist,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as never);
    render(<PlaylistDetail />);
    expect(screen.getByTestId("playlist-detail")).toBeInTheDocument();
  });
});
