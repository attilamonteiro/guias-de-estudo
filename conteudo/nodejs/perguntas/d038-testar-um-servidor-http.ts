import type { Pergunta } from "../../tipos";

// D38 · Testar um servidor HTTP
export const d038: Pergunta = {
  numero: 338,
  modulo: "devinterview-testes-e-dados",
  metodo: "playbook",
  pt: {
    titulo: "Testar um servidor HTTP",
    pergunta: "Como você testa um servidor HTTP no Node.js?",
    porqueEsteMetodo:
      "Testar um servidor tem uma ordem e armadilhas conhecidas: separar a aplicação da porta, escolher como chamá-la, cobrir os erros, cuidar dos dados e encerrar tudo. Um playbook percorre cada etapa com o sinal de que ela ficou certa.",
    resposta30s:
      "Separe o **`app`** do **`listen`**: exporte a aplicação sem abrir porta e deixe o `listen` num arquivo de inicialização. No teste, use o **Supertest** (que sobe o `app` sozinho numa porta efêmera) ou `listen(0)` e o `fetch` nativo, e verifique **status, cabeçalhos e corpo**, inclusive nos caminhos de erro (400, 401, 404, 500). Use um banco de teste, um contêiner ou dublês, **limpe o estado entre os testes** e feche o servidor no fim, para o executor terminar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: testar uma API HTTP",
        passos: [
          {
            titulo: "Separe o `app` do `listen`",
            texto:
              "Um módulo (`app.js`) cria e exporta a aplicação com rotas e middlewares; outro (`server.js`) chama `listen`. O teste importa só o `app`. Sinal de acerto: importar o `app` não abre porta nem conecta a lugar nenhum.",
          },
          {
            titulo: "Escolha como falar com ele",
            texto:
              'O **Supertest** recebe o `app` e sobe um servidor temporário por chamada (`request(app).get("/pedidos")`). Sem biblioteca, chame `app.listen(0)`, leia a porta atribuída pelo sistema em `servidor.address().port` e use o `fetch` nativo. Em ambos os casos não há porta fixa para colidir.',
          },
          {
            titulo: "Verifique o contrato inteiro",
            texto:
              "Confira o código de status, os cabeçalhos relevantes (`Content-Type`, `Location` após um `201`, cabeçalhos de segurança) e o corpo (formato e campos), não só o `200`. Um teste que só confere que a rota respondeu deixa passar respostas erradas.",
          },
          {
            titulo: "Cubra os caminhos de erro",
            texto:
              "Corpo inválido (`400`), sem credencial (`401`), sem permissão (`403`), recurso inexistente (`404`), conflito (`409`) e falha interna (`500`, com a dependência trocada por um dublê que lança). Critério: cada ramo de erro da rota tem ao menos um teste.",
          },
          {
            titulo: "Cuide dos dados e da autenticação",
            texto:
              "Use um banco de teste dedicado, um contêiner descartável ou dublês (veja D36), e nunca o banco de produção. Para rotas protegidas, gere um token válido no teste ou troque o middleware de autenticação por outro que injete um usuário. **Limpe o estado entre os testes** (transação com rollback, truncar tabelas, recriar fixtures) para que a ordem não importe.",
          },
          {
            titulo: "Feche o servidor e as conexões",
            texto:
              "Chame `servidor.close()` e encerre o pool do banco num `after`/`afterAll`. Sinal de acerto: o executor termina sozinho. Se ele fica pendurado, há uma conexão ou um servidor aberto; `--forceExit` esconde o vazamento em vez de resolvê-lo.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Porta efêmera, `fetch` nativo e `node:test`",
        legenda: "JavaScript",
        codigo: [
          'import { test, before, after } from "node:test";',
          'import assert from "node:assert/strict";',
          'import { app } from "./app.js"; // exporta o app, sem chamar listen',
          "",
          "let servidor, base;",
          "before(async () => {",
          "  servidor = app.listen(0); // porta 0: o sistema escolhe uma porta livre",
          '  await new Promise((pronto) => servidor.once("listening", pronto));',
          "  base = `http://127.0.0.1:${servidor.address().port}`;",
          "});",
          "after(() => servidor.close()); // sem isso, o processo de teste não termina",
          "",
          'test("GET /pedidos/999 devolve 404 em JSON", async () => {',
          "  const res = await fetch(`${base}/pedidos/999`);",
          "  assert.equal(res.status, 404);",
          '  assert.match(res.headers.get("content-type"), /application\\/json/);',
          '  assert.deepEqual(await res.json(), { erro: "pedido_nao_encontrado" });',
          "});",
        ].join("\n"),
        nota: 'Com o Supertest, o `before` e o `after` somem: `await request(app).get("/pedidos/999").expect(404)` cuida da porta. Se o `close()` demorar por conexões keep-alive abertas, versões recentes do Node.js têm `closeIdleConnections()` e `closeAllConnections()` no servidor: confira a documentação.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que este teste cobre, e o que não",
        texto:
          "Testar pelo HTTP é um teste de **integração**: ele prova que rota, middlewares, validação, serialização e códigos de status funcionam juntos. A regra de negócio detalhada continua nos testes de **unidade** do serviço, sem HTTP, que são mais rápidos e mais precisos (veja D35). Poucos testes bem escolhidos pelo HTTP, nos caminhos principais e de erro, bastam: não repita aqui cada combinação da regra.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Dependências reais mudam o teste",
        texto:
          "Se o teste chama um banco ou uma API de verdade, ele fica lento e passa a falhar por motivos alheios ao código (rede, dados de outra execução). Isole o que for externo e controle o estado. Um teste destrutivo (apagar, truncar) só pode apontar para um banco **de teste**, nunca para o compartilhado ou o de produção: confira a string de conexão antes de rodar.",
      },
    ],
    armadilhas: [
      "Chamar `listen(3000)` dentro do módulo importado: arquivos de teste em paralelo disputam a mesma porta e o processo nunca encerra.",
      "Testar só o caminho feliz (`200`): os erros `4xx` e `5xx` e a autenticação são onde as rotas mais quebram.",
      "Deixar o estado vazar entre os testes: eles passam isolados, falham em conjunto e só no CI, conforme a ordem de execução.",
      "Esquecer de fechar o servidor ou o pool de conexões, e esconder o problema com `--forceExit`: o executor trava ou o vazamento passa despercebido.",
    ],
    autoteste: [
      {
        pergunta: "Por que separar o `app` do `listen`?",
        resposta:
          "Para o teste importar a aplicação sem abrir uma porta fixa. O Supertest (ou um `listen(0)` no teste) escolhe uma porta livre, evita colisões entre arquivos de teste em paralelo e deixa você fechar o servidor no fim.",
      },
      {
        pergunta: "Como testar o caminho de erro `500` de uma rota?",
        resposta:
          "Troque a dependência que a rota usa (o serviço ou o repositório) por um dublê que lança um erro, faça a requisição e verifique que o status é 500 e que o corpo é genérico, sem stack nem mensagem interna.",
      },
    ],
  },
  en: {
    titulo: "Testing an HTTP server",
    pergunta: "How do you test an HTTP server in Node.js?",
    porqueEsteMetodo:
      "Testing a server has an order and known traps: separate the application from the port, choose how to call it, cover the errors, take care of the data and shut everything down. A playbook walks through each step with the sign that it was done right.",
    resposta30s:
      "Separate the **`app`** from **`listen`**: export the application without opening a port and keep `listen` in a startup file. In the test, use **Supertest** (which starts the `app` itself on an ephemeral port) or `listen(0)` with the built-in `fetch`, and check **status, headers and body**, including the error paths (400, 401, 404, 500). Use a test database, a container or doubles, **clean the state between tests** and close the server at the end so the runner can exit.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: testing an HTTP API",
        passos: [
          {
            titulo: "Separate the `app` from `listen`",
            texto:
              "One module (`app.js`) creates and exports the application with its routes and middlewares; another (`server.js`) calls `listen`. The test imports only the `app`. Sign of success: importing the `app` neither opens a port nor connects anywhere.",
          },
          {
            titulo: "Choose how to talk to it",
            texto:
              '**Supertest** takes the `app` and starts a temporary server per call (`request(app).get("/orders")`). Without a library, call `app.listen(0)`, read the port the system assigned from `server.address().port` and use the built-in `fetch`. Either way there is no fixed port to collide.',
          },
          {
            titulo: "Check the whole contract",
            texto:
              "Check the status code, the relevant headers (`Content-Type`, `Location` after a `201`, security headers) and the body (format and fields), not just the `200`. A test that only checks the route answered lets wrong responses through.",
          },
          {
            titulo: "Cover the error paths",
            texto:
              "Invalid body (`400`), no credentials (`401`), no permission (`403`), missing resource (`404`), conflict (`409`) and internal failure (`500`, with the dependency replaced by a double that throws). Criterion: every error branch of the route has at least one test.",
          },
          {
            titulo: "Take care of data and authentication",
            texto:
              "Use a dedicated test database, a disposable container or doubles (see D36), and never the production database. For protected routes, generate a valid token in the test or swap the authentication middleware for one that injects a user. **Clean the state between tests** (rollback transaction, truncate tables, recreate fixtures) so order does not matter.",
          },
          {
            titulo: "Close the server and the connections",
            texto:
              "Call `server.close()` and shut down the database pool in an `after`/`afterAll`. Sign of success: the runner exits on its own. If it hangs, a connection or a server is still open; `--forceExit` hides the leak instead of fixing it.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ephemeral port, built-in `fetch` and `node:test`",
        legenda: "JavaScript",
        codigo: [
          'import { test, before, after } from "node:test";',
          'import assert from "node:assert/strict";',
          'import { app } from "./app.js"; // exports the app, without calling listen',
          "",
          "let server, base;",
          "before(async () => {",
          "  server = app.listen(0); // port 0: the system picks a free port",
          '  await new Promise((ready) => server.once("listening", ready));',
          "  base = `http://127.0.0.1:${server.address().port}`;",
          "});",
          "after(() => server.close()); // without this, the test process never exits",
          "",
          'test("GET /orders/999 returns 404 as JSON", async () => {',
          "  const res = await fetch(`${base}/orders/999`);",
          "  assert.equal(res.status, 404);",
          '  assert.match(res.headers.get("content-type"), /application\\/json/);',
          '  assert.deepEqual(await res.json(), { error: "order_not_found" });',
          "});",
        ].join("\n"),
        nota: 'With Supertest, `before` and `after` disappear: `await request(app).get("/orders/999").expect(404)` takes care of the port. If `close()` is slow because of open keep-alive connections, recent Node.js versions have `closeIdleConnections()` and `closeAllConnections()` on the server: check the documentation.',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What this test covers, and what it does not",
        texto:
          "Testing over HTTP is an **integration** test: it proves that route, middlewares, validation, serialization and status codes work together. Detailed business rules stay in the service’s **unit** tests, without HTTP, which are faster and more precise (see D35). A few well-chosen HTTP tests, on the main and error paths, are enough: do not repeat every rule combination here.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Real dependencies change the test",
        texto:
          "If the test calls a real database or API, it gets slow and starts failing for reasons unrelated to the code (network, data left by another run). Isolate what is external and control the state. A destructive test (delete, truncate) may only point at a **test** database, never the shared or production one: check the connection string before running.",
      },
    ],
    armadilhas: [
      "Calling `listen(3000)` inside the imported module: parallel test files fight over the same port and the process never exits.",
      "Testing only the happy path (`200`): `4xx` and `5xx` errors and authentication are where routes break most.",
      "Letting state leak between tests: they pass alone, fail together, and only in CI, depending on execution order.",
      "Forgetting to close the server or the connection pool, and hiding the problem with `--forceExit`: the runner hangs or the leak goes unnoticed.",
    ],
    autoteste: [
      {
        pergunta: "Why separate the `app` from `listen`?",
        resposta:
          "So the test can import the application without opening a fixed port. Supertest (or a `listen(0)` in the test) picks a free port, avoids collisions between parallel test files and lets you close the server at the end.",
      },
      {
        pergunta: "How do you test the `500` error path of a route?",
        resposta:
          "Replace the dependency the route uses (the service or the repository) with a double that throws an error, make the request and check that the status is 500 and the body is generic, with no stack or internal message.",
      },
    ],
  },
};
