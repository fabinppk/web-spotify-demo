import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();

vi.mock("@/modules", () => ({
  useNavigate: () => mockNavigate,
}));

import { SearchAlbumCard } from "../SearchAlbumCard";

const mockAlbum: Album = {
  id: "al-1",
  name: "Test Album",
  images: [{ url: "http://img.jpg", width: 300, height: 300 }],
  artists: [
    {
      id: "a-1",
      name: "Artist One",
      uri: "",
      external_urls: { spotify: "" },
      href: "",
      type: "artist",
    },
  ],
  release_date: "2023-05-01",
  release_date_precision: "day",
  album_type: "album",
  total_tracks: 10,
  href: "",
  type: "album",
  uri: "spotify:album:al-1",
  external_urls: { spotify: "" },
};

describe("SearchAlbumCard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders album name", () => {
    render(<SearchAlbumCard album={mockAlbum} />);
    expect(screen.getByText("Test Album")).toBeInTheDocument();
  });

  it("renders artist names as subtitle", () => {
    render(<SearchAlbumCard album={mockAlbum} />);
    expect(screen.getByText("Artist One")).toBeInTheDocument();
  });

  it("renders custom subtitle when provided", () => {
    render(<SearchAlbumCard album={mockAlbum} subtitle="Custom Sub" />);
    expect(screen.getByText("Custom Sub")).toBeInTheDocument();
  });

  it("renders cover image when available", () => {
    render(<SearchAlbumCard album={mockAlbum} />);
    expect(screen.getByRole("img", { name: "Test Album" })).toBeInTheDocument();
  });

  it("renders placeholder when no image", () => {
    const album = { ...mockAlbum, images: [] };
    const { container } = render(<SearchAlbumCard album={album} />);
    expect(container.querySelector("img")).toBeNull();
  });

  it("navigates to album page on click", () => {
    render(<SearchAlbumCard album={mockAlbum} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/album/al-1");
  });

  it("calls onNavigate callback if provided", () => {
    const onNavigate = vi.fn();
    render(<SearchAlbumCard album={mockAlbum} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
