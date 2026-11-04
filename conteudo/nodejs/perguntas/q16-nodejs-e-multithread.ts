import type { Pergunta } from "../../tipos";

// Q16 · Node.js é multithread?
export const q16: Pergunta = {
  numero: 16,
  modulo: "turing-basicas",
  metodo: "trace",
  pt: {
    titulo: "Node.js é multithread?",
    pergunta: "O Node.js é multithread?",
    porqueEsteMetodo:
      "“Single-thread ou multithread?” só se responde de verdade seguindo o que acontece com cada tipo de trabalho. Acompanhar uma requisição que lê um arquivo, calcula um hash e faz uma conta pesada mostra quais partes usam uma thread, quais usam várias e onde o laço de eventos trava.",
    resposta30s:
      "O **seu código JavaScript roda em uma única thread** (a principal), dentro do laço de eventos, mas o processo do Node.js **não é só uma thread**: o **libuv mantém um pool de threads** (4 por padrão) para arquivos, DNS e parte da criptografia, e o V8 usa threads próprias, por exemplo para a coleta de lixo. Para paralelizar JavaScript existe `worker_threads`; para usar vários processos, `child_process` e `cluster`. Em resumo: single-thread no seu código, multithread por baixo.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma requisição passando pelas threads",
        etapas: [
          "Thread principal: aceita a conexão e executa o seu handler JavaScript",
          "Rede: o sistema operacional avisa quando há dados (epoll, kqueue, IOCP), sem uma thread por conexão",
          "`fs.readFile`: o libuv entrega a leitura a uma thread do pool e a principal fica livre",
          "`crypto.scrypt`: o cálculo do hash também vai para o pool de threads",
          "Quando o trabalho termina, o resultado volta como callback ou promessa na fila do laço de eventos",
          "A thread principal executa a continuação do seu código",
        ],
        nota: "O pool tem 4 threads por padrão e pode ser ajustado com `UV_THREADPOOL_SIZE`. Com mais operações do que threads, as que sobram esperam na fila.",
      },
      {
        tipo: "passos",
        titulo: "Quando o próprio JavaScript é o gargalo",
        passos: [
          {
            titulo: "Uma conta pesada na thread principal",
            texto:
              "Um laço de milhões de iterações, ou um `JSON.parse` de um arquivo enorme, roda dentro do laço de eventos.",
          },
          {
            titulo: "Tudo para",
            texto: "Nenhum outro callback executa: as demais requisições esperam, mesmo com a rede e o disco ociosos.",
          },
          {
            titulo: "O pool não ajuda",
            texto:
              "O pool só recebe as operações nativas do Node que foram feitas para ele. O seu `for` continua na thread principal.",
          },
          {
            titulo: "A saída",
            texto: "Mova o cálculo para um `worker_threads` (ou outro processo) e receba o resultado por mensagem.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quem roda onde",
        colunas: ["Trabalho", "Onde executa", "Quem gerencia"],
        linhas: [
          [
            "Seu JavaScript (handlers, callbacks, promessas)",
            "Thread principal, um passo de cada vez",
            "Laço de eventos do libuv e o V8",
          ],
          [
            "Rede (TCP, HTTP, sockets)",
            "O sistema operacional, com notificações assíncronas",
            "libuv (sem thread por conexão)",
          ],
          [
            "Arquivos, `dns.lookup`, `zlib` e parte do `crypto`",
            "Pool de threads do libuv (4 por padrão)",
            "libuv; você só ajusta o tamanho com `UV_THREADPOOL_SIZE`",
          ],
          ["Coleta de lixo e compilação do V8", "Threads internas do V8", "O V8; você não as controla diretamente"],
          [
            "Cálculo pesado em JavaScript",
            "`worker_threads`: threads com o seu próprio V8 e laço de eventos",
            "Você: cria, troca mensagens e encerra",
          ],
          [
            "Outro programa ou trabalho isolado",
            "`child_process` ou `cluster`: processos do sistema operacional",
            "Você (`spawn`, `fork`) com o sistema operacional",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um worker para o cálculo pesado",
        legenda: "JavaScript",
        codigo: `import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

if (isMainThread) {
  // thread principal: cria o worker e continua livre
  const worker = new Worker(new URL(import.meta.url), { workerData: { n: 40 } });
  worker.on("message", (resultado) => console.log("resultado:", resultado));
  worker.on("error", (erro) => console.error("worker falhou:", erro));
  worker.on("exit", (codigo) => console.log("worker encerrou, código", codigo));
  console.log("a thread principal segue atendendo eventos");
} else {
  // dentro do worker: a conta pesada não trava o laço de eventos principal
  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
  parentPort.postMessage(fib(workerData.n));
}`,
        nota: 'O mesmo arquivo cumpre os dois papéis, e `isMainThread` os diferencia. Ele precisa ser um módulo ES (`.mjs` ou `"type": "module"` no `package.json`).',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Threads filhas: quem gerencia?",
        texto:
          "O Node.js é **single-thread no modelo de programação** (o seu JavaScript não roda em duas threads ao mesmo tempo, então não há locks) e **multithread na implementação**. O pool do libuv é gerenciado pelo próprio libuv; você só ajusta o tamanho. Os `worker_threads` você cria e encerra. Os processos filhos (`child_process`, `cluster`) você inicia e o sistema operacional agenda. Veja Q43 (libuv), Q45 (cluster), Q58 e Q59 para cada peça.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Duas confusões comuns",
        texto:
          "“Single-thread” não significa lento nem “só um núcleo” (o libuv e os processos filhos usam outros). Mas o inverso também vale: `async`/`await` não cria thread nenhuma. Ele só deixa a thread principal livre enquanto espera, e não acelera cálculo de CPU.",
      },
    ],
    armadilhas: [
      "Dizer que o Node.js “não usa threads”: o libuv, o V8 e os workers usam.",
      "Achar que `async`/`await` ou `Promise` rodam em paralelo: o código da continuação roda na thread principal.",
      "Fazer cálculo pesado ou `JSON.parse` gigante dentro do handler: bloqueia o laço de eventos para todos os clientes.",
      "Pensar que aumentar o pool ou criar muitos workers sempre ajuda: há custo de memória e de troca de contexto, e só a medição mostra o ganho.",
    ],
    autoteste: [
      {
        pergunta: "Se o Node.js é single-thread, por que ele consegue ler arquivos sem travar?",
        resposta:
          "Porque a leitura é entregue a uma thread do pool do libuv. A thread principal segue executando outros callbacks e recebe o resultado depois, pela fila do laço de eventos.",
      },
      {
        pergunta: "Quando usar `worker_threads` em vez do pool do libuv?",
        resposta:
          "Quando o trabalho pesado é código JavaScript seu (um cálculo, um parse enorme). O pool só atende as operações nativas do Node, e o seu `for` continuaria na thread principal.",
      },
      {
        pergunta: "Quem gerencia as “threads filhas” do Node.js?",
        resposta:
          "O pool é gerenciado pelo libuv, os `worker_threads` por você (criar, mensagens, encerrar) e os processos filhos por você junto com o sistema operacional.",
      },
    ],
  },
  en: {
    titulo: "Is Node.js multithreaded?",
    pergunta: "Is Node.js multithreaded?",
    porqueEsteMetodo:
      "“Single-threaded or multithreaded?” can only be answered properly by following what happens to each kind of work. Tracing a request that reads a file, computes a hash and does a heavy calculation shows which parts use one thread, which use several and where the event loop stalls.",
    resposta30s:
      "**Your JavaScript code runs on a single thread** (the main one), inside the event loop, but the Node.js process **is not just one thread**: **libuv keeps a thread pool** (4 by default) for files, DNS and part of cryptography, and V8 uses its own threads, for example for garbage collection. To parallelize JavaScript there is `worker_threads`; to use several processes, `child_process` and `cluster`. In short: single-threaded for your code, multithreaded underneath.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A request passing through the threads",
        etapas: [
          "Main thread: accepts the connection and runs your JavaScript handler",
          "Network: the operating system signals when data is ready (epoll, kqueue, IOCP), without a thread per connection",
          "`fs.readFile`: libuv hands the read to a pool thread and the main thread stays free",
          "`crypto.scrypt`: the hash computation also goes to the thread pool",
          "When the work finishes, the result comes back as a callback or promise in the event loop queue",
          "The main thread runs the continuation of your code",
        ],
        nota: "The pool has 4 threads by default and can be tuned with `UV_THREADPOOL_SIZE`. With more operations than threads, the extra ones wait in line.",
      },
      {
        tipo: "passos",
        titulo: "When JavaScript itself is the bottleneck",
        passos: [
          {
            titulo: "A heavy calculation on the main thread",
            texto: "A loop of millions of iterations, or a `JSON.parse` of a huge file, runs inside the event loop.",
          },
          {
            titulo: "Everything stops",
            texto: "No other callback runs: the remaining requests wait, even with the network and disk idle.",
          },
          {
            titulo: "The pool does not help",
            texto:
              "The pool only receives the native Node operations built for it. Your `for` loop stays on the main thread.",
          },
          {
            titulo: "The way out",
            texto: "Move the calculation to `worker_threads` (or another process) and receive the result by message.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Who runs where",
        colunas: ["Work", "Where it runs", "Who manages it"],
        linhas: [
          [
            "Your JavaScript (handlers, callbacks, promises)",
            "Main thread, one step at a time",
            "The libuv event loop and V8",
          ],
          [
            "Network (TCP, HTTP, sockets)",
            "The operating system, with asynchronous notifications",
            "libuv (no thread per connection)",
          ],
          [
            "Files, `dns.lookup`, `zlib` and part of `crypto`",
            "libuv thread pool (4 by default)",
            "libuv; you only tune its size with `UV_THREADPOOL_SIZE`",
          ],
          ["Garbage collection and V8 compilation", "Internal V8 threads", "V8; you do not control them directly"],
          [
            "Heavy computation in JavaScript",
            "`worker_threads`: threads with their own V8 and event loop",
            "You: create, exchange messages and terminate",
          ],
          [
            "Another program or isolated work",
            "`child_process` or `cluster`: operating system processes",
            "You (`spawn`, `fork`) together with the operating system",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A worker for the heavy calculation",
        legenda: "JavaScript",
        codigo: `import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";

if (isMainThread) {
  // main thread: creates the worker and stays free
  const worker = new Worker(new URL(import.meta.url), { workerData: { n: 40 } });
  worker.on("message", (result) => console.log("result:", result));
  worker.on("error", (error) => console.error("worker failed:", error));
  worker.on("exit", (code) => console.log("worker exited, code", code));
  console.log("the main thread keeps serving events");
} else {
  // inside the worker: the heavy calculation does not block the main event loop
  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));
  parentPort.postMessage(fib(workerData.n));
}`,
        nota: 'The same file plays both roles, and `isMainThread` tells them apart. It must be an ES module (`.mjs` or `"type": "module"` in `package.json`).',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Child threads: who manages them?",
        texto:
          "Node.js is **single-threaded in its programming model** (your JavaScript never runs on two threads at once, so there are no locks) and **multithreaded in its implementation**. The libuv pool is managed by libuv itself; you only tune the size. You create and terminate `worker_threads`. Child processes (`child_process`, `cluster`) you start and the operating system schedules. See Q43 (libuv), Q45 (cluster), Q58 and Q59 for each piece.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Two common mix-ups",
        texto:
          "“Single-threaded” does not mean slow or “one core only” (libuv and child processes use others). But the reverse also holds: `async`/`await` creates no thread at all. It only frees the main thread while it waits, and it does not speed up CPU work.",
      },
    ],
    armadilhas: [
      "Saying Node.js “does not use threads”: libuv, V8 and workers do.",
      "Thinking `async`/`await` or `Promise` run in parallel: the continuation code runs on the main thread.",
      "Doing heavy computation or a giant `JSON.parse` inside the handler: it blocks the event loop for every client.",
      "Believing a bigger pool or many workers always helps: there is a memory and context-switching cost, and only measurement shows the gain.",
    ],
    autoteste: [
      {
        pergunta: "If Node.js is single-threaded, how can it read files without freezing?",
        resposta:
          "Because the read is handed to a libuv thread pool thread. The main thread keeps running other callbacks and gets the result later, through the event loop queue.",
      },
      {
        pergunta: "When should you use `worker_threads` instead of the libuv pool?",
        resposta:
          "When the heavy work is your own JavaScript code (a calculation, a huge parse). The pool only serves Node’s native operations, and your `for` loop would stay on the main thread.",
      },
      {
        pergunta: "Who manages Node.js “child threads”?",
        resposta:
          "libuv manages the pool, you manage `worker_threads` (create, messages, terminate), and you manage child processes together with the operating system.",
      },
    ],
  },
};
