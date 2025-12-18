import { ref } from "vue";

type Theme = "light" | "dark";

const STORAGE_KEY = "ritmo-calculadora-theme";
const DEFAULT_THEME: Theme = "light";

const theme = ref<Theme>(DEFAULT_THEME);

const applyTheme = (themeToApply: Theme) => {
  if (typeof window === "undefined") return;

  const htmlElement = document.documentElement;
  if (themeToApply === "dark") {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }
  const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  return savedTheme || DEFAULT_THEME;
};

if (typeof window !== "undefined") {
  const initialTheme = getInitialTheme();
  theme.value = initialTheme;
  applyTheme(initialTheme);
}

export function useTheme() {
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    const currentTheme = theme.value;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}
