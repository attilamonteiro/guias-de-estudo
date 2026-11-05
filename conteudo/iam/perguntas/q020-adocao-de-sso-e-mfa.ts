import type { Pergunta } from "../../tipos";

// Q20 · Adoção de SSO e MFA
export const q020: Pergunta = {
  numero: 20,
  modulo: "fundamentos",
  metodo: "whys",
  pt: {
    titulo: "Adoção de SSO e MFA",
    pergunta:
      "Por que projetos de SSO e MFA costumam falhar na adoção, e como você conduziria a implantação equilibrando segurança, usabilidade e as necessidades do negócio?",
    porqueEsteMetodo:
      "Projetos de SSO e MFA raramente falham por falta de tecnologia; falham por comportamento e organização. Perguntar “por quê” em cadeia leva da queixa visível (os usuários reclamam) à causa real, e a causa define como conduzir a implantação.",
    resposta30s:
      "SSO e MFA falham na adoção porque são tratados como instalação técnica, quando mudam o hábito de todos: **fricção** sem benefício percebido, **aplicações legadas** sem suporte, **exceções que viram regra** e **falta de patrocínio**. Conduza em **ondas**, com piloto, comunicação, suporte e **recuperação de conta bem desenhada**, exceções com dono e prazo e métricas de adoção. Mostre valor ao negócio: menos chamados de senha, acesso mais rápido e auditoria mais simples.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que a adoção falha mesmo quando a tecnologia funciona?",
            resposta:
              "Porque o projeto é tratado como instalação, mas o que ele muda é o comportamento diário de todos. Se a pessoa não percebe benefício (“para mim só piorou”) e não sabe por que a mudança existe, ela contorna: reutiliza senhas, compartilha contas, pede exceção. Adoção é um problema de produto e de mudança organizacional, não só de configuração.",
          },
          {
            pergunta: "Por que a fricção pesa tanto?",
            resposta:
              "Porque cada passo extra é pago centenas de vezes por pessoa. Sessões curtas demais, pedido de MFA a cada acesso, aprovação por push que interrompe o trabalho e um celular perdido sem caminho claro de recuperação geram chamados e atalhos. Quem trabalha em chão de fábrica, em campo ou sem celular corporativo sente mais. Autenticação adaptativa (pedir mais só quando o risco sobe) e métodos fáceis e fortes, como passkeys, reduzem o custo sem baixar a segurança.",
          },
          {
            pergunta: "Por que as aplicações legadas travam o projeto?",
            resposta:
              "Porque muitas não falam OIDC nem SAML: têm senha local, autenticação básica ou dependem de um cliente antigo. Integrar custa, o fornecedor não tem prazo, e o SSO fica pela metade: a pessoa continua com várias senhas justamente nas aplicações mais velhas e mais frágeis. As saídas são um proxy ou gateway de autenticação na frente da aplicação, um cofre de senhas como paliativo, a modernização ou a aposentadoria planejada.",
          },
          {
            pergunta: "Por que as exceções viram a regra?",
            resposta:
              "Porque a primeira exceção (a diretoria, uma equipe, um sistema crítico) é concedida sem dono e sem prazo, e abre um precedente: o próximo pedido fica mais difícil de negar. Sem registro, a lista cresce até que a política cubra uma minoria, e quem mais precisa de proteção (contas privilegiadas, executivos) acaba justamente fora dela.",
          },
          {
            pergunta: "Por que a falta de patrocínio condena o projeto?",
            resposta:
              "Porque a área de segurança sozinha não consegue impor prazo às áreas de negócio nem decidir conflitos entre segurança e produtividade. Sem um patrocinador que defina a meta, financie o suporte e a migração dos legados e use o novo método primeiro, cada área negocia a sua própria saída e o cronograma escorrega.",
          },
        ],
        causaRaiz:
          "SSO e MFA falham quando são tratados como **instalação técnica** e não como **mudança de comportamento**: sem benefício percebido, sem caminho para os casos difíceis e sem patrocínio, a fricção vence a política.",
      },
      {
        tipo: "passos",
        titulo: "Como conduzir a implantação",
        passos: [
          {
            titulo: "1. Inventário e prioridade",
            texto:
              "Defina o provedor de identidade central e os padrões (OIDC ou SAML), liste aplicações, usuários e riscos. Comece por e-mail, painéis administrativos, finanças e as ferramentas de maior uso; deixe os legados difíceis para uma fase própria, com plano.",
          },
          {
            titulo: "2. Piloto com um grupo variado",
            texto:
              "Inclua TI, uma área de negócio, alguém em campo e alguém com celular antigo. Meça tempo de login, falhas e chamados, e ajuste antes de ampliar.",
          },
          {
            titulo: "3. Ondas, com comunicação",
            texto:
              "Por grupo ou aplicação, avisando antes: por que, o que muda, quando e onde pedir ajuda. Reforce o suporte nos primeiros dias de cada onda.",
          },
          {
            titulo: "4. Recuperação e emergência",
            texto:
              "Registre mais de um método por pessoa, ofereça códigos de recuperação ou uma chave de segurança reserva e desenhe a perda do celular com verificação de identidade. Mantenha contas de emergência (break-glass), fora da política comum e com monitoramento forte.",
          },
          {
            titulo: "5. Exceções com dono e prazo",
            texto:
              "Toda exceção tem justificativa, dono, controle compensatório (por exemplo, restringir a origem de rede) e data de vencimento, e é revista. Exceção sem prazo é revogação da política.",
          },
          {
            titulo: "6. Meça e mostre valor",
            texto:
              "Acompanhe as métricas da tabela e leve ao patrocinador e às áreas o que mudou: menos chamados de senha, acesso mais rápido, desligamento em um só lugar e auditoria mais simples.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Métricas de adoção e de valor",
        colunas: ["Métrica", "O que mostra"],
        linhas: [
          [
            "Cobertura de SSO (aplicações e usuários)",
            "Quanto do uso real passa pelo login único; o que falta está no inventário dos legados",
          ],
          [
            "Cobertura de MFA, com recorte para contas privilegiadas",
            "Se quem mais precisa de proteção está dentro da política",
          ],
          [
            "Parcela de métodos resistentes a phishing (passkeys, chaves de segurança)",
            "A qualidade do segundo fator, não só a existência dele",
          ],
          [
            "Chamados de senha e de recuperação de conta",
            "O valor para o negócio e o peso do suporte; a queda dos chamados de senha é o argumento mais claro",
          ],
          ["Tempo de login e taxa de falha", "A fricção que as pessoas sentem"],
          ["Exceções ativas e vencidas", "Se as exceções estão sob controle ou virando regra"],
          ["Tempo para conceder e retirar acessos; esforço de auditoria", "O ganho operacional e de conformidade"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Equilibrar segurança, usabilidade e negócio",
        texto:
          "Não é um cabo de guerra: a segurança que as pessoas contornam não protege. Ajuste o rigor ao **risco**: exija mais (MFA forte, dispositivo conhecido) para aplicações sensíveis, contas privilegiadas e contextos incomuns, e menos em baixo risco (acesso adaptativo). Leve ao negócio dados e alternativas, não só proibições; quando um requisito do negócio colide com a política, proponha um controle compensatório e uma data. E junte SSO a MFA: login único sem segundo fator transforma uma senha roubada em acesso a tudo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O ponto mais fraco costuma ser a recuperação",
        texto:
          "Um MFA forte com recuperação fraca (por exemplo, o suporte redefine o fator por telefone sem verificar quem pede) entrega o acesso a quem usa engenharia social. SMS e voz são considerados autenticadores mais fracos (veja NIST SP 800-63B) e devem ser exceção; prefira passkeys, chaves de segurança ou aplicativos autenticadores. Contra o cansaço de MFA (a pessoa aprova por reflexo as notificações que um atacante dispara), use correspondência de número e limite de tentativas.",
      },
    ],
    armadilhas: [
      "Começar pela aplicação mais difícil, ou por todas de uma vez: o projeto emperra e a primeira impressão fica ruim. Comece onde há ganho e pouco atrito.",
      "Obrigar o MFA sem plano de recuperação: o primeiro celular perdido vira fila no suporte e pressão para desligar a regra.",
      "Conceder exceções sem dono, prazo e controle compensatório.",
      "Medir só a instalação (quantos usuários têm o app) e não o uso: MFA ativado e quase nunca exigido não protege.",
    ],
    autoteste: [
      {
        pergunta: "Por que as exceções são o maior risco de um projeto de MFA?",
        resposta:
          "Porque, sem dono e prazo, elas se acumulam e viram precedente; no fim a política cobre uma minoria e costuma deixar de fora justamente as contas mais valiosas.",
      },
      {
        pergunta: "Que argumentos mostram o valor de SSO e MFA ao negócio?",
        resposta:
          "Menos chamados de senha e de bloqueio, login mais rápido, desligamento em um só lugar, auditoria mais simples e menor risco de invasão por senha roubada ou reutilizada.",
      },
    ],
  },
  en: {
    titulo: "Adopting SSO and MFA",
    pergunta:
      "Why do SSO and MFA rollouts often fail at adoption, and how would you run the rollout while balancing security, usability and business needs?",
    porqueEsteMetodo:
      "SSO and MFA projects rarely fail for lack of technology; they fail on behavior and organization. Asking “why” in a chain leads from the visible complaint (users are unhappy) to the real cause, and the cause shapes how you run the rollout.",
    resposta30s:
      "SSO and MFA fail at adoption because they are treated as a technical installation when they change everyone’s habits: **friction** with no perceived benefit, **legacy applications** with no support, **exceptions that become the rule** and **no sponsorship**. Run them in **waves**, with a pilot, communication, support, a well-designed **account recovery**, exceptions with an owner and an end date, and adoption metrics. Show the business the value: fewer password tickets, faster access and simpler audits.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why does adoption fail even when the technology works?",
            resposta:
              "Because the project is treated as an installation, yet what it changes is everyone’s daily behavior. If people see no benefit (“it only got worse for me”) and do not know why the change exists, they work around it: they reuse passwords, share accounts, ask for exceptions. Adoption is a product and organizational-change problem, not just a configuration one.",
          },
          {
            pergunta: "Why does friction weigh so much?",
            resposta:
              "Because every extra step is paid hundreds of times per person. Sessions that are too short, an MFA prompt on every access, push approvals that interrupt work and a lost phone with no clear recovery path generate tickets and shortcuts. People on a factory floor, in the field or without a corporate phone feel it most. Adaptive authentication (asking for more only when risk rises) and methods that are both easy and strong, such as passkeys, cut the cost without lowering security.",
          },
          {
            pergunta: "Why do legacy applications stall the project?",
            resposta:
              "Because many do not speak OIDC or SAML: they have a local password, basic authentication or depend on an old client. Integrating costs money, the vendor has no timeline, and SSO ends up half done: people keep several passwords precisely on the oldest and most fragile applications. The ways out are an authentication proxy or gateway in front of the application, a password vault as a stopgap, modernization or planned retirement.",
          },
          {
            pergunta: "Why do exceptions become the rule?",
            resposta:
              "Because the first exception (the board, one team, a critical system) is granted with no owner and no end date, and sets a precedent: the next request is harder to refuse. Without a register, the list grows until the policy covers a minority, and those who most need protection (privileged accounts, executives) end up outside it.",
          },
          {
            pergunta: "Why does a lack of sponsorship doom the project?",
            resposta:
              "Because the security team alone cannot impose deadlines on business areas or settle conflicts between security and productivity. Without a sponsor who sets the goal, funds support and the migration of legacy systems and uses the new method first, each area negotiates its own way out and the schedule slips.",
          },
        ],
        causaRaiz:
          "SSO and MFA fail when they are treated as a **technical installation** rather than a **change in behavior**: with no perceived benefit, no path for the hard cases and no sponsorship, friction beats policy.",
      },
      {
        tipo: "passos",
        titulo: "How to run the rollout",
        passos: [
          {
            titulo: "1. Inventory and priority",
            texto:
              "Choose the central identity provider and the standards (OIDC or SAML), list applications, users and risks. Start with email, admin consoles, finance and the most-used tools; leave the hard legacy systems for a phase of their own, with a plan.",
          },
          {
            titulo: "2. Pilot with a varied group",
            texto:
              "Include IT, a business area, someone in the field and someone with an old phone. Measure sign-in time, failures and tickets, and adjust before widening.",
          },
          {
            titulo: "3. Waves, with communication",
            texto:
              "By group or application, announcing ahead: why, what changes, when and where to get help. Reinforce support in the first days of each wave.",
          },
          {
            titulo: "4. Recovery and emergency",
            texto:
              "Enroll more than one method per person, offer recovery codes or a spare security key and design phone loss with identity verification. Keep emergency (break-glass) accounts outside the ordinary policy and under strong monitoring.",
          },
          {
            titulo: "5. Exceptions with an owner and an end date",
            texto:
              "Every exception has a justification, an owner, a compensating control (for example, restricting the network origin) and an expiry date, and is reviewed. An exception with no end date is a repeal of the policy.",
          },
          {
            titulo: "6. Measure and show value",
            texto:
              "Track the metrics in the table and show the sponsor and the areas what changed: fewer password tickets, faster access, offboarding in one place and simpler audits.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Adoption and value metrics",
        colunas: ["Metric", "What it shows"],
        linhas: [
          [
            "SSO coverage (applications and users)",
            "How much real usage goes through single sign-on; what is missing is on the legacy inventory",
          ],
          [
            "MFA coverage, with a cut for privileged accounts",
            "Whether the people who most need protection are inside the policy",
          ],
          [
            "Share of phishing-resistant methods (passkeys, security keys)",
            "The quality of the second factor, not just its existence",
          ],
          [
            "Password and account-recovery tickets",
            "Business value and support load; the drop in password tickets is the clearest argument",
          ],
          ["Sign-in time and failure rate", "The friction people feel"],
          ["Active and overdue exceptions", "Whether exceptions are under control or becoming the rule"],
          ["Time to grant and remove access; audit effort", "The operational and compliance gain"],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Balancing security, usability and the business",
        texto:
          "It is not a tug of war: security that people work around does not protect. Match rigor to **risk**: demand more (strong MFA, a known device) for sensitive applications, privileged accounts and unusual contexts, and less at low risk (adaptive access). Bring the business data and alternatives, not just prohibitions; when a business requirement collides with the policy, propose a compensating control and a date. And pair SSO with MFA: single sign-on without a second factor turns one stolen password into access to everything.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The weakest point is usually recovery",
        texto:
          "Strong MFA with weak recovery (for example, support resets the factor over the phone without verifying who is asking) hands access to anyone using social engineering. SMS and voice are considered weaker authenticators (see NIST SP 800-63B) and should be the exception; prefer passkeys, security keys or authenticator apps. Against MFA fatigue (people approving by reflex the prompts an attacker triggers), use number matching and attempt limits.",
      },
    ],
    armadilhas: [
      "Starting with the hardest application, or with all of them at once: the project stalls and the first impression is bad. Start where there is gain and little friction.",
      "Enforcing MFA with no recovery plan: the first lost phone becomes a support queue and pressure to switch the rule off.",
      "Granting exceptions with no owner, end date or compensating control.",
      "Measuring only installation (how many users have the app) and not use: MFA that is enabled but almost never required does not protect.",
    ],
    autoteste: [
      {
        pergunta: "Why are exceptions the biggest risk in an MFA project?",
        resposta:
          "Because, with no owner or end date, they pile up and set precedent; in the end the policy covers a minority and tends to leave out exactly the most valuable accounts.",
      },
      {
        pergunta: "What arguments show the business the value of SSO and MFA?",
        resposta:
          "Fewer password and lockout tickets, faster sign-in, offboarding in one place, simpler audits and a lower risk of break-ins from stolen or reused passwords.",
      },
    ],
  },
};
