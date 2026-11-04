import type { Pergunta } from "../../tipos";

// L130 · O componente Activity
export const l130: Pergunta = {
  numero: 130,
  modulo: "linkedin-react19",
  metodo: "whys",
  pt: {
    titulo: "O componente Activity",
    pergunta: "O que é <Activity /> no React 19.2?",
    porqueEsteMetodo:
      "O `Activity` parece só mais um jeito de esconder coisas, até você perguntar por que ele existe. A cadeia de “por quês” mostra o problema (esconder custava o estado ou a CPU) e como um terceiro modo, “vivo, mas oculto e quieto”, o resolve.",
    resposta30s:
      '`<Activity>` permite **ocultar parte da interface sem desmontá-la**: com `mode="hidden"` o React esconde o DOM, **preserva o estado** e **limpa os efeitos**; com `mode="visible"` mostra tudo de volta e recria os efeitos. Serve para abas e navegação que preservam estado e para **pré-renderizar**, em segundo plano, telas que o usuário provavelmente verá. É um recurso recente: confira os detalhes em react.dev.',
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que esconder uma parte da interface costuma custar o estado dela?",
            resposta:
              'Porque o jeito comum, a **renderização condicional** (`{aba === "editor" && <Editor />}`), **desmonta** o componente: o estado local, o rascunho digitado, a rolagem e o DOM somem, e voltar à aba monta tudo do zero (e refaz as buscas). Para o que sai de cena, o React só conhece duas posições: montado ou inexistente.',
          },
          {
            pergunta: "Por que não basta esconder com CSS (`display: none`)?",
            resposta:
              "Porque o React não sabe que o componente está escondido: ele continua **vivo e ativo**. Os efeitos seguem rodando (assinaturas, timers, listeners), as atualizações são renderizadas com a prioridade normal e a parte invisível disputa processamento com a visível. O estado se preserva, mas você paga com trabalho que ninguém vê.",
          },
          {
            pergunta: "Por que o `Activity` resolve os dois problemas ao mesmo tempo?",
            resposta:
              'Porque ele declara a intenção ao React. Em `mode="hidden"`, o React **esconde o DOM**, **mantém o estado** e **limpa os efeitos** (a função de limpeza roda, como numa desmontagem). Em `mode="visible"`, mostra de novo e recria os efeitos. O padrão é `visible`.',
          },
          {
            pergunta: "Por que ele também serve para pré-renderizar?",
            resposta:
              "Porque o conteúdo oculto ainda pode ser renderizado em segundo plano, com **prioridade baixa**, sem atrasar o que o usuário está vendo. Se a próxima tela provável fica dentro de um `Activity` oculto, ela chega quase pronta quando for revelada; fontes de dados que funcionam com Suspense (veja L104) podem até começar a carregar antes. Confira em react.dev o que exatamente é pré-carregado.",
          },
          {
            pergunta: "Por que não usar `Activity` em tudo?",
            resposta:
              "Porque o que fica oculto continua ocupando **memória**: o DOM, o estado e a árvore de componentes não são liberados. Telas pesadas, numerosas ou que raramente voltam devem continuar sendo desmontadas. Além disso, os efeitos agora são criados e limpos várias vezes sem o componente ser desmontado, então uma limpeza mal escrita vira vazamento.",
          },
        ],
        causaRaiz:
          "Faltava um terceiro estado entre “montado e visível” e “desmontado”: **vivo, mas oculto e quieto**. O `Activity` o oferece ao React, que preserva o estado sem manter os efeitos e sem gastar prioridade com o que ninguém vê.",
      },
      {
        tipo: "tabela",
        titulo: "Três formas de esconder, e o que cada uma mantém",
        colunas: ["Técnica", "Estado e DOM", "Efeitos (timers, assinaturas)", "Renderização"],
        linhas: [
          [
            "Renderização condicional",
            "Perdidos ao desmontar",
            "Limpos na desmontagem",
            "Só existe quando está visível",
          ],
          [
            "`display: none` por CSS",
            "Preservados",
            "Continuam rodando",
            "Prioridade normal, como se estivesse visível",
          ],
          [
            '`<Activity mode="hidden">`',
            "Preservados (e ocupam memória)",
            "Limpos; recriados ao voltar a `visible`",
            "Em segundo plano, com prioridade baixa",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Abas que preservam o rascunho",
        legenda: "TSX",
        codigo: `import { Activity, useState } from "react";

export function Abas() {
  const [aba, setAba] = useState<"resumo" | "editor">("resumo");

  return (
    <>
      <button onClick={() => setAba("resumo")}>Resumo</button>
      <button onClick={() => setAba("editor")}>Editor</button>

      <Activity mode={aba === "resumo" ? "visible" : "hidden"}>
        <Resumo />
      </Activity>
      <Activity mode={aba === "editor" ? "visible" : "hidden"}>
        <Editor /> {/* o texto digitado sobrevive à troca de aba */}
      </Activity>
    </>
  );
}`,
        nota: "`Resumo` e `Editor` são componentes seus. Se o `Editor` abre uma assinatura em um efeito, ela é cancelada ao ocultar a aba e recriada ao voltar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidados antes de usar",
        texto:
          "Cada `Activity` oculto mantém DOM e estado na memória: use onde voltar à tela é provável (abas, a página anterior de uma navegação, o próximo passo de um fluxo). Garanta que os efeitos tenham **limpeza** correta, porque agora rodam de novo a cada vez que o conteúdo é ocultado e revelado. O que vive no DOM, como um `<video>`, pode continuar tocando enquanto oculto, e cabe a você pausá-lo na limpeza de um efeito. O recurso é recente: confira o comportamento atual em react.dev.",
      },
    ],
    armadilhas: [
      "Usar `Activity` para tudo: cada tela oculta mantém DOM e estado na memória; telas pesadas ou que raramente voltam devem ser desmontadas.",
      "Esquecer a limpeza dos efeitos (cancelar assinatura, timer, listener): ao ocultar, a limpeza roda, e um efeito que não se desfaz direito vaza ou duplica trabalho.",
      "Achar que oculto é só `display: none`: o React também limpa os efeitos e rebaixa a prioridade, e mídia no DOM, como um `<video>`, pode continuar tocando se você não a pausar.",
      "Esperar que ele pré-renderize sozinho: é você quem coloca a tela provável em um `Activity` oculto; o React não adivinha para onde o usuário vai.",
    ],
    autoteste: [
      {
        pergunta: 'Qual a diferença entre `<Activity mode="hidden">` e a renderização condicional?',
        resposta:
          "A condicional desmonta: o estado e o DOM somem. O `Activity` oculto mantém estado e DOM, mas limpa os efeitos e rebaixa a prioridade do que ninguém vê; ao voltar a `visible`, o estado ainda está lá.",
      },
      {
        pergunta: "O que acontece com os efeitos de um componente dentro de um `Activity` oculto?",
        resposta:
          "São limpos (a função de limpeza roda), como numa desmontagem, e recriados quando o modo volta a `visible`. O estado do componente não se perde.",
      },
    ],
  },
  en: {
    titulo: "The Activity component",
    pergunta: "What is <Activity /> in React 19.2?",
    porqueEsteMetodo:
      "`Activity` looks like just another way to hide things, until you ask why it exists. The chain of whys shows the problem (hiding cost you either the state or the CPU) and how a third mode, “alive, but hidden and quiet”, solves it.",
    resposta30s:
      '`<Activity>` lets you **hide part of the interface without unmounting it**: with `mode="hidden"` React hides the DOM, **keeps the state** and **cleans up the effects**; with `mode="visible"` it shows everything again and recreates the effects. It is used for tabs and navigation that preserve state, and to **pre-render**, in the background, screens the user will probably see. It is a recent feature: check the details on react.dev.',
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does hiding part of the interface usually cost its state?",
            resposta:
              'Because the common way, **conditional rendering** (`{tab === "editor" && <Editor />}`), **unmounts** the component: local state, typed drafts, scroll position and the DOM all go away, and returning to the tab builds everything from scratch (and repeats the fetches). For what leaves the screen, React only knows two positions: mounted or nonexistent.',
          },
          {
            pergunta: "Why isn’t hiding with CSS (`display: none`) enough?",
            resposta:
              "Because React doesn’t know the component is hidden: it stays **alive and active**. Effects keep running (subscriptions, timers, listeners), updates render at normal priority and the invisible part competes for processing with the visible one. The state is preserved, but you pay for work nobody sees.",
          },
          {
            pergunta: "Why does `Activity` solve both problems at once?",
            resposta:
              'Because it declares the intent to React. With `mode="hidden"`, React **hides the DOM**, **keeps the state** and **cleans up the effects** (the cleanup function runs, as in an unmount). With `mode="visible"`, it shows it again and recreates the effects. The default is `visible`.',
          },
          {
            pergunta: "Why is it also useful for pre-rendering?",
            resposta:
              "Because hidden content can still be rendered in the background, at **low priority**, without delaying what the user is looking at. If the likely next screen sits inside a hidden `Activity`, it arrives almost ready when revealed; data sources that work with Suspense (see L104) may even start loading earlier. Check react.dev for exactly what gets preloaded.",
          },
          {
            pergunta: "Why not use `Activity` for everything?",
            resposta:
              "Because what stays hidden keeps occupying **memory**: the DOM, the state and the component tree are not released. Heavy or numerous screens, or ones that rarely come back, should still be unmounted. Also, effects are now created and cleaned up several times without the component unmounting, so a badly written cleanup turns into a leak.",
          },
        ],
        causaRaiz:
          "There was no third state between “mounted and visible” and “unmounted”: **alive, but hidden and quiet**. `Activity` gives it to React, which keeps the state without keeping the effects and without spending priority on what nobody sees.",
      },
      {
        tipo: "tabela",
        titulo: "Three ways to hide, and what each one keeps",
        colunas: ["Technique", "State and DOM", "Effects (timers, subscriptions)", "Rendering"],
        linhas: [
          ["Conditional rendering", "Lost on unmount", "Cleaned up on unmount", "Exists only while visible"],
          ["`display: none` via CSS", "Preserved", "Keep running", "Normal priority, as if visible"],
          [
            '`<Activity mode="hidden">`',
            "Preserved (and take up memory)",
            "Cleaned up; recreated when it returns to `visible`",
            "In the background, at low priority",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Tabs that keep the draft",
        legenda: "TSX",
        codigo: `import { Activity, useState } from "react";

export function Tabs() {
  const [tab, setTab] = useState<"summary" | "editor">("summary");

  return (
    <>
      <button onClick={() => setTab("summary")}>Summary</button>
      <button onClick={() => setTab("editor")}>Editor</button>

      <Activity mode={tab === "summary" ? "visible" : "hidden"}>
        <Summary />
      </Activity>
      <Activity mode={tab === "editor" ? "visible" : "hidden"}>
        <Editor /> {/* the typed text survives switching tabs */}
      </Activity>
    </>
  );
}`,
        nota: "`Summary` and `Editor` are your own components. If `Editor` opens a subscription in an effect, it is cancelled when the tab is hidden and recreated when it returns.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cautions before using it",
        texto:
          "Each hidden `Activity` keeps DOM and state in memory: use it where coming back to the screen is likely (tabs, the previous page of a navigation, the next step of a flow). Make sure effects have a correct **cleanup**, because they now run again every time the content is hidden and revealed. What lives in the DOM, such as a `<video>`, may keep playing while hidden, and it is up to you to pause it in an effect’s cleanup. The feature is recent: check the current behavior on react.dev.",
      },
    ],
    armadilhas: [
      "Using `Activity` for everything: each hidden screen keeps DOM and state in memory; heavy screens or ones that rarely come back should be unmounted.",
      "Forgetting effect cleanup (cancelling a subscription, timer, listener): when hidden, the cleanup runs, and an effect that doesn’t undo itself properly leaks or duplicates work.",
      "Thinking hidden is just `display: none`: React also cleans up effects and lowers priority, and media in the DOM, like a `<video>`, may keep playing if you don’t pause it.",
      "Expecting it to pre-render on its own: you are the one who puts the likely screen in a hidden `Activity`; React doesn’t guess where the user is going.",
    ],
    autoteste: [
      {
        pergunta: 'What is the difference between `<Activity mode="hidden">` and conditional rendering?',
        resposta:
          "Conditional rendering unmounts: state and DOM are lost. A hidden `Activity` keeps state and DOM, but cleans up effects and lowers the priority of what nobody sees; when it returns to `visible`, the state is still there.",
      },
      {
        pergunta: "What happens to the effects of a component inside a hidden `Activity`?",
        resposta:
          "They are cleaned up (the cleanup function runs), as in an unmount, and recreated when the mode goes back to `visible`. The component’s state is not lost.",
      },
    ],
  },
};
