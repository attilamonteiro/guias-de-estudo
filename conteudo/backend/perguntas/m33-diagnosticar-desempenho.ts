import type { Pergunta } from "../../tipos";

// M33 · Diagnosticar desempenho
export const m33: Pergunta = {
  numero: 233,
  modulo: "mentorcruise",
  metodo: "playbook",
  pt: {
    titulo: "Diagnosticar desempenho",
    pergunta: "Como você diagnostica e depura problemas de desempenho?",
    porqueEsteMetodo:
      "Diagnosticar é um procedimento investigativo, e a ordem evita o erro clássico: mexer no código antes de saber para onde o tempo está indo. Um playbook com o sinal de cada passo substitui o palpite.",
    resposta30s:
      "**Defina o sintoma e a linha de base**, **meça** (RED por serviço, USE por recurso, com **percentis p95/p99**), **ache a camada** com tracing distribuído, **aprofunde** com a ferramenta dela (profiler e flame graph, slow query log e `EXPLAIN`, métricas de GC, de pool e de fila), **mude uma coisa por vez**, reproduza com **teste de carga** e **verifique o ganho** contra a linha de base.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Defina o sintoma e a linha de base",
            texto:
              "“Está lento” não é um sintoma. Qual endpoint ou tela, para quem, em que percentil e desde quando? O que mudou (deploy, volume de dados, tráfego, configuração)? Anote os números de um período bom: sem linha de base você não prova que melhorou.",
          },
          {
            titulo: "Meça por serviço e por recurso",
            texto:
              "Para cada serviço, o método **RED**: taxa de requisições (Rate), erros (Errors) e duração (Duration). Para cada recurso (CPU, memória, disco, rede, pool de conexões), o método **USE**: utilização (Utilization), saturação (Saturation) e erros (Errors). Olhe **percentis (p95, p99)**, não só a média, e sobreponha os deploys ao gráfico.",
          },
          {
            titulo: "Ache a camada",
            texto:
              "Divida o caminho da requisição: cliente, rede (DNS, TLS, balanceador), aplicação, banco, serviços externos, filas. O **tracing distribuído** mostra o tempo de cada trecho e deixa visível onde ele vai: uma consulta longa, dez chamadas em série que poderiam ser paralelas, um serviço externo lento.",
          },
          {
            titulo: "Aprofunde com a ferramenta da camada",
            texto:
              "**Aplicação**: profiler de CPU e flame graph (qual função consome o tempo), profiler de alocação, tempo de pausa do coletor de lixo, threads bloqueadas. **Banco**: slow query log e `EXPLAIN` (veja Q13), N+1, esperas por travas, pool de conexões saturado. **Memória que só cresce**: veja Q27. **Serviço externo**: tempo por chamada, timeouts, retentativas. **Filas**: tamanho e atraso (lag).",
          },
          {
            titulo: "Uma hipótese, uma mudança por vez",
            texto:
              "Escreva a hipótese (“o pool de conexões satura e as requisições ficam esperando”) e o resultado esperado. Mude **uma coisa por vez** e meça depois de cada mudança; se mudar três, você não sabe qual ajudou nem qual piorou.",
          },
          {
            titulo: "Reproduza com teste de carga",
            texto:
              "Reproduza fora de produção, com dados e concorrência parecidos (veja R43). Aumente a carga em degraus até achar o ponto em que a latência dispara: ali está o gargalo. Se o problema só existe em produção, apoie-se em tracing e métricas ao vivo e mude de forma gradual.",
          },
          {
            titulo: "Verifique o ganho e trave",
            texto:
              "Compare com a linha de base nos mesmos percentis e com carga equivalente. Libere aos poucos (canary) e observe em produção. Deixe um alerta ou um teste de desempenho no pipeline para o problema não voltar em silêncio e registre a causa (veja Q28).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sintoma → suspeito → onde olhar",
        colunas: ["Sintoma", "Suspeito comum", "Onde olhar"],
        linhas: [
          [
            "CPU alta; a latência sobe junto com a carga",
            "Código quente: laço ineficiente, serialização, regex custosa",
            "Profiler de CPU e flame graph",
          ],
          [
            "CPU baixa, mas a API está lenta",
            "A aplicação espera: banco, rede, trava ou serviço externo",
            "Tracing, tempo de espera por conexão do pool, métricas do banco",
          ],
          [
            "p50 bom, p99 ruim, com picos periódicos",
            "Pausas do coletor de lixo, jobs em segundo plano, cache frio",
            "Métricas de GC, horário dos picos, tracing das requisições lentas",
          ],
          [
            "Piora gradual; a memória só sobe",
            "Vazamento ou cache sem limite",
            "Curva de memória e heap snapshots (veja Q27)",
          ],
          [
            "Timeouts ao obter conexão do banco",
            "Pool saturado: consultas lentas ou transações abertas por tempo demais",
            "Conexões em uso e em espera, consultas ativas no banco, slow query log",
          ],
          [
            "Lento só com muitos dados ou para certas contas",
            "Consulta sem índice, N+1, plano ruim",
            "`EXPLAIN` e o log de consultas lentas (veja Q13)",
          ],
          [
            "Fila crescendo; processamento atrasado",
            "Consumidores mais lentos que a chegada de mensagens",
            "Lag da fila, tempo por mensagem, número de consumidores",
          ],
        ],
        nota: "É um mapa de suspeitos, não um veredito: confirme sempre com uma medição.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A pergunta central: processando ou esperando?",
        texto:
          "Todo diagnóstico gira em torno de saber **onde o tempo vai**: a requisição está **consumindo CPU** ou está **esperando** (banco, rede, trava, fila, pool, outro serviço)? CPU alta pede profiling do código; CPU baixa com latência alta costuma indicar espera. Responder isso primeiro evita otimizar o lugar errado.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A média mente",
        texto:
          "Imagine que 1% das requisições leve 5 segundos e o resto leve 50 ms: a média parece saudável, mas esse 1% é real. E numa tela que dispara várias chamadas, a chance de o usuário cair em pelo menos uma lenta é bem maior que 1%. Por isso o alvo é um percentil (p95, p99), não a média.",
      },
    ],
    armadilhas: [
      "Otimizar por palpite, sem linha de base: no fim ninguém sabe se melhorou.",
      "Olhar só a média e deixar a cauda (p95, p99) invisível.",
      "Mudar várias coisas de uma vez: se o resultado mudar, você não sabe qual mudança foi a causa.",
      "Testar com poucos dados e sem concorrência: o problema real só aparece com o volume e a carga de produção.",
    ],
    autoteste: [
      {
        pergunta: "Por que acompanhar o p99 e não só a média?",
        resposta:
          "A média dilui as requisições lentas. O percentil mostra a experiência de quem está na cauda, onde costumam estar os timeouts e as reclamações.",
      },
      {
        pergunta: "A CPU está baixa e a API está lenta. Por onde começar?",
        resposta:
          "Pela espera: a requisição provavelmente aguarda banco, rede, trava, pool ou serviço externo. O tracing mostra em qual trecho o tempo é gasto.",
      },
      {
        pergunta: "Para que servem os métodos RED e USE?",
        resposta:
          "RED descreve o serviço do ponto de vista de quem o usa (taxa, erros, duração); USE descreve cada recurso (utilização, saturação, erros). Juntos apontam o serviço lento e o recurso saturado.",
      },
    ],
  },
  en: {
    titulo: "Diagnosing performance",
    pergunta: "How do you diagnose and debug performance issues?",
    porqueEsteMetodo:
      "Diagnosing is an investigative procedure, and its order prevents the classic mistake: changing code before knowing where the time is going. A playbook with the signal for each step replaces guesswork.",
    resposta30s:
      "**Define the symptom and a baseline**, **measure** (RED per service, USE per resource, using **p95/p99 percentiles**), **locate the layer** with distributed tracing, **dig in** with that layer’s tool (profiler and flame graph, slow-query log and `EXPLAIN`, GC, pool and queue metrics), **change one thing at a time**, reproduce with a **load test** and **verify the gain** against the baseline.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Define the symptom and a baseline",
            texto:
              "“It’s slow” is not a symptom. Which endpoint or screen, for whom, at which percentile and since when? What changed (deploy, data volume, traffic, configuration)? Write down the numbers from a good period: without a baseline you cannot prove it got better.",
          },
          {
            titulo: "Measure per service and per resource",
            texto:
              "For each service, the **RED** method: request rate, errors and duration. For each resource (CPU, memory, disk, network, connection pool), the **USE** method: utilization, saturation and errors. Look at **percentiles (p95, p99)**, not just the average, and overlay deploys on the chart.",
          },
          {
            titulo: "Locate the layer",
            texto:
              "Split the request path: client, network (DNS, TLS, load balancer), application, database, external services, queues. **Distributed tracing** shows the time of each segment and makes it visible where the time goes: one long query, ten serial calls that could run in parallel, a slow external service.",
          },
          {
            titulo: "Dig in with that layer’s tool",
            texto:
              "**Application**: CPU profiler and flame graph (which function eats the time), allocation profiler, garbage-collector pause time, blocked threads. **Database**: slow-query log and `EXPLAIN` (see Q13), N+1, lock waits, saturated connection pool. **Memory that only grows**: see Q27. **External service**: time per call, timeouts, retries. **Queues**: size and lag.",
          },
          {
            titulo: "One hypothesis, one change at a time",
            texto:
              "Write down the hypothesis (“the connection pool saturates and requests wait”) and the expected result. Change **one thing at a time** and measure after each change; if you change three, you do not know which helped or which made it worse.",
          },
          {
            titulo: "Reproduce with a load test",
            texto:
              "Reproduce outside production, with similar data and concurrency (see R43). Raise the load in steps until you find the point where latency takes off: that is the bottleneck. If the problem exists only in production, lean on tracing and live metrics and change things gradually.",
          },
          {
            titulo: "Verify the gain and lock it in",
            texto:
              "Compare with the baseline at the same percentiles and equivalent load. Roll out gradually (canary) and watch production. Leave an alert or a performance test in the pipeline so the problem does not quietly return, and record the cause (see Q28).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Symptom → suspect → where to look",
        colunas: ["Symptom", "Usual suspect", "Where to look"],
        linhas: [
          [
            "High CPU; latency rises along with load",
            "Hot code: inefficient loop, serialization, costly regex",
            "CPU profiler and flame graph",
          ],
          [
            "Low CPU, but the API is slow",
            "The application is waiting: database, network, lock or external service",
            "Tracing, wait time for a pool connection, database metrics",
          ],
          [
            "Good p50, bad p99, with periodic spikes",
            "Garbage-collector pauses, background jobs, cold cache",
            "GC metrics, time of the spikes, tracing of the slow requests",
          ],
          [
            "Gradual degradation; memory only goes up",
            "A leak or an unbounded cache",
            "Memory curve and heap snapshots (see Q27)",
          ],
          [
            "Timeouts when getting a database connection",
            "Saturated pool: slow queries or transactions open for too long",
            "Connections in use and waiting, active queries in the database, slow-query log",
          ],
          [
            "Slow only with lots of data or for certain accounts",
            "Missing index, N+1, bad plan",
            "`EXPLAIN` and the slow-query log (see Q13)",
          ],
          [
            "Queue growing; processing delayed",
            "Consumers slower than the arrival of messages",
            "Queue lag, time per message, number of consumers",
          ],
        ],
        nota: "It is a map of suspects, not a verdict: always confirm with a measurement.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The central question: working or waiting?",
        texto:
          "Every diagnosis revolves around knowing **where the time goes**: is the request **burning CPU** or **waiting** (database, network, lock, queue, pool, another service)? High CPU calls for profiling the code; low CPU with high latency usually points to waiting. Answering this first keeps you from optimizing the wrong place.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The average lies",
        texto:
          "Imagine 1% of requests take 5 seconds and the rest take 50 ms: the average looks healthy, but that 1% is real. And on a screen that fires several calls, the chance of the user hitting at least one slow call is much higher than 1%. That is why the target is a percentile (p95, p99), not the average.",
      },
    ],
    armadilhas: [
      "Optimizing by gut feeling, with no baseline: in the end nobody knows whether it improved.",
      "Looking only at the average and leaving the tail (p95, p99) invisible.",
      "Changing several things at once: if the result changes, you do not know which change caused it.",
      "Testing with little data and no concurrency: the real problem only shows up with production volume and load.",
    ],
    autoteste: [
      {
        pergunta: "Why track p99 and not just the average?",
        resposta:
          "The average dilutes the slow requests. The percentile shows the experience of those in the tail, where timeouts and complaints usually are.",
      },
      {
        pergunta: "CPU is low and the API is slow. Where do you start?",
        resposta:
          "With waiting: the request is probably blocked on the database, network, a lock, the pool or an external service. Tracing shows which segment the time is spent in.",
      },
      {
        pergunta: "What are the RED and USE methods for?",
        resposta:
          "RED describes the service from the point of view of its users (rate, errors, duration); USE describes each resource (utilization, saturation, errors). Together they point to the slow service and the saturated resource.",
      },
    ],
  },
};
