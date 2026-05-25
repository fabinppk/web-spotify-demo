import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createElement } from "react";

vi.mock("@/services/auth.service", () => ({
  getToken: vi.fn(),
  redirectToSpotifyAuthorize: vi.fn(),
  REQUIRED_SCOPES: ["user-read-playback-state"],
}));

const mockGetValidAccessToken = vi.hoisted(() => vi.fn());

vi.mock("@/utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/utils")>();
  return { ...actual, getValidAccessToken: mockGetValidAccessToken };
});

import { AuthProvider } from "../AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { getToken } from "@/services/auth.service";

function TestConsumer() {
  const { accessToken, isLoading, logout } = useAuth();
  return (
    <div>
      <span data-testid="token">{accessToken ?? "null"}</span>
      <span data-testid="loading">{isLoading ? "loading" : "done"}</span>
      <button data-testid="logout" onClick={logout} />
    </div>
  );
}

function renderProvider() {
  return render(createElement(AuthProvider, null, createElement(TestConsumer)));
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockGetValidAccessToken.mockResolvedValue(null);
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    window.history.pushState({}, "", "/");
  });

  it("sets accessToken null when no token and no code", async () => {
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    expect(screen.getByTestId("token").textContent).toBe("null");
  });

  it("loads existing valid access token from getValidAccessToken", async () => {
    localStorage.setItem("access_token", "stored-token");
    localStorage.setItem("token_scope", "user-read-playback-state");
    mockGetValidAccessToken.mockResolvedValue("stored-token");
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    expect(screen.getByTestId("token").textContent).toBe("stored-token");
  });

  // it("exchanges ?code for token and stores in localStorage", async () => {
  //   window.history.pushState({}, "", "/?code=auth-code-123");
  //   vi.mocked(getToken).mockResolvedValue({
  //     access_token: "new-access",
  //     refresh_token: "new-refresh",
  //     expires_in: 3600,
  //     token_type: "Bearer",
  //     scope: "user-read-playback-state",
  //   });
  //   // After exchange, URL loses ?code, effect re-runs via else branch.
  //   // Real getValidAccessToken reads localStorage — simulate that here.
  //   mockGetValidAccessToken.mockImplementation(() =>
  //     Promise.resolve(localStorage.getItem("access_token")),
  //   );
  //   renderProvider();
  //   await waitFor(() =>
  //     expect(screen.getByTestId("loading").textContent).toBe("done"),
  //   );
  //   expect(screen.getByTestId("token").textContent).toBe("new-access");
  //   expect(vi.mocked(getToken)).toHaveBeenCalledWith("auth-code-123");
  //   expect(localStorage.getItem("access_token")).toBe("new-access");
  //   expect(localStorage.getItem("refresh_token")).toBe("new-refresh");
  // });

  it("sets accessToken null when getToken throws", async () => {
    window.history.pushState({}, "", "/?code=bad-code");
    vi.mocked(getToken).mockRejectedValue(new Error("invalid_grant"));
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    expect(screen.getByTestId("token").textContent).toBe("null");
  });

  it("clears tokens when stored token lacks required scopes", async () => {
    localStorage.setItem("access_token", "old-token");
    localStorage.setItem("token_scope", "wrong-scope");
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  it("logout clears all tokens and sets accessToken null", async () => {
    localStorage.setItem("access_token", "token");
    localStorage.setItem("refresh_token", "refresh");
    localStorage.setItem("token_scope", "user-read-playback-state");
    mockGetValidAccessToken.mockResolvedValue("token");
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    act(() => screen.getByTestId("logout").click());
    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
  });

  it("handles spotify:auth-failure event clearing token", async () => {
    localStorage.setItem("access_token", "token");
    localStorage.setItem("token_scope", "user-read-playback-state");
    mockGetValidAccessToken.mockResolvedValue("token");
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    act(() => {
      globalThis.dispatchEvent(new Event("spotify:auth-failure"));
    });
    expect(screen.getByTestId("token").textContent).toBe("null");
  });

  it("handles spotify:token-refreshed event updating token", async () => {
    renderProvider();
    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("done"),
    );
    act(() => {
      globalThis.dispatchEvent(
        new CustomEvent("spotify:token-refreshed", {
          detail: "refreshed-token",
        }),
      );
    });
    expect(screen.getByTestId("token").textContent).toBe("refreshed-token");
  });
});
