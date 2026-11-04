/* Perguntas 11-20. Mesmo esquema de q-a.js. */
window.QS = window.QS || [];

/* ============ 11 · Cache ============ */
window.QS.push({
  n: 11, g: "C", m: "feynman",
  pt: {
    s: "Como funciona o cache",
    q: "Como funciona o cache e quais são algumas estratégias comuns de cache?",
    why: "Cache é uma ideia simples que todo mundo já usa sem perceber (a mesa de trabalho). A analogia dá a intuição e o ponto onde ela quebra, a cópia desatualizada, é a parte difícil da disciplina.",
    one: "Cache é uma **cópia temporária de um dado caro de obter**, guardada num lugar mais rápido e mais perto de quem usa. Funciona porque o acesso tem **localidade**: poucos dados concentram a maioria dos pedidos. As estratégias definem **quem preenche o cache** (cache-aside, read-through), **quando grava** (write-through, write-behind) e **como o dado sai** (TTL, invalidação, LRU). A parte difícil é a invalidação: a cópia pode ficar velha.",
    b: [
      { t: "an",
        s: "Os documentos que você usa todo dia ficam na mesa; o resto fica no arquivo do porão. A mesa é pequena e rápida, o porão é grande e lento. Achou na mesa: acerto (hit). Teve que descer ao porão: erro (miss).",
        k: "O cache fica entre quem pede e a fonte lenta (banco, API externa, cálculo pesado). Em cada pedido: se a chave está no cache, devolve (**hit**, microssegundos); se não, busca na fonte, guarda e devolve (**miss**). O que importa é o **hit ratio**. Existem camadas: cache do navegador, CDN, cache da aplicação (Redis, em memória), cache do banco e dos buffers do próprio banco. Funciona porque poucos itens recebem a maioria das leituras (distribuição de Pareto).",
        b: "A cópia da mesa não sabe quando o original do porão mudou. Em sistemas, o cache pode ficar silenciosamente desatualizado, e a memória do cache é limitada, então algo precisa sair para entrar algo novo." },
      { t: "tb", ti: "Estratégias de leitura e escrita", h: ["Estratégia", "Como funciona", "Prós e contras"], r: [
        ["Cache-aside (lazy)", "A aplicação lê do cache; no miss, lê do banco e preenche o cache", "Mais comum e flexível; o primeiro acesso é lento; risco de dado velho"],
        ["Read-through", "O próprio cache busca no banco quando há miss", "Código da aplicação mais simples; depende do provedor de cache"],
        ["Write-through", "Grava no cache e no banco na mesma operação", "Cache sempre coerente; escrita mais lenta"],
        ["Write-behind (write-back)", "Grava no cache e persiste no banco depois, em lote", "Escrita muito rápida; risco de perder dados se o cache cair"],
        ["Write-around", "Grava só no banco; o cache se preenche na leitura", "Evita encher o cache com dado que ninguém lê; leitura seguinte é miss"],
        ["Refresh-ahead", "Renova entradas populares antes de expirarem", "Menos misses; gasta recurso com o que pode não ser usado"]
      ] },
      { t: "tb", ti: "Como o dado sai do cache", h: ["Mecanismo", "Ideia"], r: [
        ["TTL (tempo de vida)", "Expira sozinho depois de N segundos; simples e limita a idade do dado velho"],
        ["Invalidação explícita", "Ao alterar o dado, apague (ou atualize) a chave; preciso, mas fácil de esquecer um caminho"],
        ["Chaves versionadas", "`user:42:v7`; mudar a versão “invalida” tudo sem apagar"],
        ["Política de remoção (eviction)", "Memória cheia: LRU (menos usado recentemente), LFU (menos frequente), FIFO"]
      ] },
      { t: "cd", ti: "Cache-aside com TTL e jitter", l: "pseudocódigo", c: `valor = cache.get(chave)
if valor is None:                              # miss
    valor = banco.consultar(...)
    cache.set(chave, valor, ttl=300 + random(0, 60))   # jitter evita expirar tudo junto
return valor` },
      { t: "tb", ti: "Problemas clássicos", h: ["Problema", "O que é", "Remédio"], r: [
        ["Cache stampede", "Chave popular expira e centenas de requisições vão ao banco ao mesmo tempo", "Lock ou single-flight na reconstrução, TTL com jitter, stale-while-revalidate"],
        ["Penetração", "Pedidos de chaves que não existem sempre passam pelo cache até o banco", "Cache negativo (guardar “não existe” por pouco tempo), Bloom filter"],
        ["Hot key", "Uma chave concentra o tráfego de um nó", "Réplicas da chave, cache local em memória na aplicação"],
        ["Dado velho", "O cache serve valor antigo após uma alteração", "Invalidar na escrita, TTL curto, aceitar a janela conscientemente"]
      ] }
    ],
    traps: [
      "Cachear sem política de invalidação: o bug aparece como “o dado não atualiza”.",
      "Cachear dado específico de usuário numa chave compartilhada: vazamento entre usuários.",
      "Tratar o cache como fonte da verdade: ele pode sumir a qualquer momento (restart, eviction).",
      "Todos os TTLs iguais: a expiração em massa gera stampede."
    ],
    rc: [
      ["O que significa hit ratio e por que ele importa?", "É a fração de pedidos atendidos pelo cache. Quanto maior, menos carga na fonte lenta; um cache com hit ratio baixo só acrescenta latência e custo."],
      ["Qual a diferença entre write-through e write-behind?", "No write-through grava no cache e no banco juntos (coerente, mais lento). No write-behind grava no cache e persiste depois (rápido, mas pode perder dados se o cache cair)."]
    ]
  },
  en: {
    s: "How caching works",
    q: "How does caching work and what are some common caching strategies?",
    why: "Caching is a simple idea everybody already uses without noticing (the work desk). The analogy gives the intuition, and the point where it breaks, the stale copy, is the hard part of the discipline.",
    one: "A cache is a **temporary copy of data that is expensive to obtain**, kept somewhere faster and closer to the consumer. It works because access has **locality**: a few items receive most requests. Strategies define **who fills the cache** (cache-aside, read-through), **when it writes** (write-through, write-behind) and **how data leaves** (TTL, invalidation, LRU). The hard part is invalidation: the copy can go stale.",
    b: [
      { t: "an",
        s: "The documents you use every day stay on your desk; the rest sits in the basement archive. The desk is small and fast, the basement is big and slow. Found it on the desk: hit. Had to go down to the basement: miss.",
        k: "The cache sits between the requester and the slow source (database, external API, heavy computation). On each request: if the key is in the cache, return it (**hit**, microseconds); if not, fetch from the source, store it and return it (**miss**). What matters is the **hit ratio**. Layers exist: browser cache, CDN, application cache (Redis, in-memory), database cache and its own buffers. It works because few items receive most reads (Pareto distribution).",
        b: "The desk copy does not know when the basement original changed. In systems the cache can silently go stale, and cache memory is limited, so something must leave for something new to enter." },
      { t: "tb", ti: "Read and write strategies", h: ["Strategy", "How it works", "Pros and cons"], r: [
        ["Cache-aside (lazy)", "The app reads from the cache; on a miss it reads the database and fills the cache", "Most common and flexible; first access is slow; stale-data risk"],
        ["Read-through", "The cache itself fetches from the database on a miss", "Simpler app code; depends on the cache provider"],
        ["Write-through", "Writes to the cache and the database in the same operation", "Cache always coherent; slower writes"],
        ["Write-behind (write-back)", "Writes to the cache and persists to the database later, in batches", "Very fast writes; risk of data loss if the cache dies"],
        ["Write-around", "Writes only to the database; the cache fills on read", "Avoids filling the cache with unread data; next read is a miss"],
        ["Refresh-ahead", "Renews popular entries before they expire", "Fewer misses; spends resources on what may go unused"]
      ] },
      { t: "tb", ti: "How data leaves the cache", h: ["Mechanism", "Idea"], r: [
        ["TTL (time to live)", "Expires by itself after N seconds; simple and bounds how stale data can be"],
        ["Explicit invalidation", "On change, delete (or update) the key; precise, but easy to forget a code path"],
        ["Versioned keys", "`user:42:v7`; bumping the version “invalidates” everything without deleting"],
        ["Eviction policy", "Memory full: LRU (least recently used), LFU (least frequently used), FIFO"]
      ] },
      { t: "cd", ti: "Cache-aside with TTL and jitter", l: "pseudocode", c: `value = cache.get(key)
if value is None:                              # miss
    value = db.query(...)
    cache.set(key, value, ttl=300 + random(0, 60))   # jitter avoids expiring everything together
return value` },
      { t: "tb", ti: "Classic problems", h: ["Problem", "What it is", "Remedy"], r: [
        ["Cache stampede", "A popular key expires and hundreds of requests hit the database at once", "Lock or single-flight on rebuild, TTL with jitter, stale-while-revalidate"],
        ["Penetration", "Requests for keys that do not exist always go through the cache to the database", "Negative caching (store “does not exist” briefly), Bloom filter"],
        ["Hot key", "One key concentrates a node’s traffic", "Replicas of the key, local in-process cache"],
        ["Stale data", "The cache serves an old value after a change", "Invalidate on write, short TTL, consciously accept the window"]
      ] }
    ],
    traps: [
      "Caching without an invalidation policy: the bug shows up as “the data does not update”.",
      "Caching user-specific data under a shared key: leakage across users.",
      "Treating the cache as the source of truth: it can vanish at any time (restart, eviction).",
      "All TTLs equal: mass expiration causes a stampede."
    ],
    rc: [
      ["What is the hit ratio and why does it matter?", "The fraction of requests served by the cache. The higher it is, the less load on the slow source; a cache with a low hit ratio only adds latency and cost."],
      ["What is the difference between write-through and write-behind?", "Write-through writes to the cache and the database together (coherent, slower). Write-behind writes to the cache and persists later (fast, but may lose data if the cache dies)."]
    ]
  }
});

