<template>
  <button
    v-if="visible"
    type="button"
    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1 rounded"
    :title="title"
    :aria-label="ariaLabelValue"
    @click="onClick"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  visible: boolean;
  onClick: () => void;
  title: string;
  ariaLabel?: string;
  // eslint-disable-next-line vue/prop-name-casing
  "aria-label"?: string;
}

const props = defineProps<Props>();

const ariaLabelValue = computed(() => props.ariaLabel || props["aria-label"] || "");
</script>
