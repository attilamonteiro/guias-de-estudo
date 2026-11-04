import type { Pergunta } from "../../tipos";

// L51 · Upload de arquivos
export const l051: Pergunta = {
  numero: 151,
  modulo: "linkedin-express",
  metodo: "playbook",
  pt: {
    titulo: "Upload de arquivos",
    pergunta: "Como você lida com uploads de arquivos?",
    porqueEsteMetodo:
      "Receber arquivo de usuário é um procedimento com ordem e um risco de segurança em cada etapa. O playbook lista as etapas na sequência em que se aplicam, cada uma com o sinal de que foi bem feita; é também a resposta para tratar uploads com segurança.",
    resposta30s:
      "Receba o `multipart/form-data` com um parser de **streaming** (`multer`, `busboy` ou `formidable`), com **limites** de tamanho e de quantidade, e não confie em nada que o cliente declara: confira o **tipo pelo conteúdo**, gere um **nome novo** e guarde fora da raiz web ou em object storage. Para arquivos grandes, prefira **URL assinada** (o cliente envia direto ao storage) e faça antivírus e processamento depois, de forma assíncrona.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook de upload",
        passos: [
          {
            titulo: "Receba em streaming",
            texto:
              "O corpo é `multipart/form-data`, que `express.json()` não lê. Use um parser que processa o arquivo aos poucos: `multer` (middleware do Express, construído sobre o `busboy`), o próprio `busboy` ou o `formidable`. Evite guardar o arquivo inteiro em memória: `memoryStorage` só para arquivos pequenos e limitados.",
          },
          {
            titulo: "Autentique e limite antes",
            texto:
              "Ponha a autenticação **antes** do parser, para não gastar banda e disco com anônimos. Defina o tamanho máximo do arquivo, o número de arquivos e de campos (`limits` do `multer`) e repita o limite no proxy ou balanceador. Sinal: arquivo acima do limite é cortado e vira um erro tratado (`413`).",
          },
          {
            titulo: "Valide pelo conteúdo",
            texto:
              "Extensão e `Content-Type` vêm do cliente e podem mentir. Use uma **allowlist** de tipos e confira os primeiros bytes do arquivo (a assinatura, ou magic number) com uma biblioteca de detecção. Para imagens, decodifique e regrave: isso descarta metadados e conteúdo escondido.",
          },
          {
            titulo: "Gere o nome do arquivo",
            texto:
              "Nunca monte o caminho com o nome original: `../../x` sai da pasta (path traversal) e nomes iguais se sobrescrevem. Gere um identificador (`randomUUID`), derive a extensão do tipo detectado e guarde o nome original só como metadado.",
          },
          {
            titulo: "Guarde onde nada executa",
            texto:
              "Fora da raiz web, ou em object storage (S3 e compatíveis), sem permissão de execução. Sirva por rota autenticada ou por **URL assinada**, com `Content-Disposition: attachment` e `X-Content-Type-Options: nosniff`, para que um HTML ou SVG enviado não rode no seu domínio.",
          },
          {
            titulo: "Envie ao storage sem acumular",
            texto:
              "Encadeie o arquivo recebido ao destino com `pipeline` (veja L62), sem montar tudo na memória. Para arquivos grandes, a API só emite a **URL assinada** e o cliente envia direto ao storage (veja L67).",
          },
          {
            titulo: "Escaneie e processe depois",
            texto:
              "Marque o arquivo como pendente, passe por antivírus (por exemplo, ClamAV) e por conversões (miniaturas, transcodificação) numa fila, e só então libere o acesso. Defina cota por usuário e limpeza de uploads órfãos.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Upload com limites, nome gerado e triagem",
        legenda: "JavaScript (Express + multer)",
        codigo:
          'import multer from "multer";\nimport { randomUUID } from "node:crypto";\n\nconst upload = multer({\n  storage: multer.diskStorage({\n    destination: "/var/tmp/uploads", // fora da pasta pública\n    filename: (req, file, cb) => cb(null, randomUUID()), // nunca o nome original\n  }),\n  limits: { fileSize: 5 * 1024 * 1024, files: 1 },\n  fileFilter: (req, file, cb) => cb(null, ["image/png", "image/jpeg"].includes(file.mimetype)), // só triagem\n});\n\n// autenticar vem antes do parser\napp.post("/avatar", autenticar, upload.single("arquivo"), async (req, res) => {\n  // aqui: conferir os primeiros bytes de req.file.path, mover ao storage, enfileirar o antivírus\n  res.status(202).json({ id: req.file.filename });\n});',
        nota: "O `mimetype` vem do cliente: serve como triagem barata, nunca como prova. O erro de limite do `multer` chega ao middleware de erro (veja L41) e deve virar `413`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O arquivo é entrada hostil",
        texto:
          "Trate todo upload como código não confiável: um HTML ou SVG pode conter script, um arquivo compactado pode se expandir até esgotar o disco, e uma imagem pequena em bytes pode ter dimensões enormes em pixels e esgotar a memória ao ser decodificada. Limite também o resultado da descompressão e as dimensões das imagens.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Quando passar pela API e quando não",
        texto:
          "Arquivos pequenos e privados (um avatar, um anexo de poucos MB) podem passar pela API. Para arquivos grandes ou muito tráfego, deixe o cliente enviar direto ao storage por URL assinada: a API só confere a permissão, registra os metadados e recebe o aviso de que o envio terminou.",
      },
    ],
    armadilhas: [
      "Confiar na extensão, no `Content-Type` ou em `file.mimetype`: tudo isso é o cliente quem escolhe.",
      "Usar o nome enviado para montar o caminho no disco: path traversal e sobrescrita de arquivos de outros usuários.",
      "Servir o upload no mesmo domínio e com o tipo original: um HTML ou SVG malicioso vira XSS armazenado.",
      "Usar `memoryStorage` sem `limits`: poucos envios grandes ao mesmo tempo esgotam a memória do processo.",
    ],
    autoteste: [
      {
        pergunta: "Por que conferir o tipo do arquivo pelo conteúdo e não pela extensão?",
        resposta:
          "Porque a extensão e o `Content-Type` são informados pelo cliente, que pode mentir. Os primeiros bytes (a assinatura do formato) são muito mais difíceis de falsificar sem quebrar o arquivo; e mesmo assim vale reprocessar imagens e escanear o arquivo.",
      },
      {
        pergunta: "Quando vale usar URL assinada em vez de receber o arquivo na API?",
        resposta:
          "Quando os arquivos são grandes ou numerosos: o cliente envia direto ao object storage, a API não carrega o tráfego nem a memória, e só controla a permissão e registra os metadados.",
      },
    ],
  },
  en: {
    titulo: "File uploads",
    pergunta: "How do you handle file uploads?",
    porqueEsteMetodo:
      "Receiving user files is a procedure with an order and a security risk at each step. The playbook lists the steps in the sequence you apply them, each with a sign that it was done right; it is also the answer for handling uploads safely.",
    resposta30s:
      "Receive `multipart/form-data` with a **streaming** parser (`multer`, `busboy` or `formidable`), with **limits** on size and count, and trust nothing the client declares: check the **type from the content**, generate a **new name** and store the file outside the web root or in object storage. For large files, prefer a **signed URL** (the client uploads straight to storage) and run antivirus and processing afterwards, asynchronously.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Upload playbook",
        passos: [
          {
            titulo: "Receive as a stream",
            texto:
              "The body is `multipart/form-data`, which `express.json()` does not read. Use a parser that handles the file piece by piece: `multer` (Express middleware built on `busboy`), `busboy` itself or `formidable`. Avoid holding the whole file in memory: `memoryStorage` only for small, limited files.",
          },
          {
            titulo: "Authenticate and limit first",
            texto:
              "Put authentication **before** the parser, so you do not spend bandwidth and disk on anonymous callers. Set the maximum file size, file count and field count (`multer`’s `limits`) and repeat the limit on the proxy or load balancer. Signal: a file over the limit is cut off and becomes a handled error (`413`).",
          },
          {
            titulo: "Validate by content",
            texto:
              "Extension and `Content-Type` come from the client and can lie. Use an **allowlist** of types and check the file’s first bytes (the signature, or magic number) with a detection library. For images, decode and re-encode: that drops metadata and hidden content.",
          },
          {
            titulo: "Generate the file name",
            texto:
              "Never build the path from the original name: `../../x` escapes the folder (path traversal) and equal names overwrite each other. Generate an identifier (`randomUUID`), derive the extension from the detected type and keep the original name only as metadata.",
          },
          {
            titulo: "Store where nothing executes",
            texto:
              "Outside the web root, or in object storage (S3 and compatibles), without execute permission. Serve through an authenticated route or a **signed URL**, with `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`, so an uploaded HTML or SVG cannot run on your domain.",
          },
          {
            titulo: "Send to storage without piling up",
            texto:
              "Chain the received file to the destination with `pipeline` (see L62), without assembling it in memory. For large files, the API only issues the **signed URL** and the client uploads straight to storage (see L67).",
          },
          {
            titulo: "Scan and process later",
            texto:
              "Mark the file as pending, run it through antivirus (for example, ClamAV) and conversions (thumbnails, transcoding) in a queue, and only then release access. Set a per-user quota and clean up orphaned uploads.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Upload with limits, generated name and screening",
        legenda: "JavaScript (Express + multer)",
        codigo:
          'import multer from "multer";\nimport { randomUUID } from "node:crypto";\n\nconst upload = multer({\n  storage: multer.diskStorage({\n    destination: "/var/tmp/uploads", // outside the public folder\n    filename: (req, file, cb) => cb(null, randomUUID()), // never the original name\n  }),\n  limits: { fileSize: 5 * 1024 * 1024, files: 1 },\n  fileFilter: (req, file, cb) => cb(null, ["image/png", "image/jpeg"].includes(file.mimetype)), // screening only\n});\n\n// authentication comes before the parser\napp.post("/avatar", authenticate, upload.single("file"), async (req, res) => {\n  // here: check the first bytes of req.file.path, move to storage, queue the antivirus scan\n  res.status(202).json({ id: req.file.filename });\n});',
        nota: "The `mimetype` comes from the client: it is cheap screening, never proof. The `multer` limit error reaches the error middleware (see L41) and should become `413`.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The file is hostile input",
        texto:
          "Treat every upload as untrusted code: an HTML or SVG file can contain script, a compressed file can expand until it fills the disk, and an image that is small in bytes can be enormous in pixels and exhaust memory when decoded. Also limit the result of decompression and the image dimensions.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "When to go through the API and when not to",
        texto:
          "Small, private files (an avatar, an attachment of a few MB) can go through the API. For large files or heavy traffic, let the client upload straight to storage with a signed URL: the API only checks permission, records the metadata and gets notified when the upload is done.",
      },
    ],
    armadilhas: [
      "Trusting the extension, the `Content-Type` or `file.mimetype`: the client chooses all of them.",
      "Using the submitted name to build the disk path: path traversal and overwriting other users’ files.",
      "Serving the upload from the same domain with its original type: a malicious HTML or SVG becomes stored XSS.",
      "Using `memoryStorage` without `limits`: a few large uploads at the same time exhaust the process memory.",
    ],
    autoteste: [
      {
        pergunta: "Why check the file type from its content and not from its extension?",
        resposta:
          "Because the extension and the `Content-Type` are supplied by the client, which can lie. The first bytes (the format signature) are much harder to fake without breaking the file; even so, re-encode images and scan the file.",
      },
      {
        pergunta: "When is a signed URL better than receiving the file in the API?",
        resposta:
          "When files are large or numerous: the client uploads straight to object storage, the API carries neither the traffic nor the memory, and it only controls permission and records the metadata.",
      },
    ],
  },
};
