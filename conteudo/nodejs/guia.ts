import type { Guia } from "../tipos";
import { perguntas } from "./perguntas";

export const nodejs: Guia = {
  id: "nodejs",
  detalhe: "519 perguntas · PT/EN",
  textos: {
    pt: {
      nome: "Guia de Node.js",
      chamada:
        "Perguntas de entrevista sobre Node.js (event loop, módulos, npm, streams, Express, produção, segurança), do básico ao avançado e com cenários, cada uma com o método de explicação mais adequado, armadilhas e autoteste.",
      titulo: "Node.js, do básico ao avançado.",
      introducao:
        "519 perguntas de entrevista sobre Node.js, de seis fontes, cada uma explicada com o método que mais combina com ela. Onde várias perguntas pedem a mesma coisa, a explicação é a mesma (são 170 explicações distintas) e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
    },
    en: {
      nome: "Node.js Guide",
      chamada:
        "Node.js interview questions (event loop, modules, npm, streams, Express, production, security), from basic to advanced and with scenarios, each with the best-fitting explanation method, pitfalls and a self-test.",
      titulo: "Node.js, from basics to advanced.",
      introducao:
        "519 Node.js interview questions, from six sources, each explained with the method that fits it best. Where several questions ask for the same thing, the explanation is the same (170 distinct explanations) and progress counts once. Mark what you already own and drill only the rest.",
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
    {
      id: "devinterview",
      marca: "D",
      base: 300,
      titulo: { pt: "devinterview.io · 100 perguntas", en: "devinterview.io · 100 questions" },
      descricao: {
        pt: "Perguntas de “100 Must-Know Node.js Interview Questions”, do devinterview.io, em 29 seções temáticas (do básico a nuvem, DevOps e IoT). As respostas são explicações próprias. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= T”, “= L” ou “= D”).",
        en: "Questions from “100 Must-Know Node.js Interview Questions” at devinterview.io, in 29 thematic sections (from the basics to cloud, DevOps and IoT). The answers are original explanations. The ones that repeat another question of the guide reuse the same explanation (tag “= T”, “= L” or “= D”).",
      },
      url: "https://devinterview.io/questions/web-and-mobile-development/node-interview-questions/",
    },
    {
      id: "founditgulf",
      marca: "F",
      base: 400,
      titulo: { pt: "Found It · 100 perguntas", en: "Found It · 100 questions" },
      descricao: {
        pt: "Perguntas do artigo “Top 100 Node.js Interview Questions and Answers” do Found It, em cinco blocos: básicas, avançadas, cenários práticos, iniciantes e experientes. As respostas são explicações próprias. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= T”, “= L”, “= D” ou “= F”).",
        en: "Questions from the article “Top 100 Node.js Interview Questions and Answers” by Found It, in five groups: basic, advanced, practical scenarios, freshers and experienced. The answers are original explanations. The ones that repeat another question of the guide reuse the same explanation (tag “= T”, “= L”, “= D” or “= F”).",
      },
      url: "https://www.founditgulf.com/career-advice/nodejs-interview-questions-answers/",
    },
    {
      id: "coderpad",
      marca: "C",
      base: 500,
      titulo: { pt: "CoderPad · 29 perguntas", en: "CoderPad · 29 questions" },
      descricao: {
        pt: "Perguntas de coderpad.io, em três níveis (júnior, intermediário e sênior). A fonte responde com blocos de código; aqui as respostas são explicações próprias, pelo método de aprendizado, e quase todas reaproveitam uma explicação que o guia já tem (etiqueta “= T”, “= L”, “= D”, “= F” ou “= C”).",
        en: "Questions from coderpad.io, in three levels (junior, intermediate and senior). The source answers with code blocks; here the answers are original explanations, by learning method, and almost all of them reuse an explanation the guide already has (tag “= T”, “= L”, “= D”, “= F” or “= C”).",
      },
      url: "https://coderpad.io/interview-questions/nodejs-interview-questions/",
    },
    {
      id: "gist",
      marca: "G",
      base: 600,
      titulo: { pt: "Gist paulfranco · 91 perguntas", en: "paulfranco gist · 91 questions" },
      descricao: {
        pt: "Perguntas do gist “NodeJS Interview Questions”, de paulfranco, por nível de dificuldade (de duas a cinco estrelas), com três trechos de código para analisar no fim. O gist repete algumas perguntas (o bloco de onze do nível quatro e uma sobre single-thread); aqui cada uma entra uma vez só. Os trechos de código são descritos em palavras no enunciado. As respostas são explicações próprias (etiqueta “= T”, “= L”, “= D”, “= F”, “= C” ou “= G”).",
        en: "Questions from the “NodeJS Interview Questions” gist by paulfranco, by difficulty level (two to five stars), with three code snippets to analyze at the end. The gist repeats some questions (the block of eleven at level four and one about single-threading); here each one appears once. The code snippets are described in words in the question. The answers are original explanations (tag “= T”, “= L”, “= D”, “= F”, “= C” or “= G”).",
      },
      url: "https://gist.github.com/paulfranco/9f88a2879b7b7d88de5d1921aef2093b",
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
    {
      id: "devinterview-fundamentos",
      letra: "",
      origem: "devinterview",
      nome: { pt: "devinterview.io · Fundamentos", en: "devinterview.io · Basics" },
    },
    {
      id: "devinterview-nativos",
      letra: "",
      origem: "devinterview",
      nome: { pt: "devinterview.io · Módulos nativos", en: "devinterview.io · Core modules" },
    },
    {
      id: "devinterview-assincrono",
      letra: "",
      origem: "devinterview",
      nome: { pt: "devinterview.io · Programação assíncrona", en: "devinterview.io · Asynchronous programming" },
    },
    {
      id: "devinterview-rede-e-erros",
      letra: "",
      origem: "devinterview",
      nome: { pt: "devinterview.io · Rede, Express e erros", en: "devinterview.io · Networking, Express and errors" },
    },
    {
      id: "devinterview-testes-e-dados",
      letra: "",
      origem: "devinterview",
      nome: { pt: "devinterview.io · Testes e bancos de dados", en: "devinterview.io · Testing and databases" },
    },
    {
      id: "devinterview-desempenho",
      letra: "",
      origem: "devinterview",
      nome: {
        pt: "devinterview.io · Desempenho, concorrência e microsserviços",
        en: "devinterview.io · Performance, concurrency and microservices",
      },
    },
    {
      id: "devinterview-seguranca-e-implantacao",
      letra: "",
      origem: "devinterview",
      nome: {
        pt: "devinterview.io · Segurança, tempo real e implantação",
        en: "devinterview.io · Security, real time and deployment",
      },
    },
    {
      id: "devinterview-avancado",
      letra: "",
      origem: "devinterview",
      nome: { pt: "devinterview.io · Avançado e frameworks", en: "devinterview.io · Advanced topics and frameworks" },
    },
    {
      id: "devinterview-integracoes",
      letra: "",
      origem: "devinterview",
      nome: {
        pt: "devinterview.io · Integrações, front-end e boas práticas",
        en: "devinterview.io · Integrations, front end and best practices",
      },
    },
    {
      id: "devinterview-escala",
      letra: "",
      origem: "devinterview",
      nome: {
        pt: "devinterview.io · Escala, mensageria, nuvem e entrega",
        en: "devinterview.io · Scaling, messaging, cloud and delivery",
      },
    },
    {
      id: "devinterview-cenarios",
      letra: "",
      origem: "devinterview",
      nome: {
        pt: "devinterview.io · Cenários, DevOps e novos usos",
        en: "devinterview.io · Scenarios, DevOps and new uses",
      },
    },
    {
      id: "founditgulf-basicas-1",
      letra: "",
      origem: "founditgulf",
      nome: { pt: "Found It · Básicas (1–25)", en: "Found It · Basic (1–25)" },
    },
    {
      id: "founditgulf-basicas-2",
      letra: "",
      origem: "founditgulf",
      nome: { pt: "Found It · Básicas (26–50)", en: "Found It · Basic (26–50)" },
    },
    {
      id: "founditgulf-avancadas",
      letra: "",
      origem: "founditgulf",
      nome: { pt: "Found It · Avançadas", en: "Found It · Advanced" },
    },
    {
      id: "founditgulf-cenarios",
      letra: "",
      origem: "founditgulf",
      nome: { pt: "Found It · Cenários práticos", en: "Found It · Practical scenarios" },
    },
    {
      id: "founditgulf-iniciantes",
      letra: "",
      origem: "founditgulf",
      nome: { pt: "Found It · Para iniciantes", en: "Found It · For freshers" },
    },
    {
      id: "founditgulf-experientes",
      letra: "",
      origem: "founditgulf",
      nome: { pt: "Found It · Para experientes", en: "Found It · For experienced developers" },
    },
    {
      id: "coderpad-junior",
      letra: "",
      origem: "coderpad",
      nome: { pt: "CoderPad · Júnior", en: "CoderPad · Junior" },
    },
    {
      id: "coderpad-intermediario",
      letra: "",
      origem: "coderpad",
      nome: { pt: "CoderPad · Intermediário", en: "CoderPad · Intermediate" },
    },
    {
      id: "coderpad-senior",
      letra: "",
      origem: "coderpad",
      nome: { pt: "CoderPad · Sênior", en: "CoderPad · Senior" },
    },
    {
      id: "gist-iniciante",
      letra: "",
      origem: "gist",
      nome: { pt: "Gist · Iniciante (★★)", en: "Gist · Beginner (★★)" },
    },
    {
      id: "gist-intermediario",
      letra: "",
      origem: "gist",
      nome: { pt: "Gist · Intermediário (★★★)", en: "Gist · Intermediate (★★★)" },
    },
    {
      id: "gist-avancado",
      letra: "",
      origem: "gist",
      nome: { pt: "Gist · Avançado (★★★★)", en: "Gist · Advanced (★★★★)" },
    },
    {
      id: "gist-especialista",
      letra: "",
      origem: "gist",
      nome: { pt: "Gist · Especialista (★★★★★)", en: "Gist · Expert (★★★★★)" },
    },
    {
      id: "gist-codigo",
      letra: "",
      origem: "gist",
      nome: { pt: "Gist · Código para analisar", en: "Gist · Code to analyze" },
    },
  ],
  perguntas,
};
