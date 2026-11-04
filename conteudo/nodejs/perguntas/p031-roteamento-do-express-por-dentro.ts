import type { Pergunta } from "../../tipos";

// P31 · Roteamento do Express por dentro
export const p031: Pergunta = {
  numero: 731,
  modulo: "pawanmkr-arquitetura",
  metodo: "trace",
  pt: {
    titulo: "Roteamento do Express por dentro",
    pergunta: "Como o Express.js trata o sistema de roteamento internamente?",
    porqueEsteMetodo:
      "O roteamento do Express parece mágica até você seguir uma requisição de verdade pela pilha de camadas: o que casa, o que é pulado e onde ela termina (ou se perde). Seguir `GET /usuarios/42` e depois os desvios mostra o mecanismo inteiro.",
    resposta30s:
      "O `app` guarda uma **pilha de camadas (`Layer`)** na ordem em que você registrou `use`, `get`, `post`…, e cada requisição a percorre de cima para baixo: o Express compara o caminho e o método de cada camada (o caminho é compilado numa expressão regular pelo **path-to-regexp**), preenche `req.params` quando casa e chama o handler. Quem chama `next()` passa para a próxima camada, `next('route')` pula o resto da rota atual e `next(err)` salta para o primeiro middleware de **quatro argumentos**. Um roteador montado com `app.use('/prefixo', router)` é uma camada que contém outra pilha, e se nenhuma camada responde o `finalhandler` devolve **404**.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "A aplicação que vamos seguir",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const usuarios = express.Router();",
          'usuarios.param("id", carregarUsuario); // roda antes das rotas que têm :id',
          'usuarios.get("/novo", formularioNovo); // específica antes da genérica',
          'usuarios.get("/:id", checarPermissao, detalhar); // uma Route com duas funções',
          "",
          "const app = express();",
          "app.use(express.json()); // camada 1",
          'app.use("/usuarios", usuarios); // camada 2: prefixo + roteador',
          'app.use((req, res) => res.status(404).json({ erro: "Rota não encontrada" })); // camada 3',
          'app.use((err, req, res, next) => res.status(500).json({ erro: "Erro interno" })); // camada 4',
        ].join("\n"),
      },
      {
        tipo: "fluxo",
        titulo: "`GET /usuarios/42`, camada por camada",
        etapas: [
          "O servidor `node:http` chama `app(req, res)`; o Express prepara `req` e `res` e começa a percorrer a pilha do roteador principal, da primeira camada para a última",
          "Camada 1 (`express.json()`): um `use` sem caminho casa com qualquer URL; não há corpo para ler, então ela chama `next()`",
          "Camada 2 (`/usuarios`, montada com `app.use`): casa por **prefixo**. O Express tira `/usuarios` de `req.url` (que vira `/42`), guarda o prefixo em `req.baseUrl` e entrega a requisição à pilha do `Router`",
          "No roteador, a camada de `/novo` não casa com `/42` e é pulada; a de `/:id` casa, o path-to-regexp extrai o parâmetro e `req.params.id` passa a valer `42` (sempre texto)",
          "Antes dos handlers da rota, o `router.param('id')` roda uma vez para esse valor: carrega o usuário, guarda em `req.usuario` e chama `next()`",
          "A `Route` tem a própria pilha: `checarPermissao` chama `next()` e `detalhar` responde com `res.json(...)`. Ninguém chama `next()` de novo, então a requisição termina aqui e as camadas 3 e 4 nunca rodam",
        ],
        nota: "Se o usuário 99 não existisse, o `router.param` chamaria `next(erro)`: o Express pularia `checarPermissao` e `detalhar` e iria direto à camada de erro.",
      },
      {
        tipo: "passos",
        titulo: "Os desvios da pilha",
        passos: [
          {
            titulo: "`next('route')`",
            texto:
              "Dentro de uma `Route` com várias funções, abandona as que faltam e continua na próxima camada da pilha que case. Serve para escolher o handler por condição. Só vale em handlers registrados com `app.get`, `router.post` e semelhantes, não em `use`.",
          },
          {
            titulo: "`next(err)` e `throw`",
            texto:
              "Um erro lançado de forma síncrona num handler é capturado pela camada e vira `next(err)`. Dali em diante o Express só chama camadas de **erro**, reconhecidas por declararem **quatro parâmetros**: com só três, a função vira um middleware comum e é ignorada. Para handlers assíncronos, veja L41.",
          },
          {
            titulo: "A ordem manda",
            texto:
              "A primeira camada que casa e responde encerra a história. Se `/usuarios/:id` vem antes de `/usuarios/novo`, o pedido a `/usuarios/novo` cai na genérica, com `id` igual a “novo”, e a específica nunca roda. Registre da mais específica para a mais genérica.",
          },
          {
            titulo: "Ninguém responde",
            texto:
              "Se a pilha acaba sem resposta, o `finalhandler` do Express devolve 404 (ou 500, se havia um erro sem tratador). E um handler que nem responde nem chama `next()` deixa a requisição pendurada até o timeout. Um 404 seu, depois de todas as rotas, e um tratador de erro, depois dele, dão o formato que a API promete.",
          },
          {
            titulo: "Roteadores aninhados e parâmetros",
            texto:
              "Em `/contas/:contaId/usuarios`, o roteador filho só enxerga `req.params.contaId` se for criado com `express.Router({ mergeParams: true })`. E o `router.param` vale só para o roteador em que foi declarado: roteadores montados não o herdam.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O modelo mental",
        texto:
          "Uma **lista de camadas** e um ponteiro. O `next()` avança o ponteiro até a próxima camada cujo caminho (e, se for rota, cujo método) casa. `app.use` casa por **prefixo**; `app.get`, `app.post` e companhia casam o caminho inteiro e só o seu verbo. Um roteador é uma camada que contém outra lista. Parâmetros, prefixos, erros e 404 são essa lista mais o `next`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A sintaxe de caminho depende da versão",
        texto:
          "Quem interpreta `/:id`, curingas e parâmetros opcionais é o path-to-regexp, e a sintaxe aceita mudou entre versões do Express: curingas e opcionais são escritos de outro jeito nas versões novas, e expressões regulares dentro da string deixaram de valer. Confira a seção de roteamento da documentação da sua versão, em expressjs.com, antes de copiar um exemplo antigo. Por padrão o casamento ignora maiúsculas e a barra final (`caseSensitive` e `strict` mudam isso). Para a cadeia de middlewares em si, veja L37.",
      },
    ],
    armadilhas: [
      "Declarar a rota genérica (`/usuarios/:id`) antes da específica (`/usuarios/novo`): a genérica “engole” a outra e o `id` vira “novo”.",
      "Esquecer de responder ou de chamar `next()`: a requisição fica pendurada até o timeout, sem erro algum no log.",
      "Escrever o tratador de erros com três parâmetros: o Express o trata como middleware comum (conta os parâmetros da função) e o erro cai no tratador padrão, que pode mostrar a pilha.",
      "Registrar o 404 antes das rotas: tudo cai nele e as rotas registradas depois nunca rodam.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece quando um handler chama `next('route')`?",
        resposta:
          "O Express abandona as funções restantes da rota atual e segue para a próxima camada da pilha cujo caminho e método casem. Só funciona em handlers registrados com `app.METHOD()` ou `router.METHOD()`.",
      },
      {
        pergunta: "Por que `app.get('/usuarios/:id')` antes de `app.get('/usuarios/novo')` é um problema?",
        resposta:
          "A pilha é percorrida na ordem de registro, e a primeira camada que casa e responde encerra o ciclo. `/usuarios/novo` casa com `/usuarios/:id` (com `id` igual a “novo”), então a rota específica nunca roda.",
      },
    ],
  },
  en: {
    titulo: "Express routing internals",
    pergunta: "How does Express.js handle the routing system internally?",
    porqueEsteMetodo:
      "Express routing feels like magic until you follow a real request through the stack of layers: what matches, what is skipped and where it ends (or gets lost). Following `GET /users/42` and then the detours shows the whole mechanism.",
    resposta30s:
      "The `app` keeps a **stack of layers (`Layer`)** in the order you registered `use`, `get`, `post`…, and each request walks it from top to bottom: Express compares the path and method of each layer (the path is compiled into a regular expression by **path-to-regexp**), fills `req.params` on a match and calls the handler. Whoever calls `next()` moves on to the next layer, `next('route')` skips the rest of the current route and `next(err)` jumps to the first **four-argument** middleware. A router mounted with `app.use('/prefix', router)` is a layer that holds another stack, and if no layer responds the `finalhandler` returns **404**.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "The application we will follow",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const users = express.Router();",
          'users.param("id", loadUser); // runs before the routes that have :id',
          'users.get("/new", newForm); // specific before generic',
          'users.get("/:id", checkPermission, show); // one Route with two functions',
          "",
          "const app = express();",
          "app.use(express.json()); // layer 1",
          'app.use("/users", users); // layer 2: prefix + router',
          'app.use((req, res) => res.status(404).json({ error: "Route not found" })); // layer 3',
          'app.use((err, req, res, next) => res.status(500).json({ error: "Internal error" })); // layer 4',
        ].join("\n"),
      },
      {
        tipo: "fluxo",
        titulo: "`GET /users/42`, layer by layer",
        etapas: [
          "The `node:http` server calls `app(req, res)`; Express prepares `req` and `res` and starts walking the main router’s stack, from the first layer to the last",
          "Layer 1 (`express.json()`): a `use` with no path matches any URL; there is no body to read, so it calls `next()`",
          "Layer 2 (`/users`, mounted with `app.use`): matches by **prefix**. Express strips `/users` from `req.url` (which becomes `/42`), stores the prefix in `req.baseUrl` and hands the request to the `Router`’s stack",
          "In the router, the `/new` layer does not match `/42` and is skipped; `/:id` matches, path-to-regexp extracts the parameter and `req.params.id` becomes `42` (always text)",
          "Before the route’s handlers, `router.param('id')` runs once for that value: it loads the user, stores it in `req.user` and calls `next()`",
          "The `Route` has its own stack: `checkPermission` calls `next()` and `show` answers with `res.json(...)`. Nobody calls `next()` again, so the request ends here and layers 3 and 4 never run",
        ],
        nota: "If user 99 did not exist, `router.param` would call `next(error)`: Express would skip `checkPermission` and `show` and go straight to the error layer.",
      },
      {
        tipo: "passos",
        titulo: "The detours of the stack",
        passos: [
          {
            titulo: "`next('route')`",
            texto:
              "Inside a `Route` with several functions, it abandons the remaining ones and continues at the next matching layer in the stack. It is useful for choosing the handler by condition. It only works in handlers registered with `app.get`, `router.post` and similar, not in `use`.",
          },
          {
            titulo: "`next(err)` and `throw`",
            texto:
              "An error thrown synchronously in a handler is caught by the layer and becomes `next(err)`. From then on Express only calls **error** layers, recognized by declaring **four parameters**: with only three, the function becomes an ordinary middleware and is ignored. For async handlers, see L41.",
          },
          {
            titulo: "Order rules",
            texto:
              "The first layer that matches and responds ends the story. If `/users/:id` comes before `/users/new`, a request to `/users/new` falls into the generic one, with `id` equal to “new”, and the specific one never runs. Register from the most specific to the most generic.",
          },
          {
            titulo: "Nobody responds",
            texto:
              "If the stack ends without a response, Express’s `finalhandler` returns 404 (or 500 if there was an unhandled error). And a handler that neither responds nor calls `next()` leaves the request hanging until the timeout. Your own 404 after all the routes, and an error handler after it, give the format the API promises.",
          },
          {
            titulo: "Nested routers and parameters",
            texto:
              "In `/accounts/:accountId/users`, the child router only sees `req.params.accountId` if it is created with `express.Router({ mergeParams: true })`. And `router.param` only applies to the router where it was declared: mounted routers do not inherit it.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The mental model",
        texto:
          "A **list of layers** and a pointer. `next()` advances the pointer to the next layer whose path (and, for a route, whose method) matches. `app.use` matches by **prefix**; `app.get`, `app.post` and company match the whole path and only their verb. A router is a layer that holds another list. Parameters, prefixes, errors and 404 are this list plus `next`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Path syntax depends on the version",
        texto:
          "What interprets `/:id`, wildcards and optional parameters is path-to-regexp, and the accepted syntax changed between Express versions: wildcards and optionals are written differently in newer versions, and regular expressions inside the string stopped being supported. Check the routing section of the documentation for your version, at expressjs.com, before copying an old example. By default matching ignores case and the trailing slash (`caseSensitive` and `strict` change that). For the middleware chain itself, see L37.",
      },
    ],
    armadilhas: [
      "Declaring the generic route (`/users/:id`) before the specific one (`/users/new`): the generic one “swallows” the other and `id` becomes “new”.",
      "Forgetting to respond or to call `next()`: the request hangs until the timeout, with no error in the log.",
      "Writing the error handler with three parameters: Express treats it as an ordinary middleware (it counts the function’s parameters) and the error falls to the default handler, which may show the stack.",
      "Registering the 404 before the routes: everything falls into it and routes registered after it never run.",
    ],
    autoteste: [
      {
        pergunta: "What happens when a handler calls `next('route')`?",
        resposta:
          "Express abandons the remaining functions of the current route and moves on to the next layer in the stack whose path and method match. It only works in handlers registered with `app.METHOD()` or `router.METHOD()`.",
      },
      {
        pergunta: "Why is `app.get('/users/:id')` before `app.get('/users/new')` a problem?",
        resposta:
          "The stack is walked in registration order, and the first layer that matches and responds ends the cycle. `/users/new` matches `/users/:id` (with `id` equal to “new”), so the specific route never runs.",
      },
    ],
  },
};
