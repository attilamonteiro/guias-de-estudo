import type { Pergunta } from "../../tipos";

// L41 · O que são Hooks
export const l041: Pergunta = {
  numero: 41,
  modulo: "linkedin-hooks",
  metodo: "whys",
  pt: {
    titulo: "O que são Hooks",
    pergunta: "O que são Hooks?",
    porqueEsteMetodo:
      "“O que são Hooks” só se responde de verdade quando se entende o que faltava antes deles. A cadeia de por quês parte dos componentes de função sem state e chega à ideia que organiza todo o conjunto: ligar lógica a recursos do React sem precisar de classes.",
    resposta30s:
      "**Hooks** são funções (por convenção, `useAlgo`) que dão a **componentes de função** acesso a recursos do React: **state** (`useState`), **efeitos** (`useEffect`), contexto, refs, memoização e outros. Surgiram para resolver o reuso de lógica com estado (que exigia HOCs e render props), classes grandes com ciclos de vida misturados e a confusão com `this`. Com eles, a lógica relacionada fica junta e pode ser extraída em **hooks personalizados**, mas eles não dispensam entender a renderização.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "O que é, de fato, um Hook?",
            resposta:
              "Uma função especial do React, chamada dentro de um componente de função (ou de outro Hook), que “pendura” nele um recurso: o React guarda o state, os efeitos e as refs daquele componente e os devolve a cada renderização, identificando cada um pela **ordem das chamadas**. Por isso existem as regras dos Hooks: chamar só no nível superior, nunca em condições ou laços (veja L62 e L63).",
          },
          {
            pergunta: "Por que foram criados?",
            resposta:
              "Porque os componentes de função eram só apresentação: sem state e sem ciclo de vida. Quem precisava de state tinha de reescrever tudo como **classe**, com construtor, `this` e métodos ligados. Os Hooks dão aos componentes de função os mesmos recursos, e a classe deixa de ser obrigatória.",
          },
          {
            pergunta: "Por que reaproveitar lógica com estado era difícil?",
            resposta:
              "As saídas eram os **HOCs** (componentes de ordem superior) e as **render props**: ambos embrulham o componente em outros, aumentam a árvore (o “wrapper hell”), escondem de onde vêm as props e dificultam a leitura. Um **hook personalizado** é só uma função: você extrai a lógica, chama onde precisar, e cada chamada tem o seu próprio state, sem mexer na hierarquia de componentes.",
          },
          {
            pergunta: "Por que classes grandes eram um problema?",
            resposta:
              "Os métodos de ciclo de vida se organizavam por **momento**, não por assunto: o `componentDidMount` misturava busca de dados, ouvintes e timers sem relação entre si, enquanto um único assunto (assinar e cancelar) ficava partido entre `componentDidMount` e `componentWillUnmount`. Com Hooks, organiza-se por assunto: um efeito cuida de uma sincronização e da sua limpeza.",
          },
          {
            pergunta: "E o `this`?",
            resposta:
              "Em classes, o valor de `this` depende de quem chama a função, o que exigia `bind` ou arrow functions e causava bugs. Nas funções não há `this`: cada renderização tem as suas próprias variáveis (closures), o que é mais previsível, ao custo de um modelo mental novo: valores capturados (stale closures) e dependências de efeitos.",
          },
        ],
        causaRaiz:
          "Faltava um jeito de **ligar lógica com estado a componentes** sem classes e sem embrulhar componentes em componentes. Os Hooks resolvem isso com funções que o React associa ao componente pela ordem das chamadas, o que permite agrupar a lógica por assunto e reutilizá-la.",
      },
      {
        tipo: "tabela",
        titulo: "Panorama dos principais Hooks",
        colunas: ["Hook", "Para que serve", "Quando usar"],
        linhas: [
          [
            "`useState`",
            "Guarda um valor; mudá-lo dispara uma nova renderização",
            "Dados da interface: campo de texto, aba aberta, contador (veja L43)",
          ],
          [
            "`useReducer`",
            "Como o `useState`, com as transições centralizadas numa função pura",
            "State com várias partes e regras de transição (veja L46)",
          ],
          [
            "`useEffect`",
            "Sincroniza o componente com algo fora do React, depois de renderizar",
            "Rede, timers, assinaturas, bibliotecas externas (veja L44)",
          ],
          [
            "`useLayoutEffect`",
            "Como o `useEffect`, mas antes de o navegador pintar",
            "Medir o DOM e ajustar o layout sem piscar",
          ],
          ["`useContext`", "Lê o valor de um contexto", "Tema, usuário, idioma (veja L45)"],
          [
            "`useRef`",
            "Guarda um valor mutável que não dispara renderização, ou um nó do DOM",
            "Foco, medidas, id de um timer",
          ],
          [
            "`useMemo` e `useCallback`",
            "Memorizam um valor calculado ou uma função entre renderizações",
            "Otimização medida: cálculo caro ou identidade estável para filhos memoizados",
          ],
          [
            "`useTransition` e `useDeferredValue`",
            "Marcam uma atualização como adiável",
            "Manter a interface responsiva durante renderizações pesadas (veja L39)",
          ],
          [
            "Hook personalizado (`useAlgo`)",
            "Função sua que combina outros Hooks",
            "Reaproveitar lógica com estado entre componentes",
          ],
        ],
        nota: "O conjunto cresce e muda ao longo das versões (por exemplo, hooks e APIs ligados a Actions e a dados assíncronos). Confira a referência atual em react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Um hook personalizado: assinar e limpar no mesmo lugar",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function useLarguraDaJanela() {
  const [largura, setLargura] = useState(window.innerWidth);
  useEffect(() => {
    const aoRedimensionar = () => setLargura(window.innerWidth);
    window.addEventListener("resize", aoRedimensionar);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }, []);
  return largura;
}

export function Cabecalho() {
  const largura = useLarguraDaJanela();
  return <h1>{largura < 600 ? "Menu" : "Menu completo"}</h1>;
}`,
        nota: "Assinar e cancelar ficam lado a lado, e qualquer componente reaproveita o hook, cada um com o seu state. Em renderização no servidor, `window` não existe: nesse caso use `useSyncExternalStore` ou leia o valor dentro de um efeito.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "As regras dos Hooks",
        texto:
          "Chame Hooks só no **nível superior** de componentes de função ou de outros Hooks, sempre na mesma ordem: nunca dentro de `if`, laços ou funções comuns. O React identifica cada Hook pela ordem das chamadas; mudá-la entre renderizações embaralha o state. O plugin de lint `eslint-plugin-react-hooks` verifica isso.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Hooks não dispensam entender a renderização",
        texto:
          "Closures capturam os valores de cada renderização, efeitos têm dependências e o state é um instantâneo: os bugs mais comuns com Hooks vêm daí. As classes continuam funcionando e não precisam ser migradas; algumas coisas, como os Error Boundaries, ainda são escritas como classes. Confira react.dev para o estado atual da API.",
      },
    ],
    armadilhas: [
      "Dizer que os Hooks “acabaram” com as classes: elas continuam funcionando e não precisam ser migradas.",
      "Chamar Hooks dentro de condições, laços ou funções comuns: quebra a ordem das chamadas e o state se embaralha.",
      "Achar que um hook personalizado compartilha state entre os componentes que o usam: cada chamada cria o seu próprio state; para compartilhar, use contexto ou uma store.",
      "Usar `useMemo` e `useCallback` em tudo: são otimizações com custo, e não substituem estruturar bem os componentes.",
    ],
    autoteste: [
      {
        pergunta: "Que problema os Hooks resolveram em relação a HOCs e render props?",
        resposta:
          "O reuso de lógica com estado sem embrulhar componentes: um hook personalizado é uma função que você chama, sem aumentar a árvore nem esconder de onde vêm as props.",
      },
      {
        pergunta: "Por que Hooks não podem ser chamados dentro de um `if`?",
        resposta:
          "O React identifica cada Hook pela ordem das chamadas na renderização. Se uma chamada some ou muda de lugar entre renderizações, o React associa o state ao Hook errado.",
      },
    ],
  },
  en: {
    titulo: "What Hooks are",
    pergunta: "What are Hooks?",
    porqueEsteMetodo:
      "“What are Hooks” is only really answered once you understand what was missing before them. The chain of whys starts from function components with no state and reaches the idea that organizes the whole set: tying logic to React features without needing classes.",
    resposta30s:
      "**Hooks** are functions (by convention, `useSomething`) that give **function components** access to React features: **state** (`useState`), **effects** (`useEffect`), context, refs, memoization and more. They arose to solve reuse of stateful logic (which needed HOCs and render props), large classes with mixed lifecycle methods, and the confusion around `this`. With them, related logic stays together and can be extracted into **custom hooks**, but they do not remove the need to understand rendering.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "What exactly is a Hook?",
            resposta:
              "A special React function, called inside a function component (or another Hook), that “hangs” a feature on it: React stores that component’s state, effects and refs and hands them back on each render, identifying each one by the **order of the calls**. That is why the rules of Hooks exist: call them only at the top level, never in conditions or loops (see L62 and L63).",
          },
          {
            pergunta: "Why were they created?",
            resposta:
              "Because function components were presentation only: no state and no lifecycle. Anyone who needed state had to rewrite everything as a **class**, with a constructor, `this` and bound methods. Hooks give function components the same features, and classes stop being mandatory.",
          },
          {
            pergunta: "Why was reusing stateful logic hard?",
            resposta:
              "The options were **HOCs** (higher-order components) and **render props**: both wrap the component in others, make the tree deeper (“wrapper hell”), hide where the props come from and hurt readability. A **custom hook** is just a function: you extract the logic, call it wherever you need, and each call has its own state, without touching the component hierarchy.",
          },
          {
            pergunta: "Why were large classes a problem?",
            resposta:
              "Lifecycle methods were organized by **moment**, not by concern: `componentDidMount` mixed data fetching, listeners and timers that had nothing to do with each other, while a single concern (subscribe and unsubscribe) was split between `componentDidMount` and `componentWillUnmount`. With Hooks you organize by concern: one effect handles one synchronization and its cleanup.",
          },
          {
            pergunta: "And what about `this`?",
            resposta:
              "In classes, the value of `this` depends on who calls the function, which required `bind` or arrow functions and caused bugs. Functions have no `this`: each render has its own variables (closures), which is more predictable, at the price of a new mental model: captured values (stale closures) and effect dependencies.",
          },
        ],
        causaRaiz:
          "There was no way to **attach stateful logic to components** without classes and without wrapping components in components. Hooks solve this with functions that React ties to the component by the order of the calls, which lets you group logic by concern and reuse it.",
      },
      {
        tipo: "tabela",
        titulo: "An overview of the main Hooks",
        colunas: ["Hook", "What it is for", "When to use it"],
        linhas: [
          [
            "`useState`",
            "Stores a value; changing it triggers a new render",
            "UI data: a text field, an open tab, a counter (see L43)",
          ],
          [
            "`useReducer`",
            "Like `useState`, with transitions centralized in a pure function",
            "State with several parts and transition rules (see L46)",
          ],
          [
            "`useEffect`",
            "Synchronizes the component with something outside React, after rendering",
            "Network, timers, subscriptions, external libraries (see L44)",
          ],
          [
            "`useLayoutEffect`",
            "Like `useEffect`, but before the browser paints",
            "Measuring the DOM and adjusting layout without flicker",
          ],
          ["`useContext`", "Reads a context value", "Theme, user, language (see L45)"],
          [
            "`useRef`",
            "Stores a mutable value that does not trigger a render, or a DOM node",
            "Focus, measurements, a timer id",
          ],
          [
            "`useMemo` and `useCallback`",
            "Memoize a computed value or a function across renders",
            "Measured optimization: an expensive computation or a stable identity for memoized children",
          ],
          [
            "`useTransition` and `useDeferredValue`",
            "Mark an update as deferrable",
            "Keeping the UI responsive during heavy renders (see L39)",
          ],
          [
            "Custom hook (`useSomething`)",
            "Your own function that combines other Hooks",
            "Reusing stateful logic across components",
          ],
        ],
        nota: "The set grows and changes across versions (for example, hooks and APIs tied to Actions and async data). Check the current reference at react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "A custom hook: subscribe and clean up in the same place",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

export function Header() {
  const width = useWindowWidth();
  return <h1>{width < 600 ? "Menu" : "Full menu"}</h1>;
}`,
        nota: "Subscribing and unsubscribing sit side by side, and any component can reuse the hook, each with its own state. In server rendering, `window` does not exist: in that case use `useSyncExternalStore` or read the value inside an effect.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rules of Hooks",
        texto:
          "Call Hooks only at the **top level** of function components or other Hooks, always in the same order: never inside `if`, loops or regular functions. React identifies each Hook by the order of the calls; changing it between renders scrambles the state. The `eslint-plugin-react-hooks` lint plugin checks this.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Hooks do not replace understanding rendering",
        texto:
          "Closures capture the values of each render, effects have dependencies and state is a snapshot: the most common bugs with Hooks come from there. Classes still work and do not need to be migrated; some things, like Error Boundaries, are still written as classes. Check react.dev for the current state of the API.",
      },
    ],
    armadilhas: [
      "Saying Hooks “killed” classes: they still work and do not need to be migrated.",
      "Calling Hooks inside conditions, loops or regular functions: it breaks the order of the calls and state gets scrambled.",
      "Thinking a custom hook shares state between the components that use it: each call creates its own state; to share, use context or a store.",
      "Using `useMemo` and `useCallback` on everything: they are optimizations with a cost, and they do not replace structuring components well.",
    ],
    autoteste: [
      {
        pergunta: "What problem did Hooks solve compared with HOCs and render props?",
        resposta:
          "Reusing stateful logic without wrapping components: a custom hook is a function you call, without making the tree deeper or hiding where the props come from.",
      },
      {
        pergunta: "Why can Hooks not be called inside an `if`?",
        resposta:
          "React identifies each Hook by the order of the calls during render. If a call disappears or moves between renders, React ties the state to the wrong Hook.",
      },
    ],
  },
};
