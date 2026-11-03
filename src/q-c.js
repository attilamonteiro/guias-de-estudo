/* Perguntas 21-30. Mesmo esquema de q-a.js. */
window.QS = window.QS || [];

/* ============ 21 · Encurtador de URLs ============ */
window.QS.push({
  n: 21, g: "E", m: "design",
  pt: {
    s: "Encurtador de URLs",
    q: "Como você projetaria um serviço de encurtamento de URLs como o Bitly?",
    why: "Projetar um produto inteiro pede um roteiro fixo para não esquecer nada nem se perder em detalhes: requisitos, números, API, dados, arquitetura e gargalos, nessa ordem.",
    one: "Siga o roteiro. É um sistema com **leitura muito maior que escrita** (~100:1): `POST /urls` gera um código curto em **base62 de 7 caracteres** (62⁷ ≈ 3,5 trilhões de combinações) e grava `código → URL longa` num armazenamento chave-valor; `GET /{código}` responde `302` lendo antes de um **cache** (Redis). O coração é **gerar o código sem colisão**; o resto é cache, CDN, expiração e combate a abuso.",
    b: [
      { t: "st", ti: "O roteiro aplicado", i: [
        ["1. Requisitos", "Funcionais: encurtar uma URL, redirecionar, alias personalizado opcional, expiração opcional, estatísticas de cliques. Não funcionais: redirecionamento em poucos milissegundos, alta disponibilidade, ~100 leituras para cada escrita, links não adivinháveis em sequência."],
        ["2. Estimativas", "100 milhões de novas URLs por mês ≈ 40 escritas/s. Leitura 100× maior ≈ 4.000/s em média, ~40.000/s em pico. Em 5 anos: 6 bilhões de registros × ~500 B ≈ 3 TB. Cabe num armazenamento distribuído simples."],
        ["3. API", "`POST /urls {longUrl, alias?, ttl?}` → `201 {shortUrl}`. `GET /{code}` → `302` com `Location`. Alias já usado: `409`."],
        ["4. Geração do código", "É a decisão central; veja a tabela abaixo."],
        ["5. Dados", "`code` (chave primária), `long_url`, `user_id`, `created_at`, `expires_at`. O acesso é sempre por chave: KV (DynamoDB, Cassandra) ou SQL particionado por `code`."],
        ["6. Arquitetura", "Cliente → CDN/balanceador → servidores de aplicação stateless → **cache** (Redis, LRU) → armazenamento. Cerca de 20% dos links respondem por ~80% do tráfego, então o cache absorve quase tudo."],
        ["7. Gargalos e extras", "Link viral (hot key), abuso e malware (blocklist, rate limit), limpeza de expirados, estatísticas por fila (fora do caminho do redirect), multirregião."]
      ] },
      { t: "tb", ti: "Como gerar o código (decisão central)", h: ["Opção", "Como", "Prós e contras"], r: [
        ["Hash da URL, truncado", "Hash (MD5/SHA) convertido em base62, 7 primeiros caracteres", "Sem coordenação; **colisões** exigem verificar e tentar de novo; a mesma URL vira o mesmo código"],
        ["Contador global + base62", "ID sequencial convertido em base62", "Único por construção; previsível (enumerável: embaralhe); o contador é ponto único, então aloque **faixas** por servidor"],
        ["Gerador de chaves pré-calculadas (KGS)", "Um serviço gera códigos aleatórios antes; cada servidor pega um lote", "Sem colisão e sem coordenação por requisição; precisa gerir lotes e falhas"],
        ["ID tipo Snowflake", "Timestamp + id da máquina + sequência, em base62", "Distribuído e ordenável; código mais longo"]
      ] },
      { t: "fl", ti: "Leitura (o caminho quente)", n: ["Cliente abre o link curto", "Cache Redis (hit em ~1 ms)", "Em caso de miss, consulta o armazenamento e preenche o cache", "Responde `302` + `Location`", "O clique vai para uma fila (assíncrono)"] },
      { t: "fl", ti: "Escrita", n: ["Valida a URL (esquema, tamanho, blocklist)", "Obtém um código (KGS ou faixa do contador)", "Grava `código → URL` (rejeita alias repetido com `409`)", "Devolve `https://sho.rt/aZ3k9Qb`"] },
      { t: "tb", ti: "301 ou 302?", h: ["Código", "Efeito"], r: [
        ["301 (permanente)", "Navegadores e CDNs guardam o destino: menos carga, mas você **perde** a contagem de cliques e não consegue mudar o destino depois"],
        ["302 (temporário)", "Toda visita passa por você: dá estatísticas e controle, com mais tráfego. Escolha comum em encurtadores com analytics"]
      ] }
    ],
    traps: [
      "Usar hash truncado sem tratar colisão: dois links diferentes acabam com o mesmo código.",
      "Contador sequencial exposto: qualquer um enumera todos os links, inclusive os privados.",
      "Registrar o clique de forma síncrona no caminho do redirect: a latência e a falha da estatística passam a afetar o redirecionamento.",
      "Não tratar abuso (phishing, malware): o encurtador vira ferramenta de ataque.",
      "Desenhar antes de estimar: sem os números não dá para justificar cache, particionamento ou escolha de banco."
    ],
    rc: [
      ["Por que 7 caracteres em base62 bastam?", "62⁷ ≈ 3,5 trilhões de combinações, muito mais que os ~6 bilhões de links estimados para 5 anos."],
      ["Por que o redirect lê do cache e não do banco?", "A leitura é ~100× a escrita e se concentra em poucos links; o cache responde a quase tudo em ~1 ms, poupando o armazenamento."]
    ]
  },
  en: {
    s: "URL shortener",
    q: "How would you design a URL-shortening service like Bitly?",
    why: "Designing a whole product needs a fixed script so nothing is forgotten and you do not drown in details: requirements, numbers, API, data, architecture and bottlenecks, in that order.",
    one: "Follow the script. It is a system with **far more reads than writes** (~100:1): `POST /urls` generates a short code in **7-character base62** (62⁷ ≈ 3.5 trillion combinations) and stores `code → long URL` in a key-value store; `GET /{code}` answers `302` reading first from a **cache** (Redis). The heart is **generating the code without collisions**; the rest is cache, CDN, expiry and abuse control.",
    b: [
      { t: "st", ti: "The script applied", i: [
        ["1. Requirements", "Functional: shorten a URL, redirect, optional custom alias, optional expiry, click statistics. Non-functional: redirect in a few milliseconds, high availability, ~100 reads per write, links not guessable in sequence."],
        ["2. Estimates", "100 million new URLs per month ≈ 40 writes/s. Reads 100× larger ≈ 4,000/s average, ~40,000/s at peak. Over 5 years: 6 billion records × ~500 B ≈ 3 TB. Fits a simple distributed store."],
        ["3. API", "`POST /urls {longUrl, alias?, ttl?}` → `201 {shortUrl}`. `GET /{code}` → `302` with `Location`. Alias already taken: `409`."],
        ["4. Code generation", "The central decision; see the table below."],
        ["5. Data", "`code` (primary key), `long_url`, `user_id`, `created_at`, `expires_at`. Access is always by key: KV (DynamoDB, Cassandra) or SQL partitioned by `code`."],
        ["6. Architecture", "Client → CDN/load balancer → stateless app servers → **cache** (Redis, LRU) → storage. About 20% of links account for ~80% of traffic, so the cache absorbs almost everything."],
        ["7. Bottlenecks and extras", "Viral link (hot key), abuse and malware (blocklist, rate limiting), expired-link cleanup, statistics through a queue (off the redirect path), multi-region."]
      ] },
      { t: "tb", ti: "How to generate the code (central decision)", h: ["Option", "How", "Pros and cons"], r: [
        ["Truncated URL hash", "Hash (MD5/SHA) converted to base62, first 7 characters", "No coordination; **collisions** require checking and retrying; the same URL gives the same code"],
        ["Global counter + base62", "Sequential ID converted to base62", "Unique by construction; predictable (enumerable: scramble it); the counter is a single point, so allocate **ranges** per server"],
        ["Pre-generated key service (KGS)", "A service generates random codes ahead of time; each server takes a batch", "No collisions and no per-request coordination; must manage batches and failures"],
        ["Snowflake-style ID", "Timestamp + machine id + sequence, in base62", "Distributed and sortable; longer code"]
      ] },
      { t: "fl", ti: "Read (the hot path)", n: ["Client opens the short link", "Redis cache (hit in ~1 ms)", "On a miss, query storage and fill the cache", "Respond `302` + `Location`", "The click goes to a queue (asynchronous)"] },
      { t: "fl", ti: "Write", n: ["Validate the URL (scheme, length, blocklist)", "Obtain a code (KGS or counter range)", "Store `code → URL` (reject a repeated alias with `409`)", "Return `https://sho.rt/aZ3k9Qb`"] },
      { t: "tb", ti: "301 or 302?", h: ["Code", "Effect"], r: [
        ["301 (permanent)", "Browsers and CDNs cache the destination: less load, but you **lose** click counts and cannot change the destination later"],
        ["302 (temporary)", "Every visit goes through you: gives statistics and control, with more traffic. The common choice for shorteners with analytics"]
      ] }
    ],
    traps: [
      "Using a truncated hash without handling collisions: two different links end up with the same code.",
      "An exposed sequential counter: anyone can enumerate all links, including private ones.",
      "Recording the click synchronously on the redirect path: the statistics’ latency and failures start affecting redirects.",
      "Not handling abuse (phishing, malware): the shortener becomes an attack tool.",
      "Designing before estimating: without numbers you cannot justify cache, partitioning or database choice."
    ],
    rc: [
      ["Why are 7 base62 characters enough?", "62⁷ ≈ 3.5 trillion combinations, far more than the ~6 billion links estimated over 5 years."],
      ["Why does the redirect read from the cache and not the database?", "Reads are ~100× writes and concentrate on a few links; the cache answers almost everything in ~1 ms, sparing the storage."]
    ]
  }
});

