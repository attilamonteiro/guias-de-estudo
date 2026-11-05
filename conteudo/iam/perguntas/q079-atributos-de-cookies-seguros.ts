import type { Pergunta } from "../../tipos";

// Q79 · Atributos de cookies seguros
export const q079: Pergunta = {
  numero: 79,
  modulo: "tokens-e-sessoes",
  metodo: "feynman",
  pt: {
    titulo: "Atributos de cookies seguros",
    pergunta:
      "Quais atributos tornam um cookie de sessão seguro (HttpOnly, Secure, SameSite, prefixo __Host-, Domain e Path)? O que cada um protege?",
    porqueEsteMetodo:
      "Os atributos parecem uma lista de flags para decorar. Com a imagem do cartão-chave de hotel, cada um vira uma regra com um motivo, e o mecanismo real mostra a ameaça que ele bloqueia e onde a analogia deixa de valer.",
    resposta30s:
      "Cada atributo bloqueia uma ameaça: **`HttpOnly`** impede que JavaScript leia o cookie (XSS), **`Secure`** o envia só por HTTPS (interceptação), **`SameSite`** (`Lax` ou `Strict`) o retém em requisições vindas de outros sites (CSRF) e o prefixo **`__Host-`** impede que um subdomínio o plante ou sobrescreva. **`Domain`** omitido e **`Path=/`** mantêm o escopo mínimo, e a expiração que vale é a do servidor. Nada disso conserta o XSS, que ainda age com a sessão aberta.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "O cookie de sessão é o cartão-chave do seu quarto de hotel: a recepção o entrega ao navegador, e dali em diante ele o mostra a cada porta. Cada atributo é uma regra impressa no cartão. Só funciona em corredores fechados (`Secure`). Quem passa por perto não consegue ler o que há nele, mas a porta o reconhece (`HttpOnly`). A porta só abre se quem mostra o cartão veio do próprio hotel, e não empurrado por um estranho (`SameSite`). Só vale se foi emitido pela recepção principal, e nenhum anexo vizinho consegue emitir um falso (`__Host-`). E vale só para certos andares e até certa hora (`Domain`, `Path` e expiração).",
        tecnico:
          "O `Set-Cookie` leva atributos que o navegador aplica sozinho. `HttpOnly` impede que `document.cookie` e qualquer script leiam o valor, então um XSS não consegue copiar o identificador. `Secure` só envia o cookie por HTTPS. `SameSite` decide se o cookie vai em requisições originadas em outro site: `Strict` nunca vai, `Lax` vai só em navegação de nível superior com método seguro (um clique num link, por exemplo) e `None` sempre vai (exige `Secure`). O prefixo `__Host-` só é aceito pelo navegador se o cookie tiver `Secure`, `Path=/` e nenhum `Domain`: assim, um subdomínio vizinho não consegue plantar nem sobrescrever o cookie. `Domain`, quando presente, entrega o cookie ao domínio e a todos os subdomínios; omitido, o cookie é só do host exato. `Path` restringe os caminhos, e `Max-Age` ou `Expires` fixam a validade no navegador (a que vale de verdade é a do servidor; veja Q78 e Q81).",
        limite:
          "O cartão não impede que alguém **já dentro do quarto** use a chave. Do mesmo modo, os atributos não consertam o XSS: o script roda na página e faz requisições com o cookie anexado pelo próprio navegador, mesmo sem poder lê-lo. `SameSite` fala em site (o domínio registrável), não em origem, então um subdomínio comprometido continua sendo do mesmo site. E `Path` não isola nada com segurança: scripts da mesma origem alcançam outros caminhos por meio de um iframe.",
      },
      {
        tipo: "tabela",
        titulo: "Cada atributo, a ameaça que bloqueia e o que ele não resolve",
        colunas: ["Atributo", "Ameaça que bloqueia", "O que não resolve"],
        linhas: [
          [
            "`HttpOnly`",
            "Leitura do cookie por JavaScript (um XSS exfiltrando a sessão)",
            "O script ainda faz requisições autenticadas dentro da página; não evita o XSS",
          ],
          [
            "`Secure`",
            "Interceptação em rede aberta e envio por HTTP",
            "Malware no dispositivo e XSS; exige HTTPS em todo o site (use HSTS)",
          ],
          [
            "`SameSite=Lax` ou `Strict`",
            "CSRF: requisições forjadas a partir de outro site",
            "Ataques vindos do mesmo site (subdomínio comprometido); o `Lax` ainda envia em navegação GET de nível superior",
          ],
          [
            "`SameSite=None; Secure`",
            "Nada: libera o envio em contexto de terceiros (iframes, fluxos entre sites)",
            "Reabre o CSRF; exige token anti-CSRF e `Origin` conferido, e navegadores podem bloquear ou particionar cookies de terceiros",
          ],
          [
            "Prefixo `__Host-`",
            "Injeção e sobrescrita do cookie por subdomínio ou por HTTP (cookie tossing, fixação)",
            "Não protege contra XSS nem contra o roubo do valor",
          ],
          [
            "Escopo de `Domain`",
            "Exposição da sessão a subdomínios abandonados, de terceiros ou comprometidos",
            "Se o cookie precisa mesmo ser compartilhado, o risco volta; prefira um host só",
          ],
          [
            "`Path`",
            "Reduz o envio do cookie a caminhos desnecessários (organização)",
            "Não é fronteira de segurança: a mesma origem alcança qualquer caminho",
          ],
          [
            "`Max-Age` ou `Expires`",
            "Cookie vivo para sempre no navegador",
            "Quem manda é a expiração no servidor: um cookie copiado vale até a sessão acabar lá",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um cookie de sessão bem configurado",
        legenda: "HTTP",
        codigo: `HTTP/1.1 200 OK
Set-Cookie: __Host-sid=Zp3kQ9xT...; Max-Age=1800; Path=/; Secure; HttpOnly; SameSite=Lax
Cache-Control: no-store

GET /conta HTTP/1.1
Host: app.exemplo.com
Cookie: __Host-sid=Zp3kQ9xT...`,
        nota: "O navegador recusa um `__Host-sid` que tenha `Domain`, um `Path` diferente de `/` ou que não tenha `Secure`. O valor é um identificador aleatório e opaco; o estado da sessão fica no servidor (veja Q81).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A receita mínima",
        texto:
          "Para um cookie de sessão: **`__Host-` + `Secure` + `HttpOnly` + `SameSite=Lax`** (ou `Strict`, quando o acesso por link de outro site não precisa chegar logado), `Path=/` sem `Domain`, valor aleatório e opaco, e expiração decidida no servidor. Cada atributo bloqueia uma ameaça diferente, então use todos juntos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cookie seguro não é aplicação segura",
        texto:
          "O XSS continua agindo com a sessão aberta, o `SameSite` não substitui o token anti-CSRF nem a conferência de `Origin` (veja Q126), e cookies de terceiros não são base para login: os navegadores bloqueiam ou particionam esses cookies (existe o atributo `Partitioned`, onde houver suporte; confira a compatibilidade). Em fluxos entre sites, prefira redirecionamentos de nível superior e use `SameSite=None; Secure` só onde for inevitável.",
      },
    ],
    armadilhas: [
      "Achar que `HttpOnly` impede o XSS: ele só impede a leitura do cookie, e o script ainda age como o usuário.",
      "`Domain=exemplo.com` “para compartilhar entre aplicações”: entrega a sessão a todo subdomínio, inclusive os abandonados ou de terceiros.",
      "Depender do `SameSite=Lax` implícito de alguns navegadores, ou ligar `SameSite=None` “para funcionar” sem perceber que o CSRF volta: declare o atributo e mantenha o token anti-CSRF.",
      "Usar `Path` como fronteira de segurança, ou deixar o cookie viver sem expiração no servidor.",
    ],
    autoteste: [
      {
        pergunta: "Por que o prefixo `__Host-` ajuda contra a injeção de cookie por um subdomínio?",
        resposta:
          "Porque o navegador só aceita um cookie com esse prefixo se ele tiver `Secure`, `Path=/` e nenhum `Domain`. Um subdomínio vizinho só consegue definir cookies para o domínio pai usando `Domain`, então não consegue plantar nem sobrescrever o `__Host-sid` do site principal.",
      },
      {
        pergunta: "Um cookie com `HttpOnly`, `Secure` e `SameSite=Strict` ainda pode ser abusado? Como?",
        resposta:
          "Pode. Um XSS na página faz requisições autenticadas sem ler o cookie, e como o `SameSite` trata subdomínios como o mesmo site, um subdomínio comprometido ainda dispara requisições. Os atributos reduzem ameaças específicas; não substituem sanitização, CSP e token anti-CSRF.",
      },
    ],
  },
  en: {
    titulo: "Secure cookie attributes",
    pergunta:
      "Which attributes make a session cookie secure (HttpOnly, Secure, SameSite, the __Host- prefix, Domain and Path)? What does each one protect?",
    porqueEsteMetodo:
      "The attributes look like a list of flags to memorize. With the picture of a hotel key card, each one becomes a rule with a reason, and the real mechanism shows the threat it blocks and where the analogy stops holding.",
    resposta30s:
      "Each attribute blocks one threat: **`HttpOnly`** stops JavaScript from reading the cookie (XSS), **`Secure`** sends it over HTTPS only (interception), **`SameSite`** (`Lax` or `Strict`) holds it back on requests coming from other sites (CSRF), and the **`__Host-`** prefix stops a subdomain from planting or overwriting it. An omitted **`Domain`** and **`Path=/`** keep the scope minimal, and the expiry that counts is the server’s. None of this fixes XSS, which still acts with the session open.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "The session cookie is the key card to your hotel room: the front desk hands it to the browser, and from then on the browser shows it at every door. Each attribute is a rule printed on the card. It only works in closed corridors (`Secure`). Someone passing by cannot read what is on it, but the door recognizes it (`HttpOnly`). The door only opens if whoever shows the card came from the hotel itself, not pushed by a stranger (`SameSite`). It is only valid if the main front desk issued it, and no neighboring annex can issue a fake (`__Host-`). And it is good only for certain floors and until a certain time (`Domain`, `Path` and expiry).",
        tecnico:
          "`Set-Cookie` carries attributes that the browser enforces on its own. `HttpOnly` stops `document.cookie` and any script from reading the value, so an XSS cannot copy the identifier. `Secure` sends the cookie over HTTPS only. `SameSite` decides whether the cookie goes on requests that start on another site: `Strict` never sends it, `Lax` sends it only on top-level navigation with a safe method (clicking a link, for example) and `None` always sends it (it requires `Secure`). The browser only accepts the `__Host-` prefix if the cookie has `Secure`, `Path=/` and no `Domain`: that way a neighboring subdomain cannot plant or overwrite the cookie. `Domain`, when present, hands the cookie to the domain and every subdomain; omitted, the cookie belongs to the exact host. `Path` restricts the paths, and `Max-Age` or `Expires` set the validity in the browser (the one that really counts is the server’s; see Q78 and Q81).",
        limite:
          "The card does not stop someone **already inside the room** from using the key. In the same way, the attributes do not fix XSS: the script runs in the page and makes requests with the cookie attached by the browser itself, even without being able to read it. `SameSite` speaks of site (the registrable domain), not origin, so a compromised subdomain is still the same site. And `Path` isolates nothing securely: scripts of the same origin reach other paths through an iframe.",
      },
      {
        tipo: "tabela",
        titulo: "Each attribute, the threat it blocks and what it does not solve",
        colunas: ["Attribute", "Threat it blocks", "What it does not solve"],
        linhas: [
          [
            "`HttpOnly`",
            "Reading the cookie from JavaScript (an XSS exfiltrating the session)",
            "The script can still make authenticated requests inside the page; it does not prevent XSS",
          ],
          [
            "`Secure`",
            "Interception on an open network and sending over HTTP",
            "Malware on the device and XSS; it needs HTTPS across the whole site (use HSTS)",
          ],
          [
            "`SameSite=Lax` or `Strict`",
            "CSRF: requests forged from another site",
            "Attacks coming from the same site (a compromised subdomain); `Lax` still sends on top-level GET navigation",
          ],
          [
            "`SameSite=None; Secure`",
            "Nothing: it allows sending in a third-party context (iframes, cross-site flows)",
            "It reopens CSRF; it needs an anti-CSRF token and a checked `Origin`, and browsers may block or partition third-party cookies",
          ],
          [
            "`__Host-` prefix",
            "Injection and overwriting of the cookie by a subdomain or over HTTP (cookie tossing, fixation)",
            "It does not protect against XSS or theft of the value",
          ],
          [
            "`Domain` scope",
            "Exposing the session to abandoned, third-party or compromised subdomains",
            "If the cookie really must be shared, the risk is back; prefer a single host",
          ],
          [
            "`Path`",
            "Keeps the cookie from being sent to unnecessary paths (housekeeping)",
            "It is not a security boundary: the same origin reaches every path",
          ],
          [
            "`Max-Age` or `Expires`",
            "A cookie that lives forever in the browser",
            "The server-side expiry is what counts: a copied cookie is good until the session ends there",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A well-configured session cookie",
        legenda: "HTTP",
        codigo: `HTTP/1.1 200 OK
Set-Cookie: __Host-sid=Zp3kQ9xT...; Max-Age=1800; Path=/; Secure; HttpOnly; SameSite=Lax
Cache-Control: no-store

GET /account HTTP/1.1
Host: app.example.com
Cookie: __Host-sid=Zp3kQ9xT...`,
        nota: "The browser rejects a `__Host-sid` that has a `Domain`, a `Path` other than `/`, or no `Secure`. The value is a random, opaque identifier; the session state lives on the server (see Q81).",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The minimum recipe",
        texto:
          "For a session cookie: **`__Host-` + `Secure` + `HttpOnly` + `SameSite=Lax`** (or `Strict`, when arriving from a link on another site does not need to be signed in), `Path=/` with no `Domain`, a random opaque value, and expiry decided on the server. Each attribute blocks a different threat, so use them all together.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A secure cookie is not a secure application",
        texto:
          "XSS still acts with the session open, `SameSite` does not replace the anti-CSRF token or an `Origin` check (see Q126), and third-party cookies are no foundation for login: browsers block or partition them (there is a `Partitioned` attribute, where supported; check compatibility). In cross-site flows, prefer top-level redirects and use `SameSite=None; Secure` only where unavoidable.",
      },
    ],
    armadilhas: [
      "Thinking `HttpOnly` prevents XSS: it only prevents reading the cookie, and the script still acts as the user.",
      "`Domain=example.com` “to share between applications”: it hands the session to every subdomain, including abandoned or third-party ones.",
      "Relying on the implicit `SameSite=Lax` of some browsers, or turning on `SameSite=None` “to make it work” without noticing that CSRF is back: declare the attribute and keep the anti-CSRF token.",
      "Using `Path` as a security boundary, or letting the cookie live with no server-side expiry.",
    ],
    autoteste: [
      {
        pergunta: "Why does the `__Host-` prefix help against cookie injection by a subdomain?",
        resposta:
          "Because the browser only accepts a cookie with that prefix if it has `Secure`, `Path=/` and no `Domain`. A neighboring subdomain can only set cookies for the parent domain by using `Domain`, so it can neither plant nor overwrite the main site’s `__Host-sid`.",
      },
      {
        pergunta: "Can a cookie with `HttpOnly`, `Secure` and `SameSite=Strict` still be abused? How?",
        resposta:
          "Yes. An XSS in the page makes authenticated requests without reading the cookie, and since `SameSite` treats subdomains as the same site, a compromised subdomain can still fire requests. The attributes reduce specific threats; they do not replace sanitization, CSP and an anti-CSRF token.",
      },
    ],
  },
};
