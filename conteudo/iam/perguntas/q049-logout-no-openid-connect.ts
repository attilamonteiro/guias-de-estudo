import type { Pergunta } from "../../tipos";

// Q49 · Logout no OpenID Connect
export const q049: Pergunta = {
  numero: 49,
  modulo: "oidc",
  metodo: "compare",
  pt: {
    titulo: "Logout no OpenID Connect",
    pergunta:
      "Compare as formas de logout no OpenID Connect: RP-initiated logout, front-channel e back-channel. O que cada uma encerra e que limites existem?",
    porqueEsteMetodo:
      "As três formas resolvem partes diferentes do mesmo problema e se confundem com facilidade. Uma matriz as coloca lado a lado e deixa a regra de decisão aparecer.",
    resposta30s:
      "O **RP-initiated logout** é o app pedindo ao IdP, por redirecionamento do navegador, que encerre a sessão (`id_token_hint`, `post_logout_redirect_uri`). **Front-channel** e **back-channel** fazem o caminho inverso: o IdP avisa as aplicações, o primeiro **por iframes no navegador** e o segundo **de servidor para servidor**, com um `logout_token` assinado que traz `sub` e/ou `sid`. Prefira o **back-channel**, que não depende do navegador, e lembre que o logout **não revoga tokens já emitidos** e é, no geral, de melhor esforço.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "As três formas lado a lado",
        colunas: ["Aspecto", "RP-initiated logout", "Front-channel logout", "Back-channel logout"],
        linhas: [
          [
            "Quem inicia",
            "O RP (a sua aplicação), quando o usuário clica em “Sair”",
            "O IdP, quando a sessão termina (logout em outro app, no próprio IdP ou expiração)",
            "O IdP, nas mesmas situações",
          ],
          [
            "Por onde a notícia viaja",
            "Redirecionamento do navegador ao `end_session_endpoint` do IdP e de volta",
            "O navegador: a página de logout do IdP carrega um iframe para o `frontchannel_logout_uri` de cada RP",
            "O servidor: o IdP faz um `POST` direto ao `backchannel_logout_uri` de cada RP, sem navegador",
          ],
          [
            "O que viaja",
            "`id_token_hint`, `post_logout_redirect_uri`, `state`, `client_id`",
            "`iss` e `sid` na URL do iframe, quando o RP pede a sessão",
            "`logout_token`, um JWT assinado com `iss`, `aud`, `iat`, `jti`, `events` e `sub` e/ou `sid`",
          ],
          [
            "O que encerra",
            "A sessão no IdP (o SSO). A do próprio RP é com você; o IdP pode avisar os outros RPs",
            "A sessão do RP no navegador: o cookie do RP acompanha a requisição do iframe",
            "A sessão do RP identificada por `sid` ou `sub`, no servidor, mesmo sem navegador aberto",
          ],
          [
            "Limites",
            "Só acontece se o usuário passar por ali, e o IdP compara o `post_logout_redirect_uri` com o cadastrado",
            "Depende do navegador: cookies de terceiros bloqueados, iframes bloqueados ou aba fechada impedem a notícia de chegar",
            "Exige endpoint público no RP e sessões no servidor indexadas por `sid`; sessão só em cookie, sem estado no servidor, não é alcançada",
          ],
          [
            "Quando usar",
            "Sempre: é o botão “Sair”",
            "Complemento, ou quando não dá para expor um endpoint de servidor",
            "Preferido para propagar o logout: não depende do navegador",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "RP-initiated logout: ida ao IdP e volta ao app",
        legenda: "HTTP",
        codigo:
          "GET /logout?id_token_hint=<ID token>\n  &post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Fsaiu\n  &state=<aleatório> HTTP/1.1\nHost: id.example.com\n\nHTTP/1.1 302 Found\nLocation: https://app.example.com/saiu?state=<aleatório>",
        nota: "A linha de requisição está quebrada só para leitura. O `post_logout_redirect_uri` precisa estar cadastrado no IdP e ser comparado exatamente; sem isso o logout vira um redirecionamento aberto.",
      },
      {
        tipo: "codigo",
        titulo: "O logout_token do back-channel (payload)",
        legenda: "JWT",
        codigo:
          '{\n  "iss": "https://id.example.com",\n  "aud": "meu-cliente",\n  "iat": 1760000000,\n  "exp": 1760000120,\n  "jti": "bWJq9qqDX0",\n  "sub": "248289761001",\n  "sid": "08a5019c-17e1-4977-8f42-65a12843ea02",\n  "events": { "http://schemas.openid.net/event/backchannel-logout": {} }\n}',
        nota: "Chega por `POST`, no campo `logout_token` de um formulário. O RP valida assinatura, `iss`, `aud` e `iat`, exige o membro `events` acima, recusa o token se houver `nonce`, rejeita `jti` repetido e então encerra as sessões do `sid` (ou do `sub`). Responde 200 em sucesso e 400 em falha.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Implemente o botão “Sair” (RP-initiated) **e** o back-channel. O primeiro encerra a sessão no IdP; o segundo avisa, de servidor para servidor, as outras aplicações, sem depender de navegador, abas abertas nem cookies de terceiros. **Prefira o back-channel pela confiabilidade**, e use o front-channel só como complemento ou quando não houver como expor um endpoint no servidor. Para o back-channel funcionar, guarde `iss`, `sub` e `sid` do ID token junto da sessão local no login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Logout não revoga o que já foi emitido",
        texto:
          "Encerrar sessões não invalida os access tokens JWT já emitidos: eles valem até o `exp`, a menos que a API consulte revogação ou introspecção. Mantenha access tokens de vida curta, revogue o refresh token no logout (RFC 7009) e, em operações sensíveis, consulte o estado atual. O logout também é **parcial por natureza**: o IdP federado por trás (Google, o IdP do cliente) pode continuar logado, uma aplicação fora do ar não recebe o aviso, e sessões locais que ninguém encerra sobrevivem. Trate-o como melhor esforço e use a expiração das sessões como rede de segurança.",
      },
    ],
    armadilhas: [
      "Encerrar só a sessão local (apagar o cookie) e deixar a do IdP viva: o próximo “Entrar” reautentica sozinho, sem pedir nada, e o usuário acha que não saiu.",
      "Aceitar qualquer `post_logout_redirect_uri` ou um `id_token_hint` sem validar: o IdP deve exigir correspondência exata com o cadastrado, senão o logout é um redirecionamento aberto.",
      "Contar com o front-channel em navegadores que bloqueiam cookies de terceiros, ou achar que o logout em uma aplicação derruba todas as outras.",
      "Aceitar um `logout_token` sem validar (assinatura, `iss`, `aud`, `events`, `jti`) ou sem ter guardado o `sid` no login: qualquer um que alcance o endpoint derruba sessões alheias, e sem o `sid` não há como saber qual sessão encerrar.",
    ],
    autoteste: [
      {
        pergunta: "Por que o back-channel é mais confiável que o front-channel?",
        resposta:
          "Porque não depende do navegador: o IdP chama o servidor do RP diretamente com um `logout_token` assinado. Funciona com a aba fechada, com cookies de terceiros bloqueados e sem que o usuário esteja na página do IdP.",
      },
      {
        pergunta: "O que o RP precisa guardar no login para o back-channel funcionar?",
        resposta:
          "O `iss`, o `sub` e o `sid` do ID token, associados à sessão local. Ao receber o `logout_token`, o RP encerra as sessões que casam com o `sid` (ou com o `sub`).",
      },
    ],
  },
  en: {
    titulo: "OpenID Connect logout",
    pergunta:
      "Compare the logout mechanisms in OpenID Connect: RP-initiated logout, front-channel and back-channel. What does each one end, and what limits exist?",
    porqueEsteMetodo:
      "The three mechanisms solve different parts of the same problem and are easy to mix up. A matrix puts them side by side and lets the decision rule emerge.",
    resposta30s:
      "**RP-initiated logout** is the app asking the IdP, through a browser redirect, to end the session (`id_token_hint`, `post_logout_redirect_uri`). **Front-channel** and **back-channel** go the other way: the IdP notifies the applications, the first **through iframes in the browser** and the second **server to server**, with a signed `logout_token` carrying `sub` and/or `sid`. Prefer **back-channel**, which does not depend on the browser, and remember that logout **does not revoke tokens already issued** and is generally best effort.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The three mechanisms side by side",
        colunas: ["Aspect", "RP-initiated logout", "Front-channel logout", "Back-channel logout"],
        linhas: [
          [
            "Who starts it",
            "The RP (your application), when the user clicks “Sign out”",
            "The IdP, when the session ends (logout in another app, at the IdP itself or expiry)",
            "The IdP, in the same situations",
          ],
          [
            "How the news travels",
            "A browser redirect to the IdP’s `end_session_endpoint` and back",
            "The browser: the IdP’s logout page loads an iframe pointing to each RP’s `frontchannel_logout_uri`",
            "The server: the IdP sends a `POST` straight to each RP’s `backchannel_logout_uri`, with no browser",
          ],
          [
            "What travels",
            "`id_token_hint`, `post_logout_redirect_uri`, `state`, `client_id`",
            "`iss` and `sid` in the iframe URL, when the RP asks for the session",
            "`logout_token`, a signed JWT with `iss`, `aud`, `iat`, `jti`, `events` and `sub` and/or `sid`",
          ],
          [
            "What it ends",
            "The session at the IdP (the SSO). The RP’s own is up to you; the IdP may notify the other RPs",
            "The RP’s session in the browser: the RP’s cookie goes along with the iframe request",
            "The RP session identified by `sid` or `sub`, on the server, even with no browser open",
          ],
          [
            "Limits",
            "Only happens if the user passes through it, and the IdP compares `post_logout_redirect_uri` with the registered one",
            "Depends on the browser: blocked third-party cookies, blocked iframes or a closed tab keep the news from arriving",
            "Needs a public endpoint on the RP and server-side sessions indexed by `sid`; a cookie-only session with no server state is not reached",
          ],
          [
            "When to use it",
            "Always: it is the “Sign out” button",
            "As a complement, or when you cannot expose a server endpoint",
            "Preferred for propagating logout: it does not depend on the browser",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "RP-initiated logout: to the IdP and back to the app",
        legenda: "HTTP",
        codigo:
          "GET /logout?id_token_hint=<ID token>\n  &post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Fsigned-out\n  &state=<random> HTTP/1.1\nHost: id.example.com\n\nHTTP/1.1 302 Found\nLocation: https://app.example.com/signed-out?state=<random>",
        nota: "The request line is broken across lines only for readability. `post_logout_redirect_uri` must be registered at the IdP and compared exactly; without that, logout becomes an open redirect.",
      },
      {
        tipo: "codigo",
        titulo: "The back-channel logout_token (payload)",
        legenda: "JWT",
        codigo:
          '{\n  "iss": "https://id.example.com",\n  "aud": "my-client",\n  "iat": 1760000000,\n  "exp": 1760000120,\n  "jti": "bWJq9qqDX0",\n  "sub": "248289761001",\n  "sid": "08a5019c-17e1-4977-8f42-65a12843ea02",\n  "events": { "http://schemas.openid.net/event/backchannel-logout": {} }\n}',
        nota: "It arrives by `POST`, in the `logout_token` form field. The RP validates the signature, `iss`, `aud` and `iat`, requires the `events` member above, rejects the token if it has a `nonce`, rejects a repeated `jti` and then ends the sessions for the `sid` (or the `sub`). It answers 200 on success and 400 on failure.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Implement the “Sign out” button (RP-initiated) **and** back-channel. The first ends the session at the IdP; the second notifies the other applications, server to server, with no dependence on the browser, open tabs or third-party cookies. **Prefer back-channel for its reliability**, and use front-channel only as a complement or when you cannot expose a server endpoint. For back-channel to work, store the ID token’s `iss`, `sub` and `sid` alongside the local session at login.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Logout does not revoke what was already issued",
        texto:
          "Ending sessions does not invalidate JWT access tokens already issued: they remain valid until `exp`, unless the API checks revocation or introspection. Keep access tokens short-lived, revoke the refresh token on logout (RFC 7009) and, for sensitive operations, check the current state. Logout is also **partial by nature**: the federated IdP behind yours (Google, the customer’s IdP) may stay signed in, an application that is down never gets the notice, and local sessions nobody ends survive. Treat it as best effort and use session expiry as the safety net.",
      },
    ],
    armadilhas: [
      "Ending only the local session (deleting the cookie) and leaving the IdP’s alive: the next “Sign in” reauthenticates on its own, asking nothing, and the user believes they never left.",
      "Accepting any `post_logout_redirect_uri`, or an unvalidated `id_token_hint`: the IdP must require an exact match with the registered one, otherwise logout is an open redirect.",
      "Counting on front-channel in browsers that block third-party cookies, or assuming that logging out of one application takes down all the others.",
      "Accepting a `logout_token` without validating it (signature, `iss`, `aud`, `events`, `jti`) or without having stored the `sid` at login: anyone who reaches the endpoint can end other people’s sessions, and without the `sid` there is no way to know which session to end.",
    ],
    autoteste: [
      {
        pergunta: "Why is back-channel more reliable than front-channel?",
        resposta:
          "Because it does not depend on the browser: the IdP calls the RP’s server directly with a signed `logout_token`. It works with the tab closed, with third-party cookies blocked and without the user being on the IdP’s page.",
      },
      {
        pergunta: "What must the RP store at login for back-channel to work?",
        resposta:
          "The ID token’s `iss`, `sub` and `sid`, associated with the local session. When the `logout_token` arrives, the RP ends the sessions that match the `sid` (or the `sub`).",
      },
    ],
  },
};
