import type { Pergunta } from "../../tipos";

// C29 · Novidades do React 19
export const c029: Pergunta = {
  numero: 529,
  modulo: "coddy-avancado",
  metodo: "compare",
  pt: {
    titulo: "Novidades do React 19",
    pergunta: "O que mudou no React 19?",
    porqueEsteMetodo:
      "A pergunta pede um antes e um depois: o que era feito à mão ou com biblioteca e ganhou um caminho oficial. Uma matriz lado a lado mostra o ganho de cada novidade, e a regra de decisão diz quando migrar vale a pena.",
    resposta30s:
      "O React 19 trouxe para o núcleo o que antes exigia código repetitivo ou bibliotecas: **Actions** em formulários (`<form action={fn}>`, com `useActionState`, `useFormStatus` e `useOptimistic`), o hook **`use`** para ler promises e contexto durante a renderização, **`ref` como prop comum** (sem `forwardRef`) e **metadados do documento** (`<title>`, `<meta>`, `<link>`) em qualquer componente, além de melhorias de **hidratação** e de **mensagens de erro**. Os **Server Components** fazem parte do React, mas dependem de um framework ou bundler que os implemente. Migre pela dor que cada recurso resolve e confira react.dev para o estado atual.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Antes e depois, tema por tema",
        colunas: ["Tema", "Antes", "Agora", "Efeito prático"],
        linhas: [
          [
            "Formulários e mutações (Actions)",
            "`onSubmit` com `preventDefault` e estados de envio, erro e resultado escritos à mão em cada formulário",
            "`<form action={função}>` aceita uma função, inclusive assíncrona, executada numa transição. `useActionState` guarda o resultado e a pendência, `useFormStatus` deixa um botão filho ler o estado do formulário e `useOptimistic` mostra o resultado esperado antes da resposta. Depois de uma ação bem-sucedida, os campos não controlados são reiniciados",
            "Menos código repetitivo e menos estados paralelos (veja L126 a L129)",
          ],
          [
            "Ler dados na renderização (`use`)",
            "Promises eram lidas em `useEffect` com estado auxiliar ou por biblioteca; o contexto, só com `useContext`",
            "`use(promessa)` suspende o componente até a promise resolver (com `<Suspense>` acima e um limite de erro para as falhas) e `use(Contexto)` lê contexto. Diferente dos hooks, pode ser chamado em condições e laços",
            "Carregamento e erro passam a ser declarados na árvore; a promise precisa vir de uma fonte estável, não ser recriada a cada renderização",
          ],
          [
            "Refs",
            "`forwardRef` para o componente receber `ref`",
            "`ref` é prop comum em componentes de função. `forwardRef` ainda funciona, mas deixou de ser necessário, e refs de callback podem devolver uma função de limpeza",
            "Componentes de biblioteca e de design system mais simples",
          ],
          [
            "Metadados e recursos do documento",
            "Biblioteca de `<head>` ou `useEffect` alterando `document.title`",
            "`<title>`, `<meta>` e `<link>` renderizados em qualquer componente vão para o `<head>`. Folhas de estilo e scripts assíncronos ganham controle de ordem e carregamento, e há funções para pré-carregar recursos",
            "Título e metadados por tela sem biblioteca extra, inclusive na renderização no servidor",
          ],
          [
            "Hidratação e erros",
            "Erros de hidratação com mensagens vagas e repetidas; scripts de terceiros e extensões do navegador no `<head>` atrapalhavam",
            "Mensagem única com a diferença encontrada, mais tolerância a tags inseridas por terceiros e opções na raiz (`onCaughtError`, `onUncaughtError`, `onRecoverableError`) para registrar os erros",
            "Depuração mais rápida e menos hidratação quebrada por causa externa",
          ],
          [
            "Server Components e Server Functions",
            "Disponíveis só em versões de teste, por meio de frameworks",
            "Fazem parte do React, mas quem fornece roteamento, bundler e servidor é um framework (como o Next.js). As diretivas `'use client'` e `'use server'` marcam as fronteiras",
            "Menos JavaScript no navegador e dados lidos no servidor (veja L134 a L136)",
          ],
          [
            "Pequenas simplificações",
            "`<Contexto.Provider value={...}>`, suporte parcial a Web Components e `useDeferredValue` sem valor inicial",
            "`<Contexto value={...}>` direto como provedor, suporte completo a elementos personalizados e `useDeferredValue` com valor inicial",
            "Menos cerimônia no dia a dia",
          ],
          [
            "Versões seguintes da linha 19",
            "Não existiam",
            "`<Activity>` esconde e mostra parte da interface preservando o estado, `useEffectEvent` separa a parte “evento” de dentro de um efeito, e há `cacheSignal` e pré-renderização parcial voltados a frameworks e Server Components",
            "Confira o blog de react.dev para saber o que é estável (veja L130 e L131)",
          ],
        ],
        nota: "Sem números de versão de propósito: a lista muda a cada lançamento. A fonte de verdade é react.dev (guia de atualização e blog).",
      },
      {
        tipo: "codigo",
        titulo: "Três novidades em poucas linhas",
        legenda: "TSX",
        codigo: `import { use, useActionState, type ComponentProps } from "react";

// ref é prop comum: sem forwardRef
const Campo = ({ ref, ...props }: ComponentProps<"input">) => <input ref={ref} {...props} />;

// use lê a promise na renderização (com <Suspense> acima)
const Titulo = ({ promessa }: { promessa: Promise<string> }) => <h1>{use(promessa)}</h1>;

// Action com resultado e pendência
function Inscricao({ salvar }: { salvar: (email: string) => Promise<string> }) {
  const [msg, acao, pendente] = useActionState(
    async (_: string, dados: FormData) => salvar(String(dados.get("email"))),
    "",
  );
  return (
    <form action={acao}>
      <Campo name="email" type="email" required />
      <button disabled={pendente}>Inscrever</button>
      <p>{msg}</p>
    </form>
  );
}`,
        nota: "São trechos independentes. A função da Action recebe o resultado anterior e o `FormData`, e o React cuida da transição e da pendência.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra para migrar",
        texto:
          "Migre pela dor, não pela novidade. **1)** Atualize o pacote pelo guia oficial, rode os codemods e troque as bibliotecas que dependem de APIs removidas (APIs antigas já descontinuadas saíram, como `ReactDOM.render` e `propTypes` e `defaultProps` em componentes de função). **2)** Adote cada recurso onde ele apaga código ou bug real: Actions onde há formulário com estado de envio, `use` com Suspense onde o carregamento é manual, ref como prop ao mexer num `forwardRef`. **3)** Server Components só se o seu framework os oferece e a equipe quer mudar o modelo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que é do núcleo e o que é do framework",
        texto:
          "Actions, `use`, `ref` como prop e metadados são do **núcleo** e funcionam num app só de cliente (com Vite, por exemplo). Server Components, Server Functions, roteamento, cache de dados e pré-renderização dependem do **framework ou bundler**: instalar o React 19 não os liga sozinho. O React Compiler é uma ferramenta de build separada, que não vem com a atualização do pacote. Confira react.dev antes de afirmar o que é estável.",
      },
    ],
    armadilhas: [
      "Dizer que “o React 19 trouxe Server Components” como se todo app os ganhasse: sem framework ou bundler que os implemente, nada muda.",
      "Usar `use` com uma promise criada dentro do componente: ela é recriada a cada renderização e o componente suspende em laço. A promise tem de vir de fora ou de um cache.",
      "Achar que atualizar o pacote é só trocar a versão: APIs antigas foram removidas e bibliotecas mais velhas podem quebrar. Leia o guia de atualização e rode os codemods.",
      "Tratar `forwardRef` como removido ou o React Compiler como parte do React 19: o primeiro continua funcionando, e o segundo é uma ferramenta à parte.",
    ],
    autoteste: [
      {
        pergunta: "Quais novidades do React 19 reduzem o código de um formulário?",
        resposta:
          "As Actions: `<form action>` aceita uma função assíncrona, `useActionState` guarda resultado e pendência, `useFormStatus` expõe o estado do formulário a botões filhos e `useOptimistic` mostra o resultado esperado antes da resposta. Some o `ref` como prop e os metadados no componente.",
      },
      {
        pergunta: "O `use` é um hook comum? Pode ser chamado dentro de um `if`?",
        resposta:
          "Pode, e é uma diferença dele: lê uma promise ou um contexto durante a renderização e, ao contrário dos hooks, aceita condições e laços. Só funciona dentro de componente ou hook, e uma promise lida por ele precisa ser estável.",
      },
    ],
  },
  en: {
    titulo: "What changed in React 19",
    pergunta: "What changed in React 19?",
    porqueEsteMetodo:
      "The question asks for a before and an after: what used to be done by hand or with a library and got an official path. A side-by-side matrix shows what each novelty gains, and the decision rule says when migrating pays off.",
    resposta30s:
      "React 19 brought into the core what used to take repetitive code or libraries: **Actions** in forms (`<form action={fn}>`, with `useActionState`, `useFormStatus` and `useOptimistic`), the **`use`** hook to read promises and context during render, **`ref` as a plain prop** (no `forwardRef`) and **document metadata** (`<title>`, `<meta>`, `<link>`) in any component, plus better **hydration** and **error messages**. **Server Components** are part of React but depend on a framework or bundler that implements them. Migrate for the pain each feature solves and check react.dev for the current state.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Before and after, topic by topic",
        colunas: ["Topic", "Before", "Now", "Practical effect"],
        linhas: [
          [
            "Forms and mutations (Actions)",
            "`onSubmit` with `preventDefault` and submit, error and result states written by hand in every form",
            "`<form action={function}>` accepts a function, async included, run inside a transition. `useActionState` keeps the result and the pending flag, `useFormStatus` lets a child button read the form state and `useOptimistic` shows the expected result before the response. After a successful action, uncontrolled fields are reset",
            "Less boilerplate and fewer parallel states (see L126 to L129)",
          ],
          [
            "Reading data during render (`use`)",
            "Promises were read in `useEffect` with extra state or through a library; context only with `useContext`",
            "`use(promise)` suspends the component until the promise resolves (with `<Suspense>` above and an error boundary for failures) and `use(Context)` reads context. Unlike hooks, it can be called in conditions and loops",
            "Loading and error are declared in the tree; the promise must come from a stable source, not be recreated on every render",
          ],
          [
            "Refs",
            "`forwardRef` for a component to receive `ref`",
            "`ref` is a plain prop in function components. `forwardRef` still works but is no longer needed, and callback refs can return a cleanup function",
            "Simpler library and design-system components",
          ],
          [
            "Document metadata and resources",
            "A `<head>` library or `useEffect` changing `document.title`",
            "`<title>`, `<meta>` and `<link>` rendered in any component go to the `<head>`. Stylesheets and async scripts get control over order and loading, and there are functions to preload resources",
            "Title and metadata per screen with no extra library, server rendering included",
          ],
          [
            "Hydration and errors",
            "Hydration errors with vague, repeated messages; third-party scripts and browser extensions in the `<head>` got in the way",
            "A single message with the difference found, more tolerance for tags inserted by third parties and root options (`onCaughtError`, `onUncaughtError`, `onRecoverableError`) to log errors",
            "Faster debugging and less hydration broken by outside causes",
          ],
          [
            "Server Components and Server Functions",
            "Available only in test releases, through frameworks",
            "Part of React, but routing, bundler and server come from a framework (such as Next.js). The `'use client'` and `'use server'` directives mark the boundaries",
            "Less JavaScript in the browser and data read on the server (see L134 to L136)",
          ],
          [
            "Small simplifications",
            "`<Context.Provider value={...}>`, partial Web Components support and `useDeferredValue` with no initial value",
            "`<Context value={...}>` used directly as a provider, full custom element support and `useDeferredValue` with an initial value",
            "Less ceremony day to day",
          ],
          [
            "Later releases of the 19 line",
            "Did not exist",
            "`<Activity>` hides and shows part of the UI while preserving state, `useEffectEvent` splits the “event” part out of an effect, and there are `cacheSignal` and partial pre-rendering aimed at frameworks and Server Components",
            "Check the react.dev blog to see what is stable (see L130 and L131)",
          ],
        ],
        nota: "No version numbers on purpose: the list changes with every release. The source of truth is react.dev (upgrade guide and blog).",
      },
      {
        tipo: "codigo",
        titulo: "Three novelties in a few lines",
        legenda: "TSX",
        codigo: `import { use, useActionState, type ComponentProps } from "react";

// ref is a plain prop: no forwardRef
const Field = ({ ref, ...props }: ComponentProps<"input">) => <input ref={ref} {...props} />;

// use reads the promise during render (with <Suspense> above)
const Title = ({ promise }: { promise: Promise<string> }) => <h1>{use(promise)}</h1>;

// Action with result and pending flag
function Signup({ save }: { save: (email: string) => Promise<string> }) {
  const [msg, action, pending] = useActionState(
    async (_: string, data: FormData) => save(String(data.get("email"))),
    "",
  );
  return (
    <form action={action}>
      <Field name="email" type="email" required />
      <button disabled={pending}>Sign up</button>
      <p>{msg}</p>
    </form>
  );
}`,
        nota: "These are independent snippets. The Action function receives the previous result and the `FormData`, and React takes care of the transition and the pending flag.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule for migrating",
        texto:
          "Migrate for the pain, not for the novelty. **1)** Upgrade the package following the official guide, run the codemods and replace libraries that depend on removed APIs (old, already deprecated APIs are gone, such as `ReactDOM.render` and `propTypes` and `defaultProps` on function components). **2)** Adopt each feature where it deletes real code or a real bug: Actions where a form carries submit state, `use` with Suspense where loading is manual, ref as a prop when touching a `forwardRef`. **3)** Server Components only if your framework offers them and the team wants the change of model.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What belongs to the core and what to the framework",
        texto:
          "Actions, `use`, `ref` as a prop and metadata belong to the **core** and work in a client-only app (with Vite, for example). Server Components, Server Functions, routing, data caching and pre-rendering depend on the **framework or bundler**: installing React 19 does not switch them on by itself. The React Compiler is a separate build tool, not delivered with the package upgrade. Check react.dev before claiming what is stable.",
      },
    ],
    armadilhas: [
      "Saying “React 19 brought Server Components” as if every app got them: without a framework or bundler that implements them, nothing changes.",
      "Using `use` with a promise created inside the component: it is recreated on every render and the component suspends in a loop. The promise must come from outside or from a cache.",
      "Thinking an upgrade is just changing the version: old APIs were removed and older libraries may break. Read the upgrade guide and run the codemods.",
      "Treating `forwardRef` as removed, or the React Compiler as part of React 19: the first still works, and the second is a separate tool.",
    ],
    autoteste: [
      {
        pergunta: "Which React 19 novelties cut the code of a form?",
        resposta:
          "Actions: `<form action>` accepts an async function, `useActionState` keeps the result and pending flag, `useFormStatus` exposes the form state to child buttons and `useOptimistic` shows the expected result before the response. Add `ref` as a prop and metadata inside the component.",
      },
      {
        pergunta: "Is `use` an ordinary hook? Can it be called inside an `if`?",
        resposta:
          "It can, and that is one of its differences: it reads a promise or a context during render and, unlike hooks, accepts conditions and loops. It only works inside a component or hook, and a promise it reads must be stable.",
      },
    ],
  },
};