/* ============ 22 · Fila de mensagens ============ */
window.QS.push({
  n: 22, g: "E", m: "firstprinciples",
  pt: {
    s: "Sistema de fila de mensagens",
    q: "Como você projeta um sistema de fila de mensagens?",
    why: "Uma fila de mensagens não nasce pronta: nasce de uma lista simples que vai quebrando a cada restrição (durabilidade, escala, falhas). Construir do zero mostra por que cada componente existe.",
    one: "Comece com uma lista FIFO e acrescente uma restrição de cada vez: **log durável em disco e replicado** (não perder mensagens), **ack ou offset** (saber o que já foi processado), **garantia de entrega at-least-once** com consumidores idempotentes, **partições** (escala, com ordem só dentro da partição), **retentativas e DLQ** (falhas) e **monitoramento do lag**. Dois modelos: fila (cada mensagem a um consumidor) e pub/sub (cópia a cada assinante).",
    b: [
      { t: "st", ti: "Construindo, uma restrição por vez", i: [
        ["0. O problema", "Produtor e consumidor têm velocidades diferentes e não podem depender de estar vivos ao mesmo tempo. Precisa-se de um intermediário que guarde as mensagens."],
        ["1. A versão mais simples", "Uma lista em memória (FIFO) com `enqueue` e `dequeue`. → Quebra: se o processo cair, tudo se perde; e é um nó só."],
        ["2. Durabilidade", "Gravar as mensagens num **log append-only em disco** (escrita sequencial é rápida) e **replicar** em N nós (líder + seguidores). → Sobrevive à falha de um nó."],
        ["3. Entrega ao consumidor", "Como saber o que já foi processado? **Ack por mensagem** (SQS, RabbitMQ): sem ack em T segundos (visibility timeout) a mensagem volta. Ou **offset por grupo de consumidores** (Kafka): o consumidor lembra até onde leu."],
        ["4. Garantias de entrega", "At-most-once (ack antes de processar: pode perder), **at-least-once** (ack depois: pode duplicar, o padrão prático) e exactly-once (na prática: at-least-once + consumidor idempotente ou transações)."],
        ["5. Escala", "Particionar o tópico em N partições pela chave (hash). Paralelismo = número de partições. A **ordem só vale dentro da partição**. Cada partição vai a um consumidor do grupo; rebalancear quando consumidores entram ou saem."],
        ["6. Falhas e mensagens ruins", "Retentativas com backoff, **DLQ** para a mensagem envenenada, limite de tamanho da fila e backpressure sobre o produtor, retenção/TTL."],
        ["7. Dois modelos", "**Fila** (cada mensagem para um consumidor: competing consumers) e **pub/sub** (cada assinante recebe uma cópia). Kafka e SNS oferecem os dois com grupos."],
        ["8. Controle e operação", "Cluster de brokers com metadados e eleição de líder (Raft/ZooKeeper), roteamento de tópicos, monitoramento do **lag** do consumidor, autenticação e cotas."]
      ] },
      { t: "cd", ti: "A interface mínima", l: "API", c: `produce(topico, chave, mensagem) -> offset
consume(grupo, topico)           -> [mensagens]   # long polling
ack(id) / nack(id)                                 # confirma ou devolve
# a chave decide a particao: mesma chave -> mesma particao -> mesma ordem` },
      { t: "tb", ti: "Como isso aparece em produtos reais", h: ["", "RabbitMQ", "Kafka", "SQS"], r: [
        ["Modelo", "Broker com filas e exchanges de roteamento", "Log distribuído e particionado", "Fila gerenciada na nuvem"],
        ["Ordem", "Por fila", "Por partição", "Opcional (FIFO)"],
        ["Retenção", "Até ser consumida", "Por tempo ou tamanho; é possível reler", "Até 14 dias"],
        ["Melhor para", "Roteamento flexível, tarefas", "Alto volume, streaming, replay", "Simplicidade sem operar infraestrutura"]
      ] },
      { t: "tp", k: "warn", h: "Exactly-once é promessa de ponta a ponta", x: "O broker pode evitar duplicar no seu log, mas o efeito no mundo (um e-mail, uma cobrança) só é único se o consumidor for idempotente. Desconfie de quem promete “exactly-once” sem falar disso." }
    ],
    traps: [
      "Prometer exactly-once sem idempotência no consumidor.",
      "Querer ordem global e alta vazão ao mesmo tempo: são incompatíveis; escolha ordem por chave.",
      "Usar a fila como banco de dados (consultar, filtrar, apagar no meio).",
      "Sem DLQ: uma mensagem envenenada trava a partição ou fica reprocessando para sempre.",
      "Não monitorar o lag: o sintoma do consumidor lento é a fila crescendo, não erro."
    ],
    rc: [
      ["O que garante a ordem num sistema particionado?", "A ordem só vale dentro de uma partição; mensagens com a mesma chave vão para a mesma partição."],
      ["Por que at-least-once exige consumidor idempotente?", "Porque a mesma mensagem pode ser entregue mais de uma vez (ack perdido, timeout); processá-la de novo não pode duplicar o efeito."]
    ]
  },
  en: {
    s: "Message queue system",
    q: "How do you design a message queue system?",
    why: "A message queue is not born finished: it starts as a simple list that breaks at each constraint (durability, scale, failures). Building from scratch shows why each component exists.",
    one: "Start with a FIFO list and add one constraint at a time: a **durable, replicated on-disk log** (do not lose messages), **ack or offset** (know what was processed), **at-least-once delivery** with idempotent consumers, **partitions** (scale, with order only inside a partition), **retries and a DLQ** (failures) and **lag monitoring**. Two models: queue (each message to one consumer) and pub/sub (a copy to every subscriber).",
    b: [
      { t: "st", ti: "Building up, one constraint at a time", i: [
        ["0. The problem", "Producer and consumer run at different speeds and cannot depend on being alive at the same time. You need an intermediary that stores messages."],
        ["1. The simplest version", "An in-memory list (FIFO) with `enqueue` and `dequeue`. → Breaks: if the process dies everything is lost; and it is a single node."],
        ["2. Durability", "Write messages to an **append-only log on disk** (sequential writes are fast) and **replicate** it to N nodes (leader + followers). → Survives a node failure."],
        ["3. Delivery to the consumer", "How do you know what was processed? **Per-message ack** (SQS, RabbitMQ): without an ack within T seconds (visibility timeout) the message returns. Or a **per-consumer-group offset** (Kafka): the consumer remembers how far it read."],
        ["4. Delivery guarantees", "At-most-once (ack before processing: may lose), **at-least-once** (ack after: may duplicate, the practical default) and exactly-once (in practice: at-least-once + idempotent consumer or transactions)."],
        ["5. Scale", "Split the topic into N partitions by key (hash). Parallelism = number of partitions. **Order only holds within a partition**. Each partition goes to one consumer in the group; rebalance when consumers join or leave."],
        ["6. Failures and bad messages", "Retries with backoff, a **DLQ** for the poison message, queue size limit and backpressure on the producer, retention/TTL."],
        ["7. Two models", "**Queue** (each message to one consumer: competing consumers) and **pub/sub** (each subscriber gets a copy). Kafka and SNS offer both with groups."],
        ["8. Control and operations", "A broker cluster with metadata and leader election (Raft/ZooKeeper), topic routing, consumer **lag** monitoring, authentication and quotas."]
      ] },
      { t: "cd", ti: "The minimal interface", l: "API", c: `produce(topic, key, message)  -> offset
consume(group, topic)         -> [messages]   # long polling
ack(id) / nack(id)                            # confirm or return
# the key decides the partition: same key -> same partition -> same order` },
      { t: "tb", ti: "How this shows up in real products", h: ["", "RabbitMQ", "Kafka", "SQS"], r: [
        ["Model", "Broker with queues and routing exchanges", "Distributed, partitioned log", "Managed cloud queue"],
        ["Ordering", "Per queue", "Per partition", "Optional (FIFO)"],
        ["Retention", "Until consumed", "By time or size; re-reading is possible", "Up to 14 days"],
        ["Best for", "Flexible routing, tasks", "High volume, streaming, replay", "Simplicity without running infrastructure"]
      ] },
      { t: "tp", k: "warn", h: "Exactly-once is an end-to-end promise", x: "The broker can avoid duplicating in its own log, but the effect on the world (an email, a charge) is only single if the consumer is idempotent. Be wary of anyone promising “exactly-once” without mentioning it." }
    ],
    traps: [
      "Promising exactly-once without consumer idempotency.",
      "Wanting global order and high throughput at once: they are incompatible; choose per-key order.",
      "Using the queue as a database (querying, filtering, deleting from the middle).",
      "No DLQ: a poison message blocks the partition or reprocesses forever.",
      "Not monitoring lag: the symptom of a slow consumer is a growing queue, not an error."
    ],
    rc: [
      ["What guarantees ordering in a partitioned system?", "Order only holds within a partition; messages with the same key go to the same partition."],
      ["Why does at-least-once require an idempotent consumer?", "Because the same message may be delivered more than once (lost ack, timeout); processing it again must not duplicate the effect."]
    ]
  }
});

