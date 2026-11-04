import type { Pergunta } from "../../tipos";

// L200 · Prevenir XSS no React
export const l200: Pergunta = {
  numero: 200,
  modulo: "linkedin-seguranca-e-a11y",
  metodo: "threat",
  pt: {
    titulo: "Prevenir XSS no React",
    pergunta: "Como você previne XSS no React?",
    porqueEsteMetodo:
      "Defender é saber por onde o ataque entra. Cada par ataque → defesa mostra uma porta que o React fecha sozinho e as que continuam abertas, o que responde também se o React “já protege”.",
    resposta30s:
      "No **XSS** (cross-site scripting), um script injetado por conteúdo não confiável roda no navegador da vítima e age em nome dela. O React ajuda porque **escapa automaticamente** o que você interpola no JSX, tratando-o como texto; a defesa é **não sair desse padrão sem cuidado**: evitar HTML bruto, **sanitizar** o que precisar ser HTML, **validar URLs** em `href` e `src` e usar **CSP** como camada extra. O React **não é imune**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "Texto não confiável (comentário, nome, bio) com `<script>` ou `<img onerror=...>` inserido na página",
            destino:
              "**Escape automático do JSX**: tudo o que vai em `{valor}` vira texto, nunca marcação. Mantenha o conteúdo como texto e deixe o React renderizar.",
          },
          {
            origem:
              "HTML bruto com `dangerouslySetInnerHTML` (ou `innerHTML` direto), alimentado por usuário ou por API",
            destino:
              "**Evite.** Quando for inevitável, **sanitize** com uma biblioteca mantida (como a DOMPurify), com lista permitida, imediatamente antes de renderizar (veja L202).",
          },
          {
            origem: "URL controlada pelo usuário em `href` ou `src`: `javascript:alert(1)` executa ao clicar",
            destino:
              "O escape do JSX **não valida URLs**. Parse com `new URL` e aceite só protocolos conhecidos (`http:`, `https:`, `mailto:`); descarte o resto.",
          },
          {
            origem:
              "Pontos fora do escape: `ref.current.innerHTML`, `document.write`, `eval`, `new Function` e JSON de estado colado numa tag `<script>` sem escapar o `<`",
            destino:
              "Não use esses caminhos: atualize a tela por estado e JSX. Ao serializar estado para o HTML do servidor, escape o `<` ou use a API do seu framework para isso.",
          },
          {
            origem:
              "Props espalhadas de origem não confiável (`<a {...props}>`) ou componente escolhido por uma string recebida",
            destino:
              "Use uma **lista explícita de props** e uma tabela fixa de componentes; nunca espalhe um objeto vindo de fora, que pode trazer `dangerouslySetInnerHTML` ou `href` malicioso.",
          },
          {
            origem: "Pacote comprometido, widget de terceiros ou renderizador de Markdown com HTML cru ligado",
            destino:
              "Revise as dependências (`npm audit`, lockfile, atualizações), prefira Markdown sem HTML cru ou sanitizado e proteja scripts externos com CSP e integridade de sub-recursos (SRI).",
          },
          {
            origem: "Apesar de tudo, um script injetado consegue rodar",
            destino:
              "**CSP** como camada extra (veja L209) e tokens fora do alcance do JavaScript, como cookie `HttpOnly` (veja L205), para limitar o estrago.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "O que o escape cobre e o que não cobre",
        legenda: "TSX",
        codigo: `// Seguro: o React escapa o texto
<p>{comentario.texto}</p>

// Perigoso: HTML bruto vindo do usuário ou da API
<div dangerouslySetInnerHTML={{ __html: comentario.html }} />

// Perigoso: o escape não valida URLs ("javascript:alert(1)" executa ao clicar)
<a href={perfil.site}>Site</a>

// Correção: aceitar só protocolos conhecidos
function urlSegura(valor: string) {
  try {
    const url = new URL(valor);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
<a href={urlSegura(perfil.site)}>Site</a>`,
        nota: "Sem `href` válido, o `<a>` deixa de ser um link; mostre só o texto. Em desenvolvimento o React pode avisar sobre URLs `javascript:`, mas não conte com isso como proteção.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O padrão é seguro; o risco entra por onde você sai dele",
        texto:
          "O React é seguro **por padrão** contra a injeção por texto: o que vai em `{...}` é escapado e os elementos carregam uma marca interna (um `Symbol`) que JSON vindo de fora não consegue forjar, então dados não viram elementos. Mas ele **não é imune**: as brechas são HTML bruto, URLs, DOM manipulado à mão, props espalhadas, o HTML gerado no servidor e as dependências. A defesa é em camadas: escapar por padrão, sanitizar quando houver HTML, validar URLs, revisar dependências, CSP e tokens fora do alcance do JavaScript.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sanitizar no navegador não basta",
        texto:
          "O XSS armazenado nasce quando o dado perigoso é gravado e entregue a outros usuários, então valide e sanitize também no servidor e trate a saída conforme o contexto (HTML, atributo, URL, script). Use sempre **lista permitida** (o que pode), nunca lista de proibições (o que não pode), e sanitize o mais perto possível de onde o dado vira DOM. Um XSS roda com os privilégios da página e pode agir como o usuário mesmo sem ler o token.",
      },
    ],
    armadilhas: [
      "Achar que “o React já protege” e usar `dangerouslySetInnerHTML` com HTML da API sem sanitizar.",
      "Sanitizar com regex ou removendo `<script>`: variações como `onerror` e `javascript:` passam. Use uma biblioteca mantida, com lista permitida.",
      "Validar URL procurando o texto `javascript:`: maiúsculas, espaços e caracteres de controle contornam. Faça o parse com `new URL` e compare o protocolo com uma lista permitida.",
      "Confiar só no front-end, ou só na CSP: o dado malicioso pode ser gravado no servidor, e uma CSP frouxa (`unsafe-inline`) não protege.",
    ],
    autoteste: [
      {
        pergunta: "Por que `{valor}` no JSX é seguro e `href={valor}` pode não ser?",
        resposta:
          "Como filho, `{valor}` é inserido como texto, nunca como marcação. Num atributo de URL, o texto continua sendo uma URL válida para o navegador, e `javascript:` executa código ao clicar; por isso é preciso validar o protocolo.",
      },
      {
        pergunta: "Cite camadas de defesa contra XSS em uma aplicação React.",
        resposta:
          "Escape do JSX e evitar HTML bruto; sanitização com lista permitida e validação de URLs; revisão de dependências; e CSP mais tokens que o JavaScript não lê (cookie HttpOnly) para limitar o dano se algo escapar.",
      },
    ],
  },
  en: {
    titulo: "Preventing XSS in React",
    pergunta: "How do you prevent XSS in React?",
    porqueEsteMetodo:
      "To defend, you must know where the attack gets in. Each attack → defense pair shows a door React closes by itself and the ones that stay open, which also answers whether React “already protects”.",
    resposta30s:
      "In **XSS** (cross-site scripting), a script injected through untrusted content runs in the victim’s browser and acts on their behalf. React helps because it **automatically escapes** what you interpolate in JSX, treating it as text; the defense is **not leaving that default carelessly**: avoid raw HTML, **sanitize** whatever must be HTML, **validate URLs** in `href` and `src`, and use **CSP** as an extra layer. React is **not immune**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "Untrusted text (comment, name, bio) containing `<script>` or `<img onerror=...>` inserted into the page",
            destino:
              "**JSX’s automatic escaping**: everything inside `{value}` becomes text, never markup. Keep content as text and let React render it.",
          },
          {
            origem: "Raw HTML through `dangerouslySetInnerHTML` (or `innerHTML` directly), fed by a user or an API",
            destino:
              "**Avoid it.** When unavoidable, **sanitize** with a maintained library (such as DOMPurify), using an allowlist, right before rendering (see L202).",
          },
          {
            origem: "A user-controlled URL in `href` or `src`: `javascript:alert(1)` runs on click",
            destino:
              "JSX escaping **does not validate URLs**. Parse with `new URL` and accept only known protocols (`http:`, `https:`, `mailto:`); discard the rest.",
          },
          {
            origem:
              "Spots outside the escaping: `ref.current.innerHTML`, `document.write`, `eval`, `new Function` and state JSON pasted into a `<script>` tag without escaping the `<`",
            destino:
              "Do not use those paths: update the screen through state and JSX. When serializing state into server HTML, escape the `<` or use your framework’s API for it.",
          },
          {
            origem:
              "Spread props from an untrusted source (`<a {...props}>`) or a component chosen by a received string",
            destino:
              "Use an **explicit list of props** and a fixed table of components; never spread an object from outside, which may carry `dangerouslySetInnerHTML` or a malicious `href`.",
          },
          {
            origem: "A compromised package, a third-party widget or a Markdown renderer with raw HTML turned on",
            destino:
              "Review dependencies (`npm audit`, lockfile, updates), prefer Markdown without raw HTML or sanitized, and protect external scripts with CSP and Subresource Integrity (SRI).",
          },
          {
            origem: "Despite all that, an injected script manages to run",
            destino:
              "**CSP** as an extra layer (see L209) and tokens out of JavaScript’s reach, such as an `HttpOnly` cookie (see L205), to limit the damage.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "What escaping covers and what it does not",
        legenda: "TSX",
        codigo: `// Safe: React escapes the text
<p>{comment.text}</p>

// Dangerous: raw HTML coming from the user or an API
<div dangerouslySetInnerHTML={{ __html: comment.html }} />

// Dangerous: escaping does not validate URLs ("javascript:alert(1)" runs on click)
<a href={profile.site}>Site</a>

// Fix: accept only known protocols
function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
<a href={safeUrl(profile.site)}>Site</a>`,
        nota: "Without a valid `href`, the `<a>` stops being a link; show plain text instead. In development React may warn about `javascript:` URLs, but do not count on that as protection.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The default is safe; the risk enters where you leave it",
        texto:
          "React is safe **by default** against text injection: what goes in `{...}` is escaped, and elements carry an internal marker (a `Symbol`) that JSON from outside cannot forge, so data does not turn into elements. But it is **not immune**: the gaps are raw HTML, URLs, hand-written DOM manipulation, spread props, server-generated HTML and dependencies. The defense is layered: escape by default, sanitize when there is HTML, validate URLs, review dependencies, CSP and tokens out of JavaScript’s reach.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Sanitizing in the browser is not enough",
        texto:
          "Stored XSS is born when the dangerous data is saved and delivered to other users, so validate and sanitize on the server too and treat output according to its context (HTML, attribute, URL, script). Always use an **allowlist** (what is allowed), never a blocklist (what is forbidden), and sanitize as close as possible to where the data becomes DOM. An XSS runs with the page’s privileges and can act as the user even without reading the token.",
      },
    ],
    armadilhas: [
      "Believing “React already protects” and using `dangerouslySetInnerHTML` with API HTML without sanitizing.",
      "Sanitizing with a regex or by stripping `<script>`: variations such as `onerror` and `javascript:` get through. Use a maintained library with an allowlist.",
      "Validating a URL by searching for the text `javascript:`: uppercase letters, spaces and control characters get around it. Parse with `new URL` and compare the protocol against an allowlist.",
      "Relying only on the front end, or only on CSP: malicious data can be saved on the server, and a loose CSP (`unsafe-inline`) protects nothing.",
    ],
    autoteste: [
      {
        pergunta: "Why is `{value}` in JSX safe while `href={value}` may not be?",
        resposta:
          "As a child, `{value}` is inserted as text, never as markup. In a URL attribute, the text is still a valid URL for the browser, and `javascript:` runs code on click; that is why the protocol must be validated.",
      },
      {
        pergunta: "Name layers of defense against XSS in a React application.",
        resposta:
          "JSX escaping and avoiding raw HTML; sanitization with an allowlist and URL validation; dependency review; and CSP plus tokens JavaScript cannot read (an HttpOnly cookie) to limit the damage if something slips through.",
      },
    ],
  },
};
