import type { Pergunta } from "../../tipos";

// G35 · O que é hoisting
export const g035: Pergunta = {
  numero: 335,
  modulo: "glassdoor-javascript",
  metodo: "trace",
  pt: {
    titulo: "O que é hoisting",
    pergunta: "O que é hoisting em JavaScript?",
    porqueEsteMetodo:
      "Hoisting não é uma regra para decorar: é consequência do que o motor faz antes de executar a primeira linha. Seguir o motor passo a passo, da criação do escopo até a execução, explica cada resultado, inclusive os erros.",
    resposta30s:
      "**Hoisting** é o efeito de o motor registrar as declarações de um escopo **antes** de executar o código, então os nomes já existem quando a execução começa; o código não sobe de verdade. `var` é registrada com **`undefined`**, uma **function declaration** vem **completa**, e `let`, `const` e `class` existem, mas ficam na **zona morta temporal (TDZ)** e lançam `ReferenceError` se lidas antes da linha da declaração. Entender isso evita bugs e ajuda a ler código antigo.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "O que cada linha imprime",
        legenda: "JavaScript",
        codigo: [
          "console.log(a); // undefined: a var já existe, mas sem valor",
          "console.log(saudar('Ana')); // Olá, Ana: a função já veio completa",
          "try { console.log(b); } catch (e) { console.log(e.name); } // ReferenceError: zona morta",
          "try { dobrar(2); } catch (e) { console.log(e.name); } // TypeError: dobrar ainda é undefined",
          "",
          "var a = 1;",
          "let b = 2;",
          "function saudar(nome) { return 'Olá, ' + nome; }",
          "var dobrar = (x) => x * 2;",
        ].join("\n"),
        nota: "Troque `let b` por `var b` e a terceira linha passa a imprimir `undefined` em vez de lançar um erro.",
      },
      {
        tipo: "fluxo",
        titulo: "O que o motor faz com esse código",
        etapas: [
          "**Criação do escopo** (antes de qualquer linha rodar): o motor lê as declarações do escopo e registra os nomes",
          "`var a` é registrada e inicializada com `undefined`; `var dobrar` também (a arrow function só será atribuída durante a execução)",
          "`function saudar` é registrada **com o corpo inteiro**, pronta para ser chamada",
          "`let b` entra no escopo **sem valor**: fica na zona morta temporal até a execução chegar à linha `let b = 2`",
          "**Execução**, linha a linha: `console.log(a)` encontra `undefined`; `saudar('Ana')` funciona; ler `b` ou chamar `dobrar` falha",
          "Ao chegar em `var a = 1`, só a atribuição acontece (a declaração já foi feita); em `let b = 2`, a variável sai da zona morta e ganha valor",
        ],
        nota: "São duas fases do mesmo motor, uma depois da outra: primeiro registrar os nomes, depois executar.",
      },
      {
        tipo: "tabela",
        titulo: "Cada declaração, antes da sua linha",
        colunas: ["Declaração", "Registrada na criação do escopo como", "Usada antes da linha"],
        linhas: [
          ["`var x = 1`", "`x` com `undefined` (escopo de função)", "Lê `undefined`, sem erro"],
          ["`function f() {}`", "`f` com o corpo inteiro", "Funciona normalmente"],
          [
            "`var f = function () {}` ou `var f = () => {}`",
            "Só o nome `f`, com `undefined`",
            "Chamar dá `TypeError` (`f` não é uma função)",
          ],
          ["`let` e `const`", "O nome existe, mas sem valor (zona morta)", "`ReferenceError`"],
          ["`class C {}`", "Como `let`: zona morta até a declaração", "`ReferenceError`"],
        ],
        nota: "`let`, `const` e `class` valem só no bloco em que aparecem; `var` ignora blocos e vale na função inteira. O comportamento de uma `function` declarada dentro de um bloco difere entre modo estrito e código antigo: evite.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Hoisting é um efeito, não um movimento",
        texto:
          "O código **não é reescrito** e nenhuma linha sobe: o motor percorre o escopo, registra os nomes e só depois executa. `let`, `const` e `class` também são “içadas” no sentido de o nome já pertencer ao escopo; a prova é que `let x = 1; { console.log(x); let x = 2; }` lança `ReferenceError` em vez de imprimir `1`: o `x` de dentro do bloco já existe, está na zona morta e esconde o de fora. A diferença para `var` é que elas **não são inicializadas** antes da declaração.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Por que importa na prática",
        texto:
          "Em código moderno, declare antes de usar e prefira `const` e `let`: elas transformam o uso antes da declaração em erro claro, em vez de um `undefined` silencioso (a regra `no-use-before-define` do ESLint ajuda). Em React, um componente escrito como `function Cartao() {}` pode ser referenciado acima da sua definição, mas `const Cartao = () => ...` obedece à zona morta: usá-lo no topo do módulo, antes da linha, falha, enquanto usá-lo dentro de outro componente funciona, porque a renderização só acontece depois que o módulo inteiro foi avaliado. E `typeof` não protege da zona morta: `typeof x` antes de `let x` também lança `ReferenceError`.",
      },
    ],
    armadilhas: [
      "Achar que `let` e `const` não sofrem hoisting: o nome já pertence ao escopo desde a criação. A zona morta é o que impede o uso antes da declaração e o que esconde a variável externa de mesmo nome.",
      "Esperar que `var x = 5` içe o valor: só a declaração é registrada, com `undefined`; a atribuição fica na linha original.",
      "Chamar uma function expression ou arrow function antes da definição como se fosse uma declaração: com `var` dá `TypeError` (o nome existe, mas vale `undefined`); com `let` ou `const`, `ReferenceError`.",
      "Esquecer que `var` tem escopo de função: uma `var` dentro de `if` ou de `for` vaza para fora do bloco, e os callbacks de um `for (var i ...)` compartilham o mesmo `i`.",
    ],
    autoteste: [
      {
        pergunta: "O que imprime `console.log(x); var x = 3;` e por quê?",
        resposta:
          "Imprime `undefined`. Na criação do escopo, `x` é registrada com `undefined`; a atribuição `x = 3` só acontece quando a execução chega à linha. Com `let x`, o mesmo código lançaria `ReferenceError`.",
      },
      {
        pergunta:
          "Por que chamar `f()` antes de `var f = function () {}` dá `TypeError` e antes de `const f = ...` dá `ReferenceError`?",
        resposta:
          "Com `var`, o nome `f` existe desde a criação com `undefined`, e chamar `undefined` é um `TypeError`. Com `const`, o nome está na zona morta, e qualquer acesso antes da declaração é um `ReferenceError`.",
      },
    ],
  },
  en: {
    titulo: "What hoisting is",
    pergunta: "What is hoisting in JavaScript?",
    porqueEsteMetodo:
      "Hoisting is not a rule to memorize: it is a consequence of what the engine does before running the first line. Following the engine step by step, from scope creation to execution, explains every result, errors included.",
    resposta30s:
      "**Hoisting** is the effect of the engine registering a scope’s declarations **before** it runs the code, so the names already exist when execution starts; the code does not literally move. `var` is registered as **`undefined`**, a **function declaration** comes **complete**, and `let`, `const` and `class` exist but sit in the **temporal dead zone (TDZ)**, throwing a `ReferenceError` if read before the declaration line. Understanding this prevents bugs and helps you read older code.",
    blocos: [
      {
        tipo: "codigo",
        titulo: "What each line prints",
        legenda: "JavaScript",
        codigo: [
          "console.log(a); // undefined: the var exists, but has no value yet",
          "console.log(greet('Ann')); // Hello, Ann: the function came complete",
          "try { console.log(b); } catch (e) { console.log(e.name); } // ReferenceError: dead zone",
          "try { twice(2); } catch (e) { console.log(e.name); } // TypeError: twice is still undefined",
          "",
          "var a = 1;",
          "let b = 2;",
          "function greet(name) { return 'Hello, ' + name; }",
          "var twice = (x) => x * 2;",
        ].join("\n"),
        nota: "Change `let b` to `var b` and the third line prints `undefined` instead of throwing an error.",
      },
      {
        tipo: "fluxo",
        titulo: "What the engine does with this code",
        etapas: [
          "**Scope creation** (before any line runs): the engine reads the scope’s declarations and registers the names",
          "`var a` is registered and initialized to `undefined`; so is `var twice` (the arrow function is only assigned during execution)",
          "`function greet` is registered **with its whole body**, ready to be called",
          "`let b` enters the scope **without a value**: it stays in the temporal dead zone until execution reaches the `let b = 2` line",
          "**Execution**, line by line: `console.log(a)` finds `undefined`; `greet('Ann')` works; reading `b` or calling `twice` fails",
          "At `var a = 1`, only the assignment happens (the declaration was already done); at `let b = 2`, the variable leaves the dead zone and gets its value",
        ],
        nota: "These are two phases of the same engine, one after the other: first register the names, then execute.",
      },
      {
        tipo: "tabela",
        titulo: "Each declaration, before its line",
        colunas: ["Declaration", "Registered at scope creation as", "Used before its line"],
        linhas: [
          ["`var x = 1`", "`x` set to `undefined` (function scope)", "Reads `undefined`, no error"],
          ["`function f() {}`", "`f` with its whole body", "Works normally"],
          [
            "`var f = function () {}` or `var f = () => {}`",
            "Only the name `f`, set to `undefined`",
            "Calling it throws `TypeError` (`f` is not a function)",
          ],
          ["`let` and `const`", "The name exists, but has no value (dead zone)", "`ReferenceError`"],
          ["`class C {}`", "Like `let`: dead zone until the declaration", "`ReferenceError`"],
        ],
        nota: "`let`, `const` and `class` only apply inside the block where they appear; `var` ignores blocks and applies to the whole function. How a `function` declared inside a block behaves differs between strict mode and legacy code: avoid it.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Hoisting is an effect, not a movement",
        texto:
          "The code is **not rewritten** and no line moves up: the engine walks the scope, registers the names and only then executes. `let`, `const` and `class` are also “hoisted” in the sense that the name already belongs to the scope; the proof is that `let x = 1; { console.log(x); let x = 2; }` throws a `ReferenceError` instead of printing `1`: the inner `x` already exists, sits in the dead zone and shadows the outer one. The difference from `var` is that they are **not initialized** before the declaration.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Why it matters in practice",
        texto:
          "In modern code, declare before you use and prefer `const` and `let`: they turn use-before-declaration into a clear error instead of a silent `undefined` (ESLint’s `no-use-before-define` rule helps). In React, a component written as `function Card() {}` can be referenced above its definition, but `const Card = () => ...` obeys the dead zone: using it at the top of the module, before its line, fails, while using it inside another component works, because rendering only happens after the whole module has been evaluated. And `typeof` does not protect you from the dead zone: `typeof x` before `let x` also throws a `ReferenceError`.",
      },
    ],
    armadilhas: [
      "Thinking `let` and `const` are not hoisted: the name belongs to the scope from the moment it is created. The dead zone is what blocks use before the declaration and what hides an outer variable with the same name.",
      "Expecting `var x = 5` to hoist the value: only the declaration is registered, as `undefined`; the assignment stays on its original line.",
      "Calling a function expression or arrow function before its definition as if it were a declaration: with `var` it throws `TypeError` (the name exists, but is `undefined`); with `let` or `const`, `ReferenceError`.",
      "Forgetting that `var` is function-scoped: a `var` inside an `if` or `for` leaks out of the block, and the callbacks of a `for (var i ...)` share the same `i`.",
    ],
    autoteste: [
      {
        pergunta: "What does `console.log(x); var x = 3;` print, and why?",
        resposta:
          "It prints `undefined`. At scope creation, `x` is registered as `undefined`; the assignment `x = 3` only happens when execution reaches that line. With `let x`, the same code would throw a `ReferenceError`.",
      },
      {
        pergunta:
          "Why does calling `f()` before `var f = function () {}` throw `TypeError`, but before `const f = ...` throw `ReferenceError`?",
        resposta:
          "With `var`, the name `f` exists from creation as `undefined`, and calling `undefined` is a `TypeError`. With `const`, the name sits in the dead zone, and any access before the declaration is a `ReferenceError`.",
      },
    ],
  },
};
