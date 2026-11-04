import type { Pergunta } from "../../tipos";

// D36 · Mocks, stubs e spies
export const d036: Pergunta = {
  numero: 336,
  modulo: "devinterview-testes-e-dados",
  metodo: "feynman",
  pt: {
    titulo: "Mocks, stubs e spies",
    pergunta: "Explique o conceito de mocking no Node.js.",
    porqueEsteMetodo:
      "Mocking é uma ideia simples que costuma ser explicada com vocabulário embaralhado (mock, stub, spy). Uma analogia fixa o propósito, a tabela separa os tipos de dublê e o limite mostra onde a técnica vira armadilha.",
    resposta30s:
      "**Mocking** é trocar, durante o teste, uma dependência real (API externa, banco, relógio, sistema de arquivos, aleatoriedade) por um **dublê controlado**, para testar só o seu código de forma rápida e determinística e para provocar falhas difíceis de reproduzir. Os dublês se dividem em **dummy, stub, spy, mock e fake**, e ferramentas como `jest.fn()`, `vi.fn()` e `mock.fn()` do `node:test` cobrem vários papéis ao mesmo tempo. O risco é mockar demais: o teste passa a verificar o dublê, não o comportamento real.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um piloto não aprende a lidar com uma pane de motor no meio de um voo de verdade. Ele treina num simulador, que reproduz o avião sem os riscos, sem o custo e, o mais importante, com a pane acontecendo na hora em que o instrutor decide. O simulador não é o avião: serve para treinar e medir o piloto, não para provar que o avião voa.",
        tecnico:
          "Um **dublê de teste** substitui uma dependência do código sob teste (cliente HTTP, banco, relógio, gerador aleatório, sistema de arquivos). Isso isola a unidade, deixa o resultado determinístico e rápido e permite provocar o que é difícil de reproduzir: um timeout, um erro `500`, o dia 31 de dezembro. No Node.js, a forma mais simples é **injetar** a dependência como parâmetro e passar um dublê no teste. Quando ela é importada direto, é preciso mockar o módulo: no CommonJS é mais fácil, porque o cache do `require` pode ser interceptado; no ESM os imports são resolvidos antes de o código rodar, então o suporte vem do executor (`vi.mock`, a configuração do Jest, os recursos do `node:test`). Para o tempo, há timers falsos (`jest.useFakeTimers`, `vi.useFakeTimers`, `mock.timers`); para HTTP, `nock` ou o MSW interceptam as requisições de saída.",
        limite:
          "O simulador não é o avião: um mock só prova que o seu código fala com o dublê **do jeito que você imaginou**. Se o contrato real mudar (a API passa a devolver outro formato), o teste continua verde e a produção quebra. Por isso mocks se complementam com testes de integração.",
      },
      {
        tipo: "tabela",
        titulo: "Os cinco tipos de dublê",
        colunas: ["Dublê", "O que faz", "Exemplo", "O que o teste verifica"],
        linhas: [
          [
            "Dummy",
            "Só preenche um parâmetro obrigatório; ninguém o usa de verdade",
            "Um `logger` vazio passado à função",
            "Nada",
          ],
          [
            "Stub",
            "Devolve respostas prontas e fixas",
            "`buscarCep()` sempre devolve o mesmo endereço",
            "O resultado do código sob teste (estado)",
          ],
          [
            "Spy",
            "Deixa a chamada acontecer (ou usa um stub) e registra como ela foi feita",
            "`jest.fn()` que guarda os argumentos e o número de chamadas",
            "Como a dependência foi chamada (interação)",
          ],
          [
            "Mock",
            "Dublê com expectativa embutida: falha se não for usado como esperado",
            "Espera `enviarEmail` uma única vez, para o destinatário certo",
            "A interação, com regras definidas de antemão",
          ],
          [
            "Fake",
            "Implementação funcional e simplificada, que de fato trabalha",
            "Repositório em memória, banco SQLite em memória, servidor SMTP de teste",
            "O estado, com um comportamento realista",
          ],
        ],
        nota: "Na prática as ferramentas misturam os nomes: um `jest.fn()` serve como stub, como spy e como mock. O que importa é saber **qual papel** o dublê cumpre no teste.",
      },
      {
        tipo: "codigo",
        titulo: "Injetar dublês e verificar a interação",
        legenda: "JavaScript",
        codigo: [
          'import { test, mock } from "node:test";',
          'import assert from "node:assert/strict";',
          'import { cobrar } from "./cobrar.js";',
          "",
          'test("cobra o cartão e envia o recibo uma única vez", async () => {',
          "  const pedido = { id: 1, valor: 100 };",
          "  const gateway = { cobrar: mock.fn(async () => ({ ok: true })) }; // stub + spy",
          "  const email = { enviar: mock.fn() }; // spy",
          "",
          "  await cobrar(pedido, { gateway, email }); // as dependências entram por parâmetro",
          "",
          "  assert.equal(gateway.cobrar.mock.callCount(), 1);",
          "  assert.deepEqual(gateway.cobrar.mock.calls[0].arguments, [pedido]);",
          "  assert.equal(email.enviar.mock.callCount(), 1);",
          "});",
        ].join("\n"),
        nota: "Em Jest e Vitest o papel é o mesmo, com `jest.fn()` / `vi.fn()` e `expect(...).toHaveBeenCalledTimes(1)`. Injetar as dependências evita mockar módulos e deixa o teste mais simples.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Mock demais, mock errado",
        texto:
          "Três vícios comuns. **Acoplar o teste à implementação**: verificar quantas vezes um método interno foi chamado quebra a cada refatoração, mesmo com o comportamento intacto; prefira verificar o resultado observável. **Testar o próprio mock**: se tudo ao redor é dublê, o teste só prova que o dublê responde. **Mockar o que você não controla** com um formato inventado: embrulhe o SDK de terceiros num adaptador seu e mocke o adaptador. E, onde o comportamento real importa (consultas SQL, restrições, transações), prefira um **fake fiel** ou um **contêiner descartável** com o banco de verdade: um repositório em memória não reproduz o SQL.",
      },
    ],
    armadilhas: [
      "Não restaurar mocks e timers falsos entre os testes (`restoreAllMocks`, `useRealTimers`): o estado vaza e o resultado passa a depender da ordem de execução.",
      "Mockar um módulo ESM sem entender que o import já foi resolvido: o mock é aplicado tarde demais e o código continua usando o módulo real.",
      "Verificar chamadas em vez de resultados: o teste quebra em refatorações que não mudaram nada para o usuário.",
      "Deixar o mock divergir da realidade: a dependência real muda de formato e os testes seguem verdes. Complemente com testes de integração ou de contrato.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre um stub e um spy?",
        resposta:
          "O stub devolve respostas prontas para o código sob teste e é usado para controlar o que ele recebe. O spy registra como foi chamado (argumentos, número de chamadas) e é usado para verificar a interação. Uma mesma função de teste pode fazer os dois papéis.",
      },
      {
        pergunta: "Quando preferir um fake ou um contêiner real a um mock?",
        resposta:
          "Quando o comportamento da dependência é parte do que você quer provar: consultas SQL, restrições de unicidade, transações. Um mock só repete o que você programou; um banco real em contêiner, ou um fake fiel, revela erros que o mock esconde.",
      },
    ],
  },
  en: {
    titulo: "Mocks, stubs and spies",
    pergunta: "Explain the concept of mocking in Node.js.",
    porqueEsteMetodo:
      "Mocking is a simple idea that usually gets explained with jumbled vocabulary (mock, stub, spy). An analogy fixes the purpose, the table separates the kinds of test double and the limit shows where the technique turns into a trap.",
    resposta30s:
      "**Mocking** means replacing, during a test, a real dependency (external API, database, clock, file system, randomness) with a **controlled test double**, so you can test only your own code quickly and deterministically and trigger failures that are hard to reproduce. Doubles come in **dummy, stub, spy, mock and fake** flavors, and tools like `jest.fn()`, `vi.fn()` and `mock.fn()` from `node:test` cover several roles at once. The risk is mocking too much: the test ends up checking the double, not the real behavior.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A pilot does not learn to handle an engine failure in the middle of a real flight. They train in a simulator, which reproduces the aircraft without the risk, without the cost and, most importantly, with the failure happening exactly when the instructor decides. The simulator is not the aircraft: it is for training and assessing the pilot, not for proving that the aircraft flies.",
        tecnico:
          "A **test double** replaces a dependency of the code under test (HTTP client, database, clock, random generator, file system). That isolates the unit, makes the result deterministic and fast, and lets you trigger what is hard to reproduce: a timeout, a `500` error, December 31st. In Node.js, the simplest way is to **inject** the dependency as a parameter and pass a double in the test. When it is imported directly, you have to mock the module: in CommonJS it is easier, because the `require` cache can be intercepted; in ESM, imports are resolved before the code runs, so support comes from the runner (`vi.mock`, Jest’s configuration, `node:test` features). For time there are fake timers (`jest.useFakeTimers`, `vi.useFakeTimers`, `mock.timers`); for HTTP, `nock` or MSW intercept outgoing requests.",
        limite:
          "The simulator is not the aircraft: a mock only proves that your code talks to the double **the way you imagined**. If the real contract changes (the API starts returning another format), the test stays green and production breaks. That is why mocks are complemented by integration tests.",
      },
      {
        tipo: "tabela",
        titulo: "The five kinds of test double",
        colunas: ["Double", "What it does", "Example", "What the test checks"],
        linhas: [
          [
            "Dummy",
            "Only fills a required parameter; nobody really uses it",
            "An empty `logger` passed to the function",
            "Nothing",
          ],
          [
            "Stub",
            "Returns canned, fixed answers",
            "`lookupZip()` always returns the same address",
            "The result of the code under test (state)",
          ],
          [
            "Spy",
            "Lets the call happen (or uses a stub) and records how it was made",
            "A `jest.fn()` that keeps the arguments and the number of calls",
            "How the dependency was called (interaction)",
          ],
          [
            "Mock",
            "A double with a built-in expectation: it fails if not used as expected",
            "Expects `sendEmail` exactly once, to the right recipient",
            "The interaction, with rules defined in advance",
          ],
          [
            "Fake",
            "A working, simplified implementation that really does the job",
            "In-memory repository, in-memory SQLite database, test SMTP server",
            "The state, with realistic behavior",
          ],
        ],
        nota: "In practice the tools blur the names: a `jest.fn()` works as a stub, a spy and a mock. What matters is knowing **which role** the double plays in the test.",
      },
      {
        tipo: "codigo",
        titulo: "Injecting doubles and checking the interaction",
        legenda: "JavaScript",
        codigo: [
          'import { test, mock } from "node:test";',
          'import assert from "node:assert/strict";',
          'import { charge } from "./charge.js";',
          "",
          'test("charges the card and sends the receipt exactly once", async () => {',
          "  const order = { id: 1, amount: 100 };",
          "  const gateway = { charge: mock.fn(async () => ({ ok: true })) }; // stub + spy",
          "  const email = { send: mock.fn() }; // spy",
          "",
          "  await charge(order, { gateway, email }); // dependencies come in as parameters",
          "",
          "  assert.equal(gateway.charge.mock.callCount(), 1);",
          "  assert.deepEqual(gateway.charge.mock.calls[0].arguments, [order]);",
          "  assert.equal(email.send.mock.callCount(), 1);",
          "});",
        ].join("\n"),
        nota: "In Jest and Vitest the role is the same, with `jest.fn()` / `vi.fn()` and `expect(...).toHaveBeenCalledTimes(1)`. Injecting the dependencies avoids mocking modules and keeps the test simpler.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Too many mocks, wrong mocks",
        texto:
          "Three common vices. **Coupling the test to the implementation**: checking how many times an internal method was called breaks on every refactor, even with the behavior intact; prefer checking the observable result. **Testing the mock itself**: if everything around is a double, the test only proves the double answers. **Mocking what you do not control** with an invented format: wrap the third-party SDK in an adapter of your own and mock the adapter. And where real behavior matters (SQL queries, constraints, transactions), prefer a **faithful fake** or a **disposable container** with the real database: an in-memory repository does not reproduce SQL.",
      },
    ],
    armadilhas: [
      "Not restoring mocks and fake timers between tests (`restoreAllMocks`, `useRealTimers`): state leaks and the result starts depending on execution order.",
      "Mocking an ESM module without realizing the import was already resolved: the mock is applied too late and the code keeps using the real module.",
      "Checking calls instead of results: the test breaks on refactors that changed nothing for the user.",
      "Letting the mock drift from reality: the real dependency changes format and the tests stay green. Complement with integration or contract tests.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a stub and a spy?",
        resposta:
          "A stub returns canned answers to the code under test and is used to control what it receives. A spy records how it was called (arguments, number of calls) and is used to check the interaction. The same test function can play both roles.",
      },
      {
        pergunta: "When should you prefer a fake or a real container over a mock?",
        resposta:
          "When the dependency’s behavior is part of what you want to prove: SQL queries, uniqueness constraints, transactions. A mock only repeats what you programmed; a real database in a container, or a faithful fake, reveals errors the mock hides.",
      },
    ],
  },
};