/* ============ 23 · Balanceamento de carga ============ */
window.QS.push({
  n: 23, g: "E", m: "compare",
  pt: {
    s: "Balanceamento de carga",
    q: "Quais são os benefícios do balanceamento de carga e que tipos de balanceadores de carga existem?",
    why: "A pergunta tem duas partes, benefícios e tipos, e os tipos se diferenciam em eixos diferentes (camada, forma de implantação, algoritmo). Tabelas por eixo evitam misturar as categorias.",
    one: "Um balanceador de carga distribui as requisições entre vários servidores. Benefícios: **escala horizontal**, **alta disponibilidade** (health checks tiram nós doentes), **deploys sem parada**, um **endpoint estável** com TLS terminado e um ponto para **proteção** (WAF, rate limit). Tipos: por camada (**L4** rápido e cego ao HTTP, **L7** que roteia por conteúdo), por implantação (hardware, software, gerenciado, DNS/GSLB) e por algoritmo (round robin, menos conexões, hash consistente…).",
    b: [
      { t: "st", ti: "Benefícios", i: [
        ["Escala horizontal", "Adicionar servidores aumenta a capacidade, sem o cliente perceber."],
        ["Alta disponibilidade", "Health checks removem nós que falham da rotação; o tráfego segue para os saudáveis."],
        ["Deploy sem parada", "Rolling, blue-green e canary: tira um nó por vez, ou desvia 5% do tráfego para a versão nova."],
        ["Um endpoint estável", "Os clientes não conhecem os servidores; o balanceador pode terminar TLS, comprimir e reutilizar conexões."],
        ["Ponto de proteção", "Lugar natural para WAF, rate limiting e absorção de DDoS."]
      ] },
      { t: "tb", ti: "Por camada", h: ["", "L4 (transporte)", "L7 (aplicação)"], r: [
        ["Decide por", "IP e porta (TCP/UDP)", "Host, path, cabeçalhos, cookies"],
        ["Enxerga HTTP?", "Não", "Sim"],
        ["Pontos fortes", "Muito rápido, baixa latência, qualquer protocolo", "Roteamento por URL, TLS offload, retries, A/B, WAF, cache"],
        ["Custo", "Menor", "Maior (processa cada requisição)"],
        ["Exemplos", "AWS NLB, HAProxy (modo tcp), IPVS", "AWS ALB, NGINX, Envoy, HAProxy (modo http)"]
      ] },
      { t: "tb", ti: "Por forma de implantação", h: ["Tipo", "Exemplos", "Nota"], r: [
        ["Hardware", "F5 BIG-IP, Citrix ADC", "Alto desempenho e custo; ciclo de compra"],
        ["Software", "NGINX, HAProxy, Envoy", "Flexível e programável; você opera"],
        ["Gerenciado na nuvem", "AWS ALB/NLB, Google Cloud LB, Azure LB/App Gateway", "Sem operar; redundância embutida"],
        ["DNS / GSLB", "Route 53, Cloudflare", "Distribui entre regiões; failover lento por causa do TTL"],
        ["Lado do cliente / service mesh", "gRPC, Istio, Linkerd", "O cliente (ou um proxy ao lado) escolhe o nó"]
      ] },
      { t: "tb", ti: "Algoritmos", h: ["Algoritmo", "Como decide", "Quando"], r: [
        ["Round robin", "Um de cada vez, em ordem", "Servidores iguais, requisições parecidas"],
        ["Round robin ponderado", "Round robin com pesos", "Servidores de capacidades diferentes"],
        ["Menos conexões", "Envia a quem tem menos conexões ativas", "Requisições de duração muito variável"],
        ["Menor tempo de resposta", "Envia ao mais rápido no momento", "Latências heterogêneas"],
        ["IP hash / hash consistente", "Mesmo cliente (ou chave) → mesmo servidor", "Afinidade e cache local; menos remanejamento ao mudar o conjunto"],
        ["Dois escolhidos ao acaso", "Sorteia 2 nós e fica com o menos carregado", "Barato e evita sobrecarregar um nó"]
      ] },
      { t: "tp", k: "warn", h: "O balanceador também é ponto único de falha", x: "Use pares ativo-ativo ou ativo-passivo (VRRP/keepalived), anycast, ou o balanceador gerenciado da nuvem, que já é redundante." }
    ],
    traps: [
      "Sticky sessions para esconder estado no servidor: ao cair o nó, a sessão se perde e a carga fica desigual.",
      "Health check raso (porta aberta): a aplicação pode estar travada ou sem banco. Use um endpoint que exercite o serviço.",
      "Round robin com requisições de custos muito diferentes: um nó fica sobrecarregado.",
      "Achar que o balanceador resolve gargalo de banco: ele só distribui a camada de aplicação.",
      "Retries no balanceador sem controle: multiplicam a carga de quem já está sofrendo."
    ],
    rc: [
      ["Quando escolher L7 em vez de L4?", "Quando é preciso decidir pelo conteúdo da requisição (path, host, cabeçalho, cookie), terminar TLS ou fazer retries e roteamento inteligente."],
      ["Por que um health check de porta aberta é frágil?", "Porque a porta pode estar aberta com a aplicação travada ou sem acesso ao banco; o check deve exercitar a aplicação."]
    ]
  },
  en: {
    s: "Load balancing",
    q: "What are the benefits of load balancing and what types of load balancers exist?",
    why: "The question has two parts, benefits and types, and the types differ along different axes (layer, deployment form, algorithm). One table per axis avoids mixing the categories.",
    one: "A load balancer spreads requests across several servers. Benefits: **horizontal scaling**, **high availability** (health checks remove sick nodes), **zero-downtime deploys**, a **stable endpoint** with TLS terminated, and one place for **protection** (WAF, rate limiting). Types: by layer (**L4** fast and HTTP-blind, **L7** routing by content), by deployment (hardware, software, managed, DNS/GSLB) and by algorithm (round robin, least connections, consistent hash…).",
    b: [
      { t: "st", ti: "Benefits", i: [
        ["Horizontal scaling", "Adding servers raises capacity, without the client noticing."],
        ["High availability", "Health checks remove failing nodes from rotation; traffic flows to the healthy ones."],
        ["Zero-downtime deploys", "Rolling, blue-green and canary: take one node out at a time, or divert 5% of traffic to the new version."],
        ["A stable endpoint", "Clients do not know the servers; the balancer can terminate TLS, compress and reuse connections."],
        ["A protection point", "The natural place for a WAF, rate limiting and DDoS absorption."]
      ] },
      { t: "tb", ti: "By layer", h: ["", "L4 (transport)", "L7 (application)"], r: [
        ["Decides by", "IP and port (TCP/UDP)", "Host, path, headers, cookies"],
        ["Sees HTTP?", "No", "Yes"],
        ["Strengths", "Very fast, low latency, any protocol", "URL routing, TLS offload, retries, A/B, WAF, cache"],
        ["Cost", "Lower", "Higher (processes every request)"],
        ["Examples", "AWS NLB, HAProxy (tcp mode), IPVS", "AWS ALB, NGINX, Envoy, HAProxy (http mode)"]
      ] },
      { t: "tb", ti: "By deployment form", h: ["Type", "Examples", "Note"], r: [
        ["Hardware", "F5 BIG-IP, Citrix ADC", "High performance and cost; procurement cycle"],
        ["Software", "NGINX, HAProxy, Envoy", "Flexible and programmable; you operate it"],
        ["Managed cloud", "AWS ALB/NLB, Google Cloud LB, Azure LB/App Gateway", "No operations; built-in redundancy"],
        ["DNS / GSLB", "Route 53, Cloudflare", "Spreads across regions; slow failover because of TTL"],
        ["Client-side / service mesh", "gRPC, Istio, Linkerd", "The client (or a sidecar proxy) picks the node"]
      ] },
      { t: "tb", ti: "Algorithms", h: ["Algorithm", "How it decides", "When"], r: [
        ["Round robin", "One at a time, in order", "Equal servers, similar requests"],
        ["Weighted round robin", "Round robin with weights", "Servers of different capacities"],
        ["Least connections", "Sends to whoever has the fewest active connections", "Requests with very variable duration"],
        ["Least response time", "Sends to the fastest right now", "Heterogeneous latencies"],
        ["IP hash / consistent hash", "Same client (or key) → same server", "Affinity and local cache; less reshuffling when the set changes"],
        ["Power of two choices", "Picks 2 random nodes and takes the less loaded", "Cheap and avoids overloading one node"]
      ] },
      { t: "tp", k: "warn", h: "The balancer is also a single point of failure", x: "Use active-active or active-passive pairs (VRRP/keepalived), anycast, or the cloud’s managed balancer, which is already redundant." }
    ],
    traps: [
      "Sticky sessions to hide state on the server: when the node dies the session is lost and load becomes uneven.",
      "A shallow health check (open port): the application may be stuck or have no database. Use an endpoint that exercises the service.",
      "Round robin with requests of very different cost: one node ends up overloaded.",
      "Believing the balancer fixes a database bottleneck: it only spreads the application tier.",
      "Uncontrolled retries at the balancer: they multiply load on a system that is already struggling."
    ],
    rc: [
      ["When would you choose L7 over L4?", "When you must decide by request content (path, host, header, cookie), terminate TLS or do retries and smart routing."],
      ["Why is an open-port health check fragile?", "Because the port may be open while the application is stuck or cannot reach the database; the check should exercise the application."]
    ]
  }
});

/* ============ 24 · Armazenamento distribuído de arquivos ============ */
window.QS.push({
  n: 24, g: "E", m: "firstprinciples",
  pt: {
    s: "Armazenamento distribuído de arquivos",
    q: "Como você projetaria um sistema distribuído de armazenamento de arquivos?",
    why: "Sistemas como GFS, HDFS e S3 parecem complexos, mas cada peça é o conserto de um problema do servidor único. Construir do zero, uma restrição por vez, revela o desenho.",
    one: "Divida cada arquivo em **blocos** (chunks) espalhados por muitos nós, guarde onde está cada bloco num **serviço de metadados** replicado por consenso (separado do caminho dos dados), proteja os blocos com **3 réplicas** em racks/zonas diferentes ou **erasure coding**, valide com **checksums** e **re-replique** automaticamente quando um nó morrer. Exponha uma API de objetos (PUT/GET) com upload multipart, URLs pré-assinadas e CDN na leitura.",
    b: [
      { t: "st", ti: "Construindo, uma restrição por vez", i: [
        ["0. O problema", "Guardar muitos arquivos, alguns enormes, com durabilidade altíssima, sobrevivendo a falhas de discos, servidores e até de datacenters."],
        ["1. Um servidor", "Um disco, um servidor: limite de capacidade e ponto único de falha. → Precisa-se de vários nós."],
        ["2. Quebrar em blocos", "Divida o arquivo em **chunks** de 64 a 128 MB e espalhe pelos nós. Arquivos maiores que um disco passam a caber, e a leitura vira paralela."],
        ["3. Metadados", "Quem sabe onde está cada chunk? Um **serviço de metadados** (arquivo → chunks → nós) replicado por consenso (Raft/Paxos). Separe o **plano de controle** (pequeno) do **plano de dados** (os bytes vão direto entre cliente e nós), para os metadados não virarem gargalo."],
        ["4. Durabilidade", "Cada chunk em 3 cópias, em racks ou zonas diferentes, ou **erasure coding** (ex.: 10 dados + 4 paridade). Heartbeats detectam nó morto e o sistema **re-replica** sozinho."],
        ["5. Integridade e escrita", "Checksum por bloco, conferido na leitura e em varreduras periódicas (scrubbing). Escrita em pipeline cliente → primário → réplicas, ou por quórum (W + R > N). Objetos imutáveis (nova versão em vez de editar) simplificam tudo."],
        ["6. Escalar os metadados", "Particione o espaço de nomes (hash ou prefixo do caminho), cada partição com sua própria réplica de consenso."],
        ["7. Upload e acesso", "Upload multipart com retomada; URLs pré-assinadas; controle de acesso; CDN na frente da leitura; camadas quente/fria por custo; deduplicação pelo hash do conteúdo."],
        ["8. Operação", "Balanceamento ao entrar disco novo, coleta de blocos órfãos, monitoramento de espaço, de reconstruções e de erros de checksum."]
      ] },
      { t: "cd", ti: "O que o sistema guarda", l: "layout", c: `arquivo "video.mp4" (1 GB)
  chunk 1 (128 MB) -> nos A, C, F    (3 copias, racks diferentes)
  chunk 2 (128 MB) -> nos B, D, G
  ...
metadados: video.mp4 -> [chunk1: A,C,F] [chunk2: B,D,G] ...
cliente: pergunta aos metadados, depois le/escreve os bytes DIRETO nos nos`, n: "Sistemas reais com essa ideia: GFS/HDFS, Ceph, Amazon S3, MinIO." },
      { t: "tb", ti: "Réplicas 3× vs erasure coding", h: ["", "Réplicas (3×)", "Erasure coding (10+4)"], r: [
        ["Espaço usado", "3× o original (200% extra)", "1,4× o original (40% extra)"],
        ["Tolerância", "Perde 2 cópias", "Perde até 4 fragmentos"],
        ["Leitura", "Rápida: lê uma cópia", "Reúne fragmentos (mais CPU e latência)"],
        ["Reconstrução", "Copia o bloco", "Recalcula a partir de vários fragmentos (cara)"],
        ["Uso típico", "Dados quentes, arquivos pequenos", "Dados frios e grandes"]
      ], n: "Exemplo: 1 PB lógico ocupa 3 PB com réplicas ×3 e 1,4 PB com erasure coding 10+4." }
    ],
    traps: [
      "Fazer os bytes passarem pelo serviço de metadados: ele vira o gargalo.",
      "Todas as réplicas no mesmo rack ou zona: uma falha de energia perde as três.",
      "Replicar sem checksum: corrupção silenciosa (bit rot) se espalha para as cópias.",
      "Demorar a re-replicar: uma segunda falha antes do reparo perde dados.",
      "Permitir editar arquivos no lugar em vez de versões imutáveis: complica consistência e cache."
    ],
    rc: [
      ["Por que separar metadados de dados?", "Os metadados são pequenos e consultados o tempo todo; os dados são enormes. Se os bytes passassem pelo serviço de metadados, ele viraria o gargalo."],
      ["Quando preferir erasure coding a réplicas?", "Para dados frios e grandes, em que economizar espaço compensa o maior custo de CPU e de reconstrução."]
    ]
  },
  en: {
    s: "Distributed file storage",
    q: "How would you design a distributed file storage system?",
    why: "Systems like GFS, HDFS and S3 look complex, but each piece fixes a single-server problem. Building from scratch, one constraint at a time, reveals the design.",
    one: "Split each file into **blocks** (chunks) spread across many nodes, keep where each block lives in a **metadata service** replicated by consensus (separate from the data path), protect blocks with **3 replicas** in different racks/zones or with **erasure coding**, verify with **checksums** and **re-replicate** automatically when a node dies. Expose an object API (PUT/GET) with multipart upload, pre-signed URLs and a CDN on reads.",
    b: [
      { t: "st", ti: "Building up, one constraint at a time", i: [
        ["0. The problem", "Store many files, some enormous, with very high durability, surviving disk, server and even datacenter failures."],
        ["1. One server", "One disk, one server: capacity limit and a single point of failure. → You need several nodes."],
        ["2. Break into blocks", "Split the file into **chunks** of 64 to 128 MB and spread them across nodes. Files bigger than one disk now fit, and reads become parallel."],
        ["3. Metadata", "Who knows where each chunk is? A **metadata service** (file → chunks → nodes) replicated by consensus (Raft/Paxos). Separate the **control plane** (small) from the **data plane** (bytes flow directly between client and nodes), so metadata does not become a bottleneck."],
        ["4. Durability", "Each chunk in 3 copies, in different racks or zones, or **erasure coding** (e.g. 10 data + 4 parity). Heartbeats detect a dead node and the system **re-replicates** by itself."],
        ["5. Integrity and writes", "Per-block checksum, verified on reads and in periodic sweeps (scrubbing). Writes in a client → primary → replicas pipeline, or by quorum (W + R > N). Immutable objects (a new version instead of editing) simplify everything."],
        ["6. Scaling the metadata", "Partition the namespace (hash or path prefix), each partition with its own consensus group."],
        ["7. Upload and access", "Resumable multipart upload; pre-signed URLs; access control; a CDN in front of reads; hot/cold tiers for cost; deduplication by content hash."],
        ["8. Operations", "Rebalancing when a new disk joins, garbage collection of orphan blocks, monitoring of space, rebuilds and checksum errors."]
      ] },
      { t: "cd", ti: "What the system stores", l: "layout", c: `file "video.mp4" (1 GB)
  chunk 1 (128 MB) -> nodes A, C, F    (3 copies, different racks)
  chunk 2 (128 MB) -> nodes B, D, G
  ...
metadata: video.mp4 -> [chunk1: A,C,F] [chunk2: B,D,G] ...
client: asks metadata, then reads/writes the bytes DIRECTLY on the nodes`, n: "Real systems built on this idea: GFS/HDFS, Ceph, Amazon S3, MinIO." },
      { t: "tb", ti: "3× replicas vs erasure coding", h: ["", "Replicas (3×)", "Erasure coding (10+4)"], r: [
        ["Space used", "3× the original (200% extra)", "1.4× the original (40% extra)"],
        ["Tolerance", "Loses 2 copies", "Loses up to 4 fragments"],
        ["Read", "Fast: reads one copy", "Gathers fragments (more CPU and latency)"],
        ["Rebuild", "Copy the block", "Recompute from several fragments (expensive)"],
        ["Typical use", "Hot data, small files", "Cold and large data"]
      ], n: "Example: 1 PB logical takes 3 PB with ×3 replicas and 1.4 PB with 10+4 erasure coding." }
    ],
    traps: [
      "Passing the bytes through the metadata service: it becomes the bottleneck.",
      "All replicas in the same rack or zone: one power failure loses all three.",
      "Replicating without checksums: silent corruption (bit rot) spreads to the copies.",
      "Re-replicating slowly: a second failure before repair loses data.",
      "Allowing in-place edits instead of immutable versions: complicates consistency and caching."
    ],
    rc: [
      ["Why separate metadata from data?", "Metadata is small and queried constantly; data is huge. If the bytes flowed through the metadata service it would become the bottleneck."],
      ["When would you prefer erasure coding over replicas?", "For cold, large data, where saving space outweighs the higher CPU and rebuild cost."]
    ]
  }
});

