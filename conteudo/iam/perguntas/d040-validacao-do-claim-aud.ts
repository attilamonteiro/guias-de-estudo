import type { Pergunta } from "../../tipos";

// D40 · Validação do claim aud
export const d040: Pergunta = {
  numero: 840,
  modulo: "secondtalent-jwt-validation",
  repeteA: 72,
  pt: {
    titulo: "Validação do claim aud",
    pergunta: "Por que é preciso validar o claim aud?",
  },
  en: {
    titulo: "Validating the aud claim",
    pergunta: "Why must you validate the aud claim?",
  },
};
