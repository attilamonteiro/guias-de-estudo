import type { Pergunta } from "../../tipos";

// L219 · API devolve dados desatualizados
export const l219: Pergunta = {
  numero: 219,
  modulo: "linkedin-cenarios",
  metodo: "playbook",
  pt: {
    titulo: "API devolve dados desatualizados",
    pergunta: "Cenário 5: uma requisição de API às vezes retorna dados desatualizados. Como você depuraria isso?",
    porqueEsteMetodo:
      "“Às vezes” indica que a causa depende de tempo, de cache ou da ordem das respostas, e adivinhar custa caro. O playbook percorre o caminho do dado e, em cada camada, usa um sinal que confirma ou descarta a hipótese.",
    resposta30s:
      "Primeiro **descubra onde o dado fica velho**: a resposta da rede já vem antiga (servidor, CDN, cache HTTP) ou vem nova e a tela mostra outra coisa (cache da biblioteca de consulta, estado local, **closure obsoleta**)? Como é intermitente, suspeite de **respostas fora de ordem** e de **chaves de cache incompletas**. Reproduza com a aba Rede e throttling, e corrija na camada certa: cancelar ou ignorar respostas antigas, completar a `queryKey`, ajustar `staleTime` e invalidação, e os cabeçalhos de cache.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: de onde vem o dado velho?",
        passos: [
          {
            titulo: "1. Defina o que é “velho” e reproduza",
            texto:
              "Anote uma prova objetiva: qual campo, qual valor esperado, em que momento. Na aba **Rede**, ache a requisição e compare o corpo da resposta com a tela. Sinal decisivo: o JSON já vem velho (o problema está antes da tela) ou vem certo e a tela mostra outra coisa (o problema está no cliente).",
          },
          {
            titulo: "2. Veja se a resposta veio da rede ou de um cache",
            texto:
              "Na coluna de tamanho, `(disk cache)` ou `(memory cache)` indica que a requisição nem saiu para a rede; status `304` indica revalidação. Leia `Cache-Control`, `ETag`, `Last-Modified`, `Age` e cabeçalhos de CDN (como `X-Cache`). Marque “Desativar cache” com as DevTools abertas: se o bug some, o cache HTTP ou o da CDN é suspeito.",
          },
          {
            titulo: "3. Compare com o servidor, sem o app",
            texto:
              "Chame o endpoint direto (`curl -i`, com e sem cabeçalhos de cache, ou com um parâmetro único na URL). Se o valor ainda vem velho: réplica de leitura atrasada, cache no servidor ou na CDN. Se vem certo, o problema está no cliente.",
          },
          {
            titulo: "4. Suspeite de corrida entre respostas",
            texto:
              "Se o bug aparece ao digitar rápido, trocar de filtro ou paginar, uma resposta antiga pode **chegar depois** da nova e sobrescrever o estado. Reproduza com throttling (“Slow 3G”) na aba Rede e **registre no console** o parâmetro e a ordem de chegada de cada resposta (veja L70).",
          },
          {
            titulo: "5. Cheque closures obsoletas e dependências",
            texto:
              "Um efeito, callback ou `setInterval` que lê um valor de um render antigo. Sinais: o bug só acontece depois de certa interação, o valor fica “preso”, o lint avisa do `exhaustive-deps` (veja L72).",
          },
          {
            titulo: "6. Inspecione o cache da biblioteca de consulta",
            texto:
              "Nas devtools da TanStack Query (ou da SWR), veja a **chave**, o estado (fresco ou velho) e quando o dado foi atualizado. Procure: parâmetro que muda o resultado mas não está na chave, `staleTime` longo, mutação sem invalidação e revalidação ao voltar para a aba desligada (veja L94).",
          },
          {
            titulo: "7. Corrija na camada e prove com um teste",
            texto:
              "Aplique o conserto da camada (tabela abaixo), reproduza o cenário com respostas fora de ordem num teste (a resposta lenta da busca antiga deve ser ignorada) e deixe um sinal permanente: um campo `atualizadoEm` ou versão no payload e uma métrica de erros.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Camada, sinal e conserto",
        colunas: ["Camada", "Sinal", "Conserto"],
        linhas: [
          [
            "Banco e servidor",
            "O `curl` direto devolve o valor velho, em geral logo depois de uma escrita",
            "Ler do primário após escrever (réplica atrasada) e invalidar o cache do servidor",
          ],
          [
            "Cache HTTP do navegador",
            "`(disk cache)` ou `(memory cache)`; sem `Cache-Control`, o navegador pode aplicar cache heurístico",
            "`Cache-Control` explícito: `no-cache` com `ETag` para revalidar; `no-store` para dado sensível",
          ],
          [
            "CDN e proxies",
            "`Age` alto, `X-Cache: HIT`; usuários diferentes veem versões diferentes",
            "TTL curto, purga ao publicar, `Vary` correto e `private` para resposta personalizada",
          ],
          [
            "Biblioteca de consulta",
            "Chave sem o parâmetro; dado velho exibido sem nova busca",
            "Completar a `queryKey`, ajustar o `staleTime`, invalidar após mutação e revalidar ao focar",
          ],
          [
            "Corrida entre respostas",
            "A resposta de uma busca antiga chega depois da nova",
            "`AbortController` na limpeza do efeito, uma flag para ignorar, ou deixar a biblioteca cuidar",
          ],
          [
            "Estado local e closures",
            "Valor preso num `setInterval` ou listener; props copiadas para `useState`",
            "Dependências corretas, atualização funcional, `ref` para o valor mais recente e derivar em vez de copiar",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Efeito que ignora respostas antigas",
        legenda: "TSX",
        codigo: `import { useEffect, useState } from "react";

export function Pedidos({ status }: { status: string }) {
  const [lista, setLista] = useState<string[]>([]);

  useEffect(() => {
    const controle = new AbortController();
    fetch("/api/pedidos?status=" + encodeURIComponent(status), { signal: controle.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then(setLista)
      .catch((erro) => {
        if (erro.name !== "AbortError") console.error(erro);
      });
    return () => controle.abort(); // a busca anterior não chega mais ao estado
  }, [status]); // sem o status aqui, a lista ficaria presa ao primeiro valor

  return <ul>{lista.map((p) => <li key={p}>{p}</li>)}</ul>;
}`,
        nota: "A limpeza do efeito roda antes de cada nova execução, então cada troca de `status` cancela a requisição anterior. Em vez de `AbortController`, também serve uma variável `ignorar` marcada na limpeza.",
      },
      {
        tipo: "codigo",
        titulo: "Chave completa e invalidação (TanStack Query)",
        legenda: "TSX",
        codigo: `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function usePedidos(status: string, pagina: number) {
  return useQuery({
    queryKey: ["pedidos", { status, pagina }], // todo parâmetro que muda o resultado entra na chave
    queryFn: () => buscarPedidos(status, pagina),
    staleTime: 30_000, // por 30 s o dado conta como fresco: sem nova busca automática
  });
}

function useCriarPedido() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: criarPedido,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pedidos"] }), // marca como velho e rebusca
  });
}`,
        nota: "`buscarPedidos` e `criarPedido` são funções suas. Os padrões de `staleTime` e de revalidação variam entre bibliotecas e versões: confira a documentação da que você usa.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Siga o dado, uma camada por vez. A **resposta da rede está certa?** Se sim, o bug é do cliente (corrida, closure, chave de cache, cache da biblioteca, estado copiado). Se não, é do servidor ou de um cache no meio do caminho. Não conserte antes de provar a camada.",
      },
    ],
    armadilhas: [
      "Testar com “Desativar cache” ou recarga forçada e concluir que “não reproduz”: o usuário real tem cache e abas abertas há horas.",
      '“Resolver” com `Date.now()` na URL ou `cache: "no-store"` em tudo: esconde o sintoma, perde a economia de requisições e não mexe na causa.',
      "Copiar a resposta (ou as props) para `useState` e esquecer de atualizá-la: duas fontes da verdade.",
      "Corrigir só a ordem das respostas e esquecer a invalidação após uma mutação (ou o contrário): são causas diferentes com o mesmo sintoma.",
    ],
    autoteste: [
      {
        pergunta: "A resposta na aba Rede está certa, mas a tela mostra o valor antigo. Onde você procura?",
        resposta:
          "No cliente: cache da biblioteca de consulta (chave e `staleTime`), estado local copiado, closure obsoleta num efeito, ou uma corrida em que outra resposta sobrescreveu o estado.",
      },
      {
        pergunta: "Como impedir que a resposta de uma busca antiga sobrescreva a da nova?",
        resposta:
          "Cancelar a requisição na limpeza do efeito (`AbortController`) ou marcar o efeito como obsoleto e ignorar o resultado. Com uma biblioteca de consulta, colocar os parâmetros na chave, que isola os resultados.",
      },
    ],
  },
  en: {
    titulo: "Debugging stale API data",
    pergunta: "Scenario 5: An API request sometimes returns stale data. How would you debug it?",
    porqueEsteMetodo:
      "“Sometimes” hints that the cause depends on timing, caching or the order of responses, and guessing is expensive. The playbook follows the data’s path and, at each layer, uses a signal that confirms or rules out the hypothesis.",
    resposta30s:
      "First **find where the data goes stale**: does the network response already come back old (server, CDN, HTTP cache), or does it come back fresh and the screen shows something else (query library cache, local state, a **stale closure**)? Since it is intermittent, suspect **out-of-order responses** and **incomplete cache keys**. Reproduce it with the Network tab and throttling, and fix it at the right layer: cancel or ignore old responses, complete the `queryKey`, tune `staleTime` and invalidation, and the cache headers.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: where does the stale data come from?",
        passos: [
          {
            titulo: "1. Define what “stale” means and reproduce it",
            texto:
              "Write down an objective proof: which field, which expected value, at what moment. In the **Network** tab, find the request and compare the response body with the screen. The deciding signal: the JSON is already stale (the problem is before the screen) or it is right and the screen shows something else (the problem is in the client).",
          },
          {
            titulo: "2. Check whether the response came from the network or a cache",
            texto:
              "In the size column, `(disk cache)` or `(memory cache)` means the request never left for the network; a `304` status means revalidation. Read `Cache-Control`, `ETag`, `Last-Modified`, `Age` and CDN headers (such as `X-Cache`). Tick “Disable cache” with DevTools open: if the bug disappears, the HTTP cache or the CDN is a suspect.",
          },
          {
            titulo: "3. Compare with the server, without the app",
            texto:
              "Call the endpoint directly (`curl -i`, with and without cache headers, or with a unique URL parameter). If the value is still stale: a lagging read replica, or a cache on the server or CDN. If it is right, the problem is in the client.",
          },
          {
            titulo: "4. Suspect a race between responses",
            texto:
              "If the bug shows up when typing fast, switching a filter or paginating, an old response may **arrive after** the new one and overwrite the state. Reproduce it with throttling (“Slow 3G”) in the Network tab and **log to the console** the parameter and arrival order of each response (see L70).",
          },
          {
            titulo: "5. Check stale closures and dependencies",
            texto:
              "An effect, callback or `setInterval` that reads a value from an old render. Signs: the bug only happens after a certain interaction, the value is “stuck”, the linter warns about `exhaustive-deps` (see L72).",
          },
          {
            titulo: "6. Inspect the query library’s cache",
            texto:
              "In the TanStack Query (or SWR) devtools, look at the **key**, the state (fresh or stale) and when the data was last updated. Look for: a parameter that changes the result but is not in the key, a long `staleTime`, a mutation with no invalidation and revalidation on tab focus turned off (see L94).",
          },
          {
            titulo: "7. Fix it at the layer and prove it with a test",
            texto:
              "Apply that layer’s fix (table below), reproduce the scenario with out-of-order responses in a test (the slow response of the old search must be ignored) and leave a permanent signal: an `updatedAt` field or a version in the payload, and an error metric.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Layer, signal and fix",
        colunas: ["Layer", "Signal", "Fix"],
        linhas: [
          [
            "Database and server",
            "A direct `curl` returns the stale value, usually right after a write",
            "Read from the primary after writing (lagging replica) and invalidate the server cache",
          ],
          [
            "Browser HTTP cache",
            "`(disk cache)` or `(memory cache)`; without `Cache-Control`, the browser may apply heuristic caching",
            "Explicit `Cache-Control`: `no-cache` with `ETag` to revalidate; `no-store` for sensitive data",
          ],
          [
            "CDN and proxies",
            "High `Age`, `X-Cache: HIT`; different users see different versions",
            "Short TTL, purge on publish, correct `Vary` and `private` for personalized responses",
          ],
          [
            "Query library",
            "Key missing the parameter; stale data shown with no new fetch",
            "Complete the `queryKey`, tune `staleTime`, invalidate after a mutation and revalidate on focus",
          ],
          [
            "Race between responses",
            "The response of an old search arrives after the new one",
            "`AbortController` in the effect cleanup, an ignore flag, or let the library handle it",
          ],
          [
            "Local state and closures",
            "A value stuck in a `setInterval` or listener; props copied into `useState`",
            "Correct dependencies, functional updates, a `ref` for the latest value and deriving instead of copying",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An effect that ignores old responses",
        legenda: "TSX",
        codigo: `import { useEffect, useState } from "react";

export function Orders({ status }: { status: string }) {
  const [list, setList] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/orders?status=" + encodeURIComponent(status), { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
      .then(setList)
      .catch((error) => {
        if (error.name !== "AbortError") console.error(error);
      });
    return () => controller.abort(); // the previous request can no longer reach the state
  }, [status]); // without status here, the list would stay stuck on the first value

  return <ul>{list.map((o) => <li key={o}>{o}</li>)}</ul>;
}`,
        nota: "The effect cleanup runs before each new run, so every change of `status` cancels the previous request. Instead of an `AbortController`, an `ignore` variable set in the cleanup also works.",
      },
      {
        tipo: "codigo",
        titulo: "Complete key and invalidation (TanStack Query)",
        legenda: "TSX",
        codigo: `import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useOrders(status: string, page: number) {
  return useQuery({
    queryKey: ["orders", { status, page }], // every parameter that changes the result goes in the key
    queryFn: () => fetchOrders(status, page),
    staleTime: 30_000, // for 30 s the data counts as fresh: no automatic refetch
  });
}

function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }), // marks it stale and refetches
  });
}`,
        nota: "`fetchOrders` and `createOrder` are your own functions. The defaults for `staleTime` and revalidation vary between libraries and versions: check the documentation of the one you use.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Follow the data, one layer at a time. **Is the network response right?** If so, the bug is in the client (race, closure, cache key, library cache, copied state). If not, it is in the server or in a cache along the way. Do not fix anything before proving the layer.",
      },
    ],
    armadilhas: [
      "Testing with “Disable cache” or a hard reload and concluding it “does not reproduce”: real users have caches and tabs open for hours.",
      '“Fixing” it with `Date.now()` in the URL or `cache: "no-store"` everywhere: it hides the symptom, wastes the saved requests and leaves the cause untouched.',
      "Copying the response (or the props) into `useState` and forgetting to update it: two sources of truth.",
      "Fixing only the order of responses and forgetting invalidation after a mutation (or the reverse): different causes with the same symptom.",
    ],
    autoteste: [
      {
        pergunta: "The response in the Network tab is right, but the screen shows the old value. Where do you look?",
        resposta:
          "In the client: the query library cache (key and `staleTime`), copied local state, a stale closure in an effect, or a race in which another response overwrote the state.",
      },
      {
        pergunta: "How do you stop the response of an old search from overwriting the new one?",
        resposta:
          "Cancel the request in the effect cleanup (`AbortController`) or mark the effect as obsolete and ignore its result. With a query library, put the parameters in the key, which isolates the results.",
      },
    ],
  },
};
