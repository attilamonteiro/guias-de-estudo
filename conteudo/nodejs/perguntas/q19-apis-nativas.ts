import type { Pergunta } from "../../tipos";

// Q19 · APIs nativas do Node.js
export const q19: Pergunta = {
  numero: 19,
  modulo: "turing-basicas",
  metodo: "compare",
  pt: {
    titulo: "APIs nativas do Node.js",
    pergunta: "O Node.js suporta quais recursos de APIs?",
    porqueEsteMetodo:
      "No fundo a pergunta é “o que já vem pronto e o que preciso buscar fora?”. Uma matriz dos módulos nativos, com o que cada um oferece e quando usar, responde isso de uma vez e prepara a regra de decisão entre o núcleo e o npm.",
    resposta30s:
      "O Node.js traz um conjunto grande de **módulos nativos** (o “núcleo”), disponíveis sem instalar nada: `fs` (arquivos), `http`/`https` (rede e servidores), `path`, `os`, `events`, `stream`, `crypto`, `url`, `child_process`, `worker_threads`, `zlib`, `net`, `util` e `assert`. Nas versões atuais há também Web APIs como `fetch` e `URL`. Importe com o prefixo `node:` e **só vá ao npm quando o núcleo não cobrir o caso**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Módulos nativos mais usados",
        colunas: ["Módulo", "O que oferece", "Quando usar"],
        linhas: [
          [
            "`node:fs` e `fs/promises`",
            "Ler, gravar e listar arquivos e pastas",
            "Configuração, uploads, logs; para arquivos grandes, prefira streams (Q37, Q56)",
          ],
          [
            "`node:http` e `node:https`",
            "Criar servidores e fazer requisições HTTP",
            "APIs sem framework, proxies simples (veja Q48); o servidor `https` exige certificado",
          ],
          [
            "`node:path`",
            "Montar e interpretar caminhos de forma portável",
            "Sempre que juntar caminhos: `join`, `resolve`, `basename`",
          ],
          [
            "`node:os`",
            "Dados do sistema: núcleos, memória, pasta temporária",
            "Dimensionar workers, diagnóstico, caminhos temporários",
          ],
          [
            "`node:events`",
            "`EventEmitter`, a base da comunicação por eventos",
            "Objetos que avisam o que acontece (veja Q26 e Q61)",
          ],
          [
            "`node:stream`",
            "Dados em pedaços, com backpressure",
            "Arquivos e respostas grandes, compressão, cópia (veja Q37)",
          ],
          [
            "`node:crypto`",
            "Hashes, HMAC, números aleatórios seguros, cifras",
            "Tokens, assinaturas, hash de senha com função lenta (veja Q46)",
          ],
          [
            "`node:url`",
            "Interpretar e montar URLs (`URL`, `URLSearchParams`)",
            "Parâmetros de consulta, links, validação de endereços",
          ],
          [
            "`node:child_process`",
            "Executar outros programas a partir do Node.js",
            "Chamar ferramentas externas (veja Q58)",
          ],
          [
            "`node:worker_threads`",
            "Threads de trabalho dentro do mesmo processo",
            "Tirar CPU pesada do laço de eventos (veja Q59)",
          ],
          ["`node:zlib`", "Compressão e descompressão (gzip, deflate, brotli)", "Comprimir respostas e arquivos"],
          [
            "`node:net`",
            "Sockets TCP e comunicação entre processos",
            "Protocolos próprios, clientes e servidores de baixo nível",
          ],
          [
            "`node:util`",
            "Utilitários: `promisify`, `inspect`, `format`",
            "Converter callbacks em promises, depurar objetos",
          ],
          [
            "`node:assert`",
            "Verificações que lançam erro quando falham",
            "Testes simples e invariantes; combina com o executor de testes embutido (`node:test`)",
          ],
          [
            "Globais: `fetch`, `URL`, `AbortController`, `structuredClone`",
            "Web APIs padrão, presentes nas versões atuais",
            "Cliente HTTP sem biblioteca, cancelamento de operações; não há DOM (`document`, `window`)",
          ],
        ],
        nota: "Lista parcial. A documentação oficial (nodejs.org) traz todos os módulos e o índice de estabilidade de cada um (experimental, estável, depreciado).",
      },
      {
        tipo: "codigo",
        titulo: "Vários módulos nativos juntos, sem instalar nada",
        legenda: "JavaScript",
        codigo:
          "import { readFile } from 'node:fs/promises';\nimport { join } from 'node:path';\nimport { cpus } from 'node:os';\nimport { createServer } from 'node:http';\n\nconst texto = await readFile(join('dados', 'config.json'), 'utf8');\nconsole.log('Núcleos disponíveis:', cpus().length);\n\ncreateServer((req, res) => {\n  res.setHeader('Content-Type', 'application/json');\n  res.end(texto);\n}).listen(3000);",
        nota: 'O `await` fora de função exige ES Modules (arquivo `.mjs` ou `"type": "module"` no `package.json`).',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão: núcleo ou npm?",
        texto:
          "Comece pelo **núcleo**: não precisa instalar, acompanha o Node.js, tem a mesma documentação e não traz dependências de terceiros para auditar. Vá ao **npm** quando o núcleo for baixo nível demais (rotas e middlewares: use um framework, veja Q13) ou quando faltar o recurso (driver de banco, validação de esquemas). O prefixo `node:` deixa claro que o módulo é nativo e evita confusão com um pacote do npm de mesmo nome; alguns módulos, como `node:test`, só existem com ele.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A pergunta é ampla",
        texto:
          "“Quais recursos de APIs?” pode querer dizer duas coisas: (1) **quais APIs o Node.js traz prontas**, que é a tabela acima; ou (2) **que tipo de API você consegue construir com ele** (REST/JSON, GraphQL, WebSocket, gRPC), normalmente com `node:http` ou um framework. Vale responder às duas. E lembre: o Node.js não é um navegador, então não tem DOM, `window` nem `document`, só as Web APIs de rede e utilitários.",
      },
    ],
    armadilhas: [
      "Instalar do npm algo que o núcleo já faz (juntar caminhos, comprimir, gerar UUID, hash), aumentando a superfície de dependências.",
      "Esperar que o Node.js seja um navegador: não há DOM, e `fetch` e `URL` existem, mas a lista de Web APIs é a do servidor.",
      "Usar as variantes síncronas (`readFileSync`) dentro de um servidor: elas bloqueiam o laço de eventos (veja Q28).",
      "Ignorar o índice de estabilidade: depender de API experimental ou depreciada em produção (por exemplo, o módulo `punycode` embutido, veja Q60).",
    ],
    autoteste: [
      {
        pergunta: "Por que escrever `node:fs` em vez de apenas `fs`?",
        resposta:
          "O prefixo `node:` marca o módulo como nativo, evita ambiguidade com um pacote do npm de mesmo nome e é o único jeito de importar alguns módulos, como `node:test`.",
      },
      {
        pergunta: "Cite cinco módulos nativos e para que servem.",
        resposta:
          "`fs` (arquivos), `http` (servidores e requisições), `path` (caminhos), `crypto` (hash e aleatoriedade segura) e `events` (EventEmitter). Também valem `stream`, `os`, `zlib` e `child_process`.",
      },
      {
        pergunta: "O Node.js tem acesso ao DOM, como `document.getElementById`?",
        resposta:
          "Não. O DOM é do navegador. O Node.js oferece APIs de servidor (arquivos, rede, processos) e algumas Web APIs de uso geral, como `fetch` e `URL`.",
      },
    ],
  },
  en: {
    titulo: "Node.js built-in APIs",
    pergunta: "Which API features does Node.js support?",
    porqueEsteMetodo:
      "Underneath, the question is “what ships ready and what do I have to fetch elsewhere?”. A matrix of the built-in modules, with what each one offers and when to use it, answers that at once and sets up the decision rule between core and npm.",
    resposta30s:
      "Node.js ships a large set of **built-in modules** (the “core”), available without installing anything: `fs` (files), `http`/`https` (networking and servers), `path`, `os`, `events`, `stream`, `crypto`, `url`, `child_process`, `worker_threads`, `zlib`, `net`, `util` and `assert`. Current versions also include Web APIs such as `fetch` and `URL`. Import them with the `node:` prefix and **only reach for npm when the core does not cover the case**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Most used built-in modules",
        colunas: ["Module", "What it offers", "When to use it"],
        linhas: [
          [
            "`node:fs` and `fs/promises`",
            "Read, write and list files and folders",
            "Configuration, uploads, logs; for large files, prefer streams (Q37, Q56)",
          ],
          [
            "`node:http` and `node:https`",
            "Create servers and make HTTP requests",
            "APIs without a framework, simple proxies (see Q48); an `https` server needs a certificate",
          ],
          [
            "`node:path`",
            "Build and parse paths in a portable way",
            "Whenever you join paths: `join`, `resolve`, `basename`",
          ],
          ["`node:os`", "System data: cores, memory, temp folder", "Sizing workers, diagnostics, temporary paths"],
          [
            "`node:events`",
            "`EventEmitter`, the basis of event-based communication",
            "Objects that announce what happens (see Q26 and Q61)",
          ],
          [
            "`node:stream`",
            "Data in chunks, with backpressure",
            "Large files and responses, compression, copying (see Q37)",
          ],
          [
            "`node:crypto`",
            "Hashes, HMAC, secure random numbers, ciphers",
            "Tokens, signatures, password hashing with a slow function (see Q46)",
          ],
          [
            "`node:url`",
            "Parse and build URLs (`URL`, `URLSearchParams`)",
            "Query parameters, links, address validation",
          ],
          ["`node:child_process`", "Run other programs from Node.js", "Calling external tools (see Q58)"],
          [
            "`node:worker_threads`",
            "Worker threads inside the same process",
            "Moving heavy CPU work off the event loop (see Q59)",
          ],
          ["`node:zlib`", "Compression and decompression (gzip, deflate, brotli)", "Compressing responses and files"],
          [
            "`node:net`",
            "TCP sockets and inter-process communication",
            "Custom protocols, low-level clients and servers",
          ],
          [
            "`node:util`",
            "Utilities: `promisify`, `inspect`, `format`",
            "Turning callbacks into promises, inspecting objects",
          ],
          [
            "`node:assert`",
            "Checks that throw an error when they fail",
            "Simple tests and invariants; pairs with the built-in test runner (`node:test`)",
          ],
          [
            "Globals: `fetch`, `URL`, `AbortController`, `structuredClone`",
            "Standard Web APIs, present in current versions",
            "HTTP client without a library, cancelling operations; there is no DOM (`document`, `window`)",
          ],
        ],
        nota: "Partial list. The official documentation (nodejs.org) lists every module and the stability index of each one (experimental, stable, deprecated).",
      },
      {
        tipo: "codigo",
        titulo: "Several built-in modules together, nothing to install",
        legenda: "JavaScript",
        codigo:
          "import { readFile } from 'node:fs/promises';\nimport { join } from 'node:path';\nimport { cpus } from 'node:os';\nimport { createServer } from 'node:http';\n\nconst text = await readFile(join('data', 'config.json'), 'utf8');\nconsole.log('Available cores:', cpus().length);\n\ncreateServer((req, res) => {\n  res.setHeader('Content-Type', 'application/json');\n  res.end(text);\n}).listen(3000);",
        nota: 'A top-level `await` requires ES Modules (a `.mjs` file or `"type": "module"` in `package.json`).',
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule: core or npm?",
        texto:
          "Start with the **core**: nothing to install, it ships with Node.js, shares its documentation and brings no third-party dependencies to audit. Go to **npm** when the core is too low-level (routes and middleware: use a framework, see Q13) or when the feature is missing (database driver, schema validation). The `node:` prefix makes it clear that a module is built in and avoids confusion with an npm package of the same name; some modules, such as `node:test`, only exist with it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The question is broad",
        texto:
          "“Which API features?” can mean two things: (1) **which APIs Node.js ships ready to use**, which is the table above; or (2) **what kind of API you can build with it** (REST/JSON, GraphQL, WebSocket, gRPC), usually with `node:http` or a framework. It is worth answering both. And remember: Node.js is not a browser, so it has no DOM, `window` or `document`, only the Web APIs for networking and utilities.",
      },
    ],
    armadilhas: [
      "Installing from npm something the core already does (joining paths, compressing, generating UUIDs, hashing), growing the dependency surface.",
      "Expecting Node.js to be a browser: there is no DOM, and `fetch` and `URL` exist, but the list of Web APIs is the server one.",
      "Using the synchronous variants (`readFileSync`) inside a server: they block the event loop (see Q28).",
      "Ignoring the stability index: relying on an experimental or deprecated API in production (for example, the built-in `punycode` module, see Q60).",
    ],
    autoteste: [
      {
        pergunta: "Why write `node:fs` instead of just `fs`?",
        resposta:
          "The `node:` prefix marks the module as built in, avoids ambiguity with an npm package of the same name and is the only way to import some modules, such as `node:test`.",
      },
      {
        pergunta: "Name five built-in modules and what they are for.",
        resposta:
          "`fs` (files), `http` (servers and requests), `path` (paths), `crypto` (hashing and secure randomness) and `events` (EventEmitter). `stream`, `os`, `zlib` and `child_process` also count.",
      },
      {
        pergunta: "Does Node.js have access to the DOM, such as `document.getElementById`?",
        resposta:
          "No. The DOM belongs to the browser. Node.js offers server APIs (files, networking, processes) and some general-purpose Web APIs, such as `fetch` and `URL`.",
      },
    ],
  },
};
