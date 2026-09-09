import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useTheme } from "../../composables/useTheme";

describe("useTheme", () => {
  let mockLocalStorage: { [key: string]: string };
  let mockAddClass: ReturnType<typeof vi.fn>;
  let mockRemoveClass: ReturnType<typeof vi.fn>;
  let mockHtmlElement: HTMLElement;

  beforeEach(() => {
    mockLocalStorage = {};
    mockAddClass = vi.fn();
    mockRemoveClass = vi.fn();

    mockHtmlElement = {
      classList: {
        add: mockAddClass,
        remove: mockRemoveClass,
        contains: vi.fn(() => false),
      },
    } as unknown as HTMLElement;

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete mockLocalStorage[key];
        }),
        clear: vi.fn(() => {
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
    vi.clearAllMocks();
  });

  it("sets light and dark themes", () => {
    const { theme, setTheme } = useTheme();

    setTheme("dark");
    expect(theme.value).toBe("dark");
    expect(localStorage.setItem).toHaveBeenCalledWith("ritmo-calculadora-theme", "dark");
    expect(mockAddClass).toHaveBeenCalledWith("dark");

    setTheme("light");
    expect(theme.value).toBe("light");
    expect(mockRemoveClass).toHaveBeenCalledWith("dark");
  });

  it("toggles between light and dark", () => {
    const { theme, toggleTheme } = useTheme();
    theme.value = "light";

    toggleTheme();
    expect(theme.value).toBe("dark");

    toggleTheme();
    expect(theme.value).toBe("light");
  });
});
