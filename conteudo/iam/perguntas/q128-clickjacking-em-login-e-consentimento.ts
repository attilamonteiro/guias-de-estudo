import type { Pergunta } from "../../tipos";

// Q128 · Clickjacking em login e consentimento
export const q128: Pergunta = {
  numero: 128,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Clickjacking em login e consentimento",
    pergunta:
      "O que é clickjacking e como ele afeta páginas de login e consentimento OAuth? Quais cabeçalhos e práticas o impedem?",
    porqueEsteMetodo:
      "O clickjacking tem uma causa única, a página aceitar ser embutida, e defesas diretas. Os pares ataque → defesa mostram como o iframe invisível funciona e qual cabeçalho ou prática fecha cada brecha.",
    resposta30s:
      "**Clickjacking** é carregar a página legítima (um login, o “Permitir” de um consentimento OAuth) num **`<iframe>` invisível** sobre uma isca do atacante, de modo que o clique do usuário aciona um controle real que ele não vê. A causa é a página **aceitar ser embutida**: a defesa é proibir isso com **`Content-Security-Policy: frame-ancestors`** (e `X-Frame-Options` por compatibilidade), além de consentimento que exige uma ação deliberada. Token anti-CSRF não ajuda, porque o clique parte da página verdadeira.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ataque → defesa",
        rotuloOrigem: "Ataque ou causa",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "O invasor hospeda uma página isca (um jogo, um botão “baixar”) e põe a tela de **consentimento OAuth** num `<iframe>` transparente sobre a isca. O usuário já tem sessão, clica achando que joga e na verdade clica em **Permitir**.",
            destino:
              "**`Content-Security-Policy: frame-ancestors 'none'`** (ou `'self'`, ou uma lista exata de origens) nas respostas das páginas sensíveis: o navegador se recusa a exibi-las dentro do iframe do invasor.",
          },
          {
            origem:
              "No **login**, um clique em “Continuar como …” do SSO ou em “Entrar” conclui a autenticação, e telas de aprovação de MFA ou de configurações de conta também são alvo de um clique enganado.",
            destino:
              "A proibição vale para **toda tela de autenticação e de conta** (login, MFA, redefinição de senha, consentimento, configurações), não só para a de consentimento.",
          },
          {
            origem: "Navegador ou intermediário antigo que não entende `frame-ancestors`.",
            destino:
              "**`X-Frame-Options: DENY`** (ou `SAMEORIGIN`) junto, por compatibilidade. Onde os dois aparecem, os navegadores atuais seguem o `frame-ancestors`. O valor `ALLOW-FROM` está obsoleto e não deve ser usado.",
          },
          {
            origem: "O cookie de sessão acompanha o iframe e a tela abre “pronta” para aprovar.",
            destino:
              "`SameSite=Lax` ou `Strict` no cookie de sessão: num iframe de outro site o cookie não é enviado e a página embutida cai na tela de login. É camada extra, não substitui o cabeçalho.",
          },
          {
            origem: "Consentimento aprovável por um clique cego, com texto vago ou botão já em foco.",
            destino:
              "Tela de consentimento que exige **interação deliberada**: nome do app e escopos legíveis, escolha de conta, reautenticação ou confirmação (MFA, WebAuthn) para escopos sensíveis, e nenhum atalho de teclado que aprove sozinho.",
          },
          {
            origem:
              "Quem precisa embutir a página: widget de pagamento, SSO dentro de iframe, renovação silenciosa com `prompt=none` num iframe oculto.",
            destino:
              "Prefira redirecionar a página inteira ou abrir um popup. Se for inevitável embutir, liste as **origens exatas** em `frame-ancestors`, nunca `*`. A renovação em iframe oculto sofre com cookies de terceiros bloqueados: prefira refresh token com rotação ou BFF (veja Q34 e Q41).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Cabeçalhos da página de login e de consentimento",
        legenda: "HTTP",
        codigo:
          "HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nContent-Security-Policy: frame-ancestors 'none'\nX-Frame-Options: DENY\nSet-Cookie: __Host-sid=<id>; Path=/; Secure; HttpOnly; SameSite=Lax\nCache-Control: no-store",
        nota: "Envie os cabeçalhos em todas as respostas HTML dessas páginas, inclusive as de erro: `frame-ancestors` não vale dentro de uma tag `<meta>`. Para permitir uma origem específica, use por exemplo `frame-ancestors 'self' https://parceiro.example`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "A regra",
        texto:
          "Proíba o embutimento **por padrão** e abra exceções por lista exata. O ataque precisa de duas coisas: que a página aceite ficar dentro do iframe do invasor e que a ação se complete com um clique. Cortar a primeira com `frame-ancestors` resolve; dificultar a segunda (interação deliberada, escopos legíveis) é a segunda linha de defesa.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que não funciona",
        texto:
          "O token anti-CSRF não protege: o clique é do usuário e a requisição sai da página verdadeira, com o token correto. “Frame busting” em JavaScript (`if (top !== self) …`) é contornável, por exemplo com o atributo `sandbox` no iframe, então só serve de reforço. A defesa é o cabeçalho, enviado pelo servidor.",
      },
    ],
    armadilhas: [
      "Confiar em script de “frame busting” em vez de cabeçalho: ele é contornável e some se o JavaScript for bloqueado.",
      "Proteger só a tela de consentimento e deixar login, MFA, redefinição de senha e configurações embutíveis.",
      "Usar `X-Frame-Options: ALLOW-FROM` para liberar um parceiro: está obsoleto e é ignorado; use `frame-ancestors` com a lista exata.",
      "Configurar o `frame-ancestors` numa tag `<meta>` ou só na página principal: ele precisa vir no cabeçalho de cada resposta que pode ser embutida.",
    ],
    autoteste: [
      {
        pergunta: "Por que um token anti-CSRF não protege contra clickjacking?",
        resposta:
          "Porque a requisição é gerada pela página legítima, com o token correto, a partir de um clique real do usuário. O atacante só engana onde ele clica; não precisa forjar nada.",
      },
      {
        pergunta: "Qual cabeçalho você usa hoje contra clickjacking e qual o papel do `X-Frame-Options`?",
        resposta:
          "O `frame-ancestors` do CSP, que aceita uma lista de origens e é o padrão atual. O `X-Frame-Options` (`DENY` ou `SAMEORIGIN`) fica só por compatibilidade com clientes antigos.",
      },
    ],
  },
  en: {
    titulo: "Clickjacking on login and consent",
    pergunta:
      "What is clickjacking, and how does it affect login and OAuth consent pages? Which headers and practices prevent it?",
    porqueEsteMetodo:
      "Clickjacking has a single cause, the page agreeing to be embedded, and direct defenses. The attack → defense pairs show how the invisible iframe works and which header or practice closes each gap.",
    resposta30s:
      "**Clickjacking** loads the legitimate page (a login, the “Allow” button of an OAuth consent) in an **invisible `<iframe>`** on top of the attacker’s bait, so the user’s click triggers a real control they cannot see. The cause is the page **agreeing to be embedded**: the defense is to forbid that with **`Content-Security-Policy: frame-ancestors`** (and `X-Frame-Options` for compatibility), plus consent that requires a deliberate action. An anti-CSRF token does not help, because the click comes from the genuine page.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attack → defense",
        rotuloOrigem: "Attack or cause",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "The attacker hosts a bait page (a game, a “download” button) and puts the **OAuth consent** screen in a transparent `<iframe>` over the bait. The user already has a session, clicks thinking they are playing and actually clicks **Allow**.",
            destino:
              "**`Content-Security-Policy: frame-ancestors 'none'`** (or `'self'`, or an exact list of origins) on the responses of sensitive pages: the browser refuses to display them inside the attacker’s iframe.",
          },
          {
            origem:
              "On **login**, one click on “Continue as …” in SSO or on “Sign in” completes authentication, and MFA approval or account-settings screens are also targets of a tricked click.",
            destino:
              "The ban applies to **every authentication and account screen** (login, MFA, password reset, consent, settings), not just the consent screen.",
          },
          {
            origem: "An old browser or intermediary that does not understand `frame-ancestors`.",
            destino:
              "**`X-Frame-Options: DENY`** (or `SAMEORIGIN`) alongside, for compatibility. Where both are present, current browsers follow `frame-ancestors`. The `ALLOW-FROM` value is obsolete and should not be used.",
          },
          {
            origem: "The session cookie travels with the iframe and the screen opens “ready” to approve.",
            destino:
              "`SameSite=Lax` or `Strict` on the session cookie: in an iframe from another site the cookie is not sent and the embedded page falls back to the login screen. It is an extra layer, not a substitute for the header.",
          },
          {
            origem: "Consent that can be approved with one blind click, with vague text or an already-focused button.",
            destino:
              "A consent screen that requires **deliberate interaction**: readable app name and scopes, account selection, re-authentication or confirmation (MFA, WebAuthn) for sensitive scopes, and no keyboard shortcut that approves on its own.",
          },
          {
            origem:
              "Anyone who needs to embed the page: a payment widget, SSO inside an iframe, silent renewal with `prompt=none` in a hidden iframe.",
            destino:
              "Prefer redirecting the whole page or opening a popup. If embedding is unavoidable, list the **exact origins** in `frame-ancestors`, never `*`. Renewal in a hidden iframe suffers from blocked third-party cookies: prefer a refresh token with rotation or a BFF (see Q34 and Q41).",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Headers of the login and consent page",
        legenda: "HTTP",
        codigo:
          "HTTP/1.1 200 OK\nContent-Type: text/html; charset=utf-8\nContent-Security-Policy: frame-ancestors 'none'\nX-Frame-Options: DENY\nSet-Cookie: __Host-sid=<id>; Path=/; Secure; HttpOnly; SameSite=Lax\nCache-Control: no-store",
        nota: "Send the headers on every HTML response of these pages, including error pages: `frame-ancestors` does not work inside a `<meta>` tag. To allow one specific origin, use for example `frame-ancestors 'self' https://partner.example`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The rule",
        texto:
          "Forbid embedding **by default** and open exceptions by exact list. The attack needs two things: that the page agrees to sit inside the attacker’s iframe and that the action completes with a single click. Cutting the first with `frame-ancestors` solves it; making the second harder (deliberate interaction, readable scopes) is the second line of defense.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What does not work",
        texto:
          "An anti-CSRF token does not protect: the click is the user’s and the request leaves the genuine page, with the correct token. JavaScript “frame busting” (`if (top !== self) …`) can be bypassed, for example with the `sandbox` attribute on the iframe, so it only serves as reinforcement. The defense is the header, sent by the server.",
      },
    ],
    armadilhas: [
      "Relying on a “frame busting” script instead of a header: it can be bypassed and disappears if JavaScript is blocked.",
      "Protecting only the consent screen and leaving login, MFA, password reset and settings embeddable.",
      "Using `X-Frame-Options: ALLOW-FROM` to allow a partner: it is obsolete and ignored; use `frame-ancestors` with the exact list.",
      "Setting `frame-ancestors` in a `<meta>` tag or only on the main page: it must come in the header of every response that could be embedded.",
    ],
    autoteste: [
      {
        pergunta: "Why does an anti-CSRF token not protect against clickjacking?",
        resposta:
          "Because the request is generated by the legitimate page, with the correct token, from a real click by the user. The attacker only tricks where the user clicks; there is nothing to forge.",
      },
      {
        pergunta: "Which header do you use today against clickjacking, and what is the role of `X-Frame-Options`?",
        resposta:
          "The CSP `frame-ancestors`, which accepts a list of origins and is the current standard. `X-Frame-Options` (`DENY` or `SAMEORIGIN`) stays only for compatibility with old clients.",
      },
    ],
  },
};
