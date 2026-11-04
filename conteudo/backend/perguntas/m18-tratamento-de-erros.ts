import type { Pergunta } from "../../tipos";

// M18 · Tratamento de erros
export const m18: Pergunta = {
  numero: 218,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Tratamento de erros",
    pergunta: "Qual é a sua abordagem para o tratamento de erros no backend?",
    porqueEsteMetodo:
      "“Qual é a sua abordagem” pede uma sequência de decisões, não uma lista de boas práticas soltas. Um playbook acompanha o erro da entrada até o log e dá a ordem para contar a resposta, com um critério em cada passo.",
    resposta30s:
      "Separe os erros **operacionais esperados** (entrada inválida, timeout, dependência fora do ar) dos **bugs**. **Valide na borda**, deixe o domínio sinalizar erros nomeados e traduza-os num **handler central** para o status HTTP certo e um corpo de erro consistente (**RFC 9457**), sem vazar detalhes internos. Registre o erro uma vez, com **id de correlação**, e proteja as dependências com timeouts, retentativas limitadas e rollback de transação. Nunca engula uma exceção.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Classifique o erro",
            texto:
              "**Operacional**: acontece num sistema correto (entrada inválida, recurso inexistente, timeout, banco indisponível); trata-se e responde. **Bug**: o programa errou (valor nulo onde não podia, regra violada por falha de lógica); falha de forma segura, registra com contexto, alerta e se corrige no código. Não tente “seguir em frente” com estado possivelmente corrompido.",
          },
          {
            titulo: "Valide na borda",
            texto:
              "Formato, tipos, limites e autorização no momento em que a entrada chega (controller, esquema, DTO), antes de tocar em regra de negócio ou banco. Falhe cedo, com uma mensagem por campo. Dentro do sistema, confie nos tipos já validados.",
          },
          {
            titulo: "Erros de domínio viram status HTTP",
            texto:
              "O domínio lança erros com nome (`EstoqueInsuficiente`, `PedidoNaoEncontrado`), sem conhecer HTTP. Uma única camada converte cada um num status: `4xx` quando o cliente pode corrigir, `5xx` quando a falha é do servidor ou de uma dependência.",
          },
          {
            titulo: "Corpo consistente, sem vazar internos",
            texto:
              "Um formato só para toda a API: a **RFC 9457** (problem details, `application/problem+json`, que substitui a RFC 7807), com `type`, `title`, `status`, `detail` e `instance`, mais extensões como a lista de erros por campo e o id de correlação. Nada de stack trace, SQL, caminho de arquivo, nome de tabela ou mensagem crua do driver na resposta; em `5xx`, uma mensagem genérica e o id. Cuidado também com mensagens que revelam demais, como “usuário não existe” em um login.",
          },
          {
            titulo: "Um handler central e um try/catch com propósito",
            texto:
              "Um middleware ou filtro no fim da cadeia captura o que sobe, converte domínio em HTTP, registra e responde, para os controllers não repetirem o mesmo `try/catch`. Capture localmente só quando houver o que fazer: traduzir o erro, acrescentar contexto, liberar um recurso (`finally`), compensar ou retentar. Do contrário, deixe subir.",
          },
          {
            titulo: "Registre uma vez, com id de correlação, e alerte",
            texto:
              "No handler, um registro com id da requisição, rota, usuário ou tenant (sem dados sensíveis) e o erro original com a causa encadeada e o stack. O cliente recebe só o id. Erros `4xx` esperados vão a nível baixo; `5xx` a nível de erro. Alerte pela **taxa** de `5xx` e pelos sintomas, não por cada `4xx`.",
          },
          {
            titulo: "Proteja as dependências",
            texto:
              "Timeout em toda chamada externa; retentativa só para falhas transitórias e operações idempotentes, com limite, backoff exponencial e jitter; circuit breaker para não martelar quem está fora do ar; rollback de transação em qualquer falha, para a operação valer inteira ou nada; fila de mensagens mortas no trabalho assíncrono.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Da situação ao status",
        colunas: ["Situação", "Status", "O que o cliente pode fazer"],
        linhas: [
          [
            "JSON malformado ou campo obrigatório ausente",
            "`400` ou `422` (escolha um critério e mantenha)",
            "Corrigir o pedido",
          ],
          ["Sem credencial válida", "`401`", "Autenticar-se"],
          ["Autenticado, mas sem permissão", "`403`", "Não adianta repetir"],
          ["Recurso não existe", "`404`", "Conferir o identificador"],
          ["Conflito de estado (duplicado, versão antiga)", "`409`", "Recarregar e decidir de novo"],
          ["Regra de negócio violada (saldo insuficiente)", "`422` (ou `409`)", "Mudar os dados enviados"],
          ["Limite de taxa excedido", "`429`", "Esperar (cabeçalho `Retry-After`)"],
          ["Bug ou falha interna", "`500`", "Tentar depois e informar o id de correlação"],
          [
            "Dependência indisponível ou lenta demais",
            "`503` ou `504`, conforme o contrato",
            "Tentar de novo, com espera",
          ],
        ],
        nota: "A divisão central é entre `4xx` (o cliente pode corrigir) e `5xx` (o problema é do lado do servidor). Documente a escolha entre `400` e `422` e use-a em todos os endpoints.",
      },
      {
        tipo: "codigo",
        titulo: "Um erro de domínio no formato problem details",
        legenda: "application/problem+json",
        codigo:
          '{\n  "type": "https://api.exemplo.com/erros/estoque-insuficiente",\n  "title": "Estoque insuficiente",\n  "status": 422,\n  "detail": "O item 42 tem 3 unidades; foram pedidas 5.",\n  "instance": "/pedidos/9f2c",\n  "correlationId": "b7e1c0d4"\n}',
        nota: "`correlationId` é uma extensão; o formato permite campos extras. O mesmo id está no log do servidor, o que liga a queixa do usuário ao registro completo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nunca engula uma exceção",
        texto:
          "Um `catch` vazio, ou que só imprime e segue, esconde o problema: o estado fica pela metade, o usuário recebe sucesso falso e ninguém é avisado. Se não sabe o que fazer com o erro, deixe-o subir até o handler central. E registre em um lugar só: logar e relançar em cada camada transforma uma falha em dez linhas e dispara o alerta em dobro.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como responder na entrevista",
        texto:
          "O entrevistador quer ver maturidade: você distingue erro esperado de bug, protege a segurança, mantém um contrato previsível e consegue investigar em produção. Conte na ordem do playbook, com um exemplo concreto (um pedido com estoque insuficiente, do `422` ao log). Se faltar experiência em produção, diga isso e mostre o raciocínio e o que você implementaria; evite descrever como vivido o que só estudou.",
      },
    ],
    armadilhas: [
      "Engolir a exceção (`catch` vazio ou só imprimir): o erro some, o estado fica pela metade e ninguém é avisado.",
      "Vazar detalhes internos na resposta: stack trace, SQL, caminhos e mensagens do driver ajudam um atacante.",
      "Retentar tudo, sem limite nem backoff: uma dependência lenta vira uma tempestade de tentativas, e repetir operação não idempotente duplica efeitos.",
      "Logar e relançar em cada camada: o mesmo erro vira várias linhas, o ruído esconde a causa e os alertas disparam em dobro.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre erro operacional e bug, e como o tratamento muda?",
        resposta:
          "Operacional é esperado num sistema correto (entrada inválida, timeout, dependência fora): trata-se e responde. Bug é falha do programa: falha de forma segura, registra com contexto, alerta e é corrigido no código.",
      },
      {
        pergunta: "Por que devolver um id de correlação, e não a exceção, num erro `500`?",
        resposta:
          "O detalhe interno pertence ao servidor e ajuda atacantes. O id permite ao usuário informar o suporte e ao time achar o log completo.",
      },
      {
        pergunta: "Quando é seguro retentar uma chamada que falhou?",
        resposta:
          "Quando a falha é transitória e a operação é idempotente (ou protegida por chave de idempotência), com timeout, limite de tentativas e backoff exponencial com jitter.",
      },
    ],
  },
  en: {
    titulo: "Error handling",
    pergunta: "What is your approach to error handling in the backend?",
    porqueEsteMetodo:
      "“What is your approach” asks for a sequence of decisions, not a loose list of good practices. A playbook follows the error from the input to the log and gives you the order for telling the answer, with a criterion at each step.",
    resposta30s:
      "Separate **expected operational errors** (invalid input, timeouts, a dependency being down) from **bugs**. **Validate at the edge**, let the domain signal named errors and translate them in a **central handler** into the right HTTP status and a consistent error body (**RFC 9457**), without leaking internal details. Log the error once, with a **correlation id**, and protect dependencies with timeouts, bounded retries and transaction rollback. Never swallow an exception.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Classify the error",
            texto:
              "**Operational**: happens in a correct system (invalid input, missing resource, timeout, database unavailable); you handle it and respond. **Bug**: the program got it wrong (a null where it could not be, a rule broken by faulty logic); fail safely, log with context, alert and fix it in code. Do not try to “carry on” with possibly corrupted state.",
          },
          {
            titulo: "Validate at the edge",
            texto:
              "Format, types, limits and authorization the moment the input arrives (controller, schema, DTO), before touching business rules or the database. Fail early, with one message per field. Inside the system, trust the already-validated types.",
          },
          {
            titulo: "Domain errors become HTTP statuses",
            texto:
              "The domain throws named errors (`InsufficientStock`, `OrderNotFound`) without knowing HTTP. A single layer converts each one into a status: `4xx` when the client can fix it, `5xx` when the failure is the server’s or a dependency’s.",
          },
          {
            titulo: "A consistent body, no leaked internals",
            texto:
              "One format for the whole API: **RFC 9457** (problem details, `application/problem+json`, which replaces RFC 7807), with `type`, `title`, `status`, `detail` and `instance`, plus extensions such as the list of per-field errors and the correlation id. No stack trace, SQL, file path, table name or raw driver message in the response; for `5xx`, a generic message and the id. Watch out for messages that reveal too much too, like “user does not exist” on a login.",
          },
          {
            titulo: "One central handler and a purposeful try/catch",
            texto:
              "A middleware or filter at the end of the chain catches whatever bubbles up, converts domain to HTTP, logs and responds, so controllers do not repeat the same `try/catch`. Catch locally only when there is something to do: translate the error, add context, release a resource (`finally`), compensate or retry. Otherwise, let it bubble up.",
          },
          {
            titulo: "Log once, with a correlation id, and alert",
            texto:
              "In the handler, one entry with the request id, route, user or tenant (no sensitive data) and the original error with its chained cause and stack. The client gets only the id. Expected `4xx` errors go at a low level; `5xx` at error level. Alert on the **rate** of `5xx` and on symptoms, not on every `4xx`.",
          },
          {
            titulo: "Protect the dependencies",
            texto:
              "A timeout on every external call; retries only for transient failures and idempotent operations, with a cap, exponential backoff and jitter; a circuit breaker so you do not hammer something that is down; transaction rollback on any failure, so the operation counts in full or not at all; a dead-letter queue for asynchronous work.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "From situation to status",
        colunas: ["Situation", "Status", "What the client can do"],
        linhas: [
          [
            "Malformed JSON or a missing required field",
            "`400` or `422` (pick one criterion and stay with it)",
            "Fix the request",
          ],
          ["No valid credential", "`401`", "Authenticate"],
          ["Authenticated but not allowed", "`403`", "Repeating will not help"],
          ["Resource does not exist", "`404`", "Check the identifier"],
          ["State conflict (duplicate, stale version)", "`409`", "Reload and decide again"],
          ["Business rule violated (insufficient balance)", "`422` (or `409`)", "Change the data sent"],
          ["Rate limit exceeded", "`429`", "Wait (`Retry-After` header)"],
          ["Bug or internal failure", "`500`", "Try later and report the correlation id"],
          ["Dependency unavailable or too slow", "`503` or `504`, per your contract", "Retry, with a wait"],
        ],
        nota: "The central split is `4xx` (the client can fix it) versus `5xx` (the problem is on the server side). Document your choice between `400` and `422` and use it on every endpoint.",
      },
      {
        tipo: "codigo",
        titulo: "A domain error in problem details format",
        legenda: "application/problem+json",
        codigo:
          '{\n  "type": "https://api.example.com/errors/insufficient-stock",\n  "title": "Insufficient stock",\n  "status": 422,\n  "detail": "Item 42 has 3 units; 5 were requested.",\n  "instance": "/orders/9f2c",\n  "correlationId": "b7e1c0d4"\n}',
        nota: "`correlationId` is an extension; the format allows extra fields. The same id is in the server log, which links the user’s complaint to the full record.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Never swallow an exception",
        texto:
          "An empty `catch`, or one that only prints and moves on, hides the problem: state is left half-done, the user gets a false success and nobody is told. If you do not know what to do with the error, let it bubble up to the central handler. And log in one place only: logging and rethrowing at every layer turns one failure into ten lines and fires the alert twice.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to answer in the interview",
        texto:
          "The interviewer wants to see maturity: you tell an expected error from a bug, protect security, keep a predictable contract and can investigate in production. Tell it in the playbook order, with one concrete example (an order with insufficient stock, from the `422` to the log). If you lack production experience, say so and show the reasoning and what you would implement; avoid describing as lived what you only studied.",
      },
    ],
    armadilhas: [
      "Swallowing the exception (an empty `catch` or just printing): the error vanishes, state is left half-done and nobody is told.",
      "Leaking internals in the response: stack traces, SQL, paths and driver messages help an attacker.",
      "Retrying everything, with no cap or backoff: a slow dependency turns into a storm of attempts, and repeating a non-idempotent operation duplicates effects.",
      "Logging and rethrowing at every layer: the same error becomes several lines, noise hides the cause and alerts fire twice.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an operational error and a bug, and how does handling change?",
        resposta:
          "An operational error is expected in a correct system (invalid input, timeout, dependency down): you handle it and respond. A bug is a program fault: fail safely, log with context, alert and fix it in code.",
      },
      {
        pergunta: "Why return a correlation id, and not the exception, on a `500` error?",
        resposta:
          "Internal detail belongs to the server and helps attackers. The id lets the user tell support and lets the team find the full log.",
      },
      {
        pergunta: "When is it safe to retry a failed call?",
        resposta:
          "When the failure is transient and the operation is idempotent (or protected by an idempotency key), with a timeout, a cap on attempts and exponential backoff with jitter.",
      },
    ],
  },
};
