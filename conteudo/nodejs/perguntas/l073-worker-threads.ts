import type { Pergunta } from "../../tipos";

// L73 · Worker Threads
export const l073: Pergunta = {
  numero: 173,
  modulo: "linkedin-processos",
  metodo: "feynman",
  pt: {
    titulo: "Worker Threads",
    pergunta: "O que são Worker Threads?",
    porqueEsteMetodo:
      "Worker threads são um conceito de “fazer outra coisa em paralelo e receber o resultado”, que se entende melhor por uma cena do dia a dia. A analogia dá a intuição, e a tabela e o código mostram como o Node.js conversa entre as threads, quando usá-las e quando não.",
    resposta30s:
      "**Worker Threads** (`node:worker_threads`) executam JavaScript em **threads paralelas dentro do mesmo processo**, cada uma com seu próprio V8, heap e laço de eventos, para tirar **trabalho de CPU** (hash, parsing, imagens, cálculos) da thread principal sem bloqueá-la. Elas conversam por **mensagens** (`postMessage`, com clone estruturado ou transferência de `ArrayBuffer`) e só compartilham memória de verdade por **`SharedArrayBuffer` com `Atomics`**. Para E/S não ajudam, e criar uma thread por tarefa sai caro: use um pool.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um restaurante pequeno. O garçom no salão (a thread principal) anota pedidos e atende as mesas o tempo todo. Quando chega um pedido demorado, como um bolo de três andares, ele entrega um bilhete ao confeiteiro numa bancada nos fundos (o worker). O confeiteiro tem as próprias ferramentas e trabalha ao mesmo tempo; quando termina, devolve o bolo com outro bilhete. O garçom nunca para de atender.",
        tecnico:
          "`node:worker_threads` cria **threads de verdade** dentro do mesmo processo. Cada `Worker` tem o seu próprio motor V8, heap e laço de eventos, e executa um arquivo JavaScript. Isso dá **CPU em paralelo** sem bloquear a thread principal. Os dois lados conversam por mensagens (`postMessage`): o valor é copiado pelo clone estruturado, ou movido, no caso de um `ArrayBuffer` transferido. Só a memória de um `SharedArrayBuffer` é de fato compartilhada.",
        limite:
          "Na cozinha, o confeiteiro lê o bilhete e pronto. No Node, cada bilhete é uma cópia, nem todo objeto cabe nele, e contratar um confeiteiro (criar um worker, que inicia um V8 inteiro) leva tempo: por isso se usa uma equipe fixa, um pool. E se o pedido demorado for esperar um fornecedor (E/S), o garçom já faz isso sozinho e o confeiteiro não ajuda em nada.",
      },
      {
        tipo: "tabela",
        titulo: "Como as threads conversam (e compartilham memória)",
        colunas: ["Mecanismo", "O que faz", "Cuidado"],
        linhas: [
          [
            "`workerData`",
            "Entrega ao worker os dados iniciais, copiados",
            "É uma cópia: mudar o objeto lá não muda o de cá",
          ],
          [
            "`postMessage` (`parentPort`, `worker.postMessage`)",
            "Troca mensagens nos dois sentidos; o valor passa pelo clone estruturado",
            "Funções não atravessam (`DataCloneError`), instâncias de classe chegam como objetos comuns e objetos grandes custam tempo para copiar",
          ],
          [
            "Transferência (`transferList`)",
            "Move um `ArrayBuffer` para o outro lado sem copiar",
            "O original fica inutilizável na thread que enviou",
          ],
          [
            "`SharedArrayBuffer` e `Atomics`",
            "A mesma memória fica visível nas duas threads, sem cópia",
            "Condições de corrida: sincronize com `Atomics`; só bytes (arrays tipados), não objetos",
          ],
          [
            "`MessageChannel` e `MessagePort`",
            "Canal direto entre duas threads (por exemplo, dois workers), sem passar pela principal",
            "A porta precisa ser transferida (`transferList`) para o worker",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um cálculo pesado fora da thread principal",
        legenda: "calculo.mjs",
        codigo: [
          'import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";',
          "",
          "if (isMainThread) {",
          "  const worker = new Worker(new URL(import.meta.url), { workerData: { n: 40 } });",
          '  worker.on("message", (resultado) => console.log("fibonacci:", resultado));',
          '  worker.on("error", (erro) => console.error("worker falhou:", erro));',
          '  console.log("a thread principal continua livre");',
          "} else {",
          "  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));",
          "  parentPort.postMessage(fib(workerData.n)); // volta por mensagem",
          "}",
        ].join("\n"),
        nota: "Um arquivo só, com dois papéis distinguidos por `isMainThread`. É um exemplo didático: em produção, reaproveite os workers num pool em vez de criar um por tarefa.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar e quando não usar",
        texto:
          "Use para **trabalho de CPU em JavaScript** que travaria o laço: hashes e criptografia pesada, parsing de arquivos grandes, compressão, processamento de imagens, cálculos. Em um servidor, mantenha um **pool** de workers reaproveitados e uma fila de tarefas. Não use para E/S (rede, disco, banco): o laço de eventos já cuida disso (veja T28). Para escalar requisições, o caminho é cluster ou réplicas (veja L72); para outras estratégias de CPU, veja L77. Meça antes: numa tarefa curta, o custo de enviar a mensagem pode superar o ganho.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Memória compartilhada exige disciplina",
        texto:
          "`SharedArrayBuffer` dá memória realmente compartilhada, e com ela vêm as condições de corrida: duas threads lendo e escrevendo o mesmo byte sem coordenação dão resultados imprevisíveis. Use `Atomics` (`add`, `compareExchange`, `wait` e `notify`) e comece pelas mensagens; passe para memória compartilhada só quando medir que a cópia é o gargalo. Veja também T59.",
      },
    ],
    armadilhas: [
      "Criar um worker por tarefa ou por requisição: o custo de iniciar um V8 novo supera o ganho; use um pool.",
      "Usar worker threads para E/S: o laço de eventos já faz isso bem, e você só soma complexidade.",
      "Esperar que objetos sejam compartilhados, ou mandar funções, conexões e instâncias de classe pelo `postMessage`: só dados clonáveis passam, e o protótipo se perde.",
      "Usar `SharedArrayBuffer` sem `Atomics`: leituras e escritas simultâneas geram condições de corrida.",
    ],
    autoteste: [
      {
        pergunta: "Como um worker recebe os dados e devolve o resultado?",
        resposta:
          "Recebe pelo `workerData` ou por mensagens e responde com `parentPort.postMessage`. Os valores são copiados pelo clone estruturado; um `ArrayBuffer` pode ser transferido sem cópia (o original fica inutilizável).",
      },
      {
        pergunta: "Duas worker threads podem ver a mesma memória? Como?",
        resposta:
          "Sim, mas só por um `SharedArrayBuffer`, sincronizado com `Atomics`. Objetos comuns nunca são compartilhados: cada thread tem o seu heap e recebe cópias.",
      },
    ],
  },
  en: {
    titulo: "Worker Threads",
    pergunta: "What are Worker Threads?",
    porqueEsteMetodo:
      "Worker threads are a “do something else in parallel and get the result back” idea, easier to grasp through an everyday scene. The analogy gives the intuition, and the table and code show how Node.js passes information between threads, when to use them and when not to.",
    resposta30s:
      "**Worker Threads** (`node:worker_threads`) run JavaScript on **parallel threads inside the same process**, each with its own V8, heap and event loop, to take **CPU work** (hashing, parsing, images, calculations) off the main thread without blocking it. They talk through **messages** (`postMessage`, with structured clone or `ArrayBuffer` transfer) and only truly share memory through **`SharedArrayBuffer` with `Atomics`**. They do not help with I/O, and creating a thread per task is expensive: use a pool.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A small restaurant. The waiter on the floor (the main thread) takes orders and serves the tables all the time. When a slow order comes in, like a three-tier cake, he hands a note to the pastry chef at a back counter (the worker). The chef has their own tools and works at the same time; when done, they hand back the cake with another note. The waiter never stops serving.",
        tecnico:
          "`node:worker_threads` creates **real threads** inside the same process. Each `Worker` has its own V8 engine, heap and event loop, and runs a JavaScript file. That gives **CPU in parallel** without blocking the main thread. The two sides talk through messages (`postMessage`): the value is copied by structured clone, or moved, in the case of a transferred `ArrayBuffer`. Only the memory of a `SharedArrayBuffer` is truly shared.",
        limite:
          "In the kitchen, the chef reads the note and that is it. In Node, every note is a copy, not every object fits in it, and hiring a chef (creating a worker, which starts a whole V8) takes time: that is why you keep a fixed team, a pool. And if the slow order is waiting on a supplier (I/O), the waiter already does that alone and the chef helps with nothing.",
      },
      {
        tipo: "tabela",
        titulo: "How threads talk (and share memory)",
        colunas: ["Mechanism", "What it does", "Caution"],
        linhas: [
          [
            "`workerData`",
            "Hands the worker its initial data, copied",
            "It is a copy: changing the object there does not change the one here",
          ],
          [
            "`postMessage` (`parentPort`, `worker.postMessage`)",
            "Exchanges messages in both directions; the value goes through structured clone",
            "Functions do not cross (`DataCloneError`), class instances arrive as plain objects and large objects take time to copy",
          ],
          [
            "Transfer (`transferList`)",
            "Moves an `ArrayBuffer` to the other side without copying",
            "The original becomes unusable on the sending thread",
          ],
          [
            "`SharedArrayBuffer` and `Atomics`",
            "The same memory is visible on both threads, with no copy",
            "Race conditions: synchronize with `Atomics`; only bytes (typed arrays), not objects",
          ],
          [
            "`MessageChannel` and `MessagePort`",
            "A direct channel between two threads (for example, two workers), bypassing the main one",
            "The port must be transferred (`transferList`) to the worker",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A heavy calculation off the main thread",
        legenda: "compute.mjs",
        codigo: [
          'import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";',
          "",
          "if (isMainThread) {",
          "  const worker = new Worker(new URL(import.meta.url), { workerData: { n: 40 } });",
          '  worker.on("message", (result) => console.log("fibonacci:", result));',
          '  worker.on("error", (error) => console.error("worker failed:", error));',
          '  console.log("the main thread stays free");',
          "} else {",
          "  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));",
          "  parentPort.postMessage(fib(workerData.n)); // comes back as a message",
          "}",
        ].join("\n"),
        nota: "A single file with two roles, told apart by `isMainThread`. It is a teaching example: in production, reuse workers in a pool instead of creating one per task.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use them and when not to",
        texto:
          "Use them for **CPU work in JavaScript** that would freeze the loop: heavy hashing and cryptography, parsing large files, compression, image processing, calculations. In a server, keep a **pool** of reused workers and a task queue. Do not use them for I/O (network, disk, database): the event loop already handles that (see T28). To scale requests, the way is cluster or replicas (see L72); for other CPU strategies, see L77. Measure first: for a short task, the cost of sending the message can outweigh the gain.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Shared memory demands discipline",
        texto:
          "`SharedArrayBuffer` gives truly shared memory, and race conditions come with it: two threads reading and writing the same byte without coordination give unpredictable results. Use `Atomics` (`add`, `compareExchange`, `wait` and `notify`) and start with messages; move to shared memory only when you have measured that copying is the bottleneck. See also T59.",
      },
    ],
    armadilhas: [
      "Creating a worker per task or per request: the cost of starting a new V8 outweighs the gain; use a pool.",
      "Using worker threads for I/O: the event loop already does that well, and you only add complexity.",
      "Expecting objects to be shared, or sending functions, connections and class instances through `postMessage`: only cloneable data crosses, and the prototype is lost.",
      "Using `SharedArrayBuffer` without `Atomics`: simultaneous reads and writes create race conditions.",
    ],
    autoteste: [
      {
        pergunta: "How does a worker receive data and return the result?",
        resposta:
          "It receives through `workerData` or messages and replies with `parentPort.postMessage`. Values are copied by structured clone; an `ArrayBuffer` can be transferred without copying (the original becomes unusable).",
      },
      {
        pergunta: "Can two worker threads see the same memory? How?",
        resposta:
          "Yes, but only through a `SharedArrayBuffer`, synchronized with `Atomics`. Ordinary objects are never shared: each thread has its own heap and receives copies.",
      },
    ],
  },
};
