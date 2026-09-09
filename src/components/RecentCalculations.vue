<template>
  <section v-if="entries.length" class="pt-1" :aria-labelledby="headingId">
    <h2 :id="headingId" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ t("recent") }}
    </h2>
    <ul class="space-y-2">
      <li v-for="item in items" :key="item.key">
        <button
          type="button"
          class="w-full rounded-md border border-gray-200 px-3 py-2 text-left text-sm text-gray-800 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
          :aria-label="`${t('useRecentCalculation')}: ${item.label}`"
          @click="emit('select', item.entry)"
        >
          {{ item.label }}
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import { historyEntryKey, type HistoryEntry } from "../domain/history";
import { formatHistoryEntry } from "../i18n/formatHistory";
import { useI18n } from "../composables/useI18n";

const props = defineProps<{
  entries: HistoryEntry[];
}>();

const emit = defineEmits<{
  select: [entry: HistoryEntry];
}>();

const { t } = useI18n();
const headingId = useId();

const items = computed(() =>
  props.entries.map(entry => ({
    entry,
    key: historyEntryKey(entry),
    label: formatHistoryEntry(entry, t),
  }))
);
</script>
