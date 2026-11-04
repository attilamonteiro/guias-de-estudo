import type { Pergunta } from "../../tipos";

// C05 · Dois setCount no mesmo clique
export const c005: Pergunta = {
  numero: 505,
  modulo: "coddy-iniciante",
  metodo: "trace",
  pt: {
    titulo: "Dois setCount no mesmo clique",
    pergunta:
      "O que o primeiro exemplo registra? Um botão chama setCount(count + 1) duas vezes no mesmo clique e registra count logo depois. O que é registrado e quanto o botão passa a mostrar?",
    porqueEsteMetodo:
      "O resultado surpreende porque o instinto diz “duas chamadas, mais dois”. Seguir um clique passo a passo mostra o que cada chamada realmente lê e o que fica na fila, e o caminho com a forma funcional mostra o conserto.",
    resposta30s:
      "Partindo de `count = 0`, o log mostra **0** e o botão passa a mostrar **1**. Em cada renderização `count` é uma constante: as duas chamadas leem o mesmo valor e enfileiram o mesmo pedido, “defina como 1”, e o `console.log` lê a mesma constante, não o estado novo. O React agrupa as duas chamadas (**batching**) numa única nova renderização; para somar duas vezes use a forma funcional `setCount((c) => c + 1)`.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "O exemplo",
        legenda: "JSX",
        codigo: `import { useState } from "react";

export function Contador() {
  const [count, setCount] = useState(0);

  function aoClicar() {
    setCount(count + 1); // count vale 0 nesta renderização → pede "1"
    setCount(count + 1); // count ainda vale 0 → pede "1" de novo
    console.log(count); // 0
    // setCount((c) => c + 1) duas vezes levaria a 2
  }

  return <button onClick={aoClicar}>{count}</button>;
}`,
      },
      {
        tipo: "passos",
        titulo: "Um clique, passo a passo",
        passos: [
          {
            titulo: "A renderização atual",
            texto:
              "O React chamou `Contador()` e o `useState` devolveu `count = 0`. Para essa renderização, `count` é um valor fixo, como uma foto; a função `aoClicar` foi criada ali e “enxerga” esse 0.",
          },
          {
            titulo: "Clique: primeira chamada",
            texto:
              "`setCount(count + 1)` calcula `0 + 1 = 1` e **enfileira** o pedido “trocar o estado por 1”. Nada muda agora: `count` continua 0 e o componente ainda não renderizou de novo.",
          },
          {
            titulo: "Segunda chamada",
            texto: "`count` ainda vale 0, então `setCount(count + 1)` enfileira outra vez “trocar por 1”.",
          },
          {
            titulo: "O log",
            texto:
              "`console.log(count)` imprime 0. O setter nunca altera a variável `count` desta renderização; ele só pede uma nova. Mesmo que a atualização fosse instantânea, o `count` deste closure continuaria sendo 0.",
          },
          {
            titulo: "Fim do manipulador",
            texto:
              "O React processa a fila: o estado vai para 1 (primeiro pedido) e continua 1 (segundo pedido). Acontece uma única nova renderização, não duas.",
          },
          {
            titulo: "Renderização seguinte",
            texto:
              "O `useState` devolve `count = 1` e o botão mostra 1. Um novo clique partiria de 1 e chegaria a 2, não a 3.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que fica na fila",
        colunas: ["Chamadas no mesmo clique", "Fila", "Estado final (partindo de 0)"],
        linhas: [
          ["`setCount(count + 1)` duas vezes", "trocar por 1; trocar por 1", "1"],
          ["`setCount((c) => c + 1)` duas vezes", "somar 1; somar 1", "2"],
          ["`setCount(count + 1)` e depois `setCount((c) => c + 1)`", "trocar por 1; somar 1", "2"],
          ["`setCount((c) => c + 1)` e depois `setCount(10)`", "somar 1; trocar por 10", "10"],
        ],
        nota: "A fila é processada na ordem. Um valor direto ignora o que veio antes; um atualizador recebe o resultado do anterior.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Valor da renderização, não variável viva",
        texto:
          "O estado funciona como uma **foto por renderização**: tudo o que o componente e seus handlers enxergam é o valor daquela foto, e o setter só pede uma foto nova. Por isso a leitura logo depois do setter mostra o valor antigo, e por isso a forma funcional existe: ela entrega ao React uma **regra** (“some 1 ao que estiver lá”), não um valor já calculado. O **batching** junta as chamadas de um mesmo clique em uma renderização; nas versões atuais isso vale também em timeouts, promises e eventos nativos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é só questão de “assíncrono”",
        texto:
          "Um `setTimeout(() => console.log(count), 1000)` dentro do handler também imprimiria 0, mesmo com a tela já mostrando 1: o closure guarda o valor da renderização em que nasceu. Quanto às funções atualizadoras, mantenha-as puras (sem efeitos colaterais nem mutação): em desenvolvimento, com o StrictMode, o React as chama duas vezes para pegar impurezas.",
      },
    ],
    armadilhas: [
      "Achar que o log mostra 1 porque “o setState é assíncrono”: ele mostra 0 porque `count` é uma constante desta renderização, mesmo que a atualização fosse imediata.",
      "Chamar `setCount(count + 1)` várias vezes para somar várias vezes: soma uma só. Use `setCount((c) => c + 1)`.",
      "Misturar valor direto e atualizador na mesma fila sem pensar na ordem: um valor direto descarta o resultado anterior.",
      "Usar `count` num `setTimeout` ou num efeito e esperar o valor mais recente: o closure guarda o valor da renderização em que foi criado.",
    ],
    autoteste: [
      {
        pergunta: "Por que `console.log(count)` logo depois de `setCount` mostra o valor antigo?",
        resposta:
          "Porque `count` é uma constante da renderização atual. O setter só enfileira um pedido de nova renderização, e é nela que `count` terá o valor novo.",
      },
      {
        pergunta: "Como fazer o clique somar 2?",
        resposta:
          "Usando o atualizador nas duas chamadas, `setCount((c) => c + 1)`: cada uma recebe o resultado da anterior. As duas ainda geram uma única renderização.",
      },
    ],
  },
  en: {
    titulo: "Two setCount calls per click",
    pergunta:
      "What does the first example log? A button calls setCount(count + 1) twice in the same click and logs count right afterwards. What is logged, and what value does the button end up showing?",
    porqueEsteMetodo:
      "The result surprises because instinct says “two calls, add two”. Following one click step by step shows what each call actually reads and what sits in the queue, and the path with the functional form shows the fix.",
    resposta30s:
      "Starting from `count = 0`, the log shows **0** and the button ends up showing **1**. In each render `count` is a constant: both calls read the same value and queue the same request, “set it to 1”, and the `console.log` reads the same constant, not the new state. React groups the two calls (**batching**) into a single new render; to add twice, use the functional form `setCount((c) => c + 1)`.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "The example",
        legenda: "JSX",
        codigo: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  function onClick() {
    setCount(count + 1); // count is 0 in this render → requests "1"
    setCount(count + 1); // count is still 0 → requests "1" again
    console.log(count); // 0
    // setCount((c) => c + 1) twice would lead to 2
  }

  return <button onClick={onClick}>{count}</button>;
}`,
      },
      {
        tipo: "passos",
        titulo: "One click, step by step",
        passos: [
          {
            titulo: "The current render",
            texto:
              "React called `Counter()` and `useState` returned `count = 0`. For this render, `count` is a fixed value, like a photo; the `onClick` function was created there and “sees” that 0.",
          },
          {
            titulo: "Click: first call",
            texto:
              "`setCount(count + 1)` computes `0 + 1 = 1` and **queues** the request “replace the state with 1”. Nothing changes now: `count` is still 0 and the component has not rendered again.",
          },
          {
            titulo: "Second call",
            texto: "`count` is still 0, so `setCount(count + 1)` queues “replace with 1” once more.",
          },
          {
            titulo: "The log",
            texto:
              "`console.log(count)` prints 0. The setter never changes the `count` variable of this render; it only asks for a new one. Even if the update were instant, the `count` in this closure would still be 0.",
          },
          {
            titulo: "End of the handler",
            texto:
              "React processes the queue: the state goes to 1 (first request) and stays at 1 (second request). A single new render happens, not two.",
          },
          {
            titulo: "The next render",
            texto:
              "`useState` returns `count = 1` and the button shows 1. Another click would start from 1 and reach 2, not 3.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What sits in the queue",
        colunas: ["Calls in the same click", "Queue", "Final state (starting from 0)"],
        linhas: [
          ["`setCount(count + 1)` twice", "replace with 1; replace with 1", "1"],
          ["`setCount((c) => c + 1)` twice", "add 1; add 1", "2"],
          ["`setCount(count + 1)` then `setCount((c) => c + 1)`", "replace with 1; add 1", "2"],
          ["`setCount((c) => c + 1)` then `setCount(10)`", "add 1; replace with 10", "10"],
        ],
        nota: "The queue is processed in order. A direct value ignores what came before; an updater receives the result of the previous one.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A render’s value, not a live variable",
        texto:
          "State works like a **photo per render**: everything the component and its handlers see is the value in that photo, and the setter only asks for a new photo. That is why reading right after the setter shows the old value, and why the functional form exists: it hands React a **rule** (“add 1 to whatever is there”), not an already computed value. **Batching** merges the calls of a single click into one render; in current versions that also applies inside timeouts, promises and native events.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is not just about “asynchronous”",
        texto:
          "A `setTimeout(() => console.log(count), 1000)` inside the handler would also print 0, even with the screen already showing 1: the closure keeps the value of the render where it was born. As for updater functions, keep them pure (no side effects, no mutation): in development, with StrictMode, React calls them twice to catch impurities.",
      },
    ],
    armadilhas: [
      "Thinking the log shows 1 because “setState is asynchronous”: it shows 0 because `count` is a constant of this render, even if the update were immediate.",
      "Calling `setCount(count + 1)` several times to add several times: it adds once. Use `setCount((c) => c + 1)`.",
      "Mixing a direct value and an updater in the same queue without thinking about order: a direct value discards the previous result.",
      "Using `count` in a `setTimeout` or an effect and expecting the latest value: the closure keeps the value of the render where it was created.",
    ],
    autoteste: [
      {
        pergunta: "Why does `console.log(count)` right after `setCount` show the old value?",
        resposta:
          "Because `count` is a constant of the current render. The setter only queues a request for a new render, and that is where `count` will hold the new value.",
      },
      {
        pergunta: "How do you make the click add 2?",
        resposta:
          "Use the updater in both calls, `setCount((c) => c + 1)`: each one receives the result of the previous. They still produce a single render.",
      },
    ],
  },
};
