import type { Pergunta } from "../../tipos";

// C20 · Segurança entre AS e RS
export const c020: Pergunta = {
  numero: 620,
  modulo: "climbtheladder-oauth-2-0",
  repeteA: 40,
  pt: {
    titulo: "Segurança entre AS e RS",
    pergunta: "Como você protegeria a comunicação entre o authorization server e o resource server?",
  },
  en: {
    titulo: "AS to RS communication security",
    pergunta: "How would you secure communication between the authorization server and resource server?",
  },
};
