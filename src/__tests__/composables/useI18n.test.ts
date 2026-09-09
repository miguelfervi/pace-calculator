import { describe, it, expect, beforeEach } from "@jest/globals";
import { useI18n } from "../../composables/useI18n";

describe("useI18n", () => {
  beforeEach(() => {
    localStorage.clear();
    useI18n().setLocale("es");
  });

  it("should translate keys for the active locale", () => {
    const { t, setLocale } = useI18n();

    expect(t("title")).toBe("Calculadora de Ritmo");
    expect(t("calculate")).toBe("Calcular");

    setLocale("en");

    expect(t("title")).toBe("Pace Calculator");
    expect(t("calculate")).toBe("Calculate");
  });

  it("should persist the locale and update the document language", () => {
    const { locale, setLocale } = useI18n();

    setLocale("en");

    expect(locale.value).toBe("en");
    expect(localStorage.getItem("ritmo-calculadora-locale")).toBe("en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe("Pace Calculator");
  });

  it("should default to Spanish when no locale is saved", () => {
    localStorage.clear();
    const { t, setLocale } = useI18n();
    setLocale("es");

    expect(t("title")).toBe("Calculadora de Ritmo");
    expect(t("calculate")).toBe("Calcular");
  });
});
