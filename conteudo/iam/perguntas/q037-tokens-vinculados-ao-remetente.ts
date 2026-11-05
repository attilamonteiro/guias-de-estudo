import type { Pergunta } from "../../tipos";

// Q37 · Tokens vinculados ao remetente
export const q037: Pergunta = {
  numero: 37,
  modulo: "oauth",
  metodo: "compare",
  pt: {
    titulo: "Tokens vinculados ao remetente",
    pergunta:
      "O que são tokens vinculados ao remetente (sender-constrained)? Compare mTLS e DPoP e explique como evitam o uso de um token roubado.",
    porqueEsteMetodo:
      "mTLS e DPoP resolvem o mesmo problema por caminhos diferentes, com custos e públicos diferentes. Uma matriz lado a lado e uma regra de decisão mostram qual escolher em cada cenário.",
    resposta30s:
      "Um **bearer token** serve a **quem o apresentar**, então um token roubado funciona para o ladrão; um token **vinculado ao remetente** carrega uma ligação com uma chave (a claim `cnf`) e só é aceito se o chamador **provar que a possui**. No **mTLS** (RFC 8705) a chave é o certificado de cliente da conexão TLS; no **DPoP** (RFC 9449) é um par de chaves que assina uma prova a cada requisição. Sem a chave privada o token roubado é inútil, mas um malware que use a chave no próprio dispositivo continua sendo um risco.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "mTLS × DPoP",
        colunas: ["Aspecto", "mTLS (RFC 8705)", "DPoP (RFC 9449)"],
        linhas: [
          [
            "A que o token fica preso",
            "Ao certificado do cliente: a claim `cnf` traz `x5t#S256`, a impressão digital do certificado",
            "À chave pública do cliente: a claim `cnf` traz `jkt`, a impressão digital da chave (JWK)",
          ],
          [
            "A prova em cada chamada",
            "O handshake TLS: o cliente apresenta o certificado e prova que tem a chave privada na própria conexão",
            "Um JWT `dpop+jwt` no cabeçalho `DPoP`, assinado com a chave privada, a cada requisição",
          ],
          [
            "Onde a API verifica",
            "Compara o certificado da conexão com o `cnf` do token (o proxy ou balanceador precisa repassar o certificado)",
            "Valida a assinatura da prova, `htm` (método), `htu` (URL), `iat`, `jti` sem repetição, `ath` (hash do token) e `jkt`",
          ],
          [
            "Proteção contra repetição",
            "Vem da própria conexão TLS",
            "Do `jti` (guardado por um tempo), da janela curta de `iat` e do `nonce` fornecido pelo servidor",
          ],
          [
            "Clientes típicos",
            "Serviço a serviço, backends e ambientes de alta garantia (bancos), onde já existe uma PKI",
            "SPA, mobile e apps públicos, onde certificado de cliente é inviável",
          ],
          [
            "Custo operacional",
            "Alto: emitir, renovar e revogar certificados; terminação de TLS e proxies precisam cooperar",
            "Médio: gerar e proteger a chave no cliente, validar provas e manter o cache de `jti` na API",
          ],
          [
            "Limites",
            "Não ajuda se o malware usa o certificado instalado; certificado de vida longa vira mais um segredo",
            "Uma chave extraível, ou um script que peça assinaturas à chave, continua podendo gerar provas",
          ],
        ],
        nota: "Nos dois casos a API precisa **entender** a vinculação: uma API que ignora o `cnf` aceita o token como se fosse bearer.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece pelo que você controla. Backends e parceiros com PKI estabelecida e alta garantia (financeiro, saúde): **mTLS**. Apps públicos (SPA, mobile) ou ambientes em que certificado de cliente é inviável: **DPoP**. Perfis exigentes como o FAPI 2.0 (veja Q38) aceitam um dos dois. Para SPA de alto risco, o BFF (veja Q41) tira o token do navegador e costuma ser mais simples. Para risco baixo, bearer de vida curta e guardado com cuidado pode bastar. E lembre: a RFC 9700 pede, para o refresh token de client público, vínculo ao remetente **ou** rotação (veja Q34).",
      },
      {
        tipo: "codigo",
        titulo: "Uma chamada com DPoP",
        legenda: "HTTP",
        codigo: `GET /orders HTTP/1.1
Host: api.example.com
Authorization: DPoP <access token cujo cnf.jkt é a impressão digital da chave>
DPoP: <JWT assinado com a chave privada do cliente>

(prova ausente, antiga ou assinada por outra chave)
HTTP/1.1 401 Unauthorized
WWW-Authenticate: DPoP error="invalid_dpop_proof"`,
        nota: "O esquema `DPoP` no `Authorization` avisa à API que o token exige prova. Com um token roubado e sem a chave privada, o atacante não consegue montar o segundo cabeçalho.",
      },
      {
        tipo: "codigo",
        titulo: "A prova DPoP e o token, decodificados",
        legenda: "JSON",
        codigo: `{
  "dpop_proof_header": { "typ": "dpop+jwt", "alg": "ES256", "jwk": { "kty": "EC", "crv": "P-256", "x": "...", "y": "..." } },
  "dpop_proof_payload": {
    "jti": "e1j3V_bKic8-LAEB",
    "htm": "GET",
    "htu": "https://api.example.com/orders",
    "iat": 1767225600,
    "ath": "<hash do access token>"
  },
  "access_token_payload": { "aud": "https://api.example.com", "cnf": { "jkt": "<hash da chave do jwk acima>" } }
}`,
        nota: "A API confere que o `jkt` do token bate com a chave do `jwk` da prova, que a prova é para este método, esta URL e este token (`ath`), e que o `jti` não foi usado antes.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é escudo contra malware no próprio dispositivo",
        texto:
          "O vínculo impede **usar o token em outro lugar**. Não impede que um malware (ou um script injetado) no próprio dispositivo peça à chave para assinar provas novas, nem protege se a chave privada for extraída. Chaves não extraíveis (WebCrypto no navegador, enclave seguro no celular, HSM no servidor) encarecem o ataque, e a vida curta do token e o BFF reduzem a janela. E o mecanismo só funciona se a API valida: confira a vinculação em todas as APIs que aceitam o token.",
      },
    ],
    armadilhas: [
      "Tratar o token vinculado como segredo mais forte e relaxar o resto (armazenamento, logs, vida longa): ele reduz o dano de um vazamento, não o elimina.",
      "Implementar DPoP no cliente e esquecer de verificar `htm`, `htu`, `ath`, `iat` e `jti` na API: a prova de posse vira cerimônia e o *replay* continua.",
      "Usar mTLS atrás de um proxy ou balanceador que termina o TLS sem repassar o certificado: a API não tem o que comparar com o `cnf`.",
      "Guardar a chave privada do DPoP em local extraível (por exemplo, um JWK no `localStorage`): quem rouba o token rouba também a chave.",
    ],
    autoteste: [
      {
        pergunta: "Como o DPoP torna inútil um token roubado?",
        resposta:
          "O token nasce preso à chave pública do cliente (`cnf.jkt`), e cada chamada exige uma prova assinada com a chave privada, ligada ao método, à URL e ao token. Quem roubou só o token não tem a chave para assinar a prova, e uma prova antiga copiada falha pelo `jti`, pelo `iat` ou pelo `ath`.",
      },
      {
        pergunta: "Quando escolher mTLS em vez de DPoP?",
        resposta:
          "Quando os clientes são backends ou parceiros com PKI e certificado de cliente já fazem parte da operação, como no financeiro. Para SPA e mobile, em que emitir e proteger certificado é inviável, o DPoP costuma ser a opção.",
      },
    ],
  },
  en: {
    titulo: "Sender-constrained tokens",
    pergunta:
      "What are sender-constrained tokens? Compare mTLS and DPoP and explain how they prevent the use of a stolen token.",
    porqueEsteMetodo:
      "mTLS and DPoP solve the same problem by different paths, with different costs and audiences. A side-by-side matrix and a decision rule show which to pick in each scenario.",
    resposta30s:
      "A **bearer token** works for **whoever presents it**, so a stolen token works for the thief; a **sender-constrained** token carries a link to a key (the `cnf` claim) and is only accepted if the caller can **prove it holds that key**. In **mTLS** (RFC 8705) the key is the client certificate of the TLS connection; in **DPoP** (RFC 9449) it is a key pair that signs a proof on every request. Without the private key a stolen token is useless, but malware that uses the key on the device itself remains a risk.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "mTLS vs DPoP",
        colunas: ["Aspect", "mTLS (RFC 8705)", "DPoP (RFC 9449)"],
        linhas: [
          [
            "What the token is bound to",
            "The client certificate: the `cnf` claim carries `x5t#S256`, the certificate’s thumbprint",
            "The client’s public key: the `cnf` claim carries `jkt`, the key’s (JWK) thumbprint",
          ],
          [
            "The proof on each call",
            "The TLS handshake: the client presents the certificate and proves it holds the private key on the connection itself",
            "A `dpop+jwt` JWT in the `DPoP` header, signed with the private key, on every request",
          ],
          [
            "Where the API checks",
            "Compares the connection’s certificate with the token’s `cnf` (the proxy or load balancer has to pass the certificate on)",
            "Validates the proof’s signature, `htm` (method), `htu` (URL), `iat`, a non-repeated `jti`, `ath` (token hash) and `jkt`",
          ],
          [
            "Replay protection",
            "Comes from the TLS connection itself",
            "From the `jti` (remembered for a while), the short `iat` window and the server-provided `nonce`",
          ],
          [
            "Typical clients",
            "Service to service, backends and high-assurance environments (banks), where a PKI already exists",
            "SPAs, mobile and public apps, where a client certificate is impractical",
          ],
          [
            "Operational cost",
            "High: issuing, renewing and revoking certificates; TLS termination and proxies must cooperate",
            "Medium: generating and protecting the key on the client, validating proofs and keeping a `jti` cache on the API",
          ],
          [
            "Limits",
            "Does not help if malware uses the installed certificate; a long-lived certificate is one more secret",
            "An extractable key, or a script that asks the key for signatures, can still produce proofs",
          ],
        ],
        nota: "In both cases the API has to **understand** the binding: an API that ignores `cnf` accepts the token as if it were a bearer.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start from what you control. Backends and partners with an established PKI and high assurance needs (finance, healthcare): **mTLS**. Public apps (SPA, mobile) or environments where a client certificate is impractical: **DPoP**. Demanding profiles such as FAPI 2.0 (see Q38) accept either. For a high-risk SPA, the BFF (see Q41) takes the token out of the browser and is often simpler. For low risk, a short-lived, carefully stored bearer may be enough. And remember: RFC 9700 asks, for a public client’s refresh token, for sender-constraining **or** rotation (see Q34).",
      },
      {
        tipo: "codigo",
        titulo: "A call with DPoP",
        legenda: "HTTP",
        codigo: `GET /orders HTTP/1.1
Host: api.example.com
Authorization: DPoP <access token whose cnf.jkt is the key thumbprint>
DPoP: <JWT signed with the client's private key>

(proof missing, old or signed by another key)
HTTP/1.1 401 Unauthorized
WWW-Authenticate: DPoP error="invalid_dpop_proof"`,
        nota: "The `DPoP` scheme in `Authorization` tells the API the token requires proof. With a stolen token and no private key, the attacker cannot build the second header.",
      },
      {
        tipo: "codigo",
        titulo: "The DPoP proof and the token, decoded",
        legenda: "JSON",
        codigo: `{
  "dpop_proof_header": { "typ": "dpop+jwt", "alg": "ES256", "jwk": { "kty": "EC", "crv": "P-256", "x": "...", "y": "..." } },
  "dpop_proof_payload": {
    "jti": "e1j3V_bKic8-LAEB",
    "htm": "GET",
    "htu": "https://api.example.com/orders",
    "iat": 1767225600,
    "ath": "<hash of the access token>"
  },
  "access_token_payload": { "aud": "https://api.example.com", "cnf": { "jkt": "<thumbprint of the jwk key above>" } }
}`,
        nota: "The API checks that the token’s `jkt` matches the key in the proof’s `jwk`, that the proof is for this method, this URL and this token (`ath`), and that the `jti` has not been used before.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Not a shield against malware on the device itself",
        texto:
          "The binding prevents **using the token somewhere else**. It does not stop malware (or an injected script) on the device itself from asking the key to sign new proofs, and it does not protect you if the private key is extracted. Non-extractable keys (WebCrypto in the browser, a secure enclave on the phone, an HSM on the server) raise the attacker’s cost, and short token lifetimes and the BFF shrink the window. And the mechanism only works if the API validates: check the binding on every API that accepts the token.",
      },
    ],
    armadilhas: [
      "Treating a sender-constrained token as a stronger secret and relaxing everything else (storage, logs, long lifetime): it reduces the damage of a leak, it does not remove it.",
      "Implementing DPoP on the client and forgetting to check `htm`, `htu`, `ath`, `iat` and `jti` on the API: proof of possession becomes ceremony and replay continues.",
      "Using mTLS behind a proxy or load balancer that terminates TLS without forwarding the certificate: the API has nothing to compare with `cnf`.",
      "Keeping the DPoP private key somewhere extractable (for example, a JWK in `localStorage`): whoever steals the token steals the key too.",
    ],
    autoteste: [
      {
        pergunta: "How does DPoP make a stolen token useless?",
        resposta:
          "The token is born bound to the client’s public key (`cnf.jkt`), and every call requires a proof signed with the private key, tied to the method, the URL and the token. Whoever stole only the token has no key to sign the proof, and an old proof that was copied fails on the `jti`, the `iat` or the `ath`.",
      },
      {
        pergunta: "When should you choose mTLS over DPoP?",
        resposta:
          "When the clients are backends or partners with a PKI, where client certificates are already part of operations, as in finance. For SPAs and mobile, where issuing and protecting certificates is impractical, DPoP is usually the option.",
      },
    ],
  },
};
