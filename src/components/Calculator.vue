<template>
  <div class="card">
    <label>
      Ritmo (min/km)
      <input v-model="pace" placeholder="4:30" />
    </label>

    <label>
      Distancia (km)
      <input v-model.number="distance" placeholder="0.4" />
    </label>

    <label>
      Tiempo total
      <input v-model="time" placeholder="0:50:00" />
    </label>

    <button @click="calculate">Calcular</button>
    <button class="secondary" @click="clear">Limpiar</button>

    <p v-if="result">{{ result }}</p>
  </div>
</template>

<script setup lang="ts">
import { usePaceCalculator } from "../composables/usePaceCalculator";

// Usar el composable para obtener el estado y métodos
const {
  pace,
  distance,
  time,
  result,
  calculate,
  clear,
} = usePaceCalculator();
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
}

button {
  padding: 0.6rem;
  font-size: 1rem;
  cursor: pointer;
}

.secondary {
  background: #eee;
}
</style>
