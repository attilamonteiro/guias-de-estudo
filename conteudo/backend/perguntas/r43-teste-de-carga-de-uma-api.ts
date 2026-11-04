import type { Pergunta } from "../../tipos";

// R43 · Teste de carga de uma API
export const r43: Pergunta = {
  numero: 143,
  modulo: "roadmap-avancado",
  metodo: "playbook",
  pt: {
    titulo: "Teste de carga de uma API",
    pergunta: "Como você abordaria o teste de carga de uma API de backend?",
    porqueEsteMetodo:
      "Teste de carga é um procedimento repetível: definir metas, montar o ambiente, rodar, observar, corrigir e repetir. O playbook mostra a ordem e as armadilhas de cada passo.",
    resposta30s:
      "Defina **metas** (RPS, latência p95/p99, taxa de erro), monte um **ambiente parecido com produção** com dados realistas, **modele o tráfego real** com uma ferramenta (k6, JMeter, Locust, Gatling), rode os tipos de teste (**carga, estresse, pico, resistência**), **aumente a carga gradualmente** observando app e infraestrutura, **corrija o gargalo** e **repita**, de preferência automatizado no CI.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Defina objetivos e metas",
            texto:
              "Que carga (usuários ou RPS), que latência (p95/p99) e que taxa de erro são aceitáveis (SLO)? Quais fluxos importam?",
          },
          {
            titulo: "Monte um ambiente parecido com produção",
            texto:
              "Mesma configuração, dados com volume realista, dependências isoladas ou simuladas. Nunca contra produção sem planejamento.",
          },
          {
            titulo: "Modele o tráfego real",
            texto:
              "Mistura de endpoints, dados variados, tempo de “pensamento” do usuário e picos. Ferramentas: k6, JMeter, Locust, Gatling, LoadRunner.",
          },
          {
            titulo: "Rode vários tipos de teste",
            texto:
              "**Carga** (a esperada), **estresse** (além do limite, para achar o ponto de quebra), **pico** (subida súbita) e **resistência/soak** (horas, para achar vazamentos).",
          },
          {
            titulo: "Aumente gradualmente e observe",
            texto:
              "Métricas da aplicação (latência, erros, vazão) e do sistema (CPU, memória, I/O, conexões de banco, GC, filas).",
          },
          {
            titulo: "Ache o gargalo e corrija",
            texto: "Um fator por vez (índice, cache, pool, código); repita o teste.",
          },
          {
            titulo: "Automatize e registre",
            texto:
              "Teste de regressão de desempenho no CI ou antes de releases, guardando os resultados para comparar.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "javascript (k6)",
        codigo:
          'import http from "k6/http";\nimport { check } from "k6";\n\nexport const options = {\n  stages: [\n    { duration: "2m", target: 200 },   // sobe ate 200 usuarios virtuais\n    { duration: "5m", target: 200 },   // mantem\n    { duration: "1m", target: 0 },\n  ],\n  thresholds: {\n    http_req_failed: ["rate<0.01"],     // menos de 1% de erros\n    http_req_duration: ["p(95)<300"],   // p95 abaixo de 300 ms\n  },\n};\n\nexport default function () {\n  const r = http.get("https://staging.exemplo.com/api/pedidos");\n  check(r, { "status 200": (x) => x.status === 200 });\n}',
      },
    ],
    armadilhas: [
      "Testar com o banco vazio.",
      "Olhar só a média: o p99 mostra a experiência dos piores casos.",
      "Gerador de carga que satura antes do sistema (o cliente é o gargalo).",
      "Testar uma vez só, no fim do projeto.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre teste de carga e teste de estresse?",
        resposta:
          "Carga valida o comportamento na demanda esperada; estresse vai além do limite para descobrir o ponto de quebra e como o sistema falha.",
      },
      {
        pergunta: "Por que olhar percentis (p95/p99) e não só a média?",
        resposta: "A média esconde os casos lentos; os percentis mostram o que os usuários mais afetados sentem.",
      },
    ],
  },
  en: {
    titulo: "Load testing an API",
    pergunta: "How would you approach load testing a backend API?",
    porqueEsteMetodo:
      "Load testing is a repeatable procedure: set goals, build the environment, run, observe, fix and repeat. The playbook shows the order and the traps of each step.",
    resposta30s:
      "Define **goals** (RPS, p95/p99 latency, error rate), build a **production-like environment** with realistic data, **model real traffic** with a tool (k6, JMeter, Locust, Gatling), run the test types (**load, stress, spike, soak**), **raise the load gradually** while watching app and infrastructure, **fix the bottleneck** and **repeat**, preferably automated in CI.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Set objectives and goals",
            texto:
              "What load (users or RPS), what latency (p95/p99) and what error rate are acceptable (SLO)? Which flows matter?",
          },
          {
            titulo: "Build a production-like environment",
            texto:
              "Same configuration, realistic data volume, dependencies isolated or simulated. Never against production without planning.",
          },
          {
            titulo: "Model real traffic",
            texto:
              "A mix of endpoints, varied data, user “think time” and spikes. Tools: k6, JMeter, Locust, Gatling, LoadRunner.",
          },
          {
            titulo: "Run several test types",
            texto:
              "**Load** (the expected one), **stress** (beyond the limit, to find the breaking point), **spike** (sudden rise) and **soak** (hours, to find leaks).",
          },
          {
            titulo: "Increase gradually and observe",
            texto:
              "Application metrics (latency, errors, throughput) and system metrics (CPU, memory, I/O, database connections, GC, queues).",
          },
          {
            titulo: "Find the bottleneck and fix it",
            texto: "One factor at a time (index, cache, pool, code); repeat the test.",
          },
          {
            titulo: "Automate and record",
            texto: "A performance-regression test in CI or before releases, keeping results to compare.",
          },
        ],
      },
      {
        tipo: "codigo",
        legenda: "javascript (k6)",
        codigo:
          'import http from "k6/http";\nimport { check } from "k6";\n\nexport const options = {\n  stages: [\n    { duration: "2m", target: 200 },   // ramp up to 200 virtual users\n    { duration: "5m", target: 200 },   // hold\n    { duration: "1m", target: 0 },\n  ],\n  thresholds: {\n    http_req_failed: ["rate<0.01"],     // under 1% errors\n    http_req_duration: ["p(95)<300"],   // p95 under 300 ms\n  },\n};\n\nexport default function () {\n  const r = http.get("https://staging.example.com/api/orders");\n  check(r, { "status 200": (x) => x.status === 200 });\n}',
      },
    ],
    armadilhas: [
      "Testing with an empty database.",
      "Looking only at the average: p99 shows the worst-case experience.",
      "A load generator that saturates before the system (the client is the bottleneck).",
      "Testing once, at the end of the project.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a load test and a stress test?",
        resposta:
          "Load validates behavior at expected demand; stress goes beyond the limit to find the breaking point and how the system fails.",
      },
      {
        pergunta: "Why look at percentiles (p95/p99) and not only the average?",
        resposta: "The average hides the slow cases; percentiles show what the most affected users feel.",
      },
    ],
  },
};
