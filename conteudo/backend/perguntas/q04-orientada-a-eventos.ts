import type { Pergunta } from "../../tipos";

// Q04 · Orientada a eventos
export const q04: Pergunta = {
  numero: 4,
  modulo: "arquitetura",
  metodo: "trace",
  pt: {
    titulo: "Orientada a eventos",
    pergunta: "O que é uma arquitetura orientada a eventos? Você pode dar um exemplo?",
    porqueEsteMetodo:
      "Orientada a eventos é um fluxo entre vários atores. Seguir um único evento do começo ao fim, inclusive no caminho de falha, mostra o que o estilo entrega e o que ele cobra.",
    resposta30s:
      "É um estilo em que os componentes se comunicam publicando e consumindo **eventos** (fatos que já aconteceram, como `PedidoCriado`) através de um broker, sem que o produtor conheça ou espere os consumidores. Ganha-se baixo acoplamento, extensibilidade e absorção de picos; paga-se com consistência eventual, depuração mais difícil e a necessidade de idempotência.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Exemplo: um pedido em e-commerce",
        etapas: [
          "Order Service grava o pedido (PENDENTE) e publica `OrderPlaced`",
          "O broker (Kafka, RabbitMQ, SNS/SQS) entrega uma cópia a cada assinante",
          "Payment cobra e publica `PaymentApproved`",
          "Inventory reserva o estoque e publica `StockReserved`",
          "Shipping gera a etiqueta; Email confirma; Analytics registra",
        ],
        nota: "O Order Service não sabe quantos consumidores existem. Para criar um programa de fidelidade basta um novo assinante de `OrderPlaced`, sem tocar no código do pedido.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho de falha",
        passos: [
          {
            titulo: "Payment recusa o cartão",
            texto: "Publica `PaymentFailed` em vez de `PaymentApproved`.",
          },
          {
            titulo: "Quem escutava reage sozinho",
            texto:
              "Order Service marca o pedido como CANCELADO; Inventory libera qualquer reserva; Email avisa o cliente.",
          },
          {
            titulo: "O consumidor cai no meio",
            texto:
              "A mensagem não é confirmada e volta para a fila (entrega ao menos uma vez). Por isso o consumidor precisa ser idempotente.",
          },
          {
            titulo: "Mensagem que sempre falha",
            texto: "Depois de N tentativas vai para uma fila de mensagens mortas (DLQ) para análise.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Três jeitos de usar eventos",
        colunas: ["Padrão", "O evento carrega", "Exemplo"],
        linhas: [
          ["Notificação", "Só o aviso e um ID; o consumidor busca o resto", "`PedidoCriado {id}`"],
          [
            "Estado transportado",
            "Os dados de que o consumidor precisa, sem perguntar de volta",
            "`PedidoCriado {id, itens, total, endereço}`",
          ],
          [
            "Event sourcing",
            "O histórico de eventos é a fonte da verdade; o estado é derivado",
            "Conta bancária = soma dos lançamentos",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Evento não é comando",
        texto:
          "Um **evento** diz o que aconteceu (`PedidoPago`) e pode ter zero ou muitos ouvintes. Um **comando** pede uma ação (`CobrarPedido`) e tem um destinatário. Misturar os dois recria o acoplamento que se queria evitar.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Publicar com segurança: Outbox",
        texto:
          "Gravar no banco e publicar na fila são duas operações; se uma falha, os dois ficam inconsistentes. O padrão **Outbox** grava o evento numa tabela na mesma transação do dado, e um processo à parte o publica.",
      },
    ],
    armadilhas: [
      "Consumidor não idempotente: a mesma mensagem processada duas vezes cobra o cliente duas vezes.",
      "Sem DLQ e sem monitorar o atraso da fila: mensagens problemáticas travam ou somem em silêncio.",
      "Esperar ordem global: a ordem só costuma ser garantida dentro de uma partição ou chave.",
      "Eventos sem esquema versionado: mudar um campo quebra consumidores que você nem sabe que existem.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre evento e comando?",
        resposta:
          "Evento é um fato passado, sem destinatário fixo; comando é um pedido de ação para alguém específico.",
      },
      {
        pergunta: "Que problema o padrão Outbox resolve?",
        resposta:
          "O dual write: gravar o dado e publicar o evento de forma atômica, gravando o evento na mesma transação do banco e publicando depois.",
      },
    ],
  },
  en: {
    titulo: "Event-driven",
    pergunta: "What is an event-driven architecture? Can you give an example?",
    porqueEsteMetodo:
      "Event-driven is a flow across several actors. Following a single event from start to finish, including the failure path, shows what the style delivers and what it costs.",
    resposta30s:
      "It is a style where components communicate by publishing and consuming **events** (facts that already happened, like `OrderPlaced`) through a broker, without the producer knowing or waiting for the consumers. You gain loose coupling, extensibility and spike absorption; you pay with eventual consistency, harder debugging and the need for idempotency.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Example: an order in e-commerce",
        etapas: [
          "Order Service stores the order (PENDING) and publishes `OrderPlaced`",
          "The broker (Kafka, RabbitMQ, SNS/SQS) delivers a copy to each subscriber",
          "Payment charges and publishes `PaymentApproved`",
          "Inventory reserves stock and publishes `StockReserved`",
          "Shipping creates the label; Email confirms; Analytics records",
        ],
        nota: "Order Service does not know how many consumers exist. A loyalty program only needs a new subscriber to `OrderPlaced`, with no change to the order code.",
      },
      {
        tipo: "passos",
        titulo: "Now the failure path",
        passos: [
          {
            titulo: "Payment declines the card",
            texto: "It publishes `PaymentFailed` instead of `PaymentApproved`.",
          },
          {
            titulo: "Listeners react on their own",
            texto:
              "Order Service marks the order CANCELLED; Inventory releases any reservation; Email notifies the customer.",
          },
          {
            titulo: "A consumer dies midway",
            texto:
              "The message is not acknowledged and returns to the queue (at-least-once delivery). Hence consumers must be idempotent.",
          },
          {
            titulo: "A message that always fails",
            texto: "After N attempts it goes to a dead-letter queue (DLQ) for analysis.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Three ways to use events",
        colunas: ["Pattern", "The event carries", "Example"],
        linhas: [
          ["Notification", "Just the notice and an ID; the consumer fetches the rest", "`OrderCreated {id}`"],
          [
            "State transfer",
            "The data the consumer needs, with no call back",
            "`OrderCreated {id, items, total, address}`",
          ],
          [
            "Event sourcing",
            "The event history is the source of truth; state is derived",
            "Bank account = sum of entries",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An event is not a command",
        texto:
          "An **event** says what happened (`OrderPaid`) and may have zero or many listeners. A **command** requests an action (`ChargeOrder`) and has one recipient. Mixing them recreates the coupling you meant to avoid.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Publishing safely: Outbox",
        texto:
          "Writing to the database and publishing to the queue are two operations; if one fails they diverge. The **Outbox** pattern writes the event to a table in the same transaction as the data, and a separate process publishes it.",
      },
    ],
    armadilhas: [
      "A non-idempotent consumer: the same message processed twice charges the customer twice.",
      "No DLQ and no queue-lag monitoring: problem messages block or vanish silently.",
      "Expecting global ordering: order is usually guaranteed only within a partition or key.",
      "Events without a versioned schema: changing a field breaks consumers you do not even know about.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an event and a command?",
        resposta:
          "An event is a past fact with no fixed recipient; a command is a request for action addressed to someone specific.",
      },
      {
        pergunta: "Which problem does the Outbox pattern solve?",
        resposta:
          "The dual write: storing the data and publishing the event atomically, by writing the event in the same database transaction and publishing it afterwards.",
      },
    ],
  },
};
