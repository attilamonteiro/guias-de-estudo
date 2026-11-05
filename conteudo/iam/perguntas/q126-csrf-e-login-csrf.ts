import type { Pergunta } from "../../tipos";

// Q126 · CSRF e login CSRF
export const q126: Pergunta = {
  numero: 126,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "CSRF e login CSRF",
    pergunta:
      "O que são CSRF e login CSRF? Como o parâmetro state, cookies SameSite e tokens anti-CSRF defendem aplicações com sessão e fluxos OAuth?",
    porqueEsteMetodo:
      "CSRF só faz sentido quando se vê o ataque do ponto de vista do navegador, que anexa cookies sozinho. Cada par ataque → defesa mostra qual prova de intenção falta e qual mecanismo (`SameSite`, token, `state`) a devolve.",
    resposta30s:
      "No **CSRF**, outro site faz o navegador da vítima enviar uma requisição ao seu aplicativo, e o navegador anexa o cookie de sessão **automaticamente**: o servidor não tem como saber se a ação foi **intencional**. No **login CSRF**, a vítima é autenticada, sem saber, na conta do **invasor**. As defesas são `SameSite` nos cookies, **tokens anti-CSRF**, verificação de `Origin`, `state` no OAuth e reautenticação em ações críticas.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "CSRF clássico: uma página do invasor envia um formulário ao seu endpoint (`POST /conta/email`); o navegador anexa o cookie de sessão e a ação é executada",
            destino:
              "**Cookies `SameSite=Lax` ou `Strict`** (o navegador não envia o cookie em requisições cross-site que não sejam navegação segura) **e token anti-CSRF** em toda requisição que altera estado: um valor imprevisível, ligado à sessão, que só o código do seu site conhece (token sincronizador, ou double submit com valor assinado).",
          },
          {
            origem:
              "Ações com efeito colateral em GET (`/transferir?valor=…`, `/sair`), disparáveis por uma imagem ou um link",
            destino:
              "Mudança de estado só em **POST, PUT, PATCH ou DELETE**; GET deve ser seguro e sem efeito. O `SameSite=Lax` não cobre quem usa GET para agir.",
          },
          {
            origem:
              "Requisições cross-site que o navegador envia sem preflight (formulário, `text/plain`) e que chegam ao servidor como se fossem legítimas",
            destino:
              "Verificar `Origin` (e, quando houver, `Sec-Fetch-Site`) contra a lista de origens permitidas, exigir cabeçalho personalizado ou `Content-Type: application/json` com CORS restrito (o que força o preflight), e recusar corpo que não seja de fato JSON.",
          },
          {
            origem:
              "**Login CSRF**: o invasor faz a vítima enviar o login com as credenciais dele; a vítima passa a usar a conta do invasor e deixa ali dados (buscas, endereços, cartão, documentos) que ele depois lê",
            destino:
              "O formulário de login também leva **token anti-CSRF** (ligado a um cookie pré-sessão), com verificação de `Origin` e `SameSite`. Gere uma sessão nova depois do login (veja Q83).",
          },
          {
            origem:
              "**CSRF no OAuth**: o invasor inicia um fluxo, obtém um `code` da conta dele e leva a vítima a abrir `…/callback?code=DO_INVASOR`; a aplicação conclui o login na conta do invasor ou **vincula a conta externa dele** à da vítima",
            destino:
              "**`state`** imprevisível, gerado por fluxo, guardado no navegador que iniciou o login (cookie ou sessão), conferido no callback e descartado (veja Q29). O **PKCE** também liga o code ao navegador que começou (veja Q28). Para vincular conta, exija reautenticação.",
          },
          {
            origem:
              "Ações críticas (trocar e-mail, trocar senha, desativar MFA) executadas por uma sessão que o invasor consegue acionar",
            destino:
              "**Reautenticação** ou step-up antes da ação crítica (veja Q99) e aviso ao usuário. Mesmo um CSRF bem-sucedido esbarra na confirmação que o invasor não consegue dar.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cookie e requisição protegidos",
        legenda: "HTTP",
        codigo: `HTTP/1.1 200 OK
Set-Cookie: __Host-sid=7c1f…; Path=/; Secure; HttpOnly; SameSite=Lax

POST /conta/email HTTP/1.1
Host: app.exemplo.com
Cookie: __Host-sid=7c1f…
Origin: https://app.exemplo.com
X-CSRF-Token: 9b1e4a…
Content-Type: application/json

{"email":"nova@exemplo.com"}`,
        nota: "O servidor confere o `Origin` e compara o `X-CSRF-Token` com o valor ligado à sessão. Uma página do invasor pode provocar o envio do cookie (se o `SameSite` permitir), mas não consegue ler nem adivinhar o token.",
      },
      {
        tipo: "codigo",
        titulo: "Gerar e conferir o state (Node.js, Express)",
        legenda: "TypeScript",
        codigo: `import { randomBytes, timingSafeEqual } from "node:crypto";

// Início do login: um state imprevisível, preso ao navegador por um cookie
const state = randomBytes(32).toString("base64url");
res.cookie("__Host-oauth_state", state, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 10 * 60 * 1000,
});
// ... redireciona para /authorize?...&state=<state>

// Callback: compara com o cookie e descarta (uso único)
const esperado = Buffer.from(req.cookies["__Host-oauth_state"] ?? "");
const recebido = Buffer.from(String(req.query.state ?? ""));
res.clearCookie("__Host-oauth_state", { path: "/", secure: true });
if (esperado.length === 0 || esperado.length !== recebido.length || !timingSafeEqual(esperado, recebido)) {
  return res.status(400).send("state inválido"); // recuse e registre o evento
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A causa e o remédio",
        texto:
          "A causa é que o cookie prova **quem** é a pessoa, mas não prova que **ela quis** aquela ação. Cada defesa devolve a prova de intenção: o `SameSite` impede o navegador de enviar o cookie fora do contexto; o **token anti-CSRF** é algo que só o seu site, rodando no navegador da vítima, conhece; o **`state`** faz o mesmo no fluxo OAuth, ligando a resposta ao pedido que este navegador iniciou. Use duas camadas, não uma.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limites e pegadinhas",
        texto:
          "**Bearer tokens no cabeçalho `Authorization`** não são anexados sozinhos pelo navegador, então APIs que usam só isso não sofrem CSRF clássico (já cookies de sessão, inclusive num BFF, sofrem). **`SameSite` não é tudo**: subdomínios do mesmo site, navegadores sem suporte e o tratamento padrão que alguns navegadores dão a cookies sem atributo (como `Lax`) não substituem o token. `SameSite=Strict` no cookie de sessão pode quebrar o retorno do IdP (veja Q144), e, se o IdP responde por `form_post` (um POST cross-site), o cookie `Lax` do `state` não acompanha: nesse caso use `SameSite=None; Secure` para o cookie do `state` ou outro vínculo. E um XSS derrota qualquer token anti-CSRF (veja Q127).",
      },
    ],
    armadilhas: [
      "Achar que o CORS protege contra CSRF: o CORS controla a leitura da resposta, e a requisição forjada chega ao servidor mesmo assim.",
      "Aplicar o token só em formulários e esquecer a tela de login, as APIs com cookie e as requisições AJAX.",
      "Gerar um `state` previsível, reaproveitado ou sem vínculo com o navegador (ou gerá-lo e nunca conferi-lo no callback).",
      "Confiar só no `SameSite`: é uma ótima camada, mas não cobre todos os cenários (mesmo site, navegadores sem suporte, GET com efeito colateral).",
    ],
    autoteste: [
      {
        pergunta: "Por que o `state` do OAuth é uma defesa contra CSRF?",
        resposta:
          "Porque é um valor imprevisível que a aplicação gera ao iniciar o fluxo, guarda no navegador e confere no callback. Se um invasor entrega à vítima um callback com um code da conta dele, o `state` não bate, e a aplicação recusa.",
      },
      {
        pergunta: "O que é login CSRF e por que é prejudicial se a vítima “só” entrou numa conta?",
        resposta:
          "O invasor faz a vítima se autenticar na conta dele. A vítima, sem notar, usa essa conta e deposita nela dados (buscas, endereços, cartão, arquivos) que o invasor depois lê. Defende-se com token anti-CSRF também no login e com uma sessão nova depois dele.",
      },
    ],
  },
  en: {
    titulo: "CSRF and login CSRF",
    pergunta:
      "What are CSRF and login CSRF? How do the state parameter, SameSite cookies and anti-CSRF tokens defend session-based apps and OAuth flows?",
    porqueEsteMetodo:
      "CSRF only makes sense once you see the attack from the browser’s point of view, since it attaches cookies on its own. Each attack → defense pair shows which proof of intent is missing and which mechanism (`SameSite`, token, `state`) restores it.",
    resposta30s:
      "In **CSRF**, another site makes the victim’s browser send a request to your application, and the browser attaches the session cookie **automatically**: the server has no way of knowing whether the action was **intended**. In **login CSRF**, the victim is signed in, unknowingly, to the **attacker’s** account. The defenses are `SameSite` on cookies, **anti-CSRF tokens**, `Origin` verification, `state` in OAuth and reauthentication on critical actions.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "Classic CSRF: an attacker’s page submits a form to your endpoint (`POST /account/email`); the browser attaches the session cookie and the action runs",
            destino:
              "**`SameSite=Lax` or `Strict` cookies** (the browser does not send the cookie on cross-site requests that are not safe navigation) **and an anti-CSRF token** on every state-changing request: an unpredictable value, tied to the session, that only your site’s code knows (synchronizer token, or double submit with a signed value).",
          },
          {
            origem:
              "Actions with side effects on GET (`/transfer?amount=…`, `/logout`), triggerable by an image or a link",
            destino:
              "Change state only on **POST, PUT, PATCH or DELETE**; GET must be safe and side-effect-free. `SameSite=Lax` does not cover those who use GET to act.",
          },
          {
            origem:
              "Cross-site requests the browser sends without a preflight (form, `text/plain`) that reach the server as if legitimate",
            destino:
              "Verify `Origin` (and `Sec-Fetch-Site`, when present) against the list of allowed origins, require a custom header or `Content-Type: application/json` with restrictive CORS (which forces the preflight), and refuse a body that is not really JSON.",
          },
          {
            origem:
              "**Login CSRF**: the attacker makes the victim submit a login with the attacker’s credentials; the victim starts using the attacker’s account and leaves data there (searches, addresses, card, documents) that the attacker later reads",
            destino:
              "The login form also carries an **anti-CSRF token** (tied to a pre-session cookie), with `Origin` verification and `SameSite`. Create a new session after login (see Q83).",
          },
          {
            origem:
              "**CSRF in OAuth**: the attacker starts a flow, gets a `code` for their own account and gets the victim to open `…/callback?code=ATTACKERS`; the application completes the login into the attacker’s account or **links the attacker’s external account** to the victim’s",
            destino:
              "An unpredictable **`state`**, generated per flow, stored in the browser that started the login (cookie or session), checked at the callback and discarded (see Q29). **PKCE** also ties the code to the browser that began (see Q28). To link an account, require reauthentication.",
          },
          {
            origem:
              "Critical actions (changing email, changing password, disabling MFA) run by a session the attacker can trigger",
            destino:
              "**Reauthentication** or step-up before the critical action (see Q99) and a notice to the user. Even a successful CSRF runs into a confirmation the attacker cannot give.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A protected cookie and request",
        legenda: "HTTP",
        codigo: `HTTP/1.1 200 OK
Set-Cookie: __Host-sid=7c1f…; Path=/; Secure; HttpOnly; SameSite=Lax

POST /account/email HTTP/1.1
Host: app.example.com
Cookie: __Host-sid=7c1f…
Origin: https://app.example.com
X-CSRF-Token: 9b1e4a…
Content-Type: application/json

{"email":"new@example.com"}`,
        nota: "The server checks the `Origin` and compares the `X-CSRF-Token` with the value tied to the session. An attacker’s page can cause the cookie to be sent (if `SameSite` allows it), but cannot read or guess the token.",
      },
      {
        tipo: "codigo",
        titulo: "Generating and checking the state (Node.js, Express)",
        legenda: "TypeScript",
        codigo: `import { randomBytes, timingSafeEqual } from "node:crypto";

// Start of login: an unpredictable state, tied to the browser by a cookie
const state = randomBytes(32).toString("base64url");
res.cookie("__Host-oauth_state", state, {
  httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 10 * 60 * 1000,
});
// ... redirect to /authorize?...&state=<state>

// Callback: compare with the cookie and discard it (single use)
const expected = Buffer.from(req.cookies["__Host-oauth_state"] ?? "");
const received = Buffer.from(String(req.query.state ?? ""));
res.clearCookie("__Host-oauth_state", { path: "/", secure: true });
if (expected.length === 0 || expected.length !== received.length || !timingSafeEqual(expected, received)) {
  return res.status(400).send("invalid state"); // refuse and log the event
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The cause and the remedy",
        texto:
          "The cause is that the cookie proves **who** the person is, but not that **they wanted** that action. Each defense restores the proof of intent: `SameSite` stops the browser from sending the cookie out of context; the **anti-CSRF token** is something only your site, running in the victim’s browser, knows; **`state`** does the same in the OAuth flow, tying the response to the request this browser started. Use two layers, not one.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Limits and gotchas",
        texto:
          "**Bearer tokens in the `Authorization` header** are not attached by the browser on its own, so APIs that use only that do not suffer classic CSRF (session cookies, including in a BFF, do). **`SameSite` is not everything**: subdomains of the same site, browsers without support and the default treatment some browsers give cookies with no attribute (as `Lax`) do not replace the token. `SameSite=Strict` on the session cookie can break the return from the IdP (see Q144), and, if the IdP responds with `form_post` (a cross-site POST), the `Lax` cookie holding the `state` does not come along: in that case use `SameSite=None; Secure` for the `state` cookie or another binding. And an XSS defeats any anti-CSRF token (see Q127).",
      },
    ],
    armadilhas: [
      "Believing CORS protects against CSRF: CORS controls reading the response, and the forged request reaches the server anyway.",
      "Applying the token only to forms and forgetting the login page, cookie-based APIs and AJAX requests.",
      "Generating a predictable `state`, reusing it or not tying it to the browser (or generating it and never checking it at the callback).",
      "Relying on `SameSite` alone: it is a great layer, but does not cover every scenario (same site, browsers without support, GET with side effects).",
    ],
    autoteste: [
      {
        pergunta: "Why is the OAuth `state` a defense against CSRF?",
        resposta:
          "Because it is an unpredictable value the application generates when starting the flow, stores in the browser and checks at the callback. If an attacker hands the victim a callback with a code from the attacker’s account, the `state` does not match, and the application refuses.",
      },
      {
        pergunta: "What is login CSRF, and why is it harmful if the victim “only” signed in to an account?",
        resposta:
          "The attacker makes the victim authenticate into the attacker’s account. The victim, without noticing, uses that account and deposits data in it (searches, addresses, card, files) that the attacker later reads. The defense is an anti-CSRF token on login too, and a new session after it.",
      },
    ],
  },
};
