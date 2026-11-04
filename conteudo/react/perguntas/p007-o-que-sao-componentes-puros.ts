import type { Pergunta } from "../../tipos";

// P07 · O que são componentes puros
export const p007: Pergunta = {
  numero: 407,
  modulo: "pedrincandido-core",
  metodo: "whys",
  pt: {
    titulo: "O que são componentes puros",
    pergunta: "O que são components puros?",
    porqueEsteMetodo:
      "“Puro” soa como um capricho acadêmico até você ver o encadeamento de motivos: o React pode repetir e descartar renders, o StrictMode testa isso de propósito, os efeitos têm lugar próprio, e a otimização com `memo` só é segura se o componente for puro. A cadeia de “por quês” leva a essa conclusão.",
    resposta30s:
      "Um **componente puro** devolve o **mesmo JSX para as mesmas props, estado e contexto** e **não causa efeitos colaterais durante a renderização** (não muta nada que já existia, não faz requisição nem lê relógio ou sorteio no corpo). Isso importa porque o React pode **repetir, pausar ou descartar** renders, e o StrictMode renderiza duas vezes em desenvolvimento para pegar impurezas. É também o que torna seguro **pular renders** com `React.memo` ou `PureComponent` (comparação rasa das props) e com o React Compiler.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que a renderização de um componente precisa ser pura?",
            resposta:
              "Porque o React trata o componente como um **cálculo**: dadas as mesmas props, o mesmo estado e o mesmo contexto, ele deve devolver o mesmo JSX sem alterar nada fora de si. Como é o React quem decide quando chamar, quantas vezes e se vai descartar o resultado, um render que depende de variáveis externas ou altera algo (variável global, `fetch`, `Math.random()`, mutar props) dá resultados que variam com a ordem e o número de chamadas.",
          },
          {
            pergunta: "Por que o React pode chamar o componente de novo, ou descartar o resultado?",
            resposta:
              "Porque a renderização é interrompível: com a renderização concorrente, o React pode pausar um render, abandoná-lo por uma atualização mais urgente e refazê-lo depois. Sem efeitos colaterais, repetir ou descartar é seguro. Em desenvolvimento, o **StrictMode** renderiza duas vezes de propósito para expor impurezas: se a segunda chamada muda o resultado, o componente não é puro.",
          },
          {
            pergunta: "Onde vão, então, os efeitos colaterais?",
            resposta:
              "Fora da renderização: em **manipuladores de evento** (resposta a uma ação do usuário) e em `useEffect` (sincronizar com algo externo depois do commit). Os dois rodam num momento previsível, depois que a interface foi confirmada. Pureza não proíbe estado: `useState` e contexto fazem parte das entradas do cálculo. O que ela proíbe é **mutar** props, estado e variáveis já existentes durante o render; criar objetos novos e locais no render é permitido.",
          },
          {
            pergunta: "Por que a pureza permite pular renders?",
            resposta:
              "Se a saída depende só das entradas, entradas iguais dão saída igual, e refazer o cálculo é desperdício. `React.memo` (em funções) e `React.PureComponent` (em classes) usam isso: comparam as props anteriores e as novas por igualdade **rasa** e, se nada mudou, reaproveitam o resultado anterior em vez de renderizar. Se o componente não fosse puro (por exemplo, lesse uma variável externa), pular o render deixaria a tela desatualizada.",
          },
          {
            pergunta: "Por que objetos e funções novos a cada render derrotam esse pulo?",
            resposta:
              "A comparação rasa compara **referências**: `{}`, `[]` e `() => {}` escritos dentro do componente são valores novos a cada render do pai, então as props “mudam” sempre. Estabilize o que passa (mova para fora do componente, ou use `useMemo` e `useCallback`) ou deixe o **React Compiler** memoizar automaticamente; confira em react.dev como ele funciona e o que exige.",
          },
        ],
        causaRaiz:
          "O React trata a renderização como um cálculo que pode ser repetido e pulado. Por isso ela precisa ser uma **função pura** das entradas; a pureza é o contrato que torna seguros a renderização concorrente, o StrictMode e a memoização (`memo`, `PureComponent`, Compiler).",
      },
      {
        tipo: "codigo",
        titulo: "Impuro e puro",
        legenda: "JSX",
        codigo: [
          "let visitas = 0; // variável fora do componente",
          "",
          "function Impuro() {",
          "  visitas += 1; // altera algo externo durante a renderização",
          "  return <p>Visita {visitas}</p>; // a saída depende de quantas vezes o React chamou",
          "}",
          "",
          "function Puro({ nome, itens }) {",
          "  return <p>{nome}: {itens.length}</p>; // só usa as entradas",
          "}",
        ].join("\n"),
        nota: "Em desenvolvimento, com o StrictMode, `Impuro` mostra a contagem saltando: cada renderização chama a função duas vezes. É o sinal de que ele não é puro.",
      },
      {
        tipo: "codigo",
        titulo: "`memo` e a referência estável",
        legenda: "JSX",
        codigo: [
          'import { memo, useMemo, useState } from "react";',
          "",
          "const Lista = memo(function Lista({ itens }) {",
          '  console.log("render Lista");',
          "  return <ul>{itens.map((i) => <li key={i}>{i}</li>)}</ul>;",
          "});",
          "",
          "export function Pai() {",
          "  const [n, setN] = useState(0);",
          '  const itens = ["a", "b"]; // array novo a cada render: o memo nunca pula',
          '  // conserto: useMemo(() => ["a", "b"], []) ou mover o array para fora do componente',
          "  return (",
          "    <>",
          "      <button onClick={() => setN(n + 1)}>Cliques: {n}</button>",
          "      <Lista itens={itens} />",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Com a linha do conserto no lugar, o log “render Lista” aparece uma vez e não volta a cada clique, porque a referência de `itens` não muda.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "PureComponent, memo e o Compiler",
        texto:
          "`React.PureComponent` (classe) traz um `shouldComponentUpdate` com comparação rasa de props e estado; `React.memo` faz o equivalente para as props de componentes de função (estado e contexto internos continuam provocando render). Os dois são **otimizações**: pressupõem um componente puro, mas não tornam um componente puro. O React Compiler analisa componentes que seguem as regras do React e memoiza automaticamente, o que reduz a necessidade de `memo`, `useMemo` e `useCallback` manuais; confira em react.dev o estado atual e os limites.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Otimização, nunca correção",
        texto:
          "Não dependa de `memo` ou `PureComponent` para o programa funcionar: o React pode re-renderizar mesmo assim, e a lógica correta não pode mudar se o `memo` for removido. Memoizar tem custo (a comparação, mais código) e só compensa quando o render é caro e as props raramente mudam; meça com o Profiler antes. Componente **puro** é regra de correção e vale sempre; componente **memoizado** é escolha de desempenho.",
      },
    ],
    armadilhas: [
      "Confundir “puro” com “sem estado”: um componente com `useState` pode ser puro. A pureza fala da renderização: mesmas props, estado e contexto, mesmo JSX.",
      "Mutar props, estado ou objetos externos, ou ler `Date.now()` e `Math.random()` direto no corpo: o resultado passa a depender de quantas vezes e quando o React chama o componente.",
      "Usar `memo` ou `PureComponent` com objetos, arrays ou funções criados inline: a comparação rasa nunca acerta e o custo vem sem benefício. O inverso também pega: mutar um objeto e passar a mesma referência faz o componente não atualizar.",
      "Memoizar tudo por precaução: soma custo de comparação e complexidade sem ganho; meça antes de otimizar.",
    ],
    autoteste: [
      {
        pergunta: "Por que o StrictMode renderiza os componentes duas vezes em desenvolvimento?",
        resposta:
          "Para expor impurezas: se a segunda chamada produz uma saída diferente ou repete um efeito colateral (como incrementar uma variável externa), o componente não é puro. É só em desenvolvimento e não muda o comportamento em produção.",
      },
      {
        pergunta:
          "O que acontece com um `PureComponent` se você faz `push` num array do estado e chama `setState` com o mesmo array?",
        resposta:
          "A comparação rasa vê a mesma referência e conclui que nada mudou, então o componente não re-renderiza e a tela fica desatualizada. É preciso criar um array novo (`[...lista, item]`).",
      },
    ],
  },
  en: {
    titulo: "What pure components are",
    pergunta: "What are pure components?",
    porqueEsteMetodo:
      "“Pure” sounds like an academic whim until you see the chain of reasons: React may repeat and discard renders, StrictMode tests that on purpose, effects have their own place, and the `memo` optimization is only safe if the component is pure. The chain of “whys” leads to that conclusion.",
    resposta30s:
      "A **pure component** returns the **same JSX for the same props, state and context** and **causes no side effects during rendering** (it mutates nothing that already existed, makes no request and reads no clock or random value in the body). That matters because React may **repeat, pause or discard** renders, and StrictMode renders twice in development to catch impurities. It is also what makes it safe to **skip renders** with `React.memo` or `PureComponent` (shallow prop comparison) and with the React Compiler.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why must a component’s rendering be pure?",
            resposta:
              "Because React treats the component as a **calculation**: given the same props, state and context, it must return the same JSX without changing anything outside itself. Since React decides when to call it, how many times and whether to discard the result, a render that depends on outside variables or changes something (a global, `fetch`, `Math.random()`, mutating props) gives results that vary with the order and number of calls.",
          },
          {
            pergunta: "Why can React call the component again, or discard the result?",
            resposta:
              "Because rendering is interruptible: with concurrent rendering, React can pause a render, abandon it for a more urgent update and redo it later. With no side effects, repeating or discarding is safe. In development, **StrictMode** renders twice on purpose to expose impurities: if the second call changes the result, the component is not pure.",
          },
          {
            pergunta: "Where do side effects go, then?",
            resposta:
              "Outside rendering: in **event handlers** (a response to a user action) and in `useEffect` (synchronizing with something external after the commit). Both run at a predictable moment, after the interface was committed. Purity does not forbid state: `useState` and context are part of the calculation’s inputs. What it forbids is **mutating** props, state and variables that already existed during render; creating new local objects in render is allowed.",
          },
          {
            pergunta: "Why does purity allow skipping renders?",
            resposta:
              "If the output depends only on the inputs, equal inputs give equal output, and redoing the calculation is waste. `React.memo` (for functions) and `React.PureComponent` (for classes) rely on this: they compare the previous and new props by **shallow** equality and, if nothing changed, reuse the previous result instead of rendering. If the component were not pure (say, it read an outside variable), skipping the render would leave the screen stale.",
          },
          {
            pergunta: "Why do new objects and functions on every render defeat that skip?",
            resposta:
              "Shallow comparison compares **references**: `{}`, `[]` and `() => {}` written inside the component are new values on every parent render, so the props always “change”. Stabilize what you pass (move it outside the component, or use `useMemo` and `useCallback`) or let the **React Compiler** memoize automatically; check react.dev for how it works and what it requires.",
          },
        ],
        causaRaiz:
          "React treats rendering as a calculation that can be repeated and skipped. That is why it has to be a **pure function** of its inputs; purity is the contract that makes concurrent rendering, StrictMode and memoization (`memo`, `PureComponent`, the Compiler) safe.",
      },
      {
        tipo: "codigo",
        titulo: "Impure and pure",
        legenda: "JSX",
        codigo: [
          "let visits = 0; // variable outside the component",
          "",
          "function Impure() {",
          "  visits += 1; // changes something external during rendering",
          "  return <p>Visit {visits}</p>; // the output depends on how many times React called it",
          "}",
          "",
          "function Pure({ name, items }) {",
          "  return <p>{name}: {items.length}</p>; // only uses its inputs",
          "}",
        ].join("\n"),
        nota: "In development, with StrictMode, `Impure` shows the count jumping: each render calls the function twice. That is the sign it is not pure.",
      },
      {
        tipo: "codigo",
        titulo: "`memo` and a stable reference",
        legenda: "JSX",
        codigo: [
          'import { memo, useMemo, useState } from "react";',
          "",
          "const List = memo(function List({ items }) {",
          '  console.log("render List");',
          "  return <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>;",
          "});",
          "",
          "export function Parent() {",
          "  const [n, setN] = useState(0);",
          '  const items = ["a", "b"]; // a new array on every render: memo never skips',
          '  // fix: useMemo(() => ["a", "b"], []) or move the array outside the component',
          "  return (",
          "    <>",
          "      <button onClick={() => setN(n + 1)}>Clicks: {n}</button>",
          "      <List items={items} />",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "With the fix line in place, the “render List” log appears once and does not return on every click, because the reference of `items` does not change.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "PureComponent, memo and the Compiler",
        texto:
          "`React.PureComponent` (class) brings a `shouldComponentUpdate` with a shallow comparison of props and state; `React.memo` does the equivalent for the props of function components (internal state and context still trigger renders). Both are **optimizations**: they assume a pure component but do not make a component pure. The React Compiler analyzes components that follow React’s rules and memoizes automatically, which reduces the need for manual `memo`, `useMemo` and `useCallback`; check react.dev for the current status and limits.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An optimization, never a correction",
        texto:
          "Do not depend on `memo` or `PureComponent` for the program to work: React may still re-render, and correct logic must not change if `memo` is removed. Memoizing has a cost (the comparison, more code) and only pays off when the render is expensive and the props rarely change; measure with the Profiler first. A **pure** component is a correctness rule and always applies; a **memoized** component is a performance choice.",
      },
    ],
    armadilhas: [
      "Confusing “pure” with “stateless”: a component with `useState` can be pure. Purity is about rendering: same props, state and context, same JSX.",
      "Mutating props, state or external objects, or reading `Date.now()` and `Math.random()` straight in the body: the result starts to depend on how many times and when React calls the component.",
      "Using `memo` or `PureComponent` with objects, arrays or functions created inline: shallow comparison never matches and the cost comes with no benefit. The reverse bites too: mutating an object and passing the same reference makes the component fail to update.",
      "Memoizing everything out of caution: it adds comparison cost and complexity with no gain; measure before optimizing.",
    ],
    autoteste: [
      {
        pergunta: "Why does StrictMode render components twice in development?",
        resposta:
          "To expose impurities: if the second call produces a different output or repeats a side effect (such as incrementing an external variable), the component is not pure. It only happens in development and does not change behavior in production.",
      },
      {
        pergunta:
          "What happens to a `PureComponent` if you `push` onto an array in state and call `setState` with the same array?",
        resposta:
          "Shallow comparison sees the same reference and concludes nothing changed, so the component does not re-render and the screen goes stale. You have to create a new array (`[...list, item]`).",
      },
    ],
  },
};
