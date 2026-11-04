import type { Pergunta } from "../../tipos";

// Q51 · Escopo no Node.js
export const q51: Pergunta = {
  numero: 51,
  modulo: "turing-avancadas",
  metodo: "feynman",
  pt: {
    titulo: "Escopo no Node.js",
    pergunta: "O que é o escopo padrão do Node.js e como lidamos com o escopo local e global?",
    porqueEsteMetodo:
      "Escopo é uma ideia abstrata que se fixa com uma imagem simples (salas com porta e um mural no corredor). Depois vem o mecanismo real do Node, o embrulho de cada módulo, e o ponto em que a imagem deixa de valer.",
    resposta30s:
      "O escopo padrão no Node.js é o **escopo de módulo**: cada arquivo é embrulhado numa função, então o que você declara no topo (`var`, `let`, `const`, funções) é **local ao arquivo** e não vira global, ao contrário de um `<script>` no navegador. Para compartilhar algo, use `module.exports` ou `export`. O escopo realmente global é o **`globalThis`** (chamado `global` no Node), onde ficam `process`, `console` e os temporizadores. Regra: mantenha tudo local, exporte de forma explícita e receba configuração por `process.env`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense num prédio de escritórios. Cada arquivo é uma sala com porta: o que você anota no quadro da sua sala só é visível lá dentro, e, para deixar algo à disposição das outras salas, você o coloca no guichê da porta (`exports`). O mural do corredor é o escopo global: todo mundo enxerga, mas, se todas as salas colarem recados nele, ninguém mais se entende.",
        tecnico:
          "Em CommonJS, o Node embrulha cada arquivo numa função com cinco parâmetros: `exports`, `require`, `module`, `__filename` e `__dirname`. Por isso um `const x = 1` no topo do arquivo é uma variável local dessa função, e esses cinco nomes parecem globais sem ser. Em ES Modules o arquivo também tem escopo próprio, mas sem esses cinco nomes (o caminho do arquivo vem de `import.meta.url`). Dentro do módulo valem as regras normais da linguagem: `var` tem escopo de função, `let` e `const` têm escopo de bloco, e funções internas formam **closures**, que lembram as variáveis ao redor. O global de verdade é o `globalThis` (`global` no Node), onde moram `process`, `Buffer`, `console`, `fetch`, `URL` e os temporizadores.",
        limite:
          "A porta fecha o conteúdo da sala, não a sala em si: o Node executa cada módulo **uma vez por processo** e guarda o resultado em cache, então uma variável de módulo é compartilhada por todos que importam o arquivo (na prática, um singleton), mas não entre processos nem entre worker threads. E atribuir a um nome nunca declarado (`x = 1`) cria um global sem avisar, em CommonJS fora do modo estrito.",
      },
      {
        tipo: "tabela",
        titulo: "Onde cada coisa vive",
        colunas: ["Como você declara", "Onde a variável vive", "Quem enxerga"],
        linhas: [
          [
            "`const`, `let` ou `var` no topo do arquivo",
            "No módulo (dentro do embrulho); `var` não vira propriedade de `globalThis`",
            "Só o próprio arquivo, até você exportar",
          ],
          [
            "Dentro de uma função ou de um bloco `{ }`",
            "Na função (`var`) ou no bloco (`let`/`const`); closures guardam o valor",
            "Só aquele trecho e as funções criadas dentro dele",
          ],
          [
            "`module.exports = ...` ou `export ...`",
            "Continua no módulo; o que sai é uma referência ao valor exportado",
            "Quem fizer `require`/`import` do arquivo",
          ],
          ["`globalThis.x = 1`", "No objeto global do processo", "Todos os módulos do processo (evite)"],
          [
            "`x = 1`, sem declarar",
            "Cria um global em CommonJS sem modo estrito; em ESM ou com `'use strict'` dá erro",
            "Todos os módulos (acidente clássico)",
          ],
          [
            "`process.env.NOME`",
            "No ambiente do processo; os valores são sempre texto",
            "O processo inteiro; é o jeito certo de receber configuração",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O escopo de módulo em CommonJS",
        legenda: "contas.js (CommonJS)",
        codigo: `const limite = 100;   // escopo do módulo: ninguém de fora enxerga
var legado = "texto"; // var também fica no módulo (no navegador viraria global)
let total = 0;

console.log(typeof globalThis.legado); // "undefined"
console.log(this === module.exports);  // true: o this do topo é o exports
console.log(typeof __filename);        // "string": veio do embrulho do módulo

// só o que for atribuído a module.exports é público
module.exports = { somar: (n) => (total = Math.min(limite, total + n)) };`,
        nota: "A função `somar` é uma closure: continua enxergando `total` e `limite` mesmo depois de o arquivo terminar de carregar.",
      },
      {
        tipo: "codigo",
        titulo: "O limite da analogia: estado de módulo é compartilhado",
        legenda: "contador.js (ESM)",
        codigo: `// executado uma única vez por processo
let n = 0;

export function proximo() {
  return ++n;
}

// a.js e b.js fazem: import { proximo } from "./contador.js";
// proximo() em a.js e em b.js incrementa o MESMO n`,
        nota: "Em ESM não existem `__filename` nem `__dirname`; use `import.meta.url` (as versões atuais também oferecem `import.meta.dirname` e `import.meta.filename`; confira a documentação do Node).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como lidar com o local e o global",
        texto:
          "Local por padrão: declare com `const` (ou `let`) no menor escopo possível e compartilhe só o que for explícito, com `module.exports` ou `export`. Receba configuração por `process.env` (ou um módulo de configuração) e dependências por parâmetro, em vez de globais. Use `globalThis` só para o que é do ambiente, e prefira não criar globais novos. O modo estrito (ESM já é estrito) e a regra `no-undef` do ESLint pegam a atribuição acidental.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "`process.env` só guarda texto",
        texto:
          "`process.env.PORT` é a string `'3000'`, não o número 3000, e atribuir um valor que não é texto o converte para texto (`false` vira `'false'`, que é verdadeiro numa condição; a documentação desencoraja isso, então atribua sempre strings). Converta de forma explícita na leitura: `Number(process.env.PORT)` ou `process.env.FLAG === 'true'`.",
      },
    ],
    armadilhas: [
      "Esperar que um `var` no topo do arquivo vire global como no navegador: no Node ele fica no módulo.",
      "Esquecer o `let`/`const` e criar um global sem querer (`total = 0`): em CommonJS sem modo estrito passa sem erro e vaza para todos os módulos.",
      "Achar que o estado de um módulo é privado de quem o importa: todos recebem o mesmo módulo, guardado em cache (e processos diferentes não o compartilham).",
      "Usar `__dirname`, `__filename` ou `require` num módulo ESM, onde eles não existem.",
    ],
    autoteste: [
      {
        pergunta: "Qual é o escopo padrão do Node.js?",
        resposta:
          "O escopo de módulo: cada arquivo é seu próprio escopo, e o que não é exportado fica invisível para os outros arquivos.",
      },
      {
        pergunta: "Num arquivo CommonJS, `var x = 1` no topo cria `globalThis.x`?",
        resposta:
          "Não. A variável pertence ao módulo (ao embrulho em função). Só uma atribuição sem declaração, ou `globalThis.x = 1`, cria um global.",
      },
      {
        pergunta: "Como compartilhar um valor entre dois arquivos sem usar global?",
        resposta:
          "Exportando-o (ou uma função que o lê) com `module.exports`/`export` e importando no outro arquivo. O estado fica no módulo, que é carregado uma vez por processo.",
      },
    ],
  },
  en: {
    titulo: "Scope in Node.js",
    pergunta: "What is the default scope in Node.js and how do we deal with local and global scope?",
    porqueEsteMetodo:
      "Scope is an abstract idea that sticks with a simple picture (rooms with doors and a bulletin board in the hallway). Then comes Node’s real mechanism, the wrapper around each module, and the point where the picture stops holding.",
    resposta30s:
      "The default scope in Node.js is **module scope**: every file is wrapped in a function, so what you declare at the top (`var`, `let`, `const`, functions) is **local to the file** and does not become global, unlike a `<script>` in the browser. To share something, use `module.exports` or `export`. The truly global scope is **`globalThis`** (called `global` in Node), which holds `process`, `console` and the timers. Rule: keep everything local, export explicitly and receive configuration through `process.env`.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of an office building. Each file is a room with a door: what you write on your room’s whiteboard is visible only inside, and to make something available to other rooms you put it on the hatch by the door (`exports`). The hallway bulletin board is the global scope: everyone can see it, but if every room pins notes there, nobody can find anything.",
        tecnico:
          "In CommonJS, Node wraps each file in a function with five parameters: `exports`, `require`, `module`, `__filename` and `__dirname`. That is why a `const x = 1` at the top of the file is a local variable of that function, and why those five names look global without being so. In ES Modules the file also has its own scope, but without those five names (the file path comes from `import.meta.url`). Inside the module the normal language rules apply: `var` is function-scoped, `let` and `const` are block-scoped, and inner functions form **closures** that remember the surrounding variables. The real global is `globalThis` (`global` in Node), home to `process`, `Buffer`, `console`, `fetch`, `URL` and the timers.",
        limite:
          "The door closes the contents of the room, not the room itself: Node runs each module **once per process** and caches the result, so a module-level variable is shared by everyone who imports the file (in practice, a singleton), but not across processes or worker threads. And assigning to a name that was never declared (`x = 1`) quietly creates a global, in CommonJS outside strict mode.",
      },
      {
        tipo: "tabela",
        titulo: "Where each thing lives",
        colunas: ["How you declare it", "Where the variable lives", "Who can see it"],
        linhas: [
          [
            "`const`, `let` or `var` at the top of the file",
            "In the module (inside the wrapper); `var` does not become a property of `globalThis`",
            "Only the file itself, until you export it",
          ],
          [
            "Inside a function or a `{ }` block",
            "In the function (`var`) or the block (`let`/`const`); closures keep the value",
            "Only that piece and the functions created inside it",
          ],
          [
            "`module.exports = ...` or `export ...`",
            "Stays in the module; what leaves is a reference to the exported value",
            "Whoever does `require`/`import` of the file",
          ],
          ["`globalThis.x = 1`", "On the process’s global object", "Every module in the process (avoid)"],
          [
            "`x = 1`, with no declaration",
            "Creates a global in CommonJS outside strict mode; an error in ESM or with `'use strict'`",
            "Every module (the classic accident)",
          ],
          [
            "`process.env.NAME`",
            "In the process environment; values are always text",
            "The whole process; the right way to receive configuration",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Module scope in CommonJS",
        legenda: "accounts.js (CommonJS)",
        codigo: `const limit = 100;    // module scope: nobody outside can see it
var legacy = "text";  // var also stays in the module (in a browser it would be global)
let total = 0;

console.log(typeof globalThis.legacy); // "undefined"
console.log(this === module.exports);  // true: the top-level this is exports
console.log(typeof __filename);        // "string": it came from the module wrapper

// only what is assigned to module.exports is public
module.exports = { add: (n) => (total = Math.min(limit, total + n)) };`,
        nota: "The `add` function is a closure: it keeps seeing `total` and `limit` even after the file has finished loading.",
      },
      {
        tipo: "codigo",
        titulo: "Where the analogy ends: module state is shared",
        legenda: "counter.js (ESM)",
        codigo: `// executed only once per process
let n = 0;

export function next() {
  return ++n;
}

// a.js and b.js both do: import { next } from "./counter.js";
// next() in a.js and in b.js increments the SAME n`,
        nota: "In ESM there is no `__filename` or `__dirname`; use `import.meta.url` (current versions also offer `import.meta.dirname` and `import.meta.filename`; check the Node documentation).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to handle local and global",
        texto:
          "Local by default: declare with `const` (or `let`) in the smallest possible scope and share only what is explicit, with `module.exports` or `export`. Receive configuration through `process.env` (or a config module) and dependencies as parameters instead of globals. Use `globalThis` only for what belongs to the environment, and prefer not to create new globals. Strict mode (ESM is already strict) and ESLint’s `no-undef` rule catch the accidental assignment.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "`process.env` only holds text",
        texto:
          "`process.env.PORT` is the string `'3000'`, not the number 3000, and assigning a non-text value converts it to text (`false` becomes `'false'`, which is truthy in a condition; the documentation discourages this, so always assign strings). Convert explicitly when reading: `Number(process.env.PORT)` or `process.env.FLAG === 'true'`.",
      },
    ],
    armadilhas: [
      "Expecting a top-level `var` to become global as it does in the browser: in Node it stays in the module.",
      "Forgetting `let`/`const` and creating a global by accident (`total = 0`): in CommonJS outside strict mode it raises no error and leaks to every module.",
      "Thinking a module’s state is private to whoever imports it: everyone gets the same cached module (and different processes do not share it).",
      "Using `__dirname`, `__filename` or `require` in an ESM module, where they do not exist.",
    ],
    autoteste: [
      {
        pergunta: "What is the default scope in Node.js?",
        resposta:
          "Module scope: each file is its own scope, and whatever is not exported stays invisible to other files.",
      },
      {
        pergunta: "In a CommonJS file, does a top-level `var x = 1` create `globalThis.x`?",
        resposta:
          "No. The variable belongs to the module (to the function wrapper). Only an assignment with no declaration, or `globalThis.x = 1`, creates a global.",
      },
      {
        pergunta: "How do you share a value between two files without using a global?",
        resposta:
          "Export it (or a function that reads it) with `module.exports`/`export` and import it in the other file. The state stays in the module, which is loaded once per process.",
      },
    ],
  },
};
