import type { Pergunta } from "../../tipos";

// L82 · Limites da Context API
export const l082: Pergunta = {
  numero: 82,
  modulo: "linkedin-estado",
  metodo: "whys",
  pt: {
    titulo: "Limites da Context API",
    pergunta: "Quais são as limitações da Context API?",
    porqueEsteMetodo:
      "As limitações do Context parecem arbitrárias até você ver o motivo de cada uma, e as mitigações decorrem dessas causas. A cadeia de “por quês” vai de “todo consumidor re-renderiza” até a decisão de migrar.",
    resposta30s:
      "O **Context** entrega **um valor** a toda a subárvore e não tem seleção parcial: quando o valor muda, **todo componente que o consome re-renderiza**, mesmo que use só uma parte dele. Ele também não traz cache, middleware, devtools nem atualização granular, então pesa em estado que muda com frequência. Mitigue **dividindo contextos**, **memoizando o valor** e **separando leitura e escrita**, e migre para uma biblioteca de estado quando isso não bastar.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que todo consumidor re-renderiza quando o valor do provider muda?",
            resposta:
              "Porque o Context é um mecanismo de **entrega**, não de assinatura seletiva. O React compara o valor novo com o antigo (`Object.is`) e, se mudou, re-renderiza todo componente que chamou `useContext` daquele contexto. Não existe um “só me avise se o tema mudar”: um consumidor que usa apenas `tema` também re-renderiza quando outra parte do mesmo objeto muda.",
          },
          {
            pergunta: "Por que um objeto novo a cada renderização causa re-renders em cascata?",
            resposta:
              "Porque `value={{ usuario, tema }}` cria um objeto novo toda vez que o provider renderiza. Para o `Object.is` é um valor diferente, ainda que o conteúdo seja o mesmo, e todos os consumidores re-renderizam sem nenhuma mudança real. A mitigação é manter a referência estável com `useMemo`; em projetos que usam o React Compiler, ele pode memoizar isso automaticamente (confira em react.dev).",
          },
          {
            pergunta: "Por que faltam cache, middleware, devtools e atualização granular?",
            resposta:
              "Porque o Context não gerencia estado: o estado continua em `useState` ou `useReducer`, e o Context só o transporta. Não há uma camada que registre ações, aplique middleware, guarde histórico ou entregue só a fatia que mudou. Isso existe nas bibliotecas de estado, que mantêm uma store externa e assinaturas com seletores.",
          },
          {
            pergunta: "Por que o custo pesa quando o estado muda com frequência?",
            resposta:
              "Porque cada mudança re-renderiza todos os consumidores, e isso se repete a cada atualização. Um valor que muda muitas vezes por segundo (posição do mouse, texto digitado, um temporizador), multiplicado por centenas de consumidores, vira trabalho constante, e cada consumidor ainda re-renderiza a sua própria subárvore. Para dados que mudam pouco (tema, idioma, usuário logado) o custo costuma ser aceitável. Meça antes de concluir.",
          },
          {
            pergunta: "Como reduzir o custo e quando migrar?",
            resposta:
              "**Divida** os contextos por assunto e por frequência de mudança (tema separado de carrinho), **separe leitura e escrita** (um contexto para o valor, outro para as ações, que costumam ter identidade estável), **memoize** o valor e mantenha o provider perto de quem usa. Os `children` do provider não re-renderizam só porque o contexto mudou; só os consumidores. Migre para uma biblioteca de estado quando houver muitos consumidores, atualizações frequentes ou necessidade de seleção granular, devtools e middleware.",
          },
        ],
        causaRaiz:
          "O Context resolve a **entrega** do dado pela árvore, não a **assinatura seletiva**: o React só sabe que “o valor mudou”, não qual parte interessa a quem.",
      },
      {
        tipo: "codigo",
        titulo: "Contextos separados e ações estáveis",
        legenda: "JSX",
        codigo: [
          'import { createContext, useMemo, useState } from "react";',
          "",
          "export const EstadoCtx = createContext(null);",
          "export const AcoesCtx = createContext(null);",
          "",
          "export function CarrinhoProvider({ children }) {",
          "  const [itens, setItens] = useState([]);",
          "  // Ações estáveis: quem só dispara ações não re-renderiza quando `itens` muda",
          "  const acoes = useMemo(",
          "    () => ({",
          "      adicionar: (item) => setItens((atual) => [...atual, item]),",
          "      limpar: () => setItens([]),",
          "    }),",
          "    [],",
          "  );",
          "  return (",
          "    <AcoesCtx.Provider value={acoes}>",
          "      <EstadoCtx.Provider value={itens}>{children}</EstadoCtx.Provider>",
          "    </AcoesCtx.Provider>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Quem só chama `adicionar` lê `AcoesCtx`, cujo valor nunca muda, e não re-renderiza quando os itens mudam. Quem lê `EstadoCtx` re-renderiza a cada mudança de `itens`, como esperado.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "200 componentes no mesmo Context",
        texto:
          "Depende da **frequência de mudança** e do que cada componente lê. Se o valor muda raramente (tema, idioma, usuário autenticado), 200 consumidores são razoáveis. Se muda com frequência, ou se os consumidores usam fatias diferentes de um objeto grande, divida o contexto ou migre esse trecho para uma biblioteca com seletores, e confirme com o Profiler antes e depois. Lembre também que `React.memo` não impede a re-renderização causada por um contexto que o componente consome.",
      },
    ],
    armadilhas: [
      "Colocar tudo num único contexto “global”: qualquer mudança acorda todos os consumidores.",
      "Passar `value={{ ... }}` direto no provider sem memoizar, criando um valor novo a cada renderização.",
      "Usar o Context como substituto de uma store para estado que muda a cada tecla ou a cada quadro.",
      "Memoizar o consumidor com `React.memo` esperando impedir a re-renderização por contexto: o `memo` não bloqueia uma mudança vinda de `useContext`.",
    ],
    autoteste: [
      {
        pergunta:
          "Um componente lê só `tema` de um contexto cujo valor é `{ tema, usuario }`. Ele re-renderiza quando `usuario` muda?",
        resposta:
          "Sim. O React compara o valor inteiro do contexto e re-renderiza todo consumidor quando ele muda; não há seleção parcial. A solução é separar `tema` e `usuario` em contextos diferentes ou usar uma biblioteca com seletores.",
      },
      {
        pergunta: "Por que separar um contexto de estado e outro de ações ajuda?",
        resposta:
          "Porque as ações (funções de atualização) podem ter identidade estável e nunca mudar: quem só dispara ações lê o contexto de ações e não re-renderiza quando o estado muda.",
      },
    ],
  },
  en: {
    titulo: "Context API limitations",
    pergunta: "What are the limitations of Context API?",
    porqueEsteMetodo:
      "Context’s limitations look arbitrary until you see the reason behind each one, and the mitigations follow from those causes. The chain of whys runs from “every consumer re-renders” to the decision to migrate.",
    resposta30s:
      "**Context** delivers **one value** to a whole subtree and has no partial selection: when the value changes, **every component that consumes it re-renders**, even if it uses only part of it. It also brings no caching, middleware, devtools or granular updates, so it weighs on frequently changing state. Mitigate by **splitting contexts**, **memoizing the value** and **separating reads from writes**, and move to a state library when that is not enough.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does every consumer re-render when the provider’s value changes?",
            resposta:
              "Because Context is a **delivery** mechanism, not a selective subscription. React compares the new value with the old one (`Object.is`) and, if it changed, re-renders every component that called `useContext` on that context. There is no “only tell me if the theme changed”: a consumer that uses only `theme` also re-renders when another part of the same object changes.",
          },
          {
            pergunta: "Why does a new object on every render cause cascading re-renders?",
            resposta:
              "Because `value={{ user, theme }}` creates a new object every time the provider renders. To `Object.is` it is a different value even if the content is the same, and all consumers re-render with no real change. The mitigation is to keep the reference stable with `useMemo`; in projects that use the React Compiler, it may memoize this automatically (check react.dev).",
          },
          {
            pergunta: "Why are caching, middleware, devtools and granular updates missing?",
            resposta:
              "Because Context does not manage state: the state still lives in `useState` or `useReducer`, and Context only transports it. There is no layer that records actions, applies middleware, keeps history or delivers just the slice that changed. That exists in state libraries, which keep an external store and subscriptions with selectors.",
          },
          {
            pergunta: "Why does the cost weigh on frequently changing state?",
            resposta:
              "Because every change re-renders all consumers, and that repeats on every update. A value that changes many times per second (mouse position, typed text, a timer), multiplied by hundreds of consumers, becomes constant work, and each consumer also re-renders its own subtree. For data that rarely changes (theme, language, logged-in user) the cost is usually acceptable. Measure before concluding.",
          },
          {
            pergunta: "How do you reduce the cost, and when do you migrate?",
            resposta:
              "**Split** contexts by concern and by how often they change (theme apart from cart), **separate reads from writes** (one context for the value, another for the actions, which tend to have a stable identity), **memoize** the value and keep the provider close to its users. The provider’s `children` do not re-render just because the context changed; only the consumers do. Move to a state library when there are many consumers, frequent updates or a need for granular selection, devtools and middleware.",
          },
        ],
        causaRaiz:
          "Context solves **delivering** data through the tree, not **selective subscription**: React only knows that “the value changed”, not which part matters to whom.",
      },
      {
        tipo: "codigo",
        titulo: "Separate contexts and stable actions",
        legenda: "JSX",
        codigo: [
          'import { createContext, useMemo, useState } from "react";',
          "",
          "export const StateCtx = createContext(null);",
          "export const ActionsCtx = createContext(null);",
          "",
          "export function CartProvider({ children }) {",
          "  const [items, setItems] = useState([]);",
          "  // Stable actions: whoever only fires actions does not re-render when `items` changes",
          "  const actions = useMemo(",
          "    () => ({",
          "      add: (item) => setItems((current) => [...current, item]),",
          "      clear: () => setItems([]),",
          "    }),",
          "    [],",
          "  );",
          "  return (",
          "    <ActionsCtx.Provider value={actions}>",
          "      <StateCtx.Provider value={items}>{children}</StateCtx.Provider>",
          "    </ActionsCtx.Provider>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Whoever only calls `add` reads `ActionsCtx`, whose value never changes, and does not re-render when the items change. Whoever reads `StateCtx` re-renders on every change of `items`, as expected.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "200 components on the same Context",
        texto:
          "It depends on **how often the value changes** and on what each component reads. If the value rarely changes (theme, language, authenticated user), 200 consumers are reasonable. If it changes often, or if consumers use different slices of a large object, split the context or move that part to a library with selectors, and confirm with the Profiler before and after. Also remember that `React.memo` does not prevent a re-render caused by a context the component consumes.",
      },
    ],
    armadilhas: [
      "Putting everything in a single “global” context: any change wakes up every consumer.",
      "Passing `value={{ ... }}` straight into the provider without memoizing, creating a new value on every render.",
      "Using Context as a replacement for a store for state that changes on every keystroke or every frame.",
      "Wrapping the consumer in `React.memo` hoping to prevent context re-renders: `memo` does not block a change coming from `useContext`.",
    ],
    autoteste: [
      {
        pergunta:
          "A component reads only `theme` from a context whose value is `{ theme, user }`. Does it re-render when `user` changes?",
        resposta:
          "Yes. React compares the whole context value and re-renders every consumer when it changes; there is no partial selection. The fix is to split `theme` and `user` into different contexts or use a library with selectors.",
      },
      {
        pergunta: "Why does separating a state context from an actions context help?",
        resposta:
          "Because the actions (update functions) can have a stable identity and never change: whoever only fires actions reads the actions context and does not re-render when the state changes.",
      },
    ],
  },
};
