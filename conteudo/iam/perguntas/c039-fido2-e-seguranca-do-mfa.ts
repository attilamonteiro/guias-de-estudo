import type { Pergunta } from "../../tipos";

// C39 · FIDO2 e segurança do MFA
export const c039: Pergunta = {
  numero: 639,
  modulo: "climbtheladder-mfa",
  repeteA: 92,
  pt: {
    titulo: "FIDO2 e segurança do MFA",
    pergunta: "O que é FIDO2 e como ele melhora a segurança do MFA?",
  },
  en: {
    titulo: "FIDO2 and MFA security",
    pergunta: "What is FIDO2 and how does it enhance MFA security?",
  },
};
