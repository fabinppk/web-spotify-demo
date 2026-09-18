import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

import { PlaylistDetailSkeleton } from "../PlaylistDetailSkeleton";

describe("PlaylistDetailSkeleton", () => {
  it("renders loading container", () => {
    render(<PlaylistDetailSkeleton />);
    expect(screen.getByTestId("playlist-detail-loading")).toBeInTheDocument();
  });

  it("renders skeleton elements", () => {
    render(<PlaylistDetailSkeleton />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });
});
