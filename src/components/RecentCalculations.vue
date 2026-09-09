<template>
  <section
    v-if="entries.length"
    class="min-w-0 overflow-hidden rounded-lg bg-white px-4 py-3 shadow dark:bg-gray-800 sm:px-6"
    :aria-labelledby="headingId"
  >
    <div class="mb-1 flex items-baseline justify-between gap-2">
      <h2 :id="headingId" class="text-xs font-semibold text-gray-600 dark:text-gray-300">
        {{ t("recent") }}
      </h2>
      <p class="min-w-0 truncate text-xs text-gray-400 dark:text-gray-500">{{ t("recentHint") }}</p>
    </div>
    <ul>
      <li v-for="item in items" :key="item.key">
        <button
          type="button"
          class="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 py-2.5 text-left text-xs transition-colors hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-300"
          :aria-label="`${t('useRecentCalculation')}: ${item.label}`"
          @click="emit('select', item.entry)"
        >
          <span class="min-w-0 truncate text-gray-500 dark:text-gray-400">{{ item.inputs }}</span>
          <span class="flex shrink-0 items-center gap-1">
            <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">→</span>
            <span class="font-medium text-gray-800 dark:text-gray-100">{{ item.result }}</span>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, useId } from "vue";
import { historyEntryKey, type HistoryEntry } from "../domain/history";
import { formatHistoryParts } from "../i18n/formatHistory";
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
  props.entries.map(entry => {
    const parts = formatHistoryParts(entry, t);
    return {
      entry,
      key: historyEntryKey(entry),
      label: `${parts.inputs} → ${parts.result}`,
      inputs: parts.inputs,
      result: parts.result,
    };
  })
);
</script>
