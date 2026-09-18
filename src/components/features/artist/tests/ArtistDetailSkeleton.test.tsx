import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

import { ArtistDetailSkeleton } from "../ArtistDetailSkeleton";

describe("ArtistDetailSkeleton", () => {
  it("renders loading container", () => {
    render(<ArtistDetailSkeleton />);
    expect(screen.getByTestId("artist-detail-loading")).toBeInTheDocument();
  });

  it("renders skeleton elements", () => {
    render(<ArtistDetailSkeleton />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });
});
