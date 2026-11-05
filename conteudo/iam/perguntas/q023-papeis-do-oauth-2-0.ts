import type { Pergunta } from "../../tipos";

// Q23 · Papéis do OAuth 2.0
export const q023: Pergunta = {
  numero: 23,
  modulo: "oauth",
  metodo: "feynman",
  pt: {
    titulo: "Papéis do OAuth 2.0",
    pergunta:
      "Quais são os quatro papéis do OAuth 2.0 (resource owner, client, authorization server e resource server) e como interagem em um acesso típico?",
    porqueEsteMetodo:
      "Os quatro nomes são abstratos e se confundem com “usuário”, “aplicativo” e “servidor”. Uma analogia do dia a dia fixa quem faz o quê; depois mapeamos para o mecanismo real e vemos onde a imagem deixa de valer.",
    resposta30s:
      "O OAuth 2.0 separa um acesso em quatro papéis: o **resource owner** (dono dos dados, que concede o acesso, em geral a pessoa), o **client** (o aplicativo que quer acessar), o **authorization server** (autentica o dono, colhe o consentimento e **emite os tokens**) e o **resource server** (a API que guarda os dados e **aceita os tokens**). O client nunca recebe a senha do dono: recebe um **access token** limitado, que a API valida a cada chamada.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Você chega a um hotel e entrega o carro ao manobrista. Em vez da chave mestra, o manobrista recebe uma **chave de manobrista**: ela liga o carro e anda alguns metros, mas não abre o porta-malas nem o porta-luvas. A chave sai da recepção, que guarda as chaves e só entrega uma com o seu aval. O carro, por sua vez, não pergunta quem é o manobrista nem o que você combinou: confere apenas se a chave é legítima e o que ela permite.",
        tecnico:
          "Os papéis vêm da RFC 6749. O **resource owner** pode conceder acesso a um recurso protegido e costuma ser o usuário final (você, no hotel). O **client** é a aplicação que pede acesso em nome do dono (o manobrista): web, SPA, app móvel ou um serviço. O **authorization server** (AS) autentica o dono, mostra o consentimento e emite os tokens (a recepção); entre outros, expõe o endpoint `authorize`, alcançado pelo navegador, e o endpoint `token`, chamado direto pelo client. O **resource server** (RS) é a API que guarda os dados e só atende chamadas com um access token válido (o carro). Produtos de identidade (Entra ID, Okta, Auth0, Keycloak) mostram os mesmos quatro papéis com outros nomes; confira a documentação do fornecedor.",
        limite:
          "A imagem para de valer em três pontos. Primeiro, o OAuth 2.0 não define como o RS descobre se o token é bom: ele pode validar a assinatura de um JWT localmente ou consultar o AS (introspecção, RFC 7662; veja Q35). Segundo, um token tem **prazo, escopo e destinatário (`aud`)** e pode ser revogado, o que uma chave física não tem. Terceiro, existe o **navegador**, que não é um dos quatro papéis, mas é por onde o dono conversa com o AS.",
      },
      {
        tipo: "fluxo",
        titulo: "Um acesso típico, do pedido à resposta da API",
        etapas: [
          "**Front channel (navegador).** O client redireciona o navegador do dono ao endpoint `authorize` do AS, informando `client_id`, `redirect_uri`, `scope` e `state`",
          "**Front channel.** O AS autentica o dono (senha, MFA, SSO) e mostra o consentimento: o client nunca vê a senha",
          "**Front channel.** Com o aval do dono, o AS devolve o navegador ao client com um código de autorização de uso único, na `redirect_uri` registrada",
          "**Back channel (direto).** O client chama o endpoint `token` do AS, entrega o código e prova quem é; o AS responde com o **access token** (e, conforme o caso, refresh token e ID token)",
          "**Back channel.** O client chama a API com `Authorization: Bearer <access token>`",
          "O RS valida o token (emissor, `aud`, validade e escopo) e responde com os dados; token inválido volta como `401`, escopo insuficiente como `403`",
        ],
        nota: "Front channel é tudo o que passa pelo navegador, visível a quem controla o dispositivo. Back channel é a conexão direta entre servidores (ou entre o app e o AS), por TLS, sem passar pela barra de endereço. O detalhe de cada passo está em Q27.",
      },
      {
        tipo: "tabela",
        titulo: "Quem é quem no mundo real",
        colunas: ["Papel", "Quem costuma ser", "O que faz", "Exemplo"],
        linhas: [
          [
            "Resource owner",
            "A pessoa dona dos dados (ou uma organização)",
            "Autentica-se no AS e concede ou nega o acesso",
            "Ana, que autoriza um app de finanças a ler as faturas dela",
          ],
          [
            "Client",
            "O aplicativo: web, SPA, móvel ou um serviço",
            "Pede o acesso, guarda os tokens e chama a API",
            "O app de finanças",
          ],
          [
            "Authorization server",
            "O serviço de identidade que emite tokens (em alguns ecossistemas, chamado de STS, security token service)",
            "Autentica, colhe o consentimento e emite tokens nos endpoints `authorize` e `token`",
            "Entra ID, Okta, Auth0, Keycloak",
          ],
          [
            "Resource server",
            "A API que guarda os dados",
            "Valida o access token em cada chamada e decide se atende",
            "A API de faturas do banco",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Papel não é produto",
        texto:
          "Os papéis são **funções em uma conversa**, não programas. O mesmo produto pode exercer dois deles ao mesmo tempo: uma API de pedidos é **resource server** para o app que a chama e vira **client** quando chama a API de estoque (com credenciais próprias ou em nome do usuário, veja Q26). Em sistemas pequenos, AS e RS podem rodar no mesmo processo; em empresas, o AS costuma ser um serviço central compartilhado por muitas APIs. O **navegador** (user agent) não é um papel: é o canal por onde o dono fala com o AS. E o **dono do recurso não é o client**: quem pede é o aplicativo, quem decide é a pessoa.",
      },
    ],
    armadilhas: [
      "Confundir resource owner com client: o dono é quem concede o acesso (a pessoa); o client é o aplicativo que pede. O navegador também não é nenhum dos dois.",
      "Achar que o client vê a senha do usuário: no OAuth a senha é digitada só no authorization server, e o client recebe apenas tokens.",
      "Tratar AS e RS como a mesma coisa e deixar a API aceitar qualquer token: o RS precisa validar emissor, `aud`, validade e escopo (veja Q30).",
      "Dizer que “o OAuth autentica o usuário”: o access token é um recurso do RS, não uma prova de login (veja Q24).",
    ],
    autoteste: [
      {
        pergunta: "Quem emite o access token e quem o aceita? Um mesmo serviço pode exercer mais de um papel?",
        resposta:
          "O authorization server emite; o resource server (a API) aceita e valida. Sim: uma API de pedidos é resource server para quem a chama e client quando chama a API de estoque.",
      },
      {
        pergunta: "O que viaja pelo navegador e o que vai direto entre client e servidor?",
        resposta:
          "Pelo navegador (front channel) vão os redirecionamentos: o pedido de autorização e o código na volta. Direto (back channel) vão a troca do código por tokens no endpoint `token` e as chamadas à API com o access token.",
      },
    ],
  },
  en: {
    titulo: "OAuth 2.0 roles",
    pergunta:
      "What are the four OAuth 2.0 roles (resource owner, client, authorization server and resource server), and how do they interact in a typical access?",
    porqueEsteMetodo:
      "The four names are abstract and easy to confuse with “user”, “app” and “server”. An everyday analogy fixes who does what; then we map it to the real mechanism and see where the picture stops holding.",
    resposta30s:
      "OAuth 2.0 splits an access into four roles: the **resource owner** (who owns the data and grants access, usually the person), the **client** (the app that wants access), the **authorization server** (authenticates the owner, collects consent and **issues the tokens**) and the **resource server** (the API that holds the data and **accepts the tokens**). The client never sees the owner’s password: it receives a limited **access token**, which the API validates on every call.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "You arrive at a hotel and hand your car to the valet. Instead of your master key, the valet gets a **valet key**: it starts the car and drives a few meters, but it does not open the trunk or the glove box. The key comes from the front desk, which keeps the keys and only hands one out with your approval. The car, for its part, does not ask who the valet is or what you agreed: it only checks that the key is genuine and what it allows.",
        tecnico:
          "The roles come from RFC 6749. The **resource owner** can grant access to a protected resource and is usually the end user (you, at the hotel). The **client** is the application that asks for access on the owner’s behalf (the valet): a web app, an SPA, a mobile app or a service. The **authorization server** (AS) authenticates the owner, shows the consent screen and issues tokens (the front desk); among other endpoints it exposes `authorize`, reached through the browser, and `token`, called directly by the client. The **resource server** (RS) is the API that holds the data and only serves calls that carry a valid access token (the car). Identity products (Entra ID, Okta, Auth0, Keycloak) show the same four roles under other names; check the vendor documentation.",
        limite:
          "The picture stops holding in three places. First, OAuth 2.0 does not define how the RS finds out whether a token is good: it may validate a JWT’s signature locally or ask the AS (introspection, RFC 7662; see Q35). Second, a token has an **expiry, a scope and an audience (`aud`)** and can be revoked, which a physical key does not. Third, there is the **browser**, which is not one of the four roles but is the channel through which the owner talks to the AS.",
      },
      {
        tipo: "fluxo",
        titulo: "A typical access, from request to API response",
        etapas: [
          "**Front channel (browser).** The client redirects the owner’s browser to the AS `authorize` endpoint, sending `client_id`, `redirect_uri`, `scope` and `state`",
          "**Front channel.** The AS authenticates the owner (password, MFA, SSO) and shows the consent screen: the client never sees the password",
          "**Front channel.** With the owner’s approval, the AS sends the browser back to the client with a single-use authorization code, at the registered `redirect_uri`",
          "**Back channel (direct).** The client calls the AS `token` endpoint, hands over the code and proves who it is; the AS answers with the **access token** (and, depending on the case, a refresh token and an ID token)",
          "**Back channel.** The client calls the API with `Authorization: Bearer <access token>`",
          "The RS validates the token (issuer, `aud`, expiry and scope) and answers with the data; an invalid token comes back as `401`, an insufficient scope as `403`",
        ],
        nota: "Front channel is everything that goes through the browser, visible to whoever controls the device. Back channel is the direct connection between servers (or between the app and the AS), over TLS, never through the address bar. Each step is detailed in Q27.",
      },
      {
        tipo: "tabela",
        titulo: "Who is who in the real world",
        colunas: ["Role", "Who it usually is", "What it does", "Example"],
        linhas: [
          [
            "Resource owner",
            "The person who owns the data (or an organization)",
            "Authenticates at the AS and grants or denies access",
            "Ana, who lets a finance app read her invoices",
          ],
          [
            "Client",
            "The application: web, SPA, mobile or a service",
            "Asks for access, stores the tokens and calls the API",
            "The finance app",
          ],
          [
            "Authorization server",
            "The identity service that issues tokens (in some ecosystems called an STS, security token service)",
            "Authenticates, collects consent and issues tokens at the `authorize` and `token` endpoints",
            "Entra ID, Okta, Auth0, Keycloak",
          ],
          [
            "Resource server",
            "The API that holds the data",
            "Validates the access token on every call and decides whether to serve it",
            "The bank’s invoices API",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A role is not a product",
        texto:
          "Roles are **functions in a conversation**, not programs. One product can play two of them at once: an orders API is a **resource server** for the app that calls it and becomes a **client** when it calls the inventory API (with its own credentials or on the user’s behalf, see Q26). In small systems the AS and the RS may run in the same process; in companies the AS is usually a central service shared by many APIs. The **browser** (user agent) is not a role: it is the channel through which the owner talks to the AS. And the **resource owner is not the client**: the app asks, the person decides.",
      },
    ],
    armadilhas: [
      "Confusing the resource owner with the client: the owner is who grants access (the person); the client is the application that asks. The browser is neither of them.",
      "Thinking the client sees the user’s password: in OAuth the password is typed only at the authorization server, and the client receives only tokens.",
      "Treating the AS and the RS as the same thing and letting the API accept any token: the RS must validate issuer, `aud`, expiry and scope (see Q30).",
      "Saying “OAuth authenticates the user”: the access token is a resource-server credential, not proof of login (see Q24).",
    ],
    autoteste: [
      {
        pergunta: "Who issues the access token and who accepts it? Can one service play more than one role?",
        resposta:
          "The authorization server issues it; the resource server (the API) accepts and validates it. Yes: an orders API is a resource server for whoever calls it and a client when it calls the inventory API.",
      },
      {
        pergunta: "What travels through the browser and what goes directly between client and server?",
        resposta:
          "The redirects go through the browser (front channel): the authorization request and the code on the way back. The exchange of the code for tokens at the `token` endpoint and the API calls carrying the access token go directly (back channel).",
      },
    ],
  },
};
