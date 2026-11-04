/* Perguntas 1-10. Esquema: {n, g (módulo), m (método), pt|en: {s, q, why, one, b[blocos], traps[], rc[[pergunta, resposta]]}} */
window.QS = window.QS || [];

/* ============ 1 · Monolito vs microserviços ============ */
window.QS.push({
  n: 1, g: "A", m: "compare",
  pt: {
    s: "Monolito vs microserviços",
    q: "Qual é a diferença entre arquitetura monolítica e arquitetura de microserviços?",
    why: "É um “X vs Y”: a matriz mostra as diferenças lado a lado e a regra de decisão diz quando cada lado compensa, que é o que a entrevista realmente testa.",
    one: "Monolito é **uma única unidade implantável** com todos os módulos; microserviços são **vários serviços pequenos, com deploy e dados independentes**. Troca-se simplicidade operacional por autonomia de times e escala seletiva. Regra prática: comece com um **monolito modular** e só separe quando a dor (times se atropelando, escala muito desigual, deploys lentos) for real e medida.",
    b: [
      { t: "tb", h: ["Aspecto", "Monolito", "Microserviços"], r: [
        ["Deploy", "Um artefato; tudo sobe junto", "Cada serviço sobe sozinho, no seu ritmo"],
        ["Código e times", "Uma base de código; todos mexem nela", "Fronteiras por domínio; cada time é dono de um serviço"],
        ["Dados", "Um banco compartilhado; joins e transações ACID simples", "Um banco por serviço (idealmente); sem joins entre serviços"],
        ["Escala", "Replica a aplicação inteira, mesmo que só um módulo precise", "Escala só o serviço sob carga"],
        ["Comunicação", "Chamada de função em memória (rápida, não falha)", "Rede: HTTP/gRPC/mensageria (mais lenta, pode falhar)"],
        ["Falhas", "Um bug grave pode derrubar tudo", "Falha isolada, se houver timeout, retry e circuit breaker"],
        ["Consistência", "Uma transação resolve", "Consistência eventual, sagas, idempotência"],
        ["Custo operacional", "Baixo: um pipeline, um log, um debug", "Alto: orquestração, observabilidade distribuída, contratos versionados"],
        ["Melhor momento", "Produto novo, time pequeno, domínio ainda mudando", "Muitos times, perfis de escala distintos, domínio estável"]
      ] },
      { t: "tp", k: "key", h: "Regra de decisão", x: "Comece com um **monolito modular** (módulos com fronteiras claras dentro de um só deploy). Extraia um serviço quando houver motivo medido: times se atropelando nos deploys, uma parte que precisa escalar muito mais que o resto, ou requisitos de isolamento/tecnologia diferentes. A arquitetura acaba espelhando a organização (Lei de Conway): com 5 pessoas, 20 microserviços são custo, não benefício." },
      { t: "tp", k: "warn", h: "Monolito distribuído", x: "Serviços que só funcionam se implantados juntos, ou que dividem o mesmo banco, juntam o pior dos dois mundos: a latência e a complexidade de rede dos microserviços sem a independência que os justificaria." },
      { t: "tp", k: "tip", h: "A conta que o hype esconde", x: "Disponibilidades se multiplicam: 5 serviços com 99,9% chamados em cadeia dão 0,999⁵ ≈ 99,5%, cerca de 44 h/ano fora do ar contra 8,8 h de um único serviço." }
    ],
    traps: [
      "Escolher microserviços pelo hype (“a Netflix usa”) com um time de poucas pessoas.",
      "Dividir por camada técnica (um serviço “de banco”) em vez de por capacidade de negócio.",
      "Cadeias de chamadas síncronas entre serviços: latência e falhas se acumulam.",
      "Serviços que compartilham tabelas: acoplamento escondido que impede deploy independente."
    ],
    rc: [
      ["Por que 5 serviços a 99,9% chamados em cadeia não dão 99,9%?", "As disponibilidades se multiplicam: 0,999⁵ ≈ 99,5%, cerca de 44 horas de indisponibilidade por ano em vez de 8,8."],
      ["Quando você extrairia o primeiro serviço de um monolito?", "Quando houver dor medida: times bloqueando os deploys uns dos outros, uma parte com escala muito diferente, ou necessidade de isolar falha ou tecnologia. Não antes."]
    ]
  },
  en: {
    s: "Monolith vs microservices",
    q: "What is the difference between monolithic and microservices architecture?",
    why: "It is an “X vs Y” question: the matrix shows the differences side by side and the decision rule says when each side pays off, which is what an interview really tests.",
    one: "A monolith is **one deployable unit** holding every module; microservices are **many small services with independent deploys and data**. You trade operational simplicity for team autonomy and selective scaling. Rule of thumb: start with a **modular monolith** and split only when the pain (teams colliding, very uneven scaling, slow deploys) is real and measured.",
    b: [
      { t: "tb", h: ["Aspect", "Monolith", "Microservices"], r: [
        ["Deploy", "One artifact; everything ships together", "Each service ships alone, at its own pace"],
        ["Code and teams", "One codebase; everyone edits it", "Domain boundaries; each team owns a service"],
        ["Data", "One shared database; joins and simple ACID transactions", "A database per service (ideally); no cross-service joins"],
        ["Scaling", "Replicates the whole app even if one module needs it", "Scales only the service under load"],
        ["Communication", "In-memory function call (fast, cannot fail)", "Network: HTTP/gRPC/messaging (slower, can fail)"],
        ["Failures", "One serious bug can take everything down", "Isolated failure, if timeouts, retries and circuit breakers exist"],
        ["Consistency", "One transaction solves it", "Eventual consistency, sagas, idempotency"],
        ["Operational cost", "Low: one pipeline, one log, one debugger", "High: orchestration, distributed observability, versioned contracts"],
        ["Best moment", "New product, small team, domain still changing", "Many teams, distinct scaling profiles, stable domain"]
      ] },
      { t: "tp", k: "key", h: "Decision rule", x: "Start with a **modular monolith** (modules with clear boundaries inside one deploy). Extract a service when there is a measured reason: teams colliding on deploys, one part that must scale far more than the rest, or different isolation/technology needs. Architecture ends up mirroring the organization (Conway’s Law): with 5 people, 20 microservices are a cost, not a benefit." },
      { t: "tp", k: "warn", h: "Distributed monolith", x: "Services that only work when deployed together, or that share one database, combine the worst of both worlds: the latency and network complexity of microservices without the independence that would justify them." },
      { t: "tp", k: "tip", h: "The math hype hides", x: "Availabilities multiply: 5 services at 99.9% called in a chain give 0.999⁵ ≈ 99.5%, about 44 h/year of downtime versus 8.8 h for a single service." }
    ],
    traps: [
      "Choosing microservices because of hype (“Netflix does it”) with a handful of engineers.",
      "Splitting by technical layer (a “database service”) instead of by business capability.",
      "Chains of synchronous calls between services: latency and failures accumulate.",
      "Services that share tables: hidden coupling that blocks independent deploys."
    ],
    rc: [
      ["Why do 5 services at 99.9% called in a chain not give 99.9%?", "Availabilities multiply: 0.999⁵ ≈ 99.5%, roughly 44 hours of downtime a year instead of 8.8."],
      ["When would you extract the first service from a monolith?", "When there is measured pain: teams blocking each other’s deploys, one part with very different scaling, or a need to isolate failure or technology. Not before."]
    ]
  }
});

