import type { Pergunta } from "../../tipos";

// L32 · Erros em código assíncrono
export const l032: Pergunta = {
  numero: 132,
  modulo: "linkedin-assincrono",
  metodo: "trace",
  pt: {
    titulo: "Erros em código assíncrono",
    pergunta: "Como funciona o tratamento de erros em código assíncrono?",
    porqueEsteMetodo:
      "O erro assíncrono não segue o caminho que o `try/catch` conhece, e a melhor forma de entender isso é seguir uma operação que falha por cada estilo (callback, promise, `await`, emissor de eventos) até o tratador, ou até a rede de segurança.",
    resposta30s:
      "O erro assíncrono **não sobe pela pilha** até um `try/catch` externo, porque a operação termina depois de a função que a iniciou já ter retornado; ele é **entregue** de um jeito que depende do estilo: o argumento `err` no **callback error-first**, a **rejeição** na promise (que vira exceção no ponto do `await`) e o evento **`'error'`** nos EventEmitters. Cada um exige tratamento explícito; o que escapa vira `unhandledRejection` ou `uncaughtException`, que servem de rede de segurança (registrar e encerrar), não de tratamento.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Uma operação que falha, quatro caminhos",
        passos: [
          {
            titulo: "Callback error-first",
            texto:
              "A função que iniciou a operação já retornou quando ela falha; o Node chama `cb(err)` com o erro no primeiro argumento. Quem não checa `err` segue com um dado inválido e quebra mais adiante, com uma mensagem confusa. Trate com `if (err) return …` (veja T32).",
          },
          {
            titulo: "Promise",
            texto:
              "A falha vira uma **rejeição**, e nada é lançado para o chamador. Ela pula os `.then` da cadeia até encontrar um `.catch`. Um `throw` dentro de um `.then` também vira rejeição da promise seguinte.",
          },
          {
            titulo: "`async`/`await`",
            texto:
              "O `await` transforma a rejeição de volta em exceção naquele ponto, e por isso um `try/catch` em volta dele funciona. Sem o `await`, não: um `return minhaPromise` dentro do `try` entrega a rejeição ao chamador e o `catch` não a vê.",
          },
          {
            titulo: "EventEmitter e streams",
            texto:
              "Falhas de sockets, streams e servidores saem como evento `'error'`. Sem nenhum ouvinte, o Node lança a exceção e o processo pode cair (veja T61 e T37).",
          },
          {
            titulo: "Rede de segurança",
            texto:
              "Uma rejeição que ninguém tratou dispara `unhandledRejection`; nas versões atuais do Node.js o padrão é tratá-la como exceção não capturada e encerrar o processo (confira `--unhandled-rejections` em nodejs.org). Use esses eventos para registrar e encerrar de forma controlada, não para continuar (veja L116).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O `try/catch` externo não pega o callback; o `await` pega",
        legenda: "JavaScript (módulo ES)",
        codigo: [
          'import fs from "node:fs";',
          'import { readFile } from "node:fs/promises";',
          "",
          "// 1. Callback: o try/catch termina antes de o erro existir",
          "try {",
          '  fs.readFile("nao-existe.txt", (err, dados) => {',
          '    if (err) return console.error("callback:", err.code); // ENOENT chega aqui',
          "    console.log(dados.length);",
          "  });",
          "} catch {",
          '  console.error("nunca executa para ENOENT");',
          "}",
          "",
          "// 2. await: a rejeição volta a ser exceção e o catch funciona",
          "try {",
          '  await readFile("nao-existe.txt");',
          "} catch (err) {",
          '  console.error("await:", err.code); // ENOENT',
          "}",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Todo erro assíncrono precisa de um dono",
        texto:
          "Quem inicia a operação é responsável por ligar a falha dela a um tratador: `err` no callback, `.catch` ou `try/catch` com `await` na promise, `on('error')` no emissor. Ao tratar, decida o que fazer (tentar de novo, responder com erro, propagar com contexto); um `catch` vazio engole o problema e é pior que não tratar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Onde o erro costuma se perder",
        texto:
          "Funções `async` passadas a `forEach` (que não espera nada) e promises disparadas sem `await` nem `.catch` viram rejeições sem dono. Para esperar várias, use `Promise.all` ou `allSettled` (veja L26); um `throw` dentro de um `setTimeout` ou de outro callback sem tratamento vira `uncaughtException`.",
      },
    ],
    armadilhas: [
      "Envolver uma chamada com callback num `try/catch` e achar que ela está protegida: o erro chega depois, por `err`.",
      "Esquecer o `await` (ou devolver a promise de dentro do `try`): a rejeição escapa do `catch` e vira `unhandledRejection`.",
      "Usar `async` dentro de `forEach`: as promises ficam sem dono e o erro se perde; use `for...of` ou `Promise.all` com `map`.",
      "Criar uma stream ou um emissor sem ouvinte de `'error'`, ou usar um `catch` vazio: o erro derruba o processo ou some em silêncio.",
    ],
    autoteste: [
      {
        pergunta: "Por que um `try/catch` em volta de `fs.readFile(caminho, cb)` não captura um arquivo inexistente?",
        resposta:
          "Porque a leitura falha depois de o `try` já ter terminado; o erro chega ao callback como `err`, e é lá que deve ser tratado. Com `fs/promises` e `await`, o `try/catch` funciona.",
      },
      {
        pergunta: "O que acontece com uma rejeição que ninguém trata e por que `unhandledRejection` não é tratamento?",
        resposta:
          "O Node dispara `unhandledRejection` e, nas versões atuais, por padrão a trata como exceção não capturada e encerra o processo. O evento serve para registrar e encerrar de forma controlada, pois o estado da aplicação já é incerto.",
      },
    ],
  },
  en: {
    titulo: "Errors in async code",
    pergunta: "How does error handling work with asynchronous code?",
    porqueEsteMetodo:
      "An asynchronous error does not follow the path `try/catch` knows, and the best way to see that is to follow one failing operation through each style (callback, promise, `await`, event emitter) to the handler, or to the safety net.",
    resposta30s:
      "An asynchronous error **does not travel up the stack** to an outer `try/catch`, because the operation finishes after the function that started it has already returned; it is **delivered** in a way that depends on the style: the `err` argument in an **error-first callback**, a **rejection** in a promise (which becomes an exception at the `await`) and the **`'error'`** event on EventEmitters. Each one needs explicit handling; what escapes becomes `unhandledRejection` or `uncaughtException`, which are a safety net (log and exit), not handling.",
    blocos: [
      {
        tipo: "passos",
        titulo: "One failing operation, four paths",
        passos: [
          {
            titulo: "Error-first callback",
            texto:
              "The function that started the operation has already returned when it fails; Node calls `cb(err)` with the error as the first argument. Whoever does not check `err` carries on with invalid data and breaks later, with a confusing message. Handle it with `if (err) return …` (see T32).",
          },
          {
            titulo: "Promise",
            texto:
              "The failure becomes a **rejection**, and nothing is thrown to the caller. It skips the `.then` calls in the chain until it finds a `.catch`. A `throw` inside a `.then` also becomes a rejection of the next promise.",
          },
          {
            titulo: "`async`/`await`",
            texto:
              "`await` turns the rejection back into an exception at that point, which is why a `try/catch` around it works. Without the `await`, it does not: a `return myPromise` inside the `try` hands the rejection to the caller and the `catch` never sees it.",
          },
          {
            titulo: "EventEmitter and streams",
            texto:
              "Failures from sockets, streams and servers come out as an `'error'` event. With no listener, Node throws the exception and the process can crash (see T61 and T37).",
          },
          {
            titulo: "Safety net",
            texto:
              "A rejection nobody handled fires `unhandledRejection`; in current Node.js versions the default is to treat it as an uncaught exception and end the process (check `--unhandled-rejections` on nodejs.org). Use these events to log and shut down in a controlled way, not to carry on (see L116).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The outer `try/catch` misses the callback; `await` catches it",
        legenda: "JavaScript (ES module)",
        codigo: [
          'import fs from "node:fs";',
          'import { readFile } from "node:fs/promises";',
          "",
          "// 1. Callback: the try/catch ends before the error even exists",
          "try {",
          '  fs.readFile("does-not-exist.txt", (err, data) => {',
          '    if (err) return console.error("callback:", err.code); // ENOENT arrives here',
          "    console.log(data.length);",
          "  });",
          "} catch {",
          '  console.error("never runs for ENOENT");',
          "}",
          "",
          "// 2. await: the rejection becomes an exception again and the catch works",
          "try {",
          '  await readFile("does-not-exist.txt");',
          "} catch (err) {",
          '  console.error("await:", err.code); // ENOENT',
          "}",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Every asynchronous error needs an owner",
        texto:
          "Whoever starts the operation is responsible for wiring its failure to a handler: `err` in the callback, `.catch` or `try/catch` with `await` on the promise, `on('error')` on the emitter. When you handle it, decide what to do (retry, answer with an error, propagate with context); an empty `catch` swallows the problem and is worse than not handling it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where errors usually get lost",
        texto:
          "`async` functions passed to `forEach` (which waits for nothing) and promises fired without `await` or `.catch` become rejections with no owner. To wait for several, use `Promise.all` or `allSettled` (see L26); a `throw` inside a `setTimeout` or another unguarded callback becomes an `uncaughtException`.",
      },
    ],
    armadilhas: [
      "Wrapping a callback-based call in a `try/catch` and thinking it is protected: the error arrives later, through `err`.",
      "Forgetting the `await` (or returning the promise from inside the `try`): the rejection escapes the `catch` and becomes an `unhandledRejection`.",
      "Using `async` inside `forEach`: the promises have no owner and the error is lost; use `for...of` or `Promise.all` with `map`.",
      "Creating a stream or emitter with no `'error'` listener, or using an empty `catch`: the error crashes the process or vanishes silently.",
    ],
    autoteste: [
      {
        pergunta: "Why does a `try/catch` around `fs.readFile(path, cb)` not catch a missing file?",
        resposta:
          "Because the read fails after the `try` has already finished; the error reaches the callback as `err`, and that is where it must be handled. With `fs/promises` and `await`, the `try/catch` works.",
      },
      {
        pergunta: "What happens to a rejection nobody handles, and why is `unhandledRejection` not handling?",
        resposta:
          "Node fires `unhandledRejection` and, in current versions, treats it by default as an uncaught exception and ends the process. The event is for logging and shutting down in a controlled way, because the application’s state is already uncertain.",
      },
    ],
  },
};
