import type { Pergunta } from "../../tipos";

// Q41 · SPA com BFF
export const q041: Pergunta = {
  numero: 41,
  modulo: "oauth",
  metodo: "design",
  pt: {
    titulo: "SPA com BFF",
    pergunta:
      "Como proteger uma SPA que chama APIs? Compare tokens no navegador com o padrão Backend-for-Frontend (BFF) e explique por que o BFF é a recomendação atual para apps de alto risco.",
    porqueEsteMetodo:
      "É uma decisão de arquitetura com um requisito claro (nenhum token ao alcance de XSS) e alternativas com custos diferentes. Um roteiro de projeto leva dos requisitos aos dados e aos gargalos, e deixa explícito quando cada opção é aceitável.",
    resposta30s:
      "Numa SPA, todo JavaScript da página é o mesmo código: se um **XSS** rodar, ele lê qualquer token que a SPA leia. No padrão **BFF**, um backend da própria aplicação atua como **client OAuth confidencial**, guarda os tokens no servidor e entrega à SPA só um **cookie de sessão `HttpOnly`**, fazendo proxy das chamadas às APIs e exigindo proteção contra **CSRF**. Por isso o BFF é a recomendação para apps de alto risco; guardar o token em memória só é aceitável quando o risco é baixo e não há backend.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "A SPA chama APIs em nome do usuário, e **nenhum token pode ficar acessível a JavaScript**: se houver XSS, ele não leva tokens (nem o refresh token) para usar em outro lugar. Também importam logout limpo, renovação sem mostrar o login de novo e a mesma experiência em navegador e celular.",
          },
          {
            titulo: "2. Decisão central: quem fala OAuth",
            texto:
              "Um **BFF** (*Backend for Frontend*), servidor da própria aplicação, é o **client OAuth confidencial**: inicia o authorization code com PKCE, autentica-se no `/token` (segredo ou `private_key_jwt`), guarda os tokens no servidor e entrega à SPA somente um **cookie de sessão** `HttpOnly`, `Secure` e `SameSite`, de preferência com o prefixo `__Host-`. A SPA nunca vê um token.",
          },
          {
            titulo: "3. Contrato",
            texto:
              "Rotas do BFF: `GET /bff/login` (redireciona ao authorization server), `GET /bff/callback` (troca o `code`, cria a sessão e gera um identificador novo), `GET /bff/user` (dados do usuário para a interface), `POST /bff/logout` (encerra a sessão e revoga tokens) e `/api/*` (proxy que anexa `Authorization: Bearer` e repassa à API). SPA e BFF ficam no mesmo site (por exemplo, `app.example.com`), para o cookie ser *same-site*.",
          },
          {
            titulo: "4. Proteção contra CSRF",
            texto:
              "Como o navegador envia o cookie sozinho, o BFF precisa de defesa própria: `SameSite=Lax` ou `Strict`, verificação do `Origin` e um cabeçalho personalizado obrigatório (por exemplo, `X-CSRF: 1`) nas rotas que mudam estado, que um formulário de outro site não consegue enviar. Restrinja o CORS ao origin da SPA.",
          },
          {
            titulo: "5. Dados",
            texto:
              "Um armazenamento de sessões (Redis ou banco) com id da sessão, `sub`, access token e refresh token (cifrados), expirações deslizante e absoluta (veja Q78) e contexto de CSRF. A renovação de tokens acontece no BFF, uma por vez (veja Q34).",
          },
          {
            titulo: "6. Gargalos e operação",
            texto:
              "O BFF guarda estado e está no caminho de toda chamada: escale com armazenamento compartilhado, mantenha o proxy fino, observe latência e erros e proteja as sessões como um cofre. Ele acopla a SPA ao BFF (deploy e domínio) e é mais um componente a operar. O trade-off aceito é mais infraestrutura em troca de menos superfície de ataque.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde guardar o token de uma SPA",
        colunas: ["Opção", "Como funciona", "Exposição a XSS", "Quando usar"],
        linhas: [
          [
            "`localStorage` ou `sessionStorage`",
            "A SPA é client público e guarda os tokens no armazenamento do navegador",
            "Máxima: qualquer script lê e exfiltra os tokens, que sobrevivem a recarregamentos",
            "Evitar. Só em protótipos ou risco muito baixo",
          ],
          [
            "Token em memória (variável JS)",
            "A SPA é client público (code com PKCE), mantém o access token só em memória e renova com refresh rotacionado",
            "Alta enquanto a aba vive: um script injetado lê a variável; ela some no recarregamento, o que limita a janela",
            "Risco baixo a moderado, sem backend próprio, access token curto, CSP rígida e, se houver refresh, rotação ou DPoP (Q34, Q37)",
          ],
          [
            "BFF com cookie de sessão",
            "O BFF guarda os tokens; a SPA tem só o cookie `HttpOnly`",
            "Nenhum token exposto: um XSS ainda pode **usar** a sessão enquanto a aba está aberta, mas não leva tokens embora",
            "Apps de alto risco: financeiro, saúde, dados sensíveis, administração",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Uma sessão no BFF",
        etapas: [
          "A SPA chama `GET /bff/user`; sem sessão, o BFF responde `401` e a SPA navega para `/bff/login`",
          "O BFF cria `state` e o PKCE (`code_verifier`), guarda-os numa sessão temporária e redireciona ao authorization server",
          "O usuário se autentica e o servidor redireciona para `/bff/callback` com `code` e `state`",
          "O BFF confere o `state`, troca o `code` por tokens no `/token` (autenticando-se), valida o ID token (veja Q43), cria a sessão e responde com `Set-Cookie: __Host-sid=...; Secure; HttpOnly; SameSite=Lax; Path=/`",
          "A SPA chama `/api/orders`; o navegador envia o cookie; o BFF acha a sessão, renova o access token se preciso e encaminha a chamada com `Authorization: Bearer`",
          "No logout, o BFF apaga a sessão, revoga os tokens (veja Q35) e, se desejado, encerra a sessão no authorization server",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que o BFF é a recomendação para apps de alto risco",
        texto:
          "Num navegador, **o código da página é um só**: se um XSS rodar, ele lê o que a SPA lê. Token em `localStorage` ou em memória é, portanto, token que um atacante pode levar. No BFF o **segredo nunca entra no navegador**: o XSS não consegue exfiltrar tokens para usar depois, em outro computador, e só age enquanto a aba está aberta. As boas práticas do IETF para aplicações em navegador (OAuth 2.0 for Browser-Based Applications; a pergunta cita a RFC 10017, confira o número no RFC Editor) colocam o BFF como a arquitetura mais segura, seguida do backend que apenas medeia tokens e, por último, do client puramente no navegador.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que o BFF não resolve",
        texto:
          "O BFF não elimina o XSS: um script injetado ainda faz chamadas autenticadas pelo cookie enquanto a aba está aberta. Mantenha CSP rígida, dependências sob controle e sessões de vida limitada. Ele também não resolve o CSRF sozinho (precisa das defesas acima) e vira ponto único de falha e de ataque: proteja o armazenamento das sessões. Token em memória é aceitável quando não há backend, o risco é baixo e o access token é curto; nunca persista o refresh token no navegador sem rotação ou vínculo ao remetente.",
      },
    ],
    armadilhas: [
      "Pôr o BFF em outro site e depender de cookie de terceiros: navegadores restringem esses cookies. Mantenha SPA e BFF no mesmo site.",
      "Esquecer a defesa contra CSRF porque o cookie é `HttpOnly`: `HttpOnly` impede a leitura por script, mas não impede o navegador de enviar o cookie sozinho.",
      "Repassar o token da sessão para a SPA “só para facilitar”: desfaz o objetivo do BFF. Devolva dados, não tokens.",
      "Não gerar um identificador de sessão novo após o login, ou deixar a sessão sem teto absoluto: fixação de sessão e sessões eternas.",
    ],
    autoteste: [
      {
        pergunta: "Por que o BFF protege melhor os tokens do que a SPA sozinha?",
        resposta:
          "Porque os tokens ficam no servidor, e a SPA só tem um cookie `HttpOnly` que scripts não leem. Um XSS pode usar a sessão enquanto a aba está aberta, mas não consegue levar tokens para usar depois e em outro lugar.",
      },
      {
        pergunta: "Quando é aceitável guardar o access token em memória na SPA?",
        resposta:
          "Quando não há backend próprio, o risco é baixo, o access token tem vida curta, a CSP é rígida e não há refresh token persistido (ou ele é rotacionado ou vinculado ao remetente). Em alto risco, use o BFF.",
      },
    ],
  },
  en: {
    titulo: "SPAs and the BFF pattern",
    pergunta:
      "How do you secure a SPA that calls APIs? Compare tokens in the browser with the Backend-for-Frontend (BFF) pattern, and explain why BFF is the current recommendation for high-risk apps.",
    porqueEsteMetodo:
      "This is an architecture decision with a clear requirement (no token within reach of XSS) and alternatives with different costs. A design script goes from requirements to data and bottlenecks, and makes explicit when each option is acceptable.",
    resposta30s:
      "In a SPA, all the page’s JavaScript is one and the same code: if an **XSS** runs, it can read any token the SPA can read. In the **BFF** pattern, a backend belonging to the application acts as a **confidential OAuth client**, keeps the tokens on the server and hands the SPA only an **`HttpOnly` session cookie**, proxying the API calls and requiring **CSRF** protection. That is why BFF is the recommendation for high-risk apps; keeping the token in memory is only acceptable when risk is low and there is no backend.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "The SPA calls APIs on the user’s behalf, and **no token may be reachable by JavaScript**: if there is XSS, it cannot carry tokens (or the refresh token) away to use elsewhere. Clean logout, renewal without showing the login again, and the same experience on browser and phone also matter.",
          },
          {
            titulo: "2. Central decision: who speaks OAuth",
            texto:
              "A **BFF** (*Backend for Frontend*), a server belonging to the application itself, is the **confidential OAuth client**: it starts the authorization code flow with PKCE, authenticates at `/token` (secret or `private_key_jwt`), keeps the tokens on the server and hands the SPA only a **session cookie** that is `HttpOnly`, `Secure` and `SameSite`, preferably with the `__Host-` prefix. The SPA never sees a token.",
          },
          {
            titulo: "3. Contract",
            texto:
              "BFF routes: `GET /bff/login` (redirects to the authorization server), `GET /bff/callback` (exchanges the `code`, creates the session and issues a new identifier), `GET /bff/user` (user data for the interface), `POST /bff/logout` (ends the session and revokes tokens) and `/api/*` (a proxy that attaches `Authorization: Bearer` and forwards to the API). SPA and BFF stay on the same site (for example, `app.example.com`), so the cookie is *same-site*.",
          },
          {
            titulo: "4. CSRF protection",
            texto:
              "Since the browser sends the cookie on its own, the BFF needs its own defense: `SameSite=Lax` or `Strict`, `Origin` verification and a mandatory custom header (for example, `X-CSRF: 1`) on state-changing routes, which a form from another site cannot send. Restrict CORS to the SPA’s origin.",
          },
          {
            titulo: "5. Data",
            texto:
              "A session store (Redis or a database) with session id, `sub`, access token and refresh token (encrypted), sliding and absolute expiries (see Q78) and CSRF context. Token renewal happens in the BFF, one at a time (see Q34).",
          },
          {
            titulo: "6. Bottlenecks and operations",
            texto:
              "The BFF holds state and sits in the path of every call: scale it with shared storage, keep the proxy thin, watch latency and errors and protect the sessions like a vault. It couples the SPA to the BFF (deployment and domain) and is one more component to run. The accepted trade-off is more infrastructure in exchange for less attack surface.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where to keep a SPA’s token",
        colunas: ["Option", "How it works", "Exposure to XSS", "When to use"],
        linhas: [
          [
            "`localStorage` or `sessionStorage`",
            "The SPA is a public client and keeps the tokens in browser storage",
            "Maximum: any script reads and exfiltrates the tokens, which survive reloads",
            "Avoid. Only for prototypes or very low risk",
          ],
          [
            "Token in memory (a JS variable)",
            "The SPA is a public client (code with PKCE), keeps the access token only in memory and renews with a rotated refresh token",
            "High while the tab lives: an injected script reads the variable; it vanishes on reload, which limits the window",
            "Low to moderate risk, no backend of your own, a short access token, a strict CSP and, if there is a refresh token, rotation or DPoP (Q34, Q37)",
          ],
          [
            "BFF with a session cookie",
            "The BFF keeps the tokens; the SPA only has the `HttpOnly` cookie",
            "No token exposed: an XSS can still **use** the session while the tab is open, but cannot carry tokens away",
            "High-risk apps: finance, healthcare, sensitive data, administration",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A session through the BFF",
        etapas: [
          "The SPA calls `GET /bff/user`; with no session, the BFF answers `401` and the SPA navigates to `/bff/login`",
          "The BFF creates `state` and PKCE (`code_verifier`), stores them in a temporary session and redirects to the authorization server",
          "The user authenticates and the server redirects to `/bff/callback` with `code` and `state`",
          "The BFF checks the `state`, exchanges the `code` for tokens at `/token` (authenticating itself), validates the ID token (see Q43), creates the session and responds with `Set-Cookie: __Host-sid=...; Secure; HttpOnly; SameSite=Lax; Path=/`",
          "The SPA calls `/api/orders`; the browser sends the cookie; the BFF finds the session, renews the access token if needed and forwards the call with `Authorization: Bearer`",
          "On logout, the BFF deletes the session, revokes the tokens (see Q35) and, if desired, ends the session at the authorization server",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why BFF is the recommendation for high-risk apps",
        texto:
          "In a browser, **the page’s code is one body of code**: if an XSS runs, it reads what the SPA reads. A token in `localStorage` or in memory is therefore a token an attacker can take. With a BFF the **secret never enters the browser**: the XSS cannot exfiltrate tokens to use later, on another machine, and can only act while the tab is open. The IETF best practices for browser-based applications (OAuth 2.0 for Browser-Based Applications; the question cites RFC 10017, so check the number at the RFC Editor) rank BFF as the most secure architecture, followed by a backend that merely mediates tokens and, last, a purely in-browser client.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What the BFF does not solve",
        texto:
          "The BFF does not eliminate XSS: an injected script can still make calls authenticated by the cookie while the tab is open. Keep a strict CSP, dependencies under control and sessions of limited life. It also does not solve CSRF by itself (it needs the defenses above) and becomes a single point of failure and attack: protect the session store. A token in memory is acceptable when there is no backend, the risk is low and the access token is short; never persist the refresh token in the browser without rotation or sender-constraining.",
      },
    ],
    armadilhas: [
      "Putting the BFF on another site and relying on third-party cookies: browsers restrict those cookies. Keep the SPA and the BFF on the same site.",
      "Skipping CSRF defense because the cookie is `HttpOnly`: `HttpOnly` stops scripts from reading the cookie, but does not stop the browser from sending it on its own.",
      "Passing the session’s token on to the SPA “just to make things easier”: it undoes the point of the BFF. Return data, not tokens.",
      "Not issuing a new session identifier after login, or leaving the session without an absolute ceiling: session fixation and eternal sessions.",
    ],
    autoteste: [
      {
        pergunta: "Why does the BFF protect tokens better than the SPA alone?",
        resposta:
          "Because the tokens stay on the server, and the SPA only has an `HttpOnly` cookie that scripts cannot read. An XSS can use the session while the tab is open, but it cannot carry tokens away to use later and elsewhere.",
      },
      {
        pergunta: "When is it acceptable to keep the access token in memory in the SPA?",
        resposta:
          "When there is no backend of your own, the risk is low, the access token is short-lived, the CSP is strict and no refresh token is persisted (or it is rotated or sender-constrained). For high risk, use the BFF.",
      },
    ],
  },
};
