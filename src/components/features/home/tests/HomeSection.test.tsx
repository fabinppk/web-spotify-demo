import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { HomeSection } from "../HomeSection";

describe("HomeSection", () => {
  it("renders children", () => {
    render(
      <HomeSection>
        <div data-testid="child">content</div>
      </HomeSection>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders title when provided", () => {
    render(
      <HomeSection title="Top Artists">
        <div />
      </HomeSection>,
    );
    expect(screen.getByText("Top Artists")).toBeInTheDocument();
  });

  it("does not render heading without title", () => {
    render(
      <HomeSection>
        <div />
      </HomeSection>,
    );
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
