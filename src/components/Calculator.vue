<template>
  <div class="w-full max-w-md mx-auto space-y-3">
    <div class="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800 sm:p-6">
      <AppHeader />

      <div
        class="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20"
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
          :unit-aria-label="t('paceUnitAria')"
          :input-classes="paceClasses"
          :input-mode="paceUnit === 'sec' ? 'decimal' : 'text'"
          :is-calculated="calculatedField === 'pace'"
          :calculated-title="t('calculatedValue')"
          @update:model-value="val => (pace = val)"
          @update:selected-unit="changePaceUnit"
          @clear="clearPace"
        />

        <InputWithSelector
          :label="t('distance')"
          :model-value="distance"
          :selected-unit="distanceUnit"
          :placeholder="distancePlaceholder"
          :options="distanceOptions"
          :is-visible="distance.trim() !== ''"
          :clear-title="t('clearDistance')"
          :unit-aria-label="t('distanceUnitAria')"
          :input-classes="distanceClasses"
          input-mode="decimal"
          :is-calculated="calculatedField === 'distance'"
          :calculated-title="t('calculatedValue')"
          @update:model-value="val => (distance = val)"
          @update:selected-unit="changeDistanceUnit"
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
          :unit-aria-label="t('timeUnitAria')"
          :input-classes="timeClasses"
          :input-mode="timeUnit === 'sec' ? 'decimal' : 'text'"
          :is-calculated="calculatedField === 'time'"
          :calculated-title="t('calculatedValue')"
          @update:model-value="setTime"
          @update:selected-unit="changeTimeUnit"
          @clear="clearTime"
        />

        <div
          v-if="outcome.kind === 'error'"
          class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start gap-2"
          role="alert"
          aria-live="polite"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-red-800 dark:text-red-200 text-sm">{{ resultMessage }}</p>
        </div>

        <p v-else-if="resultMessage" class="sr-only" aria-live="polite">{{ resultMessage }}</p>

        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            @click="calculate"
          >
            {{ t("calculate") }}
          </button>
          <button
            type="button"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            @click="clear"
          >
            {{ t("clear") }}
          </button>
        </div>
      </div>
    </div>

    <RecentCalculations :entries="recentCalculations" @select="applyHistory" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePaceCalculator } from "../composables/usePaceCalculator";
import { useI18n } from "../composables/useI18n";
import { formatOutcome } from "../i18n/formatOutcome";
import type { DistanceUnit, PaceUnit, TimeUnit } from "../domain/types";
import AppHeader from "./AppHeader.vue";
import InputWithSelector from "./InputWithSelector.vue";
import RecentCalculations from "./RecentCalculations.vue";

const { t } = useI18n();

const {
  pace,
  paceUnit,
  distance,
  distanceUnit,
  time,
  timeUnit,
  outcome,
  calculatedField,
  calculate,
  clear,
  clearPace,
  clearDistance,
  clearTime,
  changePaceUnit,
  changeTimeUnit,
  changeDistanceUnit,
  setTime,
  applyHistory,
  recentCalculations,
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

const pacePlaceholder = computed(() => {
  return paceUnit.value === "min" ? "4:30.5" : "270.5";
});
const distancePlaceholder = computed(() => {
  if (distanceUnit.value === "km") return "5";
  if (distanceUnit.value === "mi") return "3.1";
  if (distanceUnit.value === "yd") return "400";
  return "400";
});
const timePlaceholder = computed(() => {
  if (timeUnit.value === "sec") return "3000";
  if (timeUnit.value === "hr") return t("timePlaceholderHour");
  return t("timePlaceholderMin");
});

const resultMessage = computed(() => formatOutcome(outcome.value, t));

const paceOptions = computed(() => {
  const options: { value: PaceUnit; label: string }[] = [
    { value: "min", label: "min" },
    { value: "sec", label: t("unitSec") },
  ];
  return options;
});

const distanceOptions = computed(() => {
  const options: { value: DistanceUnit; label: string }[] = [
    { value: "m", label: t("distanceUnitM") },
    { value: "km", label: t("distanceUnitKm") },
    { value: "yd", label: t("distanceUnitYd") },
    { value: "mi", label: t("distanceUnitMi") },
  ];
  return options;
});

const timeOptions = computed(() => {
  const options: { value: TimeUnit; label: string }[] = [
    { value: "min", label: "min" },
    { value: "sec", label: t("unitSec") },
    { value: "hr", label: t("unitHour") },
  ];
  return options;
});
</script>
