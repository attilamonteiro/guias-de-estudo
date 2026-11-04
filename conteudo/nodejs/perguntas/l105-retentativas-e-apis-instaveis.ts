import type { Pergunta } from "../../tipos";

// L105 · Retentativas e APIs instáveis
export const l105: Pergunta = {
  numero: 205,
  modulo: "linkedin-arquitetura",
  metodo: "playbook",
  pt: {
    titulo: "Retentativas e APIs instáveis",
    pergunta: "Como você lida com retentativas?",
    porqueEsteMetodo:
      "Retentativa é um conjunto de decisões que dá certo na ordem certa e piora tudo na ordem errada (repetir sem idempotência, sem limite, sem pausa). O playbook fixa a sequência e o critério de cada passo.",
    resposta30s:
      "Retente apenas **erros transitórios** (timeout, falha de rede, `429`, `502`/`503`/`504`), com **timeout** em cada tentativa, **backoff exponencial com jitter**, **limite de tentativas** e operações **idempotentes**. Quando a falha persiste, um **circuit breaker** falha rápido e uma **fila** ou um fallback assume. Para uma API de pagamento instável: registre a intenção, use uma chave de idempotência, trate o timeout como resultado desconhecido e **reconcile** com o provedor.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: retentativas e uma API externa instável",
        passos: [
          {
            titulo: "Defina timeouts antes de tudo",
            texto:
              "Sem timeout, uma chamada pendurada segura conexão e memória. Use timeout por tentativa (`AbortSignal.timeout`, veja L33) e um prazo total menor que o tempo que o chamador aceita esperar.",
          },
          {
            titulo: "Classifique o erro",
            texto:
              "Retente só o transitório: timeout, `ECONNRESET`, `429` (respeitando `Retry-After`), `502`, `503`, `504`. Não repita `400`, `401`, `403`, `404` e `422`: não vão passar. Para `500`, decida caso a caso.",
          },
          {
            titulo: "Garanta idempotência antes de repetir",
            texto:
              "Um timeout não diz se a operação foi feita. Envie a chave de idempotência do provedor (veja L104); sem ela, repetir um pagamento pode cobrar duas vezes.",
          },
          {
            titulo: "Backoff exponencial com jitter e limite",
            texto:
              "Espere um tempo que dobra a cada tentativa (200 ms, 400 ms, 800 ms…) e sorteie um valor dentro dele (jitter), para os clientes não tentarem juntos. Defina teto de espera e poucas tentativas; um orçamento total de tempo evita que a soma passe do aceitável.",
          },
          {
            titulo: "Corte com um circuit breaker",
            texto:
              "Passada uma taxa de falhas, o circuito abre e as chamadas falham na hora por um tempo; depois ele deixa passar algumas para testar (meio-aberto). Protege a API externa e os seus recursos. Há bibliotecas prontas, como `opossum`.",
          },
          {
            titulo: "Tire a chamada do caminho do usuário, se puder",
            texto:
              "Grave a intenção no banco e coloque um job numa fila: um worker tenta com backoff e, esgotadas as tentativas, o job vai para uma fila de mensagens mortas. A resposta ao usuário é “em processamento”, confirmada depois por webhook ou consulta (veja L107).",
          },
          {
            titulo: "Planeje fallback, reconciliação e observação",
            texto:
              "Tenha um plano para a degradação (outro provedor, aceitar o pedido como pendente). Reconcilie periodicamente: consulte o provedor pelo id e acerte o que ficou incerto. Meça tentativas, taxa de erro, latência e estado do circuito, com alertas e id de correlação nos logs.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Retentativa com backoff exponencial e jitter",
        legenda: "JavaScript",
        codigo: [
          'import { setTimeout as dormir } from "node:timers/promises";',
          "",
          "const transitorio = (e) =>",
          '  e.name === "TimeoutError" || e.code === "ECONNRESET" || [429, 502, 503, 504].includes(e.status);',
          "",
          "async function comRetentativa(operacao, { tentativas = 4, baseMs = 200, tetoMs = 5000 } = {}) {",
          "  for (let n = 1; ; n++) {",
          "    try {",
          "      return await operacao(AbortSignal.timeout(3000)); // timeout por tentativa",
          "    } catch (erro) {",
          "      if (n >= tentativas || !transitorio(erro)) throw erro;",
          "      const teto = Math.min(tetoMs, baseMs * 2 ** (n - 1)); // 200, 400, 800… ms",
          "      await dormir(Math.random() * teto); // jitter: espera aleatória até o teto",
          "    }",
          "  }",
          "}",
        ].join("\n"),
        nota: "`operacao` precisa lançar um erro com `status` quando a resposta for `429` ou `5xx` (o `fetch` não rejeita sozinho nesses casos). Nas chamadas que alteram estado, repasse sempre a chave de idempotência.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O cenário do pagamento instável",
        texto:
          "Registre o pedido de pagamento e a chave de idempotência **antes** de chamar o provedor. Chame com timeout e retente só o transitório, com a **mesma chave**. Trate timeout como **resultado desconhecido**, nunca como falha: consulte o status no provedor ou espere o webhook. Se o circuito abrir ou as tentativas acabarem, deixe o pedido **pendente** e deixe um job reconciliar depois, em vez de pedir para o usuário pagar de novo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Retentativa pode piorar o problema",
        texto:
          "Retentativas em várias camadas se multiplicam (3 tentativas em cada uma de 3 camadas viram 27 chamadas) e, sem jitter, chegam todas juntas no pior momento, numa tempestade de retentativas. Retente em uma camada só, com limite, e use o circuit breaker para dar folga a quem está se recuperando.",
      },
    ],
    armadilhas: [
      "Repetir sem idempotência: o timeout não diz se o pagamento foi feito, e a retentativa cobra duas vezes.",
      "Retentar sem backoff nem jitter, ou em várias camadas: todos tentam ao mesmo tempo e o serviço lento cai de vez.",
      "Repetir erros permanentes (`400`, `401`, `404`, `422`): não vão passar, só gastam tempo e quota.",
      "Não ter timeout nem limite de tentativas: requisições penduradas esgotam conexões e memória, e o usuário espera sem fim.",
    ],
    autoteste: [
      {
        pergunta: "Por que usar jitter no backoff?",
        resposta:
          "Sem aleatoriedade, todos os clientes que falharam juntos tentam de novo no mesmo instante e repetem o pico. O jitter espalha as tentativas no tempo.",
      },
      {
        pergunta: "A chamada de pagamento deu timeout. Dá para concluir que falhou?",
        resposta:
          "Não. O timeout só diz que a resposta não chegou; o provedor pode ter processado. Repita com a mesma chave de idempotência ou consulte o status do pagamento antes de agir.",
      },
    ],
  },
  en: {
    titulo: "Retries and unreliable APIs",
    pergunta: "How do you handle retries?",
    porqueEsteMetodo:
      "Retrying is a set of decisions that works in the right order and makes everything worse in the wrong one (repeating without idempotency, without a limit, without a pause). The playbook fixes the sequence and the criterion of each step.",
    resposta30s:
      "Retry only **transient errors** (timeouts, network failures, `429`, `502`/`503`/`504`), with a **timeout** on each attempt, **exponential backoff with jitter**, an **attempt limit** and **idempotent** operations. When the failure persists, a **circuit breaker** fails fast and a **queue** or a fallback takes over. For an unreliable payment API: record the intent, use an idempotency key, treat a timeout as an unknown result and **reconcile** with the provider.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: retries and an unreliable external API",
        passos: [
          {
            titulo: "Set timeouts first",
            texto:
              "Without a timeout, a hanging call holds a connection and memory. Use a per-attempt timeout (`AbortSignal.timeout`, see L33) and an overall deadline shorter than the caller is willing to wait.",
          },
          {
            titulo: "Classify the error",
            texto:
              "Retry only the transient: timeouts, `ECONNRESET`, `429` (honoring `Retry-After`), `502`, `503`, `504`. Do not repeat `400`, `401`, `403`, `404` and `422`: they will not pass. For `500`, decide case by case.",
          },
          {
            titulo: "Guarantee idempotency before repeating",
            texto:
              "A timeout does not tell you whether the operation happened. Send the provider’s idempotency key (see L104); without it, repeating a payment can charge twice.",
          },
          {
            titulo: "Exponential backoff with jitter and a limit",
            texto:
              "Wait a time that doubles on each attempt (200 ms, 400 ms, 800 ms…) and pick a random value within it (jitter), so clients do not retry together. Set a wait ceiling and few attempts; an overall time budget keeps the sum from exceeding what is acceptable.",
          },
          {
            titulo: "Cut off with a circuit breaker",
            texto:
              "Past a failure rate, the circuit opens and calls fail immediately for a while; then it lets a few through to test (half-open). It protects the external API and your own resources. Ready-made libraries exist, such as `opossum`.",
          },
          {
            titulo: "Take the call off the user’s path, if you can",
            texto:
              "Store the intent in the database and put a job on a queue: a worker tries with backoff and, once attempts run out, the job goes to a dead-letter queue. The user gets “processing”, confirmed later by webhook or lookup (see L107).",
          },
          {
            titulo: "Plan the fallback, reconciliation and observation",
            texto:
              "Have a plan for degradation (another provider, accepting the order as pending). Reconcile periodically: ask the provider by id and settle whatever stayed uncertain. Measure attempts, error rate, latency and circuit state, with alerts and a correlation id in the logs.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Retry with exponential backoff and jitter",
        legenda: "JavaScript",
        codigo: [
          'import { setTimeout as sleep } from "node:timers/promises";',
          "",
          "const transient = (e) =>",
          '  e.name === "TimeoutError" || e.code === "ECONNRESET" || [429, 502, 503, 504].includes(e.status);',
          "",
          "async function withRetry(operation, { attempts = 4, baseMs = 200, capMs = 5000 } = {}) {",
          "  for (let n = 1; ; n++) {",
          "    try {",
          "      return await operation(AbortSignal.timeout(3000)); // per-attempt timeout",
          "    } catch (error) {",
          "      if (n >= attempts || !transient(error)) throw error;",
          "      const cap = Math.min(capMs, baseMs * 2 ** (n - 1)); // 200, 400, 800… ms",
          "      await sleep(Math.random() * cap); // jitter: random wait up to the cap",
          "    }",
          "  }",
          "}",
        ].join("\n"),
        nota: "`operation` must throw an error with a `status` when the response is `429` or `5xx` (`fetch` does not reject on its own in those cases). On calls that change state, always pass the idempotency key along.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The unreliable payment scenario",
        texto:
          "Record the payment request and the idempotency key **before** calling the provider. Call with a timeout and retry only the transient, with the **same key**. Treat a timeout as an **unknown result**, never as a failure: check the status with the provider or wait for the webhook. If the circuit opens or attempts run out, leave the order **pending** and let a job reconcile later, instead of asking the user to pay again.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Retries can make the problem worse",
        texto:
          "Retries in several layers multiply (3 attempts in each of 3 layers become 27 calls) and, without jitter, all arrive together at the worst moment, in a retry storm. Retry in one layer only, with a limit, and use the circuit breaker to give whatever is recovering some room.",
      },
    ],
    armadilhas: [
      "Repeating without idempotency: a timeout does not say whether the payment happened, and the retry charges twice.",
      "Retrying with no backoff or jitter, or in several layers: everyone tries at once and the slow service goes down for good.",
      "Repeating permanent errors (`400`, `401`, `404`, `422`): they will not pass, they only burn time and quota.",
      "Having no timeout or attempt limit: hanging requests exhaust connections and memory, and the user waits forever.",
    ],
    autoteste: [
      {
        pergunta: "Why use jitter in backoff?",
        resposta:
          "Without randomness, every client that failed together retries at the same instant and repeats the spike. Jitter spreads the attempts over time.",
      },
      {
        pergunta: "The payment call timed out. Can you conclude it failed?",
        resposta:
          "No. A timeout only says the response did not arrive; the provider may have processed it. Repeat with the same idempotency key, or check the payment status before acting.",
      },
    ],
  },
};
