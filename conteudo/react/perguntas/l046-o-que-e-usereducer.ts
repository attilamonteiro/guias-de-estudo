import type { Pergunta } from "../../tipos";

// L46 · O que é useReducer
export const l046: Pergunta = {
  numero: 46,
  modulo: "linkedin-hooks",
  metodo: "compare",
  pt: {
    titulo: "O que é useReducer",
    pergunta: "O que é useReducer()?",
    porqueEsteMetodo:
      "A pergunta de verdade é “quando um e quando o outro”. Uma matriz lado a lado e uma regra de decisão respondem a isso, em vez de tratar o `useReducer` como um `useState` mais complicado.",
    resposta30s:
      "O **`useReducer`** é como o `useState`, mas as transições ficam **centralizadas numa função pura**, o reducer, que recebe `(state, action)` e devolve o novo state. Os componentes só fazem `dispatch({ tipo, ... })`. Compensa quando há **vários subvalores relacionados**, regras de transição ou campos que dependem uns dos outros, e quando se quer testar a lógica sem React. Para valores simples e independentes, `useState` basta. O reducer deve ser **imutável e sem efeitos colaterais**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "useState x useReducer",
        colunas: ["Critério", "`useState`", "`useReducer`"],
        linhas: [
          [
            "Como atualiza",
            "Chama o setter com um valor ou uma função",
            "Chama `dispatch` com uma ação; o reducer calcula o novo state",
          ],
          ["Onde mora a lógica de transição", "Espalhada pelos handlers", "Concentrada numa função fora do componente"],
          [
            "Melhor para",
            "Valores simples e independentes (booleano, texto, contador)",
            "State com várias partes relacionadas e regras de transição",
          ],
          ["Testes", "Passam pelo componente", "O reducer é uma função pura: testa-se sozinha, sem React"],
          ["Quantidade de código", "Pouca", "Maior (tipos de ação, `switch`)"],
          [
            "Passar para filhos ou contexto",
            "Um setter por valor",
            "Um único `dispatch`, que mantém a mesma identidade entre renderizações",
          ],
          ["Depuração", "Vê-se o resultado", "Registrando as ações, vê-se o que aconteceu e em que ordem"],
        ],
        nota: "Os dois guardam state no React e disparam a renderização do mesmo jeito; a diferença está em onde a lógica de atualização mora.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece com `useState`. Passe a `useReducer` quando os handlers repetirem a mesma lógica de atualização, quando um evento mudar vários campos de uma vez, quando o próximo state depender de regras (“só pode avançar se…”) ou quando você quiser testar as transições em separado. Com dois ou três valores independentes, `useReducer` é cerimônia a mais.",
      },
      {
        tipo: "codigo",
        titulo: "Um reducer puro e o dispatch",
        legenda: "JSX",
        codigo: `import { useReducer } from "react";

function reducer(estado, acao) {
  switch (acao.tipo) {
    case "adicionar":
      return { ...estado, itens: [...estado.itens, acao.item] }; // sempre um novo objeto
    case "limpar":
      return { ...estado, itens: [] };
    default:
      throw new Error("Ação desconhecida: " + acao.tipo);
  }
}

export function Carrinho() {
  const [estado, dispatch] = useReducer(reducer, { itens: [], cupom: null });
  return (
    <>
      <button onClick={() => dispatch({ tipo: "adicionar", item: "Café" })}>Adicionar ({estado.itens.length})</button>
      <button onClick={() => dispatch({ tipo: "limpar" })}>Limpar</button>
    </>
  );
}`,
        nota: "O reducer devolve sempre um novo objeto e nunca altera o `estado` recebido. Em desenvolvimento, o Strict Mode chama o reducer duas vezes para conferir que ele é puro.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Inicializador e contexto",
        texto:
          "O terceiro argumento é um **inicializador preguiçoso**: `useReducer(reducer, argumento, init)` chama `init(argumento)` só na primeira renderização, útil para um state inicial caro. Como o `dispatch` tem identidade estável, a combinação `useReducer` + contexto (um contexto para o state e outro para o `dispatch`) é um jeito leve de compartilhar um estado complexo sem biblioteca (veja L45).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pureza, imutabilidade e o Redux",
        texto:
          "O reducer não faz requisição, não mexe em timers e não usa `Math.random()` nem `Date.now()`: o que for impuro entra na ação (por exemplo, o id já gerado) ou fica no handler. Mutar o state e devolver o mesmo objeto faz o `Object.is` enxergar “nada mudou”, e a tela não atualiza. E não confunda com o Redux: o vocabulário (reducer, action, dispatch) é parecido, mas o `useReducer` guarda o state local de um componente, sem store global nem middleware.",
      },
    ],
    armadilhas: [
      "Mutar o state dentro do reducer (`estado.itens.push(...)`) e devolvê-lo: o React vê o mesmo objeto e não atualiza.",
      "Fazer requisição, gerar aleatórios ou ler a hora dentro do reducer: ele precisa ser puro (e o Strict Mode o chama duas vezes).",
      "Usar `useReducer` para um único booleano ou contador: mais código sem ganho.",
      "Deixar o `default` do `switch` engolir ações desconhecidas: um erro de digitação no tipo da ação vira um bug mudo.",
    ],
    autoteste: [
      {
        pergunta: "Qual a assinatura de um reducer e o que ele deve garantir?",
        resposta:
          "`(estado, acao) => novoEstado`. Deve ser puro (mesma entrada, mesma saída, sem efeitos colaterais) e imutável: nunca altera o estado recebido, devolve um novo objeto.",
      },
      {
        pergunta: "Por que o `dispatch` ajuda a compartilhar estado por contexto?",
        resposta:
          "Porque o `dispatch` tem identidade estável entre renderizações, então pode ir num contexto sem fazer os leitores renderizarem à toa; os componentes só descrevem o que aconteceu (a ação) e o reducer decide como o state muda.",
      },
    ],
  },
  en: {
    titulo: "What useReducer is",
    pergunta: "What is useReducer()?",
    porqueEsteMetodo:
      "The real question is “when one and when the other”. A side-by-side matrix and a decision rule answer it, instead of treating `useReducer` as a more complicated `useState`.",
    resposta30s:
      "**`useReducer`** is like `useState`, but the transitions are **centralized in a pure function**, the reducer, which takes `(state, action)` and returns the new state. Components just call `dispatch({ type, ... })`. It pays off with **several related sub-values**, transition rules or fields that depend on each other, and when you want to test the logic without React. For simple, independent values, `useState` is enough. The reducer must be **immutable and free of side effects**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "useState vs useReducer",
        colunas: ["Criterion", "`useState`", "`useReducer`"],
        linhas: [
          [
            "How it updates",
            "Calls the setter with a value or a function",
            "Calls `dispatch` with an action; the reducer computes the new state",
          ],
          [
            "Where the transition logic lives",
            "Spread across the handlers",
            "Concentrated in a function outside the component",
          ],
          [
            "Best for",
            "Simple, independent values (a boolean, text, a counter)",
            "State with several related parts and transition rules",
          ],
          [
            "Testing",
            "Goes through the component",
            "The reducer is a pure function: it can be tested alone, without React",
          ],
          ["Amount of code", "Little", "More (action types, `switch`)"],
          [
            "Passing to children or context",
            "One setter per value",
            "A single `dispatch`, which keeps the same identity across renders",
          ],
          ["Debugging", "You see the result", "By logging actions, you see what happened and in what order"],
        ],
        nota: "Both store state in React and trigger rendering the same way; the difference is where the update logic lives.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with `useState`. Move to `useReducer` when handlers repeat the same update logic, when one event changes several fields at once, when the next state depends on rules (“can only advance if…”) or when you want to test the transitions separately. With two or three independent values, `useReducer` is extra ceremony.",
      },
      {
        tipo: "codigo",
        titulo: "A pure reducer and dispatch",
        legenda: "JSX",
        codigo: `import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, items: [...state.items, action.item] }; // always a new object
    case "clear":
      return { ...state, items: [] };
    default:
      throw new Error("Unknown action: " + action.type);
  }
}

export function Cart() {
  const [state, dispatch] = useReducer(reducer, { items: [], coupon: null });
  return (
    <>
      <button onClick={() => dispatch({ type: "add", item: "Coffee" })}>Add ({state.items.length})</button>
      <button onClick={() => dispatch({ type: "clear" })}>Clear</button>
    </>
  );
}`,
        nota: "The reducer always returns a new object and never changes the `state` it receives. In development, Strict Mode calls the reducer twice to check that it is pure.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Initializer and context",
        texto:
          "The third argument is a **lazy initializer**: `useReducer(reducer, argument, init)` calls `init(argument)` only on the first render, useful for an expensive initial state. Since `dispatch` has a stable identity, combining `useReducer` with context (one context for the state and another for `dispatch`) is a lightweight way to share complex state without a library (see L45).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Purity, immutability and Redux",
        texto:
          "The reducer makes no requests, touches no timers and uses neither `Math.random()` nor `Date.now()`: anything impure goes into the action (for example, the id already generated) or stays in the handler. Mutating the state and returning the same object makes `Object.is` see “nothing changed”, and the screen does not update. And do not confuse it with Redux: the vocabulary (reducer, action, dispatch) is similar, but `useReducer` holds a component’s local state, with no global store or middleware.",
      },
    ],
    armadilhas: [
      "Mutating state inside the reducer (`state.items.push(...)`) and returning it: React sees the same object and does not update.",
      "Making requests, generating random values or reading the time inside the reducer: it must be pure (and Strict Mode calls it twice).",
      "Using `useReducer` for a single boolean or counter: more code with no gain.",
      "Letting the `switch` `default` swallow unknown actions: a typo in the action type becomes a silent bug.",
    ],
    autoteste: [
      {
        pergunta: "What is a reducer’s signature and what must it guarantee?",
        resposta:
          "`(state, action) => newState`. It must be pure (same input, same output, no side effects) and immutable: it never changes the state it receives and returns a new object.",
      },
      {
        pergunta: "Why does `dispatch` help share state through context?",
        resposta:
          "Because `dispatch` has a stable identity across renders, so it can go into a context without making readers re-render needlessly; components just describe what happened (the action) and the reducer decides how the state changes.",
      },
    ],
  },
};
