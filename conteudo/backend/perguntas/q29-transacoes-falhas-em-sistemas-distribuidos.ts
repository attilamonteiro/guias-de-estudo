import type { Pergunta } from "../../tipos";

// Q29 · Transações falhas em sistemas distribuídos
export const q29: Pergunta = {
  numero: 29,
  modulo: "confiabilidade",
  metodo: "trace",
  pt: {
    titulo: "Transações falhas em sistemas distribuídos",
    pergunta: "Como lidar com transações falhadas em um sistema distribuído?",
    porqueEsteMetodo:
      "Num fluxo com vários serviços, a falha acontece num ponto específico e o que importa é o que se desfaz e quem avisa quem. Rastrear um pedido que falha no meio mostra o padrão (saga) e o que ele exige.",
    resposta30s:
      "Não há ACID global barato entre serviços independentes. Troca-se por uma **saga**: uma sequência de **transações locais**, cada uma com uma **ação compensatória**; se um passo falha, as compensações dos anteriores rodam em ordem inversa. Em volta dela: **retry com backoff + idempotência** para falhas transitórias, **outbox** para publicar eventos sem perder, **timeouts e reconciliação** para respostas perdidas e **DLQ** com intervenção humana para o resto.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Saga do pedido, caminho feliz",
        etapas: [
          "Order cria o pedido (PENDENTE)",
          "Payment cobra o cartão",
          "Inventory reserva o estoque",
          "Shipping agenda a entrega",
          "Order marca CONFIRMADO",
        ],
      },
      {
        tipo: "passos",
        titulo: "Agora uma falha no meio (Inventory sem estoque)",
        passos: [
          {
            titulo: "Inventory falha",
            texto: "Publica `StockFailed` (ou responde erro ao orquestrador).",
          },
          {
            titulo: "Compensações em ordem inversa",
            texto: "Payment recebe a notícia e **estorna** a cobrança; Order marca CANCELADO; o cliente é avisado.",
          },
          {
            titulo: "Cada passo é uma transação local + um evento",
            texto:
              "Cada serviço grava no próprio banco e publica o evento pelo padrão Outbox, para não haver “gravou mas não avisou”.",
          },
          {
            titulo: "Cada compensação é idempotente e repetível",
            texto: "Um estorno chamado duas vezes tem o mesmo efeito de uma; se falhar, tenta de novo até dar certo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Tipos de falha e o remédio",
        colunas: ["Falha", "Remédio"],
        linhas: [
          ["Transitória (rede, timeout, 503)", "Retry com backoff + jitter, usando **chave de idempotência**"],
          [
            "Resposta perdida (o pagamento foi feito ou não?)",
            "Consultar o estado no serviço remoto e **reconciliar**; nunca assumir que timeout = falha",
          ],
          [
            "Falha de negócio (sem estoque, cartão recusado)",
            "**Compensação** (desfazer semanticamente) ou rejeitar cedo",
          ],
          ["Evento não publicado", "**Outbox**: gravar o evento na mesma transação local e publicar depois"],
          ["Serviço fora do ar", "Circuit breaker, fallback, fila com retentativa"],
          ["Saga travada no meio", "Timeouts, job de reconciliação, DLQ e painel para intervenção humana"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Commit em duas fases vs saga",
        colunas: ["", "2PC", "Saga"],
        linhas: [
          ["Consistência", "Forte (atômica)", "Eventual, com compensação"],
          ["Bloqueio", "Segura locks até todos votarem", "Sem locks distribuídos"],
          ["Disponibilidade", "Coordenador é ponto único; participante fora trava tudo", "Alta; avança por eventos"],
          [
            "Complexidade",
            "Protocolo pronto, porém frágil e raro entre serviços independentes",
            "Você escreve compensações e estados intermediários",
          ],
          ["Quando", "Dentro de um mesmo banco ou cluster", "Entre serviços independentes (microserviços)"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Orquestração vs coreografia",
        texto:
          "Na **orquestração**, um coordenador diz a cada serviço o que fazer e decide as compensações: o fluxo é fácil de ler. Na **coreografia**, cada serviço reage a eventos dos outros: não há ponto central, mas o fluxo fica espalhado e difícil de seguir.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Compensar nem sempre desfaz",
        texto:
          "Um e-mail enviado não pode ser “desenviado”. A compensação é semântica (mandar outro e-mail avisando o cancelamento), e por isso é decisão de negócio.",
      },
    ],
    armadilhas: [
      "Dual write: gravar no banco e publicar na fila em duas operações separadas.",
      "Compensação que não é idempotente ou que falha sem retry.",
      "Tratar timeout como falha e repetir sem idempotência: cobra duas vezes.",
      "Não ter reconciliação periódica para sagas travadas.",
      "Esperar atomicidade de ACID entre serviços.",
    ],
    autoteste: [
      {
        pergunta: "O que é uma saga?",
        resposta:
          "Uma sequência de transações locais, cada uma com uma ação compensatória; se um passo falha, as compensações dos passos anteriores são executadas em ordem inversa.",
      },
      {
        pergunta: "Que problema o Outbox resolve numa saga?",
        resposta:
          "Garante que gravar o dado e publicar o evento do passo aconteçam de forma atômica, evitando um passo concluído sem que o próximo serviço saiba.",
      },
    ],
  },
  en: {
    titulo: "Failed distributed transactions",
    pergunta: "How do you handle failed transactions in a distributed system?",
    porqueEsteMetodo:
      "In a multi-service flow, failure happens at a specific point and what matters is what gets undone and who tells whom. Tracing an order that fails midway shows the pattern (saga) and what it demands.",
    resposta30s:
      "There is no cheap global ACID across independent services. You trade it for a **saga**: a sequence of **local transactions**, each with a **compensating action**; if a step fails, the earlier steps’ compensations run in reverse order. Around it: **retry with backoff + idempotency** for transient failures, **outbox** to publish events without loss, **timeouts and reconciliation** for lost responses, and a **DLQ** with human intervention for the rest.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Order saga, happy path",
        etapas: [
          "Order creates the order (PENDING)",
          "Payment charges the card",
          "Inventory reserves stock",
          "Shipping schedules delivery",
          "Order marks CONFIRMED",
        ],
      },
      {
        tipo: "passos",
        titulo: "Now a failure midway (Inventory out of stock)",
        passos: [
          {
            titulo: "Inventory fails",
            texto: "Publishes `StockFailed` (or returns an error to the orchestrator).",
          },
          {
            titulo: "Compensations in reverse order",
            texto:
              "Payment receives the news and **refunds** the charge; Order marks CANCELLED; the customer is notified.",
          },
          {
            titulo: "Each step is a local transaction + an event",
            texto:
              "Each service writes to its own database and publishes the event through the Outbox pattern, so there is no “saved but did not tell”.",
          },
          {
            titulo: "Each compensation is idempotent and repeatable",
            texto: "A refund called twice has the same effect as once; if it fails, it retries until it succeeds.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Failure types and the remedy",
        colunas: ["Failure", "Remedy"],
        linhas: [
          ["Transient (network, timeout, 503)", "Retry with backoff + jitter, using an **idempotency key**"],
          [
            "Lost response (was the payment made or not?)",
            "Query the state on the remote service and **reconcile**; never assume timeout = failure",
          ],
          ["Business failure (out of stock, card declined)", "**Compensation** (semantic undo) or reject early"],
          ["Event not published", "**Outbox**: write the event in the same local transaction and publish afterwards"],
          ["Service down", "Circuit breaker, fallback, queue with retry"],
          ["Saga stuck midway", "Timeouts, reconciliation job, DLQ and a dashboard for human intervention"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Two-phase commit vs saga",
        colunas: ["", "2PC", "Saga"],
        linhas: [
          ["Consistency", "Strong (atomic)", "Eventual, with compensation"],
          ["Blocking", "Holds locks until everyone votes", "No distributed locks"],
          [
            "Availability",
            "The coordinator is a single point; a participant down blocks everything",
            "High; progresses through events",
          ],
          [
            "Complexity",
            "Ready-made protocol, but fragile and rare between independent services",
            "You write compensations and intermediate states",
          ],
          ["When", "Inside one database or cluster", "Between independent services (microservices)"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Orchestration vs choreography",
        texto:
          "In **orchestration**, a coordinator tells each service what to do and decides the compensations: the flow is easy to read. In **choreography**, each service reacts to the others’ events: there is no central point, but the flow is spread out and hard to follow.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Compensating does not always undo",
        texto:
          "A sent email cannot be “unsent”. The compensation is semantic (send another email announcing the cancellation), so it is a business decision.",
      },
    ],
    armadilhas: [
      "Dual write: writing to the database and publishing to the queue as two separate operations.",
      "A compensation that is not idempotent or that fails without retry.",
      "Treating a timeout as failure and retrying without idempotency: it charges twice.",
      "No periodic reconciliation for stuck sagas.",
      "Expecting ACID atomicity across services.",
    ],
    autoteste: [
      {
        pergunta: "What is a saga?",
        resposta:
          "A sequence of local transactions, each with a compensating action; if a step fails, the earlier steps’ compensations run in reverse order.",
      },
      {
        pergunta: "Which problem does the Outbox solve in a saga?",
        resposta:
          "It makes writing the data and publishing the step’s event atomic, avoiding a completed step the next service never hears about.",
      },
    ],
  },
};
