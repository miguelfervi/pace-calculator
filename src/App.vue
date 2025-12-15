<template>
  <div class="card">
    <label>
      Pace (min/km)
      <input v-model="pace" placeholder="4:30" />
    </label>

    <label>
      Distance (km)
      <input v-model.number="distance" placeholder="0.4" />
    </label>

    <label>
      Total Time
      <input v-model="time" placeholder="0:50:00" />
    </label>

    <button @click="calculate">Calculate</button>
    <button class="secondary" @click="reset">Reset</button>

    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Typed state
const pace = ref<string>("");
const distance = ref<number | null>(null);
const time = ref<string>("");
const result = ref<string>("");

// Helpers
const timeToSeconds = (value: string): number => {
  const parts: number[] = value.split(":").map(Number);

  // mm:ss
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  // hh:mm:ss
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
};

const secondsToTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);

  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const secondsToPace = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);

  return `${m}:${String(s).padStart(2, "0")}`;
};

// Main logic
const calculate = (): void => {
  const filledFields = [pace.value, distance.value, time.value].filter(Boolean);

  if (filledFields.length !== 2) {
    result.value = "Please enter exactly two values";
    return;
  }

  // Pace + distance → time
  if (pace.value && distance.value && !time.value) {
    const totalSeconds = timeToSeconds(pace.value) * distance.value;
    result.value = `Time: ${secondsToTime(totalSeconds)}`;
  }
}

</script>
