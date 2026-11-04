import type { Pergunta } from "../../tipos";

// L79 · O que é prop drilling
export const l079: Pergunta = {
  numero: 79,
  modulo: "linkedin-estado",
  metodo: "feynman",
  pt: {
    titulo: "O que é prop drilling",
    pergunta: "O que é prop drilling?",
    porqueEsteMetodo:
      "Prop drilling é um problema de caminho: o dado precisa chegar longe. Uma analogia do cotidiano mostra o incômodo antes dos termos técnicos, e depois vêm as saídas e o ponto em que a imagem para de valer.",
    resposta30s:
      "**Prop drilling** é passar props por vários componentes intermediários que **não as usam**, só para que um descendente profundo as receba. Custa acoplamento, manutenção difícil e mudanças em cascata, mas um ou dois níveis não são problema. As saídas, da mais simples à mais pesada, são **composição com `children`**, **aproximar ou elevar o estado**, **Context** e **bibliotecas de estado**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um prédio de dez andares e um recado para quem trabalha no último andar. Em vez de ir direto, o recado precisa passar de sala em sala, andar por andar: cada pessoa no caminho recebe o papel, não tem nada a ver com ele e só o entrega ao próximo. Se o recado muda de formato, todo mundo no caminho precisa ser avisado.",
        tecnico:
          "No React, o dado vive num componente alto e é consumido por um descendente profundo. Como as props só descem de pai para filho, cada componente intermediário recebe a prop e a repassa, mesmo sem usá-la. O resultado: os intermediários ganham uma prop que não é deles (**acoplamento**), renomear ou acrescentar um dado obriga a editar todos os elos (**mudanças em cascata**), os componentes ficam mais difíceis de reutilizar e de entender, e a lista de props só cresce.",
        limite:
          "A analogia faz parecer que passar adiante é sempre ruim, mas **props explícitas são um mérito do React**: o fluxo de dados fica visível e fácil de seguir. Um ou dois níveis não precisam de remédio. O incômodo começa quando o caminho é longo, vários elos nem conhecem o dado e as assinaturas só engordam.",
      },
      {
        tipo: "tabela",
        titulo: "Saídas e quando cada uma compensa",
        colunas: ["Saída", "Como funciona", "Quando compensa", "Custo"],
        linhas: [
          [
            "Aceitar o drilling",
            "Continuar passando props",
            "Um ou dois níveis, dado que muda pouco",
            "Nenhum enquanto o caminho é curto: o fluxo fica explícito",
          ],
          [
            "Composição (`children` e slots)",
            "O componente alto monta o filho profundo e o entrega pronto como `children` ou prop (slot); os intermediários só o posicionam",
            "Intermediários que apenas organizam o layout",
            "Exige repensar a árvore, e o componente alto fica maior",
          ],
          [
            "Aproximar ou elevar o estado",
            "Mover o estado para perto de quem o usa, ou subi-lo ao ancestral comum mais próximo",
            "O estado está mais alto do que precisa",
            "Pode exigir reorganizar componentes",
          ],
          [
            "Context",
            "Um provider entrega o valor a qualquer descendente via `useContext`",
            "Dado lido em muitos pontos e que muda pouco (tema, usuário, idioma)",
            "Todo consumidor re-renderiza quando o valor muda (veja L82)",
          ],
          [
            "Biblioteca de estado",
            "Store externa lida por seletores em qualquer componente",
            "Estado compartilhado, atualizado com frequência ou complexo",
            "Dependência extra e convenções novas (veja L83 e L84)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Do drilling à composição",
        legenda: "JSX",
        codigo: [
          "// Drilling: Layout e Cabecalho só repassam `usuario`",
          "function App({ usuario }) {",
          "  return <Layout usuario={usuario} />;",
          "}",
          "function Layout({ usuario }) {",
          "  return <Cabecalho usuario={usuario} />;",
          "}",
          "function Cabecalho({ usuario }) {",
          "  return <Avatar nome={usuario.nome} />;",
          "}",
          "",
          "// Composição: quem tem o dado monta o Avatar e entrega pronto",
          "function AppComposto({ usuario }) {",
          "  return <LayoutComSlot cabecalho={<Avatar nome={usuario.nome} />} />;",
          "}",
          "function LayoutComSlot({ cabecalho }) {",
          "  return <header>{cabecalho}</header>; // nem sabe que existe `usuario`",
          "}",
        ].join("\n"),
        nota: "No primeiro trecho, `Layout` e `Cabecalho` carregam uma prop que não usam. No segundo, `AppComposto` monta o `Avatar` e `LayoutComSlot` apenas o posiciona.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra prática",
        texto:
          "Comece **aceitando** o drilling e a **composição**. Se o dado está alto demais, **aproxime ou eleve** o estado. Só então use **Context** para leituras espalhadas que mudam pouco e, por último, uma **biblioteca de estado** para estado amplo e dinâmico. O Context não é o primeiro remédio: ele troca o incômodo da passagem por outro, o dos re-renders de todos os consumidores.",
      },
    ],
    armadilhas: [
      "Usar Context para qualquer prop que passa por dois níveis: troca um custo pequeno e explícito por outro implícito e mais amplo.",
      "Chamar de prop drilling qualquer passagem de props: o problema é repassar sem usar, por um caminho longo.",
      "Esquecer a composição: muitas vezes basta passar o elemento pronto como `children` ou slot e o drilling some, sem Context.",
      "Resolver o drilling com Context dando um valor novo a cada renderização: todos os consumidores re-renderizam sem necessidade (veja L82).",
    ],
    autoteste: [
      {
        pergunta: "Qual é o problema do prop drilling e quando ele não é um problema?",
        resposta:
          "Componentes intermediários recebem e repassam props que não usam, o que gera acoplamento e mudanças em cascata. Com um ou dois níveis, o custo é pequeno e o fluxo explícito é até uma vantagem.",
      },
      {
        pergunta: "Como a composição elimina o drilling sem usar Context?",
        resposta:
          "O componente que tem o dado monta o filho profundo e o entrega pronto (`children` ou prop de slot) ao intermediário, que apenas o posiciona. O dado deixa de passar por quem não o usa.",
      },
    ],
  },
  en: {
    titulo: "What prop drilling is",
    pergunta: "What is prop drilling?",
    porqueEsteMetodo:
      "Prop drilling is a path problem: the data has to travel far. An everyday analogy shows the annoyance before the technical terms, and then come the ways out and the point where the picture stops holding.",
    resposta30s:
      "**Prop drilling** is passing props through several intermediate components that **do not use them**, just so a deep descendant can receive them. It costs coupling, hard maintenance and cascading changes, but one or two levels are no problem. The ways out, from simplest to heaviest, are **composition with `children`**, **moving or lifting the state**, **Context** and **state libraries**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a ten-floor building and a message for someone who works on the top floor. Instead of going straight there, the message has to pass from office to office, floor by floor: each person along the way receives the paper, has nothing to do with it and just hands it to the next one. If the message changes format, everyone on the route has to be told.",
        tecnico:
          "In React, the data lives in a high component and is consumed by a deep descendant. Since props only flow from parent to child, every intermediate component receives the prop and passes it on, even without using it. The result: the intermediates gain a prop that is not theirs (**coupling**), renaming or adding a piece of data means editing every link (**cascading changes**), the components get harder to reuse and to understand, and the list of props only grows.",
        limite:
          "The analogy makes passing things along sound always bad, but **explicit props are a strength of React**: the data flow is visible and easy to follow. One or two levels need no remedy. The pain starts when the path is long, several links do not even know the data and the signatures only get fatter.",
      },
      {
        tipo: "tabela",
        titulo: "The ways out and when each pays off",
        colunas: ["Way out", "How it works", "When it pays off", "Cost"],
        linhas: [
          [
            "Accept the drilling",
            "Keep passing props",
            "One or two levels, data that rarely changes",
            "None while the path is short: the flow stays explicit",
          ],
          [
            "Composition (`children` and slots)",
            "The high component builds the deep child and hands it down ready-made as `children` or a prop (slot); the intermediates just place it",
            "Intermediates that only arrange layout",
            "You have to rethink the tree, and the high component grows",
          ],
          [
            "Move or lift the state",
            "Move the state close to its users, or lift it to the nearest common ancestor",
            "The state sits higher than it needs to",
            "May require reorganizing components",
          ],
          [
            "Context",
            "A provider hands the value to any descendant through `useContext`",
            "Data read in many places that rarely changes (theme, user, language)",
            "Every consumer re-renders when the value changes (see L82)",
          ],
          [
            "State library",
            "An external store read through selectors in any component",
            "Shared state that is updated often or is complex",
            "An extra dependency and new conventions (see L83 and L84)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "From drilling to composition",
        legenda: "JSX",
        codigo: [
          "// Drilling: Layout and Header only pass `user` along",
          "function App({ user }) {",
          "  return <Layout user={user} />;",
          "}",
          "function Layout({ user }) {",
          "  return <Header user={user} />;",
          "}",
          "function Header({ user }) {",
          "  return <Avatar name={user.name} />;",
          "}",
          "",
          "// Composition: whoever has the data builds the Avatar and hands it down ready",
          "function ComposedApp({ user }) {",
          "  return <SlotLayout header={<Avatar name={user.name} />} />;",
          "}",
          "function SlotLayout({ header }) {",
          "  return <header>{header}</header>; // does not even know `user` exists",
          "}",
        ].join("\n"),
        nota: "In the first snippet, `Layout` and `Header` carry a prop they do not use. In the second, `ComposedApp` builds the `Avatar` and `SlotLayout` only places it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Practical rule",
        texto:
          "Start by **accepting** the drilling and by **composition**. If the data sits too high, **move or lift** the state. Only then use **Context** for scattered reads that rarely change and, last, a **state library** for wide, dynamic state. Context is not the first remedy: it trades the annoyance of passing for another one, the re-renders of every consumer.",
      },
    ],
    armadilhas: [
      "Using Context for any prop that passes through two levels: it swaps a small, explicit cost for another that is implicit and wider.",
      "Calling any passing of props prop drilling: the problem is passing along without using, over a long path.",
      "Forgetting composition: often passing the ready-made element as `children` or a slot makes the drilling disappear, with no Context.",
      "Fixing the drilling with a Context that gets a new value on every render: all consumers re-render needlessly (see L82).",
    ],
    autoteste: [
      {
        pergunta: "What is the problem with prop drilling, and when is it not a problem?",
        resposta:
          "Intermediate components receive and pass along props they do not use, which creates coupling and cascading changes. With one or two levels the cost is small and the explicit flow is even an advantage.",
      },
      {
        pergunta: "How does composition remove drilling without using Context?",
        resposta:
          "The component that has the data builds the deep child and hands it ready-made (`children` or a slot prop) to the intermediate, which only places it. The data no longer passes through those who do not use it.",
      },
    ],
  },
};
