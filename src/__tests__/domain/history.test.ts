import { describe, it, expect } from "vitest";
import {
  parseHistoryEntries,
  pushHistoryEntry,
  fieldsFromHistory,
  type HistoryEntry,
} from "../../domain/history";
import { formatHistoryEntry } from "../../i18n/formatHistory";
import { messages } from "../../i18n/messages";

const entry = (overrides: Partial<HistoryEntry> = {}): HistoryEntry => ({
  pace: "4:30",
  paceUnit: "min",
  distance: "10",
  distanceUnit: "km",
  time: "45:00",
  timeUnit: "min",
  calculatedField: "time",
  ...overrides,
});

describe("calculation history", () => {
  it("puts the latest entry first and keeps only three", () => {
    const first = entry({ distance: "1", time: "4:30" });
    const second = entry({ distance: "5", time: "22:30" });
    const third = entry({ distance: "10", time: "45:00" });
    const fourth = entry({ distance: "21.1", time: "1:35", timeUnit: "hr" });

    const history = [first, second, third].reduce(
      (entries, next) => pushHistoryEntry(entries, next),
      [] as HistoryEntry[]
    );
    const next = pushHistoryEntry(history, fourth);

    expect(next).toEqual([fourth, third, second]);
  });

  it("moves a repeated calculation to the front instead of duplicating it", () => {
    const first = entry({ distance: "1", time: "4:30" });
    const second = entry({ distance: "5", time: "22:30" });

    const history = pushHistoryEntry(pushHistoryEntry([], first), second);
    expect(pushHistoryEntry(history, first)).toEqual([first, second]);
  });

  it("ignores invalid stored JSON", () => {
    expect(parseHistoryEntries("not-json")).toEqual([]);
    expect(parseHistoryEntries('[{"pace":"4:30"}]')).toEqual([]);
    expect(parseHistoryEntries(JSON.stringify([entry()]))).toEqual([entry()]);
  });

  it("restores the two input fields and leaves the calculated one empty", () => {
    expect(fieldsFromHistory(entry())).toMatchObject({
      pace: "4:30",
      distance: "10",
      time: "",
    });
    expect(fieldsFromHistory(entry({ calculatedField: "pace" })).pace).toBe("");
  });

  it("formats a recent row as inputs then result", () => {
    const t = (key: keyof typeof messages.es) => messages.es[key];
    expect(formatHistoryEntry(entry({ distance: "1", time: "4:30" }), t)).toBe(
      "4:30 min · 1 km → 4:30"
    );
    expect(formatHistoryEntry(entry({ calculatedField: "pace" }), t)).toBe(
      "10 km · 45:00 → 4:30 min/km"
    );
  });
});
