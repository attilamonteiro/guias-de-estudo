import type { Pergunta } from "../../tipos";

// L49 · O que é useRef
export const l049: Pergunta = {
  numero: 49,
  modulo: "linkedin-hooks",
  metodo: "feynman",
  pt: {
    titulo: "O que é useRef",
    pergunta: "O que é useRef()?",
    porqueEsteMetodo:
      "O erro clássico é confundir ref com state. A imagem de uma gaveta que o React não vigia, ao lado do quadro de avisos que ele vigia, separa os dois de forma que não se esquece.",
    resposta30s:
      "`useRef(inicial)` devolve um objeto `{ current }` que o React mantém **igual entre renderizações**, e alterar `current` **não dispara nova renderização**. Use para guardar um **nó do DOM** (foco, medidas, rolagem) ou um **valor mutável que não aparece na tela** (id de timer, valor anterior). Se a interface depende do valor, ele é **state**, e `current` não se lê nem se escreve durante a renderização.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no componente como uma sala com um quadro de avisos na parede e uma gaveta ao lado. O quadro é o **state**: quando alguém troca um aviso, o React percebe e redesenha a sala. A gaveta é o **ref**: você abre e troca o que está dentro quando quiser, e o React nem fica sabendo, então nada é redesenhado. É sempre a mesma gaveta, de uma renderização para a outra.",
        tecnico:
          "`useRef(inicial)` devolve um objeto `{ current: inicial }` com a **mesma identidade** durante toda a vida do componente. Alterar `ref.current` não dispara renderização. Há dois usos: (1) apontar para um **nó do DOM**: com `<input ref={campo} />`, o React preenche `campo.current` ao confirmar a renderização e o devolve a `null` na desmontagem, o que serve para foco, medidas, rolagem e mídia; (2) guardar um **valor mutável fora da tela**, como o id de um timer, o valor anterior de uma prop ou a instância de uma biblioteca que não é React. Para repassar um ref a um componente de função, veja a forma atual em react.dev (`ref` como prop nas versões recentes; `forwardRef` antes).",
        limite:
          "A gaveta não avisa ninguém. Se o dado aparece na tela, ele tem de ser **state**, senão a interface fica desatualizada. E ninguém abre a gaveta enquanto a sala está sendo montada: ler ou escrever `ref.current` durante a renderização torna o resultado imprevisível. Faça isso em eventos e efeitos.",
      },
      {
        tipo: "tabela",
        titulo: "Ref ou state?",
        colunas: ["Pergunta", "`useState`", "`useRef`"],
        linhas: [
          ["Mudar o valor re-renderiza?", "Sim, pelo setter", "Não"],
          ["Pode aparecer na tela?", "Sim, é para isso", "Não: o React não saberia atualizar"],
          [
            "Quando se lê e se escreve?",
            "Pode ser lido durante a renderização",
            "Em eventos e efeitos, não na renderização",
          ],
          [
            "O que o React guarda entre renderizações?",
            "O valor de cada renderização (uma foto)",
            "O mesmo objeto, cujo `current` você muda",
          ],
          [
            "Exemplos",
            "Texto digitado, aba aberta, item selecionado",
            "Foco de um campo, id de timer, valor anterior, instância de player",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os dois usos no mesmo componente: busca com atraso e foco",
        legenda: "TSX",
        codigo: `import { useRef, useState } from "react";

export function Busca() {
  const [texto, setTexto] = useState("");
  const campo = useRef<HTMLInputElement>(null); // nó do DOM
  const timer = useRef<number | null>(null); // valor mutável, fora da tela

  function aoDigitar(valor: string) {
    setTexto(valor);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => console.log("buscar", valor), 500);
  }

  return (
    <>
      <input ref={campo} value={texto} onChange={(e) => aoDigitar(e.target.value)} />
      <button onClick={() => campo.current?.focus()}>Focar</button>
    </>
  );
}`,
        nota: "O id do timer muda sem redesenhar nada; o que aparece na tela (`texto`) é state, e o nó do DOM só é tocado dentro de um evento. Por brevidade falta limpar o timer ao desmontar, o que se faz num `useEffect` de limpeza.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Se a interface **depende** do valor, use state. Se é algo que você precisa **lembrar sem redesenhar**, ou um nó do DOM para uma ação pontual (foco, rolagem, medida), use ref.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Fora da renderização",
        texto:
          "Não leia nem escreva `ref.current` durante a renderização; a exceção documentada é a inicialização preguiçosa (`if (ref.current === null) ref.current = criar()`). Também não use ref para alterar conteúdo que o React gerencia no DOM: ele e você brigariam pelo mesmo nó. Use refs para o que props não expressam, e confira em react.dev a seção sobre refs.",
      },
    ],
    armadilhas: [
      "Guardar num ref algo que aparece na tela: mudar `current` não atualiza a interface, e ela fica desatualizada.",
      "Ler ou escrever `ref.current` durante a renderização: o corpo do componente deve ser puro, e o React pode renderizar mais de uma vez.",
      "Usar `ref.current` de um nó do DOM antes de ele existir: na primeira renderização e antes do commit o valor é `null`. Acesse em efeitos ou eventos e cheque o `null`.",
      "Trocar um ref por uma variável de módulo: a variável é compartilhada por todas as instâncias do componente, o ref é de cada instância.",
    ],
    autoteste: [
      {
        pergunta: "Por que atribuir `ref.current = valor` não atualiza a tela?",
        resposta:
          "Porque o React só renderiza de novo quando o state muda (pelo setter) ou quando o pai renderiza. O ref é um objeto simples, sem inscrição: mudar `current` não avisa ninguém.",
      },
      {
        pergunta: "Quando usar um ref em vez de state?",
        resposta:
          "Quando o valor não afeta o que é desenhado e precisa sobreviver às renderizações (id de timer, valor anterior), ou para acessar um nó do DOM (foco, medidas). Se a tela depende do valor, é state.",
      },
    ],
  },
  en: {
    titulo: "What useRef is",
    pergunta: "What is useRef()?",
    porqueEsteMetodo:
      "The classic mistake is confusing ref with state. The image of a drawer React does not watch, next to the notice board it does watch, keeps the two apart in a way you will not forget.",
    resposta30s:
      "`useRef(initial)` returns a `{ current }` object that React keeps **the same across renders**, and changing `current` **does not trigger a new render**. Use it to hold a **DOM node** (focus, measurements, scrolling) or a **mutable value that does not appear on screen** (a timer id, a previous value). If the UI depends on the value, it is **state**, and `current` is neither read nor written during rendering.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the component as a room with a notice board on the wall and a drawer beside it. The board is **state**: when someone changes a notice, React notices and redraws the room. The drawer is the **ref**: you open it and swap what is inside whenever you like, and React never finds out, so nothing is redrawn. It is always the same drawer, from one render to the next.",
        tecnico:
          "`useRef(initial)` returns a `{ current: initial }` object with the **same identity** for the whole life of the component. Changing `ref.current` does not trigger a render. There are two uses: (1) pointing to a **DOM node**: with `<input ref={field} />`, React fills `field.current` when it commits the render and sets it back to `null` on unmount, which is useful for focus, measurements, scrolling and media; (2) holding a **mutable value outside the screen**, such as a timer id, the previous value of a prop or the instance of a non-React library. To pass a ref into a function component, see the current form on react.dev (`ref` as a prop in recent versions; `forwardRef` before).",
        limite:
          "The drawer tells nobody. If the data shows on screen, it has to be **state**, or the UI goes stale. And nobody opens the drawer while the room is being assembled: reading or writing `ref.current` during rendering makes the result unpredictable. Do it in events and effects.",
      },
      {
        tipo: "tabela",
        titulo: "Ref or state?",
        colunas: ["Question", "`useState`", "`useRef`"],
        linhas: [
          ["Does changing the value re-render?", "Yes, through the setter", "No"],
          ["Can it appear on screen?", "Yes, that is what it is for", "No: React would not know to update"],
          [
            "When is it read and written?",
            "It can be read during rendering",
            "In events and effects, not during rendering",
          ],
          [
            "What does React keep between renders?",
            "The value of each render (a snapshot)",
            "The same object, whose `current` you change",
          ],
          [
            "Examples",
            "Typed text, open tab, selected item",
            "A field’s focus, a timer id, a previous value, a player instance",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Both uses in the same component: delayed search and focus",
        legenda: "TSX",
        codigo: `import { useRef, useState } from "react";

export function Search() {
  const [text, setText] = useState("");
  const field = useRef<HTMLInputElement>(null); // DOM node
  const timer = useRef<number | null>(null); // mutable value, off screen

  function onType(value: string) {
    setText(value);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => console.log("search", value), 500);
  }

  return (
    <>
      <input ref={field} value={text} onChange={(e) => onType(e.target.value)} />
      <button onClick={() => field.current?.focus()}>Focus</button>
    </>
  );
}`,
        nota: "The timer id changes without redrawing anything; what shows on screen (`text`) is state, and the DOM node is only touched inside an event. For brevity the timer is not cleared on unmount, which is done in a `useEffect` cleanup.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "If the UI **depends** on the value, use state. If it is something you need to **remember without redrawing**, or a DOM node for a one-off action (focus, scrolling, measuring), use a ref.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Outside rendering",
        texto:
          "Do not read or write `ref.current` during rendering; the documented exception is lazy initialization (`if (ref.current === null) ref.current = create()`). Also do not use a ref to change content React manages in the DOM: you and React would fight over the same node. Use refs for what props cannot express, and check the refs section on react.dev.",
      },
    ],
    armadilhas: [
      "Keeping something that appears on screen in a ref: changing `current` does not update the UI, which goes stale.",
      "Reading or writing `ref.current` during rendering: the component body must be pure, and React may render more than once.",
      "Using a DOM node’s `ref.current` before it exists: on the first render and before the commit the value is `null`. Access it in effects or events and check for `null`.",
      "Swapping a ref for a module-level variable: the variable is shared by every instance of the component, while a ref belongs to each instance.",
    ],
    autoteste: [
      {
        pergunta: "Why does assigning `ref.current = value` not update the screen?",
        resposta:
          "Because React only renders again when state changes (through the setter) or when the parent renders. A ref is a plain object with no subscription: changing `current` tells nobody.",
      },
      {
        pergunta: "When should you use a ref instead of state?",
        resposta:
          "When the value does not affect what is drawn and must survive renders (a timer id, a previous value), or to reach a DOM node (focus, measurements). If the screen depends on the value, it is state.",
      },
    ],
  },
};
