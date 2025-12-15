/**
 * Time conversion utilities
 */
export function useTimeUtils() {
  /**
   * Converts a time string (mm:ss or hh:mm:ss) to seconds
   */
  const timeToSeconds = (value: string): number => {
    const parts: number[] = value.split(":").map(Number);

    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }

    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  /**
   * Converts seconds to hh:mm:ss format
   */
  const secondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /**
   * Converts seconds to pace format mm:ss
   */
  const secondsToPace = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  return {
    timeToSeconds,
    secondsToTime,
    secondsToPace,
  };
}

