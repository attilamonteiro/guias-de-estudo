import type { Pergunta } from "../../tipos";

// W80 · Validação contínua de confiança
export const w080: Pergunta = {
  numero: 1280,
  modulo: "wecreateproblems-zero-trust-experienced",
  repeteA: 123,
  pt: {
    titulo: "Validação contínua de confiança",
    pergunta: "Como você valida continuamente a confiança entre dispositivos e usuários?",
  },
  en: {
    titulo: "Continuous trust validation",
    pergunta: "How do you continuously validate trust across devices and users?",
  },
};
