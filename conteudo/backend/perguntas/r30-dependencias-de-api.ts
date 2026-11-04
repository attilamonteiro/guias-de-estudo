import type { Pergunta } from "../../tipos";

// R30 · Dependências de API
export const r30: Pergunta = {
  numero: 130,
  modulo: "roadmap-intermediario",
  metodo: "whys",
  pt: {
    titulo: "Dependências de API",
    pergunta: "Como você gerenciou dependências de API em sistemas backend?",
    porqueEsteMetodo:
      "Uma dependência de API é um risco por causa de uma cadeia de motivos. Perguntar “por quê?” leva às quatro defesas (versionar, testar contrato, isolar, proteger).",
    resposta30s:
      "Trate toda API externa como **mutável e não confiável**: **fixe a versão** que você usa, **teste o contrato** no CI, **isole a dependência atrás de uma camada própria** (anticorruption layer) e **proteja-se das falhas** com timeouts, retentativas, circuit breaker e fallback. Monitore a latência, os erros e os avisos de depreciação de cada dependência.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que uma dependência de API é um risco?",
            resposta:
              "Porque ela muda e falha por decisão de outra equipe ou empresa: um campo renomeado ou uma queda deixa o seu sistema quebrado sem você ter mexido em nada.",
          },
          {
            pergunta: "Por que isso quebra em silêncio?",
            resposta:
              "Porque o acoplamento está no **contrato** (formato, campos, semântica), que raramente é testado de forma contínua.",
          },
          {
            pergunta: "Por que versionar e fixar versões ajuda?",
            resposta:
              "Porque você escolhe quando migrar: usar uma versão explícita (`/v1`, SDK com versão fixa) impede que o provedor altere por baixo o que você usa.",
          },
          {
            pergunta: "Por que testar o contrato?",
            resposta:
              "Porque **testes de contrato** (Pact, validação contra OpenAPI) pegam a quebra no CI, antes de ela chegar à produção.",
          },
          {
            pergunta: "Por que isolar a dependência no código?",
            resposta:
              "Porque uma **camada de adaptação** concentra o conhecimento da API externa num lugar: quando ela muda, você ajusta um módulo só.",
          },
        ],
        causaRaiz:
          "Trate toda API externa como **mutável e não confiável**: versione, teste o contrato, isole atrás de uma camada própria e proteja-se das falhas.",
      },
      {
        tipo: "passos",
        titulo: "Proteja-se das falhas",
        passos: [
          {
            titulo: "Timeouts e retentativas",
            texto: "Nunca espere indefinidamente; use retry com backoff só em operações idempotentes.",
          },
          {
            titulo: "Circuit breaker e fallback",
            texto: "Abre o circuito ao detectar falhas e responde com cache ou degradação.",
          },
          {
            titulo: "Monitore",
            texto: "Latência, erros e mudanças de contrato por dependência; alerta de depreciação (`Sunset`).",
          },
          {
            titulo: "Mantenha um inventário",
            texto: "Lista das APIs usadas, versões, donos e planos de migração.",
          },
        ],
      },
    ],
    armadilhas: [
      "Usar a versão “latest” ou nenhuma versão explícita.",
      "Chamar a API externa espalhada por todo o código.",
      "Sem timeout: a lentidão alheia derruba o seu serviço.",
      "Ignorar os avisos de depreciação.",
    ],
    autoteste: [
      {
        pergunta: "O que é um teste de contrato?",
        resposta:
          "Um teste que verifica se consumidor e provedor de uma API concordam sobre o formato das mensagens, sem subir o sistema inteiro.",
      },
      {
        pergunta: "Por que isolar uma API externa numa camada de adaptação?",
        resposta: "Para que mudanças nela afetem um módulo só e o resto do sistema use um modelo estável seu.",
      },
    ],
  },
  en: {
    titulo: "Managing API dependencies",
    pergunta: "How have you managed API dependencies in backend systems?",
    porqueEsteMetodo:
      "An API dependency is a risk because of a chain of reasons. Asking “why?” leads to the four defenses (version, test the contract, isolate, protect).",
    resposta30s:
      "Treat every external API as **mutable and untrusted**: **pin the version** you use, **test the contract** in CI, **isolate the dependency behind your own layer** (anticorruption layer) and **protect yourself from failures** with timeouts, retries, a circuit breaker and a fallback. Monitor each dependency’s latency, errors and deprecation notices.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why is an API dependency a risk?",
            resposta:
              "Because it changes and fails by the decision of another team or company: a renamed field or an outage breaks your system without you touching anything.",
          },
          {
            pergunta: "Why does it break silently?",
            resposta:
              "Because the coupling is in the **contract** (format, fields, semantics), which is rarely tested continuously.",
          },
          {
            pergunta: "Why does versioning and pinning help?",
            resposta:
              "Because you choose when to migrate: using an explicit version (`/v1`, a pinned SDK) stops the provider from changing what you use underneath.",
          },
          {
            pergunta: "Why test the contract?",
            resposta:
              "Because **contract tests** (Pact, validation against OpenAPI) catch the break in CI, before it reaches production.",
          },
          {
            pergunta: "Why isolate the dependency in code?",
            resposta:
              "Because an **adapter layer** concentrates knowledge of the external API in one place: when it changes, you adjust a single module.",
          },
        ],
        causaRaiz:
          "Treat every external API as **mutable and untrusted**: version, test the contract, isolate behind your own layer and protect against failures.",
      },
      {
        tipo: "passos",
        titulo: "Protect yourself from failures",
        passos: [
          {
            titulo: "Timeouts and retries",
            texto: "Never wait indefinitely; use retry with backoff only on idempotent operations.",
          },
          {
            titulo: "Circuit breaker and fallback",
            texto: "Open the circuit on detected failures and answer with cache or degradation.",
          },
          {
            titulo: "Monitor",
            texto: "Latency, errors and contract changes per dependency; a deprecation alert (`Sunset`).",
          },
          {
            titulo: "Keep an inventory",
            texto: "A list of APIs used, versions, owners and migration plans.",
          },
        ],
      },
    ],
    armadilhas: [
      "Using “latest” or no explicit version.",
      "Calling the external API scattered across the whole code.",
      "No timeout: someone else’s slowness takes your service down.",
      "Ignoring deprecation notices.",
    ],
    autoteste: [
      {
        pergunta: "What is a contract test?",
        resposta:
          "A test that checks whether an API’s consumer and provider agree on the message format, without starting the whole system.",
      },
      {
        pergunta: "Why isolate an external API behind an adapter layer?",
        resposta: "So changes to it affect a single module and the rest of the system uses a stable model of your own.",
      },
    ],
  },
};
