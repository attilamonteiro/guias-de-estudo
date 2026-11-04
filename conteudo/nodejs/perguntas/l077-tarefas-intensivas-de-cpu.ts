import type { Pergunta } from "../../tipos";

// L77 · Tarefas intensivas de CPU
export const l077: Pergunta = {
  numero: 177,
  modulo: "linkedin-processos",
  metodo: "playbook",
  pt: {
    titulo: "Tarefas intensivas de CPU",
    pergunta: "Como você lidaria com tarefas intensivas de CPU no Node.js?",
    porqueEsteMetodo:
      "A pergunta pede uma conduta, não uma definição: primeiro provar que o gargalo é CPU, depois escolher onde o trabalho roda e como proteger o tráfego da API dele. Um playbook com ordem e critérios evita o erro clássico de pular direto para `worker_threads`.",
    resposta30s:
      "Código de CPU roda na **única thread** do JavaScript e, até terminar, **nenhuma outra requisição, timer ou callback é atendido**: um endpoint pesado deixa todos os outros lentos. Meça e ache o trecho quente, **reduza o trabalho** se der e, se não der, tire-o do laço principal: **worker threads** (de preferência em pool), **fila com processos worker** ou um **serviço separado**, de modo que a API só receba o pedido e responda.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do sintoma ao isolamento",
        passos: [
          {
            titulo: "Confirme que o problema é CPU",
            texto:
              "A thread do JavaScript é uma só: enquanto um laço, um `JSON.parse` gigante ou um `pbkdf2Sync` roda, nenhum outro callback é despachado, e até um endpoint trivial como `/saude` demora. Sinais: um núcleo em 100%, atraso do laço alto (`monitorEventLoopDelay`) e latência ruim em rotas que nada têm a ver com a lenta. Se a CPU está baixa e a rota demora, é espera de E/S, não CPU (veja T28).",
          },
          {
            titulo: "Encontre o trecho quente",
            texto:
              "Perfile com `node --cpu-prof` ou com o DevTools via `--inspect` e leia o flame graph: a função mais larga é a suspeita. Suspeitos comuns: parse e serialização de JSON grande, regex com retrocesso exagerado, criptografia ou compressão síncronas, ordenações e laços sobre muitos dados, geração de PDF ou de imagem (veja L30 e L111).",
          },
          {
            titulo: "Reduza o trabalho antes de paralelizar",
            texto:
              "Um algoritmo melhor, cache do resultado, paginação, agregação no banco em vez de no Node ou processamento em streaming costumam valer mais do que qualquer thread. Critério: se o custo cair a ponto de não afetar a latência das outras rotas, pare aqui.",
          },
          {
            titulo: "Escolha onde o trabalho vai rodar",
            texto:
              "Se ainda pesa, use a tabela abaixo: fatiar em pedaços, `worker_threads`, processos, fila com workers ou serviço à parte. Regra prática: quanto mais pesado, mais frequente e mais crítico para o resto da API, mais longe do processo da API ele deve ficar.",
          },
          {
            titulo: "Isole do tráfego da API",
            texto:
              "O ideal é a API só aceitar o pedido e responder `202 Accepted` com um `jobId`, enquanto workers (outro pool, outro processo ou outro deploy, com escala própria) fazem o cálculo. Assim, um pico de relatórios pesados não consome a capacidade que atende login e listagens.",
          },
          {
            titulo: "Limite a concorrência e crie contrapressão",
            texto:
              "Pool de tamanho fixo (da ordem do número de núcleos), fila com limite e prazo por tarefa. Quando a fila enche, responda `429` ou `503` em vez de aceitar tudo: sem limite, o trabalho acumulado esgota a memória ou a máquina.",
          },
          {
            titulo: "Meça de novo",
            texto:
              "Rode um teste de carga com tráfego misto (rotas leves e pesadas ao mesmo tempo) e compare latência p95/p99 e atraso do laço antes e depois. Sinal de acerto: a rota leve não muda quando a pesada recebe carga. Deixe um alerta no atraso do laço.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde rodar a tarefa pesada",
        colunas: ["Opção", "Como funciona", "Quando escolher", "Custo ou limite"],
        linhas: [
          [
            "Otimizar ou evitar o trabalho",
            "Algoritmo melhor, cache, paginação, agregação no banco, parser em streaming",
            "Sempre, como primeiro passo",
            "Pode não bastar para cálculo pesado por natureza",
          ],
          [
            "Fatiar em pedaços",
            "Processa um lote por vez e devolve o controle ao laço (`await setImmediate()`, de `node:timers/promises`)",
            "Tarefa moderada, sem infraestrutura nova",
            "Não usa outros núcleos; a tarefa continua ocupando a thread entre as pausas",
          ],
          [
            "`worker_threads` em pool",
            "Threads no mesmo processo, com mensagens e memória transferível ou compartilhada (veja T59 e L73)",
            "CPU em JavaScript dentro do seu app, de curta a média duração",
            "Mesma máquina e mesmo processo; pool mal dimensionado disputa CPU com a API",
          ],
          [
            "Processos filhos ou `cluster`",
            "Outros processos Node.js ou programas externos (veja T58 e T45)",
            "Programa que não é JavaScript, isolamento forte, ou vários núcleos para a API inteira",
            "Mais memória e mensagens por IPC; `cluster` ameniza, mas não cura a rota pesada",
          ],
          [
            "Fila + processos worker",
            "A API publica o trabalho numa fila durável e workers (outro deploy) o consomem (veja T53 e L107)",
            "Tarefa longa, que pode esperar, precisa de retentativa e de escala própria",
            "Mais peças: fila, status, idempotência",
          ],
          [
            "Serviço separado",
            "Um serviço dedicado, talvez em outra linguagem, recebe o trabalho por HTTP, gRPC ou fila",
            "Carga permanente e pesada, ou linguagem mais adequada ao cálculo",
            "Custo operacional e contrato entre serviços",
          ],
          [
            "Módulo nativo ou WebAssembly",
            "O trecho quente roda em código compilado chamado pelo JavaScript",
            "Laço numérico específico e estável que o JavaScript faz mal",
            "Complexidade de build; ainda ocupa a thread de quem chama, a menos que rode num worker",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Tirando o cálculo do laço principal",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          'import { Worker } from "node:worker_threads";',
          "",
          "function calcular(entrada) {",
          "  return new Promise((resolve, reject) => {",
          '    const worker = new Worker(new URL("./calculo.js", import.meta.url), { workerData: entrada });',
          '    worker.once("message", resolve);',
          '    worker.once("error", reject);',
          '    worker.once("exit", (code) => code !== 0 && reject(new Error(`worker saiu com ${code}`)));',
          "  });",
          "}",
          "",
          "createServer(async (req, res) => {",
          '  if (req.url === "/relatorio") {',
          "    const resultado = await calcular({ linhas: 5_000_000 }); // pesado, mas fora do laço",
          "    return res.end(JSON.stringify(resultado));",
          "  }",
          '  res.end("ok"); // segue respondendo enquanto o relatório é calculado',
          "}).listen(3000);",
        ].join("\n"),
        nota: "`calculo.js` lê `workerData`, faz o laço pesado e responde com `parentPort.postMessage(resultado)`. Criar um `Worker` por requisição é caro e sem limite: em produção use um pool de tamanho fixo e trate o erro da rota.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Primeiro **elimine** o trabalho, depois **tire** o que sobrou do laço. Curto e eventual: `worker_threads` num pool. Longo, pesado ou que pode esperar: **fila + workers separados**, com a API só aceitando o pedido e informando o status. O que importa é a capacidade que atende o tráfego comum nunca disputar CPU com a tarefa pesada.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cenário: um endpoint trava os outros",
        texto:
          "Quando um endpoint trava todos os outros, a causa quase nunca é o roteador: é uma rota que ocupa a thread única do JavaScript (laço, `*Sync`, parse enorme). O teste rápido é chamar um endpoint trivial enquanto a rota suspeita roda: se ele também demora, o laço está bloqueado. Corrija a rota culpada seguindo o playbook; `cluster` ameniza (outros processos continuam atendendo), mas cada processo ainda trava na hora da tarefa.",
      },
    ],
    armadilhas: [
      "Achar que `async`/`await` ou uma promise tira o cálculo da thread principal: uma função `async` com um laço pesado continua bloqueando tudo.",
      "Pular a medição e sair criando workers: sem saber se o gargalo é CPU, você soma complexidade e não resolve a lentidão.",
      "Criar um `Worker` novo a cada requisição, sem limite: o custo de inicialização e a disputa por CPU pioram a latência.",
      "Usar worker threads para trabalho de E/S (banco, rede, disco): o laço já cuida disso sem bloquear, e o worker só complica.",
    ],
    autoteste: [
      {
        pergunta:
          "Por que um cálculo pesado numa rota deixa as outras rotas lentas, mesmo dentro de uma função `async`?",
        resposta:
          "Porque o JavaScript roda numa única thread e `async` não cria outra: enquanto o laço do cálculo não termina, o event loop não despacha nenhum outro evento. Só a E/S é delegada; CPU precisa sair do laço (worker, processo, fila).",
      },
      {
        pergunta: "Como isolar um relatório pesado do tráfego normal da API?",
        resposta:
          "A API só aceita o pedido e responde `202` com um id; um pool de workers ou processos separados, com concorrência limitada, faz o cálculo e guarda o resultado para consulta. Se a fila encher, a API recusa com `429` ou `503`.",
      },
    ],
  },
  en: {
    titulo: "CPU-intensive tasks",
    pergunta: "How would you handle CPU-intensive tasks in Node.js?",
    porqueEsteMetodo:
      "The question asks for a course of action, not a definition: first prove the bottleneck is CPU, then choose where the work runs and how to shield API traffic from it. A playbook with order and criteria avoids the classic mistake of jumping straight to `worker_threads`.",
    resposta30s:
      "CPU code runs on the **single JavaScript thread**, and until it finishes **no other request, timer or callback is served**: one heavy endpoint slows down all the others. Measure and find the hot spot, **cut the work** if you can, and if you cannot, move it off the main loop: **worker threads** (preferably in a pool), a **queue with worker processes** or a **separate service**, so the API only accepts the request and answers.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from symptom to isolation",
        passos: [
          {
            titulo: "Confirm the problem is CPU",
            texto:
              "The JavaScript thread is just one: while a loop, a giant `JSON.parse` or a `pbkdf2Sync` runs, no other callback is dispatched, and even a trivial endpoint like `/health` is slow. Signs: one core at 100%, high event loop delay (`monitorEventLoopDelay`) and poor latency on routes unrelated to the slow one. If CPU is low and the route is slow, it is I/O wait, not CPU (see T28).",
          },
          {
            titulo: "Find the hot spot",
            texto:
              "Profile with `node --cpu-prof` or with DevTools via `--inspect` and read the flame graph: the widest function is the suspect. Common suspects: parsing and serializing large JSON, regexes with excessive backtracking, synchronous cryptography or compression, sorts and loops over lots of data, PDF or image generation (see L30 and L111).",
          },
          {
            titulo: "Cut the work before parallelizing",
            texto:
              "A better algorithm, caching the result, pagination, aggregating in the database instead of in Node, or streaming the processing often beats any thread. Criterion: if the cost drops enough to stop affecting the latency of other routes, stop here.",
          },
          {
            titulo: "Choose where the work runs",
            texto:
              "If it is still heavy, use the table below: slicing into chunks, `worker_threads`, processes, a queue with workers or a separate service. Rule of thumb: the heavier, the more frequent and the more critical to the rest of the API, the farther from the API process it should live.",
          },
          {
            titulo: "Isolate it from API traffic",
            texto:
              "Ideally the API only accepts the request and answers `202 Accepted` with a `jobId`, while workers (another pool, another process or another deployment, with their own scaling) do the computing. That way a spike of heavy reports does not eat the capacity that serves login and listings.",
          },
          {
            titulo: "Limit concurrency and apply backpressure",
            texto:
              "A fixed-size pool (on the order of the core count), a bounded queue and a deadline per task. When the queue fills up, answer `429` or `503` instead of accepting everything: with no limit, accumulated work exhausts memory or the machine.",
          },
          {
            titulo: "Measure again",
            texto:
              "Run a load test with mixed traffic (light and heavy routes at the same time) and compare p95/p99 latency and event loop delay before and after. A sign of success: the light route does not change when the heavy one is under load. Keep an alert on the loop delay.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to run the heavy task",
        colunas: ["Option", "How it works", "When to choose it", "Cost or limit"],
        linhas: [
          [
            "Optimize or avoid the work",
            "Better algorithm, caching, pagination, aggregation in the database, streaming parser",
            "Always, as the first step",
            "May not be enough for work that is heavy by nature",
          ],
          [
            "Slice into chunks",
            "Process one batch at a time and give control back to the loop (`await setImmediate()`, from `node:timers/promises`)",
            "Moderate task, no new infrastructure",
            "Uses no other cores; the task still occupies the thread between pauses",
          ],
          [
            "`worker_threads` in a pool",
            "Threads in the same process, with transferable or shared memory and messages (see T59 and L73)",
            "CPU work in JavaScript inside your app, short to medium duration",
            "Same machine and process; a badly sized pool competes with the API for CPU",
          ],
          [
            "Child processes or `cluster`",
            "Other Node.js processes or external programs (see T58 and T45)",
            "A non-JavaScript program, strong isolation, or many cores for the whole API",
            "More memory and IPC messages; `cluster` eases, but does not cure, the heavy route",
          ],
          [
            "Queue + worker processes",
            "The API publishes the work to a durable queue and workers (another deployment) consume it (see T53 and L107)",
            "Long task that can wait, needs retries and its own scaling",
            "More moving parts: queue, status, idempotency",
          ],
          [
            "Separate service",
            "A dedicated service, perhaps in another language, receives the work via HTTP, gRPC or a queue",
            "Permanent heavy load, or a language better suited to the computation",
            "Operational cost and a contract between services",
          ],
          [
            "Native module or WebAssembly",
            "The hot spot runs as compiled code called from JavaScript",
            "A specific, stable numeric loop that JavaScript handles poorly",
            "Build complexity; still occupies the caller’s thread unless run in a worker",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Taking the computation off the main loop",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          'import { Worker } from "node:worker_threads";',
          "",
          "function compute(input) {",
          "  return new Promise((resolve, reject) => {",
          '    const worker = new Worker(new URL("./compute.js", import.meta.url), { workerData: input });',
          '    worker.once("message", resolve);',
          '    worker.once("error", reject);',
          '    worker.once("exit", (code) => code !== 0 && reject(new Error(`worker exited with ${code}`)));',
          "  });",
          "}",
          "",
          "createServer(async (req, res) => {",
          '  if (req.url === "/report") {',
          "    const result = await compute({ rows: 5_000_000 }); // heavy, but off the loop",
          "    return res.end(JSON.stringify(result));",
          "  }",
          '  res.end("ok"); // keeps answering while the report is computed',
          "}).listen(3000);",
        ].join("\n"),
        nota: "`compute.js` reads `workerData`, runs the heavy loop and answers with `parentPort.postMessage(result)`. Creating one `Worker` per request is expensive and unbounded: in production use a fixed-size pool and handle the route’s error.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "First **eliminate** the work, then **take** what is left off the loop. Short and occasional: `worker_threads` in a pool. Long, heavy or able to wait: **queue + separate workers**, with the API only accepting the request and reporting status. What matters is that the capacity serving ordinary traffic never competes for CPU with the heavy task.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Scenario: one endpoint blocks the others",
        texto:
          "When one endpoint blocks all the others, the cause is almost never the router: it is a route occupying the single JavaScript thread (a loop, `*Sync`, a huge parse). The quick test is to call a trivial endpoint while the suspect route runs: if it is slow too, the loop is blocked. Fix the guilty route by following the playbook; `cluster` eases it (other processes keep serving), but each process still stalls while the task runs.",
      },
    ],
    armadilhas: [
      "Thinking `async`/`await` or a promise takes the computation off the main thread: an `async` function with a heavy loop still blocks everything.",
      "Skipping measurement and creating workers anyway: without knowing the bottleneck is CPU you add complexity and do not fix the slowness.",
      "Creating a new `Worker` for every request, with no limit: startup cost and CPU competition make latency worse.",
      "Using worker threads for I/O work (database, network, disk): the loop already handles that without blocking, and the worker only complicates things.",
    ],
    autoteste: [
      {
        pergunta: "Why does a heavy computation in one route make other routes slow, even inside an `async` function?",
        resposta:
          "Because JavaScript runs on a single thread and `async` does not create another: until the computation loop ends, the event loop dispatches no other event. Only I/O is delegated; CPU work has to leave the loop (worker, process, queue).",
      },
      {
        pergunta: "How do you isolate a heavy report from normal API traffic?",
        resposta:
          "The API only accepts the request and answers `202` with an id; a pool of workers or separate processes, with limited concurrency, does the computing and stores the result for lookup. If the queue fills up, the API refuses with `429` or `503`.",
      },
    ],
  },
};
