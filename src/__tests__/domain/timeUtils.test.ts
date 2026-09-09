import { describe, it, expect } from "vitest";
import { timeToSeconds, paceToSeconds, secondsToTime, secondsToPace } from "../../domain/timeUtils";

describe("timeUtils", () => {
  describe("timeToSeconds", () => {
    it("converts minutes, seconds and hours", () => {
      expect(timeToSeconds("5:30")).toBe(330);
      expect(timeToSeconds("50")).toBe(3000);
      expect(timeToSeconds("300", "sec")).toBe(300);
      expect(timeToSeconds("1.5", "hr")).toBe(5400);
      expect(timeToSeconds("1:30", "hr")).toBe(5400);
    });

    it("throws on invalid time format", () => {
      expect(() => timeToSeconds("invalid")).toThrow("Invalid time format");
      expect(() => timeToSeconds("1:30:00")).toThrow("Invalid time format");
    });
  });

  describe("paceToSeconds", () => {
    it("converts min/km and sec/km pace", () => {
      expect(paceToSeconds("4:30")).toBe(270);
      expect(paceToSeconds("4:30.5", "min")).toBeCloseTo(270.5, 1);
      expect(paceToSeconds("270", "sec")).toBe(270);
    });
  });

  describe("secondsToTime", () => {
    it("formats minutes, seconds and hours", () => {
      expect(secondsToTime(330)).toBe("5:30");
      expect(secondsToTime(270.5, "sec")).toBe("270.5");
      expect(secondsToTime(5400, "hr")).toBe("1:30");
    });

    it("clamps negative values", () => {
      expect(secondsToTime(-100)).toBe("0:00");
      expect(secondsToTime(-100, "sec")).toBe("0.0");
      expect(secondsToTime(-100, "hr")).toBe("0:00");
    });
  });

  describe("secondsToPace", () => {
    it("formats min and sec pace", () => {
      expect(secondsToPace(270)).toBe("4:30");
      expect(secondsToPace(270.5, "min")).toMatch(/4:30\.\d/);
      expect(secondsToPace(270, "sec")).toBe("270.0");
    });

    it("clamps negative values", () => {
      expect(secondsToPace(-100, "min")).toBe("0:00.0");
      expect(secondsToPace(-100, "sec")).toBe("0.0");
    });
  });
});
