import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Calculator from "../../components/Calculator.vue";
import { useI18n } from "../../composables/useI18n";

describe("Calculator.vue", () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    useI18n().setLocale("es");
    wrapper = mount(Calculator);
  });

  it("should render the component", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should render the title", () => {
    const title = wrapper.find("h1");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Calculadora de Ritmo");
  });

  it("should render the theme toggle switch", () => {
    const themeToggle = wrapper.find('[role="switch"]');
    expect(themeToggle.exists()).toBe(true);
  });

  it("should render the information message", () => {
    const infoMessage = wrapper.find(".bg-amber-50");
    expect(infoMessage.exists()).toBe(true);
    expect(infoMessage.text()).toContain("Información");
  });

  it("should render all three input fields", () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    expect(inputs.length).toBe(3);
  });

  it("should render the Pace input field", () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    const paceInput = inputs[0];
    expect(paceInput.exists()).toBe(true);
    expect(paceInput.props("label")).toBe("Ritmo");
  });

  it("should render the Distance input field", () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    const distanceInput = inputs[1];
    expect(distanceInput.exists()).toBe(true);
    expect(distanceInput.props("label")).toBe("Distancia");
  });

  it("should render the Time input field with correct label", () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    const timeInput = inputs[2];
    expect(timeInput.exists()).toBe(true);
    expect(timeInput.props("label")).toBe("Tiempo");
  });

  it("should render the Calculate button", () => {
    const buttons = wrapper.findAll("button");
    const calculateButton = buttons.find(btn => btn.text() === "Calcular");
    expect(calculateButton?.exists()).toBe(true);
  });

  it("should render the Clear button", () => {
    const buttons = wrapper.findAll("button");
    const clearButton = buttons.find(btn => btn.text() === "Limpiar");
    expect(clearButton?.exists()).toBe(true);
  });

  it("should pass isCalculated prop to InputWithSelector components", () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    inputs.forEach(input => {
      expect(input.props("isCalculated")).toBeDefined();
      expect(typeof input.props("isCalculated")).toBe("boolean");
    });
  });

  it("should switch the UI to English", async () => {
    const englishButton = wrapper.findAll("button").find(btn => btn.text() === "EN");
    expect(englishButton?.exists()).toBe(true);

    await englishButton!.trigger("click");

    expect(wrapper.find("h1").text()).toBe("Pace Calculator");
    expect(wrapper.find(".bg-amber-50").text()).toContain("Info:");
    expect(wrapper.findAll("button").some(btn => btn.text() === "Calculate")).toBe(true);
    expect(wrapper.findAll("button").some(btn => btn.text() === "Clear")).toBe(true);
  });

  it("should offer metric and imperial distance units in Spanish", () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    const paceInput = inputs[0];
    const distanceInput = inputs[1];

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
    expect(distanceInput.props("selectedUnit")).toBe("m");
  });

  it("should keep yards and miles available after switching to English", async () => {
    const englishButton = wrapper.findAll("button").find(btn => btn.text() === "EN");
    await englishButton!.trigger("click");

    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    const paceInput = inputs[0];
    const distanceInput = inputs[1];

    expect(wrapper.find("h1").text()).toBe("Pace Calculator");
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
    expect(distanceInput.props("selectedUnit")).toBe("m");
  });

  it("should keep a kilometer value when switching to English", async () => {
    const distanceInput = wrapper.findAllComponents({ name: "InputWithSelector" })[1];
    await distanceInput.vm.$emit("update:selectedUnit", "km");
    await distanceInput.vm.$emit("update:modelValue", "1");

    const englishButton = wrapper.findAll("button").find(btn => btn.text() === "EN");
    await englishButton!.trigger("click");

    expect(distanceInput.props("modelValue")).toBe("1");
    expect(distanceInput.props("selectedUnit")).toBe("km");
  });

  it("should keep pace units as min and sec when miles are selected", async () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    await inputs[1].vm.$emit("update:selectedUnit", "mi");
    await wrapper.vm.$nextTick();

    expect(inputs[0].props("options")).toEqual([
      { value: "min", label: "min" },
      { value: "sec", label: "seg" },
    ]);
    expect(inputs[1].props("selectedUnit")).toBe("mi");
  });

  it("should calculate time from pace and distance", async () => {
    const inputs = wrapper.findAllComponents({ name: "InputWithSelector" });
    await inputs[0].vm.$emit("update:modelValue", "4:30");
    await inputs[1].vm.$emit("update:selectedUnit", "km");
    await inputs[1].vm.$emit("update:modelValue", "1");

    const calculateButton = wrapper.findAll("button").find(btn => btn.text() === "Calcular");
    await calculateButton!.trigger("click");

    expect(inputs[2].props("modelValue")).toBe("4:30");
    expect(inputs[2].props("isCalculated")).toBe(true);
  });

  it("should not show error message initially", () => {
    const errorMessage = wrapper.find(".bg-red-50");
    expect(errorMessage.exists()).toBe(false);
  });
});
