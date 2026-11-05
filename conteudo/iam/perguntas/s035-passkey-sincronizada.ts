import type { Pergunta } from "../../tipos";

// S35 · Passkey sincronizada
export const s035: Pergunta = {
  numero: 735,
  modulo: "securityscientist-passkeys",
  repeteA: 95,
  pt: {
    titulo: "Passkey sincronizada",
    pergunta: "Atacantes conseguem contornar passkeys sincronizadas?",
  },
  en: {
    titulo: "Synced passkey bypass",
    pergunta: "Can attackers bypass synced passkeys?",
  },
};
