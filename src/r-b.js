/* roadmap.sh · Intermediário (R16-R33, ids 116-133). */
window.QS = window.QS || [];

/* R16 */
window.QS.push({
  n: 116, g: "M", m: "firstprinciples",
  pt: {
    s: "Busca full-text",
    q: "Descreva como você implementaria uma busca full-text em um banco de dados.",
    why: "Busca de texto não nasce pronta: começa num `LIKE` ingênuo que quebra a cada exigência (acento, plural, relevância, escala). Construir do zero mostra por que existe o índice invertido.",
    one: "Normalize o texto (**tokenização, minúsculas, remoção de acentos e stop words, stemming**), construa um **índice invertido** (`palavra → documentos`), normalize a consulta do mesmo jeito e **ordene por relevância** (TF-IDF ou BM25). Na prática, use o recurso nativo do banco (`tsvector` + GIN no Postgres, `FULLTEXT` no MySQL) ou um motor como **Elasticsearch/OpenSearch/Meilisearch** quando precisar de escala e relevância avançada.",
    b: [
      { t: "st", ti: "Construindo, uma restrição por vez", i: [
        ["0. O problema", "Achar documentos que contêm palavras, mesmo com variações, rápido e ordenados por relevância."],
        ["1. O jeito ingênuo", "`WHERE texto LIKE '%palavra%'` varre tudo, não ignora acento nem plural e não ordena por relevância. Não escala."],
        ["2. Normalizar o texto", "Minúsculas, remoção de acentos, **tokenização**, remoção de **stop words** (de, a, o) e **stemming/lematização** (`carros` → `carro`)."],
        ["3. Índice invertido", "Um mapa `palavra → lista de documentos (e posições)`. Buscar vira consultar o mapa e cruzar as listas."],
        ["4. Consulta e ranking", "A consulta passa pela mesma normalização. Resultados ordenados por relevância (TF-IDF ou BM25: palavras raras e frequentes no documento pesam mais), com busca por frase e tolerância a erro de digitação (fuzzy)."],
        ["5. Escolha prática", "Nativo do banco para volumes moderados; Elasticsearch, OpenSearch ou Meilisearch quando precisar de escala, facetas e relevância avançada."]
      ] },
      { t: "cd", l: "sql (postgres)", c: `CREATE INDEX idx_docs_busca ON docs USING GIN (to_tsvector('portuguese', texto));

SELECT id, ts_rank(to_tsvector('portuguese', texto), q) AS rank
FROM docs, plainto_tsquery('portuguese', 'carro eletrico') q
WHERE to_tsvector('portuguese', texto) @@ q
ORDER BY rank DESC LIMIT 20;` }
    ],
    traps: [
      "Usar `LIKE '%x%'` e esperar escala e relevância.",
      "Indexar com um idioma e consultar com outro.",
      "Deixar o índice de busca desatualizado em relação ao banco principal.",
      "Tratar o motor de busca como fonte da verdade."
    ],
    rc: [
      ["O que é um índice invertido?", "Um mapa de cada palavra para os documentos (e posições) em que ela aparece, o que torna a busca uma consulta ao mapa."],
      ["Por que normalizar a consulta do mesmo jeito que o texto?", "Para que “Carros” na busca encontre “carro” no texto; os dois precisam passar pela mesma análise."]
    ]
  },
  en: {
    s: "Full-text search",
    q: "Describe how you would implement full-text search in a database.",
    why: "Text search is not born finished: it starts as a naive `LIKE` that breaks at each demand (accents, plurals, relevance, scale). Building from scratch shows why the inverted index exists.",
    one: "Normalize the text (**tokenization, lowercase, accent and stop-word removal, stemming**), build an **inverted index** (`word → documents`), normalize the query the same way and **rank by relevance** (TF-IDF or BM25). In practice, use the database’s native feature (`tsvector` + GIN in Postgres, `FULLTEXT` in MySQL) or an engine such as **Elasticsearch/OpenSearch/Meilisearch** when you need scale and advanced relevance.",
    b: [
      { t: "st", ti: "Building up, one constraint at a time", i: [
        ["0. The problem", "Find documents containing words, even with variations, fast and ranked by relevance."],
        ["1. The naive way", "`WHERE text LIKE '%word%'` scans everything, ignores neither accents nor plurals and does not rank by relevance. It does not scale."],
        ["2. Normalize the text", "Lowercase, accent removal, **tokenization**, **stop-word** removal (the, a, of) and **stemming/lemmatization** (`cars` → `car`)."],
        ["3. Inverted index", "A map `word → list of documents (and positions)`. Searching becomes looking up the map and intersecting the lists."],
        ["4. Query and ranking", "The query goes through the same normalization. Results ranked by relevance (TF-IDF or BM25: rare words and words frequent in the document weigh more), with phrase search and typo tolerance (fuzzy)."],
        ["5. Practical choice", "Native database features for moderate volumes; Elasticsearch, OpenSearch or Meilisearch when you need scale, facets and advanced relevance."]
      ] },
      { t: "cd", l: "sql (postgres)", c: `CREATE INDEX idx_docs_search ON docs USING GIN (to_tsvector('english', body));

SELECT id, ts_rank(to_tsvector('english', body), q) AS rank
FROM docs, plainto_tsquery('english', 'electric car') q
WHERE to_tsvector('english', body) @@ q
ORDER BY rank DESC LIMIT 20;` }
    ],
    traps: [
      "Using `LIKE '%x%'` and expecting scale and relevance.",
      "Indexing with one language and querying with another.",
      "Leaving the search index out of sync with the main database.",
      "Treating the search engine as the source of truth."
    ],
    rc: [
      ["What is an inverted index?", "A map from each word to the documents (and positions) where it appears, which makes search a lookup in the map."],
      ["Why normalize the query the same way as the text?", "So “Cars” in the search finds “car” in the text; both must go through the same analysis."]
    ]
  }
});

/* R17 */
window.QS.push({
  n: 117, g: "M", m: "playbook",
  pt: {
    s: "Processamento em lote",
    q: "Como você abordaria o processamento em lote (batch) numa aplicação que lida com muitos dados?",
    why: "Batch é uma sequência de decisões de projeto (dividir, paralelizar, retomar, tratar erros). O playbook mostra o que decidir em cada etapa.",
    one: "Divida o trabalho em **pedaços (chunks)**, **paralelize** por chave ou intervalo (para volumes muito grandes, **Spark** ou **Hadoop**), torne cada pedaço **idempotente e reiniciável** com checkpoints, trate **erros por registro** sem derrubar o lote, **proteja os sistemas ao redor** (taxa, réplicas, horário) e **monitore** progresso e duração.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Defina o que é lote e quando roda", "Volume grande sem resposta imediata (fechamentos, relatórios, ETL, reprocessamentos), numa janela agendada ou sob demanda."],
        ["Divida em chunks", "Leia e processe por blocos (por exemplo, 1.000 registros) para limitar a memória e permitir paralelismo."],
        ["Paralelize", "Particione por chave ou intervalo e use vários workers. Para volumes enormes, processamento distribuído (Spark, Hadoop) ou serviços gerenciados (AWS Batch, Dataflow)."],
        ["Idempotente e reiniciável", "Checkpoint do último bloco concluído; reprocessar o mesmo bloco não duplica efeito (upsert, chaves únicas)."],
        ["Erros por registro", "O registro ruim vai para uma fila ou tabela de erros sem derrubar o lote; relatório ao final."],
        ["Proteja os vizinhos", "Limite a taxa de leitura e escrita, prefira réplica de leitura, rode fora do horário de pico."],
        ["Monitore", "Progresso, duração e taxa de erro, com alerta se não terminar a tempo."]
      ] },
      { t: "tp", k: "key", h: "Batch vs stream", x: "**Batch** processa dados acumulados em intervalos (alta vazão, latência de minutos a horas). **Stream** processa cada evento ao chegar (baixa latência). Escolha pela latência que o negócio exige." }
    ],
    traps: [
      "Carregar o conjunto inteiro na memória.",
      "Lote que falha no meio e recomeça do zero (sem checkpoint).",
      "Rodar contra o banco principal em horário de pico.",
      "Lote não idempotente: reexecutar duplica dados."
    ],
    rc: [
      ["Por que processar em chunks?", "Limita o uso de memória, permite paralelizar e retomar do último chunk concluído."],
      ["Quando usar Spark em vez de um script simples?", "Quando o volume excede o que uma máquina processa em tempo aceitável e é preciso distribuir o trabalho."]
    ]
  },
  en: {
    s: "Batch processing",
    q: "How would you approach batch processing in a data-heavy application?",
    why: "Batch is a sequence of design decisions (split, parallelize, resume, handle errors). The playbook shows what to decide at each stage.",
    one: "Split the work into **chunks**, **parallelize** by key or range (for very large volumes, **Spark** or **Hadoop**), make each chunk **idempotent and restartable** with checkpoints, handle **per-record errors** without killing the batch, **protect surrounding systems** (rate, replicas, schedule) and **monitor** progress and duration.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Define what a batch is and when it runs", "Large volume with no immediate answer (closings, reports, ETL, reprocessing), in a scheduled window or on demand."],
        ["Split into chunks", "Read and process in blocks (for example 1,000 records) to bound memory and allow parallelism."],
        ["Parallelize", "Partition by key or range and use several workers. For huge volumes, distributed processing (Spark, Hadoop) or managed services (AWS Batch, Dataflow)."],
        ["Idempotent and restartable", "Checkpoint the last completed block; reprocessing the same block does not duplicate effects (upsert, unique keys)."],
        ["Per-record errors", "The bad record goes to an error queue or table without killing the batch; a report at the end."],
        ["Protect the neighbors", "Limit read and write rate, prefer a read replica, run outside peak hours."],
        ["Monitor", "Progress, duration and error rate, with an alert if it does not finish in time."]
      ] },
      { t: "tp", k: "key", h: "Batch vs stream", x: "**Batch** processes accumulated data at intervals (high throughput, minutes-to-hours latency). **Stream** processes each event as it arrives (low latency). Choose by the latency the business needs." }
    ],
    traps: [
      "Loading the whole dataset into memory.",
      "A batch that fails midway and restarts from zero (no checkpoint).",
      "Running against the main database at peak time.",
      "A non-idempotent batch: rerunning duplicates data."
    ],
    rc: [
      ["Why process in chunks?", "It bounds memory use, allows parallelism and lets you resume from the last completed chunk."],
      ["When use Spark instead of a simple script?", "When the volume exceeds what one machine can process in acceptable time and the work must be distributed."]
    ]
  }
});

