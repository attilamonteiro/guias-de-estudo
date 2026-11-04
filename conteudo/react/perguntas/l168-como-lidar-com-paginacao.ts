import type { Pergunta } from "../../tipos";

// L168 · Como lidar com paginação
export const l168: Pergunta = {
  numero: 168,
  modulo: "linkedin-formularios-e-dados",
  metodo: "compare",
  pt: {
    titulo: "Como lidar com paginação",
    pergunta: "Como você lida com paginação?",
    porqueEsteMetodo:
      "Não existe uma paginação “certa”: página numerada, cursor e carga incremental resolvem problemas diferentes. Uma matriz com a regra de decisão mostra o critério, que é o que a entrevista quer ouvir.",
    resposta30s:
      "É preciso **fatiar no servidor** e escolher a abordagem pelo caso: **página (deslocamento)** para listas de consulta em que se salta de posição e se mostra o total, **cursor** para listas grandes ou que mudam o tempo todo, e **carga incremental** (“carregar mais”) para leitura contínua. Guarde a página **na URL**, mantenha a lista anterior enquanto a próxima carrega e use uma biblioteca de dados como o **TanStack Query** para cache e `useInfiniteQuery`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As abordagens lado a lado",
        colunas: ["Abordagem", "Como funciona", "Serve quando", "Limites"],
        linhas: [
          [
            "Por página / deslocamento (`page`, `offset`)",
            "O cliente pede a página N (ou “pule X, traga Y”); a interface mostra números de página e o total",
            "Tabelas e listas de tamanho moderado, em que a pessoa precisa saltar para a página 7 ou ver o total",
            "Se itens entram ou saem entre dois pedidos, a lista repete ou pula itens; em muitos bancos, deslocamentos grandes ficam lentos",
          ],
          [
            "Por cursor (`depois=<cursor>`)",
            "O servidor devolve um marcador do último item e o próximo pedido começa depois dele",
            "Feeds e listas grandes, ou que mudam o tempo todo, lidas em sequência",
            "Não salta para a página N e nem sempre dá o total; a ordenação precisa ser estável, com desempate único",
          ],
          [
            "Carga incremental (“carregar mais”, rolagem infinita)",
            "Cada página nova é acrescentada à lista que já está na tela, por deslocamento ou por cursor",
            "Navegação contínua, sobretudo no celular; para a rolagem infinita, veja L169",
            "O DOM só cresce, voltar a uma posição é difícil e o rodapé pode ficar fora de alcance",
          ],
          [
            "Tudo no cliente",
            "Uma única busca traz tudo e o navegador fatia, filtra e ordena",
            "Listas pequenas (algumas centenas de itens) com filtros instantâneos",
            "O tamanho da resposta e do DOM cresce com os dados; não serve para listas grandes",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Página na URL e lista anterior mantida",
        legenda: "TSX",
        codigo: [
          'import { useSearchParams } from "react-router-dom";',
          'import { keepPreviousData, useQuery } from "@tanstack/react-query";',
          "",
          "export function ListaDePedidos() {",
          "  const [params, setParams] = useSearchParams();",
          '  const pagina = Number(params.get("pagina")) || 1; // a URL é a fonte da verdade',
          "",
          "  const { data, isPlaceholderData } = useQuery({",
          '    queryKey: ["pedidos", pagina], // cada página tem a sua entrada no cache',
          "    queryFn: () => buscarPedidos(pagina), // { itens, temMais }",
          "    placeholderData: keepPreviousData, // mantém a lista anterior enquanto a próxima carrega",
          "  });",
          "  const ir = (n: number) => setParams({ pagina: String(n) });",
          "",
          "  return (",
          "    <>",
          "      <ul aria-busy={isPlaceholderData}>{data?.itens.map((p) => <li key={p.id}>{p.nome}</li>)}</ul>",
          "      <button onClick={() => ir(pagina - 1)} disabled={pagina === 1}>Anterior</button>",
          "      <button onClick={() => ir(pagina + 1)} disabled={isPlaceholderData || !data?.temMais}>Próxima</button>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Voltar e avançar do navegador funcionam, o link é compartilhável e a página recarregada continua a mesma. O nome da opção que mantém os dados anteriores mudou entre versões do TanStack Query: confira a documentação. Para cursor e carga incremental, existe o `useInfiniteQuery`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte duas coisas: **quão grande é a lista** e **a pessoa precisa saltar ou voltar a uma posição?** Lista pequena: tudo no cliente. Lista média de consulta e comparação (tabelas, administração): página numerada, com a página na URL. Lista grande, que muda ou é lida em sequência (feeds, histórico): cursor, com carga incremental se a leitura for contínua. Em todos os casos o servidor é quem fatia: o cliente não baixa tudo para mostrar vinte linhas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A lista muda entre um pedido e outro",
        texto:
          "Se um item entra enquanto a pessoa lê, a página 2 por deslocamento repete o último item da página 1; se um sai, um item é pulado. O cursor evita isso, porque se apoia no último item visto e não na posição. Decida também o que acontece quando a página pedida não existe mais (parâmetro inválido ou lista que encolheu), e volte à página 1 ao mudar filtro ou ordenação. Prefetch da próxima página e cache por página (o TanStack Query oferece os dois) deixam a troca quase instantânea.",
      },
    ],
    armadilhas: [
      "Paginar no cliente uma lista enorme: baixar tudo para mostrar poucas linhas desperdiça rede e memória; o servidor deve fatiar.",
      "Guardar a página só em estado local: recarregar, compartilhar o link ou apertar “voltar” perde a posição; ponha a página e os filtros na URL.",
      "Esquecer de voltar à página 1 ao mudar o filtro ou a busca: a pessoa fica na página 5 de uma lista que agora tem duas.",
      "Piscar um esqueleto ou uma lista vazia a cada troca de página: mantenha os dados anteriores até os novos chegarem e sinalize o carregamento.",
    ],
    autoteste: [
      {
        pergunta: "Por que a paginação por cursor evita itens repetidos ou pulados?",
        resposta:
          "Porque o próximo pedido diz “traga o que vem depois deste item”, e não “pule 20”. Inserções e remoções antes do marcador não deslocam a janela, ao contrário do deslocamento por posição.",
      },
      {
        pergunta: "Quando você escolheria página numerada em vez de carga incremental?",
        resposta:
          "Quando a pessoa precisa comparar, saltar para uma posição, ver o total ou voltar a um ponto exato (tabelas administrativas, resultados em que a posição importa) e a lista não muda tão depressa a ponto de a posição perder o sentido.",
      },
    ],
  },
  en: {
    titulo: "Handling pagination",
    pergunta: "How do you handle pagination?",
    porqueEsteMetodo:
      "There is no single “right” pagination: numbered pages, cursors and incremental loading solve different problems. A matrix with a decision rule shows the criterion, which is what an interview wants to hear.",
    resposta30s:
      "You need to **slice on the server** and pick the approach by use case: **pages (offset)** for lookup lists where people jump around and see a total, **cursors** for large lists or ones that change all the time, and **incremental loading** (“load more”) for continuous reading. Keep the page **in the URL**, keep the previous list while the next one loads and use a data library such as **TanStack Query** for caching and `useInfiniteQuery`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The approaches side by side",
        colunas: ["Approach", "How it works", "Fits when", "Limits"],
        linhas: [
          [
            "Page / offset (`page`, `offset`)",
            "The client asks for page N (or “skip X, bring Y”); the interface shows page numbers and the total",
            "Tables and lists of moderate size, where people need to jump to page 7 or see the total",
            "If items enter or leave between two requests, the list repeats or skips items; in many databases, large offsets get slow",
          ],
          [
            "Cursor (`after=<cursor>`)",
            "The server returns a marker for the last item and the next request starts after it",
            "Feeds and large lists, or ones that change constantly, read in sequence",
            "Cannot jump to page N and does not always give the total; the ordering must be stable, with a unique tie-breaker",
          ],
          [
            "Incremental loading (“load more”, infinite scroll)",
            "Each new page is appended to the list already on screen, by offset or by cursor",
            "Continuous browsing, especially on phones; for infinite scroll, see L169",
            "The DOM only grows, returning to a position is hard and the footer can be out of reach",
          ],
          [
            "Everything on the client",
            "A single request brings everything and the browser slices, filters and sorts",
            "Small lists (a few hundred items) with instant filters",
            "Response and DOM size grow with the data; not suitable for large lists",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Page in the URL and previous list kept",
        legenda: "TSX",
        codigo: [
          'import { useSearchParams } from "react-router-dom";',
          'import { keepPreviousData, useQuery } from "@tanstack/react-query";',
          "",
          "export function OrderList() {",
          "  const [params, setParams] = useSearchParams();",
          '  const page = Number(params.get("page")) || 1; // the URL is the source of truth',
          "",
          "  const { data, isPlaceholderData } = useQuery({",
          '    queryKey: ["orders", page], // each page has its own cache entry',
          "    queryFn: () => fetchOrders(page), // { items, hasMore }",
          "    placeholderData: keepPreviousData, // keeps the previous list while the next one loads",
          "  });",
          "  const go = (n: number) => setParams({ page: String(n) });",
          "",
          "  return (",
          "    <>",
          "      <ul aria-busy={isPlaceholderData}>{data?.items.map((o) => <li key={o.id}>{o.name}</li>)}</ul>",
          "      <button onClick={() => go(page - 1)} disabled={page === 1}>Previous</button>",
          "      <button onClick={() => go(page + 1)} disabled={isPlaceholderData || !data?.hasMore}>Next</button>",
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "The browser’s back and forward buttons work, the link is shareable and a reloaded page stays the same. The name of the option that keeps the previous data changed between TanStack Query versions: check the documentation. For cursors and incremental loading there is `useInfiniteQuery`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask two things: **how big is the list** and **do people need to jump or return to a position?** Small list: everything on the client. Medium list for lookup and comparison (tables, administration): numbered pages, with the page in the URL. Large list that changes or is read in sequence (feeds, history): cursor, with incremental loading if the reading is continuous. In every case the server does the slicing: the client does not download everything to show twenty rows.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The list changes between one request and the next",
        texto:
          "If an item is inserted while someone reads, page 2 by offset repeats the last item of page 1; if one is removed, an item is skipped. A cursor avoids this because it relies on the last item seen rather than on a position. Also decide what happens when the requested page no longer exists (an invalid parameter or a list that shrank), and go back to page 1 when the filter or sort changes. Prefetching the next page and caching per page (TanStack Query offers both) make the switch nearly instant.",
      },
    ],
    armadilhas: [
      "Paginating a huge list on the client: downloading everything to show a few rows wastes network and memory; the server should slice.",
      "Keeping the page only in local state: reloading, sharing the link or pressing “back” loses the position; put the page and filters in the URL.",
      "Forgetting to return to page 1 when the filter or search changes: the person is left on page 5 of a list that now has two.",
      "Flashing a skeleton or an empty list on every page change: keep the previous data until the new data arrives and signal the loading.",
    ],
    autoteste: [
      {
        pergunta: "Why does cursor pagination avoid repeated or skipped items?",
        resposta:
          "Because the next request says “bring what comes after this item”, not “skip 20”. Insertions and removals before the marker do not shift the window, unlike offset by position.",
      },
      {
        pergunta: "When would you choose numbered pages over incremental loading?",
        resposta:
          "When people need to compare, jump to a position, see the total or return to an exact point (admin tables, results where position matters) and the list does not change so fast that the position loses meaning.",
      },
    ],
  },
};
