import type { Pergunta } from "../../tipos";

// L08 · Fases do event loop
export const l008: Pergunta = {
  numero: 108,
  modulo: "linkedin-fundamentos",
  metodo: "trace",
  pt: {
    titulo: "Fases do event loop",
    pergunta: "Quais são as fases do event loop?",
    porqueEsteMetodo:
      "As fases só fazem sentido em movimento. Seguir um pequeno programa por uma volta do laço mostra onde cada callback roda, por que `setImmediate` vence `setTimeout` dentro de uma E/S e onde entram `process.nextTick` e as promises.",
    resposta30s:
      "Cada volta do event loop do Node.js (implementado pelo libuv) passa por seis etapas, nesta ordem: **timers**, **pending callbacks**, **idle/prepare**, **poll**, **check** e **close callbacks**. Os timers rodam `setTimeout` e `setInterval` vencidos, o **poll** recolhe e executa callbacks de E/S e o **check** roda os `setImmediate`. Entre um callback e o próximo, o Node esvazia a fila de `process.nextTick` e depois a de **microtasks** (promises).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma volta do laço, na ordem",
        etapas: [
          "**Timers**: roda os callbacks de `setTimeout` e `setInterval` cujo prazo já venceu",
          "**Pending callbacks**: roda alguns callbacks de sistema adiados da volta anterior (por exemplo, certos erros de TCP)",
          "**Idle, prepare**: uso interno do libuv; não há nada para programar aqui",
          "**Poll**: recolhe novos eventos de E/S (sockets, arquivos) e executa os seus callbacks; sem nada urgente, o laço espera aqui",
          "**Check**: roda os callbacks de `setImmediate`, logo depois do poll",
          "**Close callbacks**: roda os callbacks de fechamento, como o `close` de um socket",
        ],
        nota: "Nas versões atuais do Node.js, entre um callback e o seguinte o Node esvazia primeiro a fila de `process.nextTick` e depois a de microtasks (`.then`, `await`). Elas não são fases: são filas esvaziadas entre os callbacks. Sem nada pendente em nenhuma fase, o laço termina e o processo sai.",
      },
      {
        tipo: "codigo",
        titulo: "Um ciclo com timer, immediate, E/S e as duas filas",
        legenda: "ordem.cjs",
        codigo: [
          'const { readFile } = require("node:fs");',
          "",
          'setTimeout(() => console.log("timeout"), 0);',
          'setImmediate(() => console.log("immediate"));',
          'process.nextTick(() => console.log("nextTick"));',
          'Promise.resolve().then(() => console.log("promise"));',
          "",
          "readFile(__filename, () => {",
          '  console.log("E/S pronta");',
          '  setTimeout(() => console.log("timeout dentro da E/S"), 0);',
          '  setImmediate(() => console.log("immediate dentro da E/S"));',
          '  process.nextTick(() => console.log("nextTick dentro da E/S"));',
          '  Promise.resolve().then(() => console.log("promise dentro da E/S"));',
          "});",
          'console.log("script");',
        ].join("\n"),
        nota: "Saída típica: `script`, `nextTick`, `promise`, `timeout`, `immediate`, `E/S pronta`, `nextTick dentro da E/S`, `promise dentro da E/S`, `immediate dentro da E/S`, `timeout dentro da E/S`. No arquivo principal, a ordem entre `timeout` e `immediate` não é garantida. Num ES Module, no nível superior, a promise sai antes do `nextTick` (veja L27).",
      },
      {
        tipo: "passos",
        titulo: "Seguindo o código acima por uma volta e meia",
        passos: [
          {
            titulo: "O script termina",
            texto:
              "Todo o arquivo roda até o fim e imprime `script`. Ele agendou um timer, um immediate, um `nextTick`, uma promise e uma leitura de arquivo, que foi entregue ao pool de threads do libuv (veja T43).",
          },
          {
            titulo: "As filas esvaziam primeiro",
            texto:
              "Com a pilha vazia e antes de o laço começar, o Node esvazia `process.nextTick` e depois as microtasks: saem `nextTick` e `promise`.",
          },
          {
            titulo: "Primeira volta",
            texto:
              "Timers: se pelo menos 1 ms já passou, sai `timeout`; se não, ele fica para a volta seguinte. Poll: a leitura ainda não terminou e, como há um `setImmediate` pendente, o laço não espera. Check: sai `immediate`.",
          },
          {
            titulo: "O arquivo chega",
            texto:
              "Numa volta seguinte, a leitura termina no pool e o **poll** executa o callback: sai `E/S pronta`, depois o `nextTick` e a promise de dentro dele. O callback agenda mais um timer e mais um immediate.",
          },
          {
            titulo: "Do poll direto para o check",
            texto:
              "Terminado o poll, o laço segue para o **check**: sai `immediate dentro da E/S`. O timer só é visto na fase de timers da volta seguinte: sai `timeout dentro da E/S`. Sem mais nada pendente, o processo termina.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Para lembrar a ordem",
        texto:
          "**Timers → poll (E/S) → check (`setImmediate`)**. O poll é o ponto de espera: o laço dorme até o próximo timer ou evento de E/S, mas não dorme se houver um `setImmediate` agendado. Por isso, depois de uma E/S, o check vem antes de a volta voltar aos timers, e `setImmediate` sai primeiro dentro de um callback de E/S.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando algo dá errado",
        texto:
          "O laço só avança quando o callback atual termina. Um cálculo longo, ou um `process.nextTick` que se reagenda sem parar, impede que o laço chegue às outras fases: timers atrasam e a E/S fica sem ser lida (esse último caso se chama starvation; veja L27). Um callback pesado atrasa **todas** as fases, não só a dele.",
      },
    ],
    armadilhas: [
      "Achar que `setTimeout(fn, 0)` roda na hora: o mínimo é cerca de 1 ms e ele só dispara na fase de timers, quando a thread estiver livre.",
      "Contar `process.nextTick` e promises como fases do laço: são filas esvaziadas entre os callbacks, não etapas.",
      "Supor que `setTimeout(0)` e `setImmediate` têm ordem fixa no arquivo principal: não têm. Só dentro de um callback de E/S o `setImmediate` sempre vem primeiro.",
      "Colocar trabalho pesado em qualquer callback: ele bloqueia todas as fases e atrasa timers e E/S de todos os usuários.",
    ],
    autoteste: [
      {
        pergunta: "Em que fases rodam os callbacks de `setImmediate` e os callbacks de E/S?",
        resposta:
          "Os callbacks de E/S (arquivos, sockets) rodam na fase **poll**; os de `setImmediate`, na fase **check**, logo depois do poll.",
      },
      {
        pergunta:
          "Dentro de um callback de leitura de arquivo, o que sai primeiro: `setTimeout(fn, 0)` ou `setImmediate(fn)`? Por quê?",
        resposta:
          "O `setImmediate`. Depois do poll vem direto o check; o timer só é visto na fase de timers da volta seguinte.",
      },
    ],
  },
  en: {
    titulo: "Event loop phases",
    pergunta: "What are the phases of the event loop?",
    porqueEsteMetodo:
      "The phases only make sense in motion. Following a small program through one turn of the loop shows where each callback runs, why `setImmediate` beats `setTimeout` inside an I/O callback and where `process.nextTick` and promises fit in.",
    resposta30s:
      "Each turn of the Node.js event loop (implemented by libuv) goes through six stages, in this order: **timers**, **pending callbacks**, **idle/prepare**, **poll**, **check** and **close callbacks**. Timers run expired `setTimeout` and `setInterval` callbacks, **poll** collects and runs I/O callbacks and **check** runs `setImmediate` callbacks. Between one callback and the next, Node drains the `process.nextTick` queue and then the **microtask** queue (promises).",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One turn of the loop, in order",
        etapas: [
          "**Timers**: runs the `setTimeout` and `setInterval` callbacks whose delay has expired",
          "**Pending callbacks**: runs some system callbacks deferred from the previous turn (for example, certain TCP errors)",
          "**Idle, prepare**: internal to libuv; there is nothing to program here",
          "**Poll**: collects new I/O events (sockets, files) and runs their callbacks; with nothing urgent, the loop waits here",
          "**Check**: runs `setImmediate` callbacks, right after poll",
          "**Close callbacks**: runs closing callbacks, such as a socket’s `close`",
        ],
        nota: "In current Node.js versions, between one callback and the next Node first drains the `process.nextTick` queue and then the microtask queue (`.then`, `await`). They are not phases: they are queues drained between callbacks. With nothing pending in any phase, the loop ends and the process exits.",
      },
      {
        tipo: "codigo",
        titulo: "One cycle with a timer, an immediate, I/O and both queues",
        legenda: "order.cjs",
        codigo: [
          'const { readFile } = require("node:fs");',
          "",
          'setTimeout(() => console.log("timeout"), 0);',
          'setImmediate(() => console.log("immediate"));',
          'process.nextTick(() => console.log("nextTick"));',
          'Promise.resolve().then(() => console.log("promise"));',
          "",
          "readFile(__filename, () => {",
          '  console.log("I/O ready");',
          '  setTimeout(() => console.log("timeout inside I/O"), 0);',
          '  setImmediate(() => console.log("immediate inside I/O"));',
          '  process.nextTick(() => console.log("nextTick inside I/O"));',
          '  Promise.resolve().then(() => console.log("promise inside I/O"));',
          "});",
          'console.log("script");',
        ].join("\n"),
        nota: "Typical output: `script`, `nextTick`, `promise`, `timeout`, `immediate`, `I/O ready`, `nextTick inside I/O`, `promise inside I/O`, `immediate inside I/O`, `timeout inside I/O`. In the main file, the order between `timeout` and `immediate` is not guaranteed. In an ES Module, at the top level, the promise prints before `nextTick` (see L27).",
      },
      {
        tipo: "passos",
        titulo: "Following the code above for a turn and a half",
        passos: [
          {
            titulo: "The script finishes",
            texto:
              "The whole file runs to the end and prints `script`. It scheduled a timer, an immediate, a `nextTick`, a promise and a file read, which was handed to the libuv thread pool (see T43).",
          },
          {
            titulo: "The queues drain first",
            texto:
              "With an empty call stack and before the loop starts, Node drains `process.nextTick` and then the microtasks: `nextTick` and `promise` print.",
          },
          {
            titulo: "First turn",
            texto:
              "Timers: if at least 1 ms has passed, `timeout` prints; if not, it waits for the next turn. Poll: the read has not finished and, since a `setImmediate` is pending, the loop does not wait. Check: `immediate` prints.",
          },
          {
            titulo: "The file arrives",
            texto:
              "On a later turn, the read finishes in the pool and **poll** runs the callback: `I/O ready` prints, then the `nextTick` and the promise inside it. The callback schedules one more timer and one more immediate.",
          },
          {
            titulo: "From poll straight to check",
            texto:
              "When poll is done, the loop moves on to **check**: `immediate inside I/O` prints. The timer is only seen in the timers phase of the next turn: `timeout inside I/O` prints. With nothing else pending, the process ends.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "To remember the order",
        texto:
          "**Timers → poll (I/O) → check (`setImmediate`)**. Poll is the waiting point: the loop sleeps until the next timer or I/O event, but it does not sleep if a `setImmediate` is scheduled. That is why, after an I/O event, check comes before the loop gets back to timers, and `setImmediate` prints first inside an I/O callback.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When something goes wrong",
        texto:
          "The loop only moves on when the current callback finishes. A long calculation, or a `process.nextTick` that keeps rescheduling itself, keeps the loop from reaching the other phases: timers run late and I/O goes unread (the latter is called starvation; see L27). One heavy callback delays **every** phase, not just its own.",
      },
    ],
    armadilhas: [
      "Thinking `setTimeout(fn, 0)` runs right away: the minimum is about 1 ms and it only fires in the timers phase, once the thread is free.",
      "Counting `process.nextTick` and promises as phases of the loop: they are queues drained between callbacks, not stages.",
      "Assuming `setTimeout(0)` and `setImmediate` have a fixed order in the main file: they do not. Only inside an I/O callback does `setImmediate` always come first.",
      "Putting heavy work in any callback: it blocks every phase and delays timers and I/O for all users.",
    ],
    autoteste: [
      {
        pergunta: "In which phases do `setImmediate` callbacks and I/O callbacks run?",
        resposta:
          "I/O callbacks (files, sockets) run in the **poll** phase; `setImmediate` callbacks run in the **check** phase, right after poll.",
      },
      {
        pergunta: "Inside a file-read callback, which prints first: `setTimeout(fn, 0)` or `setImmediate(fn)`? Why?",
        resposta:
          "`setImmediate`. Check comes straight after poll; the timer is only seen in the timers phase of the next turn.",
      },
    ],
  },
};
