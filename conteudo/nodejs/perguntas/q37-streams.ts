import type { Pergunta } from "../../tipos";

// Q37 · Streams
export const q37: Pergunta = {
  numero: 37,
  modulo: "turing-intermediarias",
  metodo: "feynman",
  pt: {
    titulo: "Streams",
    pergunta: "O que são e como funcionam os Streams em Node.js?",
    porqueEsteMetodo:
      "Stream é um conceito de fluxo que se entende melhor por imagem: uma linha de produção com esteira. A analogia dá a intuição de pedaços e de “freio”, e o código mostra como o Node.js faz isso de verdade.",
    resposta30s:
      "**Streams** processam dados **em pedaços (chunks)**, à medida que chegam, em vez de carregar tudo na memória. Há quatro tipos: **Readable** (fonte), **Writable** (destino), **Duplex** (os dois) e **Transform** (altera os dados no caminho). Você os liga com `pipeline`, e o **backpressure** faz a fonte esperar quando o destino é mais lento. O resultado é memória estável mesmo com arquivos enormes, e o processamento começa antes de o dado terminar de chegar.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Uma linha de engarrafamento: as garrafas vazias entram numa esteira, passam pela máquina que enche e seguem para a embalagem. Ninguém espera juntar todas as garrafas do dia numa sala para começar; cada garrafa anda assim que chega, e a sala pode ser pequena. Se a embalagem fica lenta, a esteira desacelera e as garrafas param de entrar. Nada transborda.",
        tecnico:
          "Stream é a abstração para dados que chegam (ou saem) **aos poucos**. Cada pedaço é um **chunk** (um `Buffer` ou uma string; em **modo objeto**, qualquer valor). Todos os streams são `EventEmitter`s (`data`, `end`, `error`, `finish`) e também podem ser lidos com `for await (const chunk of stream)`. Eles aparecem em todo o Node.js: arquivos, sockets, requisição e resposta HTTP, compressão, `stdin` e `stdout`. `pipe` e `pipeline` ligam a saída de um stream à entrada do próximo e cuidam do backpressure; o `pipeline` ainda repassa erros e fecha tudo.",
        limite:
          "Na fábrica a esteira para sozinha. No Node.js, quem usa `pipe` ou `pipeline` ganha isso de graça, mas se você chama `write()` em um laço e ignora o `false` que ele devolve, os pedaços se acumulam na memória e nada protege você. Além disso, `pipe` sozinho não repassa um erro de uma etapa para as outras, e a esteira real não deixa uma garrafa pela metade.",
      },
      {
        tipo: "tabela",
        titulo: "Os quatro tipos",
        colunas: ["Tipo", "Papel", "Exemplos"],
        linhas: [
          [
            "Readable",
            "Fonte: produz pedaços para quem for consumir",
            "`fs.createReadStream`, a requisição HTTP no servidor, `process.stdin`",
          ],
          ["Writable", "Destino: recebe pedaços", "`fs.createWriteStream`, a resposta HTTP, `process.stdout`"],
          ["Duplex", "Lê e escreve, com os dois lados independentes", "Socket TCP (`node:net`)"],
          [
            "Transform",
            "Duplex que altera os dados enquanto passam",
            "`zlib.createGzip`, cifras do `node:crypto`, um parser de CSV",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Comprimir um arquivo grande sem carregá-lo na memória",
        legenda: "JavaScript",
        codigo: [
          'import { createReadStream, createWriteStream } from "node:fs";',
          'import { createGzip } from "node:zlib";',
          'import { pipeline } from "node:stream/promises";',
          "",
          "try {",
          "  await pipeline(",
          '    createReadStream("log-gigante.txt"), // Readable',
          "    createGzip(), // Transform",
          '    createWriteStream("log-gigante.txt.gz"), // Writable',
          "  );",
          '  console.log("pronto");',
          "} catch (err) {",
          '  console.error("falhou:", err); // um só tratamento para toda a cadeia',
          "}",
        ].join("\n"),
        nota: "O uso de memória não cresce com o tamanho do arquivo. Com `readFile` seguido de `gzipSync`, o arquivo inteiro teria de caber na memória.",
      },
      {
        tipo: "fluxo",
        titulo: "Backpressure: o freio automático",
        etapas: [
          "O Readable lê um chunk e o entrega ao Writable com `write(chunk)`",
          "Se o Writable acompanha o ritmo, nada de especial acontece e o ciclo se repete",
          "Se ele é mais lento, o buffer interno enche e `write()` devolve `false`",
          "A fonte é pausada: `pipe` e `pipeline` fazem isso sozinhos; sem eles, é preciso esperar o evento `drain`",
          "Quando o buffer esvazia, o Writable emite `drain` e a leitura recomeça",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "pipeline em vez de pipe",
        texto:
          "Prefira `pipeline` (de `node:stream` ou de `node:stream/promises`) a encadear `.pipe()`: se qualquer etapa falhar, ele **destrói todos os streams** e devolve **um único erro**, sem deixar arquivos abertos. Em **modo objeto** (`objectMode: true`) o stream passa objetos JavaScript em vez de bytes, útil para registros já interpretados. Para arquivos pequenos, `readFile` é mais simples (veja Q56).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Streams que você já usa",
        texto:
          "`req` e `res` em `node:http` são streams: dá para ler o corpo de uma requisição em pedaços e enviar um arquivo grande com `pipeline(createReadStream(caminho), res, callback)`, sem carregá-lo inteiro. Veja também Q48 (servidor HTTP).",
      },
    ],
    armadilhas: [
      "Usar `readFile` e `JSON.parse` em um arquivo enorme quando um stream bastaria: a memória pode estourar.",
      "Encadear `.pipe()` sem tratar `error` em cada stream: o erro não se propaga e recursos ficam abertos; use `pipeline`.",
      "Chamar `write()` em um laço ignorando o retorno: sem backpressure, a memória cresce sem limite.",
      "Esquecer que um chunk não respeita fronteiras de linha nem de caractere: ao ler texto, uma linha pode vir cortada no meio; use `readline` ou um Transform que guarde o resto.",
    ],
    autoteste: [
      {
        pergunta: "Quais são os quatro tipos de stream? Dê um exemplo de cada.",
        resposta:
          "Readable (`fs.createReadStream`), Writable (`fs.createWriteStream`), Duplex (socket TCP) e Transform (`zlib.createGzip`).",
      },
      {
        pergunta: "O que é backpressure e como ele é acionado?",
        resposta:
          "É o mecanismo pelo qual um destino lento faz a fonte esperar. Quando o buffer do Writable enche, `write()` devolve `false`; `pipe` e `pipeline` pausam a fonte e retomam no evento `drain`.",
      },
      {
        pergunta: "Por que `pipeline` é mais seguro que `pipe`?",
        resposta:
          "Porque ele propaga erros entre as etapas, destrói todos os streams da cadeia quando algo falha e entrega um único erro, evitando descritores de arquivo vazados.",
      },
    ],
  },
  en: {
    titulo: "Streams",
    pergunta: "What are streams in Node.js and how do they work?",
    porqueEsteMetodo:
      "A stream is a flow concept that is easier to grasp as an image: a production line with a conveyor belt. The analogy gives the intuition of pieces and of a “brake”, and the code shows how Node.js actually does it.",
    resposta30s:
      "**Streams** process data **in pieces (chunks)** as it arrives, instead of loading everything into memory. There are four types: **Readable** (source), **Writable** (destination), **Duplex** (both) and **Transform** (changes the data on the way). You connect them with `pipeline`, and **backpressure** makes the source wait when the destination is slower. The result is steady memory even for huge files, and processing starts before the data has finished arriving.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A bottling line: empty bottles enter a conveyor belt, pass through the filling machine and move on to packing. Nobody waits to gather the whole day’s bottles in a room before starting; each bottle moves as soon as it arrives, and the room can be small. If packing slows down, the belt slows and bottles stop entering. Nothing overflows.",
        tecnico:
          "A stream is the abstraction for data that arrives (or leaves) **a little at a time**. Each piece is a **chunk** (a `Buffer` or a string; in **object mode**, any value). All streams are `EventEmitter`s (`data`, `end`, `error`, `finish`) and can also be read with `for await (const chunk of stream)`. They appear all over Node.js: files, sockets, HTTP requests and responses, compression, `stdin` and `stdout`. `pipe` and `pipeline` connect one stream’s output to the next one’s input and handle backpressure; `pipeline` also forwards errors and closes everything.",
        limite:
          "In the factory the belt stops by itself. In Node.js, whoever uses `pipe` or `pipeline` gets that for free, but if you call `write()` in a loop and ignore the `false` it returns, chunks pile up in memory and nothing protects you. Also, `pipe` alone does not forward an error from one stage to the others, and a real belt never leaves a bottle half filled.",
      },
      {
        tipo: "tabela",
        titulo: "The four types",
        colunas: ["Type", "Role", "Examples"],
        linhas: [
          [
            "Readable",
            "Source: produces chunks for whoever consumes them",
            "`fs.createReadStream`, the HTTP request on the server, `process.stdin`",
          ],
          ["Writable", "Destination: receives chunks", "`fs.createWriteStream`, the HTTP response, `process.stdout`"],
          ["Duplex", "Reads and writes, with independent sides", "TCP socket (`node:net`)"],
          [
            "Transform",
            "A Duplex that changes the data as it passes",
            "`zlib.createGzip`, `node:crypto` ciphers, a CSV parser",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Compressing a large file without loading it into memory",
        legenda: "JavaScript",
        codigo: [
          'import { createReadStream, createWriteStream } from "node:fs";',
          'import { createGzip } from "node:zlib";',
          'import { pipeline } from "node:stream/promises";',
          "",
          "try {",
          "  await pipeline(",
          '    createReadStream("huge-log.txt"), // Readable',
          "    createGzip(), // Transform",
          '    createWriteStream("huge-log.txt.gz"), // Writable',
          "  );",
          '  console.log("done");',
          "} catch (err) {",
          '  console.error("failed:", err); // one handler for the whole chain',
          "}",
        ].join("\n"),
        nota: "Memory use does not grow with the file size. With `readFile` followed by `gzipSync`, the whole file would have to fit in memory.",
      },
      {
        tipo: "fluxo",
        titulo: "Backpressure: the automatic brake",
        etapas: [
          "The Readable reads a chunk and hands it to the Writable with `write(chunk)`",
          "If the Writable keeps up, nothing special happens and the cycle repeats",
          "If it is slower, its internal buffer fills and `write()` returns `false`",
          "The source is paused: `pipe` and `pipeline` do this on their own; without them, you must wait for the `drain` event",
          "When the buffer empties, the Writable emits `drain` and reading resumes",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "pipeline instead of pipe",
        texto:
          "Prefer `pipeline` (from `node:stream` or `node:stream/promises`) over chaining `.pipe()`: if any stage fails, it **destroys all the streams** and returns **a single error**, leaving no open files behind. In **object mode** (`objectMode: true`) a stream passes JavaScript objects instead of bytes, which suits records that are already parsed. For small files, `readFile` is simpler (see Q56).",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Streams you already use",
        texto:
          "`req` and `res` in `node:http` are streams: you can read a request body in chunks and send a large file with `pipeline(createReadStream(path), res, callback)` without loading it whole. See also Q48 (HTTP server).",
      },
    ],
    armadilhas: [
      "Using `readFile` and `JSON.parse` on a huge file when a stream would do: memory can blow up.",
      "Chaining `.pipe()` without handling `error` on each stream: the error does not propagate and resources stay open; use `pipeline`.",
      "Calling `write()` in a loop and ignoring its return value: without backpressure, memory grows without limit.",
      "Forgetting that a chunk respects neither line nor character boundaries: when reading text, a line may arrive cut in half; use `readline` or a Transform that keeps the remainder.",
    ],
    autoteste: [
      {
        pergunta: "What are the four stream types? Give an example of each.",
        resposta:
          "Readable (`fs.createReadStream`), Writable (`fs.createWriteStream`), Duplex (a TCP socket) and Transform (`zlib.createGzip`).",
      },
      {
        pergunta: "What is backpressure and how is it triggered?",
        resposta:
          "It is the mechanism by which a slow destination makes the source wait. When the Writable’s buffer fills, `write()` returns `false`; `pipe` and `pipeline` pause the source and resume on the `drain` event.",
      },
      {
        pergunta: "Why is `pipeline` safer than `pipe`?",
        resposta:
          "Because it propagates errors between stages, destroys every stream in the chain when something fails and delivers a single error, avoiding leaked file descriptors.",
      },
    ],
  },
};
