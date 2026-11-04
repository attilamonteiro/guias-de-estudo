import type { Pergunta } from "../../tipos";

// Q04 · Modularização
export const q04: Pergunta = {
  numero: 4,
  modulo: "turing-basicas",
  metodo: "whys",
  pt: {
    titulo: "Modularização",
    pergunta: "O que é a opção Modularize e quando você a usa no Node.js?",
    porqueEsteMetodo:
      "Quando o enunciado é confuso, o melhor caminho é chegar à razão de existir da coisa. Perguntar “por quê?” em cadeia leva da dor (código emaranhado) até a solução que o Node.js oferece, os módulos, e mostra quando usá-los.",
    resposta30s:
      "“Modularize” **não é uma opção oficial do Node.js**; a pergunta provavelmente trata de **modularização**: dividir o código em **módulos**, arquivos com escopo próprio que expõem só o que querem. O Node.js oferece dois sistemas: **CommonJS** (`require` e `module.exports`) e **ES Modules** (`import` e `export`). Modularize quando um arquivo mistura assuntos, quando um trecho é reutilizado ou precisa de teste isolado e para publicar bibliotecas. Não antes: fragmentar demais também atrapalha.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que organizar o código em módulos?",
            resposta:
              "Porque um arquivo único que cresce mistura assuntos: fica difícil de ler, de testar e de mudar sem quebrar outra parte. Módulos dão a cada responsabilidade um nome, um arquivo e uma fronteira.",
          },
          {
            pergunta: "Por que o Node.js precisou de um sistema de módulos?",
            resposta:
              "Porque durante muito tempo o JavaScript não tinha módulos nativos: os scripts do navegador compartilhavam um escopo global e os nomes colidiam. O Node.js adotou o CommonJS: cada arquivo tem escopo próprio, só o que vai em `module.exports` é visível de fora, e `require` traz o que outro arquivo exportou.",
          },
          {
            pergunta: "Por que hoje existem dois sistemas, CommonJS e ES Modules?",
            resposta:
              'Porque a própria linguagem padronizou os ES Modules (`import`/`export`), com análise estática e carregamento assíncrono, e o Node.js passou a suportar os dois. Um arquivo é ESM por `.mjs` ou por `"type": "module"` no `package.json`, e CommonJS por `.cjs` ou, historicamente, pelo padrão sem essa configuração. As regras de interoperação mudam entre versões: confira a documentação em nodejs.org.',
          },
          {
            pergunta: "Por que modularizar rende na prática?",
            resposta:
              "Porque o módulo vira a unidade de reuso, de teste e de carga: o Node.js carrega cada módulo uma vez e guarda o resultado em cache, você testa uma peça sem subir o sistema inteiro, e um módulo bem isolado pode virar um pacote do npm.",
          },
          {
            pergunta: "Por que, então, importa saber quando modularizar?",
            resposta:
              "Porque o ganho vem das fronteiras certas, e não da quantidade de arquivos. Dividir um script de 40 linhas em dez arquivos só espalha a leitura. Modularize quando houver assuntos misturados, reuso, necessidade de teste isolado ou publicação.",
          },
        ],
        causaRaiz:
          "Modularizar é dar limite e nome a cada responsabilidade. O Node.js já entrega o mecanismo (escopo por arquivo mais CommonJS ou ES Modules); a decisão é sua: **uma responsabilidade por módulo** e uma interface pública pequena.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Modularize” não é uma opção do Node.js",
        texto:
          "Não existe comando nem flag “Modularize” no Node.js; o que existe é o **sistema de módulos**. Se o contexto da pergunta for outro (por exemplo, o Emscripten, que compila C/C++ para WebAssembly, tem uma configuração chamada `MODULARIZE`), essa opção pertence à ferramenta, e não ao Node.js. Numa entrevista, diga isso com educação e responda sobre módulos.",
      },
      {
        tipo: "tabela",
        titulo: "CommonJS e ES Modules lado a lado",
        colunas: ["Aspecto", "CommonJS", "ES Modules"],
        linhas: [
          ["Sintaxe", "`require()` e `module.exports`", "`import` e `export`"],
          [
            "Carregamento",
            "Síncrono, em tempo de execução; o `require` pode ficar dentro de um `if`",
            "Análise estática no início; `import()` dinâmico carrega sob demanda",
          ],
          [
            "Como o Node.js reconhece",
            '`.cjs`, ou `.js` quando o `package.json` não declara `"type": "module"`',
            '`.mjs`, ou `.js` com `"type": "module"`',
          ],
          [
            "`__dirname` e `__filename`",
            "Existem",
            "Não existem; use `import.meta.url` (e, em versões recentes, `import.meta.dirname`)",
          ],
          ["`await` no topo do arquivo", "Não", "Sim (top-level await)"],
        ],
        nota: "Versões recentes do Node.js podem detectar a sintaxe do arquivo, mas declarar o formato de forma explícita evita surpresas.",
      },
      {
        tipo: "codigo",
        titulo: "O mesmo módulo nos dois sistemas",
        legenda: "JavaScript",
        codigo: `// soma.mjs (ES Modules)
export function somar(a, b) {
  return a + b;
}

// app.mjs
import { somar } from "./soma.mjs"; // no ESM, a extensão é obrigatória
console.log(somar(2, 3)); // 5

// Equivalente em CommonJS:
// soma.js -> module.exports = { somar };
// app.js  -> const { somar } = require("./soma");`,
      },
    ],
    armadilhas: [
      "Inventar uma resposta sobre uma “opção Modularize”: diga que ela não existe no Node.js e explique os módulos.",
      "Misturar `require` e `import` sem saber o formato do arquivo: surge o erro `require is not defined in ES module scope`.",
      "Esquecer a extensão em imports relativos de ESM (`./soma.mjs`, e não `./soma`): diferente do CommonJS, o ESM exige o caminho completo.",
      "Criar dependência circular entre módulos: no CommonJS, um dos lados pode receber um objeto ainda incompleto.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `module.exports` e `export`?",
        resposta:
          "`module.exports` é do CommonJS e se consome com `require`; `export` é do ES Modules e se consome com `import`.",
      },
      {
        pergunta: "Quando vale a pena criar um novo módulo?",
        resposta:
          "Quando um arquivo mistura assuntos, quando o trecho é usado em mais de um lugar, quando precisa de teste isolado ou quando será publicado como pacote. Não antes.",
      },
    ],
  },
  en: {
    titulo: "Modularization",
    pergunta: "What is the Modularize option and when do you use it in Node.js?",
    porqueEsteMetodo:
      "When the prompt is confusing, the best path is to reach the reason the thing exists. Asking “why?” in a chain leads from the pain (tangled code) to the solution Node.js offers, modules, and shows when to use them.",
    resposta30s:
      "“Modularize” is **not an official Node.js option**; the question most likely means **modularization**: splitting code into **modules**, files with their own scope that expose only what they choose. Node.js offers two systems: **CommonJS** (`require` and `module.exports`) and **ES Modules** (`import` and `export`). Modularize when a file mixes concerns, when a piece is reused or needs isolated tests, and to publish libraries. Not earlier: over-fragmenting hurts too.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why organize code into modules?",
            resposta:
              "Because a single growing file mixes concerns: it becomes hard to read, to test and to change without breaking another part. Modules give each responsibility a name, a file and a boundary.",
          },
          {
            pergunta: "Why did Node.js need a module system?",
            resposta:
              "Because for a long time JavaScript had no native modules: browser scripts shared a global scope and names collided. Node.js adopted CommonJS: each file has its own scope, only what goes into `module.exports` is visible from outside, and `require` brings in what another file exported.",
          },
          {
            pergunta: "Why are there two systems today, CommonJS and ES Modules?",
            resposta:
              'Because the language itself standardized ES Modules (`import`/`export`), with static analysis and asynchronous loading, and Node.js came to support both. A file is ESM through `.mjs` or `"type": "module"` in `package.json`, and CommonJS through `.cjs` or, historically, by default without that setting. The interoperability rules change between versions: check the documentation at nodejs.org.',
          },
          {
            pergunta: "Why does modularizing pay off in practice?",
            resposta:
              "Because the module becomes the unit of reuse, testing and loading: Node.js loads each module once and caches the result, you can test one piece without booting the whole system, and a well-isolated module can become an npm package.",
          },
          {
            pergunta: "Why, then, does it matter to know when to modularize?",
            resposta:
              "Because the gain comes from the right boundaries, not from the number of files. Splitting a 40-line script into ten files just scatters the reading. Modularize when there are mixed concerns, reuse, a need for isolated tests or publishing.",
          },
        ],
        causaRaiz:
          "Modularizing is giving each responsibility a boundary and a name. Node.js already provides the mechanism (per-file scope plus CommonJS or ES Modules); the decision is yours: **one responsibility per module** and a small public interface.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "“Modularize” is not a Node.js option",
        texto:
          "There is no “Modularize” command or flag in Node.js; what exists is the **module system**. If the context is different (for example, Emscripten, which compiles C/C++ to WebAssembly, has a setting called `MODULARIZE`), that option belongs to the tool, not to Node.js. In an interview, say so politely and answer about modules.",
      },
      {
        tipo: "tabela",
        titulo: "CommonJS and ES Modules side by side",
        colunas: ["Aspect", "CommonJS", "ES Modules"],
        linhas: [
          ["Syntax", "`require()` and `module.exports`", "`import` and `export`"],
          [
            "Loading",
            "Synchronous, at run time; `require` can sit inside an `if`",
            "Static analysis up front; dynamic `import()` loads on demand",
          ],
          [
            "How Node.js recognizes it",
            '`.cjs`, or `.js` when `package.json` does not declare `"type": "module"`',
            '`.mjs`, or `.js` with `"type": "module"`',
          ],
          [
            "`__dirname` and `__filename`",
            "Available",
            "Not available; use `import.meta.url` (and, in recent versions, `import.meta.dirname`)",
          ],
          ["`await` at the top of the file", "No", "Yes (top-level await)"],
        ],
        nota: "Recent Node.js versions may detect a file’s syntax, but declaring the format explicitly avoids surprises.",
      },
      {
        tipo: "codigo",
        titulo: "The same module in both systems",
        legenda: "JavaScript",
        codigo: `// sum.mjs (ES Modules)
export function sum(a, b) {
  return a + b;
}

// app.mjs
import { sum } from "./sum.mjs"; // in ESM, the extension is required
console.log(sum(2, 3)); // 5

// CommonJS equivalent:
// sum.js -> module.exports = { sum };
// app.js -> const { sum } = require("./sum");`,
      },
    ],
    armadilhas: [
      "Making up an answer about a “Modularize option”: say it does not exist in Node.js and explain modules.",
      "Mixing `require` and `import` without knowing the file’s format: you get the error `require is not defined in ES module scope`.",
      "Forgetting the extension in ESM relative imports (`./sum.mjs`, not `./sum`): unlike CommonJS, ESM requires the full path.",
      "Creating circular dependencies between modules: in CommonJS, one side may receive a still-incomplete object.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `module.exports` and `export`?",
        resposta:
          "`module.exports` belongs to CommonJS and is consumed with `require`; `export` belongs to ES Modules and is consumed with `import`.",
      },
      {
        pergunta: "When is it worth creating a new module?",
        resposta:
          "When a file mixes concerns, when the piece is used in more than one place, when it needs isolated tests or when it will be published as a package. Not before.",
      },
    ],
  },
};
