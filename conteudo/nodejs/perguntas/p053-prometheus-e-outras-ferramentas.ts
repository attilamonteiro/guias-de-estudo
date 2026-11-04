import type { Pergunta } from "../../tipos";

// P53 · Prometheus e outras ferramentas
export const p053: Pergunta = {
  numero: 753,
  modulo: "pawanmkr-observabilidade",
  metodo: "compare",
  pt: {
    titulo: "Prometheus e outras ferramentas",
    pergunta: "Compare o Prometheus e outras ferramentas de monitoramento para serviços Node.js.",
    porqueEsteMetodo:
      "As ferramentas de monitoramento se parecem de longe e diferem no modelo de coleta, em quem as opera e no que cobrem. Uma matriz lado a lado e uma regra de decisão evitam a escolha por moda.",
    resposta30s:
      "O **Prometheus** usa o modelo **pull**: raspa periodicamente um endpoint `/metrics` que a aplicação expõe (no Node, com a biblioteca `prom-client`), guarda séries temporais e as consulta em **PromQL**; os alertas saem pelo **Alertmanager** e os painéis, em geral pelo **Grafana**. Plataformas de agente ou SaaS (Datadog, New Relic, CloudWatch e similares) trabalham com **push** e entregam métricas, logs, traces e alertas prontos, enquanto o **OpenTelemetry** é um padrão de instrumentação, não um backend. A armadilha mais comum é a **cardinalidade dos rótulos**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Modelos de monitoramento lado a lado",
        colunas: [
          "Critério",
          "Prometheus (com Alertmanager e Grafana)",
          "Agente ou plataforma gerenciada (Datadog, New Relic, CloudWatch e similares)",
          "OpenTelemetry",
        ],
        linhas: [
          [
            "O que é",
            "Sistema de métricas de código aberto: coleta, guarda séries temporais e consulta; o Alertmanager cuida dos alertas e o Grafana desenha os painéis",
            "Plataformas em geral hospedadas que juntam métricas, logs, traces, alertas e painéis",
            "Padrão aberto de instrumentação (API, SDK, protocolo OTLP e Collector) para métricas, traces e logs; não armazena nem mostra nada",
          ],
          [
            "Como os dados chegam",
            "Pull: o Prometheus raspa o `/metrics` a cada intervalo",
            "Push: um agente no servidor ou um SDK na aplicação envia os dados à plataforma",
            "Push por OTLP para um Collector ou backend (também é possível expor métricas para o Prometheus raspar)",
          ],
          [
            "No Node.js",
            "`prom-client`: contadores, gauges, histogramas e métricas padrão do processo e do laço de eventos",
            "Agente ou biblioteca do fornecedor, em geral com instrumentação automática de HTTP e de bancos de dados",
            "SDK para Node.js com instrumentações automáticas e exportadores para vários destinos",
          ],
          [
            "Pontos fortes",
            "Métricas e alertas, modelo de rótulos, PromQL, integração com Kubernetes e descoberta de alvos",
            "Tudo no mesmo lugar, pouco para operar, correlação entre sinais",
            "Não prende você a um fornecedor; um só padrão para os três sinais",
          ],
          [
            "Quem opera",
            "Você (armazenamento, retenção, alta disponibilidade) ou um serviço gerenciado compatível",
            "O fornecedor opera a plataforma e você paga pelo uso (confira o modelo de cobrança)",
            "Você opera o Collector, se usar um; o armazenamento é do backend escolhido",
          ],
          [
            "Atenção",
            "Cardinalidade de rótulos; logs e traces pedem outras ferramentas; jobs de vida curta pedem o Pushgateway",
            "O custo cresce com volume e cardinalidade; dependência do fornecedor",
            "Não é um backend; a maturidade varia por sinal (métricas, traces, logs): confira a documentação",
          ],
          [
            "Quando faz sentido",
            "Você quer controle, código aberto e métricas e alertas sólidos, sobretudo em Kubernetes",
            "Você quer tudo pronto, pouca operação e já usa a nuvem ou o fornecedor",
            "Você quer instrumentar uma vez e trocar de backend depois, ou combinar com os outros dois",
          ],
        ],
        nota: "Os três não são excludentes: é comum instrumentar com OpenTelemetry e enviar para o Prometheus ou para uma plataforma. Funcionalidades e modelos de cobrança mudam; confira a documentação de cada produto.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte primeiro **quem vai operar** e **quais sinais você precisa**. Quer controle, código aberto e foco em métricas e alertas: **Prometheus** com Alertmanager e Grafana. Quer tudo pronto, com logs, traces e métricas no mesmo lugar, e aceita depender de um fornecedor: uma **plataforma gerenciada**. Quer manter a liberdade de trocar de backend: **instrumente com OpenTelemetry** e decida o destino depois. Para saber o que medir em um serviço Node.js, veja L118.",
      },
      {
        tipo: "codigo",
        titulo: "Expondo métricas com prom-client",
        legenda: "JavaScript",
        codigo: [
          'import client from "prom-client";',
          "client.collectDefaultMetrics(); // CPU, memória, GC e atraso do laço de eventos",
          "const duracao = new client.Histogram({",
          '  name: "http_request_duration_seconds",',
          '  help: "Duração das requisições HTTP",',
          '  labelNames: ["method", "route", "status"], // poucos valores possíveis',
          "});",
          "app.use((req, res, next) => {",
          "  const parar = duracao.startTimer();",
          '  res.on("finish", () => {',
          '    const route = req.route?.path ?? "outra"; // o modelo da rota, não a URL',
          "    parar({ method: req.method, route, status: res.statusCode });",
          "  });",
          "  next();",
          "});",
          'app.get("/metrics", async (req, res) => {',
          '  res.set("Content-Type", client.register.contentType);',
          "  res.end(await client.register.metrics());",
          "});",
        ].join("\n"),
        nota: "`app` é a sua aplicação Express. O rótulo `route` usa o modelo da rota (`/users/:id`), nunca a URL com o id, para manter poucas séries. Deixe o `/metrics` em rede ou porta interna.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cardinalidade de rótulos: a armadilha que mais pesa",
        texto:
          "Cada combinação única de valores de rótulos vira uma **série temporal** separada, guardada em memória e consultada. Um rótulo com valores ilimitados (id de usuário, URL completa com ids, `requestId`, mensagem de erro) cria milhões de séries: o Prometheus consome memória, as consultas ficam lentas e, em plataformas cobradas por volume ou por série, a conta sobe. Rotule só com poucos valores conhecidos (método, modelo da rota, classe de status) e leve o detalhe por requisição para logs e traces (veja P54).",
      },
    ],
    armadilhas: [
      "Usar rótulos de valor ilimitado (id de usuário, URL com ids, `requestId`): o número de séries explode.",
      "Olhar só a média da latência: use histogramas e percentis (p95, p99), que mostram a cauda que o usuário sente.",
      "Rodar com `cluster` ou vários processos como se houvesse um só registro de métricas: cada worker conta separado; agregue (o `prom-client` tem suporte para isso, confira a documentação) ou raspe cada processo.",
      "Expor o `/metrics` na internet pública: ele revela rotas e detalhes da infraestrutura; deixe-o em uma porta ou rede interna.",
    ],
    autoteste: [
      {
        pergunta: "O que significa o Prometheus usar o modelo pull e o que isso exige da aplicação?",
        resposta:
          "Ele busca as métricas: a aplicação só precisa expor um endpoint HTTP `/metrics` no formato de texto do Prometheus, que é raspado em intervalos fixos. No Node, o `prom-client` monta esse texto. Para jobs de vida curta, que somem antes da raspagem, usa-se o Pushgateway.",
      },
      {
        pergunta: "O OpenTelemetry substitui o Prometheus?",
        resposta:
          "Não: o OpenTelemetry padroniza a instrumentação e o envio de métricas, traces e logs, mas não armazena nem consulta. Ele precisa de um backend, que pode ser o Prometheus ou uma plataforma gerenciada.",
      },
    ],
  },
  en: {
    titulo: "Prometheus and other tools",
    pergunta: "Compare Prometheus and other monitoring tools for Node.js services.",
    porqueEsteMetodo:
      "Monitoring tools look alike from afar and differ in how they collect, who runs them and what they cover. A side-by-side matrix and a decision rule keep the choice from following fashion.",
    resposta30s:
      "**Prometheus** uses the **pull** model: it periodically scrapes a `/metrics` endpoint that the application exposes (in Node, with the `prom-client` library), stores time series and queries them in **PromQL**; alerts go out through **Alertmanager** and dashboards usually come from **Grafana**. Agent or SaaS platforms (Datadog, New Relic, CloudWatch and similar) work by **push** and deliver metrics, logs, traces and alerts ready-made, while **OpenTelemetry** is an instrumentation standard, not a backend. The most common trap is **label cardinality**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Monitoring models side by side",
        colunas: [
          "Criterion",
          "Prometheus (with Alertmanager and Grafana)",
          "Agent or managed platform (Datadog, New Relic, CloudWatch and similar)",
          "OpenTelemetry",
        ],
        linhas: [
          [
            "What it is",
            "An open-source metrics system: it collects, stores time series and queries them; Alertmanager handles alerts and Grafana draws the dashboards",
            "Platforms, usually hosted, that bundle metrics, logs, traces, alerts and dashboards",
            "An open instrumentation standard (API, SDK, OTLP protocol and Collector) for metrics, traces and logs; it stores and shows nothing",
          ],
          [
            "How data arrives",
            "Pull: Prometheus scrapes `/metrics` at each interval",
            "Push: an agent on the server or an SDK in the application sends the data to the platform",
            "Push over OTLP to a Collector or backend (metrics can also be exposed for Prometheus to scrape)",
          ],
          [
            "In Node.js",
            "`prom-client`: counters, gauges, histograms and default process and event-loop metrics",
            "The vendor’s agent or library, usually with automatic instrumentation of HTTP and databases",
            "A Node.js SDK with automatic instrumentations and exporters to many destinations",
          ],
          [
            "Strengths",
            "Metrics and alerts, the label model, PromQL, Kubernetes integration and target discovery",
            "Everything in one place, little to operate, correlation across signals",
            "Does not lock you to a vendor; one standard for the three signals",
          ],
          [
            "Who operates it",
            "You (storage, retention, high availability) or a compatible managed service",
            "The vendor runs the platform and you pay for usage (check the billing model)",
            "You run the Collector, if you use one; storage belongs to the chosen backend",
          ],
          [
            "Watch out for",
            "Label cardinality; logs and traces need other tools; short-lived jobs need the Pushgateway",
            "Cost grows with volume and cardinality; vendor dependence",
            "It is not a backend; maturity varies by signal (metrics, traces, logs): check the documentation",
          ],
          [
            "When it makes sense",
            "You want control, open source and solid metrics and alerts, especially on Kubernetes",
            "You want everything ready, little operations work, and you already use the cloud or the vendor",
            "You want to instrument once and switch backends later, or combine with the other two",
          ],
        ],
        nota: "The three are not mutually exclusive: it is common to instrument with OpenTelemetry and send to Prometheus or to a platform. Features and billing models change; check each product’s documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask first **who will operate it** and **which signals you need**. You want control, open source and a focus on metrics and alerts: **Prometheus** with Alertmanager and Grafana. You want everything ready, with logs, traces and metrics in one place, and accept depending on a vendor: a **managed platform**. You want the freedom to switch backends: **instrument with OpenTelemetry** and pick the destination later. For what to measure in a Node.js service, see L118.",
      },
      {
        tipo: "codigo",
        titulo: "Exposing metrics with prom-client",
        legenda: "JavaScript",
        codigo: [
          'import client from "prom-client";',
          "client.collectDefaultMetrics(); // CPU, memory, GC and event-loop delay",
          "const duration = new client.Histogram({",
          '  name: "http_request_duration_seconds",',
          '  help: "HTTP request duration",',
          '  labelNames: ["method", "route", "status"], // few possible values',
          "});",
          "app.use((req, res, next) => {",
          "  const stop = duration.startTimer();",
          '  res.on("finish", () => {',
          '    const route = req.route?.path ?? "other"; // the route pattern, not the URL',
          "    stop({ method: req.method, route, status: res.statusCode });",
          "  });",
          "  next();",
          "});",
          'app.get("/metrics", async (req, res) => {',
          '  res.set("Content-Type", client.register.contentType);',
          "  res.end(await client.register.metrics());",
          "});",
        ].join("\n"),
        nota: "`app` is your Express application. The `route` label uses the route pattern (`/users/:id`), never the URL with the id, to keep the series count low. Keep `/metrics` on an internal network or port.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Label cardinality: the trap that weighs the most",
        texto:
          "Each unique combination of label values becomes a separate **time series**, held in memory and queried. A label with unbounded values (user id, full URL with ids, `requestId`, error message) creates millions of series: Prometheus eats memory, queries slow down and, on platforms billed by volume or by series, the bill grows. Label only with a few known values (method, route pattern, status class) and send per-request detail to logs and traces (see P54).",
      },
    ],
    armadilhas: [
      "Using labels with unbounded values (user id, URL with ids, `requestId`): the number of series explodes.",
      "Looking only at average latency: use histograms and percentiles (p95, p99), which show the tail users feel.",
      "Running with `cluster` or several processes as if there were a single metrics registry: each worker counts on its own; aggregate (`prom-client` has support for it, check the documentation) or scrape each process.",
      "Exposing `/metrics` on the public internet: it reveals routes and infrastructure details; keep it on an internal port or network.",
    ],
    autoteste: [
      {
        pergunta:
          "What does it mean that Prometheus uses the pull model, and what does it require from the application?",
        resposta:
          "It fetches the metrics: the application only needs to expose an HTTP `/metrics` endpoint in the Prometheus text format, scraped at fixed intervals. In Node, `prom-client` builds that text. Short-lived jobs, which vanish before the scrape, use the Pushgateway.",
      },
      {
        pergunta: "Does OpenTelemetry replace Prometheus?",
        resposta:
          "No: OpenTelemetry standardizes the instrumentation and the delivery of metrics, traces and logs, but it neither stores nor queries them. It needs a backend, which can be Prometheus or a managed platform.",
      },
    ],
  },
};
