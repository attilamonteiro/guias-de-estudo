import type { Pergunta } from "../../tipos";

// L68 · Transmitir vídeo ou arquivo
export const l068: Pergunta = {
  numero: 168,
  modulo: "linkedin-streams",
  metodo: "playbook",
  pt: {
    titulo: "Transmitir vídeo ou arquivo",
    pergunta: "Como você transmitiria um vídeo ou arquivo grande para um cliente?",
    porqueEsteMetodo:
      "É uma pergunta de “como fazer”, com uma ordem natural de decisões e de sinais de que cada etapa deu certo: quem serve os bytes, cabeçalhos, faixas de bytes, stream e cliente que desiste.",
    resposta30s:
      "Não leia o arquivo para a memória: abra um **`createReadStream`** e ligue-o à resposta com **`pipeline`**, que aplica **backpressure** e fecha o arquivo se o cliente desistir (veja L62). Envie `Content-Type` e `Content-Length` e **suporte `Range`**, respondendo **`206 Partial Content`**, para que os players avancem no vídeo e os downloads retomem; use `ETag` e `Cache-Control` para evitar reenvios. Em escala, deixe o **armazenamento de objetos ou o CDN** servir os bytes e use o Node só para autorizar.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: do pedido ao último byte",
        passos: [
          {
            titulo: "Decida quem serve os bytes",
            texto:
              "Se o arquivo está num armazenamento de objetos, o caminho mais barato é autorizar no Node e redirecionar (`302`) para uma URL assinada ou um CDN. Sirva pelo Node só quando precisar de lógica própria. Para vídeo longo, considere streaming adaptativo (HLS ou DASH) gerado pelo seu fluxo de mídia. Critério: o Node não deveria carregar o tráfego de mídia em escala.",
          },
          {
            titulo: "Descubra tamanho e tipo",
            texto:
              "`stat` dá o tamanho para o `Content-Length`; o tipo vem do cadastro do arquivo ou da extensão que você controla, nunca do cliente. Sinal de acerto: o navegador reproduz ou baixa sem adivinhar.",
          },
          {
            titulo: "Responda ao cache",
            texto:
              "Envie `ETag` (ou `Last-Modified`) e `Cache-Control`. Se chegar `If-None-Match` igual ao `ETag`, responda `304` sem corpo. Sinal: recarregar a página não retransmite o arquivo.",
          },
          {
            titulo: "Suporte a `Range`",
            texto:
              "Anuncie `Accept-Ranges: bytes`. Leia `Range: bytes=inicio-fim` e responda `206 Partial Content` com `Content-Range: bytes inicio-fim/total` e o `Content-Length` do trecho. Faixa fora do arquivo: `416` com `Content-Range: bytes */total`. Sinal: o player avança no vídeo e o download retoma sem recomeçar.",
          },
          {
            titulo: "Transmita com `createReadStream` e `pipeline`",
            texto:
              "`createReadStream(caminho, { start, end })` ligado à resposta (o `end` é inclusivo). O backpressure é automático e a memória não depende do tamanho do arquivo nem do número de clientes lentos.",
          },
          {
            titulo: "Trate o cliente que desiste",
            texto:
              "Quando o cliente fecha a aba no meio, o `pipeline` destrói a leitura, libera o arquivo e chama o callback com `ERR_STREAM_PREMATURE_CLOSE`, que é rotina e não falha do servidor. Sinal: o número de descritores de arquivo abertos não cresce.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Servidor mínimo com suporte a Range",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          'import { createReadStream } from "node:fs";',
          'import { stat } from "node:fs/promises";',
          'import { pipeline } from "node:stream";',
          'const ARQUIVO = "video.mp4";',
          "createServer(async (req, res) => {",
          "  const info = await stat(ARQUIVO).catch(() => null);",
          "  if (!info) return res.writeHead(404).end();",
          "  const { size } = info;",
          '  const m = /^bytes=(\\d+)-(\\d*)$/.exec(req.headers.range ?? "");',
          "  const inicio = m ? Number(m[1]) : 0;",
          "  const fim = m?.[2] ? Math.min(Number(m[2]), size - 1) : size - 1;",
          '  if (inicio > fim) return res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();',
          "  res.writeHead(m ? 206 : 200, {",
          '    "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Length": fim - inicio + 1,',
          '    ...(m && { "Content-Range": `bytes ${inicio}-${fim}/${size}` }),',
          "  });",
          "  // se o cliente abortar, o pipeline fecha o arquivo e o callback recebe ERR_STREAM_PREMATURE_CLOSE",
          "  pipeline(createReadStream(ARQUIVO, { start: inicio, end: fim }), res, (erro) => erro && console.log(erro.code));",
          "}).listen(3000);",
        ].join("\n"),
        nota: "Versão simplificada, sem `ETag`, sem faixas com sufixo (`bytes=-500`) e sem várias faixas no mesmo pedido. Em produção, use o servidor de arquivos estáticos do seu framework ou um CDN, que já implementam o protocolo completo.",
      },
      {
        tipo: "tabela",
        titulo: "Respostas que o servidor deve saber dar",
        colunas: ["Situação", "Status", "Cabeçalhos principais"],
        linhas: [
          ["Arquivo inteiro", "`200 OK`", "`Content-Type`, `Content-Length`, `Accept-Ranges: bytes`"],
          [
            "Faixa pedida e válida",
            "`206 Partial Content`",
            "`Content-Range: bytes 0-999/5000` e o `Content-Length` da faixa",
          ],
          ["Faixa fora do arquivo", "`416 Range Not Satisfiable`", "`Content-Range: bytes */5000`"],
          ["O cliente já tem a versão atual", "`304 Not Modified`", "`ETag` e `Cache-Control`, sem corpo"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Precisa de lógica sua no caminho do arquivo (autorização fina, contagem, marca-d’água)? Sirva pelo Node, com **stream, `Range` e cabeçalhos de cache**. Só entrega o arquivo para quem tem permissão? Autorize no Node e **redirecione** para o armazenamento ou o CDN com uma URL assinada de curta duração. Nos dois casos, nunca `readFile` + `res.end(buffer)`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidados que o stream sozinho não resolve",
        texto:
          "Nunca monte o caminho com um nome vindo do cliente (`../../etc/passwd`): resolva um identificador para o caminho no servidor e confira que ele fica dentro da pasta permitida. Não comprima vídeo já comprimido: gasta CPU sem ganho. Defina limites de conexões e prazos para clientes lentos, que seguram o arquivo aberto por muito tempo.",
      },
    ],
    armadilhas: [
      "Usar `readFile` e `res.end(buffer)`: cada conexão carrega o arquivo inteiro na memória.",
      "Montar o caminho do arquivo com dado do cliente: abre a porta para path traversal; use um identificador resolvido no servidor.",
      "Ignorar `Range`: o player não consegue avançar, e um download interrompido recomeça do zero.",
      "Encadear `.pipe()` sem tratar a desistência do cliente: o arquivo pode ficar aberto; o `pipeline` fecha tudo.",
    ],
    autoteste: [
      {
        pergunta: "O que o servidor devolve para `Range: bytes=1000-1999`?",
        resposta:
          "`206 Partial Content`, com `Content-Range: bytes 1000-1999/total` e `Content-Length: 1000`, e no corpo só esses mil bytes.",
      },
      {
        pergunta: "O que acontece com o arquivo aberto se o cliente fecha a conexão no meio da transmissão?",
        resposta:
          "Com `pipeline`, a leitura é destruída e o arquivo é fechado; o callback recebe `ERR_STREAM_PREMATURE_CLOSE`, que é esperado. Só com `.pipe()`, o arquivo pode ficar aberto.",
      },
    ],
  },
  en: {
    titulo: "Streaming a video or file",
    pergunta: "How would you stream a large video or file to a client?",
    porqueEsteMetodo:
      "This is a “how do I do it” question with a natural order of decisions and signs that each stage worked: who serves the bytes, headers, byte ranges, the stream and the client that gives up.",
    resposta30s:
      "Do not read the file into memory: open a **`createReadStream`** and connect it to the response with **`pipeline`**, which applies **backpressure** and closes the file if the client gives up (see L62). Send `Content-Type` and `Content-Length` and **support `Range`**, answering **`206 Partial Content`**, so players can seek in the video and downloads can resume; use `ETag` and `Cache-Control` to avoid resending. At scale, let **object storage or a CDN** serve the bytes and use Node only to authorize.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: from request to last byte",
        passos: [
          {
            titulo: "Decide who serves the bytes",
            texto:
              "If the file is in object storage, the cheapest path is to authorize in Node and redirect (`302`) to a signed URL or a CDN. Serve through Node only when you need your own logic. For long video, consider adaptive streaming (HLS or DASH) produced by your media pipeline. Criterion: Node should not carry media traffic at scale.",
          },
          {
            titulo: "Find size and type",
            texto:
              "`stat` gives the size for `Content-Length`; the type comes from the file’s record or from an extension you control, never from the client. Sign of success: the browser plays or downloads without guessing.",
          },
          {
            titulo: "Answer to caching",
            texto:
              "Send `ETag` (or `Last-Modified`) and `Cache-Control`. If `If-None-Match` arrives equal to the `ETag`, answer `304` with no body. Sign: reloading the page does not retransmit the file.",
          },
          {
            titulo: "Support `Range`",
            texto:
              "Advertise `Accept-Ranges: bytes`. Read `Range: bytes=start-end` and answer `206 Partial Content` with `Content-Range: bytes start-end/total` and the slice’s own `Content-Length`. Range outside the file: `416` with `Content-Range: bytes */total`. Sign: the player seeks in the video and the download resumes without starting over.",
          },
          {
            titulo: "Stream with `createReadStream` and `pipeline`",
            texto:
              "`createReadStream(path, { start, end })` connected to the response (`end` is inclusive). Backpressure is automatic and memory depends neither on the file size nor on the number of slow clients.",
          },
          {
            titulo: "Handle the client that gives up",
            texto:
              "When the client closes the tab midway, `pipeline` destroys the read, releases the file and calls the callback with `ERR_STREAM_PREMATURE_CLOSE`, which is routine, not a server failure. Sign: the number of open file descriptors does not grow.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A minimal server with Range support",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:http";',
          'import { createReadStream } from "node:fs";',
          'import { stat } from "node:fs/promises";',
          'import { pipeline } from "node:stream";',
          'const FILE = "video.mp4";',
          "createServer(async (req, res) => {",
          "  const info = await stat(FILE).catch(() => null);",
          "  if (!info) return res.writeHead(404).end();",
          "  const { size } = info;",
          '  const m = /^bytes=(\\d+)-(\\d*)$/.exec(req.headers.range ?? "");',
          "  const start = m ? Number(m[1]) : 0;",
          "  const end = m?.[2] ? Math.min(Number(m[2]), size - 1) : size - 1;",
          '  if (start > end) return res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();',
          "  res.writeHead(m ? 206 : 200, {",
          '    "Content-Type": "video/mp4", "Accept-Ranges": "bytes", "Content-Length": end - start + 1,',
          '    ...(m && { "Content-Range": `bytes ${start}-${end}/${size}` }),',
          "  });",
          "  // if the client aborts, pipeline closes the file and the callback gets ERR_STREAM_PREMATURE_CLOSE",
          "  pipeline(createReadStream(FILE, { start, end }), res, (error) => error && console.log(error.code));",
          "}).listen(3000);",
        ].join("\n"),
        nota: "A simplified version, with no `ETag`, no suffix ranges (`bytes=-500`) and no multiple ranges in one request. In production, use your framework’s static file server or a CDN, which already implement the full protocol.",
      },
      {
        tipo: "tabela",
        titulo: "Responses the server must know how to give",
        colunas: ["Situation", "Status", "Main headers"],
        linhas: [
          ["Whole file", "`200 OK`", "`Content-Type`, `Content-Length`, `Accept-Ranges: bytes`"],
          [
            "Valid requested range",
            "`206 Partial Content`",
            "`Content-Range: bytes 0-999/5000` and the slice’s `Content-Length`",
          ],
          ["Range outside the file", "`416 Range Not Satisfiable`", "`Content-Range: bytes */5000`"],
          ["The client already has the current version", "`304 Not Modified`", "`ETag` and `Cache-Control`, no body"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Do you need your own logic on the file path (fine-grained authorization, counting, watermarking)? Serve through Node, with **a stream, `Range` and cache headers**. Do you only hand the file to people who have permission? Authorize in Node and **redirect** to storage or the CDN with a short-lived signed URL. In both cases, never `readFile` + `res.end(buffer)`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cautions a stream alone does not solve",
        texto:
          "Never build the path from a name that comes from the client (`../../etc/passwd`): resolve an identifier to a path on the server and check that it stays inside the allowed folder. Do not compress video that is already compressed: it burns CPU for no gain. Set connection limits and timeouts for slow clients, which keep the file open for a long time.",
      },
    ],
    armadilhas: [
      "Using `readFile` and `res.end(buffer)`: every connection loads the whole file into memory.",
      "Building the file path from client data: it opens the door to path traversal; use an identifier resolved on the server.",
      "Ignoring `Range`: the player cannot seek, and an interrupted download starts from zero.",
      "Chaining `.pipe()` without handling the client giving up: the file can stay open; `pipeline` closes everything.",
    ],
    autoteste: [
      {
        pergunta: "What does the server return for `Range: bytes=1000-1999`?",
        resposta:
          "`206 Partial Content`, with `Content-Range: bytes 1000-1999/total` and `Content-Length: 1000`, and only those thousand bytes in the body.",
      },
      {
        pergunta: "What happens to the open file if the client closes the connection midway through the transfer?",
        resposta:
          "With `pipeline`, the read is destroyed and the file is closed; the callback receives `ERR_STREAM_PREMATURE_CLOSE`, which is expected. With `.pipe()` alone, the file may stay open.",
      },
    ],
  },
};
