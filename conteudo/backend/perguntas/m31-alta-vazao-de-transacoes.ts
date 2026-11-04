import type { Pergunta } from "../../tipos";

// M31 · Alta vazão de transações
export const m31: Pergunta = {
  numero: 231,
  modulo: "mentorcruise",
  metodo: "design",
  pt: {
    titulo: "Alta vazão de transações",
    pergunta: "Você pode explicar como projetaria um sistema que precisa lidar com uma alta vazão de transações?",
    porqueEsteMetodo:
      "É um desenho de sistema, e o risco é sair listando tecnologias. O roteiro (requisitos, números, API, dados, arquitetura, gargalos) obriga a decidir a partir do que o sistema precisa garantir, que aqui é não perder nem duplicar uma transação.",
    resposta30s:
      "Comece pelos **requisitos e pelos números** (TPS médio e de pico, latência, consistência e durabilidade exigidas). Depois: uma API com **chave de idempotência**; um caminho de escrita **em lotes** (group commit, log append-only ou fila) com **particionamento por chave** (a conta, por exemplo); leituras por **réplicas, cache e CQRS**; nada de **linhas ou travas quentes**; **backpressure** e limite de taxa contra a sobrecarga; efeitos paralelos por **outbox**. Escolha onde a consistência é forte e onde pode ser eventual, e prove com **teste de capacidade** e monitoramento. Para escala geral de leitura, veja Q15.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado (exemplo: lançamentos de pagamentos)",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: registrar uma transação (valor, origem, destino), consultar saldo e extrato, estornar. Não funcionais: **TPS** médio e de pico, latência p99, **consistência** (saldo nunca errado nem dinheiro duplicado), **durabilidade** (o que foi confirmado não se perde) e disponibilidade. Pergunte também: tolera-se atraso na leitura? A ordem importa? Quanto de perda é aceitável (para dinheiro, nenhuma)?",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Números hipotéticos: 10 milhões de transações por dia ≈ 115 TPS em média; pico de 10× ≈ 1.200 TPS. Com ~1 KB por registro, ≈ 10 GB por dia e ≈ 3,6 TB por ano. Compare com a capacidade **medida** de um nó: se um nó aguenta o pico com folga, particionar cedo é complexidade sem motivo. Se o alvo fosse 100× maior (~120 mil TPS de pico), um nó único não bastaria e a partição entraria no desenho.",
          },
          {
            titulo: "3. API",
            texto:
              "`POST /transacoes` com `Idempotency-Key`, valor em centavos (inteiro), moeda, origem e destino. `201` com o `id` (ou `202` e consulta de status, se o processamento for assíncrono). Repetir a mesma chave devolve a mesma resposta (veja Q30). Validação barata na borda e limite de taxa por cliente (veja Q14).",
          },
          {
            titulo: "4. Dados e caminho de escrita",
            texto:
              "Lançamentos **imutáveis e append-only**: um estorno é um novo lançamento, nunca uma edição. Índices só os necessários, porque cada um custa escrita. Escritas **em lote**: muitos bancos agrupam commits (group commit), pagando um único flush de disco por vários. **Chave de partição** pela conta, para que os lançamentos de uma conta fiquem juntos e em ordem. O saldo é derivado ou materializado a partir dos lançamentos.",
          },
          {
            titulo: "5. Arquitetura",
            texto:
              "Balanceador → servidores de aplicação sem estado → (opcional) um log ou fila durável particionado pela conta → **um escritor por partição** que aplica em lote → banco particionado, cada partição com réplicas. Leituras de extrato vão para réplicas ou visões prontas (**CQRS**: modelo de escrita separado do de leitura) e cache (veja Q11). Eventos de efeito paralelo (notificação, antifraude, relatório) saem por **outbox**.",
          },
          {
            titulo: "6. Gargalos e proteção",
            texto:
              "**Linha quente**: um saldo ou contador atualizado por todas as transações serializa o sistema; veja o aviso abaixo. **Sobrecarga**: filas com limite, **backpressure** (`429` ou `503` com `Retry-After`), limite de taxa e descarte do que é menos importante. **Transações entre partições**: prefira desenhar para que as duas pontas fiquem juntas, ou use saga com compensação (veja Q29) em vez de commit em duas fases.",
          },
          {
            titulo: "7. Falhas, monitoramento e prova",
            texto:
              "Replicação síncrona ou por quórum para o que foi confirmado, failover ensaiado, reprocesso idempotente e reconciliação periódica. Métricas: TPS, latência p50/p95/p99, atraso da fila, tempo de commit, contenção de travas, saturação. **Teste de capacidade** com perfil realista, incluindo chave quente, e testes de falha (derrubar um nó). Veja R43 para testes de carga.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma escrita",
        etapas: [
          "O cliente envia `POST /transacoes` com `Idempotency-Key`",
          "A API valida o formato, aplica o limite de taxa e confere a chave de idempotência",
          "O pedido é roteado, pela conta, ao escritor da sua partição (fila ou log durável)",
          "O escritor aplica vários pedidos em lote: confere o saldo, grava os lançamentos e faz um único commit",
          "Depois do commit durável, responde `201` (ou `202` com um id para consultar o status, no modo assíncrono)",
          "Um outbox publica o evento para extrato, antifraude e notificações",
        ],
        nota: "Um escritor por partição elimina a briga por travas dentro dela; o preço é que cada conta fica limitada à vazão de um escritor. Se o cliente precisa saber o resultado na hora, a API espera o escritor; senão, devolve `202`.",
      },
      {
        tipo: "tabela",
        titulo: "Trade-offs de consistência: onde forte, onde eventual",
        colunas: ["Dado ou operação", "Consistência", "Por quê"],
        linhas: [
          [
            "Débito e crédito na conta",
            "Forte, dentro da partição da conta",
            "Nunca estourar saldo nem duplicar; um escritor por conta ou lock otimista (veja R46)",
          ],
          [
            "Extrato e consultas",
            "Eventual (atraso curto)",
            "Lê de réplica ou visão pronta; avise a defasagem e leia do primário quando a pessoa acabou de escrever",
          ],
          [
            "Transferência entre partições",
            "Saga com compensação",
            "Commit em duas fases é caro e frágil; a saga aceita estados intermediários e desfaz com estorno (veja Q29)",
          ],
          [
            "Notificações, antifraude, relatórios",
            "Eventual, por eventos",
            "Não podem bloquear o caminho de escrita; entram pelo outbox",
          ],
          [
            "Contadores e métricas",
            "Aproximados ou agregados",
            "Não precisam de exatidão a cada transação; fragmente o contador ou agregue em lote",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que diferencia esta resposta",
        texto:
          "Números antes de arquitetura, e a solução mais simples que cumpre o pico medido (um banco bem ajustado, índices mínimos, escrita em lote) antes de acrescentar peças. Diferente de escalar leituras (Q15), aqui cada requisição **muda estado e precisa ser durável e correta**: o gargalo é a escrita e a coordenação, e cada conselho (partição, lote, outbox, idempotência) responde a isso.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Linha quente",
        texto:
          "Um único registro atualizado por todas as transações (saldo global, contador de pedidos, “último id”) faz cada escrita esperar a trava da anterior; adicionar servidores não ajuda. Prefira lançamentos append-only somados depois, contadores fragmentados em N linhas (somados na leitura) ou agregação em memória com gravação em lote. Para uma conta muito disputada, grave os lançamentos e calcule o saldo de forma assíncrona.",
      },
    ],
    armadilhas: [
      "Confirmar ao cliente antes de a transação estar gravada (e replicada): numa queda, o dinheiro “aceito” some.",
      "Um contador ou saldo global atualizado por todas as transações: serializa tudo e nenhum servidor extra resolve.",
      "Particionar cedo demais ou por uma chave ruim: complexidade sem necessidade, shards desbalanceados e transações que cruzam partições.",
      "Fila sem limite e sem backpressure: no pico a latência explode e a memória acaba; é melhor recusar cedo e com clareza do que aceitar e falhar.",
    ],
    autoteste: [
      {
        pergunta: "Por que escrever em lote e agrupar commits aumenta a vazão?",
        resposta:
          "O custo dominante de um commit durável é forçar a gravação em disco. Agrupar vários commits num único flush divide esse custo entre eles: troca-se um pouco de latência por muita vazão.",
      },
      {
        pergunta: "Como impedir que um contador global vire gargalo?",
        resposta:
          "Não atualize sempre a mesma linha: grave lançamentos append-only e some depois, ou fragmente o contador em várias linhas e some na leitura.",
      },
      {
        pergunta: "O que o backpressure faz?",
        resposta:
          "Avisa quem envia para desacelerar (fila limitada, `429` ou `503` com `Retry-After`) em vez de acumular trabalho sem fim até o sistema colapsar.",
      },
    ],
  },
  en: {
    titulo: "High transaction throughput",
    pergunta: "Can you explain how you would design a system that needs to handle high transaction throughput?",
    porqueEsteMetodo:
      "It is a system design, and the risk is to start listing technologies. The script (requirements, numbers, API, data, architecture, bottlenecks) forces decisions to follow what the system must guarantee, which here is never losing or duplicating a transaction.",
    resposta30s:
      "Start with the **requirements and the numbers** (average and peak TPS, latency, required consistency and durability). Then: an API with an **idempotency key**; a **batched** write path (group commit, append-only log or queue) with **partitioning by key** (the account, say); reads through **replicas, cache and CQRS**; no **hot rows or locks**; **backpressure** and rate limiting against overload; side effects through an **outbox**. Choose where consistency is strong and where it can be eventual, and prove it with a **capacity test** and monitoring. For general read scaling, see Q15.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied (example: payment ledger entries)",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: record a transaction (amount, source, destination), query balance and statement, reverse. Non-functional: average and peak **TPS**, p99 latency, **consistency** (balance never wrong, money never duplicated), **durability** (what was confirmed is not lost) and availability. Also ask: is read delay tolerated? Does order matter? How much loss is acceptable (for money, none)?",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Hypothetical numbers: 10 million transactions per day ≈ 115 TPS on average; a 10× peak ≈ 1,200 TPS. At ~1 KB per record, ≈ 10 GB per day and ≈ 3.6 TB per year. Compare with the **measured** capacity of one node: if one node handles the peak with room to spare, partitioning early is needless complexity. If the target were 100× larger (~120 thousand TPS at peak), a single node would not do and partitioning would enter the design.",
          },
          {
            titulo: "3. API",
            texto:
              "`POST /transactions` with `Idempotency-Key`, amount in cents (integer), currency, source and destination. `201` with the `id` (or `202` and status polling, if processing is asynchronous). Repeating the same key returns the same response (see Q30). Cheap validation at the edge and per-client rate limiting (see Q14).",
          },
          {
            titulo: "4. Data and write path",
            texto:
              "**Immutable, append-only** ledger entries: a reversal is a new entry, never an edit. Only the indexes you need, since each one costs writes. **Batched** writes: many databases group commits (group commit), paying one disk flush for several. A **partition key** by account, so an account’s entries stay together and in order. The balance is derived or materialized from the entries.",
          },
          {
            titulo: "5. Architecture",
            texto:
              "Load balancer → stateless application servers → (optional) a durable log or queue partitioned by account → **one writer per partition** applying in batches → partitioned database, each partition with replicas. Statement reads go to replicas or ready-made views (**CQRS**: write model separate from the read model) and cache (see Q11). Side-effect events (notification, anti-fraud, reports) leave through an **outbox**.",
          },
          {
            titulo: "6. Bottlenecks and protection",
            texto:
              "**Hot row**: a balance or counter updated by every transaction serializes the system; see the warning below. **Overload**: bounded queues, **backpressure** (`429` or `503` with `Retry-After`), rate limiting and shedding what matters least. **Cross-partition transactions**: prefer a design where both ends live together, or use a saga with compensation (see Q29) instead of two-phase commit.",
          },
          {
            titulo: "7. Failures, monitoring and proof",
            texto:
              "Synchronous or quorum replication for what was confirmed, rehearsed failover, idempotent reprocessing and periodic reconciliation. Metrics: TPS, p50/p95/p99 latency, queue lag, commit time, lock contention, saturation. A **capacity test** with a realistic profile, including a hot key, plus failure tests (kill a node). See R43 for load testing.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The path of a write",
        etapas: [
          "The client sends `POST /transactions` with `Idempotency-Key`",
          "The API validates the format, applies rate limiting and checks the idempotency key",
          "The request is routed, by account, to its partition’s writer (queue or durable log)",
          "The writer applies several requests in a batch: checks the balance, writes the entries and does a single commit",
          "After the durable commit, it answers `201` (or `202` with an id to poll for status, in asynchronous mode)",
          "An outbox publishes the event for statements, anti-fraud and notifications",
        ],
        nota: "One writer per partition removes lock contention inside it; the price is that each account is limited to one writer’s throughput. If the client needs the result right away, the API waits for the writer; otherwise it returns `202`.",
      },
      {
        tipo: "tabela",
        titulo: "Consistency trade-offs: where strong, where eventual",
        colunas: ["Data or operation", "Consistency", "Why"],
        linhas: [
          [
            "Debits and credits on the account",
            "Strong, inside the account’s partition",
            "Never overdraw or duplicate; one writer per account or optimistic locking (see R46)",
          ],
          [
            "Statements and queries",
            "Eventual (short delay)",
            "Read from a replica or ready-made view; flag the lag and read from the primary when the person has just written",
          ],
          [
            "Transfer across partitions",
            "Saga with compensation",
            "Two-phase commit is costly and fragile; a saga accepts intermediate states and undoes with a reversal (see Q29)",
          ],
          [
            "Notifications, anti-fraud, reports",
            "Eventual, through events",
            "Must not block the write path; they enter through the outbox",
          ],
          [
            "Counters and metrics",
            "Approximate or aggregated",
            "They do not need exactness on every transaction; shard the counter or aggregate in batches",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What sets this answer apart",
        texto:
          "Numbers before architecture, and the simplest solution that meets the measured peak (a well-tuned database, minimal indexes, batched writes) before adding parts. Unlike scaling reads (Q15), here every request **changes state and must be durable and correct**: the bottleneck is writing and coordination, and each piece of advice (partitioning, batching, outbox, idempotency) answers that.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Hot row",
        texto:
          "A single record updated by every transaction (global balance, order counter, “last id”) makes each write wait for the previous one’s lock; adding servers does not help. Prefer append-only entries summed later, counters sharded into N rows (summed on read), or in-memory aggregation with batched writes. For a heavily contended account, write the entries and compute the balance asynchronously.",
      },
    ],
    armadilhas: [
      "Confirming to the client before the transaction is written (and replicated): in a crash, the “accepted” money vanishes.",
      "A global counter or balance updated by every transaction: it serializes everything and no extra server fixes it.",
      "Partitioning too early or on a bad key: needless complexity, unbalanced shards and transactions that cross partitions.",
      "An unbounded queue with no backpressure: at peak latency explodes and memory runs out; better to refuse early and clearly than to accept and fail.",
    ],
    autoteste: [
      {
        pergunta: "Why does batching writes and grouping commits raise throughput?",
        resposta:
          "The dominant cost of a durable commit is forcing the write to disk. Grouping several commits into a single flush splits that cost among them: you trade a little latency for a lot of throughput.",
      },
      {
        pergunta: "How do you keep a global counter from becoming a bottleneck?",
        resposta:
          "Do not always update the same row: write append-only entries and sum later, or shard the counter into several rows and sum on read.",
      },
      {
        pergunta: "What does backpressure do?",
        resposta:
          "It tells senders to slow down (bounded queue, `429` or `503` with `Retry-After`) instead of piling up endless work until the system collapses.",
      },
    ],
  },
};