/* ============ 12 · Redis vs Memcached ============ */
window.QS.push({
  n: 12, g: "C", m: "compare",
  pt: {
    s: "Redis vs Memcached",
    q: "Quais são as diferenças entre Redis e Memcached?",
    why: "Outro “X vs Y”: uma matriz de recursos e uma regra de decisão. O que a entrevista procura é saber que o Redis é um servidor de estruturas de dados e o Memcached é um cache puro.",
    one: "**Memcached** é um cache chave-valor simples, em memória, multithread e sem persistência. **Redis** é um servidor de **estruturas de dados** em memória (strings, hashes, listas, sets, sorted sets, streams…), com persistência opcional, replicação, cluster, scripts Lua, pub/sub e operações atômicas. Para cache simples e massivo os dois servem; o Redis cobre também sessões, filas, rankings, rate limit e locks, e por isso é o padrão.",
    b: [
      { t: "tb", h: ["Aspecto", "Memcached", "Redis"], r: [
        ["Tipos de dado", "Só strings/blobs", "Strings, hashes, listas, sets, sorted sets, streams, bitmaps, HyperLogLog, geo"],
        ["Persistência", "Nenhuma (volátil)", "Opcional: snapshots (RDB) e log (AOF)"],
        ["Alta disponibilidade", "Sem nativa; o cliente distribui as chaves entre nós", "Replicação, Sentinel, Redis Cluster com sharding e failover"],
        ["Threads", "Multithread (usa vários núcleos por nó)", "Comandos em uma thread (I/O em threads desde a 6.0); escala por cluster"],
        ["Remoção de chaves", "LRU", "Várias políticas: allkeys-lru, allkeys-lfu, volatile-ttl, noeviction…"],
        ["Atomicidade", "`incr`/`cas` básicos", "`INCR`, transações `MULTI`, scripts Lua, operações atômicas por estrutura"],
        ["Recursos extra", "Quase nenhum", "Pub/Sub, streams, expiração por chave, locks, geoespacial, módulos"],
        ["Tamanho máximo do valor", "1 MB por padrão", "Até 512 MB"],
        ["Melhor uso", "Cache puro e simples, grande, só volátil", "Cache + sessões, filas leves, rankings, rate limit, locks distribuídos"]
      ] },
      { t: "tp", k: "key", h: "Regra de decisão", x: "Precisa só de cache chave-valor e quer o máximo de simplicidade e uso de vários núcleos por nó: Memcached resolve. Precisa de estruturas, persistência, replicação ou recursos além do cache: Redis (ou o fork aberto Valkey, criado depois da mudança de licença do Redis em 2024)." },
      { t: "cd", ti: "Um exemplo que só o Redis faz bem: ranking", l: "redis", c: `ZADD ranking 1520 "ana"
ZADD ranking 1810 "bruno"
ZINCRBY ranking 50 "ana"          # atômico
ZREVRANGE ranking 0 2 WITHSCORES  # top 3` }
    ],
    traps: [
      "Tratar o Redis como banco primário sem configurar persistência e replicação: um restart pode perder dados.",
      "Usar `KEYS *` em produção: bloqueia a thread única; use `SCAN`.",
      "Um comando lento (grande `SORT`, valores enormes) bloqueia todos os clientes do nó.",
      "Não definir TTL nem política de eviction: a memória enche e o servidor recusa escritas ou derruba chaves."
    ],
    rc: [
      ["Por que o Redis é single-thread para comandos e ainda assim é rápido?", "Opera em memória, sem locks entre threads e com I/O multiplexado; evita custo de sincronização. Escala usando vários processos (cluster)."],
      ["Quando o Memcached ainda faz sentido?", "Cache chave-valor simples e grande, só volátil, onde multithread por nó e simplicidade importam e você não precisa de estruturas nem persistência."]
    ]
  },
  en: {
    s: "Redis vs Memcached",
    q: "What are the differences between Redis and Memcached?",
    why: "Another “X vs Y”: a feature matrix and a decision rule. What interviews look for is knowing that Redis is a data-structure server and Memcached is a pure cache.",
    one: "**Memcached** is a simple in-memory key-value cache, multithreaded and without persistence. **Redis** is an in-memory **data-structure server** (strings, hashes, lists, sets, sorted sets, streams…), with optional persistence, replication, clustering, Lua scripts, pub/sub and atomic operations. For plain massive caching both work; Redis also covers sessions, queues, leaderboards, rate limiting and locks, which is why it is the default.",
    b: [
      { t: "tb", h: ["Aspect", "Memcached", "Redis"], r: [
        ["Data types", "Only strings/blobs", "Strings, hashes, lists, sets, sorted sets, streams, bitmaps, HyperLogLog, geo"],
        ["Persistence", "None (volatile)", "Optional: snapshots (RDB) and log (AOF)"],
        ["High availability", "None built in; the client spreads keys across nodes", "Replication, Sentinel, Redis Cluster with sharding and failover"],
        ["Threads", "Multithreaded (uses several cores per node)", "Commands on one thread (threaded I/O since 6.0); scales via cluster"],
        ["Key eviction", "LRU", "Several policies: allkeys-lru, allkeys-lfu, volatile-ttl, noeviction…"],
        ["Atomicity", "Basic `incr`/`cas`", "`INCR`, `MULTI` transactions, Lua scripts, atomic per-structure operations"],
        ["Extras", "Almost none", "Pub/Sub, streams, per-key expiry, locks, geospatial, modules"],
        ["Max value size", "1 MB by default", "Up to 512 MB"],
        ["Best use", "Pure, simple, large, volatile-only cache", "Cache + sessions, light queues, leaderboards, rate limiting, distributed locks"]
      ] },
      { t: "tp", k: "key", h: "Decision rule", x: "Need only key-value caching and want maximum simplicity and multi-core use per node: Memcached does it. Need structures, persistence, replication or features beyond caching: Redis (or the open fork Valkey, created after Redis changed its license in 2024)." },
      { t: "cd", ti: "An example only Redis does well: a leaderboard", l: "redis", c: `ZADD leaderboard 1520 "ana"
ZADD leaderboard 1810 "bruno"
ZINCRBY leaderboard 50 "ana"          # atomic
ZREVRANGE leaderboard 0 2 WITHSCORES  # top 3` }
    ],
    traps: [
      "Treating Redis as a primary database without configuring persistence and replication: a restart can lose data.",
      "Using `KEYS *` in production: it blocks the single thread; use `SCAN`.",
      "One slow command (a big `SORT`, huge values) blocks every client on the node.",
      "Not setting a TTL or an eviction policy: memory fills up and the server rejects writes or drops keys."
    ],
    rc: [
      ["Why is Redis single-threaded for commands and still fast?", "It works in memory, with no inter-thread locks and multiplexed I/O; it avoids synchronization cost. It scales by using several processes (cluster)."],
      ["When does Memcached still make sense?", "Simple, large key-value caching, volatile only, where per-node multithreading and simplicity matter and you need neither structures nor persistence."]
    ]
  }
});

