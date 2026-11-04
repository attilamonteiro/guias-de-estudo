import type { Pergunta } from "../../tipos";

// L100 · Cache e Redis
export const l100: Pergunta = {
  numero: 200,
  modulo: "linkedin-arquitetura",
  metodo: "compare",
  pt: {
    titulo: "Cache e Redis",
    pergunta: "Como você implementaria cache?",
    porqueEsteMetodo:
      "“Implementar cache” esconde escolhas que parecem a mesma coisa: onde guardar, como ler e escrever, para que usar o Redis. Matrizes lado a lado e uma regra de decisão mostram o que serve a cada dado.",
    resposta30s:
      "Cache é uma **cópia rápida de um dado caro de obter**, guardada perto de quem o usa, em camadas: memória do processo, **Redis** compartilhado, cabeçalhos HTTP e **CDN**. O padrão mais comum é o **cache-aside**: a aplicação consulta o cache, em caso de falha busca na origem e grava com **TTL**, e **invalida** a chave quando o dado muda. O Redis entra quando várias instâncias precisam do mesmo dado rápido: cache, sessões, limite de taxa, filas leves, pub/sub e locks.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Camadas de cache",
        colunas: ["Camada", "Onde fica", "Bom para", "Cuidado"],
        linhas: [
          [
            "Memória do processo (`Map`, LRU)",
            "Dentro de cada instância do Node.js",
            "Dados pequenos e quase estáticos, com a menor latência possível",
            "Cada instância tem a sua cópia e os valores divergem; sem limite de tamanho e de expiração, o processo cresce até faltar memória",
          ],
          [
            "Redis (ou Memcached)",
            "Serviço externo, compartilhado por todas as instâncias",
            "Dados lidos por muitos processos: resultados de consultas, perfis, sessões",
            "É uma ida à rede: use timeout, tenha um plano para quando ele cair e defina limite de memória e política de remoção",
          ],
          [
            "HTTP (navegador e proxies)",
            "No cliente e em intermediários, controlado por `Cache-Control`, `ETag` e `Last-Modified`",
            "Respostas públicas ou estáticas; revalidação barata com `304 Not Modified`",
            "Resposta com dados do usuário em cache compartilhado pode vazar para outra pessoa: use `private` ou `no-store`",
          ],
          [
            "CDN",
            "Servidores de borda, perto do usuário",
            "Arquivos estáticos e respostas públicas iguais para todos",
            "Invalidar exige purge; prefira URLs versionadas (nome do arquivo com hash)",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como o cache é lido e escrito",
        colunas: ["Estratégia", "Como funciona", "Ganha", "Paga"],
        linhas: [
          [
            "Cache-aside",
            "A aplicação lê o cache; se falhar, lê a origem e grava no cache. Ao alterar o dado, grava na origem e apaga a chave",
            "Simples, guarda só o que é pedido, e o sistema continua de pé se o cache cair",
            "Primeira leitura lenta (cache frio) e uma janela de dado velho; a aplicação cuida de tudo",
          ],
          [
            "Read-through",
            "A própria camada de cache busca na origem quando falha",
            "A aplicação só fala com o cache; menos código repetido",
            "Exige biblioteca ou serviço que faça isso; mesmo problema de cache frio",
          ],
          [
            "Write-through",
            "Cada escrita vai ao cache e à origem na mesma operação",
            "Cache atualizado com o que foi escrito; leituras seguintes rápidas",
            "Escrita mais lenta; guarda dados que talvez ninguém leia",
          ],
          [
            "Write-behind",
            "Grava no cache e a origem é atualizada depois, em segundo plano",
            "Escritas muito rápidas e gravações agrupadas",
            "Pode perder dados se o cache cair antes de gravar; consistência mais difícil",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde usar o Redis",
        colunas: ["Uso", "Como o Redis ajuda", "Cuidado"],
        linhas: [
          [
            "Cache de dados",
            "Chaves com expiração (TTL), lidas e gravadas direto da memória",
            "Defina TTL e política de remoção; não trate como a única cópia do dado",
          ],
          [
            "Sessões",
            "A sessão fica fora do processo e qualquer instância a lê",
            "Defina expiração e decida o que acontece se o Redis perder os dados (o usuário entra de novo?)",
          ],
          [
            "Limite de taxa (veja L49)",
            "Contador atômico com expiração por janela (`INCR` + `EXPIRE`)",
            "Escolha a chave certa (IP, usuário, token) e decida se libera ou bloqueia quando o Redis falhar",
          ],
          [
            "Filas e jobs leves",
            "Listas, streams e bibliotecas como BullMQ",
            "Para volume alto ou garantias fortes de entrega, compare com uma fila dedicada (veja L103)",
          ],
          [
            "Pub/sub",
            "Publica mensagens para vários assinantes (por exemplo, avisar todas as instâncias com WebSocket)",
            "O pub/sub clássico não guarda mensagens: quem estava desconectado perde (para guardar, use streams)",
          ],
          [
            "Locks distribuídos",
            "`SET chave valor NX PX tempo` cria um lock que expira sozinho",
            "Lock com expiração não garante exclusão mútua absoluta (pausas, relógios); para correção estrita, use também verificação no banco",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Cache só o que é **muito lido, caro de produzir e tolera ficar um pouco velho**. Comece com **cache-aside e TTL**, escolha o TTL pela defasagem que o negócio aceita, ao gravar **escreva na origem e apague a chave**, e meça a **taxa de acerto**. O que precisa estar exato no instante (saldo, estoque na hora da compra) vem da origem.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Stampede, invalidação e queda do cache",
        texto:
          "Quando uma chave popular expira, muitas requisições podem ir ao banco ao mesmo tempo (**cache stampede**). Reduza o risco com TTL com variação aleatória, uma só busca em andamento por chave (reaproveite a mesma promise), renovação antes de expirar ou um lock curto. Invalidar é a parte difícil: mesmo apagando a chave após gravar, há uma janela de dado velho. E se o Redis cair, a aplicação deve continuar, mais lenta, com timeout curto, sem derrubar o banco.",
      },
    ],
    armadilhas: [
      "Cachear sem expiração nem limite de memória: o cache cresce até derrubar o processo ou o Redis, e os dados ficam velhos para sempre.",
      "Guardar dado específico do usuário sob uma chave comum, ou em cache HTTP compartilhado: uma pessoa vê os dados de outra.",
      "Tratar o Redis como banco principal sem conferir a persistência: ele trabalha em memória, e mesmo com persistência ligada é preciso entender a configuração e o risco de perda.",
      "Ignorar o stampede e a queda do cache: no pior momento, a origem recebe todo o tráfego de uma vez.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre cache-aside e write-through?",
        resposta:
          "No cache-aside a aplicação preenche o cache só quando lê (falha, busca na origem, grava) e apaga a chave ao escrever. No write-through toda escrita vai ao cache e à origem juntas, mantendo o cache atualizado ao custo de escritas mais lentas.",
      },
      {
        pergunta: "O que é cache stampede e como reduzir o risco?",
        resposta:
          "É quando muitas requisições recarregam a mesma chave ao mesmo tempo, depois que ela expira, e sobrecarregam a origem. Reduz-se com TTL com variação aleatória, uma busca por chave em andamento, renovação antecipada ou lock curto.",
      },
    ],
  },
  en: {
    titulo: "Caching and Redis",
    pergunta: "How would you implement caching?",
    porqueEsteMetodo:
      "“Implementing caching” hides choices that look alike: where to keep the data, how to read and write it, what to use Redis for. Side-by-side matrices and a decision rule show what fits each kind of data.",
    resposta30s:
      "A cache is a **fast copy of data that is expensive to get**, kept close to whoever uses it, in layers: process memory, shared **Redis**, HTTP headers and a **CDN**. The most common pattern is **cache-aside**: the application checks the cache, on a miss reads the source and stores the result with a **TTL**, and **invalidates** the key when the data changes. Redis fits when several instances need the same data quickly: caching, sessions, rate limiting, light queues, pub/sub and locks.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cache layers",
        colunas: ["Layer", "Where it lives", "Good for", "Watch out for"],
        linhas: [
          [
            "Process memory (`Map`, LRU)",
            "Inside each Node.js instance",
            "Small, nearly static data, with the lowest possible latency",
            "Each instance has its own copy and values diverge; without a size limit and expiry, the process grows until it runs out of memory",
          ],
          [
            "Redis (or Memcached)",
            "An external service shared by all instances",
            "Data read by many processes: query results, profiles, sessions",
            "It is a network hop: use a timeout, have a plan for when it goes down, and set a memory limit and an eviction policy",
          ],
          [
            "HTTP (browser and proxies)",
            "On the client and intermediaries, controlled by `Cache-Control`, `ETag` and `Last-Modified`",
            "Public or static responses; cheap revalidation with `304 Not Modified`",
            "A response with user data in a shared cache can leak to someone else: use `private` or `no-store`",
          ],
          [
            "CDN",
            "Edge servers, close to the user",
            "Static files and public responses that are the same for everyone",
            "Invalidating needs a purge; prefer versioned URLs (file name with a hash)",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "How the cache is read and written",
        colunas: ["Strategy", "How it works", "Gains", "Pays"],
        linhas: [
          [
            "Cache-aside",
            "The application reads the cache; on a miss it reads the source and stores the result. When the data changes, it writes to the source and deletes the key",
            "Simple, stores only what is requested, and the system stays up if the cache goes down",
            "Slow first read (cold cache) and a window of stale data; the application handles everything",
          ],
          [
            "Read-through",
            "The cache layer itself fetches from the source on a miss",
            "The application only talks to the cache; less repeated code",
            "Needs a library or service that does it; same cold-cache problem",
          ],
          [
            "Write-through",
            "Every write goes to the cache and the source in the same operation",
            "The cache holds what was written; following reads are fast",
            "Slower writes; stores data nobody may read",
          ],
          [
            "Write-behind",
            "Writes to the cache and the source is updated later, in the background",
            "Very fast writes and batched updates",
            "May lose data if the cache fails before it is saved; consistency is harder",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to use Redis",
        colunas: ["Use", "How Redis helps", "Watch out for"],
        linhas: [
          [
            "Data cache",
            "Keys with expiry (TTL), read and written straight from memory",
            "Set a TTL and an eviction policy; do not treat it as the only copy of the data",
          ],
          [
            "Sessions",
            "The session lives outside the process and any instance can read it",
            "Set an expiry and decide what happens if Redis loses the data (does the user log in again?)",
          ],
          [
            "Rate limiting (see L49)",
            "An atomic counter with a per-window expiry (`INCR` + `EXPIRE`)",
            "Pick the right key (IP, user, token) and decide whether to allow or block when Redis fails",
          ],
          [
            "Queues and light jobs",
            "Lists, streams and libraries such as BullMQ",
            "For high volume or strong delivery guarantees, compare with a dedicated queue (see L103)",
          ],
          [
            "Pub/sub",
            "Publishes messages to many subscribers (for example, notifying every instance that holds WebSockets)",
            "Classic pub/sub does not store messages: anyone disconnected misses them (to keep them, use streams)",
          ],
          [
            "Distributed locks",
            "`SET key value NX PX time` creates a lock that expires on its own",
            "A lock with expiry does not guarantee absolute mutual exclusion (pauses, clocks); for strict correctness, also check in the database",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Cache only what is **read a lot, expensive to produce and can tolerate being a little stale**. Start with **cache-aside and a TTL**, choose the TTL by how much staleness the business accepts, on a write **update the source and delete the key**, and measure the **hit rate**. Whatever must be exact at that instant (balance, stock at checkout) comes from the source.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Stampede, invalidation and a cache outage",
        texto:
          "When a popular key expires, many requests may hit the database at once (**cache stampede**). Reduce the risk with a randomized TTL, a single in-flight fetch per key (reuse the same promise), refreshing before expiry or a short lock. Invalidation is the hard part: even if you delete the key after writing, there is a window of stale data. And if Redis goes down, the application must keep working, slower, with a short timeout, without taking the database down.",
      },
    ],
    armadilhas: [
      "Caching with no expiry and no memory limit: the cache grows until it brings down the process or Redis, and data stays stale forever.",
      "Storing user-specific data under a shared key, or in a shared HTTP cache: one person sees another person’s data.",
      "Treating Redis as the main database without checking persistence: it works in memory, and even with persistence on you must understand the configuration and the risk of loss.",
      "Ignoring the stampede and a cache outage: at the worst moment, the source receives all the traffic at once.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between cache-aside and write-through?",
        resposta:
          "In cache-aside the application fills the cache only when it reads (miss, read the source, store) and deletes the key on writes. In write-through every write goes to both the cache and the source, keeping the cache current at the cost of slower writes.",
      },
      {
        pergunta: "What is a cache stampede and how do you reduce the risk?",
        resposta:
          "It is when many requests reload the same key at once after it expires and overload the source. You reduce it with a randomized TTL, one in-flight fetch per key, early refresh or a short lock.",
      },
    ],
  },
};
