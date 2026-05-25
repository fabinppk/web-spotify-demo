import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useContentStore } from "../useContentStore";
import { MainContent } from "@/utils";

describe("useContentStore", () => {
  beforeEach(() => {
    useContentStore.setState({
      currentContent: MainContent.PLAYER,
      searchQuery: "",
    });
  });

  it("has initial state PLAYER with empty search query", () => {
    const { result } = renderHook(() => useContentStore());
    expect(result.current.currentContent).toBe(MainContent.PLAYER);
    expect(result.current.searchQuery).toBe("");
  });

  it("setCurrentContent updates the current content", () => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.setCurrentContent(MainContent.BROWSE);
    });
    expect(result.current.currentContent).toBe(MainContent.BROWSE);
  });

  it("setCurrentContent can switch back to PLAYER", () => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.setCurrentContent(MainContent.BROWSE);
    });
    act(() => {
      result.current.setCurrentContent(MainContent.PLAYER);
    });
    expect(result.current.currentContent).toBe(MainContent.PLAYER);
  });

  it("setSearchQuery updates the search query", () => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.setSearchQuery("metallica");
    });
    expect(result.current.searchQuery).toBe("metallica");
  });

  it("setSearchQuery can clear the query", () => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.setSearchQuery("metallica");
    });
    act(() => {
      result.current.setSearchQuery("");
    });
    expect(result.current.searchQuery).toBe("");
  });

  it("content and query updates are independent", () => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.setCurrentContent(MainContent.BROWSE);
      result.current.setSearchQuery("rock");
    });
    expect(result.current.currentContent).toBe(MainContent.BROWSE);
    expect(result.current.searchQuery).toBe("rock");
  });
});
