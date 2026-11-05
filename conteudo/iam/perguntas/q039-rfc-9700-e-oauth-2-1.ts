import type { Pergunta } from "../../tipos";

// Q39 · RFC 9700 e OAuth 2.1
export const q039: Pergunta = {
  numero: 39,
  modulo: "oauth",
  metodo: "whys",
  pt: {
    titulo: "RFC 9700 e OAuth 2.1",
    pergunta:
      "Quais são as boas práticas atuais de segurança do OAuth 2.0 (RFC 9700) e o que o OAuth 2.1 consolida? Por que cada mudança surgiu?",
    porqueEsteMetodo:
      "A lista de boas práticas só deixa de ser decoreba quando cada regra é ligada ao ataque que a motivou. A cadeia de “por quês” leva cada regra até a causa, e a causa comum mostra como auditar um sistema contra a lista.",
    resposta30s:
      "A **RFC 9700** reúne as práticas de segurança atuais do OAuth 2.0: **authorization code com PKCE** para todos, **redirect URI com correspondência exata**, sem **implicit** e sem **password grant**, refresh token **rotacionado ou vinculado ao remetente**, tokens com **audiência e privilégio restritos** e defesa contra **mix-up** e CSRF. O **OAuth 2.1** é a consolidação em andamento dessas práticas com o OAuth 2.0 num texto só, não um substituto: confira o status no IETF. Cada regra existe porque um ataque real mostrou que o caminho antigo vazava um segredo.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que todo client deve usar authorization code com PKCE, e o implicit saiu?",
            resposta:
              "Porque o implicit devolvia o **token na URL** (no fragmento), que passa pelo histórico, por extensões, por scripts e por referrers, sem autenticar o client e sem como detectar um token injetado. O authorization code entrega só um `code` de uso único e troca por tokens num canal direto. Mas um `code` interceptado (por um app malicioso no celular, por exemplo) também serviria, e é aí que entra o **PKCE** (RFC 7636): o client cria um segredo por tentativa (`code_verifier`), envia o hash na ida (`code_challenge`) e o original na troca, e quem roubou só o `code` não consegue trocá-lo. A RFC 9700 trata o PKCE como a defesa padrão contra a injeção de `code`, e o OAuth 2.1 o exige de todos os clients.",
          },
          {
            pergunta: "Por que o `redirect_uri` precisa bater exatamente com o registrado?",
            resposta:
              "Porque é para lá que o `code` é enviado. Aceitar prefixo, curinga ou só o domínio deixa o atacante apontar para um caminho que ele controla (ou para um *open redirect* do próprio site) e receber o `code`. A comparação exata de string, com HTTPS, elimina essa família de ataques; a exceção é a porta variável do loopback em apps nativos.",
          },
          {
            pergunta: "Por que o password grant e o token na query string foram removidos?",
            resposta:
              "No password grant, o client **vê a senha** do usuário: isso o ensina a digitá-la em qualquer app, impede MFA, passkeys e SSO e leva a senha a mais lugares onde pode vazar. Já o bearer na query string (`?access_token=`) vai parar em logs de proxies, no histórico e no `Referer`. A regra é segredo nunca em URL, e senha só no servidor que a verifica. A RFC 9700 proíbe o password grant, e o OAuth 2.1 remove os dois.",
          },
          {
            pergunta: "Por que refresh token rotacionado ou vinculado, e tokens com audiência restrita?",
            resposta:
              "Porque um token que vaza vale para quem o apresentar. O refresh token de um client público é o alvo mais valioso: com rotação, o reuso denuncia a cópia; com vínculo ao remetente (DPoP ou mTLS), a cópia nem funciona (veja Q34 e Q37). E o access token deve valer para **uma API** (`aud`) e com o **mínimo de escopo**: assim um token que vaza de um serviço não abre os outros, e uma API não é enganada a usar um token feito para outra (veja Q36).",
          },
          {
            pergunta: "Por que a defesa contra mix-up e CSRF (`state`, `iss`, `nonce`)?",
            resposta:
              "Um client que fala com vários authorization servers pode ser levado a mandar o `code` ao servidor errado (ataque de *mix-up*), e um callback sem `state` ou PKCE aceita um `code` plantado por outra pessoa (CSRF de login). Por isso o client confere o `state`, usa um `redirect_uri` por servidor ou valida o parâmetro `iss` da resposta (RFC 9207) e, no OpenID Connect, o `nonce` no ID token, que impede a repetição de um ID token capturado.",
          },
        ],
        causaRaiz:
          "O OAuth atravessa canais que o desenvolvedor não controla (navegador, rede, apps do celular), e um segredo que passa por eles pode ser lido, copiado ou redirecionado. Cada regra fecha um desses caminhos: **segredo fora da URL, código preso ao client, token preso a uma audiência (e, quando possível, a um remetente), destino exato e servidor confirmado.**",
      },
      {
        tipo: "tabela",
        titulo: "Auditar um sistema contra a lista",
        colunas: ["Regra", "Sinal de problema", "Como testar"],
        linhas: [
          [
            "Sem implicit nem password grant",
            "`response_type=token` ou `grant_type=password` aceitos no registro do client",
            "Listar os `grant_types` e `response_types` habilitados e tentar usá-los",
          ],
          [
            "PKCE em todo authorization code",
            "O servidor aceita `/authorize` sem `code_challenge`, ou aceita o método `plain`",
            "Iniciar o fluxo sem PKCE e trocar o `code` sem `code_verifier`",
          ],
          [
            "`redirect_uri` exato",
            "Curingas, prefixos, `http://` ou domínios parecidos registrados",
            "Alterar um caractere, um subcaminho ou o domínio e ver se o servidor recusa",
          ],
          [
            "Refresh token protegido",
            "Client público com refresh token de vida longa, sem rotação nem vínculo",
            "Usar um refresh token duas vezes e ver se o segundo falha e derruba a família",
          ],
          [
            "Audiência e escopo restritos",
            "A API aceita um token cujo `aud` é de outra API; escopos genéricos demais",
            "Apresentar a uma API um token emitido para outra",
          ],
          [
            "Validação do token na API",
            "Algoritmo vindo do cabeçalho, `iss` ou `aud` sem conferência, chave aceita de `jku` ou `jwk`",
            "Enviar tokens com `alg` alterado, `none`, `aud` errado ou assinados por outra chave",
          ],
          [
            "`state`, `nonce` e `iss`",
            "O callback aceita resposta sem `state`, ou o ID token sem `nonce` conferido",
            "Repetir ou forjar o callback com o `state` de outra sessão",
          ],
          [
            "Segredos fora de URLs e logs",
            "Tokens e `code` aparecem em query strings, logs de proxy ou `Referer`",
            "Procurar nos logs e nas URLs de requisições reais",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Onde o OAuth 2.1 entra",
        texto:
          "O **OAuth 2.1** não é um protocolo novo nem um substituto: é a **consolidação** do OAuth 2.0 (RFC 6749 e 6750) com as boas práticas da RFC 9700 e o PKCE, num texto só. Ele torna o PKCE obrigatório no authorization code, exige correspondência exata do `redirect_uri`, remove o implicit, o password grant e o token na query string e pede, para refresh token de client público, vínculo ao remetente ou uso único. Pode ainda ser um rascunho do IETF: **confira o status atual** no datatracker. Na prática, não espere a publicação: implemente a RFC 9700, que já é um documento publicado e orienta implantações hoje.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "E a pergunta sobre implantações que emitem JWTs",
        texto:
          "A RFC 9700 trata de tokens em geral (audiência restrita, privilégio mínimo, vínculo ao remetente), e não de um perfil só para JWT. Quando o token é um JWT, somam-se as boas práticas de JWT (RFC 8725: algoritmo fixo na verificação, validar `iss`, `aud` e `exp`, nunca aceitar `none`) e o perfil de access token em JWT (RFC 9068). Veja Q40 para a validação na API; confira os textos para os detalhes.",
      },
    ],
    armadilhas: [
      "Citar o OAuth 2.1 como padrão publicado: a base normativa que você pode afirmar hoje é a RFC 6749 mais a RFC 9700; confira o status do 2.1.",
      "Ligar o PKCE só no client e não exigi-lo no servidor: se o servidor aceita o fluxo sem `code_challenge`, o atacante simplesmente não o usa (*downgrade*).",
      "Registrar `redirect_uri` com curinga “por conveniência” em teste e esquecer de tirar em produção.",
      "Cumprir a lista só no papel: sem teste automatizado (usar o fluxo errado deve falhar), a regra regride com o tempo.",
    ],
    autoteste: [
      {
        pergunta: "Que ataque o PKCE impede e como?",
        resposta:
          "A interceptação do `code` de autorização. O client gera um `code_verifier` secreto, envia o hash (`code_challenge`) na ida e o original na troca por tokens; quem só interceptou o `code` não tem o `code_verifier` e não consegue trocá-lo.",
      },
      {
        pergunta: "O que o OAuth 2.1 muda em relação ao OAuth 2.0 mais a RFC 9700?",
        resposta:
          "Quase nada de novo: reúne em um documento as práticas já recomendadas. PKCE obrigatório, `redirect_uri` exato, sem implicit, sem password grant, sem bearer na query string e refresh token de client público vinculado ou de uso único. Confira se já foi publicado.",
      },
    ],
  },
  en: {
    titulo: "RFC 9700 and OAuth 2.1",
    pergunta:
      "What are the current OAuth 2.0 security best practices (RFC 9700), and what does OAuth 2.1 consolidate? Why did each change come about?",
    porqueEsteMetodo:
      "The list of best practices stops being memorization when each rule is tied to the attack that motivated it. The chain of “whys” takes each rule down to its cause, and the common cause shows how to audit a system against the list.",
    resposta30s:
      "**RFC 9700** gathers the current OAuth 2.0 security practices: **authorization code with PKCE** for everyone, **exact-match redirect URIs**, no **implicit** and no **password grant**, **rotated or sender-constrained** refresh tokens, tokens with **restricted audience and privilege**, and defenses against **mix-up** and CSRF. **OAuth 2.1** is the ongoing consolidation of those practices with OAuth 2.0 into a single text, not a replacement: check its status at the IETF. Each rule exists because a real attack showed that the old path leaked a secret.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why must every client use authorization code with PKCE, and why did implicit go away?",
            resposta:
              "Because implicit returned the **token in the URL** (in the fragment), which passes through history, extensions, scripts and referrers, without authenticating the client and with no way to detect an injected token. The authorization code delivers only a single-use `code` and exchanges it for tokens over a direct channel. But an intercepted `code` (by a malicious app on the phone, for example) would work too, and that is where **PKCE** (RFC 7636) comes in: the client creates a per-attempt secret (`code_verifier`), sends its hash on the way out (`code_challenge`) and the original on the exchange, and whoever stole only the `code` cannot redeem it. RFC 9700 treats PKCE as the standard defense against `code` injection, and OAuth 2.1 requires it of all clients.",
          },
          {
            pergunta: "Why must the `redirect_uri` match the registered one exactly?",
            resposta:
              "Because that is where the `code` is sent. Accepting a prefix, a wildcard or only the domain lets the attacker point to a path they control (or to an *open redirect* on the site itself) and receive the `code`. Exact string comparison, over HTTPS, eliminates that family of attacks; the exception is the variable loopback port in native apps.",
          },
          {
            pergunta: "Why were the password grant and tokens in the query string removed?",
            resposta:
              "With the password grant, the client **sees the user’s password**: that trains users to type it into any app, blocks MFA, passkeys and SSO and takes the password to more places where it can leak. A bearer in the query string (`?access_token=`) ends up in proxy logs, in history and in the `Referer`. The rule is: secrets never in a URL, and a password only on the server that verifies it. RFC 9700 forbids the password grant, and OAuth 2.1 removes both.",
          },
          {
            pergunta: "Why rotated or sender-constrained refresh tokens, and tokens with a restricted audience?",
            resposta:
              "Because a leaked token works for whoever presents it. A public client’s refresh token is the most valuable target: with rotation, reuse reveals the copy; with sender-constraining (DPoP or mTLS), the copy does not even work (see Q34 and Q37). And the access token should be valid for **one API** (`aud`) and with the **minimum scope**: that way a token leaked from one service does not open the others, and an API cannot be tricked into using a token made for another (see Q36).",
          },
          {
            pergunta: "Why the defenses against mix-up and CSRF (`state`, `iss`, `nonce`)?",
            resposta:
              "A client that talks to several authorization servers can be led to send the `code` to the wrong server (a *mix-up* attack), and a callback without `state` or PKCE accepts a `code` planted by someone else (login CSRF). So the client checks the `state`, uses one `redirect_uri` per server or validates the response’s `iss` parameter (RFC 9207) and, in OpenID Connect, the `nonce` in the ID token, which prevents the replay of a captured ID token.",
          },
        ],
        causaRaiz:
          "OAuth crosses channels the developer does not control (browser, network, phone apps), and a secret passing through them can be read, copied or redirected. Each rule closes one of those paths: **secrets out of the URL, a code bound to the client, a token bound to an audience (and, when possible, to a sender), an exact destination and a confirmed server.**",
      },
      {
        tipo: "tabela",
        titulo: "Auditing a system against the list",
        colunas: ["Rule", "Sign of a problem", "How to test"],
        linhas: [
          [
            "No implicit or password grant",
            "`response_type=token` or `grant_type=password` accepted in the client registration",
            "List the enabled `grant_types` and `response_types` and try to use them",
          ],
          [
            "PKCE on every authorization code",
            "The server accepts `/authorize` without `code_challenge`, or accepts the `plain` method",
            "Start the flow without PKCE and redeem the `code` without a `code_verifier`",
          ],
          [
            "Exact `redirect_uri`",
            "Wildcards, prefixes, `http://` or look-alike domains registered",
            "Change one character, a subpath or the domain and see whether the server refuses",
          ],
          [
            "Protected refresh token",
            "A public client with a long-lived refresh token, with no rotation or binding",
            "Use a refresh token twice and see whether the second use fails and kills the family",
          ],
          [
            "Restricted audience and scope",
            "The API accepts a token whose `aud` belongs to another API; overly generic scopes",
            "Present to one API a token issued for another",
          ],
          [
            "Token validation on the API",
            "Algorithm taken from the header, `iss` or `aud` unchecked, a key accepted from `jku` or `jwk`",
            "Send tokens with a changed `alg`, `none`, a wrong `aud` or signed by another key",
          ],
          [
            "`state`, `nonce` and `iss`",
            "The callback accepts a response without `state`, or an ID token without a checked `nonce`",
            "Replay or forge the callback with another session’s `state`",
          ],
          [
            "Secrets out of URLs and logs",
            "Tokens and `code` values show up in query strings, proxy logs or `Referer`",
            "Search the logs and the URLs of real requests",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Where OAuth 2.1 fits",
        texto:
          "**OAuth 2.1** is neither a new protocol nor a replacement: it is the **consolidation** of OAuth 2.0 (RFC 6749 and 6750) with the RFC 9700 best practices and PKCE, in a single text. It makes PKCE mandatory on the authorization code, requires exact matching of the `redirect_uri`, removes implicit, the password grant and tokens in the query string, and asks, for a public client’s refresh token, for sender-constraining or single use. It may still be an IETF draft: **check its current status** in the datatracker. In practice, do not wait for publication: implement RFC 9700, which is already a published document and guides deployments today.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "And the question about deployments that issue JWTs",
        texto:
          "RFC 9700 deals with tokens in general (restricted audience, least privilege, sender-constraining), not with a JWT-only profile. When the token is a JWT, the JWT best practices add up (RFC 8725: a fixed algorithm on verification, validate `iss`, `aud` and `exp`, never accept `none`) along with the JWT access token profile (RFC 9068). See Q40 for validation on the API; check the texts for details.",
      },
    ],
    armadilhas: [
      "Citing OAuth 2.1 as a published standard: the normative base you can state today is RFC 6749 plus RFC 9700; check the status of 2.1.",
      "Turning on PKCE only in the client and not requiring it on the server: if the server accepts the flow without `code_challenge`, the attacker simply does not use it (a *downgrade*).",
      "Registering a wildcard `redirect_uri` “for convenience” in testing and forgetting to remove it in production.",
      "Meeting the list only on paper: without an automated test (using the wrong flow should fail), the rule regresses over time.",
    ],
    autoteste: [
      {
        pergunta: "What attack does PKCE prevent, and how?",
        resposta:
          "Interception of the authorization `code`. The client generates a secret `code_verifier`, sends its hash (`code_challenge`) on the way out and the original on the exchange for tokens; whoever only intercepted the `code` does not have the `code_verifier` and cannot redeem it.",
      },
      {
        pergunta: "What does OAuth 2.1 change compared with OAuth 2.0 plus RFC 9700?",
        resposta:
          "Almost nothing new: it gathers the already recommended practices into one document. PKCE mandatory, exact `redirect_uri`, no implicit, no password grant, no bearer in the query string, and a public client’s refresh token that is sender-constrained or single-use. Check whether it has been published yet.",
      },
    ],
  },
};
