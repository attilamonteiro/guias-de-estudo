import type { Pergunta } from "../../tipos";

// L84 · AsyncLocalStorage
export const l084: Pergunta = {
  numero: 184,
  modulo: "linkedin-moderno",
  metodo: "feynman",
  pt: {
    titulo: "AsyncLocalStorage",
    pergunta: "O que é o AsyncLocalStorage?",
    porqueEsteMetodo:
      "O `AsyncLocalStorage` resolve um problema difícil de enxergar no início: como carregar dados da requisição por todo o código sem passá-los de mão em mão. Uma analogia do cotidiano deixa a ideia clara antes dos detalhes da API.",
    resposta30s:
      "O **`AsyncLocalStorage`** (módulo `node:async_hooks`) é um armazenamento **local ao fluxo assíncrono**: você chama `run(store, funcao)` e tudo que essa função disparar, mesmo depois de `await`, timers ou callbacks, enxerga o mesmo valor com `getStore()`. Em produção, serve para levar **`requestId`, usuário, tenant e contexto de tracing** até logs, banco e chamadas externas sem passar parâmetros por todas as funções.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pulseira de festival. Quando a pessoa entra, recebe uma pulseira com o número dela. Em qualquer ponto do evento (bar, palco, enfermaria), um funcionário olha o pulso e sabe quem ela é, sem que ela precise repetir o nome ou entregar um papel a cada passo. A pulseira acompanha a pessoa, não o lugar.",
        tecnico:
          "`run(store, callback)` “pendura” o `store` na execução do `callback` e em tudo que nasce dele: continuações de `await`, `.then`, `setTimeout`, callbacks de E/S. Qualquer código nesse caminho chama `getStore()` e recebe o mesmo objeto. Cada requisição que entra recebe o seu próprio contexto, então duas requisições simultâneas, intercaladas pelo laço de eventos, nunca enxergam o contexto uma da outra. É o parente, no mundo assíncrono, da “variável local de thread” de outras linguagens.",
        limite:
          "A pulseira vale dentro do festival: ela não atravessa a porta para outro evento. O contexto vive no processo; para outro serviço você precisa enviá-lo explicitamente (por exemplo, um cabeçalho `x-request-id` ou `traceparent`). E se uma biblioteca guarda o seu callback numa fila própria e o chama depois, a pulseira pode se perder.",
      },
      {
        tipo: "tabela",
        titulo: "Onde usar em produção",
        colunas: ["Uso", "O que guardar no store", "Quem lê"],
        linhas: [
          [
            "Logs correlacionados",
            "`requestId` (ou `correlationId`)",
            "A função de log ou o `mixin` do logger, sem receber o id como parâmetro (veja L117)",
          ],
          [
            "Tracing distribuído",
            "Contexto do trace (ids de trace e de span)",
            "A instrumentação de tracing e os clientes HTTP, que propagam o contexto para outros serviços; bibliotecas de tracing costumam usá-lo por baixo",
          ],
          [
            "Usuário, tenant e permissões",
            "Identidade resolvida pela autenticação",
            "Camada de serviço, auditoria e filtros de multitenancy",
          ],
          [
            "Transação ou unidade de trabalho",
            "A conexão ou transação aberta para a requisição",
            "Repositórios, que usam a mesma transação sem ela ser passada adiante",
          ],
          [
            "Métricas por requisição",
            "Cronômetros, contadores e flags",
            "Código que registra o custo de banco ou de chamadas externas",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "requestId nos logs, sem passar parâmetro",
        legenda: "JavaScript",
        codigo: [
          'import { AsyncLocalStorage } from "node:async_hooks";',
          'import { createServer } from "node:http";',
          'import { randomUUID } from "node:crypto";',
          "",
          "const contexto = new AsyncLocalStorage();",
          "",
          "function log(mensagem) {",
          '  const requestId = contexto.getStore()?.requestId ?? "-";',
          "  console.log(JSON.stringify({ requestId, mensagem }));",
          "}",
          "",
          "createServer((req, res) => {",
          '  const requestId = req.headers["x-request-id"] ?? randomUUID();',
          "  contexto.run({ requestId }, async () => {",
          "    await new Promise((resolve) => setTimeout(resolve, 10));",
          '    log("depois do await"); // ainda enxerga o requestId',
          '    res.end("ok");',
          "  });",
          "}).listen(3000);",
        ].join("\n"),
        nota: "No Express, o mesmo `contexto.run(store, next)` num middleware registrado primeiro dá o contexto a todos os handlers seguintes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Perda de contexto, custo e limites",
        texto:
          "O contexto pode se perder quando uma biblioteca enfileira callbacks em estruturas próprias (alguns pools de conexão, filas, emissores de eventos registrados fora da requisição): `getStore()` devolve `undefined`. Trate esse caso com `?.` e, se preciso, reassocie o callback ao contexto (por exemplo com `AsyncResource.bind`, de `node:async_hooks`). Evite `enterWith`, que muda o contexto do restante da execução atual e é fácil de vazar. O recurso tem algum custo, que varia conforme a versão do Node.js: meça no seu caso. O contexto não atravessa processos nem worker threads. Guarde só o essencial (ids, usuário), não objetos grandes ou mutáveis compartilhados.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Por que não uma variável global?",
        texto:
          "Uma variável global (ou de módulo) é compartilhada por todas as requisições em andamento; como o laço de eventos as intercala, o `requestId` de uma sobrescreveria o da outra. O `AsyncLocalStorage` existe para dar a cada fluxo o seu valor. Passar o contexto como parâmetro é a alternativa explícita e continua válida quando o caminho é curto.",
      },
    ],
    armadilhas: [
      "Guardar o contexto numa variável global ou de módulo: as requisições concorrentes sobrescrevem umas às outras.",
      "Chamar `getStore()` fora de um `run` e assumir que existe valor: ele devolve `undefined`, e jobs, scripts e testes não passam por `run`.",
      "Usar `enterWith` à vontade: ele altera o contexto da execução atual além do que você pretendia e pode vazar para outras partes.",
      "Esperar que o contexto cruze processos, worker threads ou serviços: ele não cruza; propague ids por cabeçalhos ou mensagens.",
    ],
    autoteste: [
      {
        pergunta: "Por que não basta uma variável global para guardar o `requestId`?",
        resposta:
          "Porque várias requisições estão em andamento ao mesmo tempo, intercaladas pelo laço de eventos; a variável global seria sobrescrita pela requisição seguinte. O `AsyncLocalStorage` mantém um valor por fluxo assíncrono, inclusive através de `await`.",
      },
      {
        pergunta: "Cite dois usos do `AsyncLocalStorage` em produção.",
        resposta:
          "Correlacionar logs com um `requestId` sem passá-lo por parâmetro, e levar o contexto de tracing, o usuário ou a transação de banco da requisição até as camadas de baixo.",
      },
    ],
  },
  en: {
    titulo: "AsyncLocalStorage",
    pergunta: "What is AsyncLocalStorage?",
    porqueEsteMetodo:
      "`AsyncLocalStorage` solves a problem that is hard to see at first: how to carry request data through all the code without handing it from function to function. An everyday analogy makes the idea clear before the API details.",
    resposta30s:
      "**`AsyncLocalStorage`** (in the `node:async_hooks` module) is storage **local to an asynchronous flow**: you call `run(store, fn)` and everything that function triggers, even after `await`, timers or callbacks, sees the same value through `getStore()`. In production it carries a **`requestId`, user, tenant and tracing context** down to logs, the database and external calls without passing parameters through every function.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A festival wristband. When a person arrives, they get a wristband with their number. Anywhere at the event (bar, stage, first aid), a staff member looks at the wrist and knows who they are, without the person repeating their name or handing over a paper at every step. The wristband follows the person, not the place.",
        tecnico:
          "`run(store, callback)` “hangs” the `store` on the execution of `callback` and on everything born from it: `await` continuations, `.then`, `setTimeout`, I/O callbacks. Any code along that path calls `getStore()` and gets the same object. Each incoming request gets its own context, so two simultaneous requests, interleaved by the event loop, never see each other’s context. It is the asynchronous relative of the “thread-local variable” found in other languages.",
        limite:
          "The wristband is valid inside the festival: it does not cross the gate to another event. The context lives in the process; to reach another service you must send it explicitly (for example an `x-request-id` or `traceparent` header). And if a library keeps your callback in its own queue and calls it later, the wristband may get lost.",
      },
      {
        tipo: "tabela",
        titulo: "Where to use it in production",
        colunas: ["Use", "What to keep in the store", "Who reads it"],
        linhas: [
          [
            "Correlated logs",
            "`requestId` (or `correlationId`)",
            "The log function or the logger’s `mixin`, without receiving the id as a parameter (see L117)",
          ],
          [
            "Distributed tracing",
            "Trace context (trace and span ids)",
            "Tracing instrumentation and HTTP clients, which propagate the context to other services; tracing libraries commonly use it under the hood",
          ],
          [
            "User, tenant and permissions",
            "Identity resolved by authentication",
            "The service layer, auditing and multitenancy filters",
          ],
          [
            "Transaction or unit of work",
            "The connection or transaction opened for the request",
            "Repositories, which join the same transaction without it being passed along",
          ],
          [
            "Per-request metrics",
            "Timers, counters and flags",
            "Code that records the cost of database or external calls",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "requestId in logs, without passing a parameter",
        legenda: "JavaScript",
        codigo: [
          'import { AsyncLocalStorage } from "node:async_hooks";',
          'import { createServer } from "node:http";',
          'import { randomUUID } from "node:crypto";',
          "",
          "const context = new AsyncLocalStorage();",
          "",
          "function log(message) {",
          '  const requestId = context.getStore()?.requestId ?? "-";',
          "  console.log(JSON.stringify({ requestId, message }));",
          "}",
          "",
          "createServer((req, res) => {",
          '  const requestId = req.headers["x-request-id"] ?? randomUUID();',
          "  context.run({ requestId }, async () => {",
          "    await new Promise((resolve) => setTimeout(resolve, 10));",
          '    log("after the await"); // still sees the requestId',
          '    res.end("ok");',
          "  });",
          "}).listen(3000);",
        ].join("\n"),
        nota: "In Express, the same `context.run(store, next)` in a middleware registered first gives the context to every handler after it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Lost context, cost and limits",
        texto:
          "The context can be lost when a library queues callbacks in its own structures (some connection pools, queues, event emitters registered outside the request): `getStore()` returns `undefined`. Handle that case with `?.` and, if needed, rebind the callback to the context (for example with `AsyncResource.bind`, from `node:async_hooks`). Avoid `enterWith`, which changes the context for the rest of the current execution and is easy to leak. The feature has some cost, which varies by Node.js version: measure it in your case. The context does not cross processes or worker threads. Store only the essentials (ids, user), not large or shared mutable objects.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Why not a global variable?",
        texto:
          "A global (or module-level) variable is shared by every request in flight; since the event loop interleaves them, one request’s `requestId` would overwrite another’s. `AsyncLocalStorage` exists to give each flow its own value. Passing the context as a parameter is the explicit alternative and remains valid when the call path is short.",
      },
    ],
    armadilhas: [
      "Keeping the context in a global or module-level variable: concurrent requests overwrite each other.",
      "Calling `getStore()` outside a `run` and assuming there is a value: it returns `undefined`, and jobs, scripts and tests do not go through `run`.",
      "Using `enterWith` freely: it changes the current execution’s context beyond what you intended and can leak into other parts.",
      "Expecting the context to cross processes, worker threads or services: it does not; propagate ids through headers or messages.",
    ],
    autoteste: [
      {
        pergunta: "Why is a global variable not enough to hold the `requestId`?",
        resposta:
          "Because many requests are in flight at once, interleaved by the event loop; the global would be overwritten by the next request. `AsyncLocalStorage` keeps one value per asynchronous flow, even across `await`.",
      },
      {
        pergunta: "Name two production uses of `AsyncLocalStorage`.",
        resposta:
          "Correlating logs with a `requestId` without passing it as a parameter, and carrying the request’s tracing context, user or database transaction down to the lower layers.",
      },
    ],
  },
};
