import type { Pergunta } from "../../tipos";

// Q33 · Implicit e password legados
export const q033: Pergunta = {
  numero: 33,
  modulo: "oauth",
  metodo: "whys",
  pt: {
    titulo: "Implicit e password legados",
    pergunta:
      "Por que os fluxos Implicit e Resource Owner Password Credentials são desencorajados? O que os substituiu?",
    porqueEsteMetodo:
      "Os dois fluxos funcionavam e eram mais simples; o motivo de terem caído só aparece quando se pergunta “por quê?” em cadeia. A cadeia chega à causa estrutural e, de quebra, ao que os substituiu.",
    resposta30s:
      "O **implicit** devolve o access token pela URL do navegador, sem autenticar o client, sem amarrar o token ao pedido e sem refresh token seguro; o **password** entrega a senha da pessoa ao client, o que quebra MFA, passkeys e login federado. As boas práticas atuais (RFC 9700) desaconselham o primeiro e proíbem o segundo. Os substitutos são **authorization code com PKCE**, **device**, **client credentials** e, para agir em nome do usuário, **token exchange**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o implicit existiu?",
            resposta:
              "Porque, no começo, as SPAs não conseguiam fazer um `POST` ao `/token` em outro domínio: as regras de CORS dos navegadores ainda não permitiam. A saída foi **pular a troca** e devolver o token direto no fragmento da URL (`#access_token=...`). Era um remendo para uma limitação que deixou de existir: hoje o CORS permite que a SPA faça a troca do code, com PKCE.",
          },
          {
            pergunta: "Por que devolver o token na URL é um problema?",
            resposta:
              "Porque a URL é o lugar mais exposto do navegador: histórico, scripts da página (uma injeção lê `location.hash`), extensões, redirecionamentos intermediários. E nada **amarra o token ao pedido**: um token vazado ou injetado por um atacante funciona no seu app (substituição de token), sem prova de que foi emitido para este client. O code, ao contrário, é inútil sozinho (veja Q27 e Q28).",
          },
          {
            pergunta: "Por que o implicit também não oferece renovação segura?",
            resposta:
              "Porque não há autenticação do client nem chamada direta ao `/token`: o AS não emite refresh token no implicit. As SPAs recorriam a iframes ocultos para renovar o login, que tendem a quebrar com as restrições a cookies de terceiros dos navegadores, ou a tokens de vida longa, o que piora qualquer vazamento. Com code + PKCE, o refresh token (com rotação, veja Q34) vem pela chamada direta.",
          },
          {
            pergunta: "Por que o password grant é desencorajado?",
            resposta:
              "Porque o client passa a **receber e enviar a senha** da pessoa: o app vê um segredo que só o AS deveria ver, e as pessoas aprendem a digitar a senha em qualquer app (terreno fértil para phishing). Sem uma tela do AS, não há como pedir **MFA, passkeys, SSO ou login federado** (SAML, OIDC); não há consentimento de verdade; e limitar o acesso ou revogá-lo depois exige trocar a senha. Também facilita o credential stuffing através do client. As boas práticas atuais (RFC 9700) o proíbem.",
          },
          {
            pergunta: "Por que não basta corrigi-los, e o que entrou no lugar?",
            resposta:
              "Porque a falha é estrutural: o implicit expõe o token no canal do navegador, e o password expõe a credencial ao client. A solução é pôr cada coisa no canal certo: o **authorization code com PKCE** devolve só um code descartável pelo navegador e o troca por tokens em uma conexão direta; o **device** cobre quem não tem navegador; o **client credentials** cobre máquina a máquina; o **token exchange** cobre agir em nome do usuário (veja Q26). O OAuth 2.1, em elaboração no IETF, também deixa os dois legados de fora.",
          },
        ],
        causaRaiz:
          "Os dois fluxos **colocam a credencial no lugar errado**: o token no canal exposto do navegador (implicit) e a senha nas mãos do client (password). Os substitutos corrigem o canal, não o parâmetro.",
      },
      {
        tipo: "codigo",
        titulo: "Três respostas, três riscos",
        legenda: "HTTP",
        codigo: [
          "# Implicit (desencorajado): o token volta no fragmento da URL",
          "HTTP/1.1 302 Found",
          "Location: https://app.exemplo.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA&token_type=Bearer&state=af0ifjsldkj",
          "",
          "# Code + PKCE (recomendado): só um code descartável volta pela URL",
          "HTTP/1.1 302 Found",
          "Location: https://app.exemplo.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj",
          "",
          "# Password (proibido pelas boas práticas): o client recebe e envia a senha da pessoa",
          "POST /token HTTP/1.1",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=password&username=ana%40exemplo.com&password=senha-da-ana&client_id=app-123",
        ].join("\n"),
        nota: "No primeiro caso, o token fica na barra de endereço; no segundo, só um comprovante descartável; no terceiro, a senha da pessoa passa pelo client.",
      },
      {
        tipo: "tabela",
        titulo: "O que substituiu o quê",
        colunas: ["Legado", "Problema central", "Substituto", "Quando"],
        linhas: [
          [
            "Implicit em SPA",
            "Token na URL, sem amarração ao pedido e sem refresh seguro",
            "Authorization code + PKCE (ou BFF)",
            "Qualquer SPA, já que o CORS hoje permite a chamada ao `/token`",
          ],
          [
            "Password em app próprio",
            "O app vê a senha; quebra MFA, passkeys e federação",
            "Authorization code + PKCE, no navegador do sistema",
            "Apps móveis, desktop e web com usuário",
          ],
          [
            "Password em dispositivo sem navegador",
            "Mesmo problema, agora no teclado da TV ou no terminal",
            "Device Authorization Grant",
            "TV, console, CLI em servidor remoto",
          ],
          [
            "Password em robô ou automação",
            "Conta de pessoa usada por programa, sem MFA",
            "Client credentials (ou identidade gerenciada)",
            "Jobs, integrações, testes automatizados",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Se você herdou um sistema com implicit ou password",
        texto:
          "Não é preciso quebrar tudo de uma vez. (1) **Inventarie** quem ainda usa cada grant: os logs do AS mostram o `grant_type` e o `response_type`. (2) **Migre** cliente a cliente para code + PKCE e **desligue o grant no registro** quando o último sair: migrar o código e deixar o implicit habilitado mantém a superfície de ataque. (3) **Enquanto isso, mitigue**: `redirect_uri` exata, `state` e `nonce`, tokens de vida curta com `aud` restrito e escopo mínimo, sem refresh token, CSP e nenhum script de terceiros na página. (4) O único caso tolerado do password é um legado de altíssima confiança, sob controle do mesmo dono do AS, sem MFA envolvido e com prazo de migração: trate como dívida técnica, nunca como padrão.",
      },
    ],
    armadilhas: [
      "Manter o implicit “porque a SPA não tem backend”: o authorization code com PKCE roda inteiro no navegador.",
      "Migrar o código para code + PKCE e deixar o implicit habilitado no registro do client: o grant antigo continua valendo para quem souber usá-lo.",
      "Achar que `response_type=id_token` ou `id_token token` do OpenID Connect é outra coisa: é o mesmo implicit, com a mesma limitação; migre para code.",
      "Ligar o password “só para testes” ou para automação com contas de pessoas, e esquecer ligado em produção; para robôs, use client credentials.",
    ],
    autoteste: [
      {
        pergunta: "Por que o implicit não oferece refresh token seguro, e como uma SPA renova a sessão hoje?",
        resposta:
          "Porque não há chamada direta ao `/token` nem autenticação do client, então nada ampara um refresh token. Hoje a SPA usa code + PKCE, que devolve o refresh token pela chamada direta (com rotação), ou um BFF que guarda os tokens.",
      },
      {
        pergunta: "Por que o password grant é incompatível com MFA e com login federado?",
        resposta:
          "Porque o client coleta usuário e senha e os envia ao AS: não existe uma tela do AS onde pedir o segundo fator ou redirecionar ao provedor externo (SAML, OIDC). Quem usa a senha direta contorna justamente essas defesas.",
      },
    ],
  },
  en: {
    titulo: "Legacy implicit and password flows",
    pergunta: "Why are the Implicit and Resource Owner Password Credentials flows discouraged? What replaced them?",
    porqueEsteMetodo:
      "Both flows worked and were simpler; the reason they fell out of favor only shows up when you ask “why?” in a chain. The chain reaches the structural cause and, along the way, what replaced them.",
    resposta30s:
      "**Implicit** returns the access token in the browser URL, with no client authentication, no binding of the token to the request and no safe refresh token; **password** hands the person’s password to the client, which breaks MFA, passkeys and federated login. Current best practices (RFC 9700) discourage the first and forbid the second. The replacements are **authorization code with PKCE**, **device**, **client credentials** and, for acting on behalf of a user, **token exchange**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why did implicit exist?",
            resposta:
              "Because, early on, SPAs could not make a `POST` to `/token` on another domain: browser CORS rules did not allow it yet. The workaround was to **skip the exchange** and return the token straight in the URL fragment (`#access_token=...`). It was a patch for a limitation that no longer exists: today CORS lets the SPA perform the code exchange, with PKCE.",
          },
          {
            pergunta: "Why is returning the token in the URL a problem?",
            resposta:
              "Because the URL is the most exposed place in the browser: history, page scripts (an injection reads `location.hash`), extensions, intermediate redirects. And nothing **binds the token to the request**: a token leaked or injected by an attacker works in your app (token substitution), with no proof it was issued to this client. The code, by contrast, is useless on its own (see Q27 and Q28).",
          },
          {
            pergunta: "Why does implicit also fail to offer safe renewal?",
            resposta:
              "Because there is no client authentication or direct call to `/token`: the AS does not issue a refresh token in implicit. SPAs resorted to hidden iframes to renew the login, which tend to break with browsers’ third-party cookie restrictions, or to long-lived tokens, which makes any leak worse. With code + PKCE, the refresh token (with rotation, see Q34) comes through the direct call.",
          },
          {
            pergunta: "Why is the password grant discouraged?",
            resposta:
              "Because the client now **receives and sends the person’s password**: the app sees a secret only the AS should see, and people learn to type their password into any app (fertile ground for phishing). Without an AS page, there is no way to ask for **MFA, passkeys, SSO or federated login** (SAML, OIDC); there is no real consent; and limiting or revoking access later requires changing the password. It also enables credential stuffing through the client. Current best practices (RFC 9700) forbid it.",
          },
          {
            pergunta: "Why is fixing them not enough, and what took their place?",
            resposta:
              "Because the flaw is structural: implicit exposes the token on the browser channel, and password exposes the credential to the client. The solution is to put each thing on the right channel: **authorization code with PKCE** returns only a disposable code through the browser and exchanges it for tokens over a direct connection; **device** covers those without a browser; **client credentials** covers machine to machine; **token exchange** covers acting on behalf of the user (see Q26). OAuth 2.1, being drafted at the IETF, also leaves both legacy flows out.",
          },
        ],
        causaRaiz:
          "Both flows **put the credential in the wrong place**: the token on the exposed browser channel (implicit) and the password in the client’s hands (password). The replacements fix the channel, not the parameter.",
      },
      {
        tipo: "codigo",
        titulo: "Three responses, three risks",
        legenda: "HTTP",
        codigo: [
          "# Implicit (discouraged): the token comes back in the URL fragment",
          "HTTP/1.1 302 Found",
          "Location: https://app.exemplo.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA&token_type=Bearer&state=af0ifjsldkj",
          "",
          "# Code + PKCE (recommended): only a disposable code comes back in the URL",
          "HTTP/1.1 302 Found",
          "Location: https://app.exemplo.com/cb?code=SplxlOBeZQQYbYS6WxSbIA&state=af0ifjsldkj",
          "",
          "# Password (forbidden by best practices): the client receives and sends the person’s password",
          "POST /token HTTP/1.1",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=password&username=ana%40exemplo.com&password=senha-da-ana&client_id=app-123",
        ].join("\n"),
        nota: "In the first case the token sits in the address bar; in the second, only a disposable receipt; in the third, the person’s password passes through the client.",
      },
      {
        tipo: "tabela",
        titulo: "What replaced what",
        colunas: ["Legacy", "Core problem", "Replacement", "When"],
        linhas: [
          [
            "Implicit in an SPA",
            "Token in the URL, not bound to the request, no safe refresh",
            "Authorization code + PKCE (or a BFF)",
            "Any SPA, since CORS now allows the call to `/token`",
          ],
          [
            "Password in a first-party app",
            "The app sees the password; breaks MFA, passkeys and federation",
            "Authorization code + PKCE, in the system browser",
            "Mobile, desktop and web apps with a user",
          ],
          [
            "Password on a device without a browser",
            "Same problem, now on the TV keyboard or in the terminal",
            "Device Authorization Grant",
            "TV, console, CLI on a remote server",
          ],
          [
            "Password in a robot or automation",
            "A person’s account used by a program, with no MFA",
            "Client credentials (or a managed identity)",
            "Jobs, integrations, automated tests",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "If you inherited a system with implicit or password",
        texto:
          "There is no need to break everything at once. (1) **Take inventory** of who still uses each grant: the AS logs show the `grant_type` and `response_type`. (2) **Migrate** client by client to code + PKCE and **turn the grant off in the registration** when the last one leaves: migrating the code but leaving implicit enabled keeps the attack surface. (3) **Meanwhile, mitigate**: exact `redirect_uri`, `state` and `nonce`, short-lived tokens with a narrow `aud` and minimal scope, no refresh token, CSP and no third-party scripts on the page. (4) The only tolerated case for password is a legacy system of very high trust, under the same owner as the AS, with no MFA involved and with a migration deadline: treat it as technical debt, never as a default.",
      },
    ],
    armadilhas: [
      "Keeping implicit “because the SPA has no backend”: authorization code with PKCE runs entirely in the browser.",
      "Migrating the code to code + PKCE and leaving implicit enabled in the client’s registration: the old grant stays valid for anyone who knows how to use it.",
      "Thinking OpenID Connect’s `response_type=id_token` or `id_token token` is something else: it is the same implicit, with the same limitation; migrate to code.",
      "Turning on password “just for testing” or for automation with people’s accounts, and forgetting it on in production; for robots, use client credentials.",
    ],
    autoteste: [
      {
        pergunta: "Why does implicit not offer a safe refresh token, and how does an SPA renew the session today?",
        resposta:
          "Because there is no direct call to `/token` or client authentication, so nothing supports a refresh token. Today the SPA uses code + PKCE, which returns the refresh token through the direct call (with rotation), or a BFF that holds the tokens.",
      },
      {
        pergunta: "Why is the password grant incompatible with MFA and federated login?",
        resposta:
          "Because the client collects username and password and sends them to the AS: there is no AS page on which to ask for the second factor or redirect to the external provider (SAML, OIDC). Whoever uses the password directly bypasses exactly those defenses.",
      },
    ],
  },
};
