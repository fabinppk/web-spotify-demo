import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockDispatch = vi.fn();
const mockUseFavorites = vi.fn();

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => mockUseFavorites(),
}));
vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
  Trash2: () => <svg data-testid="trash-icon" />,
  X: () => <svg data-testid="x-icon" />,
}));

import { FavoritesList } from "../FavoritesList";

const makeFavorite = (
  id: string,
  name: string,
  type: "track" | "artist" | "album",
  note?: string,
): FavoriteItem => ({
  id,
  name,
  type,
  note,
});

describe("FavoritesList", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows empty message when no favorites", () => {
    mockUseFavorites.mockReturnValue({ favorites: [], dispatch: mockDispatch });
    render(<FavoritesList />);
    expect(screen.getByText("PAGES.FAVORITES.noFavorites")).toBeInTheDocument();
  });

  it("renders favorite items", () => {
    mockUseFavorites.mockReturnValue({
      favorites: [
        makeFavorite("1", "My Track", "track"),
        makeFavorite("2", "My Artist", "artist"),
      ],
      dispatch: mockDispatch,
    });
    render(<FavoritesList />);
    expect(screen.getByText("My Track")).toBeInTheDocument();
    expect(screen.getByText("My Artist")).toBeInTheDocument();
  });

  it("shows count in title", () => {
    mockUseFavorites.mockReturnValue({
      favorites: [makeFavorite("1", "Track", "track")],
      dispatch: mockDispatch,
    });
    render(<FavoritesList />);
    expect(screen.getByText(/\(1\)/)).toBeInTheDocument();
  });

  it("calls REMOVE_FAVORITE dispatch on remove click", () => {
    mockUseFavorites.mockReturnValue({
      favorites: [makeFavorite("1", "My Track", "track")],
      dispatch: mockDispatch,
    });
    render(<FavoritesList />);
    fireEvent.click(screen.getByLabelText("PAGES.FAVORITES.removeButton"));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "REMOVE_FAVORITE",
      payload: { id: "1" },
    });
  });

  it("calls CLEAR_FAVORITES on clear all click", () => {
    mockUseFavorites.mockReturnValue({
      favorites: [makeFavorite("1", "My Track", "track")],
      dispatch: mockDispatch,
    });
    render(<FavoritesList />);
    fireEvent.click(screen.getByText("PAGES.FAVORITES.clearAll"));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "CLEAR_FAVORITES" });
  });

  it("does not show clear all button when empty", () => {
    mockUseFavorites.mockReturnValue({ favorites: [], dispatch: mockDispatch });
    render(<FavoritesList />);
    expect(
      screen.queryByText("PAGES.FAVORITES.clearAll"),
    ).not.toBeInTheDocument();
  });

  it("renders note when provided", () => {
    mockUseFavorites.mockReturnValue({
      favorites: [makeFavorite("1", "Track", "track", "great song")],
      dispatch: mockDispatch,
    });
    render(<FavoritesList />);
    expect(screen.getByText("great song")).toBeInTheDocument();
  });
});
