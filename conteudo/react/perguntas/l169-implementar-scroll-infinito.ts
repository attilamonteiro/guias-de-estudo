import type { Pergunta } from "../../tipos";

// L169 · Implementar scroll infinito
export const l169: Pergunta = {
  numero: 169,
  modulo: "linkedin-formularios-e-dados",
  metodo: "design",
  pt: {
    titulo: "Implementar scroll infinito",
    pergunta: "Como você implementa rolagem infinita?",
    porqueEsteMetodo:
      "É uma pergunta de projeto: o código curto esconde decisões sobre detecção do fim, estado, erros, acessibilidade e custo de DOM. Um roteiro fixo (requisitos, números, decisão central, contrato, estado e casos de borda) evita esquecer o que importa.",
    resposta30s:
      "Coloque um **elemento sentinela** no fim da lista e observe-o com um **`IntersectionObserver`**; quando ele entra na tela, busque a **próxima página (de preferência por cursor)** e **acrescente** os itens aos atuais. Bloqueie buscas enquanto uma está em andamento, trate **carregando, erro e fim dos dados**, ofereça um **botão “Carregar mais”** como alternativa e **virtualize** a lista quando houver milhares de itens. O `useInfiniteQuery` do TanStack Query entrega boa parte disso pronto.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: carregar a próxima página ao chegar perto do fim, acrescentar sem perder o que já está na tela, mostrar carregando, erro e fim, e voltar à lista no mesmo ponto. Não funcionais: não disparar buscas duplicadas, continuar fluido com milhares de itens e ser utilizável por teclado e leitor de tela.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Itens por página e elementos de DOM por item. Exemplo hipotético: 5.000 itens carregados com 20 elementos cada são cerca de 100.000 nós no DOM, e a rolagem engasga. A conta mostra quando “acrescentar” deixa de bastar e a lista pede virtualização (veja L110 e L111).",
          },
          {
            titulo: "3. Decisão central: como detectar o fim",
            texto:
              "Um sentinela no fim da lista, observado por um `IntersectionObserver` com `rootMargin` para começar a buscar um pouco antes. Ouvir `scroll` e medir a posição a cada evento faz mais trabalho e exige `throttle` (veja a tabela).",
          },
          {
            titulo: "4. Contrato da API",
            texto:
              "`GET /itens?cursor=…&limite=20` devolve `{ itens, proximoCursor }`, e `proximoCursor: null` é o fim. Cursor em vez de deslocamento evita repetir ou pular itens quando a lista muda (veja L168).",
          },
          {
            titulo: "5. Estado",
            texto:
              "Lista acumulada (páginas concatenadas), cursor da próxima página e três situações: carregando a próxima, erro e fim. Contra duplicatas, só observe o sentinela quando houver próxima página, nada em andamento e nenhum erro pendente; deduplique por `id` se a API puder repetir. O TanStack Query guarda isso em `useInfiniteQuery`.",
          },
          {
            titulo: "6. Casos de borda e operação",
            texto:
              'Erro no meio: mostre “Tentar de novo” e pare de observar, senão o sentinela dispara em laço. Fim: avise que a lista acabou. Voltar à lista: mantenha as páginas em cache e restaure a rolagem. Acessibilidade: botão “Carregar mais”, região `role="status"` para anunciar o carregamento e rodapé alcançável. Meça o uso de memória e a fluidez com milhares de itens.',
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O sentinela como hook reutilizável",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useRef } from "react";',
          "",
          "// Chama aoChegar quando o sentinela (no fim da lista) entra na área visível.",
          "export function useSentinela(aoChegar: () => void, ativo: boolean) {",
          "  const ref = useRef<HTMLDivElement>(null);",
          "  useEffect(() => {",
          "    const alvo = ref.current;",
          "    if (!alvo || !ativo) return;",
          "    const observador = new IntersectionObserver(",
          "      ([entrada]) => {",
          "        if (entrada.isIntersecting) aoChegar();",
          "      },",
          '      { rootMargin: "300px" }, // começa a buscar antes de chegar ao fim',
          "    );",
          "    observador.observe(alvo);",
          "    return () => observador.disconnect();",
          "  }, [aoChegar, ativo]);",
          "  return ref;",
          "}",
        ].join("\n"),
        nota: "O `IntersectionObserver` avisa uma vez ao começar a observar; por isso, se a página carregada ainda não encheu a tela, o sentinela continua visível e a busca seguinte acontece sozinha. O `ativo` falso durante a busca, no erro e no fim impede pedidos repetidos.",
      },
      {
        tipo: "codigo",
        titulo: "Usando o hook com uma consulta infinita",
        legenda: "TSX",
        codigo: [
          'import { useInfiniteQuery } from "@tanstack/react-query";',
          "",
          "export function Feed() {",
          "  const consulta = useInfiniteQuery({",
          '    queryKey: ["feed"],',
          "    queryFn: ({ pageParam }) => buscarFeed(pageParam), // { itens, proximoCursor }",
          "    initialPageParam: null as string | null,",
          "    getNextPageParam: (ultima) => ultima.proximoCursor ?? undefined, // undefined = acabou",
          "  });",
          "  const { hasNextPage, isFetchingNextPage, isError, fetchNextPage } = consulta;",
          "  const sentinela = useSentinela(fetchNextPage, !!hasNextPage && !isFetchingNextPage && !isError);",
          "",
          "  return (",
          "    <>",
          "      <ul>{consulta.data?.pages.flatMap((p) => p.itens).map((i) => <li key={i.id}>{i.titulo}</li>)}</ul>",
          "      {isError && <button onClick={() => fetchNextPage()}>Tentar de novo</button>}",
          "      {hasNextPage && !isError && <button onClick={() => fetchNextPage()}>Carregar mais</button>}",
          "      <div ref={sentinela} />",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "A API do `useInfiniteQuery` (por exemplo, `initialPageParam`) muda entre versões do TanStack Query: confira a documentação. O botão “Carregar mais” é a alternativa por teclado. A lista renderiza tudo o que foi carregado; passando de algumas centenas de itens, combine com virtualização.",
      },
      {
        tipo: "tabela",
        titulo: "Detectar o fim e desenhar a lista",
        colunas: ["Opção", "Como funciona", "Vantagem", "Limite"],
        linhas: [
          [
            "Ouvir `scroll`",
            "Um ouvinte mede a posição de rolagem a cada evento",
            "Simples de entender e funciona em qualquer contêiner",
            "Trabalho a cada evento; pede `throttle` e pode forçar cálculos de layout",
          ],
          [
            "`IntersectionObserver` com sentinela",
            "O navegador avisa quando um elemento marcador entra na área visível",
            "Barato, sem medir à mão; `rootMargin` antecipa a busca",
            "Precisa de limpeza (`disconnect`) e de cuidado para não disparar repetidamente",
          ],
          [
            "Botão “Carregar mais”",
            "A pessoa decide quando buscar a próxima página",
            "Acessível e previsível; o rodapé continua alcançável",
            "Um clique a mais; menos fluido",
          ],
          [
            "Virtualização (janelamento)",
            "Só as linhas visíveis, mais uma margem, existem no DOM",
            "Memória e DOM estáveis com milhares de itens",
            "Mais complexa: altura variável, busca da página (Ctrl+F) e acessibilidade pedem cuidado",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Quando não usar, e o que não esquecer",
        texto:
          "Rolagem infinita serve à **exploração** (feeds, galerias), em que a posição exata não importa. Para **tarefas** (achar, comparar, voltar a um item, chegar ao rodapé), prefira páginas ou “Carregar mais”. A rolagem automática não pode ser a única forma de carregar: teclado e leitor de tela precisam de um botão. Ao voltar de um item aberto, a pessoa espera estar no mesmo ponto, então guarde as páginas e restaure a rolagem (o roteador ou o framework costuma ajudar).",
      },
    ],
    armadilhas: [
      "Observar o sentinela sem travar durante a busca: a mesma página é pedida várias vezes e a lista repete itens.",
      "Não tratar o erro: o sentinela continua visível, dispara de novo e cria um laço de requisições que falham.",
      "Deixar o DOM crescer sem limite: milhares de itens deixam a rolagem lenta e a memória alta; virtualize.",
      "Não oferecer alternativa por teclado nem rodapé alcançável: quem navega por teclado ou leitor de tela fica preso na lista.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `IntersectionObserver` costuma ser melhor que ouvir `scroll`?",
        resposta:
          "Porque o navegador avisa apenas quando o sentinela cruza a área visível, em vez de você medir posições a cada evento de rolagem. Há menos trabalho na thread principal e menos código de `throttle`.",
      },
      {
        pergunta: "O que muda quando a lista chega a milhares de itens?",
        resposta:
          "É preciso virtualizar (renderizar só as linhas visíveis) ou voltar a páginas, porque acrescentar sem limite faz o DOM crescer e a rolagem e a memória pioram.",
      },
    ],
  },
  en: {
    titulo: "Implementing infinite scroll",
    pergunta: "How do you implement infinite scrolling?",
    porqueEsteMetodo:
      "This is a design question: the short code hides decisions about detecting the end, state, errors, accessibility and DOM cost. A fixed script (requirements, numbers, central decision, contract, state and edge cases) avoids forgetting what matters.",
    resposta30s:
      "Put a **sentinel element** at the end of the list and watch it with an **`IntersectionObserver`**; when it enters the screen, fetch the **next page (preferably by cursor)** and **append** the items to the current ones. Block fetches while one is in flight, handle **loading, error and end of data**, offer a **“Load more” button** as an alternative and **virtualize** the list when there are thousands of items. TanStack Query’s `useInfiniteQuery` provides much of this ready-made.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: load the next page when near the end, append without losing what is on screen, show loading, error and end, and return to the list at the same spot. Non-functional: no duplicate fetches, stay smooth with thousands of items and be usable by keyboard and screen reader.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Items per page and DOM elements per item. Hypothetical example: 5,000 loaded items with 20 elements each are about 100,000 DOM nodes, and scrolling stutters. The math shows when “append” stops being enough and the list calls for virtualization (see L110 and L111).",
          },
          {
            titulo: "3. Central decision: how to detect the end",
            texto:
              "A sentinel at the end of the list, watched by an `IntersectionObserver` with `rootMargin` so fetching starts a little early. Listening to `scroll` and measuring the position on every event does more work and needs `throttle` (see the table).",
          },
          {
            titulo: "4. API contract",
            texto:
              "`GET /items?cursor=…&limit=20` returns `{ items, nextCursor }`, and `nextCursor: null` is the end. A cursor instead of an offset avoids repeating or skipping items when the list changes (see L168).",
          },
          {
            titulo: "5. State",
            texto:
              "The accumulated list (pages concatenated), the next page’s cursor and three situations: loading the next one, error and end. Against duplicates, only watch the sentinel when there is a next page, nothing in flight and no pending error; deduplicate by `id` if the API can repeat items. TanStack Query keeps this in `useInfiniteQuery`.",
          },
          {
            titulo: "6. Edge cases and operations",
            texto:
              'Error midway: show “Try again” and stop observing, or the sentinel fires in a loop. End: say the list is over. Returning to the list: keep the pages cached and restore the scroll. Accessibility: a “Load more” button, a `role="status"` region to announce loading and a reachable footer. Measure memory use and smoothness with thousands of items.',
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The sentinel as a reusable hook",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useRef } from "react";',
          "",
          "// Calls onReach when the sentinel (at the end of the list) enters the viewport.",
          "export function useSentinel(onReach: () => void, active: boolean) {",
          "  const ref = useRef<HTMLDivElement>(null);",
          "  useEffect(() => {",
          "    const target = ref.current;",
          "    if (!target || !active) return;",
          "    const observer = new IntersectionObserver(",
          "      ([entry]) => {",
          "        if (entry.isIntersecting) onReach();",
          "      },",
          '      { rootMargin: "300px" }, // start fetching before reaching the end',
          "    );",
          "    observer.observe(target);",
          "    return () => observer.disconnect();",
          "  }, [onReach, active]);",
          "  return ref;",
          "}",
        ].join("\n"),
        nota: "The `IntersectionObserver` reports once when it starts observing; so if the loaded page has not filled the screen yet, the sentinel stays visible and the next fetch happens on its own. `active` being false during a fetch, on error and at the end prevents repeated requests.",
      },
      {
        tipo: "codigo",
        titulo: "Using the hook with an infinite query",
        legenda: "TSX",
        codigo: [
          'import { useInfiniteQuery } from "@tanstack/react-query";',
          "",
          "export function Feed() {",
          "  const query = useInfiniteQuery({",
          '    queryKey: ["feed"],',
          "    queryFn: ({ pageParam }) => fetchFeed(pageParam), // { items, nextCursor }",
          "    initialPageParam: null as string | null,",
          "    getNextPageParam: (last) => last.nextCursor ?? undefined, // undefined = finished",
          "  });",
          "  const { hasNextPage, isFetchingNextPage, isError, fetchNextPage } = query;",
          "  const sentinel = useSentinel(fetchNextPage, !!hasNextPage && !isFetchingNextPage && !isError);",
          "",
          "  return (",
          "    <>",
          "      <ul>{query.data?.pages.flatMap((p) => p.items).map((i) => <li key={i.id}>{i.title}</li>)}</ul>",
          "      {isError && <button onClick={() => fetchNextPage()}>Try again</button>}",
          "      {hasNextPage && !isError && <button onClick={() => fetchNextPage()}>Load more</button>}",
          "      <div ref={sentinel} />",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "The `useInfiniteQuery` API (for example, `initialPageParam`) changes between TanStack Query versions: check the documentation. The “Load more” button is the keyboard alternative. The list renders everything that was loaded; past a few hundred items, combine it with virtualization.",
      },
      {
        tipo: "tabela",
        titulo: "Detecting the end and drawing the list",
        colunas: ["Option", "How it works", "Advantage", "Limit"],
        linhas: [
          [
            "Listening to `scroll`",
            "A listener measures the scroll position on every event",
            "Simple to understand and works in any container",
            "Work on every event; needs `throttle` and may force layout calculations",
          ],
          [
            "`IntersectionObserver` with a sentinel",
            "The browser notifies when a marker element enters the visible area",
            "Cheap, no manual measuring; `rootMargin` anticipates the fetch",
            "Needs cleanup (`disconnect`) and care not to fire repeatedly",
          ],
          [
            "“Load more” button",
            "The person decides when to fetch the next page",
            "Accessible and predictable; the footer stays reachable",
            "One more click; less fluid",
          ],
          [
            "Virtualization (windowing)",
            "Only the visible rows, plus a margin, exist in the DOM",
            "Stable memory and DOM with thousands of items",
            "More complex: variable heights, in-page search (Ctrl+F) and accessibility need care",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "When not to use it, and what not to forget",
        texto:
          "Infinite scroll suits **exploration** (feeds, galleries), where the exact position does not matter. For **tasks** (finding, comparing, returning to an item, reaching the footer), prefer pages or “Load more”. Automatic scrolling cannot be the only way to load: keyboard and screen reader users need a button. When returning from an opened item, people expect to be at the same spot, so keep the pages and restore the scroll (the router or the framework usually helps).",
      },
    ],
    armadilhas: [
      "Watching the sentinel without locking during a fetch: the same page is requested several times and the list repeats items.",
      "Not handling the error: the sentinel stays visible, fires again and creates a loop of failing requests.",
      "Letting the DOM grow without limit: thousands of items make scrolling slow and memory high; virtualize.",
      "Offering no keyboard alternative or reachable footer: anyone navigating by keyboard or screen reader gets stuck in the list.",
    ],
    autoteste: [
      {
        pergunta: "Why is `IntersectionObserver` usually better than listening to `scroll`?",
        resposta:
          "Because the browser notifies only when the sentinel crosses the visible area, instead of you measuring positions on every scroll event. There is less work on the main thread and less `throttle` code.",
      },
      {
        pergunta: "What changes when the list reaches thousands of items?",
        resposta:
          "You need to virtualize (render only the visible rows) or go back to pages, because appending without limit makes the DOM grow and scrolling and memory get worse.",
      },
    ],
  },
};
