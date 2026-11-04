import type { Pergunta } from "../../tipos";

// G91 · Eventos em ciclo com nextTick
export const g091: Pergunta = {
  numero: 691,
  modulo: "gist-codigo",
  repeteA: 689,
  pt: {
    titulo: "Eventos em ciclo com nextTick",
    pergunta:
      "O que vai acontecer quando este código for executado? O mesmo ciclo de três eventos, mas cada listener emite o próximo evento dentro de process.nextTick.",
  },
  en: {
    titulo: "Cyclic events with nextTick",
    pergunta:
      "What will happen when that code will be executed? The same cycle of three events, but each listener emits the next event inside process.nextTick.",
  },
};
