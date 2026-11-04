import type { Pergunta } from "../../tipos";

// Q27 · Ajax vs Node.js
export const q27: Pergunta = {
  numero: 27,
  modulo: "turing-intermediarias",
  metodo: "compare",
  pt: {
    titulo: "Ajax vs Node.js",
    pergunta: "Como o Ajax é diferente do Node.js?",
    porqueEsteMetodo:
      "É um “X vs Y”, mas os dois não são do mesmo tipo: a matriz deixa isso visível linha a linha, e a regra de decisão troca a falsa competição pela pergunta certa (quem pede e quem responde).",
    resposta30s:
      "**Ajax** é uma **técnica do navegador**: fazer requisições assíncronas (`XMLHttpRequest` ou `fetch`) e atualizar parte da página sem recarregá-la. **Node.js** é um **ambiente de execução de JavaScript fora do navegador**, usado sobretudo no servidor. Não são alternativas: o navegador faz a chamada Ajax e um servidor Node.js pode atendê-la.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Ajax", "Node.js"],
        linhas: [
          [
            "O que é",
            "Uma técnica (não é linguagem nem biblioteca): pedir dados ao servidor sem recarregar a página",
            "Um ambiente de execução de JavaScript fora do navegador, construído sobre o motor V8",
          ],
          [
            "Onde roda",
            "No navegador, do lado do cliente",
            "No servidor ou na máquina de quem desenvolve (terminal, scripts, ferramentas de build)",
          ],
          [
            "Como se faz",
            "`XMLHttpRequest` (a forma original) ou `fetch` (a forma atual)",
            "Módulos nativos como `node:http` e `node:fs`; as versões atuais também trazem `fetch`",
          ],
          [
            "Papel na conversa",
            "Cliente: envia a requisição e atualiza a tela com a resposta",
            "Servidor: recebe a requisição, consulta banco ou arquivos e responde (também pode ser cliente de outra API)",
          ],
          [
            "O que enxerga",
            "DOM, `window`, cookies; limitado pela política de mesma origem e pelo CORS; sem acesso ao disco",
            "Sistema de arquivos, rede, processos, variáveis de ambiente; sem DOM",
          ],
          [
            "Formato dos dados",
            "Hoje quase sempre JSON; o “X” de XML ficou só no nome",
            "Qualquer formato: JSON, HTML, binário, streams",
          ],
          [
            "Exemplo de uso",
            "Busca com sugestões, “curtir” sem recarregar, enviar formulário em segundo plano",
            "API REST, servidor de tempo real, CLI, bundler, servidor de arquivos",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os dois lados da mesma conversa",
        legenda: "JavaScript",
        codigo: [
          "// --- no navegador (Ajax moderno, com fetch) ---",
          'const resposta = await fetch("/api/produtos?busca=filtro");',
          "const produtos = await resposta.json();",
          "atualizarLista(produtos); // mexe no DOM; a página não recarrega",
          "",
          "// --- no servidor (Node.js) ---",
          'import { createServer } from "node:http";',
          "",
          "createServer((req, res) => {",
          '  res.setHeader("Content-Type", "application/json");',
          '  res.end(JSON.stringify([{ id: 1, nome: "Filtro de óleo" }]));',
          "}).listen(3000);",
        ].join("\n"),
        nota: "O servidor poderia ser escrito em Java, Python ou PHP, e a chamada do navegador seria idêntica. Ajax não depende do Node.js.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Não existe “Ajax ou Node.js”. A pergunta útil é: **quem faz a requisição e quem a atende?** Ajax é o lado que **pede**, dentro do navegador. Node.js é um dos lados que pode **responder** (ou o ambiente que roda ferramentas). Escolha o back-end pelas necessidades do projeto; o Ajax continua igual.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Confusões comuns",
        texto:
          "Ajax significa “JavaScript e XML assíncronos”, mas isso é herança histórica: não exige XML nem biblioteca. E uma chamada `fetch` feita **pelo Node.js** a outra API não é Ajax no sentido estrito, porque não há página sendo atualizada; também não passa pelo CORS, que é uma regra dos navegadores.",
      },
    ],
    armadilhas: [
      "Tratar os dois como concorrentes ou como coisas do mesmo tipo: um é uma técnica, o outro é um ambiente de execução.",
      "Achar que Ajax exige XML ou jQuery: hoje se usa JSON e o `fetch` nativo.",
      "Achar que Ajax só funciona com servidor Node.js: o servidor pode estar em qualquer linguagem.",
      "Esquecer que CORS e cookies são regras do navegador: afetam o Ajax, mas não as chamadas feitas de dentro do Node.js.",
    ],
    autoteste: [
      {
        pergunta: "Ajax roda no navegador ou no servidor? E o Node.js?",
        resposta:
          "Ajax roda no navegador (cliente). O Node.js roda fora do navegador, normalmente no servidor ou na máquina de desenvolvimento.",
      },
      {
        pergunta: "Dê um exemplo em que os dois trabalham juntos.",
        resposta:
          'Uma página de busca chama `fetch("/api/produtos?busca=...")` (Ajax); um servidor Node.js, com `node:http` ou Express, consulta o banco e devolve JSON; a página atualiza a lista sem recarregar.',
      },
      {
        pergunta: "Por que o “X” de Ajax ficou só no nome?",
        resposta:
          "Porque o formato de troca dominante passou a ser JSON, não XML. A técnica (requisição assíncrona sem recarregar a página) é a mesma.",
      },
    ],
  },
  en: {
    titulo: "Ajax vs Node.js",
    pergunta: "How is Ajax different from Node.js?",
    porqueEsteMetodo:
      "It is an “X vs Y” question, but the two are not the same kind of thing: the matrix makes that visible row by row, and the decision rule swaps the false competition for the right question (who asks and who answers).",
    resposta30s:
      "**Ajax** is a **browser technique**: making asynchronous requests (`XMLHttpRequest` or `fetch`) and updating part of the page without reloading it. **Node.js** is a **runtime for JavaScript outside the browser**, mostly used on the server. They are not alternatives: the browser makes the Ajax call and a Node.js server can answer it.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Ajax", "Node.js"],
        linhas: [
          [
            "What it is",
            "A technique (not a language or a library): asking the server for data without reloading the page",
            "A JavaScript runtime outside the browser, built on the V8 engine",
          ],
          [
            "Where it runs",
            "In the browser, on the client side",
            "On the server or on the developer’s machine (terminal, scripts, build tools)",
          ],
          [
            "How it is done",
            "`XMLHttpRequest` (the original way) or `fetch` (the current way)",
            "Built-in modules such as `node:http` and `node:fs`; current versions also ship `fetch`",
          ],
          [
            "Role in the conversation",
            "Client: sends the request and updates the screen with the response",
            "Server: receives the request, queries a database or files and answers (it can also be a client of another API)",
          ],
          [
            "What it can see",
            "DOM, `window`, cookies; limited by the same-origin policy and CORS; no disk access",
            "File system, network, processes, environment variables; no DOM",
          ],
          [
            "Data format",
            "Nowadays almost always JSON; the “X” for XML survives only in the name",
            "Any format: JSON, HTML, binary, streams",
          ],
          [
            "Example use",
            "Search suggestions, a “like” button without reloading, submitting a form in the background",
            "REST API, real-time server, CLI, bundler, file server",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Both sides of the same conversation",
        legenda: "JavaScript",
        codigo: [
          "// --- in the browser (modern Ajax, using fetch) ---",
          'const response = await fetch("/api/products?search=filter");',
          "const products = await response.json();",
          "updateList(products); // touches the DOM; the page does not reload",
          "",
          "// --- on the server (Node.js) ---",
          'import { createServer } from "node:http";',
          "",
          "createServer((req, res) => {",
          '  res.setHeader("Content-Type", "application/json");',
          '  res.end(JSON.stringify([{ id: 1, name: "Oil filter" }]));',
          "}).listen(3000);",
        ].join("\n"),
        nota: "The server could be written in Java, Python or PHP and the browser call would be identical. Ajax does not depend on Node.js.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "There is no “Ajax or Node.js”. The useful question is: **who makes the request and who answers it?** Ajax is the side that **asks**, inside the browser. Node.js is one of the sides that can **answer** (or the environment that runs tooling). Pick the back end by the needs of the project; Ajax stays the same.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Common confusions",
        texto:
          "Ajax stands for “Asynchronous JavaScript and XML”, but that is historical baggage: it requires neither XML nor a library. And a `fetch` call made **by Node.js** to another API is not Ajax in the strict sense, because no page is being updated; it also does not go through CORS, which is a browser rule.",
      },
    ],
    armadilhas: [
      "Treating the two as competitors or as the same kind of thing: one is a technique, the other is a runtime.",
      "Thinking Ajax requires XML or jQuery: today you use JSON and the native `fetch`.",
      "Thinking Ajax only works with a Node.js server: the server can be written in any language.",
      "Forgetting that CORS and cookies are browser rules: they affect Ajax, but not calls made from inside Node.js.",
    ],
    autoteste: [
      {
        pergunta: "Does Ajax run in the browser or on the server? And Node.js?",
        resposta:
          "Ajax runs in the browser (client). Node.js runs outside the browser, usually on the server or on the development machine.",
      },
      {
        pergunta: "Give an example where both work together.",
        resposta:
          'A search page calls `fetch("/api/products?search=...")` (Ajax); a Node.js server, using `node:http` or Express, queries the database and returns JSON; the page updates the list without reloading.',
      },
      {
        pergunta: "Why does the “X” in Ajax survive only in the name?",
        resposta:
          "Because the dominant exchange format became JSON, not XML. The technique (an asynchronous request without reloading the page) is the same.",
      },
    ],
  },
};
