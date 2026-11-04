import type { Pergunta } from "../../tipos";

// D29 · Cabeçalhos de segurança e Helmet
export const d029: Pergunta = {
  numero: 329,
  modulo: "devinterview-rede-e-erros",
  metodo: "threat",
  pt: {
    titulo: "Cabeçalhos de segurança e Helmet",
    pergunta: "Como você garante a segurança dos cabeçalhos HTTP com o Node.js?",
    porqueEsteMetodo:
      "Cada cabeçalho de segurança existe por causa de um ataque específico. Em pares ameaça → defesa, você entende para que serve cada um e sabe explicar o que acontece sem ele.",
    resposta30s:
      "Os cabeçalhos de segurança são instruções que o servidor dá ao **navegador** para fechar classes inteiras de ataque: `Strict-Transport-Security` (HTTPS obrigatório), `Content-Security-Policy` (de onde a página carrega código), `X-Content-Type-Options`, proteção contra clickjacking, `Referrer-Policy` e flags nos cookies. No Node.js, o middleware **`helmet`** define um conjunto de padrões conservadores com uma linha, mas a CSP quase sempre precisa de ajuste para não quebrar a página. Eles são defesa em profundidade, não um substituto de código seguro.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ameaça → defesa",
        rotuloOrigem: "Ameaça",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**Downgrade e sniffing**: o usuário digita o endereço sem `https://`, e alguém na rede lê ou altera a primeira requisição em HTTP puro",
            destino:
              "**`Strict-Transport-Security` (HSTS)**: depois da primeira visita por HTTPS, o navegador passa a usar só HTTPS para o domínio durante o prazo informado (`max-age`). Só vale sobre HTTPS.",
          },
          {
            origem: "**Clickjacking**: o site é embutido num `iframe` invisível e o usuário clica em algo que não vê",
            destino:
              "**`frame-ancestors` na CSP** (a forma moderna) e **`X-Frame-Options`** (legado, ainda útil): dizem quem pode embutir a sua página, ou ninguém.",
          },
          {
            origem: "**MIME sniffing**: o navegador “adivinha” que um upload de texto é um script e o executa",
            destino:
              "**`X-Content-Type-Options: nosniff`**, junto com um `Content-Type` correto em cada resposta: o navegador obedece ao tipo declarado.",
          },
          {
            origem: "**XSS**: script injetado na página rouba sessão ou dados",
            destino:
              "**`Content-Security-Policy`**: lista de onde scripts, estilos, imagens e conexões podem vir; um script injetado de outra origem não executa. A defesa principal continua sendo escapar a saída (veja D52); a CSP reduz o estrago.",
          },
          {
            origem:
              "**Vazamento de referrer**: a URL completa (com ids ou tokens) vai no cabeçalho `Referer` para outros sites",
            destino:
              "**`Referrer-Policy`** (por exemplo, `strict-origin-when-cross-origin`): limita o que sai e para quem.",
          },
          {
            origem: "**Fingerprinting**: `X-Powered-By: Express` ajuda o atacante a escolher exploits para a sua pilha",
            destino:
              '**Remover `X-Powered-By`** (`app.disable("x-powered-by")`, o que o Helmet já faz). Esconder não protege sozinho, só tira o rótulo.',
          },
          {
            origem: "**Cookie roubado ou enviado onde não devia** (XSS, rede aberta, requisição de outro site)",
            destino:
              "**`HttpOnly`** (o JavaScript não lê), **`Secure`** (só vai por HTTPS) e **`SameSite`** (limita o envio entre sites; veja L124). São atributos do `Set-Cookie`.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Helmet com uma CSP explícita",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import helmet from "helmet";',
          "",
          "const app = express();",
          "app.use(",
          "  helmet({",
          "    contentSecurityPolicy: {",
          "      directives: {",
          "        defaultSrc: [\"'self'\"],",
          '        scriptSrc: ["\'self\'", "https://cdn.exemplo.com"],',
          '        imgSrc: ["\'self\'", "data:"],',
          "        frameAncestors: [\"'none'\"],",
          "      },",
          "    },",
          "    strictTransportSecurity: { maxAge: 86400 }, // comece curto; aumente com confiança",
          "  }),",
          ");",
        ].join("\n"),
        nota: "Sem opções, `helmet()` já liga uma política de CSP padrão, HSTS, `nosniff`, `Referrer-Policy`, proteção contra clickjacking e a remoção de `X-Powered-By`. A lista e os valores exatos mudam entre versões do pacote: confira a documentação.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O cabeçalho instrui o navegador, não conserta o servidor",
        texto:
          "Esses cabeçalhos só funcionam contra ataques que passam pelo **navegador**; uma chamada com `curl` ou de servidor para servidor os ignora. Por isso são **defesa em profundidade**: o código seguro (validação, escape, autenticação) continua sendo a primeira linha. O mesmo vale para o **CORS**, que não é segurança do servidor: ele só relaxa a política de mesma origem do navegador e não impede ninguém de chamar a sua API (veja L42). Para verificar, faça uma requisição e leia os cabeçalhos da resposta real (`curl -I`), use um analisador de cabeçalhos e deixe um teste de integração que confira os principais.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A CSP é a que quebra a página",
        texto:
          "Uma CSP restritiva bloqueia script e estilo inline, CDNs e fontes que você não listou, e o site “para de funcionar” sem erro no servidor. Adote em etapas: comece com `Content-Security-Policy-Report-Only`, observe as violações reportadas, ajuste a lista e só então imponha. Evite `'unsafe-inline'` e `'unsafe-eval'`: prefira `nonce` ou hash. Numa API que só devolve JSON, a CSP importa pouco; ela pesa nas páginas HTML que o servidor entrega.",
      },
    ],
    armadilhas: [
      "Achar que `app.use(helmet())` basta: ele cobre os cabeçalhos, mas não valida entrada, não autentica e a CSP padrão pode precisar de ajuste para a sua página.",
      "Ligar HSTS com `max-age` longo (ou preload) antes de ter HTTPS em todos os subdomínios: o navegador recusa HTTP e você não desfaz isso rápido.",
      "Confundir CORS com proteção: `Access-Control-Allow-Origin` relaxa uma restrição do navegador e não protege o servidor nem autentica ninguém.",
      "Configurar os cabeçalhos só em parte das rotas, ou perdê-los porque um proxy ou CDN os sobrescreve: confira na resposta final que o cliente recebe.",
    ],
    autoteste: [
      {
        pergunta: "O que o Helmet faz e por que ele não substitui código seguro?",
        resposta:
          "É um middleware que define cabeçalhos HTTP de segurança com padrões conservadores (CSP, HSTS, `nosniff`, entre outros). Os cabeçalhos orientam o navegador, mas não validam entrada, não autenticam e não valem para clientes que não são navegadores.",
      },
      {
        pergunta: "Como adotar uma CSP sem derrubar o site?",
        resposta:
          "Comece em modo `Content-Security-Policy-Report-Only`, colete as violações, ajuste as diretivas (use `nonce` ou hash em vez de `'unsafe-inline'`) e só depois passe a impor a política.",
      },
    ],
  },
  en: {
    titulo: "Security headers and Helmet",
    pergunta: "How do you ensure security in HTTP headers with Node.js?",
    porqueEsteMetodo:
      "Every security header exists because of a specific attack. In threat → defense pairs, you learn what each one is for and can explain what happens without it.",
    resposta30s:
      "Security headers are instructions the server gives the **browser** to shut down whole classes of attack: `Strict-Transport-Security` (HTTPS only), `Content-Security-Policy` (where the page may load code from), `X-Content-Type-Options`, clickjacking protection, `Referrer-Policy` and cookie flags. In Node.js, the **`helmet`** middleware sets a group of conservative defaults in one line, but the CSP almost always needs tuning so it does not break the page. They are defense in depth, not a substitute for secure code.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Threat → defense",
        rotuloOrigem: "Threat",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**Downgrade and sniffing**: the user types the address without `https://`, and someone on the network reads or alters the first request sent over plain HTTP",
            destino:
              "**`Strict-Transport-Security` (HSTS)**: after the first HTTPS visit, the browser uses only HTTPS for the domain during the stated period (`max-age`). It only counts over HTTPS.",
          },
          {
            origem:
              "**Clickjacking**: the site is embedded in an invisible `iframe` and the user clicks on something they cannot see",
            destino:
              "**`frame-ancestors` in the CSP** (the modern way) and **`X-Frame-Options`** (legacy, still useful): they say who may embed your page, or nobody.",
          },
          {
            origem: "**MIME sniffing**: the browser “guesses” that an uploaded text file is a script and runs it",
            destino:
              "**`X-Content-Type-Options: nosniff`**, together with a correct `Content-Type` on every response: the browser obeys the declared type.",
          },
          {
            origem: "**XSS**: an injected script steals the session or data",
            destino:
              "**`Content-Security-Policy`**: a list of where scripts, styles, images and connections may come from; an injected script from another origin does not run. The main defense is still escaping output (see D52); the CSP limits the damage.",
          },
          {
            origem:
              "**Referrer leakage**: the full URL (with ids or tokens) goes in the `Referer` header to other sites",
            destino:
              "**`Referrer-Policy`** (for example, `strict-origin-when-cross-origin`): limits what is sent and to whom.",
          },
          {
            origem: "**Fingerprinting**: `X-Powered-By: Express` helps the attacker pick exploits for your stack",
            destino:
              '**Remove `X-Powered-By`** (`app.disable("x-powered-by")`, which Helmet already does). Hiding does not protect on its own; it only removes the label.',
          },
          {
            origem:
              "**A cookie stolen or sent where it should not be** (XSS, open network, a request from another site)",
            destino:
              "**`HttpOnly`** (JavaScript cannot read it), **`Secure`** (sent only over HTTPS) and **`SameSite`** (limits cross-site sending; see L124). These are `Set-Cookie` attributes.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Helmet with an explicit CSP",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import helmet from "helmet";',
          "",
          "const app = express();",
          "app.use(",
          "  helmet({",
          "    contentSecurityPolicy: {",
          "      directives: {",
          "        defaultSrc: [\"'self'\"],",
          '        scriptSrc: ["\'self\'", "https://cdn.example.com"],',
          '        imgSrc: ["\'self\'", "data:"],',
          "        frameAncestors: [\"'none'\"],",
          "      },",
          "    },",
          "    strictTransportSecurity: { maxAge: 86400 }, // start short; raise it with confidence",
          "  }),",
          ");",
        ].join("\n"),
        nota: "With no options, `helmet()` already turns on a default CSP, HSTS, `nosniff`, `Referrer-Policy`, clickjacking protection and the removal of `X-Powered-By`. The exact list and values change between package versions: check the documentation.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The header instructs the browser; it does not fix the server",
        texto:
          "These headers only work against attacks that go through the **browser**; a `curl` call or a server-to-server request ignores them. That is why they are **defense in depth**: secure code (validation, escaping, authentication) remains the first line. The same goes for **CORS**, which is not server security: it only relaxes the browser’s same-origin policy and does not stop anyone from calling your API (see L42). To verify, make a request and read the headers of the real response (`curl -I`), use a header analyzer and keep an integration test that checks the main ones.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The CSP is the one that breaks the page",
        texto:
          "A restrictive CSP blocks inline scripts and styles, CDNs and fonts you did not list, and the site “stops working” with no server-side error. Adopt it in stages: start with `Content-Security-Policy-Report-Only`, watch the reported violations, adjust the list and only then enforce. Avoid `'unsafe-inline'` and `'unsafe-eval'`: prefer a `nonce` or a hash. On an API that only returns JSON the CSP matters little; it weighs on the HTML pages the server delivers.",
      },
    ],
    armadilhas: [
      "Thinking `app.use(helmet())` is enough: it covers the headers, but it does not validate input, does not authenticate, and the default CSP may need tuning for your page.",
      "Turning on HSTS with a long `max-age` (or preload) before every subdomain has HTTPS: the browser refuses HTTP and you cannot undo that quickly.",
      "Confusing CORS with protection: `Access-Control-Allow-Origin` relaxes a browser restriction and neither protects the server nor authenticates anyone.",
      "Setting the headers on only some routes, or losing them because a proxy or CDN overwrites them: check the final response the client receives.",
    ],
    autoteste: [
      {
        pergunta: "What does Helmet do and why does it not replace secure code?",
        resposta:
          "It is a middleware that sets security HTTP headers with conservative defaults (CSP, HSTS, `nosniff`, among others). The headers guide the browser, but they do not validate input, do not authenticate and do not apply to clients that are not browsers.",
      },
      {
        pergunta: "How do you adopt a CSP without taking the site down?",
        resposta:
          "Start in `Content-Security-Policy-Report-Only` mode, collect the violations, tune the directives (use a `nonce` or a hash instead of `'unsafe-inline'`) and only then enforce the policy.",
      },
    ],
  },
};
