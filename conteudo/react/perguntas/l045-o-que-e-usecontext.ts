import type { Pergunta } from "../../tipos";

// L45 · O que é useContext
export const l045: Pergunta = {
  numero: 45,
  modulo: "linkedin-hooks",
  metodo: "feynman",
  pt: {
    titulo: "O que é useContext",
    pergunta: "O que é useContext()?",
    porqueEsteMetodo:
      "O contexto resolve um problema cotidiano (levar um dado a componentes fundos na árvore) que se entende melhor com uma imagem física: um quadro de avisos que todos consultam. Depois vêm o mecanismo real e o ponto em que a imagem para de valer.",
    resposta30s:
      "`useContext` lê o valor de um **contexto**, um jeito de disponibilizar um dado (tema, usuário, idioma) a todos os componentes abaixo de um **provedor**, sem passá-lo por props em cada nível. Você cria o contexto com `createContext`, fornece o valor com o provedor e lê com `useContext`; sem provedor acima, vale o valor padrão. Quando o valor muda, todo componente que o lê **renderiza de novo**, e por isso o contexto serve para dados que mudam pouco.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um prédio de escritórios com um **quadro de avisos** no corredor. Sem ele, um aviso (o novo horário de funcionamento) teria de ser entregue de mão em mão, andar por andar, passando por gente que nem se interessa. Com o quadro, quem tem o aviso o prende ali uma vez, e qualquer pessoa daquele andar para baixo pode ir olhar quando quiser. Se ninguém afixou nada, vale o aviso-padrão da portaria. E quando o aviso é trocado, quem estava lendo o quadro precisa reler.",
        tecnico:
          "`createContext(valorPadrao)` cria o quadro. O **provedor** (`<TemaContext.Provider value={...}>`; versões recentes aceitam usar o próprio contexto como provedor) afixa o valor para a subárvore abaixo dele. Qualquer componente dessa subárvore lê o valor do provedor **mais próximo acima** com `useContext(TemaContext)`, sem receber props nos níveis do meio. Sem provedor acima, vale o valor padrão. Quando o `value` muda (comparado com `Object.is`), **todo componente que lê aquele contexto** renderiza de novo. O contexto só transporta: o state em si vive em `useState` ou `useReducer` no componente do provedor.",
        limite:
          "O quadro não é um painel de controle. Ele não guarda nem gerencia nada sozinho, só entrega, e **avisa todo mundo** que olha para ele quando o conteúdo muda, mesmo quem só queria ler uma parte. Para dados que mudam o tempo todo, ou muito espalhados, ele pode gerar renderizações demais.",
      },
      {
        tipo: "tabela",
        titulo: "Quando faz sentido usar contexto",
        colunas: ["Dado", "Bom para contexto?", "Motivo"],
        linhas: [
          ["Tema (claro ou escuro)", "Sim", "Muda raramente e é lido em muitos lugares"],
          ["Usuário logado e permissões", "Sim", "Usado por componentes em vários níveis e muda pouco"],
          ["Idioma e formato de datas", "Sim", "Configuração global da interface"],
          [
            "Valor que muda a cada tecla ou a cada segundo",
            "Em geral não",
            "Todos os leitores renderizam a cada mudança; prefira state local ou uma biblioteca com seletores",
          ],
          [
            "Dados do servidor (listas, cache)",
            "Em geral não",
            "Uma biblioteca de dados cuida de cache, atualização e erros",
          ],
          ["Dado usado só um ou dois níveis abaixo", "Não", "Props bastam; ou passe o conteúdo como `children`"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Criar, fornecer e ler um contexto",
        legenda: "JSX",
        codigo: `import { createContext, useContext, useMemo, useState } from "react";

const TemaContext = createContext({ tema: "claro", setTema: () => {} }); // padrão: sem provedor

export function ProvedorDeTema({ children }) {
  const [tema, setTema] = useState("claro");
  const valor = useMemo(() => ({ tema, setTema }), [tema]); // identidade estável entre renders
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function BotaoDeTema() {
  const { tema, setTema } = useContext(TemaContext); // lê o provedor mais próximo acima
  return (
    <button onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>Tema: {tema}</button>
  );
}`,
        nota: "Só o `ProvedorDeTema` guarda o state; o contexto apenas o transporta. Os componentes entre o provedor e o botão não precisam saber que o tema existe.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O contexto transporta; não gerencia",
        texto:
          "A Context API resolve o **prop drilling**: passar props por componentes que só as repassam. O estado continua em `useState` ou `useReducer` no provedor, e um contexto com um reducer cobre um estado compartilhado leve (veja L46). Para ler contexto, `useContext` é a forma tradicional; as versões recentes trazem também a API `use`, que lê contexto (inclusive em condições). Confira a documentação mais recente em react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Um contexto para tudo que muda",
        texto:
          "Se o `value` reúne itens que mudam em momentos diferentes (usuário, tema, carrinho, notificações), qualquer mudança em um deles renderiza todos os leitores. Separe em contextos menores (por exemplo, um para os dados e outro para as funções que os alteram), memoize o `value` quando for um objeto criado no próprio JSX e, se ainda for demais, considere uma biblioteca de estado com seletores. Lembre que `value={{ a, b }}` cria um objeto novo a cada render do provedor.",
      },
    ],
    armadilhas: [
      "Usar contexto como substituto de qualquer state global: ele só transporta; quem guarda o state é o provedor, e cada mudança renderiza todos os leitores.",
      "Passar `value={{ ... }}` direto no JSX sem memoizar: o objeto é novo a cada render do provedor, e todos os leitores renderizam de novo à toa.",
      "Esquecer o provedor: o componente lê o valor padrão do `createContext` e a falha é silenciosa.",
      "Colocar tudo num único contexto gigante, que muda por vários motivos diferentes.",
    ],
    autoteste: [
      {
        pergunta: "Que problema a Context API resolve?",
        resposta:
          "O prop drilling: passar uma prop por vários níveis de componentes que não a usam, só para chegar a um componente fundo na árvore.",
      },
      {
        pergunta: "O que acontece com um componente que usa `useContext` quando o valor do provedor muda?",
        resposta:
          "Ele renderiza de novo, mesmo que um ancestral intermediário esteja memoizado e mesmo que use só uma parte do valor.",
      },
    ],
  },
  en: {
    titulo: "What useContext is",
    pergunta: "What is useContext()?",
    porqueEsteMetodo:
      "Context solves an everyday problem (getting a piece of data to deeply nested components) that is best understood through a physical image: a notice board everyone can check. Then come the real mechanism and the point where the image stops working.",
    resposta30s:
      "`useContext` reads the value of a **context**, a way to make a piece of data (theme, user, language) available to every component below a **provider**, without passing it through props at each level. You create the context with `createContext`, supply the value with the provider and read it with `useContext`; with no provider above, the default value applies. When the value changes, every component that reads it **re-renders**, which is why context suits data that rarely changes.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine an office building with a **notice board** in the hallway. Without it, a notice (the new opening hours) would have to be handed over person to person, floor by floor, through people who do not care about it. With the board, whoever has the notice pins it up once, and anyone on that floor and below can go and read it whenever they like. If nobody pinned anything, the lobby’s default notice applies. And when the notice is replaced, those who were reading the board need to read it again.",
        tecnico:
          "`createContext(defaultValue)` creates the board. The **provider** (`<ThemeContext.Provider value={...}>`; recent versions let you use the context itself as the provider) pins the value for the subtree below it. Any component in that subtree reads the value from the **nearest provider above** with `useContext(ThemeContext)`, without receiving props in the levels in between. With no provider above, the default value applies. When `value` changes (compared with `Object.is`), **every component that reads that context** re-renders. Context only carries: the state itself lives in `useState` or `useReducer` in the provider’s component.",
        limite:
          "The board is not a control panel. It does not store or manage anything by itself, it only delivers, and it **notifies everyone** looking at it when the content changes, even those who only wanted to read a part. For data that changes all the time, or is spread widely, it can cause too many renders.",
      },
      {
        tipo: "tabela",
        titulo: "When context makes sense",
        colunas: ["Data", "Good for context?", "Why"],
        linhas: [
          ["Theme (light or dark)", "Yes", "Changes rarely and is read in many places"],
          ["Logged-in user and permissions", "Yes", "Used by components at many levels and changes little"],
          ["Language and date format", "Yes", "Global UI setting"],
          [
            "A value that changes on every keystroke or every second",
            "Usually not",
            "All readers render on every change; prefer local state or a library with selectors",
          ],
          ["Server data (lists, cache)", "Usually not", "A data library handles caching, refetching and errors"],
          ["Data used only one or two levels down", "No", "Props are enough; or pass the content as `children`"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Create, provide and read a context",
        legenda: "JSX",
        codigo: `import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "light", setTheme: () => {} }); // default: no provider

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]); // stable identity across renders
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext); // reads the nearest provider above
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Theme: {theme}</button>
  );
}`,
        nota: "Only `ThemeProvider` holds the state; the context just carries it. The components between the provider and the button do not need to know the theme exists.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Context carries; it does not manage",
        texto:
          "The Context API solves **prop drilling**: passing props through components that only forward them. The state stays in `useState` or `useReducer` in the provider, and a context with a reducer covers lightweight shared state (see L46). To read context, `useContext` is the traditional way; recent versions also bring the `use` API, which reads context (even inside conditions). Check the latest documentation at react.dev.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "One context for everything that changes",
        texto:
          "If `value` bundles items that change at different times (user, theme, cart, notifications), any change to one of them renders every reader. Split into smaller contexts (for example, one for the data and another for the functions that change it), memoize `value` when it is an object created inline in the JSX and, if that is still too much, consider a state library with selectors. Remember that `value={{ a, b }}` creates a new object on every provider render.",
      },
    ],
    armadilhas: [
      "Using context as a replacement for any global state: it only carries; the provider holds the state, and every change renders all readers.",
      "Passing `value={{ ... }}` straight in the JSX without memoizing: the object is new on every provider render, and all readers re-render for nothing.",
      "Forgetting the provider: the component reads `createContext`’s default value and the failure is silent.",
      "Putting everything in one giant context that changes for many different reasons.",
    ],
    autoteste: [
      {
        pergunta: "What problem does the Context API solve?",
        resposta:
          "Prop drilling: passing a prop through several levels of components that do not use it, just to reach a component deep in the tree.",
      },
      {
        pergunta: "What happens to a component that uses `useContext` when the provider’s value changes?",
        resposta:
          "It re-renders, even if an intermediate ancestor is memoized and even if it uses only part of the value.",
      },
    ],
  },
};
