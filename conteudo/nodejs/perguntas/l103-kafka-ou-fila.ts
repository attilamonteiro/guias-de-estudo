import type { Pergunta } from "../../tipos";

// L103 · Kafka ou fila
export const l103: Pergunta = {
  numero: 203,
  modulo: "linkedin-arquitetura",
  metodo: "compare",
  pt: {
    titulo: "Kafka ou fila",
    pergunta: "Quando você usaria Kafka ou uma fila de mensagens?",
    porqueEsteMetodo:
      "É uma escolha entre duas famílias que se parecem por fora e funcionam diferente por dentro. A matriz mostra as diferenças lado a lado e a regra de decisão diz qual perguntar primeiro.",
    resposta30s:
      "Use uma **fila de mensagens** (SQS, RabbitMQ, BullMQ) quando a mensagem é uma **tarefa a executar**: ela vai a um consumidor, é confirmada e removida, com retentativas e fila de mensagens mortas. Use o **Kafka** quando a mensagem é um **fato que vários sistemas vão ler**, com ordem por chave, retenção e **replay**, em volume alto. Ambos entregam em geral **pelo menos uma vez**, então o consumidor precisa ser idempotente.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Fila de tarefas x log de eventos",
        colunas: ["Aspecto", "Fila de mensagens (SQS, RabbitMQ, BullMQ)", "Log de eventos (Kafka)"],
        linhas: [
          [
            "Modelo",
            "A mensagem é uma tarefa: entregue a um consumidor e removida depois da confirmação (ack)",
            "Eventos são anexados a um log e retidos; cada grupo de consumidores guarda a sua posição (offset)",
          ],
          [
            "Consumo",
            "Consumidores concorrentes dividem o trabalho; cada mensagem vai a um só",
            "Cada grupo lê todos os eventos; dentro do grupo, as partições são divididas entre os consumidores",
          ],
          [
            "Retenção e replay",
            "A mensagem some depois do ack; reprocessar exige reenviar (ou reaproveitar a fila de mensagens mortas)",
            "Retido por tempo ou tamanho; dá para voltar o offset e reprocessar o histórico",
          ],
          [
            "Ordem",
            "Em geral por fila, e consumidores concorrentes e retentativas podem embaralhá-la; filas FIFO ordenam, com limites",
            "Garantida dentro de uma partição; a chave de partição define o que fica em ordem",
          ],
          [
            "Entrega",
            "Em geral pelo menos uma vez, o que pode duplicar",
            "Pelo menos uma vez por padrão; há recursos mais fortes dentro do ecossistema Kafka, com condições, e o consumidor ainda deve ser idempotente",
          ],
          [
            "Prioridade e atraso",
            "Vários produtos oferecem prioridade, atraso e agendamento por mensagem",
            "Em geral não oferece por mensagem; o roteamento é por tópico e partição",
          ],
          [
            "Escala e operação",
            "Mais simples de operar, e o SQS é gerenciado; atende a maioria dos sistemas",
            "Feito para volume muito alto e muitos consumidores, ao custo de operar um cluster (ou contratar um serviço gerenciado) e planejar partições",
          ],
          [
            "Quando usar",
            "Trabalho a executar: e-mail, imagem, cobrança, importação, com retentativas",
            "Fluxo de fatos lido por vários sistemas: auditoria, captura de mudanças (CDC), análises, streaming, event sourcing",
          ],
        ],
        nota: "A fronteira não é rígida: alguns brokers de fila também oferecem recursos de log, e o Kafka pode servir de fila com cuidados. Confira a documentação do produto que for usar.",
      },
      {
        tipo: "tabela",
        titulo: "Os produtos mais comuns",
        colunas: ["Produto", "Bom quando", "Cuidado"],
        linhas: [
          [
            "BullMQ",
            "Você já usa Node.js e Redis e quer jobs em segundo plano com retentativas, atraso e agendamento",
            "A durabilidade depende de como o Redis está configurado; não é um log para vários sistemas",
          ],
          [
            "Amazon SQS",
            "Você está na AWS e não quer operar o broker; tem fila de mensagens mortas",
            "Roteamento limitado; ordem e deduplicação só em filas FIFO, com limites que vale conferir na documentação",
          ],
          [
            "RabbitMQ",
            "Precisa de roteamento flexível entre serviços (exchanges, filas, padrões) e confirmações",
            "É preciso operar o cluster e vigiar filas que crescem quando falta consumidor",
          ],
          [
            "Kafka",
            "Fluxo de eventos para muitos consumidores, volume alto, reprocessamento, integrações por CDC e streaming",
            "Mais complexo: partições, rebalanceamento de consumidores, retenção e esquemas dos eventos",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte primeiro: a mensagem é uma **tarefa para alguém executar** ou um **fato que outros vão ler**? Tarefa, com retentativas e volume moderado: **fila**. Fato com vários leitores, replay, ordem por chave ou volume muito alto: **Kafka**. Se nada exige o Kafka, comece com a fila: ela é mais simples de operar e dá para migrar depois.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pelo menos uma vez significa duplicata",
        texto:
          "Se o consumidor cai antes de confirmar, a mensagem volta e é processada de novo. Projete o consumidor para ser **idempotente** (veja L104). Entrega “exatamente uma vez” de ponta a ponta é rara e vale só dentro de limites do sistema, e ordem global não existe. O Kafka também não é fila de tarefas pronta: o avanço do offset é por partição, então uma mensagem lenta atrasa as seguintes, e o paralelismo máximo de um grupo é o número de partições.",
      },
    ],
    armadilhas: [
      "Escolher Kafka por moda, com volume pequeno: operar o cluster, planejar partições e manter esquemas custa mais que o ganho.",
      "Supor que a fila entrega exatamente uma vez: sem consumidor idempotente, uma retentativa duplica cobranças e e-mails.",
      "Esperar ordem global: ela existe por fila ou por partição, e consumidores concorrentes e retentativas podem embaralhá-la.",
      "Não ter fila de mensagens mortas nem monitorar o atraso (lag): mensagens problemáticas travam o consumo ou somem em silêncio.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença central entre uma fila de mensagens e o Kafka?",
        resposta:
          "A fila entrega cada mensagem a um consumidor e a remove depois do ack: modela tarefas. O Kafka mantém um log retido, em que cada grupo de consumidores lê no seu ritmo e pode reler o histórico: modela fatos que vários sistemas consomem.",
      },
      {
        pergunta: "Por que o Kafka exige cuidado como fila de tarefas?",
        resposta:
          "O consumo avança o offset da partição, sem ack por mensagem nem prioridade ou atraso por mensagem; uma mensagem lenta atrasa as seguintes da partição, e o paralelismo é limitado pelo número de partições.",
      },
    ],
  },
  en: {
    titulo: "Kafka or a queue",
    pergunta: "When would you use Kafka or a message queue?",
    porqueEsteMetodo:
      "It is a choice between two families that look alike from the outside and work differently inside. The matrix shows the differences side by side, and the decision rule says which question to ask first.",
    resposta30s:
      "Use a **message queue** (SQS, RabbitMQ, BullMQ) when the message is a **task to run**: it goes to one consumer, is acknowledged and removed, with retries and a dead-letter queue. Use **Kafka** when the message is a **fact that several systems will read**, with per-key ordering, retention and **replay**, at high volume. Both usually deliver **at least once**, so the consumer must be idempotent.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Task queue vs event log",
        colunas: ["Aspect", "Message queue (SQS, RabbitMQ, BullMQ)", "Event log (Kafka)"],
        linhas: [
          [
            "Model",
            "The message is a task: delivered to one consumer and removed after the acknowledgment (ack)",
            "Events are appended to a log and retained; each consumer group keeps its own position (offset)",
          ],
          [
            "Consumption",
            "Competing consumers split the work; each message goes to just one",
            "Each group reads every event; within a group, partitions are divided among the consumers",
          ],
          [
            "Retention and replay",
            "The message is gone after the ack; reprocessing means resending (or reusing the dead-letter queue)",
            "Retained by time or size; you can rewind the offset and reprocess history",
          ],
          [
            "Ordering",
            "Usually per queue, and competing consumers and retries can scramble it; FIFO queues order, with limits",
            "Guaranteed within a partition; the partition key decides what stays in order",
          ],
          [
            "Delivery",
            "Usually at least once, which can duplicate",
            "At least once by default; stronger features exist within the Kafka ecosystem, with conditions, and the consumer should still be idempotent",
          ],
          [
            "Priority and delay",
            "Several products offer per-message priority, delay and scheduling",
            "Generally not offered per message; routing is by topic and partition",
          ],
          [
            "Scale and operations",
            "Simpler to run, and SQS is managed; enough for most systems",
            "Built for very high volume and many consumers, at the cost of running a cluster (or buying a managed service) and planning partitions",
          ],
          [
            "When to use",
            "Work to execute: email, images, billing, imports, with retries",
            "A stream of facts read by several systems: auditing, change data capture (CDC), analytics, streaming, event sourcing",
          ],
        ],
        nota: "The line is not rigid: some queue brokers also offer log features, and Kafka can act as a queue with care. Check the documentation of the product you pick.",
      },
      {
        tipo: "tabela",
        titulo: "The most common products",
        colunas: ["Product", "Good when", "Watch out for"],
        linhas: [
          [
            "BullMQ",
            "You already use Node.js and Redis and want background jobs with retries, delays and scheduling",
            "Durability depends on how Redis is configured; it is not a log for several systems",
          ],
          [
            "Amazon SQS",
            "You are on AWS and do not want to run the broker; it has a dead-letter queue",
            "Limited routing; ordering and deduplication only on FIFO queues, with limits worth checking in the documentation",
          ],
          [
            "RabbitMQ",
            "You need flexible routing between services (exchanges, queues, patterns) and acknowledgments",
            "You must run the cluster and watch for queues that grow when consumers are missing",
          ],
          [
            "Kafka",
            "An event stream for many consumers, high volume, reprocessing, CDC integrations and streaming",
            "More complex: partitions, consumer rebalancing, retention and event schemas",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask first: is the message a **task for someone to run** or a **fact that others will read**? A task, with retries and moderate volume: **queue**. A fact with several readers, replay, per-key ordering or very high volume: **Kafka**. If nothing requires Kafka, start with a queue: it is simpler to run and you can migrate later.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "At least once means duplicates",
        texto:
          "If the consumer crashes before acknowledging, the message comes back and is processed again. Design the consumer to be **idempotent** (see L104). End-to-end “exactly once” delivery is rare and holds only within a system’s limits, and global ordering does not exist. Kafka is also not a ready-made task queue: the offset advances per partition, so one slow message delays the ones behind it, and a group’s maximum parallelism is the number of partitions.",
      },
    ],
    armadilhas: [
      "Choosing Kafka because it is fashionable, with low volume: running the cluster, planning partitions and maintaining schemas costs more than the gain.",
      "Assuming the queue delivers exactly once: without an idempotent consumer, a retry duplicates charges and emails.",
      "Expecting global ordering: it exists per queue or per partition, and competing consumers and retries can scramble it.",
      "Having no dead-letter queue and not watching consumer lag: problem messages block consumption or vanish silently.",
    ],
    autoteste: [
      {
        pergunta: "What is the central difference between a message queue and Kafka?",
        resposta:
          "A queue delivers each message to one consumer and removes it after the ack: it models tasks. Kafka keeps a retained log that each consumer group reads at its own pace and can reread: it models facts that several systems consume.",
      },
      {
        pergunta: "Why does Kafka need care as a task queue?",
        resposta:
          "Consumption advances the partition offset, with no per-message ack and no per-message priority or delay; one slow message delays the following ones in the partition, and parallelism is capped by the number of partitions.",
      },
    ],
  },
};
