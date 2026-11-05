import type { Pergunta } from "../../tipos";

// Q24 · OAuth × OpenID Connect
export const q024: Pergunta = {
  numero: 24,
  modulo: "oauth",
  metodo: "compare",
  pt: {
    titulo: "OAuth × OpenID Connect",
    pergunta:
      "O OAuth 2.0 é um protocolo de autenticação? Compare OAuth 2.0 e OpenID Connect: o que cada um resolve e o que acontece quando alguém usa o access token como prova de login.",
    porqueEsteMetodo:
      "Os dois nomes aparecem juntos em todo login moderno, e confundi-los está na origem de falhas reais. Uma matriz lado a lado mostra o que cada um resolve, e a regra de decisão diz quando usar um, o outro ou os dois.",
    resposta30s:
      "**Não: o OAuth 2.0 é um framework de autorização delegada.** O access token diz que um client pode chamar uma API, não **quem** fez login nem **para quem** o token foi emitido. O **OpenID Connect (OIDC)** é a camada de identidade em cima dele (escopo `openid`, **ID token**, UserInfo, `nonce`): use-o para saber quem entrou, use o access token para chamar APIs e use os dois juntos num login com acesso a API.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O que cada um resolve",
        colunas: ["Aspecto", "OAuth 2.0", "OpenID Connect"],
        linhas: [
          [
            "Pergunta que responde",
            "“Este aplicativo pode acessar este recurso em nome do usuário?”",
            "“Quem é o usuário, e como e quando ele se autenticou?”",
          ],
          [
            "Natureza",
            "Framework de autorização delegada (RFC 6749)",
            "Camada de identidade sobre o OAuth 2.0 (OpenID Connect Core)",
          ],
          [
            "Token principal",
            "Access token: opaco para o client e destinado ao resource server; o OAuth não define o formato",
            "ID token: sempre um JWT assinado, destinado ao client (`aud` é o `client_id`)",
          ],
          ["Quem lê o token", "A API (resource server)", "O aplicativo que fez o login (relying party)"],
          [
            "Escopos",
            "Definidos pela API (por exemplo `faturas.read`)",
            "`openid` (obrigatório), `profile`, `email`, `address`, `phone`, `offline_access`",
          ],
          [
            "Endpoints e metadados",
            "`authorize` e `token`",
            "Os mesmos, mais UserInfo, discovery (`/.well-known/openid-configuration`) e JWKS",
          ],
          [
            "Proteções próprias",
            "`state`, PKCE, `redirect_uri` exata",
            "Tudo isso, mais o `nonce` e a validação do ID token (assinatura, `iss`, `aud`, `exp`, `nonce`)",
          ],
          [
            "Resultado para o aplicativo",
            "Acesso a uma API",
            "Uma sessão de login com identidade verificada (`iss` + `sub`)",
          ],
        ],
        nota: "O discovery e o JWKS são tratados em Q45, os claims e escopos padrão em Q46 e o `nonce` em Q47.",
      },
      {
        tipo: "codigo",
        titulo: "Dois tokens do mesmo login: para quem é cada um",
        legenda: "JSON",
        codigo: [
          "{",
          '  "id_token": {',
          '    "iss": "https://auth.exemplo.com",',
          '    "sub": "248289761001",',
          '    "aud": "app-web-123",',
          '    "nonce": "n-0S6_WzA2Mj",',
          '    "exp": 1767225600,',
          '    "iat": 1767222000',
          "  },",
          '  "access_token": {',
          '    "iss": "https://auth.exemplo.com",',
          '    "sub": "248289761001",',
          '    "aud": "https://api.exemplo.com",',
          '    "scope": "faturas.read",',
          '    "client_id": "app-web-123",',
          '    "exp": 1767222900',
          "  }",
          "}",
        ].join("\n"),
        nota: "Dois conjuntos de claims lado a lado. O ID token é destinado ao aplicativo (`aud` é o `client_id` dele) e carrega o `nonce`. O access token é destinado à API (`aud` é a API). Aqui o access token aparece como JWT só para mostrar a diferença: para o client ele é opaco (a RFC 9068 define um perfil JWT para access tokens, mas nem todo servidor o usa).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Precisa **saber quem é o usuário** (login, SSO)? Use **OIDC**: peça `openid`, valide o ID token e use `iss` + `sub` como identificador. Precisa **chamar uma API** em nome dele? Use o **access token** do OAuth, que quem lê é a API. Precisa dos dois? Peça `openid` e os escopos da API no mesmo fluxo: o ID token fica com o aplicativo e o access token vai à API. Nunca envie o ID token à API como credencial e nunca use o access token para decidir quem fez login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Access token como prova de login",
        texto:
          "O access token **não diz quem logou nem para quem foi emitido**. O ataque clássico (token substitution) funciona assim: um aplicativo malicioso obtém o access token de uma vítima; o atacante o apresenta a **outro** aplicativo que faz “login com OAuth” apenas perguntando ao provedor “este token é válido, e de quem é?”. O provedor responde que sim, e o segundo aplicativo abre a sessão da vítima para o atacante. O token era válido, mas tinha sido emitido para o primeiro aplicativo, não para este. O ID token fecha a brecha: o `aud` é o seu `client_id` e o `nonce` prende o token ao login em curso. Mesmo com OIDC, valide assinatura, `iss`, `aud`, `exp` e `nonce`, e, se usar o UserInfo, confira que o `sub` é o mesmo do ID token.",
      },
    ],
    armadilhas: [
      "Implementar “login com OAuth” lendo o perfil com o access token e tratando isso como autenticação: sem um ID token validado não há prova de login nem de que o token era para o seu aplicativo.",
      "Decodificar o access token no client e tomar decisões com ele: o formato é combinado entre o AS e a API, pode ser opaco e mudar sem aviso. O client lê o ID token, não o access token.",
      "Enviar o ID token à API como credencial (o `aud` dele é o client, não a API) ou aceitar um ID token em uma API.",
      "Pedir o escopo `openid` e não validar o ID token (assinatura, `iss`, `aud`, `exp`, `nonce`), ou esquecer de gerar e conferir o `nonce`.",
    ],
    autoteste: [
      {
        pergunta: "O OAuth 2.0 é um protocolo de autenticação? Justifique.",
        resposta:
          "Não. Ele delega autorização: o access token prova que um client recebeu permissão, não quem é o usuário. A autenticação padronizada sobre ele é o OpenID Connect, com ID token, escopo `openid` e `nonce`.",
      },
      {
        pergunta: "Por que um access token válido não serve de prova de login no seu aplicativo?",
        resposta:
          "Porque ele pode ter sido emitido para outro client e é opaco para o seu. Sem o `aud` e o `nonce` de um ID token validado, não há como saber que o login é desta pessoa, neste aplicativo, agora.",
      },
    ],
  },
  en: {
    titulo: "OAuth vs OpenID Connect",
    pergunta:
      "Is OAuth 2.0 an authentication protocol? Compare OAuth 2.0 and OpenID Connect: what does each solve, and what happens when someone uses an access token as proof of login?",
    porqueEsteMetodo:
      "The two names show up together in every modern login, and mixing them up is behind real-world flaws. A side-by-side matrix shows what each one solves, and the decision rule says when to use one, the other or both.",
    resposta30s:
      "**No: OAuth 2.0 is a delegated authorization framework.** An access token says a client may call an API, not **who** logged in or **who the token was issued to**. **OpenID Connect (OIDC)** is the identity layer on top of it (the `openid` scope, the **ID token**, UserInfo, the `nonce`): use it to learn who signed in, use the access token to call APIs, and use both together for a login that also reaches an API.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "What each one solves",
        colunas: ["Aspect", "OAuth 2.0", "OpenID Connect"],
        linhas: [
          [
            "Question it answers",
            "“May this application access this resource on the user’s behalf?”",
            "“Who is the user, and how and when did they authenticate?”",
          ],
          [
            "Nature",
            "Delegated authorization framework (RFC 6749)",
            "Identity layer on top of OAuth 2.0 (OpenID Connect Core)",
          ],
          [
            "Main token",
            "Access token: opaque to the client and meant for the resource server; OAuth does not define its format",
            "ID token: always a signed JWT, meant for the client (`aud` is the `client_id`)",
          ],
          [
            "Who reads the token",
            "The API (resource server)",
            "The application that performed the login (relying party)",
          ],
          [
            "Scopes",
            "Defined by the API (for example `faturas.read`)",
            "`openid` (required), `profile`, `email`, `address`, `phone`, `offline_access`",
          ],
          [
            "Endpoints and metadata",
            "`authorize` and `token`",
            "The same, plus UserInfo, discovery (`/.well-known/openid-configuration`) and JWKS",
          ],
          [
            "Own protections",
            "`state`, PKCE, exact `redirect_uri`",
            "All of that, plus the `nonce` and ID token validation (signature, `iss`, `aud`, `exp`, `nonce`)",
          ],
          [
            "Result for the application",
            "Access to an API",
            "A login session with a verified identity (`iss` + `sub`)",
          ],
        ],
        nota: "Discovery and JWKS are covered in Q45, standard claims and scopes in Q46 and the `nonce` in Q47.",
      },
      {
        tipo: "codigo",
        titulo: "Two tokens from the same login: who each one is for",
        legenda: "JSON",
        codigo: [
          "{",
          '  "id_token": {',
          '    "iss": "https://auth.exemplo.com",',
          '    "sub": "248289761001",',
          '    "aud": "app-web-123",',
          '    "nonce": "n-0S6_WzA2Mj",',
          '    "exp": 1767225600,',
          '    "iat": 1767222000',
          "  },",
          '  "access_token": {',
          '    "iss": "https://auth.exemplo.com",',
          '    "sub": "248289761001",',
          '    "aud": "https://api.exemplo.com",',
          '    "scope": "faturas.read",',
          '    "client_id": "app-web-123",',
          '    "exp": 1767222900',
          "  }",
          "}",
        ].join("\n"),
        nota: "Two sets of claims side by side. The ID token is meant for the application (`aud` is its `client_id`) and carries the `nonce`. The access token is meant for the API (`aud` is the API). Here the access token is shown as a JWT only to illustrate the difference: to the client it is opaque (RFC 9068 defines a JWT profile for access tokens, but not every server uses it).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Need to **know who the user is** (login, SSO)? Use **OIDC**: ask for `openid`, validate the ID token and use `iss` + `sub` as the identifier. Need to **call an API** on their behalf? Use the OAuth **access token**, which only the API reads. Need both? Ask for `openid` and the API scopes in the same flow: the ID token stays with the application and the access token goes to the API. Never send the ID token to the API as a credential and never use the access token to decide who logged in.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Access token as proof of login",
        texto:
          "The access token **does not say who logged in or who it was issued to**. The classic attack (token substitution) works like this: a malicious application obtains a victim’s access token; the attacker presents it to **another** application that does “login with OAuth” by merely asking the provider “is this token valid, and whose is it?”. The provider says yes, and the second application opens the victim’s session for the attacker. The token was valid, but it had been issued to the first application, not to this one. The ID token closes the gap: its `aud` is your `client_id` and the `nonce` ties it to the login in progress. Even with OIDC, validate signature, `iss`, `aud`, `exp` and `nonce`, and, if you use UserInfo, check that its `sub` matches the ID token’s.",
      },
    ],
    armadilhas: [
      "Building “login with OAuth” by reading the profile with the access token and treating that as authentication: without a validated ID token there is no proof of login, nor that the token was meant for your application.",
      "Decoding the access token in the client and making decisions with it: its format is agreed between the AS and the API, may be opaque and may change without notice. The client reads the ID token, not the access token.",
      "Sending the ID token to the API as a credential (its `aud` is the client, not the API), or accepting an ID token at an API.",
      "Asking for the `openid` scope and not validating the ID token (signature, `iss`, `aud`, `exp`, `nonce`), or forgetting to generate and check the `nonce`.",
    ],
    autoteste: [
      {
        pergunta: "Is OAuth 2.0 an authentication protocol? Justify.",
        resposta:
          "No. It delegates authorization: the access token proves a client was given permission, not who the user is. The standardized authentication layer on top of it is OpenID Connect, with the ID token, the `openid` scope and the `nonce`.",
      },
      {
        pergunta: "Why is a valid access token not proof of login in your application?",
        resposta:
          "Because it may have been issued to another client, and it is opaque to yours. Without the `aud` and `nonce` of a validated ID token, there is no way to know the login is this person, in this application, right now.",
      },
    ],
  },
};
