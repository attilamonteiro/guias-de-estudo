import type { Pergunta } from "../../tipos";

// L21 · O que é o Virtual DOM
export const l021: Pergunta = {
  numero: 21,
  modulo: "linkedin-renderizacao",
  metodo: "firstprinciples",
  pt: {
    titulo: "O que é o Virtual DOM",
    pergunta: "O que é o Virtual DOM?",
    porqueEsteMetodo:
      "O Virtual DOM costuma ser decorado como “uma cópia leve do DOM que o React compara”, sem entender por que existe. Partir do problema (atualizar o DOM à mão) e consertar uma falha por vez mostra a ideia e também os seus limites.",
    resposta30s:
      "O **Virtual DOM** é a ideia de descrever a interface como **objetos JavaScript leves** (os elementos React) em vez de mexer no DOM real à mão: a cada atualização o React gera uma **árvore nova**, **compara** com a anterior (**reconciliação**) e aplica no DOM real só a **diferença**. O ganho principal é o **modelo declarativo**, em que você diz como a tela deve ficar e o React cuida do como, e não uma velocidade garantida. O termo é debatido hoje, então confira react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O problema",
            texto:
              "Atualizar o DOM real à mão (`querySelector`, `textContent`, `appendChild`) é difícil de manter: cada mudança de dado exige lembrar todos os pontos da tela que dependem dele, e esquecer um deixa a tela fora de sincronia. Mexer no DOM também não é de graça, pois pode forçar recálculo de layout e pintura.",
          },
          {
            titulo: "1. A versão mais simples: refazer tudo",
            texto:
              "A cada mudança nos dados, apague a árvore e recrie tudo a partir de uma função `tela(dados)`. O modelo é ótimo, porque a tela é função dos dados. → Quebra: recriar o DOM inteiro a cada mudança é lento e destrói o que o navegador guarda (foco, posição de rolagem, texto selecionado, vídeo tocando).",
          },
          {
            titulo: "2. Descrever em objetos leves",
            texto:
              'A função passa a devolver uma **descrição**: objetos JavaScript simples (`{ type: "button", props, children }`) que não são nós do DOM e são baratos de criar e descartar. São os elementos do React, o que o JSX produz (veja L06). → Falta: ainda é preciso transformar a descrição em mudanças no DOM.',
          },
          {
            titulo: "3. Comparar com a anterior",
            texto:
              "O React guarda a árvore da última renderização, gera a nova e **compara** as duas (diffing; veja L31). Na prática: tipos diferentes na mesma posição, troca a subárvore; mesmo tipo, mantém o nó e atualiza só as props que mudaram; em listas, a `key` identifica quem é quem (veja L34). → Resolve: sabe exatamente o que mudou.",
          },
          {
            titulo: "4. Aplicar só a diferença",
            texto:
              "Na fase de commit (veja L29), o React faz no DOM real apenas as operações necessárias (trocar um texto, um atributo, inserir um nó) e deixa o resto intacto, com foco e rolagem preservados. Você escreveu “dados para tela”, e o React fez as mudanças pequenas.",
          },
          {
            titulo: "5. O que o Virtual DOM não promete",
            texto:
              "Comparar árvores tem custo próprio, e um DOM manipulado à mão com precisão pode ser igual ou mais rápido. O valor está no **modelo declarativo** e na previsibilidade. Componentes que renderizam demais ou listas enormes ainda pedem otimização (veja L110), e alguns frameworks (como Svelte e Solid) atualizam o DOM sem Virtual DOM.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "DOM real contra Virtual DOM",
        colunas: ["Aspecto", "DOM real", "Virtual DOM"],
        linhas: [
          [
            "O que é",
            "A árvore de nós do navegador, a que o usuário vê",
            "Uma descrição da interface em objetos JavaScript, criada pelo React",
          ],
          [
            "Custo de criar e alterar",
            "Maior: alterar pode causar recálculo de layout e pintura",
            "Menor: são objetos comuns na memória",
          ],
          ["Aparece na tela?", "Sim", "Não: é só uma descrição"],
          ["Estilo de código", "Imperativo, passo a passo", "Declarativo: como a tela deve ficar"],
          [
            "Quem o atualiza",
            "Seu código à mão, ou o React no commit",
            "O React, que gera uma árvore nova a cada renderização",
          ],
          [
            "Papel na atualização",
            "O alvo final das mudanças",
            "A base de comparação para calcular o mínimo de mudanças",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A ideia em uma frase, e a reconciliação",
        texto:
          "Virtual DOM é **descrever** a interface em objetos, **comparar** a descrição nova com a anterior e **aplicar** só o mínimo no DOM real. **Reconciliação** é o nome do algoritmo que compara as árvores e decide o que atualizar; o Virtual DOM é a representação, e a reconciliação é o processo que a usa. Internamente o React usa a arquitetura Fiber, uma estrutura própria que permite pausar e retomar o trabalho de renderização, e que não é o mesmo que o objeto de elemento.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é mágica nem garantia de velocidade",
        texto:
          "Dizer que o Virtual DOM “é mais rápido que o DOM” engana: o DOM real continua sendo atualizado, e o ganho é de modelo e de aplicar só a diferença. Comparar não evita renderizar: o React chama de novo os componentes da subárvore afetada, e é o resultado dessa renderização que é comparado. O termo também é debatido: parte da comunidade o vê como um detalhe de implementação. Para a explicação atual do React, que fala em fases de render e commit, confira react.dev.",
      },
    ],
    armadilhas: [
      "Dizer que o Virtual DOM é mais rápido que o DOM: o DOM real ainda é atualizado; o ganho é de modelo declarativo e de aplicar só a diferença.",
      "Confundir Virtual DOM com Shadow DOM: o Shadow DOM é um recurso do navegador que isola marcação e estilos de Web Components; o Virtual DOM é uma técnica de biblioteca.",
      "Achar que comparar evita renderizar: o React chama de novo os componentes afetados, e só o resultado é comparado com o anterior.",
      "Usar o índice como `key` em listas que mudam de ordem: a comparação pode reaproveitar o nó errado (veja L34).",
    ],
    autoteste: [
      {
        pergunta: "O que acontece, do ponto de vista do Virtual DOM, quando o state muda?",
        resposta:
          "O React chama o componente de novo e gera uma árvore nova de elementos, compara com a anterior (reconciliação) e, na fase de commit, aplica no DOM real só as diferenças.",
      },
      {
        pergunta: "Virtual DOM e Shadow DOM são a mesma coisa?",
        resposta:
          "Não. O Virtual DOM é uma representação em objetos JavaScript que bibliotecas como o React usam para calcular mudanças; o Shadow DOM é um recurso nativo do navegador que isola a árvore e os estilos de um componente (Web Components).",
      },
    ],
  },
  en: {
    titulo: "What the Virtual DOM is",
    pergunta: "What is the Virtual DOM?",
    porqueEsteMetodo:
      "The Virtual DOM is often memorized as “a light copy of the DOM that React compares” without understanding why it exists. Starting from the problem (updating the DOM by hand) and fixing one flaw at a time shows the idea and also its limits.",
    resposta30s:
      "The **Virtual DOM** is the idea of describing the interface as **lightweight JavaScript objects** (React elements) instead of touching the real DOM by hand: on each update React builds a **new tree**, **compares** it with the previous one (**reconciliation**) and applies only the **difference** to the real DOM. The main gain is the **declarative model**, where you say how the screen should look and React handles the how, not guaranteed speed. The term is debated today, so check react.dev.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. The problem",
            texto:
              "Updating the real DOM by hand (`querySelector`, `textContent`, `appendChild`) is hard to maintain: each change in the data requires remembering every spot on the screen that depends on it, and forgetting one leaves the screen out of sync. Touching the DOM is also not free, since it can force layout recalculation and painting.",
          },
          {
            titulo: "1. The simplest version: redo everything",
            texto:
              "On every change in the data, wipe the tree and rebuild everything from a function `screen(data)`. The model is great, because the screen is a function of the data. → Breaks: recreating the whole DOM on every change is slow and destroys what the browser keeps (focus, scroll position, selected text, a playing video).",
          },
          {
            titulo: "2. Describe in lightweight objects",
            texto:
              'The function now returns a **description**: plain JavaScript objects (`{ type: "button", props, children }`) that are not DOM nodes and are cheap to create and discard. These are React elements, what JSX produces (see L06). → Missing: the description still has to be turned into DOM changes.',
          },
          {
            titulo: "3. Compare with the previous one",
            texto:
              "React keeps the tree from the last render, builds the new one and **compares** the two (diffing; see L31). In practice: different types at the same position, replace the subtree; same type, keep the node and update only the props that changed; in lists, the `key` tells who is who (see L34). → Fixes: it knows exactly what changed.",
          },
          {
            titulo: "4. Apply only the difference",
            texto:
              "In the commit phase (see L29), React performs on the real DOM only the necessary operations (change a text, an attribute, insert a node) and leaves the rest untouched, with focus and scroll preserved. You wrote “data to screen”, and React made the small changes.",
          },
          {
            titulo: "5. What the Virtual DOM does not promise",
            texto:
              "Comparing trees has a cost of its own, and a hand-written, precisely targeted DOM update can be equal or faster. The value lies in the **declarative model** and in predictability. Components that render too much or huge lists still call for optimization (see L110), and some frameworks (such as Svelte and Solid) update the DOM without a Virtual DOM.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Real DOM versus Virtual DOM",
        colunas: ["Aspect", "Real DOM", "Virtual DOM"],
        linhas: [
          [
            "What it is",
            "The browser’s tree of nodes, the one the user sees",
            "A description of the interface in JavaScript objects, created by React",
          ],
          [
            "Cost of creating and changing",
            "Higher: changing can cause layout recalculation and painting",
            "Lower: they are ordinary objects in memory",
          ],
          ["Shows on screen?", "Yes", "No: it is only a description"],
          ["Code style", "Imperative, step by step", "Declarative: how the screen should look"],
          ["Who updates it", "Your code by hand, or React at commit", "React, which builds a new tree on every render"],
          [
            "Role in an update",
            "The final target of the changes",
            "The basis for comparison to work out the minimum changes",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The idea in one sentence, and reconciliation",
        texto:
          "Virtual DOM means **describing** the interface in objects, **comparing** the new description with the previous one and **applying** only the minimum to the real DOM. **Reconciliation** is the name of the algorithm that compares the trees and decides what to update; the Virtual DOM is the representation, and reconciliation is the process that uses it. Internally React uses the Fiber architecture, a structure of its own that allows pausing and resuming rendering work, and which is not the same as the element object.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Not magic, and not a speed guarantee",
        texto:
          "Saying the Virtual DOM “is faster than the DOM” misleads: the real DOM is still updated, and the gain is in the model and in applying only the difference. Comparing does not avoid rendering: React calls the components of the affected subtree again, and it is the result of that render that gets compared. The term is also debated: part of the community sees it as an implementation detail. For React’s current explanation, which talks about render and commit phases, check react.dev.",
      },
    ],
    armadilhas: [
      "Saying the Virtual DOM is faster than the DOM: the real DOM is still updated; the gain is the declarative model and applying only the difference.",
      "Confusing Virtual DOM with Shadow DOM: Shadow DOM is a browser feature that isolates the markup and styles of Web Components; Virtual DOM is a library technique.",
      "Thinking comparing avoids rendering: React calls the affected components again, and only the result is compared with the previous one.",
      "Using the index as `key` in lists that change order: the comparison may reuse the wrong node (see L34).",
    ],
    autoteste: [
      {
        pergunta: "What happens, from the Virtual DOM’s point of view, when state changes?",
        resposta:
          "React calls the component again and builds a new tree of elements, compares it with the previous one (reconciliation) and, in the commit phase, applies only the differences to the real DOM.",
      },
      {
        pergunta: "Are Virtual DOM and Shadow DOM the same thing?",
        resposta:
          "No. The Virtual DOM is a representation in JavaScript objects that libraries like React use to compute changes; Shadow DOM is a native browser feature that isolates a component’s tree and styles (Web Components).",
      },
    ],
  },
};
