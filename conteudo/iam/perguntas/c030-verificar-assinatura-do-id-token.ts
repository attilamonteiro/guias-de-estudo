import type { Pergunta } from "../../tipos";

// C30 · Verificar assinatura do ID Token
export const c030: Pergunta = {
  numero: 630,
  modulo: "climbtheladder-openid-connect",
  repeteA: 48,
  pt: {
    titulo: "Verificar assinatura do ID Token",
    pergunta:
      "Escreva uma função para decodificar e verificar a assinatura de um JWT ID Token usando uma chave pública.",
  },
  en: {
    titulo: "Verifying an ID Token signature",
    pergunta: "Write a function to decode and verify the signature of a JWT ID Token using a public key.",
  },
};
