import type { Pergunta } from "../../tipos";

// F63 · Processo zumbi
export const f063: Pergunta = {
  numero: 463,
  modulo: "founditgulf-avancadas",
  metodo: "feynman",
  pt: {
    titulo: "Processo zumbi",
    pergunta: "O que é um processo zumbi? Ele pode ocorrer no Node.js?",
    porqueEsteMetodo:
      "O zumbi é um processo morto que ainda aparece numa lista, e a imagem de um registro não retirado explica o porquê. Com ela fica fácil separar zumbi de órfão e entender por que o Node.js quase não os gera, mas pode herdá-los num contêiner.",
    resposta30s:
      "Um **processo zumbi** é um processo que **já terminou**, mas cuja entrada continua na tabela do sistema operacional porque o **pai não leu o status de saída**. No Node.js é raro: o **libuv recolhe** os filhos criados com `child_process`. Ele costuma aparecer quando o Node.js roda como **PID 1 num contêiner** e herda processos que não conhece; o remédio é um **init mínimo** (`--init`, `tini`). Não confunda com **órfão**, que está vivo e sem pai.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa certidão de óbito que ninguém retirou. A pessoa (o processo filho) já morreu e não faz mais nada, mas o cartório (o sistema operacional) guarda o registro com o resultado, o código de saída, até o responsável (o processo pai) vir buscá-lo. Enquanto ninguém busca, o registro continua na fila e o número do documento (o PID) segue ocupado.",
        tecnico:
          "Nos sistemas Unix, quando um processo termina, o sistema libera a memória e os arquivos dele, mas mantém uma entrada mínima na tabela de processos (PID e status de saída) até o pai chamar `wait`. Entre o fim e esse recolhimento o filho está no estado **zumbi** (`Z`, ou `<defunct>`, no `ps`). O Node.js recolhe os filhos criados por `child_process` (`spawn`, `exec`, `execFile`, `fork`): o libuv acompanha o término de cada um, e é daí que vem o evento `exit`, com código e sinal. Por isso os zumbis gerados pelo próprio Node.js são raros. Eles surgem, sobretudo, em **contêineres em que o Node.js é o PID 1**: um processo iniciado por um filho (o “neto”) perde o pai, é adotado pelo PID 1, e o Node.js, que não sabe que ele existe, nunca o recolhe.",
        limite:
          "O registro pronto quase não custa nada ao cartório, só ocupa a fila: o zumbi gasta pouquíssima memória e nenhuma CPU, mas ocupa um **PID**, e a tabela é finita. Também não adianta “matar” o zumbi, porque ele já está morto: só o pai o recolhe, ou a morte do pai o entrega ao init. E o Windows não tem esse conceito.",
      },
      {
        tipo: "tabela",
        titulo: "Zumbi, órfão e filho desacoplado",
        colunas: ["Estado", "O processo está vivo?", "E o pai?", "O que acontece"],
        linhas: [
          [
            "Zumbi (`Z`, `<defunct>`)",
            "Não: já terminou",
            "Vivo, mas ainda não leu o status de saída",
            "Só ocupa uma entrada na tabela de processos; some quando o pai recolhe o status ou termina",
          ],
          [
            "Órfão",
            "Sim, executando",
            "Já terminou",
            "O init (PID 1) o adota; segue normal e é recolhido pelo init quando terminar",
          ],
          [
            "Filho desacoplado (`detached`)",
            "Sim",
            "Pode terminar antes, de propósito",
            "Roda em grupo de processos próprio e pode sobreviver ao pai; vira órfão adotado pelo init",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Filho comum e filho desacoplado",
        legenda: "JavaScript",
        codigo: [
          'import { spawn } from "node:child_process";',
          "",
          "// Filho comum: ao terminar, o libuv recolhe o status e não sobra zumbi",
          'const filho = spawn(process.execPath, ["--version"]);',
          'filho.on("exit", (codigo, sinal) => console.log("filho saiu", codigo, sinal));',
          "",
          "// Filho desacoplado: pode sobreviver ao pai (vira órfão, adotado pelo init)",
          'const servico = spawn(process.execPath, ["servico.js"], { detached: true, stdio: "ignore" });',
          "servico.unref(); // o pai não espera por ele para terminar",
        ].join("\n"),
        nota: "Com `detached` e `unref()`, o pai pode terminar sem esperar o filho; quando o filho terminar, quem o recolhe é o init.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Zumbi em contêiner: o problema do PID 1",
        texto:
          "Num contêiner, o processo principal é o PID 1, que tem uma função especial: adotar e recolher órfãos, coisa que o Node.js não faz. Se a aplicação inicia programas (um navegador headless, `sh -c ...`, uma ferramenta de linha de comando) e eles criam os seus próprios filhos, os que terminam sem ter pai que os recolha se acumulam como zumbis. Para enxergar, rode `ps -eo pid,ppid,stat,cmd` e procure o estado `Z`. Para corrigir, use um init mínimo como PID 1 (`docker run --init` ou `tini` na imagem). Como PID 1, o Node.js também não encerra com `SIGTERM` sem handler (veja L115).",
      },
    ],
    armadilhas: [
      "Achar que o zumbi consome CPU ou memória: quase nada; o dano é ocupar PIDs, e uma tabela cheia impede novos processos.",
      "Tentar matar o zumbi com `kill -9`: ele já morreu; é preciso que o pai o recolha (ou que o pai termine).",
      "Confundir zumbi com órfão: o zumbi está morto e tem pai que não o recolheu; o órfão está vivo e perdeu o pai.",
      "Achar que `child_process` deixa zumbis por padrão: o libuv recolhe os filhos diretos; os zumbis vêm de netos, de processos herdados no PID 1 ou de código nativo.",
    ],
    autoteste: [
      {
        pergunta: "Por que um processo criado com `child_process.spawn` normalmente não vira zumbi no Node.js?",
        resposta:
          "Porque o libuv acompanha o término de cada filho que o Node.js criou e recolhe o status de saída, que é o que dispara o evento `exit`. Sem o recolhimento do pai, o processo morto continuaria como zumbi.",
      },
      {
        pergunta: "Em que situação surgem zumbis num contêiner com Node.js e como evitá-los?",
        resposta:
          "Quando o Node.js é o PID 1 e adota processos órfãos (netos) que ele não conhece e nunca recolhe. Evita-se com um init mínimo como PID 1 (`docker run --init` ou `tini`).",
      },
    ],
  },
  en: {
    titulo: "Zombie process",
    pergunta: "What is a Zombie Process? Can it occur in Node.js?",
    porqueEsteMetodo:
      "A zombie is a dead process that still shows up in a list, and the image of an uncollected record explains why. With it, it is easy to tell a zombie from an orphan and to see why Node.js rarely produces them but can inherit them in a container.",
    resposta30s:
      "A **zombie process** is one that has **already terminated** but whose entry stays in the operating system’s table because the **parent never read the exit status**. In Node.js it is rare: **libuv reaps** the children created with `child_process`. It usually appears when Node.js runs as **PID 1 in a container** and inherits processes it does not know about; the remedy is a **minimal init** (`--init`, `tini`). Do not confuse it with an **orphan**, which is alive and has no parent.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a death certificate nobody has collected. The person (the child process) has already died and does nothing anymore, but the registry office (the operating system) keeps the record with the outcome, the exit code, until the responsible party (the parent process) comes to pick it up. While nobody does, the record stays in the queue and the document number (the PID) remains taken.",
        tecnico:
          "On Unix systems, when a process ends, the system frees its memory and files but keeps a minimal entry in the process table (PID and exit status) until the parent calls `wait`. Between the end and that collection the child is in the **zombie** state (`Z`, or `<defunct>`, in `ps`). Node.js reaps the children created by `child_process` (`spawn`, `exec`, `execFile`, `fork`): libuv tracks the end of each one, and that is where the `exit` event, with code and signal, comes from. That is why zombies generated by Node.js itself are rare. They show up mostly in **containers where Node.js is PID 1**: a process started by a child (the “grandchild”) loses its parent, is adopted by PID 1, and Node.js, which does not know it exists, never reaps it.",
        limite:
          "The finished record costs the registry almost nothing, it only takes a place in line: a zombie uses very little memory and no CPU, but it holds a **PID**, and the table is finite. There is also no point in “killing” a zombie, because it is already dead: only the parent can collect it, or the parent’s death hands it to init. And Windows has no such concept.",
      },
      {
        tipo: "tabela",
        titulo: "Zombie, orphan and detached child",
        colunas: ["State", "Is the process alive?", "And the parent?", "What happens"],
        linhas: [
          [
            "Zombie (`Z`, `<defunct>`)",
            "No: it already ended",
            "Alive, but has not read the exit status yet",
            "Only holds an entry in the process table; it goes away when the parent collects the status or ends",
          ],
          [
            "Orphan",
            "Yes, running",
            "Already ended",
            "Init (PID 1) adopts it; it carries on normally and init collects it when it ends",
          ],
          [
            "Detached child (`detached`)",
            "Yes",
            "May end first, on purpose",
            "Runs in its own process group and can outlive the parent; it becomes an orphan adopted by init",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ordinary child and detached child",
        legenda: "JavaScript",
        codigo: [
          'import { spawn } from "node:child_process";',
          "",
          "// Ordinary child: when it ends, libuv collects the status and no zombie is left",
          'const child = spawn(process.execPath, ["--version"]);',
          'child.on("exit", (code, signal) => console.log("child exited", code, signal));',
          "",
          "// Detached child: it can outlive the parent (becomes an orphan, adopted by init)",
          'const service = spawn(process.execPath, ["service.js"], { detached: true, stdio: "ignore" });',
          "service.unref(); // the parent does not wait for it to finish",
        ].join("\n"),
        nota: "With `detached` and `unref()`, the parent can end without waiting for the child; when the child ends, init is the one that collects it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Zombies in a container: the PID 1 problem",
        texto:
          "In a container, the main process is PID 1, which has a special job: adopting and reaping orphans, something Node.js does not do. If the application starts programs (a headless browser, `sh -c ...`, a command-line tool) and they create children of their own, those that end without a parent to reap them pile up as zombies. To see them, run `ps -eo pid,ppid,stat,cmd` and look for state `Z`. To fix it, use a minimal init as PID 1 (`docker run --init` or `tini` in the image). As PID 1, Node.js also does not exit on `SIGTERM` without a handler (see L115).",
      },
    ],
    armadilhas: [
      "Thinking a zombie consumes CPU or memory: almost nothing; the harm is holding PIDs, and a full table prevents new processes.",
      "Trying to kill a zombie with `kill -9`: it is already dead; the parent has to collect it (or the parent has to end).",
      "Confusing a zombie with an orphan: the zombie is dead and has a parent that did not collect it; the orphan is alive and lost its parent.",
      "Thinking `child_process` leaves zombies by default: libuv reaps direct children; zombies come from grandchildren, from processes inherited by PID 1 or from native code.",
    ],
    autoteste: [
      {
        pergunta: "Why does a process created with `child_process.spawn` normally not become a zombie in Node.js?",
        resposta:
          "Because libuv tracks the end of each child Node.js created and collects the exit status, which is what fires the `exit` event. Without the parent collecting it, the dead process would remain a zombie.",
      },
      {
        pergunta: "In what situation do zombies appear in a Node.js container and how do you avoid them?",
        resposta:
          "When Node.js is PID 1 and adopts orphaned processes (grandchildren) it does not know about and never reaps. You avoid it with a minimal init as PID 1 (`docker run --init` or `tini`).",
      },
    ],
  },
};
