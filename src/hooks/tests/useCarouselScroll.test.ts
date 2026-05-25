import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, render, act } from "@testing-library/react";
import { createElement } from "react";
import { useCarouselScroll } from "../useCarouselScroll";

describe("useCarouselScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns initial state with canScrollLeft and canScrollRight false", () => {
    const { result } = renderHook(() => useCarouselScroll(null));
    expect(result.current.canScrollLeft).toBe(false);
    expect(result.current.canScrollRight).toBe(false);
    expect(typeof result.current.scroll).toBe("function");
    expect(result.current.scrollRef).toBeDefined();
  });

  it("scroll('right') calls scrollBy with positive left value", () => {
    const { result } = renderHook(() => useCarouselScroll(null));
    const scrollByMock = vi.fn();
    const div = document.createElement("div");
    div.scrollBy = scrollByMock;
    Object.defineProperty(result.current.scrollRef, "current", {
      get: () => div,
      configurable: true,
    });
    act(() => result.current.scroll("right"));
    expect(scrollByMock).toHaveBeenCalledWith(
      expect.objectContaining({ left: expect.any(Number) }),
    );
    const call = scrollByMock.mock.calls[0][0];
    expect(call.left).toBeGreaterThan(0);
  });

  it("scroll('left') calls scrollBy with negative left value", () => {
    const { result } = renderHook(() => useCarouselScroll(null));
    const scrollByMock = vi.fn();
    const div = document.createElement("div");
    div.scrollBy = scrollByMock;
    Object.defineProperty(result.current.scrollRef, "current", {
      get: () => div,
      configurable: true,
    });
    act(() => result.current.scroll("left"));
    const call = scrollByMock.mock.calls[0][0];
    expect(call.left).toBeLessThan(0);
  });

  it("updates canScrollLeft when scrollLeft > 0", () => {
    function Carousel() {
      const { scrollRef, canScrollLeft } = useCarouselScroll(null);
      return createElement(
        "div",
        { ref: scrollRef, "data-testid": "container" },
        createElement("span", { "data-testid": "can-left" }, String(canScrollLeft)),
      );
    }
    const { getByTestId } = render(createElement(Carousel));
    const container = getByTestId("container");
    Object.defineProperty(container, "scrollLeft", { get: () => 50, configurable: true });
    Object.defineProperty(container, "clientWidth", { get: () => 200, configurable: true });
    Object.defineProperty(container, "scrollWidth", { get: () => 500, configurable: true });
    act(() => { container.dispatchEvent(new Event("scroll")); });
    expect(getByTestId("can-left").textContent).toBe("true");
  });

  it("cleans up scroll and resize listeners on unmount", () => {
    function Carousel() {
      const { scrollRef } = useCarouselScroll(null);
      return createElement("div", { ref: scrollRef });
    }
    const addSpy = vi.spyOn(globalThis, "addEventListener");
    const removeSpy = vi.spyOn(globalThis, "removeEventListener");
    const { unmount } = render(createElement(Carousel));
    expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
