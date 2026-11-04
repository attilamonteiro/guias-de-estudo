import type { Pergunta } from "../../tipos";

// Q14 · Express
export const q14: Pergunta = {
  numero: 14,
  modulo: "turing-basicas",
  metodo: "trace",
  pt: {
    titulo: "Express",
    pergunta: "O que é o Express JS e para que serve?",
    porqueEsteMetodo:
      "O Express é um fluxo: uma requisição entra, atravessa middlewares e uma rota e sai como resposta. Seguir um pedido do começo ao fim, inclusive quando algo falha, explica para que ele serve melhor que uma lista de recursos.",
    resposta30s:
      "**Express** é um framework web minimalista para Node.js, construído sobre o módulo `node:http`. Ele organiza o servidor em **middlewares** (funções `(req, res, next)` executadas em ordem) e **rotas** (método + caminho), e facilita ler o corpo, devolver JSON e tratar erros. Serve para APIs REST, aplicações web e servidores de apoio ao front-end; não traz banco de dados, autenticação nem estrutura de pastas, e isso fica a seu critério.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedido `POST /usuarios` atravessando o Express",
        etapas: [
          "O cliente envia `POST /usuarios` com um corpo JSON",
          "O Node entrega a requisição ao Express, que monta `req` e `res`",
          "Middleware de log: registra método e caminho e chama `next()`",
          "`express.json()`: lê o corpo e preenche `req.body`",
          "O roteador encontra a rota `POST /usuarios` e executa o handler",
          "O handler chama `res.status(201).json(...)` e a resposta sai",
        ],
        nota: "A ordem de registro é a ordem de execução. Um middleware que não chama `next()` nem responde deixa a requisição pendurada até o cliente desistir.",
      },
      {
        tipo: "passos",
        titulo: "E quando algo dá errado?",
        passos: [
          {
            titulo: "Entrada inválida",
            texto: "O handler responde `400` na hora e a cadeia termina ali; nenhum middleware depois dele roda.",
          },
          {
            titulo: "Rota inexistente",
            texto: "Nenhuma rota casa, e o Express responde `404` por padrão (ou um middleware final seu o faz).",
          },
          {
            titulo: "Exceção ou promessa rejeitada",
            texto:
              "Um `throw` síncrono vai para o tratador de erros. Em handlers `async`, o Express 5 encaminha a promessa rejeitada; na versão 4 é preciso `try/catch` e `next(err)`. Confira a versão que você usa na documentação oficial.",
          },
          {
            titulo: "Tratador de erros",
            texto:
              "Um middleware com quatro parâmetros `(err, req, res, next)`, registrado por último, registra o erro e devolve `500` sem vazar detalhes internos.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O servidor completo",
        legenda: "JavaScript",
        codigo: `import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url); // middleware de log
  next();
});
app.use(express.json()); // lê o corpo JSON e preenche req.body

app.post("/usuarios", async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: "nome é obrigatório" });
  const usuario = await criarUsuario(nome); // pode lançar erro
  res.status(201).json(usuario);
});

// tratador de erros: 4 parâmetros, registrado por último
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "erro interno" });
});

app.listen(3000, () => console.log("ouvindo na porta 3000"));`,
        nota: "`criarUsuario` é uma função sua (por exemplo, a que grava no banco). O Express, sozinho, não conhece banco de dados.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Para que serve (e o que não é)",
        texto:
          "O Express é a camada de **roteamento + middlewares** sobre o `node:http`. Serve para expor APIs REST/JSON, entregar arquivos estáticos (`express.static`), montar servidores que fazem a ponte entre o front-end e outros serviços e receber webhooks. É **não opinativo**: autenticação, validação, acesso a dados e organização de pastas são escolhas suas, em geral com pacotes de terceiros (`cors`, `helmet` etc.). Express e Node.js não são a mesma coisa: o Node é o ambiente de execução; o Express é um pacote npm que roda nele.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A ordem importa",
        texto:
          "Registre os middlewares globais (`express.json()`, segurança) antes das rotas e o tratador de erros por último. Se `express.json()` vier depois da rota, `req.body` chega sem preenchimento; se o tratador de erros vier antes, ele não captura o que acontece depois.",
      },
    ],
    armadilhas: [
      "Esquecer `next()` num middleware que não responde: a requisição fica pendurada.",
      "Registrar o tratador de erros antes das rotas: ele não captura erros de quem vem depois.",
      "Enviar duas respostas (erro “Cannot set headers after they are sent”): faltou um `return` depois do `res.json()` dentro de um `if`.",
      "Tratar o Express como arquitetura: ele não organiza pastas, validação nem acesso a dados, e sem convenção do time o código vira rotas gigantes.",
    ],
    autoteste: [
      {
        pergunta: "O que é um middleware no Express?",
        resposta:
          "Uma função `(req, res, next)` executada na ordem de registro. Ela pode ler ou alterar `req` e `res`, responder ou chamar `next()` para passar a requisição adiante.",
      },
      {
        pergunta: "Como o Express reconhece um tratador de erros?",
        resposta:
          "Pelos quatro parâmetros `(err, req, res, next)`. Ele deve ser registrado depois das rotas para capturar os erros delas.",
      },
      {
        pergunta: "Express e Node.js são a mesma coisa?",
        resposta:
          "Não. O Node.js é o ambiente de execução; o Express é um framework distribuído como pacote npm que roda sobre o `node:http`.",
      },
    ],
  },
  en: {
    titulo: "Express",
    pergunta: "What is Express JS and what is it used for?",
    porqueEsteMetodo:
      "Express is a flow: a request comes in, passes through middleware and a route, and leaves as a response. Following one request from start to finish, including when something fails, explains what it is for better than a feature list.",
    resposta30s:
      "**Express** is a minimalist web framework for Node.js, built on the `node:http` module. It organizes the server into **middleware** (`(req, res, next)` functions run in order) and **routes** (method + path), and makes it easy to read the body, return JSON and handle errors. It serves REST APIs, web applications and servers that support a front end; it does not bring a database, authentication or a folder structure, which are up to you.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A `POST /users` request going through Express",
        etapas: [
          "The client sends `POST /users` with a JSON body",
          "Node hands the request to Express, which builds `req` and `res`",
          "Logging middleware: records method and path and calls `next()`",
          "`express.json()`: reads the body and fills `req.body`",
          "The router finds the `POST /users` route and runs the handler",
          "The handler calls `res.status(201).json(...)` and the response goes out",
        ],
        nota: "Registration order is execution order. A middleware that neither calls `next()` nor responds leaves the request hanging until the client gives up.",
      },
      {
        tipo: "passos",
        titulo: "And when something goes wrong?",
        passos: [
          {
            titulo: "Invalid input",
            texto: "The handler replies `400` right away and the chain ends there; no middleware after it runs.",
          },
          {
            titulo: "Route does not exist",
            texto: "No route matches, and Express replies `404` by default (or a final middleware of yours does).",
          },
          {
            titulo: "Exception or rejected promise",
            texto:
              "A synchronous `throw` goes to the error handler. In `async` handlers, Express 5 forwards the rejected promise; in version 4 you need `try/catch` and `next(err)`. Check the version you use in the official documentation.",
          },
          {
            titulo: "Error handler",
            texto:
              "A middleware with four parameters `(err, req, res, next)`, registered last, logs the error and returns `500` without leaking internal details.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The complete server",
        legenda: "JavaScript",
        codigo: `import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.url); // logging middleware
  next();
});
app.use(express.json()); // reads the JSON body and fills req.body

app.post("/users", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const user = await createUser(name); // may throw
  res.status(201).json(user);
});

// error handler: 4 parameters, registered last
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(3000, () => console.log("listening on port 3000"));`,
        nota: "`createUser` is a function of yours (for example, the one that writes to the database). Express alone does not know about databases.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What it is for (and what it is not)",
        texto:
          "Express is the **routing + middleware** layer on top of `node:http`. It is used to expose REST/JSON APIs, serve static files (`express.static`), build servers that bridge a front end and other services, and receive webhooks. It is **unopinionated**: authentication, validation, data access and folder organization are your choices, usually with third-party packages (`cors`, `helmet` and so on). Express and Node.js are not the same thing: Node is the runtime; Express is an npm package that runs on it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Order matters",
        texto:
          "Register global middleware (`express.json()`, security) before the routes and the error handler last. If `express.json()` comes after the route, `req.body` arrives unfilled; if the error handler comes first, it does not catch what happens after it.",
      },
    ],
    armadilhas: [
      "Forgetting `next()` in a middleware that does not respond: the request hangs.",
      "Registering the error handler before the routes: it does not catch errors from what comes after.",
      "Sending two responses (the “Cannot set headers after they are sent” error): a `return` is missing after `res.json()` inside an `if`.",
      "Treating Express as architecture: it does not organize folders, validation or data access, and without a team convention the code becomes giant route files.",
    ],
    autoteste: [
      {
        pergunta: "What is middleware in Express?",
        resposta:
          "A `(req, res, next)` function run in registration order. It can read or change `req` and `res`, respond, or call `next()` to pass the request along.",
      },
      {
        pergunta: "How does Express recognize an error handler?",
        resposta:
          "By its four parameters `(err, req, res, next)`. It must be registered after the routes to catch their errors.",
      },
      {
        pergunta: "Are Express and Node.js the same thing?",
        resposta:
          "No. Node.js is the runtime; Express is a framework distributed as an npm package that runs on top of `node:http`.",
      },
    ],
  },
};
