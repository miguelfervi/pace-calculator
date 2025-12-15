import { ref } from "vue";
import { useTimeUtils } from "./useTimeUtils";

/**
 * Composable para la calculadora de ritmo
 * Maneja el estado y la lógica de cálculo
 */
export function usePaceCalculator() {
  const { timeToSeconds, secondsToTime, secondsToPace } = useTimeUtils();

  // Estado del formulario
  const pace = ref<string>("");
  const distance = ref<number | null>(null);
  const time = ref<string>("");
  const result = ref<string>("");

  /**
   * Calcula el valor faltante basado en los dos valores proporcionados
   */
  const calculate = (): void => {
    const filledValues = [
      pace.value,
      distance.value,
      time.value,
    ].filter(Boolean);

    if (filledValues.length !== 2) {
      result.value = "Introduce exactamente dos valores";
      return;
    }

    // Ritmo + distancia → tiempo
    if (pace.value && distance.value && !time.value) {
      const totalSeconds = timeToSeconds(pace.value) * distance.value;
      result.value = `Tiempo: ${secondsToTime(totalSeconds)}`;
      return;
    }

    // Distancia + tiempo → ritmo
    if (distance.value && time.value && !pace.value) {
      const paceInSeconds = timeToSeconds(time.value) / distance.value;
      result.value = `Ritmo: ${secondsToPace(paceInSeconds)} min/km`;
      return;
    }

    // Ritmo + tiempo → distancia
    if (pace.value && time.value && !distance.value) {
      const calculatedDistance =
        timeToSeconds(time.value) / timeToSeconds(pace.value);
      result.value = `Distancia: ${calculatedDistance.toFixed(2)} km`;
      return;
    }
  };

  /**
   * Limpia todos los campos del formulario
   */
  const clear = (): void => {
    pace.value = "";
    distance.value = null;
    time.value = "";
    result.value = "";
  };

  return {
    // Estado
    pace,
    distance,
    time,
    result,
    // Métodos
    calculate,
    clear,
  };
}

