import type { Pergunta } from "../../tipos";

// Q24 · Latência e escalabilidade
export const q24: Pergunta = {
  numero: 24,
  modulo: "turing-intermediarias",
  metodo: "whys",
  pt: {
    titulo: "Latência e escalabilidade",
    pergunta: "O que causa latência do servidor e impede a escalabilidade no Node.js?",
    porqueEsteMetodo:
      "Latência alta e falta de escala são sintomas; a causa fica várias camadas abaixo. Perguntar “por quê?” em cadeia leva do sintoma (requisições lentas) ao que realmente precisa mudar.",
    resposta30s:
      "Quase sempre é o **laço de eventos ocupado**: o JavaScript roda em uma thread, então CPU pesada ou E/S síncrona (`readFileSync`, `pbkdf2Sync`) faz todas as requisições esperarem. Somam-se **dependências lentas** (consulta sem índice, sem pool de conexões, sem cache, sem timeout), **payloads grandes**, **vazamentos de memória** e rodar em **um só núcleo** com estado na memória. O conserto: manter o laço livre, **medir** (atraso do laço, p95/p99) e escalar com várias instâncias sem estado.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que um servidor Node.js fica lento se, na maior parte do tempo, ele só espera por E/S?",
            resposta:
              "Porque o seu JavaScript roda em **uma única thread**. Enquanto ela executa um trecho longo de código (um laço grande, um `JSON.parse` gigante, uma regex catastrófica, uma chamada `*Sync`), nenhuma outra requisição avança. A latência de cada pedido vira “espera na fila do laço” mais o trabalho dele.",
          },
          {
            pergunta: "Por que a latência dispara quando a carga aumenta?",
            resposta:
              "Porque é uma fila: se os pedidos chegam mais depressa do que o servidor consegue processar, eles se acumulam. Perto da saturação, um pouco mais de carga gera muita espera, e as caudas (p95, p99) explodem antes da média. Conexões abertas e uso de memória crescem junto.",
          },
          {
            pergunta: "Por que cada requisição demora tanto, mesmo sem bloquear o laço?",
            resposta:
              "Porque quase todo o tempo vai para o que o servidor espera: consultas sem índice, uma conexão nova de banco aberta a cada pedido (sem pool), chamadas a outros serviços feitas em sequência e sem timeout, respostas enormes para serializar e nenhum cache para leituras repetidas.",
          },
          {
            pergunta: "Por que adicionar CPU ou máquinas não resolve de imediato?",
            resposta:
              "Porque um processo Node.js executa o JavaScript em um núcleo só: os outros ficam parados sem `cluster` ou várias instâncias. E, se sessão, cache e uploads vivem na memória do processo, não dá para replicar sem quebrar nada. Vazamentos (ouvintes, caches sem limite) ainda aumentam o trabalho do coletor de lixo e suas pausas.",
          },
          {
            pergunta: "Por que esses problemas só aparecem em produção?",
            resposta:
              "Porque quase ninguém mede: em desenvolvimento a carga é pequena e a média parece boa. Sem métricas (atraso do laço de eventos, p95/p99, memória e GC, tempo de cada dependência) e sem perfil de CPU, o gargalo real fica invisível e a correção vira palpite.",
          },
        ],
        causaRaiz:
          "Trabalho que **ocupa o laço de eventos** (CPU e E/S síncrona), somado a **dependências sem limites** e a **um único processo com estado local**, tudo sem **medição**. Conserte nesta ordem: laço livre, dependências saudáveis, várias instâncias sem estado.",
      },
      {
        tipo: "codigo",
        titulo: "Bloquear o laço, não bloquear e medir o atraso",
        legenda: "JavaScript",
        codigo:
          "import { monitorEventLoopDelay } from 'node:perf_hooks';\nimport { pbkdf2, pbkdf2Sync } from 'node:crypto';\nimport { promisify } from 'node:util';\n\nconst pbkdf2Async = promisify(pbkdf2);\n\n// Ruim: trava o laço de eventos até terminar\nexport function hashBloqueante(senha) {\n  return pbkdf2Sync(senha, 'sal', 100_000, 64, 'sha512');\n}\n\n// Melhor: a versão assíncrona roda no pool de threads do libuv\nexport function hashNaoBloqueante(senha) {\n  return pbkdf2Async(senha, 'sal', 100_000, 64, 'sha512');\n}\n\n// Medir: quanto o laço atrasa (o histograma usa nanossegundos)\nconst atraso = monitorEventLoopDelay({ resolution: 20 });\natraso.enable();\nsetInterval(() => console.log('p99 (ms):', atraso.percentile(99) / 1e6), 10_000);",
        nota: "Exemplo ilustrativo: em produção use um sal aleatório por senha (veja Q46).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Ordem de ataque",
        texto:
          "(1) **Meça**: atraso do laço de eventos, p95/p99 e tempo de cada dependência. (2) **Libere o laço**: troque `*Sync` por versões assíncronas e mova CPU pesada para `worker_threads` ou para uma fila (Q59, Q53). (3) **Cure as dependências**: índices, pool, cache, timeouts, chamadas independentes em paralelo com `Promise.all`. (4) **Só então multiplique**: `cluster`, várias instâncias atrás de um balanceador e aplicação sem estado (Q45, Q50).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "async não é paralelismo",
        texto:
          "`async`/`await` só libera a thread enquanto se **espera** por E/S. Um laço de CPU dentro de uma função `async` bloqueia exatamente como em qualquer outra. E latência não é vazão: uma API pode atender muitos pedidos por segundo e ainda assim ter um p99 péssimo para quem caiu na fila.",
      },
    ],
    armadilhas: [
      "Chamar versões `*Sync` (`readFileSync`, `execSync`) dentro de um handler de requisição; no script de inicialização, tudo bem.",
      "Olhar só a latência média: o estrago está nas caudas (p95, p99), onde a fila aparece.",
      "Escalar horizontalmente sem tirar o estado da memória (sessão, cache local, upload): as instâncias passam a divergir.",
      "Achar que `async`/`await` torna CPU pesada não bloqueante: só a espera por E/S é liberada.",
    ],
    autoteste: [
      {
        pergunta: "Por que uma função `async` com um laço longo de CPU ainda trava o servidor?",
        resposta:
          "Porque o JavaScript continua em uma única thread: `async` só devolve o controle quando há uma espera (`await` de E/S). Um laço de CPU ocupa a thread até terminar, e as outras requisições aguardam.",
      },
      {
        pergunta: "Como saber se o laço de eventos está sobrecarregado?",
        resposta:
          "Medindo o atraso do laço (`monitorEventLoopDelay` de `node:perf_hooks`, ou `performance.eventLoopUtilization()`) junto com os percentis de latência p95/p99 e um perfil de CPU.",
      },
      {
        pergunta: "Qual a diferença entre latência e escalabilidade?",
        resposta:
          "Latência é o tempo que uma requisição leva. Escalabilidade é manter a latência aceitável quando a carga cresce, seja por usar melhor cada processo, seja por somar instâncias.",
      },
    ],
  },
  en: {
    titulo: "Latency and scalability",
    pergunta: "What causes server latency and prevents scalability in Node.js?",
    porqueEsteMetodo:
      "High latency and poor scaling are symptoms; the cause sits several layers below. Asking “why?” in a chain takes you from the symptom (slow requests) to what really has to change.",
    resposta30s:
      "Almost always it is a **busy event loop**: JavaScript runs on one thread, so heavy CPU work or synchronous I/O (`readFileSync`, `pbkdf2Sync`) makes every request wait. On top of that come **slow dependencies** (unindexed queries, no connection pool, no cache, no timeout), **large payloads**, **memory leaks** and running on **a single core** with state in memory. The fix: keep the loop free, **measure** (loop delay, p95/p99) and scale with several stateless instances.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does a Node.js server get slow if, most of the time, it only waits for I/O?",
            resposta:
              "Because its JavaScript runs on **a single thread**. While it executes a long piece of code (a big loop, a gigantic `JSON.parse`, a catastrophic regex, a `*Sync` call), no other request moves forward. The latency of each request becomes “waiting in the loop’s queue” plus its own work.",
          },
          {
            pergunta: "Why does latency spike when load grows?",
            resposta:
              "Because it is a queue: if requests arrive faster than the server can process them, they pile up. Near saturation a little more load causes a lot of waiting, and the tails (p95, p99) blow up before the average does. Open connections and memory use grow with it.",
          },
          {
            pergunta: "Why does each request take so long even without blocking the loop?",
            resposta:
              "Because almost all the time goes to what the server waits for: unindexed queries, a new database connection opened for every request (no pool), calls to other services made in sequence and without a timeout, huge responses to serialize and no cache for repeated reads.",
          },
          {
            pergunta: "Why does adding CPU or machines not fix it right away?",
            resposta:
              "Because a Node.js process runs JavaScript on one core: the others sit idle without `cluster` or multiple instances. And if sessions, cache and uploads live in the process memory, you cannot replicate without breaking something. Leaks (listeners, unbounded caches) also increase the garbage collector’s work and pauses.",
          },
          {
            pergunta: "Why do these problems only show up in production?",
            resposta:
              "Because almost nobody measures: in development the load is small and the average looks fine. Without metrics (event loop delay, p95/p99, memory and GC, time per dependency) and without a CPU profile, the real bottleneck stays invisible and the fix becomes a guess.",
          },
        ],
        causaRaiz:
          "Work that **occupies the event loop** (CPU and synchronous I/O), plus **unbounded dependencies** and **a single process with local state**, all without **measurement**. Fix them in this order: free loop, healthy dependencies, several stateless instances.",
      },
      {
        tipo: "codigo",
        titulo: "Blocking the loop, not blocking it, and measuring the delay",
        legenda: "JavaScript",
        codigo:
          "import { monitorEventLoopDelay } from 'node:perf_hooks';\nimport { pbkdf2, pbkdf2Sync } from 'node:crypto';\nimport { promisify } from 'node:util';\n\nconst pbkdf2Async = promisify(pbkdf2);\n\n// Bad: freezes the event loop until it finishes\nexport function blockingHash(password) {\n  return pbkdf2Sync(password, 'salt', 100_000, 64, 'sha512');\n}\n\n// Better: the async version runs on the libuv thread pool\nexport function nonBlockingHash(password) {\n  return pbkdf2Async(password, 'salt', 100_000, 64, 'sha512');\n}\n\n// Measure: how much the loop lags (the histogram uses nanoseconds)\nconst delay = monitorEventLoopDelay({ resolution: 20 });\ndelay.enable();\nsetInterval(() => console.log('p99 (ms):', delay.percentile(99) / 1e6), 10_000);",
        nota: "Illustrative example: in production use a random salt per password (see Q46).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Order of attack",
        texto:
          "(1) **Measure**: event loop delay, p95/p99 and time per dependency. (2) **Free the loop**: replace `*Sync` calls with asynchronous versions and move heavy CPU work to `worker_threads` or a queue (Q59, Q53). (3) **Heal the dependencies**: indexes, pool, cache, timeouts, independent calls in parallel with `Promise.all`. (4) **Only then multiply**: `cluster`, several instances behind a load balancer and a stateless application (Q45, Q50).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "async is not parallelism",
        texto:
          "`async`/`await` only frees the thread while it **waits** for I/O. A CPU loop inside an `async` function blocks exactly as in any other. And latency is not throughput: an API can serve many requests per second and still have a terrible p99 for whoever landed in the queue.",
      },
    ],
    armadilhas: [
      "Calling `*Sync` versions (`readFileSync`, `execSync`) inside a request handler; in a startup script, that is fine.",
      "Looking only at average latency: the damage is in the tails (p95, p99), where the queue shows up.",
      "Scaling horizontally without moving state out of memory (sessions, local cache, uploads): instances start to diverge.",
      "Thinking `async`/`await` makes heavy CPU work non-blocking: only the wait for I/O is released.",
    ],
    autoteste: [
      {
        pergunta: "Why does an `async` function with a long CPU loop still freeze the server?",
        resposta:
          "Because JavaScript is still on a single thread: `async` only hands control back when there is a wait (an I/O `await`). A CPU loop holds the thread until it finishes, and the other requests wait.",
      },
      {
        pergunta: "How do you tell whether the event loop is overloaded?",
        resposta:
          "By measuring the loop delay (`monitorEventLoopDelay` from `node:perf_hooks`, or `performance.eventLoopUtilization()`) alongside p95/p99 latency percentiles and a CPU profile.",
      },
      {
        pergunta: "What is the difference between latency and scalability?",
        resposta:
          "Latency is how long a request takes. Scalability is keeping latency acceptable as load grows, whether by using each process better or by adding instances.",
      },
    ],
  },
};
