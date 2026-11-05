import type { Pergunta } from "../../tipos";

// Q112 · Sistema de permissões do zero
export const q112: Pergunta = {
  numero: 112,
  modulo: "autorizacao",
  metodo: "firstprinciples",
  pt: {
    titulo: "Sistema de permissões do zero",
    pergunta:
      "Como você construiria um sistema de permissões do zero, partindo de um simples if user.isAdmin e evoluindo conforme as exigências aparecem?",
    porqueEsteMetodo:
      "Um sistema de permissões completo parece um bloco enorme de conceitos (papéis, políticas, PDP, cache). Partir do `if user.isAdmin` e acrescentar uma peça por vez, só quando uma limitação real aparece, mostra por que cada componente existe e, principalmente, onde parar.",
    resposta30s:
      "Comece pelo **mais simples que funciona** e evolua quando uma limitação concreta aparecer: **booleano**, **papéis**, **permissões por ação**, **escopo por recurso e tenant**, **posse e relações**, **política declarativa central**, **cache e auditoria** e, só no fim, **PDP e PEP externos**. Em todos os passos, **negue por padrão** e centralize a decisão numa função testável. **Pare no passo que a sua dor justifica**: a maioria das aplicações não precisa do último.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Construindo, uma limitação por vez",
        passos: [
          {
            titulo: "0. O que se quer",
            texto:
              "Responder “esta pessoa pode fazer esta ação neste recurso?” de modo **correto**, **explicável** (por que foi negado), **rápido** e **fácil de mudar**. O desenho que não dá para testar nem auditar falha nesse alvo.",
          },
          {
            titulo: "1. A versão mais simples: `if user.isAdmin`",
            texto:
              "Um booleano no usuário e um `if` nos pontos sensíveis. → Basta para um produto com dois tipos de pessoa. → Quebra: surge o terceiro tipo (quem edita mas não apaga), todo mundo vira admin “para resolver” e ninguém sabe quem fez o quê. Conserto: **papéis**.",
          },
          {
            titulo: "2. Papéis fixos",
            texto:
              "Um campo `role` (`admin`, `editor`, `leitor`) e verificações `if (role === 'editor')` espalhadas. → Quebra: o código conhece papéis, não ações; criar o papel “editor sem excluir” exige mudar o código e publicar de novo, e a pessoa com dois papéis vira caso especial. Conserto: separar **permissões** (ações) de **papéis** (agrupamentos).",
          },
          {
            titulo: "3. Permissões por ação",
            texto:
              "Tabelas usuário-papel e papel-permissão; o código pergunta “tem `pedido:aprovar`?”, não “é gerente?”. Os papéis viram dados, editáveis sem publicar. → Quebra: a pessoa é gerente de uma filial, não de todas, e o cliente A não pode ver os dados do cliente B. Conserto: **escopo**.",
          },
          {
            titulo: "4. Escopo por recurso e por tenant",
            texto:
              "A atribuição ganha um escopo: (usuário, papel, escopo), com escopo = organização, projeto ou filial. Todo recurso carrega o `tenantId`, e toda consulta o filtra. → Quebra: um filtro esquecido vaza dados entre clientes, e “editar só o que é meu” ou “o que foi compartilhado comigo” não cabe num papel. Conserto: reforçar o tenant na camada de dados (veja Q117 e Q115) e tratar **posse e relações**.",
          },
          {
            titulo: "5. Posse e relações entre objetos",
            texto:
              "Regras como “o dono edita”, “quem recebeu o compartilhamento lê” e “herda da pasta”. Começam como `if` no handler e crescem para tuplas (objeto, relação, usuário) com herança (veja Q106). → Quebra: as regras se duplicam em cada rota e serviço, com pequenas diferenças, e mudar uma é caçar todas. Conserto: **uma função de decisão central**.",
          },
          {
            titulo: "6. Política declarativa e central",
            texto:
              "Uma função (ou um arquivo de políticas) recebe (sujeito, ação, recurso, contexto) e devolve permitir ou negar **com o motivo**, inclusive com condições sobre atributos (horário, valor, estado), sempre com **negação por padrão**. O teste de matriz de acesso fica fácil. → Quebra: vários serviços, em linguagens diferentes, querem a mesma regra, e consultar o banco a cada requisição pesa. Conserto: **cache** e, depois, **um serviço de decisão**.",
          },
          {
            titulo: "7. Cache, auditoria e revogação",
            texto:
              "Guarde em cache o conjunto de permissões por usuário, com validade curta e invalidação quando os papéis mudam; registre cada decisão relevante (quem, ação, recurso, resultado, versão da política). → Quebra: cache velho mantém permissão revogada, e log sem contexto não explica nada. Conserto: validade curta, invalidação por evento e decisões auditáveis com a versão da política.",
          },
          {
            titulo: "8. PDP e PEP externos",
            texto:
              "Com muitos serviços, equipes e linguagens, extrai-se a decisão para um **PDP** (um motor de políticas como OPA ou Cedar, ou um serviço de relações), e cada serviço mantém só um **PEP** que pergunta e aplica a resposta (veja Q114). → Custo: mais uma peça para operar, latência e a necessidade de versionar e testar as políticas como código.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A função central de decisão (passos 3 a 6)",
        legenda: "TypeScript",
        codigo: `type Decisao = { permitido: boolean; motivo: string };
const negar = (motivo: string): Decisao => ({ permitido: false, motivo });

export function autorizar(u: Usuario, acao: string, recurso: Recurso): Decisao {
  if (recurso.tenantId !== u.tenantId) return negar("outro_tenant");   // escopo
  const permissoes = permissoesDosPapeis(u.papeis);                     // papéis -> ações
  if (!permissoes.has(acao)) return negar("papel_sem_permissao");      // permissão
  const regra = REGRAS_DE_OBJETO[acao];                                 // posse e estado
  if (regra && !regra(u, recurso)) return negar("regra_do_objeto");
  return { permitido: true, motivo: "ok" };    // só chega aqui com tudo certo
}`,
        nota: "`permissoesDosPapeis` e `REGRAS_DE_OBJETO` pertencem ao domínio da aplicação. O que importa é que os handlers chamam `autorizar` e nunca comparam papéis.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Onde parar",
        texto:
          "Pare no passo que a sua dor justifica. **Poucos perfis fixos**: papéis e permissões (passos 2 e 3) bastam. **Multi-tenant ou com hierarquia**: acrescente escopo e posse (4 e 5), com a função central. **Vários serviços ou regras que mudam o tempo todo**: política declarativa e cache (6 e 7). **Só então** considere PDP e PEP externos (8). Antes de escrever um motor, veja se bibliotecas e serviços existentes (como Casbin ou CASL numa aplicação, ou um motor como o OPA) resolvem: um motor próprio é código de segurança que você terá de manter para sempre.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Escalabilidade, desempenho e manutenibilidade",
        texto:
          "**Escalabilidade**: a decisão deve ser sem estado (qualquer instância decide), e os dados de acesso (papéis, vínculos) ficam em armazenamento indexado ou em cache. **Desempenho**: não consulte o banco de permissões a cada checagem dentro de um laço; carregue o conjunto de permissões uma vez por requisição, filtre as listas na própria consulta (em vez de checar item a item) e meça a latência da decisão. **Manutenibilidade**: regras num só lugar, nomes de permissão estáveis e legíveis (`recurso:acao`), política versionada e revisada como código, testes de matriz de acesso no CI e motivos de negação explicáveis.",
      },
    ],
    armadilhas: [
      "Começar pelo motor completo (PDP, ReBAC, ABAC) antes de haver a dor: complexidade que ninguém consegue manter nem explicar.",
      "Deixar o código conhecer papéis (`if role === 'gerente'`) em vez de permissões: mudar um papel passa a exigir publicar o código.",
      "Resolver o isolamento entre tenants só à mão, em cada consulta: um filtro esquecido vaza dados; reforce na camada de dados.",
      "Cache de permissões sem validade nem invalidação: a revogação não chega, e quem saiu do cargo segue com o acesso.",
    ],
    autoteste: [
      {
        pergunta: "Por que trocar `if (user.role === 'admin')` por uma checagem de permissão?",
        resposta:
          "O código passa a perguntar pela ação (`pedido:aprovar`), não pelo cargo. Os papéis viram dados que o negócio pode mudar sem nova publicação, e dá para testar e auditar a matriz papel-permissão.",
      },
      {
        pergunta: "Quando faz sentido extrair um PDP externo?",
        resposta:
          "Quando vários serviços, equipes ou linguagens precisam aplicar as mesmas regras e mantê-las em cada código gera divergência. Antes disso, uma função central bem testada costuma bastar; o PDP traz latência, operação e a necessidade de tratar a política como código.",
      },
    ],
  },
  en: {
    titulo: "Permission system from scratch",
    pergunta:
      "How would you build a permission system from scratch, starting from a simple if user.isAdmin and evolving as requirements appear?",
    porqueEsteMetodo:
      "A complete permission system looks like a huge block of concepts (roles, policies, PDP, cache). Starting from `if user.isAdmin` and adding one piece at a time, only when a real limitation shows up, reveals why each component exists and, above all, where to stop.",
    resposta30s:
      "Start with the **simplest thing that works** and evolve when a concrete limitation appears: **a boolean**, **roles**, **permissions per action**, **scope per resource and tenant**, **ownership and relationships**, **a central declarative policy**, **caching and auditing** and, only at the end, **external PDP and PEP**. At every step, **deny by default** and centralize the decision in a testable function. **Stop at the step your pain justifies**: most applications do not need the last one.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Building it, one limitation at a time",
        passos: [
          {
            titulo: "0. What you want",
            texto:
              "To answer “can this person do this action on this resource?” in a way that is **correct**, **explainable** (why it was denied), **fast** and **easy to change**. A design you cannot test or audit fails that target.",
          },
          {
            titulo: "1. The simplest version: `if user.isAdmin`",
            texto:
              "A boolean on the user and an `if` at the sensitive points. → Enough for a product with two kinds of people. → Breaks: a third kind appears (someone who edits but cannot delete), everyone becomes admin “to get unblocked” and nobody knows who did what. Fix: **roles**.",
          },
          {
            titulo: "2. Fixed roles",
            texto:
              "A `role` field (`admin`, `editor`, `viewer`) and `if (role === 'editor')` checks scattered around. → Breaks: the code knows roles, not actions; creating an “editor who cannot delete” role means changing the code and redeploying, and a person with two roles becomes a special case. Fix: separate **permissions** (actions) from **roles** (groupings).",
          },
          {
            titulo: "3. Permissions per action",
            texto:
              "User-role and role-permission tables; the code asks “does the user have `order:approve`?”, not “is the user a manager?”. Roles become data, editable without a release. → Breaks: the person manages one branch, not all of them, and customer A must not see customer B’s data. Fix: **scope**.",
          },
          {
            titulo: "4. Scope per resource and tenant",
            texto:
              "The assignment gains a scope: (user, role, scope), with scope = organization, project or branch. Every resource carries its `tenantId`, and every query filters on it. → Breaks: a forgotten filter leaks data between customers, and “edit only what is mine” or “what was shared with me” does not fit in a role. Fix: enforce the tenant at the data layer (see Q117 and Q115) and handle **ownership and relationships**.",
          },
          {
            titulo: "5. Ownership and relationships between objects",
            texto:
              "Rules such as “the owner edits”, “whoever received the share reads” and “inherits from the folder”. They start as an `if` in the handler and grow into tuples (object, relation, user) with inheritance (see Q106). → Breaks: the rules are duplicated in every route and service, with small differences, and changing one means hunting down all of them. Fix: **a central decision function**.",
          },
          {
            titulo: "6. A central, declarative policy",
            texto:
              "A function (or a policy file) takes (subject, action, resource, context) and returns allow or deny **with the reason**, including conditions on attributes (time, amount, state), always with **deny by default**. The access-matrix test becomes easy. → Breaks: several services, in different languages, want the same rule, and querying the database on every request is heavy. Fix: **caching** and, later, **a decision service**.",
          },
          {
            titulo: "7. Caching, auditing and revocation",
            texto:
              "Cache each user’s permission set, with a short lifetime and invalidation when roles change; log every relevant decision (who, action, resource, result, policy version). → Breaks: a stale cache keeps a revoked permission alive, and a log without context explains nothing. Fix: a short lifetime, event-driven invalidation and auditable decisions carrying the policy version.",
          },
          {
            titulo: "8. External PDP and PEP",
            texto:
              "With many services, teams and languages, you extract the decision into a **PDP** (a policy engine such as OPA or Cedar, or a relationship service), and each service keeps only a **PEP** that asks and enforces the answer (see Q114). → Cost: one more piece to operate, latency, and the need to version and test policies as code.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "The central decision function (steps 3 to 6)",
        legenda: "TypeScript",
        codigo: `type Decision = { allowed: boolean; reason: string };
const deny = (reason: string): Decision => ({ allowed: false, reason });

export function authorize(u: User, action: string, resource: Resource): Decision {
  if (resource.tenantId !== u.tenantId) return deny("other_tenant");   // scope
  const permissions = permissionsOfRoles(u.roles);                      // roles -> actions
  if (!permissions.has(action)) return deny("role_lacks_permission");  // permission
  const rule = OBJECT_RULES[action];                                    // ownership and state
  if (rule && !rule(u, resource)) return deny("object_rule");
  return { allowed: true, reason: "ok" };      // only reached when everything checks out
}`,
        nota: "`permissionsOfRoles` and `OBJECT_RULES` belong to the application’s domain. What matters is that handlers call `authorize` and never compare roles.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Where to stop",
        texto:
          "Stop at the step your pain justifies. **A few fixed profiles**: roles and permissions (steps 2 and 3) are enough. **Multi-tenant or hierarchical**: add scope and ownership (4 and 5), with the central function. **Several services or rules that keep changing**: a declarative policy and caching (6 and 7). **Only then** consider an external PDP and PEP (8). Before writing an engine, check whether existing libraries and services (such as Casbin or CASL inside an application, or an engine like OPA) solve it: your own engine is security code you will have to maintain forever.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Scalability, performance and maintainability",
        texto:
          "**Scalability**: the decision should be stateless (any instance can decide), and the access data (roles, links) lives in indexed storage or in a cache. **Performance**: do not query the permission database on every check inside a loop; load the permission set once per request, filter lists in the query itself (instead of checking item by item) and measure the decision latency. **Maintainability**: rules in one place, stable and readable permission names (`resource:action`), a policy that is versioned and reviewed as code, access-matrix tests in CI and explainable denial reasons.",
      },
    ],
    armadilhas: [
      "Starting with the full engine (PDP, ReBAC, ABAC) before there is any pain: complexity nobody can maintain or explain.",
      "Letting the code know roles (`if role === 'manager'`) instead of permissions: changing a role now requires shipping code.",
      "Handling tenant isolation only by hand, in each query: one forgotten filter leaks data; enforce it at the data layer.",
      "A permission cache with no lifetime and no invalidation: revocation never arrives, and someone who left the position keeps the access.",
    ],
    autoteste: [
      {
        pergunta: "Why replace `if (user.role === 'admin')` with a permission check?",
        resposta:
          "The code starts asking about the action (`order:approve`), not the job title. Roles become data the business can change without a new release, and the role-permission matrix can be tested and audited.",
      },
      {
        pergunta: "When does it make sense to extract an external PDP?",
        resposta:
          "When several services, teams or languages need to apply the same rules and maintaining them in each codebase causes drift. Before that, a well-tested central function is usually enough; a PDP brings latency, operations and the need to treat policy as code.",
      },
    ],
  },
};
