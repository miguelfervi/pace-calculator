<template>
  <div class="max-w-md mx-auto mt-0 pt-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
      Calculadora de Ritmo
    </h1>
    
    <div class="space-y-4">
      <label class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Ritmo (min/km)
        </span>
        <input
          v-model="pace"
          placeholder="4:30.5"
          :class="paceClasses"
        />
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Distancia
        </span>
        <div class="flex gap-2">
          <input
            v-model.number="distance"
            :placeholder="distanceUnit === 'km' ? '0.4' : '400'"
            :class="distanceClasses"
          />
          <select
            v-model="distanceUnit"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer outline-none transition"
          >
            <option value="m">m</option>
            <option value="km">km</option>
          </select>
        </div>
      </label>

      <label class="block">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Tiempo total
        </span>
        <input
          v-model="time"
          placeholder="0:50:00"
          :class="timeClasses"
        />
      </label>

      <div class="flex gap-3 pt-2">
        <button
          @click="calculate"
          class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calcular
        </button>
        <button
          @click="clear"
          class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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

const {
  pace,
  distance,
  distanceUnit,
  time,
  result,
  calculatedField,
  calculate,
  clear,
} = usePaceCalculator();

const baseInputClasses = "w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white outline-none transition";
const normalInputClasses = "border-gray-300 dark:border-gray-600";
const calculatedInputClasses = "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400";

const paceClasses = computed(() => [
  baseInputClasses,
  calculatedField.value === "pace" ? calculatedInputClasses : normalInputClasses,
]);

const distanceClasses = computed(() => [
  "flex-1",
  baseInputClasses,
  calculatedField.value === "distance" ? calculatedInputClasses : normalInputClasses,
]);

const timeClasses = computed(() => [
  baseInputClasses,
  calculatedField.value === "time" ? calculatedInputClasses : normalInputClasses,
]);
</script>

