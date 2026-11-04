import type { Pergunta } from "../../tipos";

// L100 · Como funciona a memoização
export const l100: Pergunta = {
  numero: 100,
  modulo: "linkedin-desempenho",
  metodo: "firstprinciples",
  pt: {
    titulo: "Como funciona a memoização",
    pergunta: "Como funciona a memoização no React?",
    porqueEsteMetodo:
      "`useMemo`, `useCallback` e `memo` parecem três mecanismos sem relação até você ver que são a mesma ideia aplicada a coisas diferentes. Construir a memoização do zero e conferir onde ela quebra explica as três e as dependências.",
    resposta30s:
      "**Memoizar** é guardar o resultado de uma **função pura** para as últimas entradas e reaproveitá-lo quando elas se repetem, trocando um pouco de memória e uma comparação pelo cálculo evitado. No React, `useMemo` memoiza um **valor**, `useCallback` a **identidade de uma função** e `React.memo` o **render de um componente**; em todos, as entradas são a **lista de dependências** ou as props, comparadas **por referência** (`Object.is`). Tem custo e só compensa em trabalho caro e repetido; o **React Compiler** automatiza grande parte disso (confira react.dev).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo a memoização, uma falha por vez",
        passos: [
          {
            titulo: "0. A ideia",
            texto:
              "Uma função **pura** devolve o mesmo resultado para as mesmas entradas e não tem efeitos. Então, se ela já foi chamada com essas entradas, repetir o cálculo é trabalho jogado fora.",
          },
          {
            titulo: "1. A versão mais simples: recalcular sempre",
            texto:
              "O React chama a função de cada componente a cada render, e refaz todo o cálculo do corpo. → Quebra: se o cálculo é caro (ordenar milhares de itens) ou se o resultado vai para quem compara por referência, o trabalho se repete e filhos renderizam à toa.",
          },
          {
            titulo: "2. Guardar a última chamada",
            texto:
              "Guarde as entradas e o resultado da última chamada; se as entradas de agora forem iguais, devolva o guardado (veja o código). É a memoização de tamanho um, que é a que o React usa. → Pergunta que surge: o que quer dizer “igual”?",
          },
          {
            titulo: "3. Igual por referência",
            texto:
              "Comparar objetos por conteúdo é caro e ambíguo (profundidade, ciclos, funções). O React usa `Object.is`: primitivos são iguais pelo valor; objetos e funções, só se forem a **mesma referência**. → Consequência: um objeto criado de novo a cada render nunca acerta o cache.",
          },
          {
            titulo: "4. Levar para o React",
            texto:
              "A função do componente roda de novo a cada render, então o cache não pode ficar numa variável local: o React o guarda para você, associado à posição do hook (por isso os hooks dependem da ordem de chamada; veja L62). `useMemo(fn, deps)` memoiza um **valor**; `useCallback(fn, deps)` memoiza a **identidade de uma função**; `memo(Componente)` memoiza o **render**, com as props como entradas (veja L98).",
          },
          {
            titulo: "5. O que quebra: dependências erradas e custo",
            texto:
              "A lista de dependências é a lista de entradas: se faltar uma, o valor fica **velho** (usa dados de um render anterior); se uma for recriada a cada render, o cache nunca acerta. Além disso, cada memoização guarda valor e dependências na memória e compara a cada render, e o React pode descartar o cache, então o código deve funcionar sem ele. Conserto: listar tudo que o cálculo lê (a regra de lint `exhaustive-deps` ajuda), memoizar só o que foi medido e tratar a memoização como otimização, nunca como garantia.",
          },
          {
            titulo: "6. O próximo passo: automatizar",
            texto:
              "O **React Compiler**, uma ferramenta de build, analisa os componentes e insere memoização onde é seguro, o que reduz o `useMemo`, o `useCallback` e o `memo` escritos à mão. Ele exige código que siga as regras do React (puro, sem mutar props ou estado). Confira o suporte atual em react.dev (veja L117 e L118).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma memoização de tamanho um, do zero",
        legenda: "JavaScript",
        codigo: `function memoizarUltima(fn) {
  let ultimosArgs = null;
  let ultimoResultado;
  return (...args) => {
    const igual =
      ultimosArgs !== null &&
      args.length === ultimosArgs.length &&
      args.every((a, i) => Object.is(a, ultimosArgs[i]));
    if (igual) return ultimoResultado; // acerto: nenhuma conta
    const resultado = fn(...args);
    ultimosArgs = args;
    ultimoResultado = resultado;
    return resultado;
  };
}

const total = memoizarUltima((itens) => itens.reduce((s, i) => s + i.preco, 0));
const lista = [{ preco: 10 }, { preco: 5 }];
total(lista); // calcula
total(lista); // mesma referência: reaproveita
total([...lista]); // cópia nova: recalcula, mesmo com o mesmo conteúdo`,
        nota: "É o mesmo contrato do `useMemo`: entradas iguais por `Object.is`, resultado guardado. A diferença é que o React guarda o cache por você e chama as entradas de “dependências”.",
      },
      {
        tipo: "tabela",
        titulo: "As ferramentas do React",
        colunas: ["Ferramenta", "O que memoiza", "Entradas", "Quando faz sentido"],
        linhas: [
          [
            "`useMemo(() => calculo, deps)`",
            "O resultado de um cálculo (um valor)",
            "A lista de dependências",
            "Cálculo comprovadamente caro, ou valor passado a um filho em `memo` ou usado como dependência de outro hook",
          ],
          [
            "`useCallback(fn, deps)`",
            "A identidade de uma função (a mesma função de volta)",
            "A lista de dependências",
            "Função passada a um filho em `memo` ou usada como dependência de um efeito",
          ],
          [
            "`memo(Componente)`",
            "O resultado do render de um componente",
            "As props (comparação rasa, ou um comparador próprio)",
            "Componente caro que renderiza muitas vezes com as mesmas props",
          ],
          [
            "React Compiler",
            "Componentes e valores, automaticamente",
            "Análise do código em tempo de build",
            "Base de código que segue as regras do React; confira o suporte em react.dev",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando compensa",
        texto:
          "Memoizar troca **memória e comparação** por **cálculo evitado**. Só compensa se o trabalho evitado é caro, as entradas se repetem com frequência e comparar é barato. Receita: meça, memoize o que é caro e estabilize com `useMemo` e `useCallback` apenas o que alguém compara por referência (filho em `memo`, dependência de efeito ou de outro hook). Veja também L57, L58 e L59.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A memoização supõe pureza e imutabilidade",
        texto:
          "Memoizar uma função que depende de relógio, de valor aleatório ou de dado externo devolve resultados velhos. E **mutar** um objeto de entrada não muda a referência: o cache acha que nada mudou e devolve o resultado antigo. Por isso o React pede estado imutável (sempre uma cópia nova ao atualizar).",
      },
    ],
    armadilhas: [
      "Dependências incompletas (valor velho) ou instáveis, como um objeto recriado a cada render (o cache nunca acerta).",
      "Memoizar tudo “por via das dúvidas”: cada hook tem custo de memória e de comparação, e o código fica mais difícil de ler.",
      "Tratar a memoização como garantia: o React pode descartar o cache, e o código precisa funcionar corretamente sem ele.",
      "Memoizar uma função impura ou mutar o objeto de entrada: a referência não muda e o cache devolve um resultado velho.",
    ],
    autoteste: [
      {
        pergunta: "Por que a memoização do React guarda só a última chamada e compara por referência?",
        resposta:
          "Porque é simples e barata: guardar muitos resultados gastaria memória, e comparar objetos por conteúdo custaria quase tanto quanto refazer o cálculo. Em troca, é preciso manter as entradas estáveis (mesma referência) para o cache acertar.",
      },
      {
        pergunta: "O que acontece se você esquece uma dependência de um `useMemo`?",
        resposta:
          "O valor memoizado não é recalculado quando essa dependência muda, e a tela usa um resultado velho. A regra de lint `exhaustive-deps` existe para pegar esse esquecimento.",
      },
    ],
  },
  en: {
    titulo: "How memoization works",
    pergunta: "How does memoization work in React?",
    porqueEsteMetodo:
      "`useMemo`, `useCallback` and `memo` look like three unrelated mechanisms until you see they are one idea applied to different things. Building memoization from scratch and checking where it breaks explains all three, and the dependencies.",
    resposta30s:
      "**Memoizing** means storing the result of a **pure function** for the latest inputs and reusing it when they repeat, trading a little memory and a comparison for the calculation avoided. In React, `useMemo` memoizes a **value**, `useCallback` the **identity of a function** and `React.memo` the **render of a component**; in all of them the inputs are the **dependency list** or the props, compared **by reference** (`Object.is`). It has a cost and only pays off on expensive, repeated work; the **React Compiler** automates much of it (check react.dev).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building memoization, one flaw at a time",
        passos: [
          {
            titulo: "0. The idea",
            texto:
              "A **pure** function returns the same result for the same inputs and has no side effects. So if it was already called with those inputs, repeating the calculation is wasted work.",
          },
          {
            titulo: "1. The simplest version: always recalculate",
            texto:
              "React calls each component’s function on every render and redoes the whole calculation in the body. → Breaks: if the calculation is expensive (sorting thousands of items) or the result goes to something that compares by reference, the work repeats and children render for nothing.",
          },
          {
            titulo: "2. Store the last call",
            texto:
              "Keep the inputs and the result of the last call; if the current inputs are equal, return the stored one (see the code). This is size-one memoization, which is the kind React uses. → The question that arises: what does “equal” mean?",
          },
          {
            titulo: "3. Equal by reference",
            texto:
              "Comparing objects by content is expensive and ambiguous (depth, cycles, functions). React uses `Object.is`: primitives are equal by value; objects and functions only if they are the **same reference**. → Consequence: an object created anew on every render never hits the cache.",
          },
          {
            titulo: "4. Bring it into React",
            texto:
              "A component function runs again on every render, so the cache cannot sit in a local variable: React keeps it for you, tied to the hook’s position (which is why hooks depend on call order; see L62). `useMemo(fn, deps)` memoizes a **value**; `useCallback(fn, deps)` memoizes the **identity of a function**; `memo(Component)` memoizes the **render**, with props as the inputs (see L98).",
          },
          {
            titulo: "5. What breaks: wrong dependencies and cost",
            texto:
              "The dependency list is the list of inputs: if one is missing, the value goes **stale** (it uses data from an earlier render); if one is recreated on every render, the cache never hits. On top of that, each memoization stores a value and dependencies in memory and compares on every render, and React may discard the cache, so the code must work without it. Fix: list everything the calculation reads (the `exhaustive-deps` lint rule helps), memoize only what was measured and treat memoization as an optimization, never as a guarantee.",
          },
          {
            titulo: "6. The next step: automate",
            texto:
              "The **React Compiler**, a build tool, analyzes components and inserts memoization where it is safe, which reduces the `useMemo`, `useCallback` and `memo` written by hand. It requires code that follows the rules of React (pure, no mutating props or state). Check current support at react.dev (see L117 and L118).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Size-one memoization, from scratch",
        legenda: "JavaScript",
        codigo: `function memoizeLast(fn) {
  let lastArgs = null;
  let lastResult;
  return (...args) => {
    const same =
      lastArgs !== null &&
      args.length === lastArgs.length &&
      args.every((a, i) => Object.is(a, lastArgs[i]));
    if (same) return lastResult; // hit: no calculation
    const result = fn(...args);
    lastArgs = args;
    lastResult = result;
    return result;
  };
}

const total = memoizeLast((items) => items.reduce((s, i) => s + i.price, 0));
const list = [{ price: 10 }, { price: 5 }];
total(list); // calculates
total(list); // same reference: reuses
total([...list]); // a new copy: recalculates, even with the same content`,
        nota: "It is the same contract as `useMemo`: inputs equal by `Object.is`, result stored. The difference is that React keeps the cache for you and calls the inputs “dependencies”.",
      },
      {
        tipo: "tabela",
        titulo: "React’s tools",
        colunas: ["Tool", "What it memoizes", "Inputs", "When it makes sense"],
        linhas: [
          [
            "`useMemo(() => calculation, deps)`",
            "The result of a calculation (a value)",
            "The dependency list",
            "A provably expensive calculation, or a value passed to a `memo` child or used as a dependency of another hook",
          ],
          [
            "`useCallback(fn, deps)`",
            "The identity of a function (the same function back)",
            "The dependency list",
            "A function passed to a `memo` child or used as an effect dependency",
          ],
          [
            "`memo(Component)`",
            "The result of a component’s render",
            "The props (shallow comparison, or a custom comparison)",
            "An expensive component that renders often with the same props",
          ],
          [
            "React Compiler",
            "Components and values, automatically",
            "Analysis of the code at build time",
            "A codebase that follows the rules of React; check support at react.dev",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When it pays off",
        texto:
          "Memoizing trades **memory and comparison** for **avoided calculation**. It only pays off if the avoided work is expensive, the inputs repeat often and comparing is cheap. Recipe: measure, memoize what is expensive, and stabilize with `useMemo` and `useCallback` only what someone compares by reference (a `memo` child, an effect or another hook’s dependency). See also L57, L58 and L59.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Memoization assumes purity and immutability",
        texto:
          "Memoizing a function that depends on the clock, a random value or external data returns stale results. And **mutating** an input object does not change its reference: the cache thinks nothing changed and returns the old result. That is why React asks for immutable state (always a new copy when updating).",
      },
    ],
    armadilhas: [
      "Incomplete dependencies (stale value) or unstable ones, such as an object recreated on every render (the cache never hits).",
      "Memoizing everything “just in case”: each hook has a memory and comparison cost, and the code gets harder to read.",
      "Treating memoization as a guarantee: React may discard the cache, and the code must work correctly without it.",
      "Memoizing an impure function or mutating the input object: the reference does not change and the cache returns a stale result.",
    ],
    autoteste: [
      {
        pergunta: "Why does React’s memoization keep only the last call and compare by reference?",
        resposta:
          "Because it is simple and cheap: storing many results would use memory, and comparing objects by content would cost almost as much as redoing the calculation. In exchange, you must keep inputs stable (the same reference) for the cache to hit.",
      },
      {
        pergunta: "What happens if you forget a dependency of a `useMemo`?",
        resposta:
          "The memoized value is not recalculated when that dependency changes, and the screen uses a stale result. The `exhaustive-deps` lint rule exists to catch that omission.",
      },
    ],
  },
};
