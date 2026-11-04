import type { Pergunta } from "../../tipos";

// L212 · O que é ARIA
export const l212: Pergunta = {
  numero: 212,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "whys",
  pt: {
    titulo: "O que é ARIA",
    pergunta: "O que é ARIA?",
    porqueEsteMetodo:
      "A regra de ouro do ARIA (“prefira o elemento nativo”) parece dogma até você seguir os porquês: o que o navegador entrega à tecnologia assistiva, o que o ARIA muda de fato, o que ele não muda e por que um atributo errado é pior que nenhum.",
    resposta30s:
      "**ARIA** (Accessible Rich Internet Applications) é um conjunto de atributos HTML (`role`, `aria-label`, `aria-expanded`, `aria-live`…) que **descrevem papel, nome e estado** de um elemento às tecnologias assistivas quando o HTML nativo não consegue. Ele **só muda a descrição, nunca o comportamento**: não dá foco nem teclado. Por isso a primeira regra é **usar o elemento nativo** (`<button>`, `<nav>`, `<dialog>`) e deixar o ARIA para o que o HTML não cobre, mantendo-o **sincronizado com o estado do React**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o ARIA existe?",
            resposta:
              "Porque o leitor de tela não lê a tela: lê a **árvore de acessibilidade**, que o navegador monta a partir do DOM com papel, nome, estado e valor de cada nó. Elementos nativos entram nela já corretos (um `<button>` é um botão com nome). Um `<div>` com `onClick` entra como um bloco genérico. O ARIA é o jeito de **completar essa árvore** quando você cria widgets que o HTML não tem (abas, combobox, árvore) ou precisa de informação que ele não dá (nome de um botão só com ícone, região que se atualiza sozinha).",
          },
          {
            pergunta: "Por que a primeira regra é preferir o elemento nativo?",
            resposta:
              'Porque o nativo traz papel, nome, **foco, teclado e estados** de graça, testados por anos. O `<button>` é focável, responde a Enter e Espaço e respeita `disabled`. Um `<div role="button">` ganha **apenas o papel**: o ARIA não adiciona comportamento, então você precisa escrever `tabIndex`, os eventos de teclado e o estilo de foco. Cada linha a mais é um lugar para errar (veja L213).',
          },
          {
            pergunta: "Por que ARIA mal usado piora a experiência?",
            resposta:
              'Porque ele **sobrepõe** o que o navegador calcularia, e quem usa leitor de tela confia no que é anunciado. Um `role="button"` num link, um `aria-hidden="true"` num elemento focável (o foco cai no vazio), um `aria-label` diferente do texto visível (quem usa comando de voz diz o que vê e não é entendido) ou um `aria-expanded` que nunca muda são **informações falsas**. Daí a máxima: nenhum ARIA é melhor que ARIA errado.',
          },
          {
            pergunta: "Por que o estado precisa ficar sincronizado com o React?",
            resposta:
              "Porque `aria-expanded`, `aria-selected`, `aria-checked` e companhia são só **atributos de saída**: o React não sabe que eles significam algo. A fonte da verdade é o seu estado, e o atributo deve ser **derivado dele** no JSX (`aria-expanded={aberto}`), junto com o visual. Se o visual muda por um caminho e o atributo por outro, eles divergem: a tela mostra uma coisa e o leitor anuncia outra. Em JSX os atributos mantêm o hífen (`aria-label`), não viram camelCase.",
          },
          {
            pergunta: "Quando, então, o ARIA é a ferramenta certa?",
            resposta:
              'Quando o HTML não tem o elemento: padrões compostos como abas, combobox, árvore e menu (siga o guia de práticas de autoria do ARIA, o APG). Ou quando falta uma informação: nome acessível (`aria-label`, `aria-labelledby`), descrição (`aria-describedby`), relação (`aria-controls`), item atual (`aria-current`) e **regiões vivas** (`role="status"`, `aria-live`), que anunciam mensagens sem o foco se mover. Para a região viva funcionar, o contêiner deve existir antes de o texto mudar.',
          },
        ],
        causaRaiz:
          "O ARIA muda **o que é dito** sobre o elemento, nunca **o que ele faz**. É uma promessa feita à tecnologia assistiva: o seu código precisa **cumpri-la** (foco, teclado, estado em dia) ou é melhor não fazê-la.",
      },
      {
        tipo: "codigo",
        titulo: "Nativo primeiro, ARIA para o que falta",
        legenda: "JSX",
        codigo: `// Ruim: só tem o papel; faltam foco, Enter e Espaço
<div role="button" onClick={salvar}>Salvar</div>

// Bom: o elemento nativo já traz papel, nome, foco e teclado
<button type="button" onClick={salvar}>Salvar</button>

// ARIA onde o HTML não basta: botão só com ícone precisa de nome
<button type="button" aria-label="Fechar">
  <IconeX aria-hidden="true" />
</button>

// Região viva: o contêiner existe desde o início e só o texto muda
<p role="status">{mensagem}</p>`,
        nota: "`IconeX` é um componente de ícone qualquer. O `aria-hidden` no ícone evita que ele seja lido em dobro; o nome do botão vem do `aria-label`.",
      },
      {
        tipo: "codigo",
        titulo: "Estado do React comandando o ARIA",
        legenda: "TSX",
        codigo: `import { useId, useState, type ReactNode } from "react";

export function Detalhes({ titulo, children }: { titulo: string; children: ReactNode }) {
  const [aberto, setAberto] = useState(false);
  const idPainel = useId();

  return (
    <section>
      <button type="button" aria-expanded={aberto} aria-controls={idPainel} onClick={() => setAberto((v) => !v)}>
        {titulo}
      </button>
      <div id={idPainel} hidden={!aberto}>
        {children}
      </div>
    </section>
  );
}`,
        nota: "O mesmo estado `aberto` comanda o `hidden` e o `aria-expanded`, então eles não têm como divergir. Para o caso simples, `<details>` e `<summary>` nativos dispensam tudo isso.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "As regras de uso, em ordem",
        texto:
          '1) Se existe um elemento nativo com a semântica e o comportamento, use-o. 2) Não mude a semântica nativa (em vez de `<h2 role="button">`, coloque um `<button>` dentro do `<h2>`). 3) Todo controle ARIA precisa funcionar pelo teclado. 4) Não esconda com `aria-hidden` nem `role="presentation"` um elemento focável. 5) Todo controle interativo precisa de **nome acessível**.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "ARIA não se valida só lendo o código",
        texto:
          "Um linter como o `eslint-plugin-jsx-a11y` pega papéis e atributos inválidos, mas não garante a experiência. Confira a árvore de acessibilidade nas ferramentas do navegador, percorra a tela só com o teclado e teste com um leitor de tela (veja L214).",
      },
    ],
    armadilhas: [
      'Colocar `role="button"` num `<div>` e achar que acabou: sem `tabIndex`, Enter/Espaço e foco visível, o teclado não consegue usá-lo.',
      'Repetir o que o HTML já diz (`<button role="button">`, `<nav role="navigation">`) ou sobrescrever a semântica nativa.',
      '`aria-hidden="true"` em algo que contém elementos focáveis, ou `aria-label` diferente do texto visível do controle.',
      "Atributo de estado que não acompanha o estado (um `aria-expanded` fixo em `false`), ou região viva criada junto com a mensagem, que o leitor de tela pode nem anunciar.",
    ],
    autoteste: [
      {
        pergunta: "O que o ARIA muda e o que ele não muda?",
        resposta:
          "Muda a descrição (papel, nome, estado, relações) que o navegador entrega à tecnologia assistiva. Não muda aparência, foco, teclado nem comportamento: isso continua sendo do seu código.",
      },
      {
        pergunta: 'Um colega escreveu `<div role="button" onClick={salvar}>`. O que falta e qual é a melhor correção?',
        resposta:
          'Faltam foco (`tabIndex`), ativação por Enter e Espaço e foco visível. A melhor correção é trocar por `<button type="button">`, que já traz tudo isso.',
      },
    ],
  },
  en: {
    titulo: "What is ARIA",
    pergunta: "What is ARIA?",
    porqueEsteMetodo:
      "The golden rule of ARIA (“prefer the native element”) feels like dogma until you follow the whys: what the browser hands to assistive technology, what ARIA really changes, what it does not change and why a wrong attribute is worse than none.",
    resposta30s:
      "**ARIA** (Accessible Rich Internet Applications) is a set of HTML attributes (`role`, `aria-label`, `aria-expanded`, `aria-live`…) that **describe the role, name and state** of an element to assistive technology when native HTML cannot. It **only changes the description, never the behavior**: it adds no focus and no keyboard support. That is why the first rule is to **use the native element** (`<button>`, `<nav>`, `<dialog>`) and keep ARIA for what HTML does not cover, **kept in sync with React state**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does ARIA exist?",
            resposta:
              "Because a screen reader does not read the screen: it reads the **accessibility tree**, which the browser builds from the DOM with the role, name, state and value of each node. Native elements enter it already correct (a `<button>` is a button with a name). A `<div>` with `onClick` enters as a generic block. ARIA is the way to **complete that tree** when you build widgets HTML does not have (tabs, combobox, tree) or need information it does not give (the name of an icon-only button, a region that updates on its own).",
          },
          {
            pergunta: "Why is the first rule to prefer the native element?",
            resposta:
              'Because the native element brings role, name, **focus, keyboard and states** for free, tested for years. A `<button>` is focusable, responds to Enter and Space and respects `disabled`. A `<div role="button">` gets **only the role**: ARIA adds no behavior, so you must write `tabIndex`, the keyboard events and the focus style yourself. Every extra line is a place to get it wrong (see L213).',
          },
          {
            pergunta: "Why does misused ARIA make the experience worse?",
            resposta:
              'Because it **overrides** what the browser would compute, and screen reader users trust what is announced. A `role="button"` on a link, an `aria-hidden="true"` on a focusable element (focus lands on nothing), an `aria-label` that differs from the visible text (voice-control users say what they see and are not understood) or an `aria-expanded` that never changes are all **false information**. Hence the maxim: no ARIA is better than bad ARIA.',
          },
          {
            pergunta: "Why must the state stay in sync with React?",
            resposta:
              "Because `aria-expanded`, `aria-selected`, `aria-checked` and friends are just **output attributes**: React does not know they mean anything. The source of truth is your state, and the attribute must be **derived from it** in the JSX (`aria-expanded={open}`), together with the visuals. If the visuals change one way and the attribute another, they drift apart: the screen shows one thing and the reader announces another. In JSX the attributes keep their hyphen (`aria-label`), they do not become camelCase.",
          },
          {
            pergunta: "So when is ARIA the right tool?",
            resposta:
              'When HTML has no such element: composite patterns such as tabs, combobox, tree and menu (follow the ARIA Authoring Practices Guide, the APG). Or when a piece of information is missing: accessible name (`aria-label`, `aria-labelledby`), description (`aria-describedby`), relationship (`aria-controls`), current item (`aria-current`) and **live regions** (`role="status"`, `aria-live`), which announce messages without focus moving. For a live region to work, its container must exist before the text changes.',
          },
        ],
        causaRaiz:
          "ARIA changes **what is said** about an element, never **what it does**. It is a promise made to assistive technology: your code must **keep it** (focus, keyboard, state up to date) or it is better not to make it.",
      },
      {
        tipo: "codigo",
        titulo: "Native first, ARIA for what is missing",
        legenda: "JSX",
        codigo: `// Bad: it only has the role; focus, Enter and Space are missing
<div role="button" onClick={save}>Save</div>

// Good: the native element already brings role, name, focus and keyboard
<button type="button" onClick={save}>Save</button>

// ARIA where HTML is not enough: an icon-only button needs a name
<button type="button" aria-label="Close">
  <IconX aria-hidden="true" />
</button>

// Live region: the container exists from the start and only the text changes
<p role="status">{message}</p>`,
        nota: "`IconX` is any icon component. The `aria-hidden` on the icon keeps it from being read twice; the button’s name comes from the `aria-label`.",
      },
      {
        tipo: "codigo",
        titulo: "React state driving ARIA",
        legenda: "TSX",
        codigo: `import { useId, useState, type ReactNode } from "react";

export function Details({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section>
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
        {title}
      </button>
      <div id={panelId} hidden={!open}>
        {children}
      </div>
    </section>
  );
}`,
        nota: "The same `open` state drives both `hidden` and `aria-expanded`, so they cannot drift apart. For the simple case, native `<details>` and `<summary>` make all of this unnecessary.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rules of use, in order",
        texto:
          '1) If a native element has the semantics and behavior, use it. 2) Do not change native semantics (instead of `<h2 role="button">`, put a `<button>` inside the `<h2>`). 3) Every ARIA control must work with the keyboard. 4) Do not hide a focusable element with `aria-hidden` or `role="presentation"`. 5) Every interactive control needs an **accessible name**.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "ARIA cannot be validated just by reading the code",
        texto:
          "A linter such as `eslint-plugin-jsx-a11y` catches invalid roles and attributes, but it does not guarantee the experience. Check the accessibility tree in the browser tools, walk the screen with the keyboard alone and test with a screen reader (see L214).",
      },
    ],
    armadilhas: [
      'Putting `role="button"` on a `<div>` and thinking you are done: without `tabIndex`, Enter/Space and a visible focus, the keyboard cannot use it.',
      'Repeating what HTML already says (`<button role="button">`, `<nav role="navigation">`) or overriding native semantics.',
      '`aria-hidden="true"` on something that contains focusable elements, or an `aria-label` that differs from the control’s visible text.',
      "A state attribute that does not follow the state (an `aria-expanded` stuck at `false`), or a live region created together with its message, which a screen reader may never announce.",
    ],
    autoteste: [
      {
        pergunta: "What does ARIA change and what does it not change?",
        resposta:
          "It changes the description (role, name, state, relationships) the browser hands to assistive technology. It does not change appearance, focus, keyboard or behavior: those remain your code’s job.",
      },
      {
        pergunta: 'A colleague wrote `<div role="button" onClick={save}>`. What is missing and what is the best fix?',
        resposta:
          'Focus (`tabIndex`), activation by Enter and Space and a visible focus are missing. The best fix is to swap it for `<button type="button">`, which already brings all of that.',
      },
    ],
  },
};
