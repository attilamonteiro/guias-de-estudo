import type { Pergunta } from "../../tipos";

// L101 · O que é code splitting
export const l101: Pergunta = {
  numero: 101,
  modulo: "linkedin-desempenho",
  metodo: "whys",
  pt: {
    titulo: "O que é code splitting",
    pergunta: "O que é code splitting?",
    porqueEsteMetodo:
      "Code splitting é uma resposta a um problema: o bundle único atrasa a primeira tela. Percorrer os “por quês” (do problema ao ponto de corte, ao `lazy` e ao preço) mostra quando a divisão ajuda e quando atrapalha.",
    resposta30s:
      "**Code splitting** é dividir o JavaScript em vários arquivos (chunks) carregados **sob demanda**, em vez de um bundle único que o usuário baixa e executa inteiro antes de ver a primeira tela. O ponto de corte é o **`import()` dinâmico**; no React, `React.lazy` junto com `<Suspense>` carrega um componente só quando ele vai ser renderizado, e o corte mais comum é **por rota**, seguido de componentes pesados e bibliotecas grandes. O preço é mais requisições, possíveis cascatas e um estado de carregamento para desenhar bem.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que um bundle único atrasa a primeira tela?",
            resposta:
              "Porque o bundler junta o código de **todas** as telas em um arquivo, e o navegador precisa baixá-lo, analisá-lo e executá-lo antes de a interface ficar interativa, inclusive as telas que o usuário talvez nunca abra (administração, relatórios, editor). JavaScript custa duas vezes: transferir e executar. Em rede lenta e em aparelho modesto, isso pesa mais.",
          },
          {
            pergunta: "Por que dividir em partes resolve?",
            resposta:
              'Porque o carregamento inicial passa a trazer só o necessário para a primeira tela; o resto vira arquivos separados (**chunks**), baixados quando alguém precisa. O ponto de corte é o `import()` dinâmico: ao ver `import("./Relatorio")`, o bundler gera um chunk próprio para aquele módulo e suas dependências.',
          },
          {
            pergunta: "Por que o React usa `lazy` e `Suspense`?",
            resposta:
              'Porque `import()` devolve uma **promise**: o componente só existe depois que ela resolve. `lazy(() => import("./Relatorio"))` embrulha essa promise num componente; quando o React tenta renderizá-lo e o código ainda não chegou, ele **suspende** aquele trecho, e o `<Suspense fallback={...}>` mais próximo mostra um substituto até o módulo chegar. Se o download falhar, o erro sobe até o error boundary mais próximo.',
          },
          {
            pergunta: "Por que a rota é o primeiro corte?",
            resposta:
              "Porque é a fronteira natural: o usuário só vê uma tela por vez, esperar um instante ao navegar é aceito como parte da navegação, e rotas diferentes quase não compartilham o que precisam. Frameworks como o Next.js já dividem por rota sozinhos; numa SPA com roteador, cada página vira um `lazy`. Depois da rota, os cortes seguintes são componentes pesados fora da primeira tela (modal, editor, gráfico, mapa) e bibliotecas grandes carregadas só quando usadas.",
          },
          {
            pergunta: "Por que não dividir tudo em pedaços pequenos?",
            resposta:
              "Porque cada divisão custa: mais requisições, **cascatas** (o chunk da rota pede o do componente, que pede o da biblioteca), um estado de carregamento visível e mais arquivos para versionar e cachear. Dividir demais pode ficar mais lento que um bundle único. É preciso separar duas ideias: **dividir por funcionalidade** reduz o que se baixa na primeira visita; **separar as bibliotecas de terceiros** num chunk próprio (vendor) só melhora o cache entre versões do app, porque elas mudam menos que o seu código, mas o total da primeira visita é o mesmo.",
          },
        ],
        causaRaiz:
          "O navegador não sabe o que o usuário vai precisar, e um bundle único responde “tudo, agora”. O code splitting responde “o necessário agora, o resto quando pedir”, trocando bytes iniciais por **mais requisições e uma espera pontual**.",
      },
      {
        tipo: "codigo",
        titulo: "Divisão por rota com `lazy` e `Suspense`",
        legenda: "JSX",
        codigo: `import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Inicio from "./paginas/Inicio"; // a primeira tela vai no bundle principal

const Relatorios = lazy(() => import("./paginas/Relatorios")); // vira um arquivo à parte

export default function App() {
  return (
    <Suspense fallback={<p role="status">Carregando…</p>}>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Suspense>
  );
}`,
        nota: "O `lazy` espera um módulo cujo export `default` é o componente. Declare o `lazy` fora de qualquer componente, no topo do arquivo; dentro de um componente ele criaria uma versão nova a cada render.",
      },
      {
        tipo: "tabela",
        titulo: "O que dividir",
        colunas: ["Estratégia", "O que faz", "Ganho", "Custo ou cuidado"],
        linhas: [
          [
            "Por rota",
            "Cada página vira um chunk, baixado ao navegar",
            "É o maior corte e a fronteira mais natural",
            "Fallback na troca de página; cascata se a rota pede outros chunks em seguida",
          ],
          [
            "Por componente pesado",
            "Modal, editor, gráfico ou mapa carregados quando vão aparecer",
            "Tira peso da primeira tela",
            "A primeira abertura espera; reserve o espaço e pré-carregue",
          ],
          [
            "Por biblioteca de terceiros (chunk vendor)",
            "Separa o código que muda pouco do código do app",
            "Melhor cache entre versões do app",
            "Não reduz o que a primeira visita baixa",
          ],
          [
            "Por funcionalidade sob interação",
            "`import()` dentro de um clique (exportar PDF, por exemplo)",
            "Quem não usa nunca baixa",
            "Tratar a falha de rede",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decidir quando pagar o custo",
        texto:
          "Dividir é decidir **quando** o usuário paga cada parte: mova para depois o que não é necessário para a primeira tela. Meça com o analisador de bundle e com a aba de rede, prefira poucos cortes grandes (rotas e partes pesadas) a dezenas de pedaços minúsculos e use **pré-carregamento** (ao passar o mouse no link ou quando o navegador estiver ocioso) para esconder a espera. Veja também L102 e L103.",
      },
    ],
    armadilhas: [
      "Dividir sem medir: criar dezenas de chunks minúsculos, com mais requisições e cascatas e sem ganho real.",
      "Esquecer o `Suspense` com um fallback decente, ou o error boundary para a falha de download do chunk.",
      "Usar `React.lazy` com export nomeado: ele espera `default` (ou um `.then` que reexporta o componente como `default`).",
      "Confundir chunk de vendor com code splitting: separar bibliotecas melhora o cache, mas a primeira visita baixa o mesmo total.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre dividir por rota e separar as bibliotecas de terceiros num chunk vendor?",
        resposta:
          "Dividir por rota (ou funcionalidade) reduz o que a primeira visita baixa, porque as outras telas ficam para depois. Separar as bibliotecas só melhora o cache entre versões do app, já que elas mudam menos que o seu código; o total da primeira visita não diminui.",
      },
      {
        pergunta: 'O que faz `React.lazy(() => import("./X"))` e o que aparece enquanto o chunk não chegou?',
        resposta:
          "Cria um componente cujo código só é baixado quando ele vai ser renderizado pela primeira vez. Enquanto o módulo não chega, o componente suspende e o `<Suspense>` mais próximo mostra o `fallback`.",
      },
    ],
  },
  en: {
    titulo: "What code splitting is",
    pergunta: "What is code splitting?",
    porqueEsteMetodo:
      "Code splitting is an answer to a problem: a single bundle delays the first screen. Walking the whys (from the problem to the split point, to `lazy` and to the price) shows when splitting helps and when it hurts.",
    resposta30s:
      "**Code splitting** means dividing JavaScript into several files (chunks) loaded **on demand**, instead of one bundle the user downloads and runs in full before seeing the first screen. The split point is the **dynamic `import()`**; in React, `React.lazy` together with `<Suspense>` loads a component only when it is about to render, and the most common cut is **by route**, followed by heavy components and large libraries. The price is more requests, possible waterfalls and a loading state you have to design well.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does a single bundle delay the first screen?",
            resposta:
              "Because the bundler merges the code of **all** the screens into one file, and the browser has to download, parse and run it before the interface becomes interactive, including screens the user may never open (administration, reports, an editor). JavaScript costs twice: transfer and execution. On a slow network and a modest device, that weighs more.",
          },
          {
            pergunta: "Why does splitting into parts fix it?",
            resposta:
              'Because the initial load then brings only what the first screen needs; the rest becomes separate files (**chunks**), downloaded when someone needs them. The split point is the dynamic `import()`: on seeing `import("./Report")`, the bundler generates a chunk of its own for that module and its dependencies.',
          },
          {
            pergunta: "Why does React use `lazy` and `Suspense`?",
            resposta:
              'Because `import()` returns a **promise**: the component only exists once it resolves. `lazy(() => import("./Report"))` wraps that promise in a component; when React tries to render it and the code has not arrived, it **suspends** that part of the tree, and the nearest `<Suspense fallback={...}>` shows a stand-in until the module arrives. If the download fails, the error bubbles up to the nearest error boundary.',
          },
          {
            pergunta: "Why is the route the first cut?",
            resposta:
              "Because it is the natural boundary: the user sees one screen at a time, waiting a moment when navigating is accepted as part of navigation, and different routes share little of what they need. Frameworks such as Next.js already split by route on their own; in an SPA with a router, each page becomes a `lazy`. After routes, the next cuts are heavy components outside the first screen (a modal, an editor, a chart, a map) and large libraries loaded only when used.",
          },
          {
            pergunta: "Why not split everything into tiny pieces?",
            resposta:
              "Because every split costs: more requests, **waterfalls** (the route chunk asks for the component’s, which asks for the library’s), a visible loading state and more files to version and cache. Over-splitting can end up slower than a single bundle. Keep two ideas apart: **splitting by feature** reduces what is downloaded on the first visit; **separating third-party libraries** into their own chunk (vendor) only improves caching across app versions, because they change less than your code, while the first-visit total stays the same.",
          },
        ],
        causaRaiz:
          "The browser does not know what the user will need, and a single bundle answers “everything, now”. Code splitting answers “what is needed now, the rest when asked”, trading initial bytes for **more requests and a brief wait**.",
      },
      {
        tipo: "codigo",
        titulo: "Splitting by route with `lazy` and `Suspense`",
        legenda: "JSX",
        codigo: `import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home"; // the first screen goes in the main bundle

const Reports = lazy(() => import("./pages/Reports")); // becomes a separate file

export default function App() {
  return (
    <Suspense fallback={<p role="status">Loading…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Suspense>
  );
}`,
        nota: "`lazy` expects a module whose `default` export is the component. Declare the `lazy` outside any component, at the top of the file; inside a component it would create a new version on every render.",
      },
      {
        tipo: "tabela",
        titulo: "What to split",
        colunas: ["Strategy", "What it does", "Gain", "Cost or caution"],
        linhas: [
          [
            "By route",
            "Each page becomes a chunk, downloaded on navigation",
            "The biggest cut and the most natural boundary",
            "A fallback on page change; a waterfall if the route asks for other chunks next",
          ],
          [
            "By heavy component",
            "A modal, editor, chart or map loaded when it is about to appear",
            "Takes weight off the first screen",
            "The first opening waits; reserve the space and preload",
          ],
          [
            "By third-party library (vendor chunk)",
            "Separates rarely changing code from the app’s code",
            "Better caching across app versions",
            "Does not reduce what the first visit downloads",
          ],
          [
            "By feature on interaction",
            "`import()` inside a click (exporting a PDF, for example)",
            "Whoever never uses it never downloads it",
            "Handle the network failure",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Deciding when to pay the cost",
        texto:
          "Splitting is deciding **when** the user pays for each part: move to later what the first screen does not need. Measure with the bundle analyzer and the network tab, prefer a few big cuts (routes and heavy parts) over dozens of tiny pieces, and use **preloading** (on link hover or when the browser is idle) to hide the wait. See also L102 and L103.",
      },
    ],
    armadilhas: [
      "Splitting without measuring: creating dozens of tiny chunks, with more requests and waterfalls and no real gain.",
      "Forgetting `Suspense` with a decent fallback, or the error boundary for a chunk download failure.",
      "Using `React.lazy` with a named export: it expects `default` (or a `.then` that re-exports the component as `default`).",
      "Mixing up a vendor chunk with code splitting: separating libraries improves caching, but the first visit downloads the same total.",
    ],
    autoteste: [
      {
        pergunta:
          "What is the difference between splitting by route and separating third-party libraries into a vendor chunk?",
        resposta:
          "Splitting by route (or feature) reduces what the first visit downloads, because the other screens are left for later. Separating libraries only improves caching across app versions, since they change less than your code; the first-visit total does not shrink.",
      },
      {
        pergunta: 'What does `React.lazy(() => import("./X"))` do, and what shows up while the chunk has not arrived?',
        resposta:
          "It creates a component whose code is only downloaded when it is about to be rendered for the first time. While the module has not arrived, the component suspends and the nearest `<Suspense>` shows the `fallback`.",
      },
    ],
  },
};