/* R18 */
window.QS.push({
  n: 118, g: "M", m: "feynman",
  pt: {
    s: "Benefícios da fila de mensagens",
    q: "Você pode explicar o uso e os benefícios de uma fila de mensagens em um sistema distribuído?",
    why: "Uma fila é fácil de entender como caixa de correio. A analogia mostra os benefícios, e o ponto onde ela quebra (entrega duplicada e fora de ordem) mostra os custos.",
    one: "A fila fica entre **produtores** e **consumidores** e traz **desacoplamento** (um não precisa estar no ar junto com o outro), **buffer de picos** (o consumidor processa no seu ritmo), **resiliência** (mensagens esperam se o consumidor cair e são reprocessadas), **escala** (mais consumidores em paralelo) e **retentativas/DLQ**. O preço: entrega ao menos uma vez, duplicatas, ordem limitada e consistência eventual.",
    b: [
      { t: "an",
        s: "Uma caixa de correio na entrada do prédio: o carteiro deixa a carta e vai embora sem esperar o morador, que pega quando puder. Se chegarem 50 cartas de uma vez, elas esperam na caixa.",
        k: "Os serviços **publicam eventos** na fila e outros **reagem** a eles, em vez de consultarem uns aos outros o tempo todo (polling): é a base de uma arquitetura reativa. Isso desacopla no tempo e permite escalar cada lado separadamente.",
        b: "A caixa de correio não garante que a carta será lida uma única vez, nem na ordem de chegada. Filas trazem **entrega ao menos uma vez**, duplicatas, ordem limitada e a necessidade de monitorar." },
      { t: "tb", ti: "Com e sem fila", h: ["", "Chamada direta", "Com fila"], r: [
        ["Acoplamento", "Alto: depende de o outro estar no ar", "Baixo: só conhecem a fila"],
        ["Pico de tráfego", "Derruba o destino", "A fila absorve; o consumidor segue no seu ritmo"],
        ["Falha do consumidor", "Erro para quem chamou", "A mensagem espera e é reprocessada"],
        ["Resposta ao cliente", "Depende de toda a cadeia", "Responde depois de enfileirar"],
        ["Complexidade", "Menor", "Maior: duplicatas, ordem, monitoramento"]
      ], n: "Para desenhar uma fila do zero, veja a Q22; para eventos, a Q04." }
    ],
    traps: [
      "Achar que a fila garante “exatamente uma vez”.",
      "Fila sem DLQ e sem monitoramento do atraso.",
      "Usar fila quando uma chamada síncrona simples resolveria."
    ],
    rc: [
      ["Cite três benefícios de uma fila de mensagens.", "Desacoplamento, absorção de picos (buffer) e resiliência com retentativas; também permite escalar consumidores."],
      ["Qual o preço de usar uma fila?", "Mais complexidade: duplicatas, ordem limitada, consistência eventual e necessidade de monitorar."]
    ]
  },
  en: {
    s: "Benefits of a message queue",
    q: "Can you explain the use and benefits of a message queue in a distributed system?",
    why: "A queue is easy to grasp as a mailbox. The analogy shows the benefits, and the point where it breaks (duplicate and out-of-order delivery) shows the costs.",
    one: "The queue sits between **producers** and **consumers** and brings **decoupling** (one need not be up at the same time as the other), **spike buffering** (the consumer works at its own pace), **resilience** (messages wait if the consumer dies and are reprocessed), **scale** (more consumers in parallel) and **retries/DLQ**. The price: at-least-once delivery, duplicates, limited ordering and eventual consistency.",
    b: [
      { t: "an",
        s: "A mailbox at the building entrance: the mail carrier drops the letter and leaves without waiting for the resident, who picks it up when able. If 50 letters arrive at once, they wait in the box.",
        k: "Services **publish events** to the queue and others **react** to them, instead of polling each other all the time: this is the basis of a reactive architecture. It decouples in time and lets each side scale separately.",
        b: "The mailbox does not guarantee a letter is read only once, or in arrival order. Queues bring **at-least-once delivery**, duplicates, limited ordering and the need to monitor." },
      { t: "tb", ti: "With and without a queue", h: ["", "Direct call", "With a queue"], r: [
        ["Coupling", "High: depends on the other being up", "Low: they only know the queue"],
        ["Traffic spike", "Takes the target down", "The queue absorbs; the consumer keeps its pace"],
        ["Consumer failure", "Error to the caller", "The message waits and is reprocessed"],
        ["Response to the client", "Depends on the whole chain", "Replies after enqueueing"],
        ["Complexity", "Lower", "Higher: duplicates, ordering, monitoring"]
      ], n: "To design a queue from scratch, see Q22; for events, Q04." }
    ],
    traps: [
      "Believing the queue guarantees “exactly once”.",
      "A queue with no DLQ and no lag monitoring.",
      "Using a queue when a simple synchronous call would do."
    ],
    rc: [
      ["Name three benefits of a message queue.", "Decoupling, spike absorption (buffer) and resilience through retries; it also allows scaling consumers."],
      ["What is the price of using a queue?", "More complexity: duplicates, limited ordering, eventual consistency and the need to monitor."]
    ]
  }
});

