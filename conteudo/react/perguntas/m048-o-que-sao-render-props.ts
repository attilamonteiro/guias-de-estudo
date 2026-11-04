import type { Pergunta } from "../../tipos";

// M48 · O que são render props
export const m048: Pergunta = {
  numero: 748,
  modulo: "medium-avancado",
  metodo: "design",
  pt: {
    titulo: "O que são render props",
    pergunta: "O que são render props?",
    porqueEsteMetodo:
      "Render props é um padrão de reuso, e a melhor forma de entendê-lo é projetá-lo: partir do requisito, ver a restrição que o motiva, desenhar o componente e comparar com as alternativas (hooks e HOCs).",
    resposta30s:
      "**Render prop** é uma técnica em que um componente **recebe uma função que devolve JSX** e a chama para decidir o que desenhar, seja em `children` (“children como função”) ou em uma prop como `render`. O componente guarda o **estado e o comportamento** (posição do mouse, dados remotos) e quem o usa decide a **interface**. Hoje, os **hooks personalizados** resolvem a maioria desses casos com menos aninhamento.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisito",
            texto:
              "Compartilhar um comportamento entre telas, como acompanhar a posição do mouse ou carregar dados, **sem fixar a interface**: cada tela quer mostrar o resultado de um jeito.",
          },
          {
            titulo: "2. Restrição",
            texto:
              "Se o componente desenha o resultado, ele serve a uma tela só. Se só guarda a lógica, ninguém a usa sem copiá-la. É preciso separar **o que calcular** de **o que desenhar**.",
          },
          {
            titulo: "3. Decisão central",
            texto:
              "Inverter o controle: o componente calcula e **chama uma função recebida por prop**, passando o valor; quem o usa devolve o JSX.",
          },
          {
            titulo: "4. Contrato",
            texto:
              "A prop é uma função `(valor) => ReactNode`. Ela pode ser `children` (`<Mouse>{(p) => ...}</Mouse>`) ou `render` (`<Mouse render={(p) => ...} />`). O nome importa menos que a assinatura estar clara e tipada.",
          },
          {
            titulo: "5. Implementação",
            texto:
              "O estado e os efeitos moram no componente, com a limpeza do que ele registra (`removeEventListener`), e a saída é `children(valor)`. Quem consome não sabe como o valor é obtido, só o que ele contém.",
          },
          {
            titulo: "6. Comparação com as alternativas",
            texto:
              "Hooks personalizados e HOCs reaproveitam o mesmo tipo de lógica de outras formas (veja a tabela). Escolha pelo custo de leitura e pelo que o componente precisa controlar.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Render props, hooks personalizados e HOCs",
        colunas: ["Critério", "Render props", "Hook personalizado", "HOC"],
        linhas: [
          [
            "Como reaproveita",
            "Componente que chama uma função recebida",
            "Função `use...` chamada no corpo do componente",
            "Função que recebe um componente e devolve outro",
          ],
          [
            "Onde o resultado aparece",
            "No JSX, como argumento da função recebida",
            "Em variáveis, direto no corpo do componente",
            "Como props injetadas no componente envolvido",
          ],
          [
            "Aninhamento ao combinar vários",
            "Cresce em camadas de JSX",
            "Nenhum: um hook por linha",
            "Cresce em camadas de componentes",
          ],
          [
            "Origem dos dados",
            "Clara: o nome é o que você escreve na função",
            "Clara: o nome é o da variável",
            "Menos clara: as props vêm de fora e os nomes podem colidir",
          ],
          [
            "Quando ainda faz sentido",
            "Quando o componente controla onde e quando o conteúdo é desenhado, ou em componentes de classe",
            "Na maior parte dos casos novos, em componentes de função",
            "Quando é preciso envolver o componente inteiro (veja M07)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um componente que guarda a posição do mouse",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState, type ReactNode } from "react";',
          "",
          "interface Posicao { x: number; y: number }",
          "",
          "export function PosicaoDoMouse({ children }: { children: (p: Posicao) => ReactNode }) {",
          "  const [posicao, setPosicao] = useState<Posicao>({ x: 0, y: 0 });",
          "",
          "  useEffect(() => {",
          "    const mover = (e: MouseEvent) => setPosicao({ x: e.clientX, y: e.clientY });",
          '    window.addEventListener("mousemove", mover);',
          '    return () => window.removeEventListener("mousemove", mover);',
          "  }, []);",
          "",
          "  return <>{children(posicao)}</>;",
          "}",
          "",
          "// uso: quem consome decide a interface",
          "<PosicaoDoMouse>{({ x, y }) => <p>Mouse em {x}, {y}</p>}</PosicaoDoMouse>;",
        ].join("\n"),
        nota: "O componente cuida do estado e da limpeza do listener; cada tela desenha o resultado como quiser.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Em componentes de função, **comece pelo hook**: `const { x, y } = usePosicaoDoMouse()` faz o mesmo sem criar camadas de JSX (veja C21). Use **render props** quando o próprio componente precisa controlar onde e quando o conteúdo é desenhado (por exemplo, uma lista que decide quais itens renderizar e chama a função para cada um), ou quando trabalha com componentes de classe. Use **HOC** para envolver o componente inteiro (veja M07 e S47).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Função inline e memorização",
        texto:
          "Uma função escrita inline na prop é nova a cada renderização do pai. Se o componente que a recebe usa `React.memo` ou é um `PureComponent`, a comparação de props sempre vê mudança e a memorização não evita nada. Estabilize a função com `useCallback` quando isso importar, ou confira o que o React Compiler faz por você em react.dev. Com várias render props combinadas, o código também vira uma pirâmide de funções: aí o hook costuma ser melhor.",
      },
    ],
    armadilhas: [
      "Passar uma função inline a um componente memorizado (`React.memo`): a prop muda a cada renderização e a memorização não adianta.",
      "Aninhar várias render props: a leitura vira uma pirâmide; prefira hooks ou junte o estado em um componente só.",
      "Esquecer a limpeza dos efeitos (`removeEventListener`, timers) dentro do componente que guarda o estado.",
      "Deixar a assinatura da função vaga ou sem tipo: quem usa não sabe o que recebe. Declare `(valor) => ReactNode`.",
    ],
    autoteste: [
      {
        pergunta: "O que é uma render prop?",
        resposta:
          "Uma prop (muitas vezes `children`) cujo valor é uma função que devolve JSX. O componente guarda o comportamento, chama a função com o valor calculado e desenha o que ela devolver.",
      },
      {
        pergunta: "Por que os hooks personalizados substituíram a maioria dos usos de render props?",
        resposta:
          "Porque reaproveitam a mesma lógica sem criar camadas de JSX: `const { x, y } = usePosicaoDoMouse()` evita o aninhamento e deixa o resultado em variáveis comuns.",
      },
    ],
  },
  en: {
    titulo: "What render props are",
    pergunta: "What are render props?",
    porqueEsteMetodo:
      "Render props is a reuse pattern, and the best way to understand it is to design it: start from the requirement, see the constraint behind it, design the component and compare it with the alternatives (hooks and HOCs).",
    resposta30s:
      "A **render prop** is a technique where a component **receives a function that returns JSX** and calls it to decide what to draw, whether through `children` (“children as a function”) or a prop such as `render`. The component keeps the **state and behavior** (mouse position, remote data) and whoever uses it decides the **interface**. Today, **custom hooks** solve most of these cases with less nesting.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The method applied",
        passos: [
          {
            titulo: "1. Requirement",
            texto:
              "Share a behavior between screens, such as tracking the mouse position or loading data, **without fixing the interface**: each screen wants to show the result its own way.",
          },
          {
            titulo: "2. Constraint",
            texto:
              "If the component draws the result, it serves a single screen. If it only keeps the logic, nobody can use it without copying it. You have to separate **what to compute** from **what to draw**.",
          },
          {
            titulo: "3. Central decision",
            texto:
              "Invert the control: the component computes and **calls a function received as a prop**, passing the value; whoever uses it returns the JSX.",
          },
          {
            titulo: "4. Contract",
            texto:
              "The prop is a function `(value) => ReactNode`. It can be `children` (`<Mouse>{(p) => ...}</Mouse>`) or `render` (`<Mouse render={(p) => ...} />`). The name matters less than having a clear, typed signature.",
          },
          {
            titulo: "5. Implementation",
            texto:
              "State and effects live in the component, with cleanup of whatever it registers (`removeEventListener`), and the output is `children(value)`. Whoever consumes it does not know how the value is obtained, only what it contains.",
          },
          {
            titulo: "6. Comparison with the alternatives",
            texto:
              "Custom hooks and HOCs reuse the same kind of logic in other ways (see the table). Choose by reading cost and by what the component needs to control.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Render props, custom hooks and HOCs",
        colunas: ["Criterion", "Render props", "Custom hook", "HOC"],
        linhas: [
          [
            "How it reuses",
            "A component that calls a function it receives",
            "A `use...` function called in the component body",
            "A function that takes a component and returns another",
          ],
          [
            "Where the result shows up",
            "In the JSX, as the argument of the received function",
            "In variables, right in the component body",
            "As props injected into the wrapped component",
          ],
          [
            "Nesting when combining several",
            "Grows in layers of JSX",
            "None: one hook per line",
            "Grows in layers of components",
          ],
          [
            "Where the data comes from",
            "Clear: the name is what you write in the function",
            "Clear: the name is the variable’s",
            "Less clear: props come from outside and names can collide",
          ],
          [
            "When it still makes sense",
            "When the component controls where and when content is drawn, or in class components",
            "In most new cases, in function components",
            "When you need to wrap the whole component (see M07)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A component that keeps the mouse position",
        legenda: "TSX",
        codigo: [
          'import { useEffect, useState, type ReactNode } from "react";',
          "",
          "interface Position { x: number; y: number }",
          "",
          "export function MousePosition({ children }: { children: (p: Position) => ReactNode }) {",
          "  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });",
          "",
          "  useEffect(() => {",
          "    const move = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });",
          '    window.addEventListener("mousemove", move);',
          '    return () => window.removeEventListener("mousemove", move);',
          "  }, []);",
          "",
          "  return <>{children(position)}</>;",
          "}",
          "",
          "// usage: whoever consumes it decides the interface",
          "<MousePosition>{({ x, y }) => <p>Mouse at {x}, {y}</p>}</MousePosition>;",
        ].join("\n"),
        nota: "The component handles the state and the listener cleanup; each screen draws the result however it likes.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "In function components, **start with the hook**: `const { x, y } = useMousePosition()` does the same without creating layers of JSX (see C21). Use **render props** when the component itself needs to control where and when content is drawn (for example, a list that decides which items to render and calls the function for each one), or when you work with class components. Use a **HOC** to wrap the whole component (see M07 and S47).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Inline functions and memoization",
        texto:
          "A function written inline in the prop is new on every render of the parent. If the component receiving it uses `React.memo` or is a `PureComponent`, the props comparison always sees a change and memoization prevents nothing. Stabilize the function with `useCallback` when it matters, or check on react.dev what the React Compiler does for you. With several render props combined, the code also becomes a pyramid of functions: that is where a hook is usually better.",
      },
    ],
    armadilhas: [
      "Passing an inline function to a memoized component (`React.memo`): the prop changes on every render and memoization does not help.",
      "Nesting several render props: reading turns into a pyramid; prefer hooks or gather the state in a single component.",
      "Forgetting to clean up effects (`removeEventListener`, timers) inside the component that keeps the state.",
      "Leaving the function signature vague or untyped: whoever uses it does not know what it receives. Declare `(value) => ReactNode`.",
    ],
    autoteste: [
      {
        pergunta: "What is a render prop?",
        resposta:
          "A prop (often `children`) whose value is a function that returns JSX. The component keeps the behavior, calls the function with the computed value and draws whatever it returns.",
      },
      {
        pergunta: "Why did custom hooks replace most uses of render props?",
        resposta:
          "Because they reuse the same logic without creating layers of JSX: `const { x, y } = useMousePosition()` avoids nesting and leaves the result in ordinary variables.",
      },
    ],
  },
};
