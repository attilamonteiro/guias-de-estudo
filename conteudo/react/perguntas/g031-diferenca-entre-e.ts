import type { Pergunta } from "../../tipos";

// G31 · Diferença entre == e ===
export const g031: Pergunta = {
  numero: 331,
  modulo: "glassdoor-javascript",
  metodo: "compare",
  pt: {
    titulo: "Diferença entre == e ===",
    pergunta: "Qual é a diferença entre == e === em JavaScript?",
    porqueEsteMetodo:
      "A diferença é pequena na sintaxe e grande no efeito. A matriz mostra as duas igualdades lado a lado, os casos concretos mostram onde a coerção surpreende e a regra de decisão diz qual usar.",
    resposta30s:
      '`==` (igualdade abrangente) **converte os tipos** antes de comparar, então `0 == ""` e `"1" == 1` dão `true`; `===` (igualdade estrita) **não converte**, e valores de tipos diferentes nunca são iguais. Use **`===` por padrão**, porque é previsível, com a exceção comum de `valor == null`, que cobre `null` e `undefined` de uma vez. Objetos e arrays, nos dois casos, são comparados por **referência**.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "As duas igualdades lado a lado",
        colunas: ["Aspecto", "`==` (abrangente)", "`===` (estrita)"],
        linhas: [
          ["Conversão de tipos", "Sim, quando os tipos diferem (segue regras próprias)", "Nunca"],
          ["Tipos diferentes", "Podem dar `true` depois da conversão", "Sempre `false`"],
          ["Mesmo tipo", "Igual ao `===`", "Compara o valor (primitivos) ou a referência (objetos)"],
          ["`NaN`", "`NaN == NaN` é `false`", "`NaN === NaN` é `false`"],
          ["Previsibilidade", "Exige decorar as regras de coerção", "Fácil de ler e de raciocinar"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde a coerção surpreende",
        colunas: ["Expressão", "`==`", "`===`", "Por quê"],
        linhas: [
          ['`1 == "1"`', "`true`", "`false`", "A string vira número antes de comparar"],
          ['`0 == ""`', "`true`", "`false`", "A string vazia vira `0`"],
          ['`false == "0"`', "`true`", "`false`", "Os dois lados viram o número `0`"],
          ["`[] == false`", "`true`", "`false`", "O array vira texto vazio e depois `0`; o `false` também vira `0`"],
          ["`null == undefined`", "`true`", "`false`", "Regra especial: só se igualam entre si"],
          ["`null == 0`", "`false`", "`false`", "`null` só é igual a `undefined` na igualdade abrangente"],
          ["`NaN == NaN`", "`false`", "`false`", "`NaN` nunca é igual a nada, nem a ele mesmo; use `Number.isNaN`"],
          ["`{} == {}`", "`false`", "`false`", "Objetos são comparados por referência: são dois objetos diferentes"],
          [
            '`"" == "0"`',
            "`false`",
            "`false`",
            'Mesmo tipo: sem conversão. Note que `0 == ""` e `0 == "0"` são `true`, mas as duas strings não se igualam',
          ],
        ],
        nota: "A igualdade abrangente não é transitiva, e é por isso que decorar as regras não compensa.",
      },
      {
        tipo: "codigo",
        titulo: "A exceção do null, Object.is e a ligação com o React",
        legenda: "JavaScript",
        codigo: `// null e undefined de uma vez (a exceção aceita ao ===)
if (valor == null) return "vazio";

// Object.is: quase igual a ===, com dois casos diferentes
Object.is(NaN, NaN); // true  (com === seria false)
Object.is(0, -0); // false (com === seria true)

// O React compara estado e dependências com Object.is: por referência
const [lista, setLista] = useState([1, 2]);
lista.push(3);
setLista(lista); // mesma referência: nada re-renderiza
setLista([...lista, 4]); // nova referência: re-renderiza`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use `===` e `!==` sempre, por padrão. A única exceção defensável é `x == null` (e `x != null`) para tratar `null` e `undefined` juntos, que muitos guias de estilo permitem de forma explícita (a regra `eqeqeq` do ESLint pode ser configurada assim). Para converter, faça-o de modo visível (`Number(x)`, `String(x)`) e compare com `===`. Use `Object.is` quando a diferença entre `NaN` e `±0` importar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidado com o que “parece igual”",
        texto:
          "`===` em objetos e arrays compara **referência**, não conteúdo: `[1] === [1]` é `false`, e é por isso que alterar um objeto no lugar não re-renderiza no React. E `NaN` nunca é igual a si mesmo: use `Number.isNaN(x)`. Comparar conteúdo exige uma função própria ou uma biblioteca.",
      },
    ],
    armadilhas: [
      'Usar `==` por hábito e ser pego por `0 == ""`, `false == "0"` ou `[] == false`.',
      "Comparar objetos ou arrays com `===` esperando comparar o conteúdo (`[1] === [1]` é `false`).",
      "Testar `x === NaN`, que é sempre `false`: use `Number.isNaN(x)` ou `Object.is(x, NaN)`.",
      'Achar que `==` é transitivo: `0 == ""` e `0 == "0"` são `true`, mas `"" == "0"` é `false`.',
    ],
    autoteste: [
      {
        pergunta: "O que `null == undefined` e `null === undefined` retornam?",
        resposta:
          "`true` e `false`. Na igualdade abrangente eles só se igualam entre si; na estrita, são tipos diferentes.",
      },
      {
        pergunta: "Por que `setLista(lista)` depois de `lista.push(x)` não atualiza a tela?",
        resposta:
          "Porque o React compara o novo estado com o antigo por referência (`Object.is`) e o array é o mesmo objeto. É preciso criar um novo array.",
      },
    ],
  },
  en: {
    titulo: "Difference between == and ===",
    pergunta: "What is the difference between == and === in JavaScript?",
    porqueEsteMetodo:
      "The difference is small in syntax and large in effect. The matrix shows the two equalities side by side, the concrete cases show where coercion surprises you and the decision rule says which to use.",
    resposta30s:
      '`==` (loose equality) **converts the types** before comparing, so `0 == ""` and `"1" == 1` are `true`; `===` (strict equality) **does not convert**, so values of different types are never equal. Use **`===` by default**, because it is predictable, with the common exception of `value == null`, which covers `null` and `undefined` at once. Objects and arrays, in both cases, are compared by **reference**.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "The two equalities side by side",
        colunas: ["Aspect", "`==` (loose)", "`===` (strict)"],
        linhas: [
          ["Type conversion", "Yes, when the types differ (following its own rules)", "Never"],
          ["Different types", "Can give `true` after conversion", "Always `false`"],
          ["Same type", "Same as `===`", "Compares the value (primitives) or the reference (objects)"],
          ["`NaN`", "`NaN == NaN` is `false`", "`NaN === NaN` is `false`"],
          ["Predictability", "You must memorize the coercion rules", "Easy to read and reason about"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where coercion surprises",
        colunas: ["Expression", "`==`", "`===`", "Why"],
        linhas: [
          ['`1 == "1"`', "`true`", "`false`", "The string becomes a number before comparing"],
          ['`0 == ""`', "`true`", "`false`", "The empty string becomes `0`"],
          ['`false == "0"`', "`true`", "`false`", "Both sides become the number `0`"],
          [
            "`[] == false`",
            "`true`",
            "`false`",
            "The array becomes an empty string and then `0`; `false` also becomes `0`",
          ],
          ["`null == undefined`", "`true`", "`false`", "A special rule: they equal only each other"],
          ["`null == 0`", "`false`", "`false`", "`null` equals only `undefined` under loose equality"],
          [
            "`NaN == NaN`",
            "`false`",
            "`false`",
            "`NaN` is never equal to anything, not even itself; use `Number.isNaN`",
          ],
          ["`{} == {}`", "`false`", "`false`", "Objects are compared by reference: these are two different objects"],
          [
            '`"" == "0"`',
            "`false`",
            "`false`",
            'Same type: no conversion. Note that `0 == ""` and `0 == "0"` are `true`, yet the two strings are not equal',
          ],
        ],
        nota: "Loose equality is not transitive, which is why memorizing the rules is not worth it.",
      },
      {
        tipo: "codigo",
        titulo: "The null exception, Object.is and the link to React",
        legenda: "JavaScript",
        codigo: `// null and undefined at once (the accepted exception to ===)
if (value == null) return "empty";

// Object.is: almost the same as ===, with two different cases
Object.is(NaN, NaN); // true  (=== would give false)
Object.is(0, -0); // false (=== would give true)

// React compares state and dependencies with Object.is: by reference
const [list, setList] = useState([1, 2]);
list.push(3);
setList(list); // same reference: nothing re-renders
setList([...list, 4]); // new reference: re-renders`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use `===` and `!==` always, by default. The only defensible exception is `x == null` (and `x != null`) to handle `null` and `undefined` together, which many style guides allow explicitly (ESLint’s `eqeqeq` rule can be configured that way). To convert, do it visibly (`Number(x)`, `String(x)`) and compare with `===`. Use `Object.is` when the difference between `NaN` and `±0` matters.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Watch out for what “looks equal”",
        texto:
          "`===` on objects and arrays compares **references**, not contents: `[1] === [1]` is `false`, and that is why mutating an object in place does not re-render in React. And `NaN` is never equal to itself: use `Number.isNaN(x)`. Comparing contents takes a function of your own or a library.",
      },
    ],
    armadilhas: [
      'Using `==` out of habit and getting caught by `0 == ""`, `false == "0"` or `[] == false`.',
      "Comparing objects or arrays with `===` expecting to compare contents (`[1] === [1]` is `false`).",
      "Testing `x === NaN`, which is always `false`: use `Number.isNaN(x)` or `Object.is(x, NaN)`.",
      'Thinking `==` is transitive: `0 == ""` and `0 == "0"` are `true`, but `"" == "0"` is `false`.',
    ],
    autoteste: [
      {
        pergunta: "What do `null == undefined` and `null === undefined` return?",
        resposta:
          "`true` and `false`. Under loose equality they equal only each other; under strict equality they are different types.",
      },
      {
        pergunta: "Why does `setList(list)` after `list.push(x)` not update the screen?",
        resposta:
          "Because React compares the new state with the old one by reference (`Object.is`) and the array is the same object. You must create a new array.",
      },
    ],
  },
};
