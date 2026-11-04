import type { Pergunta } from "../../tipos";

// L28 · O que acontece ao renderizar
export const l028: Pergunta = {
  numero: 28,
  modulo: "linkedin-renderizacao",
  metodo: "trace",
  pt: {
    titulo: "O que acontece ao renderizar",
    pergunta: "O que acontece durante uma renderização do React?",
    porqueEsteMetodo:
      "Render e commit são fáceis de confundir até você seguir uma única atualização do gatilho até a tela. O percurso mostra onde cada coisa acontece, o que pode ser repetido e o que de fato mexe no DOM.",
    resposta30s:
      "Uma atualização tem três momentos: o **gatilho** (um `setState`, por exemplo), a fase de **render**, em que o React chama os seus componentes e calcula o que mudou (precisa ser **pura** e pode ser interrompida ou repetida), e a fase de **commit**, em que aplica as mudanças ao DOM, roda os layout effects e, depois, os effects. Renderizar um componente **não** significa mexer no DOM. Em desenvolvimento, o **Strict Mode** renderiza duas vezes para revelar impurezas.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Do gatilho à tela",
        etapas: [
          "Gatilho: um evento chama `setState` (ou a raiz renderiza pela primeira vez); o React agenda a renderização e agrupa as atualizações do mesmo evento (veja L36)",
          "Fase de render: o React chama as funções dos componentes afetados, de cima para baixo, e coleta o que cada uma devolve (elementos JSX)",
          "Ainda no render, ele compara o resultado com a árvore anterior (reconciliação, veja L23) e calcula a lista mínima de mudanças. O DOM ainda não foi tocado",
          "Fase de commit: de forma síncrona, o React aplica as mudanças ao DOM e atualiza as `ref`s. Esta etapa não é interrompida",
          "Os layout effects (`useLayoutEffect`) rodam logo em seguida, antes de o navegador pintar, e podem medir o DOM já atualizado",
          "O navegador pinta a tela",
          "Os effects (`useEffect`) rodam depois, em geral após a pintura; antes de cada novo efeito, o React executa a limpeza do anterior, se houver",
        ],
        nota: "Em desenvolvimento, o Strict Mode chama cada componente (e alguns hooks, como reducers e a função inicial do `useState`) uma segunda vez durante o render, e faz um ciclo extra de “montar, limpar, montar” nos efeitos.",
      },
      {
        tipo: "tabela",
        titulo: "Fase de render x fase de commit",
        colunas: ["Aspecto", "Fase de render", "Fase de commit"],
        linhas: [
          [
            "O que faz",
            "Chama os componentes, obtém os elementos e calcula o que mudou",
            "Aplica as mudanças ao DOM e atualiza as refs",
          ],
          ["Toca o DOM?", "Não", "Sim, só aqui"],
          [
            "Pode ser pausada, repetida ou descartada?",
            "Pode, em renderizações concorrentes; também é repetida no Strict Mode",
            "Não: roda de uma vez",
          ],
          [
            "O que se exige",
            "Pureza: mesmas entradas, mesma saída, sem efeitos colaterais",
            "Aqui acontecem os efeitos, depois que o DOM foi atualizado",
          ],
          [
            "O que roda ali",
            "Corpo do componente, funções do `useState` e do `useMemo`, reducers",
            "Mutações do DOM, refs, `useLayoutEffect` e, em seguida, `useEffect`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um render impuro que o Strict Mode denuncia",
        legenda: "JSX",
        codigo: `let numero = 0; // fora do componente

function Recibo() {
  numero += 1; // impuro: muda algo de fora durante o render
  return <p>Recibo nº {numero}</p>;
}

// Puro: o valor vem de props (ou de state) e o mesmo input dá o mesmo output.
function ReciboPuro({ numero }) {
  return <p>Recibo nº {numero}</p>;
}`,
        nota: "Com o Strict Mode, em desenvolvimento, o contador de `Recibo` avança de dois em dois, porque cada renderização chama a função duas vezes. Um componente puro dá o mesmo resultado sempre, então repetir o render é inofensivo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Renderizar é calcular, não desenhar",
        texto:
          "“O componente renderizou” quer dizer que o React **chamou a função** e obteve uma descrição da interface. O DOM só muda na fase de commit, e apenas onde essa descrição difere da anterior. Efeitos colaterais (requisição, assinatura, timer, mexer no DOM) pertencem a handlers e a efeitos, nunca ao corpo do componente.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pureza e Strict Mode",
        texto:
          "O React pode chamar um componente várias vezes, pausar ou descartar um render que ficou obsoleto. Isso só é seguro se o componente for puro: sem mutar variáveis externas ou props, e sem ler `Math.random()` ou `Date.now()` durante o render (em handlers e efeitos, tudo bem). O Strict Mode, só em desenvolvimento, renderiza duas vezes (e refaz o ciclo dos efeitos) para tornar essas impurezas visíveis; ele não existe em produção.",
      },
    ],
    armadilhas: [
      "Dizer que “renderizar atualiza o DOM”: renderizar calcula; o DOM só é alterado no commit, e apenas onde mudou.",
      "Fazer requisição, assinar eventos ou mexer em `document` no corpo do componente: o render pode ser repetido ou descartado, então isso roda a mais ou vaza.",
      "Mutar props, state ou uma variável externa durante o render.",
      "Tratar o log em dobro do Strict Mode como bug de produção, ou desligar o Strict Mode em vez de corrigir a impureza.",
    ],
    autoteste: [
      {
        pergunta: "Por que um componente precisa ser puro?",
        resposta:
          "Porque o React pode chamá-lo mais de uma vez, pausar ou descartar um render antes do commit. Com efeitos colaterais no corpo, eles se repetem, vazam ou acontecem sem que a tela mude.",
      },
      {
        pergunta: "Qual a diferença entre `useLayoutEffect` e `useEffect` na linha do tempo?",
        resposta:
          "Os dois rodam depois do commit: o layout effect roda logo após as mudanças no DOM e antes da pintura (serve para medir o layout); o `useEffect` roda em seguida, em geral depois da pintura.",
      },
    ],
  },
  en: {
    titulo: "What happens during render",
    pergunta: "What happens during a React render?",
    porqueEsteMetodo:
      "Render and commit are easy to mix up until you follow a single update from trigger to screen. The path shows where each thing happens, what can be repeated and what actually touches the DOM.",
    resposta30s:
      "An update has three moments: the **trigger** (a `setState`, for example), the **render** phase, where React calls your components and works out what changed (it must be **pure** and may be interrupted or repeated), and the **commit** phase, where it applies the changes to the DOM, runs the layout effects and, afterwards, the effects. Rendering a component does **not** mean touching the DOM. In development, **Strict Mode** renders twice to expose impurities.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "From trigger to screen",
        etapas: [
          "Trigger: an event calls `setState` (or the root renders for the first time); React schedules the render and groups the updates from the same event (see L36)",
          "Render phase: React calls the functions of the affected components, top down, and collects what each returns (JSX elements)",
          "Still in render, it compares the result with the previous tree (reconciliation, see L23) and computes the minimal list of changes. The DOM has not been touched yet",
          "Commit phase: synchronously, React applies the changes to the DOM and updates the `ref`s. This step is not interrupted",
          "Layout effects (`useLayoutEffect`) run right after, before the browser paints, and can measure the already-updated DOM",
          "The browser paints the screen",
          "Effects (`useEffect`) run later, usually after painting; before each new effect, React runs the previous one’s cleanup, if any",
        ],
        nota: "In development, Strict Mode calls each component (and some hooks, such as reducers and the initializer of `useState`) a second time during render, and runs an extra “mount, clean up, mount” cycle on effects.",
      },
      {
        tipo: "tabela",
        titulo: "Render phase vs commit phase",
        colunas: ["Aspect", "Render phase", "Commit phase"],
        linhas: [
          [
            "What it does",
            "Calls the components, gets the elements and works out what changed",
            "Applies the changes to the DOM and updates refs",
          ],
          ["Touches the DOM?", "No", "Yes, only here"],
          [
            "Can it be paused, repeated or discarded?",
            "It can, in concurrent rendering; it is also repeated in Strict Mode",
            "No: it runs in one go",
          ],
          [
            "What it requires",
            "Purity: same inputs, same output, no side effects",
            "This is where effects happen, after the DOM is updated",
          ],
          [
            "What runs there",
            "Component body, `useState` and `useMemo` functions, reducers",
            "DOM mutations, refs, `useLayoutEffect` and then `useEffect`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An impure render that Strict Mode exposes",
        legenda: "JSX",
        codigo: `let counter = 0; // outside the component

function Receipt() {
  counter += 1; // impure: changes something outside during render
  return <p>Receipt no. {counter}</p>;
}

// Pure: the value comes from props (or state) and the same input gives the same output.
function PureReceipt({ number }) {
  return <p>Receipt no. {number}</p>;
}`,
        nota: "With Strict Mode in development, the `Receipt` counter advances by two, because each render calls the function twice. A pure component always gives the same result, so repeating the render is harmless.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rendering is computing, not drawing",
        texto:
          "“The component rendered” means React **called the function** and got a description of the UI. The DOM only changes in the commit phase, and only where that description differs from the previous one. Side effects (a request, a subscription, a timer, touching the DOM) belong in handlers and effects, never in the component body.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Purity and Strict Mode",
        texto:
          "React may call a component several times, and pause or discard a render that became obsolete. That is only safe if the component is pure: no mutating outside variables or props, and no reading `Math.random()` or `Date.now()` during render (in handlers and effects, fine). Strict Mode, in development only, renders twice (and replays the effect cycle) to make these impurities visible; it does not exist in production.",
      },
    ],
    armadilhas: [
      "Saying “rendering updates the DOM”: rendering computes; the DOM is only changed at commit, and only where something changed.",
      "Making a request, subscribing to events or touching `document` in the component body: the render may be repeated or discarded, so it runs extra times or leaks.",
      "Mutating props, state or an outside variable during render.",
      "Treating Strict Mode’s doubled log as a production bug, or turning Strict Mode off instead of fixing the impurity.",
    ],
    autoteste: [
      {
        pergunta: "Why must a component be pure?",
        resposta:
          "Because React may call it more than once, and pause or discard a render before the commit. With side effects in the body, they repeat, leak or happen without the screen changing.",
      },
      {
        pergunta: "What is the difference between `useLayoutEffect` and `useEffect` on the timeline?",
        resposta:
          "Both run after the commit: the layout effect runs right after the DOM changes and before painting (it is for measuring layout); `useEffect` runs next, usually after painting.",
      },
    ],
  },
};
