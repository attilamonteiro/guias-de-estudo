import type { Pergunta } from "../../tipos";

// L87 · O que é um reducer
export const l087: Pergunta = {
  numero: 87,
  modulo: "linkedin-estado",
  metodo: "trace",
  pt: {
    titulo: "O que é um reducer",
    pergunta: "O que é um reducer?",
    porqueEsteMetodo:
      "Reducer, action e middleware só fazem sentido juntos, e a melhor forma de entendê-los é seguir uma action do clique até a tela, incluindo o ponto em que um reducer mal escrito quebra tudo.",
    resposta30s:
      "Um **reducer** é uma **função pura** `(estado, action) => novoEstado`: recebe o estado atual e uma **action** (objeto com `type` e, por convenção, `payload`, que descreve o que aconteceu) e devolve o próximo estado, **sem mutar** o anterior e sem efeitos colaterais. O componente faz `dispatch(action)`, o **middleware** pode interceptá-la (logs, thunks, requisições), o reducer calcula o novo estado, o **store** o guarda e avisa os assinantes, e a interface lê o novo valor.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Do clique à tela",
        etapas: [
          'O usuário clica em “Adicionar ao carrinho” e o componente chama `dispatch(adicionado({ id: 1 }))`, que monta uma **action**: `{ type: "carrinho/adicionado", payload: { id: 1 } }`',
          "A action entra na cadeia de **middleware** do store, em ordem: um logger a registra, o thunk deixa passar (ele só age se receber uma função em vez de um objeto) e cada middleware pode alterar, atrasar, cancelar ou despachar outras actions",
          "Ao fim da cadeia, a action chega ao **reducer**, que recebe o estado atual e a action",
          "O reducer escolhe o ramo pelo `type` e devolve um objeto **novo**; as partes que não mudaram mantêm a mesma referência",
          "O **store** troca o estado atual pelo devolvido e notifica os assinantes (`subscribe`)",
          "Cada seletor assinado (`useSelector`) roda de novo; se o valor selecionado mudou por referência, o componente é agendado para renderizar",
          "A interface mostra o valor novo. Ela só lê o estado; para mudar de novo, precisa despachar outra action",
        ],
        nota: "O fluxo é de mão única: ação → middleware → reducer → store → tela. É isso que torna cada mudança rastreável.",
      },
      {
        tipo: "tabela",
        titulo: "As peças do Redux",
        colunas: ["Peça", "O que é", "Papel no caminho"],
        linhas: [
          [
            "Action",
            'Objeto simples que descreve o que aconteceu, como `{ type: "carrinho/adicionado", payload: { id: 1 } }`; `type` é obrigatório e `payload` é só convenção',
            "É a única forma de pedir uma mudança",
          ],
          [
            "`dispatch`",
            "Função do store que recebe a action",
            "Ponto de entrada: o componente chama `dispatch(action)`",
          ],
          [
            "Middleware",
            "Função no formato `store => next => action => …`, encadeada entre o `dispatch` e o reducer",
            "Registra, altera, atrasa ou cancela actions e dispara o trabalho assíncrono (thunks, requisições)",
          ],
          ["Reducer", "Função pura `(estado, action) => novoEstado`", "Calcula o próximo estado; não faz efeitos"],
          [
            "Store",
            "Objeto que guarda o estado e expõe `getState`, `dispatch` e `subscribe`",
            "Chama o reducer, grava o resultado e avisa os assinantes",
          ],
          ["Seletor", "Função que lê uma parte do estado (`useSelector`)", "Faz a tela reagir só ao que ela usa"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um reducer à mão",
        legenda: "JavaScript",
        codigo: `const inicial = { itens: [] };

function carrinho(estado = inicial, action) {
  switch (action.type) {
    case "carrinho/adicionado":
      return { ...estado, itens: [...estado.itens, action.payload] }; // cópia, não push
    case "carrinho/removido":
      return { ...estado, itens: estado.itens.filter((i) => i.id !== action.payload) };
    default:
      return estado; // action desconhecida: devolva o MESMO estado
  }
}

const depois = carrinho(inicial, { type: "carrinho/adicionado", payload: { id: 1 } });
console.log(depois === inicial); // false: veio um estado novo`,
        nota: "O mesmo contrato vale para o `useReducer` do React. Com o Redux Toolkit você escreve isto de forma mais curta, com Immer (veja L86), mas o reducer continua sendo esta função.",
      },
      {
        tipo: "passos",
        titulo: "Quando o reducer é mal escrito",
        passos: [
          {
            titulo: "Mutação",
            texto:
              "`estado.itens.push(x); return estado;` devolve o mesmo objeto. A comparação por referência conclui que nada mudou, a tela não atualiza e o DevTools perde o histórico. Conserto: devolver cópias (ou usar o Immer do Toolkit).",
          },
          {
            titulo: "Efeito colateral",
            texto:
              "Chamar `fetch`, `Date.now()` ou `Math.random()`, ou gravar em `localStorage`, dentro do reducer torna o resultado imprevisível e impede repetir a sequência de actions. No `useReducer`, o Strict Mode chama o reducer duas vezes em desenvolvimento justamente para expor isso. Conserto: o efeito vai para o middleware, um thunk ou o manipulador de evento, e o resultado (hora, id) viaja no `payload`.",
          },
          {
            titulo: "Action não serializável",
            texto:
              "Funções, instâncias de classe ou promises no `payload` quebram o DevTools, a persistência e a repetição de actions; o Toolkit avisa em desenvolvimento. Conserto: só dados simples (texto, número, objetos e arrays literais).",
          },
          {
            titulo: "Action desconhecida",
            texto:
              "Um `switch` sem `default`, ou cujo `default` devolve `undefined`, apaga o estado quando chega uma action que ele não trata. Conserto: devolver sempre o estado atual.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Os três conceitos e onde mora a impureza",
        texto:
          "**Action** é o que aconteceu, **reducer** é como o estado muda em resposta e **store** é quem guarda o estado, executa o reducer e avisa a interface. O reducer é a parte **pura**; tudo o que não é puro (rede, relógio, logs) fica no **middleware**, antes dele. A interface só lê o estado e só pede mudanças despachando actions.",
      },
    ],
    armadilhas: [
      "Mutar o estado e devolver a mesma referência: o Redux e o React concluem que nada mudou, e a tela não atualiza.",
      "Pôr efeito colateral ou valor não determinístico (`fetch`, `Date.now()`, `Math.random()`) no reducer, em vez de no middleware ou no manipulador de evento.",
      "Despachar actions com funções, instâncias de classe ou promises no `payload`: não serializável, quebra o DevTools e a persistência.",
      "Esquecer o `default` do `switch` (ou devolver `undefined` nele): o estado some quando chega uma action que o reducer não conhece.",
    ],
    autoteste: [
      {
        pergunta: "Por que o reducer não pode chamar `fetch` nem usar `Date.now()`?",
        resposta:
          "Porque precisa ser puro: mesma entrada, mesma saída, sem efeitos. Só assim dá para repetir actions, depurar no tempo e confiar na comparação por referência. O efeito vai para o middleware ou um thunk, e o resultado volta como `payload` de uma action.",
      },
      {
        pergunta: "Qual a diferença entre action, reducer e middleware?",
        resposta:
          "Action descreve o que aconteceu (um objeto). Reducer calcula o novo estado a partir do estado atual e da action (função pura). Middleware fica entre o `dispatch` e o reducer e cuida do que não é puro: logs, thunks, requisições, cancelamento.",
      },
    ],
  },
  en: {
    titulo: "What a reducer is",
    pergunta: "What is a reducer?",
    porqueEsteMetodo:
      "Reducer, action and middleware only make sense together, and the best way to understand them is to follow one action from the click to the screen, including the point where a badly written reducer breaks everything.",
    resposta30s:
      "A **reducer** is a **pure function** `(state, action) => newState`: it takes the current state and an **action** (an object with a `type` and, by convention, a `payload`, describing what happened) and returns the next state, **without mutating** the old one and without side effects. The component calls `dispatch(action)`, **middleware** may intercept it (logs, thunks, requests), the reducer computes the new state, the **store** keeps it and notifies subscribers, and the UI reads the new value.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "From the click to the screen",
        etapas: [
          'The user clicks “Add to cart” and the component calls `dispatch(added({ id: 1 }))`, which builds an **action**: `{ type: "cart/added", payload: { id: 1 } }`',
          "The action enters the store’s **middleware** chain, in order: a logger records it, the thunk lets it through (it only acts when it receives a function instead of an object) and each middleware may change, delay, cancel or dispatch other actions",
          "At the end of the chain the action reaches the **reducer**, which receives the current state and the action",
          "The reducer picks a branch by `type` and returns a **new** object; the parts that did not change keep the same reference",
          "The **store** swaps the current state for the returned one and notifies subscribers (`subscribe`)",
          "Each subscribed selector (`useSelector`) runs again; if the selected value changed by reference, the component is scheduled to render",
          "The UI shows the new value. It only reads state; to change it again, it has to dispatch another action",
        ],
        nota: "The flow is one-way: action → middleware → reducer → store → screen. That is what makes every change traceable.",
      },
      {
        tipo: "tabela",
        titulo: "The pieces of Redux",
        colunas: ["Piece", "What it is", "Role on the path"],
        linhas: [
          [
            "Action",
            'A plain object describing what happened, such as `{ type: "cart/added", payload: { id: 1 } }`; `type` is required and `payload` is only a convention',
            "The only way to ask for a change",
          ],
          [
            "`dispatch`",
            "A store function that receives the action",
            "Entry point: the component calls `dispatch(action)`",
          ],
          [
            "Middleware",
            "A function shaped like `store => next => action => …`, chained between `dispatch` and the reducer",
            "Logs, changes, delays or cancels actions and triggers async work (thunks, requests)",
          ],
          [
            "Reducer",
            "A pure function `(state, action) => newState`",
            "Computes the next state; performs no side effects",
          ],
          [
            "Store",
            "An object that holds the state and exposes `getState`, `dispatch` and `subscribe`",
            "Calls the reducer, saves the result and notifies subscribers",
          ],
          [
            "Selector",
            "A function that reads part of the state (`useSelector`)",
            "Makes the screen react only to what it uses",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A reducer by hand",
        legenda: "JavaScript",
        codigo: `const initial = { items: [] };

function cart(state = initial, action) {
  switch (action.type) {
    case "cart/added":
      return { ...state, items: [...state.items, action.payload] }; // a copy, not push
    case "cart/removed":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    default:
      return state; // unknown action: return the SAME state
  }
}

const after = cart(initial, { type: "cart/added", payload: { id: 1 } });
console.log(after === initial); // false: a new state came back`,
        nota: "The same contract applies to React’s `useReducer`. With Redux Toolkit you write this more briefly, using Immer (see L86), but the reducer is still this function.",
      },
      {
        tipo: "passos",
        titulo: "When the reducer is badly written",
        passos: [
          {
            titulo: "Mutation",
            texto:
              "`state.items.push(x); return state;` returns the same object. Reference comparison concludes nothing changed, the screen does not update and DevTools loses its history. Fix: return copies (or use Toolkit’s Immer).",
          },
          {
            titulo: "Side effect",
            texto:
              "Calling `fetch`, `Date.now()` or `Math.random()`, or writing to `localStorage`, inside the reducer makes the result unpredictable and prevents replaying a sequence of actions. With `useReducer`, Strict Mode calls the reducer twice in development precisely to expose this. Fix: the effect goes to middleware, a thunk or the event handler, and the result (time, id) travels in the `payload`.",
          },
          {
            titulo: "Non-serializable action",
            texto:
              "Functions, class instances or promises in the `payload` break DevTools, persistence and action replay; Toolkit warns in development. Fix: plain data only (text, numbers, literal objects and arrays).",
          },
          {
            titulo: "Unknown action",
            texto:
              "A `switch` with no `default`, or whose `default` returns `undefined`, wipes the state when an action it does not handle arrives. Fix: always return the current state.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The three concepts and where impurity lives",
        texto:
          "**Action** is what happened, **reducer** is how the state changes in response and **store** is what holds the state, runs the reducer and notifies the UI. The reducer is the **pure** part; everything that is not pure (network, clock, logs) goes in **middleware**, before it. The UI only reads state and only asks for changes by dispatching actions.",
      },
    ],
    armadilhas: [
      "Mutating the state and returning the same reference: Redux and React conclude nothing changed, and the screen does not update.",
      "Putting a side effect or a non-deterministic value (`fetch`, `Date.now()`, `Math.random()`) in the reducer instead of in middleware or the event handler.",
      "Dispatching actions with functions, class instances or promises in the `payload`: not serializable, it breaks DevTools and persistence.",
      "Forgetting the `switch` `default` (or returning `undefined` from it): the state vanishes when an action the reducer does not know arrives.",
    ],
    autoteste: [
      {
        pergunta: "Why can a reducer not call `fetch` or use `Date.now()`?",
        resposta:
          "Because it must be pure: same input, same output, no side effects. Only then can you replay actions, debug through time and trust reference comparison. The effect goes to middleware or a thunk, and the result comes back as the `payload` of an action.",
      },
      {
        pergunta: "What is the difference between an action, a reducer and middleware?",
        resposta:
          "An action describes what happened (an object). A reducer computes the new state from the current state and the action (a pure function). Middleware sits between `dispatch` and the reducer and handles what is not pure: logs, thunks, requests, cancellation.",
      },
    ],
  },
};