/* ============ 2 · Síncrono vs assíncrono ============ */
window.QS.push({
  n: 2, g: "A", m: "feynman",
  pt: {
    s: "Síncrono vs assíncrono",
    q: "Explique as diferenças entre processamento síncrono e assíncrono em um sistema backend.",
    why: "É um conceito abstrato que se resolve com intuição: uma analogia do dia a dia (fila de balcão vs comanda com senha), depois o mecanismo real e o ponto em que a analogia deixa de valer.",
    one: "**Síncrono**: quem chama fica bloqueado esperando a resposta. **Assíncrono**: quem chama delega o trabalho, recebe um recibo e segue; o resultado chega depois (callback, polling, webhook, evento). Assíncrono não deixa a tarefa mais rápida: libera quem esperava e desacopla os dois lados no tempo, ao custo de tratar falha, duplicata e status.",
    b: [
      { t: "an",
        s: "Padaria com fila no balcão (síncrono): você pede e fica parado até o atendente embalar o pão, só então vai embora. Restaurante com comanda e senha (assíncrono): você faz o pedido, recebe uma senha, senta e é chamado quando fica pronto. Enquanto isso o garçom atende outras mesas.",
        k: "No síncrono a thread ou conexão do chamador fica presa até a resposta chegar; é simples de raciocinar e o erro volta direto. No assíncrono o chamador recebe só uma confirmação (um ID, `202 Accepted`) e o trabalho acontece depois, em outro lugar (worker, fila, event loop). A palavra tem três usos: (1) **I/O não bloqueante** (`async/await`, event loop): a thread atende outras tarefas enquanto espera disco ou rede; (2) **processamento assíncrono por fila**: o trabalho sai do caminho da requisição; (3) **API assíncrona**: `202` + consulta de status ou webhook.",
        b: "No restaurante a comanda nunca some nem é entregue duas vezes. Em sistemas a mensagem pode se perder, chegar duplicada ou fora de ordem, e o cliente pode ir embora antes do prato ficar pronto. Por isso o assíncrono exige retentativas, idempotência e um jeito de consultar o status." },
      { t: "fl", ti: "Exemplo assíncrono: exportar um relatório", n: ["Cliente pede o relatório", "API valida, grava o pedido e enfileira", "API responde `202` + `jobId` em milissegundos", "Worker gera o arquivo (30 s)", "Cliente consulta `/jobs/{id}` ou recebe um webhook"] },
      { t: "tb", ti: "Quando usar cada um", h: ["", "Síncrono", "Assíncrono"], r: [
        ["Use quando", "O usuário precisa do resultado agora e a operação é rápida (login, consulta por ID, validação)", "A operação é lenta, pode falhar e tentar de novo, ou não precisa de resposta imediata (e-mail, relatório, vídeo, integração externa)"],
        ["Ganha", "Simplicidade, erro imediato, fluxo linear", "Resiliência a picos, desacoplamento, melhor uso de recursos"],
        ["Paga", "Latência somada, falha em cascata, threads presas", "Complexidade: status, retentativas, duplicatas, ordem, observabilidade"]
      ] }
    ],
    traps: [
      "Achar que assíncrono é sinônimo de paralelo ou multithread: um event loop de uma thread só já é assíncrono.",
      "Achar que deixa a tarefa mais rápida: o trabalho dura o mesmo, quem muda é quem espera.",
      "Trocar síncrono por assíncrono sem tratar falha parcial, duplicata e a pergunta “e se o worker cair no meio?”."
    ],
    rc: [
      ["Em uma frase: qual é o ganho real do assíncrono?", "Quem chamou não fica bloqueado esperando e os dois lados deixam de depender um do outro no mesmo instante. A tarefa em si não ficou mais rápida."],
      ["Qual resposta HTTP uma API assíncrona costuma dar ao aceitar um trabalho?", "`202 Accepted`, com um identificador do trabalho e um endereço de status (ou um webhook para avisar no fim)."]
    ]
  },
  en: {
    s: "Sync vs async",
    q: "Explain the differences between synchronous and asynchronous processing in a backend system.",
    why: "It is an abstract concept that gets solved with intuition: an everyday analogy (counter queue vs ticket with a buzzer), then the real mechanism and the point where the analogy stops holding.",
    one: "**Synchronous**: the caller blocks until the answer arrives. **Asynchronous**: the caller hands the work off, gets a receipt and moves on; the result arrives later (callback, polling, webhook, event). Async does not make the task faster: it frees whoever was waiting and decouples both sides in time, at the cost of handling failure, duplicates and status.",
    b: [
      { t: "an",
        s: "A bakery with a counter queue (sync): you order and stand there until the clerk wraps the bread, then you leave. A restaurant with an order ticket and a buzzer (async): you order, get a buzzer, sit down and are called when it is ready. Meanwhile the waiter serves other tables.",
        k: "In sync, the caller’s thread or connection is held until the response arrives; it is easy to reason about and errors come straight back. In async the caller gets only an acknowledgment (an ID, `202 Accepted`) and the work happens later, elsewhere (worker, queue, event loop). The word has three uses: (1) **non-blocking I/O** (`async/await`, event loop): the thread serves other tasks while waiting on disk or network; (2) **queue-based async processing**: the work leaves the request path; (3) **async API**: `202` + status polling or a webhook.",
        b: "At the restaurant the ticket never vanishes and is never delivered twice. In systems a message can be lost, arrive duplicated or out of order, and the customer can leave before the dish is ready. That is why async needs retries, idempotency and a way to check status." },
      { t: "fl", ti: "Async example: exporting a report", n: ["Client asks for the report", "API validates, stores the request and enqueues it", "API replies `202` + `jobId` in milliseconds", "Worker builds the file (30 s)", "Client polls `/jobs/{id}` or receives a webhook"] },
      { t: "tb", ti: "When to use each", h: ["", "Synchronous", "Asynchronous"], r: [
        ["Use when", "The user needs the result now and the operation is fast (login, lookup by ID, validation)", "The operation is slow, may fail and retry, or does not need an immediate answer (email, report, video, external integration)"],
        ["Gains", "Simplicity, immediate errors, linear flow", "Resilience to spikes, decoupling, better resource usage"],
        ["Pays", "Summed latency, cascading failure, held threads", "Complexity: status, retries, duplicates, ordering, observability"]
      ] }
    ],
    traps: [
      "Thinking async means parallel or multithreaded: a single-threaded event loop is already async.",
      "Thinking it makes the task faster: the work takes the same time, what changes is who waits.",
      "Swapping sync for async without handling partial failure, duplicates and the question “what if the worker dies midway?”."
    ],
    rc: [
      ["In one sentence: what is the real gain of async?", "The caller is not blocked waiting, and both sides stop depending on each other at the same instant. The task itself did not get faster."],
      ["Which HTTP response does an async API usually return when it accepts a job?", "`202 Accepted`, with a job identifier and a status address (or a webhook to notify at the end)."]
    ]
  }
});

/* ============ 3 · REST vs GraphQL ============ */
window.QS.push({
  n: 3, g: "A", m: "compare",
  pt: {
    s: "REST vs GraphQL",
    q: "O que são APIs RESTful e como elas diferem do GraphQL?",
    why: "É um “X vs Y”: a matriz isola as diferenças e a regra de decisão diz em que cenário cada estilo é a escolha mais barata.",
    one: "**REST** modela a API como recursos com URLs e verbos HTTP (`GET /orders/42`), usa status codes e o cache do próprio HTTP. **GraphQL** expõe um único endpoint com esquema tipado, e o cliente descreve exatamente os campos que quer, evitando over e under-fetching. REST é simples, cacheável e universal; GraphQL brilha com vários clientes e dados em grafo, mas exige cuidado com custo de queries, N+1 e cache.",
    b: [
      { t: "tp", k: "key", h: "O que torna uma API “RESTful”", x: "Seguir as restrições de REST: cliente-servidor, **stateless** (cada requisição carrega tudo de que precisa), cacheável, interface uniforme (recursos identificados por URL, manipulados com verbos HTTP de semântica correta) e em camadas. Devolver JSON por HTTP, sozinho, não torna uma API RESTful." },
      { t: "cd", ti: "O mesmo dado nos dois estilos", l: "REST vs GraphQL", c: `# REST: 2 chamadas, campos que talvez você não use
GET /users/42
GET /users/42/orders?limit=3

# GraphQL: 1 chamada, só os campos pedidos
POST /graphql
query {
  user(id: 42) {
    name
    orders(first: 3) { id total }
  }
}` },
      { t: "tb", h: ["Aspecto", "REST", "GraphQL"], r: [
        ["Endpoint", "Vários, um por recurso", "Um só (`/graphql`)"],
        ["Quem define a resposta", "O servidor (formato fixo por endpoint)", "O cliente (escolhe os campos)"],
        ["Over/under-fetching", "Comum: sobram campos ou faltam chamadas", "Evitado por desenho"],
        ["Cache", "Nativo do HTTP (CDN, ETag, `Cache-Control`)", "Difícil: tudo é `POST` num URL só; exige cache por ID ou queries persistidas"],
        ["Contrato e tipos", "Opcional (OpenAPI)", "Esquema tipado obrigatório, com introspecção"],
        ["Versionamento", "`/v1`, `/v2` ou negociação", "Evolui o esquema; campos são depreciados"],
        ["Riscos", "Muitas viagens de rede", "Queries caras ou profundas (DoS), N+1 nos resolvers, autorização por campo"],
        ["Tempo real", "SSE/WebSocket à parte", "Subscriptions"],
        ["Brilha em", "APIs públicas, CRUD, integrações, cache agressivo", "Muitas telas e clientes (web, mobile), agregação de várias fontes"]
      ] },
      { t: "tp", k: "key", h: "Regra de decisão", x: "API pública ou de integração simples, com cache importante: REST. Front-ends diferentes (web, iOS, Android) pedindo recortes distintos dos mesmos dados, ou um gateway agregando vários serviços: GraphQL (ou um BFF). Muitas empresas usam os dois." }
    ],
    traps: [
      "Chamar de REST uma API com `POST /getUser` que devolve 200 para tudo.",
      "GraphQL sem limite de profundidade, custo e paginação: uma única query pode derrubar o servidor.",
      "N+1 nos resolvers (uma consulta ao banco por item); a correção clássica é batching com DataLoader.",
      "Achar que GraphQL substitui o REST sempre: ele troca problemas, não os elimina."
    ],
    rc: [
      ["O que é over-fetching e como o GraphQL o evita?", "Receber mais campos do que a tela precisa. No GraphQL o cliente lista os campos que quer, então a resposta traz só eles."],
      ["Por que cache é mais difícil em GraphQL?", "Porque as consultas costumam ser `POST` para um único URL, então o cache HTTP/CDN não distingue uma query da outra; é preciso cache por ID de entidade ou queries persistidas."]
    ]
  },
  en: {
    s: "REST vs GraphQL",
    q: "What are RESTful APIs and how do they differ from GraphQL?",
    why: "It is an “X vs Y” question: the matrix isolates the differences and the decision rule says in which scenario each style is the cheapest choice.",
    one: "**REST** models the API as resources with URLs and HTTP verbs (`GET /orders/42`), uses status codes and HTTP’s own caching. **GraphQL** exposes a single endpoint with a typed schema, and the client describes exactly the fields it wants, avoiding over- and under-fetching. REST is simple, cacheable and universal; GraphQL shines with many clients and graph-shaped data, but needs care with query cost, N+1 and caching.",
    b: [
      { t: "tp", k: "key", h: "What makes an API “RESTful”", x: "Following REST’s constraints: client-server, **stateless** (each request carries everything it needs), cacheable, uniform interface (resources identified by URL, manipulated with HTTP verbs of correct semantics) and layered. Returning JSON over HTTP alone does not make an API RESTful." },
      { t: "cd", ti: "The same data in both styles", l: "REST vs GraphQL", c: `# REST: 2 calls, fields you may not use
GET /users/42
GET /users/42/orders?limit=3

# GraphQL: 1 call, only the fields asked for
POST /graphql
query {
  user(id: 42) {
    name
    orders(first: 3) { id total }
  }
}` },
      { t: "tb", h: ["Aspect", "REST", "GraphQL"], r: [
        ["Endpoint", "Many, one per resource", "A single one (`/graphql`)"],
        ["Who shapes the response", "The server (fixed format per endpoint)", "The client (picks the fields)"],
        ["Over/under-fetching", "Common: extra fields or missing calls", "Avoided by design"],
        ["Caching", "Native to HTTP (CDN, ETag, `Cache-Control`)", "Hard: everything is `POST` to one URL; needs per-ID caching or persisted queries"],
        ["Contract and types", "Optional (OpenAPI)", "Mandatory typed schema with introspection"],
        ["Versioning", "`/v1`, `/v2` or negotiation", "Evolve the schema; deprecate fields"],
        ["Risks", "Many network round trips", "Expensive or deep queries (DoS), N+1 in resolvers, per-field authorization"],
        ["Real time", "SSE/WebSocket on the side", "Subscriptions"],
        ["Shines at", "Public APIs, CRUD, integrations, aggressive caching", "Many screens and clients (web, mobile), aggregating several sources"]
      ] },
      { t: "tp", k: "key", h: "Decision rule", x: "Public or simple integration API where caching matters: REST. Different front ends (web, iOS, Android) asking for different slices of the same data, or a gateway aggregating several services: GraphQL (or a BFF). Many companies use both." }
    ],
    traps: [
      "Calling an API REST when it has `POST /getUser` and returns 200 for everything.",
      "GraphQL without depth, cost and pagination limits: a single query can take the server down.",
      "N+1 in resolvers (one database query per item); the classic fix is batching with DataLoader.",
      "Believing GraphQL always replaces REST: it trades problems, it does not remove them."
    ],
    rc: [
      ["What is over-fetching and how does GraphQL avoid it?", "Receiving more fields than the screen needs. In GraphQL the client lists the fields it wants, so the response carries only those."],
      ["Why is caching harder in GraphQL?", "Because queries are usually `POST` to a single URL, so HTTP/CDN caches cannot tell one query from another; you need per-entity ID caching or persisted queries."]
    ]
  }
});

