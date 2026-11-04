import type { Pergunta } from "../../tipos";

// L213 · Componentes acessíveis por teclado
export const l213: Pergunta = {
  numero: 213,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "firstprinciples",
  pt: {
    titulo: "Componentes acessíveis por teclado",
    pergunta: "Como você constrói componentes acessíveis por teclado?",
    porqueEsteMetodo:
      "As exigências de teclado (foco, ordem, setas, Escape) parecem uma lista de regras soltas. Partir de um `<div onClick>` e consertar uma falha por vez mostra de onde cada exigência vem.",
    resposta30s:
      "Comece pelo **elemento nativo** (`<button>`, `<a>`, `<input>`, `<dialog>`), que já é focável e ativa por Enter e Espaço, mantenha a **ordem do DOM** igual à ordem visual e use só `tabIndex` 0 ou -1. Em widgets compostos (abas, menus, listas), deixe **uma parada de Tab** e mova entre os itens com **setas**; **Escape fecha** as sobreposições, e o **foco** entra, fica dentro e **volta a quem abriu**. Nunca remova o foco visível, e teste largando o mouse.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma exigência por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Que toda ação possível com o mouse seja possível só com o teclado, na ordem certa e com a posição sempre visível. Isso atende quem não usa mouse (teclado, comutadores, comando de voz, leitor de tela) e quem apenas prefere o teclado. O teclado é o **denominador comum** das tecnologias assistivas.",
          },
          {
            titulo: "1. A versão mais simples: `<div onClick>`",
            texto:
              "Um `<div>` com `onClick` funciona com o mouse. → Quebra: ele **não recebe foco** (o Tab passa direto), não reage a Enter nem a Espaço e o leitor de tela não sabe que é um botão. Conserto: **use o elemento nativo** (`<button>`, `<a href>`, `<input>`, `<select>`, `<dialog>`). Ele já é focável, tem papel e nome e ativa por teclado (veja L212).",
          },
          {
            titulo: "2. Ordem de tabulação",
            texto:
              "O Tab segue a **ordem do DOM**. → Quebra: CSS que reordena o visual (`order`, posicionamento) sem mudar o DOM faz o foco pular de um lado para o outro, e `tabIndex` positivo cria uma ordem paralela impossível de manter. Conserto: escreva o DOM na ordem de leitura e use só `tabIndex={0}` (entra na ordem, para algo realmente interativo) e `tabIndex={-1}` (focável só por código, como em `ref.current.focus()`). Nunca valores positivos.",
          },
          {
            titulo: "3. Ativação por Enter e Espaço",
            texto:
              "Um controle deve reagir às teclas que o usuário espera: **Enter** nos links, **Enter e Espaço** nos botões. → Quebra: tratar só `onClick` num elemento não nativo, ou ouvir só uma tecla, ou deixar o Espaço rolar a página. Conserto: o `<button>` já faz tudo isso; só se não houver elemento nativo trate `onKeyDown` com as duas teclas e `preventDefault`.",
          },
          {
            titulo: "4. Widgets compostos: um Tab e setas",
            texto:
              "Abas, menus, listas de opções, grupos de rádio e barras de ferramentas **não** devem ter um Tab por item. → Quebra: com 50 itens, a pessoa aperta Tab 50 vezes. Conserto: **uma parada de Tab** para o widget inteiro e as **setas** movem entre os itens (*roving tabindex*: só o item atual tem `tabIndex={0}` e os demais `-1`; ou `aria-activedescendant`). Home e End vão às pontas. As teclas de cada padrão estão no guia de práticas do ARIA (APG).",
          },
          {
            titulo: "5. Escape e gerenciamento do foco",
            texto:
              "Sobreposições (modal, menu, popover) mudam para onde o foco deve ir. → Quebra: o modal abre e o foco continua no fundo, o Tab escapa do modal, ou o foco se perde ao fechar. Conserto: **ao abrir**, mova o foco para dentro (primeiro controle ou o título); **enquanto aberto**, mantenha o Tab dentro e o fundo inerte; **Escape fecha**; **ao fechar**, devolva o foco a quem abriu. O `<dialog>` com `showModal()` faz boa parte disso.",
          },
          {
            titulo: "6. Foco visível e teste",
            texto:
              "Quem usa o teclado precisa ver onde está. → Quebra: `outline: none` sem substituto, ou o foco escondido atrás de um cabeçalho fixo. Conserto: um estilo de `:focus-visible` com bom contraste. **Teste:** largue o mouse e percorra a tela com Tab, Shift+Tab, Enter, Espaço, setas e Escape. Toda ação alcançável, ordem lógica, foco sempre visível e nenhuma armadilha de foco. Repita com um leitor de tela (veja L214).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Uma parada de Tab e setas (roving tabindex)",
        legenda: "TSX",
        codigo: `import { useRef, useState, type KeyboardEvent } from "react";

export function Barra({ acoes }: { acoes: string[] }) {
  const [atual, setAtual] = useState(0);
  const botoes = useRef<(HTMLButtonElement | null)[]>([]);
  function aoTeclar(e: KeyboardEvent, i: number) {
    const passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const proximo = (i + passo + acoes.length) % acoes.length;
    setAtual(proximo);
    botoes.current[proximo]?.focus();
  }
  return (
    <div role="toolbar" aria-label="Formatação">
      {acoes.map((nome, i) => (
        <button key={nome} type="button" tabIndex={i === atual ? 0 : -1} onKeyDown={(e) => aoTeclar(e, i)}
          ref={(el) => { botoes.current[i] = el; }}>{nome}</button>
      ))}
    </div>
  );
}`,
        nota: 'Só o botão atual está na ordem do Tab; as setas movem o foco e a posição. O mesmo padrão serve a abas e grupos de rádio, com os papéis e atributos próprios de cada um (`role="tablist"`, `aria-selected`…).',
      },
      {
        tipo: "codigo",
        titulo: "Foco em modal com o <dialog> nativo",
        legenda: "TSX",
        codigo: `import { useEffect, useRef, type ReactNode } from "react";

type Props = { aberto: boolean; aoFechar: () => void; titulo: string; children: ReactNode };

export function Modal({ aberto, aoFechar, titulo, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal(); // o foco entra; o fundo fica inerte
    if (!aberto && dialogo.open) dialogo.close(); // o foco volta a quem abriu
  }, [aberto]);

  return (
    <dialog ref={ref} aria-label={titulo} onClose={aoFechar}>
      {children}
    </dialog>
  );
}`,
        nota: "`showModal()` deixa o resto da página inerte, mantém o Tab dentro do diálogo e faz o Escape fechá-lo (o evento `close` chama `aoFechar`). Os navegadores atuais devolvem o foco a quem abriu, mas teste nos que você suporta. O diálogo precisa de nome (`aria-label` ou `aria-labelledby`).",
      },
      {
        tipo: "tabela",
        titulo: "Padrões comuns e suas teclas",
        colunas: ["Padrão", "Teclas dentro do widget", "Foco"],
        linhas: [
          ["Botão e link", "Enter ativa o link; Enter e Espaço ativam o botão", "Um Tab por controle, na ordem do DOM"],
          [
            "Grupo de rádio",
            "Setas movem e marcam; Espaço marca o item focado",
            "Um Tab para o grupo, que entra no item marcado",
          ],
          [
            "Abas",
            "Setas esquerda e direita movem entre as abas; Home e End vão às pontas",
            "Um Tab para a lista de abas; outro Tab leva ao painel",
          ],
          [
            "Menu de ações",
            "Setas movem; Enter ativa; Escape fecha",
            "Abre com Enter, Espaço ou seta para baixo no botão; ao fechar, o foco volta ao botão",
          ],
          [
            "Diálogo modal",
            "Tab e Shift+Tab ciclam dentro; Escape fecha",
            "Entra ao abrir; volta ao elemento que abriu ao fechar",
          ],
        ],
        nota: "Os detalhes variam por padrão: consulte o guia de práticas do ARIA (APG), do W3C, para o widget exato que for construir.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Primeiro o nativo. Quando tiver de construir, o componente precisa ser **alcançável** (focável, na ordem certa), **operável** (Enter, Espaço, setas e Escape como o padrão pede), **visível** (foco sempre aparente) e ter o **foco gerenciado** (entra, fica e volta). Bibliotecas de componentes acessíveis, como Radix UI e React Aria, já implementam esses padrões: considere-as antes de escrever do zero.",
      },
    ],
    armadilhas: [
      "`tabIndex` positivo (`tabIndex={3}`): cria uma ordem paralela que quebra a cada mudança. Use só 0 e -1.",
      "`outline: none` sem um estilo de foco substituto, ou foco escondido atrás de cabeçalho fixo ou de um banner.",
      "Armadilha de foco: modal sem Escape, sem fundo inerte ou sem devolver o foco; menu que prende o Tab sem saída.",
      "Ouvir só `onClick` (ou só uma tecla) num elemento não nativo, deixar o Espaço rolar a página ou chamar `focus()` a cada renderização, roubando o foco de quem digita.",
    ],
    autoteste: [
      {
        pergunta: "Por que `<div onClick>` não é acessível por teclado e qual é o conserto mais simples?",
        resposta:
          'O `<div>` não é focável, não reage a Enter nem a Espaço e não tem papel de botão. O conserto é `<button type="button">`; só se não existir elemento nativo é que se constrói o resto à mão.',
      },
      {
        pergunta: "Como o foco deve se comportar em um modal?",
        resposta:
          "Ao abrir, entra no modal; enquanto aberto, o Tab fica dentro e o fundo não é alcançável; Escape fecha; ao fechar, o foco volta ao elemento que abriu.",
      },
    ],
  },
  en: {
    titulo: "Keyboard-accessible components",
    pergunta: "How do you build keyboard-accessible components?",
    porqueEsteMetodo:
      "The keyboard requirements (focus, order, arrows, Escape) look like a list of loose rules. Starting from a `<div onClick>` and fixing one flaw at a time shows where each requirement comes from.",
    resposta30s:
      "Start with the **native element** (`<button>`, `<a>`, `<input>`, `<dialog>`), which is already focusable and activates with Enter and Space, keep the **DOM order** equal to the visual order and use only `tabIndex` 0 or -1. In composite widgets (tabs, menus, lists), leave **one Tab stop** and move between items with the **arrow keys**; **Escape closes** overlays, and **focus** moves in, stays inside and **returns to whoever opened it**. Never remove the visible focus, and test by putting the mouse down.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one requirement at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "Every action possible with the mouse must be possible with the keyboard alone, in the right order and with the position always visible. That serves people who do not use a mouse (keyboard, switches, voice control, screen readers) and people who simply prefer the keyboard. The keyboard is the **common denominator** of assistive technologies.",
          },
          {
            titulo: "1. The simplest version: `<div onClick>`",
            texto:
              "A `<div>` with `onClick` works with a mouse. → Breaks: it **cannot receive focus** (Tab skips it), does not react to Enter or Space and a screen reader does not know it is a button. The fix: **use the native element** (`<button>`, `<a href>`, `<input>`, `<select>`, `<dialog>`). It is already focusable, has a role and a name and activates by keyboard (see L212).",
          },
          {
            titulo: "2. Tab order",
            texto:
              "Tab follows the **DOM order**. → Breaks: CSS that reorders the visuals (`order`, positioning) without changing the DOM makes focus jump around, and a positive `tabIndex` creates a parallel order impossible to maintain. The fix: write the DOM in reading order and use only `tabIndex={0}` (joins the order, for something truly interactive) and `tabIndex={-1}` (focusable only from code, as in `ref.current.focus()`). Never positive values.",
          },
          {
            titulo: "3. Activation with Enter and Space",
            texto:
              "A control must react to the keys the user expects: **Enter** on links, **Enter and Space** on buttons. → Breaks: handling only `onClick` on a non-native element, listening to only one key or letting Space scroll the page. The fix: `<button>` already does all of it; only when there is no native element handle `onKeyDown` for both keys and call `preventDefault`.",
          },
          {
            titulo: "4. Composite widgets: one Tab and arrows",
            texto:
              "Tabs, menus, option lists, radio groups and toolbars must **not** have one Tab per item. → Breaks: with 50 items, the person presses Tab 50 times. The fix: **one Tab stop** for the whole widget and **arrow keys** moving between items (*roving tabindex*: only the current item has `tabIndex={0}` and the others `-1`; or `aria-activedescendant`). Home and End jump to the ends. The keys for each pattern are in the ARIA Authoring Practices Guide (APG).",
          },
          {
            titulo: "5. Escape and focus management",
            texto:
              "Overlays (modal, menu, popover) change where focus should go. → Breaks: the modal opens and focus stays in the background, Tab escapes the modal, or focus is lost on close. The fix: **on open**, move focus inside (first control or the title); **while open**, keep Tab inside and the background inert; **Escape closes**; **on close**, return focus to whoever opened it. `<dialog>` with `showModal()` does much of this.",
          },
          {
            titulo: "6. Visible focus and testing",
            texto:
              "Keyboard users need to see where they are. → Breaks: `outline: none` with no replacement, or focus hidden behind a sticky header. The fix: a `:focus-visible` style with good contrast. **Test:** put the mouse down and go through the screen with Tab, Shift+Tab, Enter, Space, arrows and Escape. Every action reachable, a logical order, focus always visible and no focus traps. Repeat with a screen reader (see L214).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "One Tab stop and arrow keys (roving tabindex)",
        legenda: "TSX",
        codigo: `import { useRef, useState, type KeyboardEvent } from "react";

export function Bar({ actions }: { actions: string[] }) {
  const [current, setCurrent] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function onKey(e: KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + actions.length) % actions.length;
    setCurrent(next);
    buttons.current[next]?.focus();
  }
  return (
    <div role="toolbar" aria-label="Formatting">
      {actions.map((name, i) => (
        <button key={name} type="button" tabIndex={i === current ? 0 : -1} onKeyDown={(e) => onKey(e, i)}
          ref={(el) => { buttons.current[i] = el; }}>{name}</button>
      ))}
    </div>
  );
}`,
        nota: 'Only the current button is in the Tab order; the arrows move both focus and position. The same pattern serves tabs and radio groups, with each one’s own roles and attributes (`role="tablist"`, `aria-selected`…).',
      },
      {
        tipo: "codigo",
        titulo: "Focus in a modal with the native <dialog>",
        legenda: "TSX",
        codigo: `import { useEffect, useRef, type ReactNode } from "react";

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode };

export function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal(); // focus moves in; the background becomes inert
    if (!open && dialog.open) dialog.close(); // focus returns to whoever opened it
  }, [open]);

  return (
    <dialog ref={ref} aria-label={title} onClose={onClose}>
      {children}
    </dialog>
  );
}`,
        nota: "`showModal()` makes the rest of the page inert, keeps Tab inside the dialog and makes Escape close it (the `close` event calls `onClose`). Current browsers return focus to whoever opened it, but test in the ones you support. The dialog needs a name (`aria-label` or `aria-labelledby`).",
      },
      {
        tipo: "tabela",
        titulo: "Common patterns and their keys",
        colunas: ["Pattern", "Keys inside the widget", "Focus"],
        linhas: [
          [
            "Button and link",
            "Enter activates a link; Enter and Space activate a button",
            "One Tab per control, in DOM order",
          ],
          [
            "Radio group",
            "Arrows move and select; Space selects the focused item",
            "One Tab for the group, landing on the checked item",
          ],
          [
            "Tabs",
            "Left and right arrows move between tabs; Home and End jump to the ends",
            "One Tab for the tab list; another Tab leads to the panel",
          ],
          [
            "Action menu",
            "Arrows move; Enter activates; Escape closes",
            "Opens with Enter, Space or down arrow on the button; on close, focus returns to the button",
          ],
          [
            "Modal dialog",
            "Tab and Shift+Tab cycle inside; Escape closes",
            "Moves in on open; returns to the opener on close",
          ],
        ],
        nota: "Details vary by pattern: consult the W3C ARIA Authoring Practices Guide (APG) for the exact widget you are building.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Native first. When you must build, the component has to be **reachable** (focusable, in the right order), **operable** (Enter, Space, arrows and Escape as the pattern asks), **visible** (focus always apparent) and have its **focus managed** (moves in, stays and returns). Accessible component libraries such as Radix UI and React Aria already implement these patterns: consider them before writing from scratch.",
      },
    ],
    armadilhas: [
      "A positive `tabIndex` (`tabIndex={3}`): it creates a parallel order that breaks with every change. Use only 0 and -1.",
      "`outline: none` with no replacement focus style, or focus hidden behind a sticky header or a banner.",
      "Focus traps: a modal with no Escape, no inert background or no focus return; a menu that holds Tab with no way out.",
      "Listening only to `onClick` (or only one key) on a non-native element, letting Space scroll the page, or calling `focus()` on every render and stealing focus from someone typing.",
    ],
    autoteste: [
      {
        pergunta: "Why is `<div onClick>` not keyboard-accessible, and what is the simplest fix?",
        resposta:
          'The `<div>` is not focusable, does not react to Enter or Space and has no button role. The fix is `<button type="button">`; only when no native element exists do you build the rest by hand.',
      },
      {
        pergunta: "How should focus behave in a modal?",
        resposta:
          "On open, it moves into the modal; while open, Tab stays inside and the background is unreachable; Escape closes; on close, focus returns to the element that opened it.",
      },
    ],
  },
};
