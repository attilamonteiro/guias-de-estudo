import type { Pergunta } from "../../tipos";

// L137 · Cenário 5: 100 mil requisições por minuto
export const l137: Pergunta = {
  numero: 237,
  modulo: "linkedin-cenarios",
  repeteA: 50,
  pt: {
    titulo: "Cenário 5: 100 mil requisições por minuto",
    pergunta: "Cenário 5: sua aplicação recebe 100 mil requisições por minuto. Como você a escalaria?",
  },
  en: {
    titulo: "Scenario 5: 100K requests per minute",
    pergunta: "Scenario 5: Your application receives 100K requests per minute. How would you scale it?",
  },
};
