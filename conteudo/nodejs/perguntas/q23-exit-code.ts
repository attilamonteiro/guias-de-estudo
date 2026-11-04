import type { Pergunta } from "../../tipos";

// Q23 · Exit code
export const q23: Pergunta = {
  numero: 23,
  modulo: "turing-intermediarias",
  metodo: "playbook",
  pt: {
    titulo: "Exit code",
    pergunta: "O que é a função exit code no Node.js?",
    porqueEsteMetodo:
      "Lidar bem com o código de saída é um procedimento com ordem: entender a convenção, escolher como encerrar, tratar sinais e falhas e testar o resultado. Um playbook evita o erro clássico de chamar `process.exit()` no meio do trabalho.",
    resposta30s:
      "O **exit code** (código de saída) não é uma função: é o **número que o processo devolve ao sistema operacional** ao terminar. **0** significa sucesso e **qualquer outro valor** significa falha, e é isso que shells, CI e orquestradores leem. No Node.js você o define com `process.exitCode = n` (o programa termina sozinho, sem pressa) ou com a função `process.exit(n)` (encerra na hora e pode **cortar escritas pendentes**).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: encerrar um programa Node.js do jeito certo",
        passos: [
          {
            titulo: "Entenda a convenção",
            texto:
              "Quem executou o programa lê o código: `$?` no bash, `$LASTEXITCODE` no PowerShell, `%ERRORLEVEL%` no cmd. **0** é sucesso, **diferente de 0** é erro. CI, scripts e orquestradores decidem “passou ou falhou” e “reiniciar ou não” por ele.",
          },
          {
            titulo: "Prefira `process.exitCode`",
            texto:
              "Atribua `process.exitCode = 1` e deixe o Node.js terminar sozinho quando não houver mais trabalho. Assim logs, arquivos e conexões em andamento são concluídos, e o código é aplicado no fim natural do processo.",
          },
          {
            titulo: "Use `process.exit(n)` com parcimônia",
            texto:
              "Só quando precisar parar imediatamente (falha fatal na inicialização, nada a preservar). Ele não espera o laço de eventos: escritas assíncronas em `stdout`, `stderr` ou arquivos podem ser cortadas.",
          },
          {
            titulo: "Encerre com elegância ao receber sinais",
            texto:
              "`SIGINT` (Ctrl+C) e `SIGTERM` (deploys e orquestradores): pare de aceitar trabalho novo (`server.close()`), termine o que está em andamento, feche banco e filas, defina `process.exitCode` e deixe o processo acabar. Ponha um tempo-limite de segurança.",
          },
          {
            titulo: "Trate falhas inesperadas",
            texto:
              "Em `uncaughtException` e `unhandledRejection`, registre o erro e saia com código diferente de 0, porque o estado do processo é incerto. Nas versões atuais, uma rejeição não tratada já derruba o processo por padrão (confira a documentação). Deixe um supervisor (systemd, Docker, PM2) reiniciar.",
          },
          {
            titulo: "Teste o código de saída",
            texto:
              "No terminal: `node app.js; echo $?`. Em testes automatizados, rode o programa com `spawnSync` (de `node:child_process`) e confira `status`. O evento `process.on('exit')` serve para um log final, mas só roda código síncrono.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Códigos que você vai encontrar",
        colunas: ["Código", "Significado", "Observação"],
        linhas: [
          ["0", "Sucesso", "Convenção universal; é o padrão quando o programa termina sem erro"],
          ["1", "Falha genérica", "Também é o que o Node.js usa quando uma exceção não é tratada"],
          [
            "9",
            "Argumento inválido",
            "Opção desconhecida, ou sem valor, passada ao próprio `node`; a lista completa está na documentação",
          ],
          ["128 + n", "Encerrado pelo sinal n", "Convenção de shells: 130 para SIGINT (Ctrl+C), 143 para SIGTERM"],
          [
            "Os seus",
            "Códigos próprios da aplicação",
            "Escolha poucos, documente no README e evite os que o Node.js já usa (referência comum: `sysexits.h`)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Encerramento gracioso e falha fatal",
        legenda: "JavaScript",
        codigo:
          "import { createServer } from 'node:http';\n\nconst servidor = createServer((req, res) => res.end('ok')).listen(3000);\n\nfunction encerrar(sinal) {\n  console.log('Recebi', sinal, '- encerrando');\n  // Rede de segurança: se algo travar, sai com erro depois de 10 s\n  setTimeout(() => process.exit(1), 10_000).unref();\n  servidor.close((erro) => {\n    process.exitCode = erro ? 1 : 0; // o processo termina sozinho\n  });\n}\n\nprocess.on('SIGINT', () => encerrar('SIGINT'));\nprocess.on('SIGTERM', () => encerrar('SIGTERM'));\n\nprocess.on('uncaughtException', (erro) => {\n  console.error('Falha fatal:', erro);\n  process.exit(1); // estado incerto: não siga em frente\n});",
        nota: "Em uma aplicação real, feche também banco de dados, filas e outros recursos antes de deixar o processo terminar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "process.exit() corta o que estiver pendente",
        texto:
          "`process.exit()` termina o processo na hora: não espera timers, respostas HTTP ainda sendo enviadas nem escritas assíncronas. Dependendo do sistema e de para onde a saída vai (arquivo, terminal ou pipe), parte do que foi impresso com `console.log` pode se perder. Por isso o padrão é `process.exitCode` e esperar o término natural; `process.exit()` fica como último recurso, depois de fechar o que importa.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Os três nomes",
        texto:
          "“Função exit code” junta três coisas: o **exit code** (o número devolvido ao sistema), a **função** `process.exit(código)` (encerra agora) e a **propriedade** `process.exitCode` (só guarda o número para quando o processo terminar sozinho).",
      },
    ],
    armadilhas: [
      "Chamar `process.exit(0)` logo depois de um `console.log` ou de uma escrita assíncrona e perder a saída.",
      "Sair com 0 depois de capturar um erro: o CI e o orquestrador enxergam sucesso onde houve falha.",
      "Continuar rodando depois de `uncaughtException`: o estado do processo é incerto; registre e encerre.",
      "Ignorar `SIGTERM`: o orquestrador espera um tempo e acaba derrubando o processo à força, com requisições em andamento.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `process.exitCode` e `process.exit()`?",
        resposta:
          "`process.exitCode` só define o código e deixa o processo terminar quando não houver mais trabalho; `process.exit()` encerra imediatamente e pode cortar escritas pendentes.",
      },
      {
        pergunta: "O que significa um exit code diferente de 0?",
        resposta:
          "Que o programa terminou com falha. Shells, CI e orquestradores usam isso para parar a esteira, reiniciar o processo ou alertar alguém.",
      },
    ],
  },
  en: {
    titulo: "Exit code",
    pergunta: "What is the exit code function in Node.js?",
    porqueEsteMetodo:
      "Handling the exit code well is an ordered procedure: understand the convention, choose how to stop, handle signals and failures, and test the result. A playbook prevents the classic mistake of calling `process.exit()` in the middle of the work.",
    resposta30s:
      "The **exit code** is not a function: it is the **number a process returns to the operating system** when it ends. **0** means success and **any other value** means failure, and that is what shells, CI and orchestrators read. In Node.js you set it with `process.exitCode = n` (the program ends on its own, without hurry) or with the function `process.exit(n)` (stops right away and can **cut off pending writes**).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: ending a Node.js program the right way",
        passos: [
          {
            titulo: "Understand the convention",
            texto:
              "Whoever ran the program reads the code: `$?` in bash, `$LASTEXITCODE` in PowerShell, `%ERRORLEVEL%` in cmd. **0** is success, **non-zero** is an error. CI, scripts and orchestrators decide “passed or failed” and “restart or not” from it.",
          },
          {
            titulo: "Prefer `process.exitCode`",
            texto:
              "Assign `process.exitCode = 1` and let Node.js end by itself when there is no more work. Logs, files and connections in flight finish, and the code is applied at the natural end of the process.",
          },
          {
            titulo: "Use `process.exit(n)` sparingly",
            texto:
              "Only when you must stop immediately (fatal failure at startup, nothing to preserve). It does not wait for the event loop: asynchronous writes to `stdout`, `stderr` or files can be cut off.",
          },
          {
            titulo: "Shut down gracefully on signals",
            texto:
              "`SIGINT` (Ctrl+C) and `SIGTERM` (deploys and orchestrators): stop accepting new work (`server.close()`), finish what is in flight, close the database and queues, set `process.exitCode` and let the process end. Add a safety timeout.",
          },
          {
            titulo: "Handle unexpected failures",
            texto:
              "In `uncaughtException` and `unhandledRejection`, log the error and exit with a non-zero code, because the process state is uncertain. In current versions, an unhandled rejection already brings the process down by default (check the documentation). Let a supervisor (systemd, Docker, PM2) restart it.",
          },
          {
            titulo: "Test the exit code",
            texto:
              "In the terminal: `node app.js; echo $?`. In automated tests, run the program with `spawnSync` (from `node:child_process`) and check `status`. The `process.on('exit')` event is fine for a final log, but it only runs synchronous code.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Codes you will meet",
        colunas: ["Code", "Meaning", "Note"],
        linhas: [
          ["0", "Success", "Universal convention; the default when the program ends without error"],
          ["1", "Generic failure", "Also what Node.js uses when an exception is not handled"],
          [
            "9",
            "Invalid argument",
            "An unknown option, or one missing its value, passed to `node` itself; the full list is in the documentation",
          ],
          ["128 + n", "Terminated by signal n", "Shell convention: 130 for SIGINT (Ctrl+C), 143 for SIGTERM"],
          [
            "Your own",
            "Application-specific codes",
            "Pick a few, document them in the README and avoid the ones Node.js already uses (a common reference: `sysexits.h`)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Graceful shutdown and fatal failure",
        legenda: "JavaScript",
        codigo:
          "import { createServer } from 'node:http';\n\nconst server = createServer((req, res) => res.end('ok')).listen(3000);\n\nfunction shutDown(signal) {\n  console.log('Received', signal, '- shutting down');\n  // Safety net: if something hangs, exit with an error after 10 s\n  setTimeout(() => process.exit(1), 10_000).unref();\n  server.close((error) => {\n    process.exitCode = error ? 1 : 0; // the process ends by itself\n  });\n}\n\nprocess.on('SIGINT', () => shutDown('SIGINT'));\nprocess.on('SIGTERM', () => shutDown('SIGTERM'));\n\nprocess.on('uncaughtException', (error) => {\n  console.error('Fatal failure:', error);\n  process.exit(1); // uncertain state: do not carry on\n});",
        nota: "In a real application, also close the database, queues and other resources before letting the process end.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "process.exit() cuts off whatever is pending",
        texto:
          "`process.exit()` ends the process on the spot: it does not wait for timers, HTTP responses still being sent or asynchronous writes. Depending on the system and on where the output goes (file, terminal or pipe), part of what was printed with `console.log` may be lost. That is why the default is `process.exitCode` and waiting for the natural end; `process.exit()` stays as a last resort, after closing what matters.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "The three names",
        texto:
          "“Exit code function” lumps together three things: the **exit code** (the number returned to the system), the **function** `process.exit(code)` (stops now) and the **property** `process.exitCode` (only stores the number for when the process ends on its own).",
      },
    ],
    armadilhas: [
      "Calling `process.exit(0)` right after a `console.log` or an asynchronous write and losing the output.",
      "Exiting with 0 after catching an error: CI and the orchestrator see success where there was a failure.",
      "Keeping on running after `uncaughtException`: the process state is uncertain; log it and exit.",
      "Ignoring `SIGTERM`: the orchestrator waits a while and ends up killing the process by force, with requests in flight.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `process.exitCode` and `process.exit()`?",
        resposta:
          "`process.exitCode` only sets the code and lets the process end when there is no more work; `process.exit()` stops immediately and can cut off pending writes.",
      },
      {
        pergunta: "What does a non-zero exit code mean?",
        resposta:
          "That the program ended with a failure. Shells, CI and orchestrators use it to stop the pipeline, restart the process or alert someone.",
      },
    ],
  },
};
