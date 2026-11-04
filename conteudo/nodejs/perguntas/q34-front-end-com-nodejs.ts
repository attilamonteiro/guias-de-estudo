import type { Pergunta } from "../../tipos";

// Q34 · Front-end com Node.js
export const q34: Pergunta = {
  numero: 34,
  modulo: "turing-intermediarias",
  metodo: "compare",
  pt: {
    titulo: "Front-end com Node.js",
    pergunta: "É possível criar uma aplicação front-end com Node.js?",
    porqueEsteMetodo:
      "A pergunta mistura duas leituras (a interface rodar no Node.js ou ser construída com ele). Comparar “Node.js como ferramenta” e “front-end no navegador” lado a lado separa as duas e mostra onde cada uma entra.",
    resposta30s:
      "Em parte. O Node.js **não roda no navegador**: a interface que o usuário vê continua sendo HTML, CSS e JavaScript executados lá. Mas o Node.js é a base do front-end moderno: roda **bundlers e servidores de desenvolvimento**, **compila e testa** o código, faz **renderização no servidor (SSR)** e serve as **APIs** que a interface consome. Então dá para construir o front-end **com** o Node.js, mas ele roda no navegador.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Node.js (servidor e ferramentas)", "Front-end no navegador"],
        linhas: [
          ["Onde roda", "Na sua máquina e no servidor: terminal, CI, produção", "No navegador de quem usa a aplicação"],
          [
            "O que entrega",
            "Build, servidor de desenvolvimento, SSR, testes, APIs",
            "A interface: HTML, CSS, JavaScript e eventos do usuário",
          ],
          [
            "APIs disponíveis",
            "`node:fs`, `node:http`, `process`; não existem `document` nem `window`",
            "DOM, `window`, `localStorage`, `fetch`; sem acesso direto ao disco nem ao banco",
          ],
          [
            "Quem enxerga o código",
            "Só quem tem acesso ao servidor",
            "Qualquer usuário pode inspecionar o que o navegador baixou",
          ],
          [
            "Segredos",
            "Podem ficar aqui, em variáveis de ambiente",
            "Nunca: tudo o que vai no pacote para o navegador é público",
          ],
          [
            "Módulos",
            "CommonJS e ES Modules; pacotes vêm de `node_modules`",
            "ES Modules; o bundler costuma juntar tudo antes de enviar",
          ],
          [
            "Exemplos",
            "Vite, webpack, `npm run build`, Next.js (parte do servidor)",
            "React, Vue, Angular ou Svelte rodando na página",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "SSR mínimo: o Node.js monta o HTML",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          "",
          "const escapar = (s) => s.replace(/[&<>\"']/g, (c) => `&#${c.charCodeAt(0)};`);",
          "",
          "createServer((req, res) => {",
          '  const url = new URL(req.url, "http://localhost");',
          '  const nome = url.searchParams.get("nome") ?? "visitante";',
          '  res.setHeader("Content-Type", "text/html; charset=utf-8");',
          "  res.end(`<h1>Olá, ${escapar(nome)}</h1>`); // o navegador só exibe",
          "}).listen(3000);",
        ].join("\n"),
        nota: "Frameworks como Next.js e Nuxt fazem isso em escala, e depois o JavaScript do navegador assume a interatividade. O `escapar` evita que o parâmetro da URL injete HTML (XSS).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "O Node.js **constrói e serve**; o navegador **executa a interface**. Use o Node.js ao redor do front-end (build, servidor de desenvolvimento, SSR, API). O código que mexe na tela precisa rodar no navegador. Arquivos, banco e segredos ficam do lado do Node.js, expostos ao front-end por uma API.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A premissa da pergunta",
        texto:
          "“Criar um front-end com Node.js” pode significar (1) a interface **rodar** no Node.js, o que não acontece, porque o Node.js não tem DOM, ou (2) a interface ser **construída e servida** com o Node.js, o caso comum e verdadeiro. Em entrevista, diga qual leitura você adota. Há ainda aplicações de desktop (como as feitas com Electron) que juntam o Node.js a um navegador embutido, mas isso é outro cenário.",
      },
    ],
    armadilhas: [
      "Usar `document` ou `window` em um script que roda no Node.js (dá `ReferenceError`), ou esperar `fs` no navegador.",
      "Colocar chaves de API em variáveis de ambiente que o bundler embute no código do navegador: elas viram públicas.",
      "Confundir SSR com “rodar o front-end no servidor”: o servidor gera o HTML inicial, mas a interatividade ainda depende de JavaScript no navegador.",
      'Achar que `require("fs")` funciona no código enviado ao navegador: sem bundler e sem equivalente, não funciona.',
    ],
    autoteste: [
      {
        pergunta: "Por que o Node.js não consegue manipular o DOM?",
        resposta:
          "Porque o DOM é uma API do navegador: no Node.js não existem `document` nem `window`. (Bibliotecas como jsdom simulam o DOM em testes e em alguns usos de SSR.)",
      },
      {
        pergunta: "Cite três tarefas de front-end em que o Node.js participa.",
        resposta:
          "Empacotar e compilar o código (bundler), rodar o servidor de desenvolvimento com recarga automática, renderizar no servidor (SSR) ou gerar páginas estáticas, executar testes e servir a API que a interface chama.",
      },
      {
        pergunta: "Onde deve ficar a chave secreta de um serviço de pagamento?",
        resposta:
          "No servidor (Node.js), em variável de ambiente. O front-end chama a sua API, e é ela que usa a chave. Nunca no pacote enviado ao navegador.",
      },
    ],
  },
  en: {
    titulo: "Front-end with Node.js",
    pergunta: "Is it possible to build a front-end application with Node.js?",
    porqueEsteMetodo:
      "The question blends two readings (the interface running on Node.js, or being built with it). Comparing “Node.js as a tool” and “front end in the browser” side by side separates them and shows where each one fits.",
    resposta30s:
      "Partly. Node.js **does not run in the browser**: the interface users see is still HTML, CSS and JavaScript executed there. But Node.js underpins the modern front end: it runs **bundlers and development servers**, **builds and tests** the code, does **server-side rendering (SSR)** and serves the **APIs** the interface consumes. So you can build the front end **with** Node.js, but the front end itself runs in the browser.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Node.js (server and tooling)", "Front end in the browser"],
        linhas: [
          [
            "Where it runs",
            "On your machine and on the server: terminal, CI, production",
            "In the browser of whoever uses the application",
          ],
          [
            "What it delivers",
            "Build, development server, SSR, tests, APIs",
            "The interface: HTML, CSS, JavaScript and user events",
          ],
          [
            "Available APIs",
            "`node:fs`, `node:http`, `process`; no `document` or `window`",
            "DOM, `window`, `localStorage`, `fetch`; no direct access to disk or database",
          ],
          [
            "Who can see the code",
            "Only whoever has access to the server",
            "Any user can inspect what the browser downloaded",
          ],
          [
            "Secrets",
            "Can live here, in environment variables",
            "Never: everything shipped in the browser bundle is public",
          ],
          [
            "Modules",
            "CommonJS and ES Modules; packages come from `node_modules`",
            "ES Modules; a bundler usually combines everything before shipping",
          ],
          [
            "Examples",
            "Vite, webpack, `npm run build`, Next.js (the server part)",
            "React, Vue, Angular or Svelte running on the page",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Minimal SSR: Node.js builds the HTML",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          "",
          "const escape = (s) => s.replace(/[&<>\"']/g, (c) => `&#${c.charCodeAt(0)};`);",
          "",
          "createServer((req, res) => {",
          '  const url = new URL(req.url, "http://localhost");',
          '  const name = url.searchParams.get("name") ?? "visitor";',
          '  res.setHeader("Content-Type", "text/html; charset=utf-8");',
          "  res.end(`<h1>Hello, ${escape(name)}</h1>`); // the browser only displays it",
          "}).listen(3000);",
        ].join("\n"),
        nota: "Frameworks such as Next.js and Nuxt do this at scale, and then the browser’s JavaScript takes over interactivity. The `escape` helper keeps the URL parameter from injecting HTML (XSS).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Node.js **builds and serves**; the browser **runs the interface**. Use Node.js around the front end (build, development server, SSR, API). The code that touches the screen must run in the browser. Files, databases and secrets stay on the Node.js side, exposed to the front end through an API.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The premise of the question",
        texto:
          "“Building a front end with Node.js” can mean (1) the interface **running** on Node.js, which does not happen because Node.js has no DOM, or (2) the interface being **built and served** with Node.js, the common and true case. In an interview, say which reading you are taking. There are also desktop applications (such as those built with Electron) that combine Node.js with an embedded browser, but that is another scenario.",
      },
    ],
    armadilhas: [
      "Using `document` or `window` in a script that runs on Node.js (it throws a `ReferenceError`), or expecting `fs` in the browser.",
      "Putting API keys in environment variables that the bundler embeds in browser code: they become public.",
      "Confusing SSR with “running the front end on the server”: the server produces the initial HTML, but interactivity still depends on JavaScript in the browser.",
      'Expecting `require("fs")` to work in code shipped to the browser: without a bundler and an equivalent, it does not.',
    ],
    autoteste: [
      {
        pergunta: "Why can Node.js not manipulate the DOM?",
        resposta:
          "Because the DOM is a browser API: Node.js has no `document` or `window`. (Libraries such as jsdom simulate the DOM in tests and in some SSR uses.)",
      },
      {
        pergunta: "Name three front-end tasks in which Node.js takes part.",
        resposta:
          "Bundling and compiling the code, running the development server with automatic reload, server-side rendering (SSR) or generating static pages, running tests and serving the API the interface calls.",
      },
      {
        pergunta: "Where should the secret key of a payment service live?",
        resposta:
          "On the server (Node.js), in an environment variable. The front end calls your API, and the API uses the key. Never in the bundle shipped to the browser.",
      },
    ],
  },
};
