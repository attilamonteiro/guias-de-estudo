import type { Pergunta } from "../../tipos";

// Q58 · child_process
export const q58: Pergunta = {
  numero: 58,
  modulo: "turing-avancadas",
  metodo: "compare",
  pt: {
    titulo: "child_process",
    pergunta: "O que é o módulo child_process no Node.js?",
    porqueEsteMetodo:
      "O módulo oferece quatro funções parecidas que se distinguem por poucos detalhes (shell, saída, canal de mensagens). Uma matriz lado a lado mostra o que cada uma faz e a regra de decisão diz qual escolher.",
    resposta30s:
      "`child_process` é o módulo nativo para **criar processos do sistema operacional** a partir do Node: rodar comandos, programas externos ou outros scripts Node. `spawn` entrega a saída em **stream**; `exec` roda um comando **num shell** e devolve a saída em **buffer**; `execFile` executa um arquivo direto, sem shell; `fork` abre outro processo Node com um **canal de mensagens**. O cuidado central: texto de usuário em `exec` é **injeção de comando**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As quatro funções",
        colunas: ["Função", "Como funciona", "Saída", "Use quando"],
        linhas: [
          [
            "`spawn(cmd, args)`",
            "Inicia o programa direto, sem shell por padrão; argumentos em array",
            "Em stream (`stdout`, `stderr`), sem limite de tamanho",
            "A saída é grande ou contínua, ou o processo é longo (ffmpeg, um servidor, logs)",
          ],
          [
            "`exec(comando)`",
            "Passa uma string para um shell, que interpreta pipes, `&&` e variáveis",
            "Em buffer: chega inteira no callback, com limite (`maxBuffer`)",
            "Um comando de shell curto, de texto fixo, com saída pequena",
          ],
          [
            "`execFile(arquivo, args)`",
            "Como `spawn` na execução (sem shell), mas com o resultado em callback",
            "Em buffer, com o mesmo limite",
            "Executável com argumentos que vêm de fora e saída pequena",
          ],
          [
            "`fork(módulo)`",
            "Inicia outro processo Node rodando um arquivo JavaScript, com um canal de mensagens (IPC)",
            "Streams comuns, mais mensagens por `send` e `message`",
            "Dividir trabalho entre scripts Node que conversam por mensagens",
          ],
        ],
        nota: "Há versões síncronas (`spawnSync`, `execSync`, `execFileSync`): elas bloqueiam o laço de eventos até o filho terminar. Servem para scripts de linha de comando, não para servidores.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Programa externo com saída grande ou longa duração: `spawn`. Comando de shell curto e **escrito por você**: `exec`. Executável com argumentos vindos de usuário ou de arquivo: `execFile` ou `spawn`, com array de argumentos, nunca uma string montada. Outro script Node que troca mensagens com o pai: `fork`. Trabalho pesado de CPU em JavaScript dentro do seu app: considere antes um worker thread (veja Q59).",
      },
      {
        tipo: "codigo",
        titulo: "Perigo, alternativa segura e streaming",
        legenda: "JavaScript",
        codigo: `import { exec, execFile, spawn } from "node:child_process";

// PERIGO: a string passa pelo shell. Se pasta for "x; rm -rf ~", o segundo comando também roda
exec("ls " + pasta, (erro, stdout) => console.log(stdout));

// Melhor: sem shell, o argumento nunca vira comando
execFile("ls", ["-l", pasta], (erro, stdout) => {
  if (erro) throw erro;
  console.log(stdout);
});

// Saída grande ou contínua: spawn e streams
const filho = spawn("ffmpeg", ["-i", entrada, saida]);
filho.on("error", (erro) => console.error("não consegui iniciar:", erro.message));
filho.stderr.on("data", (pedaco) => process.stderr.write(pedaco));
filho.on("close", (codigo) => console.log("saiu com código", codigo));`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Injeção de comando",
        texto:
          "Com `exec`, tudo o que entra na string é interpretado por um shell: `;`, `&&`, `$(…)` e aspas viram comandos. Se qualquer parte vem do usuário, de um arquivo ou de uma requisição, um atacante executa o que quiser com as permissões do seu processo. Prefira `execFile` ou `spawn` com array de argumentos e, mesmo assim, valide o que vai como argumento.",
      },
    ],
    armadilhas: [
      "Montar a string de `exec` com entrada de usuário: é a porta clássica de injeção de comando.",
      "Usar `exec` ou `execFile` para saída grande: ao passar do `maxBuffer`, o filho é encerrado e a saída é truncada. Use `spawn`.",
      "Não ouvir o evento `error` (programa inexistente) nem conferir o código de saída em `close`/`exit`: a falha passa em silêncio ou derruba o pai.",
      "Tratar processo filho como forma barata de paralelizar JavaScript: cada filho é um processo inteiro, com memória e inicialização próprias. Para CPU em JS, worker threads são mais leves (veja Q59).",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `spawn` e `exec`?",
        resposta:
          "`spawn` inicia o programa direto e entrega a saída em stream, sem limite de tamanho. `exec` roda a string num shell e devolve a saída inteira em buffer, com limite de tamanho.",
      },
      {
        pergunta: "Por que `execFile` é mais seguro que `exec` com entrada do usuário?",
        resposta:
          "Não usa shell por padrão e recebe os argumentos separados do comando, então o texto do usuário nunca é interpretado como comando.",
      },
      {
        pergunta: "O que `fork` tem de especial?",
        resposta:
          "Inicia outro processo Node e abre um canal de comunicação (IPC) entre pai e filho, usado com `send` e o evento `message`.",
      },
    ],
  },
  en: {
    titulo: "child_process",
    pergunta: "What is the child_process module in Node.js?",
    porqueEsteMetodo:
      "The module offers four similar functions that differ in a few details (shell, output, message channel). A side-by-side matrix shows what each one does and the decision rule says which to pick.",
    resposta30s:
      "`child_process` is the built-in module for **creating operating-system processes** from Node: running commands, external programs or other Node scripts. `spawn` delivers output as a **stream**; `exec` runs a command **in a shell** and returns output in a **buffer**; `execFile` runs a file directly, with no shell; `fork` starts another Node process with a **message channel**. The key caution: user text in `exec` is **command injection**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The four functions",
        colunas: ["Function", "How it works", "Output", "Use when"],
        linhas: [
          [
            "`spawn(cmd, args)`",
            "Starts the program directly, with no shell by default; arguments in an array",
            "As streams (`stdout`, `stderr`), with no size limit",
            "Output is large or continuous, or the process is long-lived (ffmpeg, a server, logs)",
          ],
          [
            "`exec(command)`",
            "Hands a string to a shell, which interprets pipes, `&&` and variables",
            "Buffered: arrives whole in the callback, with a limit (`maxBuffer`)",
            "A short shell command, with fixed text and small output",
          ],
          [
            "`execFile(file, args)`",
            "Runs like `spawn` (no shell), but returns the result in a callback",
            "Buffered, with the same limit",
            "An executable with arguments that come from outside and small output",
          ],
          [
            "`fork(module)`",
            "Starts another Node process running a JavaScript file, with a message channel (IPC)",
            "Regular streams, plus messages through `send` and `message`",
            "Splitting work between Node scripts that talk through messages",
          ],
        ],
        nota: "There are synchronous versions (`spawnSync`, `execSync`, `execFileSync`): they block the event loop until the child ends. They suit command-line scripts, not servers.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "External program with large output or a long life: `spawn`. A short shell command **written by you**: `exec`. An executable with arguments coming from users or files: `execFile` or `spawn`, with an argument array, never a built string. Another Node script exchanging messages with its parent: `fork`. Heavy CPU work in JavaScript inside your app: consider a worker thread first (see Q59).",
      },
      {
        tipo: "codigo",
        titulo: "Danger, safe alternative and streaming",
        legenda: "JavaScript",
        codigo: `import { exec, execFile, spawn } from "node:child_process";

// DANGER: the string goes through the shell. If dir is "x; rm -rf ~", the second command runs too
exec("ls " + dir, (err, stdout) => console.log(stdout));

// Better: no shell, the argument never becomes a command
execFile("ls", ["-l", dir], (err, stdout) => {
  if (err) throw err;
  console.log(stdout);
});

// Large or continuous output: spawn and streams
const child = spawn("ffmpeg", ["-i", input, output]);
child.on("error", (err) => console.error("could not start:", err.message));
child.stderr.on("data", (chunk) => process.stderr.write(chunk));
child.on("close", (code) => console.log("exited with code", code));`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Command injection",
        texto:
          "With `exec`, everything in the string is interpreted by a shell: `;`, `&&`, `$(…)` and quotes become commands. If any part comes from a user, a file or a request, an attacker runs whatever they want with your process’s permissions. Prefer `execFile` or `spawn` with an argument array and, even then, validate what goes in as an argument.",
      },
    ],
    armadilhas: [
      "Building the `exec` string from user input: the classic door to command injection.",
      "Using `exec` or `execFile` for large output: past `maxBuffer` the child is terminated and the output is truncated. Use `spawn`.",
      "Not listening to the `error` event (missing program) nor checking the exit code in `close`/`exit`: the failure goes unnoticed or crashes the parent.",
      "Treating child processes as a cheap way to parallelize JavaScript: each child is a whole process, with its own memory and startup. For CPU work in JS, worker threads are lighter (see Q59).",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `spawn` and `exec`?",
        resposta:
          "`spawn` starts the program directly and delivers output as a stream, with no size limit. `exec` runs the string in a shell and returns the whole output in a buffer, with a size limit.",
      },
      {
        pergunta: "Why is `execFile` safer than `exec` with user input?",
        resposta:
          "It uses no shell by default and takes the arguments separately from the command, so user text is never interpreted as a command.",
      },
      {
        pergunta: "What is special about `fork`?",
        resposta:
          "It starts another Node process and opens a communication channel (IPC) between parent and child, used with `send` and the `message` event.",
      },
    ],
  },
};
