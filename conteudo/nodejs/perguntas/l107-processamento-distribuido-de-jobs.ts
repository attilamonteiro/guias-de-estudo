import type { Pergunta } from "../../tipos";

// L107 · Processamento distribuído de jobs
export const l107: Pergunta = {
  numero: 207,
  modulo: "linkedin-arquitetura",
  metodo: "design",
  pt: {
    titulo: "Processamento distribuído de jobs",
    pergunta: "Como você projetaria um sistema distribuído de processamento de jobs?",
    porqueEsteMetodo:
      "É uma pergunta de system design: não há resposta única, há decisões em ordem. O roteiro (requisitos, estimativas, contrato, dados, arquitetura, falhas e gargalos) evita pular direto para a ferramenta.",
    resposta30s:
      "Receba o job pela API, **grave-o e enfileire-o** numa **fila durável** (resposta `202` com um id) e deixe **workers sem estado** consumirem em paralelo, confirmando (**ack**) só depois de concluir. Cubra as falhas com **retentativas com backoff**, **fila de mensagens mortas (DLQ)**, **idempotência** e um prazo de reserva (lease) para jobs travados, e escale os workers pela **profundidade e pela idade da fila**. Antes disso, defina os requisitos (volume, duração, prioridade, garantias), porque eles decidem a fila, o banco e o agendador.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Tipos de job (curtos ou longos, de CPU ou de E/S), volume e picos, atraso aceitável (segundos ou horas), garantias (pelo menos uma vez; ordem importa?), prioridade, agendamento e recorrência, retenção do resultado. Para o básico, do `setTimeout` à fila com workers, veja T53.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Jobs por segundo no pico e duração média e máxima. Workers necessários ≈ jobs por segundo × duração média ÷ concorrência de cada worker, com folga. Payloads grandes (arquivos) ficam no armazenamento de objetos; o job leva só a referência.",
          },
          {
            titulo: "3. Contrato",
            texto:
              "`POST /jobs` valida, grava e responde `202 Accepted` com o id; `GET /jobs/:id` informa o estado. Aceite uma chave de idempotência na criação (veja L104) e avise a conclusão por webhook ou evento, se o cliente precisar.",
          },
          {
            titulo: "4. Dados",
            texto:
              "Uma tabela de jobs (id, tipo, referência do payload, estado, tentativas, prazo, resultado) com estados claros: pendente, em execução, concluído, falhou, morto. A fila durável carrega só o id; a verdade do estado fica no banco.",
          },
          {
            titulo: "5. Arquitetura",
            texto:
              "API (produtora) → fila durável → workers sem estado que escalam na horizontal → resultado. Filas separadas por tipo e prioridade. Jobs agendados ou recorrentes pedem um agendador que dispare cada um uma só vez (lock ou eleição de líder, ou o agendador da própria biblioteca de fila).",
          },
          {
            titulo: "6. Falhas",
            texto:
              "Ack só depois de concluir. Um lease (visibility timeout) devolve à fila o job de um worker que caiu, e um heartbeat renova o lease dos jobs longos. Retentativas com backoff e jitter (veja L105), DLQ depois de N tentativas e consumidores idempotentes. No desligamento, o worker termina o job em curso antes de sair.",
          },
          {
            titulo: "7. Concorrência e proteção",
            texto:
              "Limite de concorrência por worker e por tipo de job, limite de taxa para dependências externas, workers dedicados para jobs pesados de CPU (veja L77) e prioridade sem deixar os de baixa prioridade esperando para sempre (starvation).",
          },
          {
            titulo: "8. Observabilidade e gargalos",
            texto:
              "Profundidade da fila, idade do job mais antigo, duração, taxa de falha e tamanho da DLQ, com alertas. Escale os workers por profundidade ou idade. Gargalos prováveis: o banco de estados, uma dependência externa lenta e o próprio broker. Tenha ferramentas para reprocessar a DLQ.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Ciclo de vida de um job",
        etapas: [
          "A API grava o job como `pendente` e publica o id na fila (a resposta `202` já pode sair)",
          "Um worker reserva a mensagem: ela fica invisível para os outros por um prazo (lease) e o job passa a `em execução`",
          "O worker executa, com um limite de tempo, e renova o lease se o job for longo",
          "Sucesso: grava o resultado, marca `concluído` e só então confirma (ack) a mensagem",
          "Falha: o job volta à fila com atraso crescente (backoff), contando as tentativas",
          "Esgotadas as tentativas (ou se o worker cai e o lease vence repetidas vezes), o job vai para a DLQ, marcado `morto`, com alerta",
        ],
        nota: "Se o worker cair depois de gravar o resultado e antes do ack, o job roda de novo. Por isso o efeito precisa ser idempotente.",
      },
      {
        tipo: "tabela",
        titulo: "Os trade-offs centrais",
        colunas: ["Escolha", "Ganha", "Paga"],
        linhas: [
          [
            "Ack antes de executar (no máximo uma vez)",
            "Nunca duplica o efeito",
            "Perde o job se o worker cair no meio",
          ],
          [
            "Ack depois de executar (pelo menos uma vez)",
            "Não perde o job",
            "Pode executar duas vezes: exige idempotência",
          ],
          [
            "Fila no próprio banco (por exemplo, `SELECT … FOR UPDATE SKIP LOCKED` no PostgreSQL)",
            "Menos peças e o job entra na mesma transação do dado",
            "Consulta periódica ao banco e escala limitada em volume alto",
          ],
          [
            "Broker ou serviço de fila (BullMQ, SQS, RabbitMQ; veja L103)",
            "Feito para isso: atraso, DLQ, prioridade, escala",
            "Mais uma peça para operar e monitorar",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os problemas que mais aparecem",
        texto:
          "**Job veneno**: uma mensagem que sempre falha trava o consumo ou queima tentativas sem fim; o limite de tentativas e a DLQ resolvem. **Job longo**: sem renovar o lease, outro worker pega o mesmo job enquanto o primeiro ainda trabalha. **Agendador duplicado**: um cron em cada instância dispara o job várias vezes. **Fila só cresce**: sem alerta de idade, ninguém percebe o atraso até um cliente reclamar.",
      },
    ],
    armadilhas: [
      "Dar ack ao receber a mensagem, antes de executar: se o worker cai, o job some sem rastro.",
      "Esquecer que a entrega é pelo menos uma vez: sem idempotência, a retentativa duplica efeitos como e-mail e cobrança.",
      "Não ter DLQ nem alerta para a idade do job mais antigo: um job veneno falha em silêncio para sempre.",
      "Agendador rodando em cada instância da aplicação: o mesmo job recorrente é disparado várias vezes.",
    ],
    autoteste: [
      {
        pergunta: "Quando o worker deve confirmar (ack) o job?",
        resposta:
          "Depois de concluir o trabalho. Se confirmar antes e cair, o job se perde; se confirmar depois e cair, a fila o entrega de novo, e por isso o job precisa ser idempotente.",
      },
      {
        pergunta: "Como estimar quantos workers são necessários?",
        resposta:
          "Jobs por segundo no pico × duração média ÷ concorrência de cada worker, com folga. Depois confirme medindo a profundidade e a idade da fila e ajuste.",
      },
    ],
  },
  en: {
    titulo: "Distributed job processing",
    pergunta: "How would you design a distributed job-processing system?",
    porqueEsteMetodo:
      "This is a system-design question: there is no single answer, only decisions in order. The script (requirements, estimates, contract, data, architecture, failures and bottlenecks) keeps you from jumping straight to a tool.",
    resposta30s:
      "Accept the job through the API, **store it and enqueue it** on a **durable queue** (reply `202` with an id) and let **stateless workers** consume in parallel, acknowledging (**ack**) only after finishing. Cover failures with **retries with backoff**, a **dead-letter queue (DLQ)**, **idempotency** and a reservation lease for stuck jobs, and scale the workers by **queue depth and age**. Before that, define the requirements (volume, duration, priority, guarantees), because they decide the queue, the database and the scheduler.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Job types (short or long, CPU or I/O), volume and peaks, acceptable delay (seconds or hours), guarantees (at least once; does order matter?), priority, scheduling and recurrence, result retention. For the basics, from `setTimeout` to a queue with workers, see T53.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Jobs per second at peak and average and maximum duration. Workers needed ≈ jobs per second × average duration ÷ each worker’s concurrency, with headroom. Large payloads (files) stay in object storage; the job carries only the reference.",
          },
          {
            titulo: "3. Contract",
            texto:
              "`POST /jobs` validates, stores and replies `202 Accepted` with the id; `GET /jobs/:id` reports the state. Accept an idempotency key on creation (see L104) and announce completion by webhook or event, if the client needs it.",
          },
          {
            titulo: "4. Data",
            texto:
              "A jobs table (id, type, payload reference, state, attempts, deadline, result) with clear states: pending, running, completed, failed, dead. The durable queue carries only the id; the source of truth for state lives in the database.",
          },
          {
            titulo: "5. Architecture",
            texto:
              "API (producer) → durable queue → stateless workers that scale horizontally → result. Separate queues by type and priority. Scheduled or recurring jobs need a scheduler that fires each one only once (a lock or leader election, or the scheduler of the queue library itself).",
          },
          {
            titulo: "6. Failures",
            texto:
              "Ack only after finishing. A lease (visibility timeout) returns the job of a crashed worker to the queue, and a heartbeat renews the lease of long jobs. Retries with backoff and jitter (see L105), a DLQ after N attempts and idempotent consumers. On shutdown, the worker finishes the job in progress before exiting.",
          },
          {
            titulo: "7. Concurrency and protection",
            texto:
              "A concurrency limit per worker and per job type, rate limits for external dependencies, dedicated workers for heavy CPU jobs (see L77) and priorities that do not leave low-priority jobs waiting forever (starvation).",
          },
          {
            titulo: "8. Observability and bottlenecks",
            texto:
              "Queue depth, age of the oldest job, duration, failure rate and DLQ size, with alerts. Scale workers by depth or age. Likely bottlenecks: the state database, a slow external dependency and the broker itself. Have tools to reprocess the DLQ.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A job’s life cycle",
        etapas: [
          "The API stores the job as `pending` and publishes the id on the queue (the `202` reply can already go out)",
          "A worker reserves the message: it stays invisible to the others for a period (lease) and the job becomes `running`",
          "The worker runs it, with a time limit, and renews the lease if the job is long",
          "Success: it stores the result, marks `completed` and only then acknowledges (ack) the message",
          "Failure: the job returns to the queue with growing delay (backoff), counting the attempts",
          "Once attempts run out (or the worker crashes and the lease expires too many times), the job goes to the DLQ, marked `dead`, with an alert",
        ],
        nota: "If the worker crashes after storing the result and before the ack, the job runs again. That is why the effect must be idempotent.",
      },
      {
        tipo: "tabela",
        titulo: "The central trade-offs",
        colunas: ["Choice", "Gains", "Pays"],
        linhas: [
          [
            "Ack before running (at most once)",
            "Never duplicates the effect",
            "Loses the job if the worker crashes midway",
          ],
          ["Ack after running (at least once)", "Does not lose the job", "May run twice: requires idempotency"],
          [
            "Queue in the database itself (for example, `SELECT … FOR UPDATE SKIP LOCKED` in PostgreSQL)",
            "Fewer moving parts and the job joins the same transaction as the data",
            "Periodic polling of the database and limited scale at high volume",
          ],
          [
            "Broker or queue service (BullMQ, SQS, RabbitMQ; see L103)",
            "Built for this: delay, DLQ, priority, scale",
            "One more piece to run and monitor",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The problems that show up most",
        texto:
          "**Poison job**: a message that always fails blocks consumption or burns attempts endlessly; the attempt limit and the DLQ fix it. **Long job**: without renewing the lease, another worker picks up the same job while the first is still working. **Duplicate scheduler**: a cron on every instance fires the job several times. **Queue only grows**: without an age alert, nobody notices the delay until a customer complains.",
      },
    ],
    armadilhas: [
      "Acknowledging the message on receipt, before running: if the worker crashes, the job vanishes without a trace.",
      "Forgetting that delivery is at least once: without idempotency, a retry duplicates effects such as emails and charges.",
      "Having no DLQ or alert on the age of the oldest job: a poison job fails silently forever.",
      "A scheduler running on every application instance: the same recurring job fires several times.",
    ],
    autoteste: [
      {
        pergunta: "When should the worker acknowledge (ack) the job?",
        resposta:
          "After finishing the work. If it acknowledges first and crashes, the job is lost; if it acknowledges after and crashes, the queue delivers it again, which is why the job must be idempotent.",
      },
      {
        pergunta: "How do you estimate how many workers you need?",
        resposta:
          "Jobs per second at peak × average duration ÷ each worker’s concurrency, with headroom. Then confirm by measuring queue depth and age, and adjust.",
      },
    ],
  },
};
