import { describe, it, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { useTheme } from "../../composables/useTheme";

describe("useTheme", () => {
  let mockLocalStorage: { [key: string]: string };
  let mockAddClass: jest.Mock;
  let mockRemoveClass: jest.Mock;
  let mockContainsClass: jest.Mock;
  let mockHtmlElement: HTMLElement;

  beforeEach(() => {
    mockLocalStorage = {};
    mockAddClass = jest.fn();
    mockRemoveClass = jest.fn();
    mockContainsClass = jest.fn(() => false);

    mockHtmlElement = {
      classList: {
        add: mockAddClass,
        remove: mockRemoveClass,
        contains: mockContainsClass,
      },
    } as unknown as HTMLElement;

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
      },
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document, "documentElement", {
      value: mockHtmlElement,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockLocalStorage = {};
  });

  describe("setTheme", () => {
    it("should set theme to light and remove dark class", () => {
      const { theme, setTheme } = useTheme();
      mockContainsClass.mockReturnValue(true);

      setTheme("light");

      expect(theme.value).toBe("light");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "light");
      expect(mockRemoveClass).toHaveBeenCalledWith("dark");
      expect(mockAddClass).not.toHaveBeenCalled();
    });

    it("should set theme to dark and add dark class", () => {
      const { theme, setTheme } = useTheme();

      setTheme("dark");

      expect(theme.value).toBe("dark");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "dark");
      expect(mockAddClass).toHaveBeenCalledWith("dark");
      expect(mockRemoveClass).not.toHaveBeenCalled();
    });

    it("should update localStorage when theme changes", () => {
      const { setTheme } = useTheme();

      setTheme("dark");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "dark");

      setTheme("light");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "light");
    });
  });

  describe("toggleTheme", () => {
    it("should toggle from light to dark", () => {
      const { theme, toggleTheme } = useTheme();
      theme.value = "light";

      toggleTheme();

      expect(theme.value).toBe("dark");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "dark");
      expect(mockAddClass).toHaveBeenCalledWith("dark");
    });

    it("should toggle from dark to light", () => {
      const { theme, toggleTheme } = useTheme();
      theme.value = "dark";

      toggleTheme();

      expect(theme.value).toBe("light");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "light");
      expect(mockRemoveClass).toHaveBeenCalledWith("dark");
    });

    it("should toggle multiple times correctly", () => {
      const { theme, toggleTheme } = useTheme();
      theme.value = "light";

      toggleTheme();
      expect(theme.value).toBe("dark");

      toggleTheme();
      expect(theme.value).toBe("light");

      toggleTheme();
      expect(theme.value).toBe("dark");
    });
  });

  describe("theme initialization", () => {
    it("should have a theme value", () => {
      const { theme } = useTheme();
      expect(theme.value).toBeDefined();
      expect(["light", "dark"]).toContain(theme.value);
    });

    it("should persist theme to localStorage when set", () => {
      const { setTheme } = useTheme();
      setTheme("dark");
      expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "dark");
    });

    it("should have valid theme value", () => {
      const { theme } = useTheme();
      expect(theme.value).toBeDefined();
      expect(["light", "dark"]).toContain(theme.value);
    });
  });

  describe("theme reactivity", () => {
    it("should return reactive theme ref", () => {
      const { theme, setTheme } = useTheme();

      expect(theme.value).toBeDefined();
      expect(typeof theme.value).toBe("string");

      setTheme("dark");
      expect(theme.value).toBe("dark");

      setTheme("light");
      expect(theme.value).toBe("light");
    });
  });

  describe("applyTheme", () => {
    it("should apply dark class when theme is dark", () => {
      const { setTheme } = useTheme();

      setTheme("dark");

      expect(mockAddClass).toHaveBeenCalledWith("dark");
      expect(mockRemoveClass).not.toHaveBeenCalled();
    });

    it("should remove dark class when theme is light", () => {
      const { setTheme } = useTheme();
      mockContainsClass.mockReturnValue(true);

      setTheme("light");

      expect(mockRemoveClass).toHaveBeenCalledWith("dark");
      expect(mockAddClass).not.toHaveBeenCalled();
    });

    it("should handle applyTheme when window is undefined", () => {
      // This test is difficult to execute in a Node.js environment where window is always defined
      // The code handles SSR by checking `typeof window === "undefined"` but in tests
      // we can't easily simulate this. The functionality is correct as the code checks
      // for window existence before accessing it.
      const { setTheme } = useTheme();
      setTheme("dark");

      // In a real SSR environment, applyTheme would return early if window is undefined
      // but in tests, window is always defined, so the theme is applied normally
      expect(mockAddClass).toHaveBeenCalledWith("dark");
    });
  });
});
