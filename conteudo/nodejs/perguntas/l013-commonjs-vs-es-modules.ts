import type { Pergunta } from "../../tipos";

// L13 · CommonJS e ES Modules
export const l013: Pergunta = {
  numero: 113,
  modulo: "linkedin-fundamentos",
  metodo: "compare",
  pt: {
    titulo: "CommonJS e ES Modules",
    pergunta: "O que são CommonJS e ES Modules?",
    porqueEsteMetodo:
      "São dois sistemas de módulos que resolvem o mesmo problema com regras diferentes. Uma matriz lado a lado mostra cada diferença, e a regra de decisão responde também à pergunta clássica sobre `require()` e `import`.",
    resposta30s:
      '**CommonJS** é o sistema original do Node.js (`require()` e `module.exports`, carregamento **síncrono** em tempo de execução); **ES Modules** é o padrão da linguagem JavaScript (`import`/`export`, grafo **estático** carregado de forma assíncrona, **bindings vivos** e `await` no nível superior). O Node.js suporta os dois, e o formato de cada arquivo vem da extensão ou do campo `"type"` do `package.json`. Em código novo, prefira ES Modules.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "CommonJS e ES Modules, lado a lado",
        colunas: ["Aspecto", "CommonJS", "ES Modules"],
        linhas: [
          ["Sintaxe", '`const x = require("x")` e `module.exports = …`', '`import x from "x"` e `export …`'],
          [
            "Quando carrega",
            "Em tempo de execução e de forma **síncrona**: `require` é uma função e pode estar dentro de um `if`",
            "O grafo é analisado **antes** de executar e carregado de forma assíncrona: `import` é uma declaração, içada para o topo; para carregar sob demanda, `import()`",
          ],
          [
            "O que você recebe",
            "O objeto `module.exports`; ao desestruturar, você **copia** o valor daquele instante",
            "**Bindings vivos**, somente leitura: se o módulo de origem muda a variável exportada, quem importou vê a mudança",
          ],
          [
            "Cache",
            "Cada arquivo executa uma vez; o próximo `require` devolve o mesmo `module.exports` (`require.cache`)",
            "Cada módulo é avaliado uma vez, num mapa de módulos interno; não há `require.cache`",
          ],
          [
            "Como o Node reconhece",
            '`.cjs`, ou `.js` com `"type": "commonjs"` (o tratamento padrão quando não há `"type"`)',
            '`.mjs`, ou `.js` com `"type": "module"`',
          ],
          [
            "Variáveis do módulo",
            "`__dirname`, `__filename`, `require`, `module` e `exports`",
            "Não existem; use `import.meta.url` (versões recentes também trazem `import.meta.dirname` e `import.meta.filename`)",
          ],
          ["`await` no nível superior", "Não", "Sim"],
          [
            "Caminho do arquivo",
            "Pode omitir `.js` e apontar para uma pasta (`index.js`)",
            "Caminhos relativos exigem a extensão completa",
          ],
        ],
        nota: "Versões recentes do Node.js também tentam detectar a sintaxe de um `.js` ambíguo; não dependa disso e declare o formato. Confira a documentação da sua versão em nodejs.org.",
      },
      {
        tipo: "codigo",
        titulo: "Cópia x binding vivo",
        legenda: "JavaScript",
        codigo: [
          "// contador.mjs (ES Modules)",
          "export let total = 0;",
          "export function somar() { total++; }",
          "",
          '// principal.mjs: import { total, somar } from "./contador.mjs";',
          "somar();",
          "console.log(total); // 1: binding vivo",
          "",
          "// contador.cjs (CommonJS)",
          "let total = 0;",
          "module.exports = { total, somar() { total++; } };",
          "",
          '// principal.cjs: const { total, somar } = require("./contador.cjs");',
          "somar();",
          "console.log(total); // 0: cópia do valor no momento do require",
        ].join("\n"),
        nota: "O `somar()` altera a variável do módulo nos dois casos. No ES Module, quem importou enxerga o novo valor; no CommonJS, a desestruturação já tinha copiado o `0`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          'Em código **novo**, use ES Modules: são o padrão do JavaScript, funcionam também no navegador e permitem análise estática e `await` no topo. Mantenha CommonJS onde já existe uma base grande em CommonJS ou uma ferramenta que o exige. Escolha **um formato por arquivo** e declare-o (extensão ou `"type"`) em vez de depender de detecção.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "require() não é import",
        texto:
          "A diferença que a entrevista cobra: `require()` é uma **função** executada em tempo de execução, síncrona, que devolve um objeto; `import` é uma **declaração** estática, avaliada antes do resto do código do módulo, e por isso não fica dentro de um `if` (para isso existe `import()`, que devolve uma promise). Na mistura, um ES Module consegue importar CommonJS (o `module.exports` vira o export padrão); o contrário, `require` de um ES Module, historicamente falha, e versões recentes aceitam em certos casos, então confira a documentação. O caminho que sempre funciona é o `import()` dinâmico. Detalhes em L81.",
      },
    ],
    armadilhas: [
      "Usar `__dirname`, `__filename` ou `require` dentro de um ES Module: dá `ReferenceError`. Use `import.meta.url` (ou `import.meta.dirname`, se a sua versão tiver).",
      'Esquecer a extensão em `import "./modulo"` num ES Module: a resolução falha, porque os caminhos relativos exigem o nome completo.',
      'Marcar o projeto com `"type": "module"` e quebrar os `.js` antigos que usam `require`: renomeie para `.cjs` ou converta para `import`.',
      "Achar que desestruturar um `require` mantém o vínculo com a variável original: é uma cópia do valor no momento da chamada.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `require()` e `import`?",
        resposta:
          "`require()` é uma função síncrona chamada em tempo de execução, que devolve `module.exports`. `import` é uma declaração estática, analisada antes da execução, com carregamento assíncrono e bindings vivos.",
      },
      {
        pergunta: "Como o Node.js decide se um arquivo `.js` é CommonJS ou ES Module?",
        resposta:
          'Pelo campo `"type"` do `package.json` mais próximo: `"module"` torna ES Module e, sem ele, o padrão é CommonJS. As extensões `.mjs` e `.cjs` valem sempre, qualquer que seja o `"type"`.',
      },
    ],
  },
  en: {
    titulo: "CommonJS and ES Modules",
    pergunta: "What are CommonJS and ES Modules?",
    porqueEsteMetodo:
      "They are two module systems that solve the same problem with different rules. A side-by-side matrix shows each difference, and the decision rule also answers the classic question about `require()` and `import`.",
    resposta30s:
      '**CommonJS** is the original Node.js module system (`require()` and `module.exports`, **synchronous** loading at run time); **ES Modules** is the JavaScript language standard (`import`/`export`, a **static** graph loaded asynchronously, **live bindings** and top-level `await`). Node.js supports both, and each file’s format comes from its extension or the `"type"` field in `package.json`. For new code, prefer ES Modules.',
    blocos: [
      {
        tipo: "tabela",
        titulo: "CommonJS and ES Modules, side by side",
        colunas: ["Aspect", "CommonJS", "ES Modules"],
        linhas: [
          ["Syntax", '`const x = require("x")` and `module.exports = …`', '`import x from "x"` and `export …`'],
          [
            "When it loads",
            "At run time and **synchronously**: `require` is a function and can sit inside an `if`",
            "The graph is analyzed **before** execution and loaded asynchronously: `import` is a declaration, hoisted to the top; to load on demand, use `import()`",
          ],
          [
            "What you get",
            "The `module.exports` object; when you destructure, you **copy** that moment’s value",
            "Read-only **live bindings**: if the source module changes the exported variable, the importer sees the change",
          ],
          [
            "Cache",
            "Each file runs once; the next `require` returns the same `module.exports` (`require.cache`)",
            "Each module is evaluated once, in an internal module map; there is no `require.cache`",
          ],
          [
            "How Node recognizes it",
            '`.cjs`, or `.js` with `"type": "commonjs"` (the default treatment when there is no `"type"`)',
            '`.mjs`, or `.js` with `"type": "module"`',
          ],
          [
            "Module variables",
            "`__dirname`, `__filename`, `require`, `module` and `exports`",
            "They do not exist; use `import.meta.url` (recent versions also offer `import.meta.dirname` and `import.meta.filename`)",
          ],
          ["Top-level `await`", "No", "Yes"],
          [
            "File path",
            "Can omit `.js` and point to a folder (`index.js`)",
            "Relative paths require the full extension",
          ],
        ],
        nota: "Recent Node.js versions also try to detect the syntax of an ambiguous `.js` file; do not rely on that and declare the format. Check the documentation for your version on nodejs.org.",
      },
      {
        tipo: "codigo",
        titulo: "Copy vs live binding",
        legenda: "JavaScript",
        codigo: [
          "// counter.mjs (ES Modules)",
          "export let total = 0;",
          "export function add() { total++; }",
          "",
          '// main.mjs: import { total, add } from "./counter.mjs";',
          "add();",
          "console.log(total); // 1: live binding",
          "",
          "// counter.cjs (CommonJS)",
          "let total = 0;",
          "module.exports = { total, add() { total++; } };",
          "",
          '// main.cjs: const { total, add } = require("./counter.cjs");',
          "add();",
          "console.log(total); // 0: a copy of the value at require time",
        ].join("\n"),
        nota: "In both cases `add()` changes the module’s variable. In the ES Module, the importer sees the new value; in CommonJS, destructuring had already copied the `0`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          'For **new** code, use ES Modules: they are the JavaScript standard, also work in the browser and allow static analysis and top-level `await`. Keep CommonJS where a large CommonJS code base already exists or a tool requires it. Pick **one format per file** and declare it (extension or `"type"`) instead of relying on detection.',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "require() is not import",
        texto:
          "The difference interviewers ask about: `require()` is a **function** that runs at run time, synchronously, and returns an object; `import` is a static **declaration**, evaluated before the rest of the module’s code, so it cannot sit inside an `if` (that is what `import()` is for, and it returns a promise). When mixing, an ES Module can import CommonJS (`module.exports` becomes the default export); the reverse, `require` of an ES Module, has historically failed, and recent versions allow it in some cases, so check the documentation. The way that always works is dynamic `import()`. More in L81.",
      },
    ],
    armadilhas: [
      "Using `__dirname`, `__filename` or `require` inside an ES Module: it throws `ReferenceError`. Use `import.meta.url` (or `import.meta.dirname`, if your version has it).",
      'Forgetting the extension in `import "./module"` inside an ES Module: resolution fails, because relative paths need the full file name.',
      'Setting `"type": "module"` on a project and breaking old `.js` files that use `require`: rename them to `.cjs` or convert them to `import`.',
      "Thinking that destructuring a `require` keeps the link to the original variable: it is a copy of the value at the time of the call.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `require()` and `import`?",
        resposta:
          "`require()` is a synchronous function called at run time that returns `module.exports`. `import` is a static declaration, analyzed before execution, with asynchronous loading and live bindings.",
      },
      {
        pergunta: "How does Node.js decide whether a `.js` file is CommonJS or an ES Module?",
        resposta:
          'By the `"type"` field of the nearest `package.json`: `"module"` makes it an ES Module and, without it, the default is CommonJS. The `.mjs` and `.cjs` extensions always win, whatever the `"type"`.',
      },
    ],
  },
};
