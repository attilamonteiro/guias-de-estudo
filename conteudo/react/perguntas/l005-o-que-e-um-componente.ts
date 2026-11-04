import type { Pergunta } from "../../tipos";

// L05 · O que é um componente
export const l005: Pergunta = {
  numero: 5,
  modulo: "linkedin-fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "O que é um componente",
    pergunta: "O que é um componente React?",
    porqueEsteMetodo:
      "Componente é o conceito mais usado do React e parece óbvio até surgirem as perguntas finas (definição contra instância, maiúscula no nome, componente dentro de componente). Uma analogia de molde e peça organiza essas distinções.",
    resposta30s:
      "Um **componente** é uma **função que recebe props e devolve JSX**, descrevendo um pedaço da interface. É o bloco de construção do React: você o **reutiliza** e o **combina** com outros para montar telas inteiras. O nome começa com **letra maiúscula** para o React distingui-lo das tags HTML, e cada uso do componente cria uma **instância** com o seu próprio state.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num molde de peça de montar. Você desenha o molde uma vez e produz quantas peças quiser; cada peça sai com cores diferentes, escolhidas por quem a usa (as props). Peças pequenas se encaixam em peças maiores: um botão dentro de um cartão, o cartão dentro de uma lista, a lista dentro de uma página.",
        tecnico:
          "Um componente é uma função que recebe um objeto de **props** e devolve **JSX** (ou outro valor renderizável, como texto ou `null`). Ele descreve o que mostrar para aqueles dados e deve ser **puro**: mesmas props e mesmo state, mesmo resultado. Ao escrever `<Cartao />`, você pede ao React que chame a função para obter a descrição; cada uso é uma **instância**, e o state dela fica guardado pelo React na árvore, não dentro da função.",
        limite:
          "O molde não explica a regra do nome: tags em minúscula (`<div>`) são elementos do navegador, e maiúscula (`<Cartao>`) é uma referência à sua função. Também não mostra por que declarar um componente **dentro** de outro é um erro: a cada renderização do pai nasce um molde novo, o React não reconhece o mesmo tipo, descarta a instância antiga e perde o state dela.",
      },
      {
        tipo: "tabela",
        titulo: "Definição, elemento e instância",
        colunas: ["Conceito", "O que é", "Exemplo"],
        linhas: [
          ["Definição do componente", "A função, escrita uma vez", "`function Cartao(props) { ... }`"],
          ["Elemento", "A descrição de um uso, que é o que o JSX produz", '`<Cartao titulo="A" />`'],
          [
            "Instância",
            "O componente montado na árvore, com state próprio",
            "Dois `<Cartao />` lado a lado são duas instâncias independentes",
          ],
          ["Tag nativa", "Elemento do navegador, sempre em minúscula", "`<div>`, `<button>`"],
        ],
        nota: "Uma definição pode gerar muitas instâncias, e cada uma guarda o seu state.",
      },
      {
        tipo: "codigo",
        titulo: "Criar, reutilizar e combinar",
        legenda: "JSX",
        codigo: `function Aviso({ titulo, texto }) {
  return (
    <section>
      <h2>{titulo}</h2>
      <p>{texto}</p>
    </section>
  );
}

export default function Pagina() {
  return (
    <>
      <Aviso titulo="Entrega" texto="Sai amanhã." />
      <Aviso titulo="Troca" texto="Até 30 dias." />
    </>
  );
}`,
        nota: "Para criar um componente basta escrever a função com nome em maiúscula e usá-la como tag; `Pagina` é um componente feito da combinação de dois `Aviso`.",
      },
      {
        tipo: "codigo",
        titulo: "O erro de declarar um componente dentro de outro",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Pagina() {
  const [tema, setTema] = useState("claro");

  // Errado: um tipo de componente novo a cada renderização de Pagina
  function Campo() {
    const [texto, setTexto] = useState("");
    return <input value={texto} onChange={(e) => setTexto(e.target.value)} />;
  }

  return (
    <>
      <button onClick={() => setTema(tema === "claro" ? "escuro" : "claro")}>{tema}</button>
      <Campo /> {/* ao trocar o tema, o texto digitado some */}
    </>
  );
}`,
        nota: "A correção é mover `Campo` para fora de `Pagina`, no nível do módulo, e passar o que ele precisa por props.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Componente se usa como tag, não se chama como função",
        texto:
          "Escreva `<Cartao />`, não `Cartao()`. Só assim o React cria uma instância, guarda o state dela e controla os Hooks; chamar a função direto faz os Hooks passarem a pertencer ao componente que a chamou. E mantenha as definições no nível do módulo: o que está dentro de outro componente é recriado a cada renderização, com state e foco perdidos.",
      },
    ],
    armadilhas: [
      "Escrever o nome do componente em minúscula (`<cartao />`): o React o trata como tag HTML e não encontra a função.",
      "Declarar um componente dentro de outro: a cada renderização do pai nasce um tipo novo e o filho é remontado, perdendo state e foco.",
      "Chamar o componente como função comum (`Cartao()`) em vez de usar `<Cartao />`: ele não vira instância e os Hooks passam a pertencer ao pai.",
      "Alterar variáveis externas ou as props durante a renderização: o componente deve ser puro, ou deixa de ser previsível.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre `<Cartao />` e `<cartao />`?",
        resposta:
          "Com maiúscula, o JSX referencia a função `Cartao` que está no escopo; com minúscula, o React entende uma tag HTML chamada `cartao`, que não existe.",
      },
      {
        pergunta: "Dois `<Contador />` na mesma tela compartilham state?",
        resposta: "Não. Cada uso é uma instância separada, com o próprio state, mesmo que venham da mesma função.",
      },
    ],
  },
  en: {
    titulo: "What a component is",
    pergunta: "What is a React component?",
    porqueEsteMetodo:
      "Component is the most used concept in React and looks obvious until the finer questions arrive (definition versus instance, the capital letter in the name, a component inside a component). A mold-and-piece analogy organizes those distinctions.",
    resposta30s:
      "A **component** is a **function that receives props and returns JSX**, describing a piece of the interface. It is the building block of React: you **reuse** it and **combine** it with others to assemble whole screens. Its name starts with a **capital letter** so React can tell it from HTML tags, and every use of the component creates an **instance** with its own state.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a mold for a building-block piece. You design the mold once and produce as many pieces as you like; each piece comes out in different colors, chosen by whoever uses it (the props). Small pieces snap into bigger ones: a button inside a card, the card inside a list, the list inside a page.",
        tecnico:
          "A component is a function that receives a **props** object and returns **JSX** (or another renderable value, such as text or `null`). It describes what to show for that data and should be **pure**: same props and same state, same result. When you write `<Card />`, you ask React to call the function to get the description; each use is an **instance**, and its state is kept by React in the tree, not inside the function.",
        limite:
          "The mold does not explain the naming rule: lowercase tags (`<div>`) are browser elements, and a capital letter (`<Card>`) is a reference to your function. It also does not show why declaring a component **inside** another is a mistake: every render of the parent creates a new mold, React does not recognize the same type, discards the old instance and loses its state.",
      },
      {
        tipo: "tabela",
        titulo: "Definition, element and instance",
        colunas: ["Concept", "What it is", "Example"],
        linhas: [
          ["Component definition", "The function, written once", "`function Card(props) { ... }`"],
          ["Element", "The description of one use, which is what JSX produces", '`<Card title="A" />`'],
          [
            "Instance",
            "The component mounted in the tree, with its own state",
            "Two `<Card />` side by side are two independent instances",
          ],
          ["Built-in tag", "A browser element, always lowercase", "`<div>`, `<button>`"],
        ],
        nota: "One definition can produce many instances, and each one keeps its own state.",
      },
      {
        tipo: "codigo",
        titulo: "Create, reuse and combine",
        legenda: "JSX",
        codigo: `function Notice({ title, text }) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}

