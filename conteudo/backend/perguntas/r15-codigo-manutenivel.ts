import type { Pergunta } from "../../tipos";

// R15 · Código manutenível
export const r15: Pergunta = {
  numero: 115,
  modulo: "roadmap-iniciante",
  metodo: "whys",
  pt: {
    titulo: "Código manutenível",
    pergunta: "Como você garante que seu código de backend seja fácil de manter e entender?",
    porqueEsteMetodo:
      "Cada prática de manutenibilidade responde a um custo concreto. A cadeia de porquês liga cada hábito (nomes, módulos, testes, refatoração) ao problema que ele evita.",
    resposta30s:
      "Código manutenível é aquele cuja **próxima mudança é barata e segura**. Para isso: **nomes e funções claros**, **módulos coesos e pouco acoplados**, **testes automatizados**, **refatoração contínua**, **padrões automatizados** (linter, formatador, revisão de código) e **comentários que explicam o porquê**, não o que o código já diz. Tratamento de erros consistente também conta.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que manutenibilidade importa?",
            resposta:
              "Porque o código é lido e alterado muito mais vezes do que é escrito: o custo real está em mudá-lo com segurança.",
          },
          {
            pergunta: "Por que nomes e estrutura claros?",
            resposta:
              "Porque quem lê precisa entender a intenção sem decifrar a implementação. **Nomes que revelam intenção** e funções pequenas com uma responsabilidade reduzem o esforço de leitura.",
          },
          {
            pergunta: "Por que módulos coesos e pouco acoplados?",
            resposta:
              "Porque uma mudança deve ficar num lugar só. **Modularidade** isola o impacto e permite alterar uma parte sem quebrar outras.",
          },
          {
            pergunta: "Por que testes automatizados?",
            resposta:
              "Porque ninguém muda com segurança o que não consegue verificar. Os **testes** dão coragem para refatorar.",
          },
          {
            pergunta: "Por que refatorar com frequência e padronizar?",
            resposta:
              "Porque a dívida técnica cresce com juros. **Refatoração contínua**, linters, formatadores e revisão de código mantêm o padrão e evitam o acúmulo.",
          },
        ],
        causaRaiz:
          "Código manutenível é **legível, modular, testado e consistente**, de modo que a próxima mudança seja barata e segura.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Comentários",
        texto:
          "Comente o **porquê** (decisão, restrição, armadilha) e deixe o **o quê** para o próprio código. Padronize também as mensagens e o tratamento de erros em toda a plataforma.",
      },
    ],
    armadilhas: [
      "Comentar o óbvio e deixar o “porquê” sem registro.",
      "Abstrações prematuras: complexidade sem necessidade.",
      "Refatorar sem testes.",
      "Regras de estilo sem automação (linter e formatador).",
    ],
    autoteste: [
      {
        pergunta: "O que um comentário deve explicar?",
        resposta: "A razão da decisão (o porquê), sem repetir o que o código já mostra.",
      },
      {
        pergunta: "Que prática dá segurança para refatorar?",
        resposta: "Testes automatizados.",
      },
    ],
  },
  en: {
    titulo: "Maintainable code",
    pergunta: "How do you ensure your backend code is maintainable and easy to understand?",
    porqueEsteMetodo:
      "Each maintainability practice answers a concrete cost. The chain of whys ties each habit (names, modules, tests, refactoring) to the problem it prevents.",
    resposta30s:
      "Maintainable code is code whose **next change is cheap and safe**. For that: **clear names and functions**, **cohesive, loosely coupled modules**, **automated tests**, **continuous refactoring**, **automated standards** (linter, formatter, code review) and **comments that explain why**, not what the code already says. Consistent error handling counts too.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does maintainability matter?",
            resposta:
              "Because code is read and changed far more often than it is written: the real cost is changing it safely.",
          },
          {
            pergunta: "Why clear names and structure?",
            resposta:
              "Because the reader must grasp intent without decoding the implementation. **Intention-revealing names** and small single-purpose functions cut reading effort.",
          },
          {
            pergunta: "Why cohesive, loosely coupled modules?",
            resposta:
              "Because a change should stay in one place. **Modularity** isolates impact and lets you alter one part without breaking others.",
          },
          {
            pergunta: "Why automated tests?",
            resposta: "Because nobody safely changes what they cannot verify. **Tests** give the courage to refactor.",
          },
          {
            pergunta: "Why refactor often and standardize?",
            resposta:
              "Because technical debt accrues interest. **Continuous refactoring**, linters, formatters and code review keep the standard and prevent buildup.",
          },
        ],
        causaRaiz:
          "Maintainable code is **readable, modular, tested and consistent**, so the next change is cheap and safe.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Comments",
        texto:
          "Comment the **why** (decision, constraint, trap) and leave the **what** to the code itself. Also standardize messages and error handling across the platform.",
      },
    ],
    armadilhas: [
      "Commenting the obvious and leaving the “why” unrecorded.",
      "Premature abstractions: complexity without need.",
      "Refactoring without tests.",
      "Style rules without automation (linter and formatter).",
    ],
    autoteste: [
      {
        pergunta: "What should a comment explain?",
        resposta: "The reason for the decision (the why), without repeating what the code already shows.",
      },
      {
        pergunta: "Which practice gives safety to refactor?",
        resposta: "Automated tests.",
      },
    ],
  },
};
