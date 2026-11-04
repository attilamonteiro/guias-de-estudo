import type { Pergunta } from "../../tipos";

// C28 · Cluster e núcleos de CPU
export const c028: Pergunta = {
  numero: 528,
  modulo: "coderpad-senior",
  repeteA: 45,
  pt: {
    titulo: "Cluster e núcleos de CPU",
    pergunta:
      "Explique o conceito do módulo cluster no Node.js e como ele ajuda a escalar aplicações em vários núcleos de CPU. Dê um exemplo de uso do módulo cluster para criar um cluster de processos worker.",
  },
  en: {
    titulo: "Cluster and CPU cores",
    pergunta:
      "Explain the concept of the cluster module in Node.js and how it helps in scaling applications across multiple CPU cores. Provide an example of using the cluster module to create a cluster of worker processes.",
  },
};
