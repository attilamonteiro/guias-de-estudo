import type { Pergunta } from "../../tipos";

// P16 · Vincular event handlers em JSX
export const p016: Pergunta = {
  numero: 416,
  modulo: "pedrincandido-core",
  metodo: "playbook",
  pt: {
    titulo: "Vincular event handlers em JSX",
    pergunta: "Como ligar o método ou event handlers em JSX callbacks?",
    porqueEsteMetodo:
      "É uma pergunta de “como fazer”, com uma sequência de decisões: primeiro o tipo de componente, depois a forma de ligar, depois como passar argumentos e só no fim o custo. Um passo a passo com critérios evita decorar quatro sintaxes sem saber quando usar cada uma.",
    resposta30s:
      "Em **componentes de função** não existe `this`: declare a função dentro do componente e passe a referência (`onClick={salvar}`), usando uma arrow quando precisar de argumento (`onClick={() => remover(id)}`). Em **classes**, passar `this.metodo` solta o método do objeto e o `this` vira `undefined`, então ligue-o com **`bind` no construtor** ou, o mais comum, com um **class field com arrow function**. Recriar a função a cada render quase nunca pesa; só importa quando ela vai a um filho memorizado, e aí entram `useCallback` e `React.memo`.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: ligar e parametrizar um handler",
        passos: [
          {
            titulo: "Identifique o tipo de componente",
            texto:
              "Em componente de função não há `this` nem `bind`: o handler é uma closure sobre props e estado, e basta passar a referência. Só em classes você precisa decidir como ligar o método.",
          },
          {
            titulo: "Entenda por que o `this` se perde (classes)",
            texto:
              "`onClick={this.salvar}` entrega só a função, sem o objeto. Quando o evento dispara, ela é chamada sem receptor e, como o corpo de uma classe roda em modo estrito, o `this` fica `undefined` e `this.setState` lança `TypeError`. É regra do JavaScript, não do React.",
          },
          {
            titulo: "Escolha a forma de ligar (classes)",
            texto:
              "(a) `this.salvar = this.salvar.bind(this)` no construtor: uma função ligada por instância, com identidade estável. (b) **Class field com arrow** (`salvar = () => {...}`): a arrow não tem `this` próprio e usa o de onde foi escrita, que é a instância; é a forma mais comum. (c) Arrow inline (`onClick={() => this.salvar()}`) ou `.bind(this)` no JSX: funcionam, mas criam uma função nova a cada render.",
          },
          {
            titulo: "Passe parâmetros",
            texto:
              "Com uma arrow que fecha sobre o valor: `onClick={() => remover(id)}` (em classes, `() => this.remover(id)`). Com `bind`: `remover.bind(null, id)`, e o evento chega como último argumento. Ou leia do elemento: `data-id={id}` e `e.currentTarget.dataset.id`, que volta como **string**. Num filho, o mais limpo é receber `id` e `onRemover` e chamar `onRemover(id)` lá dentro.",
          },
          {
            titulo: "Decida se o custo importa",
            texto:
              "A função nova a cada render é barata, e o React apenas troca a referência do handler no elemento. O custo aparece quando ela é prop de um filho memorizado (`React.memo`, `PureComponent`), onde a identidade nova força o re-render, ou dependência de `useEffect`, `useMemo` ou `useCallback`. Meça antes de otimizar.",
          },
          {
            titulo: "Estabilize a identidade quando for preciso",
            texto:
              "Em função, envolva o handler em `useCallback(fn, deps)` e o filho em `React.memo`: o filho só re-renderiza se as props mudarem de fato. Use o setter funcional (`setX((v) => ...)`) para não depender do estado e manter as dependências curtas. O React Compiler pode memorizar isso automaticamente; confira react.dev.",
          },
          {
            titulo: "Valide",
            texto:
              "Sinal de acerto: o clique funciona sem `TypeError` e o Profiler do React DevTools mostra que o filho memorizado não re-renderiza quando só o pai muda. Sem um re-render medido, não acrescente `useCallback`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Classe: três formas de ligar",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class Botoes extends Component {
  constructor(props) {
    super(props);
    this.salvar = this.salvar.bind(this); // (1) bind no construtor
  }

  salvar() { console.log(this.props.id); }
  abrir = () => console.log(this.props.id); // (2) arrow como class field

  render() {
    return (
      <>
        <button onClick={this.salvar}>Salvar</button>
        <button onClick={this.abrir}>Abrir</button>
        <button onClick={() => this.salvar()}>Inline</button> {/* (3) arrow inline */}
      </>
    );
  }
}`,
        nota: "Sem o `bind` do item (1), o primeiro botão lançaria `TypeError`: `this` seria `undefined`.",
      },
      {
        tipo: "codigo",
        titulo: "Função: argumento por closure e identidade estável",
        legenda: "JSX",
        codigo: `import { memo, useCallback, useState } from "react";

const Linha = memo(function Linha({ id, onRemover }) {
  return <button onClick={() => onRemover(id)}>Remover {id}</button>;
});

export function Lista() {
  const [ids, setIds] = useState([1, 2, 3]);

  // identidade estável: Linha (memo) não re-renderiza por causa desta função
  const remover = useCallback((id) => {
    setIds((atuais) => atuais.filter((x) => x !== id));
  }, []);

  return ids.map((id) => <Linha key={id} id={id} onRemover={remover} />);
}`,
        nota: "O setter funcional dispensa `ids` das dependências, então `remover` pode ter lista vazia sem ler valor antigo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra para escolher",
        texto:
          "Componente de função: escreva a função dentro do componente e passe a referência; use uma **arrow function** (função curta, sem `this` próprio) só para levar argumentos. Classe: use **class field com arrow** ou `bind` no construtor, e evite `bind` dentro do JSX. Só acrescente `useCallback` com `React.memo` (ou quando o handler for dependência de um hook) se um re-render medido valer o esforço.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Chamar não é ligar",
        texto:
          "`onClick={this.salvar()}` e `onClick={salvar(id)}` **executam** a função durante o render; ligar é entregar a função. O erro oposto também existe: `useCallback` num handler passado a um filho que não é memorizado não evita nada, só soma dependências para errar.",
      },
    ],
    armadilhas: [
      "Passar `this.metodo` sem ligar numa classe: o `this` vira `undefined` e o clique lança `TypeError`.",
      "Escrever `onClick={salvar(id)}` achando que assim passa o argumento: a função roda no render. Use `() => salvar(id)`.",
      "`useCallback` com lista de dependências errada (vazia, mas lendo estado): o handler guarda valores antigos. Use o setter funcional ou liste tudo o que ele usa.",
      "Embrulhar todo handler em `useCallback` “por garantia”: sem filho memorizado nem dependência de hook, não há ganho.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `this` é `undefined` no handler de uma classe sem `bind`?",
        resposta:
          "Porque `onClick={this.salvar}` passa a função solta, sem o objeto. O React a chama sem receptor e, em modo estrito (o corpo de classes), `this` fica `undefined`. `bind` ou uma arrow como class field fixa o `this` na instância.",
      },
      {
        pergunta: "Como passar o `id` de um item ao handler, e quando a função nova a cada render vira problema?",
        resposta:
          "Com uma arrow que fecha sobre o valor (`() => remover(id)`). Vira problema quando a função é prop de um filho memorizado ou dependência de um hook; aí use `useCallback` junto de `React.memo`, depois de medir.",
      },
    ],
  },
  en: {
    titulo: "Binding event handlers in JSX",
    pergunta: "How do you bind a method or event handlers in JSX callbacks?",
    porqueEsteMetodo:
      "This is a “how do I” question with a sequence of decisions: first the component type, then how to bind, then how to pass arguments and only at the end the cost. A step-by-step procedure with criteria saves you from memorizing four syntaxes without knowing when to use each.",
    resposta30s:
      "In **function components** there is no `this`: declare the function inside the component and pass the reference (`onClick={save}`), using an arrow when you need an argument (`onClick={() => remove(id)}`). In **classes**, passing `this.method` detaches the method from its object and `this` becomes `undefined`, so bind it with **`bind` in the constructor** or, most commonly, with a **class field arrow function**. Recreating the function on every render rarely matters; it only does when the function goes to a memoized child, and that is where `useCallback` and `React.memo` come in.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: binding and parameterizing a handler",
        passos: [
          {
            titulo: "Identify the component type",
            texto:
              "A function component has no `this` and no `bind`: the handler is a closure over props and state, and passing the reference is enough. Only in classes do you have to decide how to bind the method.",
          },
          {
            titulo: "Understand why `this` is lost (classes)",
            texto:
              "`onClick={this.save}` hands over only the function, without the object. When the event fires, it is called with no receiver and, since a class body runs in strict mode, `this` is `undefined` and `this.setState` throws a `TypeError`. That is a JavaScript rule, not a React one.",
          },
          {
            titulo: "Pick how to bind (classes)",
            texto:
              "(a) `this.save = this.save.bind(this)` in the constructor: one bound function per instance, with a stable identity. (b) A **class field arrow** (`save = () => {...}`): an arrow has no `this` of its own and uses the one where it was written, which is the instance; it is the most common form. (c) An inline arrow (`onClick={() => this.save()}`) or `.bind(this)` in JSX: both work, but create a new function on every render.",
          },
          {
            titulo: "Pass parameters",
            texto:
              "With an arrow that closes over the value: `onClick={() => remove(id)}` (in classes, `() => this.remove(id)`). With `bind`: `remove.bind(null, id)`, and the event arrives as the last argument. Or read it from the element: `data-id={id}` and `e.currentTarget.dataset.id`, which comes back as a **string**. In a child, the cleanest way is to receive `id` and `onRemove` and call `onRemove(id)` inside.",
          },
          {
            titulo: "Decide whether the cost matters",
            texto:
              "A new function on every render is cheap, and React just swaps the handler reference on the element. The cost appears when it is a prop of a memoized child (`React.memo`, `PureComponent`), where the new identity forces a re-render, or a dependency of `useEffect`, `useMemo` or `useCallback`. Measure before optimizing.",
          },
          {
            titulo: "Stabilize the identity when you must",
            texto:
              "In a function component, wrap the handler in `useCallback(fn, deps)` and the child in `React.memo`: the child only re-renders if its props actually change. Use the functional setter (`setX((v) => ...)`) so you do not depend on the state and keep the dependencies short. The React Compiler can memoize this automatically; check react.dev.",
          },
          {
            titulo: "Validate",
            texto:
              "Signs of success: the click works without a `TypeError`, and the React DevTools Profiler shows the memoized child does not re-render when only the parent changes. Without a measured re-render, do not add `useCallback`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Class: three ways to bind",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class Buttons extends Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this); // (1) bind in the constructor
  }

  save() { console.log(this.props.id); }
  open = () => console.log(this.props.id); // (2) arrow as a class field

  render() {
    return (
      <>
        <button onClick={this.save}>Save</button>
        <button onClick={this.open}>Open</button>
        <button onClick={() => this.save()}>Inline</button> {/* (3) inline arrow */}
      </>
    );
  }
}`,
        nota: "Without the `bind` in item (1), the first button would throw a `TypeError`: `this` would be `undefined`.",
      },
      {
        tipo: "codigo",
        titulo: "Function: argument by closure and stable identity",
        legenda: "JSX",
        codigo: `import { memo, useCallback, useState } from "react";

const Row = memo(function Row({ id, onRemove }) {
  return <button onClick={() => onRemove(id)}>Remove {id}</button>;
});

export function List() {
  const [ids, setIds] = useState([1, 2, 3]);

  // stable identity: Row (memo) does not re-render because of this function
  const remove = useCallback((id) => {
    setIds((current) => current.filter((x) => x !== id));
  }, []);

  return ids.map((id) => <Row key={id} id={id} onRemove={remove} />);
}`,
        nota: "The functional setter keeps `ids` out of the dependencies, so `remove` can have an empty list without reading a stale value.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule for choosing",
        texto:
          "Function component: write the function inside the component and pass the reference; use an **arrow function** (a short function with no `this` of its own) only to carry arguments. Class: use a **class field arrow** or `bind` in the constructor, and avoid `bind` inside JSX. Only add `useCallback` together with `React.memo` (or when the handler is a hook dependency) if a measured re-render is worth the effort.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Calling is not binding",
        texto:
          "`onClick={this.save()}` and `onClick={save(id)}` **run** the function during render; binding means handing over the function. The opposite mistake exists too: `useCallback` on a handler passed to a child that is not memoized prevents nothing, it only adds dependencies to get wrong.",
      },
    ],
    armadilhas: [
      "Passing `this.method` unbound in a class: `this` becomes `undefined` and the click throws a `TypeError`.",
      "Writing `onClick={save(id)}` thinking it passes the argument: the function runs during render. Use `() => save(id)`.",
      "`useCallback` with a wrong dependency list (empty, but reading state): the handler keeps stale values. Use the functional setter or list everything it uses.",
      "Wrapping every handler in `useCallback` “just in case”: with no memoized child and no hook dependency there is no gain.",
    ],
    autoteste: [
      {
        pergunta: "Why is `this` `undefined` in a class handler without `bind`?",
        resposta:
          "Because `onClick={this.save}` passes the function detached from the object. React calls it with no receiver and, in strict mode (class bodies), `this` is `undefined`. `bind` or an arrow as a class field pins `this` to the instance.",
      },
      {
        pergunta:
          "How do you pass an item’s `id` to the handler, and when does a new function on every render become a problem?",
        resposta:
          "With an arrow that closes over the value (`() => remove(id)`). It becomes a problem when the function is a prop of a memoized child or a hook dependency; then use `useCallback` together with `React.memo`, after measuring.",
      },
    ],
  },
};
