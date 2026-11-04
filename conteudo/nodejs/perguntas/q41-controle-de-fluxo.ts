import type { Pergunta } from "../../tipos";

// Q41 · Controle de fluxo
export const q41: Pergunta = {
  numero: 41,
  modulo: "turing-avancadas",
  metodo: "playbook",
  pt: {
    titulo: "Controle de fluxo",
    pergunta: "Como funciona uma função de controle de fluxo?",
    porqueEsteMetodo:
      "Controlar o fluxo é escolher e aplicar um padrão na ordem certa: ver as dependências, decidir entre série e paralelo, limitar a concorrência e tratar o erro. Um playbook transforma isso em critérios que você aplica a qualquer tarefa assíncrona.",
    resposta30s:
      "Uma função de **controle de fluxo** (control flow) decide **em que ordem** as tarefas assíncronas rodam e **o que acontece quando terminam ou falham**. Ela dispara as tarefas, conta quantas acabaram, junta os resultados e chama o passo final **uma vez só**, ou na primeira falha. Você a escreve com callbacks, com **promises** (`Promise.all`) ou com **`async`/`await`**, ou usa a biblioteca `async` (`series`, `parallel`, `waterfall`).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Descubra as dependências",
            texto:
              "A tarefa B precisa do resultado da A? Se sim, é **série**; se não, é **paralelo**. Sinal de desperdício: dois `await` seguidos que não usam o resultado um do outro.",
          },
          {
            titulo: "Série: uma depois da outra",
            texto:
              "`await` em sequência (ou `async.series`/`async.waterfall`, na biblioteca `async`). O tempo total é a **soma** dos tempos, mas cada passo pode usar o resultado do anterior.",
          },
          {
            titulo: "Paralelo: dispare tudo e espere",
            texto:
              "`Promise.all` espera todas e rejeita na primeira falha; `Promise.allSettled` espera todas e devolve o status de cada uma. O tempo total é aproximadamente o da tarefa mais lenta.",
          },
          {
            titulo: "Limite a concorrência",
            texto:
              "Com milhares de itens, não dispare tudo de uma vez. Critério: o destino aguenta? Conexões do banco, limite de uma API e arquivos abertos são finitos. Use lotes, `async.mapLimit`/`async.queue` ou um pacote como `p-limit`.",
          },
          {
            titulo: "Trate o erro em um lugar só",
            texto:
              "Callback: verifique `err` primeiro e dê `return`. Promises: `try`/`catch` com `await`, ou um `.catch` no fim da cadeia. `Promise.all` não cancela as demais quando uma rejeita; para cancelar, use `AbortController`.",
          },
          {
            titulo: "Teste o caminho de falha",
            texto:
              "Faça uma tarefa falhar de propósito e confira três sinais: o erro chega ao tratador, nada fica pendurado e o passo final dispara uma única vez.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Série, paralelo e limite com async/await",
        legenda: "JavaScript",
        codigo:
          "// dentro de uma função async (ou no nível superior de um módulo ESM)\n\n// Série: o segundo passo usa o resultado do primeiro\nconst usuario = await buscarUsuario(id);\nconst pedidos = await buscarPedidos(usuario.id);\n\n// Paralelo: tarefas independentes, o tempo é o da mais lenta\nconst [perfil, config] = await Promise.all([buscarPerfil(id), buscarConfig(id)]);\n\n// Limite simples: lotes de 5 de cada vez\nfor (let i = 0; i < urls.length; i += 5) {\n  const lote = urls.slice(i, i + 5);\n  await Promise.all(lote.map(baixar));\n}",
        nota: "Os lotes esperam a tarefa mais lenta de cada grupo; um pacote como `p-limit` ou o `async.mapLimit` mantém sempre N tarefas em andamento.",
      },
      {
        tipo: "tabela",
        titulo: "Ferramentas de controle de fluxo",
        colunas: ["Ferramenta", "Como expressa o fluxo", "Quando usar"],
        linhas: [
          [
            "Callback error-first",
            "`(err, dado) => {}`; o fluxo é montado à mão",
            "APIs antigas e código legado; converta com `util.promisify`",
          ],
          [
            "Promises",
            "`.then`/`.catch`, `Promise.all`, `allSettled`",
            "Compor tarefas e rodar em paralelo de forma explícita",
          ],
          ["`async`/`await`", "Código com cara de síncrono e `try`/`catch`", "O padrão atual para quase tudo"],
          [
            "Biblioteca `async`",
            "`series`, `parallel`, `waterfall`, `mapLimit`, `queue`",
            "Fluxos com callbacks e controle de concorrência já prontos (a versão atual também aceita funções `async`)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Por dentro: um parallel mínimo com callbacks",
        legenda: "JavaScript",
        codigo:
          "function paralelo(tarefas, fim) {\n  const resultados = new Array(tarefas.length);\n  let faltam = tarefas.length;\n  let encerrou = false;\n\n  if (faltam === 0) return process.nextTick(() => fim(null, resultados));\n\n  tarefas.forEach((tarefa, i) => {\n    tarefa((err, dado) => {\n      if (encerrou) return;\n      if (err) {\n        encerrou = true;\n        return fim(err);\n      }\n      resultados[i] = dado;\n      faltam -= 1;\n      if (faltam === 0) fim(null, resultados);\n    });\n  });\n}",
        nota: "É isso que `async.parallel` faz: dispara todas, conta as que terminaram, guarda cada resultado na posição certa e chama `fim` uma vez só (ou na primeira falha).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“A função control do Node.js”",
        texto:
          "Não existe uma função chamada `control` no núcleo do Node.js. A pergunta provavelmente quer dizer **controle de fluxo**, que não é uma API única, e sim um conjunto de padrões e ferramentas para ordenar código assíncrono: callbacks, promises, `async`/`await` e bibliotecas como a `async`.",
      },
    ],
    armadilhas: [
      "Usar `await` dentro de `forEach`: ele não espera funções assíncronas. Use `for...of` (série) ou `Promise.all(lista.map(...))` (paralelo).",
      "Serializar sem necessidade: `await` seguidos de tarefas independentes somam as latências à toa.",
      "Disparar milhares de tarefas em paralelo, sem limite: esgota conexões, memória ou o limite de taxa do serviço chamado.",
      "Chamar o callback duas vezes, ou esquecer o `return` depois de passar o erro: o passo final dispara de novo ou segue como se nada tivesse falhado.",
    ],
    autoteste: [
      {
        pergunta: "Quando usar `Promise.all` e quando `await` em sequência?",
        resposta:
          "`Promise.all` quando as tarefas são independentes; `await` em sequência quando uma precisa do resultado da anterior.",
      },
      {
        pergunta: "O que acontece com as outras promises quando uma delas rejeita dentro de `Promise.all`?",
        resposta:
          "A promise combinada rejeita na hora com o primeiro erro, mas as demais continuam executando: elas não são canceladas. Para ter o resultado de todas, use `allSettled`; para cancelar, `AbortController`.",
      },
      {
        pergunta: "Por que o callback do Node.js tem o erro como primeiro argumento?",
        resposta:
          "É a convenção error-first `(err, dado)`: o erro vem sempre na mesma posição, então todo callback pode (e deve) checá-lo antes de usar o dado.",
      },
    ],
  },
  en: {
    titulo: "Control flow",
    pergunta: "How does a control flow function work?",
    porqueEsteMetodo:
      "Controlling flow means picking a pattern and applying it in the right order: see the dependencies, choose between series and parallel, cap the concurrency and handle the error. A playbook turns that into criteria you can apply to any asynchronous task.",
    resposta30s:
      "A **control flow** function decides **in what order** asynchronous tasks run and **what happens when they finish or fail**. It starts the tasks, counts how many are done, gathers the results and calls the final step **exactly once**, or on the first failure. You write it with callbacks, with **promises** (`Promise.all`) or with **`async`/`await`**, or you use the `async` library (`series`, `parallel`, `waterfall`).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Find the dependencies",
            texto:
              "Does task B need the result of A? If so it is **series**; if not, it is **parallel**. A sign of waste: two consecutive `await`s that do not use each other’s result.",
          },
          {
            titulo: "Series: one after another",
            texto:
              "`await` in sequence (or `async.series`/`async.waterfall` from the `async` library). Total time is the **sum** of the times, but each step can use the previous result.",
          },
          {
            titulo: "Parallel: start everything and wait",
            texto:
              "`Promise.all` waits for all and rejects on the first failure; `Promise.allSettled` waits for all and returns each one’s status. Total time is roughly that of the slowest task.",
          },
          {
            titulo: "Cap the concurrency",
            texto:
              "With thousands of items, do not start everything at once. Criterion: can the destination take it? Database connections, an API’s rate limit and open files are finite. Use batches, `async.mapLimit`/`async.queue` or a package such as `p-limit`.",
          },
          {
            titulo: "Handle the error in one place",
            texto:
              "Callback: check `err` first and `return`. Promises: `try`/`catch` with `await`, or one `.catch` at the end of the chain. `Promise.all` does not cancel the others when one rejects; to cancel, use `AbortController`.",
          },
          {
            titulo: "Test the failure path",
            texto:
              "Make a task fail on purpose and check three signs: the error reaches the handler, nothing is left hanging and the final step fires only once.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Series, parallel and a cap with async/await",
        legenda: "JavaScript",
        codigo:
          "// inside an async function (or at the top level of an ESM module)\n\n// Series: the second step uses the first result\nconst user = await fetchUser(id);\nconst orders = await fetchOrders(user.id);\n\n// Parallel: independent tasks, the time is that of the slowest\nconst [profile, settings] = await Promise.all([fetchProfile(id), fetchSettings(id)]);\n\n// Simple cap: batches of 5 at a time\nfor (let i = 0; i < urls.length; i += 5) {\n  const batch = urls.slice(i, i + 5);\n  await Promise.all(batch.map(download));\n}",
        nota: "Batches wait for the slowest task in each group; a package such as `p-limit` or `async.mapLimit` always keeps N tasks running.",
      },
      {
        tipo: "tabela",
        titulo: "Control flow tools",
        colunas: ["Tool", "How it expresses the flow", "When to use it"],
        linhas: [
          [
            "Error-first callback",
            "`(err, data) => {}`; the flow is assembled by hand",
            "Old APIs and legacy code; convert with `util.promisify`",
          ],
          [
            "Promises",
            "`.then`/`.catch`, `Promise.all`, `allSettled`",
            "Composing tasks and running them in parallel explicitly",
          ],
          [
            "`async`/`await`",
            "Code that reads like synchronous code, with `try`/`catch`",
            "The current default for almost everything",
          ],
          [
            "The `async` library",
            "`series`, `parallel`, `waterfall`, `mapLimit`, `queue`",
            "Callback-based flows and ready-made concurrency control (the current version also accepts `async` functions)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Inside: a minimal parallel with callbacks",
        legenda: "JavaScript",
        codigo:
          "function parallel(tasks, done) {\n  const results = new Array(tasks.length);\n  let remaining = tasks.length;\n  let finished = false;\n\n  if (remaining === 0) return process.nextTick(() => done(null, results));\n\n  tasks.forEach((task, i) => {\n    task((err, data) => {\n      if (finished) return;\n      if (err) {\n        finished = true;\n        return done(err);\n      }\n      results[i] = data;\n      remaining -= 1;\n      if (remaining === 0) done(null, results);\n    });\n  });\n}",
        nota: "This is what `async.parallel` does: it starts everything, counts the finished tasks, stores each result in the right slot and calls `done` exactly once (or on the first failure).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“The Node.js control function”",
        texto:
          "There is no function called `control` in Node.js core. The question most likely means **control flow**, which is not a single API but a set of patterns and tools for ordering asynchronous code: callbacks, promises, `async`/`await` and libraries such as `async`.",
      },
    ],
    armadilhas: [
      "Using `await` inside `forEach`: it does not wait for async functions. Use `for...of` (series) or `Promise.all(list.map(...))` (parallel).",
      "Serializing for no reason: consecutive `await`s on independent tasks add up the latencies needlessly.",
      "Starting thousands of tasks in parallel with no cap: it exhausts connections, memory or the called service’s rate limit.",
      "Calling the callback twice, or forgetting the `return` after passing the error: the final step fires again or carries on as if nothing had failed.",
    ],
    autoteste: [
      {
        pergunta: "When do you use `Promise.all` and when `await` in sequence?",
        resposta:
          "`Promise.all` when the tasks are independent; `await` in sequence when one needs the result of the previous one.",
      },
      {
        pergunta: "What happens to the other promises when one of them rejects inside `Promise.all`?",
        resposta:
          "The combined promise rejects right away with the first error, but the others keep running: they are not cancelled. To get every outcome use `allSettled`; to cancel, use `AbortController`.",
      },
      {
        pergunta: "Why does a Node.js callback take the error as its first argument?",
        resposta:
          "It is the error-first convention `(err, data)`: the error is always in the same position, so every callback can (and should) check it before using the data.",
      },
    ],
  },
};
