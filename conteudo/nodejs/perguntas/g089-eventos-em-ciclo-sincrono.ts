import type { Pergunta } from "../../tipos";

// G89 · Eventos em ciclo (síncrono)
export const g089: Pergunta = {
  numero: 689,
  modulo: "gist-codigo",
  metodo: "trace",
  pt: {
    titulo: "Eventos em ciclo (síncrono)",
    pergunta:
      "Explique o resultado desta execução de código: três listeners de um EventEmitter em ciclo (event1 → event2 → event3 → event1), cada um registra uma mensagem e emite o próximo evento de forma síncrona; em seguida o código emite event1.",
    porqueEsteMetodo:
      "O resultado só fica óbvio quando você acompanha a pilha de chamadas, um listener de cada vez, até o ponto em que ela não aguenta mais. Seguir essa execução, e depois trocar apenas a forma de emitir, mostra por que três ciclos quase idênticos terminam de três maneiras diferentes.",
    resposta30s:
      "`emit` é **síncrono**: chama os listeners na hora, dentro da pilha de chamadas, e só retorna depois que todos terminam. O programa imprime `event1`, `event2`, `event3`, `event1`… e, como nenhuma chamada retorna, a pilha só cresce até **`RangeError: Maximum call stack size exceeded`**, que sobe por todos os `emit` e derruba o processo se ninguém tratar. Com `setImmediate`, a pilha não cresce, mas o ciclo roda para sempre (outros eventos ainda passam); com `process.nextTick`, o laço nem avança (starvation).",
    blocos: [
      {
        tipo: "codigo",
        titulo: "O ciclo de três eventos",
        legenda: "JavaScript",
        codigo: [
          'import { EventEmitter } from "node:events";',
          "",
          "const e = new EventEmitter();",
          "",
          'e.on("event1", () => { console.log("event1"); e.emit("event2"); });',
          'e.on("event2", () => { console.log("event2"); e.emit("event3"); });',
          'e.on("event3", () => { console.log("event3"); e.emit("event1"); });',
          "",
          'e.emit("event1");',
        ].join("\n"),
        nota: 'Para as variantes, troque cada `e.emit("eventN")` por `setImmediate(() => e.emit("eventN"))` ou por `process.nextTick(() => e.emit("eventN"))`. Nada mais muda.',
      },
      {
        tipo: "passos",
        titulo: "Seguindo a versão síncrona",
        passos: [
          {
            titulo: "O primeiro `emit`",
            texto:
              '`e.emit("event1")` chama o listener de `event1` na hora. Ele imprime `event1` e chama `e.emit("event2")`. O primeiro `emit` ainda não retornou: está esperando o listener terminar.',
          },
          {
            titulo: "A pilha cresce",
            texto:
              'O listener de `event2` imprime `event2` e chama `emit("event3")`; o de `event3` imprime `event3` e chama `emit("event1")`. Voltamos ao primeiro listener, mas agora com mais seis quadros empilhados (três listeners e três `emit`) e nenhum deles terminou.',
          },
          {
            titulo: "Nada retorna",
            texto:
              "Cada listener só termina depois do `emit` que ele mesmo chamou, e o ciclo não tem condição de parada. A saída continua `event1`, `event2`, `event3`, `event1`… e a pilha só aumenta.",
          },
          {
            titulo: "A pilha estoura",
            texto:
              "Ao atingir o limite de profundidade do motor, o V8 lança `RangeError: Maximum call stack size exceeded`. Em qual linha isso acontece, e depois de quantas voltas, varia com o tamanho da pilha e a plataforma: não conte com um número fixo.",
          },
          {
            titulo: "A exceção desmonta tudo",
            texto:
              "`emit` não captura exceções dos listeners: o erro sobe por todos os quadros até o código que fez o primeiro `emit`. Sem `try/catch`, é uma exceção não tratada: o Node imprime o erro e encerra o processo com código diferente de zero. Nada depois desse `emit` chega a rodar.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "As três variantes (G89, G90 e G91)",
        colunas: [
          "Como emite o próximo evento",
          "Onde o próximo listener roda",
          "Pilha",
          "Saída esperada",
          "Efeito no resto do programa",
        ],
        linhas: [
          [
            "`emit` direto (síncrono)",
            "Na hora, dentro da pilha atual",
            "Cresce a cada volta",
            "`event1`, `event2`, `event3`… até `RangeError: Maximum call stack size exceeded`",
            "O processo cai (sem tratamento). Nada mais roda: a pilha nunca esvazia",
          ],
          [
            "`setImmediate`",
            "Na fase check da próxima volta do laço",
            "Não cresce: cada callback começa com a pilha vazia",
            "`event1`, `event2`, `event3`, `event1`… sem erro e sem fim",
            "O programa nunca termina e usa CPU o tempo todo, mas timers e E/S ainda andam entre as voltas",
          ],
          [
            "`process.nextTick`",
            "Na fila do tick, esvaziada antes de o laço avançar",
            "Não cresce: um tick por vez, com a pilha vazia",
            "`event1`, `event2`, `event3`, `event1`… sem erro e sem fim",
            "Starvation: o laço não avança, então timers, E/S e `setImmediate` nunca rodam. O crescimento de memória depende do destino da saída e da plataforma: meça antes de afirmar",
          ],
        ],
        nota: "Para a ordem entre `nextTick`, microtasks e fases do laço, veja L27 e L08; para o `nextTick` recursivo, veja F99.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra por trás do resultado",
        texto:
          "`emit` **chama os listeners na hora, na ordem em que foram registrados, e só retorna depois que todos terminam** (veja T61). Um ciclo síncrono é, portanto, uma recursão sem condição de parada. `setImmediate` e `nextTick` só mudam **quando** o próximo listener roda, e com isso o jeito como o ciclo falha: a pilha deixa de estourar, mas o ciclo continua infinito. O conserto de verdade é desenhar uma condição de parada (um contador, um estado) ou rever o desenho que pede eventos em círculo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Sem erro” não quer dizer “saudável”",
        texto:
          "Trocar para `setImmediate` troca um erro claro (`RangeError`) por um processo que gira sem parar e consome CPU; com `process.nextTick`, ele ainda congela o resto do programa. Nenhum dos dois é um conserto: se um ciclo de eventos é intencional, ele precisa de limite. Use `setImmediate` quando quiser **ceder o laço** entre uma etapa e outra de um trabalho finito, e não para esconder uma recursão infinita.",
      },
    ],
    armadilhas: [
      "Achar que `emit` é assíncrono ou enfileira os listeners: ele chama cada um na hora, dentro da pilha de quem emitiu.",
      "Contar com um `try/catch` em volta do primeiro `emit` para se recuperar de um estouro de pilha: o estado do programa já é incerto.",
      "Trocar por `setImmediate` e dar o problema por resolvido: a pilha deixa de estourar, mas o ciclo continua infinito e consome CPU.",
      "Usar `process.nextTick` para “quebrar a recursão”: a fila do tick é esvaziada antes de o laço avançar, então timers e E/S nunca rodam (starvation).",
    ],
    autoteste: [
      {
        pergunta: "Por que a versão síncrona termina com `RangeError` em vez de rodar para sempre?",
        resposta:
          "Porque cada `emit` só retorna depois que o listener termina, e cada listener chama o próximo `emit`: as chamadas se empilham sem nunca retornar, até o limite da pilha.",
      },
      {
        pergunta: "Qual é a diferença visível entre as versões com `setImmediate` e com `process.nextTick`?",
        resposta:
          "Com `setImmediate`, um `setTimeout` de 1 segundo ainda dispara entre as voltas do ciclo. Com `process.nextTick`, o laço nunca avança, então esse timer não dispara e nenhuma E/S é atendida.",
      },
    ],
  },
  en: {
    titulo: "Cyclic events (synchronous)",
    pergunta:
      "Explain the result of this code execution: three EventEmitter listeners in a cycle (event1 → event2 → event3 → event1), each logging a message and emitting the next event synchronously, then the code emits event1.",
    porqueEsteMetodo:
      "The result only becomes obvious when you follow the call stack, one listener at a time, to the point where it gives up. Tracing this run, and then changing only how the next event is emitted, shows why three almost identical cycles end in three different ways.",
    resposta30s:
      "`emit` is **synchronous**: it calls the listeners right away, on the call stack, and only returns after they all finish. The program prints `event1`, `event2`, `event3`, `event1`… and, since no call ever returns, the stack just grows until **`RangeError: Maximum call stack size exceeded`**, which climbs through every `emit` and takes the process down if nobody handles it. With `setImmediate`, the stack does not grow, but the cycle runs forever (other events still get through); with `process.nextTick`, the loop does not even advance (starvation).",
    blocos: [
      {
        tipo: "codigo",
        titulo: "The three-event cycle",
        legenda: "JavaScript",
        codigo: [
          'import { EventEmitter } from "node:events";',
          "",
          "const e = new EventEmitter();",
          "",
          'e.on("event1", () => { console.log("event1"); e.emit("event2"); });',
          'e.on("event2", () => { console.log("event2"); e.emit("event3"); });',
          'e.on("event3", () => { console.log("event3"); e.emit("event1"); });',
          "",
          'e.emit("event1");',
        ].join("\n"),
        nota: 'For the variants, replace each `e.emit("eventN")` with `setImmediate(() => e.emit("eventN"))` or with `process.nextTick(() => e.emit("eventN"))`. Nothing else changes.',
      },
      {
        tipo: "passos",
        titulo: "Following the synchronous version",
        passos: [
          {
            titulo: "The first `emit`",
            texto:
              '`e.emit("event1")` calls the `event1` listener right away. It prints `event1` and calls `e.emit("event2")`. The first `emit` has not returned yet: it is waiting for the listener to finish.',
          },
          {
            titulo: "The stack grows",
            texto:
              'The `event2` listener prints `event2` and calls `emit("event3")`; the `event3` one prints `event3` and calls `emit("event1")`. We are back at the first listener, but now with six more frames stacked up (three listeners and three `emit` calls) and none of them has finished.',
          },
          {
            titulo: "Nothing returns",
            texto:
              "Each listener only finishes after the `emit` it called itself, and the cycle has no stopping condition. The output keeps going `event1`, `event2`, `event3`, `event1`… and the stack only gets taller.",
          },
          {
            titulo: "The stack overflows",
            texto:
              "On reaching the engine's depth limit, V8 throws `RangeError: Maximum call stack size exceeded`. On which line that happens, and after how many laps, varies with the stack size and the platform: do not count on a fixed number.",
          },
          {
            titulo: "The exception unwinds everything",
            texto:
              "`emit` does not catch exceptions from listeners: the error climbs through every frame up to the code that made the first `emit`. Without `try/catch`, it is an uncaught exception: Node prints the error and ends the process with a non-zero exit code. Nothing after that `emit` ever runs.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The three variants (G89, G90 and G91)",
        colunas: [
          "How the next event is emitted",
          "Where the next listener runs",
          "Stack",
          "Expected output",
          "Effect on the rest of the program",
        ],
        linhas: [
          [
            "Direct `emit` (synchronous)",
            "Right away, on the current stack",
            "Grows on every lap",
            "`event1`, `event2`, `event3`… until `RangeError: Maximum call stack size exceeded`",
            "The process crashes (if unhandled). Nothing else runs: the stack never empties",
          ],
          [
            "`setImmediate`",
            "In the check phase of the next loop turn",
            "Does not grow: every callback starts with an empty stack",
            "`event1`, `event2`, `event3`, `event1`… with no error and no end",
            "The program never ends and uses CPU all the time, but timers and I/O still progress between turns",
          ],
          [
            "`process.nextTick`",
            "In the tick queue, drained before the loop advances",
            "Does not grow: one tick at a time, with an empty stack",
            "`event1`, `event2`, `event3`, `event1`… with no error and no end",
            "Starvation: the loop does not advance, so timers, I/O and `setImmediate` never run. Whether memory grows depends on where the output goes and on the platform: measure before claiming",
          ],
        ],
        nota: "For the order between `nextTick`, microtasks and loop phases, see L27 and L08; for recursive `nextTick`, see F99.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule behind the result",
        texto:
          "`emit` **calls the listeners right away, in the order they were registered, and only returns after they all finish** (see T61). A synchronous cycle is therefore a recursion with no stopping condition. `setImmediate` and `nextTick` only change **when** the next listener runs, and with it how the cycle fails: the stack stops overflowing, but the cycle stays infinite. The real fix is to design a stopping condition (a counter, a state) or to rethink the design that asks for events in a circle.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“No error” does not mean “healthy”",
        texto:
          "Switching to `setImmediate` swaps a clear error (`RangeError`) for a process that spins forever burning CPU; with `process.nextTick`, it still freezes the rest of the program. Neither is a fix: if an event cycle is intentional, it needs a limit. Use `setImmediate` when you want to **yield the loop** between steps of finite work, not to hide an infinite recursion.",
      },
    ],
    armadilhas: [
      "Thinking `emit` is asynchronous or queues the listeners: it calls each one right away, on the stack of whoever emitted.",
      "Counting on a `try/catch` around the first `emit` to recover from a stack overflow: the program's state is already uncertain.",
      "Switching to `setImmediate` and calling the problem solved: the stack stops overflowing, but the cycle stays infinite and burns CPU.",
      "Using `process.nextTick` to “break the recursion”: the tick queue is drained before the loop advances, so timers and I/O never run (starvation).",
    ],
    autoteste: [
      {
        pergunta: "Why does the synchronous version end with `RangeError` instead of running forever?",
        resposta:
          "Because each `emit` only returns after the listener finishes, and each listener calls the next `emit`: the calls pile up without ever returning, until the stack limit.",
      },
      {
        pergunta: "What is the visible difference between the `setImmediate` and `process.nextTick` versions?",
        resposta:
          "With `setImmediate`, a 1-second `setTimeout` still fires between laps of the cycle. With `process.nextTick`, the loop never advances, so that timer does not fire and no I/O is served.",
      },
    ],
  },
};