/* R19 */
window.QS.push({
  n: 119, g: "M", m: "whys",
  pt: {
    s: "Conexões de banco sob alta carga",
    q: "Que estratégias você usaria para gerenciar conexões de banco de dados em um cenário de alta carga?",
    why: "A solução (pool) só faz sentido depois de entender por que a conexão é um recurso escasso. A cadeia de porquês constrói a estratégia a partir do problema.",
    one: "A conexão ao banco é **cara e limitada**. Use um **pool de conexões** para reutilizá-las, **dimensione o pool** pelo limite do banco (somando todas as instâncias), **ocupe cada conexão por menos tempo** (queries rápidas, transações curtas), distribua leituras em **réplicas**, e use um **pooler** (PgBouncer, RDS Proxy) quando houver muitas instâncias.",
    b: [
      { t: "why", rows: [
        ["Por que conexões viram problema sob carga?", "Cada conexão é cara: abre um processo ou thread no banco, aloca memória e exige handshake e autenticação. O banco aguenta algumas centenas, não milhares."],
        ["Por que abrir uma por requisição não funciona?", "Porque o custo de abrir e fechar domina o tempo da consulta, e muitas requisições simultâneas esgotam o limite (`max_connections`)."],
        ["Por que um pool resolve?", "Ele mantém um conjunto de conexões abertas e as **reutiliza**: a requisição pega uma, usa e devolve. Elimina o custo de abrir e limita o total."],
        ["Por que o tamanho do pool importa?", "Pool pequeno enfileira requisições; grande demais sobrecarrega o banco. Comece pequeno (dezenas) e ajuste por medição. A soma de todas as instâncias não pode passar do limite do banco."],
        ["Por que ainda é preciso reduzir o tempo de cada conexão?", "Quanto menos tempo cada consulta ocupa a conexão, mais requisições o mesmo pool atende: otimize queries, mantenha transações curtas e não segure conexão durante chamadas externas."]
      ], root: "O recurso escasso é a **conexão**: reutilize (pool), limite e **ocupe por menos tempo**." },
      { t: "st", ti: "Táticas complementares", i: [
        ["PgBouncer ou RDS Proxy", "Pooler externo que multiplexa muitas conexões de aplicação em poucas conexões reais ao banco."],
        ["Réplicas de leitura", "Distribuem as consultas de leitura entre bancos."],
        ["Timeouts e limites", "Timeout para obter conexão do pool, `statement_timeout` e fila limitada: falhe rápido."],
        ["Cache", "Tira leituras repetidas do banco."]
      ] }
    ],
    traps: [
      "Pool por instância sem somar: 50 instâncias × 20 conexões = 1.000 no banco.",
      "Vazar conexões (não devolvê-las ao pool depois de um erro): use `finally`.",
      "Manter transação aberta durante uma chamada HTTP externa.",
      "Aumentar o pool para curar lentidão: costuma piorar."
    ],
    rc: [
      ["Por que um pool maior nem sempre ajuda?", "O banco tem capacidade limitada; mais conexões simultâneas aumentam a contenção e podem deixá-lo mais lento."],
      ["O que faz um pooler como o PgBouncer?", "Multiplexa muitas conexões de clientes num número pequeno de conexões reais ao banco."]
    ]
  },
  en: {
    s: "Database connections under load",
    q: "What strategies would you use to manage database connections in a high-load scenario?",
    why: "The solution (a pool) only makes sense after understanding why a connection is a scarce resource. The chain of whys builds the strategy from the problem.",
    one: "A database connection is **expensive and limited**. Use a **connection pool** to reuse them, **size the pool** by the database limit (summing all instances), **hold each connection for less time** (fast queries, short transactions), spread reads across **replicas**, and use a **pooler** (PgBouncer, RDS Proxy) when there are many instances.",
    b: [
      { t: "why", rows: [
        ["Why do connections become a problem under load?", "Each connection is expensive: it opens a process or thread in the database, allocates memory and needs a handshake and authentication. The database handles a few hundred, not thousands."],
        ["Why does opening one per request not work?", "Because the cost of opening and closing dominates the query time, and many simultaneous requests exhaust the limit (`max_connections`)."],
        ["Why does a pool solve it?", "It keeps a set of connections open and **reuses** them: a request takes one, uses it and returns it. It removes the opening cost and caps the total."],
        ["Why does pool size matter?", "A small pool queues requests; too big overloads the database. Start small (tens) and tune by measurement. The sum across all instances cannot exceed the database limit."],
        ["Why must you still shorten each connection’s hold time?", "The less time each query holds the connection, the more requests the same pool serves: optimize queries, keep transactions short and do not hold a connection during external calls."]
      ], root: "The scarce resource is the **connection**: reuse it (pool), cap it and **hold it for less time**." },
      { t: "st", ti: "Complementary tactics", i: [
        ["PgBouncer or RDS Proxy", "An external pooler that multiplexes many application connections into few real database connections."],
        ["Read replicas", "Spread read queries across databases."],
        ["Timeouts and limits", "A timeout to get a pooled connection, `statement_timeout` and a bounded queue: fail fast."],
        ["Cache", "Takes repeated reads off the database."]
      ] }
    ],
    traps: [
      "A pool per instance without summing: 50 instances × 20 connections = 1,000 on the database.",
      "Leaking connections (not returning them to the pool after an error): use `finally`.",
      "Holding a transaction open during an external HTTP call.",
      "Growing the pool to cure slowness: it usually makes things worse."
    ],
    rc: [
      ["Why does a bigger pool not always help?", "The database has limited capacity; more simultaneous connections raise contention and can make it slower."],
      ["What does a pooler like PgBouncer do?", "It multiplexes many client connections into a small number of real database connections."]
    ]
  }
});

/* R20 */
window.QS.push({
  n: 120, g: "M", m: "playbook",
  pt: {
    s: "Pipeline de CI/CD",
    q: "Como você configuraria um pipeline de integração e entrega contínuas (CI/CD) para serviços de backend?",
    why: "Um pipeline é uma sequência de estágios em que cada um filtra um tipo de erro. O playbook segue a ordem em que você os montaria.",
    one: "O **commit** dispara o pipeline: **build** reproduzível que gera um **artefato versionado uma única vez**, **testes automatizados** (lint, unitários, integração, varredura de dependências e segredos), **publicação** do artefato num registro, **deploy automático em staging** com smoke tests, **promoção para produção** com estratégia segura (rolling, blue-green, canary) e **rollback** fácil. Se algo falha, o pipeline para.",
    b: [
      { t: "st", ti: "Os estágios", i: [
        ["Gatilho no controle de versão", "Push ou pull request num branch dispara o pipeline (o Git é a fonte da verdade)."],
        ["Build reprodutível", "Instala as dependências pelo lockfile, compila e gera um **artefato versionado** (imagem Docker, pacote), uma única vez."],
        ["Testes automatizados", "Lint, análise estática, testes unitários e de integração; falhou, o pipeline para. Varredura de dependências e de segredos."],
        ["Publicar o artefato", "Guarde num registro (Docker registry, Artifactory, Nexus): o **mesmo** artefato segue para todos os ambientes."],
        ["Deploy em staging", "Sobe, roda as migrações, smoke tests e testes de ponta a ponta."],
        ["Promoção para produção", "Com aprovação ou automática, usando rolling, blue-green ou canary."],
        ["Rollback e observabilidade", "Voltar à versão anterior com um comando; métricas e alertas logo após o deploy."]
      ] },
      { t: "tb", ti: "CI, entrega e implantação contínuas", h: ["Termo", "O que é"], r: [
        ["Integração contínua (CI)", "Integrar e validar o código várias vezes ao dia, com build e testes automáticos"],
        ["Entrega contínua", "Todo commit validado fica pronto para produção; o deploy é uma decisão (um clique)"],
        ["Implantação contínua", "Todo commit validado vai para produção sozinho"]
      ], n: "Plataformas comuns: GitHub Actions, GitLab CI/CD, Azure Pipelines, CircleCI e Jenkins." }
    ],
    traps: [
      "Reconstruir o artefato em cada ambiente: o que foi testado não é o que vai ao ar.",
      "Pipeline lento demais: ninguém espera e acaba contornando.",
      "Segredos no repositório ou nos logs.",
      "Não ter plano de rollback."
    ],
    rc: [
      ["Por que construir o artefato uma única vez?", "Para garantir que o que foi testado é exatamente o que vai para produção."],
      ["Qual a diferença entre entrega contínua e implantação contínua?", "Na entrega contínua o deploy em produção depende de uma decisão; na implantação contínua ele é automático depois dos testes."]
    ]
  },
  en: {
    s: "CI/CD pipeline",
    q: "How would you set up a continuous integration/continuous deployment (CI/CD) pipeline for backend services?",
    why: "A pipeline is a sequence of stages where each filters one kind of error. The playbook follows the order in which you would build them.",
    one: "A **commit** triggers the pipeline: a reproducible **build** producing a **versioned artifact once**, **automated tests** (lint, unit, integration, dependency and secret scanning), **publishing** the artifact to a registry, **automatic deploy to staging** with smoke tests, **promotion to production** with a safe strategy (rolling, blue-green, canary) and easy **rollback**. If anything fails, the pipeline stops.",
    b: [
      { t: "st", ti: "The stages", i: [
        ["Trigger on version control", "A push or pull request on a branch triggers the pipeline (Git is the source of truth)."],
        ["Reproducible build", "Install dependencies from the lockfile, compile and produce a **versioned artifact** (Docker image, package), once."],
        ["Automated tests", "Lint, static analysis, unit and integration tests; if it fails, the pipeline stops. Dependency and secret scanning."],
        ["Publish the artifact", "Store it in a registry (Docker registry, Artifactory, Nexus): the **same** artifact goes to every environment."],
        ["Deploy to staging", "Bring it up, run migrations, smoke tests and end-to-end tests."],
        ["Promotion to production", "With approval or automatic, using rolling, blue-green or canary."],
        ["Rollback and observability", "Return to the previous version with one command; metrics and alerts right after deploy."]
      ] },
      { t: "tb", ti: "Continuous integration, delivery and deployment", h: ["Term", "What it is"], r: [
        ["Continuous integration (CI)", "Integrate and validate code several times a day, with automatic build and tests"],
        ["Continuous delivery", "Every validated commit is ready for production; deploying is a decision (one click)"],
        ["Continuous deployment", "Every validated commit goes to production on its own"]
      ], n: "Common platforms: GitHub Actions, GitLab CI/CD, Azure Pipelines, CircleCI and Jenkins." }
    ],
    traps: [
      "Rebuilding the artifact for each environment: what was tested is not what ships.",
      "A pipeline too slow: nobody waits and people work around it.",
      "Secrets in the repository or in logs.",
      "Having no rollback plan."
    ],
    rc: [
      ["Why build the artifact only once?", "To guarantee that what was tested is exactly what goes to production."],
      ["What is the difference between continuous delivery and continuous deployment?", "In continuous delivery, deploying to production depends on a decision; in continuous deployment it is automatic after the tests."]
    ]
  }
});

