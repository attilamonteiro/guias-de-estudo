import type { Pergunta } from "../../tipos";

// R14 · Depurar um backend
export const r14: Pergunta = {
  numero: 114,
  modulo: "roadmap-iniciante",
  metodo: "playbook",
  pt: {
    titulo: "Depurar um backend",
    pergunta: "Que ferramentas e técnicas você usa para depurar uma aplicação backend?",
    porqueEsteMetodo:
      "Depurar é um método com ferramentas diferentes por ambiente. Um playbook separa o que se usa na sua máquina do que se usa no servidor.",
    resposta30s:
      "Na sua máquina, use o **debugger da IDE** (breakpoints, inspeção, passo a passo) e um **teste que reproduza** o bug. No servidor, use **observabilidade**: logs estruturados com ID da requisição, métricas, tracing, relatório de erros (Sentry) e APM. O método é o mesmo: **reproduzir, isolar, formular hipótese, corrigir a causa e deixar um teste de regressão**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Por ambiente",
        colunas: ["Ambiente", "Ferramentas e técnicas"],
        linhas: [
          [
            "Local",
            "Debugger da IDE (breakpoints, watch, passo a passo), testes que reproduzem o bug, logs em nível debug",
          ],
          [
            "Staging e produção",
            "Logs estruturados com trace ID, métricas e dashboards, tracing distribuído, relatório de erros (Sentry), APM (New Relic, Datadog)",
          ],
          ["Desempenho", "Profilers e flame graphs (`pprof`, clinic.js, async-profiler), `EXPLAIN` no banco"],
          ["Rede e integração", "`curl`, Postman, logs do proxy, captura de pacotes (Wireshark) quando necessário"],
        ],
      },
      {
        tipo: "passos",
        titulo: "O método",
        passos: [
          {
            titulo: "Reproduza",
            texto: "Ache o menor caso que dispara o problema e escreva um teste que falhe.",
          },
          {
            titulo: "Isole",
            texto: "Bissecção: qual versão, qual endpoint, qual dado, qual dependência.",
          },
          {
            titulo: "Hipótese e observação",
            texto: "Use logs, métricas e debugger para confirmar a causa, e não só o sintoma.",
          },
          {
            titulo: "Corrija e proteja",
            texto: "Corrija a causa-raiz e deixe o teste de regressão. Veja também as Q27 e Q28.",
          },
        ],
      },
    ],
    armadilhas: [
      "Mexer no código por palpite antes de reproduzir o problema.",
      "Pausar uma instância de produção com breakpoint.",
      "Logs sem contexto (sem ID da requisição).",
      "Corrigir o sintoma e não a causa.",
    ],
    autoteste: [
      {
        pergunta: "Como depurar algo que só acontece em produção?",
        resposta:
          "Com observabilidade: logs estruturados com trace ID, métricas, tracing e relatório de erros, mais um teste que reproduza o caso em ambiente controlado.",
      },
      {
        pergunta: "Por que escrever um teste antes de corrigir?",
        resposta: "Prova que você reproduziu o bug e impede que ele volte (regressão).",
      },
    ],
  },
  en: {
    titulo: "Debugging a backend",
    pergunta: "What tools and techniques do you use for debugging a backend application?",
    porqueEsteMetodo:
      "Debugging is a method with different tools per environment. A playbook separates what you use on your machine from what you use on the server.",
    resposta30s:
      "On your machine, use the **IDE debugger** (breakpoints, inspection, stepping) and a **test that reproduces** the bug. On the server, use **observability**: structured logs with a request ID, metrics, tracing, error reporting (Sentry) and APM. The method is the same: **reproduce, isolate, form a hypothesis, fix the cause and leave a regression test**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "By environment",
        colunas: ["Environment", "Tools and techniques"],
        linhas: [
          ["Local", "IDE debugger (breakpoints, watch, stepping), tests that reproduce the bug, debug-level logs"],
          [
            "Staging and production",
            "Structured logs with trace ID, metrics and dashboards, distributed tracing, error reporting (Sentry), APM (New Relic, Datadog)",
          ],
          ["Performance", "Profilers and flame graphs (`pprof`, clinic.js, async-profiler), `EXPLAIN` on the database"],
          ["Network and integration", "`curl`, Postman, proxy logs, packet capture (Wireshark) when needed"],
        ],
      },
      {
        tipo: "passos",
        titulo: "The method",
        passos: [
          {
            titulo: "Reproduce",
            texto: "Find the smallest case that triggers the problem and write a failing test.",
          },
          {
            titulo: "Isolate",
            texto: "Bisect: which version, endpoint, data, dependency.",
          },
          {
            titulo: "Hypothesis and observation",
            texto: "Use logs, metrics and the debugger to confirm the cause, not just the symptom.",
          },
          {
            titulo: "Fix and protect",
            texto: "Fix the root cause and leave the regression test. See also Q27 and Q28.",
          },
        ],
      },
    ],
    armadilhas: [
      "Changing code by guesswork before reproducing the problem.",
      "Pausing a production instance with a breakpoint.",
      "Logs with no context (no request ID).",
      "Fixing the symptom and not the cause.",
    ],
    autoteste: [
      {
        pergunta: "How do you debug something that only happens in production?",
        resposta:
          "With observability: structured logs with trace ID, metrics, tracing and error reporting, plus a test that reproduces the case in a controlled environment.",
      },
      {
        pergunta: "Why write a test before fixing?",
        resposta: "It proves you reproduced the bug and prevents it from coming back (regression).",
      },
    ],
  },
};
