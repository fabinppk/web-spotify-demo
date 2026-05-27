import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useNavHeader } from "../useNavHeader";

describe("useNavHeader", () => {
  it("initial activeFilter is All", () => {
    const { result } = renderHook(() => useNavHeader());
    expect(result.current.activeFilter).toBe("All");
  });

  it("setActiveFilter updates activeFilter", () => {
    const { result } = renderHook(() => useNavHeader());
    act(() => {
      result.current.setActiveFilter("Playlists");
    });
    expect(result.current.activeFilter).toBe("Playlists");
  });

  it("exposes setActiveFilter function", () => {
    const { result } = renderHook(() => useNavHeader());
    expect(typeof result.current.setActiveFilter).toBe("function");
  });
});
