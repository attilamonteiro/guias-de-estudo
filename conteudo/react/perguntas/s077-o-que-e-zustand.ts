import type { Pergunta } from "../../tipos";

// S77 · O que é Zustand
export const s077: Pergunta = {
  numero: 677,
  modulo: "simplilearn-zustand-e-render",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é Zustand",
    pergunta: "O que é o Zustand e por que ele é usado em aplicações React?",
    porqueEsteMetodo:
      "O Zustand parece mágica até você ver como é pequeno o que ele faz. Construir a ideia do zero, uma restrição por vez, mostra por que cada peça existe e quando ela compensa.",
    resposta30s:
      "O **Zustand** é uma biblioteca pequena de **estado global** para React: o store é criado por uma função (`create`) e consumido por um **hook**, sem `Provider`. O estado vive **fora da árvore de componentes** e cada componente assina só o pedaço que lê, por meio de um **seletor**, então só re-renderiza quando esse pedaço muda. Ele é usado para compartilhar estado entre telas distantes com pouco código, sem prop drilling e sem re-renderizar todo mundo a cada mudança.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Do zero ao Zustand, uma restrição por vez",
        passos: [
          {
            titulo: "1. A versão mais simples: um objeto fora do React",
            texto:
              "Um `let estado = { contagem: 0 }` em um módulo, que qualquer componente importa e lê. **O que quebra:** quando o objeto muda, o React não fica sabendo, e a tela continua mostrando o valor antigo.",
          },
          {
            titulo: "2. Uma função para alterar",
            texto:
              "`alterar(parcial)` grava um objeto **novo** (`{ ...estado, ...parcial }`) em vez de mutar o antigo: a referência nova é o sinal de “mudou”. **O que quebra:** ainda ninguém é avisado da mudança.",
          },
          {
            titulo: "3. Uma lista de assinantes",
            texto:
              "`assinar(ouvinte)` guarda a função em um `Set` e devolve outra, que cancela a assinatura; `alterar` chama todos os ouvintes depois de gravar. Já dá para reagir a mudanças, mas ainda fora do React.",
          },
          {
            titulo: "4. Um hook que assina e re-renderiza",
            texto:
              "O hook `useSyncExternalStore(assinar, obter)`, que o React oferece para fontes externas, assina o store, lê o valor atual e re-renderiza o componente quando ele muda. **O que quebra:** todo componente que usa o hook re-renderiza a cada mudança de qualquer campo.",
          },
          {
            titulo: "5. Seletores",
            texto:
              "Em vez de ler o estado inteiro, o componente passa uma função que escolhe o pedaço que interessa (`(s) => s.contagem`). O hook compara o recorte de antes com o de agora e só re-renderiza se ele mudou. **Cuidado:** um seletor que devolve objeto ou array novo a cada chamada parece sempre alterado; escolha campos separados ou use `useShallow`.",
          },
          {
            titulo: "6. Sem Provider, com ações dentro do store",
            texto:
              "Como o store é um módulo, nenhum `Provider` é necessário. As ações (`adicionar`, `limpar`) ficam dentro do estado, e `getState()` e `setState()` funcionam até fora de componentes. **Middlewares** como `persist` (guardar no `localStorage`), `devtools` e `immer` embrulham o `create` para acrescentar persistência, depuração e atualizações com sintaxe mutável. Isso, em essência, é o Zustand: confira a API atual na documentação.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A ideia em cerca de 20 linhas",
        legenda: "TypeScript",
        codigo: [
          'import { useSyncExternalStore } from "react";',
          "",
          "export function criarStore<T extends object>(inicial: T) {",
          "  let estado = inicial;",
          "  const ouvintes = new Set<() => void>();",
          "",
          "  const obter = () => estado;",
          "  const assinar = (ouvinte: () => void) => {",
          "    ouvintes.add(ouvinte);",
          "    return () => ouvintes.delete(ouvinte); // cancela a assinatura",
          "  };",
          "  const alterar = (parcial: Partial<T>) => {",
          '    estado = { ...estado, ...parcial }; // objeto novo = "mudou"',
          "    ouvintes.forEach((avisar) => avisar());",
          "  };",
          "  // o hook: assina, lê o recorte e re-renderiza só se ele mudar",
          "  function useStore<S>(seletor: (e: T) => S) {",
          "    return useSyncExternalStore(assinar, () => seletor(obter()));",
          "  }",
          "  return { useStore, alterar, obter };",
          "}",
        ].join("\n"),
        nota: "O seletor precisa devolver valores estáveis (primitivos ou a mesma referência) para o hook não ver mudança onde não há.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo com o Zustand",
        legenda: "TSX",
        codigo: [
          'import { create } from "zustand";',
          "",
          "interface Carrinho {",
          "  itens: string[];",
          "  adicionar: (item: string) => void;",
          "  limpar: () => void;",
          "}",
          "",
          "export const useCarrinho = create<Carrinho>()((set) => ({",
          "  itens: [],",
          "  adicionar: (item) => set((s) => ({ itens: [...s.itens, item] })),",
          "  limpar: () => set({ itens: [] }),",
          "}));",
          "",
          "function Selo() {",
          "  const total = useCarrinho((s) => s.itens.length); // só re-renderiza se o total mudar",
          "  return <span>{total}</span>;",
          "}",
        ].join("\n"),
        nota: "O `set` mescla o objeto parcial com o estado atual (de forma rasa). Nenhum `Provider` envolve a aplicação.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Zustand, Context e Redux",
        texto:
          "O **Context** leva um valor pela árvore e exige `Provider`; não tem seletor, então todo consumidor re-renderiza quando o valor muda (veja L81 e C18), o que combina com valores que mudam pouco, como tema e usuário. O **Redux** (veja S50) organiza ações, reducers e store num fluxo previsível, com ferramentas de depuração e um ecossistema grande; o Redux Toolkit reduz a cerimônia, mas ainda há mais estrutura que no Zustand. O **Zustand** fica no meio: store fora da árvore, atualização por funções simples, seletores e nenhum `Provider`. Escolha-o quando vários componentes distantes compartilham estado de interface (carrinho, filtros, modal aberto, preferências) e você quer pouco código e renderização controlada.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando o estado local basta",
        texto:
          "Enquanto só um componente e seus vizinhos próximos usam o dado, `useState` e elevar o estado (veja S24) resolvem, sem biblioteca nenhuma. Também não copie para o store dados vindos do servidor, com cache, revalidação e estados de carregamento e erro: uma biblioteca de dados cuida melhor disso (veja L92). E use o store global para o que é de fato compartilhado, não por hábito (veja L95).",
      },
    ],
    armadilhas: [
      "Assinar o store inteiro (`useCarrinho()` sem seletor) ou usar um seletor que devolve objeto novo a cada chamada: o componente re-renderiza sem necessidade, ou até em laço. Selecione campos separados ou use `useShallow`.",
      "Mutar o estado (`estado.itens.push(x)`): a comparação é por referência e a mudança passa despercebida. Crie objetos novos ou use o middleware `immer`.",
      "Pôr tudo no store global por hábito, inclusive o que é local ou vem do servidor: o estado vira difícil de rastrear.",
      "Em renderização no servidor, um store criado no escopo do módulo é compartilhado entre requisições e pode vazar dados de um usuário para outro. Siga o guia de Next.js da documentação do Zustand.",
    ],
    autoteste: [
      {
        pergunta: "Por que um store do Zustand não precisa de Provider?",
        resposta:
          "Porque o estado vive em um módulo, fora da árvore do React: o hook assina esse store diretamente e re-renderiza o componente quando o recorte escolhido muda. O Context precisa do Provider porque o valor viaja pela árvore.",
      },
      {
        pergunta: "Para que serve o seletor em `useCarrinho((s) => s.itens.length)`?",
        resposta:
          "Para assinar só um pedaço do estado: o componente re-renderiza apenas quando esse valor muda, não a cada alteração do store.",
      },
    ],
  },
  en: {
    titulo: "What Zustand is",
    pergunta: "What is Zustand, and why is it used in React applications?",
    porqueEsteMetodo:
      "Zustand feels like magic until you see how small what it does really is. Building the idea from scratch, one constraint at a time, shows why each piece exists and when it pays off.",
    resposta30s:
      "**Zustand** is a small **global state** library for React: the store is created by a function (`create`) and consumed through a **hook**, with no `Provider`. The state lives **outside the component tree** and each component subscribes only to the slice it reads, through a **selector**, so it re-renders only when that slice changes. It is used to share state between distant screens with little code, without prop drilling and without re-rendering everyone on every change.",
    blocos: [
      {
        tipo: "passos",
        titulo: "From zero to Zustand, one constraint at a time",
        passos: [
          {
            titulo: "1. The simplest version: an object outside React",
            texto:
              "A `let state = { count: 0 }` in a module that any component imports and reads. **What breaks:** when the object changes, React does not find out, and the screen keeps showing the old value.",
          },
          {
            titulo: "2. A function to change it",
            texto:
              "`change(partial)` writes a **new** object (`{ ...state, ...partial }`) instead of mutating the old one: the new reference is the “it changed” signal. **What breaks:** nobody is told about the change yet.",
          },
          {
            titulo: "3. A list of subscribers",
            texto:
              "`subscribe(listener)` stores the function in a `Set` and returns another one that cancels the subscription; `change` calls every listener after writing. You can now react to changes, but still outside React.",
          },
          {
            titulo: "4. A hook that subscribes and re-renders",
            texto:
              "The `useSyncExternalStore(subscribe, getSnapshot)` hook, which React provides for external sources, subscribes to the store, reads the current value and re-renders the component when it changes. **What breaks:** every component that uses the hook re-renders on every change to any field.",
          },
          {
            titulo: "5. Selectors",
            texto:
              "Instead of reading the whole state, the component passes a function that picks the slice it cares about (`(s) => s.count`). The hook compares the previous slice with the current one and only re-renders if it changed. **Careful:** a selector that returns a new object or array on every call always looks changed; pick separate fields or use `useShallow`.",
          },
          {
            titulo: "6. No Provider, with actions inside the store",
            texto:
              "Because the store is a module, no `Provider` is needed. Actions (`add`, `clear`) live inside the state, and `getState()` and `setState()` work even outside components. **Middleware** such as `persist` (save to `localStorage`), `devtools` and `immer` wraps `create` to add persistence, debugging and updates with mutable-looking syntax. That, in essence, is Zustand: check the current API in its documentation.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The idea in about 20 lines",
        legenda: "TypeScript",
        codigo: [
          'import { useSyncExternalStore } from "react";',
          "",
          "export function createStore<T extends object>(initial: T) {",
          "  let state = initial;",
          "  const listeners = new Set<() => void>();",
          "",
          "  const get = () => state;",
          "  const subscribe = (listener: () => void) => {",
          "    listeners.add(listener);",
          "    return () => listeners.delete(listener); // cancels the subscription",
          "  };",
          "  const change = (partial: Partial<T>) => {",
          '    state = { ...state, ...partial }; // new object = "it changed"',
          "    listeners.forEach((notify) => notify());",
          "  };",
          "  // the hook: subscribes, reads the slice and re-renders only if it changes",
          "  function useStore<S>(selector: (s: T) => S) {",
          "    return useSyncExternalStore(subscribe, () => selector(get()));",
          "  }",
          "  return { useStore, change, get };",
          "}",
        ].join("\n"),
        nota: "The selector must return stable values (primitives or the same reference) so the hook does not see a change where there is none.",
      },
      {
        tipo: "codigo",
        titulo: "The same thing with Zustand",
        legenda: "TSX",
        codigo: [
          'import { create } from "zustand";',
          "",
          "interface Cart {",
          "  items: string[];",
          "  add: (item: string) => void;",
          "  clear: () => void;",
          "}",
          "",
          "export const useCart = create<Cart>()((set) => ({",
          "  items: [],",
          "  add: (item) => set((s) => ({ items: [...s.items, item] })),",
          "  clear: () => set({ items: [] }),",
          "}));",
          "",
          "function Badge() {",
          "  const total = useCart((s) => s.items.length); // re-renders only if the total changes",
          "  return <span>{total}</span>;",
          "}",
        ].join("\n"),
        nota: "`set` merges the partial object into the current state (shallowly). No `Provider` wraps the application.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Zustand, Context and Redux",
        texto:
          "**Context** carries a value down the tree and needs a `Provider`; it has no selector, so every consumer re-renders when the value changes (see L81 and C18), which suits values that rarely change, such as theme and user. **Redux** (see S50) organizes actions, reducers and a store in a predictable flow, with debugging tools and a large ecosystem; Redux Toolkit trims the ceremony, but there is still more structure than in Zustand. **Zustand** sits in between: a store outside the tree, updates through plain functions, selectors and no `Provider`. Choose it when several distant components share interface state (cart, filters, open modal, preferences) and you want little code and controlled rendering.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When local state is enough",
        texto:
          "While only one component and its close neighbors use the data, `useState` and lifting state up (see S24) solve it, with no library at all. Also do not copy server data into the store, with its caching, revalidation and loading and error states: a data-fetching library handles that better (see L92). And keep the global store for what is truly shared, not out of habit (see L95).",
      },
    ],
    armadilhas: [
      "Subscribing to the whole store (`useCart()` with no selector) or using a selector that returns a new object on every call: the component re-renders needlessly, or even in a loop. Select separate fields or use `useShallow`.",
      "Mutating the state (`state.items.push(x)`): the comparison is by reference, so the change goes unnoticed. Create new objects or use the `immer` middleware.",
      "Putting everything in the global store out of habit, including what is local or comes from the server: the state becomes hard to trace.",
      "In server-side rendering, a store created at module scope is shared between requests and can leak one user’s data to another. Follow the Next.js guide in the Zustand documentation.",
    ],
    autoteste: [
      {
        pergunta: "Why does a Zustand store not need a Provider?",
        resposta:
          "Because the state lives in a module, outside the React tree: the hook subscribes to that store directly and re-renders the component when the chosen slice changes. Context needs a Provider because its value travels down the tree.",
      },
      {
        pergunta: "What is the selector in `useCart((s) => s.items.length)` for?",
        resposta:
          "To subscribe to only a slice of the state: the component re-renders only when that value changes, not on every change to the store.",
      },
    ],
  },
};
