import type { Pergunta } from "../../tipos";

// L69 · Como funciona a limpeza do efeito
export const l069: Pergunta = {
  numero: 69,
  modulo: "linkedin-regras-e-effects",
  metodo: "trace",
  pt: {
    titulo: "Como funciona a limpeza do efeito",
    pergunta: "Como funciona a função de limpeza (cleanup) no useEffect()?",
    porqueEsteMetodo:
      "A limpeza só faz sentido no tempo: ela roda antes da próxima execução e na saída do componente. Seguir um efeito do início ao fim, inclusive o caso em que a limpeza falta, mostra quando ela dispara e o que ela enxerga.",
    resposta30s:
      "A função de limpeza é a que o efeito **devolve** (`return () => { ... }`). O React a chama **antes de executar o efeito de novo**, quando as dependências mudaram, e **quando o componente é desmontado**, para desfazer o que o efeito fez: remover listeners, limpar timers, cancelar assinaturas e fechar conexões. Sem ela há vazamentos e duplicação, e o **Strict Mode**, em desenvolvimento, roda um ciclo extra para expor justamente essa falta.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A vida de um efeito que depende de `sala`",
        etapas: [
          "**Montagem** com `sala = “a”`: o componente renderiza, o React atualiza a tela e executa o efeito, que abre a conexão com “a”. A função de limpeza devolvida fica guardada",
          "**Atualização**: `sala` passa a “b”. O componente renderiza de novo e a tela é atualizada, mas o efeito novo ainda não rodou",
          "O React chama a **limpeza do efeito anterior**, que ainda enxerga `sala = “a”` (os valores da renderização em que nasceu) e fecha a conexão com “a”",
          "Só então o React executa o **efeito da renderização nova**, que abre a conexão com “b” e devolve a sua própria limpeza",
          "**Desmontagem**: o componente sai da árvore e o React chama a limpeza da última execução (`sala = “b”`), fechando a conexão com “b”",
        ],
        nota: "Se uma renderização não muda nenhuma dependência, não há limpeza nem nova execução. Sem array de dependências, o par limpeza e execução acontece a cada renderização.",
      },
      {
        tipo: "codigo",
        titulo: "Relógio com limpeza",
        legenda: "JSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "",
          "function Relogio({ intervalo }) {",
          "  const [agora, setAgora] = useState(() => new Date());",
          "",
          "  useEffect(() => {",
          "    const id = setInterval(() => setAgora(new Date()), intervalo);",
          "    return () => clearInterval(id); // limpeza: enxerga o `id` desta execução",
          "  }, [intervalo]);",
          "",
          "  return <time>{agora.toLocaleTimeString()}</time>;",
          "}",
        ].join("\n"),
        nota: "Se `intervalo` mudar, o React chama o `clearInterval` do timer antigo e só depois cria o novo. Ao desmontar, o último timer também é limpo.",
      },
      {
        tipo: "passos",
        titulo: "O caminho em que a limpeza falta",
        passos: [
          {
            titulo: "O efeito não desfaz nada",
            texto:
              "Sem limpeza, cada execução do efeito soma um `addEventListener`, um `setInterval` ou uma conexão nova, e nada remove os anteriores.",
          },
          {
            titulo: "Os resíduos se acumulam",
            texto:
              "Os handlers antigos continuam rodando e mantendo na memória os componentes e os dados que capturaram (**vazamento de memória**), ações acontecem em duplicata e respostas de requisições antigas ainda gravam state.",
          },
          {
            titulo: "O Strict Mode denuncia",
            texto:
              "Em desenvolvimento, o React monta o componente, simula uma desmontagem e monta de novo: executa o efeito, a limpeza e o efeito outra vez. Se aparecem dois listeners ou duas conexões, a limpeza não desfaz tudo o que o efeito fez.",
          },
          {
            titulo: "O conserto",
            texto:
              "Escreva efeito e limpeza como um par simétrico: o que a execução abre, a limpeza fecha, com a mesma referência (`removeEventListener` com a mesma função, `clearInterval(id)`, `unsubscribe()`, `conexao.close()`, `controle.abort()`). Montar, limpar e montar de novo deve deixar o mesmo estado.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "O que precisa de limpeza",
        texto:
          "Tudo o que o efeito **abre ou assina** e que continua vivo depois dele: listeners em `window` ou `document`, `setInterval` e `setTimeout`, assinaturas (stores, WebSockets, observers), conexões e requisições em andamento (veja L70). Em geral não precisam: efeitos que só calculam algo ou que apenas atualizam um valor que a próxima execução sobrescreve, como o título do documento.",
      },
    ],
    armadilhas: [
      "Achar que a limpeza roda só na desmontagem: ela também roda antes de cada nova execução do efeito.",
      "Achar que a limpeza enxerga os valores mais novos: ela usa os da renderização em que o efeito nasceu, e é isso que permite fechar a conexão certa.",
      "Remover um listener com outra função: `removeEventListener` precisa da mesma referência passada a `addEventListener`.",
      "Esconder o “efeito duplicado” do Strict Mode (por exemplo, com uma flag para só executar uma vez) em vez de escrever a limpeza que falta.",
    ],
    autoteste: [
      {
        pergunta: "Quando exatamente o React chama a função de limpeza?",
        resposta:
          "Antes de executar o efeito de novo, quando uma dependência mudou, e quando o componente é desmontado. Na primeira execução não há limpeza anterior para chamar.",
      },
      {
        pergunta: "Por que o Strict Mode executa efeito, limpeza e efeito de novo em desenvolvimento?",
        resposta:
          "Para simular um componente que sai e volta e assim expor efeitos sem limpeza simétrica (listeners duplicados, conexões abertas). Se o ciclo extra causa problema, falta limpeza, e o conserto é escrevê-la.",
      },
    ],
  },
  en: {
    titulo: "How effect cleanup works",
    pergunta: "How does the cleanup function in useEffect() work?",
    porqueEsteMetodo:
      "Cleanup only makes sense over time: it runs before the next run and when the component leaves. Following one effect from start to finish, including the case where the cleanup is missing, shows when it fires and what it sees.",
    resposta30s:
      "The cleanup function is the one the effect **returns** (`return () => { ... }`). React calls it **before running the effect again**, when the dependencies changed, and **when the component unmounts**, to undo what the effect did: remove listeners, clear timers, cancel subscriptions and close connections. Without it you get leaks and duplication, and **Strict Mode**, in development, runs an extra cycle to expose exactly that omission.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The life of an effect that depends on `room`",
        etapas: [
          "**Mount** with `room = “a”`: the component renders, React updates the screen and runs the effect, which opens the connection to “a”. The returned cleanup function is stored",
          "**Update**: `room` becomes “b”. The component renders again and the screen is updated, but the new effect has not run yet",
          "React calls the **previous effect’s cleanup**, which still sees `room = “a”` (the values from the render it was born in) and closes the connection to “a”",
          "Only then does React run the **new render’s effect**, which opens the connection to “b” and returns its own cleanup",
          "**Unmount**: the component leaves the tree and React calls the cleanup from the last run (`room = “b”`), closing the connection to “b”",
        ],
        nota: "If a render changes no dependency, there is no cleanup and no new run. With no dependency array, the cleanup-and-run pair happens on every render.",
      },
      {
        tipo: "codigo",
        titulo: "A clock with cleanup",
        legenda: "JSX",
        codigo: [
          'import { useEffect, useState } from "react";',
          "",
          "function Clock({ interval }) {",
          "  const [now, setNow] = useState(() => new Date());",
          "",
          "  useEffect(() => {",
          "    const id = setInterval(() => setNow(new Date()), interval);",
          "    return () => clearInterval(id); // cleanup: sees the `id` from this run",
          "  }, [interval]);",
          "",
          "  return <time>{now.toLocaleTimeString()}</time>;",
          "}",
        ].join("\n"),
        nota: "If `interval` changes, React calls `clearInterval` on the old timer and only then creates the new one. On unmount, the last timer is cleared too.",
      },
      {
        tipo: "passos",
        titulo: "The path where the cleanup is missing",
        passos: [
          {
            titulo: "The effect undoes nothing",
            texto:
              "Without cleanup, every run of the effect adds another `addEventListener`, `setInterval` or connection, and nothing removes the earlier ones.",
          },
          {
            titulo: "Leftovers pile up",
            texto:
              "Old handlers keep running and keep the components and data they captured in memory (a **memory leak**), actions happen twice and responses from old requests still write state.",
          },
          {
            titulo: "Strict Mode reports it",
            texto:
              "In development, React mounts the component, simulates an unmount and mounts it again: it runs the effect, the cleanup and the effect once more. If two listeners or two connections show up, the cleanup does not undo everything the effect did.",
          },
          {
            titulo: "The fix",
            texto:
              "Write effect and cleanup as a symmetric pair: whatever the run opens, the cleanup closes, using the same reference (`removeEventListener` with the same function, `clearInterval(id)`, `unsubscribe()`, `connection.close()`, `controller.abort()`). Mounting, cleaning up and mounting again should leave the same state.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "What needs cleanup",
        texto:
          "Anything the effect **opens or subscribes to** that stays alive after it: listeners on `window` or `document`, `setInterval` and `setTimeout`, subscriptions (stores, WebSockets, observers), connections and in-flight requests (see L70). Usually not needed: effects that only compute something or that merely set a value the next run overwrites, such as the document title.",
      },
    ],
    armadilhas: [
      "Thinking cleanup runs only on unmount: it also runs before every new run of the effect.",
      "Thinking cleanup sees the newest values: it uses the ones from the render the effect was born in, which is what lets it close the right connection.",
      "Removing a listener with a different function: `removeEventListener` needs the same reference passed to `addEventListener`.",
      "Hiding Strict Mode’s “duplicate effect” (for example with a flag to run only once) instead of writing the missing cleanup.",
    ],
    autoteste: [
      {
        pergunta: "When exactly does React call the cleanup function?",
        resposta:
          "Before running the effect again, when a dependency changed, and when the component unmounts. On the first run there is no earlier cleanup to call.",
      },
      {
        pergunta: "Why does Strict Mode run effect, cleanup and effect again in development?",
        resposta:
          "To simulate a component that leaves and comes back, exposing effects without a symmetric cleanup (duplicate listeners, open connections). If the extra cycle causes trouble, a cleanup is missing, and the fix is to write it.",
      },
    ],
  },
};
