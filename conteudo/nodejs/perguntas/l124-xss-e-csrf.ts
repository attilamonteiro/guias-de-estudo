import type { Pergunta } from "../../tipos";

// L124 · XSS e CSRF
export const l124: Pergunta = {
  numero: 224,
  modulo: "linkedin-seguranca",
  metodo: "threat",
  pt: {
    titulo: "XSS e CSRF",
    pergunta: "Como você previne XSS e CSRF?",
    porqueEsteMetodo:
      "XSS e CSRF costumam ser confundidos, e cada um tem defesas diferentes. Os pares ataque → defesa separam os dois, mostram o que o invasor consegue em cada caso e por que uma defesa não substitui a outra.",
    resposta30s:
      "**XSS** é código do atacante rodando na sua página: previna **escapando a saída** conforme o contexto, evitando `innerHTML` com dados do usuário e limitando os scripts com **CSP**; cookies **`HttpOnly`** reduzem o estrago. **CSRF** é o navegador do usuário sendo induzido a enviar uma requisição autenticada: previna com cookies **`SameSite`**, **tokens CSRF**, checagem de **`Origin`** e sem mudar estado em `GET`. O XSS anula as defesas de CSRF, então feche-o primeiro.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**XSS armazenado**: um comentário com `<script>` é salvo e executa para todo mundo que abrir a página",
            destino:
              "**Escape de saída** conforme o contexto (HTML, atributo, JavaScript, URL), com templates e frameworks que escapam por padrão; evite `innerHTML` com dados do usuário. Se precisa aceitar HTML (editor rico), sanitize com lista permitida (por exemplo, DOMPurify).",
          },
          {
            origem:
              "**XSS refletido**: o parâmetro da URL (`?q=<script>`) é ecoado na resposta e atinge quem clicar no link",
            destino:
              "A mesma defesa: escape de saída. Nunca monte HTML por concatenação em `res.send`; valide a entrada como camada extra.",
          },
          {
            origem: "Um script injetado que passa pelas defesas",
            destino:
              "**CSP** (`Content-Security-Policy`): limita de onde os scripts podem vir e bloqueia os inline. O `helmet` configura esse e outros cabeçalhos de segurança.",
          },
          {
            origem: "Roubo do cookie de sessão por script",
            destino: "**`HttpOnly`** (JavaScript não lê o cookie) e **`Secure`** (só viaja por HTTPS).",
          },
          {
            origem: "**CSRF**: um site malicioso envia um formulário para o seu, com os cookies do usuário logado",
            destino:
              "Cookie de sessão **`SameSite=Lax`** ou `Strict` e **token CSRF** (sincronizador ou double-submit) em toda operação que muda estado: o site do atacante não consegue lê-lo.",
          },
          {
            origem: "Requisição de escrita vinda de uma origem estranha",
            destino:
              "**Validar `Origin`** (ou `Referer`) nos métodos que mudam estado; o cabeçalho `Sec-Fetch-Site` ajuda. É camada extra, não a única defesa.",
          },
          {
            origem: "Operação destrutiva acessível por `GET` (`/apagar?id=1`), disparada por uma simples imagem",
            destino: "`GET` só lê. Mudanças de estado usam `POST`, `PUT`, `PATCH` ou `DELETE`, com as defesas acima.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cabeçalhos, cookie e checagem de Origin no Express",
        legenda: "JavaScript",
        codigo:
          'import helmet from "helmet";\n\napp.use(helmet()); // cabeçalhos de segurança, inclusive CSP; ajuste a política à sua aplicação\n\n// cookie de sessão: JavaScript não lê; só acompanha navegação do mesmo site\nres.cookie("sid", idDaSessao, { httpOnly: true, secure: true, sameSite: "lax" });\n\n// camada extra contra CSRF: recusa escrita cuja origem não é a sua\nconst ORIGEM = "https://app.exemplo.com";\napp.use((req, res, next) => {\n  const escreve = !["GET", "HEAD", "OPTIONS"].includes(req.method);\n  const origem = req.get("origin");\n  if (escreve && origem && origem !== ORIGEM) return res.status(403).end();\n  next();\n});',
        nota: "O token CSRF fica de fora do exemplo; pacotes e frameworks costumam trazê-lo pronto. Os navegadores enviam `Origin` em requisições entre sites, mas clientes que não são navegadores podem não enviar: decida como tratá-los.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Dois problemas opostos",
        texto:
          "No **XSS**, o navegador confia no site: o código do atacante roda dentro da sua origem e faz tudo o que o usuário faria. No **CSRF**, o site confia no navegador: a requisição chega com o cookie certo, mas foi outra página que a pediu. Como um XSS lê o token CSRF e age como o usuário, ele derruba as defesas de CSRF: feche o XSS primeiro.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que não protege",
        texto:
          "O CORS controla quem pode **ler** respostas entre origens; não impede que outro site **envie** um formulário (veja L42). Guardar o JWT em `localStorage` afasta o CSRF clássico, porque o navegador não o anexa sozinho, mas o expõe a qualquer XSS (veja L47). E o `SameSite` considera o **site** (domínio registrável), não a origem: um subdomínio comprometido ainda conta como o mesmo site.",
      },
    ],
    armadilhas: [
      "Filtrar a entrada com regex para remover `<script>`: o escape correto acontece na saída e depende do contexto; listas de bloqueio são contornáveis.",
      "Achar que `HttpOnly` impede o XSS: ele só impede a leitura do cookie, e o script injetado ainda faz requisições como o usuário e altera a página.",
      "Confiar só no `SameSite`, ou no padrão do navegador, sem token nem checagem de `Origin`: o comportamento varia e subdomínios escapam.",
      "Uma CSP frouxa (`unsafe-inline`, curingas como `*`) que na prática não bloqueia nada, ou aceitar HTML do usuário sem sanitizar.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre XSS refletido e armazenado, e a defesa muda?",
        resposta:
          "No refletido, a entrada maliciosa vem na requisição (um link) e é ecoada na resposta, atingindo quem clica. No armazenado, ela fica salva (um comentário) e atinge todos que abrirem a página, por isso é mais grave. A defesa é a mesma: escape de saída e CSP.",
      },
      {
        pergunta: "O cookie é enviado automaticamente pelo navegador. Por que um token CSRF protege mesmo assim?",
        resposta:
          "Porque o token precisa ser incluído de forma explícita (campo do formulário ou cabeçalho), e a política de mesma origem impede que o site do atacante o leia. Sem o token, a requisição forjada é recusada.",
      },
    ],
  },
  en: {
    titulo: "XSS and CSRF",
    pergunta: "How do you prevent XSS and CSRF?",
    porqueEsteMetodo:
      "XSS and CSRF are often confused, and each has different defenses. The attack → defense pairs keep the two apart, show what the attacker gets in each case and why one defense does not replace the other.",
    resposta30s:
      "**XSS** is attacker code running on your page: prevent it by **escaping output** for its context, avoiding `innerHTML` with user data and limiting scripts with a **CSP**; **`HttpOnly`** cookies reduce the damage. **CSRF** is the user’s browser being tricked into sending an authenticated request: prevent it with **`SameSite`** cookies, **CSRF tokens**, an **`Origin`** check and no state changes on `GET`. XSS defeats CSRF defenses, so close it first.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem: "**Stored XSS**: a comment with `<script>` is saved and runs for everyone who opens the page",
            destino:
              "**Output escaping** for the context (HTML, attribute, JavaScript, URL), with templates and frameworks that escape by default; avoid `innerHTML` with user data. If you must accept HTML (rich editor), sanitize with an allowlist (for example, DOMPurify).",
          },
          {
            origem:
              "**Reflected XSS**: the URL parameter (`?q=<script>`) is echoed in the response and hits whoever clicks the link",
            destino:
              "The same defense: output escaping. Never build HTML by concatenation in `res.send`; validate input as an extra layer.",
          },
          {
            origem: "An injected script that gets past the defenses",
            destino:
              "**CSP** (`Content-Security-Policy`): limits where scripts may come from and blocks inline ones. `helmet` sets this and other security headers.",
          },
          {
            origem: "A script stealing the session cookie",
            destino:
              "**`HttpOnly`** (JavaScript cannot read the cookie) and **`Secure`** (it travels only over HTTPS).",
          },
          {
            origem: "**CSRF**: a malicious site submits a form to yours, with the logged-in user’s cookies",
            destino:
              "Session cookie with **`SameSite=Lax`** or `Strict` and a **CSRF token** (synchronizer or double-submit) on every state-changing operation: the attacker’s site cannot read it.",
          },
          {
            origem: "A write request coming from a foreign origin",
            destino:
              "**Validate `Origin`** (or `Referer`) on state-changing methods; the `Sec-Fetch-Site` header helps. It is an extra layer, not the only defense.",
          },
          {
            origem: "A destructive operation reachable by `GET` (`/delete?id=1`), triggered by a mere image",
            destino: "`GET` only reads. State changes use `POST`, `PUT`, `PATCH` or `DELETE`, with the defenses above.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Headers, cookie and Origin check in Express",
        legenda: "JavaScript",
        codigo:
          'import helmet from "helmet";\n\napp.use(helmet()); // security headers, including CSP; tune the policy to your application\n\n// session cookie: JavaScript cannot read it; it only rides along with same-site navigation\nres.cookie("sid", sessionId, { httpOnly: true, secure: true, sameSite: "lax" });\n\n// extra layer against CSRF: refuse writes whose origin is not yours\nconst ORIGIN = "https://app.example.com";\napp.use((req, res, next) => {\n  const writes = !["GET", "HEAD", "OPTIONS"].includes(req.method);\n  const origin = req.get("origin");\n  if (writes && origin && origin !== ORIGIN) return res.status(403).end();\n  next();\n});',
        nota: "The CSRF token is left out of the example; packages and frameworks usually ship it ready. Browsers send `Origin` on cross-site requests, but non-browser clients may not: decide how to handle them.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Two opposite problems",
        texto:
          "In **XSS**, the browser trusts the site: the attacker’s code runs inside your origin and does everything the user could. In **CSRF**, the site trusts the browser: the request arrives with the right cookie, but another page asked for it. Since XSS can read the CSRF token and act as the user, it defeats CSRF defenses: close XSS first.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What does not protect you",
        texto:
          "CORS controls who may **read** responses across origins; it does not stop another site from **submitting** a form (see L42). Keeping the JWT in `localStorage` avoids classic CSRF, because the browser does not attach it by itself, but exposes it to any XSS (see L47). And `SameSite` looks at the **site** (registrable domain), not the origin: a compromised subdomain still counts as the same site.",
      },
    ],
    armadilhas: [
      "Filtering input with a regex to strip `<script>`: correct escaping happens on output and depends on the context; blocklists can be bypassed.",
      "Thinking `HttpOnly` prevents XSS: it only prevents reading the cookie, and the injected script still makes requests as the user and rewrites the page.",
      "Relying only on `SameSite`, or on the browser default, with no token or `Origin` check: behavior varies and subdomains slip through.",
      "A loose CSP (`unsafe-inline`, wildcards such as `*`) that blocks nothing in practice, or accepting user HTML without sanitizing it.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between reflected and stored XSS, and does the defense change?",
        resposta:
          "In reflected XSS, the malicious input comes in the request (a link) and is echoed in the response, hitting whoever clicks. In stored XSS, it is saved (a comment) and hits everyone who opens the page, so it is worse. The defense is the same: output escaping and a CSP.",
      },
      {
        pergunta: "The browser sends the cookie automatically. Why does a CSRF token still protect you?",
        resposta:
          "Because the token must be included explicitly (a form field or a header), and the same-origin policy keeps the attacker’s site from reading it. Without the token, the forged request is refused.",
      },
    ],
  },
};