/* R21 */
window.QS.push({
  n: 121, g: "M", m: "firstprinciples",
  pt: {
    s: "Cache distribuído",
    q: "Você pode descrever uma estratégia de cache distribuído para uma aplicação de alta disponibilidade?",
    why: "Um cache distribuído nasce de um cache num nó só que quebra a cada restrição (memória, falha, mudança do cluster). Construir do zero mostra por que existe o hash consistente.",
    one: "Distribua as chaves entre vários nós de cache (**sharding**) usando **hash consistente**, para que entrar ou sair um nó mova só uma fração das chaves. Acrescente **replicação** (tolerância a falhas), **invalidação** (TTL, eventos, versionamento) e proteções contra **stampede** e **hot keys**, com **fallback ao banco** se o cache cair.",
    b: [
      { t: "st", ti: "Construindo, uma restrição por vez", i: [
        ["0. O problema", "Um cache num nó só não cabe todos os dados e é ponto único de falha."],
        ["1. Vários nós", "Distribuir as chaves entre N nós (cluster Redis ou Memcached) soma memória e vazão."],
        ["2. Como distribuir", "`nó = hash(chave) mod N` funciona, mas mudar N remaneja quase todas as chaves (uma tempestade de misses)."],
        ["3. Hash consistente", "Chaves e nós ficam num anel e cada chave pertence ao próximo nó. Entrar ou sair um nó move só ~1/N das chaves. (O Redis Cluster usa 16.384 slots de hash.)"],
        ["4. Replicação", "Cada shard tem uma réplica; se o primário cair, ela assume (tolerância a falhas e alta disponibilidade)."],
        ["5. Invalidação e consistência", "TTL, invalidação por evento e versionamento de chaves; aceite que as cópias podem ficar velhas por instantes."],
        ["6. Proteções", "Evite stampede (single-flight, TTL com jitter), trate hot keys (réplicas, cache local) e tenha fallback ao banco se o cache cair."]
      ], },
      { t: "tp", k: "tip", h: "Veja também", x: "O funcionamento básico do cache e as estratégias de leitura e escrita estão na Q11; as políticas de remoção, na R44." }
    ],
    traps: [
      "`hash mod N` e depois adicionar um nó: despeja quase todo o cache.",
      "Cache sem replicação: a queda de um nó vira uma enxurrada no banco.",
      "Esquecer a invalidação.",
      "Hot key concentrada num único nó."
    ],
    rc: [
      ["Por que usar hash consistente?", "Porque adicionar ou remover um nó remaneja só uma fração das chaves, evitando invalidar o cache todo."],
      ["Para que serve a replicação no cache distribuído?", "Para tolerar a queda de um nó sem perder a camada de cache (e sem sobrecarregar o banco)."]
    ]
  },
  en: {
    s: "Distributed caching",
    q: "Can you describe a distributed caching strategy for a high-availability application?",
    why: "A distributed cache is born from a single-node cache that breaks at each constraint (memory, failure, cluster change). Building from scratch shows why consistent hashing exists.",
    one: "Spread the keys across several cache nodes (**sharding**) using **consistent hashing**, so a node joining or leaving moves only a fraction of keys. Add **replication** (fault tolerance), **invalidation** (TTL, events, versioning) and protection against **stampede** and **hot keys**, with a **fallback to the database** if the cache goes down.",
    b: [
      { t: "st", ti: "Building up, one constraint at a time", i: [
        ["0. The problem", "A single-node cache cannot hold all the data and is a single point of failure."],
        ["1. Several nodes", "Spreading keys across N nodes (Redis or Memcached cluster) adds memory and throughput."],
        ["2. How to distribute", "`node = hash(key) mod N` works, but changing N remaps almost every key (a storm of misses)."],
        ["3. Consistent hashing", "Keys and nodes sit on a ring and each key belongs to the next node. A node joining or leaving moves only ~1/N of the keys. (Redis Cluster uses 16,384 hash slots.)"],
        ["4. Replication", "Each shard has a replica; if the primary dies, the replica takes over (fault tolerance and high availability)."],
        ["5. Invalidation and consistency", "TTL, event-based invalidation and key versioning; accept that copies may be stale for moments."],
        ["6. Protections", "Avoid stampede (single-flight, TTL with jitter), handle hot keys (replicas, local cache) and fall back to the database if the cache is down."]
      ], },
      { t: "tp", k: "tip", h: "See also", x: "The basics of caching and the read/write strategies are in Q11; eviction policies are in R44." }
    ],
    traps: [
      "`hash mod N` and then adding a node: it dumps almost the whole cache.",
      "A cache without replication: losing a node becomes a flood on the database.",
      "Forgetting invalidation.",
      "A hot key concentrated on a single node."
    ],
    rc: [
      ["Why use consistent hashing?", "Because adding or removing a node remaps only a fraction of keys, avoiding invalidating the whole cache."],
      ["What is replication for in a distributed cache?", "To tolerate a node loss without losing the cache layer (and without overloading the database)."]
    ]
  }
});

/* R22 */
window.QS.push({
  n: 122, g: "M", alias: 5,
  pt: { s: "Tarefas em segundo plano", q: "Que métodos você pode usar para gerenciar tarefas em segundo plano nas suas aplicações?" },
  en: { s: "Managing background tasks", q: "What methods can you use for managing background tasks in your applications?" }
});

/* R23 */
window.QS.push({
  n: 123, g: "M", m: "compare",
  pt: {
    s: "Criptografia em trânsito e em repouso",
    q: "Como você trata criptografia e descriptografia de dados numa aplicação focada em privacidade?",
    why: "Os dados correm riscos diferentes em lugares diferentes. Uma matriz de “em trânsito, em repouso e em uso” mostra qual proteção serve para qual risco.",
    one: "Separe **dados em trânsito** (protegidos por **TLS/HTTPS**, mTLS entre serviços) de **dados em repouso** (disco, banco, backups, protegidos por **AES-256** ou equivalente). O ponto crítico é a **gestão das chaves**: em **KMS/HSM**, fora do código e dos dados, com rotação e auditoria, e usando **criptografia em envelope**. Use algoritmos e bibliotecas padrão e nunca invente criptografia.",
    b: [
      { t: "tb", h: ["", "Em trânsito", "Em repouso", "Em uso"], r: [
        ["Onde", "Entre cliente, serviços e banco", "Disco, banco, backups, storage", "Memória durante o processamento"],
        ["Como", "TLS 1.2/1.3 (HTTPS), mTLS entre serviços", "AES-256 (disco, coluna ou arquivo) e criptografia do storage na nuvem", "Computação confidencial (enclaves), tokenização"],
        ["Ameaça", "Interceptação e adulteração na rede", "Roubo de disco, backup ou dump", "Atacante com acesso ao host"],
        ["Chaves", "Certificados e rotação", "**KMS/HSM**, chaves separadas dos dados, rotação", "Geridas pelo hardware ou enclave"]
      ] },
      { t: "st", ti: "Boas práticas", i: [
        ["Não invente criptografia", "Use bibliotecas e algoritmos padronizados (AES-GCM, ChaCha20-Poly1305; RSA ou ECC para troca de chaves e assinaturas)."],
        ["Gerencie as chaves", "Fora do código e do banco, em KMS, Key Vault ou HSM, com controle de acesso, rotação e auditoria."],
        ["Criptografia em envelope", "Uma chave de dados cifra os dados; uma chave mestra no KMS cifra a chave de dados."],
        ["Hash não é criptografia", "Senhas se guardam com hash lento (Argon2id), e não criptografadas (veja a Q20)."],
        ["Minimize", "O dado que você não guarda não vaza: colete e retenha o mínimo."]
      ] }
    ],
    traps: [
      "Guardar a chave ao lado dos dados cifrados.",
      "Desligar o TLS entre serviços “internos”.",
      "Criptografar sem autenticação (usar modos autenticados como GCM) ou com ECB.",
      "Confundir criptografia (reversível) com hash (mão única)."
    ],
    rc: [
      ["O que é criptografia em envelope?", "Uma chave de dados cifra os dados e é, por sua vez, cifrada por uma chave mestra guardada no KMS."],
      ["Qual a diferença entre dados em trânsito e em repouso?", "Em trânsito: dados que se movem pela rede (protegidos por TLS). Em repouso: dados armazenados (protegidos por criptografia de disco, coluna ou arquivo)."]
    ]
  },
  en: {
    s: "Encryption in transit and at rest",
    q: "How do you handle data encryption and decryption in a privacy-focused application?",
    why: "Data faces different risks in different places. An “in transit, at rest and in use” matrix shows which protection serves which risk.",
    one: "Separate **data in transit** (protected by **TLS/HTTPS**, mTLS between services) from **data at rest** (disk, database, backups, protected by **AES-256** or equivalent). The critical point is **key management**: in a **KMS/HSM**, outside the code and the data, with rotation and auditing, using **envelope encryption**. Use standard algorithms and libraries and never invent cryptography.",
    b: [
      { t: "tb", h: ["", "In transit", "At rest", "In use"], r: [
        ["Where", "Between client, services and database", "Disk, database, backups, storage", "Memory during processing"],
        ["How", "TLS 1.2/1.3 (HTTPS), mTLS between services", "AES-256 (disk, column or file) and cloud storage encryption", "Confidential computing (enclaves), tokenization"],
        ["Threat", "Interception and tampering on the network", "Theft of a disk, backup or dump", "An attacker with access to the host"],
        ["Keys", "Certificates and rotation", "**KMS/HSM**, keys separate from data, rotation", "Managed by hardware or the enclave"]
      ] },
      { t: "st", ti: "Best practices", i: [
        ["Do not invent cryptography", "Use standardized libraries and algorithms (AES-GCM, ChaCha20-Poly1305; RSA or ECC for key exchange and signatures)."],
        ["Manage the keys", "Outside the code and the database, in a KMS, Key Vault or HSM, with access control, rotation and auditing."],
        ["Envelope encryption", "A data key encrypts the data; a master key in the KMS encrypts the data key."],
        ["A hash is not encryption", "Passwords are stored with a slow hash (Argon2id), not encrypted (see Q20)."],
        ["Minimize", "Data you do not keep cannot leak: collect and retain the minimum."]
      ] }
    ],
    traps: [
      "Storing the key next to the encrypted data.",
      "Turning TLS off between “internal” services.",
      "Encrypting without authentication (use authenticated modes such as GCM) or with ECB.",
      "Confusing encryption (reversible) with hashing (one-way)."
    ],
    rc: [
      ["What is envelope encryption?", "A data key encrypts the data and is itself encrypted by a master key kept in the KMS."],
      ["What is the difference between data in transit and at rest?", "In transit: data moving across the network (protected by TLS). At rest: stored data (protected by disk, column or file encryption)."]
    ]
  }
});

