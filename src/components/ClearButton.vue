<template>
  <button
    v-if="visible"
    type="button"
    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 transition-colors p-1 rounded"
    :title="title"
    :aria-label="title"
    @click="emit('click')"
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  title: string;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>
