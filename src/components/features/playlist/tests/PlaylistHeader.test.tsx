import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Play: () => <svg data-testid="play-icon" />,
  Heart: () => <svg data-testid="heart-icon" />,
}));

import { PlaylistHeader } from "../PlaylistHeader";

const mockPlaylist: PlaylistHeaderPlaylist = {
  name: "My Playlist",
  images: [{ url: "http://img.jpg", width: 300, height: 300 }],
  owner: {
    display_name: "Test User",
    id: "u1",
    uri: "",
    external_urls: { spotify: "" },
    href: "",
    type: "user",
  },
  tracks: { href: "", total: 20 },
  uri: "spotify:playlist:pl-1",
};

describe("PlaylistHeader", () => {
  it("renders playlist name", () => {
    render(<PlaylistHeader playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByText("My Playlist")).toBeInTheDocument();
  });

  it("renders owner name", () => {
    render(<PlaylistHeader playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("renders cover image when available", () => {
    render(<PlaylistHeader playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByTestId("playlist-cover")).toBeInTheDocument();
  });

  it("renders placeholder when no image", () => {
    const playlist = { ...mockPlaylist, images: [] };
    render(<PlaylistHeader playlist={playlist} onPlay={vi.fn()} />);
    expect(
      screen.getByTestId("playlist-cover-placeholder"),
    ).toBeInTheDocument();
  });

  it("calls onPlay when play button clicked", () => {
    const onPlay = vi.fn();
    render(<PlaylistHeader playlist={mockPlaylist} onPlay={onPlay} />);
    fireEvent.click(screen.getByLabelText("Play playlist"));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("shows track count", () => {
    render(<PlaylistHeader playlist={mockPlaylist} onPlay={vi.fn()} />);
    expect(screen.getByText(/\b20\b/)).toBeInTheDocument();
  });
});
