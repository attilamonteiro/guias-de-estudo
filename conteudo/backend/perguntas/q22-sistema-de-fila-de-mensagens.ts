import type { Pergunta } from "../../tipos";

// Q22 · Sistema de fila de mensagens
export const q22: Pergunta = {
  numero: 22,
  modulo: "design-de-sistemas",
  metodo: "firstprinciples",
  pt: {
    titulo: "Sistema de fila de mensagens",
    pergunta: "Como você projeta um sistema de fila de mensagens?",
    porqueEsteMetodo:
      "Uma fila de mensagens não nasce pronta: nasce de uma lista simples que vai quebrando a cada restrição (durabilidade, escala, falhas). Construir do zero mostra por que cada componente existe.",
    resposta30s:
      "Comece com uma lista FIFO e acrescente uma restrição de cada vez: **log durável em disco e replicado** (não perder mensagens), **ack ou offset** (saber o que já foi processado), **garantia de entrega at-least-once** com consumidores idempotentes, **partições** (escala, com ordem só dentro da partição), **retentativas e DLQ** (falhas) e **monitoramento do lag**. Dois modelos: fila (cada mensagem a um consumidor) e pub/sub (cópia a cada assinante).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto:
              "Produtor e consumidor têm velocidades diferentes e não podem depender de estar vivos ao mesmo tempo. Precisa-se de um intermediário que guarde as mensagens.",
          },
          {
            titulo: "1. A versão mais simples",
            texto:
              "Uma lista em memória (FIFO) com `enqueue` e `dequeue`. → Quebra: se o processo cair, tudo se perde; e é um nó só.",
          },
          {
            titulo: "2. Durabilidade",
            texto:
              "Gravar as mensagens num **log append-only em disco** (escrita sequencial é rápida) e **replicar** em N nós (líder + seguidores). → Sobrevive à falha de um nó.",
          },
          {
            titulo: "3. Entrega ao consumidor",
            texto:
              "Como saber o que já foi processado? **Ack por mensagem** (SQS, RabbitMQ): sem ack em T segundos (visibility timeout) a mensagem volta. Ou **offset por grupo de consumidores** (Kafka): o consumidor lembra até onde leu.",
          },
          {
            titulo: "4. Garantias de entrega",
            texto:
              "At-most-once (ack antes de processar: pode perder), **at-least-once** (ack depois: pode duplicar, o padrão prático) e exactly-once (na prática: at-least-once + consumidor idempotente ou transações).",
          },
          {
            titulo: "5. Escala",
            texto:
              "Particionar o tópico em N partições pela chave (hash). Paralelismo = número de partições. A **ordem só vale dentro da partição**. Cada partição vai a um consumidor do grupo; rebalancear quando consumidores entram ou saem.",
          },
          {
            titulo: "6. Falhas e mensagens ruins",
            texto:
              "Retentativas com backoff, **DLQ** para a mensagem envenenada, limite de tamanho da fila e backpressure sobre o produtor, retenção/TTL.",
          },
          {
            titulo: "7. Dois modelos",
            texto:
              "**Fila** (cada mensagem para um consumidor: competing consumers) e **pub/sub** (cada assinante recebe uma cópia). Kafka e SNS oferecem os dois com grupos.",
          },
          {
            titulo: "8. Controle e operação",
            texto:
              "Cluster de brokers com metadados e eleição de líder (Raft/ZooKeeper), roteamento de tópicos, monitoramento do **lag** do consumidor, autenticação e cotas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A interface mínima",
        legenda: "API",
        codigo:
          "produce(topico, chave, mensagem) -> offset\nconsume(grupo, topico)           -> [mensagens]   # long polling\nack(id) / nack(id)                                 # confirma ou devolve\n# a chave decide a particao: mesma chave -> mesma particao -> mesma ordem",
      },
      {
        tipo: "tabela",
        titulo: "Como isso aparece em produtos reais",
        colunas: ["", "RabbitMQ", "Kafka", "SQS"],
        linhas: [
          [
            "Modelo",
            "Broker com filas e exchanges de roteamento",
            "Log distribuído e particionado",
            "Fila gerenciada na nuvem",
          ],
          ["Ordem", "Por fila", "Por partição", "Opcional (FIFO)"],
          ["Retenção", "Até ser consumida", "Por tempo ou tamanho; é possível reler", "Até 14 dias"],
          [
            "Melhor para",
            "Roteamento flexível, tarefas",
            "Alto volume, streaming, replay",
            "Simplicidade sem operar infraestrutura",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Exactly-once é promessa de ponta a ponta",
        texto:
          "O broker pode evitar duplicar no seu log, mas o efeito no mundo (um e-mail, uma cobrança) só é único se o consumidor for idempotente. Desconfie de quem promete “exactly-once” sem falar disso.",
      },
    ],
    armadilhas: [
      "Prometer exactly-once sem idempotência no consumidor.",
      "Querer ordem global e alta vazão ao mesmo tempo: são incompatíveis; escolha ordem por chave.",
      "Usar a fila como banco de dados (consultar, filtrar, apagar no meio).",
      "Sem DLQ: uma mensagem envenenada trava a partição ou fica reprocessando para sempre.",
      "Não monitorar o lag: o sintoma do consumidor lento é a fila crescendo, não erro.",
    ],
    autoteste: [
      {
        pergunta: "O que garante a ordem num sistema particionado?",
        resposta: "A ordem só vale dentro de uma partição; mensagens com a mesma chave vão para a mesma partição.",
      },
      {
        pergunta: "Por que at-least-once exige consumidor idempotente?",
        resposta:
          "Porque a mesma mensagem pode ser entregue mais de uma vez (ack perdido, timeout); processá-la de novo não pode duplicar o efeito.",
      },
    ],
  },
  en: {
    titulo: "Message queue system",
    pergunta: "How do you design a message queue system?",
    porqueEsteMetodo:
      "A message queue is not born finished: it starts as a simple list that breaks at each constraint (durability, scale, failures). Building from scratch shows why each component exists.",
    resposta30s:
      "Start with a FIFO list and add one constraint at a time: a **durable, replicated on-disk log** (do not lose messages), **ack or offset** (know what was processed), **at-least-once delivery** with idempotent consumers, **partitions** (scale, with order only inside a partition), **retries and a DLQ** (failures) and **lag monitoring**. Two models: queue (each message to one consumer) and pub/sub (a copy to every subscriber).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto:
              "Producer and consumer run at different speeds and cannot depend on being alive at the same time. You need an intermediary that stores messages.",
          },
          {
            titulo: "1. The simplest version",
            texto:
              "An in-memory list (FIFO) with `enqueue` and `dequeue`. → Breaks: if the process dies everything is lost; and it is a single node.",
          },
          {
            titulo: "2. Durability",
            texto:
              "Write messages to an **append-only log on disk** (sequential writes are fast) and **replicate** it to N nodes (leader + followers). → Survives a node failure.",
          },
          {
            titulo: "3. Delivery to the consumer",
            texto:
              "How do you know what was processed? **Per-message ack** (SQS, RabbitMQ): without an ack within T seconds (visibility timeout) the message returns. Or a **per-consumer-group offset** (Kafka): the consumer remembers how far it read.",
          },
          {
            titulo: "4. Delivery guarantees",
            texto:
              "At-most-once (ack before processing: may lose), **at-least-once** (ack after: may duplicate, the practical default) and exactly-once (in practice: at-least-once + idempotent consumer or transactions).",
          },
          {
            titulo: "5. Scale",
            texto:
              "Split the topic into N partitions by key (hash). Parallelism = number of partitions. **Order only holds within a partition**. Each partition goes to one consumer in the group; rebalance when consumers join or leave.",
          },
          {
            titulo: "6. Failures and bad messages",
            texto:
              "Retries with backoff, a **DLQ** for the poison message, queue size limit and backpressure on the producer, retention/TTL.",
          },
          {
            titulo: "7. Two models",
            texto:
              "**Queue** (each message to one consumer: competing consumers) and **pub/sub** (each subscriber gets a copy). Kafka and SNS offer both with groups.",
          },
          {
            titulo: "8. Control and operations",
            texto:
              "A broker cluster with metadata and leader election (Raft/ZooKeeper), topic routing, consumer **lag** monitoring, authentication and quotas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The minimal interface",
        legenda: "API",
        codigo:
          "produce(topic, key, message)  -> offset\nconsume(group, topic)         -> [messages]   # long polling\nack(id) / nack(id)                            # confirm or return\n# the key decides the partition: same key -> same partition -> same order",
      },
      {
        tipo: "tabela",
        titulo: "How this shows up in real products",
        colunas: ["", "RabbitMQ", "Kafka", "SQS"],
        linhas: [
          ["Model", "Broker with queues and routing exchanges", "Distributed, partitioned log", "Managed cloud queue"],
          ["Ordering", "Per queue", "Per partition", "Optional (FIFO)"],
          ["Retention", "Until consumed", "By time or size; re-reading is possible", "Up to 14 days"],
          [
            "Best for",
            "Flexible routing, tasks",
            "High volume, streaming, replay",
            "Simplicity without running infrastructure",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Exactly-once is an end-to-end promise",
        texto:
          "The broker can avoid duplicating in its own log, but the effect on the world (an email, a charge) is only single if the consumer is idempotent. Be wary of anyone promising “exactly-once” without mentioning it.",
      },
    ],
    armadilhas: [
      "Promising exactly-once without consumer idempotency.",
      "Wanting global order and high throughput at once: they are incompatible; choose per-key order.",
      "Using the queue as a database (querying, filtering, deleting from the middle).",
      "No DLQ: a poison message blocks the partition or reprocesses forever.",
      "Not monitoring lag: the symptom of a slow consumer is a growing queue, not an error.",
    ],
    autoteste: [
      {
        pergunta: "What guarantees ordering in a partitioned system?",
        resposta: "Order only holds within a partition; messages with the same key go to the same partition.",
      },
      {
        pergunta: "Why does at-least-once require an idempotent consumer?",
        resposta:
          "Because the same message may be delivered more than once (lost ack, timeout); processing it again must not duplicate the effect.",
      },
    ],
  },
};
