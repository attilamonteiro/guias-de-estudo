import type { Pergunta } from "../../tipos";

// Q44 · Fluxos do OpenID Connect
export const q044: Pergunta = {
  numero: 44,
  modulo: "oidc",
  metodo: "compare",
  pt: {
    titulo: "Fluxos do OpenID Connect",
    pergunta:
      "Quais fluxos o OpenID Connect define (authorization code, implicit, hybrid) e como o response_type os distingue? Qual é o recomendado hoje e por quê?",
    porqueEsteMetodo:
      "Os três fluxos entregam o mesmo resultado (um ID token) por caminhos diferentes, e a diferença está em por onde os tokens trafegam. Uma matriz lado a lado e uma regra de decisão deixam isso visível e dizem qual escolher.",
    resposta30s:
      "O OpenID Connect define três fluxos, distinguidos pelo `response_type`: **authorization code** (`code`), **implicit** (`id_token` ou `id_token token`) e **hybrid** (`code id_token` e variações). A diferença é por onde os tokens trafegam: no code, o navegador (front channel) leva só um `code`, e os tokens saem do `/token` por um canal direto e autenticado; no implicit, saem pelo navegador, na URL. Hoje o recomendado é **authorization code com PKCE para tudo**; o hybrid fica para integrações legadas e o implicit não se usa em sistemas novos.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Os três fluxos",
        colunas: ["Aspecto", "Authorization code", "Implicit", "Hybrid"],
        linhas: [
          [
            "`response_type`",
            "`code`",
            "`id_token` ou `id_token token`",
            "`code id_token`, `code token` ou `code id_token token`",
          ],
          [
            "O que volta pelo navegador (front channel)",
            "Só o `code`, de uso único e curta duração",
            "Os tokens, na resposta de autorização",
            "O `code` e alguns tokens (por exemplo, o ID token)",
          ],
          [
            "Onde os tokens são emitidos",
            "No `/token`, por um canal direto (back channel) e autenticado",
            "No `/authorize`, pela URL (fragmento) do navegador",
            "Parte no `/authorize`, parte no `/token`",
          ],
          [
            "Autenticação do client e refresh token",
            "Possível; o refresh token pode ser emitido",
            "Sem autenticação do client e sem refresh token",
            "Como no code, para os tokens que saem do `/token`",
          ],
          [
            "Validação extra",
            "`state` ou PKCE, `nonce` e as verificações do ID token",
            "`nonce` obrigatório; `at_hash` quando há access token",
            "`c_hash` (liga o ID token ao `code`) e `at_hash`, conforme o `response_type`",
          ],
          [
            "Situação hoje",
            "Recomendado, com PKCE, para todos os tipos de aplicação",
            "Desaconselhado; removido do OAuth 2.1",
            "Legado: só se uma integração antiga exigir",
          ],
        ],
        nota: "Fora do OpenID Connect, o OAuth 2.0 tem outros grants (client credentials para serviços, device code para dispositivos sem teclado, refresh token); veja o módulo B.",
      },
      {
        tipo: "codigo",
        titulo: "Três requisições, três response_type",
        legenda: "HTTP",
        codigo: `# code (recomendado), com PKCE
GET /authorize?response_type=code&scope=openid&client_id=app
    &redirect_uri=...&state=...&nonce=...
    &code_challenge=...&code_challenge_method=S256

# implicit (legado): o ID token volta direto, no fragmento da URL
GET /authorize?response_type=id_token&scope=openid&client_id=app
    &redirect_uri=...&state=...&nonce=...

# hybrid (legado): code e ID token juntos; form_post evita o token na URL
GET /authorize?response_type=code%20id_token&scope=openid&client_id=app
    &redirect_uri=...&state=...&nonce=...&response_mode=form_post`,
        nota: "O `response_mode` define como a resposta chega: `query` (padrão do code), `fragment` (padrão do implicit e do hybrid) ou `form_post`, um POST automático que mantém o token fora da URL.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use **authorization code com PKCE para tudo**: aplicação web com backend, SPA e mobile. O resto é história. O **implicit** existia porque navegadores antigos não faziam requisições entre origens (CORS) para o `/token`, e hoje isso não é mais desculpa. O **hybrid** servia a quem queria o ID token já na ida (por exemplo, para validar a sessão antes de trocar o `code`) e, com PKCE e o parâmetro `iss`, deixou de ser necessário. Mantenha o hybrid só em integrações legadas que não dá para trocar, e não crie implicit novo (veja Q39).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Armadilhas dos fluxos legados",
        texto:
          "Um ID token no fragmento da URL fica no histórico e pode ser lido por qualquer script da página. Se o hybrid for inevitável, use `response_mode=form_post`, que entrega a resposta por `POST` no corpo, e valide `c_hash` e `at_hash` (a metade esquerda do hash SHA-2 do `code` e do access token, com o mesmo algoritmo do ID token), além de `nonce`, `iss`, `aud` e assinatura. Lembre que o `form_post` é um POST vindo de outro site: cookies `SameSite=Lax` não o acompanham, e o cookie que guardava o `state` ou o `nonce` pode não chegar ao callback (sintoma: erro de correlação logo após o login).",
      },
    ],
    armadilhas: [
      "Usar `response_type=id_token token` numa SPA nova “porque o tutorial era assim”: os tokens vão pela URL, e hoje a SPA usa code com PKCE.",
      "Aceitar o ID token do fragmento sem validar `nonce`, `iss`, `aud`, assinatura e, quando houver, `c_hash` e `at_hash`.",
      "Achar que o `response_type` muda só o formato da resposta: ele muda quem entrega os tokens e quais proteções cabem (autenticação do client, refresh token).",
      "Esquecer que o `form_post` não leva cookies `SameSite=Lax` no callback, e perder o `state` ou o `nonce` guardados em cookie.",
    ],
    autoteste: [
      {
        pergunta: "Como o `response_type` distingue os três fluxos?",
        resposta:
          "`code` é o authorization code; `id_token` ou `id_token token` é o implicit; qualquer combinação que traga `code` junto de `id_token` ou `token` (como `code id_token`) é o hybrid.",
      },
      {
        pergunta: "Por que o authorization code com PKCE é o recomendado?",
        resposta:
          "Porque nenhum token passa pelo navegador: ele leva só um `code` de uso único, trocado por tokens num canal direto, em que o client pode se autenticar e que permite refresh token. O PKCE prende o `code` ao client que iniciou o fluxo, o que impede a interceptação.",
      },
    ],
  },
  en: {
    titulo: "OpenID Connect flows",
    pergunta:
      "Which flows does OpenID Connect define (authorization code, implicit, hybrid), and how does response_type tell them apart? Which is recommended today, and why?",
    porqueEsteMetodo:
      "The three flows deliver the same result (an ID token) by different paths, and the difference is where the tokens travel. A side-by-side matrix and a decision rule make that visible and say which to choose.",
    resposta30s:
      "OpenID Connect defines three flows, told apart by `response_type`: **authorization code** (`code`), **implicit** (`id_token` or `id_token token`) and **hybrid** (`code id_token` and variations). The difference is where the tokens travel: in code, the browser (front channel) carries only a `code`, and the tokens come out of `/token` over a direct, authenticated channel; in implicit, they come out through the browser, in the URL. Today the recommendation is **authorization code with PKCE for everything**; hybrid is left for legacy integrations and implicit is not used in new systems.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The three flows",
        colunas: ["Aspect", "Authorization code", "Implicit", "Hybrid"],
        linhas: [
          [
            "`response_type`",
            "`code`",
            "`id_token` or `id_token token`",
            "`code id_token`, `code token` or `code id_token token`",
          ],
          [
            "What comes back through the browser (front channel)",
            "Only the `code`, single-use and short-lived",
            "The tokens, in the authorization response",
            "The `code` and some tokens (for example, the ID token)",
          ],
          [
            "Where the tokens are issued",
            "At `/token`, over a direct (back channel), authenticated connection",
            "At `/authorize`, through the browser’s URL (fragment)",
            "Partly at `/authorize`, partly at `/token`",
          ],
          [
            "Client authentication and refresh token",
            "Possible; a refresh token can be issued",
            "No client authentication and no refresh token",
            "As in code, for the tokens that come from `/token`",
          ],
          [
            "Extra validation",
            "`state` or PKCE, `nonce` and the ID token checks",
            "`nonce` required; `at_hash` when there is an access token",
            "`c_hash` (ties the ID token to the `code`) and `at_hash`, depending on the `response_type`",
          ],
          [
            "Status today",
            "Recommended, with PKCE, for every kind of application",
            "Discouraged; removed from OAuth 2.1",
            "Legacy: only if an old integration demands it",
          ],
        ],
        nota: "Outside OpenID Connect, OAuth 2.0 has other grants (client credentials for services, device code for devices without a keyboard, refresh token); see module B.",
      },
      {
        tipo: "codigo",
        titulo: "Three requests, three response_type values",
        legenda: "HTTP",
        codigo: `# code (recommended), with PKCE
GET /authorize?response_type=code&scope=openid&client_id=app
    &redirect_uri=...&state=...&nonce=...
    &code_challenge=...&code_challenge_method=S256

# implicit (legacy): the ID token comes straight back, in the URL fragment
GET /authorize?response_type=id_token&scope=openid&client_id=app
    &redirect_uri=...&state=...&nonce=...

# hybrid (legacy): code and ID token together; form_post keeps the token out of the URL
GET /authorize?response_type=code%20id_token&scope=openid&client_id=app
    &redirect_uri=...&state=...&nonce=...&response_mode=form_post`,
        nota: "The `response_mode` defines how the response arrives: `query` (the default for code), `fragment` (the default for implicit and hybrid) or `form_post`, an automatic POST that keeps the token out of the URL.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use **authorization code with PKCE for everything**: web apps with a backend, SPAs and mobile. The rest is history. **Implicit** existed because old browsers could not make cross-origin requests (CORS) to `/token`, and that is no longer an excuse. **Hybrid** served those who wanted the ID token on the way out (for example, to validate the session before redeeming the `code`) and, with PKCE and the `iss` parameter, it stopped being necessary. Keep hybrid only in legacy integrations that cannot be replaced, and do not create new implicit flows (see Q39).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Pitfalls of the legacy flows",
        texto:
          "An ID token in the URL fragment stays in history and can be read by any script on the page. If hybrid is unavoidable, use `response_mode=form_post`, which delivers the response by `POST` in the body, and validate `c_hash` and `at_hash` (the left half of the SHA-2 hash of the `code` and of the access token, with the same algorithm as the ID token), plus `nonce`, `iss`, `aud` and the signature. Remember that `form_post` is a POST coming from another site: `SameSite=Lax` cookies do not travel with it, and the cookie that held the `state` or `nonce` may not reach the callback (symptom: a correlation error right after login).",
      },
    ],
    armadilhas: [
      "Using `response_type=id_token token` in a new SPA “because the tutorial did”: the tokens go through the URL, and today the SPA uses code with PKCE.",
      "Accepting the ID token from the fragment without validating `nonce`, `iss`, `aud`, the signature and, when present, `c_hash` and `at_hash`.",
      "Thinking `response_type` only changes the response format: it changes who delivers the tokens and which protections fit (client authentication, refresh token).",
      "Forgetting that `form_post` does not carry `SameSite=Lax` cookies to the callback, and losing the `state` or `nonce` kept in a cookie.",
    ],
    autoteste: [
      {
        pergunta: "How does `response_type` tell the three flows apart?",
        resposta:
          "`code` is the authorization code flow; `id_token` or `id_token token` is implicit; any combination that brings `code` together with `id_token` or `token` (such as `code id_token`) is hybrid.",
      },
      {
        pergunta: "Why is authorization code with PKCE the recommended flow?",
        resposta:
          "Because no token passes through the browser: it carries only a single-use `code`, redeemed for tokens over a direct channel where the client can authenticate and a refresh token is possible. PKCE binds the `code` to the client that started the flow, which prevents interception.",
      },
    ],
  },
};
