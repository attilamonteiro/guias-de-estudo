import type { Pergunta } from "../../tipos";

// G69 · Laço: Chrome x Node.js
export const g069: Pergunta = {
  numero: 669,
  modulo: "gist-especialista",
  metodo: "whys",
  pt: {
    titulo: "Laço: Chrome x Node.js",
    pergunta:
      'Considere um trecho de código: um console.time("loop") e um console.timeEnd("loop") em volta de um laço for (var i = 0; i < 1000000; i += 1) vazio. O tempo para rodar esse código no Google Chrome é bem maior do que no Node.js. Explique por que isso acontece, mesmo que ambos usem o motor JavaScript V8.',
    porqueEsteMetodo:
      "A resposta é uma cadeia de causas, da variável ao compilador e à medição, e a cadeia de “por quês” separa o que é mecanismo do que é ruído de medição. Também deixa claro que a explicação é uma hipótese, que depende de motor e de versão.",
    resposta30s:
      "O motor é o mesmo, mas o **programa** que ele recebe não é: no navegador, o `var i` no topo de um script vira **propriedade do objeto global** (`window`), um objeto grande e mutável que o JIT otimiza com mais cautela; no Node, o arquivo é um **módulo embrulhado numa função**, então `i` é **variável local**, que o JIT pode manter em registrador (e o laço vazio pode até ser eliminado). É uma hipótese plausível, não uma lei: depende de motor e versão, e um microbenchmark de uma execução só mede muito ruído.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Se o motor é o mesmo, por que o tempo pode mudar?",
            resposta:
              "Porque o motor é só uma parte do ambiente. O que muda é **o programa que o V8 enxerga**: onde a variável `i` vive, que objetos existem em volta e que ferramentas estão ligadas (o console do DevTools, por exemplo). Com o mesmo texto de código, o V8 pode receber duas situações bem diferentes.",
          },
          {
            pergunta: "Por que o `var i` no navegador é diferente?",
            resposta:
              "Num script clássico, e no console do DevTools, um `var` no topo cria uma **propriedade do objeto global**, `window.i`. Cada `i < 1000000` e cada `i += 1` lê e escreve uma propriedade desse objeto, e não uma variável local.",
          },
          {
            pergunta: "Por que uma propriedade global é mais difícil de otimizar?",
            resposta:
              "Porque o objeto global é grande e **mutável**: qualquer script pode redefinir `i`, trocá-la por um acessor ou apagá-la, e o motor precisa manter o valor onde os outros enxergam e conferir isso no caminho do laço. O V8 tem atalhos para propriedades globais, então não é lento por definição, mas dá ao compilador menos garantias do que uma variável que ninguém de fora pode tocar.",
          },
          {
            pergunta: "Por que no Node costuma ser diferente?",
            resposta:
              "Em CommonJS, o arquivo é **embrulhado numa função** (com `exports`, `require`, `module`, `__filename` e `__dirname`), então o `var i` é uma **variável local** dela; um módulo ES também não escreve no global. O compilador otimizador pode provar que ninguém mais a toca, mantê-la num registrador e até **eliminar um laço vazio**. Nada disso é garantido: depende do motor, da versão e de o laço durar o bastante para o JIT entrar.",
          },
          {
            pergunta: "Por que esse teste não prova nada sozinho?",
            resposta:
              "Porque é um microbenchmark de uma execução só: mede também o aquecimento do JIT, a coleta de lixo e o ruído da máquina e do navegador (abas, extensões, DevTools aberto). E o `console.time` mede **relógio de parede**, não CPU. Motores mudam, e otimizações recentes podem reduzir ou apagar a diferença. A saída é tratar a explicação como hipótese e testá-la.",
          },
        ],
        causaRaiz:
          "A diferença provável não está no V8, e sim em **onde `i` mora**: propriedade de um objeto global mutável (script clássico no navegador) ou variável local de uma função (módulo no Node). Mesmo assim, é uma hipótese a testar, não uma lei.",
      },
      {
        tipo: "codigo",
        titulo: "Testando a hipótese no Node: variável local x global",
        legenda: "JavaScript",
        codigo: `import vm from "node:vm";
import { performance } from "node:perf_hooks";

const codigo = "for (var i = 0; i < 1000000; i += 1) {}";

function medir(rotulo, fn) {
  const inicio = performance.now();
  fn();
  console.log(rotulo, (performance.now() - inicio).toFixed(2), "ms");
}

for (let rodada = 0; rodada < 5; rodada += 1) {
  // i local: o arquivo é um módulo e a variável vive dentro da função
  medir("local", () => {
    for (var i = 0; i < 1000000; i += 1) {}
  });
  // i vira propriedade do objeto global, como num script clássico
  medir("global", () => vm.runInThisContext(codigo));
}`,
        nota: "A primeira rodada costuma ser a mais lenta (aquecimento do JIT), então compare as seguintes. A medição “global” inclui compilar o trecho, e o resultado depende do motor e da versão: pode mostrar pouca diferença.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como testar a hipótese",
        texto:
          "Rode o mesmo laço no navegador de três jeitos: no topo de um script clássico, dentro de uma função e com `let` no lugar de `var` (um `let` no topo de um script não vira propriedade de `window`). Repita várias vezes, com o DevTools fechado. Se a hipótese estiver certa, os casos com variável local ficam à frente e o global fica atrás. Se a diferença sumir na sua versão, o motor mudou, e isso também é uma resposta válida.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que não concluir",
        texto:
          "Não conclua que “o Chrome é lento” nem que “`var` é lento”: o problema, quando existe, é a variável no **escopo global** de um script clássico. Em código real, o laço faz alguma coisa (lê dados, chama funções) e o gargalo muda de lugar. Meça o que importa com um profiler (veja L111), não com `console.time` num laço vazio.",
      },
    ],
    armadilhas: [
      "Tratar um microbenchmark de uma execução só como prova: ele mede também aquecimento do JIT, coleta de lixo e ruído de abas e do DevTools.",
      "Achar que “o V8 é o mesmo, logo o desempenho é o mesmo”: escopo, objeto global e ferramentas ligadas mudam o que o motor consegue otimizar.",
      "Concluir que `var` é lento: o custo vem da variável no escopo global, e `var` dentro de função é local.",
      "Esquecer que um laço vazio pode ser eliminado pelo otimizador e que ele só entra depois de o código esquentar: o tempo medido pode ser quase nada, ou quase só o aquecimento.",
    ],
    autoteste: [
      {
        pergunta: "Onde mora o `i` no navegador e no Node, e por que isso importa para o motor?",
        resposta:
          "No topo de um script clássico do navegador, ele vira propriedade do objeto global, mutável e visível a qualquer script. No Node, o arquivo é um módulo dentro de uma função, e `i` é local. Uma variável local que ninguém mais toca é bem mais fácil de manter em registrador e de otimizar.",
      },
      {
        pergunta: "Como você testaria essa explicação em vez de aceitá-la?",
        resposta:
          "Rodando o mesmo laço no topo de um script, dentro de uma função e com `let`, várias vezes e com o DevTools fechado, e comparando as repetições depois da primeira. No Node, comparando o código num módulo com o mesmo código avaliado no escopo global.",
      },
    ],
  },
  en: {
    titulo: "Loop: Chrome vs Node.js",
    pergunta:
      'Consider a code snippet: a console.time("loop") and a console.timeEnd("loop") around an empty for (var i = 0; i < 1000000; i += 1) loop. The time required to run this code in Google Chrome is considerably more than the time required to run it in Node.js. Explain why this is so, even though both use the V8 JavaScript engine.',
    porqueEsteMetodo:
      "The answer is a chain of causes, from the variable to the compiler to the measurement, and the chain of whys separates mechanism from measurement noise. It also makes clear that the explanation is a hypothesis that depends on engine and version.",
    resposta30s:
      "The engine is the same, but the **program** it receives is not: in the browser, a top-level `var i` in a script becomes a **property of the global object** (`window`), a large, mutable object the JIT optimizes more cautiously; in Node, the file is a **module wrapped in a function**, so `i` is a **local variable** the JIT can keep in a register (and the empty loop may even be eliminated). It is a plausible hypothesis, not a law: it depends on engine and version, and a single-run microbenchmark measures a lot of noise.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "If the engine is the same, why can the time change?",
            resposta:
              "Because the engine is only part of the environment. What changes is **the program V8 sees**: where the variable `i` lives, which objects exist around it and which tools are attached (the DevTools console, for example). With the same source text, V8 can receive two very different situations.",
          },
          {
            pergunta: "Why is `var i` different in the browser?",
            resposta:
              "In a classic script, and in the DevTools console, a top-level `var` creates a **property of the global object**, `window.i`. Every `i < 1000000` and every `i += 1` reads and writes a property of that object, not a local variable.",
          },
          {
            pergunta: "Why is a global property harder to optimize?",
            resposta:
              "Because the global object is large and **mutable**: any script can redefine `i`, replace it with an accessor or delete it, and the engine has to keep the value where others can see it and check that inside the loop. V8 has shortcuts for global properties, so it is not slow by definition, but it gives the compiler fewer guarantees than a variable nobody outside can touch.",
          },
          {
            pergunta: "Why is Node usually different?",
            resposta:
              "In CommonJS, the file is **wrapped in a function** (with `exports`, `require`, `module`, `__filename` and `__dirname`), so `var i` is a **local variable** of it; an ES module does not write to the global either. The optimizing compiler can prove nobody else touches it, keep it in a register and even **eliminate an empty loop**. None of that is guaranteed: it depends on the engine, the version and the loop lasting long enough for the JIT to kick in.",
          },
          {
            pergunta: "Why does this test prove nothing on its own?",
            resposta:
              "Because it is a single-run microbenchmark: it also measures JIT warm-up, garbage collection and noise from the machine and the browser (tabs, extensions, DevTools open). And `console.time` measures **wall-clock time**, not CPU. Engines change, and recent optimizations may shrink or erase the difference. The way out is to treat the explanation as a hypothesis and test it.",
          },
        ],
        causaRaiz:
          "The probable difference is not in V8 but in **where `i` lives**: a property of a mutable global object (a classic script in the browser) or a local variable of a function (a module in Node). Even so, it is a hypothesis to test, not a law.",
      },
      {
        tipo: "codigo",
        titulo: "Testing the hypothesis in Node: local vs global variable",
        legenda: "JavaScript",
        codigo: `import vm from "node:vm";
import { performance } from "node:perf_hooks";

const code = "for (var i = 0; i < 1000000; i += 1) {}";

function measure(label, fn) {
  const start = performance.now();
  fn();
  console.log(label, (performance.now() - start).toFixed(2), "ms");
}

for (let round = 0; round < 5; round += 1) {
  // i is local: the file is a module and the variable lives inside the function
  measure("local", () => {
    for (var i = 0; i < 1000000; i += 1) {}
  });
  // i becomes a property of the global object, as in a classic script
  measure("global", () => vm.runInThisContext(code));
}`,
        nota: "The first round tends to be the slowest (JIT warm-up), so compare the later ones. The “global” measurement includes compiling the snippet, and the result depends on the engine and version: it may show little difference.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to test the hypothesis",
        texto:
          "Run the same loop in the browser three ways: at the top of a classic script, inside a function, and with `let` instead of `var` (a top-level `let` in a script does not become a property of `window`). Repeat several times, with DevTools closed. If the hypothesis is right, the cases with a local variable come out ahead and the global one lags. If the difference vanishes on your version, the engine changed, and that is also a valid answer.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What not to conclude",
        texto:
          "Do not conclude that “Chrome is slow” or that “`var` is slow”: the problem, when there is one, is the variable in the **global scope** of a classic script. In real code, the loop does something (reads data, calls functions) and the bottleneck moves. Measure what matters with a profiler (see L111), not with `console.time` on an empty loop.",
      },
    ],
    armadilhas: [
      "Treating a single-run microbenchmark as proof: it also measures JIT warm-up, garbage collection and noise from tabs and DevTools.",
      "Thinking “V8 is the same, so performance is the same”: scope, the global object and attached tools change what the engine can optimize.",
      "Concluding that `var` is slow: the cost comes from the variable in the global scope, and `var` inside a function is local.",
      "Forgetting that an empty loop may be eliminated by the optimizer and that it only kicks in once the code warms up: the measured time may be almost nothing, or almost only warm-up.",
    ],
    autoteste: [
      {
        pergunta: "Where does `i` live in the browser and in Node, and why does it matter to the engine?",
        resposta:
          "At the top of a classic browser script, it becomes a property of the global object, which is mutable and visible to any script. In Node, the file is a module inside a function, and `i` is local. A local variable nobody else touches is much easier to keep in a register and to optimize.",
      },
      {
        pergunta: "How would you test this explanation instead of accepting it?",
        resposta:
          "By running the same loop at the top of a script, inside a function and with `let`, several times and with DevTools closed, and comparing the runs after the first. In Node, by comparing the code in a module with the same code evaluated in the global scope.",
      },
    ],
  },
};
