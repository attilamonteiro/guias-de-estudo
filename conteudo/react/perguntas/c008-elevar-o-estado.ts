import type { Pergunta } from "../../tipos";

// C08 · Elevar o estado
export const c008: Pergunta = {
  numero: 508,
  modulo: "coddy-iniciante",
  metodo: "design",
  pt: {
    titulo: "Elevar o estado",
    pergunta: "O que significa elevar o estado?",
    porqueEsteMetodo:
      "É uma pergunta de projeto: dois componentes precisam do mesmo dado e alguém tem de decidir onde ele mora. Um roteiro fixo (requisitos, dono do estado, contrato de props, dados, custos) evita tanto o estado duplicado quanto o estado alto demais.",
    resposta30s:
      "**Elevar o estado** (lifting state up) é tirar o estado de um componente e movê-lo para o **ancestral comum mais próximo** dos componentes que precisam dele. O pai passa o valor para baixo por props, e também uma **função de alteração**, que os filhos chamam para pedir a mudança. Assim há uma **única fonte da verdade** e os irmãos não saem de sincronia. O custo é passar props por componentes intermediários (prop drilling) e re-renderizar mais a partir do pai; se doer, considere composição, context ou uma biblioteca de estado.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Dois irmãos precisam do mesmo dado: um campo de busca e a lista que ele filtra, dois campos de temperatura, um carrinho e o seu total. Exigências: os dois sempre mostram o mesmo valor, e qualquer um pode pedir a mudança.",
          },
          {
            titulo: "2. Ache o dono do estado",
            texto:
              "Suba na árvore até o **ancestral comum mais próximo** dos componentes que usam o dado. Mais alto do que isso só aumenta o alcance dos re-renders e das props; mais baixo, um dos dois fica sem acesso.",
          },
          {
            titulo: "3. Decisão central: mova o `useState` para o ancestral",
            texto:
              "O estado deixa de existir nos filhos, que passam a ser **controlados**: não guardam o valor, apenas o exibem e avisam quando o usuário quer mudá-lo.",
          },
          {
            titulo: "4. Contrato: o que desce e o que sobe",
            texto:
              "O valor desce por props (`busca`) e a função de alteração também desce por props (`aoMudar`). O filho chama `aoMudar(novoValor)`; o pai atualiza o estado e todos re-renderizam com o valor novo. É o fluxo de mão única do React: dados para baixo, eventos para cima.",
          },
          {
            titulo: "5. Dados: o mínimo de estado",
            texto:
              "Guarde só o que não se calcula. O que dá para derivar (a lista filtrada, o total, o valor em outra unidade) é calculado no render a partir do estado. Copiar uma prop para um `useState` (`useState(props.valor)`) cria uma segunda fonte da verdade que não acompanha as mudanças.",
          },
          {
            titulo: "6. Custo e operação",
            texto:
              "O pai re-renderiza a cada mudança e, por padrão, seus filhos também; meça antes de memorizar. Se as props atravessam muitos níveis só para chegar ao destino, avalie composição (passar elementos como `children`), context ou uma biblioteca de estado. E se depois só um filho usar o dado, devolva o estado a ele.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde o estado deve morar",
        colunas: ["Opção", "Quando escolher", "Custo"],
        linhas: [
          ["Estado local", "Só um componente usa o dado", "Nenhum: é o ponto de partida"],
          [
            "Elevado ao ancestral comum",
            "Dois ou poucos componentes irmãos precisam do mesmo dado",
            "Props atravessam intermediários; o pai re-renderiza mais",
          ],
          [
            "Composição (`children` ou elementos como props)",
            "Os intermediários só repassam o dado",
            "Reorganiza o JSX do componente de cima",
          ],
          [
            "Context",
            "Dado lido por muitos níveis da subárvore (tema, usuário, idioma)",
            "Todo consumidor re-renderiza quando o valor muda; acopla os componentes",
          ],
          [
            "Biblioteca de estado ou cache de dados do servidor",
            "Estado amplo, com muitas leituras seletivas, ou dado que vem do servidor",
            "Dependência nova e convenções a aprender",
          ],
          [
            "URL",
            "Filtro ou página que precisa ser compartilhável e sobreviver ao recarregar",
            "Serializar e validar os valores",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Busca e lista compartilhando um estado",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function CampoDeBusca({ busca, aoMudar }) {
  return <input value={busca} onChange={(e) => aoMudar(e.target.value)} placeholder="Buscar" />;
}

function Resultados({ itens, busca }) {
  const visiveis = itens.filter((i) => i.toLowerCase().includes(busca.toLowerCase())); // derivado
  return <ul>{visiveis.map((i) => <li key={i}>{i}</li>)}</ul>;
}

export function Catalogo() {
  const [busca, setBusca] = useState(""); // elevado: o ancestral comum é o dono
  return (
    <>
      <CampoDeBusca busca={busca} aoMudar={setBusca} />
      <Resultados itens={["Maçã", "Banana", "Manga"]} busca={busca} />
    </>
  );
}`,
        nota: "A lista filtrada não é estado: sai do render. O texto digitado é o único dado guardado, e só em `Catalogo`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece com o estado no componente que o usa. Quando um irmão precisar do mesmo dado, mova-o para o ancestral comum **mais próximo**, e não além. Se ele atravessar muitos níveis sem uso, pense em composição ou context; se virar estado amplo da aplicação, em uma biblioteca. E nunca mantenha o mesmo dado em dois lugares.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cópia de prop em estado",
        texto:
          "`const [valor, setValor] = useState(props.valor)` só usa a prop na primeira renderização: mudanças posteriores no pai são ignoradas e o filho exibe um valor velho. Se o dado vem do pai, leia a prop direto e chame `aoMudar`. Só mantenha uma cópia quando for um rascunho deliberado, e reinicie o filho trocando a `key` quando for o caso.",
      },
    ],
    armadilhas: [
      "Duplicar o estado nos irmãos e tentar sincronizá-lo com efeitos: duas fontes da verdade garantem divergência.",
      "Guardar no estado algo que se calcula (lista filtrada, total): vira estado derivado que sai de sincronia.",
      "Elevar além do necessário: o estado sobe até a raiz, tudo re-renderiza e as props atravessam a aplicação inteira.",
      "Esquecer de passar a função de alteração: o filho vira um campo controlado que não consegue mudar (um `value` sem `onChange` fica travado).",
    ],
    autoteste: [
      {
        pergunta: "Quando elevar o estado, e até onde?",
        resposta:
          "Quando dois ou mais componentes precisam ler ou alterar o mesmo dado. Eleve até o ancestral comum mais próximo deles, nem mais alto: o estado fica o mais baixo possível que ainda alcance todos.",
      },
      {
        pergunta: "Como os filhos alteram um estado que agora mora no pai?",
        resposta:
          "O pai passa uma função de alteração por props (o próprio setter ou um callback que o chama). O filho a chama com o novo valor, o pai atualiza o estado e todos re-renderizam com ele.",
      },
    ],
  },
  en: {
    titulo: "Lifting state up",
    pergunta: "What does lifting state up mean?",
    porqueEsteMetodo:
      "This is a design question: two components need the same data and someone has to decide where it lives. A fixed outline (requirements, state owner, props contract, data, costs) prevents both duplicated state and state that sits too high.",
    resposta30s:
      "**Lifting state up** means taking state out of a component and moving it to the **closest common ancestor** of the components that need it. The parent passes the value down through props, and also a **change function** that the children call to request an update. That gives you a **single source of truth** and the siblings never drift out of sync. The cost is passing props through intermediate components (prop drilling) and re-rendering more from the parent; if it hurts, consider composition, context or a state library.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The outline applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Two siblings need the same data: a search box and the list it filters, two temperature fields, a cart and its total. Requirements: both always show the same value, and either one can request a change.",
          },
          {
            titulo: "2. Find the state owner",
            texto:
              "Walk up the tree to the **closest common ancestor** of the components that use the data. Higher than that only widens the reach of re-renders and props; lower, and one of the two cannot reach it.",
          },
          {
            titulo: "3. Core decision: move the `useState` to the ancestor",
            texto:
              "The state stops existing in the children, which become **controlled**: they do not hold the value, they just display it and report when the user wants to change it.",
          },
          {
            titulo: "4. Contract: what goes down and what goes up",
            texto:
              "The value goes down through props (`query`) and the change function goes down through props too (`onChange`). The child calls `onChange(newValue)`; the parent updates the state and everyone re-renders with the new value. This is React’s one-way flow: data down, events up.",
          },
          {
            titulo: "5. Data: the minimum state",
            texto:
              "Store only what cannot be computed. Whatever can be derived (the filtered list, the total, the value in another unit) is computed during render from the state. Copying a prop into a `useState` (`useState(props.value)`) creates a second source of truth that does not follow changes.",
          },
          {
            titulo: "6. Cost and operation",
            texto:
              "The parent re-renders on every change and, by default, so do its children; measure before memoizing. If props cross many levels just to reach their destination, consider composition (passing elements as `children`), context or a state library. And if later only one child uses the data, give the state back to it.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where state should live",
        colunas: ["Option", "When to choose it", "Cost"],
        linhas: [
          ["Local state", "Only one component uses the data", "None: it is the starting point"],
          [
            "Lifted to the common ancestor",
            "Two or a few sibling components need the same data",
            "Props cross intermediaries; the parent re-renders more",
          ],
          [
            "Composition (`children` or elements as props)",
            "The intermediaries only pass the data along",
            "Rearranges the JSX of the component above",
          ],
          [
            "Context",
            "Data read at many levels of the subtree (theme, user, language)",
            "Every consumer re-renders when the value changes; couples the components",
          ],
          [
            "State library or server-data cache",
            "Broad state with many selective reads, or data that comes from the server",
            "A new dependency and conventions to learn",
          ],
          [
            "URL",
            "A filter or page that must be shareable and survive a reload",
            "Serializing and validating the values",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A search box and a list sharing one state",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function SearchBox({ query, onChange }) {
  return <input value={query} onChange={(e) => onChange(e.target.value)} placeholder="Search" />;
}

function Results({ items, query }) {
  const visible = items.filter((i) => i.toLowerCase().includes(query.toLowerCase())); // derived
  return <ul>{visible.map((i) => <li key={i}>{i}</li>)}</ul>;
}

export function Catalog() {
  const [query, setQuery] = useState(""); // lifted: the common ancestor owns it
  return (
    <>
      <SearchBox query={query} onChange={setQuery} />
      <Results items={["Apple", "Banana", "Mango"]} query={query} />
    </>
  );
}`,
        nota: "The filtered list is not state: it comes out of render. The typed text is the only stored data, and only in `Catalog`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with the state in the component that uses it. When a sibling needs the same data, move it to the **closest** common ancestor, and no further. If it crosses many levels without being used, think composition or context; if it becomes application-wide state, think of a library. And never keep the same data in two places.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Copying a prop into state",
        texto:
          "`const [value, setValue] = useState(props.value)` only uses the prop on the first render: later changes in the parent are ignored and the child shows a stale value. If the data comes from the parent, read the prop directly and call `onChange`. Keep a copy only as a deliberate draft, and reset the child by changing its `key` when needed.",
      },
    ],
    armadilhas: [
      "Duplicating the state in the siblings and trying to sync it with effects: two sources of truth guarantee divergence.",
      "Storing something computable in state (a filtered list, a total): it becomes derived state that drifts out of sync.",
      "Lifting further than necessary: the state climbs to the root, everything re-renders and props cross the whole application.",
      "Forgetting to pass the change function: the child becomes a controlled field that cannot change (a `value` without `onChange` is stuck).",
    ],
    autoteste: [
      {
        pergunta: "When do you lift state, and how far?",
        resposta:
          "When two or more components need to read or change the same data. Lift it to their closest common ancestor, no higher: the state stays as low as possible while still reaching all of them.",
      },
      {
        pergunta: "How do the children change state that now lives in the parent?",
        resposta:
          "The parent passes a change function through props (the setter itself or a callback that calls it). The child calls it with the new value, the parent updates the state and everyone re-renders with it.",
      },
    ],
  },
};
