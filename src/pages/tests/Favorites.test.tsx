import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("@/components/features/favorites/AddFavoriteForm", () => ({
  AddFavoriteForm: () => <div data-testid="add-favorite-form" />,
}));
vi.mock("@/components/features/favorites/FavoritesList", () => ({
  FavoritesList: () => <div data-testid="favorites-list" />,
}));

import Favorites from "../Favorites";

describe("Favorites", () => {
  it("renders page title", () => {
    render(<Favorites />);
    expect(screen.getByText("PAGES.FAVORITES.title")).toBeInTheDocument();
  });

  it("renders AddFavoriteForm", () => {
    render(<Favorites />);
    expect(screen.getByTestId("add-favorite-form")).toBeInTheDocument();
  });

  it("renders FavoritesList", () => {
    render(<Favorites />);
    expect(screen.getByTestId("favorites-list")).toBeInTheDocument();
  });
});
