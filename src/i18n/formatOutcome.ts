import type { MessageKey } from "../i18n/messages";
import type { CalculatorOutcome } from "../domain/types";

type Translate = (key: MessageKey) => string;

export const formatOutcome = (outcome: CalculatorOutcome, t: Translate): string => {
  if (outcome.kind === "empty") return "";

  if (outcome.kind === "error") {
    return outcome.code === "needTwoValues" ? t("errorTwoValues") : t("errorCalculation");
  }

  if (outcome.kind === "time") {
    const unitLabel =
      outcome.unit === "sec" ? t("timeUnitSec") : outcome.unit === "hr" ? t("timeUnitHour") : "";
    return `${t("resultTime")}: ${outcome.formatted} ${unitLabel}`.trim();
  }

  if (outcome.kind === "pace") {
    const unitLabel = outcome.unit === "sec" ? t("paceUnitSecKm") : t("paceUnitMinKm");
    return `${t("resultPace")}: ${outcome.formatted} ${unitLabel}`;
  }

  return `${t("resultDistance")}: ${outcome.formatted}`;
};
