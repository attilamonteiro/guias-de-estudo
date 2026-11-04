import type { Pergunta } from "../../tipos";

// L178 · Estruturar um app React grande
export const l178: Pergunta = {
  numero: 178,
  modulo: "linkedin-rotas-e-arquitetura",
  metodo: "design",
  pt: {
    titulo: "Estruturar um app React grande",
    pergunta: "Como você estruturaria uma aplicação React grande?",
    porqueEsteMetodo:
      "Não existe estrutura única correta: a resposta depende do tamanho do time, dos domínios e do ritmo de mudança. Um roteiro de projeto (requisitos, números, decisão central, fronteiras, responsabilidades e evolução) dá o critério, e não uma árvore de pastas decorada.",
    resposta30s:
      "Organize **por funcionalidade (domínio)**, não por tipo de arquivo: cada funcionalidade tem componentes, hooks, acesso a dados, tipos e testes na mesma pasta, e expõe uma **API pública** (`index.ts`). Mantenha `shared` pequeno, `app` só para a montagem e **proteja as fronteiras com regras de importação** que quebram o build. Separe UI, estado e acesso a dados, e só divida em **pacotes de um monorepo** quando houver mais de um app ou times com entregas independentes.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos e restrições",
            texto:
              "Tamanho e número de times, domínios de negócio, quanto código será reaproveitado, ritmo de entrega e o que precisa ser testado e acessível. Critério: a estrutura serve a quem mexe no código todo dia, e não ao diagrama.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Exemplo hipotético: 4 times, 8 domínios e centenas de telas. Se cada mudança toca pastas de camada em todo o app, os times se pisam e a revisão fica enorme. Quanto mais gente, mais a estrutura deve manter a mudança dentro de uma fronteira.",
          },
          {
            titulo: "3. Decisão central: pastas por funcionalidade",
            texto:
              "Cada funcionalidade (pedidos, clientes, faturamento) vive numa pasta com tudo o que precisa. O que é realmente comum (design system, utilitários, cliente de API) vai para `shared`; o que monta o app (providers, roteador) fica em `app` (veja a árvore e a tabela).",
          },
          {
            titulo: "4. Fronteiras: API pública e regras de importação",
            texto:
              "Cada funcionalidade exporta só o necessário por um `index.ts`, e os outros importam por ali, nunca de pastas internas. Regras: `shared` não importa de funcionalidades, uma funcionalidade não importa o interior de outra, `app` importa de todas. Faça o linter ou uma ferramenta de fronteiras reprovar o build quando alguém cruzar.",
          },
          {
            titulo: "5. Responsabilidades dentro da funcionalidade",
            texto:
              "Componentes desenham; hooks ligam estado e dados à tela; um módulo `api` fala com o servidor; o estado do servidor fica numa biblioteca de consulta e o estado de interface fica local ou num store pequeno. Componentes não conhecem URLs nem o formato de transporte.",
          },
          {
            titulo: "6. Qualidade e desempenho",
            texto:
              "TypeScript estrito, testes ao lado do código, lint e formatação automáticos no CI, divisão de código por rota, acessibilidade nos componentes compartilhados e acompanhamento do tamanho do bundle.",
          },
          {
            titulo: "7. Evolução: quando dividir em pacotes",
            texto:
              "Passe a um monorepo com pacotes (por exemplo, `ui`, `config`, um pacote de domínio) quando mais de um app consumir o mesmo código ou quando times precisarem de versões e builds independentes. Antes disso, uma pasta com fronteiras já resolve; extraia quando doer, não por antecipação.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma árvore de pastas por funcionalidade",
        legenda: "Estrutura de pastas",
        codigo: [
          "src/",
          "  app/                  # providers, roteador, layout raiz",
          "  features/",
          "    pedidos/",
          "      components/       # UI exclusiva da funcionalidade",
          "      hooks/            # usePedidos, useCriarPedido",
          "      api.ts            # chamadas ao servidor e tipos de resposta",
          "      index.ts          # API pública: só o que sai daqui pode ser importado",
          "      Pedidos.test.tsx  # testes ao lado do código",
          "    clientes/",
          "    faturamento/",
          "  shared/",
          "    ui/                 # design system: Botao, Modal, sem regra de negócio",
          "    lib/                # utilitários puros e cliente de API",
          "    hooks/              # hooks genéricos, como useDebounce",
        ].join("\n"),
        nota: "É um ponto de partida, não uma lei. Em apps menores, `features` pode ser só `pages` e `components`; o que importa é a fronteira por assunto.",
      },
      {
        tipo: "tabela",
        titulo: "Por camada ou por funcionalidade",
        colunas: ["Critério", "Por camada", "Por funcionalidade"],
        linhas: [
          [
            "Aparência",
            "`components/`, `hooks/`, `services/` e `pages/` na raiz",
            "`features/pedidos/`, `features/clientes/`, cada uma com tudo o que usa",
          ],
          ["Achar o código de uma tarefa", "Espalhado por várias pastas", "Numa pasta só"],
          [
            "Mudar uma funcionalidade",
            "Toca muitas pastas; mais conflitos entre times",
            "Fica dentro de uma fronteira",
          ],
          [
            "Reuso",
            "Tudo parece compartilhável e vira dependência de todos",
            "Exige decidir o que é comum (`shared`); o resto é local",
          ],
          ["Risco", "Pastas gigantes e acoplamento escondido", "Duplicação e fronteiras mal traçadas"],
          ["Quando serve", "Apps pequenos e protótipos", "Apps médios e grandes, com vários times"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma regra que quebra o build",
        legenda: "JavaScript",
        codigo: [
          "// eslint.config.js (trecho): funcionalidades só se falam pelo index",
          "export default [",
          "  {",
          '    files: ["src/features/**/*.{ts,tsx}"],',
          "    rules: {",
          '      "no-restricted-imports": ["error", {',
          '        patterns: [{ group: ["@/features/*/*"], message: "Importe pelo index da funcionalidade." }],',
          "      }],",
          "    },",
          "  },",
          "];",
        ].join("\n"),
        nota: "Dentro da própria funcionalidade, use imports relativos. Existem ferramentas dedicadas a fronteiras, como `eslint-plugin-boundaries`, `dependency-cruiser` e as regras de limites de módulo do Nx. Sem uma regra automática, a fronteira vira sugestão.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Critério, não receita",
        texto:
          "Comece simples (pastas por funcionalidade, `shared` pequeno), deixe o código repetir duas vezes antes de extrair, **proteja as fronteiras com regras automáticas** e reveja a estrutura quando o atrito aparecer: conflitos de merge frequentes, importações cruzadas, dificuldade de integrar pessoas novas. Dois testes práticos: uma pessoa nova acha onde mexer em poucos minutos, e uma mudança numa funcionalidade quase nunca toca outra.",
      },
    ],
    armadilhas: [
      "Deixar `shared` ou `utils` virar depósito: tudo o que “pode ser reaproveitado” vai para lá, vira dependência de todos e ninguém é dono.",
      "Importar de dentro de outra funcionalidade (`features/pedidos/hooks/...`): cria acoplamento invisível; faça uma regra de importação quebrar o build.",
      "Criar camadas demais (mapeadores entre mapeadores, “serviço do serviço”): cada salto custa leitura; só acrescente uma camada quando ela resolver um problema real.",
      "Colocar `index.ts` em todas as pastas: os arquivos de reexportação criam ciclos e deixam ferramentas lentas; use-os apenas como porta pública da funcionalidade.",
    ],
    autoteste: [
      {
        pergunta: "Por que pastas por funcionalidade tendem a escalar melhor do que por camada?",
        resposta:
          "Porque uma mudança de negócio fica dentro de uma fronteira: menos arquivos espalhados, menos conflitos entre times e mais facilidade de achar, testar e, se for preciso, extrair o código de uma funcionalidade.",
      },
      {
        pergunta: "O que é a API pública de uma funcionalidade e como garanti-la?",
        resposta:
          "É o `index.ts` com apenas o que os outros podem usar (componentes de entrada, tipos, hooks). Garante-se com uma regra de lint ou uma ferramenta de fronteiras que reprova importações de pastas internas.",
      },
    ],
  },
  en: {
    titulo: "Structuring a large app",
    pergunta: "How would you structure a large React application?",
    porqueEsteMetodo:
      "There is no single correct structure: the answer depends on team size, domains and pace of change. A design script (requirements, numbers, central decision, boundaries, responsibilities and evolution) gives the criterion rather than a memorized folder tree.",
    resposta30s:
      "Organize **by feature (domain)**, not by file type: each feature keeps components, hooks, data access, types and tests in one folder, and exposes a **public API** (`index.ts`). Keep `shared` small, `app` only for wiring, and **protect the boundaries with import rules** that break the build. Separate UI, state and data access, and only split into **monorepo packages** when there is more than one app or teams with independent releases.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements and constraints",
            texto:
              "Size and number of teams, business domains, how much code will be reused, delivery pace and what must be tested and accessible. Criterion: the structure serves whoever touches the code every day, not the diagram.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Hypothetical example: 4 teams, 8 domains and hundreds of screens. If every change touches layer folders across the whole app, teams step on each other and reviews get huge. The more people, the more the structure should keep a change inside one boundary.",
          },
          {
            titulo: "3. Central decision: folders by feature",
            texto:
              "Each feature (orders, customers, billing) lives in a folder with everything it needs. What is truly common (design system, utilities, API client) goes to `shared`; what wires the app (providers, router) stays in `app` (see the tree and the table).",
          },
          {
            titulo: "4. Boundaries: public API and import rules",
            texto:
              "Each feature exports only what is needed through an `index.ts`, and others import through it, never from internal folders. Rules: `shared` does not import from features, a feature does not import another’s internals, `app` imports from all. Make the linter or a boundaries tool fail the build when someone crosses a line.",
          },
          {
            titulo: "5. Responsibilities inside a feature",
            texto:
              "Components draw; hooks connect state and data to the screen; an `api` module talks to the server; server state lives in a query library and interface state stays local or in a small store. Components do not know URLs or the transport format.",
          },
          {
            titulo: "6. Quality and performance",
            texto:
              "Strict TypeScript, tests next to the code, automatic lint and formatting in CI, code splitting per route, accessibility in the shared components and tracking of the bundle size.",
          },
          {
            titulo: "7. Evolution: when to split into packages",
            texto:
              "Move to a monorepo with packages (for example, `ui`, `config`, a domain package) when more than one app consumes the same code or when teams need independent versions and builds. Before that, a folder with boundaries is enough; extract when it hurts, not in advance.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A folder tree organized by feature",
        legenda: "Folder structure",
        codigo: [
          "src/",
          "  app/                  # providers, router, root layout",
          "  features/",
          "    orders/",
          "      components/       # UI used only by this feature",
          "      hooks/            # useOrders, useCreateOrder",
          "      api.ts            # server calls and response types",
          "      index.ts          # public API: only what leaves here may be imported",
          "      Orders.test.tsx   # tests next to the code",
          "    customers/",
          "    billing/",
          "  shared/",
          "    ui/                 # design system: Button, Modal, no business rules",
          "    lib/                # pure utilities and the API client",
          "    hooks/              # generic hooks, such as useDebounce",
        ].join("\n"),
        nota: "It is a starting point, not a law. In smaller apps, `features` can be just `pages` and `components`; what matters is the boundary by subject.",
      },
      {
        tipo: "tabela",
        titulo: "By layer or by feature",
        colunas: ["Criterion", "By layer", "By feature"],
        linhas: [
          [
            "Looks like",
            "`components/`, `hooks/`, `services/` and `pages/` at the root",
            "`features/orders/`, `features/customers/`, each with everything it uses",
          ],
          ["Finding the code for a task", "Scattered across several folders", "In a single folder"],
          ["Changing a feature", "Touches many folders; more conflicts between teams", "Stays inside one boundary"],
          [
            "Reuse",
            "Everything looks shareable and becomes a dependency of all",
            "Requires deciding what is common (`shared`); the rest is local",
          ],
          ["Risk", "Giant folders and hidden coupling", "Duplication and badly drawn boundaries"],
          ["When it fits", "Small apps and prototypes", "Medium and large apps with several teams"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A rule that breaks the build",
        legenda: "JavaScript",
        codigo: [
          "// eslint.config.js (excerpt): features only talk through the index",
          "export default [",
          "  {",
          '    files: ["src/features/**/*.{ts,tsx}"],',
          "    rules: {",
          '      "no-restricted-imports": ["error", {',
          '        patterns: [{ group: ["@/features/*/*"], message: "Import through the feature index." }],',
          "      }],",
          "    },",
          "  },",
          "];",
        ].join("\n"),
        nota: "Inside a feature itself, use relative imports. There are tools dedicated to boundaries, such as `eslint-plugin-boundaries`, `dependency-cruiser` and Nx’s module boundary rules. Without an automatic rule, the boundary is just a suggestion.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A criterion, not a recipe",
        texto:
          "Start simple (folders by feature, a small `shared`), let code repeat twice before extracting, **protect the boundaries with automatic rules** and revisit the structure when friction shows up: frequent merge conflicts, cross imports, trouble onboarding new people. Two practical tests: a new person finds where to work within minutes, and a change in one feature almost never touches another.",
      },
    ],
    armadilhas: [
      "Letting `shared` or `utils` become a dumping ground: everything that “could be reused” goes there, becomes a dependency of all and nobody owns it.",
      "Importing from inside another feature (`features/orders/hooks/...`): it creates invisible coupling; make an import rule break the build.",
      "Creating too many layers (mappers between mappers, a “service of the service”): every hop costs reading; add a layer only when it solves a real problem.",
      "Putting an `index.ts` in every folder: re-export files create cycles and slow down tooling; use them only as the feature’s public door.",
    ],
    autoteste: [
      {
        pergunta: "Why do folders by feature tend to scale better than by layer?",
        resposta:
          "Because a business change stays inside one boundary: fewer scattered files, fewer conflicts between teams and an easier time finding, testing and, if needed, extracting a feature’s code.",
      },
      {
        pergunta: "What is a feature’s public API and how do you enforce it?",
        resposta:
          "It is the `index.ts` with only what others may use (entry components, types, hooks). You enforce it with a lint rule or a boundaries tool that fails imports from internal folders.",
      },
    ],
  },
};
