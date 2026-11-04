import type { Pergunta } from "../../tipos";

// G32 · Call stack e event loop
export const g032: Pergunta = {
  numero: 332,
  modulo: "glassdoor-javascript",
  metodo: "firstprinciples",
  pt: {
    titulo: "Call stack e event loop",
    pergunta: "O que são a call stack e o event loop em JavaScript?",
    porqueEsteMetodo:
      "Call stack e event loop parecem jargão até você ver o problema que cada peça resolve. Partir de uma thread que executa uma coisa por vez e consertar uma falha de cada vez mostra por que o modelo é assim.",
    resposta30s:
      "O JavaScript executa o seu código numa **única thread**, uma coisa por vez, numa **pilha de chamadas** (call stack). Como esperar travaria tudo, timers, rede e eventos ficam a cargo do ambiente (navegador ou Node), que **enfileira o callback** quando termina; o **event loop** só leva a próxima tarefa à pilha quando ela está vazia, e as **microtasks** (promises) rodam antes da próxima tarefa, por isso um `.then` vem antes de `setTimeout(…, 0)`. Trabalho longo na pilha congela a página e a renderização do React.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Rodar código previsível e, ao mesmo tempo, esperar coisas lentas (rede, timers, cliques) sem congelar a página. A linguagem foi desenhada com **uma thread** para o código de quem programa: sem travas e sem corridas entre threads, mas só uma coisa executa por vez.",
          },
          {
            titulo: "1. A versão mais simples: a pilha",
            texto:
              "Cada chamada de função empilha um quadro com seus dados locais; ao retornar, desempilha (o último a entrar é o primeiro a sair). Só o topo executa. → Quebra: se o topo ficar esperando (uma resposta de rede, por exemplo), **nada mais acontece**: sem cliques, sem pintura, sem timers. E recursão sem fim estoura a pilha (*stack overflow*).",
          },
          {
            titulo: "2. Mande esperar para fora",
            texto:
              "`setTimeout`, `fetch` e os ouvintes de eventos pedem ao **ambiente** (as Web APIs do navegador, ou o libuv no Node) que espere por eles, fora da pilha e em paralelo com o seu código. A chamada retorna na hora e a pilha segue. → Quebra: quando a espera acaba, o que acontece com o callback? Ele não pode entrar no meio de uma função que está rodando.",
          },
          {
            titulo: "3. A fila e o event loop",
            texto:
              "Quando o ambiente termina, ele coloca o callback numa **fila de tarefas** (macrotasks). O **event loop** é um laço simples: se a pilha estiver vazia, pega a próxima tarefa e a executa **até o fim** (*run to completion*). Por isso `setTimeout(f, 0)` não roda “agora”: espera a pilha esvaziar, e o atraso é um mínimo, não uma garantia.",
          },
          {
            titulo: "4. Microtasks: as promises vêm primeiro",
            texto:
              "Promises (`.then`, `await`) e `queueMicrotask` usam uma segunda fila, a de **microtasks**. Depois de cada tarefa, e sempre que a pilha esvazia, o motor esvazia **toda** a fila de microtasks antes de pegar a próxima tarefa ou de pintar. → Efeito: uma promise resolvida roda antes de um `setTimeout` com 0. → Risco: microtasks que geram microtasks sem fim impedem a pintura.",
          },
          {
            titulo: "5. A pintura entra no ciclo",
            texto:
              "No navegador, entre tarefas, ele pode recalcular estilos e pintar a tela. → Quebra: uma tarefa longa (um laço pesado, um `JSON.parse` enorme) ocupa a pilha e **impede pintar e responder a eventos**: a página “trava”. Conserto: quebrar o trabalho em pedaços, mover o cálculo pesado para um Web Worker ou reduzir o que precisa ser feito.",
          },
          {
            titulo: "6. E o React?",
            texto:
              "A renderização do React é JavaScript na pilha: um componente que calcula demais bloqueia tudo. As atualizações de estado são agendadas, não imediatas (veja C14), e o `useEffect` roda depois da renderização, não durante ela. A renderização concorrente (`useTransition`, `useDeferredValue`) deixa o React **devolver o controle ao navegador** entre pedaços de trabalho, para a interface continuar respondendo (veja L40).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A ordem de execução",
        legenda: "JavaScript",
        codigo: `console.log("A: pilha");
setTimeout(() => console.log("D: tarefa (timer)"), 0);
Promise.resolve().then(() => console.log("C: microtask"));
console.log("B: pilha");

// Saída: A, B, C, D
// A e B rodam na pilha; C é uma microtask; D espera a pilha esvaziar e a vez na fila`,
      },
      {
        tipo: "tabela",
        titulo: "As peças do modelo",
        colunas: ["Parte", "O que contém", "Quando executa", "Consequência"],
        linhas: [
          [
            "Pilha de chamadas",
            "As funções em execução, uma sobre a outra",
            "Sempre: só o topo roda",
            "Código longo ocupa a única thread; recursão infinita estoura a pilha",
          ],
          [
            "Microtasks",
            "Callbacks de promises (`then`, continuação do `await`) e `queueMicrotask`",
            "Todas, assim que a pilha esvazia e antes da próxima tarefa",
            "Vêm antes dos timers; excesso adia a pintura e a entrada do usuário",
          ],
          [
            "Tarefas (macrotasks)",
            "Callbacks de timers, eventos do DOM, mensagens e I/O",
            "Uma por volta do laço, quando a pilha e as microtasks acabaram",
            "O atraso de um timer é mínimo; o callback espera a sua vez",
          ],
          [
            "Renderização (navegador)",
            "Cálculo de estilo, layout e pintura",
            "Entre tarefas, quando o navegador decide pintar",
            "Tarefa longa significa quadros perdidos e cliques sem resposta",
          ],
        ],
        nota: "No Node.js o laço tem fases próprias e `process.nextTick` tem prioridade especial: veja o guia de Node.js.",
      },
      {
        tipo: "codigo",
        titulo: "Dividir trabalho longo para não travar",
        legenda: "JavaScript",
        codigo: `// Bloqueia: nada é pintado nem responde enquanto o laço roda
function somarTudo(itens) {
  return itens.reduce((total, item) => total + pesado(item), 0);
}

// Em pedaços: devolve o controle ao navegador entre as partes
async function somarEmPedacos(itens, tamanho = 1000) {
  let total = 0;
  for (let i = 0; i < itens.length; i += tamanho) {
    for (const item of itens.slice(i, i + tamanho)) total += pesado(item);
    await new Promise((resolver) => setTimeout(resolver, 0)); // o navegador pode pintar e tratar eventos
  }
  return total;
}`,
        nota: "`pesado` é qualquer cálculo caro. Para trabalho realmente pesado, um Web Worker tira o cálculo da thread principal.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Resumo do modelo",
        texto:
          "Uma thread, uma pilha, uma coisa por vez. As esperas saem da pilha, voltam como callbacks por filas, e o event loop só os traz quando a pilha está vazia, com **microtasks antes de tarefas**. Se o seu código ocupa a pilha, ele atrasa tudo, inclusive a tela.",
      },
    ],
    armadilhas: [
      "Achar que `setTimeout(f, 0)` executa na hora: ele espera a pilha esvaziar e as microtasks rodarem.",
      "Dizer que o JavaScript “faz coisas em paralelo”: o ambiente espera em paralelo, mas o seu código executa uma coisa por vez.",
      "Colocar cálculo pesado na renderização ou num handler e culpar o React pela lentidão: a pilha ocupada trava a página.",
      "Esquecer que `await` devolve o controle: o código depois dele roda como microtask, depois do trecho síncrono atual.",
    ],
    autoteste: [
      {
        pergunta:
          "Qual é a ordem dos logs de: um log síncrono, um `setTimeout(…, 0)` e um `Promise.resolve().then(…)`?",
        resposta: "Primeiro o síncrono, depois o `then` (microtask) e por último o `setTimeout` (tarefa).",
      },
      {
        pergunta: "Por que uma tarefa longa congela a interface?",
        resposta:
          "Porque só há uma thread: enquanto a pilha está ocupada, o navegador não trata eventos nem pinta. A solução é dividir o trabalho, usar um Worker ou reduzir o custo.",
      },
    ],
  },
  en: {
    titulo: "Call stack and event loop",
    pergunta: "What are the call stack and the event loop in JavaScript?",
    porqueEsteMetodo:
      "The call stack and the event loop sound like jargon until you see the problem each piece solves. Starting from a thread that runs one thing at a time and fixing one flaw at a time shows why the model looks the way it does.",
    resposta30s:
      "JavaScript runs your code on a **single thread**, one thing at a time, on a **call stack**. Since waiting would freeze everything, timers, network and events are handled by the environment (browser or Node), which **queues the callback** when it finishes; the **event loop** only brings the next task to the stack when it is empty, and **microtasks** (promises) run before the next task, which is why a `.then` comes before `setTimeout(…, 0)`. Long work on the stack freezes the page and React’s rendering.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "Run predictable code while waiting for slow things (network, timers, clicks) without freezing the page. The language was designed with **one thread** for the programmer’s code: no locks and no races between threads, but only one thing runs at a time.",
          },
          {
            titulo: "1. The simplest version: the stack",
            texto:
              "Each function call pushes a frame with its local data; on return, it pops (last in, first out). Only the top runs. → Breaks: if the top sits waiting (for a network response, say), **nothing else happens**: no clicks, no painting, no timers. And endless recursion overflows the stack (*stack overflow*).",
          },
          {
            titulo: "2. Send the waiting outside",
            texto:
              "`setTimeout`, `fetch` and event listeners ask the **environment** (the browser’s Web APIs, or libuv in Node) to wait for them, off the stack and in parallel with your code. The call returns right away and the stack moves on. → Breaks: when the wait ends, what happens to the callback? It cannot barge into the middle of a function that is running.",
          },
          {
            titulo: "3. The queue and the event loop",
            texto:
              "When the environment finishes, it puts the callback in a **task queue** (macrotasks). The **event loop** is a simple loop: if the stack is empty, take the next task and run it **to the end** (*run to completion*). That is why `setTimeout(f, 0)` does not run “now”: it waits for the stack to empty, and the delay is a minimum, not a guarantee.",
          },
          {
            titulo: "4. Microtasks: promises come first",
            texto:
              "Promises (`.then`, `await`) and `queueMicrotask` use a second queue, the **microtask** queue. After each task, and whenever the stack empties, the engine drains **the whole** microtask queue before taking the next task or painting. → Effect: a resolved promise runs before a `setTimeout` with 0. → Risk: microtasks that keep creating microtasks block painting.",
          },
          {
            titulo: "5. Painting enters the cycle",
            texto:
              "In the browser, between tasks, it may recalculate styles and paint the screen. → Breaks: a long task (a heavy loop, a huge `JSON.parse`) holds the stack and **prevents painting and responding to events**: the page “freezes”. The fix: split the work into chunks, move the heavy computation to a Web Worker, or reduce what has to be done.",
          },
          {
            titulo: "6. And React?",
            texto:
              "React’s rendering is JavaScript on the stack: a component that computes too much blocks everything. State updates are scheduled, not immediate (see C14), and `useEffect` runs after rendering, not during it. Concurrent rendering (`useTransition`, `useDeferredValue`) lets React **hand control back to the browser** between pieces of work, so the interface keeps responding (see L40).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The order of execution",
        legenda: "JavaScript",
        codigo: `console.log("A: stack");
setTimeout(() => console.log("D: task (timer)"), 0);
Promise.resolve().then(() => console.log("C: microtask"));
console.log("B: stack");

// Output: A, B, C, D
// A and B run on the stack; C is a microtask; D waits for the stack to empty and its turn in the queue`,
      },
      {
        tipo: "tabela",
        titulo: "The pieces of the model",
        colunas: ["Part", "What it holds", "When it runs", "Consequence"],
        linhas: [
          [
            "Call stack",
            "The running functions, one on top of another",
            "Always: only the top runs",
            "Long code holds the only thread; infinite recursion overflows the stack",
          ],
          [
            "Microtasks",
            "Promise callbacks (`then`, the continuation of `await`) and `queueMicrotask`",
            "All of them, as soon as the stack empties and before the next task",
            "They come before timers; too many delay painting and user input",
          ],
          [
            "Tasks (macrotasks)",
            "Timer callbacks, DOM events, messages and I/O",
            "One per turn of the loop, once the stack and microtasks are done",
            "A timer’s delay is a minimum; the callback waits its turn",
          ],
          [
            "Rendering (browser)",
            "Style calculation, layout and painting",
            "Between tasks, when the browser decides to paint",
            "A long task means dropped frames and unresponsive clicks",
          ],
        ],
        nota: "In Node.js the loop has its own phases and `process.nextTick` has special priority: see the Node.js guide.",
      },
      {
        tipo: "codigo",
        titulo: "Splitting long work so it does not freeze",
        legenda: "JavaScript",
        codigo: `// Blocks: nothing is painted and nothing responds while the loop runs
function sumAll(items) {
  return items.reduce((total, item) => total + heavy(item), 0);
}

// In chunks: hands control back to the browser between the parts
async function sumInChunks(items, size = 1000) {
  let total = 0;
  for (let i = 0; i < items.length; i += size) {
    for (const item of items.slice(i, i + size)) total += heavy(item);
    await new Promise((resolve) => setTimeout(resolve, 0)); // the browser can paint and handle events
  }
  return total;
}`,
        nota: "`heavy` is any expensive computation. For truly heavy work, a Web Worker takes the computation off the main thread.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Summary of the model",
        texto:
          "One thread, one stack, one thing at a time. Waits leave the stack and come back as callbacks through queues, and the event loop only brings them in when the stack is empty, with **microtasks before tasks**. If your code holds the stack, it delays everything, the screen included.",
      },
    ],
    armadilhas: [
      "Thinking `setTimeout(f, 0)` runs right away: it waits for the stack to empty and the microtasks to run.",
      "Saying JavaScript “does things in parallel”: the environment waits in parallel, but your code runs one thing at a time.",
      "Putting heavy computation in rendering or in a handler and blaming React for the slowness: a busy stack freezes the page.",
      "Forgetting that `await` hands control back: the code after it runs as a microtask, after the current synchronous stretch.",
    ],
    autoteste: [
      {
        pergunta:
          "What is the log order of: a synchronous log, a `setTimeout(…, 0)` and a `Promise.resolve().then(…)`?",
        resposta: "The synchronous one first, then the `then` (microtask) and finally the `setTimeout` (task).",
      },
      {
        pergunta: "Why does a long task freeze the interface?",
        resposta:
          "Because there is only one thread: while the stack is busy, the browser neither handles events nor paints. The fix is to split the work, use a Worker or reduce the cost.",
      },
    ],
  },
};
