import { describe, it, expect, beforeEach } from "@jest/globals";
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
    const themeToggle = wrapper.find('input[type="checkbox"]');
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

  it("should not show error message initially", () => {
    const errorMessage = wrapper.find(".bg-red-50");
    expect(errorMessage.exists()).toBe(false);
  });
});