/* ============ 25 · Consistência eventual vs forte ============ */
window.QS.push({
  n: 25, g: "E", m: "feynman",
  pt: {
    s: "Consistência eventual vs forte",
    q: "Explique a consistência eventual e a forte consistência em sistemas distribuídos.",
    why: "A ideia cabe numa imagem (um placar único vs muitos telões). Depois dela, a versão técnica (linearizabilidade, quórum, CAP) e o ponto em que a imagem falha: conflitos de escrita.",
    one: "**Consistência forte**: depois que uma escrita é confirmada, toda leitura vê esse valor (ou mais novo), como se houvesse uma só cópia; custa coordenação, então mais **latência** e menos **disponibilidade** numa partição. **Consistência eventual**: se parar de escrever, as réplicas **convergem**, mas leituras podem ver dado velho; é rápida e disponível. Na prática se escolhe **por operação**: saldo pede forte; curtidas toleram eventual.",
    b: [
      { t: "an",
        s: "Um estádio com um único placar: o árbitro marca o gol e todos olham para o mesmo número (forte). Um estádio com muitos telões: o árbitro avisa e cada telão atualiza em alguns segundos. Por instantes, telões diferentes mostram placares diferentes, mas sem novo gol todos acabam iguais (eventual).",
        k: "**Forte (linearizável)**: após o `ack` de uma escrita, toda leitura posterior vê esse valor ou um mais novo. Exige coordenação (líder, consenso, quórum): mais latência e, numa partição de rede, pode ser preciso recusar requisições. **Eventual**: réplicas aceitam leituras e escritas localmente e sincronizam depois; ótimo para latência e disponibilidade. Entre os dois existem garantias intermediárias: read-your-writes, monotonic reads, consistência causal, bounded staleness.",
        b: "No estádio só há um árbitro, então não existe conflito. Em sistemas eventuais, duas réplicas podem aceitar escritas diferentes ao mesmo tempo sobre o mesmo dado, e é preciso **resolver o conflito** (último vence, vector clocks, CRDTs). Esse é o custo oculto." },
      { t: "tb", h: ["", "Forte", "Eventual"], r: [
        ["Garantia", "Lê sempre o valor mais recente", "Converge se parar de escrever; leitura pode ser velha"],
        ["Latência", "Maior (espera coordenação ou quórum)", "Menor (responde localmente)"],
        ["Numa partição de rede", "Pode recusar para manter a correção (CP)", "Continua respondendo (AP)"],
        ["Exemplos", "Spanner, etcd/ZooKeeper, líder do Postgres, DynamoDB com leitura forte", "DynamoDB padrão, Cassandra (nível ONE), DNS, caches, réplicas de leitura"],
        ["Bom para", "Saldo bancário, estoque final, locks, eleição de líder", "Feed, curtidas, contadores, carrinho, catálogo"],
        ["Custo para o dev", "Menor: raciocínio simples", "Maior: conflitos, leituras velhas, impacto na UX"]
      ] },
      { t: "cd", ti: "Consistência ajustável por quórum", l: "regra", c: `N = 3 replicas
W = 2, R = 2   (W + R > N)   -> toda leitura encontra ao menos 1 replica atualizada: forte
W = 1, R = 1   (W + R <= N)  -> rapido e disponivel, pode ler valor velho: eventual` },
      { t: "tp", k: "key", h: "CAP e PACELC", x: "Numa **partição** de rede você escolhe entre **C**onsistência e **A**vailability (CAP). **Sem partição**, o PACELC lembra que ainda há troca entre **L**atência e **C**onsistência. Quem decide é a operação, não o sistema inteiro: o saldo pode ser forte e as curtidas, eventuais." }
    ],
    traps: [
      "Confundir o C do CAP (todos veem o mesmo dado) com o C do ACID (respeita as regras).",
      "Entender “eventual” como “inconsistente para sempre”: significa que converge se não houver novas escritas.",
      "Escolher um modelo para o sistema inteiro em vez de por operação.",
      "Ignorar conflitos de escrita em sistemas multilíder ou sem líder.",
      "Ler da réplica logo após escrever e achar que é um bug: é o comportamento esperado."
    ],
    rc: [
      ["O que significa W + R > N?", "Os conjuntos de escrita e de leitura se sobrepõem em ao menos uma réplica, então a leitura enxerga a última escrita confirmada."],
      ["Dê um dado que exige consistência forte e outro que tolera eventual.", "Forte: saldo bancário, estoque final, lock. Eventual: curtidas, feed, contador de visitas."]
    ]
  },
  en: {
    s: "Eventual vs strong consistency",
    q: "Explain eventual consistency and strong consistency in distributed systems.",
    why: "The idea fits in one image (a single scoreboard vs many screens). After it comes the technical version (linearizability, quorum, CAP) and the point where the image fails: write conflicts.",
    one: "**Strong consistency**: once a write is acknowledged, every read sees that value (or newer), as if there were one copy; it costs coordination, so more **latency** and less **availability** during a partition. **Eventual consistency**: if writes stop, replicas **converge**, but reads may see stale data; it is fast and available. In practice you choose **per operation**: a balance needs strong; likes tolerate eventual.",
    b: [
      { t: "an",
        s: "A stadium with a single scoreboard: the referee scores the goal and everyone looks at the same number (strong). A stadium with many screens: the referee signals and each screen updates within seconds. For a moment different screens show different scores, but with no new goal they all end up equal (eventual).",
        k: "**Strong (linearizable)**: after a write’s `ack`, every later read sees that value or a newer one. It needs coordination (leader, consensus, quorum): more latency and, in a network partition, requests may have to be refused. **Eventual**: replicas accept reads and writes locally and sync later; great for latency and availability. In between lie intermediate guarantees: read-your-writes, monotonic reads, causal consistency, bounded staleness.",
        b: "In the stadium there is only one referee, so there is no conflict. In eventual systems two replicas can accept different writes to the same data at the same time, and the **conflict must be resolved** (last write wins, vector clocks, CRDTs). That is the hidden cost." },
      { t: "tb", h: ["", "Strong", "Eventual"], r: [
        ["Guarantee", "Always reads the most recent value", "Converges if writes stop; a read may be stale"],
        ["Latency", "Higher (waits for coordination or quorum)", "Lower (answers locally)"],
        ["During a network partition", "May refuse to stay correct (CP)", "Keeps answering (AP)"],
        ["Examples", "Spanner, etcd/ZooKeeper, Postgres leader, DynamoDB strong reads", "DynamoDB default, Cassandra (ONE level), DNS, caches, read replicas"],
        ["Good for", "Bank balance, final stock, locks, leader election", "Feeds, likes, counters, carts, catalogs"],
        ["Cost for the developer", "Lower: simple reasoning", "Higher: conflicts, stale reads, UX impact"]
      ] },
      { t: "cd", ti: "Tunable consistency via quorum", l: "rule", c: `N = 3 replicas
W = 2, R = 2   (W + R > N)   -> every read finds at least 1 up-to-date replica: strong
W = 1, R = 1   (W + R <= N)  -> fast and available, may read a stale value: eventual` },
      { t: "tp", k: "key", h: "CAP and PACELC", x: "During a network **partition** you choose between **C**onsistency and **A**vailability (CAP). **Without a partition**, PACELC reminds you there is still a trade-off between **L**atency and **C**onsistency. The operation decides, not the whole system: the balance can be strong and the likes eventual." }
    ],
    traps: [
      "Confusing the C in CAP (everyone sees the same data) with the C in ACID (respects the rules).",
      "Reading “eventual” as “inconsistent forever”: it means it converges if no new writes arrive.",
      "Picking one model for the whole system instead of per operation.",
      "Ignoring write conflicts in multi-leader or leaderless systems.",
      "Reading from a replica right after writing and thinking it is a bug: it is expected behavior."
    ],
    rc: [
      ["What does W + R > N mean?", "The write and read sets overlap in at least one replica, so the read sees the latest acknowledged write."],
      ["Give data that needs strong consistency and data that tolerates eventual.", "Strong: bank balance, final stock, lock. Eventual: likes, feed, visit counter."]
    ]
  }
});

