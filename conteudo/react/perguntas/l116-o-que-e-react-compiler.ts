import type { Pergunta } from "../../tipos";

// L116 · O que é React Compiler
export const l116: Pergunta = {
  numero: 116,
  modulo: "linkedin-compiler",
  metodo: "whys",
  pt: {
    titulo: "O que é React Compiler",
    pergunta: "O que é o React Compiler?",
    porqueEsteMetodo:
      "Um compilador que “otimiza sozinho” soa suspeito até você entender cada porquê: por que memoizar, por que fazer isso à mão dói, por que uma ferramenta de build consegue e por que ela exige código bem comportado. A cadeia de porquês leva à conclusão e aos limites.",
    resposta30s:
      "O **React Compiler** é uma ferramenta que roda **na build**, analisa seus componentes e Hooks e insere **memoização automática** onde ela evita trabalho repetido, para você não precisar escrever `useMemo`, `useCallback` e `React.memo` à mão. Ele funciona porque o React tem regras (componentes e Hooks **puros**, sem mutar props ou estado) e pula o que não consegue provar seguro. O resultado é menos re-renders sem mudar a lógica; ele não conserta algoritmo lento, requisição pesada nem bundle grande.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que existe memoização no React?",
            resposta:
              "Porque, quando um componente renderiza, por padrão seus filhos também renderizam, e a cada renderização funções, objetos e cálculos são recriados. Se nada mudou, isso é trabalho repetido. `useMemo`, `useCallback` e `React.memo` evitam o desperdício reaproveitando resultados entre renderizações (veja L57 e L99).",
          },
          {
            pergunta: "Por que fazê-la à mão é um problema?",
            resposta:
              "Porque você decide o que memoizar e escreve as listas de dependências. Esquecer uma dependência gera valor velho (um bug silencioso); deixar uma prop instável anula o ganho (um `memo` que nunca acerta); e o código se enche de ruído. É trabalho mecânico, fácil de errar e caro de manter, e o efeito só aparece na medição.",
          },
          {
            pergunta: "Por que um compilador consegue fazer isso melhor?",
            resposta:
              "Porque, se o código segue as **regras do React** (componentes e Hooks puros, sem mutar props, estado ou valores já criados, sem efeitos colaterais na renderização), dá para analisar de quais entradas cada valor depende. Com esse grafo, o compilador insere o cache nos pontos certos, com granularidade mais fina que a manual, inclusive em lugares onde um Hook não poderia ser chamado, como depois de um retorno antecipado.",
          },
          {
            pergunta: "Por que ele roda na build, e não no navegador?",
            resposta:
              "Porque a análise é uma transformação do código-fonte: um plugin (Babel, ou a integração do seu framework ou bundler) lê o seu componente e gera outro, equivalente, com a memoização inserida. O navegador recebe o resultado pronto, sem custo de análise e sem você mudar a lógica.",
          },
          {
            pergunta: "Por que ele exige código “bem comportado” e não resolve tudo?",
            resposta:
              "Porque a memoização só é correta se reaproveitar um resultado nunca alterar o comportamento. Quando o compilador não consegue provar isso (mutação, leitura de ref durante a renderização, efeito colateral na renderização), ele **pula** aquele componente em vez de arriscar. E ele só evita **renderização repetida**: não conserta um algoritmo lento, uma requisição pesada nem um bundle grande.",
          },
        ],
        causaRaiz:
          "Memoização manual é trabalho mecânico sobre um grafo de dependências que uma ferramenta consegue inferir, desde que o código siga as regras do React. Por isso o compilador automatiza na build o que você escrevia à mão, e por isso a condição é **código puro**.",
      },
      {
        tipo: "codigo",
        titulo: "A mesma lista, à mão e com o compilador",
        legenda: "JSX",
        codigo: `import { useCallback, useMemo } from "react";

// À mão: você decide o que memoizar e acerta as dependências
function ListaManual({ itens, filtro, aoEscolher }) {
  const visiveis = useMemo(() => itens.filter((i) => i.nome.includes(filtro)), [itens, filtro]);
  const escolher = useCallback((id) => aoEscolher(id), [aoEscolher]);
  return <Tabela linhas={visiveis} aoEscolher={escolher} />;
}

// Com o compilador: você escreve o código simples e puro
function Lista({ itens, filtro, aoEscolher }) {
  const visiveis = itens.filter((i) => i.nome.includes(filtro));
  return <Tabela linhas={visiveis} aoEscolher={(id) => aoEscolher(id)} />;
}`,
        nota: "`Tabela` é ilustrativa. Na segunda versão o compilador reaproveita o filtro e a função enquanto as entradas não mudam; o código continua legível e sem listas de dependências.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que ele exige e o que entrega",
        texto:
          "**Exige** componentes e Hooks puros, regras dos Hooks respeitadas e nada de mutar props ou estado; o ESLint do compilador aponta as violações. **Entrega** menos re-renders sem mudar a lógica, menos código de memoização, menos bugs de dependência esquecida e manutenção mais simples. Ele não mexe no algoritmo: o ganho está nas renderizações repetidas, e você deve medi-lo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Recurso novo e em evolução",
        texto:
          "O compilador é relativamente novo e evolui: instalação, compatibilidade e limitações mudam entre versões. Trate o que está aqui de forma qualitativa e confira react.dev antes de decidir. Veja também L119 (o compilador substitui `useMemo`?) e L122 (como habilitá-lo).",
      },
    ],
    armadilhas: [
      "Achar que o compilador acelera qualquer código: ele evita renderizações repetidas, mas não corrige um cálculo lento em si, uma requisição ou um bundle grande.",
      "Escrever código que viola as regras (mutar props, ler refs na renderização) e esperar otimização: o compilador pula o que não consegue provar seguro, sem barulho.",
      "Remover de uma vez toda a memoização manual do projeto por confiar no compilador: em código existente, remova aos poucos e com medição (veja L119).",
      "Tratar o compilador como mágica e não olhar o resultado: confira no React DevTools quais componentes foram compilados e use o lint.",
    ],
    autoteste: [
      {
        pergunta: "O que é memoização automática?",
        resposta:
          "O compilador analisa o componente, descobre de quais entradas cada valor, função e elemento JSX depende e insere o cache, reaproveitando o resultado quando as entradas não mudaram, sem você escrever `useMemo`, `useCallback` ou `React.memo`.",
      },
      {
        pergunta: "O que acontece com um componente que muta suas props?",
        resposta:
          "O compilador não consegue garantir que reaproveitar o resultado é seguro e normalmente pula esse componente, sem otimizá-lo. O lint do compilador aponta a violação, e a correção é tornar o código puro.",
      },
    ],
  },
  en: {
    titulo: "What React Compiler is",
    pergunta: "What is React Compiler?",
    porqueEsteMetodo:
      "A compiler that “optimizes by itself” sounds suspicious until you understand each why: why memoize, why doing it by hand hurts, why a build tool can do it and why it demands well-behaved code. The chain of whys leads to the conclusion and to the limits.",
    resposta30s:
      "**React Compiler** is a tool that runs **at build time**, analyzes your components and Hooks and inserts **automatic memoization** where it avoids repeated work, so you do not have to write `useMemo`, `useCallback` and `React.memo` by hand. It works because React has rules (**pure** components and Hooks, no mutating props or state) and it skips whatever it cannot prove safe. The result is fewer re-renders without changing the logic; it does not fix a slow algorithm, a heavy request or a large bundle.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does memoization exist in React?",
            resposta:
              "Because when a component renders, by default its children render too, and on every render functions, objects and calculations are recreated. If nothing changed, that is repeated work. `useMemo`, `useCallback` and `React.memo` avoid the waste by reusing results between renders (see L57 and L99).",
          },
          {
            pergunta: "Why is doing it by hand a problem?",
            resposta:
              "Because you decide what to memoize and you write the dependency lists. Forgetting a dependency produces a stale value (a silent bug); leaving a prop unstable cancels the gain (a `memo` that never hits); and the code fills up with noise. It is mechanical work, easy to get wrong and costly to maintain, and the effect only shows up in measurement.",
          },
          {
            pergunta: "Why can a compiler do it better?",
            resposta:
              "Because if the code follows the **rules of React** (pure components and Hooks, no mutating props, state or values already created, no side effects during render), it is possible to analyze which inputs each value depends on. With that graph, the compiler inserts the cache at the right points, with finer granularity than manual code, including places where a Hook could not be called, such as after an early return.",
          },
          {
            pergunta: "Why does it run at build time and not in the browser?",
            resposta:
              "Because the analysis is a source-code transformation: a plugin (Babel, or your framework’s or bundler’s integration) reads your component and generates another, equivalent one, with the memoization inserted. The browser receives the finished result, with no analysis cost and without you changing the logic.",
          },
          {
            pergunta: "Why does it demand “well-behaved” code and not solve everything?",
            resposta:
              "Because memoization is only correct if reusing a result never changes behaviour. When the compiler cannot prove that (mutation, reading a ref during render, a side effect during render), it **skips** that component instead of taking a risk. And it only avoids **repeated rendering**: it does not fix a slow algorithm, a heavy request or a large bundle.",
          },
        ],
        causaRaiz:
          "Manual memoization is mechanical work over a dependency graph that a tool can infer, as long as the code follows the rules of React. That is why the compiler automates at build time what you used to write by hand, and why the condition is **pure code**.",
      },
      {
        tipo: "codigo",
        titulo: "The same list, by hand and with the compiler",
        legenda: "JSX",
        codigo: `import { useCallback, useMemo } from "react";

// By hand: you decide what to memoize and get the dependencies right
function ManualList({ items, filter, onPick }) {
  const visible = useMemo(() => items.filter((i) => i.name.includes(filter)), [items, filter]);
  const pick = useCallback((id) => onPick(id), [onPick]);
  return <Table rows={visible} onPick={pick} />;
}

// With the compiler: you write plain, pure code
function List({ items, filter, onPick }) {
  const visible = items.filter((i) => i.name.includes(filter));
  return <Table rows={visible} onPick={(id) => onPick(id)} />;
}`,
        nota: "`Table` is illustrative. In the second version the compiler reuses the filter result and the function while the inputs do not change; the code stays readable and free of dependency lists.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What it requires and what it delivers",
        texto:
          "It **requires** pure components and Hooks, the Rules of Hooks respected and no mutating props or state; the compiler’s ESLint rules point out violations. It **delivers** fewer re-renders without changing the logic, less memoization code, fewer forgotten-dependency bugs and simpler maintenance. It does not touch the algorithm: the gain is in repeated renders, and you should measure it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A new, evolving feature",
        texto:
          "The compiler is relatively new and evolving: installation, compatibility and limitations change between versions. Treat what is here qualitatively and check react.dev before deciding. See also L119 (does the compiler replace `useMemo`?) and L122 (how to enable it).",
      },
    ],
    armadilhas: [
      "Thinking the compiler speeds up any code: it avoids repeated renders, but does not fix a slow calculation itself, a request or a large bundle.",
      "Writing code that breaks the rules (mutating props, reading refs during render) and expecting optimization: the compiler skips what it cannot prove safe, without any noise.",
      "Removing all manual memoization from the project at once because you trust the compiler: in existing code, remove gradually and with measurement (see L119).",
      "Treating the compiler as magic and not looking at the result: check in React DevTools which components were compiled and use the lint.",
    ],
    autoteste: [
      {
        pergunta: "What is automatic memoization?",
        resposta:
          "The compiler analyzes the component, works out which inputs each value, function and JSX element depends on and inserts the cache, reusing the result when the inputs did not change, without you writing `useMemo`, `useCallback` or `React.memo`.",
      },
      {
        pergunta: "What happens to a component that mutates its props?",
        resposta:
          "The compiler cannot guarantee that reusing the result is safe and normally skips that component without optimizing it. The compiler’s lint flags the violation, and the fix is to make the code pure.",
      },
    ],
  },
};
