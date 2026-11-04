import type { Pergunta } from "../../tipos";

// L84 · Redux ou Zustand
export const l084: Pergunta = {
  numero: 84,
  modulo: "linkedin-estado",
  metodo: "compare",
  pt: {
    titulo: "Redux ou Zustand",
    pergunta: "Redux versus Zustand?",
    porqueEsteMetodo:
      "Redux e Zustand resolvem o mesmo problema com filosofias opostas: disciplina imposta de um lado, liberdade leve do outro. Uma matriz critério a critério e uma regra de decisão evitam um debate de gosto.",
    resposta30s:
      "Os dois guardam estado global fora da árvore de componentes e permitem seleção por seletor. O **Redux (com Redux Toolkit)** impõe um fluxo definido (store única, actions, reducers), com devtools, middleware e um grande ecossistema, ao preço de mais conceitos e código; o **Zustand** é uma store pequena, com um hook e pouca cerimônia, mas a organização fica por sua conta. Projetos grandes, com times que precisam de padrão e rastreabilidade, tendem ao Redux; estado simples e leve tende ao Zustand.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Redux Toolkit e Zustand, critério a critério",
        colunas: ["Critério", "Redux (Redux Toolkit)", "Zustand"],
        linhas: [
          [
            "Modelo da store",
            "Uma store única; o estado é atualizado por reducers a partir de actions",
            "Stores criadas com `create`, com estado e ações juntos; pode haver várias",
          ],
          [
            "Quantidade de código",
            "Maior: slice, store, `Provider`, hooks",
            "Pequena: um hook criado com `create`, sem `Provider` obrigatório",
          ],
          [
            "Convenções e disciplina",
            "Fortes: fluxo unidirecional, reducers puros, estrutura previsível",
            "Poucas: a organização e as regras ficam por sua conta",
          ],
          [
            "Devtools e middleware",
            "Redux DevTools, middleware maduro e ferramentas associadas (RTK Query, listeners)",
            "Middlewares oficiais (devtools, persist, immer), em menor número",
          ],
          [
            "Seleção e re-renders",
            "`useSelector`, com comparação do valor selecionado",
            "Hook com seletor (`useStore((s) => s.x)`); selecionar a store inteira re-renderiza a cada mudança",
          ],
          ["Curva de aprendizado", "Mais conceitos para dominar", "Pequena: quase só funções e um hook"],
          ["Ecossistema", "Muito material, padrões e ferramentas", "Mais enxuto, com menos convenções prontas"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O mesmo contador com Redux Toolkit",
        legenda: "JSX",
        codigo: [
          'import { configureStore, createSlice } from "@reduxjs/toolkit";',
          'import { Provider, useDispatch, useSelector } from "react-redux";',
          "",
          "const contador = createSlice({",
          '  name: "contador",',
          "  initialState: { valor: 0 },",
          "  reducers: {",
          "    incrementar(estado) {",
          "      estado.valor += 1; // Immer: parece mutação, produz estado novo",
          "    },",
          "  },",
          "});",
          "const store = configureStore({ reducer: { contador: contador.reducer } });",
          "",
          "function Botao() {",
          "  const valor = useSelector((estado) => estado.contador.valor);",
          "  const dispatch = useDispatch();",
          "  return <button onClick={() => dispatch(contador.actions.incrementar())}>{valor}</button>;",
          "}",
          "// Na raiz: <Provider store={store}><Botao /></Provider>",
        ].join("\n"),
      },
      {
        tipo: "codigo",
        titulo: "E com Zustand",
        legenda: "JSX",
        codigo: [
          'import { create } from "zustand";',
          "",
          "const useContador = create((set) => ({",
          "  valor: 0,",
          "  incrementar: () => set((estado) => ({ valor: estado.valor + 1 })),",
          "}));",
          "",
          "function Botao() {",
          "  const valor = useContador((estado) => estado.valor);",
          "  const incrementar = useContador((estado) => estado.incrementar);",
          "  return <button onClick={incrementar}>{valor}</button>;",
          "}",
          "// Sem Provider: o próprio hook é a store",
        ].join("\n"),
        nota: "Confira a documentação oficial de cada biblioteca: as APIs evoluem, e a forma de tipar a store em TypeScript muda um pouco.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pela **escala da equipe e pela necessidade de rastreabilidade**. Muitas pessoas no mesmo código, muitas telas dependendo do estado e vontade de ver cada mudança como uma ação registrada: Redux Toolkit. Estado compartilhado simples, protótipos e apps pequenos ou médios em que a cerimônia atrapalha: Zustand. Os dois servem a projetos de qualquer tamanho; o que muda é a disciplina que cada um impõe.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Evite escolher por números",
        texto:
          "Não decida por boatos de desempenho ou de popularidade: os dois têm seletores e re-renders controlados, e o gargalo real costuma estar em como você seleciona e organiza o estado. Dado de servidor (cache, revalidação) pertence a uma ferramenta de dados (TanStack Query, RTK Query), não à store global.",
      },
    ],
    armadilhas: [
      "Escolher Redux “porque é o padrão” sem precisar de rastreabilidade, ou Zustand “porque é simples” e deixar o time sem convenção nenhuma.",
      "No Zustand, ler a store inteira (`useStore()`) em vez de uma fatia: o componente re-renderiza a cada mudança.",
      "Escrever Redux “à mão”, sem o Redux Toolkit: o boilerplate antigo é o que deu má fama ao Redux.",
      "Colocar na store global dados de servidor que uma ferramenta de dados cuidaria melhor.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença de modelo entre Redux e Zustand?",
        resposta:
          "O Redux centraliza o estado numa store única, atualizada por reducers a partir de actions, com um fluxo imposto. No Zustand você cria stores pequenas com `create`, e as ações são funções que chamam `set`, sem fluxo imposto.",
      },
      {
        pergunta: "Quando você preferiria Redux a Zustand?",
        resposta:
          "Quando o projeto é grande, a equipe precisa de convenções e a rastreabilidade (devtools, cada mudança como ação) importa. Para estado simples e leve, o Zustand costuma bastar.",
      },
    ],
  },
  en: {
    titulo: "Redux or Zustand",
    pergunta: "Redux vs Zustand?",
    porqueEsteMetodo:
      "Redux and Zustand solve the same problem with opposite philosophies: imposed discipline on one side, light freedom on the other. A criterion-by-criterion matrix and a decision rule avoid a debate of taste.",
    resposta30s:
      "Both keep global state outside the component tree and allow selection through selectors. **Redux (with Redux Toolkit)** imposes a defined flow (single store, actions, reducers), with devtools, middleware and a large ecosystem, at the price of more concepts and code; **Zustand** is a small store with one hook and little ceremony, but the organization is up to you. Large projects with teams that need a standard and traceability tend toward Redux; simple, light state tends toward Zustand.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Redux Toolkit and Zustand, criterion by criterion",
        colunas: ["Criterion", "Redux (Redux Toolkit)", "Zustand"],
        linhas: [
          [
            "Store model",
            "A single store; state is updated by reducers from actions",
            "Stores created with `create`, holding state and actions together; there can be several",
          ],
          [
            "Amount of code",
            "Larger: slice, store, `Provider`, hooks",
            "Small: one hook created with `create`, no required `Provider`",
          ],
          [
            "Conventions and discipline",
            "Strong: unidirectional flow, pure reducers, predictable structure",
            "Few: organization and rules are up to you",
          ],
          [
            "Devtools and middleware",
            "Redux DevTools, mature middleware and related tools (RTK Query, listeners)",
            "Official middlewares (devtools, persist, immer), fewer in number",
          ],
          [
            "Selection and re-renders",
            "`useSelector`, comparing the selected value",
            "A hook with a selector (`useStore((s) => s.x)`); selecting the whole store re-renders on every change",
          ],
          ["Learning curve", "More concepts to master", "Small: mostly functions and a hook"],
          ["Ecosystem", "A lot of material, patterns and tools", "Leaner, with fewer ready-made conventions"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same counter with Redux Toolkit",
        legenda: "JSX",
        codigo: [
          'import { configureStore, createSlice } from "@reduxjs/toolkit";',
          'import { Provider, useDispatch, useSelector } from "react-redux";',
          "",
          "const counter = createSlice({",
          '  name: "counter",',
          "  initialState: { value: 0 },",
          "  reducers: {",
          "    increment(state) {",
          "      state.value += 1; // Immer: looks like mutation, produces new state",
          "    },",
          "  },",
          "});",
          "const store = configureStore({ reducer: { counter: counter.reducer } });",
          "",
          "function Button() {",
          "  const value = useSelector((state) => state.counter.value);",
          "  const dispatch = useDispatch();",
          "  return <button onClick={() => dispatch(counter.actions.increment())}>{value}</button>;",
          "}",
          "// At the root: <Provider store={store}><Button /></Provider>",
        ].join("\n"),
      },
      {
        tipo: "codigo",
        titulo: "And with Zustand",
        legenda: "JSX",
        codigo: [
          'import { create } from "zustand";',
          "",
          "const useCounter = create((set) => ({",
          "  value: 0,",
          "  increment: () => set((state) => ({ value: state.value + 1 })),",
          "}));",
          "",
          "function Button() {",
          "  const value = useCounter((state) => state.value);",
          "  const increment = useCounter((state) => state.increment);",
          "  return <button onClick={increment}>{value}</button>;",
          "}",
          "// No Provider: the hook itself is the store",
        ].join("\n"),
        nota: "Check each library’s official documentation: APIs evolve, and the way you type the store in TypeScript changes a little.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by **team scale and need for traceability**. Many people in the same code, many screens depending on the state and a wish to see every change as a recorded action: Redux Toolkit. Simple shared state, prototypes and small or medium apps where ceremony gets in the way: Zustand. Both serve projects of any size; what changes is the discipline each one imposes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Avoid choosing by numbers",
        texto:
          "Do not decide on rumors about performance or popularity: both have selectors and controlled re-renders, and the real bottleneck is usually how you select and organize the state. Server data (caching, revalidation) belongs in a data tool (TanStack Query, RTK Query), not in the global store.",
      },
    ],
    armadilhas: [
      "Choosing Redux “because it is the standard” without needing traceability, or Zustand “because it is simple” and leaving the team with no convention at all.",
      "In Zustand, reading the whole store (`useStore()`) instead of a slice: the component re-renders on every change.",
      "Writing Redux “by hand”, without Redux Toolkit: the old boilerplate is what gave Redux a bad reputation.",
      "Putting server data in the global store when a data tool would handle it better.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference in model between Redux and Zustand?",
        resposta:
          "Redux centralizes state in a single store, updated by reducers from actions, with an imposed flow. In Zustand you create small stores with `create`, and actions are functions that call `set`, with no imposed flow.",
      },
      {
        pergunta: "When would you prefer Redux over Zustand?",
        resposta:
          "When the project is large, the team needs conventions and traceability (devtools, every change as an action) matters. For simple, light state, Zustand is usually enough.",
      },
    ],
  },
};
