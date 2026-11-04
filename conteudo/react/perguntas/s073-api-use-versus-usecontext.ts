import type { Pergunta } from "../../tipos";

// S73 · API use versus useContext
export const s073: Pergunta = {
  numero: 673,
  modulo: "simplilearn-react19",
  metodo: "trace",
  pt: {
    titulo: "API use versus useContext",
    pergunta: "O que a API use faz e como ela é diferente do useContext?",
    porqueEsteMetodo:
      "A `use` se comporta de um jeito com uma promise e de outro com um contexto, e o que acontece com a promise (suspender, mostrar o fallback, recomeçar, falhar) só fica claro seguindo uma chamada do começo ao fim, inclusive no caminho em que ela é rejeitada.",
    resposta30s:
      "`use` é uma API do React que **lê um valor durante a renderização**: o resultado de uma **promise** ou o valor de um **contexto**. Se a promise ainda está pendente, o componente **suspende**: o `Suspense` mais próximo mostra o fallback e o React renderiza de novo quando ela resolve; se ela for rejeitada, o erro segue para o **Error Boundary**. Com um contexto, `use` lê o mesmo valor que o `useContext`, mas pode ser chamada **dentro de `if` e de laços**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma promise, do componente ao conteúdo na tela",
        etapas: [
          "Um componente chama `use(promessa)` durante a renderização e a promise ainda está pendente",
          "`use` não devolve nada: o componente **suspende** e o React interrompe essa tentativa de renderização, sem mostrar nada pela metade",
          "O `Suspense` mais próximo, acima na árvore, exibe o `fallback`; o que está fora dessa fronteira continua normal",
          "A promise é resolvida e o React agenda uma nova renderização do componente suspenso, que recomeça do início da função",
          "Agora `use(promessa)` encontra o resultado pronto e o devolve na hora; o componente termina de renderizar e o conteúdo substitui o fallback",
        ],
        nota: "A mesma promise (a mesma referência) precisa aparecer nas duas passagens: é por ela que o React reconhece que o resultado chegou. Onde criar e como guardar a promise muda entre frameworks e versões: confira react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "Uma promise estável e um Suspense acima dela",
        legenda: "TSX",
        codigo: [
          'import { Suspense, use } from "react";',
          "",
          "const cache = new Map<number, Promise<{ nome: string }>>();",
          "",
          "function buscarUsuario(id: number) {",
          "  if (!cache.has(id)) cache.set(id, fetch(`/api/usuarios/${id}`).then((r) => r.json()));",
          "  return cache.get(id)!; // a mesma promise a cada renderização",
          "}",
          "",
          "function Perfil({ promessa }: { promessa: Promise<{ nome: string }> }) {",
          "  const usuario = use(promessa); // suspende enquanto estiver pendente",
          "  return <h1>{usuario.nome}</h1>;",
          "}",
          "",
          "export function Pagina({ id }: { id: number }) {",
          "  return (",
          "    <Suspense fallback={<p>Carregando…</p>}>",
          "      <Perfil promessa={buscarUsuario(id)} />",
          "    </Suspense>",
          "  );",
          "}",
        ].join("\n"),
        nota: "O `Perfil` só chega ao `return` com o dado pronto: sem `useEffect` e sem estado de carregamento. Este cache simples nunca é invalidado; em um app real, use o cache do framework ou de uma biblioteca de dados.",
      },
      {
        tipo: "passos",
        titulo: "O caminho em que dá errado",
        passos: [
          {
            titulo: "A promise é rejeitada",
            texto:
              "`use` lança o motivo da rejeição durante a renderização do componente, e o React procura o **Error Boundary** mais próximo (veja S34 e M21), que mostra o fallback de erro. Um `try/catch` em volta de `use` não funciona, porque a chamada não é permitida ali: trate o erro com um Error Boundary ou com `.catch()` na promise, devolvendo um valor alternativo.",
          },
          {
            titulo: "Falta a fronteira",
            texto:
              "Sem `Suspense` acima do componente não há onde mostrar o estado de carregamento. Coloque a fronteira onde a interface faz sentido: uma só em volta da página inteira esconde mais do que o necessário.",
          },
          {
            titulo: "A promise nasce a cada renderização",
            texto:
              "Se o componente faz `use(fetch(...))` no próprio corpo, cada nova tentativa cria outra promise, que nunca está pronta quando o React volta. O React avisa no console e a tela pode ficar suspendendo sem fim. Crie a promise fora da renderização: em um Server Component que a passa por prop, em um cache ou em uma biblioteca compatível com Suspense.",
          },
          {
            titulo: "A navegação e o fallback",
            texto:
              "Ao trocar o `id`, a promise nova suspende de novo e o fallback volta a aparecer. Se você prefere manter a tela antiga enquanto a nova carrega, marque a atualização como transição (`useTransition` ou `startTransition`).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ler um contexto depois de um retorno antecipado",
        legenda: "TSX",
        codigo: [
          'import { createContext, use } from "react";',
          "",
          'const TemaContext = createContext({ destaque: "azul" });',
          "",
          "function Botao({ destacado }: { destacado: boolean }) {",
          "  if (!destacado) return <button>Salvar</button>; // retorno antecipado",
          "",
          "  // com useContext, isto violaria as regras dos Hooks",
          "  const tema = use(TemaContext);",
          "  return <button className={tema.destaque}>Salvar</button>;",
          "}",
        ].join("\n"),
        nota: "Quando o valor do contexto muda, o componente que o leu com `use` renderiza de novo, igual a quem usou `useContext`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "use ou useContext?",
        texto:
          "`useContext(Contexto)` é um Hook: só pode ser chamado no topo do componente, antes de qualquer `return`. `use(Contexto)` lê o mesmo valor, assina o mesmo contexto e pode aparecer depois de um retorno antecipado, dentro de `if` e de laços. Mas `use` também só roda **durante a renderização** de um componente ou de um Hook, nunca em manipuladores de eventos nem em efeitos. O que a `use` acrescenta é aceitar uma promise. Em Server Components, prefira `async`/`await`; a `use` brilha ao ler no cliente uma promise criada no servidor. Regras e disponibilidade mudam por versão: confira react.dev.",
      },
    ],
    armadilhas: [
      "Criar a promise no corpo do componente (`use(fetch(...))`): cada renderização cria outra e o componente nunca termina de carregar.",
      "Envolver `use` em `try/catch`: a chamada não é permitida ali. Use um Error Boundary ou `.catch()` na promise.",
      "Esquecer o `Suspense` (ou o Error Boundary) acima: sem eles não há fallback nem tela de erro pensados para o usuário.",
      "Tratar `use` como um Hook comum que serve em qualquer lugar: ela só roda na renderização, nunca em manipuladores de eventos nem em efeitos.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece quando um componente chama `use(promessa)` e a promise ainda está pendente?",
        resposta:
          "O componente suspende: o React interrompe a renderização, o `Suspense` mais próximo mostra o fallback e, quando a promise resolve, o componente renderiza de novo e `use` devolve o valor. Se a promise for rejeitada, o erro vai para o Error Boundary.",
      },
      {
        pergunta: "Qual é a diferença prática entre `use(Contexto)` e `useContext(Contexto)`?",
        resposta:
          "Os dois leem o mesmo valor e re-renderizam quando ele muda. A `use` pode ser chamada de forma condicional, depois de um retorno antecipado e dentro de laços, o que as regras dos Hooks proíbem para o `useContext`.",
      },
    ],
  },
  en: {
    titulo: "use API versus useContext",
    pergunta: "What does the use API do, and how is it different from useContext?",
    porqueEsteMetodo:
      "`use` behaves one way with a promise and another with a context, and what happens to the promise (suspend, show the fallback, start over, fail) only becomes clear when you follow one call from start to finish, including the path where the promise is rejected.",
    resposta30s:
      "`use` is a React API that **reads a value during rendering**: the result of a **promise** or the value of a **context**. If the promise is still pending, the component **suspends**: the nearest `Suspense` shows its fallback and React renders again when the promise resolves; if it is rejected, the error goes to the **Error Boundary**. With a context, `use` reads the same value as `useContext`, but it can be called **inside `if` and loops**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One promise, from the component to content on screen",
        etapas: [
          "A component calls `use(promise)` during rendering and the promise is still pending",
          "`use` returns nothing: the component **suspends** and React abandons that render attempt, without showing anything half-built",
          "The nearest `Suspense` above it in the tree shows its `fallback`; everything outside that boundary carries on as normal",
          "The promise resolves and React schedules a new render of the suspended component, which starts again from the top of the function",
          "This time `use(promise)` finds the result ready and returns it at once; the component finishes rendering and the content replaces the fallback",
        ],
        nota: "The same promise (the same reference) has to show up in both passes: that is how React recognizes that the result has arrived. Where to create the promise and how to store it varies between frameworks and versions: check react.dev.",
      },
      {
        tipo: "codigo",
        titulo: "A stable promise and a Suspense above it",
        legenda: "TSX",
        codigo: [
          'import { Suspense, use } from "react";',
          "",
          "const cache = new Map<number, Promise<{ name: string }>>();",
          "",
          "function fetchUser(id: number) {",
          "  if (!cache.has(id)) cache.set(id, fetch(`/api/users/${id}`).then((r) => r.json()));",
          "  return cache.get(id)!; // the same promise on every render",
          "}",
          "",
          "function Profile({ promise }: { promise: Promise<{ name: string }> }) {",
          "  const user = use(promise); // suspends while it is pending",
          "  return <h1>{user.name}</h1>;",
          "}",
          "",
          "export function Page({ id }: { id: number }) {",
          "  return (",
          "    <Suspense fallback={<p>Loading…</p>}>",
          "      <Profile promise={fetchUser(id)} />",
          "    </Suspense>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`Profile` only reaches its `return` with the data ready: no `useEffect` and no loading state. This simple cache is never invalidated; in a real app, use your framework’s cache or a data library.",
      },
      {
        tipo: "passos",
        titulo: "The path where it goes wrong",
        passos: [
          {
            titulo: "The promise is rejected",
            texto:
              "`use` throws the rejection reason during the component’s render, and React looks for the nearest **Error Boundary** (see S34 and M21), which shows its error fallback. A `try/catch` around `use` does not work, because the call is not allowed there: handle the error with an Error Boundary or with `.catch()` on the promise, returning a fallback value.",
          },
          {
            titulo: "The boundary is missing",
            texto:
              "Without a `Suspense` above the component there is nowhere to show the loading state. Put the boundary where the interface makes sense: a single one around the whole page hides more than necessary.",
          },
          {
            titulo: "The promise is born on every render",
            texto:
              "If the component runs `use(fetch(...))` in its own body, every new attempt creates another promise, which is never ready when React comes back. React warns in the console and the screen can keep suspending forever. Create the promise outside rendering: in a Server Component that passes it down as a prop, in a cache, or in a library that supports Suspense.",
          },
          {
            titulo: "Navigation and the fallback",
            texto:
              "When `id` changes, the new promise suspends again and the fallback comes back. If you would rather keep the old screen while the new one loads, mark the update as a transition (`useTransition` or `startTransition`).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Reading a context after an early return",
        legenda: "TSX",
        codigo: [
          'import { createContext, use } from "react";',
          "",
          'const ThemeContext = createContext({ accent: "blue" });',
          "",
          "function Button({ highlighted }: { highlighted: boolean }) {",
          "  if (!highlighted) return <button>Save</button>; // early return",
          "",
          "  // with useContext, this would break the Rules of Hooks",
          "  const theme = use(ThemeContext);",
          "  return <button className={theme.accent}>Save</button>;",
          "}",
        ].join("\n"),
        nota: "When the context value changes, a component that read it with `use` renders again, just like one that used `useContext`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "use or useContext?",
        texto:
          "`useContext(Context)` is a Hook: it can only be called at the top of the component, before any `return`. `use(Context)` reads the same value, subscribes to the same context, and can appear after an early return, inside `if` and inside loops. But `use` also only runs **during the render** of a component or a Hook, never in event handlers or effects. What `use` adds is that it accepts a promise. In Server Components, prefer `async`/`await`; `use` shines when a client component reads a promise created on the server. Rules and availability vary by version: check react.dev.",
      },
    ],
    armadilhas: [
      "Creating the promise in the component body (`use(fetch(...))`): every render creates another one and the component never finishes loading.",
      "Wrapping `use` in `try/catch`: the call is not allowed there. Use an Error Boundary or `.catch()` on the promise.",
      "Forgetting the `Suspense` (or the Error Boundary) above: without them there is no fallback or error screen designed for the user.",
      "Treating `use` as an ordinary Hook that works anywhere: it only runs during rendering, never in event handlers or effects.",
    ],
    autoteste: [
      {
        pergunta: "What happens when a component calls `use(promise)` and the promise is still pending?",
        resposta:
          "The component suspends: React abandons the render, the nearest `Suspense` shows its fallback and, when the promise resolves, the component renders again and `use` returns the value. If the promise is rejected, the error goes to the Error Boundary.",
      },
      {
        pergunta: "What is the practical difference between `use(Context)` and `useContext(Context)`?",
        resposta:
          "Both read the same value and re-render when it changes. `use` can be called conditionally, after an early return and inside loops, which the Rules of Hooks forbid for `useContext`.",
      },
    ],
  },
};
