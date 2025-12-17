<template>
  <div class="max-w-md mx-auto mt-0 pt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
      Calculadora de Ritmo
    </h1>

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
import InputWithSelector from "./InputWithSelector.vue";

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