/* R24 */
window.QS.push({
  n: 124, g: "M", m: "trace",
  pt: {
    s: "Webhooks",
    q: "O que são webhooks e como você os implementou em projetos anteriores?",
    why: "Um webhook é uma conversa entre dois sistemas. Seguir um evento do provedor até o seu processamento (e a retentativa) mostra o que o receptor precisa garantir.",
    one: "Um **webhook** é um **callback HTTP definido pelo usuário**: quando um evento acontece, o provedor faz um `POST` na URL que você cadastrou, evitando que você precise consultar (polling). Para recebê-lo com segurança: **verifique a assinatura (HMAC)**, **responda `2xx` rápido** e processe depois (fila), seja **idempotente** (os eventos podem chegar repetidos) e não assuma ordem.",
    b: [
      { t: "fl", ti: "Ciclo de um webhook", n: ["O evento ocorre no provedor (ex.: pagamento aprovado)", "O provedor envia um `POST` para a sua URL, com JSON e assinatura", "Seu endpoint **verifica a assinatura** (HMAC)", "Grava o evento e responde `2xx` em segundos", "Processa de forma assíncrona (fila)", "Sem `2xx`, o provedor tenta de novo com backoff"] },
      { t: "st", ti: "Como implementar", i: [
        ["Defina eventos e payload", "Quais eventos disparam, o formato JSON, um `event_id` único e a versão do esquema."],
        ["Endpoint receptor", "`POST` em HTTPS que valida o corpo **bruto** contra a assinatura (HMAC-SHA256 com segredo compartilhado) e o timestamp (evita replay)."],
        ["Responda rápido, processe depois", "Confirme com `200` ou `202` e jogue numa fila; trabalho pesado dentro da requisição gera timeout e reenvios."],
        ["Idempotência", "O provedor reenvia (ao menos uma vez): guarde os `event_id` já processados e ignore os repetidos."],
        ["Do lado de quem envia", "Assine as mensagens, retente com backoff exponencial, registre o histórico de entregas e permita reenvio manual."]
      ] },
      { t: "tp", k: "key", h: "Webhook vs polling", x: "No **polling** o cliente pergunta de tempos em tempos (desperdício e atraso). No **webhook** o servidor avisa quando algo acontece (eficiente), mas o receptor precisa estar no ar, ter URL pública e se proteger." }
    ],
    traps: [
      "Aceitar qualquer `POST` sem verificar a assinatura.",
      "Processar tudo dentro da requisição e estourar o timeout.",
      "Não tratar duplicatas e reentregas.",
      "Assumir a ordem de chegada dos eventos."
    ],
    rc: [
      ["Como confirmar que um webhook veio mesmo do provedor?", "Verificando a assinatura HMAC do corpo bruto com o segredo compartilhado (e conferindo o timestamp)."],
      ["Por que responder rápido ao webhook?", "Para não estourar o timeout do provedor, que reenviaria o evento; processe depois, em fila."]
    ]
  },
  en: {
    s: "Webhooks",
    q: "What are webhooks and how have you implemented them in past projects?",
    why: "A webhook is a conversation between two systems. Following an event from the provider to its processing (and the retry) shows what the receiver must guarantee.",
    one: "A **webhook** is a **user-defined HTTP callback**: when an event happens, the provider makes a `POST` to the URL you registered, so you do not have to poll. To receive it safely: **verify the signature (HMAC)**, **reply `2xx` fast** and process later (queue), be **idempotent** (events may arrive repeated) and do not assume order.",
    b: [
      { t: "fl", ti: "Life cycle of a webhook", n: ["The event occurs at the provider (e.g. payment approved)", "The provider sends a `POST` to your URL, with JSON and a signature", "Your endpoint **verifies the signature** (HMAC)", "Stores the event and replies `2xx` within seconds", "Processes asynchronously (queue)", "With no `2xx`, the provider retries with backoff"] },
      { t: "st", ti: "How to implement", i: [
        ["Define events and payload", "Which events fire, the JSON format, a unique `event_id` and the schema version."],
        ["Receiving endpoint", "An HTTPS `POST` that validates the **raw** body against the signature (HMAC-SHA256 with a shared secret) and the timestamp (prevents replay)."],
        ["Reply fast, process later", "Acknowledge with `200` or `202` and push to a queue; heavy work inside the request causes timeouts and resends."],
        ["Idempotency", "The provider resends (at least once): store processed `event_id`s and ignore repeats."],
        ["On the sender’s side", "Sign messages, retry with exponential backoff, keep a delivery history and allow manual resend."]
      ] },
      { t: "tp", k: "key", h: "Webhook vs polling", x: "With **polling** the client asks every so often (waste and delay). With a **webhook** the server notifies when something happens (efficient), but the receiver must be up, have a public URL and protect itself." }
    ],
    traps: [
      "Accepting any `POST` without verifying the signature.",
      "Processing everything inside the request and hitting the timeout.",
      "Not handling duplicates and redeliveries.",
      "Assuming events arrive in order."
    ],
    rc: [
      ["How do you confirm a webhook really came from the provider?", "By verifying the HMAC signature of the raw body with the shared secret (and checking the timestamp)."],
      ["Why reply quickly to a webhook?", "So you do not hit the provider’s timeout, which would resend the event; process afterwards, in a queue."]
    ]
  }
});

/* R25 */
window.QS.push({
  n: 125, g: "M", m: "playbook",
  pt: {
    s: "GDPR no backend",
    q: "Que considerações devem ser feitas para a conformidade com o GDPR em um sistema backend?",
    why: "Conformidade é uma lista de obrigações que se traduzem em capacidades técnicas. O playbook liga cada obrigação ao que o backend precisa ter.",
    one: "Colete **só o necessário** com **base legal e finalidade declarada**, **proteja os dados** (em trânsito e em repouso, acesso mínimo, auditoria), implemente os **direitos do titular** (acessar, corrigir, apagar, exportar), defina **retenção**, tenha um **plano para incidentes** (notificar a autoridade em até 72 horas, salvo risco improvável), controle **terceiros e transferências** e adote **privacidade desde o desenho**. No Brasil, a LGPD segue lógica parecida.",
    b: [
      { t: "st", ti: "Playbook técnico", i: [
        ["Base legal e finalidade", "Só colete dados com fundamento (consentimento, contrato, obrigação legal) e para uma finalidade declarada."],
        ["Minimização", "Colete apenas o necessário; evite campos “para o caso de precisar”."],
        ["Segurança", "Criptografia em trânsito e em repouso, controle de acesso mínimo, logs de acesso, pseudonimização quando possível e auditorias regulares."],
        ["Direitos do titular", "Fluxos e endpoints para **acessar**, **corrigir**, **apagar** (esquecimento), **exportar** (portabilidade) e revogar o consentimento."],
        ["Retenção", "Prazo por tipo de dado, com exclusão ou anonimização automática ao vencer; atenção a backups e logs."],
        ["Incidentes", "Plano de resposta: notificar a autoridade em até **72 horas** após tomar ciência da violação (salvo se improvável que cause risco) e os titulares quando o risco for alto."],
        ["Terceiros e transferências", "Contratos com operadores (DPA) e mapa de para onde os dados vão; cuidado com a transferência internacional."],
        ["Privacidade desde o desenho", "Privacy by design e by default, registro das atividades de tratamento e DPIA para tratamento de alto risco."]
      ] },
      { t: "tp", k: "warn", h: "Não é parecer jurídico", x: "Este é o roteiro técnico para o backend. As decisões legais pertencem ao jurídico e ao DPO/encarregado." }
    ],
    traps: [
      "Guardar para sempre “porque pode ser útil”.",
      "Apagar do banco principal e esquecer backups, logs, caches e réplicas.",
      "Registrar dados pessoais em texto nos logs.",
      "Não saber onde cada dado pessoal está (sem inventário)."
    ],
    rc: [
      ["Que direitos do titular o backend precisa suportar?", "Acesso, correção, exclusão (esquecimento), portabilidade e revogação do consentimento."],
      ["Qual o prazo para notificar a autoridade numa violação?", "Em até 72 horas depois de tomar conhecimento, a menos que seja improvável que haja risco para os titulares."]
    ]
  },
  en: {
    s: "GDPR in the backend",
    q: "What considerations must be taken into account for GDPR compliance in a backend system?",
    why: "Compliance is a list of obligations that translate into technical capabilities. The playbook ties each obligation to what the backend must have.",
    one: "Collect **only what is necessary** with a **legal basis and a stated purpose**, **protect the data** (in transit and at rest, minimal access, auditing), implement **data-subject rights** (access, correct, erase, export), define **retention**, have an **incident plan** (notify the authority within 72 hours, unless risk is unlikely), control **third parties and transfers** and adopt **privacy by design**. In Brazil, the LGPD follows a similar logic.",
    b: [
      { t: "st", ti: "Technical playbook", i: [
        ["Legal basis and purpose", "Only collect data with a basis (consent, contract, legal obligation) and for a stated purpose."],
        ["Minimization", "Collect only what is necessary; avoid fields “just in case”."],
        ["Security", "Encryption in transit and at rest, minimal access control, access logs, pseudonymization when possible and regular audits."],
        ["Data-subject rights", "Flows and endpoints to **access**, **correct**, **erase** (right to be forgotten), **export** (portability) and withdraw consent."],
        ["Retention", "A period per data type, with automatic deletion or anonymization at expiry; mind backups and logs."],
        ["Incidents", "A response plan: notify the authority within **72 hours** of becoming aware of the breach (unless risk is unlikely) and the subjects when risk is high."],
        ["Third parties and transfers", "Contracts with processors (DPA) and a map of where data goes; take care with international transfers."],
        ["Privacy by design", "Privacy by design and by default, a record of processing activities and a DPIA for high-risk processing."]
      ] },
      { t: "tp", k: "warn", h: "Not legal advice", x: "This is the technical roadmap for the backend. Legal decisions belong to the legal team and the DPO." }
    ],
    traps: [
      "Keeping data forever “because it may be useful”.",
      "Deleting from the main database and forgetting backups, logs, caches and replicas.",
      "Logging personal data in plain text.",
      "Not knowing where each piece of personal data lives (no inventory)."
    ],
    rc: [
      ["Which data-subject rights must the backend support?", "Access, correction, erasure (right to be forgotten), portability and withdrawal of consent."],
      ["What is the deadline to notify the authority of a breach?", "Within 72 hours of becoming aware, unless the breach is unlikely to result in risk to the subjects."]
    ]
  }
});

