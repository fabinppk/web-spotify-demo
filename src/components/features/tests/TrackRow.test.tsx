import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();

vi.mock("@/modules", () => ({
  Play: () => <svg data-testid="play-icon" />,
  useNavigate: () => mockNavigate,
}));

import { TrackRow } from "../TrackRow";

const mockTrack: Track = {
  id: "track-1",
  uri: "spotify:track:1",
  name: "Test Track",
  duration_ms: 215000,
  disc_number: 1,
  track_number: 1,
  explicit: false,
  popularity: 80,
  external_urls: { spotify: "" },
  href: "",
  type: "track" as const,
  is_local: false,
  artists: [
    {
      id: "artist-1",
      name: "Artist One",
      external_urls: { spotify: "" },
      href: "",
      type: "artist" as const,
      uri: "",
    },
    {
      id: "artist-2",
      name: "Artist Two",
      external_urls: { spotify: "" },
      href: "",
      type: "artist" as const,
      uri: "",
    },
  ],
  album: {
    id: "album-1",
    name: "Test Album",
    images: [
      { url: "http://img.jpg", width: 300, height: 300 },
      { url: "http://img-sm.jpg", width: 64, height: 64 },
    ],
    artists: [],
    release_date: "2024-01-01",
    release_date_precision: "day" as const,
    album_type: "album" as const,
    total_tracks: 10,
    href: "",
    type: "album" as const,
    uri: "",
    external_urls: { spotify: "" },
  },
};

describe("TrackRow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders track name", () => {
    render(<TrackRow track={mockTrack} onPlay={vi.fn()} />);
    expect(screen.getByText("Test Track")).toBeInTheDocument();
  });

  it("renders artist names", () => {
    render(<TrackRow track={mockTrack} onPlay={vi.fn()} />);
    expect(screen.getByText("Artist One")).toBeInTheDocument();
    expect(screen.getByText("Artist Two")).toBeInTheDocument();
  });

  it("renders album name", () => {
    render(<TrackRow track={mockTrack} onPlay={vi.fn()} />);
    expect(screen.getByText("Test Album")).toBeInTheDocument();
  });

  it("calls onPlay with track uri when row clicked", () => {
    const onPlay = vi.fn();
    render(<TrackRow track={mockTrack} onPlay={onPlay} />);
    fireEvent.click(screen.getByRole("button", { name: /play test track/i }));
    expect(onPlay).toHaveBeenCalledWith("spotify:track:1");
  });

  it("navigates to artist page when artist button clicked", () => {
    render(<TrackRow track={mockTrack} onPlay={vi.fn()} />);
    fireEvent.click(screen.getByText("Artist One"));
    expect(mockNavigate).toHaveBeenCalledWith("/artist/artist-1");
  });

  it("navigates to album page when album button clicked", () => {
    render(<TrackRow track={mockTrack} onPlay={vi.fn()} />);
    fireEvent.click(screen.getByText("Test Album"));
    expect(mockNavigate).toHaveBeenCalledWith("/album/album-1");
  });

  it("shows track art img when image available", () => {
    render(<TrackRow track={mockTrack} onPlay={vi.fn()} />);
    expect(screen.getByTestId("track-art-img")).toBeInTheDocument();
  });

  it("shows placeholder when no album images", () => {
    const noImgTrack = {
      ...mockTrack,
      album: { ...mockTrack.album!, images: [] },
    };
    render(<TrackRow track={noImgTrack} onPlay={vi.fn()} />);
    expect(screen.getByTestId("track-art-placeholder")).toBeInTheDocument();
  });
});
