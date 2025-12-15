import { ref } from "vue";
import { useTimeUtils } from "./useTimeUtils";

type DistanceUnit = "km" | "m";

/**
 * Pace calculator composable
 * Manages state and calculation logic
 */
export function usePaceCalculator() {
  const { timeToSeconds, secondsToTime } = useTimeUtils();

  const pace = ref<string>("");
  const distance = ref<number | null>(null);
  const distanceUnit = ref<DistanceUnit>("m");
  const result = ref<string>("");

  /**
   * Converts distance to kilometers
   */
  const distanceToKm = (value: number, unit: DistanceUnit): number => {
    return unit === "m" ? value / 1000 : value;
  };

  /**
   * Calculates time based on pace and distance
   */
  const calculate = (): void => {
    if (!pace.value || !distance.value) {
      result.value = "Introduce ritmo y distancia";
      return;
    }

    const distanceInKm = distanceToKm(distance.value, distanceUnit.value);
    const totalSeconds = timeToSeconds(pace.value) * distanceInKm;
    result.value = `Tiempo: ${secondsToTime(totalSeconds)}`;
  };

  /**
   * Clears all form fields
   */
  const clear = (): void => {
    pace.value = "";
    distance.value = null;
    distanceUnit.value = "m";
    result.value = "";
  };

  return {
    pace,
    distance,
    distanceUnit,
    result,
    calculate,
    clear,
  };
}

