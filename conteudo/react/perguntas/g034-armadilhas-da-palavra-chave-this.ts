import type { Pergunta } from "../../tipos";

// G34 · Armadilhas da palavra-chave this
export const g034: Pergunta = {
  numero: 334,
  modulo: "glassdoor-javascript",
  metodo: "whys",
  pt: {
    titulo: "Armadilhas da palavra-chave this",
    pergunta: "Quais são alguns problemas com a palavra-chave “this” em JavaScript?",
    porqueEsteMetodo:
      "O `this` parece caprichoso até você ver a regra que o governa: ele é decidido na hora da chamada. A cadeia de porquês explica os sintomas (perda de contexto, `bind`, arrow function, handlers de classe do React) a partir dessa regra.",
    resposta30s:
      "Em JavaScript, o valor de `this` é definido **pela forma como a função é chamada**, não por onde foi escrita: `obj.metodo()` usa `obj`; uma chamada simples usa `undefined` (modo estrito) ou o objeto global; `new` cria um objeto; `call`, `apply` e `bind` escolhem explicitamente. Por isso um **método passado como callback perde o contexto** (`setTimeout`, handlers). **Arrow functions** não têm `this` próprio e usam o do escopo onde nasceram; daí vieram o `bind` e os campos arrow nos componentes de classe do React.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o valor de `this` muda conforme a forma de chamada?",
            resposta:
              "Porque `this` não é uma variável resolvida pelo escopo: é um **parâmetro oculto** que cada chamada recebe, o *receptor*. Uma função em JavaScript é só um valor que pode ser guardado em vários objetos, ou em nenhum, e ela não sabe a quem “pertence”. Quem decide é o **ponto de chamada**: `obj.f()` passa `obj`; `f()` não passa nada; `new F()` passa um objeto novo; `f.call(x)` passa `x`.",
          },
          {
            pergunta: "Por que o método perde o `this` quando vira callback?",
            resposta:
              "Porque, ao escrever `const f = obj.metodo` ou `setTimeout(obj.metodo, 0)`, você passa **só a função**; o “`obj.`” ficou para trás. Quem a chama (o timer, o navegador, um handler) não sabe de `obj` e faz uma chamada sem receptor, ou com o receptor dele, como o elemento do DOM num handler comum. O resultado é um `this` indefinido (erro ao acessar `this.campo`) ou apontando para outra coisa.",
          },
          {
            pergunta: "Por que as arrow functions resolvem?",
            resposta:
              "Porque elas **não têm `this` próprio**: tratam `this` como uma variável comum e o pegam do escopo onde foram escritas. Dentro de um método, um callback arrow mantém o `this` do método, não importa quem o chame, e `call`, `apply` e `bind` não o alteram. O custo: arrow não serve como método de objeto ou de protótipo (o `this` seria o do escopo externo) nem como construtor.",
          },
          {
            pergunta: "Por que isso apareceu tanto nos componentes de classe do React?",
            resposta:
              "Porque `<button onClick={this.aoClicar}>` passa só a função, e o React a chama sem receptor. Métodos de classe rodam em modo estrito, então `this` é `undefined` e `this.setState` quebra. As saídas eram `bind` no construtor, um **campo arrow** (`aoClicar = () => {…}`) ou uma arrow no JSX (que cria uma função nova a cada render). Componentes de função e hooks eliminam o problema: usam closures, não `this` (veja L11 e G08).",
          },
          {
            pergunta: "Por que o modo estrito importa?",
            resposta:
              "Porque, fora dele, uma chamada simples recebe o **objeto global** como `this`, e `this.x = 1` cria uma variável global sem erro. Em modo estrito (e em módulos ES e corpos de classe, que são sempre estritos), `this` fica `undefined` e o erro aparece na hora. Falhar alto torna o problema óbvio em vez de escondê-lo.",
          },
        ],
        causaRaiz:
          "`this` é decidido **na chamada**, não na escrita da função. A exceção é a arrow function, que o decide **na escrita**. Quase todo problema vem de misturar as duas ideias.",
      },
      {
        tipo: "tabela",
        titulo: "Quem decide o valor de this",
        colunas: ["Forma de chamada", "Valor de `this`", "Exemplo"],
        linhas: [
          ["Chamada simples", "`undefined` (modo estrito) ou o objeto global (modo não estrito)", "`f()`"],
          ["Método de objeto", "O objeto à esquerda do ponto", "`obj.f()`"],
          ["Construtor", "O novo objeto criado", "`new F()`"],
          ["`call` e `apply`", "O primeiro argumento, escolhido por você", "`f.call(x, 1)`"],
          ["`bind`", "Uma nova função com `this` fixo", "`const g = f.bind(x)`"],
          ["Arrow function", "O `this` do escopo onde foi escrita; ninguém o muda", "`() => this.x`"],
          [
            "Handler de evento do DOM (função comum)",
            "O elemento que recebeu o evento",
            "`el.addEventListener('click', function () {…})`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Perdendo e recuperando o contexto",
        legenda: "JavaScript",
        codigo: `const conta = {
  saldo: 100,
  mostrar() {
    return this.saldo;
  },
};

conta.mostrar(); // 100: chamada com receptor
const solta = conta.mostrar;
solta(); // sem receptor: TypeError no modo estrito (e undefined fora dele)
setTimeout(conta.mostrar, 0); // quem chama é o timer: o this não é conta
setTimeout(() => conta.mostrar(), 0); // 100: a chamada ainda tem o receptor
setTimeout(conta.mostrar.bind(conta), 0); // 100: this fixado por bind`,
      },
      {
        tipo: "codigo",
        titulo: "O mesmo problema num componente de classe",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class Contador extends Component {
  state = { n: 0 };

  // Método comum: o React o chama sem receptor, e o this é undefined
  errado() {
    this.setState({ n: this.state.n + 1 });
  }

  // Campo arrow: this fixado na instância, na hora da criação
  certo = () => this.setState((s) => ({ n: s.n + 1 }));

  render() {
    return <button onClick={this.certo}>{this.state.n}</button>; // com this.errado, quebraria
  }
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Boas práticas",
        texto:
          "1) Prefira **componentes de função e hooks** no React: sem `this`. 2) Em classes, use campos arrow ou `bind` no construtor para os handlers. 3) Passe callbacks como arrow quando precisar do `this` de fora, e **não** use arrow como método de objeto, de protótipo ou como construtor. 4) Use módulos e classes (já estritos) e ative `noImplicitThis` no TypeScript. 5) Se precisa de `this` numa função solta, passe o dado como parâmetro ou use `bind`/`call` de forma explícita.",
      },
    ],
    armadilhas: [
      "Passar `obj.metodo` como callback (`setTimeout`, `.map`, handler) e esperar que o `this` seja `obj`.",
      "Usar arrow function como método de objeto: o `this` é o do escopo externo (por exemplo, `undefined` num módulo), não o objeto.",
      "Esquecer o `bind` (ou o campo arrow) num handler de classe do React e ficar com `this` indefinido em `setState`.",
      "Confiar no `this` global de uma chamada simples fora do modo estrito: variáveis globais são escritas por acidente.",
    ],
    autoteste: [
      {
        pergunta: "Por que `const f = obj.metodo; f()` quebra?",
        resposta:
          "Porque a chamada `f()` não tem receptor. O `this` é decidido pela chamada e, sem o “`obj.`”, fica `undefined` (modo estrito) ou global. Use `obj.metodo()`, `bind` ou uma arrow.",
      },
      {
        pergunta: "Qual é a diferença entre `bind` e uma arrow function para fixar o `this`?",
        resposta:
          "A arrow herda o `this` do lugar onde foi escrita; o `bind` fixa o que você passar, em qualquer lugar, e devolve uma nova função.",
      },
    ],
  },
  en: {
    titulo: "Pitfalls of the this keyword",
    pergunta: 'What are some problems with the "this" keyword in JavaScript?',
    porqueEsteMetodo:
      "`this` looks capricious until you see the rule that governs it: it is decided at call time. The chain of whys explains the symptoms (lost context, `bind`, arrow functions, React class handlers) from that rule.",
    resposta30s:
      "In JavaScript, the value of `this` is set **by how the function is called**, not by where it was written: `obj.method()` uses `obj`; a plain call uses `undefined` (strict mode) or the global object; `new` creates an object; `call`, `apply` and `bind` choose explicitly. That is why a **method passed as a callback loses its context** (`setTimeout`, handlers). **Arrow functions** have no `this` of their own and use the one from the scope where they were born; this is where `bind` and arrow class fields in React class components came from.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does the value of `this` change with the way the function is called?",
            resposta:
              "Because `this` is not a variable resolved through scope: it is a **hidden parameter** each call receives, the *receiver*. A function in JavaScript is just a value that can be stored in several objects, or in none, and it does not know whom it “belongs” to. The **call site** decides: `obj.f()` passes `obj`; `f()` passes nothing; `new F()` passes a new object; `f.call(x)` passes `x`.",
          },
          {
            pergunta: "Why does a method lose `this` when it becomes a callback?",
            resposta:
              "Because writing `const f = obj.method` or `setTimeout(obj.method, 0)` passes **only the function**; the “`obj.`” was left behind. Whoever calls it (the timer, the browser, a handler) knows nothing about `obj` and makes a call with no receiver, or with its own, such as the DOM element in a regular handler. The result is an undefined `this` (an error when reading `this.field`) or one pointing at something else.",
          },
          {
            pergunta: "Why do arrow functions fix it?",
            resposta:
              "Because they **have no `this` of their own**: they treat `this` like an ordinary variable and take it from the scope where they were written. Inside a method, an arrow callback keeps the method’s `this` no matter who calls it, and `call`, `apply` and `bind` do not change it. The cost: an arrow does not work as an object or prototype method (its `this` would be the outer scope’s) or as a constructor.",
          },
          {
            pergunta: "Why did this show up so much in React class components?",
            resposta:
              "Because `<button onClick={this.handleClick}>` passes only the function, and React calls it with no receiver. Class methods run in strict mode, so `this` is `undefined` and `this.setState` breaks. The ways out were `bind` in the constructor, an **arrow field** (`handleClick = () => {…}`) or an arrow in the JSX (which creates a new function on every render). Function components and hooks remove the problem: they use closures, not `this` (see L11 and G08).",
          },
          {
            pergunta: "Why does strict mode matter?",
            resposta:
              "Because outside it, a plain call receives the **global object** as `this`, and `this.x = 1` quietly creates a global variable. In strict mode (and in ES modules and class bodies, which are always strict), `this` is `undefined` and the error shows up right away. Failing loudly makes the problem obvious instead of hiding it.",
          },
        ],
        causaRaiz:
          "`this` is decided **at the call**, not when the function is written. The exception is the arrow function, which decides it **when written**. Almost every problem comes from mixing the two ideas.",
      },
      {
        tipo: "tabela",
        titulo: "What decides the value of this",
        colunas: ["Way of calling", "Value of `this`", "Example"],
        linhas: [
          ["Plain call", "`undefined` (strict mode) or the global object (non-strict mode)", "`f()`"],
          ["Object method", "The object to the left of the dot", "`obj.f()`"],
          ["Constructor", "The new object created", "`new F()`"],
          ["`call` and `apply`", "The first argument, chosen by you", "`f.call(x, 1)`"],
          ["`bind`", "A new function with a fixed `this`", "`const g = f.bind(x)`"],
          ["Arrow function", "The `this` of the scope where it was written; nobody can change it", "`() => this.x`"],
          [
            "DOM event handler (regular function)",
            "The element that received the event",
            "`el.addEventListener('click', function () {…})`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Losing and recovering the context",
        legenda: "JavaScript",
        codigo: `const account = {
  balance: 100,
  show() {
    return this.balance;
  },
};

account.show(); // 100: called with a receiver
const loose = account.show;
loose(); // no receiver: TypeError in strict mode (and undefined outside it)
setTimeout(account.show, 0); // the timer is the caller: this is not account
setTimeout(() => account.show(), 0); // 100: the call still has the receiver
setTimeout(account.show.bind(account), 0); // 100: this fixed by bind`,
      },
      {
        tipo: "codigo",
        titulo: "The same problem in a class component",
        legenda: "JSX",
        codigo: `import { Component } from "react";

class Counter extends Component {
  state = { n: 0 };

  // Regular method: React calls it with no receiver, and this is undefined
  wrong() {
    this.setState({ n: this.state.n + 1 });
  }

  // Arrow field: this is fixed to the instance, at creation time
  right = () => this.setState((s) => ({ n: s.n + 1 }));

  render() {
    return <button onClick={this.right}>{this.state.n}</button>; // with this.wrong, it would break
  }
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Best practices",
        texto:
          "1) Prefer **function components and hooks** in React: no `this`. 2) In classes, use arrow fields or `bind` in the constructor for handlers. 3) Pass callbacks as arrows when you need the outer `this`, and **do not** use an arrow as an object method, a prototype method or a constructor. 4) Use modules and classes (already strict) and turn on `noImplicitThis` in TypeScript. 5) If you need `this` in a loose function, pass the data as a parameter or use `bind`/`call` explicitly.",
      },
    ],
    armadilhas: [
      "Passing `obj.method` as a callback (`setTimeout`, `.map`, a handler) and expecting `this` to be `obj`.",
      "Using an arrow function as an object method: `this` is the outer scope’s (for example, `undefined` in a module), not the object.",
      "Forgetting the `bind` (or the arrow field) on a React class handler and getting an undefined `this` in `setState`.",
      "Relying on the global `this` of a plain call outside strict mode: global variables get written by accident.",
    ],
    autoteste: [
      {
        pergunta: "Why does `const f = obj.method; f()` break?",
        resposta:
          "Because the call `f()` has no receiver. `this` is decided by the call and, without the “`obj.`”, it is `undefined` (strict mode) or global. Use `obj.method()`, `bind` or an arrow.",
      },
      {
        pergunta: "What is the difference between `bind` and an arrow function for fixing `this`?",
        resposta:
          "An arrow inherits the `this` of the place where it was written; `bind` fixes whatever you pass, anywhere, and returns a new function.",
      },
    ],
  },
};
