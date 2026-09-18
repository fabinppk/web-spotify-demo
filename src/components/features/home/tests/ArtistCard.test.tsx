import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

import { ArtistCard } from "../ArtistCard";

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

describe("ArtistCard", () => {
  it("renders artist name", () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
  });

  it("renders artist label", () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(
      screen.getByText("COMPONENTS.SEARCH.artistLabel"),
    ).toBeInTheDocument();
  });

  it("renders image when available", () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(
      screen.getByRole("img", { name: "Test Artist" }),
    ).toBeInTheDocument();
  });

  it("renders initials when no image", () => {
    const artist = { ...mockArtist, images: [] };
    render(<ArtistCard artist={artist} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("TE")).toBeInTheDocument();
  });

  it("links to artist page", () => {
    render(<ArtistCard artist={mockArtist} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/artist/a-1");
  });
});
