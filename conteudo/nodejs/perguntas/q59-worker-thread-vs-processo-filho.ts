import type { Pergunta } from "../../tipos";

// Q59 · Worker thread vs processo filho
export const q59: Pergunta = {
  numero: 59,
  modulo: "turing-avancadas",
  metodo: "compare",
  pt: {
    titulo: "Worker thread vs processo filho",
    pergunta: "Quais são as vantagens de usar um thread de trabalho em vez de um processo filho?",
    porqueEsteMetodo:
      "É um “X vs Y” disfarçado de “vantagens”: só a matriz lado a lado mostra que cada escolha ganha em alguns pontos e perde em outros, e a regra de decisão diz quando trocar uma pela outra.",
    resposta30s:
      "Um **worker thread** roda dentro do mesmo processo, então é **mais leve** de criar, pode **compartilhar memória** (`SharedArrayBuffer`) ou transferir buffers sem copiar, e conversa por mensagens rápidas. Um **processo filho** tem memória totalmente isolada e pode ser até outro programa. Para tarefas pesadas de CPU em JavaScript, prefira o worker; para programas externos ou isolamento forte, o processo filho.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Worker thread (`worker_threads`)", "Processo filho (`child_process`)"],
        linhas: [
          ["Onde roda", "Numa thread dentro do mesmo processo do Node", "Num processo separado do sistema operacional"],
          [
            "O que executa",
            "Código JavaScript (e WebAssembly) com acesso às APIs do Node",
            "Qualquer programa: Python, ffmpeg, outro script Node, até outra versão do Node",
          ],
          [
            "Custo de criar e memória",
            "Menor, mas cada worker ainda tem seu próprio V8 e seu próprio laço de eventos",
            "Maior: um processo inteiro, com memória e inicialização próprias",
          ],
          [
            "Memória compartilhada",
            "Possível com `SharedArrayBuffer` e `Atomics`; um `ArrayBuffer` pode ser transferido sem cópia",
            "Não: a memória é isolada; os dados vão por mensagens ou pipes, com cópia",
          ],
          [
            "Comunicação",
            "`postMessage` e `MessagePort` (os dados são clonados)",
            "Canal IPC do `fork` (`send`/`message`) ou `stdin`/`stdout`",
          ],
          [
            "Isolamento e falhas",
            "Parcial: um erro não tratado no worker chega ao principal como evento `error`, mas um bug em módulo nativo ou a falta de memória do processo afeta todos",
            "Total: o filho pode cair, ser encerrado ou limitado pelo sistema sem derrubar o pai",
          ],
          [
            "Melhor para",
            "CPU em JavaScript dentro do seu app: hash, parsing, compressão, imagens",
            "Programas externos, código instável ou não confiável, isolamento forte",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Trabalho pesado de CPU em JavaScript do seu próprio app: **worker thread**, de preferência num pool reaproveitado. Programa que não é JavaScript, isolamento forte ou código em que você não confia: **processo filho**. E se o gargalo é E/S (rede, disco, banco), nenhum dos dois: o laço de eventos já resolve (veja Q28).",
      },
      {
        tipo: "codigo",
        titulo: "Tarefa de CPU num worker thread",
        legenda: "principal.js e soma.js",
        codigo: `// principal.js (módulo ES)
import { Worker } from "node:worker_threads";

const worker = new Worker(new URL("./soma.js", import.meta.url), {
  workerData: { ate: 1e8 },
});
worker.on("message", (soma) => console.log("resultado:", soma));
worker.on("error", (erro) => console.error("worker falhou:", erro));
console.log("o laço principal segue livre enquanto o worker calcula");

// soma.js
import { parentPort, workerData } from "node:worker_threads";

let soma = 0;
for (let i = 0; i < workerData.ate; i++) soma += i;
parentPort.postMessage(soma);`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A vantagem não é de graça",
        texto:
          "Mensagens entre threads **copiam** os dados (clone estruturado): funções e instâncias de classes não atravessam intactas, e objetos grandes custam tempo. Compartilhar memória traz condições de corrida e exige `Atomics`. Criar um worker por requisição sai caro, porque cada um inicia seu próprio V8: use um pool. E se o worker só espera E/S, não ganha nada.",
      },
    ],
    armadilhas: [
      "Criar um worker novo a cada requisição: o custo de iniciar supera o ganho. Reaproveite workers num pool.",
      "Usar worker para trabalho de E/S: o laço de eventos já lida bem com isso, e você só adiciona complexidade.",
      "Compartilhar memória sem sincronização (`Atomics`): leituras e escritas simultâneas geram resultados imprevisíveis. Prefira passar mensagens, a menos que meça um ganho real.",
      "Esperar que funções, classes ou conexões atravessem o `postMessage`: só dados clonáveis passam, e instâncias de classe chegam como objetos comuns.",
    ],
    autoteste: [
      {
        pergunta: "Qual a principal vantagem de um worker thread sobre um processo filho?",
        resposta:
          "É mais leve (mesmo processo), troca dados mais rápido e pode compartilhar memória com `SharedArrayBuffer`, o que o torna a escolha natural para CPU em JavaScript.",
      },
      {
        pergunta: "Quando o processo filho continua sendo a escolha certa?",
        resposta:
          "Para rodar programas externos (não JavaScript), ter isolamento total de memória e falhas, ou executar código em que você não confia.",
      },
    ],
  },
  en: {
    titulo: "Worker thread vs child process",
    pergunta: "What are the advantages of using a worker thread instead of a child process?",
    porqueEsteMetodo:
      "It is an “X vs Y” dressed up as “advantages”: only the side-by-side matrix shows that each choice wins on some points and loses on others, and the decision rule says when to swap one for the other.",
    resposta30s:
      "A **worker thread** runs inside the same process, so it is **lighter** to create, can **share memory** (`SharedArrayBuffer`) or transfer buffers without copying, and talks through fast messages. A **child process** has fully isolated memory and can even be a different program. For heavy CPU tasks in JavaScript, prefer the worker; for external programs or strong isolation, the child process.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Worker thread (`worker_threads`)", "Child process (`child_process`)"],
        linhas: [
          ["Where it runs", "On a thread inside the same Node process", "In a separate operating-system process"],
          [
            "What it runs",
            "JavaScript (and WebAssembly) code with access to Node APIs",
            "Any program: Python, ffmpeg, another Node script, even another Node version",
          ],
          [
            "Creation cost and memory",
            "Lower, but each worker still has its own V8 and its own event loop",
            "Higher: a whole process, with its own memory and startup",
          ],
          [
            "Shared memory",
            "Possible with `SharedArrayBuffer` and `Atomics`; an `ArrayBuffer` can be transferred without copying",
            "No: memory is isolated; data travels through messages or pipes, copied",
          ],
          [
            "Communication",
            "`postMessage` and `MessagePort` (data is cloned)",
            "The `fork` IPC channel (`send`/`message`) or `stdin`/`stdout`",
          ],
          [
            "Isolation and failures",
            "Partial: an unhandled error in the worker reaches the main thread as an `error` event, but a native module bug or the whole process running out of memory affects everyone",
            "Total: the child can crash, be killed or be limited by the system without taking the parent down",
          ],
          [
            "Best for",
            "CPU work in JavaScript inside your app: hashing, parsing, compression, images",
            "External programs, unstable or untrusted code, strong isolation",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Heavy CPU work in your own app’s JavaScript: **worker thread**, preferably in a reused pool. A program that is not JavaScript, strong isolation, or code you do not trust: **child process**. And if the bottleneck is I/O (network, disk, database), neither: the event loop already handles it (see Q28).",
      },
      {
        tipo: "codigo",
        titulo: "A CPU task in a worker thread",
        legenda: "main.js and sum.js",
        codigo: `// main.js (ES module)
import { Worker } from "node:worker_threads";

const worker = new Worker(new URL("./sum.js", import.meta.url), {
  workerData: { upTo: 1e8 },
});
worker.on("message", (sum) => console.log("result:", sum));
worker.on("error", (err) => console.error("worker failed:", err));
console.log("the main loop stays free while the worker computes");

// sum.js
import { parentPort, workerData } from "node:worker_threads";

let sum = 0;
for (let i = 0; i < workerData.upTo; i++) sum += i;
parentPort.postMessage(sum);`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The advantage is not free",
        texto:
          "Messages between threads **copy** the data (structured clone): functions and class instances do not cross intact, and large objects take time. Sharing memory brings race conditions and requires `Atomics`. Creating a worker per request is expensive, because each one starts its own V8: use a pool. And if the worker only waits on I/O, it gains nothing.",
      },
    ],
    armadilhas: [
      "Creating a new worker for every request: the startup cost outweighs the gain. Reuse workers in a pool.",
      "Using a worker for I/O work: the event loop already handles that well, and you only add complexity.",
      "Sharing memory without synchronization (`Atomics`): simultaneous reads and writes give unpredictable results. Prefer passing messages unless you measure a real gain.",
      "Expecting functions, classes or connections to cross `postMessage`: only cloneable data passes, and class instances arrive as plain objects.",
    ],
    autoteste: [
      {
        pergunta: "What is the main advantage of a worker thread over a child process?",
        resposta:
          "It is lighter (same process), exchanges data faster and can share memory through `SharedArrayBuffer`, which makes it the natural choice for CPU work in JavaScript.",
      },
      {
        pergunta: "When is the child process still the right choice?",
        resposta:
          "To run external (non-JavaScript) programs, to get full memory and failure isolation, or to run code you do not trust.",
      },
    ],
  },
};
