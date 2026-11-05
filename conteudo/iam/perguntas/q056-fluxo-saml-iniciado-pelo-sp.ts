import type { Pergunta } from "../../tipos";

// Q56 · Fluxo SAML iniciado pelo SP
export const q056: Pergunta = {
  numero: 56,
  modulo: "saml",
  metodo: "trace",
  pt: {
    titulo: "Fluxo SAML iniciado pelo SP",
    pergunta:
      "Descreva passo a passo o fluxo de SSO SAML iniciado pelo SP (Web Browser SSO), da primeira requisição até o acesso à aplicação.",
    porqueEsteMetodo:
      "O SSO SAML é uma coreografia entre três atores (navegador, SP e IdP) em que cada mensagem só faz sentido pela anterior. Seguir um único login do começo ao fim, inclusive onde ele falha, mostra o que o SP precisa guardar e conferir.",
    resposta30s:
      "No fluxo **iniciado pelo SP**, o usuário pede um recurso protegido, o SP gera um **`AuthnRequest`** (com `ID` único e um **`RelayState`**) e redireciona o navegador ao IdP. O IdP autentica o usuário (ou reaproveita a sessão dele) e devolve, por **POST**, uma **`Response`** com a assertion assinada ao **ACS** do SP. O SP **valida** a resposta, casa o `InResponseTo` com o `ID` que guardou, cria a sessão e leva o usuário ao recurso original.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Um login, no caminho feliz",
        etapas: [
          "O usuário abre `https://app.example.com/relatorios` sem sessão. O SP guarda o destino pedido e decide iniciar o login",
          "O SP monta o `AuthnRequest`: `ID` novo e aleatório (comece com letra ou `_`, porque o tipo `xs:ID` não aceita dígito na frente), `IssueInstant`, `Destination`, `Issuer` (o `entityID` do SP) e o ACS esperado. Guarda o `ID` com validade curta e cria um **`RelayState`** que aponta para o destino guardado",
          "O SP responde `302` para o endpoint de SSO do IdP, levando `SAMLRequest` (XML comprimido, em base64 e codificado na URL) e `RelayState` na query string (binding HTTP-Redirect, veja Q59)",
          "O IdP confere o `Issuer` e o ACS pedido contra o metadata que tem do SP. Se o usuário já tem sessão no IdP, a autenticação é pulada (é isso que torna o SSO “único”); senão, o IdP mostra o login, com MFA se a política exigir. `ForceAuthn` obriga a reautenticar e `IsPassive` proíbe qualquer tela",
          "O IdP monta a `Response`: `InResponseTo` com o `ID` do pedido, `Destination` com o ACS, `Status` de sucesso e uma assertion assinada (veja Q58). Devolve ao navegador uma página com um formulário que se envia sozinho",
          "O navegador faz `POST` para o ACS do SP com `SAMLResponse` (base64) e o mesmo `RelayState`, sem alteração",
          "O SP executa a validação completa (veja Q63): assinatura, `Issuer`, `Destination`, `Audience`, janela de validade e `InResponseTo`. O `ID` do pedido é consumido: só vale uma vez",
          "O SP cria a sessão **própria** (com identificador novo), mapeia o usuário para uma conta (veja Q60), resolve o `RelayState` para o destino guardado e redireciona. O usuário vê `/relatorios`",
        ],
        nota: "Depois disso a assertion cumpriu o papel: ela é consumida uma vez e vira uma sessão do SP. O SP não conversa mais com o IdP até a sessão acabar ou até um logout (veja Q66).",
      },
      {
        tipo: "passos",
        titulo: "Agora os caminhos em que dá errado",
        passos: [
          {
            titulo: "O IdP recusa ou o usuário desiste",
            texto:
              "A `Response` volta com `Status` diferente de sucesso (falha de autenticação, ou `NoPassive` quando o SP pediu `IsPassive` e não havia sessão). Não há assertion: o SP mostra um erro claro e **não cria sessão**, nem repete o pedido em laço.",
          },
          {
            titulo: "`InResponseTo` desconhecido",
            texto:
              "O `ID` não está na lista de pedidos pendentes: expirou (o usuário demorou), já foi usado (replay) ou nunca foi emitido por este SP (resposta forjada ou injetada). Rejeite. Essa checagem só funciona porque o SP guardou o `ID` na ida.",
          },
          {
            titulo: "O estado se perdeu na volta",
            texto:
              "O `POST` do IdP é uma requisição **entre sites**: cookies do SP com `SameSite=Lax` ou `Strict` não vão nela. Se o estado do login estava só num cookie assim, o SP não reconhece o navegador. Guarde o `ID` no servidor (cache com validade) e, se amarrar ao navegador por cookie, use `SameSite=None; Secure`. Duas abas fazendo login ao mesmo tempo pedem uma lista de pedidos, não um valor único.",
          },
          {
            titulo: "`RelayState` adulterado",
            texto:
              "O valor volta pelo navegador, então não é confiável. Se for uma URL e o SP redirecionar para ela sem checar, vira **open redirect**. Use um identificador opaco que aponte para o destino guardado no servidor, ou uma lista de destinos permitidos; se não reconhecer o valor, leve o usuário à página inicial.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "As três mensagens que passam pelo navegador",
        legenda: "HTTP",
        codigo: `# 1. SP -> navegador
HTTP/1.1 302 Found
Location: https://idp.example.com/sso?SAMLRequest=fZJNb4Mw...&RelayState=r_8f2a

# 2. IdP -> navegador (página que se envia sozinha)
<form method="post" action="https://app.example.com/saml/acs">
  <input type="hidden" name="SAMLResponse" value="PHNhbWxwOlJlc3BvbnNl...">
  <input type="hidden" name="RelayState" value="r_8f2a">
</form>

# 3. navegador -> SP
POST /saml/acs HTTP/1.1
Host: app.example.com
Content-Type: application/x-www-form-urlencoded

SAMLResponse=PHNhbWxwOlJlc3BvbnNl...&RelayState=r_8f2a`,
        nota: "`SAMLRequest` é o `AuthnRequest` comprimido (DEFLATE), em base64 e codificado na URL; `SAMLResponse` é a `Response` em base64, sem compressão. Os valores estão truncados.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "RelayState: o que é e como tratar",
        texto:
          "O **`RelayState`** é um valor opaco que o SP envia ao IdP e que o IdP devolve **sem alterar**. Serve para o SP lembrar o que o usuário queria (normalmente o destino) quando a resposta chega, já que o `POST` do IdP não traz outra pista do acesso original. A especificação de bindings limita o valor a 80 bytes e recomenda protegê-lo contra adulteração; por isso o comum é enviar uma chave curta que aponta para o destino guardado no servidor. Trate-o sempre como **entrada não confiável**. No fluxo iniciado pelo IdP ele pode chegar sem pedido correspondente (veja Q57).",
      },
    ],
    armadilhas: [
      "Não guardar o `ID` do `AuthnRequest` (ou guardá-lo sem prazo): sem ele não há como checar o `InResponseTo`, e respostas não solicitadas ou repetidas passam.",
      "Guardar o estado do login só em cookie `SameSite=Lax` ou `Strict`: o `POST` do IdP é entre sites e o cookie não chega. O sintoma é o usuário voltar ao login em laço.",
      "Usar o `RelayState` como URL de redirecionamento sem validar: abre uma porta para open redirect.",
      "Criar a sessão antes de validar a resposta, ou reaproveitar o identificador de sessão anterior ao login: o certo é emitir um identificador novo depois de validar (evita fixação de sessão).",
    ],
    autoteste: [
      {
        pergunta: "Que dados o SP precisa guardar entre o redirecionamento e a volta, e para quê?",
        resposta:
          "O `ID` do `AuthnRequest`, com prazo curto, para casar com o `InResponseTo` uma única vez, e o destino original, apontado pelo `RelayState`. Opcionalmente, algo que ligue o pedido ao navegador que o iniciou.",
      },
      {
        pergunta: "Por que o IdP envia a `Response` por `POST` e não por redirect?",
        resposta:
          "Porque a resposta carrega a assertion assinada, grande demais para uma URL e que não deve ficar em logs, histórico e cabeçalhos `Referer`. O `POST` leva o conteúdo no corpo (veja Q59).",
      },
    ],
  },
  en: {
    titulo: "SP-initiated SAML flow",
    pergunta:
      "Walk through the SP-initiated SAML SSO flow (Web Browser SSO) step by step, from the first request to access to the application.",
    porqueEsteMetodo:
      "SAML SSO is a choreography between three actors (browser, SP and IdP) where each message only makes sense because of the previous one. Following a single login from start to finish, including where it fails, shows what the SP must store and check.",
    resposta30s:
      "In the **SP-initiated** flow, the user requests a protected resource, the SP builds an **`AuthnRequest`** (with a unique `ID` and a **`RelayState`**) and redirects the browser to the IdP. The IdP authenticates the user (or reuses their session) and returns, by **POST**, a **`Response`** carrying the signed assertion to the SP’s **ACS**. The SP **validates** the response, matches `InResponseTo` with the `ID` it stored, creates the session and sends the user to the original resource.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One login, on the happy path",
        etapas: [
          "The user opens `https://app.example.com/reports` without a session. The SP remembers the requested destination and decides to start a login",
          "The SP builds the `AuthnRequest`: a fresh, random `ID` (start with a letter or `_`, because the `xs:ID` type does not accept a leading digit), `IssueInstant`, `Destination`, `Issuer` (the SP’s `entityID`) and the expected ACS. It stores the `ID` with a short lifetime and creates a **`RelayState`** that points to the remembered destination",
          "The SP answers `302` to the IdP’s SSO endpoint, carrying `SAMLRequest` (compressed XML, base64 and URL-encoded) and `RelayState` in the query string (HTTP-Redirect binding, see Q59)",
          "The IdP checks the `Issuer` and the requested ACS against the SP metadata it holds. If the user already has an IdP session, authentication is skipped (that is what makes the SSO “single”); otherwise the IdP shows the login, with MFA if policy requires it. `ForceAuthn` forces re-authentication and `IsPassive` forbids any screen",
          "The IdP builds the `Response`: `InResponseTo` with the request’s `ID`, `Destination` with the ACS, a success `Status` and a signed assertion (see Q58). It returns to the browser a page with a self-submitting form",
          "The browser sends a `POST` to the SP’s ACS with `SAMLResponse` (base64) and the same, unchanged `RelayState`",
          "The SP runs the full validation (see Q63): signature, `Issuer`, `Destination`, `Audience`, validity window and `InResponseTo`. The request’s `ID` is consumed: it works only once",
          "The SP creates **its own** session (with a new identifier), maps the user to an account (see Q60), resolves the `RelayState` to the remembered destination and redirects. The user sees `/reports`",
        ],
        nota: "After that the assertion has done its job: it is consumed once and turns into an SP session. The SP does not talk to the IdP again until the session ends or a logout happens (see Q66).",
      },
      {
        tipo: "passos",
        titulo: "Now the paths where it goes wrong",
        passos: [
          {
            titulo: "The IdP refuses or the user gives up",
            texto:
              "The `Response` comes back with a non-success `Status` (authentication failure, or `NoPassive` when the SP asked for `IsPassive` and there was no session). There is no assertion: the SP shows a clear error and **creates no session**, and does not retry in a loop.",
          },
          {
            titulo: "Unknown `InResponseTo`",
            texto:
              "The `ID` is not in the list of pending requests: it expired (the user took too long), was already used (replay) or was never issued by this SP (a forged or injected response). Reject it. This check only works because the SP stored the `ID` on the way out.",
          },
          {
            titulo: "The state got lost on the way back",
            texto:
              "The IdP’s `POST` is a **cross-site** request: SP cookies with `SameSite=Lax` or `Strict` are not sent on it. If the login state lived only in such a cookie, the SP does not recognize the browser. Keep the `ID` on the server (cache with expiry) and, if you tie it to the browser with a cookie, use `SameSite=None; Secure`. Two tabs logging in at once call for a list of requests, not a single value.",
          },
          {
            titulo: "Tampered `RelayState`",
            texto:
              "The value comes back through the browser, so it is untrusted. If it is a URL and the SP redirects to it unchecked, it becomes an **open redirect**. Use an opaque identifier that points to a destination stored on the server, or an allowlist of destinations; if the value is not recognized, send the user to the home page.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The three messages that pass through the browser",
        legenda: "HTTP",
        codigo: `# 1. SP -> browser
HTTP/1.1 302 Found
Location: https://idp.example.com/sso?SAMLRequest=fZJNb4Mw...&RelayState=r_8f2a

# 2. IdP -> browser (self-submitting page)
<form method="post" action="https://app.example.com/saml/acs">
  <input type="hidden" name="SAMLResponse" value="PHNhbWxwOlJlc3BvbnNl...">
  <input type="hidden" name="RelayState" value="r_8f2a">
</form>

# 3. browser -> SP
POST /saml/acs HTTP/1.1
Host: app.example.com
Content-Type: application/x-www-form-urlencoded

SAMLResponse=PHNhbWxwOlJlc3BvbnNl...&RelayState=r_8f2a`,
        nota: "`SAMLRequest` is the `AuthnRequest` compressed (DEFLATE), in base64 and URL-encoded; `SAMLResponse` is the `Response` in base64, uncompressed. The values are truncated.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "RelayState: what it is and how to treat it",
        texto:
          "The **`RelayState`** is an opaque value that the SP sends to the IdP and the IdP returns **unchanged**. It lets the SP remember what the user wanted (usually the destination) when the response arrives, since the IdP’s `POST` carries no other hint of the original request. The bindings specification limits the value to 80 bytes and recommends protecting it against tampering; that is why the usual practice is to send a short key that points to a destination stored on the server. Always treat it as **untrusted input**. In the IdP-initiated flow it can arrive with no matching request (see Q57).",
      },
    ],
    armadilhas: [
      "Not storing the `AuthnRequest` `ID` (or storing it with no expiry): without it there is no way to check `InResponseTo`, and unsolicited or repeated responses get through.",
      "Keeping the login state only in a `SameSite=Lax` or `Strict` cookie: the IdP’s `POST` is cross-site and the cookie does not arrive. The symptom is the user looping back to the login.",
      "Using `RelayState` as a redirect URL without validating it: it opens the door to an open redirect.",
      "Creating the session before validating the response, or reusing the session identifier from before the login: issue a new identifier after validation (prevents session fixation).",
    ],
    autoteste: [
      {
        pergunta: "What data must the SP store between the redirect and the return, and why?",
        resposta:
          "The `AuthnRequest` `ID`, with a short lifetime, to match the `InResponseTo` exactly once, and the original destination, pointed to by `RelayState`. Optionally, something that ties the request to the browser that started it.",
      },
      {
        pergunta: "Why does the IdP send the `Response` by `POST` and not by redirect?",
        resposta:
          "Because the response carries the signed assertion, too large for a URL and not meant to sit in logs, history and `Referer` headers. A `POST` carries the content in the body (see Q59).",
      },
    ],
  },
};
