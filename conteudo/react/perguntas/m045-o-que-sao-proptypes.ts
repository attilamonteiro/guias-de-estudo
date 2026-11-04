import type { Pergunta } from "../../tipos";

// M45 · O que são propTypes
export const m045: Pergunta = {
  numero: 745,
  modulo: "medium-avancado",
  metodo: "whys",
  pt: {
    titulo: "O que são propTypes",
    pergunta: "O que é propTypes no React?",
    porqueEsteMetodo:
      "O `propTypes` existe por uma sequência de necessidades, e entender a sequência explica tanto o que ele faz quanto por que quase ninguém o usa hoje. A cadeia de “por quês” leva do JavaScript sem tipos até o TypeScript.",
    resposta30s:
      "`propTypes` é um recurso (do pacote `prop-types`) que **valida as props de um componente em tempo de execução**, só em **desenvolvimento**, avisando no console quando um tipo está errado ou falta uma prop obrigatória (`isRequired`), já que o JavaScript não tem tipos. O ecossistema migrou para o **TypeScript**, que verifica antes de rodar e sem custo em execução, e nas versões mais recentes do React a checagem de `propTypes` deixou de ser executada (confira react.dev).",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o React precisou de um jeito de validar props?",
            resposta:
              "Porque o JavaScript não tem tipos: nada impede passar uma string onde o componente espera um número, ou esquecer uma prop obrigatória. O erro só aparece como um comportamento estranho (um `NaN`, um `undefined` na tela), longe da causa.",
          },
          {
            pergunta: "Por que validar em tempo de execução?",
            resposta:
              "Era o que existia: sem compilador de tipos, o único momento em que se conhece o valor real é quando o código roda. Ao declarar `Componente.propTypes = { ... }`, o React confere as props na renderização contra o que foi declarado.",
          },
          {
            pergunta: "Por que só em desenvolvimento, e só com avisos?",
            resposta:
              "A conferência custa processamento a cada renderização, então fica de fora do build de produção. E ela apenas avisa no console, sem quebrar a aplicação, e só quando aquele caminho de código roda de fato com a prop errada.",
          },
          {
            pergunta: "Por que o ecossistema migrou para o TypeScript?",
            resposta:
              "O TypeScript verifica as props antes de rodar, no editor e no build, em todos os usos do componente (não só nos que você executou), sem custo em produção e com autocompletar e refatoração segura de brinde. Os tipos viram também a documentação (veja S88).",
          },
          {
            pergunta: "Por que o propTypes ainda aparece por aí?",
            resposta:
              "Código legado e bibliotecas antigas ainda o declaram, e o pacote `prop-types` continua existindo. Mas nas versões mais recentes do React a checagem foi retirada, e `defaultProps` deixou de valer em componentes de função: o caminho atual é TypeScript e valores padrão nos parâmetros.",
          },
        ],
        causaRaiz:
          "O JavaScript não declara o contrato de um componente. O `propTypes` verifica o contrato em execução, só em desenvolvimento; o TypeScript o verifica antes de rodar.",
      },
      {
        tipo: "tabela",
        titulo: "Os validadores mais comuns",
        colunas: ["Validador", "O que valida", "Exemplo"],
        linhas: [
          ["`string`, `number`, `bool`, `func`", "Tipos primitivos e funções", "`PropTypes.number`"],
          ["`node` e `element`", "Qualquer coisa renderizável; um elemento React", "`PropTypes.node`"],
          ["`arrayOf` e `objectOf`", "Lista ou mapa de um tipo", "`PropTypes.arrayOf(PropTypes.number)`"],
          ["`shape`", "Objeto com campos de tipos conhecidos", "`PropTypes.shape({ id: PropTypes.number })`"],
          [
            "`oneOf` e `oneOfType`",
            "Um valor de uma lista; um entre vários tipos",
            '`PropTypes.oneOf(["p", "m", "g"])`',
          ],
          ["`isRequired`", "A prop é obrigatória", "`PropTypes.string.isRequired`"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O jeito antigo: propTypes e defaultProps",
        legenda: "JSX",
        codigo: [
          'import PropTypes from "prop-types";',
          "",
          "function Cartao({ titulo, preco, tamanho }) {",
          "  return <h2 className={tamanho}>{titulo}: {preco}</h2>;",
          "}",
          "",
          "Cartao.propTypes = {",
          "  titulo: PropTypes.string.isRequired, // obrigatória",
          "  preco: PropTypes.number,",
          '  tamanho: PropTypes.oneOf(["p", "m", "g"]),',
          "};",
          "",
          "Cartao.defaultProps = { preco: 0 }; // legado em componentes de função",
        ].join("\n"),
        nota: 'Com `<Cartao preco="10" />` o console avisa, em desenvolvimento, que `titulo` falta e que `preco` deveria ser número.',
      },
      {
        tipo: "codigo",
        titulo: "O jeito atual: TypeScript e valores padrão",
        legenda: "TSX",
        codigo: [
          "interface CartaoProps {",
          "  titulo: string; // obrigatória",
          "  preco?: number; // opcional",
          '  tamanho?: "p" | "m" | "g";',
          "}",
          "",
          'function Cartao({ titulo, preco = 0, tamanho = "m" }: CartaoProps) {',
          "  return <h2 className={tamanho}>{titulo}: {preco}</h2>;",
          "}",
          "",
          '// <Cartao preco="10" /> não compila: falta `titulo` e `preco` não é number',
        ].join("\n"),
        nota: "O erro aparece no editor e no build, antes de a aplicação rodar, e o valor padrão vem do parâmetro, sem `defaultProps`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Situação atual do propTypes",
        texto:
          "Nas versões mais recentes do React, a checagem de `propTypes` não é mais executada, e `defaultProps` deixou de valer em componentes de função (os de classe ainda o aceitam). Declarar `propTypes` em código novo não protege nada. Prefira TypeScript; em JavaScript, tipos em JSDoc com `// @ts-check`. Como os tipos somem na compilação, dados externos, como respostas de API, ainda pedem validação em execução. Confira react.dev e o guia de atualização do React.",
      },
    ],
    armadilhas: [
      "Achar que o `propTypes` protege a produção: ele roda só em desenvolvimento, e nas versões recentes do React nem isso.",
      "Tratar o `propTypes` como validação de dados ou de segurança: ele só avisa, não bloqueia nem converte nada.",
      "Declarar `propTypes` em alguns componentes e supor que tudo está coberto: ele só confere o que foi declarado, e só quando o componente renderiza.",
      "Manter `defaultProps` em componentes de função novos: use valores padrão nos parâmetros (`{ preco = 0 }`).",
    ],
    autoteste: [
      {
        pergunta: "O que o `propTypes` faz e quando ele roda?",
        resposta:
          "Valida as props de um componente em tempo de execução contra os tipos declarados e avisa no console quando algo não confere. Roda só em desenvolvimento.",
      },
      {
        pergunta: "Por que o TypeScript tomou o lugar do `propTypes`?",
        resposta:
          "Porque verifica antes de rodar, em todos os usos do componente, sem custo em produção e com autocompletar. Como os tipos somem na compilação, dados externos ainda pedem validação em execução.",
      },
    ],
  },
  en: {
    titulo: "What propTypes are",
    pergunta: "What is propTypes in React?",
    porqueEsteMetodo:
      "`propTypes` exists because of a sequence of needs, and understanding the sequence explains both what it does and why almost nobody uses it today. The chain of “whys” leads from untyped JavaScript to TypeScript.",
    resposta30s:
      "`propTypes` is a feature (from the `prop-types` package) that **validates a component’s props at run time**, only in **development**, warning in the console when a type is wrong or a required prop (`isRequired`) is missing, since JavaScript has no types. The ecosystem moved to **TypeScript**, which checks before running and at no run-time cost, and in the most recent React versions the `propTypes` check is no longer executed (check react.dev).",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why did React need a way to validate props?",
            resposta:
              "Because JavaScript has no types: nothing stops you from passing a string where the component expects a number, or from forgetting a required prop. The error only shows up as odd behavior (a `NaN`, an `undefined` on screen), far from the cause.",
          },
          {
            pergunta: "Why validate at run time?",
            resposta:
              "It was what existed: without a type compiler, the only moment the real value is known is when the code runs. By declaring `Component.propTypes = { ... }`, React checks the props during rendering against what was declared.",
          },
          {
            pergunta: "Why only in development, and only with warnings?",
            resposta:
              "The check costs processing on every render, so it is left out of the production build. And it only warns in the console, without breaking the application, and only when that code path actually runs with the wrong prop.",
          },
          {
            pergunta: "Why did the ecosystem move to TypeScript?",
            resposta:
              "TypeScript checks props before running, in the editor and the build, at every use of the component (not just the ones you ran), with no production cost and with autocomplete and safe refactoring as a bonus. The types also become the documentation (see S88).",
          },
          {
            pergunta: "Why does propTypes still show up?",
            resposta:
              "Legacy code and old libraries still declare it, and the `prop-types` package still exists. But in the most recent React versions the check was removed, and `defaultProps` stopped working on function components: the current path is TypeScript and default values in the parameters.",
          },
        ],
        causaRaiz:
          "JavaScript does not declare a component’s contract. `propTypes` checks the contract at run time, only in development; TypeScript checks it before running.",
      },
      {
        tipo: "tabela",
        titulo: "The most common validators",
        colunas: ["Validator", "What it validates", "Example"],
        linhas: [
          ["`string`, `number`, `bool`, `func`", "Primitive types and functions", "`PropTypes.number`"],
          ["`node` and `element`", "Anything renderable; a React element", "`PropTypes.node`"],
          ["`arrayOf` and `objectOf`", "A list or a map of one type", "`PropTypes.arrayOf(PropTypes.number)`"],
          ["`shape`", "An object with fields of known types", "`PropTypes.shape({ id: PropTypes.number })`"],
          [
            "`oneOf` and `oneOfType`",
            "One value from a list; one of several types",
            '`PropTypes.oneOf(["s", "m", "l"])`',
          ],
          ["`isRequired`", "The prop is mandatory", "`PropTypes.string.isRequired`"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The old way: propTypes and defaultProps",
        legenda: "JSX",
        codigo: [
          'import PropTypes from "prop-types";',
          "",
          "function Card({ title, price, size }) {",
          "  return <h2 className={size}>{title}: {price}</h2>;",
          "}",
          "",
          "Card.propTypes = {",
          "  title: PropTypes.string.isRequired, // mandatory",
          "  price: PropTypes.number,",
          '  size: PropTypes.oneOf(["s", "m", "l"]),',
          "};",
          "",
          "Card.defaultProps = { price: 0 }; // legacy on function components",
        ].join("\n"),
        nota: 'With `<Card price="10" />` the console warns, in development, that `title` is missing and that `price` should be a number.',
      },
      {
        tipo: "codigo",
        titulo: "The current way: TypeScript and default values",
        legenda: "TSX",
        codigo: [
          "interface CardProps {",
          "  title: string; // mandatory",
          "  price?: number; // optional",
          '  size?: "s" | "m" | "l";',
          "}",
          "",
          'function Card({ title, price = 0, size = "m" }: CardProps) {',
          "  return <h2 className={size}>{title}: {price}</h2>;",
          "}",
          "",
          '// <Card price="10" /> does not compile: `title` is missing and `price` is not a number',
        ].join("\n"),
        nota: "The error shows up in the editor and the build, before the application runs, and the default value comes from the parameter, with no `defaultProps`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where propTypes stands today",
        texto:
          "In the most recent React versions, the `propTypes` check is no longer executed, and `defaultProps` stopped working on function components (class components still accept it). Declaring `propTypes` in new code protects nothing. Prefer TypeScript; in JavaScript, types in JSDoc with `// @ts-check`. Since types are erased at compile time, external data such as API responses still needs run-time validation. Check react.dev and React’s upgrade guide.",
      },
    ],
    armadilhas: [
      "Thinking `propTypes` protects production: it runs only in development, and in recent React versions not even that.",
      "Treating `propTypes` as data or security validation: it only warns, it does not block or convert anything.",
      "Declaring `propTypes` on some components and assuming everything is covered: it only checks what was declared, and only when the component renders.",
      "Keeping `defaultProps` on new function components: use default values in the parameters (`{ price = 0 }`).",
    ],
    autoteste: [
      {
        pergunta: "What does `propTypes` do and when does it run?",
        resposta:
          "It validates a component’s props at run time against the declared types and warns in the console when something does not match. It runs only in development.",
      },
      {
        pergunta: "Why did TypeScript take the place of `propTypes`?",
        resposta:
          "Because it checks before running, at every use of the component, with no production cost and with autocomplete. Since types are erased at compile time, external data still needs run-time validation.",
      },
    ],
  },
};
