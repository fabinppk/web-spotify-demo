import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../base.api", () => ({
  SpotifyApiClient: class {
    get = vi.fn();
  },
}));

import { UserApi } from "../user.api";
import { SpotifyApiClient } from "../base.api";

describe("UserApi", () => {
  let api: UserApi;
  let mockClient: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockClient = new SpotifyApiClient("") as unknown as {
      get: ReturnType<typeof vi.fn>;
    };
    api = new UserApi(mockClient as unknown as SpotifyApiClient);
  });

  it("calls /me endpoint", async () => {
    const profile = { id: "u1", display_name: "Test User" };
    mockClient.get.mockResolvedValueOnce(profile);
    const result = await api.getCurrentUserProfile();
    expect(mockClient.get).toHaveBeenCalledWith("/me");
    expect(result).toEqual(profile);
  });
});
