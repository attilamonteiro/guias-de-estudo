import type { Pergunta } from "../../tipos";

// F75 · Dependências circulares
export const f075: Pergunta = {
  numero: 475,
  modulo: "founditgulf-avancadas",
  metodo: "trace",
  pt: {
    titulo: "Dependências circulares",
    pergunta: "O que são dependências cíclicas (circulares) no Node.js e como evitá-las?",
    porqueEsteMetodo:
      "O problema do ciclo está na ordem do carregamento, e só se entende acompanhando-a passo a passo: quem começa, quem pede o quê e o que cada um recebe pela metade.",
    resposta30s:
      "Há dependência circular quando `a` requer `b` e `b` requer `a`. No **CommonJS**, `b` recebe o **`module.exports` parcial** de `a` (talvez um `{}` vazio), porque `a` ainda não terminou de carregar: o resultado é `undefined` ou `is not a function` só em execução. No **ESM**, as ligações são vivas, mas ler um valor antes da inicialização dá erro de zona morta temporal. Evite extraindo o código comum para um terceiro módulo e detecte com `madge` ou `import/no-cycle`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "O carregamento no CommonJS, passo a passo",
        etapas: [
          '`main.js` faz `require("./a")`: o Node cria o registro de `a` no cache, com `exports` vazio, e começa a executar `a.js`',
          'A primeira linha de `a.js` é `require("./b")`: `b` ainda não está no cache, então o Node começa a executar `b.js`, com `a` pela metade',
          '`b.js` faz `require("./a")`: `a` já está no cache (em carregamento), e o Node devolve o `module.exports` **atual** de `a`, que ainda é o `{}` do início',
          "`b.js` lê `a.nome` e recebe `undefined`; o resto de `b.js` roda e `b` termina",
          'O `require("./b")` de `a.js` finalmente devolve o `b` completo, e `a.js` continua',
          "No fim, `a.js` faz `module.exports = {...}`, trocando o objeto: o `{}` que `b` guardou nunca será preenchido, e `b` continua vendo um `a` vazio até o fim do programa",
        ],
        nota: "Nada falhou na hora do `require`: o erro aparece depois, longe da causa, quando alguém usa o que veio vazio.",
      },
      {
        tipo: "codigo",
        titulo: "Dois arquivos, um ciclo",
        legenda: "JavaScript",
        codigo: `// a.js
const b = require("./b"); // começa b antes de a terminar
module.exports = { nome: "a", nomeDoB: () => b.nome };

// b.js
const a = require("./a"); // a ainda está carregando: chega o exports parcial, um {}
console.log(a.nome); // undefined
module.exports = { nome: "b", nomeDoA: () => a.nome };

// main.js
const a = require("./a");
console.log(a.nomeDoB()); // "b": a recebeu o b completo
console.log(require("./b").nomeDoA()); // undefined: b guardou o {} antigo de a`,
        nota: "Se `a.js` preenchesse o mesmo objeto (`exports.nome = ...`) em vez de substituí-lo, o `b` veria o valor depois; mas ler no topo do arquivo, como no `console.log` de `b.js`, ainda daria `undefined`.",
      },
      {
        tipo: "tabela",
        titulo: "O mesmo ciclo em CommonJS e em ESM",
        colunas: ["Aspecto", "CommonJS", "ESM"],
        linhas: [
          [
            "O que o módulo recebe",
            "A referência ao `module.exports` do outro módulo naquele instante, possivelmente incompleto",
            "Ligações vivas (live bindings) às exportações do outro módulo, que refletem os valores quando são inicializados",
          ],
          [
            "Erro típico",
            "`undefined` ou `is not a function` ao usar o que ainda não foi atribuído; o `require` em si não falha",
            "`ReferenceError` (zona morta temporal) ao ler `const`, `let` ou `class` exportados antes de inicializados; funções declaradas com `function` já estão disponíveis",
          ],
          [
            "Quando funciona",
            "Se o uso acontece depois que os dois terminaram de carregar, e ninguém trocou o `module.exports` por outro objeto",
            "Se o uso acontece depois da avaliação de ambos (dentro de funções chamadas mais tarde, por exemplo)",
          ],
          [
            "Ordem de execução",
            "A do momento em que cada `require` é executado",
            "O grafo é analisado antes de executar; a avaliação segue em profundidade, e o módulo de entrada é o último do ciclo a ser avaliado",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "Como evitar e como detectar",
        passos: [
          {
            titulo: "Extraia o que é comum",
            texto:
              "Se `a` e `b` precisam do mesmo código (um tipo, uma constante, uma função utilitária), mova-o para um terceiro módulo `c` do qual os dois dependem. O ciclo vira uma árvore.",
          },
          {
            titulo: "Inverta a dependência",
            texto:
              "Em vez de `b` importar `a`, `b` recebe o que precisa por parâmetro, por injeção ou por um callback ou evento que `a` registra. A dependência passa a ir só de `a` para `b`.",
          },
          {
            titulo: "Reveja os limites",
            texto:
              "Um ciclo costuma indicar duas responsabilidades misturadas: junte os módulos que sempre mudam juntos ou separe a parte que cada lado realmente usa.",
          },
          {
            titulo: "Use o `require` tardio só como remendo",
            texto:
              "Chamar `require` dentro da função, na hora de usar, faz o módulo já estar completo. Funciona, mas esconde o acoplamento e adia o erro.",
          },
          {
            titulo: "Detecte automaticamente",
            texto:
              "O `madge --circular` mostra os ciclos do grafo, e a regra `import/no-cycle` do ESLint reprova no CI (veja D77).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sintomas e remendos",
        texto:
          "Sintomas típicos: `undefined` onde deveria haver uma função, `x is not a function`, `class X extends undefined` e um comportamento que depende de qual arquivo foi importado primeiro. Em alguns casos o Node emite um aviso de acesso a propriedade inexistente dentro de uma dependência circular; é uma pista, não uma garantia. Reordenar os `require` ou usar `require` tardio muda o sintoma, não a causa: o desenho tem dependência nos dois sentidos. Veja também F90.",
      },
    ],
    armadilhas: [
      "Reatribuir `module.exports` depois de um `require` que fecha o ciclo: quem recebeu o objeto parcial fica com o antigo para sempre (preencha o mesmo objeto, com `exports.x`, ou quebre o ciclo).",
      "Ler o valor do outro módulo no topo do arquivo, ou desestruturar com `const { f } = require(...)` num ciclo: o que veio vazio continua vazio; leia dentro da função, na hora de usar.",
      "Contar com o Node para avisar: o aviso cobre só casos específicos, e o `undefined` e o `is not a function` aparecem tarde, longe da causa.",
      "Resolver com `require` tardio e esquecer o problema de desenho: o ciclo continua lá, só deixou de quebrar naquele ponto.",
    ],
    autoteste: [
      {
        pergunta: 'O que `b` recebe quando faz `require("./a")` e `a` ainda está carregando?',
        resposta:
          "O `module.exports` atual de `a`, no estado em que está: normalmente um `{}` vazio ou com o que `a` já tiver atribuído até ali. Se `a` trocar o `module.exports` depois, `b` continua com o objeto antigo.",
      },
      {
        pergunta: "Como evitar e como detectar ciclos?",
        resposta:
          "Evita-se extraindo o código comum para um terceiro módulo ou invertendo a dependência (injeção). Detecta-se com `madge --circular` ou com a regra `import/no-cycle` no CI.",
      },
    ],
  },
  en: {
    titulo: "Circular dependencies",
    pergunta: "What are cyclic dependencies in Node.js and how to avoid them?",
    porqueEsteMetodo:
      "The problem with a cycle lies in the loading order, and you only understand it by following it step by step: who starts, who asks for what and what each one receives half-finished.",
    resposta30s:
      "A circular dependency exists when `a` requires `b` and `b` requires `a`. In **CommonJS**, `b` receives the **partial `module.exports`** of `a` (perhaps an empty `{}`), because `a` has not finished loading: the result is `undefined` or `is not a function`, only at run time. In **ESM**, bindings are live, but reading a value before it is initialized throws a temporal dead zone error. Avoid it by extracting the shared code into a third module, and detect it with `madge` or `import/no-cycle`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Loading in CommonJS, step by step",
        etapas: [
          '`main.js` calls `require("./a")`: Node creates the record for `a` in the cache, with an empty `exports`, and starts executing `a.js`',
          'The first line of `a.js` is `require("./b")`: `b` is not in the cache yet, so Node starts executing `b.js`, with `a` half-done',
          '`b.js` calls `require("./a")`: `a` is already in the cache (still loading), and Node returns the **current** `module.exports` of `a`, which is still the initial `{}`',
          "`b.js` reads `a.name` and gets `undefined`; the rest of `b.js` runs and `b` finishes",
          'The `require("./b")` in `a.js` finally returns the complete `b`, and `a.js` carries on',
          "At the end, `a.js` runs `module.exports = {...}`, replacing the object: the `{}` that `b` kept will never be filled in, and `b` keeps seeing an empty `a` until the program ends",
        ],
        nota: "Nothing failed when `require` ran: the error shows up later, far from the cause, when someone uses what arrived empty.",
      },
      {
        tipo: "codigo",
        titulo: "Two files, one cycle",
        legenda: "JavaScript",
        codigo: `// a.js
const b = require("./b"); // starts b before a finishes
module.exports = { name: "a", nameOfB: () => b.name };

// b.js
const a = require("./a"); // a is still loading: the partial exports arrives, a {}
console.log(a.name); // undefined
module.exports = { name: "b", nameOfA: () => a.name };

// main.js
const a = require("./a");
console.log(a.nameOfB()); // "b": a received the complete b
console.log(require("./b").nameOfA()); // undefined: b kept a’s old {}`,
        nota: "If `a.js` filled in the same object (`exports.name = ...`) instead of replacing it, `b` would see the value later; but reading at the top of the file, like the `console.log` in `b.js`, would still give `undefined`.",
      },
      {
        tipo: "tabela",
        titulo: "The same cycle in CommonJS and in ESM",
        colunas: ["Aspect", "CommonJS", "ESM"],
        linhas: [
          [
            "What the module receives",
            "A reference to the other module’s `module.exports` at that instant, possibly incomplete",
            "Live bindings to the other module’s exports, which reflect the values once they are initialized",
          ],
          [
            "Typical error",
            "`undefined` or `is not a function` when using what has not been assigned yet; `require` itself does not fail",
            "A `ReferenceError` (temporal dead zone) when reading an exported `const`, `let` or `class` before it is initialized; functions declared with `function` are already available",
          ],
          [
            "When it works",
            "If the use happens after both have finished loading, and nobody replaced `module.exports` with another object",
            "If the use happens after both have been evaluated (inside functions called later, for example)",
          ],
          [
            "Execution order",
            "That of the moment each `require` runs",
            "The graph is parsed before anything runs; evaluation goes depth-first, and the entry module is the last of the cycle to be evaluated",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "How to avoid and how to detect",
        passos: [
          {
            titulo: "Extract what is shared",
            texto:
              "If `a` and `b` need the same code (a type, a constant, a utility function), move it to a third module `c` that both depend on. The cycle becomes a tree.",
          },
          {
            titulo: "Invert the dependency",
            texto:
              "Instead of `b` importing `a`, `b` receives what it needs as a parameter, by injection or through a callback or event that `a` registers. The dependency then goes only from `a` to `b`.",
          },
          {
            titulo: "Revisit the boundaries",
            texto:
              "A cycle usually signals two mixed responsibilities: merge the modules that always change together or split off the part each side really uses.",
          },
          {
            titulo: "Use a late `require` only as a patch",
            texto:
              "Calling `require` inside the function, at the moment of use, means the module is already complete. It works, but it hides the coupling and postpones the error.",
          },
          {
            titulo: "Detect it automatically",
            texto:
              "`madge --circular` shows the cycles in the graph, and ESLint’s `import/no-cycle` rule fails the build in CI (see D77).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Symptoms and patches",
        texto:
          "Typical symptoms: `undefined` where a function should be, `x is not a function`, `class X extends undefined` and behavior that depends on which file was imported first. In some cases Node emits a warning about accessing a non-existent property inside a circular dependency; it is a hint, not a guarantee. Reordering `require` calls or using a late `require` changes the symptom, not the cause: the design has a dependency in both directions. See also F90.",
      },
    ],
    armadilhas: [
      "Reassigning `module.exports` after a `require` that closes the cycle: whoever received the partial object keeps the old one forever (fill in the same object with `exports.x`, or break the cycle).",
      "Reading the other module’s value at the top of the file, or destructuring with `const { f } = require(...)` in a cycle: what arrived empty stays empty; read inside the function, at the moment of use.",
      "Counting on Node to warn you: the warning covers only specific cases, and `undefined` and `is not a function` show up late, far from the cause.",
      "Fixing it with a late `require` and forgetting the design problem: the cycle is still there, it just stopped breaking at that spot.",
    ],
    autoteste: [
      {
        pergunta: 'What does `b` receive when it calls `require("./a")` while `a` is still loading?',
        resposta:
          "The current `module.exports` of `a`, in whatever state it is in: normally an empty `{}` or whatever `a` has assigned up to that point. If `a` replaces `module.exports` later, `b` keeps the old object.",
      },
      {
        pergunta: "How do you avoid and detect cycles?",
        resposta:
          "You avoid them by extracting the shared code into a third module or by inverting the dependency (injection). You detect them with `madge --circular` or the `import/no-cycle` rule in CI.",
      },
    ],
  },
};
