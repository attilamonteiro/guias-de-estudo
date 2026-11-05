import type { Pergunta } from "../../tipos";

// Q35 · Introspecção e revogação
export const q035: Pergunta = {
  numero: 35,
  modulo: "oauth",
  metodo: "feynman",
  pt: {
    titulo: "Introspecção e revogação",
    pergunta:
      "Como funcionam a introspecção (RFC 7662) e a revogação (RFC 7009) de tokens no OAuth 2.0? Quando uma API deve introspectar em vez de validar o token localmente?",
    porqueEsteMetodo:
      "Introspecção e revogação respondem a uma pergunta de confiança (“este token ainda vale?”) que fica mais clara com uma imagem do dia a dia; depois vêm os endpoints reais e o ponto em que a imagem para de valer.",
    resposta30s:
      "A **introspecção** (RFC 7662) deixa a API perguntar ao authorization server se um token ainda vale: ela envia o token ao endpoint, autenticando-se, e recebe `active` (verdadeiro ou falso) com as claims. A **revogação** (RFC 7009) deixa o cliente invalidar um token de que não precisa mais. Um **JWT** pode ser validado localmente, sem rede, mas não percebe uma revogação antes de expirar; por isso introspecte tokens **opacos** e, com JWT de vida curta, só as **operações sensíveis**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine uma casa de shows. O ingresso em papel tem selo holográfico e data impressa: o porteiro olha o selo e a data, sem ligar para ninguém. Se a bilheteria cancela um ingresso (houve reembolso), o porteiro que só confere o selo continua deixando a pessoa entrar até a data impressa vencer. O outro jeito é o porteiro ligar para a bilheteria a cada entrada e perguntar “este ingresso ainda vale?”: é seguro, mas cada ligação demora e a bilheteria precisa estar de pé.",
        tecnico:
          "O ingresso com selo é o **JWT** validado localmente (assinatura, `iss`, `aud`, `exp`): rápido e sem dependência, mas “cego” a revogações. A ligação é a **introspecção** (RFC 7662): a API faz um `POST` ao endpoint de introspecção do authorization server, autentica-se com as credenciais do resource server e recebe um JSON com `active` e, se o token estiver ativo, claims como `scope`, `client_id`, `sub`, `exp` e `aud`. A bilheteria cancelando o ingresso é a **revogação** (RFC 7009): o cliente envia o token (com `token_type_hint`, uma dica opcional) ao endpoint de revogação e o servidor o invalida. Revogar um refresh token deve invalidar também os access tokens da mesma concessão, e o servidor responde `200` até para um token desconhecido, para não virar um oráculo.",
        limite:
          "A imagem não mostra o custo de cada ligação (latência e dependência do servidor, que se resolvem com cache curto) nem a autenticação do chamador: sem ela, qualquer um poderia sondar tokens alheios. Também não mostra que o token opaco só existe como registro no servidor, e por isso a introspecção não é opcional para ele.",
      },
      {
        tipo: "tabela",
        titulo: "Validar localmente × introspectar",
        colunas: ["Critério", "Validação local (JWT)", "Introspecção (RFC 7662)"],
        linhas: [
          [
            "Como funciona",
            "A API confere assinatura, `iss`, `aud` e `exp` com as chaves públicas em cache (JWKS)",
            "A API envia o token ao authorization server e lê `active` e as claims",
          ],
          ["Formato do token", "JWT (autocontido)", "Opaco (referência) ou JWT"],
          [
            "Latência e disponibilidade",
            "Sem chamada de rede por requisição; funciona mesmo com o servidor fora do ar",
            "Um round trip por verificação; o servidor passa a ser dependência crítica",
          ],
          [
            "Revogação",
            "Só tem efeito quando o token expira (ou com uma lista de bloqueio por `jti`)",
            "Imediata: a resposta já vem `active: false`",
          ],
          ["Cache", "Cache das chaves (JWKS)", "Cache da resposta por poucos segundos, nunca além do `exp`"],
          [
            "Quando preferir",
            "Leitura comum, alto volume, tokens de vida curta",
            "Tokens opacos, operações sensíveis, revogação em tempo real",
          ],
        ],
        nota: "Existe também uma extensão em que a resposta da introspecção vem assinada, como JWT; veja a especificação correspondente.",
      },
      {
        tipo: "codigo",
        titulo: "Introspecção e revogação em HTTP",
        legenda: "HTTP",
        codigo: `POST /oauth2/introspect HTTP/1.1
Authorization: Basic <credenciais do resource server>
Content-Type: application/x-www-form-urlencoded

token=AT123&token_type_hint=access_token

HTTP/1.1 200 OK
{ "active": true, "scope": "orders:read", "client_id": "spa-web", "sub": "u-42", "aud": "https://api.example.com", "exp": 1767226200 }

(token expirado, revogado ou desconhecido)
HTTP/1.1 200 OK
{ "active": false }

POST /oauth2/revoke HTTP/1.1
Authorization: Basic <credenciais do client>
Content-Type: application/x-www-form-urlencoded

token=RT456&token_type_hint=refresh_token

HTTP/1.1 200 OK`,
        nota: "Os dois endpoints exigem que o chamador se autentique. A resposta `active: false` não explica o motivo, de propósito.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Quando introspectar, e como combinar",
        texto:
          "**Introspecte** quando o token é **opaco**, quando a revogação precisa valer **na hora** (pagamento, troca de senha, mudança de permissões, dados muito sensíveis) ou quando o estado mora no servidor e o token não o carrega. **Valide localmente** nos demais casos. O desenho mais usado combina os dois: JWT de **expiração curta** (minutos) na maioria das chamadas e introspecção **seletiva** nas operações sensíveis, com cache de poucos segundos. Revogar acesso, na prática, é em camadas: revogar o refresh token ou a concessão, encerrar a sessão no provedor de identidade, desativar o usuário ou o client e deixar o access token curto expirar (veja Q77).",
      },
    ],
    armadilhas: [
      "Expor a introspecção sem autenticar o chamador (ou com credenciais fracas): o endpoint vira um oráculo para sondar tokens de outras pessoas.",
      "Introspectar em toda requisição, sem cache: a latência e a carga do authorization server crescem com o tráfego da API, e uma queda dele derruba todas as APIs.",
      "Cachear `active: true` além do `exp` do token, ou por muito tempo: a revogação deixa de valer justamente quando mais importa.",
      "Achar que revogar o refresh token derruba na hora todos os access tokens JWT: as APIs que só validam localmente continuam aceitando cada um deles até o `exp`.",
    ],
    autoteste: [
      {
        pergunta: "O que traz a resposta da introspecção e o que significa `active: false`?",
        resposta:
          "O campo `active` é obrigatório; se for verdadeiro, vêm claims como `scope`, `client_id`, `sub`, `exp` e `aud`. `active: false` vale para qualquer motivo (expirado, revogado, desconhecido) e não deve revelar mais nada.",
      },
      {
        pergunta: "Como combinar JWT de vida curta com introspecção?",
        resposta:
          "Valide localmente nas chamadas comuns e introspecte só nas operações sensíveis, com cache de poucos segundos. Assim a maior parte do tráfego não depende do servidor, e as ações de maior risco enxergam revogações na hora.",
      },
    ],
  },
  en: {
    titulo: "Introspection and revocation",
    pergunta:
      "How do token introspection (RFC 7662) and token revocation (RFC 7009) work in OAuth 2.0? When should an API introspect instead of validating the token locally?",
    porqueEsteMetodo:
      "Introspection and revocation answer a question of trust (“is this token still good?”) that gets clearer with an everyday image; then come the real endpoints and the point where the image stops holding.",
    resposta30s:
      "**Introspection** (RFC 7662) lets an API ask the authorization server whether a token is still good: it sends the token to the endpoint, authenticating itself, and gets back `active` (true or false) with the claims. **Revocation** (RFC 7009) lets a client invalidate a token it no longer needs. A **JWT** can be validated locally, with no network call, but it does not notice a revocation before it expires; so introspect **opaque** tokens and, with short-lived JWTs, only the **sensitive operations**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Picture a concert hall. The paper ticket has a holographic seal and a printed date: the doorman looks at the seal and the date, without calling anyone. If the box office cancels a ticket (a refund), the doorman who only checks the seal keeps letting the person in until the printed date passes. The other way is for the doorman to phone the box office at every entry and ask “is this ticket still good?”: it is safe, but each call takes time and the box office has to be up.",
        tecnico:
          "The ticket with the seal is the **JWT** validated locally (signature, `iss`, `aud`, `exp`): fast and dependency-free, but “blind” to revocations. The phone call is **introspection** (RFC 7662): the API sends a `POST` to the authorization server’s introspection endpoint, authenticates with the resource server’s credentials and gets back JSON with `active` and, if the token is active, claims such as `scope`, `client_id`, `sub`, `exp` and `aud`. The box office cancelling the ticket is **revocation** (RFC 7009): the client sends the token (with `token_type_hint`, an optional hint) to the revocation endpoint and the server invalidates it. Revoking a refresh token should also invalidate the access tokens from the same grant, and the server answers `200` even for an unknown token, so it does not become an oracle.",
        limite:
          "The image does not show the cost of each call (latency and dependence on the server, which short caching mitigates) or the caller’s authentication: without it, anyone could probe other people’s tokens. It also does not show that an opaque token exists only as a record on the server, which is why introspection is not optional for it.",
      },
      {
        tipo: "tabela",
        titulo: "Validate locally vs introspect",
        colunas: ["Criterion", "Local validation (JWT)", "Introspection (RFC 7662)"],
        linhas: [
          [
            "How it works",
            "The API checks signature, `iss`, `aud` and `exp` with cached public keys (JWKS)",
            "The API sends the token to the authorization server and reads `active` and the claims",
          ],
          ["Token format", "JWT (self-contained)", "Opaque (reference) or JWT"],
          [
            "Latency and availability",
            "No network call per request; works even if the server is down",
            "One round trip per check; the server becomes a critical dependency",
          ],
          [
            "Revocation",
            "Only takes effect when the token expires (or with a `jti` denylist)",
            "Immediate: the response already says `active: false`",
          ],
          ["Caching", "Cache the keys (JWKS)", "Cache the response for a few seconds, never beyond `exp`"],
          [
            "When to prefer it",
            "Ordinary reads, high volume, short-lived tokens",
            "Opaque tokens, sensitive operations, real-time revocation",
          ],
        ],
        nota: "There is also an extension in which the introspection response comes signed, as a JWT; see the corresponding specification.",
      },
      {
        tipo: "codigo",
        titulo: "Introspection and revocation over HTTP",
        legenda: "HTTP",
        codigo: `POST /oauth2/introspect HTTP/1.1
Authorization: Basic <resource server credentials>
Content-Type: application/x-www-form-urlencoded

token=AT123&token_type_hint=access_token

HTTP/1.1 200 OK
{ "active": true, "scope": "orders:read", "client_id": "spa-web", "sub": "u-42", "aud": "https://api.example.com", "exp": 1767226200 }

(expired, revoked or unknown token)
HTTP/1.1 200 OK
{ "active": false }

POST /oauth2/revoke HTTP/1.1
Authorization: Basic <client credentials>
Content-Type: application/x-www-form-urlencoded

token=RT456&token_type_hint=refresh_token

HTTP/1.1 200 OK`,
        nota: "Both endpoints require the caller to authenticate. The `active: false` response does not give the reason, on purpose.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "When to introspect, and how to combine",
        texto:
          "**Introspect** when the token is **opaque**, when revocation must take effect **immediately** (payments, password change, permission change, highly sensitive data) or when the state lives on the server and the token does not carry it. **Validate locally** in the other cases. The most common design combines both: JWTs with **short expiry** (minutes) on most calls and **selective** introspection on sensitive operations, with a cache of a few seconds. In practice, revoking access is layered: revoke the refresh token or the grant, end the session at the identity provider, disable the user or the client and let the short access token expire (see Q77).",
      },
    ],
    armadilhas: [
      "Exposing introspection without authenticating the caller (or with weak credentials): the endpoint becomes an oracle for probing other people’s tokens.",
      "Introspecting on every request with no cache: the authorization server’s latency and load grow with API traffic, and an outage takes down every API.",
      "Caching `active: true` beyond the token’s `exp`, or for too long: revocation stops working exactly when it matters most.",
      "Assuming that revoking the refresh token instantly kills every JWT access token: APIs that only validate locally keep accepting each one until `exp`.",
    ],
    autoteste: [
      {
        pergunta: "What does the introspection response contain and what does `active: false` mean?",
        resposta:
          "The `active` field is required; if true, claims such as `scope`, `client_id`, `sub`, `exp` and `aud` follow. `active: false` covers any reason (expired, revoked, unknown) and should not reveal anything more.",
      },
      {
        pergunta: "How do you combine short-lived JWTs with introspection?",
        resposta:
          "Validate locally on ordinary calls and introspect only on sensitive operations, with a cache of a few seconds. Most traffic then does not depend on the server, and the highest-risk actions see revocations immediately.",
      },
    ],
  },
};
