import type { Pergunta } from "../../tipos";

// L86 · O que é Redux Toolkit
export const l086: Pergunta = {
  numero: 86,
  modulo: "linkedin-estado",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é Redux Toolkit",
    pergunta: "O que é o Redux Toolkit?",
    porqueEsteMetodo:
      "O Toolkit parece só um conjunto de atalhos até você ver de onde vem cada um. Partir das restrições do Redux e dos incômodos que elas geram mostra por que cada peça existe.",
    resposta30s:
      "O **Redux Toolkit (RTK)** é a forma oficialmente recomendada de escrever Redux: mantém o modelo (store único, estado imutável, reducers puros), mas tira o boilerplate com `configureStore`, `createSlice` (reducers e actions juntos, com **Immer**, que deixa você escrever “mutando” e produz estado imutável) e `createAsyncThunk`. Inclui ainda o **RTK Query** para dados de servidor. Por baixo continua sendo Redux.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo a ideia, uma restrição por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Um lugar previsível para o estado compartilhado por muitas telas, em que toda mudança possa ser rastreada: quem mudou, quando e por quê.",
          },
          {
            titulo: "1. A versão mais simples: um objeto global",
            texto:
              "Um objeto fora dos componentes, que qualquer um altera. → Quebra: ninguém sabe quem mudou o quê, o React não é avisado de que precisa redesenhar e os bugs ficam impossíveis de reproduzir.",
          },
          {
            titulo: "2. Restrição: store único e mudanças só por actions",
            texto:
              "O estado fica num **store** e só muda quando alguém despacha uma **action**, um objeto que descreve o que aconteceu; um **reducer** calcula o próximo estado (veja L87). → Resolve: histórico de mudanças, DevTools e depuração por repetição. → Incômodo: muito código para cada mudança.",
          },
          {
            titulo: "3. Restrição: reducers puros e estado imutável",
            texto:
              "O reducer não altera o estado antigo, devolve um novo, o que permite detectar mudança por referência e repetir qualquer sequência de actions. → Incômodo: copiar estruturas aninhadas à mão (`{ ...state, usuario: { ...state.usuario, nome } }`) é verboso e fácil de errar.",
          },
          {
            titulo: "4. O boilerplate acumulado",
            texto:
              "Constantes de tipo, funções que criam actions, `switch` no reducer, junção de reducers, configuração do store com middleware e DevTools. → O Toolkit entra aqui: `configureStore` monta o store com bons padrões (DevTools, thunk e, em desenvolvimento, verificações contra mutação e valores não serializáveis); `createSlice` gera action creators e reducer a partir de um objeto de reducers; e dentro deles o **Immer** deixa escrever como se mutasse, produzindo um estado novo por baixo.",
          },
          {
            titulo: "5. Lógica assíncrona e dados de servidor",
            texto:
              "`createAsyncThunk` padroniza o ciclo de uma chamada assíncrona em actions `pending`, `fulfilled` e `rejected`. Para buscar e guardar em cache dados de API, o **RTK Query** (`createApi`) gera os hooks, mantém o cache e invalida por tags, em vez de você reescrever tudo isso em thunks (veja L91).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um slice completo",
        legenda: "JavaScript",
        codigo: `import { configureStore, createSlice } from "@reduxjs/toolkit";

const carrinho = createSlice({
  name: "carrinho",
  initialState: { itens: [] },
  reducers: {
    adicionado(state, action) {
      state.itens.push(action.payload); // "mutação" segura: o Immer cuida da cópia
    },
    removido(state, action) {
      state.itens = state.itens.filter((item) => item.id !== action.payload);
    },
  },
});

export const { adicionado, removido } = carrinho.actions;
export const store = configureStore({ reducer: { carrinho: carrinho.reducer } });

store.dispatch(adicionado({ id: 1, nome: "Teclado" }));
console.log(store.getState().carrinho.itens); // [{ id: 1, nome: "Teclado" }]`,
        nota: "`state.itens.push(...)` parece mutação, mas só se comporta assim dentro dos reducers do `createSlice`: o Immer entrega um rascunho e transforma as alterações num estado novo. O resto (store, actions, `dispatch`) é Redux comum.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Em uma frase",
        texto:
          "O Redux Toolkit **é** Redux, escrito do jeito que a própria equipe do Redux recomenda: mesmo store, mesmas actions e reducers puros, com menos código e menos erros. Vale para estado **compartilhado e complexo** (muitas telas, regras, histórico de mudanças). Para estado local use `useState` ou `useReducer`, e para dados de servidor prefira o RTK Query ou o TanStack Query (veja L91).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O Immer tem regras",
        texto:
          "Escrever “mutando” só vale **dentro** dos reducers do `createSlice` (e do `createReducer`). Fora deles, um `push` num array do estado é mutação de verdade e quebra a detecção de mudança. Dentro de um reducer, ou você altera o rascunho **ou** devolve um valor novo, nunca os dois. Mantenha também estado e actions **serializáveis** (sem funções, instâncias de classe ou promises): em desenvolvimento o Toolkit avisa quando isso acontece.",
      },
    ],
    armadilhas: [
      "Achar que o Toolkit é outra biblioteca de estado, concorrente do Redux: é a forma oficial de usá-lo, e store, actions e reducers continuam valendo.",
      "Mutar o estado fora do Immer (num componente, num seletor, num middleware) ou alterar o rascunho e ainda devolver outro valor no mesmo reducer.",
      "Pôr tudo no Redux, inclusive estado local de formulário e dados de servidor: use `useState` para o que é local e RTK Query ou TanStack Query para o que vem da API.",
      "Guardar no estado ou nas actions o que não é serializável (funções, instâncias de classe, promises): quebra DevTools, persistência e repetição de actions.",
    ],
    autoteste: [
      {
        pergunta: "O que o Immer permite dentro de um `createSlice`, e por que isso não viola a imutabilidade?",
        resposta:
          "Escrever o reducer como se alterasse o estado (`state.itens.push(...)`). O Immer entrega um rascunho, registra as alterações e produz um objeto novo, deixando o original intacto e preservando as referências do que não mudou.",
      },
      {
        pergunta: "O que o Redux Toolkit resolve que o Redux “puro” não resolvia bem?",
        resposta:
          "O boilerplate e os erros comuns: `configureStore` com bons padrões, `createSlice` gerando actions e reducer juntos, Immer para atualizações imutáveis, `createAsyncThunk` para o assíncrono e RTK Query para dados de servidor.",
      },
    ],
  },
  en: {
    titulo: "What Redux Toolkit is",
    pergunta: "What is Redux Toolkit?",
    porqueEsteMetodo:
      "Toolkit looks like a bag of shortcuts until you see where each one comes from. Starting from Redux’s constraints and the pain they cause shows why every piece exists.",
    resposta30s:
      "**Redux Toolkit (RTK)** is the officially recommended way to write Redux: it keeps the model (a single store, immutable state, pure reducers) but removes the boilerplate with `configureStore`, `createSlice` (reducers and actions together, with **Immer**, which lets you write “mutating” code that produces immutable state) and `createAsyncThunk`. It also ships **RTK Query** for server data. Underneath, it is still Redux.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building the idea, one constraint at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "A predictable place for state shared by many screens, where every change can be traced: who changed it, when and why.",
          },
          {
            titulo: "1. The simplest version: a global object",
            texto:
              "An object outside the components that anyone can change. → Breaks: nobody knows who changed what, React is not told it must redraw, and bugs become impossible to reproduce.",
          },
          {
            titulo: "2. Constraint: a single store and changes only through actions",
            texto:
              "State lives in one **store** and only changes when someone dispatches an **action**, an object describing what happened; a **reducer** computes the next state (see L87). → Fixes: change history, DevTools and replay debugging. → Pain: a lot of code for every change.",
          },
          {
            titulo: "3. Constraint: pure reducers and immutable state",
            texto:
              "The reducer does not modify the old state, it returns a new one, which lets you detect change by reference and replay any sequence of actions. → Pain: copying nested structures by hand (`{ ...state, user: { ...state.user, name } }`) is verbose and easy to get wrong.",
          },
          {
            titulo: "4. The accumulated boilerplate",
            texto:
              "Type constants, functions that create actions, a `switch` in the reducer, combining reducers, configuring the store with middleware and DevTools. → This is where Toolkit steps in: `configureStore` builds the store with good defaults (DevTools, thunk and, in development, checks against mutation and non-serializable values); `createSlice` generates action creators and the reducer from an object of reducers; and inside them **Immer** lets you write as if you were mutating, producing a new state underneath.",
          },
          {
            titulo: "5. Async logic and server data",
            texto:
              "`createAsyncThunk` standardizes the life cycle of an async call into `pending`, `fulfilled` and `rejected` actions. For fetching and caching API data, **RTK Query** (`createApi`) generates the hooks, keeps the cache and invalidates by tags, instead of you rewriting all that in thunks (see L91).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A complete slice",
        legenda: "JavaScript",
        codigo: `import { configureStore, createSlice } from "@reduxjs/toolkit";

const cart = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    added(state, action) {
      state.items.push(action.payload); // safe "mutation": Immer takes care of the copy
    },
    removed(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { added, removed } = cart.actions;
export const store = configureStore({ reducer: { cart: cart.reducer } });

store.dispatch(added({ id: 1, name: "Keyboard" }));
console.log(store.getState().cart.items); // [{ id: 1, name: "Keyboard" }]`,
        nota: "`state.items.push(...)` looks like mutation, but it only behaves that way inside `createSlice` reducers: Immer hands you a draft and turns your changes into a new state. The rest (store, actions, `dispatch`) is plain Redux.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "In one sentence",
        texto:
          "Redux Toolkit **is** Redux, written the way the Redux team itself recommends: same store, same actions and pure reducers, with less code and fewer mistakes. It fits **shared, complex** state (many screens, rules, a change history). For local state use `useState` or `useReducer`, and for server data prefer RTK Query or TanStack Query (see L91).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Immer has rules",
        texto:
          "Writing “mutating” code only works **inside** `createSlice` (and `createReducer`) reducers. Outside them, a `push` on an array in the state is a real mutation and breaks change detection. Inside a reducer, you either change the draft **or** return a new value, never both. Keep state and actions **serializable** too (no functions, class instances or promises): in development Toolkit warns when that happens.",
      },
    ],
    armadilhas: [
      "Thinking Toolkit is another state library competing with Redux: it is the official way to use it, and store, actions and reducers still apply.",
      "Mutating state outside Immer (in a component, a selector, a middleware), or changing the draft and also returning another value in the same reducer.",
      "Putting everything in Redux, including local form state and server data: use `useState` for what is local and RTK Query or TanStack Query for what comes from the API.",
      "Storing non-serializable things (functions, class instances, promises) in state or actions: it breaks DevTools, persistence and action replay.",
    ],
    autoteste: [
      {
        pergunta: "What does Immer allow inside a `createSlice`, and why does it not break immutability?",
        resposta:
          "Writing the reducer as if it modified the state (`state.items.push(...)`). Immer gives you a draft, records the changes and produces a new object, leaving the original untouched and keeping the references of whatever did not change.",
      },
      {
        pergunta: "What does Redux Toolkit solve that “plain” Redux did not handle well?",
        resposta:
          "The boilerplate and the common mistakes: `configureStore` with good defaults, `createSlice` generating actions and reducer together, Immer for immutable updates, `createAsyncThunk` for async logic and RTK Query for server data.",
      },
    ],
  },
};
