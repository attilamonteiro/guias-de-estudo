import type { Pergunta } from "../../tipos";

// F65 · TLS/SSL e HTTPS
export const f065: Pergunta = {
  numero: 465,
  modulo: "founditgulf-avancadas",
  metodo: "trace",
  pt: {
    titulo: "TLS/SSL e HTTPS",
    pergunta: "O que é TLS/SSL no Node.js?",
    porqueEsteMetodo:
      "TLS é um acordo em etapas entre cliente e servidor, e cada etapa existe para barrar um ataque. Seguir uma conexão HTTPS, inclusive os pontos em que o certificado falha, mostra o que o protocolo garante e por que não se desliga a verificação.",
    resposta30s:
      "**TLS** (Transport Layer Security) é o protocolo que cifra a conexão e **autentica o servidor** por um certificado; **SSL** é o nome do antecessor, hoje obsoleto, que sobrevive no vocabulário. No Node.js, o **`node:tls`** oferece sockets seguros para qualquer protocolo e o **`node:https`** é o HTTP por cima dele (`https.createServer({ key, cert })`). Nunca desligue a verificação com `rejectUnauthorized: false` em produção; na prática, o TLS costuma terminar num proxy ou balanceador.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma conexão HTTPS, do connect aos dados cifrados",
        etapas: [
          "O cliente resolve o nome (veja F68) e abre uma conexão TCP com o servidor, normalmente na porta 443",
          "**ClientHello**: o cliente envia as versões de TLS e as suítes de cifras que aceita, um valor aleatório, o nome do host que deseja (**SNI**, para o servidor escolher o certificado certo) e os protocolos de aplicação (ALPN, como `h2` e `http/1.1`)",
          "**ServerHello e certificado**: o servidor escolhe a versão e a suíte e envia o seu certificado, com a chave pública, mais os certificados intermediários (a cadeia)",
          "**Verificação da cadeia**: o cliente confere se o certificado foi assinado por uma cadeia que termina numa autoridade certificadora (CA) em que ele confia, se o nome do host bate com o do certificado e se a data está dentro da validade",
          "**Troca de chaves**: os dois combinam um segredo compartilhado por uma troca efêmera (Diffie-Hellman) e derivam as chaves da sessão; o servidor prova que possui a chave privada do certificado e as duas partes confirmam o handshake",
          "**Dados cifrados**: a partir daí o HTTP viaja cifrado e com verificação de integridade, e o seu código no Node.js recebe os bytes já decifrados",
        ],
        nota: "A ordem exata das mensagens muda entre as versões do TLS, mas as ideias são as mesmas: negociar, provar a identidade, combinar chaves e cifrar. Confira os detalhes na documentação do `node:tls`.",
      },
      {
        tipo: "passos",
        titulo: "Agora os pontos em que a verificação falha",
        passos: [
          {
            titulo: "Certificado expirado",
            texto:
              "A data de validade passou, o cliente aborta o handshake e o Node.js lança `CERT_HAS_EXPIRED`. É a causa mais comum de uma queda “do nada”. Conserto: renovar, e automatizar a renovação (por exemplo, com um cliente ACME para o Let’s Encrypt) com um alerta bem antes do vencimento.",
          },
          {
            titulo: "Cadeia que não se verifica",
            texto:
              "O servidor enviou só o certificado do próprio site, sem os intermediários, ou usa uma CA interna ou um certificado autoassinado. O cliente vê `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, `SELF_SIGNED_CERT_IN_CHAIN` ou `DEPTH_ZERO_SELF_SIGNED_CERT`. Conserto: servir o certificado completo (o “fullchain”) ou, para uma CA interna, entregar a CA ao cliente na opção `ca` (ou em `NODE_EXTRA_CA_CERTS`).",
          },
          {
            titulo: "Nome que não confere",
            texto:
              "O certificado é válido, mas para outro nome. O Node.js recusa com `ERR_TLS_CERT_ALTNAME_INVALID`. Conserto: um certificado que cubra o host usado (inclusive subdomínios e SNI corretos), nunca ignorar o erro.",
          },
          {
            titulo: "O atalho perigoso",
            texto:
              "Colocar `rejectUnauthorized: false` (ou `NODE_TLS_REJECT_UNAUTHORIZED=0`) faz o erro sumir e também desliga a proteção contra o homem no meio: qualquer um na rota passa a se passar pelo servidor. Serve, no máximo, para um teste local descartável.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Servidor HTTPS e cliente com uma CA interna",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:https";',
          'import { readFileSync } from "node:fs";',
          "",
          "const opcoes = {",
          '  key: readFileSync("chave-privada.pem"),',
          '  cert: readFileSync("fullchain.pem"), // certificado do servidor + intermediários',
          "};",
          "",
          'createServer(opcoes, (req, res) => res.end("olá, com TLS\\n")).listen(8443);',
          "",
          "// Cliente de uma CA interna: confie em UMA autoridade, sem desligar a verificação",
          '//   https.get(url, { ca: readFileSync("ca-interna.pem") }, callback);',
          "// Nunca: { rejectUnauthorized: false }",
        ].join("\n"),
        nota: "A chave privada nunca vai para o repositório nem sai do servidor. Para autenticar também o cliente (mTLS), o servidor usa `requestCert: true` e valida o certificado que o cliente apresenta.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que o TLS garante, e na prática onde ele termina",
        texto:
          "O TLS dá **confidencialidade** (ninguém no caminho lê), **integridade** (ninguém altera sem ser detectado) e **autenticação do servidor** (o certificado prova quem ele é; no mTLS, o cliente também prova). Em produção, o mais comum é **terminar o TLS num proxy reverso, balanceador ou CDN** (veja D64), que cuida de certificados e renovação, e deixar o Node.js falar HTTP na rede interna. Aí, o Node.js precisa confiar nos cabeçalhos `X-Forwarded-*` do proxy conhecido (`trust proxy` no Express) para saber que o pedido original era HTTPS.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "HTTPS sozinho não obriga ninguém a usar HTTPS",
        texto:
          "Um usuário que digita o endereço sem `https://` ainda faz a primeira requisição em claro. Redirecione HTTP para HTTPS e envie o cabeçalho **HSTS**, que manda o navegador usar só HTTPS daqui em diante (veja D29). E lembre: o TLS protege o **caminho**; o conteúdo que chega ao servidor continua precisando de validação.",
      },
    ],
    armadilhas: [
      "Achar que SSL ainda é o que se usa: os protocolos SSL estão obsoletos e o que roda hoje é o TLS. Não reduza a versão mínima para agradar a um cliente antigo.",
      "Servir só o certificado do site, sem os intermediários: alguns navegadores completam a cadeia sozinhos, mas clientes Node.js, `curl` e aplicativos falham.",
      "Desligar a verificação (`rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`) para “resolver” um erro de certificado: o erro some e a proteção também.",
      "Deixar o certificado vencer ou a chave privada ir parar no repositório: automatize a renovação, monitore a validade e guarde a chave como um segredo.",
    ],
    autoteste: [
      {
        pergunta: "O que acontece no handshake TLS, e por que a verificação da cadeia é necessária?",
        resposta:
          "Cliente e servidor negociam a versão e a cifra, o servidor apresenta o certificado, os dois combinam as chaves da sessão e passam a trocar dados cifrados. Sem verificar a cadeia, qualquer um poderia apresentar um certificado próprio e se passar pelo servidor (ataque do homem no meio): a verificação é o que liga o certificado a uma autoridade em que o cliente confia.",
      },
      {
        pergunta: "Por que `rejectUnauthorized: false` é perigoso, e qual é o jeito certo de confiar numa CA interna?",
        resposta:
          "Porque desliga a verificação do certificado e permite que qualquer um se passe pelo servidor. O jeito certo é entregar a CA interna ao cliente (opção `ca`, ou `NODE_EXTRA_CA_CERTS`), mantendo a verificação ligada.",
      },
    ],
  },
  en: {
    titulo: "TLS/SSL and HTTPS",
    pergunta: "What is TLS/SSL in Node.js?",
    porqueEsteMetodo:
      "TLS is a step-by-step agreement between client and server, and each step exists to block an attack. Following an HTTPS connection, including the points where the certificate fails, shows what the protocol guarantees and why verification is never switched off.",
    resposta30s:
      "**TLS** (Transport Layer Security) is the protocol that encrypts the connection and **authenticates the server** through a certificate; **SSL** is the name of its predecessor, now obsolete, which survives in everyday vocabulary. In Node.js, **`node:tls`** provides secure sockets for any protocol and **`node:https`** is HTTP on top of it (`https.createServer({ key, cert })`). Never switch verification off with `rejectUnauthorized: false` in production; in practice, TLS is usually terminated at a proxy or load balancer.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One HTTPS connection, from connect to encrypted data",
        etapas: [
          "The client resolves the name (see F68) and opens a TCP connection to the server, normally on port 443",
          "**ClientHello**: the client sends the TLS versions and cipher suites it accepts, a random value, the host name it wants (**SNI**, so the server picks the right certificate) and the application protocols (ALPN, such as `h2` and `http/1.1`)",
          "**ServerHello and certificate**: the server picks the version and the suite and sends its certificate, with the public key, plus the intermediate certificates (the chain)",
          "**Chain verification**: the client checks that the certificate was signed through a chain ending at a certificate authority (CA) it trusts, that the host name matches the certificate’s and that the date is within the validity period",
          "**Key exchange**: both sides agree on a shared secret through an ephemeral exchange (Diffie-Hellman) and derive the session keys; the server proves it holds the certificate’s private key and both parties confirm the handshake",
          "**Encrypted data**: from then on, HTTP travels encrypted and integrity-checked, and your Node.js code receives the bytes already decrypted",
        ],
        nota: "The exact order of the messages changes between TLS versions, but the ideas are the same: negotiate, prove identity, agree on keys and encrypt. Check the details in the `node:tls` documentation.",
      },
      {
        tipo: "passos",
        titulo: "Now the points where verification fails",
        passos: [
          {
            titulo: "Expired certificate",
            texto:
              "The expiry date has passed, the client aborts the handshake and Node.js throws `CERT_HAS_EXPIRED`. It is the most common cause of an outage “out of nowhere”. Fix: renew, and automate the renewal (for example, with an ACME client for Let’s Encrypt) with an alert well before expiry.",
          },
          {
            titulo: "A chain that cannot be verified",
            texto:
              "The server sent only the site’s own certificate, without the intermediates, or it uses an internal CA or a self-signed certificate. The client sees `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, `SELF_SIGNED_CERT_IN_CHAIN` or `DEPTH_ZERO_SELF_SIGNED_CERT`. Fix: serve the full certificate (the “fullchain”) or, for an internal CA, hand the CA to the client in the `ca` option (or in `NODE_EXTRA_CA_CERTS`).",
          },
          {
            titulo: "A name that does not match",
            texto:
              "The certificate is valid, but for another name. Node.js refuses with `ERR_TLS_CERT_ALTNAME_INVALID`. Fix: a certificate that covers the host in use (including the right subdomains and SNI), never ignoring the error.",
          },
          {
            titulo: "The dangerous shortcut",
            texto:
              "Setting `rejectUnauthorized: false` (or `NODE_TLS_REJECT_UNAUTHORIZED=0`) makes the error disappear and also switches off protection against the man in the middle: anyone on the route can pose as the server. At most, it belongs in a throwaway local test.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "An HTTPS server and a client with an internal CA",
        legenda: "JavaScript",
        codigo: [
          'import { createServer } from "node:https";',
          'import { readFileSync } from "node:fs";',
          "",
          "const options = {",
          '  key: readFileSync("private-key.pem"),',
          '  cert: readFileSync("fullchain.pem"), // server certificate + intermediates',
          "};",
          "",
          'createServer(options, (req, res) => res.end("hello, over TLS\\n")).listen(8443);',
          "",
          "// Client of an internal CA: trust ONE authority, without turning verification off",
          '//   https.get(url, { ca: readFileSync("internal-ca.pem") }, callback);',
          "// Never: { rejectUnauthorized: false }",
        ].join("\n"),
        nota: "The private key never goes into the repository nor leaves the server. To authenticate the client too (mTLS), the server uses `requestCert: true` and validates the certificate the client presents.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What TLS guarantees, and where it ends in practice",
        texto:
          "TLS gives **confidentiality** (nobody on the path can read), **integrity** (nobody can alter without being detected) and **server authentication** (the certificate proves who it is; with mTLS, the client proves it too). In production, the most common setup is to **terminate TLS at a reverse proxy, load balancer or CDN** (see D64), which handles certificates and renewal, and let Node.js speak HTTP on the internal network. Then Node.js must trust the `X-Forwarded-*` headers of the known proxy (`trust proxy` in Express) to know the original request was HTTPS.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "HTTPS alone does not force anyone to use HTTPS",
        texto:
          "A user who types the address without `https://` still makes the first request in the clear. Redirect HTTP to HTTPS and send the **HSTS** header, which tells the browser to use only HTTPS from now on (see D29). And remember: TLS protects the **path**; the content that reaches the server still needs validation.",
      },
    ],
    armadilhas: [
      "Thinking SSL is still what is used: the SSL protocols are obsolete and what runs today is TLS. Do not lower the minimum version to please an old client.",
      "Serving only the site’s certificate, without the intermediates: some browsers complete the chain on their own, but Node.js clients, `curl` and apps fail.",
      "Switching verification off (`rejectUnauthorized: false`, `NODE_TLS_REJECT_UNAUTHORIZED=0`) to “fix” a certificate error: the error goes away and so does the protection.",
      "Letting the certificate expire or the private key end up in the repository: automate renewal, monitor the expiry date and treat the key as a secret.",
    ],
    autoteste: [
      {
        pergunta: "What happens in the TLS handshake, and why is chain verification necessary?",
        resposta:
          "Client and server negotiate the version and the cipher, the server presents its certificate, both agree on the session keys and start exchanging encrypted data. Without verifying the chain, anyone could present a certificate of their own and pose as the server (a man-in-the-middle attack): verification is what ties the certificate to an authority the client trusts.",
      },
      {
        pergunta: "Why is `rejectUnauthorized: false` dangerous, and what is the right way to trust an internal CA?",
        resposta:
          "Because it switches off certificate verification and lets anyone pose as the server. The right way is to hand the internal CA to the client (the `ca` option, or `NODE_EXTRA_CA_CERTS`), keeping verification on.",
      },
    ],
  },
};
