import type { Pergunta } from "../../tipos";

// Q28 · PKCE e sua motivação
export const q028: Pergunta = {
  numero: 28,
  modulo: "oauth",
  metodo: "whys",
  pt: {
    titulo: "PKCE e sua motivação",
    pergunta:
      "O que é PKCE, que ataque ele impede e por que hoje é recomendado para todos os clientes, inclusive os confidenciais?",
    porqueEsteMetodo:
      "O PKCE parece só mais um parâmetro a decorar. Perguntar “por quê?” em cadeia mostra o ataque que o motivou, como o par verifier/challenge o impede e por que a recomendação cresceu de apps nativos para todos os clientes.",
    resposta30s:
      "O **PKCE** (Proof Key for Code Exchange, RFC 7636) amarra o authorization code à instância do client que o pediu: o client cria um `code_verifier` aleatório, envia só o `code_challenge = S256(verifier)` no `/authorize` e prova o verifier na troca do code. Assim, um **code interceptado ou injetado** é inútil para o atacante. Nasceu para apps nativos, mas hoje é recomendado para **todos** os clients, porque barra a injeção de code e continua valendo mesmo se o segredo do client vazar.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o authorization code precisa de proteção extra?",
            resposta:
              "Porque o code volta ao client por um **redirecionamento no navegador**, um canal que o client não controla. Em apps nativos, outro aplicativo instalado no aparelho pode registrar o mesmo esquema de URI e **interceptar o code**; ele também pode vazar em logs, no histórico ou por extensões. Um client público não tem `client_secret` para provar que quem troca o code é o mesmo app que o pediu, então quem tem o code (e o `client_id`, que é público) consegue trocá-lo por tokens.",
          },
          {
            pergunta: "Por que um segredo criado a cada tentativa resolve?",
            resposta:
              "Porque o client cria o **`code_verifier`** (aleatório, de 43 a 128 caracteres) e envia no `/authorize` só o **`code_challenge`**, o hash dele. O servidor guarda o challenge junto do code. Na troca, o client envia o verifier; o servidor recalcula o hash e compara. O verifier **nunca atravessou o canal exposto**, então quem só viu o code não consegue completar a troca.",
          },
          {
            pergunta: "Por que `S256` e não `plain`?",
            resposta:
              "Com `plain`, o challenge é o próprio verifier, enviado no mesmo pedido que o atacante pode observar: ele leria o verifier junto do code e o PKCE não protegeria nada. O `S256` é um hash de mão única, então o challenge não revela o verifier. Atenção: se o `code_challenge_method` for omitido, o padrão é `plain`. Envie sempre `S256`.",
          },
          {
            pergunta: "Por que hoje se recomenda PKCE para todos, inclusive confidenciais?",
            resposta:
              "Porque a autenticação do client prova **quem é o client**, e o PKCE prova que **quem troca o code é a mesma instância que iniciou este pedido**: problemas diferentes. Sem PKCE, um atacante que consiga **injetar um code** (o dele, ou um roubado) na sessão da vítima pode ver o client aceitá-lo; com PKCE, o verifier da sessão não bate com o challenge daquele code e a troca falha. Também é uma segunda barreira se o `client_secret` vazar, e simplifica o servidor, que passa a exigir PKCE de todo mundo. A RFC 9700 (boas práticas de segurança do OAuth 2.0) recomenda o PKCE para todos os clients que usam authorization code.",
          },
          {
            pergunta: "Então por que `state`, `nonce` e `redirect_uri` exata continuam existindo?",
            resposta:
              "Porque cada um fecha uma porta diferente. A `redirect_uri` exata decide **para onde** o code é entregue (veja Q29), e o PKCE só protege quem o intercepta depois. O `state` amarra a resposta ao navegador que fez o pedido: as boas práticas atuais admitem que o PKCE cumpra essa função quando o servidor o suporta, mas o `state` ainda é barato, funciona com servidores que não impõem PKCE e carrega o estado da aplicação. O `nonce` (OpenID Connect) prende o **ID token** ao login em curso (veja Q47). Em resumo: o PKCE complementa, não substitui.",
          },
        ],
        causaRaiz:
          "O code atravessa um canal que o client não controla. O PKCE o **amarra à tentativa que o gerou** com um segredo que nunca passou por esse canal, e por isso vale para qualquer client.",
      },
      {
        tipo: "tabela",
        titulo: "Quem vê o quê",
        colunas: ["Valor", "Por onde viaja", "O que o atacante que o vê consegue"],
        linhas: [
          [
            "`code_verifier`",
            "Só do client para o servidor, no `/token` (conexão direta, TLS)",
            "Nada: ele não passa pelo canal exposto antes da troca",
          ],
          [
            "`code_challenge`",
            "Pelo navegador, no `/authorize`",
            "Nada: é um hash de mão única com `S256` (com `plain` revelaria o verifier)",
          ],
          ["`code`", "Pelo navegador, na volta", "Quase nada: sem o verifier, o servidor recusa a troca"],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Gerando e usando o par verifier/challenge",
        legenda: "TypeScript",
        codigo: [
          'import { createHash, randomBytes } from "node:crypto";',
          "",
          "// Novo a cada tentativa de login: 32 bytes aleatórios viram 43 caracteres base64url",
          'const codeVerifier = randomBytes(32).toString("base64url");',
          'const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");',
          "",
          "// Guarde o verifier na sessão e mande SÓ o challenge no /authorize:",
          "//   ...&code_challenge=<codeChallenge>&code_challenge_method=S256",
          "// Na troca do code, mande o verifier (e só então):",
          "//   grant_type=authorization_code&code=...&code_verifier=<codeVerifier>",
        ].join("\n"),
        nota: "Em um navegador, o mesmo resultado sai de `crypto.getRandomValues` e `crypto.subtle.digest`. O que importa é a aleatoriedade criptográfica e um valor novo a cada pedido.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O PKCE só funciona se o servidor o impõe",
        texto:
          "O servidor deve **exigir** o PKCE dos clients que o devem usar (recusar pedidos sem `code_challenge`) e recusar tanto a troca sem `code_verifier`, quando houve challenge, quanto um `code_verifier` sem challenge prévio; do contrário, um atacante remove o parâmetro e anula a proteção (ataque de downgrade). Mantenha também `redirect_uri` exata, `state` (ou o PKCE verificado como proteção de CSRF), `nonce` no OIDC e TLS. O PKCE protege o code; não protege um token roubado depois da troca.",
      },
    ],
    armadilhas: [
      "Usar `code_challenge_method=plain`, ou omitir o método (o padrão é `plain`): o challenge vira o verifier à vista.",
      "Gerar o verifier com `Math.random()`, derivá-lo de dado previsível ou reaproveitá-lo entre logins: ele precisa ser aleatório criptográfico e novo a cada pedido.",
      "Enviar o PKCE do lado do client sem que o servidor o exija e o verifique (ou aceitando a troca sem verifier): vira enfeite, e o atacante simplesmente remove o parâmetro.",
      "Achar que o PKCE substitui `redirect_uri` exata, `state` e `nonce`: ele protege a troca do code, não o destino do code nem o ID token.",
    ],
    autoteste: [
      {
        pergunta: "Que ataque o PKCE impede e por que o atacante com o code interceptado falha?",
        resposta:
          "A interceptação (ou injeção) do code. Sem o `code_verifier`, que nunca passou pelo canal exposto, o servidor não consegue validar o hash guardado e recusa a troca.",
      },
      {
        pergunta: "Por que um client confidencial deveria usar PKCE se já se autentica no `/token`?",
        resposta:
          "Porque a autenticação prova quem é o client, não que o code pertence ao pedido atual. O PKCE barra a injeção de code e é uma segunda barreira se o segredo vazar.",
      },
    ],
  },
  en: {
    titulo: "PKCE and why it exists",
    pergunta:
      "What is PKCE, which attack does it prevent, and why is it now recommended for all clients, including confidential ones?",
    porqueEsteMetodo:
      "PKCE looks like just one more parameter to memorize. Asking “why?” in a chain shows the attack that motivated it, how the verifier/challenge pair prevents it and why the recommendation grew from native apps to every client.",
    resposta30s:
      "**PKCE** (Proof Key for Code Exchange, RFC 7636) ties the authorization code to the client instance that asked for it: the client creates a random `code_verifier`, sends only `code_challenge = S256(verifier)` at `/authorize` and proves the verifier when exchanging the code. So an **intercepted or injected code** is useless to the attacker. It was born for native apps, but is now recommended for **all** clients, because it blocks code injection and still holds even if the client secret leaks.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does the authorization code need extra protection?",
            resposta:
              "Because the code comes back to the client through a **browser redirect**, a channel the client does not control. In native apps, another app installed on the device can register the same URI scheme and **intercept the code**; it can also leak through logs, history or extensions. A public client has no `client_secret` to prove that whoever exchanges the code is the same app that asked for it, so anyone holding the code (and the `client_id`, which is public) can exchange it for tokens.",
          },
          {
            pergunta: "Why does a secret created for each attempt fix it?",
            resposta:
              "Because the client creates the **`code_verifier`** (random, 43 to 128 characters) and sends only the **`code_challenge`**, its hash, at `/authorize`. The server stores the challenge together with the code. On the exchange, the client sends the verifier; the server recomputes the hash and compares. The verifier **never crossed the exposed channel**, so whoever only saw the code cannot complete the exchange.",
          },
          {
            pergunta: "Why `S256` and not `plain`?",
            resposta:
              "With `plain`, the challenge is the verifier itself, sent in the same request the attacker can observe: they would read the verifier along with the code and PKCE would protect nothing. `S256` is a one-way hash, so the challenge does not reveal the verifier. Careful: if `code_challenge_method` is omitted, the default is `plain`. Always send `S256`.",
          },
          {
            pergunta: "Why is PKCE now recommended for everyone, confidential clients included?",
            resposta:
              "Because client authentication proves **who the client is**, while PKCE proves that **whoever exchanges the code is the same instance that started this request**: different problems. Without PKCE, an attacker who manages to **inject a code** (their own, or a stolen one) into the victim’s session may see the client accept it; with PKCE, the session’s verifier does not match that code’s challenge and the exchange fails. It is also a second barrier if the `client_secret` leaks, and it simplifies the server, which can require PKCE from everyone. RFC 9700 (OAuth 2.0 security best current practice) recommends PKCE for all clients using authorization code.",
          },
          {
            pergunta: "Then why do `state`, `nonce` and exact `redirect_uri` still exist?",
            resposta:
              "Because each one closes a different door. The exact `redirect_uri` decides **where** the code is delivered (see Q29), while PKCE only protects against whoever intercepts it afterward. `state` ties the response to the browser that made the request: current best practices accept PKCE doing that job when the server supports it, but `state` is still cheap, works with servers that do not enforce PKCE and carries application state. The `nonce` (OpenID Connect) ties the **ID token** to the login in progress (see Q47). In short: PKCE complements, it does not replace.",
          },
        ],
        causaRaiz:
          "The code crosses a channel the client does not control. PKCE **ties it to the attempt that generated it** with a secret that never went through that channel, which is why it works for any client.",
      },
      {
        tipo: "tabela",
        titulo: "Who sees what",
        colunas: ["Value", "Where it travels", "What an attacker who sees it can do"],
        linhas: [
          [
            "`code_verifier`",
            "Only from client to server, at `/token` (direct connection, TLS)",
            "Nothing: it does not cross the exposed channel before the exchange",
          ],
          [
            "`code_challenge`",
            "Through the browser, at `/authorize`",
            "Nothing: it is a one-way hash with `S256` (with `plain` it would reveal the verifier)",
          ],
          [
            "`code`",
            "Through the browser, on the way back",
            "Almost nothing: without the verifier, the server rejects the exchange",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Generating and using the verifier/challenge pair",
        legenda: "TypeScript",
        codigo: [
          'import { createHash, randomBytes } from "node:crypto";',
          "",
          "// New for every login attempt: 32 random bytes become 43 base64url characters",
          'const codeVerifier = randomBytes(32).toString("base64url");',
          'const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url");',
          "",
          "// Keep the verifier in the session and send ONLY the challenge at /authorize:",
          "//   ...&code_challenge=<codeChallenge>&code_challenge_method=S256",
          "// When exchanging the code, send the verifier (and only then):",
          "//   grant_type=authorization_code&code=...&code_verifier=<codeVerifier>",
        ].join("\n"),
        nota: "In a browser, the same result comes from `crypto.getRandomValues` and `crypto.subtle.digest`. What matters is cryptographic randomness and a fresh value for every request.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "PKCE only works if the server enforces it",
        texto:
          "The server must **require** PKCE from the clients that should use it (reject requests without a `code_challenge`) and reject both an exchange without a `code_verifier`, when a challenge was sent, and a `code_verifier` with no earlier challenge; otherwise an attacker removes the parameter and defeats the protection (a downgrade attack). Also keep the exact `redirect_uri`, `state` (or verified PKCE as CSRF protection), `nonce` in OIDC and TLS. PKCE protects the code; it does not protect a token stolen after the exchange.",
      },
    ],
    armadilhas: [
      "Using `code_challenge_method=plain`, or omitting the method (the default is `plain`): the challenge becomes the verifier in plain sight.",
      "Generating the verifier with `Math.random()`, deriving it from predictable data or reusing it across logins: it must be cryptographically random and new for every request.",
      "Sending PKCE from the client without the server requiring and verifying it (or accepting the exchange without a verifier): it becomes decoration, and the attacker simply removes the parameter.",
      "Thinking PKCE replaces the exact `redirect_uri`, `state` and `nonce`: it protects the code exchange, not the code’s destination or the ID token.",
    ],
    autoteste: [
      {
        pergunta: "Which attack does PKCE prevent, and why does an attacker holding the intercepted code fail?",
        resposta:
          "The interception (or injection) of the code. Without the `code_verifier`, which never crossed the exposed channel, the server cannot validate the stored hash and rejects the exchange.",
      },
      {
        pergunta: "Why should a confidential client use PKCE if it already authenticates at `/token`?",
        resposta:
          "Because authentication proves who the client is, not that the code belongs to the current request. PKCE blocks code injection and is a second barrier if the secret leaks.",
      },
    ],
  },
};
