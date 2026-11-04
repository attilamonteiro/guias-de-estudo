import type { Pergunta } from "../../tipos";

// L19 · Composição de componentes
export const l019: Pergunta = {
  numero: 19,
  modulo: "linkedin-fundamentos",
  metodo: "design",
  pt: {
    titulo: "Composição de componentes",
    pergunta: "O que é composição de componentes?",
    porqueEsteMetodo:
      "Composição é mais fácil de entender projetando: pegar um componente reutilizável (Card, Modal, Layout), partir do que varia e escolher a ferramenta certa para cada variação. Um roteiro de projeto de API evita tanto o esquecimento quanto o excesso de props.",
    resposta30s:
      "**Composição** é montar componentes maiores **combinando** menores: o pai decide o que vai dentro por `children`, por **props que recebem elementos ou funções** (slots, render props) e por componentes especializados que renderizam um genérico com props fixas. O React prefere composição à **herança** porque props aceitam qualquer coisa e a árvore continua previsível. Projetar uma API reutilizável (Card, Modal, Layout) começa pelo que **varia** e evita inflar o componente com props booleanas.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado a um Card reutilizável",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Um `Card` usado em dezenas de telas: título, conteúdo livre, ações opcionais e poucas variantes de aparência. Precisa funcionar com teclado e leitor de tela, e a equipe deve montar casos novos sem alterar o componente.",
          },
          {
            titulo: "2. O que varia",
            texto:
              "Liste as variações: o **conteúdo** (muda sempre), o **comportamento** (o que acontece no clique) e a **aparência** (poucas opções). Cada tipo de variação pede uma ferramenta diferente, e é daí que sai a API.",
          },
          {
            titulo: "3. Decisão central: composição",
            texto:
              "Em vez de herança (`CardComBotao` estendendo `Card`) ou de uma prop para cada caso, o componente define a moldura e deixa **buracos** que quem usa preenche com elementos. A equipe do React recomenda composição em vez de herança: props e `children` aceitam qualquer coisa, e especializar é só renderizar o genérico com props específicas.",
          },
          {
            titulo: "4. O contrato do componente",
            texto:
              "`titulo` (texto), `acoes` (um slot que recebe um elemento), `children` (o corpo) e no máximo uma prop `variante` com valores fechados. Em componentes de uso geral, repasse também `className` e os demais atributos ao elemento raiz.",
          },
          {
            titulo: "5. Partes que cooperam",
            texto:
              "Se o componente tem partes que dependem uma da outra (abas, menu, acordeão), use **compound components**: um pai guarda o state e o compartilha por Context com partes nomeadas, e quem usa decide a ordem e o que vai entre elas.",
          },
          {
            titulo: "6. Evolução",
            texto:
              "Antes de aceitar mais uma prop, pergunte se o caso se resolve passando um elemento. Teste pelo uso: se cada tela monta o que precisa sem mexer em `Card`, a API está certa. Passar elementos prontos também evita prop drilling: o pai cria o `<Avatar />` lá em cima e o componente do meio só renderiza o que recebeu.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "As formas de compor",
        colunas: ["Técnica", "Como se escreve", "Quando usar", "Cuidado"],
        linhas: [
          [
            "`children`",
            "`<Card>conteúdo</Card>`",
            "Moldura simples com um espaço livre: Card, Modal, Layout",
            "Só há um “buraco”",
          ],
          [
            "Props que recebem elementos (slots)",
            "`<Layout topo={<Topo />} lateral={<Menu />}>`",
            "Vários espaços nomeados",
            "Nada garante que o elemento certo foi passado; tipos ajudam",
          ],
          [
            "Render props",
            "`<Lista itens={x} renderItem={(i) => <Linha item={i} />}>`",
            "O componente tem dados que quem usa precisa para decidir o desenho",
            "JSX aninhado; muitos casos hoje cabem num Hook",
          ],
          [
            "Compound components",
            "`<Abas><Abas.Aba /><Abas.Painel /></Abas>` com Context interno",
            "Partes que cooperam e dividem state sem o usuário perceber",
            "Mais código no autor; quebra se as partes forem usadas fora do pai",
          ],
          [
            "Especialização",
            '`BotaoDeExcluir` renderiza `<Botao variante="perigo" />`',
            "Casos específicos de um componente genérico",
            "Componha em vez de criar hierarquia de herança",
          ],
          [
            "Juntar vários componentes em um",
            "Um componente que renderiza os outros dentro de um Fragment (`<>...</>`) ou de um elemento",
            "Montar uma seção a partir de partes, como `<Cabecalho />`, `<Lista />` e `<Rodape />`",
            "O JSX devolve uma só raiz; o Fragment evita um `div` extra",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Children e slot no mesmo Card",
        legenda: "JSX",
        codigo: `function Card({ titulo, acoes, children }) {
  return (
    <section className="card">
      <header>
        <h2>{titulo}</h2>
        {acoes}
      </header>
      <div className="corpo">{children}</div>
    </section>
  );
}

export default function Pedido({ itens }) {
  return (
    <Card titulo="Pedido 42" acoes={<button>Editar</button>}>
      <ListaDeItens itens={itens} />
    </Card>
  );
}`,
        nota: "Quem usa decide o conteúdo e as ações sem pedir uma prop nova ao `Card`. `ListaDeItens` é um componente qualquer, suposto existente.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Variação de **conteúdo**: `children` ou slots. Variação de **comportamento que depende de dados internos**: render prop (ou um Hook). Variação de **aparência**: poucas props com valores fechados. **Partes que cooperam**: compound components. E trate o excesso de props como sintoma: se o mesmo componente acumula várias props booleanas, ele está virando um interruptor gigante; quebre em componentes ou aceite elementos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A armadilha das props booleanas e da herança",
        texto:
          "`<Botao primario grande desativado comIcone arredondado />` parece flexível, mas admite combinações impossíveis (`primario` e `perigo` ao mesmo tempo), é difícil de testar e só cresce. Prefira uma prop `variante` com valores fechados, componentes especializados e o ícone como elemento. Quanto à herança de componentes, a equipe do React não recomenda: a lógica compartilhada vai para custom Hooks e a variação de interface vai para props e `children`.",
      },
    ],
    armadilhas: [
      "Adicionar uma prop booleana para cada caso novo (`comIcone`, `grande`, `semBorda`): as combinações explodem e o componente vira um interruptor gigante.",
      "Usar herança de componentes (`extends`) para reaproveitar visual ou lógica, em vez de composição e custom Hooks.",
      "Criar um slot, uma render prop ou um compound component onde `children` bastava: complexidade sem ganho.",
      "Passar dados por vários níveis só para chegar ao componente de baixo, quando bastaria criar o elemento no topo e passá-lo pronto por `children` ou por prop.",
    ],
    autoteste: [
      {
        pergunta: "Por que o React recomenda composição em vez de herança?",
        resposta:
          "Porque props e `children` já permitem personalizar conteúdo, comportamento e aparência de qualquer componente sem hierarquias de classes, e a lógica reaproveitável vai para custom Hooks. A herança acopla o filho ao pai e dificulta mudanças.",
      },
      {
        pergunta: "Como a composição ajuda a evitar prop drilling?",
        resposta:
          "Criando o elemento no componente que tem os dados e passando-o pronto por `children` ou por prop. Os componentes do meio só o renderizam, sem conhecer nem repassar os dados.",
      },
    ],
  },
  en: {
    titulo: "Component composition",
    pergunta: "What is component composition?",
    porqueEsteMetodo:
      "Composition is easier to grasp by designing: take a reusable component (Card, Modal, Layout), start from what varies and pick the right tool for each variation. A roadmap for API design avoids both forgetting things and prop overload.",
    resposta30s:
      "**Composition** means building bigger components by **combining** smaller ones: the parent decides what goes inside through `children`, through **props that receive elements or functions** (slots, render props) and through specialized components that render a generic one with fixed props. React prefers composition over **inheritance** because props accept anything and the tree stays predictable. Designing a reusable API (Card, Modal, Layout) starts from what **varies** and avoids bloating the component with boolean props.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The roadmap applied to a reusable Card",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "A `Card` used on dozens of screens: title, free-form content, optional actions and a few visual variants. It must work with keyboard and screen reader, and the team should build new cases without changing the component.",
          },
          {
            titulo: "2. What varies",
            texto:
              "List the variations: the **content** (always changes), the **behavior** (what happens on click) and the **appearance** (a few options). Each kind of variation calls for a different tool, and the API comes out of that.",
          },
          {
            titulo: "3. Central decision: composition",
            texto:
              "Instead of inheritance (`CardWithButton` extending `Card`) or a prop for every case, the component defines the frame and leaves **holes** that the user fills with elements. The React team recommends composition over inheritance: props and `children` accept anything, and specializing is just rendering the generic one with specific props.",
          },
          {
            titulo: "4. The component’s contract",
            texto:
              "`title` (text), `actions` (a slot that receives an element), `children` (the body) and at most one `variant` prop with closed values. In general-purpose components, also forward `className` and the other attributes to the root element.",
          },
          {
            titulo: "5. Parts that cooperate",
            texto:
              "If the component has parts that depend on each other (tabs, menu, accordion), use **compound components**: a parent holds the state and shares it through Context with named parts, and whoever uses it decides the order and what goes between them.",
          },
          {
            titulo: "6. Evolution",
            texto:
              "Before accepting one more prop, ask whether the case can be solved by passing an element. Test by usage: if each screen builds what it needs without touching `Card`, the API is right. Passing ready-made elements also avoids prop drilling: the parent creates the `<Avatar />` up top and the component in the middle just renders what it received.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "The ways to compose",
        colunas: ["Technique", "How it is written", "When to use", "Watch out"],
        linhas: [
          [
            "`children`",
            "`<Card>content</Card>`",
            "A simple frame with one free space: Card, Modal, Layout",
            "There is only one “hole”",
          ],
          [
            "Props that receive elements (slots)",
            "`<Layout top={<Top />} side={<Menu />}>`",
            "Several named spaces",
            "Nothing guarantees the right element was passed; types help",
          ],
          [
            "Render props",
            "`<List items={x} renderItem={(i) => <Row item={i} />}>`",
            "The component holds data that the user needs to decide the output",
            "Nested JSX; many cases now fit in a Hook",
          ],
          [
            "Compound components",
            "`<Tabs><Tabs.Tab /><Tabs.Panel /></Tabs>` with internal Context",
            "Parts that cooperate and share state without the user noticing",
            "More code for the author; breaks if the parts are used outside the parent",
          ],
          [
            "Specialization",
            '`DeleteButton` renders `<Button variant="danger" />`',
            "Specific cases of a generic component",
            "Compose instead of building an inheritance hierarchy",
          ],
          [
            "Joining several components into one",
            "A component that renders the others inside a Fragment (`<>...</>`) or an element",
            "Building a section from parts, such as `<Header />`, `<List />` and `<Footer />`",
            "JSX returns a single root; the Fragment avoids an extra `div`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Children and a slot in the same Card",
        legenda: "JSX",
        codigo: `function Card({ title, actions, children }) {
  return (
    <section className="card">
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div className="body">{children}</div>
    </section>
  );
}

export default function Order({ items }) {
  return (
    <Card title="Order 42" actions={<button>Edit</button>}>
      <ItemList items={items} />
    </Card>
  );
}`,
        nota: "Whoever uses it decides the content and the actions without asking `Card` for a new prop. `ItemList` is any component, assumed to exist.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Variation in **content**: `children` or slots. Variation in **behavior that depends on internal data**: a render prop (or a Hook). Variation in **appearance**: a few props with closed values. **Parts that cooperate**: compound components. And treat too many props as a symptom: if the same component piles up several boolean props, it is turning into a giant switch; split it into components or accept elements.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The trap of boolean props and inheritance",
        texto:
          "`<Button primary large disabled withIcon rounded />` looks flexible, but it allows impossible combinations (`primary` and `danger` at once), is hard to test and only grows. Prefer a `variant` prop with closed values, specialized components and the icon as an element. As for component inheritance, the React team does not recommend it: shared logic goes into custom Hooks and interface variation goes into props and `children`.",
      },
    ],
    armadilhas: [
      "Adding a boolean prop for every new case (`withIcon`, `large`, `borderless`): combinations explode and the component becomes a giant switch.",
      "Using component inheritance (`extends`) to reuse visuals or logic, instead of composition and custom Hooks.",
      "Creating a slot, a render prop or a compound component where `children` was enough: complexity with no gain.",
      "Passing data through several levels just to reach the component below, when it would be enough to create the element at the top and pass it ready-made through `children` or a prop.",
    ],
    autoteste: [
      {
        pergunta: "Why does React recommend composition over inheritance?",
        resposta:
          "Because props and `children` already let you customize the content, behavior and appearance of any component without class hierarchies, and reusable logic goes into custom Hooks. Inheritance couples the child to the parent and makes change harder.",
      },
      {
        pergunta: "How does composition help avoid prop drilling?",
        resposta:
          "By creating the element in the component that owns the data and passing it ready-made through `children` or a prop. The components in the middle only render it, without knowing or forwarding the data.",
      },
    ],
  },
};
