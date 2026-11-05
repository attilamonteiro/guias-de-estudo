import type { Pergunta } from "../../tipos";

// Q115 · Onde aplicar a autorização
export const q115: Pergunta = {
  numero: 115,
  modulo: "autorizacao",
  metodo: "compare",
  pt: {
    titulo: "Onde aplicar a autorização",
    pergunta:
      "Onde aplicar a autorização: no API gateway, em cada serviço ou na camada de dados? Compare as opções e diga o que cada uma não consegue proteger.",
    porqueEsteMetodo:
      "A pergunta é onde pôr a checagem, e cada lugar enxerga coisas diferentes. Uma matriz por camada mostra o que cada uma decide bem e, principalmente, o que ela não consegue proteger, que é o que justifica combiná-las.",
    resposta30s:
      "Aplique a autorização em **camadas**: o **gateway** na borda faz o grosso (autenticação, escopos, limites), **cada serviço** aplica as regras de negócio e a **propriedade do objeto**, e a **camada de dados** reforça o isolamento (por exemplo, com row-level security) como **defesa em profundidade**. **Nunca só o gateway**: ele não vê o dono do objeto nem as chamadas internas. Esconder o botão na interface é experiência de uso, não autorização.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O que cada camada decide e o que ela não protege",
        colunas: ["Camada", "O que decide bem", "O que não consegue proteger", "Cuidado"],
        linhas: [
          [
            "Borda (API gateway, proxy, WAF)",
            "Autenticação (token válido, emissor, audience), escopos grossos por rota, limite de taxa, bloqueio de rotas que nunca devem ser expostas",
            "A propriedade do objeto (`/pedidos/42` é deste usuário?), as regras de negócio e qualquer chamada que não passe por ele (serviço para serviço, filas, jobs)",
            "Serviços não devem confiar em cabeçalhos de identidade só porque o gateway existe",
          ],
          [
            "Cada serviço (middleware, políticas, handlers)",
            "Regras de negócio, propriedade e estado do objeto, multi-tenant, auditoria da decisão",
            "Um bug (checagem esquecida numa rota), consultas sem filtro, acesso ao banco por outro caminho (scripts, ferramentas, outros serviços)",
            "Regras duplicadas entre serviços divergem; use um módulo comum ou um serviço de decisão (veja Q114)",
          ],
          [
            "Camada de dados (row-level security, permissões do banco, views, mascaramento)",
            "Isolar tenants e linhas mesmo com bug na aplicação; privilégio mínimo da conexão; trilha de acesso",
            "Regras que dependem do contexto da requisição (horário, limite de aprovação) e uma conta de aplicação com privilégios amplos, que ignora a política",
            "Mais difícil de testar e de evoluir; exige definir o contexto do usuário em cada transação",
          ],
          [
            "Interface (menu e botões escondidos)",
            "Experiência de uso: mostrar só o que a pessoa pode tentar",
            "Nada: quem chama a API diretamente ignora a tela",
            "Nunca conte com ela como controle de segurança",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Combine as camadas, cada uma com o seu papel, e **nunca só o gateway**. **Borda**: autentica, valida o token (emissor, audience, assinatura), exige escopos grossos por rota e corta o que nunca deveria entrar. **Serviço**: decide a regra de negócio e a posse do objeto num único lugar e valida o token de novo (zero trust: chamada interna não é confiável só por estar dentro). **Dados**: reforça o isolamento por tenant e o privilégio mínimo da conexão, para que um bug no serviço não vaze tudo. Em nuvem, some a isso o IAM do provedor para os recursos (políticas estreitas, endpoints privados, criptografia com chaves governadas, veja Q111) e a identidade do usuário propagada entre serviços (veja Q84).",
      },
      {
        tipo: "codigo",
        titulo: "Reforço na camada de dados: row-level security no PostgreSQL",
        legenda: "SQL",
        codigo: `ALTER TABLE prontuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE prontuarios FORCE ROW LEVEL SECURITY;   -- vale também para o dono da tabela

CREATE POLICY isolamento_por_tenant ON prontuarios
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- A aplicação, já autenticada, fixa o tenant no início de cada transação:
-- SELECT set_config('app.tenant_id', '<tenant do token validado>', true);`,
        nota: "A conexão da aplicação não pode ser de superusuário nem ter `BYPASSRLS`, ou a política é ignorada. Com pool de conexões, fixe o contexto por transação (o terceiro argumento `true` do `set_config` o limita à transação) para que ele não vaze de uma requisição para outra.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Três armadilhas clássicas",
        texto:
          "**Confiar na borda**: o gateway valida o token e repassa `X-User-Id`; um serviço que confia no cabeçalho é enganado por quem o alcança por outro caminho (outro serviço comprometido, a rede interna). **Esquecer as chamadas internas**: filas, jobs, webhooks e chamadas entre serviços não passam pelo gateway e precisam das mesmas checagens, com uma identidade própria. **Esconder o botão**: ocultar um menu ou desabilitar um botão não impede ninguém de chamar a API diretamente; a autorização é sempre do servidor. Some o “confused deputy”: um serviço com muito poder atende em nome de um usuário com pouco e acaba fazendo o que o usuário não poderia.",
      },
    ],
    armadilhas: [
      "Validar o token no gateway e confiar em cabeçalhos de identidade nos serviços, sem autenticar a origem (mTLS, token repassado).",
      "Checar o papel (“tem acesso a pedidos?”) sem checar o objeto (“este pedido é dele?”): um id trocado na URL abre dados alheios (veja Q136).",
      "Esquecer filas, jobs e chamadas entre serviços, que não passam pelo gateway.",
      "Usar a camada de dados com a conta do dono ou de superusuário, que ignora o RLS, ou esquecer de definir o contexto do tenant em cada transação.",
    ],
    autoteste: [
      {
        pergunta: "Por que não basta autorizar no API gateway?",
        resposta:
          "O gateway vê a rota e o token, mas não conhece o dono do objeto, o estado do recurso nem as regras de negócio, e não vê as chamadas que não passam por ele (entre serviços, jobs). A decisão fina precisa estar no serviço, e o isolamento é reforçado nos dados.",
      },
      {
        pergunta: "Para que serve a camada de dados se o serviço já autoriza?",
        resposta:
          "Para a defesa em profundidade: se o serviço tiver um bug (filtro esquecido, rota sem checagem), o banco ainda restringe as linhas, como no isolamento por tenant com RLS. Ela não substitui o serviço, que conhece o contexto da requisição.",
      },
    ],
  },
  en: {
    titulo: "Where to enforce authorization",
    pergunta:
      "Where should authorization be enforced: at the API gateway, in each service or in the data layer? Compare the options and say what each one cannot protect.",
    porqueEsteMetodo:
      "The question is where to put the check, and each place sees different things. A matrix by layer shows what each one decides well and, above all, what it cannot protect, which is what justifies combining them.",
    resposta30s:
      "Enforce authorization in **layers**: the **gateway** at the edge does the coarse work (authentication, scopes, limits), **each service** applies the business rules and **object ownership**, and the **data layer** reinforces isolation (for example, with row-level security) as **defense in depth**. **Never the gateway alone**: it does not see the object’s owner or the internal calls. Hiding the button in the interface is usability, not authorization.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "What each layer decides and what it cannot protect",
        colunas: ["Layer", "What it decides well", "What it cannot protect", "Watch out for"],
        linhas: [
          [
            "Edge (API gateway, proxy, WAF)",
            "Authentication (valid token, issuer, audience), coarse scopes per route, rate limiting, blocking routes that must never be exposed",
            "Object ownership (is `/orders/42` this user’s?), business rules and any call that does not go through it (service to service, queues, jobs)",
            "Services must not trust identity headers just because the gateway exists",
          ],
          [
            "Each service (middleware, policies, handlers)",
            "Business rules, object ownership and state, multi-tenancy, auditing of the decision",
            "A bug (a check forgotten on a route), unfiltered queries, access to the database by another path (scripts, tools, other services)",
            "Rules duplicated across services drift apart; use a shared module or a decision service (see Q114)",
          ],
          [
            "Data layer (row-level security, database permissions, views, masking)",
            "Isolating tenants and rows even with a bug in the application; least privilege for the connection; an access trail",
            "Rules that depend on request context (time, approval limit) and an application account with broad privileges, which ignores the policy",
            "Harder to test and to evolve; needs the user context set on every transaction",
          ],
          [
            "Interface (hidden menus and buttons)",
            "Usability: showing only what the person can try",
            "Nothing: whoever calls the API directly bypasses the screen",
            "Never count on it as a security control",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Combine the layers, each with its own role, and **never the gateway alone**. **Edge**: authenticates, validates the token (issuer, audience, signature), requires coarse scopes per route and cuts off what should never get in. **Service**: decides the business rule and object ownership in a single place and validates the token again (zero trust: an internal call is not trusted just because it is inside). **Data**: reinforces tenant isolation and least privilege for the connection, so a bug in the service does not leak everything. In the cloud, add the provider’s IAM for resources (narrow policies, private endpoints, encryption with governed keys, see Q111) and the user’s identity propagated between services (see Q84).",
      },
      {
        tipo: "codigo",
        titulo: "Reinforcing at the data layer: row-level security in PostgreSQL",
        legenda: "SQL",
        codigo: `ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE records FORCE ROW LEVEL SECURITY;   -- also applies to the table owner

CREATE POLICY tenant_isolation ON records
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- The application, already authenticated, sets the tenant at the start of each transaction:
-- SELECT set_config('app.tenant_id', '<tenant from the validated token>', true);`,
        nota: "The application’s connection must not be a superuser or have `BYPASSRLS`, or the policy is ignored. With connection pooling, set the context per transaction (the third argument `true` of `set_config` limits it to the transaction) so it does not leak from one request to another.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Three classic traps",
        texto:
          "**Trusting the edge**: the gateway validates the token and forwards `X-User-Id`; a service that trusts the header is fooled by whoever reaches it by another path (another compromised service, the internal network). **Forgetting internal calls**: queues, jobs, webhooks and service-to-service calls do not go through the gateway and need the same checks, with an identity of their own. **Hiding the button**: hiding a menu or disabling a button stops nobody from calling the API directly; authorization always belongs to the server. Add the confused deputy: a service with a lot of power acts on behalf of a user with little and ends up doing what the user could not.",
      },
    ],
    armadilhas: [
      "Validating the token at the gateway and trusting identity headers in the services without authenticating the source (mTLS, a forwarded token).",
      "Checking the role (“does the user have access to orders?”) without checking the object (“is this order theirs?”): a swapped id in the URL opens someone else’s data (see Q136).",
      "Forgetting queues, jobs and service-to-service calls, which do not go through the gateway.",
      "Using the data layer with the owner or superuser account, which ignores RLS, or forgetting to set the tenant context on every transaction.",
    ],
    autoteste: [
      {
        pergunta: "Why is authorizing at the API gateway not enough?",
        resposta:
          "The gateway sees the route and the token, but it does not know the object’s owner, the resource’s state or the business rules, and it does not see calls that bypass it (between services, jobs). The fine-grained decision has to be in the service, with isolation reinforced in the data.",
      },
      {
        pergunta: "What is the data layer for if the service already authorizes?",
        resposta:
          "For defense in depth: if the service has a bug (a forgotten filter, a route without a check), the database still restricts the rows, as in tenant isolation with RLS. It does not replace the service, which knows the request context.",
      },
    ],
  },
};
