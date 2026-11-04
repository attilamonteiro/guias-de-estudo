import type { Pergunta } from "../../tipos";

// Q28 · Logging e monitoramento
export const q28: Pergunta = {
  numero: 28,
  modulo: "confiabilidade",
  metodo: "playbook",
  pt: {
    titulo: "Logging e monitoramento",
    pergunta: "Quais ferramentas e técnicas você usa para registrar e monitorar em um sistema backend?",
    porqueEsteMetodo:
      "“Quais técnicas você usa” pede uma prática em camadas, na ordem em que se monta: registrar bem, medir, rastrear, alertar sobre o que o usuário sente e definir metas. Um playbook mostra a escada.",
    resposta30s:
      "Observabilidade tem três pilares: **logs estruturados** (o que aconteceu nesta requisição), **métricas** (o sistema está saudável?) e **traces distribuídos** (onde o tempo foi gasto entre serviços), ligados por um **trace/correlation id**. Alerte em **sintomas** (taxa de erro, latência p99, SLO), com runbook, e não em causas. Ferramentas típicas: OpenTelemetry, Prometheus + Grafana, ELK/Loki/Datadog, Jaeger/Tempo, Sentry.",
    blocos: [
      {
        tipo: "passos",
        titulo: "A escada",
        passos: [
          {
            titulo: "Logs estruturados",
            texto:
              "JSON, não texto livre. Campos fixos: `timestamp`, `level`, `service`, `version`, **`trace_id`/`request_id`**, `user_id` (ou hash), `message`. Níveis: ERROR (acionável), WARN, INFO (eventos de negócio), DEBUG (desligado em produção por padrão). Nunca registre senhas, tokens nem dados pessoais sem necessidade.",
          },
          {
            titulo: "Coletar e centralizar",
            texto:
              "Escreva em stdout; um agente (Fluent Bit, Vector, Filebeat) envia para uma busca central (OpenSearch/ELK, Loki, Datadog, CloudWatch). Defina retenção e amostragem por custo.",
          },
          {
            titulo: "Métricas",
            texto:
              "Séries temporais agregadas (Prometheus + Grafana, StatsD). Para serviços, **RED**: Rate, Errors, Duration. Para recursos, **USE**: Utilization, Saturation, Errors. Os 4 sinais de ouro: latência, tráfego, erros, saturação. Use percentis (p95, p99), não só média, e evite rótulos de alta cardinalidade (como `user_id`).",
          },
          {
            titulo: "Traces distribuídos",
            texto:
              "OpenTelemetry + Jaeger/Tempo/Zipkin. Propague o trace id entre serviços (cabeçalho `traceparent`). Responde: em qual serviço o tempo foi gasto?",
          },
          {
            titulo: "Alertas",
            texto:
              "Alerte em **sintomas** que o usuário sente (taxa de erro, latência p99, SLO queimando), não em causas (CPU 80%). Cada alerta precisa ser acionável e ter runbook; senão gera fadiga.",
          },
          {
            titulo: "Saúde e sondas",
            texto:
              "Endpoints de liveness e readiness, monitoramento sintético (sondas externas simulando o usuário), dashboards por serviço, rastreamento de erros (Sentry).",
          },
          {
            titulo: "SLI, SLO e orçamento de erro",
            texto:
              "Defina o que é “bom” (ex.: 99,9% das requisições abaixo de 300 ms) e use o orçamento de erro para decidir entre lançar recurso novo e consertar confiabilidade.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Os três pilares",
        colunas: ["Pilar", "Pergunta que responde", "Custo", "Exemplo"],
        linhas: [
          [
            "Logs",
            "O que aconteceu nesta requisição?",
            "Alto (volume)",
            '`{"level":"error","trace_id":"ab12","msg":"pagamento recusado"}`',
          ],
          [
            "Métricas",
            "O sistema está saudável? Qual a tendência?",
            "Baixo",
            "Latência p99 = 0,8 s; taxa de erro = 0,4%",
          ],
          [
            "Traces",
            "Onde o tempo foi gasto entre os serviços?",
            "Médio (com amostragem)",
            "Requisição de 1,2 s: 900 ms no serviço de pagamento",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um log útil",
        legenda: "json",
        codigo:
          '{\n  "ts": "2026-11-03T14:02:11Z",\n  "level": "error",\n  "service": "checkout",\n  "version": "1.42.0",\n  "trace_id": "4bf92f3577b34da6",\n  "user_id": "u_8f3a",\n  "msg": "falha ao cobrar",\n  "err": "gateway_timeout",\n  "duration_ms": 3012\n}',
      },
    ],
    armadilhas: [
      "Log em texto livre que ninguém consegue consultar.",
      "Registrar dados pessoais, senhas ou tokens.",
      "Sem correlation id: é impossível seguir uma requisição entre serviços.",
      "Alertar em tudo (fadiga) ou em causas (CPU) em vez de sintomas.",
      "Rótulos de alta cardinalidade nas métricas derrubam o Prometheus; olhar só a média esconde o p99.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre log, métrica e trace?",
        resposta:
          "Log é o registro detalhado de um evento; métrica é uma série numérica agregada no tempo; trace segue uma requisição por vários serviços mostrando onde o tempo foi gasto.",
      },
      {
        pergunta: "Por que alertar em sintomas e não em causas?",
        resposta:
          "O usuário só sente o sintoma (erros, lentidão). CPU alta pode não afetar ninguém, e um problema real pode ocorrer com CPU normal.",
      },
    ],
  },
  en: {
    titulo: "Logging and monitoring",
    pergunta: "What tools and techniques do you use for logging and monitoring in a backend system?",
    porqueEsteMetodo:
      "“What techniques do you use” asks for a layered practice, in the order it is built: log well, measure, trace, alert on what the user feels and set goals. A playbook shows the ladder.",
    resposta30s:
      "Observability has three pillars: **structured logs** (what happened in this request), **metrics** (is the system healthy?) and **distributed traces** (where time was spent across services), tied together by a **trace/correlation id**. Alert on **symptoms** (error rate, p99 latency, SLO), with a runbook, not on causes. Typical tools: OpenTelemetry, Prometheus + Grafana, ELK/Loki/Datadog, Jaeger/Tempo, Sentry.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The ladder",
        passos: [
          {
            titulo: "Structured logs",
            texto:
              "JSON, not free text. Fixed fields: `timestamp`, `level`, `service`, `version`, **`trace_id`/`request_id`**, `user_id` (or a hash), `message`. Levels: ERROR (actionable), WARN, INFO (business events), DEBUG (off in production by default). Never log passwords, tokens or personal data without need.",
          },
          {
            titulo: "Collect and centralize",
            texto:
              "Write to stdout; an agent (Fluent Bit, Vector, Filebeat) ships to a central search (OpenSearch/ELK, Loki, Datadog, CloudWatch). Set retention and sampling for cost.",
          },
          {
            titulo: "Metrics",
            texto:
              "Aggregated time series (Prometheus + Grafana, StatsD). For services, **RED**: Rate, Errors, Duration. For resources, **USE**: Utilization, Saturation, Errors. The 4 golden signals: latency, traffic, errors, saturation. Use percentiles (p95, p99), not only the average, and avoid high-cardinality labels (like `user_id`).",
          },
          {
            titulo: "Distributed traces",
            texto:
              "OpenTelemetry + Jaeger/Tempo/Zipkin. Propagate the trace id across services (`traceparent` header). Answers: in which service was the time spent?",
          },
          {
            titulo: "Alerts",
            texto:
              "Alert on **symptoms** the user feels (error rate, p99 latency, SLO burning), not on causes (CPU 80%). Every alert must be actionable and have a runbook; otherwise it causes fatigue.",
          },
          {
            titulo: "Health and probes",
            texto:
              "Liveness and readiness endpoints, synthetic monitoring (external probes simulating the user), per-service dashboards, error tracking (Sentry).",
          },
          {
            titulo: "SLI, SLO and error budget",
            texto:
              "Define what “good” is (e.g. 99.9% of requests under 300 ms) and use the error budget to decide between shipping new features and fixing reliability.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The three pillars",
        colunas: ["Pillar", "Question it answers", "Cost", "Example"],
        linhas: [
          [
            "Logs",
            "What happened in this request?",
            "High (volume)",
            '`{"level":"error","trace_id":"ab12","msg":"payment declined"}`',
          ],
          ["Metrics", "Is the system healthy? What is the trend?", "Low", "p99 latency = 0.8 s; error rate = 0.4%"],
          [
            "Traces",
            "Where was time spent across services?",
            "Medium (with sampling)",
            "A 1.2 s request: 900 ms in the payment service",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A useful log line",
        legenda: "json",
        codigo:
          '{\n  "ts": "2026-11-03T14:02:11Z",\n  "level": "error",\n  "service": "checkout",\n  "version": "1.42.0",\n  "trace_id": "4bf92f3577b34da6",\n  "user_id": "u_8f3a",\n  "msg": "charge failed",\n  "err": "gateway_timeout",\n  "duration_ms": 3012\n}',
      },
    ],
    armadilhas: [
      "Free-text logs nobody can query.",
      "Logging personal data, passwords or tokens.",
      "No correlation id: it is impossible to follow a request across services.",
      "Alerting on everything (fatigue) or on causes (CPU) instead of symptoms.",
      "High-cardinality metric labels take Prometheus down; looking only at the average hides the p99.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a log, a metric and a trace?",
        resposta:
          "A log is the detailed record of an event; a metric is a numeric series aggregated over time; a trace follows a request across services showing where time was spent.",
      },
      {
        pergunta: "Why alert on symptoms rather than causes?",
        resposta:
          "The user only feels the symptom (errors, slowness). High CPU may affect nobody, and a real problem can occur with normal CPU.",
      },
    ],
  },
};