/* ============ 4 · Arquitetura orientada a eventos ============ */
window.QS.push({
  n: 4, g: "A", m: "trace",
  pt: {
    s: "Orientada a eventos",
    q: "O que é uma arquitetura orientada a eventos? Você pode dar um exemplo?",
    why: "Orientada a eventos é um fluxo entre vários atores. Seguir um único evento do começo ao fim, inclusive no caminho de falha, mostra o que o estilo entrega e o que ele cobra.",
    one: "É um estilo em que os componentes se comunicam publicando e consumindo **eventos** (fatos que já aconteceram, como `PedidoCriado`) através de um broker, sem que o produtor conheça ou espere os consumidores. Ganha-se baixo acoplamento, extensibilidade e absorção de picos; paga-se com consistência eventual, depuração mais difícil e a necessidade de idempotência.",
    b: [
      { t: "fl", ti: "Exemplo: um pedido em e-commerce", n: ["Order Service grava o pedido (PENDENTE) e publica `OrderPlaced`", "O broker (Kafka, RabbitMQ, SNS/SQS) entrega uma cópia a cada assinante", "Payment cobra e publica `PaymentApproved`", "Inventory reserva o estoque e publica `StockReserved`", "Shipping gera a etiqueta; Email confirma; Analytics registra"], c: "O Order Service não sabe quantos consumidores existem. Para criar um programa de fidelidade basta um novo assinante de `OrderPlaced`, sem tocar no código do pedido." },
      { t: "st", ti: "Agora o caminho de falha", i: [
        ["Payment recusa o cartão", "Publica `PaymentFailed` em vez de `PaymentApproved`."],
        ["Quem escutava reage sozinho", "Order Service marca o pedido como CANCELADO; Inventory libera qualquer reserva; Email avisa o cliente."],
        ["O consumidor cai no meio", "A mensagem não é confirmada e volta para a fila (entrega ao menos uma vez). Por isso o consumidor precisa ser idempotente."],
        ["Mensagem que sempre falha", "Depois de N tentativas vai para uma fila de mensagens mortas (DLQ) para análise."]
      ] },
      { t: "tb", ti: "Três jeitos de usar eventos", h: ["Padrão", "O evento carrega", "Exemplo"], r: [
        ["Notificação", "Só o aviso e um ID; o consumidor busca o resto", "`PedidoCriado {id}`"],
        ["Estado transportado", "Os dados de que o consumidor precisa, sem perguntar de volta", "`PedidoCriado {id, itens, total, endereço}`"],
        ["Event sourcing", "O histórico de eventos é a fonte da verdade; o estado é derivado", "Conta bancária = soma dos lançamentos"]
      ] },
      { t: "tp", k: "warn", h: "Evento não é comando", x: "Um **evento** diz o que aconteceu (`PedidoPago`) e pode ter zero ou muitos ouvintes. Um **comando** pede uma ação (`CobrarPedido`) e tem um destinatário. Misturar os dois recria o acoplamento que se queria evitar." },
      { t: "tp", k: "tip", h: "Publicar com segurança: Outbox", x: "Gravar no banco e publicar na fila são duas operações; se uma falha, os dois ficam inconsistentes. O padrão **Outbox** grava o evento numa tabela na mesma transação do dado, e um processo à parte o publica." }
    ],
    traps: [
      "Consumidor não idempotente: a mesma mensagem processada duas vezes cobra o cliente duas vezes.",
      "Sem DLQ e sem monitorar o atraso da fila: mensagens problemáticas travam ou somem em silêncio.",
      "Esperar ordem global: a ordem só costuma ser garantida dentro de uma partição ou chave.",
      "Eventos sem esquema versionado: mudar um campo quebra consumidores que você nem sabe que existem."
    ],
    rc: [
      ["Qual a diferença entre evento e comando?", "Evento é um fato passado, sem destinatário fixo; comando é um pedido de ação para alguém específico."],
      ["Que problema o padrão Outbox resolve?", "O dual write: gravar o dado e publicar o evento de forma atômica, gravando o evento na mesma transação do banco e publicando depois."]
    ]
  },
  en: {
    s: "Event-driven",
    q: "What is an event-driven architecture? Can you give an example?",
    why: "Event-driven is a flow across several actors. Following a single event from start to finish, including the failure path, shows what the style delivers and what it costs.",
    one: "It is a style where components communicate by publishing and consuming **events** (facts that already happened, like `OrderPlaced`) through a broker, without the producer knowing or waiting for the consumers. You gain loose coupling, extensibility and spike absorption; you pay with eventual consistency, harder debugging and the need for idempotency.",
    b: [
      { t: "fl", ti: "Example: an order in e-commerce", n: ["Order Service stores the order (PENDING) and publishes `OrderPlaced`", "The broker (Kafka, RabbitMQ, SNS/SQS) delivers a copy to each subscriber", "Payment charges and publishes `PaymentApproved`", "Inventory reserves stock and publishes `StockReserved`", "Shipping creates the label; Email confirms; Analytics records"], c: "Order Service does not know how many consumers exist. A loyalty program only needs a new subscriber to `OrderPlaced`, with no change to the order code." },
      { t: "st", ti: "Now the failure path", i: [
        ["Payment declines the card", "It publishes `PaymentFailed` instead of `PaymentApproved`."],
        ["Listeners react on their own", "Order Service marks the order CANCELLED; Inventory releases any reservation; Email notifies the customer."],
        ["A consumer dies midway", "The message is not acknowledged and returns to the queue (at-least-once delivery). Hence consumers must be idempotent."],
        ["A message that always fails", "After N attempts it goes to a dead-letter queue (DLQ) for analysis."]
      ] },
      { t: "tb", ti: "Three ways to use events", h: ["Pattern", "The event carries", "Example"], r: [
        ["Notification", "Just the notice and an ID; the consumer fetches the rest", "`OrderCreated {id}`"],
        ["State transfer", "The data the consumer needs, with no call back", "`OrderCreated {id, items, total, address}`"],
        ["Event sourcing", "The event history is the source of truth; state is derived", "Bank account = sum of entries"]
      ] },
      { t: "tp", k: "warn", h: "An event is not a command", x: "An **event** says what happened (`OrderPaid`) and may have zero or many listeners. A **command** requests an action (`ChargeOrder`) and has one recipient. Mixing them recreates the coupling you meant to avoid." },
      { t: "tp", k: "tip", h: "Publishing safely: Outbox", x: "Writing to the database and publishing to the queue are two operations; if one fails they diverge. The **Outbox** pattern writes the event to a table in the same transaction as the data, and a separate process publishes it." }
    ],
    traps: [
      "A non-idempotent consumer: the same message processed twice charges the customer twice.",
      "No DLQ and no queue-lag monitoring: problem messages block or vanish silently.",
      "Expecting global ordering: order is usually guaranteed only within a partition or key.",
      "Events without a versioned schema: changing a field breaks consumers you do not even know about."
    ],
    rc: [
      ["What is the difference between an event and a command?", "An event is a past fact with no fixed recipient; a command is a request for action addressed to someone specific."],
      ["Which problem does the Outbox pattern solve?", "The dual write: storing the data and publishing the event atomically, by writing the event in the same database transaction and publishing it afterwards."]
    ]
  }
});

