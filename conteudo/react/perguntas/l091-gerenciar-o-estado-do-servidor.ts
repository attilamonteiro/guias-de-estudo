import type { Pergunta } from "../../tipos";

// L91 · Gerenciar o estado do servidor
export const l091: Pergunta = {
  numero: 91,
  modulo: "linkedin-estado",
  metodo: "whys",
  pt: {
    titulo: "Gerenciar o estado do servidor",
    pergunta: "Como você gerencia o estado do servidor?",
    porqueEsteMetodo:
      "A resposta moderna (“use uma biblioteca de cache”) só convence quando você entende por que o `useState` com `useEffect` não basta. A cadeia de “por quês” leva do que o dado é até a ferramenta certa.",
    resposta30s:
      "Estado de servidor é uma **cópia em cache de dados que pertencem a outro sistema**: é assíncrono, pode ficar **desatualizado** a qualquer momento e é compartilhado por vários usuários. Por isso se gerencia com uma **biblioteca de cache** (TanStack Query, SWR, RTK Query ou os loaders do framework), que cuida de carregamento e erro, cache, deduplicação, revalidação, retentativas e invalidação, em vez de `useState` e `useEffect` à mão. O estado de interface continua com `useState`, Context ou um store.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o estado de servidor não se trata como o estado de interface?",
            resposta:
              "Porque a **verdade mora em outro lugar**. O que você tem é uma foto dos dados num instante, e ela pode envelhecer sem aviso: outro usuário, outra aba ou um processo do servidor mudam o original. Além disso, ler é **assíncrono**, com carregamento, erro e sucesso. O estado de interface (modal aberto, texto digitado) é só da tela, síncrono e sempre correto.",
          },
          {
            pergunta: "Por que `useState` com `useEffect` vira código frágil?",
            resposta:
              "Porque cada tela reimplementa à mão o que é problema de cache: sinalizadores de carregamento e erro, **respostas fora de ordem** (a antiga chega depois da nova), cancelamento, **requisições duplicadas** quando dois componentes pedem o mesmo dado, ausência de cache (voltar à tela mostra o spinner de novo), retentativas e atualização ao voltar para a aba. Cada cópia desse código tem bugs um pouco diferentes (veja L165 e L166).",
          },
          {
            pergunta: "Por que guardar a resposta no Redux (ou em outro store global) também não resolve?",
            resposta:
              "Porque só muda a cópia de lugar. Você ainda escreve à mão os thunks, os sinalizadores de cada requisição, a invalidação e a decisão de quando o dado envelheceu, e passa a ter duas verdades (o store e o servidor) para manter alinhadas. Funciona, mas é muito código para um problema que é de **cache**, não de gerenciamento de estado; o RTK Query existe justamente para isso.",
          },
          {
            pergunta: "Por que uma biblioteca dedicada resolve?",
            resposta:
              "Porque ela modela o estado de servidor como um **cache indexado por chave**: pedidos iguais são deduplicados, cada consulta tem estados claros (carregando, erro, sucesso, atualizando), dados antigos são mostrados na hora e **revalidados em segundo plano**, há retentativas, atualização ao focar a janela ou reconectar, paginação, invalidação depois de mutações e atualização otimista. As opções mais comuns são o **TanStack Query**, o **SWR** e o **RTK Query**; os **loaders** de roteador ou framework e os **Server Components** resolvem a busca antes da tela.",
          },
          {
            pergunta: "E o que sobra para o estado de interface?",
            resposta:
              "Tudo o que é só da tela fica com as ferramentas de sempre: `useState`, `useReducer`, Context, ou um store como Zustand ou Redux para estado de cliente compartilhado. A regra é **não copiar dados de servidor para esse estado**: deixe a biblioteca guardá-los e **derive** o que a tela precisa. Ao editar, guarde só o **rascunho** no estado de interface e envie por uma mutação.",
          },
        ],
        causaRaiz:
          "Estado de servidor é uma **cópia em cache de dados de outro dono**. O difícil não é guardá-lo, e sim saber **quando ele envelheceu e como renová-lo**. Bibliotecas de cache existem para isso; o `useState` não foi feito para isso.",
      },
      {
        tipo: "codigo",
        titulo: "Estado de servidor à mão: o que falta",
        legenda: "JavaScript",
        codigo: `import { useEffect, useState } from "react";

function Perfil({ id }) {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    fetch("/api/usuarios/" + id) // sem AbortController: uma resposta antiga pode chegar depois
      .then((r) => r.json()) // sem checar r.ok: um erro 500 vira "dado"
      .then(setUsuario) // sem cache: voltar à tela busca tudo de novo
      .catch(setErro); // sem retentativa e sem limpar o erro anterior
  }, [id]); // e ao trocar o id? o usuário antigo continua na tela

  if (erro) return <p>Erro</p>;
  if (!usuario) return <p>Carregando…</p>;
  return <h1>{usuario.nome}</h1>;
}`,
        nota: 'Com uma biblioteca, o corpo vira algo como `useQuery({ queryKey: ["usuario", id], queryFn })`, e cache, deduplicação, revalidação e estados vêm prontos (veja L93).',
      },
      {
        tipo: "tabela",
        titulo: "Estado de cliente × estado de servidor",
        colunas: ["Aspecto", "Estado de cliente (interface)", "Estado de servidor"],
        linhas: [
          ["Quem é o dono", "A própria interface", "Outro sistema (banco, API); você tem uma cópia"],
          ["Como se lê", "Síncrono: está na memória", "Assíncrono: precisa de rede, com carregando, erro e sucesso"],
          ["Pode ficar desatualizado?", "Não: o que está na tela é a verdade", "Sim, a qualquer momento e sem aviso"],
          ["Quem mais o altera", "Só a interface", "Outros usuários, outras abas, processos do servidor"],
          [
            "Exemplos",
            "Modal aberto, texto do campo, aba selecionada, tema",
            "Perfil, lista de pedidos, estoque, permissões",
          ],
          [
            "Ferramentas",
            "`useState`, `useReducer`, Context, Zustand, Redux",
            "TanStack Query, SWR, RTK Query, loaders do framework, Server Components",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A pergunta que decide: de quem é este dado?",
        texto:
          "Se o dono é o servidor, trate-o como **cache** com prazo de validade e um jeito de renovar; se é a interface, é estado comum. Não copie dados de servidor para `useState` ou para o store para “sincronizar depois”: isso cria duas verdades. Para editar, mantenha só o **rascunho** no estado de interface e envie por uma mutação, invalidando o cache ao terminar. Confira a documentação da biblioteca que você usa: os nomes das opções mudam entre versões.",
      },
    ],
    armadilhas: [
      "Copiar a resposta da API para `useState` ou Redux e “sincronizar” depois: duas verdades que divergem.",
      "`useEffect` com `fetch` sem cancelamento ou sem ignorar respostas antigas: a resposta atrasada sobrescreve a atual.",
      "Chave de cache que não inclui tudo que muda a resposta (id, filtros, página, usuário): a tela mostra dados trocados.",
      "Não invalidar nem atualizar o cache depois de uma mutação: a tela mostra o dado velho como se fosse o atual.",
    ],
    autoteste: [
      {
        pergunta: "Por que o Redux não é a resposta padrão para guardar dados vindos da API?",
        resposta:
          "Porque só muda a cópia de lugar: você teria de escrever à mão cache, deduplicação, invalidação e retentativas. Redux serve bem para estado de cliente compartilhado; para dados de servidor, o ideal é uma biblioteca de cache (inclusive o RTK Query, que fica dentro do ecossistema Redux).",
      },
      {
        pergunta: "Dê um exemplo de estado de cliente e um de estado de servidor, e diga a diferença essencial.",
        resposta:
          "Cliente: modal aberto ou texto digitado em um campo. Servidor: lista de pedidos ou perfil do usuário. A diferença essencial é o dono: o estado de servidor é uma cópia de dados que pertencem a outro sistema, assíncrona e sujeita a ficar desatualizada.",
      },
    ],
  },
  en: {
    titulo: "Managing server state",
    pergunta: "How do you manage server state?",
    porqueEsteMetodo:
      "The modern answer (“use a cache library”) only convinces once you understand why `useState` with `useEffect` is not enough. The chain of whys goes from what the data is to the right tool.",
    resposta30s:
      "Server state is a **cached copy of data that belongs to another system**: it is asynchronous, can go **stale** at any moment and is shared by many users. That is why it is managed with a **cache library** (TanStack Query, SWR, RTK Query or the framework’s loaders), which handles loading and error states, caching, deduplication, revalidation, retries and invalidation, instead of hand-written `useState` and `useEffect`. UI state stays with `useState`, Context or a store.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why is server state not treated like UI state?",
            resposta:
              "Because the **truth lives elsewhere**. What you hold is a snapshot of the data at one moment, and it can age without warning: another user, another tab or a server process changes the original. Reading is also **asynchronous**, with loading, error and success. UI state (an open modal, typed text) belongs to the screen alone, is synchronous and is always correct.",
          },
          {
            pergunta: "Why does `useState` with `useEffect` become fragile code?",
            resposta:
              "Because every screen re-implements by hand what is really a cache problem: loading and error flags, **out-of-order responses** (the old one arrives after the new one), cancellation, **duplicate requests** when two components ask for the same data, no cache (returning to a screen shows the spinner again), retries and refreshing when the user comes back to the tab. Each copy of that code has slightly different bugs (see L165 and L166).",
          },
          {
            pergunta: "Why does putting the response in Redux (or another global store) not solve it either?",
            resposta:
              "Because it only moves the copy elsewhere. You still hand-write the thunks, the per-request flags, the invalidation and the decision of when the data went stale, and you now have two truths (the store and the server) to keep aligned. It works, but it is a lot of code for a problem that is about **caching**, not state management; RTK Query exists precisely for that.",
          },
          {
            pergunta: "Why does a dedicated library solve it?",
            resposta:
              "Because it models server state as a **cache indexed by key**: identical requests are deduplicated, each query has clear states (loading, error, success, refetching), old data is shown instantly and **revalidated in the background**, and there are retries, refetching on window focus or reconnection, pagination, invalidation after mutations and optimistic updates. The most common options are **TanStack Query**, **SWR** and **RTK Query**; router or framework **loaders** and **Server Components** fetch before the screen is drawn.",
          },
          {
            pergunta: "And what is left for UI state?",
            resposta:
              "Everything that belongs only to the screen stays with the usual tools: `useState`, `useReducer`, Context, or a store such as Zustand or Redux for shared client state. The rule is **not to copy server data into that state**: let the library keep it and **derive** what the screen needs. When editing, keep only the **draft** in UI state and send it through a mutation.",
          },
        ],
        causaRaiz:
          "Server state is a **cached copy of data with another owner**. The hard part is not storing it but knowing **when it went stale and how to renew it**. Cache libraries exist for that; `useState` was not built for it.",
      },
      {
        tipo: "codigo",
        titulo: "Server state by hand: what is missing",
        legenda: "JavaScript",
        codigo: `import { useEffect, useState } from "react";

function Profile({ id }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users/" + id) // no AbortController: an old response can arrive later
      .then((r) => r.json()) // r.ok is never checked: a 500 error becomes "data"
      .then(setUser) // no cache: returning to the screen fetches everything again
      .catch(setError); // no retry, and the previous error is never cleared
  }, [id]); // and when id changes? the old user stays on screen

  if (error) return <p>Error</p>;
  if (!user) return <p>Loading…</p>;
  return <h1>{user.name}</h1>;
}`,
        nota: 'With a library, the body becomes something like `useQuery({ queryKey: ["user", id], queryFn })`, and caching, deduplication, revalidation and states come built in (see L93).',
      },
      {
        tipo: "tabela",
        titulo: "Client state × server state",
        colunas: ["Aspect", "Client state (UI)", "Server state"],
        linhas: [
          ["Who owns it", "The interface itself", "Another system (database, API); you hold a copy"],
          [
            "How it is read",
            "Synchronous: it is in memory",
            "Asynchronous: needs the network, with loading, error and success",
          ],
          ["Can it go stale?", "No: what is on screen is the truth", "Yes, at any moment and without warning"],
          ["Who else changes it", "Only the interface", "Other users, other tabs, server processes"],
          ["Examples", "Open modal, field text, selected tab, theme", "Profile, list of orders, stock, permissions"],
          [
            "Tools",
            "`useState`, `useReducer`, Context, Zustand, Redux",
            "TanStack Query, SWR, RTK Query, framework loaders, Server Components",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The deciding question: whose data is this?",
        texto:
          "If the server owns it, treat it as a **cache** with an expiry and a way to renew it; if the interface owns it, it is ordinary state. Do not copy server data into `useState` or into the store to “sync later”: that creates two truths. To edit, keep only the **draft** in UI state and send it through a mutation, invalidating the cache when it finishes. Check the documentation of the library you use: option names change between versions.",
      },
    ],
    armadilhas: [
      "Copying the API response into `useState` or Redux and “syncing” later: two truths that drift apart.",
      "`useEffect` with `fetch` and no cancellation or no way to ignore old responses: the late response overwrites the current one.",
      "A cache key that does not include everything that changes the response (id, filters, page, user): the screen shows swapped data.",
      "Not invalidating or updating the cache after a mutation: the screen shows stale data as if it were current.",
    ],
    autoteste: [
      {
        pergunta: "Why is Redux not the default answer for storing data that comes from the API?",
        resposta:
          "Because it only moves the copy: you would have to hand-write caching, deduplication, invalidation and retries. Redux fits shared client state well; for server data the better fit is a cache library (including RTK Query, which lives inside the Redux ecosystem).",
      },
      {
        pergunta: "Give an example of client state and one of server state, and state the essential difference.",
        resposta:
          "Client: an open modal or text typed in a field. Server: a list of orders or a user profile. The essential difference is ownership: server state is a copy of data that belongs to another system, asynchronous and liable to go stale.",
      },
    ],
  },
};
