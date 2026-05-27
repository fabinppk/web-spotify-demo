import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  toast: { info: vi.fn() },
}));
vi.mock("../../TrackRow", () => ({
  TrackRow: ({ track }: { track: Track }) => (
    <div data-testid="track-row">{track.name}</div>
  ),
}));

import { PlaylistTrackList } from "../PlaylistTrackList";

const makePlaylistItem = (id: string, name: string): PlaylistItem =>
  ({
    added_at: "2023-01-01",
    added_by: {
      external_urls: { spotify: "" },
      href: "",
      id: "u1",
      type: "user",
      uri: "",
    },
    is_local: false,
    item: {
      id,
      name,
      type: "track",
      duration_ms: 200000,
      track_number: 1,
      disc_number: 1,
      explicit: false,
      popularity: 80,
      uri: `spotify:track:${id}`,
      href: "",
      external_urls: { spotify: "" },
      is_local: false,
      artists: [],
      album: {
        id: "al-1",
        name: "Album",
        images: [],
        release_date: "2023",
        release_date_precision: "year" as const,
        album_type: "album" as const,
        total_tracks: 1,
        href: "",
        type: "album" as const,
        artists: [],
        uri: "",
        external_urls: { spotify: "" },
      },
    },
  }) as unknown as PlaylistItem;

describe("PlaylistTrackList", () => {
  it("renders track rows for each track", () => {
    const items = [
      makePlaylistItem("t1", "Track One"),
      makePlaylistItem("t2", "Track Two"),
    ];
    render(<PlaylistTrackList items={items} />);
    expect(screen.getAllByTestId("track-row")).toHaveLength(2);
    expect(screen.getByText("Track One")).toBeInTheDocument();
  });

  it("shows empty message when no items", () => {
    render(<PlaylistTrackList items={[]} />);
    expect(
      screen.getByText("PAGES.PLAYLIST_DETAIL.noTracks"),
    ).toBeInTheDocument();
  });

  it("filters out non-track items", () => {
    const items: PlaylistItem[] = [
      makePlaylistItem("t1", "Track One"),
      {
        added_at: "2023-01-01",
        item: {
          ...makePlaylistItem("e1", "Episode").item,
          type: "episode",
        },
      } as unknown as PlaylistItem,
    ];
    render(<PlaylistTrackList items={items} />);
    expect(screen.getAllByTestId("track-row")).toHaveLength(1);
  });

  it("renders title column header", () => {
    render(<PlaylistTrackList items={[makePlaylistItem("t1", "Track")]} />);
    expect(
      screen.getByText("PAGES.PLAYLIST_DETAIL.titleColumn"),
    ).toBeInTheDocument();
  });
});
