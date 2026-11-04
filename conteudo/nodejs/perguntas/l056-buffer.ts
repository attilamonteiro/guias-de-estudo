import type { Pergunta } from "../../tipos";

// L56 · Buffer no Node.js
export const l056: Pergunta = {
  numero: 156,
  modulo: "linkedin-streams",
  metodo: "feynman",
  pt: {
    titulo: "Buffer no Node.js",
    pergunta: "O que é um Buffer no Node.js?",
    porqueEsteMetodo:
      "Buffer é um conceito de baixo nível que se entende melhor por intuição: uma estante de gavetas de tamanho fixo. Depois vêm o mecanismo real (bytes, codificações) e o ponto em que a imagem para de valer.",
    resposta30s:
      "Um **Buffer** é um bloco de **bytes brutos de tamanho fixo**, subclasse de `Uint8Array`, usado sempre que o Node.js lida com dados binários: arquivos lidos sem codificação, sockets, pedaços de HTTP e de streams, `crypto`, `zlib`. Texto e bytes se convertem por uma **codificação** (`utf8`, `hex`, `base64`…), e bytes não são caracteres. Prefira `Buffer.alloc` (zerado) a `Buffer.allocUnsafe`, que pode expor restos de memória.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense numa estante de gavetas numeradas, todas do mesmo tamanho, cada uma guardando um único número de 0 a 255. A quantidade de gavetas é definida quando a estante é montada e não muda. A estante não sabe se o que está nela são letras, uma foto ou um pacote de rede: quem decide o significado é quem lê, seguindo uma convenção (a codificação).",
        tecnico:
          "Um `Buffer` é uma sequência de **bytes brutos de tamanho fixo**. É uma subclasse de `Uint8Array`, então aceita os métodos de arrays tipados, e o conteúdo fica em memória fora do heap comum de objetos do JavaScript. Aparece sempre que há dado binário: `fs.readFile` sem codificação, sockets, pedaços de requisições HTTP e de streams (veja T37), `crypto`, `zlib`. Cria-se com `Buffer.from(...)`, `Buffer.alloc(n)` ou `Buffer.allocUnsafe(n)` e converte-se de e para texto por uma codificação (`utf8`, `hex`, `base64`, `latin1`…). Em código que também roda no navegador, `Uint8Array` com `TextEncoder`/`TextDecoder` é a alternativa portátil.",
        limite:
          "A estante só guarda bytes: **bytes não são caracteres**. Em UTF-8, o “á” ocupa 2 bytes, então o `length` de um Buffer conta bytes, não letras. E, diferente de fotocopiar a estante, `buf.subarray()` não copia: devolve outra visão sobre as mesmas gavetas, e mudar uma visão altera a outra.",
      },
      {
        tipo: "tabela",
        titulo: "Formas de criar um Buffer",
        colunas: ["Criação", "O que faz", "Conteúdo inicial", "Quando usar"],
        linhas: [
          [
            "`Buffer.from(x)`",
            "Cria a partir de uma string (com codificação), array de bytes, outro Buffer ou `ArrayBuffer`",
            "O dado informado: copiado, exceto a partir de um `ArrayBuffer`, que compartilha a memória",
            "Converter texto ou dados existentes em bytes",
          ],
          [
            "`Buffer.alloc(n)`",
            "Reserva `n` bytes",
            "Zerado",
            "Padrão seguro para montar um buffer e preencher depois",
          ],
          [
            "`Buffer.allocUnsafe(n)`",
            "Reserva `n` bytes sem limpar",
            "Pode conter restos de memória anterior",
            "Só se você sobrescrever tudo logo em seguida e precisar do ganho de desempenho",
          ],
          [
            "`new Buffer(x)`",
            "Construtor antigo",
            "Varia conforme o argumento",
            "Não use: está depreciado por ser confuso e inseguro",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Texto, bytes e codificações",
        legenda: "JavaScript",
        codigo:
          'const a = Buffer.from("olá", "utf8");\nconsole.log(a);                    // <Buffer 6f 6c c3 a1>\nconsole.log(a.length);             // 4 bytes: o "á" ocupa 2\nconsole.log(a.toString("hex"));    // "6f6cc3a1"\nconsole.log(a.toString("base64")); // "b2zDoQ=="\n\nconst b = Buffer.alloc(4);         // 00 00 00 00\nb.writeUInt16BE(513, 0);           // 02 01 00 00\nconsole.log(b[0], b[1]);           // 2 1',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Bytes não são caracteres",
        texto:
          'Junte os pedaços recebidos de um stream com `Buffer.concat(pedacos)` e converta para string só no fim: converter pedaço a pedaço (ou somar com `+`) pode partir um caractere multibyte ao meio. Em streams de texto, `setEncoding("utf8")` cuida disso. Para volumes grandes, processe em streams em vez de montar buffers enormes na memória.',
      },
    ],
    armadilhas: [
      "Tratar `buf.length` como número de caracteres: é número de bytes, e acentos e emojis ocupam mais de um.",
      "Somar pedaços com `+` ou converter cada um separadamente: pode corromper caracteres multibyte; use `Buffer.concat` e converta no fim.",
      "Usar `allocUnsafe` e enviar o buffer sem preencher tudo: o conteúdo pode incluir restos de memória, até dados de outras requisições.",
      "Achar que `subarray` copia: as duas visões compartilham memória; para copiar, use `Buffer.from(buf)`.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre `Buffer.alloc` e `Buffer.allocUnsafe`?",
        resposta:
          "`alloc` devolve a memória zerada; `allocUnsafe` não a limpa e pode conter restos de dados anteriores, o que só é aceitável se você sobrescrever tudo antes de usar. Na dúvida, use `alloc`.",
      },
      {
        pergunta: 'Por que `Buffer.from("é").length` é 2 se `"é".length` é 1?',
        resposta:
          "O Buffer conta bytes, e o UTF-8 usa 2 bytes para o “é”; a string conta unidades de texto. Para saber o tamanho em bytes de um texto, use `Buffer.byteLength(texto)`.",
      },
    ],
  },
  en: {
    titulo: "Buffer in Node.js",
    pergunta: "What is a Buffer in Node.js?",
    porqueEsteMetodo:
      "Buffer is a low-level concept that is easier to grasp by intuition: a shelf of fixed-size drawers. Then comes the real mechanism (bytes, encodings) and the point where the picture stops holding.",
    resposta30s:
      "A **Buffer** is a block of **raw, fixed-size bytes**, a subclass of `Uint8Array`, used whenever Node.js handles binary data: files read without an encoding, sockets, HTTP and stream chunks, `crypto`, `zlib`. Text and bytes convert through an **encoding** (`utf8`, `hex`, `base64`…), and bytes are not characters. Prefer `Buffer.alloc` (zeroed) over `Buffer.allocUnsafe`, which may expose leftover memory.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a shelf of numbered drawers, all the same size, each holding a single number from 0 to 255. The number of drawers is fixed when the shelf is built and never changes. The shelf does not know whether what it holds is letters, a photo or a network packet: whoever reads it decides the meaning, following a convention (the encoding).",
        tecnico:
          "A `Buffer` is a sequence of **raw, fixed-size bytes**. It is a subclass of `Uint8Array`, so it accepts the typed-array methods, and its content lives in memory outside the ordinary JavaScript object heap. It shows up wherever there is binary data: `fs.readFile` without an encoding, sockets, HTTP request and stream chunks (see T37), `crypto`, `zlib`. You create one with `Buffer.from(...)`, `Buffer.alloc(n)` or `Buffer.allocUnsafe(n)` and convert to and from text through an encoding (`utf8`, `hex`, `base64`, `latin1`…). In code that also runs in the browser, `Uint8Array` with `TextEncoder`/`TextDecoder` is the portable alternative.",
        limite:
          "The shelf holds only bytes: **bytes are not characters**. In UTF-8, “á” takes 2 bytes, so a Buffer’s `length` counts bytes, not letters. And unlike photocopying the shelf, `buf.subarray()` does not copy: it returns another view over the same drawers, and changing one view changes the other.",
      },
      {
        tipo: "tabela",
        titulo: "Ways to create a Buffer",
        colunas: ["Creation", "What it does", "Initial content", "When to use"],
        linhas: [
          [
            "`Buffer.from(x)`",
            "Creates from a string (with an encoding), byte array, another Buffer or an `ArrayBuffer`",
            "The given data: copied, except from an `ArrayBuffer`, which shares its memory",
            "Turning text or existing data into bytes",
          ],
          [
            "`Buffer.alloc(n)`",
            "Reserves `n` bytes",
            "Zeroed",
            "The safe default for building a buffer and filling it later",
          ],
          [
            "`Buffer.allocUnsafe(n)`",
            "Reserves `n` bytes without clearing them",
            "May contain leftovers from earlier memory",
            "Only if you overwrite everything right away and need the performance gain",
          ],
          [
            "`new Buffer(x)`",
            "The old constructor",
            "Varies with the argument",
            "Do not use: it is deprecated for being confusing and unsafe",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Text, bytes and encodings",
        legenda: "JavaScript",
        codigo:
          'const a = Buffer.from("olá", "utf8");\nconsole.log(a);                    // <Buffer 6f 6c c3 a1>\nconsole.log(a.length);             // 4 bytes: the "á" takes 2\nconsole.log(a.toString("hex"));    // "6f6cc3a1"\nconsole.log(a.toString("base64")); // "b2zDoQ=="\n\nconst b = Buffer.alloc(4);         // 00 00 00 00\nb.writeUInt16BE(513, 0);           // 02 01 00 00\nconsole.log(b[0], b[1]);           // 2 1',
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Bytes are not characters",
        texto:
          'Join the chunks received from a stream with `Buffer.concat(chunks)` and convert to a string only at the end: converting chunk by chunk (or adding with `+`) can split a multibyte character in half. On text streams, `setEncoding("utf8")` takes care of that. For large volumes, process with streams instead of assembling huge buffers in memory.',
      },
    ],
    armadilhas: [
      "Treating `buf.length` as a character count: it is a byte count, and accents and emojis take more than one.",
      "Adding chunks with `+` or converting each one separately: it can corrupt multibyte characters; use `Buffer.concat` and convert at the end.",
      "Using `allocUnsafe` and sending the buffer without filling it entirely: the content may include leftover memory, even data from other requests.",
      "Assuming `subarray` copies: both views share memory; to copy, use `Buffer.from(buf)`.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between `Buffer.alloc` and `Buffer.allocUnsafe`?",
        resposta:
          "`alloc` returns zeroed memory; `allocUnsafe` does not clear it and may hold leftovers of earlier data, which is only acceptable if you overwrite everything before using it. When in doubt, use `alloc`.",
      },
      {
        pergunta: 'Why is `Buffer.from("é").length` 2 while `"é".length` is 1?',
        resposta:
          "The Buffer counts bytes, and UTF-8 uses 2 bytes for “é”; the string counts text units. To get the byte size of a text, use `Buffer.byteLength(text)`.",
      },
    ],
  },
};
