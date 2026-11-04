import type { Pergunta } from "../../tipos";

// S08 · Listas no React
export const s008: Pergunta = {
  numero: 608,
  modulo: "simplilearn-componentes",
  metodo: "feynman",
  pt: {
    titulo: "Listas no React",
    pergunta: "Explique como as listas funcionam no React.",
    porqueEsteMetodo:
      "Renderizar listas é simples de usar e fácil de errar nos detalhes (a `key`, a seta sem `return`). Uma analogia concreta, a linha de montagem, sustenta o mecanismo real e mostra onde a imagem para de valer.",
    resposta30s:
      "Renderizar uma lista no React é **transformar um array em elementos**: dentro de chaves no JSX, você chama `array.map(...)` e devolve um elemento por item, como numa linha de montagem. Cada elemento precisa de uma **`key` estável e única entre irmãos**, normalmente o `id` do dado, para o React saber quem é quem quando a lista muda. Filtre antes de mapear, trate a lista vazia e lembre que a seta com chaves `{}` precisa de `return`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa linha de montagem. Os itens do array chegam em fila numa esteira, uma estação (a função do `map`) transforma cada item numa caixinha pronta, que é um elemento JSX, e cada caixinha leva uma etiqueta com um código próprio, a `key`. No fim da esteira, o React junta as caixinhas na ordem em que chegaram e as mostra na tela.",
        tecnico:
          "Em JSX, uma lista é um array de elementos entre chaves. Você chama `array.map(...)`, que devolve um array novo sem alterar o original, e a função recebe cada item e **devolve um elemento**: `{tarefas.map((t) => <li key={t.id}>{t.titulo}</li>)}`. O React aceita arrays como filhos e desenha cada elemento. A `key` é uma pista para a reconciliação: diz quem é quem entre os irmãos da mesma lista, e assim o React reaproveita, move ou descarta o elemento certo quando itens entram, saem ou trocam de lugar, preservando o estado (como o texto digitado) do item correto. Ela precisa ser **estável** (a mesma entre renderizações) e **única entre irmãos** (não no app inteiro), e normalmente é o `id` do dado.",
        limite:
          "A analogia esconde que a etiqueta tem consequências. Se a `key` muda de dono quando a lista é reordenada (o índice, por exemplo), o React reaproveita a caixinha errada e o estado dela, como um campo preenchido, fica preso no item errado. E a `key` não chega ao componente como prop: se o filho precisa do identificador, passe-o por outra prop, como `id`.",
      },
      {
        tipo: "codigo",
        titulo: "Filtrar, tratar a lista vazia e mapear",
        legenda: "TSX",
        codigo: `type Tarefa = { id: string; titulo: string; feita: boolean };

function Tarefas({ lista, soPendentes }: { lista: Tarefa[]; soPendentes: boolean }) {
  const visiveis = soPendentes ? lista.filter((t) => !t.feita) : lista;

  if (visiveis.length === 0) return <p>Nenhuma tarefa.</p>;

  return (
    <ul>
      {visiveis.map((t) => (
        <li key={t.id}>{t.titulo}</li>
      ))}
    </ul>
  );
}`,
        nota: "A `key` fica no elemento que o `map` devolve, e vem do dado (`t.id`), não da posição.",
      },
      {
        tipo: "tabela",
        titulo: "Situações comuns em listas",
        colunas: ["Situação", "Como tratar", "Por quê"],
        linhas: [
          [
            "Lista filtrada",
            "Filtre antes de mapear: `itens.filter(...).map(...)`, mantendo como `key` o id do dado",
            "O filtro produz um array novo, e a `key` vem do dado, não da posição no resultado",
          ],
          [
            "Lista vazia",
            "Um array vazio não renderiza nada; trate o caso: `if (itens.length === 0) return <p>Nada por aqui</p>`",
            "Sem tratamento, a tela fica em branco e ninguém sabe se carregou, se falhou ou se não há nada",
          ],
          [
            "Cada item devolve vários elementos",
            "Use `<Fragment key={id}>…</Fragment>`: o fragmento curto `<>` não aceita `key`",
            "A `key` vai no elemento mais externo que o `map` devolve",
          ],
          [
            "Itens entram, saem ou mudam de ordem",
            "`key` estável, vinda do dado (`id`), nunca do índice (veja L33)",
            "O índice muda quando a lista muda, e o React reaproveita o elemento errado",
          ],
          [
            "Lista muito longa",
            "Renderize só o que aparece (virtualização) ou pagine",
            "O `map` cria um elemento por item, e milhares deles custam caro",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O erro mais comum com a seta",
        legenda: "JSX",
        codigo: `// Errado: com chaves, a seta não devolve nada e a lista fica vazia
{tarefas.map((t) => {
  <li key={t.id}>{t.titulo}</li>;
})}

// Certo: parênteses (retorno implícito) ou return explícito
{tarefas.map((t) => <li key={t.id}>{t.titulo}</li>)}
{tarefas.map((t) => {
  return <li key={t.id}>{t.titulo}</li>;
})}`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A key é estável e única entre irmãos",
        texto:
          "Use o `id` do dado como `key`. O índice só serve se a lista é estática: nunca reordenada, filtrada nem alterada no meio. Não gere a `key` durante a renderização (`Math.random()` ou `crypto.randomUUID()` dentro do `map`): cada renderização cria chaves novas, o React descarta e recria todos os itens, e a pessoa perde foco e texto digitado. Se o dado não tem id, gere-o uma vez, quando o item é criado.",
      },
    ],
    armadilhas: [
      "Usar o índice como `key` numa lista que reordena, filtra ou recebe itens no meio: o estado e o DOM ficam presos no item errado (veja L33).",
      "Gerar a `key` na renderização com `Math.random()`: toda renderização recria todos os itens e a pessoa perde foco e texto digitado.",
      "Esquecer o `return` quando a seta usa chaves `{}`: o `map` devolve `undefined` e a lista aparece vazia, sem erro.",
      "Colocar a `key` num elemento interno em vez do que o `map` devolve, ou usar o `<>` curto quando a `key` é necessária (use `<Fragment key={id}>`).",
    ],
    autoteste: [
      {
        pergunta: "Por que o React pede uma `key` em cada item de uma lista?",
        resposta:
          "Para casar os elementos entre uma renderização e a seguinte. Com uma `key` estável, o React sabe qual item entrou, saiu ou mudou de lugar e reaproveita o elemento certo, com o estado dele. Sem `key`, avisa e usa a posição, o que falha quando a lista muda de ordem.",
      },
      {
        pergunta: "Posso ler `props.key` dentro do componente do item?",
        resposta:
          "Não. A `key` é reservada: o React a usa e não a entrega ao componente. Se o filho precisa do identificador, passe-o por outra prop, como `id={t.id}`, além da `key`.",
      },
    ],
  },
  en: {
    titulo: "Lists in React",
    pergunta: "Explain how lists work in React.",
    porqueEsteMetodo:
      "Rendering lists is simple to use and easy to get wrong in the details (the `key`, the arrow function without `return`). A concrete analogy, the assembly line, supports the real mechanism and shows where the picture stops holding.",
    resposta30s:
      "Rendering a list in React means **turning an array into elements**: inside braces in JSX, you call `array.map(...)` and return one element per item, like an assembly line. Each element needs a **stable `key`, unique among siblings**, usually the data’s `id`, so React knows who is who when the list changes. Filter before mapping, handle the empty list and remember that an arrow function with braces `{}` needs a `return`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of an assembly line. The array’s items arrive in a queue on a belt, a station (the `map` function) turns each item into a finished little box, which is a JSX element, and each box carries a label with its own code, the `key`. At the end of the belt, React gathers the boxes in the order they arrived and shows them on screen.",
        tecnico:
          "In JSX, a list is an array of elements inside braces. You call `array.map(...)`, which returns a new array without changing the original, and the function receives each item and **returns an element**: `{tasks.map((t) => <li key={t.id}>{t.title}</li>)}`. React accepts arrays as children and draws each element. The `key` is a hint for reconciliation: it says who is who among the siblings of the same list, so React reuses, moves or discards the right element when items come in, go out or swap places, keeping the state (such as typed text) of the right item. It must be **stable** (the same across renders) and **unique among siblings** (not in the whole app), and it is usually the data’s `id`.",
        limite:
          "The analogy hides that the label has consequences. If the `key` changes owner when the list is reordered (the index, for example), React reuses the wrong box and its state, such as a filled-in field, stays stuck to the wrong item. And the `key` does not reach the component as a prop: if the child needs the identifier, pass it through another prop, such as `id`.",
      },
      {
        tipo: "codigo",
        titulo: "Filter, handle the empty list and map",
        legenda: "TSX",
        codigo: `type Task = { id: string; title: string; done: boolean };

function Tasks({ list, onlyPending }: { list: Task[]; onlyPending: boolean }) {
  const visible = onlyPending ? list.filter((t) => !t.done) : list;

  if (visible.length === 0) return <p>No tasks.</p>;

  return (
    <ul>
      {visible.map((t) => (
        <li key={t.id}>{t.title}</li>
      ))}
    </ul>
  );
}`,
        nota: "The `key` sits on the element the `map` returns, and comes from the data (`t.id`), not from the position.",
      },
      {
        tipo: "tabela",
        titulo: "Common situations in lists",
        colunas: ["Situation", "How to handle it", "Why"],
        linhas: [
          [
            "Filtered list",
            "Filter before mapping: `items.filter(...).map(...)`, keeping the data’s id as the `key`",
            "The filter produces a new array, and the `key` comes from the data, not from the position in the result",
          ],
          [
            "Empty list",
            "An empty array renders nothing; handle the case: `if (items.length === 0) return <p>Nothing here</p>`",
            "Without handling, the screen stays blank and nobody knows whether it loaded, failed or is simply empty",
          ],
          [
            "Each item returns several elements",
            "Use `<Fragment key={id}>…</Fragment>`: the short fragment `<>` does not accept a `key`",
            "The `key` goes on the outermost element the `map` returns",
          ],
          [
            "Items come in, go out or change order",
            "A stable `key` from the data (`id`), never from the index (see L33)",
            "The index changes when the list changes, and React reuses the wrong element",
          ],
          [
            "Very long list",
            "Render only what is visible (virtualization) or paginate",
            "`map` creates one element per item, and thousands of them are expensive",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The most common mistake with the arrow function",
        legenda: "JSX",
        codigo: `// Wrong: with braces, the arrow function returns nothing and the list is empty
{tasks.map((t) => {
  <li key={t.id}>{t.title}</li>;
})}

// Right: parentheses (implicit return) or an explicit return
{tasks.map((t) => <li key={t.id}>{t.title}</li>)}
{tasks.map((t) => {
  return <li key={t.id}>{t.title}</li>;
})}`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The key is stable and unique among siblings",
        texto:
          "Use the data’s `id` as the `key`. The index only works if the list is static: never reordered, filtered or changed in the middle. Do not generate the `key` during render (`Math.random()` or `crypto.randomUUID()` inside the `map`): every render creates new keys, React discards and recreates all the items, and the user loses focus and typed text. If the data has no id, generate one once, when the item is created.",
      },
    ],
    armadilhas: [
      "Using the index as the `key` in a list that reorders, filters or receives items in the middle: state and DOM stay stuck to the wrong item (see L33).",
      "Generating the `key` during render with `Math.random()`: every render recreates all the items and the user loses focus and typed text.",
      "Forgetting the `return` when the arrow function uses braces `{}`: the `map` returns `undefined` and the list shows up empty, with no error.",
      "Putting the `key` on an inner element instead of the one the `map` returns, or using the short `<>` when a `key` is needed (use `<Fragment key={id}>`).",
    ],
    autoteste: [
      {
        pergunta: "Why does React ask for a `key` on each item of a list?",
        resposta:
          "To match elements between one render and the next. With a stable `key`, React knows which item came in, went out or moved and reuses the right element, with its state. Without a `key`, it warns and falls back on the position, which fails when the list changes order.",
      },
      {
        pergunta: "Can I read `props.key` inside the item component?",
        resposta:
          "No. The `key` is reserved: React uses it and does not hand it to the component. If the child needs the identifier, pass it through another prop, such as `id={t.id}`, besides the `key`.",
      },
    ],
  },
};
