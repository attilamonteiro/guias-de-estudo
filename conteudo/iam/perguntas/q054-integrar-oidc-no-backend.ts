import type { Pergunta } from "../../tipos";

// Q54 · Integrar OIDC no backend
export const q054: Pergunta = {
  numero: 54,
  modulo: "oidc",
  metodo: "design",
  pt: {
    titulo: "Integrar OIDC no backend",
    pergunta:
      "Como você integraria login OIDC em uma aplicação web e em uma API em .NET ou Node.js? Compare o handler com cookie de sessão e a validação de bearer token na API.",
    porqueEsteMetodo:
      "“Como você integraria…” é uma pergunta de projeto. O roteiro de design (requisitos, arquitetura, configuração, claims, autorização e ciclo de vida) evita esquecer pedaços e mostra o raciocínio que a banca quer ouvir.",
    resposta30s:
      "Separe os dois papéis: a **aplicação web** é um **RP** que faz o login com authorization code + PKCE e entrega ao navegador um **cookie de sessão** (no ASP.NET Core, `AddCookie` + `AddOpenIdConnect`; em Node.js, `openid-client` ou o SDK do IdP), enquanto a **API** é um **servidor de recursos** que valida o **bearer token** em cada requisição (`AddJwtBearer`; `jose` em Node.js) e nunca redireciona. Configure `authority`, `client_id`, escopos e `redirect_uri` exata, mapeie as claims para o principal, aplique políticas de autorização e trate expiração e logout. O ID token é do cliente; a API aceita o access token com a sua própria audience.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "Requisitos: quem entra e por onde",
            texto:
              "Separe dois consumidores. A aplicação web atende **uma pessoa num navegador** (login interativo, sessão, logout). A API atende **chamadas sem navegador** (outro serviço, um app móvel, um front-end que já tem token) e só precisa saber se o token é válido e o que ele permite. Levante também: IdPs aceitos, MFA, quais papéis a aplicação precisa enxergar, tempo de sessão e como o logout deve se propagar.",
          },
          {
            titulo: "Arquitetura",
            texto:
              "A aplicação web é o **RP** (cliente OIDC) com o fluxo **authorization code + PKCE**: guarda os tokens no servidor e entrega ao navegador só um **cookie de sessão** `HttpOnly`, `Secure` e `SameSite`. A API é o **servidor de recursos**: valida o JWT bearer a cada requisição e nunca redireciona. Quando a web chama a API, anexa o access token no servidor. Numa SPA, o desenho mais seguro é um BFF (back-end for front-end) que faz o papel de RP, de modo que o JavaScript do navegador nunca veja o token.",
          },
          {
            titulo: "Configuração",
            texto:
              "`authority` (o `issuer`, que habilita descoberta e JWKS, veja Q45), `client_id`, segredo ou certificado em cofre (nunca no código), `redirect_uri` registrada com correspondência exata, `post_logout_redirect_uri`, escopos mínimos (`openid`, `profile` e os da API) e, na API, a `audience` esperada. Tudo por ambiente e só com HTTPS.",
          },
          {
            titulo: "Mapeamento de claims para o principal",
            texto:
              "O middleware transforma as claims no usuário da aplicação (o `ClaimsPrincipal` no .NET, um objeto de usuário no Node.js). Identifique a pessoa por `iss` + `sub` (veja Q52), leia nome e papéis, converta as claims do IdP em papéis da aplicação e use `email` só com `email_verified`. Mantenha o cookie pequeno: o que for grande fica no servidor.",
          },
          {
            titulo: "Políticas de autorização",
            texto:
              "Defina políticas nomeadas (papel, escopo, claim, propriedade do recurso) e aplique-as nas rotas: `[Authorize(Policy = ...)]` no ASP.NET Core, um middleware de escopos no Node.js. Responda **401** quando falta credencial válida e **403** quando a pessoa é conhecida mas não pode. A API autoriza pelo **access token**, nunca pelo ID token.",
          },
          {
            titulo: "Expiração, renovação e logout",
            texto:
              "O cookie tem expiração própria; o access token é curto e é renovado no servidor com o refresh token, que fica no servidor e nunca no navegador. A API só recebe tokens válidos e responde 401 quando expiram. No logout, apague o cookie e chame o `end_session_endpoint` (veja Q49), de preferência propagando por back-channel. Teste relógio, expiração e rotação de chaves.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Cookie de sessão × bearer token",
        colunas: ["Aspecto", "Web com cookie (handler OIDC)", "API com bearer token"],
        linhas: [
          [
            "Papel",
            "Cliente (RP) que atende uma pessoa no navegador",
            "Servidor de recursos; sem usuário nem navegador",
          ],
          [
            "Credencial a cada requisição",
            "Cookie de sessão (`HttpOnly`, `Secure`, `SameSite`), emitido depois do callback",
            "`Authorization: Bearer <access token>` em toda requisição",
          ],
          [
            "O que valida",
            "O ID token, uma vez, no callback; depois, só o cookie",
            "O access token em cada requisição: assinatura (JWKS), `iss`, `aud`, `exp` e escopos",
          ],
          [
            "Quando falta credencial",
            "Redireciona (302) ao IdP para entrar",
            "Responde `401` (ou `403`); nunca redireciona",
          ],
          [
            "Estado e revogação",
            "Sessão no servidor ou cookie protegido; o logout encerra de verdade",
            "Sem estado: o token vale até expirar; vida curta e, se preciso, introspecção",
          ],
          [
            "Ameaças típicas",
            "CSRF (o cookie vai sozinho), fixação de sessão, `redirect_uri` frouxo",
            "Roubo de token, `aud` ou `iss` errados, token de outro tenant",
          ],
          ["ASP.NET Core", "`AddCookie` + `AddOpenIdConnect`", "`AddJwtBearer` (ou `Microsoft.Identity.Web`)"],
          [
            "Node.js",
            "`openid-client`, `express-openid-connect`, Auth.js, Passport com sessão",
            "`jose` (`jwtVerify` e `createRemoteJWKSet`), `express-oauth2-jwt-bearer`, `passport-jwt`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Aplicação web: cookie de sessão + OpenID Connect",
        legenda: "C#",
        codigo: `builder.Services
    .AddAuthentication(o =>
    {
        o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        o.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie(o =>
    {
        o.Cookie.HttpOnly = true;
        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        o.ExpireTimeSpan = TimeSpan.FromMinutes(30);
        o.SlidingExpiration = true;
    })
    .AddOpenIdConnect(o =>
    {
        o.Authority = "https://id.example.com";    // descoberta e JWKS
        o.ClientId = "minha-web";
        o.ClientSecret = builder.Configuration["Oidc:Secret"]; // cofre, não código
        o.ResponseType = "code";                   // authorization code
        o.UsePkce = true;
        o.GetClaimsFromUserInfoEndpoint = true;
    });`,
        nota: "Na API do mesmo projeto, o equivalente é `AddJwtBearer` com `Authority` e `Audience`: o token vem no cabeçalho, não no cookie. O `UsePkce` costuma ser verdadeiro por padrão; está explícito só para mostrar a intenção.",
      },
      {
        tipo: "codigo",
        titulo: "API em Node.js: validar o bearer token",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";

const issuer = "https://id.example.com";
const jwks = createRemoteJWKSet(new URL(issuer + "/jwks.json")); // o jwks_uri vem da descoberta (Q45)

export async function exigirToken(req: Request, res: Response, next: NextFunction) {
  const [esquema, token] = (req.headers.authorization ?? "").split(" ");
  if (esquema !== "Bearer" || !token) return res.status(401).set("WWW-Authenticate", "Bearer").end();
  try {
    const opcoes = { issuer, audience: "minha-api", algorithms: ["RS256"] };
    const { payload } = await jwtVerify(token, jwks, opcoes);
    const escopos = String(payload.scope ?? "").split(" ");
    if (!escopos.includes("pedidos:ler")) return res.status(403).end();
    res.locals.usuario = { sub: payload.sub, escopos };
    next();
  } catch {
    res.status(401).set("WWW-Authenticate", 'Bearer error="invalid_token"').end();
  }
}`,
        nota: "Um exemplo mínimo: o nome do escopo e a claim `scope` variam entre IdPs (alguns usam `scp`). Use a biblioteca do seu IdP ou a política de autorização do framework quando houver.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Tem **uma pessoa num navegador**? A aplicação é o RP e usa **cookie de sessão** (handler OIDC). Recebe **chamadas de máquina, de um app móvel ou de um front-end que já tem token**? A API **valida o bearer**. Numa SPA, prefira um BFF que faça o papel de RP, para o token não chegar ao JavaScript. Em qualquer caso, **o ID token é do cliente e o access token é da API**, e valem as mesmas regras de validação (assinatura, `iss`, `aud`, `exp`; veja Q48).",
      },
    ],
    armadilhas: [
      "Usar o ID token como credencial para chamar a API: ele é endereçado ao cliente, e a API deve aceitar o access token emitido para a sua própria audience.",
      "Guardar tokens no `localStorage` de uma SPA, ou pôr tokens grandes no cookie: um XSS lê o primeiro, e o segundo estoura limites de cabeçalho. Prefira guardar no servidor (BFF).",
      "Emitir o cookie de sessão sem `HttpOnly`, `Secure` e `SameSite`, e sem proteção contra CSRF nas ações de escrita.",
      "Desligar a validação de audience ou usar só `decode` para “fazer funcionar”: a API passa a aceitar tokens de qualquer aplicação do mesmo IdP. Também não confunda 401 (sem credencial válida) com 403 (sem permissão).",
    ],
    autoteste: [
      {
        pergunta: "Por que a API não deve redirecionar para a tela de login?",
        resposta:
          "Porque quem chama é uma máquina ou um app, não uma pessoa num navegador. A API responde 401 (com `WWW-Authenticate`) e o cliente obtém um token no IdP; um redirecionamento quebraria esses clientes.",
      },
      {
        pergunta: "O que acontece quando o access token expira numa aplicação web com cookie?",
        resposta:
          "O cookie e o access token têm vidas independentes. O servidor da aplicação renova o access token com o refresh token (que ele guarda), sem a pessoa perceber; se o refresh também expirou ou foi revogado, a sessão termina e a pessoa entra de novo.",
      },
    ],
  },
  en: {
    titulo: "Integrating OIDC in the backend",
    pergunta:
      "How would you integrate OIDC login into a web application and an API in .NET or Node.js? Compare the cookie-based handler with bearer token validation in the API.",
    porqueEsteMetodo:
      "“How would you integrate…” is a design question. The design script (requirements, architecture, configuration, claims, authorization and lifecycle) keeps you from forgetting pieces and shows the reasoning the panel wants to hear.",
    resposta30s:
      "Separate the two roles: the **web application** is an **RP** that logs in with authorization code + PKCE and hands the browser a **session cookie** (in ASP.NET Core, `AddCookie` + `AddOpenIdConnect`; in Node.js, `openid-client` or the IdP’s SDK), while the **API** is a **resource server** that validates the **bearer token** on every request (`AddJwtBearer`; `jose` in Node.js) and never redirects. Configure `authority`, `client_id`, scopes and an exact `redirect_uri`, map the claims to the principal, apply authorization policies and handle expiry and logout. The ID token belongs to the client; the API accepts the access token with its own audience.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "Requirements: who comes in and through where",
            texto:
              "Separate two consumers. The web application serves **a person in a browser** (interactive login, session, logout). The API serves **calls with no browser** (another service, a mobile app, a front end that already has a token) and only needs to know whether the token is valid and what it allows. Also gather: accepted IdPs, MFA, which roles the application needs to see, session length and how logout should propagate.",
          },
          {
            titulo: "Architecture",
            texto:
              "The web application is the **RP** (OIDC client) using the **authorization code + PKCE** flow: it keeps the tokens on the server and gives the browser only a **session cookie** that is `HttpOnly`, `Secure` and `SameSite`. The API is the **resource server**: it validates the bearer JWT on every request and never redirects. When the web app calls the API, it attaches the access token on the server. For an SPA, the safest design is a BFF (back-end for front-end) that plays the RP role, so the browser’s JavaScript never sees the token.",
          },
          {
            titulo: "Configuration",
            texto:
              "`authority` (the `issuer`, which enables discovery and the JWKS, see Q45), `client_id`, a secret or certificate in a vault (never in code), a registered `redirect_uri` with exact matching, `post_logout_redirect_uri`, minimal scopes (`openid`, `profile` and the API’s own) and, in the API, the expected `audience`. All per environment and HTTPS only.",
          },
          {
            titulo: "Mapping claims to the principal",
            texto:
              "The middleware turns the claims into the application’s user (the `ClaimsPrincipal` in .NET, a user object in Node.js). Identify the person by `iss` + `sub` (see Q52), read the name and roles, convert the IdP’s claims into application roles and use `email` only with `email_verified`. Keep the cookie small: anything large stays on the server.",
          },
          {
            titulo: "Authorization policies",
            texto:
              "Define named policies (role, scope, claim, resource ownership) and apply them to routes: `[Authorize(Policy = ...)]` in ASP.NET Core, a scope middleware in Node.js. Answer **401** when there is no valid credential and **403** when the person is known but not allowed. The API authorizes by the **access token**, never by the ID token.",
          },
          {
            titulo: "Expiry, renewal and logout",
            texto:
              "The cookie has its own expiry; the access token is short-lived and renewed on the server with the refresh token, which stays on the server and never in the browser. The API only receives valid tokens and answers 401 when they expire. On logout, clear the cookie and call the `end_session_endpoint` (see Q49), preferably propagating through back-channel. Test clocks, expiry and key rotation.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Session cookie × bearer token",
        colunas: ["Aspect", "Web with cookie (OIDC handler)", "API with bearer token"],
        linhas: [
          ["Role", "Client (RP) serving a person in a browser", "Resource server; no user and no browser"],
          [
            "Credential on each request",
            "Session cookie (`HttpOnly`, `Secure`, `SameSite`), issued after the callback",
            "`Authorization: Bearer <access token>` on every request",
          ],
          [
            "What it validates",
            "The ID token, once, in the callback; afterwards, only the cookie",
            "The access token on every request: signature (JWKS), `iss`, `aud`, `exp` and scopes",
          ],
          [
            "When the credential is missing",
            "Redirects (302) to the IdP to sign in",
            "Answers `401` (or `403`); never redirects",
          ],
          [
            "State and revocation",
            "Server-side session or protected cookie; logout really ends it",
            "Stateless: the token lives until it expires; short lifetime and, if needed, introspection",
          ],
          [
            "Typical threats",
            "CSRF (the cookie goes along by itself), session fixation, a loose `redirect_uri`",
            "Token theft, wrong `aud` or `iss`, a token from another tenant",
          ],
          ["ASP.NET Core", "`AddCookie` + `AddOpenIdConnect`", "`AddJwtBearer` (or `Microsoft.Identity.Web`)"],
          [
            "Node.js",
            "`openid-client`, `express-openid-connect`, Auth.js, Passport with a session",
            "`jose` (`jwtVerify` and `createRemoteJWKSet`), `express-oauth2-jwt-bearer`, `passport-jwt`",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Web application: session cookie + OpenID Connect",
        legenda: "C#",
        codigo: `builder.Services
    .AddAuthentication(o =>
    {
        o.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        o.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
    })
    .AddCookie(o =>
    {
        o.Cookie.HttpOnly = true;
        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        o.ExpireTimeSpan = TimeSpan.FromMinutes(30);
        o.SlidingExpiration = true;
    })
    .AddOpenIdConnect(o =>
    {
        o.Authority = "https://id.example.com";    // discovery and JWKS
        o.ClientId = "my-web";
        o.ClientSecret = builder.Configuration["Oidc:Secret"]; // vault, not code
        o.ResponseType = "code";                   // authorization code
        o.UsePkce = true;
        o.GetClaimsFromUserInfoEndpoint = true;
    });`,
        nota: "In the same project’s API, the equivalent is `AddJwtBearer` with `Authority` and `Audience`: the token comes in the header, not in the cookie. `UsePkce` is usually true by default; it is explicit only to show the intent.",
      },
      {
        tipo: "codigo",
        titulo: "Node.js API: validating the bearer token",
        legenda: "TypeScript",
        codigo: `import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";

const issuer = "https://id.example.com";
const jwks = createRemoteJWKSet(new URL(issuer + "/jwks.json")); // the jwks_uri comes from discovery (Q45)

export async function requireToken(req: Request, res: Response, next: NextFunction) {
  const [scheme, token] = (req.headers.authorization ?? "").split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).set("WWW-Authenticate", "Bearer").end();
  try {
    const options = { issuer, audience: "my-api", algorithms: ["RS256"] };
    const { payload } = await jwtVerify(token, jwks, options);
    const scopes = String(payload.scope ?? "").split(" ");
    if (!scopes.includes("orders:read")) return res.status(403).end();
    res.locals.user = { sub: payload.sub, scopes };
    next();
  } catch {
    res.status(401).set("WWW-Authenticate", 'Bearer error="invalid_token"').end();
  }
}`,
        nota: "A minimal example: the scope name and the `scope` claim vary between IdPs (some use `scp`). Use your IdP’s library or the framework’s authorization policy when one exists.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Is there **a person in a browser**? The application is the RP and uses a **session cookie** (OIDC handler). Does it receive **machine calls, a mobile app or a front end that already has a token**? The API **validates the bearer**. For an SPA, prefer a BFF that plays the RP role, so the token never reaches JavaScript. Either way, **the ID token belongs to the client and the access token to the API**, and the same validation rules apply (signature, `iss`, `aud`, `exp`; see Q48).",
      },
    ],
    armadilhas: [
      "Using the ID token as the credential to call the API: it is addressed to the client, and the API must accept the access token issued for its own audience.",
      "Storing tokens in an SPA’s `localStorage`, or putting large tokens in the cookie: an XSS reads the first, and the second blows past header limits. Prefer keeping them on the server (BFF).",
      "Issuing the session cookie without `HttpOnly`, `Secure` and `SameSite`, and without CSRF protection on write actions.",
      "Turning off audience validation or using only `decode` to “make it work”: the API then accepts tokens from any application of the same IdP. Also do not confuse 401 (no valid credential) with 403 (no permission).",
    ],
    autoteste: [
      {
        pergunta: "Why should the API not redirect to the login page?",
        resposta:
          "Because the caller is a machine or an app, not a person in a browser. The API answers 401 (with `WWW-Authenticate`) and the client obtains a token from the IdP; a redirect would break those clients.",
      },
      {
        pergunta: "What happens when the access token expires in a web application with a cookie?",
        resposta:
          "The cookie and the access token have independent lifetimes. The application server renews the access token with the refresh token (which it keeps), without the person noticing; if the refresh token also expired or was revoked, the session ends and the person signs in again.",
      },
    ],
  },
};