/* ============ 26 · Testes ============ */
window.QS.push({
  n: 26, g: "F", m: "compare",
  pt: {
    s: "Unitário, integração e E2E",
    q: "O que são testes unitários, testes de integração e testes de ponta a ponta?",
    why: "São três níveis da mesma escada, e o que importa é o que cada um pega e o que custa. Uma matriz com os mesmos critérios deixa isso visível, e o exemplo único mostra a diferença na prática.",
    one: "**Unitário**: testa uma peça isolada (função, classe) com dependências falsificadas; é rápido e pega erros de lógica. **Integração**: testa componentes reais juntos (serviço + banco, API + fila) e pega erros na fronteira (SQL, serialização, configuração). **Ponta a ponta (E2E)**: exercita o sistema inteiro como o usuário, é lento e frágil, e cobre só os fluxos críticos. A regra é a **pirâmide**: muitos unitários, alguns de integração, poucos E2E.",
    b: [
      { t: "tb", h: ["", "Unitário", "Integração", "Ponta a ponta (E2E)"], r: [
        ["O que testa", "Uma função ou classe isolada", "Vários componentes reais juntos (serviço + banco, API + fila)", "O sistema inteiro, como o usuário o usa (UI ou API pública)"],
        ["Dependências", "Falsificadas (mocks, stubs)", "Reais ou em contêineres (Testcontainers)", "Todas reais, ambiente parecido com produção"],
        ["Velocidade", "Milissegundos", "Segundos", "Minutos"],
        ["Fragilidade", "Baixa", "Média", "Alta (flaky: rede, tempo, dados)"],
        ["O que pega", "Erros de lógica", "SQL errado, serialização, contratos, configuração", "Fluxo quebrado entre sistemas, deploy, UI"],
        ["Quantidade ideal", "Muitos (base)", "Alguns", "Poucos, só os fluxos críticos"],
        ["Custo de manutenção", "Baixo", "Médio", "Alto"]
      ] },
      { t: "cd", ti: "O mesmo recurso, “criar pedido”, nos três níveis", l: "javascript (jest + supertest)", c: `// unitario: sem banco, sem rede
test("total soma preco x quantidade", () => {
  expect(totalDoPedido([{ preco: 10, qtd: 2 }, { preco: 5, qtd: 1 }])).toBe(25)
})

// integracao: API real + Postgres de teste
test("POST /pedidos grava e responde 201", async () => {
  const r = await request(app).post("/pedidos").send({ itens: [{ sku: "A1", qtd: 2 }] })
  expect(r.status).toBe(201)
  expect(await db.count("pedidos")).toBe(1)
})

// e2e: navegador de verdade em staging (Playwright/Cypress)
// o usuario faz login, adiciona ao carrinho, paga e ve a confirmacao` },
      { t: "tp", k: "key", h: "Pirâmide ou troféu?", x: "A pirâmide clássica manda muitos unitários, poucos de integração e pouquíssimos E2E. Em backends que são sobretudo CRUD e SQL, muita gente prefere o “troféu”, com mais integração, porque é ali que os bugs reais aparecem. O critério é o mesmo: **o teste mais barato que ainda pegaria aquele bug**." },
      { t: "tb", ti: "Outros tipos que complementam", h: ["Tipo", "Para quê"], r: [
        ["Contrato (ex.: Pact)", "Garante que consumidor e provedor de uma API concordam, sem subir os dois sistemas"],
        ["Smoke", "Poucos testes rápidos depois do deploy: o sistema está de pé?"],
        ["Carga e estresse", "Como se comporta sob volume e até onde aguenta"],
        ["Mutação", "Altera o código de propósito para ver se os testes percebem"],
        ["Regressão", "Reproduz bugs já corrigidos para não voltarem"]
      ] }
    ],
    traps: [
      "Mock demais: o teste passa a validar o mock, não o sistema.",
      "Tudo em E2E: lento, flaky e difícil de diagnosticar (falha só diz que algo quebrou).",
      "Testes que dependem de ordem, de relógio ou de dados compartilhados.",
      "Perseguir % de cobertura: cobertura mostra o que não foi testado, não que o testado está correto.",
      "Testes de integração apontando para um banco real de produção."
    ],
    rc: [
      ["Por que não fazer só testes E2E?", "São lentos, frágeis e difíceis de diagnosticar; um unitário falhando aponta a linha, um E2E falhando só diz que algo quebrou."],
      ["O que um teste de integração pega que o unitário não pega?", "Erros na fronteira entre componentes: SQL errado, serialização, configuração e contrato com outra API."]
    ]
  },
  en: {
    s: "Unit, integration and E2E",
    q: "What are unit tests, integration tests and end-to-end tests?",
    why: "They are three levels of the same ladder, and what matters is what each catches and what it costs. A matrix with the same criteria makes that visible, and the single example shows the difference in practice.",
    one: "**Unit**: tests an isolated piece (function, class) with faked dependencies; fast, catches logic errors. **Integration**: tests real components together (service + database, API + queue) and catches boundary errors (SQL, serialization, configuration). **End-to-end (E2E)**: exercises the whole system like a user; slow and fragile, so it covers only critical flows. The rule is the **pyramid**: many unit, some integration, few E2E.",
    b: [
      { t: "tb", h: ["", "Unit", "Integration", "End-to-end (E2E)"], r: [
        ["What it tests", "One isolated function or class", "Several real components together (service + database, API + queue)", "The whole system, as the user uses it (UI or public API)"],
        ["Dependencies", "Faked (mocks, stubs)", "Real or in containers (Testcontainers)", "All real, production-like environment"],
        ["Speed", "Milliseconds", "Seconds", "Minutes"],
        ["Fragility", "Low", "Medium", "High (flaky: network, timing, data)"],
        ["What it catches", "Logic errors", "Wrong SQL, serialization, contracts, configuration", "Broken flow across systems, deployment, UI"],
        ["Ideal quantity", "Many (the base)", "Some", "Few, only critical flows"],
        ["Maintenance cost", "Low", "Medium", "High"]
      ] },
      { t: "cd", ti: "The same feature, “create order”, at the three levels", l: "javascript (jest + supertest)", c: `// unit: no database, no network
test("total sums price x quantity", () => {
  expect(orderTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25)
})

// integration: real API + test Postgres
test("POST /orders stores and returns 201", async () => {
  const r = await request(app).post("/orders").send({ items: [{ sku: "A1", qty: 2 }] })
  expect(r.status).toBe(201)
  expect(await db.count("orders")).toBe(1)
})

// e2e: a real browser against staging (Playwright/Cypress)
// the user logs in, adds to cart, pays and sees the confirmation` },
      { t: "tp", k: "key", h: "Pyramid or trophy?", x: "The classic pyramid prescribes many unit tests, few integration tests and very few E2E. In backends that are mostly CRUD and SQL, many people prefer the “trophy”, with more integration, because that is where real bugs show up. The criterion is the same: **the cheapest test that would still catch that bug**." },
      { t: "tb", ti: "Other types that complement", h: ["Type", "Purpose"], r: [
        ["Contract (e.g. Pact)", "Ensures an API’s consumer and provider agree, without starting both systems"],
        ["Smoke", "A few quick tests after deploy: is the system up?"],
        ["Load and stress", "How it behaves under volume and how far it holds"],
        ["Mutation", "Deliberately alters the code to see whether the tests notice"],
        ["Regression", "Reproduces already-fixed bugs so they do not come back"]
      ] }
    ],
    traps: [
      "Too many mocks: the test ends up validating the mock, not the system.",
      "Everything as E2E: slow, flaky and hard to diagnose (a failure only says something broke).",
      "Tests that depend on order, clock or shared data.",
      "Chasing coverage %: coverage shows what was not tested, not that what was tested is correct.",
      "Integration tests pointing at a real production database."
    ],
    rc: [
      ["Why not do only E2E tests?", "They are slow, fragile and hard to diagnose; a failing unit test points at the line, a failing E2E only says something broke."],
      ["What does an integration test catch that a unit test does not?", "Errors at the boundary between components: wrong SQL, serialization, configuration and the contract with another API."]
    ]
  }
});

