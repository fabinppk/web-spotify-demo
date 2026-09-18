import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("@/components/icons/sidebar", () => ({
  LibraryIcon: () => <svg data-testid="library-icon" />,
}));

import { SidebarHeader } from "../SidebarHeader";

const defaultProps = {
  filter: "all" as FilterType,
  searchOpen: false,
  searchQuery: "",
  onFilterChange: vi.fn(),
  onSearchOpen: vi.fn(),
  onSearchChange: vi.fn(),
  onSearchBlur: vi.fn(),
};

describe("SidebarHeader", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders library icon", () => {
    render(<SidebarHeader {...defaultProps} />);
    expect(screen.getByTestId("library-icon")).toBeInTheDocument();
  });

  it("renders your library label", () => {
    render(<SidebarHeader {...defaultProps} />);
    expect(
      screen.getByText("COMPONENTS.SIDEBAR.yourLibrary"),
    ).toBeInTheDocument();
  });

  it("renders 3 filter chips", () => {
    render(<SidebarHeader {...defaultProps} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });

  it("calls onFilterChange when a filter chip clicked", () => {
    const onFilterChange = vi.fn();
    render(<SidebarHeader {...defaultProps} onFilterChange={onFilterChange} />);
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onFilterChange).toHaveBeenCalledTimes(1);
  });

  it("active chip toggles filter off when clicked again", () => {
    const onFilterChange = vi.fn();
    render(
      <SidebarHeader
        {...defaultProps}
        filter="playlists"
        onFilterChange={onFilterChange}
      />,
    );
    // First chip is playlists — clicking active chip should call with "all"
    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(onFilterChange).toHaveBeenCalledWith("all");
  });
});
