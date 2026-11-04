import type { Pergunta } from "../../tipos";

// P29 · OAuth 2.0 e seus fluxos
export const p029: Pergunta = {
  numero: 729,
  modulo: "pawanmkr-seguranca",
  metodo: "compare",
  pt: {
    titulo: "OAuth 2.0 e seus fluxos",
    pergunta: "Descreva como o OAuth2 funciona e quais fluxos são suportados em sistemas de backend.",
    porqueEsteMetodo:
      "“OAuth 2.0” não é um fluxo, é uma família deles, e a entrevista quer saber se você escolhe o certo para cada situação. A matriz coloca os fluxos lado a lado e a regra de decisão mostra qual usar.",
    resposta30s:
      "No **OAuth 2.0**, um **cliente** obtém de um **servidor de autorização**, com o consentimento do **dono do recurso**, um **token de acesso** de vida curta que a **API (servidor de recursos)** aceita, limitado por **escopos**; um **token de renovação** obtém novos tokens de acesso sem novo login. O fluxo depende de quem chama: **authorization code com PKCE** quando há uma pessoa (web, SPA, mobile), **client credentials** de máquina para máquina, **device code** para aparelhos sem navegador; implicit e password são legados a evitar. OAuth **autoriza, não autentica**: para saber quem entrou, use OpenID Connect.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As peças do OAuth 2.0",
        colunas: ["Peça", "O que é", "Exemplo"],
        linhas: [
          ["Dono do recurso", "A pessoa que possui os dados e decide quem os acessa", "Você, dono das suas fotos"],
          [
            "Cliente",
            "A aplicação que quer acessar os dados em nome do dono (ou em nome próprio)",
            "Um app de impressão de fotos",
          ],
          [
            "Servidor de autorização",
            "Autentica o dono, pede o consentimento e emite os tokens",
            "A tela de login e consentimento do serviço de fotos",
          ],
          [
            "Servidor de recursos",
            "A API que guarda os dados e só aceita requisições com token válido",
            "A API de fotos",
          ],
          [
            "Token de acesso",
            "Credencial de vida curta que o cliente apresenta à API",
            "Cabeçalho `Authorization: Bearer ...`",
          ],
          [
            "Token de renovação",
            "Credencial de vida mais longa, usada só junto ao servidor de autorização para obter novos tokens de acesso",
            "Manter a sessão sem pedir login de novo",
          ],
          ["Escopo", "O recorte do que o token permite fazer", "`fotos:ler`"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Os fluxos, lado a lado",
        colunas: ["Fluxo", "Quando usar", "Como funciona (resumo)", "Atenção"],
        linhas: [
          [
            "Authorization code + PKCE",
            "Aplicações com usuário: web, SPA, mobile e desktop",
            "Redireciona ao servidor de autorização, volta com um `code` de uso único e o cliente o troca por tokens, provando a posse do `code_verifier`",
            "É o padrão para quem tem usuário; as recomendações atuais pedem PKCE também em clientes com backend",
          ],
          [
            "Client credentials",
            "Máquina a máquina, sem usuário (jobs, serviços)",
            "O cliente se autentica no endpoint de token (segredo, chave privada ou mTLS) e recebe um token que representa a própria aplicação",
            "Só em cliente confidencial; nunca no navegador nem em app instalado",
          ],
          [
            "Device code",
            "TVs, consoles, CLIs e aparelhos sem navegador ou com entrada limitada",
            "O aparelho mostra um código e um endereço, a pessoa aprova em outro dispositivo e o aparelho consulta o endpoint de token até sair o resultado",
            "Respeitar o intervalo entre consultas; o código expira",
          ],
          [
            "Refresh token",
            "Renovar o token de acesso sem novo login",
            "Troca um token de renovação por novos tokens",
            "Não é uma forma de começar; guarde com cuidado, use rotação e permita revogar",
          ],
          [
            "Implicit (legado)",
            "Era usado em SPAs, antes do PKCE",
            "O token volta direto no redirecionamento, na URL",
            "Vaza por histórico, logs e referências; evitado nas recomendações atuais, em favor de code + PKCE",
          ],
          [
            "Password (legado)",
            "Cliente que recebe usuário e senha da pessoa",
            "O cliente troca a senha por um token",
            "Anula o propósito do OAuth (o cliente vê a senha); evitar, e conferir as recomendações atuais",
          ],
        ],
        nota: "Os nomes e as recomendações evoluem (consulte a RFC 6749, as práticas de segurança atuais do IETF e a documentação do seu provedor).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Há uma **pessoa** por trás da requisição? **Authorization code com PKCE.** Serviço chamando serviço, **sem pessoa**? **Client credentials.** Aparelho **sem navegador**? **Device code.** Precisa manter a sessão sem novo login? **Refresh token**, com rotação. Em sistema novo, **não use** implicit nem password.",
      },
      {
        tipo: "codigo",
        titulo: "Início do authorization code com PKCE",
        legenda: "JavaScript",
        codigo: [
          'import { randomBytes, createHash } from "node:crypto";',
          "",
          'const b64url = (buf) => buf.toString("base64url");',
          "const verifier = b64url(randomBytes(32)); // guarde na sessão do usuário",
          'const challenge = b64url(createHash("sha256").update(verifier).digest());',
          "const state = b64url(randomBytes(16)); // guarde na sessão também",
          "",
          'const url = new URL("https://auth.exemplo.com/authorize");',
          "url.search = new URLSearchParams({",
          '  response_type: "code", client_id: "meu-app",',
          '  redirect_uri: "https://app.exemplo.com/callback",',
          '  scope: "openid profile", state,',
          '  code_challenge: challenge, code_challenge_method: "S256",',
          "}).toString();",
          "// redirecione o usuário para url.href",
        ].join("\n"),
        nota: "No callback, antes de trocar o `code`: confira que o `state` devolvido é o guardado e envie o `code_verifier` na troca. O `redirect_uri` precisa ser idêntico ao registrado no servidor de autorização.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "OAuth autoriza, não autentica",
        texto:
          "O token de acesso diz “o portador pode fazer isto”, não “esta pessoa é fulana”. Para login use o **OpenID Connect**, camada sobre o OAuth 2.0 que acrescenta o escopo `openid` e o **ID token**. A API valida o token que recebe: assinatura (pelas chaves publicadas no JWKS do emissor), `iss`, `aud`, `exp` e escopos, ou consulta o servidor de autorização quando o token é opaco. Guarde tokens no servidor ou num BFF (veja P90), não no `localStorage`. Em Node.js, `passport`, `openid-client` e `jose` são bibliotecas conhecidas para esses papéis; confira a documentação e o estado de manutenção. Veja também L45 e L47.",
      },
    ],
    armadilhas: [
      "Usar o token de acesso como prova de login: OAuth autoriza; para identificar quem entrou, use OpenID Connect e valide o ID token.",
      "Aceitar `redirect_uri` com curinga ou ignorar o `state`: abre caminho para roubo do código de autorização e para CSRF no callback.",
      "Guardar tokens no `localStorage` de uma SPA ou embutir segredo de cliente em app de navegador ou mobile: qualquer script injetado ou usuário curioso os lê.",
      "Validar só a assinatura do JWT e esquecer `iss`, `aud`, `exp` e escopos: um token válido de outra API ou expirado passa.",
    ],
    autoteste: [
      {
        pergunta: "Qual fluxo usar para um job que chama uma API interna, sem usuário?",
        resposta:
          "Client credentials: o serviço se autentica com a própria credencial no endpoint de token e recebe um token que representa a aplicação, não uma pessoa.",
      },
      {
        pergunta: "Para que serve o PKCE?",
        resposta:
          "Para impedir que um código de autorização interceptado seja trocado por tokens: o cliente gera um segredo aleatório (`code_verifier`), envia o hash dele (`code_challenge`) no início e prova a posse na hora da troca.",
      },
    ],
  },
  en: {
    titulo: "OAuth 2.0 and its flows",
    pergunta: "Describe how OAuth2 works and the flows supported in backend systems.",
    porqueEsteMetodo:
      "“OAuth 2.0” is not one flow, it is a family of them, and an interview wants to know whether you choose the right one for each situation. The matrix puts the flows side by side and the decision rule shows which to use.",
    resposta30s:
      "In **OAuth 2.0**, a **client** obtains from an **authorization server**, with the **resource owner’s** consent, a short-lived **access token** that the **API (resource server)** accepts, limited by **scopes**; a **refresh token** gets new access tokens without a new login. The flow depends on who is calling: **authorization code with PKCE** when there is a person (web, SPA, mobile), **client credentials** machine to machine, **device code** for devices without a browser; implicit and password are legacy flows to avoid. OAuth **authorizes, it does not authenticate**: to know who signed in, use OpenID Connect.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The pieces of OAuth 2.0",
        colunas: ["Piece", "What it is", "Example"],
        linhas: [
          ["Resource owner", "The person who owns the data and decides who can access it", "You, owner of your photos"],
          [
            "Client",
            "The application that wants to access the data on the owner’s behalf (or on its own)",
            "A photo printing app",
          ],
          [
            "Authorization server",
            "Authenticates the owner, asks for consent and issues the tokens",
            "The photo service’s login and consent screen",
          ],
          [
            "Resource server",
            "The API that holds the data and accepts only requests with a valid token",
            "The photos API",
          ],
          [
            "Access token",
            "A short-lived credential the client presents to the API",
            "The `Authorization: Bearer ...` header",
          ],
          [
            "Refresh token",
            "A longer-lived credential, used only with the authorization server to obtain new access tokens",
            "Keeping the session without asking for a new login",
          ],
          ["Scope", "The slice of what the token allows", "`photos:read`"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "The flows, side by side",
        colunas: ["Flow", "When to use", "How it works (summary)", "Watch out"],
        linhas: [
          [
            "Authorization code + PKCE",
            "Applications with a user: web, SPA, mobile and desktop",
            "Redirects to the authorization server, comes back with a single-use `code`, and the client exchanges it for tokens by proving it holds the `code_verifier`",
            "The default for anything with a user; current recommendations ask for PKCE on clients with a backend too",
          ],
          [
            "Client credentials",
            "Machine to machine, no user (jobs, services)",
            "The client authenticates at the token endpoint (secret, private key or mTLS) and receives a token that represents the application itself",
            "Confidential clients only; never in the browser or an installed app",
          ],
          [
            "Device code",
            "TVs, consoles, CLIs and devices without a browser or with limited input",
            "The device shows a code and an address, the person approves on another device and the device polls the token endpoint until the result comes out",
            "Respect the polling interval; the code expires",
          ],
          [
            "Refresh token",
            "Renewing the access token without a new login",
            "Exchanges a refresh token for new tokens",
            "Not a way to start; store it carefully, use rotation and allow revocation",
          ],
          [
            "Implicit (legacy)",
            "Used in SPAs, before PKCE",
            "The token comes back directly in the redirect, in the URL",
            "Leaks through history, logs and referrers; avoided in current recommendations, in favor of code + PKCE",
          ],
          [
            "Password (legacy)",
            "A client that receives the person’s username and password",
            "The client exchanges the password for a token",
            "Defeats the purpose of OAuth (the client sees the password); avoid it and check current recommendations",
          ],
        ],
        nota: "Names and recommendations evolve (consult RFC 6749, the IETF’s current security practices and your provider’s documentation).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Is there a **person** behind the request? **Authorization code with PKCE.** A service calling a service, **no person**? **Client credentials.** A device **without a browser**? **Device code.** Need to keep the session without a new login? **Refresh token**, with rotation. In a new system, **do not use** implicit or password.",
      },
      {
        tipo: "codigo",
        titulo: "Starting authorization code with PKCE",
        legenda: "JavaScript",
        codigo: [
          'import { randomBytes, createHash } from "node:crypto";',
          "",
          'const b64url = (buf) => buf.toString("base64url");',
          "const verifier = b64url(randomBytes(32)); // keep it in the user's session",
          'const challenge = b64url(createHash("sha256").update(verifier).digest());',
          "const state = b64url(randomBytes(16)); // keep this in the session too",
          "",
          'const url = new URL("https://auth.example.com/authorize");',
          "url.search = new URLSearchParams({",
          '  response_type: "code", client_id: "my-app",',
          '  redirect_uri: "https://app.example.com/callback",',
          '  scope: "openid profile", state,',
          '  code_challenge: challenge, code_challenge_method: "S256",',
          "}).toString();",
          "// redirect the user to url.href",
        ].join("\n"),
        nota: "In the callback, before exchanging the `code`: check that the returned `state` matches the stored one and send the `code_verifier` in the exchange. The `redirect_uri` must be identical to the one registered with the authorization server.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "OAuth authorizes, it does not authenticate",
        texto:
          "The access token says “the bearer may do this”, not “this person is so-and-so”. For login use **OpenID Connect**, a layer on top of OAuth 2.0 that adds the `openid` scope and the **ID token**. The API validates the token it receives: signature (using the keys published in the issuer’s JWKS), `iss`, `aud`, `exp` and scopes, or it asks the authorization server when the token is opaque. Keep tokens on the server or in a BFF (see P90), not in `localStorage`. In Node.js, `passport`, `openid-client` and `jose` are well-known libraries for these roles; check their documentation and maintenance status. See also L45 and L47.",
      },
    ],
    armadilhas: [
      "Using the access token as proof of login: OAuth authorizes; to identify who signed in, use OpenID Connect and validate the ID token.",
      "Accepting a `redirect_uri` with a wildcard or ignoring `state`: it opens the door to authorization code theft and to CSRF on the callback.",
      "Keeping tokens in an SPA’s `localStorage` or embedding a client secret in a browser or mobile app: any injected script or curious user can read them.",
      "Validating only the JWT signature and forgetting `iss`, `aud`, `exp` and scopes: a valid token from another API, or an expired one, gets through.",
    ],
    autoteste: [
      {
        pergunta: "Which flow should a job that calls an internal API, with no user, use?",
        resposta:
          "Client credentials: the service authenticates with its own credential at the token endpoint and receives a token that represents the application, not a person.",
      },
      {
        pergunta: "What is PKCE for?",
        resposta:
          "To stop an intercepted authorization code from being exchanged for tokens: the client generates a random secret (`code_verifier`), sends its hash (`code_challenge`) at the start and proves it holds the secret at exchange time.",
      },
    ],
  },
};
