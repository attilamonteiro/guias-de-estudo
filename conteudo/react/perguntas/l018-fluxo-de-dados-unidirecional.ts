import type { Pergunta } from "../../tipos";

// L18 · Fluxo de dados unidirecional
export const l018: Pergunta = {
  numero: 18,
  modulo: "linkedin-fundamentos",
  metodo: "whys",
  pt: {
    titulo: "Fluxo de dados unidirecional",
    pergunta: "O que é o fluxo de dados unidirecional?",
    porqueEsteMetodo:
      "O fluxo unidirecional é uma restrição escolhida de propósito, e só faz sentido quando se entende o que ela compra. A cadeia de “por quês” leva da regra (dados descem, mudanças sobem) até a razão (previsibilidade e rastreabilidade) e ao custo (árvores profundas).",
    resposta30s:
      "No **fluxo unidirecional** os dados descem do pai para o filho por **props** e as mudanças sobem por **callbacks**: o filho nunca escreve direto no pai. Assim cada dado tem uma **única origem da verdade** e o caminho de qualquer mudança é rastreável (evento, callback, setter, renderização). O custo é repassar props e funções por vários níveis em árvores profundas, o chamado **prop drilling**, que se resolve com composição, Context ou uma biblioteca de estado.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que os dados só descem do pai para o filho?",
            resposta:
              "Porque assim cada valor tem exatamente um dono: o componente que guarda o state. Os filhos recebem o dado por props e não podem alterá-lo. Não existem dois lugares que possam escrever no mesmo dado, então não existe a pergunta “quem mudou isto?”.",
          },
          {
            pergunta: "Por que as mudanças sobem por callbacks, e não por escrita direta?",
            resposta:
              "Porque a escrita tem de passar pelo dono. O pai entrega ao filho uma função (como `aoMudar`) e o filho a chama com o valor novo; o pai decide, chama o setter, o React renderiza de novo e as props novas descem. O filho pede, o pai decide.",
          },
          {
            pergunta: "Por que isso torna o app previsível e fácil de depurar?",
            resposta:
              "Porque o caminho de uma mudança é sempre o mesmo e linear: evento, callback, setter, renderização, props novas. Para saber de onde veio um valor, suba pela árvore até o componente que guarda o state; para saber quem pode mudá-lo, procure o setter. As ferramentas de desenvolvimento do React mostram props e state de cada componente.",
          },
          {
            pergunta: "Por que o React evita o binding bidirecional que outros frameworks oferecem?",
            resposta:
              "No binding bidirecional (como `v-model` no Vue ou `[(ngModel)]` no Angular) a tela escreve no modelo e o modelo atualiza a tela, e uma mudança pode disparar outras em cascata, o que dificulta saber quem causou o quê. O React troca a conveniência por explicitude: `value` mais `onChange` dão mais linhas, mas o fluxo fica visível. Os dois estilos têm vantagens; o ponto é a previsibilidade.",
          },
          {
            pergunta: "Por que a elevação do state é consequência natural, e qual é o custo?",
            resposta:
              "Se dois irmãos precisam do mesmo dado, nenhum pode escrever no outro; o dado sobe ao ancestral comum, que o passa para baixo por props junto com as funções de mudança. Em árvores profundas isso vira prop drilling: componentes do meio repassam props que não usam. As saídas, nesta ordem: composição (veja L19 e L80), Context (veja L81) e, para dado realmente global, uma biblioteca de estado (veja L78).",
          },
        ],
        causaRaiz:
          "Quando **só o dono escreve** no dado, a tela é função do state e toda mudança segue um caminho único e visível. O fluxo unidirecional troca um pouco de código a mais por **previsibilidade e rastreabilidade**.",
      },
      {
        tipo: "fluxo",
        titulo: "O ciclo de uma mudança",
        etapas: [
          "Um evento acontece no filho (por exemplo, digitar num campo)",
          "O filho chama o callback que recebeu por props, com o valor novo (`aoMudar(valor)`)",
          "O pai, dono do state, chama o setter",
          "O React renderiza o pai de novo, agora com o state novo",
          "As props novas descem para os filhos e a tela se atualiza",
        ],
        nota: "O dado nunca sobe sozinho: sobe o pedido de mudança.",
      },
      {
        tipo: "codigo",
        titulo: "Dois irmãos que se comunicam pelo pai",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Busca({ texto, aoMudar }) {
  return <input value={texto} onChange={(e) => aoMudar(e.target.value)} />;
}

function Resultados({ texto }) {
  return <p>Buscando por: {texto || "(nada)"}</p>;
}

export default function Pagina() {
  const [texto, setTexto] = useState(""); // o dono do dado

  return (
    <>
      <Busca texto={texto} aoMudar={setTexto} />
      <Resultados texto={texto} />
    </>
  );
}`,
        nota: "`Busca` e `Resultados` são irmãos e não falam entre si: o state sobe para `Pagina`, que desce o valor por props e entrega o setter como callback.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo: árvores profundas",
        texto:
          "Com muitos níveis entre o dono do state e quem o usa, os componentes do meio repassam props que não usam (prop drilling). Isso não é motivo para abandonar o fluxo unidirecional; prefira, nesta ordem, **composição** (criar o elemento lá em cima e passá-lo pronto por `children` ou por prop), **Context** para dados de uso amplo e pouca variação, e uma biblioteca de estado quando o dado é realmente global. E “unidirecional” não quer dizer “sem comunicação de volta”: ela existe, mas explícita, por callbacks.",
      },
    ],
    armadilhas: [
      "Achar que unidirecional significa que o filho não pode influenciar o pai: ele influencia, chamando um callback que o pai passou.",
      "Escrever no state do pai por referência, mutando um objeto recebido por props: burla o fluxo e a tela não atualiza (veja L17).",
      "Duplicar o mesmo dado em dois states de irmãos e sincronizá-los com efeitos: eleve o state ao ancestral comum.",
      "Resolver qualquer prop drilling com Context ou store global: antes veja se a composição resolve; nem todo repasse de props é problema.",
    ],
    autoteste: [
      {
        pergunta: "Como dois componentes irmãos compartilham um dado?",
        resposta:
          "O state sobe ao pai comum, que passa o valor por props aos dois e uma função para mudá-lo. O irmão que muda chama o callback, o pai atualiza o state e os dois recebem o valor novo.",
      },
      {
        pergunta: "Por que o fluxo unidirecional facilita a depuração?",
        resposta:
          "Porque cada dado tem um único dono e toda mudança segue o mesmo caminho (evento, callback, setter, renderização). Para achar a origem de um valor, basta subir até o componente que guarda o state.",
      },
    ],
  },
  en: {
    titulo: "One-way data flow",
    pergunta: "What is one-way data flow?",
    porqueEsteMetodo:
      "One-way flow is a restriction chosen on purpose, and it only makes sense once you see what it buys. The chain of whys goes from the rule (data goes down, changes go up) to the reason (predictability and traceability) and to the cost (deep trees).",
    resposta30s:
      "In **one-way data flow**, data goes down from parent to child through **props** and changes go up through **callbacks**: the child never writes directly to the parent. This gives every piece of data a **single source of truth** and makes the path of any change traceable (event, callback, setter, render). The cost is passing props and functions through many levels in deep trees, known as **prop drilling**, which composition, Context or a state library can solve.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does data only go down from parent to child?",
            resposta:
              "Because that way every value has exactly one owner: the component that holds the state. Children receive the data through props and cannot change it. There are never two places that can write to the same data, so the question “who changed this?” does not arise.",
          },
          {
            pergunta: "Why do changes go up through callbacks instead of direct writes?",
            resposta:
              "Because writes must go through the owner. The parent hands the child a function (such as `onChange`) and the child calls it with the new value; the parent decides, calls the setter, React renders again and the new props flow down. The child asks, the parent decides.",
          },
          {
            pergunta: "Why does that make the app predictable and easy to debug?",
            resposta:
              "Because the path of a change is always the same and linear: event, callback, setter, render, new props. To find where a value came from, climb the tree to the component that holds the state; to find who can change it, look for the setter. React’s developer tools show the props and state of each component.",
          },
          {
            pergunta: "Why does React avoid the two-way binding that other frameworks offer?",
            resposta:
              "With two-way binding (such as `v-model` in Vue or `[(ngModel)]` in Angular) the screen writes to the model and the model updates the screen, and one change can trigger others in a cascade, making it hard to tell who caused what. React trades convenience for explicitness: `value` plus `onChange` take more lines, but the flow is visible. Both styles have advantages; the point here is predictability.",
          },
          {
            pergunta: "Why is lifting state a natural consequence, and what does it cost?",
            resposta:
              "If two siblings need the same data, neither can write to the other; the data goes up to the common ancestor, which passes it down through props along with the functions that change it. In deep trees this becomes prop drilling: components in the middle forward props they do not use. The ways out, in this order: composition (see L19 and L80), Context (see L81) and, for truly global data, a state library (see L78).",
          },
        ],
        causaRaiz:
          "When **only the owner writes** to the data, the screen is a function of state and every change follows a single visible path. One-way flow trades a little extra code for **predictability and traceability**.",
      },
      {
        tipo: "fluxo",
        titulo: "The cycle of a change",
        etapas: [
          "An event happens in the child (for example, typing in a field)",
          "The child calls the callback it received through props, with the new value (`onChange(value)`)",
          "The parent, which owns the state, calls the setter",
          "React renders the parent again, now with the new state",
          "The new props flow down to the children and the screen updates",
        ],
        nota: "The data never goes up on its own: what goes up is the request for a change.",
      },
      {
        tipo: "codigo",
        titulo: "Two siblings communicating through the parent",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Search({ text, onChange }) {
  return <input value={text} onChange={(e) => onChange(e.target.value)} />;
}

function Results({ text }) {
  return <p>Searching for: {text || "(nothing)"}</p>;
}

export default function Page() {
  const [text, setText] = useState(""); // the owner of the data

  return (
    <>
      <Search text={text} onChange={setText} />
      <Results text={text} />
    </>
  );
}`,
        nota: "`Search` and `Results` are siblings and do not talk to each other: the state goes up to `Page`, which passes the value down through props and hands over the setter as a callback.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost: deep trees",
        texto:
          "With many levels between the owner of the state and whoever uses it, the components in the middle forward props they do not use (prop drilling). That is no reason to abandon one-way flow; prefer, in this order, **composition** (create the element up top and pass it ready-made through `children` or a prop), **Context** for widely used, slowly changing data, and a state library when the data is truly global. And “one-way” does not mean “no communication back”: it exists, but explicitly, through callbacks.",
      },
    ],
    armadilhas: [
      "Thinking one-way means the child cannot influence the parent: it does, by calling a callback the parent passed.",
      "Writing to the parent’s state by reference, mutating an object received through props: it bypasses the flow and the screen does not update (see L17).",
      "Duplicating the same data in two sibling states and syncing them with effects: lift the state to the common ancestor.",
      "Solving every prop drilling with Context or a global store: first check whether composition solves it; not every forwarding of props is a problem.",
    ],
    autoteste: [
      {
        pergunta: "How do two sibling components share a piece of data?",
        resposta:
          "The state goes up to the common parent, which passes the value to both through props and a function to change it. The sibling that changes it calls the callback, the parent updates the state and both receive the new value.",
      },
      {
        pergunta: "Why does one-way data flow make debugging easier?",
        resposta:
          "Because each piece of data has a single owner and every change follows the same path (event, callback, setter, render). To find where a value came from, just climb to the component that holds the state.",
      },
    ],
  },
};
