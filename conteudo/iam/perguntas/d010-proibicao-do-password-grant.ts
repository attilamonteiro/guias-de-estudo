import type { Pergunta } from "../../tipos";

// D10 · Proibição do password grant
export const d010: Pergunta = {
  numero: 810,
  modulo: "secondtalent-oauth-2-0-grant-types-and-flows",
  repeteA: 33,
  pt: {
    titulo: "Proibição do password grant",
    pergunta: "Por que o resource owner password credentials grant não deve ser usado?",
  },
  en: {
    titulo: "Password grant must not be used",
    pergunta: "Why must the resource owner password credentials grant not be used?",
  },
};
