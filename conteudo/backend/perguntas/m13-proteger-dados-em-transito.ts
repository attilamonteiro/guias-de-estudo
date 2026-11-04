import type { Pergunta } from "../../tipos";

// M13 · Proteger dados em trânsito
export const m13: Pergunta = {
  numero: 213,
  modulo: "mentorcruise",
  repeteA: 123,
  pt: {
    titulo: "Proteger dados em trânsito",
    pergunta: "Como você protegeria a transmissão de dados entre cliente e servidor?",
  },
  en: {
    titulo: "Securing data in transit",
    pergunta: "How would you secure data transmission between client and server?",
  },
};
