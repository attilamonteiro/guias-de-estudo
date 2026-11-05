import type { Pergunta } from "../../tipos";

// Q27 · Fluxo Authorization Code
export const q027: Pergunta = {
  numero: 27,
  modulo: "oauth",
  metodo: "trace",
  pt: {
    titulo: "Fluxo Authorization Code",
    pergunta:
      "Descreva passo a passo o fluxo Authorization Code do OAuth 2.0, indicando o que viaja pelo navegador, o que vai direto entre cliente e servidor e onde cada validação acontece.",
    porqueEsteMetodo:
      "O fluxo é uma sequência de saltos entre navegador, cliente e servidor, e cada salto tem a sua validação. Seguir um único login do clique à resposta da API, incluindo o caminho em que algo falha, mostra por que o desenho é assim.",
    resposta30s:
      "O client manda o navegador ao `/authorize` com `response_type=code`, `redirect_uri`, `scope`, `state` e o `code_challenge` do PKCE; o servidor autentica o usuário, colhe o consentimento e devolve um **code curto e de uso único** pelo navegador (**front channel**). O client o troca **direto** no `/token` (**back channel**), com o `code_verifier` e, se for confidencial, a sua autenticação, e recebe os tokens, que **nunca passam pela barra de endereço**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um login, do clique à resposta da API",
        etapas: [
          "**No client.** A pessoa clica em Entrar. O client gera `state` e `code_verifier`, guarda os dois na sessão, calcula `code_challenge = S256(code_verifier)` e **redireciona o navegador** ao `/authorize` do servidor de autorização (AS)",
          "**Front channel, no AS.** Valida o pedido: `client_id` conhecido, `redirect_uri` igual a uma registrada, `response_type=code`, escopos permitidos a esse client. Se `client_id` ou `redirect_uri` forem inválidos, mostra o erro na própria tela e **não redireciona**",
          "**Front channel, no AS.** Autentica a pessoa (senha, MFA, SSO) e colhe o consentimento, tudo no domínio do AS; o client não participa nem vê a senha",
          "**Front channel.** O AS redireciona o navegador para `redirect_uri?code=...&state=...`. O code é curto, de uso único e fica amarrado ao `client_id`, à `redirect_uri` e ao `code_challenge`",
          "**No client.** Confere se o `state` recebido é o que guardou na sessão deste navegador; se não for, aborta sem chamar o `/token`",
          "**Back channel.** O client chama o `/token` direto, com `grant_type=authorization_code`, `code`, `redirect_uri` e `code_verifier`, mais a autenticação do client se ele for confidencial",
          "**Back channel, no AS.** Valida a troca: code existente, não expirado e nunca usado; mesmo client e mesma `redirect_uri`; `S256(code_verifier)` igual ao `code_challenge` guardado; credenciais do client corretas. Marca o code como usado",
          "**Back channel.** O AS responde com JSON: `access_token`, `token_type`, `expires_in` e, conforme o caso, `refresh_token` e `id_token`. Com OIDC, o client valida o ID token (assinatura, `iss`, `aud`, `exp`, `nonce`)",
          "**Back channel, na API.** O client chama a API com `Authorization: Bearer <access_token>`; a API valida assinatura (ou introspecção), `iss`, `aud`, validade e escopo antes de responder",
        ],
        nota: "Front channel é tudo o que passa pelo navegador (redirecionamentos e barra de endereço): fica visível a quem controla ou observa o dispositivo, então nada ali pode valer sozinho. Back channel é a conexão direta por TLS entre o client e o servidor, sem passar pela URL. Em uma SPA, o client é o JavaScript do navegador, mas a chamada ao `/token` continua sendo uma requisição direta, não um redirecionamento.",
      },
      {
        tipo: "codigo",
        titulo: "Passos 1 a 4: o pedido de autorização e a volta (front channel)",
        legenda: "HTTP",
        codigo: [
          "# 1. O client manda o navegador ao /authorize",
          "GET /authorize?response_type=code&client_id=app-web-123",
          "  &redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback",
          "  &scope=openid%20faturas.read&state=af0ifjsldkj",
          "  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
          "  &code_challenge_method=S256&nonce=n-0S6_WzA2Mj HTTP/1.1",
          "Host: auth.exemplo.com",
          "",
          "# 2 e 3. A pessoa entra e consente na tela do AS",
          "",
          "# 4. O AS devolve o navegador ao client",
          "HTTP/1.1 302 Found",
          "Location: https://app.exemplo.com/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj",
        ].join("\n"),
        nota: "As linhas do pedido foram quebradas só para leitura; na prática é uma única linha de URL. O `code_challenge` não revela o `code_verifier`, e o `code` sozinho não vale nada sem ele.",
      },
      {
        tipo: "codigo",
        titulo: "Passos 6 a 8: a troca do code (back channel)",
        legenda: "HTTP",
        codigo: [
          "POST /token HTTP/1.1",
          "Host: auth.exemplo.com",
          "Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA",
          "&redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback",
          "&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "Cache-Control: no-store",
          "",
          '{"access_token":"2YotnFZFEjr1zCsicMWpAA","token_type":"Bearer","expires_in":900,',
          ' "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA","id_token":"eyJhbGciOiJSUzI1NiIs..."}',
        ].join("\n"),
        nota: "O `Cache-Control: no-store` é exigido pelo OAuth em respostas com tokens. Um client público envia o `client_id` no corpo em vez do cabeçalho `Authorization`. O `redirect_uri` precisa ser idêntico ao do `/authorize`.",
      },
      {
        tipo: "passos",
        titulo: "Onde cada ataque tenta se encaixar",
        passos: [
          {
            titulo: "Antes do /authorize: `redirect_uri` adulterada",
            texto:
              "O atacante monta um link de login com a `redirect_uri` dele. Defesa: o AS só aceita URIs pré-registradas, comparadas por igualdade exata, e não redireciona se não bater (veja Q29).",
          },
          {
            titulo: "Na volta: resposta forjada (CSRF de login)",
            texto:
              "O atacante faz o navegador da vítima abrir `callback?code=...` com um code que é dele. Defesa: o `state` aleatório, preso à sessão do navegador e conferido na volta.",
          },
          {
            titulo: "No redirecionamento: code interceptado",
            texto:
              "Outro app no aparelho, um log ou um proxy captura o code. Defesa: o PKCE (sem o `code_verifier`, o code não vira token), a vida curta e o uso único. Um code usado duas vezes deve ser recusado e, segundo a RFC 6749, convém revogar os tokens que ele já gerou.",
          },
          {
            titulo: "Na volta: code injetado ou token substituído",
            texto:
              "O atacante injeta um code seu na sessão da vítima, ou entrega ao app um token emitido para outro. Defesa: o PKCE amarra o code à sessão que o pediu; no OIDC, o `nonce` e o `aud` do ID token fecham a brecha (veja Q24 e Q28).",
          },
          {
            titulo: "No /token e na API: credencial roubada",
            texto:
              "Um `client_secret` vazado ou um access token roubado. Defesa: autenticação forte do client (`private_key_jwt`, mTLS), TLS sempre, tokens de vida curta com `aud` restrito e, em cenários exigentes, tokens amarrados ao remetente (DPoP, RFC 9449; veja Q37).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que o code é curto e de uso único",
        texto:
          "O code existe para que o **token nunca viaje pela URL**: ele é só um comprovante de que a pessoa aprovou, trocado por tokens em um canal direto. Para isso precisa ser inútil se vazar: **vida curta** (a RFC 6749 recomenda no máximo 10 minutos; na prática costuma ser bem menos), **uso único**, amarrado ao `client_id`, à `redirect_uri` e ao `code_challenge`, e trocável só por quem prova ser o client e conhece o `code_verifier`.",
      },
    ],
    armadilhas: [
      "Não conferir o `state` na volta (ou conferir e não descartar): é o que impede o CSRF de login.",
      "Pôr token ou `code` em log, analytics ou URL de retorno: o code é descartável, mas o token que vem depois não é, e tokens nunca devem ir em query string.",
      "Fazer a troca do code no navegador em um client confidencial ou expor o `client_secret` ao JavaScript: a troca é do backend.",
      "Enviar ao `/token` uma `redirect_uri` diferente da usada no `/authorize`, ou validar o ID token sem conferir o `nonce`: a troca é recusada ou a validação fica incompleta.",
    ],
    autoteste: [
      {
        pergunta: "O que viaja pelo navegador e o que vai direto entre client e servidor no Authorization Code?",
        resposta:
          "Pelo navegador (front channel): o pedido de autorização (`client_id`, `redirect_uri`, `scope`, `state`, `code_challenge`) e o code na volta. Direto (back channel): a troca do code por tokens no `/token`, com o `code_verifier` e a autenticação do client, e as chamadas à API.",
      },
      {
        pergunta: "Que validações o servidor de autorização faz na troca do code?",
        resposta:
          "Que o code existe, não expirou e não foi usado; que pertence a este client e a esta `redirect_uri`; que `S256(code_verifier)` bate com o `code_challenge`; e, se o client é confidencial, que as credenciais dele estão corretas.",
      },
    ],
  },
  en: {
    titulo: "Authorization Code flow",
    pergunta:
      "Walk through the OAuth 2.0 Authorization Code flow step by step, showing what travels through the browser, what goes directly between client and server, and where each validation happens.",
    porqueEsteMetodo:
      "The flow is a sequence of hops between browser, client and server, and each hop has its own validation. Following a single login from the click to the API response, including the path where something fails, shows why the design is the way it is.",
    resposta30s:
      "The client sends the browser to `/authorize` with `response_type=code`, `redirect_uri`, `scope`, `state` and the PKCE `code_challenge`; the server authenticates the user, collects consent and returns a **short-lived, single-use code** through the browser (**front channel**). The client exchanges it **directly** at `/token` (**back channel**), with the `code_verifier` and, if it is confidential, its authentication, and receives the tokens, which **never pass through the address bar**.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One login, from the click to the API response",
        etapas: [
          "**In the client.** The person clicks Sign in. The client generates `state` and `code_verifier`, stores both in the session, computes `code_challenge = S256(code_verifier)` and **redirects the browser** to the authorization server’s (AS) `/authorize`",
          "**Front channel, at the AS.** It validates the request: known `client_id`, a `redirect_uri` equal to a registered one, `response_type=code`, scopes allowed to that client. If `client_id` or `redirect_uri` is invalid, it shows the error on its own page and **does not redirect**",
          "**Front channel, at the AS.** It authenticates the person (password, MFA, SSO) and collects consent, all on the AS’s domain; the client takes no part and never sees the password",
          "**Front channel.** The AS redirects the browser to `redirect_uri?code=...&state=...`. The code is short-lived, single-use and tied to the `client_id`, the `redirect_uri` and the `code_challenge`",
          "**In the client.** It checks that the received `state` is the one stored in this browser’s session; if not, it aborts without calling `/token`",
          "**Back channel.** The client calls `/token` directly, with `grant_type=authorization_code`, `code`, `redirect_uri` and `code_verifier`, plus client authentication if it is confidential",
          "**Back channel, at the AS.** It validates the exchange: code exists, is not expired and was never used; same client and same `redirect_uri`; `S256(code_verifier)` equals the stored `code_challenge`; correct client credentials. It marks the code as used",
          "**Back channel.** The AS answers with JSON: `access_token`, `token_type`, `expires_in` and, depending on the case, `refresh_token` and `id_token`. With OIDC, the client validates the ID token (signature, `iss`, `aud`, `exp`, `nonce`)",
          "**Back channel, at the API.** The client calls the API with `Authorization: Bearer <access_token>`; the API validates the signature (or introspects), `iss`, `aud`, expiry and scope before answering",
        ],
        nota: "Front channel is everything that passes through the browser (redirects and the address bar): it is visible to whoever controls or observes the device, so nothing there can be valuable on its own. Back channel is the direct TLS connection between the client and the server, never through the URL. In an SPA the client is the browser’s JavaScript, but the call to `/token` is still a direct request, not a redirect.",
      },
      {
        tipo: "codigo",
        titulo: "Steps 1 to 4: the authorization request and the way back (front channel)",
        legenda: "HTTP",
        codigo: [
          "# 1. The client sends the browser to /authorize",
          "GET /authorize?response_type=code&client_id=app-web-123",
          "  &redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback",
          "  &scope=openid%20faturas.read&state=af0ifjsldkj",
          "  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
          "  &code_challenge_method=S256&nonce=n-0S6_WzA2Mj HTTP/1.1",
          "Host: auth.exemplo.com",
          "",
          "# 2 and 3. The person signs in and consents on the AS page",
          "",
          "# 4. The AS sends the browser back to the client",
          "HTTP/1.1 302 Found",
          "Location: https://app.exemplo.com/callback?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj",
        ].join("\n"),
        nota: "The request lines were wrapped for readability only; in practice it is a single URL line. The `code_challenge` does not reveal the `code_verifier`, and the `code` alone is worth nothing without it.",
      },
      {
        tipo: "codigo",
        titulo: "Steps 6 to 8: the code exchange (back channel)",
        legenda: "HTTP",
        codigo: [
          "POST /token HTTP/1.1",
          "Host: auth.exemplo.com",
          "Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA",
          "&redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback",
          "&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          "",
          "HTTP/1.1 200 OK",
          "Content-Type: application/json",
          "Cache-Control: no-store",
          "",
          '{"access_token":"2YotnFZFEjr1zCsicMWpAA","token_type":"Bearer","expires_in":900,',
          ' "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA","id_token":"eyJhbGciOiJSUzI1NiIs..."}',
        ].join("\n"),
        nota: "OAuth requires `Cache-Control: no-store` on responses carrying tokens. A public client sends the `client_id` in the body instead of the `Authorization` header. The `redirect_uri` must be identical to the one used at `/authorize`.",
      },
      {
        tipo: "passos",
        titulo: "Where each attack tries to fit in",
        passos: [
          {
            titulo: "Before /authorize: a tampered `redirect_uri`",
            texto:
              "The attacker builds a login link with their own `redirect_uri`. Defense: the AS only accepts pre-registered URIs, compared by exact equality, and does not redirect if they do not match (see Q29).",
          },
          {
            titulo: "On the way back: a forged response (login CSRF)",
            texto:
              "The attacker makes the victim’s browser open `callback?code=...` with a code that belongs to the attacker. Defense: the random `state`, tied to the browser session and checked on return.",
          },
          {
            titulo: "In the redirect: an intercepted code",
            texto:
              "Another app on the device, a log or a proxy captures the code. Defense: PKCE (without the `code_verifier`, the code does not become a token), the short lifetime and the single use. A code used twice must be rejected and, per RFC 6749, the tokens it already produced should be revoked.",
          },
          {
            titulo: "On the way back: an injected code or a substituted token",
            texto:
              "The attacker injects their own code into the victim’s session, or hands the app a token issued to someone else. Defense: PKCE ties the code to the session that asked for it; in OIDC, the `nonce` and the ID token’s `aud` close the gap (see Q24 and Q28).",
          },
          {
            titulo: "At /token and at the API: a stolen credential",
            texto:
              "A leaked `client_secret` or a stolen access token. Defense: strong client authentication (`private_key_jwt`, mTLS), TLS everywhere, short-lived tokens with a narrow `aud` and, in demanding scenarios, sender-constrained tokens (DPoP, RFC 9449; see Q37).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why the code is short-lived and single-use",
        texto:
          "The code exists so that the **token never travels in the URL**: it is just a receipt that the person approved, exchanged for tokens over a direct channel. For that it must be useless if leaked: a **short lifetime** (RFC 6749 recommends at most 10 minutes; in practice it is usually much less), **single use**, tied to the `client_id`, the `redirect_uri` and the `code_challenge`, and exchangeable only by whoever proves to be the client and knows the `code_verifier`.",
      },
    ],
    armadilhas: [
      "Not checking `state` on return (or checking and not discarding it): it is what prevents login CSRF.",
      "Putting a token or `code` in logs, analytics or a return URL: the code is disposable, but the token that follows is not, and tokens must never go in a query string.",
      "Doing the code exchange in the browser for a confidential client, or exposing the `client_secret` to JavaScript: the exchange belongs to the backend.",
      "Sending `/token` a `redirect_uri` different from the one used at `/authorize`, or validating the ID token without checking the `nonce`: the exchange is rejected or the validation is incomplete.",
    ],
    autoteste: [
      {
        pergunta:
          "What travels through the browser and what goes directly between client and server in Authorization Code?",
        resposta:
          "Through the browser (front channel): the authorization request (`client_id`, `redirect_uri`, `scope`, `state`, `code_challenge`) and the code on the way back. Directly (back channel): the exchange of the code for tokens at `/token`, with the `code_verifier` and client authentication, and the API calls.",
      },
      {
        pergunta: "Which validations does the authorization server perform on the code exchange?",
        resposta:
          "That the code exists, has not expired and was not used; that it belongs to this client and this `redirect_uri`; that `S256(code_verifier)` matches the `code_challenge`; and, if the client is confidential, that its credentials are correct.",
      },
    ],
  },
};
