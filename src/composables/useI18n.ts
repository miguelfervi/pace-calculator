import { ref } from "vue";
import { messages, type Locale, type MessageKey } from "../i18n/messages";

const STORAGE_KEY = "ritmo-calculadora-locale";
const DEFAULT_LOCALE: Locale = "es";

const locale = ref<Locale>(DEFAULT_LOCALE);

const isLocale = (value: string | null): value is Locale => {
  return value === "es" || value === "en";
};

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const savedLocale = localStorage.getItem(STORAGE_KEY);
  return isLocale(savedLocale) ? savedLocale : DEFAULT_LOCALE;
};

const applyLocale = (nextLocale: Locale) => {
  if (typeof document === "undefined") return;

  document.documentElement.lang = nextLocale;
  document.title = messages[nextLocale].title;
};

if (typeof window !== "undefined") {
  const initialLocale = getInitialLocale();
  locale.value = initialLocale;
  applyLocale(initialLocale);
}

export function useI18n() {
  const t = (key: MessageKey): string => {
    return messages[locale.value][key];
  };

  const setLocale = (nextLocale: Locale) => {
    locale.value = nextLocale;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, nextLocale);
      applyLocale(nextLocale);
    }
  };

  return {
    locale,
    t,
    setLocale,
  };
}
