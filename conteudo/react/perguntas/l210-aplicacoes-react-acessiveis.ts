import type { Pergunta } from "../../tipos";

// L210 · Aplicações React acessíveis
export const l210: Pergunta = {
  numero: 210,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "playbook",
  pt: {
    titulo: "Aplicações React acessíveis",
    pergunta: "Como você torna aplicações React acessíveis?",
    porqueEsteMetodo:
      "Acessibilidade é uma sequência de hábitos com ordem de prioridade: o HTML certo resolve a maior parte e o ARIA vem por último. Um playbook com o sinal de acerto de cada passo mostra essa ordem e como verificar o resultado.",
    resposta30s:
      "Acessibilidade é fazer a aplicação funcionar para quem usa teclado, leitor de tela, zoom ou outras tecnologias assistivas. Em React o JSX gera HTML comum, então comece pelo **HTML semântico**, por rótulos, texto alternativo, **foco visível e gerenciado** e contraste, e use **ARIA** só quando o HTML não basta; numa SPA, cuide também do foco e dos anúncios a cada troca de rota ou modal. Verifique com lint (`eslint-plugin-jsx-a11y`), ferramentas automáticas, teclado e leitor de tela.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: acessibilidade em React",
        passos: [
          {
            titulo: "Comece pelo HTML semântico",
            texto:
              "Use `button` para ações, `a href` para navegação, `label` com `input`, `nav`, `main`, `header`, `footer`, títulos `h1` a `h6` em ordem e `ul` e `li` para listas. Eles já trazem papel, foco e teclado. Sinal de acerto: a tela funciona com Tab, Enter e Espaço sem JavaScript extra, e nenhum `div` com `onClick` faz papel de botão.",
          },
          {
            titulo: "Dê nome a tudo o que é interativo",
            texto:
              'Todo campo com `<label htmlFor>` (`useId` gera ids únicos), `alt` descritivo nas imagens informativas e `alt=""` nas decorativas, nome acessível nos botões só com ícone (`aria-label`). Sinal: o leitor de tela anuncia “E-mail, campo de edição” e “Fechar, botão”, e não um “botão” sem nome.',
          },
          {
            titulo: "Garanta teclado e foco visível",
            texto:
              "Tudo o que se faz com o mouse também se faz com o teclado, em ordem lógica. Nunca remova o contorno de foco sem um substituto visível (`:focus-visible`). Sinal: você percorre a tela inteira com Tab e Shift+Tab e sabe sempre onde está.",
          },
          {
            titulo: "Gerencie o foco em rotas e modais",
            texto:
              "Numa SPA a troca de rota não recarrega a página: mova o foco para o título ou o `main` e atualize o `document.title`. Num modal, o foco entra, fica preso dentro, `Esc` fecha e o foco volta a quem abriu; prefira o `<dialog>` nativo ou uma biblioteca de componentes acessíveis, como o Radix UI ou o React Aria. Sinal: quem usa teclado ou leitor de tela não fica perdido na página anterior.",
          },
          {
            titulo: "Cuide do contraste e de não depender só da cor",
            texto:
              "Contraste suficiente entre texto e fundo (siga o nível das diretrizes WCAG que o projeto adota), erros indicados por texto e ícone além da cor, respeito a `prefers-reduced-motion` e a zoom e texto maior. Sinal: a interface continua usável em escala de cinza e com o texto ampliado.",
          },
          {
            titulo: "Só então ARIA, para o que o HTML não cobre",
            texto:
              'Use `aria-*` em widgets sem equivalente nativo (abas, combobox) e para anunciar mudanças dinâmicas com uma região viva (`role="status"` ou `aria-live="polite"`; `role="alert"` para erros) que **já exista no DOM** antes de o texto mudar. Regra de ouro: se um elemento nativo faz o trabalho, use o nativo. Sinal: cada atributo ARIA tem um motivo que o HTML não resolvia.',
          },
          {
            titulo: "Verifique de várias formas",
            texto:
              "Lint com `eslint-plugin-jsx-a11y` no editor e no CI; ferramentas automáticas como o axe (extensão, `jest-axe`) e o Lighthouse; testes que consultam por papel e rótulo (veja L189); navegação só por teclado; e um leitor de tela de verdade (NVDA, VoiceOver, TalkBack). Sinal: nenhuma violação automática **e** o fluxo principal concluído por teclado e por leitor de tela.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que o HTML semântico dá de graça",
        colunas: ["Elemento", "O que ganha sem esforço", "O que costuma aparecer no lugar (e falha)"],
        linhas: [
          ["`button`", "Foco, Enter e Espaço, papel anunciado e estado desabilitado", "`div` ou `span` com `onClick`"],
          ["`a href`", "Navegação, abrir em nova aba e papel de link", "`span` com `onClick` para navegar"],
          ["`label` com `input`", "Nome acessível, e clicar no rótulo foca o campo", "`placeholder` como único rótulo"],
          [
            "`nav`, `main`, `header`, `footer`",
            "Marcos que permitem ao leitor de tela pular direto a uma região",
            '`div` com `className="menu"`',
          ],
          ["`h1` a `h6`", "Estrutura da página e navegação por títulos", "Um `div` grande e em negrito"],
          ["`ul` e `li`", "Lista anunciada, com a quantidade de itens", "`div`s soltos, um por item"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Campo com rótulo, erro anunciado e id único",
        legenda: "TSX",
        codigo: `import { useId, useState } from "react";

export function CampoEmail() {
  const id = useId();
  const [erro, setErro] = useState("");
  return (
    <div>
      <label htmlFor={id}>E-mail</label>
      <input
        id={id}
        type="email"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? id + "-erro" : undefined}
        onBlur={(e) => setErro(e.target.validity.valid ? "" : "Informe um e-mail válido")}
      />
      <p id={id + "-erro"} role="alert">{erro}</p>
    </div>
  );
}`,
        nota: 'O `<p role="alert">` existe desde a primeira renderização, ainda vazio; só o texto muda. É assim que o leitor de tela percebe e anuncia o erro.',
      },
      {
        tipo: "codigo",
        titulo: "Mover o foco ao trocar de rota",
        legenda: "TSX",
        codigo: `import { useEffect, useRef, type ReactNode } from "react";

// Em uma SPA o conteúdo troca sem recarregar a página: leve o foco ao novo título
export function Pagina({ titulo, children }: { titulo: string; children: ReactNode }) {
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = titulo;
    tituloRef.current?.focus();
  }, [titulo]);

  return (
    <main>
      <h1 ref={tituloRef} tabIndex={-1}>
        {titulo}
      </h1>
      {children}
    </main>
  );
}`,
        nota: "Confira o que o seu roteador ou framework já faz sozinho; alguns anunciam a mudança de página. Não duplique o que já existe.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A automação cobre só parte, e ARIA errado piora",
        texto:
          'Ferramentas automáticas encontram só uma parte dos problemas (falta de `alt`, contraste, rótulos ausentes), mas não dizem se o `alt` faz sentido, se a ordem do foco é lógica ou se o fluxo é compreensível: isso exige teste manual com teclado e leitor de tela, idealmente com pessoas que usam tecnologia assistiva. E ARIA desnecessário ou errado (`role="button"` num `div` sem teclado, `aria-label` que contradiz o texto visível) piora a experiência em vez de melhorá-la.',
      },
    ],
    armadilhas: [
      "`div` ou `span` clicável no lugar de `button` ou `a`: sem foco, sem teclado e sem papel para o leitor de tela.",
      "Usar `placeholder` como rótulo: ele some ao digitar e não é um nome acessível confiável.",
      "Remover o contorno de foco (`outline: none`) sem oferecer outro estilo visível.",
      "Achar que passar no axe ou no Lighthouse é ser acessível: a automação cobre só parte dos problemas, e falta testar com teclado e leitor de tela.",
    ],
    autoteste: [
      {
        pergunta: "Por que “HTML semântico primeiro, ARIA depois”?",
        resposta:
          "Porque os elementos nativos já trazem papel, foco e comportamento de teclado, enquanto o ARIA só muda o que é anunciado e não adiciona comportamento: usado sem necessidade ou errado, ele piora a experiência. Use ARIA para o que o HTML não cobre.",
      },
      {
        pergunta: "O que muda na acessibilidade de uma SPA React em relação a um site tradicional?",
        resposta:
          "A troca de rota não recarrega a página, então o navegador não move o foco nem anuncia o novo título: o app precisa fazê-lo (focar o título, atualizar `document.title`), além de prender e devolver o foco em modais e anunciar mudanças dinâmicas com regiões vivas.",
      },
    ],
  },
  en: {
    titulo: "Making React apps accessible",
    pergunta: "How do you make React applications accessible?",
    porqueEsteMetodo:
      "Accessibility is a sequence of habits with a priority order: the right HTML solves most of it and ARIA comes last. A playbook with the sign of success for each step shows that order and how to verify the result.",
    resposta30s:
      "Accessibility means making the application work for people who use a keyboard, a screen reader, zoom or other assistive technologies. In React, JSX produces ordinary HTML, so start with **semantic HTML**, labels, alternative text, **visible and managed focus** and contrast, and use **ARIA** only when HTML is not enough; in an SPA, also take care of focus and announcements on every route change or modal. Verify with lint (`eslint-plugin-jsx-a11y`), automated tools, the keyboard and a screen reader.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: accessibility in React",
        passos: [
          {
            titulo: "Start with semantic HTML",
            texto:
              "Use `button` for actions, `a href` for navigation, `label` with `input`, `nav`, `main`, `header`, `footer`, headings `h1` to `h6` in order and `ul` and `li` for lists. They already bring role, focus and keyboard support. Sign of success: the screen works with Tab, Enter and Space without extra JavaScript, and no `div` with `onClick` plays the role of a button.",
          },
          {
            titulo: "Name everything interactive",
            texto:
              'Every field gets a `<label htmlFor>` (`useId` generates unique ids), informative images get a descriptive `alt` and decorative ones `alt=""`, icon-only buttons get an accessible name (`aria-label`). Sign: the screen reader announces “Email, edit field” and “Close, button”, not an unnamed “button”.',
          },
          {
            titulo: "Guarantee keyboard use and visible focus",
            texto:
              "Everything you can do with the mouse can be done with the keyboard, in a logical order. Never remove the focus outline without a visible replacement (`:focus-visible`). Sign: you walk the whole screen with Tab and Shift+Tab and always know where you are.",
          },
          {
            titulo: "Manage focus on routes and modals",
            texto:
              "In an SPA a route change does not reload the page: move focus to the title or to `main` and update `document.title`. In a modal, focus goes in, stays trapped inside, `Esc` closes it and focus returns to whoever opened it; prefer the native `<dialog>` or an accessible component library, such as Radix UI or React Aria. Sign: keyboard and screen-reader users do not get lost on the previous page.",
          },
          {
            titulo: "Handle contrast and do not rely on color alone",
            texto:
              "Enough contrast between text and background (follow the WCAG level your project adopts), errors shown with text and an icon besides color, respect for `prefers-reduced-motion` and for zoom and larger text. Sign: the interface stays usable in grayscale and with enlarged text.",
          },
          {
            titulo: "Only then ARIA, for what HTML does not cover",
            texto:
              'Use `aria-*` on widgets with no native equivalent (tabs, combobox) and to announce dynamic changes with a live region (`role="status"` or `aria-live="polite"`; `role="alert"` for errors) that **already exists in the DOM** before the text changes. Golden rule: if a native element does the job, use the native one. Sign: every ARIA attribute has a reason that HTML did not solve.',
          },
          {
            titulo: "Verify in several ways",
            texto:
              "Lint with `eslint-plugin-jsx-a11y` in the editor and in CI; automated tools such as axe (extension, `jest-axe`) and Lighthouse; tests that query by role and label (see L189); keyboard-only navigation; and a real screen reader (NVDA, VoiceOver, TalkBack). Sign: no automated violations **and** the main flow completed by keyboard and by screen reader.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What semantic HTML gives you for free",
        colunas: ["Element", "What you get without effort", "What often shows up instead (and fails)"],
        linhas: [
          [
            "`button`",
            "Focus, Enter and Space, an announced role and a disabled state",
            "`div` or `span` with `onClick`",
          ],
          ["`a href`", "Navigation, open in a new tab and the link role", "`span` with `onClick` to navigate"],
          [
            "`label` with `input`",
            "An accessible name, and clicking the label focuses the field",
            "`placeholder` as the only label",
          ],
          [
            "`nav`, `main`, `header`, `footer`",
            "Landmarks that let a screen reader jump straight to a region",
            '`div` with `className="menu"`',
          ],
          ["`h1` to `h6`", "Page structure and navigation by headings", "A big, bold `div`"],
          ["`ul` and `li`", "An announced list, with the number of items", "Loose `div`s, one per item"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A field with a label, an announced error and a unique id",
        legenda: "TSX",
        codigo: `import { useId, useState } from "react";

export function EmailField() {
  const id = useId();
  const [error, setError] = useState("");
  return (
    <div>
      <label htmlFor={id}>Email</label>
      <input
        id={id}
        type="email"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? id + "-error" : undefined}
        onBlur={(e) => setError(e.target.validity.valid ? "" : "Enter a valid email")}
      />
      <p id={id + "-error"} role="alert">{error}</p>
    </div>
  );
}`,
        nota: 'The `<p role="alert">` exists from the first render, still empty; only the text changes. That is how a screen reader notices and announces the error.',
      },
      {
        tipo: "codigo",
        titulo: "Moving focus when the route changes",
        legenda: "TSX",
        codigo: `import { useEffect, useRef, type ReactNode } from "react";

// In an SPA the content swaps without a page reload: send focus to the new title
export function Page({ title, children }: { title: string; children: ReactNode }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = title;
    titleRef.current?.focus();
  }, [title]);

  return (
    <main>
      <h1 ref={titleRef} tabIndex={-1}>
        {title}
      </h1>
      {children}
    </main>
  );
}`,
        nota: "Check what your router or framework already does by itself; some announce the page change. Do not duplicate what already exists.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Automation covers only part, and wrong ARIA makes things worse",
        texto:
          'Automated tools find only a share of the problems (missing `alt`, contrast, missing labels), but they cannot tell whether the `alt` makes sense, whether the focus order is logical or whether a flow is understandable: that takes manual testing with a keyboard and a screen reader, ideally with people who use assistive technology. And unnecessary or wrong ARIA (`role="button"` on a `div` with no keyboard support, an `aria-label` that contradicts the visible text) worsens the experience instead of improving it.',
      },
    ],
    armadilhas: [
      "A clickable `div` or `span` in place of `button` or `a`: no focus, no keyboard and no role for the screen reader.",
      "Using `placeholder` as the label: it disappears when typing and is not a reliable accessible name.",
      "Removing the focus outline (`outline: none`) without offering another visible style.",
      "Thinking that passing axe or Lighthouse means being accessible: automation covers only part of the problems, and keyboard and screen-reader testing is still missing.",
    ],
    autoteste: [
      {
        pergunta: "Why “semantic HTML first, ARIA second”?",
        resposta:
          "Because native elements already bring role, focus and keyboard behavior, while ARIA only changes what is announced and adds no behavior: used unnecessarily or wrongly, it makes the experience worse. Use ARIA for what HTML does not cover.",
      },
      {
        pergunta: "What changes for the accessibility of a React SPA compared with a traditional site?",
        resposta:
          "A route change does not reload the page, so the browser neither moves focus nor announces the new title: the app must do it (focus the title, update `document.title`), as well as trap and restore focus in modals and announce dynamic changes with live regions.",
      },
    ],
  },
};
