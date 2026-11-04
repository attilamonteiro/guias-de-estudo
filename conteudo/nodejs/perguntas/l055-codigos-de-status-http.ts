import type { Pergunta } from "../../tipos";

// L55 · Códigos de status HTTP
export const l055: Pergunta = {
  numero: 155,
  modulo: "linkedin-express",
  metodo: "compare",
  pt: {
    titulo: "Códigos de status HTTP",
    pergunta: "Quais códigos de status HTTP uma API REST deve retornar?",
    porqueEsteMetodo:
      "Os códigos parecem uma lista para decorar, mas a entrevista testa se você distingue os parecidos (401 e 403, 400 e 422, 404 e 403). A matriz coloca cada código com o seu uso e a regra de decisão ensina a escolher.",
    resposta30s:
      "A **família** diz de quem é o resultado: `2xx` deu certo, `4xx` o cliente deve corrigir a requisição, `5xx` a falha é do servidor. Os do dia a dia são `200`, `201` (criou, com `Location`), `204` (sem corpo), `400`/`422` (entrada inválida), `401` (não autenticado), `403` (sem permissão), `404`, `409` (conflito), `429` (limite de taxa) e `500`/`503`. O erro clássico é responder `200` com o erro no corpo.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os códigos do dia a dia",
        colunas: ["Código", "Significado", "Quando usar"],
        linhas: [
          [
            "`200` OK",
            "Sucesso, com corpo",
            "`GET` de recurso ou de lista (lista vazia também), `PUT`/`PATCH` que devolve o recurso atualizado",
          ],
          ["`201` Created", "Recurso criado", "`POST` que cria; devolva `Location` e, em geral, o recurso"],
          [
            "`202` Accepted",
            "Aceito, será processado depois",
            "Trabalho assíncrono: devolva um id e um endereço para consultar o status",
          ],
          ["`204` No Content", "Sucesso, sem corpo", "`DELETE`, ou `PUT`/`PATCH` que não devolve nada"],
          [
            "`304` Not Modified",
            "Use a cópia em cache",
            "Requisição condicional (`ETag` com `If-None-Match`) sem mudança",
          ],
          ["`400` Bad Request", "Requisição malformada", "JSON quebrado, parâmetro com tipo errado, corpo ausente"],
          [
            "`401` Unauthorized",
            "Não autenticado",
            "Sem credencial, token inválido ou expirado; envie `WWW-Authenticate` quando couber",
          ],
          ["`403` Forbidden", "Autenticado, sem permissão", "A pessoa é conhecida, mas não pode fazer isso"],
          ["`404` Not Found", "Recurso inexistente", "Id que não existe (ou que você prefere não revelar que existe)"],
          [
            "`409` Conflict",
            "Conflito com o estado atual",
            "E-mail já cadastrado, edição sobre versão desatualizada, transição de estado inválida",
          ],
          [
            "`422` Unprocessable Content",
            "Sintaxe correta, regras violadas",
            "Validação de campo ou regra de negócio; muitas equipes usam `400` para isso, o importante é padronizar",
          ],
          ["`429` Too Many Requests", "Limite de taxa excedido", "Rate limiting; envie `Retry-After` (veja L49)"],
          [
            "`500` Internal Server Error",
            "Falha inesperada do servidor",
            "Exceção não prevista; corpo genérico, detalhes só no log (veja L54)",
          ],
          [
            "`502` / `503` / `504`",
            "Dependência com defeito, indisponível ou lenta",
            "Gateway com upstream quebrado, manutenção ou sobrecarga (`503` com `Retry-After`), tempo esgotado",
          ],
        ],
        nota: "Os nomes oficiais dos códigos estão no RFC 9110; confira a especificação para os casos menos comuns.",
      },
      {
        tipo: "tabela",
        titulo: "Por operação",
        colunas: ["Operação", "Sucesso", "Erros típicos"],
        linhas: [
          ["`GET /itens`", "`200` (lista vazia continua `200`)", "`400` (filtro inválido), `401`, `403`"],
          ["`GET /itens/{id}`", "`200`", "`404`, `401`, `403`"],
          ["`POST /itens`", "`201` + `Location`", "`400` ou `422`, `409` (duplicado), `401`, `403`"],
          ["`PUT` / `PATCH /itens/{id}`", "`200` com o recurso, ou `204`", "`404`, `409` (versão), `422`, `403`"],
          [
            "`DELETE /itens/{id}`",
            "`204`",
            "`404` se não existe (repetir o `DELETE` pode dar `204` ou `404`: escolha e documente), `403`, `409`",
          ],
          ["Ação demorada (`POST /relatorios`)", "`202` + endereço de status", "`429`, `503`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte **de quem é o problema e se repetir adianta**. `2xx`: deu certo. `4xx`: a requisição precisa mudar, repetir igual não resolve (`400`/`422` dado, `401` identidade, `403` permissão, `404` recurso, `409` estado). `5xx`: o servidor falhou, e o cliente pode tentar de novo depois, com backoff (veja L105). Entre dois códigos plausíveis, escolha o mais específico, documente o padrão e use-o em todos os endpoints.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nomes enganosos e áreas cinzentas",
        texto:
          "`401 Unauthorized` significa **não autenticado**; o “não autorizado” de verdade é o `403`. O `404` pode esconder a existência de um recurso que a pessoa não pode ver (útil em dados de outros usuários), enquanto o `403` confirma que ele existe: escolha uma política e aplique sempre. As fronteiras entre `400`, `422` e `409` são discutíveis; o valor está em padronizar, não em achar a palavra perfeita.",
      },
    ],
    armadilhas: [
      'Responder `200` com `{ "erro": ... }` no corpo: clientes, caches, balanceadores e alertas só enxergam sucesso.',
      "Deixar JSON inválido ou campo errado cair em `500`: o erro é do cliente, e o `500` dispara alertas à toa.",
      "Devolver `404` para lista vazia: uma coleção sem itens é `200` com lista vazia; `404` é para recurso inexistente.",
      "Tentar de novo automaticamente qualquer erro: só o que é transitório (`429`, `503`, tempo esgotado) merece nova tentativa, nunca um `400`.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `401` e `403`?",
        resposta:
          "`401`: a identidade não foi comprovada (sem credencial, ou credencial inválida ou expirada). `403`: a identidade é conhecida, mas a pessoa não tem permissão para a ação.",
      },
      {
        pergunta: "Que status devolver ao criar um recurso, e com qual cabeçalho?",
        resposta:
          "`201 Created`, com o cabeçalho `Location` apontando para o novo recurso e, em geral, o recurso no corpo.",
      },
    ],
  },
  en: {
    titulo: "HTTP status codes",
    pergunta: "What HTTP status codes should a REST API return?",
    porqueEsteMetodo:
      "The codes look like a list to memorize, but the interview tests whether you can tell similar ones apart (401 and 403, 400 and 422, 404 and 403). The matrix pairs each code with its use and the decision rule teaches how to choose.",
    resposta30s:
      "The **family** says whose outcome it is: `2xx` succeeded, `4xx` the client must fix the request, `5xx` the server failed. The everyday ones are `200`, `201` (created, with `Location`), `204` (no body), `400`/`422` (invalid input), `401` (not authenticated), `403` (no permission), `404`, `409` (conflict), `429` (rate limit) and `500`/`503`. The classic mistake is answering `200` with the error in the body.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The everyday codes",
        colunas: ["Code", "Meaning", "When to use"],
        linhas: [
          [
            "`200` OK",
            "Success, with a body",
            "`GET` of a resource or a list (an empty list too), `PUT`/`PATCH` that returns the updated resource",
          ],
          ["`201` Created", "Resource created", "`POST` that creates; return `Location` and, usually, the resource"],
          [
            "`202` Accepted",
            "Accepted, will be processed later",
            "Asynchronous work: return an id and an address to check the status",
          ],
          ["`204` No Content", "Success, no body", "`DELETE`, or a `PUT`/`PATCH` that returns nothing"],
          [
            "`304` Not Modified",
            "Use the cached copy",
            "Conditional request (`ETag` with `If-None-Match`) with no change",
          ],
          ["`400` Bad Request", "Malformed request", "Broken JSON, a parameter of the wrong type, a missing body"],
          [
            "`401` Unauthorized",
            "Not authenticated",
            "No credential, or an invalid or expired token; send `WWW-Authenticate` where it applies",
          ],
          ["`403` Forbidden", "Authenticated, no permission", "The person is known, but may not do this"],
          [
            "`404` Not Found",
            "Resource does not exist",
            "An id that does not exist (or that you prefer not to reveal exists)",
          ],
          [
            "`409` Conflict",
            "Conflict with the current state",
            "Email already registered, edit on an outdated version, invalid state transition",
          ],
          [
            "`422` Unprocessable Content",
            "Correct syntax, rules violated",
            "Field validation or a business rule; many teams use `400` for this, what matters is standardizing",
          ],
          ["`429` Too Many Requests", "Rate limit exceeded", "Rate limiting; send `Retry-After` (see L49)"],
          [
            "`500` Internal Server Error",
            "Unexpected server failure",
            "An unanticipated exception; generic body, details only in the log (see L54)",
          ],
          [
            "`502` / `503` / `504`",
            "A dependency is broken, unavailable or slow",
            "A gateway with a broken upstream, maintenance or overload (`503` with `Retry-After`), timeout",
          ],
        ],
        nota: "The official code names are in RFC 9110; check the specification for the less common cases.",
      },
      {
        tipo: "tabela",
        titulo: "By operation",
        colunas: ["Operation", "Success", "Typical errors"],
        linhas: [
          ["`GET /items`", "`200` (an empty list is still `200`)", "`400` (invalid filter), `401`, `403`"],
          ["`GET /items/{id}`", "`200`", "`404`, `401`, `403`"],
          ["`POST /items`", "`201` + `Location`", "`400` or `422`, `409` (duplicate), `401`, `403`"],
          ["`PUT` / `PATCH /items/{id}`", "`200` with the resource, or `204`", "`404`, `409` (version), `422`, `403`"],
          [
            "`DELETE /items/{id}`",
            "`204`",
            "`404` if it does not exist (repeating the `DELETE` may give `204` or `404`: choose and document), `403`, `409`",
          ],
          ["Slow action (`POST /reports`)", "`202` + status address", "`429`, `503`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask **whose problem it is and whether repeating helps**. `2xx`: it worked. `4xx`: the request must change, repeating it unchanged will not help (`400`/`422` data, `401` identity, `403` permission, `404` resource, `409` state). `5xx`: the server failed, and the client may try again later, with backoff (see L105). Between two plausible codes, pick the more specific one, document the convention and use it on every endpoint.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Misleading names and gray areas",
        texto:
          "`401 Unauthorized` means **not authenticated**; the real “not authorized” is `403`. A `404` can hide the existence of a resource the person may not see (useful for other users’ data), while `403` confirms it exists: pick a policy and apply it always. The borders between `400`, `422` and `409` are debatable; the value is in standardizing, not in finding the perfect word.",
      },
    ],
    armadilhas: [
      'Answering `200` with `{ "error": ... }` in the body: clients, caches, load balancers and alerts only see success.',
      "Letting invalid JSON or a wrong field fall into a `500`: the error is the client’s, and the `500` triggers alerts for nothing.",
      "Returning `404` for an empty list: a collection with no items is `200` with an empty list; `404` is for a resource that does not exist.",
      "Retrying every error automatically: only what is transient (`429`, `503`, timeouts) deserves a retry, never a `400`.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `401` and `403`?",
        resposta:
          "`401`: the identity was not proven (no credential, or an invalid or expired one). `403`: the identity is known, but the person has no permission for the action.",
      },
      {
        pergunta: "Which status should you return when creating a resource, and with which header?",
        resposta:
          "`201 Created`, with a `Location` header pointing to the new resource and, usually, the resource in the body.",
      },
    ],
  },
};
