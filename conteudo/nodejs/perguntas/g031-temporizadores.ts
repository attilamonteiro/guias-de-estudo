import type { Pergunta } from "../../tipos";

// G31 · Temporizadores
export const g031: Pergunta = {
  numero: 631,
  modulo: "gist-intermediario",
  metodo: "feynman",
  pt: {
    titulo: "Temporizadores",
    pergunta: "Qual é a finalidade da função setTimeout?",
    porqueEsteMetodo:
      "Um temporizador é um conceito do dia a dia, e a intuição do timer da cozinha explica de graça a regra que mais confunde: o atraso é um mínimo, não uma garantia. Depois vêm o mecanismo real e o ponto em que a imagem para de valer.",
    resposta30s:
      "`setTimeout(fn, ms)` **agenda** a execução de `fn` **uma vez, depois de pelo menos `ms` milissegundos**, sem bloquear a thread: ela segue com o código e o callback roda na fase de timers do event loop. O atraso é um **mínimo**, não uma garantia: se a thread estiver ocupada, o callback espera. Ele faz parte da família de temporização do Node.js (`setInterval`, `setImmediate`, `clearTimeout`, `unref`, `timers/promises`), usada para timeouts, debounce, polling e backoff.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Você coloca uma massa no forno e programa o timer da cozinha para 20 minutos. Em vez de ficar olhando o forno, continua preparando outras coisas. O timer não faz nada além de tocar; quando toca, você só vai tirar a massa quando terminar o que tem nas mãos. Os 20 minutos são o tempo mínimo de espera, não a hora exata em que a massa sai do forno.",
        tecnico:
          "`setTimeout(fn, ms)` registra `fn` para rodar **uma vez, depois de pelo menos `ms` milissegundos**, e devolve na hora um objeto `Timeout`, que você passa a `clearTimeout` para cancelar. O Node não espera: a thread do JavaScript segue o código normal. Quando o prazo vence, o callback é executado na **fase de timers** do event loop (veja L08), mas só se a thread estiver livre. Um atraso menor que 1 é tratado como 1 ms.",
        limite:
          "O cozinheiro é um só: se ele está ocupado, o timer toca e ninguém atende, então um laço pesado de dois segundos atrasa todos os timers. E, ao contrário do timer da cozinha, um timer pendente **mantém o processo vivo**: o Node não encerra enquanto houver um à espera, a menos que você chame `unref()`.",
      },
      {
        tipo: "tabela",
        titulo: "A família de temporizadores do Node.js",
        colunas: ["Recurso", "O que faz", "Onde roda", "Cuidado"],
        linhas: [
          [
            "`setTimeout(fn, ms)`",
            "Roda `fn` uma vez, depois de pelo menos `ms`",
            "Fase de timers",
            "Cancele com `clearTimeout`; o atraso é um mínimo",
          ],
          [
            "`setInterval(fn, ms)`",
            "Roda `fn` repetidamente, a cada `ms` aproximados",
            "Fase de timers, a cada volta em que vence",
            "Cancele com `clearInterval`; atrasos não se compensam (deriva) e, com função assíncrona, execuções podem se sobrepor",
          ],
          [
            "`setImmediate(fn)`",
            "Roda `fn` assim que a fase de E/S da volta atual termina",
            "Fase check",
            "Não depende de tempo; cancele com `clearImmediate`",
          ],
          [
            "`process.nextTick(fn)`",
            "Roda `fn` assim que a operação atual termina, antes de o laço continuar",
            "Fila própria, fora das fases",
            "Não é um timer; recursão sem fim trava o laço (veja L27)",
          ],
          [
            "`timers/promises`",
            "Versões que devolvem promise (`setTimeout`, `setImmediate`) e um iterador assíncrono (`setInterval`)",
            "As mesmas fases dos equivalentes",
            "Aceitam `AbortSignal` para cancelar; use com `await`",
          ],
          [
            "`unref()` e `ref()`",
            "Métodos do objeto devolvido: com `unref()`, o timer deixa de manter o processo vivo",
            "Não muda a fase",
            "Ideal para tarefas de manutenção (heartbeat, limpeza); `ref()` desfaz",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Espera cancelável e timer que não segura o processo",
        legenda: "JavaScript",
        codigo: [
          'import { setTimeout as esperar } from "node:timers/promises";',
          "",
          "// batimento que não mantém o processo vivo",
          'const batida = setInterval(() => console.log("vivo"), 1000);',
          "batida.unref();",
          "",
          "// espera com await, cancelável por AbortSignal",
          "const ac = new AbortController();",
          'const tempo = esperar(5000, "passou", { signal: ac.signal });',
          "setTimeout(() => ac.abort(), 1500);",
          "",
          "try {",
          "  console.log(await tempo);",
          "} catch (erro) {",
          '  if (erro.name === "AbortError") console.log("espera cancelada");',
          "  else throw erro;",
          "}",
        ].join("\n"),
        nota: "Módulo ES, por causa do `await` no topo. Num processo ocioso, imprime `vivo` uma vez e depois `espera cancelada`, e o programa termina sozinho: o intervalo está com `unref()` e não há mais nada pendente. Sem o `unref()`, ele manteria o processo vivo para sempre.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O atraso é um mínimo, não uma promessa",
        texto:
          "`setTimeout(fn, 100)` significa “não antes de 100 ms”. Se a thread estiver ocupada, o callback atrasa; por isso timers servem para **prazos**, não para medir tempo com precisão (para medir, use `performance.now()`). `setTimeout(fn, 0)` não é imediato: roda depois do código atual, das filas de `nextTick` e de promises e quando a fase de timers chegar. E atrasos acima de 2147483647 ms (cerca de 24 dias) estouram o limite do Node e viram 1 ms.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Para que servem na prática",
        texto:
          "**Timeout** de uma operação (desistir se demorar demais), **debounce** (esperar um intervalo sem novos eventos antes de agir), **polling** (consultar de tempos em tempos) e **backoff** entre retentativas (esperas crescentes; veja L105). Em todos, guarde o objeto do timer e cancele-o quando não precisar mais: um timer esquecido mantém o callback e tudo o que ele referencia na memória.",
      },
    ],
    armadilhas: [
      "Achar que `setTimeout(fn, 0)` é imediato: o callback só roda depois do código atual terminar e de a fase de timers chegar.",
      "Esquecer de cancelar timers (`clearTimeout`, `clearInterval`): eles seguram o callback na memória e impedem o processo de terminar.",
      "Usar `setInterval` com função assíncrona: um atraso empurra os seguintes e execuções podem se sobrepor; prefira agendar o próximo `setTimeout` ao terminar a anterior.",
      "Passar um método como callback e perder o `this`: dentro do callback de um timer, `this` não é o objeto que você espera; use arrow function ou `bind`.",
    ],
    autoteste: [
      {
        pergunta: "Por que um `setTimeout(fn, 100)` pode executar `fn` bem depois de 100 ms?",
        resposta:
          "Porque 100 ms é só o mínimo. O callback roda na fase de timers e só quando a thread do JavaScript está livre; um laço pesado ou outros callbacks na frente o atrasam.",
      },
      {
        pergunta: "Como impedir que um timer longo mantenha o processo vivo?",
        resposta:
          "Chamando `unref()` no objeto devolvido: o timer continua agendado, mas deixa de contar como motivo para o processo continuar. `ref()` desfaz.",
      },
    ],
  },
  en: {
    titulo: "Timers",
    pergunta: "What is the purpose of setTimeout function?",
    porqueEsteMetodo:
      "A timer is an everyday concept, and the kitchen-timer intuition explains for free the rule that confuses people most: the delay is a minimum, not a guarantee. Then come the real mechanism and the point where the picture stops holding.",
    resposta30s:
      "`setTimeout(fn, ms)` **schedules** `fn` to run **once, after at least `ms` milliseconds**, without blocking the thread: it carries on with the code and the callback runs in the timers phase of the event loop. The delay is a **minimum**, not a guarantee: if the thread is busy, the callback waits. It is part of Node.js's timing family (`setInterval`, `setImmediate`, `clearTimeout`, `unref`, `timers/promises`), used for timeouts, debounce, polling and backoff.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "You put dough in the oven and set the kitchen timer for 20 minutes. Instead of staring at the oven, you keep preparing other things. The timer does nothing but ring; when it rings, you only take the dough out once you finish what you have in your hands. The 20 minutes are the minimum wait, not the exact time the dough comes out.",
        tecnico:
          "`setTimeout(fn, ms)` registers `fn` to run **once, after at least `ms` milliseconds**, and immediately returns a `Timeout` object, which you pass to `clearTimeout` to cancel. Node does not wait: the JavaScript thread goes on with the normal code. When the time is up, the callback runs in the **timers phase** of the event loop (see L08), but only if the thread is free. A delay smaller than 1 is treated as 1 ms.",
        limite:
          "There is only one cook: if he is busy, the timer rings and nobody answers, so a heavy two-second loop delays every timer. And unlike a kitchen timer, a pending timer **keeps the process alive**: Node does not exit while one is waiting, unless you call `unref()`.",
      },
      {
        tipo: "tabela",
        titulo: "The Node.js timer family",
        colunas: ["Feature", "What it does", "Where it runs", "Watch out"],
        linhas: [
          [
            "`setTimeout(fn, ms)`",
            "Runs `fn` once, after at least `ms`",
            "Timers phase",
            "Cancel with `clearTimeout`; the delay is a minimum",
          ],
          [
            "`setInterval(fn, ms)`",
            "Runs `fn` repeatedly, roughly every `ms`",
            "Timers phase, on each turn when it is due",
            "Cancel with `clearInterval`; delays are not compensated (drift) and, with an async function, runs can overlap",
          ],
          [
            "`setImmediate(fn)`",
            "Runs `fn` as soon as the I/O phase of the current turn ends",
            "Check phase",
            "Not time-based; cancel with `clearImmediate`",
          ],
          [
            "`process.nextTick(fn)`",
            "Runs `fn` as soon as the current operation ends, before the loop continues",
            "Its own queue, outside the phases",
            "Not a timer; endless recursion blocks the loop (see L27)",
          ],
          [
            "`timers/promises`",
            "Promise-returning versions (`setTimeout`, `setImmediate`) and an async iterator (`setInterval`)",
            "The same phases as their counterparts",
            "Accept an `AbortSignal` for cancellation; use with `await`",
          ],
          [
            "`unref()` and `ref()`",
            "Methods of the returned object: with `unref()`, the timer stops keeping the process alive",
            "Does not change the phase",
            "Ideal for housekeeping (heartbeat, cleanup); `ref()` undoes it",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A cancellable wait and a timer that does not hold the process",
        legenda: "JavaScript",
        codigo: [
          'import { setTimeout as wait } from "node:timers/promises";',
          "",
          "// heartbeat that does not keep the process alive",
          'const beat = setInterval(() => console.log("alive"), 1000);',
          "beat.unref();",
          "",
          "// await-style wait, cancellable through an AbortSignal",
          "const ac = new AbortController();",
          'const pause = wait(5000, "done", { signal: ac.signal });',
          "setTimeout(() => ac.abort(), 1500);",
          "",
          "try {",
          "  console.log(await pause);",
          "} catch (error) {",
          '  if (error.name === "AbortError") console.log("wait cancelled");',
          "  else throw error;",
          "}",
        ].join("\n"),
        nota: "An ES module, because of the top-level `await`. On an idle process, it prints `alive` once and then `wait cancelled`, and the program ends by itself: the interval has `unref()` and nothing else is pending. Without `unref()`, it would keep the process alive forever.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The delay is a minimum, not a promise",
        texto:
          "`setTimeout(fn, 100)` means “not before 100 ms”. If the thread is busy, the callback is late; that is why timers are for **deadlines**, not for measuring time precisely (to measure, use `performance.now()`). `setTimeout(fn, 0)` is not immediate: it runs after the current code, after the `nextTick` and promise queues, and when the timers phase arrives. And delays above 2147483647 ms (about 24 days) overflow Node's limit and become 1 ms.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "What they are for in practice",
        texto:
          "**Timeouts** for an operation (give up if it takes too long), **debounce** (wait for a quiet interval before acting), **polling** (check from time to time) and **backoff** between retries (growing waits; see L105). In all of them, keep the timer object and cancel it when you no longer need it: a forgotten timer keeps the callback and everything it references in memory.",
      },
    ],
    armadilhas: [
      "Thinking `setTimeout(fn, 0)` is immediate: the callback only runs after the current code finishes and the timers phase arrives.",
      "Forgetting to cancel timers (`clearTimeout`, `clearInterval`): they hold the callback in memory and keep the process from exiting.",
      "Using `setInterval` with an async function: one delay pushes the following ones and runs can overlap; prefer scheduling the next `setTimeout` when the previous run finishes.",
      "Passing a method as a callback and losing `this`: inside a timer callback, `this` is not the object you expect; use an arrow function or `bind`.",
    ],
    autoteste: [
      {
        pergunta: "Why can a `setTimeout(fn, 100)` run `fn` well after 100 ms?",
        resposta:
          "Because 100 ms is only the minimum. The callback runs in the timers phase and only when the JavaScript thread is free; a heavy loop or other callbacks ahead of it delay it.",
      },
      {
        pergunta: "How do you keep a long timer from keeping the process alive?",
        resposta:
          "By calling `unref()` on the returned object: the timer stays scheduled but no longer counts as a reason for the process to keep running. `ref()` undoes it.",
      },
    ],
  },
};
