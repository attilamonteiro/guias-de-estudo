import type { Pergunta } from "../../tipos";

// Q42 · module.exports
export const q42: Pergunta = {
  numero: 42,
  modulo: "turing-avancadas",
  metodo: "trace",
  pt: {
    titulo: "module.exports",
    pergunta: "Qual é a função do module.exports?",
    porqueEsteMetodo:
      "`module.exports` só faz sentido dentro de uma chamada de `require`. Seguir um único `require` do começo ao fim mostra de onde vem o valor devolvido, por que há cache e onde as coisas dão errado.",
    resposta30s:
      "`module.exports` é **o valor que `require` devolve** para quem importa o arquivo. Cada arquivo CommonJS é um módulo com escopo próprio, e só sai dele o que você atribui a `module.exports` (um objeto, uma função, uma classe). `exports` é apenas um atalho que, no início, aponta para o mesmo objeto: **reatribuir `exports` não exporta nada**. O resultado fica em **cache**, então o arquivo executa uma vez só.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: 'Seguindo um require: const soma = require("./soma")',
        etapas: [
          "O Node.js **resolve o caminho**: `./soma` vira `/projeto/soma.js` (tenta `.js`, `.json`, `.node` e uma pasta com `index.js`). Módulo nativo (`node:fs`) é devolvido direto; nome sem `./` (como `express`) é procurado em `node_modules`, subindo as pastas",
          "Consulta o **cache** (`require.cache`) pelo caminho completo. Se o módulo já está lá, devolve o `module.exports` guardado e o arquivo **não roda de novo**",
          "Se não está, cria um objeto `module` com `module.exports = {}`, e `exports` aponta para esse mesmo objeto. O módulo entra no cache **antes** de executar",
          "Embrulha o código do arquivo numa função com os parâmetros `exports`, `require`, `module`, `__filename` e `__dirname`, e a executa",
          "O código atribui o que quer expor: `module.exports = ...` ou `exports.nome = ...`",
          "O `require` devolve o valor que `module.exports` tem **ao fim da execução**, qualquer que seja o seu tipo",
        ],
        nota: "O embrulho em função é o que dá a cada arquivo seu escopo próprio: as variáveis de `soma.js` não vazam para o global (veja Q51).",
      },
      {
        tipo: "passos",
        titulo: "Quando algo dá errado",
        passos: [
          {
            titulo: "Reatribuiu `exports`",
            texto:
              "`exports = função` troca só a variável local. O `require` devolve `module.exports`, que continua sendo o `{}` original, e o chamador recebe `TypeError: soma is not a function`.",
          },
          {
            titulo: "Arquivo não encontrado",
            texto:
              "Nenhum candidato existe: o Node.js lança `Error: Cannot find module` (código `MODULE_NOT_FOUND`), e a mensagem traz a “Require stack”, a lista de arquivos que levaram até o `require` que falhou.",
          },
          {
            titulo: "Dependência circular",
            texto:
              "`a` requer `b`, e `b` requer `a` antes de `a` terminar. Como `a` já está no cache, `b` recebe o `module.exports` **parcial** de `a` (o que já havia sido atribuído até ali), muitas vezes um objeto vazio.",
          },
          {
            titulo: "Estado compartilhado pelo cache",
            texto:
              'Dois arquivos que fazem `require("./config")` recebem **o mesmo objeto**. Uma mudança feita por um aparece para o outro, o que serve de singleton, mas surpreende em testes.',
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Exportando e importando",
        legenda: "JavaScript",
        codigo:
          '// soma.js\nconst PI = 3.14159;\n\nfunction somar(a, b) {\n  return a + b;\n}\n\nmodule.exports = { somar, PI }; // o que o require vai devolver\n\n// app.js\nconst { somar, PI } = require("./soma");\nconsole.log(somar(2, 3), PI);',
      },
      {
        tipo: "codigo",
        titulo: "O erro clássico com exports",
        legenda: "JavaScript",
        codigo:
          "// ERRADO: reatribui só a variável local, o require não vê\nexports = function () {};\n\n// CERTO: troque o valor exportado...\nmodule.exports = function () {};\n\n// ...ou acrescente propriedades ao objeto original\nexports.somar = (a, b) => a + b;",
        nota: "São alternativas, não um único arquivo: escolha uma. Misturar `module.exports = x` com um `exports.y = ...` posterior descarta o `y`, porque `exports` ainda aponta para o objeto antigo.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "module.exports vs exports",
        texto:
          "No início `exports === module.exports`, os dois apontam para o mesmo objeto. Você pode **acrescentar propriedades** por qualquer um. Para **trocar o valor exportado inteiro** (uma função ou uma classe), só `module.exports = ...` funciona, porque o `require` sempre lê `module.exports`.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "E nos ES Modules?",
        texto:
          'Em arquivos ESM (`.mjs`, ou `"type": "module"` no `package.json`) não existem `module` nem `exports`: use `export` e `export default` e importe com `import`. Importar um módulo CommonJS de dentro de ESM entrega o valor de `module.exports` como export padrão (`default`).',
      },
    ],
    armadilhas: [
      "Escrever `exports = ...` esperando exportar: reatribuir `exports` quebra a ligação com `module.exports`.",
      "Misturar `module.exports = x` e depois `exports.y = ...`: o `y` vai para o objeto antigo e se perde.",
      "Supor que o módulo roda a cada `require`: ele roda uma vez, e o objeto exportado é compartilhado por todos que o importam.",
      "Usar `module.exports` em arquivo ESM (ReferenceError) ou deixar dependências circulares receberem um `exports` ainda vazio; reorganize o código ou faça o `require` dentro da função que usa.",
    ],
    autoteste: [
      {
        pergunta: "Por que `exports = minhaFuncao` não funciona?",
        resposta:
          "`exports` é só uma variável local que começa apontando para o mesmo objeto de `module.exports`. Reatribuí-la não muda `module.exports`, que é o que o `require` devolve.",
      },
      {
        pergunta: 'Quantas vezes o código de `config.js` roda se dez arquivos fizerem `require("./config")`?',
        resposta:
          "Uma. Depois da primeira execução o módulo fica em `require.cache`, e os demais recebem o mesmo `module.exports`.",
      },
      {
        pergunta: "Qual é o equivalente em ES Modules?",
        resposta: "`export` (nomeado) e `export default`, importados com `import`.",
      },
    ],
  },
  en: {
    titulo: "module.exports",
    pergunta: "What does module.exports do?",
    porqueEsteMetodo:
      "`module.exports` only makes sense inside a `require` call. Following a single `require` from start to finish shows where the returned value comes from, why there is a cache and where things go wrong.",
    resposta30s:
      "`module.exports` is **the value that `require` returns** to whoever imports the file. Each CommonJS file is a module with its own scope, and only what you assign to `module.exports` (an object, a function, a class) comes out of it. `exports` is just a shortcut that initially points to the same object: **reassigning `exports` exports nothing**. The result is **cached**, so the file runs only once.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: 'Following a require: const sum = require("./sum")',
        etapas: [
          "Node.js **resolves the path**: `./sum` becomes `/project/sum.js` (it tries `.js`, `.json`, `.node` and a folder with `index.js`). A built-in module (`node:fs`) is returned directly; a bare name (like `express`) is looked up in `node_modules`, walking up the folders",
          "It checks the **cache** (`require.cache`) by full path. If the module is already there, it returns the stored `module.exports` and the file **does not run again**",
          "If not, it creates a `module` object with `module.exports = {}`, and `exports` points to that same object. The module enters the cache **before** it executes",
          "It wraps the file’s code in a function with the parameters `exports`, `require`, `module`, `__filename` and `__dirname`, and runs it",
          "The code assigns what it wants to expose: `module.exports = ...` or `exports.name = ...`",
          "`require` returns whatever value `module.exports` holds **when the run ends**, whatever its type",
        ],
        nota: "The function wrapper is what gives each file its own scope: the variables in `sum.js` do not leak into the global scope (see Q51).",
      },
      {
        tipo: "passos",
        titulo: "When something goes wrong",
        passos: [
          {
            titulo: "You reassigned `exports`",
            texto:
              "`exports = function` only changes the local variable. `require` returns `module.exports`, which is still the original `{}`, and the caller gets `TypeError: sum is not a function`.",
          },
          {
            titulo: "File not found",
            texto:
              "No candidate exists: Node.js throws `Error: Cannot find module` (code `MODULE_NOT_FOUND`), and the message carries the “Require stack”, the list of files that led to the failing `require`.",
          },
          {
            titulo: "Circular dependency",
            texto:
              "`a` requires `b`, and `b` requires `a` before `a` has finished. Since `a` is already in the cache, `b` receives `a`’s **partial** `module.exports` (whatever had been assigned so far), often an empty object.",
          },
          {
            titulo: "State shared through the cache",
            texto:
              'Two files that do `require("./config")` get **the same object**. A change made by one is visible to the other, which works as a singleton but surprises you in tests.',
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Exporting and importing",
        legenda: "JavaScript",
        codigo:
          '// sum.js\nconst PI = 3.14159;\n\nfunction sum(a, b) {\n  return a + b;\n}\n\nmodule.exports = { sum, PI }; // what require will return\n\n// app.js\nconst { sum, PI } = require("./sum");\nconsole.log(sum(2, 3), PI);',
      },
      {
        tipo: "codigo",
        titulo: "The classic mistake with exports",
        legenda: "JavaScript",
        codigo:
          "// WRONG: reassigns only the local variable, require does not see it\nexports = function () {};\n\n// RIGHT: replace the exported value...\nmodule.exports = function () {};\n\n// ...or add properties to the original object\nexports.sum = (a, b) => a + b;",
        nota: "These are alternatives, not a single file: pick one. Mixing `module.exports = x` with a later `exports.y = ...` discards `y`, because `exports` still points to the old object.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "module.exports vs exports",
        texto:
          "At the start `exports === module.exports`: both point to the same object. You can **add properties** through either one. To **replace the whole exported value** (a function or a class), only `module.exports = ...` works, because `require` always reads `module.exports`.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "And in ES Modules?",
        texto:
          'In ESM files (`.mjs`, or `"type": "module"` in `package.json`) there is no `module` or `exports`: use `export` and `export default`, and import with `import`. Importing a CommonJS module from ESM gives you the value of `module.exports` as the default export.',
      },
    ],
    armadilhas: [
      "Writing `exports = ...` and expecting to export: reassigning `exports` breaks the link with `module.exports`.",
      "Mixing `module.exports = x` and then `exports.y = ...`: `y` goes to the old object and is lost.",
      "Assuming the module runs on every `require`: it runs once, and the exported object is shared by everyone who imports it.",
      "Using `module.exports` in an ESM file (ReferenceError), or letting circular dependencies receive a still-empty `exports`; restructure the code or call `require` inside the function that uses it.",
    ],
    autoteste: [
      {
        pergunta: "Why does `exports = myFunction` not work?",
        resposta:
          "`exports` is only a local variable that starts out pointing to the same object as `module.exports`. Reassigning it does not change `module.exports`, which is what `require` returns.",
      },
      {
        pergunta: 'How many times does the code in `config.js` run if ten files do `require("./config")`?',
        resposta:
          "Once. After the first run the module sits in `require.cache`, and the others receive the same `module.exports`.",
      },
      {
        pergunta: "What is the equivalent in ES Modules?",
        resposta: "`export` (named) and `export default`, imported with `import`.",
      },
    ],
  },
};
