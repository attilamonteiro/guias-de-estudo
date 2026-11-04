import type { Pergunta } from "../../tipos";

// L109 · Desempenho de API
export const l109: Pergunta = {
  numero: 209,
  modulo: "linkedin-producao",
  metodo: "playbook",
  pt: {
    titulo: "Desempenho de API",
    pergunta: "Como você otimiza o desempenho de uma API Node.js?",
    porqueEsteMetodo:
      "Otimizar é um procedimento com ordem: medir, achar o maior pedaço de tempo, corrigir e medir de novo. Um playbook evita o erro mais comum, que é mexer no código antes de saber onde o tempo vai.",
    resposta30s:
      "**Meça primeiro** (latência p95/p99 e uma carga repetível) e descubra onde o tempo vai: quase sempre é espera por **banco** e por **serviços externos**, não o JavaScript em si. Corrija nesta ordem: consultas (índices, sem **N+1**, só as colunas necessárias), chamadas independentes em **paralelo**, **cache**, **payload** menor e comprimido, e por fim tirar trabalho pesado do caminho da requisição e **somar instâncias**. Este roteiro serve para melhorar o tempo de resposta em geral e as consultas ao banco em particular.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: da API lenta à API medida",
        passos: [
          {
            titulo: "1. Defina a meta e meça",
            texto:
              "Escolha o número que importa (latência p95/p99 de um endpoint, vazão, taxa de erro) e uma carga realista e repetível; uma ferramenta de teste de carga como `autocannon` ou `k6` ajuda. Sinal: você tem um número de antes para comparar com o de depois. Sem ele, otimizar é palpite.",
          },
          {
            titulo: "2. Descubra onde o tempo vai",
            texto:
              "Divida uma requisição em etapas: banco, serviços externos, serialização, seu código. Logs com a duração de cada etapa, tracing (OpenTelemetry) ou um perfil de CPU (veja L111) apontam a etapa dominante. Se o laço de eventos estiver atrasado, o culpado é código que o bloqueia (veja L30).",
          },
          {
            titulo: "3. Consultas ao banco",
            texto:
              "Rode `EXPLAIN` nas consultas mais lentas e crie índices nas colunas de filtro, junção e ordenação. Elimine o **N+1** (uma consulta por item de uma lista) com `JOIN` ou `IN`/`ANY`. Traga só as colunas usadas (nada de `SELECT *`), pagine resultados grandes, use pool de conexões (veja L93) e evite transações longas. Sinal: menos consultas por requisição e planos que usam índice.",
          },
          {
            titulo: "4. Menos viagens, em paralelo",
            texto:
              "Chamadas independentes rodam juntas com `Promise.all` em vez de `await` em série: o tempo deixa de ser a soma e passa a ser o maior dos tempos. Limite a concorrência quando a lista for grande, defina timeouts e reaproveite conexões HTTP (keep-alive) com os serviços de que você depende.",
          },
          {
            titulo: "5. Cache",
            texto:
              "Guarde o que é caro e muda pouco: memória do processo para dados pequenos, Redis quando várias instâncias precisam compartilhar, `Cache-Control` e `ETag` nas respostas HTTP e CDN para conteúdo público (veja L100). Defina TTL e invalidação desde o começo.",
          },
          {
            titulo: "6. Reduza o payload",
            texto:
              "Pagine, deixe o cliente escolher campos e não devolva a linha inteira do banco. Comprima respostas de texto (gzip ou brotli), de preferência no proxy reverso ou na CDN. Serializar um JSON enorme também ocupa a thread principal.",
          },
          {
            titulo: "7. Tire trabalho do caminho e escale",
            texto:
              "O que o cliente não precisa esperar (e-mail, relatório, webhook) vai para uma fila, e a API responde `202`. CPU pesada vai para `worker_threads` (veja L77). Só então some instâncias atrás de um balanceador (veja T50). Meça de novo e compare com o passo 1.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "N+1 e esperas em série, antes e depois",
        legenda: "JavaScript",
        codigo: `// Lento: uma consulta por pedido (N+1) e esperas em série
for (const pedido of pedidos) {
  const { rows } = await db.query("SELECT * FROM clientes WHERE id = $1", [pedido.clienteId]);
  pedido.cliente = rows[0];
}

// Melhor: uma consulta só, apenas com as colunas usadas
const ids = [...new Set(pedidos.map((p) => p.clienteId))];
const { rows: clientes } = await db.query("SELECT id, nome FROM clientes WHERE id = ANY($1)", [ids]);

// Chamadas independentes ao mesmo tempo
const [perfil, saldo] = await Promise.all([buscarPerfil(id), buscarSaldo(id)]);`,
        nota: "Sintaxe do `pg` (PostgreSQL). Em outros bancos e ORMs a ideia é a mesma: uma consulta para o conjunto, não uma por item.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Meça, corrija o maior pedaço, meça de novo",
        texto:
          "Em APIs típicas o tempo costuma estar na espera por banco e serviços externos, não no JavaScript. Por isso o perfil e as durações por etapa vêm **antes** de qualquer reescrita, e cada mudança é seguida de uma nova medição com a mesma carga.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Mais instâncias não consertam consulta lenta",
        texto:
          "Somar instâncias multiplica conexões e consultas lentas: com cada instância abrindo o seu pool, o banco pode ser o primeiro a cair. Escale depois de corrigir o gargalo, e confira `instâncias × tamanho do pool` contra o limite de conexões do banco.",
      },
    ],
    armadilhas: [
      "Otimizar sem medir: você corrige o que parece lento e deixa o que de fato é lento.",
      "Usar `Promise.all` com milhares de itens de uma vez: estoura o pool de conexões e o serviço externo. Limite a concorrência.",
      "Cache sem TTL nem invalidação: a API fica rápida e passa a devolver dado velho.",
      "Olhar só a média: o usuário sente as caudas (p95, p99).",
    ],
    autoteste: [
      {
        pergunta: "O que é o problema N+1 e como corrigi-lo?",
        resposta:
          "É fazer uma consulta para a lista e mais uma por item dela. Corrige-se buscando tudo de uma vez, com `JOIN` ou `WHERE id = ANY(...)`, e trazendo só as colunas necessárias.",
      },
      {
        pergunta: "Chegou a queixa “a API está lenta”. Qual é o primeiro passo?",
        resposta:
          "Medir: reproduzir com uma carga conhecida e descobrir em qual etapa (banco, serviço externo, CPU, laço de eventos) o tempo é gasto, antes de mudar qualquer código.",
      },
    ],
  },
  en: {
    titulo: "API performance",
    pergunta: "How do you optimize Node.js API performance?",
    porqueEsteMetodo:
      "Optimizing is a procedure with an order: measure, find the biggest slice of time, fix it and measure again. A playbook avoids the most common mistake, which is changing code before knowing where the time goes.",
    resposta30s:
      "**Measure first** (p95/p99 latency and a repeatable load) and find where the time goes: it is almost always waiting on the **database** and on **external services**, not JavaScript itself. Fix in this order: queries (indexes, no **N+1**, only the columns you need), independent calls in **parallel**, **caching**, a smaller and compressed **payload**, and finally taking heavy work off the request path and **adding instances**. The same roadmap improves response time in general and database queries in particular.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from a slow API to a measured one",
        passos: [
          {
            titulo: "1. Set the goal and measure",
            texto:
              "Pick the number that matters (p95/p99 latency of an endpoint, throughput, error rate) and a realistic, repeatable load; a load-testing tool such as `autocannon` or `k6` helps. Signal: you have a “before” number to compare with the “after”. Without it, optimizing is guesswork.",
          },
          {
            titulo: "2. Find where the time goes",
            texto:
              "Split a request into stages: database, external services, serialization, your own code. Logs with the duration of each stage, tracing (OpenTelemetry) or a CPU profile (see L111) point to the dominant stage. If the event loop is lagging, the culprit is code that blocks it (see L30).",
          },
          {
            titulo: "3. Database queries",
            texto:
              "Run `EXPLAIN` on the slowest queries and add indexes on filter, join and sort columns. Remove **N+1** (one query per item of a list) with a `JOIN` or `IN`/`ANY`. Fetch only the columns you use (no `SELECT *`), paginate large results, use a connection pool (see L93) and avoid long transactions. Signal: fewer queries per request and plans that use an index.",
          },
          {
            titulo: "4. Fewer round trips, in parallel",
            texto:
              "Independent calls run together with `Promise.all` instead of sequential `await`s: the time stops being the sum and becomes the longest one. Limit concurrency when the list is large, set timeouts and reuse HTTP connections (keep-alive) with the services you depend on.",
          },
          {
            titulo: "5. Caching",
            texto:
              "Store what is expensive and rarely changes: process memory for small data, Redis when several instances must share it, `Cache-Control` and `ETag` on HTTP responses and a CDN for public content (see L100). Define a TTL and invalidation from the start.",
          },
          {
            titulo: "6. Shrink the payload",
            texto:
              "Paginate, let the client choose fields and do not return the whole database row. Compress text responses (gzip or brotli), preferably at the reverse proxy or CDN. Serializing a huge JSON also occupies the main thread.",
          },
          {
            titulo: "7. Take work off the path and scale",
            texto:
              "Whatever the client does not need to wait for (email, report, webhook) goes to a queue, and the API answers `202`. Heavy CPU goes to `worker_threads` (see L77). Only then add instances behind a load balancer (see T50). Measure again and compare with step 1.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "N+1 and serial waits, before and after",
        legenda: "JavaScript",
        codigo: `// Slow: one query per order (N+1) and serial waits
for (const order of orders) {
  const { rows } = await db.query("SELECT * FROM customers WHERE id = $1", [order.customerId]);
  order.customer = rows[0];
}

// Better: a single query, only the columns in use
const ids = [...new Set(orders.map((o) => o.customerId))];
const { rows: customers } = await db.query("SELECT id, name FROM customers WHERE id = ANY($1)", [ids]);

// Independent calls at the same time
const [profile, balance] = await Promise.all([fetchProfile(id), fetchBalance(id)]);`,
        nota: "`pg` (PostgreSQL) syntax. With other databases and ORMs the idea is the same: one query for the whole set, not one per item.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Measure, fix the biggest slice, measure again",
        texto:
          "In typical APIs the time tends to go to waiting on the database and external services, not to JavaScript. That is why the profile and the per-stage durations come **before** any rewrite, and every change is followed by a new measurement with the same load.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "More instances do not fix a slow query",
        texto:
          "Adding instances multiplies connections and slow queries: with every instance opening its own pool, the database may be the first thing to fall over. Scale after fixing the bottleneck, and check `instances × pool size` against the database connection limit.",
      },
    ],
    armadilhas: [
      "Optimizing without measuring: you fix what looks slow and leave what is actually slow.",
      "Using `Promise.all` on thousands of items at once: it exhausts the connection pool and the external service. Limit concurrency.",
      "Caching without a TTL or invalidation: the API gets fast and starts returning stale data.",
      "Looking only at the average: users feel the tails (p95, p99).",
    ],
    autoteste: [
      {
        pergunta: "What is the N+1 problem and how do you fix it?",
        resposta:
          "It is running one query for the list and then one more per item in it. You fix it by fetching everything at once, with a `JOIN` or `WHERE id = ANY(...)`, and bringing only the columns you need.",
      },
      {
        pergunta: "A complaint arrives: “the API is slow”. What is the first step?",
        resposta:
          "Measure: reproduce it with a known load and find which stage (database, external service, CPU, event loop) the time is spent in, before changing any code.",
      },
    ],
  },
};
