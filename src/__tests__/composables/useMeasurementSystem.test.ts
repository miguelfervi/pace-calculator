import { describe, it, expect, beforeEach } from "vitest";
import { usePaceCalculator } from "../../composables/usePaceCalculator";

describe("distance unit conversion", () => {
  let calculator: ReturnType<typeof usePaceCalculator>;

  beforeEach(() => {
    calculator = usePaceCalculator();
    calculator.clear();
  });

  it("converts 1 km to 0.62 mi without changing pace", () => {
    calculator.changeDistanceUnit("km");
    calculator.distance.value = "1";
    calculator.pace.value = "4:30";
    calculator.changeDistanceUnit("mi");

    expect(calculator.distance.value).toBe("0.62");
    expect(calculator.distanceUnit.value).toBe("mi");
    expect(calculator.pace.value).toBe("4:30");
  });

  it("calculates time for 1 mile at 4:30 min/km", () => {
    calculator.changeDistanceUnit("mi");
    calculator.pace.value = "4:30";
    calculator.distance.value = "1";
    calculator.calculate();

    expect(calculator.time.value).toBe("7:15");
    expect(calculator.calculatedField.value).toBe("time");
  });

  it("calculates time for 400 yards at 4:30 min/km", () => {
    calculator.changeDistanceUnit("yd");
    calculator.pace.value = "4:30";
    calculator.distance.value = "400";
    calculator.calculate();

    expect(calculator.time.value).toBe("1:39");
    expect(calculator.calculatedField.value).toBe("time");
  });

  it("calculates min/km pace from 1 mile in 7:15", () => {
    calculator.changeDistanceUnit("mi");
    calculator.distance.value = "1";
    calculator.time.value = "7:15";
    calculator.calculate();

    expect(calculator.calculatedField.value).toBe("pace");
    expect(calculator.pace.value).toMatch(/^4:3/);
  });

  it("calculates distance in miles from 4:30 min/km and 7:15", () => {
    calculator.changeDistanceUnit("mi");
    calculator.pace.value = "4:30";
    calculator.time.value = "7:15";
    calculator.calculate();

    expect(calculator.calculatedField.value).toBe("distance");
    expect(calculator.distanceUnit.value).toBe("mi");
    expect(Number(calculator.distance.value)).toBeCloseTo(1, 1);
  });

  it("calculates distance in yards from 4:30 min/km and 1:39", () => {
    calculator.changeDistanceUnit("yd");
    calculator.pace.value = "4:30";
    calculator.time.value = "1:39";
    calculator.calculate();

    expect(calculator.calculatedField.value).toBe("distance");
    expect(calculator.distanceUnit.value).toBe("yd");
    expect(Number(calculator.distance.value)).toBeCloseTo(400, -1);
  });
});
