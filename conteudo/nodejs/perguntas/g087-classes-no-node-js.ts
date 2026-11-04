import type { Pergunta } from "../../tipos";

// G87 · Classes no Node.js
export const g087: Pergunta = {
  numero: 687,
  modulo: "gist-especialista",
  metodo: "feynman",
  pt: {
    titulo: "Classes no Node.js",
    pergunta: "É possível usar “Class” no Node.js?",
    porqueEsteMetodo:
      "Classe é um conceito que muita gente já conhece de outras linguagens, e por isso a pergunta se resolve com uma imagem simples. O ponto interessante é onde a imagem engana: em JavaScript, a classe é uma forma mais agradável de escrever protótipos, não um mecanismo separado.",
    resposta30s:
      "**Sim.** `class` faz parte da linguagem JavaScript desde o ES2015 e o V8, o motor do Node.js, a suporta há muito tempo; não é um recurso do Node em si. Por baixo, é uma função construtora com **protótipos**, escrita com uma sintaxe mais clara (`constructor`, `extends`, `super`, `static`, getters e setters, campos privados `#x`). O próprio Node a usa (`EventEmitter`, `Error`, streams), e você a exporta como qualquer outro valor, em CommonJS ou ESM.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa forma de bolo. A forma define o formato e as instruções que todos os bolos compartilham; cada vez que você a usa (`new`), sai um bolo novo, com o seu próprio recheio. As instruções ficam guardadas num lugar só, na forma, e não repetidas dentro de cada bolo.",
        tecnico:
          "`class Pedido { ... }` cria uma função construtora; os métodos ficam no `prototype` e são **compartilhados** pelas instâncias, enquanto os campos pertencem a cada objeto. `extends` liga os protótipos e `super` chama o construtor ou o método da classe-mãe. Há `static` (membros da classe, não da instância), getters e setters, campos de instância e campos privados com `#`. Como é um recurso da linguagem, funciona em qualquer ambiente que rode JavaScript moderno, não só no Node.",
        limite:
          "Em JavaScript não existe a “forma” separada dos “bolos”: a classe é uma função e as instâncias herdam de outros objetos, não de moldes. E `class` não é só açúcar: chamá-la sem `new` lança erro, ela não pode ser usada antes de ser declarada, o corpo roda em modo estrito e os campos `#privados` não têm equivalente direto em protótipos.",
      },
      {
        tipo: "tabela",
        titulo: "Classes que você encontra (e escreve) no Node.js",
        colunas: ["Onde aparece", "Exemplo", "O que a classe dá"],
        linhas: [
          [
            "Eventos",
            "`class Pedido extends EventEmitter`",
            "Herda `on`, `once` e `emit`: o seu objeto vira uma fonte de eventos (veja T61)",
          ],
          [
            "Erros próprios",
            "`class ErroDePedido extends Error`",
            "Um tipo identificável com `instanceof`, com `name` e, se quiser, `cause`, sem perder o `stack`",
          ],
          [
            "Streams",
            "`class Maiusculas extends Transform`",
            "Implementa `_transform` e participa de `pipeline` como qualquer stream (veja T37)",
          ],
          [
            "Serviços e adaptadores",
            "`class RepositorioDePedidos` com `constructor(db)`",
            "Agrupa estado e métodos; as dependências chegam pelo construtor (veja G88)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Herança, campo privado, getter e erro próprio",
        legenda: "JavaScript",
        codigo: [
          'import { EventEmitter } from "node:events";',
          "",
          "class ErroDePedido extends Error {",
          '  name = "ErroDePedido"; // campo de instância',
          "}",
          "",
          "class Pedido extends EventEmitter {",
          "  #itens = []; // campo privado: invisível fora da classe",
          "",
          "  adicionar(sku, quantidade) {",
          "    if (quantidade <= 0) throw new ErroDePedido(`quantidade inválida: ${sku}`);",
          "    this.#itens.push({ sku, quantidade });",
          '    this.emit("item", sku);',
          "    return this;",
          "  }",
          "",
          "  get total() { return this.#itens.length; }",
          "}",
          "",
          'new Pedido().on("item", (sku) => console.log("adicionado", sku)).adicionar("A1", 2);',
        ].join("\n"),
        nota: "`on` devolve o próprio emissor, por isso o encadeamento funciona. Fora da classe, `pedido.#itens` nem compila: é erro de sintaxe, não só um campo escondido.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Exportar e importar classes",
        texto:
          'Em **CommonJS**: `module.exports = Pedido;` (um item) ou `module.exports = { Pedido, ErroDePedido };`, e `const Pedido = require("./pedido")`. Em **módulos ES**: `export class Pedido {}` com `import { Pedido } from "./pedido.js"`, ou `export default`. O sistema de módulos é independente das classes: a classe é só mais um valor que você exporta.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Armadilhas que a sintaxe esconde",
        texto:
          '**`this` se perde** quando o método é passado como callback (`setTimeout(obj.metodo)`, `emissor.on("x", obj.metodo)`): use arrow function, `bind` ou um campo com arrow function. **Classe não é içada como função**: usá-la antes da declaração lança `ReferenceError`. **`new` é obrigatório**: chamar a classe como função lança `TypeError`. **Herança profunda** acopla demais; estender `EventEmitter`, `Error` ou `Transform` é comum, mas prefira composição para o resto.',
      },
    ],
    armadilhas: [
      "Passar um método como callback e perder o `this`: o método extraído do objeto não leva o objeto junto.",
      "Chamar a classe sem `new`, ou usá-la antes da linha em que é declarada: em ambos os casos o resultado é um erro.",
      "Tratar `_campo` como privado: é só convenção e continua acessível; privado de verdade é `#campo`, que também não aparece em `Object.keys` nem em `JSON.stringify`.",
      "Montar hierarquias de herança profundas para reaproveitar código: mudanças na classe-mãe quebram as filhas; prefira composição.",
    ],
    autoteste: [
      {
        pergunta: "É possível usar `class` no Node.js? De quem é esse recurso?",
        resposta:
          "É possível. `class` é um recurso da linguagem JavaScript (ES2015), que o V8 implementa; não é do Node em si. Por baixo, é uma função construtora com protótipos, escrita com sintaxe mais clara.",
      },
      {
        pergunta: 'Por que `emissor.on("x", obj.metodo)` pode perder o `this` esperado?',
        resposta:
          "Porque `this` depende de como a função é chamada, não de onde ela foi definida. O `EventEmitter` chama o listener com `this` apontando para o emissor, não para `obj`. Use uma arrow function, `bind` ou um campo com arrow function.",
      },
    ],
  },
  en: {
    titulo: "Classes in Node.js",
    pergunta: 'Is it possible to use "Class" in Node.js?',
    porqueEsteMetodo:
      "Classes are something many people already know from other languages, so a simple picture settles the question. The interesting part is where the picture misleads: in JavaScript, a class is a nicer way to write prototypes, not a separate mechanism.",
    resposta30s:
      "**Yes.** `class` has been part of the JavaScript language since ES2015, and V8, Node.js's engine, has supported it for a long time; it is not a Node feature as such. Underneath, it is a constructor function with **prototypes**, written with clearer syntax (`constructor`, `extends`, `super`, `static`, getters and setters, `#x` private fields). Node itself uses it (`EventEmitter`, `Error`, streams), and you export it like any other value, in CommonJS or ESM.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a cake mold. The mold defines the shape and the instructions that all cakes share; every time you use it (`new`), a new cake comes out, with its own filling. The instructions are kept in one place, in the mold, and not repeated inside each cake.",
        tecnico:
          "`class Order { ... }` creates a constructor function; the methods live on the `prototype` and are **shared** by the instances, while fields belong to each object. `extends` links the prototypes and `super` calls the parent class's constructor or method. There is `static` (members of the class, not of the instance), getters and setters, instance fields and private fields with `#`. Since it is a language feature, it works in any environment that runs modern JavaScript, not only Node.",
        limite:
          "In JavaScript there is no “mold” separate from the “cakes”: the class is a function and instances inherit from other objects, not from molds. And `class` is not just sugar: calling it without `new` throws, it cannot be used before it is declared, its body runs in strict mode and `#private` fields have no direct prototype equivalent.",
      },
      {
        tipo: "tabela",
        titulo: "Classes you meet (and write) in Node.js",
        colunas: ["Where it shows up", "Example", "What the class gives you"],
        linhas: [
          [
            "Events",
            "`class Order extends EventEmitter`",
            "Inherits `on`, `once` and `emit`: your object becomes an event source (see T61)",
          ],
          [
            "Custom errors",
            "`class OrderError extends Error`",
            "An identifiable type with `instanceof`, with `name` and, if you want, `cause`, without losing the `stack`",
          ],
          [
            "Streams",
            "`class Uppercase extends Transform`",
            "Implements `_transform` and takes part in `pipeline` like any stream (see T37)",
          ],
          [
            "Services and adapters",
            "`class OrderRepository` with `constructor(db)`",
            "Groups state and methods; dependencies arrive through the constructor (see G88)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Inheritance, a private field, a getter and a custom error",
        legenda: "JavaScript",
        codigo: [
          'import { EventEmitter } from "node:events";',
          "",
          "class OrderError extends Error {",
          '  name = "OrderError"; // instance field',
          "}",
          "",
          "class Order extends EventEmitter {",
          "  #items = []; // private field: invisible outside the class",
          "",
          "  add(sku, quantity) {",
          "    if (quantity <= 0) throw new OrderError(`invalid quantity: ${sku}`);",
          "    this.#items.push({ sku, quantity });",
          '    this.emit("item", sku);',
          "    return this;",
          "  }",
          "",
          "  get total() { return this.#items.length; }",
          "}",
          "",
          'new Order().on("item", (sku) => console.log("added", sku)).add("A1", 2);',
        ].join("\n"),
        nota: "`on` returns the emitter itself, which is why the chaining works. Outside the class, `order.#items` does not even compile: it is a syntax error, not just a hidden field.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Exporting and importing classes",
        texto:
          'In **CommonJS**: `module.exports = Order;` (a single item) or `module.exports = { Order, OrderError };`, and `const Order = require("./order")`. In **ES modules**: `export class Order {}` with `import { Order } from "./order.js"`, or `export default`. The module system is independent of classes: a class is just one more value you export.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Traps the syntax hides",
        texto:
          '**`this` gets lost** when a method is passed as a callback (`setTimeout(obj.method)`, `emitter.on("x", obj.method)`): use an arrow function, `bind` or a field holding an arrow function. **A class is not hoisted like a function**: using it before its declaration throws `ReferenceError`. **`new` is mandatory**: calling the class as a function throws `TypeError`. **Deep inheritance** couples too much; extending `EventEmitter`, `Error` or `Transform` is common, but prefer composition for everything else.',
      },
    ],
    armadilhas: [
      "Passing a method as a callback and losing `this`: a method pulled out of its object does not carry the object along.",
      "Calling the class without `new`, or using it before the line where it is declared: either way the result is an error.",
      "Treating `_field` as private: it is only a convention and stays accessible; truly private is `#field`, which also does not show up in `Object.keys` or `JSON.stringify`.",
      "Building deep inheritance hierarchies to reuse code: changes in the parent class break the children; prefer composition.",
    ],
    autoteste: [
      {
        pergunta: "Can you use `class` in Node.js? Whose feature is it?",
        resposta:
          "You can. `class` is a feature of the JavaScript language (ES2015), implemented by V8; it is not Node's own. Underneath, it is a constructor function with prototypes, written with clearer syntax.",
      },
      {
        pergunta: 'Why can `emitter.on("x", obj.method)` lose the expected `this`?',
        resposta:
          "Because `this` depends on how the function is called, not on where it was defined. `EventEmitter` calls the listener with `this` pointing to the emitter, not to `obj`. Use an arrow function, `bind` or a field holding an arrow function.",
      },
    ],
  },
};
