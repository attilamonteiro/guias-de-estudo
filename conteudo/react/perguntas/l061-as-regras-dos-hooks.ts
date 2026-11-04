import type { Pergunta } from "../../tipos";

// L61 · As Regras dos Hooks
export const l061: Pergunta = {
  numero: 61,
  modulo: "linkedin-regras-e-effects",
  metodo: "firstprinciples",
  pt: {
    titulo: "As Regras dos Hooks",
    pergunta: "Quais são as Regras dos Hooks?",
    porqueEsteMetodo:
      "As regras parecem uma lista de proibições arbitrárias até você ver como o React guarda os Hooks. Partir do problema mais simples e chegar à lista indexada pela ordem de chamada faz cada regra sair como consequência, em vez de ser decorada.",
    resposta30s:
      "O React identifica cada Hook de um componente pela **posição na ordem das chamadas** em cada renderização, como numa lista de slots. Por isso há duas regras: chame Hooks **só no nível superior** (nunca em condições, laços, funções aninhadas ou depois de um `return` antecipado) e **só em componentes de função ou em Hooks personalizados**. Quebrar a ordem desalinha os valores, e o plugin `eslint-plugin-react-hooks` verifica as regras.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Um componente é uma função que roda de novo a cada renderização, mas precisa **lembrar** valores entre uma execução e outra: state, refs, resultados memoizados. Como a função não tem instância, o React guarda esses valores por fora.",
          },
          {
            titulo: "1. A versão mais simples: variáveis locais ou globais",
            texto:
              "Uma variável local some a cada chamada. Uma global é compartilhada por todas as instâncias do componente. → Quebra nas duas: o valor precisa ser guardado **por instância**, e a chamada `useState(0)` não diz qual valor é o dela, porque ela não recebe nome.",
          },
          {
            titulo: "2. O React guarda uma lista por componente",
            texto:
              "Cada instância tem uma lista de slots (state, efeitos, memos, refs). Na renderização, um índice recomeça do zero, e cada chamada de Hook usa o próximo slot: o primeiro Hook lê o slot 0, o segundo o slot 1, e assim por diante. Os Hooks são identificados **pela posição**, não pelo nome.",
          },
          {
            titulo: "3. A primeira regra sai daí: mesma ordem, sempre",
            texto:
              "Para cada Hook achar o seu slot, a **ordem e a quantidade** de chamadas têm de ser idênticas em toda renderização. Por isso: Hooks só no nível superior do componente, nunca em condições, laços, funções aninhadas (inclusive handlers) nem depois de um `return` antecipado, que pularia os Hooks seguintes.",
          },
          {
            titulo: "4. O que quebra: o desalinhamento",
            texto:
              'Suponha `if (logado) { useState("") }` seguido de `useState("claro")`. Renderização 1 (`logado` = true): slot 0 é o nome, slot 1 é o tema. Renderização 2 (`logado` = false): o `useState("claro")` agora é a primeira chamada e lê o slot 0, o valor do nome. Os valores trocam de dono ou, se o total de Hooks muda, o React lança um erro de “mais ou menos Hooks do que na renderização anterior”. Em laço, o número de chamadas varia com os dados e dá o mesmo problema.',
          },
          {
            titulo: "5. A segunda regra: só em componentes e Hooks",
            texto:
              "O React só sabe qual lista usar quando está **renderizando um componente** (ou um Hook chamado por ele). Numa função JavaScript comum chamada de qualquer lugar, não há lista nem componente atual. Um custom Hook (nome `use…`) é permitido porque só roda dentro da renderização. Componentes de classe não usam Hooks.",
          },
          {
            titulo: "6. Como cumprir sem perder a lógica condicional",
            texto:
              "Chame o Hook sempre e coloque a condição **dentro** dele (`useEffect(() => { if (x) ... })`); separe a parte condicional num **componente filho** (`{x && <Filho />}`); para laços, um componente por item; e declare todos os Hooks **antes** de qualquer `return` condicional. O plugin `eslint-plugin-react-hooks` (regra `rules-of-hooks`) acusa as violações.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Modelo mental: a lista de slots (simplificado)",
        legenda: "JavaScript",
        codigo: `let slots = [];
let indice = 0;

function useState(inicial) {
  const i = indice++; // cada chamada pega o próximo slot
  if (slots[i] === undefined) slots[i] = inicial;
  const setar = (valor) => {
    slots[i] = valor; // e o React renderizaria de novo
  };
  return [slots[i], setar];
}

function renderizar(componente) {
  indice = 0; // a contagem recomeça a cada renderização
  return componente();
}`,
        nota: "Modelo mental, não o código do React: na implementação real, a lista é encadeada e fica ligada à instância do componente. A ideia, identificar cada Hook pela ordem de chamada, é a mesma.",
      },
      {
        tipo: "codigo",
        titulo: "Errado e certo",
        legenda: "TSX",
        codigo: `import { useState } from "react";

// Errado: o número de Hooks muda quando o valor de logado muda
function PerfilErrado({ logado }: { logado: boolean }) {
  if (!logado) return null; // return antecipado antes do Hook
  const [tema, setTema] = useState("claro");
  return <button onClick={() => setTema("escuro")}>{tema}</button>;
}

// Certo: todos os Hooks primeiro; a condição vem depois
function Perfil({ logado }: { logado: boolean }) {
  const [tema, setTema] = useState("claro");
  if (!logado) return null;
  return <button onClick={() => setTema("escuro")}>{tema}</button>;
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "As duas regras",
        texto:
          "(1) Chame Hooks **só no nível superior**: nunca em condições, laços, funções aninhadas ou depois de um `return` antecipado. (2) Chame Hooks **só em componentes de função ou em Hooks personalizados**, nunca em funções comuns ou em classes. As duas decorrem de uma lista indexada pela **ordem de chamada**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A exceção que confirma a regra: `use`",
        texto:
          "A API `use` (das versões recentes do React) pode ser chamada dentro de condições e laços, ao contrário dos Hooks, mas continua só em componentes ou Hooks. Para todos os outros Hooks, ligue `rules-of-hooks` como erro no lint. Confira os detalhes em react.dev.",
      },
    ],
    armadilhas: [
      "Chamar um Hook depois de um `return` antecipado: é a violação mais discreta. Declare todos os Hooks antes de qualquer retorno condicional.",
      "Colocar um Hook dentro de `if`, laço ou callback (`onClick`, `.map`, `setTimeout`): mova a condição para dentro do Hook, ou crie um componente filho por item.",
      "Chamar um Hook numa função comum ou numa classe: só componentes de função e funções `use…` podem fazê-lo. Se a função precisa de um Hook, torne-a um custom Hook.",
      "Tratar a regra como estilo: quebrá-la pode funcionar na primeira renderização e só falhar depois, ou trocar valores em silêncio.",
    ],
    autoteste: [
      {
        pergunta: "Por que a ordem das chamadas dos Hooks importa?",
        resposta:
          "Porque o React identifica cada Hook pela posição na lista da renderização. Se a ordem muda, um `useState` lê o slot de outro e os valores se desalinham.",
      },
      {
        pergunta: "Como usar um Hook “só às vezes”?",
        resposta:
          "Chame-o sempre e ponha a condição dentro dele (`useEffect(() => { if (x) ... }, [x])`), ou mova a parte condicional para um componente filho renderizado condicionalmente (`{x && <Filho />}`).",
      },
    ],
  },
  en: {
    titulo: "The Rules of Hooks",
    pergunta: "What are the Rules of Hooks?",
    porqueEsteMetodo:
      "The rules look like a list of arbitrary prohibitions until you see how React stores Hooks. Starting from the simplest problem and arriving at the list indexed by call order makes each rule fall out as a consequence, instead of being memorized.",
    resposta30s:
      "React identifies each of a component’s Hooks by its **position in the order of calls** on every render, like a list of slots. That gives two rules: call Hooks **only at the top level** (never in conditions, loops, nested functions or after an early `return`) and **only in function components or custom Hooks**. Breaking the order misaligns the values, and the `eslint-plugin-react-hooks` plugin checks the rules.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What we want",
            texto:
              "A component is a function that runs again on every render, but it needs to **remember** values between runs: state, refs, memoized results. Since the function has no instance, React keeps those values outside it.",
          },
          {
            titulo: "1. The simplest version: local or global variables",
            texto:
              "A local variable disappears on every call. A global one is shared by every instance of the component. → Both break: the value must be stored **per instance**, and the call `useState(0)` does not say which value is its own, because it receives no name.",
          },
          {
            titulo: "2. React keeps a list per component",
            texto:
              "Each instance has a list of slots (state, effects, memos, refs). During rendering, an index restarts at zero, and each Hook call uses the next slot: the first Hook reads slot 0, the second slot 1, and so on. Hooks are identified **by position**, not by name.",
          },
          {
            titulo: "3. The first rule falls out: same order, always",
            texto:
              "For each Hook to find its slot, the **order and number** of calls must be identical on every render. Hence: Hooks only at the top level of the component, never in conditions, loops, nested functions (handlers included) or after an early `return`, which would skip the Hooks that follow.",
          },
          {
            titulo: "4. What breaks: misalignment",
            texto:
              'Suppose `if (loggedIn) { useState("") }` followed by `useState("light")`. Render 1 (`loggedIn` = true): slot 0 is the name, slot 1 is the theme. Render 2 (`loggedIn` = false): `useState("light")` is now the first call and reads slot 0, the name’s value. The values change owners or, if the total number of Hooks changes, React throws a “rendered more or fewer Hooks than on the previous render” error. In a loop, the number of calls varies with the data and gives the same problem.',
          },
          {
            titulo: "5. The second rule: only in components and Hooks",
            texto:
              "React only knows which list to use while **rendering a component** (or a Hook called by one). In an ordinary JavaScript function called from anywhere, there is no list and no current component. A custom Hook (named `use…`) is allowed because it only runs inside rendering. Class components do not use Hooks.",
          },
          {
            titulo: "6. How to comply without losing conditional logic",
            texto:
              "Always call the Hook and put the condition **inside** it (`useEffect(() => { if (x) ... })`); move the conditional part into a **child component** (`{x && <Child />}`); for loops, one component per item; and declare all Hooks **before** any conditional `return`. The `eslint-plugin-react-hooks` plugin (the `rules-of-hooks` rule) flags violations.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Mental model: the list of slots (simplified)",
        legenda: "JavaScript",
        codigo: `let slots = [];
let index = 0;

function useState(initial) {
  const i = index++; // each call takes the next slot
  if (slots[i] === undefined) slots[i] = initial;
  const set = (value) => {
    slots[i] = value; // and React would render again
  };
  return [slots[i], set];
}

function render(component) {
  index = 0; // the count restarts on every render
  return component();
}`,
        nota: "A mental model, not React’s code: in the real implementation, the list is linked and attached to the component instance. The idea, identifying each Hook by call order, is the same.",
      },
      {
        tipo: "codigo",
        titulo: "Wrong and right",
        legenda: "TSX",
        codigo: `import { useState } from "react";

// Wrong: the number of Hooks changes when the value of loggedIn changes
function ProfileWrong({ loggedIn }: { loggedIn: boolean }) {
  if (!loggedIn) return null; // early return before the Hook
  const [theme, setTheme] = useState("light");
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}

// Right: all Hooks first; the condition comes after
function Profile({ loggedIn }: { loggedIn: boolean }) {
  const [theme, setTheme] = useState("light");
  if (!loggedIn) return null;
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The two rules",
        texto:
          "(1) Call Hooks **only at the top level**: never in conditions, loops, nested functions or after an early `return`. (2) Call Hooks **only in function components or custom Hooks**, never in ordinary functions or classes. Both follow from a list indexed by **call order**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The exception that proves the rule: `use`",
        texto:
          "The `use` API (in recent versions of React) can be called inside conditions and loops, unlike Hooks, but it still only works in components or Hooks. For every other Hook, turn `rules-of-hooks` on as an error in the lint. Check the details on react.dev.",
      },
    ],
    armadilhas: [
      "Calling a Hook after an early `return`: it is the quietest violation. Declare all Hooks before any conditional return.",
      "Putting a Hook inside an `if`, a loop or a callback (`onClick`, `.map`, `setTimeout`): move the condition inside the Hook, or create a child component per item.",
      "Calling a Hook in an ordinary function or a class: only function components and `use…` functions can do it. If a function needs a Hook, make it a custom Hook.",
      "Treating the rule as style: breaking it may work on the first render and only fail later, or swap values silently.",
    ],
    autoteste: [
      {
        pergunta: "Why does the order of Hook calls matter?",
        resposta:
          "Because React identifies each Hook by its position in the render’s list. If the order changes, a `useState` reads another one’s slot and the values misalign.",
      },
      {
        pergunta: "How do you use a Hook “only sometimes”?",
        resposta:
          "Always call it and put the condition inside it (`useEffect(() => { if (x) ... }, [x])`), or move the conditional part into a child component that renders conditionally (`{x && <Child />}`).",
      },
    ],
  },
};
