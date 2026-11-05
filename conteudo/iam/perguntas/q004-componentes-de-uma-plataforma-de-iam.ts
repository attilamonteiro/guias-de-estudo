import type { Pergunta } from "../../tipos";

// Q04 · Componentes de uma plataforma de IAM
export const q004: Pergunta = {
  numero: 4,
  modulo: "fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "Componentes de uma plataforma de IAM",
    pergunta:
      "Que peças compõem uma plataforma de gestão de identidade e acesso (diretório, IdP, SSO, MFA, provisionamento, governança, acesso privilegiado, auditoria) e que problema cada uma resolve?",
    porqueEsteMetodo:
      "A lista de siglas assusta até você ligar cada peça a um problema que ela resolve. A imagem de um prédio corporativo dá esse vínculo, e a tabela mostra tecnologias e onde cada peça falha sozinha.",
    resposta30s:
      "Uma plataforma de IAM junta peças que cobrem o ciclo inteiro: **diretório** (quem existe), **IdP com SSO** (autentica uma vez e emite provas aos aplicativos), **MFA** (torna inútil a senha roubada), **provisionamento** (cria e remove contas, em geral por SCIM), **governança** (quem pediu, quem aprovou, quem ainda precisa), **acesso privilegiado** (protege as contas poderosas) e **auditoria** (quem fez o quê). Cada uma sozinha deixa uma brecha, por isso se encaixam em cadeia, do RH à saída da pessoa.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine um prédio corporativo. O cadastro do RH diz quem trabalha ali (diretório). A portaria confere o crachá uma única vez e libera a entrada (IdP com SSO), às vezes pedindo também a digital (MFA). Quando alguém é contratado, a segurança emite o crachá e cadastra as salas; quando sai, recolhe tudo (provisionamento). Cada sala tem uma regra sobre quem entra (autorização por políticas). De tempos em tempos, os gestores conferem quem tem chave de quê (governança). As chaves-mestras ficam num cofre, com registro de quem retirou e devolveu (acesso privilegiado). As câmeras e o livro da portaria guardam tudo o que aconteceu (auditoria).",
        tecnico:
          "Uma plataforma de IAM reúne: **diretório** (fonte de identidades e grupos, como LDAP ou Active Directory); **IdP com SSO** (autentica e emite tokens ou assertions por OpenID Connect e SAML); **MFA e passkeys** (reforçam a prova de identidade); **provisionamento** (cria, atualiza e desativa contas nos aplicativos, em geral por SCIM, veja Q11); **governança de identidade**, ou IGA (solicitações e aprovações de acesso, revisão periódica, separação de funções); **acesso privilegiado**, ou PAM (cofre de credenciais, sessões gravadas, privilégio temporário); **autorização por políticas** (papéis, atributos, regras); e **auditoria** (logs e análise dos eventos de identidade).",
        limite:
          "A imagem do prédio faz parecer que tudo é um produto só. Na prática as peças vêm de fornecedores diferentes, se sobrepõem (o IdP também faz MFA e algum provisionamento) e deixam lacunas entre si. E a “portaria” digital é consultada por todo aplicativo, de qualquer lugar, o tempo todo: por isso a disponibilidade do IdP e a proteção das contas privilegiadas pesam mais do que numa portaria física.",
      },
      {
        tipo: "tabela",
        titulo: "O problema de cada peça, e onde ela falha sozinha",
        colunas: ["Peça", "Problema que resolve", "Tecnologias e padrões", "Falha sozinha quando"],
        linhas: [
          [
            "Diretório",
            "Fonte única de quem existe e a quais grupos pertence",
            "LDAP, Active Directory, diretório em nuvem",
            "Não acompanha o RH, ou cada aplicativo mantém cópias próprias",
          ],
          [
            "IdP e SSO",
            "Autenticar uma vez e entrar em vários aplicativos sem uma senha em cada um",
            "OpenID Connect, SAML 2.0, OAuth 2.0",
            "Aplicativos legados não falam esses protocolos e seguem com login próprio; o IdP vira ponto único de falha",
          ],
          [
            "MFA e passkeys",
            "Tornar inútil a senha roubada",
            "TOTP, notificação push, FIDO2 e WebAuthn",
            "Só cobre o login; fatores fracos ou fadiga de aprovação permitem contornos; não corrige privilégio excessivo",
          ],
          [
            "Provisionamento",
            "Criar, atualizar e desativar contas nos aplicativos no tempo certo",
            "SCIM, conectores, JIT",
            "Aplicativos sem API deixam contas manuais e órfãs",
          ],
          [
            "Governança (IGA)",
            "Saber quem pediu, quem aprovou e quem ainda precisa do acesso",
            "Fluxos de solicitação, certificação de acessos, regras de separação de funções",
            "Vira “aprovar tudo” se as revisões não têm dono nem prazo",
          ],
          [
            "Acesso privilegiado (PAM)",
            "Proteger e registrar as contas poderosas",
            "Cofre de credenciais, sessão gravada, acesso just-in-time",
            "Administradores contornam por contas locais; contas de serviço ficam de fora",
          ],
          [
            "Autorização por políticas",
            "Decidir o que cada principal pode fazer em cada recurso",
            "RBAC, ABAC, motores de políticas, escopos OAuth",
            "Cada aplicação reimplementa regras diferentes, sem conversar com a governança",
          ],
          [
            "Auditoria e monitoramento",
            "Provar e detectar: quem fez o quê, quando e de onde",
            "Logs de autenticação e de administração, SIEM, alertas",
            "Logs dispersos, sem retenção e sem alerta",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Como as peças se encaixam, do RH à saída",
        etapas: [
          "O RH registra uma contratação, e esse registro é a fonte de verdade",
          "O provisionamento cria a conta no diretório e nos aplicativos e atribui grupos por regra",
          "A pessoa entra pelo IdP com SSO e MFA, e cada aplicativo recebe uma prova assinada",
          "O aplicativo (ou um motor de políticas) decide o que ela pode fazer, a partir de grupos e atributos",
          "Tarefas administrativas passam pelo acesso privilegiado: cofre, aprovação, prazo e gravação",
          "Tudo vai para a auditoria, e a governança revisa os acessos de tempos em tempos",
          "Na saída ou na mudança de função, o RH altera o registro e o provisionamento remove ou ajusta os acessos",
        ],
        nota: "A cadeia só é forte se a primeira e a última etapa existirem: sem ligação com o RH, o diretório envelhece; sem desligamento automático, as contas órfãs se acumulam.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Comprar ou construir",
        texto:
          "**Compre, ou use como serviço**, o que é comum e de alto risco: IdP, SSO, MFA e passkeys, diretório, PAM. Errar essas peças custa caro, e o fornecedor as mantém atualizadas. **Construa**, dentro do seu produto, só a autorização do seu domínio (quem pode aprovar este pedido), de preferência com um motor de políticas, e a integração por OpenID Connect e SCIM. Exija padrões abertos para poder trocar de fornecedor sem reescrever tudo, e confira na documentação de cada produto quais peças ele realmente cobre.",
      },
    ],
    armadilhas: [
      "Achar que SSO e MFA bastam: sem provisionamento e governança, o acesso só cresce e as contas órfãs continuam.",
      "Confundir diretório com IdP: o diretório guarda objetos e grupos; o IdP autentica e emite tokens (muitos produtos fazem os dois).",
      "Esquecer contas privilegiadas e de serviço: ficam fora do SSO, do MFA e das revisões se ninguém as inventariou.",
      "Comprar peças sem testar a integração: sem ligação com o RH e sem SCIM, o ciclo de vida continua manual.",
    ],
    autoteste: [
      {
        pergunta: "Qual peça remove o acesso de quem saiu da empresa, e o que prova que isso foi feito?",
        resposta:
          "O provisionamento desativa as contas nos aplicativos a partir do evento do RH; a auditoria e as revisões de acesso (governança) provam que isso aconteceu e dentro do prazo.",
      },
      {
        pergunta: "Onde um IdP com SSO falha sozinho?",
        resposta:
          "Ele não cobre aplicativos legados que não falam OpenID Connect nem SAML, não revisa privilégios acumulados, não protege contas administrativas por si só e pode virar ponto único de falha. Por isso aparece junto de MFA, provisionamento, governança e PAM.",
      },
    ],
  },
  en: {
    titulo: "Components of an IAM platform",
    pergunta:
      "Which pieces make up an identity and access management platform (directory, IdP, SSO, MFA, provisioning, governance, privileged access, auditing), and which problem does each one solve?",
    porqueEsteMetodo:
      "The list of acronyms is intimidating until you tie each piece to the problem it solves. The picture of a corporate building makes that link, and the table shows technologies and where each piece fails on its own.",
    resposta30s:
      "An IAM platform joins pieces that cover the whole lifecycle: a **directory** (who exists), an **IdP with SSO** (authenticates once and issues proofs to applications), **MFA** (makes a stolen password useless), **provisioning** (creates and removes accounts, usually through SCIM), **governance** (who asked, who approved, who still needs it), **privileged access** (protects the powerful accounts) and **auditing** (who did what). Each one alone leaves a gap, so they fit together in a chain, from HR to the person’s departure.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Imagine a corporate building. HR’s register says who works there (directory). The front desk checks the badge once and lets you in (IdP with SSO), sometimes asking for a fingerprint too (MFA). When someone is hired, security issues the badge and registers the rooms; when they leave, it collects everything (provisioning). Each room has a rule about who enters (policy-based authorization). From time to time, managers check who holds a key to what (governance). The master keys sit in a safe, with a log of who took and returned them (privileged access). The cameras and the front-desk logbook record everything that happened (auditing).",
        tecnico:
          "An IAM platform brings together: a **directory** (source of identities and groups, such as LDAP or Active Directory); an **IdP with SSO** (authenticates and issues tokens or assertions through OpenID Connect and SAML); **MFA and passkeys** (strengthen the proof of identity); **provisioning** (creates, updates and deactivates accounts in applications, usually through SCIM, see Q11); **identity governance**, or IGA (access requests and approvals, periodic review, separation of duties); **privileged access**, or PAM (credential vault, recorded sessions, temporary privilege); **policy-based authorization** (roles, attributes, rules); and **auditing** (logs and analysis of identity events).",
        limite:
          "The building picture makes it look like a single product. In practice the pieces come from different vendors, overlap (the IdP also does MFA and some provisioning) and leave gaps between them. And the digital “front desk” is consulted by every application, from anywhere, all the time: that is why IdP availability and the protection of privileged accounts weigh more than at a physical desk.",
      },
      {
        tipo: "tabela",
        titulo: "Each piece’s problem, and where it fails alone",
        colunas: ["Piece", "Problem it solves", "Technologies and standards", "Fails alone when"],
        linhas: [
          [
            "Directory",
            "A single source of who exists and which groups they belong to",
            "LDAP, Active Directory, cloud directory",
            "It does not follow HR, or each application keeps its own copies",
          ],
          [
            "IdP and SSO",
            "Authenticate once and enter several applications without a password in each",
            "OpenID Connect, SAML 2.0, OAuth 2.0",
            "Legacy applications do not speak these protocols and keep their own login; the IdP becomes a single point of failure",
          ],
          [
            "MFA and passkeys",
            "Make a stolen password useless",
            "TOTP, push notification, FIDO2 and WebAuthn",
            "Covers only the login; weak factors or approval fatigue allow workarounds; it does not fix excessive privilege",
          ],
          [
            "Provisioning",
            "Create, update and deactivate accounts in applications at the right time",
            "SCIM, connectors, JIT",
            "Applications without an API leave manual, orphaned accounts",
          ],
          [
            "Governance (IGA)",
            "Know who asked, who approved and who still needs the access",
            "Request workflows, access certification, separation-of-duties rules",
            "Turns into “approve everything” if reviews have no owner or deadline",
          ],
          [
            "Privileged access (PAM)",
            "Protect and record the powerful accounts",
            "Credential vault, recorded session, just-in-time access",
            "Administrators work around it through local accounts; service accounts stay out",
          ],
          [
            "Policy-based authorization",
            "Decide what each principal may do on each resource",
            "RBAC, ABAC, policy engines, OAuth scopes",
            "Each application reimplements different rules, without talking to governance",
          ],
          [
            "Auditing and monitoring",
            "Prove and detect: who did what, when and from where",
            "Authentication and admin logs, SIEM, alerts",
            "Scattered logs, with no retention and no alerting",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "How the pieces fit together, from HR to departure",
        etapas: [
          "HR records a hire, and that record is the source of truth",
          "Provisioning creates the account in the directory and in the applications and assigns groups by rule",
          "The person signs in through the IdP with SSO and MFA, and each application receives a signed proof",
          "The application (or a policy engine) decides what they may do, based on groups and attributes",
          "Administrative tasks go through privileged access: vault, approval, time limit and recording",
          "Everything goes to auditing, and governance reviews access from time to time",
          "When the person leaves or changes role, HR updates the record and provisioning removes or adjusts the access",
        ],
        nota: "The chain is only as strong as its first and last steps: without a link to HR, the directory goes stale; without automatic deprovisioning, orphaned accounts pile up.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Buy or build",
        texto:
          "**Buy, or use as a service**, what is common and high risk: IdP, SSO, MFA and passkeys, directory, PAM. Getting these pieces wrong is expensive, and the vendor keeps them up to date. **Build**, inside your product, only the authorization of your domain (who may approve this order), preferably with a policy engine, plus the integration through OpenID Connect and SCIM. Demand open standards so you can change vendors without rewriting everything, and check each product’s documentation for which pieces it really covers.",
      },
    ],
    armadilhas: [
      "Thinking SSO and MFA are enough: without provisioning and governance, access only grows and orphaned accounts remain.",
      "Mixing up directory and IdP: the directory stores objects and groups; the IdP authenticates and issues tokens (many products do both).",
      "Forgetting privileged and service accounts: they stay outside SSO, MFA and reviews if nobody inventoried them.",
      "Buying pieces without testing the integration: with no link to HR and no SCIM, the lifecycle stays manual.",
    ],
    autoteste: [
      {
        pergunta: "Which piece removes the access of someone who left the company, and what proves it was done?",
        resposta:
          "Provisioning deactivates the accounts in the applications from the HR event; auditing and access reviews (governance) prove it happened and on time.",
      },
      {
        pergunta: "Where does an IdP with SSO fail on its own?",
        resposta:
          "It does not cover legacy applications that speak neither OpenID Connect nor SAML, does not review accumulated privileges, does not protect administrative accounts by itself and can become a single point of failure. That is why it appears alongside MFA, provisioning, governance and PAM.",
      },
    ],
  },
};
