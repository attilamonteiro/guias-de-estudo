import type { Pergunta } from "../../tipos";

// F36 · process.exit() x process.kill()
export const f036: Pergunta = {
  numero: 436,
  modulo: "founditgulf-basicas-2",
  metodo: "compare",
  pt: {
    titulo: "process.exit() x process.kill()",
    pergunta: "Qual é a diferença entre process.exit() e process.kill()?",
    porqueEsteMetodo:
      "Os nomes enganam: um parece “terminar” e o outro “matar”, mas fazem coisas de naturezas diferentes. Uma matriz lado a lado separa quem age, sobre quem e com que chance de limpeza, e a regra de decisão mostra qual usar.",
    resposta30s:
      "O **`process.exit(código)`** encerra o **próprio processo**, na hora e de forma síncrona: dispara o evento `exit` e abandona o que estava pendente. O **`process.kill(pid, sinal)`** só **envia um sinal** a **qualquer processo** (inclusive ele mesmo); o padrão é `SIGTERM`, e o efeito depende de o destino tratar o sinal. “Kill” não significa necessariamente matar: `SIGTERM` pode ser tratado, `SIGKILL` não, e o sinal `0` só testa se o processo existe.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "process.exit() x process.kill(), critério a critério",
        colunas: ["Critério", "`process.exit(código)`", "`process.kill(pid, sinal)`"],
        linhas: [
          [
            "Quem é afetado",
            "Sempre o próprio processo",
            "Qualquer processo que você tenha permissão de sinalizar, inclusive o próprio (`process.pid`)",
          ],
          [
            "O que faz",
            "Encerra agora, de forma síncrona: dispara `exit` e não retorna",
            "Só **envia** um sinal (padrão `SIGTERM`); quem decide o que acontece é o destino",
          ],
          [
            "Dá chance de limpeza?",
            "Só aos ouvintes síncronos de `exit`; o laço de eventos não roda mais",
            "`SIGTERM` e `SIGINT` podem ser tratados (`process.on`); `SIGKILL` e `SIGSTOP` não",
          ],
          [
            "E/S e tarefas pendentes",
            "Abandonadas: timers, requisições e até escritas em `stdout`/`stderr` podem ser cortados",
            "Dependem do destino: com um handler ele pode terminar o que faz; com `SIGKILL`, tudo é cortado",
          ],
          [
            "Código de saída",
            "Você escolhe (`código`); sem argumento usa `process.exitCode` ou 0 (veja T23)",
            "Definido pelo handler do destino; morte direta por sinal costuma aparecer como 128 mais o número do sinal nos shells",
          ],
          [
            "Sinal `0`",
            "Não se aplica",
            "Não envia nada: só testa se o processo existe e se você pode sinalizá-lo; lança erro se não",
          ],
          [
            "Windows",
            "Funciona igual",
            "Suporte limitado: os sinais são emulados e os comuns terminam o destino sem rodar handler",
          ],
        ],
        nota: "Existe uma alternativa mais gentil ao `exit`: definir `process.exitCode` e deixar o laço de eventos esvaziar, para que o que já foi iniciado termine.",
      },
      {
        tipo: "codigo",
        titulo: "Sinal para si mesmo e teste de existência",
        legenda: "JavaScript",
        codigo: [
          "// Recebe o pedido de desligamento (não vale para SIGKILL)",
          'process.on("SIGTERM", () => {',
          '  console.log("SIGTERM recebido: encerrando com calma");',
          "  process.exitCode = 0; // sai quando o laço de eventos esvaziar",
          "});",
          "",
          "function existe(pid) {",
          "  try {",
          "    process.kill(pid, 0); // sinal 0: não envia nada, só testa",
          "    return true;",
          "  } catch (erro) {",
          '    return erro.code === "EPERM"; // existe, mas sem permissão',
          "  }",
          "}",
          "",
          "console.log(existe(process.pid)); // true",
          'process.kill(process.pid, "SIGTERM"); // sinal para si mesmo: o handler roda',
        ].join("\n"),
        nota: "No Windows, o sinal enviado a si mesmo termina o processo sem passar pelo handler. Para o que o Node.js suporta por plataforma, veja “Signal events” na documentação em nodejs.org.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "`exit` é “eu termino a mim mesmo, agora”; `kill` é “envio um sinal a alguém (talvez a mim) e quem recebe decide”. Para finalizar o seu programa, prefira `process.exitCode` e deixe o laço esvaziar; use `process.exit()` no fim de uma CLI, depois de logar o erro, e quando a limpeza já tiver acabado. Para pedir desligamento a **outro** processo, mande `SIGTERM` primeiro e deixe `SIGKILL` para quem não responde (encerramento gracioso: veja L115).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O nome promete mais do que entrega",
        texto:
          "`process.kill` pode não matar nada (um sinal tratado, ou o `0`), e `process.exit` não é um desligamento gracioso: ele **corta** escritas pendentes e conexões abertas. Num servidor, pare de aceitar conexões (`server.close()`), termine o que está em andamento e só então saia. Chamar `process.exit()` logo depois de gravar um log grande ou de responder a uma requisição é a forma clássica de perder dados.",
      },
    ],
    armadilhas: [
      "Chamar `process.exit()` com gravações ou respostas pendentes: o processo sai antes de a E/S terminar e os dados somem.",
      "Achar que `process.kill(pid)` sempre mata: o `SIGTERM` padrão pode ser tratado ou ignorado pelo destino, e só o `SIGKILL` é incontornável.",
      "Usar `process.kill(pid, 0)` e esquecer que `EPERM` significa que o processo existe, mas você não pode sinalizá-lo.",
      "Contar com handlers de sinal no Windows como no Linux: o suporte é limitado e os sinais são emulados.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `process.exit()` e `process.exitCode`?",
        resposta:
          "O `process.exit()` encerra na hora e abandona o que estiver pendente. O `process.exitCode` só define o código e deixa o processo terminar sozinho quando o laço de eventos esvaziar, o que preserva E/S em andamento.",
      },
      {
        pergunta: "O que faz `process.kill(pid, 0)`?",
        resposta:
          "Não envia sinal nenhum: testa se o processo existe e se você tem permissão de sinalizá-lo. Se não existir, lança erro (`ESRCH`); sem permissão, `EPERM`.",
      },
    ],
  },
  en: {
    titulo: "process.exit() vs process.kill()",
    pergunta: "What is the difference between process.exit() and process.kill()?",
    porqueEsteMetodo:
      "The names mislead: one sounds like “finish” and the other like “kill”, but they do things of a different nature. A side-by-side matrix separates who acts, on whom and with what chance of cleanup, and the decision rule says which to use.",
    resposta30s:
      "**`process.exit(code)`** ends **its own process**, right away and synchronously: it fires the `exit` event and abandons whatever was pending. **`process.kill(pid, signal)`** only **sends a signal** to **any process** (including itself); the default is `SIGTERM`, and the effect depends on whether the target handles the signal. “Kill” does not necessarily mean kill: `SIGTERM` can be handled, `SIGKILL` cannot, and signal `0` only tests whether the process exists.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "process.exit() vs process.kill(), criterion by criterion",
        colunas: ["Criterion", "`process.exit(code)`", "`process.kill(pid, signal)`"],
        linhas: [
          [
            "Who is affected",
            "Always the process itself",
            "Any process you are allowed to signal, including itself (`process.pid`)",
          ],
          [
            "What it does",
            "Ends now, synchronously: fires `exit` and does not return",
            "Only **sends** a signal (default `SIGTERM`); the target decides what happens",
          ],
          [
            "Chance to clean up?",
            "Only the synchronous `exit` listeners; the event loop no longer runs",
            "`SIGTERM` and `SIGINT` can be handled (`process.on`); `SIGKILL` and `SIGSTOP` cannot",
          ],
          [
            "Pending I/O and tasks",
            "Abandoned: timers, requests and even writes to `stdout`/`stderr` can be cut off",
            "Depends on the target: with a handler it can finish what it is doing; with `SIGKILL`, everything is cut",
          ],
          [
            "Exit code",
            "You choose (`code`); with no argument it uses `process.exitCode` or 0 (see T23)",
            "Set by the target’s handler; a direct death by signal usually shows up in shells as 128 plus the signal number",
          ],
          [
            "Signal `0`",
            "Not applicable",
            "Sends nothing: only tests whether the process exists and whether you may signal it; throws if not",
          ],
          [
            "Windows",
            "Works the same",
            "Limited support: signals are emulated and the common ones terminate the target without running a handler",
          ],
        ],
        nota: "There is a gentler alternative to `exit`: set `process.exitCode` and let the event loop drain, so what was already started can finish.",
      },
      {
        tipo: "codigo",
        titulo: "A signal to yourself and an existence check",
        legenda: "JavaScript",
        codigo: [
          "// Receives the shutdown request (does not apply to SIGKILL)",
          'process.on("SIGTERM", () => {',
          '  console.log("SIGTERM received: shutting down gently");',
          "  process.exitCode = 0; // exits when the event loop drains",
          "});",
          "",
          "function exists(pid) {",
          "  try {",
          "    process.kill(pid, 0); // signal 0: sends nothing, only tests",
          "    return true;",
          "  } catch (error) {",
          '    return error.code === "EPERM"; // exists, but no permission',
          "  }",
          "}",
          "",
          "console.log(exists(process.pid)); // true",
          'process.kill(process.pid, "SIGTERM"); // a signal to yourself: the handler runs',
        ].join("\n"),
        nota: "On Windows, a signal sent to yourself ends the process without going through the handler. For what Node.js supports on each platform, see “Signal events” in the documentation on nodejs.org.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "`exit` is “I end myself, now”; `kill` is “I send a signal to someone (maybe myself) and the receiver decides”. To finish your own program, prefer `process.exitCode` and let the loop drain; use `process.exit()` at the end of a CLI, after logging the error, and when cleanup is already done. To ask **another** process to shut down, send `SIGTERM` first and keep `SIGKILL` for what does not respond (graceful shutdown: see L115).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The name promises more than it delivers",
        texto:
          "`process.kill` may kill nothing (a handled signal, or `0`), and `process.exit` is not a graceful shutdown: it **cuts off** pending writes and open connections. In a server, stop accepting connections (`server.close()`), finish what is in flight and only then exit. Calling `process.exit()` right after writing a large log or answering a request is the classic way to lose data.",
      },
    ],
    armadilhas: [
      "Calling `process.exit()` with pending writes or responses: the process leaves before the I/O finishes and the data is lost.",
      "Thinking `process.kill(pid)` always kills: the default `SIGTERM` can be handled or ignored by the target, and only `SIGKILL` is unavoidable.",
      "Using `process.kill(pid, 0)` and forgetting that `EPERM` means the process exists but you may not signal it.",
      "Counting on signal handlers on Windows as on Linux: support is limited and signals are emulated.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `process.exit()` and `process.exitCode`?",
        resposta:
          "`process.exit()` ends right away and abandons whatever is pending. `process.exitCode` only sets the code and lets the process finish on its own when the event loop drains, which preserves in-flight I/O.",
      },
      {
        pergunta: "What does `process.kill(pid, 0)` do?",
        resposta:
          "It sends no signal at all: it tests whether the process exists and whether you may signal it. If it does not exist it throws (`ESRCH`); without permission, `EPERM`.",
      },
    ],
  },
};
