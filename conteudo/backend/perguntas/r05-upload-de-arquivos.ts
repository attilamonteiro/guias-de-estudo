import type { Pergunta } from "../../tipos";

// R05 · Upload de arquivos
export const r05: Pergunta = {
  numero: 105,
  modulo: "roadmap-iniciante",
  metodo: "playbook",
  pt: {
    titulo: "Upload de arquivos",
    pergunta: "Como você trataria o upload de arquivos em uma aplicação web?",
    porqueEsteMetodo:
      "Upload é uma sequência de decisões de segurança e de desempenho. Um playbook na ordem em que você as tomaria evita esquecer uma etapa que vira vulnerabilidade.",
    resposta30s:
      "Valide **no servidor** (tamanho, tipo real, quantidade), use **HTTPS e autenticação**, **nunca confie no nome do arquivo** (gere um nome único), guarde **fora de pasta executável** (de preferência em object storage), registre **metadados** no banco, use **URL pré-assinada e multipart** para arquivos grandes e processe (miniatura, antivírus) **de forma assíncrona**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Valide no servidor",
            texto:
              "Tamanho máximo, tipo real (confira os bytes iniciais, o magic number, e não só a extensão ou o `Content-Type` enviado), quantidade de arquivos e, se possível, varredura de vírus.",
          },
          {
            titulo: "Canal seguro e autenticado",
            texto: "HTTPS; só quem tem permissão envia; limite de taxa e de tamanho no gateway para evitar abuso.",
          },
          {
            titulo: "Nunca confie no nome do arquivo",
            texto:
              "Gere um nome único (UUID) para evitar colisão e path traversal (`../../`). Guarde o nome original como metadado para o download.",
          },
          {
            titulo: "Armazene fora do código executável",
            texto:
              "Em object storage (S3, Blob) ou pasta sem permissão de execução, nunca na pasta pública servindo scripts.",
          },
          {
            titulo: "Registre metadados",
            texto: "Dono, nome original, tipo, tamanho, hash, data e local de armazenamento, no banco.",
          },
          {
            titulo: "Arquivos grandes",
            texto:
              "Upload direto ao storage por URL pré-assinada, multipart com retomada; o servidor não carrega o arquivo inteiro na memória (use streaming).",
          },
          {
            titulo: "Processe depois, de forma assíncrona",
            texto: "Miniaturas, antivírus e conversões numa fila; o arquivo só fica disponível depois de aprovado.",
          },
          {
            titulo: "Entrega",
            texto: "Servir por URL temporária ou CDN, com `Content-Disposition` e `X-Content-Type-Options: nosniff`.",
          },
        ],
      },
    ],
    armadilhas: [
      "Confiar na extensão ou no `Content-Type` informado pelo cliente.",
      "Salvar com o nome enviado: sobrescreve arquivos e permite path traversal.",
      "Carregar o arquivo inteiro na memória do servidor.",
      "Servir uploads do mesmo domínio da aplicação: um HTML ou SVG enviado vira XSS.",
    ],
    autoteste: [
      {
        pergunta: "Por que gerar um novo nome para o arquivo enviado?",
        resposta: "Evita colisões e ataques de path traversal; o nome original vira só metadado.",
      },
      {
        pergunta: "Como receber arquivos muito grandes sem sobrecarregar o servidor?",
        resposta: "Com URL pré-assinada para o storage e upload multipart retomável; o servidor só valida e registra.",
      },
    ],
  },
  en: {
    titulo: "File uploads",
    pergunta: "How would you handle file uploads in a web application?",
    porqueEsteMetodo:
      "An upload is a sequence of security and performance decisions. A playbook in the order you would take them avoids skipping a step that becomes a vulnerability.",
    resposta30s:
      "Validate **on the server** (size, real type, count), use **HTTPS and authentication**, **never trust the file name** (generate a unique one), store **outside executable folders** (preferably in object storage), record **metadata** in the database, use **pre-signed URLs and multipart** for large files and process (thumbnails, antivirus) **asynchronously**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook",
        passos: [
          {
            titulo: "Validate on the server",
            texto:
              "Maximum size, real type (check the leading bytes, the magic number, not only the extension or the sent `Content-Type`), file count and, if possible, a virus scan.",
          },
          {
            titulo: "Secure, authenticated channel",
            texto: "HTTPS; only permitted users upload; rate and size limits at the gateway to avoid abuse.",
          },
          {
            titulo: "Never trust the file name",
            texto:
              "Generate a unique name (UUID) to avoid collisions and path traversal (`../../`). Keep the original name as metadata for download.",
          },
          {
            titulo: "Store away from executable code",
            texto:
              "In object storage (S3, Blob) or a folder without execute permission, never in the public folder serving scripts.",
          },
          {
            titulo: "Record metadata",
            texto: "Owner, original name, type, size, hash, date and storage location, in the database.",
          },
          {
            titulo: "Large files",
            texto:
              "Direct upload to storage through a pre-signed URL, resumable multipart; the server does not load the whole file into memory (use streaming).",
          },
          {
            titulo: "Process later, asynchronously",
            texto: "Thumbnails, antivirus and conversions in a queue; the file becomes available only after approval.",
          },
          {
            titulo: "Delivery",
            texto:
              "Serve through a temporary URL or CDN, with `Content-Disposition` and `X-Content-Type-Options: nosniff`.",
          },
        ],
      },
    ],
    armadilhas: [
      "Trusting the extension or the `Content-Type` reported by the client.",
      "Saving under the sent name: it overwrites files and allows path traversal.",
      "Loading the entire file into server memory.",
      "Serving uploads from the application’s own domain: an uploaded HTML or SVG becomes XSS.",
    ],
    autoteste: [
      {
        pergunta: "Why generate a new name for the uploaded file?",
        resposta: "It avoids collisions and path-traversal attacks; the original name becomes just metadata.",
      },
      {
        pergunta: "How do you receive very large files without overloading the server?",
        resposta:
          "With a pre-signed URL to storage and a resumable multipart upload; the server only validates and records.",
      },
    ],
  },
};
