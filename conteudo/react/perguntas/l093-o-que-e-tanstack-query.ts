import type { Pergunta } from "../../tipos";

// L93 · O que é TanStack Query
export const l093: Pergunta = {
  numero: 93,
  modulo: "linkedin-estado",
  metodo: "trace",
  pt: {
    titulo: "O que é TanStack Query",
    pergunta: "O que é o React Query / TanStack Query?",
    porqueEsteMetodo:
      "A biblioteca parece mágica até você seguir uma consulta do começo ao fim: quem decide buscar, quando o dado é reaproveitado, quando é refeito e o que acontece se algo falha. Acompanhar esse ciclo explica as opções e os estados.",
    resposta30s:
      "O **TanStack Query** (antes chamado React Query) é uma biblioteca de **estado de servidor**: você chama `useQuery` com uma **chave** e uma função de busca, e ele busca, **guarda em cache** pela chave, **deduplica** pedidos iguais e entrega `data` com os estados de carregamento, erro e atualização. Os dados ficam **frescos** por um prazo (`staleTime`) e depois **obsoletos**: são mostrados na hora e **revalidados em segundo plano** (foco da janela, reconexão, nova montagem). Escritas usam `useMutation`, que normalmente **invalida** as consultas afetadas.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma consulta, do montar ao descartar",
        etapas: [
          'O componente monta e chama `useQuery({ queryKey: ["tarefas"], queryFn })`. A **chave** identifica a consulta no cache; chaves com parâmetros (`["tarefa", id]`) separam consultas diferentes',
          "O cache procura a chave. Sem entrada, cria uma, marca a consulta como pendente e dispara o `queryFn`. Se outro componente pediu a mesma chave ao mesmo tempo, a requisição é **deduplicada**: sai uma só",
          "A resposta chega e é gravada no cache; todos os componentes que usam essa chave renderizam com o mesmo `data`",
          "Durante o `staleTime`, o dado é **fresco** e não é revalidado. Passado esse prazo, fica **obsoleto**, o que não significa inválido: continua sendo mostrado",
          "Quando um componente monta de novo, a janela volta ao foco ou a rede reconecta, e o dado está obsoleto, a biblioteca mostra o cache na hora e **revalida em segundo plano** (`isFetching` sobe, sem tela de carregamento); se a resposta for diferente, a tela atualiza",
          "Quando nenhum componente usa a consulta, ela fica **inativa**; depois do `gcTime`, é descartada do cache. Voltar antes disso reaproveita o dado",
          "Numa escrita, `useMutation` envia a mudança; ao terminar, `invalidateQueries` marca as consultas afetadas como obsoletas e refaz a busca das que estão em uso",
        ],
        nota: "Esse comportamento de mostrar o dado guardado e atualizá-lo em segundo plano é o padrão chamado stale-while-revalidate.",
      },
      {
        tipo: "passos",
        titulo: "Quando algo muda ou dá errado",
        passos: [
          {
            titulo: "A busca falha",
            texto:
              "O `queryFn` lança (rede fora, ou o `!r.ok` do exemplo abaixo). A biblioteca tenta de novo algumas vezes, com espera crescente entre as tentativas; se todas falham, a consulta vai para o estado de erro e `error` traz o motivo. Dados que já estavam no cache continuam disponíveis. A tela decide: mensagem, botão “tentar de novo” (`refetch`) ou um error boundary.",
          },
          {
            titulo: "A chave muda",
            texto:
              'Se `id` faz parte de `queryKey: ["tarefa", id]` e muda, é **outra consulta**: outra entrada de cache, outra busca. Respostas de chaves antigas não sobrescrevem a atual, o que elimina a corrida de requisições do `useEffect` manual (veja L166). Se a nova chave já está no cache, os dados aparecem na hora.',
          },
          {
            titulo: "A escrita termina",
            texto:
              "Depois de uma mutação, invalide as chaves afetadas (a biblioteca refaz a busca das que estão em uso) ou grave a resposta direto no cache com `setQueryData`. Para a tela reagir antes do servidor, existe a atualização otimista, com reversão se a mutação falhar (veja L164).",
          },
          {
            titulo: "O dono dos dados muda",
            texto:
              "Se o usuário sai e outro entra, o cache anterior não pode vazar para a nova sessão: inclua o usuário na chave e limpe o cache no logout (`queryClient.clear()`).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Consulta com invalidação",
        legenda: "JSX",
        codigo: `const cliente = useQueryClient();

const tarefas = useQuery({
  queryKey: ["tarefas"], // identifica a consulta no cache
  queryFn: async () => {
    const r = await fetch("/api/tarefas");
    if (!r.ok) throw new Error("Falha ao buscar"); // sem isto, um erro 500 não vira erro
    return r.json();
  },
  staleTime: 30_000, // 30 s de dado fresco: nesse prazo não revalida
});

const criar = useMutation({
  mutationFn: postarTarefa,
  onSuccess: () => cliente.invalidateQueries({ queryKey: ["tarefas"] }), // refaz a busca
});

if (tarefas.isPending) return <p>Carregando…</p>;
if (tarefas.isError) return <p>Algo deu errado.</p>;
// tarefas.data: o dado em cache; tarefas.isFetching: há busca em andamento`,
        nota: "Trecho do corpo de um componente; `postarTarefa` é a sua função de escrita. O `fetch` não rejeita em respostas 404 ou 500, por isso a checagem de `r.ok`.",
      },
      {
        tipo: "tabela",
        titulo: "Os estados de uma consulta",
        colunas: ["Sinal", "Quando vale", "O que a tela faz"],
        linhas: [
          ["`isPending`", "Ainda não há dados (primeira busca)", "Mostra esqueleto ou indicador de carregamento"],
          [
            "`isError`",
            "A última tentativa falhou, depois das retentativas",
            "Mostra o erro e oferece “tentar de novo”",
          ],
          ["`data` (sucesso)", "Há dados, frescos ou obsoletos", "Mostra os dados"],
          [
            "`isFetching`",
            "Há uma busca em andamento, inclusive em segundo plano com dados em cache",
            "Mostra um indicador discreto, sem bloquear a tela",
          ],
          ["`isStale`", "O `staleTime` já passou", "Nada visível: só decide se a próxima oportunidade revalida"],
        ],
        nota: "O `fetchStatus` separa “buscando” de “pausada por falta de rede”. Os nomes dessas flags mudaram entre versões maiores (por exemplo, `isLoading` e `isPending`): confira a documentação da versão que você usa, em tanstack.com/query.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que ela é, e o que não é",
        texto:
          "O TanStack Query gerencia **estado de servidor**, não de interface: é um cache assíncrono com regras de frescor. `staleTime` é por quanto tempo confiar no dado sem perguntar de novo; `gcTime` é por quanto tempo guardar o que ninguém está usando. Por padrão, o dado já nasce obsoleto e fica alguns minutos no cache depois de sair de uso. O nome mudou de React Query para TanStack Query porque a biblioteca passou a atender também outros frameworks, além do React.",
      },
    ],
    armadilhas: [
      "Esquecer que o `fetch` não rejeita em 404 ou 500: sem `if (!r.ok) throw`, o erro vira “sucesso” com o corpo da resposta de erro.",
      "Usar na `queryFn` uma variável que não está na `queryKey`: a consulta não refaz a busca quando ela muda ou mistura dados de contextos diferentes.",
      "Copiar `data` para um `useState` “para editar”: são duas verdades; derive o valor ou guarde só o rascunho.",
      "Confundir `staleTime` com `gcTime`, ou achar que dado obsoleto é dado apagado: obsoleto só quer dizer que pode ser revalidado.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece quando dois componentes usam a mesma `queryKey` ao mesmo tempo?",
        resposta:
          "Compartilham a mesma entrada de cache: sai uma única requisição (deduplicação) e os dois recebem o mesmo `data`, renderizando de novo quando ele muda.",
      },
      {
        pergunta: "Qual a diferença entre `staleTime` e `gcTime`?",
        resposta:
          "`staleTime` é o prazo em que o dado é considerado fresco e não precisa ser revalidado. `gcTime` é o prazo, depois que a consulta deixa de ser usada, em que o dado ainda fica no cache antes de ser descartado. O primeiro controla quando refazer a busca; o segundo, por quanto tempo guardar.",
      },
    ],
  },
  en: {
    titulo: "What TanStack Query is",
    pergunta: "What is React Query / TanStack Query?",
    porqueEsteMetodo:
      "The library feels like magic until you follow one query from start to finish: who decides to fetch, when data is reused, when it is refreshed and what happens if something fails. Following that life cycle explains the options and the states.",
    resposta30s:
      "**TanStack Query** (formerly React Query) is a **server-state** library: you call `useQuery` with a **key** and a fetch function, and it fetches, **caches by key**, **deduplicates** identical requests and returns `data` along with loading, error and refetching states. Data stays **fresh** for a period (`staleTime`) and then turns **stale**: it is shown instantly and **revalidated in the background** (window focus, reconnection, remount). Writes use `useMutation`, which usually **invalidates** the affected queries.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One query, from mount to discard",
        etapas: [
          'The component mounts and calls `useQuery({ queryKey: ["todos"], queryFn })`. The **key** identifies the query in the cache; keys with parameters (`["todo", id]`) separate different queries',
          "The cache looks up the key. With no entry, it creates one, marks the query as pending and runs `queryFn`. If another component asked for the same key at the same time, the request is **deduplicated**: only one goes out",
          "The response arrives and is written to the cache; every component using that key renders with the same `data`",
          "During `staleTime` the data is **fresh** and is not revalidated. After that it is **stale**, which does not mean invalid: it is still shown",
          "When a component mounts again, the window regains focus or the network reconnects, and the data is stale, the library shows the cache at once and **revalidates in the background** (`isFetching` turns on, with no loading screen); if the response differs, the screen updates",
          "When no component uses the query, it becomes **inactive**; after `gcTime` it is discarded from the cache. Coming back before then reuses the data",
          "On a write, `useMutation` sends the change; when it finishes, `invalidateQueries` marks the affected queries stale and refetches the ones in use",
        ],
        nota: "Showing the stored data and refreshing it in the background is the pattern known as stale-while-revalidate.",
      },
      {
        tipo: "passos",
        titulo: "When something changes or fails",
        passos: [
          {
            titulo: "The fetch fails",
            texto:
              "`queryFn` throws (network down, or the `!r.ok` in the example below). The library retries a few times, waiting longer between attempts; if all fail, the query enters the error state and `error` carries the reason. Data that was already in the cache stays available. The screen decides: a message, a “try again” button (`refetch`) or an error boundary.",
          },
          {
            titulo: "The key changes",
            texto:
              'If `id` is part of `queryKey: ["todo", id]` and it changes, that is **another query**: another cache entry, another fetch. Responses for old keys do not overwrite the current one, which removes the request race of a hand-written `useEffect` (see L166). If the new key is already cached, the data shows up instantly.',
          },
          {
            titulo: "The write finishes",
            texto:
              "After a mutation, invalidate the affected keys (the library refetches the ones in use) or write the response straight into the cache with `setQueryData`. For the screen to react before the server answers, there are optimistic updates, with a rollback if the mutation fails (see L164).",
          },
          {
            titulo: "The data’s owner changes",
            texto:
              "If the user signs out and another one signs in, the previous cache must not leak into the new session: include the user in the key and clear the cache on logout (`queryClient.clear()`).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A query with invalidation",
        legenda: "JSX",
        codigo: `const client = useQueryClient();

const todos = useQuery({
  queryKey: ["todos"], // identifies the query in the cache
  queryFn: async () => {
    const r = await fetch("/api/todos");
    if (!r.ok) throw new Error("Fetch failed"); // without this, a 500 is not treated as an error
    return r.json();
  },
  staleTime: 30_000, // 30 s of fresh data: no revalidation in that window
});

const create = useMutation({
  mutationFn: postTodo,
  onSuccess: () => client.invalidateQueries({ queryKey: ["todos"] }), // refetch
});

if (todos.isPending) return <p>Loading…</p>;
if (todos.isError) return <p>Something went wrong.</p>;
// todos.data: the cached data; todos.isFetching: a fetch is in progress`,
        nota: "A snippet from a component body; `postTodo` is your own write function. `fetch` does not reject on 404 or 500 responses, hence the `r.ok` check.",
      },
      {
        tipo: "tabela",
        titulo: "The states of a query",
        colunas: ["Signal", "When it holds", "What the screen does"],
        linhas: [
          ["`isPending`", "There is no data yet (first fetch)", "Shows a skeleton or loading indicator"],
          ["`isError`", "The last attempt failed, after the retries", "Shows the error and offers “try again”"],
          ["`data` (success)", "There is data, fresh or stale", "Shows the data"],
          [
            "`isFetching`",
            "A fetch is in progress, including in the background with cached data",
            "Shows a discreet indicator without blocking the screen",
          ],
          [
            "`isStale`",
            "`staleTime` has already passed",
            "Nothing visible: only decides whether the next opportunity revalidates",
          ],
        ],
        nota: "`fetchStatus` separates “fetching” from “paused for lack of network”. The names of these flags changed between major versions (for example, `isLoading` and `isPending`): check the documentation of the version you use, at tanstack.com/query.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What it is, and what it is not",
        texto:
          "TanStack Query manages **server state**, not UI state: it is an asynchronous cache with freshness rules. `staleTime` is how long to trust the data without asking again; `gcTime` is how long to keep what nobody is using. By default, data is born stale and stays in the cache for a few minutes after it falls out of use. The name changed from React Query to TanStack Query because the library began to serve other frameworks besides React.",
      },
    ],
    armadilhas: [
      "Forgetting that `fetch` does not reject on 404 or 500: without `if (!r.ok) throw`, the error becomes a “success” carrying the error response body.",
      "Using in `queryFn` a variable that is not in the `queryKey`: the query does not refetch when it changes, or it mixes data from different contexts.",
      "Copying `data` into a `useState` “to edit it”: that is two truths; derive the value or keep only the draft.",
      "Confusing `staleTime` with `gcTime`, or thinking stale data is deleted data: stale only means it may be revalidated.",
    ],
    autoteste: [
      {
        pergunta: "What happens when two components use the same `queryKey` at the same time?",
        resposta:
          "They share the same cache entry: a single request goes out (deduplication) and both receive the same `data`, rendering again when it changes.",
      },
      {
        pergunta: "What is the difference between `staleTime` and `gcTime`?",
        resposta:
          "`staleTime` is the period in which data counts as fresh and does not need revalidating. `gcTime` is the period, after the query stops being used, in which the data stays in the cache before being discarded. The first controls when to refetch; the second, how long to keep.",
      },
    ],
  },
};
