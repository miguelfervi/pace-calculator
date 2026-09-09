import { createApp } from "vue";
import { inject } from "@vercel/analytics";
import "./style.css";
import App from "./App.vue";
import "./composables/useTheme";

inject();
createApp(App).mount("#app");
