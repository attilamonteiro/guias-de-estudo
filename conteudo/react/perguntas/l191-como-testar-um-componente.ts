import type { Pergunta } from "../../tipos";

// L191 · Como testar um componente
export const l191: Pergunta = {
  numero: 191,
  modulo: "linkedin-testes",
  metodo: "playbook",
  pt: {
    titulo: "Como testar um componente",
    pergunta: "Como você testa um componente?",
    porqueEsteMetodo:
      "“Como você testa?” pede um procedimento, e a ordem importa: primeiro decidir o comportamento, depois montar, interagir, esperar e afirmar. Um passo a passo com o sinal de que cada etapa deu certo é a resposta que um entrevistador procura.",
    resposta30s:
      "Teste o **comportamento que o usuário percebe**, não a implementação: **renderize** o componente com os provedores de que ele precisa, **consulte** a interface por papel, rótulo e texto, **simule** a interação com o `userEvent`, **espere** o que é assíncrono com `findBy` ou `waitFor` e **afirme o resultado visível**. Simule só o que é externo (rede, relógio) e evite testar estado interno, a biblioteca em si e snapshots enormes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: testar um componente",
        passos: [
          {
            titulo: "Escolha o comportamento, não o código",
            texto:
              "Liste o que o usuário vê e faz: “mostra erro se o e-mail for inválido”, “desabilita o botão enquanto envia”. Sinal de acerto: o nome de cada teste está em linguagem de usuário e sobreviveria a reescrever o componente por dentro.",
          },
          {
            titulo: "Renderize com tudo o que o componente precisa",
            texto:
              "Envolva-o nos provedores reais ou de teste (roteador, tema, cliente de dados, Context). Uma função auxiliar de render do projeto evita repetir isso em todo arquivo. Sinal: o componente monta como na aplicação, sem props que nunca existiriam.",
          },
          {
            titulo: "Consulte pela interface acessível",
            texto:
              "Use `getByRole` com `name`, `getByLabelText` e `getByText`; `getByTestId` fica para o que não tem outra forma. Sinal: se você não acha um botão pelo papel, talvez o problema seja de acessibilidade, e não do teste.",
          },
          {
            titulo: "Simule a interação do usuário",
            texto:
              "Use `userEvent` (`click`, `type`, `tab`, `keyboard`), sempre com `await`, e não `fireEvent`, que dispara um único evento isolado. Ele reproduz a sequência real de eventos do navegador, como foco, teclas e cliques.",
          },
          {
            titulo: "Espere o que é assíncrono",
            texto:
              "Use `findBy*` ou `waitFor` para o que aparece depois (resposta de API, transição de estado), e nunca `setTimeout` fixo. Critério: o teste espera só o tempo necessário e falha com mensagem clara se o elemento não vier.",
          },
          {
            titulo: "Afirme o resultado visível e simule só o que é externo",
            texto:
              "Verifique texto na tela, campo desabilitado, mensagem de erro, ou que um callback recebido por prop foi chamado com o valor certo. Substitua só o que está fora do componente: rede (veja L193), relógio e módulos pesados. Não simule os filhos nem os Hooks internos, ou você testa o mock.",
          },
          {
            titulo: "Quebre de propósito para confirmar que o teste vale",
            texto:
              "Altere o comportamento (remova a validação, troque uma condição) e veja o teste falhar. Depois cubra os casos de borda: vazio, erro e carregando. Um teste que nunca falha não protege nada.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Formulário: sucesso e erro de validação",
        legenda: "JSX",
        codigo: `// vi.fn() é do Vitest; no Jest, use jest.fn()
test("envia o e-mail digitado", async () => {
  const user = userEvent.setup();
  const aoEnviar = vi.fn();
  render(<FormularioDeContato aoEnviar={aoEnviar} />);

  await user.type(screen.getByLabelText("E-mail"), "ana@exemplo.com");
  await user.click(screen.getByRole("button", { name: "Enviar" }));

  expect(aoEnviar).toHaveBeenCalledWith({ email: "ana@exemplo.com" });
});

test("mostra erro para e-mail inválido", async () => {
  const user = userEvent.setup();
  render(<FormularioDeContato aoEnviar={vi.fn()} />);

  await user.type(screen.getByLabelText("E-mail"), "invalido");
  await user.click(screen.getByRole("button", { name: "Enviar" }));

  expect(screen.getByRole("alert")).toHaveTextContent("E-mail inválido");
});`,
        nota: "Os dois testes cobrem formulário, digitação e clique pelo mesmo caminho do usuário. Nenhum olha o estado do formulário.",
      },
      {
        tipo: "tabela",
        titulo: "O que testar e o que evitar",
        colunas: ["Teste isto", "Evite testar isto", "Por quê"],
        linhas: [
          [
            "O texto visível e os estados de carregando, erro e vazio",
            "O valor do `useState` ou de outras variáveis internas",
            "Refatorar o estado quebra o teste sem mudar o comportamento",
          ],
          [
            "O resultado de clicar e digitar: o que aparece e que callback é chamado",
            "Nomes de classe e a estrutura exata do DOM",
            "Detalhes visuais mudam por estilo, não por comportamento",
          ],
          [
            "As regras do seu código: validações, cálculos, condições",
            "A biblioteca em si (que o React renderiza, que o `useState` atualiza)",
            "Os mantenedores já testam isso; o seu teste só replicaria",
          ],
          [
            "Snapshots pequenos e focados, quando fazem sentido",
            "Snapshots enormes da árvore inteira",
            "Ninguém lê o diff, aprova-se por reflexo e qualquer ajuste os quebra",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Teste comportamento, não implementação",
        texto:
          "A pergunta de controle: se eu refatorar o componente por dentro **sem mudar o que o usuário vê e faz**, o teste deve continuar passando; se eu **quebrar o comportamento**, ele deve falhar. É por isso que se consulta por papel e texto e se afirma o que está na tela. O mesmo vale para interações (clicar, digitar, tabular) e formulários (preencher, enviar, ver o erro). Detalhes das ferramentas estão em L189.",
      },
    ],
    armadilhas: [
      "Afirmar sobre estado interno, props passadas a filhos ou chamadas de Hooks: acopla o teste à implementação.",
      "Pausar com `setTimeout` ou `sleep` em vez de esperar com `findBy` ou `waitFor`: testes lentos e intermitentes.",
      "Simular os componentes filhos e os Hooks do próprio componente: o teste passa mesmo com a tela quebrada.",
      "Reutilizar estado entre testes (mocks não restaurados, cache de dados, relógio falso ligado): um teste contamina o seguinte.",
    ],
    autoteste: [
      {
        pergunta: "Por que preferir `userEvent` a `fireEvent` ao simular interações?",
        resposta:
          "Porque o `userEvent` reproduz a sequência real de eventos que o navegador gera (foco, teclas, cliques), enquanto o `fireEvent` dispara um único evento isolado e pode passar por cima de comportamentos que o usuário de verdade acionaria.",
      },
      {
        pergunta: "O que você evita testar em um componente React e por quê?",
        resposta:
          "Estado interno, nomes de classe, estrutura exata do DOM, snapshots enormes e o funcionamento da própria biblioteca. Esses testes quebram em refatorações sem que o comportamento mude, ou repetem o que os mantenedores já testam.",
      },
    ],
  },
  en: {
    titulo: "Testing a component",
    pergunta: "How do you test a component?",
    porqueEsteMetodo:
      "“How do you test?” asks for a procedure, and the order matters: first decide the behavior, then mount, interact, wait and assert. A step-by-step with the sign that each stage went well is the answer an interviewer looks for.",
    resposta30s:
      "Test the **behavior the user perceives**, not the implementation: **render** the component with the providers it needs, **query** the interface by role, label and text, **simulate** the interaction with `userEvent`, **wait** for anything asynchronous with `findBy` or `waitFor`, and **assert the visible result**. Fake only what is external (network, clock) and avoid testing internal state, the library itself and huge snapshots.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: testing a component",
        passos: [
          {
            titulo: "Pick the behavior, not the code",
            texto:
              "List what the user sees and does: “shows an error if the email is invalid”, “disables the button while sending”. Sign of success: each test name is in user language and would survive rewriting the component from the inside.",
          },
          {
            titulo: "Render with everything the component needs",
            texto:
              "Wrap it in the real or test providers (router, theme, data client, Context). A project-level render helper avoids repeating that in every file. Sign: the component mounts as it does in the application, with no props that would never exist.",
          },
          {
            titulo: "Query through the accessible interface",
            texto:
              "Use `getByRole` with `name`, `getByLabelText` and `getByText`; `getByTestId` is for what has no other way in. Sign: if you cannot find a button by its role, the problem may be accessibility rather than the test.",
          },
          {
            titulo: "Simulate the user’s interaction",
            texto:
              "Use `userEvent` (`click`, `type`, `tab`, `keyboard`), always with `await`, instead of `fireEvent`, which fires a single isolated event. It reproduces the real sequence of browser events, such as focus, keys and clicks.",
          },
          {
            titulo: "Wait for anything asynchronous",
            texto:
              "Use `findBy*` or `waitFor` for what appears later (an API response, a state transition), never a fixed `setTimeout`. Criterion: the test waits only as long as needed and fails with a clear message if the element never shows up.",
          },
          {
            titulo: "Assert the visible result and fake only what is external",
            texto:
              "Check text on screen, a disabled field, an error message, or that a callback received as a prop was called with the right value. Replace only what lies outside the component: the network (see L193), the clock and heavy modules. Do not fake the children or the internal Hooks, or you are testing the mock.",
          },
          {
            titulo: "Break it on purpose to confirm the test is worth it",
            texto:
              "Change the behavior (remove the validation, flip a condition) and watch the test fail. Then cover the edge cases: empty, error and loading. A test that never fails protects nothing.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A form: success and validation error",
        legenda: "JSX",
        codigo: `// vi.fn() is from Vitest; with Jest, use jest.fn()
test("submits the typed email", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<ContactForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText("Email"), "ana@example.com");
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(onSubmit).toHaveBeenCalledWith({ email: "ana@example.com" });
});

test("shows an error for an invalid email", async () => {
  const user = userEvent.setup();
  render(<ContactForm onSubmit={vi.fn()} />);

  await user.type(screen.getByLabelText("Email"), "invalid");
  await user.click(screen.getByRole("button", { name: "Send" }));

  expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
});`,
        nota: "Both tests exercise the form, the typing and the click through the user’s own path. Neither looks at the form’s state.",
      },
      {
        tipo: "tabela",
        titulo: "What to test and what to avoid",
        colunas: ["Test this", "Avoid testing this", "Why"],
        linhas: [
          [
            "The visible text and the loading, error and empty states",
            "The value of `useState` or other internal variables",
            "Refactoring the state breaks the test without changing the behavior",
          ],
          [
            "The result of clicking and typing: what appears and which callback is called",
            "Class names and the exact DOM structure",
            "Visual details change through styling, not through behavior",
          ],
          [
            "The rules of your code: validations, calculations, conditions",
            "The library itself (that React renders, that `useState` updates)",
            "The maintainers already test that; your test would only duplicate it",
          ],
          [
            "Small, focused snapshots, when they make sense",
            "Huge snapshots of the whole tree",
            "Nobody reads the diff, they get approved by reflex and any tweak breaks them",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Test behavior, not implementation",
        texto:
          "The control question: if I refactor the component from the inside **without changing what the user sees and does**, the test should keep passing; if I **break the behavior**, it should fail. That is why you query by role and text and assert what is on screen. The same goes for interactions (clicking, typing, tabbing) and forms (filling in, submitting, seeing the error). Tooling details are in L189.",
      },
    ],
    armadilhas: [
      "Asserting on internal state, props passed to children or Hook calls: it couples the test to the implementation.",
      "Pausing with `setTimeout` or `sleep` instead of waiting with `findBy` or `waitFor`: slow, intermittent tests.",
      "Faking the component’s own children and Hooks: the test passes even with a broken screen.",
      "Sharing state between tests (unrestored mocks, a data cache, a fake clock left on): one test contaminates the next.",
    ],
    autoteste: [
      {
        pergunta: "Why prefer `userEvent` to `fireEvent` when simulating interactions?",
        resposta:
          "Because `userEvent` reproduces the real sequence of events the browser generates (focus, keys, clicks), while `fireEvent` fires a single isolated event and can skip behaviors that a real user would trigger.",
      },
      {
        pergunta: "What do you avoid testing in a React component, and why?",
        resposta:
          "Internal state, class names, the exact DOM structure, huge snapshots and the behavior of the library itself. Those tests break in refactors without any change in behavior, or repeat what the maintainers already test.",
      },
    ],
  },
};
