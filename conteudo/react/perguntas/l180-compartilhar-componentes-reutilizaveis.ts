import type { Pergunta } from "../../tipos";

// L180 · Compartilhar componentes reutilizáveis
export const l180: Pergunta = {
  numero: 180,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "design",
  pt: {
    titulo: "Compartilhar componentes reutilizáveis",
    pergunta: "Como você compartilha componentes reutilizáveis?",
    porqueEsteMetodo:
      "Compartilhar componentes é uma decisão de projeto: muda conforme quem consome, a estabilidade exigida e o custo de manter. Um roteiro (requisitos, forma de distribuição, API do componente, estilo, qualidade, documentação e versionamento) cobre tudo sem esquecer o que costuma quebrar.",
    resposta30s:
      "Há três formas: **pasta compartilhada no app**, **pacote interno num monorepo** e **pacote publicado em registro**; a escolha depende de quem consome e de quão independentes são os ciclos de entrega. O que torna um componente reutilizável é uma **API pequena e bem tipada**, **composição em vez de excesso de props**, **estilo por tokens**, **acessibilidade** e **testes**. Em biblioteca, entram catálogo (Storybook), **semver** e uma política para mudanças que quebram a API.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Quem consome (um app, vários apps, outros times, gente de fora), com que estabilidade, que temas e marcas, que nível de acessibilidade e quem mantém. O desenho muda muito entre “reuso dentro do app” e “biblioteca para outros times”.",
          },
          {
            titulo: "2. Escolha da forma de compartilhar",
            texto:
              "Pasta compartilhada, pacote interno ou pacote publicado: veja a tabela. Comece pela forma mais simples que atende aos consumidores de hoje.",
          },
          {
            titulo: "3. Desenhe a API do componente",
            texto:
              "Props mínimas e bem tipadas, com defaults sensatos; repasse das props nativas do elemento (`ComponentPropsWithoutRef`) e da `ref` (em versões recentes ela é uma prop comum; antes exigia `forwardRef`; confira react.dev); componentes controlados e não controlados quando fizer sentido. Prefira composição a dezenas de booleanos.",
          },
          {
            titulo: "4. Estilo e temas",
            texto:
              "Tokens de design (cor, espaçamento, tipografia) em variáveis CSS, um número limitado de variantes e uma forma de sobrescrever por `className`, sem depender de CSS global do app que consome.",
          },
          {
            titulo: "5. Acessibilidade e testes",
            texto:
              "Elementos semânticos, foco, teclado e ARIA corretos (bibliotecas sem estilo, como Radix ou React Aria, ajudam). Testes com a Testing Library, verificação automática de acessibilidade e, nos componentes críticos, testes de regressão visual.",
          },
          {
            titulo: "6. Documentação e catálogo",
            texto:
              "Um catálogo como o Storybook, com um caso por variante e controles interativos, serve de documentação viva, de bancada de testes e de acordo com o design.",
          },
          {
            titulo: "7. Versionamento e mudanças que quebram",
            texto:
              "Semver, changelog (por exemplo, com o Changesets), `peerDependencies` para o `react`, build ESM com tipos. Antes de remover algo, deprecie: aviso em desenvolvimento, caminho de migração e, se a mudança for mecânica, um codemod. Defina o que é API pública e por quanto tempo a antiga é mantida.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Formas de compartilhar",
        colunas: ["Forma", "Como funciona", "Quando serve", "Custo"],
        linhas: [
          [
            "Pasta compartilhada no app",
            "`src/shared/ui`, importada por todo o app",
            "Um app só, um time",
            "Sem versão nem fronteira real; qualquer mudança afeta tudo de uma vez",
          ],
          [
            "Pacote interno num monorepo",
            "Um workspace (por exemplo, `packages/ui`) consumido pelos apps do repositório",
            "Vários apps no mesmo repositório; mudar a biblioteca e os consumidores no mesmo PR",
            "Exige ferramentas de monorepo (workspaces, cache de build) e regras de dependência",
          ],
          [
            "Pacote publicado em registro",
            "Versionado e publicado no npm, público ou privado",
            "Consumidores fora do repositório, ciclos independentes ou código aberto",
            "Build, versionamento, documentação, changelog e política de quebra; quem consome decide quando atualizar",
          ],
          [
            "Código copiado para o app",
            "O kit entrega o código e cada app o mantém (modelo de alguns kits, como o shadcn/ui)",
            "Quando cada app precisa adaptar muito",
            "Cada cópia diverge; as correções não se propagam sozinhas",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Props nativas repassadas e variantes limitadas",
        legenda: "TSX",
        codigo: [
          'import type { ComponentPropsWithoutRef, ReactNode } from "react";',
          "",
          'type BotaoProps = ComponentPropsWithoutRef<"button"> & {',
          '  variante?: "primario" | "secundario";',
          '  tamanho?: "p" | "m";',
          "  icone?: ReactNode;",
          "};",
          "",
          'export function Botao({ variante = "primario", tamanho = "m", icone, children, ...resto }: BotaoProps) {',
          "  return (",
          "    <button {...resto} data-variante={variante} data-tamanho={tamanho}>",
          "      {icone}",
          "      {children}",
          "    </button>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`onClick`, `disabled`, `aria-*` e `className` passam por `...resto`; o CSS lê `data-variante` e `data-tamanho` e usa os tokens do tema. A biblioteca controla o visual sem esconder o que o elemento nativo já oferece.",
      },
      {
        tipo: "codigo",
        titulo: "Composição em vez de mais uma prop",
        legenda: "TSX",
        codigo: [
          "// Frágil: cada necessidade nova vira mais uma prop",
          '<Cartao titulo="Plano" subtitulo="Mensal" mostrarRodape textoBotao="Assinar" aoClicarBotao={assinar} />',
          "",
          "// Composição: o consumidor monta; o componente dá estrutura, estilo e acessibilidade",
          "<Cartao>",
          "  <Cartao.Titulo>Plano</Cartao.Titulo>",
          "  <Cartao.Corpo>Mensal</Cartao.Corpo>",
          "  <Cartao.Rodape>",
          "    <Botao onClick={assinar}>Assinar</Botao>",
          "  </Cartao.Rodape>",
          "</Cartao>",
        ].join("\n"),
        nota: "Com composição, o rodapé opcional deixa de ser um booleano e o botão deixa de ser uma prop de texto e outra de callback: o consumidor coloca o que precisar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece com uma **pasta compartilhada**; promova a **pacote interno** quando um segundo app precisar do mesmo componente; **publique em registro** quando os consumidores estiverem fora do seu controle. Um componente só é reutilizável com **API pequena e estável, composição, tema por tokens, acessibilidade e testes**. Antes disso, copiar duas vezes costuma custar menos do que uma abstração errada.",
      },
    ],
    armadilhas: [
      "Abstrair cedo demais: transformar em “genérico” o que serviu a uma ou duas telas, com um monte de props e booleanos; a API errada é cara de mudar depois.",
      "Acoplar a biblioteca ao app (CSS global, rotas, contexto específico, regra de negócio): ela deixa de ser reutilizável.",
      "Empacotar o `react` dentro da biblioteca em vez de declará-lo em `peerDependencies`: duas cópias do React quebram hooks e contexto.",
      "Mudar a API sem aviso nem versão: quebra os consumidores; use semver, depreciação e um guia de migração.",
    ],
    autoteste: [
      {
        pergunta: "Por que preferir composição a muitas props booleanas?",
        resposta:
          "Porque cada necessidade nova acrescentaria mais uma prop e combinações impossíveis. Com composição, o consumidor monta as partes e o componente oferece só estrutura, estilo e acessibilidade; a API cresce menos e muda menos.",
      },
      {
        pergunta: "Como introduzir uma mudança que quebra a API de um componente compartilhado?",
        resposta:
          "Deprecando antes de remover: manter o comportamento antigo com aviso em desenvolvimento, documentar a migração (e oferecer um codemod se for mecânica), lançar uma versão maior seguindo semver e só então remover.",
      },
    ],
  },
  en: {
    titulo: "Sharing reusable components",
    pergunta: "How do you share reusable components?",
    porqueEsteMetodo:
      "Sharing components is a design decision: it changes with who consumes them, the stability required and the cost of maintenance. A script (requirements, distribution form, component API, styling, quality, documentation and versioning) covers it all without forgetting what usually breaks.",
    resposta30s:
      "There are three forms: a **shared folder in the app**, an **internal package in a monorepo** and a **package published to a registry**; the choice depends on who consumes it and how independent the release cycles are. What makes a component reusable is a **small, well-typed API**, **composition instead of too many props**, **styling through tokens**, **accessibility** and **tests**. For a library, add a catalog (Storybook), **semver** and a policy for breaking API changes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Who consumes it (one app, several apps, other teams, outsiders), with what stability, which themes and brands, what level of accessibility and who maintains it. The design changes a lot between “reuse inside the app” and “a library for other teams”.",
          },
          {
            titulo: "2. Choosing how to share",
            texto:
              "Shared folder, internal package or published package: see the table. Start with the simplest form that serves today’s consumers.",
          },
          {
            titulo: "3. Design the component’s API",
            texto:
              "Minimal, well-typed props with sensible defaults; forward the element’s native props (`ComponentPropsWithoutRef`) and the `ref` (in recent versions it is a regular prop; before, it required `forwardRef`; check react.dev); controlled and uncontrolled modes where it makes sense. Prefer composition to dozens of booleans.",
          },
          {
            titulo: "4. Styling and themes",
            texto:
              "Design tokens (color, spacing, typography) in CSS variables, a limited number of variants and a way to override through `className`, without depending on the consuming app’s global CSS.",
          },
          {
            titulo: "5. Accessibility and tests",
            texto:
              "Semantic elements, correct focus, keyboard and ARIA (unstyled libraries such as Radix or React Aria help). Tests with Testing Library, automatic accessibility checks and, for critical components, visual regression tests.",
          },
          {
            titulo: "6. Documentation and catalog",
            texto:
              "A catalog such as Storybook, with one story per variant and interactive controls, serves as living documentation, a testing bench and an agreement with design.",
          },
          {
            titulo: "7. Versioning and breaking changes",
            texto:
              "Semver, a changelog (for example, with Changesets), `peerDependencies` for `react`, an ESM build with types. Before removing something, deprecate it: a development warning, a migration path and, if the change is mechanical, a codemod. Define what the public API is and how long the old one is kept.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Ways to share",
        colunas: ["Form", "How it works", "When it fits", "Cost"],
        linhas: [
          [
            "Shared folder in the app",
            "`src/shared/ui`, imported by the whole app",
            "A single app, a single team",
            "No version or real boundary; any change affects everything at once",
          ],
          [
            "Internal package in a monorepo",
            "A workspace (for example, `packages/ui`) consumed by the repository’s apps",
            "Several apps in the same repository; change the library and consumers in the same PR",
            "Needs monorepo tooling (workspaces, build cache) and dependency rules",
          ],
          [
            "Package published to a registry",
            "Versioned and published to npm, public or private",
            "Consumers outside the repository, independent cycles or open source",
            "Build, versioning, documentation, changelog and a breaking-change policy; consumers decide when to update",
          ],
          [
            "Code copied into the app",
            "The kit hands over the code and each app maintains it (the model of some kits, such as shadcn/ui)",
            "When each app needs to adapt a lot",
            "Each copy drifts; fixes do not propagate on their own",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Native props forwarded and limited variants",
        legenda: "TSX",
        codigo: [
          'import type { ComponentPropsWithoutRef, ReactNode } from "react";',
          "",
          'type ButtonProps = ComponentPropsWithoutRef<"button"> & {',
          '  variant?: "primary" | "secondary";',
          '  size?: "s" | "m";',
          "  icon?: ReactNode;",
          "};",
          "",
          'export function Button({ variant = "primary", size = "m", icon, children, ...rest }: ButtonProps) {',
          "  return (",
          "    <button {...rest} data-variant={variant} data-size={size}>",
          "      {icon}",
          "      {children}",
          "    </button>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`onClick`, `disabled`, `aria-*` and `className` pass through `...rest`; the CSS reads `data-variant` and `data-size` and uses the theme tokens. The library controls the look without hiding what the native element already offers.",
      },
      {
        tipo: "codigo",
        titulo: "Composition instead of one more prop",
        legenda: "TSX",
        codigo: [
          "// Fragile: every new need becomes one more prop",
          '<Card title="Plan" subtitle="Monthly" showFooter buttonText="Subscribe" onButtonClick={subscribe} />',
          "",
          "// Composition: the consumer assembles; the component gives structure, style and accessibility",
          "<Card>",
          "  <Card.Title>Plan</Card.Title>",
          "  <Card.Body>Monthly</Card.Body>",
          "  <Card.Footer>",
          "    <Button onClick={subscribe}>Subscribe</Button>",
          "  </Card.Footer>",
          "</Card>",
        ].join("\n"),
        nota: "With composition, the optional footer stops being a boolean and the button stops being a text prop plus a callback prop: the consumer puts in whatever is needed.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with a **shared folder**; promote it to an **internal package** when a second app needs the same component; **publish to a registry** when the consumers are outside your control. A component is only reusable with a **small, stable API, composition, token-based theming, accessibility and tests**. Before that, copying twice usually costs less than a wrong abstraction.",
      },
    ],
    armadilhas: [
      "Abstracting too early: turning what served one or two screens into a “generic” component with a pile of props and booleans; the wrong API is expensive to change later.",
      "Coupling the library to the app (global CSS, routes, app-specific context, business rules): it stops being reusable.",
      "Bundling `react` inside the library instead of declaring it in `peerDependencies`: two copies of React break hooks and context.",
      "Changing the API with no notice or version: it breaks consumers; use semver, deprecation and a migration guide.",
    ],
    autoteste: [
      {
        pergunta: "Why prefer composition to many boolean props?",
        resposta:
          "Because every new need would add another prop and impossible combinations. With composition, the consumer assembles the parts and the component offers only structure, style and accessibility; the API grows less and changes less.",
      },
      {
        pergunta: "How do you introduce a breaking change to a shared component’s API?",
        resposta:
          "By deprecating before removing: keep the old behavior with a development warning, document the migration (and offer a codemod if it is mechanical), release a major version following semver and only then remove it.",
      },
    ],
  },
};
