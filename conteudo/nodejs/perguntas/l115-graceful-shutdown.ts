import type { Pergunta } from "../../tipos";

// L115 · Encerramento gracioso
export const l115: Pergunta = {
  numero: 215,
  modulo: "linkedin-producao",
  metodo: "trace",
  pt: {
    titulo: "Encerramento gracioso",
    pergunta: "Como você implementa o encerramento gracioso (graceful shutdown)?",
    porqueEsteMetodo:
      "Um encerramento gracioso é uma sequência no tempo: sinal, instância fora da rotação, fim das entradas, drenagem, fechamento das dependências e saída. Seguir uma única instância durante um deploy, inclusive quando algo trava, mostra por que a ordem e os prazos importam.",
    resposta30s:
      "Ao receber **`SIGTERM`** (ou `SIGINT`), a aplicação marca-se como **não pronta** (readiness), chama **`server.close()`** para parar de aceitar conexões e deixa as requisições em andamento terminarem. Depois fecha o que os outros usavam (pool do banco, filas, cache) e sai; um **prazo máximo** menor que o do orquestrador força a saída se algo travar. Sem isso, o deploy corta requisições no meio.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma instância sendo desligada, no caminho feliz",
        etapas: [
          "O orquestrador decide parar a instância (deploy, redução de escala, manutenção) e envia `SIGTERM`; no terminal, `Ctrl+C` envia `SIGINT`",
          "O handler roda uma única vez (uma flag impede repetição) e marca a instância como não pronta: a rota de readiness, por exemplo `/pronto`, passa a responder `503` e o balanceador a tira da rotação",
          "Espera-se um instante para o balanceador perceber: em Kubernetes, a retirada do endereço e o sinal acontecem em paralelo, então ainda podem chegar pedidos",
          "`server.close()` para de aceitar conexões novas; as requisições em curso seguem até responder, e as conexões keep-alive ociosas são fechadas",
          "Consumidores de fila param de buscar mensagens e terminam o job atual (confirmando ou devolvendo a mensagem); tarefas em segundo plano acabam ou são interrompidas com segurança",
          "Por último, fecham-se as dependências que os outros usavam: `pool.end()` do banco, cliente do Redis, conexão com a fila, e descarregam-se logs e métricas",
          "O laço de eventos fica sem trabalho e o processo termina com código `0`; se o prazo máximo estourar antes, `process.exit(1)` força a saída",
        ],
        nota: "A regra de ordem: feche primeiro quem **traz** trabalho (rota de readiness, servidor HTTP, consumidores) e por último quem **atende** o trabalho (banco, cache). Fechar o pool antes faz as requisições em curso falharem.",
      },
      {
        tipo: "passos",
        titulo: "Agora o caminho em que dá errado",
        passos: [
          {
            titulo: "Uma conexão não termina",
            texto:
              "`server.close()` só conclui quando todas as conexões acabam. Um cliente lento, um WebSocket ou um streaming longo seguram o encerramento para sempre. Por isso existe o prazo máximo global; ao estourar, force a saída. Versões recentes do Node trazem `closeIdleConnections()` e `closeAllConnections()` no servidor HTTP; confira a documentação (nodejs.org) da sua versão.",
          },
          {
            titulo: "O sinal chega duas vezes",
            texto:
              "Sem a flag `encerrando`, o encerramento rodaria duas vezes e fechar um pool já fechado pode lançar erro. Algumas equipes aceitam um segundo `SIGINT` como “saia agora”, mas é uma escolha explícita.",
          },
          {
            titulo: "O sinal nunca chega ao Node",
            texto:
              "Em contêiner, se o processo principal for um shell ou `npm start`, o sinal pode não ser repassado ao Node. Ao fim do prazo o orquestrador envia `SIGKILL`, que não pode ser capturado, e as requisições são cortadas. Rode `node` diretamente como processo principal (ou use um init mínimo).",
          },
          {
            titulo: "Uma etapa do encerramento falha",
            texto:
              "Falha ao fechar o pool, por exemplo. Registre o erro, marque `process.exitCode = 1` e continue fechando o resto: uma exceção no meio não pode abandonar a sequência. Evite `process.exit()` logo no começo, que corta respostas e escritas pendentes (veja T23).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um encerramento com prazo máximo",
        legenda: "JavaScript",
        codigo: `import { createServer } from "node:http";

const server = createServer(app).listen(3000); // app, pool e fila vêm de outro lugar
let encerrando = false; // a rota /pronto responde 503 quando for true

async function encerrar(sinal) {
  if (encerrando) return; // sinal repetido: ignore
  encerrando = true;
  setTimeout(() => process.exit(1), 10_000).unref(); // prazo máximo, menor que o do orquestrador
  try {
    await new Promise((ok, falha) => server.close((erro) => (erro ? falha(erro) : ok())));
    await Promise.all([fila.close(), pool.end()]); // dependências só depois do servidor
  } catch (erro) {
    console.error("falha ao encerrar", sinal, erro);
    process.exitCode = 1;
  }
}

for (const sinal of ["SIGTERM", "SIGINT"]) process.on(sinal, () => encerrar(sinal));`,
        nota: "O timer com `.unref()` não segura o processo: se tudo fechar a tempo, o Node sai sozinho com o `exitCode` definido.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Os prazos têm de caber uns dentro dos outros",
        texto:
          "O tempo normal de uma requisição deve ser **menor** que o seu prazo interno, e este **menor** que o prazo do orquestrador (em Kubernetes, `terminationGracePeriodSeconds`, que também inclui o tempo de um hook `preStop`). Quando o do orquestrador acaba primeiro, vem o `SIGKILL`, que não se captura. Veja também a alta disponibilidade (L122) e o tratamento de erros fatais (L116).",
      },
    ],
    armadilhas: [
      "Chamar `process.exit()` direto no handler: corta respostas em andamento e escritas pendentes.",
      "Esquecer das conexões longas (WebSocket, SSE, keep-alive): `server.close()` não termina enquanto elas existirem.",
      "Fechar o pool do banco antes de o servidor terminar de responder: as requisições em curso falham.",
      "Ter um prazo interno maior que o do orquestrador, ou um shell no meio que engole o sinal: o resultado é o mesmo `SIGKILL`.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a ordem correta de fechamento e por quê?",
        resposta:
          "Primeiro as entradas (readiness em 503, servidor HTTP, consumidores de fila), depois as dependências (pool do banco, cache, logs). Quem traz trabalho para antes de quem o atende, para as requisições em curso poderem terminar.",
      },
      {
        pergunta: "O que acontece se o encerramento demorar mais que o prazo do orquestrador?",
        resposta:
          "O orquestrador envia `SIGKILL`, que não pode ser capturado, e as requisições em curso são cortadas. Por isso o prazo interno deve ser menor, e a aplicação precisa forçar a saída sozinha.",
      },
    ],
  },
  en: {
    titulo: "Graceful shutdown",
    pergunta: "How do you implement graceful shutdown?",
    porqueEsteMetodo:
      "A graceful shutdown is a sequence in time: signal, instance out of rotation, inputs stop, draining, dependencies closed and exit. Following one instance through a deploy, including when something hangs, shows why the order and the deadlines matter.",
    resposta30s:
      "On **`SIGTERM`** (or `SIGINT`), the application marks itself **not ready** (readiness), calls **`server.close()`** to stop accepting connections and lets in-flight requests finish. Then it closes what the others were using (database pool, queues, cache) and exits; a **hard deadline** shorter than the orchestrator’s forces the exit if anything hangs. Without this, a deploy cuts requests off midway.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One instance being shut down, on the happy path",
        etapas: [
          "The orchestrator decides to stop the instance (deploy, scale-down, maintenance) and sends `SIGTERM`; in a terminal, `Ctrl+C` sends `SIGINT`",
          "The handler runs only once (a flag prevents repeats) and marks the instance as not ready: the readiness route, for example `/ready`, starts answering `503` and the load balancer takes it out of rotation",
          "It waits a moment for the load balancer to notice: in Kubernetes, removing the address and sending the signal happen in parallel, so requests may still arrive",
          "`server.close()` stops accepting new connections; in-flight requests carry on until they respond, and idle keep-alive connections are closed",
          "Queue consumers stop fetching messages and finish the current job (acknowledging or returning the message); background tasks finish or are interrupted safely",
          "Last, the dependencies the others used are closed: the database `pool.end()`, the Redis client, the queue connection, and logs and metrics are flushed",
          "The event loop runs out of work and the process ends with code `0`; if the hard deadline fires first, `process.exit(1)` forces the exit",
        ],
        nota: "The ordering rule: close first whoever **brings** work (readiness route, HTTP server, consumers) and last whoever **serves** the work (database, cache). Closing the pool earlier makes in-flight requests fail.",
      },
      {
        tipo: "passos",
        titulo: "Now the path where it goes wrong",
        passos: [
          {
            titulo: "A connection never ends",
            texto:
              "`server.close()` only completes when every connection ends. A slow client, a WebSocket or a long stream holds the shutdown forever. That is why the global hard deadline exists; when it fires, force the exit. Recent Node versions offer `closeIdleConnections()` and `closeAllConnections()` on the HTTP server; check the documentation (nodejs.org) for your version.",
          },
          {
            titulo: "The signal arrives twice",
            texto:
              "Without the `shuttingDown` flag, the shutdown would run twice, and closing an already closed pool can throw an error. Some teams accept a second `SIGINT` as “quit now”, but that is an explicit choice.",
          },
          {
            titulo: "The signal never reaches Node",
            texto:
              "In a container, if the main process is a shell or `npm start`, the signal may not be forwarded to Node. At the end of the deadline the orchestrator sends `SIGKILL`, which cannot be caught, and requests are cut off. Run `node` directly as the main process (or use a minimal init).",
          },
          {
            titulo: "A shutdown step fails",
            texto:
              "Closing the pool fails, for instance. Log the error, set `process.exitCode = 1` and keep closing the rest: an exception in the middle must not abandon the sequence. Avoid `process.exit()` right at the start, which cuts off responses and pending writes (see T23).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A shutdown with a hard deadline",
        legenda: "JavaScript",
        codigo: `import { createServer } from "node:http";

const server = createServer(app).listen(3000); // app, pool and queue come from elsewhere
let shuttingDown = false; // the /ready route answers 503 when this is true

async function shutdown(signal) {
  if (shuttingDown) return; // repeated signal: ignore
  shuttingDown = true;
  setTimeout(() => process.exit(1), 10_000).unref(); // hard deadline, shorter than the orchestrator's
  try {
    await new Promise((ok, fail) => server.close((error) => (error ? fail(error) : ok())));
    await Promise.all([queue.close(), pool.end()]); // dependencies only after the server
  } catch (error) {
    console.error("shutdown failed", signal, error);
    process.exitCode = 1;
  }
}

for (const signal of ["SIGTERM", "SIGINT"]) process.on(signal, () => shutdown(signal));`,
        nota: "The timer with `.unref()` does not hold the process open: if everything closes in time, Node exits by itself with the `exitCode` that was set.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The deadlines must nest inside each other",
        texto:
          "The normal duration of a request must be **shorter** than your internal deadline, and that **shorter** than the orchestrator’s (in Kubernetes, `terminationGracePeriodSeconds`, which also includes the time of a `preStop` hook). When the orchestrator’s runs out first, `SIGKILL` follows, and it cannot be caught. See also high availability (L122) and fatal error handling (L116).",
      },
    ],
    armadilhas: [
      "Calling `process.exit()` straight in the handler: it cuts off in-flight responses and pending writes.",
      "Forgetting long-lived connections (WebSocket, SSE, keep-alive): `server.close()` does not finish while they exist.",
      "Closing the database pool before the server finishes responding: in-flight requests fail.",
      "An internal deadline longer than the orchestrator’s, or a shell in between that swallows the signal: the result is the same `SIGKILL`.",
    ],
    autoteste: [
      {
        pergunta: "What is the correct closing order and why?",
        resposta:
          "Inputs first (readiness to 503, HTTP server, queue consumers), then dependencies (database pool, cache, logs). Whoever brings work stops before whoever serves it, so in-flight requests can finish.",
      },
      {
        pergunta: "What happens if the shutdown takes longer than the orchestrator’s deadline?",
        resposta:
          "The orchestrator sends `SIGKILL`, which cannot be caught, and in-flight requests are cut off. That is why the internal deadline must be shorter and the application must force the exit by itself.",
      },
    ],
  },
};
