import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();

vi.mock("@/modules", () => ({
  Play: () => <svg data-testid="play-icon" />,
  useNavigate: () => mockNavigate,
}));

import { AlbumTrackRow } from "../AlbumTrackRow";

const mockTrack = {
  id: "t-1",
  name: "Track Name",
  duration_ms: 210000,
  artists: [
    {
      id: "a-1",
      name: "Artist A",
      external_urls: { spotify: "" },
      href: "",
      type: "artist" as const,
      uri: "",
    },
    {
      id: "a-2",
      name: "Artist B",
      external_urls: { spotify: "" },
      href: "",
      type: "artist" as const,
      uri: "",
    },
  ],
};

describe("AlbumTrackRow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders 1-based index", () => {
    render(
      <AlbumTrackRow
        track={mockTrack}
        index={2}
        formattedDuration="3:30"
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders track name", () => {
    render(
      <AlbumTrackRow
        track={mockTrack}
        index={0}
        formattedDuration="3:30"
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("Track Name")).toBeInTheDocument();
  });

  it("renders all artist names", () => {
    render(
      <AlbumTrackRow
        track={mockTrack}
        index={0}
        formattedDuration="3:30"
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("Artist A")).toBeInTheDocument();
    expect(screen.getByText("Artist B")).toBeInTheDocument();
  });

  it("renders formatted duration", () => {
    render(
      <AlbumTrackRow
        track={mockTrack}
        index={0}
        formattedDuration="3:30"
        onPlay={vi.fn()}
      />,
    );
    expect(screen.getByText("3:30")).toBeInTheDocument();
  });

  it("calls onPlay when row clicked", () => {
    const onPlay = vi.fn();
    render(
      <AlbumTrackRow
        track={mockTrack}
        index={0}
        formattedDuration="3:30"
        onPlay={onPlay}
      />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /track name by artist a/i }),
    );
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("navigates to artist page when artist clicked", () => {
    render(
      <AlbumTrackRow
        track={mockTrack}
        index={0}
        formattedDuration="3:30"
        onPlay={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Artist A"));
    expect(mockNavigate).toHaveBeenCalledWith("/artist/a-1");
  });
});
