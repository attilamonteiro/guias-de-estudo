import type { Pergunta } from "../../tipos";

// S06 · Vantagens do ReactJS
export const s006: Pergunta = {
  numero: 606,
  modulo: "simplilearn-basico",
  metodo: "whys",
  pt: {
    titulo: "Vantagens do ReactJS",
    pergunta: "Quais são as vantagens do ReactJS?",
    porqueEsteMetodo:
      "Listar vantagens é fácil; a entrevista quer saber por que elas existem e quanto custam. Uma cadeia de “por quês” liga cada vantagem à sua origem e ao preço que vem junto.",
    resposta30s:
      "O React compensa porque troca a manipulação manual do DOM por **componentes reutilizáveis e declarativos** e por **dados que fluem em um só sentido**, o que deixa interfaces grandes previsíveis e fáceis de testar. O **Virtual DOM e a reconciliação** tornam esse modelo viável sem custo alto, e o **ecossistema e a comunidade** facilitam achar soluções e contratar. O preço é a curva de JSX e hooks, as escolhas de arquitetura que o React não impõe (roteamento, estado, build) e, em renderização só no cliente, a carga inicial e o SEO.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o React facilita interfaces que crescem?",
            resposta:
              "Porque troca a manipulação manual do DOM por um modelo **declarativo e em componentes**. Em vez de mandar, passo a passo, o que alterar (`querySelector`, `textContent`, `hidden`, `disabled`), você descreve como a tela deve ficar para um dado estado e o React calcula a mudança. Um componente junta marcação, comportamento e estado e é reutilizado com props diferentes. No JavaScript puro, cada ponto da tela que depende do mesmo dado é mais um lugar para lembrar de atualizar.",
          },
          {
            pergunta: "Por que o fluxo de dados em um só sentido deixa o código previsível?",
            resposta:
              "Porque os dados descem por props e os eventos sobem por funções: de onde veio cada valor e quem pode alterá-lo são perguntas com resposta no código, e a tela é sempre função do estado. Isso ajuda a depurar e a testar (mesmas props e mesmo estado, mesma saída). O preço: dado compartilhado por componentes distantes exige elevar o estado, repassar props (prop drilling) ou adotar Context ou uma biblioteca de estado.",
          },
          {
            pergunta: "Por que descrever a tela inteira a cada mudança não deixa tudo lento?",
            resposta:
              "Porque o React compara a descrição nova com a anterior (reconciliação, usando o Virtual DOM como a árvore de elementos em memória) e aplica ao DOM só a diferença. O ganho principal é **tornar o modelo declarativo viável**, e não vencer o DOM: um código manual bem otimizado pode ser mais rápido. O preço: renderizações desnecessárias que você aprende a medir e evitar (veja L21 e L23).",
          },
          {
            pergunta: "Por que tantas equipes escolhem e mantêm o React?",
            resposta:
              "Porque o ecossistema e a comunidade reduzem risco: bibliotecas, componentes prontos, material de estudo, ferramentas de teste e muita gente que já conhece o React, o que facilita contratar e integrar pessoas. O mesmo modelo de componentes e hooks vale para a web, o móvel (React Native) e o servidor. O preço: um ecossistema grande e em mudança gera fadiga de escolha, e bibliotecas de terceiros envelhecem ou perdem manutenção.",
          },
          {
            pergunta: "Então o que se paga ao adotá-lo?",
            resposta:
              "O React é uma **biblioteca**, não um framework (veja L3): não impõe roteamento, busca de dados, estado global nem build, então a arquitetura é decisão sua ou de um framework como o Next.js. Há curva de aprendizado em JSX, em hooks (regras, dependências dos efeitos, closures) e em pensar em renderização. E num app renderizado só no cliente o navegador baixa e executa JavaScript antes de mostrar o conteúdo, o que pesa na carga inicial e no SEO, a menos que haja renderização no servidor ou pré-renderização.",
          },
        ],
        causaRaiz:
          "Vantagens e custos nascem de uma única troca: **controle manual do DOM por um modelo declarativo, em componentes e com dados em um sentido**. Você ganha previsibilidade, reuso e ecossistema, e paga em abstração para aprender e em decisões de arquitetura que a biblioteca deixa para você.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo comportamento, nos dois estilos",
        legenda: "JavaScript e JSX",
        codigo: `// JavaScript puro: cada mudança manda atualizar cada ponto da tela
let itens = 0;
function adicionar() {
  itens += 1;
  document.querySelector("#total").textContent = itens;
  document.querySelector("#frete").hidden = itens < 3;
  document.querySelector("#botao").disabled = itens >= 5;
}

// React: a tela é calculada a partir do estado
function Carrinho() {
  const [itens, setItens] = useState(0);
  return (
    <>
      <p>{itens}</p>
      {itens >= 3 && <p>Frete grátis!</p>}
      <button disabled={itens >= 5} onClick={() => setItens(itens + 1)}>
        Adicionar
      </button>
    </>
  );
}`,
        nota: "Num contador isolado o JavaScript puro é mais curto. O React compensa quando muitos pontos da tela dependem dos mesmos dados.",
      },
      {
        tipo: "tabela",
        titulo: "Cada vantagem e o seu preço",
        colunas: ["Vantagem", "Por que existe", "O preço", "Pesa mais quando"],
        linhas: [
          [
            "Componentes reutilizáveis e declarativos",
            "A interface é função do estado, e cada componente encapsula marcação, comportamento e estado",
            "Aprender JSX e hooks (regras, dependências, closures) e pensar em renderização",
            "A equipe é nova no React e não há revisão de código",
          ],
          [
            "Fluxo de dados em um só sentido",
            "Props descem e eventos sobem, então a origem de cada valor é rastreável",
            "Prop drilling, elevação de estado e a escolha entre Context e uma biblioteca de estado",
            "Árvores profundas com estado compartilhado",
          ],
          [
            "Virtual DOM e reconciliação",
            "O React compara a árvore nova com a anterior e aplica só a diferença",
            "Não é mais rápido que um DOM bem manipulado à mão, e renderizações desnecessárias pedem medição",
            "Listas grandes e telas que atualizam com frequência",
          ],
          [
            "Ecossistema, comunidade e contratação",
            "Muitas bibliotecas, materiais e pessoas que já conhecem o React",
            "Fadiga de escolha e dependências de terceiros que envelhecem",
            "Projetos longos, em que uma biblioteca abandonada custa caro",
          ],
          [
            "Biblioteca, não framework",
            "Flexibilidade para escolher roteador, dados e estilos",
            "Você decide e mantém a arquitetura, ou adota um framework como o Next.js",
            "Times sem convenções definidas",
          ],
          [
            "Renderização no cliente",
            "Aplicativos fluidos e interativos depois de carregados",
            "JavaScript baixado e executado antes do conteúdo; SEO e indexação dependem de renderização no servidor ou pré-renderização",
            "Sites de conteúdo, redes lentas e páginas de entrada",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O Virtual DOM não é “sempre mais rápido”",
        texto:
          "Dizer que o React é rápido por causa do Virtual DOM é a resposta que a entrevista costuma derrubar. Mexer no DOM direto, com cuidado, pode ser mais rápido; o que o React compra é poder escrever a interface de forma declarativa sem pagar um custo proibitivo, e um app mal escrito em React também fica lento. O desempenho vem de medir e de boas práticas (chaves estáveis, estado no lugar certo, divisão de código). Recursos novos, como o React Compiler, mudam o que se faz à mão: confira react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando compensa",
        texto:
          "O React compensa quando a interface tem **muito estado compartilhado, telas que mudam em resposta a dados e vida longa** (equipe, componentes reutilizados, testes). Não compensa para uma página estática ou um widget pequeno, em que JavaScript puro ou HTML gerado no servidor sai mais barato. Se adotar, resolva cedo as decisões que o React deixa em aberto (roteamento, dados, estado e renderização no servidor), em geral com um framework.",
      },
    ],
    armadilhas: [
      "Responder só com vantagens: a entrevista quer o trade-off, e cada vantagem tem um custo correspondente.",
      "Dizer que o Virtual DOM torna o React mais rápido que o DOM puro: ele permite o estilo declarativo com custo aceitável, e só.",
      "Chamar o React de framework completo: ele cuida da interface, e roteamento, dados e build vêm de outras peças (veja L3).",
      "Recomendar o React para qualquer página: para conteúdo estático ou um widget pequeno, o custo de ferramentas e de JavaScript não se paga.",
    ],
    autoteste: [
      {
        pergunta: "Por que o React é mais produtivo que o JavaScript puro numa interface grande?",
        resposta:
          "Porque a tela é função do estado: o modelo declarativo, os componentes reutilizáveis e o fluxo de dados em um sentido deixam o comportamento previsível. No JavaScript puro, cada ponto da tela que depende de um dado exige atualização manual, e é aí que nascem as telas dessincronizadas.",
      },
      {
        pergunta: "Cite dois custos reais de adotar o React e como reduzi-los.",
        resposta:
          "Decisões de arquitetura (roteamento, dados, estado): adote um framework ou defina convenções cedo. Carga inicial e SEO num app só de cliente: use renderização no servidor ou pré-renderização e divida o código.",
      },
    ],
  },
  en: {
    titulo: "ReactJS advantages",
    pergunta: "What are the advantages of ReactJS?",
    porqueEsteMetodo:
      "Listing advantages is easy; an interview wants to know why they exist and what they cost. A chain of whys ties each advantage to its origin and to the price that comes with it.",
    resposta30s:
      "React pays off because it replaces manual DOM manipulation with **reusable, declarative components** and **data flowing one way**, which keeps large interfaces predictable and easy to test. The **Virtual DOM and reconciliation** make that model viable at a reasonable cost, and the **ecosystem and community** make it easy to find solutions and to hire. The price is the learning curve of JSX and hooks, the architecture choices React does not impose (routing, state, build) and, with client-only rendering, initial load and SEO.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does React make growing interfaces easier?",
            resposta:
              "Because it replaces manual DOM manipulation with a **declarative, component-based** model. Instead of ordering, step by step, what to change (`querySelector`, `textContent`, `hidden`, `disabled`), you describe how the screen should look for a given state and React works out the change. A component bundles markup, behavior and state and is reused with different props. In plain JavaScript, every spot on the screen that depends on the same data is one more place to remember to update.",
          },
          {
            pergunta: "Why does one-way data flow make code predictable?",
            resposta:
              "Because data goes down through props and events go up through functions: where each value came from and who can change it are questions the code answers, and the screen is always a function of state. That helps debugging and testing (same props and state, same output). The price: data shared by distant components requires lifting state, passing props down (prop drilling) or adopting Context or a state library.",
          },
          {
            pergunta: "Why does describing the whole screen on every change not make everything slow?",
            resposta:
              "Because React compares the new description with the previous one (reconciliation, using the Virtual DOM as the in-memory tree of elements) and applies only the difference to the DOM. The main gain is **making the declarative model viable**, not beating the DOM: carefully optimized manual code can be faster. The price: unnecessary renders that you learn to measure and avoid (see L21 and L23).",
          },
          {
            pergunta: "Why do so many teams choose and keep React?",
            resposta:
              "Because the ecosystem and community reduce risk: libraries, ready-made components, learning material, testing tools and plenty of people who already know React, which makes hiring and onboarding easier. The same model of components and hooks serves the web, mobile (React Native) and the server. The price: a large, changing ecosystem causes choice fatigue, and third-party libraries age or lose maintenance.",
          },
          {
            pergunta: "So what do you pay for adopting it?",
            resposta:
              "React is a **library**, not a framework (see L3): it does not impose routing, data fetching, global state or a build, so the architecture is your decision or that of a framework such as Next.js. There is a learning curve in JSX, in hooks (rules, effect dependencies, closures) and in thinking about rendering. And in a client-only app the browser downloads and runs JavaScript before showing content, which weighs on initial load and SEO unless there is server rendering or pre-rendering.",
          },
        ],
        causaRaiz:
          "Advantages and costs come from a single trade: **manual DOM control for a declarative model, with components and one-way data**. You gain predictability, reuse and an ecosystem, and you pay in abstraction to learn and in architecture decisions the library leaves to you.",
      },
      {
        tipo: "codigo",
        titulo: "The same behavior, in both styles",
        legenda: "JavaScript and JSX",
        codigo: `// Plain JavaScript: every change must update every spot on the screen
let items = 0;
function add() {
  items += 1;
  document.querySelector("#total").textContent = items;
  document.querySelector("#shipping").hidden = items < 3;
  document.querySelector("#button").disabled = items >= 5;
}

// React: the screen is computed from state
function Cart() {
  const [items, setItems] = useState(0);
  return (
    <>
      <p>{items}</p>
      {items >= 3 && <p>Free shipping!</p>}
      <button disabled={items >= 5} onClick={() => setItems(items + 1)}>
        Add
      </button>
    </>
  );
}`,
        nota: "In an isolated counter, plain JavaScript is shorter. React pays off when many spots on the screen depend on the same data.",
      },
      {
        tipo: "tabela",
        titulo: "Each advantage and its price",
        colunas: ["Advantage", "Why it exists", "The price", "Weighs most when"],
        linhas: [
          [
            "Reusable, declarative components",
            "The interface is a function of state, and each component encapsulates markup, behavior and state",
            "Learning JSX and hooks (rules, dependencies, closures) and thinking about rendering",
            "The team is new to React and there is no code review",
          ],
          [
            "One-way data flow",
            "Props go down and events go up, so the origin of each value is traceable",
            "Prop drilling, lifting state and choosing between Context and a state library",
            "Deep trees with shared state",
          ],
          [
            "Virtual DOM and reconciliation",
            "React compares the new tree with the previous one and applies only the difference",
            "Not faster than a well-handled hand-written DOM, and unnecessary renders call for measuring",
            "Large lists and screens that update often",
          ],
          [
            "Ecosystem, community and hiring",
            "Many libraries, learning material and people who already know React",
            "Choice fatigue and third-party dependencies that age",
            "Long projects, where an abandoned library is expensive",
          ],
          [
            "A library, not a framework",
            "Freedom to pick the router, data layer and styling",
            "You decide and maintain the architecture, or adopt a framework such as Next.js",
            "Teams without defined conventions",
          ],
          [
            "Client-side rendering",
            "Fluid, interactive apps once loaded",
            "JavaScript is downloaded and run before the content; SEO and indexing depend on server rendering or pre-rendering",
            "Content sites, slow networks and entry pages",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The Virtual DOM is not “always faster”",
        texto:
          "Saying React is fast because of the Virtual DOM is the answer interviews tend to knock down. Touching the DOM directly, with care, can be faster; what React buys is being able to write the interface declaratively without paying a prohibitive cost, and a badly written React app also gets slow. Performance comes from measuring and good practices (stable keys, state in the right place, code splitting). New features, such as the React Compiler, change what you do by hand: check react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When it pays off",
        texto:
          "React pays off when the interface has **a lot of shared state, screens that change in response to data and a long life** (team, reused components, tests). It does not pay off for a static page or a small widget, where plain JavaScript or server-generated HTML is cheaper. If you adopt it, settle early the decisions React leaves open (routing, data, state and server rendering), usually with a framework.",
      },
    ],
    armadilhas: [
      "Answering with advantages only: the interview wants the trade-off, and each advantage has a matching cost.",
      "Saying the Virtual DOM makes React faster than the plain DOM: it allows the declarative style at an acceptable cost, and that is all.",
      "Calling React a full framework: it handles the interface, and routing, data and build come from other pieces (see L3).",
      "Recommending React for any page: for static content or a small widget, the cost of tooling and JavaScript does not pay off.",
    ],
    autoteste: [
      {
        pergunta: "Why is React more productive than plain JavaScript in a large interface?",
        resposta:
          "Because the screen is a function of state: the declarative model, reusable components and one-way data flow keep behavior predictable. In plain JavaScript, every spot on the screen that depends on a piece of data needs a manual update, and that is where out-of-sync screens are born.",
      },
      {
        pergunta: "Name two real costs of adopting React and how to reduce them.",
        resposta:
          "Architecture decisions (routing, data, state): adopt a framework or set conventions early. Initial load and SEO in a client-only app: use server rendering or pre-rendering and split the code.",
      },
    ],
  },
};
