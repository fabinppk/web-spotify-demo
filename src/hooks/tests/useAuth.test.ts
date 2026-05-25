import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { useAuth } from "../useAuth";
import { AuthContext } from "@/context/AuthContext";

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider",
    );
  });

  it("returns the auth context values when inside AuthProvider", () => {
    const mockValue: AuthContextType = {
      accessToken: "test-token",
      isLoading: false,
      login: async () => {},
      logout: () => {},
      refreshToken: "refresh-token",
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(AuthContext.Provider, { value: mockValue }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.accessToken).toBe("test-token");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.refreshToken).toBe("refresh-token");
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.logout).toBe("function");
  });

  it("returns null accessToken when not authenticated", () => {
    const mockValue: AuthContextType = {
      accessToken: null,
      isLoading: false,
      login: async () => {},
      logout: () => {},
      refreshToken: null,
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(AuthContext.Provider, { value: mockValue }, children);

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.accessToken).toBeNull();
  });
});
