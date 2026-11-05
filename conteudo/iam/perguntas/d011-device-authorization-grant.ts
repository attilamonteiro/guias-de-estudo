import type { Pergunta } from "../../tipos";

// D11 · Device authorization grant
export const d011: Pergunta = {
  numero: 811,
  modulo: "secondtalent-oauth-2-0-grant-types-and-flows",
  repeteA: 32,
  pt: {
    titulo: "Device authorization grant",
    pergunta: "Como funciona o device authorization grant e como ele é atacado?",
  },
  en: {
    titulo: "Device authorization grant",
    pergunta: "How does the device authorization grant work, and how is it attacked?",
  },
};