/* ============ 13 · Otimização de consultas ============ */
window.QS.push({
  n: 13, g: "C", m: "playbook",
  pt: {
    s: "Otimizar consultas",
    q: "Quais são algumas técnicas para otimizar consultas de banco de dados?",
    why: "Otimizar é um procedimento, não uma lista de truques. A ordem importa: medir, ler o plano, corrigir a causa e medir de novo. Um playbook impede o erro mais comum, otimizar sem medir.",
    one: "Primeiro **meça** (log de consultas lentas, `pg_stat_statements`), depois **leia o plano** (`EXPLAIN ANALYZE`), e só então corrija: **índices** certos, SQL **sargável** (sem função na coluna indexada, sem `SELECT *`), menos linhas (filtros cedo, paginação por chave em vez de `OFFSET` grande), fim do **N+1**, pré-agregação e, por último, cache e réplicas. Meça de novo: todo índice novo custa escrita.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Meça primeiro", "Ative o log de consultas lentas ou `pg_stat_statements`. Ordene pelo **tempo total** (frequência × duração): uma consulta de 5 ms rodada 1 milhão de vezes pesa mais que uma de 2 s rodada 10."],
        ["Leia o plano", "`EXPLAIN (ANALYZE, BUFFERS)`: procure Seq Scan em tabela grande, diferença entre linhas estimadas e reais (estatísticas velhas: rode `ANALYZE`), sort ou hash gravando em disco, nested loops enormes."],
        ["Índices certos", "Colunas de `WHERE`, `JOIN` e `ORDER BY`. Compostos com igualdade antes de intervalo; parciais (`WHERE ativo`) e covering (`INCLUDE`) quando valem a pena."],
        ["SQL sargável", "Não aplique função na coluna indexada (`lower(email)`), evite `LIKE '%x'`, tipos iguais dos dois lados, e liste só as colunas necessárias em vez de `SELECT *`."],
        ["Leia menos linhas", "Filtre cedo; pagine por chave (`WHERE id > :ultimo LIMIT 50`) em vez de `OFFSET` grande, que lê e descarta tudo que veio antes."],
        ["Elimine o N+1", "Uma consulta por item de uma lista: troque por `JOIN`, `IN (...)` ou carregamento em lote (eager loading do ORM)."],
        ["Mova o trabalho", "Tabelas de resumo, views materializadas, desnormalização consciente, particionamento de tabelas enormes."],
        ["Operação e infraestrutura", "Pool de conexões, inserts em lote, `VACUUM`/`ANALYZE`, réplicas de leitura, cache da aplicação."],
        ["Meça de novo", "Compare antes e depois. Se não melhorou, desfaça. Todo índice novo tem custo na escrita."]
      ] },
      { t: "cd", ti: "Duas correções clássicas", l: "sql", c: `-- N+1: 1 consulta + 1 por pedido
SELECT * FROM pedidos;                       -- depois, em loop:
SELECT * FROM itens WHERE pedido_id = ?;
-- Correção: uma consulta só
SELECT * FROM itens WHERE pedido_id = ANY(:ids);

-- OFFSET grande lê e descarta 100.000 linhas
SELECT * FROM eventos ORDER BY id LIMIT 50 OFFSET 100000;
-- Paginação por chave: salta direto
SELECT * FROM eventos WHERE id > :ultimo_id ORDER BY id LIMIT 50;` }
    ],
    traps: [
      "Otimizar sem medir: gastar um dia numa consulta que responde 1% do tempo total.",
      "Criar um índice para cada consulta: as escritas ficam mais lentas e o ganho some.",
      "Ignorar o N+1 gerado pelo ORM: o código parece simples e dispara centenas de consultas.",
      "Confiar nas estimativas do plano sem `ANALYZE`: estatísticas velhas levam a planos ruins."
    ],
    rc: [
      ["Por que paginar por chave é melhor que `OFFSET` grande?", "O `OFFSET` obriga o banco a ler e descartar todas as linhas anteriores; a paginação por chave usa o índice para saltar direto ao ponto."],
      ["O que é uma consulta N+1?", "Uma consulta para listar e mais uma por item da lista. Resolve-se com JOIN, IN ou carregamento em lote."]
    ]
  },
  en: {
    s: "Optimizing queries",
    q: "What are some techniques for optimizing database queries?",
    why: "Optimizing is a procedure, not a list of tricks. Order matters: measure, read the plan, fix the cause and measure again. A playbook prevents the most common mistake, optimizing without measuring.",
    one: "First **measure** (slow-query log, `pg_stat_statements`), then **read the plan** (`EXPLAIN ANALYZE`), and only then fix: the right **indexes**, **sargable** SQL (no function on the indexed column, no `SELECT *`), fewer rows (early filters, key-based pagination instead of big `OFFSET`), kill the **N+1**, pre-aggregate and, last, cache and replicas. Measure again: every new index costs writes.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Measure first", "Enable the slow-query log or `pg_stat_statements`. Sort by **total time** (frequency × duration): a 5 ms query run 1 million times weighs more than a 2 s query run 10 times."],
        ["Read the plan", "`EXPLAIN (ANALYZE, BUFFERS)`: look for Seq Scan on big tables, gaps between estimated and actual rows (stale statistics: run `ANALYZE`), sorts or hashes spilling to disk, huge nested loops."],
        ["The right indexes", "Columns in `WHERE`, `JOIN` and `ORDER BY`. Composites with equality before range; partial (`WHERE active`) and covering (`INCLUDE`) when worthwhile."],
        ["Sargable SQL", "Do not apply a function to the indexed column (`lower(email)`), avoid `LIKE '%x'`, same types on both sides, and list only the needed columns instead of `SELECT *`."],
        ["Read fewer rows", "Filter early; paginate by key (`WHERE id > :last LIMIT 50`) instead of a big `OFFSET`, which reads and discards everything before."],
        ["Kill the N+1", "One query per list item: replace with `JOIN`, `IN (...)` or batch loading (the ORM’s eager loading)."],
        ["Move the work", "Summary tables, materialized views, conscious denormalization, partitioning of huge tables."],
        ["Operations and infrastructure", "Connection pooling, batch inserts, `VACUUM`/`ANALYZE`, read replicas, application cache."],
        ["Measure again", "Compare before and after. If it did not improve, revert. Every new index has a write cost."]
      ] },
      { t: "cd", ti: "Two classic fixes", l: "sql", c: `-- N+1: 1 query + 1 per order
SELECT * FROM orders;                         -- then, in a loop:
SELECT * FROM items WHERE order_id = ?;
-- Fix: a single query
SELECT * FROM items WHERE order_id = ANY(:ids);

-- A big OFFSET reads and discards 100,000 rows
SELECT * FROM events ORDER BY id LIMIT 50 OFFSET 100000;
-- Key-based pagination jumps straight there
SELECT * FROM events WHERE id > :last_id ORDER BY id LIMIT 50;` }
    ],
    traps: [
      "Optimizing without measuring: spending a day on a query that accounts for 1% of total time.",
      "Creating an index for every query: writes get slower and the gain disappears.",
      "Ignoring the ORM-generated N+1: the code looks simple and fires hundreds of queries.",
      "Trusting plan estimates without `ANALYZE`: stale statistics lead to bad plans."
    ],
    rc: [
      ["Why is key-based pagination better than a big `OFFSET`?", "`OFFSET` forces the database to read and discard all previous rows; key-based pagination uses the index to jump straight to the point."],
      ["What is an N+1 query problem?", "One query to list plus one more per list item. It is solved with JOIN, IN or batch loading."]
    ]
  }
});

/* ============ 14 · Rate limiting ============ */
window.QS.push({
  n: 14, g: "C", m: "feynman",
  pt: {
    s: "Limitação de taxa",
    q: "Explique o conceito de limitação de taxa e como isso ajuda na segurança da API.",
    why: "A ideia cabe numa analogia (o porteiro da balada). Depois dela vêm os algoritmos reais e os limites da analogia, como IP compartilhado e atacante distribuído.",
    one: "**Rate limiting** limita quantas requisições uma identidade (IP, chave de API, usuário, tenant) pode fazer numa janela de tempo; o excesso recebe `429 Too Many Requests`. Protege contra **força bruta** (login, OTP), **credential stuffing**, **scraping**, **DoS de aplicação**, abuso de endpoints caros e “vizinho barulhento” em sistemas multiusuário. Os algoritmos usuais são janela fixa, janela deslizante, **token bucket** e leaky bucket.",
    b: [
      { t: "an",
        s: "O porteiro da balada deixa entrar 30 pessoas por minuto. Quem passa disso espera na fila ou é barrado. Não importa se quem está na porta é um cliente legítimo ou um encrenqueiro: a casa se protege dos dois.",
        k: "O servidor (ou o gateway) conta as requisições por identidade e janela. Passou do limite: responde `429` com `Retry-After` (e cabeçalhos como `RateLimit-*` ou `X-RateLimit-*`) dizendo quando tentar de novo. O contador fica geralmente no Redis (`INCR` + `EXPIRE`, ou um script Lua atômico) para valer em todos os servidores. Limites diferentes por rota: login 5 por minuto, leitura 1.000.",
        b: "Atrás de um NAT corporativo centenas de pessoas dividem um IP e o limite por IP pune inocentes. Um atacante com milhares de IPs (botnet) passa por limites por IP. Por isso combine identidades (IP + conta + dispositivo) e use outras defesas junto (WAF, CAPTCHA, detecção de anomalia)." },
      { t: "tb", ti: "Algoritmos", h: ["Algoritmo", "Como funciona", "Prós e contras"], r: [
        ["Janela fixa", "Contador zerado a cada minuto", "Simples; permite o dobro do limite na virada da janela (rajada)"],
        ["Janela deslizante", "Conta as requisições dos últimos N segundos (log ou contadores ponderados)", "Mais preciso; o log custa memória, a versão com contadores é aproximada"],
        ["Token bucket", "Um balde com capacidade B recebe r fichas por segundo; cada requisição gasta uma", "Aceita rajadas controladas e limita a média; o mais usado"],
        ["Leaky bucket", "Requisições entram numa fila que escoa a taxa constante", "Suaviza a saída; rajadas viram espera ou descarte"]
      ] },
      { t: "cd", ti: "Token bucket em pseudocódigo", l: "pseudocódigo", c: `fichas = min(capacidade, fichas + (agora - ultimo) * taxa)   # reabastece
ultimo = agora
if fichas >= 1:
    fichas -= 1
    permitir()
else:
    responder(429, retry_after=(1 - fichas) / taxa)` },
      { t: "tp", k: "tip", h: "Decisão de projeto", x: "Se o armazenamento do contador cair, o limitador **falha aberto** (deixa passar, preserva disponibilidade) ou **fechado** (bloqueia, preserva proteção)? Para login e pagamentos costuma-se preferir fechado; para leitura pública, aberto." }
    ],
    traps: [
      "Limitar só por IP: pune redes compartilhadas e é contornado por botnets.",
      "Janela fixa sem perceber a rajada do dobro na virada.",
      "Limite no código de cada instância (em memória) em vez de um contador compartilhado: cada servidor deixa passar seu pedaço.",
      "Achar que rate limiting substitui autenticação, autorização, WAF ou proteção de DDoS em camada de rede."
    ],
    rc: [
      ["Que resposta HTTP indica que o limite foi excedido e que cabeçalho orienta o cliente?", "`429 Too Many Requests`, com `Retry-After` indicando em quantos segundos tentar de novo."],
      ["Qual a vantagem do token bucket sobre a janela fixa?", "Permite rajadas curtas controladas, limita a taxa média e não tem o pico duplo na virada da janela."]
    ]
  },
  en: {
    s: "Rate limiting",
    q: "Explain the concept of rate limiting and how it helps API security.",
    why: "The idea fits in an analogy (the club bouncer). After it come the real algorithms and the analogy’s limits, like shared IPs and distributed attackers.",
    one: "**Rate limiting** caps how many requests an identity (IP, API key, user, tenant) can make in a time window; the excess gets `429 Too Many Requests`. It protects against **brute force** (login, OTP), **credential stuffing**, **scraping**, **application-layer DoS**, abuse of expensive endpoints and “noisy neighbors” in multi-tenant systems. The usual algorithms are fixed window, sliding window, **token bucket** and leaky bucket.",
    b: [
      { t: "an",
        s: "The club bouncer lets in 30 people a minute. Anyone beyond that waits in line or is turned away. It does not matter whether the person at the door is a legitimate customer or a troublemaker: the house protects itself from both.",
        k: "The server (or gateway) counts requests per identity and window. Over the limit: it answers `429` with `Retry-After` (and headers like `RateLimit-*` or `X-RateLimit-*`) saying when to retry. The counter usually lives in Redis (`INCR` + `EXPIRE`, or an atomic Lua script) so it holds across all servers. Different limits per route: login 5 per minute, reads 1,000.",
        b: "Behind a corporate NAT hundreds of people share one IP and a per-IP limit punishes the innocent. An attacker with thousands of IPs (botnet) slips past per-IP limits. So combine identities (IP + account + device) and use other defenses alongside (WAF, CAPTCHA, anomaly detection)." },
      { t: "tb", ti: "Algorithms", h: ["Algorithm", "How it works", "Pros and cons"], r: [
        ["Fixed window", "Counter reset every minute", "Simple; allows double the limit around the window boundary (burst)"],
        ["Sliding window", "Counts requests in the last N seconds (log or weighted counters)", "More precise; the log costs memory, the counter version is approximate"],
        ["Token bucket", "A bucket of capacity B gains r tokens per second; each request spends one", "Allows controlled bursts and bounds the average; the most used"],
        ["Leaky bucket", "Requests enter a queue that drains at a constant rate", "Smooths output; bursts become waiting or dropping"]
      ] },
      { t: "cd", ti: "Token bucket in pseudocode", l: "pseudocode", c: `tokens = min(capacity, tokens + (now - last) * rate)   # refill
last = now
if tokens >= 1:
    tokens -= 1
    allow()
else:
    respond(429, retry_after=(1 - tokens) / rate)` },
      { t: "tp", k: "tip", h: "Design decision", x: "If the counter store goes down, does the limiter **fail open** (let traffic pass, preserve availability) or **closed** (block, preserve protection)? For login and payments closed is usually preferred; for public reads, open." }
    ],
    traps: [
      "Limiting only by IP: punishes shared networks and is bypassed by botnets.",
      "Fixed window without noticing the double burst at the boundary.",
      "A limit in each instance’s own memory instead of a shared counter: each server lets its share through.",
      "Believing rate limiting replaces authentication, authorization, a WAF or network-layer DDoS protection."
    ],
    rc: [
      ["Which HTTP response signals the limit was exceeded and which header guides the client?", "`429 Too Many Requests`, with `Retry-After` saying in how many seconds to retry."],
      ["What is the token bucket’s advantage over a fixed window?", "It allows short controlled bursts, bounds the average rate and has no double peak at the window boundary."]
    ]
  }
});