/* ============ 27 · Vazamento de memória ============ */
window.QS.push({
  n: 27, g: "F", m: "playbook",
  pt: {
    s: "Depurar vazamento de memória",
    q: "Como depurar um vazamento de memória em um aplicativo backend?",
    why: "Depurar é um procedimento investigativo: confirmar o sintoma, isolar, coletar evidência, achar quem segura a referência, corrigir e verificar. A ordem evita o erro clássico de mexer no código antes de provar a causa.",
    one: "Confirme que a memória **sobe continuamente e não volta depois do GC**; isole o endpoint ou a versão responsável; tire **heap snapshots em momentos diferentes e compare**; siga o **caminho de retenção** até quem segura a referência (coleção estática, listener, timer, closure, recurso não fechado); corrija, e confirme com um **teste de longa duração (soak)** em que a curva estabiliza. Reiniciar o processo é paliativo, não correção.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Confirme que é um vazamento", "Memória (RSS/heap) que sobe de forma contínua e **não volta depois do GC**, nem com a carga baixa: um dente de serra com o piso subindo. Descarte crescimento legítimo (cache, aquecimento), fragmentação e heap grande por configuração."],
        ["Reproduza e isole", "Teste de carga em ambiente controlado. Faça bissecção: qual endpoint, qual versão do deploy, qual funcionalidade faz a curva subir?"],
        ["Capture evidência no tempo", "Tire **heap snapshots** em momentos diferentes (T0, T1, T2), com a mesma carga no meio, e compare: o que cresceu?"],
        ["Descubra quem segura a referência", "Veja o tipo de objeto que cresce e o caminho de retenção (retainers / dominator tree) até uma raiz: um mapa estático, um listener, um timer…"],
        ["Corrija a causa", "Limite coleções (LRU, TTL, `WeakMap`/`WeakRef`), remova listeners e timers, feche streams e conexões em `finally`, use pools."],
        ["Verifique", "Repita o teste de longa duração (soak): a curva deve estabilizar."],
        ["Previna", "Alertas de memória e de reinícios por OOM, limites de memória no contêiner, soak test antes de releases importantes. Reiniciar periodicamente é paliativo."]
      ] },
      { t: "tb", ti: "Causas mais comuns", h: ["Causa", "Exemplo"], r: [
        ["Coleção global sem limite", "Cache em `Map` sem TTL; lista de “últimos pedidos” que só cresce"],
        ["Listeners e assinaturas não removidos", "`emitter.on(...)` a cada requisição, sem `off`"],
        ["Timers e intervals esquecidos", "`setInterval` que referencia objetos grandes"],
        ["Closures que capturam demais", "Callback que segura a resposta HTTP inteira"],
        ["Recursos não fechados", "Conexões, streams, arquivos, cursores"],
        ["Memória fora do heap", "Buffers nativos, bibliotecas em C"],
        ["Sessões e filas sem expiração", "Acumulam por usuário"]
      ] },
      { t: "tb", ti: "Ferramentas por plataforma", h: ["Plataforma", "Como capturar e analisar"], r: [
        ["Node.js", "`node --inspect` + Chrome DevTools (aba Memory), `v8.writeHeapSnapshot()`, clinic.js"],
        ["Java / JVM", "`jcmd <pid> GC.heap_dump`, Eclipse MAT, VisualVM, JFR"],
        ["Python", "`tracemalloc`, `objgraph`, memray"],
        ["Go", "`pprof` (`/debug/pprof/heap`)"],
        [".NET", "`dotnet-gcdump`, `dotnet-dump`, dotMemory"],
        ["Memória nativa", "valgrind, heaptrack, perfil do jemalloc"]
      ] },
      { t: "tp", k: "warn", h: "Cuidado em produção", x: "Um heap dump pausa o processo e pode dobrar o uso de memória. Faça numa instância retirada do balanceador, nunca na que serve tráfego sem preparo." }
    ],
    traps: [
      "Reiniciar o serviço e dar o assunto por encerrado.",
      "Confundir uso alto com vazamento: o GC é preguiçoso e o heap cresce até o limite configurado.",
      "Um snapshot único não prova nada: compare ao menos dois.",
      "Procurar só no heap do runtime e ignorar a memória nativa.",
      "Deixar o OOMKill do contêiner mascarar o vazamento com reinícios."
    ],
    rc: [
      ["Qual sinal diferencia um vazamento de uso alto normal?", "A memória continua subindo depois dos ciclos de GC e não volta quando a carga cai, formando um dente de serra com o piso crescente."],
      ["Por que comparar dois heap snapshots em vez de olhar um só?", "Um snapshot mostra o que existe; a diferença entre dois mostra o que cresceu, que é o suspeito."]
    ]
  },
  en: {
    s: "Debugging a memory leak",
    q: "How do you debug a memory leak in a backend application?",
    why: "Debugging is an investigative procedure: confirm the symptom, isolate, gather evidence, find who holds the reference, fix and verify. The order avoids the classic mistake of changing code before proving the cause.",
    one: "Confirm memory **keeps rising and does not come back after GC**; isolate the endpoint or version responsible; take **heap snapshots at different times and diff them**; follow the **retention path** to whoever holds the reference (static collection, listener, timer, closure, unclosed resource); fix it, and confirm with a **long-running (soak) test** where the curve flattens. Restarting the process is a stopgap, not a fix.",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Confirm it is a leak", "Memory (RSS/heap) that rises continuously and **does not return after GC**, even with low load: a sawtooth whose floor keeps rising. Rule out legitimate growth (cache, warm-up), fragmentation and a large heap by configuration."],
        ["Reproduce and isolate", "Load test in a controlled environment. Bisect: which endpoint, which deploy version, which feature makes the curve climb?"],
        ["Capture evidence over time", "Take **heap snapshots** at different moments (T0, T1, T2), with the same load in between, and diff them: what grew?"],
        ["Find who holds the reference", "Look at the growing object type and the retention path (retainers / dominator tree) to a root: a static map, a listener, a timer…"],
        ["Fix the cause", "Bound collections (LRU, TTL, `WeakMap`/`WeakRef`), remove listeners and timers, close streams and connections in `finally`, use pools."],
        ["Verify", "Repeat the long-running (soak) test: the curve should flatten."],
        ["Prevent", "Memory and OOM-restart alerts, container memory limits, a soak test before major releases. Periodic restarts are a stopgap."]
      ] },
      { t: "tb", ti: "Most common causes", h: ["Cause", "Example"], r: [
        ["Unbounded global collection", "Cache in a `Map` without TTL; a “recent orders” list that only grows"],
        ["Listeners and subscriptions not removed", "`emitter.on(...)` on every request, with no `off`"],
        ["Forgotten timers and intervals", "A `setInterval` referencing large objects"],
        ["Closures capturing too much", "A callback holding the entire HTTP response"],
        ["Unclosed resources", "Connections, streams, files, cursors"],
        ["Off-heap memory", "Native buffers, C libraries"],
        ["Sessions and queues without expiry", "They accumulate per user"]
      ] },
      { t: "tb", ti: "Tools by platform", h: ["Platform", "How to capture and analyze"], r: [
        ["Node.js", "`node --inspect` + Chrome DevTools (Memory tab), `v8.writeHeapSnapshot()`, clinic.js"],
        ["Java / JVM", "`jcmd <pid> GC.heap_dump`, Eclipse MAT, VisualVM, JFR"],
        ["Python", "`tracemalloc`, `objgraph`, memray"],
        ["Go", "`pprof` (`/debug/pprof/heap`)"],
        [".NET", "`dotnet-gcdump`, `dotnet-dump`, dotMemory"],
        ["Native memory", "valgrind, heaptrack, jemalloc profiling"]
      ] },
      { t: "tp", k: "warn", h: "Careful in production", x: "A heap dump pauses the process and can double memory use. Do it on an instance removed from the load balancer, never on one serving traffic without preparation." }
    ],
    traps: [
      "Restarting the service and calling it solved.",
      "Confusing high usage with a leak: GC is lazy and the heap grows up to the configured limit.",
      "A single snapshot proves nothing: compare at least two.",
      "Looking only at the runtime heap and ignoring native memory.",
      "Letting the container’s OOMKill mask the leak with restarts."
    ],
    rc: [
      ["Which signal separates a leak from normal high usage?", "Memory keeps rising after GC cycles and does not return when load drops, forming a sawtooth with a rising floor."],
      ["Why compare two heap snapshots instead of looking at just one?", "One snapshot shows what exists; the difference between two shows what grew, which is the suspect."]
    ]
  }
});

