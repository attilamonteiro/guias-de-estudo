import type { Pergunta } from "../../tipos";

// L205 · Proteger tokens de autenticação
export const l205: Pergunta = {
  numero: 205,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "threat",
  pt: {
    titulo: "Proteger tokens de autenticação",
    pergunta: "Como você protege tokens de autenticação?",
    porqueEsteMetodo:
      "Cada lugar de guardar o token tem um ataque que o favorece e outro que o prejudica. Os pares ataque → defesa deixam claro o que se ganha e o que se perde em cada escolha, em vez de uma receita única.",
    resposta30s:
      "Os ataques principais são o **XSS** (um script lê o token do `localStorage`), o **CSRF** (se o token vai em cookie, o navegador o anexa sozinho) e a **interceptação** sem HTTPS. A defesa combina **HTTPS**, tokens de **vida curta com renovação**, cookie **`HttpOnly` + `Secure` + `SameSite`** ou sessão guardada no servidor e, acima de tudo, **evitar o XSS** com sanitização e CSP. Nenhuma opção é perfeita: cada uma troca um risco por outro.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem: "XSS: um script injetado lê o `localStorage` ou o `sessionStorage` e envia o token ao atacante",
            destino:
              "Previna o XSS (veja L200), use CSP (veja L209) e tire o token do alcance do JavaScript: **cookie `HttpOnly`** ou token **só em memória**. Em memória a exposição diminui, mas um script na página ainda pode usá-lo.",
          },
          {
            origem: "CSRF: com o token em cookie, o navegador o anexa às requisições disparadas por outro site",
            destino:
              "Cookie com **`SameSite`** (Lax ou Strict), token anti-CSRF, verificação de `Origin` no servidor e nenhuma mudança de estado em GET (veja L207).",
          },
          {
            origem: "Interceptação na rede (Wi-Fi aberto, proxy): o token trafega em texto puro",
            destino: "**HTTPS em tudo**, cookie com `Secure` e HSTS para impedir que a conexão recue para HTTP.",
          },
          {
            origem: "Um token roubado continua valendo por muito tempo",
            destino:
              "**Access token de vida curta** (minutos) com **refresh token com rotação**, guardado em cookie `HttpOnly`, e revogação no servidor quando houver suspeita.",
          },
          {
            origem: "O token vaza por URL, log, cabeçalho `Referer` ou ferramenta de monitoramento de erros",
            destino:
              "Nunca na query string; não registrar `Authorization` nem cookies em logs e relatórios de erro; `Referrer-Policy` restritiva.",
          },
          {
            origem: "Tokens espalhados pelo front-end, difíceis de proteger e de revogar",
            destino:
              "**Sessão no servidor (padrão BFF):** o navegador só guarda um cookie opaco de sessão, os tokens das APIs ficam no backend e a sessão pode ser revogada na hora.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde guardar o token",
        colunas: [
          "Onde guardar",
          "Um script (XSS) lê o token?",
          "Exposto a CSRF?",
          "Sobrevive ao recarregar?",
          "O que se ganha e o que se perde",
        ],
        linhas: [
          [
            "`localStorage`",
            "Sim, qualquer script da página",
            "Não, não vai sozinho",
            "Sim",
            "Simples e prático, mas um XSS leva o token embora; evite para tokens de longa duração",
          ],
          [
            "Memória (variável ou estado)",
            "Não lê de nenhum storage, mas um script na página ainda pode usar ou capturar o token",
            "Não",
            "Não: some ao recarregar ou fechar a aba",
            "Reduz a exposição; exige renovar a sessão ao recarregar, o que costuma depender de um cookie",
          ],
          [
            "Cookie `HttpOnly` + `Secure` + `SameSite`",
            "Não lê o cookie, mas um XSS ainda faz requisições em nome do usuário",
            "Sim, se faltar `SameSite` ou proteção anti-CSRF",
            "Sim",
            "Protege o valor do token; troca o roubo por XSS pelo risco de CSRF, que se mitiga",
          ],
          [
            "Sessão no servidor (cookie opaco)",
            "Só lê um identificador sem significado fora do servidor",
            "Sim, como o cookie acima",
            "Sim",
            "Revogação imediata e tokens fora do navegador; custa estado no servidor e uma camada de BFF",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cookie que o JavaScript não lê",
        legenda: "JavaScript",
        codigo: `// Servidor (Express): cookie de sessão fora do alcance do JavaScript do navegador
res.cookie("sessao", idDaSessao, {
  httpOnly: true, // invisível para document.cookie
  secure: true, // só trafega por HTTPS
  sameSite: "lax", // não vai em requisições cruzadas comuns
  maxAge: 15 * 60 * 1000, // vida curta
});

// Cliente: o navegador anexa o cookie sozinho
await fetch("/api/pedidos", { credentials: "include" }); // include vale para chamadas entre origens`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Escolha pelo risco que você quer reduzir",
        texto:
          "Não há vencedor universal. Um cookie `HttpOnly` com `Secure` e `SameSite` (ou uma sessão no servidor) costuma ser considerado o ponto de partida mais seguro para o navegador, **junto de uma defesa contra CSRF**. Token em memória com renovação por cookie `HttpOnly` é um meio-termo comum quando o front chama APIs de outra origem. `localStorage` só faz sentido com tokens de vida curta, CSP e sanitização rigorosas. Em todos os casos: HTTPS, vida curta, revogação e nada de token em URL ou em log.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Nenhuma escolha dispensa sanitização e CSP",
        texto:
          "O `HttpOnly` impede que o script **leia** o cookie, mas um XSS ainda dispara requisições com ele, em nome do usuário, enquanto a página estiver aberta. Por isso a primeira linha de defesa continua sendo não deixar o script entrar: escape do JSX, sanitização, validação de URLs e CSP. A autorização de verdade é sempre decidida no servidor; esconder um botão ou uma rota no front-end não protege nada.",
      },
    ],
    armadilhas: [
      "Achar que `HttpOnly` resolve o XSS: o script não lê o cookie, mas ainda faz requisições em nome do usuário.",
      "Guardar tokens de longa duração no `localStorage` por conveniência.",
      "Esquecer o CSRF ao mudar para cookie: o navegador o anexa sozinho, e sem `SameSite` e proteção anti-CSRF qualquer site pode disparar requisições.",
      "Colocar o token na URL ou registrá-lo em logs e em ferramentas de monitoramento de erros.",
    ],
    autoteste: [
      {
        pergunta: "Por que o `localStorage` é arriscado para guardar tokens?",
        resposta:
          "Porque qualquer script que rode na página, inclusive um injetado por XSS ou vindo de uma dependência comprometida, consegue ler o `localStorage` e enviar o token ao atacante. Um cookie `HttpOnly` não é legível pelo JavaScript.",
      },
      {
        pergunta: "O cookie `HttpOnly` resolve tudo? O que ele troca?",
        resposta:
          "Não. Ele protege o valor do cookie contra leitura por script, mas o navegador passa a anexá-lo sozinho, o que traz o risco de CSRF (mitigado com `SameSite` e token anti-CSRF); e um XSS ainda faz requisições em nome do usuário. Por isso também são necessários sanitização e CSP.",
      },
    ],
  },
  en: {
    titulo: "Protecting authentication tokens",
    pergunta: "How do you protect authentication tokens?",
    porqueEsteMetodo:
      "Every place you can keep a token has one attack that favors it and another that hurts it. The attack → defense pairs make clear what you gain and lose with each choice, instead of a single recipe.",
    resposta30s:
      "The main attacks are **XSS** (a script reads the token from `localStorage`), **CSRF** (if the token travels in a cookie, the browser attaches it by itself) and **interception** without HTTPS. The defense combines **HTTPS**, **short-lived tokens with renewal**, an **`HttpOnly` + `Secure` + `SameSite`** cookie or a session kept on the server and, above all, **preventing XSS** with sanitization and CSP. No option is perfect: each one trades one risk for another.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "XSS: an injected script reads `localStorage` or `sessionStorage` and sends the token to the attacker",
            destino:
              "Prevent XSS (see L200), use CSP (see L209) and take the token out of JavaScript’s reach: an **`HttpOnly` cookie** or a token **only in memory**. In memory the exposure shrinks, but a script on the page can still use it.",
          },
          {
            origem: "CSRF: with the token in a cookie, the browser attaches it to requests fired by another site",
            destino:
              "A cookie with **`SameSite`** (Lax or Strict), an anti-CSRF token, an `Origin` check on the server and no state changes on GET (see L207).",
          },
          {
            origem: "Network interception (open Wi-Fi, a proxy): the token travels in plain text",
            destino:
              "**HTTPS everywhere**, a cookie with `Secure` and HSTS to stop the connection from falling back to HTTP.",
          },
          {
            origem: "A stolen token stays valid for a long time",
            destino:
              "A **short-lived access token** (minutes) with a **rotating refresh token**, kept in an `HttpOnly` cookie, and revocation on the server when there is suspicion.",
          },
          {
            origem: "The token leaks through a URL, a log, the `Referer` header or an error-monitoring tool",
            destino:
              "Never in the query string; do not record `Authorization` or cookies in logs and error reports; a restrictive `Referrer-Policy`.",
          },
          {
            origem: "Tokens scattered across the front end, hard to protect and to revoke",
            destino:
              "**Server-side session (BFF pattern):** the browser only holds an opaque session cookie, the API tokens stay on the backend and the session can be revoked at once.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to keep the token",
        colunas: [
          "Where to keep it",
          "Can a script (XSS) read the token?",
          "Exposed to CSRF?",
          "Survives a reload?",
          "What you gain and what you lose",
        ],
        linhas: [
          [
            "`localStorage`",
            "Yes, any script on the page",
            "No, it does not travel by itself",
            "Yes",
            "Simple and practical, but an XSS carries the token away; avoid it for long-lived tokens",
          ],
          [
            "Memory (variable or state)",
            "It reads from no storage, but a script on the page can still use or capture the token",
            "No",
            "No: it disappears on reload or when the tab closes",
            "Reduces exposure; you must renew the session on reload, which usually depends on a cookie",
          ],
          [
            "`HttpOnly` + `Secure` + `SameSite` cookie",
            "It cannot read the cookie, but an XSS can still make requests on the user’s behalf",
            "Yes, if `SameSite` or anti-CSRF protection is missing",
            "Yes",
            "Protects the token value; trades theft through XSS for the CSRF risk, which can be mitigated",
          ],
          [
            "Server-side session (opaque cookie)",
            "It only reads an identifier that means nothing outside the server",
            "Yes, like the cookie above",
            "Yes",
            "Immediate revocation and tokens kept out of the browser; costs server state and a BFF layer",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A cookie JavaScript cannot read",
        legenda: "JavaScript",
        codigo: `// Server (Express): a session cookie out of the browser JavaScript’s reach
res.cookie("session", sessionId, {
  httpOnly: true, // invisible to document.cookie
  secure: true, // only travels over HTTPS
  sameSite: "lax", // not sent on ordinary cross-site requests
  maxAge: 15 * 60 * 1000, // short lifetime
});

// Client: the browser attaches the cookie by itself
await fetch("/api/orders", { credentials: "include" }); // include matters for cross-origin calls`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Choose by the risk you want to reduce",
        texto:
          "There is no universal winner. An `HttpOnly` cookie with `Secure` and `SameSite` (or a server-side session) is usually considered the safest starting point for the browser, **together with a CSRF defense**. A token in memory with renewal through an `HttpOnly` cookie is a common middle ground when the front end calls APIs on another origin. `localStorage` only makes sense with short-lived tokens, CSP and strict sanitization. In every case: HTTPS, short lifetimes, revocation and no token in URLs or logs.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "No choice replaces sanitization and CSP",
        texto:
          "`HttpOnly` stops a script from **reading** the cookie, but an XSS can still fire requests with it, on the user’s behalf, while the page is open. So the first line of defense remains keeping the script out: JSX escaping, sanitization, URL validation and CSP. Real authorization is always decided on the server; hiding a button or a route in the front end protects nothing.",
      },
    ],
    armadilhas: [
      "Thinking `HttpOnly` solves XSS: the script cannot read the cookie, but it can still make requests on the user’s behalf.",
      "Keeping long-lived tokens in `localStorage` for convenience.",
      "Forgetting CSRF when switching to cookies: the browser attaches them by itself, and without `SameSite` and anti-CSRF protection any site can fire requests.",
      "Putting the token in the URL or recording it in logs and error-monitoring tools.",
    ],
    autoteste: [
      {
        pergunta: "Why is `localStorage` risky for keeping tokens?",
        resposta:
          "Because any script running on the page, including one injected by XSS or coming from a compromised dependency, can read `localStorage` and send the token to the attacker. An `HttpOnly` cookie is not readable by JavaScript.",
      },
      {
        pergunta: "Does an `HttpOnly` cookie solve everything? What does it trade?",
        resposta:
          "No. It protects the cookie value from being read by scripts, but the browser now attaches it by itself, which brings the CSRF risk (mitigated with `SameSite` and an anti-CSRF token); and an XSS can still make requests on the user’s behalf. That is why sanitization and CSP are still needed.",
      },
    ],
  },
};
