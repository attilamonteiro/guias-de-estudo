import type { Pergunta } from "../../tipos";

// L36 · O que é batching
export const l036: Pergunta = {
  numero: 36,
  modulo: "linkedin-renderizacao",
  metodo: "trace",
  pt: {
    titulo: "O que é batching",
    pergunta: "O que é batching no React?",
    porqueEsteMetodo:
      "O batching é um comportamento que só aparece quando você acompanha o tempo: o que o setter faz na hora, o que fica na fila e quando o React renderiza. Seguir um clique com vários setters mostra tudo isso, inclusive o resultado que surpreende.",
    resposta30s:
      "**Batching** é o React agrupar várias atualizações de state em **uma única renderização**, em vez de renderizar a cada `setState`: isso evita trabalho repetido e telas intermediárias inconsistentes. Hoje o **batching automático** vale também em timeouts, promises e eventos nativos, não só nos eventos do React como antes. O setter apenas **agenda**: o valor da renderização atual não muda, e por isso, para depender do valor anterior, use a **forma funcional**, `setN(n => n + 1)`.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Seguindo um clique com três setters",
        passos: [
          {
            titulo: "1. O handler começa",
            texto:
              "O clique chama a função, que roda com o valor do state **desta renderização**, um instantâneo. `n` vale 0 e continua valendo 0 até o fim do handler.",
          },
          {
            titulo: "2. Cada setter só enfileira",
            texto:
              "`setN(...)` não altera `n` nem renderiza: registra uma atualização na fila e avisa o React de que há trabalho. Ler `n` logo depois devolve o valor antigo.",
          },
          {
            titulo: "3. O handler termina",
            texto: "Só quando o código do handler acaba o React processa a fila. Esse agrupamento é o lote (o batch).",
          },
          {
            titulo: "4. O React calcula o state final",
            texto:
              "Aplica a fila em ordem. Um valor (`setN(1)`) substitui; uma função (`setN(a => a + 1)`) recebe o resultado acumulado até ali. Três `setN(n + 1)` com `n = 0` viram “1, 1, 1”: o resultado é 1. Três funcionais viram “+1, +1, +1”: o resultado é 3.",
          },
          {
            titulo: "5. Uma renderização só",
            texto:
              "O React renderiza o componente **uma vez** com o state final e faz o commit. O caminho que dá errado: esperar ver o valor novo logo após o setter, ou somar com `n + 1` repetido e achar que o React “perdeu” cliques.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Duas formas de somar três vezes",
        legenda: "JSX",
        codigo: `import { useState } from "react";

export function Contador() {
  const [n, setN] = useState(0);
  function somarErrado() {
    setN(n + 1);
    setN(n + 1);
    setN(n + 1); // todos leem o mesmo n desta renderização: o resultado é +1
    console.log(n); // ainda o valor antigo: o setter só agenda
  }
  function somarCerto() {
    setN((anterior) => anterior + 1);
    setN((anterior) => anterior + 1);
    setN((anterior) => anterior + 1); // cada função recebe o resultado da anterior: +3
  }
  return (
    <>
      <button onClick={somarErrado}>Errado (n = {n})</button>
      <button onClick={somarCerto}>Certo (n = {n})</button>
    </>
  );
}`,
        nota: "Os três `setN(n + 1)` leem o mesmo `n`, então valem o mesmo que um só. A forma funcional lê o último valor da fila.",
      },
      {
        tipo: "tabela",
        titulo: "Antes e depois do batching automático",
        colunas: ["Onde o setter roda", "Comportamento antigo", "Com o batching automático"],
        linhas: [
          ["Handler de evento do React (`onClick`)", "Agrupado", "Agrupado"],
          ["`setTimeout` ou `setInterval`", "Uma renderização por setter", "Agrupado"],
          ["Depois de um `await`, ou num `.then`", "Uma renderização por setter", "Agrupado"],
          ["Evento nativo (`addEventListener`)", "Uma renderização por setter", "Agrupado"],
          [
            "Duas ações do usuário (dois cliques)",
            "Duas renderizações",
            "Duas renderizações: cada evento é um lote próprio",
          ],
        ],
        nota: "O batching automático vem com a API de raiz atual (`createRoot`); aplicações que ainda usam a API antiga de renderização mantêm o comportamento antigo. Confira o guia de atualização em react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra do lote",
        texto:
          "Dentro de um mesmo evento, os setters viram **uma** renderização: menos renderizações e commits, e nenhuma tela intermediária com um state atualizado e outro não. O setter nunca muda a variável da renderização atual; se o próximo valor depende do anterior, passe uma função.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "flushSync é saída de emergência",
        texto:
          "`flushSync` (de `react-dom`) força o React a processar as atualizações dentro dele **imediatamente**, de forma síncrona. Serve para casos raros, como ler o DOM já atualizado logo em seguida (rolar até o item recém-adicionado) ou integrar com código fora do React. Custa desempenho e anula o lote; não use para “consertar” o valor antigo, o conserto para isso é a forma funcional. Note também que um `await` no meio do handler separa os lotes: o que vem depois cai em outro.",
      },
    ],
    armadilhas: [
      "Ler o state logo depois do setter e esperar o valor novo: a variável é um instantâneo da renderização atual.",
      "Somar com `setN(n + 1)` várias vezes (ou dentro de um `setTimeout`) e estranhar que só conta um: use `setN(anterior => anterior + 1)`.",
      "Abusar do `flushSync` para forçar atualizações: perde-se o batching e o desempenho.",
      "Achar que agrupar significa atrasar por um tempo: o React renderiza logo depois do handler, sem espera artificial.",
    ],
    autoteste: [
      {
        pergunta: "Quantas renderizações ocorrem com `setA(1); setB(2); setC(3)` num clique?",
        resposta: "Uma só: as três atualizações entram na fila e o React renderiza uma vez, com os três valores novos.",
      },
      {
        pergunta: "O que mudou com o batching automático?",
        resposta:
          "Antes, só as atualizações dentro de handlers de eventos do React eram agrupadas; em timeouts, promises e eventos nativos cada setter renderizava. Agora todas são agrupadas, e o `flushSync` ficou como saída para quem precisa de uma atualização síncrona.",
      },
    ],
  },
  en: {
    titulo: "What batching is",
    pergunta: "What is batching in React?",
    porqueEsteMetodo:
      "Batching is a behavior that only shows up when you follow time: what the setter does right away, what sits in the queue and when React renders. Following one click with several setters shows all of it, including the result that surprises people.",
    resposta30s:
      "**Batching** is React grouping several state updates into **a single render**, instead of rendering on every `setState`: it avoids repeated work and inconsistent in-between screens. Today **automatic batching** also applies inside timeouts, promises and native events, not only React events as before. The setter just **schedules**: the value of the current render does not change, so to depend on the previous value, use the **functional form**, `setN(n => n + 1)`.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Following a click with three setters",
        passos: [
          {
            titulo: "1. The handler starts",
            texto:
              "The click calls the function, which runs with the state value from **this render**, a snapshot. `n` is 0 and stays 0 until the handler ends.",
          },
          {
            titulo: "2. Each setter only queues",
            texto:
              "`setN(...)` neither changes `n` nor renders: it records an update in the queue and tells React there is work to do. Reading `n` right after returns the old value.",
          },
          {
            titulo: "3. The handler ends",
            texto: "Only when the handler’s code finishes does React process the queue. That grouping is the batch.",
          },
          {
            titulo: "4. React computes the final state",
            texto:
              "It applies the queue in order. A value (`setN(1)`) replaces; a function (`setN(a => a + 1)`) receives the result accumulated so far. Three `setN(n + 1)` with `n = 0` become “1, 1, 1”: the result is 1. Three functional ones become “+1, +1, +1”: the result is 3.",
          },
          {
            titulo: "5. A single render",
            texto:
              "React renders the component **once** with the final state and commits. The path that goes wrong: expecting to see the new value right after the setter, or adding with a repeated `n + 1` and thinking React “lost” clicks.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Two ways to add three times",
        legenda: "JSX",
        codigo: `import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  function addWrong() {
    setN(n + 1);
    setN(n + 1);
    setN(n + 1); // all read the same n from this render: the result is +1
    console.log(n); // still the old value: the setter only schedules
  }
  function addRight() {
    setN((previous) => previous + 1);
    setN((previous) => previous + 1);
    setN((previous) => previous + 1); // each function gets the previous result: +3
  }
  return (
    <>
      <button onClick={addWrong}>Wrong (n = {n})</button>
      <button onClick={addRight}>Right (n = {n})</button>
    </>
  );
}`,
        nota: "The three `setN(n + 1)` read the same `n`, so they amount to just one. The functional form reads the latest value in the queue.",
      },
      {
        tipo: "tabela",
        titulo: "Before and after automatic batching",
        colunas: ["Where the setter runs", "Old behavior", "With automatic batching"],
        linhas: [
          ["React event handler (`onClick`)", "Batched", "Batched"],
          ["`setTimeout` or `setInterval`", "One render per setter", "Batched"],
          ["After an `await`, or in a `.then`", "One render per setter", "Batched"],
          ["Native event (`addEventListener`)", "One render per setter", "Batched"],
          ["Two user actions (two clicks)", "Two renders", "Two renders: each event is its own batch"],
        ],
        nota: "Automatic batching comes with the current root API (`createRoot`); apps that still use the legacy render API keep the old behavior. Check the upgrade guide at react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The batch rule",
        texto:
          "Within a single event, setters become **one** render: fewer renders and commits, and no in-between screen with one state updated and another not. The setter never changes the current render’s variable; if the next value depends on the previous one, pass a function.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "flushSync is an emergency exit",
        texto:
          "`flushSync` (from `react-dom`) forces React to process the updates inside it **immediately**, synchronously. It is for rare cases, such as reading the already-updated DOM right after (scrolling to a newly added item) or integrating with non-React code. It costs performance and cancels the batch; do not use it to “fix” the old value, the fix for that is the functional form. Also note that an `await` in the middle of a handler splits the batches: what comes after falls into another one.",
      },
    ],
    armadilhas: [
      "Reading state right after the setter and expecting the new value: the variable is a snapshot of the current render.",
      "Adding with `setN(n + 1)` several times (or inside a `setTimeout`) and being surprised it counts only one: use `setN(previous => previous + 1)`.",
      "Overusing `flushSync` to force updates: you lose batching and performance.",
      "Thinking that batching means delaying for some time: React renders right after the handler, with no artificial wait.",
    ],
    autoteste: [
      {
        pergunta: "How many renders happen with `setA(1); setB(2); setC(3)` in one click?",
        resposta: "Just one: the three updates go into the queue and React renders once, with the three new values.",
      },
      {
        pergunta: "What changed with automatic batching?",
        resposta:
          "Before, only updates inside React event handlers were batched; in timeouts, promises and native events every setter rendered. Now all of them are batched, and `flushSync` remains as the way out for those who need a synchronous update.",
      },
    ],
  },
};
