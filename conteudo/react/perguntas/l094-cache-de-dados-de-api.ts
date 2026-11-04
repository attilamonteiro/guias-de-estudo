import type { Pergunta } from "../../tipos";

// L94 · Cache de dados de API
export const l094: Pergunta = {
  numero: 94,
  modulo: "linkedin-estado",
  metodo: "design",
  pt: {
    titulo: "Cache de dados de API",
    pergunta: "Como você lida com o cache de dados de API?",
    porqueEsteMetodo:
      "Cache é decisão de projeto: não existe configuração certa sem saber quão fresco o dado precisa ser, quem o compartilha e o que o invalida. Um roteiro fixo parte desses requisitos e só depois escolhe ferramentas e prazos.",
    resposta30s:
      "Defina primeiro **quão fresco** o dado precisa ser e **o que o invalida**; depois escolha as camadas: **cache HTTP** (`Cache-Control`, `ETag`), CDN e, no cliente, uma biblioteca como **TanStack Query** ou **SWR**, com **chave de cache** completa, **frescor** (`staleTime`) e **retenção** (`gcTime`), revalidação em segundo plano, **deduplicação** e **invalidação após mutações** (ou atualização otimista). Os riscos são mostrar dado **velho** ou **misturar dados de usuários**, por isso a chave inclui tudo que muda a resposta.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos de frescor",
            texto:
              "Para cada tipo de dado, pergunte: **quanto tempo pode ficar velho** sem causar dano (um catálogo aguenta minutos; saldo, estoque disponível e preço de checkout quase nada), **quem o compartilha** (público, igual para todos, ou por usuário) e **o que o invalida** (uma ação do próprio usuário, ações de outros, passagem do tempo).",
          },
          {
            titulo: "2. A chave de cache",
            texto:
              "A chave identifica a resposta: tudo que a **faz variar** entra nela, ou seja, recurso, parâmetros, filtros, página, **usuário ou conta** e idioma. Chave incompleta devolve a resposta de outro contexto; chave demais desperdiça o cache.",
          },
          {
            titulo: "3. As camadas",
            texto:
              "Escolha onde guardar (veja a tabela): cache HTTP do navegador, CDN, cache de dados no cliente (TanStack Query, SWR, RTK Query) e cache no servidor. Elas se empilham, então defina o papel de cada uma para que duas políticas não briguem.",
          },
          {
            titulo: "4. Frescor, retenção e revalidação",
            texto:
              "São duas durações: **frescor** (`staleTime`: por quanto tempo reaproveitar sem perguntar ao servidor) e **retenção** (`gcTime`: por quanto tempo guardar o que ninguém usa, para voltar instantaneamente). Depois do frescor, use **stale-while-revalidate**: mostre o dado guardado agora e atualize em segundo plano (ao focar a janela, reconectar ou montar o componente).",
          },
          {
            titulo: "5. Pedir menos",
            texto:
              "Para reduzir o volume de requisições: **deduplicação** (componentes que pedem a mesma chave juntos geram uma só requisição), **debounce** em buscas digitadas, `enabled` para não buscar antes de ter os parâmetros, **paginação** e campos só do necessário, **prefetch** do que o usuário provavelmente abrirá e tempo real (WebSocket) no lugar de polling frequente.",
          },
          {
            titulo: "6. Escrita e invalidação",
            texto:
              "Depois de uma mutação, **invalide** as chaves afetadas (a biblioteca refaz a busca) ou **grave a resposta direto no cache** quando ela já traz o dado novo. Para dar sensação de velocidade, use **atualização otimista**, com reversão em caso de erro (veja L164). Mudanças feitas por outras pessoas entram por eventos em tempo real que invalidam as chaves.",
          },
          {
            titulo: "7. Segurança e medição",
            texto:
              "Nunca misture usuários: a chave leva o usuário, o cache do cliente é limpo no logout e respostas personalizadas não vão para caches compartilhados. Meça a taxa de acertos, o número de requisições por tela e as queixas de dado velho, e ajuste os prazos com base nisso.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde guardar e o que cada camada resolve",
        colunas: ["Camada", "Como funciona", "Bom para", "Cuidado"],
        linhas: [
          [
            "Cache HTTP do navegador (`Cache-Control`, `ETag`)",
            "O servidor define por quanto tempo reaproveitar (`max-age`) e dá um validador (`ETag`); o navegador revalida com `If-None-Match` e recebe `304` sem corpo se nada mudou",
            "Respostas `GET` estáveis e recursos públicos, economizando download",
            "Dado privado pede `private`; dado sensível, `no-store`; a resposta pode vir do cache mesmo quando a biblioteca “revalida”",
          ],
          [
            "CDN ou proxy compartilhado",
            "Guarda uma cópia perto do usuário (`s-maxage`)",
            "Conteúdo igual para todos (catálogo, páginas públicas)",
            "Nunca cachear resposta personalizada sem `Vary` ou chave por usuário",
          ],
          [
            "Cache de dados no cliente (TanStack Query, SWR, RTK Query)",
            "Memória por chave, com `staleTime`, revalidação em segundo plano, deduplicação e invalidação",
            "Dados de servidor de uma SPA com mutações",
            "Fica em memória e some ao recarregar a página; chave incompleta mistura dados",
          ],
          [
            "Cache no servidor (Redis, memória)",
            "Guarda resultados caros de banco ou de serviços de terceiros",
            "Aliviar o back-end e as integrações",
            "Invalidação mais difícil; precisa de prazo e de chave por contexto",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Chave, prazos e invalidação no cliente",
        legenda: "JSX",
        codigo: `const cliente = useQueryClient();

const pedidos = useQuery({
  queryKey: ["pedidos", usuarioId, { pagina, status }], // tudo que muda a resposta
  queryFn: ({ signal }) => buscarPedidos({ usuarioId, pagina, status }, signal),
  enabled: Boolean(usuarioId), // não busca sem os parâmetros
  staleTime: 60_000, // 1 min fresco: sem nova requisição
  gcTime: 10 * 60_000, // guarda 10 min depois que ninguém usa
});

const salvar = useMutation({
  mutationFn: atualizarPedido,
  onSuccess: (pedido) => {
    cliente.setQueryData(["pedido", pedido.id], pedido); // a resposta já traz o dado novo
    cliente.invalidateQueries({ queryKey: ["pedidos"] }); // as listas são refeitas
  },
});`,
        nota: "O `signal` permite cancelar a requisição quando a consulta deixa de ser necessária (veja L165). Os nomes das opções seguem a biblioteca; confira a documentação da versão que você usa.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Cache é **chave + frescor + invalidação**, nessa ordem. Se você não consegue dizer o que invalida um dado, ele pede prazo curto ou nenhum cache. Na dúvida, prefira **cache curto com revalidação em segundo plano**: a tela aparece rápido e se corrige sozinha. Para reduzir requisições, combine o que cada técnica faz: cache **reaproveita**, deduplicação **agrupa**, debounce **espera**, `enabled` **evita** e paginação **pede menos**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os dois riscos graves: dado velho e dado trocado",
        texto:
          "**Dado velho**: defina o prazo pelo custo do erro (mostrar um saldo ou estoque desatualizado é pior que mostrar um texto de ajuda antigo) e invalide depois de cada mutação. **Dado trocado**: chave sem usuário, conta ou idioma, ou CDN servindo resposta personalizada para outra pessoa. Lembre também que o cache HTTP e o da biblioteca se empilham: uma resposta pode sair do cache do navegador mesmo quando a biblioteca decidiu revalidar.",
      },
    ],
    armadilhas: [
      "Chave de cache sem usuário, conta, filtros ou página: a tela mostra a resposta de outro contexto.",
      "Cachear sem plano de invalidação: depois de gravar, a lista continua mostrando o dado antigo.",
      "Deixar um cache compartilhado (CDN, proxy) guardar resposta personalizada, ou esquecer `private` e `no-store` em dado sensível.",
      "Confundir debounce, deduplicação e cache: cada um reduz requisições por um motivo diferente, e o debounce não guarda nada.",
    ],
    autoteste: [
      {
        pergunta: "Quando atualizar o cache direto com a resposta, e quando só invalidar?",
        resposta:
          "Quando a resposta da mutação já traz o dado novo, grave-a no cache (`setQueryData`) e economize uma requisição. Quando a mutação afeta listas ou dados derivados que você não conhece por inteiro, invalide as chaves e deixe a biblioteca refazer a busca.",
      },
      {
        pergunta: "O que o `ETag` e o `304` economizam?",
        resposta:
          "O download do corpo. O navegador pergunta se o recurso mudou (`If-None-Match`) e, se não mudou, o servidor responde `304` sem corpo e o navegador reaproveita a cópia que tem. Ainda há uma ida e volta à rede, mas sem baixar de novo.",
      },
    ],
  },
  en: {
    titulo: "Caching API data",
    pergunta: "How do you handle caching of API data?",
    porqueEsteMetodo:
      "Caching is a design decision: there is no right setting without knowing how fresh the data must be, who shares it and what invalidates it. A fixed script starts from those requirements and only then picks tools and durations.",
    resposta30s:
      "First define **how fresh** the data must be and **what invalidates it**; then choose the layers: **HTTP cache** (`Cache-Control`, `ETag`), a CDN and, on the client, a library such as **TanStack Query** or **SWR**, with a complete **cache key**, **freshness** (`staleTime`) and **retention** (`gcTime`), background revalidation, **deduplication** and **invalidation after mutations** (or optimistic updates). The risks are showing **stale** data or **mixing users’ data**, so the key includes everything that changes the response.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Freshness requirements",
            texto:
              "For each kind of data, ask: **how long can it be stale** without harm (a catalog tolerates minutes; balance, available stock and checkout price barely anything), **who shares it** (public and the same for everyone, or per user) and **what invalidates it** (the user’s own action, other people’s actions, the passing of time).",
          },
          {
            titulo: "2. The cache key",
            texto:
              "The key identifies the response: everything that makes it **vary** goes in, that is, resource, parameters, filters, page, **user or account** and language. An incomplete key returns another context’s response; a key with too much wastes the cache.",
          },
          {
            titulo: "3. The layers",
            texto:
              "Choose where to store (see the table): browser HTTP cache, CDN, client data cache (TanStack Query, SWR, RTK Query) and server cache. They stack, so define each one’s role so two policies do not fight.",
          },
          {
            titulo: "4. Freshness, retention and revalidation",
            texto:
              "There are two durations: **freshness** (`staleTime`: how long to reuse without asking the server) and **retention** (`gcTime`: how long to keep what nobody uses, so coming back is instant). After freshness, use **stale-while-revalidate**: show the stored data now and update in the background (on window focus, reconnection or component mount).",
          },
          {
            titulo: "5. Asking for less",
            texto:
              "To reduce the volume of requests: **deduplication** (components asking for the same key together produce a single request), **debounce** on typed searches, `enabled` so nothing is fetched before the parameters exist, **pagination** and only the fields you need, **prefetch** of what the user will probably open, and real time (WebSocket) in place of frequent polling.",
          },
          {
            titulo: "6. Writing and invalidation",
            texto:
              "After a mutation, **invalidate** the affected keys (the library refetches) or **write the response straight into the cache** when it already carries the new data. For a feeling of speed, use **optimistic updates**, with a rollback on error (see L164). Changes made by other people come in through real-time events that invalidate keys.",
          },
          {
            titulo: "7. Security and measurement",
            texto:
              "Never mix users: the key carries the user, the client cache is cleared on logout and personalized responses do not go into shared caches. Measure the hit rate, the number of requests per screen and complaints about stale data, and tune the durations from that.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to store and what each layer solves",
        colunas: ["Layer", "How it works", "Good for", "Watch out"],
        linhas: [
          [
            "Browser HTTP cache (`Cache-Control`, `ETag`)",
            "The server sets how long to reuse (`max-age`) and provides a validator (`ETag`); the browser revalidates with `If-None-Match` and gets a body-less `304` if nothing changed",
            "Stable `GET` responses and public resources, saving download",
            "Private data needs `private`; sensitive data, `no-store`; the response may come from cache even when the library “revalidates”",
          ],
          [
            "CDN or shared proxy",
            "Keeps a copy near the user (`s-maxage`)",
            "Content that is the same for everyone (catalog, public pages)",
            "Never cache a personalized response without `Vary` or a per-user key",
          ],
          [
            "Client data cache (TanStack Query, SWR, RTK Query)",
            "In-memory by key, with `staleTime`, background revalidation, deduplication and invalidation",
            "Server data in an SPA with mutations",
            "Lives in memory and disappears on page reload; an incomplete key mixes data",
          ],
          [
            "Server cache (Redis, memory)",
            "Stores expensive results from the database or third-party services",
            "Relieving the back end and integrations",
            "Harder invalidation; needs an expiry and a per-context key",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Key, durations and invalidation on the client",
        legenda: "JSX",
        codigo: `const client = useQueryClient();

const orders = useQuery({
  queryKey: ["orders", userId, { page, status }], // everything that changes the response
  queryFn: ({ signal }) => fetchOrders({ userId, page, status }, signal),
  enabled: Boolean(userId), // do not fetch without the parameters
  staleTime: 60_000, // 1 min fresh: no new request
  gcTime: 10 * 60_000, // keep 10 min after nobody uses it
});

const save = useMutation({
  mutationFn: updateOrder,
  onSuccess: (order) => {
    client.setQueryData(["order", order.id], order); // the response already has the new data
    client.invalidateQueries({ queryKey: ["orders"] }); // lists are refetched
  },
});`,
        nota: "The `signal` lets you cancel the request when the query is no longer needed (see L165). Option names follow the library; check the documentation of the version you use.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Caching is **key + freshness + invalidation**, in that order. If you cannot say what invalidates a piece of data, it needs a short expiry or no cache. When in doubt, prefer **short caching with background revalidation**: the screen appears fast and corrects itself. To reduce requests, combine what each technique does: caching **reuses**, deduplication **groups**, debounce **waits**, `enabled` **avoids** and pagination **asks for less**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The two serious risks: stale data and swapped data",
        texto:
          "**Stale data**: set the expiry by the cost of the error (showing an out-of-date balance or stock level is worse than an old help text) and invalidate after every mutation. **Swapped data**: a key without user, account or language, or a CDN serving a personalized response to someone else. Remember too that the HTTP cache and the library’s cache stack: a response may come from the browser cache even when the library decided to revalidate.",
      },
    ],
    armadilhas: [
      "A cache key without user, account, filters or page: the screen shows another context’s response.",
      "Caching with no invalidation plan: after a write, the list keeps showing the old data.",
      "Letting a shared cache (CDN, proxy) store a personalized response, or forgetting `private` and `no-store` on sensitive data.",
      "Mixing up debounce, deduplication and caching: each cuts requests for a different reason, and debounce stores nothing.",
    ],
    autoteste: [
      {
        pergunta: "When do you update the cache directly with the response, and when do you only invalidate?",
        resposta:
          "When the mutation response already carries the new data, write it into the cache (`setQueryData`) and save a request. When the mutation affects lists or derived data you do not fully know, invalidate the keys and let the library refetch.",
      },
      {
        pergunta: "What do `ETag` and `304` save?",
        resposta:
          "The body download. The browser asks whether the resource changed (`If-None-Match`) and, if not, the server answers `304` with no body and the browser reuses the copy it has. There is still a round trip, but nothing is downloaded again.",
      },
    ],
  },
};