/* ============ 5 · Trabalhos em segundo plano ============ */
window.QS.push({
  n: 5, g: "A", m: "playbook",
  pt: {
    s: "Trabalhos em segundo plano",
    q: "Como você lida com trabalhos de fundo em um sistema backend?",
    why: "“Como você lida…” pede um procedimento: a ordem em que você decide, enfileira, executa, repete e observa. Um playbook mostra cada decisão e o sinal de cada etapa.",
    one: "Tire do caminho da requisição o que é lento ou não precisa de resposta imediata: a API **enfileira** o trabalho e responde rápido, e **workers** separados o consomem. Como a entrega é “ao menos uma vez”, o job precisa ser **idempotente**, ter **retentativas com backoff**, **DLQ** para o que esgotar tentativas e **métricas** (tamanho e idade da fila, taxa de falha).",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Decida o que vai para o fundo", "Tarefas lentas (mais de ~1 s), que podem esperar ou falhar e tentar de novo: e-mails, relatórios, imagens, webhooks, integrações. O que o usuário precisa ver agora continua síncrono."],
        ["Enfileire e responda", "A API grava o pedido, publica o job numa fila (SQS, RabbitMQ, Redis/BullMQ, Sidekiq, Celery; ou uma tabela no Postgres com `FOR UPDATE SKIP LOCKED` em escala menor) e devolve `202` com um ID."],
        ["Workers separados do web", "Processos próprios, escalados de forma independente, com limite de concorrência para não esmagar o banco ou a API externa."],
        ["Garanta idempotência", "A fila entrega ao menos uma vez, então duplicatas existem. Use uma chave do job e verifique se já foi feito (`UNIQUE`, tabela de dedupe, operações naturalmente idempotentes)."],
        ["Retentativas com backoff e jitter", "Erro transitório (rede, 503): tente de novo em 1 s, 2 s, 4 s… mais um tempo aleatório, com teto. Erro permanente (dado inválido): não repita."],
        ["DLQ e alerta", "O que esgotou as tentativas vai para uma fila de mensagens mortas, com alerta e um jeito de reprocessar depois de corrigir a causa."],
        ["Jobs longos e agendados", "Divida em passos com checkpoint; use timeout de visibilidade ou heartbeat. Em cron, garanta que só uma instância dispare (lock de líder), senão roda duplicado."],
        ["Observe e desligue com elegância", "Profundidade da fila, **idade da mensagem mais antiga**, duração, taxa de falha, trace ID da requisição original. No shutdown, termine o job atual antes de morrer."]
      ] },
      { t: "cd", l: "worker (pseudocódigo)", c: `job = fila.receber()                        # ao menos uma vez
if ja_processado(job.id): return ack(job)   # idempotência
try:
    executar(job)
    marcar_processado(job.id)
    ack(job)
except ErroTransitorio:
    reenfileirar(job, atraso=backoff(job.tentativas))   # 1s, 2s, 4s... + jitter
except Exception:
    enviar_para_dlq(job)` }
    ],
    traps: [
      "“Background” como uma thread solta dentro do processo web: se o servidor reinicia no deploy, o trabalho se perde.",
      "Retentativa imediata e sem limite: uma API externa fora do ar recebe uma tempestade de chamadas quando volta.",
      "Fila crescendo sem alerta: o sintoma real é a idade da mensagem mais antiga, não o CPU.",
      "Job que não é idempotente: a retentativa cobra duas vezes ou manda dois e-mails."
    ],
    rc: [
      ["Por que o backoff precisa de jitter?", "Sem aleatoriedade, todos os jobs que falharam voltam no mesmo instante e geram uma nova rajada (thundering herd). O jitter espalha as tentativas."],
      ["O que fazer com um job que falha sempre?", "Parar de tentar após o limite, mandá-lo para a DLQ, alertar e reprocessar depois de corrigir a causa."]
    ]
  },
  en: {
    s: "Background jobs",
    q: "How do you handle background jobs in a backend system?",
    why: "“How do you handle…” asks for a procedure: the order in which you decide, enqueue, run, retry and observe. A playbook shows each decision and the signal at each stage.",
    one: "Move whatever is slow or does not need an immediate answer out of the request path: the API **enqueues** the work and answers fast, and separate **workers** consume it. Because delivery is “at least once”, jobs must be **idempotent**, with **retries using backoff**, a **DLQ** for what exhausts its attempts, and **metrics** (queue size and age, failure rate).",
    b: [
      { t: "st", ti: "Playbook", i: [
        ["Decide what goes to the background", "Slow tasks (over ~1 s) that can wait or fail and retry: emails, reports, images, webhooks, integrations. What the user must see now stays synchronous."],
        ["Enqueue and answer", "The API stores the request, publishes the job to a queue (SQS, RabbitMQ, Redis/BullMQ, Sidekiq, Celery; or a Postgres table with `FOR UPDATE SKIP LOCKED` at smaller scale) and returns `202` with an ID."],
        ["Workers separate from web", "Their own processes, scaled independently, with a concurrency limit so they do not crush the database or the external API."],
        ["Guarantee idempotency", "The queue delivers at least once, so duplicates exist. Use a job key and check whether it was already done (`UNIQUE`, dedupe table, naturally idempotent operations)."],
        ["Retries with backoff and jitter", "Transient error (network, 503): retry after 1 s, 2 s, 4 s… plus a random amount, with a cap. Permanent error (invalid data): do not repeat."],
        ["DLQ and alerting", "What exhausted its attempts goes to a dead-letter queue, with an alert and a way to reprocess after fixing the cause."],
        ["Long and scheduled jobs", "Split into steps with checkpoints; use a visibility timeout or heartbeat. For cron, ensure only one instance fires (leader lock), or it runs duplicated."],
        ["Observe and shut down gracefully", "Queue depth, **age of the oldest message**, duration, failure rate, trace ID of the originating request. On shutdown, finish the current job before dying."]
      ] },
      { t: "cd", l: "worker (pseudocode)", c: `job = queue.receive()                       # at least once
if already_processed(job.id): return ack(job)   # idempotency
try:
    run(job)
    mark_processed(job.id)
    ack(job)
except TransientError:
    requeue(job, delay=backoff(job.attempts))   # 1s, 2s, 4s... + jitter
except Exception:
    send_to_dlq(job)` }
    ],
    traps: [
      "“Background” as a loose thread inside the web process: if the server restarts on deploy, the work is lost.",
      "Immediate, unlimited retries: an external API that was down gets a storm of calls when it returns.",
      "A queue growing with no alert: the real symptom is the age of the oldest message, not CPU.",
      "A job that is not idempotent: the retry charges twice or sends two emails."
    ],
    rc: [
      ["Why does backoff need jitter?", "Without randomness, every failed job comes back at the same instant and creates a new burst (thundering herd). Jitter spreads the attempts."],
      ["What do you do with a job that always fails?", "Stop retrying after the limit, send it to the DLQ, alert, and reprocess once the cause is fixed."]
    ]
  }
});

