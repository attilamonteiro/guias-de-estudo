import type { Pergunta } from "../../tipos";

// Q34 · Refresh token e rotação
export const q034: Pergunta = {
  numero: 34,
  modulo: "oauth",
  metodo: "trace",
  pt: {
    titulo: "Refresh token e rotação",
    pergunta:
      "O que é um refresh token, por que ele existe e como a rotação com detecção de reuso protege contra roubo? Como tratar a expiração do access token no cliente?",
    porqueEsteMetodo:
      "A renovação é uma sequência de trocas entre cliente, API e authorization server, e a proteção contra roubo só faz sentido quando você segue o token pela cadeia, inclusive pelo caminho em que dois portadores apresentam o mesmo refresh token.",
    resposta30s:
      "O **access token** é curto e viaja para as APIs; o **refresh token** é longo, guardado com mais cuidado e só é enviado ao `/token` do authorization server para obter um novo par de tokens. Na **rotação**, cada uso devolve um refresh token novo e invalida o anterior; se um token já usado reaparece, o servidor conclui que foi copiado e **revoga toda a família**. No cliente, renove antes de expirar ou ao receber `401`, **uma renovação por vez**, e volte ao login se o servidor responder `invalid_grant`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma renovação, no caminho feliz",
        etapas: [
          "O usuário entra (authorization code com PKCE) e o cliente recebe um access token de poucos minutos e um refresh token; em OpenID Connect, costuma-se pedir o escopo `offline_access`, e cada provedor decide quando emite o refresh token",
          "O cliente chama a API com `Authorization: Bearer <access token>`; o refresh token nunca vai para a API",
          'O access token expira e a API responde `401` com `WWW-Authenticate: Bearer error="invalid_token"`',
          "O cliente envia ao `/token` do authorization server `grant_type=refresh_token` e o refresh token atual (um cliente confidencial também se autentica)",
          "O servidor confere que o token é válido, não expirou, não foi revogado e foi emitido para este cliente; devolve um novo access token e, na rotação, um **novo refresh token**, e marca o anterior como “já usado”",
          "O cliente guarda o novo par, descarta o antigo e repete a chamada que falhou, uma única vez",
        ],
        nota: "O escopo pedido na renovação só pode ser igual ou menor que o original: renovar nunca amplia permissões.",
      },
      {
        tipo: "passos",
        titulo: "O caminho em que dá errado: o refresh token é copiado",
        passos: [
          {
            titulo: "A cópia",
            texto:
              "Um atacante copia o refresh token RT1 (disco do dispositivo, log, malware, XSS). Sem rotação, ele renovaria acessos durante toda a vida do RT1, e ninguém notaria.",
          },
          {
            titulo: "Dois portadores do mesmo token",
            texto:
              "Um dos dois usa o RT1 primeiro e recebe o RT2; o RT1 passa a ser “gasto”. Quando o outro apresenta o RT1, o servidor vê um token já usado, algo que nunca acontece no uso normal.",
          },
          {
            titulo: "A resposta do servidor",
            texto:
              "O servidor não sabe qual dos dois é o legítimo. Ele revoga a **família** (todos os refresh e access tokens que descendem do mesmo consentimento) e responde `invalid_grant`. O atacante perde o acesso, e o usuário legítimo precisa entrar de novo: esse é o custo aceito.",
          },
          {
            titulo: "O que o servidor precisa guardar",
            texto:
              "O vínculo entre cada token, sua família e o cliente a que pertence, e o estado (ativo, usado, revogado). Sem lembrar dos tokens já usados não há como reconhecer o reuso. Guarde só o hash do token, nunca o valor em claro.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A troca no endpoint de token, o novo par e o reuso",
        legenda: "HTTP",
        codigo: `POST /oauth2/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=spa-web&refresh_token=RT1

HTTP/1.1 200 OK
Cache-Control: no-store
Content-Type: application/json

{ "access_token": "AT2", "token_type": "Bearer", "expires_in": 600, "refresh_token": "RT2" }

(mais tarde, o mesmo RT1 chega de novo)

HTTP/1.1 400 Bad Request
Content-Type: application/json

{ "error": "invalid_grant" }`,
        nota: "`RT1`, `RT2` e `AT2` são marcadores no lugar de valores reais. Depois do reuso, o servidor também revoga o `RT2`.",
      },
      {
        tipo: "passos",
        titulo: "No cliente: tratar a expiração do access token",
        passos: [
          {
            titulo: "Antes ou depois de expirar",
            texto:
              "Guarde o instante de expiração (`expires_in` somado à hora em que o token chegou). Renove um pouco antes, com uma margem de alguns segundos para o relógio e a latência, ou reaja ao `401 invalid_token`. Reagir ao `401` funciona sempre, inclusive quando o servidor revogou o token antes da hora; a renovação antecipada só evita uma chamada perdida.",
          },
          {
            titulo: "Uma renovação por vez",
            texto:
              "Várias requisições podem notar a expiração ao mesmo tempo. Com rotação, duas renovações com o mesmo refresh token parecem reuso e derrubam a sessão. Compartilhe uma única promise de renovação entre as chamadas (*single-flight*) e repita cada requisição que falhou apenas uma vez.",
          },
          {
            titulo: "Várias abas",
            texto:
              "Abas do mesmo navegador dividem o armazenamento e disputam o mesmo refresh token. Coordene-as com um lock entre abas (a Web Locks API) ou deixe a renovação num backend (BFF, veja Q41), onde existe um ponto só.",
          },
          {
            titulo: "Quando a renovação falha",
            texto:
              "`invalid_grant` (expirado, revogado ou reusado) significa voltar ao login, sem laço de tentativas. Erro de rede ou `5xx` é transitório: tente de novo com espera crescente e não apague os tokens por causa disso.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Access token × refresh token, e os dois relógios",
        texto:
          "O **access token** é uma credencial para a API (a audiência é a API, a vida é de minutos); o **refresh token** é uma credencial para o authorization server (só vale no `/token`, vive muito mais e fica preso ao cliente que o recebeu). Por isso o refresh pede o cuidado maior: servidor de sessão ou cofre do sistema operacional, nunca em log, nunca enviado a uma API. A expiração **deslizante** (cada uso estende a vida) mantém logado quem usa o app, e a **absoluta** (um teto contado desde o login) obriga a autenticar de novo de tempos em tempos; sem o teto, um token roubado e renovado com frequência nunca morre (veja Q78). A RFC 9700 exige, para clients públicos, refresh token **vinculado ao remetente** (veja Q37) **ou** rotação com detecção de reuso.",
      },
    ],
    armadilhas: [
      "Guardar o refresh token no `localStorage` de uma SPA ou enviá-lo a uma API: ele só deve ir ao `/token`, e um script injetado (XSS) lê o `localStorage`. Em SPA de alto risco, deixe-o no backend.",
      "Renovar em paralelo (várias requisições ou abas) com a rotação ligada: o segundo uso parece roubo e o usuário é deslogado sem motivo aparente.",
      "Tratar `invalid_grant` como erro temporário e tentar de novo em laço: significa que aquele refresh token acabou, e o caminho é um novo login.",
      "Confundir expiração deslizante com sessão eterna: sem um limite absoluto, um refresh token roubado e usado com frequência nunca expira.",
    ],
    autoteste: [
      {
        pergunta: "Por que existem dois tokens, em vez de um access token de vida longa?",
        resposta:
          "Porque o access token viaja para todas as APIs e vaza com mais facilidade, então precisa durar pouco. O refresh token só é apresentado ao authorization server, que o confere, o revoga e, na rotação, detecta o reuso. Assim, o roubo de um access token tem janela curta, e o acesso longo continua sob controle do servidor.",
      },
      {
        pergunta: "O que acontece quando um refresh token já rotacionado é apresentado de novo?",
        resposta:
          "O servidor trata como sinal de cópia, revoga a família de tokens daquele consentimento e responde `invalid_grant`. Como ele não sabe qual dos dois portadores é o legítimo, ambos perdem o acesso e o usuário entra de novo.",
      },
    ],
  },
  en: {
    titulo: "Refresh tokens and rotation",
    pergunta:
      "What is a refresh token, why does it exist, and how does rotation with reuse detection protect against theft? How should the client handle access token expiration?",
    porqueEsteMetodo:
      "Renewal is a sequence of exchanges between client, API and authorization server, and the protection against theft only makes sense once you follow the token along the chain, including the path where two holders present the same refresh token.",
    resposta30s:
      "The **access token** is short-lived and travels to the APIs; the **refresh token** is long-lived, stored with more care, and only ever sent to the authorization server’s `/token` endpoint to get a new pair of tokens. With **rotation**, each use returns a new refresh token and invalidates the previous one; if a used token shows up again, the server concludes it was copied and **revokes the whole family**. On the client, renew before expiry or on a `401`, **one renewal at a time**, and go back to login if the server answers `invalid_grant`.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One renewal, on the happy path",
        etapas: [
          "The user signs in (authorization code with PKCE) and the client receives an access token valid for a few minutes plus a refresh token; in OpenID Connect you usually request the `offline_access` scope, and each provider decides when it issues a refresh token",
          "The client calls the API with `Authorization: Bearer <access token>`; the refresh token never goes to the API",
          'The access token expires and the API answers `401` with `WWW-Authenticate: Bearer error="invalid_token"`',
          "The client sends the authorization server’s `/token` endpoint `grant_type=refresh_token` and the current refresh token (a confidential client also authenticates)",
          "The server checks that the token is valid, not expired, not revoked and was issued to this client; it returns a new access token and, with rotation, a **new refresh token**, and marks the previous one as “already used”",
          "The client stores the new pair, discards the old one and repeats the call that failed, exactly once",
        ],
        nota: "The scope requested on renewal can only be equal to or narrower than the original: renewing never widens permissions.",
      },
      {
        tipo: "passos",
        titulo: "The path where it goes wrong: the refresh token is copied",
        passos: [
          {
            titulo: "The copy",
            texto:
              "An attacker copies refresh token RT1 (device disk, log, malware, XSS). Without rotation, they could renew access for the whole life of RT1, and nobody would notice.",
          },
          {
            titulo: "Two holders of the same token",
            texto:
              "One of them uses RT1 first and receives RT2; RT1 becomes “spent”. When the other presents RT1, the server sees an already-used token, something that never happens in normal use.",
          },
          {
            titulo: "The server’s response",
            texto:
              "The server cannot tell which of the two is legitimate. It revokes the **family** (every refresh and access token descended from the same consent) and answers `invalid_grant`. The attacker loses access and the legitimate user has to sign in again: that is the accepted cost.",
          },
          {
            titulo: "What the server has to store",
            texto:
              "The link between each token, its family and the client it belongs to, plus its state (active, used, revoked). Without remembering used tokens there is no way to recognize reuse. Store only the token’s hash, never the plain value.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The token-endpoint exchange, the new pair and the reuse",
        legenda: "HTTP",
        codigo: `POST /oauth2/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=spa-web&refresh_token=RT1

HTTP/1.1 200 OK
Cache-Control: no-store
Content-Type: application/json

{ "access_token": "AT2", "token_type": "Bearer", "expires_in": 600, "refresh_token": "RT2" }

(later, the same RT1 arrives again)

HTTP/1.1 400 Bad Request
Content-Type: application/json

{ "error": "invalid_grant" }`,
        nota: "`RT1`, `RT2` and `AT2` are placeholders for real values. After the reuse, the server also revokes `RT2`.",
      },
      {
        tipo: "passos",
        titulo: "On the client: handling access token expiration",
        passos: [
          {
            titulo: "Before or after it expires",
            texto:
              "Store the expiry instant (`expires_in` added to the time the token arrived). Renew slightly early, with a margin of a few seconds for clock drift and latency, or react to the `401 invalid_token`. Reacting to the `401` always works, including when the server revoked the token ahead of time; early renewal only saves a wasted call.",
          },
          {
            titulo: "One renewal at a time",
            texto:
              "Several requests can notice the expiry at once. With rotation, two renewals using the same refresh token look like reuse and kill the session. Share a single renewal promise among the calls (*single-flight*) and retry each failed request only once.",
          },
          {
            titulo: "Several tabs",
            texto:
              "Tabs of the same browser share storage and compete for the same refresh token. Coordinate them with a cross-tab lock (the Web Locks API) or leave renewal to a backend (a BFF, see Q41), where there is a single place doing it.",
          },
          {
            titulo: "When renewal fails",
            texto:
              "`invalid_grant` (expired, revoked or reused) means going back to login, with no retry loop. A network error or `5xx` is transient: retry with growing delays and do not wipe the tokens because of it.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Access token vs refresh token, and the two clocks",
        texto:
          "The **access token** is a credential for the API (the audience is the API, the life is minutes); the **refresh token** is a credential for the authorization server (it is only good at `/token`, lives much longer and is bound to the client that received it). That is why the refresh token deserves the most care: a session server or the operating system’s vault, never in logs, never sent to an API. **Sliding** expiry (each use extends the life) keeps active users signed in, and **absolute** expiry (a ceiling counted from login) forces re-authentication from time to time; without the ceiling, a stolen token that is renewed often never dies (see Q78). RFC 9700 requires, for public clients, a refresh token that is **sender-constrained** (see Q37) **or** rotated with reuse detection.",
      },
    ],
    armadilhas: [
      "Storing the refresh token in a SPA’s `localStorage` or sending it to an API: it should only go to `/token`, and an injected script (XSS) can read `localStorage`. For a high-risk SPA, keep it on the backend.",
      "Renewing in parallel (several requests or tabs) with rotation on: the second use looks like theft and the user is logged out for no visible reason.",
      "Treating `invalid_grant` as a temporary error and retrying in a loop: it means that refresh token is finished, and the way forward is a new login.",
      "Confusing sliding expiry with an eternal session: without an absolute limit, a stolen refresh token that is used often never expires.",
    ],
    autoteste: [
      {
        pergunta: "Why are there two tokens instead of one long-lived access token?",
        resposta:
          "Because the access token travels to every API and leaks more easily, so it must be short-lived. The refresh token is only ever presented to the authorization server, which checks it, revokes it and, with rotation, detects reuse. So the theft of an access token has a short window, and long-term access stays under the server’s control.",
      },
      {
        pergunta: "What happens when an already-rotated refresh token is presented again?",
        resposta:
          "The server treats it as a sign of copying, revokes the family of tokens from that consent and answers `invalid_grant`. Since it cannot tell which of the two holders is legitimate, both lose access and the user signs in again.",
      },
    ],
  },
};
