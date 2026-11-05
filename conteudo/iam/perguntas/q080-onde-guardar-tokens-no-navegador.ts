import type { Pergunta } from "../../tipos";

// Q80 · Onde guardar tokens no navegador
export const q080: Pergunta = {
  numero: 80,
  modulo: "tokens-e-sessoes",
  metodo: "compare",
  pt: {
    titulo: "Onde guardar tokens no navegador",
    pergunta:
      "Onde guardar tokens no navegador: localStorage, sessionStorage, memória ou cookie HttpOnly? Compare os riscos e explique a recomendação atual.",
    porqueEsteMetodo:
      "Cada lugar de armazenamento troca um risco por outro (XSS por CSRF, conveniência por exposição). A matriz coloca os lugares lado a lado, e a regra de decisão diz qual escolher conforme o risco da aplicação.",
    resposta30s:
      "Não guarde tokens de valor em **`localStorage` nem `sessionStorage`**: qualquer script da página (um XSS, uma dependência comprometida) lê o token e o leva embora. Para alto risco, use um **BFF**: o navegador só tem um **cookie `HttpOnly`** de sessão e os tokens ficam no servidor, ao custo de defender o CSRF. Sem backend próprio, a alternativa é manter o access token **em memória**, curto, com CSP rígida e renovação silenciosa, sem guardar no navegador um refresh token de longa vida.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Onde guardar, o que um XSS consegue e o que cada opção cobra",
        colunas: ["Onde", "O que um XSS consegue", "Persistência", "CSRF", "Custo", "Veredito"],
        linhas: [
          [
            "`localStorage`",
            "Ler e exfiltrar o token: ele sai do navegador e é usado de outro lugar até o `exp`",
            "Persiste entre abas e reinícios",
            "Não (não é enviado sozinho)",
            "Simples",
            "Evitar para qualquer token de valor",
          ],
          [
            "`sessionStorage`",
            "O mesmo: lê e exfiltra",
            "Uma aba; some ao fechá-la",
            "Não",
            "Simples; uma entrada por aba",
            "Pouco melhor: o roubo é igualmente fácil",
          ],
          [
            "Memória (variável ou closure)",
            "Não há token em disco, mas o script injetado pode chamar a mesma API ou interceptar a requisição enquanto a página vive",
            "Perde-se ao recarregar ou abrir outra aba",
            "Não",
            "Renovação silenciosa; mais código",
            "Aceitável com token curto, CSP rígida e sem refresh token de longa vida",
          ],
          [
            "Cookie `HttpOnly` de sessão (BFF)",
            "Não lê o cookie nem os tokens, que ficam no servidor; ainda faz requisições como o usuário enquanto a página vive",
            "Conforme a sessão",
            "Sim: exige `SameSite`, token anti-CSRF e conferência de `Origin`",
            "O servidor guarda sessão e tokens; mais infraestrutura",
            "Recomendado para alto risco",
          ],
          [
            "Cookie `HttpOnly` com o próprio token (sem BFF)",
            "Não lê o cookie; abusa da sessão aberta, como no BFF",
            "Conforme a validade do cookie",
            "Sim, como acima",
            "O navegador anexa o token; o refresh token ainda precisa de um lugar seguro",
            "Melhor que o `localStorage`, mas o BFF resolve mais",
          ],
        ],
        nota: "Cookie × header `Authorization`: o cookie `HttpOnly` protege contra a leitura do token e traz o CSRF de volta; o header evita o CSRF, mas obriga o JavaScript a segurar o token, que então pode ser lido.",
      },
      {
        tipo: "codigo",
        titulo: "O navegador só vê o cookie; o token fica no BFF",
        legenda: "HTTP",
        codigo: `GET /api/pedidos HTTP/1.1
Host: app.exemplo.com
Cookie: __Host-sid=Zp3kQ9xT...
Origin: https://app.exemplo.com

GET /pedidos HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...`,
        nota: "Na primeira requisição, o navegador fala só com o BFF (o backend da própria aplicação) por cookie de sessão. Na segunda, o BFF troca esse cookie pelo access token que guardou no servidor e chama a API. O token nunca chega ao JavaScript da página (veja Q41).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Alto risco** (financeiro, dados pessoais, administração): **BFF** com cookie de sessão `__Host-`, `Secure`, `HttpOnly` e `SameSite`, tokens no servidor e defesa de CSRF (veja Q41 e Q79). **SPA sem backend próprio e risco moderado**: tokens **em memória**, access token curto, CSP rígida, renovação silenciosa e, se houver refresh token, com rotação (veja Q34). **Nunca** `localStorage` para refresh token ou para JWT de longa duração. A orientação do IETF para aplicações no navegador (veja o documento vigente “OAuth 2.0 for Browser-Based Applications”) tende a apontar o BFF como a arquitetura mais segura.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O cookie `HttpOnly` muda o dano, não elimina o XSS",
        texto:
          "Com o token em `localStorage`, o XSS **leva** o token e o usa depois, de qualquer lugar. Com o cookie `HttpOnly`, o XSS só consegue **agir** de dentro do navegador da vítima, enquanto a página estiver aberta. É uma redução real de dano, não imunidade: o XSS precisa ser prevenido de qualquer forma (CSP, escape de saída, dependências auditadas), e o cookie traz o CSRF de volta (veja Q126 e Q127).",
      },
    ],
    armadilhas: [
      "JWT ou access token em `localStorage` “por conveniência”: qualquer XSS, dependência comprometida ou script de terceiros o exfiltra e o usa de outro lugar até o `exp`.",
      "Refresh token de longa duração no navegador, sem rotação nem vínculo ao remetente: é o ativo mais valioso, e roubá-lo dá acesso por semanas.",
      "Achar que o cookie `HttpOnly` resolve tudo e pular CSRF, CSP e sanitização.",
      "Pôr o token na URL (query ou fragmento): vaza em histórico, em `Referer` e em logs. Foi um dos motivos do fim do fluxo implícito (veja Q33).",
    ],
    autoteste: [
      {
        pergunta: "O que há de errado em guardar um JWT no `localStorage`?",
        resposta:
          "Todo script que roda na página pode lê-lo: um XSS, uma dependência comprometida ou um script de terceiros o copia e o usa de outro lugar até o `exp`. Ele ainda persiste depois do logout se o código não o apagar, e os claims ficam legíveis para quem o pegar.",
      },
      {
        pergunta: "Por que o BFF é a opção mais forte para alto risco, e o que ele cobra em troca?",
        resposta:
          "Porque os tokens ficam no servidor e o navegador só tem um cookie `HttpOnly`: o JavaScript nunca vê o token. Em troca, ele exige estado de sessão no servidor, defesa de CSRF e mais infraestrutura.",
      },
    ],
  },
  en: {
    titulo: "Where to store tokens in the browser",
    pergunta:
      "Where should you store tokens in the browser: localStorage, sessionStorage, memory or an HttpOnly cookie? Compare the risks and explain the current recommendation.",
    porqueEsteMetodo:
      "Each place to store a token trades one risk for another (XSS for CSRF, convenience for exposure). The matrix puts the options side by side, and the decision rule says which to pick according to the application’s risk.",
    resposta30s:
      "Do not keep valuable tokens in **`localStorage` or `sessionStorage`**: any script on the page (an XSS, a compromised dependency) reads the token and carries it off. For high risk, use a **BFF**: the browser only holds an **`HttpOnly` session cookie** and the tokens stay on the server, at the cost of defending against CSRF. Without your own backend, the alternative is to keep a short access token **in memory**, with a strict CSP and silent renewal, and not to keep a long-lived refresh token in the browser.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Where to store, what an XSS can do and what each option costs",
        colunas: ["Where", "What an XSS can do", "Persistence", "CSRF", "Cost", "Verdict"],
        linhas: [
          [
            "`localStorage`",
            "Read and exfiltrate the token: it leaves the browser and is used elsewhere until `exp`",
            "Persists across tabs and restarts",
            "No (it is not sent by itself)",
            "Simple",
            "Avoid for any valuable token",
          ],
          [
            "`sessionStorage`",
            "The same: read and exfiltrate",
            "One tab; gone when it closes",
            "No",
            "Simple; one entry per tab",
            "Slightly better: theft is just as easy",
          ],
          [
            "Memory (variable or closure)",
            "No token on disk, but injected script can call the same API or intercept the request while the page lives",
            "Lost on reload or in another tab",
            "No",
            "Silent renewal; more code",
            "Acceptable with a short token, a strict CSP and no long-lived refresh token",
          ],
          [
            "`HttpOnly` session cookie (BFF)",
            "Cannot read the cookie or the tokens, which stay on the server; can still make requests as the user while the page lives",
            "As long as the session",
            "Yes: needs `SameSite`, an anti-CSRF token and an `Origin` check",
            "The server holds session and tokens; more infrastructure",
            "Recommended for high risk",
          ],
          [
            "`HttpOnly` cookie carrying the token itself (no BFF)",
            "Cannot read the cookie; abuses the open session, as with the BFF",
            "As long as the cookie’s validity",
            "Yes, as above",
            "The browser attaches the token; the refresh token still needs a safe place",
            "Better than `localStorage`, but the BFF solves more",
          ],
        ],
        nota: "Cookie versus `Authorization` header: the `HttpOnly` cookie protects against reading the token and brings CSRF back; the header avoids CSRF, but forces JavaScript to hold the token, which can then be read.",
      },
      {
        tipo: "codigo",
        titulo: "The browser sees only the cookie; the token stays in the BFF",
        legenda: "HTTP",
        codigo: `GET /api/orders HTTP/1.1
Host: app.example.com
Cookie: __Host-sid=Zp3kQ9xT...
Origin: https://app.example.com

GET /orders HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...`,
        nota: "In the first request, the browser talks only to the BFF (the application’s own backend) with a session cookie. In the second, the BFF swaps that cookie for the access token it kept on the server and calls the API. The token never reaches the page’s JavaScript (see Q41).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**High risk** (financial, personal data, administration): a **BFF** with a `__Host-`, `Secure`, `HttpOnly` and `SameSite` session cookie, tokens on the server and CSRF defense (see Q41 and Q79). **SPA with no backend of its own and moderate risk**: tokens **in memory**, a short access token, a strict CSP, silent renewal and, if there is a refresh token, with rotation (see Q34). **Never** `localStorage` for a refresh token or a long-lived JWT. The IETF guidance for browser-based applications (see the current “OAuth 2.0 for Browser-Based Applications” document) tends to point to the BFF as the most secure architecture.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The `HttpOnly` cookie changes the damage, it does not remove XSS",
        texto:
          "With the token in `localStorage`, XSS **takes** the token and uses it later, from anywhere. With an `HttpOnly` cookie, XSS can only **act** from inside the victim’s browser, while the page is open. That is a real reduction in damage, not immunity: XSS must be prevented anyway (CSP, output escaping, audited dependencies), and the cookie brings CSRF back (see Q126 and Q127).",
      },
    ],
    armadilhas: [
      "A JWT or access token in `localStorage` “for convenience”: any XSS, compromised dependency or third-party script exfiltrates it and uses it from elsewhere until `exp`.",
      "A long-lived refresh token in the browser, with no rotation or sender binding: it is the most valuable asset, and stealing it grants access for weeks.",
      "Thinking the `HttpOnly` cookie solves everything and skipping CSRF defenses, CSP and sanitization.",
      "Putting the token in the URL (query or fragment): it leaks into history, `Referer` and logs. That was one of the reasons the implicit flow was retired (see Q33).",
    ],
    autoteste: [
      {
        pergunta: "What is wrong with keeping a JWT in `localStorage`?",
        resposta:
          "Every script running on the page can read it: an XSS, a compromised dependency or a third-party script copies it and uses it elsewhere until `exp`. It also persists after logout if the code does not erase it, and the claims are readable by whoever gets it.",
      },
      {
        pergunta: "Why is the BFF the strongest option for high risk, and what does it cost in return?",
        resposta:
          "Because the tokens stay on the server and the browser only holds an `HttpOnly` cookie: JavaScript never sees the token. In return, it needs server-side session state, CSRF defense and more infrastructure.",
      },
    ],
  },
};
