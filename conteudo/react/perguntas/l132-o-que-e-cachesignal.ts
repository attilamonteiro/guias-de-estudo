import type { Pergunta } from "../../tipos";

// L132 · O que é cacheSignal
export const l132: Pergunta = {
  numero: 132,
  modulo: "linkedin-react19",
  metodo: "trace",
  pt: {
    titulo: "O que é cacheSignal",
    pergunta: "O que é cacheSignal()?",
    porqueEsteMetodo:
      "O `cacheSignal` só faz sentido dentro do ciclo de vida de uma renderização no servidor. Acompanhar um pedido do início ao fim, inclusive o caminho em que o usuário vai embora no meio, mostra quando o sinal é abortado e o que isso poupa.",
    resposta30s:
      "`cacheSignal()` devolve um **`AbortSignal` ligado ao tempo de vida do `cache()`** na renderização no servidor: ele é abortado quando a renderização termina, é abandonada ou falha. Você o repassa a `fetch` e a outras operações que aceitam `signal`, e o trabalho que ficou sem utilidade é **cancelado**. É um recurso recente e específico de **Server Components**: confira react.dev.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um pedido, do início ao fim",
        etapas: [
          "Chega o pedido de uma página e o framework começa a renderizar os Server Components; o `cache()` daquela renderização nasce vazio",
          "O componente `Perfil` chama `buscarUsuario(id)`, uma função envolvida em `cache()`: ela dispara um `fetch` com `signal: cacheSignal()`",
          "Outro componente chama `buscarUsuario(id)` com o mesmo argumento: o `cache()` devolve o trabalho já em andamento, sem segunda requisição",
          "A renderização termina e a resposta é concluída: o tempo de vida do cache acaba e o sinal é **abortado**",
          "Qualquer operação ainda pendente e ligada ao sinal (uma busca iniciada que ninguém mais espera) é cancelada, e o servidor deixa de gastar recursos com ela",
        ],
        nota: "O `cache()` vale por renderização no servidor: a cada pedido há um cache novo. Memorização entre pedidos é outro assunto, tratado pelo cache de dados do seu framework.",
      },
      {
        tipo: "passos",
        titulo: "Os caminhos em que algo dá errado",
        passos: [
          {
            titulo: "O usuário vai embora",
            texto:
              "Ele fecha a aba ou navega para outra página antes de a renderização acabar. Se o framework abandona a renderização (isso depende dele), o cache é encerrado e o sinal é abortado: o `fetch` pendente é cancelado em vez de continuar até o fim para ninguém.",
          },
          {
            titulo: "A renderização falha",
            texto:
              "Um erro faz a renderização falhar. O tempo de vida do cache termina do mesmo modo e o sinal é abortado, então buscas ainda pendentes podem ser canceladas.",
          },
          {
            titulo: "O `fetch` rejeita com `AbortError`",
            texto:
              "Cancelar faz a promise do `fetch` rejeitar. Quem ainda estiver aguardando recebe a rejeição: trate `AbortError` como esperado (não como falha a registrar nem a exibir). Como a renderização já acabou, em geral ninguém mais lê o resultado.",
          },
          {
            titulo: "A operação não suporta cancelamento",
            texto:
              "Se a biblioteca não aceita `AbortSignal` (um driver de banco sem esse recurso, por exemplo), repassar o sinal não adianta. Você pode ouvir o evento `abort` do sinal e encerrar o que for possível, mas o cancelamento depende do que a biblioteca oferece.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Repassando o sinal ao fetch",
        legenda: "TSX",
        codigo: `import { cache, cacheSignal } from "react";

const buscarUsuario = cache(async (id: string) => {
  const resposta = await fetch("https://api.exemplo.com/usuarios/" + encodeURIComponent(id), {
    signal: cacheSignal(), // aborta quando o ciclo de vida do cache termina
  });
  if (!resposta.ok) throw new Error("Falha ao buscar o usuário");
  return resposta.json();
});

export async function Perfil({ id }: { id: string }) {
  const usuario = await buscarUsuario(id);
  return <h1>{usuario.nome}</h1>;
}`,
        nota: "`cache` e `cacheSignal` vêm de `react` e valem em Server Components. A API é recente: confira em react.dev o que o `cacheSignal` devolve fora de uma renderização.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que o `cacheSignal` não faz",
        texto:
          "Ele **não cancela nada sozinho**: apenas entrega o sinal, e cabe a você repassá-lo a `fetch` ou a qualquer API que aceite `AbortSignal`. Não é um timeout, não impede que uma resposta lenta atrase a renderização e não serve aos efeitos de Client Components, que têm seu próprio `AbortController` na função de limpeza. Fora de uma renderização no servidor, não há ciclo de vida de cache a observar.",
      },
    ],
    armadilhas: [
      "Esperar que `cacheSignal` cancele as buscas sozinho: ele só entrega o sinal; sem repassá-lo a `fetch` (ou similar), nada é cancelado.",
      "Tratar `AbortError` como falha real: um cancelamento esperado não deve virar alerta nem erro mostrado ao usuário.",
      "Usá-lo em Client Components ou em efeitos: é uma API da renderização no servidor; no navegador, use um `AbortController` na limpeza do efeito.",
      "Confundir o cache com memória entre pedidos: o `cache()` vale por renderização e o sinal acaba junto com ela; não é uma forma de manter dados de um pedido para o outro.",
    ],
    autoteste: [
      {
        pergunta: "Quando o sinal de `cacheSignal()` é abortado?",
        resposta:
          "Quando o tempo de vida do `cache()` da renderização no servidor termina: ao concluir a renderização, ao abandoná-la (por exemplo, o usuário sai da página) ou se ela falha.",
      },
      {
        pergunta: "Para que serve repassar o sinal ao `fetch`?",
        resposta:
          "Para cancelar requisições que ficaram sem utilidade quando a renderização acaba ou é abandonada, poupando recursos do servidor e da API de destino. Sem repassar o sinal, o `fetch` continua até o fim.",
      },
    ],
  },
  en: {
    titulo: "What cacheSignal is",
    pergunta: "What is cacheSignal()?",
    porqueEsteMetodo:
      "`cacheSignal` only makes sense within the lifetime of a server render. Following one request from start to finish, including the path where the user leaves midway, shows when the signal is aborted and what that saves.",
    resposta30s:
      "`cacheSignal()` returns an **`AbortSignal` tied to the lifetime of `cache()`** during a server render: it is aborted when the render finishes, is abandoned or fails. You pass it to `fetch` and other operations that accept a `signal`, and work that became useless is **cancelled**. It is a recent feature specific to **Server Components**: check react.dev.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One request, from start to finish",
        etapas: [
          "A request for a page arrives and the framework starts rendering the Server Components; the `cache()` for that render starts empty",
          "The `Profile` component calls `fetchUser(id)`, a function wrapped in `cache()`: it fires a `fetch` with `signal: cacheSignal()`",
          "Another component calls `fetchUser(id)` with the same argument: `cache()` returns the work already in progress, with no second request",
          "The render finishes and the response completes: the cache lifetime ends and the signal is **aborted**",
          "Any operation still pending and tied to the signal (a fetch that was started and nobody waits for anymore) is cancelled, and the server stops spending resources on it",
        ],
        nota: "`cache()` lasts for one server render: each request gets a new cache. Memoization across requests is a different topic, handled by your framework’s data cache.",
      },
      {
        tipo: "passos",
        titulo: "The paths where something goes wrong",
        passos: [
          {
            titulo: "The user leaves",
            texto:
              "They close the tab or navigate to another page before the render ends. If the framework abandons the render (that depends on it), the cache is closed and the signal is aborted: the pending `fetch` is cancelled instead of running to the end for nobody.",
          },
          {
            titulo: "The render fails",
            texto:
              "An error makes the render fail. The cache lifetime ends the same way and the signal is aborted, so fetches still pending can be cancelled.",
          },
          {
            titulo: "The `fetch` rejects with `AbortError`",
            texto:
              "Cancelling makes the `fetch` promise reject. Whoever is still awaiting it receives the rejection: treat `AbortError` as expected (not as a failure to log or display). Since the render is already over, usually nobody reads the result anymore.",
          },
          {
            titulo: "The operation doesn’t support cancellation",
            texto:
              "If the library doesn’t accept an `AbortSignal` (a database driver without that feature, for example), passing the signal doesn’t help. You can listen to the signal’s `abort` event and shut down what you can, but cancellation depends on what the library offers.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Passing the signal to fetch",
        legenda: "TSX",
        codigo: `import { cache, cacheSignal } from "react";

const fetchUser = cache(async (id: string) => {
  const response = await fetch("https://api.example.com/users/" + encodeURIComponent(id), {
    signal: cacheSignal(), // aborts when the cache lifetime ends
  });
  if (!response.ok) throw new Error("Failed to fetch the user");
  return response.json();
});

export async function Profile({ id }: { id: string }) {
  const user = await fetchUser(id);
  return <h1>{user.name}</h1>;
}`,
        nota: "`cache` and `cacheSignal` come from `react` and apply in Server Components. The API is recent: check react.dev for what `cacheSignal` returns outside a render.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What `cacheSignal` does not do",
        texto:
          "It **cancels nothing by itself**: it only hands you the signal, and it is up to you to pass it to `fetch` or any API that accepts an `AbortSignal`. It is not a timeout, it doesn’t stop a slow response from delaying the render and it isn’t meant for Client Component effects, which have their own `AbortController` in the cleanup function. Outside a server render, there is no cache lifetime to observe.",
      },
    ],
    armadilhas: [
      "Expecting `cacheSignal` to cancel fetches by itself: it only hands you the signal; without passing it to `fetch` (or similar), nothing is cancelled.",
      "Treating `AbortError` as a real failure: an expected cancellation should not become an alert or an error shown to the user.",
      "Using it in Client Components or effects: it is a server-render API; in the browser, use an `AbortController` in the effect’s cleanup.",
      "Mistaking the cache for memory across requests: `cache()` lasts for one render and the signal ends along with it; it is not a way to keep data from one request to the next.",
    ],
    autoteste: [
      {
        pergunta: "When is the signal from `cacheSignal()` aborted?",
        resposta:
          "When the lifetime of the server render’s `cache()` ends: when the render completes, when it is abandoned (for example, the user leaves the page) or when it fails.",
      },
      {
        pergunta: "What is the point of passing the signal to `fetch`?",
        resposta:
          "To cancel requests that became useless when the render ends or is abandoned, saving resources on the server and on the target API. Without passing the signal, the `fetch` runs to the end.",
      },
    ],
  },
};