/* ============ 15 · Escalar para milhões de req/s ============ */
window.QS.push({
  n: 15, g: "C", m: "firstprinciples",
  pt: {
    s: "Milhões de requisições por segundo",
    q: "Como você escalaria um sistema backend para lidar com milhões de requisições por segundo?",
    why: "Listar tecnologias não responde. Partindo de primeiros princípios (a conta da vazão) e acrescentando uma restrição por vez, cada componente aparece como remédio de um gargalo concreto.",
    one: "Parta da conta: **vazão = concorrência ÷ latência** (Lei de Little). 1 milhão de req/s a 50 ms são ~50 mil requisições em voo, muito além de uma máquina. Então: app **stateless** atrás de **load balancers** com autoscaling; **cache** e **CDN** para a maior parte nunca chegar ao banco; **réplicas de leitura**, **sharding** e filas para a escrita; e proteção (rate limit, backpressure, degradação graciosa). Meça, ache o gargalo, trate, repita.",
    b: [
      { t: "tb", ti: "A conta antes das ferramentas (ordens de grandeza)", h: ["Item", "Valor"], r: [
        ["Meta", "1.000.000 req/s"],
        ["Latência média", "50 ms"],
        ["Requisições em voo (Lei de Little)", "1.000.000 × 0,05 = 50.000"],
        ["Um servidor (hipótese para trabalho simples)", "5.000 a 10.000 req/s"],
        ["Servidores só para a vazão", "100 a 200, mais folga de ~2× para picos e falhas"]
      ], n: "Os números são hipóteses para mostrar o raciocínio; o que se mede de verdade é a capacidade do seu serviço em teste de carga." },
      { t: "st", ti: "Construindo, uma restrição por vez", i: [
        ["Defina o alvo e meça", "Leitura ou escrita? Tamanho do payload, p99 de latência, picos (10×?), consistência exigida. Sem isso toda escolha é chute."],
        ["Um servidor satura", "CPU, memória ou rede chegam ao limite e ele é ponto único de falha. → Vários servidores **stateless** atrás de um load balancer (sessões em token ou Redis) e autoscaling."],
        ["O banco vira o gargalo (quase sempre o primeiro)", "→ Cache (Redis) na frente e réplicas de leitura: tiram 90% a 99% das leituras do primário. Indexação e queries otimizadas."],
        ["O estático e o repetido não deveriam chegar à origem", "→ CDN para arquivos, páginas e respostas cacheáveis; compressão, keep-alive, HTTP/2."],
        ["A escrita não escala em um nó só", "→ Sharding por chave bem distribuída (user_id), bancos que escalam escrita, gravações em lote, um log/fila (Kafka) para absorver picos; o que não é imediato vira assíncrono."],
        ["Uma região é risco e é longe de parte dos usuários", "→ Várias regiões ou zonas, DNS geográfico ou anycast, replicação entre regiões."],
        ["Sob sobrecarga o sistema inteiro cai", "→ Rate limit, timeouts, circuit breakers, bulkheads, backpressure e load shedding: descartar o menos importante para preservar o essencial."],
        ["Você precisa saber antes que o tráfego chegue", "→ Teste de carga (k6, Locust), métricas e tracing, planejamento de capacidade. Ache o próximo gargalo; a parte serial do sistema limita o ganho (Lei de Amdahl)."]
      ] },
      { t: "tp", k: "key", h: "O que a entrevista quer ouvir", x: "Perguntas antes de tecnologias (leitura ou escrita? quanta consistência? quais picos?) e o raciocínio **gargalo → remédio**. Dizer “Kafka, Redis, Kubernetes” sem dizer qual problema cada um resolve é a resposta fraca." }
    ],
    traps: [
      "Listar tecnologias sem dizer qual gargalo cada uma resolve.",
      "Escalar a aplicação e esquecer o banco, que é quem satura primeiro.",
      "Shard desbalanceado ou hot key: um nó recebe a maior parte do tráfego e vira o gargalo.",
      "Cache vazio depois de uma falha: a enxurrada de misses derruba o banco (stampede).",
      "Otimizar antes de medir."
    ],
    rc: [
      ["Por que 1M req/s a 50 ms exigem ~50 mil requisições em voo?", "Lei de Little: concorrência = vazão × latência = 1.000.000 × 0,05 s = 50.000."],
      ["Qual costuma ser o primeiro gargalo ao escalar um backend?", "O banco de dados. Por isso cache, réplicas de leitura e CDN vêm antes de qualquer outra coisa."]
    ]
  },
  en: {
    s: "Millions of requests per second",
    q: "How would you scale a backend system to handle millions of requests per second?",
    why: "Listing technologies does not answer it. Starting from first principles (the throughput arithmetic) and adding one constraint at a time, each component appears as the remedy for a concrete bottleneck.",
    one: "Start from the math: **throughput = concurrency ÷ latency** (Little’s Law). 1 million req/s at 50 ms is ~50 thousand requests in flight, far beyond one machine. So: **stateless** app behind **load balancers** with autoscaling; **cache** and **CDN** so most traffic never reaches the database; **read replicas**, **sharding** and queues for writes; and protection (rate limiting, backpressure, graceful degradation). Measure, find the bottleneck, treat it, repeat.",
    b: [
      { t: "tb", ti: "The math before the tools (orders of magnitude)", h: ["Item", "Value"], r: [
        ["Target", "1,000,000 req/s"],
        ["Average latency", "50 ms"],
        ["Requests in flight (Little’s Law)", "1,000,000 × 0.05 = 50,000"],
        ["One server (assumption for simple work)", "5,000 to 10,000 req/s"],
        ["Servers for throughput alone", "100 to 200, plus ~2× headroom for spikes and failures"]
      ], n: "The numbers are assumptions to show the reasoning; what you really measure is your own service’s capacity in a load test." },
      { t: "st", ti: "Building up, one constraint at a time", i: [
        ["Define the target and measure", "Read or write heavy? Payload size, p99 latency, spikes (10×?), required consistency. Without it every choice is a guess."],
        ["One server saturates", "CPU, memory or network hit the limit and it is a single point of failure. → Many **stateless** servers behind a load balancer (sessions in a token or Redis) and autoscaling."],
        ["The database becomes the bottleneck (almost always first)", "→ Cache (Redis) in front and read replicas: they remove 90% to 99% of reads from the primary. Indexing and optimized queries."],
        ["Static and repeated content should not reach the origin", "→ CDN for files, pages and cacheable responses; compression, keep-alive, HTTP/2."],
        ["Writes do not scale on a single node", "→ Sharding by a well-distributed key (user_id), databases that scale writes, batched writes, a log/queue (Kafka) to absorb spikes; whatever is not immediate becomes asynchronous."],
        ["One region is a risk and far from some users", "→ Several regions or zones, geo DNS or anycast, cross-region replication."],
        ["Under overload the whole system falls over", "→ Rate limiting, timeouts, circuit breakers, bulkheads, backpressure and load shedding: drop the least important to preserve the essential."],
        ["You must know before the traffic arrives", "→ Load testing (k6, Locust), metrics and tracing, capacity planning. Find the next bottleneck; the serial part of the system limits the gain (Amdahl’s Law)."]
      ] },
      { t: "tp", k: "key", h: "What the interviewer wants to hear", x: "Questions before technologies (read or write heavy? how much consistency? what spikes?) and the **bottleneck → remedy** reasoning. Saying “Kafka, Redis, Kubernetes” without saying which problem each solves is the weak answer." }
    ],
    traps: [
      "Listing technologies without saying which bottleneck each solves.",
      "Scaling the application and forgetting the database, which saturates first.",
      "Unbalanced shard or hot key: one node gets most of the traffic and becomes the bottleneck.",
      "An empty cache after a failure: the flood of misses takes the database down (stampede).",
      "Optimizing before measuring."
    ],
    rc: [
      ["Why does 1M req/s at 50 ms need ~50 thousand requests in flight?", "Little’s Law: concurrency = throughput × latency = 1,000,000 × 0.05 s = 50,000."],
      ["What is usually the first bottleneck when scaling a backend?", "The database. That is why cache, read replicas and a CDN come before anything else."]
    ]
  }
});

