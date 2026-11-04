import type { Pergunta } from "../../tipos";

// F61 · O evento exit do processo
export const f061: Pergunta = {
  numero: 461,
  modulo: "founditgulf-avancadas",
  metodo: "trace",
  pt: {
    titulo: "O evento exit do processo",
    pergunta: "O que é process.on(‘exit’) no Node.js?",
    porqueEsteMetodo:
      "O `exit` só se entende acompanhando como um processo termina: o fim normal, o `process.exit()`, a exceção e o sinal passam por caminhos diferentes, e em alguns o evento nem dispara. Um trace de cada saída mostra o que cabe no handler.",
    resposta30s:
      "O evento **`exit`** é emitido quando o processo está **prestes a terminar**, seja por `process.exit()` ou porque o laço de eventos esvaziou, e recebe o código de saída. O handler é **síncrono**: nada assíncrono roda depois dele. O **`beforeExit`** é outro evento, emitido só quando o laço esvazia e que ainda permite trabalho assíncrono. Nenhum dos dois dispara com `SIGKILL` ou com um sinal sem handler, então limpeza que exige E/S pertence ao tratamento de sinais e ao desligamento gracioso.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma saída normal, evento a evento",
        etapas: [
          "O script termina de executar e as filas de `process.nextTick` e de promises esvaziam",
          "Não restam timers, sockets nem E/S pendentes: o laço de eventos não tem mais trabalho",
          "O Node.js emite `beforeExit`: aqui ainda dá para agendar trabalho assíncrono (um novo timer, uma consulta), e se isso acontecer o laço volta a girar",
          "Quando o laço esvazia de novo, `beforeExit` é emitido outra vez; só quando um `beforeExit` não agenda nada o processo segue",
          "O Node.js emite `exit` com o código (`process.exitCode` ou 0): os ouvintes rodam de forma síncrona e o processo termina logo depois; um timer ou uma promise criada ali nunca roda",
        ],
        nota: "Um `beforeExit` que sempre agenda trabalho novo mantém o processo vivo para sempre: use uma condição para parar.",
      },
      {
        tipo: "tabela",
        titulo: "Quem dispara o quê, conforme a saída",
        colunas: ["Como o processo termina", "`beforeExit`", "`exit`", "Código"],
        linhas: [
          ["Fim normal: o laço esvazia", "Sim (de novo, se agendar trabalho)", "Sim", "`process.exitCode` ou 0"],
          ["`process.exit(2)`", "Não", "Sim, na hora e de forma síncrona", "2"],
          ["Exceção não tratada (sem `uncaughtException`)", "Não", "Sim", "Diferente de zero (normalmente 1)"],
          ["Sinal sem handler (`SIGTERM`, `SIGINT`)", "Não", "Não", "Morte pelo sinal"],
          ["`SIGKILL`, falta de memória fatal, queda da máquina", "Não", "Não", "Nenhum"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os dois eventos lado a lado",
        legenda: "JavaScript",
        codigo: [
          'process.on("beforeExit", (codigo) => {',
          "  // o laço esvaziou: ainda dá para agendar trabalho assíncrono",
          '  console.log("beforeExit", codigo);',
          "});",
          "",
          'process.on("exit", (codigo) => {',
          "  // só código síncrono: timers e promises daqui não rodam",
          '  console.log("exit", codigo);',
          '  setTimeout(() => console.log("nunca aparece"), 0);',
          "});",
          "",
          'console.log("fim do script");',
          "// Saída: fim do script / beforeExit 0 / exit 0",
          "// Com process.exit(2) no fim do script: fim do script / exit 2",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que cabe no handler de exit",
        texto:
          "Cabe o que é **síncrono e rápido**: um log (`console.log` ou `fs.writeSync`), liberar um recurso local (apagar um arquivo temporário com `fs.unlinkSync`) e ajustar `process.exitCode`. **Não cabe** fechar o banco, esvaziar uma fila ou responder requisições: isso é E/S e não terminaria. Esse trabalho pertence ao desligamento gracioso, disparado por `SIGTERM` e `SIGINT`, que para de aceitar trabalho, termina o que está em andamento e só então deixa o processo sair (veja L115 e T23).",
      },
    ],
    armadilhas: [
      "Fazer trabalho assíncrono no handler de `exit` (`await`, `setTimeout`, gravar no banco): nada disso roda.",
      "Contar com `exit` para todo fim de processo: `SIGKILL`, falta de memória e sinais sem handler matam sem disparar nenhum evento.",
      "Confundir `beforeExit` com `exit`: o primeiro só ocorre quando o laço esvazia (não com `process.exit()` nem com exceção) e pode repetir; agendar trabalho nele sem condição cria um laço infinito.",
      "Usar `process.exit()` no meio do programa para “terminar bem”: ele corta E/S pendente; prefira `process.exitCode` e deixe o laço esvaziar.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `beforeExit` e `exit`?",
        resposta:
          "O `beforeExit` é emitido quando o laço esvazia e permite agendar mais trabalho assíncrono; ele não ocorre com `process.exit()` nem com exceção. O `exit` é emitido quando o processo vai mesmo terminar, e o seu handler só pode ser síncrono.",
      },
      {
        pergunta: "Posso fechar a conexão com o banco, que é assíncrona, dentro do `exit`? Onde fazer isso?",
        resposta:
          "Não: o processo termina logo após os ouvintes síncronos, e o que for assíncrono é abandonado. Faça no desligamento gracioso, em handlers de `SIGTERM` e `SIGINT`, antes de o processo sair.",
      },
    ],
  },
  en: {
    titulo: "The process exit event",
    pergunta: "What is process.on(‘exit’) in Node.js?",
    porqueEsteMetodo:
      "`exit` only makes sense by following how a process ends: a normal finish, `process.exit()`, an exception and a signal take different paths, and in some of them the event never fires. A trace of each exit shows what fits in the handler.",
    resposta30s:
      "The **`exit`** event is emitted when the process is **about to end**, whether through `process.exit()` or because the event loop drained, and it receives the exit code. The handler is **synchronous**: nothing asynchronous runs after it. **`beforeExit`** is a different event, emitted only when the loop drains, and it still allows asynchronous work. Neither fires on `SIGKILL` or on a signal with no handler, so cleanup that needs I/O belongs to signal handling and graceful shutdown.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A normal exit, event by event",
        etapas: [
          "The script finishes running and the `process.nextTick` and promise queues drain",
          "No timers, sockets or I/O remain: the event loop has no more work",
          "Node.js emits `beforeExit`: here you can still schedule asynchronous work (a new timer, a query), and if you do, the loop spins again",
          "When the loop drains again, `beforeExit` is emitted once more; the process only moves on when a `beforeExit` schedules nothing",
          "Node.js emits `exit` with the code (`process.exitCode` or 0): the listeners run synchronously and the process ends right after; a timer or promise created there never runs",
        ],
        nota: "A `beforeExit` that always schedules new work keeps the process alive forever: use a condition to stop.",
      },
      {
        tipo: "tabela",
        titulo: "What fires what, depending on the exit",
        colunas: ["How the process ends", "`beforeExit`", "`exit`", "Code"],
        linhas: [
          ["Normal finish: the loop drains", "Yes (again, if it schedules work)", "Yes", "`process.exitCode` or 0"],
          ["`process.exit(2)`", "No", "Yes, immediately and synchronously", "2"],
          ["Unhandled exception (no `uncaughtException`)", "No", "Yes", "Non-zero (usually 1)"],
          ["Signal with no handler (`SIGTERM`, `SIGINT`)", "No", "No", "Death by the signal"],
          ["`SIGKILL`, fatal out-of-memory, machine failure", "No", "No", "None"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The two events side by side",
        legenda: "JavaScript",
        codigo: [
          'process.on("beforeExit", (code) => {',
          "  // the loop drained: you can still schedule asynchronous work",
          '  console.log("beforeExit", code);',
          "});",
          "",
          'process.on("exit", (code) => {',
          "  // synchronous code only: timers and promises here do not run",
          '  console.log("exit", code);',
          '  setTimeout(() => console.log("never shown"), 0);',
          "});",
          "",
          'console.log("end of script");',
          "// Output: end of script / beforeExit 0 / exit 0",
          "// With process.exit(2) at the end of the script: end of script / exit 2",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What fits in the exit handler",
        texto:
          "What fits is what is **synchronous and quick**: a log (`console.log` or `fs.writeSync`), freeing a local resource (deleting a temp file with `fs.unlinkSync`) and adjusting `process.exitCode`. What **does not fit** is closing the database, draining a queue or answering requests: that is I/O and would not finish. That work belongs to graceful shutdown, triggered by `SIGTERM` and `SIGINT`, which stops accepting work, finishes what is in flight and only then lets the process leave (see L115 and T23).",
      },
    ],
    armadilhas: [
      "Doing asynchronous work in the `exit` handler (`await`, `setTimeout`, writing to the database): none of it runs.",
      "Counting on `exit` for every way a process ends: `SIGKILL`, out-of-memory and signals with no handler kill without firing any event.",
      "Confusing `beforeExit` with `exit`: the first only happens when the loop drains (not on `process.exit()` or an exception) and can repeat; scheduling work in it with no condition creates an infinite loop.",
      "Using `process.exit()` in the middle of the program to “finish cleanly”: it cuts pending I/O; prefer `process.exitCode` and let the loop drain.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `beforeExit` and `exit`?",
        resposta:
          "`beforeExit` is emitted when the loop drains and allows scheduling more asynchronous work; it does not happen on `process.exit()` or an exception. `exit` is emitted when the process is really about to end, and its handler can only be synchronous.",
      },
      {
        pergunta: "Can I close the database connection, which is asynchronous, inside `exit`? Where should I do it?",
        resposta:
          "No: the process ends right after the synchronous listeners, and anything asynchronous is abandoned. Do it in graceful shutdown, in `SIGTERM` and `SIGINT` handlers, before the process leaves.",
      },
    ],
  },
};
