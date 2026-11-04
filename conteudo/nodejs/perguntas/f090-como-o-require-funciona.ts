import type { Pergunta } from "../../tipos";

// F90 · Como o require() funciona
export const f090: Pergunta = {
  numero: 490,
  modulo: "founditgulf-iniciantes",
  metodo: "trace",
  pt: {
    titulo: "Como o require() funciona",
    pergunta: "Como o require() funciona no Node.js?",
    porqueEsteMetodo:
      "`require` parece uma função simples, mas por trás dela há resolução de caminho, leitura, execução e cache. Seguir uma única chamada, e a segunda, mostra o mecanismo inteiro, inclusive o caminho em que o módulo não é encontrado.",
    resposta30s:
      "O `require` **resolve** o texto recebido até um arquivo (módulo do núcleo, caminho relativo ou pacote em `node_modules`), **lê e executa** o arquivo dentro de uma função que recebe `exports`, `require`, `module`, `__filename` e `__dirname`, **guarda o resultado em `require.cache`** pelo caminho resolvido e devolve `module.exports`. A segunda chamada para o mesmo arquivo **não executa nada**: devolve o objeto em cache, o que faz do módulo um **singleton**. Tudo é síncrono.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: 'Siga um `require("./config")`',
        etapas: [
          "O texto chega: o formato dele decide onde procurar (núcleo, arquivo local ou pacote; veja a tabela a seguir)",
          "Resolver: o Node.js transforma o texto num caminho absoluto de arquivo, testando `config`, `config.js`, `config.json`, `config.node` e depois a pasta (o `main` do `package.json` e `index.js`)",
          "Consultar o cache: a chave é o caminho absoluto resolvido (`require.cache`); se existe, devolve o `module.exports` guardado e acaba aqui",
          "Criar o módulo: um novo objeto `module` (`exports` vazio, `loaded` falso) é colocado no cache **antes** de o arquivo rodar, e por isso ciclos recebem exports parciais",
          "Carregar: o arquivo `.js` é lido e embrulhado numa função com `exports`, `require`, `module`, `__filename` e `__dirname`; `.json` passa por `JSON.parse`; `.node` carrega um addon nativo",
          "Executar: a função roda de forma síncrona, com `this` igual a `module.exports`, e o arquivo preenche `module.exports`; ao fim, `loaded` vira verdadeiro",
          "Devolver o valor atual de `module.exports` (se o arquivo o reatribuiu, é o novo; veja T42)",
          "As próximas chamadas que resolverem para o mesmo caminho pulam as etapas 4 a 6 e devolvem exatamente o mesmo objeto",
        ],
        nota: "Tudo é síncrono: o `require` bloqueia a thread até ler e executar o arquivo. É ótimo na partida do programa e ruim dentro de um caminho quente.",
      },
      {
        tipo: "tabela",
        titulo: "O texto passado ao require decide onde procurar",
        colunas: ["Forma", "Exemplo", "Onde procura", "Observações"],
        linhas: [
          [
            "Módulo do núcleo (built-in)",
            '`require("node:fs")`, `require("fs")`',
            "Embutido no próprio Node.js; não lê nada do disco",
            "Tem prioridade sobre um pacote de mesmo nome; o prefixo `node:` deixa explícito (veja L90)",
          ],
          [
            "Arquivo local",
            '`require("./util")`, `require("../lib/db")`',
            "Relativo ao **arquivo atual**, não ao diretório de trabalho",
            "Testa o nome exato e as extensões `.js`, `.json`, `.node`; depois trata como pasta",
          ],
          [
            "Pacote",
            '`require("express")`',
            "Pasta `node_modules` do diretório atual e, depois, a de cada pasta acima",
            "Usa `exports` do `package.json` do pacote, se houver, ou `main`; caminhos fora de `exports` ficam bloqueados",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "O caminho em que dá errado",
        passos: [
          {
            titulo: "O módulo não é encontrado",
            texto:
              "O Node.js lança `Error: Cannot find module 'x'` com `code: 'MODULE_NOT_FOUND'` e a lista de arquivos que levaram até ali (`requireStack`). Confira o nome, se faltou o `./` num arquivo local, se o `npm install` foi feito e se o `exports` do pacote bloqueia aquele subcaminho. `require.resolve(\"x\")` mostra o que seria carregado sem executar.",
          },
          {
            titulo: "O arquivo falha ao executar",
            texto:
              "Um `throw` no topo do módulo sobe pelo `require` de quem o chamou. O Node.js remove o módulo quebrado do cache, e uma nova chamada tenta carregá-lo de novo.",
          },
          {
            titulo: "Dois módulos se requerem (ciclo)",
            texto:
              "Se A requer B e B requer A, B recebe o `module.exports` de A **ainda incompleto** (é o objeto do cache da etapa 4), e o que A define depois aparece como `undefined` em B. Reorganize o código ou faça o `require` dentro da função que usa (veja F75).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O cache em ação",
        legenda: "JavaScript",
        codigo: [
          "// contador.js",
          "let n = 0;",
          'console.log("executando contador.js"); // aparece uma vez só',
          "module.exports = { proximo: () => ++n };",
          "",
          "// principal.js",
          'const a = require("./contador");',
          'const b = require("./contador"); // cache: não executa de novo',
          "console.log(a === b);                 // true: o mesmo objeto",
          "console.log(a.proximo(), b.proximo()); // 1 2: o estado é compartilhado",
          "",
          'delete require.cache[require.resolve("./contador")];',
          'const c = require("./contador"); // executa de novo',
          "console.log(c === a);                 // false: um módulo novo",
        ].join("\n"),
        nota: "Quem já guardou `a` continua com o objeto antigo depois do `delete`. Em ESM não existe equivalente de `require.cache`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Cache por caminho resolvido = singleton",
        texto:
          "A chave do cache é o **caminho absoluto**, não o texto digitado: `./db` em dois arquivos diferentes resolve para o mesmo módulo, que executa uma vez e é **compartilhado** (por isso uma conexão exportada vira singleton). O inverso também vale: duas cópias do mesmo pacote em `node_modules` diferentes são dois módulos, com estado separado. Invalidar o cache (`delete require.cache[...]`) serve para testes e recarga em desenvolvimento, mas não atualiza referências já guardadas.",
      },
    ],
    armadilhas: [
      "Achar que `require` relê e executa o arquivo a cada chamada: só a primeira executa, e o estado do módulo é compartilhado entre todos os que o importam.",
      'Esperar que `./arquivo` seja relativo ao diretório de trabalho: no `require` é relativo ao arquivo que o chama (diferente de `fs.readFile("./arquivo")`).',
      "Chamar `require` dentro de um handler de requisição: a primeira vez lê o disco de forma síncrona e bloqueia o laço; deixe os `require` no topo.",
      "Invalidar `require.cache` e esperar que todos vejam o módulo novo: quem já guardou a referência continua com a antiga, e módulos ligados a ele também.",
    ],
    autoteste: [
      {
        pergunta:
          'Dois arquivos fazem `require("./db")` e um terceiro faz `require("../db")` para o mesmo arquivo. Quantas vezes ele executa?',
        resposta:
          "Uma. O cache usa o caminho absoluto resolvido, não o texto: os três pedidos resolvem para o mesmo arquivo e recebem o mesmo `module.exports`.",
      },
      {
        pergunta: "Como o `require` distingue módulo do núcleo, arquivo local e pacote?",
        resposta:
          "Pelo texto. O nome de um módulo do núcleo (ou o prefixo `node:`) carrega o embutido; `./`, `../` ou `/` indicam arquivo local, relativo ao arquivo atual; qualquer outro nome é pacote, procurado em `node_modules` subindo pelas pastas.",
      },
    ],
  },
  en: {
    titulo: "How require() works",
    pergunta: "How does require() work in Node.js?",
    porqueEsteMetodo:
      "`require` looks like a simple function, but behind it there is path resolution, reading, execution and a cache. Following a single call, and then the second one, shows the whole mechanism, including the path where the module is not found.",
    resposta30s:
      "`require` **resolves** the text it receives to a file (a core module, a relative path or a package in `node_modules`), **reads and runs** the file inside a function that receives `exports`, `require`, `module`, `__filename` and `__dirname`, **stores the result in `require.cache`** under the resolved path and returns `module.exports`. A second call for the same file **runs nothing**: it returns the cached object, which makes the module a **singleton**. Everything is synchronous.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: 'Follow a `require("./config")`',
        etapas: [
          "The text arrives: its format decides where to look (core, local file or package; see the next table)",
          "Resolve: Node.js turns the text into an absolute file path, trying `config`, `config.js`, `config.json`, `config.node` and then the folder (the `package.json` `main` and `index.js`)",
          "Check the cache: the key is the resolved absolute path (`require.cache`); if it exists, the stored `module.exports` is returned and it ends here",
          "Create the module: a new `module` object (empty `exports`, `loaded` false) is put in the cache **before** the file runs, which is why cycles receive partial exports",
          "Load: the `.js` file is read and wrapped in a function with `exports`, `require`, `module`, `__filename` and `__dirname`; `.json` goes through `JSON.parse`; `.node` loads a native addon",
          "Run: the function executes synchronously, with `this` equal to `module.exports`, and the file fills in `module.exports`; at the end, `loaded` becomes true",
          "Return the current value of `module.exports` (if the file reassigned it, the new one; see T42)",
          "Later calls that resolve to the same path skip steps 4 to 6 and return exactly the same object",
        ],
        nota: "Everything is synchronous: `require` blocks the thread until the file is read and run. It is great at program startup and bad inside a hot path.",
      },
      {
        tipo: "tabela",
        titulo: "The text passed to require decides where to look",
        colunas: ["Form", "Example", "Where it looks", "Notes"],
        linhas: [
          [
            "Core (built-in) module",
            '`require("node:fs")`, `require("fs")`',
            "Built into Node.js itself; reads nothing from disk",
            "Takes priority over a package of the same name; the `node:` prefix makes it explicit (see L90)",
          ],
          [
            "Local file",
            '`require("./util")`, `require("../lib/db")`',
            "Relative to the **current file**, not the working directory",
            "Tries the exact name and the `.js`, `.json`, `.node` extensions; then treats it as a folder",
          ],
          [
            "Package",
            '`require("express")`',
            "The `node_modules` folder of the current directory and then that of every folder above",
            "Uses the package’s `package.json` `exports`, if any, or `main`; paths outside `exports` are blocked",
          ],
        ],
      },
      {
        tipo: "passos",
        titulo: "The path where it goes wrong",
        passos: [
          {
            titulo: "The module is not found",
            texto:
              "Node.js throws `Error: Cannot find module 'x'` with `code: 'MODULE_NOT_FOUND'` and the list of files that led there (`requireStack`). Check the name, whether a local file lacks the `./`, whether `npm install` was run and whether the package’s `exports` blocks that subpath. `require.resolve(\"x\")` shows what would be loaded without running it.",
          },
          {
            titulo: "The file fails while running",
            texto:
              "A `throw` at the top of the module propagates through the `require` of whoever called it. Node.js removes the broken module from the cache, and a new call tries to load it again.",
          },
          {
            titulo: "Two modules require each other (a cycle)",
            texto:
              "If A requires B and B requires A, B receives A’s `module.exports` **still incomplete** (it is the cached object from step 4), and what A defines later shows up as `undefined` in B. Reorganize the code or call `require` inside the function that uses it (see F75).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The cache in action",
        legenda: "JavaScript",
        codigo: [
          "// counter.js",
          "let n = 0;",
          'console.log("running counter.js"); // shows up only once',
          "module.exports = { next: () => ++n };",
          "",
          "// main.js",
          'const a = require("./counter");',
          'const b = require("./counter"); // cache: does not run again',
          "console.log(a === b);          // true: the same object",
          "console.log(a.next(), b.next()); // 1 2: the state is shared",
          "",
          'delete require.cache[require.resolve("./counter")];',
          'const c = require("./counter"); // runs again',
          "console.log(c === a);          // false: a new module",
        ].join("\n"),
        nota: "Whoever already kept `a` still holds the old object after the `delete`. ESM has no equivalent of `require.cache`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Cache by resolved path = singleton",
        texto:
          "The cache key is the **absolute path**, not the text typed: `./db` in two different files resolves to the same module, which runs once and is **shared** (that is why an exported connection becomes a singleton). The reverse also holds: two copies of the same package in different `node_modules` folders are two modules, with separate state. Invalidating the cache (`delete require.cache[...]`) is for tests and development reloads, but it does not update references already kept.",
      },
    ],
    armadilhas: [
      "Thinking `require` rereads and runs the file on every call: only the first one runs, and the module’s state is shared by everyone who imports it.",
      'Expecting `./file` to be relative to the working directory: in `require` it is relative to the calling file (unlike `fs.readFile("./file")`).',
      "Calling `require` inside a request handler: the first time it reads the disk synchronously and blocks the loop; keep `require` calls at the top.",
      "Invalidating `require.cache` and expecting everyone to see the new module: whoever already kept the reference still holds the old one, and so do the modules tied to it.",
    ],
    autoteste: [
      {
        pergunta:
          'Two files do `require("./db")` and a third does `require("../db")` for the same file. How many times does it run?',
        resposta:
          "Once. The cache uses the resolved absolute path, not the text: the three requests resolve to the same file and get the same `module.exports`.",
      },
      {
        pergunta: "How does `require` tell a core module, a local file and a package apart?",
        resposta:
          "By the text. A core module name (or the `node:` prefix) loads the built-in; `./`, `../` or `/` mean a local file, relative to the current file; any other name is a package, searched in `node_modules` going up the folders.",
      },
    ],
  },
};
