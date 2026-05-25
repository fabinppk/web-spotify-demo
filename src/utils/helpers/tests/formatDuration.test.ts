import { describe, it, expect } from "vitest";
import { formatDuration, formatTotalDuration } from "../formatDuration";

describe("formatDuration", () => {
  it("formats 0ms as 0:00", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("formats 215000ms as 3:35", () => {
    expect(formatDuration(215000)).toBe("3:35");
  });

  it("pads single-digit seconds with leading zero", () => {
    expect(formatDuration(65000)).toBe("1:05");
  });

  it("handles over 1 hour", () => {
    expect(formatDuration(3661000)).toBe("61:01");
  });

  it("truncates sub-second precision", () => {
    expect(formatDuration(1999)).toBe("0:01");
  });

  it("formats exactly 1 minute", () => {
    expect(formatDuration(60000)).toBe("1:00");
  });
});

describe("formatTotalDuration", () => {
  it("returns minutes only when under 1 hour", () => {
    expect(formatTotalDuration(1800000)).toBe("30 min");
  });

  it("returns hr and min format when 1 hour or more", () => {
    expect(formatTotalDuration(5400000)).toBe("1 hr 30 min");
  });

  it("handles exactly 1 hour", () => {
    expect(formatTotalDuration(3600000)).toBe("1 hr 0 min");
  });

  it("handles 0ms", () => {
    expect(formatTotalDuration(0)).toBe("0 min");
  });

  it("handles multiple hours", () => {
    expect(formatTotalDuration(9000000)).toBe("2 hr 30 min");
  });
});
