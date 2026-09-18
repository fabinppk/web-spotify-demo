import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("getInitialTheme", () => {
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches }),
    });
  };

  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("returns saved theme from localStorage when valid", async () => {
    localStorage.setItem("theme", "light");
    const { getInitialTheme } = await import("../themeUtils");
    expect(getInitialTheme()).toBe("light");
  });

  it("returns dark when matchMedia prefers dark and no saved theme", async () => {
    mockMatchMedia(true);
    vi.resetModules();
    const { getInitialTheme } = await import("../themeUtils");
    expect(getInitialTheme()).toBe("dark");
  });

  it("returns light when matchMedia prefers light and no saved theme", async () => {
    mockMatchMedia(false);
    vi.resetModules();
    const { getInitialTheme } = await import("../themeUtils");
    expect(getInitialTheme()).toBe("light");
  });

  it("ignores invalid saved theme and falls back to matchMedia", async () => {
    localStorage.setItem("theme", "blue");
    mockMatchMedia(true);
    vi.resetModules();
    const { getInitialTheme } = await import("../themeUtils");
    expect(getInitialTheme()).toBe("dark");
  });
});