/* R26 */
window.QS.push({
  n: 126, g: "M", m: "trace",
  pt: {
    s: "Processos longos em requisições web",
    q: "Explique como você lidaria com processos de longa duração em requisições web.",
    why: "Um processo longo atravessa várias etapas fora da requisição. Seguir o pedido do cliente até o resultado mostra por que não se segura o HTTP aberto.",
    one: "Não mantenha a requisição aberta. Use o padrão **request-reply assíncrono**: a API valida, grava e **enfileira o trabalho**, responde logo **`202 Accepted`** com um **ID e uma URL de status**, um **worker** executa e o cliente descobre o resultado por **polling, webhook, WebSocket ou SSE**. Isso evita timeouts de proxy e navegador e libera a capacidade do servidor.",
    b: [
      { t: "fl", ti: "Request-reply assíncrono", n: ["Cliente envia o pedido", "API valida, grava e enfileira o trabalho", "API responde `202 Accepted` + `jobId` + URL de status", "Worker executa (segundos a horas)", "Cliente consulta `GET /jobs/{id}`, ou recebe webhook, WebSocket ou SSE", "Resultado pronto: `200` com os dados ou um link para baixar"] },
      { t: "tb", ti: "Como o cliente descobre que terminou", h: ["Mecanismo", "Quando"], r: [
        ["Polling com intervalo (e `Retry-After`)", "Simples e universal; custo de requisições repetidas"],
        ["Webhook", "O cliente é um servidor com endpoint público"],
        ["WebSocket ou SSE", "Navegador ou app que quer atualização em tempo real"],
        ["E-mail ou notificação", "Processo muito longo; o usuário não precisa esperar na tela"]
      ] },
      { t: "tp", k: "warn", h: "Por que não deixar a requisição aberta", x: "Timeouts de navegador, proxy e balanceador (30 a 60 s é comum) cortam a conexão e o cliente fica sem saber se o trabalho foi feito. Prender uma thread ou conexão por minutos também derruba a capacidade do servidor. Veja as Q02 e Q05." }
    ],
    traps: [
      "Manter o HTTP aberto esperando o resultado.",
      "Não dar ID do trabalho nem endpoint de status.",
      "Não permitir cancelamento nem expirar o resultado.",
      "Job não idempotente quando o cliente reenvia o pedido."
    ],
    rc: [
      ["Que status HTTP indica que o pedido foi aceito para processamento posterior?", "`202 Accepted`, normalmente com um ID e um link de status."],
      ["Como o cliente fica sabendo do resultado?", "Por polling no endpoint de status, ou por webhook, WebSocket ou SSE."]
    ]
  },
  en: {
    s: "Long-running processes in web requests",
    q: "Explain how you would deal with long-running processes in web requests.",
    why: "A long process crosses several stages outside the request. Following the client’s request to the result shows why you do not hold HTTP open.",
    one: "Do not keep the request open. Use the **asynchronous request-reply** pattern: the API validates, stores and **enqueues the work**, immediately replies **`202 Accepted`** with an **ID and a status URL**, a **worker** runs it and the client learns the result by **polling, webhook, WebSocket or SSE**. This avoids proxy and browser timeouts and frees server capacity.",
    b: [
      { t: "fl", ti: "Asynchronous request-reply", n: ["Client sends the request", "API validates, stores and enqueues the work", "API replies `202 Accepted` + `jobId` + status URL", "Worker runs (seconds to hours)", "Client polls `GET /jobs/{id}`, or receives a webhook, WebSocket or SSE", "Result ready: `200` with the data or a download link"] },
      { t: "tb", ti: "How the client learns it finished", h: ["Mechanism", "When"], r: [
        ["Polling with an interval (and `Retry-After`)", "Simple and universal; the cost of repeated requests"],
        ["Webhook", "The client is a server with a public endpoint"],
        ["WebSocket or SSE", "A browser or app that wants real-time updates"],
        ["Email or notification", "A very long process; the user need not wait on screen"]
      ] },
      { t: "tp", k: "warn", h: "Why not leave the request open", x: "Browser, proxy and load-balancer timeouts (30 to 60 s is common) cut the connection and the client never learns whether the work was done. Holding a thread or connection for minutes also drains server capacity. See Q02 and Q05." }
    ],
    traps: [
      "Keeping HTTP open waiting for the result.",
      "Giving no job ID or status endpoint.",
      "Not allowing cancellation or expiring the result.",
      "A non-idempotent job when the client resends the request."
    ],
    rc: [
      ["Which HTTP status says the request was accepted for later processing?", "`202 Accepted`, usually with an ID and a status link."],
      ["How does the client learn the result?", "By polling the status endpoint, or by webhook, WebSocket or SSE."]
    ]
  }
});

/* R27 */
window.QS.push({
  n: 127, g: "M", alias: 14,
  pt: { s: "Rate limiting para proteger APIs", q: "Discuta a implementação de rate limiting para proteger APIs contra abuso." },
  en: { s: "Rate limiting to protect APIs", q: "Discuss the implementation of rate limiting to protect APIs from abuse." }
});

/* R28 */
window.QS.push({
  n: 128, g: "M", alias: 28,
  pt: { s: "Instrumentar e monitorar desempenho", q: "Como você instrumenta e monitora o desempenho de aplicações backend?" },
  en: { s: "Instrumenting and monitoring performance", q: "How do you instrument and monitor the performance of backend applications?" }
});

