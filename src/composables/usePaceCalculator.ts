import { ref } from "vue";
import { z } from "zod";
import { useTimeUtils } from "./useTimeUtils";

type DistanceUnit = "km" | "m";
type CalculatedField = "pace" | "distance" | "time" | null;

const TIME_SCHEMA = z.string().regex(/^(\d{1,2}):([0-5]?\d)(:([0-5]?\d))?$/);
const PACE_SCHEMA = z.string().regex(/^(\d{1,2}):([0-5]?\d)(\.\d)?$/);
const DISTANCE_SCHEMA = z.number().positive().min(0.001);

const CONVERSION_FACTORS = {
  m: 1000,
  km: 1,
} as const;

/**
 * Pace calculator composable
 * Manages state and calculation logic
 */
export function usePaceCalculator() {
  const { timeToSeconds, paceToSeconds, secondsToTime, secondsToPace } = useTimeUtils();

  const pace = ref<string>("");
  const distance = ref<number | null>(null);
  const distanceUnit = ref<DistanceUnit>("m");
  const time = ref<string>("");
  const result = ref<string>("");
  const calculatedField = ref<CalculatedField>(null);

  const distanceToKm = (value: number, unit: DistanceUnit): number => {
    return value / CONVERSION_FACTORS[unit];
  };

  const formatDistance = (valueInKm: number, unit: DistanceUnit): string => {
    const value = unit === "m" 
      ? Math.round(valueInKm * 1000) 
      : valueInKm.toFixed(2);
    return `${value} ${unit}`;
  };

  const isValidTime = (value: string): boolean => {
    return value ? TIME_SCHEMA.safeParse(value).success : false;
  };

  const isValidPace = (value: string): boolean => {
    return value ? PACE_SCHEMA.safeParse(value).success : false;
  };

  const isValidDistance = (value: number | null): boolean => {
    return value !== null ? DISTANCE_SCHEMA.safeParse(value).success : false;
  };

  const calculateTime = (paceValue: string, distanceInKm: number): void => {
    const totalSeconds = paceToSeconds(paceValue) * distanceInKm;
    const timeFormatted = secondsToTime(totalSeconds);
    time.value = timeFormatted;
    result.value = `Tiempo: ${timeFormatted}`;
    calculatedField.value = "time";
  };

  const calculatePace = (timeValue: string, distanceInKm: number): void => {
    const paceInSeconds = timeToSeconds(timeValue) / distanceInKm;
    const paceFormatted = secondsToPace(paceInSeconds);
    pace.value = paceFormatted;
    result.value = `Ritmo: ${paceFormatted} min/km`;
    calculatedField.value = "pace";
  };

  const calculateDistance = (paceValue: string, timeValue: string): void => {
    const calculatedDistanceInKm = timeToSeconds(timeValue) / paceToSeconds(paceValue);
    const distanceValue = distanceUnit.value === "m" 
      ? Math.round(calculatedDistanceInKm * 1000)
      : calculatedDistanceInKm;
    distance.value = distanceValue;
    result.value = `Distancia: ${formatDistance(calculatedDistanceInKm, distanceUnit.value)}`;
    calculatedField.value = "distance";
  };

  const calculate = (): void => {
    calculatedField.value = null;
    result.value = "";

    const hasPace = isValidPace(pace.value);
    const hasDistance = isValidDistance(distance.value);
    const hasTime = isValidTime(time.value);

    const filledCount = [hasPace, hasDistance, hasTime].filter(Boolean).length;

    if (filledCount !== 2) {
      result.value = "Introduce exactamente dos valores";
      return;
    }

    try {
      if (hasPace && hasDistance) {
        const distanceInKm = distanceToKm(distance.value!, distanceUnit.value);
        calculateTime(pace.value, distanceInKm);
      } else if (hasDistance && hasTime) {
        const distanceInKm = distanceToKm(distance.value!, distanceUnit.value);
        calculatePace(time.value, distanceInKm);
      } else if (hasPace && hasTime) {
        calculateDistance(pace.value, time.value);
      }
    } catch (error) {
      result.value = "Error al realizar el cálculo. Verifica los valores ingresados.";
    }
  };

  /**
   * Clears all form fields
   */
  const clear = (): void => {
    pace.value = "";
    distance.value = null;
    distanceUnit.value = "m";
    time.value = "";
    result.value = "";
    calculatedField.value = null;
  };

  return {
    pace,
    distance,
    distanceUnit,
    time,
    result,
    calculatedField,
    calculate,
    clear,
  };
}

