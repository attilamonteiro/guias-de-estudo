import type { Pergunta } from "../../tipos";

// L06 · O que é JSX
export const l006: Pergunta = {
  numero: 6,
  modulo: "linkedin-fundamentos",
  metodo: "trace",
  pt: {
    titulo: "O que é JSX",
    pergunta: "O que é JSX?",
    porqueEsteMetodo:
      "O JSX parece HTML dentro do JavaScript até você seguir um trecho do código escrito até o objeto que o React recebe. Acompanhar esse caminho, e os pontos em que ele quebra, responde de uma vez às variações: o que é, por que usar, como vira JavaScript e como difere do HTML.",
    resposta30s:
      "**JSX** é uma sintaxe que mistura marcação e JavaScript no código; não é HTML nem uma string. Na compilação, cada expressão JSX vira uma **chamada de função** (`jsx` no transform moderno, `React.createElement` no clássico) que devolve um **objeto** descrevendo o elemento, e o React usa esses objetos para montar a interface. É **opcional**, mas deixa a descrição da tela legível e permite usar JavaScript entre chaves, com escape automático do texto.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O caminho de um trecho de JSX até a tela",
        etapas: [
          'Você escreve `<h1 className="titulo">Olá, {nome}</h1>` em um arquivo `.jsx` ou `.tsx`',
          "O compilador do projeto (Babel, SWC, esbuild ou o TypeScript) troca a marcação por uma chamada de função: `jsx(...)` no transform moderno, `React.createElement(...)` no clássico",
          'Quando o componente executa, a chamada devolve um objeto simples com o tipo (`"h1"`), as props e os filhos: um **elemento** React, que é uma descrição, não um nó do DOM',
          "O React lê a árvore de elementos que o componente devolveu e, na renderização, compara com a anterior",
          "Na fase de commit, cria ou atualiza os nós do DOM real",
        ],
        nota: "O navegador nunca vê JSX: só o JavaScript já compilado.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo elemento, em três formas",
        legenda: "JSX",
        codigo: `// O que você escreve
const a = <h1 className="titulo">Olá, {nome}</h1>;

// O que o transform clássico produz (simplificado)
const b = React.createElement("h1", { className: "titulo" }, "Olá, ", nome);

// O elemento resultante é só um objeto (simplificado)
// { type: "h1", props: { className: "titulo", children: ["Olá, ", nome] } }`,
        nota: "O transform moderno chama `jsx` de um módulo interno do React e dispensa importar o `React` em cada arquivo. O objeto real tem mais campos; o que importa é que é um dado comum.",
      },
      {
        tipo: "tabela",
        titulo: "JSX contra HTML",
        colunas: ["Aspecto", "HTML", "JSX"],
        linhas: [
          ["Classe CSS", "`class`", "`className` (`class` é palavra reservada do JavaScript)"],
          ["Rótulo de campo", "`for`", "`htmlFor`"],
          [
            "Nomes de atributos",
            "Minúsculas: `tabindex`, `onclick`",
            "camelCase: `tabIndex`, `onClick`; `data-*` e `aria-*` mantêm o hífen",
          ],
          ["Eventos", '`onclick="fazer()"` (texto)', "`onClick={fazer}` (uma função)"],
          ["Estilo inline", '`style="color: red"` (texto)', '`style={{ color: "red" }}` (um objeto)'],
          ["Tags vazias", "`<br>` e `<input>` dispensam o fechamento", "Toda tag fecha: `<br />`, `<input />`"],
          [
            "Raiz",
            "O documento aceita vários elementos no topo",
            "Um só elemento raiz por retorno, ou um Fragment `<>...</>`",
          ],
          [
            "Conteúdo dinâmico",
            "Não existe: o texto é estático",
            "`{expressão}` em texto e atributos, com escape automático; só expressões, sem `if` nem `for` (use `? :`, `&&` e `map`)",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Quando o JSX dá errado",
        passos: [
          {
            titulo: "Vários elementos na raiz",
            texto:
              "Retornar `<h1 />` e `<p />` lado a lado não compila: o JSX produz uma única chamada, então precisa de um pai. Envolva em um elemento ou em um Fragment (`<>...</>`), que não cria nó extra no DOM.",
          },
          {
            titulo: "Tag sem fechar",
            texto: "`<input>` e `<br>` sem barra são erro de sintaxe, ao contrário do HTML. Escreva `<input />`.",
          },
          {
            titulo: "Atributo do HTML",
            texto:
              "`class` e `for` no lugar de `className` e `htmlFor` fazem o React avisar no console. A causa é que os atributos do JSX são propriedades do DOM, em camelCase.",
          },
          {
            titulo: "Valor que não pode ser filho",
            texto:
              "Um objeto comum entre chaves (`{usuario}`) faz o React lançar erro: renderize os campos que quer mostrar. `null`, `undefined` e booleanos não aparecem, mas um número aparece: `{lista.length && <Lista />}` mostra um `0` quando a lista está vazia. Compare com `lista.length > 0`.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que usar JSX, e o que ele não é",
        texto:
          "A marcação e a lógica da interface ficam **juntas**, no mesmo componente, e você usa JavaScript de verdade em vez de uma linguagem de template própria; o editor e o compilador também conferem a sintaxe. O JSX **não é HTML nem uma string**: é açúcar sintático para chamadas de função, e é **opcional**, pois dá para escrever só `createElement`. O texto inserido entre chaves é **escapado** por padrão, o que dificulta injeção de HTML (XSS), mas não a elimina: `dangerouslySetInnerHTML` e HTML não confiável continuam exigindo cuidado.",
      },
    ],
    armadilhas: [
      "Tratar JSX como HTML e copiar atributos como estão (`class`, `for`, `style` como texto): em JSX são `className`, `htmlFor` e um objeto.",
      "Retornar mais de um elemento sem um pai ou um Fragment.",
      "Usar `{lista.length && <Lista />}`: com lista vazia aparece um `0` na tela; compare com um booleano.",
      "Colocar um objeto, ou um `if`, entre chaves: só expressões que viram valores renderizáveis servem.",
    ],
    autoteste: [
      {
        pergunta: 'O que o compilador faz com `<Botao tipo="ok">Salvar</Botao>`?',
        resposta:
          'Troca por uma chamada de função com o componente, as props e os filhos (`jsx(Botao, { tipo: "ok", children: "Salvar" })`, no transform moderno). Ela devolve um objeto que descreve o elemento.',
      },
      {
        pergunta: "Posso usar React sem JSX?",
        resposta:
          "Posso: o JSX é uma conveniência. Dá para chamar `createElement` direto, mas o resultado é bem menos legível; por isso quase todo projeto usa JSX.",
      },
    ],
  },
  en: {
    titulo: "What JSX is",
    pergunta: "What is JSX?",
    porqueEsteMetodo:
      "JSX looks like HTML inside JavaScript until you follow a snippet from the code you wrote to the object React receives. Tracing that path, and the points where it breaks, answers the variations at once: what it is, why use it, how it becomes JavaScript and how it differs from HTML.",
    resposta30s:
      "**JSX** is a syntax that mixes markup and JavaScript in your code; it is neither HTML nor a string. At compile time, each JSX expression becomes a **function call** (`jsx` in the modern transform, `React.createElement` in the classic one) that returns an **object** describing the element, and React uses those objects to build the interface. It is **optional**, but it keeps the screen description readable and lets you use JavaScript inside braces, with text escaped automatically.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "The path of a JSX snippet to the screen",
        etapas: [
          'You write `<h1 className="title">Hello, {name}</h1>` in a `.jsx` or `.tsx` file',
          "The project’s compiler (Babel, SWC, esbuild or TypeScript) replaces the markup with a function call: `jsx(...)` in the modern transform, `React.createElement(...)` in the classic one",
          'When the component runs, the call returns a plain object with the type (`"h1"`), the props and the children: a React **element**, which is a description, not a DOM node',
          "React reads the tree of elements the component returned and, during rendering, compares it with the previous one",
          "In the commit phase, it creates or updates the real DOM nodes",
        ],
        nota: "The browser never sees JSX: only the already compiled JavaScript.",
      },
      {
        tipo: "codigo",
        titulo: "The same element, in three forms",
        legenda: "JSX",
        codigo: `// What you write
const a = <h1 className="title">Hello, {name}</h1>;

// What the classic transform produces (simplified)
const b = React.createElement("h1", { className: "title" }, "Hello, ", name);

// The resulting element is just an object (simplified)
// { type: "h1", props: { className: "title", children: ["Hello, ", name] } }`,
        nota: "The modern transform calls `jsx` from an internal React module and does not require importing `React` in every file. The real object has more fields; what matters is that it is plain data.",
      },
      {
        tipo: "tabela",
        titulo: "JSX versus HTML",
        colunas: ["Aspect", "HTML", "JSX"],
        linhas: [
          ["CSS class", "`class`", "`className` (`class` is a reserved word in JavaScript)"],
          ["Label target", "`for`", "`htmlFor`"],
          [
            "Attribute names",
            "Lowercase: `tabindex`, `onclick`",
            "camelCase: `tabIndex`, `onClick`; `data-*` and `aria-*` keep the hyphen",
          ],
          ["Events", '`onclick="run()"` (text)', "`onClick={run}` (a function)"],
          ["Inline style", '`style="color: red"` (text)', '`style={{ color: "red" }}` (an object)'],
          ["Empty tags", "`<br>` and `<input>` need no closing", "Every tag closes: `<br />`, `<input />`"],
          [
            "Root",
            "The document accepts several elements at the top",
            "One root element per return, or a Fragment `<>...</>`",
          ],
          [
            "Dynamic content",
            "None: the text is static",
            "`{expression}` in text and attributes, with automatic escaping; expressions only, no `if` or `for` (use `? :`, `&&` and `map`)",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "When JSX goes wrong",
        passos: [
          {
            titulo: "Several elements at the root",
            texto:
              "Returning `<h1 />` and `<p />` side by side does not compile: JSX produces a single call, so it needs one parent. Wrap them in an element or in a Fragment (`<>...</>`), which adds no extra DOM node.",
          },
          {
            titulo: "Unclosed tag",
            texto: "`<input>` and `<br>` without a slash are a syntax error, unlike in HTML. Write `<input />`.",
          },
          {
            titulo: "HTML attribute",
            texto:
              "`class` and `for` instead of `className` and `htmlFor` make React warn in the console. The cause is that JSX attributes are DOM properties, in camelCase.",
          },
          {
            titulo: "Value that cannot be a child",
            texto:
              "A plain object inside braces (`{user}`) makes React throw: render the fields you want to show. `null`, `undefined` and booleans do not appear, but a number does: `{list.length && <List />}` shows a `0` when the list is empty. Compare with `list.length > 0`.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why use JSX, and what it is not",
        texto:
          "Markup and interface logic stay **together**, in the same component, and you use real JavaScript instead of a template language of its own; the editor and the compiler also check the syntax. JSX is **neither HTML nor a string**: it is syntactic sugar for function calls, and it is **optional**, since you can write only `createElement`. Text inserted inside braces is **escaped** by default, which makes HTML injection (XSS) harder but does not eliminate it: `dangerouslySetInnerHTML` and untrusted HTML still demand care.",
      },
    ],
    armadilhas: [
      "Treating JSX as HTML and copying attributes as they are (`class`, `for`, `style` as text): in JSX they are `className`, `htmlFor` and an object.",
      "Returning more than one element without a parent or a Fragment.",
      "Using `{list.length && <List />}`: with an empty list a `0` appears on screen; compare with a boolean.",
      "Putting an object, or an `if`, inside braces: only expressions that evaluate to renderable values work.",
    ],
    autoteste: [
      {
        pergunta: 'What does the compiler do with `<Button type="ok">Save</Button>`?',
        resposta:
          'It replaces it with a function call carrying the component, the props and the children (`jsx(Button, { type: "ok", children: "Save" })` in the modern transform). The call returns an object that describes the element.',
      },
      {
        pergunta: "Can I use React without JSX?",
        resposta:
          "Yes: JSX is a convenience. You can call `createElement` directly, but the result is far less readable, which is why almost every project uses JSX.",
      },
    ],
  },
};
