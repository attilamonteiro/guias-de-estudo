import type { Pergunta } from "../../tipos";

// S56 · React versus Angular
export const s056: Pergunta = {
  numero: 656,
  modulo: "simplilearn-avancado",
  metodo: "compare",
  pt: {
    titulo: "React versus Angular",
    pergunta: "Como o React é diferente do Angular?",
    porqueEsteMetodo:
      "A diferença está em filosofia (biblioteca contra framework) e se desdobra em vários eixos. Uma matriz lado a lado cobre cada eixo, e a regra de decisão traduz a comparação em escolha para um time real.",
    resposta30s:
      "O **React** é uma **biblioteca** focada na interface (JSX, com JavaScript ou TypeScript): você escolhe roteamento, estado e dados. O **Angular** é um **framework completo e opinativo**, em TypeScript, com templates próprios, injeção de dependência, roteador, formulários e CLI embutidos; o Vue fica no meio, com um núcleo leve e peças oficiais opcionais. Decida por tamanho e padronização do time, flexibilidade desejada e experiência prévia.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os eixos da comparação",
        colunas: ["Aspecto", "React", "Angular", "Vue (para comparar)"],
        linhas: [
          [
            "Natureza",
            "Biblioteca focada na interface; você escolhe o resto",
            "Framework completo e opinativo, com convenções para a aplicação inteira",
            "Framework progressivo: núcleo de interface com peças oficiais opcionais",
          ],
          [
            "Linguagem e componentes",
            "JavaScript ou TypeScript, com JSX; componentes de função e hooks",
            "TypeScript, com classes decoradas e templates HTML próprios",
            "JavaScript ou TypeScript, com arquivos de componente que reúnem template, script e estilo",
          ],
          [
            "Estrutura e injeção de dependência",
            "Sem estrutura imposta; Context e bibliotecas fazem o papel",
            "Estrutura definida e injeção de dependência embutida",
            "Estrutura flexível; `provide` e `inject` para dependências",
          ],
          [
            "Roteamento, formulários e HTTP",
            "Bibliotecas ou framework (React Router, Next.js, React Hook Form, `fetch`)",
            "Roteador, formulários e `HttpClient` oficiais",
            "Roteador e estado oficiais (Vue Router, Pinia), separados do núcleo",
          ],
          [
            "Vinculação de dados",
            "Unidirecional: props descem e eventos sobem",
            "Templates com `[prop]` e `(evento)`, com vinculação bidirecional opcional",
            "Diretivas no template; `v-model` para a vinculação bidirecional",
          ],
          [
            "Detecção de mudanças",
            "O estado muda por setters, o componente renderiza de novo e o React reconcilia a árvore",
            "Mecanismo próprio de detecção de mudanças, evoluindo para uma reatividade baseada em signals",
            "Reatividade com rastreamento de dependências, que atualiza só o que depende do dado",
          ],
          [
            "Curva de aprendizado",
            "Começar é fácil; decidir a arquitetura é a parte difícil",
            "Maior no início (injeção de dependência, RxJS, decorators), com um caminho único",
            "Suave no início",
          ],
          [
            "Ecossistema",
            "O maior e mais descentralizado, com muita escolha",
            "Menor, porém coeso, com ferramentas oficiais (CLI, testes)",
            "Grande e coeso em torno das peças oficiais",
          ],
        ],
        nota: "O Vue entra só para a comparação: fica entre os dois, com núcleo leve e peças oficiais opcionais.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo contador no React",
        legenda: "JSX (React)",
        codigo: `import { useState } from "react";

export function Contador() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`,
      },
      {
        tipo: "codigo",
        titulo: "E no Angular",
        legenda: "TypeScript (Angular)",
        codigo: [
          'import { Component, signal } from "@angular/core";',
          "",
          "@Component({",
          '  selector: "app-contador",',
          "  standalone: true,",
          '  template: `<button (click)="incrementar()">{{ n() }}</button>`,',
          "})",
          "export class ContadorComponent {",
          "  n = signal(0);",
          "  incrementar() {",
          "    this.n.update((v) => v + 1);",
          "  }",
          "}",
        ].join("\n"),
        nota: "No React, uma função com um hook; no Angular, uma classe decorada, com o template ao lado e reatividade por signals. A sintaxe varia conforme a versão: confira angular.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Decida por **tamanho e padronização do time**, **flexibilidade desejada** e **experiência prévia**. Equipe grande ou rotativa, que quer uma convenção única e ferramentas oficiais: Angular. Produto que precisa de flexibilidade, ecossistema amplo e reaproveitamento com o móvel (React Native): React, de preferência com um framework como o Next.js para roteamento e dados. A experiência do time pesa muito: uma equipe produtiva numa das duas tende a render mais do que a escolha “ideal” só no papel.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Compare com justiça, sem “vencedor”",
        texto:
          "O React sozinho é só a camada de visão; para comparar de igual para igual com o Angular, some roteador, camada de dados e, em geral, um framework como o Next.js. Não existe “mais rápido” em geral: o desempenho depende de como o app é escrito. As duas ferramentas evoluem rápido (o Angular com signals e componentes standalone; o React com o Compiler e os Server Components), então confira react.dev e angular.dev. E não confunda o Angular com o AngularJS (a versão 1.x), que é outro produto e foi descontinuado.",
      },
    ],
    armadilhas: [
      "Comparar o React sozinho com o Angular inteiro como se fossem a mesma coisa: o React é biblioteca, e a comparação justa soma roteamento, dados e, em geral, um framework.",
      "Dizer que um é mais rápido sem medir: o desempenho depende de como o app é escrito.",
      "Confundir o Angular atual com o AngularJS (1.x), que é um produto antigo e descontinuado.",
      "Escolher pela moda e ignorar equipe, base de código existente e facilidade de contratar.",
    ],
    autoteste: [
      {
        pergunta: "Por que se diz que o React é biblioteca e o Angular é framework?",
        resposta:
          "O React cuida da camada de interface; roteamento, dados e formulários vêm de outras peças que você escolhe e monta. O Angular já traz tudo isso e define a estrutura da aplicação, inclusive a injeção de dependência. Quem manda no desenho é você, no React, e o framework, no Angular.",
      },
      {
        pergunta: "Em que cenário você escolheria o Angular?",
        resposta:
          "Numa organização grande, com várias equipes e rotatividade, que quer uma convenção única, TypeScript e ferramentas oficiais desde o início. Com a ressalva de que a experiência prévia do time pesa tanto quanto as características técnicas.",
      },
    ],
  },
  en: {
    titulo: "React versus Angular",
    pergunta: "How is React different from Angular?",
    porqueEsteMetodo:
      "The difference lies in philosophy (library versus framework) and unfolds along several axes. A side-by-side matrix covers each axis, and the decision rule turns the comparison into a choice for a real team.",
    resposta30s:
      "**React** is a **library** focused on the interface (JSX, with JavaScript or TypeScript): you choose routing, state and data. **Angular** is a **complete, opinionated framework**, in TypeScript, with its own templates and built-in dependency injection, router, forms and CLI; Vue sits in the middle, with a light core and optional official pieces. Decide by team size and standardization, the flexibility you want and prior experience.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The axes of comparison",
        colunas: ["Aspect", "React", "Angular", "Vue (for comparison)"],
        linhas: [
          [
            "Nature",
            "A library focused on the interface; you choose the rest",
            "A complete, opinionated framework, with conventions for the whole application",
            "A progressive framework: an interface core with optional official pieces",
          ],
          [
            "Language and components",
            "JavaScript or TypeScript, with JSX; function components and hooks",
            "TypeScript, with decorated classes and its own HTML templates",
            "JavaScript or TypeScript, with component files that bring template, script and style together",
          ],
          [
            "Structure and dependency injection",
            "No imposed structure; Context and libraries fill the role",
            "A defined structure and built-in dependency injection",
            "A flexible structure; `provide` and `inject` for dependencies",
          ],
          [
            "Routing, forms and HTTP",
            "Libraries or a framework (React Router, Next.js, React Hook Form, `fetch`)",
            "An official router, forms and `HttpClient`",
            "Official router and state (Vue Router, Pinia), separate from the core",
          ],
          [
            "Data binding",
            "One-way: props go down and events go up",
            "Templates with `[prop]` and `(event)`, with optional two-way binding",
            "Directives in the template; `v-model` for two-way binding",
          ],
          [
            "Change detection",
            "State changes through setters, the component renders again and React reconciles the tree",
            "Its own change-detection mechanism, evolving toward signal-based reactivity",
            "Reactivity with dependency tracking, which updates only what depends on the data",
          ],
          [
            "Learning curve",
            "Starting is easy; deciding the architecture is the hard part",
            "Steeper at first (dependency injection, RxJS, decorators), with a single path",
            "Gentle at first",
          ],
          [
            "Ecosystem",
            "The largest and most decentralized, with plenty of choice",
            "Smaller but cohesive, with official tools (CLI, testing)",
            "Large and cohesive around the official pieces",
          ],
        ],
        nota: "Vue is included only for comparison: it sits between the two, with a light core and optional official pieces.",
      },
      {
        tipo: "codigo",
        titulo: "The same counter in React",
        legenda: "JSX (React)",
        codigo: `import { useState } from "react";

export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`,
      },
      {
        tipo: "codigo",
        titulo: "And in Angular",
        legenda: "TypeScript (Angular)",
        codigo: [
          'import { Component, signal } from "@angular/core";',
          "",
          "@Component({",
          '  selector: "app-counter",',
          "  standalone: true,",
          '  template: `<button (click)="increment()">{{ n() }}</button>`,',
          "})",
          "export class CounterComponent {",
          "  n = signal(0);",
          "  increment() {",
          "    this.n.update((v) => v + 1);",
          "  }",
          "}",
        ].join("\n"),
        nota: "In React, a function with a hook; in Angular, a decorated class, with the template alongside and reactivity through signals. The syntax varies across versions: check angular.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Decide by **team size and standardization**, **the flexibility you want** and **prior experience**. A large or rotating team that wants a single convention and official tooling: Angular. A product that needs flexibility, a wide ecosystem and reuse with mobile (React Native): React, preferably with a framework such as Next.js for routing and data. The team’s experience weighs a lot: a team that is productive in one of the two tends to deliver more than the “ideal” choice on paper.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Compare fairly, with no “winner”",
        texto:
          "React alone is just the view layer; to compare like for like with Angular, add a router, a data layer and, usually, a framework such as Next.js. There is no “faster” in general: performance depends on how the app is written. Both tools evolve quickly (Angular with signals and standalone components; React with the Compiler and Server Components), so check react.dev and angular.dev. And do not confuse Angular with AngularJS (version 1.x), which is a different product and was discontinued.",
      },
    ],
    armadilhas: [
      "Comparing React alone with the whole of Angular as if they were the same thing: React is a library, and a fair comparison adds routing, data and, usually, a framework.",
      "Saying one is faster without measuring: performance depends on how the app is written.",
      "Confusing current Angular with AngularJS (1.x), which is an old, discontinued product.",
      "Choosing by fashion and ignoring the team, the existing codebase and how easy it is to hire.",
    ],
    autoteste: [
      {
        pergunta: "Why is React called a library and Angular a framework?",
        resposta:
          "React takes care of the interface layer; routing, data and forms come from other pieces you choose and assemble. Angular already brings all of that and defines the application’s structure, dependency injection included. You drive the design in React, and the framework does in Angular.",
      },
      {
        pergunta: "In which scenario would you choose Angular?",
        resposta:
          "In a large organization, with several teams and turnover, that wants a single convention, TypeScript and official tooling from the start. With the caveat that the team’s prior experience weighs as much as the technical characteristics.",
      },
    ],
  },
};
