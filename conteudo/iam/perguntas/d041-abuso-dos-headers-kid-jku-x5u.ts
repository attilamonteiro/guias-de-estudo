import type { Pergunta } from "../../tipos";

// D41 · Abuso dos headers kid, jku, x5u
export const d041: Pergunta = {
  numero: 841,
  modulo: "secondtalent-jwt-validation",
  repeteA: 133,
  pt: {
    titulo: "Abuso dos headers kid, jku, x5u",
    pergunta: "Como os headers kid, jku e x5u podem ser abusados?",
  },
  en: {
    titulo: "Abuse of kid, jku, x5u headers",
    pergunta: "How can the kid, jku and x5u headers be abused?",
  },
};
