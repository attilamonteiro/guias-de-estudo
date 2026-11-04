import type { Pergunta } from "../../tipos";

// L86 · Test runner nativo
export const l086: Pergunta = {
  numero: 186,
  modulo: "linkedin-moderno",
  metodo: "playbook",
  pt: {
    titulo: "Test runner nativo",
    pergunta: "O que é o test runner nativo do Node.js?",
    porqueEsteMetodo:
      "Escrever e rodar testes é um procedimento com começo, meio e fim, e a pergunta seguinte (“como você escreve testes com ele?”) pede exatamente isso. O playbook mostra o caminho completo e os critérios para decidir se ele basta ou se vale usar Jest ou Vitest.",
    resposta30s:
      "É o executor de testes **embutido** no Node.js, no módulo **`node:test`**, sem instalar nada: você escreve `test`, `describe` e `it`, usa `node:assert` para as asserções e roda com **`node --test`**. Ele traz subtestes, hooks, mocks, modo watch, relatórios e (conforme a versão) cobertura. É ótimo para bibliotecas e serviços simples; Jest e Vitest oferecem mais recursos de ecossistema.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do primeiro teste ao CI",
        passos: [
          {
            titulo: "Escreva o teste",
            texto:
              "Importe `test` (ou `describe` e `it`) de `node:test` e as asserções de `node:assert/strict`. Cada `it` é um caso; função `async` funciona direto, e `assert.rejects` confere promises rejeitadas.",
          },
          {
            titulo: "Rode",
            texto:
              "`node --test` procura arquivos de teste por convenção de nome (como `*.test.js`) e pastas `test`; você também pode passar caminhos. Sinal de acerto: um relatório com os testes aprovados e saída diferente de zero quando algum falha, que é o que o CI usa. Confira as regras exatas de descoberta de arquivos na documentação.",
          },
          {
            titulo: "Organize",
            texto:
              "`describe` agrupa, `before`/`after`/`beforeEach`/`afterEach` preparam e limpam, `t.test` cria subtestes, e `skip`, `todo` e `only` (com `--test-only`) controlam o que roda.",
          },
          {
            titulo: "Isole dependências com mocks",
            texto:
              "`mock.fn()` cria uma função espiã, `mock.method(objeto, 'nome')` troca um método e `mock.timers` controla o relógio (conforme a versão). Mock de módulo inteiro é mais recente: confira o estado na documentação. Restaure os mocks com `mock.restoreAll()` ou use `t.mock`, que limpa sozinho ao fim do teste.",
          },
          {
            titulo: "Acompanhe enquanto desenvolve",
            texto:
              "`node --test --watch` reexecuta os testes ao salvar. Escolha o relatório com `--test-reporter`, por exemplo um formato legível no terminal ou um que o CI entenda (a lista de formatos depende da versão).",
          },
          {
            titulo: "Meça a cobertura e ligue ao CI",
            texto:
              "Há uma flag de cobertura (historicamente com `experimental` no nome; confira a da sua versão). No CI, rode `node --test` e leve a saída de falha e a cobertura para o sistema que você usa. Critério: o build quebra quando um teste falha.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um arquivo de teste",
        legenda: "cobrar.test.js",
        codigo: [
          "// rode com: node --test",
          'import { describe, it, mock } from "node:test";',
          'import assert from "node:assert/strict";',
          'import { cobrar } from "./cobrar.js"; // cobrar(valor, gateway) é async e soma uma taxa fixa de 10',
          "",
          'describe("cobrar", () => {',
          '  it("envia o valor mais a taxa ao gateway", async () => {',
          "    const gateway = mock.fn(async () => ({ ok: true }));",
          "    await cobrar(100, gateway);",
          "    assert.equal(gateway.mock.callCount(), 1);",
          "    assert.deepEqual(gateway.mock.calls[0].arguments, [110]);",
          "  });",
          "",
          '  it("rejeita valor negativo", async () => {',
          "    await assert.rejects(cobrar(-1, mock.fn()), { message: /negativo/ });",
          "  });",
          "});",
        ].join("\n"),
        nota: "Em CommonJS, a importação é `require('node:test')`. Para TypeScript é preciso uma etapa de transpilação ou um recurso do Node.js que depende da versão; confira a documentação.",
      },
      {
        tipo: "tabela",
        titulo: "node:test, Jest e Vitest",
        colunas: ["Aspecto", "`node:test`", "Jest", "Vitest"],
        linhas: [
          ["Instalação", "Nenhuma (embutido)", "Pacote do npm", "Pacote do npm"],
          [
            "Asserções",
            "`node:assert` (sem o estilo `expect` encadeado)",
            "`expect` rico, com muitos matchers",
            "`expect` compatível com o do Jest",
          ],
          [
            "Mocks",
            "`mock.fn`, `mock.method`, timers; módulos conforme a versão",
            "Mocks completos, inclusive de módulos",
            "Mocks completos, inclusive de módulos",
          ],
          [
            "Snapshots e DOM",
            "Snapshots conforme a versão; sem ambiente de DOM pronto",
            "Disponíveis por configuração",
            "Disponíveis por configuração",
          ],
          [
            "TypeScript e JSX",
            "Exige etapa extra ou suporte da versão",
            "Via configuração (transformadores)",
            "Suporte direto, na linha de ferramentas do Vite",
          ],
          [
            "Quando escolher",
            "Bibliotecas, CLIs e serviços sem dependências extras",
            "Projetos que já usam Jest",
            "Projetos com Vite ou que querem compatibilidade com Jest e TypeScript fácil",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Se o projeto tem **poucas exigências de ecossistema** (biblioteca, CLI, serviço em JavaScript puro), comece com `node:test`: nenhuma dependência e o mesmo comportamento na máquina e no CI. Se precisa de snapshots amplos, DOM, mocks avançados de módulo ou TypeScript sem atrito, Vitest ou Jest valem a dependência. Não troque uma suíte que funciona só pela troca.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Confira a versão",
        texto:
          "O `node:test` evoluiu bastante entre versões: nomes de flags (cobertura, reporters), mocks de módulo e snapshots mudaram ou podem estar marcados como experimentais. Antes de depender de um recurso, confira a documentação de `node:test` em nodejs.org para a versão que você usa e leia o aviso de estabilidade.",
      },
    ],
    armadilhas: [
      "Esquecer o `await` num teste `async` (ou não retornar a promise): o teste termina antes da asserção e passa falsamente.",
      "Compartilhar estado entre testes (banco, arquivos temporários, portas): arquivos de teste rodam em processos separados e em paralelo, e o resultado passa a depender da ordem.",
      "Deixar mocks ativos de um teste para o outro: restaure com `mock.restoreAll()` ou use `t.mock`.",
      "Usar um recurso novo (cobertura, mock de módulo, snapshot) sem checar o estado na documentação da sua versão: o nome ou o comportamento pode mudar.",
    ],
    autoteste: [
      {
        pergunta: "Que comando executa os testes e como o CI sabe que algum falhou?",
        resposta:
          "`node --test`; ao fim ele sai com código diferente de zero se algum teste falhar, e o CI trata isso como falha do build.",
      },
      {
        pergunta: "Como trocar uma dependência por uma função falsa e verificar quantas vezes foi chamada?",
        resposta:
          "Com `mock.fn()` do `node:test`: passe a função falsa à unidade sob teste e confira `fn.mock.callCount()` e `fn.mock.calls`.",
      },
    ],
  },
  en: {
    titulo: "Built-in test runner",
    pergunta: "What is the Node.js built-in test runner?",
    porqueEsteMetodo:
      "Writing and running tests is a procedure with a beginning, middle and end, and the follow-up question (“how do you write tests with it?”) asks for exactly that. The playbook shows the complete path and the criteria for deciding whether it is enough or whether Jest or Vitest is worth it.",
    resposta30s:
      "It is the test runner **built into** Node.js, in the **`node:test`** module, with nothing to install: you write `test`, `describe` and `it`, use `node:assert` for assertions and run with **`node --test`**. It brings subtests, hooks, mocks, watch mode, reporters and (depending on the version) coverage. Great for libraries and simple services; Jest and Vitest offer more ecosystem features.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from the first test to CI",
        passos: [
          {
            titulo: "Write the test",
            texto:
              "Import `test` (or `describe` and `it`) from `node:test` and the assertions from `node:assert/strict`. Each `it` is a case; an `async` function works directly, and `assert.rejects` checks rejected promises.",
          },
          {
            titulo: "Run it",
            texto:
              "`node --test` looks for test files by naming convention (such as `*.test.js`) and `test` folders; you can also pass paths. A sign of success: a report with the passing tests and a non-zero exit when one fails, which is what CI uses. Check the exact file-discovery rules in the documentation.",
          },
          {
            titulo: "Organize",
            texto:
              "`describe` groups, `before`/`after`/`beforeEach`/`afterEach` set up and clean up, `t.test` creates subtests, and `skip`, `todo` and `only` (with `--test-only`) control what runs.",
          },
          {
            titulo: "Isolate dependencies with mocks",
            texto:
              "`mock.fn()` creates a spy function, `mock.method(object, 'name')` replaces a method and `mock.timers` controls the clock (depending on the version). Whole-module mocking is more recent: check its status in the documentation. Restore mocks with `mock.restoreAll()` or use `t.mock`, which cleans up by itself at the end of the test.",
          },
          {
            titulo: "Follow along while developing",
            texto:
              "`node --test --watch` reruns the tests on save. Pick the reporter with `--test-reporter`, for example a format readable in the terminal or one your CI understands (the list of formats depends on the version).",
          },
          {
            titulo: "Measure coverage and wire it into CI",
            texto:
              "There is a coverage flag (historically with `experimental` in its name; check the one for your version). In CI, run `node --test` and send the failure output and coverage to the system you use. Criterion: the build breaks when a test fails.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A test file",
        legenda: "charge.test.js",
        codigo: [
          "// run with: node --test",
          'import { describe, it, mock } from "node:test";',
          'import assert from "node:assert/strict";',
          'import { charge } from "./charge.js"; // charge(amount, gateway) is async and adds a flat fee of 10',
          "",
          'describe("charge", () => {',
          '  it("sends the amount plus the fee to the gateway", async () => {',
          "    const gateway = mock.fn(async () => ({ ok: true }));",
          "    await charge(100, gateway);",
          "    assert.equal(gateway.mock.callCount(), 1);",
          "    assert.deepEqual(gateway.mock.calls[0].arguments, [110]);",
          "  });",
          "",
          '  it("rejects a negative amount", async () => {',
          "    await assert.rejects(charge(-1, mock.fn()), { message: /negative/ });",
          "  });",
          "});",
        ].join("\n"),
        nota: "In CommonJS the import is `require('node:test')`. TypeScript needs a transpilation step or a Node.js feature that depends on the version; check the documentation.",
      },
      {
        tipo: "tabela",
        titulo: "node:test, Jest and Vitest",
        colunas: ["Aspect", "`node:test`", "Jest", "Vitest"],
        linhas: [
          ["Installation", "None (built in)", "An npm package", "An npm package"],
          [
            "Assertions",
            "`node:assert` (without the chained `expect` style)",
            "Rich `expect`, with many matchers",
            "`expect` compatible with Jest’s",
          ],
          [
            "Mocks",
            "`mock.fn`, `mock.method`, timers; modules depending on the version",
            "Full mocks, including modules",
            "Full mocks, including modules",
          ],
          [
            "Snapshots and DOM",
            "Snapshots depending on the version; no ready-made DOM environment",
            "Available through configuration",
            "Available through configuration",
          ],
          [
            "TypeScript and JSX",
            "Needs an extra step or version support",
            "Via configuration (transformers)",
            "Direct support, on the Vite toolchain",
          ],
          [
            "When to choose it",
            "Libraries, CLIs and services with no extra dependencies",
            "Projects already using Jest",
            "Vite projects, or those wanting Jest compatibility and easy TypeScript",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "If the project has **few ecosystem needs** (a library, a CLI, a plain JavaScript service), start with `node:test`: no dependency and the same behavior on your machine and in CI. If you need broad snapshots, a DOM, advanced module mocks or frictionless TypeScript, Vitest or Jest are worth the dependency. Do not replace a working suite just for the sake of switching.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Check the version",
        texto:
          "`node:test` has evolved a lot between versions: flag names (coverage, reporters), module mocks and snapshots have changed or may be marked experimental. Before depending on a feature, check the `node:test` documentation on nodejs.org for the version you use and read its stability notice.",
      },
    ],
    armadilhas: [
      "Forgetting `await` in an `async` test (or not returning the promise): the test ends before the assertion and falsely passes.",
      "Sharing state between tests (database, temp files, ports): test files run in separate processes and in parallel, and the outcome starts to depend on ordering.",
      "Leaving mocks active from one test to the next: restore with `mock.restoreAll()` or use `t.mock`.",
      "Using a new feature (coverage, module mocks, snapshots) without checking its status in your version’s documentation: the name or behavior may change.",
    ],
    autoteste: [
      {
        pergunta: "Which command runs the tests, and how does CI know one failed?",
        resposta:
          "`node --test`; at the end it exits with a non-zero code if any test fails, and CI treats that as a build failure.",
      },
      {
        pergunta: "How do you replace a dependency with a fake function and check how many times it was called?",
        resposta:
          "With `mock.fn()` from `node:test`: pass the fake to the unit under test and check `fn.mock.callCount()` and `fn.mock.calls`.",
      },
    ],
  },
};
