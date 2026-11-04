import type { Pergunta } from "../../tipos";

// Q45 · Módulo cluster
export const q45: Pergunta = {
  numero: 45,
  modulo: "turing-avancadas",
  metodo: "playbook",
  pt: {
    titulo: "Módulo cluster",
    pergunta: "Quando é necessário usar o módulo de cluster no Node.js?",
    porqueEsteMetodo:
      "“Quando é necessário?” pede critérios, não uma definição. Um playbook mostra a ordem certa: confirmar o gargalo, checar se a aplicação aguenta várias cópias, só então ligar o cluster e medir de novo.",
    resposta30s:
      "O módulo **`cluster`** sobe **vários processos Node.js na mesma máquina** que compartilham a mesma porta, para usar todos os núcleos (um processo Node.js executa o seu JavaScript em uma thread só). Use quando **um núcleo está saturado** por trabalho de CPU ou por muita concorrência e a aplicação **não guarda estado em memória**. Não resolve gargalo de banco ou de rede, e em nuvem as **réplicas atrás de um balanceador** costumam ocupar o seu lugar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: preciso do cluster?",
        passos: [
          {
            titulo: "Meça e localize o gargalo",
            texto:
              "Sinal a favor: um núcleo em 100% enquanto os outros ficam ociosos, e a latência sobe com a carga. Meça o uso de CPU do processo e o atraso do laço de eventos (`monitorEventLoopDelay`, de `node:perf_hooks`).",
          },
          {
            titulo: "Confirme que a espera é do seu JavaScript",
            texto:
              "Se o tempo vai para o banco, para uma API externa ou para o disco, mais processos só abrem mais conexões e esperam o mesmo tanto. Perfile o processo (veja Q52) antes de multiplicar.",
          },
          {
            titulo: "Tire o estado da memória",
            texto:
              "Cada worker tem o seu próprio heap. Sessões, cache em objeto, contadores, limite de taxa e filas em variáveis precisam ir para um armazenamento compartilhado (banco, Redis) antes de replicar.",
          },
          {
            titulo: "Suba os workers",
            texto:
              "O processo **primário** chama `cluster.fork()` uma vez por núcleo (`os.availableParallelism()`), e cada worker executa o servidor e chama `listen` na mesma porta. O primário distribui as conexões, em rodízio (round-robin) nas plataformas que suportam, exceto no Windows, onde o sistema operacional decide.",
          },
          {
            titulo: "Reponha os workers que morrem",
            texto:
              "Escute o evento `exit` no primário e faça um novo `fork()`. Critério: limite as tentativas, ou um worker que morre ao subir vira um laço infinito de reinícios.",
          },
          {
            titulo: "Encerre com elegância",
            texto:
              "No `SIGTERM`, o primário manda os workers pararem de aceitar conexões novas (`worker.disconnect()`), terminarem as requisições em andamento e saírem. Sinal de acerto: um deploy sem requisições cortadas.",
          },
          {
            titulo: "Meça de novo e compare alternativas",
            texto:
              "Compare vazão, latência e memória antes e depois. Se o ganho for pequeno, ou se a plataforma já escala por réplicas, o cluster não compensa.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cluster mínimo",
        legenda: "JavaScript",
        codigo:
          'import cluster from "node:cluster";\nimport { availableParallelism } from "node:os";\nimport { createServer } from "node:http";\n\nif (cluster.isPrimary) {\n  for (let i = 0; i < availableParallelism(); i++) cluster.fork();\n\n  cluster.on("exit", (worker, codigo) => {\n    console.log(`worker ${worker.process.pid} saiu (${codigo}); subindo outro`);\n    cluster.fork(); // em produção, limite as tentativas\n  });\n} else {\n  createServer((req, res) => {\n    res.end(`atendido pelo processo ${process.pid}\\n`);\n  }).listen(3000);\n}',
        nota: "`availableParallelism()` existe em versões recentes do Node.js; nas anteriores, use `os.cpus().length`. Confira a documentação do módulo `cluster` em nodejs.org.",
      },
      {
        tipo: "tabela",
        titulo: "Alternativas e quando preferi-las",
        colunas: ["Opção", "O que faz", "Quando preferir"],
        linhas: [
          [
            "`cluster`",
            "Vários processos Node.js na mesma máquina, compartilhando a porta",
            "Servidor único e você quer usar todos os núcleos com pouco código",
          ],
          [
            "PM2 em modo cluster",
            "Gerenciador de processos que usa o `cluster`, reinicia, monitora e recarrega sem parada",
            "Mesmo efeito sem escrever a lógica do primário, com supervisão e logs",
          ],
          [
            "Réplicas atrás de um balanceador (contêineres, orquestrador)",
            "Cada réplica é um processo Node.js; o balanceador distribui as requisições, inclusive entre máquinas",
            "Você já está na nuvem ou num orquestrador e escala por réplicas",
          ],
          [
            "`worker_threads`",
            "Threads dentro de um processo, para tarefas de CPU específicas",
            "Poucas tarefas pesadas (imagem, parsing, criptografia) sem replicar o servidor inteiro (veja Q59)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use `cluster` (ou um equivalente) quando **um processo satura um núcleo** com trabalho de CPU ou concorrência, **há núcleos sobrando** e a aplicação **não depende de memória compartilhada** entre requisições. Dispense quando o gargalo é banco, rede ou disco, ou quando você já escala por réplicas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Processos não compartilham memória",
        texto:
          "Um `Map` de sessões, um contador ou um cache em variável vira **uma cópia por worker**: a requisição seguinte pode cair em outro processo e não achar nada. Guarde o estado fora (banco, Redis). Conexões persistentes (WebSockets, long polling) podem exigir afinidade de sessão (sticky sessions) no balanceador. E lembre: `cluster` replica processos numa máquina só; não dá alta disponibilidade nem escala entre máquinas por si.",
      },
    ],
    armadilhas: [
      "Usar `cluster` para um gargalo que é o banco ou uma API externa: mais processos significam mais conexões e a mesma espera.",
      "Deixar estado em memória (sessões, cache, limite de taxa por IP): cada worker passa a ter o seu e os resultados divergem.",
      "Achar que o módulo cria um cluster de várias máquinas ou garante alta disponibilidade: a máquina continua sendo um ponto único de falha.",
      "Reiniciar workers sem limite e sem encerramento gracioso: um erro na subida vira laço de reinícios, e um deploy corta requisições em andamento.",
    ],
    autoteste: [
      {
        pergunta: "O que faz o processo primário e o que fazem os workers?",
        resposta:
          "O primário gerencia: cria os workers com `fork()`, repõe os que morrem e distribui as conexões. Cada worker executa o servidor, com o seu próprio laço de eventos e a sua própria memória.",
      },
      {
        pergunta: "Por que sessões guardadas em memória quebram com `cluster`?",
        resposta:
          "Cada worker tem a sua memória. A requisição seguinte pode ser atendida por outro worker, que não conhece a sessão. A solução é um armazenamento compartilhado (banco, Redis).",
      },
      {
        pergunta: "Se a lentidão vem de uma consulta lenta ao banco, o `cluster` ajuda?",
        resposta:
          "Não. O gargalo é externo ao processo; mais processos só abrem mais conexões. Otimize a consulta, o índice ou o pool de conexões.",
      },
    ],
  },
  en: {
    titulo: "Cluster module",
    pergunta: "When do you need the cluster module in Node.js?",
    porqueEsteMetodo:
      "“When do you need it?” asks for criteria, not a definition. A playbook gives the right order: confirm the bottleneck, check that the application tolerates several copies, only then turn on the cluster and measure again.",
    resposta30s:
      "The **`cluster`** module starts **several Node.js processes on the same machine** that share one port, so you can use every core (a Node.js process runs your JavaScript on a single thread). Use it when **one core is saturated** by CPU work or heavy concurrency and the application **keeps no state in memory**. It does not fix a database or network bottleneck, and in the cloud **replicas behind a load balancer** usually take its place.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do I need the cluster?",
        passos: [
          {
            titulo: "Measure and locate the bottleneck",
            texto:
              "A sign in its favor: one core at 100% while the others sit idle, and latency rises with load. Measure the process’s CPU usage and the event loop delay (`monitorEventLoopDelay`, from `node:perf_hooks`).",
          },
          {
            titulo: "Confirm the wait is in your JavaScript",
            texto:
              "If the time goes to the database, an external API or the disk, more processes only open more connections and wait just as long. Profile the process (see Q52) before multiplying it.",
          },
          {
            titulo: "Take state out of memory",
            texto:
              "Each worker has its own heap. Sessions, object caches, counters, rate limits and queues kept in variables must move to shared storage (database, Redis) before you replicate.",
          },
          {
            titulo: "Start the workers",
            texto:
              "The **primary** process calls `cluster.fork()` once per core (`os.availableParallelism()`), and each worker runs the server and calls `listen` on the same port. The primary distributes connections, round-robin on platforms that support it, except on Windows, where the operating system decides.",
          },
          {
            titulo: "Replace workers that die",
            texto:
              "Listen for the `exit` event in the primary and `fork()` again. Criterion: cap the attempts, or a worker that dies on startup turns into an endless restart loop.",
          },
          {
            titulo: "Shut down gracefully",
            texto:
              "On `SIGTERM`, the primary tells the workers to stop accepting new connections (`worker.disconnect()`), finish in-flight requests and exit. A sign of success: a deploy with no dropped requests.",
          },
          {
            titulo: "Measure again and compare alternatives",
            texto:
              "Compare throughput, latency and memory before and after. If the gain is small, or the platform already scales by replicas, the cluster is not worth it.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Minimal cluster",
        legenda: "JavaScript",
        codigo:
          'import cluster from "node:cluster";\nimport { availableParallelism } from "node:os";\nimport { createServer } from "node:http";\n\nif (cluster.isPrimary) {\n  for (let i = 0; i < availableParallelism(); i++) cluster.fork();\n\n  cluster.on("exit", (worker, code) => {\n    console.log(`worker ${worker.process.pid} exited (${code}); starting another`);\n    cluster.fork(); // in production, cap the attempts\n  });\n} else {\n  createServer((req, res) => {\n    res.end(`served by process ${process.pid}\\n`);\n  }).listen(3000);\n}',
        nota: "`availableParallelism()` exists in recent Node.js versions; in earlier ones use `os.cpus().length`. Check the `cluster` module documentation on nodejs.org.",
      },
      {
        tipo: "tabela",
        titulo: "Alternatives and when to prefer them",
        colunas: ["Option", "What it does", "When to prefer it"],
        linhas: [
          [
            "`cluster`",
            "Several Node.js processes on the same machine, sharing the port",
            "A single server where you want to use every core with little code",
          ],
          [
            "PM2 in cluster mode",
            "A process manager that uses `cluster`, restarts, monitors and reloads with no downtime",
            "The same effect without writing the primary’s logic, with supervision and logs",
          ],
          [
            "Replicas behind a load balancer (containers, orchestrator)",
            "Each replica is a Node.js process; the balancer distributes requests, including across machines",
            "You are already in the cloud or on an orchestrator and scale by replicas",
          ],
          [
            "`worker_threads`",
            "Threads inside one process, for specific CPU tasks",
            "A few heavy tasks (images, parsing, cryptography) without replicating the whole server (see Q59)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use `cluster` (or an equivalent) when **one process saturates a core** with CPU work or concurrency, **there are spare cores** and the application **does not depend on memory shared** between requests. Skip it when the bottleneck is the database, network or disk, or when you already scale by replicas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Processes do not share memory",
        texto:
          "A `Map` of sessions, a counter or a cache in a variable becomes **one copy per worker**: the next request may land on another process and find nothing. Keep state outside (database, Redis). Persistent connections (WebSockets, long polling) may need session affinity (sticky sessions) on the balancer. And remember: `cluster` replicates processes on a single machine; it does not give high availability or scaling across machines by itself.",
      },
    ],
    armadilhas: [
      "Using `cluster` for a bottleneck that is the database or an external API: more processes mean more connections and the same wait.",
      "Leaving state in memory (sessions, cache, per-IP rate limits): each worker ends up with its own and results diverge.",
      "Thinking the module builds a multi-machine cluster or guarantees high availability: the machine is still a single point of failure.",
      "Restarting workers with no cap and no graceful shutdown: a startup error becomes a restart loop, and a deploy cuts in-flight requests.",
    ],
    autoteste: [
      {
        pergunta: "What does the primary process do and what do the workers do?",
        resposta:
          "The primary manages: it creates workers with `fork()`, replaces those that die and distributes connections. Each worker runs the server, with its own event loop and its own memory.",
      },
      {
        pergunta: "Why do sessions kept in memory break with `cluster`?",
        resposta:
          "Each worker has its own memory. The next request may be served by another worker that does not know the session. The fix is shared storage (database, Redis).",
      },
      {
        pergunta: "If the slowness comes from a slow database query, does `cluster` help?",
        resposta:
          "No. The bottleneck is outside the process; more processes only open more connections. Optimize the query, the index or the connection pool.",
      },
    ],
  },
};
