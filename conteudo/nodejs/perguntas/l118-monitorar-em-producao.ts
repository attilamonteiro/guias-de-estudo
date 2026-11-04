import type { Pergunta } from "../../tipos";

// L118 · Monitorar em produção
export const l118: Pergunta = {
  numero: 218,
  modulo: "linkedin-producao",
  metodo: "compare",
  pt: {
    titulo: "Monitorar em produção",
    pergunta: "Como você monitora uma aplicação Node.js em produção?",
    porqueEsteMetodo:
      "Monitorar não é uma ferramenta só: métricas, logs, traces e health checks respondem a perguntas diferentes. A matriz os coloca lado a lado e a regra de decisão diz qual olhar primeiro em cada momento.",
    resposta30s:
      "Combine **métricas** (latência p95/p99, taxa de erros, saturação, atraso do event loop, memória e GC) para dashboards e alertas, **logs estruturados** para o detalhe de cada evento e **traces** para seguir uma requisição entre serviços, mais **health checks** (liveness e readiness) para o orquestrador. Instrumente com **OpenTelemetry** e alerte sobre **sintomas que o usuário sente**, não sobre cada causa possível.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro sinais, quatro perguntas",
        colunas: ["Sinal", "Pergunta que responde", "Ponto forte", "Limite"],
        linhas: [
          [
            "Métricas",
            "Como o serviço está e como evoluiu? Há algo errado agora?",
            "Números agregados e baratos; base dos dashboards e dos alertas",
            "Não mostram o caso individual; rótulos de alta cardinalidade (um por usuário) encarecem tudo",
          ],
          [
            "Logs",
            "O que aconteceu neste evento específico? (veja L117)",
            "Detalhe e contexto de um caso, inclusive erros e pilhas",
            "Volume e custo; ruins para enxergar tendência sem agregar",
          ],
          [
            "Traces",
            "Por onde esta requisição passou e onde gastou tempo?",
            "Mostram a cadeia entre serviços e o trecho lento",
            "Pedem instrumentação e amostragem; mais esforço e custo",
          ],
          [
            "Health checks",
            "O processo está vivo e pronto para receber tráfego?",
            "Simples; o balanceador e o orquestrador agem sozinhos sobre ele",
            "Sinal binário: um 200 convive com latência péssima",
          ],
        ],
        nota: "Liveness reinicia um processo travado; readiness decide se ele recebe tráfego. Não ponha dependências externas (banco, fila) na checagem de liveness: uma oscilação delas reiniciaria todas as instâncias de uma vez.",
      },
      {
        tipo: "tabela",
        titulo: "Métricas que valem um painel",
        colunas: ["Métrica", "O que revela", "Como obter e ler"],
        linhas: [
          [
            "Latência p95/p99 por rota",
            "A experiência da cauda lenta, que a média esconde",
            "Histograma por rota normalizada (`/pedidos/:id`, não a URL crua); compare com o objetivo de nível de serviço",
          ],
          [
            "Taxa de erros e de requisições",
            "Se o serviço está falhando e a carga que recebe",
            "Contagem por status (5xx e 4xx) e por rota; erros subindo com a carga estável indicam regressão",
          ],
          [
            "Saturação",
            "O quanto falta para o limite: CPU, conexões do pool, filas",
            "CPU do processo, uso e espera do pool de conexões, tamanho das filas; perto do limite a latência dispara",
          ],
          [
            "Atraso do event loop",
            "Laço bloqueado ou sobrecarregado: todas as requisições esperam",
            "`monitorEventLoopDelay` de `node:perf_hooks` (veja L30); alerte quando o p99 passar do que você aceita",
          ],
          [
            "Memória (heap, RSS)",
            "Vazamento ou uso crescente",
            "`process.memoryUsage()`; uma curva que sobe e não volta depois do GC é o sinal (veja L110)",
          ],
          [
            "Coletor de lixo (GC)",
            "Pressão de memória: pausas frequentes ou longas",
            "Entradas `gc` de um `PerformanceObserver` ou a métrica da sua biblioteca; pausas longas somam à latência",
          ],
          [
            "Dependências (banco, APIs externas)",
            "Onde o tempo realmente vai",
            "Latência e erros de cada chamada de saída, com timeouts; costumam explicar uma lentidão repentina",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Alerte** com métricas, sobre sintomas que o usuário sente (erros, latência acima do objetivo). **Investigue** nos traces, para achar o trecho lento, e termine nos logs, para ver o caso. Health checks servem à automação (balanceador, orquestrador) e não substituem o resto. Todo alerta precisa de uma ação clara: o que ninguém vai tratar vira painel, não alerta.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "OpenTelemetry",
        texto:
          "É um padrão aberto para instrumentar traces, métricas e logs, com SDK para Node.js e instrumentação automática de bibliotecas comuns (HTTP, Express, drivers de banco). Você exporta os dados para o backend que preferir, sem prender o código a um fornecedor. A instrumentação precisa ser carregada antes do código da aplicação; confira em opentelemetry.io o estado de cada sinal e como carregá-la em ESM.",
      },
    ],
    armadilhas: [
      "Olhar só a latência média: a cauda (p95/p99) é onde o usuário sofre, e a média a esconde.",
      "Monitorar apenas CPU e memória: um laço de eventos bloqueado ou um pool de conexões esgotado quase não aparece nesses números.",
      "Alertar sobre tudo (CPU acima de 70%, por exemplo): sem ação associada, o alerta vira ruído e a equipe passa a ignorá-lo.",
      "Usar um `/health` que sempre responde 200 sem checar nada: o balanceador continua mandando tráfego para uma instância que não serve.",
    ],
    autoteste: [
      {
        pergunta: "Quando usar métricas, logs e traces?",
        resposta:
          "Métricas dizem que há um problema e o tamanho dele (e disparam o alerta); traces mostram em que ponto da cadeia o tempo ou o erro está; logs dão o detalhe do caso. Em geral, a investigação segue essa ordem.",
      },
      {
        pergunta: "Por que monitorar o atraso do event loop em um serviço Node.js?",
        resposta:
          "Um processo com o laço bloqueado parece vivo (aceita conexões, ocupa memória), mas responde devagar a todos, e a média de CPU ou de latência pode demorar a mostrar. O atraso do laço mede isso diretamente (veja L30).",
      },
    ],
  },
  en: {
    titulo: "Production monitoring",
    pergunta: "How do you monitor a Node.js production application?",
    porqueEsteMetodo:
      "Monitoring is not a single tool: metrics, logs, traces and health checks answer different questions. The matrix puts them side by side and the decision rule says which one to look at first at each moment.",
    resposta30s:
      "Combine **metrics** (p95/p99 latency, error rate, saturation, event loop delay, memory and GC) for dashboards and alerts, **structured logs** for the detail of each event and **traces** to follow a request across services, plus **health checks** (liveness and readiness) for the orchestrator. Instrument with **OpenTelemetry** and alert on **symptoms users feel**, not on every possible cause.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four signals, four questions",
        colunas: ["Signal", "Question it answers", "Strength", "Limit"],
        linhas: [
          [
            "Metrics",
            "How is the service doing and how has it changed? Is something wrong now?",
            "Aggregated, cheap numbers; the basis of dashboards and alerts",
            "They do not show the individual case; high-cardinality labels (one per user) make everything expensive",
          ],
          [
            "Logs",
            "What happened in this specific event? (see L117)",
            "Detail and context of one case, including errors and stack traces",
            "Volume and cost; poor at showing trends without aggregation",
          ],
          [
            "Traces",
            "Where did this request go and where did it spend its time?",
            "They show the chain across services and the slow segment",
            "Need instrumentation and sampling; more effort and cost",
          ],
          [
            "Health checks",
            "Is the process alive and ready to receive traffic?",
            "Simple; the load balancer and the orchestrator act on it by themselves",
            "A binary signal: a 200 can coexist with terrible latency",
          ],
        ],
        nota: "Liveness restarts a stuck process; readiness decides whether it receives traffic. Do not put external dependencies (database, queue) in the liveness check: a blip in them would restart every instance at once.",
      },
      {
        tipo: "tabela",
        titulo: "Metrics worth a dashboard",
        colunas: ["Metric", "What it reveals", "How to get and read it"],
        linhas: [
          [
            "p95/p99 latency per route",
            "The experience of the slow tail, which the average hides",
            "Histogram per normalized route (`/orders/:id`, not the raw URL); compare with the service-level objective",
          ],
          [
            "Error rate and request rate",
            "Whether the service is failing and how much load it gets",
            "Count by status (5xx and 4xx) and by route; errors rising while load is steady point to a regression",
          ],
          [
            "Saturation",
            "How close you are to the limit: CPU, pool connections, queues",
            "Process CPU, connection pool usage and wait, queue sizes; near the limit, latency shoots up",
          ],
          [
            "Event loop delay",
            "A blocked or overloaded loop: every request waits",
            "`monitorEventLoopDelay` from `node:perf_hooks` (see L30); alert when p99 passes what you accept",
          ],
          [
            "Memory (heap, RSS)",
            "A leak or growing usage",
            "`process.memoryUsage()`; a curve that climbs and does not come back after GC is the sign (see L110)",
          ],
          [
            "Garbage collector (GC)",
            "Memory pressure: frequent or long pauses",
            "`gc` entries from a `PerformanceObserver`, or your library’s metric; long pauses add to latency",
          ],
          [
            "Dependencies (database, external APIs)",
            "Where the time really goes",
            "Latency and errors of each outgoing call, with timeouts; they often explain a sudden slowdown",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Alert** with metrics, on symptoms users feel (errors, latency above the objective). **Investigate** in traces, to find the slow segment, and finish in logs, to see the case. Health checks serve automation (load balancer, orchestrator) and do not replace the rest. Every alert needs a clear action: what nobody will act on becomes a dashboard, not an alert.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "OpenTelemetry",
        texto:
          "It is an open standard for instrumenting traces, metrics and logs, with a Node.js SDK and automatic instrumentation for common libraries (HTTP, Express, database drivers). You export the data to the backend you prefer, without tying the code to a vendor. The instrumentation must be loaded before the application code; check opentelemetry.io for the state of each signal and how to load it with ESM.",
      },
    ],
    armadilhas: [
      "Looking only at average latency: the tail (p95/p99) is where users suffer, and the average hides it.",
      "Monitoring only CPU and memory: a blocked event loop or an exhausted connection pool barely shows up in those numbers.",
      "Alerting on everything (CPU above 70%, say): with no action attached, the alert becomes noise and the team learns to ignore it.",
      "Using a `/health` that always answers 200 without checking anything: the load balancer keeps sending traffic to an instance that is not working.",
    ],
    autoteste: [
      {
        pergunta: "When do you use metrics, logs and traces?",
        resposta:
          "Metrics tell you there is a problem and how big it is (and fire the alert); traces show where in the chain the time or the error is; logs give the detail of the case. Investigation usually follows that order.",
      },
      {
        pergunta: "Why monitor event loop delay in a Node.js service?",
        resposta:
          "A process with a blocked loop looks alive (it accepts connections, it holds memory) but answers everyone slowly, and average CPU or latency may take a while to show it. Loop delay measures that directly (see L30).",
      },
    ],
  },
};