/* ============ 16 · OAuth vs JWT vs sessões ============ */
window.QS.push({
  n: 16, g: "D", m: "compare",
  pt: {
    s: "OAuth, JWT e sessões",
    q: "Explique as diferenças entre OAuth, JWT e autenticação baseada em sessões.",
    why: "É um “X vs Y vs Z”, mas com uma armadilha: os três não são da mesma categoria. Comparar exige primeiro separar o que cada um é (protocolo, formato, mecanismo) e depois a regra de escolha.",
    one: "**Sessão** é um mecanismo com estado no servidor: o cliente guarda só um ID opaco num cookie. **JWT** é um **formato de token** assinado, que o servidor valida sem consultar nenhum armazenamento (stateless). **OAuth 2.0** é um **protocolo de autorização delegada**: deixa um app acessar recursos do usuário sem receber a senha; o access token que ele emite pode ser um JWT. Login social e SSO usam OAuth + OIDC.",
    b: [
      { t: "tb", ti: "Cada um é de uma categoria", h: ["", "Sessão (cookie)", "JWT", "OAuth 2.0 (+ OIDC)"], r: [
        ["O que é", "Mecanismo de estado no servidor", "Formato de token assinado (`header.payload.assinatura`)", "Protocolo/framework de autorização delegada; OIDC acrescenta identidade (login)"],
        ["Onde fica o estado", "Servidor (memória, Redis, banco); o cliente só tem o ID", "No próprio token (claims `sub`, `exp`, `aud`…)", "Servidor de autorização emite e controla os tokens"],
        ["Revogação", "Trivial: apague a sessão", "Difícil: vale até expirar, salvo lista de bloqueio", "Revoga token ou consentimento no servidor de autorização"],
        ["Escala", "Precisa de armazenamento compartilhado entre servidores", "Fácil: qualquer servidor valida só com a chave", "Depende do servidor de autorização, mas permite SSO entre apps"],
        ["Melhor para", "Aplicação web tradicional, mesma origem", "APIs entre serviços e clientes variados, tokens de vida curta", "Login com Google/GitHub, acesso de terceiros, SSO, máquina-a-máquina"],
        ["Riscos", "CSRF, fixação de sessão, cookie sem flags", "Token roubado vale até expirar, `alg: none`, não validar `aud`/`iss`/`exp`, payload legível", "Fluxo errado (Implicit), `redirect_uri` frouxo, falta de PKCE"]
      ] },
      { t: "fl", ti: "OAuth: Authorization Code com PKCE (o fluxo recomendado)", n: ["App redireciona ao servidor de autorização com `code_challenge`", "Usuário se autentica e consente", "Redireciona de volta ao app com um `code` curto", "App troca `code` + `code_verifier` por tokens", "App chama a API com o access token"] },
      { t: "st", ti: "Regra de decisão", i: [
        ["Site tradicional, mesmo domínio", "Sessão com cookie `HttpOnly`, `Secure`, `SameSite`. Simples e revogável."],
        ["API consumida por vários clientes ou entre microserviços", "Access token de vida curta (JWT ou opaco) + refresh token."],
        ["“Entrar com Google”, acesso de terceiros, SSO", "OAuth 2.0 + OpenID Connect. Não invente o seu."],
        ["Misturar", "É comum: o login vem por OIDC, e a aplicação converte o resultado em sessão ou em tokens próprios."]
      ] }
    ],
    traps: [
      "“JWT é mais seguro que sessão”: são coisas diferentes, e o JWT é mais difícil de revogar.",
      "Guardar o JWT em `localStorage`: um XSS rouba o token; prefira cookie `HttpOnly`.",
      "Aceitar o token sem validar assinatura, algoritmo, `iss`, `aud` e `exp`.",
      "Usar OAuth para “autenticar” sem OIDC: OAuth diz o que o app pode fazer, não quem é o usuário.",
      "Colocar dado sensível no payload do JWT: ele é só codificado em base64, qualquer um lê."
    ],
    rc: [
      ["Qual é a diferença de categoria entre OAuth e JWT?", "OAuth é um protocolo de autorização delegada; JWT é um formato de token. Um access token OAuth pode ser um JWT, mas não precisa."],
      ["Por que revogar um JWT é difícil?", "Porque ele é validado só pela assinatura, sem consultar o servidor. Ele vale até expirar, a menos que você mantenha uma lista de bloqueio, que reintroduz estado."]
    ]
  },
  en: {
    s: "OAuth, JWT and sessions",
    q: "Explain the differences between OAuth, JWT and session-based authentication.",
    why: "It is an “X vs Y vs Z”, but with a trap: the three are not the same category. Comparing requires first separating what each is (protocol, format, mechanism) and then the selection rule.",
    one: "A **session** is a server-side state mechanism: the client holds only an opaque ID in a cookie. A **JWT** is a signed **token format** the server validates without consulting any store (stateless). **OAuth 2.0** is a **delegated-authorization protocol**: it lets an app access the user’s resources without receiving the password; the access token it issues may be a JWT. Social login and SSO use OAuth + OIDC.",
    b: [
      { t: "tb", ti: "Each is a different category", h: ["", "Session (cookie)", "JWT", "OAuth 2.0 (+ OIDC)"], r: [
        ["What it is", "Server-side state mechanism", "Signed token format (`header.payload.signature`)", "Delegated-authorization protocol/framework; OIDC adds identity (login)"],
        ["Where the state lives", "Server (memory, Redis, database); the client holds only the ID", "In the token itself (claims `sub`, `exp`, `aud`…)", "The authorization server issues and controls the tokens"],
        ["Revocation", "Trivial: delete the session", "Hard: valid until expiry, unless a denylist is kept", "Revoke the token or consent at the authorization server"],
        ["Scaling", "Needs shared storage across servers", "Easy: any server validates with just the key", "Depends on the authorization server, but enables SSO across apps"],
        ["Best for", "Traditional web app, same origin", "APIs between services and varied clients, short-lived tokens", "Google/GitHub login, third-party access, SSO, machine-to-machine"],
        ["Risks", "CSRF, session fixation, cookie without flags", "A stolen token works until expiry, `alg: none`, skipping `aud`/`iss`/`exp` checks, readable payload", "Wrong flow (Implicit), loose `redirect_uri`, missing PKCE"]
      ] },
      { t: "fl", ti: "OAuth: Authorization Code with PKCE (the recommended flow)", n: ["App redirects to the authorization server with a `code_challenge`", "User authenticates and consents", "Redirect back to the app with a short `code`", "App exchanges `code` + `code_verifier` for tokens", "App calls the API with the access token"] },
      { t: "st", ti: "Decision rule", i: [
        ["Traditional site, same domain", "Session with an `HttpOnly`, `Secure`, `SameSite` cookie. Simple and revocable."],
        ["API consumed by several clients or between microservices", "Short-lived access token (JWT or opaque) + refresh token."],
        ["“Sign in with Google”, third-party access, SSO", "OAuth 2.0 + OpenID Connect. Do not invent your own."],
        ["Mixing them", "Common: login arrives via OIDC, and the application converts the result into a session or its own tokens."]
      ] }
    ],
    traps: [
      "“JWT is more secure than sessions”: they are different things, and JWT is harder to revoke.",
      "Storing the JWT in `localStorage`: an XSS steals the token; prefer an `HttpOnly` cookie.",
      "Accepting the token without validating signature, algorithm, `iss`, `aud` and `exp`.",
      "Using OAuth to “authenticate” without OIDC: OAuth says what the app may do, not who the user is.",
      "Putting sensitive data in the JWT payload: it is only base64-encoded, anyone can read it."
    ],
    rc: [
      ["What is the category difference between OAuth and JWT?", "OAuth is a delegated-authorization protocol; JWT is a token format. An OAuth access token can be a JWT, but does not have to be."],
      ["Why is revoking a JWT hard?", "Because it is validated by signature alone, without consulting the server. It stays valid until expiry unless you keep a denylist, which reintroduces state."]
    ]
  }
});

