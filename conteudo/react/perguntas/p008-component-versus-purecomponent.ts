import type { Pergunta } from "../../tipos";

// P08 · Component versus PureComponent
export const p008: Pergunta = {
  numero: 408,
  modulo: "pedrincandido-core",
  metodo: "compare",
  pt: {
    titulo: "Component versus PureComponent",
    pergunta: "Qual a diferença entre um component e um PureComponent?",
    porqueEsteMetodo:
      "As duas classes, o `shouldComponentUpdate` manual e o `React.memo` se parecem e resolvem o mesmo problema com custos e cuidados diferentes. Uma matriz lado a lado e uma regra de decisão respondem ao que a entrevista quer ouvir: quando escolher cada um.",
    resposta30s:
      "`Component` re-renderiza sempre que o pai renderiza ou o estado muda; `PureComponent` já traz um `shouldComponentUpdate` com **comparação rasa** de props e estado e **pula o render** quando nada mudou. Isso só é seguro com dados **imutáveis**: mutar um objeto, ou passar objetos e funções novos a cada render, anula ou quebra o ganho. Nas funções, o equivalente é `React.memo`; otimize depois de **medir** e confira em react.dev o que o React Compiler muda.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Component, PureComponent e React.memo",
        colunas: ["Aspecto", "`Component`", "`PureComponent`", "`React.memo` (função)"],
        linhas: [
          [
            "Quando re-renderiza",
            "Quando o pai renderiza, a cada `setState` e na mudança de contexto consumido",
            "Só se as props ou o estado mudaram numa comparação rasa (e na mudança de contexto consumido)",
            "Só se as props mudaram numa comparação rasa; estado e contexto internos ainda provocam render",
          ],
          [
            "Como decide",
            "`shouldComponentUpdate` devolve `true` por padrão",
            "Já implementa `shouldComponentUpdate` com `shallowEqual`; não o sobrescreva",
            "Comparação rasa das props, ou a sua função, passada como segundo argumento",
          ],
          [
            "Controle fino",
            "`shouldComponentUpdate(proximasProps, proximoEstado)` devolvendo `false` para pular o render",
            "Nenhum: a regra é a comparação rasa",
            "`memo(Componente, (anterior, proximas) => ...)`, que devolve `true` quando pode pular",
          ],
          [
            "Custo",
            "Nenhuma comparação, mas renders desnecessários",
            "A comparação rasa em todo update: barata, a menos que haja muitas props",
            "O mesmo da comparação rasa; uma função de comparação profunda pode custar mais que renderizar",
          ],
          [
            "Cuidados",
            "Renders repetidos em árvores grandes",
            "Mutação do estado ou das props e objetos e funções novos a cada render",
            "Os mesmos do `PureComponent`: referências novas e mutação",
          ],
        ],
        nota: "Uma mudança no contexto consumido re-renderiza o consumidor mesmo que o `shouldComponentUpdate` ou o `memo` tente pular. O `React.memo` só vale para componentes de função, e o `PureComponent` só para classes.",
      },
      {
        tipo: "codigo",
        titulo: "Três formas de pular renders",
        legenda: "JSX",
        codigo: [
          "class Contador extends React.PureComponent {",
          "  render() { return <p>{this.props.valor}</p>; } // pula se valor não mudou (comparação rasa)",
          "}",
          "",
          "class Linha extends React.Component {",
          "  shouldComponentUpdate(proximas) { // manual: devolve false para pular",
          "    return proximas.item.id !== this.props.item.id || proximas.item.texto !== this.props.item.texto;",
          "  }",
          "  render() { return <li>{this.props.item.texto}</li>; }",
          "}",
          "",
          "const Cartao = memo(function Cartao({ titulo }) { // equivalente em funções",
          "  return <h2>{titulo}</h2>;",
          "});",
        ].join("\n"),
        nota: "Na classe, não combine `PureComponent` com um `shouldComponentUpdate` seu: o React avisa em desenvolvimento. `shouldComponentUpdate` só existe para desempenho, e devolver `false` nunca deve ser necessário para a correção.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Em código novo, use **componentes de função** e não reescreva uma classe só para otimizar. Numa classe, comece com `Component`; se o Profiler mostrar renders caros e repetidos com as mesmas props, passe para `PureComponent` (com dados imutáveis e props estáveis), e use `shouldComponentUpdate` só quando precisar de um critério próprio. Em funções, `React.memo`. **Meça antes**: a comparação tem custo, e o React Compiler, quando adotado, já memoiza automaticamente boa parte desses casos (confira em react.dev o que ele cobre e exige).",
      },
      {
        tipo: "codigo",
        titulo: "getDerivedStateFromProps: sincronizar estado com props, em casos raros",
        legenda: "JSX",
        codigo: [
          "class Filtro extends React.Component {",
          "  state = { textoAnterior: this.props.texto, rascunho: this.props.texto };",
          "",
          "  static getDerivedStateFromProps(props, state) {",
          "    // roda antes de TODO render: na montagem e em cada atualização",
          "    if (props.texto !== state.textoAnterior) {",
          "      return { textoAnterior: props.texto, rascunho: props.texto }; // mescla no estado",
          "    }",
          "    return null; // nada a mudar",
          "  }",
          "  render() { return <input value={this.state.rascunho} readOnly />; }",
          "}",
        ].join("\n"),
        nota: "`getDerivedStateFromProps` é estático, não enxerga `this` e devolve um objeto parcial de estado ou `null`. A documentação o reserva a casos raros em que o estado depende da mudança das props ao longo do tempo; costuma ser melhor derivar o valor na renderização, usar um componente controlado ou resetar com `key`. Em funções, a mesma ideia é comparar a prop anterior durante a renderização.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A comparação rasa só enxerga referências",
        texto:
          "`PureComponent` e `memo` comparam cada prop com `Object.is`. Se você **muta** um array ou objeto do estado e chama `setState` com a mesma referência, nada parece mudar e a tela fica desatualizada; se passa `style={{ ... }}`, `[]` ou `() => {}` **criados inline**, tudo parece mudar sempre e você paga a comparação sem ganho. Use cópias (`[...lista, item]`), estabilize referências (`useMemo`, `useCallback`, constantes fora do componente) e, em classes, métodos como propriedades de classe em vez de arrow functions no `render`.",
      },
    ],
    armadilhas: [
      "Mutar o estado ou as props (`push`, atribuição direta) e esperar que o `PureComponent` atualize: a comparação rasa vê a mesma referência e pula o render.",
      "Passar objetos, arrays ou funções inline (`style={{}}`, `onClick={() => ...}`) a um filho `PureComponent` ou `memo`: a comparação sempre falha e o custo vem sem benefício.",
      "Escrever um `shouldComponentUpdate` com comparação incompleta (esqueceu uma prop ou o estado), que deixa a UI velha, ou profunda (`JSON.stringify`, deep equal), que custa mais que renderizar.",
      "Usar `getDerivedStateFromProps` para copiar props para o estado: cria duas fontes de verdade e bugs de sincronia; derive na renderização, use um componente controlado ou resete com `key`.",
    ],
    autoteste: [
      {
        pergunta: "O que `shouldComponentUpdate` recebe e devolve, e quando é chamado?",
        resposta:
          "Recebe as próximas props e o próximo estado (e o contexto) e devolve um booleano: `false` pula o render. É chamado antes de re-renderizar quando chegam novas props ou novo estado, não na montagem inicial nem em `forceUpdate()`. Serve só como otimização, e devolver `false` não impede os filhos de renderizar por mudanças no estado deles.",
      },
      {
        pergunta: "Para que serve `getDerivedStateFromProps` e por que é pouco usado?",
        resposta:
          "É um método estático chamado antes de todo render para calcular parte do estado a partir das props, devolvendo um objeto ou `null`. É pouco usado porque duplica a fonte de verdade e causa bugs de sincronia; quase sempre dá para derivar na renderização, usar um componente controlado ou resetar o estado com `key`.",
      },
    ],
  },
  en: {
    titulo: "Component vs PureComponent",
    pergunta: "What is the difference between a Component and a PureComponent?",
    porqueEsteMetodo:
      "The two classes, a hand-written `shouldComponentUpdate` and `React.memo` look alike and solve the same problem with different costs and caveats. A side-by-side matrix and a decision rule answer what the interview wants to hear: when to choose each one.",
    resposta30s:
      "`Component` re-renders whenever its parent renders or its state changes; `PureComponent` already ships a `shouldComponentUpdate` with a **shallow comparison** of props and state and **skips the render** when nothing changed. That is only safe with **immutable** data: mutating an object, or passing new objects and functions on every render, cancels or breaks the gain. In function components the equivalent is `React.memo`; optimize after **measuring** and check react.dev for what the React Compiler changes.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Component, PureComponent and React.memo",
        colunas: ["Aspect", "`Component`", "`PureComponent`", "`React.memo` (function)"],
        linhas: [
          [
            "When it re-renders",
            "When the parent renders, on every `setState` and when consumed context changes",
            "Only if props or state changed in a shallow comparison (and when consumed context changes)",
            "Only if props changed in a shallow comparison; internal state and context still trigger renders",
          ],
          [
            "How it decides",
            "`shouldComponentUpdate` returns `true` by default",
            "Already implements `shouldComponentUpdate` with `shallowEqual`; do not override it",
            "Shallow comparison of props, or your own function, passed as the second argument",
          ],
          [
            "Fine control",
            "`shouldComponentUpdate(nextProps, nextState)` returning `false` to skip the render",
            "None: the rule is the shallow comparison",
            "`memo(Component, (previous, next) => ...)`, which returns `true` when it can skip",
          ],
          [
            "Cost",
            "No comparison, but unnecessary renders",
            "The shallow comparison on every update: cheap, unless there are many props",
            "The same as the shallow comparison; a deep-comparison function can cost more than rendering",
          ],
          [
            "Caveats",
            "Repeated renders in large trees",
            "Mutating state or props and new objects and functions on every render",
            "The same as `PureComponent`: new references and mutation",
          ],
        ],
        nota: "A change in consumed context re-renders the consumer even if `shouldComponentUpdate` or `memo` tries to skip. `React.memo` only applies to function components, and `PureComponent` only to classes.",
      },
      {
        tipo: "codigo",
        titulo: "Three ways to skip renders",
        legenda: "JSX",
        codigo: [
          "class Counter extends React.PureComponent {",
          "  render() { return <p>{this.props.value}</p>; } // skips if value did not change (shallow)",
          "}",
          "",
          "class Row extends React.Component {",
          "  shouldComponentUpdate(next) { // manual: return false to skip",
          "    return next.item.id !== this.props.item.id || next.item.text !== this.props.item.text;",
          "  }",
          "  render() { return <li>{this.props.item.text}</li>; }",
          "}",
          "",
          "const Card = memo(function Card({ title }) { // the function-component equivalent",
          "  return <h2>{title}</h2>;",
          "});",
        ].join("\n"),
        nota: "In a class, do not combine `PureComponent` with a `shouldComponentUpdate` of your own: React warns in development. `shouldComponentUpdate` exists only for performance, and returning `false` should never be needed for correctness.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In new code, use **function components** and do not rewrite a class just to optimize. In a class, start with `Component`; if the Profiler shows expensive repeated renders with the same props, move to `PureComponent` (with immutable data and stable props), and use `shouldComponentUpdate` only when you need a criterion of your own. In functions, `React.memo`. **Measure first**: the comparison has a cost, and the React Compiler, once adopted, already memoizes much of this automatically (check react.dev for what it covers and requires).",
      },
      {
        tipo: "codigo",
        titulo: "getDerivedStateFromProps: syncing state with props, in rare cases",
        legenda: "JSX",
        codigo: [
          "class Filter extends React.Component {",
          "  state = { previousText: this.props.text, draft: this.props.text };",
          "",
          "  static getDerivedStateFromProps(props, state) {",
          "    // runs before EVERY render: on mount and on each update",
          "    if (props.text !== state.previousText) {",
          "      return { previousText: props.text, draft: props.text }; // merged into state",
          "    }",
          "    return null; // nothing to change",
          "  }",
          "  render() { return <input value={this.state.draft} readOnly />; }",
          "}",
        ].join("\n"),
        nota: "`getDerivedStateFromProps` is static, cannot see `this` and returns a partial state object or `null`. The documentation reserves it for rare cases where state depends on prop changes over time; it is usually better to derive the value during render, use a controlled component or reset with `key`. In function components, the same idea is comparing the previous prop during render.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Shallow comparison only sees references",
        texto:
          "`PureComponent` and `memo` compare each prop with `Object.is`. If you **mutate** an array or object in state and call `setState` with the same reference, nothing seems to change and the screen goes stale; if you pass `style={{ ... }}`, `[]` or `() => {}` **created inline**, everything seems to change every time and you pay for the comparison with no gain. Use copies (`[...list, item]`), stabilize references (`useMemo`, `useCallback`, constants outside the component) and, in classes, class-property methods instead of arrow functions in `render`.",
      },
    ],
    armadilhas: [
      "Mutating state or props (`push`, direct assignment) and expecting `PureComponent` to update: the shallow comparison sees the same reference and skips the render.",
      "Passing inline objects, arrays or functions (`style={{}}`, `onClick={() => ...}`) to a `PureComponent` or `memo` child: the comparison always fails and the cost comes with no benefit.",
      "Writing a `shouldComponentUpdate` with an incomplete comparison (forgetting a prop or the state), which leaves the UI stale, or a deep one (`JSON.stringify`, deep equal), which costs more than rendering.",
      "Using `getDerivedStateFromProps` to copy props into state: it creates two sources of truth and sync bugs; derive during render, use a controlled component or reset with `key`.",
    ],
    autoteste: [
      {
        pergunta: "What does `shouldComponentUpdate` receive and return, and when is it called?",
        resposta:
          "It receives the next props and next state (and context) and returns a boolean: `false` skips the render. It is called before re-rendering when new props or state arrive, not on the initial mount or on `forceUpdate()`. It exists only as an optimization, and returning `false` does not stop children from rendering because of their own state changes.",
      },
      {
        pergunta: "What is `getDerivedStateFromProps` for, and why is it rarely used?",
        resposta:
          "It is a static method called before every render to compute part of the state from props, returning an object or `null`. It is rarely used because it duplicates the source of truth and causes sync bugs; you can almost always derive during render, use a controlled component or reset the state with `key`.",
      },
    ],
  },
};
