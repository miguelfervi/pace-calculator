<template>
  <div class="max-w-md mx-auto mt-0 pt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6"
    >
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
        {{ t("title") }}
      </h1>
      <div class="flex items-center gap-2 sm:gap-3">
        <div
          class="inline-flex rounded-md border border-gray-300 dark:border-gray-600 overflow-hidden"
          role="group"
          :aria-label="t('language')"
        >
          <button
            type="button"
            class="px-2 py-1 text-xs font-semibold transition-colors"
            :class="localeButtonClass('es')"
            :aria-pressed="locale === 'es'"
            @click="setLocale('es')"
          >
            ES
          </button>
          <button
            type="button"
            class="px-2 py-1 text-xs font-semibold transition-colors"
            :class="localeButtonClass('en')"
            :aria-pressed="locale === 'en'"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <label
            class="relative inline-flex items-center cursor-pointer"
            :aria-label="theme === 'light' ? t('themeToDark') : t('themeToLight')"
          >
            <input
              type="checkbox"
              class="sr-only peer"
              :checked="theme === 'dark'"
              @change="toggleTheme"
            />
            <div
              class="w-11 h-6 sm:w-14 sm:h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 sm:peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 sm:after:h-6 sm:after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </div>
      </div>
    </div>

    <div
      class="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md"
    >
      <p class="text-sm text-amber-800 dark:text-amber-200">
        <span class="font-semibold">{{ t("infoLabel") }}</span>
        {{ t("infoText") }}
      </p>
    </div>

    <div class="space-y-4">
      <InputWithSelector
        :label="t('pace')"
        :model-value="pace"
        :selected-unit="paceUnit"
        :placeholder="pacePlaceholder"
        :options="paceOptions"
        :is-visible="!!pace && pace.trim() !== ''"
        :clear-title="t('clearPace')"
        :input-classes="paceClasses"
        :is-calculated="calculatedField === 'pace'"
        :calculated-title="t('calculatedValue')"
        @update:model-value="val => (pace = val as string)"
        @update:selected-unit="val => (paceUnit = val as 'min' | 'sec')"
        @clear="clearPace"
      />

      <InputWithSelector
        :label="t('distance')"
        :model-value="distance"
        :selected-unit="distanceUnit"
        :placeholder="distancePlaceholder"
        :options="distanceOptions"
        input-type="number"
        :is-visible="distance !== null && distance !== undefined"
        :clear-title="t('clearDistance')"
        :input-classes="distanceClasses"
        :is-calculated="calculatedField === 'distance'"
        :calculated-title="t('calculatedValue')"
        @update:model-value="val => (distance = val as number | null)"
        @update:selected-unit="val => (distanceUnit = val as 'km' | 'm')"
        @clear="clearDistance"
      />

      <InputWithSelector
        :label="t('time')"
        :model-value="time"
        :selected-unit="timeUnit"
        :placeholder="timePlaceholder"
        :options="timeOptions"
        :is-visible="!!time && time.trim() !== ''"
        :clear-title="t('clearTime')"
        :input-classes="timeClasses"
        :is-calculated="calculatedField === 'time'"
        :calculated-title="t('calculatedValue')"
        @update:model-value="val => (time = val as string)"
        @update:selected-unit="val => (timeUnit = val as 'min' | 'sec' | 'hr')"
        @clear="clearTime"
      />

      <div
        v-if="isResultError"
        class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-red-800 dark:text-red-200 text-sm">{{ result }}</p>
      </div>

      <div class="flex gap-3 pt-2">
        <button
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="calculate"
        >
          {{ t("calculate") }}
        </button>
        <button
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          @click="clear"
        >
          {{ t("clear") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePaceCalculator } from "../composables/usePaceCalculator";
import { useTheme } from "../composables/useTheme";
import { useI18n } from "../composables/useI18n";
import type { Locale } from "../i18n/messages";
import InputWithSelector from "./InputWithSelector.vue";

const { theme, toggleTheme } = useTheme();
const { locale, t, setLocale } = useI18n();

const {
  pace,
  paceUnit,
  distance,
  distanceUnit,
  time,
  timeUnit,
  result,
  calculatedField,
  calculate,
  clear,
  clearPace,
  clearDistance,
  clearTime,
} = usePaceCalculator();

const BASE_INPUT_CLASSES =
  "w-full px-4 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white outline-none transition font-medium text-sm";
const NORMAL_INPUT_CLASSES = "border-gray-300 dark:border-gray-600";
const CALCULATED_INPUT_CLASSES =
  "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400 text-green-700 dark:text-green-300 shadow-green-100 dark:shadow-green-900/50 focus:ring-green-500 focus:border-green-600";

const getInputClasses = (field: "pace" | "distance" | "time") => {
  return computed(() => [
    BASE_INPUT_CLASSES,
    calculatedField.value === field ? CALCULATED_INPUT_CLASSES : NORMAL_INPUT_CLASSES,
  ]);
};

const paceClasses = getInputClasses("pace");
const distanceClasses = getInputClasses("distance");
const timeClasses = getInputClasses("time");

const pacePlaceholder = computed(() => (paceUnit.value === "min" ? "4:30.5" : "270.5"));
const distancePlaceholder = computed(() => (distanceUnit.value === "km" ? "0.4" : "400"));
const timePlaceholder = computed(() => {
  if (timeUnit.value === "sec") return "3000";
  if (timeUnit.value === "hr") return t("timePlaceholderHour");
  return t("timePlaceholderMin");
});

const isResultError = computed(() => {
  if (!result.value) return false;

  const filledFields = [
    pace.value && pace.value.trim() !== "",
    distance.value !== null && distance.value !== undefined,
    time.value && time.value.trim() !== "",
  ].filter(Boolean).length;

  return filledFields < 2 || (filledFields === 3 && calculatedField.value === null);
});

const paceOptions = computed(() => [
  { value: "min", label: "min" },
  { value: "sec", label: t("unitSec") },
]);

const distanceOptions = [
  { value: "m", label: "m" },
  { value: "km", label: "km" },
];

const timeOptions = computed(() => [
  { value: "min", label: "min" },
  { value: "sec", label: t("unitSec") },
  { value: "hr", label: t("unitHour") },
]);

const localeButtonClass = (value: Locale) => {
  return locale.value === value
    ? "bg-blue-600 text-white"
    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600";
};
</script>