/* R29 */
window.QS.push({
  n: 129, g: "M", m: "playbook",
  pt: {
    s: "Decompor um monólito",
    q: "O que são microsserviços e como você decomporia um monólito em microsserviços?",
    why: "Decompor um monólito é um procedimento incremental, não um desenho do zero. O playbook segue a ordem em que se extrai um serviço com segurança.",
    one: "Microsserviços são **serviços pequenos e autônomos, organizados em torno de capacidades de negócio**, cada um com seu deploy e seus dados. Para decompor um monólito, faça-o de forma **incremental** (padrão **strangler fig**): identifique fronteiras de domínio, modularize por dentro, extraia um serviço de cada vez atrás de uma fachada, separe os dados e só então desligue o código antigo. Nunca reescreva tudo de uma vez.",
    b: [
      { t: "st", ti: "Decompondo, passo a passo", i: [
        ["Entenda o monólito", "Mapeie módulos, dependências e dados. Prefira fronteiras de **domínio** (contextos delimitados do DDD) a camadas técnicas."],
        ["Modularize por dentro primeiro", "Transforme-o num **monólito modular**: fronteiras claras, sem acesso direto às tabelas de outro módulo."],
        ["Escolha o primeiro candidato", "Uma parte com fronteira clara, pouca dependência e valor (escala diferente, mudanças frequentes). Evite começar pelo núcleo mais entrelaçado."],
        ["Coloque uma fachada na frente", "Um API gateway ou proxy: o tráfego passa por ele e você redireciona rota a rota para o novo serviço (**strangler fig**)."],
        ["Separe os dados", "Cada serviço é dono dos seus dados; elimine joins entre eles e use APIs ou eventos. A migração de dados usa sincronização temporária."],
        ["Extraia, migre o tráfego e remova", "Mova a lógica, direcione o tráfego aos poucos (canary), compare resultados e remova o código antigo do monólito."],
        ["Resolva o que a rede traz", "Timeouts, retentativas, circuit breaker, observabilidade distribuída, contratos versionados e pipelines independentes."]
      ] },
      { t: "tp", k: "key", h: "Comparação", x: "Para a matriz monólito vs microsserviços e a regra de quando migrar, veja a Q01." }
    ],
    traps: [
      "Dividir por camada técnica em vez de por domínio.",
      "Reescrever tudo do zero (big bang).",
      "Serviços compartilhando o mesmo banco.",
      "Extrair sem observabilidade nem automação de deploy."
    ],
    rc: [
      ["O que é o padrão strangler fig?", "Colocar uma fachada na frente do monólito e substituir funcionalidades por novos serviços aos poucos, rota a rota, até o monólito não ser mais necessário."],
      ["Por que começar com um monólito modular?", "Porque fronteiras claras dentro do monólito tornam a extração posterior barata e segura."]
    ]
  },
  en: {
    s: "Decomposing a monolith",
    q: "What are microservices and how would you decompose a monolith into microservices?",
    why: "Decomposing a monolith is an incremental procedure, not a design from scratch. The playbook follows the order in which a service is safely extracted.",
    one: "Microservices are **small, autonomous services organized around business capabilities**, each with its own deploy and data. To decompose a monolith, do it **incrementally** (the **strangler fig** pattern): identify domain boundaries, modularize inside, extract one service at a time behind a facade, separate the data and only then switch off the old code. Never rewrite everything at once.",
    b: [
      { t: "st", ti: "Decomposing, step by step", i: [
        ["Understand the monolith", "Map modules, dependencies and data. Prefer **domain** boundaries (DDD bounded contexts) over technical layers."],
        ["Modularize inside first", "Turn it into a **modular monolith**: clear boundaries, no direct access to another module’s tables."],
        ["Pick the first candidate", "A part with a clear boundary, few dependencies and value (different scaling, frequent changes). Avoid starting with the most entangled core."],
        ["Put a facade in front", "An API gateway or proxy: traffic goes through it and you redirect route by route to the new service (**strangler fig**)."],
        ["Separate the data", "Each service owns its data; remove joins between them and use APIs or events. Data migration uses temporary synchronization."],
        ["Extract, move traffic and remove", "Move the logic, shift traffic gradually (canary), compare results and remove the old code from the monolith."],
        ["Solve what the network brings", "Timeouts, retries, circuit breaker, distributed observability, versioned contracts and independent pipelines."]
      ] },
      { t: "tp", k: "key", h: "Comparison", x: "For the monolith vs microservices matrix and the rule on when to migrate, see Q01." }
    ],
    traps: [
      "Splitting by technical layer instead of by domain.",
      "Rewriting everything from scratch (big bang).",
      "Services sharing the same database.",
      "Extracting without observability or deploy automation."
    ],
    rc: [
      ["What is the strangler fig pattern?", "Putting a facade in front of the monolith and replacing features with new services bit by bit, route by route, until the monolith is no longer needed."],
      ["Why start with a modular monolith?", "Because clear boundaries inside the monolith make later extraction cheap and safe."]
    ]
  }
});

/* R30 */
window.QS.push({
  n: 130, g: "M", m: "whys",
  pt: {
    s: "Dependências de API",
    q: "Como você gerenciou dependências de API em sistemas backend?",
    why: "Uma dependência de API é um risco por causa de uma cadeia de motivos. Perguntar “por quê?” leva às quatro defesas (versionar, testar contrato, isolar, proteger).",
    one: "Trate toda API externa como **mutável e não confiável**: **fixe a versão** que você usa, **teste o contrato** no CI, **isole a dependência atrás de uma camada própria** (anticorruption layer) e **proteja-se das falhas** com timeouts, retentativas, circuit breaker e fallback. Monitore a latência, os erros e os avisos de depreciação de cada dependência.",
    b: [
      { t: "why", rows: [
        ["Por que uma dependência de API é um risco?", "Porque ela muda e falha por decisão de outra equipe ou empresa: um campo renomeado ou uma queda deixa o seu sistema quebrado sem você ter mexido em nada."],
        ["Por que isso quebra em silêncio?", "Porque o acoplamento está no **contrato** (formato, campos, semântica), que raramente é testado de forma contínua."],
        ["Por que versionar e fixar versões ajuda?", "Porque você escolhe quando migrar: usar uma versão explícita (`/v1`, SDK com versão fixa) impede que o provedor altere por baixo o que você usa."],
        ["Por que testar o contrato?", "Porque **testes de contrato** (Pact, validação contra OpenAPI) pegam a quebra no CI, antes de ela chegar à produção."],
        ["Por que isolar a dependência no código?", "Porque uma **camada de adaptação** concentra o conhecimento da API externa num lugar: quando ela muda, você ajusta um módulo só."]
      ], root: "Trate toda API externa como **mutável e não confiável**: versione, teste o contrato, isole atrás de uma camada própria e proteja-se das falhas." },
      { t: "st", ti: "Proteja-se das falhas", i: [
        ["Timeouts e retentativas", "Nunca espere indefinidamente; use retry com backoff só em operações idempotentes."],
        ["Circuit breaker e fallback", "Abre o circuito ao detectar falhas e responde com cache ou degradação."],
        ["Monitore", "Latência, erros e mudanças de contrato por dependência; alerta de depreciação (`Sunset`)."],
        ["Mantenha um inventário", "Lista das APIs usadas, versões, donos e planos de migração."]
      ] }
    ],
    traps: [
      "Usar a versão “latest” ou nenhuma versão explícita.",
      "Chamar a API externa espalhada por todo o código.",
      "Sem timeout: a lentidão alheia derruba o seu serviço.",
      "Ignorar os avisos de depreciação."
    ],
    rc: [
      ["O que é um teste de contrato?", "Um teste que verifica se consumidor e provedor de uma API concordam sobre o formato das mensagens, sem subir o sistema inteiro."],
      ["Por que isolar uma API externa numa camada de adaptação?", "Para que mudanças nela afetem um módulo só e o resto do sistema use um modelo estável seu."]
    ]
  },
  en: {
    s: "Managing API dependencies",
    q: "How have you managed API dependencies in backend systems?",
    why: "An API dependency is a risk because of a chain of reasons. Asking “why?” leads to the four defenses (version, test the contract, isolate, protect).",
    one: "Treat every external API as **mutable and untrusted**: **pin the version** you use, **test the contract** in CI, **isolate the dependency behind your own layer** (anticorruption layer) and **protect yourself from failures** with timeouts, retries, a circuit breaker and a fallback. Monitor each dependency’s latency, errors and deprecation notices.",
    b: [
      { t: "why", rows: [
        ["Why is an API dependency a risk?", "Because it changes and fails by the decision of another team or company: a renamed field or an outage breaks your system without you touching anything."],
        ["Why does it break silently?", "Because the coupling is in the **contract** (format, fields, semantics), which is rarely tested continuously."],
        ["Why does versioning and pinning help?", "Because you choose when to migrate: using an explicit version (`/v1`, a pinned SDK) stops the provider from changing what you use underneath."],
        ["Why test the contract?", "Because **contract tests** (Pact, validation against OpenAPI) catch the break in CI, before it reaches production."],
        ["Why isolate the dependency in code?", "Because an **adapter layer** concentrates knowledge of the external API in one place: when it changes, you adjust a single module."]
      ], root: "Treat every external API as **mutable and untrusted**: version, test the contract, isolate behind your own layer and protect against failures." },
      { t: "st", ti: "Protect yourself from failures", i: [
        ["Timeouts and retries", "Never wait indefinitely; use retry with backoff only on idempotent operations."],
        ["Circuit breaker and fallback", "Open the circuit on detected failures and answer with cache or degradation."],
        ["Monitor", "Latency, errors and contract changes per dependency; a deprecation alert (`Sunset`)."],
        ["Keep an inventory", "A list of APIs used, versions, owners and migration plans."]
      ] }
    ],
    traps: [
      "Using “latest” or no explicit version.",
      "Calling the external API scattered across the whole code.",
      "No timeout: someone else’s slowness takes your service down.",
      "Ignoring deprecation notices."
    ],
    rc: [
      ["What is a contract test?", "A test that checks whether an API’s consumer and provider agree on the message format, without starting the whole system."],
      ["Why isolate an external API behind an adapter layer?", "So changes to it affect a single module and the rest of the system uses a stable model of your own."]
    ]
  }
});

/* R31 */
window.QS.push({
  n: 131, g: "M", alias: 25,
  pt: { s: "Consistência eventual e suas implicações", q: "Descreva o conceito de consistência eventual e suas implicações em sistemas backend." },
  en: { s: "Eventual consistency and its implications", q: "Describe the concept of eventual consistency and its implications in backend systems." }
});

