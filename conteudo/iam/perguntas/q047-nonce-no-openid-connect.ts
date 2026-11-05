import type { Pergunta } from "../../tipos";

// Q47 · Nonce no OpenID Connect
export const q047: Pergunta = {
  numero: 47,
  modulo: "oidc",
  metodo: "whys",
  pt: {
    titulo: "Nonce no OpenID Connect",
    pergunta: "O que é o nonce no OpenID Connect, que ataque ele impede e como ele se relaciona com state e PKCE?",
    porqueEsteMetodo:
      "A pergunta é de mecanismo e de comparação: não basta saber o que o `nonce` é, é preciso entender por que ele existe se já há assinatura, `state` e PKCE. Uma cadeia de porquês leva da lacuna da assinatura até a divisão de trabalho entre os três.",
    resposta30s:
      "O **`nonce`** é um valor aleatório que o cliente envia no pedido de autorização e que o IdP devolve **dentro do ID token**; o cliente confere que ele é igual ao que guardou na sessão do navegador. Ele impede o **replay e a substituição do ID token**, o que a assinatura sozinha não impede. Os três se completam: o **`state`** protege a resposta contra **CSRF**, o **PKCE** protege o código contra **interceptação** e o **`nonce`** protege o token contra **reaproveitamento**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que a assinatura do ID token não basta?",
            resposta:
              "Porque a assinatura prova **quem emitiu** o token e que ele não foi alterado, mas não prova **para qual tentativa de login** ele foi emitido. Um ID token autêntico de outro login, vazado ou capturado, continua com assinatura válida e com `iss`, `aud` e `exp` corretos, e passa em todas essas conferências.",
          },
          {
            pergunta: "Por que isso é um ataque real?",
            resposta:
              "Porque um token autêntico pode ser **reaproveitado** (replay) ou **injetado** na sessão errada (substituição de token): o atacante obtém um token válido, por exemplo de um login dele, de um log ou do histórico do navegador, e o entrega ao cliente no lugar do que a vítima esperava. Nos fluxos em que o ID token chega pelo navegador (implicit e hybrid, hoje desaconselhados) a exposição é maior, e por isso o `nonce` é obrigatório neles. No authorization code, em que o token vem do endpoint de token, ele é opcional na especificação, mas continua recomendado.",
          },
          {
            pergunta: "Como o `nonce` fecha essa brecha?",
            resposta:
              "O cliente gera um valor aleatório, o guarda **ligado ao navegador que iniciou o login** (na sessão ou num cookie) e o envia no pedido de autorização. O IdP o copia, sem alterá-lo, para a claim `nonce` do ID token, que é assinada. Ao receber o token, o cliente compara a claim com o valor guardado: um token de outra tentativa traz outro `nonce` (ou nenhum) e é recusado. O token fica amarrado à sessão que o pediu.",
          },
          {
            pergunta: "Por que ainda são necessários `state` e PKCE?",
            resposta:
              "Porque cada um amarra um elo diferente. O `state` liga a **resposta** de autorização ao navegador que iniciou o fluxo e impede CSRF no login. O PKCE liga o **código de autorização** ao cliente que o pediu e impede que um código roubado seja trocado por tokens. O `nonce` liga o **ID token** à sessão e impede replay e substituição. Há sobreposição: no authorization code o `nonce` também denuncia um código injetado (o ID token sairia com o `nonce` de outro pedido), e o PKCE pode cobrir o CSRF em alguns servidores, mas nenhum dos três substitui os outros.",
          },
          {
            pergunta: "Por que o valor precisa ser aleatório, guardado no lugar certo e de uso único?",
            resposta:
              "Porque o `nonce` só protege enquanto o atacante não o conhece nem consegue reutilizá-lo. Se for previsível (contador, hora), ele pré-fabrica o token; se for guardado sem vínculo com o navegador (uma variável global do servidor, ou um armazenamento que um XSS lê), ele o lê ou o troca; se não for apagado depois do uso, o replay volta a funcionar. Gere bytes de um gerador criptograficamente seguro, guarde na sessão do servidor ou num cookie `HttpOnly` e apague ao validar.",
          },
        ],
        causaRaiz:
          "Uma assinatura válida responde **quem emitiu**, não **para qual login**. O `nonce` amarra o ID token à sessão do navegador que o pediu, e `state`, PKCE e `nonce` se somam porque cada um fecha um elo diferente: a resposta, o código e o token.",
      },
      {
        tipo: "tabela",
        titulo: "O que cada mecanismo amarra",
        colunas: ["Mecanismo", "Amarra", "Ataque que impede", "Quem confere"],
        linhas: [
          [
            "`state`",
            "A resposta de autorização ao navegador que iniciou o fluxo",
            "CSRF no login: injetar uma resposta ou um código do atacante na sessão da vítima",
            "O cliente, no callback, antes de trocar o código",
          ],
          [
            "PKCE (`code_challenge` e `code_verifier`)",
            "O código de autorização ao cliente que o pediu",
            "Interceptação ou injeção do código: quem o rouba não tem o `code_verifier`",
            "O servidor de autorização, no endpoint de token",
          ],
          [
            "`nonce`",
            "O ID token à sessão do navegador que iniciou o login",
            "Replay e substituição do ID token",
            "O cliente, ao validar o ID token (claim `nonce`)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Os três parâmetros no mesmo pedido de autorização",
        legenda: "HTTP",
        codigo:
          "GET /authorize?response_type=code\n  &client_id=meu-cliente\n  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback\n  &scope=openid%20profile\n  &state=<aleatório 1>\n  &nonce=<aleatório 2>\n  &code_challenge=<hash do code_verifier>&code_challenge_method=S256 HTTP/1.1\nHost: id.example.com",
        nota: "A linha de requisição está quebrada em várias linhas só para leitura, e os valores entre `<>` são ilustrativos. O IdP devolve o `state` no redirecionamento e o `nonce` dentro do ID token; o `code_verifier` só aparece depois, no endpoint de token.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Use os três. **PKCE** em todo cliente, público ou confidencial. **`state`** (ou, conforme o servidor, o próprio PKCE) contra CSRF no callback. **`nonce`** sempre que houver ID token: é obrigatório se o token chegar pelo navegador (implicit e hybrid, desaconselhados hoje) e continua sendo uma defesa barata no authorization code. As recomendações atuais de segurança do OAuth (RFC 9700) seguem nessa direção; confira o texto vigente.",
      },
    ],
    armadilhas: [
      "Gerar `nonce` ou `state` previsíveis (hora, contador, `Math.random`) ou fixos: o atacante os adivinha e o mecanismo vira enfeite.",
      "Enviar o `nonce` e nunca conferir a claim no ID token, ou conferir só quando ela existir: se você enviou o `nonce` e o token não o traz, o token deve ser recusado.",
      "Guardar `state` e `nonce` sem vínculo com o navegador (variável global no servidor, armazenamento legível por XSS) ou não apagá-los depois do uso.",
      "Achar que o PKCE dispensa o `nonce`, ou o contrário, sem saber qual elo cada um fecha: resposta, código e token são três pontos de ataque diferentes.",
    ],
    autoteste: [
      {
        pergunta: "Um atacante injeta no callback um ID token válido, mas de outra sessão. O que o barra?",
        resposta:
          "O `nonce`. O cliente guardou o valor da sessão do navegador atual; o token injetado traz o `nonce` de outro pedido (ou nenhum), a comparação falha e o token é recusado, mesmo com assinatura, `iss`, `aud` e `exp` corretos.",
      },
      {
        pergunta: "Que ataque cada um de `state`, `nonce` e PKCE impede?",
        resposta:
          "O `state` impede CSRF no callback (resposta injetada). O PKCE impede que um código de autorização interceptado seja trocado por tokens. O `nonce` impede o replay e a substituição do ID token.",
      },
    ],
  },
  en: {
    titulo: "The OpenID Connect nonce",
    pergunta:
      "What is the nonce in OpenID Connect, which attack does it prevent, and how does it relate to state and PKCE?",
    porqueEsteMetodo:
      "This is a question about mechanism and comparison: it is not enough to know what the `nonce` is, you must understand why it exists when there is already a signature, `state` and PKCE. A chain of whys leads from the signature’s gap to the division of labor among the three.",
    resposta30s:
      "The **`nonce`** is a random value the client sends in the authorization request and the IdP returns **inside the ID token**; the client checks that it equals what it stored in the browser session. It prevents **ID token replay and substitution**, which the signature alone does not. The three complete each other: **`state`** protects the response against **CSRF**, **PKCE** protects the code against **interception** and the **`nonce`** protects the token against **reuse**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why is the ID token’s signature not enough?",
            resposta:
              "Because the signature proves **who issued** the token and that it was not altered, but not **for which login attempt** it was issued. An authentic ID token from another login, leaked or captured, still has a valid signature and correct `iss`, `aud` and `exp`, and passes all those checks.",
          },
          {
            pergunta: "Why is that a real attack?",
            resposta:
              "Because an authentic token can be **replayed** or **injected** into the wrong session (token substitution): the attacker obtains a valid token, for example from a login of their own, from a log or from the browser history, and hands it to the client in place of the one the victim expected. In flows where the ID token reaches the client through the browser (implicit and hybrid, discouraged today) the exposure is larger, which is why the `nonce` is mandatory there. In the authorization code flow, where the token comes from the token endpoint, it is optional in the specification but still recommended.",
          },
          {
            pergunta: "How does the `nonce` close that gap?",
            resposta:
              "The client generates a random value, stores it **tied to the browser that started the login** (in the session or a cookie) and sends it in the authorization request. The IdP copies it, unchanged, into the ID token’s `nonce` claim, which is signed. When the token arrives, the client compares the claim with the stored value: a token from another attempt carries a different `nonce` (or none) and is rejected. The token is tied to the session that asked for it.",
          },
          {
            pergunta: "Why are `state` and PKCE still needed?",
            resposta:
              "Because each one ties a different link. `state` ties the authorization **response** to the browser that started the flow and prevents login CSRF. PKCE ties the **authorization code** to the client that requested it and prevents a stolen code from being exchanged for tokens. The `nonce` ties the **ID token** to the session and prevents replay and substitution. There is overlap: in the authorization code flow the `nonce` also exposes an injected code (the ID token would come out with another request’s `nonce`), and PKCE can cover CSRF on some servers, but none of the three replaces the others.",
          },
          {
            pergunta: "Why must the value be random, stored in the right place and single-use?",
            resposta:
              "Because the `nonce` only protects while the attacker neither knows it nor can reuse it. If it is predictable (counter, time), they prebuild the token; if it is stored with no tie to the browser (a global server variable, or storage that an XSS can read), they read or swap it; if it is not deleted after use, replay works again. Generate bytes from a cryptographically secure generator, store them in the server session or an `HttpOnly` cookie, and delete them on validation.",
          },
        ],
        causaRaiz:
          "A valid signature answers **who issued it**, not **for which login**. The `nonce` ties the ID token to the browser session that asked for it, and `state`, PKCE and `nonce` add up because each closes a different link: the response, the code and the token.",
      },
      {
        tipo: "tabela",
        titulo: "What each mechanism ties",
        colunas: ["Mechanism", "Ties", "Attack it prevents", "Who checks it"],
        linhas: [
          [
            "`state`",
            "The authorization response to the browser that started the flow",
            "Login CSRF: injecting an attacker’s response or code into the victim’s session",
            "The client, in the callback, before exchanging the code",
          ],
          [
            "PKCE (`code_challenge` and `code_verifier`)",
            "The authorization code to the client that requested it",
            "Code interception or injection: whoever steals it does not have the `code_verifier`",
            "The authorization server, at the token endpoint",
          ],
          [
            "`nonce`",
            "The ID token to the browser session that started the login",
            "ID token replay and substitution",
            "The client, when validating the ID token (the `nonce` claim)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The three parameters in the same authorization request",
        legenda: "HTTP",
        codigo:
          "GET /authorize?response_type=code\n  &client_id=my-client\n  &redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback\n  &scope=openid%20profile\n  &state=<random 1>\n  &nonce=<random 2>\n  &code_challenge=<hash of code_verifier>&code_challenge_method=S256 HTTP/1.1\nHost: id.example.com",
        nota: "The request line is broken across several lines only for readability, and the values in `<>` are illustrative. The IdP returns `state` in the redirect and `nonce` inside the ID token; the `code_verifier` only appears later, at the token endpoint.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Use all three. **PKCE** in every client, public or confidential. **`state`** (or, depending on the server, PKCE itself) against CSRF in the callback. **`nonce`** whenever there is an ID token: it is mandatory if the token arrives through the browser (implicit and hybrid, discouraged today) and remains a cheap defense in the authorization code flow. Current OAuth security recommendations (RFC 9700) point the same way; check the current text.",
      },
    ],
    armadilhas: [
      "Generating predictable (time, counter, `Math.random`) or fixed `nonce` or `state` values: the attacker guesses them and the mechanism becomes decoration.",
      "Sending the `nonce` and never checking the claim in the ID token, or checking only when it exists: if you sent the `nonce` and the token does not carry it, the token must be rejected.",
      "Storing `state` and `nonce` with no tie to the browser (a global server variable, storage an XSS can read) or not deleting them after use.",
      "Thinking PKCE makes the `nonce` unnecessary, or the reverse, without knowing which link each one closes: response, code and token are three different points of attack.",
    ],
    autoteste: [
      {
        pergunta: "An attacker injects into the callback a valid ID token, but from another session. What stops it?",
        resposta:
          "The `nonce`. The client stored the value for the current browser session; the injected token carries another request’s `nonce` (or none), the comparison fails and the token is rejected, even with a correct signature, `iss`, `aud` and `exp`.",
      },
      {
        pergunta: "Which attack does each of `state`, `nonce` and PKCE prevent?",
        resposta:
          "`state` prevents CSRF in the callback (an injected response). PKCE prevents an intercepted authorization code from being exchanged for tokens. The `nonce` prevents ID token replay and substitution.",
      },
    ],
  },
};
