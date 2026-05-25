import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createElement, useContext } from "react";
import { ThemeProvider } from "../ThemeProvider";
import { ThemeContext } from "../ThemeContext";
import { Theme, ThemeActionType } from "@/utils";

function TestConsumer() {
  const ctx = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme">{ctx?.theme}</span>
      <button
        data-testid="toggle"
        onClick={() => ctx?.dispatch({ type: ThemeActionType.Toggle })}
      />
      <button
        data-testid="set-light"
        onClick={() =>
          ctx?.dispatch({ type: ThemeActionType.Set, payload: Theme.Light })
        }
      />
      <button
        data-testid="set-dark"
        onClick={() =>
          ctx?.dispatch({ type: ThemeActionType.Set, payload: Theme.Dark })
        }
      />
    </div>
  );
}

function renderProvider() {
  return render(
    createElement(ThemeProvider, null, createElement(TestConsumer)),
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: undefined,
    });
  });

  it("defaults to dark when no localStorage and no matchMedia", () => {
    renderProvider();
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Dark);
  });

  it("reads light theme from localStorage on init", () => {
    localStorage.setItem("theme", Theme.Light);
    renderProvider();
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Light);
  });

  it("reads dark theme from localStorage on init", () => {
    localStorage.setItem("theme", Theme.Dark);
    renderProvider();
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Dark);
  });

  it("falls back to matchMedia dark when no localStorage entry", () => {
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    renderProvider();
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Dark);
  });

  it("falls back to matchMedia light when no localStorage entry", () => {
    Object.defineProperty(globalThis, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
    renderProvider();
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Light);
  });

  it("Toggle switches dark to light", () => {
    renderProvider();
    act(() => screen.getByTestId("toggle").click());
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Light);
  });

  it("Toggle switches light to dark", () => {
    localStorage.setItem("theme", Theme.Light);
    renderProvider();
    act(() => screen.getByTestId("toggle").click());
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Dark);
  });

  it("Set action sets theme explicitly", () => {
    renderProvider();
    act(() => screen.getByTestId("set-light").click());
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Light);
    act(() => screen.getByTestId("set-dark").click());
    expect(screen.getByTestId("theme").textContent).toBe(Theme.Dark);
  });

  it("adds dark class to documentElement when dark", () => {
    renderProvider();
    expect(document.documentElement.classList.contains(Theme.Dark)).toBe(true);
    expect(document.documentElement.classList.contains(Theme.Light)).toBe(
      false,
    );
  });

  it("adds light class to documentElement when light", () => {
    localStorage.setItem("theme", Theme.Light);
    renderProvider();
    expect(document.documentElement.classList.contains(Theme.Light)).toBe(true);
    expect(document.documentElement.classList.contains(Theme.Dark)).toBe(false);
  });

  it("swaps CSS classes on toggle", () => {
    renderProvider();
    act(() => screen.getByTestId("toggle").click());
    expect(document.documentElement.classList.contains(Theme.Light)).toBe(true);
    expect(document.documentElement.classList.contains(Theme.Dark)).toBe(false);
  });

  it("persists theme to localStorage on toggle", () => {
    renderProvider();
    act(() => screen.getByTestId("toggle").click());
    expect(localStorage.getItem("theme")).toBe(Theme.Light);
  });

  it("persists theme to localStorage on Set", () => {
    renderProvider();
    act(() => screen.getByTestId("set-light").click());
    expect(localStorage.getItem("theme")).toBe(Theme.Light);
  });
});
