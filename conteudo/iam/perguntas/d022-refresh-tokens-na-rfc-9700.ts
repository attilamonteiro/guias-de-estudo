import type { Pergunta } from "../../tipos";

// D22 · Refresh tokens na RFC 9700
export const d022: Pergunta = {
  numero: 822,
  modulo: "secondtalent-oauth-2-0-security-best-practices",
  repeteA: 34,
  pt: {
    titulo: "Refresh tokens na RFC 9700",
    pergunta: "O que a RFC 9700 exige para refresh tokens emitidos a clients públicos?",
  },
  en: {
    titulo: "RFC 9700 refresh token rules",
    pergunta: "What does RFC 9700 require for refresh tokens issued to public clients?",
  },
};
