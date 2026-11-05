import type { Pergunta } from "../../tipos";

// Q74 · Token opaco × JWT
export const q074: Pergunta = {
  numero: 74,
  modulo: "tokens-e-sessoes",
  metodo: "compare",
  pt: {
    titulo: "Token opaco × JWT",
    pergunta:
      "Compare tokens de acesso opacos e JWTs. Quais as vantagens e desvantagens de cada um em latência, revogação, privacidade e acoplamento?",
    porqueEsteMetodo:
      "A escolha entre token opaco e JWT é uma troca entre custo de validação, controle da revogação, privacidade e acoplamento. Uma matriz critério a critério deixa essas trocas visíveis, e a regra de decisão diz quando cada lado ganha.",
    resposta30s:
      "O **token opaco** é uma referência aleatória: só o emissor sabe o que ela significa, a API precisa **consultá-lo (introspecção)**, a **revogação é imediata** e o cliente não vê claims. O **JWT** é autocontido e assinado: a API valida **localmente**, sem chamar o emissor, mas ele vale até expirar e expõe as claims a quem o carrega. Use **JWT de vida curta** em APIs de alto volume e **opaco** quando a revogação imediata ou a privacidade importam; um access token **nem sempre é um JWT**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Opaco × JWT, critério a critério",
        colunas: ["Critério", "Token opaco (referência)", "JWT (autocontido)"],
        linhas: [
          [
            "Validação e latência",
            "A API consulta o emissor (introspecção, RFC 7662) ou um cache próprio: uma chamada de rede por validação, a menos que haja cache",
            "Local: verifica a assinatura com a chave pública em cache, sem chamada de rede por requisição",
          ],
          [
            "Revogação",
            "Imediata: o emissor marca o token como inativo e a próxima introspecção responde `active: false`",
            "Só ao expirar, a menos que se acrescente estado (lista de `jti`, introspecção em ações sensíveis); a vida curta limita a janela (veja Q77)",
          ],
          [
            "Tamanho",
            "Pequeno e fixo: uma cadeia aleatória",
            "Cresce com as claims e vai em todo cabeçalho `Authorization`",
          ],
          [
            "Privacidade",
            "O cliente e quem intercepta o token não veem dados; o conteúdo fica no emissor",
            "As claims são legíveis por quem carrega o token (veja Q69); um JWE esconde, a custo maior (veja Q70)",
          ],
          [
            "Acoplamento",
            "As APIs dependem do endpoint de introspecção e da disponibilidade dele; o formato interno pode mudar livremente",
            "As APIs dependem do formato das claims e do JWKS do emissor, mas não da disponibilidade dele a cada requisição",
          ],
          [
            "Emissor fora do ar",
            "Se a introspecção cai, as APIs não validam (a menos que haja cache e uma política de falha)",
            "Continua validando com o JWKS em cache enquanto o emissor está fora",
          ],
          [
            "Escala e custo",
            "A introspecção concentra carga no emissor; gateways com cache aliviam",
            "Escala horizontalmente: a verificação é barata e distribuída",
          ],
          [
            "Depuração",
            "É preciso consultar o emissor para ver o que o token diz",
            "Dá para decodificar (para depurar), o que também facilita vazar dado em log",
          ],
        ],
        nota: "Um híbrido comum: o gateway de borda recebe o token **opaco** do cliente, faz a introspecção e repassa aos serviços internos um **JWT** curto (o padrão do “token fantasma”, ou phantom token). Assim o cliente não vê claims, e os serviços validam localmente.",
      },
      {
        tipo: "codigo",
        titulo: "Introspecção de um token opaco (RFC 7662)",
        legenda: "HTTP",
        codigo: `POST /oauth2/introspect HTTP/1.1
Host: id.exemplo.com
Authorization: Basic <credenciais da API>
Content-Type: application/x-www-form-urlencoded

token=Zk3q9TnW1xPq7Lb0&token_type_hint=access_token

HTTP/1.1 200 OK
Content-Type: application/json

{ "active": true, "scope": "pedidos:ler", "client_id": "app-web", "sub": "usr_8f3a1c", "exp": 1793000900 }`,
        nota: "Para um token revogado ou expirado, a resposta é só `active: false`. A API precisa se autenticar no endpoint de introspecção. Um cache de poucos segundos reduz a carga, mas aumenta a janela de revogação na mesma medida.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**JWT curto para APIs de alto volume; opaco quando a revogação imediata ou a privacidade mandam.** Muitos serviços validando muitas requisições e aceitando uma janela de revogação de minutos: JWT de vida curta. Revogação imediata exigida (conta comprometida, desligamento, dados regulados), cliente que não deve ver claims, ou um único gateway que pode centralizar a validação: opaco com introspecção e cache curto. Precisa dos dois: opaco na borda e JWT por dentro. Em qualquer caso, **o cliente trata o access token como opaco**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O access token ser JWT não obriga o cliente a lê-lo",
        texto:
          "O OAuth 2.0 não define o formato do access token: ele é para a API (o servidor de recursos), não para o cliente. Um cliente que decodifica o token para ler `scope` ou `exp` quebra no dia em que o emissor muda de formato (de JWT para opaco ou JWE) ou passa a emitir tokens que não foram feitos para ele; alguns provedores emitem tokens de APIs próprias que o seu aplicativo não deve decodificar. O cliente deve usar o que a resposta do endpoint de token informa (`expires_in`, `scope`) e tratar o token como uma cadeia. Quem é JWT **por especificação** é o **ID token** do OpenID Connect, que é para o cliente (veja Q43). Para access tokens em JWT, há um perfil padronizado (RFC 9068).",
      },
    ],
    armadilhas: [
      "Dizer que “token de acesso é JWT”: é uma escolha do emissor, não uma regra do OAuth.",
      "Escolher JWT “para não ter estado” e depois precisar de revogação imediata, lista de bloqueio e consulta ao emissor: o estado voltou, com mais complexidade.",
      "Cachear a introspecção por minutos ou horas e chamar isso de revogação imediata.",
      "Pôr dados pessoais em claims de um JWT que o navegador ou o aplicativo móvel guardam e podem exibir ou registrar em log.",
    ],
    autoteste: [
      {
        pergunta: "Como se revoga um token opaco e como se revoga um JWT?",
        resposta:
          "O opaco é revogado no emissor, e a próxima introspecção já o rejeita. O JWT vale até o `exp`; para revogar antes é preciso acrescentar estado (lista de `jti`, introspecção) ou depender de vida curta.",
      },
      {
        pergunta: "Por que o cliente não deve decodificar o access token mesmo quando ele é um JWT?",
        resposta:
          "Porque o access token é destinado à API, e o formato é escolha do emissor, que pode mudar para opaco ou JWE sem aviso. O cliente deve usar o `expires_in` e o `scope` da resposta do endpoint de token.",
      },
    ],
  },
  en: {
    titulo: "Opaque token vs JWT",
    pergunta:
      "Compare opaque access tokens and JWTs. What are the pros and cons of each in latency, revocation, privacy and coupling?",
    porqueEsteMetodo:
      "The choice between an opaque token and a JWT is a trade-off among validation cost, control over revocation, privacy and coupling. A criterion-by-criterion matrix makes those trade-offs visible, and the decision rule says when each side wins.",
    resposta30s:
      "An **opaque token** is a random reference: only the issuer knows what it means, the API must **ask the issuer (introspection)**, **revocation is immediate** and the client sees no claims. A **JWT** is self-contained and signed: the API validates it **locally**, without calling the issuer, but it stays valid until it expires and exposes its claims to whoever carries it. Use **short-lived JWTs** for high-volume APIs and **opaque** tokens when immediate revocation or privacy matter; an access token is **not always a JWT**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Opaque vs JWT, criterion by criterion",
        colunas: ["Criterion", "Opaque token (reference)", "JWT (self-contained)"],
        linhas: [
          [
            "Validation and latency",
            "The API asks the issuer (introspection, RFC 7662) or its own cache: one network call per validation, unless cached",
            "Local: verifies the signature with the cached public key, no network call per request",
          ],
          [
            "Revocation",
            "Immediate: the issuer marks the token inactive and the next introspection answers `active: false`",
            "Only at expiry, unless state is added (a list of `jti`, introspection on sensitive actions); a short lifetime limits the window (see Q77)",
          ],
          [
            "Size",
            "Small and fixed: a random string",
            "Grows with the claims and goes in every `Authorization` header",
          ],
          [
            "Privacy",
            "The client and anyone intercepting the token see no data; the content stays at the issuer",
            "The claims are readable by whoever carries the token (see Q69); a JWE hides them, at a higher cost (see Q70)",
          ],
          [
            "Coupling",
            "APIs depend on the introspection endpoint and its availability; the internal format can change freely",
            "APIs depend on the format of the claims and on the issuer’s JWKS, but not on its availability on every request",
          ],
          [
            "Issuer down",
            "If introspection is down, the APIs cannot validate (unless there is a cache and a failure policy)",
            "Keeps validating with the cached JWKS while the issuer is out",
          ],
          [
            "Scale and cost",
            "Introspection concentrates load on the issuer; gateways with a cache relieve it",
            "Scales horizontally: verification is cheap and distributed",
          ],
          [
            "Debugging",
            "You must ask the issuer to see what the token says",
            "It can be decoded (for debugging), which also makes it easy to leak data into logs",
          ],
        ],
        nota: "A common hybrid: the edge gateway receives the client’s **opaque** token, introspects it and forwards a short **JWT** to the internal services (the “phantom token” pattern). The client sees no claims, and the services validate locally.",
      },
      {
        tipo: "codigo",
        titulo: "Introspecting an opaque token (RFC 7662)",
        legenda: "HTTP",
        codigo: `POST /oauth2/introspect HTTP/1.1
Host: id.example.com
Authorization: Basic <API credentials>
Content-Type: application/x-www-form-urlencoded

token=Zk3q9TnW1xPq7Lb0&token_type_hint=access_token

HTTP/1.1 200 OK
Content-Type: application/json

{ "active": true, "scope": "orders:read", "client_id": "web-app", "sub": "usr_8f3a1c", "exp": 1793000900 }`,
        nota: "For a revoked or expired token, the response is just `active: false`. The API must authenticate to the introspection endpoint. A cache of a few seconds reduces load but widens the revocation window by the same amount.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Short-lived JWTs for high-volume APIs; opaque when immediate revocation or privacy rule.** Many services validating many requests and accepting a revocation window of minutes: a short-lived JWT. Immediate revocation required (compromised account, offboarding, regulated data), a client that must not see claims, or a single gateway that can centralize validation: opaque with introspection and a short cache. Need both: opaque at the edge and JWT inside. In any case, **the client treats the access token as opaque**.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "An access token being a JWT does not oblige the client to read it",
        texto:
          "OAuth 2.0 does not define the access token format: it is meant for the API (the resource server), not for the client. A client that decodes the token to read `scope` or `exp` breaks the day the issuer changes format (from JWT to opaque or JWE) or starts issuing tokens that were not made for it; some providers issue tokens for their own APIs that your application must not decode. The client should use what the token endpoint’s response reports (`expires_in`, `scope`) and treat the token as a string. What is a JWT **by specification** is the OpenID Connect **ID token**, which is for the client (see Q43). For access tokens in JWT form, there is a standardized profile (RFC 9068).",
      },
    ],
    armadilhas: [
      "Saying “an access token is a JWT”: it is the issuer’s choice, not an OAuth rule.",
      "Choosing JWT “to avoid state” and later needing immediate revocation, a blocklist and calls to the issuer: the state is back, with more complexity.",
      "Caching introspection for minutes or hours and calling that immediate revocation.",
      "Putting personal data in the claims of a JWT that the browser or the mobile app stores and may display or log.",
    ],
    autoteste: [
      {
        pergunta: "How is an opaque token revoked, and how is a JWT revoked?",
        resposta:
          "The opaque token is revoked at the issuer, and the next introspection already rejects it. The JWT is valid until `exp`; to revoke earlier you must add state (a list of `jti`, introspection) or rely on a short lifetime.",
      },
      {
        pergunta: "Why should the client not decode the access token even when it is a JWT?",
        resposta:
          "Because the access token is meant for the API, and the format is the issuer’s choice, which may change to opaque or JWE without notice. The client should use the `expires_in` and `scope` from the token endpoint’s response.",
      },
    ],
  },
};
