import type { Pergunta } from "../../tipos";

// Q40 · Node.js vs Angular
export const q40: Pergunta = {
  numero: 40,
  modulo: "turing-intermediarias",
  metodo: "compare",
  pt: {
    titulo: "Node.js vs Angular",
    pergunta: "Node.js vs Angular: qual é a diferença?",
    porqueEsteMetodo:
      "É um “X vs Y” em que os dois lados pertencem a categorias diferentes: a matriz deixa isso visível e a regra de decisão troca o “qual escolho?” por “onde o código vai rodar?”.",
    resposta30s:
      "**Node.js** é um **ambiente de execução** (runtime) que roda JavaScript fora do navegador: servidor, terminal, ferramentas. **Angular** é um **framework de front-end**, escrito em TypeScript, para montar interfaces que rodam **no navegador**. Não são concorrentes, são camadas diferentes e costumam trabalhar juntos: as ferramentas do Angular rodam em Node.js, e o app Angular normalmente consome uma API feita em Node.js.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Node.js", "Angular"],
        linhas: [
          [
            "O que é",
            "Ambiente de execução de JavaScript fora do navegador, construído sobre o motor V8",
            "Framework de front-end de código aberto, mantido pelo Google, para aplicações web de interface rica",
          ],
          [
            "Onde roda",
            "No servidor, no terminal ou na máquina de desenvolvimento",
            "No navegador do usuário; o resultado final são arquivos estáticos (HTML, CSS e JavaScript)",
          ],
          [
            "Linguagem",
            "JavaScript (TypeScript por meio de compilação ou de ferramentas)",
            "TypeScript, compilado para JavaScript pelas ferramentas do projeto",
          ],
          [
            "Problema que resolve",
            "Executar lógica fora do navegador: APIs, arquivos, rede, scripts e linhas de comando",
            "Organizar a interface: componentes, rotas, formulários, injeção de dependência e cliente HTTP",
          ],
          [
            "Acesso a recursos",
            "Sistema de arquivos, rede, processos e variáveis de ambiente; não existe DOM",
            "DOM e APIs do navegador; sem acesso livre ao disco nem a portas do servidor",
          ],
          [
            "Estrutura imposta",
            "Nenhuma: você escolhe bibliotecas e organização (Express, Fastify, NestJS…)",
            "Bastante: componentes, serviços, roteador e CLI com convenções próprias",
          ],
          [
            "Quem consome",
            "Navegadores, apps móveis e outros serviços, por meio de uma API",
            "Pessoas, pela tela do navegador; fala com o servidor por HTTP",
          ],
          [
            "Como se relacionam",
            "Roda a CLI, o build, o servidor de desenvolvimento e a renderização no servidor do Angular, e pode hospedar a API que ele chama",
            "Exige Node.js na máquina de desenvolvimento e costuma consumir uma API (em Node.js ou não)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte **onde o código vai rodar**. Interface no navegador: um framework de front-end (Angular, React, Vue…). Servidor, API, script ou ferramenta: Node.js. Na prática os dois andam juntos: o Angular é construído e servido, durante o desenvolvimento, por ferramentas que rodam em Node.js, e o app chama uma API que pode ser Node.js. A sigla MEAN (MongoDB, Express, Angular, Node.js) nasceu dessa combinação.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Comparar categorias diferentes",
        texto:
          "Node.js e Angular não competem: um é runtime, o outro é framework de front-end. Os pares naturais são Angular vs React/Vue (front-end) e Node.js vs Deno/Bun (runtimes). Também não confunda **Angular** (a versão 2 em diante) com **AngularJS** (a série 1.x, antecessora e hoje sem suporte).",
      },
      {
        tipo: "codigo",
        titulo: "Onde eles se encontram",
        legenda: "terminal",
        codigo:
          "node --version               # a CLI do Angular precisa do Node.js instalado\nnpm install -g @angular/cli  # a CLI do Angular é um programa Node.js\nng new minha-app             # cria o projeto (as ferramentas rodam no Node.js)\nng serve                     # servidor de desenvolvimento; o app roda no navegador",
        nota: "A versão de Node.js aceita depende da versão do Angular: confira a documentação do Angular. A opção -g é explicada na Q03.",
      },
    ],
    armadilhas: [
      "Tratar como alternativas que se excluem: “escolher entre Node.js e Angular” não faz sentido, porque resolvem problemas diferentes.",
      "Achar que o app Angular em produção roda dentro do Node.js: o resultado do build são arquivos estáticos que qualquer servidor web entrega (o Node.js só entra se houver renderização no servidor).",
      "Chamar o Node.js de framework, ou achar que um componente Angular consegue ler arquivos do disco do usuário.",
      "Confundir AngularJS (1.x, o antecessor) com o Angular atual: são projetos diferentes.",
    ],
    autoteste: [
      {
        pergunta: "Node.js é um framework? E o Angular?",
        resposta:
          "O Node.js é um ambiente de execução (runtime) de JavaScript fora do navegador. O Angular é um framework de front-end, em TypeScript, para construir interfaces que rodam no navegador.",
      },
      {
        pergunta: "Onde cada um roda e de que forma eles se encontram num projeto?",
        resposta:
          "O Angular roda no navegador; o Node.js, no servidor ou na máquina de desenvolvimento. Eles se encontram na CLI e no build do Angular (que rodam em Node.js), na renderização no servidor e na API em Node.js que o app Angular consome.",
      },
    ],
  },
  en: {
    titulo: "Node.js vs Angular",
    pergunta: "Node.js vs Angular: what is the difference?",
    porqueEsteMetodo:
      "It is an “X vs Y” where the two sides belong to different categories: the matrix makes that visible and the decision rule swaps “which one do I pick?” for “where will the code run?”.",
    resposta30s:
      "**Node.js** is a **runtime** that executes JavaScript outside the browser: servers, terminals, tooling. **Angular** is a **front-end framework**, written in TypeScript, for building interfaces that run **in the browser**. They are not competitors, they are different layers and usually work together: Angular’s tooling runs on Node.js, and an Angular app normally consumes an API built with Node.js.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Node.js", "Angular"],
        linhas: [
          [
            "What it is",
            "A runtime that executes JavaScript outside the browser, built on the V8 engine",
            "An open-source front-end framework, maintained by Google, for rich web application interfaces",
          ],
          [
            "Where it runs",
            "On the server, in the terminal or on the development machine",
            "In the user’s browser; the final output is static files (HTML, CSS and JavaScript)",
          ],
          [
            "Language",
            "JavaScript (TypeScript through compilation or tooling)",
            "TypeScript, compiled to JavaScript by the project’s tooling",
          ],
          [
            "Problem it solves",
            "Running logic outside the browser: APIs, files, networking, scripts and command lines",
            "Organizing the interface: components, routing, forms, dependency injection and an HTTP client",
          ],
          [
            "Access to resources",
            "File system, network, processes and environment variables; there is no DOM",
            "The DOM and browser APIs; no free access to the disk or to server ports",
          ],
          [
            "Imposed structure",
            "None: you choose libraries and organization (Express, Fastify, NestJS…)",
            "A lot: components, services, router and a CLI with their own conventions",
          ],
          [
            "Who consumes it",
            "Browsers, mobile apps and other services, through an API",
            "People, through the browser screen; it talks to the server over HTTP",
          ],
          [
            "How they relate",
            "Runs Angular’s CLI, build, development server and server-side rendering, and can host the API it calls",
            "Requires Node.js on the development machine and usually consumes an API (Node.js or not)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask **where the code will run**. An interface in the browser: a front-end framework (Angular, React, Vue…). A server, API, script or tool: Node.js. In practice the two go together: during development Angular is built and served by tools that run on Node.js, and the app calls an API that may be Node.js. The MEAN acronym (MongoDB, Express, Angular, Node.js) came from that combination.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Comparing different categories",
        texto:
          "Node.js and Angular do not compete: one is a runtime, the other is a front-end framework. The natural pairs are Angular vs React/Vue (front-end) and Node.js vs Deno/Bun (runtimes). Also do not mix up **Angular** (version 2 onwards) with **AngularJS** (the 1.x series, its predecessor, no longer supported).",
      },
      {
        tipo: "codigo",
        titulo: "Where they meet",
        legenda: "terminal",
        codigo:
          "node --version               # the Angular CLI needs Node.js installed\nnpm install -g @angular/cli  # the Angular CLI is a Node.js program\nng new my-app                # creates the project (the tooling runs on Node.js)\nng serve                     # development server; the app runs in the browser",
        nota: "The Node.js version accepted depends on the Angular version: check the Angular documentation. The -g option is explained in Q03.",
      },
    ],
    armadilhas: [
      "Treating them as mutually exclusive choices: “choosing between Node.js and Angular” makes no sense, because they solve different problems.",
      "Thinking a production Angular app runs inside Node.js: the build output is static files that any web server can deliver (Node.js only enters if you use server-side rendering).",
      "Calling Node.js a framework, or thinking an Angular component can read files from the user’s disk.",
      "Mixing up AngularJS (1.x, the predecessor) with current Angular: they are different projects.",
    ],
    autoteste: [
      {
        pergunta: "Is Node.js a framework? And Angular?",
        resposta:
          "Node.js is a runtime that executes JavaScript outside the browser. Angular is a front-end framework, in TypeScript, for building interfaces that run in the browser.",
      },
      {
        pergunta: "Where does each one run and how do they meet in a project?",
        resposta:
          "Angular runs in the browser; Node.js runs on the server or on the development machine. They meet in Angular’s CLI and build (which run on Node.js), in server-side rendering and in the Node.js API that the Angular app consumes.",
      },
    ],
  },
};
