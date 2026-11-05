import type { Pergunta } from "../../tipos";

// Q22 · Delegação de acesso do zero
export const q022: Pergunta = {
  numero: 22,
  modulo: "oauth",
  metodo: "firstprinciples",
  pt: {
    titulo: "Delegação de acesso do zero",
    pergunta:
      "Se o OAuth não existisse, como você permitiria que um aplicativo acessasse a API de outro serviço em nome do usuário sem receber a senha dele? Que peças precisaria inventar?",
    porqueEsteMetodo:
      "O OAuth parece um conjunto arbitrário de termos (servidor de autorização, escopo, redirect, código, refresh token) até você ver cada um nascer de um defeito real. Partir do pior desenho e consertar uma falha por vez mostra por que cada peça existe.",
    resposta30s:
      "Comece pelo pior caso, o app guardando a senha do usuário, e conserte um defeito por vez: troque a senha por um **token** emitido para o app, limite-o com **escopo** e **expiração**, renove-o com um **refresh token**, leve o usuário a autenticar e consentir **no servidor que guarda a conta** (não no app), devolva só um **código** temporário a um `redirect_uri` registrado e prove a posse do código com **PKCE**. O conjunto é o **OAuth 2.0**: um framework de **autorização delegada**, que dá acesso limitado em nome do usuário sem expor a senha.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma falha por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Um aplicativo de impressão de fotos (o **cliente**) precisa ler as fotos que o usuário (o **dono do recurso**) guarda em outro serviço (o **servidor de recursos**), em nome dele, sem nunca receber a senha. Três coisas precisam ser vencidas: o app não pode ter poder demais, o poder não pode durar para sempre e o usuário precisa poder desfazer.",
          },
          {
            titulo: "1. A versão mais simples: o usuário dá a senha ao app",
            texto:
              "O app guarda a senha e entra como o usuário. → Quebra: o app pode tudo (ler, apagar, trocar a senha); o serviço não distingue o app da pessoa; revogar exige trocar a senha, o que derruba todos os outros apps; um vazamento no app expõe a conta inteira; e MFA fica impossível. Conserto: uma credencial **separada da senha**, só para o app.",
          },
          {
            titulo: "2. Um token no lugar da senha",
            texto:
              "O serviço gera um token de acesso para o app e o usuário o cola lá. → Resolve: a senha não sai do serviço e o token pode ser revogado sozinho. → Ainda quebra: o token tem o poder total da conta e vale para sempre. Conserto: **limitar o poder e o tempo**.",
          },
          {
            titulo: "3. Escopo e expiração",
            texto:
              "O token carrega só a permissão pedida (“ler fotos”) e expira em minutos. → Resolve: se vazar, o estrago é pequeno e dura pouco. → Ainda quebra: com validade curta, o usuário teria de refazer tudo a cada hora. Conserto: uma **credencial de renovação** (refresh token), que só o servidor emissor aceita e que pode ser revogada e rotacionada.",
          },
          {
            titulo: "4. Autenticar e consentir no servidor, não no app",
            texto:
              "Copiar e colar token é ruim e propenso a erro. Em vez disso, o app manda o navegador do usuário ao serviço, onde ele entra (com MFA, se houver) e vê exatamente o que o app pede (**consentimento**). O app nunca vê a senha. → Ainda quebra: a resposta volta ao app pelo navegador, e um atacante pode tentar desviá-la para o endereço dele ou injetar uma resposta forjada. Conserto: o app é **registrado**, o endereço de retorno (`redirect_uri`) é conferido de forma exata e um valor aleatório (`state`) liga o pedido à resposta.",
          },
          {
            titulo: "5. Devolver um código e trocá-lo por um token",
            texto:
              "O navegador volta ao app com um **código** temporário, de uso único, e não com o token. O app troca o código pelo token numa chamada direta ao servidor (o canal de trás), longe da barra de endereços e do histórico. → Ainda quebra: quem interceptar o código (um app malicioso no mesmo aparelho, por exemplo) o troca antes do app. Conserto: provar que quem troca é quem pediu, com um segredo ou uma chave para clientes que sabem guardá-los e com **PKCE** (um segredo criado a cada pedido, enviado como hash na ida e revelado na troca) para apps de celular e de navegador, que não guardam segredo.",
          },
          {
            titulo: "6. Separar quem emite de quem protege, e dar saída ao usuário",
            texto:
              "O **servidor de autorização** emite os tokens; o **servidor de recursos** (a API) os valida e aplica o escopo. O usuário vê a lista de apps autorizados e revoga cada um; o app também pode revogar o próprio token. → O resultado é o **OAuth 2.0**.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Cada defeito virou uma peça do OAuth",
        colunas: ["Defeito do desenho simples", "Peça inventada", "Nome no OAuth"],
        linhas: [
          ["O app vê a senha e pode tudo", "Credencial separada para o app", "Token de acesso (access token)"],
          [
            "O token tem poder total",
            "Permissão limitada, pedida e mostrada ao usuário",
            "Escopo (`scope`) e consentimento",
          ],
          ["O token vale para sempre", "Validade curta e um jeito de renovar", "`expires_in` e refresh token"],
          [
            "Copiar e colar, sem MFA nem consentimento",
            "Tela de login e consentimento no serviço que guarda a conta",
            "Servidor de autorização (endpoint de autorização)",
          ],
          [
            "A resposta pode ser desviada ou forjada",
            "App registrado, retorno conferido, pedido ligado à resposta",
            "`client_id`, `redirect_uri` exato, `state`",
          ],
          [
            "O código pode ser interceptado",
            "Prova de que quem troca é quem pediu",
            "Autenticação do cliente e PKCE (RFC 7636)",
          ],
          ["O usuário não consegue desfazer", "Revogação por app", "Revogação de token e tela de apps autorizados"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "O resultado: authorization code com PKCE",
        legenda: "HTTP",
        codigo: `# 1. O app manda o navegador ao servidor de autorização
GET /authorize?response_type=code&client_id=app-impressao
  &redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback
  &scope=fotos.ler&state=af0ifjsldkj
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256

# 2. O app troca o código (que voltou ao redirect_uri) por tokens
POST /token
grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
  &redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcallback
  &client_id=app-impressao
  &code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

{ "access_token": "…", "token_type": "Bearer", "expires_in": 900,
  "refresh_token": "…", "scope": "fotos.ler" }`,
        nota: "O `code_challenge` é o hash (S256) do `code_verifier`, que só o app conhece até a troca. As linhas dos parâmetros estão quebradas só para leitura; o corpo do POST usa `application/x-www-form-urlencoded`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que é o OAuth 2.0",
        texto:
          "O **OAuth 2.0** (RFC 6749) é um **framework de autorização delegada**: um cliente obtém **acesso limitado** a um recurso, **em nome do dono do recurso**, por meio de **tokens** emitidos por um servidor de autorização, sem ver a senha. Os quatro papéis são o dono do recurso, o cliente, o servidor de autorização e o servidor de recursos. Ele resolve **autorização** (o que o app pode fazer), não **autenticação** (quem é a pessoa): para isso existe o OpenID Connect, construído sobre o OAuth. A prática atual é **authorization code com PKCE**; o password grant, que devolve a senha ao app (o passo 1), e o implicit, que expõe o token na URL, são desaconselhados (veja a RFC 9700, as boas práticas de segurança de OAuth, e confira o andamento do OAuth 2.1).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Onde a reconstrução para",
        texto:
          "Aqui se reconstrói o essencial. O OAuth real ainda traz outros fluxos (client credentials para serviço a serviço, device code para TVs e dispositivos sem teclado), formatos de token (JWT ou opaco), validação pelo servidor de recursos e as armadilhas de implementação (`redirect_uri` frouxo, `state` omitido). E ele não diz quem entrou: usar um access token como prova de login, sem OpenID Connect, é um erro clássico.",
      },
    ],
    armadilhas: [
      "Dizer que o OAuth 2.0 é um protocolo de autenticação: ele autoriza o acesso; a identidade de quem entrou vem do OpenID Connect.",
      "Usar password grant ou implicit por serem “mais simples”: o primeiro devolve a senha ao app, o segundo expõe o token na URL.",
      "Aceitar `redirect_uri` por prefixo ou com curinga, ou omitir `state` e PKCE: o código pode ser desviado ou injetado.",
      "Pedir escopos amplos “para não ter de pedir de novo”: um token vazado dá mais poder do que o necessário.",
    ],
    autoteste: [
      {
        pergunta: "Por que o app recebe um código, e não o token, no redirecionamento?",
        resposta:
          "Porque a URL de retorno passa pelo navegador (histórico, logs, extensões). O código é temporário e de uso único, e só vale com a troca autenticada (segredo ou PKCE) numa chamada direta ao servidor de autorização.",
      },
      {
        pergunta: "Que problema o refresh token resolve, e que cuidado ele exige?",
        resposta:
          "Permite access tokens curtos sem pedir login o tempo todo. Como dura mais, exige armazenamento seguro, rotação ou vínculo ao cliente e possibilidade de revogação.",
      },
    ],
  },
  en: {
    titulo: "Delegated access from scratch",
    pergunta:
      "If OAuth did not exist, how would you let an application call another service's API on a user's behalf without ever receiving their password? What pieces would you have to invent?",
    porqueEsteMetodo:
      "OAuth looks like an arbitrary set of terms (authorization server, scope, redirect, code, refresh token) until you see each one born from a real flaw. Starting from the worst design and fixing one flaw at a time shows why each piece exists.",
    resposta30s:
      "Start from the worst case, the app storing the user’s password, and fix one flaw at a time: replace the password with a **token** issued to the app, limit it with **scope** and **expiry**, renew it with a **refresh token**, send the user to authenticate and consent **on the server that holds the account** (not in the app), return only a temporary **code** to a registered `redirect_uri`, and prove possession of the code with **PKCE**. The whole is **OAuth 2.0**: a **delegated authorization** framework that grants limited access on the user’s behalf without exposing the password.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one flaw at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "A photo-printing application (the **client**) must read the photos the user (the **resource owner**) keeps in another service (the **resource server**), on their behalf, without ever receiving the password. Three things must be overcome: the app must not have too much power, the power must not last forever and the user must be able to undo it.",
          },
          {
            titulo: "1. The simplest version: the user gives the app the password",
            texto:
              "The app stores the password and signs in as the user. → Breaks: the app can do everything (read, delete, change the password); the service cannot tell the app from the person; revoking requires changing the password, which knocks out every other app; a leak in the app exposes the whole account; and MFA becomes impossible. The fix: a credential **separate from the password**, just for the app.",
          },
          {
            titulo: "2. A token instead of the password",
            texto:
              "The service generates an access token for the app and the user pastes it there. → Fixes: the password never leaves the service and the token can be revoked on its own. → Still breaks: the token has the account’s full power and lasts forever. The fix: **limit the power and the time**.",
          },
          {
            titulo: "3. Scope and expiry",
            texto:
              "The token carries only the requested permission (“read photos”) and expires in minutes. → Fixes: if it leaks, the damage is small and short-lived. → Still breaks: with short validity, the user would have to redo everything every hour. The fix: a **renewal credential** (refresh token), accepted only by the issuing server and revocable and rotatable.",
          },
          {
            titulo: "4. Authenticate and consent on the server, not in the app",
            texto:
              "Copying and pasting a token is poor and error-prone. Instead, the app sends the user’s browser to the service, where they sign in (with MFA, if any) and see exactly what the app is asking for (**consent**). The app never sees the password. → Still breaks: the response returns to the app through the browser, and an attacker may try to divert it to their own address or inject a forged response. The fix: the app is **registered**, the return address (`redirect_uri`) is matched exactly and a random value (`state`) ties the request to the response.",
          },
          {
            titulo: "5. Return a code and exchange it for a token",
            texto:
              "The browser returns to the app with a temporary, single-use **code**, not with the token. The app exchanges the code for the token in a direct call to the server (the back channel), away from the address bar and history. → Still breaks: whoever intercepts the code (a malicious app on the same device, for example) exchanges it before the app does. The fix: prove that whoever exchanges is whoever asked, with a secret or key for clients that can keep one, and with **PKCE** (a secret created per request, sent as a hash on the way out and revealed at the exchange) for mobile and browser apps, which cannot keep secrets.",
          },
          {
            titulo: "6. Separate the issuer from the protector, and give the user an exit",
            texto:
              "The **authorization server** issues tokens; the **resource server** (the API) validates them and enforces the scope. The user sees the list of authorized apps and revokes each one; the app can also revoke its own token. → The result is **OAuth 2.0**.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Each flaw became a piece of OAuth",
        colunas: ["Flaw in the simple design", "Piece invented", "Name in OAuth"],
        linhas: [
          ["The app sees the password and can do everything", "A separate credential for the app", "Access token"],
          [
            "The token has full power",
            "Limited permission, requested and shown to the user",
            "Scope (`scope`) and consent",
          ],
          ["The token lasts forever", "Short validity and a way to renew", "`expires_in` and refresh token"],
          [
            "Copy and paste, with no MFA or consent",
            "A sign-in and consent screen on the service that holds the account",
            "Authorization server (authorization endpoint)",
          ],
          [
            "The response can be diverted or forged",
            "A registered app, a matched return address, a request tied to the response",
            "`client_id`, exact `redirect_uri`, `state`",
          ],
          [
            "The code can be intercepted",
            "Proof that whoever exchanges is whoever asked",
            "Client authentication and PKCE (RFC 7636)",
          ],
          ["The user cannot undo it", "Revocation per app", "Token revocation and an authorized-apps screen"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The result: authorization code with PKCE",
        legenda: "HTTP",
        codigo: `# 1. The app sends the browser to the authorization server
GET /authorize?response_type=code&client_id=photo-printing
  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
  &scope=photos.read&state=af0ifjsldkj
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256

# 2. The app exchanges the code (returned to the redirect_uri) for tokens
POST /token
grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback
  &client_id=photo-printing
  &code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

{ "access_token": "…", "token_type": "Bearer", "expires_in": 900,
  "refresh_token": "…", "scope": "photos.read" }`,
        nota: "The `code_challenge` is the hash (S256) of the `code_verifier`, which only the app knows until the exchange. The parameter lines are wrapped only for reading; the POST body uses `application/x-www-form-urlencoded`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What OAuth 2.0 is",
        texto:
          "**OAuth 2.0** (RFC 6749) is a **delegated authorization framework**: a client obtains **limited access** to a resource, **on behalf of the resource owner**, through **tokens** issued by an authorization server, without seeing the password. The four roles are the resource owner, the client, the authorization server and the resource server. It solves **authorization** (what the app may do), not **authentication** (who the person is): that is what OpenID Connect, built on top of OAuth, is for. Current practice is **authorization code with PKCE**; the password grant, which hands the password back to the app (step 1), and the implicit grant, which exposes the token in the URL, are discouraged (see RFC 9700, the OAuth security best current practice, and check the progress of OAuth 2.1).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where the rebuild stops",
        texto:
          "This rebuilds the essentials. Real OAuth also brings other flows (client credentials for service to service, device code for TVs and devices without a keyboard), token formats (JWT or opaque), validation by the resource server and implementation pitfalls (a loose `redirect_uri`, a missing `state`). And it does not say who signed in: using an access token as proof of login, without OpenID Connect, is a classic mistake.",
      },
    ],
    armadilhas: [
      "Calling OAuth 2.0 an authentication protocol: it authorizes access; the identity of who signed in comes from OpenID Connect.",
      "Using the password grant or implicit grant because they are “simpler”: the first hands the password to the app, the second exposes the token in the URL.",
      "Accepting `redirect_uri` by prefix or with a wildcard, or omitting `state` and PKCE: the code can be diverted or injected.",
      "Requesting broad scopes “to avoid asking again”: a leaked token gives more power than needed.",
    ],
    autoteste: [
      {
        pergunta: "Why does the app receive a code, not the token, on the redirect?",
        resposta:
          "Because the return URL passes through the browser (history, logs, extensions). The code is temporary and single-use, and only works with an authenticated exchange (secret or PKCE) in a direct call to the authorization server.",
      },
      {
        pergunta: "What problem does the refresh token solve, and what care does it need?",
        resposta:
          "It allows short access tokens without asking for a sign-in all the time. Because it lasts longer, it needs secure storage, rotation or binding to the client, and the ability to be revoked.",
      },
    ],
  },
};
