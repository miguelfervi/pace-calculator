/**
 * Utilidades para conversión de tiempo
 */
export function useTimeUtils() {
  /**
   * Convierte un string de tiempo (mm:ss o hh:mm:ss) a segundos
   */
  const timeToSeconds = (value: string): number => {
    const parts: number[] = value.split(":").map(Number);

    if (parts.length === 2) {
      // mm:ss
      return parts[0] * 60 + parts[1];
    }

    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  };

  /**
   * Convierte segundos a formato hh:mm:ss
   */
  const secondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.round(seconds % 60);

    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  /**
   * Convierte segundos a formato de ritmo mm:ss
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

