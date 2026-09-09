import { z } from "zod";
import { METERS_PER_KM, METERS_PER_MILE, METERS_PER_YARD, SECONDS_THRESHOLD } from "./constants";
import {
  getAppropriateTimeUnit,
  paceToSeconds,
  secondsToPace,
  secondsToTime,
  timeToSeconds,
} from "./timeUtils";
import type {
  CalculatedField,
  CalculatorOutcome,
  DistanceUnit,
  MeasurementSystem,
  PaceBase,
  PaceUnit,
  TimeUnit,
} from "./types";

const TIME_MIN_SCHEMA = z.string().regex(/^(\d+)$|^(\d{1,2}):([0-5]?\d)$/);
const TIME_SEC_SCHEMA = z.string().regex(/^\d+(\.\d+)?$/);
const TIME_HR_SCHEMA = z.string().regex(/^(\d+(\.\d+)?)$|^(\d+):([0-5]?\d)$/);
const PACE_MIN_SCHEMA = z.string().regex(/^(\d{1,2}):([0-5]?\d)(\.\d)?$/);
const PACE_SEC_SCHEMA = z.string().regex(/^\d+(\.\d+)?$/);
const DISTANCE_SCHEMA = z.number().positive().min(0.001);

const TIME_SCHEMAS = {
  min: TIME_MIN_SCHEMA,
  sec: TIME_SEC_SCHEMA,
  hr: TIME_HR_SCHEMA,
} as const;

const PACE_SCHEMAS = {
  min: PACE_MIN_SCHEMA,
  sec: PACE_SEC_SCHEMA,
} as const;

export type CalculatorInput = {
  pace: string;
  paceUnit: PaceUnit;
  distance: string;
  distanceUnit: DistanceUnit;
  time: string;
  timeUnit: TimeUnit;
};

export type SolveResult =
  | {
      ok: true;
      missing: CalculatedField;
      pace: string;
      paceUnit: PaceUnit;
      distance: string;
      distanceUnit: DistanceUnit;
      time: string;
      timeUnit: TimeUnit;
      outcome: Extract<CalculatorOutcome, { kind: "time" | "pace" | "distance" }>;
    }
  | {
      ok: false;
      outcome: Extract<CalculatorOutcome, { kind: "error" }>;
    };

export const isValidTime = (value: string, unit: TimeUnit): boolean => {
  return value ? TIME_SCHEMAS[unit].safeParse(value).success : false;
};

export const isValidPace = (value: string, unit: PaceUnit): boolean => {
  return value ? PACE_SCHEMAS[unit].safeParse(value).success : false;
};

export const parseDistance = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return DISTANCE_SCHEMA.safeParse(parsed).success ? parsed : null;
};

export const systemForDistanceUnit = (unit: DistanceUnit): MeasurementSystem => {
  return unit === "yd" || unit === "mi" ? "imperial" : "metric";
};

export const distanceToMeters = (value: number, unit: DistanceUnit): number => {
  switch (unit) {
    case "m":
      return value;
    case "km":
      return value * METERS_PER_KM;
    case "yd":
      return value * METERS_PER_YARD;
    case "mi":
      return value * METERS_PER_MILE;
  }
};

export const metersToDistance = (meters: number, unit: DistanceUnit): number => {
  switch (unit) {
    case "m":
      return meters;
    case "km":
      return meters / METERS_PER_KM;
    case "yd":
      return meters / METERS_PER_YARD;
    case "mi":
      return meters / METERS_PER_MILE;
  }
};

const isIntegerDistanceUnit = (unit: DistanceUnit): boolean => unit === "m" || unit === "yd";

export const formatDistanceField = (meters: number, unit: DistanceUnit): string => {
  const value = metersToDistance(meters, unit);
  if (isIntegerDistanceUnit(unit)) {
    return String(Math.round(value));
  }
  return String(Number(value.toFixed(2)));
};

export const formatDistanceLabel = (meters: number, unit: DistanceUnit): string => {
  return `${formatDistanceField(meters, unit)} ${unit}`;
};

export const pickDistanceUnit = (meters: number, system: MeasurementSystem): DistanceUnit => {
  if (system === "imperial") {
    return meters < METERS_PER_MILE ? "yd" : "mi";
  }
  return meters < METERS_PER_KM ? "m" : "km";
};

export const convertPaceValue = (value: string, from: PaceUnit, to: PaceUnit): string => {
  if (!value || from === to) return value;
  const paceInSeconds = paceToSeconds(value, from);
  return to === "sec" ? paceInSeconds.toFixed(1) : secondsToPace(paceInSeconds, "min");
};

