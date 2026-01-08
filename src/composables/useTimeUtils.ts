const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const PAD_LENGTH = 2;

const formatTimeComponent = (value: number): string => {
  return String(value).padStart(PAD_LENGTH, "0");
};

export function useTimeUtils() {
  const timeToSeconds = (value: string, unit: "min" | "sec" | "hr" = "min"): number => {
    if (unit === "sec") {
      return Number(value);
    }

    if (unit === "hr") {
      if (value.includes(":")) {
        const parts = value.split(":").map(Number);
        if (parts.length === 2) {
          const [hours, minutes] = parts;
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

  const secondsToTime = (seconds: number, unit: "min" | "sec" | "hr" = "min"): string => {
    if (seconds < 0) {
      return unit === "sec" ? "0.0" : unit === "hr" ? "0:00" : "0:00";
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
