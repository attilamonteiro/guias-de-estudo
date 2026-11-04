import type { Pergunta } from "../../tipos";

// Q05 · Trabalhos em segundo plano
export const q05: Pergunta = {
  numero: 5,
  modulo: "arquitetura",
  metodo: "playbook",
  pt: {
    titulo: "Trabalhos em segundo plano",
    pergunta: "Como você lida com trabalhos de fundo em um sistema backend?",
    porqueEsteMetodo:
      "“Como você lida…” pede um procedimento: a ordem em que você decide, enfileira, executa, repete e observa. Um playbook mostra cada decisão e o sinal de cada etapa.",
    resposta30s:
      "Tire do caminho da requisição o que é lento ou não precisa de resposta imediata: a API **enfileira** o trabalho e responde rápido, e **workers** separados o consomem. Como a entrega é “ao menos uma vez”, o job precisa ser **idempotente**, ter **retentativas com backoff**, **DLQ** para o que esgotar tentativas e **métricas** (tamanho e idade da fila, taxa de falha).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Decida o que vai para o fundo",
            texto:
              "Tarefas lentas (mais de ~1 s), que podem esperar ou falhar e tentar de novo: e-mails, relatórios, imagens, webhooks, integrações. O que o usuário precisa ver agora continua síncrono.",
          },
          {
            titulo: "Enfileire e responda",
            texto:
              "A API grava o pedido, publica o job numa fila (SQS, RabbitMQ, Redis/BullMQ, Sidekiq, Celery; ou uma tabela no Postgres com `FOR UPDATE SKIP LOCKED` em escala menor) e devolve `202` com um ID.",
          },
          {
            titulo: "Workers separados do web",
            texto:
              "Processos próprios, escalados de forma independente, com limite de concorrência para não esmagar o banco ou a API externa.",
          },
          {
            titulo: "Garanta idempotência",
            texto:
              "A fila entrega ao menos uma vez, então duplicatas existem. Use uma chave do job e verifique se já foi feito (`UNIQUE`, tabela de dedupe, operações naturalmente idempotentes).",
          },
          {
            titulo: "Retentativas com backoff e jitter",
            texto:
              "Erro transitório (rede, 503): tente de novo em 1 s, 2 s, 4 s… mais um tempo aleatório, com teto. Erro permanente (dado inválido): não repita.",
          },
          {
            titulo: "DLQ e alerta",
            texto:
              "O que esgotou as tentativas vai para uma fila de mensagens mortas, com alerta e um jeito de reprocessar depois de corrigir a causa.",
          },
          {
            titulo: "Jobs longos e agendados",
            texto:
              "Divida em passos com checkpoint; use timeout de visibilidade ou heartbeat. Em cron, garanta que só uma instância dispare (lock de líder), senão roda duplicado.",
          },
          {
            titulo: "Observe e desligue com elegância",
            texto:
              "Profundidade da fila, **idade da mensagem mais antiga**, duração, taxa de falha, trace ID da requisição original. No shutdown, termine o job atual antes de morrer.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "worker (pseudocódigo)",
        codigo:
          "job = fila.receber()                        # ao menos uma vez\nif ja_processado(job.id): return ack(job)   # idempotência\ntry:\n    executar(job)\n    marcar_processado(job.id)\n    ack(job)\nexcept ErroTransitorio:\n    reenfileirar(job, atraso=backoff(job.tentativas))   # 1s, 2s, 4s... + jitter\nexcept Exception:\n    enviar_para_dlq(job)",
      },
    ],
    armadilhas: [
      "“Background” como uma thread solta dentro do processo web: se o servidor reinicia no deploy, o trabalho se perde.",
      "Retentativa imediata e sem limite: uma API externa fora do ar recebe uma tempestade de chamadas quando volta.",
      "Fila crescendo sem alerta: o sintoma real é a idade da mensagem mais antiga, não o CPU.",
      "Job que não é idempotente: a retentativa cobra duas vezes ou manda dois e-mails.",
    ],
    autoteste: [
      {
        pergunta: "Por que o backoff precisa de jitter?",
        resposta:
          "Sem aleatoriedade, todos os jobs que falharam voltam no mesmo instante e geram uma nova rajada (thundering herd). O jitter espalha as tentativas.",
      },
      {
        pergunta: "O que fazer com um job que falha sempre?",
        resposta:
          "Parar de tentar após o limite, mandá-lo para a DLQ, alertar e reprocessar depois de corrigir a causa.",
      },
    ],
  },
  en: {
    titulo: "Background jobs",
    pergunta: "How do you handle background jobs in a backend system?",
    porqueEsteMetodo:
      "“How do you handle…” asks for a procedure: the order in which you decide, enqueue, run, retry and observe. A playbook shows each decision and the signal at each stage.",
    resposta30s:
      "Move whatever is slow or does not need an immediate answer out of the request path: the API **enqueues** the work and answers fast, and separate **workers** consume it. Because delivery is “at least once”, jobs must be **idempotent**, with **retries using backoff**, a **DLQ** for what exhausts its attempts, and **metrics** (queue size and age, failure rate).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Decide what goes to the background",
            texto:
              "Slow tasks (over ~1 s) that can wait or fail and retry: emails, reports, images, webhooks, integrations. What the user must see now stays synchronous.",
          },
          {
            titulo: "Enqueue and answer",
            texto:
              "The API stores the request, publishes the job to a queue (SQS, RabbitMQ, Redis/BullMQ, Sidekiq, Celery; or a Postgres table with `FOR UPDATE SKIP LOCKED` at smaller scale) and returns `202` with an ID.",
          },
          {
            titulo: "Workers separate from web",
            texto:
              "Their own processes, scaled independently, with a concurrency limit so they do not crush the database or the external API.",
          },
          {
            titulo: "Guarantee idempotency",
            texto:
              "The queue delivers at least once, so duplicates exist. Use a job key and check whether it was already done (`UNIQUE`, dedupe table, naturally idempotent operations).",
          },
          {
            titulo: "Retries with backoff and jitter",
            texto:
              "Transient error (network, 503): retry after 1 s, 2 s, 4 s… plus a random amount, with a cap. Permanent error (invalid data): do not repeat.",
          },
          {
            titulo: "DLQ and alerting",
            texto:
              "What exhausted its attempts goes to a dead-letter queue, with an alert and a way to reprocess after fixing the cause.",
          },
          {
            titulo: "Long and scheduled jobs",
            texto:
              "Split into steps with checkpoints; use a visibility timeout or heartbeat. For cron, ensure only one instance fires (leader lock), or it runs duplicated.",
          },
          {
            titulo: "Observe and shut down gracefully",
            texto:
              "Queue depth, **age of the oldest message**, duration, failure rate, trace ID of the originating request. On shutdown, finish the current job before dying.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "worker (pseudocode)",
        codigo:
          "job = queue.receive()                       # at least once\nif already_processed(job.id): return ack(job)   # idempotency\ntry:\n    run(job)\n    mark_processed(job.id)\n    ack(job)\nexcept TransientError:\n    requeue(job, delay=backoff(job.attempts))   # 1s, 2s, 4s... + jitter\nexcept Exception:\n    send_to_dlq(job)",
      },
    ],
    armadilhas: [
      "“Background” as a loose thread inside the web process: if the server restarts on deploy, the work is lost.",
      "Immediate, unlimited retries: an external API that was down gets a storm of calls when it returns.",
      "A queue growing with no alert: the real symptom is the age of the oldest message, not CPU.",
      "A job that is not idempotent: the retry charges twice or sends two emails.",
    ],
    autoteste: [
      {
        pergunta: "Why does backoff need jitter?",
        resposta:
          "Without randomness, every failed job comes back at the same instant and creates a new burst (thundering herd). Jitter spreads the attempts.",
      },
      {
        pergunta: "What do you do with a job that always fails?",
        resposta: "Stop retrying after the limit, send it to the DLQ, alert, and reprocess once the cause is fixed.",
      },
    ],
  },
};
