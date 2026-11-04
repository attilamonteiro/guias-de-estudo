import type { Pergunta } from "../../tipos";

// P58 · Orquestração x coreografia
export const p058: Pergunta = {
  numero: 758,
  modulo: "pawanmkr-distribuidos",
  metodo: "compare",
  pt: {
    titulo: "Orquestração x coreografia",
    pergunta: "Explique as diferenças entre orquestração e coreografia de serviços.",
    porqueEsteMetodo:
      "São duas respostas ao mesmo problema (fazer vários serviços cumprirem um processo) com custos opostos. Uma matriz lado a lado, com o mesmo exemplo de pedido nas duas, mostra onde cada uma ganha e perde, e a regra de decisão diz quando escolher cada uma.",
    resposta30s:
      "Na **orquestração**, um coordenador central chama os serviços em ordem e decide o próximo passo: o fluxo fica visível num lugar só, ao custo de um ponto de acoplamento e de falha. Na **coreografia**, não há chefe: cada serviço reage a eventos dos outros e publica os seus, com menos acoplamento direto, mas o fluxo fica espalhado e difícil de depurar. Fluxos longos, com compensação e prazos, tendem à orquestração; reações simples e independentes, à coreografia; e muitos sistemas misturam as duas.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Orquestração e coreografia, lado a lado",
        colunas: ["Critério", "Orquestração", "Coreografia"],
        linhas: [
          [
            "Quem decide o próximo passo",
            "Um coordenador (orquestrador) chama cada serviço, espera a resposta e decide o que vem depois",
            "Ninguém decide sozinho: cada serviço reage a um evento e publica o seu",
          ],
          [
            "O mesmo pedido",
            "O orquestrador de pedidos manda “reservar estoque”, depois “cobrar”, depois “emitir entrega”, na ordem",
            "Pedidos publica `PedidoCriado`; Estoque reage e publica `EstoqueReservado`; Pagamentos reage e publica `PagamentoAprovado`; Entrega reage a este",
          ],
          [
            "Acoplamento",
            "O orquestrador conhece todos os serviços e os chama; os serviços não conhecem uns aos outros",
            "Os serviços só conhecem os eventos, mas o contrato de cada evento é um acoplamento implícito",
          ],
          [
            "Visibilidade do fluxo",
            "O processo está escrito num lugar só: fácil de ler, testar e ver em que passo cada pedido está",
            "O fluxo é consequência das reações: difícil enxergar o todo e depurar quando algo não acontece",
          ],
          [
            "Falhas e compensação (veja P36)",
            "O orquestrador sabe onde parou e comanda as compensações, em ordem inversa",
            "Cada serviço publica falhas e os outros compensam por conta própria; é difícil garantir que todos reagiram",
          ],
          [
            "Riscos estruturais",
            "Vira gargalo e ponto único de falha, e tende a acumular regras de todos os serviços",
            "Depende do broker de eventos; eventos mal desenhados criam ciclos e dependências escondidas",
          ],
          [
            "Rastreabilidade",
            "O estado do processo fica no orquestrador, que pode expô-lo",
            "Exige um id de correlação (trace id) propagado em todos os eventos e tracing distribuído",
          ],
          [
            "Mudar o processo",
            "Edita-se o orquestrador, em um lugar",
            "Acrescenta-se ou altera-se a reação em vários serviços, em times diferentes",
          ],
        ],
        nota: "Ferramentas: engines de workflow duráveis (como o Temporal) ajudam a orquestrar; brokers de eventos e filas (Kafka, RabbitMQ, serviços de nuvem) sustentam a coreografia. Confira a documentação do que adotar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha a **orquestração** quando o processo é longo, tem ordem, condições, prazos ou compensações, e alguém precisa enxergar e responder pelo estado (pedido, pagamento, contratação). Escolha a **coreografia** quando poucos passos independentes reagem a um fato (notificar, atualizar um índice de busca, alimentar análises) e os times precisam evoluir sem coordenação central. Na prática, o **híbrido** é comum: orquestração dentro de um processo complexo (a saga do pedido) e coreografia entre áreas, com o orquestrador publicando eventos para quem quiser reagir.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os dois extremos que dão errado",
        texto:
          "O orquestrador que sabe demais vira um “deus”: absorve as regras de negócio dos serviços e vira um monólito distribuído. Ele deve coordenar, não decidir regras que são de cada domínio. Do outro lado, a coreografia sem disciplina vira um emaranhado de eventos em que ninguém sabe quem escuta o quê, e um fluxo que nunca termina não deixa rastro de onde parou. E orquestração não significa chamadas síncronas: o orquestrador pode mandar mensagens e esperar as respostas de forma assíncrona. Nos dois estilos, propague ids de correlação e registre o caminho.",
      },
    ],
    armadilhas: [
      "Achar que coreografia é “sem acoplamento”: o acoplamento passa para os contratos dos eventos, e mudar um evento quebra ouvintes que você nem conhece.",
      "Deixar o orquestrador acumular regras de negócio dos serviços: ele vira o ponto de mudança de tudo e um gargalo de times.",
      "Coreografar sem id de correlação nem tracing: quando um pedido trava, ninguém consegue dizer em que serviço ele parou.",
      "Confundir orquestração com chamada síncrona, ou coreografia com “usar uma fila”: o que muda é quem conhece e conduz o fluxo, não o transporte.",
    ],
    autoteste: [
      {
        pergunta: "Onde mora o conhecimento do fluxo em cada estilo?",
        resposta:
          "Na orquestração, no orquestrador, que o tem escrito num lugar. Na coreografia, ele está distribuído nas reações de cada serviço aos eventos dos outros, e o fluxo aparece só como consequência.",
      },
      {
        pergunta: "Para um pedido com cobrança e compensação, qual estilo você escolheria e por quê?",
        resposta:
          "Tendência à orquestração (ou híbrido): o fluxo tem ordem, prazos e compensação, e é preciso saber em que passo cada pedido está. Os demais domínios (notificação, análises) podem reagir aos eventos que o orquestrador publica.",
      },
    ],
  },
  en: {
    titulo: "Orchestration vs choreography",
    pergunta: "Explain the differences between service orchestration and choreography.",
    porqueEsteMetodo:
      "They are two answers to the same problem (getting several services to carry out one process) with opposite costs. A side-by-side matrix, with the same order example in both, shows where each wins and loses, and the decision rule says when to choose each.",
    resposta30s:
      "In **orchestration**, a central coordinator calls the services in order and decides the next step: the flow is visible in one place, at the cost of a point of coupling and failure. In **choreography**, there is no boss: each service reacts to events from the others and publishes its own, with less direct coupling, but the flow is spread out and hard to debug. Long flows with compensation and deadlines lean toward orchestration; simple, independent reactions toward choreography; and many systems mix the two.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Orchestration and choreography, side by side",
        colunas: ["Criterion", "Orchestration", "Choreography"],
        linhas: [
          [
            "Who decides the next step",
            "A coordinator (the orchestrator) calls each service, waits for the answer and decides what comes next",
            "Nobody decides alone: each service reacts to an event and publishes its own",
          ],
          [
            "The same order",
            "The order orchestrator says “reserve stock”, then “charge”, then “issue shipping”, in that order",
            "Orders publishes `OrderCreated`; Stock reacts and publishes `StockReserved`; Payments reacts and publishes `PaymentApproved`; Shipping reacts to that",
          ],
          [
            "Coupling",
            "The orchestrator knows all the services and calls them; the services do not know each other",
            "Services only know the events, but each event contract is an implicit coupling",
          ],
          [
            "Flow visibility",
            "The process is written in one place: easy to read, test and see which step each order is at",
            "The flow is a consequence of reactions: hard to see the whole and to debug when something does not happen",
          ],
          [
            "Failures and compensation (see P36)",
            "The orchestrator knows where it stopped and commands the compensations, in reverse order",
            "Each service publishes failures and the others compensate on their own; it is hard to guarantee everyone reacted",
          ],
          [
            "Structural risks",
            "It becomes a bottleneck and a single point of failure, and tends to accumulate every service’s rules",
            "It depends on the event broker; badly designed events create cycles and hidden dependencies",
          ],
          [
            "Traceability",
            "The process state lives in the orchestrator, which can expose it",
            "Requires a correlation id (trace id) propagated in every event, plus distributed tracing",
          ],
          [
            "Changing the process",
            "You edit the orchestrator, in one place",
            "You add or change the reaction in several services, owned by different teams",
          ],
        ],
        nota: "Tools: durable workflow engines (such as Temporal) help orchestrate; event brokers and queues (Kafka, RabbitMQ, cloud services) support choreography. Check the documentation of whatever you adopt.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose **orchestration** when the process is long, has order, conditions, deadlines or compensations, and someone needs to see and answer for its state (order, payment, onboarding). Choose **choreography** when a few independent steps react to a fact (notify, update a search index, feed analytics) and the teams need to evolve without central coordination. In practice, the **hybrid** is common: orchestration inside a complex process (the order saga) and choreography between areas, with the orchestrator publishing events for anyone who wants to react.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The two extremes that go wrong",
        texto:
          "An orchestrator that knows too much becomes a “god”: it absorbs the services’ business rules and turns into a distributed monolith. It should coordinate, not decide rules that belong to each domain. On the other side, undisciplined choreography turns into a tangle of events in which nobody knows who listens to what, and a flow that never finishes leaves no trace of where it stopped. And orchestration does not mean synchronous calls: the orchestrator can send messages and wait for the replies asynchronously. In both styles, propagate correlation ids and record the path.",
      },
    ],
    armadilhas: [
      "Thinking choreography means “no coupling”: the coupling moves to the event contracts, and changing an event breaks listeners you do not even know about.",
      "Letting the orchestrator accumulate the services’ business rules: it becomes the point of change for everything and a bottleneck between teams.",
      "Choreographing with no correlation id and no tracing: when an order gets stuck, nobody can say which service it stopped at.",
      "Confusing orchestration with synchronous calls, or choreography with “using a queue”: what differs is who knows and drives the flow, not the transport.",
    ],
    autoteste: [
      {
        pergunta: "Where does the knowledge of the flow live in each style?",
        resposta:
          "In orchestration, in the orchestrator, which has it written in one place. In choreography, it is spread across each service’s reactions to the others’ events, and the flow shows up only as a consequence.",
      },
      {
        pergunta: "For an order with payment and compensation, which style would you choose and why?",
        resposta:
          "Leaning toward orchestration (or a hybrid): the flow has order, deadlines and compensation, and you need to know which step each order is at. Other domains (notifications, analytics) can react to the events the orchestrator publishes.",
      },
    ],
  },
};
