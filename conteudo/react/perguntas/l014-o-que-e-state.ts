import type { Pergunta } from "../../tipos";

// L14 · O que é state
export const l014: Pergunta = {
  numero: 14,
  modulo: "linkedin-fundamentos",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é state",
    pergunta: "O que é state?",
    porqueEsteMetodo:
      "O `useState` parece uma regra arbitrária (por que não uma variável comum?) até você ver cada característica nascer de uma falha da versão anterior. Partir da variável local e consertar uma restrição por vez mostra por que o state é como é.",
    resposta30s:
      "**State** é a **memória de um componente** entre renderizações, mais o pedido para o React renderizar de novo quando ela muda. Variáveis locais não servem: são recriadas a cada chamada e mudá-las não avisa o React. Com `useState` você recebe o valor atual e um **setter**; chamá-lo **agenda** uma nova renderização, que enxerga um novo **snapshot** do valor; cada instância tem o seu state, e o que se calcula de outros valores **não deve** virar state.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Uma tela que reage ao tempo: o clique de agora deve mudar o que aparece, e o contador precisa lembrar o valor entre uma renderização e a seguinte.",
          },
          {
            titulo: "1. A versão mais simples: uma variável local",
            texto:
              "`let contador = 0` dentro do componente, com `contador++` no clique. → Quebra: o React não é avisado e não renderiza de novo; e mesmo que renderizasse, a função do componente roda de novo do zero e `contador` volta a `0`.",
          },
          {
            titulo: "2. Uma variável fora do componente",
            texto:
              "Mover o contador para o módulo, onde ele sobrevive às chamadas. → Quebra: é uma variável só para todas as instâncias (dois `<Contador />` compartilhariam o valor), e alterá-la continua sem avisar o React.",
          },
          {
            titulo: "3. Memória por instância e pedido de renderização",
            texto:
              "É isso que o `useState` oferece: o React guarda o valor associado a esta instância, na posição do Hook, e devolve `[valor, setValor]`. O setter faz duas coisas: guarda o valor novo e **agenda** uma renderização. → Resolve: cada instância tem o seu valor e a tela atualiza. → Ainda surpreende: o valor não muda na hora.",
          },
          {
            titulo: "4. Cada renderização enxerga um snapshot",
            texto:
              "Dentro de uma renderização, `valor` é fixo, como uma constante daquela chamada. `setValor(valor + 1)` não muda `valor` agora: define o que a próxima renderização verá. → Quebra: chamar `setValor(valor + 1)` três vezes seguidas soma 1, não 3, porque as três leem o mesmo snapshot.",
          },
          {
            titulo: "5. A forma funcional do setter",
            texto:
              "`setValor((v) => v + 1)` entrega ao React uma função, e ele aplica as atualizações em fila, cada uma sobre o resultado da anterior. Use sempre que o valor novo depender do anterior. O React também agrupa várias atualizações do mesmo evento em uma só renderização.",
          },
          {
            titulo: "6. Quando não guardar",
            texto:
              "Se o valor pode ser calculado a partir de props ou de outro state, calcule durante a renderização (`const total = itens.length`): guardar a cópia cria duas verdades que podem divergir. Se mudar o valor não precisa mudar a tela (um id de timer, por exemplo), ele não é state (veja C19).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Snapshot contra forma funcional",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Contador() {
  const [valor, setValor] = useState(0);

  function somarTresErrado() {
    setValor(valor + 1);
    setValor(valor + 1);
    setValor(valor + 1); // os três leem o mesmo snapshot: o próximo valor é 1
  }

  function somarTres() {
    setValor((v) => v + 1);
    setValor((v) => v + 1);
    setValor((v) => v + 1); // cada um parte do anterior: o próximo valor é 3
  }

  return <button onClick={somarTres}>{valor}</button>;
}`,
        nota: "Dentro de uma mesma chamada, `valor` continua com o número antigo mesmo depois dos setters: um `console.log(valor)` logo depois mostra o valor de antes.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Em uma frase",
        texto:
          "State é a **memória local** de uma instância, e o setter é o **único caminho** para mudá-la, porque é ele que avisa o React. Cada renderização vê um **snapshot** fixo; use a **forma funcional** quando o valor novo depende do anterior e **derive** em vez de guardar o que pode ser calculado.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O state é da instância, e some com ela",
        texto:
          "O state pertence a uma instância na árvore: dois `<Contador />` têm states independentes. Quando o componente sai da tela, o state é descartado, e uma instância nova (outro componente naquela posição, ou o mesmo com outra `key`) começa do valor inicial. Também não altere o state no lugar: objetos e arrays se trocam por cópias novas (veja L17).",
      },
    ],
    armadilhas: [
      "Esperar o valor novo logo depois de chamar o setter: a renderização atual não muda, e o valor novo só aparece na próxima.",
      "Chamar o setter várias vezes com `valor + 1` esperando somar várias vezes: use a forma funcional.",
      "Guardar em state o que se calcula de props ou de outro state (como o total de uma lista): vira uma segunda fonte da verdade que diverge.",
      "Usar uma variável comum no lugar do state, ou mudar o state no lugar (`lista.push(x)`): o React não é avisado (veja L17).",
    ],
    autoteste: [
      {
        pergunta: "Por que uma variável local (`let`) não substitui o state?",
        resposta:
          "Porque é recriada a cada chamada do componente e, mesmo que persistisse, alterá-la não avisa o React para renderizar de novo.",
      },
      {
        pergunta: "O que `console.log(valor)` mostra logo depois de `setValor(valor + 1)`?",
        resposta:
          "O valor antigo. A renderização atual enxerga um snapshot fixo; o valor novo só aparece na próxima renderização, que o setter agendou.",
      },
    ],
  },
  en: {
    titulo: "What state is",
    pergunta: "What is state?",
    porqueEsteMetodo:
      "`useState` looks like an arbitrary rule (why not a plain variable?) until you watch each of its traits come out of a flaw in the previous version. Starting from the local variable and fixing one restriction at a time shows why state is the way it is.",
    resposta30s:
      "**State** is a **component’s memory** between renders, plus a request for React to render again when it changes. Local variables do not work: they are recreated on every call and changing them does not notify React. With `useState` you get the current value and a **setter**; calling it **schedules** a new render, which sees a new **snapshot** of the value; each instance has its own state, and whatever can be computed from other values **should not** become state.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What we want",
            texto:
              "A screen that reacts over time: the click happening now must change what is shown, and the counter must remember its value from one render to the next.",
          },
          {
            titulo: "1. The simplest version: a local variable",
            texto:
              "`let counter = 0` inside the component, with `counter++` on click. → Breaks: React is not notified and does not render again; and even if it did, the component function runs again from scratch and `counter` goes back to `0`.",
          },
          {
            titulo: "2. A variable outside the component",
            texto:
              "Move the counter to the module, where it survives the calls. → Breaks: it is one variable for all instances (two `<Counter />` would share the value), and changing it still does not notify React.",
          },
          {
            titulo: "3. Per-instance memory and a render request",
            texto:
              "That is what `useState` offers: React keeps the value tied to this instance, at the Hook’s position, and returns `[value, setValue]`. The setter does two things: stores the new value and **schedules** a render. → Fixes: each instance has its own value and the screen updates. → Still surprising: the value does not change right away.",
          },
          {
            titulo: "4. Each render sees a snapshot",
            texto:
              "Within a render, `value` is fixed, like a constant of that call. `setValue(value + 1)` does not change `value` now: it sets what the next render will see. → Breaks: calling `setValue(value + 1)` three times in a row adds 1, not 3, because all three read the same snapshot.",
          },
          {
            titulo: "5. The functional form of the setter",
            texto:
              "`setValue((v) => v + 1)` hands React a function, and it applies the updates in a queue, each on the result of the previous one. Use it whenever the new value depends on the old one. React also batches several updates from the same event into a single render.",
          },
          {
            titulo: "6. When not to store",
            texto:
              "If a value can be computed from props or from other state, compute it during render (`const total = items.length`): storing a copy creates two truths that can diverge. If changing the value does not need to change the screen (a timer id, for example), it is not state (see C19).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Snapshot versus functional form",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Counter() {
  const [value, setValue] = useState(0);

  function addThreeWrong() {
    setValue(value + 1);
    setValue(value + 1);
    setValue(value + 1); // all three read the same snapshot: the next value is 1
  }

  function addThree() {
    setValue((v) => v + 1);
    setValue((v) => v + 1);
    setValue((v) => v + 1); // each starts from the previous one: the next value is 3
  }

  return <button onClick={addThree}>{value}</button>;
}`,
        nota: "Within the same call, `value` keeps the old number even after the setters: a `console.log(value)` right after shows the previous value.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "In one sentence",
        texto:
          "State is an instance’s **local memory**, and the setter is the **only way** to change it, because it is what notifies React. Each render sees a fixed **snapshot**; use the **functional form** when the new value depends on the old one and **derive** instead of storing what can be computed.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "State belongs to the instance, and goes away with it",
        texto:
          "State belongs to an instance in the tree: two `<Counter />` have independent states. When the component leaves the screen, its state is discarded, and a new instance (another component at that position, or the same one with a different `key`) starts from the initial value. Also do not change state in place: objects and arrays are replaced with new copies (see L17).",
      },
    ],
    armadilhas: [
      "Expecting the new value right after calling the setter: the current render does not change, and the new value only shows up on the next one.",
      "Calling the setter several times with `value + 1` expecting it to add several times: use the functional form.",
      "Storing in state what is computed from props or other state (such as a list’s total): it becomes a second source of truth that drifts apart.",
      "Using a plain variable instead of state, or changing state in place (`list.push(x)`): React is not notified (see L17).",
    ],
    autoteste: [
      {
        pergunta: "Why can’t a local variable (`let`) replace state?",
        resposta:
          "Because it is recreated on every call of the component and, even if it persisted, changing it does not tell React to render again.",
      },
      {
        pergunta: "What does `console.log(value)` show right after `setValue(value + 1)`?",
        resposta:
          "The old value. The current render sees a fixed snapshot; the new value only appears on the next render, which the setter scheduled.",
      },
    ],
  },
};
