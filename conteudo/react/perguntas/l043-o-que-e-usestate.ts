import type { Pergunta } from "../../tipos";

// L43 · O que é useState
export const l043: Pergunta = {
  numero: 43,
  modulo: "linkedin-hooks",
  metodo: "trace",
  pt: {
    titulo: "O que é useState",
    pergunta: "O que é useState()?",
    porqueEsteMetodo:
      "O `useState` parece simples e, ainda assim, está por trás dos bugs mais comuns de React. Seguir o caminho de um valor, da primeira renderização até uma atualização (e até a desmontagem), mostra por que o setter não muda a variável na hora.",
    resposta30s:
      "`useState(inicial)` devolve um par **`[valor, setter]`**: o valor atual de um pedaço de state que o React guarda para o componente, e a função que o atualiza. Chamar o setter **agenda** uma nova renderização; a variável `valor` da renderização atual **não muda** (é um instantâneo). Use a forma **funcional** quando o novo valor depender do anterior, um inicializador **preguiçoso** para valores caros, e nunca mute objetos ou arrays: crie cópias.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Seguindo um valor de state",
        passos: [
          {
            titulo: "1. Primeira renderização",
            texto:
              "O React chama `useState(inicial)`, cria o espaço do state para essa instância do componente e devolve `[inicial, setter]`. O argumento só vale nessa primeira vez; nas seguintes, é ignorado.",
          },
          {
            titulo: "2. O valor é um instantâneo",
            texto:
              "Em toda esta renderização, `valor` é uma constante. Os handlers criados nela (closures) enxergam sempre esse mesmo valor, mesmo que o state já tenha mudado depois.",
          },
          {
            titulo: "3. O setter agenda",
            texto:
              "`setValor(novo)` guarda a atualização numa fila e pede uma nova renderização (junto com as demais do mesmo evento, veja L36). Não altera a variável e não é síncrono: um `console.log(valor)` logo depois mostra o valor antigo.",
          },
          {
            titulo: "4. O React compara com Object.is",
            texto:
              "Se o novo valor é igual ao atual, o React em geral nem renderiza os filhos. Se você mutou um objeto ou array e passou a mesma referência, ele também enxerga “o mesmo valor” e nada muda na tela: por isso se cria uma cópia.",
          },
          {
            titulo: "5. Nova renderização",
            texto:
              "O React chama o componente de novo, e o `useState` devolve o valor já atualizado (aplicando a fila em ordem). A interface é recalculada a partir dele.",
          },
          {
            titulo: "6. Desmontagem",
            texto:
              "Ao sair da árvore (ou ao trocar o tipo ou a `key`, veja L23 e L33), o componente perde o state; ao voltar, começa do valor inicial. O state vive no React, ligado à posição do componente na árvore, e não numa variável sua.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Inicializador preguiçoso e atualização sem mutar",
        legenda: "JSX",
        codigo: `import { useState } from "react";

const lerSalvo = () => JSON.parse(localStorage.getItem("carrinho") ?? "[]");

export function Carrinho() {
  const [itens, setItens] = useState(lerSalvo); // preguiçoso: a função roda só na 1ª renderização
  const [aberto, setAberto] = useState(false);

  function adicionar(item) {
    // errado: itens.push(item); setItens(itens); (mesma referência, nada muda)
    setItens((anteriores) => [...anteriores, item]); // cópia, com base na fila mais recente
  }

  return (
    <section>
      <button onClick={() => setAberto(!aberto)}>{aberto ? "Fechar" : "Abrir"}</button>
      <button onClick={() => adicionar("Café")}>Adicionar</button>
      {aberto && <p>{itens.length} itens</p>}
    </section>
  );
}`,
      },
      {
        tipo: "tabela",
        titulo: "Erros comuns e consertos",
        colunas: ["Situação", "Errado", "Certo"],
        linhas: [
          [
            "O novo valor depende do anterior",
            "`setN(n + 1)` repetido, ou dentro de um timer com closure antiga",
            "`setN((anterior) => anterior + 1)`",
          ],
          ["Atualizar um objeto", "`obj.campo = x; setObj(obj)`", "`setObj({ ...obj, campo: x })`"],
          [
            "Atualizar um array",
            "`lista.push(x); setLista(lista)`",
            "`setLista([...lista, x])`, ou `.map` e `.filter`",
          ],
          [
            "Valor inicial caro",
            "`useState(calcular())` (roda em toda renderização)",
            "`useState(calcular)` ou `useState(() => calcular())`",
          ],
          [
            "Valor que dá para calcular",
            "Copiar props ou state para outro state (um `total`)",
            "Calcular durante a renderização",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Vários estados ou um objeto?",
        texto:
          "Separe em vários `useState` os valores que mudam de forma **independente**; agrupe num objeto (ou num `useReducer`, veja L46) os que **mudam juntos** ou dependem uns dos outros. O setter **substitui** o valor: ao contrário do `setState` das classes, ele não mescla objetos, então copie os campos que continuam (`{ ...obj, campo }`).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O instantâneo e o estado derivado",
        texto:
          "Dentro de uma renderização o valor é fixo: `setTimeout(() => alert(n), 3000)` mostra o `n` do momento em que o timer foi criado. Não guarde em state o que dá para derivar de props ou de outro state: duas fontes da verdade saem de sincronia. E use state só para o que, ao mudar, deve atualizar a tela; para o resto, existe `useRef`.",
      },
    ],
    armadilhas: [
      "Achar que o setter é síncrono e ler o valor novo logo em seguida: a variável só muda na próxima renderização.",
      "Mutar objetos ou arrays (`push`, atribuição de campo) e passar a mesma referência: o React vê o mesmo valor e a tela não atualiza.",
      "Guardar em state algo que dá para calcular a partir de props ou de outro state (estado derivado): as duas fontes da verdade ficam dessincronizadas.",
      "Escrever `useState(calculoCaro())` em vez de passar a função: o cálculo roda em toda renderização, embora só o resultado da primeira seja usado.",
    ],
    autoteste: [
      {
        pergunta: "Por que `setN(n + 1)` chamado três vezes seguidas só soma 1?",
        resposta:
          "Porque as três chamadas leem o mesmo `n`, o da renderização atual, e cada uma agenda “n = 1”. Com a forma funcional (`setN(a => a + 1)`), cada atualização recebe o resultado da anterior e a soma é 3.",
      },
      {
        pergunta: "O que acontece com o state quando o componente desmonta?",
        resposta:
          "É descartado. Ao montar de novo, o `useState` volta ao valor inicial; para manter o valor, ele precisa viver acima (no pai, num contexto) ou ser persistido fora do componente.",
      },
    ],
  },
  en: {
    titulo: "What useState is",
    pergunta: "What is useState()?",
    porqueEsteMetodo:
      "`useState` looks simple and is still behind the most common React bugs. Following a value from the first render to an update (and on to unmounting) shows why the setter does not change the variable right away.",
    resposta30s:
      "`useState(initial)` returns a **`[value, setter]`** pair: the current value of a piece of state that React keeps for the component, and the function that updates it. Calling the setter **schedules** a new render; the `value` variable of the current render **does not change** (it is a snapshot). Use the **functional form** when the new value depends on the previous one, a **lazy** initializer for expensive values, and never mutate objects or arrays: make copies.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Following a piece of state",
        passos: [
          {
            titulo: "1. First render",
            texto:
              "React calls `useState(initial)`, creates the state slot for this component instance and returns `[initial, setter]`. The argument only counts that first time; on later renders it is ignored.",
          },
          {
            titulo: "2. The value is a snapshot",
            texto:
              "Throughout this render, `value` is a constant. Handlers created in it (closures) always see that same value, even if the state has changed since.",
          },
          {
            titulo: "3. The setter schedules",
            texto:
              "`setValue(next)` stores the update in a queue and asks for a new render (together with the other updates from the same event, see L36). It does not change the variable and is not synchronous: a `console.log(value)` right after shows the old value.",
          },
          {
            titulo: "4. React compares with Object.is",
            texto:
              "If the new value equals the current one, React generally does not even render the children. If you mutated an object or array and passed the same reference, it also sees “the same value” and nothing changes on screen: that is why you create a copy.",
          },
          {
            titulo: "5. New render",
            texto:
              "React calls the component again, and `useState` returns the updated value (applying the queue in order). The UI is recomputed from it.",
          },
          {
            titulo: "6. Unmounting",
            texto:
              "When it leaves the tree (or when the type or `key` changes, see L23 and L33), the component loses its state; when it comes back, it starts from the initial value. State lives in React, tied to the component’s position in the tree, not in a variable of yours.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Lazy initializer and updating without mutating",
        legenda: "JSX",
        codigo: `import { useState } from "react";

const readSaved = () => JSON.parse(localStorage.getItem("cart") ?? "[]");

export function Cart() {
  const [items, setItems] = useState(readSaved); // lazy: the function runs only on the 1st render
  const [open, setOpen] = useState(false);

  function add(item) {
    // wrong: items.push(item); setItems(items); (same reference, nothing changes)
    setItems((previous) => [...previous, item]); // a copy, based on the latest queue
  }

  return (
    <section>
      <button onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}</button>
      <button onClick={() => add("Coffee")}>Add</button>
      {open && <p>{items.length} items</p>}
    </section>
  );
}`,
      },
      {
        tipo: "tabela",
        titulo: "Common mistakes and fixes",
        colunas: ["Situation", "Wrong", "Right"],
        linhas: [
          [
            "The new value depends on the previous one",
            "`setN(n + 1)` repeated, or inside a timer with a stale closure",
            "`setN((previous) => previous + 1)`",
          ],
          ["Updating an object", "`obj.field = x; setObj(obj)`", "`setObj({ ...obj, field: x })`"],
          ["Updating an array", "`list.push(x); setList(list)`", "`setList([...list, x])`, or `.map` and `.filter`"],
          [
            "Expensive initial value",
            "`useState(compute())` (runs on every render)",
            "`useState(compute)` or `useState(() => compute())`",
          ],
          [
            "A value you can compute",
            "Copying props or state into another state (a `total`)",
            "Compute it during render",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Several states or one object?",
        texto:
          "Split values that change **independently** into several `useState` calls; group values that **change together** or depend on each other into an object (or a `useReducer`, see L46). The setter **replaces** the value: unlike a class’s `setState`, it does not merge objects, so copy the fields that stay (`{ ...obj, field }`).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The snapshot and derived state",
        texto:
          "Within a render the value is fixed: `setTimeout(() => alert(n), 3000)` shows the `n` from the moment the timer was created. Do not store in state what you can derive from props or other state: two sources of truth drift apart. And use state only for what should update the screen when it changes; for everything else, there is `useRef`.",
      },
    ],
    armadilhas: [
      "Thinking the setter is synchronous and reading the new value right after: the variable only changes on the next render.",
      "Mutating objects or arrays (`push`, assigning a field) and passing the same reference: React sees the same value and the screen does not update.",
      "Storing in state something you can compute from props or other state (derived state): the two sources of truth fall out of sync.",
      "Writing `useState(expensiveCall())` instead of passing the function: the computation runs on every render, even though only the first result is used.",
    ],
    autoteste: [
      {
        pergunta: "Why does calling `setN(n + 1)` three times in a row only add 1?",
        resposta:
          "Because the three calls read the same `n`, the one from the current render, and each schedules “n = 1”. With the functional form (`setN(a => a + 1)`), each update receives the previous result and the sum is 3.",
      },
      {
        pergunta: "What happens to state when the component unmounts?",
        resposta:
          "It is discarded. When it mounts again, `useState` goes back to the initial value; to keep the value, it has to live higher up (in the parent, in a context) or be persisted outside the component.",
      },
    ],
  },
};
