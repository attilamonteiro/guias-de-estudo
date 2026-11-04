import type { Pergunta } from "../../tipos";

// L65 · Módulo fs
export const l065: Pergunta = {
  numero: 165,
  modulo: "linkedin-streams",
  metodo: "compare",
  pt: {
    titulo: "Módulo fs",
    pergunta: "Como funciona o módulo fs?",
    porqueEsteMetodo:
      "O `fs` oferece a mesma operação em quatro formas (callback, promise, síncrona e stream), e a pergunta sobre síncrono x assíncrono é a escolha entre elas. A matriz coloca as formas lado a lado e a regra de decisão diz quando usar cada uma.",
    resposta30s:
      "O módulo **`node:fs`** dá acesso ao sistema de arquivos de quatro formas: **callbacks**, **promises** (`node:fs/promises`), versões **`*Sync`** e **streams**. As formas assíncronas não bloqueiam o laço de eventos (o trabalho vai para o pool de threads do libuv), enquanto as `*Sync` seguram a thread do JavaScript até terminar. Prefira `fs/promises` em servidores e deixe as `*Sync` para scripts e para a inicialização.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As quatro formas de usar o fs",
        colunas: ["Forma", "Como se usa", "Bloqueia a thread do JavaScript?", "Quando usar"],
        linhas: [
          [
            "Callback (`fs.readFile`)",
            "`readFile(caminho, (err, dados) => {...})`, com o erro no primeiro argumento",
            "Não: o trabalho roda no pool de threads do libuv e o callback volta ao laço quando termina",
            "Código legado e APIs que ainda pedem callback; no código novo, prefira promises",
          ],
          [
            "Promises (`node:fs/promises`)",
            "`await readFile(caminho)` dentro de `try/catch`",
            "Não: mesmo mecanismo da forma anterior",
            "O padrão em servidores e no código novo",
          ],
          [
            "Síncrona (`readFileSync`)",
            "Devolve o resultado direto e lança exceção se falhar",
            "Sim: a thread espera o disco e nenhum outro evento é atendido enquanto isso",
            "Scripts, ferramentas de linha de comando e a partida da aplicação (carregar configuração antes de aceitar requisições)",
          ],
          [
            "Streams (`createReadStream`, `createWriteStream`)",
            "Lê ou escreve em pedaços, ligado a outros streams com `pipeline`",
            "Não",
            "Arquivos grandes ou de tamanho incerto (veja T56 e L62)",
          ],
        ],
        nota: "A maior parte das operações (`readdir`, `stat`, `mkdir`, `rm`, `rename`, `open`…) existe nas três primeiras formas. Nas versões de promise, `open` devolve um `FileHandle`, que você precisa fechar.",
      },
      {
        tipo: "codigo",
        titulo: "Sync na partida, assíncrono no atendimento",
        legenda: "JavaScript",
        codigo: [
          'import { readFileSync } from "node:fs";',
          'import { readFile, writeFile } from "node:fs/promises";',
          "",
          "// Na partida, antes de aceitar requisições, o Sync é aceitável",
          'const config = JSON.parse(readFileSync("config.json", "utf8"));',
          "",
          "// Durante o atendimento, use a versão assíncrona e trate o código do erro",
          "try {",
          '  const texto = await readFile("dados.txt", "utf8");',
          '  await writeFile("copia.txt", texto);',
          "} catch (erro) {",
          '  if (erro.code === "ENOENT") console.error("arquivo não existe");',
          "  else throw erro;",
          "}",
        ].join("\n"),
        nota: "`erro.code` identifica a causa: `ENOENT` (não existe), `EACCES` (sem permissão), `EEXIST` (já existe), `EISDIR` (é um diretório), `EMFILE` (arquivos abertos demais). Tente a operação e trate o erro em vez de conferir antes com `existsSync`: a situação pode mudar entre a checagem e o uso.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Roda uma vez, na partida, ou é um script de linha de comando? A forma **síncrona** é simples e segura. Roda enquanto o programa atende outras coisas (um servidor)? **Promises**. O arquivo é grande ou de tamanho incerto? **Stream** (veja T56). O que muda não é o resultado, é quem espera: na síncrona, a aplicação inteira.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Assíncrono não é ilimitado",
        texto:
          "As operações de arquivo usam o pool de threads do libuv, que é pequeno (veja T43). Disparar milhares de leituras com `Promise.all` enfileira tudo nele, pode estourar o limite de arquivos abertos (`EMFILE`) e atrasa o que divide o pool, como DNS e criptografia. Limite a concorrência (lotes ou uma fila). Para o laço de eventos em si, veja T28.",
      },
    ],
    armadilhas: [
      "Usar `readFileSync` ou outra `*Sync` dentro de um handler de servidor: todos os usuários esperam o disco de um deles.",
      "Conferir `existsSync` antes de abrir o arquivo: é uma condição de corrida; tente abrir e trate `ENOENT`.",
      "Lançar milhares de operações de uma vez com `Promise.all`: sobrecarrega o pool de threads e pode dar `EMFILE`.",
      "Ler com `readFile` um arquivo grande ou de tamanho desconhecido: ele vai inteiro para a memória; use stream.",
    ],
    autoteste: [
      {
        pergunta: "Por que `readFile` não trava o servidor e `readFileSync` trava?",
        resposta:
          "A versão assíncrona delega o trabalho ao pool de threads do libuv e libera a thread do JavaScript; o callback ou a promise voltam ao laço quando o disco responde. A síncrona executa na própria thread do JavaScript, que fica parada até terminar.",
      },
      {
        pergunta: "Como tratar corretamente um arquivo que pode não existir?",
        resposta:
          "Tente a operação dentro de `try/catch` e compare `erro.code` com `ENOENT`, em vez de checar a existência antes, o que abre uma condição de corrida.",
      },
    ],
  },
  en: {
    titulo: "The fs module",
    pergunta: "How does the fs module work?",
    porqueEsteMetodo:
      "`fs` offers the same operation in four forms (callback, promise, synchronous and stream), and the question about sync versus async is really a choice between them. The matrix puts the forms side by side and the decision rule says when to use each one.",
    resposta30s:
      "The **`node:fs`** module gives you access to the file system in four forms: **callbacks**, **promises** (`node:fs/promises`), **`*Sync`** versions and **streams**. The asynchronous forms do not block the event loop (the work goes to the libuv thread pool), while `*Sync` calls hold the JavaScript thread until they finish. Prefer `fs/promises` in servers and keep `*Sync` for scripts and for startup.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The four ways to use fs",
        colunas: ["Form", "How you use it", "Blocks the JavaScript thread?", "When to use it"],
        linhas: [
          [
            "Callback (`fs.readFile`)",
            "`readFile(path, (err, data) => {...})`, with the error as the first argument",
            "No: the work runs on the libuv thread pool and the callback returns to the loop when it finishes",
            "Legacy code and APIs that still ask for a callback; in new code, prefer promises",
          ],
          [
            "Promises (`node:fs/promises`)",
            "`await readFile(path)` inside `try/catch`",
            "No: same mechanism as the previous form",
            "The default in servers and in new code",
          ],
          [
            "Synchronous (`readFileSync`)",
            "Returns the result directly and throws if it fails",
            "Yes: the thread waits for the disk and no other event is served meanwhile",
            "Scripts, command-line tools and application startup (loading configuration before accepting requests)",
          ],
          [
            "Streams (`createReadStream`, `createWriteStream`)",
            "Reads or writes in chunks, connected to other streams with `pipeline`",
            "No",
            "Large files or files of uncertain size (see T56 and L62)",
          ],
        ],
        nota: "Most operations (`readdir`, `stat`, `mkdir`, `rm`, `rename`, `open`…) exist in the first three forms. In the promise versions, `open` returns a `FileHandle`, which you must close.",
      },
      {
        tipo: "codigo",
        titulo: "Sync at startup, async while serving",
        legenda: "JavaScript",
        codigo: [
          'import { readFileSync } from "node:fs";',
          'import { readFile, writeFile } from "node:fs/promises";',
          "",
          "// At startup, before accepting requests, Sync is acceptable",
          'const config = JSON.parse(readFileSync("config.json", "utf8"));',
          "",
          "// While serving, use the async version and handle the error code",
          "try {",
          '  const text = await readFile("data.txt", "utf8");',
          '  await writeFile("copy.txt", text);',
          "} catch (error) {",
          '  if (error.code === "ENOENT") console.error("file does not exist");',
          "  else throw error;",
          "}",
        ].join("\n"),
        nota: "`error.code` identifies the cause: `ENOENT` (does not exist), `EACCES` (no permission), `EEXIST` (already exists), `EISDIR` (is a directory), `EMFILE` (too many open files). Try the operation and handle the error instead of checking first with `existsSync`: things can change between the check and the use.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Does it run once, at startup, or is it a command-line script? The **synchronous** form is simple and safe. Does it run while the program serves other things (a server)? **Promises**. Is the file large or of uncertain size? **Stream** (see T56). What changes is not the result, it is who waits: in the synchronous form, the whole application.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Async is not unlimited",
        texto:
          "File operations use the libuv thread pool, which is small (see T43). Firing thousands of reads with `Promise.all` queues them all on it, can exhaust the open-file limit (`EMFILE`) and delays whatever shares the pool, such as DNS and cryptography. Limit concurrency (batches or a queue). For the event loop itself, see T28.",
      },
    ],
    armadilhas: [
      "Using `readFileSync` or another `*Sync` call inside a server handler: every user waits for one user’s disk access.",
      "Checking `existsSync` before opening the file: it is a race condition; try to open it and handle `ENOENT`.",
      "Launching thousands of operations at once with `Promise.all`: it overloads the thread pool and can raise `EMFILE`.",
      "Reading a large or unknown-size file with `readFile`: it goes into memory whole; use a stream.",
    ],
    autoteste: [
      {
        pergunta: "Why does `readFile` not freeze the server while `readFileSync` does?",
        resposta:
          "The async version delegates the work to the libuv thread pool and frees the JavaScript thread; the callback or promise returns to the loop when the disk answers. The sync version runs on the JavaScript thread itself, which sits idle until it finishes.",
      },
      {
        pergunta: "How do you correctly handle a file that may not exist?",
        resposta:
          "Try the operation inside `try/catch` and compare `error.code` with `ENOENT`, instead of checking existence first, which opens a race condition.",
      },
    ],
  },
};
