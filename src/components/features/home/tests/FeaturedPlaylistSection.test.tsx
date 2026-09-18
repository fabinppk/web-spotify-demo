import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockUseFeaturedPlaylists = vi.fn();

vi.mock("@/hooks", () => ({
  useFeaturedPlaylists: (...args: unknown[]) =>
    mockUseFeaturedPlaylists(...args),
}));
vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  toast: { info: vi.fn() },
}));
vi.mock("../PlaylistCarousel", () => ({
  PlaylistCarousel: ({
    title,
    playlists,
    isLoading,
  }: {
    title: string;
    playlists: Playlist[];
    isLoading: boolean;
  }) => (
    <div
      data-testid="playlist-carousel"
      data-loading={isLoading}
      data-count={playlists.length}
    >
      {title}
    </div>
  ),
}));

import { FeaturedPlaylistSection } from "../FeaturedPlaylistSection";

describe("FeaturedPlaylistSection", () => {
  it("renders PlaylistCarousel with playlists", () => {
    mockUseFeaturedPlaylists.mockReturnValue({
      data: { playlists: { items: [{ id: "p1", name: "Featured 1" }] } },
      isLoading: false,
      isError: false,
    });
    render(<FeaturedPlaylistSection />);
    expect(screen.getByTestId("playlist-carousel")).toBeInTheDocument();
    expect(
      screen.getByTestId("playlist-carousel").getAttribute("data-count"),
    ).toBe("1");
  });

  it("passes isLoading to carousel", () => {
    mockUseFeaturedPlaylists.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<FeaturedPlaylistSection />);
    expect(
      screen.getByTestId("playlist-carousel").getAttribute("data-loading"),
    ).toBe("true");
  });

  it("returns null on error", () => {
    mockUseFeaturedPlaylists.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    const { container } = render(<FeaturedPlaylistSection />);
    expect(container.firstChild).toBeNull();
  });
});
