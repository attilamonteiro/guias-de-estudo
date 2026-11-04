import type { Pergunta } from "../../tipos";

// Q18 · Node vs JavaScript
export const q18: Pergunta = {
  numero: 18,
  modulo: "turing-basicas",
  metodo: "compare",
  pt: {
    titulo: "Node vs JavaScript",
    pergunta: "Node vs JavaScript: qual é a diferença?",
    porqueEsteMetodo:
      "É um “X vs Y” clássico, e a matriz resolve rápido: de um lado a linguagem, do outro um dos ambientes onde ela roda. O ponto da entrevista é perceber que os dois não são concorrentes.",
    resposta30s:
      "**JavaScript é a linguagem**, definida pelo padrão ECMAScript. **Node.js é um ambiente de execução** que roda JavaScript fora do navegador: usa o motor V8 e acrescenta APIs de servidor (arquivos, rede, processos). Sim, o Node.js usa JavaScript. A pergunta provavelmente quer comparar o JavaScript do navegador com o JavaScript no Node.js, e a diferença está nas APIs e nos módulos que cada ambiente oferece ao redor da mesma linguagem.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "A linguagem e um de seus ambientes",
        colunas: ["Aspecto", "JavaScript (linguagem)", "Node.js (ambiente de execução)"],
        linhas: [
          [
            "O que é",
            "Linguagem de programação, definida pela especificação ECMAScript",
            "Runtime que executa JavaScript fora do navegador, com APIs próprias",
          ],
          [
            "Onde roda",
            "Em qualquer ambiente que tenha um motor: navegadores, Node.js, Deno, Bun",
            "No servidor, na máquina de quem desenvolve, em ferramentas de linha de comando e em contêineres",
          ],
          [
            "Motor",
            "Nenhum em particular: cada ambiente traz o seu (V8, SpiderMonkey, JavaScriptCore)",
            "Embute o V8, o mesmo motor do Chrome",
          ],
          [
            "APIs disponíveis",
            "O núcleo da linguagem: `Array`, `Map`, `Promise`, `JSON`, classes, `async`/`await`",
            "O núcleo da linguagem mais `node:fs`, `node:http`, `process`, `Buffer` e outros módulos nativos",
          ],
          [
            "APIs de navegador",
            "`document`, `window`, DOM e `localStorage` pertencem ao navegador, não à linguagem",
            "Não há DOM nem `window`; o objeto global é `globalThis` (também `global`)",
          ],
          [
            "Módulos",
            "ES Modules (`import`/`export`) são o padrão da linguagem",
            "CommonJS (`require`) e ES Modules (`import`)",
          ],
          [
            "Acesso ao sistema",
            "Depende do ambiente; no navegador, tudo roda isolado em um sandbox",
            "Amplo: arquivos, rede, processos e variáveis de ambiente, com as permissões de quem executa",
          ],
          [
            "Quem define",
            "ECMA International (comitê TC39)",
            "Projeto de código aberto mantido pela comunidade (OpenJS Foundation), que segue o ECMAScript pelo V8",
          ],
        ],
        nota: "O Node.js tem incorporado várias Web APIs (`fetch`, `URL`, `AbortController`, `TextEncoder`), então a fronteira entre os dois ambientes não é fixa. Confira a documentação oficial da versão que você usa.",
      },
      {
        tipo: "codigo",
        titulo: "A mesma linguagem, outro ambiente",
        legenda: "JavaScript",
        codigo: `// Linguagem: igual nos dois ambientes
const dobro = (n) => n * 2;
console.log(dobro(21)); // 42

// Ambiente: o que existe ao redor muda
console.log(typeof document); // navegador: "object"   | Node.js: "undefined"
console.log(typeof process); //  navegador: "undefined" | Node.js: "object"

// Só no Node.js: ler um arquivo do disco
import { readFile } from "node:fs/promises";
const texto = await readFile("./dados.txt", "utf8");`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A relação entre os dois",
        texto:
          "Variáveis, funções, classes, `async`/`await` e o resto da linguagem funcionam do mesmo jeito nos dois lugares. O que muda é o que o ambiente oferece ao redor dela: DOM e `window` no navegador; sistema de arquivos, rede e processos no Node.js. Escolher o Node.js é escolher um ambiente de execução, não outra linguagem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A comparação mistura categorias",
        texto:
          "O Node.js não é uma linguagem, nem um framework, nem uma biblioteca, e também não é uma “versão do JavaScript para servidor”: o JavaScript é o mesmo. Por isso “Node vs JavaScript” é como comparar uma linguagem com uma de suas plataformas. Se a pergunta quer saber “JavaScript no navegador vs no Node.js”, responda pelas linhas de APIs e módulos da tabela.",
      },
    ],
    armadilhas: [
      "Dizer que o Node.js é uma linguagem, um framework ou uma biblioteca: é um ambiente de execução.",
      'Escrever código com `window`, `document` ou `localStorage` esperando que rode no Node.js, ou `require("fs")` esperando que rode no navegador.',
      "Achar que `async`/`await`, classes e `Promise` são do Node.js: são da linguagem e funcionam nos navegadores modernos.",
      "Achar que a versão do Node.js define a versão do JavaScript: o suporte vem do V8 que cada versão do Node.js embute, então confira a tabela de compatibilidade.",
    ],
    autoteste: [
      {
        pergunta: "O Node.js usa JavaScript?",
        resposta:
          "Sim. O Node.js executa código JavaScript, usando o motor V8, e acrescenta APIs de servidor como arquivos, rede e processos.",
      },
      {
        pergunta: "Cite duas diferenças práticas entre o JavaScript do navegador e o do Node.js.",
        resposta:
          "O navegador tem DOM, `window` e `localStorage`; o Node.js tem `node:fs`, `node:http` e `process`. O Node.js também oferece CommonJS (`require`) além dos ES Modules.",
      },
    ],
  },
  en: {
    titulo: "Node vs JavaScript",
    pergunta: "Node vs JavaScript: what is the difference?",
    porqueEsteMetodo:
      "It is a classic “X vs Y”, and the matrix settles it quickly: on one side the language, on the other one of the environments where it runs. The interview point is to notice that the two are not competitors.",
    resposta30s:
      "**JavaScript is the language**, defined by the ECMAScript standard. **Node.js is a runtime** that runs JavaScript outside the browser: it uses the V8 engine and adds server-side APIs (files, network, processes). Yes, Node.js uses JavaScript. The question probably means to compare browser JavaScript with JavaScript in Node.js, and the difference lies in the APIs and modules each environment offers around the same language.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The language and one of its environments",
        colunas: ["Aspect", "JavaScript (language)", "Node.js (runtime)"],
        linhas: [
          [
            "What it is",
            "A programming language, defined by the ECMAScript specification",
            "A runtime that executes JavaScript outside the browser, with its own APIs",
          ],
          [
            "Where it runs",
            "In any environment that has an engine: browsers, Node.js, Deno, Bun",
            "On the server, on the developer’s machine, in command-line tools and in containers",
          ],
          [
            "Engine",
            "None in particular: each environment brings its own (V8, SpiderMonkey, JavaScriptCore)",
            "Embeds V8, the same engine as Chrome",
          ],
          [
            "Available APIs",
            "The language core: `Array`, `Map`, `Promise`, `JSON`, classes, `async`/`await`",
            "The language core plus `node:fs`, `node:http`, `process`, `Buffer` and other built-in modules",
          ],
          [
            "Browser APIs",
            "`document`, `window`, the DOM and `localStorage` belong to the browser, not to the language",
            "There is no DOM or `window`; the global object is `globalThis` (also `global`)",
          ],
          [
            "Modules",
            "ES Modules (`import`/`export`) are the language standard",
            "CommonJS (`require`) and ES Modules (`import`)",
          ],
          [
            "System access",
            "Depends on the environment; in the browser everything runs isolated in a sandbox",
            "Broad: files, network, processes and environment variables, with the permissions of whoever runs it",
          ],
          [
            "Who defines it",
            "ECMA International (the TC39 committee)",
            "An open-source project maintained by the community (OpenJS Foundation), which follows ECMAScript through V8",
          ],
        ],
        nota: "Node.js has been adopting several Web APIs (`fetch`, `URL`, `AbortController`, `TextEncoder`), so the border between the two environments is not fixed. Check the official documentation for the version you use.",
      },
      {
        tipo: "codigo",
        titulo: "The same language, another environment",
        legenda: "JavaScript",
        codigo: `// Language: identical in both environments
const double = (n) => n * 2;
console.log(double(21)); // 42

// Environment: what exists around it changes
console.log(typeof document); // browser: "object"   | Node.js: "undefined"
console.log(typeof process); //  browser: "undefined" | Node.js: "object"

// Node.js only: read a file from disk
import { readFile } from "node:fs/promises";
const text = await readFile("./data.txt", "utf8");`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How the two relate",
        texto:
          "Variables, functions, classes, `async`/`await` and the rest of the language work the same way in both places. What changes is what the environment offers around it: the DOM and `window` in the browser; the file system, network and processes in Node.js. Choosing Node.js is choosing a runtime, not another language.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The comparison mixes categories",
        texto:
          "Node.js is not a language, a framework or a library, and it is not a “server version of JavaScript” either: the JavaScript is the same. That is why “Node vs JavaScript” is like comparing a language with one of its platforms. If the question wants “JavaScript in the browser vs in Node.js”, answer with the APIs and modules rows of the table.",
      },
    ],
    armadilhas: [
      "Saying Node.js is a language, a framework or a library: it is a runtime.",
      'Writing code with `window`, `document` or `localStorage` expecting it to run in Node.js, or `require("fs")` expecting it to run in the browser.',
      "Thinking `async`/`await`, classes and `Promise` belong to Node.js: they belong to the language and work in modern browsers.",
      "Thinking the Node.js version defines the JavaScript version: support comes from the V8 each Node.js version embeds, so check the compatibility table.",
    ],
    autoteste: [
      {
        pergunta: "Does Node.js use JavaScript?",
        resposta:
          "Yes. Node.js runs JavaScript code, using the V8 engine, and adds server-side APIs such as files, network and processes.",
      },
      {
        pergunta: "Name two practical differences between browser JavaScript and Node.js JavaScript.",
        resposta:
          "The browser has the DOM, `window` and `localStorage`; Node.js has `node:fs`, `node:http` and `process`. Node.js also offers CommonJS (`require`) besides ES Modules.",
      },
    ],
  },
};
