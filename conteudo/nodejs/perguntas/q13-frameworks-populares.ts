import type { Pergunta } from "../../tipos";

// Q13 · Frameworks populares
export const q13: Pergunta = {
  numero: 13,
  modulo: "turing-basicas",
  metodo: "compare",
  pt: {
    titulo: "Frameworks populares",
    pergunta: "Cite três frameworks Node.js populares.",
    porqueEsteMetodo:
      "Citar nomes é só o começo; o que a entrevista testa é saber diferenciá-los. A matriz mostra os frameworks lado a lado e a regra de decisão diz quando escolher cada um.",
    resposta30s:
      "Três bem conhecidos: **Express** (minimalista e o mais difundido), **Fastify** (enxuto, com validação por esquema e baixo custo por requisição) e **NestJS** (estrutura opinativa, TypeScript em primeiro lugar, que roda sobre Express ou Fastify). **Koa** e **Hapi** também aparecem. A escolha depende de quanta estrutura você quer pronta, do tamanho do time e do ecossistema de que precisa, não de ranking de velocidade.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Frameworks lado a lado",
        colunas: ["Framework", "Filosofia", "Pontos fortes", "Cuidados", "Quando escolher"],
        linhas: [
          [
            "Express",
            "Minimalista: roteamento e middlewares, sem opinião sobre o resto",
            "Curva suave, ecossistema e material de estudo enormes",
            "Estrutura de pastas, validação e tratamento de erros ficam por sua conta",
            "APIs simples a médias, protótipos, times que já o conhecem",
          ],
          [
            "Fastify",
            "Enxuto e extensível por plugins, com validação por esquema (JSON Schema)",
            "Baixo custo por requisição, validação e serialização integradas, log estruturado embutido",
            "Ecossistema menor que o do Express; o modelo de plugins pede um tempo de adaptação",
            "APIs em que contratos de entrada e saída e eficiência importam",
          ],
          [
            "NestJS",
            "Opinativo e modular: controllers, providers e injeção de dependência, TypeScript em primeiro lugar",
            "Estrutura padronizada para times grandes; integra bem com ORMs, filas, GraphQL e testes",
            "Mais conceitos (módulos, decorators) e mais código-base, mesmo para casos simples; roda sobre Express ou Fastify",
            "Aplicações grandes e duradouras, com vários times e arquitetura uniforme",
          ],
          [
            "Koa",
            "Núcleo ainda menor que o do Express, pensado para `async`/`await`",
            "Middlewares em cascata com um objeto de contexto (`ctx`)",
            "Roteador, leitura do corpo e o resto vêm de pacotes à parte",
            "Quem quer um núcleo enxuto e controle sobre cada peça",
          ],
          [
            "Hapi",
            "Baseado em configuração: rotas, validação e autenticação são declaradas",
            "Rotas, autenticação, cache e validação são conceitos de primeira classe, com sistema de plugins",
            "Estilo próprio e menos material de estudo que o Express",
            "Equipes que preferem configuração a código e valorizam convenções",
          ],
          [
            "Next.js",
            "Full-stack em React: páginas, rotas de servidor e renderização no servidor (SSR)",
            "Front-end e back-end no mesmo projeto; renderização no servidor e geração estática",
            "Não é um framework de API genérico: prende você ao React e às convenções dele",
            "Sites e aplicações web em React que precisam de servidor",
          ],
        ],
        nota: "Express, Koa, Fastify e Hapi são frameworks HTTP para APIs e sites. O NestJS organiza a aplicação por cima de um deles (Express por padrão, ou Fastify). O Next.js é de outra família: um framework de aplicações React.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo “olá” em dois estilos",
        legenda: "JavaScript",
        codigo: `import express from "express";
import Fastify from "fastify";

// Express: rota registrada com um handler (req, res)
const appExpress = express();
appExpress.get("/ola", (req, res) => res.json({ ola: "mundo" }));
appExpress.listen(3000);

// Fastify: o handler async pode devolver o objeto; o framework serializa
const appFastify = Fastify({ logger: true });
appFastify.get("/ola", async () => ({ ola: "mundo" }));
await appFastify.listen({ port: 3001 });`,
        nota: "Exemplos independentes, mostrados juntos só para comparar; na prática você escolhe um. Os pacotes são instalados com `npm install express fastify`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece pela pergunta “quanta estrutura eu quero pronta?”. Pouca e time experiente: **Express**, **Koa** ou **Fastify**. Muita, com vários times e vida longa: **NestJS**. Contratos de entrada e saída validados por esquema e custo baixo por requisição: **Fastify**. Site ou aplicação em React com servidor: **Next.js**. Entre opções razoáveis, pesam mais o que o seu time já domina e o que o ecossistema oferece (autenticação, ORM, testes) do que qualquer número de benchmark.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidado com rankings de velocidade",
        texto:
          "Benchmarks de “requisições por segundo” costumam medir um “olá, mundo”. Numa aplicação real o tempo vai para banco de dados, rede e regras de negócio, e a diferença entre frameworks quase some. Meça o seu caso antes de decidir por velocidade e confira na documentação oficial a versão e o estado de manutenção de cada projeto.",
      },
    ],
    armadilhas: [
      "Escolher pelo ranking de benchmark em vez de pelo gargalo real (banco, rede, regras de negócio).",
      "Achar que o NestJS substitui o Express: ele organiza a aplicação e roda sobre Express ou Fastify.",
      "Começar um projeto grande em Express sem definir estrutura, validação e tratamento de erros: a liberdade vira bagunça.",
      "Adotar um framework pouco mantido sem olhar a atividade recente e a política de correções de segurança.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a principal diferença de filosofia entre Express e NestJS?",
        resposta:
          "O Express é minimalista: você decide a estrutura. O NestJS é opinativo: já traz módulos, controllers e injeção de dependência, o que padroniza projetos grandes ao custo de mais conceitos.",
      },
      {
        pergunta: "O Next.js é um concorrente direto do Express?",
        resposta:
          "Não exatamente. Next.js é um framework full-stack para aplicações React, com renderização no servidor. O Express é uma camada HTTP genérica para APIs e sites.",
      },
      {
        pergunta: "Que critérios usar antes de olhar benchmarks?",
        resposta:
          "Quanta estrutura você quer pronta, a experiência do time, o ecossistema, a manutenção do projeto e o gargalo real da sua aplicação.",
      },
    ],
  },
  en: {
    titulo: "Popular frameworks",
    pergunta: "Name three popular Node.js frameworks.",
    porqueEsteMetodo:
      "Naming them is only the start; what the interview tests is telling them apart. The matrix shows the frameworks side by side and the decision rule says when to pick each one.",
    resposta30s:
      "Three well-known ones: **Express** (minimalist and the most widespread), **Fastify** (lean, with schema validation and low per-request overhead) and **NestJS** (an opinionated structure, TypeScript first, that runs on top of Express or Fastify). **Koa** and **Hapi** show up too. The choice depends on how much structure you want ready-made, team size and the ecosystem you need, not on speed rankings.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Frameworks side by side",
        colunas: ["Framework", "Philosophy", "Strengths", "Watch out for", "Pick it when"],
        linhas: [
          [
            "Express",
            "Minimalist: routing and middleware, no opinion on the rest",
            "Gentle learning curve, huge ecosystem and learning material",
            "Folder structure, validation and error handling are up to you",
            "Simple to mid-size APIs, prototypes, teams that already know it",
          ],
          [
            "Fastify",
            "Lean and extensible through plugins, with schema validation (JSON Schema)",
            "Low per-request overhead, built-in validation and serialization, structured logging included",
            "Smaller ecosystem than Express; the plugin model takes some getting used to",
            "APIs where input/output contracts and efficiency matter",
          ],
          [
            "NestJS",
            "Opinionated and modular: controllers, providers and dependency injection, TypeScript first",
            "Standard structure for large teams; integrates well with ORMs, queues, GraphQL and testing",
            "More concepts (modules, decorators) and more boilerplate, even for simple cases; runs on top of Express or Fastify",
            "Large, long-lived applications with several teams and a uniform architecture",
          ],
          [
            "Koa",
            "An even smaller core than Express, designed around `async`/`await`",
            "Cascading middleware with a single context object (`ctx`)",
            "Router, body parsing and the rest come from separate packages",
            "Those who want a lean core and control over every piece",
          ],
          [
            "Hapi",
            "Configuration-driven: routes, validation and authentication are declared",
            "Routing, authentication, caching and validation are first-class concepts, with a plugin system",
            "Its own style and less learning material than Express",
            "Teams that prefer configuration over code and value conventions",
          ],
          [
            "Next.js",
            "Full-stack React framework: pages, server routes and server-side rendering (SSR)",
            "Front end and back end in one project; server rendering and static generation",
            "Not a general-purpose API framework: it ties you to React and its conventions",
            "React websites and web apps that need a server",
          ],
        ],
        nota: "Express, Koa, Fastify and Hapi are HTTP frameworks for APIs and sites. NestJS organizes the application on top of one of them (Express by default, or Fastify). Next.js is a different family: a framework for React applications.",
      },
      {
        tipo: "codigo",
        titulo: "The same “hello” in two styles",
        legenda: "JavaScript",
        codigo: `import express from "express";
import Fastify from "fastify";

// Express: a route registered with a (req, res) handler
const appExpress = express();
appExpress.get("/hello", (req, res) => res.json({ hello: "world" }));
appExpress.listen(3000);

// Fastify: the async handler can return the object; the framework serializes it
const appFastify = Fastify({ logger: true });
appFastify.get("/hello", async () => ({ hello: "world" }));
await appFastify.listen({ port: 3001 });`,
        nota: "Independent examples, shown together only to compare; in practice you pick one. The packages are installed with `npm install express fastify`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with the question “how much structure do I want ready-made?”. Little, with an experienced team: **Express**, **Koa** or **Fastify**. A lot, with several teams and a long life: **NestJS**. Input and output contracts validated by schema and low per-request cost: **Fastify**. A React site or app with a server: **Next.js**. Among reasonable options, what your team already masters and what the ecosystem offers (authentication, ORM, testing) weigh more than any benchmark number.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Beware of speed rankings",
        texto:
          "“Requests per second” benchmarks usually measure a “hello, world”. In a real application the time goes to the database, the network and business rules, and the gap between frameworks almost vanishes. Measure your own case before deciding on speed, and check each project’s version and maintenance status in its official documentation.",
      },
    ],
    armadilhas: [
      "Choosing by benchmark ranking instead of by the real bottleneck (database, network, business rules).",
      "Thinking NestJS replaces Express: it organizes the application and runs on top of Express or Fastify.",
      "Starting a large project in Express without defining structure, validation and error handling: freedom turns into a mess.",
      "Adopting a poorly maintained framework without checking recent activity and its security-fix policy.",
    ],
    autoteste: [
      {
        pergunta: "What is the main difference in philosophy between Express and NestJS?",
        resposta:
          "Express is minimalist: you decide the structure. NestJS is opinionated: it ships modules, controllers and dependency injection, which standardizes large projects at the cost of more concepts.",
      },
      {
        pergunta: "Is Next.js a direct competitor of Express?",
        resposta:
          "Not exactly. Next.js is a full-stack framework for React applications, with server-side rendering. Express is a generic HTTP layer for APIs and sites.",
      },
      {
        pergunta: "Which criteria should you apply before looking at benchmarks?",
        resposta:
          "How much structure you want ready-made, the team’s experience, the ecosystem, the project’s maintenance and your application’s real bottleneck.",
      },
    ],
  },
};
