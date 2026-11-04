import type { Pergunta } from "../../tipos";

// L44 · O que é useEffect
export const l044: Pergunta = {
  numero: 44,
  modulo: "linkedin-hooks",
  metodo: "trace",
  pt: {
    titulo: "O que é useEffect",
    pergunta: "O que é useEffect()?",
    porqueEsteMetodo:
      "O `useEffect` é mal entendido quando visto como “ciclo de vida”. Seguir um ciclo completo (renderizar, aplicar no DOM, rodar o efeito, limpar, rodar de novo) mostra o modelo certo: sincronizar com algo de fora e limpar sempre que isso deixar de valer.",
    resposta30s:
      "`useEffect` roda um trecho de código **depois** de o React renderizar e aplicar as mudanças ao DOM (em geral depois da pintura), para **sincronizar o componente com algo fora do React**: rede, timers, assinaturas, bibliotecas externas. Ele reexecuta quando as **dependências** mudam e, antes de rodar de novo (e ao desmontar), executa a **função de limpeza** que você devolveu. Pense em sincronização, não em “montar, atualizar, desmontar”, e lembre que nem todo cálculo precisa de um efeito.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O ciclo de um efeito",
        passos: [
          {
            titulo: "1. Render",
            texto:
              "O React chama o componente e obtém a interface. O efeito ainda não rodou: está só descrito e guardado.",
          },
          {
            titulo: "2. Commit e pintura",
            texto:
              "As mudanças são aplicadas ao DOM (veja L28) e o navegador pinta a tela. Normalmente o efeito roda só depois da pintura, sem bloquear a imagem.",
          },
          {
            titulo: "3. O efeito roda",
            texto:
              "O React executa a função com os valores **daquela renderização** (props e state capturados). É aqui que entram as requisições, os timers e as assinaturas.",
          },
          {
            titulo: "4. As dependências são comparadas",
            texto:
              "Na renderização seguinte, o React compara o array de dependências com o anterior (`Object.is`, item a item). Se nada mudou, o efeito não roda. Sem array, roda após toda renderização; com `[]`, só depois da montagem.",
          },
          {
            titulo: "5. Limpeza, depois o novo efeito",
            texto:
              "Se algo mudou, o React primeiro executa a **limpeza** do efeito anterior (com os valores antigos) e só então roda o novo. Isso evita timers e assinaturas duplicados.",
          },
          {
            titulo: "6. Desmontagem",
            texto:
              "Quando o componente sai da tela, o React roda a limpeza uma última vez. O caminho que dá errado: sem limpeza, ouvintes e timers continuam vivos, e respostas atrasadas escrevem no state de um componente que já seguiu em frente.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sincronizar com um timer, com limpeza",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

export function Relogio({ intervaloMs }) {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setAgora(new Date()), intervaloMs);
    return () => clearInterval(id); // limpeza: roda antes do próximo efeito e ao desmontar
  }, [intervaloMs]); // reexecuta só se o intervalo mudar

  return <time>{agora.toLocaleTimeString()}</time>;
}`,
        nota: "Se `intervaloMs` mudar, o React limpa o timer antigo e cria um novo. Sem o `return`, cada mudança deixaria mais um timer rodando.",
      },
      {
        tipo: "tabela",
        titulo: "Precisa mesmo de um efeito?",
        colunas: ["Situação", "Efeito?", "O que fazer"],
        linhas: [
          [
            "Valor que dá para calcular a partir de props ou state",
            "Não",
            "Calcule durante a renderização (e use `useMemo` se for caro)",
          ],
          [
            "Reagir a um clique ou ao envio de um formulário",
            "Não",
            "Faça no handler do evento, onde você sabe o que o usuário fez",
          ],
          ["Reiniciar o state quando uma prop muda", "Não", "Dê uma `key` ao componente (veja L33)"],
          [
            "Sincronizar com algo externo: timer, WebSocket, listener do `window`, biblioteca de mapa, analytics",
            "Sim",
            "`useEffect` com limpeza e dependências corretas",
          ],
          [
            "Buscar dados",
            "Sim, com cuidado",
            "Efeito com limpeza (cancelar ou ignorar respostas antigas), ou uma biblioteca de dados ou recurso do framework",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Sincronização, não ciclo de vida",
        texto:
          "Pergunte: “com o quê este efeito sincroniza, e como eu paro de sincronizar?”. O efeito descreve a sincronização; a limpeza a desfaz. Declare como dependências **todos os valores reativos** (props, state, funções do componente) que o efeito usa: a regra `react-hooks/exhaustive-deps` do lint aponta o que falta. Efeitos colaterais típicos: requisições, assinaturas e listeners, timers, mexer em bibliotecas externas ou no DOM à mão, registrar métricas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O efeito duplicado do Strict Mode",
        texto:
          "Em desenvolvimento, o Strict Mode executa cada efeito uma vez a mais (monta, limpa, monta de novo) para provar que a limpeza funciona; em produção isso não acontece. Se o duplicado causa problema (duas conexões, duas requisições), falta limpeza ou a lógica está no lugar errado: desligar o Strict Mode não é o conserto. Para ler o valor mais recente dentro de um efeito sem torná-lo dependência há o `useEffectEvent`; confira a documentação em react.dev.",
      },
    ],
    armadilhas: [
      "Esquecer a limpeza: ouvintes, timers e assinaturas se acumulam a cada execução ou depois da desmontagem.",
      "Omitir dependências para “evitar” a reexecução: o efeito passa a usar valores velhos (stale closures); corrija a causa em vez de silenciar o lint.",
      "Usar um efeito para derivar state ou reagir a eventos do usuário, o que causa renderizações extras e bugs de sincronização.",
      "Passar uma função `async` direto para o `useEffect`: ela devolve uma promise em vez da função de limpeza; declare uma função assíncrona dentro do efeito e chame-a.",
    ],
    autoteste: [
      {
        pergunta: "Em que ordem rodam a limpeza e o novo efeito quando uma dependência muda?",
        resposta:
          "Depois do commit, o React executa primeiro a limpeza do efeito anterior (com os valores antigos) e então o novo efeito (com os valores novos).",
      },
      {
        pergunta: "Por que, em desenvolvimento, o meu efeito roda duas vezes?",
        resposta:
          "É o Strict Mode, que monta, limpa e monta de novo para testar se a limpeza desfaz tudo o que o efeito fez. Não acontece em produção; se algo quebra, é a limpeza que está incompleta.",
      },
    ],
  },
  en: {
    titulo: "What useEffect is",
    pergunta: "What is useEffect()?",
    porqueEsteMetodo:
      "`useEffect` is misunderstood when seen as a “lifecycle”. Following one full cycle (render, apply to the DOM, run the effect, clean up, run again) shows the right model: synchronize with something outside, and clean up whenever that stops being true.",
    resposta30s:
      "`useEffect` runs a piece of code **after** React has rendered and applied the changes to the DOM (usually after painting), to **synchronize the component with something outside React**: network, timers, subscriptions, external libraries. It re-runs when its **dependencies** change and, before running again (and on unmount), it runs the **cleanup function** you returned. Think of synchronization, not “mount, update, unmount”, and remember that not every computation needs an effect.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The life of an effect",
        passos: [
          {
            titulo: "1. Render",
            texto:
              "React calls the component and gets the UI. The effect has not run yet: it is only described and stored.",
          },
          {
            titulo: "2. Commit and paint",
            texto:
              "The changes are applied to the DOM (see L28) and the browser paints the screen. Normally the effect runs only after painting, without blocking the image.",
          },
          {
            titulo: "3. The effect runs",
            texto:
              "React runs the function with the values **from that render** (captured props and state). This is where requests, timers and subscriptions go.",
          },
          {
            titulo: "4. Dependencies are compared",
            texto:
              "On the next render, React compares the dependency array with the previous one (`Object.is`, item by item). If nothing changed, the effect does not run. With no array, it runs after every render; with `[]`, only after mounting.",
          },
          {
            titulo: "5. Cleanup, then the new effect",
            texto:
              "If something changed, React first runs the previous effect’s **cleanup** (with the old values) and only then runs the new one. This prevents duplicated timers and subscriptions.",
          },
          {
            titulo: "6. Unmounting",
            texto:
              "When the component leaves the screen, React runs the cleanup one last time. The path that goes wrong: without cleanup, listeners and timers stay alive, and late responses write into the state of a component that has already moved on.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Synchronizing with a timer, with cleanup",
        legenda: "JSX",
        codigo: `import { useEffect, useState } from "react";

export function Clock({ intervalMs }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id); // cleanup: runs before the next effect and on unmount
  }, [intervalMs]); // re-runs only if the interval changes

  return <time>{now.toLocaleTimeString()}</time>;
}`,
        nota: "If `intervalMs` changes, React clears the old timer and creates a new one. Without the `return`, every change would leave one more timer running.",
      },
      {
        tipo: "tabela",
        titulo: "Do you really need an effect?",
        colunas: ["Situation", "Effect?", "What to do"],
        linhas: [
          [
            "A value you can compute from props or state",
            "No",
            "Compute it during render (and use `useMemo` if it is expensive)",
          ],
          [
            "Reacting to a click or a form submission",
            "No",
            "Do it in the event handler, where you know what the user did",
          ],
          ["Resetting state when a prop changes", "No", "Give the component a `key` (see L33)"],
          [
            "Synchronizing with something external: a timer, a WebSocket, a `window` listener, a map library, analytics",
            "Yes",
            "`useEffect` with cleanup and correct dependencies",
          ],
          [
            "Fetching data",
            "Yes, with care",
            "An effect with cleanup (cancel or ignore old responses), or a data library or framework feature",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Synchronization, not lifecycle",
        texto:
          "Ask: “what does this effect synchronize with, and how do I stop synchronizing?”. The effect describes the synchronization; the cleanup undoes it. Declare as dependencies **every reactive value** (props, state, functions of the component) the effect uses: the `react-hooks/exhaustive-deps` lint rule points out what is missing. Typical side effects: requests, subscriptions and listeners, timers, touching external libraries or the DOM by hand, logging metrics.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Strict Mode’s duplicated effect",
        texto:
          "In development, Strict Mode runs each effect one extra time (mount, clean up, mount again) to prove the cleanup works; in production this does not happen. If the duplicate causes trouble (two connections, two requests), cleanup is missing or the logic is in the wrong place: turning Strict Mode off is not the fix. To read the latest value inside an effect without making it a dependency there is `useEffectEvent`; check the documentation at react.dev.",
      },
    ],
    armadilhas: [
      "Forgetting cleanup: listeners, timers and subscriptions pile up with each run or after unmounting.",
      "Leaving out dependencies to “avoid” re-running: the effect starts using stale values (stale closures); fix the cause instead of silencing the lint.",
      "Using an effect to derive state or react to user events, which causes extra renders and sync bugs.",
      "Passing an `async` function straight to `useEffect`: it returns a promise instead of the cleanup function; declare an async function inside the effect and call it.",
    ],
    autoteste: [
      {
        pergunta: "In what order do cleanup and the new effect run when a dependency changes?",
        resposta:
          "After the commit, React first runs the previous effect’s cleanup (with the old values) and then the new effect (with the new values).",
      },
      {
        pergunta: "Why does my effect run twice in development?",
        resposta:
          "That is Strict Mode, which mounts, cleans up and mounts again to test whether the cleanup undoes everything the effect did. It does not happen in production; if something breaks, the cleanup is what is incomplete.",
      },
    ],
  },
};
