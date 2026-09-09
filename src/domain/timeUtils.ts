import { MINUTES_PER_HOUR, PAD_LENGTH, SECONDS_PER_HOUR, SECONDS_PER_MINUTE } from "./constants";
import type { PaceUnit, TimeUnit } from "./types";

const formatTimeComponent = (value: number): string => {
  return String(value).padStart(PAD_LENGTH, "0");
};

export const timeToSeconds = (value: string, unit: TimeUnit = "min"): number => {
  if (unit === "sec") {
    return Number(value);
  }

  if (unit === "hr") {
    if (value.includes(":")) {
      const parts = value.split(":").map(Number);
      if (parts.length === 2) {
        const hours = parts[0];
        const minutes = parts[1];
        if (hours === undefined || minutes === undefined) {
          throw new Error("Invalid time format");
        }
        return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE;
      }
      throw new Error("Invalid time format");
    }
    const hours = Number(value);
    if (isNaN(hours)) {
      throw new Error("Invalid time format");
    }
    return hours * SECONDS_PER_HOUR;
  }

  if (!value.includes(":")) {
    const minutes = Number(value);
    if (isNaN(minutes)) {
      throw new Error("Invalid time format");
    }
    return minutes * SECONDS_PER_MINUTE;
  }

  const parts = value.split(":").map(Number);
  if (parts.length === 2) {
    const first = parts[0];
    const second = parts[1];
    if (first === undefined || second === undefined) {
      throw new Error("Invalid time format");
    }
    return first * SECONDS_PER_MINUTE + second;
  }

  throw new Error("Invalid time format");
};

export const paceToSeconds = (value: string, unit: PaceUnit = "min"): number => {
  if (unit === "sec") {
    return Number(value);
  }

  const [minutesStr, secondsStr] = value.split(":");
  if (secondsStr === undefined) {
    throw new Error("Invalid pace format");
  }
  const minutes = Number(minutesStr);
  const [secondsInt, decimalsStr] = secondsStr.includes(".")
    ? secondsStr.split(".")
    : [secondsStr, "0"];
  const seconds = Number(secondsInt);
  const decimals = decimalsStr ? Number(`0.${decimalsStr}`) : 0;
  return minutes * SECONDS_PER_MINUTE + seconds + decimals;
};

export const secondsToTime = (seconds: number, unit: TimeUnit = "min"): string => {
  if (seconds < 0) {
    return unit === "sec" ? "0.0" : "0:00";
  }

  if (unit === "sec") {
    return seconds.toFixed(1);
  }

  if (unit === "hr") {
    const hours = Math.floor(seconds / SECONDS_PER_HOUR);
    const remainingSeconds = seconds % SECONDS_PER_HOUR;
    const minutes = Math.floor(remainingSeconds / SECONDS_PER_MINUTE);
    return `${hours}:${formatTimeComponent(minutes)}`;
  }

  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const secs = Math.round(seconds % SECONDS_PER_MINUTE);

  return `${minutes}:${formatTimeComponent(secs)}`;
};

export const secondsToPace = (seconds: number, unit: PaceUnit = "min"): string => {
  if (seconds < 0) return unit === "sec" ? "0.0" : "0:00.0";

  if (unit === "sec") {
    return seconds.toFixed(1);
  }

  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const secs = seconds % SECONDS_PER_MINUTE;
  const secsInt = Math.floor(secs);
  const secsDecimal = Math.round((secs - secsInt) * 10);

  if (secsDecimal === 0) {
    return `${minutes}:${formatTimeComponent(secsInt)}`;
  }
  return `${minutes}:${formatTimeComponent(secsInt)}.${secsDecimal}`;
};

export const getAppropriateTimeUnit = (totalSeconds: number): TimeUnit => {
  if (totalSeconds < SECONDS_PER_MINUTE) {
    return "sec";
  }
  const totalMinutes = totalSeconds / SECONDS_PER_MINUTE;
  if (totalMinutes >= MINUTES_PER_HOUR) {
    return "hr";
  }
  return "min";
};
