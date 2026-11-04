import type { Pergunta } from "../../tipos";

// L189 · React Testing Library explicada
export const l189: Pergunta = {
  numero: 189,
  modulo: "linkedin-testes",
  metodo: "feynman",
  pt: {
    titulo: "React Testing Library explicada",
    pergunta: "O que é a React Testing Library?",
    porqueEsteMetodo:
      "A ideia central da biblioteca é uma postura (testar como o usuário usa), e posturas se entendem melhor por uma imagem do dia a dia. Depois vêm as peças reais e o ponto em que a imagem para de valer.",
    resposta30s:
      "A **React Testing Library** testa componentes **do jeito que o usuário os usa**: renderiza num DOM de teste e consulta os elementos por **papel, rótulo e texto**, e não por estado interno ou nome de classe. Oferece `render`, `screen`, as consultas `getBy`, `queryBy` e `findBy` e, com o `userEvent`, simula cliques e digitação, rodando sobre Jest ou Vitest. Por isso os testes sobrevivem a refatorações, ao contrário dos da **Enzyme**, que inspecionava instâncias e internals.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um inspetor que avalia uma máquina de café só como o cliente a usa: lê os botões, aperta “Espresso”, espera e vê se o café caiu na xícara. Ele não abre a máquina para conferir a posição das engrenagens. Se o fabricante trocar as engrenagens e o café continuar saindo, o laudo do inspetor continua o mesmo.",
        tecnico:
          'A **React Testing Library** renderiza o componente num DOM de teste (em geral o jsdom) e entrega consultas para achar os elementos **como uma pessoa os identificaria**: pelo papel (`getByRole("button", { name: "Salvar" })`), pelo rótulo (`getByLabelText`) e pelo texto (`getByText`), deixando `getByTestId` como último recurso. Ela não é um executor de testes: roda sobre **Jest** ou **Vitest**, que descrevem, executam e afirmam. O `userEvent` simula interações realistas (clicar, digitar, tabular) e os matchers do `@testing-library/jest-dom` (`toBeInTheDocument`, `toBeDisabled`) deixam as afirmações legíveis. O princípio é testar **comportamento observável**, não estado interno nem nomes de classe.',
        limite:
          "O inspetor da analogia tem olhos de verdade; a biblioteca não: o jsdom é uma simulação do DOM, sem layout nem CSS reais, então ela não diz se algo ficou cortado, sobreposto ou bonito, e não substitui testes num navegador real para isso. E testar “por fora” não dispensa testes unitários de lógica complexa, escritos à parte.",
      },
      {
        tipo: "fluxo",
        titulo: "Um teste típico, em cinco passos",
        etapas: [
          "`render(<Componente />)` monta o componente no DOM de teste, com os provedores de que ele depender",
          "Consulte um elemento por papel, rótulo ou texto com `screen`: `getBy` quando ele deve existir agora, `queryBy` quando pode não existir, `findBy` quando vai aparecer depois",
          "Interaja com o `userEvent` (`click`, `type`, `tab`), sempre com `await`",
          "Espere o que é assíncrono com `findBy` ou `waitFor`, e não com pausas fixas",
          "Afirme o que o usuário vê: texto na tela, campo desabilitado, mensagem de erro",
        ],
        nota: "Cada passo é algo que uma pessoa faria. Nenhum olha para o `useState` nem para a árvore de componentes.",
      },
      {
        tipo: "codigo",
        titulo: "Um teste com render, screen e userEvent",
        legenda: "JSX",
        codigo: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Contador } from "./Contador";

// Com Vitest, importe test e expect de "vitest"; com Jest eles já são globais.
// toBeInTheDocument vem do @testing-library/jest-dom.
test("soma um ao clicar", async () => {
  const user = userEvent.setup();
  render(<Contador />);

  await user.click(screen.getByRole("button", { name: "Somar" }));

  expect(screen.getByText("Total: 1")).toBeInTheDocument();
});`,
      },
      {
        tipo: "tabela",
        titulo: "React Testing Library versus Enzyme",
        colunas: ["Aspecto", "React Testing Library", "Enzyme"],
        linhas: [
          [
            "Ideia central",
            "Testar o que o usuário vê e faz, pelo DOM renderizado",
            "Inspecionar componentes, props, estado e instâncias",
          ],
          [
            "Como acha elementos",
            "Papel, rótulo e texto acessíveis (`getByRole`, `getByLabelText`)",
            "Seletores de componente e de classe, `.state()`, `.props()`, `.instance()`",
          ],
          ["Renderização", "Sempre o DOM completo, no jsdom", "`shallow` (só o primeiro nível) ou `mount`"],
          [
            "Resiste a refatorar?",
            "Sim, enquanto o comportamento visível se mantiver",
            "Pouco: renomear o estado ou trocar a estrutura interna quebra os testes",
          ],
          [
            "Situação atual",
            "Mantida e muito adotada, feita para componentes de função e Hooks",
            "Depende de adaptadores por versão do React e não acompanhou as versões recentes; confira a situação no repositório do projeto",
          ],
        ],
        nota: "Em projeto novo, prefira a Testing Library. Em projeto antigo com Enzyme, migre aos poucos, arquivo por arquivo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra das consultas",
        texto:
          "**Ordem de preferência:** `getByRole` (com `name`), `getByLabelText`, `getByText`, depois `getByAltText` e `getByTitle`; `getByTestId` só quando nada acessível serve. **Variantes:** `getBy` lança erro se não achar (para o que deve existir), `queryBy` devolve `null` (para afirmar que algo **não** está na tela) e `findBy` espera e devolve uma promise (para o que aparece depois). Se você não consegue achar um botão pelo papel, talvez ele não seja acessível de verdade, e o teste acabou de avisar (veja L210).",
      },
    ],
    armadilhas: [
      "Consultar por classe CSS ou por estrutura (`container.querySelector`): o teste quebra com qualquer ajuste de estilo.",
      "Usar `getBy` para afirmar ausência (ele lança erro): use `queryBy` com `expect(...).not.toBeInTheDocument()`.",
      "Esquecer o `await` no `userEvent` ou no `findBy`: o teste afirma antes de a interface mudar e passa ou falha por acaso.",
      "Achar que a biblioteca substitui o executor de testes: sem Jest ou Vitest não há `test`, `expect` nem ambiente de DOM.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a ideia central da React Testing Library?",
        resposta:
          "Testar o componente como o usuário o usa: consultar elementos por papel, rótulo e texto, interagir com o `userEvent` e afirmar o que aparece na tela, sem olhar para estado interno nem para nomes de classe. Assim o teste sobrevive a refatorações que não mudam o comportamento.",
      },
      {
        pergunta: "Quando usar `getBy`, `queryBy` e `findBy`?",
        resposta:
          "`getBy` quando o elemento deve existir agora (lança erro se não achar); `queryBy` quando ele pode não existir, inclusive para afirmar ausência (devolve `null`); `findBy` quando ele vai aparecer depois, pois espera e devolve uma promise.",
      },
    ],
  },
  en: {
    titulo: "What is React Testing Library",
    pergunta: "What is React Testing Library?",
    porqueEsteMetodo:
      "The library’s central idea is a stance (test the way the user uses it), and stances are easier to grasp through an everyday picture. Then come the real pieces and the point where the picture stops holding.",
    resposta30s:
      "**React Testing Library** tests components **the way users use them**: it renders into a test DOM and queries elements by **role, label and text**, not by internal state or class name. It offers `render`, `screen`, the `getBy`, `queryBy` and `findBy` queries and, with `userEvent`, simulates clicks and typing, running on top of Jest or Vitest. That is why its tests survive refactors, unlike those of **Enzyme**, which inspected instances and internals.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture an inspector who evaluates a coffee machine only the way a customer uses it: reads the buttons, presses “Espresso”, waits and checks whether coffee landed in the cup. They do not open the machine to check the position of the gears. If the maker swaps the gears and coffee keeps coming out, the inspector’s verdict stays the same.",
        tecnico:
          'The **React Testing Library** renders the component into a test DOM (usually jsdom) and gives you queries to find elements **the way a person would identify them**: by role (`getByRole("button", { name: "Save" })`), by label (`getByLabelText`) and by text (`getByText`), leaving `getByTestId` as a last resort. It is not a test runner: it runs on top of **Jest** or **Vitest**, which describe, execute and assert. `userEvent` simulates realistic interactions (clicking, typing, tabbing), and the matchers from `@testing-library/jest-dom` (`toBeInTheDocument`, `toBeDisabled`) make assertions readable. The principle is to test **observable behavior**, not internal state or class names.',
        limite:
          "The inspector in the analogy has real eyes; the library does not: jsdom is a simulation of the DOM, with no real layout or CSS, so it cannot tell you whether something is clipped, overlapping or pretty, and it does not replace tests in a real browser for that. And testing “from the outside” does not remove the need for unit tests of complex logic, written separately.",
      },
      {
        tipo: "fluxo",
        titulo: "A typical test, in five steps",
        etapas: [
          "`render(<Component />)` mounts the component into the test DOM, with whatever providers it depends on",
          "Query an element by role, label or text with `screen`: `getBy` when it must exist now, `queryBy` when it may not exist, `findBy` when it will show up later",
          "Interact with `userEvent` (`click`, `type`, `tab`), always with `await`",
          "Wait for anything asynchronous with `findBy` or `waitFor`, not with fixed pauses",
          "Assert what the user sees: text on screen, a disabled field, an error message",
        ],
        nota: "Each step is something a person would do. None of them looks at `useState` or at the component tree.",
      },
      {
        tipo: "codigo",
        titulo: "A test with render, screen and userEvent",
        legenda: "JSX",
        codigo: `import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

// With Vitest, import test and expect from "vitest"; with Jest they are globals.
// toBeInTheDocument comes from @testing-library/jest-dom.
test("adds one on click", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(screen.getByText("Total: 1")).toBeInTheDocument();
});`,
      },
      {
        tipo: "tabela",
        titulo: "React Testing Library versus Enzyme",
        colunas: ["Aspect", "React Testing Library", "Enzyme"],
        linhas: [
          [
            "Central idea",
            "Test what the user sees and does, through the rendered DOM",
            "Inspect components, props, state and instances",
          ],
          [
            "How it finds elements",
            "Accessible role, label and text (`getByRole`, `getByLabelText`)",
            "Component and class selectors, `.state()`, `.props()`, `.instance()`",
          ],
          ["Rendering", "Always the full DOM, in jsdom", "`shallow` (first level only) or `mount`"],
          [
            "Survives refactoring?",
            "Yes, as long as the visible behavior holds",
            "Barely: renaming state or changing the internal structure breaks the tests",
          ],
          [
            "Current status",
            "Maintained and widely adopted, built for function components and Hooks",
            "Relies on per-version adapters for React and did not keep up with recent versions; check the project’s repository for its current status",
          ],
        ],
        nota: "In a new project, prefer Testing Library. In an old project using Enzyme, migrate gradually, file by file.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule for queries",
        texto:
          "**Order of preference:** `getByRole` (with `name`), `getByLabelText`, `getByText`, then `getByAltText` and `getByTitle`; `getByTestId` only when nothing accessible works. **Variants:** `getBy` throws if it finds nothing (for what must exist), `queryBy` returns `null` (to assert that something is **not** on screen) and `findBy` waits and returns a promise (for what shows up later). If you cannot find a button by its role, maybe it is not truly accessible, and the test has just told you so (see L210).",
      },
    ],
    armadilhas: [
      "Querying by CSS class or by structure (`container.querySelector`): the test breaks with any styling tweak.",
      "Using `getBy` to assert absence (it throws): use `queryBy` with `expect(...).not.toBeInTheDocument()`.",
      "Forgetting `await` on `userEvent` or `findBy`: the test asserts before the interface changes and passes or fails by chance.",
      "Thinking the library replaces the test runner: without Jest or Vitest there is no `test`, no `expect` and no DOM environment.",
    ],
    autoteste: [
      {
        pergunta: "What is the central idea of React Testing Library?",
        resposta:
          "Test the component the way the user uses it: query elements by role, label and text, interact with `userEvent` and assert what appears on screen, without looking at internal state or class names. That way the test survives refactors that do not change behavior.",
      },
      {
        pergunta: "When do you use `getBy`, `queryBy` and `findBy`?",
        resposta:
          "`getBy` when the element must exist now (it throws if it finds nothing); `queryBy` when it may not exist, including to assert absence (it returns `null`); `findBy` when it will show up later, since it waits and returns a promise.",
      },
    ],
  },
};
