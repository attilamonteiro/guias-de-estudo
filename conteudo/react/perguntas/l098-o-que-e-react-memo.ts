import type { Pergunta } from "../../tipos";

// L98 · O que é React.memo
export const l098: Pergunta = {
  numero: 98,
  modulo: "linkedin-desempenho",
  metodo: "feynman",
  pt: {
    titulo: "O que é React.memo",
    pergunta: "O que é React.memo()?",
    porqueEsteMetodo:
      "O `memo` é fácil de usar e fácil de usar errado. Uma imagem simples (um porteiro que confere a ficha) explica o que ele faz, e depois o mecanismo real mostra por que objetos e funções novos o anulam.",
    resposta30s:
      "`React.memo(Componente)` é um **porteiro**: quando o pai renderiza de novo, ele compara as props novas com as da última vez por **comparação rasa** (`Object.is` em cada prop) e, se todas forem iguais, **pula** o render e reaproveita o resultado anterior. Só ajuda se as props forem **estáveis** (objetos, arrays e funções novos a cada render anulam o efeito, daí o uso com `useMemo` e `useCallback`), não impede render causado por **estado ou contexto** do próprio componente, e a comparação tem custo. Use em componentes caros que renderizam muitas vezes com as mesmas props, depois de medir.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um porteiro na entrada de uma sala de trabalho. Toda vez que o gerente (o componente pai) manda alguém entrar para refazer o serviço (renderizar), o porteiro olha a ficha de pedido (as props) e compara com a da última vez. Se a ficha for igual, ele diz “o resultado seria o mesmo” e devolve o trabalho anterior, sem deixar ninguém entrar. Se algo mudou, libera a entrada e o serviço é refeito.",
        tecnico:
          "`memo(Componente)` devolve um componente que, quando o pai renderiza, compara as props novas com as anteriores **prop a prop, por igualdade de referência** (`Object.is`, comparação rasa). Se todas forem iguais, o React **pula** o render desse componente e reaproveita o resultado anterior, junto com a subárvore dele (que só renderiza por conta própria se algo mudar lá dentro). O segundo argumento aceita um comparador personalizado. É uma otimização de desempenho, não uma garantia semântica.",
        limite:
          "O porteiro só confere a ficha. Se o próprio componente tem **estado** que mudou, ou consome um **contexto** que mudou, ele renderiza de qualquer jeito. E “igual” quer dizer **a mesma referência**: um objeto literal `{ a: 1 }` criado a cada render é, para o porteiro, uma ficha nova, mesmo com o mesmo conteúdo. A conferência também tem custo, e roda a cada render do pai.",
      },
      {
        tipo: "codigo",
        titulo: "memo e useCallback trabalhando juntos",
        legenda: "JSX",
        codigo: `import { memo, useCallback, useState } from "react";

const Botao = memo(function Botao({ rotulo, aoClicar }) {
  console.log("render Botao"); // aparece só quando as props mudam
  return <button onClick={aoClicar}>{rotulo}</button>;
});

export default function Painel() {
  const [texto, setTexto] = useState("");
  const [total, setTotal] = useState(0);
  // sem useCallback, o memo de Botao não pouparia nada: função nova a cada tecla
  const somar = useCallback(() => setTotal((t) => t + 1), []);
  return (
    <>
      <input value={texto} onChange={(e) => setTexto(e.target.value)} />
      <Botao rotulo="Somar" aoClicar={somar} />
      <p>Total: {total}</p>
    </>
  );
}`,
        nota: "Digitar no campo renderiza o `Painel`, mas o `Botao` é pulado: `rotulo` é o mesmo texto e `somar` é a mesma função. Sem o `useCallback`, `somar` seria uma função nova a cada render e o `memo` nunca pouparia nada.",
      },
      {
        tipo: "tabela",
        titulo: "O que o porteiro considera igual",
        colunas: ["Prop passada", "Conta como igual ao render anterior?", "Como estabilizar"],
        linhas: [
          ['Texto, número ou booleano (`"Ana"`, `3`, `true`)', "Sim, se o valor for o mesmo", "Nada a fazer"],
          [
            'Objeto literal (`style={{ color: "red" }}`, `user={{ id }}`)',
            "Não: é uma referência nova a cada render",
            "Constante fora do componente ou `useMemo`",
          ],
          [
            "Array literal, ou resultado de `.map` ou `.filter` no corpo",
            "Não",
            "`useMemo`, ou mover para fora do componente",
          ],
          ["Função inline (`onClick={() => …}`)", "Não", "`useCallback`, ou declarar fora do componente"],
          [
            "`children` em JSX (`<Caixa><Item /></Caixa>`)",
            "Não: o elemento JSX é novo a cada render do pai",
            "Receber `children` de um pai que não renderiza com frequência, ou memoizar o elemento com `useMemo`",
          ],
          [
            "Valor estável (setter do `useState`, `ref`, resultado de `useMemo` com mesmas dependências)",
            "Sim",
            "Já está bom",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando usar e quando não",
        texto:
          "Use `memo` quando (1) o componente é caro de renderizar (lista grande, gráfico, árvore pesada), (2) ele renderiza muitas vezes com as **mesmas props** e (3) você mediu e viu ganho. Não compensa em componente barato, quando as props mudam quase sempre ou quando você não consegue estabilizar objetos e funções. Antes do `memo`, tente descer o estado ou passar `children` (veja L97). O React Compiler memoiza automaticamente em muitos casos (veja L121; confira react.dev).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Comparador personalizado e garantia",
        texto:
          "O segundo argumento de `memo` aceita um comparador `(propsAntigas, propsNovas) => boolean`, que devolve `true` quando as props são equivalentes. Comparação profunda custa tanto quanto renderizar, e um comparador que ignora uma prop que mudou deixa a tela desatualizada: use só com motivo. E `memo` é uma **dica de desempenho**, não uma garantia: nunca escreva código que só funciona se o componente **não** renderizar.",
      },
    ],
    armadilhas: [
      "Passar objeto, array ou função literais como prop: o porteiro vê uma ficha nova a cada vez, o `memo` nunca poupa nada e ainda paga a comparação.",
      "Esperar que `memo` bloqueie um render causado pelo **estado** ou por um **contexto** do próprio componente: ele só olha as props.",
      "Embrulhar tudo em `memo` por reflexo: mais código e mais comparações, sem ganho medido.",
      "Escrever um comparador personalizado que ignora uma prop relevante: a tela deixa de atualizar e o bug é difícil de achar.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `memo` costuma precisar do `useCallback` e do `useMemo`?",
        resposta:
          "Porque a comparação é por referência: uma função ou um objeto criado no corpo do pai é novo a cada render, então as props sempre parecem diferentes. `useCallback` e `useMemo` mantêm a mesma referência enquanto as dependências não mudam, e aí o `memo` consegue pular o render.",
      },
      {
        pergunta: "Em que situações um componente em `memo` renderiza mesmo assim?",
        resposta:
          "Quando alguma prop muda de referência, quando o próprio estado dele muda e quando um contexto que ele consome muda. Além disso, o `memo` é só uma otimização, não uma garantia.",
      },
    ],
  },
  en: {
    titulo: "What React.memo is",
    pergunta: "What is React.memo()?",
    porqueEsteMetodo:
      "`memo` is easy to use and easy to misuse. A simple picture (a doorman checking a slip) explains what it does, and then the real mechanism shows why new objects and functions defeat it.",
    resposta30s:
      "`React.memo(Component)` is a **doorman**: when the parent renders again, it compares the new props with the last ones using a **shallow comparison** (`Object.is` on each prop) and, if all are equal, it **skips** the render and reuses the previous result. It only helps when props are **stable** (a new object, array or function on every render defeats it, hence the pairing with `useMemo` and `useCallback`), it does not stop a render caused by the component’s own **state or context**, and the comparison has a cost. Use it on expensive components that render often with the same props, after measuring.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a doorman at the entrance of a workroom. Every time the manager (the parent component) sends someone in to redo the job (render), the doorman looks at the order slip (the props) and compares it with the last one. If the slip is the same, he says “the result would be the same” and hands back the earlier work without letting anyone in. If something changed, he lets them in and the job is redone.",
        tecnico:
          "`memo(Component)` returns a component that, when the parent renders, compares the new props with the previous ones **prop by prop, by reference equality** (`Object.is`, a shallow comparison). If all are equal, React **skips** that component’s render and reuses the previous result, along with its subtree (which only renders on its own if something inside changes). The second argument accepts a custom comparison function. It is a performance optimization, not a semantic guarantee.",
        limite:
          "The doorman only checks the slip. If the component has its own **state** that changed, or consumes a **context** that changed, it renders anyway. And “equal” means **the same reference**: an object literal `{ a: 1 }` created on every render is, to the doorman, a new slip even with the same contents. The check also has a cost, and it runs on every render of the parent.",
      },
      {
        tipo: "codigo",
        titulo: "memo and useCallback working together",
        legenda: "JSX",
        codigo: `import { memo, useCallback, useState } from "react";

const Button = memo(function Button({ label, onClick }) {
  console.log("render Button"); // shows up only when props change
  return <button onClick={onClick}>{label}</button>;
});

export default function Panel() {
  const [text, setText] = useState("");
  const [total, setTotal] = useState(0);
  // without useCallback, Button's memo would save nothing: a new function on every keystroke
  const add = useCallback(() => setTotal((t) => t + 1), []);
  return (
    <>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <Button label="Add" onClick={add} />
      <p>Total: {total}</p>
    </>
  );
}`,
        nota: "Typing in the field renders `Panel`, but `Button` is skipped: `label` is the same text and `add` is the same function. Without `useCallback`, `add` would be a new function on every render and `memo` would never save anything.",
      },
      {
        tipo: "tabela",
        titulo: "What the doorman counts as equal",
        colunas: ["Prop passed", "Counts as equal to the previous render?", "How to stabilize"],
        linhas: [
          ['Text, number or boolean (`"Ana"`, `3`, `true`)', "Yes, if the value is the same", "Nothing to do"],
          [
            'Object literal (`style={{ color: "red" }}`, `user={{ id }}`)',
            "No: it is a new reference on every render",
            "A constant outside the component, or `useMemo`",
          ],
          [
            "Array literal, or the result of `.map` or `.filter` in the body",
            "No",
            "`useMemo`, or move it outside the component",
          ],
          ["Inline function (`onClick={() => …}`)", "No", "`useCallback`, or declare it outside the component"],
          [
            "`children` in JSX (`<Box><Item /></Box>`)",
            "No: the JSX element is new on every render of the parent",
            "Take `children` from a parent that does not render often, or memoize the element with `useMemo`",
          ],
          [
            "Stable value (the `useState` setter, a `ref`, a `useMemo` result with the same dependencies)",
            "Yes",
            "Already fine",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to use it and when not to",
        texto:
          "Use `memo` when (1) the component is expensive to render (a large list, a chart, a heavy tree), (2) it renders often with the **same props** and (3) you measured and saw a gain. It does not pay off on a cheap component, when props change almost every time or when you cannot stabilize objects and functions. Before `memo`, try moving state down or passing `children` (see L97). The React Compiler memoizes automatically in many cases (see L121; check react.dev).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Custom comparison and guarantees",
        texto:
          "The second argument of `memo` accepts a comparison function `(oldProps, newProps) => boolean`, which returns `true` when the props are equivalent. A deep comparison costs as much as rendering, and a comparison that ignores a prop that changed leaves the screen out of date: use it only with good reason. And `memo` is a **performance hint**, not a guarantee: never write code that only works if the component does **not** render.",
      },
    ],
    armadilhas: [
      "Passing an object, array or function literal as a prop: the doorman sees a new slip every time, `memo` never saves anything and you still pay for the comparison.",
      "Expecting `memo` to block a render caused by the component’s own **state** or by a **context**: it only looks at props.",
      "Wrapping everything in `memo` out of habit: more code and more comparisons, with no measured gain.",
      "Writing a custom comparison that ignores a relevant prop: the screen stops updating and the bug is hard to find.",
    ],
    autoteste: [
      {
        pergunta: "Why does `memo` usually need `useCallback` and `useMemo`?",
        resposta:
          "Because the comparison is by reference: a function or object created in the parent’s body is new on every render, so the props always look different. `useCallback` and `useMemo` keep the same reference while dependencies do not change, and then `memo` can skip the render.",
      },
      {
        pergunta: "In which situations does a `memo` component render anyway?",
        resposta:
          "When some prop changes reference, when its own state changes and when a context it consumes changes. Also, `memo` is only an optimization, not a guarantee.",
      },
    ],
  },
};
