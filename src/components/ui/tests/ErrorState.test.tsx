import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

import { ErrorState } from "../ErrorState";

describe("ErrorState", () => {
  it("renders message text", () => {
    render(<ErrorState message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("does not render retry button when onRetry not provided", () => {
    render(<ErrorState message="error" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders retry button when onRetry provided", () => {
    render(<ErrorState message="error" onRetry={vi.fn()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onRetry when retry button clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorState message="error" onRetry={onRetry} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
