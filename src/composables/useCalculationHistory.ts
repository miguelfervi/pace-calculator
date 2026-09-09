import { ref } from "vue";
import { parseHistoryEntries, pushHistoryEntry, type HistoryEntry } from "../domain/history";

const STORAGE_KEY = "ritmo-calculadora-history";

const entries = ref<HistoryEntry[]>(
  typeof window === "undefined" ? [] : parseHistoryEntries(localStorage.getItem(STORAGE_KEY))
);

const persist = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value));
};

export const resetCalculationHistory = () => {
  entries.value = [];
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export function useCalculationHistory() {
  const remember = (entry: HistoryEntry) => {
    entries.value = pushHistoryEntry(entries.value, entry);
    persist();
  };

  return {
    entries,
    remember,
  };
}
