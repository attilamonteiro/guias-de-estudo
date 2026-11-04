import type { Pergunta } from "../../tipos";

// Q52 · Debug no Node.js
export const q52: Pergunta = {
  numero: 52,
  modulo: "turing-avancadas",
  metodo: "playbook",
  pt: {
    titulo: "Debug no Node.js",
    pergunta: "Como realizar debug no Node.js?",
    porqueEsteMetodo:
      "Depurar é um procedimento que vai do mais barato ao mais pesado: ler o erro, pausar o código, medir desempenho. Um playbook dá a ordem certa e o sinal de que cada passo resolveu ou não.",
    resposta30s:
      "Comece pelo básico: a **stack trace** e `console.log`/`console.table`. Quando precisar pausar o código, rode `node --inspect-brk app.js` e conecte o **Chrome DevTools** (`chrome://inspect`) ou o **VS Code**: lá você usa pontos de parada, inspeciona variáveis e a pilha de chamadas. A instrução `debugger;` marca onde pausar. Para lentidão e memória, use `--cpu-prof`, `--heap-prof` e os snapshots do DevTools. Em produção, **logs estruturados**, e nunca deixe a porta do inspetor exposta.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "1. Reproduza e leia o erro",
            texto:
              "Reproduza o problema com a menor entrada possível e leia a **stack trace** de cima para baixo até a primeira linha que aponta para um arquivo seu (as de `node_modules` e `node:internal` costumam ser só o caminho). `console.error`, `console.table`, `console.trace()` e `console.time()` resolvem muita coisa. Para ver o que um módulo nativo faz por dentro, rode com `NODE_DEBUG=http` (ou `net`, `fs`). Critério: se agora você entende a causa, não precisa de depurador.",
          },
          {
            titulo: "2. Abra o inspetor",
            texto:
              "`node --inspect app.js` liga o inspetor (porta 9229, escutando só em `127.0.0.1`); `node --inspect-brk app.js` faz o mesmo e **pausa na primeira linha**, útil quando o erro acontece na inicialização. Sinal: o terminal imprime `Debugger listening on ws://127.0.0.1:9229/...`.",
          },
          {
            titulo: "3. Conecte um cliente",
            texto:
              "No Chrome, abra `chrome://inspect` e clique em **inspect** no alvo Node. No VS Code, use o “JavaScript Debug Terminal” ou uma configuração `launch` do tipo `node` (ele também pode anexar a um processo iniciado com `--inspect`). Sinal: seu código-fonte aparece na aba Sources ou no editor, com a execução pausada ou pronta para pausar.",
          },
          {
            titulo: "4. Pare onde importa",
            texto:
              "Coloque pontos de parada na linha suspeita ou escreva `debugger;` no código (ele só pausa se houver um depurador conectado). Use **breakpoints condicionais** (`pedido.id === 42`) e **logpoints**, que imprimem sem alterar o código. Ao pausar, olhe as variáveis e a **pilha de chamadas** e avance com “step over”, “step into” e “step out”. Sem interface gráfica, `node inspect app.js` abre um depurador de linha de comando. Sinal: você consegue dizer qual valor está diferente do esperado e em que linha ele mudou.",
          },
          {
            titulo: "5. Testes e TypeScript",
            texto:
              "Para depurar um teste, rode o executor com `--inspect-brk` (no Jest, junte `--runInBand` para tudo ficar num processo só). Em código compilado, como TypeScript, use `--enable-source-maps` para que erros e pausas apontem para a linha do `.ts` e não do `.js` gerado.",
          },
          {
            titulo: "6. Lentidão e memória",
            texto:
              "Para CPU, `node --cpu-prof app.js` grava um perfil (arquivo `.cpuprofile`) que você abre nas DevTools; para memória, `--heap-prof` ou “heap snapshots” na aba Memory: tire dois em momentos diferentes e compare, porque o que cresce entre eles é o suspeito de vazamento. `process.memoryUsage()` dá uma noção rápida.",
          },
          {
            titulo: "7. Em produção, sem abrir brechas",
            texto:
              "Prefira **logs estruturados** (JSON com nível, mensagem e um id de correlação da requisição) e métricas, que dão pistas sem pausar nada. Para falhas fatais, os relatórios de diagnóstico do Node (`process.report`) mostram o estado do processo. Se precisar do inspetor remoto, passe por um túnel seguro (por exemplo, SSH) e nunca o exponha à rede.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um ponto de parada escrito no código",
        legenda: "app.js",
        codigo: `import { createServer } from "node:http";

function calcularFrete(pedido) {
  const peso = pedido.itens.reduce((soma, item) => soma + item.peso, 0);
  debugger; // pausa aqui se houver um depurador conectado
  return peso * 2.5;
}

createServer((req, res) => {
  const pedido = { itens: [{ peso: 2 }, { peso: 3 }] };
  res.end(String(calcularFrete(pedido)));
}).listen(3000);

// terminal 1: node --inspect-brk app.js  (libere a pausa inicial)
// terminal 2: curl http://localhost:3000  (a requisição cai no debugger)`,
        nota: "Remova o `debugger;` antes de publicar: sem depurador ele não faz nada, mas é ruído no código.",
      },
      {
        tipo: "tabela",
        titulo: "Opções úteis do Node",
        colunas: ["Opção", "O que faz", "Quando usar"],
        linhas: [
          ["`--inspect`", "Liga o inspetor e segue rodando", "Anexar o depurador a um servidor que deve ficar no ar"],
          [
            "`--inspect-brk`",
            "Liga o inspetor e pausa na primeira linha",
            "Erro na inicialização, scripts curtos e testes",
          ],
          ["`node inspect app.js`", "Depurador em linha de comando", "Só há terminal, sem interface gráfica"],
          [
            "`--cpu-prof` / `--heap-prof`",
            "Gravam perfis de CPU e de memória em arquivos",
            "Lentidão, CPU alta ou suspeita de vazamento",
          ],
          [
            "`--enable-source-maps`",
            "Mapeia erros para o código-fonte original",
            "TypeScript e código gerado por bundler",
          ],
          [
            "`NODE_DEBUG=módulos`",
            "Liga logs internos de módulos nativos",
            "Entender o que `http`, `net` ou `fs` estão fazendo",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Inspetor aberto é execução de código para quem alcançar a porta",
        texto:
          "O inspetor permite executar qualquer código dentro do seu processo. Por isso ele escuta só em `127.0.0.1` por padrão. Evite `--inspect=0.0.0.0:9229` e nunca deixe a porta 9229 acessível pela internet; num servidor remoto, use um túnel SSH.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "console.log também vale, se for rastreável",
        texto:
          "Não há pecado em `console.log`, mas registre contexto (id, entrada, resultado) e troque por um logger com níveis antes de publicar. Um log com o id da requisição ajuda mais do que dez impressões soltas.",
      },
    ],
    armadilhas: [
      "Deixar `debugger;` ou `console.log` de depuração no código que vai para produção.",
      "Expor a porta do inspetor (`0.0.0.0`) fora da máquina local.",
      "Depurar o código compilado quando você escreveu TypeScript, sem source maps: os números de linha não batem.",
      "Pausar um servidor em produção com um breakpoint: enquanto a thread está parada, todas as requisições esperam.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `--inspect` e `--inspect-brk`?",
        resposta:
          "Os dois ligam o inspetor; `--inspect-brk` também pausa na primeira linha, antes de qualquer código seu rodar, o que ajuda a depurar a inicialização.",
      },
      {
        pergunta: "O que faz a instrução `debugger;`?",
        resposta:
          "É um ponto de parada escrito no código: pausa a execução quando há um depurador conectado e não faz nada caso contrário.",
      },
      {
        pergunta: "Como investigar um vazamento de memória?",
        resposta:
          "Tire dois ou mais “heap snapshots” (aba Memory das DevTools) em momentos diferentes e compare: o que cresce entre eles e não é liberado aponta para o vazamento. `--heap-prof` também ajuda.",
      },
    ],
  },
  en: {
    titulo: "Debugging in Node.js",
    pergunta: "How do you debug in Node.js?",
    porqueEsteMetodo:
      "Debugging is a procedure that goes from the cheapest tool to the heaviest: read the error, pause the code, measure performance. A playbook gives the right order and the sign that each step did or did not solve it.",
    resposta30s:
      "Start with the basics: the **stack trace** and `console.log`/`console.table`. When you need to pause the code, run `node --inspect-brk app.js` and connect **Chrome DevTools** (`chrome://inspect`) or **VS Code**: there you use breakpoints, inspect variables and the call stack. The `debugger;` statement marks where to pause. For slowness and memory, use `--cpu-prof`, `--heap-prof` and the DevTools snapshots. In production, **structured logs**, and never leave the inspector port exposed.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "1. Reproduce it and read the error",
            texto:
              "Reproduce the problem with the smallest possible input and read the **stack trace** from top to bottom until the first line that points to one of your files (the `node_modules` and `node:internal` lines are usually just the path). `console.error`, `console.table`, `console.trace()` and `console.time()` solve a lot. To see what a core module does inside, run with `NODE_DEBUG=http` (or `net`, `fs`). Criterion: if you now understand the cause, you do not need a debugger.",
          },
          {
            titulo: "2. Open the inspector",
            texto:
              "`node --inspect app.js` turns on the inspector (port 9229, listening only on `127.0.0.1`); `node --inspect-brk app.js` does the same and **pauses on the first line**, useful when the error happens at startup. Sign: the terminal prints `Debugger listening on ws://127.0.0.1:9229/...`.",
          },
          {
            titulo: "3. Connect a client",
            texto:
              "In Chrome, open `chrome://inspect` and click **inspect** on the Node target. In VS Code, use the “JavaScript Debug Terminal” or a `launch` configuration of type `node` (it can also attach to a process started with `--inspect`). Sign: your source code shows up in the Sources tab or the editor, with execution paused or ready to pause.",
          },
          {
            titulo: "4. Stop where it matters",
            texto:
              "Set breakpoints on the suspicious line or write `debugger;` in the code (it only pauses when a debugger is attached). Use **conditional breakpoints** (`order.id === 42`) and **logpoints**, which print without changing the code. When paused, look at the variables and the **call stack** and move with “step over”, “step into” and “step out”. With no graphical interface, `node inspect app.js` opens a command-line debugger. Sign: you can say which value differs from what you expected and on which line it changed.",
          },
          {
            titulo: "5. Tests and TypeScript",
            texto:
              "To debug a test, run the test runner with `--inspect-brk` (in Jest, add `--runInBand` to keep everything in one process). With compiled code, such as TypeScript, use `--enable-source-maps` so that errors and pauses point to the `.ts` line instead of the generated `.js`.",
          },
          {
            titulo: "6. Slowness and memory",
            texto:
              "For CPU, `node --cpu-prof app.js` writes a profile (a `.cpuprofile` file) that you open in DevTools; for memory, `--heap-prof` or “heap snapshots” in the Memory tab: take two at different moments and compare, because whatever grows between them is the leak suspect. `process.memoryUsage()` gives a quick idea.",
          },
          {
            titulo: "7. In production, without opening holes",
            texto:
              "Prefer **structured logs** (JSON with level, message and a request correlation id) and metrics, which give clues without pausing anything. For fatal failures, Node’s diagnostic reports (`process.report`) show the state of the process. If you need the inspector remotely, go through a secure tunnel (for example, SSH) and never expose it to the network.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A breakpoint written in the code",
        legenda: "app.js",
        codigo: `import { createServer } from "node:http";

function calculateShipping(order) {
  const weight = order.items.reduce((sum, item) => sum + item.weight, 0);
  debugger; // pauses here if a debugger is attached
  return weight * 2.5;
}

createServer((req, res) => {
  const order = { items: [{ weight: 2 }, { weight: 3 }] };
  res.end(String(calculateShipping(order)));
}).listen(3000);

// terminal 1: node --inspect-brk app.js  (release the initial pause)
// terminal 2: curl http://localhost:3000  (the request hits the debugger)`,
        nota: "Remove the `debugger;` before shipping: without a debugger it does nothing, but it is noise in the code.",
      },
      {
        tipo: "tabela",
        titulo: "Useful Node options",
        colunas: ["Option", "What it does", "When to use it"],
        linhas: [
          [
            "`--inspect`",
            "Turns on the inspector and keeps running",
            "Attach the debugger to a server that must stay up",
          ],
          [
            "`--inspect-brk`",
            "Turns on the inspector and pauses on the first line",
            "Startup errors, short scripts and tests",
          ],
          ["`node inspect app.js`", "Command-line debugger", "Only a terminal is available, no GUI"],
          [
            "`--cpu-prof` / `--heap-prof`",
            "Write CPU and memory profiles to files",
            "Slowness, high CPU or a suspected leak",
          ],
          ["`--enable-source-maps`", "Maps errors back to the original source", "TypeScript and bundler output"],
          [
            "`NODE_DEBUG=modules`",
            "Turns on internal logs of core modules",
            "Understand what `http`, `net` or `fs` are doing",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An open inspector is code execution for anyone who reaches the port",
        texto:
          "The inspector lets whoever connects run any code inside your process. That is why it listens only on `127.0.0.1` by default. Avoid `--inspect=0.0.0.0:9229` and never leave port 9229 reachable from the internet; on a remote server, use an SSH tunnel.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "console.log is fine too, if it is traceable",
        texto:
          "There is no sin in `console.log`, but record context (id, input, result) and swap it for a logger with levels before shipping. A log carrying the request id helps more than ten loose prints.",
      },
    ],
    armadilhas: [
      "Leaving `debugger;` or debugging `console.log` calls in code that goes to production.",
      "Exposing the inspector port (`0.0.0.0`) beyond the local machine.",
      "Debugging compiled code when you wrote TypeScript, with no source maps: the line numbers do not match.",
      "Pausing a production server on a breakpoint: while the thread is stopped, every request waits.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `--inspect` and `--inspect-brk`?",
        resposta:
          "Both turn on the inspector; `--inspect-brk` also pauses on the first line, before any of your code runs, which helps debug startup.",
      },
      {
        pergunta: "What does the `debugger;` statement do?",
        resposta:
          "It is a breakpoint written in the code: it pauses execution when a debugger is attached and does nothing otherwise.",
      },
      {
        pergunta: "How do you investigate a memory leak?",
        resposta:
          "Take two or more “heap snapshots” (DevTools Memory tab) at different moments and compare: what grows between them and is not released points to the leak. `--heap-prof` helps too.",
      },
    ],
  },
};
