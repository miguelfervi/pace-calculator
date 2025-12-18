<template>
  <div class="max-w-md mx-auto mt-0 pt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6"
    >
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
        Calculadora de Ritmo
      </h1>
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
          :aria-label="theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'"
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

    <div
      class="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md"
    >
      <p class="text-sm text-amber-800 dark:text-amber-200">
        <span class="font-semibold">💡 Información:</span> Asegúrate de seleccionar la unidad antes
        de introducir el valor en cada campo.
      </p>
    </div>

    <div class="space-y-4">
      <InputWithSelector
        label="Ritmo"
        :model-value="pace"
        :selected-unit="paceUnit"
        :placeholder="pacePlaceholder"
        :options="paceOptions"
        :is-visible="!!pace && pace.trim() !== ''"
        clear-title="Limpiar ritmo"
        :input-classes="paceClasses"
        @update:model-value="val => (pace = val as string)"
        @update:selected-unit="val => (paceUnit = val as 'min' | 'sec')"
        @clear="clearPace"
      />

      <InputWithSelector
        label="Distancia"
        :model-value="distance"
        :selected-unit="distanceUnit"
        :placeholder="distancePlaceholder"
        :options="distanceOptions"
        input-type="number"
        :is-visible="distance !== null && distance !== undefined"
        clear-title="Limpiar distancia"
        :input-classes="distanceClasses"
        @update:model-value="val => (distance = val as number | null)"
        @update:selected-unit="val => (distanceUnit = val as 'km' | 'm')"
        @clear="clearDistance"
      />

      <InputWithSelector
        label="Tiempo total"
        :model-value="time"
        :selected-unit="timeUnit"
        :placeholder="timePlaceholder"
        :options="timeOptions"
        :is-visible="!!time && time.trim() !== ''"
        clear-title="Limpiar tiempo"
        :input-classes="timeClasses"
        @update:model-value="val => (time = val as string)"
        @update:selected-unit="val => (timeUnit = val as 'min' | 'sec')"
        @clear="clearTime"
      />

      <div class="flex gap-3 pt-2">
        <button
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          @click="calculate"
        >
          Calcular
        </button>
        <button
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          @click="clear"
        >
          Limpiar
        </button>
      </div>

      <div
        v-if="result"
        class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md"
      >
        <p class="text-blue-800 dark:text-blue-200 font-medium">{{ result }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePaceCalculator } from "../composables/usePaceCalculator";
import { useTheme } from "../composables/useTheme";
import InputWithSelector from "./InputWithSelector.vue";

const { theme, toggleTheme } = useTheme();

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
  "w-full px-4 pr-10 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white outline-none transition";
const NORMAL_INPUT_CLASSES = "border-gray-300 dark:border-gray-600";
const CALCULATED_INPUT_CLASSES =
  "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400";

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
const timePlaceholder = computed(() => (timeUnit.value === "min" ? "50 o 50:00" : "3000"));

const paceOptions = [
  { value: "min", label: "min" },
  { value: "sec", label: "seg" },
];

const distanceOptions = [
  { value: "m", label: "m" },
  { value: "km", label: "km" },
];

const timeOptions = [
  { value: "min", label: "min" },
  { value: "sec", label: "seg" },
];
</script>
