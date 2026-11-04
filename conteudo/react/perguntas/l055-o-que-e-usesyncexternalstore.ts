import type { Pergunta } from "../../tipos";

// L55 · O que é useSyncExternalStore
export const l055: Pergunta = {
  numero: 55,
  modulo: "linkedin-hooks",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é useSyncExternalStore",
    pergunta: "O que é useSyncExternalStore()?",
    porqueEsteMetodo:
      "A assinatura de três funções parece arbitrária até você tentar ler um store externo com o que já conhece e ver cada versão falhar. Partir do mais simples e consertar uma falha por vez mostra por que o Hook existe e por que exige snapshots estáveis.",
    resposta30s:
      "`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` lê um **store externo ao React** e re-renderiza quando ele muda. `subscribe` avisa das mudanças, `getSnapshot` devolve de forma síncrona e **estável** o valor atual, e `getServerSnapshot` cobre a renderização no servidor e a hidratação. Existe para evitar **tearing** na renderização concorrente, e quem o usa são sobretudo autores de bibliotecas de estado.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Ler dados que **moram fora do React** e mudam por conta própria: uma variável de módulo, uma store de Redux ou Zustand, `navigator.onLine`, `window.matchMedia`. A tela tem de refletir o valor atual e atualizar quando ele mudar.",
          },
          {
            titulo: "1. A versão mais simples: ler no render",
            texto:
              "Chamar `store.valor` direto no corpo do componente. → Quebra: ninguém avisa o React de que o valor mudou, então a tela fica velha até outro motivo a renderizar.",
          },
          {
            titulo: "2. Inscrever-se: `useState` e `useEffect`",
            texto:
              "O store ganha `subscribe(ouvinte)`; o componente se inscreve num efeito e chama `setState` a cada aviso. Funciona em apps simples. → Quebra: (a) a inscrição só acontece depois do commit, e o valor pode mudar entre a renderização e o efeito; (b) o valor fica duplicado no state; (c) na renderização concorrente, que pode ser interrompida e retomada, o store pode mudar **no meio** e partes da mesma tela passam a ler valores diferentes. Esse defeito se chama **tearing**.",
          },
          {
            titulo: "3. Ler uma foto síncrona: `getSnapshot`",
            texto:
              "O React chama `getSnapshot()` durante a renderização, guarda o valor, o compara com `Object.is` e, se o store mudar durante a renderização, refaz o trabalho de forma síncrona, para toda a árvore enxergar a mesma foto. Daí a assinatura: `useSyncExternalStore(subscribe, getSnapshot)`.",
          },
          {
            titulo: "4. O snapshot precisa ser estável",
            texto:
              "O React chama `getSnapshot` várias vezes e só aceita que o valor não mudou se ele devolver **o mesmo valor** enquanto o store não mudar. → Quebra: devolver um objeto ou array novo a cada chamada (`{ ...estado }`, `.filter()`) faz o React achar que tudo mudou e entrar em laço de renderizações. Conserto: guarde um snapshot imutável no store e troque-o só quando algo mudar. Pelo mesmo motivo, `subscribe` deve ter identidade estável (definida fora do componente), senão o React se reinscreve a cada renderização.",
          },
          {
            titulo: "5. O servidor: `getServerSnapshot`",
            texto:
              "No servidor não existe `window` nem store do navegador. O terceiro argumento devolve o valor usado na renderização do servidor e na hidratação, e deve ser igual dos dois lados. Sem ele, a renderização do servidor gera erro; com valores diferentes, há erro de hidratação.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um store mínimo, escrito do zero",
        legenda: "TypeScript",
        codigo: `let contagem = 0;
const ouvintes = new Set<() => void>();

export const store = {
  subscribe(ouvinte: () => void) {
    ouvintes.add(ouvinte);
    return () => {
      ouvintes.delete(ouvinte); // cancela a inscrição
    };
  },
  getSnapshot: () => contagem, // mesmo valor enquanto nada mudar
  incrementar() {
    contagem += 1; // valor novo = foto nova
    ouvintes.forEach((ouvinte) => ouvinte()); // avisa o React
  },
};`,
      },
      {
        tipo: "codigo",
        titulo: "Lendo o store no componente",
        legenda: "TSX",
        codigo: `import { useSyncExternalStore } from "react";
import { store } from "./store";

export function Contador() {
  // O terceiro argumento é o valor usado no servidor e na hidratação.
  const total = useSyncExternalStore(store.subscribe, store.getSnapshot, () => 0);
  return <button onClick={store.incrementar}>{total}</button>;
}`,
        nota: "Exemplo didático: bibliotecas reais acrescentam seletores e estado imutável mais elaborado. Dois componentes que chamam o Hook com o mesmo store mostram o mesmo `total` na mesma renderização, mesmo que ela seja interrompida.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Para ler uma fonte **fora do React** que muda por conta própria, use `useSyncExternalStore`: `subscribe` avisa, `getSnapshot` devolve uma foto **estável e síncrona**, `getServerSnapshot` cobre o servidor. Para estado do próprio React, use `useState`, `useReducer` ou contexto. Quem escreve o store costuma ser autor de biblioteca de estado; na aplicação, use a biblioteca.",
      },
    ],
    armadilhas: [
      "Devolver um objeto ou array novo em `getSnapshot` a cada chamada: o React acha que tudo mudou e entra em laço de renderizações.",
      "Criar `subscribe` dentro do componente: a identidade muda a cada renderização e o React cancela e refaz a inscrição toda vez.",
      "Mutar o objeto do store no lugar, sem trocar a referência, ou mudar o valor sem avisar os ouvintes: o React não percebe a mudança.",
      "Esquecer `getServerSnapshot` na renderização no servidor, ou devolver nele um valor diferente do que o cliente lê na hidratação.",
    ],
    autoteste: [
      {
        pergunta: "O que é tearing e como o `useSyncExternalStore` o evita?",
        resposta:
          "Tearing é partes da mesma tela lerem valores diferentes do store porque ele mudou no meio de uma renderização interrompível. O Hook lê uma foto síncrona e, se o store mudar durante a renderização, refaz o trabalho de forma síncrona, para toda a árvore ver o mesmo valor.",
      },
      {
        pergunta: "Por que `useState` com `useEffect` não basta?",
        resposta:
          "Porque a inscrição só acontece depois do commit (mudanças nesse intervalo podem se perder), o valor fica duplicado no state, o resultado pode sofrer tearing na renderização concorrente e não há `getServerSnapshot` para o servidor.",
      },
    ],
  },
  en: {
    titulo: "What useSyncExternalStore is",
    pergunta: "What is useSyncExternalStore()?",
    porqueEsteMetodo:
      "The three-function signature looks arbitrary until you try to read an external store with what you already know and watch each version fail. Starting from the simplest and fixing one flaw at a time shows why the Hook exists and why it demands stable snapshots.",
    resposta30s:
      "`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` reads a **store outside React** and re-renders when it changes. `subscribe` signals changes, `getSnapshot` synchronously returns the current value in a **stable** way, and `getServerSnapshot` covers server rendering and hydration. It exists to prevent **tearing** in concurrent rendering, and its users are mostly authors of state libraries.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What we want",
            texto:
              "To read data that **lives outside React** and changes on its own: a module variable, a Redux or Zustand store, `navigator.onLine`, `window.matchMedia`. The screen must reflect the current value and update when it changes.",
          },
          {
            titulo: "1. The simplest version: read during render",
            texto:
              "Call `store.value` straight in the component body. → Breaks: nobody tells React the value changed, so the screen stays stale until something else renders it.",
          },
          {
            titulo: "2. Subscribe: `useState` and `useEffect`",
            texto:
              "The store gets `subscribe(listener)`; the component subscribes in an effect and calls `setState` on every notification. It works in simple apps. → Breaks: (a) the subscription only happens after the commit, and the value can change between the render and the effect; (b) the value is duplicated in state; (c) in concurrent rendering, which can be interrupted and resumed, the store may change **midway** and parts of the same screen end up reading different values. This flaw is called **tearing**.",
          },
          {
            titulo: "3. Read a synchronous snapshot: `getSnapshot`",
            texto:
              "React calls `getSnapshot()` during rendering, keeps the value, compares it with `Object.is` and, if the store changes during rendering, redoes the work synchronously so the whole tree sees the same snapshot. Hence the signature: `useSyncExternalStore(subscribe, getSnapshot)`.",
          },
          {
            titulo: "4. The snapshot must be stable",
            texto:
              "React calls `getSnapshot` several times and only accepts that the value did not change if it returns **the same value** while the store has not changed. → Breaks: returning a new object or array on every call (`{ ...state }`, `.filter()`) makes React think everything changed and fall into a render loop. Fix: keep an immutable snapshot in the store and replace it only when something changes. For the same reason, `subscribe` must have a stable identity (defined outside the component), or React resubscribes on every render.",
          },
          {
            titulo: "5. The server: `getServerSnapshot`",
            texto:
              "On the server there is no `window` and no browser store. The third argument returns the value used in server rendering and hydration, and it must be equal on both sides. Without it, server rendering throws an error; with different values, there is a hydration error.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A minimal store, written from scratch",
        legenda: "TypeScript",
        codigo: `let count = 0;
const listeners = new Set<() => void>();

export const store = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener); // unsubscribes
    };
  },
  getSnapshot: () => count, // same value while nothing changes
  increment() {
    count += 1; // new value = new snapshot
    listeners.forEach((listener) => listener()); // notifies React
  },
};`,
      },
      {
        tipo: "codigo",
        titulo: "Reading the store in a component",
        legenda: "TSX",
        codigo: `import { useSyncExternalStore } from "react";
import { store } from "./store";

export function Counter() {
  // The third argument is the value used on the server and during hydration.
  const total = useSyncExternalStore(store.subscribe, store.getSnapshot, () => 0);
  return <button onClick={store.increment}>{total}</button>;
}`,
        nota: "A teaching example: real libraries add selectors and more elaborate immutable state. Two components calling the Hook with the same store show the same `total` in the same render, even if it is interrupted.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "To read a source **outside React** that changes on its own, use `useSyncExternalStore`: `subscribe` signals, `getSnapshot` returns a **stable, synchronous** snapshot, `getServerSnapshot` covers the server. For React’s own state, use `useState`, `useReducer` or context. Whoever writes the store is usually a state-library author; in an application, use the library.",
      },
    ],
    armadilhas: [
      "Returning a new object or array from `getSnapshot` on every call: React thinks everything changed and falls into a render loop.",
      "Creating `subscribe` inside the component: its identity changes on every render and React unsubscribes and resubscribes every time.",
      "Mutating the store’s object in place without replacing the reference, or changing the value without notifying the listeners: React does not notice the change.",
      "Forgetting `getServerSnapshot` in server rendering, or returning a value in it that differs from what the client reads at hydration.",
    ],
    autoteste: [
      {
        pergunta: "What is tearing and how does `useSyncExternalStore` prevent it?",
        resposta:
          "Tearing is parts of the same screen reading different values from the store because it changed midway through an interruptible render. The Hook reads a synchronous snapshot and, if the store changes during rendering, redoes the work synchronously so the whole tree sees the same value.",
      },
      {
        pergunta: "Why is `useState` with `useEffect` not enough?",
        resposta:
          "Because the subscription only happens after the commit (changes in that gap can be lost), the value is duplicated in state, the result can tear in concurrent rendering, and there is no `getServerSnapshot` for the server.",
      },
    ],
  },
};
