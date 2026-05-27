import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { TopTracksChart } from "../TopTracksChart";

const makeTracks = (n: number): Track[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `t-${i}`,
    name: `Track ${i}`,
    popularity: 80 - i * 5,
    duration_ms: 200000,
    track_number: i + 1,
    disc_number: 1,
    explicit: false,
    href: "",
    type: "track" as const,
    is_local: false,
    uri: `spotify:track:t-${i}`,
    external_urls: { spotify: "" },
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
  })) as Track[];

describe("TopTracksChart", () => {
  it("renders chart title", () => {
    render(<TopTracksChart tracks={makeTracks(3)} />);
    expect(
      screen.getByText("PAGES.ARTIST_DETAIL.topTracksChart"),
    ).toBeInTheDocument();
  });

  it("renders BarChart with tracks", () => {
    render(<TopTracksChart tracks={makeTracks(3)} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  it("returns null when no tracks with popularity", () => {
    const tracksNoPop = makeTracks(2).map((t) => ({
      ...t,
      popularity: undefined as unknown as number,
    }));
    const { container } = render(<TopTracksChart tracks={tracksNoPop} />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when tracks array empty", () => {
    const { container } = render(<TopTracksChart tracks={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("slices to max 10 tracks", () => {
    render(<TopTracksChart tracks={makeTracks(15)} />);
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });
});
