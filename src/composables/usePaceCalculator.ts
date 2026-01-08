import { ref, watch, nextTick } from "vue";
import { z } from "zod";
import { useTimeUtils } from "./useTimeUtils";

type DistanceUnit = "km" | "m";
type PaceUnit = "min" | "sec";
type TimeUnit = "min" | "sec" | "hr";
type CalculatedField = "pace" | "distance" | "time" | null;

const TIME_MIN_SCHEMA = z.string().regex(/^(\d+)$|^(\d{1,2}):([0-5]?\d)$/);
const TIME_SEC_SCHEMA = z.string().regex(/^\d+(\.\d+)?$/);
const TIME_HR_SCHEMA = z.string().regex(/^(\d+(\.\d+)?)$|^(\d+):([0-5]?\d)$/);
const PACE_MIN_SCHEMA = z.string().regex(/^(\d{1,2}):([0-5]?\d)(\.\d)?$/);
const PACE_SEC_SCHEMA = z.string().regex(/^\d+(\.\d+)?$/);
const DISTANCE_SCHEMA = z.number().positive().min(0.001);

const SECONDS_THRESHOLD = 60;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
const METERS_TO_KM = 1000;

export function usePaceCalculator() {
  const { timeToSeconds, paceToSeconds, secondsToTime, secondsToPace } = useTimeUtils();

  const pace = ref<string>("");
  const paceUnit = ref<PaceUnit>("min");
  const distance = ref<number | null>(null);
  const distanceUnit = ref<DistanceUnit>("m");
  const time = ref<string>("");
  const timeUnit = ref<TimeUnit>("min");
  const result = ref<string>("");
  const calculatedField = ref<CalculatedField>(null);
  const isCalculating = ref(false);

  const distanceToKm = (value: number, unit: DistanceUnit): number => {
    return unit === "m" ? value / METERS_TO_KM : value;
  };

  const formatDistance = (valueInKm: number, unit: DistanceUnit): string => {
    const value = unit === "m" ? Math.round(valueInKm * METERS_TO_KM) : valueInKm.toFixed(2);
    return `${value} ${unit}`;
  };

  const TIME_SCHEMAS = {
    min: TIME_MIN_SCHEMA,
    sec: TIME_SEC_SCHEMA,
    hr: TIME_HR_SCHEMA,
  } as const;

  const PACE_SCHEMAS = {
    min: PACE_MIN_SCHEMA,
    sec: PACE_SEC_SCHEMA,
  } as const;

  const isValidTime = (value: string, unit: TimeUnit): boolean => {
    return value ? TIME_SCHEMAS[unit].safeParse(value).success : false;
  };

  const isValidPace = (value: string, unit: PaceUnit): boolean => {
    return value ? PACE_SCHEMAS[unit].safeParse(value).success : false;
  };

  const isValidDistance = (value: number | null): boolean => {
    return value !== null ? DISTANCE_SCHEMA.safeParse(value).success : false;
  };

  const getAppropriateTimeUnit = (totalSeconds: number): TimeUnit => {
    if (totalSeconds < SECONDS_THRESHOLD) {
      return "sec";
    }
    const totalMinutes = totalSeconds / SECONDS_PER_MINUTE;
    if (totalMinutes >= MINUTES_PER_HOUR) {
      return "hr";
    }
    return "min";
  };

  const formatTimeResult = (totalSeconds: number): string => {
    const timeFormatted = secondsToTime(totalSeconds, timeUnit.value);
    const unitLabel = timeUnit.value === "sec" ? "seg" : timeUnit.value === "hr" ? "h" : "";
    return `Tiempo: ${timeFormatted} ${unitLabel}`.trim();
  };

  const calculateTime = (paceValue: string, distanceInKm: number, unit: PaceUnit): void => {
    isCalculating.value = true;
    const totalSeconds = paceToSeconds(paceValue, unit) * distanceInKm;

    const appropriateUnit = getAppropriateTimeUnit(totalSeconds);
    timeUnit.value = appropriateUnit;
    time.value = secondsToTime(totalSeconds, appropriateUnit);

    result.value = formatTimeResult(totalSeconds);
    calculatedField.value = "time";

    nextTick(() => {
      isCalculating.value = false;
    });
  };

  const calculatePace = (
    timeValue: string,
    distanceInKm: number,
    timeUnitValue: TimeUnit
  ): void => {
    isCalculating.value = true;
    const totalSeconds = timeToSeconds(timeValue, timeUnitValue);
    const paceInSeconds = totalSeconds / distanceInKm;

    if (paceInSeconds < SECONDS_THRESHOLD && paceInSeconds > 0) {
      paceUnit.value = "sec";
      pace.value = paceInSeconds.toFixed(1);
    } else {
      paceUnit.value = "min";
      pace.value = secondsToPace(paceInSeconds, "min");
    }

    const unitLabel = paceUnit.value === "sec" ? "seg/km" : "min/km";
    result.value = `Ritmo: ${pace.value} ${unitLabel}`;
    calculatedField.value = "pace";

    nextTick(() => {
      isCalculating.value = false;
    });
  };

  const calculateDistance = (
    paceValue: string,
    timeValue: string,
    timeUnitValue: TimeUnit,
    unit: PaceUnit
  ): void => {
    isCalculating.value = true;
    const totalSeconds = timeToSeconds(timeValue, timeUnitValue);
    const calculatedDistanceInKm = totalSeconds / paceToSeconds(paceValue, unit);

    if (calculatedDistanceInKm < 1) {
      distanceUnit.value = "m";
      distance.value = Math.round(calculatedDistanceInKm * METERS_TO_KM);
    } else {
      distanceUnit.value = "km";
      distance.value = calculatedDistanceInKm;
    }

    result.value = `Distancia: ${formatDistance(calculatedDistanceInKm, distanceUnit.value)}`;
    calculatedField.value = "distance";

    nextTick(() => {
      isCalculating.value = false;
    });
  };

  const calculate = (): void => {
    calculatedField.value = null;
    result.value = "";

    const validations = {
      pace: isValidPace(pace.value, paceUnit.value),
      distance: isValidDistance(distance.value),
      time: isValidTime(time.value, timeUnit.value),
    };

    const filledCount = Object.values(validations).filter(Boolean).length;

    if (filledCount !== 2) {
      result.value = "Introduce exactamente dos valores";
      return;
    }

    try {
      const distanceInKm = validations.distance
        ? distanceToKm(distance.value!, distanceUnit.value)
        : null;

      if (validations.pace && validations.distance) {
        calculateTime(pace.value, distanceInKm!, paceUnit.value);
      } else if (validations.distance && validations.time) {
        calculatePace(time.value, distanceInKm!, timeUnit.value);
      } else if (validations.pace && validations.time) {
        calculateDistance(pace.value, time.value, timeUnit.value, paceUnit.value);
      }
    } catch {
      result.value = "Error al realizar el cálculo. Verifica los valores ingresados.";
    }
  };

  const clear = (): void => {
    pace.value = "";
    paceUnit.value = "min";
    distance.value = null;
    distanceUnit.value = "m";
    time.value = "";
    timeUnit.value = "min";
    result.value = "";
    calculatedField.value = null;
  };

  const FIELD_CLEARERS: Record<Exclude<CalculatedField, null>, () => void> = {
    pace: () => {
      pace.value = "";
    },
    distance: () => {
      distance.value = null;
    },
    time: () => {
      time.value = "";
    },
  };

  const clearField = (field: CalculatedField): void => {
    if (field !== null) {
      FIELD_CLEARERS[field]();
    }

    if (calculatedField.value === field) {
      calculatedField.value = null;
      result.value = "";
    }
  };

  const clearPace = (): void => clearField("pace");
  const clearDistance = (): void => clearField("distance");
  const clearTime = (): void => clearField("time");

  const convertPaceToNewUnit = (oldUnit: PaceUnit, newUnit: PaceUnit): void => {
    if (!pace.value || oldUnit === newUnit) return;

    try {
      const paceInSeconds = paceToSeconds(pace.value, oldUnit);
      if (newUnit === "sec") {
        pace.value = paceInSeconds.toFixed(1);
      } else {
        pace.value = secondsToPace(paceInSeconds, "min");
      }
    } catch {
      pace.value = "";
    }
  };

  const convertTimeToNewUnit = (oldUnit: TimeUnit, newUnit: TimeUnit): void => {
    if (!time.value || oldUnit === newUnit) return;

    try {
      isProgrammaticTimeChange = true;
      const totalSeconds = timeToSeconds(time.value, oldUnit);
      time.value = secondsToTime(totalSeconds, newUnit);
      nextTick(() => {
        isProgrammaticTimeChange = false;
      });
    } catch {
      time.value = "";
      isProgrammaticTimeChange = false;
    }
  };

  const convertDistanceToNewUnit = (oldUnit: DistanceUnit, newUnit: DistanceUnit): void => {
    if (distance.value === null || oldUnit === newUnit) return;

    try {
      const distanceInKm = distanceToKm(distance.value, oldUnit);
      if (newUnit === "m") {
        distance.value = Math.round(distanceInKm * METERS_TO_KM);
      } else {
        distance.value = Number(distanceInKm.toFixed(2));
      }
    } catch {
      distance.value = null;
    }
  };

  watch(paceUnit, (newUnit, oldUnit) => {
    if (oldUnit && pace.value && !isCalculating.value) {
      convertPaceToNewUnit(oldUnit, newUnit);
    }
  });

  let isProgrammaticTimeChange = false;

  watch(timeUnit, (newUnit, oldUnit) => {
    if (oldUnit && time.value && !isCalculating.value && !isProgrammaticTimeChange) {
      convertTimeToNewUnit(oldUnit, newUnit);
    }
  });

  watch(
    () => time.value,
    (newTime, oldTime) => {
      if (
        isCalculating.value ||
        isProgrammaticTimeChange ||
        timeUnit.value !== "sec" ||
        !newTime ||
        newTime.trim() === "" ||
        newTime === oldTime ||
        calculatedField.value === "time"
      ) {
        return;
      }

      try {
        const seconds = Number(newTime);
        if (!isNaN(seconds) && seconds >= SECONDS_THRESHOLD) {
          const appropriateUnit = getAppropriateTimeUnit(seconds);
          if (appropriateUnit !== "sec") {
            isProgrammaticTimeChange = true;
            timeUnit.value = appropriateUnit;
            time.value = secondsToTime(seconds, appropriateUnit);
            nextTick(() => {
              isProgrammaticTimeChange = false;
            });
          }
        }
      } catch {
        // Ignore
      }
    }
  );

  watch(distanceUnit, (newUnit, oldUnit) => {
    if (oldUnit && distance.value !== null && !isCalculating.value) {
      convertDistanceToNewUnit(oldUnit, newUnit);
    }
  });

  return {
    pace,
    paceUnit,
    distance,
    distanceUnit,
    time,
    timeUnit,
    result,
    calculatedField,
    calculate,
    clear,
    clearPace,
    clearDistance,
    clearTime,
  };
}
