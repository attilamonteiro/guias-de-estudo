import type { Pergunta } from "../../tipos";

// L33 · Por que as keys importam
export const l033: Pergunta = {
  numero: 33,
  modulo: "linkedin-renderizacao",
  metodo: "whys",
  pt: {
    titulo: "Por que as keys importam",
    pergunta: "Por que as keys são importantes no React?",
    porqueEsteMetodo:
      "A regra “use uma key” costuma ser decorada sem motivo. A cadeia de por quês mostra de onde ela vem (casar itens entre renderizações) e por que o índice e a key aleatória quebram justamente isso.",
    resposta30s:
      "A **key** é a identidade de cada item de uma lista entre irmãos: com ela, o React casa os itens da renderização anterior com os da nova, mesmo que mudem de posição, e preserva o **state** e o DOM de cada um. Use um **id estável e único** vindo dos dados. O índice do array só serve em listas estáticas, porque ao reordenar, inserir ou remover ele passa a apontar para outro item e o state fica no lugar errado. Uma key instável, como `Math.random()`, faz o React recriar tudo a cada render.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o React precisa de keys?",
            resposta:
              "Ao reconciliar uma lista, o React compara os filhos antigos com os novos. Sem mais informação, só pode casá-los pela **posição**. A `key` é a identidade: diz “este item de agora é aquele item de antes”, mesmo que ele tenha mudado de lugar.",
          },
          {
            pergunta: "Por que a posição não basta?",
            resposta:
              "Porque listas mudam: itens entram no começo, saem do meio, são reordenados e filtrados. Casando por posição, a instância que estava na linha 2 passa a receber os dados de outro item, mas leva consigo o **state interno** (texto digitado, checkbox marcado, foco, posição de rolagem) e o nó do DOM. A tela fica com dados novos e state velho.",
          },
          {
            pergunta: "Por que o índice do array é uma key ruim?",
            resposta:
              "Porque o índice é a **posição disfarçada de identidade**. Se um item é inserido no começo, o antigo “0” vira “1”, e o React conclui que o item da key 0 continua sendo “o mesmo”, agora com outros dados. Os bugs típicos: texto digitado na linha errada, checkbox marcado no item errado, foco perdido, animações trocadas. Há ainda trabalho à toa, porque quase todos os itens parecem ter mudado. O índice é aceitável quando a lista é **estática** (nunca reordena, filtra nem recebe inserções ou remoções) e os itens não têm state.",
          },
          {
            pergunta: "O que acontece com keys instáveis, como `Math.random()`?",
            resposta:
              "Uma key nova a cada render nunca casa com a anterior. O React trata cada item como novo: **desmonta e remonta** a lista inteira, recria os nós do DOM, perde o state de todos, executa os efeitos de novo, e o foco sai do campo a cada tecla digitada. A key deve ser gerada **uma vez**, quando o dado nasce (por exemplo, ao criar o item), e nunca durante o render.",
          },
          {
            pergunta: "O que é uma boa key, e para que mais ela serve?",
            resposta:
              "Um valor **estável e único entre irmãos**, vindo dos dados (id do banco, id gerado na criação do item); não precisa ser único no app inteiro. A `key` não chega ao componente como prop. Fora de listas, **mudar a key reinicia** o componente: `<Formulario key={usuarioId} />` descarta o state antigo quando muda o usuário.",
          },
        ],
        causaRaiz:
          "A key é a **identidade do item** entre renderizações. Sem ela, o React casa por posição; com uma identidade errada (índice em lista que muda) ou instável (aleatória), o state e o DOM acompanham o item errado ou não acompanham item nenhum.",
      },
      {
        tipo: "codigo",
        titulo: "Cada linha com o seu state, e a key certa",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Tarefa({ texto }) {
  const [nota, setNota] = useState(""); // state local de cada linha
  return (
    <li>
      {texto} <input value={nota} onChange={(e) => setNota(e.target.value)} />
    </li>
  );
}

export function Lista() {
  const [itens, setItens] = useState([{ id: "a", texto: "Pagar" }, { id: "b", texto: "Ligar" }]);
  return (
    <>
      <button onClick={() => setItens([{ id: "c", texto: "Novo" }, ...itens])}>Inserir no início</button>
      <ul>
        {itens.map((item) => <Tarefa key={item.id} texto={item.texto} />)}
      </ul>
    </>
  );
}`,
        nota: "Digite algo nas notas e clique em “Inserir no início”. Com `key={item.id}`, cada nota continua com o seu item; com o índice, as notas ficam nas mesmas posições e os itens deslizam por baixo delas.",
      },
      {
        tipo: "tabela",
        titulo: "Que valor usar como key?",
        colunas: ["Origem da key", "Serve?", "Motivo"],
        linhas: [
          [
            "Id do dado (banco, API)",
            "Sim, é a melhor escolha",
            "Estável e único, acompanha o item onde quer que ele esteja",
          ],
          [
            "Id gerado quando o item é criado (`crypto.randomUUID()`)",
            "Sim",
            "Gerado uma vez e guardado junto do dado",
          ],
          [
            "Índice do array, em lista estática",
            "Aceitável",
            "Sem reordenar, inserir nem remover, posição e identidade coincidem",
          ],
          [
            "Índice do array, em lista que muda",
            "Não",
            "A posição deixa de identificar o item; state e DOM ficam desalinhados",
          ],
          [
            "`Math.random()` ou id gerado dentro do render",
            "Nunca",
            "Key nova a cada render: tudo é desmontado e recriado",
          ],
          [
            "Texto ou campo que pode se repetir",
            "Com cuidado",
            "Duas keys iguais entre irmãos são ambíguas e geram aviso no console",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O teste da key",
        texto:
          "Pergunte: “este valor continua identificando o mesmo item depois de reordenar, inserir, remover e renderizar de novo?”. Se sim, serve. Se ele muda de render para render, ou só indica a posição, não serve. Usar a key para reiniciar o state de um componente é um uso legítimo e proposital.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Onde a key vai",
        texto:
          "Ela fica no elemento mais externo devolvido pelo `map` (no `<Tarefa key=... />`, e não dentro do componente), e em Fragments use `<Fragment key=...>`. A key só precisa ser única entre irmãos. Ela não é repassada como prop: se o componente precisar do valor, passe também como outra prop (por exemplo `id`).",
      },
    ],
    armadilhas: [
      "Usar o índice como key numa lista que o usuário pode reordenar, filtrar ou editar: o state, e o que foi digitado, fica no item errado.",
      "Gerar a key dentro do `map` com `Math.random()` ou `crypto.randomUUID()`: ela muda a cada render, o React recria tudo e os campos perdem o foco.",
      "Colocar a `key` num elemento interno em vez de no elemento devolvido pelo `map`, ou repetir a mesma key entre irmãos.",
      "Tentar ler `props.key` dentro do componente: a key não é repassada; passe o valor também em outra prop.",
    ],
    autoteste: [
      {
        pergunta: "Uma lista tem um input por item e você insere um item no topo. Com `key={índice}`, o que acontece?",
        resposta:
          "As keys 0, 1, 2… continuam existindo e o React reaproveita as instâncias: o texto digitado em cada input permanece na mesma linha, enquanto os dados dos itens se deslocaram. O texto parece “pular” para o item errado.",
      },
      {
        pergunta: "Dá para usar a key para reiniciar o state de um componente?",
        resposta:
          "Sim. Trocar a key faz o React tratá-lo como outro componente: o antigo é desmontado (state descartado) e um novo é montado do zero. É útil, por exemplo, para limpar um formulário quando muda o usuário selecionado.",
      },
    ],
  },
  en: {
    titulo: "Why keys matter",
    pergunta: "Why are keys important in React?",
    porqueEsteMetodo:
      "The rule “use a key” is often memorized without a reason. The chain of whys shows where it comes from (matching items across renders) and why the index and a random key break exactly that.",
    resposta30s:
      "A **key** is the identity of each list item among its siblings: with it, React matches the items from the previous render with the new ones, even when they change position, and keeps each one’s **state** and DOM. Use a **stable, unique id** from the data. The array index only suits static lists, because when you reorder, insert or remove it ends up pointing to another item and state lands in the wrong place. An unstable key, such as `Math.random()`, makes React recreate everything on every render.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does React need keys?",
            resposta:
              "When reconciling a list, React compares the old children with the new ones. With no extra information, it can only match them by **position**. The `key` is the identity: it says “this item now is that item from before”, even if it moved.",
          },
          {
            pergunta: "Why is position not enough?",
            resposta:
              "Because lists change: items are added at the start, removed from the middle, reordered and filtered. Matching by position, the instance that was on row 2 starts receiving another item’s data, but it carries its own **internal state** (typed text, a checked checkbox, focus, scroll position) and its DOM node. The screen ends up with new data and old state.",
          },
          {
            pergunta: "Why is the array index a bad key?",
            resposta:
              "Because the index is **position disguised as identity**. If an item is inserted at the start, the old “0” becomes “1”, and React concludes that the item with key 0 is still “the same one”, now with different data. Typical bugs: text typed on the wrong row, a checkbox checked on the wrong item, lost focus, mixed-up animations. There is also pointless work, since almost every item looks changed. The index is acceptable when the list is **static** (it never reorders, filters, or gets insertions or removals) and the items have no state.",
          },
          {
            pergunta: "What happens with unstable keys, like `Math.random()`?",
            resposta:
              "A new key on every render never matches the previous one. React treats each item as new: it **unmounts and remounts** the whole list, recreates the DOM nodes, loses everyone’s state, runs the effects again, and focus leaves the field on every keystroke. The key must be generated **once**, when the data is born (for example, when the item is created), and never during render.",
          },
          {
            pergunta: "What makes a good key, and what else is it for?",
            resposta:
              "A value that is **stable and unique among siblings**, coming from the data (a database id, an id generated when the item is created); it does not need to be unique across the whole app. The `key` does not reach the component as a prop. Outside lists, **changing the key resets** the component: `<Form key={userId} />` throws away the old state when the user changes.",
          },
        ],
        causaRaiz:
          "The key is the **item’s identity** across renders. Without it, React matches by position; with a wrong identity (the index in a list that changes) or an unstable one (random), state and DOM follow the wrong item or follow none at all.",
      },
      {
        tipo: "codigo",
        titulo: "Each row with its own state, and the right key",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Task({ text }) {
  const [note, setNote] = useState(""); // local state of each row
  return (
    <li>
      {text} <input value={note} onChange={(e) => setNote(e.target.value)} />
    </li>
  );
}

export function List() {
  const [items, setItems] = useState([{ id: "a", text: "Pay" }, { id: "b", text: "Call" }]);
  return (
    <>
      <button onClick={() => setItems([{ id: "c", text: "New" }, ...items])}>Insert at the start</button>
      <ul>
        {items.map((item) => <Task key={item.id} text={item.text} />)}
      </ul>
    </>
  );
}`,
        nota: "Type something in the notes and click “Insert at the start”. With `key={item.id}`, each note stays with its item; with the index, the notes stay in the same positions and the items slide underneath them.",
      },
      {
        tipo: "tabela",
        titulo: "What value should be the key?",
        colunas: ["Where the key comes from", "Does it work?", "Why"],
        linhas: [
          [
            "The data’s id (database, API)",
            "Yes, the best choice",
            "Stable and unique, follows the item wherever it goes",
          ],
          [
            "An id generated when the item is created (`crypto.randomUUID()`)",
            "Yes",
            "Generated once and stored with the data",
          ],
          [
            "Array index, in a static list",
            "Acceptable",
            "With no reordering, inserting or removing, position and identity coincide",
          ],
          [
            "Array index, in a list that changes",
            "No",
            "Position no longer identifies the item; state and DOM get misaligned",
          ],
          [
            "`Math.random()` or an id generated inside render",
            "Never",
            "A new key on every render: everything is unmounted and recreated",
          ],
          [
            "Text or a field that can repeat",
            "With care",
            "Two equal keys among siblings are ambiguous and trigger a console warning",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The key test",
        texto:
          "Ask: “does this value still identify the same item after reordering, inserting, removing and rendering again?” If so, it works. If it changes from render to render, or only tells the position, it does not. Using a key to reset a component’s state is a legitimate, deliberate use.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where the key goes",
        texto:
          "It goes on the outermost element returned by the `map` (on `<Task key=... />`, not inside the component), and for Fragments use `<Fragment key=...>`. The key only needs to be unique among siblings. It is not passed down as a prop: if the component needs the value, pass it as another prop as well (for example `id`).",
      },
    ],
    armadilhas: [
      "Using the index as a key in a list the user can reorder, filter or edit: the state, and whatever was typed, ends up on the wrong item.",
      "Generating the key inside the `map` with `Math.random()` or `crypto.randomUUID()`: it changes on every render, React recreates everything and fields lose focus.",
      "Putting the `key` on an inner element instead of on the element returned by the `map`, or repeating the same key among siblings.",
      "Trying to read `props.key` inside the component: the key is not passed down; pass the value in another prop too.",
    ],
    autoteste: [
      {
        pergunta: "A list has one input per item and you insert an item at the top. With `key={index}`, what happens?",
        resposta:
          "Keys 0, 1, 2… still exist and React reuses the instances: the text typed in each input stays on the same row, while the items’ data shifted. The text seems to “jump” to the wrong item.",
      },
      {
        pergunta: "Can you use a key to reset a component’s state?",
        resposta:
          "Yes. Changing the key makes React treat it as another component: the old one is unmounted (state discarded) and a new one is mounted from scratch. It is useful, for example, to clear a form when the selected user changes.",
      },
    ],
  },
};
