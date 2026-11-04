import type { Pergunta } from "../../tipos";

// L27 · nextTick, setImmediate e microtasks
export const l027: Pergunta = {
  numero: 127,
  modulo: "linkedin-assincrono",
  metodo: "trace",
  pt: {
    titulo: "nextTick, setImmediate e microtasks",
    pergunta: "Qual é a diferença entre process.nextTick() e setImmediate()?",
    porqueEsteMetodo:
      "A ordem de execução só fica clara quando você segue um script de verdade, passo a passo, por cada fila: código síncrono, `nextTick`, microtasks e fases do laço. O trace também mostra o caminho em que algo dá errado: o `nextTick` recursivo que prende o laço.",
    resposta30s:
      "`process.nextTick()` e as **microtasks** (`.then`, `await`, `queueMicrotask`) rodam **assim que o código atual termina**, antes de o event loop continuar, com o `nextTick` na frente; `setImmediate()` e `setTimeout()` agendam callbacks para **fases do laço** (check e timers). No módulo principal a ordem entre `setTimeout(fn, 0)` e `setImmediate` não é garantida, mas dentro de um callback de E/S o `setImmediate` vem sempre primeiro. Um `nextTick` recursivo nunca deixa o laço avançar (**starvation**).",
    blocos: [
      {
        tipo: "codigo",
        titulo: "O script e a saída esperada",
        legenda: "JavaScript (CommonJS)",
        codigo: [
          'const fs = require("node:fs");',
          "",
          'setTimeout(() => console.log("timeout"), 0);',
          'setImmediate(() => console.log("immediate"));',
          'process.nextTick(() => console.log("nextTick"));',
          'Promise.resolve().then(() => console.log("promise"));',
          'console.log("síncrono");',
          "",
          "fs.readFile(__filename, () => {",
          "  // aqui estamos dentro de um callback de E/S",
          '  setTimeout(() => console.log("E/S: timeout"), 0);',
          '  setImmediate(() => console.log("E/S: immediate"));',
          '  process.nextTick(() => console.log("E/S: nextTick"));',
          "});",
        ].join("\n"),
        nota: "Saída: `síncrono`, `nextTick`, `promise`; depois `timeout` e `immediate`, em ordem não garantida; mais adiante, vindo do callback de E/S, sempre `E/S: nextTick`, `E/S: immediate` e `E/S: timeout`, nessa ordem.",
      },
      {
        tipo: "passos",
        titulo: "Seguindo a execução",
        passos: [
          {
            titulo: "Código síncrono",
            texto:
              "Roda até o fim e imprime `síncrono`. Os outros quatro só foram registrados: o timer espera o prazo, o immediate entra na fila da fase check, o tick na fila do `nextTick` e a reação da promise na fila de microtasks.",
          },
          {
            titulo: "Fila do `nextTick`",
            texto: "Com a pilha vazia, o Node esvazia primeiro essa fila e imprime `nextTick`.",
          },
          {
            titulo: "Fila de microtasks",
            texto:
              "Em seguida, as reações de promise (`.then`, `await`, `queueMicrotask`): imprime `promise`. Se uma microtask agendar outro tick, o Node volta e repete até as duas filas esvaziarem.",
          },
          {
            titulo: "Primeira volta do laço",
            texto:
              "Passa pela fase timers (o `setTimeout(…, 0)` vale 1 ms e só dispara se esse tempo já tiver passado), por poll e por check, onde roda o `setImmediate`. Como o tempo de partida do processo varia, `timeout` e `immediate` podem sair em qualquer ordem no módulo principal.",
          },
          {
            titulo: "Dentro de um callback de E/S",
            texto:
              "O callback do `readFile` roda na fase poll, e a próxima fase é a check: sai `E/S: nextTick`, depois `E/S: immediate`, e só na volta seguinte, na fase timers, `E/S: timeout`. Aqui a ordem é garantida.",
          },
          {
            titulo: "O caminho que dá errado",
            texto:
              "Uma função que se reagenda com `process.nextTick(f)` mantém a fila do tick sempre cheia: o Node nunca termina de drená-la e o laço não chega a poll nem a timers. Nenhuma E/S é atendida e o processo parece travado, com a CPU em 100%. Com `setImmediate(f)` recursivo, o laço dá uma volta completa entre uma chamada e outra.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quem roda onde",
        colunas: ["Mecanismo", "Fila ou fase", "Quando roda", "Cuidado"],
        linhas: [
          [
            "`process.nextTick(fn)`",
            "Fila própria do Node, fora das fases do laço",
            "Logo depois da operação atual, antes das microtasks de promise em CommonJS e antes de o laço continuar",
            "Uso recursivo causa starvation",
          ],
          [
            "`.then`, `await`, `queueMicrotask(fn)`",
            "Fila de microtasks do V8",
            "Logo depois da fila do `nextTick`, e entre um callback e o próximo",
            "Também causa starvation se recursivo",
          ],
          [
            "`setTimeout(fn, 0)`",
            "Fase timers (macrotask)",
            "Quando o prazo mínimo de 1 ms vence e o laço chega à fase timers",
            "Ordem em relação ao immediate não é garantida no módulo principal",
          ],
          [
            "`setImmediate(fn)`",
            "Fase check (macrotask)",
            "Depois da fase poll da volta atual",
            "Dentro de callback de E/S, sempre antes de timers",
          ],
        ],
        nota: "“Macrotask” é o termo do JavaScript para os callbacks que o laço executa uma fase por vez (timers, E/S, immediate); a documentação do Node fala em fases (veja L8). O `nextTick` não é uma microtask de verdade: tem fila própria.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A ordem em uma frase",
        texto:
          "**Síncrono → `nextTick` → microtasks de promise → fases do laço** (timers, poll, check…). Entre um callback e o próximo, as filas de `nextTick` e de microtasks são drenadas de novo. Use `nextTick` para o que precisa acontecer **antes de o laço continuar** (por exemplo, garantir que um callback seja sempre assíncrono) e `setImmediate` para **ceder o laço** e continuar depois da E/S pendente. Os nomes parecem trocados, por razões históricas: o `nextTick` roda antes de qualquer fase, e o `setImmediate` roda na fase check da volta atual.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os exemplos assumem CommonJS",
        texto:
          'Em um módulo ES (`.mjs` ou `"type": "module"`), o próprio corpo do módulo já roda como uma tarefa de promise, e a ordem entre `nextTick` e `.then` pode se inverter: confira rodando na sua versão. A ordem de `setTimeout(0)` e `setImmediate` no módulo principal também nunca deve ser pressuposta. Para as fases em detalhe, veja L8; para promises, L24.',
      },
    ],
    armadilhas: [
      "Achar que `nextTick` significa “na próxima volta do laço”: ele roda antes de qualquer fase, e chamadas recursivas matam a E/S e os timers.",
      "Contar com a ordem entre `setTimeout(fn, 0)` e `setImmediate` no módulo principal: ela depende do tempo de inicialização do processo.",
      "Usar `nextTick` para “adiar trabalho pesado”: o que roda no tick ainda bloqueia o laço; para ceder o laço, use `setImmediate`.",
      "Misturar `nextTick` e promises sem lembrar a ordem das filas, e esquecer que ela muda em módulos ES.",
    ],
    autoteste: [
      {
        pergunta:
          "Em CommonJS, qual é a ordem de `console.log` síncrono, `process.nextTick`, `Promise.then`, `setTimeout(0)` e `setImmediate`?",
        resposta:
          "Primeiro o código síncrono, depois o `nextTick`, depois o `.then`; só então as fases do laço, em que `timeout` e `immediate` saem em ordem não garantida no módulo principal.",
      },
      {
        pergunta: "Por que o `setImmediate` vence o `setTimeout(0)` dentro de um callback de E/S?",
        resposta:
          "Porque o callback de E/S roda na fase poll, e a fase seguinte é a check, onde está o immediate. O timer só dispara na volta seguinte, quando o laço passa de novo pela fase timers.",
      },
    ],
  },
  en: {
    titulo: "nextTick, setImmediate and microtasks",
    pergunta: "What is the difference between process.nextTick() and setImmediate()?",
    porqueEsteMetodo:
      "The execution order only becomes clear when you follow a real script step by step through each queue: synchronous code, `nextTick`, microtasks and loop phases. The trace also shows the path where something goes wrong: the recursive `nextTick` that traps the loop.",
    resposta30s:
      "`process.nextTick()` and **microtasks** (`.then`, `await`, `queueMicrotask`) run **as soon as the current code finishes**, before the event loop continues, with `nextTick` going first; `setImmediate()` and `setTimeout()` schedule callbacks for **loop phases** (check and timers). In the main module the order between `setTimeout(fn, 0)` and `setImmediate` is not guaranteed, but inside an I/O callback `setImmediate` always comes first. A recursive `nextTick` never lets the loop move on (**starvation**).",
    blocos: [
      {
        tipo: "codigo",
        titulo: "The script and its expected output",
        legenda: "JavaScript (CommonJS)",
        codigo: [
          'const fs = require("node:fs");',
          "",
          'setTimeout(() => console.log("timeout"), 0);',
          'setImmediate(() => console.log("immediate"));',
          'process.nextTick(() => console.log("nextTick"));',
          'Promise.resolve().then(() => console.log("promise"));',
          'console.log("sync");',
          "",
          "fs.readFile(__filename, () => {",
          "  // here we are inside an I/O callback",
          '  setTimeout(() => console.log("I/O: timeout"), 0);',
          '  setImmediate(() => console.log("I/O: immediate"));',
          '  process.nextTick(() => console.log("I/O: nextTick"));',
          "});",
        ].join("\n"),
        nota: "Output: `sync`, `nextTick`, `promise`; then `timeout` and `immediate`, in no guaranteed order; later, from the I/O callback, always `I/O: nextTick`, `I/O: immediate` and `I/O: timeout`, in that order.",
      },
      {
        tipo: "passos",
        titulo: "Following the execution",
        passos: [
          {
            titulo: "Synchronous code",
            texto:
              "It runs to the end and prints `sync`. The other four were only registered: the timer waits for its deadline, the immediate joins the check phase queue, the tick joins the `nextTick` queue and the promise reaction joins the microtask queue.",
          },
          {
            titulo: "The `nextTick` queue",
            texto: "With the stack empty, Node drains this queue first and prints `nextTick`.",
          },
          {
            titulo: "The microtask queue",
            texto:
              "Next, the promise reactions (`.then`, `await`, `queueMicrotask`): it prints `promise`. If a microtask schedules another tick, Node goes back and repeats until both queues are empty.",
          },
          {
            titulo: "First turn of the loop",
            texto:
              "It goes through the timers phase (`setTimeout(…, 0)` counts as 1 ms and only fires if that time has already passed), then poll and check, where `setImmediate` runs. Since the process start-up time varies, `timeout` and `immediate` can come out in either order in the main module.",
          },
          {
            titulo: "Inside an I/O callback",
            texto:
              "The `readFile` callback runs in the poll phase, and the next phase is check: `I/O: nextTick` comes out, then `I/O: immediate`, and only on the following turn, in the timers phase, `I/O: timeout`. Here the order is guaranteed.",
          },
          {
            titulo: "The path where it goes wrong",
            texto:
              "A function that reschedules itself with `process.nextTick(f)` keeps the tick queue permanently full: Node never finishes draining it and the loop never reaches poll or timers. No I/O is served and the process looks frozen, with CPU at 100%. With a recursive `setImmediate(f)`, the loop makes a full turn between one call and the next.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What runs where",
        colunas: ["Mechanism", "Queue or phase", "When it runs", "Watch out"],
        linhas: [
          [
            "`process.nextTick(fn)`",
            "Node’s own queue, outside the loop phases",
            "Right after the current operation, before promise microtasks in CommonJS and before the loop continues",
            "Recursive use causes starvation",
          ],
          [
            "`.then`, `await`, `queueMicrotask(fn)`",
            "V8’s microtask queue",
            "Right after the `nextTick` queue, and between one callback and the next",
            "Also causes starvation if recursive",
          ],
          [
            "`setTimeout(fn, 0)`",
            "Timers phase (macrotask)",
            "When the 1 ms minimum delay expires and the loop reaches the timers phase",
            "Order relative to the immediate is not guaranteed in the main module",
          ],
          [
            "`setImmediate(fn)`",
            "Check phase (macrotask)",
            "After the poll phase of the current turn",
            "Inside an I/O callback, always before timers",
          ],
        ],
        nota: "“Macrotask” is the JavaScript term for the callbacks the loop runs one phase at a time (timers, I/O, immediate); the Node documentation talks about phases (see L8). `nextTick` is not a real microtask: it has its own queue.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The order in one sentence",
        texto:
          "**Synchronous → `nextTick` → promise microtasks → loop phases** (timers, poll, check…). Between one callback and the next, the `nextTick` and microtask queues are drained again. Use `nextTick` for what must happen **before the loop continues** (for example, making sure a callback is always asynchronous) and `setImmediate` to **yield the loop** and continue after pending I/O. The names look swapped, for historical reasons: `nextTick` runs before any phase, and `setImmediate` runs in the check phase of the current turn.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The examples assume CommonJS",
        texto:
          'In an ES module (`.mjs` or `"type": "module"`), the module body itself already runs as a promise job, and the order between `nextTick` and `.then` can flip: check by running it on your version. Never assume the order of `setTimeout(0)` and `setImmediate` in the main module either. For the phases in detail, see L8; for promises, L24.',
      },
    ],
    armadilhas: [
      "Thinking `nextTick` means “on the next turn of the loop”: it runs before any phase, and recursive calls starve I/O and timers.",
      "Relying on the order between `setTimeout(fn, 0)` and `setImmediate` in the main module: it depends on the process start-up time.",
      "Using `nextTick` to “postpone heavy work”: what runs in the tick still blocks the loop; to yield the loop, use `setImmediate`.",
      "Mixing `nextTick` and promises without remembering the queue order, and forgetting that it changes in ES modules.",
    ],
    autoteste: [
      {
        pergunta:
          "In CommonJS, what is the order of a synchronous `console.log`, `process.nextTick`, `Promise.then`, `setTimeout(0)` and `setImmediate`?",
        resposta:
          "Synchronous code first, then `nextTick`, then `.then`; only then the loop phases, where `timeout` and `immediate` come out in no guaranteed order in the main module.",
      },
      {
        pergunta: "Why does `setImmediate` beat `setTimeout(0)` inside an I/O callback?",
        resposta:
          "Because the I/O callback runs in the poll phase, and the next phase is check, where the immediate lives. The timer only fires on the following turn, when the loop goes through the timers phase again.",
      },
    ],
  },
};
