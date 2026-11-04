import type { Pergunta } from "../../tipos";

// L82 · fetch nativo
export const l082: Pergunta = {
  numero: 182,
  modulo: "linkedin-moderno",
  metodo: "feynman",
  pt: {
    titulo: "fetch nativo",
    pergunta: "O que é a API fetch() nativa do Node.js?",
    porqueEsteMetodo:
      "O `fetch` parece trivial, mas tem uma pegadinha que derruba muita gente: ele não rejeita em 404 ou 500. Uma analogia de entrega fixa a ideia de que “chegou uma resposta” e “a resposta é boa” são coisas diferentes.",
    resposta30s:
      "É a **API padrão da Web para requisições HTTP**, disponível globalmente nas versões atuais do Node.js, sem instalar nada: `fetch(url, opções)` devolve uma **promise** de `Response`. Ela só **rejeita em falha de rede, cancelamento ou prazo**: um `404` ou `500` resolve normalmente, então confira `response.ok` e só então leia o corpo com `json()`, `text()` ou o stream em `body`. Para um prazo máximo, use `AbortSignal.timeout`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pedir comida por entrega. O entregador chegar com a sacola fechada é o momento em que a promise do `fetch` se resolve: você já sabe o status (entregue, endereço errado, restaurante fechado), mas ainda não abriu a sacola. Abrir e conferir o conteúdo (`response.json()`) é outro passo, que também leva tempo. “Prato esgotado” ou “restaurante com problema” (404, 500) continuam sendo uma entrega que chegou: o app só reclama (rejeita) se o entregador nem aparecer, isto é, se a rede cair.",
        tecnico:
          "`fetch` devolve uma promise que se resolve quando os **cabeçalhos** chegam, com um objeto `Response` (`status`, `ok`, `headers` e o corpo). O corpo é lido por um método assíncrono (`json()`, `text()`, `arrayBuffer()`, `blob()`) ou como stream web em `response.body`, e só pode ser consumido **uma vez**. Falha de rede, DNS, conexão recusada e cancelamento rejeitam a promise. No Node.js a implementação vem embutida (baseada na biblioteca undici) e segue a mesma interface do navegador, o que ajuda a reaproveitar código entre servidor e cliente.",
        limite:
          "A entrega tem um status só; o HTTP tem redirecionamentos, prazos e corpo que chega em pedaços. O `fetch` segue redirecionamentos sozinho, e a conexão pode cair no meio da leitura do corpo, rejeitando o `json()` mesmo depois de a promise inicial ter se resolvido. Também não há CORS no servidor (isso é regra de navegador) nem cookies guardados automaticamente.",
      },
      {
        tipo: "fluxo",
        titulo: "A vida de uma chamada",
        etapas: [
          "`fetch(url, { signal })` inicia a requisição e devolve uma promise",
          "Chegam o status e os cabeçalhos: a promise se resolve com a `Response`, mesmo que o status seja `404` ou `500`",
          "Você confere `response.ok` (status de 200 a 299) e decide o que fazer com erros HTTP",
          "Você lê o corpo uma única vez: `await response.json()`, `text()` ou percorre `response.body` aos pedaços",
          "Falha de rede, DNS, cancelamento ou prazo estourado rejeitam a promise (`TypeError: fetch failed` com a causa, `AbortError` ou `TimeoutError`)",
        ],
        nota: "Redirecionamentos (`3xx`) são seguidos por padrão (`redirect: 'follow'`).",
      },
      {
        tipo: "codigo",
        titulo: "Chamada com prazo e checagem de status",
        legenda: "JavaScript",
        codigo: [
          "async function buscarUsuario(id) {",
          "  const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`, {",
          '    headers: { Accept: "application/json" },',
          "    signal: AbortSignal.timeout(5000), // cancela depois de 5 s",
          "  });",
          "",
          "  if (!resposta.ok) {",
          "    // 404 e 500 NÃO rejeitam: a checagem é sua",
          "    throw new Error(`HTTP ${resposta.status}`);",
          "  }",
          "  return resposta.json();",
          "}",
          "",
          "// envio de JSON",
          'await fetch("https://api.exemplo.com/usuarios", {',
          '  method: "POST",',
          '  headers: { "Content-Type": "application/json" },',
          '  body: JSON.stringify({ nome: "Ana" }),',
          "});",
        ].join("\n"),
        nota: "Num servidor, trate a rejeição com `try/catch`: `AbortSignal.timeout` rejeita com `TimeoutError`, e erros de rede chegam como `TypeError` com a causa em `error.cause`.",
      },
      {
        tipo: "tabela",
        titulo: "fetch, axios e node:http",
        colunas: ["Aspecto", "`fetch` nativo", "`axios` (biblioteca)", "`node:http` / `node:https`"],
        linhas: [
          [
            "Instalação",
            "Nenhuma: faz parte do Node.js nas versões atuais",
            "Pacote do npm",
            "Nenhuma: módulo embutido",
          ],
          [
            "Interface",
            "Promises e padrão da Web, igual ao navegador",
            "Promises, com API própria",
            "Eventos, callbacks e streams, mais baixo nível",
          ],
          [
            "Status 4xx e 5xx",
            "Não rejeita; confira `ok`",
            "Rejeita por padrão",
            "Nunca rejeita; você lê o `statusCode`",
          ],
          [
            "JSON",
            "`await resposta.json()` e `JSON.stringify` no envio",
            "Converte sozinho",
            "Manual: junta os pedaços e faz o `JSON.parse`",
          ],
          [
            "Prazo e cancelamento",
            "`signal` e `AbortSignal.timeout`",
            "Opções `timeout` e `signal`",
            "Opções `timeout` e `signal` na requisição",
          ],
          [
            "Extras",
            "Poucos: sem interceptors nem retentativas prontas",
            "Interceptors e mais conveniências",
            "Controle fino: agente de conexões, keep-alive, proxy manual",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A pegadinha do 404",
        texto:
          "O `fetch` resolve em `404` e `500`. Quem esquece `if (!resposta.ok)` acaba chamando `.json()` numa página de erro e vendo um `SyntaxError` confuso, ou tratando um erro como sucesso. Lembre também que o corpo é consumido uma vez (use `resposta.clone()` se precisar lê-lo duas vezes) e que, sem prazo, uma chamada pode esperar bem mais do que a sua aplicação tolera: defina sempre um `AbortSignal.timeout`. Para cancelamento em geral, veja L33.",
      },
    ],
    armadilhas: [
      "Achar que o `fetch` rejeita em `404` ou `500`: ele só rejeita em falha de rede, cancelamento ou prazo; o status HTTP é por sua conta.",
      "Chamar `response.json()` duas vezes, ou depois de `text()`: o corpo é um stream consumido uma vez (use `clone()` ou guarde o resultado).",
      "Não definir prazo nem tratar o erro: sem `AbortSignal.timeout` e `try/catch`, uma dependência lenta prende requisições e uma rejeição sem tratamento pode derrubar o processo.",
      "Esperar recursos de biblioteca (interceptors, JSON automático, retentativas): o `fetch` é enxuto de propósito; embrulhe-o numa função sua.",
    ],
    autoteste: [
      {
        pergunta: "O `fetch` rejeita a promise quando o servidor responde 500?",
        resposta:
          "Não: a promise resolve com uma `Response` cujo `ok` é falso e cujo `status` é 500. Só falha de rede, DNS, cancelamento e prazo rejeitam.",
      },
      {
        pergunta: "Como colocar um timeout de 3 segundos numa chamada de `fetch`?",
        resposta:
          "Passe `signal: AbortSignal.timeout(3000)` nas opções; ao estourar, a promise rejeita com um erro de nome `TimeoutError`.",
      },
    ],
  },
  en: {
    titulo: "Built-in fetch",
    pergunta: "What is the Node.js built-in fetch() API?",
    porqueEsteMetodo:
      "`fetch` looks trivial, but it has a gotcha that trips up many people: it does not reject on 404 or 500. A delivery analogy fixes the idea that “a response arrived” and “the response is good” are different things.",
    resposta30s:
      "It is the **standard Web API for HTTP requests**, available globally in current Node.js versions with nothing to install: `fetch(url, options)` returns a **promise** of a `Response`. It only **rejects on network failure, cancellation or timeout**: a `404` or `500` resolves normally, so check `response.ok` and only then read the body with `json()`, `text()` or the stream in `body`. For a maximum wait, use `AbortSignal.timeout`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Ordering food for delivery. The courier arriving with a sealed bag is the moment the `fetch` promise resolves: you already know the status (delivered, wrong address, restaurant closed), but you have not opened the bag. Opening it and checking the contents (`response.json()`) is another step, which also takes time. “Out of stock” or “restaurant had a problem” (404, 500) are still a delivery that arrived: the app only complains (rejects) if the courier never shows up, that is, if the network goes down.",
        tecnico:
          "`fetch` returns a promise that resolves when the **headers** arrive, with a `Response` object (`status`, `ok`, `headers` and the body). The body is read with an async method (`json()`, `text()`, `arrayBuffer()`, `blob()`) or as a web stream in `response.body`, and can only be consumed **once**. Network failure, DNS errors, refused connections and cancellation reject the promise. In Node.js the implementation is built in (based on the undici library) and follows the same interface as the browser, which helps reuse code between server and client.",
        limite:
          "A delivery has a single status; HTTP has redirects, timeouts and a body that arrives in pieces. `fetch` follows redirects on its own, and the connection can drop halfway through reading the body, rejecting `json()` even after the initial promise resolved. There is also no CORS on the server (that is a browser rule) and no automatically stored cookies.",
      },
      {
        tipo: "fluxo",
        titulo: "The life of a call",
        etapas: [
          "`fetch(url, { signal })` starts the request and returns a promise",
          "The status and headers arrive: the promise resolves with the `Response`, even if the status is `404` or `500`",
          "You check `response.ok` (status 200 to 299) and decide what to do about HTTP errors",
          "You read the body exactly once: `await response.json()`, `text()` or iterate over `response.body` in chunks",
          "Network failure, DNS errors, cancellation or an expired timeout reject the promise (`TypeError: fetch failed` with the cause, `AbortError` or `TimeoutError`)",
        ],
        nota: "Redirects (`3xx`) are followed by default (`redirect: 'follow'`).",
      },
      {
        tipo: "codigo",
        titulo: "A call with a timeout and a status check",
        legenda: "JavaScript",
        codigo: [
          "async function fetchUser(id) {",
          "  const response = await fetch(`https://api.example.com/users/${id}`, {",
          '    headers: { Accept: "application/json" },',
          "    signal: AbortSignal.timeout(5000), // aborts after 5 s",
          "  });",
          "",
          "  if (!response.ok) {",
          "    // 404 and 500 do NOT reject: the check is yours",
          "    throw new Error(`HTTP ${response.status}`);",
          "  }",
          "  return response.json();",
          "}",
          "",
          "// sending JSON",
          'await fetch("https://api.example.com/users", {',
          '  method: "POST",',
          '  headers: { "Content-Type": "application/json" },',
          '  body: JSON.stringify({ name: "Ana" }),',
          "});",
        ].join("\n"),
        nota: "On a server, handle the rejection with `try/catch`: `AbortSignal.timeout` rejects with a `TimeoutError`, and network errors arrive as a `TypeError` with the cause in `error.cause`.",
      },
      {
        tipo: "tabela",
        titulo: "fetch, axios and node:http",
        colunas: ["Aspect", "Built-in `fetch`", "`axios` (library)", "`node:http` / `node:https`"],
        linhas: [
          ["Installation", "None: part of Node.js in current versions", "An npm package", "None: built-in module"],
          [
            "Interface",
            "Promises and the Web standard, same as the browser",
            "Promises, with its own API",
            "Events, callbacks and streams, lower level",
          ],
          [
            "4xx and 5xx status",
            "Does not reject; check `ok`",
            "Rejects by default",
            "Never rejects; you read `statusCode`",
          ],
          [
            "JSON",
            "`await response.json()` and `JSON.stringify` when sending",
            "Converts automatically",
            "Manual: join the chunks and run `JSON.parse`",
          ],
          [
            "Timeout and cancellation",
            "`signal` and `AbortSignal.timeout`",
            "`timeout` and `signal` options",
            "`timeout` and `signal` options on the request",
          ],
          [
            "Extras",
            "Few: no interceptors or ready-made retries",
            "Interceptors and more conveniences",
            "Fine control: connection agent, keep-alive, manual proxy",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The 404 gotcha",
        texto:
          "`fetch` resolves on `404` and `500`. Whoever forgets `if (!response.ok)` ends up calling `.json()` on an error page and seeing a confusing `SyntaxError`, or treating an error as success. Remember too that the body is consumed once (use `response.clone()` if you must read it twice) and that, without a timeout, a call may wait far longer than your application tolerates: always set an `AbortSignal.timeout`. For cancellation in general, see L33.",
      },
    ],
    armadilhas: [
      "Thinking `fetch` rejects on `404` or `500`: it only rejects on network failure, cancellation or timeout; the HTTP status is up to you.",
      "Calling `response.json()` twice, or after `text()`: the body is a stream consumed once (use `clone()` or keep the result).",
      "Setting no timeout and no error handling: without `AbortSignal.timeout` and `try/catch`, a slow dependency ties up requests and an unhandled rejection can take the process down.",
      "Expecting library features (interceptors, automatic JSON, retries): `fetch` is lean on purpose; wrap it in a function of your own.",
    ],
    autoteste: [
      {
        pergunta: "Does `fetch` reject its promise when the server answers 500?",
        resposta:
          "No: the promise resolves with a `Response` whose `ok` is false and whose `status` is 500. Only network failure, DNS errors, cancellation and timeouts reject.",
      },
      {
        pergunta: "How do you add a 3-second timeout to a `fetch` call?",
        resposta:
          "Pass `signal: AbortSignal.timeout(3000)` in the options; when it expires, the promise rejects with an error named `TimeoutError`.",
      },
    ],
  },
};
