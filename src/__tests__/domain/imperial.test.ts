import { describe, it, expect } from "vitest";
import { solveMissingField, convertDistanceValue } from "../../domain/paceCalculator";

describe("imperial distance units", () => {
  it("calculates time from min/km pace and one mile", () => {
    const result = solveMissingField({
      pace: "4:30",
      paceUnit: "min",
      distance: "1",
      distanceUnit: "mi",
      time: "",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.time).toBe("7:15");
  });

  it("calculates min/km pace from one mile in 7:15", () => {
    const result = solveMissingField({
      pace: "",
      paceUnit: "min",
      distance: "1",
      distanceUnit: "mi",
      time: "7:15",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.outcome.kind).toBe("pace");
    expect(result.pace).toMatch(/^4:3/);
  });

  it("still calculates metric pace per km", () => {
    const result = solveMissingField({
      pace: "4:30",
      paceUnit: "min",
      distance: "1",
      distanceUnit: "km",
      time: "",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.time).toBe("4:30");
  });

  it("converts 1 km to 0.62 mi", () => {
    expect(convertDistanceValue("1", "km", "mi")).toBe("0.62");
  });

  it("calculates 1760 yards at 4:30 min/km as one mile", () => {
    const result = solveMissingField({
      pace: "4:30",
      paceUnit: "min",
      distance: "1760",
      distanceUnit: "yd",
      time: "",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.time).toBe("7:15");
  });

  it("calculates 400 yards at 4:30 min/km as about 1:39", () => {
    const result = solveMissingField({
      pace: "4:30",
      paceUnit: "min",
      distance: "400",
      distanceUnit: "yd",
      time: "",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.time).toBe("1:39");
  });

  it("calculates miles from 4:30 min/km and 7:15", () => {
    const result = solveMissingField({
      pace: "4:30",
      paceUnit: "min",
      distance: "",
      distanceUnit: "mi",
      time: "7:15",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.distanceUnit).toBe("mi");
    expect(Number(result.distance)).toBeCloseTo(1, 1);
  });

  it("calculates 400 yards from 4:30 min/km and 1:39", () => {
    const result = solveMissingField({
      pace: "4:30",
      paceUnit: "min",
      distance: "",
      distanceUnit: "yd",
      time: "1:39",
      timeUnit: "min",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.distanceUnit).toBe("yd");
    expect(Number(result.distance)).toBeCloseTo(400, -1);
  });

  it("converts 1 mile to 1760 yards", () => {
    expect(convertDistanceValue("1", "mi", "yd")).toBe("1760");
  });
});
