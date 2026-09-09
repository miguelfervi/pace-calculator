import { ref } from "vue";
import {
  convertDistanceValue,
  convertPaceValue,
  convertTimeValue,
  normalizeSecondsInput,
  solveMissingField,
} from "../domain/paceCalculator";
import { EMPTY_OUTCOME, type CalculatedField, type CalculatorOutcome } from "../domain/types";
import type { DistanceUnit, PaceUnit, TimeUnit } from "../domain/types";

export function usePaceCalculator() {
  const pace = ref("");
  const paceUnit = ref<PaceUnit>("min");
  const distance = ref("");
  const distanceUnit = ref<DistanceUnit>("m");
  const time = ref("");
  const timeUnit = ref<TimeUnit>("min");
  const outcome = ref<CalculatorOutcome>(EMPTY_OUTCOME);
  const calculatedField = ref<CalculatedField | null>(null);

  const calculate = (): void => {
    const solved = solveMissingField({
      pace: pace.value,
      paceUnit: paceUnit.value,
      distance: distance.value,
      distanceUnit: distanceUnit.value,
      time: time.value,
      timeUnit: timeUnit.value,
      system: "metric",
    });

    outcome.value = solved.outcome;

    if (!solved.ok) {
      calculatedField.value = null;
      return;
    }

    pace.value = solved.pace;
    paceUnit.value = solved.paceUnit;
    distance.value = solved.distance;
    distanceUnit.value = solved.distanceUnit;
    time.value = solved.time;
    timeUnit.value = solved.timeUnit;
    calculatedField.value = solved.missing;
  };

  const resetOutcome = () => {
    outcome.value = EMPTY_OUTCOME;
    calculatedField.value = null;
  };

  const clear = (): void => {
    pace.value = "";
    paceUnit.value = "min";
    distance.value = "";
    distanceUnit.value = "m";
    time.value = "";
    timeUnit.value = "min";
    resetOutcome();
  };

  const clearField = (field: CalculatedField): void => {
    if (field === "pace") pace.value = "";
    if (field === "distance") distance.value = "";
    if (field === "time") time.value = "";

    if (calculatedField.value === field) {
      resetOutcome();
    }
  };

  const changePaceUnit = (unit: PaceUnit): void => {
    try {
      pace.value = convertPaceValue(pace.value, paceUnit.value, unit);
    } catch {
      pace.value = "";
    }
    paceUnit.value = unit;
  };

  const changeTimeUnit = (unit: TimeUnit): void => {
    try {
      time.value = convertTimeValue(time.value, timeUnit.value, unit);
    } catch {
      time.value = "";
    }
    timeUnit.value = unit;
  };

  const changeDistanceUnit = (unit: DistanceUnit): void => {
    distance.value = convertDistanceValue(distance.value, distanceUnit.value, unit);
    distanceUnit.value = unit;
  };

  const setTime = (value: string): void => {
    if (calculatedField.value === "time") {
      time.value = value;
      return;
    }

    const normalized = normalizeSecondsInput(value, timeUnit.value);
    time.value = normalized.value;
    timeUnit.value = normalized.unit;
  };

  return {
    pace,
    paceUnit,
    distance,
    distanceUnit,
    time,
    timeUnit,
    outcome,
    calculatedField,
    calculate,
    clear,
    clearPace: () => clearField("pace"),
    clearDistance: () => clearField("distance"),
    clearTime: () => clearField("time"),
    changePaceUnit,
    changeTimeUnit,
    changeDistanceUnit,
    setTime,
  };
}
