import type { Pergunta } from "../../tipos";

// Q61 · EventEmitter
export const q61: Pergunta = {
  numero: 61,
  modulo: "turing-avancadas",
  metodo: "trace",
  pt: {
    titulo: "EventEmitter",
    pergunta: "O que o EventEmitter faz no Node.js?",
    porqueEsteMetodo:
      "O EventEmitter é uma conversa entre quem emite e quem escuta. Seguir um único `emit` do começo ao fim, inclusive os caminhos de erro, mostra a ordem, o caráter síncrono e as armadilhas.",
    resposta30s:
      "`EventEmitter` (de `node:events`) é a classe base do modelo de eventos do Node: você registra **ouvintes** com `on` e outro trecho de código os dispara com `emit`. Os ouvintes rodam **de forma síncrona, na ordem em que foram registrados**. Streams, `http.Server`, `net.Socket` e `process` herdam dele. Um evento chamado `error` sem ouvinte **lança a exceção** e pode derrubar o processo.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O caminho de um `emit('criado', 42)`",
        etapas: [
          "`new Pedidos()` cria o emissor, que guarda um mapa de nome do evento para lista de ouvintes",
          "`on('criado', A)` e `once('criado', B)` entram na lista nessa ordem; `once` guarda um invólucro que se remove sozinho",
          "`emit('criado', 42)` pega uma cópia da lista de ouvintes do evento `criado`",
          "Chama A(42) e espera A terminar: tudo é síncrono",
          "Chama B(42): o invólucro tira B da lista antes de executá-lo",
          "`emit` devolve `true` (havia ouvintes) e só então a linha seguinte do código roda",
          "Um segundo `emit('criado', 43)` chama só A; um evento sem nenhum ouvinte devolve `false`",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os mesmos passos em código",
        legenda: "JavaScript",
        codigo: `import { EventEmitter, once } from "node:events";

class Pedidos extends EventEmitter {}
const pedidos = new Pedidos();

pedidos.on("criado", (id) => console.log("A: pedido", id));
pedidos.once("criado", (id) => console.log("B (só na 1ª vez):", id));
pedidos.on("error", (erro) => console.error("falhou:", erro.message));

console.log(pedidos.emit("criado", 42)); // A, B e depois true
console.log(pedidos.emit("criado", 43)); // só A e depois true
console.log(pedidos.emit("outro")); // sem ouvintes: false

pedidos.emit("error", new Error("estoque esgotado")); // cai no ouvinte de 'error'

setTimeout(() => pedidos.emit("pronto", "ok"), 100);
const [mensagem] = await once(pedidos, "pronto"); // Promise que resolve no 1º 'pronto'
console.log(mensagem); // "ok"`,
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que algo dá errado",
        passos: [
          {
            titulo: "Sem ouvinte para `error`",
            texto:
              "`emit('error', erro)` lança o próprio erro. Sem `try/catch` por perto, o processo termina. Todo emissor que pode falhar precisa de `on('error', …)`.",
          },
          {
            titulo: "Um ouvinte lança exceção",
            texto:
              "A exceção sobe para quem chamou `emit`, e os ouvintes seguintes daquele `emit` não rodam. Cada ouvinte deve cuidar dos próprios erros.",
          },
          {
            titulo: "Um ouvinte `async` rejeita",
            texto:
              "O `emit` ignora o valor devolvido, então a rejeição vira uma promise sem tratamento. Capture dentro do ouvinte ou use a opção `captureRejections` do emissor.",
          },
          {
            titulo: "Ouvintes demais no mesmo evento",
            texto:
              "Passando de 10 por evento, o Node avisa `MaxListenersExceededWarning`. É só um aviso, mas quase sempre indica vazamento: um `on` dentro de uma rotina chamada várias vezes sem o `off` correspondente.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "A API essencial",
        colunas: ["Método", "O que faz"],
        linhas: [
          ["`on(evento, fn)` / `addListener`", "Registra um ouvinte, no fim da lista"],
          ["`once(evento, fn)`", "Registra um ouvinte que roda uma vez e se remove"],
          ["`emit(evento, ...args)`", "Chama os ouvintes na ordem, de forma síncrona, e devolve `true` se havia algum"],
          ["`off(evento, fn)` / `removeListener`", "Remove um ouvinte (a mesma referência de função)"],
          ["`prependListener(evento, fn)`", "Registra o ouvinte no começo da lista, para rodar primeiro"],
          ["`listenerCount(evento)`", "Diz quantos ouvintes o evento tem"],
          [
            "`events.once(emissor, evento)`",
            "Devolve uma `Promise` com os argumentos do evento, para usar com `await`",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Evento não é assíncrono por si só",
        texto:
          "`emit` executa os ouvintes **antes de retornar**. Um ouvinte lento trava quem emitiu, e o laço de eventos junto. Para adiar o trabalho, use `setImmediate`, `process.nextTick` ou entregue-o a uma fila (veja Q28). Dentro de um ouvinte escrito com `function`, `this` é o emissor; numa arrow function, não.",
      },
    ],
    armadilhas: [
      "Esquecer o ouvinte de `error`: o primeiro erro emitido derruba o processo.",
      "Achar que `emit` é assíncrono: os ouvintes rodam na hora, e um ouvinte pesado bloqueia o resto.",
      "Registrar ouvintes a cada requisição ou chamada sem removê-los: vazamento de memória e o `MaxListenersExceededWarning`.",
      "Usar arrow function e esperar que `this` seja o emissor, ou depender de uma ordem entre ouvintes sem explicitá-la com `prependListener`.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece com `emitter.emit('error', err)` se não há ouvinte de `error`?",
        resposta: "O erro é lançado. Se ninguém o capturar, vira uma exceção não tratada e o processo termina.",
      },
      {
        pergunta: "Os ouvintes de um `emit` rodam de forma síncrona ou assíncrona? Em que ordem?",
        resposta:
          "De forma síncrona, na ordem em que foram registrados (`prependListener` coloca um no começo). O `emit` só retorna depois que todos terminam.",
      },
      {
        pergunta: "Como esperar por um evento usando `await`?",
        resposta:
          "Com `events.once(emissor, 'nome')`, que devolve uma `Promise` resolvida com o array dos argumentos do evento (e rejeitada se ocorrer `error`).",
      },
    ],
  },
  en: {
    titulo: "EventEmitter",
    pergunta: "What does EventEmitter do in Node.js?",
    porqueEsteMetodo:
      "EventEmitter is a conversation between whoever emits and whoever listens. Following a single `emit` from start to finish, including the error paths, shows the order, the synchronous nature and the pitfalls.",
    resposta30s:
      "`EventEmitter` (from `node:events`) is the base class of Node’s event model: you register **listeners** with `on` and another piece of code triggers them with `emit`. Listeners run **synchronously, in the order they were registered**. Streams, `http.Server`, `net.Socket` and `process` inherit from it. An event named `error` with no listener **throws the exception** and can crash the process.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The path of an `emit('created', 42)`",
        etapas: [
          "`new Orders()` creates the emitter, which keeps a map from event name to list of listeners",
          "`on('created', A)` and `once('created', B)` join the list in that order; `once` stores a wrapper that removes itself",
          "`emit('created', 42)` takes a copy of the listener list for the `created` event",
          "It calls A(42) and waits for A to finish: everything is synchronous",
          "It calls B(42): the wrapper removes B from the list before running it",
          "`emit` returns `true` (there were listeners) and only then does the next line of code run",
          "A second `emit('created', 43)` calls only A; an event with no listeners at all returns `false`",
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same steps in code",
        legenda: "JavaScript",
        codigo: `import { EventEmitter, once } from "node:events";

class Orders extends EventEmitter {}
const orders = new Orders();

orders.on("created", (id) => console.log("A: order", id));
orders.once("created", (id) => console.log("B (first time only):", id));
orders.on("error", (err) => console.error("failed:", err.message));

console.log(orders.emit("created", 42)); // A, B and then true
console.log(orders.emit("created", 43)); // only A and then true
console.log(orders.emit("other")); // no listeners: false

orders.emit("error", new Error("out of stock")); // lands in the 'error' listener

setTimeout(() => orders.emit("ready", "ok"), 100);
const [message] = await once(orders, "ready"); // Promise that resolves on the first 'ready'
console.log(message); // "ok"`,
      },
      {
        tipo: "passos",
        titulo: "Now the path where something goes wrong",
        passos: [
          {
            titulo: "No listener for `error`",
            texto:
              "`emit('error', err)` throws the error itself. With no `try/catch` around, the process ends. Every emitter that can fail needs an `on('error', …)`.",
          },
          {
            titulo: "A listener throws",
            texto:
              "The exception travels up to whoever called `emit`, and the remaining listeners of that `emit` do not run. Each listener should handle its own errors.",
          },
          {
            titulo: "An `async` listener rejects",
            texto:
              "`emit` ignores the returned value, so the rejection becomes an unhandled promise. Catch inside the listener or use the emitter’s `captureRejections` option.",
          },
          {
            titulo: "Too many listeners on one event",
            texto:
              "Past 10 per event, Node prints `MaxListenersExceededWarning`. It is only a warning, but it nearly always points to a leak: an `on` inside a routine called many times without the matching `off`.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The essential API",
        colunas: ["Method", "What it does"],
        linhas: [
          ["`on(event, fn)` / `addListener`", "Registers a listener, at the end of the list"],
          ["`once(event, fn)`", "Registers a listener that runs once and removes itself"],
          [
            "`emit(event, ...args)`",
            "Calls the listeners in order, synchronously, and returns `true` if there were any",
          ],
          ["`off(event, fn)` / `removeListener`", "Removes a listener (the same function reference)"],
          ["`prependListener(event, fn)`", "Registers the listener at the start of the list, to run first"],
          ["`listenerCount(event)`", "Tells how many listeners the event has"],
          ["`events.once(emitter, event)`", "Returns a `Promise` with the event’s arguments, to use with `await`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Events are not asynchronous by themselves",
        texto:
          "`emit` runs the listeners **before returning**. A slow listener blocks whoever emitted, and the event loop with it. To defer the work, use `setImmediate`, `process.nextTick` or hand it to a queue (see Q28). Inside a listener written with `function`, `this` is the emitter; in an arrow function, it is not.",
      },
    ],
    armadilhas: [
      "Forgetting the `error` listener: the first emitted error brings the process down.",
      "Thinking `emit` is asynchronous: listeners run right away, and a heavy listener blocks everything else.",
      "Registering listeners on every request or call without removing them: a memory leak and `MaxListenersExceededWarning`.",
      "Using an arrow function and expecting `this` to be the emitter, or relying on an order between listeners without making it explicit with `prependListener`.",
    ],
    autoteste: [
      {
        pergunta: "What happens with `emitter.emit('error', err)` if there is no `error` listener?",
        resposta: "The error is thrown. If nobody catches it, it becomes an uncaught exception and the process ends.",
      },
      {
        pergunta: "Do the listeners of an `emit` run synchronously or asynchronously? In what order?",
        resposta:
          "Synchronously, in the order they were registered (`prependListener` puts one at the start). `emit` only returns after all of them finish.",
      },
      {
        pergunta: "How do you wait for an event using `await`?",
        resposta:
          "With `events.once(emitter, 'name')`, which returns a `Promise` resolved with the array of the event’s arguments (and rejected if `error` occurs).",
      },
    ],
  },
};
