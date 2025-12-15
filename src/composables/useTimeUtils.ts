const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const PAD_LENGTH = 2;

const formatTimeComponent = (value: number): string => {
  return String(value).padStart(PAD_LENGTH, "0");
};

/**
 * Time conversion utilities
 */
export function useTimeUtils() {
  const timeToSeconds = (value: string): number => {
    const parts = value.split(":").map(Number);
    const [first, second, third] = parts;

    if (parts.length === 2) {
      return first * SECONDS_PER_MINUTE + second;
    }

    if (parts.length === 3) {
      return first * SECONDS_PER_HOUR + second * SECONDS_PER_MINUTE + third;
    }

    throw new Error("Invalid time format");
  };

  const secondsToTime = (seconds: number): string => {
    if (seconds < 0) return "0:00:00";
    
    const hours = Math.floor(seconds / SECONDS_PER_HOUR);
    const minutes = Math.floor((seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
    const secs = Math.round(seconds % SECONDS_PER_MINUTE);

    return `${hours}:${formatTimeComponent(minutes)}:${formatTimeComponent(secs)}`;
  };

  const secondsToPace = (seconds: number): string => {
    if (seconds < 0) return "0:00";
    
    const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
    const secs = Math.round(seconds % SECONDS_PER_MINUTE);

    return `${minutes}:${formatTimeComponent(secs)}`;
  };

  return {
    timeToSeconds,
    secondsToTime,
    secondsToPace,
  };
}

