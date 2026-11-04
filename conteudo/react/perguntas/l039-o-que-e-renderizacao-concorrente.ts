import type { Pergunta } from "../../tipos";

// L39 · O que é renderização concorrente
export const l039: Pergunta = {
  numero: 39,
  modulo: "linkedin-renderizacao",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é renderização concorrente",
    pergunta: "O que é renderização concorrente?",
    porqueEsteMetodo:
      "A renderização concorrente soa abstrata até você ver o problema que a gera: uma só thread e uma renderização longa que trava a digitação. Partir dessa restrição e consertar uma falha por vez faz cada peça (pausar, priorizar, aplicar só o consistente) aparecer sozinha.",
    resposta30s:
      "A **renderização concorrente** permite ao React **preparar uma atualização em segundo plano**, interrompê-la, pausá-la ou descartá-la quando chega algo mais urgente, e só aplicar o resultado à tela quando ele estiver **consistente**. Não é paralelismo (a thread continua sendo uma só): o React intercala o trabalho e dá **prioridade** ao que o usuário sente (digitar, clicar) sobre o que pode esperar (filtrar uma lista). Não é uma chave global: é ativada por recursos como transições, `useDeferredValue` e Suspense, e exige componentes **puros**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "1. A restrição: uma thread só",
            texto:
              "O navegador roda o seu JavaScript, trata a digitação e pinta a tela na mesma **thread principal**. Enquanto o React calcula uma renderização, nada mais acontece.",
          },
          {
            titulo: "2. A versão mais simples: render síncrono",
            texto:
              "Toda atualização renderiza do começo ao fim, sem parar. → Quebra: ao digitar num campo que filtra uma lista enorme, cada tecla dispara uma renderização longa e a digitação engasga.",
          },
          {
            titulo: "3. Dividir o trabalho em pedaços",
            texto:
              "O motor interno (veja L24) representa o trabalho em unidades pequenas e pode ceder o controle ao navegador entre elas. → Quebra: se o React mostrasse o que já calculou, a tela ficaria metade nova, metade velha.",
          },
          {
            titulo: "4. Preparar em segundo plano e aplicar só o consistente",
            texto:
              "O React monta a nova árvore sem tocar a tela, enquanto a atual continua respondendo, e só faz o commit quando o resultado está completo. A parte interruptível é o render; o commit continua de uma vez (veja L28 e L40). → Quebra: nem toda atualização tem a mesma urgência.",
          },
          {
            titulo: "5. Prioridades: urgente x transição",
            texto:
              "Atualizações que o usuário espera ver na hora (digitar, clicar) são urgentes; as que podem esperar (resultado de um filtro, troca de tela) são **transições**. Se chega algo urgente, o React interrompe a transição em andamento, atende o urgente e depois recomeça com o state mais novo; o trabalho obsoleto é descartado. → Quebra: um render pode ser chamado várias vezes, ou nunca ser aplicado.",
          },
          {
            titulo: "6. Exigir pureza",
            texto:
              "Como o render pode ser repetido, pausado ou descartado, o corpo do componente precisa ser puro (veja L28); o Strict Mode ajuda a descobrir quem não é. → Resta: e se faltarem dados para continuar?",
          },
          {
            titulo: "7. Esperar dados sem travar: Suspense",
            texto:
              "O Suspense deixa o render “esperar” por algo (código ou dados): o React mantém a interface atual (ou mostra um fallback) e só aplica a nova tela quando ela está pronta, sem congelar a página.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Digitação urgente, filtro adiável",
        legenda: "JSX",
        codigo: `import { useState, useTransition } from "react";

export function Busca({ itens }) {
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState("");
  const [pendente, startTransition] = useTransition();

  function aoDigitar(e) {
    setTexto(e.target.value); // urgente: o campo responde na hora
    startTransition(() => setFiltro(e.target.value)); // adiável: a lista pode esperar
  }

  const visiveis = itens.filter((i) => i.includes(filtro));
  return (
    <>
      <input value={texto} onChange={aoDigitar} />
      {pendente && <span>Atualizando…</span>}
      <ul>{visiveis.map((i) => <li key={i}>{i}</li>)}</ul>
    </>
  );
}`,
        nota: "O campo usa `texto`, atualizado na hora; a lista usa `filtro`, atualizado na transição. Se a pessoa digitar de novo antes de a lista terminar, o React abandona a renderização anterior e recomeça com o valor mais novo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Uma capacidade, não uma chave",
        texto:
          "A renderização concorrente é uma **capacidade** que os recursos usam: `startTransition` e `useTransition`, `useDeferredValue` e o Suspense. Sem usar nenhum deles, as atualizações continuam urgentes; só o que é marcado como transição (ou adiado) se beneficia da interrupção. Versões experimentais já falaram em um “modo concorrente” global; a ideia hoje é **adotar aos poucos**, recurso por recurso (confira o estado atual em react.dev).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Concorrente não é paralelo nem mais rápido",
        texto:
          "Continua havendo uma thread: o React **intercala** o trabalho. A renderização concorrente não reduz o custo total de um componente lento (uma transição pode até repetir trabalho); ela evita que esse custo bloqueie a interação, então otimizar o componente continua valendo a pena. E se o render tiver efeitos colaterais, repeti-lo ou descartá-lo gera bugs.",
      },
    ],
    armadilhas: [
      "Dizer que o React “usa várias threads” ou que a renderização concorrente é paralela: a thread é uma só, e o trabalho é intercalado.",
      "Achar que basta atualizar o React para ganhar concorrência: o benefício aparece quando você usa `useTransition`, `useDeferredValue` e Suspense.",
      "Colocar a atualização do próprio campo de texto dentro da transição: o campo passa a responder com atraso. Só o que pode esperar vai para a transição.",
      "Escrever componentes com efeitos colaterais no render ou mutando variáveis externas: com o render repetido ou descartado, o resultado fica incorreto.",
    ],
    autoteste: [
      {
        pergunta: "Por que o commit não pode ser interrompido?",
        resposta:
          "Porque aplicar metade das mudanças ao DOM deixaria a tela inconsistente. O React interrompe só a fase de render, que ainda não tocou o DOM, e faz o commit de uma vez quando o resultado está completo.",
      },
      {
        pergunta: "O que acontece com uma transição em andamento quando chega uma tecla digitada?",
        resposta:
          "A digitação é urgente: o React pausa (ou abandona) a renderização da transição, atende a tecla e depois recomeça a transição com o state mais recente.",
      },
    ],
  },
  en: {
    titulo: "What concurrent rendering is",
    pergunta: "What is concurrent rendering?",
    porqueEsteMetodo:
      "Concurrent rendering sounds abstract until you see the problem behind it: a single thread and a long render that freezes typing. Starting from that constraint and fixing one flaw at a time makes each piece (pausing, prioritizing, applying only what is consistent) appear on its own.",
    resposta30s:
      "**Concurrent rendering** lets React **prepare an update in the background**, interrupt it, pause it or discard it when something more urgent arrives, and apply the result to the screen only when it is **consistent**. It is not parallelism (there is still a single thread): React interleaves the work and gives **priority** to what the user feels (typing, clicking) over what can wait (filtering a list). It is not a global switch: it is activated by features such as transitions, `useDeferredValue` and Suspense, and it requires **pure** components.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one constraint at a time",
        passos: [
          {
            titulo: "1. The constraint: one thread",
            texto:
              "The browser runs your JavaScript, handles typing and paints the screen on the same **main thread**. While React computes a render, nothing else happens.",
          },
          {
            titulo: "2. The simplest version: synchronous render",
            texto:
              "Every update renders from start to finish, without stopping. → Breaks: when typing in a field that filters a huge list, each key triggers a long render and typing stutters.",
          },
          {
            titulo: "3. Split the work into pieces",
            texto:
              "The internal engine (see L24) represents the work as small units and can yield control to the browser between them. → Breaks: if React showed what it had already computed, the screen would be half new, half old.",
          },
          {
            titulo: "4. Prepare in the background and apply only what is consistent",
            texto:
              "React builds the new tree without touching the screen, while the current one keeps responding, and commits only when the result is complete. The interruptible part is the render; the commit still happens in one go (see L28 and L40). → Breaks: not every update is equally urgent.",
          },
          {
            titulo: "5. Priorities: urgent vs transition",
            texto:
              "Updates the user expects to see right away (typing, clicking) are urgent; the ones that can wait (a filter’s results, a screen change) are **transitions**. If something urgent arrives, React interrupts the transition in progress, handles the urgent update and then restarts with the newest state; obsolete work is discarded. → Breaks: a render may be called several times, or never applied.",
          },
          {
            titulo: "6. Require purity",
            texto:
              "Since a render can be repeated, paused or discarded, the component body must be pure (see L28); Strict Mode helps find the ones that are not. → What remains: what if data is missing to continue?",
          },
          {
            titulo: "7. Wait for data without freezing: Suspense",
            texto:
              "Suspense lets a render “wait” for something (code or data): React keeps the current UI (or shows a fallback) and applies the new screen only when it is ready, without freezing the page.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Urgent typing, deferrable filter",
        legenda: "JSX",
        codigo: `import { useState, useTransition } from "react";

export function Search({ items }) {
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("");
  const [pending, startTransition] = useTransition();

  function onType(e) {
    setText(e.target.value); // urgent: the field responds right away
    startTransition(() => setFilter(e.target.value)); // deferrable: the list can wait
  }

  const visible = items.filter((i) => i.includes(filter));
  return (
    <>
      <input value={text} onChange={onType} />
      {pending && <span>Updating…</span>}
      <ul>{visible.map((i) => <li key={i}>{i}</li>)}</ul>
    </>
  );
}`,
        nota: "The field uses `text`, updated immediately; the list uses `filter`, updated in the transition. If the person types again before the list finishes, React abandons the previous render and restarts with the newest value.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A capability, not a switch",
        texto:
          "Concurrent rendering is a **capability** that features use: `startTransition` and `useTransition`, `useDeferredValue` and Suspense. Without using any of them, updates remain urgent; only what is marked as a transition (or deferred) benefits from interruption. Experimental versions once talked about a global “concurrent mode”; the idea today is to **adopt it gradually**, feature by feature (check the current state at react.dev).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Concurrent is not parallel, nor faster",
        texto:
          "There is still one thread: React **interleaves** the work. Concurrent rendering does not reduce the total cost of a slow component (a transition may even repeat work); it keeps that cost from blocking interaction, so optimizing the component is still worthwhile. And if a render has side effects, repeating or discarding it creates bugs.",
      },
    ],
    armadilhas: [
      "Saying React “uses multiple threads” or that concurrent rendering is parallel: there is one thread, and the work is interleaved.",
      "Believing that upgrading React is enough to get concurrency: the benefit shows up when you use `useTransition`, `useDeferredValue` and Suspense.",
      "Putting the text field’s own update inside the transition: the field then responds late. Only what can wait goes into the transition.",
      "Writing components with side effects in render or that mutate outside variables: with the render repeated or discarded, the result is wrong.",
    ],
    autoteste: [
      {
        pergunta: "Why can the commit not be interrupted?",
        resposta:
          "Because applying half of the changes to the DOM would leave the screen inconsistent. React interrupts only the render phase, which has not touched the DOM yet, and commits in one go when the result is complete.",
      },
      {
        pergunta: "What happens to a transition in progress when a keystroke arrives?",
        resposta:
          "Typing is urgent: React pauses (or abandons) the transition’s render, handles the keystroke and then restarts the transition with the latest state.",
      },
    ],
  },
};
