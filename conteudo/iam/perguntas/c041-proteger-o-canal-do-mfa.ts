import type { Pergunta } from "../../tipos";

// C41 · Proteger o canal do MFA
export const c041: Pergunta = {
  numero: 641,
  modulo: "climbtheladder-mfa",
  repeteA: 97,
  pt: {
    titulo: "Proteger o canal do MFA",
    pergunta: "Como você protegeria o canal de comunicação entre cliente e servidor durante o processo de MFA?",
  },
  en: {
    titulo: "Securing the MFA channel",
    pergunta: "How would you secure the communication channel between the client and server during the MFA process?",
  },
};
