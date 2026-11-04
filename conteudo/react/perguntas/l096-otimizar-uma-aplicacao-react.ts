import type { Pergunta } from "../../tipos";

// L96 · Otimizar uma aplicação React
export const l096: Pergunta = {
  numero: 96,
  modulo: "linkedin-desempenho",
  metodo: "playbook",
  pt: {
    titulo: "Otimizar uma aplicação React",
    pergunta: "Como você otimiza uma aplicação React?",
    porqueEsteMetodo:
      "“Otimizar” não é uma lista de truques, é uma ordem de trabalho: medir, achar o gargalo, corrigir a causa e medir de novo. Um playbook mantém essa ordem e evita aplicar `useMemo` onde o problema é o tamanho do bundle.",
    resposta30s:
      "**Meça antes de mexer** (Profiler do React DevTools, Lighthouse e métricas de usuários reais, em build de produção), **identifique o gargalo** (carregamento, rede, renderização, listas grandes) e só então aplique a correção que o ataca: **code splitting** e imagens otimizadas para carregar menos, **estado perto de quem o usa** e memoização com critério (`memo`, `useMemo`, `useCallback`) para renderizar menos, **virtualização** para listas grandes e **cache de dados** para buscar menos. Evite otimização prematura; o **React Compiler** automatiza parte da memoização manual (confira react.dev).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: otimizar sem chute",
        passos: [
          {
            titulo: "Defina o alvo e meça",
            texto:
              "Escolha o que o usuário sente: abrir a página, interagir, rolar. Use o Lighthouse e as métricas de experiência (LCP, INP e CLS), idealmente também de usuários reais, o Profiler do React DevTools e a aba Performance do navegador. Meça em **build de produção**: o modo de desenvolvimento é mais lento e o Strict Mode renderiza em dobro.",
          },
          {
            titulo: "Classifique o gargalo",
            texto:
              "O tempo vai para **carregar** (bundle, imagens, fontes, requisições em cascata), para **renderizar** (componentes demais, cálculo caro), para **interagir** (handler pesado, thread bloqueada) ou para a **rede** (dados repetidos)? Cada classe tem remédio diferente (veja a tabela).",
          },
          {
            titulo: "Carregue menos",
            texto:
              'Divida o código por rota e por componente pesado com `React.lazy` (veja L101), analise o bundle e troque ou remova dependências grandes; sirva imagens no tamanho certo, com `loading="lazy"` fora da primeira tela; use cache HTTP e CDN. Sinal de acerto: LCP e tamanho inicial do JavaScript menores.',
          },
          {
            titulo: "Renderize menos",
            texto:
              "Coloque o estado **perto de quem o usa**, divida contextos largos, use `key` estável nas listas e só então memoize com critério (`memo`, `useMemo`, `useCallback`; veja L98 e L100). Para atualizações não urgentes, como filtrar uma lista enquanto se digita, use `startTransition` ou `useDeferredValue`.",
          },
          {
            titulo: "Listas e DOM grandes",
            texto:
              "Milhares de linhas no DOM travam rolagem e memória: use **virtualização** (renderizar só o que aparece na janela, com bibliotecas como react-window ou TanStack Virtual) ou **paginação** (veja L110 e L111).",
          },
          {
            titulo: "Busque menos e melhor",
            texto:
              "Reaproveite dados com cache e deduplicação, faça prefetch do que o usuário vai abrir, evite cascatas (buscas que esperam umas pelas outras sem necessidade) e mova cálculo pesado para um Web Worker ou para o servidor (veja L94).",
          },
          {
            titulo: "Meça de novo e proteja",
            texto:
              "Compare antes e depois com a mesma medição. Se o ganho não aparece, reverta: a otimização tem custo de complexidade. Para não regredir, acompanhe métricas reais em produção e considere orçamentos de desempenho no CI.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Gargalo, sinal e remédio",
        colunas: ["Gargalo", "Como aparece", "Correção típica"],
        linhas: [
          [
            "Bundle grande",
            "LCP lento; muito JavaScript baixado; o analisador de bundle mostra uma dependência enorme",
            "Code splitting, `React.lazy`, trocar ou remover a dependência, tree shaking",
          ],
          [
            "Imagens e fontes",
            "A imagem principal é o LCP; o layout pula (CLS) quando carrega",
            'Tamanho e formato certos, `width` e `height`, `loading="lazy"` fora da primeira tela, `font-display`',
          ],
          [
            "Renders em excesso",
            "O Profiler mostra muitos componentes renderizando a cada tecla, sem mudar",
            "Estado mais perto de quem usa, dividir contexto, `memo` com props estáveis",
          ],
          ["Lista grande", "Rolagem engasgada; milhares de nós no DOM", "Virtualização ou paginação"],
          [
            "Cálculo caro no render",
            "Um componente com tempo alto no Profiler mesmo sem mudar",
            "`useMemo` medido, simplificar o algoritmo ou mover para worker ou servidor",
          ],
          ["Rede e dados", "Requisições repetidas ou em cascata", "Cache e deduplicação, prefetch, buscas em paralelo"],
          [
            "Interação pesada",
            "Digitar ou clicar trava a tela (INP ruim)",
            "`startTransition` ou `useDeferredValue`, debounce, tirar trabalho do handler",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Estado perto de quem usa",
        legenda: "JSX",
        codigo: `// Antes: cada tecla re-renderiza a ListaPesada, porque \`busca\` vive no pai
function Pagina() {
  const [busca, setBusca] = useState("");
  return (
    <>
      <input value={busca} onChange={(e) => setBusca(e.target.value)} />
      <ListaPesada />
    </>
  );
}

// Depois: o estado desce para o componente que o usa
function CampoDeBusca() {
  const [busca, setBusca] = useState("");
  return <input value={busca} onChange={(e) => setBusca(e.target.value)} />;
}
// <Pagina> agora só monta <CampoDeBusca /> e <ListaPesada /> lado a lado`,
        nota: "Sem `memo` e sem `useCallback`: só reorganizar onde o estado mora. Se a lista precisar do texto para filtrar, passe-o como prop e use `useDeferredValue` ou `memo` com props estáveis.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A ordem importa",
        texto:
          "**Medir → achar o gargalo → corrigir a causa → medir de novo.** Os ganhos maiores costumam estar em enviar menos JavaScript, buscar dados com inteligência e deixar o estado no lugar certo; a memoização é ajuste fino. O mesmo vale para uma aplicação grande: orçamento de bundle, divisão por rota, monitoramento de métricas reais e estado bem colocado pesam mais que truques isolados.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Otimização prematura e o React Compiler",
        texto:
          "Otimizar sem medir deixa o código mais complexo e raramente resolve o problema real. O **React Compiler** é uma ferramenta de build que memoiza componentes e valores automaticamente em muitos casos, o que reduz a necessidade de escrever `useMemo`, `useCallback` e `memo` à mão; ele exige código que siga as regras do React e não substitui dividir código, virtualizar listas, cachear dados nem colocar o estado no lugar certo. Confira o suporte e os requisitos atuais em react.dev.",
      },
    ],
    armadilhas: [
      "Otimizar sem medir, ou medir em modo de desenvolvimento, que é mais lento e renderiza em dobro por causa do Strict Mode.",
      "Espalhar `useMemo`, `useCallback` e `memo` por tudo: mais código, mais comparações e, quando as dependências mudam a cada render, nenhum ganho.",
      "Atacar a renderização quando o gargalo é rede ou tamanho do bundle (ou o contrário).",
      "Definir componentes dentro de outros componentes ou usar o índice como `key`: causa remontagens, perda de estado e trabalho a mais.",
    ],
    autoteste: [
      {
        pergunta: "Qual é o primeiro passo para otimizar uma aplicação React, e por que não começar pelo `useMemo`?",
        resposta:
          "Medir e identificar o gargalo. O `useMemo` custa memória e comparação e só ajuda se o problema for um cálculo caro e repetido; se o gargalo é o bundle, a rede ou uma lista gigante, ele não muda nada.",
      },
      {
        pergunta: "Cite três gargalos diferentes e uma correção para cada.",
        resposta:
          "Bundle grande: code splitting com `React.lazy`. Lista com milhares de linhas: virtualização. Re-renders por estado alto demais: descer o estado para o componente que o usa (e memoizar só se medido).",
      },
    ],
  },
  en: {
    titulo: "Optimizing a React app",
    pergunta: "How do you optimize a React application?",
    porqueEsteMetodo:
      "“Optimizing” is not a list of tricks, it is an order of work: measure, find the bottleneck, fix the cause and measure again. A playbook keeps that order and avoids reaching for `useMemo` when the problem is bundle size.",
    resposta30s:
      "**Measure before you touch anything** (React DevTools Profiler, Lighthouse and real-user metrics, on a production build), **identify the bottleneck** (loading, network, rendering, large lists) and only then apply the fix that targets it: **code splitting** and optimized images to load less, **state close to where it is used** and judicious memoization (`memo`, `useMemo`, `useCallback`) to render less, **virtualization** for large lists and **data caching** to fetch less. Avoid premature optimization; the **React Compiler** automates part of the manual memoization (check react.dev).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: optimize without guessing",
        passos: [
          {
            titulo: "Set the target and measure",
            texto:
              "Pick what the user feels: opening the page, interacting, scrolling. Use Lighthouse and the experience metrics (LCP, INP and CLS), ideally from real users as well, the React DevTools Profiler and the browser’s Performance tab. Measure on a **production build**: development mode is slower and Strict Mode renders twice.",
          },
          {
            titulo: "Classify the bottleneck",
            texto:
              "Does the time go to **loading** (bundle, images, fonts, request waterfalls), to **rendering** (too many components, an expensive calculation), to **interaction** (a heavy handler, a blocked thread) or to the **network** (repeated data)? Each class has a different remedy (see the table).",
          },
          {
            titulo: "Load less",
            texto:
              'Split code by route and by heavy component with `React.lazy` (see L101), analyze the bundle and replace or remove large dependencies; serve images at the right size, with `loading="lazy"` below the first screen; use HTTP caching and a CDN. Sign you got it right: smaller LCP and initial JavaScript size.',
          },
          {
            titulo: "Render less",
            texto:
              "Put state **close to where it is used**, split wide contexts, use stable `key`s in lists and only then memoize with judgment (`memo`, `useMemo`, `useCallback`; see L98 and L100). For non-urgent updates, such as filtering a list while typing, use `startTransition` or `useDeferredValue`.",
          },
          {
            titulo: "Large lists and DOM",
            texto:
              "Thousands of rows in the DOM choke scrolling and memory: use **virtualization** (render only what is in the window, with libraries such as react-window or TanStack Virtual) or **pagination** (see L110 and L111).",
          },
          {
            titulo: "Fetch less and better",
            texto:
              "Reuse data with caching and deduplication, prefetch what the user is about to open, avoid waterfalls (fetches that wait on each other for no reason) and move heavy computation to a Web Worker or the server (see L94).",
          },
          {
            titulo: "Measure again and protect",
            texto:
              "Compare before and after with the same measurement. If the gain does not show, revert: optimization costs complexity. To avoid regressions, track real metrics in production and consider performance budgets in CI.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Bottleneck, signal and remedy",
        colunas: ["Bottleneck", "How it shows up", "Typical fix"],
        linhas: [
          [
            "Large bundle",
            "Slow LCP; a lot of JavaScript downloaded; the bundle analyzer shows one huge dependency",
            "Code splitting, `React.lazy`, replace or remove the dependency, tree shaking",
          ],
          [
            "Images and fonts",
            "The main image is the LCP; the layout jumps (CLS) as things load",
            'Right size and format, `width` and `height`, `loading="lazy"` below the first screen, `font-display`',
          ],
          [
            "Excess renders",
            "The Profiler shows many components rendering on every keystroke without changing",
            "State closer to where it is used, split context, `memo` with stable props",
          ],
          ["Large list", "Choppy scrolling; thousands of DOM nodes", "Virtualization or pagination"],
          [
            "Expensive calculation in render",
            "A component with a high time in the Profiler even when nothing changes",
            "Measured `useMemo`, simplify the algorithm or move it to a worker or the server",
          ],
          [
            "Network and data",
            "Repeated or waterfall requests",
            "Caching and deduplication, prefetch, parallel fetches",
          ],
          [
            "Heavy interaction",
            "Typing or clicking freezes the screen (bad INP)",
            "`startTransition` or `useDeferredValue`, debounce, take work out of the handler",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "State close to where it is used",
        legenda: "JSX",
        codigo: `// Before: every keystroke re-renders HeavyList, because \`search\` lives in the parent
function Page() {
  const [search, setSearch] = useState("");
  return (
    <>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <HeavyList />
    </>
  );
}

// After: the state moves down to the component that uses it
function SearchField() {
  const [search, setSearch] = useState("");
  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
// <Page> now just mounts <SearchField /> and <HeavyList /> side by side`,
        nota: "No `memo`, no `useCallback`: just rearranging where the state lives. If the list needs the text to filter, pass it as a prop and use `useDeferredValue` or `memo` with stable props.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The order matters",
        texto:
          "**Measure → find the bottleneck → fix the cause → measure again.** The bigger wins tend to come from shipping less JavaScript, fetching data smartly and keeping state in the right place; memoization is fine-tuning. The same holds for a large application: bundle budgets, route-level splitting, real-metric monitoring and well-placed state matter more than isolated tricks.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Premature optimization and the React Compiler",
        texto:
          "Optimizing without measuring makes code more complex and rarely fixes the real problem. The **React Compiler** is a build tool that memoizes components and values automatically in many cases, which reduces the need to write `useMemo`, `useCallback` and `memo` by hand; it requires code that follows the rules of React and does not replace splitting code, virtualizing lists, caching data or placing state well. Check current support and requirements at react.dev.",
      },
    ],
    armadilhas: [
      "Optimizing without measuring, or measuring in development mode, which is slower and renders twice because of Strict Mode.",
      "Sprinkling `useMemo`, `useCallback` and `memo` everywhere: more code, more comparisons and, when dependencies change on every render, no gain at all.",
      "Attacking rendering when the bottleneck is the network or bundle size (or the other way around).",
      "Defining components inside other components or using the index as `key`: it causes remounts, lost state and extra work.",
    ],
    autoteste: [
      {
        pergunta: "What is the first step in optimizing a React app, and why not start with `useMemo`?",
        resposta:
          "Measuring and identifying the bottleneck. `useMemo` costs memory and comparison and only helps when the problem is an expensive, repeated calculation; if the bottleneck is the bundle, the network or a giant list, it changes nothing.",
      },
      {
        pergunta: "Name three different bottlenecks and one fix for each.",
        resposta:
          "Large bundle: code splitting with `React.lazy`. A list with thousands of rows: virtualization. Re-renders caused by state kept too high: move the state down to the component that uses it (and memoize only if measured).",
      },
    ],
  },
};