/* ============ 17 · SQL injection ============ */
window.QS.push({
  n: 17, g: "D", m: "threat",
  pt: {
    s: "Injeção de SQL",
    q: "Como você previne ataques de injeção SQL?",
    why: "Em segurança, defender sem entender o ataque vira ritual. Primeiro mostra-se como a falha acontece e qual é a causa; depois cada defesa mira numa parte dessa causa.",
    one: "A injeção acontece quando **dado do usuário é interpretado como código SQL**, porque a consulta foi montada por concatenação de strings. A defesa principal é **consulta parametrizada (prepared statement)**, que separa código e dados no protocolo do banco. Some a isso: allowlist para o que não se parametriza (nomes de coluna, `ORDER BY`), **privilégio mínimo** na conta do banco, validação de entrada, erros genéricos e testes/WAF como rede de segurança.",
    b: [
      { t: "cd", ti: "Como o ataque acontece", l: "ataque", c: `consulta = "SELECT * FROM users WHERE email = '" + email + "'"

# entrada do atacante:  ' OR '1'='1' --
# consulta final:       SELECT * FROM users WHERE email = '' OR '1'='1' --'
# -> condição sempre verdadeira: devolve todos os usuários (ou faz login sem senha)

# outras variações: UNION SELECT (extrair outras tabelas),
# '; DROP TABLE users; --  (empilhar comandos), blind/time-based (inferir bit a bit)`, n: "Causa-raiz: dado e código viajam pelo mesmo canal (a string). O banco não tem como saber onde termina a intenção do programador e começa a entrada do usuário." },
      { t: "cd", ti: "A correção principal", l: "javascript (node-postgres)", c: `// vulneravel
db.query("SELECT * FROM users WHERE email = '" + email + "'")

// parametrizada: o banco recebe o SQL e o valor separadamente
db.query("SELECT * FROM users WHERE email = $1", [email])` },
      { t: "pr", ti: "Ameaça → defesa", a: "Falha", b: "Defesa", r: [
        ["Concatenar entrada na string SQL", "**Queries parametrizadas / prepared statements.** Defesa principal; o valor nunca é interpretado como SQL."],
        ["ORM usado com SQL cru (raw query)", "Usar a API parametrizada do ORM; revisar todo `raw`/`unsafe`. Usar ORM não é imunidade."],
        ["Nome de tabela, coluna ou `ORDER BY` vindo da entrada (não se parametriza)", "**Allowlist**: mapear o valor para uma lista fixa de identificadores aceitos."],
        ["Conta do banco com poder demais", "**Privilégio mínimo**: sem `DROP`/DDL, contas separadas, somente leitura quando possível. Limita o estrago se algo falhar."],
        ["Entrada inesperada", "Validação de tipo, formato e tamanho (defesa em profundidade; nunca a defesa única)."],
        ["Mensagem de erro do banco devolvida ao cliente", "Erro genérico ao cliente, detalhe só no log interno. O erro detalhado revela o esquema."],
        ["Stored procedure com SQL dinâmico concatenado", "Parametrizar também dentro da procedure (`EXECUTE ... USING`)."],
        ["Falha que escapou", "SAST/DAST (por exemplo `sqlmap` em ambiente de teste), revisão de código, WAF como camada extra, alertas para padrões suspeitos."]
      ] }
    ],
    traps: [
      "“Sanitizar” trocando aspas por escape manual: é frágil e quase sempre contornável.",
      "Parametrizar só parte da consulta e concatenar o resto.",
      "Validar apenas no front-end: o atacante chama a API direto.",
      "Achar que o ORM torna a aplicação imune: o ponto fraco é o SQL cru e o `ORDER BY` dinâmico.",
      "Nome de coluna ou direção de ordenação vindos da URL sem allowlist."
    ],
    rc: [
      ["Por que a consulta parametrizada impede a injeção?", "Porque o texto do SQL e os valores seguem por caminhos separados; o banco compila a consulta antes de receber o valor, que nunca é interpretado como código."],
      ["O que fazer quando o nome da coluna de ordenação vem do usuário?", "Não dá para parametrizar identificadores; use uma allowlist que mapeia opções válidas para identificadores fixos."]
    ]
  },
  en: {
    s: "SQL injection",
    q: "How do you prevent SQL injection attacks?",
    why: "In security, defending without understanding the attack becomes ritual. First show how the flaw happens and what its cause is; then each defense targets part of that cause.",
    one: "Injection happens when **user data is interpreted as SQL code**, because the query was built by string concatenation. The primary defense is the **parameterized query (prepared statement)**, which separates code and data at the database protocol level. Add: an allowlist for what cannot be parameterized (column names, `ORDER BY`), **least privilege** on the database account, input validation, generic errors, and tests/WAF as a safety net.",
    b: [
      { t: "cd", ti: "How the attack happens", l: "attack", c: `query = "SELECT * FROM users WHERE email = '" + email + "'"

# attacker input:  ' OR '1'='1' --
# final query:     SELECT * FROM users WHERE email = '' OR '1'='1' --'
# -> always-true condition: returns every user (or logs in without a password)

# other variations: UNION SELECT (extract other tables),
# '; DROP TABLE users; --  (stacked commands), blind/time-based (infer bit by bit)`, n: "Root cause: data and code travel through the same channel (the string). The database cannot know where the programmer’s intent ends and the user’s input begins." },
      { t: "cd", ti: "The main fix", l: "javascript (node-postgres)", c: `// vulnerable
db.query("SELECT * FROM users WHERE email = '" + email + "'")

// parameterized: the database receives the SQL and the value separately
db.query("SELECT * FROM users WHERE email = $1", [email])` },
      { t: "pr", ti: "Threat → defense", a: "Flaw", b: "Defense", r: [
        ["Concatenating input into the SQL string", "**Parameterized queries / prepared statements.** The main defense; the value is never interpreted as SQL."],
        ["ORM used with raw SQL", "Use the ORM’s parameterized API; review every `raw`/`unsafe`. Using an ORM is not immunity."],
        ["Table, column or `ORDER BY` coming from input (cannot be parameterized)", "**Allowlist**: map the value to a fixed list of accepted identifiers."],
        ["Database account with too much power", "**Least privilege**: no `DROP`/DDL, separate accounts, read-only when possible. Limits damage if something fails."],
        ["Unexpected input", "Validate type, format and size (defense in depth; never the only defense)."],
        ["Database error message returned to the client", "Generic error to the client, detail only in the internal log. A detailed error reveals the schema."],
        ["Stored procedure with concatenated dynamic SQL", "Parameterize inside the procedure too (`EXECUTE ... USING`)."],
        ["A flaw that slipped through", "SAST/DAST (for example `sqlmap` in a test environment), code review, a WAF as an extra layer, alerts for suspicious patterns."]
      ] }
    ],
    traps: [
      "“Sanitizing” by manually escaping quotes: fragile and almost always bypassable.",
      "Parameterizing only part of the query and concatenating the rest.",
      "Validating only in the front end: the attacker calls the API directly.",
      "Believing the ORM makes the app immune: the weak spot is raw SQL and dynamic `ORDER BY`.",
      "Column name or sort direction from the URL without an allowlist."
    ],
    rc: [
      ["Why does a parameterized query prevent injection?", "Because the SQL text and the values travel separately; the database compiles the query before receiving the value, which is never interpreted as code."],
      ["What do you do when the sort column name comes from the user?", "Identifiers cannot be parameterized; use an allowlist that maps valid options to fixed identifiers."]
    ]
  }
});

/* ============ 18 · CORS ============ */
window.QS.push({
  n: 18, g: "D", m: "trace",
  pt: {
    s: "CORS",
    q: "O que é o Compartilhamento de Recursos entre Origens (CORS) e como ele funciona?",
    why: "CORS só faz sentido seguindo uma requisição de verdade pelo navegador: quem pergunta, quem responde, quem decide. Rastrear o fluxo (inclusive o preflight) elimina a confusão mais comum, de quem está sendo protegido.",
    one: "Por padrão o navegador aplica a **Same-Origin Policy**: um script só lê respostas da mesma origem (esquema + host + porta). **CORS** é o conjunto de cabeçalhos HTTP com que o **servidor de outra origem diz ao navegador** quem pode ler suas respostas (`Access-Control-Allow-Origin` etc.). Quem aplica a regra é o **navegador**, não o servidor: `curl` e Postman ignoram CORS, e CORS protege o **usuário**, não a API.",
    b: [
      { t: "tp", k: "key", h: "Quem protege quem", x: "Sem a Same-Origin Policy, um site malicioso aberto em outra aba poderia ler, com os seus cookies, a resposta do seu banco. O CORS é a forma controlada de **relaxar** essa regra para origens que o servidor aprova." },
      { t: "fl", ti: "Requisição simples (GET/POST com cabeçalhos básicos)", n: ["JS em `app.example.com` chama `api.example.com`", "Navegador envia a requisição com `Origin: https://app.example.com`", "API responde com `Access-Control-Allow-Origin: https://app.example.com`", "Navegador confere e entrega a resposta ao JS (senão, bloqueia a leitura)"], c: "Atenção: nesse caso a requisição **chegou ao servidor e foi processada**; o navegador apenas esconde a resposta do script." },
      { t: "st", ti: "Requisição com preflight (PUT, DELETE, JSON, `Authorization`…)", i: [
        ["O navegador pergunta antes", "Envia `OPTIONS` com `Origin`, `Access-Control-Request-Method` e `Access-Control-Request-Headers`."],
        ["O servidor responde a política", "`204` com `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` e, opcionalmente, `Access-Control-Max-Age` (cache do preflight)."],
        ["O navegador decide", "Se método, cabeçalhos e origem foram permitidos, envia a requisição real; se não, ela nem sai."],
        ["A resposta real volta", "Também precisa de `Access-Control-Allow-Origin`, senão o JS não a lê."]
      ] },
      { t: "cd", ti: "Configuração no servidor", l: "javascript (Express)", c: `app.use(cors({
  origin: ["https://app.example.com"],       // allowlist explicita
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,                          // permite cookies
  maxAge: 600                                 // cache do preflight, em segundos
}))` },
      { t: "tp", k: "warn", h: "Cookies e credenciais", x: "Para enviar cookies: o cliente usa `credentials: 'include'` e o servidor responde `Access-Control-Allow-Credentials: true` com uma **origem explícita**. `Access-Control-Allow-Origin: *` não pode ser combinado com credenciais. Se o servidor devolve a origem dinamicamente, adicione `Vary: Origin`." }
    ],
    traps: [
      "Refletir qualquer `Origin` recebido (ou usar `*` em API com dados sensíveis): anula a proteção.",
      "Achar que CORS protege a API de chamadas de fora: `curl`, scripts e servidores ignoram CORS. A API se protege com autenticação e autorização.",
      "Achar que CORS impede CSRF: em requisições simples a requisição é enviada mesmo assim; use `SameSite` e tokens anti-CSRF.",
      "Ler “erro de CORS” como “servidor fora do ar”: veja na aba Rede se o preflight falhou ou se faltou cabeçalho.",
      "Esquecer que o preflight (`OPTIONS`) também precisa ser respondido sem exigir autenticação."
    ],
    rc: [
      ["Quem faz valer a política de CORS: o servidor ou o navegador?", "O navegador. O servidor apenas declara a política por meio dos cabeçalhos; `curl` e Postman a ignoram."],
      ["Quando o navegador envia um preflight?", "Quando a requisição não é “simples”: métodos como PUT/DELETE, `Content-Type: application/json`, ou cabeçalhos personalizados como `Authorization`."]
    ]
  },
  en: {
    s: "CORS",
    q: "What is Cross-Origin Resource Sharing (CORS) and how does it work?",
    why: "CORS only makes sense by following a real request through the browser: who asks, who answers, who decides. Tracing the flow (including the preflight) clears up the most common confusion, which is who is being protected.",
    one: "By default the browser enforces the **Same-Origin Policy**: a script can only read responses from the same origin (scheme + host + port). **CORS** is the set of HTTP headers through which the **other origin’s server tells the browser** who may read its responses (`Access-Control-Allow-Origin` etc.). The **browser** enforces the rule, not the server: `curl` and Postman ignore CORS, and CORS protects the **user**, not the API.",
    b: [
      { t: "tp", k: "key", h: "Who protects whom", x: "Without the Same-Origin Policy, a malicious site open in another tab could read, with your cookies, the response from your bank. CORS is the controlled way to **relax** that rule for origins the server approves." },
      { t: "fl", ti: "Simple request (GET/POST with basic headers)", n: ["JS on `app.example.com` calls `api.example.com`", "Browser sends the request with `Origin: https://app.example.com`", "API replies with `Access-Control-Allow-Origin: https://app.example.com`", "Browser checks and hands the response to the JS (otherwise it blocks the read)"], c: "Note: in this case the request **reached the server and was processed**; the browser only hides the response from the script." },
      { t: "st", ti: "Request with preflight (PUT, DELETE, JSON, `Authorization`…)", i: [
        ["The browser asks first", "It sends `OPTIONS` with `Origin`, `Access-Control-Request-Method` and `Access-Control-Request-Headers`."],
        ["The server answers the policy", "`204` with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` and, optionally, `Access-Control-Max-Age` (preflight cache)."],
        ["The browser decides", "If method, headers and origin were allowed, it sends the real request; otherwise it never goes out."],
        ["The real response returns", "It also needs `Access-Control-Allow-Origin`, or the JS cannot read it."]
      ] },
      { t: "cd", ti: "Server configuration", l: "javascript (Express)", c: `app.use(cors({
  origin: ["https://app.example.com"],       // explicit allowlist
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,                          // allows cookies
  maxAge: 600                                 // preflight cache, in seconds
}))` },
      { t: "tp", k: "warn", h: "Cookies and credentials", x: "To send cookies: the client uses `credentials: 'include'` and the server answers `Access-Control-Allow-Credentials: true` with an **explicit origin**. `Access-Control-Allow-Origin: *` cannot be combined with credentials. If the server returns the origin dynamically, add `Vary: Origin`." }
    ],
    traps: [
      "Reflecting any received `Origin` (or using `*` on an API with sensitive data): it cancels the protection.",
      "Thinking CORS protects the API from outside calls: `curl`, scripts and servers ignore CORS. The API protects itself with authentication and authorization.",
      "Thinking CORS prevents CSRF: for simple requests the request is sent anyway; use `SameSite` and anti-CSRF tokens.",
      "Reading a “CORS error” as “server down”: check the Network tab for a failed preflight or a missing header.",
      "Forgetting that the preflight (`OPTIONS`) must also be answered without requiring authentication."
    ],
    rc: [
      ["Who enforces the CORS policy: the server or the browser?", "The browser. The server only declares the policy through headers; `curl` and Postman ignore it."],
      ["When does the browser send a preflight?", "When the request is not “simple”: methods like PUT/DELETE, `Content-Type: application/json`, or custom headers such as `Authorization`."]
    ]
  }
});

