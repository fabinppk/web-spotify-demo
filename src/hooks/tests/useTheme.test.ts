import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { createElement } from "react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { useTheme } from "../useTheme";
import { Theme } from "@/utils";

function createWrapper() {
  return ({ children }: { children: React.ReactNode }) =>
    createElement(ThemeProvider, null, children);
}

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("throws when used outside ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used within ThemeProvider",
    );
  });

  it("returns theme and toggleTheme inside ThemeProvider", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });
    expect(result.current.theme).toBeDefined();
    expect(typeof result.current.toggleTheme).toBe("function");
  });

  it("defaults to dark when no localStorage and no matchMedia", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });
    expect(result.current.theme).toBe(Theme.Dark);
  });

  it("reads light theme from localStorage", () => {
    localStorage.setItem("theme", Theme.Light);
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });
    expect(result.current.theme).toBe(Theme.Light);
  });

  it("toggleTheme switches dark to light", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });
    expect(result.current.theme).toBe(Theme.Dark);
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe(Theme.Light);
  });

  it("toggleTheme switches light to dark", () => {
    localStorage.setItem("theme", Theme.Light);
    const { result } = renderHook(() => useTheme(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe(Theme.Dark);
  });
});
