import type { MessageKey } from "./messages";
import type { HistoryEntry } from "../domain/history";
import type { DistanceUnit } from "../domain/types";

type Translate = (key: MessageKey) => string;

const DISTANCE_LABEL: Record<DistanceUnit, MessageKey> = {
  m: "distanceUnitM",
  km: "distanceUnitKm",
  yd: "distanceUnitYd",
  mi: "distanceUnitMi",
};

const formatPace = (entry: HistoryEntry, t: Translate, isResult: boolean): string => {
  if (isResult) {
    const unit = entry.paceUnit === "sec" ? t("paceUnitSecKm") : t("paceUnitMinKm");
    return `${entry.pace} ${unit}`;
  }
  const unit = entry.paceUnit === "sec" ? t("unitSec") : "min";
  return `${entry.pace} ${unit}`;
};

const formatDistance = (entry: HistoryEntry, t: Translate): string => {
  return `${entry.distance} ${t(DISTANCE_LABEL[entry.distanceUnit])}`;
};

const formatTime = (entry: HistoryEntry, t: Translate): string => {
  if (entry.timeUnit === "sec") return `${entry.time} ${t("timeUnitSec")}`;
  if (entry.timeUnit === "hr") return `${entry.time} ${t("timeUnitHour")}`;
  return entry.time;
};

export const formatHistoryParts = (
  entry: HistoryEntry,
  t: Translate
): { inputs: string; result: string } => {
  const distance = formatDistance(entry, t);
  const time = formatTime(entry, t);

  if (entry.calculatedField === "time") {
    return { inputs: `${formatPace(entry, t, false)} · ${distance}`, result: time };
  }
  if (entry.calculatedField === "pace") {
    return { inputs: `${distance} · ${time}`, result: formatPace(entry, t, true) };
  }
  return { inputs: `${formatPace(entry, t, false)} · ${time}`, result: distance };
};

export const formatHistoryEntry = (entry: HistoryEntry, t: Translate): string => {
  const { inputs, result } = formatHistoryParts(entry, t);
  return `${inputs} → ${result}`;
};
