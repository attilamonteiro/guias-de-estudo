import type { Pergunta } from "../../tipos";

// Q108 · Escopos × permissões × papéis
export const q108: Pergunta = {
  numero: 108,
  modulo: "autorizacao",
  metodo: "compare",
  pt: {
    titulo: "Escopos × permissões × papéis",
    pergunta:
      "Qual é a diferença entre escopos OAuth, permissões e papéis? Como eles se combinam na decisão de acesso a uma API?",
    porqueEsteMetodo:
      "Escopo, permissão e papel são usados como sinônimos em conversas e até em tokens, mas respondem a perguntas diferentes e vêm de lugares diferentes. A matriz os separa, e a regra de interseção mostra como entram em cada decisão.",
    resposta30s:
      "**Escopo** é o que o **cliente** (a aplicação) foi autorizado a pedir em nome do usuário; **permissão** é uma **ação sobre um recurso** que o usuário pode exercer; **papel** é um **agrupamento de permissões** atribuído a pessoas. O acesso efetivo é a **interseção** de três coisas: o escopo do token, as permissões do usuário e a política do recurso. O escopo limita a aplicação, mas nunca concede ao usuário algo que ele não possa fazer.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro conceitos, quatro perguntas",
        colunas: ["Conceito", "O que representa", "Quem atribui e onde vive", "Quem verifica", "Exemplo"],
        linhas: [
          [
            "Escopo",
            "O teto do que o cliente pode fazer com este token, em nome do usuário",
            "Concedido no consentimento (pelo usuário ou por um administrador) e emitido pelo servidor de autorização, dentro do token",
            "A API, em cada chamada",
            "`pedidos:read`, `pedidos:write`",
          ],
          [
            "Permissão",
            "Uma ação sobre um tipo de recurso, definida pelo domínio da API",
            "Definida por quem desenvolve a API; concedida a papéis ou a usuários no sistema de acesso da aplicação",
            "A API (ou o seu serviço de decisão)",
            "`pedido:aprovar`",
          ],
          [
            "Papel",
            "Um agrupamento de permissões, para facilitar atribuição e revisão",
            "Atribuído a pessoas ou grupos por administradores ou por processo de RH/IGA; guardado no diretório ou na aplicação",
            "Quem expande o papel em permissões (a aplicação ou o provedor de identidade)",
            "`gerente-de-vendas`",
          ],
          [
            "Política do recurso",
            "Regras sobre este objeto e este momento: dono, estado, tenant, valor, horário",
            "Escrita pelo time dono do recurso; vive no código ou num motor de políticas",
            "A API, depois de carregar o objeto",
            "Só pedido `pendente` do próprio tenant, até o limite do aprovador",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**Acesso efetivo = escopo ∩ permissão do usuário ∩ política do recurso.** Cada camada é um teto e todas precisam dizer sim: o escopo responde “esta aplicação pode tentar isso?”, a permissão responde “esta pessoa pode fazer isso?” e a política do recurso responde “neste objeto, agora?”. Quando o token é de aplicação (client credentials, sem usuário), a segunda camada passa a ser as permissões dadas à própria aplicação (veja Q31).",
      },
      {
        tipo: "codigo",
        titulo: "Claims de um access token (exemplo)",
        legenda: "JSON",
        codigo: `{
  "iss": "https://idp.exemplo.com/",
  "sub": "usr_8f2c",
  "aud": "api://pedidos",
  "client_id": "app-web",
  "scope": "pedidos:read pedidos:write",
  "roles": ["gerente-de-vendas"],
  "iat": 1760000000,
  "exp": 1760000900
}`,
        nota: "Os nomes dos claims variam por provedor (`scope` ou `scp`, `roles` ou `groups`). Aqui, `scope` é o teto do cliente, e `roles` é só um retrato do momento em que o token foi emitido.",
      },
      {
        tipo: "codigo",
        titulo: "As três camadas numa decisão",
        legenda: "TypeScript",
        codigo: `// Acesso efetivo = escopo ∩ permissão do usuário ∩ política do recurso
async function podeAprovarPedido(token: Claims, pedidoId: string): Promise<boolean> {
  // 1) escopo: o que o CLIENTE foi autorizado a pedir
  if (!token.scope.split(" ").includes("pedidos:write")) return false;

  // 2) permissão: o que o USUÁRIO pode, lida da fonte atual (não só do token)
  const { acoes, limite } = await permissoesDoUsuario(token.sub);
  if (!acoes.has("pedido:aprovar")) return false;

  // 3) política do recurso: ESTE pedido, neste estado, para este usuário
  const pedido = await carregarPedido(pedidoId, token.tenant_id);
  return pedido !== null && pedido.status === "pendente" && pedido.valor <= limite;
}`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Como os riscos do OAuth aparecem aqui",
        texto:
          "**Escopos largos demais** (`full_access`) fazem um token roubado valer muito. **API que confere só o escopo** deixa o usuário A ler o pedido do usuário B (veja Q136). **Papéis copiados para o token** valem até ele expirar: quem perdeu o papel continua com ele (veja Q76 e Q77). **Consentimento enganoso** entrega escopos a aplicações maliciosas (veja Q131), um `redirect_uri` frouxo vaza o código (veja Q125) e um token roubado se repete até expirar (veja Q130). Peça o mínimo de escopos, mantenha-os específicos e decida a autorização do usuário no servidor.",
      },
    ],
    armadilhas: [
      "Achar que o escopo no token autoriza o usuário: ele só diz o que o cliente pode pedir; a decisão sobre este usuário e este recurso é da API.",
      "Usar escopos amplos e genéricos (`admin`, `full_access`) por conveniência: um token roubado ou um consentimento enganoso passa a valer muito.",
      "Embutir papéis e permissões no token e tratá-los como atuais: mudanças e revogações só aparecem quando o token expira. Use vida curta ou consulte a fonte nas ações sensíveis.",
      "Misturar os vocabulários (`admin` como escopo, papel e permissão ao mesmo tempo): ninguém mais sabe quem concede o quê.",
    ],
    autoteste: [
      {
        pergunta: "Um token tem o escopo `pedidos:write`. O usuário pode alterar qualquer pedido?",
        resposta:
          "Não. O escopo só mostra que o cliente pode pedir essa categoria de ação. A API ainda confere se o usuário tem a permissão e se a política do recurso (dono, tenant, estado) permite aquele pedido.",
      },
      {
        pergunta: "Por que o acesso efetivo é uma interseção e não uma soma?",
        resposta:
          "Porque cada camada é um teto: o escopo limita a aplicação mesmo que o usuário seja administrador, e as permissões do usuário limitam o resultado mesmo que o escopo seja largo. Numa soma, uma camada frouxa abriria tudo.",
      },
    ],
  },
  en: {
    titulo: "Scopes vs permissions vs roles",
    pergunta:
      "What is the difference between OAuth scopes, permissions and roles? How do they combine in an API access decision?",
    porqueEsteMetodo:
      "Scope, permission and role are used as synonyms in conversation and even in tokens, but they answer different questions and come from different places. The matrix separates them, and the intersection rule shows how each enters a decision.",
    resposta30s:
      "A **scope** is what the **client** (the application) was authorized to ask for on the user’s behalf; a **permission** is an **action on a resource** that the user may perform; a **role** is a **grouping of permissions** assigned to people. Effective access is the **intersection** of three things: the token’s scope, the user’s permissions and the resource policy. A scope limits the application, but it never grants the user something they could not do anyway.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four concepts, four questions",
        colunas: ["Concept", "What it represents", "Who assigns it and where it lives", "Who checks it", "Example"],
        linhas: [
          [
            "Scope",
            "The ceiling of what the client may do with this token, on the user’s behalf",
            "Granted at consent (by the user or an administrator) and issued by the authorization server, inside the token",
            "The API, on every call",
            "`orders:read`, `orders:write`",
          ],
          [
            "Permission",
            "An action on a type of resource, defined by the API’s domain",
            "Defined by whoever builds the API; granted to roles or to users in the application’s access system",
            "The API (or its decision service)",
            "`order:approve`",
          ],
          [
            "Role",
            "A grouping of permissions, to make assignment and review easier",
            "Assigned to people or groups by administrators or by an HR/IGA process; stored in the directory or the application",
            "Whoever expands the role into permissions (the application or the identity provider)",
            "`sales-manager`",
          ],
          [
            "Resource policy",
            "Rules about this object and this moment: owner, state, tenant, amount, time",
            "Written by the team that owns the resource; lives in code or in a policy engine",
            "The API, after loading the object",
            "Only a `pending` order of the user’s own tenant, up to the approver’s limit",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**Effective access = scope ∩ user permission ∩ resource policy.** Each layer is a ceiling and all of them must say yes: the scope answers “may this application try this?”, the permission answers “may this person do this?” and the resource policy answers “on this object, right now?”. When the token belongs to an application (client credentials, no user), the second layer becomes the permissions given to the application itself (see Q31).",
      },
      {
        tipo: "codigo",
        titulo: "Claims of an access token (example)",
        legenda: "JSON",
        codigo: `{
  "iss": "https://idp.example.com/",
  "sub": "usr_8f2c",
  "aud": "api://orders",
  "client_id": "web-app",
  "scope": "orders:read orders:write",
  "roles": ["sales-manager"],
  "iat": 1760000000,
  "exp": 1760000900
}`,
        nota: "Claim names vary by provider (`scope` or `scp`, `roles` or `groups`). Here, `scope` is the client’s ceiling, and `roles` is only a snapshot of the moment the token was issued.",
      },
      {
        tipo: "codigo",
        titulo: "The three layers in one decision",
        legenda: "TypeScript",
        codigo: `// Effective access = scope ∩ user permission ∩ resource policy
async function canApproveOrder(token: Claims, orderId: string): Promise<boolean> {
  // 1) scope: what the CLIENT was authorized to ask for
  if (!token.scope.split(" ").includes("orders:write")) return false;

  // 2) permission: what the USER can do, read from the current source (not only the token)
  const { actions, limit } = await permissionsOfUser(token.sub);
  if (!actions.has("order:approve")) return false;

  // 3) resource policy: THIS order, in this state, for this user
  const order = await loadOrder(orderId, token.tenant_id);
  return order !== null && order.status === "pending" && order.amount <= limit;
}`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "How OAuth risks show up here",
        texto:
          "**Scopes that are too broad** (`full_access`) make a stolen token worth a lot. **An API that checks only the scope** lets user A read user B’s order (see Q136). **Roles copied into the token** last until it expires: someone who lost the role keeps it (see Q76 and Q77). **Deceptive consent** hands scopes to malicious applications (see Q131), a loose `redirect_uri` leaks the code (see Q125) and a stolen token can be replayed until it expires (see Q130). Ask for the fewest scopes, keep them specific and decide the user’s authorization on the server.",
      },
    ],
    armadilhas: [
      "Thinking the scope in the token authorizes the user: it only says what the client may ask for; the decision about this user and this resource belongs to the API.",
      "Using broad, generic scopes (`admin`, `full_access`) for convenience: a stolen token or a deceptive consent suddenly counts for a lot.",
      "Embedding roles and permissions in the token and treating them as current: changes and revocations only show up when the token expires. Use a short lifetime or look up the source for sensitive actions.",
      "Mixing the vocabularies (`admin` as scope, role and permission at once): nobody knows who grants what anymore.",
    ],
    autoteste: [
      {
        pergunta: "A token has the scope `orders:write`. Can the user change any order?",
        resposta:
          "No. The scope only shows that the client may ask for that category of action. The API still checks that the user holds the permission and that the resource policy (owner, tenant, state) allows that request.",
      },
      {
        pergunta: "Why is effective access an intersection and not a sum?",
        resposta:
          "Because each layer is a ceiling: the scope limits the application even if the user is an administrator, and the user’s permissions limit the result even if the scope is broad. With a sum, one loose layer would open everything.",
      },
    ],
  },
};
