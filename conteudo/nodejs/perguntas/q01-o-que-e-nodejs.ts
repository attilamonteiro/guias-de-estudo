import type { Pergunta } from "../../tipos";

// Q01 · O que é o Node.js
export const q01: Pergunta = {
  numero: 1,
  modulo: "turing-basicas",
  metodo: "feynman",
  pt: {
    titulo: "O que é o Node.js",
    pergunta: "O que é Node.js e para que ele serve?",
    porqueEsteMetodo:
      "“O que é” é uma pergunta de definição, e definição só fica de pé quando dá para explicá-la a um iniciante: uma analogia simples, o mecanismo real por baixo e o ponto em que a analogia deixa de valer.",
    resposta30s:
      "O **Node.js** é um **ambiente de execução (runtime) de JavaScript** fora do navegador. Ele junta o motor **V8** (que executa o JavaScript), a biblioteca **libuv** (E/S assíncrona e laço de eventos) e uma biblioteca padrão com arquivos, rede e processos. Serve para construir **APIs e microsserviços, aplicações em tempo real, ferramentas de linha de comando e de build** e servidores com renderização no servidor. É **código aberto**, com licença permissiva (MIT), mantido pela comunidade e pela OpenJS Foundation.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense em um hotel com uma única recepcionista muito organizada. Cada hóspede faz um pedido (toalhas, um táxi, café no quarto). Ela anota, passa o pedido ao setor certo e, sem ficar parada esperando, já atende o próximo hóspede. Quando um setor termina, avisa a recepção, e ela repassa a resposta ao hóspede. Um hotel assim atende muita gente ao mesmo tempo com pouca gente na recepção.",
        tecnico:
          "No Node.js, a recepcionista é a **thread principal**, que executa o seu JavaScript e o **laço de eventos** (event loop). Os setores são o sistema operacional e o pool de threads do libuv, que fazem a E/S de verdade (ler arquivo, consultar banco, receber dados da rede) enquanto o seu código segue em frente. O aviso de “terminou” volta como **callback, promise ou evento**. Esse modelo se chama **E/S não bloqueante, orientada a eventos**. Em volta dele, o Node.js oferece módulos nativos (`node:fs`, `node:http`, `node:path`…) e o **npm**, o gerenciador de pacotes que dá acesso a um enorme ecossistema de bibliotecas.",
        limite:
          "A recepcionista é uma só: se ela mesma resolver um problema longo (montar à mão um relatório gigante), ninguém mais é atendido até ela terminar. Do mesmo jeito, uma conta pesada de CPU no seu JavaScript trava o laço de eventos e todas as requisições ficam esperando. Nesse caso o trabalho deve ser delegado (workers, outro processo ou outro serviço). Veja Q2 e Q16.",
      },
      {
        tipo: "tabela",
        titulo: "O que dá para construir com o Node.js",
        colunas: ["Uso", "Exemplos", "Por que combina"],
        linhas: [
          [
            "APIs e microsserviços",
            "API REST ou GraphQL, serviços que falam com banco de dados e filas",
            "Muitas conexões simultâneas esperando banco e rede; JSON é nativo em JavaScript",
          ],
          [
            "Tempo real",
            "Chat, notificações, painéis ao vivo (WebSocket)",
            "Conexões longas e abertas custam pouco no modelo orientado a eventos",
          ],
          [
            "Ferramentas de linha de comando",
            "Scripts de automação, geradores de projeto, CLIs",
            "Acesso a arquivos e processos, e distribuição simples pelo npm",
          ],
          [
            "Ferramentas de build e desenvolvimento",
            "Bundlers, linters, formatadores, executores de teste",
            "Boa parte do ferramental de front-end é escrita em JavaScript e roda no Node.js",
          ],
          [
            "Servidores de arquivos e streaming",
            "Upload e download, proxies, processamento de arquivos grandes",
            "Streams processam os dados em pedaços, sem carregar tudo na memória",
          ],
          [
            "Renderização no servidor (SSR)",
            "Aplicações React, Vue e semelhantes que geram o HTML no servidor",
            "A mesma linguagem e o mesmo código de interface no servidor e no navegador",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O menor servidor HTTP",
        legenda: "servidor.mjs",
        codigo: `import { createServer } from "node:http";

const servidor = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Olá do Node.js!");
});

servidor.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});`,
        nota: "Rode com `node servidor.mjs` e abra o endereço no navegador. Nenhum framework: o próprio Node.js já traz o módulo `node:http`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que o Node.js não é",
        texto:
          "Não é uma linguagem (a linguagem é o JavaScript), nem um framework (Express, Fastify e NestJS são bibliotecas que rodam sobre ele) e nem uma biblioteca do navegador: não existem `window` nem `document`, e sim `process`, `fs`, `http` e companhia.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "É de código aberto?",
        texto:
          "Sim. O Node.js é software livre com licença permissiva (MIT): você pode usar, estudar e distribuir, inclusive em produtos comerciais. O projeto é mantido pela comunidade de colaboradores e hospedado pela OpenJS Foundation, e o código está aberto no GitHub.",
      },
    ],
    armadilhas: [
      "Chamar o Node.js de linguagem ou de framework: ele é o ambiente de execução do JavaScript, e o Express, por exemplo, é uma biblioteca que roda nele.",
      "Achar que serve para tudo: tarefas longas de CPU no laço de eventos travam o servidor; use workers, processos separados ou outro serviço.",
      "Esperar `window` e `document` no Node.js: esses objetos são do navegador.",
      "Entender “uma thread só” como “o processo inteiro tem uma única thread”: o seu JavaScript roda em uma thread, mas o Node.js usa outras por baixo (veja Q16).",
    ],
    autoteste: [
      {
        pergunta: "O Node.js é uma linguagem, um framework ou um runtime?",
        resposta:
          "Um runtime: o ambiente que executa JavaScript fora do navegador (V8 mais libuv mais as bibliotecas nativas). A linguagem é o JavaScript.",
      },
      {
        pergunta: "Por que o Node.js lida bem com muitas conexões simultâneas?",
        resposta:
          "Porque a E/S é não bloqueante: enquanto uma requisição espera o banco ou a rede, o laço de eventos atende outras, sem criar uma thread por conexão.",
      },
      {
        pergunta: "O Node.js é de código aberto?",
        resposta:
          "Sim. Licença permissiva (MIT), código aberto no GitHub e mantido pela comunidade e pela OpenJS Foundation.",
      },
    ],
  },
  en: {
    titulo: "What Node.js is",
    pergunta: "What is Node.js and what is it used for?",
    porqueEsteMetodo:
      "“What is it” is a definition question, and a definition only stands when you can explain it to a beginner: a simple analogy, the real mechanism underneath and the point where the analogy stops working.",
    resposta30s:
      "**Node.js** is a **JavaScript runtime** that runs outside the browser. It combines the **V8** engine (which executes the JavaScript), the **libuv** library (asynchronous I/O and the event loop) and a standard library for files, networking and processes. It is used to build **APIs and microservices, real-time applications, command-line and build tools** and server-rendered apps. It is **open source**, with a permissive license (MIT), maintained by the community and the OpenJS Foundation.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a hotel with a single, very organized receptionist. Each guest makes a request (towels, a taxi, coffee in the room). She writes it down, hands it to the right department and, instead of standing around waiting, serves the next guest. When a department finishes, it tells the front desk, and she passes the answer on to the guest. A hotel like that serves a lot of people at once with very few people at the desk.",
        tecnico:
          "In Node.js, the receptionist is the **main thread**, which runs your JavaScript and the **event loop**. The departments are the operating system and libuv’s thread pool, which do the real I/O (reading a file, querying a database, receiving network data) while your code moves on. The “done” notice comes back as a **callback, promise or event**. This model is called **non-blocking, event-driven I/O**. Around it, Node.js ships built-in modules (`node:fs`, `node:http`, `node:path`…) and **npm**, the package manager that opens the door to a huge ecosystem of libraries.",
        limite:
          "There is only one receptionist: if she handles a long problem herself (hand-building a giant report), nobody else gets served until she finishes. Likewise, a heavy CPU computation in your JavaScript blocks the event loop and every request waits. In that case the work should be delegated (workers, another process or another service). See Q2 and Q16.",
      },
      {
        tipo: "tabela",
        titulo: "What you can build with Node.js",
        colunas: ["Use", "Examples", "Why it fits"],
        linhas: [
          [
            "APIs and microservices",
            "REST or GraphQL APIs, services that talk to databases and queues",
            "Many simultaneous connections waiting on the database and network; JSON is native to JavaScript",
          ],
          [
            "Real time",
            "Chat, notifications, live dashboards (WebSocket)",
            "Long-lived open connections are cheap in the event-driven model",
          ],
          [
            "Command-line tools",
            "Automation scripts, project generators, CLIs",
            "Access to files and processes, and easy distribution through npm",
          ],
          [
            "Build and development tooling",
            "Bundlers, linters, formatters, test runners",
            "Much of the front-end toolchain is written in JavaScript and runs on Node.js",
          ],
          [
            "File and streaming servers",
            "Uploads and downloads, proxies, large file processing",
            "Streams process data in chunks, without loading everything into memory",
          ],
          [
            "Server-side rendering (SSR)",
            "React, Vue and similar apps that generate HTML on the server",
            "The same language and the same UI code on the server and in the browser",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The smallest HTTP server",
        legenda: "server.mjs",
        codigo: `import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Hello from Node.js!");
});

server.listen(3000, () => {
  console.log("Server at http://localhost:3000");
});`,
        nota: "Run it with `node server.mjs` and open the address in the browser. No framework: Node.js already ships the `node:http` module.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What Node.js is not",
        texto:
          "It is not a language (the language is JavaScript), nor a framework (Express, Fastify and NestJS are libraries that run on top of it), nor a browser library: there is no `window` or `document`, but there are `process`, `fs`, `http` and friends.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Is it open source?",
        texto:
          "Yes. Node.js is free software under a permissive license (MIT): you can use, study and distribute it, including in commercial products. The project is maintained by a community of contributors and hosted by the OpenJS Foundation, and the code is open on GitHub.",
      },
    ],
    armadilhas: [
      "Calling Node.js a language or a framework: it is the runtime for JavaScript, and Express, for example, is a library that runs on it.",
      "Thinking it fits everything: long CPU tasks on the event loop freeze the server; use workers, separate processes or another service.",
      "Expecting `window` and `document` in Node.js: those objects belong to the browser.",
      "Reading “single-threaded” as “the whole process has only one thread”: your JavaScript runs on one thread, but Node.js uses others underneath (see Q16).",
    ],
    autoteste: [
      {
        pergunta: "Is Node.js a language, a framework or a runtime?",
        resposta:
          "A runtime: the environment that runs JavaScript outside the browser (V8 plus libuv plus the built-in libraries). The language is JavaScript.",
      },
      {
        pergunta: "Why does Node.js handle many simultaneous connections well?",
        resposta:
          "Because I/O is non-blocking: while one request waits on the database or network, the event loop serves others, without creating a thread per connection.",
      },
      {
        pergunta: "Is Node.js open source?",
        resposta:
          "Yes. Permissive license (MIT), open code on GitHub, maintained by the community and the OpenJS Foundation.",
      },
    ],
  },
};
