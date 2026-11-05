import type { Pergunta } from "../../tipos";

// Q40 · Proteger uma API com tokens
export const q040: Pergunta = {
  numero: 40,
  modulo: "oauth",
  metodo: "design",
  pt: {
    titulo: "Proteger uma API com tokens",
    pergunta:
      "Como você protege uma API com tokens OAuth 2.0 e OpenID Connect? O que a API deve validar, onde fica o authorization server e como as chaves chegam à API?",
    porqueEsteMetodo:
      "É uma pergunta de projeto: quem emite, o que a API confere, de onde vêm as chaves e o que acontece quando algo falha. Um roteiro fixo evita esquecer uma peça e mostra cada decisão com seu motivo.",
    resposta30s:
      "Um **authorization server** (IdP ou STS) emite os tokens, e a API é só o **resource server**: a cada requisição ela valida o JWT localmente (**assinatura com algoritmo fixo, `iss`, `aud`, `exp`**) usando as chaves públicas do **JWKS**, que busca e guarda em cache. Depois autoriza por **escopo** e por **dono do recurso** e responde `401` (token ausente ou inválido) ou `403` (sem permissão) com `WWW-Authenticate`. Se a revogação imediata importa, use tokens opacos ou introspecção seletiva.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: quem chama a API (aplicativo web, mobile, outros serviços), em nome de quem (um usuário ou o próprio serviço) e com quais permissões. Não funcionais: validação rápida, API de pé mesmo se o authorization server cair, revogação e auditoria, e proteção em camadas, no espírito de Zero Trust (NIST SP 800-207): não confiar na rede e autenticar e autorizar cada requisição.",
          },
          {
            titulo: "2. Quem emite e em que formato",
            texto:
              "Um authorization server separado da API emite os tokens: um provedor gerenciado (Entra ID, Okta, Auth0, Keycloak; confira a documentação do fornecedor) ou um STS próprio. A API é só **resource server**: não emite tokens nem guarda senha. O formato padrão é **JWT** (autocontido, validado localmente); use token **opaco** com introspecção (veja Q35) quando a revogação imediata é requisito.",
          },
          {
            titulo: "3. Descoberta e chaves",
            texto:
              "A API descobre o emissor e as chaves por metadados (`/.well-known/openid-configuration` ou o metadata do RFC 8414) e baixa as chaves públicas do **JWKS**. Configure o `issuer` e a URL do JWKS **na API**, e nunca confie em `jku`, `jwk` ou `x5u` vindos do cabeçalho do token. Guarde o JWKS em cache e, ao ver um `kid` desconhecido, busque de novo (com intervalo mínimo entre buscas) para acompanhar a rotação de chaves. A comunicação da API com o authorization server (JWKS, introspecção) vai por TLS, e a introspecção exige que a API se autentique.",
          },
          {
            titulo: "4. Validação em cada requisição",
            texto:
              "Extraia o token do cabeçalho `Authorization: Bearer`; confira a assinatura com **algoritmo fixo**, o `iss`, o `aud` (esta API), `exp` e `nbf` (com tolerância pequena de relógio) e, se o emissor segue o perfil de access token em JWT, o `typ`. Só então leia `sub` e escopos. Um ID token **não** é credencial de API (veja Q43).",
          },
          {
            titulo: "5. Autorização e erros",
            texto:
              'O escopo diz o que o token **pode pedir** (`orders:read`); o recurso diz **o que esta pessoa pode ver** (o pedido é dela? é do mesmo tenant?). Exija o escopo por rota e confira a posse por objeto no código. Token ausente ou inválido: `401` com `WWW-Authenticate: Bearer` (e `error="invalid_token"` quando havia token). Token válido sem permissão: `403`, com `insufficient_scope` e o escopo necessário (RFC 6750).',
          },
          {
            titulo: "6. Operação e gargalos",
            texto:
              "Meça a taxa de `401` e `403` por motivo, a latência da validação e os erros de JWKS; registre `sub`, `client_id`, `jti` e a decisão, nunca o token. Gargalos: a busca do JWKS (cache com validade e tolerância a falha), a introspecção (cache de segundos), relógios desalinhados (NTP e tolerância) e tokens grandes demais para os limites de cabeçalho. No gateway, valide o básico (assinatura, `aud`, `exp`); no serviço, repita e decida a autorização fina: defesa em camadas.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "O que a API valida e o que responde quando falha",
        colunas: ["Verificação", "O que impede", "Resposta quando falha"],
        linhas: [
          [
            "Assinatura, com algoritmo fixo",
            "Token forjado ou com `alg` trocado (`none`, confusão entre HS e RS)",
            "`401` com `invalid_token`",
          ],
          ["`iss` igual ao emissor configurado", "Token de outro authorization server", "`401` com `invalid_token`"],
          ["`aud` contém esta API", "Replay de um token feito para outra API", "`401` com `invalid_token`"],
          [
            "`exp` e `nbf`",
            "Token vencido ou ainda não válido",
            "`401` com `invalid_token` (o cliente renova; veja Q34)",
          ],
          [
            "Escopo exigido pela rota",
            "Token legítimo pedindo mais do que foi consentido",
            "`403` com `insufficient_scope`",
          ],
          [
            "Posse do recurso (`sub`, tenant)",
            "Acesso a dado de outra pessoa (BOLA/IDOR)",
            "`403` ou `404`, sem revelar que o objeto existe",
          ],
        ],
        nota: "Registre o motivo exato da falha nos logs, mas devolva ao cliente só o código padronizado.",
      },
      {
        tipo: "codigo",
        titulo: "Middleware de validação com jose",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";
const issuer = "https://auth.example.com"; // vem da configuração, não do token
const jwks = createRemoteJWKSet(new URL("/.well-known/jwks.json", issuer)); // cache e rotação de kid
export async function exigeToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return res.set("WWW-Authenticate", "Bearer").status(401).end();
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: "https://api.example.com", // esta API
      algorithms: ["RS256"], // fixo: nunca confie no alg do cabeçalho
      clockTolerance: 30, // segundos de tolerância de relógio
    });
    res.locals.auth = payload; // sub, scope, client_id...
    next();
  } catch {
    res.set("WWW-Authenticate", 'Bearer error="invalid_token"').status(401).end();
  }
}`,
        nota: "O escopo é checado depois, por rota. Em muitos provedores `scope` é uma string separada por espaços; em outros a claim se chama `scp`. Em produção, use o `jwks_uri` do metadata do emissor.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Por padrão a API **valida sozinha** (JWT mais JWKS em cache): é rápido e não depende do authorization server em tempo de execução. Acrescente **introspecção** só onde a revogação imediata é requisito. O authorization server fica **fora** do caminho de cada chamada; a API o contata apenas para buscar chaves e, se for o caso, introspectar. Autenticação (quem é) e autorização (o que pode) são etapas separadas: o token prova a primeira e carrega o ponto de partida da segunda.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O papel de cada protocolo e os erros de desenho mais comuns",
        texto:
          "O OAuth autoriza o acesso à API; o OpenID Connect diz ao cliente quem é o usuário. A API trabalha com **access tokens**, nunca com ID tokens. Não aceite tokens de qualquer emissor ou `aud`, não confie no `alg` do cabeçalho e não ponha dados sensíveis no token: ele é apenas codificado, passa por muitos lugares e fica enorme. Prefira escopos mínimos, vida curta, HTTPS em todo o caminho e, em alto risco, tokens vinculados ao remetente (veja Q37).",
      },
    ],
    armadilhas: [
      "Validar só a assinatura: um token legítimo emitido para outra API ou por outro emissor passa. Confira `iss`, `aud` e `exp`.",
      "Aceitar o `alg` que vem no cabeçalho do token, ou baixar a chave de uma URL indicada pelo próprio token: o atacante escolhe a regra.",
      "Baixar o JWKS a cada requisição, ou nunca atualizá-lo: no primeiro caso a latência explode, no segundo a rotação de chaves derruba a API.",
      "Decidir a autorização só pelo escopo, sem conferir o dono do objeto: o token é válido, mas o dado é de outro usuário.",
    ],
    autoteste: [
      {
        pergunta: "Quais são as verificações mínimas que uma API faz num JWT?",
        resposta:
          "Assinatura com algoritmo fixo e a chave certa (pelo `kid`, do JWKS), `iss` igual ao emissor esperado, `aud` contendo a própria API, e `exp` e `nbf` válidos. Depois, escopo por rota e posse do recurso.",
      },
      {
        pergunta: "Qual a diferença entre `401` e `403` numa API protegida por OAuth?",
        resposta:
          "`401` significa que a API não sabe quem chama: o token faltou ou é inválido, e a resposta traz `WWW-Authenticate`. `403` significa que o token é válido, mas não autoriza aquela ação (falta de escopo ou de permissão sobre o recurso).",
      },
    ],
  },
  en: {
    titulo: "Protecting an API with tokens",
    pergunta:
      "How do you protect an API with OAuth 2.0 and OpenID Connect tokens? What must the API validate, where does the authorization server sit, and how do the keys reach the API?",
    porqueEsteMetodo:
      "This is a design question: who issues, what the API checks, where the keys come from and what happens when something fails. A fixed script avoids forgetting a piece and shows each decision with its reason.",
    resposta30s:
      "An **authorization server** (IdP or STS) issues the tokens, and the API is just the **resource server**: on every request it validates the JWT locally (**signature with a fixed algorithm, `iss`, `aud`, `exp`**) using the public keys from the **JWKS**, which it fetches and caches. Then it authorizes by **scope** and by **resource owner** and answers `401` (missing or invalid token) or `403` (no permission) with `WWW-Authenticate`. If immediate revocation matters, use opaque tokens or selective introspection.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: who calls the API (web app, mobile, other services), on whose behalf (a user or the service itself) and with which permissions. Non-functional: fast validation, an API that stays up even if the authorization server goes down, revocation and auditing, and layered protection in the spirit of Zero Trust (NIST SP 800-207): do not trust the network, and authenticate and authorize every request.",
          },
          {
            titulo: "2. Who issues, and in which format",
            texto:
              "An authorization server separate from the API issues the tokens: a managed provider (Entra ID, Okta, Auth0, Keycloak; check the vendor’s documentation) or an in-house STS. The API is just the **resource server**: it neither issues tokens nor stores passwords. The default format is **JWT** (self-contained, validated locally); use an **opaque** token with introspection (see Q35) when immediate revocation is a requirement.",
          },
          {
            titulo: "3. Discovery and keys",
            texto:
              "The API discovers the issuer and the keys through metadata (`/.well-known/openid-configuration` or the RFC 8414 metadata) and downloads the public keys from the **JWKS**. Configure the `issuer` and the JWKS URL **on the API**, and never trust `jku`, `jwk` or `x5u` coming from the token’s header. Cache the JWKS and, on seeing an unknown `kid`, fetch again (with a minimum interval between fetches) to follow key rotation. The API’s communication with the authorization server (JWKS, introspection) goes over TLS, and introspection requires the API to authenticate.",
          },
          {
            titulo: "4. Validation on every request",
            texto:
              "Extract the token from the `Authorization: Bearer` header; check the signature with a **fixed algorithm**, the `iss`, the `aud` (this API), `exp` and `nbf` (with a small clock tolerance) and, if the issuer follows the JWT access token profile, the `typ`. Only then read `sub` and scopes. An ID token is **not** an API credential (see Q43).",
          },
          {
            titulo: "5. Authorization and errors",
            texto:
              'The scope says what the token **may ask for** (`orders:read`); the resource says **what this person may see** (is the order theirs? is it in the same tenant?). Require the scope per route and check ownership per object in code. Missing or invalid token: `401` with `WWW-Authenticate: Bearer` (and `error="invalid_token"` when a token was sent). Valid token without permission: `403`, with `insufficient_scope` and the required scope (RFC 6750).',
          },
          {
            titulo: "6. Operations and bottlenecks",
            texto:
              "Measure the `401` and `403` rate by reason, validation latency and JWKS errors; log `sub`, `client_id`, `jti` and the decision, never the token. Bottlenecks: the JWKS fetch (cache with an expiry and failure tolerance), introspection (a cache of seconds), skewed clocks (NTP and tolerance) and tokens too big for header limits. At the gateway, validate the basics (signature, `aud`, `exp`); in the service, repeat them and decide fine-grained authorization: defense in depth.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "What the API validates and what it answers on failure",
        colunas: ["Check", "What it prevents", "Response on failure"],
        linhas: [
          [
            "Signature, with a fixed algorithm",
            "A forged token or one with a swapped `alg` (`none`, HS/RS confusion)",
            "`401` with `invalid_token`",
          ],
          [
            "`iss` equal to the configured issuer",
            "A token from another authorization server",
            "`401` with `invalid_token`",
          ],
          ["`aud` contains this API", "Replay of a token made for another API", "`401` with `invalid_token`"],
          [
            "`exp` and `nbf`",
            "An expired or not-yet-valid token",
            "`401` with `invalid_token` (the client renews; see Q34)",
          ],
          [
            "Scope required by the route",
            "A legitimate token asking for more than was consented to",
            "`403` with `insufficient_scope`",
          ],
          [
            "Resource ownership (`sub`, tenant)",
            "Access to another person’s data (BOLA/IDOR)",
            "`403` or `404`, without revealing that the object exists",
          ],
        ],
        nota: "Log the exact reason for the failure, but return only the standardized code to the client.",
      },
      {
        tipo: "codigo",
        titulo: "Validation middleware with jose",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";
const issuer = "https://auth.example.com"; // comes from configuration, not from the token
const jwks = createRemoteJWKSet(new URL("/.well-known/jwks.json", issuer)); // caching and kid rotation
export async function requireToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];
  if (!token) return res.set("WWW-Authenticate", "Bearer").status(401).end();
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: "https://api.example.com", // this API
      algorithms: ["RS256"], // fixed: never trust the header's alg
      clockTolerance: 30, // seconds of clock tolerance
    });
    res.locals.auth = payload; // sub, scope, client_id...
    next();
  } catch {
    res.set("WWW-Authenticate", 'Bearer error="invalid_token"').status(401).end();
  }
}`,
        nota: "Scope is checked afterwards, per route. At many providers `scope` is a space-separated string; at others the claim is called `scp`. In production, use the `jwks_uri` from the issuer’s metadata.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "By default the API **validates on its own** (JWT plus a cached JWKS): it is fast and does not depend on the authorization server at run time. Add **introspection** only where immediate revocation is a requirement. The authorization server stays **out** of the path of every call; the API contacts it only to fetch keys and, if needed, to introspect. Authentication (who you are) and authorization (what you may do) are separate steps: the token proves the first and carries the starting point for the second.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Each protocol’s role and the most common design mistakes",
        texto:
          "OAuth authorizes access to the API; OpenID Connect tells the client who the user is. The API works with **access tokens**, never with ID tokens. Do not accept tokens from any issuer or `aud`, do not trust the header’s `alg` and do not put sensitive data in the token: it is merely encoded, passes through many places and grows huge. Prefer minimal scopes, short lifetimes, HTTPS along the whole path and, for high risk, sender-constrained tokens (see Q37).",
      },
    ],
    armadilhas: [
      "Validating only the signature: a legitimate token issued for another API or by another issuer gets through. Check `iss`, `aud` and `exp`.",
      "Accepting the `alg` from the token’s header, or downloading the key from a URL named by the token itself: the attacker picks the rule.",
      "Downloading the JWKS on every request, or never refreshing it: in the first case latency explodes, in the second key rotation takes the API down.",
      "Deciding authorization by scope alone, without checking who owns the object: the token is valid, but the data belongs to another user.",
    ],
    autoteste: [
      {
        pergunta: "What are the minimum checks an API makes on a JWT?",
        resposta:
          "Signature with a fixed algorithm and the right key (by `kid`, from the JWKS), `iss` equal to the expected issuer, `aud` containing the API itself, and valid `exp` and `nbf`. Then scope per route and resource ownership.",
      },
      {
        pergunta: "What is the difference between `401` and `403` on an API protected by OAuth?",
        resposta:
          "`401` means the API does not know who is calling: the token is missing or invalid, and the response carries `WWW-Authenticate`. `403` means the token is valid but does not authorize that action (missing scope or no permission on the resource).",
      },
    ],
  },
};
