import type { Guia } from "../tipos";
import { perguntas } from "./perguntas";

export const nodejs: Guia = {
  id: "nodejs",
  detalhe: "61 perguntas · PT/EN",
  textos: {
    pt: {
      nome: "Guia de Node.js",
      chamada:
        "Perguntas de entrevista sobre Node.js (event loop, módulos, npm, streams, cluster, segurança), do básico ao avançado, cada uma com o método de explicação mais adequado, armadilhas e autoteste.",
      titulo: "Node.js, do básico ao avançado.",
      introducao:
        "61 perguntas de entrevista sobre Node.js, em três níveis, cada uma explicada com o método que mais combina com ela. Onde várias perguntas pedem a mesma coisa, a explicação é a mesma e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
    },
    en: {
      nome: "Node.js Guide",
      chamada:
        "Node.js interview questions (event loop, modules, npm, streams, cluster, security), from basic to advanced, each with the best-fitting explanation method, pitfalls and a self-test.",
      titulo: "Node.js, from basics to advanced.",
      introducao:
        "61 Node.js interview questions, in three levels, each explained with the method that fits it best. Where several questions ask for the same thing, the explanation is the same and progress counts once. Mark what you already own and drill only the rest.",
    },
  },
  fontes: [
    {
      id: "turing",
      marca: "T",
      titulo: { pt: "Turing · 61 perguntas", en: "Turing · 61 questions" },
      descricao: {
        pt: "Perguntas de turing.com/pt/interview-questions/node-js, respondidas aqui com explicações próprias, em três níveis. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= Q”). Alguns enunciados da fonte são imprecisos ou partem de premissas incorretas; a explicação os corrige com cuidado.",
        en: "Questions from turing.com/pt/interview-questions/node-js, answered here with original explanations, in three levels. The ones that repeat another question of the guide reuse the same explanation (tag “= Q”). Some of the source’s wordings are imprecise or rest on incorrect premises; the explanation corrects them gently.",
      },
      url: "https://www.turing.com/pt/interview-questions/node-js",
    },
  ],
  modulos: [
    {
      id: "turing-basicas",
      letra: "",
      origem: "turing",
      nome: { pt: "Turing · Básico", en: "Turing · Basic" },
    },
    {
      id: "turing-intermediarias",
      letra: "",
      origem: "turing",
      nome: { pt: "Turing · Intermediário", en: "Turing · Intermediate" },
    },
    {
      id: "turing-avancadas",
      letra: "",
      origem: "turing",
      nome: { pt: "Turing · Avançado", en: "Turing · Advanced" },
    },
  ],
  perguntas,
};
