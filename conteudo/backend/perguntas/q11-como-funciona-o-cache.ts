import type { Pergunta } from "../../tipos";

// Q11 · Como funciona o cache
export const q11: Pergunta = {
  numero: 11,
  modulo: "cache-e-desempenho",
  metodo: "feynman",
  pt: {
    titulo: "Como funciona o cache",
    pergunta: "Como funciona o cache e quais são algumas estratégias comuns de cache?",
    porqueEsteMetodo:
      "Cache é uma ideia simples que todo mundo já usa sem perceber (a mesa de trabalho). A analogia dá a intuição e o ponto onde ela quebra, a cópia desatualizada, é a parte difícil da disciplina.",
    resposta30s:
      "Cache é uma **cópia temporária de um dado caro de obter**, guardada num lugar mais rápido e mais perto de quem usa. Funciona porque o acesso tem **localidade**: poucos dados concentram a maioria dos pedidos. As estratégias definem **quem preenche o cache** (cache-aside, read-through), **quando grava** (write-through, write-behind) e **como o dado sai** (TTL, invalidação, LRU). A parte difícil é a invalidação: a cópia pode ficar velha.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Os documentos que você usa todo dia ficam na mesa; o resto fica no arquivo do porão. A mesa é pequena e rápida, o porão é grande e lento. Achou na mesa: acerto (hit). Teve que descer ao porão: erro (miss).",
        tecnico:
          "O cache fica entre quem pede e a fonte lenta (banco, API externa, cálculo pesado). Em cada pedido: se a chave está no cache, devolve (**hit**, microssegundos); se não, busca na fonte, guarda e devolve (**miss**). O que importa é o **hit ratio**. Existem camadas: cache do navegador, CDN, cache da aplicação (Redis, em memória), cache do banco e dos buffers do próprio banco. Funciona porque poucos itens recebem a maioria das leituras (distribuição de Pareto).",
        limite:
          "A cópia da mesa não sabe quando o original do porão mudou. Em sistemas, o cache pode ficar silenciosamente desatualizado, e a memória do cache é limitada, então algo precisa sair para entrar algo novo.",
      },
      {
        tipo: "tabela",
        titulo: "Estratégias de leitura e escrita",
        colunas: ["Estratégia", "Como funciona", "Prós e contras"],
        linhas: [
          [
            "Cache-aside (lazy)",
            "A aplicação lê do cache; no miss, lê do banco e preenche o cache",
            "Mais comum e flexível; o primeiro acesso é lento; risco de dado velho",
          ],
          [
            "Read-through",
            "O próprio cache busca no banco quando há miss",
            "Código da aplicação mais simples; depende do provedor de cache",
          ],
          ["Write-through", "Grava no cache e no banco na mesma operação", "Cache sempre coerente; escrita mais lenta"],
          [
            "Write-behind (write-back)",
            "Grava no cache e persiste no banco depois, em lote",
            "Escrita muito rápida; risco de perder dados se o cache cair",
          ],
          [
            "Write-around",
            "Grava só no banco; o cache se preenche na leitura",
            "Evita encher o cache com dado que ninguém lê; leitura seguinte é miss",
          ],
          [
            "Refresh-ahead",
            "Renova entradas populares antes de expirarem",
            "Menos misses; gasta recurso com o que pode não ser usado",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como o dado sai do cache",
        colunas: ["Mecanismo", "Ideia"],
        linhas: [
          ["TTL (tempo de vida)", "Expira sozinho depois de N segundos; simples e limita a idade do dado velho"],
          [
            "Invalidação explícita",
            "Ao alterar o dado, apague (ou atualize) a chave; preciso, mas fácil de esquecer um caminho",
          ],
          ["Chaves versionadas", "`user:42:v7`; mudar a versão “invalida” tudo sem apagar"],
          [
            "Política de remoção (eviction)",
            "Memória cheia: LRU (menos usado recentemente), LFU (menos frequente), FIFO",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cache-aside com TTL e jitter",
        legenda: "pseudocódigo",
        codigo:
          "valor = cache.get(chave)\nif valor is None:                              # miss\n    valor = banco.consultar(...)\n    cache.set(chave, valor, ttl=300 + random(0, 60))   # jitter evita expirar tudo junto\nreturn valor",
      },
      {
        tipo: "tabela",
        titulo: "Problemas clássicos",
        colunas: ["Problema", "O que é", "Remédio"],
        linhas: [
          [
            "Cache stampede",
            "Chave popular expira e centenas de requisições vão ao banco ao mesmo tempo",
            "Lock ou single-flight na reconstrução, TTL com jitter, stale-while-revalidate",
          ],
          [
            "Penetração",
            "Pedidos de chaves que não existem sempre passam pelo cache até o banco",
            "Cache negativo (guardar “não existe” por pouco tempo), Bloom filter",
          ],
          [
            "Hot key",
            "Uma chave concentra o tráfego de um nó",
            "Réplicas da chave, cache local em memória na aplicação",
          ],
          [
            "Dado velho",
            "O cache serve valor antigo após uma alteração",
            "Invalidar na escrita, TTL curto, aceitar a janela conscientemente",
          ],
        ],
      },
    ],
    armadilhas: [
      "Cachear sem política de invalidação: o bug aparece como “o dado não atualiza”.",
      "Cachear dado específico de usuário numa chave compartilhada: vazamento entre usuários.",
      "Tratar o cache como fonte da verdade: ele pode sumir a qualquer momento (restart, eviction).",
      "Todos os TTLs iguais: a expiração em massa gera stampede.",
    ],
    autoteste: [
      {
        pergunta: "O que significa hit ratio e por que ele importa?",
        resposta:
          "É a fração de pedidos atendidos pelo cache. Quanto maior, menos carga na fonte lenta; um cache com hit ratio baixo só acrescenta latência e custo.",
      },
      {
        pergunta: "Qual a diferença entre write-through e write-behind?",
        resposta:
          "No write-through grava no cache e no banco juntos (coerente, mais lento). No write-behind grava no cache e persiste depois (rápido, mas pode perder dados se o cache cair).",
      },
    ],
  },
  en: {
    titulo: "How caching works",
    pergunta: "How does caching work and what are some common caching strategies?",
    porqueEsteMetodo:
      "Caching is a simple idea everybody already uses without noticing (the work desk). The analogy gives the intuition, and the point where it breaks, the stale copy, is the hard part of the discipline.",
    resposta30s:
      "A cache is a **temporary copy of data that is expensive to obtain**, kept somewhere faster and closer to the consumer. It works because access has **locality**: a few items receive most requests. Strategies define **who fills the cache** (cache-aside, read-through), **when it writes** (write-through, write-behind) and **how data leaves** (TTL, invalidation, LRU). The hard part is invalidation: the copy can go stale.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "The documents you use every day stay on your desk; the rest sits in the basement archive. The desk is small and fast, the basement is big and slow. Found it on the desk: hit. Had to go down to the basement: miss.",
        tecnico:
          "The cache sits between the requester and the slow source (database, external API, heavy computation). On each request: if the key is in the cache, return it (**hit**, microseconds); if not, fetch from the source, store it and return it (**miss**). What matters is the **hit ratio**. Layers exist: browser cache, CDN, application cache (Redis, in-memory), database cache and its own buffers. It works because few items receive most reads (Pareto distribution).",
        limite:
          "The desk copy does not know when the basement original changed. In systems the cache can silently go stale, and cache memory is limited, so something must leave for something new to enter.",
      },
      {
        tipo: "tabela",
        titulo: "Read and write strategies",
        colunas: ["Strategy", "How it works", "Pros and cons"],
        linhas: [
          [
            "Cache-aside (lazy)",
            "The app reads from the cache; on a miss it reads the database and fills the cache",
            "Most common and flexible; first access is slow; stale-data risk",
          ],
          [
            "Read-through",
            "The cache itself fetches from the database on a miss",
            "Simpler app code; depends on the cache provider",
          ],
          [
            "Write-through",
            "Writes to the cache and the database in the same operation",
            "Cache always coherent; slower writes",
          ],
          [
            "Write-behind (write-back)",
            "Writes to the cache and persists to the database later, in batches",
            "Very fast writes; risk of data loss if the cache dies",
          ],
          [
            "Write-around",
            "Writes only to the database; the cache fills on read",
            "Avoids filling the cache with unread data; next read is a miss",
          ],
          [
            "Refresh-ahead",
            "Renews popular entries before they expire",
            "Fewer misses; spends resources on what may go unused",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "How data leaves the cache",
        colunas: ["Mechanism", "Idea"],
        linhas: [
          ["TTL (time to live)", "Expires by itself after N seconds; simple and bounds how stale data can be"],
          ["Explicit invalidation", "On change, delete (or update) the key; precise, but easy to forget a code path"],
          ["Versioned keys", "`user:42:v7`; bumping the version “invalidates” everything without deleting"],
          ["Eviction policy", "Memory full: LRU (least recently used), LFU (least frequently used), FIFO"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cache-aside with TTL and jitter",
        legenda: "pseudocode",
        codigo:
          "value = cache.get(key)\nif value is None:                              # miss\n    value = db.query(...)\n    cache.set(key, value, ttl=300 + random(0, 60))   # jitter avoids expiring everything together\nreturn value",
      },
      {
        tipo: "tabela",
        titulo: "Classic problems",
        colunas: ["Problem", "What it is", "Remedy"],
        linhas: [
          [
            "Cache stampede",
            "A popular key expires and hundreds of requests hit the database at once",
            "Lock or single-flight on rebuild, TTL with jitter, stale-while-revalidate",
          ],
          [
            "Penetration",
            "Requests for keys that do not exist always go through the cache to the database",
            "Negative caching (store “does not exist” briefly), Bloom filter",
          ],
          ["Hot key", "One key concentrates a node’s traffic", "Replicas of the key, local in-process cache"],
          [
            "Stale data",
            "The cache serves an old value after a change",
            "Invalidate on write, short TTL, consciously accept the window",
          ],
        ],
      },
    ],
    armadilhas: [
      "Caching without an invalidation policy: the bug shows up as “the data does not update”.",
      "Caching user-specific data under a shared key: leakage across users.",
      "Treating the cache as the source of truth: it can vanish at any time (restart, eviction).",
      "All TTLs equal: mass expiration causes a stampede.",
    ],
    autoteste: [
      {
        pergunta: "What is the hit ratio and why does it matter?",
        resposta:
          "The fraction of requests served by the cache. The higher it is, the less load on the slow source; a cache with a low hit ratio only adds latency and cost.",
      },
      {
        pergunta: "What is the difference between write-through and write-behind?",
        resposta:
          "Write-through writes to the cache and the database together (coherent, slower). Write-behind writes to the cache and persists later (fast, but may lose data if the cache dies).",
      },
    ],
  },
};
