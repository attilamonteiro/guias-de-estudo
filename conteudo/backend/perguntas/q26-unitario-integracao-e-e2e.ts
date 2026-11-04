import type { Pergunta } from "../../tipos";

// Q26 · Unitário, integração e E2E
export const q26: Pergunta = {
  numero: 26,
  modulo: "confiabilidade",
  metodo: "compare",
  pt: {
    titulo: "Unitário, integração e E2E",
    pergunta: "O que são testes unitários, testes de integração e testes de ponta a ponta?",
    porqueEsteMetodo:
      "São três níveis da mesma escada, e o que importa é o que cada um pega e o que custa. Uma matriz com os mesmos critérios deixa isso visível, e o exemplo único mostra a diferença na prática.",
    resposta30s:
      "**Unitário**: testa uma peça isolada (função, classe) com dependências falsificadas; é rápido e pega erros de lógica. **Integração**: testa componentes reais juntos (serviço + banco, API + fila) e pega erros na fronteira (SQL, serialização, configuração). **Ponta a ponta (E2E)**: exercita o sistema inteiro como o usuário, é lento e frágil, e cobre só os fluxos críticos. A regra é a **pirâmide**: muitos unitários, alguns de integração, poucos E2E.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["", "Unitário", "Integração", "Ponta a ponta (E2E)"],
        linhas: [
          [
            "O que testa",
            "Uma função ou classe isolada",
            "Vários componentes reais juntos (serviço + banco, API + fila)",
            "O sistema inteiro, como o usuário o usa (UI ou API pública)",
          ],
          [
            "Dependências",
            "Falsificadas (mocks, stubs)",
            "Reais ou em contêineres (Testcontainers)",
            "Todas reais, ambiente parecido com produção",
          ],
          ["Velocidade", "Milissegundos", "Segundos", "Minutos"],
          ["Fragilidade", "Baixa", "Média", "Alta (flaky: rede, tempo, dados)"],
          [
            "O que pega",
            "Erros de lógica",
            "SQL errado, serialização, contratos, configuração",
            "Fluxo quebrado entre sistemas, deploy, UI",
          ],
          ["Quantidade ideal", "Muitos (base)", "Alguns", "Poucos, só os fluxos críticos"],
          ["Custo de manutenção", "Baixo", "Médio", "Alto"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O mesmo recurso, “criar pedido”, nos três níveis",
        legenda: "javascript (jest + supertest)",
        codigo:
          '// unitario: sem banco, sem rede\ntest("total soma preco x quantidade", () => {\n  expect(totalDoPedido([{ preco: 10, qtd: 2 }, { preco: 5, qtd: 1 }])).toBe(25)\n})\n\n// integracao: API real + Postgres de teste\ntest("POST /pedidos grava e responde 201", async () => {\n  const r = await request(app).post("/pedidos").send({ itens: [{ sku: "A1", qtd: 2 }] })\n  expect(r.status).toBe(201)\n  expect(await db.count("pedidos")).toBe(1)\n})\n\n// e2e: navegador de verdade em staging (Playwright/Cypress)\n// o usuario faz login, adiciona ao carrinho, paga e ve a confirmacao',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Pirâmide ou troféu?",
        texto:
          "A pirâmide clássica manda muitos unitários, poucos de integração e pouquíssimos E2E. Em backends que são sobretudo CRUD e SQL, muita gente prefere o “troféu”, com mais integração, porque é ali que os bugs reais aparecem. O critério é o mesmo: **o teste mais barato que ainda pegaria aquele bug**.",
      },
      {
        tipo: "tabela",
        titulo: "Outros tipos que complementam",
        colunas: ["Tipo", "Para quê"],
        linhas: [
          [
            "Contrato (ex.: Pact)",
            "Garante que consumidor e provedor de uma API concordam, sem subir os dois sistemas",
          ],
          ["Smoke", "Poucos testes rápidos depois do deploy: o sistema está de pé?"],
          ["Carga e estresse", "Como se comporta sob volume e até onde aguenta"],
          ["Mutação", "Altera o código de propósito para ver se os testes percebem"],
          ["Regressão", "Reproduz bugs já corrigidos para não voltarem"],
        ],
      },
    ],
    armadilhas: [
      "Mock demais: o teste passa a validar o mock, não o sistema.",
      "Tudo em E2E: lento, flaky e difícil de diagnosticar (falha só diz que algo quebrou).",
      "Testes que dependem de ordem, de relógio ou de dados compartilhados.",
      "Perseguir % de cobertura: cobertura mostra o que não foi testado, não que o testado está correto.",
      "Testes de integração apontando para um banco real de produção.",
    ],
    autoteste: [
      {
        pergunta: "Por que não fazer só testes E2E?",
        resposta:
          "São lentos, frágeis e difíceis de diagnosticar; um unitário falhando aponta a linha, um E2E falhando só diz que algo quebrou.",
      },
      {
        pergunta: "O que um teste de integração pega que o unitário não pega?",
        resposta:
          "Erros na fronteira entre componentes: SQL errado, serialização, configuração e contrato com outra API.",
      },
    ],
  },
  en: {
    titulo: "Unit, integration and E2E",
    pergunta: "What are unit tests, integration tests and end-to-end tests?",
    porqueEsteMetodo:
      "They are three levels of the same ladder, and what matters is what each catches and what it costs. A matrix with the same criteria makes that visible, and the single example shows the difference in practice.",
    resposta30s:
      "**Unit**: tests an isolated piece (function, class) with faked dependencies; fast, catches logic errors. **Integration**: tests real components together (service + database, API + queue) and catches boundary errors (SQL, serialization, configuration). **End-to-end (E2E)**: exercises the whole system like a user; slow and fragile, so it covers only critical flows. The rule is the **pyramid**: many unit, some integration, few E2E.",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["", "Unit", "Integration", "End-to-end (E2E)"],
        linhas: [
          [
            "What it tests",
            "One isolated function or class",
            "Several real components together (service + database, API + queue)",
            "The whole system, as the user uses it (UI or public API)",
          ],
          [
            "Dependencies",
            "Faked (mocks, stubs)",
            "Real or in containers (Testcontainers)",
            "All real, production-like environment",
          ],
          ["Speed", "Milliseconds", "Seconds", "Minutes"],
          ["Fragility", "Low", "Medium", "High (flaky: network, timing, data)"],
          [
            "What it catches",
            "Logic errors",
            "Wrong SQL, serialization, contracts, configuration",
            "Broken flow across systems, deployment, UI",
          ],
          ["Ideal quantity", "Many (the base)", "Some", "Few, only critical flows"],
          ["Maintenance cost", "Low", "Medium", "High"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same feature, “create order”, at the three levels",
        legenda: "javascript (jest + supertest)",
        codigo:
          '// unit: no database, no network\ntest("total sums price x quantity", () => {\n  expect(orderTotal([{ price: 10, qty: 2 }, { price: 5, qty: 1 }])).toBe(25)\n})\n\n// integration: real API + test Postgres\ntest("POST /orders stores and returns 201", async () => {\n  const r = await request(app).post("/orders").send({ items: [{ sku: "A1", qty: 2 }] })\n  expect(r.status).toBe(201)\n  expect(await db.count("orders")).toBe(1)\n})\n\n// e2e: a real browser against staging (Playwright/Cypress)\n// the user logs in, adds to cart, pays and sees the confirmation',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Pyramid or trophy?",
        texto:
          "The classic pyramid prescribes many unit tests, few integration tests and very few E2E. In backends that are mostly CRUD and SQL, many people prefer the “trophy”, with more integration, because that is where real bugs show up. The criterion is the same: **the cheapest test that would still catch that bug**.",
      },
      {
        tipo: "tabela",
        titulo: "Other types that complement",
        colunas: ["Type", "Purpose"],
        linhas: [
          ["Contract (e.g. Pact)", "Ensures an API’s consumer and provider agree, without starting both systems"],
          ["Smoke", "A few quick tests after deploy: is the system up?"],
          ["Load and stress", "How it behaves under volume and how far it holds"],
          ["Mutation", "Deliberately alters the code to see whether the tests notice"],
          ["Regression", "Reproduces already-fixed bugs so they do not come back"],
        ],
      },
    ],
    armadilhas: [
      "Too many mocks: the test ends up validating the mock, not the system.",
      "Everything as E2E: slow, flaky and hard to diagnose (a failure only says something broke).",
      "Tests that depend on order, clock or shared data.",
      "Chasing coverage %: coverage shows what was not tested, not that what was tested is correct.",
      "Integration tests pointing at a real production database.",
    ],
    autoteste: [
      {
        pergunta: "Why not do only E2E tests?",
        resposta:
          "They are slow, fragile and hard to diagnose; a failing unit test points at the line, a failing E2E only says something broke.",
      },
      {
        pergunta: "What does an integration test catch that a unit test does not?",
        resposta:
          "Errors at the boundary between components: wrong SQL, serialization, configuration and the contract with another API.",
      },
    ],
  },
};