/* ============ 6 · SQL vs NoSQL ============ */
window.QS.push({
  n: 6, g: "B", m: "compare",
  pt: {
    s: "SQL vs NoSQL",
    q: "Qual é a diferença entre bancos de dados SQL e NoSQL? Quando você usaria cada um?",
    why: "A resposta útil é uma regra de decisão: o que cada família entrega e para que padrões de uso cada uma é a escolha certa. Por isso, matriz mais critérios de escolha.",
    one: "**SQL** (relacional) guarda dados em tabelas com esquema rígido, relacionamentos por chave estrangeira, joins e transações ACID. **NoSQL** é um guarda-chuva de modelos (documento, chave-valor, coluna larga, grafo) que troca parte dessas garantias por esquema flexível e escala horizontal mais simples. Ponto de partida: SQL (Postgres); escolha NoSQL quando um padrão de acesso específico ou uma escala medida justificar.",
    b: [
      { t: "tb", h: ["Aspecto", "SQL (relacional)", "NoSQL"], r: [
        ["Modelo", "Tabelas, linhas, colunas, relacionamentos", "Documento (MongoDB), chave-valor (Redis, DynamoDB), coluna larga (Cassandra), grafo (Neo4j)"],
        ["Esquema", "Definido antes; muda por migração", "Flexível; a estrutura vive no código (schema-on-read)"],
        ["Consultas", "SQL expressivo: joins, agregações, consultas ad hoc", "Rápido pelo acesso previsto; consulta nova pode exigir remodelar"],
        ["Transações", "ACID completo entre várias tabelas", "Varia: muitos dão ACID só por documento ou partição; outros, nenhum"],
        ["Escala", "Vertical + réplicas de leitura; sharding dá trabalho", "Horizontal por desenho (partições distribuídas)"],
        ["Consistência", "Forte por padrão", "Frequentemente eventual ou ajustável (quórum)"],
        ["Modelagem", "Normalizar e perguntar depois", "Modelar pelas consultas; duplicar dados de propósito"]
      ] },
      { t: "st", ti: "Como escolher", i: [
        ["Dados relacionados e integridade importam? (pedidos, financeiro, cadastros)", "SQL. Chaves estrangeiras, constraints e transações evitam estados impossíveis."],
        ["Precisa de relatórios e consultas que ainda não conhece?", "SQL. A flexibilidade de consulta é o ponto forte."],
        ["O acesso é quase sempre “busque por esta chave” numa escala enorme?", "Chave-valor ou documento (DynamoDB, Redis, MongoDB) ou coluna larga."],
        ["Escrita massiva e contínua (logs, séries temporais, IoT)?", "Coluna larga ou série temporal (Cassandra, TimescaleDB, ClickHouse)."],
        ["O valor está nos relacionamentos profundos (recomendação, fraude)?", "Grafo (Neo4j)."]
      ] },
      { t: "tp", k: "key", h: "Atalho", x: "Postgres com `JSONB` cobre boa parte do que se procura em “documento” e ainda dá SQL e ACID. O ponto de partida sensato é ele; saia dele com um motivo medido." }
    ],
    traps: [
      "“NoSQL não tem schema”: tem, só que no código; sem disciplina vira um depósito de documentos incompatíveis.",
      "Escolher NoSQL por moda e depois reinventar joins e transações na aplicação.",
      "Usar um banco só para tudo ou, no outro extremo, cinco bancos para um sistema pequeno.",
      "Confundir SQL (a linguagem) com relacional (o modelo): existem bancos relacionais distribuídos (CockroachDB, Spanner)."
    ],
    rc: [
      ["Quando você escolheria Cassandra em vez de Postgres?", "Escrita massiva e contínua, escala horizontal obrigatória e padrões de acesso fixos e conhecidos (séries temporais, mensagens), aceitando consistência ajustável e menos consultas ad hoc."],
      ["Por que modelar em NoSQL “pelas consultas”?", "Porque sem joins cada consulta precisa de uma estrutura que a responda numa leitura; por isso se duplicam dados de propósito."]
    ]
  },
  en: {
    s: "SQL vs NoSQL",
    q: "What is the difference between SQL and NoSQL databases? When would you use each?",
    why: "The useful answer is a decision rule: what each family delivers and for which usage patterns it is the right choice. Hence a matrix plus selection criteria.",
    one: "**SQL** (relational) stores data in tables with a rigid schema, foreign-key relationships, joins and ACID transactions. **NoSQL** is an umbrella of models (document, key-value, wide-column, graph) that trades some of those guarantees for a flexible schema and simpler horizontal scaling. Starting point: SQL (Postgres); choose NoSQL when a specific access pattern or a measured scale justifies it.",
    b: [
      { t: "tb", h: ["Aspect", "SQL (relational)", "NoSQL"], r: [
        ["Model", "Tables, rows, columns, relationships", "Document (MongoDB), key-value (Redis, DynamoDB), wide-column (Cassandra), graph (Neo4j)"],
        ["Schema", "Defined up front; changes via migration", "Flexible; structure lives in code (schema-on-read)"],
        ["Queries", "Expressive SQL: joins, aggregations, ad hoc queries", "Fast for the planned access; a new query may require remodeling"],
        ["Transactions", "Full ACID across several tables", "Varies: many give ACID only per document or partition; others none"],
        ["Scaling", "Vertical + read replicas; sharding takes effort", "Horizontal by design (distributed partitions)"],
        ["Consistency", "Strong by default", "Often eventual or tunable (quorum)"],
        ["Modeling", "Normalize, ask questions later", "Model around the queries; duplicate data on purpose"]
      ] },
      { t: "st", ti: "How to choose", i: [
        ["Do related data and integrity matter? (orders, finance, records)", "SQL. Foreign keys, constraints and transactions prevent impossible states."],
        ["Do you need reports and queries you do not know yet?", "SQL. Query flexibility is its strength."],
        ["Is access almost always “fetch by this key” at huge scale?", "Key-value or document (DynamoDB, Redis, MongoDB) or wide-column."],
        ["Massive, continuous writes (logs, time series, IoT)?", "Wide-column or time-series (Cassandra, TimescaleDB, ClickHouse)."],
        ["Is the value in deep relationships (recommendations, fraud)?", "Graph (Neo4j)."]
      ] },
      { t: "tp", k: "key", h: "Shortcut", x: "Postgres with `JSONB` covers much of what people look for in “document” stores and still gives SQL and ACID. It is the sensible starting point; leave it for a measured reason." }
    ],
    traps: [
      "“NoSQL has no schema”: it does, just in code; without discipline it becomes a dump of incompatible documents.",
      "Picking NoSQL by fashion and then reinventing joins and transactions in the application.",
      "Using one database for everything or, at the other extreme, five databases for a small system.",
      "Confusing SQL (the language) with relational (the model): distributed relational databases exist (CockroachDB, Spanner)."
    ],
    rc: [
      ["When would you pick Cassandra over Postgres?", "Massive, continuous writes, mandatory horizontal scaling and fixed, known access patterns (time series, messages), accepting tunable consistency and fewer ad hoc queries."],
      ["Why model NoSQL “around the queries”?", "Because without joins each query needs a structure that answers it in one read; that is why data is duplicated on purpose."]
    ]
  }
});

/* ============ 7 · Indexação ============ */
window.QS.push({
  n: 7, g: "B", m: "feynman",
  pt: {
    s: "Indexação e desempenho",
    q: "Explique a indexação de banco de dados e seu impacto no desempenho.",
    why: "Indexação é intuitiva se você pensar no índice remissivo de um livro. A analogia explica o ganho; o ponto onde ela quebra (custo na escrita) é justamente o que se cobra em entrevista.",
    one: "Um **índice** é uma estrutura à parte (em geral uma B-Tree) que mantém os valores de uma coluna ordenados, com ponteiros para as linhas, transformando uma busca de O(n) (ler a tabela inteira) em O(log n). Acelera `WHERE`, `JOIN` e `ORDER BY`, mas ocupa espaço e deixa `INSERT/UPDATE/DELETE` mais lentos, porque o índice também precisa ser atualizado.",
    b: [
      { t: "an",
        s: "Para achar onde o livro fala de “deadlock” você vai ao índice remissivo no fim: ele lista os termos em ordem e diz as páginas. Sem índice, folheia o livro inteiro.",
        k: "Sem índice o banco faz um **full table scan**: lê todas as linhas. Com um índice B-Tree ele desce uma árvore balanceada de poucos níveis (para 1 milhão de linhas, ~3 a 4 leituras de página) e chega direto às linhas. Há outros tipos: hash (igualdade), GIN (arrays, JSONB, full-text), GiST (geoespacial), BRIN (dados enormes e ordenados). Um índice **composto** `(a, b, c)` atende consultas por `a`, `a+b` e `a+b+c` (prefixo à esquerda), mas não `b` sozinho.",
        b: "O índice do livro é feito uma vez. O do banco precisa ser reescrito a cada alteração de dados, então cada índice extra deixa as escritas mais lentas e ocupa disco e memória. E o banco só o usa se o otimizador achar vantajoso: uma consulta que devolve metade da tabela ignora o índice." },
      { t: "cd", l: "sql", c: `CREATE INDEX idx_pedidos_cliente_data
  ON pedidos (cliente_id, criado_em DESC);

EXPLAIN ANALYZE
SELECT * FROM pedidos
WHERE cliente_id = 42
ORDER BY criado_em DESC LIMIT 10;
-- Antes:  Seq Scan    (lê 1.000.000 de linhas)
-- Depois: Index Scan  (lê ~10 linhas, já ordenadas)` },
      { t: "tb", ti: "Quando o índice não ajuda", h: ["Situação", "Por quê"], r: [
        ["`WHERE lower(email) = ...` com índice em `email`", "A função na coluna impede o uso; crie um índice funcional em `lower(email)`"],
        ["`LIKE '%texto'`", "Prefixo desconhecido: a B-Tree não consegue usar a ordenação; use full-text ou trigram"],
        ["Coluna de baixa seletividade (ex.: booleano)", "Metade da tabela casa; ler tudo é mais barato que pular pelo índice"],
        ["Tabela pequena", "Um scan é mais rápido que descer a árvore"],
        ["Tipos diferentes (`WHERE id = '42'` em coluna inteira)", "A conversão implícita pode invalidar o índice"]
      ] },
      { t: "tp", k: "key", h: "Covering index", x: "Se o índice já contém todas as colunas que a consulta pede (`INCLUDE`), o banco responde só pelo índice (**index-only scan**), sem tocar na tabela." }
    ],
    traps: [
      "Indexar tudo “por garantia”: cada índice custa em escrita, espaço e manutenção.",
      "Esquecer a ordem das colunas no índice composto: igualdade primeiro, depois intervalo ou ordenação.",
      "Não olhar o `EXPLAIN`: você acha que usa o índice, mas o plano mostra Seq Scan.",
      "Função ou conversão de tipo na coluna indexada dentro do `WHERE`."
    ],
    rc: [
      ["Por que um índice deixa o INSERT mais lento?", "Porque cada índice também é uma estrutura ordenada que precisa ser atualizada a cada escrita."],
      ["Você tem o índice (a, b). Ele ajuda `WHERE b = 1`?", "Em geral não: o índice composto só atende a prefixos à esquerda (`a`, ou `a` e `b`). Seria preciso um índice em `b`."]
    ]
  },
  en: {
    s: "Indexing and performance",
    q: "Explain database indexing and its impact on performance.",
    why: "Indexing is intuitive if you picture a book’s back-of-the-book index. The analogy explains the gain; the point where it breaks (write cost) is exactly what interviews probe.",
    one: "An **index** is a separate structure (usually a B-Tree) that keeps a column’s values sorted, with pointers to the rows, turning an O(n) search (reading the whole table) into O(log n). It speeds up `WHERE`, `JOIN` and `ORDER BY`, but takes space and slows `INSERT/UPDATE/DELETE`, because the index must be updated too.",
    b: [
      { t: "an",
        s: "To find where a book talks about “deadlock” you go to the index at the back: it lists terms in order and gives page numbers. Without it you flip through the whole book.",
        k: "Without an index the database does a **full table scan**: it reads every row. With a B-Tree index it walks a balanced tree of few levels (for 1 million rows, ~3 to 4 page reads) and lands directly on the rows. Other types exist: hash (equality), GIN (arrays, JSONB, full-text), GiST (geospatial), BRIN (huge ordered data). A **composite** index `(a, b, c)` serves queries on `a`, `a+b` and `a+b+c` (leftmost prefix), but not `b` alone.",
        b: "A book’s index is built once. The database’s must be rewritten on every data change, so each extra index slows writes and uses disk and memory. And the database only uses it if the optimizer judges it worthwhile: a query returning half the table ignores the index." },
      { t: "cd", l: "sql", c: `CREATE INDEX idx_orders_customer_date
  ON orders (customer_id, created_at DESC);

EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC LIMIT 10;
-- Before: Seq Scan    (reads 1,000,000 rows)
-- After:  Index Scan  (reads ~10 rows, already sorted)` },
      { t: "tb", ti: "When an index does not help", h: ["Situation", "Why"], r: [
        ["`WHERE lower(email) = ...` with an index on `email`", "The function on the column blocks its use; create a functional index on `lower(email)`"],
        ["`LIKE '%text'`", "Unknown prefix: the B-Tree cannot use its ordering; use full-text or trigram"],
        ["Low-selectivity column (e.g. boolean)", "Half the table matches; reading everything is cheaper than hopping through the index"],
        ["Small table", "A scan is faster than descending the tree"],
        ["Mismatched types (`WHERE id = '42'` on an integer column)", "Implicit conversion can invalidate the index"]
      ] },
      { t: "tp", k: "key", h: "Covering index", x: "If the index already contains every column the query asks for (`INCLUDE`), the database answers from the index alone (**index-only scan**), without touching the table." }
    ],
    traps: [
      "Indexing everything “just in case”: every index costs write time, space and maintenance.",
      "Forgetting column order in a composite index: equality first, then range or sort.",
      "Not reading `EXPLAIN`: you think the index is used, but the plan shows Seq Scan.",
      "A function or type conversion on the indexed column inside the `WHERE`."
    ],
    rc: [
      ["Why does an index make INSERT slower?", "Because each index is also a sorted structure that must be updated on every write."],
      ["You have an index on (a, b). Does it help `WHERE b = 1`?", "Usually not: a composite index only serves leftmost prefixes (`a`, or `a` and `b`). You would need an index on `b`."]
    ]
  }
});

