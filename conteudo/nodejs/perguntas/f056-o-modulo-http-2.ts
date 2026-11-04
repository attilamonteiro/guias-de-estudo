import type { Pergunta } from "../../tipos";

// F56 · O módulo HTTP/2
export const f056: Pergunta = {
  numero: 456,
  modulo: "founditgulf-avancadas",
  metodo: "compare",
  pt: {
    titulo: "O módulo HTTP/2",
    pergunta: "O que é o módulo HTTP2 no Node.js?",
    porqueEsteMetodo:
      "O módulo `http2` só faz sentido ao lado do que ele melhora e do que deixa igual. Comparar HTTP/1.1 e HTTP/2 ponto a ponto mostra o ganho real, os limites e quando vale usá-lo direto.",
    resposta30s:
      "O **`node:http2`** é o módulo nativo que implementa o protocolo **HTTP/2** no Node.js: `createSecureServer` e `createServer` para servidores, `connect` para clientes, e a unidade de trabalho é o **stream**, vários por conexão. O HTTP/2 traz **multiplexação**, **cabeçalhos comprimidos** (HPACK) e formato binário, mas o TCP por baixo continua com o seu bloqueio de cabeça de fila. Na prática, é comum terminar o HTTP/2 num proxy ou balanceador e deixar o Node.js falando HTTP/1.1 atrás dele.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "HTTP/1.1 e HTTP/2",
        colunas: ["Aspecto", "HTTP/1.1", "HTTP/2"],
        linhas: [
          ["Formato na rede", "Texto", "Binário, em quadros (frames)"],
          [
            "Requisições em paralelo",
            "Uma por conexão de cada vez; o navegador abre várias conexões TCP para paralelizar",
            "Uma conexão com vários streams multiplexados ao mesmo tempo",
          ],
          [
            "Cabeçalhos",
            "Texto repetido por inteiro a cada requisição",
            "Comprimidos com HPACK, com uma tabela compartilhada entre as requisições",
          ],
          [
            "Bloqueio de cabeça de fila",
            "Existe na camada HTTP, dentro de cada conexão",
            "Resolvido na camada HTTP, mas continua no TCP: um pacote perdido atrasa todos os streams da conexão",
          ],
          ["Controle de fluxo", "Não tem um próprio, depende do TCP", "Por stream e por conexão, no próprio protocolo"],
          [
            "Criptografia",
            "Opcional (HTTP ou HTTPS)",
            "Os navegadores só falam HTTP/2 sobre TLS, negociado por ALPN; o `node:http2` também aceita HTTP/2 sem TLS, útil entre serviços",
          ],
          ["Server push", "Não existe", "O protocolo prevê, mas na prática caiu em desuso (veja o aviso abaixo)"],
          [
            "API no Node.js",
            "`node:http` e `node:https`",
            "`node:http2`: `createSecureServer`, `connect`, streams, além de uma API de compatibilidade parecida com a do `http`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Servidor HTTP/2 com a API de streams",
        legenda: "JavaScript",
        codigo: [
          'import { createSecureServer } from "node:http2";',
          'import { readFileSync } from "node:fs";',
          "",
          "const servidor = createSecureServer({",
          '  key: readFileSync("chave.pem"),',
          '  cert: readFileSync("certificado.pem"),',
          "});",
          "",
          "// Cada requisição HTTP/2 chega como um stream dentro da mesma conexão",
          'servidor.on("stream", (stream, cabecalhos) => {',
          '  stream.respond({ ":status": 200, "content-type": "text/plain" });',
          '  stream.end(`você pediu ${cabecalhos[":path"]}\\n`);',
          "});",
          "",
          "servidor.listen(8443);",
        ].join("\n"),
        nota: "Os pseudo-cabeçalhos começam com dois-pontos (`:path`, `:method`, `:status`). Se preferir manter o código no estilo `(req, res)`, `createSecureServer(opcoes, (req, res) => { ... })` usa a API de compatibilidade.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Direto no Node.js ou atrás de um proxy?",
        texto:
          "Na maioria das aplicações web, o TLS e o HTTP/2 **terminam num proxy reverso, balanceador ou CDN** (nginx, um balanceador de nuvem), que fala HTTP/1.1 com o Node.js: o navegador ganha multiplexação e compressão de cabeçalhos sem você mudar o código. Use o `node:http2` **direto** quando o serviço precisa falar HTTP/2 por conta própria: gRPC (que roda sobre HTTP/2), comunicação entre serviços com muitos streams numa conexão só, ou controle fino dos streams. Alguns frameworks suportam HTTP/2 por configuração: confira o seu.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Server push: previsto, mas na prática aposentado",
        texto:
          'No **server push**, o servidor envia recursos antes de o cliente pedi-los: ao receber o pedido do HTML, já empurra o CSS e o JavaScript (no Node.js, `stream.pushStream`). Na prática foi difícil de acertar (era comum empurrar o que o navegador já tinha em cache) e os principais navegadores o retiraram ou desativaram: confira o estado atual na documentação deles antes de contar com isso. As alternativas de hoje são o `103 Early Hints` e `<link rel="preload">`, que avisam o navegador do que vem a seguir e deixam que ele decida.',
      },
    ],
    armadilhas: [
      "Achar que o HTTP/2 elimina o bloqueio de cabeça de fila: ele resolve na camada HTTP, mas um pacote perdido no TCP ainda atrasa todos os streams da conexão.",
      "Esperar que o navegador fale HTTP/2 sem TLS: na prática, só com HTTPS (e a negociação ALPN).",
      "Manter truques de HTTP/1.1, como concatenar arquivos, usar sprites ou espalhar recursos por vários domínios: com multiplexação, deixam de ajudar e podem atrapalhar o cache.",
      "Contar com server push para ganhar velocidade: os navegadores principais deixaram de suportá-lo. Use `103 Early Hints` ou preload.",
    ],
    autoteste: [
      {
        pergunta: "O que a multiplexação do HTTP/2 resolve, e o que ela não resolve?",
        resposta:
          "Resolve o paralelismo na camada HTTP: muitas requisições e respostas intercaladas numa só conexão, sem abrir várias conexões. Não resolve o bloqueio no TCP: se um pacote se perde, o TCP segura os dados seguintes de todos os streams até a retransmissão.",
      },
      {
        pergunta: "Por que, na prática, se termina o HTTP/2 num proxy, e quando usar o `node:http2` direto?",
        resposta:
          "O proxy já cuida de certificados, HTTP/2 e balanceamento, e o Node.js fica simples com HTTP/1.1 na rede interna. Usa-se o `node:http2` direto quando o serviço precisa do protocolo em si: gRPC, muitos streams entre serviços, ou controle de baixo nível.",
      },
    ],
  },
  en: {
    titulo: "The HTTP/2 module",
    pergunta: "What is the HTTP2 module in Node.js?",
    porqueEsteMetodo:
      "The `http2` module only makes sense next to what it improves and what it leaves unchanged. Comparing HTTP/1.1 and HTTP/2 point by point shows the real gain, the limits and when it is worth using directly.",
    resposta30s:
      "**`node:http2`** is the native module that implements the **HTTP/2** protocol in Node.js: `createSecureServer` and `createServer` for servers, `connect` for clients, and the unit of work is the **stream**, many per connection. HTTP/2 brings **multiplexing**, **compressed headers** (HPACK) and a binary format, but the TCP underneath keeps its head-of-line blocking. In practice, it is common to terminate HTTP/2 at a proxy or load balancer and leave Node.js speaking HTTP/1.1 behind it.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "HTTP/1.1 and HTTP/2",
        colunas: ["Aspect", "HTTP/1.1", "HTTP/2"],
        linhas: [
          ["Format on the wire", "Text", "Binary, in frames"],
          [
            "Parallel requests",
            "One at a time per connection; the browser opens several TCP connections to parallelize",
            "One connection with several streams multiplexed at once",
          ],
          [
            "Headers",
            "Text repeated in full on every request",
            "Compressed with HPACK, with a table shared across requests",
          ],
          [
            "Head-of-line blocking",
            "Exists at the HTTP layer, inside each connection",
            "Solved at the HTTP layer, but still present in TCP: one lost packet delays every stream on the connection",
          ],
          ["Flow control", "None of its own, relies on TCP", "Per stream and per connection, in the protocol itself"],
          [
            "Encryption",
            "Optional (HTTP or HTTPS)",
            "Browsers only speak HTTP/2 over TLS, negotiated through ALPN; `node:http2` also accepts HTTP/2 without TLS, useful between services",
          ],
          [
            "Server push",
            "Does not exist",
            "The protocol provides for it, but in practice it fell out of use (see the warning below)",
          ],
          [
            "API in Node.js",
            "`node:http` and `node:https`",
            "`node:http2`: `createSecureServer`, `connect`, streams, plus a compatibility API similar to `http`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An HTTP/2 server with the streams API",
        legenda: "JavaScript",
        codigo: [
          'import { createSecureServer } from "node:http2";',
          'import { readFileSync } from "node:fs";',
          "",
          "const server = createSecureServer({",
          '  key: readFileSync("key.pem"),',
          '  cert: readFileSync("certificate.pem"),',
          "});",
          "",
          "// Each HTTP/2 request arrives as a stream inside the same connection",
          'server.on("stream", (stream, headers) => {',
          '  stream.respond({ ":status": 200, "content-type": "text/plain" });',
          '  stream.end(`you asked for ${headers[":path"]}\\n`);',
          "});",
          "",
          "server.listen(8443);",
        ].join("\n"),
        nota: "Pseudo-headers start with a colon (`:path`, `:method`, `:status`). If you prefer to keep the `(req, res)` style, `createSecureServer(options, (req, res) => { ... })` uses the compatibility API.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Directly in Node.js or behind a proxy?",
        texto:
          "In most web applications, TLS and HTTP/2 **terminate at a reverse proxy, load balancer or CDN** (nginx, a cloud load balancer), which talks HTTP/1.1 to Node.js: the browser gets multiplexing and header compression without you changing the code. Use `node:http2` **directly** when the service needs to speak HTTP/2 on its own: gRPC (which runs over HTTP/2), service-to-service traffic with many streams on one connection, or fine control of the streams. Some frameworks support HTTP/2 through configuration: check yours.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Server push: planned, but retired in practice",
        texto:
          'With **server push**, the server sends resources before the client asks for them: on receiving the request for the HTML, it already pushes the CSS and the JavaScript (in Node.js, `stream.pushStream`). In practice it was hard to get right (it was common to push what the browser already had cached) and the main browsers removed or disabled it: check the current state in their documentation before counting on it. Today’s alternatives are `103 Early Hints` and `<link rel="preload">`, which tell the browser what is coming next and let it decide.',
      },
    ],
    armadilhas: [
      "Believing HTTP/2 eliminates head-of-line blocking: it solves it at the HTTP layer, but a lost packet in TCP still delays every stream on the connection.",
      "Expecting the browser to speak HTTP/2 without TLS: in practice, only over HTTPS (with ALPN negotiation).",
      "Keeping HTTP/1.1 tricks such as concatenating files, using sprites or spreading resources across several domains: with multiplexing they stop helping and can hurt caching.",
      "Counting on server push for speed: the main browsers no longer support it. Use `103 Early Hints` or preload.",
    ],
    autoteste: [
      {
        pergunta: "What does HTTP/2 multiplexing solve, and what does it not?",
        resposta:
          "It solves parallelism at the HTTP layer: many interleaved requests and responses on a single connection, without opening several connections. It does not solve blocking in TCP: if a packet is lost, TCP holds back the following data of every stream until retransmission.",
      },
      {
        pergunta: "Why is HTTP/2 usually terminated at a proxy, and when do you use `node:http2` directly?",
        resposta:
          "The proxy already handles certificates, HTTP/2 and balancing, and Node.js stays simple with HTTP/1.1 on the internal network. You use `node:http2` directly when the service needs the protocol itself: gRPC, many streams between services, or low-level control.",
      },
    ],
  },
};
