import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

const mockDispatch = vi.fn();
const mockUseFavorites = vi.fn();

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => mockUseFavorites(),
}));
vi.mock("@/modules", async () => {
  const { useForm } = await import("react-hook-form");
  const { z } = await import("zod");
  return {
    useTranslation: () => ({ t: (k: string) => k }),
    useForm,
    z,
  };
});
vi.mock("@/components/ui/FormField", () => ({
  FormField: ({
    children,
    label,
    error,
  }: {
    children: React.ReactNode;
    label: string;
    error?: string;
  }) => (
    <div>
      <label>{label}</label>
      {children}
      {error && <span data-testid="field-error">{error}</span>}
    </div>
  ),
}));
vi.mock("@/components/ui/input", () => ({
  Input: React.forwardRef(
    (
      props: React.InputHTMLAttributes<HTMLInputElement>,
      ref: React.Ref<HTMLInputElement>,
    ) => <input {...props} ref={ref} />,
  ),
}));

import { AddFavoriteForm } from "../AddFavoriteForm";

describe("AddFavoriteForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFavorites.mockReturnValue({ dispatch: mockDispatch });
  });

  it("renders form title", () => {
    render(<AddFavoriteForm />);
    expect(screen.getByText("PAGES.FAVORITES.addTitle")).toBeInTheDocument();
  });

  it("renders name input", () => {
    render(<AddFavoriteForm />);
    expect(
      screen.getByPlaceholderText("PAGES.FAVORITES.namePlaceholder"),
    ).toBeInTheDocument();
  });

  it("renders type select with 3 options", () => {
    render(<AddFavoriteForm />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "PAGES.FAVORITES.typeArtist" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "PAGES.FAVORITES.typeAlbum" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "PAGES.FAVORITES.typeTrack" }),
    ).toBeInTheDocument();
  });

  it("renders submit button", () => {
    render(<AddFavoriteForm />);
    expect(
      screen.getByRole("button", { name: "PAGES.FAVORITES.submit" }),
    ).toBeInTheDocument();
  });

  it("dispatches ADD_FAVORITE with valid data and resets form", async () => {
    render(<AddFavoriteForm />);
    const nameInput = screen.getByPlaceholderText(
      "PAGES.FAVORITES.namePlaceholder",
    );
    fireEvent.change(nameInput, { target: { value: "My Song" } });
    fireEvent.submit(nameInput.closest("form")!);
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ADD_FAVORITE",
          payload: expect.objectContaining({ name: "My Song", type: "track" }),
        }),
      );
    });
  });

  it("shows validation error when name empty", async () => {
    render(<AddFavoriteForm />);
    fireEvent.submit(
      screen
        .getByRole("button", { name: "PAGES.FAVORITES.submit" })
        .closest("form")!,
    );
    await waitFor(() => {
      expect(screen.getByTestId("field-error")).toBeInTheDocument();
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });
});
