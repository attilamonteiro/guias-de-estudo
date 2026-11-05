import type { Pergunta } from "../../tipos";

// Q117 · Autorização multi-tenant
export const q117: Pergunta = {
  numero: 117,
  modulo: "autorizacao",
  metodo: "design",
  pt: {
    titulo: "Autorização multi-tenant",
    pergunta:
      "Como projetar autorização em um sistema multi-tenant? Como garantir isolamento entre tenants no token, na API e no banco de dados?",
    porqueEsteMetodo:
      "Isolamento entre tenants é um problema de projeto com várias camadas, e o roteiro de design (requisitos, números, contrato, dados, operação) evita defender só uma delas. Cada passo responde onde o tenant entra, quem o confere e o que acontece quando uma camada falha.",
    resposta30s:
      "O isolamento vem de **camadas independentes**: o **token** carrega o tenant ativo e o servidor o valida (nunca confie no tenant que o cliente envia); a **API** monta um contexto de tenant imutável e confere tenant e permissão em cada acesso; o **banco** aplica um **filtro obrigatório por tenant** (RLS ou escopo global) como rede de segurança. Administração da plataforma, jobs, caches e filas seguem a mesma regra, e **testes de isolamento entre dois tenants** provam o resultado.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Nenhum dado nem ação atravessa de um tenant para outro, **mesmo com um bug de aplicação**. Papéis valem **por tenant**: a mesma pessoa pode ser administradora na empresa A e só leitora na B. Quem opera a plataforma tem acesso separado e auditado. Alguns clientes exigem IdP próprio, chaves próprias ou dados em outra região.",
          },
          {
            titulo: "2. Números e modelo de isolamento",
            texto:
              "Estime quantos tenants (poucos e enormes ou milhares de pequenos), o tamanho do maior e o risco de um tenant barulhento consumir tudo. Isso escolhe o modelo de dados (veja a tabela) e quanto custa migrar, fazer backup e restaurar um tenant isolado.",
          },
          {
            titulo: "3. Tenant no token",
            texto:
              "O IdP emite o token **para um tenant ativo** (uma claim como `tid`, `org_id` ou `tenant`; o nome varia) e o servidor valida assinatura, `iss`, `aud` e expiração antes de ler qualquer claim (veja Q53). Quem pertence a vários tenants recebe um token por contexto: trocar de tenant é obter outro token. Papéis podem ir no token ou ser resolvidos no servidor por (usuário, tenant); veja Q76 para o custo de colocá-los no JWT.",
          },
          {
            titulo: "4. API e serviços internos",
            texto:
              "Um middleware único lê o tenant **da identidade validada**, cria um contexto imutável da requisição e o repassa. Tenant na URL (`/t/acme/...`) ou no corpo só é aceito se **bater com o do token**; divergência é recusa e alerta. Cada acesso confere tenant e permissão (veja Q114 e Q115), e recurso de outro tenant responde `404`, para não revelar que existe. Em zero trust vale o mesmo entre serviços: cada chamada interna leva identidade e tenant (veja Q84) e é revalidada, sem confiar na rede interna.",
          },
          {
            titulo: "5. Dados",
            texto:
              "Toda tabela de tenant tem `tenant_id`, e chaves e índices o incluem. O filtro é **obrigatório por construção**: escopo global do ORM ou repositório que nem existe sem tenant e, como rede de segurança, **row-level security (RLS)** no banco. O usuário do banco da aplicação não é dono das tabelas nem ignora a RLS.",
          },
          {
            titulo: "6. Plataforma, operação e gargalos",
            texto:
              "A administração da plataforma usa **outro caminho**: identidade, papéis e acesso JIT próprios (veja Q118), nunca um token comum com tenant “curinga”. Fecham o desenho: auditoria com tenant e ator em cada evento (veja Q139), testes que criam dois tenants e tentam cruzar cada endpoint (veja Q146) e alerta para tentativa de acesso entre tenants.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Modelos de isolamento no banco",
        colunas: ["Modelo", "Isolamento", "Custo e operação", "Quando escolher"],
        linhas: [
          [
            "Tabelas compartilhadas com `tenant_id` (e RLS)",
            "Lógico: depende de filtro e política corretos; um filtro esquecido expõe dados",
            "Mais barato; uma migração para todos; um tenant grande pode prejudicar os demais",
            "Muitos tenants pequenos e dados de sensibilidade parecida",
          ],
          [
            "Um schema por tenant",
            "Separação melhor de objetos e permissões, ainda no mesmo banco",
            "Migrações repetidas por schema; muitos schemas pesam no catálogo do banco",
            "Número moderado de tenants que pedem mais separação",
          ],
          [
            "Um banco por tenant",
            "Forte: credenciais e backups próprios, restauração por tenant",
            "Custo e operação maiores; conexões e migrações multiplicadas",
            "Tenants grandes ou regulados, com exigência contratual de isolamento",
          ],
          [
            "Implantação dedicada (silo)",
            "Máximo: aplicação, banco e rede próprios",
            "Custo alto e operação por cliente",
            "Exigência de isolamento total ou de região, de preferência como opção premium",
          ],
        ],
        nota: "Muitos produtos combinam modelos: padrão compartilhado e banco dedicado para quem precisa. Em qualquer um, o filtro por tenant continua obrigatório na aplicação.",
      },
      {
        tipo: "codigo",
        titulo: "Do token ao banco: o tenant nunca vem do cliente",
        legenda: "TypeScript",
        codigo: `// jwks = createRemoteJWKSet(new URL("https://idp.exemplo.com/.well-known/jwks.json"))
// O tenant vem do token validado. Nunca do corpo, da URL ou de um cabeçalho do cliente.
const { payload } = await jwtVerify(token, jwks, {
  issuer: "https://idp.exemplo.com/",
  audience: "api://faturas",
  algorithms: ["RS256"],
});
const tenantId = payload.tid as string;

const fatura = await db.transaction(async (tx) => {
  // true = vale só nesta transação; sem isso o valor vaza para a próxima requisição do pool
  await tx.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
  return tx.query("SELECT id, valor FROM faturas WHERE id = $1", [faturaId]);
});`,
        nota: "A consulta nem cita o tenant: quem filtra é a RLS (bloco seguinte). Em código real, mantenha também o filtro explícito na aplicação.",
      },
      {
        tipo: "codigo",
        titulo: "A rede de segurança no banco (RLS)",
        legenda: "SQL (PostgreSQL)",
        codigo: `ALTER TABLE faturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE faturas FORCE ROW LEVEL SECURITY; -- vale também para o dono da tabela

CREATE POLICY isolamento_por_tenant ON faturas
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- Sem tenant definido, current_setting devolve NULL e nenhuma linha passa.
-- O papel da aplicação não pode ser superusuário nem ter BYPASSRLS.`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Onde o tenant se perde",
        texto:
          "Três lugares costumam escapar do filtro. **IDs globais**: um `GET /faturas/123` que busca só pelo id é um IDOR entre tenants (veja Q136). **Jobs e filas**: a mensagem precisa carregar o `tenantId`, e o worker restabelece o contexto antes de tocar nos dados; sem isso ele roda “sem tenant” e vê tudo ou nada. **Caches, índices de busca, arquivos e logs**: chave ou prefixo inclui o tenant (`cache:{tenant}:{chave}`). E, com pool de conexões, defina o tenant só dentro da transação: um `SET` de sessão vaza para o próximo cliente do pool.",
      },
    ],
    armadilhas: [
      "Ler o tenant de um cabeçalho, da URL ou do corpo e confiar nele: quem controla a requisição escolhe o tenant.",
      "Filtrar por tenant “quando lembrar”: sem escopo obrigatório e sem RLS, um único `WHERE` esquecido expõe o banco inteiro.",
      "Esquecer o que roda fora da requisição: jobs, consumidores de fila, caches, índices de busca e relatórios que não carregam o tenant.",
      "Dar à equipe da plataforma um token “super” pelo mesmo caminho dos clientes, sem JIT nem auditoria.",
    ],
    autoteste: [
      {
        pergunta: "Por que filtrar por tenant na aplicação não basta, e o que a RLS acrescenta?",
        resposta:
          "Porque basta uma consulta sem o filtro para vazar dados de todos. A RLS é uma segunda camada no próprio banco: mesmo uma consulta esquecida só enxerga as linhas do tenant informado na transação. Ela complementa o filtro da aplicação, não o substitui.",
      },
      {
        pergunta: "De onde a API deve tirar o tenant, e o que fazer se a URL traz outro?",
        resposta:
          "Da identidade validada (a claim do token verificado). Se a URL ou o corpo trazem um tenant diferente, a requisição é recusada e vale registrar o evento, porque pode ser tentativa de acesso cruzado.",
      },
    ],
  },
  en: {
    titulo: "Multi-tenant authorization",
    pergunta:
      "How do you design authorization in a multi-tenant system? How do you guarantee isolation between tenants in the token, the API and the database?",
    porqueEsteMetodo:
      "Tenant isolation is a design problem with several layers, and the design script (requirements, numbers, contract, data, operations) keeps you from defending only one of them. Each step answers where the tenant enters, who checks it and what happens when a layer fails.",
    resposta30s:
      "Isolation comes from **independent layers**: the **token** carries the active tenant and the server validates it (never trust the tenant the client sends); the **API** builds an immutable tenant context and checks tenant and permission on every access; the **database** applies a **mandatory tenant filter** (RLS or a global scope) as a safety net. Platform administration, jobs, caches and queues follow the same rule, and **isolation tests across two tenants** prove the result.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "No data and no action crosses from one tenant to another, **even with an application bug**. Roles are valid **per tenant**: the same person can be an administrator at company A and only a reader at B. Whoever operates the platform has separate, audited access. Some customers require their own IdP, their own keys or data in another region.",
          },
          {
            titulo: "2. Numbers and isolation model",
            texto:
              "Estimate how many tenants (a few huge ones or thousands of small ones), the size of the largest and the risk of a noisy tenant consuming everything. That picks the data model (see the table) and how much it costs to migrate, back up and restore a single tenant.",
          },
          {
            titulo: "3. Tenant in the token",
            texto:
              "The IdP issues the token **for one active tenant** (a claim such as `tid`, `org_id` or `tenant`; the name varies) and the server validates signature, `iss`, `aud` and expiry before reading any claim (see Q53). Someone who belongs to several tenants gets one token per context: switching tenants means obtaining another token. Roles can travel in the token or be resolved on the server by (user, tenant); see Q76 for the cost of putting them in the JWT.",
          },
          {
            titulo: "4. API and internal services",
            texto:
              "A single middleware reads the tenant **from the validated identity**, builds an immutable request context and passes it along. A tenant in the URL (`/t/acme/...`) or in the body is accepted only if it **matches the token’s**; a mismatch is a refusal and an alert. Every access checks tenant and permission (see Q114 and Q115), and a resource from another tenant answers `404`, so as not to reveal that it exists. In zero trust the same holds between services: every internal call carries identity and tenant (see Q84) and is revalidated, without trusting the internal network.",
          },
          {
            titulo: "5. Data",
            texto:
              "Every tenant table has a `tenant_id`, and keys and indexes include it. The filter is **mandatory by construction**: an ORM global scope, or a repository that cannot even exist without a tenant and, as a safety net, **row-level security (RLS)** in the database. The application’s database user does not own the tables and cannot bypass RLS.",
          },
          {
            titulo: "6. Platform, operations and bottlenecks",
            texto:
              "Platform administration uses **another path**: its own identity, roles and JIT access (see Q118), never an ordinary token with a “wildcard” tenant. The design is rounded out by auditing with tenant and actor on every event (see Q139), tests that create two tenants and try to cross every endpoint (see Q146) and an alert for attempted cross-tenant access.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Isolation models in the database",
        colunas: ["Model", "Isolation", "Cost and operations", "When to choose it"],
        linhas: [
          [
            "Shared tables with `tenant_id` (and RLS)",
            "Logical: depends on a correct filter and policy; a forgotten filter exposes data",
            "Cheapest; one migration for everyone; a large tenant can hurt the others",
            "Many small tenants with data of similar sensitivity",
          ],
          [
            "One schema per tenant",
            "Better separation of objects and permissions, still in the same database",
            "Migrations repeated per schema; many schemas weigh on the database catalog",
            "A moderate number of tenants that ask for more separation",
          ],
          [
            "One database per tenant",
            "Strong: own credentials and backups, per-tenant restore",
            "Higher cost and operations; connections and migrations multiplied",
            "Large or regulated tenants with a contractual isolation requirement",
          ],
          [
            "Dedicated deployment (silo)",
            "Maximum: own application, database and network",
            "High cost and per-customer operations",
            "A requirement for total or regional isolation, ideally as a premium option",
          ],
        ],
        nota: "Many products mix models: shared by default and a dedicated database for those who need it. In any of them, the tenant filter stays mandatory in the application.",
      },
      {
        tipo: "codigo",
        titulo: "From token to database: the tenant never comes from the client",
        legenda: "TypeScript",
        codigo: `// jwks = createRemoteJWKSet(new URL("https://idp.example.com/.well-known/jwks.json"))
// The tenant comes from the validated token. Never from the body, the URL or a client header.
const { payload } = await jwtVerify(token, jwks, {
  issuer: "https://idp.example.com/",
  audience: "api://invoices",
  algorithms: ["RS256"],
});
const tenantId = payload.tid as string;

const invoice = await db.transaction(async (tx) => {
  // true = valid only in this transaction; otherwise the value leaks to the next pooled request
  await tx.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
  return tx.query("SELECT id, amount FROM invoices WHERE id = $1", [invoiceId]);
});`,
        nota: "The query does not even mention the tenant: RLS does the filtering (next block). In real code, keep the explicit filter in the application too.",
      },
      {
        tipo: "codigo",
        titulo: "The safety net in the database (RLS)",
        legenda: "SQL (PostgreSQL)",
        codigo: `ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices FORCE ROW LEVEL SECURITY; -- applies to the table owner too

CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);

-- With no tenant set, current_setting returns NULL and no row passes.
-- The application role must not be a superuser or have BYPASSRLS.`,
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where the tenant gets lost",
        texto:
          "Three places tend to escape the filter. **Global IDs**: a `GET /invoices/123` that looks up only by id is a cross-tenant IDOR (see Q136). **Jobs and queues**: the message must carry the `tenantId`, and the worker restores the context before touching data; without it, it runs “with no tenant” and sees everything or nothing. **Caches, search indexes, files and logs**: the key or prefix includes the tenant (`cache:{tenant}:{key}`). And with a connection pool, set the tenant only inside the transaction: a session-level `SET` leaks to the next client of the pool.",
      },
    ],
    armadilhas: [
      "Reading the tenant from a header, the URL or the body and trusting it: whoever controls the request chooses the tenant.",
      "Filtering by tenant “when you remember”: with no mandatory scope and no RLS, a single forgotten `WHERE` exposes the whole database.",
      "Forgetting what runs outside the request: jobs, queue consumers, caches, search indexes and reports that do not carry the tenant.",
      "Giving the platform team a “super” token through the same path as customers, with no JIT and no audit.",
    ],
    autoteste: [
      {
        pergunta: "Why is filtering by tenant in the application not enough, and what does RLS add?",
        resposta:
          "Because one query without the filter is enough to leak everybody’s data. RLS is a second layer in the database itself: even a forgotten query only sees the rows of the tenant set in the transaction. It complements the application filter, it does not replace it.",
      },
      {
        pergunta: "Where should the API take the tenant from, and what should it do if the URL carries another one?",
        resposta:
          "From the validated identity (the claim of the verified token). If the URL or the body carries a different tenant, the request is refused and the event is worth logging, because it may be an attempt at cross-tenant access.",
      },
    ],
  },
};
