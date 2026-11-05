import type { Pergunta } from "../../tipos";

// H27 · Exposição de secret em produção
export const h027: Pergunta = {
  numero: 327,
  modulo: "hyring-advanced-scenarios",
  repeteA: 141,
  pt: {
    titulo: "Exposição de secret em produção",
    pergunta: "Como você depuraria a exposição de um secret em produção sem fazer suposições?",
  },
  en: {
    titulo: "Production secret exposure",
    pergunta: "How would you debug production secret exposure without guessing?",
  },
};