/* ============ 28 · Logging e monitoramento ============ */
window.QS.push({
  n: 28, g: "F", m: "playbook",
  pt: {
    s: "Logging e monitoramento",
    q: "Quais ferramentas e técnicas você usa para registrar e monitorar em um sistema backend?",
    why: "“Quais técnicas você usa” pede uma prática em camadas, na ordem em que se monta: registrar bem, medir, rastrear, alertar sobre o que o usuário sente e definir metas. Um playbook mostra a escada.",
    one: "Observabilidade tem três pilares: **logs estruturados** (o que aconteceu nesta requisição), **métricas** (o sistema está saudável?) e **traces distribuídos** (onde o tempo foi gasto entre serviços), ligados por um **trace/correlation id**. Alerte em **sintomas** (taxa de erro, latência p99, SLO), com runbook, e não em causas. Ferramentas típicas: OpenTelemetry, Prometheus + Grafana, ELK/Loki/Datadog, Jaeger/Tempo, Sentry.",
    b: [
      { t: "st", ti: "A escada", i: [
        ["Logs estruturados", "JSON, não texto livre. Campos fixos: `timestamp`, `level`, `service`, `version`, **`trace_id`/`request_id`**, `user_id` (ou hash), `message`. Níveis: ERROR (acionável), WARN, INFO (eventos de negócio), DEBUG (desligado em produção por padrão). Nunca registre senhas, tokens nem dados pessoais sem necessidade."],
        ["Coletar e centralizar", "Escreva em stdout; um agente (Fluent Bit, Vector, Filebeat) envia para uma busca central (OpenSearch/ELK, Loki, Datadog, CloudWatch). Defina retenção e amostragem por custo."],
        ["Métricas", "Séries temporais agregadas (Prometheus + Grafana, StatsD). Para serviços, **RED**: Rate, Errors, Duration. Para recursos, **USE**: Utilization, Saturation, Errors. Os 4 sinais de ouro: latência, tráfego, erros, saturação. Use percentis (p95, p99), não só média, e evite rótulos de alta cardinalidade (como `user_id`)."],
        ["Traces distribuídos", "OpenTelemetry + Jaeger/Tempo/Zipkin. Propague o trace id entre serviços (cabeçalho `traceparent`). Responde: em qual serviço o tempo foi gasto?"],
        ["Alertas", "Alerte em **sintomas** que o usuário sente (taxa de erro, latência p99, SLO queimando), não em causas (CPU 80%). Cada alerta precisa ser acionável e ter runbook; senão gera fadiga."],
        ["Saúde e sondas", "Endpoints de liveness e readiness, monitoramento sintético (sondas externas simulando o usuário), dashboards por serviço, rastreamento de erros (Sentry)."],
        ["SLI, SLO e orçamento de erro", "Defina o que é “bom” (ex.: 99,9% das requisições abaixo de 300 ms) e use o orçamento de erro para decidir entre lançar recurso novo e consertar confiabilidade."]
      ] },
      { t: "tb", ti: "Os três pilares", h: ["Pilar", "Pergunta que responde", "Custo", "Exemplo"], r: [
        ["Logs", "O que aconteceu nesta requisição?", "Alto (volume)", "`{\"level\":\"error\",\"trace_id\":\"ab12\",\"msg\":\"pagamento recusado\"}`"],
        ["Métricas", "O sistema está saudável? Qual a tendência?", "Baixo", "Latência p99 = 0,8 s; taxa de erro = 0,4%"],
        ["Traces", "Onde o tempo foi gasto entre os serviços?", "Médio (com amostragem)", "Requisição de 1,2 s: 900 ms no serviço de pagamento"]
      ] },
      { t: "cd", ti: "Um log útil", l: "json", c: `{
  "ts": "2026-11-03T14:02:11Z",
  "level": "error",
  "service": "checkout",
  "version": "1.42.0",
  "trace_id": "4bf92f3577b34da6",
  "user_id": "u_8f3a",
  "msg": "falha ao cobrar",
  "err": "gateway_timeout",
  "duration_ms": 3012
}` }
    ],
    traps: [
      "Log em texto livre que ninguém consegue consultar.",
      "Registrar dados pessoais, senhas ou tokens.",
      "Sem correlation id: é impossível seguir uma requisição entre serviços.",
      "Alertar em tudo (fadiga) ou em causas (CPU) em vez de sintomas.",
      "Rótulos de alta cardinalidade nas métricas derrubam o Prometheus; olhar só a média esconde o p99."
    ],
    rc: [
      ["Qual a diferença entre log, métrica e trace?", "Log é o registro detalhado de um evento; métrica é uma série numérica agregada no tempo; trace segue uma requisição por vários serviços mostrando onde o tempo foi gasto."],
      ["Por que alertar em sintomas e não em causas?", "O usuário só sente o sintoma (erros, lentidão). CPU alta pode não afetar ninguém, e um problema real pode ocorrer com CPU normal."]
    ]
  },
  en: {
    s: "Logging and monitoring",
    q: "What tools and techniques do you use for logging and monitoring in a backend system?",
    why: "“What techniques do you use” asks for a layered practice, in the order it is built: log well, measure, trace, alert on what the user feels and set goals. A playbook shows the ladder.",
    one: "Observability has three pillars: **structured logs** (what happened in this request), **metrics** (is the system healthy?) and **distributed traces** (where time was spent across services), tied together by a **trace/correlation id**. Alert on **symptoms** (error rate, p99 latency, SLO), with a runbook, not on causes. Typical tools: OpenTelemetry, Prometheus + Grafana, ELK/Loki/Datadog, Jaeger/Tempo, Sentry.",
    b: [
      { t: "st", ti: "The ladder", i: [
        ["Structured logs", "JSON, not free text. Fixed fields: `timestamp`, `level`, `service`, `version`, **`trace_id`/`request_id`**, `user_id` (or a hash), `message`. Levels: ERROR (actionable), WARN, INFO (business events), DEBUG (off in production by default). Never log passwords, tokens or personal data without need."],
        ["Collect and centralize", "Write to stdout; an agent (Fluent Bit, Vector, Filebeat) ships to a central search (OpenSearch/ELK, Loki, Datadog, CloudWatch). Set retention and sampling for cost."],
        ["Metrics", "Aggregated time series (Prometheus + Grafana, StatsD). For services, **RED**: Rate, Errors, Duration. For resources, **USE**: Utilization, Saturation, Errors. The 4 golden signals: latency, traffic, errors, saturation. Use percentiles (p95, p99), not only the average, and avoid high-cardinality labels (like `user_id`)."],
        ["Distributed traces", "OpenTelemetry + Jaeger/Tempo/Zipkin. Propagate the trace id across services (`traceparent` header). Answers: in which service was the time spent?"],
        ["Alerts", "Alert on **symptoms** the user feels (error rate, p99 latency, SLO burning), not on causes (CPU 80%). Every alert must be actionable and have a runbook; otherwise it causes fatigue."],
        ["Health and probes", "Liveness and readiness endpoints, synthetic monitoring (external probes simulating the user), per-service dashboards, error tracking (Sentry)."],
        ["SLI, SLO and error budget", "Define what “good” is (e.g. 99.9% of requests under 300 ms) and use the error budget to decide between shipping new features and fixing reliability."]
      ] },
      { t: "tb", ti: "The three pillars", h: ["Pillar", "Question it answers", "Cost", "Example"], r: [
        ["Logs", "What happened in this request?", "High (volume)", "`{\"level\":\"error\",\"trace_id\":\"ab12\",\"msg\":\"payment declined\"}`"],
        ["Metrics", "Is the system healthy? What is the trend?", "Low", "p99 latency = 0.8 s; error rate = 0.4%"],
        ["Traces", "Where was time spent across services?", "Medium (with sampling)", "A 1.2 s request: 900 ms in the payment service"]
      ] },
      { t: "cd", ti: "A useful log line", l: "json", c: `{
  "ts": "2026-11-03T14:02:11Z",
  "level": "error",
  "service": "checkout",
  "version": "1.42.0",
  "trace_id": "4bf92f3577b34da6",
  "user_id": "u_8f3a",
  "msg": "charge failed",
  "err": "gateway_timeout",
  "duration_ms": 3012
}` }
    ],
    traps: [
      "Free-text logs nobody can query.",
      "Logging personal data, passwords or tokens.",
      "No correlation id: it is impossible to follow a request across services.",
      "Alerting on everything (fatigue) or on causes (CPU) instead of symptoms.",
      "High-cardinality metric labels take Prometheus down; looking only at the average hides the p99."
    ],
    rc: [
      ["What is the difference between a log, a metric and a trace?", "A log is the detailed record of an event; a metric is a numeric series aggregated over time; a trace follows a request across services showing where time was spent."],
      ["Why alert on symptoms rather than causes?", "The user only feels the symptom (errors, slowness). High CPU may affect nobody, and a real problem can occur with normal CPU."]
    ]
  }
});

/* ============ 29 · Transações falhas em sistemas distribuídos ============ */
window.QS.push({
  n: 29, g: "F", m: "trace",
  pt: {
    s: "Transações falhas em sistemas distribuídos",
    q: "Como lidar com transações falhadas em um sistema distribuído?",
    why: "Num fluxo com vários serviços, a falha acontece num ponto específico e o que importa é o que se desfaz e quem avisa quem. Rastrear um pedido que falha no meio mostra o padrão (saga) e o que ele exige.",
    one: "Não há ACID global barato entre serviços independentes. Troca-se por uma **saga**: uma sequência de **transações locais**, cada uma com uma **ação compensatória**; se um passo falha, as compensações dos anteriores rodam em ordem inversa. Em volta dela: **retry com backoff + idempotência** para falhas transitórias, **outbox** para publicar eventos sem perder, **timeouts e reconciliação** para respostas perdidas e **DLQ** com intervenção humana para o resto.",
    b: [
      { t: "fl", ti: "Saga do pedido, caminho feliz", n: ["Order cria o pedido (PENDENTE)", "Payment cobra o cartão", "Inventory reserva o estoque", "Shipping agenda a entrega", "Order marca CONFIRMADO"] },
      { t: "st", ti: "Agora uma falha no meio (Inventory sem estoque)", i: [
        ["Inventory falha", "Publica `StockFailed` (ou responde erro ao orquestrador)."],
        ["Compensações em ordem inversa", "Payment recebe a notícia e **estorna** a cobrança; Order marca CANCELADO; o cliente é avisado."],
        ["Cada passo é uma transação local + um evento", "Cada serviço grava no próprio banco e publica o evento pelo padrão Outbox, para não haver “gravou mas não avisou”."],
        ["Cada compensação é idempotente e repetível", "Um estorno chamado duas vezes tem o mesmo efeito de uma; se falhar, tenta de novo até dar certo."]
      ] },
      { t: "tb", ti: "Tipos de falha e o remédio", h: ["Falha", "Remédio"], r: [
        ["Transitória (rede, timeout, 503)", "Retry com backoff + jitter, usando **chave de idempotência**"],
        ["Resposta perdida (o pagamento foi feito ou não?)", "Consultar o estado no serviço remoto e **reconciliar**; nunca assumir que timeout = falha"],
        ["Falha de negócio (sem estoque, cartão recusado)", "**Compensação** (desfazer semanticamente) ou rejeitar cedo"],
        ["Evento não publicado", "**Outbox**: gravar o evento na mesma transação local e publicar depois"],
        ["Serviço fora do ar", "Circuit breaker, fallback, fila com retentativa"],
        ["Saga travada no meio", "Timeouts, job de reconciliação, DLQ e painel para intervenção humana"]
      ] },
      { t: "tb", ti: "Commit em duas fases vs saga", h: ["", "2PC", "Saga"], r: [
        ["Consistência", "Forte (atômica)", "Eventual, com compensação"],
        ["Bloqueio", "Segura locks até todos votarem", "Sem locks distribuídos"],
        ["Disponibilidade", "Coordenador é ponto único; participante fora trava tudo", "Alta; avança por eventos"],
        ["Complexidade", "Protocolo pronto, porém frágil e raro entre serviços independentes", "Você escreve compensações e estados intermediários"],
        ["Quando", "Dentro de um mesmo banco ou cluster", "Entre serviços independentes (microserviços)"]
      ] },
      { t: "tp", k: "key", h: "Orquestração vs coreografia", x: "Na **orquestração**, um coordenador diz a cada serviço o que fazer e decide as compensações: o fluxo é fácil de ler. Na **coreografia**, cada serviço reage a eventos dos outros: não há ponto central, mas o fluxo fica espalhado e difícil de seguir." },
      { t: "tp", k: "warn", h: "Compensar nem sempre desfaz", x: "Um e-mail enviado não pode ser “desenviado”. A compensação é semântica (mandar outro e-mail avisando o cancelamento), e por isso é decisão de negócio." }
    ],
    traps: [
      "Dual write: gravar no banco e publicar na fila em duas operações separadas.",
      "Compensação que não é idempotente ou que falha sem retry.",
      "Tratar timeout como falha e repetir sem idempotência: cobra duas vezes.",
      "Não ter reconciliação periódica para sagas travadas.",
      "Esperar atomicidade de ACID entre serviços."
    ],
    rc: [
      ["O que é uma saga?", "Uma sequência de transações locais, cada uma com uma ação compensatória; se um passo falha, as compensações dos passos anteriores são executadas em ordem inversa."],
      ["Que problema o Outbox resolve numa saga?", "Garante que gravar o dado e publicar o evento do passo aconteçam de forma atômica, evitando um passo concluído sem que o próximo serviço saiba."]
    ]
  },
  en: {
    s: "Failed distributed transactions",
    q: "How do you handle failed transactions in a distributed system?",
    why: "In a multi-service flow, failure happens at a specific point and what matters is what gets undone and who tells whom. Tracing an order that fails midway shows the pattern (saga) and what it demands.",
    one: "There is no cheap global ACID across independent services. You trade it for a **saga**: a sequence of **local transactions**, each with a **compensating action**; if a step fails, the earlier steps’ compensations run in reverse order. Around it: **retry with backoff + idempotency** for transient failures, **outbox** to publish events without loss, **timeouts and reconciliation** for lost responses, and a **DLQ** with human intervention for the rest.",
    b: [
      { t: "fl", ti: "Order saga, happy path", n: ["Order creates the order (PENDING)", "Payment charges the card", "Inventory reserves stock", "Shipping schedules delivery", "Order marks CONFIRMED"] },
      { t: "st", ti: "Now a failure midway (Inventory out of stock)", i: [
        ["Inventory fails", "Publishes `StockFailed` (or returns an error to the orchestrator)."],
        ["Compensations in reverse order", "Payment receives the news and **refunds** the charge; Order marks CANCELLED; the customer is notified."],
        ["Each step is a local transaction + an event", "Each service writes to its own database and publishes the event through the Outbox pattern, so there is no “saved but did not tell”."],
        ["Each compensation is idempotent and repeatable", "A refund called twice has the same effect as once; if it fails, it retries until it succeeds."]
      ] },
      { t: "tb", ti: "Failure types and the remedy", h: ["Failure", "Remedy"], r: [
        ["Transient (network, timeout, 503)", "Retry with backoff + jitter, using an **idempotency key**"],
        ["Lost response (was the payment made or not?)", "Query the state on the remote service and **reconcile**; never assume timeout = failure"],
        ["Business failure (out of stock, card declined)", "**Compensation** (semantic undo) or reject early"],
        ["Event not published", "**Outbox**: write the event in the same local transaction and publish afterwards"],
        ["Service down", "Circuit breaker, fallback, queue with retry"],
        ["Saga stuck midway", "Timeouts, reconciliation job, DLQ and a dashboard for human intervention"]
      ] },
      { t: "tb", ti: "Two-phase commit vs saga", h: ["", "2PC", "Saga"], r: [
        ["Consistency", "Strong (atomic)", "Eventual, with compensation"],
        ["Blocking", "Holds locks until everyone votes", "No distributed locks"],
        ["Availability", "The coordinator is a single point; a participant down blocks everything", "High; progresses through events"],
        ["Complexity", "Ready-made protocol, but fragile and rare between independent services", "You write compensations and intermediate states"],
        ["When", "Inside one database or cluster", "Between independent services (microservices)"]
      ] },
      { t: "tp", k: "key", h: "Orchestration vs choreography", x: "In **orchestration**, a coordinator tells each service what to do and decides the compensations: the flow is easy to read. In **choreography**, each service reacts to the others’ events: there is no central point, but the flow is spread out and hard to follow." },
      { t: "tp", k: "warn", h: "Compensating does not always undo", x: "A sent email cannot be “unsent”. The compensation is semantic (send another email announcing the cancellation), so it is a business decision." }
    ],
    traps: [
      "Dual write: writing to the database and publishing to the queue as two separate operations.",
      "A compensation that is not idempotent or that fails without retry.",
      "Treating a timeout as failure and retrying without idempotency: it charges twice.",
      "No periodic reconciliation for stuck sagas.",
      "Expecting ACID atomicity across services."
    ],
    rc: [
      ["What is a saga?", "A sequence of local transactions, each with a compensating action; if a step fails, the earlier steps’ compensations run in reverse order."],
      ["Which problem does the Outbox solve in a saga?", "It makes writing the data and publishing the step’s event atomic, avoiding a completed step the next service never hears about."]
    ]
  }
});

