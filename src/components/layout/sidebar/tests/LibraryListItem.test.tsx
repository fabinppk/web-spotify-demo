import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/components/icons/sidebar", () => ({
  SidebarPlayIcon: () => <svg data-testid="play-icon" />,
}));

import { LibraryListItem } from "../LibraryListItem";

const playlistItem: LibraryItem = {
  id: "p-1",
  name: "My Playlist",
  imageUrl: "http://img.jpg",
  subtitle: "Playlist • User",
  type: "playlist",
  uri: "spotify:playlist:p-1",
  isArtist: false,
};

const artistItem: LibraryItem = {
  id: "a-1",
  name: "My Artist",
  imageUrl: undefined,
  subtitle: "Artist",
  type: "artist",
  uri: "spotify:artist:a-1",
  isArtist: true,
};

describe("LibraryListItem", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders item name", () => {
    render(
      <LibraryListItem
        item={playlistItem}
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("My Playlist")).toBeInTheDocument();
  });

  it("renders item subtitle", () => {
    render(
      <LibraryListItem
        item={playlistItem}
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("Playlist • User")).toBeInTheDocument();
  });

  it("renders image when imageUrl provided", () => {
    render(
      <LibraryListItem
        item={playlistItem}
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("img", { name: "My Playlist" }),
    ).toBeInTheDocument();
  });

  it("renders placeholder div when no imageUrl", () => {
    render(
      <LibraryListItem
        item={artistItem}
        onNavigate={vi.fn()}
        onPlay={vi.fn()}
      />,
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("calls onNavigate when clicked", () => {
    const onNavigate = vi.fn();
    render(
      <LibraryListItem
        item={playlistItem}
        onNavigate={onNavigate}
        onPlay={vi.fn()}
      />,
    );
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onNavigate).toHaveBeenCalledWith(playlistItem);
  });

  it("calls onPlay when play overlay clicked", () => {
    const onPlay = vi.fn();
    render(
      <LibraryListItem
        item={playlistItem}
        onNavigate={vi.fn()}
        onPlay={onPlay}
      />,
    );
    fireEvent.click(screen.getByLabelText("Play"));
    expect(onPlay).toHaveBeenCalled();
  });
});
