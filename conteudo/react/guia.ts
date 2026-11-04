import type { Guia } from "../tipos";
import { perguntas } from "./perguntas";

export const react: Guia = {
  id: "react",
  detalhe: "461 perguntas · PT/EN",
  textos: {
    pt: {
      nome: "Guia de React",
      chamada:
        "Perguntas de entrevista sobre React (componentes, hooks, renderização, estado, desempenho, React 19, Server Components, testes, segurança), do básico ao avançado e com cenários, cada uma com o método de explicação mais adequado, armadilhas e autoteste.",
      titulo: "React, do básico ao avançado.",
      introducao:
        "461 perguntas de entrevista sobre React, de seis fontes, cada uma explicada com o método que mais combina com ela. Onde várias perguntas pedem a mesma coisa, a explicação é a mesma (são 164 explicações distintas) e o progresso conta uma vez só. Marque o que já domina e treine só o resto.",
    },
    en: {
      nome: "React Guide",
      chamada:
        "React interview questions (components, hooks, rendering, state, performance, React 19, Server Components, testing, security), from basic to advanced and with scenarios, each with the best-fitting explanation method, pitfalls and a self-test.",
      titulo: "React, from basics to advanced.",
      introducao:
        "461 React interview questions, from six sources, each explained with the method that fits it best. Where several questions ask for the same thing, the explanation is the same (164 distinct explanations) and progress counts once. Mark what you already own and drill only the rest.",
    },
  },
  fontes: [
    {
      id: "linkedin",
      marca: "L",
      base: 0,
      titulo: { pt: "LinkedIn · Ashish Misal · 221 perguntas", en: "LinkedIn · Ashish Misal · 221 questions" },
      descricao: {
        pt: "Perguntas do artigo “React Interview Guide 2026”, de Ashish Misal, no LinkedIn, em catorze seções (de fundamentos a React 19, Server Components, testes, segurança e cenários). O artigo repete algumas perguntas entre seções; aqui cada repetição aponta para a mesma explicação. As respostas são explicações próprias. As que repetem outra pergunta do guia reaproveitam a mesma explicação (etiqueta “= L”, “= G” e assim por diante).",
        en: "Questions from the article “React Interview Guide 2026” by Ashish Misal on LinkedIn, in fourteen sections (from fundamentals to React 19, Server Components, testing, security and scenarios). The article repeats some questions across sections; here each repetition points to the same explanation. The answers are original explanations. The ones that repeat another question of the guide reuse the same explanation (tag “= L”, “= G” and so on).",
      },
      url: "https://www.linkedin.com/pulse/react-interview-guide-2026-questions-every-frontend-developer-misal-48khf/",
    },
    {
      id: "glassdoor",
      marca: "G",
      base: 300,
      titulo: { pt: "Glassdoor · 44 perguntas", en: "Glassdoor · 44 questions" },
      descricao: {
        pt: "Perguntas de entrevistas para “React Software Engineer” relatadas por candidatos no Glassdoor (as páginas públicas da busca). Entram só as perguntas técnicas e os exercícios práticos, reescritos como pergunta; relatos de processo, RH e quebra-cabeças ficam de fora, e nada identifica empresa ou candidato. Há também perguntas de JavaScript que aparecem nessas entrevistas. As respostas são explicações próprias.",
        en: "Interview questions for “React Software Engineer” reported by candidates on Glassdoor (the public search pages). Only the technical questions and the hands-on exercises come in, worded as questions; reports about process, HR and puzzles are left out, and nothing identifies a company or candidate. JavaScript questions that show up in those interviews are included too. The answers are original explanations.",
      },
      url: "https://www.glassdoor.com.br/Entrevista/react-software-engineer-perguntas-entrevista-SRCH_KO0,23.htm",
    },
    {
      id: "pedrincandido",
      marca: "P",
      base: 400,
      titulo: { pt: "pedrincandido · 18 perguntas", en: "pedrincandido · 18 questions" },
      descricao: {
        pt: "Perguntas do repositório “reactjs-questoes-de-entrevista”, de pedrincandido, em português (seção Core React). A descrição do repositório fala em 500 perguntas, mas o README traz 18. As respostas são explicações próprias.",
        en: "Questions from the “reactjs-questoes-de-entrevista” repository by pedrincandido, in Portuguese (Core React section). The repository description speaks of 500 questions, but the README has 18. The answers are original explanations.",
      },
      url: "https://github.com/pedrincandido/reactjs-questoes-de-entrevista",
    },
    {
      id: "coddy",
      marca: "C",
      base: 500,
      titulo: { pt: "Coddy · 33 perguntas", en: "Coddy · 33 questions" },
      descricao: {
        pt: "Perguntas da página “Perguntas de entrevista React com respostas (React 19)”, do Coddy, em três níveis. Três delas pedem a saída de um trecho de código; o enunciado descreve o trecho em palavras. As respostas são explicações próprias.",
        en: "Questions from the Coddy page “React interview questions with answers (React 19)”, in three levels. Three of them ask for the output of a code snippet; the question describes the snippet in words. The answers are original explanations.",
      },
      url: "https://coddy.tech/docs/pt/react/react-interview-questions",
    },
    {
      id: "simplilearn",
      marca: "S",
      base: 600,
      titulo: { pt: "Simplilearn · 97 perguntas", en: "Simplilearn · 97 questions" },
      descricao: {
        pt: "Perguntas do artigo “Top React Interview Questions and Answers”, do Simplilearn, de iniciantes a experientes, com blocos sobre React 19, Zustand, Next.js, testes, TypeScript, segurança e system design. As respostas são explicações próprias.",
        en: "Questions from the article “Top React Interview Questions and Answers” by Simplilearn, from freshers to experienced, with sections on React 19, Zustand, Next.js, testing, TypeScript, security and system design. The answers are original explanations.",
      },
      url: "https://www.simplilearn.com/tutorials/reactjs-tutorial/reactjs-interview-questions",
    },
    {
      id: "medium",
      marca: "M",
      base: 700,
      titulo: { pt: "Medium · Frontend Highlights · 48 perguntas", en: "Medium · Frontend Highlights · 48 questions" },
      descricao: {
        pt: "Perguntas do artigo “48 React interview questions with answers”, do Frontend Highlights, no Medium (inclui hooks, ciclo de vida de classes, HOC, render props e SSR). As respostas são explicações próprias.",
        en: "Questions from the article “48 React interview questions with answers” by Frontend Highlights on Medium (it includes hooks, class lifecycle, HOCs, render props and SSR). The answers are original explanations.",
      },
      url: "https://medium.com/@ignatovich.dm/48-react-interview-questions-with-answers-084cb8ce706d",
    },
  ],
  modulos: [
    {
      id: "linkedin-fundamentos",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Fundamentos", en: "LinkedIn · Fundamentals" },
    },
    {
      id: "linkedin-renderizacao",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Renderização e Virtual DOM", en: "LinkedIn · Rendering and the Virtual DOM" },
    },
    { id: "linkedin-hooks", letra: "", origem: "linkedin", nome: { pt: "LinkedIn · Hooks", en: "LinkedIn · Hooks" } },
    {
      id: "linkedin-regras-e-effects",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Regras dos Hooks e useEffect", en: "LinkedIn · Rules of Hooks and useEffect" },
    },
    {
      id: "linkedin-estado",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Gerenciamento de estado", en: "LinkedIn · State management" },
    },
    {
      id: "linkedin-desempenho",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Desempenho", en: "LinkedIn · Performance" },
    },
    {
      id: "linkedin-compiler",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · React Compiler", en: "LinkedIn · React Compiler" },
    },
    {
      id: "linkedin-react19",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · React 19 e novidades", en: "LinkedIn · React 19 and what is new" },
    },
    {
      id: "linkedin-rsc",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Server Components e arquitetura", en: "LinkedIn · Server Components and architecture" },
    },
    {
      id: "linkedin-formularios-e-dados",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Formulários e dados", en: "LinkedIn · Forms and data fetching" },
    },
    {
      id: "linkedin-rotas-e-arquitetura",
      letra: "",
      origem: "linkedin",
      nome: {
        pt: "LinkedIn · Rotas e arquitetura da aplicação",
        en: "LinkedIn · Routing and application architecture",
      },
    },
    {
      id: "linkedin-testes",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Testes", en: "LinkedIn · Testing" },
    },
    {
      id: "linkedin-seguranca-e-a11y",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Segurança e acessibilidade", en: "LinkedIn · Security and accessibility" },
    },
    {
      id: "linkedin-cenarios",
      letra: "",
      origem: "linkedin",
      nome: { pt: "LinkedIn · Cenários", en: "LinkedIn · Scenarios" },
    },
    {
      id: "glassdoor-react",
      letra: "",
      origem: "glassdoor",
      nome: { pt: "Glassdoor · React", en: "Glassdoor · React" },
    },
    {
      id: "glassdoor-javascript",
      letra: "",
      origem: "glassdoor",
      nome: { pt: "Glassdoor · JavaScript nas entrevistas de React", en: "Glassdoor · JavaScript in React interviews" },
    },
    {
      id: "glassdoor-exercicios",
      letra: "",
      origem: "glassdoor",
      nome: { pt: "Glassdoor · Exercícios práticos", en: "Glassdoor · Hands-on exercises" },
    },
    {
      id: "pedrincandido-core",
      letra: "",
      origem: "pedrincandido",
      nome: { pt: "pedrincandido · Core React", en: "pedrincandido · Core React" },
    },
    { id: "coddy-iniciante", letra: "", origem: "coddy", nome: { pt: "Coddy · Iniciante", en: "Coddy · Beginner" } },
    {
      id: "coddy-intermediario",
      letra: "",
      origem: "coddy",
      nome: { pt: "Coddy · Intermediário", en: "Coddy · Intermediate" },
    },
    { id: "coddy-avancado", letra: "", origem: "coddy", nome: { pt: "Coddy · Avançado", en: "Coddy · Advanced" } },
    {
      id: "simplilearn-basico",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Básico", en: "Simplilearn · Basics" },
    },
    {
      id: "simplilearn-componentes",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Componentes, JSX e renderização", en: "Simplilearn · Components, JSX and rendering" },
    },
    {
      id: "simplilearn-estado-e-formularios",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Estado, props e formulários", en: "Simplilearn · State, props and forms" },
    },
    {
      id: "simplilearn-eventos",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Eventos, funções e sintaxe", en: "Simplilearn · Events, functions and syntax" },
    },
    {
      id: "simplilearn-dom-e-ciclo",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · DOM, efeitos e ciclo de vida", en: "Simplilearn · DOM, side effects and lifecycle" },
    },
    {
      id: "simplilearn-hooks",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Hooks", en: "Simplilearn · Hooks" },
    },
    {
      id: "simplilearn-padroes",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Padrões de componentes", en: "Simplilearn · Component patterns" },
    },
    {
      id: "simplilearn-rotas-e-estado",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Rotas e gerenciamento de estado", en: "Simplilearn · Routing and state management" },
    },
    {
      id: "simplilearn-avancado",
      letra: "",
      origem: "simplilearn",
      nome: {
        pt: "Simplilearn · Arquitetura, desempenho e React concorrente",
        en: "Simplilearn · Architecture, performance and concurrent React",
      },
    },
    {
      id: "simplilearn-react19",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · React 19", en: "Simplilearn · React 19" },
    },
    {
      id: "simplilearn-zustand-e-render",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Zustand e renderização", en: "Simplilearn · Zustand and rendering" },
    },
    {
      id: "simplilearn-next-testes-ts",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Next.js, testes e TypeScript", en: "Simplilearn · Next.js, testing and TypeScript" },
    },
    {
      id: "simplilearn-seguranca-e-design",
      letra: "",
      origem: "simplilearn",
      nome: { pt: "Simplilearn · Segurança e system design", en: "Simplilearn · Security and system design" },
    },
    {
      id: "medium-fundamentos",
      letra: "",
      origem: "medium",
      nome: { pt: "Medium · Fundamentos e hooks", en: "Medium · Fundamentals and hooks" },
    },
    { id: "medium-avancado", letra: "", origem: "medium", nome: { pt: "Medium · Avançado", en: "Medium · Advanced" } },
  ],
  perguntas,
};
