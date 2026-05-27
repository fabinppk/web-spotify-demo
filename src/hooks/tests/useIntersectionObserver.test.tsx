import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useIntersectionObserver } from "../useIntersectionObserver";

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();
let capturedCallback: (entries: IntersectionObserverEntry[]) => void;

const MockIntersectionObserver = vi.fn((cb) => {
  capturedCallback = cb;
  return { observe: mockObserve, disconnect: mockDisconnect };
});

function Sentinel({ onIntersect }: { onIntersect: () => void }) {
  const ref = useIntersectionObserver(onIntersect);
  return <div ref={ref} data-testid="sentinel" />;
}

describe("useIntersectionObserver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, "IntersectionObserver", {
      writable: true,
      value: MockIntersectionObserver,
    });
  });

  it("creates an IntersectionObserver and observes the element", () => {
    render(<Sentinel onIntersect={vi.fn()} />);
    expect(MockIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledTimes(1);
  });

  it("calls callback when entry is intersecting", () => {
    const callback = vi.fn();
    render(<Sentinel onIntersect={callback} />);
    act(() => {
      capturedCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("does not call callback when entry is not intersecting", () => {
    const callback = vi.fn();
    render(<Sentinel onIntersect={callback} />);
    act(() => {
      capturedCallback([
        { isIntersecting: false } as IntersectionObserverEntry,
      ]);
    });
    expect(callback).not.toHaveBeenCalled();
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<Sentinel onIntersect={vi.fn()} />);
    unmount();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it("passes options to IntersectionObserver constructor", () => {
    const options = { threshold: 0.5, rootMargin: "10px" };
    function SentinelWithOptions({ onIntersect }: { onIntersect: () => void }) {
      const ref = useIntersectionObserver(onIntersect, options);
      return <div ref={ref} />;
    }
    render(<SentinelWithOptions onIntersect={vi.fn()} />);
    expect(MockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      options,
    );
  });
});
