import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<EmptyState title="title" description="Try a different search" />);
    expect(screen.getByText("Try a different search")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    const { container } = render(<EmptyState title="title" />);
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
  });

  it("renders icon when provided", () => {
    render(
      <EmptyState
        title="title"
        icon={<span data-testid="custom-icon">★</span>}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("does not render icon wrapper when icon not provided", () => {
    const { container } = render(<EmptyState title="title" />);
    expect(container.querySelector(".mb-2")).not.toBeInTheDocument();
  });
});
