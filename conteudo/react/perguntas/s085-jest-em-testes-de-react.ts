import type { Pergunta } from "../../tipos";

// S85 · Jest em testes de React
export const s085: Pergunta = {
  numero: 685,
  modulo: "simplilearn-next-testes-ts",
  metodo: "playbook",
  pt: {
    titulo: "Jest em testes de React",
    pergunta: "O que é o Jest e como ele é usado em testes de React?",
    porqueEsteMetodo:
      "Configurar o Jest e escrever os primeiros testes de React é um procedimento com passos e com sinais claros de que cada um funcionou (ou do que falta). Um roteiro evita os erros clássicos de ambiente e de estilo de teste.",
    resposta30s:
      "O **Jest** é um **executor de testes** de JavaScript: encontra os arquivos de teste, roda cada caso e oferece **asserções** (`expect`), **mocks** (funções, módulos, timers) e **relatório de cobertura**. Em React ele costuma vir com a **Testing Library**: o Jest executa e verifica; a Testing Library renderiza o componente num DOM simulado (**jsdom**) e simula o que o usuário faz. Cada teste segue três tempos, **preparar, agir e verificar**, e confere o que o usuário vê, não detalhes de implementação.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Do zero ao primeiro teste que passa",
        passos: [
          {
            titulo: "1. Instalar e configurar o ambiente",
            texto:
              "Instale `jest`, o ambiente `jest-environment-jsdom` (nas versões atuais é um pacote separado), `@testing-library/react`, `@testing-library/user-event` e `@testing-library/jest-dom`. Em `testEnvironment` use `jsdom`, e aponte `setupFilesAfterEnv` para um arquivo que importa o `jest-dom`. **Sinal de erro:** `document is not defined` significa que o ambiente jsdom não está ligado.",
          },
          {
            titulo: "2. Transformar JSX e TypeScript",
            texto:
              "O Jest só entende JavaScript puro: use `babel-jest` com os presets de React e de TypeScript (ou `ts-jest`, ou um transformador baseado em SWC). CSS e imagens ganham um stub em `moduleNameMapper`. **Sinal de erro:** `Unexpected token '<'` quer dizer JSX sem transformação.",
          },
          {
            titulo: "3. Escrever o teste em três tempos",
            texto:
              "Dentro de `describe` e `it`: **preparar** (props, mocks, `render`), **agir** (um clique, uma digitação) e **verificar** (`expect`). Um comportamento por teste, com um nome que diz o que o usuário vê. **Sinal de bom teste:** ele falha quando o comportamento quebra e continua passando quando você só refatora.",
          },
          {
            titulo: "4. Renderizar e simular eventos",
            texto:
              "`render` monta o componente e `screen` consulta pelo que o usuário percebe: papel, rótulo, texto (`getByRole`, `getByLabelText`). Para eventos use `userEvent.setup()` e `await user.click(...)`, que imita melhor o usuário que `fireEvent`. **Sinal:** quando uma consulta falha, a Testing Library imprime o DOM encontrado e ajuda a corrigir a busca.",
          },
          {
            titulo: "5. Mocks e timers",
            texto:
              '`jest.fn()` para callbacks (`toHaveBeenCalledWith`), `jest.mock("./api")` para trocar um módulo, `jest.spyOn` para espiar, e `fetch` ou uma camada de interceptação de rede para as chamadas HTTP. Com `restoreMocks` ou `clearMocks` ligados na configuração, um teste não herda o outro. Para `setTimeout` e debounce, `jest.useFakeTimers()` e `jest.advanceTimersByTime()`. **Sinal de problema:** o teste passa sozinho e falha na suíte.',
          },
          {
            titulo: "6. Código assíncrono",
            texto:
              "Espere o resultado aparecer com `await screen.findByText(...)` ou `waitFor`, nunca com pausas fixas. **Sinal de problema:** o aviso `not wrapped in act(...)` indica uma atualização de estado que o teste não esperou.",
          },
          {
            titulo: "7. Snapshots e cobertura",
            texto:
              "`toMatchSnapshot` só para saídas pequenas e estáveis. `jest --coverage` mostra as linhas que nenhum teste executou: use para achar buracos, não como meta de nota. **Sinal de problema:** snapshot atualizado por reflexo (`-u`) sem ler o que mudou.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Configuração mínima",
        legenda: "jest.config.js",
        codigo: [
          "module.exports = {",
          '  testEnvironment: "jsdom", // simula o navegador',
          '  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // ex.: import "@testing-library/jest-dom";',
          '  moduleNameMapper: { "[.](css|svg|png)$": "<rootDir>/test/arquivo-vazio.js" }, // estilos e imagens não rodam no Jest',
          "  restoreMocks: true, // um teste não herda os mocks do outro",
          "};",
        ].join("\n"),
        nota: "Os presets de transformação (JSX e TypeScript) ficam na configuração do Babel ou do transformador que você escolher: veja a documentação do Jest.",
      },
      {
        tipo: "codigo",
        titulo: "Um teste completo: preparar, agir, verificar",
        legenda: "TSX",
        codigo: [
          'import { render, screen } from "@testing-library/react";',
          'import userEvent from "@testing-library/user-event";',
          'import { ListaDeUsuarios } from "./ListaDeUsuarios";',
          'import { buscarUsuarios } from "./api";',
          "",
          'jest.mock("./api"); // troca o módulo inteiro por mocks',
          "",
          'it("mostra os usuários depois de clicar em Carregar", async () => {',
          "  // preparar",
          '  jest.mocked(buscarUsuarios).mockResolvedValue([{ id: 1, nome: "Ana" }]);',
          "  const user = userEvent.setup();",
          "  render(<ListaDeUsuarios />);",
          "",
          "  // agir",
          '  await user.click(screen.getByRole("button", { name: /carregar/i }));',
          "",
          "  // verificar: findBy espera o texto aparecer",
          '  expect(await screen.findByText("Ana")).toBeInTheDocument();',
          "});",
        ].join("\n"),
        nota: "Nenhuma rede é usada: o módulo `api` é substituído. O teste só olha para o que o usuário vê na tela.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Jest e Testing Library: quem faz o quê",
        texto:
          "O **Jest** encontra e executa os testes, fornece `expect`, mocks, timers e cobertura. A **Testing Library** renderiza o componente e oferece consultas e interações do ponto de vista do usuário. Teste o que a pessoa vê e faz, não o estado interno. Existem executores com API parecida, como o Vitest; confira a documentação atual das ferramentas. Para o panorama de testes em React, veja S86, S87 e C30.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cobertura não é qualidade",
        texto:
          "Cobertura de 100% só diz que as linhas foram **executadas**, não que alguém **verificou** o resultado. Um teste que renderiza e não faz nenhuma asserção infla a cobertura sem proteger nada. Use o relatório para descobrir o que ninguém testou e priorize os fluxos que importam.",
      },
    ],
    armadilhas: [
      "Testar detalhes de implementação (nome de estado, métodos internos, seletores por classe CSS): refatorar quebra o teste sem haver bug.",
      "Deixar estado vazar entre testes: mocks que não são restaurados, dados em variáveis globais, timers falsos que ficam ligados (`jest.useRealTimers()` no fim).",
      "Esperar com pausas fixas, ou verificar de forma síncrona algo que só aparece depois: use `findBy*` ou `waitFor`.",
      "Snapshots grandes, ou atualizados sem leitura: ninguém lê o diff e o teste vira ruído.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a divisão de trabalho entre o Jest e a Testing Library?",
        resposta:
          "O Jest encontra e executa os testes e fornece `expect`, mocks, timers e cobertura. A Testing Library renderiza o componente num DOM simulado (jsdom) e oferece consultas e interações do ponto de vista do usuário.",
      },
      {
        pergunta: "Como testar um componente que mostra dados vindos de uma API sem usar a rede?",
        resposta:
          "Substitua o módulo ou a camada de rede (`jest.mock` com `mockResolvedValue`, ou interceptação de requisições), renderize, aja e use `await screen.findBy...` para esperar o resultado aparecer.",
      },
    ],
  },
  en: {
    titulo: "Jest for React tests",
    pergunta: "What is Jest, and how is it used in React testing?",
    porqueEsteMetodo:
      "Setting up Jest and writing the first React tests is a procedure with steps and clear signals that each one worked (or what is missing). A step-by-step playbook avoids the classic environment and test-style mistakes.",
    resposta30s:
      "**Jest** is a JavaScript **test runner**: it finds the test files, runs each case and provides **assertions** (`expect`), **mocks** (functions, modules, timers) and a **coverage report**. In React it usually comes with **Testing Library**: Jest runs and checks; Testing Library renders the component in a simulated DOM (**jsdom**) and simulates what the user does. Each test follows three beats, **arrange, act and assert**, and checks what the user sees, not implementation details.",
    blocos: [
      {
        tipo: "passos",
        titulo: "From zero to the first passing test",
        passos: [
          {
            titulo: "1. Install and configure the environment",
            texto:
              "Install `jest`, the `jest-environment-jsdom` environment (a separate package in current versions), `@testing-library/react`, `@testing-library/user-event` and `@testing-library/jest-dom`. Set `testEnvironment` to `jsdom`, and point `setupFilesAfterEnv` at a file that imports `jest-dom`. **Error sign:** `document is not defined` means the jsdom environment is not on.",
          },
          {
            titulo: "2. Transform JSX and TypeScript",
            texto:
              "Jest only understands plain JavaScript: use `babel-jest` with the React and TypeScript presets (or `ts-jest`, or an SWC-based transformer). Give CSS and images a stub in `moduleNameMapper`. **Error sign:** `Unexpected token '<'` means JSX that was not transformed.",
          },
          {
            titulo: "3. Write the test in three beats",
            texto:
              "Inside `describe` and `it`: **arrange** (props, mocks, `render`), **act** (a click, some typing) and **assert** (`expect`). One behavior per test, with a name that says what the user sees. **Sign of a good test:** it fails when the behavior breaks and keeps passing when you only refactor.",
          },
          {
            titulo: "4. Render and simulate events",
            texto:
              "`render` mounts the component and `screen` queries by what the user perceives: role, label, text (`getByRole`, `getByLabelText`). For events use `userEvent.setup()` and `await user.click(...)`, which mimics the user better than `fireEvent`. **Sign:** when a query fails, Testing Library prints the DOM it found, which helps you fix the query.",
          },
          {
            titulo: "5. Mocks and timers",
            texto:
              '`jest.fn()` for callbacks (`toHaveBeenCalledWith`), `jest.mock("./api")` to replace a module, `jest.spyOn` to spy, and `fetch` or a network-interception layer for HTTP calls. With `restoreMocks` or `clearMocks` on in the configuration, one test does not inherit from another. For `setTimeout` and debounce, `jest.useFakeTimers()` and `jest.advanceTimersByTime()`. **Problem sign:** the test passes alone and fails in the suite.',
          },
          {
            titulo: "6. Asynchronous code",
            texto:
              "Wait for the result to appear with `await screen.findByText(...)` or `waitFor`, never with fixed pauses. **Problem sign:** the `not wrapped in act(...)` warning points to a state update the test did not wait for.",
          },
          {
            titulo: "7. Snapshots and coverage",
            texto:
              "`toMatchSnapshot` only for small, stable output. `jest --coverage` shows the lines no test ran: use it to find gaps, not as a score target. **Problem sign:** a snapshot updated by reflex (`-u`) without reading what changed.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Minimal configuration",
        legenda: "jest.config.js",
        codigo: [
          "module.exports = {",
          '  testEnvironment: "jsdom", // simulates the browser',
          '  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // e.g.: import "@testing-library/jest-dom";',
          '  moduleNameMapper: { "[.](css|svg|png)$": "<rootDir>/test/empty-file.js" }, // styles and images do not run in Jest',
          "  restoreMocks: true, // one test does not inherit another one’s mocks",
          "};",
        ].join("\n"),
        nota: "The transform presets (JSX and TypeScript) live in the Babel configuration or in the transformer you choose: see the Jest documentation.",
      },
      {
        tipo: "codigo",
        titulo: "A complete test: arrange, act, assert",
        legenda: "TSX",
        codigo: [
          'import { render, screen } from "@testing-library/react";',
          'import userEvent from "@testing-library/user-event";',
          'import { UserList } from "./UserList";',
          'import { fetchUsers } from "./api";',
          "",
          'jest.mock("./api"); // replaces the whole module with mocks',
          "",
          'it("shows the users after clicking Load", async () => {',
          "  // arrange",
          '  jest.mocked(fetchUsers).mockResolvedValue([{ id: 1, name: "Ana" }]);',
          "  const user = userEvent.setup();",
          "  render(<UserList />);",
          "",
          "  // act",
          '  await user.click(screen.getByRole("button", { name: /load/i }));',
          "",
          "  // assert: findBy waits for the text to appear",
          '  expect(await screen.findByText("Ana")).toBeInTheDocument();',
          "});",
        ].join("\n"),
        nota: "No network is used: the `api` module is replaced. The test only looks at what the user sees on screen.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Jest and Testing Library: who does what",
        texto:
          "**Jest** finds and runs the tests and provides `expect`, mocks, timers and coverage. **Testing Library** renders the component and offers queries and interactions from the user’s point of view. Test what the person sees and does, not the internal state. Runners with a similar API exist, such as Vitest; check the current documentation of the tools. For the broader picture of React testing, see S86, S87 and C30.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Coverage is not quality",
        texto:
          "100% coverage only says the lines were **executed**, not that anyone **checked** the result. A test that renders and makes no assertion inflates coverage without protecting anything. Use the report to find what nobody tested, and prioritize the flows that matter.",
      },
    ],
    armadilhas: [
      "Testing implementation details (state names, internal methods, CSS class selectors): refactoring breaks the test even though there is no bug.",
      "Letting state leak between tests: mocks that are not restored, data in global variables, fake timers left on (`jest.useRealTimers()` at the end).",
      "Waiting with fixed pauses, or asserting synchronously on something that only shows up later: use `findBy*` or `waitFor`.",
      "Large snapshots, or ones updated without reading: nobody reads the diff and the test becomes noise.",
    ],
    autoteste: [
      {
        pergunta: "How do Jest and Testing Library divide the work?",
        resposta:
          "Jest finds and runs the tests and provides `expect`, mocks, timers and coverage. Testing Library renders the component in a simulated DOM (jsdom) and offers queries and interactions from the user’s point of view.",
      },
      {
        pergunta: "How do you test a component that shows data from an API without using the network?",
        resposta:
          "Replace the module or the network layer (`jest.mock` with `mockResolvedValue`, or request interception), render, act and use `await screen.findBy...` to wait for the result to appear.",
      },
    ],
  },
};
