import type { Pergunta } from "../../tipos";

// C43 · Backup e recuperação de MFA
export const c043: Pergunta = {
  numero: 643,
  modulo: "climbtheladder-mfa",
  repeteA: 100,
  pt: {
    titulo: "Backup e recuperação de MFA",
    pergunta: "Que métodos de backup você recomendaria para recuperação de conta caso o método principal de MFA falhe?",
  },
  en: {
    titulo: "MFA backup and recovery",
    pergunta: "What backup methods would you recommend for account recovery in case the primary MFA method fails?",
  },
};
