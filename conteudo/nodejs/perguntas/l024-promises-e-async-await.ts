import type { Pergunta } from "../../tipos";

// L24 · Promises e async/await
export const l024: Pergunta = {
  numero: 124,
  modulo: "linkedin-assincrono",
  metodo: "trace",
  pt: {
    titulo: "Promises e async/await",
    pergunta: "O que são Promises?",
    porqueEsteMetodo:
      "Promises e `async`/`await` só ficam claras quando você acompanha uma promise do nascimento até a resolução, incluindo o caminho da falha e a ordem em que o código realmente roda.",
    resposta30s:
      "Uma **Promise** representa um resultado que ainda vai chegar e está em um de três estados: **pending**, **fulfilled** (com um valor) ou **rejected** (com um erro); depois de resolvida, ela não muda mais. Você encadeia com `then`, `catch` e `finally`, e os callbacks rodam como **microtasks**. **`async`/`await`** é açúcar sintático sobre isso: `await` pausa a função até a promise resolver, sem bloquear a thread, e `try/catch` captura a rejeição.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A vida de uma cadeia de promises",
        etapas: [
          "`consultar()` devolve uma promise **pending**; o trabalho (rede, disco, timer) segue por fora e o código seguinte continua",
          "`.then(f)` registra `f` e devolve **outra** promise; nada executa ainda",
          "O trabalho termina: a promise vira **fulfilled** com um valor (ou **rejected** com um erro) e não muda mais",
          "O callback do `then` entra na fila de **microtasks** e roda assim que a pilha esvaziar, antes de timers e E/S",
          "O que `f` retorna (ou a promise que ela retorna) resolve a promise seguinte; se `f` lançar um erro, a seguinte fica rejected",
          "Uma rejeição pula os `then` e cai no primeiro `.catch`; o `.finally` roda nos dois casos e repassa o resultado",
        ],
        nota: "Cada `then` cria uma promise nova. É isso que permite encadear e propagar o erro até o `.catch`.",
      },
      {
        tipo: "codigo",
        titulo: "Em série, em paralelo e com erro",
        legenda: "JavaScript",
        codigo: [
          "const esperar = (ms, valor) => new Promise((resolve) => setTimeout(resolve, ms, valor));",
          "",
          "async function principal() {",
          '  console.log("1");',
          '  const a = await esperar(100, "a"); // em série: uma de cada vez',
          "  console.log(a);",
          '  const [b, c] = await Promise.all([esperar(100, "b"), esperar(100, "c")]); // em paralelo',
          "  console.log(b, c);",
          '  throw new Error("falhou"); // vira a rejeição da promise da função',
          "}",
          "",
          "principal()",
          '  .catch((erro) => console.log("erro:", erro.message))',
          '  .finally(() => console.log("fim"));',
          'console.log("2");',
        ].join("\n"),
        nota: "Saída: `1`, `2`, `a`, `b c`, `erro: falhou`, `fim`. O trecho leva cerca de 200 ms, não 300: o segundo par roda em paralelo.",
      },
      {
        tipo: "passos",
        titulo: "Seguindo o código acima, inclusive a falha",
        passos: [
          {
            titulo: "A chamada roda até o primeiro await",
            texto:
              "`principal()` executa de forma síncrona: imprime `1`, cria a promise de `esperar` e chega ao `await`.",
          },
          {
            titulo: "A função é suspensa",
            texto:
              "O `await` devolve o controle: `principal()` retorna uma promise pendente, o `.catch().finally()` é registrado e o script segue, imprimindo `2`. A thread nunca ficou parada esperando.",
          },
          {
            titulo: "A retomada é uma microtask",
            texto:
              "Cem milissegundos depois, o timer resolve a promise e a continuação da função entra na fila de microtasks: sai `a`. O `Promise.all` espera as duas promises e resolve com um array na mesma ordem da entrada: sai `b c`.",
          },
          {
            titulo: "A falha vira rejeição",
            texto:
              "O `throw` dentro de uma função `async` não estoura na pilha de quem chamou: ele rejeita a promise que `principal()` devolveu. O `.catch` a recebe (`erro: falhou`) e o `.finally` roda em seguida (`fim`).",
          },
          {
            titulo: "Se ninguém tratar",
            texto:
              "Uma rejeição sem `catch` e sem `try/catch` dispara `unhandledRejection` e, nas versões atuais do Node.js, derruba o processo por padrão (veja L32).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "async/await é sintaxe sobre promises",
        texto:
          "Uma função `async` sempre devolve uma promise: `return x` a resolve com `x` e `throw` a rejeita. O `await p` pausa **só aquela função**, retoma numa microtask e, se `p` foi rejeitada, lança o erro no ponto do `await`, por isso o `try/catch` funciona (veja L32). Vários `await` seguidos rodam em **série**; para rodar em **paralelo**, dispare as promises juntas com `Promise.all` (veja L26).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os erros clássicos",
        texto:
          "Esquecer o `await`: você manipula uma promise pendente em vez do valor, e a rejeição escapa do `try/catch`. Usar `forEach(async …)`: o `forEach` não espera ninguém, então o código depois dele roda antes do trabalho terminar; use `for…of` com `await` (série) ou `Promise.all(lista.map(…))` (paralelo). Fazer `await` em série de tarefas independentes. E embrulhar em `new Promise` algo que já devolve uma promise.",
      },
    ],
    armadilhas: [
      "Esquecer o `await` (ou o `return`) diante de uma promise: o código segue sem esperar e a falha vira uma rejeição não tratada.",
      "Usar `array.forEach(async …)`: ele ignora as promises, e o que vem depois roda antes de o trabalho acabar.",
      "Fazer `await` em série de operações independentes: três chamadas de 100 ms levam cerca de 300 ms, em vez de cerca de 100 ms com `Promise.all`.",
      "Achar que `await` bloqueia o Node.js: ele só pausa aquela função. Mas um laço pesado dentro de uma função `async` continua bloqueando a thread.",
    ],
    autoteste: [
      {
        pergunta: "Quais são os três estados de uma promise e o que acontece depois que ela é resolvida?",
        resposta:
          "Pending, fulfilled e rejected. Depois de fulfilled ou rejected, o estado e o valor não mudam mais, e os callbacks registrados rodam como microtasks.",
      },
      {
        pergunta: "O que uma função `async` devolve quando executa `throw new Error()`?",
        resposta:
          "Uma promise rejeitada com aquele erro. Quem chamou precisa tratá-la com `.catch()` ou com `try/catch` em volta de um `await`.",
      },
    ],
  },
  en: {
    titulo: "Promises and async/await",
    pergunta: "What are Promises?",
    porqueEsteMetodo:
      "Promises and `async`/`await` only become clear when you follow a promise from birth to resolution, including the failure path and the order in which the code really runs.",
    resposta30s:
      "A **Promise** represents a result that will arrive later and is in one of three states: **pending**, **fulfilled** (with a value) or **rejected** (with an error); once settled, it never changes. You chain with `then`, `catch` and `finally`, and the callbacks run as **microtasks**. **`async`/`await`** is syntactic sugar over that: `await` pauses the function until the promise settles, without blocking the thread, and `try/catch` catches the rejection.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The life of a promise chain",
        etapas: [
          "`fetchData()` returns a **pending** promise; the work (network, disk, timer) goes on outside and the next line of code continues",
          "`.then(f)` registers `f` and returns **another** promise; nothing runs yet",
          "The work finishes: the promise becomes **fulfilled** with a value (or **rejected** with an error) and never changes again",
          "The `then` callback joins the **microtask** queue and runs as soon as the stack empties, before timers and I/O",
          "What `f` returns (or the promise it returns) resolves the next promise; if `f` throws, the next one is rejected",
          "A rejection skips the `then`s and lands in the first `.catch`; `.finally` runs in both cases and passes the result along",
        ],
        nota: "Each `then` creates a new promise. That is what makes chaining possible and carries the error down to the `.catch`.",
      },
      {
        tipo: "codigo",
        titulo: "In series, in parallel and with an error",
        legenda: "JavaScript",
        codigo: [
          "const wait = (ms, value) => new Promise((resolve) => setTimeout(resolve, ms, value));",
          "",
          "async function main() {",
          '  console.log("1");',
          '  const a = await wait(100, "a"); // in series: one at a time',
          "  console.log(a);",
          '  const [b, c] = await Promise.all([wait(100, "b"), wait(100, "c")]); // in parallel',
          "  console.log(b, c);",
          '  throw new Error("failed"); // becomes the rejection of the function’s promise',
          "}",
          "",
          "main()",
          '  .catch((error) => console.log("error:", error.message))',
          '  .finally(() => console.log("done"));',
          'console.log("2");',
        ].join("\n"),
        nota: "Output: `1`, `2`, `a`, `b c`, `error: failed`, `done`. The snippet takes about 200 ms, not 300: the second pair runs in parallel.",
      },
      {
        tipo: "passos",
        titulo: "Following the code above, failure included",
        passos: [
          {
            titulo: "The call runs up to the first await",
            texto: "`main()` runs synchronously: it prints `1`, creates the `wait` promise and reaches the `await`.",
          },
          {
            titulo: "The function is suspended",
            texto:
              "`await` hands control back: `main()` returns a pending promise, `.catch().finally()` is registered and the script moves on, printing `2`. The thread never sat idle waiting.",
          },
          {
            titulo: "The resumption is a microtask",
            texto:
              "A hundred milliseconds later, the timer resolves the promise and the function’s continuation joins the microtask queue: `a` prints. `Promise.all` waits for both promises and resolves with an array in input order: `b c` prints.",
          },
          {
            titulo: "The failure becomes a rejection",
            texto:
              "The `throw` inside an `async` function does not blow up the caller’s stack: it rejects the promise `main()` returned. `.catch` receives it (`error: failed`) and `.finally` runs next (`done`).",
          },
          {
            titulo: "If nobody handles it",
            texto:
              "A rejection with no `catch` and no `try/catch` triggers `unhandledRejection` and, in current Node.js versions, takes the process down by default (see L32).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "async/await is syntax over promises",
        texto:
          "An `async` function always returns a promise: `return x` resolves it with `x` and `throw` rejects it. `await p` pauses **only that function**, resumes in a microtask and, if `p` was rejected, throws the error at the `await`, which is why `try/catch` works (see L32). Several `await`s in a row run in **series**; to run in **parallel**, start the promises together with `Promise.all` (see L26).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The classic mistakes",
        texto:
          "Forgetting `await`: you handle a pending promise instead of the value, and the rejection escapes the `try/catch`. Using `forEach(async …)`: `forEach` waits for nobody, so the code after it runs before the work finishes; use `for…of` with `await` (series) or `Promise.all(list.map(…))` (parallel). Awaiting independent tasks in series. And wrapping something that already returns a promise in `new Promise`.",
      },
    ],
    armadilhas: [
      "Forgetting `await` (or `return`) in front of a promise: the code moves on without waiting and the failure becomes an unhandled rejection.",
      "Using `array.forEach(async …)`: it ignores the promises, and what follows runs before the work is done.",
      "Awaiting independent operations in series: three 100 ms calls take about 300 ms, instead of about 100 ms with `Promise.all`.",
      "Thinking `await` blocks Node.js: it only pauses that function. But a heavy loop inside an `async` function still blocks the thread.",
    ],
    autoteste: [
      {
        pergunta: "What are the three states of a promise and what happens once it settles?",
        resposta:
          "Pending, fulfilled and rejected. Once fulfilled or rejected, the state and value never change, and the registered callbacks run as microtasks.",
      },
      {
        pergunta: "What does an `async` function return when it runs `throw new Error()`?",
        resposta:
          "A promise rejected with that error. The caller must handle it with `.catch()` or with `try/catch` around an `await`.",
      },
    ],
  },
};
