import type { Pergunta } from "../../tipos";

// S33 · Etapas do ciclo de vida
export const s033: Pergunta = {
  numero: 633,
  modulo: "simplilearn-dom-e-ciclo",
  metodo: "trace",
  pt: {
    titulo: "Etapas do ciclo de vida",
    pergunta: "Quais são as etapas do ciclo de vida no React?",
    porqueEsteMetodo:
      "O ciclo de vida é uma sequência no tempo, e decorar a lista de métodos não ensina quando cada um roda. Seguir um componente do nascimento à saída, inclusive o caminho em que algo dá errado, deixa a ordem e o motivo de cada etapa claros.",
    resposta30s:
      "O componente passa por três fases: **montagem** (construtor, `render`, inserção no DOM e `componentDidMount`), **atualização** (novas props ou state, `render` de novo e `componentDidUpdate`) e **desmontagem** (`componentWillUnmount`). O `render()` é puro e só descreve a tela; os efeitos ficam na fase de **commit**, depois que o DOM foi atualizado. Em componentes de função, o `useEffect` cobre as três com o efeito, a lista de dependências e a função de limpeza.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A vida de um componente de classe, do nascimento à saída",
        etapas: [
          "**Montagem, renderização.** O React cria a instância (`constructor`, que define o estado inicial), chama `static getDerivedStateFromProps` (raramente usado) e `render()`, que devolve a descrição da tela. Nada de efeitos aqui: essa fase deve ser pura",
          "**Montagem, commit.** O React insere os nós no DOM e liga as `ref`",
          "**`componentDidMount()`** roda uma vez, depois do primeiro commit: é o lugar de buscar dados, assinar eventos e iniciar timers",
          "**Atualização.** Novas props, `setState` ou `forceUpdate` provocam uma nova renderização: `getDerivedStateFromProps`, `shouldComponentUpdate` (que pode abortar) e `render()` de novo, e o React calcula a diferença",
          "**Atualização, commit.** Antes de gravar no DOM, `getSnapshotBeforeUpdate()` pode ler o DOM (a posição de rolagem, por exemplo); o React aplica o mínimo e chama `componentDidUpdate(propsAnteriores, estadoAnterior)`",
          "**Desmontagem.** Antes de retirar os nós, `componentWillUnmount()` roda uma vez: cancele timers, assinaturas e requisições",
          "**Se algo dá errado:** um erro lançado durante a renderização de um filho sobe até o error boundary mais próximo, que usa `getDerivedStateFromError` e `componentDidCatch` para mostrar um plano B e registrar o erro",
        ],
        nota: "São duas fases: a renderização (pura, que pode ser pausada, repetida ou descartada) e o commit (o DOM já mudou, e só aqui entram os efeitos). Veja L28. Os antigos `componentWillMount`, `componentWillReceiveProps` e `componentWillUpdate` são legados (hoje com o prefixo `UNSAFE_`): não os use em código novo.",
      },
      {
        tipo: "tabela",
        titulo: "Classe e função, lado a lado",
        colunas: ["Fase", "Componente de classe", "Componente de função", "Observação"],
        linhas: [
          [
            "Renderização",
            "`render()` (e `constructor` para o estado inicial)",
            "O corpo da própria função e `useState`",
            "Nos dois deve ser puro: só calcula a descrição da tela",
          ],
          [
            "Montagem",
            "`componentDidMount`",
            "`useEffect(() => { ... }, [])`",
            "Roda depois do commit, uma vez por montagem",
          ],
          [
            "Atualização",
            "`shouldComponentUpdate`, `getSnapshotBeforeUpdate`, `componentDidUpdate`",
            "Nova chamada da função; `memo` no lugar de `shouldComponentUpdate`; `useEffect(fn, [deps])`; `useLayoutEffect` para ler o DOM antes da pintura",
            "O efeito com dependências também roda na montagem; o `componentDidUpdate` não roda no primeiro render",
          ],
          [
            "Desmontagem",
            "`componentWillUnmount`",
            "A função de limpeza devolvida pelo efeito",
            "A limpeza roda também antes de cada reexecução do efeito, e não só ao sair",
          ],
          [
            "Erros",
            "`getDerivedStateFromError` e `componentDidCatch`",
            "Não há hook equivalente",
            "O error boundary continua sendo um componente de classe, ou vem de uma biblioteca",
          ],
          [
            "Legado",
            "`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`",
            "Não há equivalente",
            "Descontinuados (hoje com `UNSAFE_`); não use em código novo",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "As três fases num componente de classe",
        legenda: "JSX",
        codigo: `class Relogio extends React.Component {
  state = { agora: new Date() };

  componentDidMount() {
    // montagem: depois do primeiro commit, uma vez
    this.id = setInterval(() => this.setState({ agora: new Date() }), 1000);
  }
  componentDidUpdate(anteriores) {
    // atualização: depois de cada commit, menos o primeiro
    if (anteriores.titulo !== this.props.titulo) document.title = this.props.titulo;
  }
  componentWillUnmount() {
    // desmontagem: desfaça o que a montagem criou
    clearInterval(this.id);
  }
  render() {
    return <p>{this.props.titulo}: {this.state.agora.toLocaleTimeString()}</p>;
  }
}`,
        nota: "O `componentDidUpdate` compara com as props anteriores antes de agir. Sem essa condição, qualquer `setState` dentro dele provoca um laço.",
      },
      {
        tipo: "codigo",
        titulo: "O equivalente com useEffect",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function Relogio({ titulo }) {
  const [agora, setAgora] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(id); // limpeza: antes de refazer o efeito e ao desmontar
  }, []); // [] = sincroniza uma vez por montagem

  useEffect(() => {
    document.title = titulo;
  }, [titulo]); // roda na montagem e sempre que titulo muda

  return <p>{titulo}: {agora.toLocaleTimeString()}</p>;
}`,
        nota: "Em vez de pensar em fases, pense em sincronização: cada efeito descreve o que manter em acordo com as props e o state, e a limpeza desfaz o que ele fez (veja L44).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Efeito não é método de ciclo de vida, e roda duas vezes em desenvolvimento",
        texto:
          "No `<StrictMode>`, em desenvolvimento, o React monta, desmonta e monta de novo o componente (e renderiza duas vezes) para revelar efeitos sem limpeza; em produção isso não acontece. Se o seu efeito quebra na segunda execução, falta a limpeza (veja C22). O detalhe muda com as versões, então confira react.dev.",
      },
    ],
    armadilhas: [
      "Fazer efeito colateral dentro do `render()` (buscar dados, chamar `setState`, mexer no DOM): a renderização pode ser repetida ou descartada, e o efeito rodaria à toa. O `render` é puro, e os efeitos vão para o commit.",
      "Chamar `setState` no `componentDidUpdate` sem comparar com as props ou o state anteriores: laço infinito de atualizações.",
      "Ler `useEffect` como um `componentDidMount` com outro nome: `useEffect(fn, [deps])` também roda na montagem, e a limpeza roda antes de cada reexecução, e não só ao desmontar.",
      "Estranhar o efeito rodando duas vezes em desenvolvimento, em vez de conferir a limpeza: é o Strict Mode apontando um timer ou uma assinatura que ninguém desfaz.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `componentDidMount` e `componentDidUpdate`?",
        resposta:
          "O `componentDidMount` roda uma vez, depois da primeira inserção no DOM: serve para buscar dados e assinar eventos. O `componentDidUpdate` roda depois de cada atualização (e não no primeiro render) e recebe as props e o state anteriores para você comparar antes de agir.",
      },
      {
        pergunta: "Por que o `render()` não deve ter efeitos colaterais?",
        resposta:
          "Porque o React pode chamá-lo mais de uma vez, pausá-lo ou descartar o resultado (renderização concorrente, Strict Mode). Um efeito ali se repetiria ou vazaria. Os efeitos vão para o commit: `componentDidMount`, `componentDidUpdate` ou `useEffect`.",
      },
    ],
  },
  en: {
    titulo: "Lifecycle steps",
    pergunta: "What are the lifecycle steps in React?",
    porqueEsteMetodo:
      "The lifecycle is a sequence in time, and memorizing the list of methods does not teach when each one runs. Following a component from birth to exit, including the path where something goes wrong, makes the order and the reason for each step clear.",
    resposta30s:
      "A component goes through three phases: **mounting** (constructor, `render`, insertion into the DOM and `componentDidMount`), **updating** (new props or state, `render` again and `componentDidUpdate`) and **unmounting** (`componentWillUnmount`). `render()` is pure and only describes the screen; effects live in the **commit** phase, after the DOM has been updated. In function components, `useEffect` covers all three with the effect, the dependency list and the cleanup function.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The life of a class component, from birth to exit",
        etapas: [
          "**Mounting, render.** React creates the instance (`constructor`, which sets the initial state), calls `static getDerivedStateFromProps` (rarely used) and `render()`, which returns the description of the screen. No effects here: this phase must be pure",
          "**Mounting, commit.** React inserts the nodes into the DOM and attaches the `ref`s",
          "**`componentDidMount()`** runs once, after the first commit: this is the place to fetch data, subscribe to events and start timers",
          "**Updating.** New props, `setState` or `forceUpdate` trigger a new render: `getDerivedStateFromProps`, `shouldComponentUpdate` (which can abort) and `render()` again, and React works out the difference",
          "**Updating, commit.** Before writing to the DOM, `getSnapshotBeforeUpdate()` can read the DOM (the scroll position, for example); React applies the minimum and calls `componentDidUpdate(prevProps, prevState)`",
          "**Unmounting.** Before removing the nodes, `componentWillUnmount()` runs once: cancel timers, subscriptions and requests",
          "**If something goes wrong:** an error thrown while rendering a child bubbles up to the nearest error boundary, which uses `getDerivedStateFromError` and `componentDidCatch` to show a fallback and log the error",
        ],
        nota: "There are two phases: render (pure, may be paused, repeated or discarded) and commit (the DOM has already changed, and only here do effects belong). See L28. The old `componentWillMount`, `componentWillReceiveProps` and `componentWillUpdate` are legacy (now prefixed with `UNSAFE_`): do not use them in new code.",
      },
      {
        tipo: "tabela",
        titulo: "Class and function, side by side",
        colunas: ["Phase", "Class component", "Function component", "Note"],
        linhas: [
          [
            "Render",
            "`render()` (and `constructor` for the initial state)",
            "The function body itself and `useState`",
            "Both must be pure: they only compute the description of the screen",
          ],
          [
            "Mounting",
            "`componentDidMount`",
            "`useEffect(() => { ... }, [])`",
            "Runs after the commit, once per mount",
          ],
          [
            "Updating",
            "`shouldComponentUpdate`, `getSnapshotBeforeUpdate`, `componentDidUpdate`",
            "A new call of the function; `memo` in place of `shouldComponentUpdate`; `useEffect(fn, [deps])`; `useLayoutEffect` to read the DOM before paint",
            "An effect with dependencies also runs on mount; `componentDidUpdate` does not run on the first render",
          ],
          [
            "Unmounting",
            "`componentWillUnmount`",
            "The cleanup function returned by the effect",
            "Cleanup also runs before each re-run of the effect, not only on exit",
          ],
          [
            "Errors",
            "`getDerivedStateFromError` and `componentDidCatch`",
            "There is no equivalent hook",
            "An error boundary is still a class component, or comes from a library",
          ],
          [
            "Legacy",
            "`componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate`",
            "There is no equivalent",
            "Deprecated (now with `UNSAFE_`); do not use in new code",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The three phases in a class component",
        legenda: "JSX",
        codigo: `class Clock extends React.Component {
  state = { now: new Date() };

  componentDidMount() {
    // mounting: after the first commit, once
    this.id = setInterval(() => this.setState({ now: new Date() }), 1000);
  }
  componentDidUpdate(prev) {
    // updating: after every commit except the first
    if (prev.title !== this.props.title) document.title = this.props.title;
  }
  componentWillUnmount() {
    // unmounting: undo what mounting created
    clearInterval(this.id);
  }
  render() {
    return <p>{this.props.title}: {this.state.now.toLocaleTimeString()}</p>;
  }
}`,
        nota: "`componentDidUpdate` compares with the previous props before acting. Without that condition, any `setState` inside it causes a loop.",
      },
      {
        tipo: "codigo",
        titulo: "The equivalent with useEffect",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

function Clock({ title }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup: before redoing the effect and on unmount
  }, []); // [] = synchronizes once per mount

  useEffect(() => {
    document.title = title;
  }, [title]); // runs on mount and whenever title changes

  return <p>{title}: {now.toLocaleTimeString()}</p>;
}`,
        nota: "Instead of thinking in phases, think in synchronization: each effect describes what to keep in line with props and state, and the cleanup undoes what it did (see L44).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An effect is not a lifecycle method, and it runs twice in development",
        texto:
          "In `<StrictMode>`, in development, React mounts, unmounts and mounts the component again (and renders twice) to reveal effects without cleanup; this does not happen in production. If your effect breaks on the second run, the cleanup is missing (see C22). The details change across versions, so check react.dev.",
      },
    ],
    armadilhas: [
      "Running a side effect inside `render()` (fetching data, calling `setState`, touching the DOM): rendering can be repeated or discarded, and the effect would run for nothing. `render` is pure, and effects belong to the commit.",
      "Calling `setState` in `componentDidUpdate` without comparing with the previous props or state: an infinite loop of updates.",
      "Reading `useEffect` as `componentDidMount` under another name: `useEffect(fn, [deps])` also runs on mount, and cleanup runs before each re-run, not only on unmount.",
      "Being puzzled by the effect running twice in development, instead of checking the cleanup: it is Strict Mode pointing at a timer or subscription nobody undoes.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `componentDidMount` and `componentDidUpdate`?",
        resposta:
          "`componentDidMount` runs once, after the first insertion into the DOM: it is for fetching data and subscribing to events. `componentDidUpdate` runs after every update (and not on the first render) and receives the previous props and state so you can compare before acting.",
      },
      {
        pergunta: "Why must `render()` have no side effects?",
        resposta:
          "Because React may call it more than once, pause it or discard the result (concurrent rendering, Strict Mode). An effect there would repeat or leak. Effects go to the commit: `componentDidMount`, `componentDidUpdate` or `useEffect`.",
      },
    ],
  },
};
