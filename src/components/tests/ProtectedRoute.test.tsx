import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("@/pages/Login", () => ({
  default: () => <div data-testid="login-page" />,
}));

import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "../ProtectedRoute";

const mockAuth = (overrides: Partial<ReturnType<typeof useAuth>>) => {
  vi.mocked(useAuth).mockReturnValue({
    accessToken: null,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshToken: null,
    ...overrides,
  } as ReturnType<typeof useAuth>);
};

describe("ProtectedRoute", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders children when authenticated and not loading", () => {
    mockAuth({ accessToken: "tok", isLoading: false });
    render(
      <ProtectedRoute>
        <div data-testid="child" />
      </ProtectedRoute>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("renders Login when not authenticated and not loading", () => {
    mockAuth({ accessToken: null, isLoading: false });
    render(
      <ProtectedRoute>
        <div data-testid="child" />
      </ProtectedRoute>,
    );
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
  });

  it("renders loading spinner when isLoading true", () => {
    mockAuth({ accessToken: null, isLoading: true });
    render(
      <ProtectedRoute>
        <div data-testid="child" />
      </ProtectedRoute>,
    );
    expect(screen.queryByTestId("child")).not.toBeInTheDocument();
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders children not login when token exists even on reload", () => {
    mockAuth({ accessToken: "refresh-token", isLoading: false });
    render(
      <ProtectedRoute>
        <span data-testid="protected-content">Dashboard</span>
      </ProtectedRoute>,
    );
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });
});
