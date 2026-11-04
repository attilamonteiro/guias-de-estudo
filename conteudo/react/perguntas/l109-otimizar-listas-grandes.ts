import type { Pergunta } from "../../tipos";

// L109 · Otimizar listas grandes
export const l109: Pergunta = {
  numero: 109,
  modulo: "linkedin-desempenho",
  metodo: "firstprinciples",
  pt: {
    titulo: "Otimizar listas grandes",
    pergunta: "Como você otimiza listas grandes?",
    porqueEsteMetodo:
      "A virtualização parece um truque de biblioteca até você ver de onde ela sai: o navegador paga por cada nó do DOM, então a solução é manter poucos nós. Partir da lista completa e consertar uma limitação por vez mostra por que cada peça existe.",
    resposta30s:
      "O custo está no **número de nós do DOM**, não nos dados: renderizar 100.000 linhas de uma vez consome memória e trava o desenho. Primeiro reduza o que chega (**paginação, filtro ou busca no servidor**); se a lista precisa mesmo ser rolável por inteiro, use **virtualização (janelamento)**: renderize só as linhas visíveis mais uma margem, dentro de um contêiner com a altura total. Bibliotecas como **react-window** e **TanStack Virtual** fazem isso, e você completa com chaves estáveis e linhas memoizadas.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma limitação por vez",
        passos: [
          {
            titulo: "0. A restrição",
            texto:
              "O navegador paga por **cada nó do DOM**: memória, estilos, layout e pintura, e o React ainda percorre cada elemento ao renderizar. Dados em memória são baratos; elementos na tela são caros. O objetivo é manter poucos nós, qualquer que seja o tamanho da lista.",
          },
          {
            titulo: "1. A versão mais simples: renderizar tudo",
            texto:
              "`itens.map(...)` com 100.000 linhas. → Quebra: o primeiro desenho demora, a memória sobe, a rolagem e cada nova renderização ficam pesadas, e qualquer mudança de estado reconcilia tudo.",
          },
          {
            titulo: "2. Mostrar menos: paginar, filtrar, buscar no servidor",
            texto:
              "Pagine (ou carregue por cursor), ofereça filtros e busca e ordene no servidor: ninguém lê 100.000 linhas de uma vez. → Resolve a maior parte dos casos. → Ainda quebra quando o usuário precisa rolar uma lista contínua e longa (um log, uma planilha, um feed) ou quando o “carregar mais” vai acumulando nós.",
          },
          {
            titulo: "3. Desenhar só o que se vê (janelamento)",
            texto:
              "Crie um contêiner de rolagem com altura fixa e, dentro dele, um bloco com a **altura total** (`quantidade × altura da linha`), para a barra de rolagem agir como se a lista inteira existisse. Pelo `scrollTop`, calcule o primeiro índice visível (`scrollTop / altura`) e renderize só o intervalo visível mais uma **margem** (overscan) de poucas linhas acima e abaixo, cada uma posicionada em `índice × altura`. → Resolve: o número de nós fica constante. → Quebra quando as linhas têm alturas diferentes.",
          },
          {
            titulo: "4. Alturas variáveis",
            texto:
              "A posição de uma linha passa a depender da altura das anteriores: é preciso estimar, medir depois de renderizar (por exemplo, com `ResizeObserver`), guardar as medidas e corrigir o deslocamento. Fazer isso à mão é fonte de bugs, então use **react-window**, **TanStack Virtual** ou **react-virtuoso**, que cuidam de alturas variáveis, rolagem horizontal e saltos para um índice.",
          },
          {
            titulo: "5. Manter barato o que sobrou",
            texto:
              "Use `key` estável (o id do dado, não o índice), memoize a linha com `React.memo` e estabilize os callbacks que passa a ela, para uma mudança em uma linha não renderizar todas as visíveis; calcule filtro e ordenação com `useMemo`, fora do corpo da linha; e evite estado compartilhado que muda a cada rolagem.",
          },
          {
            titulo: "6. Pagar o custo conscientemente",
            texto:
              "O que está fora do DOM não existe para o navegador: a busca da página (Ctrl+F) não o encontra, leitores de tela não o leem, a navegação por Tab pode falhar e a impressão sai incompleta. Compense com `aria-rowcount` e `aria-rowindex` (ou `aria-setsize` e `aria-posinset`), busca própria e foco gerenciado; e, com poucas centenas de itens, simplesmente não virtualize.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Janelamento à mão, com altura fixa",
        legenda: "TSX",
        codigo: `import { useState } from "react";

const ALTURA = 32; // px de cada linha (altura fixa)
const VISIVEIS = 20; // linhas que cabem na janela
const MARGEM = 5; // linhas extras acima e abaixo
export function ListaGrande({ itens }: { itens: { id: string; nome: string }[] }) {
  const [topo, setTopo] = useState(0); // scrollTop do contêiner
  const inicio = Math.max(0, Math.floor(topo / ALTURA) - MARGEM);
  const fim = Math.min(itens.length, inicio + VISIVEIS + 2 * MARGEM);
  return (
    <div style={{ height: ALTURA * VISIVEIS, overflow: "auto" }} onScroll={(e) => setTopo(e.currentTarget.scrollTop)}>
      <div style={{ height: itens.length * ALTURA, position: "relative" }}>
        {itens.slice(inicio, fim).map((item, i) => (
          <div key={item.id} style={{ position: "absolute", top: (inicio + i) * ALTURA, height: ALTURA }}>
            {item.nome}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        nota: "Mostra a ideia. As bibliotecas acrescentam alturas variáveis, rolagem horizontal, salto para um índice e cuidados de acessibilidade; numa lista real, prefira uma delas.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Poucas centenas de itens: renderize tudo. Milhares ou mais: primeiro **reduza no servidor** (paginação, filtros, busca). Se ainda for preciso rolar muito, **virtualize**. A pergunta certa para 100.000 linhas é “quantas o usuário consegue ver ao mesmo tempo?”: algumas dezenas. Renderize essas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A virtualização tem custo",
        texto:
          "É mais código e mais casos de borda: alturas variáveis, saltos de rolagem ao medir, foco e leitores de tela, busca nativa do navegador, impressão. Não a use por reflexo e meça antes (veja L114) para confirmar que o gargalo é mesmo o número de nós, e não uma linha cara demais ou renderizações em excesso.",
      },
    ],
    armadilhas: [
      "Renderizar 100.000 linhas “porque o React é rápido”: o gargalo é o DOM, não só a reconciliação.",
      "Usar o índice como `key` numa lista que filtra, ordena ou muda: o estado e o foco ficam nas linhas erradas (veja L34).",
      "Virtualizar sem pensar em acessibilidade: sem atributos ARIA de posição e sem foco gerenciado, leitores de tela e teclado perdem o contexto.",
      "Calcular a altura à mão com linhas variáveis, ou não memoizar a linha: os saltos de rolagem e o custo de rerenderizar as linhas visíveis a cada rolagem anulam o ganho.",
    ],
    autoteste: [
      {
        pergunta: "O que é virtualização (janelamento) e que problema ela resolve?",
        resposta:
          "É renderizar só as linhas visíveis (mais uma margem) de uma lista longa, dentro de um contêiner com a altura total para a rolagem funcionar. Resolve o custo de manter milhares de nós no DOM: memória, layout e renderização.",
      },
      {
        pergunta: "Você renderizaria 100.000 linhas de uma vez? O que faria no lugar?",
        resposta:
          "Não. Primeiro reduziria no servidor (paginação, filtros, busca); se a tabela precisasse ser rolável por inteiro, usaria virtualização com uma biblioteca, chaves estáveis e linhas memoizadas, e trataria acessibilidade e busca.",
      },
    ],
  },
  en: {
    titulo: "Optimizing large lists",
    pergunta: "How do you optimize large lists?",
    porqueEsteMetodo:
      "Virtualization looks like a library trick until you see where it comes from: the browser pays for every DOM node, so the solution is to keep few nodes. Starting from the full list and fixing one limitation at a time shows why each piece exists.",
    resposta30s:
      "The cost is in the **number of DOM nodes**, not in the data: rendering 100,000 rows at once eats memory and stalls painting. First reduce what arrives (**server-side pagination, filtering or search**); if the list really must be scrollable in full, use **virtualization (windowing)**: render only the visible rows plus a margin, inside a container with the full height. Libraries such as **react-window** and **TanStack Virtual** do this, and you complete it with stable keys and memoized rows.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one limitation at a time",
        passos: [
          {
            titulo: "0. The constraint",
            texto:
              "The browser pays for **every DOM node**: memory, styles, layout and paint, and React also walks every element when it renders. Data in memory is cheap; elements on screen are expensive. The goal is to keep few nodes, whatever the size of the list.",
          },
          {
            titulo: "1. The simplest version: render everything",
            texto:
              "`items.map(...)` with 100,000 rows. → Breaks: the first paint is slow, memory climbs, scrolling and every new render get heavy, and any state change reconciles everything.",
          },
          {
            titulo: "2. Show less: paginate, filter, search on the server",
            texto:
              "Paginate (or load by cursor), offer filters and search, and sort on the server: nobody reads 100,000 rows at once. → Fixes most cases. → Still breaks when the user needs to scroll a long, continuous list (a log, a spreadsheet, a feed) or when “load more” keeps piling up nodes.",
          },
          {
            titulo: "3. Draw only what is seen (windowing)",
            texto:
              "Create a scroll container with a fixed height and, inside it, a block with the **total height** (`count × row height`), so the scrollbar behaves as if the whole list existed. From `scrollTop`, compute the first visible index (`scrollTop / height`) and render only the visible range plus an **overscan** margin of a few rows above and below, each one positioned at `index × height`. → Fixes: the node count stays constant. → Breaks when rows have different heights.",
          },
          {
            titulo: "4. Variable heights",
            texto:
              "A row’s position now depends on the heights of the ones before it: you must estimate, measure after rendering (for example with `ResizeObserver`), store the measurements and correct the offset. Doing this by hand is a bug factory, so use **react-window**, **TanStack Virtual** or **react-virtuoso**, which handle variable heights, horizontal scrolling and jumps to an index.",
          },
          {
            titulo: "5. Keep what is left cheap",
            texto:
              "Use a stable `key` (the data’s id, not the index), memoize the row with `React.memo` and stabilize the callbacks you pass to it, so a change in one row does not re-render all the visible ones; compute filtering and sorting with `useMemo`, outside the row body; and avoid shared state that changes on every scroll.",
          },
          {
            titulo: "6. Pay the cost knowingly",
            texto:
              "What is outside the DOM does not exist for the browser: page search (Ctrl+F) cannot find it, screen readers do not read it, Tab navigation can fail and printing comes out incomplete. Compensate with `aria-rowcount` and `aria-rowindex` (or `aria-setsize` and `aria-posinset`), your own search and managed focus; and with only a few hundred items, simply do not virtualize.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Hand-rolled windowing with fixed height",
        legenda: "TSX",
        codigo: `import { useState } from "react";

const ROW = 32; // px per row (fixed height)
const VISIBLE = 20; // rows that fit in the window
const OVERSCAN = 5; // extra rows above and below
export function BigList({ items }: { items: { id: string; name: string }[] }) {
  const [top, setTop] = useState(0); // the container’s scrollTop
  const start = Math.max(0, Math.floor(top / ROW) - OVERSCAN);
  const end = Math.min(items.length, start + VISIBLE + 2 * OVERSCAN);
  return (
    <div style={{ height: ROW * VISIBLE, overflow: "auto" }} onScroll={(e) => setTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * ROW, position: "relative" }}>
        {items.slice(start, end).map((item, i) => (
          <div key={item.id} style={{ position: "absolute", top: (start + i) * ROW, height: ROW }}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
        nota: "This shows the idea. Libraries add variable heights, horizontal scrolling, jumping to an index and accessibility care; for a real list, prefer one of them.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "A few hundred items: render everything. Thousands or more: first **reduce on the server** (pagination, filters, search). If users still need to scroll a lot, **virtualize**. The right question for 100,000 rows is “how many can the user see at once?”: a few dozen. Render those.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Virtualization has a cost",
        texto:
          "It means more code and more edge cases: variable heights, scroll jumps when measuring, focus and screen readers, the browser’s native search, printing. Do not reach for it by reflex, and measure first (see L114) to confirm the bottleneck really is the node count, and not a row that is too expensive or too many re-renders.",
      },
    ],
    armadilhas: [
      "Rendering 100,000 rows “because React is fast”: the bottleneck is the DOM, not just reconciliation.",
      "Using the index as `key` in a list that filters, sorts or changes: state and focus end up on the wrong rows (see L34).",
      "Virtualizing without thinking about accessibility: without ARIA position attributes and managed focus, screen readers and keyboard users lose context.",
      "Computing heights by hand with variable rows, or not memoizing the row: scroll jumps and the cost of re-rendering visible rows on every scroll cancel the gain.",
    ],
    autoteste: [
      {
        pergunta: "What is virtualization (windowing) and what problem does it solve?",
        resposta:
          "It renders only the visible rows (plus a margin) of a long list, inside a container with the full height so scrolling works. It solves the cost of keeping thousands of nodes in the DOM: memory, layout and rendering.",
      },
      {
        pergunta: "Would you render 100,000 rows at once? What would you do instead?",
        resposta:
          "No. First I would reduce on the server (pagination, filters, search); if the table had to be scrollable in full, I would use virtualization with a library, stable keys and memoized rows, and handle accessibility and search.",
      },
    ],
  },
};
