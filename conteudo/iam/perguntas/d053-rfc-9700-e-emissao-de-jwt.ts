import type { Pergunta } from "../../tipos";

// D53 · RFC 9700 e emissão de JWT
export const d053: Pergunta = {
  numero: 853,
  modulo: "secondtalent-jwt-what-changed-recently",
  repeteA: 39,
  pt: {
    titulo: "RFC 9700 e emissão de JWT",
    pergunta: "O que a RFC 9700 exige de implantações OAuth que emitem JWTs?",
  },
  en: {
    titulo: "RFC 9700 and JWT issuance",
    pergunta: "What does RFC 9700 require of OAuth deployments that issue JWTs?",
  },
};