/* R32 */
window.QS.push({
  n: 132, g: "M", m: "feynman",
  pt: {
    s: "Reverse proxy",
    q: "O que é um reverse proxy e como ele é útil no desenvolvimento de backend?",
    why: "O reverse proxy se entende pela analogia da recepção de um hotel. Ela mostra as funções, e o ponto onde quebra (ponto único de falha) mostra o cuidado necessário.",
    one: "Um **reverse proxy** fica na frente dos servidores de aplicação: o cliente fala só com ele, e ele **encaminha** para o servidor certo (por host, caminho ou cabeçalho). Serve para **balancear carga**, **terminar TLS**, **cachear**, **rotear** vários serviços sob um domínio, **proteger** (esconde a topologia, rate limit, WAF, DDoS) e **trocar serviços** sem mudar a URL pública. É diferente de um *forward proxy*, que fica na frente dos clientes.",
    b: [
      { t: "an",
        s: "A recepção de um hotel: você nunca vai direto ao quarto de ninguém. Fala com a recepção, que confere quem você é, direciona ao quarto certo e protege os hóspedes.",
        k: "Exemplos: NGINX, HAProxy, Envoy, Traefik, Cloudflare. As regras de roteamento olham o host (`api.x.com`), o caminho (`/admin` vs `/loja`) ou cabeçalhos. Funções comuns: balanceamento de carga, terminação de TLS, compressão e cache, autenticação na borda, proteção contra ataques e deploys sem mudar a URL pública.",
        b: "A recepção é um ponto só: se cair, ninguém entra. O reverse proxy também é um **ponto único de falha** (precisa de redundância) e acrescenta um salto de latência." },
      { t: "tb", ti: "Forward vs reverse proxy", h: ["", "Forward", "Reverse"], r: [
        ["Fica na frente de", "Clientes", "Servidores"],
        ["Quem o configura", "O cliente ou a organização", "O dono do serviço"],
        ["Exemplo", "Proxy corporativo, VPN", "NGINX, Cloudflare, API gateway"],
        ["Esconde", "A identidade do cliente", "A topologia do servidor"]
      ] }
    ],
    traps: [
      "Um proxy único sem redundância.",
      "Esquecer de repassar o IP real do cliente (`X-Forwarded-For`).",
      "Confiar em `X-Forwarded-*` vindo de fora do proxy.",
      "Cachear no proxy uma resposta específica de usuário."
    ],
    rc: [
      ["Qual a diferença entre proxy e reverse proxy?", "O proxy (forward) representa os clientes diante da internet; o reverse proxy representa os servidores diante dos clientes."],
      ["Cite três usos de um reverse proxy.", "Balanceamento de carga, terminação de TLS, cache, roteamento e proteção contra ataques."]
    ]
  },
  en: {
    s: "Reverse proxy",
    q: "What is a reverse proxy and how is it useful in backend development?",
    why: "A reverse proxy is understood through the hotel front-desk analogy. It shows the functions, and the point where it breaks (a single point of failure) shows the care needed.",
    one: "A **reverse proxy** sits in front of the application servers: the client talks only to it, and it **forwards** to the right server (by host, path or header). It serves to **load balance**, **terminate TLS**, **cache**, **route** several services under one domain, **protect** (hides the topology, rate limiting, WAF, DDoS) and **swap services** without changing the public URL. It differs from a *forward proxy*, which sits in front of clients.",
    b: [
      { t: "an",
        s: "A hotel front desk: you never go straight to anyone’s room. You talk to the desk, which checks who you are, sends you to the right room and protects the guests.",
        k: "Examples: NGINX, HAProxy, Envoy, Traefik, Cloudflare. Routing rules look at the host (`api.x.com`), the path (`/admin` vs `/shop`) or headers. Common functions: load balancing, TLS termination, compression and caching, authentication at the edge, attack protection and deploys without changing the public URL.",
        b: "The desk is a single point: if it falls, nobody gets in. The reverse proxy is also a **single point of failure** (it needs redundancy) and adds a latency hop." },
      { t: "tb", ti: "Forward vs reverse proxy", h: ["", "Forward", "Reverse"], r: [
        ["Sits in front of", "Clients", "Servers"],
        ["Who configures it", "The client or the organization", "The service owner"],
        ["Example", "Corporate proxy, VPN", "NGINX, Cloudflare, API gateway"],
        ["Hides", "The client’s identity", "The server topology"]
      ] }
    ],
    traps: [
      "A single proxy with no redundancy.",
      "Forgetting to pass on the client’s real IP (`X-Forwarded-For`).",
      "Trusting `X-Forwarded-*` coming from outside the proxy.",
      "Caching a user-specific response in the proxy."
    ],
    rc: [
      ["What is the difference between a proxy and a reverse proxy?", "The (forward) proxy represents clients to the internet; the reverse proxy represents servers to clients."],
      ["Name three uses of a reverse proxy.", "Load balancing, TLS termination, caching, routing and attack protection."]
    ]
  }
});

/* R33 */
window.QS.push({
  n: 133, g: "M", m: "compare",
  pt: {
    s: "Estado de sessão com balanceador",
    q: "Como você trataria o estado de sessão em um ambiente de aplicação com balanceamento de carga?",
    why: "Há três estratégias com trade-offs diferentes. Uma matriz lado a lado e uma regra de decisão respondem melhor do que descrevê-las em prosa.",
    one: "O problema: se a sessão está na memória de um servidor, a próxima requisição pode cair em outro, que não a tem. Há três saídas: **sticky sessions** (o balanceador manda sempre o mesmo cliente ao mesmo servidor), **armazenamento centralizado** (Redis ou banco compartilhado) e **estado no cliente** (token assinado). O padrão recomendado é a **sessão centralizada** (ou tokens de vida curta), para a aplicação ser **stateless**.",
    b: [
      { t: "tb", h: ["Estratégia", "Como funciona", "Prós", "Contras"], r: [
        ["Sticky sessions (afinidade)", "O balanceador envia o mesmo cliente sempre ao mesmo servidor (cookie ou hash de IP)", "Simples; sessão na memória local", "Carga desigual; perde a sessão se o servidor cai ou é substituído; atrapalha o autoscaling"],
        ["Armazenamento centralizado", "Sessão em Redis ou banco compartilhado por todos os servidores", "Qualquer servidor atende; sobrevive a reinícios; revogável", "Dependência extra e latência; precisa ser altamente disponível"],
        ["Estado no cliente (token assinado)", "JWT ou cookie assinado com os dados da sessão", "Nenhum armazenamento; escala fácil", "Difícil revogar; limite de tamanho; dado exposto se não for cifrado"]
      ] },
      { t: "tp", k: "key", h: "Regra de decisão", x: "Na maioria dos sistemas: **sessão centralizada no Redis** (ou tokens de vida curta). Sticky sessions só como solução temporária. O objetivo é uma aplicação **stateless**, que escala e se recupera sem prender usuários. Veja também a R10 e a Q16." }
    ],
    traps: [
      "Sessão em memória com várias instâncias e sem afinidade: usuários “deslogam” aleatoriamente.",
      "Sticky session como solução definitiva.",
      "Redis de sessão sem replicação: a queda dele derruba todos os logins."
    ],
    rc: [
      ["Por que sessão em memória local quebra com um balanceador?", "Porque a próxima requisição pode cair em outro servidor, que não tem a sessão."],
      ["Qual a vantagem do armazenamento de sessão centralizado?", "Qualquer servidor atende qualquer requisição e as instâncias podem ser substituídas sem perder sessões."]
    ]
  },
  en: {
    s: "Session state behind a load balancer",
    q: "How would you handle session state in a load-balanced application environment?",
    why: "There are three strategies with different trade-offs. A side-by-side matrix and a decision rule answer better than describing them in prose.",
    one: "The problem: if the session lives in one server’s memory, the next request may land on another that does not have it. Three ways out: **sticky sessions** (the balancer always sends the same client to the same server), **centralized storage** (Redis or a shared database) and **client-side state** (a signed token). The recommended default is **centralized session** (or short-lived tokens), so the application stays **stateless**.",
    b: [
      { t: "tb", h: ["Strategy", "How it works", "Pros", "Cons"], r: [
        ["Sticky sessions (affinity)", "The balancer always sends the same client to the same server (cookie or IP hash)", "Simple; session in local memory", "Uneven load; session lost if the server dies or is replaced; hurts autoscaling"],
        ["Centralized storage", "Session in Redis or a database shared by all servers", "Any server serves; survives restarts; revocable", "Extra dependency and latency; must be highly available"],
        ["Client-side state (signed token)", "A JWT or signed cookie carrying the session data", "No storage; scales easily", "Hard to revoke; size limit; data exposed if not encrypted"]
      ] },
      { t: "tp", k: "key", h: "Decision rule", x: "In most systems: **centralized session in Redis** (or short-lived tokens). Sticky sessions only as a temporary fix. The goal is a **stateless** application, which scales and recovers without pinning users. See also R10 and Q16." }
    ],
    traps: [
      "In-memory session with several instances and no affinity: users get “logged out” at random.",
      "Sticky sessions as the permanent solution.",
      "Session Redis without replication: its failure logs everyone out."
    ],
    rc: [
      ["Why does local in-memory session break with a load balancer?", "Because the next request may land on another server that does not have the session."],
      ["What is the advantage of centralized session storage?", "Any server serves any request and instances can be replaced without losing sessions."]
    ]
  }
});
