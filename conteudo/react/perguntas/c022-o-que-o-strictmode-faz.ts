import type { Pergunta } from "../../tipos";

// C22 · O que o StrictMode faz
export const c022: Pergunta = {
  numero: 522,
  modulo: "coddy-intermediario",
  metodo: "whys",
  pt: {
    titulo: "O que o StrictMode faz",
    pergunta: "O que o StrictMode faz?",
    porqueEsteMetodo:
      "O StrictMode parece estranho (renderiza duas vezes, roda efeitos a mais) até você entender o que ele quer provar. A cadeia de “por quês” liga cada comportamento esquisito a um bug que ele ajuda a achar cedo.",
    resposta30s:
      "O `<StrictMode>` é uma ferramenta **só de desenvolvimento** que expõe bugs cedo: **renderiza os componentes uma vez a mais** (para revelar renderização impura), **roda os efeitos uma vez a mais** na montagem, com limpeza e nova execução (para revelar limpeza ausente) e **avisa sobre APIs obsoletas**. Em produção não faz nada. Se algo quebra por rodar duas vezes, o bug está no seu código, e a correção é pureza e limpeza, não remover o StrictMode.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o StrictMode existe, se a aplicação já funciona?",
            resposta:
              "Porque certos bugs só aparecem em condições raras: renderizações descartadas ou repetidas, componentes desmontados e remontados, atualizações interrompidas. O React quer poder fazer isso por baixo dos panos (renderização concorrente, preservar o estado de partes escondidas da interface, recarregamento em desenvolvimento), e para isso precisa que os componentes sigam regras. O StrictMode **antecipa** essas condições em desenvolvimento, quando é barato achar o bug.",
          },
          {
            pergunta: "Por que ele renderiza duas vezes?",
            resposta:
              "Porque o React parte do princípio de que o render é uma **função pura** das props, do estado e do contexto: mesmas entradas, mesma saída, sem efeito colateral. Se chamar o componente duas vezes seguidas produz resultados diferentes (ou muda algo de fora, como uma variável de módulo, um array recebido por prop, `Math.random()` ou `Date.now()` no corpo), a impureza fica visível na hora. Ele também repete funções que devem ser puras, como o atualizador do `setState` e o inicializador do `useState`.",
          },
          {
            pergunta: "Por que ele monta os efeitos uma vez a mais?",
            resposta:
              "Porque o React precisa poder desmontar e remontar um trecho da árvore preservando o estado (por exemplo, ao esconder e reexibir uma parte da interface). Um efeito deve aguentar o ciclo **configurar, limpar, configurar** sem estragar nada. Na montagem, o StrictMode simula esse ciclo uma vez: se faltar a limpeza, você vê duas inscrições, dois temporizadores ou duas conexões abertas.",
          },
          {
            pergunta: "Por que ele também avisa sobre APIs obsoletas?",
            resposta:
              "Porque o código legado (ciclos de vida antigos de classes, refs em string, contexto legado, `findDOMNode`) não combina com as garantias que o React novo quer dar. O aviso chega enquanto você ainda consegue migrar, antes de a API sumir. A lista exata muda entre versões: confira react.dev.",
          },
          {
            pergunta: "Por que ele não afeta a produção?",
            resposta:
              "Porque essas verificações custam tempo de renderização e só interessam a quem desenvolve. O `<StrictMode>` não gera elementos no DOM, e as passagens extras só acontecem em desenvolvimento; no build de produção cada componente renderiza uma vez e cada efeito roda uma vez. Por isso um `console.log` repetido ou um efeito disparado duas vezes em desenvolvimento não é defeito do React.",
          },
        ],
        causaRaiz:
          "O StrictMode transforma duas suposições do React, **render puro** e **efeitos com limpeza simétrica**, em testes visíveis durante o desenvolvimento: o que quebra com a repetição quebraria em produção, em alguma condição rara.",
      },
      {
        tipo: "tabela",
        titulo: "O que o StrictMode verifica",
        colunas: ["Verificação", "O que o React faz em desenvolvimento", "Bug que expõe"],
        linhas: [
          [
            "Render duplo",
            "Chama o corpo do componente (e atualizadores e inicializadores) uma segunda vez",
            "Renderização impura: mutar variável externa ou props, `Math.random()` ou `Date.now()` no render",
          ],
          [
            "Efeito duplo",
            "Na montagem, roda o efeito, a limpeza e o efeito de novo",
            "Limpeza ausente: inscrições, temporizadores e conexões duplicados",
          ],
          [
            "APIs obsoletas",
            "Avisa no console sobre o uso de APIs legadas",
            "Código que vai quebrar em versões futuras",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ligando o StrictMode e escrevendo a limpeza",
        legenda: "JSX",
        codigo: `import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export function Relogio() {
  useEffect(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id); // sem a limpeza, em desenvolvimento rodam DOIS intervalos
  }, []);
  return null;
}`,
        nota: "Com a limpeza, a sequência configurar, limpar, configurar deixa só um intervalo ativo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não remova o StrictMode para “resolver”",
        texto:
          "Se o efeito dispara duas vezes, o conserto é a **limpeza**: `clearInterval`, cancelar o `fetch` com `AbortController`, ignorar respostas antigas, desfazer a inscrição. Um `useRef` do tipo “já rodei” ou tirar o StrictMode só esconde o problema, que reaparece em produção quando o componente remonta (troca de rota, parte da interface reexibida). Ação que deve acontecer uma vez de verdade, como registrar uma compra, pertence a um handler de evento, não a um efeito. Os detalhes mudam entre versões: confira react.dev.",
      },
    ],
    armadilhas: [
      "Achar que o React tem um bug porque o `console.log` aparece duas vezes ou o efeito roda duas vezes em desenvolvimento: é o StrictMode, de propósito.",
      "Esconder o problema com um `useRef` “já rodou” ou removendo o `<StrictMode>`: o bug continua e reaparece em produção quando o componente remonta.",
      "Mutar objetos recebidos por props, usar variáveis de módulo ou `Math.random()` no render: a impureza passa a produzir resultados diferentes nas duas execuções.",
      "Esperar que o StrictMode proteja a produção: ele não faz nada no build de produção; é uma ferramenta de desenvolvimento.",
    ],
    autoteste: [
      {
        pergunta: "Por que o efeito roda, limpa e roda de novo na montagem em desenvolvimento?",
        resposta:
          "Para simular o desmonte e a remontagem que o React pode fazer e expor limpeza ausente. Um efeito correto aguenta configurar, limpar e configurar de novo sem deixar efeito colateral duplicado.",
      },
      {
        pergunta: "A renderização dupla do StrictMode afeta os usuários?",
        resposta:
          "Não: ela só existe em desenvolvimento. Em produção, cada componente renderiza uma vez e cada efeito roda uma vez.",
      },
    ],
  },
  en: {
    titulo: "What StrictMode does",
    pergunta: "What does StrictMode do?",
    porqueEsteMetodo:
      "StrictMode looks odd (it renders twice and runs extra effects) until you understand what it is trying to prove. The chain of whys ties each strange behavior to a bug it helps you find early.",
    resposta30s:
      "`<StrictMode>` is a **development-only** tool that exposes bugs early: it **renders components one extra time** (to reveal impure rendering), **runs effects one extra time** on mount, with a cleanup and a new run (to reveal missing cleanup), and **warns about deprecated APIs**. In production it does nothing. If something breaks from running twice, the bug is in your code, and the fix is purity and cleanup, not removing StrictMode.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does StrictMode exist if the application already works?",
            resposta:
              "Because some bugs only show up under rare conditions: discarded or repeated renders, components unmounted and remounted, interrupted updates. React wants to be able to do this behind the scenes (concurrent rendering, preserving the state of hidden parts of the interface, reloading in development), and for that it needs components to follow rules. StrictMode **brings those conditions forward** into development, when finding the bug is cheap.",
          },
          {
            pergunta: "Why does it render twice?",
            resposta:
              "Because React assumes rendering is a **pure function** of props, state and context: same inputs, same output, no side effects. If calling the component twice in a row gives different results (or changes something outside, like a module variable, an array received as a prop, `Math.random()` or `Date.now()` in the body), the impurity becomes visible at once. It also repeats functions that must be pure, such as the `setState` updater and the `useState` initializer.",
          },
          {
            pergunta: "Why does it mount effects one extra time?",
            resposta:
              "Because React must be able to unmount and remount part of the tree while preserving state (for example, when hiding and re-showing part of the interface). An effect must survive the cycle **set up, clean up, set up** without breaking anything. On mount, StrictMode simulates that cycle once: if the cleanup is missing, you see two subscriptions, two timers or two open connections.",
          },
          {
            pergunta: "Why does it also warn about deprecated APIs?",
            resposta:
              "Because legacy code (old class lifecycles, string refs, legacy context, `findDOMNode`) does not fit the guarantees modern React wants to give. The warning arrives while you can still migrate, before the API disappears. The exact list changes between versions: check react.dev.",
          },
          {
            pergunta: "Why does it not affect production?",
            resposta:
              "Because these checks cost render time and only matter to whoever is developing. `<StrictMode>` produces no DOM elements, and the extra passes only happen in development; in the production build each component renders once and each effect runs once. That is why a repeated `console.log` or an effect firing twice in development is not a React defect.",
          },
        ],
        causaRaiz:
          "StrictMode turns two assumptions of React, **pure rendering** and **effects with symmetric cleanup**, into visible tests during development: what breaks under repetition would break in production under some rare condition.",
      },
      {
        tipo: "tabela",
        titulo: "What StrictMode checks",
        colunas: ["Check", "What React does in development", "Bug it exposes"],
        linhas: [
          [
            "Double render",
            "Calls the component body (and updaters and initializers) a second time",
            "Impure rendering: mutating an outside variable or props, `Math.random()` or `Date.now()` in render",
          ],
          [
            "Double effect",
            "On mount, runs the effect, the cleanup and the effect again",
            "Missing cleanup: duplicated subscriptions, timers and connections",
          ],
          ["Deprecated APIs", "Warns in the console about legacy API usage", "Code that will break in future versions"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Turning StrictMode on and writing the cleanup",
        legenda: "JSX",
        codigo: `import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

export function Clock() {
  useEffect(() => {
    const id = setInterval(() => console.log("tick"), 1000);
    return () => clearInterval(id); // without the cleanup, TWO intervals run in development
  }, []);
  return null;
}`,
        nota: "With the cleanup, the sequence set up, clean up, set up leaves a single interval active.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not remove StrictMode to “fix” it",
        texto:
          "If the effect fires twice, the fix is the **cleanup**: `clearInterval`, cancelling the `fetch` with `AbortController`, ignoring stale responses, undoing the subscription. An “already ran” `useRef` or removing StrictMode only hides the problem, which comes back in production when the component remounts (a route change, a part of the interface shown again). An action that must truly happen once, like recording a purchase, belongs in an event handler, not in an effect. The details change between versions: check react.dev.",
      },
    ],
    armadilhas: [
      "Thinking React has a bug because `console.log` appears twice or the effect runs twice in development: that is StrictMode, on purpose.",
      "Hiding the problem with an “already ran” `useRef` or by removing `<StrictMode>`: the bug stays and comes back in production when the component remounts.",
      "Mutating objects received as props, using module variables or `Math.random()` in render: the impurity then yields different results in the two runs.",
      "Expecting StrictMode to protect production: it does nothing in the production build; it is a development tool.",
    ],
    autoteste: [
      {
        pergunta: "Why does the effect run, clean up and run again on mount in development?",
        resposta:
          "To simulate the unmount and remount React may do, and to expose missing cleanup. A correct effect survives set up, clean up and set up again without leaving a duplicated side effect.",
      },
      {
        pergunta: "Does StrictMode’s double rendering affect users?",
        resposta:
          "No: it only exists in development. In production, each component renders once and each effect runs once.",
      },
    ],
  },
};
