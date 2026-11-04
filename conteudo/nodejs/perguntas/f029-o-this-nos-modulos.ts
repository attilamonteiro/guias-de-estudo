import type { Pergunta } from "../../tipos";

// F29 · O this nos módulos
export const f029: Pergunta = {
  numero: 429,
  modulo: "founditgulf-basicas-2",
  metodo: "trace",
  pt: {
    titulo: "O this nos módulos",
    pergunta: "Como a palavra-chave ‘this’ é tratada nos módulos do Node.js?",
    porqueEsteMetodo:
      "O `this` não depende de onde o código foi escrito, e sim de como a função é chamada, e isso só fica claro seguindo chamadas concretas, inclusive a que perde o objeto. Um trace com a saída esperada de cada linha mostra a regra inteira.",
    resposta30s:
      "No topo de um módulo **CommonJS**, `this` é **`module.exports`** (um objeto vazio no início), e não o objeto global; no **ESM**, é **`undefined`**. Dentro de funções vale a regra geral: num método, `this` é o objeto à esquerda do ponto; numa função chamada solta é o global (modo não estrito) ou `undefined` (estrito); **arrow functions** herdam o `this` do escopo onde foram escritas, e `bind`, `call` e `apply` escolhem o `this` das funções comuns.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Siga o `this` do topo do módulo até uma chamada solta",
        passos: [
          {
            titulo: "Antes da primeira linha",
            texto:
              "No CommonJS, o Node.js embrulha o arquivo numa função com os parâmetros `exports`, `require`, `module`, `__filename` e `__dirname` (veja T51) e a chama com `this` apontando para `module.exports`.",
          },
          {
            titulo: "No topo do módulo",
            texto:
              "`this` é `module.exports`, um objeto vazio no início: `this === module.exports` dá `true` e `this === globalThis` dá `false`. Num script clássico de navegador, o topo seria a `window`; aqui não é.",
          },
          {
            titulo: "Função comum chamada solta",
            texto:
              'Em `solta()`, o `this` vira o objeto global (`globalThis`) em modo não estrito, e `undefined` em modo estrito (`"use strict"`, corpo de classe, ESM). Um arquivo CommonJS é não estrito por padrão.',
          },
          {
            titulo: "Método chamado com ponto",
            texto:
              "Em `pessoa.falar()`, o `this` é `pessoa`. A regra olha para **como** a função é chamada (o que está à esquerda do ponto), não para onde ela foi escrita.",
          },
          {
            titulo: "O caminho em que dá errado",
            texto:
              "`const solto = pessoa.falar; solto()` perde o objeto, porque a chamada agora é solta. Em modo não estrito, `this.nome` lê o global e devolve `undefined` em silêncio; em classe ou ESM, lança `TypeError: Cannot read properties of undefined`. O mesmo ocorre ao passar `pessoa.falar` como callback.",
          },
          {
            titulo: "Arrow, bind, call e apply",
            texto:
              "A arrow function não tem `this` próprio: usa o do escopo onde foi escrita (no topo do módulo CommonJS, `module.exports`; dentro de um método, o `this` dele). `bind(obj)` devolve uma função com `this` fixo e `call`/`apply` chamam com um `this` escolhido; nenhum dos três altera uma arrow.",
          },
          {
            titulo: "No ESM",
            texto:
              "Não há função embrulhando o módulo e o código é sempre estrito: `this` no topo é `undefined`. Em ESM, `module`, `exports` e `__dirname` também não existem.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A saída esperada de cada linha",
        legenda: "JavaScript",
        codigo: [
          "// modulo.js (CommonJS, modo não estrito)",
          "console.log(this === module.exports); // true",
          "console.log(this === globalThis);      // false",
          "",
          "function solta() { return this === globalThis; }",
          "console.log(solta());                  // true",
          "",
          "const pessoa = {",
          '  nome: "Ana",',
          "  falar() { return this.nome; },",
          "  seta: () => this === module.exports,",
          "};",
          'console.log(pessoa.falar());           // "Ana"',
          "console.log(pessoa.seta());            // true: a seta usa o this do módulo",
          "",
          "const solto = pessoa.falar;",
          "console.log(solto());                  // undefined: this agora é o global",
          'console.log(solto.bind(pessoa)());     // "Ana"',
        ].join("\n"),
        nota: 'Num arquivo ESM (`.mjs` ou `"type": "module"`), a primeira linha daria `undefined` e `module` nem existiria.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Callbacks do Node.js e o `this`",
        texto:
          "Várias APIs chamam o seu callback com um `this` próprio: o ouvinte de um `EventEmitter` recebe o emissor como `this`, e o callback de um timer recebe o objeto do timer. Isso vale para `function`, não para arrow: com arrow, o `this` é o do escopo de fora. Se você precisa do `this` do objeto ao passar um método como callback, use `bind` ou uma arrow que o chame (`() => obj.metodo()`).",
      },
    ],
    armadilhas: [
      "Achar que o `this` do topo do módulo é o objeto global, como a `window` do navegador: no CommonJS é `module.exports`, e o global é `globalThis`.",
      "Passar `obj.metodo` como callback e esperar `this === obj`: sem o ponto na chamada, o objeto se perde; use `bind` ou uma arrow.",
      "Escrever um método de objeto como arrow (`{ f: () => this.x }`): ela herda o `this` do escopo de fora, não o objeto.",
      "Depender do `this` global em modo não estrito: o erro vira `undefined` silencioso; o modo estrito e o ESM o transformam em erro visível.",
    ],
    autoteste: [
      {
        pergunta: "Quanto vale o `this` no topo de um módulo CommonJS e no de um ESM?",
        resposta:
          "No CommonJS, `module.exports` (o mesmo objeto de `exports`, vazio no início). No ESM, `undefined`, porque o módulo é sempre estrito e não é embrulhado numa função.",
      },
      {
        pergunta: "Por que `setTimeout(pessoa.falar, 100)` perde o objeto e como corrigir?",
        resposta:
          "Porque o timer chama a função solta, sem o objeto à esquerda do ponto. Corrija com `pessoa.falar.bind(pessoa)` ou com uma arrow que chama `pessoa.falar()` dentro.",
      },
    ],
  },
  en: {
    titulo: "this in modules",
    pergunta: "How is the ‘this’ keyword handled in Node.js modules?",
    porqueEsteMetodo:
      "`this` does not depend on where the code was written but on how the function is called, and that only becomes clear by following concrete calls, including the one that loses the object. A trace with the expected output of each line shows the whole rule.",
    resposta30s:
      "At the top of a **CommonJS** module, `this` is **`module.exports`** (an empty object at first), not the global object; in **ESM** it is **`undefined`**. Inside functions the general rule applies: in a method, `this` is the object left of the dot; in a plain call it is the global (sloppy mode) or `undefined` (strict); **arrow functions** inherit `this` from the scope where they were written, and `bind`, `call` and `apply` choose `this` for ordinary functions.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Follow `this` from the top of the module to a loose call",
        passos: [
          {
            titulo: "Before the first line",
            texto:
              "In CommonJS, Node.js wraps the file in a function with the parameters `exports`, `require`, `module`, `__filename` and `__dirname` (see T51) and calls it with `this` pointing to `module.exports`.",
          },
          {
            titulo: "At the top of the module",
            texto:
              "`this` is `module.exports`, an empty object at first: `this === module.exports` is `true` and `this === globalThis` is `false`. In a classic browser script the top level would be `window`; here it is not.",
          },
          {
            titulo: "A plain function called loose",
            texto:
              'In `loose()`, `this` becomes the global object (`globalThis`) in sloppy mode and `undefined` in strict mode (`"use strict"`, class bodies, ESM). A CommonJS file is sloppy by default.',
          },
          {
            titulo: "A method called with a dot",
            texto:
              "In `person.speak()`, `this` is `person`. The rule looks at **how** the function is called (what is left of the dot), not at where it was written.",
          },
          {
            titulo: "The path where it goes wrong",
            texto:
              "`const loose = person.speak; loose()` loses the object, because the call is now a plain one. In sloppy mode, `this.name` reads the global and quietly returns `undefined`; in a class or ESM it throws `TypeError: Cannot read properties of undefined`. The same happens when you pass `person.speak` as a callback.",
          },
          {
            titulo: "Arrow, bind, call and apply",
            texto:
              "An arrow function has no `this` of its own: it uses the one from the scope where it was written (at the top of a CommonJS module, `module.exports`; inside a method, that method’s `this`). `bind(obj)` returns a function with a fixed `this` and `call`/`apply` call with a chosen `this`; none of the three changes an arrow.",
          },
          {
            titulo: "In ESM",
            texto:
              "There is no function wrapping the module and the code is always strict: `this` at the top is `undefined`. In ESM, `module`, `exports` and `__dirname` do not exist either.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The expected output of each line",
        legenda: "JavaScript",
        codigo: [
          "// module.js (CommonJS, sloppy mode)",
          "console.log(this === module.exports); // true",
          "console.log(this === globalThis);      // false",
          "",
          "function loose() { return this === globalThis; }",
          "console.log(loose());                  // true",
          "",
          "const person = {",
          '  name: "Ana",',
          "  speak() { return this.name; },",
          "  arrow: () => this === module.exports,",
          "};",
          'console.log(person.speak());           // "Ana"',
          "console.log(person.arrow());           // true: the arrow uses the module this",
          "",
          "const detached = person.speak;",
          "console.log(detached());               // undefined: this is now the global",
          'console.log(detached.bind(person)());  // "Ana"',
        ].join("\n"),
        nota: 'In an ESM file (`.mjs` or `"type": "module"`), the first line would print `undefined` and `module` would not even exist.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Node.js callbacks and `this`",
        texto:
          "Several APIs call your callback with a `this` of their own: an `EventEmitter` listener receives the emitter as `this`, and a timer callback receives the timer object. That holds for `function`, not for arrows: with an arrow, `this` is the one from the outer scope. If you need the object’s `this` when passing a method as a callback, use `bind` or an arrow that calls it (`() => obj.method()`).",
      },
    ],
    armadilhas: [
      "Thinking the top-level `this` of a module is the global object, like the browser’s `window`: in CommonJS it is `module.exports`, and the global is `globalThis`.",
      "Passing `obj.method` as a callback and expecting `this === obj`: without the dot in the call, the object is lost; use `bind` or an arrow.",
      "Writing an object method as an arrow (`{ f: () => this.x }`): it inherits `this` from the outer scope, not the object.",
      "Relying on the global `this` in sloppy mode: the mistake becomes a silent `undefined`; strict mode and ESM turn it into a visible error.",
    ],
    autoteste: [
      {
        pergunta: "What is `this` at the top of a CommonJS module and of an ESM one?",
        resposta:
          "In CommonJS, `module.exports` (the same object as `exports`, empty at first). In ESM, `undefined`, because the module is always strict and is not wrapped in a function.",
      },
      {
        pergunta: "Why does `setTimeout(person.speak, 100)` lose the object, and how do you fix it?",
        resposta:
          "Because the timer calls the function loose, without the object left of the dot. Fix it with `person.speak.bind(person)` or an arrow that calls `person.speak()` inside.",
      },
    ],
  },
};
