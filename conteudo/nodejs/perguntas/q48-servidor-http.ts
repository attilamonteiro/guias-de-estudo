import type { Pergunta } from "../../tipos";

// Q48 · Servidor HTTP
export const q48: Pergunta = {
  numero: 48,
  modulo: "turing-avancadas",
  metodo: "playbook",
  pt: {
    titulo: "Servidor HTTP",
    pergunta: "Como incluir um servidor HTTP no módulo Node?",
    porqueEsteMetodo:
      "Subir um servidor é um procedimento com ordem: importar, criar, rotear, responder, escutar e testar. Um playbook mostra cada passo com o sinal de que ele funcionou.",
    resposta30s:
      "A pergunta provavelmente quer dizer “como usar o módulo HTTP no Node”: ele **já vem embutido**, então não há nada para instalar. Você importa `node:http`, cria o servidor com **`createServer`** passando uma função que recebe `req` e `res`, responde com `res.end()` e começa a aceitar conexões com **`listen(porta)`**. Serve para aprender e para serviços pequenos; para rotas, validação e middlewares em produção, use um framework (veja Q13 e Q14).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "1. Importe o módulo nativo",
            texto:
              "`import { createServer } from 'node:http'` (ESM) ou `const { createServer } = require('node:http')` (CommonJS). O prefixo `node:` deixa claro que ele vem do núcleo. Sinal de acerto: nenhum `npm install` foi necessário.",
          },
          {
            titulo: "2. Crie o servidor",
            texto:
              "`createServer((req, res) => { ... })` devolve o servidor e registra a função que roda **a cada requisição**. `req` é a requisição (um stream legível, com `method`, `url` e `headers`) e `res` é a resposta (um stream gravável). Critério: ainda não acontece nada, porque o servidor só aceita conexões depois do `listen`.",
          },
          {
            titulo: "3. Decida a rota",
            texto:
              "Leia `req.method` e o caminho de `new URL(req.url, 'http://localhost').pathname` e ramifique com `if`/`switch`. Devolva **404** para o que não existe e **405** para método não permitido. Sinal: toda combinação desconhecida cai em um caminho que responde, em vez de ficar pendurada.",
          },
          {
            titulo: "4. Responda",
            texto:
              "Defina status e cabeçalhos (`res.writeHead(200, { 'Content-Type': 'application/json' })`) e finalize com `res.end(corpo)`. **Todo caminho precisa chamar `res.end()`**; sem isso o cliente espera até estourar o timeout.",
          },
          {
            titulo: "5. Leia o corpo, se houver",
            texto:
              "O corpo chega em pedaços, como stream: junte-os com `for await (const pedaco of req)`, **limite o tamanho** e valide o JSON com `try`/`catch`, respondendo **400** quando for inválido. Um servidor sem limite deixa um cliente mal-intencionado encher a memória.",
          },
          {
            titulo: "6. Escute numa porta",
            texto:
              "`servidor.listen(porta)`, com a porta vinda de `process.env.PORT`. Trate o evento `error` do servidor: `EADDRINUSE` significa que a porta já está ocupada. Teste com `curl -i http://localhost:3000/saude`: o sinal de sucesso é a linha `HTTP/1.1 200 OK`.",
          },
          {
            titulo: "7. Isole e encerre com elegância",
            texto:
              "Exporte uma função que **cria** o servidor e deixe o `listen` num arquivo de entrada: assim os testes importam o módulo sem ocupar uma porta. No `SIGTERM`, chame `servidor.close()` para parar de aceitar conexões novas e deixar as em andamento terminarem.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O módulo do servidor",
        legenda: "servidor.js",
        codigo: `import { createServer } from "node:http";

export function criarServidor() {
  return createServer(async (req, res) => {
    try {
      const { pathname } = new URL(req.url, "http://localhost");

      if (req.method === "GET" && pathname === "/saude") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: true }));
      }
      if (req.method === "POST" && pathname === "/eco") {
        const partes = [];
        for await (const pedaco of req) partes.push(pedaco);
        return res.end(Buffer.concat(partes));
      }
      res.statusCode = 404;
      res.end();
    } catch {
      res.statusCode = 500;
      res.end();
    }
  });
}`,
        nota: "Por brevidade o código não limita o tamanho do corpo (passo 5): em produção, interrompa a leitura acima de um limite e responda `413`.",
      },
      {
        tipo: "codigo",
        titulo: "O ponto de entrada: porta e encerramento",
        legenda: "index.js",
        codigo: `import { criarServidor } from "./servidor.js";

const porta = Number(process.env.PORT) || 3000;
const servidor = criarServidor();

servidor.on("error", (erro) => {
  console.error("Não foi possível escutar:", erro.code); // ex.: EADDRINUSE
  process.exitCode = 1;
});

servidor.listen(porta, () => console.log("Ouvindo na porta " + porta));

process.on("SIGTERM", () => servidor.close());`,
        nota: 'Em arquivos `.js`, o `import` exige `"type": "module"` no `package.json` (ou a extensão `.mjs`). Em CommonJS, troque por `require`.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cru demais para produção",
        texto:
          "O módulo `http` entrega só o básico: não faz roteamento com parâmetros (`/usuarios/:id`), não lê JSON nem cookies, não trata CORS nem compressão e **não fala HTTPS** (para isso existe o `node:https` ou, mais comum, um proxy reverso na frente). Para um serviço de verdade, use um framework que cuide disso; a maioria deles é construída sobre este mesmo módulo.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Testar sem brigar por porta",
        texto:
          "Como `criarServidor()` não escuta por conta própria, o teste pode chamar `servidor.listen(0)`: o sistema escolhe uma porta livre, que você lê em `servidor.address().port`. Depois, `servidor.close()` ao final.",
      },
    ],
    armadilhas: [
      "Esquecer o `res.end()` em algum ramo (por exemplo, no `else` de um `if`): a requisição fica pendurada até o timeout.",
      "Montar o corpo sem limite de tamanho, ou concatenando pedaços como texto: gasta memória à vontade e pode quebrar um caractere multibyte no meio.",
      "Chamar `listen` no mesmo arquivo que exporta o servidor: ao importar o módulo num teste, ele já ocupa a porta.",
      "Passar uma função `async` sem `try`/`catch`: um erro vira rejeição não tratada, que nas versões atuais derruba o processo.",
    ],
    autoteste: [
      {
        pergunta: "Preciso instalar algum pacote para criar um servidor HTTP no Node?",
        resposta:
          "Não. `node:http` é um módulo do núcleo; basta importar. Express, Fastify e afins são opcionais e acrescentam roteamento e middlewares.",
      },
      {
        pergunta: "O que acontece se um ramo do handler nunca chamar `res.end()`?",
        resposta:
          "A resposta não termina: o cliente fica esperando até um timeout e a conexão continua ocupada no servidor.",
      },
      {
        pergunta: "Por que separar `criarServidor()` do `listen`?",
        resposta:
          "Para o módulo poder ser importado sem efeito colateral: os testes sobem o servidor numa porta livre (`listen(0)`) e o arquivo de entrada decide a porta real.",
      },
    ],
  },
  en: {
    titulo: "HTTP server",
    pergunta: "How do you include an HTTP server in a Node module?",
    porqueEsteMetodo:
      "Standing up a server is a procedure with an order: import, create, route, respond, listen and test. A playbook shows each step with the sign that it worked.",
    resposta30s:
      "The question probably means “how do I use the HTTP module in Node”: it is **built in**, so there is nothing to install. You import `node:http`, create the server with **`createServer`** and a function that receives `req` and `res`, answer with `res.end()` and start accepting connections with **`listen(port)`**. That is fine for learning and for small services; for routes, validation and middleware in production, use a framework (see Q13 and Q14).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "1. Import the built-in module",
            texto:
              "`import { createServer } from 'node:http'` (ESM) or `const { createServer } = require('node:http')` (CommonJS). The `node:` prefix makes it clear that it comes from the core. Sign you got it right: no `npm install` was needed.",
          },
          {
            titulo: "2. Create the server",
            texto:
              "`createServer((req, res) => { ... })` returns the server and registers the function that runs **on every request**. `req` is the request (a readable stream with `method`, `url` and `headers`) and `res` is the response (a writable stream). Criterion: nothing happens yet, because the server only accepts connections after `listen`.",
          },
          {
            titulo: "3. Decide the route",
            texto:
              "Read `req.method` and the path from `new URL(req.url, 'http://localhost').pathname`, then branch with `if`/`switch`. Return **404** for what does not exist and **405** for a method that is not allowed. Sign: every unknown combination lands on a path that answers instead of hanging.",
          },
          {
            titulo: "4. Respond",
            texto:
              "Set the status and headers (`res.writeHead(200, { 'Content-Type': 'application/json' })`) and finish with `res.end(body)`. **Every path must call `res.end()`**; otherwise the client waits until it times out.",
          },
          {
            titulo: "5. Read the body, if there is one",
            texto:
              "The body arrives in pieces, as a stream: gather them with `for await (const chunk of req)`, **cap the size** and validate JSON with `try`/`catch`, answering **400** when it is invalid. A server with no cap lets a malicious client fill up your memory.",
          },
          {
            titulo: "6. Listen on a port",
            texto:
              "`server.listen(port)`, with the port read from `process.env.PORT`. Handle the server’s `error` event: `EADDRINUSE` means the port is already taken. Test with `curl -i http://localhost:3000/health`: success is the `HTTP/1.1 200 OK` line.",
          },
          {
            titulo: "7. Isolate it and shut down cleanly",
            texto:
              "Export a function that **creates** the server and keep `listen` in an entry file, so tests can import the module without taking a port. On `SIGTERM`, call `server.close()` to stop accepting new connections and let the ones in flight finish.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The server module",
        legenda: "server.js",
        codigo: `import { createServer } from "node:http";

export function createAppServer() {
  return createServer(async (req, res) => {
    try {
      const { pathname } = new URL(req.url, "http://localhost");

      if (req.method === "GET" && pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: true }));
      }
      if (req.method === "POST" && pathname === "/echo") {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        return res.end(Buffer.concat(chunks));
      }
      res.statusCode = 404;
      res.end();
    } catch {
      res.statusCode = 500;
      res.end();
    }
  });
}`,
        nota: "For brevity the code does not cap the body size (step 5): in production, stop reading above a limit and answer `413`.",
      },
      {
        tipo: "codigo",
        titulo: "The entry point: port and shutdown",
        legenda: "index.js",
        codigo: `import { createAppServer } from "./server.js";

const port = Number(process.env.PORT) || 3000;
const server = createAppServer();

server.on("error", (error) => {
  console.error("Could not listen:", error.code); // e.g. EADDRINUSE
  process.exitCode = 1;
});

server.listen(port, () => console.log("Listening on port " + port));

process.on("SIGTERM", () => server.close());`,
        nota: 'In `.js` files, `import` requires `"type": "module"` in `package.json` (or the `.mjs` extension). In CommonJS, use `require` instead.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Too bare-bones for production",
        texto:
          "The `http` module gives you only the basics: no routing with parameters (`/users/:id`), no JSON or cookie parsing, no CORS or compression, and **no HTTPS** (for that there is `node:https` or, more commonly, a reverse proxy in front). For a real service, use a framework that handles this; most of them are built on top of this same module.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Testing without fighting over ports",
        texto:
          "Since `createAppServer()` does not listen on its own, a test can call `server.listen(0)`: the system picks a free port, which you read from `server.address().port`. Call `server.close()` at the end.",
      },
    ],
    armadilhas: [
      "Forgetting `res.end()` in one branch (for example, the `else` of an `if`): the request hangs until the timeout.",
      "Building the body with no size cap, or by concatenating pieces as text: it eats memory and can split a multibyte character in half.",
      "Calling `listen` in the same file that exports the server: importing the module in a test already takes the port.",
      "Passing an `async` function with no `try`/`catch`: an error becomes an unhandled rejection, which in current versions brings the process down.",
    ],
    autoteste: [
      {
        pergunta: "Do I need to install a package to create an HTTP server in Node?",
        resposta:
          "No. `node:http` is a core module; you just import it. Express, Fastify and the like are optional and add routing and middleware.",
      },
      {
        pergunta: "What happens if one branch of the handler never calls `res.end()`?",
        resposta:
          "The response never finishes: the client waits until a timeout and the connection stays busy on the server.",
      },
      {
        pergunta: "Why separate `createAppServer()` from `listen`?",
        resposta:
          "So the module can be imported with no side effects: tests start the server on a free port (`listen(0)`) and the entry file decides the real port.",
      },
    ],
  },
};
