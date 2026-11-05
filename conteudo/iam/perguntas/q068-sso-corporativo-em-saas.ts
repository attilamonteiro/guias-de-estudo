import type { Pergunta } from "../../tipos";

// Q68 · SSO corporativo em SaaS
export const q068: Pergunta = {
  numero: 68,
  modulo: "saml",
  metodo: "design",
  pt: {
    titulo: "SSO corporativo em SaaS",
    pergunta:
      "Como você projetaria o suporte a SSO corporativo (SAML e OIDC) em um SaaS multi-tenant em que cada cliente traz o seu IdP?",
    porqueEsteMetodo:
      "É uma pergunta de projeto de sistema, e um roteiro evita tanto esquecer peças (descoberta do tenant, provisionamento, rotação de certificados) quanto mergulhar num detalhe só: requisitos, modelo de dados, descoberta, protocolo, provisionamento e operação, nessa ordem.",
    resposta30s:
      "Trate cada IdP do cliente como uma **conexão configurável por tenant** (SAML ou OIDC, com domínios verificados e mapeamento de papéis), descubra o tenant pelo **domínio do e-mail** (home realm discovery) e valide cada resposta **somente com a configuração daquela conexão**. Complete com **JIT** e **SCIM** para criar e desligar contas, **rotação de certificados** sem queda, **teste de conexão** antes de ativar e um **acesso de emergência**, para o administrador não ficar trancado do lado de fora. A regra de segurança central: o tenant e o domínio são **provados**, nunca deduzidos do que o IdP afirma.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Funcionais: o administrador do cliente configura o SSO sozinho (autoatendimento), vários IdPs e protocolos (SAML e OIDC), SSO obrigatório por domínio, criação e desligamento automáticos de contas e mapeamento de grupos para papéis. Não funcionais: isolamento entre tenants, auditoria, rotação de certificados sem indisponibilidade e suporte que não dependa de um engenheiro para cada cliente.",
          },
          {
            titulo: "2. Modelo de dados",
            texto:
              "Uma entidade `conexão` por IdP (veja o código): tenant, protocolo, estado (`rascunho`, `testada`, `ativa`, `desativada`), SSO obrigatório ou não, domínios com prova de posse, parâmetros do protocolo (certificados, emissor, `clientId`), referência ao segredo no cofre, mapeamento de papéis e opções de provisionamento. O usuário é identificado por `conexão + subject` (`sub` ou `NameID` persistente), e não pelo e-mail (veja Q52).",
          },
          {
            titulo: "3. Descoberta do tenant",
            texto:
              "Duas portas: um endereço por tenant (`acme.app.com`) ou uma tela única que pergunta o e-mail e procura o domínio entre as conexões ativas (home realm discovery). **O domínio só vale depois de provado** (um registro TXT no DNS, por exemplo); sem isso, um tenant poderia reivindicar o domínio de outra empresa e capturar logins. Domínio sem conexão cai no login normal.",
          },
          {
            titulo: "4. Protocolo e callbacks",
            texto:
              "Cada conexão tem o seu callback (por exemplo, `/sso/{conexaoId}/acs` para SAML e `/sso/{conexaoId}/callback` para OIDC). A resposta é validada **só com a configuração da conexão do callback**: certificado, `Issuer`, `Audience` e `InResponseTo` em SAML; `iss`, `aud`, `nonce`, JWKS e PKCE em OIDC (veja Q63 e Q48). Prefira o fluxo iniciado pelo SP (veja Q57).",
          },
          {
            titulo: "5. Provisionamento e papéis",
            texto:
              "**JIT**: cria o usuário no primeiro login, com papel padrão de menor privilégio; é simples, mas não desliga ninguém. **SCIM**: o IdP cria, atualiza e desativa contas, o que fecha o ciclo de saída (veja Q11 e Q13). O mapeamento de grupos do IdP para papéis é uma tabela por tenant, e a resposta do IdP só concede papéis que a tabela prevê.",
          },
          {
            titulo: "6. Operação",
            texto:
              "Certificados: aceite mais de um por conexão durante a troca, leia o metadata do cliente quando houver URL e avise os administradores antes do vencimento (veja Q64). Teste de conexão: um login de prova em modo rascunho, mostrando os erros (relógio, `Audience`, atributo ausente) antes de ativar. Observabilidade: log por conexão, visível ao administrador do cliente. Emergência: veja o aviso abaixo.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Um login, do e-mail à sessão",
        etapas: [
          "A pessoa informa o e-mail em `app.com/login`; o servidor extrai o domínio e procura uma conexão `ativa` com esse domínio **verificado**",
          "Sem conexão, segue o login normal da conta; com SSO obrigatório, o login por senha desse domínio fica desabilitado",
          "O servidor guarda, no estado da requisição, o `conexaoId`, o `state` ou o `ID` da requisição e o `nonce`, e redireciona ao IdP do cliente (`AuthnRequest` no SAML; código de autorização com PKCE no OIDC)",
          "A pessoa autentica no IdP do cliente, com o MFA e as políticas dele",
          "O IdP devolve ao callback **daquela conexão**; o servidor valida assinatura, emissor, destinatário, validade e o vínculo com a requisição pendente",
          "Resolve o usuário por `conexão + subject`; se não existir e o JIT estiver ligado, cria; confere que o domínio do e-mail pertence ao tenant e aplica o mapeamento de papéis",
          "Cria a sessão da própria aplicação (veja Q81) e grava o evento de auditoria; se qualquer validação falhar, a pessoa vê um erro genérico e o detalhe vai para o log da conexão, visível ao administrador do cliente",
        ],
        nota: "O erro de configuração do cliente é o gargalo operacional mais comum: por isso o diagnóstico precisa estar na tela do administrador, e não só no seu log interno.",
      },
      {
        tipo: "codigo",
        titulo: "A conexão por tenant",
        legenda: "TypeScript",
        codigo: `interface ConexaoSso {
  id: string;
  tenantId: string;
  protocolo: "saml" | "oidc";
  estado: "rascunho" | "testada" | "ativa" | "desativada";
  obrigatoria: boolean; // desliga o login por senha nos domínios do tenant
  dominios: { nome: string; verificadoEm: Date | null }[]; // posse provada por DNS
  saml?: { idpEntityId: string; ssoUrl: string; certificados: string[] }; // lista: rotação
  oidc?: { emissor: string; clientId: string; segredoRef: string }; // referência ao cofre
  papeis: { grupoExterno: string; papel: string }[]; // grupo do IdP → papel local
  provisionamento: { jit: boolean; scimTokenHash?: string };
}`,
        nota: "O segredo OIDC fica no cofre e a conexão guarda só a referência. Os certificados são uma lista para a troca sem queda, e o token do SCIM é guardado como hash.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "**O tenant e o domínio são provados, nunca deduzidos.** O tenant sai do callback da conexão (ou do domínio verificado), a validação usa só a configuração dessa conexão e a identidade é `conexão + subject`. Implemente o protocolo com uma biblioteca madura ou um serviço de identidade (compare custo, controle e conformidade, e confira a documentação do fornecedor), e gaste o seu tempo no que é seu: modelo de conexão, autoatendimento, provisionamento, diagnóstico e auditoria.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O que quebra na prática",
        texto:
          "Quatro riscos. (1) **Domínio não verificado**: um tenant assume os logins de outro. (2) **Vincular a conta pelo e-mail** vindo do IdP: um IdP malicioso se passa por qualquer usuário (veja Q52). (3) **Buscar metadata ou discovery em URL informada pelo cliente**: abre SSRF, então aceite só `https`, bloqueie endereços internos e limite tempo e tamanho. (4) **SSO obrigatório sem saída**: se o cliente erra o certificado, ninguém entra. Mantenha um acesso de emergência (administrador com login próprio e MFA, ou recuperação assistida com verificação forte) e só ative a obrigatoriedade depois de um teste bem-sucedido.",
      },
    ],
    armadilhas: [
      "Ativar o SSO obrigatório antes de um login de teste bem-sucedido: um erro de certificado ou de atributo tranca a empresa inteira.",
      "Um único callback para todos os tenants, com a configuração escolhida pelo conteúdo da resposta: o atacante escolhe com qual configuração será validado.",
      "Aceitar do IdP qualquer papel que ele envie: o mapeamento deve ser uma lista permitida por tenant, para o IdP de um cliente nunca conceder papéis de plataforma ou de outro tenant.",
      "Esquecer o desligamento: o JIT cria contas, mas ninguém as remove; sem SCIM ou revisão periódica, ex-funcionários continuam ativos.",
    ],
    autoteste: [
      {
        pergunta: "Como o sistema descobre qual IdP usar quando a pessoa digita o e-mail?",
        resposta:
          "Pelo domínio do e-mail, procurado entre as conexões ativas com domínio verificado (home realm discovery). Sem a prova de posse do domínio, um tenant poderia reivindicar o de outro.",
      },
      {
        pergunta: "Qual a diferença entre JIT e SCIM, e por que oferecer os dois?",
        resposta:
          "O JIT cria a conta no primeiro login; no SCIM, é o IdP quem cria, atualiza e desativa contas, o que resolve o desligamento. O JIT é simples de começar; o SCIM é o que as empresas exigem para controlar o ciclo de vida.",
      },
    ],
  },
  en: {
    titulo: "Enterprise SSO in SaaS",
    pergunta:
      "How would you design enterprise SSO support (SAML and OIDC) in a multi-tenant SaaS where each customer brings its own IdP?",
    porqueEsteMetodo:
      "This is a system-design question, and a script avoids both forgetting pieces (tenant discovery, provisioning, certificate rotation) and drowning in one detail: requirements, data model, discovery, protocol, provisioning and operations, in that order.",
    resposta30s:
      "Treat each customer IdP as a **configurable per-tenant connection** (SAML or OIDC, with verified domains and role mapping), discover the tenant from the **e-mail domain** (home realm discovery) and validate every response **only against that connection’s configuration**. Round it out with **JIT** and **SCIM** to create and remove accounts, **certificate rotation** without downtime, a **connection test** before activation and an **emergency access**, so the administrator is not locked out. The central security rule: the tenant and the domain are **proven**, never inferred from what the IdP claims.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Functional: the customer’s administrator configures SSO alone (self-service), several IdPs and protocols (SAML and OIDC), mandatory SSO per domain, automatic account creation and removal and group-to-role mapping. Non-functional: isolation between tenants, auditing, certificate rotation without downtime and support that does not need an engineer for every customer.",
          },
          {
            titulo: "2. Data model",
            texto:
              "A `connection` entity per IdP (see the code): tenant, protocol, state (`draft`, `tested`, `active`, `disabled`), SSO enforced or not, domains with proof of ownership, protocol parameters (certificates, issuer, `clientId`), a reference to the secret in the vault, role mapping and provisioning options. The user is identified by `connection + subject` (`sub` or persistent `NameID`), not by e-mail (see Q52).",
          },
          {
            titulo: "3. Tenant discovery",
            texto:
              "Two doors: one address per tenant (`acme.app.com`) or a single page that asks for the e-mail and looks the domain up among the active connections (home realm discovery). **A domain counts only after it is proven** (a DNS TXT record, for example); without that, a tenant could claim another company’s domain and capture logins. A domain with no connection falls back to the normal login.",
          },
          {
            titulo: "4. Protocol and callbacks",
            texto:
              "Each connection has its own callback (for example, `/sso/{connectionId}/acs` for SAML and `/sso/{connectionId}/callback` for OIDC). The response is validated **only with the configuration of the connection behind the callback**: certificate, `Issuer`, `Audience` and `InResponseTo` in SAML; `iss`, `aud`, `nonce`, JWKS and PKCE in OIDC (see Q63 and Q48). Prefer the SP-initiated flow (see Q57).",
          },
          {
            titulo: "5. Provisioning and roles",
            texto:
              "**JIT**: creates the user at first login, with a least-privilege default role; it is simple, but it removes nobody. **SCIM**: the IdP creates, updates and deactivates accounts, which closes the leaver cycle (see Q11 and Q13). Mapping IdP groups to roles is a per-tenant table, and the IdP’s response can only grant roles the table provides for.",
          },
          {
            titulo: "6. Operations",
            texto:
              "Certificates: accept more than one per connection during the switch, read the customer’s metadata when there is a URL and warn administrators before expiry (see Q64). Connection test: a trial login in draft mode, showing the errors (clock, `Audience`, missing attribute) before activation. Observability: a log per connection, visible to the customer’s administrator. Emergency: see the warning below.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "One login, from e-mail to session",
        etapas: [
          "The person enters the e-mail at `app.com/login`; the server extracts the domain and looks for an `active` connection with that **verified** domain",
          "With no connection, the account’s normal login proceeds; with enforced SSO, password login for that domain is disabled",
          "The server stores, in the request state, the `connectionId`, the `state` or request `ID` and the `nonce`, and redirects to the customer’s IdP (`AuthnRequest` in SAML; authorization code with PKCE in OIDC)",
          "The person authenticates at the customer’s IdP, with its MFA and policies",
          "The IdP returns to **that connection’s** callback; the server validates signature, issuer, recipient, validity and the link to the pending request",
          "It resolves the user by `connection + subject`; if the user does not exist and JIT is on, it creates one; it checks that the e-mail’s domain belongs to the tenant and applies the role mapping",
          "It creates the application’s own session (see Q81) and records the audit event; if any validation fails, the person sees a generic error and the detail goes to the connection’s log, visible to the customer’s administrator",
        ],
        nota: "Customer misconfiguration is the most common operational bottleneck: that is why the diagnosis must be on the administrator’s screen, not only in your internal log.",
      },
      {
        tipo: "codigo",
        titulo: "The per-tenant connection",
        legenda: "TypeScript",
        codigo: `interface SsoConnection {
  id: string;
  tenantId: string;
  protocol: "saml" | "oidc";
  state: "draft" | "tested" | "active" | "disabled";
  enforced: boolean; // turns off password login on the tenant's domains
  domains: { name: string; verifiedAt: Date | null }[]; // ownership proven by DNS
  saml?: { idpEntityId: string; ssoUrl: string; certificates: string[] }; // a list: rotation
  oidc?: { issuer: string; clientId: string; secretRef: string }; // reference to the vault
  roleMapping: { externalGroup: string; role: string }[]; // IdP group → local role
  provisioning: { jit: boolean; scimTokenHash?: string };
}`,
        nota: "The OIDC secret stays in the vault and the connection holds only the reference. The certificates are a list so the switch happens without downtime, and the SCIM token is stored as a hash.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "**The tenant and the domain are proven, never inferred.** The tenant comes from the connection’s callback (or from the verified domain), validation uses only that connection’s configuration and identity is `connection + subject`. Implement the protocol with a mature library or an identity service (compare cost, control and compliance, and check the vendor’s documentation), and spend your time on what is yours: the connection model, self-service, provisioning, diagnostics and auditing.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "What breaks in practice",
        texto:
          "Four risks. (1) **An unverified domain**: one tenant takes over another’s logins. (2) **Linking the account by the e-mail** coming from the IdP: a malicious IdP can impersonate any user (see Q52). (3) **Fetching metadata or discovery from a URL the customer supplies**: it opens SSRF, so accept only `https`, block internal addresses and limit time and size. (4) **Enforced SSO with no way out**: if the customer gets the certificate wrong, nobody gets in. Keep an emergency access (an administrator with their own login and MFA, or assisted recovery with strong verification) and only turn enforcement on after a successful test.",
      },
    ],
    armadilhas: [
      "Turning on enforced SSO before a successful test login: a certificate or attribute error locks the whole company out.",
      "A single callback for every tenant, with the configuration chosen from the content of the response: the attacker picks the configuration they will be validated against.",
      "Accepting any role the IdP sends: the mapping must be an allowlist per tenant, so one customer’s IdP can never grant platform roles or roles of another tenant.",
      "Forgetting offboarding: JIT creates accounts but nobody removes them; without SCIM or periodic review, former employees stay active.",
    ],
    autoteste: [
      {
        pergunta: "How does the system find out which IdP to use when the person types the e-mail?",
        resposta:
          "By the e-mail domain, looked up among the active connections with a verified domain (home realm discovery). Without proof of domain ownership, one tenant could claim another’s.",
      },
      {
        pergunta: "What is the difference between JIT and SCIM, and why offer both?",
        resposta:
          "JIT creates the account at first login; with SCIM, the IdP creates, updates and deactivates accounts, which solves offboarding. JIT is easy to start with; SCIM is what companies require to control the lifecycle.",
      },
    ],
  },
};
