import type { Pergunta } from "../../tipos";

// R09 · Proteger contra injeção SQL
export const r09: Pergunta = {
  numero: 109,
  modulo: "roadmap-iniciante",
  repeteA: 17,
  pt: {
    titulo: "Proteger contra injeção SQL",
    pergunta: "Como você protege um servidor contra ataques de injeção SQL?",
  },
  en: {
    titulo: "Protecting against SQL injection",
    pergunta: "How do you protect a server from SQL injection attacks?",
  },
};
