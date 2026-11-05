import type { Pergunta } from "../../tipos";

// Q25 · Clientes públicos × confidenciais
export const q025: Pergunta = {
  numero: 25,
  modulo: "oauth",
  metodo: "compare",
  pt: {
    titulo: "Clientes públicos × confidenciais",
    pergunta:
      "Qual a diferença entre clientes públicos e confidenciais no OAuth 2.0? Como isso muda a autenticação do cliente e o fluxo recomendado para SPA, mobile e backend?",
    porqueEsteMetodo:
      "A pergunta é uma comparação com consequência prática: a classificação do cliente decide como ele se autentica e qual fluxo usa. Uma matriz por tipo de aplicação e uma regra de decisão deixam isso direto.",
    resposta30s:
      "O critério é um só: **o cliente consegue guardar um segredo?** O **confidencial** roda em um servidor que você controla (web com backend, serviço) e pode se autenticar no `/token` com `client_secret`, `private_key_jwt` ou mTLS. O **público** entrega o código ao dispositivo do usuário (SPA, app móvel, desktop, CLI): nada ali é segredo, então usa **authorization code com PKCE** e se identifica só pelo `client_id`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Como o tipo do cliente muda a conversa com o servidor de autorização",
        colunas: ["Aspecto", "Cliente público", "Cliente confidencial"],
        linhas: [
          [
            "Critério",
            "Não guarda segredo: o código e o dispositivo estão nas mãos do usuário",
            "Guarda segredo: o código roda em um servidor sob o seu controle",
          ],
          [
            "Exemplos",
            "SPA no navegador, app móvel, app desktop, CLI",
            "Aplicação web com backend, API ou serviço de segundo plano, o backend de um BFF",
          ],
          [
            "Autenticação no `/token`",
            "Nenhuma: só o `client_id` (método `none`)",
            "`client_secret_basic` ou `client_secret_post`, `private_key_jwt` ou mTLS (`tls_client_auth`)",
          ],
          [
            "Fluxo recomendado",
            "Authorization code com PKCE (obrigatório); nada de implicit",
            "Authorization code com PKCE (recomendado); client credentials quando não há usuário",
          ],
          [
            "SPA",
            "Code + PKCE feito no navegador; os tokens ficam ao alcance do JavaScript da página",
            "SPA com BFF: o backend faz o fluxo e guarda os tokens, e o navegador só recebe um cookie de sessão",
          ],
          [
            "App móvel ou desktop",
            "Code + PKCE no navegador do sistema (RFC 8252); tokens no armazenamento seguro do sistema (Keychain, Keystore)",
            "Não se aplica: um segredo por instalação não é segredo",
          ],
          [
            "Risco principal",
            "Segredo embutido no app é extraído por qualquer pessoa",
            "Segredo vazado em repositório, log ou imagem; falta de rotação",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A troca do code no /token, nos dois tipos de cliente",
        legenda: "HTTP",
        codigo: [
          "# Público (SPA, app nativo): só client_id e a prova do PKCE",
          "POST /token HTTP/1.1",
          "Host: auth.exemplo.com",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=authorization_code&client_id=spa-123&code=SplxlOBeZQQYbYS6WxSbIA",
          "&redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcb&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          "",
          "# Confidencial (backend): o cliente se autentica, e o PKCE continua valendo",
          "POST /token HTTP/1.1",
          "Host: auth.exemplo.com",
          "Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA",
          "&redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcb&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
        ].join("\n"),
        nota: "No segundo caso, o cabeçalho `Authorization: Basic` leva `client_id:client_secret` em Base64: é um segredo e nunca vai para o repositório. `private_key_jwt` e mTLS trocam esse segredo compartilhado por uma chave privada ou por um certificado. As linhas do corpo foram quebradas só para leitura.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Pergunte **onde o código roda e quem o controla**, não qual tecnologia ele usa. Se o código é entregue ao dispositivo do usuário (JavaScript no navegador, APK, binário desktop), tudo o que está nele é público: trate como **cliente público** e use code + PKCE. Se roda só no seu servidor, é **confidencial**: autentique-o, de preferência com `private_key_jwt` ou mTLS em vez de segredo compartilhado, e use PKCE também (veja Q28). Registre o tipo certo no provedor de identidade (em muitos, “aplicação web”, “SPA” e “nativa” são tipos distintos), porque é ele que decide se o `/token` exige autenticação.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O client_secret em app distribuído não é segredo",
        texto:
          "Qualquer coisa embutida em um app que o usuário instala ou que o navegador baixa pode ser extraída: descompilando o APK, lendo o JavaScript, interceptando o tráfego. Um `client_secret` ali só dá falsa sensação de segurança, e o atacante passa a se passar pelo seu app. O `client_id` é público por natureza. Alguns provedores entregam um `client_secret` até para apps nativos, por compatibilidade; ele não é confidencial, e a segurança tem de vir do PKCE.",
      },
    ],
    armadilhas: [
      "Embutir `client_secret` em SPA, app móvel ou desktop: ele sai no primeiro download, e o atacante usa a identidade do seu app.",
      "Classificar pela tecnologia (“é React, então é público”) em vez de por onde o código roda: uma SPA com BFF tem um backend que é cliente confidencial.",
      "Achar que cliente confidencial dispensa PKCE: a autenticação prova quem é o cliente; o PKCE prova que quem troca o code é quem o pediu (veja Q28).",
      "Registrar o tipo errado, como habilitar fluxos de cliente público em um app que é confidencial ou deixar o implicit ligado: o tipo registrado define o que o `/token` aceita.",
    ],
    autoteste: [
      {
        pergunta: "Qual critério separa cliente público de confidencial, e como cada um se autentica no `/token`?",
        resposta:
          "O critério é conseguir guardar um segredo. O confidencial se autentica com `client_secret`, `private_key_jwt` ou mTLS; o público só informa o `client_id` e depende do PKCE.",
      },
      {
        pergunta: "Por que um backend (cliente confidencial) também deve usar PKCE?",
        resposta:
          "Porque a autenticação do cliente não amarra o code à requisição que o pediu. O PKCE barra a injeção de um code roubado e continua protegendo mesmo se o segredo vazar.",
      },
    ],
  },
  en: {
    titulo: "Public vs confidential clients",
    pergunta:
      "What is the difference between public and confidential clients in OAuth 2.0? How does it change client authentication and the recommended flow for SPAs, mobile apps and backends?",
    porqueEsteMetodo:
      "The question is a comparison with a practical consequence: how a client is classified decides how it authenticates and which flow it uses. A matrix by application type and a decision rule make that direct.",
    resposta30s:
      "There is a single criterion: **can the client keep a secret?** A **confidential** client runs on a server you control (a web app with a backend, a service) and can authenticate at `/token` with a `client_secret`, `private_key_jwt` or mTLS. A **public** client ships its code to the user’s device (SPA, mobile app, desktop, CLI): nothing there is secret, so it uses **authorization code with PKCE** and identifies itself only by its `client_id`.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "How the client type changes the conversation with the authorization server",
        colunas: ["Aspect", "Public client", "Confidential client"],
        linhas: [
          [
            "Criterion",
            "Cannot keep a secret: the code and the device are in the user’s hands",
            "Can keep a secret: the code runs on a server you control",
          ],
          [
            "Examples",
            "SPA in the browser, mobile app, desktop app, CLI",
            "Web application with a backend, API or background service, the backend of a BFF",
          ],
          [
            "Authentication at `/token`",
            "None: only the `client_id` (method `none`)",
            "`client_secret_basic` or `client_secret_post`, `private_key_jwt` or mTLS (`tls_client_auth`)",
          ],
          [
            "Recommended flow",
            "Authorization code with PKCE (mandatory); no implicit",
            "Authorization code with PKCE (recommended); client credentials when there is no user",
          ],
          [
            "SPA",
            "Code + PKCE done in the browser; tokens are within reach of the page’s JavaScript",
            "SPA with a BFF: the backend runs the flow and keeps the tokens, and the browser only gets a session cookie",
          ],
          [
            "Mobile or desktop app",
            "Code + PKCE in the system browser (RFC 8252); tokens in the system’s secure storage (Keychain, Keystore)",
            "Not applicable: a per-installation secret is not a secret",
          ],
          [
            "Main risk",
            "A secret embedded in the app is extracted by anyone",
            "A secret leaked in a repository, log or image; no rotation",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The code exchange at /token, for both client types",
        legenda: "HTTP",
        codigo: [
          "# Public (SPA, native app): only client_id and the PKCE proof",
          "POST /token HTTP/1.1",
          "Host: auth.exemplo.com",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=authorization_code&client_id=spa-123&code=SplxlOBeZQQYbYS6WxSbIA",
          "&redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcb&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
          "",
          "# Confidential (backend): the client authenticates, and PKCE still applies",
          "POST /token HTTP/1.1",
          "Host: auth.exemplo.com",
          "Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
          "Content-Type: application/x-www-form-urlencoded",
          "",
          "grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA",
          "&redirect_uri=https%3A%2F%2Fapp.exemplo.com%2Fcb&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
        ].join("\n"),
        nota: "In the second case, the `Authorization: Basic` header carries `client_id:client_secret` in Base64: it is a secret and never goes into the repository. `private_key_jwt` and mTLS replace that shared secret with a private key or a certificate. The body lines were wrapped for readability only.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Ask **where the code runs and who controls it**, not which technology it uses. If the code is shipped to the user’s device (JavaScript in the browser, an APK, a desktop binary), everything in it is public: treat it as a **public client** and use code + PKCE. If it runs only on your server, it is **confidential**: authenticate it, preferably with `private_key_jwt` or mTLS instead of a shared secret, and use PKCE too (see Q28). Register the right type in the identity provider (in many, “web application”, “SPA” and “native” are distinct types), because that is what decides whether `/token` demands authentication.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A client_secret in a distributed app is not a secret",
        texto:
          "Anything embedded in an app the user installs or the browser downloads can be extracted: by decompiling the APK, reading the JavaScript, intercepting traffic. A `client_secret` there only gives a false sense of security, and the attacker can impersonate your app. The `client_id` is public by nature. Some providers hand out a `client_secret` even to native apps, for compatibility; it is not confidential, and the security has to come from PKCE.",
      },
    ],
    armadilhas: [
      "Embedding a `client_secret` in an SPA, mobile app or desktop app: it leaves with the first download, and the attacker uses your app’s identity.",
      "Classifying by technology (“it’s React, so it’s public”) instead of by where the code runs: an SPA with a BFF has a backend that is a confidential client.",
      "Thinking a confidential client does not need PKCE: authentication proves who the client is; PKCE proves that whoever exchanges the code is whoever asked for it (see Q28).",
      "Registering the wrong type, such as enabling public-client flows on a confidential app or leaving implicit on: the registered type defines what `/token` accepts.",
    ],
    autoteste: [
      {
        pergunta:
          "Which criterion separates public from confidential clients, and how does each authenticate at `/token`?",
        resposta:
          "The criterion is being able to keep a secret. A confidential client authenticates with a `client_secret`, `private_key_jwt` or mTLS; a public one only sends its `client_id` and relies on PKCE.",
      },
      {
        pergunta: "Why should a backend (a confidential client) use PKCE too?",
        resposta:
          "Because client authentication does not tie the code to the request that asked for it. PKCE blocks the injection of a stolen code and keeps protecting even if the secret leaks.",
      },
    ],
  },
};
