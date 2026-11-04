import type { Pergunta } from "../../tipos";

// S88 · TypeScript com React
export const s088: Pergunta = {
  numero: 688,
  modulo: "simplilearn-next-testes-ts",
  metodo: "whys",
  pt: {
    titulo: "TypeScript com React",
    pergunta: "Por que o TypeScript é comumente usado com React?",
    porqueEsteMetodo:
      "A pergunta é sobre motivos, e os motivos se encadeiam: um problema real gera uma necessidade, que justifica uma ferramenta, que traz um custo. Seguir os “por quês” até a raiz mostra quando o TypeScript compensa.",
    resposta30s:
      "Porque **componentes são funções chamadas de muitos lugares**, e em JavaScript puro uma prop errada ou um `state` indefinido só aparecem **em execução**, às vezes na tela do usuário. Os tipos viram um **contrato entre componentes**, conferido no editor e no build, com **autocompletar** e **refatoração segura**, o que dá confiança para mudar bases grandes e trabalhar em equipe. O custo: configuração, curva de aprendizado, e os tipos **não existem em tempo de execução**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que props erradas e `state` indefinido são um problema em React?",
            resposta:
              'Porque o JavaScript é dinâmico e não confere o que um componente recebe: passar `idade="30"` em vez de `30`, esquecer uma prop ou ler `usuario.nome` quando `usuario` ainda é `undefined` só falha quando aquele código roda, muitas vezes depois de um clique ou de uma resposta lenta da rede.',
          },
          {
            pergunta: "Por que isso pesa mais em React do que em outro código?",
            resposta:
              "Um componente é chamado por muitos outros, e os dados atravessam props, contexto, Hooks e respostas de API. Mudar a forma de um dado em um lugar quebra, em silêncio, quem o consome em outro.",
          },
          {
            pergunta: "Por que os tipos resolvem isso?",
            resposta:
              "O tipo declara o contrato: as props que o componente aceita, o formato do estado, o que um evento carrega. O compilador confere cada uso contra esse contrato antes de o código rodar, e o editor sublinha o erro na hora.",
          },
          {
            pergunta: "Por que eles também melhoram o dia a dia de quem escreve?",
            resposta:
              "O editor passa a saber o que existe: autocompleta props e campos, mostra a assinatura ao passar o mouse e, ao renomear uma prop ou mudar um tipo, aponta cada lugar que precisa mudar. A refatoração deixa de ser aposta.",
          },
          {
            pergunta: "Por que isso escala com a base de código e com a equipe?",
            resposta:
              "Os tipos funcionam como documentação que não fica desatualizada e como combinado entre pessoas: quem usa o componente de outra equipe vê o contrato sem ler a implementação. Na revisão de código, o compilador já pegou uma classe inteira de erros.",
          },
        ],
        causaRaiz:
          "O JavaScript só descobre o desencontro entre quem manda um dado e quem o recebe quando o código executa. O TypeScript antecipa essa descoberta para o editor e o build, onde corrigir custa menos.",
      },
      {
        tipo: "codigo",
        titulo: "Props, estado, evento e children tipados",
        legenda: "TSX",
        codigo: [
          'import { useState, type ChangeEvent, type ReactNode } from "react";',
          "interface CampoProps {",
          "  rotulo: string;",
          "  children?: ReactNode; // qualquer coisa que o React renderize",
          "}",
          "",
          "export function Campo({ rotulo, children }: CampoProps) {",
          '  const [texto, setTexto] = useState(""); // inferido: string',
          "  const [erro, setErro] = useState<string | null>(null); // união explícita",
          "  function aoMudar(e: ChangeEvent<HTMLInputElement>) {",
          "    setTexto(e.target.value);",
          '    setErro(e.target.value ? null : "Obrigatório");',
          "  }",
          "",
          "  return (",
          "    <label>",
          "      {rotulo} <input value={texto} onChange={aoMudar} />",
          "      {erro} {children}",
          "    </label>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Esquecer `rotulo`, passar um número no lugar dele ou ler `e.target.valor` (com erro de digitação) vira erro de compilação, não bug em produção.",
      },
      {
        tipo: "codigo",
        titulo: "Hooks tipados: a ação errada não compila",
        legenda: "TSX",
        codigo: [
          'import { useReducer, useRef } from "react";',
          "",
          'type Acao = { tipo: "somar"; valor: number } | { tipo: "zerar" };',
          "",
          "function reducer(total: number, acao: Acao): number {",
          '  if (acao.tipo === "somar") return total + acao.valor; // aqui `valor` existe',
          "  return 0;",
          "}",
          "",
          "export function Contador() {",
          "  const [total, dispatch] = useReducer(reducer, 0);",
          "  const campo = useRef<HTMLInputElement>(null); // .current: HTMLInputElement | null",
          "  return (",
          "    <>",
          "      <input ref={campo} />",
          '      <button onClick={() => dispatch({ tipo: "somar", valor: 1 })}>{total}</button>',
          "      {/* erro de compilação: falta `valor` */}",
          '      <button onClick={() => dispatch({ tipo: "somar" })}>Somar</button>',
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "O `total` é inferido como `number` e `dispatch` só aceita ações da união `Acao`.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como o TypeScript trata os Hooks e os componentes genéricos",
        texto:
          "A maioria dos tipos é **inferida**: `useState(0)` já é `number`. Informe o tipo quando o valor inicial não o revela: `useState<Usuario | null>(null)`. `useRef<HTMLInputElement>(null)` tipa o nó do DOM, e `useContext` devolve o tipo do contexto, que costuma incluir `null` até haver um Provider. Um **componente genérico** deixa o tipo vir de quem usa: em `function Lista<T>(props: { itens: T[]; renderizar: (item: T) => ReactNode })`, o `T` é inferido a partir de `itens`. Os tipos do React mudam entre versões: confira react.dev e a documentação do TypeScript.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo, e o que o TypeScript não faz",
        texto:
          "Há configuração (`tsconfig`, tipos das bibliotecas), curva de aprendizado e a tentação de escrever tipos complicados demais. E os tipos são **apagados na compilação**: em execução só existe JavaScript, então uma resposta de API ou um formulário que não segue o tipo passa direto. Valide as fronteiras com uma biblioteca de validação de esquemas; o tipo descreve o que você espera, não garante o que chega.",
      },
    ],
    armadilhas: [
      "Usar `any` ou `as` para fazer o erro sumir: o compilador para de proteger exatamente onde você precisava.",
      "Achar que o tipo valida dados em execução: respostas de API, `localStorage` e formulários precisam de validação de verdade.",
      'Tipar de menos ou de mais: `useState(null)` vira `null` e não aceita mais nada depois, enquanto `useState<string>("")` repete o que o TypeScript já infere.',
      "Escrever tipos condicionais e genéricos aninhados para um componente simples: o custo de ler passa a ser maior que o ganho.",
    ],
    autoteste: [
      {
        pergunta: "Que tipo de erro o TypeScript ajuda a pegar em um componente React antes de rodar?",
        resposta:
          "Props erradas ou ausentes, uso de um estado possivelmente `undefined` ou `null`, eventos com o tipo errado e chamadas com argumentos incompatíveis, tudo apontado no editor e no build.",
      },
      {
        pergunta: "Por que o TypeScript não dispensa validar os dados que vêm de uma API?",
        resposta:
          "Porque os tipos são apagados na compilação: em execução só existe JavaScript. Eles descrevem o que você espera, não garantem o que chega, então a resposta precisa ser validada.",
      },
    ],
  },
  en: {
    titulo: "Why use TypeScript with React",
    pergunta: "Why is TypeScript commonly used with React?",
    porqueEsteMetodo:
      "The question is about reasons, and the reasons chain together: a real problem creates a need, which justifies a tool, which brings a cost. Following the “whys” down to the root shows when TypeScript pays off.",
    resposta30s:
      "Because **components are functions called from many places**, and in plain JavaScript a wrong prop or an undefined `state` only shows up **at run time**, sometimes on the user’s screen. Types become a **contract between components**, checked in the editor and the build, with **autocomplete** and **safe refactoring**, which gives the confidence to change large codebases and work as a team. The cost: configuration, a learning curve, and types **do not exist at run time**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why are wrong props and undefined `state` a problem in React?",
            resposta:
              'Because JavaScript is dynamic and does not check what a component receives: passing `age="30"` instead of `30`, forgetting a prop, or reading `user.name` while `user` is still `undefined` only fails when that code runs, often after a click or a slow network response.',
          },
          {
            pergunta: "Why does this weigh more in React than in other code?",
            resposta:
              "A component is called by many others, and data crosses props, context, Hooks and API responses. Changing the shape of a piece of data in one place silently breaks whoever consumes it in another.",
          },
          {
            pergunta: "Why do types solve this?",
            resposta:
              "A type declares the contract: the props a component accepts, the shape of the state, what an event carries. The compiler checks every use against that contract before the code runs, and the editor underlines the error right away.",
          },
          {
            pergunta: "Why do they also improve the day-to-day work of whoever writes the code?",
            resposta:
              "The editor now knows what exists: it autocompletes props and fields, shows the signature on hover and, when you rename a prop or change a type, points to every place that must change. Refactoring stops being a gamble.",
          },
          {
            pergunta: "Why does this scale with the codebase and the team?",
            resposta:
              "Types work as documentation that does not go stale and as an agreement between people: whoever uses another team’s component sees the contract without reading the implementation. In code review, the compiler has already caught a whole class of mistakes.",
          },
        ],
        causaRaiz:
          "JavaScript only discovers the mismatch between whoever sends a piece of data and whoever receives it when the code runs. TypeScript moves that discovery to the editor and the build, where fixing it costs less.",
      },
      {
        tipo: "codigo",
        titulo: "Typed props, state, event and children",
        legenda: "TSX",
        codigo: [
          'import { useState, type ChangeEvent, type ReactNode } from "react";',
          "interface FieldProps {",
          "  label: string;",
          "  children?: ReactNode; // anything React can render",
          "}",
          "",
          "export function Field({ label, children }: FieldProps) {",
          '  const [text, setText] = useState(""); // inferred: string',
          "  const [error, setError] = useState<string | null>(null); // explicit union",
          "  function onChange(e: ChangeEvent<HTMLInputElement>) {",
          "    setText(e.target.value);",
          '    setError(e.target.value ? null : "Required");',
          "  }",
          "",
          "  return (",
          "    <label>",
          "      {label} <input value={text} onChange={onChange} />",
          "      {error} {children}",
          "    </label>",
          "  );",
          "}",
        ].join("\n"),
        nota: "Forgetting `label`, passing a number in its place or reading `e.target.valu` (a typo) becomes a compile error, not a production bug.",
      },
      {
        tipo: "codigo",
        titulo: "Typed Hooks: the wrong action does not compile",
        legenda: "TSX",
        codigo: [
          'import { useReducer, useRef } from "react";',
          "",
          'type Action = { type: "add"; amount: number } | { type: "reset" };',
          "",
          "function reducer(total: number, action: Action): number {",
          '  if (action.type === "add") return total + action.amount; // `amount` exists here',
          "  return 0;",
          "}",
          "",
          "export function Counter() {",
          "  const [total, dispatch] = useReducer(reducer, 0);",
          "  const field = useRef<HTMLInputElement>(null); // .current: HTMLInputElement | null",
          "  return (",
          "    <>",
          "      <input ref={field} />",
          '      <button onClick={() => dispatch({ type: "add", amount: 1 })}>{total}</button>',
          "      {/* compile error: `amount` is missing */}",
          '      <button onClick={() => dispatch({ type: "add" })}>Add</button>',
          "    </>",
          "  );",
          "}",
        ].join("\n"),
        nota: "`total` is inferred as `number` and `dispatch` only accepts actions from the `Action` union.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How TypeScript handles Hooks and generic components",
        texto:
          "Most types are **inferred**: `useState(0)` is already `number`. Spell the type out when the initial value does not reveal it: `useState<User | null>(null)`. `useRef<HTMLInputElement>(null)` types the DOM node, and `useContext` returns the context’s type, which often includes `null` until a Provider exists. A **generic component** lets the type come from whoever uses it: in `function List<T>(props: { items: T[]; render: (item: T) => ReactNode })`, `T` is inferred from `items`. React’s types change between versions: check react.dev and the TypeScript documentation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost, and what TypeScript does not do",
        texto:
          "There is configuration (`tsconfig`, library types), a learning curve and the temptation to write types that are too clever. And types are **erased at compile time**: at run time only JavaScript exists, so an API response or a form that does not follow the type goes straight through. Validate the boundaries with a schema-validation library; the type describes what you expect, not what arrives.",
      },
    ],
    armadilhas: [
      "Using `any` or `as` to make the error go away: the compiler stops protecting exactly where you needed it.",
      "Thinking the type validates data at run time: API responses, `localStorage` and forms need real validation.",
      'Typing too little or too much: `useState(null)` becomes `null` and accepts nothing afterwards, while `useState<string>("")` repeats what TypeScript already infers.',
      "Writing nested conditional and generic types for a simple component: the cost of reading them outgrows the benefit.",
    ],
    autoteste: [
      {
        pergunta: "What kind of mistake does TypeScript help catch in a React component before it runs?",
        resposta:
          "Wrong or missing props, use of state that may be `undefined` or `null`, events with the wrong type and calls with incompatible arguments, all flagged in the editor and the build.",
      },
      {
        pergunta: "Why doesn’t TypeScript remove the need to validate data coming from an API?",
        resposta:
          "Because types are erased at compile time: at run time only JavaScript exists. They describe what you expect, not what arrives, so the response has to be validated.",
      },
    ],
  },
};
