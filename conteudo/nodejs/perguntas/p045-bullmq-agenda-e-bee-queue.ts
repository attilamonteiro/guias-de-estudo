import type { Pergunta } from "../../tipos";

// P45 · BullMQ, Agenda e Bee-Queue
export const p045: Pergunta = {
  numero: 745,
  modulo: "pawanmkr-jobs-e-arquivos",
  metodo: "compare",
  pt: {
    titulo: "BullMQ, Agenda e Bee-Queue",
    pergunta: "Compare filas de jobs como BullMQ, Agenda e Bee-Queue.",
    porqueEsteMetodo:
      "As três resolvem “rodar trabalho fora da requisição”, mas partem de armazenamentos e de focos diferentes. Uma matriz lado a lado mostra o que cada uma oferece, e a regra de decisão diz por onde começar.",
    resposta30s:
      "**BullMQ** e **Bee-Queue** são filas sobre **Redis**; a **Agenda** é um agendador sobre **MongoDB**. O BullMQ cobre mais recursos (atrasos, repetição, prioridades, limites de taxa, fluxos e retentativas com backoff), o Bee-Queue é enxuto e pensado para jobs curtos, e a Agenda serve melhor quando o centro do problema é **agendar** (rodar às 2h, a cada 10 minutos). Escolha pelo armazenamento que você já opera e pelos recursos de que precisa, e lembre que nas três o job pode rodar mais de uma vez: faça-o **idempotente** (veja L104).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Três ferramentas, três focos",
        colunas: ["Critério", "BullMQ", "Agenda", "Bee-Queue"],
        linhas: [
          ["Armazenamento", "Redis", "MongoDB", "Redis"],
          [
            "Foco",
            "Fila de jobs completa, com workers e muitos recursos",
            "Agendador: quando e com que frequência rodar",
            "Fila simples e leve, pensada para jobs curtos",
          ],
          ["Atraso (rodar depois)", "Sim", "Sim, é o centro do produto (uma data ou “daqui a 2 horas”)", "Sim"],
          [
            "Repetição agendada (cron, intervalo)",
            "Sim, por intervalo ou expressão cron",
            "Sim, é o centro do produto (`every`, cron)",
            "Não é o foco: enfileire a partir de um agendador externo",
          ],
          ["Prioridades", "Sim", "Sim", "Em geral não (confira)"],
          [
            "Limite de taxa",
            "Sim, um limitador por fila (jobs por intervalo de tempo)",
            "Sem limitador por tempo; há limites de concorrência",
            "Não",
          ],
          ["Fluxos e dependências entre jobs", "Sim, jobs pai e filhos (flows)", "Não nativo", "Não"],
          [
            "Retentativas com backoff",
            "Sim, número de tentativas e backoff fixo ou exponencial",
            "Sem política pronta: você reagenda o job quando ele falha",
            "Sim, com estratégias de backoff",
          ],
          [
            "Monitoramento",
            "Eventos e painéis de terceiros ou da comunidade (por exemplo, o Bull Board)",
            "Eventos e um painel da comunidade (Agendash)",
            "Eventos e painéis de terceiros (por exemplo, o Arena; confira o suporte)",
          ],
          [
            "Manutenção do projeto",
            "Confira o estado atual: lançamentos, issues abertas e compatibilidade com o seu Node.js e o seu Redis",
            "Confira o estado atual: lançamentos, issues abertas e compatibilidade com o seu Node.js e o seu MongoDB",
            "Confira o estado atual: lançamentos, issues abertas e compatibilidade com o seu Node.js e o seu Redis",
          ],
        ],
        nota: "Resumo qualitativo: as bibliotecas evoluem. Confira a documentação de cada uma antes de decidir, sobretudo prioridades, limites de taxa e retentativas.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece pelo **armazenamento que você já opera** e pelo **recurso sem o qual não dá para ficar**. Precisa de fluxos, limites de taxa, prioridades e retentativas com backoff sobre Redis: **BullMQ**. Jobs curtos, poucas exigências e Redis à mão: o **Bee-Queue** pode bastar, se a documentação confirmar que ele cobre o que você precisa. O problema é principalmente **agendar** (relatório às 2h, rotina a cada 10 minutos) e você já tem MongoDB: **Agenda**. Se o resto da arquitetura usa SQS, RabbitMQ ou Kafka, compare também esses (veja L103).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que nenhuma delas resolve sozinha",
        texto:
          "Em geral a entrega é **pelo menos uma vez**: se o worker cai no meio ou perde o bloqueio do job, ele volta e roda de novo, então projete cada job como **idempotente** (veja L104). A durabilidade é a do armazenamento: Redis sem persistência, ou com política que remove chaves quando falta memória, pode perder jobs (a documentação do BullMQ recomenda uma política que não remova chaves; confira). E, com várias instâncias da aplicação, deixe o agendamento no armazenamento compartilhado, não em um `setInterval` por instância, para o mesmo job não disparar várias vezes.",
      },
    ],
    armadilhas: [
      "Escolher pelo nome mais conhecido sem conferir a manutenção, a compatibilidade com o seu Node.js e os recursos de que você precisa.",
      "Supor que a fila é durável sem olhar a configuração de persistência do Redis ou do MongoDB.",
      "Esquecer que o job pode rodar duas vezes (falha do worker, bloqueio expirado) e não torná-lo idempotente.",
      "Agendar com `setInterval` ou cron dentro de cada instância da aplicação: com três instâncias, o job roda três vezes.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença de armazenamento e de foco entre as três?",
        resposta:
          "BullMQ e Bee-Queue guardam os jobs no Redis; a Agenda, no MongoDB. O BullMQ é uma fila de jobs de uso amplo, o Bee-Queue é uma fila enxuta para jobs curtos, e a Agenda é um agendador, voltado a quando e com que frequência rodar.",
      },
      {
        pergunta: "Por que um job precisa ser idempotente mesmo com a fila persistente?",
        resposta:
          "Porque a garantia usual é pelo menos uma vez: se o worker cai depois de fazer o trabalho e antes de confirmar, o job é entregue de novo. Sem idempotência, a repetição duplica cobranças ou e-mails.",
      },
    ],
  },
  en: {
    titulo: "BullMQ, Agenda and Bee-Queue",
    pergunta: "Compare job queues like BullMQ, Agenda, and Bee-Queue.",
    porqueEsteMetodo:
      "All three solve “run work outside the request”, but they start from different storage and different focus. A side-by-side matrix shows what each one offers, and the decision rule says where to begin.",
    resposta30s:
      "**BullMQ** and **Bee-Queue** are queues on top of **Redis**; **Agenda** is a scheduler on top of **MongoDB**. BullMQ covers more features (delays, repetition, priorities, rate limits, flows and retries with backoff), Bee-Queue is lean and aimed at short jobs, and Agenda fits best when the core problem is **scheduling** (run at 2 a.m., every 10 minutes). Choose by the storage you already run and the features you need, and remember that with all three a job can run more than once: make it **idempotent** (see L104).",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Three tools, three focuses",
        colunas: ["Criterion", "BullMQ", "Agenda", "Bee-Queue"],
        linhas: [
          ["Storage", "Redis", "MongoDB", "Redis"],
          [
            "Focus",
            "A complete job queue, with workers and many features",
            "A scheduler: when and how often to run",
            "A simple, light queue aimed at short jobs",
          ],
          ["Delay (run later)", "Yes", "Yes, it is the core of the product (a date or “in 2 hours”)", "Yes"],
          [
            "Scheduled repetition (cron, interval)",
            "Yes, by interval or cron expression",
            "Yes, it is the core of the product (`every`, cron)",
            "Not the focus: enqueue from an external scheduler",
          ],
          ["Priorities", "Yes", "Yes", "Generally no (check)"],
          [
            "Rate limit",
            "Yes, a limiter per queue (jobs per time interval)",
            "No time-based limiter; there are concurrency limits",
            "No",
          ],
          ["Flows and dependencies between jobs", "Yes, parent and child jobs (flows)", "Not built in", "No"],
          [
            "Retries with backoff",
            "Yes, number of attempts and fixed or exponential backoff",
            "No ready-made policy: you reschedule the job when it fails",
            "Yes, with backoff strategies",
          ],
          [
            "Monitoring",
            "Events and third-party or community dashboards (for example, Bull Board)",
            "Events and a community dashboard (Agendash)",
            "Events and third-party dashboards (for example, Arena; check the support)",
          ],
          [
            "Project maintenance",
            "Check the current state: releases, open issues and compatibility with your Node.js and your Redis",
            "Check the current state: releases, open issues and compatibility with your Node.js and your MongoDB",
            "Check the current state: releases, open issues and compatibility with your Node.js and your Redis",
          ],
        ],
        nota: "A qualitative summary: libraries evolve. Check each one’s documentation before deciding, especially priorities, rate limits and retries.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start from the **storage you already run** and the **feature you cannot go without**. You need flows, rate limits, priorities and retries with backoff on Redis: **BullMQ**. Short jobs, few demands and Redis at hand: **Bee-Queue** may be enough, if the documentation confirms it covers what you need. The problem is mainly **scheduling** (a report at 2 a.m., a routine every 10 minutes) and you already have MongoDB: **Agenda**. If the rest of the architecture uses SQS, RabbitMQ or Kafka, compare those too (see L103).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What none of them solves on its own",
        texto:
          "Delivery is generally **at least once**: if the worker dies midway or loses the job lock, the job comes back and runs again, so design every job to be **idempotent** (see L104). Durability is the storage’s durability: Redis without persistence, or with a policy that evicts keys when memory runs out, can lose jobs (the BullMQ documentation recommends a policy that does not evict keys; check it). And with several application instances, keep the scheduling in the shared storage, not in a `setInterval` per instance, so the same job does not fire several times.",
      },
    ],
    armadilhas: [
      "Choosing by the best-known name without checking maintenance, compatibility with your Node.js and the features you need.",
      "Assuming the queue is durable without looking at the persistence setup of Redis or MongoDB.",
      "Forgetting that a job can run twice (worker failure, expired lock) and not making it idempotent.",
      "Scheduling with `setInterval` or cron inside every application instance: with three instances, the job runs three times.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference in storage and focus between the three?",
        resposta:
          "BullMQ and Bee-Queue keep jobs in Redis; Agenda keeps them in MongoDB. BullMQ is a broad-purpose job queue, Bee-Queue is a lean queue for short jobs, and Agenda is a scheduler, centered on when and how often to run.",
      },
      {
        pergunta: "Why must a job be idempotent even with a persistent queue?",
        resposta:
          "Because the usual guarantee is at least once: if the worker dies after doing the work and before acknowledging, the job is delivered again. Without idempotency, the repeat duplicates charges or emails.",
      },
    ],
  },
};
