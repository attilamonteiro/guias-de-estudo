import type { Pergunta } from "../../tipos";

// L104 · O que é Suspense
export const l104: Pergunta = {
  numero: 104,
  modulo: "linkedin-desempenho",
  metodo: "trace",
  pt: {
    titulo: "O que é Suspense",
    pergunta: "O que é Suspense?",
    porqueEsteMetodo:
      "Suspense parece mágica até você seguir uma renderização que não consegue terminar: onde ela para, quem mostra o fallback e quando o React tenta de novo. Acompanhar o caminho feliz e depois os desvios (fronteiras aninhadas, transições, erro, servidor) mostra o mecanismo inteiro.",
    resposta30s:
      "**Suspense** é um componente (`<Suspense fallback={...}>`) que diz o que mostrar enquanto algo dentro dele ainda não está pronto. Quando um filho **suspende** (código de `lazy` ainda sendo baixado, uma promise lida com `use` ou uma fonte de dados compatível com Suspense), o React pausa aquela parte da renderização, exibe o **fallback** da fronteira mais próxima e, quando o recurso resolve, **tenta renderizar de novo** e troca o fallback pelo conteúdo. Ele **não detecta** um `fetch` feito dentro de `useEffect`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um componente suspende, do início ao fim",
        etapas: [
          "O React renderiza `<Artigo>` e chega ao filho `<Autor>`, que chama `use(promessa)` com uma promise ainda pendente",
          "A leitura não devolve valor: o React interrompe a renderização desse filho (ele **suspende**) e nada do que foi calculado vai para a tela",
          "O React sobe pela árvore até a **fronteira `<Suspense>` mais próxima** e renderiza o `fallback` no lugar do conteúdo que suspendeu; o que está fora da fronteira segue normal",
          "O React espera a promise: quando ela resolve, agenda uma nova tentativa de renderização daquela fronteira",
          "Na nova tentativa, `use(promessa)` já devolve o valor, `<Autor>` termina de renderizar e o React troca o fallback pelo conteúdo",
        ],
        nota: "Com `lazy` é o mesmo mecanismo: a primeira renderização dispara o `import()` e suspende, e o módulo carregado vira o componente na tentativa seguinte (veja L102).",
      },
      {
        tipo: "passos",
        titulo: "Os desvios que mudam o resultado",
        passos: [
          {
            titulo: "Fronteiras aninhadas",
            texto:
              "Só a fronteira mais próxima de quem suspendeu mostra o fallback; as de fora e as vizinhas ficam como estão. Uma fronteira por região (menu, lista, gráfico) revela a página aos poucos, enquanto uma única fronteira no topo faz tudo esperar pelo item mais lento.",
          },
          {
            titulo: "Atualização que suspende de novo",
            texto:
              "Se um conteúdo já visível passa a suspender (por exemplo, ao trocar o id que a tela lê), o React volta ao fallback por padrão. Marque a atualização como **transição** (`startTransition`, `useTransition`) ou use `useDeferredValue`: o React mantém a interface anterior até a nova ficar pronta, e `isPending` permite mostrar um indicador discreto.",
          },
          {
            titulo: "Streaming no servidor",
            texto:
              "No servidor, o HTML sai com o fallback no lugar do que ainda não está pronto e o restante é enviado depois, em pedaços, conforme cada fronteira resolve. No navegador, o React pode hidratar as fronteiras de forma independente. Quem expõe isso são os frameworks e as APIs de renderização em stream; confira react.dev.",
          },
          {
            titulo: "A promise rejeita",
            texto:
              "Suspense cobre só a **espera**. Se o recurso falha, o erro é lançado na renderização e sobe até o **Error Boundary** mais próximo; sem um, a árvore é desmontada. Pense em Suspense para “carregando” e em Error Boundary para “falhou”.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Código sob demanda e dado lido com `use`",
        legenda: "TSX",
        codigo: `import { Suspense, lazy, use } from "react";

const Grafico = lazy(() => import("./Grafico")); // código baixado só quando aparecer

function Autor({ promessa }: { promessa: Promise<{ nome: string }> }) {
  const autor = use(promessa); // suspende até a promise resolver
  return <p>Por {autor.nome}</p>;
}

export function Artigo({ promessaDoAutor }: { promessaDoAutor: Promise<{ nome: string }> }) {
  return (
    <>
      <Suspense fallback={<p>Carregando autor…</p>}>
        <Autor promessa={promessaDoAutor} />
      </Suspense>
      <Suspense fallback={<p>Carregando gráfico…</p>}>
        <Grafico />
      </Suspense>
    </>
  );
}`,
        nota: "A promise vem de fora do componente (de um Server Component, de um cache ou de uma biblioteca compatível). Criar uma nova a cada renderização faz a espera recomeçar.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que faz um componente suspender",
        texto:
          "As fontes que ativam o Suspense são: **`lazy`** (código), **`use(promise)`** (dado, com a promise estável entre renderizações) e **bibliotecas e frameworks com suporte a Suspense** (dados em Server Components, roteadores, TanStack Query com `useSuspenseQuery`, Relay). O mecanismo interno pelo qual um componente “avisa” o React não é API pública: dependa das APIs oficiais e confira react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Suspense não é um detector de requisições",
        texto:
          "Um `fetch` feito dentro de `useEffect` ou de um manipulador de evento acontece **depois** da renderização: o componente já renderizou com o estado inicial e o Suspense não vê nada, então nenhum fallback aparece. Para o fallback funcionar, a leitura precisa acontecer **durante a renderização**, por uma das fontes acima. Se você usa efeitos, continue controlando o “carregando” com estado próprio.",
      },
    ],
    armadilhas: [
      "Esperar que o Suspense mostre o fallback para um `fetch` dentro de `useEffect`: o efeito roda depois da renderização e o Suspense não o enxerga.",
      "Criar a promise dentro do componente que a lê com `use`: ela é nova a cada tentativa e a espera nunca termina. Receba-a de fora (Server Component, cache ou biblioteca).",
      "Colocar uma única fronteira no topo da aplicação: qualquer suspensão esconde a página inteira. Use fronteiras menores, perto do que carrega.",
      "Esquecer o Error Boundary: uma promise rejeitada vira erro de renderização e, sem fronteira de erro, derruba a árvore.",
    ],
    autoteste: [
      {
        pergunta: "Por que um `fetch` em `useEffect` não aciona o fallback do Suspense?",
        resposta:
          "Porque o Suspense só reage a uma renderização que suspende. O efeito roda depois que o componente renderizou e foi para a tela, então não há nada para o React interromper. A leitura precisa acontecer durante a renderização (`use`, `lazy` ou biblioteca compatível).",
      },
      {
        pergunta: "Como evitar que o conteúdo já visível volte ao fallback quando uma atualização suspende?",
        resposta:
          "Marcando a atualização como transição (`startTransition` ou `useTransition`) ou usando `useDeferredValue`. O React mantém a interface anterior até a nova estar pronta, e `isPending` permite mostrar um indicador.",
      },
    ],
  },
  en: {
    titulo: "What Suspense is",
    pergunta: "What is Suspense?",
    porqueEsteMetodo:
      "Suspense feels like magic until you follow a render that cannot finish: where it stops, who shows the fallback and when React tries again. Tracing the happy path and then the detours (nested boundaries, transitions, errors, the server) reveals the whole mechanism.",
    resposta30s:
      "**Suspense** is a component (`<Suspense fallback={...}>`) that says what to show while something inside it is not ready yet. When a child **suspends** (`lazy` code still downloading, a promise read with `use`, or a Suspense-compatible data source), React pauses that part of the render, shows the **fallback** of the nearest boundary and, when the resource resolves, **retries the render** and swaps the fallback for the content. It **does not detect** a `fetch` made inside `useEffect`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A component suspends, start to finish",
        etapas: [
          "React renders `<Article>` and reaches the child `<Author>`, which calls `use(promise)` with a promise that is still pending",
          "The read returns no value: React interrupts that child’s render (it **suspends**) and nothing it computed goes to the screen",
          "React walks up the tree to the **nearest `<Suspense>` boundary** and renders the `fallback` in place of the content that suspended; whatever is outside the boundary carries on as usual",
          "React waits for the promise: when it resolves, it schedules a new render attempt for that boundary",
          "On the retry, `use(promise)` already returns the value, `<Author>` finishes rendering and React swaps the fallback for the content",
        ],
        nota: "With `lazy` it is the same mechanism: the first render triggers the `import()` and suspends, and the loaded module becomes the component on the next attempt (see L102).",
      },
      {
        tipo: "passos",
        titulo: "The detours that change the outcome",
        passos: [
          {
            titulo: "Nested boundaries",
            texto:
              "Only the boundary closest to whoever suspended shows its fallback; the outer and neighbouring ones stay as they are. One boundary per region (menu, list, chart) reveals the page gradually, while a single boundary at the top makes everything wait for the slowest item.",
          },
          {
            titulo: "An update that suspends again",
            texto:
              "If content that is already visible starts suspending (for example, when the id the screen reads changes), React goes back to the fallback by default. Mark the update as a **transition** (`startTransition`, `useTransition`) or use `useDeferredValue`: React keeps the previous interface on screen until the new one is ready, and `isPending` lets you show a subtle indicator.",
          },
          {
            titulo: "Streaming on the server",
            texto:
              "On the server, the HTML goes out with the fallback in place of whatever is not ready, and the rest is sent later, in chunks, as each boundary resolves. In the browser, React can hydrate boundaries independently. Frameworks and the streaming render APIs expose this; check react.dev.",
          },
          {
            titulo: "The promise rejects",
            texto:
              "Suspense covers only the **waiting**. If the resource fails, the error is thrown during render and climbs to the nearest **Error Boundary**; without one, the tree is unmounted. Think of Suspense as “loading” and Error Boundary as “failed”.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Code on demand and data read with `use`",
        legenda: "TSX",
        codigo: `import { Suspense, lazy, use } from "react";

const Chart = lazy(() => import("./Chart")); // code downloaded only when it shows up

function Author({ promise }: { promise: Promise<{ name: string }> }) {
  const author = use(promise); // suspends until the promise resolves
  return <p>By {author.name}</p>;
}

export function Article({ authorPromise }: { authorPromise: Promise<{ name: string }> }) {
  return (
    <>
      <Suspense fallback={<p>Loading author…</p>}>
        <Author promise={authorPromise} />
      </Suspense>
      <Suspense fallback={<p>Loading chart…</p>}>
        <Chart />
      </Suspense>
    </>
  );
}`,
        nota: "The promise comes from outside the component (from a Server Component, a cache or a compatible library). Creating a new one on every render makes the wait start over.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What makes a component suspend",
        texto:
          "The sources that trigger Suspense are: **`lazy`** (code), **`use(promise)`** (data, with a promise that is stable across renders) and **libraries and frameworks with Suspense support** (data in Server Components, routers, TanStack Query with `useSuspenseQuery`, Relay). The internal mechanism a component uses to “tell” React is not a public API: rely on the official APIs and check react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Suspense is not a request detector",
        texto:
          "A `fetch` made inside `useEffect` or an event handler happens **after** the render: the component has already rendered with its initial state and Suspense sees nothing, so no fallback appears. For the fallback to work, the read must happen **during render**, through one of the sources above. If you use effects, keep controlling “loading” with your own state.",
      },
    ],
    armadilhas: [
      "Expecting Suspense to show the fallback for a `fetch` inside `useEffect`: the effect runs after the render and Suspense cannot see it.",
      "Creating the promise inside the component that reads it with `use`: it is new on every attempt and the wait never ends. Receive it from outside (Server Component, cache or library).",
      "Putting a single boundary at the top of the application: any suspension hides the whole page. Use smaller boundaries close to what loads.",
      "Forgetting the Error Boundary: a rejected promise becomes a render error and, without an error boundary, takes the tree down.",
    ],
    autoteste: [
      {
        pergunta: "Why does a `fetch` in `useEffect` not trigger the Suspense fallback?",
        resposta:
          "Because Suspense only reacts to a render that suspends. The effect runs after the component has rendered and reached the screen, so there is nothing for React to interrupt. The read must happen during render (`use`, `lazy` or a compatible library).",
      },
      {
        pergunta: "How do you stop already visible content from going back to the fallback when an update suspends?",
        resposta:
          "By marking the update as a transition (`startTransition` or `useTransition`) or by using `useDeferredValue`. React keeps the previous interface until the new one is ready, and `isPending` lets you show an indicator.",
      },
    ],
  },
};
