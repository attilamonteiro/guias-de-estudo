import type { Pergunta } from "../../tipos";

// L102 · O que é lazy loading
export const l102: Pergunta = {
  numero: 102,
  modulo: "linkedin-desempenho",
  metodo: "feynman",
  pt: {
    titulo: "O que é lazy loading",
    pergunta: "O que é lazy loading?",
    porqueEsteMetodo:
      "Lazy loading é uma ideia cotidiana (buscar só quando pedem) com uma implementação específica em React. Começar pela imagem simples e descer ao mecanismo do `lazy` e do `Suspense` mostra por que há um estado de espera.",
    resposta30s:
      '**Lazy loading** é adiar o carregamento de um recurso até ele ser necessário, como buscar o item no depósito só quando o cliente pede. No React, `React.lazy(() => import("./X"))` baixa o código do componente na primeira vez que ele vai ser renderizado, e `<Suspense fallback>` mostra um substituto enquanto isso; o uso típico é em **rotas**, modais e componentes pesados fora da primeira tela. Para imagens e iframes existe o `loading="lazy"` nativo; o ganho é uma primeira tela mais leve, e o preço, uma espera na hora do uso.',
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa loja de departamentos. Em vez de pôr todo o estoque nas prateleiras no dia da abertura (o que atrasaria a abertura), a loja expõe o essencial e busca o resto no depósito **só quando um cliente pede**. A loja abre rápido; quem pede algo do depósito espera um instante.",
        tecnico:
          '**Lazy loading** adia o carregamento de um recurso até que ele seja necessário: componentes, rotas, módulos, imagens, iframes. No React, `lazy(() => import("./Grafico"))` cria um componente cujo código só é baixado na primeira vez que ele tenta renderizar; enquanto o módulo não chega, o componente **suspende** e o `<Suspense>` mais próximo mostra o `fallback`. Depois da primeira carga, o módulo fica disponível e as renderizações seguintes são imediatas. Para mídia, o atributo `loading="lazy"` em `<img>` e `<iframe>` pede ao navegador que adie o download até o elemento chegar perto da área visível.',
        limite:
          "Na loja, quem pede espera. Aqui também: o carregamento preguiçoso troca tempo inicial por **espera no momento do uso**, e pode causar saltos de layout (uma imagem sem tamanho definido) ou cascatas de downloads. Além disso, o que aparece logo na abertura, como a imagem principal da primeira tela, **não** deve ser preguiçoso: seria atrasar justamente o que o usuário vê primeiro.",
      },
      {
        tipo: "fluxo",
        titulo: "O que acontece com um componente `lazy`",
        etapas: [
          "Na construção, o bundler vê o `import()` dinâmico e gera um arquivo à parte (um chunk) para aquele módulo",
          "O componente `lazy` é renderizado pela primeira vez (o usuário abre a rota, o modal ou a aba), e o React tenta usá-lo, mas o código ainda não chegou",
          "O React suspende essa parte da árvore e o `<Suspense>` mais próximo mostra o `fallback`, enquanto o navegador baixa e executa o chunk",
          "A promise resolve com o módulo; o React usa o export `default` como componente e o desenha no lugar do fallback",
          "As renderizações seguintes usam o módulo já carregado. Se o download falhar, o erro sobe até o error boundary mais próximo (sem ele, a árvore do React desmonta)",
        ],
        nota: "Em navegações feitas dentro de uma transição (`startTransition` ou `useTransition`), o React mantém a tela atual até a próxima ficar pronta, em vez de trocá-la por um fallback, o que evita o piscar.",
      },
      {
        tipo: "codigo",
        titulo: "Um editor carregado só quando o usuário pede",
        legenda: "JSX",
        codigo: `import { lazy, Suspense, useState } from "react";

const EditorDeTexto = lazy(() => import("./EditorDeTexto")); // chunk à parte

export default function Postagem() {
  const [editando, setEditando] = useState(false);

  return (
    <article>
      <button onClick={() => setEditando(true)}>Editar</button>
      {editando && (
        <Suspense fallback={<p role="status">Carregando editor…</p>}>
          <EditorDeTexto />
        </Suspense>
      )}
    </article>
  );
}`,
        nota: 'O código do editor só é baixado no primeiro clique em “Editar”. O `role="status"` faz o leitor de tela anunciar o carregamento.',
      },
      {
        tipo: "tabela",
        titulo: "Onde faz sentido",
        colunas: ["Alvo", "Como", "Cuidado"],
        linhas: [
          [
            "Rotas e páginas",
            "`lazy` por página com `Suspense` acima das rotas (ou o suporte a rotas `lazy` do roteador)",
            "Fallback no nível do layout para não piscar a página inteira; pré-carregar ao passar o mouse no link",
          ],
          [
            "Modais, abas e painéis fora da primeira tela",
            "`lazy` e só renderizar quando abrir",
            "O primeiro clique espera; pré-carregue em hover ou foco",
          ],
          [
            "Componentes e bibliotecas pesadas (editor, gráfico, mapa)",
            "`lazy`, ou `import()` dentro de um handler",
            "Reserve o espaço (altura) para o layout não saltar",
          ],
          [
            "Imagens e iframes abaixo da dobra",
            '`loading="lazy"` nativo',
            "Informe `width` e `height`; não use na imagem principal da primeira tela",
          ],
          ["Funções utilitárias grandes", '`await import("./x")` no momento do uso', "Trate a falha de rede"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O fallback faz parte da experiência",
        texto:
          "Um fallback que aparece por um instante e some causa piscada; um esqueleto do tamanho certo evita saltos de layout. Use `Suspense` mais granular quando só uma parte da tela depende do módulo, e um error boundary para a falha de download. Pense no que o usuário faz depois: se ele provavelmente vai abrir o recurso, **pré-carregue** (ao passar o mouse, ao focar ou quando o navegador estiver ocioso) para que a espera não seja sentida. Veja também L101, L103 e L105.",
      },
    ],
    armadilhas: [
      "Aplicar lazy ao que aparece na primeira tela (inclusive a imagem principal): atrasa justamente o que o usuário mais quer ver.",
      "Esquecer o `Suspense` com um fallback decente, ou o error boundary para a falha de download.",
      "Declarar o `lazy(...)` dentro de um componente: cria um componente novo a cada render, que remonta e perde o estado.",
      "Usar `lazy` com um export nomeado sem adaptar: ele espera que o módulo tenha o componente como `default`.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece, passo a passo, na primeira vez que um componente `lazy` é renderizado?",
        resposta:
          "O React tenta usar o componente, mas o código ainda não chegou: ele suspende essa parte da árvore, o `Suspense` mais próximo mostra o `fallback`, o navegador baixa o chunk e, quando a promise resolve, o componente é desenhado no lugar do fallback. As próximas renderizações usam o módulo já carregado.",
      },
      {
        pergunta: 'Por que não usar `loading="lazy"` na imagem principal da página?',
        resposta:
          "Porque ela já aparece na abertura: o navegador adiaria o download justamente do elemento que o usuário vê primeiro, o que piora o tempo até o maior conteúdo aparecer (LCP).",
      },
    ],
  },
  en: {
    titulo: "What lazy loading is",
    pergunta: "What is lazy loading?",
    porqueEsteMetodo:
      "Lazy loading is an everyday idea (fetch only when asked) with a specific implementation in React. Starting from the simple picture and going down to the mechanism of `lazy` and `Suspense` shows why there is a waiting state.",
    resposta30s:
      '**Lazy loading** means postponing the loading of a resource until it is needed, like fetching an item from the stockroom only when a customer asks. In React, `React.lazy(() => import("./X"))` downloads a component’s code the first time it is about to render, and `<Suspense fallback>` shows a stand-in meanwhile; the typical use is **routes**, modals and heavy components outside the first screen. For images and iframes there is native `loading="lazy"`; the gain is a lighter first screen, and the price is a wait at the moment of use.',
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a department store. Instead of putting all the stock on the shelves on opening day (which would delay opening), the store displays the essentials and fetches the rest from the stockroom **only when a customer asks**. The store opens fast; whoever asks for something from the stockroom waits a moment.",
        tecnico:
          '**Lazy loading** postpones loading a resource until it is needed: components, routes, modules, images, iframes. In React, `lazy(() => import("./Chart"))` creates a component whose code is only downloaded the first time it tries to render; until the module arrives, the component **suspends** and the nearest `<Suspense>` shows the `fallback`. After the first load the module is available and later renders are immediate. For media, the `loading="lazy"` attribute on `<img>` and `<iframe>` asks the browser to defer the download until the element gets near the visible area.',
        limite:
          "In the store, whoever asks waits. Here too: lazy loading trades initial time for a **wait at the moment of use**, and can cause layout jumps (an image with no set size) or download waterfalls. Also, what shows right at opening, such as the main image on the first screen, should **not** be lazy: that would delay exactly what the user sees first.",
      },
      {
        tipo: "fluxo",
        titulo: "What happens with a `lazy` component",
        etapas: [
          "At build time, the bundler sees the dynamic `import()` and generates a separate file (a chunk) for that module",
          "The `lazy` component renders for the first time (the user opens the route, the modal or the tab), and React tries to use it, but the code has not arrived yet",
          "React suspends that part of the tree and the nearest `<Suspense>` shows the `fallback` while the browser downloads and runs the chunk",
          "The promise resolves with the module; React uses the `default` export as the component and draws it in place of the fallback",
          "Later renders use the module that is already loaded. If the download fails, the error bubbles to the nearest error boundary (without one, the React tree unmounts)",
        ],
        nota: "For navigations made inside a transition (`startTransition` or `useTransition`), React keeps the current screen until the next one is ready, instead of swapping it for a fallback, which avoids flicker.",
      },
      {
        tipo: "codigo",
        titulo: "An editor loaded only when the user asks",
        legenda: "JSX",
        codigo: `import { lazy, Suspense, useState } from "react";

const TextEditor = lazy(() => import("./TextEditor")); // a separate chunk

export default function Post() {
  const [editing, setEditing] = useState(false);

  return (
    <article>
      <button onClick={() => setEditing(true)}>Edit</button>
      {editing && (
        <Suspense fallback={<p role="status">Loading editor…</p>}>
          <TextEditor />
        </Suspense>
      )}
    </article>
  );
}`,
        nota: 'The editor’s code is only downloaded on the first click on “Edit”. The `role="status"` makes screen readers announce the loading.',
      },
      {
        tipo: "tabela",
        titulo: "Where it makes sense",
        colunas: ["Target", "How", "Caution"],
        linhas: [
          [
            "Routes and pages",
            "`lazy` per page with `Suspense` above the routes (or the router’s support for `lazy` routes)",
            "A fallback at the layout level so the whole page does not flash; preload on link hover",
          ],
          [
            "Modals, tabs and panels outside the first screen",
            "`lazy` and render only when opened",
            "The first click waits; preload on hover or focus",
          ],
          [
            "Heavy components and libraries (editor, chart, map)",
            "`lazy`, or `import()` inside a handler",
            "Reserve the space (height) so the layout does not jump",
          ],
          [
            "Images and iframes below the fold",
            'Native `loading="lazy"`',
            "Provide `width` and `height`; do not use it on the main image of the first screen",
          ],
          ["Large utility functions", '`await import("./x")` at the moment of use', "Handle the network failure"],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The fallback is part of the experience",
        texto:
          "A fallback that appears for an instant and vanishes causes flicker; a skeleton of the right size avoids layout jumps. Use finer-grained `Suspense` when only part of the screen depends on the module, and an error boundary for download failure. Think about what the user does next: if they will probably open the feature, **preload** it (on hover, on focus or when the browser is idle) so the wait goes unnoticed. See also L101, L103 and L105.",
      },
    ],
    armadilhas: [
      "Applying lazy loading to what shows on the first screen (including the main image): it delays exactly what the user most wants to see.",
      "Forgetting `Suspense` with a decent fallback, or the error boundary for a download failure.",
      "Declaring `lazy(...)` inside a component: it creates a new component on every render, which remounts and loses state.",
      "Using `lazy` with a named export without adapting it: it expects the module to have the component as `default`.",
    ],
    autoteste: [
      {
        pergunta: "What happens, step by step, the first time a `lazy` component renders?",
        resposta:
          "React tries to use the component, but the code has not arrived: it suspends that part of the tree, the nearest `Suspense` shows the `fallback`, the browser downloads the chunk and, when the promise resolves, the component is drawn in place of the fallback. Later renders use the module already loaded.",
      },
      {
        pergunta: 'Why not use `loading="lazy"` on the page’s main image?',
        resposta:
          "Because it already shows at opening: the browser would postpone the download of exactly the element the user sees first, which worsens the time until the largest content appears (LCP).",
      },
    ],
  },
};
