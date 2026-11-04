import type { Pergunta } from "../../tipos";

// L43 · Body parsing no Express
export const l043: Pergunta = {
  numero: 143,
  modulo: "linkedin-express",
  metodo: "feynman",
  pt: {
    titulo: "Body parsing no Express",
    pergunta: "O que é body parsing?",
    porqueEsteMetodo:
      "O corpo da requisição chega como bytes, e a ideia de “interpretar” esses bytes se entende melhor com uma imagem do dia a dia. Depois a analogia dá lugar ao mecanismo real do Express e aos seus limites.",
    resposta30s:
      "**Body parsing** é ler os bytes do corpo da requisição, conferir o `Content-Type` e transformá-los em um objeto JavaScript em `req.body`; o Node.js e o Express puro entregam o corpo só como stream. No Express, `express.json()` e `express.urlencoded()` fazem isso para JSON e formulários, com um **limite de tamanho** para evitar abuso. O **body-parser** em geral já não precisa ser instalado: o Express moderno embute esses parsers (e usa o pacote por baixo).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense na recepção de um prédio comercial. Os pacotes chegam fechados, cada um com uma etiqueta dizendo o que há dentro (carta, formulário, caixa). O recepcionista lê a etiqueta, abre o pacote do jeito certo, transcreve o conteúdo para uma ficha padrão e deixa a ficha na bandeja do destinatário. Se a etiqueta não bate com o conteúdo, ou o pacote é grande demais, ele recusa a entrega.",
        tecnico:
          "O corpo de uma requisição HTTP é um fluxo de bytes (veja T37). O middleware de body parsing lê esse fluxo até o fim, escolhe o parser pelo cabeçalho `Content-Type`, converte o conteúdo (JSON em objeto, formulário em pares chave/valor) e grava o resultado em `req.body`. Se o `Content-Type` não é o que ele trata, ele não toca no corpo, e `req.body` fica vazio ou indefinido, conforme a versão do Express.",
        limite:
          "Na recepção, a etiqueta costuma ser honesta; em HTTP quem escreve o `Content-Type` e o conteúdo é o cliente, que pode mentir ou mandar lixo. E o parser lê o corpo inteiro para a memória antes de entregá-lo, por isso o limite de tamanho existe e a validação do conteúdo continua sendo sua.",
      },
      {
        tipo: "tabela",
        titulo: "Os parsers embutidos do Express",
        colunas: ["Middleware", "`Content-Type` tratado", "O que aparece em `req.body`", "Uso típico"],
        linhas: [
          ["`express.json()`", "`application/json`", "Objeto ou array JavaScript", "APIs REST"],
          [
            "`express.urlencoded()`",
            "`application/x-www-form-urlencoded`",
            "Objeto com pares chave/valor",
            "Formulários HTML",
          ],
          ["`express.text()`", "`text/plain`", "String", "Texto puro"],
          [
            "`express.raw()`",
            "`application/octet-stream` (por padrão)",
            "`Buffer` com os bytes originais",
            "Webhooks com assinatura, binários",
          ],
          [
            "Nenhum deles",
            "`multipart/form-data`",
            "Não é interpretado por esses parsers",
            "Upload de arquivos: multer ou busboy (veja L51)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Ligando os parsers",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const app = express();",
          'app.use(express.json({ limit: "100kb" })); // JSON vira req.body; acima do limite: 413',
          "app.use(express.urlencoded({ extended: false })); // formulários HTML",
          "",
          'app.post("/clientes", (req, res) => {',
          "  const { nome } = req.body ?? {}; // sem o Content-Type certo, o corpo pode vir vazio",
          "  res.status(201).json({ nome });",
          "});",
        ].join("\n"),
        nota: "Registre os parsers antes das rotas que usam `req.body`. Para um limite maior só em uma rota, passe o parser como middleware daquela rota em vez de aumentar o limite global.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Ainda preciso do body-parser?",
        texto:
          "Em geral, não. O Express moderno já traz `express.json()`, `express.urlencoded()`, `express.text()` e `express.raw()`, que são o `body-parser` reexportado: instalar o pacote à parte só se justifica em casos raros, como código antigo que já depende dele. Confira a documentação do Express (expressjs.com) para a sua versão, inclusive o valor de `req.body` quando nenhum corpo foi lido.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limites e erros do parser",
        texto:
          "O limite padrão de tamanho é pequeno (da ordem de 100 KB; confira a documentação) e vale por parser. Um corpo maior gera erro `413`, e um JSON malformado gera `400`: trate os dois no middleware de erro (veja L41) para não devolver a pilha ao cliente. O parser só muda o **formato**; tipos, campos obrigatórios e tamanhos dos valores continuam pedindo validação (veja L50).",
      },
    ],
    armadilhas: [
      "Registrar `express.json()` depois das rotas: quando o handler roda, `req.body` ainda não foi preenchido.",
      "Enviar JSON sem `Content-Type: application/json` (por exemplo, uma string no `fetch` sai como `text/plain`): o parser ignora o corpo e `req.body` fica vazio.",
      "Subir o `limit` do app inteiro para “fazer funcionar”: o corpo é lido inteiro em memória, então aumente só na rota que precisa, e use streaming para arquivos grandes (veja L51).",
      "Esperar que `json()` ou `urlencoded()` leiam `multipart/form-data`: upload de arquivo exige multer, busboy ou formidable.",
    ],
    autoteste: [
      {
        pergunta: "Por que `req.body` chega vazio mesmo com o JSON certo no `fetch`?",
        resposta:
          "As causas comuns: faltou o cabeçalho `Content-Type: application/json`, o `express.json()` foi registrado depois da rota, ou o formato do corpo não corresponde ao parser ligado.",
      },
      {
        pergunta: "O que acontece quando o corpo passa do `limit` ou o JSON é inválido?",
        resposta:
          "O parser interrompe com erro: `413` para tamanho excedido e `400` para JSON malformado. Trate no middleware de erro (veja L41).",
      },
    ],
  },
  en: {
    titulo: "Body parsing in Express",
    pergunta: "What is body parsing?",
    porqueEsteMetodo:
      "A request body arrives as bytes, and the idea of “interpreting” those bytes is easier to grasp with an everyday picture. Then the analogy gives way to the real Express mechanism and its limits.",
    resposta30s:
      "**Body parsing** means reading the bytes of the request body, checking the `Content-Type` and turning them into a JavaScript object in `req.body`; plain Node.js and Express hand you the body only as a stream. In Express, `express.json()` and `express.urlencoded()` do this for JSON and forms, with a **size limit** to prevent abuse. You generally no longer need to install **body-parser**: modern Express ships these parsers built in (and uses the package underneath).",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the front desk of an office building. Packages arrive sealed, each with a label saying what is inside (a letter, a form, a box). The receptionist reads the label, opens the package the right way, copies the contents onto a standard sheet and leaves the sheet in the recipient’s tray. If the label does not match the contents, or the package is too big, they refuse the delivery.",
        tecnico:
          "An HTTP request body is a stream of bytes (see T37). The body-parsing middleware reads that stream to the end, picks the parser from the `Content-Type` header, converts the content (JSON into an object, a form into key/value pairs) and stores the result in `req.body`. If the `Content-Type` is not one it handles, it leaves the body alone, and `req.body` stays empty or undefined, depending on the Express version.",
        limite:
          "At the front desk the label is usually honest; in HTTP the client writes both the `Content-Type` and the content, and it can lie or send garbage. The parser also reads the whole body into memory before handing it over, which is why the size limit exists and why validating the content is still your job.",
      },
      {
        tipo: "tabela",
        titulo: "Express’s built-in parsers",
        colunas: ["Middleware", "`Content-Type` handled", "What ends up in `req.body`", "Typical use"],
        linhas: [
          ["`express.json()`", "`application/json`", "A JavaScript object or array", "REST APIs"],
          [
            "`express.urlencoded()`",
            "`application/x-www-form-urlencoded`",
            "An object of key/value pairs",
            "HTML forms",
          ],
          ["`express.text()`", "`text/plain`", "A string", "Plain text"],
          [
            "`express.raw()`",
            "`application/octet-stream` (by default)",
            "A `Buffer` with the original bytes",
            "Signed webhooks, binary data",
          ],
          [
            "None of them",
            "`multipart/form-data`",
            "Not interpreted by these parsers",
            "File uploads: multer or busboy (see L51)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Turning the parsers on",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          "",
          "const app = express();",
          'app.use(express.json({ limit: "100kb" })); // JSON becomes req.body; above the limit: 413',
          "app.use(express.urlencoded({ extended: false })); // HTML forms",
          "",
          'app.post("/customers", (req, res) => {',
          "  const { name } = req.body ?? {}; // without the right Content-Type, the body may be empty",
          "  res.status(201).json({ name });",
          "});",
        ].join("\n"),
        nota: "Register the parsers before the routes that use `req.body`. For a larger limit on a single route, pass the parser as that route’s middleware instead of raising the global limit.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Do I still need body-parser?",
        texto:
          "Generally, no. Modern Express already provides `express.json()`, `express.urlencoded()`, `express.text()` and `express.raw()`, which are `body-parser` re-exported: installing the package separately is only justified in rare cases, such as old code that already depends on it. Check the Express documentation (expressjs.com) for your version, including the value of `req.body` when no body was read.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Parser limits and errors",
        texto:
          "The default size limit is small (on the order of 100 KB; check the documentation) and applies per parser. A larger body raises a `413` error, and malformed JSON raises a `400`: handle both in the error middleware (see L41) so the stack never reaches the client. The parser only changes the **format**; types, required fields and value sizes still need validation (see L50).",
      },
    ],
    armadilhas: [
      "Registering `express.json()` after the routes: by the time the handler runs, `req.body` has not been filled in yet.",
      "Sending JSON without `Content-Type: application/json` (for example, a plain string in `fetch` goes out as `text/plain`): the parser ignores the body and `req.body` stays empty.",
      "Raising the app-wide `limit` just to “make it work”: the body is read whole into memory, so raise it only on the route that needs it, and use streaming for large files (see L51).",
      "Expecting `json()` or `urlencoded()` to read `multipart/form-data`: file uploads need multer, busboy or formidable.",
    ],
    autoteste: [
      {
        pergunta: "Why does `req.body` arrive empty even though the `fetch` sends the right JSON?",
        resposta:
          "Common causes: the `Content-Type: application/json` header was missing, `express.json()` was registered after the route, or the body format does not match the parser that is turned on.",
      },
      {
        pergunta: "What happens when the body exceeds the `limit` or the JSON is invalid?",
        resposta:
          "The parser aborts with an error: `413` for an oversized body and `400` for malformed JSON. Handle it in the error middleware (see L41).",
      },
    ],
  },
};
