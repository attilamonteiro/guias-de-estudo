import type { Pergunta } from "../../tipos";

// L25 · O que causa um re-render
export const l025: Pergunta = {
  numero: 25,
  modulo: "linkedin-renderizacao",
  metodo: "playbook",
  pt: {
    titulo: "O que causa um re-render",
    pergunta: "O que faz um componente React renderizar novamente?",
    porqueEsteMetodo:
      "“Por que isto renderizou?” é uma pergunta de diagnóstico: existe uma ordem de verificações que leva à causa em poucos minutos. Um playbook troca o palpite por procedimento e mostra, no fim, quando otimizar vale a pena.",
    resposta30s:
      "Um componente renderiza de novo por **três motivos**: o seu próprio **state** mudou, o **pai renderizou** (e os filhos vão junto, mesmo com props iguais) ou um **contexto** que ele consome mudou. Props não disparam nada sozinhas: elas só mudam porque o pai renderizou. E **renderizar não é atualizar o DOM**: o React compara o resultado e só mexe no que mudou. Descubra a causa com o **Profiler** do React DevTools e meça antes de memoizar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: por que este componente renderizou?",
        passos: [
          {
            titulo: "1. Grave com o Profiler",
            texto:
              "No React DevTools, abra a aba Profiler, ative a opção de registrar **por que cada componente renderizou**, grave a interação e olhe o gráfico de chamas: os componentes coloridos renderizaram, os cinzas não. Ao selecionar um deles, o painel indica a causa. Sinal de acerto: você sai com um nome de componente e um motivo, não com um palpite.",
          },
          {
            titulo: "2. O state do próprio componente mudou?",
            texto:
              "Um setter chamado com valor diferente (comparado com `Object.is`) agenda a renderização. Com o mesmo valor, o React em geral não renderiza os filhos nem mexe no DOM. Mutar um objeto e passar a mesma referência ao setter não renderiza: é bug, não otimização.",
          },
          {
            titulo: "3. O pai renderizou?",
            texto:
              "É a causa mais comum. Quando um componente renderiza, o React renderiza também **todos os filhos que ele devolve**, mesmo que as props sejam idênticas: por padrão o filho não compara props. Procure no Profiler o ancestral que iniciou a cadeia.",
          },
          {
            titulo: "4. Um contexto mudou?",
            texto:
              "Todo componente que lê um contexto (`useContext`) renderiza quando o valor do provedor muda (comparação por `Object.is`), ainda que use só um pedaço dele. Um `value={{ a, b }}` escrito inline é um objeto novo a cada render do provedor.",
          },
          {
            titulo: "5. Há uma store externa ou um hook por trás?",
            texto:
              "Uma biblioteca de estado externo renderiza o componente quando o dado assinado muda; um hook personalizado só repassa o motivo a quem o usa. Siga o hook até chegar a um dos três motivos acima.",
          },
          {
            titulo: "6. O DOM mudou de verdade?",
            texto:
              "Renderizar é chamar a função do componente; a fase de commit só altera o DOM onde a saída difere da anterior. O Profiler diz que houve renderização, não que o DOM mudou: confira no inspetor de elementos do navegador quais nós foram alterados.",
          },
          {
            titulo: "7. Só então otimize",
            texto:
              "Primeiro as correções estruturais: levar o state para perto de quem o usa, passar conteúdo estático como `children`, separar contextos. Depois, `React.memo` com props estáveis (`useMemo` e `useCallback`) apenas em componente caro que renderiza à toa; o React Compiler (confira react.dev) pode automatizar parte disso. Sinal de acerto: o Profiler mostra menos renderizações ou menos tempo.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Mudou alguma coisa: renderiza de novo?",
        colunas: ["O que aconteceu", "Renderiza de novo?", "Por quê"],
        linhas: [
          [
            "`setN(5)` quando `n` já é `5`",
            "Em geral não",
            "`Object.is` diz que é o mesmo valor; o React pode chamar o componente uma vez antes de desistir, mas não renderiza os filhos nem altera o DOM",
          ],
          [
            "`setLista([...lista])` sem mudar o conteúdo",
            "Sim",
            "O array é novo (outra referência) e o React não compara o conteúdo",
          ],
          [
            "`lista.push(x); setLista(lista)`",
            "Não",
            "Mesma referência: a mutação fica invisível e a tela desatualizada",
          ],
          [
            "O pai renderiza e passa as mesmas props",
            "Sim (sem `memo`)",
            "O filho é renderizado junto; por padrão o React não compara props",
          ],
          [
            "O pai passa um objeto ou função criado inline a um filho com `memo`",
            "Sim",
            "A identidade é nova a cada render, então a comparação das props falha",
          ],
          [
            "As props de um filho com `memo` mudaram de verdade",
            "Sim",
            "Alguma prop difere por `Object.is`; só iguais evitam a renderização",
          ],
          [
            "Mudou um `ref` ou uma variável comum",
            "Não",
            "Nada avisa o React: só state, contexto e o pai renderizando disparam",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O filho acompanha o pai, e o memo o segura",
        legenda: "JSX",
        codigo: `import { memo, useState } from "react";

const Filho = memo(function Filho({ nome }) {
  console.log("Filho renderizou");
  return <p>Olá, {nome}</p>;
});

export function Pai() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>Cliques: {n}</button>
      {/* Props iguais: com memo, o Filho não renderiza de novo a cada clique */}
      <Filho nome="Ana" />
    </>
  );
}`,
        nota: "Sem o `memo`, o log aparece a cada clique. Com `memo` e props primitivas iguais, não. Mas passar `estilo={{ cor: 'azul' }}` ou uma função criada inline cria uma referência nova a cada render e anula o ganho.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Gatilho e consequência",
        texto:
          "Só três coisas **disparam** uma renderização: o state (ou a store) do próprio componente, um contexto e o pai renderizando. Props são a **consequência** de o pai ter renderizado, não a causa. E renderizar é barato quando o resultado é igual: o custo real está nas renderizações caras ou numerosas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Memoizar sem medir pode piorar",
        texto:
          "`memo`, `useMemo` e `useCallback` têm custo (comparar e guardar) e só ajudam quando o componente é caro, renderiza com frequência e recebe props estáveis. Meça com o Profiler antes e depois; muitas vezes mover o state para baixo ou passar `children` resolve sem nenhuma memoização. E lembre: em desenvolvimento o Strict Mode renderiza duas vezes de propósito, o que não é um bug de re-render.",
      },
    ],
    armadilhas: [
      "Memoizar tudo “por garantia”: cada comparação tem custo e, com props instáveis (objetos e funções inline), a memoização nem chega a funcionar.",
      "Achar que mudar props “causa” a renderização e que um filho com props iguais está imune: sem `memo`, ele renderiza sempre que o pai renderiza.",
      "Mutar o state (`push`, atribuição em objeto) e chamar o setter com a mesma referência: o React não renderiza e a tela fica desatualizada.",
      "Confundir renderização com atualização do DOM, e o log em dobro do Strict Mode com um bug: em desenvolvimento a renderização é repetida de propósito.",
    ],
    autoteste: [
      {
        pergunta: "Um filho recebe as mesmas props e mesmo assim renderiza. Por quê?",
        resposta:
          "Porque o pai renderizou, e por padrão os filhos que ele devolve renderizam junto. O React só pula esse filho se ele estiver em `memo` (ou o Compiler o memoizar) e as props forem iguais.",
      },
      {
        pergunta: "Mudar o state sempre muda a tela?",
        resposta:
          "Não. Se o novo valor é igual ao atual (`Object.is`), o React em geral não renderiza os filhos nem mexe no DOM; e mesmo renderizando, o DOM só muda onde a saída difere da anterior.",
      },
    ],
  },
  en: {
    titulo: "What triggers a re-render",
    pergunta: "What causes a React component to re-render?",
    porqueEsteMetodo:
      "“Why did this render?” is a diagnostic question: there is an order of checks that leads to the cause in a few minutes. A playbook swaps guessing for a procedure and shows, at the end, when optimizing is worth it.",
    resposta30s:
      "A component re-renders for **three reasons**: its own **state** changed, its **parent rendered** (and the children come along, even with identical props), or a **context** it consumes changed. Props do not trigger anything on their own: they only change because the parent rendered. And **rendering is not updating the DOM**: React compares the result and touches only what changed. Find the cause with the React DevTools **Profiler** and measure before memoizing.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: why did this component render?",
        passos: [
          {
            titulo: "1. Record with the Profiler",
            texto:
              "In React DevTools, open the Profiler tab, enable the option to record **why each component rendered**, record the interaction and look at the flame chart: colored components rendered, gray ones did not. Selecting one shows the cause. Sign you got it right: you leave with a component name and a reason, not a guess.",
          },
          {
            titulo: "2. Did the component’s own state change?",
            texto:
              "A setter called with a different value (compared with `Object.is`) schedules a render. With the same value, React generally does not render the children or touch the DOM. Mutating an object and passing the same reference to the setter does not render: that is a bug, not an optimization.",
          },
          {
            titulo: "3. Did the parent render?",
            texto:
              "This is the most common cause. When a component renders, React also renders **every child it returns**, even if the props are identical: by default a child does not compare props. In the Profiler, find the ancestor that started the chain.",
          },
          {
            titulo: "4. Did a context change?",
            texto:
              "Every component that reads a context (`useContext`) renders when the provider’s value changes (compared with `Object.is`), even if it uses only part of it. A `value={{ a, b }}` written inline is a new object on every provider render.",
          },
          {
            titulo: "5. Is there an external store or a hook behind it?",
            texto:
              "An external state library renders the component when the subscribed data changes; a custom hook just passes the reason on to whoever uses it. Follow the hook until you reach one of the three reasons above.",
          },
          {
            titulo: "6. Did the DOM really change?",
            texto:
              "Rendering is calling the component function; the commit phase only changes the DOM where the output differs from the previous one. The Profiler says a render happened, not that the DOM changed: check in the browser’s elements inspector which nodes were altered.",
          },
          {
            titulo: "7. Only then optimize",
            texto:
              "Structural fixes first: move state closer to where it is used, pass static content as `children`, split contexts. Then `React.memo` with stable props (`useMemo` and `useCallback`) only on an expensive component that renders needlessly; the React Compiler (check react.dev) can automate part of this. Sign you got it right: the Profiler shows fewer renders or less time.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Something changed: does it re-render?",
        colunas: ["What happened", "Re-renders?", "Why"],
        linhas: [
          [
            "`setN(5)` when `n` is already `5`",
            "Usually not",
            "`Object.is` says it is the same value; React may call the component once before giving up, but it does not render the children or change the DOM",
          ],
          [
            "`setList([...list])` without changing the content",
            "Yes",
            "The array is new (another reference) and React does not compare the content",
          ],
          [
            "`list.push(x); setList(list)`",
            "No",
            "Same reference: the mutation is invisible and the screen goes stale",
          ],
          [
            "The parent renders and passes the same props",
            "Yes (without `memo`)",
            "The child is rendered along with it; by default React does not compare props",
          ],
          [
            "The parent passes an inline object or function to a child wrapped in `memo`",
            "Yes",
            "The identity is new on every render, so the props comparison fails",
          ],
          [
            "The props of a `memo` child really changed",
            "Yes",
            "Some prop differs by `Object.is`; only equal props skip the render",
          ],
          [
            "A `ref` or a plain variable changed",
            "No",
            "Nothing tells React: only state, context and the parent rendering trigger it",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The child follows the parent, and memo holds it back",
        legenda: "JSX",
        codigo: `import { memo, useState } from "react";

const Child = memo(function Child({ name }) {
  console.log("Child rendered");
  return <p>Hello, {name}</p>;
});

export function Parent() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>Clicks: {n}</button>
      {/* Same props: with memo, Child does not render again on every click */}
      <Child name="Ana" />
    </>
  );
}`,
        nota: "Without `memo`, the log appears on every click. With `memo` and equal primitive props, it does not. But passing `style={{ color: 'blue' }}` or an inline function creates a new reference on every render and cancels the gain.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Trigger and consequence",
        texto:
          "Only three things **trigger** a render: the component’s own state (or store), a context, and the parent rendering. Props are the **consequence** of the parent having rendered, not the cause. And rendering is cheap when the result is the same: the real cost is in expensive or numerous renders.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Memoizing without measuring can backfire",
        texto:
          "`memo`, `useMemo` and `useCallback` have a cost (comparing and storing) and only help when the component is expensive, renders often and receives stable props. Measure with the Profiler before and after; often moving state down or passing `children` solves it with no memoization at all. And remember: in development Strict Mode renders twice on purpose, which is not a re-render bug.",
      },
    ],
    armadilhas: [
      "Memoizing everything “just in case”: every comparison has a cost and, with unstable props (inline objects and functions), memoization does not even work.",
      "Believing that changing props “causes” the render and that a child with equal props is immune: without `memo`, it renders whenever the parent renders.",
      "Mutating state (`push`, assigning to an object) and calling the setter with the same reference: React does not render and the screen goes stale.",
      "Mixing up rendering with a DOM update, and Strict Mode’s doubled log with a bug: in development the render is repeated on purpose.",
    ],
    autoteste: [
      {
        pergunta: "A child receives the same props and still renders. Why?",
        resposta:
          "Because the parent rendered, and by default the children it returns render along with it. React skips that child only if it is wrapped in `memo` (or the Compiler memoizes it) and the props are equal.",
      },
      {
        pergunta: "Does changing state always change the screen?",
        resposta:
          "No. If the new value equals the current one (`Object.is`), React generally does not render the children or touch the DOM; and even when it renders, the DOM changes only where the output differs from the previous one.",
      },
    ],
  },
};
