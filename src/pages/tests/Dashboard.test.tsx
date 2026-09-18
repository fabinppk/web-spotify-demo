import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/components/layout/Header", () => ({
  Header: () => <div data-testid="header" />,
}));
vi.mock("@/components/layout/Sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar" />,
}));
vi.mock("@/components/layout/MainPanel", () => ({
  MainPanel: () => <div data-testid="mainpanel" />,
}));
vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/components/layout/PlayerBar", () => ({
  PlayerBar: () => <div data-testid="player-bar" />,
}));
vi.mock("@/components/features/NowPlaying", () => ({
  NowPlaying: () => <div data-testid="now-playing" />,
}));
vi.mock("@/components/layout/MobileTabBar", () => ({
  MobileTabBar: () => <div data-testid="mobile-tab-bar" />,
}));

import Dashboard from "../Dashboard";

describe("Dashboard", () => {
  it("renders layout shell with correct testid", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("dashboard-element")).toBeInTheDocument();
  });

  it("renders Header", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it("renders Sidebar", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renders MainPanel", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("mainpanel")).toBeInTheDocument();
  });
});
