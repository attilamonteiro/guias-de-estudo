import type { Guia } from "../tipos";
import { perguntas } from "./perguntas";

export const nodejs: Guia = {
  id: "nodejs",
  detalhe: "199 perguntas · PT/EN",
  textos: {
    pt: {
      nome: "Guia de Node.js",
      chamada:
        "Perguntas de entrevista sobre Node.js (event loop, módulos, npm, streams, Express, produção, segurança), do básico ao avançado e com cenários, cada uma com o método de explicação mais adequado, armadilhas e autoteste.",
      titulo: "Node.js, do básico ao avançado.",
      introducao:
        "199 perguntas de entrevista sobre Node.js, de duas fontes, cada uma explicada com o método que mais combina com ela. Onde várias perguntas pedem a mesma coisa, a explicação é a mesma e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
    },
    en: {
      nome: "Node.js Guide",
      chamada:
        "Node.js interview questions (event loop, modules, npm, streams, Express, production, security), from basic to advanced and with scenarios, each with the best-fitting explanation method, pitfalls and a self-test.",
      titulo: "Node.js, from basics to advanced.",
      introducao:
        "199 Node.js interview questions, from two sources, each explained with the method that fits it best. Where several questions ask for the same thing, the explanation is the same and progress counts once. Mark what you already own and drill only the rest.",
    },
  },
  fontes: [
    {
      id: "turing",
      marca: "T",
      base: 0,
      titulo: { pt: "Turing · 61 perguntas", en: "Turing · 61 questions" },
      descricao: {
        pt: "Perguntas de turing.com/pt/interview-questions/node-js, respondidas aqui com explicações próprias, em três níveis. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= T”). Alguns enunciados da fonte são imprecisos ou partem de premissas incorretas; a explicação os corrige com cuidado.",
        en: "Questions from turing.com/pt/interview-questions/node-js, answered here with original explanations, in three levels. The ones that repeat another question of the guide reuse the same explanation (tag “= T”). Some of the source’s wordings are imprecise or rest on incorrect premises; the explanation corrects them gently.",
      },
      url: "https://www.turing.com/pt/interview-questions/node-js",
    },
    {
      id: "linkedin",
      marca: "L",
      base: 100,
      titulo: { pt: "LinkedIn · Ashish Misal · 138 perguntas", en: "LinkedIn · Ashish Misal · 138 questions" },
      descricao: {
        pt: "Perguntas do artigo “Node.js Interview Guide 2026”, de Ashish Misal, no LinkedIn, em dez seções, com cenários no fim. As respostas são explicações próprias. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= T” ou “= L”).",
        en: "Questions from the article “Node.js Interview Guide 2026” by Ashish Misal on LinkedIn, in ten sections, with scenarios at the end. The answers are original explanations. The ones that repeat another question of the guide reuse the same explanation (tag “= T” or “= L”).",
      },
      url: "https://www.linkedin.com/pulse/nodejs-interview-guide-2026-130-questions-every-backend-ashish-misal-l3stc/",
    },
  ],
  modulos: [
    { id: "turing-basicas", letra: "", origem: "turing", nome: { pt: "Turing · Básico", en: "Turing · Basic" } },
    {
      id: "turing-intermediarias",
      letra: "",
      origem: "turing",
      nome: { pt: "Turing · Intermediário", en: "Turing · Intermediate" },
    },
    { id: "turing-avancadas", letra: "", origem: "turing", nome: { pt: "Turing · Avançado", en: "Turing · Advanced" } },
    {
      id: "linkedin-fundamentos",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Fundamentos", en: "LinkedIn · Core Node.js" },
    },
    {
      id: "linkedin-assincrono",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Assíncrono e event loop", en: "LinkedIn · Async and the event loop" },
    },
    {
      id: "linkedin-express",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Express e APIs REST", en: "LinkedIn · Express and REST APIs" },
    },
    {
      id: "linkedin-streams",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Buffers, streams e arquivos", en: "LinkedIn · Buffers, streams and files" },
    },
    {
      id: "linkedin-processos",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Processos e concorrência", en: "LinkedIn · Processes and concurrency" },
    },
    {
      id: "linkedin-moderno",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Node.js moderno", en: "LinkedIn · Modern Node.js" },
    },
    {
      id: "linkedin-arquitetura",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Banco de dados e arquitetura", en: "LinkedIn · Database and architecture" },
    },
    {
      id: "linkedin-producao",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Desempenho e produção", en: "LinkedIn · Performance and production" },
    },
    {
      id: "linkedin-seguranca",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Segurança", en: "LinkedIn · Security" },
    },
    {
      id: "linkedin-cenarios",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Cenários", en: "LinkedIn · Scenarios" },
    },
  ],
  perguntas,
};
