import type { Pergunta } from "../../tipos";

// R18 · Benefícios da fila de mensagens
export const r18: Pergunta = {
  numero: 118,
  modulo: "roadmap-intermediario",
  metodo: "feynman",
  pt: {
    titulo: "Benefícios da fila de mensagens",
    pergunta: "Você pode explicar o uso e os benefícios de uma fila de mensagens em um sistema distribuído?",
    porqueEsteMetodo:
      "Uma fila é fácil de entender como caixa de correio. A analogia mostra os benefícios, e o ponto onde ela quebra (entrega duplicada e fora de ordem) mostra os custos.",
    resposta30s:
      "A fila fica entre **produtores** e **consumidores** e traz **desacoplamento** (um não precisa estar no ar junto com o outro), **buffer de picos** (o consumidor processa no seu ritmo), **resiliência** (mensagens esperam se o consumidor cair e são reprocessadas), **escala** (mais consumidores em paralelo) e **retentativas/DLQ**. O preço: entrega ao menos uma vez, duplicatas, ordem limitada e consistência eventual.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma caixa de correio na entrada do prédio: o carteiro deixa a carta e vai embora sem esperar o morador, que pega quando puder. Se chegarem 50 cartas de uma vez, elas esperam na caixa.",
        tecnico:
          "Os serviços **publicam eventos** na fila e outros **reagem** a eles, em vez de consultarem uns aos outros o tempo todo (polling): é a base de uma arquitetura reativa. Isso desacopla no tempo e permite escalar cada lado separadamente.",
        limite:
          "A caixa de correio não garante que a carta será lida uma única vez, nem na ordem de chegada. Filas trazem **entrega ao menos uma vez**, duplicatas, ordem limitada e a necessidade de monitorar.",
      },
      {
        tipo: "tabela",
        titulo: "Com e sem fila",
        colunas: ["", "Chamada direta", "Com fila"],
        linhas: [
          ["Acoplamento", "Alto: depende de o outro estar no ar", "Baixo: só conhecem a fila"],
          ["Pico de tráfego", "Derruba o destino", "A fila absorve; o consumidor segue no seu ritmo"],
          ["Falha do consumidor", "Erro para quem chamou", "A mensagem espera e é reprocessada"],
          ["Resposta ao cliente", "Depende de toda a cadeia", "Responde depois de enfileirar"],
          ["Complexidade", "Menor", "Maior: duplicatas, ordem, monitoramento"],
        ],
        nota: "Para desenhar uma fila do zero, veja a Q22; para eventos, a Q04.",
      },
    ],
    armadilhas: [
      "Achar que a fila garante “exatamente uma vez”.",
      "Fila sem DLQ e sem monitoramento do atraso.",
      "Usar fila quando uma chamada síncrona simples resolveria.",
    ],
    autoteste: [
      {
        pergunta: "Cite três benefícios de uma fila de mensagens.",
        resposta:
          "Desacoplamento, absorção de picos (buffer) e resiliência com retentativas; também permite escalar consumidores.",
      },
      {
        pergunta: "Qual o preço de usar uma fila?",
        resposta: "Mais complexidade: duplicatas, ordem limitada, consistência eventual e necessidade de monitorar.",
      },
    ],
  },
  en: {
    titulo: "Benefits of a message queue",
    pergunta: "Can you explain the use and benefits of a message queue in a distributed system?",
    porqueEsteMetodo:
      "A queue is easy to grasp as a mailbox. The analogy shows the benefits, and the point where it breaks (duplicate and out-of-order delivery) shows the costs.",
    resposta30s:
      "The queue sits between **producers** and **consumers** and brings **decoupling** (one need not be up at the same time as the other), **spike buffering** (the consumer works at its own pace), **resilience** (messages wait if the consumer dies and are reprocessed), **scale** (more consumers in parallel) and **retries/DLQ**. The price: at-least-once delivery, duplicates, limited ordering and eventual consistency.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A mailbox at the building entrance: the mail carrier drops the letter and leaves without waiting for the resident, who picks it up when able. If 50 letters arrive at once, they wait in the box.",
        tecnico:
          "Services **publish events** to the queue and others **react** to them, instead of polling each other all the time: this is the basis of a reactive architecture. It decouples in time and lets each side scale separately.",
        limite:
          "The mailbox does not guarantee a letter is read only once, or in arrival order. Queues bring **at-least-once delivery**, duplicates, limited ordering and the need to monitor.",
      },
      {
        tipo: "tabela",
        titulo: "With and without a queue",
        colunas: ["", "Direct call", "With a queue"],
        linhas: [
          ["Coupling", "High: depends on the other being up", "Low: they only know the queue"],
          ["Traffic spike", "Takes the target down", "The queue absorbs; the consumer keeps its pace"],
          ["Consumer failure", "Error to the caller", "The message waits and is reprocessed"],
          ["Response to the client", "Depends on the whole chain", "Replies after enqueueing"],
          ["Complexity", "Lower", "Higher: duplicates, ordering, monitoring"],
        ],
        nota: "To design a queue from scratch, see Q22; for events, Q04.",
      },
    ],
    armadilhas: [
      "Believing the queue guarantees “exactly once”.",
      "A queue with no DLQ and no lag monitoring.",
      "Using a queue when a simple synchronous call would do.",
    ],
    autoteste: [
      {
        pergunta: "Name three benefits of a message queue.",
        resposta:
          "Decoupling, spike absorption (buffer) and resilience through retries; it also allows scaling consumers.",
      },
      {
        pergunta: "What is the price of using a queue?",
        resposta: "More complexity: duplicates, limited ordering, eventual consistency and the need to monitor.",
      },
    ],
  },
};
