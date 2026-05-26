import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();

vi.mock("@/modules", () => ({
  useNavigate: () => mockNavigate,
  useTranslation: () => ({ t: (k: string) => k }),
}));

import { SearchArtistCard } from "../SearchArtistCard";

const mockArtist: Artist = {
  id: "a-1",
  name: "Test Artist",
  images: [{ url: "http://img.jpg", width: 300, height: 300 }],
  genres: [],
  popularity: 80,
  followers: { total: 1000 },
  uri: "spotify:artist:a-1",
  external_urls: { spotify: "" },
  href: "",
  type: "artist",
};

describe("SearchArtistCard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders artist name", () => {
    render(<SearchArtistCard artist={mockArtist} />);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders artist label", () => {
    render(<SearchArtistCard artist={mockArtist} />);
    expect(
      screen.getByText("COMPONENTS.SEARCH.artistLabel"),
    ).toBeInTheDocument();
  });

  it("renders image when available", () => {
    render(<SearchArtistCard artist={mockArtist} />);
    expect(
      screen.getByRole("img", { name: "Test Artist" }),
    ).toBeInTheDocument();
  });

  it("renders initials when no image", () => {
    const artist = { ...mockArtist, images: [] };
    render(<SearchArtistCard artist={artist} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("TE")).toBeInTheDocument();
  });

  it("navigates to artist page on click", () => {
    render(<SearchArtistCard artist={mockArtist} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/artist/a-1");
  });

  it("calls onNavigate callback if provided", () => {
    const onNavigate = vi.fn();
    render(<SearchArtistCard artist={mockArtist} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
