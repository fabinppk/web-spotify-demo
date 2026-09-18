import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useCarouselScroll", () => ({
  useCarouselScroll: () => ({
    scrollRef: { current: null },
    canScrollLeft: false,
    canScrollRight: false,
    scroll: vi.fn(),
  }),
}));
vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));
vi.mock("@/components/ui/ScrollArrow", () => ({
  ScrollArrow: ({ dir }: { dir: string }) => (
    <button data-testid={`scroll-${dir}`} />
  ),
}));
vi.mock("../PlaylistCard", () => ({
  PlaylistCard: ({ playlist }: { playlist: Playlist }) => (
    <div data-testid="playlist-card">{playlist.name}</div>
  ),
}));

import { PlaylistCarousel } from "../PlaylistCarousel";

const makePlaylists = (n: number): Playlist[] =>
  Array.from(
    { length: n },
    (_, i) =>
      ({
        id: `pl-${i}`,
        name: `Playlist ${i}`,
        description: "",
        images: [],
        uri: `spotify:playlist:pl-${i}`,
        tracks: { href: "", total: 0 },
        owner: {
          display_name: "User",
          id: "u1",
          uri: "",
          external_urls: { spotify: "" },
          href: "",
          type: "user" as const,
        },
        external_urls: { spotify: "" },
        collaborative: false,
        followers: { total: 0 },
        href: "",
        snapshot_id: "",
        type: "playlist" as const,
      }) as Playlist,
  );

describe("PlaylistCarousel", () => {
  it("shows skeletons when loading", () => {
    render(
      <PlaylistCarousel
        title="Test"
        playlists={[]}
        isLoading
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("renders title when loading", () => {
    render(
      <PlaylistCarousel
        title="Made For You"
        playlists={[]}
        isLoading
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("Made For You")).toBeInTheDocument();
  });

  it("renders playlist cards", () => {
    render(
      <PlaylistCarousel
        title="Test"
        playlists={makePlaylists(3)}
        isLoading={false}
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getAllByTestId("playlist-card")).toHaveLength(3);
  });

  it("returns null when no playlists and not loading", () => {
    const { container } = render(
      <PlaylistCarousel
        title="Test"
        playlists={[]}
        isLoading={false}
        onPlay={vi.fn()}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
