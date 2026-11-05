import type { Pergunta } from "../../tipos";

// C33 · PKCE no Authorization Code Flow
export const c033: Pergunta = {
  numero: 633,
  modulo: "climbtheladder-openid-connect",
  repeteA: 28,
  pt: {
    titulo: "PKCE no Authorization Code Flow",
    pergunta: "Explique o papel do PKCE (Proof Key for Code Exchange) na proteção do Authorization Code Flow.",
  },
  en: {
    titulo: "PKCE in Authorization Code Flow",
    pergunta: "Explain the role of PKCE (Proof Key for Code Exchange) in securing the Authorization Code Flow.",
  },
};
