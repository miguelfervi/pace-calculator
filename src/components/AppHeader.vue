<template>
  <header class="mb-5">
    <h1 class="text-lg font-bold leading-tight text-balance text-gray-800 dark:text-white">
      {{ t("title") }}
    </h1>
    <div class="mt-3 flex min-w-0 items-center justify-between gap-3">
      <div
        class="inline-flex shrink-0 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
        role="group"
        :aria-label="t('language')"
      >
        <button
          type="button"
          class="px-2.5 py-1 text-xs font-semibold transition-colors"
          :class="localeButtonClass('es')"
          :aria-pressed="locale === 'es'"
          @click="setLocale('es')"
        >
          ES
        </button>
        <button
          type="button"
          class="px-2.5 py-1 text-xs font-semibold transition-colors"
          :class="localeButtonClass('en')"
          :aria-pressed="locale === 'en'"
          @click="setLocale('en')"
        >
          EN
        </button>
      </div>
      <div class="flex items-center gap-1.5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <ThemeToggle />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 text-gray-600 dark:text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
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
  </header>
</template>

<script setup lang="ts">
import { useI18n } from "../composables/useI18n";
import type { Locale } from "../i18n/messages";
import ThemeToggle from "./ThemeToggle.vue";

const { locale, t, setLocale } = useI18n();

const localeButtonClass = (value: Locale) => {
  return locale.value === value
    ? "bg-blue-600 text-white"
    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600";
};
</script>
