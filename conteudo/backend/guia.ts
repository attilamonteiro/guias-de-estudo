import type { Guia } from "../tipos";
import { perguntas } from "./perguntas";

export const backend: Guia = {
  id: "backend",
  detalhe: "120 perguntas · PT/EN",
  textos: {
    pt: {
      nome: "Guia de Backend",
      chamada:
        "Perguntas de entrevista de backend (arquitetura, bancos, cache, segurança, sistemas distribuídos), cada uma com o método de explicação mais adequado, armadilhas e autoteste.",
      titulo: "Entenda de verdade, uma vez só.",
      introducao:
        "30 perguntas de entrevista de backend mais 50 do roadmap.sh e 40 da MentorCruise, cada uma explicada com o método que mais combina com ela. Onde as listas coincidem, a explicação é a mesma e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
    },
    en: {
      nome: "Backend Guide",
      chamada:
        "Backend interview questions (architecture, databases, caching, security, distributed systems), each with the best-fitting explanation method, pitfalls and a self-test.",
      titulo: "Understand it properly, once.",
      introducao:
        "30 backend interview questions plus 50 from roadmap.sh and 40 from MentorCruise, each explained with the method that fits it best. Where the lists overlap, the explanation is the same and progress counts once. Mark what you already own and drill only the rest.",
    },
  },
  fontes: [
    {
      id: "lista",
      marca: "Q",
      base: 0,
      titulo: { pt: "Lista original · 30 perguntas", en: "Original list · 30 questions" },
    },
    {
      id: "roadmap",
      marca: "R",
      base: 100,
      titulo: { pt: "roadmap.sh · 50 perguntas", en: "roadmap.sh · 50 questions" },
      descricao: {
        pt: "Perguntas de roadmap.sh/questions/backend, respondidas aqui com explicações próprias. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= Q”).",
        en: "Questions from roadmap.sh/questions/backend, answered here with original explanations. The ones that repeat another question of the guide reuse the same explanation (tag “= Q”).",
      },
      url: "https://roadmap.sh/questions/backend",
    },
    {
      id: "mentorcruise",
      marca: "M",
      base: 200,
      titulo: { pt: "MentorCruise · 40 perguntas", en: "MentorCruise · 40 questions" },
      descricao: {
        pt: "Perguntas de mentorcruise.com/questions/backend, respondidas aqui com explicações próprias. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= Q” ou “= R”). Nas perguntas de experiência (“você já…”), a explicação mostra como responder.",
        en: "Questions from mentorcruise.com/questions/backend, answered here with original explanations. The ones that repeat another question of the guide reuse the same explanation (tag “= Q” or “= R”). On experience questions (“have you ever…”), the explanation shows how to answer.",
      },
      url: "https://mentorcruise.com/questions/backend/",
    },
  ],
  modulos: [
    {
      id: "arquitetura",
      letra: "A",
      origem: "lista",
      nome: { pt: "Arquitetura e fundamentos", en: "Architecture & fundamentals" },
    },
    { id: "bancos-de-dados", letra: "B", origem: "lista", nome: { pt: "Bancos de dados", en: "Databases" } },
    {
      id: "cache-e-desempenho",
      letra: "C",
      origem: "lista",
      nome: { pt: "Cache e desempenho", en: "Caching & performance" },
    },
    {
      id: "seguranca",
      letra: "D",
      origem: "lista",
      nome: { pt: "Segurança e autenticação", en: "Security & authentication" },
    },
    { id: "design-de-sistemas", letra: "E", origem: "lista", nome: { pt: "Design de sistemas", en: "System design" } },
    {
      id: "confiabilidade",
      letra: "F",
      origem: "lista",
      nome: { pt: "Confiabilidade e operação", en: "Reliability & operations" },
    },
    {
      id: "roadmap-iniciante",
      letra: "",
      origem: "roadmap",
      nome: { pt: "roadmap.sh · Iniciante", en: "roadmap.sh · Beginner" },
    },
    {
      id: "roadmap-intermediario",
      letra: "",
      origem: "roadmap",
      nome: { pt: "roadmap.sh · Intermediário", en: "roadmap.sh · Intermediate" },
    },
    {
      id: "roadmap-avancado",
      letra: "",
      origem: "roadmap",
      nome: { pt: "roadmap.sh · Avançado", en: "roadmap.sh · Advanced" },
    },
    {
      id: "mentorcruise",
      letra: "",
      origem: "mentorcruise",
      nome: { pt: "MentorCruise · Entrevista de backend", en: "MentorCruise · Backend interview" },
    },
  ],
  perguntas,
};
