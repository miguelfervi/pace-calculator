<template>
  <label class="block">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
      {{ label }}
    </span>
    <div class="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_5.5rem] items-stretch gap-2">
      <div class="relative min-w-0">
        <input
          :value="modelValue"
          type="text"
          inputmode="decimal"
          :placeholder="placeholder"
          :class="[inputClasses, isCalculated ? 'pr-16' : '', 'text-sm']"
          @input="handleInput"
        />
        <div
          v-if="isCalculated"
          class="absolute right-12 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400"
          :title="calculatedTitle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <ClearButton :visible="isVisible" :title="clearTitle" @click="emit('clear')" />
      </div>
      <select :value="selectedUnit" :class="SELECT_CLASSES" @change="handleUnitChange">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </label>
</template>

<script setup lang="ts" generic="T extends string">
import ClearButton from "./ClearButton.vue";

interface Option {
  value: T;
  label: string;
}

defineProps<{
  label: string;
  modelValue: string;
  selectedUnit: T;
  placeholder: string;
  options: Option[];
  isVisible: boolean;
  clearTitle: string;
  inputClasses: string | string[];
  isCalculated?: boolean;
  calculatedTitle?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:selectedUnit": [value: T];
  clear: [];
}>();

const SELECT_CLASSES =
  "h-full w-full min-w-0 px-1.5 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer outline-none transition font-medium text-sm";

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};

const handleUnitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:selectedUnit", target.value as T);
};
</script>
