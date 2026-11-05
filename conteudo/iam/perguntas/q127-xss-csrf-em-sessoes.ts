import type { Pergunta } from "../../tipos";

// Q127 · XSS × CSRF em sessões
export const q127: Pergunta = {
  numero: 127,
  modulo: "ataques-e-depuracao",
  metodo: "compare",
  pt: {
    titulo: "XSS × CSRF em sessões",
    pergunta:
      "Compare XSS e CSRF no contexto de sessões e tokens. O que cada um permite ao atacante e como HttpOnly, CSP e SameSite se complementam?",
    porqueEsteMetodo:
      "XSS e CSRF são confundidos porque os dois envolvem navegador e sessão, mas o atacante e as defesas são diferentes. A matriz mostra o que cada ataque alcança e quanto cada defesa pesa contra cada um; a regra de decisão fecha a resposta.",
    resposta30s:
      "No **XSS**, o código do atacante roda **dentro da sua origem**: lê a página e os tokens acessíveis e age como o usuário. No **CSRF**, ele está em **outra origem** e só faz o navegador enviar, às cegas, uma requisição que leva o cookie sozinho. `HttpOnly` protege o cookie contra leitura, `SameSite` e o token anti-CSRF cobrem o CSRF e o CSP reduz o XSS; nenhum cobre tudo, então **defenda os dois**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O ataque: onde roda e o que alcança",
        colunas: ["Aspecto", "XSS", "CSRF"],
        linhas: [
          [
            "Onde o atacante age",
            "Executa JavaScript dentro da sua origem, com os mesmos direitos do seu próprio código",
            "Fica em outra origem (site, e-mail, anúncio) e faz o navegador da vítima enviar a requisição",
          ],
          [
            "O que explora",
            "A confiança do navegador no conteúdo que o seu site entrega",
            "A confiança do servidor em credenciais que o navegador anexa sozinho, como cookies",
          ],
          [
            "Consegue ler a resposta?",
            "Sim: lê páginas, respostas de API, tokens anti-CSRF e tokens guardados em `localStorage` ou na memória",
            "Não: a política de mesma origem esconde a resposta, então o ataque age às cegas",
          ],
          [
            "O que permite fazer",
            "Tudo o que o usuário faria na página: chamar a API com a sessão, trocar o e-mail, falsificar um formulário de login, capturar teclas",
            "Ações com efeito que uma só requisição dispara: mudar dados, transferir, aprovar. Também o login CSRF (veja Q126)",
          ],
          [
            "Cookie de sessão × token no header",
            "Os dois caem: o script usa o cookie (sem lê-lo, se for `HttpOnly`) ou lê o token e o leva embora",
            "Só o cookie cai: o header `Authorization` não é anexado sozinho, então o token em header escapa do CSRF",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "A defesa: o que cada uma resolve",
        colunas: ["Defesa", "Contra XSS", "Contra CSRF"],
        linhas: [
          [
            "`HttpOnly`",
            "Parcial: o script não lê o cookie nem o leva embora, mas ainda faz requisições que o enviam. Não impede ações",
            "Nenhuma: o cookie continua sendo enviado",
          ],
          [
            "`SameSite=Lax` ou `Strict`",
            "Nenhuma: a requisição parte do próprio site",
            "Forte: o cookie não vai em requisições entre sites (o `Lax` ainda o envia em navegação de topo com GET)",
          ],
          [
            "CSP (`script-src` com nonce, `connect-src`)",
            "Forte, como segunda camada: bloqueia script injetado e limita para onde os dados saem",
            "Quase nenhuma: não controla requisições forjadas por outro site",
          ],
          [
            "Token anti-CSRF, `Origin` e `Sec-Fetch-Site`",
            "Nenhuma: o script lê o token e o envia junto",
            "Forte: quem está em outra origem não tem o token e é identificado pelos cabeçalhos",
          ],
          [
            "Escape de saída, sanitização, Trusted Types",
            "A defesa de base: impede que o script entre",
            "Não se aplica",
          ],
        ],
        nota: "`SameSite` fala de site (domínio registrável), não de origem: um subdomínio com XSS, ou sequestrado, ainda alcança os cookies do site. Declare o atributo explicitamente em vez de depender do padrão do navegador.",
      },
      {
        tipo: "codigo",
        titulo: "Cookie e CSP na resposta, e uma requisição forjada",
        legenda: "HTTP",
        codigo:
          "# Resposta que cria a sessão e restringe scripts\nHTTP/1.1 200 OK\nSet-Cookie: __Host-sid=<id>; Path=/; Secure; HttpOnly; SameSite=Lax\nContent-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<aleatório>'; object-src 'none'; base-uri 'none'\n\n# Requisição forjada a partir de outra origem: o servidor deve recusar\nPOST /conta/email HTTP/1.1\nHost: app.example.com\nOrigin: https://evil.example\nSec-Fetch-Site: cross-site",
        nota: "Na segunda requisição, o `SameSite=Lax` já impediria o envio do cookie num POST entre sites; `Origin` e `Sec-Fetch-Site` são a segunda barreira e o token anti-CSRF, a terceira. O prefixo `__Host-` exige `Secure`, `Path=/` e nenhum `Domain`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Defenda os dois, em camadas, porque as defesas não se substituem. Contra **CSRF**: `SameSite` + token anti-CSRF (ou checagem de `Origin`/Fetch Metadata) + nenhuma mudança de estado em GET. Contra **XSS**: escape de saída e CSP, com `HttpOnly` só para limitar o roubo. A pergunta que decide o que importa: o atacante consegue rodar código na minha origem? Se sim, as defesas de CSRF deixam de valer, porque o script age de dentro, e só resta reduzir o estrago.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "HttpOnly limita o roubo, não a ação",
        texto:
          "Com XSS, o atacante não precisa do valor do cookie: o próprio script chama a API e o navegador anexa a sessão. `HttpOnly` impede levar a sessão para outra máquina e usá-la depois, mas não a ação enquanto a aba estiver aberta. Trocar o cookie por um token em `localStorage` elimina o CSRF, mas entrega o token a qualquer script injetado, que o leva embora. Sobre onde guardar o token, veja Q80; sobre os atributos do cookie, Q79.",
      },
    ],
    armadilhas: [
      "Achar que `HttpOnly` resolve o XSS: ele esconde o cookie, mas o script continua agindo como o usuário.",
      "Contar com `SameSite` ou com o token anti-CSRF quando há XSS: a requisição parte da própria origem e o script lê o token.",
      "Migrar para token em `localStorage` “para evitar o CSRF” e abrir a porta para o roubo do token por qualquer script injetado.",
      "Manter ações com efeito em GET e confiar no `SameSite=Lax`: navegações de topo com GET enviam o cookie, e subdomínios do mesmo site não são separados.",
    ],
    autoteste: [
      {
        pergunta: "Por que `SameSite=Strict` não protege o usuário quando o site tem XSS?",
        resposta:
          "Porque o script injetado roda na própria origem e as requisições dele partem do mesmo site, então o navegador envia o cookie normalmente. O `SameSite` só separa o que vem de outros sites.",
      },
      {
        pergunta: "Por que o CSRF serve para executar ações, e não para roubar dados?",
        resposta:
          "Porque o atacante está em outra origem e a política de mesma origem esconde a resposta dele. Ele consegue provocar o efeito (mudar e-mail, transferir), mas não ler o resultado; quem lê é o XSS.",
      },
    ],
  },
  en: {
    titulo: "XSS vs CSRF for sessions",
    pergunta:
      "Compare XSS and CSRF in the context of sessions and tokens. What does each allow an attacker to do, and how do HttpOnly, CSP and SameSite complement each other?",
    porqueEsteMetodo:
      "XSS and CSRF get mixed up because both involve the browser and the session, but the attacker and the defenses differ. The matrix shows what each attack reaches and how much each defense weighs against each one; the decision rule closes the answer.",
    resposta30s:
      "In **XSS**, the attacker’s code runs **inside your origin**: it reads the page and any reachable tokens and acts as the user. In **CSRF**, the attacker is in **another origin** and only makes the browser send, blindly, a request that carries the cookie by itself. `HttpOnly` protects the cookie from being read, `SameSite` and the anti-CSRF token cover CSRF and CSP reduces XSS; none covers everything, so **defend against both**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The attack: where it runs and what it reaches",
        colunas: ["Aspect", "XSS", "CSRF"],
        linhas: [
          [
            "Where the attacker acts",
            "Runs JavaScript inside your origin, with the same rights as your own code",
            "Stays in another origin (site, email, ad) and makes the victim’s browser send the request",
          ],
          [
            "What it exploits",
            "The browser’s trust in the content your site serves",
            "The server’s trust in credentials the browser attaches by itself, such as cookies",
          ],
          [
            "Can it read the response?",
            "Yes: it reads pages, API responses, anti-CSRF tokens and tokens kept in `localStorage` or in memory",
            "No: the same-origin policy hides the response, so the attack acts blindly",
          ],
          [
            "What it lets the attacker do",
            "Anything the user could do on the page: call the API with the session, change the email, fake a login form, capture keystrokes",
            "Actions with effect that a single request can trigger: change data, transfer, approve. Also login CSRF (see Q126)",
          ],
          [
            "Session cookie vs header token",
            "Both fall: the script uses the cookie (without reading it, if `HttpOnly`) or reads the token and carries it away",
            "Only the cookie falls: the `Authorization` header is not attached by itself, so a header token escapes CSRF",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "The defense: what each one solves",
        colunas: ["Defense", "Against XSS", "Against CSRF"],
        linhas: [
          [
            "`HttpOnly`",
            "Partial: the script cannot read the cookie or carry it away, but it can still make requests that send it. It does not stop actions",
            "None: the cookie is still sent",
          ],
          [
            "`SameSite=Lax` or `Strict`",
            "None: the request comes from the site itself",
            "Strong: the cookie is not sent on cross-site requests (`Lax` still sends it on top-level GET navigation)",
          ],
          [
            "CSP (`script-src` with a nonce, `connect-src`)",
            "Strong, as a second layer: blocks injected script and limits where data can go",
            "Almost none: it does not control requests forged by another site",
          ],
          [
            "Anti-CSRF token, `Origin` and `Sec-Fetch-Site`",
            "None: the script reads the token and sends it along",
            "Strong: someone in another origin has no token and is identified by the headers",
          ],
          [
            "Output escaping, sanitization, Trusted Types",
            "The base defense: keeps the script from getting in",
            "Not applicable",
          ],
        ],
        nota: "`SameSite` is about the site (registrable domain), not the origin: a subdomain with XSS, or one that has been taken over, still reaches the site’s cookies. Declare the attribute explicitly instead of relying on the browser default.",
      },
      {
        tipo: "codigo",
        titulo: "Cookie and CSP in the response, and a forged request",
        legenda: "HTTP",
        codigo:
          "# Response that creates the session and restricts scripts\nHTTP/1.1 200 OK\nSet-Cookie: __Host-sid=<id>; Path=/; Secure; HttpOnly; SameSite=Lax\nContent-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<random>'; object-src 'none'; base-uri 'none'\n\n# Request forged from another origin: the server must refuse it\nPOST /account/email HTTP/1.1\nHost: app.example.com\nOrigin: https://evil.example\nSec-Fetch-Site: cross-site",
        nota: "For the second request, `SameSite=Lax` would already stop the cookie from being sent on a cross-site POST; `Origin` and `Sec-Fetch-Site` are the second barrier and the anti-CSRF token the third. The `__Host-` prefix requires `Secure`, `Path=/` and no `Domain`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Defend against both, in layers, because the defenses do not substitute for each other. Against **CSRF**: `SameSite` + an anti-CSRF token (or `Origin`/Fetch Metadata checks) + no state change on GET. Against **XSS**: output escaping and CSP, with `HttpOnly` only to limit theft. The question that decides what matters: can the attacker run code in my origin? If so, the CSRF defenses stop mattering, because the script acts from the inside, and all that is left is reducing the damage.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "HttpOnly limits theft, not action",
        texto:
          "With XSS the attacker does not need the cookie value: the script itself calls the API and the browser attaches the session. `HttpOnly` stops the session from being taken to another machine and used later, but not the action while the tab is open. Swapping the cookie for a token in `localStorage` removes CSRF, but hands the token to any injected script, which carries it away. For where to keep the token see Q80; for cookie attributes, Q79.",
      },
    ],
    armadilhas: [
      "Believing `HttpOnly` solves XSS: it hides the cookie, but the script keeps acting as the user.",
      "Counting on `SameSite` or on the anti-CSRF token when there is XSS: the request comes from the origin itself and the script reads the token.",
      "Moving to a token in `localStorage` “to avoid CSRF” and opening the door to token theft by any injected script.",
      "Keeping actions with effect on GET and trusting `SameSite=Lax`: top-level GET navigations send the cookie, and subdomains of the same site are not separated.",
    ],
    autoteste: [
      {
        pergunta: "Why does `SameSite=Strict` not protect the user when the site has XSS?",
        resposta:
          "Because the injected script runs in the origin itself and its requests come from the same site, so the browser sends the cookie normally. `SameSite` only separates what comes from other sites.",
      },
      {
        pergunta: "Why is CSRF good for performing actions, but not for stealing data?",
        resposta:
          "Because the attacker is in another origin and the same-origin policy hides the response from them. They can trigger the effect (change an email, transfer money) but cannot read the result; reading is what XSS does.",
      },
    ],
  },
};
