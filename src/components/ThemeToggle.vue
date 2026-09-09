<template>
  <button
    type="button"
    role="switch"
    class="relative inline-flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
    :aria-checked="theme === 'dark'"
    :aria-label="theme === 'light' ? t('themeToDark') : t('themeToLight')"
    @click="toggleTheme"
  >
    <span
      class="h-6 w-11 rounded-full transition-colors"
      :class="theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'"
    ></span>
    <span
      class="absolute top-[2px] left-[2px] h-5 w-5 rounded-full border border-gray-300 bg-white transition-transform dark:border-gray-600"
      :class="theme === 'dark' ? 'translate-x-5' : ''"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from "../composables/useTheme";
import { useI18n } from "../composables/useI18n";

const { theme, toggleTheme } = useTheme();
const { t } = useI18n();
</script>