/* ============ 8 · ACID ============ */
window.QS.push({
  n: 8, g: "B", m: "whys",
  pt: {
    s: "Propriedades ACID",
    q: "Quais são as propriedades do ACID em um banco de dados? Por que eles são importantes?",
    why: "A pergunta já pede o “por que importa”. Uma cadeia de porquês, usando uma transferência bancária, faz cada letra aparecer como consequência de um problema real, em vez de definição decorada.",
    one: "**A**tomicidade: tudo ou nada. **C**onsistência: a transação leva o banco de um estado válido a outro, respeitando as regras. **I**solamento: transações simultâneas não se enxergam pela metade. **D**urabilidade: o que foi confirmado sobrevive a um crash. Juntas, permitem raciocinar como se cada operação rodasse sozinha e o hardware nunca falhasse.",
    b: [
      { t: "why", rows: [
        ["Por que ACID importa?", "Porque uma operação de negócio quase nunca é uma escrita só: transferir R$ 100 é debitar A **e** creditar B, e as duas só fazem sentido juntas."],
        ["Por que não basta executar as duas escritas em sequência?", "Porque o sistema pode falhar entre elas: o débito acontece, o crédito não, e o dinheiro some. Falta **atomicidade**: tudo ou nada, com desfazer (rollback) automático."],
        ["Por que, mesmo atômico, ainda pode dar errado?", "Porque dois usuários operam ao mesmo tempo: ambos leem saldo 100, ambos gravam 50, e um débito se perde (lost update). Falta **isolamento**: cada transação enxerga o mundo como se estivesse sozinha."],
        ["Por que o resultado ainda precisa ser “válido”?", "Porque saldo negativo, chave estrangeira órfã ou CPF duplicado violam as regras do negócio. A **consistência** garante que a transação nunca deixa o banco violando as regras declaradas."],
        ["Por que a confirmação precisa sobreviver a uma queda?", "Porque dizer “transferência feita” e perder a escrita num corte de energia é pior que recusar. A **durabilidade** grava no log de escrita antecipada (WAL) em disco antes de confirmar."]
      ], root: "ACID transforma “várias operações incertas” numa única operação **tudo-ou-nada, correta mesmo com concorrência e falhas**. Quem programa pode raciocinar como se estivesse sozinho e o computador nunca falhasse." },
      { t: "tb", h: ["", "O que garante", "Como o banco faz", "Sem isso"], r: [
        ["Atomicidade", "Tudo ou nada", "Log de desfazer / rollback", "Transferência pela metade"],
        ["Consistência", "Estado válido → estado válido", "Constraints, FKs, triggers (+ regras da aplicação)", "Saldo negativo, registros órfãos"],
        ["Isolamento", "Concorrentes não interferem", "Locks ou MVCC; níveis read committed, repeatable read, serializable", "Lost update, leitura suja, fantasmas"],
        ["Durabilidade", "Commit sobrevive a crash", "WAL + fsync, replicação", "Pedido confirmado que desaparece"]
      ] },
      { t: "cd", l: "sql", c: `BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1 AND saldo >= 100;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;   -- ou ROLLBACK se algo falhar`, n: "Repare em `saldo = saldo - 100`: a conta é feita dentro do banco, de forma atômica, em vez de ler, calcular na aplicação e gravar. Isso já evita o lost update no nível padrão." },
      { t: "tp", k: "warn", h: "Os dois “C” são diferentes", x: "O C do ACID quer dizer “respeita as regras”, e quem define as regras também é a aplicação. O C do teorema CAP quer dizer que todos os nós veem o mesmo dado (linearizabilidade). Não são o mesmo conceito." }
    ],
    traps: [
      "Achar que o banco garante a consistência de negócio sozinho: ele só aplica as regras que você declarou.",
      "Esquecer que cada comando em autocommit é uma transação própria; duas escritas relacionadas precisam do mesmo `BEGIN … COMMIT`.",
      "Supor que o nível padrão (read committed) evita todo problema de concorrência: o lost update pede update atômico, `SELECT … FOR UPDATE` ou lock otimista.",
      "Dizer que “NoSQL não tem ACID”: muitos têm, em escopo limitado (um documento, uma partição)."
    ],
    rc: [
      ["Qual letra do ACID protege contra um crash no meio de uma transferência?", "Atomicidade (tudo ou nada). A Durabilidade protege depois do commit: o que foi confirmado não se perde."],
      ["Que anomalia o isolamento evita no exemplo de dois saques simultâneos?", "O lost update: duas transações leem o mesmo saldo e a segunda gravação sobrescreve a primeira."]
    ]
  },
  en: {
    s: "ACID properties",
    q: "What are the ACID properties in a database? Why are they important?",
    why: "The question already asks “why it matters”. A chain of whys, using a bank transfer, makes each letter appear as the consequence of a real problem instead of a memorized definition.",
    one: "**A**tomicity: all or nothing. **C**onsistency: a transaction takes the database from one valid state to another, respecting the rules. **I**solation: concurrent transactions do not see each other half-done. **D**urability: what was committed survives a crash. Together they let you reason as if each operation ran alone and hardware never failed.",
    b: [
      { t: "why", rows: [
        ["Why does ACID matter?", "Because a business operation is rarely a single write: moving $100 means debiting A **and** crediting B, and the two only make sense together."],
        ["Why is running the two writes one after the other not enough?", "Because the system can fail between them: the debit happens, the credit does not, and the money vanishes. **Atomicity** is missing: all or nothing, with automatic undo (rollback)."],
        ["Why can it still go wrong even when atomic?", "Because two users act at the same time: both read balance 100, both write 50, and one debit is lost (lost update). **Isolation** is missing: each transaction sees the world as if it were alone."],
        ["Why must the result still be “valid”?", "Because a negative balance, an orphan foreign key or a duplicate tax ID violate business rules. **Consistency** guarantees a transaction never leaves the database breaking the declared rules."],
        ["Why must a confirmation survive a crash?", "Because saying “transfer done” and losing the write in a power cut is worse than refusing. **Durability** writes to the write-ahead log (WAL) on disk before confirming."]
      ], root: "ACID turns “several uncertain operations” into a single **all-or-nothing operation that is correct even with concurrency and failures**. A programmer can reason as if alone and the computer never failed." },
      { t: "tb", h: ["", "What it guarantees", "How the database does it", "Without it"], r: [
        ["Atomicity", "All or nothing", "Undo log / rollback", "A half-done transfer"],
        ["Consistency", "Valid state → valid state", "Constraints, FKs, triggers (+ application rules)", "Negative balance, orphan records"],
        ["Isolation", "Concurrent work does not interfere", "Locks or MVCC; levels read committed, repeatable read, serializable", "Lost update, dirty reads, phantoms"],
        ["Durability", "A commit survives a crash", "WAL + fsync, replication", "A confirmed order that disappears"]
      ] },
      { t: "cd", l: "sql", c: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- or ROLLBACK if anything fails`, n: "Note `balance = balance - 100`: the arithmetic happens inside the database, atomically, instead of reading, computing in the application and writing back. That alone avoids the lost update at the default level." },
      { t: "tp", k: "warn", h: "The two “C”s are different", x: "The C in ACID means “respects the rules”, and the application also defines those rules. The C in the CAP theorem means all nodes see the same data (linearizability). They are not the same concept." }
    ],
    traps: [
      "Believing the database guarantees business consistency alone: it only enforces the rules you declared.",
      "Forgetting that each autocommit statement is its own transaction; two related writes need the same `BEGIN … COMMIT`.",
      "Assuming the default level (read committed) prevents every concurrency problem: a lost update needs an atomic update, `SELECT … FOR UPDATE` or optimistic locking.",
      "Saying “NoSQL has no ACID”: many do, within a limited scope (one document, one partition)."
    ],
    rc: [
      ["Which ACID letter protects against a crash in the middle of a transfer?", "Atomicity (all or nothing). Durability protects after the commit: what was confirmed is not lost."],
      ["Which anomaly does isolation prevent in the two-simultaneous-withdrawals example?", "The lost update: two transactions read the same balance and the second write overwrites the first."]
    ]
  }
});

/* ============ 9 · Deadlocks ============ */
window.QS.push({
  n: 9, g: "B", m: "whys",
  pt: {
    s: "Evitar deadlocks",
    q: "Como evitar deadlocks em um banco de dados relacional?",
    why: "Deadlock se previne removendo a causa. Perguntar “por quê?” repetidamente leva até a espera circular, e é dela que sai toda a lista de prevenções.",
    one: "Deadlock é quando duas (ou mais) transações seguram, cada uma, um bloqueio de que a outra precisa e esperam para sempre; o banco detecta o ciclo e aborta uma delas. Previna quebrando a **espera circular**: adquira bloqueios sempre na **mesma ordem**, mantenha transações **curtas**, toque o mínimo de linhas (com bons índices) e, como não dá para zerar o risco, **repita a transação** quando receber o erro de deadlock.",
    b: [
      { t: "why", rows: [
        ["Por que o deadlock acontece?", "Porque T1 segura o lock da linha A e quer B, enquanto T2 segura B e quer A. Cada uma espera a outra: espera circular."],
        ["Por que cada uma pegou os locks em ordem diferente?", "Porque caminhos de código distintos (API, job, tela administrativa) tocam as mesmas linhas em sequências diferentes: um atualiza origem → destino, outro destino → origem."],
        ["Por que elas ficam segurando os locks enquanto esperam?", "Porque o banco mantém os locks até o fim da transação (two-phase locking): só se liberam no `COMMIT` ou `ROLLBACK`. Quanto mais longa a transação, maior a janela de colisão."],
        ["Por que as transações demoram ou travam mais linhas do que o necessário?", "Falta de índice (a varredura trava muitas linhas), chamadas HTTP ou espera de usuário dentro da transação, lotes grandes numa só transação."],
        ["Por que, então, a prevenção é quebrar a espera circular?", "Deadlock exige quatro condições juntas (Coffman): exclusão mútua, “segura e espera”, sem preempção e espera circular. A mais fácil de eliminar na prática é a circular, impondo uma ordem global."]
      ], root: "Deadlock = ordem inconsistente de bloqueios + transações longas. Conserte a ordem e o tempo; para o resto, tenha **retentativa**." },
      { t: "st", ti: "Prevenção, em ordem de custo-benefício", i: [
        ["Ordem consistente de acesso", "Sempre atualize linhas e tabelas na mesma sequência (por exemplo, ordenando os IDs antes de travar)."],
        ["Transações curtas", "Nada de I/O externo, espera de usuário ou processamento pesado entre `BEGIN` e `COMMIT`."],
        ["Menos linhas, bons índices", "Uma consulta sem índice varre e trava mais linhas do que precisa."],
        ["Tipo de lock certo", "`SELECT … FOR UPDATE NOWAIT` ou `SKIP LOCKED` para não esperar; lock otimista (coluna `versao`) onde há pouca disputa; `lock_timeout` para limitar a espera."],
        ["Retentativa automática", "Ao receber o erro de deadlock (`40P01` no Postgres, `1213` no MySQL), repita a transação inteira com um pequeno atraso."],
        ["Diagnóstico", "Ligue o log de deadlocks e leia o grafo (`pg_locks`, `SHOW ENGINE INNODB STATUS`) para achar quais consultas colidem."]
      ] },
      { t: "cd", ti: "Ordem inconsistente (deadlock) vs ordem fixa", l: "sql", c: `-- T1: transfere 1 -> 2            -- T2: transfere 2 -> 1
UPDATE contas ... WHERE id = 1;    UPDATE contas ... WHERE id = 2;
UPDATE contas ... WHERE id = 2;    UPDATE contas ... WHERE id = 1;   -- ciclo!

-- Correção: ambas travam em ordem crescente de id
SELECT id FROM contas WHERE id IN (1, 2) ORDER BY id FOR UPDATE;` }
    ],
    traps: [
      "Prometer “eliminar” deadlocks: sob concorrência alta eles acontecem; o objetivo é reduzi-los e tratar o erro.",
      "Resolver só com timeout: ele limita a espera, mas a causa (ordem e duração) continua.",
      "Confundir deadlock com contenção de lock: na contenção a espera termina quando o outro faz commit; no deadlock nunca termina sozinha.",
      "Não repetir a transação: o usuário vê um erro 500 por algo que uma segunda tentativa resolveria."
    ],
    rc: [
      ["Como o banco “resolve” um deadlock?", "Detecta o ciclo de espera, escolhe uma transação como vítima, desfaz (rollback) e devolve um erro; as outras seguem."],
      ["Qual a medida preventiva mais simples e mais eficaz?", "Padronizar a ordem em que as transações adquirem os bloqueios (por exemplo, sempre por ID crescente)."]
    ]
  },
  en: {
    s: "Avoiding deadlocks",
    q: "How do you avoid deadlocks in a relational database?",
    why: "Deadlocks are prevented by removing the cause. Asking “why?” repeatedly leads to circular wait, and the entire list of preventions comes out of it.",
    one: "A deadlock is when two (or more) transactions each hold a lock the other needs and wait forever; the database detects the cycle and aborts one. Prevent it by breaking the **circular wait**: acquire locks always in the **same order**, keep transactions **short**, touch as few rows as possible (with good indexes) and, since risk cannot be zeroed, **retry the transaction** when you get the deadlock error.",
    b: [
      { t: "why", rows: [
        ["Why does the deadlock happen?", "Because T1 holds the lock on row A and wants B, while T2 holds B and wants A. Each waits for the other: circular wait."],
        ["Why did each take locks in a different order?", "Because different code paths (API, job, admin screen) touch the same rows in different sequences: one updates source → target, another target → source."],
        ["Why do they keep holding locks while waiting?", "Because the database keeps locks until the end of the transaction (two-phase locking): they are released only on `COMMIT` or `ROLLBACK`. The longer the transaction, the bigger the collision window."],
        ["Why do transactions run long or lock more rows than needed?", "Missing indexes (the scan locks many rows), HTTP calls or user waits inside the transaction, big batches in a single transaction."],
        ["Why, then, is prevention about breaking circular wait?", "A deadlock needs four conditions together (Coffman): mutual exclusion, hold-and-wait, no preemption and circular wait. The easiest to eliminate in practice is circular wait, by imposing a global order."]
      ], root: "Deadlock = inconsistent lock order + long transactions. Fix the order and the duration; for the rest, have a **retry**." },
      { t: "st", ti: "Prevention, in order of cost-benefit", i: [
        ["Consistent access order", "Always update rows and tables in the same sequence (for example, sorting the IDs before locking)."],
        ["Short transactions", "No external I/O, user waits or heavy processing between `BEGIN` and `COMMIT`."],
        ["Fewer rows, good indexes", "A query without an index scans and locks more rows than it needs."],
        ["The right lock type", "`SELECT … FOR UPDATE NOWAIT` or `SKIP LOCKED` to avoid waiting; optimistic locking (a `version` column) where contention is low; `lock_timeout` to cap the wait."],
        ["Automatic retry", "On the deadlock error (`40P01` in Postgres, `1213` in MySQL), repeat the whole transaction after a small delay."],
        ["Diagnosis", "Turn on deadlock logging and read the graph (`pg_locks`, `SHOW ENGINE INNODB STATUS`) to find which queries collide."]
      ] },
      { t: "cd", ti: "Inconsistent order (deadlock) vs fixed order", l: "sql", c: `-- T1: transfers 1 -> 2            -- T2: transfers 2 -> 1
UPDATE accounts ... WHERE id = 1;  UPDATE accounts ... WHERE id = 2;
UPDATE accounts ... WHERE id = 2;  UPDATE accounts ... WHERE id = 1;  -- cycle!

-- Fix: both lock in ascending id order
SELECT id FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;` }
    ],
    traps: [
      "Promising to “eliminate” deadlocks: under high concurrency they happen; the goal is to reduce them and handle the error.",
      "Solving it with a timeout alone: it caps the wait, but the cause (order and duration) remains.",
      "Confusing deadlock with lock contention: in contention the wait ends when the other commits; in a deadlock it never ends on its own.",
      "Not retrying the transaction: the user sees a 500 for something a second attempt would solve."
    ],
    rc: [
      ["How does the database “resolve” a deadlock?", "It detects the wait cycle, picks one transaction as the victim, rolls it back and returns an error; the others proceed."],
      ["What is the simplest and most effective preventive measure?", "Standardize the order in which transactions acquire locks (for example, always by ascending ID)."]
    ]
  }
});

/* ============ 10 · Replicação ============ */
window.QS.push({
  n: 10, g: "B", m: "whys",
  pt: {
    s: "Replicação de banco",
    q: "O que é replicação de banco de dados e por que ela é útil?",
    why: "“Por que ela é útil” é literalmente uma cadeia de porquês: cada benefício nasce de um problema do servidor único, e cada custo nasce do benefício.",
    one: "Replicação mantém **cópias do mesmo dado em vários nós** (tipicamente um líder que recebe escritas e seguidores que as repetem). Serve para **disponibilidade** (failover quando o líder cai), **durabilidade**, **escala de leitura** e **latência** (réplica perto do usuário). O preço é o **atraso de replicação**: ler de uma réplica pode devolver dado velho. Replicação não é backup.",
    b: [
      { t: "why", rows: [
        ["Por que replicar?", "Porque um único servidor é ponto único de falha: se ele cai, o serviço cai e, se o disco morre, o dado se perde."],
        ["Por que um backup não resolve?", "Restaurar um backup leva minutos a horas e perde o que aconteceu desde ele. Uma réplica já está pronta e quase atualizada: o failover leva segundos (RTO e RPO baixos)."],
        ["Por que isso também melhora o desempenho?", "Em geral há muito mais leituras que escritas. As réplicas respondem as leituras e o líder fica só com as escritas: escala horizontal de leitura. Réplicas em outras regiões encurtam a distância até o usuário."],
        ["Por que isso cria um problema novo?", "Porque copiar leva tempo (replication lag). Você grava no líder, lê da réplica e não vê sua própria escrita; duas réplicas podem mostrar valores diferentes por instantes."],
        ["Por que então é uma escolha de trade-off?", "Replicação síncrona dá mais consistência e durabilidade, mas aumenta a latência e a dependência de cada réplica. A assíncrona é rápida e disponível, mas pode perder as últimas escritas num failover."]
      ], root: "Replicação compra **disponibilidade, durabilidade e escala de leitura**, e cobra **consistência e complexidade operacional**." },
      { t: "tb", ti: "Modelos de topologia", h: ["Modelo", "Como funciona", "Prós e contras"], r: [
        ["Líder–seguidor", "Escritas só no líder; seguidores copiam o log (WAL/binlog)", "Simples e o mais comum; escrita não escala; failover exige promoção"],
        ["Multilíder", "Vários nós aceitam escrita e trocam as alterações", "Escrita em várias regiões; exige resolver conflitos"],
        ["Sem líder (quórum)", "Escreve em W nós e lê de R nós, com R + W > N (Dynamo, Cassandra)", "Muito disponível; consistência ajustável; reparo e conflitos"]
      ] },
      { t: "tb", ti: "Síncrona vs assíncrona", h: ["Tipo", "Líder confirma quando…", "Efeito"], r: [
        ["Síncrona", "a réplica já gravou", "Sem perda de dados; mais lenta; uma réplica fora pode travar escritas"],
        ["Assíncrona", "ele mesmo gravou", "Rápida; pode perder as últimas escritas num failover; atraso de leitura"],
        ["Semi-síncrona", "ao menos uma réplica gravou", "Meio-termo: durabilidade sem depender de todas"]
      ] },
      { t: "tp", k: "key", h: "Como lidar com o atraso", x: "Leia do líder logo após escrever (ou por alguns segundos), use “read-your-writes” por sessão (posição do log ou timestamp) e deixe relatórios e buscas tolerarem dado de segundos atrás." },
      { t: "tp", k: "warn", h: "Replicação não é backup", x: "Um `DROP TABLE` ou um `UPDATE` sem `WHERE` é replicado em segundos para todas as cópias. Backups e recuperação em ponto no tempo (PITR) continuam necessários." }
    ],
    traps: [
      "Tratar a réplica de leitura como se estivesse sempre atualizada.",
      "Failover automático sem quórum e sem fencing: dois nós se julgam líderes (split-brain) e gravam dados divergentes.",
      "Confundir replicação (copiar tudo) com sharding (dividir os dados entre nós).",
      "Monitorar só o CPU da réplica e não o atraso de replicação."
    ],
    rc: [
      ["Qual a diferença entre replicação e sharding?", "Replicação copia o mesmo dado em vários nós (disponibilidade e leitura); sharding divide o dado entre nós (escala de escrita e de volume)."],
      ["O que é split-brain?", "Quando, após uma partição de rede, dois nós se consideram o líder e aceitam escritas divergentes. Evita-se com quórum e fencing."]
    ]
  },
  en: {
    s: "Database replication",
    q: "What is database replication and why is it useful?",
    why: "“Why is it useful” is literally a chain of whys: each benefit stems from a single-server problem, and each cost stems from the benefit.",
    one: "Replication keeps **copies of the same data on several nodes** (typically a leader that takes writes and followers that replay them). It serves **availability** (failover when the leader dies), **durability**, **read scaling** and **latency** (a replica near the user). The price is **replication lag**: reading from a replica can return stale data. Replication is not backup.",
    b: [
      { t: "why", rows: [
        ["Why replicate?", "Because a single server is a single point of failure: if it goes down the service goes down, and if the disk dies the data is lost."],
        ["Why does a backup not solve it?", "Restoring a backup takes minutes to hours and loses what happened since. A replica is already running and nearly current: failover takes seconds (low RTO and RPO)."],
        ["Why does it also improve performance?", "There are usually far more reads than writes. Replicas answer the reads and the leader keeps only writes: horizontal read scaling. Replicas in other regions shorten the distance to users."],
        ["Why does that create a new problem?", "Because copying takes time (replication lag). You write to the leader, read from a replica and do not see your own write; two replicas can show different values for moments."],
        ["Why is it then a trade-off?", "Synchronous replication gives more consistency and durability but adds latency and a dependency on each replica. Asynchronous is fast and available but can lose the latest writes on failover."]
      ], root: "Replication buys **availability, durability and read scaling**, and charges **consistency and operational complexity**." },
      { t: "tb", ti: "Topology models", h: ["Model", "How it works", "Pros and cons"], r: [
        ["Leader–follower", "Writes only on the leader; followers copy the log (WAL/binlog)", "Simple and the most common; writes do not scale; failover needs promotion"],
        ["Multi-leader", "Several nodes accept writes and exchange changes", "Writes in several regions; requires conflict resolution"],
        ["Leaderless (quorum)", "Write to W nodes and read from R nodes, with R + W > N (Dynamo, Cassandra)", "Highly available; tunable consistency; repair and conflicts"]
      ] },
      { t: "tb", ti: "Synchronous vs asynchronous", h: ["Type", "Leader confirms when…", "Effect"], r: [
        ["Synchronous", "the replica has written", "No data loss; slower; a down replica can block writes"],
        ["Asynchronous", "it has written itself", "Fast; may lose latest writes on failover; read lag"],
        ["Semi-synchronous", "at least one replica has written", "Middle ground: durability without depending on all"]
      ] },
      { t: "tp", k: "key", h: "Handling the lag", x: "Read from the leader right after writing (or for a few seconds), use per-session “read-your-writes” (log position or timestamp) and let reports and searches tolerate seconds-old data." },
      { t: "tp", k: "warn", h: "Replication is not backup", x: "A `DROP TABLE` or an `UPDATE` without `WHERE` is replicated to every copy within seconds. Backups and point-in-time recovery (PITR) are still required." }
    ],
    traps: [
      "Treating the read replica as if it were always current.",
      "Automatic failover without quorum and fencing: two nodes believe they are leader (split-brain) and write divergent data.",
      "Confusing replication (copy everything) with sharding (split data across nodes).",
      "Monitoring only the replica’s CPU and not its replication lag."
    ],
    rc: [
      ["What is the difference between replication and sharding?", "Replication copies the same data to several nodes (availability and reads); sharding splits the data across nodes (write and volume scaling)."],
      ["What is split-brain?", "When, after a network partition, two nodes consider themselves the leader and accept divergent writes. It is avoided with quorum and fencing."]
    ]
  }
});
