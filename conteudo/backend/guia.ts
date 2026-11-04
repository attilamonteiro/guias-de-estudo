import type { Guia } from "../tipos";
import { perguntas } from "./perguntas";

export const backend: Guia = {
  id: "backend",
  detalhe: "80 perguntas · PT/EN",
  fonteExterna: { url: "https://roadmap.sh/questions/backend" },
  textos: {
    pt: {
      nome: "Guia de Backend",
      chamada:
        "Perguntas de entrevista de backend (arquitetura, bancos, cache, segurança, sistemas distribuídos), cada uma com o método de explicação mais adequado, armadilhas e autoteste.",
      titulo: "Entenda de verdade, uma vez só.",
      introducao:
        "30 perguntas de entrevista de backend mais as 50 do roadmap.sh, cada uma explicada com o método que mais combina com ela. Onde as listas coincidem, a explicação é a mesma e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
      secaoDaLista: "Lista original · 30 perguntas",
      secaoDoRoadmap: "roadmap.sh · 50 perguntas",
      descricaoDoRoadmap:
        "Perguntas de roadmap.sh/questions/backend, respondidas aqui com explicações próprias. As que repetem a lista original reaproveitam a mesma explicação (etiqueta “= Q”).",
    },
    en: {
      nome: "Backend Guide",
      chamada:
        "Backend interview questions (architecture, databases, caching, security, distributed systems), each with the best-fitting explanation method, pitfalls and a self-test.",
      titulo: "Understand it properly, once.",
      introducao:
        "30 backend interview questions plus the 50 from roadmap.sh, each explained with the method that fits it best. Where the lists overlap, the explanation is the same and progress counts once. Mark what you already own and drill only the rest.",
      secaoDaLista: "Original list · 30 questions",
      secaoDoRoadmap: "roadmap.sh · 50 questions",
      descricaoDoRoadmap:
        "Questions from roadmap.sh/questions/backend, answered here with original explanations. The ones that repeat the original list reuse the same explanation (tag “= Q”).",
    },
  },
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
  ],
  perguntas,
};
