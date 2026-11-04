import type { Pergunta } from "../../tipos";

// Q12 · Redis vs Memcached
export const q12: Pergunta = {
  numero: 12,
  modulo: "cache-e-desempenho",
  metodo: "compare",
  pt: {
    titulo: "Redis vs Memcached",
    pergunta: "Quais são as diferenças entre Redis e Memcached?",
    porqueEsteMetodo:
      "Outro “X vs Y”: uma matriz de recursos e uma regra de decisão. O que a entrevista procura é saber que o Redis é um servidor de estruturas de dados e o Memcached é um cache puro.",
    resposta30s:
      "**Memcached** é um cache chave-valor simples, em memória, multithread e sem persistência. **Redis** é um servidor de **estruturas de dados** em memória (strings, hashes, listas, sets, sorted sets, streams…), com persistência opcional, replicação, cluster, scripts Lua, pub/sub e operações atômicas. Para cache simples e massivo os dois servem; o Redis cobre também sessões, filas, rankings, rate limit e locks, e por isso é o padrão.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "Memcached", "Redis"],
        linhas: [
          [
            "Tipos de dado",
            "Só strings/blobs",
            "Strings, hashes, listas, sets, sorted sets, streams, bitmaps, HyperLogLog, geo",
          ],
          ["Persistência", "Nenhuma (volátil)", "Opcional: snapshots (RDB) e log (AOF)"],
          [
            "Alta disponibilidade",
            "Sem nativa; o cliente distribui as chaves entre nós",
            "Replicação, Sentinel, Redis Cluster com sharding e failover",
          ],
          [
            "Threads",
            "Multithread (usa vários núcleos por nó)",
            "Comandos em uma thread (I/O em threads desde a 6.0); escala por cluster",
          ],
          ["Remoção de chaves", "LRU", "Várias políticas: allkeys-lru, allkeys-lfu, volatile-ttl, noeviction…"],
          [
            "Atomicidade",
            "`incr`/`cas` básicos",
            "`INCR`, transações `MULTI`, scripts Lua, operações atômicas por estrutura",
          ],
          ["Recursos extra", "Quase nenhum", "Pub/Sub, streams, expiração por chave, locks, geoespacial, módulos"],
          ["Tamanho máximo do valor", "1 MB por padrão", "Até 512 MB"],
          [
            "Melhor uso",
            "Cache puro e simples, grande, só volátil",
            "Cache + sessões, filas leves, rankings, rate limit, locks distribuídos",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Precisa só de cache chave-valor e quer o máximo de simplicidade e uso de vários núcleos por nó: Memcached resolve. Precisa de estruturas, persistência, replicação ou recursos além do cache: Redis (ou o fork aberto Valkey, criado depois da mudança de licença do Redis em 2024).",
      },
      {
        tipo: "codigo",
        titulo: "Um exemplo que só o Redis faz bem: ranking",
        legenda: "redis",
        codigo:
          'ZADD ranking 1520 "ana"\nZADD ranking 1810 "bruno"\nZINCRBY ranking 50 "ana"          # atômico\nZREVRANGE ranking 0 2 WITHSCORES  # top 3',
      },
    ],
    armadilhas: [
      "Tratar o Redis como banco primário sem configurar persistência e replicação: um restart pode perder dados.",
      "Usar `KEYS *` em produção: bloqueia a thread única; use `SCAN`.",
      "Um comando lento (grande `SORT`, valores enormes) bloqueia todos os clientes do nó.",
      "Não definir TTL nem política de eviction: a memória enche e o servidor recusa escritas ou derruba chaves.",
    ],
    autoteste: [
      {
        pergunta: "Por que o Redis é single-thread para comandos e ainda assim é rápido?",
        resposta:
          "Opera em memória, sem locks entre threads e com I/O multiplexado; evita custo de sincronização. Escala usando vários processos (cluster).",
      },
      {
        pergunta: "Quando o Memcached ainda faz sentido?",
        resposta:
          "Cache chave-valor simples e grande, só volátil, onde multithread por nó e simplicidade importam e você não precisa de estruturas nem persistência.",
      },
    ],
  },
  en: {
    titulo: "Redis vs Memcached",
    pergunta: "What are the differences between Redis and Memcached?",
    porqueEsteMetodo:
      "Another “X vs Y”: a feature matrix and a decision rule. What interviews look for is knowing that Redis is a data-structure server and Memcached is a pure cache.",
    resposta30s:
      "**Memcached** is a simple in-memory key-value cache, multithreaded and without persistence. **Redis** is an in-memory **data-structure server** (strings, hashes, lists, sets, sorted sets, streams…), with optional persistence, replication, clustering, Lua scripts, pub/sub and atomic operations. For plain massive caching both work; Redis also covers sessions, queues, leaderboards, rate limiting and locks, which is why it is the default.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "Memcached", "Redis"],
        linhas: [
          [
            "Data types",
            "Only strings/blobs",
            "Strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog, geo",
          ],
          ["Persistence", "None (volatile)", "Optional: snapshots (RDB) and log (AOF)"],
          [
            "High availability",
            "None built in; the client spreads keys across nodes",
            "Replication, Sentinel, Redis Cluster with sharding and failover",
          ],
          [
            "Threads",
            "Multithreaded (uses several cores per node)",
            "Commands on one thread (threaded I/O since 6.0); scales via cluster",
          ],
          ["Key eviction", "LRU", "Several policies: allkeys-lru, allkeys-lfu, volatile-ttl, noeviction…"],
          [
            "Atomicity",
            "Basic `incr`/`cas`",
            "`INCR`, `MULTI` transactions, Lua scripts, atomic per-structure operations",
          ],
          ["Extras", "Almost none", "Pub/Sub, streams, per-key expiry, locks, geospatial, modules"],
          ["Max value size", "1 MB by default", "Up to 512 MB"],
          [
            "Best use",
            "Pure, simple, large, volatile-only cache",
            "Cache + sessions, light queues, leaderboards, rate limiting, distributed locks",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Need only key-value caching and want maximum simplicity and multi-core use per node: Memcached does it. Need structures, persistence, replication or features beyond caching: Redis (or the open fork Valkey, created after Redis changed its license in 2024).",
      },
      {
        tipo: "codigo",
        titulo: "An example only Redis does well: a leaderboard",
        legenda: "redis",
        codigo:
          'ZADD leaderboard 1520 "ana"\nZADD leaderboard 1810 "bruno"\nZINCRBY leaderboard 50 "ana"          # atomic\nZREVRANGE leaderboard 0 2 WITHSCORES  # top 3',
      },
    ],
    armadilhas: [
      "Treating Redis as a primary database without configuring persistence and replication: a restart can lose data.",
      "Using `KEYS *` in production: it blocks the single thread; use `SCAN`.",
      "One slow command (a big `SORT`, huge values) blocks every client on the node.",
      "Not setting a TTL or an eviction policy: memory fills up and the server rejects writes or drops keys.",
    ],
    autoteste: [
      {
        pergunta: "Why is Redis single-threaded for commands and still fast?",
        resposta:
          "It works in memory, with no inter-thread locks and multiplexed I/O; it avoids synchronization cost. It scales by using several processes (cluster).",
      },
      {
        pergunta: "When does Memcached still make sense?",
        resposta:
          "Simple, large key-value caching, volatile only, where per-node multithreading and simplicity matter and you need neither structures nor persistence.",
      },
    ],
  },
};
