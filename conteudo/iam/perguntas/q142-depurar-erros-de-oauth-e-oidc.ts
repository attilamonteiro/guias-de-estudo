import type { Pergunta } from "../../tipos";

// Q142 · Depurar erros de OAuth e OIDC
export const q142: Pergunta = {
  numero: 142,
  modulo: "ataques-e-depuracao",
  metodo: "playbook",
  pt: {
    titulo: "Depurar erros de OAuth e OIDC",
    pergunta:
      "Um login OAuth/OIDC falha com redirect_uri_mismatch, invalid_grant, invalid_client ou invalid_request. Como você investiga cada erro?",
    porqueEsteMetodo:
      "Cada código de erro aponta para uma verificação diferente do servidor, então a investigação é uma árvore de decisão. O playbook dá a ordem comum (capturar, localizar o salto) e depois o roteiro de cada erro.",
    resposta30s:
      "Primeiro capture a requisição e a resposta exatas e descubra em que salto falha (navegador ou `/token`). Depois siga o erro: `redirect_uri_mismatch` pede comparar a URL **byte a byte** com a registrada; `invalid_grant` aponta o code ou o refresh token (**expirado, já usado**, `redirect_uri` ou `code_verifier` diferentes); `invalid_client` aponta a **autenticação do cliente** (id, segredo, método); `invalid_request` aponta parâmetro ausente, repetido ou formato errado. Corrija sem afrouxar as validações.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook por erro",
        passos: [
          {
            titulo: "1. Capture a requisição e a resposta",
            texto:
              "No navegador (DevTools, aba Rede, com o log preservado) copie a URL de autorização completa e a resposta do `/token`: status, cabeçalhos e o corpo JSON com `error` e `error_description`. Ache também o evento correspondente nos logs do IdP, que costumam dar a causa exata.",
          },
          {
            titulo: "2. Descubra em que salto falha",
            texto:
              "No endpoint de **autorização** (navegador) o erro aparece na página do IdP ou volta na URL de callback como `?error=`. No endpoint de **token** (do seu servidor para o IdP) vem como JSON com status 400 ou 401. Isso diz quais parâmetros olhar e onde ficam os logs.",
          },
          {
            titulo: "3. `redirect_uri_mismatch`",
            texto:
              "O valor enviado não é igual a nenhum registrado. A comparação é de **texto exato** (veja Q29): compare byte a byte esquema (`http` ou `https`), host, porta, caminho, barra final, maiúsculas e codificação. Causas comuns: ambiente com outro registro, proxy que faz o aplicativo montar `http://` (veja Q144) e URL diferente entre a requisição de autorização e a de token. O IdP não redireciona o usuário para um endereço não registrado, então o erro aparece na página dele, não no seu aplicativo.",
          },
          {
            titulo: "4. `invalid_grant`",
            texto:
              "O code ou o refresh token não vale. Causas: **expirado** (vive poucos minutos); **já usado** (uso único: um callback executado duas vezes, por retentativa ou renderização dupla em desenvolvimento, falha na segunda); `code_verifier` que não combina com o `code_challenge` enviado (veja Q28); `redirect_uri` diferente do da autorização; code emitido para outro cliente; refresh token expirado, revogado ou já trocado numa rotação (veja Q34); relógio fora de hora.",
          },
          {
            titulo: "5. `invalid_client`",
            texto:
              "A autenticação do cliente falhou. Confira o `client_id` (ambiente certo?), o **valor** do segredo (e não o ID dele, nem um segredo vencido ou rotacionado), espaços e quebras de linha copiados junto, o método esperado (`client_secret_basic` ou `client_secret_post`; no Basic, `client_id` e segredo passam por codificação de formulário antes do base64, veja RFC 6749, seção 2.3.1) e, com `private_key_jwt`, `iss`, `sub`, `aud` e validade da asserção. Cliente público não deve mandar segredo.",
          },
          {
            titulo: "6. `invalid_request`",
            texto:
              "A requisição está malformada: parâmetro obrigatório ausente (`response_type`, `client_id`, `code_challenge` quando o servidor exige PKCE), repetido, valor não suportado ou `Content-Type` errado no `/token` (precisa ser `application/x-www-form-urlencoded`, não JSON). Compare com o que a documentação do IdP e a especificação pedem.",
          },
          {
            titulo: "7. Corrija sem afrouxar e repita o teste",
            texto:
              "Registre a URL certa, corrija o segredo ou o parâmetro e refaça o fluxo completo, com um code novo. Teste o `/token` isolado com curl para separar a falha do seu aplicativo da do IdP. Não corrija desligando PKCE, `state` ou a correspondência exata.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A requisição ao /token, com o que conferir",
        legenda: "HTTP",
        codigo: `POST /token HTTP/1.1
Host: idp.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW   # invalid_client: id, segredo, método
Content-Type: application/x-www-form-urlencoded     # invalid_request: nunca JSON

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA                        # invalid_grant: expirado ou já usado
&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcb    # igual ao da autorização
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

HTTP/1.1 400 Bad Request
Content-Type: application/json

{ "error": "invalid_grant", "error_description": "..." }`,
        nota: "Os comentários com # são só anotações. O `code_verifier` precisa corresponder ao `code_challenge` enviado na autorização, senão o erro também é `invalid_grant`. Um `invalid_client` costuma vir com status 401.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Leia o erro como um mapa",
        texto:
          "O código diz em que verificação o servidor parou: `invalid_request` (formato), `invalid_client` (quem é você) e `invalid_grant` (a concessão que você trouxe). Comece pelo `error` e pelo `error_description` crus e pelo log do IdP, não pela mensagem genérica do seu aplicativo. O nome `redirect_uri_mismatch` é usado por alguns provedores; a especificação trata o assunto com outros códigos e cada IdP tem os seus, então confira a documentação dele.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Códigos e tokens são credenciais",
        texto:
          "Authorization code, refresh token e segredo de cliente não vão para chats, tickets nem sites de decodificação de terceiros. Se o login chegou a emitir tokens e o erro aparece depois, decodifique-os localmente (veja Q143) e mascare-os nos logs. O code é de uso único e curto: reaproveitar o que você copiou do log não adianta.",
      },
    ],
    armadilhas: [
      "Afrouxar o servidor (curinga em `redirect_uri`, desligar PKCE ou `state`) para “fazer funcionar”.",
      "Trocar o code duas vezes (retentativa automática, renderização dupla em desenvolvimento, F5 na página de callback) e investigar o segundo erro, `invalid_grant`, em vez do primeiro.",
      "Esquecer que desenvolvimento e produção têm registros diferentes (cliente, URIs de redirecionamento, tenant, emissor), ou copiar o segredo com espaço ou quebra de linha.",
      "Confiar na mensagem amigável do aplicativo em vez do `error` e do `error_description` crus do IdP e dos logs dele.",
    ],
    autoteste: [
      {
        pergunta:
          "Por que o `redirect_uri_mismatch` costuma aparecer na página do IdP e não volta para o seu aplicativo?",
        resposta:
          "Porque o servidor de autorização não deve redirecionar o usuário para um endereço que não reconhece (RFC 6749, seção 3.1.2.4): isso abriria um redirecionamento aberto. Ele mostra o erro ao próprio usuário.",
      },
      {
        pergunta: "Dê duas causas de `invalid_grant` no fluxo authorization code com PKCE.",
        resposta:
          "O code expirou ou já foi usado (uso único, inclusive por retentativa ou renderização dupla), ou o `code_verifier` não corresponde ao `code_challenge`. Também servem: `redirect_uri` diferente do da autorização e relógio fora de hora.",
      },
    ],
  },
  en: {
    titulo: "Debugging OAuth and OIDC errors",
    pergunta:
      "An OAuth/OIDC login fails with redirect_uri_mismatch, invalid_grant, invalid_client or invalid_request. How do you investigate each error?",
    porqueEsteMetodo:
      "Each error code points to a different server-side check, so the investigation is a decision tree. The playbook gives the common order (capture, locate the hop) and then a script for each error.",
    resposta30s:
      "First capture the exact request and response and find out which hop fails (the browser or `/token`). Then follow the error: `redirect_uri_mismatch` means comparing the URL **byte by byte** with the registered one; `invalid_grant` points at the code or refresh token (**expired, already used**, a different `redirect_uri` or `code_verifier`); `invalid_client` points at **client authentication** (id, secret, method); `invalid_request` points at a missing or repeated parameter or a wrong format. Fix it without loosening the validations.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook per error",
        passos: [
          {
            titulo: "1. Capture the request and the response",
            texto:
              "In the browser (DevTools, Network tab, log preserved) copy the full authorization URL and the `/token` response: status, headers and the JSON body with `error` and `error_description`. Also find the matching event in the IdP logs, which often give the exact cause.",
          },
          {
            titulo: "2. Find out which hop fails",
            texto:
              "At the **authorization** endpoint (browser) the error shows on the IdP page or comes back in the callback URL as `?error=`. At the **token** endpoint (from your server to the IdP) it comes as JSON with status 400 or 401. That tells you which parameters to look at and where the logs are.",
          },
          {
            titulo: "3. `redirect_uri_mismatch`",
            texto:
              "The value sent equals none of the registered ones. The comparison is **exact text** (see Q29): compare scheme (`http` or `https`), host, port, path, trailing slash, letter case and encoding byte by byte. Common causes: an environment with a different registration, a proxy that makes the application build `http://` (see Q144) and a different URL between the authorization request and the token request. The IdP does not redirect the user to an unregistered address, so the error appears on its page, not in your application.",
          },
          {
            titulo: "4. `invalid_grant`",
            texto:
              "The code or refresh token is not valid. Causes: **expired** (it lives a few minutes); **already used** (single use: a callback that runs twice, through a retry or a double render in development, fails the second time); a `code_verifier` that does not match the `code_challenge` that was sent (see Q28); a `redirect_uri` different from the authorization one; a code issued to another client; a refresh token that is expired, revoked or already exchanged in a rotation (see Q34); a wrong clock.",
          },
          {
            titulo: "5. `invalid_client`",
            texto:
              "Client authentication failed. Check the `client_id` (right environment?), the secret **value** (not its ID, nor an expired or rotated secret), spaces and line breaks copied along, the expected method (`client_secret_basic` or `client_secret_post`; with Basic, `client_id` and secret go through form encoding before base64, see RFC 6749, section 2.3.1) and, with `private_key_jwt`, the assertion’s `iss`, `sub`, `aud` and validity. A public client should not send a secret.",
          },
          {
            titulo: "6. `invalid_request`",
            texto:
              "The request is malformed: a required parameter is missing (`response_type`, `client_id`, `code_challenge` when the server requires PKCE), repeated, an unsupported value or a wrong `Content-Type` on `/token` (it must be `application/x-www-form-urlencoded`, not JSON). Compare with what the IdP documentation and the specification ask for.",
          },
          {
            titulo: "7. Fix without loosening, and test again",
            texto:
              "Register the right URL, fix the secret or the parameter and redo the whole flow with a fresh code. Test `/token` in isolation with curl to separate your application’s failure from the IdP’s. Do not fix it by turning off PKCE, `state` or exact matching.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The /token request, with what to check",
        legenda: "HTTP",
        codigo: `POST /token HTTP/1.1
Host: idp.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW   # invalid_client: id, secret, method
Content-Type: application/x-www-form-urlencoded     # invalid_request: never JSON

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA                        # invalid_grant: expired or already used
&redirect_uri=https%3A%2F%2Fapp.example.com%2Fcb    # same as in the authorization
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

HTTP/1.1 400 Bad Request
Content-Type: application/json

{ "error": "invalid_grant", "error_description": "..." }`,
        nota: "The # comments are just annotations. The `code_verifier` must match the `code_challenge` sent at authorization, otherwise the error is also `invalid_grant`. An `invalid_client` usually comes with status 401.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Read the error as a map",
        texto:
          "The code says which check the server stopped at: `invalid_request` (format), `invalid_client` (who you are) and `invalid_grant` (the grant you brought). Start from the raw `error` and `error_description` and the IdP log, not from your application’s generic message. The name `redirect_uri_mismatch` is used by some providers; the specification handles the subject with other codes and each IdP has its own, so check its documentation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Codes and tokens are credentials",
        texto:
          "Authorization codes, refresh tokens and client secrets do not belong in chats, tickets or third-party decoding sites. If the login did issue tokens and the error appears afterwards, decode them locally (see Q143) and mask them in logs. A code is single-use and short-lived: reusing the one you copied from a log will not work.",
      },
    ],
    armadilhas: [
      "Loosening the server (wildcard in `redirect_uri`, turning off PKCE or `state`) to “make it work”.",
      "Exchanging the code twice (automatic retry, double render in development, F5 on the callback page) and investigating the second error, `invalid_grant`, instead of the first.",
      "Forgetting that development and production have different registrations (client, redirect URIs, tenant, issuer), or copying the secret with a space or line break.",
      "Trusting your application’s friendly message instead of the raw `error` and `error_description` from the IdP and its logs.",
    ],
    autoteste: [
      {
        pergunta:
          "Why does `redirect_uri_mismatch` usually show on the IdP page instead of coming back to your application?",
        resposta:
          "Because the authorization server must not redirect the user to an address it does not recognize (RFC 6749, section 3.1.2.4): that would create an open redirect. It shows the error to the user itself.",
      },
      {
        pergunta: "Give two causes of `invalid_grant` in the authorization code flow with PKCE.",
        resposta:
          "The code expired or was already used (single use, including through a retry or a double render), or the `code_verifier` does not match the `code_challenge`. A `redirect_uri` different from the authorization one and a wrong clock also qualify.",
      },
    ],
  },
};
