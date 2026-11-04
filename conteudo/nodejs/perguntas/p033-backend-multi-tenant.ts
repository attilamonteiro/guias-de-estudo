import type { Pergunta } from "../../tipos";

// P33 · Backend multi-tenant
export const p033: Pergunta = {
  numero: 733,
  modulo: "pawanmkr-arquitetura",
  metodo: "design",
  pt: {
    titulo: "Backend multi-tenant",
    pergunta: "Como você construiria um sistema de backend multi-tenant com Express e Node.js?",
    porqueEsteMetodo:
      "É um problema de desenho de sistema com decisões encadeadas (requisitos, dados, identificação, isolamento, operação). Um roteiro de design evita sair direto para a tecnologia e mostra onde cada escolha custa.",
    resposta30s:
      "Em um sistema **multi-tenant**, vários clientes (tenants) usam a mesma aplicação com os dados **isolados**. Escolha o modelo de dados pelo isolamento exigido e pelo custo: **banco por tenant**, **esquema por tenant** ou **tabelas compartilhadas com `tenant_id`** (com **row-level security** como rede de segurança). No Express, um **middleware** identifica o tenant a partir do token autenticado e propaga o contexto (`AsyncLocalStorage`); todo acesso a dados, cache, fila e arquivo passa por um ponto que aplica o tenant, e cotas por tenant contêm o **vizinho barulhento**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos antes de tecnologia",
            texto:
              "Defina quantos tenants existirão (e se há poucos gigantes e muitos pequenos), quanto isolamento o contrato e a conformidade exigem (por exemplo, onde os dados podem ficar), quanta personalização cada um precisa (campos, regras, marca) e quanto cada tenant pode custar. Esses quatro pontos decidem o modelo de dados.",
          },
          {
            titulo: "2. Escolha o modelo de dados",
            texto:
              "Banco por tenant, esquema por tenant ou tabelas compartilhadas com `tenant_id` (tabela abaixo). Em tabelas compartilhadas, ponha `tenant_id` em toda tabela, nas chaves únicas e nos índices (a unicidade passa a valer por tenant) e ative a row-level security quando o banco oferecer.",
          },
          {
            titulo: "3. Identifique o tenant em um middleware",
            texto:
              "O tenant pode vir do subdomínio, de um cabeçalho ou de uma claim do token. Prefira a claim do token já validado, ou confira que o usuário autenticado pertence ao tenant pedido. O middleware coloca o tenant no contexto da requisição com `AsyncLocalStorage` (veja L84), e quem precisar o lê de lá, sem passar parâmetro por toda função. Tenant ausente ou desconhecido: responda `401` ou `404`, nunca assuma um padrão.",
          },
          {
            titulo: "4. Torne o vazamento impossível, não improvável",
            texto:
              "Um único ponto de acesso a dados aplica o filtro do tenant (repositório, escopo do ORM ou transação com RLS, como no exemplo). Cache, filas e arquivos levam o tenant na chave, no nome da fila ou no prefixo do armazenamento. Jobs em segundo plano recebem o `tenantId` na mensagem, porque o contexto não atravessa a fila. Escreva testes com dois tenants em que um tenta ler os dados do outro.",
          },
          {
            titulo: "5. Contenha o vizinho barulhento",
            texto:
              "Limite de taxa e cotas por tenant (veja L49), pools e filas com limites por tenant, trabalho pesado fora do caminho da requisição. Meça por tenant: logs e traces levam o `tenantId`; em métricas, cuidado com o número de séries, e use o tenant só quando o total for pequeno ou para os maiores.",
          },
          {
            titulo: "6. Opere muitos tenants",
            texto:
              "Migrações em muitos bancos ou esquemas rodam em lotes, com a versão registrada por tenant e tolerância a tenants em versões diferentes por um tempo. Criar e remover tenant (inclusive exportar e apagar dados) vira rotina automatizada. Quando um tenant cresce demais ou exige isolamento físico, mova-o para banco ou ambiente próprio; o ponto único de acesso é o que torna isso possível sem reescrever as regras de negócio.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Modelos de dados para multi-tenant",
        colunas: ["Modelo", "Isolamento", "Custo e operação", "Migrações", "Quando escolher"],
        linhas: [
          [
            "Banco por tenant",
            "O mais forte: credenciais, backup, restauração e localização próprios",
            "Mais caro; muitos bancos e conexões para gerenciar",
            "Rodam em cada banco, e uma falha parcial deixa tenants em versões diferentes",
            "Poucos tenants grandes ou exigência regulatória ou contratual de isolamento",
          ],
          [
            "Esquema por tenant",
            "Forte: um espaço de nomes por tenant no mesmo banco, com permissões por esquema",
            "Custo médio; o catálogo do banco cresce com o número de tenants",
            "Rodam em cada esquema, também com controle de versão",
            "Número moderado de tenants que precisam personalizar tabelas",
          ],
          [
            "Tabelas compartilhadas com `tenant_id`",
            "Lógico: depende de filtro obrigatório e, de preferência, de row-level security",
            "O mais barato; escala bem em número de tenants",
            "Uma só migração para todos",
            "Muitos tenants pequenos, com o mesmo esquema",
          ],
          [
            "Híbrido",
            "Compartilhado para a maioria e banco próprio para quem exige",
            "Duas formas de operar e mais código de roteamento",
            "Duas trilhas de migração",
            "Base heterogênea, com poucos tenants grandes ou regulados",
          ],
        ],
        nota: "Qualquer modelo pede o mesmo contrato ao código: receber “o acesso a dados do tenant atual” de um ponto único.",
      },
      {
        tipo: "codigo",
        titulo: "Transação restrita ao tenant (PostgreSQL + RLS)",
        legenda: "JavaScript",
        codigo: `// No banco, uma vez por tabela:
//   ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
//   CREATE POLICY por_tenant ON pedidos
//     USING (tenant_id = current_setting('app.tenant_id')::uuid);
export async function comTenant(pool, tenantId, trabalho) {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    // true = vale só nesta transação; o pool reaproveita a conexão
    await cliente.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const resultado = await trabalho(cliente);
    await cliente.query("COMMIT");
    return resultado;
  } catch (erro) {
    await cliente.query("ROLLBACK");
    throw erro;
  } finally {
    cliente.release();
  }
}`,
        nota: "O `tenantId` vem do contexto que o middleware preencheu. Tudo o que roda dentro de `trabalho` só enxerga as linhas do tenant, mesmo que alguém esqueça o `WHERE`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Comece pelo requisito de isolamento, não pelo gosto: exigência regulatória ou contratual forte aponta para banco ou esquema por tenant; muitos tenants pequenos e iguais apontam para tabelas compartilhadas com `tenant_id` e RLS. Seja qual for a escolha, o resto do código só pede o acesso do tenant atual a **um ponto único**, o que permite trocar de modelo (ou mover um tenant grande para ambiente próprio) sem reescrever as regras.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os dois furos clássicos",
        texto:
          "(1) O tenant vir de algo que o cliente controla (cabeçalho, corpo, subdomínio) sem conferir que o usuário autenticado pertence a ele: é falha de autorização entre tenants. (2) A RLS não proteger nada: no PostgreSQL, superusuários ignoram a política e o dono da tabela também, a menos que se use `FORCE ROW LEVEL SECURITY`; e a variável do tenant gravada na sessão do pool, em vez de na transação, vaza para a requisição seguinte. Prove com um teste de dois tenants.",
      },
    ],
    armadilhas: [
      "Confiar no `X-Tenant-ID` enviado pelo cliente sem checar que o usuário autenticado pertence àquele tenant: qualquer um lê os dados de qualquer um.",
      "Esquecer o filtro em uma consulta isolada (relatório, job, `JOIN` ou SQL cru): sem ponto único de acesso e sem RLS, basta um esquecimento para vazar dados.",
      "Cache, fila ou arquivo sem o tenant na chave: o `usuario:42` de um tenant colide com o de outro, e o contexto do `AsyncLocalStorage` não atravessa a fila, então o job perde o tenant.",
      "Rodar migrações em todos os tenants de uma vez, sem registro de versão: uma falha no meio deixa tenants em estados diferentes, e o código novo assume um esquema que alguns não têm.",
    ],
    autoteste: [
      {
        pergunta: "Por que o tenant deve sair do token validado e não de um campo do corpo da requisição?",
        resposta:
          "Porque tudo o que o cliente envia pode ser forjado: se o tenant vem dele sem checagem, um usuário de um tenant pede os dados de outro. O token validado pelo servidor diz a quem o usuário realmente pertence.",
      },
      {
        pergunta: "Como impedir que um tenant grande degrade os demais?",
        resposta:
          "Com limite de taxa e cotas por tenant, pools e filas com limites por tenant, trabalho pesado em fila com workers e métricas por tenant para enxergar quem consome. Se for preciso, mova o tenant para banco ou ambiente próprio.",
      },
    ],
  },
  en: {
    titulo: "A multi-tenant backend",
    pergunta: "How would you build a multi-tenant backend system with Express and Node.js?",
    porqueEsteMetodo:
      "It is a system design problem with chained decisions (requirements, data, identification, isolation, operation). A design script keeps you from jumping straight to technology and shows where each choice costs.",
    resposta30s:
      "In a **multi-tenant** system, several customers (tenants) share one application with **isolated** data. Pick the data model by the isolation you need and the cost: a **database per tenant**, a **schema per tenant**, or **shared tables with a `tenant_id`** (with **row-level security** as a safety net). In Express, a **middleware** identifies the tenant from the authenticated token and propagates the context (`AsyncLocalStorage`); every access to data, cache, queues and files goes through one point that applies the tenant, and per-tenant quotas contain the **noisy neighbor**.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements before technology",
            texto:
              "Define how many tenants there will be (and whether there are a few giants and many small ones), how much isolation the contract and compliance demand (for example, where the data may live), how much customization each one needs (fields, rules, branding) and how much each tenant is allowed to cost. These four points decide the data model.",
          },
          {
            titulo: "2. Choose the data model",
            texto:
              "A database per tenant, a schema per tenant, or shared tables with a `tenant_id` (table below). With shared tables, put `tenant_id` on every table, in unique keys and in indexes (uniqueness becomes per tenant) and turn on row-level security when the database offers it.",
          },
          {
            titulo: "3. Identify the tenant in middleware",
            texto:
              "The tenant can come from the subdomain, a header or a token claim. Prefer the claim of an already validated token, or check that the authenticated user belongs to the requested tenant. The middleware puts the tenant in the request context with `AsyncLocalStorage` (see L84), and whoever needs it reads it from there, without passing a parameter through every function. Missing or unknown tenant: answer `401` or `404`, never assume a default.",
          },
          {
            titulo: "4. Make leaks impossible, not unlikely",
            texto:
              "A single data-access point applies the tenant filter (repository, ORM scope or a transaction with RLS, as in the example). Cache, queues and files carry the tenant in the key, the queue name or the storage prefix. Background jobs receive the `tenantId` in the message, because the context does not cross the queue. Write tests with two tenants in which one tries to read the other’s data.",
          },
          {
            titulo: "5. Contain the noisy neighbor",
            texto:
              "Rate limits and quotas per tenant (see L49), pools and queues with per-tenant limits, heavy work off the request path. Measure per tenant: logs and traces carry the `tenantId`; in metrics, watch the number of series, and use the tenant only when the total is small or for the largest ones.",
          },
          {
            titulo: "6. Operate many tenants",
            texto:
              "Migrations across many databases or schemas run in batches, with the version recorded per tenant and tolerance for tenants being on different versions for a while. Creating and removing a tenant (including exporting and erasing data) becomes an automated routine. When a tenant grows too large or demands physical isolation, move it to its own database or environment; the single access point is what makes that possible without rewriting business rules.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Data models for multi-tenancy",
        colunas: ["Model", "Isolation", "Cost and operation", "Migrations", "When to choose it"],
        linhas: [
          [
            "Database per tenant",
            "The strongest: its own credentials, backup, restore and location",
            "Most expensive; many databases and connections to manage",
            "Run on each database, and a partial failure leaves tenants on different versions",
            "A few large tenants, or a regulatory or contractual isolation requirement",
          ],
          [
            "Schema per tenant",
            "Strong: one namespace per tenant in the same database, with permissions per schema",
            "Medium cost; the database catalog grows with the number of tenants",
            "Run on each schema, also with version tracking",
            "A moderate number of tenants that need to customize tables",
          ],
          [
            "Shared tables with `tenant_id`",
            "Logical: relies on a mandatory filter and, preferably, row-level security",
            "The cheapest; scales well in number of tenants",
            "One migration for everyone",
            "Many small tenants with the same schema",
          ],
          [
            "Hybrid",
            "Shared for most, a dedicated database for those who require it",
            "Two ways to operate and more routing code",
            "Two migration tracks",
            "A heterogeneous base, with a few large or regulated tenants",
          ],
        ],
        nota: "Every model asks the same contract of the code: receive “the data access of the current tenant” from a single point.",
      },
      {
        tipo: "codigo",
        titulo: "A tenant-scoped transaction (PostgreSQL + RLS)",
        legenda: "JavaScript",
        codigo: `// In the database, once per table:
//   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
//   CREATE POLICY per_tenant ON orders
//     USING (tenant_id = current_setting('app.tenant_id')::uuid);
export async function withTenant(pool, tenantId, work) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // true = lasts only for this transaction; the pool reuses the connection
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}`,
        nota: "The `tenantId` comes from the context the middleware filled in. Everything that runs inside `work` sees only the tenant’s rows, even if someone forgets the `WHERE`.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Start from the isolation requirement, not from taste: a strong regulatory or contractual demand points to a database or schema per tenant; many small, identical tenants point to shared tables with `tenant_id` and RLS. Whichever you pick, the rest of the code asks for the current tenant’s access from **a single point**, which lets you switch models (or move a large tenant to its own environment) without rewriting the rules.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The two classic holes",
        texto:
          "(1) The tenant coming from something the client controls (header, body, subdomain) without checking that the authenticated user belongs to it: that is an authorization flaw across tenants. (2) RLS protecting nothing: in PostgreSQL, superusers bypass the policy and so does the table owner, unless you use `FORCE ROW LEVEL SECURITY`; and the tenant variable stored on the pool session instead of the transaction leaks into the next request. Prove it with a two-tenant test.",
      },
    ],
    armadilhas: [
      "Trusting the client’s `X-Tenant-ID` without checking that the authenticated user belongs to that tenant: anyone can read anyone’s data.",
      "Forgetting the filter in one isolated query (report, job, `JOIN` or raw SQL): with no single access point and no RLS, one slip is enough to leak data.",
      "Cache, queue or file without the tenant in the key: one tenant’s `user:42` collides with another’s, and the `AsyncLocalStorage` context does not cross the queue, so the job loses the tenant.",
      "Running migrations on all tenants at once, with no version tracking: a failure halfway leaves tenants in different states, and the new code assumes a schema some of them lack.",
    ],
    autoteste: [
      {
        pergunta: "Why should the tenant come from the validated token and not from a field in the request body?",
        resposta:
          "Because anything the client sends can be forged: if the tenant comes from it unchecked, a user of one tenant asks for another tenant’s data. The token validated by the server says who the user really belongs to.",
      },
      {
        pergunta: "How do you stop one large tenant from degrading the others?",
        resposta:
          "With per-tenant rate limits and quotas, pools and queues with per-tenant limits, heavy work in a queue with workers, and per-tenant metrics to see who consumes what. If needed, move the tenant to its own database or environment.",
      },
    ],
  },
};
