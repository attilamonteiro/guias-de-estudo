import type { Pergunta } from "../../tipos";

// S48 · O que é um dispatcher
export const s048: Pergunta = {
  numero: 648,
  modulo: "simplilearn-padroes",
  metodo: "design",
  pt: {
    titulo: "O que é um dispatcher",
    pergunta: "O que é um dispatcher?",
    porqueEsteMetodo:
      "O dispatcher só faz sentido dentro de uma arquitetura. Partir do requisito (dados em um só sentido entre muitas views) e desenhar as peças, na ordem, mostra por que ele existe e o que ele não deve fazer.",
    resposta30s:
      "O **dispatcher** é o **hub central** da arquitetura **Flux**: toda **action** (um objeto que descreve o que aconteceu) passa por ele, que a entrega, uma por vez, a todos os **stores** registrados. Só os stores guardam estado e lógica e as **views** reagem às mudanças, num fluxo em **um só sentido** (view, action, dispatcher, store, view), enquanto o dispatcher não tem regra de negócio. O **Redux** simplifica: um único store, reducers puros e nenhum dispatcher separado (`store.dispatch`).",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisito",
            texto:
              "Muitas views leem e alteram os mesmos dados. Sem regra, uma view chama callbacks de outra, as atualizações se encadeiam e ninguém sabe quem mudou o quê. Queremos dados fluindo em **um só sentido**, com um caminho único e rastreável para qualquer mudança.",
          },
          {
            titulo: "2. Decisão central",
            texto:
              "Toda mudança vira uma **action** (um objeto que descreve o que aconteceu, como `{ tipo: 'ADICIONAR', item }`) e entra por **um único ponto**. As views não alteram dados: pedem a mudança disparando actions, e só os stores mudam o seu estado.",
          },
          {
            titulo: "3. As peças",
            texto:
              "**Actions**, criadas por action creators. **Dispatcher**: o hub central, com `register(callback)` e `dispatch(action)`. **Stores**: guardam o estado e a lógica de atualização, registram um callback no dispatcher e avisam as views quando mudam. **Views**: componentes React que leem dos stores, escutam a mudança e disparam actions.",
          },
          {
            titulo: "4. O contrato do dispatcher",
            texto:
              "`register` guarda o callback de cada store. `dispatch` entrega a action a **todos** os callbacks registrados, **uma action por vez**. `waitFor` deixa um store esperar outro terminar quando um depende do outro. O dispatcher **não tem regra de negócio** nem estado da aplicação: só roteia. Disparar uma action no meio de outra é recusado.",
          },
          {
            titulo: "5. O fluxo de dados",
            texto:
              "View, action, dispatcher, stores, views. Esse laço é o fluxo unidirecional. Como todo estado muda num lugar só, o registro das actions conta a história da aplicação e facilita a depuração.",
          },
          {
            titulo: "6. Trade-offs e o que sobrou hoje",
            texto:
              "Ganha-se previsibilidade e rastreabilidade, e paga-se com cerimônia (actions, creators, registros) e com a coordenação entre vários stores. O Flux é um **padrão**, e a biblioteca original é pouco usada em apps novos: a ideia sobrevive no Redux (veja L85) e em `useReducer`, cujo `dispatch` só empresta o nome.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O caminho de uma action",
        etapas: [
          "O usuário clica em “Adicionar ao carrinho”: a view chama um action creator, que monta `{ tipo: 'ADICIONAR', item }`",
          "O action creator chama `dispatcher.dispatch(action)`",
          "O dispatcher entrega a action a cada callback registrado, na ordem de registro (ou na que o `waitFor` impuser)",
          "Cada store decide, pelo `tipo`, se a action lhe interessa; se sim, atualiza o estado e emite um evento “mudou”",
          "As views ligadas aos stores ouvem o evento, leem o novo estado e renderizam de novo",
          "No caminho que dá errado, um store dispara uma nova action dentro do próprio callback (dispatch no meio de um dispatch) ou uma view altera o store direto: o primeiro caso é recusado e o segundo quebra o fluxo único. Conserto: dispare a nova action depois que o ciclo atual terminar e só mude dados por actions",
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um dispatcher mínimo, com um store",
        legenda: "JavaScript",
        codigo: `// dispatcher: guarda os callbacks e entrega cada action a todos
const callbacks = [];
const dispatcher = {
  register: (cb) => callbacks.push(cb),
  dispatch: (action) => callbacks.forEach((cb) => cb(action)),
};

// store: estado + lógica; só ele muda o estado, ao receber uma action
let itens = [];
const ouvintes = new Set();
dispatcher.register((action) => {
  if (action.tipo === "ADICIONAR") itens = [...itens, action.item];
  ouvintes.forEach((avisar) => avisar()); // as views releem o estado
});

// action creator: chamado pela view, por exemplo num onClick
const adicionar = (item) => dispatcher.dispatch({ tipo: "ADICIONAR", item });
adicionar("pneu");`,
        nota: "Versão didática: a de verdade tem também `waitFor`, tokens de registro e a recusa de dispatch dentro de dispatch. Na view, `useSyncExternalStore` é a forma atual de ouvir um store externo.",
      },
      {
        tipo: "tabela",
        titulo: "Flux e Redux, lado a lado",
        colunas: ["Aspecto", "Flux", "Redux"],
        linhas: [
          [
            "Dispatcher",
            "Um objeto próprio e central, que entrega cada action a todos os stores registrados",
            "Não há dispatcher separado: `store.dispatch(action)` faz esse papel",
          ],
          ["Stores", "Vários, cada um com o seu estado e a sua lógica", "Um único store, com uma árvore de estado"],
          [
            "Lógica de atualização",
            "Dentro dos stores, em callbacks que podem alterar o estado",
            "Em reducers: funções puras `(estado, action) => novoEstado`",
          ],
          [
            "Imutabilidade",
            "Não é imposta",
            "O estado não é alterado no lugar: cada reducer devolve um novo (ferramentas como o Immer ajudam)",
          ],
          [
            "Ordem entre stores",
            "`waitFor` coordena as dependências entre stores",
            "Um reducer raiz combina os reducers, que não dependem uns dos outros",
          ],
          ["Extensão", "Sem mecanismo próprio", "Middleware, para efeitos assíncronos, log e outros"],
          [
            "Depuração",
            "Registrar as actions",
            "Actions mais reducers puros permitem DevTools e reprodução do histórico",
          ],
          ["Natureza", "Padrão de arquitetura, com uma implementação de referência", "Biblioteca inspirada no Flux"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O dispatcher só roteia",
        texto:
          "O dispatcher garante o fluxo em um sentido: recebe uma action e a entrega aos stores, nada mais. Quem guarda dados e decide é o store, e quem mostra é a view. Hoje o Flux é um padrão que se estuda para entender o Redux, o `useReducer` e a ideia de que o estado muda por eventos descritos; a biblioteca Flux original é pouco usada em apps novos.",
      },
    ],
    armadilhas: [
      "Pôr regra de negócio no dispatcher: ele só registra e entrega actions, e a lógica mora nos stores.",
      "Confundir Flux (padrão) com Redux (biblioteca): o Redux se inspira no Flux, mas tem um único store, reducers puros e nenhum dispatcher separado.",
      "Disparar uma action dentro do callback de um store, no meio de um dispatch: o ciclo atual precisa terminar antes. Encadeie depois.",
      "Alterar o store direto pela view: quebra o fluxo em um só sentido e a rastreabilidade que era o objetivo.",
    ],
    autoteste: [
      {
        pergunta: "Qual é o papel do dispatcher, e o que ele não faz?",
        resposta:
          "Registra os stores e entrega cada action a todos eles, uma por vez, na ordem certa (com `waitFor` quando há dependência). Não guarda o estado da aplicação nem decide regra de negócio.",
      },
      {
        pergunta: "Por que o Redux não tem um dispatcher separado?",
        resposta:
          "Porque tem um único store: `store.dispatch` aplica o reducer raiz, que é puro, ao estado. Não há vários stores para coordenar, então não faz falta um hub central nem um `waitFor`.",
      },
    ],
  },
  en: {
    titulo: "What a dispatcher is",
    pergunta: "What is a dispatcher?",
    porqueEsteMetodo:
      "The dispatcher only makes sense inside an architecture. Starting from the requirement (one-way data between many views) and drawing the pieces in order shows why it exists and what it must not do.",
    resposta30s:
      "The **dispatcher** is the **central hub** of the **Flux** architecture: every **action** (an object describing what happened) goes through it, and it hands the action, one at a time, to all registered **stores**. Only stores hold state and logic and **views** react to the changes, in a **one-way** flow (view, action, dispatcher, store, view), while the dispatcher holds no business rules. **Redux** simplifies this: a single store, pure reducers and no separate dispatcher (`store.dispatch`).",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirement",
            texto:
              "Many views read and change the same data. Without a rule, one view calls another’s callbacks, updates chain together and nobody knows who changed what. We want data flowing in **one direction**, with a single, traceable path for any change.",
          },
          {
            titulo: "2. Central decision",
            texto:
              "Every change becomes an **action** (an object describing what happened, such as `{ type: 'ADD', item }`) and enters through **a single point**. Views do not change data: they ask for the change by dispatching actions, and only the stores change their state.",
          },
          {
            titulo: "3. The pieces",
            texto:
              "**Actions**, built by action creators. **Dispatcher**: the central hub, with `register(callback)` and `dispatch(action)`. **Stores**: hold the state and the update logic, register a callback with the dispatcher and notify views when they change. **Views**: React components that read from stores, listen for the change and dispatch actions.",
          },
          {
            titulo: "4. The dispatcher’s contract",
            texto:
              "`register` keeps each store’s callback. `dispatch` hands the action to **all** registered callbacks, **one action at a time**. `waitFor` lets one store wait for another to finish when one depends on the other. The dispatcher has **no business rules** and no application state: it only routes. Dispatching an action in the middle of another is refused.",
          },
          {
            titulo: "5. The data flow",
            texto:
              "View, action, dispatcher, stores, views. That loop is the one-way flow. Since all state changes in one place, the log of actions tells the story of the application and makes debugging easier.",
          },
          {
            titulo: "6. Trade-offs and what is left today",
            texto:
              "You gain predictability and traceability, and you pay with ceremony (actions, creators, registrations) and with coordination between several stores. Flux is a **pattern**, and the original library is rarely used in new apps: the idea survives in Redux (see L85) and in `useReducer`, whose `dispatch` just borrows the name.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The path of an action",
        etapas: [
          "The user clicks “Add to cart”: the view calls an action creator, which builds `{ type: 'ADD', item }`",
          "The action creator calls `dispatcher.dispatch(action)`",
          "The dispatcher hands the action to each registered callback, in registration order (or the order `waitFor` imposes)",
          "Each store decides, by the `type`, whether the action concerns it; if so, it updates its state and emits a “changed” event",
          "The views connected to the stores hear the event, read the new state and render again",
          "On the path that goes wrong, a store dispatches a new action inside its own callback (a dispatch in the middle of a dispatch) or a view changes the store directly: the first is refused and the second breaks the single flow. Fix: dispatch the new action after the current cycle ends and only change data through actions",
        ],
      },
      {
        tipo: "codigo",
        titulo: "A minimal dispatcher, with one store",
        legenda: "JavaScript",
        codigo: `// dispatcher: keeps the callbacks and hands each action to all of them
const callbacks = [];
const dispatcher = {
  register: (cb) => callbacks.push(cb),
  dispatch: (action) => callbacks.forEach((cb) => cb(action)),
};

// store: state + logic; only it changes the state, when it receives an action
let items = [];
const listeners = new Set();
dispatcher.register((action) => {
  if (action.type === "ADD") items = [...items, action.item];
  listeners.forEach((notify) => notify()); // views re-read the state
});

// action creator: called by the view, for example in an onClick
const add = (item) => dispatcher.dispatch({ type: "ADD", item });
add("tire");`,
        nota: "A teaching version: the real one also has `waitFor`, registration tokens and the refusal of a dispatch inside a dispatch. In the view, `useSyncExternalStore` is the current way to listen to an external store.",
      },
      {
        tipo: "tabela",
        titulo: "Flux and Redux, side by side",
        colunas: ["Aspect", "Flux", "Redux"],
        linhas: [
          [
            "Dispatcher",
            "A dedicated, central object that hands each action to all registered stores",
            "There is no separate dispatcher: `store.dispatch(action)` plays that role",
          ],
          ["Stores", "Several, each with its own state and logic", "A single store, with one state tree"],
          [
            "Update logic",
            "Inside the stores, in callbacks that may change the state",
            "In reducers: pure functions `(state, action) => newState`",
          ],
          [
            "Immutability",
            "Not enforced",
            "State is not changed in place: each reducer returns a new one (tools such as Immer help)",
          ],
          [
            "Order between stores",
            "`waitFor` coordinates dependencies between stores",
            "A root reducer combines the reducers, which do not depend on each other",
          ],
          ["Extension", "No mechanism of its own", "Middleware, for async effects, logging and more"],
          ["Debugging", "Log the actions", "Actions plus pure reducers allow DevTools and replaying the history"],
          ["Nature", "An architecture pattern, with a reference implementation", "A library inspired by Flux"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The dispatcher only routes",
        texto:
          "The dispatcher guarantees one-way flow: it receives an action and hands it to the stores, nothing more. The store holds the data and decides; the view displays. Today Flux is a pattern you study to understand Redux, `useReducer` and the idea that state changes through described events; the original Flux library is rarely used in new apps.",
      },
    ],
    armadilhas: [
      "Putting business rules in the dispatcher: it only registers and hands out actions, and the logic lives in the stores.",
      "Confusing Flux (a pattern) with Redux (a library): Redux is inspired by Flux but has a single store, pure reducers and no separate dispatcher.",
      "Dispatching an action inside a store’s callback, in the middle of a dispatch: the current cycle must finish first. Chain it afterwards.",
      "Changing the store directly from the view: it breaks the one-way flow and the traceability that was the goal.",
    ],
    autoteste: [
      {
        pergunta: "What is the dispatcher’s role, and what does it not do?",
        resposta:
          "It registers the stores and hands each action to all of them, one at a time, in the right order (with `waitFor` when there is a dependency). It does not hold the application state or decide business rules.",
      },
      {
        pergunta: "Why does Redux have no separate dispatcher?",
        resposta:
          "Because it has a single store: `store.dispatch` applies the root reducer, which is pure, to the state. There are no several stores to coordinate, so there is no need for a central hub or a `waitFor`.",
      },
    ],
  },
};
