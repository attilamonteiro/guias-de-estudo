import type { Pergunta } from "../../tipos";

// L15 · Props versus state
export const l015: Pergunta = {
  numero: 15,
  modulo: "linkedin-fundamentos",
  metodo: "compare",
  pt: {
    titulo: "Props versus state",
    pergunta: "Props vs state?",
    porqueEsteMetodo:
      "Props e state se confundem porque os dois guardam dados e os dois fazem a tela mudar. Uma matriz lado a lado mostra em que cada um difere (dono, quem altera, fluxo), e a regra de decisão diz qual usar.",
    resposta30s:
      "**Props** são dados que vêm **de fora** (do pai) e são **somente leitura** para quem as recebe; **state** é a **memória interna** do componente, que muda pelo **setter**, e a mudança de qualquer um dos dois faz o componente renderizar de novo. Dado que muda no tempo e pertence ao componente é state; dado controlado pelo pai é prop; dado que se calcula a partir de outros não precisa de nenhum dos dois. Quando dois irmãos precisam do mesmo dado, **eleve o state** ao pai comum.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Props contra state",
        colunas: ["Aspecto", "Props", "State"],
        linhas: [
          ["Dono do dado", "O pai, que o passa de fora", "O próprio componente"],
          [
            "Quem pode alterar",
            "Só o pai, passando um valor novo; o filho não altera",
            "O próprio componente, pelo setter",
          ],
          ["Mutável?", "Somente leitura para quem as recebe", "Não se muda no lugar: o setter troca por um valor novo"],
          [
            "Dispara nova renderização?",
            "Sim, quando o pai renderiza e passa valores diferentes",
            "Sim, o setter agenda uma renderização se o valor mudou",
          ],
          ["Para onde flui", "De cima para baixo (pai para filho)", "Fica no componente e desce aos filhos como props"],
          [
            "Valor inicial",
            "Quem usa o componente decide (ou o valor padrão)",
            "O componente decide (`useState(inicial)`)",
          ],
          ["Como se declara", "Parâmetro da função", "`useState` ou `useReducer`"],
          ["Exemplos", "`titulo`, `usuario`, `aoSalvar`", "Texto digitado, aberto ou fechado, item selecionado"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte quem **manda** no dado. Muda no tempo e só este componente se importa? **State.** Quem usa o componente é que decide? **Prop.** Pode ser calculado a partir de props ou de outro state? **Nenhum dos dois**: calcule durante a renderização. Se dois componentes precisam do mesmo dado, **eleve o state** ao ancestral comum mais próximo, que passa o valor como prop e uma função para mudá-lo.",
      },
      {
        tipo: "codigo",
        titulo: "Elevar o state ao pai comum",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Botao({ aberto, aoAlternar }) {
  return <button onClick={aoAlternar}>{aberto ? "Fechar" : "Abrir"}</button>;
}

function Painel({ aberto }) {
  return aberto ? <p>Conteúdo do painel</p> : null;
}

export default function Pagina() {
  const [aberto, setAberto] = useState(false); // state do pai comum

  return (
    <>
      <Botao aberto={aberto} aoAlternar={() => setAberto(!aberto)} />
      <Painel aberto={aberto} />
    </>
  );
}`,
        nota: "`Botao` e `Painel` são irmãos e não se falam: o state vive em `Pagina`, que o entrega a cada um como prop e dá ao botão a função que o muda.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Com estado, sem estado e a confusão com função e classe",
        texto:
          "Componente **com estado** (stateful) é o que guarda state; **sem estado** (stateless) só recebe props e devolve JSX, o que o deixa mais fácil de reaproveitar e testar. Não confunda com **funcional contra classe** (veja L12): antes dos Hooks só a classe tinha state, mas hoje uma função também tem. E o state de um pai vira prop do filho: o mesmo dado é “state” onde mora e “prop” onde chega.",
      },
    ],
    armadilhas: [
      "Copiar uma prop para o state (`useState(props.x)`): o state guarda só o valor inicial e deixa de acompanhar o pai.",
      "Guardar em state o que se calcula de props ou de outro state: duas verdades que divergem.",
      "Tentar alterar uma prop dentro do filho: quem muda o dado é o dono dele, por uma função passada como prop.",
      "Duplicar o mesmo dado em dois states de irmãos e sincronizá-los com efeitos, em vez de elevar o state ao pai comum.",
    ],
    autoteste: [
      {
        pergunta: "Quando devo elevar o state?",
        resposta:
          "Quando dois ou mais componentes precisam ler ou mudar o mesmo dado: o state vai para o ancestral comum mais próximo, que passa o valor por props e uma função para mudá-lo.",
      },
      {
        pergunta: "`const total = itens.length` é props, state ou nenhum dos dois?",
        resposta:
          "Nenhum: é um valor derivado, calculado a cada renderização a partir de `itens`. Guardá-lo em state criaria uma segunda fonte da verdade.",
      },
    ],
  },
  en: {
    titulo: "Props versus state",
    pergunta: "Props vs state?",
    porqueEsteMetodo:
      "Props and state get mixed up because both hold data and both make the screen change. A side-by-side matrix shows where each one differs (owner, who changes it, flow), and the decision rule says which to use.",
    resposta30s:
      "**Props** are data that come **from outside** (from the parent) and are **read-only** for whoever receives them; **state** is the component’s **internal memory**, changed through the **setter**, and a change in either one makes the component render again. Data that changes over time and belongs to the component is state; data controlled by the parent is a prop; data that can be computed from other data needs neither. When two siblings need the same data, **lift the state up** to their common parent.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Props versus state",
        colunas: ["Aspect", "Props", "State"],
        linhas: [
          ["Owner of the data", "The parent, which passes it from outside", "The component itself"],
          [
            "Who can change it",
            "Only the parent, by passing a new value; the child does not change it",
            "The component itself, through the setter",
          ],
          ["Mutable?", "Read-only for whoever receives them", "Not changed in place: the setter swaps in a new value"],
          [
            "Triggers a new render?",
            "Yes, when the parent renders and passes different values",
            "Yes, the setter schedules a render if the value changed",
          ],
          [
            "Where it flows",
            "Top to bottom (parent to child)",
            "Stays in the component and goes down to children as props",
          ],
          [
            "Initial value",
            "Whoever uses the component decides (or the default value)",
            "The component decides (`useState(initial)`)",
          ],
          ["How it is declared", "A function parameter", "`useState` or `useReducer`"],
          ["Examples", "`title`, `user`, `onSave`", "Typed text, open or closed, selected item"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask who is **in charge** of the data. Does it change over time and only this component cares? **State.** Does whoever uses the component decide? **Prop.** Can it be computed from props or other state? **Neither**: compute it during render. If two components need the same data, **lift the state up** to the nearest common ancestor, which passes the value as a prop and a function to change it.",
      },
      {
        tipo: "codigo",
        titulo: "Lifting state up to the common parent",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Toggle({ open, onToggle }) {
  return <button onClick={onToggle}>{open ? "Close" : "Open"}</button>;
}

function Panel({ open }) {
  return open ? <p>Panel content</p> : null;
}

export default function Page() {
  const [open, setOpen] = useState(false); // state of the common parent

  return (
    <>
      <Toggle open={open} onToggle={() => setOpen(!open)} />
      <Panel open={open} />
    </>
  );
}`,
        nota: "`Toggle` and `Panel` are siblings and do not talk to each other: the state lives in `Page`, which hands it to each as a prop and gives the button the function that changes it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Stateful, stateless and the mix-up with function and class",
        texto:
          "A **stateful** component keeps state; a **stateless** one only receives props and returns JSX, which makes it easier to reuse and test. Do not confuse this with **functional versus class** (see L12): before Hooks only classes had state, but today a function has it too. And a parent’s state becomes the child’s prop: the same data is “state” where it lives and “props” where it arrives.",
      },
    ],
    armadilhas: [
      "Copying a prop into state (`useState(props.x)`): the state keeps only the initial value and stops following the parent.",
      "Storing in state what is computed from props or other state: two truths that drift apart.",
      "Trying to change a prop inside the child: whoever owns the data changes it, through a function passed as a prop.",
      "Duplicating the same data in two sibling states and syncing them with effects, instead of lifting the state to the common parent.",
    ],
    autoteste: [
      {
        pergunta: "When should I lift state up?",
        resposta:
          "When two or more components need to read or change the same data: the state goes to the nearest common ancestor, which passes the value through props and a function to change it.",
      },
      {
        pergunta: "Is `const total = items.length` props, state or neither?",
        resposta:
          "Neither: it is a derived value, computed on every render from `items`. Storing it in state would create a second source of truth.",
      },
    ],
  },
};
