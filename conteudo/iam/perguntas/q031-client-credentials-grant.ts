import type { Pergunta } from "../../tipos";

// Q31 · Client credentials grant
export const q031: Pergunta = {
  numero: 31,
  modulo: "oauth",
  metodo: "trace",
  pt: {
    titulo: "Client credentials grant",
    pergunta:
      "Quando usar o Client Credentials Grant e como o cliente se autentica? Como funciona na comunicação entre serviços e que cuidados de segurança se aplicam?",
    porqueEsteMetodo:
      "O Client Credentials é o fluxo mais curto do OAuth, e justamente por isso os erros de segurança se acumulam em volta dele. Seguir uma chamada serviço a serviço, inclusive quando o token expira, mostra cada ponto que pede cuidado.",
    resposta30s:
      "No **Client Credentials** não há usuário: o serviço (client confidencial) se autentica no `/token` com **segredo**, **`private_key_jwt`** ou **mTLS** e recebe um access token **em nome dele mesmo**, para chamar outra API. Use-o em comunicação máquina a máquina, jobs e daemons. Cuide do **menor privilégio**, do **`aud`** restrito, do **cache até o `exp`** e da **rotação** da credencial (ou use identidade gerenciada, sem segredo), e nunca o use em SPA ou app móvel.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma chamada serviço a serviço",
        etapas: [
          "**Registro.** O serviço de faturamento é registrado no AS como client confidencial, com uma credencial (segredo, chave pública ou certificado) e as permissões que pode ter na API de clientes. Quem aprova é um administrador: não há consentimento de usuário",
          "**Cache.** Antes de chamar, o serviço procura um token válido em memória; sem token, ou perto de expirar, pede um novo",
          "**Pedido ao `/token`.** `grant_type=client_credentials` e `scope` (ou o recurso desejado), autenticando-se com segredo, `private_key_jwt` ou mTLS",
          "**O AS valida e emite.** Confere a credencial, decide quais escopos ou roles o client pode receber e emite um access token cujo sujeito é o próprio client. Em geral **não há refresh token**: o serviço tem a credencial e simplesmente pede outro",
          "**Guarda o token.** Cache em memória até pouco antes do `exp`, com uma margem para a diferença entre relógios",
          "**Chama a API.** `Authorization: Bearer <token>`; a API valida assinatura, `iss`, `aud`, `exp` e o escopo ou a role exigidos, e responde",
        ],
      },
      {
        tipo: "passos",
        titulo: "O caminho em que algo dá errado",
        passos: [
          {
            titulo: "O token expirou no meio do caminho",
            texto:
              "A API responde `401` com `invalid_token`. O serviço descarta o cache, pede **um** novo token e repete a chamada uma vez; se falhar de novo, o problema é de configuração, não de expiração.",
          },
          {
            titulo: "O `/token` recusa o client",
            texto:
              "`invalid_client`: segredo errado, expirado ou rotacionado sem atualizar o serviço (a causa mais comum). Alerte antes do vencimento e mantenha dois segredos válidos durante a troca.",
          },
          {
            titulo: "A API responde `403`",
            texto:
              "O token é válido, mas falta o escopo ou a role. Corrija a permissão concedida ao client no AS, sem ampliá-la além do necessário.",
          },
          {
            titulo: "O token vaza",
            texto:
              "Em log, dump de memória ou chamada a um destino errado. O dano é limitado por vida curta, `aud` restrito e escopo mínimo; a resposta é revogar e rotacionar a credencial.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pedir o token uma vez e reaproveitá-lo até perto do exp",
        legenda: "TypeScript",
        codigo: [
          "let cache: { token: string; expiraEm: number } | null = null;",
          "",
          "export async function tokenDeServico(): Promise<string> {",
          "  if (cache && Date.now() < cache.expiraEm - 30_000) return cache.token; // margem de 30 s",
          '  const basico = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");',
          '  const resposta = await fetch("https://auth.exemplo.com/oauth2/token", {',
          '    method: "POST",',
          '    headers: { Authorization: `Basic ${basico}`, "Content-Type": "application/x-www-form-urlencoded" },',
          '    body: new URLSearchParams({ grant_type: "client_credentials", scope: "clientes.read" }),',
          "  });",
          "  if (!resposta.ok) throw new Error(`token: HTTP ${resposta.status}`); // sem registrar o corpo",
          "  const { access_token, expires_in } = (await resposta.json()) as { access_token: string; expires_in: number };",
          "  cache = { token: access_token, expiraEm: Date.now() + expires_in * 1000 };",
          "  return access_token;",
          "}",
        ].join("\n"),
        nota: "Várias chamadas simultâneas com o cache vazio disparam várias requisições ao `/token`; guarde a promise em andamento e reutilize-a. O segredo vem de variáveis de ambiente preenchidas por um cofre, nunca do código.",
      },
      {
        tipo: "tabela",
        titulo: "Como o client prova quem é no /token",
        colunas: ["Método", "Como funciona", "Quando usar", "Cuidado"],
        linhas: [
          [
            "`client_secret_basic` ou `client_secret_post`",
            "Segredo compartilhado enviado no `/token`, no cabeçalho `Authorization: Basic` ou no corpo",
            "Simples, adequado para começar ou para exigências baixas",
            "Vaza em log, repositório ou imagem; exige rotação planejada",
          ],
          [
            "`private_key_jwt`",
            "O client assina um JWT (client assertion) com a chave privada; o AS verifica com a chave pública cadastrada",
            "Quando se quer evitar segredo compartilhado, com rotação por `kid`",
            "Guardar a chave privada em cofre ou HSM; assertion de vida curta e `jti` único",
          ],
          [
            "mTLS (`tls_client_auth`, RFC 8705)",
            "O client apresenta um certificado na conexão TLS; o token pode ficar amarrado a ele",
            "Ambientes com PKI e exigência alta de segurança",
            "Gestão e renovação de certificados; terminação de TLS em proxies",
          ],
          [
            "Identidade gerenciada ou federada",
            "A plataforma (nuvem, Kubernetes) prova a identidade da carga de trabalho e o AS emite o token, sem segredo guardado",
            "Serviços rodando na mesma nuvem ou cluster (veja Q16)",
            "Depende do fornecedor; confira a documentação (Azure e Entra ID têm guia próprio)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cuidados de segurança",
        texto:
          "(1) **Menor privilégio**: um client por serviço, com só as permissões de que precisa, e nada de um client “mestre”. (2) **Audience restrita**: o token vale para uma API, e a API confere o `aud`. (3) **Segredo em cofre**, nunca no repositório, na imagem ou no log, com **rotação** planejada; sempre que possível prefira `private_key_jwt`, mTLS ou identidade gerenciada, em que nenhuma senha é guardada. (4) **Vida curta e cache**: renove perto do `exp`, sem pedir um token a cada chamada. (5) **Escopos × roles**: sem usuário não há consentimento; em alguns provedores a permissão aparece como `scope`, em outros (como o Entra ID) como `roles` no token, ou seja, permissões de aplicativo aprovadas por um administrador. Confira a documentação do fornecedor. (6) **Nunca em SPA ou app móvel**, e nunca para agir “como o usuário”: para isso use token exchange (veja Q26 e Q36).",
      },
    ],
    armadilhas: [
      "Pedir um token novo a cada chamada: sobrecarrega o `/token`, soma latência e pode esbarrar em limites; um cache com margem resolve.",
      "Usar um client único e poderoso para todos os serviços, com escopos amplos: um vazamento compromete tudo.",
      "Usar client credentials para agir “como o usuário”, repassando o id da pessoa em um cabeçalho: a API não tem como confiar nele. Use token exchange ou propague o token do usuário.",
      "Deixar o segredo no repositório, na imagem do contêiner ou em log, sem rotação, ou registrar o access token inteiro.",
    ],
    autoteste: [
      {
        pergunta: "Quando o Client Credentials é a escolha certa e quando não é?",
        resposta:
          "É certo quando o próprio serviço é o ator (máquina a máquina, jobs, daemons). É errado quando há um usuário a identificar ou auditar, e em clients públicos como SPA e app móvel, que não guardam segredo.",
      },
      {
        pergunta: "Por que esse grant normalmente não emite refresh token?",
        resposta:
          "Porque o client já tem a credencial para pedir outro token a qualquer momento; um refresh token seria só mais um segredo de longa duração para proteger.",
      },
    ],
  },
  en: {
    titulo: "Client credentials grant",
    pergunta:
      "When should you use the Client Credentials Grant, and how does the client authenticate? How does it work for service-to-service communication, and which security precautions apply?",
    porqueEsteMetodo:
      "Client Credentials is the shortest OAuth flow, and that is exactly why security mistakes pile up around it. Following a service-to-service call, including when the token expires, shows every point that needs care.",
    resposta30s:
      "In **Client Credentials** there is no user: the service (a confidential client) authenticates at `/token` with a **secret**, **`private_key_jwt`** or **mTLS** and receives an access token **on its own behalf**, to call another API. Use it for machine-to-machine communication, jobs and daemons. Take care with **least privilege**, a narrow **`aud`**, **caching until `exp`** and **rotating** the credential (or use a managed identity, with no secret), and never use it in an SPA or mobile app.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "A service-to-service call",
        etapas: [
          "**Registration.** The billing service is registered at the AS as a confidential client, with a credential (secret, public key or certificate) and the permissions it may have on the customers API. An administrator approves: there is no user consent",
          "**Cache.** Before calling, the service looks for a valid token in memory; with none, or one about to expire, it asks for a new one",
          "**Request to `/token`.** `grant_type=client_credentials` and `scope` (or the desired resource), authenticating with a secret, `private_key_jwt` or mTLS",
          "**The AS validates and issues.** It checks the credential, decides which scopes or roles the client may receive and issues an access token whose subject is the client itself. There is usually **no refresh token**: the service holds the credential and simply asks for another",
          "**It stores the token.** In-memory cache until shortly before `exp`, with a margin for clock differences",
          "**It calls the API.** `Authorization: Bearer <token>`; the API validates signature, `iss`, `aud`, `exp` and the required scope or role, and answers",
        ],
      },
      {
        tipo: "passos",
        titulo: "The path where something goes wrong",
        passos: [
          {
            titulo: "The token expired along the way",
            texto:
              "The API answers `401` with `invalid_token`. The service discards the cache, asks for **one** new token and retries the call once; if it fails again, the problem is configuration, not expiry.",
          },
          {
            titulo: "`/token` rejects the client",
            texto:
              "`invalid_client`: wrong or expired secret, or one rotated without updating the service (the most common cause). Alert before expiry and keep two valid secrets during the swap.",
          },
          {
            titulo: "The API answers `403`",
            texto:
              "The token is valid but the scope or role is missing. Fix the permission granted to the client at the AS, without widening it beyond what is needed.",
          },
          {
            titulo: "The token leaks",
            texto:
              "In a log, a memory dump or a call to the wrong destination. The damage is limited by a short lifetime, a narrow `aud` and a minimal scope; the response is to revoke and rotate the credential.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Request the token once and reuse it until close to exp",
        legenda: "TypeScript",
        codigo: [
          "let cache: { token: string; expiresAt: number } | null = null;",
          "",
          "export async function serviceToken(): Promise<string> {",
          "  if (cache && Date.now() < cache.expiresAt - 30_000) return cache.token; // 30 s margin",
          '  const basic = Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64");',
          '  const response = await fetch("https://auth.exemplo.com/oauth2/token", {',
          '    method: "POST",',
          '    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },',
          '    body: new URLSearchParams({ grant_type: "client_credentials", scope: "clientes.read" }),',
          "  });",
          "  if (!response.ok) throw new Error(`token: HTTP ${response.status}`); // do not log the body",
          "  const { access_token, expires_in } = (await response.json()) as { access_token: string; expires_in: number };",
          "  cache = { token: access_token, expiresAt: Date.now() + expires_in * 1000 };",
          "  return access_token;",
          "}",
        ].join("\n"),
        nota: "Several simultaneous calls with an empty cache fire several requests to `/token`; keep the in-flight promise and reuse it. The secret comes from environment variables filled by a vault, never from the code.",
      },
      {
        tipo: "tabela",
        titulo: "How the client proves who it is at /token",
        colunas: ["Method", "How it works", "When to use", "Caution"],
        linhas: [
          [
            "`client_secret_basic` or `client_secret_post`",
            "A shared secret sent to `/token`, in the `Authorization: Basic` header or in the body",
            "Simple, fine to start with or for low requirements",
            "Leaks through logs, repositories or images; needs planned rotation",
          ],
          [
            "`private_key_jwt`",
            "The client signs a JWT (client assertion) with its private key; the AS verifies it with the registered public key",
            "When you want to avoid a shared secret, with rotation by `kid`",
            "Keep the private key in a vault or HSM; short-lived assertion and unique `jti`",
          ],
          [
            "mTLS (`tls_client_auth`, RFC 8705)",
            "The client presents a certificate on the TLS connection; the token can be bound to it",
            "Environments with a PKI and high security requirements",
            "Certificate management and renewal; TLS termination at proxies",
          ],
          [
            "Managed or federated identity",
            "The platform (cloud, Kubernetes) proves the workload’s identity and the AS issues the token, with no stored secret",
            "Services running in the same cloud or cluster (see Q16)",
            "Depends on the vendor; check the documentation (Azure and Entra ID have their own guide)",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Security precautions",
        texto:
          "(1) **Least privilege**: one client per service, with only the permissions it needs, and no “master” client. (2) **Narrow audience**: the token is valid for one API, and the API checks `aud`. (3) **Secret in a vault**, never in the repository, image or log, with planned **rotation**; whenever possible prefer `private_key_jwt`, mTLS or a managed identity, where no password is stored. (4) **Short life and cache**: renew near `exp`, without requesting a token on every call. (5) **Scopes vs roles**: with no user there is no consent; some providers show the permission as `scope`, others (such as Entra ID) as `roles` in the token, that is, application permissions approved by an administrator. Check the vendor documentation. (6) **Never in an SPA or mobile app**, and never to act “as the user”: for that use token exchange (see Q26 and Q36).",
      },
    ],
    armadilhas: [
      "Requesting a new token on every call: it overloads `/token`, adds latency and may hit limits; a cache with a margin fixes it.",
      "Using a single powerful client for all services, with broad scopes: one leak compromises everything.",
      "Using client credentials to act “as the user”, passing the person’s id in a header: the API cannot trust it. Use token exchange or propagate the user’s token.",
      "Leaving the secret in the repository, the container image or a log, without rotation, or logging the whole access token.",
    ],
    autoteste: [
      {
        pergunta: "When is Client Credentials the right choice, and when is it not?",
        resposta:
          "It is right when the service itself is the actor (machine to machine, jobs, daemons). It is wrong when there is a user to identify or audit, and in public clients such as SPAs and mobile apps, which cannot keep a secret.",
      },
      {
        pergunta: "Why does this grant normally not issue a refresh token?",
        resposta:
          "Because the client already holds the credential to ask for another token at any time; a refresh token would just be one more long-lived secret to protect.",
      },
    ],
  },
};
