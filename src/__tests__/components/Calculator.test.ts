import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Calculator from "../../components/Calculator.vue";
import { useI18n } from "../../composables/useI18n";
import { resetCalculationHistory } from "../../composables/useCalculationHistory";

describe("Calculator.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    useI18n().setLocale("es");
    resetCalculationHistory();
    wrapper = mount(Calculator);
  });

  const inputs = () => wrapper.findAllComponents({ name: "InputWithSelector" });

  it("renders the Spanish calculator", () => {
    expect(wrapper.find("h1").text()).toBe("Calculadora de Ritmo");
    expect(wrapper.find('[role="switch"]').exists()).toBe(true);
    expect(wrapper.find(".bg-amber-50").text()).toContain("Información");
    expect(inputs().map(input => input.props("label"))).toEqual(["Ritmo", "Distancia", "Tiempo"]);
    expect(wrapper.findAll("button").some(btn => btn.text() === "Calcular")).toBe(true);
    expect(wrapper.findAll("button").some(btn => btn.text() === "Limpiar")).toBe(true);
    expect(wrapper.find(".bg-red-50").exists()).toBe(false);
  });

  it("offers metric and imperial distance units with accessible labels", () => {
    const [paceInput, distanceInput, timeInput] = inputs();

    expect(paceInput.props("options")).toEqual([
      { value: "min", label: "min" },
      { value: "sec", label: "seg" },
    ]);
    expect(distanceInput.props("options")).toEqual([
      { value: "m", label: "m" },
      { value: "km", label: "km" },
      { value: "yd", label: "yarda" },
      { value: "mi", label: "milla" },
    ]);
    expect(paceInput.props("unitAriaLabel")).toBe("Unidad de ritmo");
    expect(distanceInput.props("unitAriaLabel")).toBe("Unidad de distancia");
    expect(timeInput.props("unitAriaLabel")).toBe("Unidad de tiempo");
  });

  it("switches to English and keeps yards and miles", async () => {
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "EN")!
      .trigger("click");

    const [paceInput, distanceInput] = inputs();
    expect(wrapper.find("h1").text()).toBe("Pace Calculator");
    expect(wrapper.findAll("button").some(btn => btn.text() === "Calculate")).toBe(true);
    expect(paceInput.props("options")).toEqual([
      { value: "min", label: "min" },
      { value: "sec", label: "sec" },
    ]);
    expect(distanceInput.props("options")).toEqual([
      { value: "m", label: "m" },
      { value: "km", label: "km" },
      { value: "yd", label: "yard" },
      { value: "mi", label: "mile" },
    ]);
  });

  it("keeps a kilometer value when switching language", async () => {
    const distanceInput = inputs()[1];
    await distanceInput.vm.$emit("update:selectedUnit", "km");
    await distanceInput.vm.$emit("update:modelValue", "1");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "EN")!
      .trigger("click");

    expect(distanceInput.props("modelValue")).toBe("1");
    expect(distanceInput.props("selectedUnit")).toBe("km");
  });

  it("keeps pace units as min and sec when miles are selected", async () => {
    await inputs()[1].vm.$emit("update:selectedUnit", "mi");
    await wrapper.vm.$nextTick();

    expect(inputs()[0].props("options")).toEqual([
      { value: "min", label: "min" },
      { value: "sec", label: "seg" },
    ]);
    expect(inputs()[1].props("selectedUnit")).toBe("mi");
  });

  it("calculates time from pace and distance", async () => {
    await inputs()[0].vm.$emit("update:modelValue", "4:30");
    await inputs()[1].vm.$emit("update:selectedUnit", "km");
    await inputs()[1].vm.$emit("update:modelValue", "1");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "Calcular")!
      .trigger("click");

    expect(inputs()[2].props("modelValue")).toBe("4:30");
    expect(inputs()[2].props("isCalculated")).toBe(true);
  });

  it("calculates time from pace and one mile", async () => {
    await inputs()[0].vm.$emit("update:modelValue", "4:30");
    await inputs()[1].vm.$emit("update:selectedUnit", "mi");
    await inputs()[1].vm.$emit("update:modelValue", "1");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "Calcular")!
      .trigger("click");

    expect(inputs()[2].props("modelValue")).toBe("7:15");
    expect(wrapper.find("[aria-live]").text()).toContain("7:15");
  });

  it("calculates time from pace and 400 yards", async () => {
    await inputs()[0].vm.$emit("update:modelValue", "4:30");
    await inputs()[1].vm.$emit("update:selectedUnit", "yd");
    await inputs()[1].vm.$emit("update:modelValue", "400");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "Calcular")!
      .trigger("click");

    expect(inputs()[2].props("modelValue")).toBe("1:39");
  });

  it("shows an error when calculating with a single value", async () => {
    await inputs()[0].vm.$emit("update:modelValue", "4:30");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "Calcular")!
      .trigger("click");

    expect(wrapper.find('[role="alert"]').text()).toContain("Introduce exactamente dos valores");
  });

  it("lists a recent calculation and fills the two inputs from it", async () => {
    await inputs()[0].vm.$emit("update:modelValue", "4:30");
    await inputs()[1].vm.$emit("update:selectedUnit", "km");
    await inputs()[1].vm.$emit("update:modelValue", "1");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "Calcular")!
      .trigger("click");

    expect(wrapper.text()).toContain("Recientes");
    expect(wrapper.text()).toContain("4:30 min · 1 km → 4:30");

    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "Limpiar")!
      .trigger("click");
    await wrapper
      .findAll("button")
      .find(btn => btn.text() === "4:30 min · 1 km → 4:30")!
      .trigger("click");

    expect(inputs()[0].props("modelValue")).toBe("4:30");
    expect(inputs()[1].props("modelValue")).toBe("1");
    expect(inputs()[2].props("modelValue")).toBe("");
  });
});
