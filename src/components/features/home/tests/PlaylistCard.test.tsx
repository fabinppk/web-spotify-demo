import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  Play: () => <svg data-testid="play-icon" />,
}));

import { PlaylistCard } from "../PlaylistCard";

const mockPlaylist = {
  id: "pl-1",
  name: "Test Playlist",
  description: "A great playlist",
  images: [{ url: "http://img.jpg", width: 300, height: 300 }],
  uri: "spotify:playlist:pl-1",
  tracks: { href: "", total: 10 },
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
} as Playlist;

describe("PlaylistCard", () => {
  it("renders playlist name", () => {
    render(<PlaylistCard playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByText("Test Playlist")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<PlaylistCard playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByText("A great playlist")).toBeInTheDocument();
  });

  it("renders image when available", () => {
    render(<PlaylistCard playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(
      screen.getByRole("img", { name: "Test Playlist" }),
    ).toBeInTheDocument();
  });

  it("renders initials when no image", () => {
    const playlist = { ...mockPlaylist, images: [] };
    render(<PlaylistCard playlist={playlist} onPlay={vi.fn()} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("TE")).toBeInTheDocument();
  });

  it("links to playlist page", () => {
    render(<PlaylistCard playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/playlist/pl-1");
  });

  it("calls onPlay when play button clicked", () => {
    const onPlay = vi.fn();
    render(<PlaylistCard playlist={mockPlaylist} onPlay={onPlay} />);
    fireEvent.click(screen.getByLabelText("Play Test Playlist"));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });
});
