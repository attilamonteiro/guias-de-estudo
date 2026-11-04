import type { Pergunta } from "../../tipos";

// L97 · Achar re-renders desnecessários
export const l097: Pergunta = {
  numero: 97,
  modulo: "linkedin-desempenho",
  metodo: "trace",
  pt: {
    titulo: "Achar re-renders desnecessários",
    pergunta: "Como identificar re-renders desnecessários?",
    porqueEsteMetodo:
      "Para achar um render que não deveria acontecer, é preciso saber exatamente o que dispara um render. Seguir uma mudança até o DOM mostra onde olhar e quais ferramentas respondem a cada pergunta.",
    resposta30s:
      "Um componente renderiza quando seu **estado muda**, quando o **pai renderiza** (e, por padrão, todos os filhos vão junto) ou quando um **contexto** que ele consome muda. Para achar os renders desnecessários, grave a interação no **Profiler do React DevTools** (com a opção de registrar “por que” cada componente renderizou), ligue o **destaque de atualizações**, use um contador (`console.count`) ou a biblioteca **why-did-you-render**, e procure as causas típicas: objetos e funções novos nas props, contexto largo e estado alto demais. Render não é mudança no DOM: só corrija o que custa tempo medido.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O que dispara um render, passo a passo",
        etapas: [
          "Algo acontece: um clique chama `setContagem(5)`, um `dispatch` altera o store ou chega uma resposta de rede que grava estado",
          "O React compara o valor novo com o atual (`Object.is`); se for igual, em geral nem renderiza. Se for diferente, **agenda** um render do componente dono do estado",
          "Renderizar é **chamar a função do componente** de novo para obter o JSX novo. Por padrão isso vale também para todos os **filhos**, mesmo com props iguais, a menos que estejam em `memo`",
          "Se o valor que mudou é um **contexto**, todos os componentes que o consomem também renderizam, onde quer que estejam na árvore",
          "O React compara o JSX novo com o anterior (reconciliação) e só altera o DOM onde algo mudou. Um render pode terminar sem tocar o DOM nenhum",
          "Depois do commit, rodam os efeitos cujas dependências mudaram; se um efeito grava estado, começa outro ciclo (veja L68)",
        ],
        nota: "Em desenvolvimento, o Strict Mode renderiza duas vezes de propósito para ajudar a achar impurezas. Não conte esses renders como problema do build de produção.",
      },
      {
        tipo: "passos",
        titulo: "Como enxergar e achar a causa",
        passos: [
          {
            titulo: "Reproduza e conte",
            texto:
              'Ponha `console.count("NomeDoComponente")` no corpo do componente suspeito e repita a interação. Compare o número com o que você esperava, de preferência fora do Strict Mode.',
          },
          {
            titulo: "Profiler do React DevTools",
            texto:
              "Na aba Profiler, ative nas configurações a opção de registrar por que cada componente renderizou, grave a interação e abra cada componente: o painel diz o motivo (o pai renderizou, ou props, estado, hooks ou contexto mudaram). Componentes em cinza não renderizaram naquele commit, e o gráfico mostra quanto tempo cada um levou.",
          },
          {
            titulo: "Destaque de atualizações",
            texto:
              "Nas configurações gerais do DevTools, ligue a opção de destacar os componentes quando eles renderizam: o navegador contorna em cores quem se mexe a cada interação. Serve para ver depressa quem renderiza sem precisar.",
          },
          {
            titulo: "why-did-you-render",
            texto:
              "Biblioteca de desenvolvimento que avisa quando um componente renderiza de novo com props **iguais em valor** mas **diferentes por referência** (um objeto ou função recriado). Use só em desenvolvimento e só nos componentes sob suspeita.",
          },
          {
            titulo: "Meça o custo antes de corrigir",
            texto:
              "Veja no Profiler quanto o render leva. Muitos renders baratos importam menos que um render lento; se o custo é pequeno e a tela está fluida, deixe como está.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Causas comuns, como aparecem e o que fazer",
        colunas: ["Causa", "Como aparece no Profiler", "Correção"],
        linhas: [
          [
            "Estado alto demais",
            "Pai e vários filhos renderizam a cada mudança; o motivo é o estado do pai",
            "Descer o estado para quem o usa, ou separar o trecho que muda em outro componente",
          ],
          [
            "Objeto, array ou função novos nas props",
            "O filho com `memo` renderiza mesmo assim; o motivo é “props mudaram”",
            "Constante fora do componente, `useMemo` ou `useCallback` (veja L98)",
          ],
          [
            "Contexto largo",
            "Todos os consumidores renderizam; o motivo é “contexto mudou”",
            "Dividir em contextos menores, memoizar o `value`, separar estado e funções",
          ],
          [
            "Filho sem `memo` sob um pai que renderiza",
            "O motivo é “o pai renderizou”",
            "Aceitar (é normal e barato), passar `children` de um pai estável ou usar `memo` se medido",
          ],
          [
            "Efeito que grava estado",
            "Sequência de renders logo depois do primeiro; o motivo é estado alterado por um efeito",
            "Derivar o valor durante o render e corrigir as dependências",
          ],
          [
            "Componente definido dentro de outro, ou `key` instável",
            "O componente remonta em vez de só renderizar, e perde o estado",
            "Mover a definição para fora e usar chaves estáveis (veja L34)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Contando renders e vendo o `memo` falhar",
        legenda: "JSX",
        codigo: `import { memo } from "react";

function abrir(id) {
  console.log("abrir", id);
}

const Linha = memo(function Linha({ item, aoClicar }) {
  console.count("render Linha " + item.id); // diagnóstico: conta cada render
  return <li onClick={() => aoClicar(item.id)}>{item.nome}</li>;
});

function Lista({ itens }) {
  // função nova a cada render: o memo de Linha nunca poupa nada
  // troque por aoClicar={abrir} e os renders de Linha somem
  return (
    <ul>
      {itens.map((i) => (
        <Linha key={i.id} item={i} aoClicar={(id) => abrir(id)} />
      ))}
    </ul>
  );
}`,
        nota: "Quando o pai renderiza, o contador de cada `Linha` sobe, porque a prop `aoClicar` é uma função nova a cada vez. Com `aoClicar={abrir}` (referência estável), o `memo` pula o render e o contador para.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Render não é mudança no DOM",
        texto:
          "**Renderizar é só chamar a função do componente**; o React só mexe no DOM onde a saída mudou. Por isso a maioria dos re-renders é inofensiva, e um re-render só é **desnecessário** quando produz a mesma saída **e** custa tempo medido. Para um componente que renderiza 50 vezes: (1) descarte o Strict Mode e o modo de desenvolvimento; (2) grave no Profiler e leia o motivo de cada render; (3) se o motivo é estado ou efeito, procure a atualização que se repete; (4) se é contexto ou pai, reduza quem assina ou quem renderiza; (5) só então memoize.",
      },
    ],
    armadilhas: [
      "Tratar todo re-render como bug: renderizar é barato e normal, e o React só atualiza o DOM no que mudou.",
      "Diagnosticar em desenvolvimento e estranhar o dobro de renders: o Strict Mode faz isso de propósito, só fora de produção.",
      "Pôr `memo` no filho sem estabilizar as props (objeto, array ou função novos a cada render): custa a comparação e não poupa nada.",
      "Contar logs sem medir o tempo: dez renders baratos importam menos que um render lento.",
    ],
    autoteste: [
      {
        pergunta: "Quais são as três coisas que fazem um componente renderizar de novo?",
        resposta:
          "Mudança do seu próprio estado (com valor diferente por `Object.is`), renderização do componente pai (por padrão os filhos vão junto, mesmo com props iguais, a menos que estejam em `memo`) e mudança de um contexto que ele consome.",
      },
      {
        pergunta:
          "O Profiler mostra um filho renderizando a cada tecla digitada no pai, com as mesmas props. Qual é a causa e quais são as saídas?",
        resposta:
          "O motivo é “o pai renderizou”: por padrão, o filho acompanha o pai. Saídas: descer o estado para o componente que o usa, passar o filho como `children` de um pai estável ou embrulhá-lo em `memo` com props estáveis, se o custo medido justificar.",
      },
    ],
  },
  en: {
    titulo: "Finding needless re-renders",
    pergunta: "How do you identify unnecessary re-renders?",
    porqueEsteMetodo:
      "To find a render that should not happen, you need to know exactly what triggers a render. Following one change down to the DOM shows where to look and which tool answers which question.",
    resposta30s:
      "A component renders when its own **state changes**, when its **parent renders** (and, by default, all the children come along) or when a **context** it consumes changes. To find needless renders, record the interaction in the **React DevTools Profiler** (with the option to record “why” each component rendered), turn on **update highlighting**, use a counter (`console.count`) or the **why-did-you-render** library, and look for the typical causes: new objects and functions in props, a wide context and state kept too high. A render is not a DOM change: only fix what costs measured time.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "What triggers a render, step by step",
        etapas: [
          "Something happens: a click calls `setCount(5)`, a `dispatch` changes the store or a network response arrives and writes state",
          "React compares the new value with the current one (`Object.is`); if equal, it usually does not render at all. If different, it **schedules** a render of the component that owns the state",
          "Rendering means **calling the component function** again to get the new JSX. By default that also applies to all its **children**, even with equal props, unless they are wrapped in `memo`",
          "If the value that changed is a **context**, every component consuming it also renders, wherever it sits in the tree",
          "React compares the new JSX with the previous one (reconciliation) and only changes the DOM where something differs. A render can finish without touching the DOM at all",
          "After the commit, effects whose dependencies changed run; if an effect sets state, another cycle begins (see L68)",
        ],
        nota: "In development, Strict Mode renders twice on purpose to help spot impurities. Do not count those renders as a problem in the production build.",
      },
      {
        tipo: "passos",
        titulo: "How to see it and find the cause",
        passos: [
          {
            titulo: "Reproduce and count",
            texto:
              'Put `console.count("ComponentName")` in the body of the suspect component and repeat the interaction. Compare the number with what you expected, preferably outside Strict Mode.',
          },
          {
            titulo: "React DevTools Profiler",
            texto:
              "In the Profiler tab, turn on the setting that records why each component rendered, record the interaction and open each component: the panel gives the reason (the parent rendered, or props, state, hooks or context changed). Grey components did not render in that commit, and the chart shows how long each one took.",
          },
          {
            titulo: "Update highlighting",
            texto:
              "In the DevTools general settings, turn on the option to highlight components when they render: the browser outlines in color whoever moves on each interaction. It is a quick way to see who renders without needing to.",
          },
          {
            titulo: "why-did-you-render",
            texto:
              "A development library that warns when a component renders again with props that are **equal in value** but **different by reference** (a recreated object or function). Use it only in development and only on the components you suspect.",
          },
          {
            titulo: "Measure the cost before fixing",
            texto:
              "Check in the Profiler how long the render takes. Many cheap renders matter less than one slow render; if the cost is small and the screen feels smooth, leave it alone.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Common causes, how they show up and what to do",
        colunas: ["Cause", "How it shows in the Profiler", "Fix"],
        linhas: [
          [
            "State kept too high",
            "Parent and several children render on every change; the reason is the parent’s state",
            "Move the state down to whoever uses it, or split the changing part into another component",
          ],
          [
            "New object, array or function in props",
            "The child with `memo` renders anyway; the reason is “props changed”",
            "A constant outside the component, `useMemo` or `useCallback` (see L98)",
          ],
          [
            "Wide context",
            "Every consumer renders; the reason is “context changed”",
            "Split into smaller contexts, memoize the `value`, separate state from functions",
          ],
          [
            "Child without `memo` under a rendering parent",
            "The reason is “the parent rendered”",
            "Accept it (normal and cheap), pass `children` from a stable parent or use `memo` if measured",
          ],
          [
            "Effect that sets state",
            "A run of renders right after the first; the reason is state changed by an effect",
            "Derive the value during render and fix the dependencies",
          ],
          [
            "Component defined inside another, or unstable `key`",
            "The component remounts instead of just rendering, and loses its state",
            "Move the definition outside and use stable keys (see L34)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Counting renders and watching `memo` fail",
        legenda: "JSX",
        codigo: `import { memo } from "react";

function open(id) {
  console.log("open", id);
}

const Row = memo(function Row({ item, onClick }) {
  console.count("render Row " + item.id); // diagnostic: counts every render
  return <li onClick={() => onClick(item.id)}>{item.name}</li>;
});

function List({ items }) {
  // a new function on every render: Row's memo never saves anything
  // switch to onClick={open} and the Row renders disappear
  return (
    <ul>
      {items.map((i) => (
        <Row key={i.id} item={i} onClick={(id) => open(id)} />
      ))}
    </ul>
  );
}`,
        nota: "When the parent renders, each `Row` counter goes up, because the `onClick` prop is a new function every time. With `onClick={open}` (a stable reference), `memo` skips the render and the counter stops.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A render is not a DOM change",
        texto:
          "**Rendering is just calling the component function**; React only touches the DOM where the output changed. That is why most re-renders are harmless, and a re-render is only **unnecessary** when it produces the same output **and** costs measured time. For a component that renders 50 times: (1) rule out Strict Mode and development mode; (2) record in the Profiler and read the reason for each render; (3) if the reason is state or an effect, look for the update that repeats; (4) if it is context or the parent, narrow who subscribes or who renders; (5) only then memoize.",
      },
    ],
    armadilhas: [
      "Treating every re-render as a bug: rendering is cheap and normal, and React only updates the DOM where something changed.",
      "Diagnosing in development and being puzzled by double the renders: Strict Mode does that on purpose, and only outside production.",
      "Putting `memo` on a child without stabilizing its props (a new object, array or function on every render): it costs the comparison and saves nothing.",
      "Counting logs without measuring time: ten cheap renders matter less than one slow render.",
    ],
    autoteste: [
      {
        pergunta: "What are the three things that make a component render again?",
        resposta:
          "A change in its own state (with a different value by `Object.is`), its parent rendering (by default children come along even with equal props, unless wrapped in `memo`) and a change in a context it consumes.",
      },
      {
        pergunta:
          "The Profiler shows a child rendering on every keystroke typed in the parent, with the same props. What is the cause and what are the ways out?",
        resposta:
          "The reason is “the parent rendered”: by default the child follows its parent. Ways out: move the state down to the component that uses it, pass the child as `children` of a stable parent or wrap it in `memo` with stable props, if the measured cost justifies it.",
      },
    ],
  },
};
