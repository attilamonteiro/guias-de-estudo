import type { Pergunta } from "../../tipos";

// L54 · Erros e respostas de API
export const l054: Pergunta = {
  numero: 154,
  modulo: "linkedin-express",
  metodo: "playbook",
  pt: {
    titulo: "Erros e respostas de API",
    pergunta: "Como você trata erros de API?",
    porqueEsteMetodo:
      "Tratar erro bem é uma sequência de decisões: contrato, mapeamento, correlação, sigilo. O playbook as ordena e vale também para a pergunta vizinha, o desenho de respostas consistentes, porque o sucesso segue a mesma disciplina do erro.",
    resposta30s:
      "Trate erros em **um só lugar** (um handler central), converta erros de domínio em respostas com o **status HTTP correto** e um corpo de **forma fixa**, de preferência `application/problem+json`, com um `code` estável, uma mensagem para pessoas e um **id de correlação**. Detalhes internos (stack, SQL) vão para o log, nunca para o cliente. A mesma disciplina vale para o sucesso: nomes, datas, paginação e envelope iguais em todos os endpoints.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de erros e respostas",
        passos: [
          {
            titulo: "Fixe o contrato",
            texto:
              "Escolha **uma** forma para sucesso e **uma** para erro e use-as em todos os endpoints: um só estilo de nomes (por exemplo `camelCase`), datas em ISO 8601 em UTC, ids sempre do mesmo tipo, regra explícita para `null` e campo ausente. Para erros, `application/problem+json` (RFC 9457, que substituiu a RFC 7807) já define `type`, `title`, `status`, `detail` e `instance`; acrescente extensões como `code`, `errors` e `traceId`.",
          },
          {
            titulo: "Crie erros de domínio",
            texto:
              "Defina erros que a camada de negócio lança (`NaoEncontrado`, `Conflito`, `RegraDeNegocio`) e um mapa único que os converte em status e `code`. Erro que ninguém previu vira um `500` genérico.",
          },
          {
            titulo: "Trate em um só lugar",
            texto:
              "Um middleware ou handler central (veja L41) recebe todo erro, escolhe o status, monta o corpo e registra o log. Evite `try/catch` com `res.status(...)` espalhado pelas rotas.",
          },
          {
            titulo: "Separe máquina de pessoa",
            texto:
              "O `code` estável (por exemplo `EMAIL_JA_CADASTRADO`) é o que o cliente usa nos seus `if`; a `detail` é texto para pessoas e pode mudar ou ser traduzida. Erro de validação lista os problemas campo a campo.",
          },
          {
            titulo: "Correlacione",
            texto:
              "Gere ou aceite um id de requisição (`X-Request-Id` ou `traceparent`), grave-o em todos os logs daquela requisição e devolva-o na resposta (`traceId`). É assim que o suporte e quem desenvolve encontram o mesmo erro.",
          },
          {
            titulo: "Não vaze",
            texto:
              "Stack, texto de erro do banco, SQL, caminhos de arquivo e versões ficam no log, nunca na resposta. Em autenticação, use mensagens que não revelem se a conta existe.",
          },
          {
            titulo: "Mantenha listas e vazios consistentes",
            texto:
              "Paginação sempre com a mesma forma (por exemplo `items` e um cursor `next`), coleção vazia como `200` com lista vazia (não `404`) e o mesmo envelope em todos os endpoints. Cubra o contrato com testes e com o OpenAPI.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Resposta de erro de validação",
        legenda: "application/problem+json",
        codigo:
          'HTTP/1.1 422\nContent-Type: application/problem+json\n\n{\n  "type": "https://api.exemplo.com/erros/validacao",\n  "title": "Dados inválidos",\n  "status": 422,\n  "detail": "Um ou mais campos não passaram na validação.",\n  "code": "VALIDACAO",\n  "traceId": "req_7f3a9c",\n  "errors": [{ "campo": "email", "mensagem": "formato inválido" }]\n}',
        nota: "`code`, `traceId` e `errors` são extensões permitidas pelo formato; o cliente decide pelo `status` e pelo `code`, e mostra a `detail` à pessoa.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Uma forma, um lugar",
        texto:
          "Duas regras sustentam o resto: **uma forma só** (todo erro e todo sucesso previsíveis para quem consome) e **um lugar só** (o handler central). Status certo (veja L55), `code` estável e `traceId` são detalhes dessas duas regras.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O status é parte do contrato",
        texto:
          'Esconder o erro num `200` com `{ "erro": true }` quebra clientes, caches, balanceadores e alertas, que só enxergam sucesso. E devolver `err.message` do banco ou a stack ajuda quem ataca: o detalhe fica no log, associado ao `traceId`. Alerte nos `5xx`; os `4xx` são esperados e viram métrica.',
      },
    ],
    armadilhas: [
      "Responder `200` com o erro no corpo: clientes, caches e monitoramento só enxergam sucesso.",
      "Devolver `err.message`, SQL ou a stack ao cliente: expõe a estrutura interna do sistema.",
      "Ter um formato de erro diferente por endpoint (ou por biblioteca): o cliente vira um monte de `if`.",
      "Usar a mensagem de texto como contrato: reescrevê-la ou traduzi-la quebra quem a comparava; para isso existe o `code`.",
    ],
    autoteste: [
      {
        pergunta: "Para que serve o `traceId` numa resposta de erro?",
        resposta:
          "Liga o erro que o cliente viu aos logs do servidor daquela requisição, sem expor detalhes internos. O suporte pede o id e encontra a causa.",
      },
      {
        pergunta: "O que é `application/problem+json`?",
        resposta:
          "Um formato padronizado (RFC 9457, que substituiu a RFC 7807) para corpos de erro de APIs HTTP, com `type`, `title`, `status`, `detail` e `instance`, que aceita campos extras como `code` e `traceId`.",
      },
    ],
  },
  en: {
    titulo: "API errors and responses",
    pergunta: "How do you handle API errors?",
    porqueEsteMetodo:
      "Handling errors well is a sequence of decisions: contract, mapping, correlation, confidentiality. The playbook orders them, and it also covers the neighboring question, designing consistent responses, because success follows the same discipline as errors.",
    resposta30s:
      "Handle errors in **one place** (a central handler), turn domain errors into responses with the **right HTTP status** and a **fixed body shape**, preferably `application/problem+json`, with a stable `code`, a human-readable message and a **correlation id**. Internal details (stack, SQL) go to the log, never to the client. The same discipline applies to success: identical names, dates, pagination and envelope on every endpoint.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Errors and responses playbook",
        passos: [
          {
            titulo: "Fix the contract",
            texto:
              "Pick **one** shape for success and **one** for errors and use them on every endpoint: a single naming style (for example `camelCase`), ISO 8601 dates in UTC, ids always of the same type, an explicit rule for `null` versus a missing field. For errors, `application/problem+json` (RFC 9457, which replaced RFC 7807) already defines `type`, `title`, `status`, `detail` and `instance`; add extensions such as `code`, `errors` and `traceId`.",
          },
          {
            titulo: "Create domain errors",
            texto:
              "Define errors that the business layer throws (`NotFound`, `Conflict`, `BusinessRule`) and a single map that turns them into a status and a `code`. An error nobody anticipated becomes a generic `500`.",
          },
          {
            titulo: "Handle it in one place",
            texto:
              "A central middleware or handler (see L41) receives every error, picks the status, builds the body and writes the log. Avoid `try/catch` with `res.status(...)` scattered across routes.",
          },
          {
            titulo: "Separate machine from human",
            texto:
              "The stable `code` (for example `EMAIL_ALREADY_REGISTERED`) is what the client uses in its `if`s; the `detail` is text for people and may change or be translated. A validation error lists the problems field by field.",
          },
          {
            titulo: "Correlate",
            texto:
              "Generate or accept a request id (`X-Request-Id` or `traceparent`), write it to every log line of that request and return it in the response (`traceId`). That is how support and developers find the same error.",
          },
          {
            titulo: "Do not leak",
            texto:
              "Stacks, database error text, SQL, file paths and versions stay in the log, never in the response. For authentication, use messages that do not reveal whether the account exists.",
          },
          {
            titulo: "Keep lists and empties consistent",
            texto:
              "Pagination always with the same shape (for example `items` and a `next` cursor), an empty collection as `200` with an empty list (not `404`) and the same envelope on every endpoint. Cover the contract with tests and with OpenAPI.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A validation error response",
        legenda: "application/problem+json",
        codigo:
          'HTTP/1.1 422\nContent-Type: application/problem+json\n\n{\n  "type": "https://api.example.com/errors/validation",\n  "title": "Invalid data",\n  "status": 422,\n  "detail": "One or more fields failed validation.",\n  "code": "VALIDATION",\n  "traceId": "req_7f3a9c",\n  "errors": [{ "field": "email", "message": "invalid format" }]\n}',
        nota: "`code`, `traceId` and `errors` are extensions the format allows; the client decides by the `status` and the `code`, and shows the `detail` to the person.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "One shape, one place",
        texto:
          "Two rules hold up the rest: **one shape only** (every error and every success predictable for consumers) and **one place only** (the central handler). The right status (see L55), a stable `code` and the `traceId` are details of those two rules.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The status is part of the contract",
        texto:
          'Hiding the error inside a `200` with `{ "error": true }` breaks clients, caches, load balancers and alerts, which only see success. And returning the database `err.message` or the stack helps attackers: the detail stays in the log, tied to the `traceId`. Alert on `5xx`; `4xx` are expected and become metrics.',
      },
    ],
    armadilhas: [
      "Answering `200` with the error in the body: clients, caches and monitoring only see success.",
      "Returning `err.message`, SQL or the stack to the client: it exposes the system’s internal structure.",
      "Having a different error format per endpoint (or per library): the client turns into a pile of `if`s.",
      "Using the text message as the contract: rewording or translating it breaks whoever compared against it; that is what the `code` is for.",
    ],
    autoteste: [
      {
        pergunta: "What is the `traceId` for in an error response?",
        resposta:
          "It ties the error the client saw to the server logs of that request, without exposing internal details. Support asks for the id and finds the cause.",
      },
      {
        pergunta: "What is `application/problem+json`?",
        resposta:
          "A standardized format (RFC 9457, which replaced RFC 7807) for error bodies in HTTP APIs, with `type`, `title`, `status`, `detail` and `instance`, and room for extra fields such as `code` and `traceId`.",
      },
    ],
  },
};
