import type { Pergunta } from "../../tipos";

// Q50 · Escalar uma aplicação Node.js
export const q50: Pergunta = {
  numero: 50,
  modulo: "turing-avancadas",
  metodo: "firstprinciples",
  pt: {
    titulo: "Escalar uma aplicação Node.js",
    pergunta: "Como escalar um aplicativo Node.js?",
    porqueEsteMetodo:
      "Escalar não é uma lista de ferramentas: é uma sequência em que cada passo resolve o gargalo que o anterior revelou. Partir de um processo único e acrescentar uma restrição por vez mostra por que cada peça existe.",
    resposta30s:
      "Comece **medindo** (latência por percentil, CPU, atraso do laço de eventos) e só então escale o gargalo. Em ordem: tire o trabalho de CPU do laço de eventos; use **todos os núcleos** (`cluster`, PM2 ou um contêiner por núcleo); rode **várias instâncias atrás de um balanceador**, o que exige uma aplicação **sem estado** (sessão, cache e arquivos fora da memória do processo); some **cache**, **fila com workers** e cuide do **banco** (pool, índices, réplicas). Microsserviços ficam por último.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. Meça antes de escalar",
            texto:
              "Sem número você está adivinhando. Observe latência por percentil (p95, p99), CPU, memória, taxa de erro e o **atraso do laço de eventos**. O gargalo pode estar no banco, na rede ou numa função específica, e não no Node.",
          },
          {
            titulo: "1. A versão mais simples",
            texto:
              "Um processo Node numa máquina; a thread de JavaScript executa um callback de cada vez. → Quebra: usa um núcleo só e, se um callback gasta CPU (JSON enorme, criptografia, laço pesado), **todas as requisições esperam**. Conserto: otimizar o código, mover o trabalho pesado para `worker_threads` ou para uma fila e, se preciso, usar uma máquina maior (escala vertical, que tem teto).",
          },
          {
            titulo: "2. Usar todos os núcleos",
            texto:
              "Um processo por núcleo: módulo `cluster` (veja Q45), PM2 em modo cluster ou, em contêineres, uma réplica por núcleo disponível. → Quebra: cada processo tem a sua memória, então sessão, cache e contadores guardados em variáveis deixam de ser coerentes entre eles.",
          },
          {
            titulo: "3. Várias máquinas",
            texto:
              "Instâncias idênticas atrás de um **balanceador de carga** (Nginx, HAProxy ou o da nuvem), com health check para tirar do ar a instância doente. → Quebra: quem cai em outra instância perde a sessão, o arquivo gravado em disco local some e a tarefa agendada roda em todas.",
          },
          {
            titulo: "4. Aplicação sem estado",
            texto:
              "O estado sai da memória do processo: sessão num armazenamento compartilhado (como o Redis) ou em token assinado, arquivos em armazenamento de objetos, configuração por variáveis de ambiente. Agora qualquer instância atende qualquer requisição e dá para criar ou encerrar instâncias à vontade (autoescala), desde que o encerramento seja gracioso.",
          },
          {
            titulo: "5. Cache",
            texto:
              "Cache compartilhado, cache HTTP e CDN para o que é estático ou público, memoização de cálculos caros. → Quebra: dado velho. Defina o TTL e quando invalidar.",
          },
          {
            titulo: "6. Tirar trabalho do caminho da requisição",
            texto:
              "O que é lento ou pode esperar (e-mail, relatório, vídeo) vira job numa fila, processado por workers que escalam separados da API (veja Q53). A API responde rápido e a fila absorve os picos.",
          },
          {
            titulo: "7. O banco de dados",
            texto:
              "Costuma ser o próximo gargalo. **Instâncias × tamanho do pool = conexões abertas no banco**, e ele tem um limite. Melhore consultas e índices, dimensione o pool, use réplicas de leitura e, só depois, particionamento.",
          },
          {
            titulo: "8. Dividir o sistema (último recurso)",
            texto:
              "Separar partes em serviços independentes quando times ou perfis de carga justificarem (veja o guia de backend sobre monolito e microsserviços). Traz rede, falhas parciais e operação mais cara: só depois de esgotar os passos anteriores.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que não pode ficar na memória do processo",
        colunas: ["Estado local", "Para onde levar", "Por quê"],
        linhas: [
          [
            "Sessão do usuário",
            "Armazenamento compartilhado (Redis) ou token assinado",
            "Qualquer instância precisa reconhecer a pessoa",
          ],
          [
            "Cache em variável",
            "Cache compartilhado ou cache HTTP/CDN",
            "Cada processo teria uma cópia diferente e velha",
          ],
          ["Arquivos enviados", "Armazenamento de objetos", "O disco local pertence a uma instância só e some com ela"],
          ["Tarefa agendada (cron)", "Um único agendador ou uma fila", "Com N instâncias, a tarefa rodaria N vezes"],
          [
            "Conexões WebSocket",
            "Mensageria entre instâncias (pub/sub) ou balanceamento por afinidade",
            "Quem recebeu a conexão nem sempre é quem recebe o evento",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Passo 0 na prática: medir o atraso do laço de eventos",
        legenda: "JavaScript",
        codigo: `import { monitorEventLoopDelay } from "node:perf_hooks";

const atraso = monitorEventLoopDelay({ resolution: 20 });
atraso.enable();

setInterval(() => {
  // os valores do histograma estão em nanossegundos
  const p99 = atraso.percentile(99) / 1e6;
  console.log("atraso do laço de eventos, p99: " + p99.toFixed(1) + " ms");
  atraso.reset();
}, 10000);`,
        nota: "Se esse número sobe, algo síncrono está segurando o laço. Mais instâncias só escondem o problema; ache a função.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Escale o gargalo, não a aplicação inteira",
        texto:
          "Mais instâncias só ajudam quando o limite é a capacidade de atender requisições independentes. Se uma função bloqueia o laço de eventos, ou se o banco está saturado, multiplicar o Node piora a situação (mais conexões, o mesmo gargalo). Meça, mude uma coisa e meça de novo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cluster com estado em memória",
        texto:
          "Ligar vários processos mantendo sessão, cache ou contadores em variáveis é o erro mais comum: funciona no teste com um processo e quebra de forma intermitente em produção, porque o comportamento passa a depender de qual processo atendeu a requisição.",
      },
    ],
    armadilhas: [
      "Escalar antes de medir: dobrar as instâncias quando o gargalo é uma consulta lenta só dobra a pressão sobre o banco.",
      "Ligar vários processos mantendo sessão, cache ou contadores em variáveis: o resultado depende de qual processo atendeu.",
      "Esquecer que cada instância abre o seu próprio pool: instâncias × conexões por instância pode passar do limite do banco.",
      "Tratar trabalho de CPU como se fosse E/S: um laço pesado bloqueia o laço de eventos, e réplicas só diluem o sintoma (use `worker_threads` ou uma fila).",
    ],
    autoteste: [
      {
        pergunta: "Por que a aplicação precisa ser sem estado (stateless) para escalar horizontalmente?",
        resposta:
          "Porque o balanceador pode mandar a próxima requisição para qualquer instância. Se o estado está na memória de uma delas, as outras não o enxergam; ele precisa ficar em um armazenamento compartilhado.",
      },
      {
        pergunta: "O que fazer antes de adicionar instâncias?",
        resposta:
          "Medir: latência por percentil, CPU, atraso do laço de eventos e tempo gasto no banco, para saber onde está o gargalo.",
      },
      {
        pergunta: "O `cluster` resolve um banco de dados lento?",
        resposta:
          "Não. Mais processos só abrem mais conexões e aumentam a pressão sobre o banco; é preciso otimizar as consultas, dimensionar o pool ou usar réplicas.",
      },
    ],
  },
  en: {
    titulo: "Scaling a Node.js application",
    pergunta: "How do you scale a Node.js application?",
    porqueEsteMetodo:
      "Scaling is not a list of tools: it is a sequence in which each step solves the bottleneck the previous one revealed. Starting from a single process and adding one constraint at a time shows why each piece exists.",
    resposta30s:
      "Start by **measuring** (latency percentiles, CPU, event loop delay) and only then scale the bottleneck. In order: take CPU work off the event loop; use **all cores** (`cluster`, PM2 or one container per core); run **several instances behind a load balancer**, which requires a **stateless** application (session, cache and files outside the process memory); add **caching**, a **queue with workers** and take care of the **database** (pool, indexes, replicas). Microservices come last.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. Measure before you scale",
            texto:
              "Without numbers you are guessing. Watch latency percentiles (p95, p99), CPU, memory, error rate and the **event loop delay**. The bottleneck may be the database, the network or one specific function, not Node itself.",
          },
          {
            titulo: "1. The simplest version",
            texto:
              "One Node process on one machine; the JavaScript thread runs one callback at a time. → Breaks: it uses a single core and, if a callback burns CPU (huge JSON, cryptography, a heavy loop), **every request waits**. Fix: optimize the code, move heavy work to `worker_threads` or a queue and, if needed, use a bigger machine (vertical scaling, which has a ceiling).",
          },
          {
            titulo: "2. Use all cores",
            texto:
              "One process per core: the `cluster` module (see Q45), PM2 in cluster mode or, in containers, one replica per available core. → Breaks: each process has its own memory, so sessions, caches and counters kept in variables stop being consistent across them.",
          },
          {
            titulo: "3. Several machines",
            texto:
              "Identical instances behind a **load balancer** (Nginx, HAProxy or the cloud’s own), with a health check to pull a sick instance out. → Breaks: someone who lands on another instance loses the session, a file written to local disk disappears and the scheduled task runs on all of them.",
          },
          {
            titulo: "4. A stateless application",
            texto:
              "State leaves the process memory: sessions in a shared store (such as Redis) or in a signed token, files in object storage, configuration through environment variables. Now any instance can serve any request and you can add or remove instances freely (autoscaling), as long as shutdown is graceful.",
          },
          {
            titulo: "5. Caching",
            texto:
              "Shared cache, HTTP cache and a CDN for what is static or public, memoization for expensive calculations. → Breaks: stale data. Define the TTL and when to invalidate.",
          },
          {
            titulo: "6. Take work off the request path",
            texto:
              "Anything slow or able to wait (email, report, video) becomes a job in a queue, processed by workers that scale separately from the API (see Q53). The API answers quickly and the queue absorbs spikes.",
          },
          {
            titulo: "7. The database",
            texto:
              "It is usually the next bottleneck. **Instances × pool size = open database connections**, and the database has a limit. Improve queries and indexes, size the pool, use read replicas and only then partitioning.",
          },
          {
            titulo: "8. Split the system (last resort)",
            texto:
              "Separate parts into independent services when teams or load profiles justify it (see the backend guide on monolith vs microservices). It brings network calls, partial failures and costlier operations: only after the previous steps are exhausted.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What cannot stay in the process memory",
        colunas: ["Local state", "Where to move it", "Why"],
        linhas: [
          ["User session", "Shared store (Redis) or a signed token", "Any instance must recognize the person"],
          ["Cache in a variable", "Shared cache or HTTP cache/CDN", "Each process would hold a different, stale copy"],
          ["Uploaded files", "Object storage", "Local disk belongs to one instance and disappears with it"],
          ["Scheduled task (cron)", "A single scheduler or a queue", "With N instances, the task would run N times"],
          [
            "WebSocket connections",
            "Messaging between instances (pub/sub) or affinity-based balancing",
            "Whoever got the connection is not always who receives the event",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Step 0 in practice: measuring event loop delay",
        legenda: "JavaScript",
        codigo: `import { monitorEventLoopDelay } from "node:perf_hooks";

const delay = monitorEventLoopDelay({ resolution: 20 });
delay.enable();

setInterval(() => {
  // histogram values are in nanoseconds
  const p99 = delay.percentile(99) / 1e6;
  console.log("event loop delay, p99: " + p99.toFixed(1) + " ms");
  delay.reset();
}, 10000);`,
        nota: "If this number climbs, something synchronous is holding the loop. More instances only hide the problem; find the function.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Scale the bottleneck, not the whole application",
        texto:
          "More instances only help when the limit is the capacity to serve independent requests. If one function blocks the event loop, or the database is saturated, multiplying Node makes things worse (more connections, the same bottleneck). Measure, change one thing and measure again.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cluster with in-memory state",
        texto:
          "Turning on several processes while keeping sessions, caches or counters in variables is the most common mistake: it works in a test with one process and breaks intermittently in production, because behavior now depends on which process served the request.",
      },
    ],
    armadilhas: [
      "Scaling before measuring: doubling instances when the bottleneck is a slow query only doubles the pressure on the database.",
      "Running several processes while keeping sessions, caches or counters in variables: the result depends on which process answered.",
      "Forgetting that each instance opens its own pool: instances × connections per instance can exceed the database limit.",
      "Treating CPU work as if it were I/O: a heavy loop blocks the event loop, and replicas only dilute the symptom (use `worker_threads` or a queue).",
    ],
    autoteste: [
      {
        pergunta: "Why must the application be stateless to scale horizontally?",
        resposta:
          "Because the load balancer may send the next request to any instance. If state lives in one instance’s memory, the others cannot see it; it has to live in a shared store.",
      },
      {
        pergunta: "What should you do before adding instances?",
        resposta:
          "Measure: latency percentiles, CPU, event loop delay and time spent in the database, to find out where the bottleneck is.",
      },
      {
        pergunta: "Does `cluster` fix a slow database?",
        resposta:
          "No. More processes only open more connections and add pressure on the database; you need to optimize queries, size the pool or use replicas.",
      },
    ],
  },
};
