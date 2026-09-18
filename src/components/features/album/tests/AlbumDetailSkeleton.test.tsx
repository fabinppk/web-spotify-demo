import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}));

import { AlbumDetailSkeleton } from "../AlbumDetailSkeleton";

describe("AlbumDetailSkeleton", () => {
  it("renders loading container", () => {
    render(<AlbumDetailSkeleton />);
    expect(screen.getByTestId("album-detail-loading")).toBeInTheDocument();
  });

  it("renders skeleton elements", () => {
    render(<AlbumDetailSkeleton />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });
});
