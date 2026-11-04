import type { Pergunta } from "../../tipos";

// L186 · O que é teste unitário
export const l186: Pergunta = {
  numero: 186,
  modulo: "linkedin-testes",
  metodo: "compare",
  pt: {
    titulo: "O que é teste unitário",
    pergunta: "O que é teste unitário?",
    porqueEsteMetodo:
      "“Unitário” só tem sentido ao lado dos vizinhos: integração e ponta a ponta. Uma matriz mostra o que cada nível isola, o que custa e o que garante, e a regra de decisão diz quando escolher cada um.",
    resposta30s:
      "O **teste unitário** verifica uma peça pequena **isolada** do resto (uma função pura, um Hook ou um componente simples com dependências simuladas): é rápido e aponta o defeito com precisão. O de **integração** junta várias peças reais e simula só as bordas, como a rede; o **ponta a ponta** roda a aplicação inteira num navegador de verdade. Quanto mais alto o nível, mais confiança e mais lentidão, custo e fragilidade, por isso se combinam os três.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os três níveis lado a lado",
        colunas: ["Tipo", "O que isola", "Velocidade e custo", "Fragilidade", "Confiança que traz", "Exemplo em React"],
        linhas: [
          [
            "Unitário",
            "Uma peça pequena sozinha; o resto é simulado ou nem entra",
            "Muito rápido e barato de escrever e de rodar",
            "Baixa, se testar comportamento e não detalhes internos",
            "Localiza o defeito com precisão, mas só garante aquela peça",
            "Uma função pura (`calcularTotal`), um Hook ou um componente simples com os dados na mão",
          ],
          [
            "Integração",
            "Várias peças reais juntas (componentes, estado, rotas); só as bordas externas, como a rede, são simuladas",
            "Rápido o bastante (roda em jsdom, sem navegador) e de custo médio",
            "Média: depende de mais coisas, mas resiste a refatorações internas",
            "Mostra que as peças se combinam e que a tela se comporta como o usuário espera",
            "Uma página com formulário, lista e botão, com a API simulada",
          ],
          [
            "Ponta a ponta (E2E)",
            "Nada: aplicação, navegador e, em geral, servidor e banco de verdade",
            "Lento e caro (ambiente, dados de teste, manutenção)",
            "Alta: rede, tempo e dados instáveis geram falhas intermitentes",
            "A maior: prova o fluxo completo que o usuário percorre",
            "Playwright ou Cypress abrindo a loja, adicionando ao carrinho e finalizando a compra",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Teste cada coisa no **nível mais barato que ainda a pega**. Regra de negócio e cálculos: unitário. Uma tela que junta componentes, estado e requisições: integração, onde costumam aparecer os bugs reais de interface. Os poucos fluxos que **não podem quebrar** (login, compra, pagamento): ponta a ponta. O formato é a **pirâmide** (muitos unitários, alguns de integração, poucos E2E) ou o **troféu**, popular no mundo React, que põe análise estática (TypeScript e lint) na base e a maior fatia em integração, porque um componente vale pelo que faz junto com os outros. Nos dois, a ideia é a mesma: muitos testes baratos, poucos caros.",
      },
      {
        tipo: "codigo",
        titulo: "A mesma funcionalidade, nos três níveis",
        legenda: "JSX",
        codigo: `// Unitário: função pura, sem React
expect(calcularTotal([{ preco: 10, qtd: 2 }])).toBe(20);

// Integração: componentes reais juntos; só a rede é simulada
render(<Carrinho />);
await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));
expect(await screen.findByText("Total: R$ 20,00")).toBeInTheDocument();

// Ponta a ponta (Playwright): navegador, servidor e banco reais
await page.goto("/loja");
await page.getByRole("button", { name: "Finalizar compra" }).click();
await expect(page.getByText("Pedido confirmado")).toBeVisible();`,
        nota: "Os limites variam por equipe: um componente isolado com dependências simuladas é “unitário” para uns e “de integração” para outros. Combine o vocabulário com o time e foque no que cada teste prova.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como os testes melhoram a qualidade de uma aplicação React",
        texto:
          "Eles pegam **regressões** antes do usuário, dão **coragem para refatorar** (o teste diz se o comportamento foi preservado), servem de **documentação viva** do que cada componente promete e expõem **mau design**: o que é difícil de testar costuma estar acoplado demais (veja L185). Teste não prova ausência de bugs, reduz risco, e o ganho depende de testar o que importa. Para a ferramenta e o estilo de teste de componentes, veja L189 e L191.",
      },
    ],
    armadilhas: [
      "Perseguir cobertura alta como se fosse qualidade: uma linha executada não é uma linha verificada.",
      "Simular tanta coisa no teste unitário que ele só confere os próprios mocks.",
      "Cobrir tudo só com ponta a ponta (o “cone de sorvete”): suíte lenta, instável e difícil de diagnosticar.",
      "Testar detalhes de implementação (estado interno, nomes de classes): o teste quebra a cada refatoração sem que o comportamento tenha mudado.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre teste unitário, de integração e de ponta a ponta?",
        resposta:
          "O unitário isola uma peça pequena e simula o resto; o de integração junta várias peças reais e simula só as bordas, como a rede; o de ponta a ponta usa a aplicação inteira num navegador real. Do primeiro ao último, crescem a confiança, o custo e a fragilidade.",
      },
      {
        pergunta: "Por que não testar tudo só com ponta a ponta?",
        resposta:
          "Porque são lentos, caros e sujeitos a falhas intermitentes, e quando falham não dizem onde está o defeito. Os testes baratos cobrem o grosso e os de ponta a ponta ficam para os fluxos críticos.",
      },
    ],
  },
  en: {
    titulo: "What is unit testing",
    pergunta: "What is unit testing?",
    porqueEsteMetodo:
      "“Unit” only makes sense next to its neighbors: integration and end-to-end. A matrix shows what each level isolates, what it costs and what it guarantees, and the decision rule says when to pick each.",
    resposta30s:
      "A **unit test** checks one small piece **in isolation** (a pure function, a Hook or a simple component with simulated dependencies): it is fast and points at the defect precisely. An **integration** test joins several real pieces and fakes only the edges, such as the network; **end-to-end** runs the whole application in a real browser. The higher the level, the more confidence and the more slowness, cost and fragility, which is why you combine all three.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The three levels side by side",
        colunas: [
          "Type",
          "What it isolates",
          "Speed and cost",
          "Fragility",
          "Confidence it brings",
          "Example in React",
        ],
        linhas: [
          [
            "Unit",
            "One small piece alone; the rest is faked or not involved",
            "Very fast and cheap to write and run",
            "Low, if it tests behavior and not internals",
            "Pinpoints the defect, but only vouches for that piece",
            "A pure function (`calculateTotal`), a Hook or a simple component with the data at hand",
          ],
          [
            "Integration",
            "Several real pieces together (components, state, routes); only external edges, such as the network, are faked",
            "Fast enough (runs in jsdom, no browser) and of medium cost",
            "Medium: it depends on more things, but survives internal refactors",
            "Shows that the pieces fit together and the screen behaves as the user expects",
            "A page with a form, a list and a button, with the API faked",
          ],
          [
            "End-to-end (E2E)",
            "Nothing: the real application, browser and, usually, server and database",
            "Slow and expensive (environment, test data, maintenance)",
            "High: an unstable network, timing and data cause intermittent failures",
            "The highest: proves the complete flow a user walks through",
            "Playwright or Cypress opening the store, adding to the cart and checking out",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Test each thing at the **cheapest level that still catches it**. Business rules and calculations: unit. A screen that combines components, state and requests: integration, where real interface bugs tend to show up. The few flows that **must not break** (login, purchase, payment): end-to-end. The shape is the **pyramid** (many unit tests, some integration, few E2E) or the **trophy**, popular in the React world, which puts static analysis (TypeScript and lint) at the base and the largest slice in integration, because a component is worth what it does together with the others. In both, the idea is the same: many cheap tests, few expensive ones.",
      },
      {
        tipo: "codigo",
        titulo: "The same feature, at the three levels",
        legenda: "JSX",
        codigo: `// Unit: a pure function, no React
expect(calculateTotal([{ price: 10, qty: 2 }])).toBe(20);

// Integration: real components together; only the network is faked
render(<Cart />);
await userEvent.click(screen.getByRole("button", { name: "Add" }));
expect(await screen.findByText("Total: $20.00")).toBeInTheDocument();

// End-to-end (Playwright): real browser, server and database
await page.goto("/store");
await page.getByRole("button", { name: "Check out" }).click();
await expect(page.getByText("Order confirmed")).toBeVisible();`,
        nota: "The boundaries vary by team: a component in isolation with faked dependencies is “unit” to some and “integration” to others. Agree on the vocabulary with your team and focus on what each test proves.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How tests improve the quality of a React application",
        texto:
          "They catch **regressions** before users do, give you **courage to refactor** (the test tells you whether the behavior was preserved), act as **living documentation** of what each component promises and expose **poor design**: whatever is hard to test is usually too coupled (see L185). A test does not prove the absence of bugs, it reduces risk, and the gain depends on testing what matters. For the tooling and style of component tests, see L189 and L191.",
      },
    ],
    armadilhas: [
      "Chasing high coverage as if it were quality: an executed line is not a verified line.",
      "Faking so much in a unit test that it only checks its own mocks.",
      "Covering everything with end-to-end only (the “ice cream cone”): a slow, unstable suite that is hard to diagnose.",
      "Testing implementation details (internal state, class names): the test breaks on every refactor even though the behavior did not change.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between unit, integration and end-to-end tests?",
        resposta:
          "A unit test isolates one small piece and fakes the rest; an integration test joins several real pieces and fakes only the edges, such as the network; an end-to-end test uses the whole application in a real browser. From first to last, confidence, cost and fragility all grow.",
      },
      {
        pergunta: "Why not test everything with end-to-end tests only?",
        resposta:
          "Because they are slow, expensive and prone to intermittent failures, and when they fail they do not tell you where the defect is. Cheap tests cover the bulk, and end-to-end tests are kept for the critical flows.",
      },
    ],
  },
};
