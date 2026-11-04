import type { Pergunta } from "../../tipos";

// Q46 · Criptografia no Node.js
export const q46: Pergunta = {
  numero: 46,
  modulo: "turing-avancadas",
  metodo: "compare",
  pt: {
    titulo: "Criptografia no Node.js",
    pergunta: "O que é criptografia e como o Node.js a usa?",
    porqueEsteMetodo:
      "“Criptografia” reúne ferramentas que parecem parecidas e resolvem problemas diferentes. A matriz as coloca lado a lado e a regra de decisão diz qual usar para cada necessidade, que é o que a entrevista quer ouvir.",
    resposta30s:
      "**Criptografia** é o conjunto de técnicas matemáticas para proteger informação: **confidencialidade** (só quem deve consegue ler), **integridade** (detectar alteração) e **autenticidade** (saber quem enviou). O Node.js a oferece pelo módulo **`node:crypto`**, construído sobre o OpenSSL: hashes, HMAC, `scrypt` para senhas, cifras simétricas e assimétricas, assinaturas e números aleatórios seguros. O HTTPS (TLS) usa as mesmas peças. Regra de ouro: **use algoritmos padrão e chaves fora do código, nunca invente o seu**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cada ferramenta resolve um problema",
        colunas: ["Ferramenta", "Para que serve", "Usa chave?", "Reversível?", "No `node:crypto`"],
        linhas: [
          [
            "Hash (SHA-256)",
            "Impressão digital de um dado: integridade, checksums, identificar conteúdo",
            "Não",
            "Não, só de ida",
            '`createHash("sha256")`',
          ],
          [
            "HMAC",
            "Provar que quem enviou conhece o segredo e que o dado não mudou (webhooks, cookies assinados)",
            "Sim, um segredo compartilhado",
            "Não",
            "`createHmac`",
          ],
          [
            "Hash lento de senha",
            "Guardar senhas de modo que o vazamento do banco não revele a senha de ninguém",
            "Não, usa um sal aleatório",
            "Não",
            "`scrypt` (assíncrono), `randomBytes` para o sal e `timingSafeEqual` para conferir",
          ],
          [
            "Cifra simétrica (AES-GCM)",
            "Confidencialidade: esconder dados que você precisa ler de volta",
            "Sim, a mesma chave cifra e decifra",
            "Sim, com a chave",
            "`createCipheriv`, `createDecipheriv`",
          ],
          [
            "Assimétrica (RSA, Ed25519, ECDH)",
            "Assinar e verificar sem segredo compartilhado, combinar chaves, cifrar para um destinatário",
            "Sim, um par de chaves pública e privada",
            "Cifra: só com a chave privada. Assinatura: não se decifra, verifica-se com a pública",
            "`generateKeyPair`, `sign`/`verify`, `publicEncrypt`",
          ],
          [
            "Números aleatórios seguros",
            "Tokens, sais, IVs e chaves imprevisíveis",
            "Não se aplica",
            "Não se aplica",
            "`randomBytes`, `randomUUID`, `randomInt`",
          ],
        ],
        nota: "Além dessa API, as versões atuais do Node.js trazem a Web Crypto (`globalThis.crypto`, com `crypto.subtle`), a mesma interface do navegador. Confira a documentação da sua versão.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pelo que você quer proteger. Saber se o dado **mudou**: hash (ou HMAC, se for preciso provar a origem). Guardar **senha**: hash lento com sal. Esconder um dado que você precisa **recuperar**: cifra simétrica autenticada (AES-GCM). Assinar ou combinar uma chave **sem segredo compartilhado**: assimétrica. Qualquer **segredo ou token**: `randomBytes`. E nunca invente algoritmo ou protocolo: use `node:crypto` e TLS.",
      },
      {
        tipo: "codigo",
        titulo: "Hash, HMAC, aleatórios e comparação segura",
        legenda: "JavaScript",
        codigo:
          'import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";\n\n// Hash: impressão digital, sem chave e sem volta\nconst resumo = createHash("sha256").update("olá").digest("hex");\n\n// HMAC: hash com segredo, prova integridade e origem\nconst assinatura = createHmac("sha256", process.env.SEGREDO).update("corpo").digest();\n\n// Aleatórios seguros (nunca Math.random para segurança)\nconst token = randomBytes(32).toString("hex");\nconst id = randomUUID();\n\n// Compara segredos em tempo constante (Buffers do mesmo tamanho)\nconst iguais = (a, b) => a.length === b.length && timingSafeEqual(a, b);',
      },
      {
        tipo: "codigo",
        titulo: "Cifra autenticada com AES-256-GCM",
        legenda: "JavaScript",
        codigo:
          'import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";\n\nconst chave = randomBytes(32); // em produção, vem de um cofre de segredos, não do código\n\nfunction cifrar(texto) {\n  const iv = randomBytes(12); // nunca reutilize o IV com a mesma chave\n  const cifra = createCipheriv("aes-256-gcm", chave, iv);\n  const dados = Buffer.concat([cifra.update(texto, "utf8"), cifra.final()]);\n  return { iv, dados, tag: cifra.getAuthTag() }; // a tag detecta adulteração\n}\n\nfunction decifrar({ iv, dados, tag }) {\n  const decifra = createDecipheriv("aes-256-gcm", chave, iv);\n  decifra.setAuthTag(tag); // se algo foi alterado, final() lança erro\n  return Buffer.concat([decifra.update(dados), decifra.final()]).toString("utf8");\n}',
        nota: "O IV e a tag não são segredos e viajam junto com os dados; a chave, sim, é o segredo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Hash não é cifra, e senha não é dado a cifrar",
        texto:
          "Um hash não tem volta, então não “descriptografa”. Senhas não se cifram nem se guardam com SHA-256 puro (rápido demais, fácil de testar em massa): use hash lento com sal, como o `scrypt` do `node:crypto` (veja a Q20 do guia de backend, “Armazenar senhas”). `Math.random()` não serve para segredos, e MD5 e SHA-1 são considerados fracos para segurança.",
      },
    ],
    armadilhas: [
      "Chamar de “criptografar” o que é hash: senha se guarda com hash lento e sal, e SHA-256 puro é rápido demais para isso.",
      "Usar `Math.random()` para gerar tokens, ou MD5 e SHA-1 para segurança: o primeiro é previsível e os outros são considerados fracos.",
      "Reutilizar o IV (nonce) com a mesma chave no GCM, ou deixar a chave no código e no repositório.",
      "Comparar tokens e assinaturas com `===`: o tempo de resposta pode vazar informação. Use `timingSafeEqual`.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre hash e cifra?",
        resposta:
          "O hash é de mão única e não usa chave: serve para conferir integridade ou guardar senhas. A cifra é reversível com a chave: serve para esconder um dado que você precisa ler de volta.",
      },
      {
        pergunta: "Por que preferir AES-GCM a uma cifra sem autenticação?",
        resposta:
          "O GCM é uma cifra autenticada: gera uma tag que detecta alterações. Se o dado foi adulterado, o `final()` do decifrador lança erro. Modos sem autenticação não percebem a alteração.",
      },
      {
        pergunta: "Por que usar `randomBytes` e não `Math.random()` para um token?",
        resposta:
          "O `randomBytes` usa o gerador criptograficamente seguro do sistema operacional, imprevisível; o `Math.random()` não foi feito para segurança e pode ser previsto.",
      },
    ],
  },
  en: {
    titulo: "Cryptography in Node.js",
    pergunta: "What is cryptography and how does Node.js use it?",
    porqueEsteMetodo:
      "“Cryptography” bundles tools that look alike and solve different problems. The matrix puts them side by side and the decision rule says which to use for each need, which is what an interview wants to hear.",
    resposta30s:
      "**Cryptography** is the set of mathematical techniques for protecting information: **confidentiality** (only the right people can read it), **integrity** (detecting changes) and **authenticity** (knowing who sent it). Node.js provides it through the **`node:crypto`** module, built on OpenSSL: hashes, HMAC, `scrypt` for passwords, symmetric and asymmetric ciphers, signatures and secure random numbers. HTTPS (TLS) uses the same building blocks. Golden rule: **use standard algorithms and keep keys out of the code, never invent your own**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Each tool solves one problem",
        colunas: ["Tool", "What it is for", "Uses a key?", "Reversible?", "In `node:crypto`"],
        linhas: [
          [
            "Hash (SHA-256)",
            "A fingerprint of data: integrity, checksums, identifying content",
            "No",
            "No, one way only",
            '`createHash("sha256")`',
          ],
          [
            "HMAC",
            "Proving the sender knows the secret and the data did not change (webhooks, signed cookies)",
            "Yes, a shared secret",
            "No",
            "`createHmac`",
          ],
          [
            "Slow password hash",
            "Storing passwords so a database leak does not reveal anyone’s password",
            "No, it uses a random salt",
            "No",
            "`scrypt` (async), `randomBytes` for the salt and `timingSafeEqual` to check",
          ],
          [
            "Symmetric cipher (AES-GCM)",
            "Confidentiality: hiding data you need to read back",
            "Yes, the same key encrypts and decrypts",
            "Yes, with the key",
            "`createCipheriv`, `createDecipheriv`",
          ],
          [
            "Asymmetric (RSA, Ed25519, ECDH)",
            "Signing and verifying without a shared secret, agreeing on keys, encrypting for a recipient",
            "Yes, a public and private key pair",
            "Encryption: only with the private key. Signature: you do not decrypt it, you verify it with the public key",
            "`generateKeyPair`, `sign`/`verify`, `publicEncrypt`",
          ],
          [
            "Secure random numbers",
            "Unpredictable tokens, salts, IVs and keys",
            "Not applicable",
            "Not applicable",
            "`randomBytes`, `randomUUID`, `randomInt`",
          ],
        ],
        nota: "Besides this API, current Node.js versions ship the Web Crypto API (`globalThis.crypto`, with `crypto.subtle`), the same interface as the browser. Check the documentation for your version.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by what you want to protect. Knowing whether data **changed**: hash (or HMAC, if you must prove the origin). Storing a **password**: slow hash with a salt. Hiding data you must **recover**: authenticated symmetric cipher (AES-GCM). Signing or agreeing on a key **without a shared secret**: asymmetric. Any **secret or token**: `randomBytes`. And never invent an algorithm or protocol: use `node:crypto` and TLS.",
      },
      {
        tipo: "codigo",
        titulo: "Hash, HMAC, random values and safe comparison",
        legenda: "JavaScript",
        codigo:
          'import { createHash, createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";\n\n// Hash: a fingerprint, no key and no way back\nconst digest = createHash("sha256").update("hello").digest("hex");\n\n// HMAC: a hash with a secret, proves integrity and origin\nconst signature = createHmac("sha256", process.env.SECRET).update("body").digest();\n\n// Secure random values (never Math.random for security)\nconst token = randomBytes(32).toString("hex");\nconst id = randomUUID();\n\n// Compare secrets in constant time (Buffers of the same length)\nconst equal = (a, b) => a.length === b.length && timingSafeEqual(a, b);',
      },
      {
        tipo: "codigo",
        titulo: "Authenticated encryption with AES-256-GCM",
        legenda: "JavaScript",
        codigo:
          'import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";\n\nconst key = randomBytes(32); // in production, it comes from a secrets vault, not the code\n\nfunction encrypt(text) {\n  const iv = randomBytes(12); // never reuse the IV with the same key\n  const cipher = createCipheriv("aes-256-gcm", key, iv);\n  const data = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);\n  return { iv, data, tag: cipher.getAuthTag() }; // the tag detects tampering\n}\n\nfunction decrypt({ iv, data, tag }) {\n  const decipher = createDecipheriv("aes-256-gcm", key, iv);\n  decipher.setAuthTag(tag); // if anything was altered, final() throws\n  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");\n}',
        nota: "The IV and the tag are not secrets and travel with the data; the key is the secret.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A hash is not a cipher, and a password is not data to encrypt",
        texto:
          "A hash has no way back, so it cannot be “decrypted”. Passwords are neither encrypted nor stored with plain SHA-256 (too fast, easy to test in bulk): use a slow hash with a salt, such as `scrypt` from `node:crypto` (see Q20 in the backend guide, “Storing passwords”). `Math.random()` is not for secrets, and MD5 and SHA-1 are considered weak for security.",
      },
    ],
    armadilhas: [
      "Calling a hash “encryption”: passwords are stored with a slow hash and a salt, and plain SHA-256 is too fast for that.",
      "Using `Math.random()` to generate tokens, or MD5 and SHA-1 for security: the first is predictable and the others are considered weak.",
      "Reusing the IV (nonce) with the same key in GCM, or leaving the key in the code and the repository.",
      "Comparing tokens and signatures with `===`: response time can leak information. Use `timingSafeEqual`.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a hash and a cipher?",
        resposta:
          "A hash is one-way and uses no key: it checks integrity or stores passwords. A cipher is reversible with the key: it hides data you need to read back.",
      },
      {
        pergunta: "Why prefer AES-GCM over a cipher without authentication?",
        resposta:
          "GCM is an authenticated cipher: it produces a tag that detects changes. If the data was tampered with, the decipher’s `final()` throws. Modes without authentication do not notice the change.",
      },
      {
        pergunta: "Why use `randomBytes` and not `Math.random()` for a token?",
        resposta:
          "`randomBytes` uses the operating system’s cryptographically secure generator, which is unpredictable; `Math.random()` was not built for security and can be predicted.",
      },
    ],
  },
};
