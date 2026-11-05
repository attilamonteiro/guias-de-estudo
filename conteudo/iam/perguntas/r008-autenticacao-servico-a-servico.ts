import type { Pergunta } from "../../tipos";

// R08 · Autenticação serviço a serviço
export const r008: Pergunta = {
  numero: 508,
  modulo: "prachub-oauth-and-openid-connect",
  repeteA: 14,
  pt: {
    titulo: "Autenticação serviço a serviço",
    pergunta: "Como você autentica o tráfego serviço a serviço?",
  },
  en: {
    titulo: "Service-to-service authentication",
    pergunta: "How do you authenticate service-to-service traffic?",
  },
};
