import type { Pergunta } from "../../tipos";

// Q55 · async.queue
export const q55: Pergunta = {
  numero: 55,
  modulo: "turing-avancadas",
  metodo: "trace",
  pt: {
    titulo: "async.queue",
    pergunta: "Quais são os parâmetros de entrada de async.queue no Node.js?",
    porqueEsteMetodo:
      "Os parâmetros só fazem sentido quando você vê a fila trabalhando. Acompanhar quatro tarefas de ponta a ponta mostra o que `worker` e `concurrency` fazem e o que acontece quando uma tarefa falha.",
    resposta30s:
      "`async.queue(worker, concurrency)` recebe **dois parâmetros**: o **`worker`**, a função `(task, callback)` que processa **uma** tarefa e chama `callback` ao terminar, e a **`concurrency`**, quantos workers rodam ao mesmo tempo (padrão 1). Cada tarefa entra depois com `q.push(task, callback)`. Atenção: isso **não é do núcleo do Node**, e sim da biblioteca `async` do npm (`npm install async`).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os parâmetros de entrada",
        colunas: ["Parâmetro", "Onde entra", "O que é"],
        linhas: [
          [
            "`worker`",
            "`async.queue(worker, …)`",
            "A função que processa **uma** tarefa: `(task, callback)`, chamando `callback(erro)` ao terminar. As versões atuais também aceitam `async (task) => {…}`, sem `callback`.",
          ],
          [
            "`concurrency`",
            "`async.queue(…, concurrency)`",
            "Quantos workers rodam ao mesmo tempo. Opcional, padrão 1 (uma tarefa por vez); zero não é aceito.",
          ],
          [
            "`task`",
            "`q.push(task, …)`",
            "Os dados da tarefa: qualquer valor (objeto, número…). Um array adiciona várias tarefas de uma vez.",
          ],
          [
            "`callback`",
            "`q.push(…, callback)` e dentro do `worker`",
            "Dentro do worker: avisa que a tarefa acabou (padrão error-first). No `push`: opcional, é chamado quando aquela tarefa termina, com o erro ou o resultado.",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma fila com concorrência 2",
        legenda: "JavaScript",
        codigo: `import async from "async";

// worker(task, callback): processa UMA tarefa e avisa quando termina
function worker(task, callback) {
  console.log("começou", task.nome);
  setTimeout(() => {
    console.log("terminou", task.nome);
    callback(null, task.nome.toUpperCase()); // error-first: (erro, resultado)
  }, task.ms);
}

const q = async.queue(worker, 2); // concurrency = 2

q.drain(() => console.log("fila vazia"));
q.error((erro, task) => console.error("falhou:", task.nome, erro));

q.push({ nome: "a", ms: 400 }, (erro, r) => console.log("callback de a:", r));
q.push([{ nome: "b", ms: 100 }, { nome: "c", ms: 100 }, { nome: "d", ms: 100 }]);`,
        nota: "Aqui `drain` e `error` estão na forma de método, como nas versões atuais; em versões antigas eram propriedades (`q.drain = …`). Confira a documentação da versão instalada.",
      },
      {
        tipo: "fluxo",
        titulo: "Trace: quatro tarefas, concorrência 2",
        etapas: [
          "`async.queue(worker, 2)` cria a fila: `length()` e `running()` valem 0 e nada executa ainda",
          "Os `push` de a, b, c e d: a e b começam (`running()` = 2); c e d esperam (`length()` = 2)",
          "t = 100 ms: b chama `callback`; o callback do `push` de b (se houver) dispara e a vaga vai para c",
          "t = 200 ms: c termina e d ocupa a vaga",
          "t = 300 ms: d termina; só a segue rodando (`running()` = 1, `length()` = 0)",
          "t = 400 ms: a termina, não resta nada esperando nem rodando, e o `drain` dispara",
        ],
        nota: "Com `concurrency` 1 a mesma fila seria em série: a, b, c, d, uma por vez, na ordem de entrada. Com 2, a ordem de término depende de cada tarefa (aqui: b, c, d, a).",
      },
      {
        tipo: "passos",
        titulo: "E se a tarefa falha ou o worker se comporta mal?",
        passos: [
          {
            titulo: "O worker chama `callback(erro)`",
            texto:
              "O callback do `push` daquela tarefa recebe o `erro`, e o handler registrado em `q.error` é chamado com `(erro, task)`.",
          },
          {
            titulo: "A fila continua",
            texto:
              "Uma tarefa que falha libera a vaga e as demais seguem. O `drain` ainda dispara quando a última voltar do worker, mesmo com falhas pelo caminho.",
          },
          {
            titulo: "O worker nunca chama `callback`",
            texto:
              "A vaga nunca é liberada. Com concorrência 2, duas tarefas assim travam a fila para sempre, sem erro nenhum.",
          },
          {
            titulo: "O worker chama `callback` duas vezes",
            texto:
              "A biblioteca percebe e lança um erro dizendo que o callback já foi chamado. Garanta uma única chamada por tarefa, inclusive nos ramos de erro e nos `return` antecipados.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Mexendo na fila",
        texto:
          "`push` coloca no fim e `unshift` na frente; ambos aceitam uma tarefa ou um array e um callback opcional. `length()` conta as que esperam, `running()` as em andamento e `idle()` diz se não há nada pendente. `pause()` e `resume()` suspendem e retomam o despacho de novas tarefas (as que já rodam terminam). `drain` avisa o fim e `error` avisa cada falha.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é do núcleo do Node",
        texto:
          "`async.queue` vem da biblioteca `async` (instalada com `npm install async`), não de um módulo `node:`, e não tem relação com a palavra-chave `async`/`await`. Versões antigas só aceitavam workers com `callback`; nas atuais o worker também pode ser uma função `async`, caso em que não há `callback`. Confira a documentação da versão que você instalou. A fila vive na memória do processo: se ele cair, as tarefas pendentes se perdem (para trabalho que não pode se perder, veja Q53).",
      },
    ],
    armadilhas: [
      "Achar que `concurrency` dá paralelismo de CPU: ela só limita quantas tarefas ficam em andamento. Um worker que faz conta pesada em JavaScript continua ocupando o único laço de eventos.",
      "Esquecer o `callback` (a fila trava) ou chamá-lo duas vezes (erro), principalmente nos ramos de erro.",
      "Supor que as tarefas terminam na ordem em que entraram: com concorrência maior que 1, o fim depende de cada tarefa.",
      "Deixar o `push` correr mais rápido que o consumo: a fila cresce na memória sem aviso. Ponha um teto ou use uma fila persistente.",
    ],
    autoteste: [
      {
        pergunta: "Quais são os dois parâmetros de `async.queue` e qual é o padrão da concorrência?",
        resposta:
          "O `worker`, `(task, callback)`, que processa uma tarefa, e a `concurrency`, o número de workers simultâneos. Se omitida, vale 1.",
      },
      {
        pergunta: "O que acontece se o worker nunca chamar o `callback`?",
        resposta:
          "A vaga nunca é liberada. Quando todas as vagas ficam presas, a fila para sem nenhum erro e o `drain` não dispara.",
      },
      {
        pergunta: "`async.queue` faz parte do núcleo do Node.js?",
        resposta: "Não. Vem da biblioteca `async`, instalada pelo npm.",
      },
    ],
  },
  en: {
    titulo: "async.queue",
    pergunta: "What are the input parameters of async.queue in Node.js?",
    porqueEsteMetodo:
      "The parameters only make sense once you watch the queue at work. Following four tasks from start to finish shows what `worker` and `concurrency` do and what happens when a task fails.",
    resposta30s:
      "`async.queue(worker, concurrency)` takes **two parameters**: the **`worker`**, a `(task, callback)` function that processes **one** task and calls `callback` when done, and the **`concurrency`**, how many workers run at the same time (default 1). Tasks are added afterwards with `q.push(task, callback)`. Note that this is **not part of Node core**: it comes from the `async` library on npm (`npm install async`).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The input parameters",
        colunas: ["Parameter", "Where it goes", "What it is"],
        linhas: [
          [
            "`worker`",
            "`async.queue(worker, …)`",
            "The function that processes **one** task: `(task, callback)`, calling `callback(err)` when finished. Current versions also accept `async (task) => {…}`, with no `callback`.",
          ],
          [
            "`concurrency`",
            "`async.queue(…, concurrency)`",
            "How many workers run at once. Optional, defaults to 1 (one task at a time); zero is not accepted.",
          ],
          [
            "`task`",
            "`q.push(task, …)`",
            "The task data: any value (object, number…). An array adds several tasks at once.",
          ],
          [
            "`callback`",
            "`q.push(…, callback)` and inside the `worker`",
            "Inside the worker: says the task is done (error-first style). In `push`: optional, called when that task finishes, with the error or the result.",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A queue with concurrency 2",
        legenda: "JavaScript",
        codigo: `import async from "async";

// worker(task, callback): processes ONE task and says when it is done
function worker(task, callback) {
  console.log("started", task.name);
  setTimeout(() => {
    console.log("finished", task.name);
    callback(null, task.name.toUpperCase()); // error-first: (err, result)
  }, task.ms);
}

const q = async.queue(worker, 2); // concurrency = 2

q.drain(() => console.log("queue is empty"));
q.error((err, task) => console.error("failed:", task.name, err));

q.push({ name: "a", ms: 400 }, (err, r) => console.log("callback for a:", r));
q.push([{ name: "b", ms: 100 }, { name: "c", ms: 100 }, { name: "d", ms: 100 }]);`,
        nota: "Here `drain` and `error` use the method form, as in current versions; older versions used properties (`q.drain = …`). Check the documentation of the version you installed.",
      },
      {
        tipo: "fluxo",
        titulo: "Trace: four tasks, concurrency 2",
        etapas: [
          "`async.queue(worker, 2)` creates the queue: `length()` and `running()` are 0 and nothing runs yet",
          "The `push` calls for a, b, c and d: a and b start (`running()` = 2); c and d wait (`length()` = 2)",
          "t = 100 ms: b calls `callback`; b's `push` callback (if any) fires and the slot goes to c",
          "t = 200 ms: c finishes and d takes the slot",
          "t = 300 ms: d finishes; only a is still running (`running()` = 1, `length()` = 0)",
          "t = 400 ms: a finishes, nothing is waiting or running, and `drain` fires",
        ],
        nota: "With `concurrency` 1 the same queue would run in series: a, b, c, d, one at a time, in arrival order. With 2, the finishing order depends on each task (here: b, c, d, a).",
      },
      {
        tipo: "passos",
        titulo: "What if the task fails or the worker misbehaves?",
        passos: [
          {
            titulo: "The worker calls `callback(err)`",
            texto:
              "That task's `push` callback receives the `err`, and the handler registered with `q.error` is called with `(err, task)`.",
          },
          {
            titulo: "The queue keeps going",
            texto:
              "A failing task frees its slot and the others carry on. `drain` still fires when the last one returns from the worker, even with failures along the way.",
          },
          {
            titulo: "The worker never calls `callback`",
            texto:
              "The slot is never freed. With concurrency 2, two such tasks stall the queue forever, with no error at all.",
          },
          {
            titulo: "The worker calls `callback` twice",
            texto:
              "The library notices and throws an error saying the callback was already called. Make sure each task calls it exactly once, including in error branches and early `return`s.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Steering the queue",
        texto:
          "`push` adds to the end and `unshift` to the front; both take a task or an array and an optional callback. `length()` counts the waiting tasks, `running()` the ones in progress and `idle()` tells you whether anything is pending. `pause()` and `resume()` stop and restart the dispatch of new tasks (the ones already running finish). `drain` signals the end and `error` signals each failure.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Not part of Node core",
        texto:
          "`async.queue` comes from the `async` library (installed with `npm install async`), not from a `node:` module, and has nothing to do with the `async`/`await` keywords. Older versions only accepted workers with a `callback`; current ones also let the worker be an `async` function, in which case there is no `callback`. Check the documentation of the version you installed. The queue lives in the process memory: if the process dies, pending tasks are lost (for work that cannot be lost, see Q53).",
      },
    ],
    armadilhas: [
      "Thinking `concurrency` gives CPU parallelism: it only limits how many tasks are in progress. A worker doing heavy JavaScript math still occupies the single event loop.",
      "Forgetting the `callback` (the queue stalls) or calling it twice (an error), mostly in error branches.",
      "Assuming tasks finish in the order they were added: with concurrency above 1, the finish order depends on each task.",
      "Letting `push` outrun consumption: the queue grows in memory without warning. Set a ceiling or use a persistent queue.",
    ],
    autoteste: [
      {
        pergunta: "What are the two parameters of `async.queue` and what is the default concurrency?",
        resposta:
          "The `worker`, `(task, callback)`, which processes one task, and `concurrency`, the number of simultaneous workers. If omitted, it is 1.",
      },
      {
        pergunta: "What happens if the worker never calls `callback`?",
        resposta:
          "The slot is never freed. When every slot is stuck, the queue stops with no error at all and `drain` never fires.",
      },
      {
        pergunta: "Is `async.queue` part of Node.js core?",
        resposta: "No. It comes from the `async` library, installed through npm.",
      },
    ],
  },
};
