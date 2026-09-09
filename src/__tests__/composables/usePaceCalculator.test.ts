import { describe, it, expect, beforeEach } from "vitest";
import { usePaceCalculator } from "../../composables/usePaceCalculator";
import { useI18n } from "../../composables/useI18n";
import { formatOutcome } from "../../i18n/formatOutcome";
import { resetCalculationHistory } from "../../composables/useCalculationHistory";

describe("usePaceCalculator", () => {
  let calculator: ReturnType<typeof usePaceCalculator>;
  const { setLocale, t } = useI18n();

  beforeEach(() => {
    setLocale("es");
    resetCalculationHistory();
    calculator = usePaceCalculator();
    calculator.clear();
  });

  describe("calculate", () => {
    it("calculates time from pace and distance", () => {
      calculator.pace.value = "4:18";
      calculator.distance.value = "10";
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.time.value).toBe("43:00");
      expect(calculator.timeUnit.value).toBe("min");
      expect(calculator.calculatedField.value).toBe("time");
      expect(formatOutcome(calculator.outcome.value, t)).toBe("Tiempo: 43:00");
    });

    it("uses seconds when the calculated time is under a minute", () => {
      calculator.pace.value = "3:35";
      calculator.distance.value = "200";
      calculator.distanceUnit.value = "m";
      calculator.calculate();

      expect(calculator.time.value).toBe("43.0");
      expect(calculator.timeUnit.value).toBe("sec");
      expect(formatOutcome(calculator.outcome.value, t)).toBe("Tiempo: 43.0 seg");
    });

    it("uses hours when the calculated time is 60 minutes or more", () => {
      calculator.pace.value = "5:00";
      calculator.distance.value = "12";
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.time.value).toBe("1:00");
      expect(calculator.timeUnit.value).toBe("hr");
      expect(formatOutcome(calculator.outcome.value, t)).toBe("Tiempo: 1:00 h");
    });

    it("calculates pace from distance and time", () => {
      calculator.distance.value = "5";
      calculator.distanceUnit.value = "km";
      calculator.time.value = "25:00";
      calculator.calculate();

      expect(calculator.pace.value).toBe("5:00");
      expect(calculator.calculatedField.value).toBe("pace");
      expect(formatOutcome(calculator.outcome.value, t)).toBe("Ritmo: 5:00 min/km");
    });

    it("uses seconds for a very fast calculated pace", () => {
      calculator.distance.value = "0.6";
      calculator.distanceUnit.value = "km";
      calculator.time.value = "30";
      calculator.timeUnit.value = "sec";
      calculator.calculate();

      expect(calculator.paceUnit.value).toBe("sec");
      expect(formatOutcome(calculator.outcome.value, t)).toContain("seg/km");
    });

    it("calculates distance from pace and time", () => {
      calculator.pace.value = "5:00";
      calculator.time.value = "20:00";
      calculator.calculate();

      expect(calculator.distance.value).toBe("4");
      expect(calculator.distanceUnit.value).toBe("km");
      expect(calculator.calculatedField.value).toBe("distance");
    });

    it("uses meters when the calculated distance is under a kilometer", () => {
      calculator.pace.value = "5:00";
      calculator.time.value = "30";
      calculator.timeUnit.value = "sec";
      calculator.calculate();

      expect(calculator.distanceUnit.value).toBe("m");
      expect(Number(calculator.distance.value)).toBeLessThan(1000);
    });

    it("shows an error unless exactly two values are filled", () => {
      calculator.pace.value = "4:30";
      calculator.calculate();
      expect(formatOutcome(calculator.outcome.value, t)).toBe("Introduce exactamente dos valores");

      calculator.distance.value = "1";
      calculator.time.value = "4:30";
      calculator.calculate();
      expect(formatOutcome(calculator.outcome.value, t)).toBe("Introduce exactamente dos valores");
    });
  });

  describe("recent calculations", () => {
    it("remembers a successful calculation and skips errors", () => {
      calculator.pace.value = "4:30";
      calculator.calculate();
      expect(calculator.recentCalculations.value).toEqual([]);

      calculator.distance.value = "1";
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.recentCalculations.value).toHaveLength(1);
      expect(calculator.recentCalculations.value[0]?.time).toBe("4:30");
    });

    it("restores the two inputs and leaves the calculated field empty", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = "1";
      calculator.distanceUnit.value = "km";
      calculator.calculate();
      calculator.clear();

      const [entry] = calculator.recentCalculations.value;
      calculator.applyHistory(entry!);

      expect(calculator.pace.value).toBe("4:30");
      expect(calculator.distance.value).toBe("1");
      expect(calculator.time.value).toBe("");
      expect(calculator.calculatedField.value).toBeNull();
    });
  });

  describe("clear", () => {
    it("clears every field and the outcome", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = "5";
      calculator.time.value = "25:00";
      calculator.calculatedField.value = "pace";
      calculator.clear();

      expect(calculator.pace.value).toBe("");
      expect(calculator.distance.value).toBe("");
      expect(calculator.time.value).toBe("");
      expect(calculator.distanceUnit.value).toBe("m");
      expect(calculator.calculatedField.value).toBeNull();
      expect(formatOutcome(calculator.outcome.value, t)).toBe("");
    });

    it("clears the outcome when the calculated field is cleared", () => {
      calculator.distance.value = "5";
      calculator.distanceUnit.value = "km";
      calculator.time.value = "25:00";
      calculator.calculate();
      calculator.clearPace();

      expect(calculator.pace.value).toBe("");
      expect(calculator.calculatedField.value).toBeNull();
    });
  });

  describe("unit conversion", () => {
    it("converts pace, time and distance when the unit changes", () => {
      calculator.pace.value = "4:30";
      calculator.changePaceUnit("sec");
      expect(calculator.pace.value).toBe("270.0");
      calculator.changePaceUnit("min");
      expect(calculator.pace.value).toBe("4:30");

      calculator.time.value = "5:00";
      calculator.changeTimeUnit("sec");
      expect(calculator.time.value).toBe("300.0");
      calculator.changeTimeUnit("hr");
      expect(calculator.time.value).toBe("0:05");

      calculator.distance.value = "500";
      calculator.changeDistanceUnit("km");
      expect(calculator.distance.value).toBe("0.5");
    });

    it("clears an invalid time instead of converting it", () => {
      calculator.time.value = "abc";
      calculator.changeTimeUnit("sec");
      expect(calculator.time.value).toBe("");
    });

    it("does not convert pace when switching distance units", () => {
      calculator.changeDistanceUnit("km");
      calculator.distance.value = "1";
      calculator.pace.value = "4:30";
      calculator.changeDistanceUnit("mi");

      expect(calculator.distance.value).toBe("0.62");
      expect(calculator.pace.value).toBe("4:30");
    });
  });

  describe("setTime", () => {
    it("promotes seconds to minutes or hours at the 60s and 3600s thresholds", () => {
      calculator.timeUnit.value = "sec";
      calculator.setTime("59");
      expect(calculator.timeUnit.value).toBe("sec");

      calculator.setTime("60");
      expect(calculator.time.value).toBe("1:00");
      expect(calculator.timeUnit.value).toBe("min");

      calculator.timeUnit.value = "sec";
      calculator.setTime("3600");
      expect(calculator.time.value).toBe("1:00");
      expect(calculator.timeUnit.value).toBe("hr");
    });

    it("does not auto-convert seconds after time was calculated", () => {
      calculator.pace.value = "5:00";
      calculator.distance.value = "1";
      calculator.distanceUnit.value = "km";
      calculator.calculate();
      calculator.setTime("100");

      expect(calculator.time.value).toBe("100");
      expect(calculator.timeUnit.value).toBe("min");
    });
  });
});
