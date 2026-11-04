import type { Pergunta } from "../../tipos";

// C10 · O que é um fragment
export const c010: Pergunta = {
  numero: 510,
  modulo: "coddy-iniciante",
  metodo: "feynman",
  pt: {
    titulo: "O que é um fragment",
    pergunta: "O que é um fragment?",
    porqueEsteMetodo:
      "Fragment é um conceito pequeno que se entende melhor por uma imagem do dia a dia; depois vêm o mecanismo real (uma raiz por componente, nenhum nó extra no DOM) e o ponto em que a imagem deixa de valer.",
    resposta30s:
      "Um **fragment** agrupa vários elementos irmãos **sem criar um nó extra no DOM**. Como um componente só pode devolver uma raiz, ele evita o `<div>` de embrulho que quebraria tabelas, listas e layouts com grid ou flex. A sintaxe curta é `<>...</>`; a forma longa, `<Fragment>`, é necessária quando você precisa de `key`, por exemplo ao renderizar uma lista de grupos. Um fragment não aceita atributos além da `key`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num elástico que prende algumas folhas soltas. Para entregar as folhas a alguém, você as junta num único maço; quando o maço é aberto, o elástico não conta como página: só sobram as folhas. O fragment é esse elástico.",
        tecnico:
          "Um componente devolve **uma** raiz, e um JSX com dois irmãos soltos (`<h1 /><p />`) não compila. Antes dos fragments, a saída era um `<div>` de embrulho, que vai parar no DOM. O `<>...</>` (atalho de `<Fragment>...</Fragment>`) agrupa os filhos para o React sem produzir elemento no HTML final. A forma longa aceita `key`, necessária quando cada item de uma lista rende vários elementos irmãos; a curta não aceita atributo nenhum.",
        limite:
          "O elástico não é uma página: um fragment não tem `className`, `style`, `id` nem `onClick`, e não dá para posicionar ou estilizar o grupo como um todo. Se você precisa de uma caixa para estilizar o grupo ou ouvir um evento nele, use um elemento real.",
      },
      {
        tipo: "tabela",
        titulo: "Quando o `<div>` extra atrapalha",
        colunas: ["Situação", "Com `<div>` de embrulho", "Com fragment"],
        linhas: [
          [
            "Linha de tabela (`<tr>` com `<td>`)",
            "HTML inválido: um `<div>` não pode ficar dentro de `<tr>`, e o React avisa",
            "As células ficam direto sob o `<tr>`",
          ],
          [
            "Lista (`<ul>`, `<ol>`)",
            "O `<div>` no meio é inválido: só `<li>` pode ser filho direto",
            "Os `<li>` ficam direto sob a lista",
          ],
          [
            "Layout com grid ou flex",
            "O `<div>` vira o único item do contêiner, e os filhos deixam de ser itens do grid ou do flex",
            "Os elementos continuam sendo itens diretos do contêiner",
          ],
          ["Seletores CSS", "Um nível a mais muda o que `>` e `:nth-child` encontram", "O DOM fica como no JSX"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sintaxe curta e forma longa com key",
        legenda: "JSX",
        codigo: `import { Fragment } from "react";
function Colunas() {
  return (
    <>
      <td>Nome</td>
      <td>Preço</td>
    </>
  );
}

export function Glossario({ termos }) {
  return (
    <dl>
      {termos.map((t) => (
        <Fragment key={t.id}>
          <dt>{t.nome}</dt>
          <dd>{t.descricao}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,
        nota: "`Colunas` entra dentro de um `<tr>` sem criar nenhum elemento. Em `Glossario`, cada termo rende dois irmãos (`<dt>` e `<dd>`), e a `key` fica no `<Fragment>`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Curta ou longa, e o que o fragment não faz",
        texto:
          "A forma curta `<>...</>` não aceita `key` nem nenhum outro atributo; use `<Fragment key={...}>`, importado de `react`, quando cada item da lista rende vários irmãos. O fragment resolve a raiz única, mas não substitui um elemento quando você precisa de estilo, evento ou semântica para o grupo.",
      },
    ],
    armadilhas: [
      "Esquecer a `key` ao mapear fragments: o React avisa, e a identidade dos grupos se perde. A `key` vai no `<Fragment>` da forma longa, não nos elementos de dentro.",
      "Tentar passar `className`, `style` ou `onClick` ao fragment: ele não gera elemento, então não há onde aplicar.",
      "Embrulhar tudo em `<div>` por hábito: quebra tabelas, listas e layouts com grid ou flex, e ainda polui o DOM.",
      "Achar que o fragment deixa um nó vazio ou um componente no HTML: ele some e não deixa nada.",
    ],
    autoteste: [
      {
        pergunta: "Por que `return <h1 /><p />` não compila e como corrigir?",
        resposta:
          "Porque uma expressão JSX precisa de uma única raiz. Embrulhe os elementos num fragment, `<><h1 /><p /></>`, que não cria elemento no DOM.",
      },
      {
        pergunta: "Quando usar `<Fragment key={...}>` em vez de `<>`?",
        resposta:
          "Quando cada item de uma lista rende vários elementos irmãos e o React precisa de uma `key` no grupo. A forma curta não aceita atributos.",
      },
    ],
  },
  en: {
    titulo: "What a fragment is",
    pergunta: "What is a fragment?",
    porqueEsteMetodo:
      "A fragment is a small concept that is easier to grasp through an everyday image; then come the real mechanism (one root per component, no extra DOM node) and the point where the image stops holding.",
    resposta30s:
      "A **fragment** groups several sibling elements **without creating an extra DOM node**. Because a component can only return one root, it avoids the wrapper `<div>` that would break tables, lists and grid or flex layouts. The short syntax is `<>...</>`; the long form, `<Fragment>`, is needed when you require a `key`, for example when rendering a list of groups. A fragment accepts no attributes other than `key`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a rubber band holding a few loose sheets. To hand the sheets to someone, you gather them into one stack; when the stack is opened, the band does not count as a page: only the sheets remain. A fragment is that band.",
        tecnico:
          "A component returns **one** root, and JSX with two loose siblings (`<h1 /><p />`) does not compile. Before fragments, the way out was a wrapper `<div>`, which ends up in the DOM. `<>...</>` (shorthand for `<Fragment>...</Fragment>`) groups the children for React without producing an element in the final HTML. The long form accepts `key`, needed when each item of a list renders several sibling elements; the short one accepts no attribute at all.",
        limite:
          "The band is not a page: a fragment has no `className`, `style`, `id` or `onClick`, and you cannot position or style the group as a whole. If you need a box to style the group or listen for an event on it, use a real element.",
      },
      {
        tipo: "tabela",
        titulo: "When the extra `<div>` gets in the way",
        colunas: ["Situation", "With a wrapper `<div>`", "With a fragment"],
        linhas: [
          [
            "Table row (`<tr>` with `<td>`)",
            "Invalid HTML: a `<div>` cannot sit inside a `<tr>`, and React warns",
            "The cells sit directly under the `<tr>`",
          ],
          [
            "List (`<ul>`, `<ol>`)",
            "A `<div>` in the middle is invalid: only `<li>` can be a direct child",
            "The `<li>` elements sit directly under the list",
          ],
          [
            "Grid or flex layout",
            "The `<div>` becomes the container’s only item, and the children stop being grid or flex items",
            "The elements remain direct items of the container",
          ],
          [
            "CSS selectors",
            "One extra level changes what `>` and `:nth-child` match",
            "The DOM stays as written in the JSX",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Short syntax and the long form with key",
        legenda: "JSX",
        codigo: `import { Fragment } from "react";
function Columns() {
  return (
    <>
      <td>Name</td>
      <td>Price</td>
    </>
  );
}

export function Glossary({ terms }) {
  return (
    <dl>
      {terms.map((t) => (
        <Fragment key={t.id}>
          <dt>{t.name}</dt>
          <dd>{t.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,
        nota: "`Columns` goes inside a `<tr>` without creating any element. In `Glossary`, each term renders two siblings (`<dt>` and `<dd>`), and the `key` goes on the `<Fragment>`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Short or long, and what a fragment does not do",
        texto:
          "The short form `<>...</>` accepts neither `key` nor any other attribute; use `<Fragment key={...}>`, imported from `react`, when each list item renders several siblings. A fragment solves the single-root rule, but it does not replace an element when you need style, an event or semantics for the group.",
      },
    ],
    armadilhas: [
      "Forgetting the `key` when mapping fragments: React warns, and the identity of the groups is lost. The `key` goes on the long-form `<Fragment>`, not on the elements inside.",
      "Trying to pass `className`, `style` or `onClick` to a fragment: it produces no element, so there is nowhere to apply them.",
      "Wrapping everything in a `<div>` out of habit: it breaks tables, lists and grid or flex layouts, and clutters the DOM.",
      "Thinking a fragment leaves an empty node or a component in the HTML: it disappears and leaves nothing.",
    ],
    autoteste: [
      {
        pergunta: "Why does `return <h1 /><p />` not compile, and how do you fix it?",
        resposta:
          "Because a JSX expression needs a single root. Wrap the elements in a fragment, `<><h1 /><p /></>`, which creates no DOM element.",
      },
      {
        pergunta: "When do you use `<Fragment key={...}>` instead of `<>`?",
        resposta:
          "When each list item renders several sibling elements and React needs a `key` on the group. The short form accepts no attributes.",
      },
    ],
  },
};
