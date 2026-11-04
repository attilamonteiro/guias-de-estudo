import type { Pergunta } from "../../tipos";

// G70 · Outros motores além do V8
export const g070: Pergunta = {
  numero: 670,
  modulo: "gist-especialista",
  metodo: "compare",
  pt: {
    titulo: "Outros motores além do V8",
    pergunta: "O Node.js pode usar outros motores além do V8?",
    porqueEsteMetodo:
      "A pergunta mistura três coisas: o Node oficial, variantes que tentaram trocar o motor e runtimes que não são o Node. Uma tabela as separa e mostra onde cada uma se encaixa.",
    resposta30s:
      "No Node.js **oficial**, não: ele embute o **V8**, e sua camada C++ (como os módulos `node:v8` e `node:vm`) é escrita contra a API do V8, por isso existe a Node-API, que esconde o motor dos addons (veja G56). Já houve experimentos que trocaram o motor, como o **node-chakracore**, hoje descontinuado, e a flag `--jitless` **não** troca de motor. Um runtime é **motor + APIs + E/S** (veja T20), então “Node sem V8” na prática é **outro runtime**: o Deno usa V8, o Bun usa JavaScriptCore e QuickJS e Hermes são motores pequenos para ambientes embarcados.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Motores e runtimes JavaScript",
        colunas: ["Opção", "Motor JavaScript", "É o Node.js?", "Observação"],
        linhas: [
          [
            "Node.js oficial",
            "V8",
            "Sim",
            "Embute o V8. A camada C++ do núcleo, os módulos `node:v8` e `node:vm` e o inspetor são ligados a ele",
          ],
          [
            "node-chakracore",
            "ChakraCore",
            "Era uma variante do Node.js",
            "Experimento que trocou o motor por meio de uma camada de compatibilidade; descontinuado, confira o estado do projeto",
          ],
          [
            "Node.js com `--jitless`",
            "V8, sem compilação JIT",
            "Sim, é o mesmo Node.js",
            "Flag do próprio V8: muda como o código é executado, não o motor",
          ],
          ["Deno", "V8", "Não", "Runtime separado, com APIs próprias e Web APIs; usa o V8 por baixo"],
          [
            "Bun",
            "JavaScriptCore (o motor do Safari)",
            "Não",
            "Runtime separado que busca compatibilidade com o Node, sem ser o Node; a compatibilidade é parcial e muda",
          ],
          [
            "QuickJS, Hermes",
            "O próprio QuickJS ou Hermes",
            "Não",
            "Motores pequenos para ambientes embarcados ou móveis. São motores, não runtimes: não trazem as APIs do Node",
          ],
        ],
        nota: "Projetos e compatibilidade mudam rápido. Confira a documentação de cada um e a do Node em nodejs.org.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Motor não é runtime",
        texto:
          "O que define um runtime é **motor + APIs + laço de E/S** (veja T20). O Node.js oficial é o V8, o libuv e as APIs `node:*`. Trocar o motor mexe na base inteira (camada C++, módulos ligados ao V8, ferramentas), então “o Node.js pode funcionar sem o V8?” tem a resposta curta **não, o oficial não**; o que existiu foram forks experimentais. Quem precisa de outro motor, na prática, escolhe outro runtime.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Flag não troca de motor, e runtime parecido não é o Node",
        texto:
          "`--jitless` e as outras flags do V8 ajustam como o V8 executa o código; não o substituem. Deno e Bun não são “o Node com outro motor”: são runtimes à parte, e a compatibilidade com pacotes do Node é parcial e varia entre versões. Um addon escrito contra o V8 só roda onde existe um V8 compatível; a Node-API (veja G56) ajuda quando o runtime a oferece, mas o suporte fora do Node pode ser parcial.",
      },
    ],
    armadilhas: [
      "Confundir motor com runtime: o V8 executa JavaScript, mas é o Node que fornece `fs`, `http` e o laço de eventos (libuv).",
      "Achar que `--jitless` ou outras flags do V8 trocam de motor: elas só mudam como o V8 compila e executa.",
      "Supor que Deno e Bun são “o Node com outro motor”: são runtimes separados, com APIs próprias e compatibilidade parcial com o Node.",
      "Esperar que um addon escrito contra o V8 (como os feitos com NAN) rode em qualquer runtime: ele depende de um V8 compatível.",
    ],
    autoteste: [
      {
        pergunta: "Por que o Node.js não troca de motor só com uma configuração?",
        resposta:
          "Porque sua camada C++, módulos como `node:v8` e `node:vm`, o inspetor e os addons nativos são escritos contra a API do V8. Trocar o motor exige reescrever essa base, o que na prática dá outro projeto.",
      },
      {
        pergunta: "O que define um runtime, e em que Deno e Bun diferem do Node?",
        resposta:
          "Um runtime é motor + APIs + laço de E/S. Deno e Bun trazem um motor (V8 e JavaScriptCore) com APIs e E/S próprias, e só tentam ser compatíveis com o Node; por isso são runtimes diferentes, e não variantes dele.",
      },
    ],
  },
  en: {
    titulo: "Engines other than V8",
    pergunta: "Can Node.js use other engines than V8?",
    porqueEsteMetodo:
      "The question mixes three things: official Node, variants that tried to swap the engine, and runtimes that are not Node. A table separates them and shows where each fits.",
    resposta30s:
      "In **official** Node.js, no: it embeds **V8**, and its C++ layer (such as the `node:v8` and `node:vm` modules) is written against the V8 API, which is why Node-API exists, hiding the engine from addons (see G56). There were experiments that swapped the engine, such as **node-chakracore**, now discontinued, and the `--jitless` flag does **not** swap the engine. A runtime is **engine + APIs + I/O** (see T20), so “Node without V8” is in practice **another runtime**: Deno uses V8, Bun uses JavaScriptCore, and QuickJS and Hermes are small engines for embedded environments.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "JavaScript engines and runtimes",
        colunas: ["Option", "JavaScript engine", "Is it Node.js?", "Notes"],
        linhas: [
          [
            "Official Node.js",
            "V8",
            "Yes",
            "Embeds V8. The core’s C++ layer, the `node:v8` and `node:vm` modules and the inspector are tied to it",
          ],
          [
            "node-chakracore",
            "ChakraCore",
            "It was a Node.js variant",
            "An experiment that swapped the engine through a compatibility layer; discontinued, check the project’s status",
          ],
          [
            "Node.js with `--jitless`",
            "V8, without JIT compilation",
            "Yes, it is the same Node.js",
            "A V8 flag itself: it changes how code runs, not the engine",
          ],
          ["Deno", "V8", "No", "A separate runtime, with its own APIs and Web APIs; uses V8 underneath"],
          [
            "Bun",
            "JavaScriptCore (Safari’s engine)",
            "No",
            "A separate runtime that aims for Node compatibility without being Node; compatibility is partial and changes",
          ],
          [
            "QuickJS, Hermes",
            "QuickJS or Hermes itself",
            "No",
            "Small engines for embedded or mobile environments. They are engines, not runtimes: they do not bring Node’s APIs",
          ],
        ],
        nota: "Projects and compatibility change quickly. Check each project’s documentation and Node’s on nodejs.org.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "An engine is not a runtime",
        texto:
          "What defines a runtime is **engine + APIs + I/O loop** (see T20). Official Node.js is V8, libuv and the `node:*` APIs. Swapping the engine touches the whole base (C++ layer, modules tied to V8, tooling), so “can Node.js work without V8?” has the short answer **no, the official one cannot**; what existed were experimental forks. Whoever needs another engine, in practice, picks another runtime.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A flag does not swap the engine, and a similar runtime is not Node",
        texto:
          "`--jitless` and the other V8 flags tune how V8 runs the code; they do not replace it. Deno and Bun are not “Node with another engine”: they are separate runtimes, and compatibility with Node packages is partial and varies between versions. An addon written against V8 only runs where a compatible V8 exists; Node-API (see G56) helps when the runtime offers it, but support outside Node may be partial.",
      },
    ],
    armadilhas: [
      "Confusing engine with runtime: V8 runs JavaScript, but it is Node that provides `fs`, `http` and the event loop (libuv).",
      "Thinking `--jitless` or other V8 flags swap the engine: they only change how V8 compiles and runs code.",
      "Assuming Deno and Bun are “Node with another engine”: they are separate runtimes, with their own APIs and partial Node compatibility.",
      "Expecting an addon written against V8 (such as those built with NAN) to run on any runtime: it depends on a compatible V8.",
    ],
    autoteste: [
      {
        pergunta: "Why can Node.js not swap engines with a setting?",
        resposta:
          "Because its C++ layer, modules such as `node:v8` and `node:vm`, the inspector and native addons are written against the V8 API. Swapping the engine means rewriting that base, which in practice is a different project.",
      },
      {
        pergunta: "What defines a runtime, and how do Deno and Bun differ from Node?",
        resposta:
          "A runtime is engine + APIs + I/O loop. Deno and Bun bring an engine (V8 and JavaScriptCore) with their own APIs and I/O, and only try to be compatible with Node; that is why they are different runtimes, not variants of it.",
      },
    ],
  },
};