export default function Page() {
  return (
    <>
      <Notice title="Delivery" text="Ships tomorrow." />
      <Notice title="Returns" text="Within 30 days." />
    </>
  );
}`,
        nota: "To create a component, write the function with a capitalized name and use it as a tag; `Page` is a component made by combining two `Notice`.",
      },
      {
        tipo: "codigo",
        titulo: "The mistake of declaring a component inside another",
        legenda: "JSX",
        codigo: `import { useState } from "react";

function Page() {
  const [theme, setTheme] = useState("light");

  // Wrong: a new component type on every render of Page
  function Field() {
    const [text, setText] = useState("");
    return <input value={text} onChange={(e) => setText(e.target.value)} />;
  }

  return (
    <>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme}</button>
      <Field /> {/* when the theme changes, the typed text disappears */}
    </>
  );
}`,
        nota: "The fix is to move `Field` out of `Page`, to module level, and pass what it needs through props.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A component is used as a tag, not called as a function",
        texto:
          "Write `<Card />`, not `Card()`. Only then does React create an instance, keep its state and control its Hooks; calling the function directly makes the Hooks belong to the component that called it. And keep definitions at module level: whatever sits inside another component is recreated on every render, with state and focus lost.",
      },
    ],
    armadilhas: [
      "Writing the component name in lowercase (`<card />`): React treats it as an HTML tag and never finds the function.",
      "Declaring a component inside another: every render of the parent creates a new type and the child is remounted, losing state and focus.",
      "Calling the component as a plain function (`Card()`) instead of using `<Card />`: it does not become an instance and its Hooks end up belonging to the parent.",
      "Changing outside variables or props during render: a component must be pure, or it stops being predictable.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `<Card />` and `<card />`?",
        resposta:
          "With a capital letter, JSX references the `Card` function in scope; in lowercase, React reads an HTML tag called `card`, which does not exist.",
      },
      {
        pergunta: "Do two `<Counter />` on the same screen share state?",
        resposta:
          "No. Each use is a separate instance with its own state, even though they come from the same function.",
      },
    ],
  },
};
