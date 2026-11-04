import type { Pergunta } from "../../tipos";

// L83 · Context API ou Redux
export const l083: Pergunta = {
  numero: 83,
  modulo: "linkedin-estado",
  metodo: "compare",
  pt: {
    titulo: "Context API ou Redux",
    pergunta: "Context API versus Redux?",
    porqueEsteMetodo:
      "Context e Redux costumam ser tratados como concorrentes, mas respondem a perguntas diferentes. Lado a lado, em propósito e em escala, fica claro o que cada um faz e quando a diferença importa.",
    resposta30s:
      "O **Context** é um mecanismo de **injeção de dados** na árvore, sem lógica de atualização própria; o **Redux** é um **contêiner de estado previsível**, com actions, reducers, middleware e devtools. O Context basta para dados que mudam pouco e são lidos em muitos lugares; o Redux compensa quando o estado é grande, compartilhado e atualizado com frequência, e a equipe precisa de padrão e rastreabilidade. Eles não se excluem: o `react-redux` usa o Context para entregar a store.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Context API e Redux (com Redux Toolkit)",
        colunas: ["Critério", "Context API", "Redux (com Redux Toolkit)"],
        linhas: [
          [
            "Propósito",
            "Entregar um valor a qualquer descendente, sem passar por props",
            "Guardar o estado da aplicação numa store, com um fluxo de atualização definido",
          ],
          [
            "Lógica de atualização",
            "Nenhuma própria: você usa `useState` ou `useReducer`",
            "Reducers puros disparados por actions (no Toolkit, em slices)",
          ],
          [
            "Seleção e re-renders",
            "Todo consumidor re-renderiza quando o valor muda",
            "O `useSelector` re-renderiza só se o dado selecionado mudar",
          ],
          [
            "Depuração",
            "O React DevTools mostra o valor, sem histórico de mudanças",
            "O Redux DevTools lista as ações, mostra o estado antes e depois e permite time travel",
          ],
          [
            "Middleware e assíncrono",
            "Nada embutido: você escreve o seu",
            "Middleware (thunks, listeners) e RTK Query para dados do servidor",
          ],
          ["Boilerplate", "Pouco", "Mais conceitos e arquivos; o Redux Toolkit reduz bastante"],
          [
            "Testes",
            "Pelos componentes ou hooks, com um provider de teste",
            "Reducers e seletores são funções puras, testáveis sem interface",
          ],
          [
            "Melhor encaixe",
            "Dados que mudam pouco: tema, idioma, usuário",
            "Estado grande, compartilhado, com atualizações frequentes e várias pessoas no código",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Decida pelo **tamanho** e pela **frequência de mudança** do estado. Pouco estado, compartilhado e raramente alterado: Context (ou até só props e composição). Muito estado, mudando com frequência, com lógica complexa e necessidade de rastreabilidade: Redux Toolkit ou outra biblioteca de estado (veja L84). Dado que vem do servidor é um caso à parte: use uma ferramenta de dados.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Não são mutuamente exclusivos",
        texto:
          "O Context é o mecanismo de entrega; o Redux é o que guarda e atualiza. O `Provider` do `react-redux` usa o Context para disponibilizar a store aos componentes, e eles se inscrevem nela por seletores, sem o problema de re-renders do Context puro. Também dá para imitar um Redux pequeno com `useReducer` e Context, mas sem seleção granular nem devtools.",
      },
    ],
    armadilhas: [
      "Dizer que o Context “substitui” o Redux: ele só transporta valores; não oferece reducers, middleware nem devtools.",
      "Usar Redux para todo estado, inclusive o de formulário e o de interface local, ou para o cache de dados do servidor.",
      "Achar que `useReducer` com Context equivale ao Redux: falta a seleção granular e a mesma ferramenta de depuração.",
      "Escolher por moda, e não pelo tamanho e pela frequência de mudança do estado.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a principal diferença entre Context API e Redux?",
        resposta:
          "O Context só entrega um valor pela árvore, e a lógica de atualização é sua. O Redux é um contêiner de estado com fluxo definido (actions e reducers), middleware e devtools, e permite seleção granular.",
      },
      {
        pergunta: "Por que dizer “Context ou Redux” pode ser uma falsa escolha?",
        resposta:
          "Porque o `react-redux` usa o Context para entregar a store, e os dois resolvem partes diferentes do problema: um transporta, o outro gerencia o estado.",
      },
    ],
  },
  en: {
    titulo: "Context API or Redux",
    pergunta: "Context API vs Redux?",
    porqueEsteMetodo:
      "Context and Redux are often treated as competitors, but they answer different questions. Side by side, in purpose and scale, it becomes clear what each one does and when the difference matters.",
    resposta30s:
      "**Context** is a mechanism for **injecting data** into the tree, with no update logic of its own; **Redux** is a **predictable state container** with actions, reducers, middleware and devtools. Context is enough for data that changes rarely and is read in many places; Redux pays off when state is large, shared and updated often, and the team needs a standard and traceability. They are not mutually exclusive: `react-redux` uses Context to deliver the store.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Context API and Redux (with Redux Toolkit)",
        colunas: ["Criterion", "Context API", "Redux (with Redux Toolkit)"],
        linhas: [
          [
            "Purpose",
            "Deliver a value to any descendant without passing props",
            "Keep the application state in a store with a defined update flow",
          ],
          [
            "Update logic",
            "None of its own: you use `useState` or `useReducer`",
            "Pure reducers triggered by actions (in Toolkit, inside slices)",
          ],
          [
            "Selection and re-renders",
            "Every consumer re-renders when the value changes",
            "`useSelector` re-renders only if the selected data changes",
          ],
          [
            "Debugging",
            "React DevTools shows the value, with no change history",
            "Redux DevTools lists actions, shows the state before and after and allows time travel",
          ],
          [
            "Middleware and async",
            "Nothing built in: you write your own",
            "Middleware (thunks, listeners) and RTK Query for server data",
          ],
          ["Boilerplate", "Little", "More concepts and files; Redux Toolkit cuts a lot of it"],
          [
            "Testing",
            "Through components or hooks, with a test provider",
            "Reducers and selectors are pure functions, testable without a UI",
          ],
          [
            "Best fit",
            "Data that rarely changes: theme, language, user",
            "Large, shared state with frequent updates and several people in the code",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Decide by the **size** and the **change frequency** of the state. Little state, shared and rarely changed: Context (or even just props and composition). A lot of state, changing often, with complex logic and a need for traceability: Redux Toolkit or another state library (see L84). Server data is a separate case: use a data tool.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "They are not mutually exclusive",
        texto:
          "Context is the delivery mechanism; Redux is what stores and updates. The `react-redux` `Provider` uses Context to make the store available to components, and they subscribe to it through selectors, without the re-render problem of plain Context. You can also imitate a small Redux with `useReducer` and Context, but without granular selection or devtools.",
      },
    ],
    armadilhas: [
      "Saying Context “replaces” Redux: it only transports values; it offers no reducers, middleware or devtools.",
      "Using Redux for all state, including form and local UI state, or for caching server data.",
      "Thinking `useReducer` with Context equals Redux: it lacks granular selection and the same debugging tooling.",
      "Choosing by fashion rather than by the size and change frequency of the state.",
    ],
    autoteste: [
      {
        pergunta: "What is the main difference between Context API and Redux?",
        resposta:
          "Context only delivers a value through the tree, and the update logic is yours. Redux is a state container with a defined flow (actions and reducers), middleware and devtools, and it allows granular selection.",
      },
      {
        pergunta: "Why can “Context or Redux” be a false choice?",
        resposta:
          "Because `react-redux` uses Context to deliver the store, and the two solve different parts of the problem: one transports, the other manages the state.",
      },
    ],
  },
};
