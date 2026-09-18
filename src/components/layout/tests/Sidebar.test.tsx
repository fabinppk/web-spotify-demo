import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks", () => ({
  useUserPlaylists: vi.fn(),
  useSavedAlbums: vi.fn(),
  useFollowedArtists: vi.fn(),
}));
vi.mock("@/modules", () => ({
  useNavigate: () => vi.fn(),
  useTranslation: () => ({ t: (k: string) => k }),
  toast: { info: vi.fn() },
}));
vi.mock("@/components/layout/sidebar/SidebarHeader", () => ({
  SidebarHeader: () => <div data-testid="sidebar-header" />,
}));
vi.mock("@/components/layout/sidebar/LibraryList", () => ({
  LibraryList: ({
    isLoading,
    items,
  }: {
    isLoading: boolean;
    items: LibraryItem[];
  }) => (
    <div
      data-testid="library-list"
      data-loading={isLoading}
      data-count={items.length}
    />
  ),
}));

import { useUserPlaylists, useSavedAlbums, useFollowedArtists } from "@/hooks";
import { Sidebar } from "../Sidebar";

function setupMocks(loading = false) {
  vi.mocked(useUserPlaylists).mockReturnValue({
    data: {
      items: [
        {
          id: "p1",
          name: "Playlist 1",
          images: [],
          owner: { display_name: "User" },
        },
      ],
    },
    isLoading: loading,
  } as never);
  vi.mocked(useSavedAlbums).mockReturnValue({
    data: {
      items: [
        {
          album: {
            id: "al1",
            name: "Album 1",
            images: [],
            artists: [{ id: "a1", name: "Artist" }],
          },
        },
      ],
    },
    isLoading: loading,
  } as never);
  vi.mocked(useFollowedArtists).mockReturnValue({
    data: { artists: { items: [] } },
    isLoading: loading,
  } as never);
}

describe("Sidebar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders sidebar container", () => {
    setupMocks();
    render(<Sidebar />);
    expect(screen.getByTestId("sidebar-element")).toBeInTheDocument();
  });

  it("renders SidebarHeader", () => {
    setupMocks();
    render(<Sidebar />);
    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
  });

  it("renders LibraryList", () => {
    setupMocks();
    render(<Sidebar />);
    expect(screen.getByTestId("library-list")).toBeInTheDocument();
  });

  it("passes isLoading=true to LibraryList when fetching", () => {
    setupMocks(true);
    render(<Sidebar />);
    expect(
      screen.getByTestId("library-list").getAttribute("data-loading"),
    ).toBe("true");
  });

  it("passes items to LibraryList from playlists data", () => {
    setupMocks();
    render(<Sidebar />);
    const list = screen.getByTestId("library-list");
    expect(Number(list.getAttribute("data-count"))).toBeGreaterThan(0);
  });
});