/* ============ 19 · Vulnerabilidades comuns ============ */
window.QS.push({
  n: 19, g: "D", m: "threat",
  pt: {
    s: "Vulnerabilidades comuns",
    q: "Quais são algumas vulnerabilidades de segurança comuns em aplicações backend e como mitigá-las?",
    why: "É uma lista, e uma lista só fica na cabeça se cada item vier colado na sua defesa. O formato ameaça → defesa guarda os pares e destaca os princípios por trás deles.",
    one: "As mais comuns seguem o **OWASP Top 10**: **controle de acesso quebrado** (IDOR), falhas de **criptografia**, **injeção**, **má configuração**, **componentes vulneráveis**, falhas de **autenticação**, **SSRF**, falhas de **log e monitoramento**, além de XSS, CSRF e esgotamento de recursos. Quase todas se reduzem a quatro princípios: **nunca confiar na entrada**, **negar por padrão**, **privilégio mínimo** e **defesa em profundidade**.",
    b: [
      { t: "pr", ti: "Ameaça → defesa", a: "Vulnerabilidade", b: "Mitigação", r: [
        ["**Controle de acesso quebrado / IDOR**: `GET /pedidos/123` devolve o pedido de outro usuário", "Autorização no servidor em **cada** acesso: conferir que o recurso pertence ao usuário; negar por padrão; IDs não sequenciais ajudam, mas não substituem a checagem."],
        ["**Falhas criptográficas**: tráfego em HTTP, segredos no código, algoritmos fracos", "TLS em todo lugar, criptografia moderna, segredos em cofre (secrets manager) e fora do repositório, senhas com Argon2/bcrypt."],
        ["**Injeção** (SQL, NoSQL, comandos de shell, LDAP)", "Consultas parametrizadas, allowlists, nunca montar comandos com entrada do usuário."],
        ["**Má configuração**: modo debug ligado, credenciais padrão, bucket público, CORS `*`", "Configuração como código, defaults seguros, revisão e varredura automática, ambientes mínimos."],
        ["**Componentes vulneráveis** (dependências e cadeia de suprimentos)", "Atualizar, `npm audit`/Dependabot/SCA, arquivos de lock, SBOM, remover dependência não usada."],
        ["**Falhas de autenticação**: força bruta, credential stuffing, sessão fixa", "MFA, rate limit, hash forte, rotacionar a sessão no login, bloqueio progressivo, verificar senhas vazadas."],
        ["**SSRF**: o servidor busca uma URL fornecida pelo usuário e alcança a rede interna ou o serviço de metadados da nuvem", "Allowlist de destinos, bloquear IPs internos e `169.254.169.254`, usar IMDSv2, segmentação de rede."],
        ["**XSS**: script injetado em página renderizada", "Escapar a saída conforme o contexto, Content-Security-Policy, cookies `HttpOnly`, sanitizar HTML."],
        ["**CSRF**: outro site dispara ações com o cookie do usuário", "Cookies `SameSite`, token anti-CSRF, exigir cabeçalho próprio em APIs."],
        ["**Exposição excessiva / mass assignment**: a API devolve ou aceita campos demais", "DTOs com campos explícitos (allowlist), nunca gravar o corpo da requisição direto no modelo."],
        ["**Esgotamento de recursos / DoS**", "Rate limit, timeouts, limite de tamanho de payload e de paginação, filas e circuit breakers."],
        ["**Falta de log e monitoramento**", "Registrar eventos de segurança (logins, falhas de autorização), alertas, sem registrar dados sensíveis."]
      ] },
      { t: "tp", k: "key", h: "Os quatro princípios por trás de tudo", x: "**Nunca confie na entrada** (valide e trate toda entrada como hostil). **Negue por padrão** (permissão explícita, não proibição explícita). **Privilégio mínimo** (cada conta e serviço só acessa o necessário). **Defesa em profundidade** (várias camadas: se uma falha, a próxima segura)." }
    ],
    traps: [
      "Autorizar só no front-end: o botão some, mas a rota continua aceitando a chamada.",
      "Confiar em ID não sequencial (UUID) como se fosse controle de acesso.",
      "Tratar segurança como etapa final em vez de requisito do desenho (threat modeling desde o início).",
      "Mensagens de erro e logs que vazam dados sensíveis, tokens ou o esquema do banco."
    ],
    rc: [
      ["O que é um IDOR e como se corrige?", "Acessar o recurso de outro usuário trocando um ID na requisição. Corrige-se verificando no servidor, a cada acesso, se o recurso pertence ao usuário autenticado."],
      ["Por que o SSRF é perigoso em nuvem?", "O atacante faz o servidor buscar URLs internas, como o serviço de metadados, e pode roubar credenciais temporárias da máquina."]
    ]
  },
  en: {
    s: "Common vulnerabilities",
    q: "What are some common security vulnerabilities in backend applications and how do you mitigate them?",
    why: "It is a list, and a list only sticks if each item is glued to its defense. The threat → defense format keeps the pairs and highlights the principles behind them.",
    one: "The most common follow the **OWASP Top 10**: **broken access control** (IDOR), **cryptographic** failures, **injection**, **misconfiguration**, **vulnerable components**, **authentication** failures, **SSRF**, **logging and monitoring** gaps, plus XSS, CSRF and resource exhaustion. Almost all reduce to four principles: **never trust input**, **deny by default**, **least privilege** and **defense in depth**.",
    b: [
      { t: "pr", ti: "Threat → defense", a: "Vulnerability", b: "Mitigation", r: [
        ["**Broken access control / IDOR**: `GET /orders/123` returns another user’s order", "Server-side authorization on **every** access: verify the resource belongs to the user; deny by default; non-sequential IDs help but do not replace the check."],
        ["**Cryptographic failures**: HTTP traffic, secrets in code, weak algorithms", "TLS everywhere, modern cryptography, secrets in a vault (secrets manager) and out of the repository, passwords with Argon2/bcrypt."],
        ["**Injection** (SQL, NoSQL, shell commands, LDAP)", "Parameterized queries, allowlists, never build commands from user input."],
        ["**Misconfiguration**: debug mode on, default credentials, public bucket, CORS `*`", "Configuration as code, secure defaults, review and automated scanning, minimal environments."],
        ["**Vulnerable components** (dependencies and supply chain)", "Update, `npm audit`/Dependabot/SCA, lock files, SBOM, remove unused dependencies."],
        ["**Authentication failures**: brute force, credential stuffing, fixed sessions", "MFA, rate limiting, strong hashing, rotate the session on login, progressive lockout, check for breached passwords."],
        ["**SSRF**: the server fetches a user-supplied URL and reaches the internal network or the cloud metadata service", "Destination allowlist, block internal IPs and `169.254.169.254`, use IMDSv2, network segmentation."],
        ["**XSS**: script injected into a rendered page", "Context-aware output escaping, Content-Security-Policy, `HttpOnly` cookies, sanitize HTML."],
        ["**CSRF**: another site triggers actions with the user’s cookie", "`SameSite` cookies, anti-CSRF token, require a custom header on APIs."],
        ["**Excessive exposure / mass assignment**: the API returns or accepts too many fields", "DTOs with explicit fields (allowlist), never write the request body straight into the model."],
        ["**Resource exhaustion / DoS**", "Rate limiting, timeouts, payload-size and pagination limits, queues and circuit breakers."],
        ["**Missing logging and monitoring**", "Record security events (logins, authorization failures), alerts, without logging sensitive data."]
      ] },
      { t: "tp", k: "key", h: "The four principles behind everything", x: "**Never trust input** (validate and treat all input as hostile). **Deny by default** (explicit permission, not explicit prohibition). **Least privilege** (each account and service accesses only what it needs). **Defense in depth** (several layers: if one fails, the next holds)." }
    ],
    traps: [
      "Authorizing only in the front end: the button disappears, but the route still accepts the call.",
      "Trusting a non-sequential ID (UUID) as if it were access control.",
      "Treating security as a final step instead of a design requirement (threat modeling from the start).",
      "Error messages and logs that leak sensitive data, tokens or the database schema."
    ],
    rc: [
      ["What is an IDOR and how is it fixed?", "Accessing another user’s resource by changing an ID in the request. It is fixed by checking on the server, at every access, that the resource belongs to the authenticated user."],
      ["Why is SSRF dangerous in the cloud?", "The attacker makes the server fetch internal URLs, like the metadata service, and can steal the machine’s temporary credentials."]
    ]
  }
});

