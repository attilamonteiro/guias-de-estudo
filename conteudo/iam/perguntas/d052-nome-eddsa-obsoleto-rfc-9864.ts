import type { Pergunta } from "../../tipos";

// D52 · Nome EdDSA obsoleto (RFC 9864)
export const d052: Pergunta = {
  numero: 852,
  modulo: "secondtalent-jwt-what-changed-recently",
  repeteA: 71,
  pt: {
    titulo: "Nome EdDSA obsoleto (RFC 9864)",
    pergunta: "Por que a RFC 9864 tornou obsoleto o nome de algoritmo EdDSA?",
  },
  en: {
    titulo: "EdDSA name deprecated (RFC 9864)",
    pergunta: "Why did RFC 9864 deprecate the EdDSA algorithm name?",
  },
};
