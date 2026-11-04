import type { Pergunta } from "../../tipos";

// L119 · Compiler substitui o useMemo?
export const l119: Pergunta = {
  numero: 119,
  modulo: "linkedin-compiler",
  metodo: "compare",
  pt: {
    titulo: "Compiler substitui o useMemo?",
    pergunta: "O React Compiler substitui o useMemo()?",
    porqueEsteMetodo:
      "A pergunta pede uma comparação direta: o que a memoização manual faz, o que o compilador faz no lugar e o que ainda sobra para a mão. A matriz mostra onde cada um brilha, e a regra diz o que fazer com código novo e com código que já existe.",
    resposta30s:
      "**Em grande parte sim, mas não por completo.** O compilador cobre boa parte do que `useMemo`, `useCallback` e `React.memo` faziam, então em código novo você pode escrever o simples e medir. Eles continuam úteis como **escape**: controlar dependências de efeitos, garantir identidade estável quando você precisa dela e em código que o compilador não consegue otimizar; e o **código existente pode ser mantido**. Confira react.dev para o estado atual.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Memoização manual versus compilador",
        colunas: ["Aspecto", "À mão (`useMemo`, `useCallback`, `React.memo`)", "React Compiler"],
        linhas: [
          [
            "Quem decide o que memoizar",
            "Você, caso a caso",
            "A ferramenta, na build, analisando o componente inteiro",
          ],
          [
            "Valores calculados (`useMemo`)",
            "Guarda um resultado e recalcula quando as dependências mudam",
            "Memoiza cálculos e valores intermediários automaticamente, pelo fluxo de dados real",
          ],
          [
            "Funções (`useCallback`)",
            "Mantém a mesma função entre renderizações, para filhos memoizados e dependências de efeitos",
            "Reaproveita as funções criadas no componente enquanto as entradas não mudam",
          ],
          [
            "Componentes (`React.memo`)",
            "Pula a renderização do filho se as props forem iguais",
            "Reaproveita o JSX do filho quando as entradas não mudaram, o que cobre boa parte dos usos do `memo`; um comparador personalizado continua sendo seu",
          ],
          [
            "Risco de erro",
            "Dependência esquecida gera valor velho; prop instável anula o ganho",
            "Pula o componente que viola as regras do React em vez de arriscar; o lint avisa",
          ],
          [
            "Controle fino",
            "Total",
            "Limitado: você ainda usa os Hooks como escape ou desliga o compilador por componente (diretiva `use no memo`)",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Como decidir, no código novo e no existente",
        passos: [
          {
            titulo: "Código novo: escreva simples",
            texto:
              "Componentes puros, sem `useMemo` e `useCallback` por reflexo. Meça com o Profiler e acrescente memoização manual só onde houver um problema real que o compilador não resolveu.",
          },
          {
            titulo: "Código existente: mantenha",
            texto:
              "Não é preciso apagar o que já funciona. Remover memoização em massa pode mudar o que o compilador gera e, em especial, quando os efeitos disparam. Se quiser limpar, faça aos poucos, com testes e medição.",
          },
          {
            titulo: "Onde a memoização manual segue útil",
            texto:
              "(a) Um valor ou função que é dependência de `useEffect` e **não pode** mudar de identidade sem necessidade, para o efeito não disparar à toa. (b) Um trecho que o compilador não otimiza (componente que viola as regras, ou marcado com `use no memo`). (c) `memo` com comparador personalizado. (d) Valores passados a código que não é compilado (bibliotecas ou componentes de fora do projeto) e que pode depender da identidade.",
          },
          {
            titulo: "Valide",
            texto:
              "Ative o lint do compilador, confira no React DevTools quais componentes foram compilados e compare o Profiler antes e depois.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Código novo**: escreva sem memoização manual e meça. **Código existente**: deixe como está, a menos que você tenha medido e testado a remoção. **Em qualquer código**: use `useMemo` e `useCallback` como escape quando precisar de identidade estável (principalmente em dependências de efeitos) e `memo` quando quiser um comparador próprio ou o componente não passar pelo compilador.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é “apague tudo”",
        texto:
          "O compilador depende de código que siga as regras do React: componentes que as violam são pulados e, sem a memoização manual, ficariam sem nenhuma. Além disso, é um recurso em evolução; a recomendação oficial sobre manter ou remover memoização está em react.dev e pode mudar. Veja L116 para o que o compilador faz e L122 para habilitá-lo.",
      },
    ],
    armadilhas: [
      "Apagar todos os `useMemo` e `useCallback` do projeto ao ligar o compilador: o que dependia de identidade estável (efeitos) pode passar a disparar à toa.",
      "Esperar que o compilador conserte um cálculo caro ou um componente que viola as regras: ele só evita trabalho repetido em código que consegue analisar.",
      "Esquecer que um `memo` com comparador personalizado, ou um componente usado por código que não é compilado, continua sendo decisão sua.",
      "Continuar espalhando memoização por reflexo em código novo: gera ruído e dependências para manter, sem ganho medido.",
    ],
    autoteste: [
      {
        pergunta: "Por que ainda se usa `useCallback` com o compilador ligado?",
        resposta:
          "Como escape: quando uma função é dependência de um efeito e não pode mudar de identidade sem necessidade, ou quando passa por código que o compilador não otimiza. Na maior parte dos outros casos, ele já estabiliza a função.",
      },
      {
        pergunta: "Qual é a regra para código novo e para código existente?",
        resposta:
          "Código novo: escreva simples e meça. Código existente: mantenha a memoização manual e só a remova aos poucos, com testes e medição.",
      },
    ],
  },
  en: {
    titulo: "Compiler versus useMemo",
    pergunta: "Does React Compiler replace useMemo()?",
    porqueEsteMetodo:
      "The question asks for a direct comparison: what manual memoization does, what the compiler does in its place and what is still left for you. The matrix shows where each shines, and the rule says what to do with new code and with code that already exists.",
    resposta30s:
      "**Largely yes, but not completely.** The compiler covers much of what `useMemo`, `useCallback` and `React.memo` used to do, so in new code you can write the simple version and measure. They remain useful as an **escape hatch**: controlling effect dependencies, guaranteeing a stable identity when you need one, and in code the compiler cannot optimize; and **existing code can stay as it is**. Check react.dev for the current state.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Manual memoization versus the compiler",
        colunas: ["Aspect", "By hand (`useMemo`, `useCallback`, `React.memo`)", "React Compiler"],
        linhas: [
          [
            "Who decides what to memoize",
            "You, case by case",
            "The tool, at build time, analyzing the whole component",
          ],
          [
            "Computed values (`useMemo`)",
            "Stores a result and recomputes it when the dependencies change",
            "Memoizes calculations and intermediate values automatically, from the real data flow",
          ],
          [
            "Functions (`useCallback`)",
            "Keeps the same function between renders, for memoized children and effect dependencies",
            "Reuses functions created in the component while the inputs do not change",
          ],
          [
            "Components (`React.memo`)",
            "Skips rendering the child if the props are equal",
            "Reuses the child’s JSX when the inputs did not change, which covers much of what `memo` was used for; a custom comparator is still up to you",
          ],
          [
            "Risk of error",
            "A forgotten dependency gives a stale value; an unstable prop cancels the gain",
            "Skips a component that breaks the rules of React instead of taking a risk; the lint warns you",
          ],
          [
            "Fine control",
            "Total",
            "Limited: you still use the Hooks as an escape hatch or turn the compiler off per component (the `use no memo` directive)",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "How to decide, for new and existing code",
        passos: [
          {
            titulo: "New code: write it simple",
            texto:
              "Pure components, with no `useMemo` and `useCallback` by reflex. Measure with the Profiler and add manual memoization only where there is a real problem the compiler did not solve.",
          },
          {
            titulo: "Existing code: keep it",
            texto:
              "There is no need to delete what already works. Removing memoization in bulk can change what the compiler generates and, in particular, when effects fire. If you want to clean up, do it gradually, with tests and measurement.",
          },
          {
            titulo: "Where manual memoization is still useful",
            texto:
              "(a) A value or function that is a `useEffect` dependency and **must not** change identity needlessly, so the effect does not fire for nothing. (b) A spot the compiler does not optimize (a component that breaks the rules, or one marked `use no memo`). (c) `memo` with a custom comparator. (d) Values passed to code that is not compiled (libraries or components from outside the project) and that may depend on identity.",
          },
          {
            titulo: "Validate",
            texto:
              "Turn on the compiler’s lint, check in React DevTools which components were compiled and compare the Profiler before and after.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**New code**: write it without manual memoization and measure. **Existing code**: leave it as it is, unless you have measured and tested the removal. **In any code**: use `useMemo` and `useCallback` as an escape hatch when you need a stable identity (mainly in effect dependencies) and `memo` when you want your own comparator or the component does not go through the compiler.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "It is not “delete everything”",
        texto:
          "The compiler depends on code that follows the rules of React: components that break them are skipped and, without manual memoization, would end up with none at all. It is also an evolving feature; the official guidance on keeping or removing memoization is on react.dev and may change. See L116 for what the compiler does and L122 for how to enable it.",
      },
    ],
    armadilhas: [
      "Deleting every `useMemo` and `useCallback` in the project when you turn the compiler on: whatever depended on a stable identity (effects) may start firing for nothing.",
      "Expecting the compiler to fix an expensive calculation or a component that breaks the rules: it only avoids repeated work in code it can analyze.",
      "Forgetting that a `memo` with a custom comparator, or a component used by code that is not compiled, is still your decision.",
      "Continuing to sprinkle memoization by reflex in new code: it adds noise and dependencies to maintain, with no measured gain.",
    ],
    autoteste: [
      {
        pergunta: "Why is `useCallback` still used with the compiler on?",
        resposta:
          "As an escape hatch: when a function is an effect dependency and must not change identity needlessly, or when it goes through code the compiler does not optimize. In most other cases, the compiler already stabilizes the function.",
      },
      {
        pergunta: "What is the rule for new code and for existing code?",
        resposta:
          "New code: write it simple and measure. Existing code: keep the manual memoization and only remove it gradually, with tests and measurement.",
      },
    ],
  },
};