/* ============ 20 · Senhas ============ */
window.QS.push({
  n: 20, g: "D", m: "whys",
  pt: {
    s: "Armazenar senhas",
    q: "Como você armazenaria as senhas dos usuários de forma segura em um banco de dados?",
    why: "Cada exigência da receita (hash, salt, algoritmo lento) é a resposta a uma falha da opção anterior. A cadeia de porquês reconstrói a receita em vez de pedir para decorá-la.",
    one: "Nunca guarde a senha, guarde um **hash lento e salgado**: use **Argon2id** (ou bcrypt/scrypt/PBKDF2) com **salt aleatório único por usuário**, parâmetros de custo ajustados para ~100 a 500 ms por verificação, comparação em tempo constante e **rehash** quando o custo subir. Parta do princípio de que o banco **vai vazar** e faça com que isso custe caro ao atacante. Complemente com MFA, rate limit no login e checagem de senhas vazadas.",
    b: [
      { t: "why", rows: [
        ["Por que não guardar a senha em texto puro?", "Porque um vazamento do banco (SQL injection, backup, funcionário) expõe todas as senhas de uma vez. E como as pessoas reutilizam senhas, o dano passa para outros sites."],
        ["Por que não criptografar (reversível)?", "Porque quem rouba o banco costuma roubar a chave também, e você nunca precisa ler a senha, só verificar se está certa. Então use uma função de mão única: hash."],
        ["Por que não um hash comum (MD5, SHA-256)?", "Porque eles são rápidos por projeto: uma GPU testa bilhões de palpites por segundo, e tabelas pré-computadas (rainbow tables) quebram senhas fracas em minutos."],
        ["Por que acrescentar um salt?", "Sem salt, senhas iguais geram hashes iguais e uma tabela pré-computada serve para todos. Um salt aleatório e único por usuário força o atacante a quebrar uma conta por vez. O salt não é segredo; vai junto do hash."],
        ["Por que usar um algoritmo deliberadamente lento (Argon2id, bcrypt, scrypt)?", "Porque o custo é ajustável: cada verificação leva ~100 a 500 ms, imperceptível para um login legítimo, mas torna a força bruta em escala proibitiva. Argon2 e scrypt exigem muita memória, o que limita GPUs e ASICs."]
      ], root: "O objetivo não é impedir o vazamento, é **tornar o dano caro e lento** quando ele acontecer." },
      { t: "tb", ti: "Receita e parâmetros de referência (OWASP)", h: ["Algoritmo", "Configuração mínima sugerida"], r: [
        ["**Argon2id** (preferido)", "Memória ≥ 19 MiB, 2 iterações, 1 de paralelismo (ou 46 MiB e 1 iteração)"],
        ["scrypt", "N = 2¹⁷, r = 8, p = 1"],
        ["bcrypt", "Custo (work factor) ≥ 10; limite de 72 bytes na senha"],
        ["PBKDF2-HMAC-SHA256 (se exigido por norma, como FIPS)", "≥ 600.000 iterações"]
      ], n: "Valores mudam com o hardware: ajuste para que a verificação leve algumas centenas de milissegundos no seu servidor e revise todo ano." },
      { t: "cd", l: "javascript (argon2)", c: `import argon2 from "argon2";

// cadastro: o salt aleatorio e os parametros ficam dentro da string resultante
const hash = await argon2.hash(senha, { type: argon2.argon2id });
// $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>

// login: compara em tempo constante e le os parametros da propria string
const ok = await argon2.verify(hash, senhaDigitada);
if (ok && argon2.needsRehash(hash)) { /* gravar um hash novo */ }` },
      { t: "st", ti: "Além do hash", i: [
        ["Pepper (opcional)", "Um segredo global, guardado fora do banco (cofre/HSM), misturado antes do hash. Se só o banco vazar, o atacante não consegue testar palpites."],
        ["Política de senha moderna", "Mínimo de comprimento (12+ ou frase longa) vale mais que regras de símbolos; verifique contra senhas vazadas (HIBP, com k-anonymity)."],
        ["MFA e rate limit", "Um segundo fator e limite de tentativas anulam grande parte dos ataques mesmo com senha fraca."],
        ["Fluxos auxiliares", "Reset por token de uso único e vida curta; mensagens de erro genéricas (“usuário ou senha inválidos”); nunca registrar senha em log."]
      ] }
    ],
    traps: [
      "`SHA256(senha + salt)` ainda é rápido demais: o salt resolve as tabelas pré-computadas, não a força bruta.",
      "Inventar o próprio esquema (“hash de hash”): use bibliotecas padrão e aprovadas.",
      "Comparar hashes com `==` (vazamento por tempo); use a função de verificação da biblioteca.",
      "Esquecer que o bcrypt trunca em 72 bytes e que senhas muito longas precisam de tratamento.",
      "Nunca atualizar os parâmetros: faça rehash no login quando o custo recomendado subir."
    ],
    rc: [
      ["Qual a função do salt e ele é secreto?", "Torna cada hash único e inutiliza tabelas pré-computadas, forçando o ataque conta a conta. Não é secreto: fica junto do hash."],
      ["Por que um hash de senha deve ser lento enquanto um hash de arquivo deve ser rápido?", "Para verificar integridade, velocidade é uma qualidade. Para senhas, a velocidade ajuda o atacante: cada palpite deve custar caro."]
    ]
  },
  en: {
    s: "Storing passwords",
    q: "How would you securely store users’ passwords in a database?",
    why: "Each requirement of the recipe (hash, salt, slow algorithm) answers a failure of the previous option. A chain of whys rebuilds the recipe instead of asking you to memorize it.",
    one: "Never store the password, store a **slow, salted hash**: use **Argon2id** (or bcrypt/scrypt/PBKDF2) with a **unique random salt per user**, cost parameters tuned to ~100 to 500 ms per verification, constant-time comparison and **rehash** when the cost goes up. Assume the database **will leak** and make that expensive for the attacker. Complement with MFA, login rate limiting and breached-password checks.",
    b: [
      { t: "why", rows: [
        ["Why not store the password in plain text?", "Because a database leak (SQL injection, backup, insider) exposes every password at once. And since people reuse passwords, the damage spreads to other sites."],
        ["Why not encrypt it (reversible)?", "Because whoever steals the database usually steals the key too, and you never need to read the password, only check that it is right. So use a one-way function: a hash."],
        ["Why not an ordinary hash (MD5, SHA-256)?", "Because they are fast by design: a GPU tests billions of guesses per second, and precomputed tables (rainbow tables) crack weak passwords in minutes."],
        ["Why add a salt?", "Without a salt, equal passwords give equal hashes and one precomputed table serves everyone. A random, per-user salt forces the attacker to crack one account at a time. The salt is not secret; it travels with the hash."],
        ["Why use a deliberately slow algorithm (Argon2id, bcrypt, scrypt)?", "Because the cost is tunable: each verification takes ~100 to 500 ms, imperceptible for a legitimate login but prohibitive for brute force at scale. Argon2 and scrypt need lots of memory, which limits GPUs and ASICs."]
      ], root: "The goal is not to prevent the leak, it is to **make the damage expensive and slow** when it happens." },
      { t: "tb", ti: "Recipe and reference parameters (OWASP)", h: ["Algorithm", "Suggested minimum configuration"], r: [
        ["**Argon2id** (preferred)", "Memory ≥ 19 MiB, 2 iterations, parallelism 1 (or 46 MiB and 1 iteration)"],
        ["scrypt", "N = 2¹⁷, r = 8, p = 1"],
        ["bcrypt", "Cost (work factor) ≥ 10; 72-byte password limit"],
        ["PBKDF2-HMAC-SHA256 (if required by a standard such as FIPS)", "≥ 600,000 iterations"]
      ], n: "Values change with hardware: tune so verification takes a few hundred milliseconds on your server and review yearly." },
      { t: "cd", l: "javascript (argon2)", c: `import argon2 from "argon2";

// signup: the random salt and the parameters live inside the resulting string
const hash = await argon2.hash(password, { type: argon2.argon2id });
// $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>

// login: constant-time comparison; reads parameters from the string itself
const ok = await argon2.verify(hash, typedPassword);
if (ok && argon2.needsRehash(hash)) { /* store a fresh hash */ }` },
      { t: "st", ti: "Beyond the hash", i: [
        ["Pepper (optional)", "A global secret kept outside the database (vault/HSM), mixed in before hashing. If only the database leaks, the attacker cannot test guesses."],
        ["Modern password policy", "A minimum length (12+ or a long passphrase) beats symbol rules; check against breached passwords (HIBP, using k-anonymity)."],
        ["MFA and rate limiting", "A second factor and attempt limits neutralize most attacks even with a weak password."],
        ["Supporting flows", "Reset via a single-use, short-lived token; generic error messages (“invalid username or password”); never log passwords."]
      ] }
    ],
    traps: [
      "`SHA256(password + salt)` is still too fast: the salt solves precomputed tables, not brute force.",
      "Inventing your own scheme (“hash of a hash”): use standard, vetted libraries.",
      "Comparing hashes with `==` (timing leak); use the library’s verify function.",
      "Forgetting bcrypt truncates at 72 bytes and very long passwords need handling.",
      "Never updating the parameters: rehash on login when the recommended cost rises."
    ],
    rc: [
      ["What does the salt do and is it secret?", "It makes each hash unique and defeats precomputed tables, forcing account-by-account attacks. It is not secret: it is stored with the hash."],
      ["Why must a password hash be slow while a file hash should be fast?", "For integrity checks, speed is a virtue. For passwords, speed helps the attacker: every guess must be expensive."]
    ]
  }
});
