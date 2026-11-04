import type { Pergunta } from "../../tipos";

// L53 · O que é useTransition
export const l053: Pergunta = {
  numero: 53,
  modulo: "linkedin-hooks",
  metodo: "trace",
  pt: {
    titulo: "O que é useTransition",
    pergunta: "O que é useTransition()?",
    porqueEsteMetodo:
      "Prioridade de atualização é abstrato até você acompanhar uma tecla de verdade: o que o React renderiza primeiro, o que fica em segundo plano e o que acontece quando chega outra tecla. Seguir um exemplo mostra o mecanismo inteiro.",
    resposta30s:
      "`useTransition` devolve `[isPending, startTransition]`: o que roda dentro de `startTransition` vira uma atualização de **baixa prioridade** (uma transição), que o React renderiza em segundo plano e **pode interromper** se chegar algo urgente, como outra tecla. Assim o campo responde na hora enquanto uma lista pesada atualiza depois, e `isPending` serve de feedback. O valor de um input controlado nunca entra na transição.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "Um campo que filtra uma lista pesada",
        legenda: "TSX",
        codigo: `import { useState, useTransition, type ChangeEvent } from "react";

export function Busca({ itens }: { itens: string[] }) {
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("");
  const [pendente, startTransition] = useTransition();

  function aoDigitar(e: ChangeEvent<HTMLInputElement>) {
    const valor = e.target.value;
    setTexto(valor); // urgente: o campo responde na hora
    startTransition(() => setFiltro(valor)); // transição: a lista pode esperar
  }

  return (
    <>
      <input value={texto} onChange={aoDigitar} />
      {pendente && <span>Atualizando…</span>}
      <Lista itens={itens} filtro={filtro} />
    </>
  );
}`,
        nota: "`Lista` é o componente pesado e deveria estar em `memo`: assim a renderização urgente do campo não paga o custo da lista de novo (veja o passo sobre `memo`, abaixo).",
      },
      {
        tipo: "fluxo",
        titulo: "Uma tecla, no caminho feliz",
        etapas: [
          "A pessoa digita “a” e o `onChange` chama `aoDigitar`",
          "`setTexto` é uma atualização **urgente**: o React a renderiza primeiro, e o campo mostra “a” de imediato",
          "`startTransition` marca `setFiltro` como **transição**; na mesma renderização urgente `pendente` já vale `true`, e a lista ainda mostra o resultado antigo",
          "Em seguida o React renderiza a lista com o filtro novo em segundo plano, em pedaços, cedendo ao navegador entre eles (a renderização é interrompível)",
          "Terminada a renderização, o React confirma as mudanças (commit): a lista nova aparece e `pendente` volta a `false`",
        ],
        nota: "Se algo na transição suspender (dados lidos com `use`, código carregado com `lazy`), o React mantém o conteúdo já exibido em vez de trocá-lo pelo `fallback` do Suspense.",
      },
      {
        tipo: "passos",
        titulo: "Agora, o que muda no meio ou dá errado",
        passos: [
          {
            titulo: "Chega outra tecla antes do fim",
            texto:
              "Digitar “b” é urgente e passa na frente. O React abandona a renderização da transição para “a” e recomeça com “ab”. O filtro intermediário nunca chega à tela, e nenhum trabalho velho termina atrasado por cima do novo.",
          },
          {
            titulo: "O campo entra na transição",
            texto:
              "Se `setTexto` ficasse dentro de `startTransition`, o input controlado reagiria com atraso: o texto digitado não acompanharia as teclas. O valor que o usuário **sente** na hora tem de ser urgente; use duas variáveis (como acima) ou `useDeferredValue` (veja L54).",
          },
          {
            titulo: "A lista não está em `memo`",
            texto:
              "A renderização urgente do campo re-renderiza `Lista` com as props antigas e paga o custo todo a cada tecla, o que apaga o benefício. Coloque a lista em `memo`, ou deixe o React Compiler memoizar, para que ela só renderize quando `filtro` mudar.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Transição é para a atualização que **pode esperar** (a lista, a aba, a rota); a que a pessoa **sente na hora** (o valor do campo, o clique) fica urgente. A transição não acelera a renderização: ela dá prioridade e permite interromper. Nas versões recentes, `startTransition` também aceita funções assíncronas (as Actions), com `isPending` cobrindo o trabalho todo; confira em react.dev os detalhes e limites, como o que ocorre com atualizações depois de um `await`.",
      },
    ],
    armadilhas: [
      "Colocar o valor de um input controlado dentro da transição: o campo fica atrasado em relação às teclas.",
      "Esperar que a transição torne a renderização mais rápida: ela só impede que o trabalho bloqueie a interação. Se cada item é caro, reduza o trabalho (`memo`, virtualização).",
      "Esquecer o `memo` no componente pesado: a renderização urgente o refaz com as props antigas e anula o ganho.",
      "Ignorar `isPending`: sem feedback, a lista parece travada por um instante. Mostre um indicador discreto, sem esconder o conteúdo antigo.",
    ],
    autoteste: [
      {
        pergunta: "O que `isPending` indica?",
        resposta:
          "Que existe uma transição em andamento: a renderização em segundo plano ainda não foi confirmada. Serve para mostrar feedback sem esconder o conteúdo antigo.",
      },
      {
        pergunta: "Qual a diferença entre o Hook `useTransition` e o `startTransition` importado de `react`?",
        resposta:
          "O Hook devolve também `isPending`. A função importada serve para marcar transições fora de componentes (em bibliotecas, por exemplo), mas não informa se há uma pendente.",
      },
    ],
  },
  en: {
    titulo: "What useTransition is",
    pergunta: "What is useTransition()?",
    porqueEsteMetodo:
      "Update priority is abstract until you follow a real keystroke: what React renders first, what stays in the background and what happens when another key arrives. Following one example shows the whole mechanism.",
    resposta30s:
      "`useTransition` returns `[isPending, startTransition]`: whatever runs inside `startTransition` becomes a **low-priority** update (a transition), which React renders in the background and **can interrupt** if something urgent arrives, such as another keystroke. The field responds right away while a heavy list updates later, and `isPending` gives feedback. A controlled input’s value never goes inside the transition.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "A field that filters a heavy list",
        legenda: "TSX",
        codigo: `import { useState, useTransition, type ChangeEvent } from "react";

export function Search({ items }: { items: string[] }) {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("");
  const [pending, startTransition] = useTransition();

  function onType(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setText(value); // urgent: the field responds right away
    startTransition(() => setFilter(value)); // transition: the list can wait
  }

  return (
    <>
      <input value={text} onChange={onType} />
      {pending && <span>Updating…</span>}
      <List items={items} filter={filter} />
    </>
  );
}`,
        nota: "`List` is the heavy component and should be wrapped in `memo`: that way the field’s urgent render does not pay the list’s cost again (see the `memo` step below).",
      },
      {
        tipo: "fluxo",
        titulo: "One keystroke, on the happy path",
        etapas: [
          "The person types “a” and `onChange` calls `onType`",
          "`setText` is an **urgent** update: React renders it first, and the field shows “a” immediately",
          "`startTransition` marks `setFilter` as a **transition**; in that same urgent render `pending` is already `true`, and the list still shows the old result",
          "Next, React renders the list with the new filter in the background, in chunks, yielding to the browser between them (rendering is interruptible)",
          "When rendering finishes, React commits the changes: the new list appears and `pending` goes back to `false`",
        ],
        nota: "If something in the transition suspends (data read with `use`, code loaded with `lazy`), React keeps the content already on screen instead of swapping it for the Suspense `fallback`.",
      },
      {
        tipo: "passos",
        titulo: "Now, what changes midway or goes wrong",
        passos: [
          {
            titulo: "Another keystroke arrives before the end",
            texto:
              "Typing “b” is urgent and goes first. React abandons the transition render for “a” and starts over with “ab”. The intermediate filter never reaches the screen, and no stale work finishes late on top of the new.",
          },
          {
            titulo: "The field goes into the transition",
            texto:
              "If `setText` were inside `startTransition`, the controlled input would react late: the typed text would not keep up with the keys. The value the user **feels** right away has to be urgent; use two variables (as above) or `useDeferredValue` (see L54).",
          },
          {
            titulo: "The list is not in `memo`",
            texto:
              "The field’s urgent render re-renders `List` with the old props and pays the full cost on every keystroke, which erases the benefit. Put the list in `memo`, or let the React Compiler memoize it, so it only renders when `filter` changes.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "A transition is for the update that **can wait** (the list, the tab, the route); what the person **feels instantly** (the field’s value, the click) stays urgent. A transition does not speed up rendering: it gives priority and allows interruption. In recent versions, `startTransition` also accepts async functions (Actions), with `isPending` covering the whole job; check react.dev for the details and limits, such as what happens to updates after an `await`.",
      },
    ],
    armadilhas: [
      "Putting a controlled input’s value inside the transition: the field lags behind the keystrokes.",
      "Expecting the transition to make rendering faster: it only stops the work from blocking interaction. If each item is expensive, reduce the work (`memo`, virtualization).",
      "Forgetting `memo` on the heavy component: the urgent render redoes it with the old props and cancels the gain.",
      "Ignoring `isPending`: without feedback, the list looks stuck for a moment. Show a discreet indicator without hiding the old content.",
    ],
    autoteste: [
      {
        pergunta: "What does `isPending` indicate?",
        resposta:
          "That a transition is in progress: the background render has not been committed yet. It is used to show feedback without hiding the old content.",
      },
      {
        pergunta:
          "What is the difference between the `useTransition` Hook and the `startTransition` imported from `react`?",
        resposta:
          "The Hook also returns `isPending`. The imported function marks transitions outside components (in libraries, for example), but does not tell you whether one is pending.",
      },
    ],
  },
};
