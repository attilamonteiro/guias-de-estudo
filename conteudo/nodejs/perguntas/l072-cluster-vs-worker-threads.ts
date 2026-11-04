import type { Pergunta } from "../../tipos";

// L72 · Cluster vs worker threads
export const l072: Pergunta = {
  numero: 172,
  modulo: "linkedin-processos",
  metodo: "compare",
  pt: {
    titulo: "Cluster vs worker threads",
    pergunta: "Qual é a diferença entre Cluster e Worker Threads?",
    porqueEsteMetodo:
      "Os dois usam vários núcleos e por isso se confundem, mas resolvem problemas diferentes. A matriz os coloca lado a lado em unidade, memória, comunicação e custo, e a regra de decisão separa “atender mais requisições” de “tirar CPU pesada do laço”.",
    resposta30s:
      "O **`cluster`** cria **vários processos** Node.js (cada um com seu V8, memória e laço de eventos) que compartilham a mesma porta: serve para **escalar um servidor de rede por vários núcleos**. Os **`worker_threads`** criam **threads dentro de um processo**, mais leves, que trocam mensagens e podem compartilhar memória: servem para tirar **trabalho de CPU** da thread principal. Um escala requisições, o outro isola tarefas pesadas, e os dois podem ser combinados (veja T45).",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "`cluster`", "`worker_threads`"],
        linhas: [
          ["O que cria", "Vários **processos** Node.js (baseado em `fork`)", "**Threads** dentro de um mesmo processo"],
          [
            "Memória",
            "Heap separado por processo; nada é compartilhado",
            "Heap separado por thread; pode compartilhar `SharedArrayBuffer` e transferir `ArrayBuffer`",
          ],
          [
            "Comunicação",
            "IPC entre processos, com mensagens serializadas",
            "`postMessage` e `MessagePort` (clone estruturado ou transferência) e memória compartilhada",
          ],
          [
            "Rede",
            "Os workers atendem à mesma porta e o primário distribui as conexões",
            "Não foi feito para dividir a porta: o servidor costuma ficar na thread principal e os workers recebem tarefas",
          ],
          [
            "Custo",
            "Maior: um processo inteiro por worker",
            "Menor, mas cada worker ainda carrega o seu V8 e o seu laço de eventos",
          ],
          [
            "Isolamento e falhas",
            "Forte: um processo pode cair sem afetar os outros, e o primário o repõe",
            "Parcial: um erro não tratado vira evento `error` no pai, mas falta de memória ou falha de módulo nativo pode afetar o processo todo",
          ],
          [
            "Problema que resolve",
            "Aproveitar vários núcleos para atender mais requisições (E/S e concorrência)",
            "Tirar CPU pesada da thread principal para ela continuar respondendo",
          ],
          [
            "Exemplo",
            "Uma API HTTP que satura um núcleo",
            "Um endpoint que redimensiona imagens ou calcula hashes grandes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "O gargalo são **muitas requisições** e um núcleo saturado? **Cluster** (ou réplicas, ou PM2). O gargalo é **uma tarefa de CPU** que trava o laço e atrasa todos? **Worker threads**, de preferência num pool (veja L73). Se a espera é de banco, rede ou disco, nenhum dos dois ajuda: o laço de eventos já lida com E/S (veja T28).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nenhum dos dois acelera uma tarefa sozinho",
        texto:
          "O `cluster` distribui requisições entre processos, mas cada requisição roda inteira em um processo só: uma conta pesada continua pesada. O worker thread só ajuda se a tarefa for movida para ele ou dividida entre vários. E o estado em memória (sessões, cache) vira uma cópia por processo no cluster, então precisa ir para um armazenamento compartilhado.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Combinar os dois",
        texto:
          "É comum ter vários processos para escalar requisições (cluster, PM2 ou réplicas atrás de um balanceador), cada um com um pequeno pool de worker threads para a CPU pesada. Some tudo: processos vezes threads de CPU acima do número de núcleos só gera disputa e piora a latência. Na nuvem, as réplicas costumam substituir o `cluster` (veja T45 e T59).",
      },
    ],
    armadilhas: [
      "Usar worker threads para “escalar o servidor” ou para E/S: o laço de eventos já cuida de E/S, e escalar requisições é trabalho de cluster ou réplicas.",
      "Esperar que o `cluster` acelere uma única operação pesada: ele só distribui requisições diferentes entre os processos.",
      "Deixar estado em memória (sessões, cache, limite de taxa) sob `cluster`: cada processo tem o seu e os resultados divergem.",
      "Combinar os dois sem contar os núcleos: processos vezes workers acima do que a máquina tem pioram a latência.",
    ],
    autoteste: [
      {
        pergunta:
          "Qual usar para uma API que satura um núcleo com muitas requisições, e qual para um endpoint que redimensiona imagens?",
        resposta:
          "Para a API que satura um núcleo, `cluster` (ou réplicas), que espalha as requisições por vários processos. Para o endpoint de imagens, `worker_threads` num pool, que tira a CPU pesada da thread principal.",
      },
      {
        pergunta: "Dois workers do cluster compartilham variáveis? E duas worker threads?",
        resposta:
          "Os workers do cluster são processos e não compartilham nada. As worker threads também têm heaps separados e só compartilham memória de fato via `SharedArrayBuffer`.",
      },
    ],
  },
  en: {
    titulo: "Cluster vs worker threads",
    pergunta: "What is the difference between Cluster and Worker Threads?",
    porqueEsteMetodo:
      "Both use several cores, which is why they get confused, but they solve different problems. The matrix puts them side by side on unit, memory, communication and cost, and the decision rule separates “serve more requests” from “take heavy CPU work off the loop”.",
    resposta30s:
      "**`cluster`** creates **several Node.js processes** (each with its own V8, memory and event loop) that share the same port: it is for **scaling a network server across cores**. **`worker_threads`** create **threads inside one process**, lighter ones, that exchange messages and can share memory: they are for taking **CPU work** off the main thread. One scales requests, the other isolates heavy tasks, and the two can be combined (see T45).",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "`cluster`", "`worker_threads`"],
        linhas: [
          ["What it creates", "Several Node.js **processes** (built on `fork`)", "**Threads** inside a single process"],
          [
            "Memory",
            "A separate heap per process; nothing is shared",
            "A separate heap per thread; can share `SharedArrayBuffer` and transfer `ArrayBuffer`",
          ],
          [
            "Communication",
            "IPC between processes, with serialized messages",
            "`postMessage` and `MessagePort` (structured clone or transfer) and shared memory",
          ],
          [
            "Network",
            "Workers serve the same port and the primary distributes connections",
            "Not built for splitting the port: the server usually stays on the main thread and workers receive tasks",
          ],
          [
            "Cost",
            "Higher: a whole process per worker",
            "Lower, but each worker still carries its own V8 and event loop",
          ],
          [
            "Isolation and failures",
            "Strong: a process can crash without affecting the others, and the primary replaces it",
            "Partial: an unhandled error becomes an `error` event in the parent, but running out of memory or a native-module fault can affect the whole process",
          ],
          [
            "Problem it solves",
            "Using several cores to serve more requests (I/O and concurrency)",
            "Taking heavy CPU work off the main thread so it keeps responding",
          ],
          [
            "Example",
            "An HTTP API that saturates one core",
            "An endpoint that resizes images or computes large hashes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Is the bottleneck **many requests** and one saturated core? **Cluster** (or replicas, or PM2). Is it **one CPU task** that freezes the loop and delays everyone? **Worker threads**, preferably in a pool (see L73). If the wait is on the database, network or disk, neither helps: the event loop already handles I/O (see T28).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Neither speeds up a single task by itself",
        texto:
          "`cluster` spreads requests across processes, but each request runs whole in a single process: a heavy computation stays heavy. A worker thread only helps if the task is moved to it or split among several. And in-memory state (sessions, cache) becomes one copy per process under cluster, so it must move to shared storage.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Combining the two",
        texto:
          "It is common to have several processes to scale requests (cluster, PM2 or replicas behind a load balancer), each with a small pool of worker threads for heavy CPU work. Add it all up: processes times CPU threads above the number of cores only creates contention and worsens latency. In the cloud, replicas usually replace `cluster` (see T45 and T59).",
      },
    ],
    armadilhas: [
      "Using worker threads to “scale the server” or for I/O: the event loop already handles I/O, and scaling requests is a job for cluster or replicas.",
      "Expecting `cluster` to speed up a single heavy operation: it only spreads different requests across processes.",
      "Leaving in-memory state (sessions, cache, rate limits) under `cluster`: each process has its own and results diverge.",
      "Combining both without counting cores: processes times workers beyond what the machine has worsen latency.",
    ],
    autoteste: [
      {
        pergunta:
          "Which would you use for an API that saturates one core with many requests, and which for an endpoint that resizes images?",
        resposta:
          "For the API that saturates a core, `cluster` (or replicas), which spreads requests across processes. For the image endpoint, `worker_threads` in a pool, which takes the heavy CPU work off the main thread.",
      },
      {
        pergunta: "Do two cluster workers share variables? And two worker threads?",
        resposta:
          "Cluster workers are processes and share nothing. Worker threads also have separate heaps and only truly share memory through `SharedArrayBuffer`.",
      },
    ],
  },
};
