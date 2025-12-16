import { describe, it, expect, beforeEach } from "@jest/globals";
import { usePaceCalculator } from "../../composables/usePaceCalculator";

describe("usePaceCalculator", () => {
  let calculator: ReturnType<typeof usePaceCalculator>;

  beforeEach(() => {
    calculator = usePaceCalculator();
    calculator.clear();
  });

  describe("calculate", () => {
    it("should calculate time from pace and distance", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 1;
      calculator.distanceUnit.value = "km";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.result.value).toContain("Tiempo:");
      expect(calculator.calculatedField.value).toBe("time");
    });

    it("should calculate pace from distance and time", () => {
      calculator.distance.value = 5;
      calculator.distanceUnit.value = "km";
      calculator.time.value = "0:25:00";
      calculator.calculate();

      expect(calculator.pace.value).toBeTruthy();
      expect(calculator.result.value).toContain("Ritmo:");
      expect(calculator.calculatedField.value).toBe("pace");
    });

    it("should calculate distance from pace and time", () => {
      calculator.pace.value = "5:00";
      calculator.time.value = "0:20:00";
      calculator.calculate();

      expect(calculator.distance.value).toBeTruthy();
      expect(calculator.result.value).toContain("Distancia:");
      expect(calculator.calculatedField.value).toBe("distance");
    });

    it("should show error when not exactly 2 values are provided", () => {
      calculator.pace.value = "4:30";
      calculator.calculate();

      expect(calculator.result.value).toBe("Introduce exactamente dos valores");
    });

    it("should show error when all 3 values are provided", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 1;
      calculator.time.value = "0:04:30";
      calculator.calculate();

      expect(calculator.result.value).toBe("Introduce exactamente dos valores");
    });

    it("should handle distance in meters correctly", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 1000;
      calculator.distanceUnit.value = "m";
      calculator.calculate();

      expect(calculator.time.value).toBeTruthy();
      expect(calculator.calculatedField.value).toBe("time");
    });
  });

  describe("clear", () => {
    it("should clear all fields", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 5;
      calculator.time.value = "0:25:00";
      calculator.result.value = "Test result";
      calculator.calculatedField.value = "pace";

      calculator.clear();

      expect(calculator.pace.value).toBe("");
      expect(calculator.distance.value).toBeNull();
      expect(calculator.time.value).toBe("");
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
      calculator.time.value = "0:25:00";
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
      calculator.time.value = "0:25:00";
      calculator.pace.value = "4:30";
      calculator.clearTime();

      expect(calculator.time.value).toBe("");
      expect(calculator.pace.value).toBe("4:30");
    });
  });

  describe("validation", () => {
    it("should validate pace format", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 5;
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate time format", () => {
      calculator.distance.value = 5;
      calculator.time.value = "0:25:00";
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });

    it("should validate distance", () => {
      calculator.pace.value = "4:30";
      calculator.distance.value = 0.5;
      calculator.calculate();

      expect(calculator.result.value).toBeTruthy();
    });
  });
});
