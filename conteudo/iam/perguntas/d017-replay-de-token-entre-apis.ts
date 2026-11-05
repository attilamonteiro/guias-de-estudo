import type { Pergunta } from "../../tipos";

// D17 · Replay de token entre APIs
export const d017: Pergunta = {
  numero: 817,
  modulo: "secondtalent-oauth-2-0-tokens-access-refresh-id",
  repeteA: 130,
  pt: {
    titulo: "Replay de token entre APIs",
    pergunta: "Como impedir que um token emitido para uma API seja reaproveitado (replay) em outra?",
  },
  en: {
    titulo: "Cross-API token replay",
    pergunta: "How do you stop a token issued for one API being replayed at another?",
  },
};
