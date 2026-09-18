import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/modules", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

import { NavHeader } from "../NavHeader";

describe("NavHeader", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders three filter chips", () => {
    render(<NavHeader active="All" onChange={vi.fn()} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("active chip has aria-checked true", () => {
    render(<NavHeader active="Playlists" onChange={vi.fn()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toHaveAttribute("aria-checked", "true");
  });

  it("inactive chips have aria-checked false", () => {
    render(<NavHeader active="All" onChange={vi.fn()} />);
    const radios = screen.getAllByRole("radio");
    expect(radios[1]).toHaveAttribute("aria-checked", "false");
    expect(radios[2]).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with All when first chip clicked", () => {
    const onChange = vi.fn();
    render(<NavHeader active="Playlists" onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[0]);
    expect(onChange).toHaveBeenCalledWith("All");
  });

  it("calls onChange with Playlists when second chip clicked", () => {
    const onChange = vi.fn();
    render(<NavHeader active="All" onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[1]);
    expect(onChange).toHaveBeenCalledWith("Playlists");
  });

  it("calls onChange with Artists when third chip clicked", () => {
    const onChange = vi.fn();
    render(<NavHeader active="All" onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[2]);
    expect(onChange).toHaveBeenCalledWith("Artists");
  });

  it("has radiogroup role", () => {
    render(<NavHeader active="All" onChange={vi.fn()} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
  });
});
