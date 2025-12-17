<template>
  <label class="block">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
      {{ label }}
    </span>
    <div class="flex gap-2">
      <div class="relative flex-1">
        <input
          :value="displayValue"
          :type="inputType"
          :placeholder="placeholder"
          :class="[inputClasses, inputType === 'number' ? 'no-spinner' : '']"
          @input="handleInput"
        />
        <ClearButton
          :visible="isVisible"
          :on-click="handleClear"
          :title="clearTitle"
          :aria-label="clearTitle"
        />
      </div>
      <select :value="selectedUnit" :class="SELECT_CLASSES" @change="handleUnitChange">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ClearButton from "./ClearButton.vue";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  modelValue: string | number | null;
  selectedUnit: string;
  placeholder: string;
  options: Option[];
  inputType?: "text" | "number";
  isVisible: boolean;
  clearTitle: string;
  inputClasses: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  inputType: "text",
});

const emit = defineEmits<{
  "update:modelValue": [value: string | number | null];
  "update:selectedUnit": [value: string];
  clear: [];
}>();

const SELECT_CLASSES =
  "px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white cursor-pointer outline-none transition";

const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) {
    return "";
  }
  return String(props.modelValue);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = props.inputType === "number" ? Number(target.value) : target.value;
  emit("update:modelValue", value);
};

const handleUnitChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:selectedUnit", target.value);
};

const handleClear = () => {
  emit("clear");
};
</script>

<style scoped>
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.no-spinner {
  -moz-appearance: textfield;
}
</style>
