import type { Pergunta } from "../../tipos";

// Q53 · Jobs em segundo plano
export const q53: Pergunta = {
  numero: 53,
  modulo: "turing-avancadas",
  metodo: "firstprinciples",
  pt: {
    titulo: "Jobs em segundo plano",
    pergunta: "O que são jobs no Node.js e como funcionam?",
    porqueEsteMetodo:
      "Um sistema de jobs não nasce pronto: começa num `setTimeout` e vai quebrando a cada restrição (reinício, várias instâncias, falhas, duplicatas). Construir do zero mostra por que cada componente existe.",
    resposta30s:
      "O Node.js **não tem um recurso nativo chamado “jobs”**: a pergunta trata de **tarefas em segundo plano**, trabalho feito fora da requisição que o pediu (enviar e-mail, gerar relatório, processar imagem, rotinas agendadas). Elas amadurecem em etapas: `setTimeout`/`setInterval`, depois agendamento (cron) e, em produção, uma **fila persistente com workers** (BullMQ, pg-boss, Agenda ou um serviço gerenciado) com **retentativas**, **idempotência** e monitoramento.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto:
              "Algumas tarefas são lentas, podem falhar ou precisam rodar em horários fixos. Se rodarem dentro da requisição, o usuário espera e uma falha vira erro na tela; se forem disparadas “soltas”, somem sem deixar rastro.",
          },
          {
            titulo: "1. A versão mais simples",
            texto:
              "`setTimeout`, `setInterval` ou chamar a função sem `await` (“dispare e esqueça”). → Quebra: tudo vive na memória do processo, então um reinício perde o trabalho; em várias instâncias, a tarefa roda várias vezes; e um erro sem tratamento vira rejeição não tratada, que nas versões atuais derruba o processo. Trabalho de CPU ainda bloqueia o laço de eventos.",
          },
          {
            titulo: "2. Agendamento (cron)",
            texto:
              "Para rotinas periódicas, use o cron do sistema, um agendador do orquestrador (como o CronJob do Kubernetes), um serviço de agendamento da nuvem ou uma biblioteca dentro do processo. → Quebra: a biblioteca roda N vezes com N instâncias; não há fila, histórico nem retentativa; e, se o processo estiver fora do ar na hora marcada, a execução se perde.",
          },
          {
            titulo: "3. Persistir os jobs",
            texto:
              "Gravar cada job (tipo, dados, estado) num armazenamento durável: Redis (BullMQ), PostgreSQL (pg-boss), MongoDB (Agenda) ou uma fila gerenciada. Um processo **worker** separado busca e executa. Assim os jobs sobrevivem a reinícios e a API só enfileira. → Quebra: o worker pega o job e morre no meio.",
          },
          {
            titulo: "4. Reserva com prazo",
            texto:
              "O worker “aluga” o job por um tempo (um lock, ou visibility timeout) e confirma ao terminar. Se não confirmar, o job volta para a fila. Resultado: a entrega passa a ser **ao menos uma vez**. → Quebra: o mesmo job pode rodar duas vezes (worker lento que perde o lock, confirmação perdida).",
          },
          {
            titulo: "5. Idempotência",
            texto:
              "Faça o job poder rodar de novo sem duplicar o efeito: uma chave de idempotência (por exemplo, o id do pedido) gravada junto com o resultado, `upsert` em vez de `insert`, ou a pergunta “já enviei?” antes de enviar.",
          },
          {
            titulo: "6. Retentativas e falhas",
            texto:
              "Falhas temporárias merecem nova tentativa com **backoff exponencial** (esperas crescentes, com um pouco de aleatoriedade) e **limite de tentativas**. Passou do limite, o job vai para uma **fila de falhas** (dead letter) para alguém investigar, com alerta. Erro que nunca se resolve sozinho (dado inválido) não deve repetir sem fim.",
          },
          {
            titulo: "7. Concorrência e escala",
            texto:
              "Defina quantos jobs cada worker roda ao mesmo tempo (`concurrency`) e escale os workers separados da API. Trabalho de CPU vai para `worker_threads` ou processos à parte, para não travar o laço de eventos. Aplique limite de taxa quando o job chama um serviço externo.",
          },
          {
            titulo: "8. Agendamento distribuído e observabilidade",
            texto:
              "Um job repetível precisa nascer **uma vez só**, mesmo com várias instâncias: deixe a própria fila cuidar do agendamento (jobs repetíveis) ou use um lock. Monitore o tamanho da fila, a **idade do job mais antigo**, a taxa de falhas e a duração.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Passo 1: dispare e esqueça (o que quebra)",
        legenda: "JavaScript",
        codigo: `// app = instância do Express (veja Q14)
app.post("/cadastro", async (req, res) => {
  const usuario = await criarUsuario(req.body);

  // sem await: se falhar ou o processo cair, ninguém fica sabendo
  enviarEmailDeBoasVindas(usuario);

  res.status(201).json(usuario);
});`,
      },
      {
        tipo: "codigo",
        titulo: "Passos 3 a 7: fila persistente com worker",
        legenda: "fila.js (exemplo com BullMQ)",
        codigo: `import { Queue, Worker } from "bullmq";

const connection = { host: "localhost", port: 6379 }; // Redis
const fila = new Queue("emails", { connection });

// lado da API: só enfileira e responde
export async function agendarBoasVindas(usuarioId) {
  await fila.add("boas-vindas", { usuarioId }, {
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
    jobId: "boas-vindas-" + usuarioId, // não duplica o mesmo pedido
  });
}

// processo worker (idealmente separado da API)
new Worker("emails", async (job) => {
  await enviarEmailDeBoasVindas(job.data.usuarioId);
}, { connection, concurrency: 5 });`,
        nota: "BullMQ é um pacote de terceiros que usa Redis, e a API pode mudar entre versões: confira a documentação da que você usar. O que importa é o desenho: enfileirar, worker separado, tentativas com backoff e um id estável.",
      },
      {
        tipo: "tabela",
        titulo: "Qual ferramenta para qual necessidade",
        colunas: ["Ferramenta", "Bom para", "Limite"],
        linhas: [
          [
            "`setTimeout` / `setInterval`",
            "Atrasos curtos dentro do próprio processo",
            "Morre com o processo; roda em toda instância",
          ],
          [
            "Biblioteca de agendamento no processo (como `node-cron`)",
            "Rotinas simples numa instância só",
            "Roda N vezes com N instâncias; perde execuções se o processo estiver fora do ar",
          ],
          [
            "Cron do sistema ou do orquestrador",
            "Rotinas periódicas independentes da API",
            "Pouco controle de fila e retentativa; cada execução é um processo novo",
          ],
          [
            "Fila persistente com workers (BullMQ, pg-boss, Agenda)",
            "Trabalho sob demanda ou agendado, com retentativas",
            "Exige Redis ou banco, idempotência e monitoramento",
          ],
          [
            "Serviço gerenciado de fila (como o SQS)",
            "Escalar sem operar o broker",
            "Segue o modelo e os limites do provedor",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Jobs” não é um módulo do Node",
        texto:
          "Diferente de `fs` ou `http`, não existe um `node:jobs`. Quem fala em “jobs no Node” quer dizer a técnica de executar trabalho fora do caminho da requisição, montada com bibliotecas e infraestrutura (fila + workers). Em CI/CD, “job” tem outro sentido: uma etapa do pipeline.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Fila durável significa job idempotente",
        texto:
          "Quase toda fila de produção garante que o job rode pelo menos uma vez, não exatamente uma. Por isso o job precisa ser seguro para repetir: use uma chave de idempotência e grave o resultado antes de confirmar. Veja o guia de backend sobre filas de mensagens.",
      },
    ],
    armadilhas: [
      "Chamar uma função assíncrona sem `await` e sem `.catch`, achando que ela “roda em segundo plano”: se falhar, a rejeição não tratada pode derrubar o processo.",
      "Agendar com `setInterval` ou biblioteca em todas as instâncias: a rotina roda N vezes.",
      "Tentar de novo sem idempotência: o cliente recebe dois e-mails ou é cobrado duas vezes.",
      "Não monitorar a fila: o sintoma de um worker parado ou lento é a fila crescendo, não um erro.",
    ],
    autoteste: [
      {
        pergunta: "O Node.js tem um módulo nativo de jobs?",
        resposta:
          "Não. Jobs em segundo plano são montados com temporizadores, cron e, em produção, filas persistentes com workers (BullMQ, pg-boss, serviços gerenciados).",
      },
      {
        pergunta: "Por que um job precisa ser idempotente?",
        resposta:
          "Porque as filas costumam entregar ao menos uma vez: por um lock expirado ou uma confirmação perdida, o mesmo job pode rodar de novo, e repetir não pode duplicar o efeito.",
      },
      {
        pergunta: "O que acontece com um job que falha todas as tentativas?",
        resposta:
          "Vai para uma fila de falhas (dead letter) com o erro registrado, para ser investigado ou reprocessado à mão, em vez de repetir para sempre.",
      },
    ],
  },
  en: {
    titulo: "Background jobs",
    pergunta: "What are jobs in Node.js and how do they work?",
    porqueEsteMetodo:
      "A job system is not born finished: it starts as a `setTimeout` and breaks at each constraint (restarts, several instances, failures, duplicates). Building from scratch shows why each component exists.",
    resposta30s:
      "Node.js has **no built-in feature called “jobs”**: the question is about **background tasks**, work done outside the request that asked for it (sending email, building a report, processing an image, scheduled routines). They mature in stages: `setTimeout`/`setInterval`, then scheduling (cron) and, in production, a **persistent queue with workers** (BullMQ, pg-boss, Agenda or a managed service) with **retries**, **idempotency** and monitoring.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto:
              "Some tasks are slow, may fail or must run at fixed times. If they run inside the request, the user waits and a failure becomes an error on screen; if they are fired off “loose”, they vanish without a trace.",
          },
          {
            titulo: "1. The simplest version",
            texto:
              "`setTimeout`, `setInterval` or calling the function without `await` (“fire and forget”). → Breaks: everything lives in process memory, so a restart loses the work; with several instances the task runs several times; and an unhandled error becomes an unhandled rejection, which in current versions brings the process down. CPU-heavy work still blocks the event loop.",
          },
          {
            titulo: "2. Scheduling (cron)",
            texto:
              "For periodic routines, use the system cron, an orchestrator scheduler (such as a Kubernetes CronJob), a cloud scheduling service or an in-process library. → Breaks: the library runs N times with N instances; there is no queue, history or retry; and if the process is down at the scheduled time, the run is lost.",
          },
          {
            titulo: "3. Persist the jobs",
            texto:
              "Store each job (type, data, state) in a durable store: Redis (BullMQ), PostgreSQL (pg-boss), MongoDB (Agenda) or a managed queue. A separate **worker** process fetches and runs it. Jobs now survive restarts and the API only enqueues. → Breaks: the worker takes a job and dies midway.",
          },
          {
            titulo: "4. Reservation with a deadline",
            texto:
              "The worker “leases” the job for a while (a lock, or a visibility timeout) and confirms when done. If it does not confirm, the job goes back to the queue. Result: delivery becomes **at-least-once**. → Breaks: the same job can run twice (a slow worker that loses its lock, a lost confirmation).",
          },
          {
            titulo: "5. Idempotency",
            texto:
              "Make the job safe to run again without duplicating its effect: an idempotency key (for example, the order id) stored with the result, `upsert` instead of `insert`, or the question “did I already send it?” before sending.",
          },
          {
            titulo: "6. Retries and failures",
            texto:
              "Temporary failures deserve another attempt with **exponential backoff** (growing waits, with a little randomness) and an **attempt limit**. Past the limit, the job goes to a **dead-letter queue** for someone to investigate, with an alert. An error that never fixes itself (invalid data) should not repeat forever.",
          },
          {
            titulo: "7. Concurrency and scale",
            texto:
              "Define how many jobs each worker runs at once (`concurrency`) and scale the workers separately from the API. CPU-heavy work goes to `worker_threads` or separate processes so it does not freeze the event loop. Apply rate limits when the job calls an external service.",
          },
          {
            titulo: "8. Distributed scheduling and observability",
            texto:
              "A repeatable job must be born **only once**, even with several instances: let the queue itself handle scheduling (repeatable jobs) or use a lock. Monitor queue size, the **age of the oldest job**, the failure rate and the duration.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Step 1: fire and forget (what breaks)",
        legenda: "JavaScript",
        codigo: `// app = Express instance (see Q14)
app.post("/signup", async (req, res) => {
  const user = await createUser(req.body);

  // no await: if it fails or the process dies, nobody finds out
  sendWelcomeEmail(user);

  res.status(201).json(user);
});`,
      },
      {
        tipo: "codigo",
        titulo: "Steps 3 to 7: a persistent queue with a worker",
        legenda: "queue.js (BullMQ example)",
        codigo: `import { Queue, Worker } from "bullmq";

const connection = { host: "localhost", port: 6379 }; // Redis
const queue = new Queue("emails", { connection });

// API side: only enqueue and respond
export async function scheduleWelcome(userId) {
  await queue.add("welcome", { userId }, {
    attempts: 5,
    backoff: { type: "exponential", delay: 1000 },
    jobId: "welcome-" + userId, // does not duplicate the same request
  });
}

// worker process (ideally separate from the API)
new Worker("emails", async (job) => {
  await sendWelcomeEmail(job.data.userId);
}, { connection, concurrency: 5 });`,
        nota: "BullMQ is a third-party package that uses Redis, and its API can change between versions: check the documentation of the one you use. What matters is the design: enqueue, a separate worker, retries with backoff and a stable id.",
      },
      {
        tipo: "tabela",
        titulo: "Which tool for which need",
        colunas: ["Tool", "Good for", "Limit"],
        linhas: [
          [
            "`setTimeout` / `setInterval`",
            "Short delays inside the process itself",
            "Dies with the process; runs on every instance",
          ],
          [
            "In-process scheduling library (such as `node-cron`)",
            "Simple routines on a single instance",
            "Runs N times with N instances; misses runs if the process is down",
          ],
          [
            "System or orchestrator cron",
            "Periodic routines independent of the API",
            "Little control over queueing and retries; each run is a new process",
          ],
          [
            "Persistent queue with workers (BullMQ, pg-boss, Agenda)",
            "On-demand or scheduled work, with retries",
            "Needs Redis or a database, idempotency and monitoring",
          ],
          [
            "Managed queue service (such as SQS)",
            "Scaling without running the broker",
            "Follows the provider’s model and limits",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Jobs” is not a Node module",
        texto:
          "Unlike `fs` or `http`, there is no `node:jobs`. When people say “jobs in Node” they mean the technique of running work outside the request path, built with libraries and infrastructure (queue + workers). In CI/CD, “job” means something else: a stage of the pipeline.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A durable queue means an idempotent job",
        texto:
          "Almost every production queue guarantees that a job runs at least once, not exactly once. So the job must be safe to repeat: use an idempotency key and store the result before confirming. See the backend guide on message queues.",
      },
    ],
    armadilhas: [
      "Calling an async function with no `await` and no `.catch`, thinking it “runs in the background”: if it fails, the unhandled rejection can bring the process down.",
      "Scheduling with `setInterval` or a library on every instance: the routine runs N times.",
      "Retrying without idempotency: the customer gets two emails or is charged twice.",
      "Not monitoring the queue: the symptom of a stalled or slow worker is a growing queue, not an error.",
    ],
    autoteste: [
      {
        pergunta: "Does Node.js have a built-in jobs module?",
        resposta:
          "No. Background jobs are built with timers, cron and, in production, persistent queues with workers (BullMQ, pg-boss, managed services).",
      },
      {
        pergunta: "Why must a job be idempotent?",
        resposta:
          "Because queues usually deliver at least once: through an expired lock or a lost confirmation, the same job may run again, and repeating it must not duplicate the effect.",
      },
      {
        pergunta: "What happens to a job that fails every attempt?",
        resposta:
          "It goes to a dead-letter queue with the error recorded, to be investigated or reprocessed by hand, instead of repeating forever.",
      },
    ],
  },
};
