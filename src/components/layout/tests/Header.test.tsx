import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mockLogout = vi.fn();
const mockNavigate = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock("@/hooks", () => ({
  useAuth: () => ({ logout: mockLogout }),
  useTheme: () => ({ theme: "dark", toggleTheme: mockToggleTheme }),
}));
vi.mock("@/hooks/useSpotifyQueries", () => ({
  useCurrentUserProfile: vi.fn(() => ({
    data: { display_name: "Test User", images: [{ url: "http://avatar.jpg" }] },
  })),
}));
vi.mock("@/stores/useContentStore", () => ({
  useContentStore: () => ({
    setCurrentContent: vi.fn(),
    setSearchQuery: vi.fn(),
  }),
}));
vi.mock("@/modules", () => ({
  useNavigate: () => mockNavigate,
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "pt", changeLanguage: vi.fn() },
  }),
  Sun: () => <svg data-testid="sun-icon" />,
  Moon: () => <svg data-testid="moon-icon" />,
  Languages: () => <svg />,
  LogOut: () => <svg />,
  Heart: () => <svg />,
}));
vi.mock("@/components/ui/input", () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}));
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => <button onClick={onClick}>{children}</button>,
  DropdownMenuSeparator: () => <hr />,
}));
vi.mock("@/components/icons/home", () => ({
  SpotifyLogo: () => <svg data-testid="spotify-logo" />,
  BrowseIcon: () => <svg />,
}));

import { Header } from "../Header";

describe("Header", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders header element", () => {
    render(<Header />);
    expect(screen.getByTestId("header-element")).toBeInTheDocument();
  });

  it("renders Spotify logo button", () => {
    render(<Header />);
    expect(screen.getByLabelText("Spotify")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(<Header />);
    expect(screen.getByTestId("searchbar-element")).toBeInTheDocument();
  });

  it("renders avatar trigger", () => {
    render(<Header />);
    expect(screen.getByTestId("avatar-element")).toBeInTheDocument();
  });

  it("renders dropdown with theme toggle", () => {
    render(<Header />);
    expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
    expect(screen.getByText("COMPONENTS.HEADER.lightMode")).toBeInTheDocument();
  });

  it("renders logout item", () => {
    render(<Header />);
    expect(screen.getByText("COMPONENTS.HEADER.logout")).toBeInTheDocument();
  });

  it("calls logout when logout item clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByText("COMPONENTS.HEADER.logout"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("shows sun icon in dark theme", () => {
    render(<Header />);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("navigates home when Spotify logo clicked", () => {
    render(<Header />);
    fireEvent.click(screen.getByLabelText("Spotify"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders user initials in avatar fallback", () => {
    render(<Header />);
    expect(screen.getByText("TE")).toBeInTheDocument();
  });
});
