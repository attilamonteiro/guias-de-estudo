import type { Pergunta } from "../../tipos";

// Q30 · Escopos e consentimento
export const q030: Pergunta = {
  numero: 30,
  modulo: "oauth",
  metodo: "feynman",
  pt: {
    titulo: "Escopos e consentimento",
    pergunta:
      "Como funcionam escopos e consentimento no OAuth 2.0? Como você desenha escopos, e por que o escopo concedido não equivale à permissão do usuário no sistema?",
    porqueEsteMetodo:
      "Escopo é fácil de usar e fácil de usar errado. Uma analogia de chaveiro com etiquetas fixa a ideia de “o que o aplicativo pode pedir”, e o ponto em que ela quebra é justamente a diferença entre escopo e permissão do usuário.",
    resposta30s:
      "O client **pede** escopos no `/authorize`, o servidor mostra o **consentimento** e o token carrega só o que foi **concedido**, que pode ser menos que o pedido. Desenhe escopos pequenos, por capacidade e com menor privilégio, mas lembre que escopo não é permissão do usuário: ele limita **o que o aplicativo pode fazer em nome da pessoa**, e a API ainda decide pelo **direito real** do usuário, de modo que o acesso efetivo é a interseção dos dois.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Você contrata um prestador e entrega a ele um chaveiro com **etiquetas**: “garagem”, “sala”, “cofre”. A recepção do prédio mostra a você a lista do que o prestador pediu e você marca o que autoriza: garagem e sala, cofre não. O chaveiro que ele recebe tem só as chaves aprovadas, e ele não consegue aumentar a própria lista. Mas ter a chave da sala não significa que o porteiro o deixe entrar na sua: o porteiro ainda confere se aquele andar é seu e se há regras para hoje.",
        tecnico:
          "As etiquetas são os **escopos**: strings que nomeiam uma capacidade (`faturas.read`). O client os pede no parâmetro `scope` (lista separada por espaços); o authorization server confere o que aquele client **pode** pedir, mostra uma tela de **consentimento** com descrições legíveis e registra a decisão. O token emitido carrega o escopo **concedido**, que pode ser menor que o pedido, e a resposta do `/token` informa o `scope` quando ele difere. O chaveiro é o access token; o porteiro é o **resource server**, que exige o escopo certo para cada operação e depois aplica a **autorização real**: papéis, propriedade do recurso, regras de negócio. No OpenID Connect, `openid`, `profile` e `email` são escopos de identidade, e `offline_access` pede um refresh token (veja Q46).",
        limite:
          "A analogia falha num ponto: uma chave abre a porta, mas um escopo não concede direito nenhum. Ele é um **teto para o aplicativo**, não um direito da pessoa. O escopo `faturas.read` diz que **este aplicativo** pode ler faturas em nome do usuário; não diz que o usuário pode ler **a fatura de outra pessoa**. O acesso efetivo é a **interseção**: escopo do token ∩ permissão real do usuário ∩ regras da API. Um administrador que autoriza só `faturas.read` em um aplicativo não dá a ele poderes de administrador; e um escopo amplo não dá a um usuário comum direitos que ele não tem.",
      },
      {
        tipo: "fluxo",
        titulo: "Do pedido ao acesso: onde cada decisão acontece",
        etapas: [
          "**O client pede.** No `/authorize`, `scope=openid faturas.read faturas.write`, uma lista separada por espaços. O AS só aceita escopos registrados para aquele client",
          "**O AS mostra o consentimento.** A tela lista, em linguagem clara, o que o aplicativo quer; o consentimento pode ser reaproveitado se a pessoa já o deu, dispensado para aplicativos próprios pré-autorizados ou dado pelo administrador para toda a organização",
          "**A pessoa (ou o administrador) decide.** Pode aprovar tudo, parte ou nada, e o AS pode conceder menos por política",
          "**O token carrega o concedido.** O `scope` (ou `scp`, conforme o provedor) vai no token e na resposta do `/token`, que o informa quando difere do pedido. O client deve ler o que voltou, não supor o que pediu",
          "**A API decide.** Valida o token, exige o escopo da operação (sem ele: `403` com `insufficient_scope`) e, **depois**, confere o direito real do usuário sobre o recurso",
        ],
        nota: "Revogar o consentimento (ou o refresh token) encerra o acesso futuro; o access token já emitido vale até expirar, a menos que a API consulte o AS (veja Q35).",
      },
      {
        tipo: "tabela",
        titulo: "Como desenhar escopos",
        colunas: ["Decisão", "Faça", "Evite"],
        linhas: [
          [
            "Granularidade",
            "Um escopo por capacidade de negócio e por ação (`faturas.read`, `faturas.write`), com leitura e escrita separadas",
            "Um escopo gigante (`admin`, `*`) ou um escopo por endpoint, que ninguém entende na tela de consentimento",
          ],
          [
            "Nome e dono",
            "Nomes estáveis, prefixados pelo recurso ou pelo `audience` da API, e documentados",
            "Renomear um escopo já concedido ou reutilizar o mesmo nome para APIs diferentes",
          ],
          [
            "Primeira × terceira parte",
            "Terceiros: consentimento explícito do usuário, com descrição clara. Aplicativos do próprio produto: podem ser pré-autorizados, mas continuam pedindo o mínimo",
            "Dar a um aplicativo de terceiros escopos que só os seus deveriam ter",
          ],
          [
            "Quem consente",
            "Escopos sensíveis ou que alcançam dados de outras pessoas: consentimento do administrador, que vale para toda a organização (como nos provedores corporativos)",
            "Deixar um usuário comum aprovar sozinho um acesso amplo a dados da empresa",
          ],
          [
            "Quando pedir",
            "Consentimento incremental: o mínimo no login, e o resto quando a funcionalidade for usada",
            "Pedir tudo de uma vez “por precaução”",
          ],
          [
            "Papéis e dados",
            "Papéis e permissões do usuário ficam no resource server (RBAC, ABAC; veja Q108)",
            "Codificar papéis ou ids de registros nos escopos (`fatura:123:edit`)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A API confere o escopo do aplicativo e o direito do usuário",
        legenda: "TypeScript",
        codigo: [
          'import { createRemoteJWKSet, jwtVerify } from "jose";',
          "",
          'const jwks = createRemoteJWKSet(new URL("https://auth.exemplo.com/.well-known/jwks.json"));',
          "",
          "export async function podeLerFatura(token: string, fatura: { donoId: string }) {",
          "  const { payload } = await jwtVerify(token, jwks, {",
          '    issuer: "https://auth.exemplo.com",',
          '    audience: "https://api.exemplo.com",',
          '    algorithms: ["RS256"], // algoritmo fixo, nunca o que o token declarar',
          "  });",
          '  const escopos = String(payload.scope ?? "").split(" ");',
          '  const aplicativoPode = escopos.includes("faturas.read"); // teto do APLICATIVO',
          "  const usuarioPode = fatura.donoId === payload.sub; // direito da PESSOA sobre este recurso",
          "  return aplicativoPode && usuarioPode;",
          "}",
        ].join("\n"),
        nota: "O escopo responde “este aplicativo pode fazer isso?”; a checagem do dono responde “esta pessoa pode ver este recurso?”. Faltando a segunda, qualquer usuário autenticado alcança dados alheios trocando um id na URL.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Acesso efetivo = interseção",
        texto:
          "Pense em três camadas, todas necessárias: (1) o que o **client** pode pedir (registrado no AS), (2) o que a **pessoa** consentiu (o escopo concedido) e (3) o que a **pessoa** tem direito de fazer no sistema (papéis, propriedade, regras). O token atesta só as duas primeiras. A terceira vive na API (ou em um serviço de autorização), nunca no escopo. Por isso não codifique papéis nem ids de registros em escopos, e não deixe a API aceitar qualquer token que traga o escopo certo. O consentimento existe por transparência e controle: a pessoa vê o que está liberando, pode revogar, e há registro da decisão.",
      },
    ],
    armadilhas: [
      "Supor que o token tem tudo o que foi pedido: o usuário ou a política pode ter concedido menos; leia o `scope` da resposta.",
      "Tratar o escopo como permissão do usuário e checar só ele na API: qualquer usuário autenticado acessa dados de outros (falha de autorização por objeto).",
      "Criar escopos gigantes (`admin`, `*`) “para não pedir de novo”, ou um escopo por endpoint: o primeiro viola o menor privilégio e o segundo ninguém entende na tela de consentimento.",
      "Confundir escopos de identidade do OpenID Connect (`profile`, `email`) com escopos de API, ou achar que o consentimento é eterno: ele pode ser revogado.",
    ],
    autoteste: [
      {
        pergunta: "Se o token tem o escopo `faturas.read`, o usuário pode ler qualquer fatura? Por quê?",
        resposta:
          "Não. O escopo diz o que o aplicativo pode fazer em nome da pessoa; a API ainda confere o direito do usuário sobre aquela fatura (propriedade, papel, regra de negócio). O acesso efetivo é a interseção.",
      },
      {
        pergunta: "O que é consentimento incremental, e quando o administrador precisa consentir?",
        resposta:
          "Incremental: pedir só o mínimo no login e solicitar escopos extras quando a funcionalidade for usada. O consentimento do administrador vale para toda a organização e é exigido por provedores corporativos para escopos sensíveis ou que alcançam dados de outros usuários.",
      },
    ],
  },
  en: {
    titulo: "Scopes and consent",
    pergunta:
      "How do scopes and consent work in OAuth 2.0? How do you design scopes, and why is a granted scope not the same as the user’s permission in the system?",
    porqueEsteMetodo:
      "Scopes are easy to use and easy to use wrong. A key-ring-with-labels analogy fixes the idea of “what the app may ask for”, and the point where it breaks is exactly the difference between a scope and the user’s permission.",
    resposta30s:
      "The client **asks for** scopes at `/authorize`, the server shows the **consent** screen and the token carries only what was **granted**, which may be less than requested. Design small scopes, by capability and with least privilege, but remember that a scope is not the user’s permission: it limits **what the app may do on the person’s behalf**, and the API still decides by the user’s **real rights**, so effective access is the intersection of the two.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "You hire a contractor and hand them a key ring with **labels**: “garage”, “living room”, “safe”. The building’s front desk shows you the list of what the contractor asked for and you tick what you allow: garage and living room, not the safe. The key ring they receive has only the approved keys, and they cannot extend their own list. But having the living-room key does not mean the doorman lets them into yours: the doorman still checks that the floor is yours and whether there are rules for today.",
        tecnico:
          "The labels are the **scopes**: strings that name a capability (`faturas.read`). The client asks for them in the `scope` parameter (a space-separated list); the authorization server checks what that client **may** ask for, shows a **consent** screen with readable descriptions and records the decision. The issued token carries the **granted** scope, which may be smaller than requested, and the `/token` response reports the `scope` when it differs. The key ring is the access token; the doorman is the **resource server**, which demands the right scope for each operation and then applies the **real authorization**: roles, resource ownership, business rules. In OpenID Connect, `openid`, `profile` and `email` are identity scopes, and `offline_access` asks for a refresh token (see Q46).",
        limite:
          "The analogy fails on one point: a key opens the door, but a scope grants no right at all. It is a **ceiling for the application**, not a right of the person. The `faturas.read` scope says that **this application** may read invoices on the user’s behalf; it does not say the user may read **someone else’s invoice**. Effective access is the **intersection**: token scope ∩ the user’s real permission ∩ the API’s rules. An administrator who authorizes only `faturas.read` in an app does not hand it administrator powers; and a broad scope does not give an ordinary user rights they do not have.",
      },
      {
        tipo: "fluxo",
        titulo: "From request to access: where each decision happens",
        etapas: [
          "**The client asks.** At `/authorize`, `scope=openid faturas.read faturas.write`, a space-separated list. The AS only accepts scopes registered for that client",
          "**The AS shows consent.** The screen lists in plain language what the application wants; consent may be reused if the person already gave it, waived for pre-authorized first-party apps or given by the administrator for the whole organization",
          "**The person (or the administrator) decides.** They can approve everything, part or nothing, and the AS may grant less by policy",
          "**The token carries what was granted.** The `scope` (or `scp`, depending on the provider) goes in the token and in the `/token` response, which reports it when it differs from the request. The client must read what came back, not assume what it asked for",
          "**The API decides.** It validates the token, requires the scope for the operation (without it: `403` with `insufficient_scope`) and, **then**, checks the user’s real right over the resource",
        ],
        nota: "Revoking consent (or the refresh token) ends future access; an access token already issued is valid until it expires, unless the API consults the AS (see Q35).",
      },
      {
        tipo: "tabela",
        titulo: "How to design scopes",
        colunas: ["Decision", "Do", "Avoid"],
        linhas: [
          [
            "Granularity",
            "One scope per business capability and action (`faturas.read`, `faturas.write`), with read and write separated",
            "One giant scope (`admin`, `*`) or one scope per endpoint, which nobody understands on the consent screen",
          ],
          [
            "Name and owner",
            "Stable names, prefixed by the resource or the API’s `audience`, and documented",
            "Renaming a scope already granted or reusing the same name for different APIs",
          ],
          [
            "First party vs third party",
            "Third parties: explicit user consent, with a clear description. The product’s own apps: may be pre-authorized, but still ask for the minimum",
            "Giving a third-party app scopes that only your own apps should have",
          ],
          [
            "Who consents",
            "Sensitive scopes or ones that reach other people’s data: administrator consent, which covers the whole organization (as in corporate providers)",
            "Letting an ordinary user alone approve broad access to company data",
          ],
          [
            "When to ask",
            "Incremental consent: the minimum at login, and the rest when the feature is used",
            "Asking for everything at once “just in case”",
          ],
          [
            "Roles and data",
            "The user’s roles and permissions live in the resource server (RBAC, ABAC; see Q108)",
            "Encoding roles or record ids in scopes (`fatura:123:edit`)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "The API checks the app’s scope and the user’s right",
        legenda: "TypeScript",
        codigo: [
          'import { createRemoteJWKSet, jwtVerify } from "jose";',
          "",
          'const jwks = createRemoteJWKSet(new URL("https://auth.exemplo.com/.well-known/jwks.json"));',
          "",
          "export async function canReadInvoice(token: string, invoice: { ownerId: string }) {",
          "  const { payload } = await jwtVerify(token, jwks, {",
          '    issuer: "https://auth.exemplo.com",',
          '    audience: "https://api.exemplo.com",',
          '    algorithms: ["RS256"], // fixed algorithm, never what the token declares',
          "  });",
          '  const scopes = String(payload.scope ?? "").split(" ");',
          '  const appMay = scopes.includes("faturas.read"); // ceiling of the APPLICATION',
          "  const userMay = invoice.ownerId === payload.sub; // the PERSON’s right over this resource",
          "  return appMay && userMay;",
          "}",
        ].join("\n"),
        nota: "The scope answers “may this application do this?”; the owner check answers “may this person see this resource?”. Without the second, any authenticated user reaches other people’s data by changing an id in the URL.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Effective access = intersection",
        texto:
          "Think in three layers, all required: (1) what the **client** may ask for (registered at the AS), (2) what the **person** consented to (the granted scope) and (3) what the **person** has the right to do in the system (roles, ownership, rules). The token attests only the first two. The third lives in the API (or in an authorization service), never in the scope. That is why you should not encode roles or record ids in scopes, and should not let the API accept any token that carries the right scope. Consent exists for transparency and control: the person sees what they are releasing, can revoke it, and the decision is recorded.",
      },
    ],
    armadilhas: [
      "Assuming the token has everything that was asked for: the user or the policy may have granted less; read the `scope` in the response.",
      "Treating the scope as the user’s permission and checking only it at the API: any authenticated user reaches other people’s data (object-level authorization failure).",
      "Creating giant scopes (`admin`, `*`) “so we never ask again”, or one scope per endpoint: the first breaks least privilege and nobody understands the second on the consent screen.",
      "Confusing OpenID Connect identity scopes (`profile`, `email`) with API scopes, or thinking consent lasts forever: it can be revoked.",
    ],
    autoteste: [
      {
        pergunta: "If the token has the `faturas.read` scope, can the user read any invoice? Why?",
        resposta:
          "No. The scope says what the application may do on the person’s behalf; the API still checks the user’s right over that invoice (ownership, role, business rule). Effective access is the intersection.",
      },
      {
        pergunta: "What is incremental consent, and when does the administrator need to consent?",
        resposta:
          "Incremental: ask only for the minimum at login and request extra scopes when the feature is used. Administrator consent covers the whole organization and is required by corporate providers for sensitive scopes or ones that reach other users’ data.",
      },
    ],
  },
};
