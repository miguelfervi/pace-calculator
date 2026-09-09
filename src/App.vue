<template>
  <div
    class="flex min-h-screen w-full flex-col items-center justify-start bg-gray-50 px-3 py-4 dark:bg-gray-900 sm:px-4 sm:py-8"
  >
    <Calculator />
  </div>
</template>

<script setup lang="ts">
import { inject } from "@vercel/analytics";
import Calculator from "./components/Calculator.vue";

// Initialize Vercel Web Analytics
inject();
</script>
