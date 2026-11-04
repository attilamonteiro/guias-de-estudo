import type { Pergunta } from "../../tipos";

// Q02 · Síncrono vs assíncrono
export const q02: Pergunta = {
  numero: 2,
  modulo: "arquitetura",
  metodo: "feynman",
  pt: {
    titulo: "Síncrono vs assíncrono",
    pergunta: "Explique as diferenças entre processamento síncrono e assíncrono em um sistema backend.",
    porqueEsteMetodo:
      "É um conceito abstrato que se resolve com intuição: uma analogia do dia a dia (fila de balcão vs comanda com senha), depois o mecanismo real e o ponto em que a analogia deixa de valer.",
    resposta30s:
      "**Síncrono**: quem chama fica bloqueado esperando a resposta. **Assíncrono**: quem chama delega o trabalho, recebe um recibo e segue; o resultado chega depois (callback, polling, webhook, evento). Assíncrono não deixa a tarefa mais rápida: libera quem esperava e desacopla os dois lados no tempo, ao custo de tratar falha, duplicata e status.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Padaria com fila no balcão (síncrono): você pede e fica parado até o atendente embalar o pão, só então vai embora. Restaurante com comanda e senha (assíncrono): você faz o pedido, recebe uma senha, senta e é chamado quando fica pronto. Enquanto isso o garçom atende outras mesas.",
        tecnico:
          "No síncrono a thread ou conexão do chamador fica presa até a resposta chegar; é simples de raciocinar e o erro volta direto. No assíncrono o chamador recebe só uma confirmação (um ID, `202 Accepted`) e o trabalho acontece depois, em outro lugar (worker, fila, event loop). A palavra tem três usos: (1) **I/O não bloqueante** (`async/await`, event loop): a thread atende outras tarefas enquanto espera disco ou rede; (2) **processamento assíncrono por fila**: o trabalho sai do caminho da requisição; (3) **API assíncrona**: `202` + consulta de status ou webhook.",
        limite:
          "No restaurante a comanda nunca some nem é entregue duas vezes. Em sistemas a mensagem pode se perder, chegar duplicada ou fora de ordem, e o cliente pode ir embora antes do prato ficar pronto. Por isso o assíncrono exige retentativas, idempotência e um jeito de consultar o status.",
      },
      {
        tipo: "fluxo",
        titulo: "Exemplo assíncrono: exportar um relatório",
        etapas: [
          "Cliente pede o relatório",
          "API valida, grava o pedido e enfileira",
          "API responde `202` + `jobId` em milissegundos",
          "Worker gera o arquivo (30 s)",
          "Cliente consulta `/jobs/{id}` ou recebe um webhook",
        ],
      },
      {
        tipo: "tabela",
        titulo: "Quando usar cada um",
        colunas: ["", "Síncrono", "Assíncrono"],
        linhas: [
          [
            "Use quando",
            "O usuário precisa do resultado agora e a operação é rápida (login, consulta por ID, validação)",
            "A operação é lenta, pode falhar e tentar de novo, ou não precisa de resposta imediata (e-mail, relatório, vídeo, integração externa)",
          ],
          [
            "Ganha",
            "Simplicidade, erro imediato, fluxo linear",
            "Resiliência a picos, desacoplamento, melhor uso de recursos",
          ],
          [
            "Paga",
            "Latência somada, falha em cascata, threads presas",
            "Complexidade: status, retentativas, duplicatas, ordem, observabilidade",
          ],
        ],
      },
    ],
    armadilhas: [
      "Achar que assíncrono é sinônimo de paralelo ou multithread: um event loop de uma thread só já é assíncrono.",
      "Achar que deixa a tarefa mais rápida: o trabalho dura o mesmo, quem muda é quem espera.",
      "Trocar síncrono por assíncrono sem tratar falha parcial, duplicata e a pergunta “e se o worker cair no meio?”.",
    ],
    autoteste: [
      {
        pergunta: "Em uma frase: qual é o ganho real do assíncrono?",
        resposta:
          "Quem chamou não fica bloqueado esperando e os dois lados deixam de depender um do outro no mesmo instante. A tarefa em si não ficou mais rápida.",
      },
      {
        pergunta: "Qual resposta HTTP uma API assíncrona costuma dar ao aceitar um trabalho?",
        resposta:
          "`202 Accepted`, com um identificador do trabalho e um endereço de status (ou um webhook para avisar no fim).",
      },
    ],
  },
  en: {
    titulo: "Sync vs async",
    pergunta: "Explain the differences between synchronous and asynchronous processing in a backend system.",
    porqueEsteMetodo:
      "It is an abstract concept that gets solved with intuition: an everyday analogy (counter queue vs ticket with a buzzer), then the real mechanism and the point where the analogy stops holding.",
    resposta30s:
      "**Synchronous**: the caller blocks until the answer arrives. **Asynchronous**: the caller hands the work off, gets a receipt and moves on; the result arrives later (callback, polling, webhook, event). Async does not make the task faster: it frees whoever was waiting and decouples both sides in time, at the cost of handling failure, duplicates and status.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A bakery with a counter queue (sync): you order and stand there until the clerk wraps the bread, then you leave. A restaurant with an order ticket and a buzzer (async): you order, get a buzzer, sit down and are called when it is ready. Meanwhile the waiter serves other tables.",
        tecnico:
          "In sync, the caller’s thread or connection is held until the response arrives; it is easy to reason about and errors come straight back. In async the caller gets only an acknowledgment (an ID, `202 Accepted`) and the work happens later, elsewhere (worker, queue, event loop). The word has three uses: (1) **non-blocking I/O** (`async/await`, event loop): the thread serves other tasks while waiting on disk or network; (2) **queue-based async processing**: the work leaves the request path; (3) **async API**: `202` + status polling or a webhook.",
        limite:
          "At the restaurant the ticket never vanishes and is never delivered twice. In systems a message can be lost, arrive duplicated or out of order, and the customer can leave before the dish is ready. That is why async needs retries, idempotency and a way to check status.",
      },
      {
        tipo: "fluxo",
        titulo: "Async example: exporting a report",
        etapas: [
          "Client asks for the report",
          "API validates, stores the request and enqueues it",
          "API replies `202` + `jobId` in milliseconds",
          "Worker builds the file (30 s)",
          "Client polls `/jobs/{id}` or receives a webhook",
        ],
      },
      {
        tipo: "tabela",
        titulo: "When to use each",
        colunas: ["", "Synchronous", "Asynchronous"],
        linhas: [
          [
            "Use when",
            "The user needs the result now and the operation is fast (login, lookup by ID, validation)",
            "The operation is slow, may fail and retry, or does not need an immediate answer (email, report, video, external integration)",
          ],
          [
            "Gains",
            "Simplicity, immediate errors, linear flow",
            "Resilience to spikes, decoupling, better resource usage",
          ],
          [
            "Pays",
            "Summed latency, cascading failure, held threads",
            "Complexity: status, retries, duplicates, ordering, observability",
          ],
        ],
      },
    ],
    armadilhas: [
      "Thinking async means parallel or multithreaded: a single-threaded event loop is already async.",
      "Thinking it makes the task faster: the work takes the same time, what changes is who waits.",
      "Swapping sync for async without handling partial failure, duplicates and the question “what if the worker dies midway?”.",
    ],
    autoteste: [
      {
        pergunta: "In one sentence: what is the real gain of async?",
        resposta:
          "The caller is not blocked waiting, and both sides stop depending on each other at the same instant. The task itself did not get faster.",
      },
      {
        pergunta: "Which HTTP response does an async API usually return when it accepts a job?",
        resposta: "`202 Accepted`, with a job identifier and a status address (or a webhook to notify at the end).",
      },
    ],
  },
};
