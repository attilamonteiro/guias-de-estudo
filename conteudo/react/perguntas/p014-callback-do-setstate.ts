import type { Pergunta } from "../../tipos";

// P14 · Callback do setState
export const p014: Pergunta = {
  numero: 414,
  modulo: "pedrincandido-core",
  metodo: "trace",
  pt: {
    titulo: "Callback do setState",
    pergunta: "Qual é o propósito da função callback como um argumento de setState()?",
    porqueEsteMetodo:
      "O callback só faz sentido quando você enxerga a ordem dos acontecimentos: a chamada apenas agenda, o React agrupa, renderiza, atualiza o DOM e só então chama a função. Acompanhar uma única chamada de `setState` mostra o que ela garante e o que não garante.",
    resposta30s:
      "O segundo argumento de `this.setState(atualização, callback)` é uma função que o React chama **depois** de aplicar a atualização e de atualizar o DOM, quando `this.state` já tem o valor novo. Ele existe porque `setState` **não é imediato**: as chamadas são **agrupadas em lote**, e ler `this.state` logo depois ainda devolve o valor antigo. Não o confunda com a **forma funcional** `(estadoAnterior, props) => ...`, que é o primeiro argumento e calcula o novo estado a partir do anterior; em componentes de função o setter não tem callback, e o equivalente é o `useEffect`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O que acontece numa chamada de setState",
        etapas: [
          "O manipulador de evento chama `this.setState(atualização, callback)`: o React só **enfileira** a atualização e guarda o callback; `this.state` não muda neste instante",
          "O manipulador continua e termina; todas as chamadas de `setState` feitas nele caem na mesma fila (**batching**)",
          "Só então o React processa a fila: aplica os objetos e executa as funções atualizadoras em ordem, cada uma recebendo o resultado da anterior",
          "O componente renderiza com o estado novo (fase de render, que deve ser pura)",
          "O React atualiza o DOM (fase de commit) e chama `componentDidUpdate`",
          "Por fim, chama o callback do `setState`, já com `this.state` atualizado e o DOM no lugar",
        ],
        nota: "O callback e o `componentDidUpdate` rodam na mesma fase de commit. A documentação recomenda `componentDidUpdate` para lógica desse tipo; o callback serve quando o efeito pertence àquela chamada específica. Com a API de raiz atual (`createRoot`), o agrupamento vale também em timeouts, promises e eventos nativos, não só nos eventos do React.",
      },
      {
        tipo: "passos",
        titulo: "O caminho em que dá errado",
        passos: [
          {
            titulo: "Ler o estado logo depois",
            texto:
              "`this.setState({ n: 1 }); console.log(this.state.n);` mostra o valor antigo. Não há mágica de promise: a atualização está na fila e o estado só muda quando o React processa a fila.",
          },
          {
            titulo: "Duas atualizações que dependem do valor anterior",
            texto:
              "`this.setState({ n: this.state.n + 1 })` duas vezes lê o mesmo `this.state.n` nas duas e soma uma vez só. A forma funcional, `this.setState((anterior, props) => ({ n: anterior.n + props.passo }))`, recebe o estado já com as atualizações anteriores da fila.",
          },
          {
            titulo: "Esperar o DOM",
            texto:
              "Medir um elemento ou dar foco logo depois de `setState` pode pegar o DOM ainda antigo. Faça isso no callback (ou no `componentDidUpdate`), quando o DOM já reflete o estado.",
          },
          {
            titulo: "O equivalente em hooks",
            texto:
              "O setter de `useState` não aceita callback (o React avisa em desenvolvimento). Use o setter funcional para depender do valor anterior e o `useEffect`, com o valor nas dependências, para reagir depois do render. Se precisar rodar antes da pintura, use `useLayoutEffect`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Em classe: valor antigo, forma funcional e callback",
        legenda: "JSX",
        codigo: `import { Component } from "react";

export class Contador extends Component {
  state = { n: 0 };

  somar = () => {
    this.setState({ n: this.state.n + 1 });
    console.log(this.state.n); // 0: ainda o valor antigo

    this.setState(
      (anterior) => ({ n: anterior.n + 1 }), // recebe o valor já enfileirado (1)
      () => console.log(this.state.n), // 2: estado aplicado e DOM atualizado
    );
  };

  render() {
    return <button onClick={this.somar}>{this.state.n}</button>;
  }
}`,
        nota: "Partindo de 0, um clique registra 0 e depois 2; o botão passa a mostrar 2.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo em componente de função",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

export function Contador() {
  const [n, setN] = useState(0);

  function somar() {
    setN((anterior) => anterior + 1); // setter funcional
    setN((anterior) => anterior + 1); // soma de novo: n vai de 0 a 2
  }

  useEffect(() => {
    console.log(n); // depois de cada render em que n mudou
  }, [n]);

  return <button onClick={somar}>{n}</button>;
}`,
        nota: "O efeito também roda na montagem. Ele funciona para qualquer origem da mudança de `n`, não só para aquela chamada do setter, e normalmente roda depois da pintura.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra prática",
        texto:
          "Dependeu do valor anterior? Use a **forma funcional**. Precisa de algo **depois** de o estado ser aplicado e o DOM atualizado? Use o callback do `setState` ou o `componentDidUpdate` (classes), ou o `useEffect` (hooks). E nunca leia `this.state` logo depois do `setState` esperando o valor novo.",
      },
    ],
    armadilhas: [
      "Ler `this.state` (ou a variável de `useState`) logo depois do setter e esperar o valor novo: a atualização só é aplicada quando o React processa a fila.",
      "Calcular o novo valor com `this.state` em duas chamadas seguidas: as duas leem o mesmo valor e uma atualização se perde. Use a forma funcional.",
      "Passar um segundo argumento ao setter de `useState`: ele não existe em hooks; use `useEffect`.",
      "Chamar `setState` sem condição dentro do callback ou do `componentDidUpdate`: cada atualização dispara outra, e o resultado é um laço infinito.",
    ],
    autoteste: [
      {
        pergunta:
          "Qual é a diferença entre o callback (segundo argumento) e a função atualizadora (primeiro argumento) do `setState`?",
        resposta:
          "A função atualizadora calcula o novo estado: recebe o estado anterior e as props e devolve o objeto a mesclar. O callback não devolve nada: roda depois, quando o estado já foi aplicado e o DOM atualizado, para efeitos que dependem do resultado.",
      },
      {
        pergunta: "Como obter, num componente de função, o efeito do callback do `setState`?",
        resposta:
          "Com `useEffect` (ou `useLayoutEffect`) tendo o valor nas dependências: ele roda depois do render em que o valor mudou. Para depender do valor anterior ao calcular, use o setter funcional.",
      },
    ],
  },
  en: {
    titulo: "The setState callback",
    pergunta: "What is the purpose of the callback function as an argument of setState()?",
    porqueEsteMetodo:
      "The callback only makes sense once you see the order of events: the call merely schedules, React batches, renders, updates the DOM and only then calls your function. Following a single `setState` call shows what it guarantees and what it does not.",
    resposta30s:
      "The second argument of `this.setState(update, callback)` is a function React calls **after** the update has been applied and the DOM updated, when `this.state` already holds the new value. It exists because `setState` is **not immediate**: calls are **batched**, and reading `this.state` right afterwards still returns the old value. Do not confuse it with the **functional form** `(prevState, props) => ...`, which is the first argument and computes the new state from the previous one; in function components the setter has no callback, and the equivalent is `useEffect`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "What happens in a setState call",
        etapas: [
          "The event handler calls `this.setState(update, callback)`: React only **queues** the update and remembers the callback; `this.state` does not change at this instant",
          "The handler keeps going and finishes; every `setState` call made in it lands in the same queue (**batching**)",
          "Only then does React process the queue: it applies the objects and runs the updater functions in order, each one receiving the result of the previous one",
          "The component renders with the new state (the render phase, which must be pure)",
          "React updates the DOM (the commit phase) and calls `componentDidUpdate`",
          "Finally it calls the `setState` callback, with `this.state` already updated and the DOM in place",
        ],
        nota: "The callback and `componentDidUpdate` run in the same commit phase. The documentation recommends `componentDidUpdate` for logic like this; the callback fits when the effect belongs to that specific call. With the current root API (`createRoot`), batching also applies inside timeouts, promises and native events, not only React events.",
      },
      {
        tipo: "passos",
        titulo: "The path where it goes wrong",
        passos: [
          {
            titulo: "Reading the state right afterwards",
            texto:
              "`this.setState({ n: 1 }); console.log(this.state.n);` prints the old value. There is no promise magic: the update sits in the queue, and the state only changes when React processes the queue.",
          },
          {
            titulo: "Two updates that depend on the previous value",
            texto:
              "`this.setState({ n: this.state.n + 1 })` twice reads the same `this.state.n` both times and adds only once. The functional form, `this.setState((prev, props) => ({ n: prev.n + props.step }))`, receives the state already including the earlier updates in the queue.",
          },
          {
            titulo: "Waiting for the DOM",
            texto:
              "Measuring an element or focusing it right after `setState` may hit the old DOM. Do it in the callback (or in `componentDidUpdate`), when the DOM already reflects the state.",
          },
          {
            titulo: "The hooks equivalent",
            texto:
              "The `useState` setter does not accept a callback (React warns in development). Use the functional setter to depend on the previous value and `useEffect`, with the value in its dependencies, to react after the render. If it has to run before paint, use `useLayoutEffect`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "In a class: old value, functional form and callback",
        legenda: "JSX",
        codigo: `import { Component } from "react";

export class Counter extends Component {
  state = { n: 0 };

  add = () => {
    this.setState({ n: this.state.n + 1 });
    console.log(this.state.n); // 0: still the old value

    this.setState(
      (prev) => ({ n: prev.n + 1 }), // receives the already queued value (1)
      () => console.log(this.state.n), // 2: state applied and DOM updated
    );
  };

  render() {
    return <button onClick={this.add}>{this.state.n}</button>;
  }
}`,
        nota: "Starting from 0, one click logs 0 and then 2; the button then shows 2.",
      },
      {
        tipo: "codigo",
        titulo: "The same in a function component",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);

  function add() {
    setN((prev) => prev + 1); // functional setter
    setN((prev) => prev + 1); // adds again: n goes from 0 to 2
  }

  useEffect(() => {
    console.log(n); // after every render in which n changed
  }, [n]);

  return <button onClick={add}>{n}</button>;
}`,
        nota: "The effect also runs on mount. It works for any source of the change to `n`, not just that one setter call, and it normally runs after paint.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule of thumb",
        texto:
          "Does the new value depend on the previous one? Use the **functional form**. Do you need something to happen **after** the state is applied and the DOM updated? Use the `setState` callback or `componentDidUpdate` (classes), or `useEffect` (hooks). And never read `this.state` right after `setState` expecting the new value.",
      },
    ],
    armadilhas: [
      "Reading `this.state` (or the `useState` variable) right after the setter and expecting the new value: the update is only applied when React processes the queue.",
      "Computing the new value from `this.state` in two consecutive calls: both read the same value and one update is lost. Use the functional form.",
      "Passing a second argument to the `useState` setter: it does not exist in hooks; use `useEffect`.",
      "Calling `setState` unconditionally inside the callback or `componentDidUpdate`: each update triggers another, and you get an infinite loop.",
    ],
    autoteste: [
      {
        pergunta:
          "What is the difference between the callback (second argument) and the updater function (first argument) of `setState`?",
        resposta:
          "The updater function computes the new state: it receives the previous state and the props and returns the object to merge. The callback returns nothing: it runs later, once the state has been applied and the DOM updated, for effects that depend on the result.",
      },
      {
        pergunta: "How do you get the effect of the `setState` callback in a function component?",
        resposta:
          "With `useEffect` (or `useLayoutEffect`) that has the value in its dependencies: it runs after the render in which the value changed. To depend on the previous value while computing, use the functional setter.",
      },
    ],
  },
};
