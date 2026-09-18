import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("i18next", () => {
  const listeners: Record<string, ((arg: string) => void)[]> = {};
  const instance = {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockReturnThis(),
    on: vi.fn((event: string, cb: (arg: string) => void) => {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(cb);
    }),
    emit: (event: string, arg: string) => {
      listeners[event]?.forEach((cb) => cb(arg));
    },
    _listeners: listeners,
  };
  return { default: instance };
});

vi.mock("react-i18next", () => ({
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/utils", () => ({
  TranslatedTexts: {
    EnTexts: {},
    PtTexts: {},
  },
}));

describe("i18n.service", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    vi.resetModules();
    localStorage.clear();
  });

  it("initializes i18n with pt as default when no localStorage key", async () => {
    const i18n = (await import("i18next")).default;
    await import("../i18n.service");
    expect(i18n.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: "pt" }),
    );
  });

  it("uses saved language from localStorage", async () => {
    localStorage.setItem("language", "en");
    const i18n = (await import("i18next")).default;
    await import("../i18n.service");
    expect(i18n.init).toHaveBeenCalledWith(
      expect.objectContaining({ lng: "en" }),
    );
  });

  it("persists valid language change to localStorage", async () => {
    const i18n = (await import("i18next"))
      .default as typeof import("i18next").default & {
      emit: (event: string, arg: string) => void;
    };
    await import("../i18n.service");
    i18n.emit("languageChanged", "en");
    expect(localStorage.getItem("language")).toBe("en");
  });

  it("ignores unsupported language on change event", async () => {
    const i18n = (await import("i18next"))
      .default as typeof import("i18next").default & {
      emit: (event: string, arg: string) => void;
    };
    await import("../i18n.service");
    i18n.emit("languageChanged", "fr");
    expect(localStorage.getItem("language")).toBeNull();
  });
});
