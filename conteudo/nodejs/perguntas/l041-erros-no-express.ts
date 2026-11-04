import type { Pergunta } from "../../tipos";

// L41 · Erros no Express
export const l041: Pergunta = {
  numero: 141,
  modulo: "linkedin-express",
  metodo: "trace",
  pt: {
    titulo: "Erros no Express",
    pergunta: "Como você trata erros no Express?",
    porqueEsteMetodo:
      "O tratamento de erros do Express é um caminho próprio dentro da cadeia de middlewares. Seguir uma requisição que falha mostra por onde o erro entra, quem o recebe e onde ele costuma se perder.",
    resposta30s:
      "No Express o erro tem um caminho próprio: quando um handler lança uma exceção ou chama `next(err)`, a requisição pula os middlewares comuns e cai no **middleware de erro**, que tem **quatro argumentos** `(err, req, res, next)` e é registrado **depois** de todas as rotas. Nele você registra o erro no log, escolhe o status e devolve uma resposta de formato padrão, **sem vazar a pilha**. Handlers `async` precisam encaminhar a rejeição (o Express 5 faz isso sozinho; no 4, use `try/catch` com `next(err)` ou um wrapper), e a rota inexistente (404) é tratada por um middleware no fim da cadeia.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma requisição que falha",
        etapas: [
          "Chega `GET /pedidos/42`; o Express percorre middlewares e rotas na ordem em que foram registrados",
          "O handler chama `buscarPedido(42)`, que falha (banco fora do ar) ou não encontra nada; ele lança o erro ou chama `next(err)`",
          "O Express **pula os middlewares e rotas comuns** que faltavam e procura o próximo middleware com **quatro parâmetros** `(err, req, res, next)`",
          "O tratador registra o erro no log, escolhe o status (`err.status` ou `500`) e monta o corpo no formato padrão da API",
          "A resposta sai sem pilha nem mensagens internas: um `404` com texto claro, ou um `500` genérico",
        ],
        nota: "Sem tratador seu, o Express usa o padrão dele, que responde com uma página HTML e, fora de produção, mostra a pilha. Escreva o seu para ter o formato que a API promete e nada vazado.",
      },
      {
        tipo: "passos",
        titulo: "Por onde o erro entra",
        passos: [
          {
            titulo: "Handler síncrono",
            texto:
              "Um `throw` dentro de um handler ou middleware síncrono é capturado pelo Express e encaminhado ao tratador. Não há nada a fazer.",
          },
          {
            titulo: "Handler assíncrono",
            texto:
              "No Express 4, uma promise rejeitada **não** é encaminhada: use `try/catch` com `next(err)` ou um wrapper que faça `.catch(next)`. No Express 5, a rejeição de um handler que devolve promise vai para o tratador sozinha; confira o guia de migração em expressjs.com para a sua versão.",
          },
          {
            titulo: "Callbacks e eventos",
            texto:
              "Em callbacks (padrão error-first) e eventos, o `throw` acontece fora da chamada do handler e ninguém o captura. Chame `next(err)` de forma explícita.",
          },
          {
            titulo: "Rota inexistente (404)",
            texto:
              "Uma rota que não casa não é um erro para o Express: a requisição chega ao fim da cadeia. Registre um middleware depois de todas as rotas que cria o erro `404` e o entrega ao tratador.",
          },
          {
            titulo: "Resposta já iniciada",
            texto:
              "Se o erro surge depois de a resposta ter começado (streaming), não dá mais para mudar status nem corpo. Teste `res.headersSent` e chame `next(err)`: o tratador padrão encerra a conexão.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "404 e tratador central",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const erroHttp = (status, mensagem) => Object.assign(new Error(mensagem), { status });",
          "const app = express();",
          "",
          'app.get("/pedidos/:id", async (req, res) => {',
          "  const pedido = await buscarPedido(req.params.id);",
          '  if (!pedido) throw erroHttp(404, "Pedido não encontrado"); // Express 5 encaminha; no 4, try/catch + next(err)',
          "  res.json(pedido);",
          "});",
          'app.use((req, res, next) => next(erroHttp(404, "Rota não encontrada"))); // depois de todas as rotas',
          "app.use((err, req, res, next) => { // quatro argumentos = tratador de erro",
          "  if (res.headersSent) return next(err);",
          "  const status = err.status ?? 500;",
          "  console.error(err); // o detalhe fica no log, não na resposta",
          '  res.status(status).json({ erro: status < 500 ? err.message : "Erro interno" });',
          "});",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Um lugar decide a resposta de erro",
        texto:
          "Handlers e serviços **lançam** erros com significado (um `status`, um código), e o tratador central os converte em resposta HTTP, registra no log e esconde o resto. Assim o formato é o mesmo em toda a API (veja L54) e nenhuma rota repete `try/catch` com `res.status(500)`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não vaze nem engula o erro",
        texto:
          "Em erros `5xx`, devolva uma mensagem genérica (com um id de correlação) e deixe pilha, SQL e caminhos de arquivo só no log (veja L117). E lembre que o tratador do Express só cobre erros **dentro do ciclo da requisição**: uma rejeição sem tratamento fora dele cai em `unhandledRejection` ou `uncaughtException` (veja L116).",
      },
    ],
    armadilhas: [
      "Registrar o middleware de erro antes das rotas, ou escrevê-lo com três argumentos: o Express só o reconhece como tratador de erro com quatro parâmetros e depois das rotas.",
      "Deixar a rejeição solta num handler `async` do Express 4: a requisição fica sem resposta e a promise vira `unhandledRejection`.",
      "Devolver `err.message` ou a pilha de erros `500` ao cliente: pode revelar SQL, caminhos de arquivo e bibliotecas usadas.",
      "Tentar responder de novo depois de a resposta ter começado: gera `ERR_HTTP_HEADERS_SENT`. Verifique `res.headersSent` e delegue com `next(err)`.",
    ],
    autoteste: [
      {
        pergunta: "Como o Express reconhece um middleware de tratamento de erro?",
        resposta:
          "Pelo número de parâmetros: uma função com quatro `(err, req, res, next)` é tratada como middleware de erro, e precisa ser registrada depois das rotas que ela deve cobrir.",
      },
      {
        pergunta: "O que fazer no tratador quando `res.headersSent` é verdadeiro?",
        resposta:
          "Chamar `next(err)` e delegar ao tratador padrão, que encerra a conexão: com a resposta já iniciada, status e corpo não podem mais mudar.",
      },
    ],
  },
  en: {
    titulo: "Errors in Express",
    pergunta: "How do you handle errors in Express?",
    porqueEsteMetodo:
      "Express error handling is its own path inside the middleware chain. Following one request that fails shows where the error enters, who receives it and where it usually gets lost.",
    resposta30s:
      "In Express an error has its own path: when a handler throws or calls `next(err)`, the request skips the ordinary middleware and lands in the **error-handling middleware**, which takes **four arguments** `(err, req, res, next)` and is registered **after** all the routes. There you log the error, pick the status and return a response in a standard shape, **without leaking the stack**. `async` handlers must forward the rejection (Express 5 does it on its own; in 4, use `try/catch` with `next(err)` or a wrapper), and an unknown route (404) is handled by a middleware at the end of the chain.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A request that fails",
        etapas: [
          "`GET /orders/42` arrives; Express walks through middleware and routes in the order they were registered",
          "The handler calls `findOrder(42)`, which fails (database down) or finds nothing; it throws the error or calls `next(err)`",
          "Express **skips the remaining ordinary middleware and routes** and looks for the next middleware with **four parameters** `(err, req, res, next)`",
          "The handler logs the error, picks the status (`err.status` or `500`) and builds the body in the API’s standard shape",
          "The response goes out without the stack or internal messages: a `404` with a clear text, or a generic `500`",
        ],
        nota: "Without a handler of your own, Express uses its default, which replies with an HTML page and, outside production, shows the stack. Write your own to get the shape the API promises and nothing leaked.",
      },
      {
        tipo: "passos",
        titulo: "Where the error comes in",
        passos: [
          {
            titulo: "Synchronous handler",
            texto:
              "A `throw` inside a synchronous handler or middleware is caught by Express and forwarded to the error handler. There is nothing to do.",
          },
          {
            titulo: "Asynchronous handler",
            texto:
              "In Express 4, a rejected promise is **not** forwarded: use `try/catch` with `next(err)` or a wrapper that does `.catch(next)`. In Express 5, a rejection from a handler that returns a promise goes to the error handler on its own; check the migration guide on expressjs.com for your version.",
          },
          {
            titulo: "Callbacks and events",
            texto:
              "In callbacks (error-first pattern) and events, the `throw` happens outside the handler call and nobody catches it. Call `next(err)` explicitly.",
          },
          {
            titulo: "Unknown route (404)",
            texto:
              "A route that does not match is not an error to Express: the request just reaches the end of the chain. Register a middleware after all the routes that creates the `404` error and hands it to the error handler.",
          },
          {
            titulo: "Response already started",
            texto:
              "If the error appears after the response has begun (streaming), the status and body can no longer change. Check `res.headersSent` and call `next(err)`: the default handler closes the connection.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "404 and a central error handler",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const httpError = (status, message) => Object.assign(new Error(message), { status });",
          "const app = express();",
          "",
          'app.get("/orders/:id", async (req, res) => {',
          "  const order = await findOrder(req.params.id);",
          '  if (!order) throw httpError(404, "Order not found"); // Express 5 forwards it; in 4, try/catch + next(err)',
          "  res.json(order);",
          "});",
          'app.use((req, res, next) => next(httpError(404, "Route not found"))); // after all the routes',
          "app.use((err, req, res, next) => { // four arguments = error handler",
          "  if (res.headersSent) return next(err);",
          "  const status = err.status ?? 500;",
          "  console.error(err); // the detail stays in the log, not in the response",
          '  res.status(status).json({ error: status < 500 ? err.message : "Internal error" });',
          "});",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "One place decides the error response",
        texto:
          "Handlers and services **throw** errors that carry meaning (a `status`, a code), and the central handler turns them into an HTTP response, logs them and hides the rest. That way the shape is the same across the API (see L54) and no route repeats `try/catch` with `res.status(500)`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Neither leak nor swallow the error",
        texto:
          "For `5xx` errors, return a generic message (with a correlation id) and keep the stack, SQL and file paths in the log only (see L117). And remember that the Express handler only covers errors **inside the request cycle**: an unhandled rejection outside it ends up in `unhandledRejection` or `uncaughtException` (see L116).",
      },
    ],
    armadilhas: [
      "Registering the error middleware before the routes, or writing it with three arguments: Express only recognizes an error handler with four parameters, registered after the routes.",
      "Leaving the rejection loose in an `async` handler on Express 4: the request never gets a response and the promise becomes an `unhandledRejection`.",
      "Returning `err.message` or the stack of `500` errors to the client: it can reveal SQL, file paths and the libraries in use.",
      "Trying to respond again after the response has started: it raises `ERR_HTTP_HEADERS_SENT`. Check `res.headersSent` and delegate with `next(err)`.",
    ],
    autoteste: [
      {
        pergunta: "How does Express recognize an error-handling middleware?",
        resposta:
          "By its parameter count: a function with four `(err, req, res, next)` is treated as error middleware, and it must be registered after the routes it should cover.",
      },
      {
        pergunta: "What should the error handler do when `res.headersSent` is true?",
        resposta:
          "Call `next(err)` and delegate to the default handler, which closes the connection: once the response has started, status and body can no longer change.",
      },
    ],
  },
};
