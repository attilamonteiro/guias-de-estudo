import type { Pergunta } from "../../tipos";

// G90 · Eventos em ciclo com setImmediate
export const g090: Pergunta = {
  numero: 690,
  modulo: "gist-codigo",
  repeteA: 689,
  pt: {
    titulo: "Eventos em ciclo com setImmediate",
    pergunta:
      "Explique o resultado desta execução de código: o mesmo ciclo de três eventos, mas cada listener emite o próximo evento dentro de um setImmediate.",
  },
  en: {
    titulo: "Cyclic events with setImmediate",
    pergunta:
      "Explain the result of this code execution: the same cycle of three events, but each listener emits the next event inside a setImmediate.",
  },
};
