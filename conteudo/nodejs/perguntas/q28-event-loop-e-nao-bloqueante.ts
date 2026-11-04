import type { Pergunta } from "../../tipos";

// Q28 · Event loop e E/S não bloqueante
export const q28: Pergunta = {
  numero: 28,
  modulo: "turing-intermediarias",
  metodo: "trace",
  pt: {
    titulo: "Event loop e E/S não bloqueante",
    pergunta: "Como funciona o non-blocking no Node.js?",
    porqueEsteMetodo:
      "“Não bloqueante” é abstrato até você acompanhar um pedido de verdade: quem recebe, quem delega, quem avisa e onde o laço pode travar. Seguir uma requisição, inclusive no caminho em que algo dá errado, mostra o mecanismo inteiro.",
    resposta30s:
      "O Node.js executa o seu JavaScript em **uma única thread**, mas ela nunca espera por E/S. Ao pedir algo lento (rede, disco, DNS), o Node **delega** o trabalho ao sistema operacional ou ao **pool de threads do libuv** e volta a atender outros eventos. Quando o resultado fica pronto, o **event loop** executa o callback correspondente. Esse desenho é o **padrão Reactor**. O preço: código síncrono pesado na thread principal trava todo mundo.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma requisição, no caminho feliz",
        etapas: [
          "Chega `GET /relatorio`: o sistema operacional avisa o libuv de que o socket tem dados, e o event loop chama o seu handler na thread do JavaScript",
          "O handler faz `await readFile(...)`: o Node entrega a leitura ao pool de threads do libuv e retorna na hora; a função fica suspensa",
          "A pilha de chamadas esvazia e o laço atende outros eventos (outras requisições, timers)",
          "A leitura termina em uma thread do pool; o libuv enfileira o resultado e a promise é resolvida",
          "O laço retoma o handler de onde parou, que chama `res.end(dados)`, e a resposta sai",
        ],
        nota: "A thread do JavaScript nunca ficou parada esperando o disco. Na rede é ainda mais direto: o próprio sistema operacional avisa (epoll, kqueue ou IOCP, conforme a plataforma), sem usar o pool.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que dá errado",
        passos: [
          {
            titulo: "O handler bloqueia",
            texto:
              "Alguém usa `readFileSync`, `JSON.parse` de um arquivo enorme ou um laço de CPU dentro do handler. A thread do JavaScript fica ocupada e o laço não volta a ouvir.",
          },
          {
            titulo: "Todo mundo espera",
            texto:
              "As outras requisições ficam paradas e os timers atrasam (um `setTimeout` de 10 ms só dispara quando a thread ficar livre). A latência sobe para todos os usuários, não só para quem pediu o relatório.",
          },
          {
            titulo: "O erro foge do `try/catch`",
            texto:
              "Num callback assíncrono, o `throw` acontece em outra volta do laço, depois de o `try` externo já ter terminado. Trate o erro dentro do callback (`err`), com `.catch()` ou com `try/catch` em volta do `await`: uma exceção ou rejeição sem tratamento pode derrubar o processo.",
          },
          {
            titulo: "O conserto",
            texto:
              "Troque `*Sync` por versões assíncronas, mande trabalho de CPU para `worker_threads` ou para outro processo, quebre tarefas longas em pedaços e meça o atraso do laço (`monitorEventLoopDelay`, do módulo `node:perf_hooks`).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A mesma leitura, bloqueando e não bloqueando",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          'import { readFileSync } from "node:fs";',
          'import { readFile } from "node:fs/promises";',
          "",
          "createServer(async (req, res) => {",
          '  if (req.url === "/bloqueante") {',
          '    const dados = readFileSync("relatorio.csv"); // trava o laço até terminar',
          "    return res.end(dados);",
          "  }",
          '  const dados = await readFile("relatorio.csv"); // delega e libera o laço',
          "  res.end(dados);",
          "}).listen(3000);",
        ].join("\n"),
        nota: "Enquanto `/bloqueante` lê o arquivo, nenhuma outra requisição é atendida. Nos demais caminhos, outras requisições são atendidas durante a leitura.",
      },
      {
        tipo: "tabela",
        titulo: "Que tarefas o event loop trata de forma assíncrona",
        colunas: ["Tarefa", "Quem faz o trabalho de fato", "Como o resultado volta"],
        linhas: [
          [
            "Rede (HTTP, TCP, `fetch`)",
            "O sistema operacional, observado pelo libuv",
            "Evento “pronto para ler ou escrever”, que dispara o callback",
          ],
          [
            "Arquivos (`fs`)",
            "Pool de threads do libuv",
            "A thread do pool termina e o callback entra na fila do laço",
          ],
          [
            "DNS com `dns.lookup`, `crypto` (`scrypt`, `pbkdf2`), `zlib`",
            "Pool de threads do libuv",
            "Igual aos arquivos",
          ],
          ["Timers (`setTimeout`, `setInterval`)", "O próprio laço, comparando com o relógio", "Fase de timers"],
          ["Processos filhos e pipes", "O sistema operacional", "Evento no laço, como na rede"],
          [
            "Promises e `await`",
            "Ninguém: são filas de continuações, não trabalho externo",
            "Microtasks, executadas entre um callback e o próximo",
          ],
        ],
        nota: "O pool de threads tem tamanho limitado (4 por padrão, ajustável por `UV_THREADPOOL_SIZE`); veja Q43.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O padrão Reactor",
        texto:
          "O Node.js usa o **padrão Reactor**: um **demultiplexador de eventos** (epoll no Linux, kqueue no macOS e BSD, IOCP no Windows, escondidos pelo libuv) observa muitas fontes de E/S ao mesmo tempo e, quando uma fica pronta, o laço despacha o **handler** (o seu callback) registrado para ela. Cada volta do laço passa por fases: timers, callbacks pendentes, poll (E/S), check (`setImmediate`) e fechamento. Entre um callback e o próximo, o Node esvazia as filas de `process.nextTick` e de microtasks de promises.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que torna o Node.js diferente, e o preço",
        texto:
          "Muitos servidores tradicionais dedicam uma thread a cada conexão. O Node atende muitas conexões com uma só thread de JavaScript, porque a maior parte do tempo de um servidor é espera de E/S. Isso o deixa leve para trabalho de E/S e fraco para trabalho de CPU na thread principal. “Não bloqueante” descreve a **E/S**, não o seu código: um `for` de dois segundos bloqueia tudo, com ou sem `async`. Para CPU, veja `worker_threads` (Q16 e Q59).",
      },
    ],
    armadilhas: [
      "Achar que o Node.js roda o seu JavaScript em paralelo: há uma thread para o seu código; o paralelismo está no sistema operacional e no pool de threads.",
      "Achar que `async` ou `await` tira o trabalho da thread principal: uma `async function` com um laço pesado dentro continua bloqueando.",
      "Usar funções `*Sync` (como `readFileSync`) em um servidor depois da inicialização: cada chamada para o laço inteiro.",
      "Esquecer que o pool de threads é pequeno: muitas operações de arquivo ou criptografia ao mesmo tempo esperam em fila, e a latência cresce.",
    ],
    autoteste: [
      {
        pergunta: "O que significa “não bloqueante” no Node.js?",
        resposta:
          "Que pedir uma operação de E/S não prende a thread do JavaScript: o trabalho é delegado ao sistema operacional ou ao pool do libuv, e o callback roda quando o resultado chega.",
      },
      {
        pergunta: "Qual padrão está por trás do event loop e quem o implementa?",
        resposta:
          "O padrão Reactor, com um demultiplexador de eventos que acorda os handlers certos. No Node.js, quem o implementa é o libuv.",
      },
      {
        pergunta:
          "Por que um `for` de dois segundos em um handler atrasa todos os usuários, mesmo dentro de uma função `async`?",
        resposta:
          "Porque `async` não cria thread: o JavaScript roda na thread única do laço, e enquanto ela está ocupada nenhum outro evento é despachado.",
      },
    ],
  },
  en: {
    titulo: "Event loop and non-blocking I/O",
    pergunta: "How does non-blocking work in Node.js?",
    porqueEsteMetodo:
      "“Non-blocking” stays abstract until you follow a real request: who receives it, who delegates, who notifies and where the loop can get stuck. Tracing one request, including the path where something goes wrong, shows the whole mechanism.",
    resposta30s:
      "Node.js runs your JavaScript on **a single thread**, but that thread never waits for I/O. When you ask for something slow (network, disk, DNS), Node **delegates** the work to the operating system or to the **libuv thread pool** and goes back to serving other events. When the result is ready, the **event loop** runs the matching callback. This design is the **Reactor pattern**. The price: heavy synchronous code on the main thread blocks everyone.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One request, on the happy path",
        etapas: [
          "`GET /report` arrives: the operating system tells libuv the socket has data, and the event loop calls your handler on the JavaScript thread",
          "The handler runs `await readFile(...)`: Node hands the read to the libuv thread pool and returns at once; the function is suspended",
          "The call stack empties and the loop serves other events (other requests, timers)",
          "The read finishes on a pool thread; libuv queues the result and the promise resolves",
          "The loop resumes the handler where it stopped; it calls `res.end(data)` and the response goes out",
        ],
        nota: "The JavaScript thread never sat idle waiting for the disk. On the network it is even more direct: the operating system itself notifies (epoll, kqueue or IOCP, depending on the platform), without using the pool.",
      },
      {
        tipo: "passos",
        titulo: "Now the path where it goes wrong",
        passos: [
          {
            titulo: "The handler blocks",
            texto:
              "Someone uses `readFileSync`, `JSON.parse` on a huge file or a CPU loop inside the handler. The JavaScript thread is busy and the loop stops listening.",
          },
          {
            titulo: "Everyone waits",
            texto:
              "Other requests stall and timers are late (a 10 ms `setTimeout` only fires once the thread is free). Latency rises for every user, not just the one who asked for the report.",
          },
          {
            titulo: "The error escapes `try/catch`",
            texto:
              "In an async callback, the `throw` happens on another turn of the loop, after the outer `try` has already finished. Handle the error inside the callback (`err`), with `.catch()` or with `try/catch` around the `await`: an unhandled exception or rejection can take the process down.",
          },
          {
            titulo: "The fix",
            texto:
              "Replace `*Sync` calls with async versions, send CPU work to `worker_threads` or another process, split long tasks into pieces and measure the loop delay (`monitorEventLoopDelay`, from the `node:perf_hooks` module).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same read, blocking and non-blocking",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          'import { readFileSync } from "node:fs";',
          'import { readFile } from "node:fs/promises";',
          "",
          "createServer(async (req, res) => {",
          '  if (req.url === "/blocking") {',
          '    const data = readFileSync("report.csv"); // freezes the loop until done',
          "    return res.end(data);",
          "  }",
          '  const data = await readFile("report.csv"); // delegates and frees the loop',
          "  res.end(data);",
          "}).listen(3000);",
        ].join("\n"),
        nota: "While `/blocking` reads the file, no other request is served. On any other path, other requests are served during the read.",
      },
      {
        tipo: "tabela",
        titulo: "Which tasks the event loop handles asynchronously",
        colunas: ["Task", "Who actually does the work", "How the result comes back"],
        linhas: [
          [
            "Network (HTTP, TCP, `fetch`)",
            "The operating system, watched by libuv",
            "A “ready to read or write” event that triggers the callback",
          ],
          ["Files (`fs`)", "libuv thread pool", "The pool thread finishes and the callback joins the loop’s queue"],
          ["DNS via `dns.lookup`, `crypto` (`scrypt`, `pbkdf2`), `zlib`", "libuv thread pool", "Same as files"],
          ["Timers (`setTimeout`, `setInterval`)", "The loop itself, comparing against the clock", "Timers phase"],
          ["Child processes and pipes", "The operating system", "An event on the loop, as with the network"],
          [
            "Promises and `await`",
            "Nobody: they are queues of continuations, not external work",
            "Microtasks, run between one callback and the next",
          ],
        ],
        nota: "The thread pool has a limited size (4 by default, adjustable with `UV_THREADPOOL_SIZE`); see Q43.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The Reactor pattern",
        texto:
          "Node.js uses the **Reactor pattern**: an **event demultiplexer** (epoll on Linux, kqueue on macOS and BSD, IOCP on Windows, hidden behind libuv) watches many I/O sources at once and, when one becomes ready, the loop dispatches the **handler** (your callback) registered for it. Each turn of the loop goes through phases: timers, pending callbacks, poll (I/O), check (`setImmediate`) and close. Between one callback and the next, Node drains the `process.nextTick` queue and the promise microtask queue.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What makes Node.js different, and the price",
        texto:
          "Many traditional servers dedicate a thread to each connection. Node serves many connections with a single JavaScript thread, because most of a server’s time is spent waiting on I/O. That makes it light for I/O work and weak for CPU work on the main thread. “Non-blocking” describes **I/O**, not your code: a two-second `for` loop blocks everything, with or without `async`. For CPU work, see `worker_threads` (Q16 and Q59).",
      },
    ],
    armadilhas: [
      "Thinking Node.js runs your JavaScript in parallel: there is one thread for your code; the parallelism lives in the operating system and the thread pool.",
      "Thinking `async` or `await` moves work off the main thread: an `async function` with a heavy loop inside still blocks.",
      "Using `*Sync` functions (like `readFileSync`) in a server after startup: each call freezes the whole loop.",
      "Forgetting the thread pool is small: many simultaneous file or crypto operations queue up and latency grows.",
    ],
    autoteste: [
      {
        pergunta: "What does “non-blocking” mean in Node.js?",
        resposta:
          "That requesting an I/O operation does not hold the JavaScript thread: the work is delegated to the operating system or the libuv pool, and the callback runs when the result arrives.",
      },
      {
        pergunta: "Which pattern is behind the event loop and who implements it?",
        resposta:
          "The Reactor pattern, with an event demultiplexer that wakes the right handlers. In Node.js, libuv implements it.",
      },
      {
        pergunta: "Why does a two-second `for` loop in a handler delay every user, even inside an `async` function?",
        resposta:
          "Because `async` does not create a thread: JavaScript runs on the loop’s single thread, and while it is busy no other event is dispatched.",
      },
    ],
  },
};
