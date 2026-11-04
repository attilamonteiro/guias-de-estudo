import type { Pergunta } from "../../tipos";

// P04 · Elemento versus componente
export const p004: Pergunta = {
  numero: 404,
  modulo: "pedrincandido-core",
  metodo: "feynman",
  pt: {
    titulo: "Elemento versus componente",
    pergunta: "Qual a diferença entre um Elemento e um Component?",
    porqueEsteMetodo:
      "A confusão vem de dois objetos que, no JSX, parecem a mesma coisa. Uma analogia separa o que descreve do que gera descrições; depois vêm o mecanismo real (`createElement`, a árvore, a chamada do componente) e o ponto em que a imagem para de valer.",
    resposta30s:
      "Um **elemento** é um objeto simples e imutável que **descreve** o que aparece na tela (`type`, `props`, `key`), criado por JSX ou por `React.createElement`. Um **componente** é uma **função (ou classe)** que recebe props e **devolve elementos**; `<Saudacao />` é um elemento cujo `type` é o componente, e o React o chama durante a renderização. Em resumo: o elemento é a planta, o componente é quem gera plantas, e o DOM é a casa construída a partir delas.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa casa. A **planta** é um papel que descreve a casa: quantos quartos, onde fica cada janela. A planta não é a casa, ninguém mora nela e, para mudar algo, você não risca a antiga: desenha outra. A **construtora** é quem, a partir de um pedido (as informações do cliente), produz plantas; pedidos diferentes geram plantas diferentes. Quem levanta as paredes é a equipe de obra, o React, que compara a planta nova com a anterior e só mexe no que mudou.",
        tecnico:
          "Um **elemento** é um objeto JavaScript simples e imutável, criado por JSX ou por `React.createElement`, que descreve o que deve aparecer: um `type` (`'button'`, `'div'` ou um componente), `props` (incluindo `children`) e `key`, além de campos internos. Não é um nó do DOM e não tem métodos. Um **componente** é uma função (ou classe) que recebe props e devolve elementos. `<Saudacao nome=\"Ana\" />` é um elemento cujo `type` é o componente: durante a renderização, o React chama `Saudacao({ nome: 'Ana' })`, recebe outros elementos e repete o processo até só restarem tipos de DOM; então compara essa árvore com a anterior e atualiza o DOM.",
        limite:
          "A analogia falha em três pontos. A planta é barata e descartável: o React cria elementos novos a cada render. O estado (`useState`) não fica na planta nem na função da construtora, e sim com a equipe de obra: o React o guarda, preso à posição do componente na árvore. E a mesma planta pode erguer várias casas: o mesmo elemento renderizado em dois lugares gera duas instâncias com estados independentes.",
      },
      {
        tipo: "codigo",
        titulo: "O elemento é o objeto; o componente é a função",
        legenda: "JSX",
        codigo: [
          "function Saudacao({ nome }) {",
          '  return <h1 className="titulo">Olá, {nome}</h1>;',
          "}",
          "",
          '// o mesmo que React.createElement(Saudacao, { nome: "Ana" })',
          'const elemento = <Saudacao nome="Ana" />;',
          "console.log(elemento.type === Saudacao); // true: o tipo é o próprio componente",
          'console.log(elemento.props);             // { nome: "Ana" }',
          "",
          'const retorno = Saudacao({ nome: "Ana" }); // só para olhar: quem chama o componente é o React',
          'console.log(retorno.type);                 // "h1": um elemento de DOM',
          'console.log(retorno.props.children);       // ["Olá, ", "Ana"]',
        ].join("\n"),
        nota: "Nunca chame um componente como função no código real (`Saudacao(...)` no lugar de `<Saudacao />`): o React não o enxerga como componente, e os hooks passam a pertencer a quem chamou.",
      },
      {
        tipo: "tabela",
        titulo: "Elemento e componente lado a lado",
        colunas: ["Aspecto", "Elemento", "Componente"],
        linhas: [
          [
            "O que é",
            "Objeto simples e imutável que descreve um pedaço da tela: `type`, `props` (com `children`) e `key`",
            "Função (ou classe) que recebe props e devolve elementos",
          ],
          [
            "Como nasce",
            "Por JSX ou `React.createElement` (o compilador moderno usa o `jsx` do runtime automático, equivalente)",
            "Você o escreve, como uma função de nome em maiúscula (ou uma classe com `render`)",
          ],
          [
            "Quem executa",
            "Ninguém executa um elemento: o React o lê",
            "O React o chama durante a renderização, quantas vezes precisar",
          ],
          [
            "Onde fica o estado",
            "Em lugar nenhum: é um retrato descartado e recriado a cada render",
            "Com o React, preso à posição do componente na árvore (hooks ou `this.state`), e não dentro da função nem do elemento",
          ],
          ["Exemplo", '`<Saudacao nome="Ana" />` ou `<h1>Olá</h1>`', "`function Saudacao({ nome }) { ... }`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como os dois se encontram na árvore",
        texto:
          "`<App />` é um elemento cujo `type` é o componente `App`. O React chama `App(props)`, recebe outros elementos e repete o processo com os que têm componentes como `type`, até sobrarem só elementos de DOM (`'div'`, `'button'`). Essa **árvore de elementos** é o que ele compara com a anterior para atualizar o DOM (veja L22). A **instância** é outra coisa: o React mantém uma por posição na árvore (um objeto, no caso de classes; um espaço de estado preso à posição, no caso de funções), e o mesmo elemento renderizado em dois lugares gera duas instâncias com estados independentes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Componente” significa três coisas no dia a dia",
        texto:
          "Na conversa comum, “componente” pode designar a função, o elemento (`<Botao />`) ou a instância na tela. Em entrevista, separe: **componente** é a definição que você escreve; **elemento** é o objeto que descreve uma saída; **instância** é o componente montado, com estado. Renderizar é o React chamar componentes para obter elementos; só depois ele atualiza o DOM.",
      },
    ],
    armadilhas: [
      "Dizer que o elemento é o nó do DOM, ou “a instância do componente”: ele é só uma descrição; o nó do DOM e a instância vêm depois.",
      "Achar que `<Saudacao />` executa o componente na hora: só cria o elemento; quem executa a função é o React, na renderização (ou ninguém, se o elemento nunca for renderizado).",
      "Chamar o componente como função (`{Saudacao({ nome })}`) em vez de usar `<Saudacao />`: o React perde a identidade do componente na árvore, e os hooks de dentro passam a pertencer ao pai.",
      "Definir um componente dentro de outro: a cada render o `type` é uma função nova, e o React desmonta e remonta a subárvore, perdendo estado e foco. Defina os componentes no nível do módulo.",
    ],
    autoteste: [
      {
        pergunta: "O que `<Botao />` produz, e quem executa a função `Botao`?",
        resposta:
          "Produz um elemento, um objeto como `{ type: Botao, props: {} }`. Quem executa a função `Botao` é o React, durante a renderização, quando precisa dos elementos que ela devolve.",
      },
      {
        pergunta: "Por que o estado não fica no elemento nem na função do componente?",
        resposta:
          "Porque o elemento é uma descrição descartada e recriada a cada render, e a função roda de novo a cada render. O React guarda o estado, associado à posição do componente na árvore, e o devolve nas chamadas seguintes, enquanto o tipo e a posição forem os mesmos.",
      },
    ],
  },
  en: {
    titulo: "Element vs component",
    pergunta: "What is the difference between an Element and a Component?",
    porqueEsteMetodo:
      "The confusion comes from two things that look like the same thing in JSX. An analogy separates what describes from what produces descriptions; then come the real mechanism (`createElement`, the tree, the component call) and the point where the image stops holding.",
    resposta30s:
      "An **element** is a plain, immutable object that **describes** what appears on screen (`type`, `props`, `key`), created by JSX or `React.createElement`. A **component** is a **function (or class)** that takes props and **returns elements**; `<Greeting />` is an element whose `type` is the component, and React calls it during rendering. In short: the element is the blueprint, the component is what produces blueprints, and the DOM is the house built from them.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a house. The **blueprint** is a sheet of paper that describes the house: how many rooms, where each window goes. The blueprint is not the house, nobody lives in it and, to change something, you do not cross out the old one: you draw another. The **construction firm** is what, from an order (the client’s information), produces blueprints; different orders give different blueprints. The crew that raises the walls is React, which compares the new blueprint with the previous one and only touches what changed.",
        tecnico:
          "An **element** is a plain, immutable JavaScript object, created by JSX or `React.createElement`, that describes what should appear: a `type` (`'button'`, `'div'` or a component), `props` (including `children`) and `key`, plus internal fields. It is not a DOM node and has no methods. A **component** is a function (or class) that takes props and returns elements. `<Greeting name=\"Ann\" />` is an element whose `type` is the component: during rendering, React calls `Greeting({ name: 'Ann' })`, gets other elements back and repeats the process until only DOM types remain; then it compares that tree with the previous one and updates the DOM.",
        limite:
          "The analogy fails in three places. The blueprint is cheap and disposable: React creates new elements on every render. State (`useState`) lives neither in the blueprint nor in the firm’s function, but with the crew: React keeps it, tied to the component’s position in the tree. And the same blueprint can raise several houses: the same element rendered in two places yields two instances with independent state.",
      },
      {
        tipo: "codigo",
        titulo: "The element is the object; the component is the function",
        legenda: "JSX",
        codigo: [
          "function Greeting({ name }) {",
          '  return <h1 className="title">Hello, {name}</h1>;',
          "}",
          "",
          '// the same as React.createElement(Greeting, { name: "Ann" })',
          'const element = <Greeting name="Ann" />;',
          "console.log(element.type === Greeting); // true: the type is the component itself",
          'console.log(element.props);             // { name: "Ann" }',
          "",
          'const result = Greeting({ name: "Ann" }); // just to look: React is who calls the component',
          'console.log(result.type);                 // "h1": a DOM element',
          'console.log(result.props.children);       // ["Hello, ", "Ann"]',
        ].join("\n"),
        nota: "Never call a component as a function in real code (`Greeting(...)` instead of `<Greeting />`): React does not see it as a component, and the hooks inside end up belonging to the caller.",
      },
      {
        tipo: "tabela",
        titulo: "Element and component side by side",
        colunas: ["Aspect", "Element", "Component"],
        linhas: [
          [
            "What it is",
            "A plain, immutable object that describes a piece of the screen: `type`, `props` (with `children`) and `key`",
            "A function (or class) that takes props and returns elements",
          ],
          [
            "How it is born",
            "By JSX or `React.createElement` (the modern compiler uses the automatic runtime’s `jsx`, equivalent)",
            "You write it, as a function with a capitalized name (or a class with `render`)",
          ],
          [
            "Who runs it",
            "Nobody runs an element: React reads it",
            "React calls it during rendering, as many times as needed",
          ],
          [
            "Where state lives",
            "Nowhere: it is a snapshot, discarded and recreated on every render",
            "With React, tied to the component’s position in the tree (hooks or `this.state`), not inside the function or the element",
          ],
          ["Example", '`<Greeting name="Ann" />` or `<h1>Hello</h1>`', "`function Greeting({ name }) { ... }`"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How the two meet in the tree",
        texto:
          "`<App />` is an element whose `type` is the `App` component. React calls `App(props)`, gets other elements and repeats the process for those whose `type` is a component, until only DOM elements remain (`'div'`, `'button'`). That **element tree** is what it compares with the previous one to update the DOM (see L22). The **instance** is something else: React keeps one per position in the tree (an object for classes; a slot of state tied to the position for functions), and the same element rendered in two places yields two instances with independent state.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Component” means three things in everyday talk",
        texto:
          "In casual conversation, “component” can refer to the function, the element (`<Button />`) or the instance on screen. In an interview, keep them apart: **component** is the definition you write; **element** is the object that describes an output; **instance** is the mounted component, with state. Rendering is React calling components to get elements; only then does it update the DOM.",
      },
    ],
    armadilhas: [
      "Saying the element is the DOM node, or “the component’s instance”: it is only a description; the DOM node and the instance come later.",
      "Thinking `<Greeting />` runs the component right away: it only creates the element; React runs the function, during rendering (or nobody does, if the element is never rendered).",
      "Calling the component as a function (`{Greeting({ name })}`) instead of using `<Greeting />`: React loses the component’s identity in the tree, and the hooks inside end up belonging to the parent.",
      "Defining a component inside another: on every render the `type` is a new function, and React unmounts and remounts the subtree, losing state and focus. Define components at module level.",
    ],
    autoteste: [
      {
        pergunta: "What does `<Button />` produce, and who runs the `Button` function?",
        resposta:
          "It produces an element, an object like `{ type: Button, props: {} }`. React runs the `Button` function, during rendering, when it needs the elements it returns.",
      },
      {
        pergunta: "Why does state live neither in the element nor in the component function?",
        resposta:
          "Because the element is a description discarded and recreated on every render, and the function runs again on every render. React keeps the state, tied to the component’s position in the tree, and hands it back on later calls, as long as the type and position stay the same.",
      },
    ],
  },
};
