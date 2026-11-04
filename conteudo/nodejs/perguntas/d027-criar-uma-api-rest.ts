import type { Pergunta } from "../../tipos";

// D27 · Criar uma API REST
export const d027: Pergunta = {
  numero: 327,
  modulo: "devinterview-rede-e-erros",
  metodo: "playbook",
  pt: {
    titulo: "Criar uma API REST",
    pergunta: "Como você cria uma API RESTful com o Node.js?",
    porqueEsteMetodo:
      "Criar uma API é uma sequência de decisões que dependem umas das outras: recursos, métodos, camadas, erros, segurança. Um playbook dá a ordem para tomá-las e o sinal de que cada uma ficou boa.",
    resposta30s:
      "Uma API REST modela **recursos** com URLs em substantivos (`/pedidos/42`), age sobre eles com os **métodos HTTP** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e responde com **status codes** coerentes e JSON. No Node.js você a monta com Express ou Fastify, organizada em **camadas** (rota, controlador, serviço, repositório), com validação na entrada, erros num formato único, paginação, versionamento, autenticação e um contrato **OpenAPI**. O framework muda; o desenho, não.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: de uma ideia a uma API REST",
        passos: [
          {
            titulo: "Modele os recursos",
            texto:
              "Liste os substantivos do domínio e dê a cada um uma URL no plural: `/pedidos`, `/pedidos/42`, `/pedidos/42/itens`. O verbo fica no método HTTP, não na URL (`POST /pedidos`, e não `/criarPedido`). Sinal de acerto: você descreve a API inteira só com substantivos.",
          },
          {
            titulo: "Escolha os métodos pela semântica",
            texto:
              "`GET` lê e não altera nada; `POST` cria ou dispara uma ação e não é idempotente; `PUT` substitui e `DELETE` remove, ambos idempotentes (repetir deixa o mesmo estado); `PATCH` altera em parte (veja F43). Critério: um cliente ou proxy pode repetir um `GET` ou um `PUT` sem medo, e isso precisa continuar verdade.",
          },
          {
            titulo: "Separe em camadas",
            texto:
              "A **rota** liga método e URL a um controlador; o **controlador** traduz HTTP (lê `req`, escolhe o status) e chama o **serviço**, que guarda a regra de negócio sem conhecer HTTP; o **repositório** fala com o banco. Sinal de acerto: você testa o serviço sem subir servidor.",
          },
          {
            titulo: "Valide e padronize as respostas",
            texto:
              "Valide corpo, parâmetros e consulta na borda, com um esquema (veja L50). Use os códigos de status certos (veja L55) e um único formato de erro, sem vazar detalhes internos (veja L54).",
          },
          {
            titulo: "Faça as listas escalarem",
            texto:
              "Toda coleção tem paginação com limite máximo (`?limite=20&cursor=...` ou `?pagina=2`), além de filtros e ordenação por parâmetros de consulta. Critério: nenhum `GET` devolve a tabela inteira.",
          },
          {
            titulo: "Proteja e versione",
            texto:
              "Exija autenticação, autorize por recurso (quem pode ver ou alterar este pedido?), limite a taxa de requisições e use HTTPS. Planeje a evolução (veja L52): mudança que não quebra o cliente entra sem versão nova; a que quebra ganha `/v2`, com a anterior mantida por um prazo.",
          },
          {
            titulo: "Documente e teste",
            texto:
              "Descreva o contrato em **OpenAPI** (gerado do código ou escrito antes) e teste a API por HTTP, com um banco de teste (veja D38). Sinal de acerto: o documento e os testes quebram quando o comportamento muda.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Esqueleto com Express",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import * as pedidos from "./pedidos.servico.js"; // regra de negócio, sem HTTP',
          "",
          "const rotas = express.Router();",
          'rotas.get("/pedidos/:id", async (req, res) => {',
          "  const pedido = await pedidos.buscar(req.params.id);",
          '  if (!pedido) return res.status(404).json({ erro: "pedido_nao_encontrado" });',
          "  res.json(pedido);",
          "});",
          'rotas.post("/pedidos", async (req, res) => {',
          "  const criado = await pedidos.criar(req.body); // já validado por um middleware",
          "  res.status(201).location(`/v1/pedidos/${criado.id}`).json(criado);",
          "});",
          "",
          "const app = express();",
          'app.use(express.json({ limit: "100kb" }));',
          'app.use("/v1", rotas); // a versão vai no caminho',
          'app.use((erro, req, res, next) => res.status(erro.status ?? 500).json({ erro: erro.codigo ?? "erro_interno" }));',
          "app.listen(3000);",
        ].join("\n"),
        nota: "Em versões recentes do Express, a rejeição de um handler `async` chega sozinha ao middleware de erro; nas antigas, envolva o corpo em `try/catch` e chame `next(erro)` (veja L41). Confira a documentação em expressjs.com.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Boas práticas de projeto, em resumo",
        texto:
          "Substantivos no plural nas URLs e o verbo no método. Status codes honestos e **um** formato de erro. Idempotência respeitada: `PUT` e `DELETE` repetíveis, e uma `Idempotency-Key` quando um `POST` não pode duplicar. Coleções paginadas e com limite. Entrada validada na borda e saída sem dados internos. Autenticação, autorização por recurso e limite de taxa. Evolução sem quebrar clientes. Contrato documentado e testado. Nada disso depende do framework.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "REST não é só JSON sobre HTTP",
        texto:
          "URLs como `/getUsuario` ou `/criarPedido`, ou um único `POST /api` que recebe o comando no corpo, são RPC sobre HTTP, não REST: funcionam, mas perdem cache, previsibilidade e a semântica dos métodos. O REST original ainda inclui HATEOAS (links no corpo que guiam o cliente), que a maioria das APIs “REST” do mercado não implementa. Tudo bem, desde que seja uma escolha consciente que você saiba explicar.",
      },
    ],
    armadilhas: [
      "Colocar o verbo na URL (`/criarPedido`) ou usar o método errado (um `GET` que altera estado): quebra cache, proxies e a idempotência esperada pelos clientes.",
      "Devolver `200` com o erro no corpo, ou deixar vazar a stack e a mensagem do banco: o cliente não consegue tratar o erro e você expõe a sua implementação.",
      "Listar sem paginação nem limite: funciona com 50 registros e derruba o servidor com 5 milhões.",
      "Pôr regra de negócio no controlador e confiar só na validação do cliente: a regra fica difícil de testar sem HTTP e qualquer chamada direta à API a contorna.",
    ],
    autoteste: [
      {
        pergunta: "Por que `PUT /pedidos/42` pode ser repetido sem medo e `POST /pedidos` não?",
        resposta:
          "`PUT` é idempotente: repetir a mesma chamada deixa o recurso no mesmo estado. `POST` cria algo novo a cada chamada, então um retry pode duplicar o pedido. Por isso se usa uma `Idempotency-Key` quando o `POST` não pode duplicar.",
      },
      {
        pergunta: "O que cada camada (rota, controlador, serviço, repositório) faz, e o que se ganha separando?",
        resposta:
          "A rota liga URL e método ao controlador; o controlador traduz HTTP; o serviço aplica a regra de negócio; o repositório acessa os dados. Ganha-se testabilidade (o serviço roda sem HTTP) e liberdade para trocar framework ou banco sem reescrever a regra.",
      },
    ],
  },
  en: {
    titulo: "Building a REST API",
    pergunta: "How do you create a RESTful API with Node.js?",
    porqueEsteMetodo:
      "Building an API is a sequence of decisions that depend on one another: resources, methods, layers, errors, security. A playbook gives the order for making them and the sign that each one turned out well.",
    resposta30s:
      "A REST API models **resources** with noun-based URLs (`/orders/42`), acts on them with the **HTTP methods** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) and answers with consistent **status codes** and JSON. In Node.js you build it with Express or Fastify, organized in **layers** (route, controller, service, repository), with input validation, errors in a single format, pagination, versioning, authentication and an **OpenAPI** contract. The framework changes; the design does not.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from an idea to a REST API",
        passos: [
          {
            titulo: "Model the resources",
            texto:
              "List the nouns of the domain and give each one a plural URL: `/orders`, `/orders/42`, `/orders/42/items`. The verb lives in the HTTP method, not in the URL (`POST /orders`, not `/createOrder`). Sign of success: you can describe the whole API using only nouns.",
          },
          {
            titulo: "Pick methods by their semantics",
            texto:
              "`GET` reads and changes nothing; `POST` creates or triggers an action and is not idempotent; `PUT` replaces and `DELETE` removes, both idempotent (repeating leaves the same state); `PATCH` changes part of a resource (see F43). Criterion: a client or proxy can retry a `GET` or a `PUT` safely, and that must stay true.",
          },
          {
            titulo: "Separate it into layers",
            texto:
              "The **route** ties method and URL to a controller; the **controller** translates HTTP (reads `req`, picks the status) and calls the **service**, which holds the business rule without knowing about HTTP; the **repository** talks to the database. Sign of success: you test the service without starting a server.",
          },
          {
            titulo: "Validate and standardize responses",
            texto:
              "Validate body, parameters and query at the edge, with a schema (see L50). Use the right status codes (see L55) and a single error format, without leaking internal details (see L54).",
          },
          {
            titulo: "Make lists scale",
            texto:
              "Every collection has pagination with a maximum limit (`?limit=20&cursor=...` or `?page=2`), plus filters and sorting through query parameters. Criterion: no `GET` returns the whole table.",
          },
          {
            titulo: "Protect and version",
            texto:
              "Require authentication, authorize per resource (who may see or change this order?), rate-limit requests and use HTTPS. Plan the evolution (see L52): a change that does not break the client ships without a new version; one that does gets `/v2`, with the previous one kept for a grace period.",
          },
          {
            titulo: "Document and test",
            texto:
              "Describe the contract in **OpenAPI** (generated from the code or written first) and test the API over HTTP, with a test database (see D38). Sign of success: the document and the tests break when behavior changes.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A skeleton with Express",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import * as orders from "./orders.service.js"; // business rules, no HTTP',
          "",
          "const routes = express.Router();",
          'routes.get("/orders/:id", async (req, res) => {',
          "  const order = await orders.find(req.params.id);",
          '  if (!order) return res.status(404).json({ error: "order_not_found" });',
          "  res.json(order);",
          "});",
          'routes.post("/orders", async (req, res) => {',
          "  const created = await orders.create(req.body); // already validated by a middleware",
          "  res.status(201).location(`/v1/orders/${created.id}`).json(created);",
          "});",
          "",
          "const app = express();",
          'app.use(express.json({ limit: "100kb" }));',
          'app.use("/v1", routes); // the version goes in the path',
          'app.use((error, req, res, next) => res.status(error.status ?? 500).json({ error: error.code ?? "internal_error" }));',
          "app.listen(3000);",
        ].join("\n"),
        nota: "In recent Express versions, a rejection in an `async` handler reaches the error middleware on its own; in older ones, wrap the body in `try/catch` and call `next(error)` (see L41). Check the documentation at expressjs.com.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Design best practices, in short",
        texto:
          "Plural nouns in the URLs and the verb in the method. Honest status codes and **one** error format. Idempotency respected: `PUT` and `DELETE` safe to repeat, and an `Idempotency-Key` when a `POST` must not duplicate. Collections paginated and capped. Input validated at the edge and output free of internal data. Authentication, per-resource authorization and rate limiting. Evolution that does not break clients. A documented, tested contract. None of this depends on the framework.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "REST is not just JSON over HTTP",
        texto:
          "URLs like `/getUser` or `/createOrder`, or a single `POST /api` that receives the command in the body, are RPC over HTTP, not REST: they work, but lose caching, predictability and the semantics of the methods. Original REST also includes HATEOAS (links in the body that guide the client), which most “REST” APIs in the market do not implement. That is fine, as long as it is a conscious choice you can explain.",
      },
    ],
    armadilhas: [
      "Putting the verb in the URL (`/createOrder`) or using the wrong method (a `GET` that changes state): it breaks caches, proxies and the idempotency clients expect.",
      "Returning `200` with the error in the body, or leaking the stack and the database message: the client cannot handle the error and you expose your implementation.",
      "Listing without pagination or a limit: it works with 50 records and takes the server down with 5 million.",
      "Putting business rules in the controller and trusting only client-side validation: the rule becomes hard to test without HTTP and any direct call to the API bypasses it.",
    ],
    autoteste: [
      {
        pergunta: "Why is `PUT /orders/42` safe to repeat and `POST /orders` is not?",
        resposta:
          "`PUT` is idempotent: repeating the same call leaves the resource in the same state. `POST` creates something new on every call, so a retry can duplicate the order. That is why an `Idempotency-Key` is used when a `POST` must not duplicate.",
      },
      {
        pergunta:
          "What does each layer (route, controller, service, repository) do, and what do you gain by separating them?",
        resposta:
          "The route ties URL and method to the controller; the controller translates HTTP; the service applies the business rule; the repository accesses the data. You gain testability (the service runs without HTTP) and the freedom to swap the framework or the database without rewriting the rule.",
      },
    ],
  },
};
