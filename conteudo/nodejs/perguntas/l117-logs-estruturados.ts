import type { Pergunta } from "../../tipos";

// L117 · Logs estruturados
export const l117: Pergunta = {
  numero: 217,
  modulo: "linkedin-producao",
  metodo: "playbook",
  pt: {
    titulo: "Logs estruturados",
    pergunta: "Como você implementa logs estruturados?",
    porqueEsteMetodo:
      "Implementar logs é uma sequência de decisões práticas, e cada uma tem um critério de acerto. O playbook ordena essas decisões (formato, biblioteca, destino, contexto, proteção e volume) e mostra como saber se cada uma deu certo.",
    resposta30s:
      "Registre **uma linha de JSON por evento**, com nível, hora, mensagem e campos de contexto, usando uma biblioteca como **pino** (ou winston), escrevendo em **stdout** e deixando a plataforma coletar. Coloque um **`requestId`** em toda linha, guardado em `AsyncLocalStorage`, para correlacionar tudo o que uma requisição fez entre serviços. **Nunca registre segredos** (use redação de campos) e controle o volume com níveis e amostragem.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do `console.log` ao log estruturado",
        passos: [
          {
            titulo: "Escolha o formato: uma linha de JSON por evento",
            texto:
              "Cada linha é um objeto com campos de nome estável (`level`, `time`, `msg` e o contexto do caso). As ferramentas filtram por campo (`requestId`, `userId`, `status`) sem regex frágil. Critério: qualquer linha de produção é lida por uma máquina sem adivinhar nada; use um formatador legível (`pino-pretty`) só no desenvolvimento.",
          },
          {
            titulo: "Use uma biblioteca e defina os níveis",
            texto:
              "O **pino** é rápido e já escreve JSON; o **winston** é mais flexível, com vários destinos (transports). Use `error`, `warn`, `info`, `debug` e `trace`, com o nível vindo de uma variável de ambiente (`LOG_LEVEL`). Sinal de acerto: `info` por padrão em produção e `debug` ligado só enquanto você investiga.",
          },
          {
            titulo: "Escreva em stdout e deixe a plataforma coletar",
            texto:
              "O processo escreve apenas no `stdout`; o contêiner, o orquestrador ou um agente encaminha ao agregador de logs. Evite arquivos locais e rotação dentro da aplicação. Critério: a aplicação não precisa saber para onde os logs vão.",
          },
          {
            titulo: "Propague o contexto da requisição",
            texto:
              "Gere (ou aceite do gateway) um `requestId` no início de cada requisição, guarde-o em `AsyncLocalStorage` (veja L84) e injete-o em toda linha, sem passar o logger como parâmetro. Repasse o mesmo id, num cabeçalho, nas chamadas a outros serviços. Sinal de acerto: filtrar por um id mostra a história da requisição em todos os serviços.",
          },
          {
            titulo: "Registre campos, não frases",
            texto:
              "Em vez de montar a mensagem por concatenação, passe os dados como campos e deixe a mensagem curta e constante (`pedido criado`). Para erros, passe o próprio objeto `Error` (`log.error({ err }, ...)`) para o logger serializar a mensagem e a pilha; no pino, a chave `err` recebe o serializador padrão.",
          },
          {
            titulo: "Proteja segredos e controle o volume",
            texto:
              "Configure a redação de campos sensíveis (`authorization`, senhas, tokens, documentos, cartões) e registre uma lista curta de campos permitidos, não o corpo inteiro da requisição. Para eventos frequentes e sem erro, use amostragem ou o nível `debug`; erros nunca se amostram. Critério: um log vazado, ou lido por muita gente, não expõe o que não devia.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "pino com requestId em toda linha",
        legenda: "JavaScript",
        codigo:
          'import { AsyncLocalStorage } from "node:async_hooks";\nimport { randomUUID } from "node:crypto";\nimport pino from "pino";\n\nconst contexto = new AsyncLocalStorage();\n\nexport const log = pino({\n  level: process.env.LOG_LEVEL ?? "info",\n  redact: ["req.headers.authorization", "*.senha"],\n  mixin: () => contexto.getStore() ?? {}, // requestId em toda linha\n});\n\nexport function comRequestId(req, res, next) {\n  const requestId = req.get("x-request-id") ?? randomUUID();\n  contexto.run({ requestId }, next);\n}\n\nlog.info({ pedidoId: 42, duracaoMs: 87 }, "pedido criado");\n// {"level":30,"requestId":"…","pedidoId":42,"duracaoMs":87,"msg":"pedido criado"}',
        nota: "A saída acima está simplificada: o pino também grava `time`, `pid` e `hostname`. Confira as opções na documentação da biblioteca.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O teste de um bom log",
        texto:
          "Dada uma linha isolada, você sabe dizer **o que aconteceu, em qual requisição, com quem e em quanto tempo**, sem abrir o código? Se não, falta campo (`requestId`, `userId`, `duracaoMs`) ou a mensagem diz pouco. Logs respondem “o que houve neste caso”; para tendências e alertas, use métricas (veja L118).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Log também é dado sensível",
        texto:
          "Tudo o que vai para o log é guardado, copiado e lido por muita gente, muitas vezes por mais tempo do que se imagina. Nunca registre senhas, tokens, cabeçalhos `Authorization`, números de cartão ou dados pessoais sem necessidade. Prefira redação por caminho (`redact`) e uma lista de campos permitidos a confiar na memória de quem escreve o código.",
      },
    ],
    armadilhas: [
      'Montar a mensagem por concatenação (`"pedido " + id`) em vez de usar campos: cada consulta vira uma regex e os filtros do agregador deixam de funcionar.',
      "Registrar o corpo inteiro da requisição, ou os cabeçalhos, “para facilitar o debug”: senhas e tokens acabam no agregador.",
      "Usar `console.log` sem nível e sem `requestId`: não dá para filtrar o que importa nem juntar as linhas de uma mesma requisição.",
      "Deixar `debug` ligado em produção ou registrar uma linha por iteração de laço: custo de CPU e de armazenamento, e o que importa se perde no ruído.",
    ],
    autoteste: [
      {
        pergunta: "Por que JSON em vez de texto livre?",
        resposta:
          "Porque os campos têm nomes estáveis que o agregador indexa e filtra (`requestId`, `status`, `duracaoMs`), sem regex frágil. Isso também permite montar consultas, gráficos e alertas a partir dos logs.",
      },
      {
        pergunta: "Como achar todas as linhas de uma requisição que passou por três serviços?",
        resposta:
          "Com um id de correlação gerado na borda, repassado em cabeçalho a cada chamada e injetado em toda linha de log (via `AsyncLocalStorage`). Filtra-se pelo id no agregador.",
      },
    ],
  },
  en: {
    titulo: "Structured logging",
    pergunta: "How do you implement structured logging?",
    porqueEsteMetodo:
      "Implementing logging is a sequence of practical decisions, and each one has a success criterion. The playbook orders those decisions (format, library, destination, context, protection and volume) and shows how to tell whether each one worked.",
    resposta30s:
      "Log **one line of JSON per event**, with level, time, message and context fields, using a library such as **pino** (or winston), writing to **stdout** and letting the platform collect it. Put a **`requestId`** in every line, kept in `AsyncLocalStorage`, to correlate everything a request did across services. **Never log secrets** (redact fields) and control volume with levels and sampling.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from `console.log` to structured logs",
        passos: [
          {
            titulo: "Choose the format: one line of JSON per event",
            texto:
              "Each line is an object with stable field names (`level`, `time`, `msg` and the case’s context). Tools filter by field (`requestId`, `userId`, `status`) with no fragile regex. Criterion: any production line can be read by a machine without guessing; use a human-readable formatter (`pino-pretty`) only in development.",
          },
          {
            titulo: "Use a library and define the levels",
            texto:
              "**pino** is fast and writes JSON natively; **winston** is more flexible, with several destinations (transports). Use `error`, `warn`, `info`, `debug` and `trace`, with the level coming from an environment variable (`LOG_LEVEL`). A sign of success: `info` by default in production, and `debug` turned on only while you investigate.",
          },
          {
            titulo: "Write to stdout and let the platform collect",
            texto:
              "The process writes only to `stdout`; the container, the orchestrator or an agent forwards it to the log aggregator. Avoid local files and log rotation inside the application. Criterion: the application does not need to know where its logs go.",
          },
          {
            titulo: "Propagate the request context",
            texto:
              "Generate (or accept from the gateway) a `requestId` at the start of each request, keep it in `AsyncLocalStorage` (see L84) and inject it into every line, without passing the logger around as a parameter. Forward the same id, in a header, on calls to other services. A sign of success: filtering by one id shows the request’s story across all services.",
          },
          {
            titulo: "Log fields, not sentences",
            texto:
              "Instead of building the message by concatenation, pass the data as fields and keep the message short and constant (`order created`). For errors, pass the `Error` object itself (`log.error({ err }, ...)`) so the logger serializes the message and the stack; in pino, the `err` key gets the standard serializer.",
          },
          {
            titulo: "Protect secrets and control volume",
            texto:
              "Configure redaction for sensitive fields (`authorization`, passwords, tokens, personal IDs, cards) and log a short allowed list of fields, not the whole request body. For frequent, non-error events, use sampling or the `debug` level; errors are never sampled. Criterion: a leaked log, or one read by many people, does not expose what it should not.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "pino with requestId in every line",
        legenda: "JavaScript",
        codigo:
          'import { AsyncLocalStorage } from "node:async_hooks";\nimport { randomUUID } from "node:crypto";\nimport pino from "pino";\n\nconst context = new AsyncLocalStorage();\n\nexport const log = pino({\n  level: process.env.LOG_LEVEL ?? "info",\n  redact: ["req.headers.authorization", "*.password"],\n  mixin: () => context.getStore() ?? {}, // requestId in every line\n});\n\nexport function withRequestId(req, res, next) {\n  const requestId = req.get("x-request-id") ?? randomUUID();\n  context.run({ requestId }, next);\n}\n\nlog.info({ orderId: 42, durationMs: 87 }, "order created");\n// {"level":30,"requestId":"…","orderId":42,"durationMs":87,"msg":"order created"}',
        nota: "The output above is simplified: pino also writes `time`, `pid` and `hostname`. Check the options in the library’s documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The test of a good log",
        texto:
          "Given a single line, can you say **what happened, in which request, to whom and how long it took**, without opening the code? If not, a field is missing (`requestId`, `userId`, `durationMs`) or the message says too little. Logs answer “what happened in this case”; for trends and alerts, use metrics (see L118).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Logs are sensitive data too",
        texto:
          "Everything that goes into a log is stored, copied and read by many people, often for longer than you would expect. Never log passwords, tokens, `Authorization` headers, card numbers or personal data without need. Prefer redaction by path (`redact`) and an allowed list of fields over trusting whoever writes the code to remember.",
      },
    ],
    armadilhas: [
      'Building the message by concatenation (`"order " + id`) instead of using fields: every query becomes a regex and the aggregator’s filters stop working.',
      "Logging the whole request body, or the headers, “to make debugging easier”: passwords and tokens end up in the aggregator.",
      "Using `console.log` with no level and no `requestId`: you cannot filter what matters or join the lines of one request.",
      "Leaving `debug` on in production or logging one line per loop iteration: CPU and storage cost, and what matters gets lost in the noise.",
    ],
    autoteste: [
      {
        pergunta: "Why JSON instead of free text?",
        resposta:
          "Because fields have stable names that the aggregator indexes and filters (`requestId`, `status`, `durationMs`), with no fragile regex. It also lets you build queries, charts and alerts from the logs.",
      },
      {
        pergunta: "How do you find every line of a request that went through three services?",
        resposta:
          "With a correlation id generated at the edge, forwarded in a header on each call and injected into every log line (via `AsyncLocalStorage`). You filter by that id in the aggregator.",
      },
    ],
  },
};
