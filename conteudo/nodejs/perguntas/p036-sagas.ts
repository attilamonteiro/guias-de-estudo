import type { Pergunta } from "../../tipos";

// P36 · Sagas
export const p036: Pergunta = {
  numero: 736,
  modulo: "pawanmkr-arquitetura",
  metodo: "trace",
  pt: {
    titulo: "Sagas",
    pergunta: "O que são sagas na orquestração de microsserviços e como são implementadas no Node.js?",
    porqueEsteMetodo:
      "Uma saga é um processo que se desenrola no tempo, e o que a define é o que acontece quando um passo falha no meio. Seguir um pedido, primeiro no caminho feliz e depois no caminho em que o pagamento falha, mostra quem desfaz o quê, e em que ordem.",
    resposta30s:
      "Uma **saga** divide uma operação que atravessa serviços em uma sequência de **transações locais**, cada uma com uma **ação compensatória** que a desfaz do ponto de vista do negócio; se um passo falha, a saga executa as compensações dos passos já feitos, em ordem inversa. Como não existe atomicidade real entre serviços (a confirmação em duas fases é rara e frágil), troca-se atomicidade por **consistência eventual**. Em Node, implementa-se com uma máquina de estados persistida, filas ou eventos, **outbox** e **idempotência**, ou com um engine de workflows duráveis, como o Temporal.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedido, no caminho feliz",
        etapas: [
          "O cliente faz o pedido: o serviço de pedidos cria o pedido como `PENDENTE` e inicia a saga, gravando o seu estado (`iniciada`)",
          "Passo 1, estoque: o serviço de estoque reserva os itens (uma transação local) e confirma",
          "Passo 2, pagamento: o serviço de pagamentos cobra o cliente e confirma",
          "Passo 3, entrega: o serviço de entrega emite a etiqueta e confirma",
          "A saga marca o pedido como `CONFIRMADO` e termina como `concluída`",
        ],
        nota: "Cada passo é uma transação local e atômica dentro do seu serviço, com o seu próprio banco. O que a saga junta é a sequência, não uma transação única.",
      },
      {
        tipo: "passos",
        titulo: "E quando o pagamento falha",
        passos: [
          {
            titulo: "O pagamento é recusado",
            texto:
              "O serviço de pagamentos responde que o cartão foi negado. O passo 1 já terminou e a reserva de estoque existe: ela não some sozinha, porque não há rollback entre serviços.",
          },
          {
            titulo: "A saga compensa em ordem inversa",
            texto:
              "Para cada passo já concluído, do último ao primeiro, a saga executa a **transação compensatória**: aqui, `liberarEstoque`. Depois marca o pedido como `CANCELADO` e a saga como `compensada`. Compensar é uma ação de negócio nova (liberar, estornar, cancelar), não apagar o que aconteceu.",
          },
          {
            titulo: "A compensação precisa ser confiável",
            texto:
              "Ela também pode falhar, então deve ser **idempotente** e repetida, com espera crescente, até dar certo ou ser entregue a uma pessoa. Também precisa ser segura se a ação original nunca chegou a acontecer (um timeout, por exemplo).",
          },
          {
            titulo: "O parceiro não responde",
            texto:
              "Se o pagamento estourou o tempo, não se sabe se houve cobrança. A saga define um **timeout**, consulta o estado do pagamento (ou repete a cobrança com a mesma chave de idempotência) antes de compensar, para não cobrar duas vezes nem estornar o que não foi cobrado.",
          },
          {
            titulo: "O processo cai no meio",
            texto:
              "Como o estado da saga está persistido (quais passos terminaram), ao reiniciar ela retoma do último ponto registrado, em vez de recomeçar do zero ou ficar esquecida com o pedido preso em `PENDENTE`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma saga como lista de passos com compensação",
        legenda: "JavaScript",
        codigo: [
          "const passos = [",
          '  { nome: "estoque",   agir: reservarEstoque, compensar: liberarEstoque },',
          '  { nome: "pagamento", agir: cobrar,          compensar: estornar },',
          '  { nome: "entrega",   agir: emitirEntrega,   compensar: cancelarEntrega },',
          "];",
          "",
          "export async function executar(saga, repo) {",
          "  for (const [i, passo] of passos.entries()) {",
          "    if (saga.concluidos.includes(passo.nome)) continue; // retomada após uma queda",
          "    try {",
          "      await passo.agir(saga); // idempotente: usa saga.id como chave",
          "      await repo.marcarConcluido(saga.id, passo.nome); // estado persistido",
          "    } catch {",
          "      for (const feito of passos.slice(0, i + 1).reverse()) await feito.compensar(saga);",
          '      return repo.finalizar(saga.id, "compensada");',
          "    }",
          "  }",
          '  return repo.finalizar(saga.id, "concluida");',
          "}",
        ].join("\n"),
        nota: "É um esboço. Compensar também o passo que falhou é seguro porque a compensação é idempotente e tolera uma ação que não ocorreu. Faltam o estado “compensando” persistido, as retentativas das compensações e os timeouts, que um engine de workflows traz prontos.",
      },
      {
        tipo: "tabela",
        titulo: "As peças de uma saga confiável",
        colunas: ["Peça", "Problema que resolve", "Como fica em Node"],
        linhas: [
          [
            "Estado da saga persistido",
            "Queda do processo no meio do fluxo",
            "Uma linha por saga (`saga_id`, passo, status) atualizada em transação, ou o histórico de um engine de workflows",
          ],
          [
            "Outbox transacional",
            "Gravar no banco e publicar na fila são dois sistemas; cair entre os dois perde o evento",
            "Tabela `outbox` gravada na mesma transação do negócio, com um publicador que lê e envia (entrega pelo menos uma vez)",
          ],
          [
            "Idempotência",
            "Mensagens e retentativas chegam repetidas",
            "Chave de idempotência, restrição `UNIQUE` ou registro de mensagens já processadas (veja L104)",
          ],
          [
            "Retentativas e timeouts",
            "Parceiro lento ou fora do ar",
            "Espera exponencial com jitter, prazo por passo e filas com reentrega (veja L105)",
          ],
          [
            "Compensação",
            "Desfazer o efeito dos passos já feitos",
            "Uma ação inversa de negócio por passo (liberar, estornar, cancelar), idempotente",
          ],
          [
            "Condução do fluxo",
            "Saber o próximo passo e onde a saga parou",
            "Máquina de estados em código, ou um engine de workflows como o Temporal; confira a documentação",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que não há atomicidade real entre serviços",
        texto:
          "Não existe um `COMMIT` único que cubra vários serviços, cada um com o seu banco. A **confirmação em duas fases** (2PC) tenta isso com um coordenador, mas mantém recursos travados enquanto espera, depende do coordenador e de cada participante suportar o protocolo (filas e APIs de terceiros em geral não suportam), e por isso é rara entre microsserviços. A saga troca atomicidade por **consistência eventual com compensação**: ou termina, ou é desfeita pelo lado do negócio, e **os estados intermediários ficam visíveis** (pedido `PENDENTE`), então modele-os. A saga pode ser conduzida por um coordenador (orquestração) ou por eventos que cada serviço escuta (coreografia); veja P58.",
      },
    ],
    armadilhas: [
      "Tratar a compensação como um rollback de banco: ela é uma nova ação de negócio, pode falhar, não devolve o estado idêntico e precisa ser idempotente e repetida até dar certo.",
      "Gravar no banco e publicar o evento em duas etapas, sem outbox: se o processo cai no meio, o banco muda e o próximo passo nunca é disparado.",
      "Saga sem estado persistido e sem timeout: uma queda ou um parceiro mudo deixa o pedido preso para sempre.",
      "Colocar no começo um passo que não pode ser desfeito (e-mail enviado, mercadoria despachada): deixe esses passos por último, depois dos que ainda podem falhar.",
    ],
    autoteste: [
      {
        pergunta: "O estoque foi reservado e o pagamento foi recusado. O que a saga faz?",
        resposta:
          "Executa as compensações dos passos já concluídos, em ordem inversa: libera a reserva de estoque e cancela o pedido. A compensação é idempotente e repetida até funcionar, e a saga termina como compensada.",
      },
      {
        pergunta: "Por que não usar uma transação distribuída (2PC) entre os serviços?",
        resposta:
          "Porque ela trava recursos enquanto espera, depende de um coordenador e de todos os participantes suportarem o protocolo, o que filas e APIs de terceiros em geral não fazem. A saga aceita estados intermediários e consistência eventual em troca de disponibilidade e autonomia dos serviços.",
      },
    ],
  },
  en: {
    titulo: "Sagas",
    pergunta: "What are sagas in microservice orchestration and how are they implemented in Node.js?",
    porqueEsteMetodo:
      "A saga is a process that unfolds over time, and what defines it is what happens when a step fails midway. Following one order, first on the happy path and then on the path where the payment fails, shows who undoes what, and in which order.",
    resposta30s:
      "A **saga** splits an operation that crosses services into a sequence of **local transactions**, each with a **compensating action** that undoes it from the business point of view; if a step fails, the saga runs the compensations of the steps already done, in reverse order. Since there is no real atomicity across services (two-phase commit is rare and fragile), atomicity is traded for **eventual consistency**. In Node, you build it with a persisted state machine, queues or events, an **outbox** and **idempotency**, or with a durable workflow engine such as Temporal.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One order, on the happy path",
        etapas: [
          "The customer places the order: the orders service creates it as `PENDING` and starts the saga, saving its state (`started`)",
          "Step 1, stock: the stock service reserves the items (a local transaction) and confirms",
          "Step 2, payment: the payments service charges the customer and confirms",
          "Step 3, shipping: the shipping service issues the label and confirms",
          "The saga marks the order as `CONFIRMED` and ends as `completed`",
        ],
        nota: "Each step is a local, atomic transaction inside its own service, with its own database. What the saga ties together is the sequence, not a single transaction.",
      },
      {
        tipo: "passos",
        titulo: "And when the payment fails",
        passos: [
          {
            titulo: "The payment is declined",
            texto:
              "The payments service replies that the card was declined. Step 1 has already finished and the stock reservation exists: it does not vanish on its own, because there is no rollback across services.",
          },
          {
            titulo: "The saga compensates in reverse order",
            texto:
              "For each completed step, from last to first, the saga runs the **compensating transaction**: here, `releaseStock`. Then it marks the order `CANCELLED` and the saga `compensated`. Compensating is a new business action (release, refund, cancel), not erasing what happened.",
          },
          {
            titulo: "The compensation must be reliable",
            texto:
              "It can fail too, so it must be **idempotent** and retried, with growing waits, until it works or is handed to a person. It must also be safe if the original action never actually happened (a timeout, for example).",
          },
          {
            titulo: "The partner does not answer",
            texto:
              "If the payment timed out, you do not know whether a charge happened. The saga sets a **timeout** and checks the payment status (or repeats the charge with the same idempotency key) before compensating, so it neither charges twice nor refunds something that was never charged.",
          },
          {
            titulo: "The process crashes midway",
            texto:
              "Because the saga state is persisted (which steps finished), on restart it resumes from the last recorded point instead of starting over or being forgotten with the order stuck in `PENDING`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A saga as a list of steps with compensation",
        legenda: "JavaScript",
        codigo: [
          "const steps = [",
          '  { name: "stock",    act: reserveStock, compensate: releaseStock },',
          '  { name: "payment",  act: charge,       compensate: refund },',
          '  { name: "shipping", act: issueLabel,   compensate: cancelShipping },',
          "];",
          "",
          "export async function run(saga, repo) {",
          "  for (const [i, step] of steps.entries()) {",
          "    if (saga.completed.includes(step.name)) continue; // resuming after a crash",
          "    try {",
          "      await step.act(saga); // idempotent: uses saga.id as the key",
          "      await repo.markCompleted(saga.id, step.name); // persisted state",
          "    } catch {",
          "      for (const done of steps.slice(0, i + 1).reverse()) await done.compensate(saga);",
          '      return repo.finish(saga.id, "compensated");',
          "    }",
          "  }",
          '  return repo.finish(saga.id, "completed");',
          "}",
        ].join("\n"),
        nota: "This is a sketch. Compensating the failed step too is safe because the compensation is idempotent and tolerates an action that did not happen. Missing are a persisted “compensating” state, retries of the compensations and timeouts, which a workflow engine provides out of the box.",
      },
      {
        tipo: "tabela",
        titulo: "The parts of a reliable saga",
        colunas: ["Part", "Problem it solves", "What it looks like in Node"],
        linhas: [
          [
            "Persisted saga state",
            "The process crashing midway through the flow",
            "One row per saga (`saga_id`, step, status) updated in a transaction, or the history of a workflow engine",
          ],
          [
            "Transactional outbox",
            "Writing to the database and publishing to the queue are two systems; crashing between them loses the event",
            "An `outbox` table written in the same transaction as the business data, with a publisher that reads and sends (at-least-once delivery)",
          ],
          [
            "Idempotency",
            "Messages and retries arrive more than once",
            "An idempotency key, a `UNIQUE` constraint or a record of already processed messages (see L104)",
          ],
          [
            "Retries and timeouts",
            "A slow or unavailable partner",
            "Exponential backoff with jitter, a deadline per step and queues with redelivery (see L105)",
          ],
          [
            "Compensation",
            "Undoing the effect of steps already done",
            "One inverse business action per step (release, refund, cancel), idempotent",
          ],
          [
            "Driving the flow",
            "Knowing the next step and where the saga stopped",
            "A state machine in code, or a workflow engine such as Temporal; check the documentation",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why there is no real atomicity across services",
        texto:
          "There is no single `COMMIT` that covers several services, each with its own database. **Two-phase commit** (2PC) tries it with a coordinator, but it keeps resources locked while waiting, depends on the coordinator and on every participant supporting the protocol (queues and third-party APIs generally do not), and so it is rare among microservices. A saga trades atomicity for **eventual consistency with compensation**: it either finishes or is undone on the business side, and **the intermediate states are visible** (an order in `PENDING`), so model them. A saga can be driven by a coordinator (orchestration) or by events each service listens to (choreography); see P58.",
      },
    ],
    armadilhas: [
      "Treating compensation as a database rollback: it is a new business action, it can fail, it does not restore the exact same state, and it must be idempotent and retried until it works.",
      "Writing to the database and publishing the event in two separate steps, with no outbox: if the process crashes in between, the database changes and the next step is never triggered.",
      "A saga with no persisted state and no timeout: a crash or a silent partner leaves the order stuck forever.",
      "Putting a step that cannot be undone (an email sent, goods shipped) early in the flow: leave those steps for last, after the ones that can still fail.",
    ],
    autoteste: [
      {
        pergunta: "The stock was reserved and the payment was declined. What does the saga do?",
        resposta:
          "It runs the compensations of the completed steps, in reverse order: it releases the stock reservation and cancels the order. The compensation is idempotent and retried until it works, and the saga ends as compensated.",
      },
      {
        pergunta: "Why not use a distributed transaction (2PC) across the services?",
        resposta:
          "Because it locks resources while waiting, depends on a coordinator and on every participant supporting the protocol, which queues and third-party APIs generally do not. A saga accepts intermediate states and eventual consistency in exchange for availability and service autonomy.",
      },
    ],
  },
};
