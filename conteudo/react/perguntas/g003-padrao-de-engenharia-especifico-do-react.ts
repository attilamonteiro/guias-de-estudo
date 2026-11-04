import type { Pergunta } from "../../tipos";

// G03 · Padrão de engenharia específico do React
export const g003: Pergunta = {
  numero: 303,
  modulo: "glassdoor-react",
  metodo: "compare",
  pt: {
    titulo: "Padrão de engenharia específico do React",
    pergunta: "Você pode me falar sobre um padrão de engenharia específico do React?",
    porqueEsteMetodo:
      "Os padrões do React atacam o mesmo problema (reaproveitar lógica e estrutura) de jeitos diferentes, e a pergunta quer saber se você escolhe pelo custo e pelo contexto. A matriz põe os padrões lado a lado e a regra de decisão fecha a escolha.",
    resposta30s:
      "O padrão mais característico hoje é o **hook customizado**: extrai lógica com estado e efeitos para uma função `useAlgo` que cada componente chama. Antes dele, o ecossistema usava **componentes de ordem superior (HOC)** e **render props** para o mesmo fim, e ainda usa **componentes compostos** para APIs flexíveis de interface e a divisão **container/apresentação**. Em geral: **hook** para lógica, **composição** (`children`, componentes compostos) para estrutura; HOC e render prop ficam para casos específicos.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cada padrão resolve um problema, com um custo",
        colunas: ["Padrão", "Problema que resolve", "Como funciona", "Custos", "Situação hoje"],
        linhas: [
          [
            "Hook customizado",
            "Reaproveitar lógica com estado e efeitos",
            "Função `useX` que usa outros hooks e devolve valores ou funções; cada chamada tem o seu próprio estado",
            "Só em componentes de função e outros hooks; não reaproveita JSX; segue as regras dos hooks (veja L61)",
            "O padrão principal para lógica (veja L60)",
          ],
          [
            "Componente de ordem superior (HOC)",
            "Dar o mesmo comportamento a vários componentes (permissão, dados injetados, tema)",
            "Função que recebe um componente e devolve outro, com props extras ou envolvendo-o",
            "Aninhamento na árvore, colisão de nomes de props, tipagem difícil e origem da prop pouco clara",
            "Menos usado; ainda aparece em bibliotecas e com componentes de classe (veja S46)",
          ],
          [
            "Render props",
            "Compartilhar lógica deixando quem usa decidir o JSX",
            "Um componente recebe uma função (muitas vezes `children`) e a chama com os dados",
            "Funções aninhadas difíceis de ler, indireção e uma função nova a cada render",
            "Em boa parte substituído por hooks; ainda útil quando a lógica precisa de um pedaço do JSX",
          ],
          [
            "Componentes compostos",
            "API flexível para interfaces com partes relacionadas (abas, menu, acordeão)",
            "Um pai e filhos que compartilham estado por contexto (`<Abas><Abas.Lista>…`)",
            "Contexto implícito, necessidade de validar o uso correto dos filhos e mais exportações",
            "Muito usado em bibliotecas de componentes",
          ],
          [
            "Container e apresentação",
            "Separar buscar e gerir dados de desenhar a tela",
            "O container busca e guarda o estado; o componente de apresentação só recebe props",
            "Dois componentes por tela, props apenas repassadas e divisão rígida demais",
            "A ideia vive (lógica separada da interface), mas hoje costuma ser um hook mais um componente",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A mesma lógica reaproveitada de três jeitos",
        legenda: "JSX",
        codigo: `// Mesma lógica (a largura da janela, em useLargura), reaproveitada de três jeitos

// 1) Hook: o componente chama a lógica direto
function Topo() {
  const largura = useLargura();
  return <h1>{largura < 600 ? "Compacto" : "Completo"}</h1>;
}

// 2) Render prop: um componente chama a função que recebeu
function Largura({ children }) {
  return children(useLargura());
}
// uso: <Largura>{(l) => <h1>{l}px</h1>}</Largura>

// 3) HOC: recebe um componente e devolve outro, com a prop injetada
function comLargura(Comp) {
  return function ComLargura(props) {
    return <Comp {...props} largura={useLargura()} />;
  };
}`,
        nota: "`useLargura` é um hook que guarda `window.innerWidth` num estado e o atualiza no evento `resize`, removendo o ouvinte na limpeza (veja L60). Note como o hook é o mais curto e o único sem componente extra na árvore.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Reaproveitar **lógica** (estado, efeito, assinatura): hook customizado. Reaproveitar **estrutura**, ou deixar quem usa montar as partes: composição, `children` e componentes compostos. Dar o mesmo comportamento a muitos componentes, **inclusive de classe**, ou envolver a árvore: HOC. Deixar quem usa decidir o JSX de uma parte interna: render prop (ou `children` como função). Comece pelo mais simples: um hook e um componente comum.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Padrões antigos não são errados, mas as recomendações evoluem",
        texto:
          "Os hooks substituíram boa parte do uso de HOC e render props, e a documentação oficial (react.dev) privilegia componentes de função e hooks. Código legado e bibliotecas continuam usando os padrões antigos, e você precisa saber lê-los e mantê-los; não reescreva por moda. Recursos recentes, como Server Components e Actions, também mudam o que é idiomático: confira react.dev.",
      },
    ],
    armadilhas: [
      "Aplicar um HOC dentro do `render` (criando um componente novo a cada render): a árvore é remontada e o estado se perde. O HOC é aplicado fora do componente, uma vez.",
      "Usar render prop ou HOC onde um hook resolveria, aumentando aninhamento e indireção sem ganho.",
      "Dividir tudo em container e apresentação por regra, criando camadas que só repassam props.",
      "Componentes compostos que dependem de contexto sem avisar quando são usados fora do pai.",
    ],
    autoteste: [
      {
        pergunta: "Por que os hooks reduziram o uso de HOC e render props?",
        resposta:
          "Porque extraem lógica com estado e efeitos para uma função comum, sem aninhar componentes na árvore, sem colisão de props e com tipagem mais simples. Cada chamada de hook tem o seu próprio estado.",
      },
      {
        pergunta: "Em que situação um HOC ou uma render prop ainda faz sentido?",
        resposta:
          "HOC: dar comportamento a componentes de classe ou envolver a árvore (como o `connect` do react-redux ou um invólucro de permissão). Render prop: o componente fornece dados e deixa quem usa montar parte do JSX. Em código novo, comece por hook ou composição.",
      },
    ],
  },
  en: {
    titulo: "A React-specific engineering pattern",
    pergunta: "Can you tell me about an engineering pattern specific to React?",
    porqueEsteMetodo:
      "React’s patterns attack the same problem (reusing logic and structure) in different ways, and the question wants to know whether you choose by cost and context. The matrix puts the patterns side by side and the decision rule closes the choice.",
    resposta30s:
      "The most characteristic pattern today is the **custom hook**: it extracts logic with state and effects into a `useSomething` function that each component calls. Before it, the ecosystem used **higher-order components (HOCs)** and **render props** for the same purpose, and it still uses **compound components** for flexible UI APIs and the **container/presentational** split. In general: **hook** for logic, **composition** (`children`, compound components) for structure; HOCs and render props are kept for specific cases.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Each pattern solves a problem, at a cost",
        colunas: ["Pattern", "Problem it solves", "How it works", "Costs", "Status today"],
        linhas: [
          [
            "Custom hook",
            "Reuse logic with state and effects",
            "A `useX` function that uses other hooks and returns values or functions; each call has its own state",
            "Only in function components and other hooks; does not reuse JSX; follows the rules of hooks (see L61)",
            "The main pattern for logic (see L60)",
          ],
          [
            "Higher-order component (HOC)",
            "Give the same behavior to many components (permissions, injected data, theme)",
            "A function that takes a component and returns another, with extra props or wrapping it",
            "Nesting in the tree, prop-name collisions, hard typing and an unclear origin for props",
            "Less used; still found in libraries and with class components (see S46)",
          ],
          [
            "Render props",
            "Share logic while letting the caller decide the JSX",
            "A component receives a function (often `children`) and calls it with the data",
            "Nested functions that are hard to read, indirection and a new function on every render",
            "Largely replaced by hooks; still useful when the logic needs a piece of the JSX",
          ],
          [
            "Compound components",
            "A flexible API for UI with related parts (tabs, menu, accordion)",
            "A parent and children sharing state through context (`<Tabs><Tabs.List>…`)",
            "Implicit context, a need to validate the correct use of the children and more exports",
            "Widely used in component libraries",
          ],
          [
            "Container and presentational",
            "Separate fetching and managing data from drawing the screen",
            "The container fetches and holds the state; the presentational component only receives props",
            "Two components per screen, props merely passed down and a division that is too rigid",
            "The idea lives on (logic apart from the UI), but today it is usually a hook plus a component",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The same logic reused three ways",
        legenda: "JSX",
        codigo: `// Same logic (window width, in useWidth), reused three ways

// 1) Hook: the component calls the logic directly
function Header() {
  const width = useWidth();
  return <h1>{width < 600 ? "Compact" : "Full"}</h1>;
}

// 2) Render prop: a component calls the function it received
function Width({ children }) {
  return children(useWidth());
}
// usage: <Width>{(w) => <h1>{w}px</h1>}</Width>

// 3) HOC: takes a component and returns another, with the prop injected
function withWidth(Comp) {
  return function WithWidth(props) {
    return <Comp {...props} width={useWidth()} />;
  };
}`,
        nota: "`useWidth` is a hook that keeps `window.innerWidth` in state and updates it on the `resize` event, removing the listener in the cleanup (see L60). Notice that the hook is the shortest and the only one with no extra component in the tree.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Reusing **logic** (state, effect, subscription): custom hook. Reusing **structure**, or letting the caller assemble the parts: composition, `children` and compound components. Giving the same behavior to many components, **including class ones**, or wrapping the tree: HOC. Letting the caller decide the JSX of an inner part: render prop (or `children` as a function). Start with the simplest: a hook and a plain component.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Old patterns are not wrong, but the recommendations evolve",
        texto:
          "Hooks replaced much of the use of HOCs and render props, and the official documentation (react.dev) favors function components and hooks. Legacy code and libraries keep using the old patterns, and you need to be able to read and maintain them; do not rewrite out of fashion. Recent features, such as Server Components and Actions, also change what is idiomatic: check react.dev.",
      },
    ],
    armadilhas: [
      "Applying a HOC inside `render` (creating a new component on every render): the tree is remounted and state is lost. A HOC is applied outside the component, once.",
      "Using a render prop or HOC where a hook would do, adding nesting and indirection for nothing.",
      "Splitting everything into container and presentational by rule, creating layers that only pass props along.",
      "Compound components that depend on context without warning when they are used outside the parent.",
    ],
    autoteste: [
      {
        pergunta: "Why did hooks reduce the use of HOCs and render props?",
        resposta:
          "Because they extract logic with state and effects into a plain function, with no component nesting in the tree, no prop collisions and simpler typing. Each hook call has its own state.",
      },
      {
        pergunta: "When do a HOC or a render prop still make sense?",
        resposta:
          "HOC: giving behavior to class components or wrapping the tree (like react-redux’s `connect` or a permission wrapper). Render prop: the component supplies data and lets the caller assemble part of the JSX. In new code, start with a hook or composition.",
      },
    ],
  },
};
