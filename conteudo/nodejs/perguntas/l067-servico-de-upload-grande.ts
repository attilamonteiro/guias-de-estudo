import type { Pergunta } from "../../tipos";

// L67 · Serviço de upload grande
export const l067: Pergunta = {
  numero: 167,
  modulo: "linkedin-streams",
  metodo: "design",
  pt: {
    titulo: "Serviço de upload grande",
    pergunta: "Como você construiria um serviço de upload de arquivos grandes?",
    porqueEsteMetodo:
      "É uma pergunta de projeto de sistema, e um roteiro fixo evita tanto o esquecimento quanto o mergulho em detalhes: requisitos, números, decisão central, contrato da API, dados e operação, nessa ordem.",
    resposta30s:
      "Com arquivos grandes, a sua API **não deve receber os bytes**: ela autentica, valida limites e cota, registra o upload e entrega **URLs assinadas** para o cliente enviar o arquivo **em partes (multipart ou retomável)** direto ao **armazenamento de objetos**. No fim, a API confirma o recebimento e dispara um **processamento assíncrono** (antivírus, validação do conteúdo, conversões) antes de liberar o arquivo. Retomada, idempotência, quotas e limpeza de envios abandonados completam o desenho.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: enviar arquivos de centenas de megabytes a vários gigabytes, retomar depois de uma queda, mostrar progresso, limitar tipo e tamanho, controlar quem envia e quem baixa. Não funcionais: muitos envios simultâneos sem sobrecarregar a API, durabilidade do arquivo, segurança (antivírus) e custo de banda.",
          },
          {
            titulo: "2. Estimativas",
            texto:
              "Multiplique envios simultâneos pelo tamanho médio e pela banda de cada cliente. Exemplo hipotético: 500 envios de 2 GB ao mesmo tempo são cerca de 1 TB em trânsito, e se isso atravessa a sua API ela vira o gargalo. A conta mostra que o arquivo não pode passar pelo seu servidor.",
          },
          {
            titulo: "3. Decisão central: por onde passam os bytes",
            texto:
              "Direto do cliente para o armazenamento de objetos, com URLs assinadas e envio em partes. A sua API só autoriza, registra e conclui (veja a tabela).",
          },
          {
            titulo: "4. Contrato da API",
            texto:
              "`POST /uploads` (nome, tamanho, tipo, checksum) valida cota e limites e devolve o `uploadId` e as URLs assinadas das partes. O cliente envia as partes ao armazenamento. `POST /uploads/{id}/concluir` recebe a lista de partes. `GET /uploads/{id}` informa o estado: `pendente`, `processando`, `disponível` ou `rejeitado`.",
          },
          {
            titulo: "5. Dados",
            texto:
              "Uma tabela `uploads` com id, dono, chave do objeto (gerada pelo servidor), tamanho esperado, estado, partes, checksum, datas e expiração. O arquivo vive no armazenamento; o banco guarda só metadados.",
          },
          {
            titulo: "6. Processamento e operação",
            texto:
              "Um worker lê de uma fila: antivírus, tipo conferido pelo conteúdo, conversões. Só então o estado vira `disponível` (veja L107). Concluir duas vezes devolve o mesmo resultado (veja L104). Fecham o desenho: quotas por usuário, expiração de envios abandonados, métricas e alertas.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Por onde o arquivo passa",
        colunas: ["Opção", "Como funciona", "Vantagens", "Limites"],
        linhas: [
          [
            "Pela API, em memória (por exemplo, `multer` com armazenamento em memória)",
            "A API recebe o arquivo inteiro num `Buffer` e depois o repassa",
            "Simples",
            "Memória por envio: poucos envios simultâneos derrubam o processo. Evite para arquivos grandes",
          ],
          [
            "Pela API, em streaming",
            "Um leitor de multipart (como `busboy`) e `pipeline` levam o arquivo ao armazenamento sem guardá-lo inteiro",
            "Memória estável e controle total do fluxo",
            "A API carrega banda e conexões; sem retomada, a menos que você a construa",
          ],
          [
            "Direto, com URL assinada simples",
            "A API assina uma URL e o cliente faz um único `PUT` ao armazenamento",
            "API leve e pouco código",
            "Uma requisição só: se cair, recomeça do zero, e o provedor limita o tamanho de um envio único",
          ],
          [
            "Direto, em partes e retomável",
            "Multipart do armazenamento (ou um protocolo aberto como o tus), com uma URL assinada por parte",
            "Partes em paralelo, retomada, progresso e arquivos muito grandes",
            "Mais complexidade: estado, conclusão e limpeza de partes abandonadas",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O caminho feliz, com retomada",
        etapas: [
          "O cliente chama `POST /uploads` com nome, tamanho e tipo; a API autentica, confere cota e limites e grava o registro como `pendente`",
          "A API inicia o envio em partes no armazenamento e devolve o `uploadId` e URLs assinadas de curta validade",
          "O cliente envia as partes em paralelo, direto ao armazenamento; cada parte tem retentativa própria e devolve um recibo (por exemplo, o ETag)",
          "Se a conexão cai, o cliente pergunta quais partes já chegaram e reenvia só as que faltam",
          "O cliente chama `POST /uploads/{id}/concluir` com a lista de partes; a API manda montar o objeto, confere tamanho e checksum e muda o estado para `processando`",
          "Um worker examina o arquivo, que ficou em quarentena, e marca `disponível` ou `rejeitado`; o cliente acompanha por polling, WebSocket ou webhook",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Arquivo pequeno e envio raro: a API pode receber o arquivo, desde que em streaming (veja L51). Arquivo grande ou muitos usuários: **o arquivo não passa pela sua API**. URL assinada, partes direto ao armazenamento, e a API só cuida do contrato: autorizar, registrar, concluir e processar. A mesma ideia vale para o download, que também deve sair do armazenamento ou de um CDN (veja L68).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não confie no cliente",
        texto:
          "Nome, extensão e `Content-Type` vêm do cliente. Gere a chave do objeto no servidor, fixe tamanho e tipo máximos na própria assinatura, confira o tipo pelo conteúdo e só libere o arquivo depois da verificação. URLs assinadas devem expirar rápido e valer para uma chave e uma operação.",
      },
    ],
    armadilhas: [
      "Receber o arquivo inteiro na API, num buffer em memória: poucos envios simultâneos derrubam o processo.",
      "Confiar no nome, na extensão ou no `Content-Type` enviados pelo cliente: gere a chave no servidor e confira o tipo pelo conteúdo.",
      "Liberar o arquivo antes do antivírus e da validação: use quarentena e um estado `processando`.",
      "Esquecer dos envios abandonados: partes incompletas continuam ocupando (e cobrando) espaço; configure expiração e aborto automáticos.",
    ],
    autoteste: [
      {
        pergunta: "Por que usar URL assinada em vez de receber o arquivo na API?",
        resposta:
          "Porque a banda, as conexões longas e a memória ficam com o armazenamento de objetos, feito para isso. A API só autoriza e registra, e continua leve mesmo com muitos envios simultâneos.",
      },
      {
        pergunta: "Como um upload interrompido é retomado?",
        resposta:
          "O `uploadId` identifica o envio em partes. O cliente (ou a API) consulta quais partes o armazenamento já recebeu e reenvia só as que faltam; reenviar uma parte já enviada é seguro. No fim, a conclusão com a lista de partes monta o arquivo.",
      },
    ],
  },
  en: {
    titulo: "Large upload service",
    pergunta: "How would you build a large file upload service?",
    porqueEsteMetodo:
      "This is a system-design question, and a fixed script avoids both forgetting things and drowning in detail: requirements, numbers, the central decision, the API contract, data and operations, in that order.",
    resposta30s:
      "With large files, your API **should not receive the bytes**: it authenticates, validates limits and quota, records the upload and hands out **signed URLs** so the client sends the file **in parts (multipart or resumable)** straight to **object storage**. At the end, the API confirms receipt and triggers **asynchronous processing** (antivirus, content validation, conversions) before releasing the file. Resumption, idempotency, quotas and cleanup of abandoned uploads complete the design.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: upload files from hundreds of megabytes to several gigabytes, resume after a drop, show progress, limit type and size, control who uploads and who downloads. Non-functional: many simultaneous uploads without overloading the API, file durability, security (antivirus) and bandwidth cost.",
          },
          {
            titulo: "2. Estimates",
            texto:
              "Multiply simultaneous uploads by the average size and by each client’s bandwidth. Hypothetical example: 500 uploads of 2 GB at the same time are about 1 TB in transit, and if that goes through your API, it becomes the bottleneck. The math shows the file cannot pass through your server.",
          },
          {
            titulo: "3. Central decision: where the bytes go",
            texto:
              "Straight from the client to object storage, with signed URLs and part-by-part upload. Your API only authorizes, records and completes (see the table).",
          },
          {
            titulo: "4. API contract",
            texto:
              "`POST /uploads` (name, size, type, checksum) validates quota and limits and returns the `uploadId` and the signed URLs for the parts. The client sends the parts to storage. `POST /uploads/{id}/complete` receives the list of parts. `GET /uploads/{id}` reports the state: `pending`, `processing`, `available` or `rejected`.",
          },
          {
            titulo: "5. Data",
            texto:
              "An `uploads` table with id, owner, object key (generated by the server), expected size, state, parts, checksum, dates and expiry. The file lives in storage; the database keeps only metadata.",
          },
          {
            titulo: "6. Processing and operations",
            texto:
              "A worker reads from a queue: antivirus, type checked by content, conversions. Only then does the state become `available` (see L107). Completing twice returns the same result (see L104). Per-user quotas, expiry of abandoned uploads, metrics and alerts round out the design.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where the file goes through",
        colunas: ["Option", "How it works", "Advantages", "Limits"],
        linhas: [
          [
            "Through the API, in memory (for example, `multer` with memory storage)",
            "The API receives the whole file in a `Buffer` and then forwards it",
            "Simple",
            "Memory per upload: a few simultaneous uploads take the process down. Avoid for large files",
          ],
          [
            "Through the API, streaming",
            "A multipart parser (such as `busboy`) and `pipeline` carry the file to storage without holding it whole",
            "Steady memory and full control of the flow",
            "The API carries bandwidth and connections; no resumption unless you build it",
          ],
          [
            "Direct, with a simple signed URL",
            "The API signs a URL and the client makes a single `PUT` to storage",
            "Light API and little code",
            "A single request: if it drops, it starts over, and the provider limits the size of a single upload",
          ],
          [
            "Direct, in parts and resumable",
            "The storage’s multipart (or an open protocol such as tus), with one signed URL per part",
            "Parallel parts, resumption, progress and very large files",
            "More complexity: state, completion and cleanup of abandoned parts",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The happy path, with resumption",
        etapas: [
          "The client calls `POST /uploads` with name, size and type; the API authenticates, checks quota and limits and records the upload as `pending`",
          "The API starts a multipart upload in storage and returns the `uploadId` and short-lived signed URLs",
          "The client sends the parts in parallel, straight to storage; each part has its own retry and returns a receipt (for example, the ETag)",
          "If the connection drops, the client asks which parts have already arrived and resends only the missing ones",
          "The client calls `POST /uploads/{id}/complete` with the list of parts; the API tells storage to assemble the object, checks size and checksum and moves the state to `processing`",
          "A worker inspects the file, which sat in quarantine, and marks it `available` or `rejected`; the client follows along by polling, WebSocket or webhook",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Small file and rare uploads: the API may receive the file, as long as it streams it (see L51). Large file or many users: **the file does not pass through your API**. Signed URL, parts straight to storage, and the API only handles the contract: authorize, record, complete and process. The same idea applies to download, which should also come from storage or a CDN (see L68).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Do not trust the client",
        texto:
          "Name, extension and `Content-Type` come from the client. Generate the object key on the server, fix maximum size and type in the signature itself, check the type by content and release the file only after verification. Signed URLs should expire fast and be valid for one key and one operation.",
      },
    ],
    armadilhas: [
      "Receiving the whole file in the API, in an in-memory buffer: a few simultaneous uploads take the process down.",
      "Trusting the name, extension or `Content-Type` sent by the client: generate the key on the server and check the type by content.",
      "Releasing the file before antivirus and validation: use quarantine and a `processing` state.",
      "Forgetting abandoned uploads: incomplete parts keep taking up (and billing) space; configure automatic expiry and abort.",
    ],
    autoteste: [
      {
        pergunta: "Why use a signed URL instead of receiving the file in the API?",
        resposta:
          "Because bandwidth, long-lived connections and memory stay with object storage, which is built for that. The API only authorizes and records, so it stays light even with many simultaneous uploads.",
      },
      {
        pergunta: "How is an interrupted upload resumed?",
        resposta:
          "The `uploadId` identifies the multipart upload. The client (or the API) asks storage which parts it already has and resends only the missing ones; resending a part that was already sent is safe. At the end, the completion call with the list of parts assembles the file.",
      },
    ],
  },
};
