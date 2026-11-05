import type { Pergunta } from "../../tipos";

// D50 · Tratar access token expirado
export const d050: Pergunta = {
  numero: 850,
  modulo: "secondtalent-jwt-storing-tokens",
  repeteA: 34,
  pt: {
    titulo: "Tratar access token expirado",
    pergunta: "Como um client deve tratar um access token expirado?",
  },
  en: {
    titulo: "Handling expired access tokens",
    pergunta: "How should a client handle an expired access token?",
  },
};
