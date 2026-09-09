export type DistanceUnit = "km" | "m" | "mi" | "yd";
export type PaceUnit = "min" | "sec";
export type TimeUnit = "min" | "sec" | "hr";
export type CalculatedField = "pace" | "distance" | "time";
export type MeasurementSystem = "metric" | "imperial";
export type PaceBase = "km" | "mi";

export type CalculatorOutcome =
  | { kind: "empty" }
  | { kind: "error"; code: "needTwoValues" | "calcError" }
  | { kind: "time"; seconds: number; formatted: string; unit: TimeUnit }
  | { kind: "pace"; secondsPerBase: number; formatted: string; unit: PaceUnit; base: PaceBase }
  | { kind: "distance"; km: number; formatted: string; unit: DistanceUnit };

export const EMPTY_OUTCOME: CalculatorOutcome = { kind: "empty" };
