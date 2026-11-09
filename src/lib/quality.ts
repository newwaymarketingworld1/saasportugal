import {
  MIN_ANSWER_LENGTH,
  QUALITY_EXCELLENT_AT,
  QUALITY_GOOD_AT,
} from "./constants";

export type Quality = {
  /** 0 = insuficiente, 1 = básica, 2 = boa, 3 = excelente */
  level: 0 | 1 | 2 | 3;
  label: string;
  hint: string;
};

export function getQuality(length: number): Quality {
  if (length < MIN_ANSWER_LENGTH) {
    return {
      level: 0,
      label: "Insuficiente",
      hint: `Escreva pelo menos ${MIN_ANSWER_LENGTH} caracteres para poder enviar.`,
    };
  }
  if (length < QUALITY_GOOD_AT) {
    return {
      level: 1,
      label: "Básica",
      hint: "Já dá para enviar, mas quanto mais detalhes, melhor será a sua IA.",
    };
  }
  if (length < QUALITY_EXCELLENT_AT) {
    return {
      level: 2,
      label: "Boa",
      hint: "Bom caminho! Inclua preços, horários e perguntas frequentes para chegar ao nível máximo.",
    };
  }
  return {
    level: 3,
    label: "Excelente",
    hint: "Descrição completa. Sua IA terá muito conteúdo para atender bem.",
  };
}
