import type { Pergunta } from "../../tipos";

// D35 · Frameworks de teste
export const d035: Pergunta = {
  numero: 335,
  modulo: "devinterview-testes-e-dados",
  metodo: "compare",
  pt: {
    titulo: "Frameworks de teste",
    pergunta: "Quais frameworks existem para testar aplicações Node.js?",
    porqueEsteMetodo:
      "As ferramentas de teste se sobrepõem, mas nascem de escolhas diferentes (tudo incluído ou minimalista, ESM ou CommonJS, unidade ou navegador). Uma matriz de critérios mostra o que cada uma entrega e qual escolher para o seu projeto.",
    resposta30s:
      "Para testes de unidade e de integração, os mais usados são **Jest**, **Vitest**, **Mocha** (com Chai e Sinon) e o **`node:test`**, que já vem embutido no Node.js; o AVA é uma alternativa minimalista. Para HTTP entra o **Supertest**, e para o fluxo completo no navegador, **Playwright** ou **Cypress**. Escolha pelo ecossistema, pelo suporte a ESM e TypeScript, pelos mocks embutidos e pelo modo watch, e distribua os testes numa pirâmide: muitos de unidade, alguns de integração e poucos de ponta a ponta.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As ferramentas lado a lado",
        colunas: ["Ferramenta", "O que é", "Pontos fortes", "Cuidados"],
        linhas: [
          [
            "`node:test` (veja L86)",
            "Executor de testes embutido no Node.js",
            "Zero dependências; `describe`/`it`, mocks, modo watch e cobertura nativos (confira a versão)",
            "Ecossistema e conveniências menores; alguns recursos ainda evoluem",
          ],
          [
            "Jest",
            "Framework “tudo incluído”: executor, asserções, mocks, snapshots e cobertura",
            "Muito difundido, muita documentação e exemplos, mocks fáceis",
            "ESM e TypeScript pedem configuração ou transformadores",
          ],
          [
            "Vitest",
            "Executor com API parecida com a do Jest, baseado em Vite",
            "ESM e TypeScript sem configuração extra, modo watch inteligente, migração simples a partir do Jest",
            "Mais natural em projetos que já usam Vite; o mock de módulos difere do Jest em detalhes que pedem atenção ao migrar",
          ],
          [
            "Mocha (+ Chai, Sinon)",
            "Executor minimalista; asserções (Chai) e dublês (Sinon) vêm de bibliotecas à parte",
            "Flexível e estável, bom em projetos antigos e em CommonJS",
            "Você monta o conjunto e a configuração; mais peças para manter",
          ],
          [
            "AVA",
            "Executor minimalista que roda os arquivos de teste em paralelo e isolados",
            "Isolamento forte entre arquivos, asserções embutidas, sintaxe enxuta",
            "Comunidade menor; estilo opinativo (por exemplo, sem `describe`)",
          ],
          [
            "Supertest",
            "Biblioteca para testar HTTP (não é um executor)",
            "Chama o `app` direto e verifica status, cabeçalhos e corpo (veja D38)",
            "Funciona junto de um dos executores acima; testa a API, não o navegador",
          ],
          [
            "Playwright / Cypress",
            "Ferramentas de ponta a ponta que controlam um navegador real",
            "Validam o fluxo do usuário de verdade, do clique ao banco",
            "Mais lentas e sujeitas a falhas intermitentes; reserve para os fluxos críticos",
          ],
        ],
        nota: "Comparação qualitativa: os recursos de cada ferramenta mudam a cada versão. Confira a documentação oficial antes de decidir.",
      },
      {
        tipo: "tabela",
        titulo: "A pirâmide de testes",
        colunas: ["Camada", "O que testa", "Ferramentas típicas", "Quantidade e custo"],
        linhas: [
          [
            "Unidade",
            "Função ou serviço isolado, com as dependências trocadas por dublês (veja D36)",
            "`node:test`, Jest, Vitest ou Mocha",
            "Muitos; rápidos e baratos de manter",
          ],
          [
            "Integração",
            "Vários módulos juntos: rota, serviço e um banco de teste de verdade",
            "O mesmo executor, com Supertest e um banco ou contêiner descartável",
            "Alguns; mais lentos, pegam erros de ligação entre as peças",
          ],
          [
            "Ponta a ponta",
            "O sistema inteiro, pela interface, como o usuário usa",
            "Playwright ou Cypress",
            "Poucos; lentos e caros, só para os fluxos que não podem quebrar",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pelos critérios do projeto, não pela moda. **Sem dependência extra** e testes simples: `node:test`. **ESM e TypeScript nativos**, ou projeto em Vite: Vitest. **Equipe e base de código já em Jest**: continue com ele. **Estilo próprio, montado peça a peça**: Mocha com Chai e Sinon. Para HTTP, Supertest por cima do executor escolhido; para o navegador, Playwright ou Cypress. Adote **um** executor por projeto.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A ferramenta importa menos que o desenho dos testes",
        texto:
          "Trocar de framework não conserta uma suíte lenta ou instável. O que decide a qualidade é a pirâmide (muita unidade, pouco ponta a ponta), testes independentes entre si, sem dependência de relógio, rede real ou ordem de execução, e asserções sobre comportamento observável. Cobertura alta mostra o que nenhum teste tocou, mas não prova que os testes verificam algo útil.",
      },
    ],
    armadilhas: [
      "Escolher pela popularidade sem checar se o projeto usa ESM e TypeScript: a configuração acaba custando mais que o ganho.",
      "Inverter a pirâmide, com muitos testes de ponta a ponta e poucos de unidade: a suíte fica lenta, frágil e difícil de diagnosticar.",
      "Misturar executores e bibliotecas de asserção no mesmo projeto: cada um tem a sua sintaxe de mocks e a sua configuração, e a equipe perde tempo.",
      "Escrever testes que dependem de ordem, de relógio, de rede real ou de estado compartilhado: eles passam na sua máquina e falham de vez em quando no CI.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre Supertest e Playwright?",
        resposta:
          "O Supertest chama a API HTTP direto e verifica status, cabeçalhos e corpo, sem navegador: é um teste de integração da API. O Playwright controla um navegador real e valida o fluxo do usuário pela interface: é de ponta a ponta, mais lento e mais caro.",
      },
      {
        pergunta: "Quando faz sentido preferir o `node:test` a Jest ou Vitest?",
        resposta:
          "Quando você quer zero dependências e os recursos embutidos (execução, mocks, watch, cobertura conforme a versão) bastam, como em bibliotecas e serviços pequenos. Jest ou Vitest compensam quando o ecossistema, os snapshots, o TypeScript e o ESM sem configuração fazem diferença.",
      },
    ],
  },
  en: {
    titulo: "Testing frameworks",
    pergunta: "What frameworks are available for testing Node.js applications?",
    porqueEsteMetodo:
      "Testing tools overlap, but they come from different choices (all-in-one or minimal, ESM or CommonJS, unit or browser). A criteria matrix shows what each one delivers and which to pick for your project.",
    resposta30s:
      "For unit and integration tests, the most used are **Jest**, **Vitest**, **Mocha** (with Chai and Sinon) and **`node:test`**, which ships built into Node.js; AVA is a minimalist alternative. **Supertest** covers HTTP, and **Playwright** or **Cypress** cover the full flow in a browser. Choose by ecosystem, ESM and TypeScript support, built-in mocks and watch mode, and spread the tests across a pyramid: many unit tests, some integration tests and few end-to-end tests.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The tools side by side",
        colunas: ["Tool", "What it is", "Strengths", "Watch out for"],
        linhas: [
          [
            "`node:test` (see L86)",
            "Test runner built into Node.js",
            "Zero dependencies; `describe`/`it`, mocks, watch mode and coverage built in (check the version)",
            "Smaller ecosystem and fewer conveniences; some features are still evolving",
          ],
          [
            "Jest",
            "An “all-in-one” framework: runner, assertions, mocks, snapshots and coverage",
            "Very widespread, lots of documentation and examples, easy mocks",
            "ESM and TypeScript need configuration or transformers",
          ],
          [
            "Vitest",
            "A runner with a Jest-like API, built on Vite",
            "ESM and TypeScript with no extra setup, smart watch mode, simple migration from Jest",
            "Most natural in projects already using Vite; module mocking differs from Jest in details that need care when migrating",
          ],
          [
            "Mocha (+ Chai, Sinon)",
            "A minimalist runner; assertions (Chai) and test doubles (Sinon) come from separate libraries",
            "Flexible and stable, good in older projects and in CommonJS",
            "You assemble the set and the configuration; more pieces to maintain",
          ],
          [
            "AVA",
            "A minimalist runner that runs test files in parallel and isolated",
            "Strong isolation between files, built-in assertions, lean syntax",
            "Smaller community; opinionated style (for example, no `describe`)",
          ],
          [
            "Supertest",
            "A library for testing HTTP (not a runner)",
            "Calls the `app` directly and checks status, headers and body (see D38)",
            "Works alongside one of the runners above; tests the API, not the browser",
          ],
          [
            "Playwright / Cypress",
            "End-to-end tools that drive a real browser",
            "Validate the real user flow, from the click to the database",
            "Slower and prone to flaky failures; keep them for critical flows",
          ],
        ],
        nota: "A qualitative comparison: each tool’s features change with every version. Check the official documentation before deciding.",
      },
      {
        tipo: "tabela",
        titulo: "The testing pyramid",
        colunas: ["Layer", "What it tests", "Typical tools", "Quantity and cost"],
        linhas: [
          [
            "Unit",
            "An isolated function or service, with dependencies replaced by test doubles (see D36)",
            "`node:test`, Jest, Vitest or Mocha",
            "Many; fast and cheap to maintain",
          ],
          [
            "Integration",
            "Several modules together: route, service and a real test database",
            "The same runner, with Supertest and a disposable database or container",
            "Some; slower, they catch wiring errors between the pieces",
          ],
          [
            "End to end",
            "The whole system, through the interface, as the user uses it",
            "Playwright or Cypress",
            "Few; slow and costly, only for the flows that cannot break",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by the project’s criteria, not by fashion. **No extra dependency** and simple tests: `node:test`. **Native ESM and TypeScript**, or a Vite project: Vitest. **Team and codebase already on Jest**: stay with it. **Your own style, assembled piece by piece**: Mocha with Chai and Sinon. For HTTP, Supertest on top of the chosen runner; for the browser, Playwright or Cypress. Adopt **one** runner per project.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The tool matters less than the shape of the tests",
        texto:
          "Switching frameworks does not fix a slow or unstable suite. What decides quality is the pyramid (lots of unit tests, few end-to-end ones), tests independent of one another, with no dependence on the clock, the real network or execution order, and assertions about observable behavior. High coverage shows what no test touched, but it does not prove the tests check anything useful.",
      },
    ],
    armadilhas: [
      "Choosing by popularity without checking whether the project uses ESM and TypeScript: the configuration ends up costing more than the gain.",
      "Inverting the pyramid, with many end-to-end tests and few unit tests: the suite gets slow, fragile and hard to diagnose.",
      "Mixing runners and assertion libraries in one project: each has its own mock syntax and setup, and the team loses time.",
      "Writing tests that depend on order, on the clock, on the real network or on shared state: they pass on your machine and fail now and then in CI.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between Supertest and Playwright?",
        resposta:
          "Supertest calls the HTTP API directly and checks status, headers and body, with no browser: it is an integration test of the API. Playwright drives a real browser and validates the user flow through the interface: it is end to end, slower and more costly.",
      },
      {
        pergunta: "When does it make sense to prefer `node:test` over Jest or Vitest?",
        resposta:
          "When you want zero dependencies and the built-in features (running, mocks, watch, coverage depending on the version) are enough, as in libraries and small services. Jest or Vitest pay off when the ecosystem, snapshots, TypeScript and ESM with no setup make a difference.",
      },
    ],
  },
};
