import type { Pergunta } from "../../tipos";

// L12 · Funcional ou de classe
export const l012: Pergunta = {
  numero: 12,
  modulo: "linkedin-fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Funcional ou de classe",
    pergunta: "Componentes funcionais vs componentes de classe?",
    porqueEsteMetodo:
      "São duas formas de escrever a mesma coisa, e a entrevista quer saber onde diferem e quando escolher cada uma. Uma matriz lado a lado, com a regra de decisão no fim, responde a todas as variações (diferença, quando usar, o que falta nas funções, por que surgiram).",
    resposta30s:
      "Componentes **funcionais** são funções que recebem props e devolvem JSX e, com **Hooks** (`useState`, `useEffect`), têm state, ciclo de vida e lógica reaproveitável; os de **classe** usam `this.state`, `setState` e métodos de ciclo de vida. O padrão atual é escrever **funções**: menos código, sem o problema do `this` e com lógica compartilhada por custom Hooks em vez de HOCs. Só as classes ainda fazem **error boundaries**, e as classes existentes continuam funcionando.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Lado a lado",
        colunas: ["Aspecto", "Funcional", "Classe"],
        linhas: [
          [
            "Sintaxe",
            "Função que recebe props e devolve JSX",
            "Classe que estende `Component`, com o método `render()`",
          ],
          ["State", "`useState` e `useReducer`", "`this.state` e `this.setState`"],
          [
            "Ciclo de vida",
            "`useEffect` (e `useLayoutEffect`): um Hook organiza o efeito por assunto e dependências",
            "`componentDidMount`, `componentDidUpdate` e `componentWillUnmount`: métodos separados por fase",
          ],
          [
            "Reaproveitar lógica",
            "Custom Hooks: funções comuns que chamam outros Hooks, sem mudar a árvore",
            "HOCs e render props, que embrulham o componente em camadas extras",
          ],
          [
            "O `this`",
            "Não existe: a função enxerga os valores da renderização em que foi criada",
            "Exige cuidado nos handlers (`bind` ou arrow function), e `this.props` pode mostrar valores mais novos do que os da renderização",
          ],
          ["Error boundary", "Sem equivalente em Hook", "Sim: `getDerivedStateFromError` e `componentDidCatch`"],
          ["Volume de código", "Geralmente menor", "Geralmente maior (construtor, métodos, `bind`)"],
          [
            "Situação hoje",
            "Padrão para código novo",
            "Continua suportado; não precisa migrar o que funciona (confira react.dev)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O mesmo contador em classe",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class Contador extends Component {
  state = { valor: 0 };

  componentDidMount() {
    document.title = "Contador";
  }

  incrementar = () => {
    this.setState((estado) => ({ valor: estado.valor + 1 }));
  };

  render() {
    return <button onClick={this.incrementar}>{this.state.valor}</button>;
  }
}`,
      },
      {
        tipo: "codigo",
        titulo: "E em função, com Hooks",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function Contador() {
  const [valor, setValor] = useState(0);

  useEffect(() => {
    document.title = "Contador";
  }, []);

  return <button onClick={() => setValor((v) => v + 1)}>{valor}</button>;
}`,
        nota: "Mesmo comportamento com menos cerimônia: o estado e o efeito são declarados dentro da função, sem `this` nem métodos separados por fase.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Código novo: função.** Classe existente que funciona: **deixe como está** e migre só quando mexer nela por outro motivo, porque o React segue suportando classes. Precisa de **error boundary**? Escreva uma classe pequena (ou use uma biblioteca que já a encapsula) e mantenha o resto em funções. Hooks só funcionam em funções; não dá para usá-los dentro de uma classe. Confira react.dev para a recomendação atual.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Por que as funções ganharam espaço, e o que falta nelas",
        texto:
          "Antes dos Hooks, a função só renderizava (era “sem estado”) e apenas as classes tinham state e ciclo de vida. Os Hooks deram state e efeitos às funções e resolveram três dores das classes: a lógica reaproveitada por HOCs e render props, os métodos de ciclo de vida misturando assuntos sem relação e o `this`. Hoje “sem estado” já não distingue função de classe. O que só as classes têm: **error boundaries** e `getSnapshotBeforeUpdate`; confira react.dev. Traduzir `componentDidMount`, `componentDidUpdate` e `componentWillUnmount` um a um para `useEffect` é um erro comum: o efeito se organiza por assunto, não por fase.",
      },
    ],
    armadilhas: [
      "Dizer que componente funcional é “sem estado”: isso valia antes dos Hooks; hoje funções têm state e efeitos.",
      "Achar que as classes foram removidas ou proibidas: continuam suportadas, só não são o padrão para código novo.",
      "Tentar usar Hooks dentro de uma classe (ou `this` dentro de uma função): são dois modelos separados.",
      "Traduzir os métodos de ciclo de vida um a um para `useEffect`, em vez de organizar o efeito por assunto e dependências.",
    ],
    autoteste: [
      {
        pergunta: "Cite algo que só um componente de classe faz hoje.",
        resposta:
          "Ser um error boundary (`getDerivedStateFromError` e `componentDidCatch`); também `getSnapshotBeforeUpdate`. Dá para escrever uma classe pequena, ou usar uma biblioteca que a encapsula, e manter o resto em funções.",
      },
      {
        pergunta: "Como cada estilo reaproveita lógica de state?",
        resposta:
          "Em classes, com HOCs e render props, que embrulham o componente em camadas extras. Em funções, com custom Hooks: funções comuns que chamam outros Hooks e devolvem valores, sem alterar a árvore de componentes.",
      },
    ],
  },
  en: {
    titulo: "Functional or class components",
    pergunta: "Functional components vs class components?",
    porqueEsteMetodo:
      "They are two ways of writing the same thing, and the interview wants to know where they differ and when to pick each one. A side-by-side matrix, with the decision rule at the end, answers every variation (the difference, when to use which, what functions lack, why they appeared).",
    resposta30s:
      "**Functional** components are functions that receive props and return JSX and, with **Hooks** (`useState`, `useEffect`), have state, lifecycle and reusable logic; **class** components use `this.state`, `setState` and lifecycle methods. Today’s default is to write **functions**: less code, no `this` problem and shared logic through custom Hooks instead of HOCs. Only classes can still be **error boundaries**, and existing classes keep working.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Side by side",
        colunas: ["Aspect", "Functional", "Class"],
        linhas: [
          [
            "Syntax",
            "A function that receives props and returns JSX",
            "A class that extends `Component`, with a `render()` method",
          ],
          ["State", "`useState` and `useReducer`", "`this.state` and `this.setState`"],
          [
            "Lifecycle",
            "`useEffect` (and `useLayoutEffect`): one Hook organizes the effect by concern and dependencies",
            "`componentDidMount`, `componentDidUpdate` and `componentWillUnmount`: separate methods per phase",
          ],
          [
            "Reusing logic",
            "Custom Hooks: plain functions that call other Hooks, without changing the tree",
            "HOCs and render props, which wrap the component in extra layers",
          ],
          [
            "`this`",
            "Does not exist: the function sees the values of the render it was created in",
            "Needs care in handlers (`bind` or an arrow function), and `this.props` may show newer values than the ones from the render",
          ],
          ["Error boundary", "No Hook equivalent", "Yes: `getDerivedStateFromError` and `componentDidCatch`"],
          ["Amount of code", "Usually less", "Usually more (constructor, methods, `bind`)"],
          [
            "Status today",
            "The default for new code",
            "Still supported; no need to migrate what works (check react.dev)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same counter as a class",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class Counter extends Component {
  state = { value: 0 };

  componentDidMount() {
    document.title = "Counter";
  }

  increment = () => {
    this.setState((state) => ({ value: state.value + 1 }));
  };

  render() {
    return <button onClick={this.increment}>{this.state.value}</button>;
  }
}`,
      },
      {
        tipo: "codigo",
        titulo: "And as a function, with Hooks",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function Counter() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    document.title = "Counter";
  }, []);

  return <button onClick={() => setValue((v) => v + 1)}>{value}</button>;
}`,
        nota: "Same behavior with less ceremony: state and effect are declared inside the function, with no `this` and no methods split by phase.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**New code: a function.** An existing class that works: **leave it alone** and migrate only when you touch it for another reason, since React keeps supporting classes. Need an **error boundary**? Write one small class (or use a library that already wraps it) and keep the rest in functions. Hooks only work in functions; you cannot use them inside a class. Check react.dev for the current recommendation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Why functions gained ground, and what they lack",
        texto:
          "Before Hooks, a function only rendered (it was “stateless”) and only classes had state and lifecycle. Hooks gave functions state and effects and fixed three pains of classes: logic reused through HOCs and render props, lifecycle methods mixing unrelated concerns, and `this`. Today “stateless” no longer separates function from class. What only classes have: **error boundaries** and `getSnapshotBeforeUpdate`; check react.dev. Translating `componentDidMount`, `componentDidUpdate` and `componentWillUnmount` one by one into `useEffect` is a common mistake: an effect is organized by concern, not by phase.",
      },
    ],
    armadilhas: [
      "Calling a functional component “stateless”: that held before Hooks; today functions have state and effects.",
      "Thinking classes were removed or banned: they are still supported, just not the default for new code.",
      "Trying to use Hooks inside a class (or `this` inside a function): they are two separate models.",
      "Translating lifecycle methods one by one into `useEffect`, instead of organizing the effect by concern and dependencies.",
    ],
    autoteste: [
      {
        pergunta: "Name something only a class component does today.",
        resposta:
          "Being an error boundary (`getDerivedStateFromError` and `componentDidCatch`); also `getSnapshotBeforeUpdate`. You can write one small class, or use a library that wraps it, and keep the rest in functions.",
      },
      {
        pergunta: "How does each style reuse state logic?",
        resposta:
          "Classes use HOCs and render props, which wrap the component in extra layers. Functions use custom Hooks: plain functions that call other Hooks and return values, without changing the component tree.",
      },
    ],
  },
};
