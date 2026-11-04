import type { Pergunta } from "../../tipos";

// L66 · O array de dependências
export const l066: Pergunta = {
  numero: 66,
  modulo: "linkedin-regras-e-effects",
  metodo: "playbook",
  pt: {
    titulo: "O array de dependências",
    pergunta: "O que é o array de dependências no useEffect()?",
    porqueEsteMetodo:
      "Quase todo bug com o array de dependências nasce de preenchê-lo “de cabeça”. Um playbook dá o procedimento certo: listar o que o efeito lê, deixar o linter conferir e decidir caso a caso, em vez de adivinhar.",
    resposta30s:
      "O array de dependências é o segundo argumento do `useEffect`: a lista dos **valores reativos** (props, state e variáveis do componente) que o efeito **lê**. O React compara cada item com o da renderização anterior usando `Object.is` e **só refaz o efeito (limpeza e nova execução) se algum mudou**. Com `[]` o efeito roda só na montagem; **sem array**, roda depois de toda renderização.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: preencher o array sem adivinhar",
        passos: [
          {
            titulo: "Liste o que o efeito lê",
            texto:
              "Percorra o corpo do efeito e anote cada **valor reativo**: props, state e qualquer variável ou função declarada dentro do componente. Ficam de fora o que não muda entre renderizações: constantes e funções declaradas fora do componente, o setter do `useState`, o `dispatch` do `useReducer` e o objeto devolvido por `useRef`.",
          },
          {
            titulo: "Escreva o array e deixe o linter conferir",
            texto:
              "Coloque a lista no array e ative a regra `react-hooks/exhaustive-deps`. Ela aponta o que falta e o que sobra. Siga o aviso em vez de silenciá-lo com `eslint-disable`: uma dependência omitida é um bug de valor desatualizado esperando para acontecer (veja L72).",
          },
          {
            titulo: "Decida o destino de cada dependência apontada",
            texto:
              "Se a mudança do valor deve mesmo refazer o efeito (a sala mudou, reconecte), **inclua**. Se é um objeto ou uma função usada só ali, **mova para dentro do efeito**. Se não depende de nada do componente, **mova para fora** dele.",
          },
          {
            titulo: "Reestruture quando incluir não serve",
            texto:
              "Se o efeito precisa do valor, mas não deve rodar quando ele muda, mude o código, não o array: use a **forma funcional do setter** (`setX((x) => x + 1)`), um `useReducer` ou, para ler o valor mais recente sem ressincronizar, um **Effect Event** (`useEffectEvent`). Este último é um recurso recente: confira o estado dele na sua versão em react.dev.",
          },
          {
            titulo: "Cuidado com objetos, arrays e funções",
            texto:
              "O React compara com `Object.is`: números e strings pelo valor, objetos e funções pela **referência**. Um `{ id }` ou uma função declarada no corpo é novo a cada renderização, e o efeito refaria sempre. Dependa dos valores primitivos (`id`), crie o objeto dentro do efeito ou, se precisa mesmo da mesma referência, use `useMemo` ou `useCallback`.",
          },
          {
            titulo: "Confira o comportamento",
            texto:
              "Mude o valor e veja o efeito refazer, com a limpeza rodando antes. Em desenvolvimento, o Strict Mode executa um ciclo extra de montagem, o que ajuda a achar limpezas e dependências que faltam (veja L69).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Os três casos",
        colunas: ["Forma", "Quando o efeito roda", "Uso típico e risco"],
        linhas: [
          [
            "`useEffect(fn, [a, b])`",
            "Depois da primeira renderização e sempre que `a` ou `b` mudar (comparação com `Object.is`)",
            "O caso normal: sincronizar com `a` e `b`. Risco: esquecer um valor que o efeito lê",
          ],
          [
            "`useEffect(fn, [])`",
            "Uma vez ao montar; a limpeza roda ao desmontar (em desenvolvimento, o Strict Mode faz um ciclo extra)",
            "Só para o que não depende de props nem de state, como assinar um evento global. Risco: ler props ou state aqui deixa valores desatualizados",
          ],
          [
            "`useEffect(fn)`",
            "Depois de toda renderização do componente",
            "Raro. Risco: com `setState` dentro, vira um laço de renderizações, e o custo de rodar sempre",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Objeto no array: o erro silencioso",
        legenda: "JSX",
        codigo: [
          'import { useEffect } from "react";',
          "",
          "// Errado: `opcoes` é um objeto novo a cada renderização, e o efeito reconecta sempre",
          "function SalaErrada({ salaId }) {",
          "  const opcoes = { salaId };",
          "  useEffect(() => {",
          "    const conexao = conectar(opcoes);",
          "    return () => conexao.desconectar();",
          "  }, [opcoes]);",
          "  return <p>Sala {salaId}</p>;",
          "}",
          "",
          "// Certo: o objeto nasce dentro do efeito e a dependência é o valor primitivo",
          "function Sala({ salaId }) {",
          "  useEffect(() => {",
          "    const conexao = conectar({ salaId });",
          "    return () => conexao.desconectar();",
          "  }, [salaId]);",
          "  return <p>Sala {salaId}</p>;",
          "}",
        ].join("\n"),
        nota: "`conectar` é uma função hipotética que abre uma conexão e devolve um objeto com `desconectar`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Silenciar o linter é esconder o bug",
        texto:
          "O aviso do `exhaustive-deps` quase nunca está errado: ele indica que o efeito usa um valor que pode mudar e que a função capturou uma cópia antiga dele. Quando incluir a dependência “causa problema” (o efeito roda demais), o problema está no desenho do efeito ou num valor instável, e a saída é o terceiro ou o quarto passo, não o `eslint-disable`.",
      },
    ],
    armadilhas: [
      "Usar `[]` para “rodar só uma vez” mesmo lendo props ou state dentro do efeito: ele passa a enxergar para sempre os valores da primeira renderização.",
      "Deixar objetos, arrays ou funções criados no corpo do componente no array: eles mudam a cada renderização, e o efeito roda toda vez (às vezes em laço, se ele atualiza state).",
      "Esquecer o array sem querer: o efeito passa a rodar depois de toda renderização.",
      "Tratar o array como “gatilho” em vez de declaração: ele descreve o que o efeito usa, não quando você gostaria que ele rodasse.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece com `useEffect(fn, [])`, com `useEffect(fn)` e com `useEffect(fn, [id])`?",
        resposta:
          "`[]`: roda ao montar e limpa ao desmontar. Sem array: roda depois de toda renderização. `[id]`: roda ao montar e sempre que `id` mudar, depois de rodar a limpeza da execução anterior.",
      },
      {
        pergunta:
          "Por que `useEffect(fn, [opcoes])` roda a cada renderização quando `opcoes` é um `{ id }` criado no corpo?",
        resposta:
          "Porque o objeto é novo a cada renderização e `Object.is` compara objetos por referência: o conteúdo é igual, a referência não. A saída é depender de `id`, ou criar o objeto dentro do efeito.",
      },
    ],
  },
  en: {
    titulo: "The dependency array",
    pergunta: "What is the dependency array in useEffect()?",
    porqueEsteMetodo:
      "Almost every dependency-array bug comes from filling it in “by feel”. A playbook gives the right procedure: list what the effect reads, let the linter check it and decide case by case instead of guessing.",
    resposta30s:
      "The dependency array is the second argument of `useEffect`: the list of **reactive values** (props, state and component variables) that the effect **reads**. React compares each item with the previous render using `Object.is` and **only re-runs the effect (cleanup, then a new run) if one changed**. With `[]` the effect runs only on mount; **with no array**, it runs after every render.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: filling in the array without guessing",
        passos: [
          {
            titulo: "List what the effect reads",
            texto:
              "Walk through the effect body and note every **reactive value**: props, state and any variable or function declared inside the component. What stays out is whatever does not change between renders: constants and functions declared outside the component, the `useState` setter, the `useReducer` `dispatch` and the object returned by `useRef`.",
          },
          {
            titulo: "Write the array and let the linter check it",
            texto:
              "Put the list in the array and enable the `react-hooks/exhaustive-deps` rule. It points out what is missing and what is extra. Follow the warning instead of silencing it with `eslint-disable`: an omitted dependency is a stale-value bug waiting to happen (see L72).",
          },
          {
            titulo: "Decide the fate of each flagged dependency",
            texto:
              "If a change in the value should really re-run the effect (the room changed, reconnect), **include it**. If it is an object or function used only there, **move it inside the effect**. If it depends on nothing from the component, **move it outside** the component.",
          },
          {
            titulo: "Restructure when including it does not fit",
            texto:
              "If the effect needs the value but should not run when it changes, change the code, not the array: use the **functional form of the setter** (`setX((x) => x + 1)`), a `useReducer` or, to read the latest value without resynchronizing, an **Effect Event** (`useEffectEvent`). The latter is a recent feature: check its status for your version at react.dev.",
          },
          {
            titulo: "Watch out for objects, arrays and functions",
            texto:
              "React compares with `Object.is`: numbers and strings by value, objects and functions by **reference**. An `{ id }` or a function declared in the body is new on every render, so the effect would always re-run. Depend on the primitive values (`id`), create the object inside the effect or, if you really need the same reference, use `useMemo` or `useCallback`.",
          },
          {
            titulo: "Check the behavior",
            texto:
              "Change the value and watch the effect re-run, with the cleanup running first. In development, Strict Mode runs an extra mount cycle, which helps you find missing cleanups and dependencies (see L69).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The three cases",
        colunas: ["Form", "When the effect runs", "Typical use and risk"],
        linhas: [
          [
            "`useEffect(fn, [a, b])`",
            "After the first render and whenever `a` or `b` changes (compared with `Object.is`)",
            "The normal case: syncing with `a` and `b`. Risk: forgetting a value the effect reads",
          ],
          [
            "`useEffect(fn, [])`",
            "Once on mount; the cleanup runs on unmount (in development, Strict Mode adds an extra cycle)",
            "Only for what depends on no props or state, such as subscribing to a global event. Risk: reading props or state here leaves stale values",
          ],
          [
            "`useEffect(fn)`",
            "After every render of the component",
            "Rare. Risk: with `setState` inside it becomes a render loop, plus the cost of always running",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An object in the array: the silent mistake",
        legenda: "JSX",
        codigo: [
          'import { useEffect } from "react";',
          "",
          "// Wrong: `options` is a new object on every render, so the effect always reconnects",
          "function WrongRoom({ roomId }) {",
          "  const options = { roomId };",
          "  useEffect(() => {",
          "    const connection = connect(options);",
          "    return () => connection.disconnect();",
          "  }, [options]);",
          "  return <p>Room {roomId}</p>;",
          "}",
          "",
          "// Right: the object is born inside the effect and the dependency is the primitive value",
          "function Room({ roomId }) {",
          "  useEffect(() => {",
          "    const connection = connect({ roomId });",
          "    return () => connection.disconnect();",
          "  }, [roomId]);",
          "  return <p>Room {roomId}</p>;",
          "}",
        ].join("\n"),
        nota: "`connect` is a hypothetical function that opens a connection and returns an object with `disconnect`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Silencing the linter hides the bug",
        texto:
          "The `exhaustive-deps` warning is almost never wrong: it signals that the effect uses a value that can change and that the function captured an old copy of it. When including the dependency “causes trouble” (the effect runs too often), the problem is the effect’s design or an unstable value, and the way out is the third or fourth step, not `eslint-disable`.",
      },
    ],
    armadilhas: [
      "Using `[]` to “run only once” while reading props or state inside the effect: it keeps seeing the first render’s values forever.",
      "Leaving objects, arrays or functions created in the component body in the array: they change on every render, and the effect runs every time (sometimes in a loop, if it updates state).",
      "Leaving out the array by accident: the effect starts running after every render.",
      "Treating the array as a “trigger” instead of a declaration: it describes what the effect uses, not when you would like it to run.",
    ],
    autoteste: [
      {
        pergunta: "What happens with `useEffect(fn, [])`, with `useEffect(fn)` and with `useEffect(fn, [id])`?",
        resposta:
          "`[]`: runs on mount and cleans up on unmount. No array: runs after every render. `[id]`: runs on mount and whenever `id` changes, after the previous run’s cleanup.",
      },
      {
        pergunta:
          "Why does `useEffect(fn, [options])` run on every render when `options` is an `{ id }` created in the body?",
        resposta:
          "Because the object is new on every render and `Object.is` compares objects by reference: the content is the same, the reference is not. The way out is to depend on `id`, or to create the object inside the effect.",
      },
    ],
  },
};
