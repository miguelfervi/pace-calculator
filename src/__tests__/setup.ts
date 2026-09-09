import { useI18n } from "../composables/useI18n";
import { resetCalculationHistory } from "../composables/useCalculationHistory";

const { setLocale } = useI18n();
setLocale("es");
resetCalculationHistory();
