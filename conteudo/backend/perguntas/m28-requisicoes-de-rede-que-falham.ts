import type { Pergunta } from "../../tipos";

// M28 · Requisições de rede que falham
export const m28: Pergunta = {
  numero: 228,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Requisições de rede que falham",
    pergunta: "Quais são algumas formas de lidar com requisições de rede que falham no backend?",
    porqueEsteMetodo:
      "Tratar falha de rede é uma sequência com ordem: classificar o erro, limitar a espera, só então retentar e, quando a dependência continua doente, proteger o resto do sistema. Um playbook evita o erro clássico de sair retentando tudo.",
    resposta30s:
      "Primeiro **classifique o erro**: 4xx não se repete; timeout, `429` e `503` podem ser passageiros. Defina **timeouts** de conexão e de leitura, retente **só o que é transitório e idempotente** com **backoff exponencial e jitter**, limite as tentativas (um **orçamento de retentativas**) e respeite `Retry-After`. Proteja-se com **circuit breaker** e **bulkhead**, tenha um **fallback** (degradação graciosa), mande o que pode esperar por **fila ou outbox**, propague o **deadline** e observe tudo com métricas e logs.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Classifique o erro",
            texto:
              "Erro do cliente (`400`, `401`, `403`, `404`, `422`): o pedido está errado, repetir não adianta. Erro passageiro (`429`, `502`, `503`, `504`, conexão recusada ou interrompida): vale tentar de novo. **Timeout** é ambíguo: o servidor pode ter processado o pedido.",
          },
          {
            titulo: "Defina timeouts",
            texto:
              "Um para **conectar** (curto) e outro para **ler a resposta** (calibrado pela latência normal da dependência, com folga), mais um prazo total para a operação inteira. Sem timeout, uma dependência lenta prende threads e conexões até derrubar você.",
          },
          {
            titulo: "Retente com critério",
            texto:
              "Só erros transitórios e só operações **idempotentes** (ou com chave de idempotência, veja Q30). Use **backoff exponencial com jitter**, poucas tentativas e um **orçamento**: por exemplo, as retentativas não passam de uma pequena fração do tráfego, para evitar a tempestade de retentativas. Retente em **uma** camada só.",
          },
          {
            titulo: "Corte e isole",
            texto:
              "**Circuit breaker**: depois de falhas demais, abre o circuito e falha rápido sem chamar a dependência, testando a recuperação de tempos em tempos (semiaberto). **Bulkhead**: pools e limites separados por dependência, para que uma lenta não consuma todas as threads.",
          },
          {
            titulo: "Degrade com elegância",
            texto:
              "Tenha um **fallback** decidido com o negócio: dado em cache (ainda que antigo), valor padrão, funcionalidade secundária desligada, mensagem clara. O essencial continua funcionando.",
          },
          {
            titulo: "Se pode esperar, use fila ou outbox",
            texto:
              "Grave a intenção (padrão outbox) e deixe um worker entregar com retentativas, com uma fila de mensagens mortas (DLQ) para o que esgotou as tentativas. Veja Q29 para falhas em fluxos com vários serviços.",
          },
          {
            titulo: "Propague o prazo e observe",
            texto:
              "Passe adiante o **deadline** restante (cabeçalho ou contexto da chamada) e não retente quando não há tempo. Meça taxa de erro, latência, número de retentativas e estado do circuit breaker; use logs com id de correlação e tracing; alerte sobre sintomas. Veja R30 para o gerenciamento de dependências de API.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que fazer com cada tipo de falha",
        colunas: ["Falha", "Retentar?", "Como lidar"],
        linhas: [
          [
            "`400`, `401`, `403`, `404`, `422`",
            "Não",
            "Corrija o pedido. No `401`, renovar o token e tentar uma vez pode ser válido",
          ],
          [
            "Timeout de leitura",
            "Só se for idempotente",
            "O resultado é desconhecido: use chave de idempotência ou consulte o estado antes de repetir",
          ],
          [
            "`429`",
            "Sim, depois de esperar",
            "Respeite `Retry-After` e reduza o ritmo; veja Q14 para o lado de quem limita",
          ],
          [
            "`500`",
            "Com cautela",
            "Pode ser um bug determinístico: poucas tentativas e alerta, porque repetir pode não mudar nada",
          ],
          [
            "`502`, `503`, `504`, conexão recusada ou interrompida",
            "Sim, com limites",
            "Backoff com jitter, respeitando `Retry-After` quando houver; circuit breaker se persistir",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Retentativas com backoff exponencial e jitter",
        legenda: "typescript",
        codigo:
          "async function comRetentativas<T>(operacao: () => Promise<T>, maxRetentativas = 3): Promise<T> {\n  for (let tentativa = 0; ; tentativa++) {\n    try {\n      return await operacao();\n    } catch (erro) {\n      if (!ehTransitorio(erro) || tentativa >= maxRetentativas) throw erro;\n      const teto = Math.min(5000, 100 * 2 ** tentativa); // 100, 200, 400... ms, com teto\n      await dormir(Math.random() * teto); // jitter: espera aleatória entre 0 e o teto\n    }\n  }\n}",
        nota: "`ehTransitorio` decide pelo tipo de erro ou pelo status e `dormir` é uma Promise sobre `setTimeout`. Em produção, respeite também `Retry-After` e o prazo total.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra das retentativas",
        texto:
          "Só retente se o erro for **transitório** e a operação for **segura de repetir**. Retentar sem idempotência transforma um timeout em cobrança dupla; retentar sem backoff e jitter transforma uma lentidão em queda; retentar em várias camadas multiplica: três camadas com três tentativas cada podem gerar 27 chamadas ao serviço lá no fundo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Timeout não é falha confirmada",
        texto:
          "Quando uma chamada estoura o tempo, você não sabe se o outro lado processou. Não assuma que “não aconteceu”: consulte o estado, reconcilie depois ou envie sempre uma chave de idempotência. O mesmo vale para a conexão que cai depois do envio.",
      },
    ],
    armadilhas: [
      "Chamar sem timeout (ou deixar o padrão infinito da biblioteca): a lentidão de um terceiro prende suas threads e vira a sua queda.",
      "Retentar sem backoff e sem jitter, ou em todas as camadas: a tempestade de retentativas derruba de vez a dependência que já estava mal.",
      "Retentar uma operação não idempotente, como um `POST` de pagamento, sem chave de idempotência: cobrança dupla.",
      "Retentar erro do cliente (`400`, `404`, `422`): nunca vai funcionar, só gasta recurso e polui as métricas.",
    ],
    autoteste: [
      {
        pergunta: "Por que o backoff exponencial precisa de jitter?",
        resposta:
          "Sem jitter, todos os clientes que falharam juntos retentam nos mesmos instantes (1 s, 2 s, 4 s), criando ondas sincronizadas de carga. O jitter espalha as tentativas no tempo.",
      },
      {
        pergunta: "Qual é a diferença entre retry e circuit breaker?",
        resposta:
          "O retry insiste na chamada achando que a falha é passageira; o circuit breaker para de chamar quando a dependência está claramente doente, falha rápido e testa a recuperação de tempos em tempos. Eles se complementam: o breaker impede que o retry martele quem já está caído.",
      },
      {
        pergunta: "Uma chamada deu timeout. Dá para afirmar que a operação não aconteceu?",
        resposta:
          "Não. O resultado é desconhecido e pode ter sido processado. Por isso a repetição exige idempotência, ou uma consulta ao estado antes de tentar de novo.",
      },
    ],
  },
  en: {
    titulo: "Handling failed network requests",
    pergunta: "What are some ways to handle failed network requests in the backend?",
    porqueEsteMetodo:
      "Handling network failure is an ordered sequence: classify the error, bound the wait, only then retry and, when the dependency stays sick, protect the rest of the system. A playbook avoids the classic mistake of retrying everything.",
    resposta30s:
      "First **classify the error**: 4xx is not repeated; timeouts, `429` and `503` may be passing. Set connection and read **timeouts**, retry **only what is transient and idempotent** with **exponential backoff and jitter**, cap the attempts (a **retry budget**) and honor `Retry-After`. Protect yourself with a **circuit breaker** and **bulkheads**, have a **fallback** (graceful degradation), send what can wait through a **queue or outbox**, propagate the **deadline** and observe everything with metrics and logs.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Classify the error",
            texto:
              "Client error (`400`, `401`, `403`, `404`, `422`): the request is wrong, repeating will not help. Passing error (`429`, `502`, `503`, `504`, connection refused or reset): worth trying again. A **timeout** is ambiguous: the server may have processed the request.",
          },
          {
            titulo: "Set timeouts",
            texto:
              "One to **connect** (short) and another to **read the response** (calibrated to the dependency’s normal latency, with margin), plus an overall deadline for the whole operation. Without a timeout, a slow dependency holds threads and connections until it takes you down.",
          },
          {
            titulo: "Retry with judgment",
            texto:
              "Only transient errors and only **idempotent** operations (or with an idempotency key, see Q30). Use **exponential backoff with jitter**, few attempts and a **budget**: for example, retries never exceed a small fraction of traffic, to avoid a retry storm. Retry at **one** layer only.",
          },
          {
            titulo: "Cut off and isolate",
            texto:
              "**Circuit breaker**: after too many failures, it opens the circuit and fails fast without calling the dependency, probing recovery from time to time (half-open). **Bulkhead**: separate pools and limits per dependency, so a slow one cannot consume every thread.",
          },
          {
            titulo: "Degrade gracefully",
            texto:
              "Have a **fallback** agreed with the business: cached data (even if stale), a default value, a secondary feature switched off, a clear message. The essentials keep working.",
          },
          {
            titulo: "If it can wait, use a queue or outbox",
            texto:
              "Record the intent (outbox pattern) and let a worker deliver it with retries, with a dead-letter queue (DLQ) for what exhausted its attempts. See Q29 for failures in flows spanning several services.",
          },
          {
            titulo: "Propagate the deadline and observe",
            texto:
              "Pass the remaining **deadline** downstream (header or call context) and do not retry when there is no time left. Measure error rate, latency, retry count and circuit breaker state; use logs with a correlation ID and tracing; alert on symptoms. See R30 for managing API dependencies.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What to do with each kind of failure",
        colunas: ["Failure", "Retry?", "How to handle it"],
        linhas: [
          [
            "`400`, `401`, `403`, `404`, `422`",
            "No",
            "Fix the request. On a `401`, renewing the token and trying once can be valid",
          ],
          [
            "Read timeout",
            "Only if idempotent",
            "The outcome is unknown: use an idempotency key or check the state before repeating",
          ],
          ["`429`", "Yes, after waiting", "Honor `Retry-After` and slow down; see Q14 for the side of whoever limits"],
          [
            "`500`",
            "Cautiously",
            "May be a deterministic bug: few attempts and an alert, because repeating may change nothing",
          ],
          [
            "`502`, `503`, `504`, connection refused or reset",
            "Yes, with limits",
            "Backoff with jitter, honoring `Retry-After` when present; circuit breaker if it persists",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Retries with exponential backoff and jitter",
        legenda: "typescript",
        codigo:
          "async function withRetries<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {\n  for (let attempt = 0; ; attempt++) {\n    try {\n      return await operation();\n    } catch (error) {\n      if (!isTransient(error) || attempt >= maxRetries) throw error;\n      const cap = Math.min(5000, 100 * 2 ** attempt); // 100, 200, 400... ms, capped\n      await sleep(Math.random() * cap); // jitter: random wait between 0 and the cap\n    }\n  }\n}",
        nota: "`isTransient` decides by error type or status and `sleep` is a Promise over `setTimeout`. In production, also honor `Retry-After` and the overall deadline.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The retry rule",
        texto:
          "Retry only if the error is **transient** and the operation is **safe to repeat**. Retrying without idempotency turns a timeout into a double charge; retrying without backoff and jitter turns slowness into an outage; retrying at several layers multiplies: three layers with three attempts each can generate 27 calls to the service at the bottom.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A timeout is not a confirmed failure",
        texto:
          "When a call times out, you do not know whether the other side processed it. Do not assume it “did not happen”: check the state, reconcile later or always send an idempotency key. The same goes for a connection that drops after the request was sent.",
      },
    ],
    armadilhas: [
      "Calling without a timeout (or keeping the library’s infinite default): a third party’s slowness holds your threads and becomes your outage.",
      "Retrying without backoff and jitter, or at every layer: the retry storm finishes off the dependency that was already struggling.",
      "Retrying a non-idempotent operation, such as a payment `POST`, without an idempotency key: a double charge.",
      "Retrying a client error (`400`, `404`, `422`): it will never work, only wastes resources and pollutes the metrics.",
    ],
    autoteste: [
      {
        pergunta: "Why does exponential backoff need jitter?",
        resposta:
          "Without jitter, all the clients that failed together retry at the same moments (1 s, 2 s, 4 s), creating synchronized waves of load. Jitter spreads the attempts over time.",
      },
      {
        pergunta: "What is the difference between retry and circuit breaker?",
        resposta:
          "Retry keeps insisting on the call, assuming the failure is passing; the circuit breaker stops calling when the dependency is clearly sick, fails fast and probes recovery from time to time. They complement each other: the breaker keeps retries from hammering something already down.",
      },
      {
        pergunta: "A call timed out. Can you say the operation did not happen?",
        resposta:
          "No. The outcome is unknown and it may have been processed. That is why repeating requires idempotency, or a state check before trying again.",
      },
    ],
  },
};
