import type { Pergunta } from "../../tipos";

// G56 · N-API e addons nativos
export const g056: Pergunta = {
  numero: 656,
  modulo: "gist-avancado",
  metodo: "compare",
  pt: {
    titulo: "N-API e addons nativos",
    pergunta: "O que é a N-API no Node.js?",
    porqueEsteMetodo:
      "Escrever código nativo para o Node tem vários caminhos que parecem equivalentes e diferem justamente no que quebra quando o Node muda de versão. Uma matriz lado a lado mostra isso e leva a uma regra de escolha.",
    resposta30s:
      "A **N-API** (hoje chamada **Node-API**) é uma API em C, mantida pelo próprio Node.js, para escrever **addons nativos** com **ABI estável**: o binário compilado continua funcionando em versões diferentes do Node, sem recompilar, e não depende do V8. **NAN** e o uso direto do V8 ficam presos à API interna do motor e quebram ou exigem recompilação a cada versão. Addons servem para CPU intensiva, bibliotecas C/C++ já existentes e APIs do sistema, ao custo de build por plataforma e de um erro nativo derrubar o processo inteiro.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Caminhos para escrever código nativo para o Node",
        colunas: ["Opção", "O que é", "Estabilidade entre versões do Node", "Quando faz sentido"],
        linhas: [
          [
            "Node-API (N-API)",
            "API em C, parte do Node.js, que não expõe tipos do V8",
            "ABI estável: o mesmo binário roda em versões diferentes, desde que ofereçam o nível de Node-API usado",
            "Padrão para addons novos",
          ],
          [
            "`node-addon-api`",
            "Camada C++ (só cabeçalhos) sobre a Node-API, mais agradável de escrever",
            "Herda a estabilidade da Node-API",
            "Addon em C++ sem abrir mão da estabilidade",
          ],
          [
            "NAN",
            "Macros e modelos C++ que escondem as diferenças entre versões da API do V8",
            "Compilada contra o V8: recompila a cada versão principal do Node",
            "Manter código legado que já usa NAN",
          ],
          [
            "V8 e libuv direto",
            "Usa os cabeçalhos do V8 (`FunctionTemplate`, `ObjectTemplate`, `Isolate`) e do libuv à mão",
            "Frágil: a API do V8 muda entre versões do Node",
            "Só para algo que a Node-API não expõe, aceitando acompanhar o V8",
          ],
          [
            "`napi-rs` (Rust)",
            "Ligações em Rust sobre a Node-API",
            "Herda a estabilidade da Node-API",
            "Biblioteca nova em Rust, com a segurança de memória da linguagem",
          ],
          [
            "WebAssembly",
            "Alternativa, não é addon: módulo compilado que roda dentro do motor",
            "Independe da versão do Node",
            "CPU pura (codecs, parsing) sem compilar por plataforma; acessa o sistema só pelo que você importar",
          ],
        ],
        nota: "A compilação costuma usar `node-gyp` (arquivo `binding.gyp`) ou `cmake-js`. Para o usuário final não precisar de compilador, os pacotes publicam binários pré-compilados (prebuilds) para cada sistema e arquitetura.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Primeiro pergunte se você precisa mesmo de um addon: CPU pura costuma caber em `worker_threads` ou WebAssembly. Uma biblioteca C, C++ ou Rust que já existe, ou uma API do sistema que o Node não expõe, justificam o addon. Se justificarem, use a **Node-API**, direto, com `node-addon-api` ou com `napi-rs`. NAN fica para manter legado, e o V8 direto, para o raro caso que a Node-API não cobre.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Por que addons existem, e o que são os V8 Templates",
        texto:
          "Um addon resolve três necessidades: trabalho de CPU que o JavaScript não faz bem, reaproveitar uma biblioteca nativa existente (codecs, drivers, criptografia) e chamar APIs do sistema ou de hardware que o Node não expõe. Os **V8 Templates** (`FunctionTemplate` e `ObjectTemplate`) são o molde da API C++ do V8 para criar funções e objetos que aparecem no JavaScript; é por eles que uma função escrita em C++ vira `addon.soma()` no JS. A Node-API esconde isso atrás de `napi_create_function` e `napi_define_class` (em `node-addon-api`, `Napi::Function` e `Napi::ObjectWrap`), então você não precisa conhecê-los para escrever um addon moderno.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O custo de um addon",
        texto:
          "Há um build por sistema e arquitetura (e às vezes por biblioteca C do sistema), com compilador na máquina de quem instala, a menos que existam prebuilds. Um erro de memória ou uma exceção C++ sem tratamento derruba o **processo inteiro**, e nenhum `try/catch` do JavaScript o pega. O addon roda com todos os privilégios do processo, sem sandbox: instalar um de terceiros é executar código nativo arbitrário. E cruzar a fronteira JavaScript/C++ tem custo, então chamadas pequenas e frequentes podem anular o ganho.",
      },
    ],
    armadilhas: [
      "Achar que ABI estável é “compile uma vez e rode em qualquer lugar”: o binário continua específico de sistema operacional e arquitetura, e só deixa de depender da versão do Node.",
      "Escrever um addon “para ficar mais rápido” sem medir: a fronteira JS/C++ tem custo, e `worker_threads` ou WebAssembly podem bastar.",
      "Tratar o addon como código JavaScript: um erro de memória ou uma exceção não tratada derruba o processo sem passar por nenhum `try/catch`.",
      "Começar um projeto novo em NAN ou direto na API do V8, e ficar refém de recompilar e adaptar a cada versão do Node.",
    ],
    autoteste: [
      {
        pergunta: "Por que um addon em Node-API sobrevive à troca de versão do Node e um em NAN, não?",
        resposta:
          "A Node-API é uma interface em C estável, que não expõe tipos do V8; o binário só chama funções que o Node mantém. O NAN é compilado contra a API do V8, que muda entre versões, então precisa recompilar (e às vezes adaptar).",
      },
      {
        pergunta: "Quando vale escrever um addon em vez de usar JavaScript, uma worker thread ou WebAssembly?",
        resposta:
          "Quando você precisa reaproveitar uma biblioteca nativa existente ou chamar uma API do sistema que o Node não expõe. Para CPU pura, meça antes: uma worker thread ou WebAssembly costuma bastar, sem build por plataforma.",
      },
    ],
  },
  en: {
    titulo: "N-API and native addons",
    pergunta: "What is N-API in Node.js?",
    porqueEsteMetodo:
      "Writing native code for Node has several paths that look equivalent and differ precisely in what breaks when Node changes version. A side-by-side matrix shows that and leads to a decision rule.",
    resposta30s:
      "**N-API** (now called **Node-API**) is a C API, maintained by Node.js itself, for writing **native addons** with a **stable ABI**: the compiled binary keeps working across Node versions without recompiling, and it does not depend on V8. **NAN** and using V8 directly are tied to the engine’s internal API and break or need recompiling with each version. Addons are for CPU-heavy work, existing C/C++ libraries and system APIs, at the cost of a build per platform and of a native error taking down the whole process.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Paths to writing native code for Node",
        colunas: ["Option", "What it is", "Stability across Node versions", "When it makes sense"],
        linhas: [
          [
            "Node-API (N-API)",
            "A C API, part of Node.js, that does not expose V8 types",
            "Stable ABI: the same binary runs on different versions, as long as they offer the Node-API level it uses",
            "The default for new addons",
          ],
          [
            "`node-addon-api`",
            "A C++ layer (headers only) over Node-API, nicer to write",
            "Inherits Node-API’s stability",
            "A C++ addon without giving up stability",
          ],
          [
            "NAN",
            "C++ macros and templates that hide the differences between versions of the V8 API",
            "Compiled against V8: recompiles with each major Node version",
            "Maintaining legacy code that already uses NAN",
          ],
          [
            "V8 and libuv directly",
            "Uses the V8 headers (`FunctionTemplate`, `ObjectTemplate`, `Isolate`) and libuv by hand",
            "Fragile: the V8 API changes between Node versions",
            "Only for something Node-API does not expose, accepting that you must follow V8",
          ],
          [
            "`napi-rs` (Rust)",
            "Rust bindings over Node-API",
            "Inherits Node-API’s stability",
            "A new library in Rust, with the language’s memory safety",
          ],
          [
            "WebAssembly",
            "An alternative, not an addon: a compiled module that runs inside the engine",
            "Independent of the Node version",
            "Pure CPU work (codecs, parsing) with no per-platform build; it reaches the system only through what you import",
          ],
        ],
        nota: "Building usually relies on `node-gyp` (a `binding.gyp` file) or `cmake-js`. So end users do not need a compiler, packages ship prebuilt binaries (prebuilds) for each system and architecture.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "First ask whether you really need an addon: pure CPU work often fits in `worker_threads` or WebAssembly. An existing C, C++ or Rust library, or a system API Node does not expose, justifies one. If it does, use **Node-API**, directly, with `node-addon-api` or with `napi-rs`. NAN is for maintaining legacy code, and direct V8 for the rare case Node-API does not cover.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Why addons exist, and what V8 Templates are",
        texto:
          "An addon answers three needs: CPU work JavaScript does not do well, reusing an existing native library (codecs, drivers, cryptography) and calling system or hardware APIs Node does not expose. **V8 Templates** (`FunctionTemplate` and `ObjectTemplate`) are the mold the V8 C++ API uses to create functions and objects that show up in JavaScript; that is how a function written in C++ becomes `addon.sum()` in JS. Node-API hides this behind `napi_create_function` and `napi_define_class` (in `node-addon-api`, `Napi::Function` and `Napi::ObjectWrap`), so you do not need to know them to write a modern addon.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The cost of an addon",
        texto:
          "There is one build per system and architecture (and sometimes per system C library), with a compiler on the installer’s machine unless prebuilds exist. A memory error or an unhandled C++ exception takes down the **whole process**, and no JavaScript `try/catch` catches it. The addon runs with all the process’s privileges, with no sandbox: installing a third-party one means running arbitrary native code. And crossing the JavaScript/C++ boundary has a cost, so small, frequent calls can cancel the gain.",
      },
    ],
    armadilhas: [
      "Thinking a stable ABI means “compile once, run anywhere”: the binary is still specific to the operating system and architecture, and only stops depending on the Node version.",
      "Writing an addon “to be faster” without measuring: the JS/C++ boundary has a cost, and `worker_threads` or WebAssembly may be enough.",
      "Treating the addon like JavaScript code: a memory error or an unhandled exception takes down the process without going through any `try/catch`.",
      "Starting a new project on NAN or directly on the V8 API, and being stuck recompiling and adapting with every Node version.",
    ],
    autoteste: [
      {
        pergunta: "Why does a Node-API addon survive a Node version change and a NAN one does not?",
        resposta:
          "Node-API is a stable C interface that does not expose V8 types; the binary only calls functions Node keeps. NAN is compiled against the V8 API, which changes between versions, so it must be recompiled (and sometimes adapted).",
      },
      {
        pergunta: "When is it worth writing an addon instead of using JavaScript, a worker thread or WebAssembly?",
        resposta:
          "When you need to reuse an existing native library or call a system API Node does not expose. For pure CPU work, measure first: a worker thread or WebAssembly is often enough, with no per-platform build.",
      },
    ],
  },
};