export const convertTimeValue = (value: string, from: TimeUnit, to: TimeUnit): string => {
  if (!value || from === to) return value;
  const totalSeconds = timeToSeconds(value, from);
  return secondsToTime(totalSeconds, to);
};

export const convertDistanceValue = (
  value: string,
  from: DistanceUnit,
  to: DistanceUnit
): string => {
  const parsed = parseDistance(value);
  if (parsed === null || from === to) return value;
  return formatDistanceField(distanceToMeters(parsed, from), to);
};

export const normalizeSecondsInput = (
  value: string,
  unit: TimeUnit
): { value: string; unit: TimeUnit } => {
  if (unit !== "sec" || !value.trim()) {
    return { value, unit };
  }

  const seconds = Number(value);
  if (isNaN(seconds) || seconds < SECONDS_THRESHOLD) {
    return { value, unit };
  }

  const appropriateUnit = getAppropriateTimeUnit(seconds);
  if (appropriateUnit === "sec") {
    return { value, unit };
  }

  return { value: secondsToTime(seconds, appropriateUnit), unit: appropriateUnit };
};

const formatPace = (paceInSeconds: number): { formatted: string; unit: PaceUnit } => {
  if (paceInSeconds < SECONDS_THRESHOLD && paceInSeconds > 0) {
    return { formatted: paceInSeconds.toFixed(1), unit: "sec" };
  }
  return { formatted: secondsToPace(paceInSeconds, "min"), unit: "min" };
};

export const solveMissingField = (input: CalculatorInput): SolveResult => {
  const validations = {
    pace: isValidPace(input.pace, input.paceUnit),
    distance: parseDistance(input.distance) !== null,
    time: isValidTime(input.time, input.timeUnit),
  };

  const filledCount = Object.values(validations).filter(Boolean).length;
  if (filledCount !== 2) {
    return { ok: false, outcome: { kind: "error", code: "needTwoValues" } };
  }

  const paceBase: PaceBase = "km";
  const baseMeters = METERS_PER_KM;

  try {
    const parsedDistance = validations.distance ? parseDistance(input.distance) : null;
    const meters =
      parsedDistance !== null ? distanceToMeters(parsedDistance, input.distanceUnit) : null;

    if (validations.pace && validations.distance && meters !== null) {
      const distanceInPaceUnits = meters / baseMeters;
      const totalSeconds = paceToSeconds(input.pace, input.paceUnit) * distanceInPaceUnits;
      const unit = getAppropriateTimeUnit(totalSeconds);
      const formatted = secondsToTime(totalSeconds, unit);
      return {
        ok: true,
        missing: "time",
        pace: input.pace,
        paceUnit: input.paceUnit,
        distance: input.distance,
        distanceUnit: input.distanceUnit,
        time: formatted,
        timeUnit: unit,
        outcome: { kind: "time", seconds: totalSeconds, formatted, unit },
      };
    }

    if (validations.distance && validations.time && meters !== null) {
      const totalSeconds = timeToSeconds(input.time, input.timeUnit);
      const paceInSeconds = totalSeconds / (meters / baseMeters);
      const { formatted, unit } = formatPace(paceInSeconds);
      return {
        ok: true,
        missing: "pace",
        pace: formatted,
        paceUnit: unit,
        distance: input.distance,
        distanceUnit: input.distanceUnit,
        time: input.time,
        timeUnit: input.timeUnit,
        outcome: {
          kind: "pace",
          secondsPerBase: paceInSeconds,
          formatted,
          unit,
          base: paceBase,
        },
      };
    }

    const totalSeconds = timeToSeconds(input.time, input.timeUnit);
    const calculatedMeters =
      (totalSeconds / paceToSeconds(input.pace, input.paceUnit)) * baseMeters;
    const unit = pickDistanceUnit(calculatedMeters, systemForDistanceUnit(input.distanceUnit));
    const formatted = formatDistanceLabel(calculatedMeters, unit);
    return {
      ok: true,
      missing: "distance",
      pace: input.pace,
      paceUnit: input.paceUnit,
      distance: formatDistanceField(calculatedMeters, unit),
      distanceUnit: unit,
      time: input.time,
      timeUnit: input.timeUnit,
      outcome: {
        kind: "distance",
        km: calculatedMeters / METERS_PER_KM,
        formatted,
        unit,
      },
    };
  } catch {
    return { ok: false, outcome: { kind: "error", code: "calcError" } };
  }
};
