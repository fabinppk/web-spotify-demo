import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockUseMadeForYouPlaylists = vi.fn();

vi.mock("@/hooks", () => ({
  useMadeForYouPlaylists: (...args: unknown[]) =>
    mockUseMadeForYouPlaylists(...args),
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

import { MadeForYouSection } from "../MadeForYouSection";

describe("MadeForYouSection", () => {
  it("renders PlaylistCarousel with playlists", () => {
    mockUseMadeForYouPlaylists.mockReturnValue({
      data: {
        playlists: {
          items: [
            { id: "p1", name: "P1" },
            { id: "p2", name: "P2" },
          ],
        },
      },
      isLoading: false,
      isError: false,
    });
    render(<MadeForYouSection />);
    const carousel = screen.getByTestId("playlist-carousel");
    expect(carousel).toBeInTheDocument();
    expect(carousel.getAttribute("data-count")).toBe("2");
  });

  it("passes isLoading to carousel", () => {
    mockUseMadeForYouPlaylists.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<MadeForYouSection />);
    expect(
      screen.getByTestId("playlist-carousel").getAttribute("data-loading"),
    ).toBe("true");
  });

  it("returns null on error", () => {
    mockUseMadeForYouPlaylists.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    const { container } = render(<MadeForYouSection />);
    expect(container.firstChild).toBeNull();
  });

  it("filters out null playlist items", () => {
    mockUseMadeForYouPlaylists.mockReturnValue({
      data: { playlists: { items: [{ id: "p1", name: "P1" }, null] } },
      isLoading: false,
      isError: false,
    });
    render(<MadeForYouSection />);
    expect(
      screen.getByTestId("playlist-carousel").getAttribute("data-count"),
    ).toBe("1");
  });
});
