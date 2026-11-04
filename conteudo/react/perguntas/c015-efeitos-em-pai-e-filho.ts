import type { Pergunta } from "../../tipos";

// C15 · Efeitos em pai e filho
export const c015: Pergunta = {
  numero: 515,
  modulo: "coddy-intermediario",
  metodo: "trace",
  pt: {
    titulo: "Efeitos em pai e filho",
    pergunta:
      "O que isto registra? (ordem dos efeitos) Um componente App renderiza um componente Child; cada um registra uma mensagem ao renderizar e outra dentro de um useEffect com array de dependências vazio. Quais são as quatro linhas impressas, em ordem?",
    porqueEsteMetodo:
      "A ordem dos logs só deixa de parecer arbitrária quando você acompanha uma montagem de ponta a ponta: o React primeiro renderiza a árvore inteira, depois confirma no DOM e só então roda os efeitos, de baixo para cima. Seguir esse caminho resolve também a variação com `useLayoutEffect`.",
    resposta30s:
      "As quatro linhas saem nesta ordem: **App render, Child render, Child effect, App effect**. A renderização desce da raiz às folhas (o pai executa primeiro porque é ele que devolve o filho), mas os efeitos rodam depois que o DOM foi confirmado e sobem das folhas à raiz, então o efeito do **filho vem antes do pai**. Com `useLayoutEffect`, a ordem dentro de um componente é render, layout effect e só então effect, mesmo que o `useEffect` esteja escrito primeiro. Em desenvolvimento, o StrictMode repete renderizações e efeitos.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "O exemplo",
        legenda: "JSX",
        codigo: `import { useEffect } from "react";

function Child() {
  console.log("Child render");
  useEffect(() => {
    console.log("Child effect");
  }, []);
  return <p>Filho</p>;
}

export default function App() {
  console.log("App render");
  useEffect(() => {
    console.log("App effect");
  }, []);
  return <Child />;
}`,
      },
      {
        tipo: "fluxo",
        titulo: "Uma montagem, do começo ao fim",
        etapas: [
          "O React começa a renderizar `App`: executa o corpo da função e imprime `App render`; o retorno traz `<Child />`",
          "Descendo um nível, renderiza `Child` e imprime `Child render`; a fase de render termina aqui, sem ter tocado o DOM",
          "Commit: o React cria os elementos no DOM e os coloca na página (é neste momento que rodam os layout effects, se houver)",
          "O navegador pinta a tela; os efeitos comuns rodam em seguida (normalmente depois da pintura)",
          "Os efeitos do filho rodam primeiro: `Child effect`",
          "Depois os do pai: `App effect`",
        ],
        nota: "“Filho antes do pai” é a mesma regra do `componentDidMount` em classes: o React termina o trabalho nas folhas antes de subir para a raiz.",
      },
      {
        tipo: "tabela",
        titulo: "Ordem por tipo de código",
        colunas: ["O que roda", "Quando", "Ordem na árvore"],
        linhas: [
          [
            "Corpo do componente (render)",
            "Fase de render, antes de o DOM mudar",
            "De cima para baixo: pai, depois filho",
          ],
          [
            "`useLayoutEffect`",
            "No commit, logo depois de o DOM ser atualizado e antes da pintura; é síncrono",
            "De baixo para cima: filho, depois pai",
          ],
          ["`useEffect`", "Depois do commit; normalmente depois da pintura", "De baixo para cima: filho, depois pai"],
          [
            "Vários hooks do mesmo tipo no mesmo componente",
            "No mesmo momento do tipo deles",
            "Na ordem em que foram declarados",
          ],
        ],
        nota: "Todos os layout effects da árvore rodam antes de qualquer `useEffect` do mesmo commit.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Render desce, efeitos sobem",
        texto:
          "Render: pai antes do filho. Efeitos (de layout e comuns): filho antes do pai. Entre os tipos: render, depois layout effect, depois effect. Dentro do mesmo tipo e do mesmo componente: ordem de declaração. Por isso um componente com o `useEffect` escrito antes do `useLayoutEffect` registra, nesta ordem: a mensagem do render, a do layout effect e a do effect.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "StrictMode e suposições erradas",
        texto:
          "Em desenvolvimento, com o `<StrictMode>`, o React renderiza cada componente duas vezes e, na montagem, roda os efeitos, limpa e roda de novo (para expor limpeza ausente), então aparecem mais linhas do que as quatro; em produção são quatro. O console pode até esmaecer a segunda renderização; confira os detalhes em react.dev. Lembre também da consequência da ordem: o efeito do filho roda **antes** do efeito do pai, então o filho não pode contar com uma conexão ou inscrição que o pai abre no próprio efeito.",
      },
    ],
    armadilhas: [
      "Supor que o pai executa os efeitos primeiro porque renderizou primeiro: a renderização desce, os efeitos sobem.",
      "Esperar que os efeitos rodem durante a renderização: eles só rodam depois do commit, com o DOM já atualizado.",
      "Achar que a posição do `useEffect` no código vence a do `useLayoutEffect`: layout effects sempre rodam antes dos efeitos comuns do mesmo commit.",
      "Estranhar linhas duplicadas em desenvolvimento e “consertar” removendo o StrictMode: a repetição é proposital, e a correção é escrever a limpeza do efeito.",
    ],
    autoteste: [
      {
        pergunta: "Quais são as quatro linhas e em que ordem aparecem?",
        resposta:
          "`App render`, `Child render`, `Child effect`, `App effect`. Renderiza-se de cima para baixo, e os efeitos rodam depois do commit, do filho para o pai.",
      },
      {
        pergunta:
          "Num componente com `useEffect` declarado antes de `useLayoutEffect`, qual é a ordem de render, layout effect e effect?",
        resposta:
          "Render, depois layout effect, depois effect. O layout effect é síncrono, roda após o DOM mudar e antes da pintura, e o efeito comum vem depois, mesmo estando escrito primeiro.",
      },
    ],
  },
  en: {
    titulo: "Effects in parent and child",
    pergunta:
      "What does this log? (effect order) An App component renders a Child component; each one logs a message while rendering and another inside a useEffect with an empty dependency array. What are the four lines printed, in order?",
    porqueEsteMetodo:
      "The order of the logs only stops looking arbitrary when you follow one mount from start to finish: React first renders the whole tree, then commits to the DOM and only then runs the effects, from the bottom up. Following that path also settles the variation with `useLayoutEffect`.",
    resposta30s:
      "The four lines come out in this order: **App render, Child render, Child effect, App effect**. Rendering goes down from the root to the leaves (the parent runs first because it is what returns the child), but effects run after the DOM is committed and go up from the leaves to the root, so the **child’s effect comes before the parent’s**. With `useLayoutEffect`, the order inside one component is render, layout effect and only then effect, even if the `useEffect` is written first. In development, StrictMode repeats renders and effects.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "The example",
        legenda: "JSX",
        codigo: `import { useEffect } from "react";

function Child() {
  console.log("Child render");
  useEffect(() => {
    console.log("Child effect");
  }, []);
  return <p>Child</p>;
}

export default function App() {
  console.log("App render");
  useEffect(() => {
    console.log("App effect");
  }, []);
  return <Child />;
}`,
      },
      {
        tipo: "fluxo",
        titulo: "One mount, from start to finish",
        etapas: [
          "React starts rendering `App`: it runs the function body and prints `App render`; the return value contains `<Child />`",
          "One level down, it renders `Child` and prints `Child render`; the render phase ends here, without having touched the DOM",
          "Commit: React creates the elements in the DOM and puts them on the page (this is when layout effects run, if there are any)",
          "The browser paints the screen; regular effects run right after (normally after paint)",
          "The child’s effects run first: `Child effect`",
          "Then the parent’s: `App effect`",
        ],
        nota: "“Child before parent” is the same rule as `componentDidMount` in classes: React finishes the work at the leaves before moving up to the root.",
      },
      {
        tipo: "tabela",
        titulo: "Order by kind of code",
        colunas: ["What runs", "When", "Order in the tree"],
        linhas: [
          ["Component body (render)", "Render phase, before the DOM changes", "Top to bottom: parent, then child"],
          [
            "`useLayoutEffect`",
            "In the commit, right after the DOM is updated and before paint; it is synchronous",
            "Bottom to top: child, then parent",
          ],
          ["`useEffect`", "After the commit; normally after paint", "Bottom to top: child, then parent"],
          [
            "Several hooks of the same kind in one component",
            "At the same moment as their kind",
            "In the order they were declared",
          ],
        ],
        nota: "All layout effects in the tree run before any `useEffect` from the same commit.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Render goes down, effects go up",
        texto:
          "Render: parent before child. Effects (layout and regular): child before parent. Between kinds: render, then layout effect, then effect. Within the same kind and the same component: declaration order. That is why a component with the `useEffect` written before the `useLayoutEffect` logs, in this order: the render message, the layout effect message and the effect message.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "StrictMode and wrong assumptions",
        texto:
          "In development, with `<StrictMode>`, React renders each component twice and, on mount, runs the effects, cleans up and runs them again (to expose missing cleanup), so more than four lines appear; in production there are four. The console may even dim the second render; check the details on react.dev. Remember the consequence of the order too: the child’s effect runs **before** the parent’s, so the child cannot count on a connection or subscription the parent opens in its own effect.",
      },
    ],
    armadilhas: [
      "Assuming the parent runs its effects first because it rendered first: rendering goes down, effects go up.",
      "Expecting effects to run during rendering: they only run after the commit, with the DOM already updated.",
      "Thinking the position of `useEffect` in the code beats `useLayoutEffect`: layout effects always run before regular effects of the same commit.",
      "Being puzzled by duplicated lines in development and “fixing” it by removing StrictMode: the repetition is deliberate, and the fix is to write the effect’s cleanup.",
    ],
    autoteste: [
      {
        pergunta: "What are the four lines and in what order do they appear?",
        resposta:
          "`App render`, `Child render`, `Child effect`, `App effect`. Rendering goes top to bottom, and effects run after the commit, from child to parent.",
      },
      {
        pergunta:
          "In a component with `useEffect` declared before `useLayoutEffect`, what is the order of render, layout effect and effect?",
        resposta:
          "Render, then layout effect, then effect. The layout effect is synchronous, runs after the DOM changes and before paint, and the regular effect comes later, even though it is written first.",
      },
    ],
  },
};
