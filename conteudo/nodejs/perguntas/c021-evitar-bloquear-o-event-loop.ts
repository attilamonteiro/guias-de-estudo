import type { Pergunta } from "../../tipos";

// C21 · Evitar bloquear o event loop
export const c021: Pergunta = {
  numero: 521,
  modulo: "coderpad-senior",
  repeteA: 28,
  pt: {
    titulo: "Evitar bloquear o event loop",
    pergunta:
      "Explique o conceito do event loop no Node.js e como ele viabiliza a E/S não bloqueante. Como os desenvolvedores podem evitar bloquear o event loop?",
  },
  en: {
    titulo: "Not blocking the loop",
    pergunta:
      "Explain the concept of the event loop in Node.js and how it enables non-blocking I/O operations. How can developers avoid blocking the event loop?",
  },
};
