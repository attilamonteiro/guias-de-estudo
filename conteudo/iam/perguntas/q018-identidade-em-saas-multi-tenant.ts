import type { Pergunta } from "../../tipos";

// Q18 · Identidade em SaaS multi-tenant
export const q018: Pergunta = {
  numero: 18,
  modulo: "fundamentos",
  metodo: "design",
  pt: {
    titulo: "Identidade em SaaS multi-tenant",
    pergunta:
      "Como você projetaria a gestão de identidade de um produto SaaS multi-tenant: onde ficam os usuários, como separar tenants e como cada cliente traz o seu próprio IdP?",
    porqueEsteMetodo:
      "É uma pergunta de projeto com decisões encadeadas (onde ficam os usuários, como separar tenants, como cada cliente traz o IdP). Um roteiro fixo, dos requisitos aos gargalos, evita esquecer uma delas e deixa o raciocínio visível.",
    resposta30s:
      "Modele a **pessoa** como identidade global, o **tenant** como a organização e o **vínculo (membership)** entre eles como o lugar dos **papéis**. Identifique o tenant por uma fonte confiável (subdomínio, domínio verificado do e-mail ou claim do token), nunca por um parâmetro que o cliente controla, e deixe **cada cliente federar o seu IdP** (OIDC ou SAML), com **SCIM** para provisionamento. Isole os dados por `tenant_id` em toda consulta, de preferência reforçado pelo banco, e teste explicitamente o vazamento entre tenants.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Pergunte: os usuários são funcionários dos clientes (B2B) ou consumidores (B2C)? Haverá SSO corporativo com o IdP do cliente? Quem administra cada tenant? Há exigência de isolamento forte, residência de dados ou auditoria por tenant? Quantos tenants e usuários, e quão grandes são os maiores? Respostas diferentes mudam o desenho.",
          },
          {
            titulo: "2. Modelo de dados",
            texto:
              "Três entidades: `usuario` (a pessoa, identidade global), `tenant` (a organização) e `membership` (usuário, tenant, papel, estado). O papel mora no vínculo, não no usuário, porque a mesma pessoa pode ser administradora em um tenant e leitora em outro. Identidades externas ficam em tabela à parte (emissor + `sub` apontando para o usuário); não use o e-mail como chave de ligação.",
          },
          {
            titulo: "3. Identificar o tenant",
            texto:
              "Por subdomínio (`acme.app.exemplo.com`), pelo domínio do e-mail (descoberta do IdP), por um claim no token ou por seleção explícita quando a pessoa pertence a vários. Regra: o tenant da requisição vem do token ou da sessão já validados, nunca de um cabeçalho, caminho ou corpo que o cliente possa alterar sem verificação.",
          },
          {
            titulo: "4. Federação por cliente",
            texto:
              "Cada tenant cadastra o seu IdP (URL de descoberta OIDC ou metadados SAML) e o app guarda essa configuração por tenant. O cliente prova que é dono do domínio (registro DNS) antes de poder forçar SSO nele. Provisionamento: SCIM a partir do IdP do cliente ou criação no primeiro login (JIT), para clientes menores.",
          },
          {
            titulo: "5. Papéis e isolamento",
            texto:
              "Papéis por tenant (administrador, membro, leitor e, se preciso, papéis personalizados), verificados no servidor. Toda consulta filtra por `tenant_id`; o banco reforça com row-level security, ou schema ou banco por tenant para quem exige isolamento forte. Chaves de cache, filas e jobs também carregam o tenant.",
          },
          {
            titulo: "6. Gargalos e evolução",
            texto:
              "Migração dos usuários existentes sem forçar troca de senha; a mesma pessoa em vários tenants (alternar de tenant sem novo login, e-mail que muda); o IdP fora do ar de um cliente não pode afetar os demais; auditoria exportável por tenant; saída do cliente (exportar e apagar); clientes grandes que pedem domínio próprio e políticas de sessão e MFA diferentes.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Onde ficam os usuários",
        colunas: ["Modelo", "Como funciona", "Vantagens", "Limites"],
        linhas: [
          [
            "Pool único (usuário global com memberships)",
            "Uma tabela de usuários; cada pessoa se liga aos tenants por memberships",
            "Uma conta para quem atua em vários tenants; operação simples; um lugar só para MFA e recuperação",
            "Raio de impacto maior; políticas por tenant pedem lógica própria; erro de filtro vaza entre tenants",
          ],
          [
            "Um pool ou realm por tenant",
            "Cada cliente tem um diretório separado no provedor de identidade",
            "Isolamento forte; políticas, IdP e identidade visual por cliente com facilidade",
            "O custo operacional cresce com o número de tenants; quem atua em vários tenants tem várias contas; limites do produto",
          ],
          [
            "Só federação (o SaaS não guarda credenciais)",
            "O IdP do cliente autentica; o SaaS guarda apenas o vínculo emissor + `sub` e o perfil",
            "Nenhuma senha para proteger; SSO corporativo e desligamento feito no IdP do cliente",
            "Clientes sem IdP precisam de outra opção; depende da disponibilidade do IdP de cada um",
          ],
          [
            "Híbrido",
            "Pool único com federação por tenant e login local (senha com MFA ou passkey) para quem não tem IdP",
            "Atende de clientes pequenos a grandes",
            "Mais regras: qual método vale para cada domínio e como evitar contas duplicadas",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Login de um usuário de cliente com IdP próprio",
        etapas: [
          "A pessoa abre `acme.app.exemplo.com` (ou digita o e-mail) e o app resolve o tenant `acme`",
          "O app carrega a configuração de federação desse tenant e redireciona ao IdP do cliente, com `state`, `nonce` e PKCE",
          "O IdP do cliente autentica a pessoa (com as regras de MFA do cliente) e devolve o código ou a asserção",
          "O app valida assinatura, `iss`, `aud` e `nonce` com a configuração deste tenant e procura o vínculo emissor + `sub`; se não existe, aplica a regra de provisionamento (convite ou JIT)",
          "O app confere que há um membership ativo no tenant e emite a sessão com `tenant_id` e papéis",
          "Cada requisição seguinte usa o `tenant_id` da sessão em toda consulta, no cache e nos logs",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O desenho em uma frase",
        texto:
          "**Pessoa global, papel local ao tenant, tenant vindo de fonte confiável e IdP configurado por tenant.** O resto (SCIM, auditoria, isolamento no banco) deriva dessas quatro decisões.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Vazamento entre tenants",
        texto:
          "As causas costumam ser pequenas: aceitar o `tenant_id` de um parâmetro do cliente, uma consulta sem o filtro, uma chave de cache sem o tenant, um job que perdeu o contexto. A ligação de conta por e-mail é a mais grave: se o app liga o usuário ao e-mail que o IdP afirma, um cliente mal-intencionado, com um IdP seu, declara o e-mail de alguém de outro tenant e assume a conta. Ligue por emissor + `sub` e exija domínio verificado. Defenda em camadas: filtro obrigatório no acesso a dados, row-level security, testes automáticos que tentam ler dados de outro tenant e logs com o tenant em cada evento.",
      },
    ],
    armadilhas: [
      "Tratar o tenant como um parâmetro da requisição: quem altera o parâmetro lê os dados de outro cliente.",
      "Ligar a conta do IdP ao usuário pelo e-mail: um IdP mal configurado ou malicioso consegue assumir contas; use emissor + `sub` e domínio verificado.",
      "Guardar o papel no usuário em vez de no vínculo com o tenant: quem atua em dois clientes ganha ou perde privilégios nos dois ao mesmo tempo.",
      "Esquecer cache, filas e jobs: o isolamento de tenant precisa existir fora do banco também.",
    ],
    autoteste: [
      {
        pergunta: "Por que o papel fica no membership e não no usuário?",
        resposta:
          "Porque a mesma pessoa pode ter papéis diferentes em tenants diferentes. Com o papel no usuário, ela teria o mesmo poder em todos, ou você criaria uma conta por tenant.",
      },
      {
        pergunta: "Como cada cliente traz o próprio IdP sem abrir brechas?",
        resposta:
          "Cada tenant cadastra a configuração do seu IdP (OIDC ou SAML); o app valida emissor, público e assinatura com a configuração daquele tenant, liga usuários por emissor + `sub` e exige prova de propriedade do domínio antes de aceitar asserções para ele.",
      },
    ],
  },
  en: {
    titulo: "Identity in multi-tenant SaaS",
    pergunta:
      "How would you design identity management for a multi-tenant SaaS product: where do users live, how are tenants separated, and how does each customer bring its own IdP?",
    porqueEsteMetodo:
      "This is a design question with chained decisions (where users live, how tenants are separated, how each customer brings its IdP). A fixed script, from requirements to bottlenecks, avoids forgetting one of them and makes the reasoning visible.",
    resposta30s:
      "Model the **person** as a global identity, the **tenant** as the organization and the **membership** linking them as the home of **roles**. Identify the tenant from a trusted source (subdomain, verified email domain or token claim), never from a parameter the client controls, and let **each customer federate its own IdP** (OIDC or SAML), with **SCIM** for provisioning. Isolate data by `tenant_id` in every query, preferably enforced by the database, and explicitly test for cross-tenant leakage.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Ask: are the users customers’ employees (B2B) or consumers (B2C)? Will there be corporate SSO with the customer’s IdP? Who administers each tenant? Is there a need for strong isolation, data residency or per-tenant auditing? How many tenants and users, and how big are the largest? Different answers change the design.",
          },
          {
            titulo: "2. Data model",
            texto:
              "Three entities: `user` (the person, a global identity), `tenant` (the organization) and `membership` (user, tenant, role, status). The role lives on the link, not on the user, because the same person can be an administrator in one tenant and a reader in another. External identities go in a separate table (issuer + `sub` pointing to the user); do not use email as the linking key.",
          },
          {
            titulo: "3. Identifying the tenant",
            texto:
              "By subdomain (`acme.app.example.com`), by email domain (IdP discovery), by a claim in the token or by explicit selection when the person belongs to several. Rule: the request’s tenant comes from an already validated token or session, never from a header, path or body the client can change without verification.",
          },
          {
            titulo: "4. Federation per customer",
            texto:
              "Each tenant registers its IdP (OIDC discovery URL or SAML metadata) and the app stores that configuration per tenant. The customer proves it owns the domain (a DNS record) before it can force SSO on it. Provisioning: SCIM from the customer’s IdP or creation at first sign-in (JIT), for smaller customers.",
          },
          {
            titulo: "5. Roles and isolation",
            texto:
              "Per-tenant roles (administrator, member, reader and, if needed, custom roles), checked on the server. Every query filters by `tenant_id`; the database reinforces it with row-level security, or a schema or database per tenant for those who need strong isolation. Cache keys, queues and jobs carry the tenant too.",
          },
          {
            titulo: "6. Bottlenecks and evolution",
            texto:
              "Migrating existing users without forcing a password change; the same person in several tenants (switching tenant without a new sign-in, an email that changes); one customer’s IdP being down must not affect the others; auditing exportable per tenant; customer exit (export and delete); large customers asking for their own domain and different session and MFA policies.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Where users live",
        colunas: ["Model", "How it works", "Advantages", "Limits"],
        linhas: [
          [
            "Single pool (global user with memberships)",
            "One user table; each person links to tenants through memberships",
            "One account for people who work in several tenants; simple operation; one place for MFA and recovery",
            "Larger blast radius; per-tenant policies need custom logic; a filter bug leaks across tenants",
          ],
          [
            "One pool or realm per tenant",
            "Each customer has a separate directory in the identity provider",
            "Strong isolation; policies, IdP and branding per customer are easy",
            "Operational cost grows with the number of tenants; people in several tenants have several accounts; product limits",
          ],
          [
            "Federation only (the SaaS stores no credentials)",
            "The customer’s IdP authenticates; the SaaS stores only the issuer + `sub` link and the profile",
            "No passwords to protect; corporate SSO and offboarding handled in the customer’s IdP",
            "Customers without an IdP need another option; depends on each customer’s IdP availability",
          ],
          [
            "Hybrid",
            "Single pool with per-tenant federation and local login (password with MFA, or passkey) for those without an IdP",
            "Serves small to large customers",
            "More rules: which method applies to each domain and how to avoid duplicate accounts",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Sign-in of a customer user with their own IdP",
        etapas: [
          "The person opens `acme.app.example.com` (or types their email) and the app resolves the tenant `acme`",
          "The app loads that tenant’s federation configuration and redirects to the customer’s IdP, with `state`, `nonce` and PKCE",
          "The customer’s IdP authenticates the person (with the customer’s MFA rules) and returns the code or assertion",
          "The app validates signature, `iss`, `aud` and `nonce` with this tenant’s configuration and looks up the issuer + `sub` link; if none exists, it applies the provisioning rule (invitation or JIT)",
          "The app checks that an active membership exists in the tenant and issues the session with `tenant_id` and roles",
          "Every following request uses the session’s `tenant_id` in every query, in the cache and in the logs",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The design in one sentence",
        texto:
          "**A global person, a role local to the tenant, a tenant that comes from a trusted source and an IdP configured per tenant.** Everything else (SCIM, auditing, database isolation) follows from these four decisions.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Cross-tenant leakage",
        texto:
          "The causes are usually small: accepting `tenant_id` from a client parameter, a query without the filter, a cache key without the tenant, a job that lost its context. Linking accounts by email is the worst: if the app links the user by the email the IdP asserts, a malicious customer with an IdP of their own can claim someone else’s email from another tenant and take over the account. Link by issuer + `sub` and require a verified domain. Defend in layers: a mandatory filter in data access, row-level security, automated tests that try to read another tenant’s data and logs carrying the tenant on every event.",
      },
    ],
    armadilhas: [
      "Treating the tenant as a request parameter: whoever changes the parameter reads another customer’s data.",
      "Linking the IdP account to the user by email: a misconfigured or malicious IdP can take over accounts; use issuer + `sub` and a verified domain.",
      "Storing the role on the user instead of on the tenant link: someone working for two customers gains or loses privileges in both at once.",
      "Forgetting caches, queues and jobs: tenant isolation must exist outside the database too.",
    ],
    autoteste: [
      {
        pergunta: "Why does the role live on the membership and not on the user?",
        resposta:
          "Because the same person can have different roles in different tenants. With the role on the user, they would have the same power everywhere, or you would create one account per tenant.",
      },
      {
        pergunta: "How does each customer bring its own IdP without opening gaps?",
        resposta:
          "Each tenant registers its IdP configuration (OIDC or SAML); the app validates issuer, audience and signature with that tenant’s configuration, links users by issuer + `sub` and requires proof of domain ownership before accepting assertions for it.",
      },
    ],
  },
};
