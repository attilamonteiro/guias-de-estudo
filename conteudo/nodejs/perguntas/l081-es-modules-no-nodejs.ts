import type { Pergunta } from "../../tipos";

// L81 · ES Modules no Node.js
export const l081: Pergunta = {
  numero: 181,
  modulo: "linkedin-moderno",
  metodo: "trace",
  pt: {
    titulo: "ES Modules no Node.js",
    pergunta: "Como funcionam os ES Modules no Node.js?",
    porqueEsteMetodo:
      "O sistema de módulos é uma sequência de fases (decidir o formato, resolver, carregar, ligar, executar), e a maioria dos erros famosos nasce numa delas. Seguir um único `import` e depois os caminhos que dão errado mostra onde cada regra de interoperabilidade entra.",
    resposta30s:
      "ES Modules são o sistema de módulos padrão da linguagem (`import`/`export`), e o Node.js os carrega de forma **assíncrona e estática**: decide o formato pela extensão (`.mjs`/`.cjs`) ou pelo campo `type` do `package.json`, resolve o endereço (extensão obrigatória nos caminhos relativos), monta o grafo, liga **bindings vivos** e executa cada módulo uma única vez. Para misturar com CommonJS: ESM importa CJS (o `module.exports` vira o default), e CJS usa `import()` dinâmico.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um `import` do começo ao fim",
        etapas: [
          "Decidir o formato: `app.mjs` é ESM e `.cjs` é sempre CommonJS; um `.js` depende do campo `type` do `package.json` mais próximo (`module` ou `commonjs`, que é o padrão)",
          "Resolver `import { soma } from './util.js'`: caminho relativo exige a extensão completa e não procura `index.js` sozinho; nome sem caminho (`express`) é buscado em `node_modules` e no campo `exports` do pacote; `node:fs` é módulo embutido",
          "Carregar e analisar: o Node lê o arquivo de forma assíncrona e descobre, sem executar, quais `import` e `export` ele tem; repete para cada dependência até montar o grafo inteiro",
          "Ligar: cada `import` vira um **binding vivo** apontando para a variável exportada, não uma cópia do valor",
          "Executar: os módulos rodam uma única vez, dos mais profundos para os mais externos, e o resultado fica em cache pelo endereço (URL)",
          "Se um módulo tem `await` no topo, quem o importa espera ele terminar antes de executar",
        ],
        nota: "Por ser estático (os `import` ficam no topo e não dependem de condições), o Node e as ferramentas leem o grafo antes de rodar. `import()` dinâmico é a saída quando o caminho só é conhecido em tempo de execução.",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "`ERR_MODULE_NOT_FOUND`",
            texto:
              "Você escreveu `import './util'` sem extensão. Em ESM o Node não completa `.js` nem procura `index.js`: escreva `./util.js` (ou `./pasta/index.js`).",
          },
          {
            titulo: "`require is not defined` ou `__dirname is not defined`",
            texto:
              "Essas variáveis pertencem ao wrapper do CommonJS e não existem em ESM. Use `import.meta.url` com `fileURLToPath` (de `node:url`) ou, em versões recentes, `import.meta.dirname` e `import.meta.filename` (confira a documentação). Para ter `require`, use `createRequire(import.meta.url)`.",
          },
          {
            titulo: "Named import de um pacote CommonJS falha",
            texto:
              "O ESM recebe o `module.exports` inteiro como `default`. Os nomes individuais só funcionam se o Node conseguir detectá-los na análise estática do CJS, o que não é garantido: importe o default e desestruture (`import pkg from 'pacote'; const { x } = pkg;`).",
          },
          {
            titulo: "Dependência circular",
            texto:
              "Os bindings são vivos, então o ciclo carrega, mas ler uma variável antes de o módulo dela executar dá `ReferenceError` (zona morta temporal). Quebre o ciclo movendo o código comum para um terceiro módulo.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Interoperabilidade nos dois sentidos",
        legenda: "JavaScript",
        codigo: [
          "// app.mjs (ESM)",
          'import { createRequire } from "node:module";',
          'import { fileURLToPath } from "node:url";',
          'import path from "node:path";',
          'import legado from "./legado.cjs"; // o module.exports inteiro vira o default',
          "",
          "const require = createRequire(import.meta.url); // require dentro do ESM",
          'const config = require("./config.json");',
          "const __dirname = path.dirname(fileURLToPath(import.meta.url));",
          'const { default: pesado } = await import("./pesado.js"); // import() dinâmico + await no topo',
          "",
          "// legado.cjs (CommonJS usando um módulo ESM)",
          "async function carregar() {",
          '  const { soma } = await import("./util.mjs"); // CJS usa import() dinâmico',
          "  return soma(1, 2);",
          "}",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de interoperabilidade",
        texto:
          "**ESM importa CJS sem problema** (o `module.exports` vem como `default`). **CJS importa ESM com `import()` dinâmico**, que é assíncrono e devolve uma promise; `require()` de ESM historicamente falhava com `ERR_REQUIRE_ESM`. Versões mais recentes do Node.js passaram a aceitar `require()` de módulos ESM em certas condições (sem `await` no topo, por exemplo), mas confira o estado e as restrições em nodejs.org antes de depender disso. Ao publicar um pacote, o campo `exports` pode oferecer um build ESM e outro CJS; cuidado para o mesmo módulo não ser carregado duas vezes, uma em cada formato.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Diferenças que pegam de surpresa",
        texto:
          "Em ESM o código está sempre em modo estrito, `this` no topo é `undefined`, os `import` sobem para o início do módulo e os valores importados são somente leitura (você não os reatribui, mas vê as mudanças feitas por quem exporta). Não existe `require.cache`: o cache de ESM é interno, indexado pela URL. Para a comparação lado a lado com CommonJS, veja L13.",
      },
    ],
    armadilhas: [
      "Esquecer a extensão (`./util`) nos caminhos relativos: funciona em CommonJS e em muitos empacotadores, mas em ESM no Node vira `ERR_MODULE_NOT_FOUND`.",
      "Usar `__dirname`, `__filename` ou `require` num arquivo ESM, ou `import` estático num CJS: o formato do arquivo decide o que existe no escopo.",
      "Esperar que `import { nome } from 'pacote-cjs'` sempre funcione: depende da detecção estática dos nomes; o `default` é o caminho seguro.",
      "Deixar o `type` sem declarar e depender de o Node adivinhar o formato do `.js`: versões recentes têm detecção de sintaxe, mas declarar o `type` é explícito e previsível.",
    ],
    autoteste: [
      {
        pergunta: "Como o Node.js decide se um arquivo `.js` é ESM ou CommonJS?",
        resposta:
          "Pelo campo `type` do `package.json` mais próximo (`module` ou `commonjs`, sendo `commonjs` o padrão). Já `.mjs` é sempre ESM e `.cjs` é sempre CommonJS. Versões recentes podem detectar a sintaxe de arquivos ambíguos; confira a documentação.",
      },
      {
        pergunta: "Como um arquivo CommonJS usa um pacote que só existe como ESM?",
        resposta:
          "Com `await import('pacote')`, que devolve uma promise. Dependendo da versão do Node.js, `require()` de ESM também pode funcionar em alguns casos; confira a documentação oficial.",
      },
    ],
  },
  en: {
    titulo: "ES Modules in Node.js",
    pergunta: "How do ES Modules work in Node.js?",
    porqueEsteMetodo:
      "The module system is a sequence of phases (decide the format, resolve, load, link, run), and most famous errors are born in one of them. Following a single `import` and then the paths where things go wrong shows where each interoperability rule comes in.",
    resposta30s:
      "ES Modules are the language’s standard module system (`import`/`export`), and Node.js loads them **asynchronously and statically**: it picks the format from the extension (`.mjs`/`.cjs`) or the `type` field in `package.json`, resolves the address (full extension required on relative paths), builds the graph, links **live bindings** and runs each module exactly once. To mix with CommonJS: ESM imports CJS (`module.exports` becomes the default), and CJS uses dynamic `import()`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One `import`, start to finish",
        etapas: [
          "Decide the format: `app.mjs` is ESM and `.cjs` is always CommonJS; a `.js` depends on the nearest `package.json` `type` field (`module` or `commonjs`, which is the default)",
          "Resolve `import { sum } from './util.js'`: a relative path needs the full extension and does not look for `index.js` on its own; a bare name (`express`) is looked up in `node_modules` and the package’s `exports` field; `node:fs` is a built-in module",
          "Load and analyze: Node reads the file asynchronously and finds out, without running it, which `import`s and `export`s it has; it repeats for each dependency until the whole graph is built",
          "Link: each `import` becomes a **live binding** pointing at the exported variable, not a copy of the value",
          "Run: modules execute exactly once, deepest first, and the result is cached by address (URL)",
          "If a module has top-level `await`, whoever imports it waits for it to finish before running",
        ],
        nota: "Because it is static (`import`s sit at the top and do not depend on conditions), Node and tooling can read the graph before running anything. Dynamic `import()` is the way out when the path is only known at runtime.",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "`ERR_MODULE_NOT_FOUND`",
            texto:
              "You wrote `import './util'` with no extension. In ESM Node does not append `.js` or look for `index.js`: write `./util.js` (or `./folder/index.js`).",
          },
          {
            titulo: "`require is not defined` or `__dirname is not defined`",
            texto:
              "These variables belong to the CommonJS wrapper and do not exist in ESM. Use `import.meta.url` with `fileURLToPath` (from `node:url`) or, in recent versions, `import.meta.dirname` and `import.meta.filename` (check the docs). To get `require`, use `createRequire(import.meta.url)`.",
          },
          {
            titulo: "A named import from a CommonJS package fails",
            texto:
              "ESM receives the whole `module.exports` as `default`. Individual names only work if Node can detect them by statically analyzing the CJS, which is not guaranteed: import the default and destructure (`import pkg from 'package'; const { x } = pkg;`).",
          },
          {
            titulo: "Circular dependency",
            texto:
              "Bindings are live, so the cycle loads, but reading a variable before its module has run throws a `ReferenceError` (temporal dead zone). Break the cycle by moving the shared code to a third module.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Interoperability in both directions",
        legenda: "JavaScript",
        codigo: [
          "// app.mjs (ESM)",
          'import { createRequire } from "node:module";',
          'import { fileURLToPath } from "node:url";',
          'import path from "node:path";',
          'import legacy from "./legacy.cjs"; // the whole module.exports becomes the default',
          "",
          "const require = createRequire(import.meta.url); // require inside ESM",
          'const config = require("./config.json");',
          "const __dirname = path.dirname(fileURLToPath(import.meta.url));",
          'const { default: heavy } = await import("./heavy.js"); // dynamic import() + top-level await',
          "",
          "// legacy.cjs (CommonJS using an ESM module)",
          "async function load() {",
          '  const { sum } = await import("./util.mjs"); // CJS uses dynamic import()',
          "  return sum(1, 2);",
          "}",
        ].join("\n"),
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Interoperability rule",
        texto:
          "**ESM imports CJS with no trouble** (`module.exports` arrives as `default`). **CJS imports ESM with dynamic `import()`**, which is asynchronous and returns a promise; `require()` of ESM historically failed with `ERR_REQUIRE_ESM`. More recent Node.js versions started accepting `require()` of ESM modules under certain conditions (no top-level `await`, for example), but check the current state and restrictions on nodejs.org before depending on it. When publishing a package, the `exports` field can offer an ESM build and a CJS one; take care that the same module is not loaded twice, once in each format.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Differences that catch people out",
        texto:
          "In ESM the code is always in strict mode, top-level `this` is `undefined`, `import`s are hoisted to the start of the module and imported values are read-only (you cannot reassign them, but you see changes made by the exporter). There is no `require.cache`: the ESM cache is internal, keyed by URL. For the side-by-side comparison with CommonJS, see L13.",
      },
    ],
    armadilhas: [
      "Forgetting the extension (`./util`) on relative paths: it works in CommonJS and in many bundlers, but in ESM on Node it becomes `ERR_MODULE_NOT_FOUND`.",
      "Using `__dirname`, `__filename` or `require` in an ESM file, or a static `import` in a CJS one: the file’s format decides what exists in scope.",
      "Expecting `import { name } from 'cjs-package'` to always work: it depends on static detection of the names; the `default` is the safe path.",
      "Leaving `type` undeclared and relying on Node to guess the format of a `.js` file: recent versions have syntax detection, but declaring `type` is explicit and predictable.",
    ],
    autoteste: [
      {
        pergunta: "How does Node.js decide whether a `.js` file is ESM or CommonJS?",
        resposta:
          "By the nearest `package.json` `type` field (`module` or `commonjs`, with `commonjs` as the default). `.mjs` is always ESM and `.cjs` is always CommonJS. Recent versions may detect the syntax of ambiguous files; check the documentation.",
      },
      {
        pergunta: "How does a CommonJS file use a package that only exists as ESM?",
        resposta:
          "With `await import('package')`, which returns a promise. Depending on the Node.js version, `require()` of ESM may also work in some cases; check the official documentation.",
      },
    ],
  },
};
