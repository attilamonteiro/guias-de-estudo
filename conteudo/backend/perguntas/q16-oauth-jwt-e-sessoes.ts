import type { Pergunta } from "../../tipos";

// Q16 · OAuth, JWT e sessões
export const q16: Pergunta = {
  numero: 16,
  modulo: "seguranca",
  metodo: "compare",
  pt: {
    titulo: "OAuth, JWT e sessões",
    pergunta: "Explique as diferenças entre OAuth, JWT e autenticação baseada em sessões.",
    porqueEsteMetodo:
      "É um “X vs Y vs Z”, mas com uma armadilha: os três não são da mesma categoria. Comparar exige primeiro separar o que cada um é (protocolo, formato, mecanismo) e depois a regra de escolha.",
    resposta30s:
      "**Sessão** é um mecanismo com estado no servidor: o cliente guarda só um ID opaco num cookie. **JWT** é um **formato de token** assinado, que o servidor valida sem consultar nenhum armazenamento (stateless). **OAuth 2.0** é um **protocolo de autorização delegada**: deixa um app acessar recursos do usuário sem receber a senha; o access token que ele emite pode ser um JWT. Login social e SSO usam OAuth + OIDC.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cada um é de uma categoria",
        colunas: ["", "Sessão (cookie)", "JWT", "OAuth 2.0 (+ OIDC)"],
        linhas: [
          [
            "O que é",
            "Mecanismo de estado no servidor",
            "Formato de token assinado (`header.payload.assinatura`)",
            "Protocolo/framework de autorização delegada; OIDC acrescenta identidade (login)",
          ],
          [
            "Onde fica o estado",
            "Servidor (memória, Redis, banco); o cliente só tem o ID",
            "No próprio token (claims `sub`, `exp`, `aud`…)",
            "Servidor de autorização emite e controla os tokens",
          ],
          [
            "Revogação",
            "Trivial: apague a sessão",
            "Difícil: vale até expirar, salvo lista de bloqueio",
            "Revoga token ou consentimento no servidor de autorização",
          ],
          [
            "Escala",
            "Precisa de armazenamento compartilhado entre servidores",
            "Fácil: qualquer servidor valida só com a chave",
            "Depende do servidor de autorização, mas permite SSO entre apps",
          ],
          [
            "Melhor para",
            "Aplicação web tradicional, mesma origem",
            "APIs entre serviços e clientes variados, tokens de vida curta",
            "Login com Google/GitHub, acesso de terceiros, SSO, máquina-a-máquina",
          ],
          [
            "Riscos",
            "CSRF, fixação de sessão, cookie sem flags",
            "Token roubado vale até expirar, `alg: none`, não validar `aud`/`iss`/`exp`, payload legível",
            "Fluxo errado (Implicit), `redirect_uri` frouxo, falta de PKCE",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "OAuth: Authorization Code com PKCE (o fluxo recomendado)",
        etapas: [
          "App redireciona ao servidor de autorização com `code_challenge`",
          "Usuário se autentica e consente",
          "Redireciona de volta ao app com um `code` curto",
          "App troca `code` + `code_verifier` por tokens",
          "App chama a API com o access token",
        ],
      },
      {
        tipo: "passos",
        titulo: "Regra de decisão",
        passos: [
          {
            titulo: "Site tradicional, mesmo domínio",
            texto: "Sessão com cookie `HttpOnly`, `Secure`, `SameSite`. Simples e revogável.",
          },
          {
            titulo: "API consumida por vários clientes ou entre microserviços",
            texto: "Access token de vida curta (JWT ou opaco) + refresh token.",
          },
          {
            titulo: "“Entrar com Google”, acesso de terceiros, SSO",
            texto: "OAuth 2.0 + OpenID Connect. Não invente o seu.",
          },
          {
            titulo: "Misturar",
            texto: "É comum: o login vem por OIDC, e a aplicação converte o resultado em sessão ou em tokens próprios.",
          },
        ],
      },
    ],
    armadilhas: [
      "“JWT é mais seguro que sessão”: são coisas diferentes, e o JWT é mais difícil de revogar.",
      "Guardar o JWT em `localStorage`: um XSS rouba o token; prefira cookie `HttpOnly`.",
      "Aceitar o token sem validar assinatura, algoritmo, `iss`, `aud` e `exp`.",
      "Usar OAuth para “autenticar” sem OIDC: OAuth diz o que o app pode fazer, não quem é o usuário.",
      "Colocar dado sensível no payload do JWT: ele é só codificado em base64, qualquer um lê.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença de categoria entre OAuth e JWT?",
        resposta:
          "OAuth é um protocolo de autorização delegada; JWT é um formato de token. Um access token OAuth pode ser um JWT, mas não precisa.",
      },
      {
        pergunta: "Por que revogar um JWT é difícil?",
        resposta:
          "Porque ele é validado só pela assinatura, sem consultar o servidor. Ele vale até expirar, a menos que você mantenha uma lista de bloqueio, que reintroduz estado.",
      },
    ],
  },
  en: {
    titulo: "OAuth, JWT and sessions",
    pergunta: "Explain the differences between OAuth, JWT and session-based authentication.",
    porqueEsteMetodo:
      "It is an “X vs Y vs Z”, but with a trap: the three are not the same category. Comparing requires first separating what each is (protocol, format, mechanism) and then the selection rule.",
    resposta30s:
      "A **session** is a server-side state mechanism: the client holds only an opaque ID in a cookie. A **JWT** is a signed **token format** the server validates without consulting any store (stateless). **OAuth 2.0** is a **delegated-authorization protocol**: it lets an app access the user’s resources without receiving the password; the access token it issues may be a JWT. Social login and SSO use OAuth + OIDC.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Each is a different category",
        colunas: ["", "Session (cookie)", "JWT", "OAuth 2.0 (+ OIDC)"],
        linhas: [
          [
            "What it is",
            "Server-side state mechanism",
            "Signed token format (`header.payload.signature`)",
            "Delegated-authorization protocol/framework; OIDC adds identity (login)",
          ],
          [
            "Where the state lives",
            "Server (memory, Redis, database); the client holds only the ID",
            "In the token itself (claims `sub`, `exp`, `aud`…)",
            "The authorization server issues and controls the tokens",
          ],
          [
            "Revocation",
            "Trivial: delete the session",
            "Hard: valid until expiry, unless a denylist is kept",
            "Revoke the token or consent at the authorization server",
          ],
          [
            "Scaling",
            "Needs shared storage across servers",
            "Easy: any server validates with just the key",
            "Depends on the authorization server, but enables SSO across apps",
          ],
          [
            "Best for",
            "Traditional web app, same origin",
            "APIs between services and varied clients, short-lived tokens",
            "Google/GitHub login, third-party access, SSO, machine-to-machine",
          ],
          [
            "Risks",
            "CSRF, session fixation, cookie without flags",
            "A stolen token works until expiry, `alg: none`, skipping `aud`/`iss`/`exp` checks, readable payload",
            "Wrong flow (Implicit), loose `redirect_uri`, missing PKCE",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "OAuth: Authorization Code with PKCE (the recommended flow)",
        etapas: [
          "App redirects to the authorization server with a `code_challenge`",
          "User authenticates and consents",
          "Redirect back to the app with a short `code`",
          "App exchanges `code` + `code_verifier` for tokens",
          "App calls the API with the access token",
        ],
      },
      {
        tipo: "passos",
        titulo: "Decision rule",
        passos: [
          {
            titulo: "Traditional site, same domain",
            texto: "Session with an `HttpOnly`, `Secure`, `SameSite` cookie. Simple and revocable.",
          },
          {
            titulo: "API consumed by several clients or between microservices",
            texto: "Short-lived access token (JWT or opaque) + refresh token.",
          },
          {
            titulo: "“Sign in with Google”, third-party access, SSO",
            texto: "OAuth 2.0 + OpenID Connect. Do not invent your own.",
          },
          {
            titulo: "Mixing them",
            texto:
              "Common: login arrives via OIDC, and the application converts the result into a session or its own tokens.",
          },
        ],
      },
    ],
    armadilhas: [
      "“JWT is more secure than sessions”: they are different things, and JWT is harder to revoke.",
      "Storing the JWT in `localStorage`: an XSS steals the token; prefer an `HttpOnly` cookie.",
      "Accepting the token without validating signature, algorithm, `iss`, `aud` and `exp`.",
      "Using OAuth to “authenticate” without OIDC: OAuth says what the app may do, not who the user is.",
      "Putting sensitive data in the JWT payload: it is only base64-encoded, anyone can read it.",
    ],
    autoteste: [
      {
        pergunta: "What is the category difference between OAuth and JWT?",
        resposta:
          "OAuth is a delegated-authorization protocol; JWT is a token format. An OAuth access token can be a JWT, but does not have to be.",
      },
      {
        pergunta: "Why is revoking a JWT hard?",
        resposta:
          "Because it is validated by signature alone, without consulting the server. It stays valid until expiry unless you keep a denylist, which reintroduces state.",
      },
    ],
  },
};
