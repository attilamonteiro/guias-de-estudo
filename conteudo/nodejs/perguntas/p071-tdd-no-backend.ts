import type { Pergunta } from "../../tipos";

// P71 · TDD no backend
export const p071: Pergunta = {
  numero: 771,
  modulo: "pawanmkr-testes",
  metodo: "whys",
  pt: {
    titulo: "TDD no backend",
    pergunta: "Qual é o papel do desenvolvimento orientado a testes (TDD) em sistemas de backend?",
    porqueEsteMetodo:
      "O valor do TDD não está em ter testes, e sim no que escrever o teste antes causa no código. Uma cadeia de “por quês” liga o gesto (teste primeiro) ao resultado (menos regressão, feedback rápido) e mostra onde a cadeia perde força.",
    resposta30s:
      "**TDD** é escrever o teste **antes** do código, em ciclos curtos de **vermelho** (o teste falha), **verde** (o mínimo para passar) e **refatorar**. No backend, o papel dele é **guiar o design**: o teste fixa o contrato, empurra a regra de negócio para funções pequenas e separadas da E/S e dá uma rede de proteção para refatorar sem medo. Rende mais em **regras de negócio e funções puras**; em banco, filas e HTTP, complemente com **testes de integração**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que escrever o teste antes do código?",
            resposta:
              "Porque o teste é o primeiro usuário do código: para escrevê-lo, você precisa decidir antes o **contrato** (o que entra, o que sai, quais erros) e o **comportamento** esperado, em vez de descobri-los no meio da implementação. Ver o teste falhar também prova que ele é capaz de falhar; um teste escrito depois, nunca visto em vermelho, pode passar por qualquer motivo.",
          },
          {
            pergunta: "Por que isso deixa o código mais simples e menos acoplado?",
            resposta:
              "Porque código difícil de testar costuma ser código acoplado: a função que abre a própria conexão com o banco, lê o relógio e chama uma API externa não se testa sem montar o mundo inteiro. Escrevendo o teste primeiro, você sente essa dor antes de escrever o código e separa a **regra** (função pura: recebe dados, devolve uma resposta) da **E/S** (repositório, cliente HTTP), injetando o que vem de fora. No Node.js, isso vira módulos pequenos, com a regra de um lado e as bordas do outro.",
          },
          {
            pergunta: "Por que isso permite refatorar com segurança?",
            resposta:
              "Porque cada comportamento já tem um teste que o descreve. Depois do verde, você reestrutura o código por dentro e roda a suíte: se continua verde, o comportamento foi preservado. Sem essa rede, refatorar é arriscado e a tendência é não refatorar, até o código apodrecer.",
          },
          {
            pergunta: "Por que isso reduz regressões e acelera o feedback?",
            resposta:
              "Porque cada requisito vira um teste que fica na suíte e roda a cada mudança (inclusive na integração contínua). O bug que volta é pego em segundos, perto de onde foi introduzido, e não semanas depois em produção. Testes de unidade rodam sem subir servidor nem banco, e é essa rapidez que torna o ciclo viável.",
          },
          {
            pergunta: "Por que o TDD rende menos em algumas partes do backend?",
            resposta:
              "Porque o ciclo depende de testes rápidos e determinísticos. Em regras de negócio e funções puras isso é natural. Em acesso a banco, filas, HTTP e infraestrutura, o comportamento real mora na integração (a consulta SQL, a transação, a serialização): um teste de unidade com dublês só confirma o que você já supôs. Ali os testes usam um banco de verdade, em contêiner, são menos numerosos e o ritmo é mais lento.",
          },
        ],
        causaRaiz:
          "O TDD transforma o contrato em algo **executável antes do código** e, por isso, empurra o design para peças pequenas, desacopladas e verificáveis em segundos. O ganho vem do **contrato explícito e do feedback rápido**, não do número de testes, e vale onde esse feedback é barato.",
      },
      {
        tipo: "fluxo",
        titulo: "O ciclo, em uma funcionalidade pequena",
        etapas: [
          "Escolha o menor comportamento novo (por exemplo, “cupom vencido é recusado”)",
          "Vermelho: escreva o teste, rode e confirme que ele falha pelo motivo certo",
          "Verde: escreva o mínimo de código para o teste passar, mesmo que feio",
          "Refatorar: limpe nomes, duplicação e estrutura com a suíte inteira verde como rede de proteção",
          "Repita com o próximo comportamento, em passos de poucos minutos",
        ],
        nota: "Ciclos longos são sinal de passo grande demais: divida o comportamento em partes menores.",
      },
      {
        tipo: "codigo",
        titulo: "O teste nasce antes da função",
        legenda: "JavaScript",
        codigo: `import { test } from "node:test";
import assert from "node:assert/strict";
import { aplicarCupom } from "./cupom.js"; // ainda não existe: o teste nasce vermelho

test("cupom de 10% reduz o total", () => {
  assert.equal(aplicarCupom({ totalCentavos: 20000 }, { percentual: 10 }), 18000);
});

test("cupom vencido é recusado", () => {
  const cupom = { percentual: 10, venceEm: new Date("2020-01-01") };
  const agora = new Date("2024-06-01"); // o relógio entra como parâmetro
  assert.throws(() => aplicarCupom({ totalCentavos: 20000 }, cupom, agora), /vencido/);
});`,
        nota: "Rode com `node --test` (veja L86). Escreva só o necessário para o primeiro teste passar, depois o segundo. A regra fica numa função pura, e o relógio entra por parâmetro para o teste não depender da data de hoje.",
      },
      {
        tipo: "tabela",
        titulo: "Onde o TDD rende e onde custa mais",
        colunas: ["Parte do backend", "Rendimento do TDD", "Como testar"],
        linhas: [
          [
            "Regras de negócio e funções puras (preço, permissões, máquinas de estado)",
            "Alto: testes rápidos, sem dublês",
            "Teste de unidade, tabela de casos e valores limites",
          ],
          [
            "Validação e transformação de dados (esquemas, parse, mapeamento)",
            "Alto",
            "Casos válidos, inválidos e de borda escritos primeiro",
          ],
          [
            "Camada HTTP (rotas, middlewares)",
            "Médio",
            "Teste de integração leve: o `app` sem abrir porta e poucos casos por rota (veja D38)",
          ],
          [
            "Banco, filas e APIs externas",
            "Menor: o dublê esconde o que importa (SQL, transação, contrato real)",
            "Teste de integração com banco real em contêiner; dublês só nas bordas, com testes de contrato",
          ],
          [
            "Infraestrutura e configuração (Docker, rede, deploy)",
            "Baixo",
            "Verificação de fumaça (smoke test) no pipeline",
          ],
        ],
        nota: "A pirâmide de testes resume a proporção: muitos de unidade, alguns de integração e poucos de ponta a ponta (veja D35).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "TDD não é o mesmo que ter testes automatizados",
        texto:
          "Dá para ter uma suíte excelente sem TDD (testes escritos depois) e dá para fazer TDD mal (testes acoplados à implementação). TDD é uma prática de **design e de ritmo**; os testes automatizados são o resultado. Em código exploratório, como um experimento para entender uma API, vale experimentar primeiro e escrever os testes depois.",
      },
    ],
    armadilhas: [
      "Testar a implementação (quais funções internas foram chamadas, em que ordem) em vez do comportamento: qualquer refatoração quebra os testes e ninguém mais refatora.",
      "Mockar tudo: o teste passa com dublês, mas a consulta SQL real, a transação ou o contrato da API externa falham em produção. Faça dublê das bordas, não da lógica.",
      "Perseguir cobertura como meta: linha executada não é comportamento verificado, e um teste sem asserção cobre código sem proteger nada.",
      "Pular o vermelho ou escrever muitos testes de uma vez; testes que dependem de relógio, ordem de execução, rede ou banco compartilhado ficam instáveis e perdem a confiança da equipe.",
    ],
    autoteste: [
      {
        pergunta: "TDD e “ter testes automatizados” são a mesma coisa?",
        resposta:
          "Não. TDD é a prática de escrever o teste antes, em ciclos curtos, como ferramenta de design; ter testes automatizados é o resultado, que também pode vir de testes escritos depois. Dá para ter bons testes sem TDD e fazer TDD com testes ruins.",
      },
      {
        pergunta: "Por que o passo vermelho importa?",
        resposta:
          "Porque prova que o teste consegue falhar, e pelo motivo certo. Um teste que nunca foi visto em vermelho pode passar sem verificar nada e dar uma falsa sensação de segurança.",
      },
    ],
  },
  en: {
    titulo: "TDD in the backend",
    pergunta: "What is the role of Test-Driven Development (TDD) in backend systems?",
    porqueEsteMetodo:
      "The value of TDD is not in having tests, but in what writing the test first does to the code. A chain of “whys” links the gesture (test first) to the result (fewer regressions, fast feedback) and shows where the chain loses strength.",
    resposta30s:
      "**TDD** means writing the test **before** the code, in short cycles of **red** (the test fails), **green** (the minimum to pass) and **refactor**. In the backend its role is to **guide the design**: the test fixes the contract, pushes business rules into small functions separate from I/O and gives you a safety net to refactor without fear. It pays off most in **business rules and pure functions**; for databases, queues and HTTP, complement it with **integration tests**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why write the test before the code?",
            resposta:
              "Because the test is the first user of the code: to write it, you must first decide the **contract** (what goes in, what comes out, which errors) and the expected **behavior**, instead of discovering them in the middle of the implementation. Watching the test fail also proves it is capable of failing; a test written afterwards and never seen red may pass for any reason.",
          },
          {
            pergunta: "Why does that make the code simpler and less coupled?",
            resposta:
              "Because code that is hard to test is usually coupled code: the function that opens its own database connection, reads the clock and calls an external API cannot be tested without building the whole world. By writing the test first, you feel that pain before writing the code and separate the **rule** (a pure function: takes data, returns an answer) from the **I/O** (repository, HTTP client), injecting what comes from outside. In Node.js that becomes small modules, with the rule on one side and the edges on the other.",
          },
          {
            pergunta: "Why does that allow safe refactoring?",
            resposta:
              "Because every behavior already has a test that describes it. After green, you restructure the code from the inside and run the suite: if it stays green, the behavior was preserved. Without that net, refactoring is risky and the tendency is to skip it, until the code rots.",
          },
          {
            pergunta: "Why does that reduce regressions and speed up feedback?",
            resposta:
              "Because each requirement becomes a test that stays in the suite and runs on every change (including in continuous integration). A bug that comes back is caught in seconds, close to where it was introduced, not weeks later in production. Unit tests run without starting a server or a database, and that speed is what makes the cycle viable.",
          },
          {
            pergunta: "Why does TDD pay off less in some parts of the backend?",
            resposta:
              "Because the cycle depends on fast, deterministic tests. In business rules and pure functions that comes naturally. In database access, queues, HTTP and infrastructure, the real behavior lives in the integration (the SQL query, the transaction, the serialization): a unit test with test doubles only confirms what you already assumed. There, tests use a real database, in a container, are fewer in number and the rhythm is slower.",
          },
        ],
        causaRaiz:
          "TDD turns the contract into something **executable before the code** and, because of that, pushes the design toward small, decoupled pieces that can be verified in seconds. The gain comes from the **explicit contract and fast feedback**, not from the number of tests, and it holds where that feedback is cheap.",
      },
      {
        tipo: "fluxo",
        titulo: "The cycle, on one small feature",
        etapas: [
          "Pick the smallest new behavior (for example, “an expired coupon is rejected”)",
          "Red: write the test, run it and confirm it fails for the right reason",
          "Green: write the minimum code to make the test pass, even if ugly",
          "Refactor: clean up names, duplication and structure with the whole suite green as a safety net",
          "Repeat with the next behavior, in steps of a few minutes",
        ],
        nota: "Long cycles are a sign of a step that is too big: split the behavior into smaller parts.",
      },
      {
        tipo: "codigo",
        titulo: "The test is born before the function",
        legenda: "JavaScript",
        codigo: `import { test } from "node:test";
import assert from "node:assert/strict";
import { applyCoupon } from "./coupon.js"; // does not exist yet: the test is born red

test("a 10% coupon reduces the total", () => {
  assert.equal(applyCoupon({ totalCents: 20000 }, { percent: 10 }), 18000);
});

test("an expired coupon is rejected", () => {
  const coupon = { percent: 10, expiresAt: new Date("2020-01-01") };
  const now = new Date("2024-06-01"); // the clock comes in as a parameter
  assert.throws(() => applyCoupon({ totalCents: 20000 }, coupon, now), /expired/);
});`,
        nota: "Run it with `node --test` (see L86). Write only what the first test needs to pass, then the second. The rule lives in a pure function, and the clock comes in as a parameter so the test does not depend on today’s date.",
      },
      {
        tipo: "tabela",
        titulo: "Where TDD pays off and where it costs more",
        colunas: ["Part of the backend", "TDD payoff", "How to test"],
        linhas: [
          [
            "Business rules and pure functions (pricing, permissions, state machines)",
            "High: fast tests, no test doubles",
            "Unit tests, a table of cases and boundary values",
          ],
          [
            "Data validation and transformation (schemas, parsing, mapping)",
            "High",
            "Valid, invalid and edge cases written first",
          ],
          [
            "HTTP layer (routes, middleware)",
            "Medium",
            "Light integration test: the `app` without opening a port and a few cases per route (see D38)",
          ],
          [
            "Database, queues and external APIs",
            "Lower: the test double hides what matters (SQL, transaction, real contract)",
            "Integration test with a real database in a container; doubles only at the edges, with contract tests",
          ],
          ["Infrastructure and configuration (Docker, network, deploy)", "Low", "A smoke test in the pipeline"],
        ],
        nota: "The test pyramid summarizes the proportion: many unit tests, some integration tests and few end-to-end tests (see D35).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "TDD is not the same as having automated tests",
        texto:
          "You can have an excellent suite without TDD (tests written afterwards) and you can do TDD badly (tests coupled to the implementation). TDD is a practice of **design and rhythm**; automated tests are the result. In exploratory code, such as an experiment to understand an API, it is fine to experiment first and write the tests afterwards.",
      },
    ],
    armadilhas: [
      "Testing the implementation (which internal functions were called, in what order) instead of the behavior: every refactoring breaks the tests and nobody refactors anymore.",
      "Mocking everything: the test passes with doubles, but the real SQL query, the transaction or the external API contract fails in production. Double the edges, not the logic.",
      "Chasing coverage as a goal: an executed line is not verified behavior, and a test without an assertion covers code without protecting anything.",
      "Skipping red or writing many tests at once; tests that depend on the clock, execution order, the network or a shared database become flaky and lose the team’s trust.",
    ],
    autoteste: [
      {
        pergunta: "Are TDD and “having automated tests” the same thing?",
        resposta:
          "No. TDD is the practice of writing the test first, in short cycles, as a design tool; having automated tests is the result, which can also come from tests written afterwards. You can have good tests without TDD and do TDD with bad tests.",
      },
      {
        pergunta: "Why does the red step matter?",
        resposta:
          "Because it proves the test can fail, and for the right reason. A test that was never seen red may pass without checking anything and give a false sense of safety.",
      },
    ],
  },
};
