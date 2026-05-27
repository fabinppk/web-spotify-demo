import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockUseOutlet = vi.fn(() => null as React.ReactNode);
const mockUseContentStore = vi.fn();
const mockUseNavHeader = vi.fn();

vi.mock("@/modules", () => ({
  useOutlet: () => mockUseOutlet(),
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("@/stores/useContentStore", () => ({
  useContentStore: () => mockUseContentStore(),
}));
vi.mock("@/hooks", () => ({
  useNavHeader: () => mockUseNavHeader(),
}));
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}));
vi.mock("@/components/features/home/NavHeader", () => ({
  NavHeader: ({ active }: { active: string }) => (
    <div data-testid="nav-header" data-active={active} />
  ),
}));
vi.mock("@/components/features/home/TopArtistsSection", () => ({
  TopArtistsSection: () => <div data-testid="top-artists-section" />,
}));
vi.mock("@/components/features/home/MadeForYouSection", () => ({
  MadeForYouSection: () => <div data-testid="made-for-you-section" />,
}));
vi.mock("@/components/features/home/FeaturedPlaylistSection", () => ({
  FeaturedPlaylistSection: () => <div data-testid="featured-section" />,
}));
vi.mock("@/components/features/Search", () => ({
  Search: () => <div data-testid="search-component" />,
}));

import { MainPanel } from "../MainPanel";
import { MainContent } from "@/utils";

describe("MainPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseOutlet.mockReturnValue(null);
    mockUseNavHeader.mockReturnValue({
      activeFilter: "All",
      setActiveFilter: vi.fn(),
    });
  });

  it("renders home sections when PLAYER mode", () => {
    mockUseContentStore.mockReturnValue({ currentContent: MainContent.PLAYER });
    render(<MainPanel />);
    expect(screen.getByTestId("made-for-you-section")).toBeInTheDocument();
    expect(screen.getByTestId("featured-section")).toBeInTheDocument();
    expect(screen.getByTestId("top-artists-section")).toBeInTheDocument();
  });

  it("renders Search when BROWSE mode", async () => {
    mockUseContentStore.mockReturnValue({ currentContent: MainContent.BROWSE });
    render(<MainPanel />);
    await screen.findByTestId("search-component");
    expect(screen.getByTestId("search-component")).toBeInTheDocument();
  });

  it("renders outlet when outlet present", () => {
    mockUseContentStore.mockReturnValue({ currentContent: MainContent.PLAYER });
    mockUseOutlet.mockReturnValue(<div data-testid="outlet-content" />);
    render(<MainPanel />);
    expect(screen.getByTestId("outlet-content")).toBeInTheDocument();
  });

  it("renders NavHeader in PLAYER mode", () => {
    mockUseContentStore.mockReturnValue({ currentContent: MainContent.PLAYER });
    render(<MainPanel />);
    expect(screen.getByTestId("nav-header")).toBeInTheDocument();
  });

  it("hides artist section when Playlists filter active", () => {
    mockUseContentStore.mockReturnValue({ currentContent: MainContent.PLAYER });
    mockUseNavHeader.mockReturnValue({
      activeFilter: "Playlists",
      setActiveFilter: vi.fn(),
    });
    render(<MainPanel />);
    expect(screen.queryByTestId("top-artists-section")).not.toBeInTheDocument();
    expect(screen.getByTestId("made-for-you-section")).toBeInTheDocument();
  });

  it("hides playlist sections when Artists filter active", () => {
    mockUseContentStore.mockReturnValue({ currentContent: MainContent.PLAYER });
    mockUseNavHeader.mockReturnValue({
      activeFilter: "Artists",
      setActiveFilter: vi.fn(),
    });
    render(<MainPanel />);
    expect(
      screen.queryByTestId("made-for-you-section"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("top-artists-section")).toBeInTheDocument();
  });
});
