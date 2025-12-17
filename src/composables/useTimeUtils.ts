const SECONDS_PER_MINUTE = 60;
const PAD_LENGTH = 2;

const formatTimeComponent = (value: number): string => {
  return String(value).padStart(PAD_LENGTH, "0");
};

/**
 * Time conversion utilities
 */
export function useTimeUtils() {
  const timeToSeconds = (value: string): number => {
    if (!value.includes(":")) {
      const minutes = Number(value);
      if (isNaN(minutes)) {
        throw new Error("Invalid time format");
      }
      return minutes * SECONDS_PER_MINUTE;
    }

    const parts = value.split(":").map(Number);
    const [first, second] = parts;

    if (parts.length === 2) {
      return first * SECONDS_PER_MINUTE + second;
    }

    throw new Error("Invalid time format");
  };

  const paceToSeconds = (value: string, unit: "min" | "sec" = "min"): number => {
    if (unit === "sec") {
      return Number(value);
    }

    const [minutesStr, secondsStr] = value.split(":");
    const minutes = Number(minutesStr);
    const [secondsInt, decimalsStr] = secondsStr.includes(".")
      ? secondsStr.split(".")
      : [secondsStr, "0"];
    const seconds = Number(secondsInt);
    const decimals = decimalsStr ? Number(`0.${decimalsStr}`) : 0;
    return minutes * SECONDS_PER_MINUTE + seconds + decimals;
  };

  const secondsToTime = (seconds: number): string => {
    if (seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.round(seconds % SECONDS_PER_MINUTE);

    return `${minutes}:${formatTimeComponent(secs)}`;
  };

  const secondsToPace = (seconds: number, unit: "min" | "sec" = "min"): string => {
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

  return {
    timeToSeconds,
    paceToSeconds,
    secondsToTime,
    secondsToPace,
  };
}
