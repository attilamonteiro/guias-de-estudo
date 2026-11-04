import type { Pergunta } from "../../tipos";

// C24 · O que é error boundary
export const c024: Pergunta = {
  numero: 524,
  modulo: "coddy-avancado",
  metodo: "playbook",
  pt: {
    titulo: "O que é error boundary",
    pergunta: "O que é um error boundary?",
    porqueEsteMetodo:
      "O error boundary é uma peça com procedimento claro: saber o que ela captura, criá-la, posicioná-la, mostrar um fallback, registrar e permitir reinício. Um playbook em passos mostra a ordem e também os limites dela.",
    resposta30s:
      "Um **error boundary** é um componente de **classe** que captura erros lançados na **renderização, nos métodos de ciclo de vida e nos construtores** dos seus filhos e mostra uma interface alternativa (**fallback**) em vez de derrubar a árvore inteira. Ele usa `static getDerivedStateFromError` para trocar para o fallback e `componentDidCatch` para registrar o erro. Não captura erros de **eventos**, de **código assíncrono**, da **renderização no servidor** nem do **próprio boundary**; para isso use `try/catch` ou bibliotecas prontas.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: proteger a interface contra erros de renderização",
        passos: [
          {
            titulo: "Defina o que proteger",
            texto:
              "Sem boundary, um erro de renderização desmonta a árvore inteira e deixa a tela em branco. Decida quais trechos podem falhar sem derrubar o resto: um widget, uma rota, um painel.",
          },
          {
            titulo: "Crie a classe",
            texto:
              "Estenda `Component`, guarde o erro no estado, implemente `static getDerivedStateFromError(erro)` (devolve o novo estado; roda na fase de render e deve ser pura) e `componentDidCatch(erro, info)` (para efeitos como registrar; recebe `info.componentStack`). O error boundary ainda exige uma classe, ou uma biblioteca que a embrulhe; confira react.dev caso isso tenha mudado.",
          },
          {
            titulo: "Escolha onde posicionar",
            texto:
              "Em camadas: um boundary no topo (ou por rota) como rede de segurança, e outros em volta de partes independentes (um gráfico, uma lista de comentários). O erro vai para o boundary **mais próximo acima** do componente que falhou; se o próprio boundary falha, o erro sobe ao seguinte.",
          },
          {
            titulo: "Mostre um fallback útil",
            texto:
              'No `render`, se há erro, devolva uma mensagem clara, com `role="alert"`, e uma saída (voltar, tentar de novo). Em produção, não exiba a mensagem técnica nem a pilha ao usuário.',
          },
          {
            titulo: "Registre o erro",
            texto:
              "No `componentDidCatch`, envie o erro e o `info.componentStack` a um serviço de monitoramento (Sentry e similares) ou ao seu log. A raiz também aceita opções de relato de erros (como `onCaughtError` e `onUncaughtError` em `createRoot`); confira react.dev.",
          },
          {
            titulo: "Ofereça reinício",
            texto:
              "Um botão que limpa o estado do boundary (`this.setState({ erro: null })`) tenta renderizar de novo. Para erros que dependem de dados, troque a `key` do boundary para remontá-lo, ou reinicie-o quando a rota mudar.",
          },
          {
            titulo: "Cubra o que o boundary não captura",
            texto:
              "Em handlers e em código assíncrono, use `try/catch` ou `.catch()`. Para que o boundary também cuide desse erro, guarde-o no estado e relance durante o render (`setErro(() => { throw e; })`), ou use uma biblioteca como `react-error-boundary`, que traz um boundary pronto e um hook para isso.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um error boundary mínimo",
        legenda: "JSX",
        codigo: `import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { erro: null };

  static getDerivedStateFromError(erro) {
    return { erro }; // o próximo render mostra o fallback
  }

  componentDidCatch(erro, info) {
    console.error(erro, info.componentStack); // registre num serviço de monitoramento
  }

  render() {
    if (!this.state.erro) return this.props.children;
    return (
      <div role="alert">
        Algo deu errado. <button onClick={() => this.setState({ erro: null })}>Tentar de novo</button>
      </div>
    );
  }
}`,
        nota: "Uso: envolva a parte arriscada, `<ErrorBoundary><Grafico /></ErrorBoundary>`, e aninhe outros boundaries onde quiser isolamento.",
      },
      {
        tipo: "tabela",
        titulo: "O que um error boundary captura",
        colunas: ["Situação", "O boundary captura?", "O que fazer"],
        linhas: [
          ["Erro lançado ao renderizar um componente filho", "Sim", "Fallback e registro"],
          ["Erro em método de ciclo de vida ou construtor de um filho", "Sim", "Fallback e registro"],
          [
            "Falha ao carregar um componente `lazy`",
            "Sim: a promise rejeitada é lançada durante a renderização",
            "Fallback com opção de tentar de novo",
          ],
          ["Handler de evento (`onClick`)", "Não", "`try/catch` dentro do handler"],
          [
            "Código assíncrono (`setTimeout`, `fetch`, promises)",
            "Não",
            "`try/catch` com `await` ou `.catch()`; relançar no render se quiser o boundary",
          ],
          ["Renderização no servidor", "Não", "Tratamento de erro do renderizador do servidor (confira react.dev)"],
          ["O próprio boundary", "Não", "Um boundary acima dele captura"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra prática",
        texto:
          "Use um boundary por **região que pode falhar de forma independente**, mais um no topo como rede de segurança. Ele protege contra erros de **renderização**; o que acontece em handlers e em código assíncrono se trata com `try/catch`. E não esconda o erro: registre-o.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Contém o dano, não corrige a causa",
        texto:
          "Um boundary só evita que a tela inteira desmonte; o bug continua lá, por isso o registro é parte do procedimento. Se o fallback também falhar, o erro sobe ao próximo boundary acima, ou derruba a árvore, se não houver nenhum. Ferramentas de desenvolvimento podem continuar mostrando uma sobreposição de erro mesmo com o erro capturado; em produção, só o fallback aparece.",
      },
    ],
    armadilhas: [
      "Esperar que o boundary capture erros em `onClick`, `setTimeout` ou `fetch`: eles acontecem fora da renderização.",
      "Colocar um único boundary no topo e achar que basta: qualquer falha troca a tela inteira pelo fallback. Use também boundaries locais.",
      "Não registrar o erro (`componentDidCatch`): o fallback aparece, mas ninguém fica sabendo do bug em produção.",
      "Fazer o fallback depender do mesmo dado ou componente que falhou: o próprio boundary falha, e o erro sobe.",
    ],
    autoteste: [
      {
        pergunta: "Que erros um error boundary captura e quais não captura?",
        resposta:
          "Captura erros lançados na renderização, nos métodos de ciclo de vida e nos construtores dos filhos. Não captura erros de eventos, de código assíncrono, da renderização no servidor nem do próprio boundary.",
      },
      {
        pergunta: "Qual é a função de `getDerivedStateFromError` e de `componentDidCatch`?",
        resposta:
          "`getDerivedStateFromError` roda na fase de render e devolve o estado que faz o boundary exibir o fallback. `componentDidCatch` roda depois, na fase de commit, e serve para efeitos como registrar o erro.",
      },
    ],
  },
  en: {
    titulo: "What an error boundary is",
    pergunta: "What is an error boundary?",
    porqueEsteMetodo:
      "An error boundary is a piece with a clear procedure: know what it catches, create it, place it, show a fallback, log and allow a restart. A step-by-step playbook shows the order and also its limits.",
    resposta30s:
      "An **error boundary** is a **class** component that catches errors thrown during **rendering, in lifecycle methods and in constructors** of its children and shows a replacement interface (a **fallback**) instead of taking down the whole tree. It uses `static getDerivedStateFromError` to switch to the fallback and `componentDidCatch` to log the error. It does not catch errors from **events**, **asynchronous code**, **server-side rendering** or the **boundary itself**; for those use `try/catch` or ready-made libraries.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: protect the interface against rendering errors",
        passos: [
          {
            titulo: "Define what to protect",
            texto:
              "Without a boundary, a rendering error unmounts the whole tree and leaves a blank screen. Decide which parts may fail without taking the rest down: a widget, a route, a panel.",
          },
          {
            titulo: "Create the class",
            texto:
              "Extend `Component`, keep the error in state, implement `static getDerivedStateFromError(error)` (returns the new state; runs in the render phase and must be pure) and `componentDidCatch(error, info)` (for effects such as logging; receives `info.componentStack`). An error boundary still requires a class, or a library that wraps one; check react.dev in case that has changed.",
          },
          {
            titulo: "Choose where to place it",
            texto:
              "In layers: one boundary at the top (or per route) as a safety net, and others around independent parts (a chart, a comment list). The error goes to the **nearest boundary above** the component that failed; if the boundary itself fails, the error goes up to the next one.",
          },
          {
            titulo: "Show a useful fallback",
            texto:
              'In `render`, if there is an error, return a clear message, with `role="alert"`, and a way out (go back, try again). In production, do not show the technical message or the stack to the user.',
          },
          {
            titulo: "Log the error",
            texto:
              "In `componentDidCatch`, send the error and `info.componentStack` to a monitoring service (Sentry and similar) or to your log. The root also accepts error-reporting options (such as `onCaughtError` and `onUncaughtError` in `createRoot`); check react.dev.",
          },
          {
            titulo: "Offer a restart",
            texto:
              "A button that clears the boundary’s state (`this.setState({ error: null })`) tries to render again. For errors that depend on data, change the boundary’s `key` to remount it, or reset it when the route changes.",
          },
          {
            titulo: "Cover what the boundary does not catch",
            texto:
              "In handlers and asynchronous code, use `try/catch` or `.catch()`. For the boundary to handle that error too, store it in state and rethrow it during render (`setError(() => { throw e; })`), or use a library such as `react-error-boundary`, which ships a ready-made boundary and a hook for this.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A minimal error boundary",
        legenda: "JSX",
        codigo: `import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error }; // the next render shows the fallback
  }

  componentDidCatch(error, info) {
    console.error(error, info.componentStack); // log to a monitoring service
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert">
        Something went wrong. <button onClick={() => this.setState({ error: null })}>Try again</button>
      </div>
    );
  }
}`,
        nota: "Usage: wrap the risky part, `<ErrorBoundary><Chart /></ErrorBoundary>`, and nest more boundaries where you want isolation.",
      },
      {
        tipo: "tabela",
        titulo: "What an error boundary catches",
        colunas: ["Situation", "Does the boundary catch it?", "What to do"],
        linhas: [
          ["Error thrown while rendering a child component", "Yes", "Fallback and logging"],
          ["Error in a child’s lifecycle method or constructor", "Yes", "Fallback and logging"],
          [
            "Failure to load a `lazy` component",
            "Yes: the rejected promise is thrown during rendering",
            "Fallback with a try-again option",
          ],
          ["Event handler (`onClick`)", "No", "`try/catch` inside the handler"],
          [
            "Asynchronous code (`setTimeout`, `fetch`, promises)",
            "No",
            "`try/catch` with `await` or `.catch()`; rethrow in render if you want the boundary",
          ],
          ["Server-side rendering", "No", "The server renderer’s own error handling (check react.dev)"],
          ["The boundary itself", "No", "A boundary above it catches the error"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule of thumb",
        texto:
          "Use one boundary per **region that can fail independently**, plus one at the top as a safety net. It protects against **rendering** errors; what happens in handlers and asynchronous code is handled with `try/catch`. And do not hide the error: log it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It contains the damage, it does not fix the cause",
        texto:
          "A boundary only keeps the whole screen from unmounting; the bug is still there, which is why logging is part of the procedure. If the fallback also fails, the error goes up to the next boundary above, or takes the tree down if there is none. Development tools may keep showing an error overlay even when the error was caught; in production, only the fallback appears.",
      },
    ],
    armadilhas: [
      "Expecting the boundary to catch errors in `onClick`, `setTimeout` or `fetch`: they happen outside rendering.",
      "Placing a single boundary at the top and thinking it is enough: any failure replaces the whole screen with the fallback. Add local boundaries too.",
      "Not logging the error (`componentDidCatch`): the fallback appears, but nobody learns about the bug in production.",
      "Making the fallback depend on the same data or component that failed: the boundary itself fails, and the error goes up.",
    ],
    autoteste: [
      {
        pergunta: "Which errors does an error boundary catch, and which does it not?",
        resposta:
          "It catches errors thrown during rendering, in lifecycle methods and in constructors of its children. It does not catch errors from events, asynchronous code, server-side rendering or the boundary itself.",
      },
      {
        pergunta: "What are `getDerivedStateFromError` and `componentDidCatch` for?",
        resposta:
          "`getDerivedStateFromError` runs in the render phase and returns the state that makes the boundary show the fallback. `componentDidCatch` runs later, in the commit phase, and is for effects such as logging the error.",
      },
    ],
  },
};
