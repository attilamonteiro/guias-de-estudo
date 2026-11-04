import type { Pergunta } from "../../tipos";

// L37 · Middleware no Express
export const l037: Pergunta = {
  numero: 137,
  modulo: "linkedin-express",
  metodo: "trace",
  pt: {
    titulo: "Middleware no Express",
    pergunta: "O que é middleware?",
    porqueEsteMetodo:
      "Middleware é uma cadeia, e cadeia se entende seguindo uma requisição de ponta a ponta: quem a recebe, quem passa a vez, quem encerra e para onde ela vai quando algo falha. Seguir um pedido mostra os tipos e a ordem melhor que uma definição.",
    resposta30s:
      "**Middleware** é uma função `(req, res, next)` que fica **no meio do caminho** entre a requisição e a resposta final: ela pode ler ou alterar `req` e `res`, **encerrar** a resposta (curto-circuito) ou chamar **`next()`** para passar a vez ao próximo da cadeia. A **ordem de registro é a ordem de execução**. Os tipos são os de aplicação (`app.use`), de roteador (`router.use`, só para as rotas daquele roteador), de erro (quatro parâmetros), embutidos e de terceiros.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedido `GET /admin/usuarios` atravessando a cadeia",
        etapas: [
          "`requestId` (aplicação) gera o identificador de rastreio, anexa a `req` e chama `next()`",
          '`logger` (aplicação) anota o início e ouve `res.on("finish")` para registrar status e duração no fim; chama `next()`',
          "`rateLimit` (terceiros) confere o contador do cliente; dentro do limite, chama `next()`",
          "`express.json()` (embutido) lê o corpo, preenche `req.body` e chama `next()`",
          "O caminho começa com `/admin`, então entra no roteador: `autenticar` valida o token, anexa `req.usuario` e chama `next()`; `exigirPapel` confere a autorização e chama `next()`",
          "`validar` confere a entrada e o handler `listarUsuarios` chama `res.json(...)`: a resposta sai e a cadeia termina",
        ],
        nota: "A ordem de registro é a ordem de execução: um middleware registrado depois da rota que responde nunca roda para ela.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que algo dá errado",
        passos: [
          {
            titulo: "Curto-circuito",
            texto:
              "`autenticar` não encontra o token e faz `return res.status(401).json(...)`, sem chamar `next()`. A cadeia termina ali: a autorização e o handler nunca rodam. É assim que autenticação e rate limit protegem as rotas.",
          },
          {
            titulo: "Requisição pendurada",
            texto:
              "Se o middleware nem responde nem chama `next()`, a requisição fica aberta até o cliente desistir. Se chama `next()` e também responde, o handler seguinte tenta responder de novo e surge “Cannot set headers after they are sent”.",
          },
          {
            titulo: "`next(err)`",
            texto:
              "Chamar `next` com um argumento sinaliza erro: o Express pula os middlewares e as rotas comuns que faltam e vai ao primeiro middleware de erro. Um `throw` síncrono no handler é capturado pelo Express e vira `next(err)`; para código assíncrono, veja L41.",
          },
          {
            titulo: "O middleware de erro",
            texto:
              "É o que declara quatro parâmetros, `(err, req, res, next)`, registrado depois de todas as rotas. Ele loga o erro com o `requestId` e responde num formato único, sem vazar a stack.",
          },
          {
            titulo: "O 404",
            texto:
              "Um `app.use` sem caminho, depois de todas as rotas, só é alcançado se nenhuma rota respondeu: é o lugar certo para devolver o 404.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A cadeia montada",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const app = express();",
          "app.use(requestId); // aplicação: tracing, vale para tudo",
          "app.use(logger); // aplicação: log de entrada e de saída",
          "app.use(rateLimit); // aplicação: freia abuso antes de gastar CPU",
          'app.use(express.json({ limit: "100kb" })); // embutido: lê o corpo',
          "",
          "const admin = express.Router();",
          "admin.use(autenticar); // roteador: só vale para /admin",
          'admin.use(exigirPapel("admin")); // autorização',
          'admin.get("/usuarios", validar(esquemaDaBusca), listarUsuarios);',
          'app.use("/admin", admin);',
          "",
          'app.use((req, res) => res.status(404).json({ erro: "não encontrado" })); // ninguém respondeu',
          "app.use((err, req, res, next) => {",
          "  // erro: quatro parâmetros, registrado por último",
          '  res.status(err.status ?? 500).json({ erro: "falha interna", id: req.id });',
          "});",
        ].join("\n"),
        nota: '`autenticar` tem a forma `(req, res, next)`. `exigirPapel("admin")` e `validar(esquema)` são fábricas: recebem configuração e devolvem o middleware.',
      },
      {
        tipo: "tabela",
        titulo: "Tipos de middleware",
        colunas: ["Tipo", "Como registrar", "Alcance", "Exemplos"],
        linhas: [
          [
            "Aplicação",
            '`app.use(fn)`, ou com prefixo: `app.use("/api", fn)`',
            "Todas as requisições (ou as do prefixo)",
            "`requestId`, log, CORS",
          ],
          [
            "Roteador",
            "`router.use(fn)` em um `express.Router()`",
            "Só as requisições que entram nesse roteador",
            "Autenticação de `/admin`",
          ],
          [
            "Erro",
            "`app.use((err, req, res, next) => …)`, com quatro parâmetros",
            "Recebe o que veio de `next(err)` ou de um `throw`",
            "Formato único de erro, log",
          ],
          [
            "Embutido",
            "`express.json()`, `express.urlencoded()`, `express.static()`",
            "Onde for registrado",
            "Corpo da requisição, arquivos estáticos",
          ],
          [
            "Terceiros",
            "`app.use(pacote())`",
            "Onde for registrado",
            "`helmet`, `cors`, `morgan`, `express-rate-limit`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Aplicação x roteador, e como projetar a cadeia",
        texto:
          "A mecânica é a mesma; muda o **alcance**: `app.use` vale para a aplicação inteira, e `router.use` só para o que entra naquele roteador. Uma ordem usual de projeto: **tracing** → **log** → **segurança** (`helmet`, CORS) → **rate limit** → **parsers** do corpo → **autenticação** → **autorização** → **validação** → **rotas** → **404** → **erro**. Cada middleware faz uma coisa só, e quem precisa passar dados adiante os anexa a `req` (`req.id`, `req.usuario`). Veja L45 (autenticação e autorização), L49 (rate limit) e L50 (validação).",
      },
    ],
    armadilhas: [
      "Esquecer de chamar `next()` ou de responder: a requisição fica pendurada até o timeout do cliente.",
      "Chamar `next()` e também responder, ou responder duas vezes: use `return` ao responder.",
      "Registrar na ordem errada: autenticação depois da rota, `express.json()` depois do handler que lê `req.body`, ou o middleware de erro antes das rotas.",
      "Declarar o middleware de erro com três parâmetros: o Express só o reconhece como de erro com os quatro `(err, req, res, next)`, mesmo que `next` não seja usado.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece quando um middleware chama `next(err)`?",
        resposta:
          "O Express pula os middlewares e as rotas comuns que faltam e passa o erro ao próximo middleware de erro, o que tem quatro parâmetros.",
      },
      {
        pergunta: "Qual é a diferença entre `app.use(mw)` e `router.use(mw)`?",
        resposta:
          "A mecânica é igual; o alcance muda. O de aplicação vale para todas as requisições (ou as do prefixo), e o de roteador só para as requisições que entram naquele `Router`.",
      },
    ],
  },
  en: {
    titulo: "Express middleware",
    pergunta: "What is middleware?",
    porqueEsteMetodo:
      "Middleware is a chain, and a chain is best understood by following one request from end to end: who receives it, who passes it on, who ends it and where it goes when something fails. Following one request shows the types and the order better than a definition.",
    resposta30s:
      "**Middleware** is a `(req, res, next)` function that sits **in the middle** between the request and the final response: it can read or change `req` and `res`, **end** the response (short-circuit) or call **`next()`** to hand over to the next one in the chain. The **registration order is the execution order**. The types are application-level (`app.use`), router-level (`router.use`, only for that router’s routes), error-handling (four parameters), built-in and third-party.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A `GET /admin/users` request crossing the chain",
        etapas: [
          "`requestId` (application) generates the tracing identifier, attaches it to `req` and calls `next()`",
          '`logger` (application) notes the start and listens to `res.on("finish")` to record status and duration at the end; it calls `next()`',
          "`rateLimit` (third-party) checks the client’s counter; within the limit, it calls `next()`",
          "`express.json()` (built-in) reads the body, fills `req.body` and calls `next()`",
          "The path starts with `/admin`, so it enters the router: `authenticate` validates the token, attaches `req.user` and calls `next()`; `requireRole` checks authorization and calls `next()`",
          "`validate` checks the input and the `listUsers` handler calls `res.json(...)`: the response goes out and the chain ends",
        ],
        nota: "Registration order is execution order: a middleware registered after the route that responds never runs for it.",
      },
      {
        tipo: "passos",
        titulo: "Now the path where something goes wrong",
        passos: [
          {
            titulo: "Short-circuit",
            texto:
              "`authenticate` finds no token and does `return res.status(401).json(...)`, without calling `next()`. The chain ends there: authorization and the handler never run. This is how authentication and rate limiting protect routes.",
          },
          {
            titulo: "Hanging request",
            texto:
              "If a middleware neither responds nor calls `next()`, the request stays open until the client gives up. If it calls `next()` and also responds, the next handler tries to respond again and you get “Cannot set headers after they are sent”.",
          },
          {
            titulo: "`next(err)`",
            texto:
              "Calling `next` with an argument signals an error: Express skips the remaining ordinary middleware and routes and goes to the first error-handling middleware. A synchronous `throw` in a handler is caught by Express and becomes `next(err)`; for asynchronous code, see L41.",
          },
          {
            titulo: "The error-handling middleware",
            texto:
              "It is the one that declares four parameters, `(err, req, res, next)`, registered after all routes. It logs the error with the `requestId` and responds in a single format, without leaking the stack.",
          },
          {
            titulo: "The 404",
            texto:
              "A path-less `app.use` after all the routes is only reached if no route responded: it is the right place to return the 404.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The chain assembled",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const app = express();",
          "app.use(requestId); // application: tracing, applies to everything",
          "app.use(logger); // application: request and response logging",
          "app.use(rateLimit); // application: curbs abuse before spending CPU",
          'app.use(express.json({ limit: "100kb" })); // built-in: reads the body',
          "",
          "const admin = express.Router();",
          "admin.use(authenticate); // router: only applies to /admin",
          'admin.use(requireRole("admin")); // authorization',
          'admin.get("/users", validate(searchSchema), listUsers);',
          'app.use("/admin", admin);',
          "",
          'app.use((req, res) => res.status(404).json({ error: "not found" })); // nobody responded',
          "app.use((err, req, res, next) => {",
          "  // error: four parameters, registered last",
          '  res.status(err.status ?? 500).json({ error: "internal failure", id: req.id });',
          "});",
        ].join("\n"),
        nota: '`authenticate` has the shape `(req, res, next)`. `requireRole("admin")` and `validate(schema)` are factories: they take configuration and return the middleware.',
      },
      {
        tipo: "tabela",
        titulo: "Types of middleware",
        colunas: ["Type", "How to register", "Scope", "Examples"],
        linhas: [
          [
            "Application-level",
            '`app.use(fn)`, or with a prefix: `app.use("/api", fn)`',
            "All requests (or those under the prefix)",
            "`requestId`, logging, CORS",
          ],
          [
            "Router-level",
            "`router.use(fn)` on an `express.Router()`",
            "Only requests that enter that router",
            "Authentication for `/admin`",
          ],
          [
            "Error-handling",
            "`app.use((err, req, res, next) => …)`, with four parameters",
            "Receives what came from `next(err)` or a `throw`",
            "A single error format, logging",
          ],
          [
            "Built-in",
            "`express.json()`, `express.urlencoded()`, `express.static()`",
            "Wherever it is registered",
            "Request body, static files",
          ],
          [
            "Third-party",
            "`app.use(pkg())`",
            "Wherever it is registered",
            "`helmet`, `cors`, `morgan`, `express-rate-limit`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Application vs router, and how to design the chain",
        texto:
          "The mechanics are the same; the **scope** changes: `app.use` applies to the whole application, and `router.use` only to what enters that router. A usual design order: **tracing** → **logging** → **security** (`helmet`, CORS) → **rate limiting** → body **parsers** → **authentication** → **authorization** → **validation** → **routes** → **404** → **error**. Each middleware does one thing, and whatever needs to pass data along attaches it to `req` (`req.id`, `req.user`). See L45 (authentication and authorization), L49 (rate limiting) and L50 (validation).",
      },
    ],
    armadilhas: [
      "Forgetting to call `next()` or to respond: the request hangs until the client times out.",
      "Calling `next()` and also responding, or responding twice: use `return` when you respond.",
      "Registering in the wrong order: authentication after the route, `express.json()` after the handler that reads `req.body`, or the error middleware before the routes.",
      "Declaring the error middleware with three parameters: Express only recognizes it as an error handler with all four `(err, req, res, next)`, even if `next` is unused.",
    ],
    autoteste: [
      {
        pergunta: "What happens when a middleware calls `next(err)`?",
        resposta:
          "Express skips the remaining ordinary middleware and routes and passes the error to the next error-handling middleware, the one with four parameters.",
      },
      {
        pergunta: "What is the difference between `app.use(mw)` and `router.use(mw)`?",
        resposta:
          "The mechanics are the same; the scope differs. Application-level applies to all requests (or those under the prefix), and router-level only to requests that enter that `Router`.",
      },
    ],
  },
};
