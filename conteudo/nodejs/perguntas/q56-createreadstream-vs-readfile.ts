import type { Pergunta } from "../../tipos";

// Q56 · createReadStream vs readFile
export const q56: Pergunta = {
  numero: 56,
  modulo: "turing-avancadas",
  metodo: "compare",
  pt: {
    titulo: "createReadStream vs readFile",
    pergunta: "Em Node.js, qual é a diferença entre createReadStream e readFile?",
    porqueEsteMetodo:
      "É um “X vs Y”: a matriz coloca memória, latência e controle lado a lado, e a regra de decisão diz qual usar conforme o tamanho e o destino do arquivo.",
    resposta30s:
      "`readFile` lê o arquivo **inteiro para a memória** e só entrega o resultado no final; `createReadStream` lê **em pedaços** (chunks), então o uso de memória fica quase constante e você começa a processar logo. Use `readFile` para arquivos pequenos de que precisa por inteiro (um JSON de configuração) e **stream** para arquivos grandes, de tamanho incerto ou quando o destino também é um stream (resposta HTTP, compressão).",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspecto", "`readFile`", "`createReadStream`"],
        linhas: [
          [
            "Como lê",
            "O arquivo todo de uma vez; o resultado só chega completo",
            "Em pedaços de tamanho limitado (`highWaterMark`), conforme o consumidor pede",
          ],
          ["Memória", "Proporcional ao tamanho do arquivo", "Quase constante: um pedaço e alguns buffers"],
          ["Quando começa a processar", "Só depois de ler tudo", "Assim que o primeiro pedaço chega"],
          [
            "O que devolve",
            "Um `Buffer` ou uma string (com `encoding`), por callback ou `Promise`",
            "Um `Readable`: eventos `data`, `pipe`/`pipeline` ou `for await`",
          ],
          ["Controle de fluxo", "Nenhum", "Backpressure com `pipeline`; `start` e `end` leem só uma faixa do arquivo"],
          [
            "Erros",
            "Um só: o callback ou a `Promise` rejeitada",
            "Evento `error`; use `pipeline` para garantir a limpeza",
          ],
          ["Simplicidade", "Alta: uma linha com `await`", "Menor: mais peças (eventos, `pipeline`)"],
          [
            "Melhor para",
            "Arquivos pequenos usados por inteiro (JSON, template, chave)",
            "Arquivos grandes ou de tamanho desconhecido: cópia, compressão, upload, resposta HTTP, leitura linha a linha",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte: preciso do arquivo **inteiro** na memória para trabalhar, e ele cabe com folga? Então `readFile` (de `node:fs/promises`). Caso contrário, ou se o conteúdo vai para outro stream, use `createReadStream` com `pipeline`. Se o tamanho depende do usuário (uploads, logs), assuma que pode ser grande.",
      },
      {
        tipo: "codigo",
        titulo: "Os dois lado a lado",
        legenda: "JavaScript",
        codigo: `import { createReadStream, createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

// readFile: o arquivo inteiro na memória, depois o parse
const texto = await readFile("config.json", "utf8");
const config = JSON.parse(texto);

// createReadStream: pedaço a pedaço, memória estável, com limpeza em caso de erro
await pipeline(
  createReadStream("log-gigante.txt"),
  createGzip(),
  createWriteStream("log-gigante.txt.gz"),
);`,
        nota: "Os dois trechos usam módulos ES com `await` no nível superior. Em CommonJS, coloque-os dentro de uma função `async`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Assíncrono não é streaming",
        texto:
          "`readFile` não bloqueia o laço de eventos (a leitura acontece fora da thread principal), mas o arquivo continua indo **inteiro** para a memória. Com vários pedidos simultâneos de arquivos grandes, a memória se multiplica, e existe um limite máximo de tamanho para um `Buffer`, acima do qual a leitura falha. `readFileSync` ainda bloqueia o laço enquanto lê.",
      },
    ],
    armadilhas: [
      "Usar `readFile` em arquivo de tamanho desconhecido (upload, log): sob concorrência, a memória estoura.",
      "Encadear streams com `.pipe()` sem tratar erro: ele não propaga falhas nem fecha os outros streams. Prefira `pipeline`.",
      "Concatenar pedaços de texto com `chunk.toString()` sem cuidado: um caractere UTF-8 de vários bytes pode ser partido entre dois pedaços. Use `setEncoding('utf8')` ou leia como `Buffer` até o fim.",
      "Achar que stream é sempre mais rápido: ele troca memória por mais etapas; para arquivo pequeno usado inteiro, `readFile` é mais simples e suficiente.",
    ],
    autoteste: [
      {
        pergunta: "Por que `readFile` pode derrubar um servidor que entrega arquivos grandes?",
        resposta:
          "Cada pedido carrega o arquivo inteiro na memória; com muitos pedidos simultâneos a soma passa do que o processo aguenta. Com stream, cada pedido segura só alguns pedaços.",
      },
      {
        pergunta: "O que `pipeline` oferece que `pipe` não oferece?",
        resposta:
          "Propaga o erro de qualquer etapa, destrói os streams envolvidos (fechando arquivos) e avisa o fim por callback ou `Promise`.",
      },
      {
        pergunta: "Como ler um arquivo grande linha a linha?",
        resposta:
          "Passe `createReadStream` ao módulo `node:readline` (`createInterface`) e percorra as linhas com `for await`.",
      },
    ],
  },
  en: {
    titulo: "createReadStream vs readFile",
    pergunta: "In Node.js, what is the difference between createReadStream and readFile?",
    porqueEsteMetodo:
      "It is an “X vs Y” question: the matrix puts memory, latency and control side by side, and the decision rule says which to use depending on the file’s size and destination.",
    resposta30s:
      "`readFile` loads the **whole file into memory** and only hands over the result at the end; `createReadStream` reads **in chunks**, so memory use stays nearly constant and you can start processing right away. Use `readFile` for small files you need in full (a JSON config) and a **stream** for large files, files of uncertain size, or when the destination is also a stream (HTTP response, compression).",
    blocos: [
      {
        tipo: "tabela",
        colunas: ["Aspect", "`readFile`", "`createReadStream`"],
        linhas: [
          [
            "How it reads",
            "The whole file at once; the result only arrives complete",
            "In bounded chunks (`highWaterMark`), as the consumer asks for more",
          ],
          ["Memory", "Proportional to the file size", "Nearly constant: one chunk and a few buffers"],
          ["When processing starts", "Only after everything is read", "As soon as the first chunk arrives"],
          [
            "What it returns",
            "A `Buffer` or a string (with `encoding`), via callback or `Promise`",
            "A `Readable`: `data` events, `pipe`/`pipeline` or `for await`",
          ],
          ["Flow control", "None", "Backpressure with `pipeline`; `start` and `end` read only a range of the file"],
          [
            "Errors",
            "A single one: the callback or the rejected `Promise`",
            "An `error` event; use `pipeline` to guarantee cleanup",
          ],
          ["Simplicity", "High: one line with `await`", "Lower: more moving parts (events, `pipeline`)"],
          [
            "Best for",
            "Small files used in full (JSON, template, key)",
            "Large or unknown-size files: copy, compression, upload, HTTP response, line-by-line reading",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask: do I need the **whole** file in memory to work with it, and does it fit comfortably? Then `readFile` (from `node:fs/promises`). Otherwise, or if the content goes to another stream, use `createReadStream` with `pipeline`. If the size depends on the user (uploads, logs), assume it can be large.",
      },
      {
        tipo: "codigo",
        titulo: "Both side by side",
        legenda: "JavaScript",
        codigo: `import { createReadStream, createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

// readFile: the whole file in memory, then parse it
const text = await readFile("config.json", "utf8");
const config = JSON.parse(text);

// createReadStream: chunk by chunk, steady memory, cleanup on error
await pipeline(
  createReadStream("huge-log.txt"),
  createGzip(),
  createWriteStream("huge-log.txt.gz"),
);`,
        nota: "Both snippets use ES modules with top-level `await`. In CommonJS, put them inside an `async` function.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Async is not streaming",
        texto:
          "`readFile` does not block the event loop (the read happens off the main thread), but the file still goes **whole** into memory. With many simultaneous requests for large files memory multiplies, and a `Buffer` has a maximum size, above which the read fails. `readFileSync` also blocks the loop while it reads.",
      },
    ],
    armadilhas: [
      "Using `readFile` on a file of unknown size (upload, log): under concurrency, memory blows up.",
      "Chaining streams with `.pipe()` without handling errors: it neither forwards failures nor closes the other streams. Prefer `pipeline`.",
      "Concatenating text chunks with `chunk.toString()` carelessly: a multi-byte UTF-8 character can be split across two chunks. Use `setEncoding('utf8')` or keep `Buffer`s until the end.",
      "Assuming a stream is always faster: it trades memory for more moving parts; for a small file used in full, `readFile` is simpler and enough.",
    ],
    autoteste: [
      {
        pergunta: "Why can `readFile` bring down a server that serves large files?",
        resposta:
          "Each request loads the whole file into memory; with many simultaneous requests the sum exceeds what the process can hold. With a stream, each request holds only a few chunks.",
      },
      {
        pergunta: "What does `pipeline` offer that `pipe` does not?",
        resposta:
          "It propagates an error from any stage, destroys the streams involved (closing files) and signals completion through a callback or a `Promise`.",
      },
      {
        pergunta: "How do you read a large file line by line?",
        resposta:
          "Hand `createReadStream` to the `node:readline` module (`createInterface`) and iterate over the lines with `for await`.",
      },
    ],
  },
};
