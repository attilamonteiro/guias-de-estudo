import type { Pergunta } from "../../tipos";

// L76 · Estado local ou global
export const l076: Pergunta = {
  numero: 76,
  modulo: "linkedin-estado",
  metodo: "compare",
  pt: {
    titulo: "Estado local ou global",
    pergunta: "Estado local versus estado global?",
    porqueEsteMetodo:
      "A pergunta pede uma escolha entre duas opções com custos diferentes. Uma matriz lado a lado e uma regra de decisão respondem melhor do que defender um dos lados.",
    resposta30s:
      "**Estado local** vive num componente (ou numa subárvore, elevado ao ancestral comum) e some quando ele desmonta; **estado global** é compartilhado por partes distantes da árvore e custa mais em acoplamento e em re-renders. A regra é manter o estado **o mais perto possível de quem o usa**, elevá-lo só quando irmãos precisam dele e recorrer a **Context ou a uma biblioteca de estado** quando o compartilhamento é amplo. Estado derivado não se guarda, e dado de servidor tem ferramenta própria.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Local e global lado a lado",
        colunas: ["Critério", "Estado local", "Estado global"],
        linhas: [
          [
            "Onde vive",
            "No componente (`useState`, `useReducer`) ou no ancestral comum de quem o usa",
            "Num Context ou numa store acessível de qualquer ponto da árvore",
          ],
          ["Quem lê", "Um componente e seus descendentes diretos", "Muitos componentes, inclusive distantes entre si"],
          [
            "Exemplos típicos",
            "Texto de um campo, menu aberto, aba selecionada, rascunho",
            "Usuário autenticado, tema, idioma, carrinho, permissões",
          ],
          [
            "Ciclo de vida",
            "Nasce e morre com o componente, o que reinicia sozinho",
            "Sobrevive à navegação e à desmontagem: reset e persistência precisam ser pensados",
          ],
          [
            "Custo",
            "Baixo: fácil de ler, testar e remover",
            "Acoplamento entre telas, mais difícil de rastrear quem altera e re-renders mais amplos",
          ],
          [
            "Re-renders",
            "Só o componente e seus filhos",
            "Depende da ferramenta: no Context, todo consumidor; em stores com seletores, só quem usa a fatia",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Escada de decisão, do mais simples ao mais pesado",
        passos: [
          {
            titulo: "Estado local",
            texto: "Comece com `useState` ou `useReducer` no componente que usa o dado.",
          },
          {
            titulo: "Elevar ao ancestral comum",
            texto:
              "Quando irmãos precisam do mesmo dado, suba o estado ao pai mais próximo e passe por props (lifting state up).",
          },
          {
            titulo: "Composição",
            texto:
              "Se passar por muitos níveis incomoda (veja L79), use `children` e slots ou aproxime o estado antes de globalizar.",
          },
          {
            titulo: "Context",
            texto:
              "Para dado que muitos componentes leem e que muda pouco (tema, idioma, usuário), o Context basta. Veja os limites em L82.",
          },
          {
            titulo: "Biblioteca de estado",
            texto:
              "Quando o compartilhamento é amplo, as atualizações são frequentes ou a lógica é complexa, use Redux Toolkit, Zustand ou similar (veja L83 e L84).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Mantenha o estado **o mais perto possível de quem o usa** e só suba um degrau quando a necessidade aparecer. Antes de globalizar, pergunte: dá para **derivar** isso de outro dado? É dado do **servidor**? Cabe na **URL**? Só uma subárvore o usa? Se a resposta a qualquer uma é sim, não precisa de estado global. Numa aplicação grande é comum combinar: local para a interface, uma ferramenta de dados para o servidor e Context ou store só para o que é realmente compartilhado.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Estado global desnecessário",
        texto:
          "Pôr tudo numa store parece organizado, mas deixa cada tela dependente de um estado distante: mais re-renders, testes que exigem montar a store inteira e dados antigos que sobrevivem à navegação. Não guarde **valores derivados** (calcule), não copie **dados do servidor** para a store (use uma ferramenta de dados, que cuida de cache e revalidação) e prefira a **URL** para filtros, página e aba, que assim ficam compartilháveis e sobrevivem a um recarregamento.",
      },
    ],
    armadilhas: [
      "Começar pelo estado global “para não ter trabalho depois”: o custo de acoplamento chega antes do benefício.",
      "Guardar na store um valor que se calcula a partir de outro (estado derivado): as duas cópias se desencontram.",
      "Copiar a resposta da API para uma store e reimplementar cache e revalidação à mão, em vez de usar uma ferramenta de dados de servidor.",
      "Achar que estado local é “coisa de projeto pequeno”: elevar o estado ao ancestral certo resolve muitos casos sem biblioteca.",
    ],
    autoteste: [
      {
        pergunta: "Dois componentes irmãos precisam do mesmo dado. Qual é o primeiro passo?",
        resposta:
          "Elevar o estado ao pai comum e passar por props (lifting state up). Só se isso virar passagem por muitos níveis, ou envolver partes distantes da árvore, entram o Context ou uma biblioteca.",
      },
      {
        pergunta: "Por que não guardar na store global um valor que dá para calcular a partir de outro?",
        resposta:
          "Porque cria duas fontes da verdade que podem divergir e exige código para sincronizá-las. Calcular a cada render (com `useMemo` só se for caro) mantém uma única fonte.",
      },
    ],
  },
  en: {
    titulo: "Local or global state",
    pergunta: "Local state vs global state?",
    porqueEsteMetodo:
      "The question asks for a choice between two options with different costs. A side-by-side matrix and a decision rule answer it better than defending one side.",
    resposta30s:
      "**Local state** lives in a component (or in a subtree, lifted to the common ancestor) and disappears when it unmounts; **global state** is shared by distant parts of the tree and costs more in coupling and re-renders. The rule is to keep state **as close as possible to whoever uses it**, lift it only when siblings need it and reach for **Context or a state library** when sharing is wide. Derived state is not stored, and server data has its own tools.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Local and global side by side",
        colunas: ["Criterion", "Local state", "Global state"],
        linhas: [
          [
            "Where it lives",
            "In the component (`useState`, `useReducer`) or in the common ancestor of its users",
            "In a Context or a store reachable from anywhere in the tree",
          ],
          ["Who reads it", "One component and its direct descendants", "Many components, including distant ones"],
          [
            "Typical examples",
            "A field’s text, an open menu, the selected tab, a draft",
            "Authenticated user, theme, language, cart, permissions",
          ],
          [
            "Lifecycle",
            "Born and dies with the component, so it resets by itself",
            "Survives navigation and unmounting: reset and persistence need deliberate thought",
          ],
          [
            "Cost",
            "Low: easy to read, test and remove",
            "Coupling between screens, harder to trace who changes it and wider re-renders",
          ],
          [
            "Re-renders",
            "Only the component and its children",
            "Depends on the tool: with Context, every consumer; with stores that use selectors, only users of that slice",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Decision ladder, from simplest to heaviest",
        passos: [
          {
            titulo: "Local state",
            texto: "Start with `useState` or `useReducer` in the component that uses the data.",
          },
          {
            titulo: "Lift to the common ancestor",
            texto:
              "When siblings need the same data, move the state up to the nearest parent and pass it down as props (lifting state up).",
          },
          {
            titulo: "Composition",
            texto:
              "If passing through many levels is annoying (see L79), use `children` and slots or move the state closer before going global.",
          },
          {
            titulo: "Context",
            texto:
              "For data that many components read and that rarely changes (theme, language, user), Context is enough. See its limits in L82.",
          },
          {
            titulo: "State library",
            texto:
              "When sharing is wide, updates are frequent or the logic is complex, use Redux Toolkit, Zustand or similar (see L83 and L84).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Keep state **as close as possible to whoever uses it** and only climb a rung when the need shows up. Before going global, ask: can it be **derived** from other data? Is it **server** data? Does it fit in the **URL**? Does only one subtree use it? If the answer to any of these is yes, you do not need global state. In a large application it is common to combine: local for the interface, a data tool for the server, and Context or a store only for what is truly shared.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Unnecessary global state",
        texto:
          "Putting everything in a store looks organized, but it makes every screen depend on distant state: more re-renders, tests that need the whole store mounted and stale data that survives navigation. Do not store **derived values** (compute them), do not copy **server data** into the store (use a data tool, which handles caching and revalidation) and prefer the **URL** for filters, page and tab, which then become shareable and survive a reload.",
      },
    ],
    armadilhas: [
      "Starting with global state “to avoid work later”: the coupling cost arrives before the benefit.",
      "Storing in the store a value that is computed from another (derived state): the two copies drift apart.",
      "Copying the API response into a store and reimplementing caching and revalidation by hand, instead of using a server-data tool.",
      "Thinking local state is “for small projects”: lifting state to the right ancestor solves many cases without a library.",
    ],
    autoteste: [
      {
        pergunta: "Two sibling components need the same data. What is the first step?",
        resposta:
          "Lift the state to the common parent and pass it down as props (lifting state up). Only if that turns into passing through many levels, or involves distant parts of the tree, do Context or a library come in.",
      },
      {
        pergunta: "Why not store in global state a value you can compute from another?",
        resposta:
          "Because it creates two sources of truth that can diverge and requires code to keep them in sync. Computing it on each render (with `useMemo` only if it is expensive) keeps a single source.",
      },
    ],
  },
};
