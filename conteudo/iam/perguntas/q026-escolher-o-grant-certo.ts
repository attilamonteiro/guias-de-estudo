import type { Pergunta } from "../../tipos";

// Q26 · Escolher o grant certo
export const q026: Pergunta = {
  numero: 26,
  modulo: "oauth",
  metodo: "compare",
  pt: {
    titulo: "Escolher o grant certo",
    pergunta:
      "Quais grant types o OAuth 2.0 oferece e como você escolhe o certo para web com backend, SPA, app móvel, TV, chamadas serviço a serviço e acesso em nome do usuário?",
    porqueEsteMetodo:
      "Escolher o grant depende do tipo de cliente e de haver ou não um usuário. Uma tabela de decisão por cenário e uma sequência de perguntas respondem isso sem decoreba.",
    resposta30s:
      "Um **grant type** é a forma como o client obtém um access token, e cada um tem um perfil de segurança diferente. O padrão para qualquer app com usuário (web, SPA, móvel) é **authorization code com PKCE**; **device** serve a TV e CLI sem navegador, **client credentials** a chamadas serviço a serviço, **token exchange** (ou on-behalf-of) a agir em nome do usuário e **refresh token** a renovar. **Implicit** e **password** são legados e não devem ser usados.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Cenário → grant",
        colunas: ["Cenário", "Grant type", "Tipo de cliente", "Cuidado principal"],
        linhas: [
          [
            "Web com backend",
            "`authorization_code` + PKCE",
            "Confidencial",
            "Autenticar o cliente (de preferência `private_key_jwt` ou mTLS) e validar o `state`",
          ],
          [
            "SPA",
            "`authorization_code` + PKCE (ou BFF)",
            "Público (ou o backend do BFF, confidencial)",
            "Tokens ao alcance do JavaScript: vida curta, refresh com rotação, CSP; considere o BFF (veja Q80)",
          ],
          [
            "App móvel ou desktop",
            "`authorization_code` + PKCE no navegador do sistema",
            "Público",
            "Nada de WebView embutida para o login; tokens no armazenamento seguro do sistema",
          ],
          [
            "TV, CLI ou IoT sem navegador",
            "`urn:ietf:params:oauth:grant-type:device_code`",
            "Público",
            "Phishing do código de usuário (veja Q32)",
          ],
          [
            "Serviço a serviço, sem usuário",
            "`client_credentials`",
            "Confidencial",
            "Menor privilégio, `aud` restrito, segredo em cofre (veja Q31)",
          ],
          [
            "Serviço agindo em nome do usuário",
            "Token exchange (`urn:ietf:params:oauth:grant-type:token-exchange`) ou o on-behalf-of do provedor",
            "Confidencial",
            "Reduzir `aud` e escopo na troca; não repassar o token recebido (veja Q36)",
          ],
          [
            "Renovar o acesso sem novo login",
            "`refresh_token`",
            "Quem recebeu um",
            "Rotação e revogação do refresh token; no OIDC, pede-se `offline_access` (veja Q34)",
          ],
          [
            "Legados",
            "`implicit` e `password`",
            "Não use",
            "Troque por code + PKCE, device ou client credentials (veja Q33)",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "As perguntas que guiam a escolha",
        etapas: [
          "**Há um usuário envolvido?** Não: é `client_credentials`. Sim: siga adiante",
          "**O dispositivo tem (ou consegue abrir) um navegador, com a pessoa diante dele?** Sim: `authorization_code` com PKCE. Não, como uma TV ou uma CLI em servidor remoto: `device_code`",
          "**Um serviço já recebeu o token do usuário e precisa chamar outra API em nome dele?** Sim: token exchange (ou on-behalf-of), nunca repassar o mesmo token",
          "**O cliente guarda segredo?** Isso não muda o grant, muda a autenticação no `/token`: o confidencial se autentica (segredo, `private_key_jwt`, mTLS); o público não, e depende do PKCE",
          "**Precisa renovar sem pedir login de novo?** Use `refresh_token`, com rotação em cliente público; ele nunca é a primeira forma de obter um token",
        ],
        nota: "Se a pergunta é “qual grant uso para uma pessoa entrar no meu app?”, a resposta começa por code + PKCE, sem exceção.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece por **há usuário?** e **há navegador?**; o restante é detalhe do tipo de cliente. Sem usuário: `client_credentials`. Com usuário e navegador: `authorization_code` + PKCE. Com usuário e sem navegador: `device_code`. Agir em nome do usuário: token exchange. Na dúvida, authorization code + PKCE. Entender o grant importa porque ele decide **por onde cada credencial trafega** (o navegador ou uma conexão direta) e **quem se autentica** (a pessoa, o cliente ou os dois).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os erros de escolha mais comuns",
        texto:
          "Usar `password` porque “é mais simples”: expõe a senha ao cliente e quebra MFA e federação. Usar `implicit` em SPA por hábito: o token trafega na URL. Usar `client_credentials` em um app com usuário e mandar o id da pessoa em um cabeçalho: a API não consegue provar quem é o usuário (use token exchange ou propague o token dele). Usar `device_code` onde há navegador: abre a porta ao phishing do código sem necessidade. Pôr `client_credentials` em SPA ou app móvel: não há segredo para guardar. E pedir escopos amplos “para não ter de pedir de novo”.",
      },
    ],
    armadilhas: [
      "Usar `client_credentials` quando existe um usuário, perdendo a identidade e a auditoria por pessoa.",
      "Ligar `password` ou `implicit` “só para este caso”: são os grants que as boas práticas atuais (RFC 9700) mandam abandonar.",
      "Achar que o tipo de cliente é o grant: público e confidencial usam o mesmo `authorization_code`, e muda a autenticação no `/token`.",
      "Esquecer que o refresh token é uma segunda credencial de longa duração: sem rotação e sem revogação, um roubo vale por muito tempo.",
    ],
    autoteste: [
      {
        pergunta: "Que grant usar para um app de TV e que grant usar para duas APIs internas conversando?",
        resposta: "TV sem navegador: device authorization grant. Duas APIs sem usuário: client credentials.",
      },
      {
        pergunta: "Um serviço recebeu o token do usuário e precisa chamar outra API em nome dele. O que ele faz?",
        resposta:
          "Troca o token do usuário por um novo, com `aud` e escopo da segunda API (token exchange, ou on-behalf-of no provedor), em vez de repassar o token original.",
      },
    ],
  },
  en: {
    titulo: "Choosing the right grant",
    pergunta:
      "Which grant types does OAuth 2.0 offer, and how do you choose the right one for server-side web apps, SPAs, mobile apps, TVs, service-to-service calls and acting on behalf of a user?",
    porqueEsteMetodo:
      "Choosing the grant depends on the client type and on whether a user is involved. A decision table by scenario and a sequence of questions answer that without memorizing.",
    resposta30s:
      "A **grant type** is how the client obtains an access token, and each one has a different security profile. The default for any app with a user (web, SPA, mobile) is **authorization code with PKCE**; **device** serves TVs and CLIs without a browser, **client credentials** serves service-to-service calls, **token exchange** (or on-behalf-of) serves acting on behalf of a user and **refresh token** serves renewal. **Implicit** and **password** are legacy and should not be used.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Scenario → grant",
        colunas: ["Scenario", "Grant type", "Client type", "Main precaution"],
        linhas: [
          [
            "Web app with a backend",
            "`authorization_code` + PKCE",
            "Confidential",
            "Authenticate the client (preferably `private_key_jwt` or mTLS) and validate `state`",
          ],
          [
            "SPA",
            "`authorization_code` + PKCE (or a BFF)",
            "Public (or the BFF backend, confidential)",
            "Tokens within reach of JavaScript: short lifetime, refresh with rotation, CSP; consider the BFF (see Q80)",
          ],
          [
            "Mobile or desktop app",
            "`authorization_code` + PKCE in the system browser",
            "Public",
            "No embedded WebView for login; tokens in the system’s secure storage",
          ],
          [
            "TV, CLI or IoT without a browser",
            "`urn:ietf:params:oauth:grant-type:device_code`",
            "Public",
            "User-code phishing (see Q32)",
          ],
          [
            "Service to service, no user",
            "`client_credentials`",
            "Confidential",
            "Least privilege, narrow `aud`, secret in a vault (see Q31)",
          ],
          [
            "Service acting on behalf of the user",
            "Token exchange (`urn:ietf:params:oauth:grant-type:token-exchange`) or the provider’s on-behalf-of",
            "Confidential",
            "Narrow `aud` and scope in the exchange; do not forward the token you received (see Q36)",
          ],
          [
            "Renewing access without a new login",
            "`refresh_token`",
            "Whoever received one",
            "Refresh token rotation and revocation; in OIDC you ask for `offline_access` (see Q34)",
          ],
          [
            "Legacy",
            "`implicit` and `password`",
            "Do not use",
            "Replace with code + PKCE, device or client credentials (see Q33)",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "The questions that guide the choice",
        etapas: [
          "**Is a user involved?** No: it is `client_credentials`. Yes: keep going",
          "**Does the device have (or can it open) a browser, with the person in front of it?** Yes: `authorization_code` with PKCE. No, like a TV or a CLI on a remote server: `device_code`",
          "**Has a service already received the user’s token and must it call another API on their behalf?** Yes: token exchange (or on-behalf-of), never forward the same token",
          "**Can the client keep a secret?** That does not change the grant, it changes authentication at `/token`: a confidential client authenticates (secret, `private_key_jwt`, mTLS); a public one does not, and relies on PKCE",
          "**Need to renew without asking for a new login?** Use `refresh_token`, with rotation for public clients; it is never the first way to obtain a token",
        ],
        nota: "If the question is “which grant do I use for a person to sign in to my app?”, the answer starts with code + PKCE, without exception.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start with **is there a user?** and **is there a browser?**; the rest is a detail of the client type. No user: `client_credentials`. User and browser: `authorization_code` + PKCE. User and no browser: `device_code`. Acting on behalf of the user: token exchange. When in doubt, authorization code + PKCE. Understanding the grant matters because it decides **where each credential travels** (the browser or a direct connection) and **who authenticates** (the person, the client or both).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The most common choice mistakes",
        texto:
          "Using `password` because “it’s simpler”: it exposes the password to the client and breaks MFA and federation. Using `implicit` in an SPA out of habit: the token travels in the URL. Using `client_credentials` in an app with a user and sending the person’s id in a header: the API cannot prove who the user is (use token exchange or propagate the user’s token). Using `device_code` where a browser exists: it opens the door to code phishing for no reason. Putting `client_credentials` in an SPA or mobile app: there is no secret to keep. And asking for broad scopes “so we never have to ask again”.",
      },
    ],
    armadilhas: [
      "Using `client_credentials` when a user exists, losing the per-person identity and audit trail.",
      "Turning on `password` or `implicit` “just for this case”: they are the grants current best practices (RFC 9700) tell you to abandon.",
      "Thinking the client type is the grant: public and confidential clients use the same `authorization_code`, and what changes is authentication at `/token`.",
      "Forgetting that the refresh token is a second, long-lived credential: without rotation and revocation, a theft is worth a lot for a long time.",
    ],
    autoteste: [
      {
        pergunta: "Which grant do you use for a TV app, and which for two internal APIs talking to each other?",
        resposta: "A TV without a browser: the device authorization grant. Two APIs with no user: client credentials.",
      },
      {
        pergunta: "A service received the user’s token and must call another API on their behalf. What does it do?",
        resposta:
          "It exchanges the user’s token for a new one, with the `aud` and scope of the second API (token exchange, or the provider’s on-behalf-of), instead of forwarding the original token.",
      },
    ],
  },
};
