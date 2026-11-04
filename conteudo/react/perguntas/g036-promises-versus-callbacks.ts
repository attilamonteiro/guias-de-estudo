import type { Pergunta } from "../../tipos";

// G36 · Promises versus callbacks
export const g036: Pergunta = {
  numero: 336,
  modulo: "glassdoor-javascript",
  metodo: "compare",
  pt: {
    titulo: "Promises versus callbacks",
    pergunta: "O que é uma promise em JavaScript e qual é a diferença entre callbacks e promises?",
    porqueEsteMetodo:
      "Callbacks e promises resolvem o mesmo problema (continuar depois que algo assíncrono termina) com garantias muito diferentes. Uma matriz lado a lado, com uma regra de decisão, mostra o que cada um entrega e o que cobra.",
    resposta30s:
      "Uma **promise** é um objeto que representa o resultado futuro de uma operação assíncrona e está em um de três estados, **pending**, **fulfilled** ou **rejected**; depois de resolvida, não muda mais. Com **callbacks** você entrega a continuação a outro código (inversão de controle) e cada nível trata os próprios erros; com promises você recebe um objeto que **encadeia** (`then`), centraliza erros (`catch`), combina tarefas (`Promise.all`) e sempre continua de forma assíncrona. `async`/`await` é **açúcar sintático** sobre promises.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Callbacks, promises e async/await lado a lado",
        colunas: ["Aspecto", "Callback", "Promise", "`async`/`await`"],
        linhas: [
          [
            "O que é",
            "Função passada para ser chamada quando a operação terminar",
            "Objeto que representa um resultado futuro: `pending` e depois `fulfilled` ou `rejected`, sem voltar atrás",
            "Sintaxe sobre promises: `await` suspende a função até a promise se resolver",
          ],
          [
            "Controle",
            "Inversão de controle: você entrega a continuação a outro código, que decide quando e quantas vezes chamá-la",
            "Você recebe o objeto e decide como encadear; cada continuação roda no máximo uma vez",
            "Igual à promise: o fluxo volta para a sua função",
          ],
          [
            "Erros",
            "Convenção `(err, dados)` e um `if` em cada nível; um `throw` assíncrono escapa do `try/catch` externo",
            "Uma rejeição desce pela cadeia até o `.catch()` mais próximo",
            "`try/catch/finally` comum em volta do `await`",
          ],
          [
            "Composição",
            "Aninha (callback hell); o paralelismo exige contadores feitos à mão",
            "`.then()` encadeia; `Promise.all`, `allSettled`, `race` e `any` combinam várias",
            "Lê como código sequencial; para tarefas em paralelo, `await Promise.all([...])`",
          ],
          [
            "Quando a continuação roda",
            "Depende da API: pode ser síncrona ou assíncrona",
            "Sempre assíncrona: entra na fila de microtasks",
            "Igual à promise: o que vem depois do `await` roda como microtask",
          ],
          [
            "Quantos resultados",
            "Serve também para eventos que se repetem (cliques, `setInterval`, streams)",
            "Resolve uma vez só",
            "Resolve uma vez só (`for await` cobre sequências assíncronas)",
          ],
        ],
        nota: "`Promise.all` rejeita na primeira falha; `allSettled` espera todas e nunca rejeita; `race` devolve a primeira a se resolver; `any` devolve a primeira a cumprir.",
      },
      {
        tipo: "codigo",
        titulo: "A mesma sequência, em três estilos",
        legenda: "JavaScript",
        codigo: [
          "// Callbacks: a continuação aninha e cada nível trata o erro",
          "lerUsuario(id, (err, usuario) => {",
          "  if (err) return tratar(err);",
          "  lerPedidos(usuario.id, (err, pedidos) => {",
          "    if (err) return tratar(err);",
          "    mostrar(pedidos);",
          "  });",
          "});",
          "",
          "// Promises: cadeia plana, um único catch",
          "lerUsuario(id)",
          "  .then((usuario) => lerPedidos(usuario.id)) // devolva a promise!",
          "  .then(mostrar)",
          "  .catch(tratar)",
          "  .finally(() => esconderSpinner());",
          "",
          "// async/await: as mesmas promises, lidas de cima para baixo",
          "try {",
          "  const usuario = await lerUsuario(id);",
          "  mostrar(await lerPedidos(usuario.id));",
          "} catch (err) { tratar(err); }",
        ].join("\n"),
        nota: "`lerUsuario` e `lerPedidos` são hipotéticas: na versão com callbacks elas recebem o callback; nas outras duas, devolvem uma promise.",
      },
      {
        tipo: "fluxo",
        titulo: "A vida de uma promise",
        etapas: [
          "Nasce `pending`: `new Promise((resolve, reject) => ...)` executa o executor na hora, mas o resultado ainda não existe",
          "Resolve uma vez só: `resolve(valor)` leva a `fulfilled`; `reject(erro)` (ou um `throw` no executor) leva a `rejected`; depois disso, estado e valor não mudam mais",
          "`.then(aoCumprir)` e `.catch(aoRejeitar)` registram continuações; mesmo numa promise já resolvida, elas rodam só depois do código síncrono atual, como **microtasks**",
          "Cada `.then` devolve uma **nova promise**: o valor retornado cumpre a etapa seguinte, um `throw` a rejeita, e retornar outra promise faz a cadeia esperar por ela",
          "`.finally(fn)` roda nos dois casos, sem receber o resultado, e repassa adiante o valor ou o erro",
        ],
        nota: "`catch(f)` equivale a `then(undefined, f)`. Uma rejeição que nenhuma etapa trata gera o evento `unhandledrejection` no navegador (e `unhandledRejection` no Node.js).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Em código novo, use **promises com `async`/`await`**: `fetch`, `fs/promises` e a maioria das bibliotecas já devolvem promises, e o tratamento de erro fica em um lugar só. Mantenha **callbacks** para o que acontece **mais de uma vez** (cliques, `setInterval`, streams) e para APIs antigas, e embrulhe estas em uma promise (`new Promise`, `util.promisify` no Node.js) quando a operação tiver um único resultado. No React, manipuladores de evento são callbacks e podem ser `async`; já a função passada ao `useEffect` não pode ser `async` (ela devolveria uma promise no lugar da função de limpeza): declare uma função `async` interna e chame-a.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A continuação sempre roda depois",
        texto:
          "A continuação de uma promise **nunca roda na hora**, nem quando ela já está resolvida: `Promise.resolve().then(() => console.log('B')); console.log('A');` imprime A e depois B, porque o `then` entra na fila de microtasks e só roda quando o código síncrono atual termina, antes de timers como `setTimeout(fn, 0)`. Isso dá previsibilidade (o callback nunca roda “cedo demais” e a ordem é sempre a mesma) e vale também para o código que vem depois de um `await`.",
      },
    ],
    armadilhas: [
      "Promise sem tratamento de erro: sem `.catch()` (ou com `await` fora de `try/catch`), a rejeição vira “rejeição não tratada”; o erro some da interface e, no Node.js, pode derrubar o processo.",
      "Esquecer o `return` dentro do `then`: a etapa seguinte recebe `undefined` e não espera a operação, a cadeia “quebra” e o erro daquela operação escapa do `.catch()`.",
      "Execução sequencial acidental: `await` um atrás do outro para tarefas independentes soma os tempos; dispare todas e espere juntas com `await Promise.all([...])`. O inverso também pega: `lista.forEach(async (x) => ...)` não espera ninguém; use `for...of` ou `Promise.all(lista.map(...))`.",
      "Achar que uma promise pode ser cancelada: depois de criada, ela não se desfaz. Para abortar uma requisição, use `AbortController`; em React, aborte ou ignore a resposta na limpeza do efeito.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece se um `.then` faz uma chamada assíncrona e não devolve a promise dela?",
        resposta:
          "A etapa seguinte roda imediatamente com `undefined`, sem esperar a chamada, e se ela falhar o erro não chega ao `.catch()` da cadeia. Devolva a promise (`return`) ou use `await`.",
      },
      {
        pergunta: "Qual a diferença entre `Promise.all` e `Promise.allSettled`?",
        resposta:
          "`Promise.all` rejeita assim que uma promise rejeita (as outras continuam rodando, mas o resultado é descartado); `Promise.allSettled` espera todas e devolve uma lista com `status` e `value` ou `reason` de cada uma, sem nunca rejeitar.",
      },
    ],
  },
  en: {
    titulo: "Promises vs callbacks",
    pergunta: "What is a JavaScript promise, and what is the difference between callbacks and promises?",
    porqueEsteMetodo:
      "Callbacks and promises solve the same problem (continuing after something asynchronous finishes) with very different guarantees. A side-by-side matrix plus a decision rule shows what each one delivers and what it costs.",
    resposta30s:
      "A **promise** is an object that represents the future result of an asynchronous operation and is in one of three states, **pending**, **fulfilled** or **rejected**; once settled, it never changes. With **callbacks** you hand the continuation to other code (inversion of control) and each level handles its own errors; with promises you get an object that **chains** (`then`), centralizes errors (`catch`), combines tasks (`Promise.all`) and always continues asynchronously. `async`/`await` is **syntactic sugar** over promises.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Callbacks, promises and async/await side by side",
        colunas: ["Aspect", "Callback", "Promise", "`async`/`await`"],
        linhas: [
          [
            "What it is",
            "A function passed in to be called when the operation finishes",
            "An object representing a future result: `pending`, then `fulfilled` or `rejected`, with no way back",
            "Syntax over promises: `await` suspends the function until the promise settles",
          ],
          [
            "Control",
            "Inversion of control: you hand the continuation to other code, which decides when and how many times to call it",
            "You receive the object and decide how to chain; each continuation runs at most once",
            "Same as promises: the flow comes back to your function",
          ],
          [
            "Errors",
            "An `(err, data)` convention and an `if` at every level; an async `throw` escapes the outer `try/catch`",
            "A rejection travels down the chain to the nearest `.catch()`",
            "Plain `try/catch/finally` around the `await`",
          ],
          [
            "Composition",
            "Nests (callback hell); parallelism needs hand-made counters",
            "`.then()` chains; `Promise.all`, `allSettled`, `race` and `any` combine several",
            "Reads like sequential code; for parallel tasks, `await Promise.all([...])`",
          ],
          [
            "When the continuation runs",
            "Depends on the API: may be synchronous or asynchronous",
            "Always asynchronous: it joins the microtask queue",
            "Same as promises: whatever follows `await` runs as a microtask",
          ],
          [
            "How many results",
            "Also fits repeating events (clicks, `setInterval`, streams)",
            "Settles once",
            "Settles once (`for await` covers asynchronous sequences)",
          ],
        ],
        nota: "`Promise.all` rejects on the first failure; `allSettled` waits for all and never rejects; `race` returns the first to settle; `any` returns the first to fulfill.",
      },
      {
        tipo: "codigo",
        titulo: "The same sequence, in three styles",
        legenda: "JavaScript",
        codigo: [
          "// Callbacks: the continuation nests and every level handles the error",
          "readUser(id, (err, user) => {",
          "  if (err) return handle(err);",
          "  readOrders(user.id, (err, orders) => {",
          "    if (err) return handle(err);",
          "    show(orders);",
          "  });",
          "});",
          "",
          "// Promises: a flat chain, a single catch",
          "readUser(id)",
          "  .then((user) => readOrders(user.id)) // return the promise!",
          "  .then(show)",
          "  .catch(handle)",
          "  .finally(() => hideSpinner());",
          "",
          "// async/await: the same promises, read top to bottom",
          "try {",
          "  const user = await readUser(id);",
          "  show(await readOrders(user.id));",
          "} catch (err) { handle(err); }",
        ].join("\n"),
        nota: "`readUser` and `readOrders` are hypothetical: in the callback version they take the callback; in the other two they return a promise.",
      },
      {
        tipo: "fluxo",
        titulo: "The life of a promise",
        etapas: [
          "It starts `pending`: `new Promise((resolve, reject) => ...)` runs the executor right away, but the result does not exist yet",
          "It settles once: `resolve(value)` moves it to `fulfilled`; `reject(error)` (or a `throw` in the executor) moves it to `rejected`; after that, state and value never change",
          "`.then(onFulfilled)` and `.catch(onRejected)` register continuations; even on an already-settled promise they only run after the current synchronous code, as **microtasks**",
          "Each `.then` returns a **new promise**: the returned value fulfills the next step, a `throw` rejects it, and returning another promise makes the chain wait for it",
          "`.finally(fn)` runs in both cases, without receiving the result, and passes the value or the error along",
        ],
        nota: "`catch(f)` is equivalent to `then(undefined, f)`. A rejection that no step handles triggers the `unhandledrejection` event in the browser (and `unhandledRejection` in Node.js).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In new code, use **promises with `async`/`await`**: `fetch`, `fs/promises` and most libraries already return promises, and error handling lives in one place. Keep **callbacks** for things that happen **more than once** (clicks, `setInterval`, streams) and for older APIs, and wrap those in a promise (`new Promise`, `util.promisify` in Node.js) when the operation has a single result. In React, event handlers are callbacks and can be `async`; the function passed to `useEffect`, however, cannot be `async` (it would return a promise instead of a cleanup function): declare an inner `async` function and call it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The continuation always runs later",
        texto:
          "A promise’s continuation **never runs right away**, even when the promise is already settled: `Promise.resolve().then(() => console.log('B')); console.log('A');` prints A and then B, because the `then` joins the microtask queue and only runs when the current synchronous code ends, before timers such as `setTimeout(fn, 0)`. That brings predictability (the callback never runs “too early” and the order is always the same), and it also applies to the code after an `await`.",
      },
    ],
    armadilhas: [
      "A promise with no error handling: without `.catch()` (or with `await` outside `try/catch`), the rejection becomes an “unhandled rejection”; the error vanishes from the UI and, in Node.js, may take the process down.",
      "Forgetting the `return` inside `then`: the next step receives `undefined` and does not wait for the operation, the chain “breaks” and that operation’s error escapes the `.catch()`.",
      "Accidental sequential execution: `await` one after another for independent tasks adds up the times; start them all and wait together with `await Promise.all([...])`. The reverse bites too: `list.forEach(async (x) => ...)` waits for nobody; use `for...of` or `Promise.all(list.map(...))`.",
      "Thinking a promise can be cancelled: once created, it cannot be undone. To abort a request, use `AbortController`; in React, abort or ignore the response in the effect’s cleanup.",
    ],
    autoteste: [
      {
        pergunta: "What happens if a `.then` makes an asynchronous call and does not return its promise?",
        resposta:
          "The next step runs immediately with `undefined`, without waiting for the call, and if the call fails the error never reaches the chain’s `.catch()`. Return the promise (`return`) or use `await`.",
      },
      {
        pergunta: "What is the difference between `Promise.all` and `Promise.allSettled`?",
        resposta:
          "`Promise.all` rejects as soon as one promise rejects (the others keep running, but their results are discarded); `Promise.allSettled` waits for all of them and returns a list with the `status` and the `value` or `reason` of each, never rejecting.",
      },
    ],
  },
};
