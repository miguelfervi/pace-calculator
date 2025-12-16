import { describe, it, expect } from "@jest/globals";
import { useTimeUtils } from "../../composables/useTimeUtils";

describe("useTimeUtils", () => {
  const { timeToSeconds, paceToSeconds, secondsToTime, secondsToPace } = useTimeUtils();

  describe("timeToSeconds", () => {
    it("should convert mm:ss format to seconds", () => {
      expect(timeToSeconds("5:30")).toBe(330);
      expect(timeToSeconds("0:45")).toBe(45);
      expect(timeToSeconds("10:00")).toBe(600);
    });

    it("should convert hh:mm:ss format to seconds", () => {
      expect(timeToSeconds("1:30:00")).toBe(5400);
      expect(timeToSeconds("0:25:30")).toBe(1530);
      expect(timeToSeconds("2:15:45")).toBe(8145);
    });

    it("should throw error for invalid format", () => {
      expect(() => timeToSeconds("invalid")).toThrow("Invalid time format");
      expect(() => timeToSeconds("5")).toThrow("Invalid time format");
    });
  });

  describe("paceToSeconds", () => {
    it("should convert pace format mm:ss to seconds", () => {
      expect(paceToSeconds("4:30")).toBe(270);
      expect(paceToSeconds("5:00")).toBe(300);
      expect(paceToSeconds("3:45")).toBe(225);
    });

    it("should convert pace format with decimals mm:ss.d to seconds", () => {
      expect(paceToSeconds("4:30.5")).toBeCloseTo(270.5, 1);
      expect(paceToSeconds("5:00.2")).toBeCloseTo(300.2, 1);
      expect(paceToSeconds("3:45.7")).toBeCloseTo(225.7, 1);
    });
  });

  describe("secondsToTime", () => {
    it("should convert seconds to hh:mm:ss format", () => {
      expect(secondsToTime(330)).toBe("0:05:30");
      expect(secondsToTime(5400)).toBe("1:30:00");
      expect(secondsToTime(3661)).toBe("1:01:01");
      expect(secondsToTime(3600)).toBe("1:00:00");
      expect(secondsToTime(90)).toBe("0:01:30");
    });

    it("should handle hours correctly", () => {
      expect(secondsToTime(7200)).toBe("2:00:00");
      expect(secondsToTime(9000)).toBe("2:30:00");
    });

    it("should return 0:00:00 for negative values", () => {
      expect(secondsToTime(-100)).toBe("0:00:00");
    });
  });

  describe("secondsToPace", () => {
    it("should convert seconds to mm:ss format", () => {
      expect(secondsToPace(270)).toBe("4:30");
      expect(secondsToPace(300)).toBe("5:00");
      expect(secondsToPace(225)).toBe("3:45");
    });

    it("should include decimals when present", () => {
      const result = secondsToPace(270.5);
      expect(result).toMatch(/4:30\.\d/);
    });

    it("should return 0:00.0 for negative values", () => {
      expect(secondsToPace(-100)).toBe("0:00.0");
    });
  });
});