/* ============ 30 · Idempotência ============ */
window.QS.push({
  n: 30, g: "F", m: "feynman",
  pt: {
    s: "Idempotência em APIs",
    q: "Explique o conceito de idempotência em APIs.",
    why: "Idempotência é uma propriedade simples de enunciar e fácil de errar. Uma analogia cotidiana (o botão do elevador) dá a intuição; o mecanismo real e o ponto onde a analogia falha (identificar a tentativa) trazem a engenharia.",
    one: "Uma operação é **idempotente** quando executá-la N vezes tem o **mesmo efeito no estado** que executá-la uma vez (a resposta pode variar). Importa porque redes falham de forma ambígua: o cliente dá timeout e não sabe se o servidor processou, então repete, e sem idempotência isso vira cobrança dupla. Garante-se com verbos naturalmente idempotentes (`PUT`, `DELETE`) ou com uma **chave de idempotência** enviada pelo cliente e guardada no servidor.",
    b: [
      { t: "an",
        s: "O botão do elevador para o andar 5: apertar uma vez ou dez dá o mesmo resultado, o elevador vai ao 5. Já o botão “mais um café” num pedido muda o resultado a cada clique. O primeiro é idempotente; o segundo, não.",
        k: "Formalmente, f(f(x)) = f(x). Em APIs: depois de uma ou de várias chamadas iguais, o estado do servidor é o mesmo. O problema real vem do **timeout ambíguo**: o cliente não sabe se o servidor recebeu e processou. Clientes, gateways e filas então **repetem** (entrega ao menos uma vez), e a repetição precisa ser segura. Uma resposta pode mudar (200 na primeira chamada, 409 ou 404 depois) sem quebrar a idempotência, que fala do **efeito**, não da resposta.",
        b: "No elevador, “andar 5” é a própria identidade do pedido. Em sistemas, o servidor não distingue uma repetição de uma intenção nova (comprar dois cafés iguais) a menos que o cliente envie uma **chave de idempotência** que identifique aquela tentativa." },
      { t: "tb", ti: "Idempotência dos verbos HTTP", h: ["Verbo", "Idempotente?", "Por quê"], r: [
        ["GET / HEAD / OPTIONS", "Sim (e seguros)", "Só leem"],
        ["PUT", "Sim", "Substitui o recurso pelo valor enviado; repetir deixa igual"],
        ["DELETE", "Sim", "Depois de apagar, apagar de novo mantém o estado (a resposta pode mudar de 204 para 404)"],
        ["POST", "Não", "Cada chamada pode criar um novo recurso"],
        ["PATCH", "Depende", "`{\"status\":\"pago\"}` é idempotente; `{\"saldo\":\"+10\"}` não é"]
      ] },
      { t: "cd", ti: "Padrão da chave de idempotência (estilo Stripe)", l: "http + sql", c: `POST /pagamentos
Idempotency-Key: 7d3f9c2e-...        (UUID gerado pelo CLIENTE, um por intencao)

-- no servidor, na mesma transacao do pagamento:
INSERT INTO idempotencia (usuario_id, chave, hash_corpo, status)
VALUES ($1, $2, $3, 'em_andamento')
ON CONFLICT (usuario_id, chave) DO NOTHING;

-- 1 linha inserida  -> primeira vez: processe, grave a resposta, COMMIT
-- 0 linhas inseridas -> repeticao: devolva a resposta ja guardada
--                       (corpo diferente com a mesma chave: 422; ainda em andamento: 409)` },
      { t: "st", ti: "Outras formas de tornar algo idempotente", i: [
        ["Operações naturalmente idempotentes", "`SET status = 'pago'` em vez de `saldo = saldo + 10`; `PUT` em vez de `POST`."],
        ["Restrições de unicidade", "`UNIQUE (pedido_id, tipo)` faz a segunda inserção falhar com segurança."],
        ["Upsert", "`INSERT ... ON CONFLICT DO UPDATE` converte “criar” em “garantir que existe”."],
        ["Deduplicação no consumidor", "Guarde os `message_id` já processados e ignore os repetidos."],
        ["Versão / lock otimista", "Aplique a alteração só se a versão esperada bater."]
      ] }
    ],
    traps: [
      "Gerar a chave no servidor: ela não identifica a repetição, precisa vir do cliente.",
      "Chave sem escopo de usuário ou sem comparar o corpo: a mesma chave com outro pedido deveria falhar.",
      "Não guardar a resposta original e devolver outra na repetição.",
      "Janela de retenção curta demais: a repetição chega depois que a chave expirou.",
      "Condição de corrida entre “consultar” e “inserir”: use `UNIQUE` e `ON CONFLICT`, não um `SELECT` antes."
    ],
    rc: [
      ["Por que DELETE é idempotente se a segunda chamada devolve 404?", "Idempotência é sobre o efeito no estado, não sobre a resposta: depois de uma ou de várias chamadas o recurso está igualmente apagado."],
      ["Quem deve gerar a chave de idempotência e por quê?", "O cliente, um valor único por intenção. Só ele sabe se duas requisições são a mesma tentativa repetida ou duas intenções diferentes."]
    ]
  },
  en: {
    s: "Idempotency in APIs",
    q: "Explain the concept of idempotency in APIs.",
    why: "Idempotency is easy to state and easy to get wrong. An everyday analogy (the elevator button) gives the intuition; the real mechanism and the point where the analogy fails (identifying the attempt) bring in the engineering.",
    one: "An operation is **idempotent** when running it N times has the **same effect on state** as running it once (the response may vary). It matters because networks fail ambiguously: the client times out without knowing whether the server processed it, so it retries, and without idempotency that becomes a double charge. It is ensured with naturally idempotent verbs (`PUT`, `DELETE`) or an **idempotency key** sent by the client and stored by the server.",
    b: [
      { t: "an",
        s: "The elevator button for floor 5: pressing it once or ten times gives the same result, the elevator goes to 5. The “one more coffee” button on an order changes the result with every click. The first is idempotent; the second is not.",
        k: "Formally, f(f(x)) = f(x). In APIs: after one or several identical calls, the server state is the same. The real problem comes from the **ambiguous timeout**: the client does not know whether the server received and processed it. Clients, gateways and queues then **retry** (at-least-once delivery), and the retry must be safe. A response may change (200 on the first call, 409 or 404 afterwards) without breaking idempotency, which is about the **effect**, not the response.",
        b: "In the elevator, “floor 5” is the request’s own identity. In systems, the server cannot tell a retry from a new intent (buying two identical coffees) unless the client sends an **idempotency key** that identifies that attempt." },
      { t: "tb", ti: "Idempotency of HTTP verbs", h: ["Verb", "Idempotent?", "Why"], r: [
        ["GET / HEAD / OPTIONS", "Yes (and safe)", "They only read"],
        ["PUT", "Yes", "Replaces the resource with the sent value; repeating leaves it the same"],
        ["DELETE", "Yes", "After deleting, deleting again keeps the state (the response may change from 204 to 404)"],
        ["POST", "No", "Each call may create a new resource"],
        ["PATCH", "Depends", "`{\"status\":\"paid\"}` is idempotent; `{\"balance\":\"+10\"}` is not"]
      ] },
      { t: "cd", ti: "The idempotency-key pattern (Stripe style)", l: "http + sql", c: `POST /payments
Idempotency-Key: 7d3f9c2e-...        (UUID generated by the CLIENT, one per intent)

-- on the server, in the same transaction as the payment:
INSERT INTO idempotency (user_id, key, body_hash, status)
VALUES ($1, $2, $3, 'in_progress')
ON CONFLICT (user_id, key) DO NOTHING;

-- 1 row inserted  -> first time: process, store the response, COMMIT
-- 0 rows inserted -> a repeat: return the stored response
--                    (different body with the same key: 422; still in progress: 409)` },
      { t: "st", ti: "Other ways to make something idempotent", i: [
        ["Naturally idempotent operations", "`SET status = 'paid'` instead of `balance = balance + 10`; `PUT` instead of `POST`."],
        ["Uniqueness constraints", "`UNIQUE (order_id, type)` makes the second insert fail safely."],
        ["Upsert", "`INSERT ... ON CONFLICT DO UPDATE` turns “create” into “ensure it exists”."],
        ["Consumer deduplication", "Store already-processed `message_id`s and ignore repeats."],
        ["Version / optimistic lock", "Apply the change only if the expected version matches."]
      ] }
    ],
    traps: [
      "Generating the key on the server: it does not identify the retry, it must come from the client.",
      "A key with no user scope or no body comparison: the same key with a different request should fail.",
      "Not storing the original response and returning a different one on the retry.",
      "A retention window that is too short: the retry arrives after the key expired.",
      "A race between “check” and “insert”: use `UNIQUE` and `ON CONFLICT`, not a prior `SELECT`."
    ],
    rc: [
      ["Why is DELETE idempotent if the second call returns 404?", "Idempotency is about the effect on state, not the response: after one or several calls the resource is equally deleted."],
      ["Who should generate the idempotency key and why?", "The client, a unique value per intent. Only the client knows whether two requests are the same attempt repeated or two different intents."]
    ]
  }
});
