import { describe, it, expect, beforeEach } from "@jest/globals";
import { usePaceCalculator } from "../../composables/usePaceCalculator";

describe("usePaceCalculator", () => {
  let calculator: ReturnType<typeof usePaceCalculator>;

  beforeEach(() => {
    calculator = usePaceCalculator();
    calculator.clear();
  });

  describe("calculate", () => {
    it("should calculate time from pace and distance (min format)", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.result.value).toContain("Tiempo:");
      expect(calculator.calculatedField.value).toBe("time");
    });

    it("should calculate time from pace and distance and auto-adjust unit", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.timeUnit.value = "sec";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.result.value).toContain("Tiempo:");
      expect(calculator.calculatedField.value).toBe("time");
      expect(calculator.timeUnit.value).toBe("min");
    });

    it("should calculate time from pace in seconds and distance", () => {
      calculator.pace.value = "270";
      calculator.paceUnit.value = "sec";
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.result.value).toContain("Tiempo:");
      expect(calculator.calculatedField.value).toBe("time");
    });

    it("should calculate time correctly for 2580 seconds (43:00)", () => {
      calculator.pace.value = "4:18";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 10;
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.time.value).toBe("43:00");
      expect(calculator.timeUnit.value).toBe("min");
      expect(calculator.result.value).toBe("Tiempo: 43:00");
      expect(calculator.calculatedField.value).toBe("time");
    });

    it("should calculate time correctly: 3:35 min/km pace and 200m distance = 43 seconds", () => {
      calculator.pace.value = "3:35";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 200;
      calculator.distanceUnit.value = "m";
      calculator.calculate();

      expect(calculator.time.value).toBe("43.0");
      expect(calculator.timeUnit.value).toBe("sec");
      expect(calculator.result.value).toBe("Tiempo: 43.0 seg");
      expect(calculator.calculatedField.value).toBe("time");
    });

    it("should calculate pace from distance and time", () => {
      calculator.distance.value = 5;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "25:00";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.pace.value).toBeTruthy();
      expect(calculator.result.value).toContain("Ritmo:");
      expect(calculator.result.value).toContain("min/km");
      expect(calculator.calculatedField.value).toBe("pace");
    });

    it("should always show pace result in min/km format even when input unit is sec", () => {
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "5:00";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "sec";
      calculator.calculate();

      expect(calculator.pace.value).toBeTruthy();
      expect(calculator.result.value).toContain("Ritmo:");
      expect(calculator.result.value).toContain("min/km");
      expect(calculator.result.value).not.toContain("seg/km");
      expect(calculator.calculatedField.value).toBe("pace");
    });

    it("should format pace result correctly in min:ss format", () => {
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "5:00";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      const paceValue = calculator.pace.value;
      expect(paceValue).toMatch(/^\d{1,2}:\d{2}(\.\d)?$/);
      expect(calculator.result.value).toBe(`Ritmo: ${paceValue} min/km`);
    });

    it("should calculate distance from pace and time (min format)", () => {
      calculator.pace.value = "5:00";
      calculator.paceUnit.value = "min";
      calculator.time.value = "20:00";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.distance.value).toBeTruthy();
      expect(calculator.result.value).toContain("Distancia:");
      expect(calculator.calculatedField.value).toBe("distance");
    });

    it("should calculate distance from pace and time (sec format)", () => {
      calculator.pace.value = "5:00";
      calculator.paceUnit.value = "min";
      calculator.time.value = "1200";
      calculator.timeUnit.value = "sec";
      calculator.calculate();

      expect(calculator.distance.value).toBeTruthy();
      expect(calculator.result.value).toContain("Distancia:");
      expect(calculator.calculatedField.value).toBe("distance");
    });

    it("should calculate distance from pace in seconds and time", () => {
      calculator.pace.value = "300";
      calculator.paceUnit.value = "sec";
      calculator.time.value = "20:00";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.distance.value).toBeTruthy();
      expect(calculator.result.value).toContain("Distancia:");
      expect(calculator.calculatedField.value).toBe("distance");
    });

    it("should show error when not exactly 2 values are provided", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.result.value).toBe("Introduce exactamente dos valores");
    });

    it("should show error when all 3 values are provided", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 1;
      calculator.time.value = "4:30";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.result.value).toBe("Introduce exactamente dos valores");
    });

    it("should handle distance in meters correctly", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 1000;
      calculator.distanceUnit.value = "m";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.calculatedField.value).toBe("time");
    });
  });

  describe("clear", () => {
    it("should clear all fields", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 5;
      calculator.time.value = "25:00";
      calculator.result.value = "Test result";
      calculator.calculatedField.value = "pace";

      calculator.clear();

      expect(calculator.pace.value).toBe("");
      expect(calculator.paceUnit.value).toBe("min");
      expect(calculator.distance.value).toBeNull();
      expect(calculator.time.value).toBe("");
      expect(calculator.timeUnit.value).toBe("min");
      expect(calculator.result.value).toBe("");
      expect(calculator.calculatedField.value).toBeNull();
      expect(calculator.distanceUnit.value).toBe("m");
    });
  });

  describe("clearPace", () => {
    it("should clear only pace field", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 5;
      calculator.clearPace();

      expect(calculator.pace.value).toBe("");
      expect(calculator.distance.value).toBe(5);
    });

    it("should clear result if pace was calculated", () => {
      calculator.distance.value = 5;
      calculator.time.value = "25:00";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();
      expect(calculator.calculatedField.value).toBe("pace");
      calculator.clearPace();

      expect(calculator.result.value).toBe("");
      expect(calculator.calculatedField.value).toBeNull();
    });
  });

  describe("clearDistance", () => {
    it("should clear only distance field", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 5;
      calculator.clearDistance();

      expect(calculator.distance.value).toBeNull();
      expect(calculator.pace.value).toBe("4:30");
    });
  });

  describe("clearTime", () => {
    it("should clear only time field", () => {
      calculator.time.value = "25:00";
      calculator.pace.value = "4:30";
      calculator.clearTime();

      expect(calculator.time.value).toBe("");
      expect(calculator.pace.value).toBe("4:30");
    });
  });

  describe("validation", () => {
    it("should validate pace format in minutes", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 5;
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate pace format in seconds", () => {
      calculator.pace.value = "270";
      calculator.paceUnit.value = "sec";
      calculator.distance.value = 5;
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate pace format with decimals in seconds", () => {
      calculator.pace.value = "270.5";
      calculator.paceUnit.value = "sec";
      calculator.distance.value = 5;
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate time format in mm:ss (min unit)", () => {
      calculator.distance.value = 5;
      calculator.time.value = "25:00";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate time format as single number (min unit)", () => {
      calculator.distance.value = 5;
      calculator.time.value = "25";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate time format in seconds (sec unit)", () => {
      calculator.distance.value = 5;
      calculator.time.value = "1500";
      calculator.timeUnit.value = "sec";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate distance", () => {
      calculator.pace.value = "4:30";
      calculator.paceUnit.value = "min";
      calculator.distance.value = 0.5;
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });
  });

  describe("pace unit conversion", () => {
    it("should accept pace input in seconds and use it for calculations", () => {
      calculator.pace.value = "180";
      calculator.paceUnit.value = "sec";
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.time.value).toBe("3:00");
      expect(calculator.calculatedField.value).toBe("time");
    });

    it("should always display calculated pace in min/km format", () => {
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "5:00";
      calculator.paceUnit.value = "sec";
      calculator.calculate();

      const result = calculator.result.value;
      expect(result).toContain("Ritmo:");
      expect(result).toContain("min/km");
      expect(result).not.toContain("seg/km");
      expect(calculator.pace.value).toMatch(/^\d{1,2}:\d{2}(\.\d)?$/);
    });

    it("should handle pace input in seconds with decimals", () => {
      calculator.pace.value = "270.5";
      calculator.paceUnit.value = "sec";
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.calculatedField.value).toBe("time");
    });
  });

  describe("time input as single number", () => {
    it("should accept time as single number (interpreted as minutes)", () => {
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "50";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.pace.value).toBeTruthy();
      expect(calculator.result.value).toContain("Ritmo:");
      expect(calculator.calculatedField.value).toBe("pace");
    });

    it("should calculate distance from pace and time as single number", () => {
      calculator.pace.value = "5:00";
      calculator.paceUnit.value = "min";
      calculator.time.value = "20";
      calculator.timeUnit.value = "min";
      calculator.calculate();

      expect(calculator.distance.value).toBeTruthy();
      expect(calculator.result.value).toContain("Distancia:");
      expect(calculator.calculatedField.value).toBe("distance");
    });

    it("should handle zero minutes correctly", () => {
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "0";
      calculator.timeUnit.value = "min";
      calculator.paceUnit.value = "min";
      calculator.calculate();

      expect(calculator.pace.value).toBe("0:00");
      expect(calculator.result.value).toContain("Ritmo:");
    });
  });
});
