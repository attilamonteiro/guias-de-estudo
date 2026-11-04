import type { Pergunta } from "../../tipos";

// L121 · Evitar bloqueios em produção
export const l121: Pergunta = {
  numero: 221,
  modulo: "linkedin-producao",
  repeteA: 130,
  pt: {
    titulo: "Evitar bloqueios em produção",
    pergunta: "Como você evita operações bloqueantes em produção?",
  },
  en: {
    titulo: "Avoiding blocking in production",
    pergunta: "How do you prevent blocking operations in production?",
  },
};
