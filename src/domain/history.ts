import type { CalculatedField, DistanceUnit, PaceUnit, TimeUnit } from "./types";

export const HISTORY_LIMIT = 3;

export type HistoryEntry = {
  pace: string;
  paceUnit: PaceUnit;
  distance: string;
  distanceUnit: DistanceUnit;
  time: string;
  timeUnit: TimeUnit;
  calculatedField: CalculatedField;
};

const PACE_UNITS: PaceUnit[] = ["min", "sec"];
const DISTANCE_UNITS: DistanceUnit[] = ["km", "m", "mi", "yd"];
const TIME_UNITS: TimeUnit[] = ["min", "sec", "hr"];
const CALCULATED_FIELDS: CalculatedField[] = ["pace", "distance", "time"];

export const historyEntryKey = (entry: HistoryEntry): string => {
  return [
    entry.pace,
    entry.paceUnit,
    entry.distance,
    entry.distanceUnit,
    entry.time,
    entry.timeUnit,
    entry.calculatedField,
  ].join("|");
};

export const fieldsFromHistory = (entry: HistoryEntry) => ({
  pace: entry.calculatedField === "pace" ? "" : entry.pace,
  paceUnit: entry.paceUnit,
  distance: entry.calculatedField === "distance" ? "" : entry.distance,
  distanceUnit: entry.distanceUnit,
  time: entry.calculatedField === "time" ? "" : entry.time,
  timeUnit: entry.timeUnit,
});

export const pushHistoryEntry = (entries: HistoryEntry[], next: HistoryEntry): HistoryEntry[] => {
  const key = historyEntryKey(next);
  return [next, ...entries.filter(entry => historyEntryKey(entry) !== key)].slice(0, HISTORY_LIMIT);
};

const isOneOf = <T extends string>(value: unknown, allowed: readonly T[]): value is T => {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
};

const isPaceUnit = (value: unknown): value is PaceUnit => isOneOf(value, PACE_UNITS);
const isDistanceUnit = (value: unknown): value is DistanceUnit => isOneOf(value, DISTANCE_UNITS);
const isTimeUnit = (value: unknown): value is TimeUnit => isOneOf(value, TIME_UNITS);
const isCalculatedField = (value: unknown): value is CalculatedField => {
  return isOneOf(value, CALCULATED_FIELDS);
};

const isFilledString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim() !== "";
};

export const parseHistoryEntries = (raw: string | null): HistoryEntry[] => {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is HistoryEntry => {
        if (!item || typeof item !== "object") return false;
        const entry = item as Record<string, unknown>;
        return (
          isFilledString(entry.pace) &&
          isPaceUnit(entry.paceUnit) &&
          isFilledString(entry.distance) &&
          isDistanceUnit(entry.distanceUnit) &&
          isFilledString(entry.time) &&
          isTimeUnit(entry.timeUnit) &&
          isCalculatedField(entry.calculatedField)
        );
      })
      .slice(0, HISTORY_LIMIT);
  } catch {
    return [];
  }
};
