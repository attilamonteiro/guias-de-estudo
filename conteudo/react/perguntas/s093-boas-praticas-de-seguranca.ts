import type { Pergunta } from "../../tipos";

// S93 · Boas práticas de segurança
export const s093: Pergunta = {
  numero: 693,
  modulo: "simplilearn-seguranca-e-design",
  metodo: "threat",
  pt: {
    titulo: "Boas práticas de segurança",
    pergunta: "Quais são as melhores práticas para proteger aplicações React?",
    porqueEsteMetodo:
      "Segurança se aprende pelo par ataque e defesa: cada prática só faz sentido quando você sabe o que ela impede. Listar os ataques que de fato alcançam uma aplicação React e a defesa de cada um dá um mapa que serve para qualquer projeto.",
    resposta30s:
      "O React ajuda: o JSX **escapa o texto** por padrão, o que barra boa parte do **XSS**. Mas o front-end roda no navegador do usuário e **nunca é um lugar confiável**. As práticas centrais: não injetar HTML sem **sanitizar** (`dangerouslySetInnerHTML`), validar URLs, guardar a sessão em **cookies HttpOnly** em vez de `localStorage`, manter as **dependências** atualizadas e auditadas, usar **CSP**, **validar e autorizar sempre no servidor** e não pôr segredos no bundle.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataques e defesas em uma aplicação React",
        rotuloOrigem: "Ataque",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**XSS por HTML injetado**: um comentário com `<img src=x onerror=...>` é renderizado com `dangerouslySetInnerHTML`",
            destino:
              "Deixe o JSX escapar o texto (`{comentario}`). Se for inevitável renderizar HTML, **sanitize** com uma biblioteca confiável (como a DOMPurify) logo antes de renderizar e combine com uma CSP.",
          },
          {
            origem: "**URL com esquema `javascript:`** em `href` ou `src` vinda do usuário: o clique executa o script",
            destino:
              "Valide o esquema antes de usar o endereço (permita só `http:`, `https:` e `mailto:`), por exemplo com `new URL(...)`. Não dependa do aviso que o React emite.",
          },
          {
            origem: "**Roubo de token**: um XSS lê o `localStorage` ou o `sessionStorage`, onde o token foi guardado",
            destino:
              "Prefira cookies **HttpOnly**, `Secure` e `SameSite` para a sessão: o JavaScript da página não consegue lê-los. Mantenha tokens de acesso de vida curta e avalie o risco de qualquer coisa guardada no cliente.",
          },
          {
            origem: "**CSRF**: outro site faz o navegador enviar um pedido com os cookies do usuário",
            destino:
              "`SameSite`, token anti-CSRF ou verificação de origem no servidor, e nada de ação que altera dados em requisição GET.",
          },
          {
            origem:
              "**Dependência vulnerável ou maliciosa** (cadeia de suprimentos): um pacote, ou uma atualização dele, traz código hostil",
            destino:
              "`npm audit`, lockfile com `npm ci`, atualizações revisadas (Dependabot ou Renovate), poucas dependências e desconfiança de pacotes novos ou de nome parecido com um conhecido.",
          },
          {
            origem: "**Script de terceiros comprometido** (analytics, widgets, arquivos de CDN)",
            destino:
              "Uma **CSP** restritiva, Subresource Integrity para arquivos de CDN e o mínimo possível de scripts externos.",
          },
          {
            origem:
              "**Segredo no bundle**: uma chave de API privada em variável de ambiente que o build expõe ao cliente",
            destino:
              "Tudo o que entra no bundle é público, inclusive variáveis com prefixo de exposição (como `VITE_` ou `NEXT_PUBLIC_`). Chaves privadas ficam no servidor, e o front chama um endpoint seu.",
          },
          {
            origem:
              "**Validação só no cliente**: o atacante ignora a interface e chama a API direto; botão escondido não é permissão",
            destino:
              "Valide e autorize **sempre no servidor**. A validação do front serve à experiência do usuário, não à segurança.",
          },
          {
            origem:
              "**Server Actions e Server Functions tratadas como detalhe interno**: qualquer cliente pode chamá-las diretamente",
            destino:
              "Trate cada uma como um endpoint público: autenticação, autorização e validação da entrada dentro dela. Não envie ao cliente, por props, dados que ele não deve ver.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sanitizar o HTML e validar o endereço do link",
        legenda: "TSX",
        codigo: [
          'import DOMPurify from "dompurify";',
          "",
          "function Comentario({ html }: { html: string }) {",
          "  // o JSX escapa texto sozinho; HTML só entra depois de sanitizado",
          "  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;",
          "}",
          "",
          "function urlSegura(url: string) {",
          "  try {",
          "    const { protocol } = new URL(url, window.location.origin);",
          '    return ["http:", "https:", "mailto:"].includes(protocol) ? url : "#";',
          "  } catch {",
          '    return "#";',
          "  }",
          "}",
          "",
          "export function Link({ url }: { url: string }) {",
          "  return <a href={urlSegura(url)}>Abrir</a>;",
          "}",
        ].join("\n"),
        nota: "Com `javascript:alert(1)` o link vai para `#`. Sempre que der, renderize texto em vez de HTML.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O front-end não é um cofre",
        texto:
          "Tudo o que está no bundle, na memória do navegador e nas requisições pode ser lido e alterado por quem usa a aplicação. A segurança de verdade (autenticação, autorização, validação, segredos) mora no **servidor**. As defesas do front reduzem a superfície de ataque e protegem o usuário, mas não substituem o servidor. Veja também L201, L203 e L208.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Confira a documentação e atualize",
        texto:
          "Recursos e riscos mudam, sobretudo em Server Components e Server Functions. Consulte react.dev e a documentação do seu framework, acompanhe os avisos de segurança do ecossistema e atualize o React e as dependências quando houver correção.",
      },
    ],
    armadilhas: [
      "Achar que o React é seguro por padrão e usar `dangerouslySetInnerHTML` com HTML do usuário, ou de uma API, sem sanitizar.",
      "Esconder botões e rotas e chamar isso de autorização: o atacante chama a API direto. Autorize no servidor.",
      "Guardar o token de acesso em `localStorage` sem ter avaliado o risco: um único XSS ou script de terceiros o leva.",
      "Pôr uma chave privada em variável de ambiente “do front” (com prefixo exposto) ou no código: ela vai para o bundle e fica pública.",
    ],
    autoteste: [
      {
        pergunta: "Por que o JSX protege contra XSS e o que desfaz essa proteção?",
        resposta:
          "O React trata os valores inseridos entre chaves como texto e os escapa, então um `<script>` vira texto inofensivo. `dangerouslySetInnerHTML` e URLs com `javascript:` em `href` ou `src` ficam fora dessa proteção; use sanitização e validação do esquema da URL.",
      },
      {
        pergunta: "Por que validar só no navegador não basta?",
        resposta:
          "Porque o atacante não precisa usar a sua interface: ele envia requisições direto à API. A validação do front é conveniência para o usuário; a que protege de verdade é a do servidor.",
      },
    ],
  },
  en: {
    titulo: "Securing React applications",
    pergunta: "What are the best practices for securing React applications?",
    porqueEsteMetodo:
      "Security is learned as attack and defense pairs: each practice only makes sense once you know what it prevents. Listing the attacks that really reach a React application, and the defense for each, gives a map that works for any project.",
    resposta30s:
      "React helps: JSX **escapes text** by default, which stops much of **XSS**. But the front end runs in the user’s browser and **is never a trusted place**. The core practices: never inject HTML without **sanitizing** it (`dangerouslySetInnerHTML`), validate URLs, keep the session in **HttpOnly cookies** instead of `localStorage`, keep **dependencies** updated and audited, use a **CSP**, **validate and authorize on the server, always**, and keep secrets out of the bundle.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attacks and defenses in a React application",
        rotuloOrigem: "Attack",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**XSS through injected HTML**: a comment containing `<img src=x onerror=...>` is rendered with `dangerouslySetInnerHTML`",
            destino:
              "Let JSX escape the text (`{comment}`). If you must render HTML, **sanitize** it with a trusted library (such as DOMPurify) right before rendering, and combine it with a CSP.",
          },
          {
            origem:
              "**A `javascript:` URL scheme** in an `href` or `src` coming from the user: the click runs the script",
            destino:
              "Validate the scheme before using the address (allow only `http:`, `https:` and `mailto:`), for example with `new URL(...)`. Do not rely on the warning React emits.",
          },
          {
            origem: "**Token theft**: an XSS reads the `localStorage` or `sessionStorage` where the token was stored",
            destino:
              "Prefer **HttpOnly**, `Secure` and `SameSite` cookies for the session: the page’s JavaScript cannot read them. Keep access tokens short-lived and weigh the risk of anything stored on the client.",
          },
          {
            origem: "**CSRF**: another site makes the browser send a request with the user’s cookies",
            destino:
              "`SameSite`, an anti-CSRF token or an origin check on the server, and no state-changing action on GET requests.",
          },
          {
            origem:
              "**Vulnerable or malicious dependency** (supply chain): a package, or an update of it, brings hostile code",
            destino:
              "`npm audit`, a lockfile with `npm ci`, reviewed updates (Dependabot or Renovate), few dependencies, and suspicion toward new packages or names close to a well-known one.",
          },
          {
            origem: "**Compromised third-party script** (analytics, widgets, CDN files)",
            destino:
              "A restrictive **CSP**, Subresource Integrity for CDN files and as few external scripts as possible.",
          },
          {
            origem:
              "**Secret in the bundle**: a private API key in an environment variable the build exposes to the client",
            destino:
              "Everything that enters the bundle is public, including variables with an exposure prefix (such as `VITE_` or `NEXT_PUBLIC_`). Private keys stay on the server, and the front end calls an endpoint of yours.",
          },
          {
            origem:
              "**Client-only validation**: the attacker ignores the interface and calls the API directly; a hidden button is not a permission",
            destino:
              "Validate and authorize **always on the server**. Front-end validation serves the user experience, not security.",
          },
          {
            origem:
              "**Server Actions and Server Functions treated as an internal detail**: any client can call them directly",
            destino:
              "Treat each one as a public endpoint: authentication, authorization and input validation inside it. Do not send the client, through props, data it should not see.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Sanitizing HTML and validating a link’s address",
        legenda: "TSX",
        codigo: [
          'import DOMPurify from "dompurify";',
          "",
          "function Comment({ html }: { html: string }) {",
          "  // JSX escapes text on its own; HTML only goes in after sanitizing",
          "  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;",
          "}",
          "",
          "function safeUrl(url: string) {",
          "  try {",
          "    const { protocol } = new URL(url, window.location.origin);",
          '    return ["http:", "https:", "mailto:"].includes(protocol) ? url : "#";',
          "  } catch {",
          '    return "#";',
          "  }",
          "}",
          "",
          "export function Link({ url }: { url: string }) {",
          "  return <a href={safeUrl(url)}>Open</a>;",
          "}",
        ].join("\n"),
        nota: "With `javascript:alert(1)` the link goes to `#`. Whenever you can, render text instead of HTML.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The front end is not a vault",
        texto:
          "Everything in the bundle, in the browser’s memory and in requests can be read and changed by whoever uses the application. Real security (authentication, authorization, validation, secrets) lives on the **server**. Front-end defenses shrink the attack surface and protect the user, but they do not replace the server. See also L201, L203 and L208.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Check the documentation and update",
        texto:
          "Features and risks change, especially around Server Components and Server Functions. Consult react.dev and your framework’s documentation, follow the ecosystem’s security advisories and update React and your dependencies when a fix is released.",
      },
    ],
    armadilhas: [
      "Assuming React is secure by default and using `dangerouslySetInnerHTML` with user HTML, or HTML from an API, without sanitizing it.",
      "Hiding buttons and routes and calling that authorization: the attacker calls the API directly. Authorize on the server.",
      "Storing the access token in `localStorage` without weighing the risk: a single XSS or third-party script takes it.",
      "Putting a private key in a “front-end” environment variable (with an exposed prefix) or in the code: it goes into the bundle and becomes public.",
    ],
    autoteste: [
      {
        pergunta: "Why does JSX protect against XSS, and what undoes that protection?",
        resposta:
          "React treats values inserted between braces as text and escapes them, so a `<script>` becomes harmless text. `dangerouslySetInnerHTML` and `javascript:` URLs in `href` or `src` sit outside that protection; use sanitization and URL scheme validation.",
      },
      {
        pergunta: "Why is validating only in the browser not enough?",
        resposta:
          "Because the attacker does not need to use your interface: they send requests straight to the API. Front-end validation is a convenience for the user; the validation that really protects is the server’s.",
      },
    ],
  },
};
