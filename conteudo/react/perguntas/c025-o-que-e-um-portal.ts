import type { Pergunta } from "../../tipos";

// C25 · O que é um portal
export const c025: Pergunta = {
  numero: 525,
  modulo: "coddy-avancado",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é um portal",
    pergunta: "O que é um portal?",
    porqueEsteMetodo:
      "O portal parece um recurso exótico até você ver o problema que o originou: um modal preso dentro de um contêiner com `overflow: hidden`. Partir da solução ingênua e consertar uma restrição por vez mostra por que a ferramenta tem este formato.",
    resposta30s:
      "Um **portal** (`createPortal(filhos, nóDoDOM)`, de `react-dom`) renderiza os filhos em **outro nó do DOM**, fora do contêiner do componente, **sem mudar a árvore do React**. Serve para modais, tooltips e menus que precisam escapar de `overflow: hidden`, de `z-index` e do posicionamento do pai. Como a árvore do React é a mesma, **context, estado e props continuam valendo** e os **eventos sobem pela árvore do React**, não pela do DOM; a acessibilidade (foco, teclado, leitor de tela) continua sendo sua responsabilidade.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Um modal, tooltip ou menu que apareça **por cima** de tudo, mas continue sendo declarado dentro do componente que o possui: com acesso ao estado e às props dele, e no mesmo lugar do JSX.",
          },
          {
            titulo: "1. A versão mais simples: renderizar no lugar",
            texto:
              "Colocar o JSX do modal onde o componente está, com `position: fixed` ou `absolute`. → Quebra: um ancestral com `overflow: hidden` recorta o que está posicionado dentro dele; um ancestral com `transform`, `filter` ou `perspective` vira a referência do `position: fixed`, e o modal deixa de ser relativo à janela; e o `z-index` só compete dentro do seu contexto de empilhamento, então um `z-index: 9999` aqui ainda pode perder para outro elemento.",
          },
          {
            titulo: "2. Brigar com o CSS",
            texto:
              "Subir `z-index`, tirar `overflow`, mexer nos ancestrais. → Quebra: vira uma corrida frágil; cada novo contêiner pode estragar o resultado, e o componente passa a depender do lugar onde é usado.",
          },
          {
            titulo: "3. Tirar o elemento do lugar à mão",
            texto:
              "Mover o nó no DOM com `document.body.appendChild` ou montar uma segunda raiz do React. → Quebra: o React perde o controle do nó movido; uma raiz separada perde o **context**, o estado compartilhado e a ligação de eventos com o componente de origem, e a limpeza fica por sua conta.",
          },
          {
            titulo: "4. O portal: DOM num lugar, React no outro",
            texto:
              "`createPortal(filhos, document.body)` diz ao React: desenhe estes filhos **fisicamente** neste nó, mas continue tratando-os como filhos do componente que os declarou. → Resolve: o modal escapa do `overflow`, do `transform` e do `z-index` do pai; context, estado e props funcionam; ao sair do JSX, o React remove o nó sozinho.",
          },
          {
            titulo: "5. Consequências para eventos e CSS",
            texto:
              "Eventos sobem pela **árvore do React**: um clique dentro do portal chega ao `onClick` de um ancestral React, mesmo que o nó não seja descendente dele no DOM. Isso permite reaproveitar um handler no pai, mas surpreende quando não era esperado (pare a propagação se for o caso). Já a herança de CSS e os seletores descendentes seguem o **DOM**: o modal em `document.body` não herda a fonte nem a cor do cartão onde foi declarado.",
          },
          {
            titulo: "6. O que o portal não resolve",
            texto:
              "O portal move só o DOM, não o comportamento: foco, teclado e leitor de tela passam a ser sua responsabilidade (veja o aviso). E no servidor não existe `document`, então crie o portal só depois da montagem.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que segue a árvore do React e o que segue o DOM",
        colunas: ["Aspecto", "Segue a árvore do…", "Efeito prático"],
        linhas: [
          ["Context, estado e props", "React", "O modal lê o tema e o usuário do ancestral que o declarou"],
          [
            "Propagação de eventos",
            "React",
            "Um clique no modal borbulha até o `onClick` do pai, embora no DOM o nó esteja em outro lugar",
          ],
          ["Desmontagem", "React", "Sair do JSX remove o nó do portal"],
          [
            "Herança de CSS e seletores descendentes",
            "DOM",
            "Fonte, cor e `.pai .filho` não alcançam o modal em `document.body`",
          ],
          [
            "`overflow`, `z-index`, `position`, `transform`",
            "DOM",
            "O modal escapa do recorte e dos contextos de empilhamento do pai",
          ],
          ["Ordem de tabulação e leitor de tela", "DOM", "O modal fica no fim do `body`: gerencie o foco e os papéis"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um modal em portal",
        legenda: "JSX",
        codigo: `import { useState } from "react";
import { createPortal } from "react-dom";

function Modal({ aoFechar }) {
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Detalhes">
      <p>Olá!</p>
      <button onClick={aoFechar}>Fechar</button>
    </div>,
    document.body, // o DOM vai para o body; a árvore do React não muda
  );
}

export function Cartao() {
  const [aberto, setAberto] = useState(false);
  return (
    <section style={{ overflow: "hidden", transform: "scale(1)" }}>
      <button onClick={() => setAberto(true)}>Abrir</button>
      {aberto && <Modal aoFechar={() => setAberto(false)} />}
    </section>
  );
}`,
        nota: "Sem o portal, o `overflow` e o `transform` do `section` prenderiam o modal; com ele, o modal vai para o `body`. O exemplo não gerencia o foco: veja o aviso.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "Use portal quando o **visual** precisa escapar do contêiner (modal, tooltip, menu suspenso, notificação), mas a **lógica** continua pertencendo ao componente. O portal muda **onde o DOM vai**, não **quem é o pai no React**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Portal não é acessibilidade",
        texto:
          'Um modal em portal ainda precisa de foco gerenciado: mover o foco para dentro ao abrir, prendê-lo ali, devolvê-lo ao gatilho ao fechar, fechar com Escape, e ter `role="dialog"`, `aria-modal` e um nome acessível. Como o nó fica no fim do `body`, a ordem de tabulação e a leitura por leitor de tela seguem o DOM, não o JSX. Prefira o `<dialog>` nativo ou uma biblioteca de acessibilidade testada a reinventar isso.',
      },
    ],
    armadilhas: [
      "Achar que o portal tira o componente da árvore do React: a árvore é a mesma, só o DOM muda de lugar.",
      "Ser surpreendido por eventos que borbulham até o pai: o clique no modal alcança o `onClick` do ancestral React; pare a propagação se isso for um problema.",
      'Esquecer a acessibilidade: sem foco gerenciado, sem Escape e sem `role="dialog"`, o modal fica quase inutilizável por teclado e leitor de tela.',
      "Usar `document.body` durante a renderização no servidor, ou antes de o contêiner existir: crie o portal depois da montagem.",
    ],
    autoteste: [
      {
        pergunta: "O que um portal muda e o que ele não muda?",
        resposta:
          "Muda o lugar do DOM onde os filhos são desenhados. Não muda a árvore do React: context, estado, props e a propagação de eventos continuam como se os filhos estivessem no lugar do JSX.",
      },
      {
        pergunta:
          "Por que um modal desenhado dentro de um cartão pode ser recortado ou ficar atrás de outros elementos, e como o portal resolve?",
        resposta:
          "Um ancestral com `overflow: hidden` recorta o que está posicionado dentro dele; `transform`, `filter` e `perspective` mudam a referência do `position: fixed`; e o `z-index` só vale dentro do contexto de empilhamento do ancestral. O portal desenha o modal em `document.body`, fora desses ancestrais.",
      },
    ],
  },
  en: {
    titulo: "What a portal is",
    pergunta: "What is a portal?",
    porqueEsteMetodo:
      "A portal looks like an exotic feature until you see the problem that produced it: a modal stuck inside a container with `overflow: hidden`. Starting from the naive solution and fixing one constraint at a time shows why the tool has this shape.",
    resposta30s:
      "A **portal** (`createPortal(children, domNode)`, from `react-dom`) renders children into **another DOM node**, outside the component’s container, **without changing the React tree**. It is for modals, tooltips and menus that must escape the parent’s `overflow: hidden`, `z-index` and positioning. Because the React tree is the same, **context, state and props keep working** and **events bubble through the React tree**, not the DOM one; accessibility (focus, keyboard, screen readers) remains your responsibility.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it up, one constraint at a time",
        passos: [
          {
            titulo: "0. What we want",
            texto:
              "A modal, tooltip or menu that shows up **on top** of everything, yet is still declared inside the component that owns it: with access to its state and props, and in the same place in the JSX.",
          },
          {
            titulo: "1. The simplest version: render in place",
            texto:
              "Put the modal’s JSX where the component is, with `position: fixed` or `absolute`. → Breaks: an ancestor with `overflow: hidden` clips what is positioned inside it; an ancestor with `transform`, `filter` or `perspective` becomes the reference for `position: fixed`, so the modal is no longer relative to the window; and `z-index` only competes inside its stacking context, so a `z-index: 9999` here can still lose to another element.",
          },
          {
            titulo: "2. Fight the CSS",
            texto:
              "Raise `z-index`, remove `overflow`, touch the ancestors. → Breaks: it becomes a fragile arms race; every new container can spoil the result, and the component starts depending on where it is used.",
          },
          {
            titulo: "3. Move the element by hand",
            texto:
              "Move the node in the DOM with `document.body.appendChild`, or mount a second React root. → Breaks: React loses control of the moved node; a separate root loses **context**, shared state and the event link with the originating component, and cleanup is on you.",
          },
          {
            titulo: "4. The portal: DOM in one place, React in another",
            texto:
              "`createPortal(children, document.body)` tells React: draw these children **physically** in this node, but keep treating them as children of the component that declared them. → Solves: the modal escapes the parent’s `overflow`, `transform` and `z-index`; context, state and props work; when it leaves the JSX, React removes the node by itself.",
          },
          {
            titulo: "5. Consequences for events and CSS",
            texto:
              "Events bubble through the **React tree**: a click inside the portal reaches the `onClick` of a React ancestor, even though the node is not its descendant in the DOM. That lets you reuse a handler in the parent, but it surprises you when it was not expected (stop the propagation if needed). CSS inheritance and descendant selectors, however, follow the **DOM**: a modal in `document.body` does not inherit the font or color of the card where it was declared.",
          },
          {
            titulo: "6. What the portal does not solve",
            texto:
              "A portal moves only the DOM, not the behavior: focus, keyboard and screen readers become your responsibility (see the warning). And there is no `document` on the server, so create the portal only after mount.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What follows the React tree and what follows the DOM",
        colunas: ["Aspect", "Follows the … tree", "Practical effect"],
        linhas: [
          [
            "Context, state and props",
            "React",
            "The modal reads the theme and the user from the ancestor that declared it",
          ],
          [
            "Event propagation",
            "React",
            "A click in the modal bubbles up to the parent’s `onClick`, although in the DOM the node sits elsewhere",
          ],
          ["Unmounting", "React", "Leaving the JSX removes the portal’s node"],
          [
            "CSS inheritance and descendant selectors",
            "DOM",
            "Font, color and `.parent .child` do not reach the modal in `document.body`",
          ],
          [
            "`overflow`, `z-index`, `position`, `transform`",
            "DOM",
            "The modal escapes the parent’s clipping and stacking contexts",
          ],
          ["Tab order and screen readers", "DOM", "The modal sits at the end of `body`: manage focus and roles"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A modal in a portal",
        legenda: "JSX",
        codigo: `import { useState } from "react";
import { createPortal } from "react-dom";

function Modal({ onClose }) {
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Details">
      <p>Hello!</p>
      <button onClick={onClose}>Close</button>
    </div>,
    document.body, // the DOM goes to body; the React tree does not change
  );
}

export function Card() {
  const [open, setOpen] = useState(false);
  return (
    <section style={{ overflow: "hidden", transform: "scale(1)" }}>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && <Modal onClose={() => setOpen(false)} />}
    </section>
  );
}`,
        nota: "Without the portal, the `section`’s `overflow` and `transform` would trap the modal; with it, the modal goes to `body`. The example does not manage focus: see the warning.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "Use a portal when the **visual** has to escape its container (modal, tooltip, dropdown, notification) but the **logic** still belongs to the component. A portal changes **where the DOM goes**, not **who the parent is in React**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A portal is not accessibility",
        texto:
          'A modal in a portal still needs managed focus: move focus inside when it opens, trap it there, return it to the trigger on close, close on Escape, and have `role="dialog"`, `aria-modal` and an accessible name. Because the node sits at the end of `body`, tab order and screen-reader reading follow the DOM, not the JSX. Prefer the native `<dialog>` or a well-tested accessibility library over reinventing this.',
      },
    ],
    armadilhas: [
      "Thinking the portal takes the component out of the React tree: the tree is the same, only the DOM moves.",
      "Being surprised by events that bubble up to the parent: a click in the modal reaches the React ancestor’s `onClick`; stop propagation if that is a problem.",
      'Forgetting accessibility: without managed focus, Escape and `role="dialog"`, the modal is nearly unusable by keyboard and screen reader.',
      "Using `document.body` during server rendering, or before the container exists: create the portal after mount.",
    ],
    autoteste: [
      {
        pergunta: "What does a portal change and what does it not change?",
        resposta:
          "It changes the place in the DOM where the children are drawn. It does not change the React tree: context, state, props and event propagation stay as if the children were where the JSX is.",
      },
      {
        pergunta:
          "Why can a modal drawn inside a card be clipped or end up behind other elements, and how does a portal fix it?",
        resposta:
          "An ancestor with `overflow: hidden` clips what is positioned inside it; `transform`, `filter` and `perspective` change the reference for `position: fixed`; and `z-index` only counts inside the ancestor’s stacking context. A portal draws the modal in `document.body`, outside those ancestors.",
      },
    ],
  },
};
