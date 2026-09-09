import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/",
  test: {
    environment: "happy-dom",
    setupFiles: ["src/__tests__/setup.ts"],
  },
});
