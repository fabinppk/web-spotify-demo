import { describe, it, expect } from "vitest";
import { getArtistsString } from "../stringsUtils";

describe("getArtistsString", () => {
  it("joins multiple artist names with comma and space", () => {
    const artists = [{ name: "Artist A" }, { name: "Artist B" }] as Artist[];
    expect(getArtistsString(artists)).toBe("Artist A, Artist B");
  });

  it("returns single artist name as-is", () => {
    expect(getArtistsString([{ name: "Solo Artist" }] as Artist[])).toBe(
      "Solo Artist",
    );
  });

  it("returns empty string for empty array", () => {
    expect(getArtistsString([])).toBe("");
  });

  it("returns undefined for undefined input", () => {
    expect(getArtistsString(undefined)).toBeUndefined();
  });

  it("joins three artists correctly", () => {
    const artists = [{ name: "A" }, { name: "B" }, { name: "C" }] as Artist[];
    expect(getArtistsString(artists)).toBe("A, B, C");
  });
});
