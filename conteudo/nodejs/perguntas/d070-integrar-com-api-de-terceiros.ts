import type { Pergunta } from "../../tipos";

// D70 · Integrar com API de terceiros
export const d070: Pergunta = {
  numero: 370,
  modulo: "devinterview-integracoes",
  metodo: "playbook",
  pt: {
    titulo: "Integrar com API de terceiros",
    pergunta: "Como você integraria um aplicativo Node.js com uma API de terceiros?",
    porqueEsteMetodo:
      "Integrar com um terceiro é uma sequência de decisões que dá errado quando um passo é pulado. O playbook fixa a ordem e o critério de cada passo, do contrato à observabilidade.",
    resposta30s:
      "Comece lendo a **documentação e os limites** do provedor e isole tudo numa **camada adaptadora**, que usa `fetch` (ou undici/axios), guarda a chave em **variável de ambiente**, define **timeout** em cada chamada e **valida** a resposta. Trate falhas com **retentativas com backoff** (só em erro transitório e com idempotência), respeite os **limites de taxa** e teste com **mocks**. Se o provedor chamar você, receba **webhooks** conferindo a assinatura.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook da integração",
        passos: [
          {
            titulo: "Leia o contrato e os limites",
            texto:
              "Antes de codar: autenticação, limites de taxa (por minuto, por dia), paginação, formato dos erros, ambiente de testes (sandbox), webhooks e política de versões e depreciação. Critério: você sabe dizer quantas chamadas pode fazer e o que acontece quando passa disso.",
          },
          {
            titulo: "Isole numa camada adaptadora",
            texto:
              "Um módulo (por exemplo, `integracoes/pagamentos`) é o único que conhece URL, cabeçalhos e formato do provedor. Ele expõe funções do **seu** domínio, converte respostas e erros do provedor em tipos e erros seus e usa o cliente HTTP escolhido (`fetch` nativo, undici ou axios; veja L82). Sinal de acerto: trocar de provedor mexe em um arquivo.",
          },
          {
            titulo: "Cuide da autenticação e dos segredos",
            texto:
              "Chave de API em variável de ambiente ou num cofre de segredos, nunca no repositório nem nos logs (veja L126). Com OAuth 2.0 no fluxo `client_credentials`, peça o token, guarde-o em memória até perto de expirar e renove; num `401`, renove uma vez antes de falhar.",
          },
          {
            titulo: "Defina prazo, retentativa e idempotência",
            texto:
              "Toda chamada leva um prazo próprio (`AbortSignal.timeout(ms)`), porque, sem ele, a espera pode passar do que o seu usuário aguenta. Repita só erros transitórios (timeout, `429`, `5xx`), com backoff exponencial, jitter e limite de tentativas (veja L105). Um `POST` só é repetido com chave de idempotência (por exemplo, o cabeçalho `Idempotency-Key`, se o provedor aceitar); sem ela, uma retentativa pode cobrar duas vezes.",
          },
          {
            titulo: "Respeite os limites e poupe a cota",
            texto:
              "Obedeça `429` e `Retry-After`, limite a concorrência do seu lado (um limitador ou uma fila) e guarde em cache, com TTL, as respostas que mudam pouco. Sinal de acerto: nenhum pico seu esgota a cota do provedor.",
          },
          {
            titulo: "Valide a resposta e receba webhooks",
            texto:
              "Não confie no formato: valide a resposta com um esquema na camada adaptadora (Zod, Ajv) e trate campos novos ou ausentes. Nos webhooks, confira a **assinatura** (HMAC sobre o corpo cru, com comparação em tempo constante), responda `2xx` logo, processe depois por uma fila e use o id do evento como chave de idempotência: a entrega costuma ser “pelo menos uma vez”, com repetição e fora de ordem.",
          },
          {
            titulo: "Teste e observe",
            texto:
              "No dia a dia, troque a camada adaptadora por um dublê (mocks de HTTP, como o `MockAgent` do undici, o nock ou o MSW). Na homologação ou no CI, rode **testes de contrato** contra o sandbox ou contra respostas gravadas. Em produção, registre latência, taxa de erro e `429` por provedor, com id de correlação, e configure alertas e um circuit breaker.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A camada adaptadora em miniatura",
        legenda: "JavaScript",
        codigo: [
          "// pagamentos.js: o único arquivo que conhece o provedor",
          "export async function buscarCobranca(id) {",
          "  const url = `${process.env.PAGAMENTOS_URL}/cobrancas/${encodeURIComponent(id)}`;",
          "  const res = await fetch(url, {",
          "    headers: { Authorization: `Bearer ${process.env.PAGAMENTOS_CHAVE}` },",
          "    signal: AbortSignal.timeout(5000), // prazo próprio; ao estourar, lança TimeoutError",
          "  });",
          "  if (res.status === 404) return null; // 404 é resposta do domínio (não existe), não falha",
          "  if (!res.ok) {",
          "    const transitorio = res.status === 429 || res.status >= 500; // quem chama decide se repete",
          "    throw Object.assign(new Error(`pagamentos: HTTP ${res.status}`), { transitorio });",
          "  }",
          "  const corpo = await res.json(); // em produção, valide com um esquema (Zod, Ajv)",
          "  return { id: String(corpo.id), valorEmCentavos: Number(corpo.amount) }; // formato do SEU sistema",
          "}",
        ].join("\n"),
        nota: "A retentativa com backoff fica fora desta função, com quem a chama, e só para erros marcados como `transitorio` (veja L105).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de ouro",
        texto:
          "A API do terceiro é uma dependência que pode ficar lenta, falhar, mudar e limitar você. Trate-a assim: **prazo em toda chamada, retentativa limitada, resposta validada e uma camada que isole o resto do sistema**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidado com cobranças duplicadas",
        texto:
          "Repetir um `POST` não idempotente (pagamento, envio de e-mail) depois de um timeout é como apertar o botão duas vezes: a primeira tentativa pode ter funcionado. Sem chave de idempotência, consulte o estado antes de repetir.",
      },
    ],
    armadilhas: [
      "Espalhar `fetch` e a URL do provedor pelo código: trocar de provedor, mudar de versão ou testar vira um pente-fino.",
      "Chamar sem timeout: um terceiro lento prende requisições, conexões e memória do seu servidor.",
      "Repetir qualquer erro, sem backoff: um `4xx` de validação não melhora ao repetir, e a repetição em massa agrava a queda do provedor.",
      "Confiar no corpo da resposta ou do webhook sem validá-lo nem conferir a assinatura.",
    ],
    autoteste: [
      {
        pergunta: "Por que isolar a integração numa camada adaptadora?",
        resposta:
          "Para que só um módulo conheça o formato do provedor. Ele traduz respostas e erros para o domínio do sistema, concentra timeout, retentativa e autenticação e permite trocar de provedor ou simulá-lo nos testes sem tocar no resto do código.",
      },
      {
        pergunta: "Como tornar seguro o recebimento de um webhook?",
        resposta:
          "Conferindo a assinatura sobre o corpo cru, respondendo `2xx` rapidamente e processando depois por uma fila, e usando o id do evento para ignorar repetições.",
      },
    ],
  },
  en: {
    titulo: "Integrating a third-party API",
    pergunta: "How would you integrate a Node.js app with a third-party API?",
    porqueEsteMetodo:
      "Integrating with a third party is a sequence of decisions that goes wrong when a step is skipped. The playbook fixes the order and the criterion of each step, from the contract to observability.",
    resposta30s:
      "Start by reading the provider’s **documentation and limits** and isolate everything in an **adapter layer** that uses `fetch` (or undici/axios), keeps the key in an **environment variable**, sets a **timeout** on every call and **validates** the response. Handle failures with **retries with backoff** (only for transient errors and with idempotency), respect **rate limits** and test with **mocks**. If the provider calls you, receive **webhooks** and check the signature.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Integration playbook",
        passos: [
          {
            titulo: "Read the contract and the limits",
            texto:
              "Before coding: authentication, rate limits (per minute, per day), pagination, error format, test environment (sandbox), webhooks and the versioning and deprecation policy. Criterion: you can say how many calls you may make and what happens when you go over.",
          },
          {
            titulo: "Isolate it in an adapter layer",
            texto:
              "One module (for example, `integrations/payments`) is the only one that knows the provider’s URL, headers and format. It exposes functions of **your** domain, converts the provider’s responses and errors into your own types and errors, and uses the chosen HTTP client (native `fetch`, undici or axios; see L82). Sign you got it right: switching providers touches one file.",
          },
          {
            titulo: "Handle authentication and secrets",
            texto:
              "The API key lives in an environment variable or a secrets vault, never in the repository or the logs (see L126). With OAuth 2.0 using the `client_credentials` flow, request the token, keep it in memory until close to expiry and renew it; on a `401`, renew once before failing.",
          },
          {
            titulo: "Set a deadline, retries and idempotency",
            texto:
              "Every call gets its own deadline (`AbortSignal.timeout(ms)`), because without one the wait can exceed what your user will tolerate. Retry only transient errors (timeout, `429`, `5xx`), with exponential backoff, jitter and a cap on attempts (see L105). A `POST` is only retried with an idempotency key (for example, the `Idempotency-Key` header, if the provider accepts it); without one, a retry can charge twice.",
          },
          {
            titulo: "Respect the limits and save quota",
            texto:
              "Obey `429` and `Retry-After`, cap concurrency on your side (a limiter or a queue) and cache, with a TTL, responses that rarely change. Sign you got it right: none of your spikes exhausts the provider’s quota.",
          },
          {
            titulo: "Validate the response and receive webhooks",
            texto:
              "Do not trust the format: validate the response with a schema in the adapter layer (Zod, Ajv) and handle new or missing fields. For webhooks, check the **signature** (HMAC over the raw body, with constant-time comparison), reply `2xx` quickly, process later through a queue and use the event id as an idempotency key: delivery is usually “at least once”, with repeats and out of order.",
          },
          {
            titulo: "Test and observe",
            texto:
              "Day to day, replace the adapter layer with a stand-in (HTTP mocks such as undici’s `MockAgent`, nock or MSW). In staging or CI, run **contract tests** against the sandbox or recorded responses. In production, record latency, error rate and `429` per provider, with a correlation id, and set up alerts and a circuit breaker.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The adapter layer in miniature",
        legenda: "JavaScript",
        codigo: [
          "// payments.js: the only file that knows the provider",
          "export async function fetchCharge(id) {",
          "  const url = `${process.env.PAYMENTS_URL}/charges/${encodeURIComponent(id)}`;",
          "  const res = await fetch(url, {",
          "    headers: { Authorization: `Bearer ${process.env.PAYMENTS_KEY}` },",
          "    signal: AbortSignal.timeout(5000), // own deadline; when it expires, throws TimeoutError",
          "  });",
          "  if (res.status === 404) return null; // 404 is a domain answer (it does not exist), not a failure",
          "  if (!res.ok) {",
          "    const transient = res.status === 429 || res.status >= 500; // the caller decides whether to retry",
          "    throw Object.assign(new Error(`payments: HTTP ${res.status}`), { transient });",
          "  }",
          "  const body = await res.json(); // in production, validate with a schema (Zod, Ajv)",
          "  return { id: String(body.id), amountInCents: Number(body.amount) }; // YOUR system’s format",
          "}",
        ].join("\n"),
        nota: "Retry with backoff lives outside this function, with whoever calls it, and only for errors flagged as `transient` (see L105).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Golden rule",
        texto:
          "The third party’s API is a dependency that can slow down, fail, change and limit you. Treat it that way: **a deadline on every call, bounded retries, a validated response and a layer that isolates the rest of the system**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Beware of duplicate charges",
        texto:
          "Retrying a non-idempotent `POST` (a payment, an email) after a timeout is like pressing the button twice: the first attempt may have worked. Without an idempotency key, check the state before retrying.",
      },
    ],
    armadilhas: [
      "Scattering `fetch` and the provider’s URL across the code: switching providers, changing versions or testing becomes a fine-tooth comb job.",
      "Calling without a timeout: a slow third party ties up your server’s requests, connections and memory.",
      "Retrying every error, with no backoff: a validation `4xx` does not improve on retry, and mass retries make the provider’s outage worse.",
      "Trusting the response or webhook body without validating it or checking the signature.",
    ],
    autoteste: [
      {
        pergunta: "Why isolate the integration in an adapter layer?",
        resposta:
          "So that only one module knows the provider’s format. It translates responses and errors into the system’s domain, concentrates timeout, retry and authentication, and lets you swap the provider or simulate it in tests without touching the rest of the code.",
      },
      {
        pergunta: "How do you make receiving a webhook safe?",
        resposta:
          "By checking the signature over the raw body, replying `2xx` quickly and processing later through a queue, and using the event id to ignore repeats.",
      },
    ],
  },
};
