import type { Pergunta } from "../../tipos";

// Q116 · Autorização em APIs .NET e Node
export const q116: Pergunta = {
  numero: 116,
  modulo: "autorizacao",
  metodo: "design",
  pt: {
    titulo: "Autorização em APIs .NET e Node",
    pergunta:
      "Como você implementaria autorização em uma API .NET ou Node.js: políticas, claims, handlers e verificação por recurso? Onde ficam as regras e como testá-las?",
    porqueEsteMetodo:
      "Autorização numa API é uma pergunta de projeto: não existe uma chamada mágica, e sim decisões em sequência (separar autenticação, nomear políticas, checar o objeto, escolher onde as regras vivem e como testá-las). Um roteiro fixo evita esquecer as partes críticas.",
    resposta30s:
      "**Autentique** o token primeiro (emissor, audience, assinatura) e **autorize** depois, com **políticas nomeadas** (por exemplo, `PedidoAprovar`) em vez de `if (role === ...)` espalhado. A política confere **claims** (escopo, papel, tenant) e, quando preciso, o **recurso** carregado (posse, estado). As regras ficam **num módulo central e testável**, o padrão é **negar**, e uma **matriz de acesso** automatizada (papel × rota × resultado) cobre inclusive o 403 e o 404 corretos.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Liste os recursos, as ações e quem pode fazer o quê (a matriz de acesso), se há vários tenants, que decisões dependem do objeto (dono, estado, valor), o que exige auditoria e o orçamento de latência. Essa lista vira os testes.",
          },
          {
            titulo: "2. Autenticação separada da autorização",
            texto:
              "Um middleware (`AddJwtBearer` no ASP.NET Core; um middleware com a biblioteca `jose` em Node) valida o token (assinatura com algoritmo fixado, `iss`, `aud`, `exp`; veja Q72) e produz um **principal** com claims. A autorização lê o principal, nunca o token cru, e nunca decide sem autenticação.",
          },
          {
            titulo: "3. Políticas nomeadas",
            texto:
              "Dê nome à regra de negócio (`PedidoAprovar`, `RelatorioLer`). No ASP.NET Core, `AddPolicy` com requisitos e `[Authorize(Policy = ...)]`; em Node, uma função `exigir('pedido:aprovar')` (ou guards, no NestJS) que consulta o mesmo módulo de regras. A rota declara o que exige; não contém a lógica.",
          },
          {
            titulo: "4. Checagem por recurso",
            texto:
              "Autorizar a rota não basta: carregue o objeto filtrando pelo tenant do principal e confira posse e estado (veja Q136). No ASP.NET Core, `IAuthorizationService.AuthorizeAsync(user, recurso, política)` com um handler que recebe o recurso; em Node, uma função pura `podeAcessar(usuario, acao, recurso)`.",
          },
          {
            titulo: "5. Onde as regras vivem",
            texto:
              "Em **um** lugar: handlers (ASP.NET Core) ou um módulo de políticas (Node), como funções puras que recebem usuário, ação e recurso. Se vários serviços precisarem das mesmas regras, extraia um serviço de decisão (veja Q114).",
          },
          {
            titulo: "6. Testes",
            texto:
              "Matriz de acesso automatizada (papel × rota × resultado esperado), testes unitários dos handlers e testes de integração com tokens de teste (`WebApplicationFactory` no .NET; `supertest` em Node), com os casos negativos: outro tenant, papel errado, token sem escopo, sem token.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "ASP.NET Core: política com handler que recebe o recurso",
        legenda: "C#",
        codigo: `builder.Services.AddAuthorization(o =>
{
    o.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build(); // nega por padrão
    o.AddPolicy("PedidoAprovar", p => p.AddRequirements(new AprovarPedidoRequirement()));
});
builder.Services.AddSingleton<IAuthorizationHandler, AprovarPedidoHandler>();

public record AprovarPedidoRequirement : IAuthorizationRequirement;

public class AprovarPedidoHandler : AuthorizationHandler<AprovarPedidoRequirement, Pedido>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx,
        AprovarPedidoRequirement req, Pedido pedido)
    {
        var escopos = ctx.User.FindFirst("scope")?.Value.Split(' ') ?? Array.Empty<string>();
        var tenant = ctx.User.FindFirst("tenant_id")?.Value;
        if (escopos.Contains("pedidos:write") && ctx.User.IsInRole("gerente")
            && tenant == pedido.TenantId && pedido.Status == "pendente")
            ctx.Succeed(req); // sem Succeed, o requisito falha (negado)
        return Task.CompletedTask;
    }
}`,
        nota: "No endpoint, carregue o pedido (já filtrado pelo tenant), chame `AuthorizeAsync(User, pedido, nomeDaPolitica)` e, se `Succeeded` for falso, devolva `Results.Forbid()` (ou 404, conforme a regra de existência). O nome do claim de tenant e o mapeamento de papéis variam por provedor.",
      },
      {
        tipo: "codigo",
        titulo: "Node.js (Express): regras num módulo e middleware que checa o recurso",
        legenda: "TypeScript",
        codigo: `// politicas.ts: as regras num só lugar, como funções puras e testáveis
export const politicas = {
  "pedido:aprovar": (u: Usuario, pedido: Pedido) =>
    u.permissoes.includes("pedido:aprovar") && u.tenantId === pedido.tenantId && pedido.status === "pendente",
};

// middleware: carrega o recurso (já filtrado pelo tenant) e aplica a política nomeada
export const exigir = (acao: keyof typeof politicas) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const pedido = await pedidos.buscar(req.params.id, req.usuario.tenantId);
    if (!pedido) return res.sendStatus(404);                       // não revela o que existe em outro tenant
    if (!politicas[acao](req.usuario, pedido)) return res.sendStatus(403);
    req.pedido = pedido;
    next();
  };

app.post("/pedidos/:id/aprovar", autenticar, exigir("pedido:aprovar"), aprovarPedido);`,
        nota: "`autenticar` valida o token (por exemplo, com `jose`) e preenche `req.usuario`. Trate erros assíncronos do middleware (`next(err)`) conforme a versão do Express e declare nas rotas, e não dentro delas, a política exigida.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regras que valem nas duas plataformas",
        texto:
          "**Autenticação não é autorização.** **Negue por padrão**: no ASP.NET Core, a `FallbackPolicy` exige usuário autenticado em todo endpoint sem política própria; em Node, um middleware global nega as rotas sem política declarada, com um teste que percorre as rotas. **Claims são insumo, não decisão**: a decisão é a política. **A regra mora num só lugar.** **Toda decisão sensível é testada**, com o caso que permite e os que negam.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "403 × 404 e os gargalos",
        texto:
          "**401**: sem autenticação válida. **403**: autenticado, mas sem permissão para algo cuja existência não é segredo. **404**: use quando revelar que o objeto existe (de outro tenant ou de outro usuário) seria um vazamento. Gargalos comuns: **regras espalhadas** (cada controller com o seu `if`) divergem e escapam dos testes; **uma consulta de permissões por requisição** pesa, então carregue o conjunto uma vez por requisição e use cache com validade curta e invalidação; **checagem item a item em listas** gera N consultas, então filtre na própria consulta; **permissões dentro do token** envelhecem (veja Q76).",
      },
    ],
    armadilhas: [
      "Espalhar `if (token.role === 'admin')` pelos handlers: a regra diverge, ninguém a testa e mudar um papel vira caçada.",
      "Checar só o papel ou o escopo e esquecer a posse do objeto: uma rota autenticada com o id na URL abre os dados de qualquer um (veja Q136).",
      "Resolver listas checando item a item, ou carregando tudo e filtrando em memória, em vez de filtrar na consulta.",
      "Testar só o caminho feliz: sem teste de “outro tenant recebe 403 ou 404”, uma rota nova sem política passa a ficar aberta sem que ninguém perceba.",
    ],
    autoteste: [
      {
        pergunta: "Quando devolver 403 e quando devolver 404?",
        resposta:
          "O 403 serve quando a pessoa está autenticada, mas não pode fazer aquilo, e a existência do recurso não é segredo. O 404 serve quando confirmar que o recurso existe (de outro tenant ou de outro usuário) vazaria informação.",
      },
      {
        pergunta: "Como garantir que uma rota nova sem política não fique aberta?",
        resposta:
          "Com um padrão de negação: no ASP.NET Core, a `FallbackPolicy` que exige usuário autenticado (e `[AllowAnonymous]` só onde for deliberado); em Node, um middleware global que nega rotas sem política declarada, e um teste que percorre todas as rotas.",
      },
    ],
  },
  en: {
    titulo: "Authorization in .NET and Node APIs",
    pergunta:
      "How would you implement authorization in a .NET or Node.js API: policies, claims, handlers and per-resource checks? Where do the rules live, and how do you test them?",
    porqueEsteMetodo:
      "Authorization in an API is a design question: there is no magic call, only decisions in sequence (separate authentication, name the policies, check the object, choose where the rules live and how to test them). A fixed script prevents forgetting the critical parts.",
    resposta30s:
      "**Authenticate** the token first (issuer, audience, signature) and **authorize** afterwards, with **named policies** (for example, `OrderApprove`) instead of `if (role === ...)` scattered around. The policy checks **claims** (scope, role, tenant) and, when needed, the loaded **resource** (ownership, state). The rules live in **a central, testable module**, the default is **deny**, and an automated **access matrix** (role × route × outcome) covers even the correct 403 and 404.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "List the resources, the actions and who may do what (the access matrix), whether there are several tenants, which decisions depend on the object (owner, state, amount), what needs auditing and the latency budget. That list becomes the tests.",
          },
          {
            titulo: "2. Authentication separate from authorization",
            texto:
              "A middleware (`AddJwtBearer` in ASP.NET Core; a middleware using the `jose` library in Node) validates the token (signature with a fixed algorithm, `iss`, `aud`, `exp`; see Q72) and produces a **principal** with claims. Authorization reads the principal, never the raw token, and never decides without authentication.",
          },
          {
            titulo: "3. Named policies",
            texto:
              "Name the business rule (`OrderApprove`, `ReportRead`). In ASP.NET Core, `AddPolicy` with requirements and `[Authorize(Policy = ...)]`; in Node, a function `requirePolicy('order:approve')` (or guards, in NestJS) that consults the same rules module. The route declares what it requires; it does not contain the logic.",
          },
          {
            titulo: "4. Per-resource check",
            texto:
              "Authorizing the route is not enough: load the object filtering by the principal’s tenant and check ownership and state (see Q136). In ASP.NET Core, `IAuthorizationService.AuthorizeAsync(user, resource, policy)` with a handler that receives the resource; in Node, a pure function `canAccess(user, action, resource)`.",
          },
          {
            titulo: "5. Where the rules live",
            texto:
              "In **one** place: handlers (ASP.NET Core) or a policies module (Node), as pure functions that take user, action and resource. If several services need the same rules, extract a decision service (see Q114).",
          },
          {
            titulo: "6. Tests",
            texto:
              "An automated access matrix (role × route × expected outcome), unit tests for the handlers and integration tests with test tokens (`WebApplicationFactory` in .NET; `supertest` in Node), with the negative cases: another tenant, the wrong role, a token without the scope, no token.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "ASP.NET Core: a policy with a handler that receives the resource",
        legenda: "C#",
        codigo: `builder.Services.AddAuthorization(o =>
{
    o.FallbackPolicy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build(); // deny by default
    o.AddPolicy("OrderApprove", p => p.AddRequirements(new ApproveOrderRequirement()));
});
builder.Services.AddSingleton<IAuthorizationHandler, ApproveOrderHandler>();

public record ApproveOrderRequirement : IAuthorizationRequirement;

public class ApproveOrderHandler : AuthorizationHandler<ApproveOrderRequirement, Order>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx,
        ApproveOrderRequirement req, Order order)
    {
        var scopes = ctx.User.FindFirst("scope")?.Value.Split(' ') ?? Array.Empty<string>();
        var tenant = ctx.User.FindFirst("tenant_id")?.Value;
        if (scopes.Contains("orders:write") && ctx.User.IsInRole("manager")
            && tenant == order.TenantId && order.Status == "pending")
            ctx.Succeed(req); // without Succeed, the requirement fails (denied)
        return Task.CompletedTask;
    }
}`,
        nota: "In the endpoint, load the order (already filtered by tenant), call `AuthorizeAsync(User, order, policyName)` and, if `Succeeded` is false, return `Results.Forbid()` (or 404, depending on the existence rule). The tenant claim name and the role mapping vary by provider.",
      },
      {
        tipo: "codigo",
        titulo: "Node.js (Express): rules in a module and a middleware that checks the resource",
        legenda: "TypeScript",
        codigo: `// policies.ts: the rules in one place, as pure, testable functions
export const policies = {
  "order:approve": (u: User, order: Order) =>
    u.permissions.includes("order:approve") && u.tenantId === order.tenantId && order.status === "pending",
};

// middleware: loads the resource (already filtered by tenant) and applies the named policy
export const requirePolicy = (action: keyof typeof policies) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await orders.find(req.params.id, req.user.tenantId);
    if (!order) return res.sendStatus(404);                        // does not reveal what exists in another tenant
    if (!policies[action](req.user, order)) return res.sendStatus(403);
    req.order = order;
    next();
  };

app.post("/orders/:id/approve", authenticate, requirePolicy("order:approve"), approveOrder);`,
        nota: "`authenticate` validates the token (for example, with `jose`) and fills `req.user`. Handle async errors in the middleware (`next(err)`) according to your Express version, and declare the required policy on the routes rather than inside them.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rules that hold on both platforms",
        texto:
          "**Authentication is not authorization.** **Deny by default**: in ASP.NET Core, the `FallbackPolicy` requires an authenticated user on every endpoint without its own policy; in Node, a global middleware denies routes with no declared policy, plus a test that walks the routes. **Claims are input, not the decision**: the decision is the policy. **The rule lives in one place.** **Every sensitive decision is tested**, with the case that allows and the ones that deny.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "403 vs 404 and the bottlenecks",
        texto:
          "**401**: no valid authentication. **403**: authenticated, but not allowed to do something whose existence is not a secret. **404**: use it when revealing that the object exists (in another tenant or belonging to another user) would be a leak. Common bottlenecks: **scattered rules** (each controller with its own `if`) drift apart and escape the tests; **one permission query per request** is heavy, so load the set once per request and use a cache with a short lifetime and invalidation; **item-by-item checks in lists** cause N queries, so filter in the query itself; **permissions inside the token** go stale (see Q76).",
      },
    ],
    armadilhas: [
      "Scattering `if (token.role === 'admin')` across handlers: the rule drifts, nobody tests it and changing a role becomes a hunt.",
      "Checking only the role or scope and forgetting object ownership: an authenticated route with the id in the URL opens anyone’s data (see Q136).",
      "Handling lists by checking item by item, or by loading everything and filtering in memory, instead of filtering in the query.",
      "Testing only the happy path: without a test for “another tenant gets 403 or 404”, a new route with no policy ends up open without anyone noticing.",
    ],
    autoteste: [
      {
        pergunta: "When do you return 403 and when 404?",
        resposta:
          "403 fits when the person is authenticated but cannot do that, and the resource’s existence is not a secret. 404 fits when confirming that the resource exists (in another tenant or belonging to another user) would leak information.",
      },
      {
        pergunta: "How do you make sure a new route with no policy does not end up open?",
        resposta:
          "With a deny default: in ASP.NET Core, the `FallbackPolicy` that requires an authenticated user (and `[AllowAnonymous]` only where deliberate); in Node, a global middleware that denies routes with no declared policy, and a test that walks every route.",
      },
    ],
  },
};
