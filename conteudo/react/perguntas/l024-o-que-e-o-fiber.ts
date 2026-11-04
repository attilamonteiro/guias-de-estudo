import type { Pergunta } from "../../tipos";

// L24 · O que é o Fiber
export const l024: Pergunta = {
  numero: 24,
  modulo: "linkedin-renderizacao",
  metodo: "whys",
  pt: {
    titulo: "O que é o Fiber",
    pergunta: "O que é a arquitetura React Fiber?",
    porqueEsteMetodo:
      "O Fiber costuma ser explicado como um conjunto de estruturas internas, o que se decora e não se entende. Perguntar “por quê?” em cadeia parte do problema real (a thread principal travada) e chega à ideia central: transformar o percurso da renderização em dados que podem ser pausados.",
    resposta30s:
      "O **Fiber** é a reescrita do motor interno do React, que representa o trabalho de renderização como uma **árvore ligada de unidades de trabalho**, uma por componente. O motor antigo percorria a árvore por recursão, sem poder parar, e uma árvore grande bloqueava a thread principal; com o Fiber o React pode **pausar, retomar, priorizar e descartar** trabalho. É o alicerce dos recursos concorrentes (transições, Suspense), mas não é uma API que você usa diretamente.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o React precisou de um motor novo?",
            resposta:
              "Porque o reconciliador antigo percorria a árvore com **recursão comum**, usando a pilha de chamadas do JavaScript. Uma vez iniciada, a atualização ia até o fim sem ceder o controle. Como a thread principal também trata cliques, digitação e animações, uma árvore grande deixava a página sem responder durante a renderização.",
          },
          {
            pergunta: "Por que a recursão impede de pausar?",
            resposta:
              "Porque o “onde estou e o que falta fazer” vive na **pilha de chamadas**, que o código não consegue guardar para continuar depois. Só existem duas saídas: deixar terminar ou abortar tudo e perder o progresso.",
          },
          {
            pergunta: "O que o Fiber muda?",
            resposta:
              "Torna o percurso um **dado explícito**. Cada componente (e cada elemento do DOM) tem uma “fibra”: um objeto numa árvore ligada, com referências para o pai, o primeiro filho e o irmão, e com o que o React precisa saber sobre ele (tipo, props, state, efeitos pendentes). Percorrer a árvore vira um laço sobre referências, e o “onde parei” é só um ponteiro que pode ser guardado.",
          },
          {
            pergunta: "O que se ganha com isso?",
            resposta:
              "Como o trabalho está dividido em unidades pequenas, o React pode **devolver o controle ao navegador** entre elas, dar **prioridade** a uma atualização urgente (digitar) sobre uma adiável (filtrar uma lista), **descartar** uma renderização que ficou obsoleta e recomeçar, e reaproveitar trabalho já feito. Isso sustenta transições, Suspense e `useDeferredValue`.",
          },
          {
            pergunta: "O que o Fiber não muda?",
            resposta:
              "O **modelo de quem escreve componentes**: continua sendo função, props, state e hooks, e o Fiber não deixa o código mais rápido por si só. Também não torna tudo interrompível: a fase de **render** (calcular o que mudou) pode ser pausada, mas o **commit**, que aplica as mudanças ao DOM, roda de uma vez, para a tela nunca ficar pela metade. Por isso os componentes precisam ser **puros** (veja L28).",
          },
        ],
        causaRaiz:
          "Para interromper um trabalho é preciso guardar o seu progresso. O Fiber tira o estado do percurso da pilha de chamadas e o transforma em **dados** (uma árvore ligada de unidades de trabalho), e é isso que torna possível pausar, priorizar e descartar.",
      },
      {
        tipo: "tabela",
        titulo: "Antes e depois, em alto nível",
        colunas: ["Aspecto", "Motor antigo (recursivo)", "Com o Fiber"],
        linhas: [
          [
            "Como percorre a árvore",
            "Recursão na pilha de chamadas do JavaScript",
            "Laço sobre uma árvore ligada de unidades de trabalho",
          ],
          ["Pode pausar no meio?", "Não: vai até o fim", "Sim, na fase de render"],
          ["Prioridade das atualizações", "Todas tratadas do mesmo jeito", "As urgentes passam à frente das adiáveis"],
          ["Trabalho que ficou obsoleto", "Termina mesmo sendo inútil", "Pode ser descartado e recomeçado"],
          ["Aplicação no DOM (commit)", "Ao fim do percurso", "Continua de uma vez, sem pausa no meio"],
        ],
        nota: "Comparação conceitual. A estrutura interna da fibra e o escalonamento mudam entre versões: para o comportamento atual, consulte react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O Fiber é o “como”; a concorrência é o “o quê”",
        texto:
          "O Fiber é o motor que **permite** interromper e priorizar. Para quem escreve componentes, o efeito aparece nos recursos concorrentes: `startTransition` e `useTransition`, `useDeferredValue` e o Suspense (veja L39).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Fique no alto nível",
        texto:
          "Os campos internos da fibra, o escalonador e o modelo interno de prioridades são **detalhes de implementação**: mudam entre versões e não fazem parte da API pública. Numa entrevista, explique o problema e a ideia (o trabalho como dado, que pode ser pausado), sem decorar nomes internos. Para o comportamento atual, confira a documentação oficial em react.dev.",
      },
    ],
    armadilhas: [
      "Dizer que o Fiber “deixa o React mais rápido”: ele permite interromper e priorizar, o que melhora a **responsividade**, mas o custo total do trabalho não diminui por causa dele.",
      "Tratar o Fiber como uma API ou um recurso que se “liga”: ele é o motor interno; o que você usa são os recursos que ele torna possíveis.",
      "Achar que tudo passou a ser interrompível: o commit no DOM continua acontecendo de uma vez, e por isso o corpo do componente precisa ser puro.",
      "Decorar nomes internos (campos da fibra, modelo de prioridades) como se fossem um contrato estável: eles mudam entre versões.",
    ],
    autoteste: [
      {
        pergunta: "Por que o algoritmo antigo não podia ser pausado?",
        resposta:
          "Porque era uma recursão que mantinha o seu progresso na pilha de chamadas do JavaScript, que não dá para guardar e retomar depois. Era terminar ou abortar tudo.",
      },
      {
        pergunta: "O que uma “fibra” representa?",
        resposta:
          "Uma unidade de trabalho ligada a um componente (ou a um nó do DOM): um objeto numa árvore ligada, que guarda o que o React precisa saber sobre ele e permite retomar o percurso de onde parou.",
      },
    ],
  },
  en: {
    titulo: "What Fiber is",
    pergunta: "What is the React Fiber architecture?",
    porqueEsteMetodo:
      "Fiber is often explained as a list of internal structures, which people memorize without understanding. Asking “why?” in a chain starts from the real problem (a blocked main thread) and reaches the central idea: turning the render walk into data that can be paused.",
    resposta30s:
      "**Fiber** is the rewrite of React’s internal engine, which represents rendering work as a **linked tree of units of work**, one per component. The old engine walked the tree recursively and could not stop, so a large tree blocked the main thread; with Fiber, React can **pause, resume, prioritize and discard** work. It is the foundation of the concurrent features (transitions, Suspense), but it is not an API you use directly.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why did React need a new engine?",
            resposta:
              "Because the old reconciler walked the tree with **plain recursion**, using the JavaScript call stack. Once an update started, it ran to the end without giving control back. Since the main thread also handles clicks, typing and animations, a large tree left the page unresponsive while rendering.",
          },
          {
            pergunta: "Why does recursion prevent pausing?",
            resposta:
              "Because “where am I and what is left to do” lives on the **call stack**, which your code cannot save and continue later. There are only two outcomes: let it finish, or abort everything and lose the progress.",
          },
          {
            pergunta: "What does Fiber change?",
            resposta:
              "It makes the walk **explicit data**. Each component (and each DOM element) has a “fiber”: an object in a linked tree, with references to its parent, first child and sibling, and with what React needs to know about it (type, props, state, pending effects). Walking the tree becomes a loop over references, and “where I stopped” is just a pointer that can be saved.",
          },
          {
            pergunta: "What does that buy you?",
            resposta:
              "Because the work is split into small units, React can **hand control back to the browser** between them, give **priority** to an urgent update (typing) over a deferrable one (filtering a list), **discard** a render that became obsolete and start over, and reuse work already done. This underpins transitions, Suspense and `useDeferredValue`.",
          },
          {
            pergunta: "What does Fiber not change?",
            resposta:
              "The **mental model for writing components**: it is still functions, props, state and hooks, and Fiber does not make code faster by itself. It also does not make everything interruptible: the **render** phase (working out what changed) can be paused, but the **commit**, which applies the changes to the DOM, runs in one go, so the screen is never left half-updated. That is why components must be **pure** (see L28).",
          },
        ],
        causaRaiz:
          "To interrupt work you have to save its progress. Fiber moves the state of the walk off the call stack and turns it into **data** (a linked tree of units of work), and that is what makes pausing, prioritizing and discarding possible.",
      },
      {
        tipo: "tabela",
        titulo: "Before and after, at a high level",
        colunas: ["Aspect", "Old engine (recursive)", "With Fiber"],
        linhas: [
          [
            "How it walks the tree",
            "Recursion on the JavaScript call stack",
            "A loop over a linked tree of units of work",
          ],
          ["Can it pause midway?", "No: it runs to the end", "Yes, in the render phase"],
          ["Update priority", "All updates treated the same", "Urgent ones go ahead of deferrable ones"],
          ["Work that became obsolete", "Finishes even though it is useless", "Can be discarded and restarted"],
          [
            "Applying to the DOM (commit)",
            "At the end of the walk",
            "Still happens in one go, with no pause in the middle",
          ],
        ],
        nota: "A conceptual comparison. The internal structure of a fiber and the scheduling change between versions: for current behavior, see react.dev.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Fiber is the “how”; concurrency is the “what”",
        texto:
          "Fiber is the engine that **makes it possible** to interrupt and prioritize. For people writing components, the effect shows up in the concurrent features: `startTransition` and `useTransition`, `useDeferredValue` and Suspense (see L39).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Stay at a high level",
        texto:
          "The internal fields of a fiber, the scheduler and the internal priority model are **implementation details**: they change between versions and are not part of the public API. In an interview, explain the problem and the idea (work as data, which can be paused) without memorizing internal names. For current behavior, check the official documentation at react.dev.",
      },
    ],
    armadilhas: [
      "Saying Fiber “makes React faster”: it allows interrupting and prioritizing, which improves **responsiveness**, but the total cost of the work does not shrink because of it.",
      "Treating Fiber as an API or a feature you “turn on”: it is the internal engine; what you use are the features it makes possible.",
      "Believing everything became interruptible: the DOM commit still happens in one go, which is why the component body must be pure.",
      "Memorizing internal names (fiber fields, the priority model) as if they were a stable contract: they change between versions.",
    ],
    autoteste: [
      {
        pergunta: "Why could the old algorithm not be paused?",
        resposta:
          "Because it was a recursion that kept its progress on the JavaScript call stack, which cannot be saved and resumed later. It was finish or abort everything.",
      },
      {
        pergunta: "What does a “fiber” represent?",
        resposta:
          "A unit of work tied to a component (or a DOM node): an object in a linked tree that holds what React needs to know about it and lets the walk resume from where it stopped.",
      },
    ],
  },
};
