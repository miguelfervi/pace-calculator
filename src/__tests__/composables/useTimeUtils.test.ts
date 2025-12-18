import { describe, it, expect } from "@jest/globals";
import { useTimeUtils } from "../../composables/useTimeUtils";

describe("useTimeUtils", () => {
  const { timeToSeconds, paceToSeconds, secondsToTime, secondsToPace } = useTimeUtils();

  describe("timeToSeconds", () => {
    it("should convert mm:ss format to seconds", () => {
      expect(timeToSeconds("5:30")).toBe(330);
      expect(timeToSeconds("0:45")).toBe(45);
      expect(timeToSeconds("10:00")).toBe(600);
      expect(timeToSeconds("90:00")).toBe(5400);
      expect(timeToSeconds("25:30")).toBe(1530);
    });

    it("should convert single number to minutes", () => {
      expect(timeToSeconds("5")).toBe(300);
      expect(timeToSeconds("10")).toBe(600);
      expect(timeToSeconds("50")).toBe(3000);
      expect(timeToSeconds("0")).toBe(0);
    });

    it("should throw error for invalid format", () => {
      expect(() => timeToSeconds("invalid")).toThrow("Invalid time format");
      expect(() => timeToSeconds("1:30:00")).toThrow("Invalid time format");
      expect(() => timeToSeconds("abc")).toThrow("Invalid time format");
    });
  });

  describe("paceToSeconds", () => {
    it("should convert pace format mm:ss to seconds (min unit)", () => {
      expect(paceToSeconds("4:30", "min")).toBe(270);
      expect(paceToSeconds("5:00", "min")).toBe(300);
      expect(paceToSeconds("3:45", "min")).toBe(225);
    });

    it("should convert pace format with decimals mm:ss.d to seconds (min unit)", () => {
      expect(paceToSeconds("4:30.5", "min")).toBeCloseTo(270.5, 1);
      expect(paceToSeconds("5:00.2", "min")).toBeCloseTo(300.2, 1);
      expect(paceToSeconds("3:45.7", "min")).toBeCloseTo(225.7, 1);
    });

    it("should convert seconds format directly (sec unit)", () => {
      expect(paceToSeconds("270", "sec")).toBe(270);
      expect(paceToSeconds("300.5", "sec")).toBeCloseTo(300.5, 1);
      expect(paceToSeconds("225.7", "sec")).toBeCloseTo(225.7, 1);
    });

    it("should handle pace without decimals (min unit)", () => {
      expect(paceToSeconds("4:30", "min")).toBe(270);
      expect(paceToSeconds("5:00", "min")).toBe(300);
    });

    it("should handle pace without decimalsStr", () => {
      const result = paceToSeconds("4:30", "min");
      expect(result).toBe(270);
    });

    it("should use min unit as default when unit is not provided", () => {
      expect(paceToSeconds("4:30")).toBe(270);
    });

    it("should handle pace without decimalsStr (when secondsStr doesn't include decimal)", () => {
      const result = paceToSeconds("4:30", "min");
      expect(result).toBe(270);
    });

    it("should handle paceToSeconds when decimalsStr is empty string", () => {
      const result = paceToSeconds("4:30", "min");
      expect(result).toBe(270);
    });

    it("should handle secondsToPace with sec unit default", () => {
      expect(secondsToPace(270)).toBe("4:30");
    });
  });

  describe("secondsToTime", () => {
    it("should convert seconds to mm:ss format", () => {
      expect(secondsToTime(330)).toBe("5:30");
      expect(secondsToTime(5400)).toBe("90:00");
      expect(secondsToTime(3661)).toBe("61:01");
      expect(secondsToTime(3600)).toBe("60:00");
      expect(secondsToTime(90)).toBe("1:30");
    });

    it("should handle large minutes correctly", () => {
      expect(secondsToTime(7200)).toBe("120:00");
      expect(secondsToTime(9000)).toBe("150:00");
    });

    it("should return 0:00 for negative values", () => {
      expect(secondsToTime(-100)).toBe("0:00");
    });
  });

  describe("secondsToPace", () => {
    it("should convert seconds to mm:ss format (min unit)", () => {
      expect(secondsToPace(270, "min")).toBe("4:30");
      expect(secondsToPace(300, "min")).toBe("5:00");
      expect(secondsToPace(225, "min")).toBe("3:45");
    });

    it("should include decimals when present (min unit)", () => {
      const result = secondsToPace(270.5, "min");
      expect(result).toMatch(/4:30\.\d/);
    });

    it("should return 0:00.0 for negative values (min unit)", () => {
      expect(secondsToPace(-100, "min")).toBe("0:00.0");
    });

    it("should convert seconds to decimal format (sec unit)", () => {
      expect(secondsToPace(270, "sec")).toBe("270.0");
      expect(secondsToPace(300.5, "sec")).toBe("300.5");
      expect(secondsToPace(225.7, "sec")).toBe("225.7");
    });

    it("should return 0.0 for negative values (sec unit)", () => {
      expect(secondsToPace(-100, "sec")).toBe("0.0");
    });
  });
});
