import type { Pergunta } from "../../tipos";

// L207 · O que é CSRF
export const l207: Pergunta = {
  numero: 207,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "threat",
  pt: {
    titulo: "O que é CSRF",
    pergunta: "O que é CSRF?",
    porqueEsteMetodo:
      "CSRF se entende pelo ataque: sem ver como o site malicioso aproveita o cookie, as defesas parecem uma lista de regras soltas. Cada par ataque → defesa mostra o que o atacante controla e qual mecanismo tira esse controle.",
    resposta30s:
      "No **CSRF** (cross-site request forgery), um site malicioso faz o navegador da vítima enviar uma requisição a outro site onde ela está logada, aproveitando que os **cookies vão automaticamente**: o servidor acha que foi a própria pessoa. A defesa é combinar cookies **`SameSite`**, **tokens anti-CSRF**, verificação de `Origin`, exigência de cabeçalho customizado ou JSON e nunca mudar estado em GET. APIs com token no cabeçalho `Authorization` ficam menos expostas, porque o navegador não o anexa sozinho.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "Um site malicioso dispara um `POST` (formulário enviado sozinho, `fetch`) para o site em que a vítima está logada, e o navegador anexa o cookie de sessão",
            destino:
              "Cookie de sessão com **`SameSite=Lax` ou `Strict`**: o navegador deixa de enviá-lo em requisições disparadas por outro site (com `Lax`, ainda passa a navegação de topo segura, como clicar num link).",
          },
          {
            origem: "O servidor aceita qualquer requisição que traga um cookie válido, sem saber de onde ela veio",
            destino:
              "**Token anti-CSRF**: um valor imprevisível, ligado à sessão, enviado em cabeçalho ou campo oculto e conferido no servidor. O atacante não consegue lê-lo de outra origem.",
          },
          {
            origem: "Requisição de origem estranha que o servidor não distingue da legítima",
            destino:
              "Conferir os cabeçalhos **`Origin`** (e `Referer`) e `Sec-Fetch-Site`, e recusar mudança de estado vinda de origem não esperada.",
          },
          {
            origem: "Formulário simples que dispensa o preflight de CORS (`application/x-www-form-urlencoded`)",
            destino:
              "Exigir **cabeçalho customizado** (como `X-CSRF-Token`) ou `Content-Type: application/json` e recusar o resto: uma requisição entre origens com esses elementos exige preflight, que o atacante não passa com CORS bem configurado.",
          },
          {
            origem: "Ação que muda estado por GET (`/excluir?id=1`), disparável por uma imagem ou um link",
            destino: "GET só lê. Mudanças de estado em POST, PUT, PATCH ou DELETE, nunca atrás de um link simples.",
          },
          {
            origem: "CORS frouxo: refletir qualquer `Origin` junto com `Access-Control-Allow-Credentials: true`",
            destino:
              "**Lista permitida** de origens; nunca refletir uma origem arbitrária quando as credenciais são aceitas.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Servidor: recusar mudança de estado sem o token",
        legenda: "JavaScript",
        codigo: `// Express: recusa POST, PUT, PATCH e DELETE sem o token anti-CSRF da sessão
app.use((req, res, next) => {
  const soLeitura = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (soLeitura) return next();

  const token = req.get("X-CSRF-Token");
  if (token && token === req.session.csrfToken) return next(); // em produção, compare em tempo constante

  res.status(403).json({ erro: "Token CSRF inválido" });
});`,
      },
      {
        tipo: "codigo",
        titulo: "Cliente React: enviar o token em um cabeçalho",
        legenda: "TSX",
        codigo: `// O token vem de um endpoint ou de uma meta tag entregue pelo servidor
async function salvarPerfil(dados: Perfil, tokenCsrf: string) {
  const resposta = await fetch("/api/perfil", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": tokenCsrf },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error("Falha ao salvar");
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Por que o cabeçalho Authorization ajuda, e o que muda num app React",
        texto:
          "O CSRF explora o fato de o **navegador anexar o cookie sozinho**. Um token enviado no cabeçalho `Authorization`, que o JavaScript do seu app adiciona de propósito, **não é anexado por outro site**, então a API fica pouco exposta. Em contrapartida o token precisa morar onde o JavaScript o leia, e o risco se desloca para o XSS (veja L205). Num app React: SPA com **cookie de sessão** precisa de `SameSite` mais token anti-CSRF ou cabeçalho customizado; SPA com **token Bearer no cabeçalho** quase não precisa de defesa de CSRF, mas deve levar o XSS a sério; formulário HTML que envia direto ao servidor precisa do token num campo oculto.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O XSS derruba essas defesas",
        texto:
          "Um script injetado roda na mesma origem: lê o token anti-CSRF e faz requisições legítimas, então anti-CSRF não protege contra XSS (veja L200). E `SameSite` considera “mesmo site” os subdomínios do mesmo domínio: um subdomínio comprometido ainda conta como o mesmo site, e `Lax` permite navegação de topo. Em ações sensíveis, mantenha o token ou a checagem de `Origin` além do `SameSite`.",
      },
    ],
    armadilhas: [
      "Achar que CORS protege contra CSRF: ele controla a leitura da resposta, mas uma requisição simples ainda chega ao servidor e é executada.",
      "Mudar estado em GET: uma imagem ou um link bastam para disparar a ação.",
      "Confiar só no `SameSite`: subdomínios contam como o mesmo site e `Lax` deixa passar a navegação de topo.",
      "Gerar o token de forma previsível ou não conferi-lo no servidor: o cabeçalho presente não basta, o valor tem de bater com o da sessão.",
    ],
    autoteste: [
      {
        pergunta: "Como funciona um ataque CSRF e por que o cookie o torna possível?",
        resposta:
          "O site malicioso faz o navegador da vítima enviar uma requisição a outro site em que ela está logada. Como o navegador anexa os cookies de sessão automaticamente, o servidor trata a requisição como legítima, mesmo sem a pessoa ter feito a ação.",
      },
      {
        pergunta: "Por que uma API com token no cabeçalho `Authorization` é menos exposta ao CSRF, e que risco volta?",
        resposta:
          "Porque o navegador não anexa esse cabeçalho sozinho: só o JavaScript do próprio app o envia, e um site de fora não consegue. O risco que volta é o XSS, pois o token precisa estar acessível ao JavaScript.",
      },
    ],
  },
  en: {
    titulo: "What is CSRF",
    pergunta: "What is CSRF?",
    porqueEsteMetodo:
      "CSRF is understood through the attack: without seeing how the malicious site takes advantage of the cookie, the defenses look like a list of loose rules. Each attack → defense pair shows what the attacker controls and which mechanism takes that control away.",
    resposta30s:
      "In **CSRF** (cross-site request forgery), a malicious site makes the victim’s browser send a request to another site where they are logged in, taking advantage of the fact that **cookies are sent automatically**: the server thinks the person did it. The defense is to combine **`SameSite`** cookies, **anti-CSRF tokens**, `Origin` checks, requiring a custom header or JSON and never changing state on GET. APIs with a token in the `Authorization` header are less exposed, because the browser does not attach it by itself.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "A malicious site fires a `POST` (a self-submitting form, `fetch`) at the site where the victim is logged in, and the browser attaches the session cookie",
            destino:
              "A session cookie with **`SameSite=Lax` or `Strict`**: the browser stops sending it on requests fired by another site (with `Lax`, safe top-level navigation, such as clicking a link, still gets through).",
          },
          {
            origem: "The server accepts any request that carries a valid cookie, without knowing where it came from",
            destino:
              "An **anti-CSRF token**: an unpredictable value tied to the session, sent in a header or hidden field and checked on the server. The attacker cannot read it from another origin.",
          },
          {
            origem: "A request from a strange origin that the server cannot tell apart from a legitimate one",
            destino:
              "Check the **`Origin`** header (and `Referer`) and `Sec-Fetch-Site`, and refuse state changes from an unexpected origin.",
          },
          {
            origem: "A simple form that skips the CORS preflight (`application/x-www-form-urlencoded`)",
            destino:
              "Require a **custom header** (such as `X-CSRF-Token`) or `Content-Type: application/json` and reject anything else: a cross-origin request with those elements triggers a preflight, which the attacker does not pass with well-configured CORS.",
          },
          {
            origem: "An action that changes state through GET (`/delete?id=1`), triggerable by an image or a link",
            destino: "GET only reads. State changes go in POST, PUT, PATCH or DELETE, never behind a plain link.",
          },
          {
            origem: "Loose CORS: reflecting any `Origin` together with `Access-Control-Allow-Credentials: true`",
            destino: "An **allowlist** of origins; never reflect an arbitrary origin when credentials are accepted.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Server: refuse state changes without the token",
        legenda: "JavaScript",
        codigo: `// Express: refuses POST, PUT, PATCH and DELETE without the session's anti-CSRF token
app.use((req, res, next) => {
  const readOnly = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (readOnly) return next();

  const token = req.get("X-CSRF-Token");
  if (token && token === req.session.csrfToken) return next(); // in production, compare in constant time

  res.status(403).json({ error: "Invalid CSRF token" });
});`,
      },
      {
        tipo: "codigo",
        titulo: "React client: send the token in a header",
        legenda: "TSX",
        codigo: `// The token comes from an endpoint or from a meta tag delivered by the server
async function saveProfile(data: Profile, csrfToken: string) {
  const response = await fetch("/api/profile", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Could not save");
}`,
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Why the Authorization header helps, and what changes in a React app",
        texto:
          "CSRF exploits the fact that **the browser attaches the cookie by itself**. A token sent in the `Authorization` header, which your app’s JavaScript adds on purpose, **is not attached by another site**, so the API is barely exposed. In return, the token has to live where JavaScript can read it, and the risk shifts to XSS (see L205). In a React app: an SPA with a **session cookie** needs `SameSite` plus an anti-CSRF token or a custom header; an SPA with a **Bearer token in the header** hardly needs CSRF defense but must take XSS seriously; an HTML form that posts straight to the server needs the token in a hidden field.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "XSS defeats these defenses",
        texto:
          "An injected script runs on the same origin: it reads the anti-CSRF token and makes legitimate requests, so anti-CSRF does not protect against XSS (see L200). And `SameSite` treats subdomains of the same domain as “the same site”: a compromised subdomain still counts as the same site, and `Lax` allows top-level navigation. For sensitive actions, keep the token or the `Origin` check in addition to `SameSite`.",
      },
    ],
    armadilhas: [
      "Thinking CORS protects against CSRF: it controls reading the response, but a simple request still reaches the server and runs.",
      "Changing state on GET: an image or a link is enough to trigger the action.",
      "Relying only on `SameSite`: subdomains count as the same site and `Lax` lets top-level navigation through.",
      "Generating the token predictably or not checking it on the server: a header being present is not enough, the value must match the session’s.",
    ],
    autoteste: [
      {
        pergunta: "How does a CSRF attack work and why does the cookie make it possible?",
        resposta:
          "The malicious site makes the victim’s browser send a request to another site where they are logged in. Since the browser attaches session cookies automatically, the server treats the request as legitimate, even though the person did not perform the action.",
      },
      {
        pergunta:
          "Why is an API with a token in the `Authorization` header less exposed to CSRF, and what risk comes back?",
        resposta:
          "Because the browser does not attach that header by itself: only the app’s own JavaScript sends it, and an outside site cannot. The risk that comes back is XSS, since the token has to be reachable by JavaScript.",
      },
    ],
  },
};
