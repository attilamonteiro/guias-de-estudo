import type { Pergunta } from "../../tipos";

// Q118 · Acesso privilegiado (PAM e JIT)
export const q118: Pergunta = {
  numero: 118,
  modulo: "autorizacao",
  metodo: "design",
  pt: {
    titulo: "Acesso privilegiado (PAM e JIT)",
    pergunta:
      "Como projetar o gerenciamento de acesso privilegiado (PAM) para administradores e contas de serviço: cofre, acesso just-in-time, gravação de sessão e break-glass?",
    porqueEsteMetodo:
      "PAM é um conjunto de peças que se conectam (cofre, elevação, gravação, emergência), e o roteiro de design obriga a ligar cada peça a um requisito: o que protege, de quem e a que custo de fricção.",
    resposta30s:
      "Acesso privilegiado se projeta com **contas separadas das cotidianas**, **elevação sob demanda e com prazo (just-in-time)**, um **cofre com rotação** para os segredos que sobram, **sessões gravadas** e uma **conta de emergência (break-glass)** monitorada. A meta é **nenhum privilégio permanente**: todo acesso elevado é aprovado, justificado, temporário e atribuído a uma pessoa. O custo é fricção, que se controla com aprovação automática para baixo risco e papéis pré-aprovados.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Contas privilegiadas (administradores, DBAs, papéis de nuvem, contas de serviço) causam o maior dano se forem comprometidas, e por isso são prioridade para atacantes, auditores e reguladores (veja Q138). Requisitos: **rastreabilidade** (qual pessoa fez o quê), **tempo limitado**, privilégio mínimo (veja Q109), evidência para auditoria e disponibilidade em emergências.",
          },
          {
            titulo: "2. Inventário e separação de contas",
            texto:
              "Descubra quem tem privilégio hoje, em quê e por quê. Cada administrador passa a ter **duas identidades**: a cotidiana (e-mail, navegação, sem privilégio) e a administrativa, usada só para administrar, em estação protegida e com MFA resistente a phishing. Acaba o administrador local compartilhado.",
          },
          {
            titulo: "3. Elevação sob demanda (JIT)",
            texto:
              "A pessoa é **elegível** a um papel, mas não o possui: ela solicita, informa o motivo (um chamado), recebe aprovação (humana em risco alto, automática em risco baixo) e ganha o papel **por um prazo curto**, que expira sozinho. É o “zero privilégio permanente” (zero standing privilege).",
          },
          {
            titulo: "4. Cofre e rotação",
            texto:
              "O **cofre** guarda o que não dá para eliminar: senhas de contas locais, chaves, tokens. A pessoa faz o **checkout** do segredo (atribuído a ela, com motivo), o cofre o **troca depois do uso** e registra tudo. Para contas de serviço, prefira identidade gerenciada ou federada e credenciais de curta duração (veja Q14 e Q16); o segredo que sobrar é rotacionado automaticamente.",
          },
          {
            titulo: "5. Sessões gravadas e monitoradas",
            texto:
              "O acesso a servidores, bancos e consoles passa por um **bastion ou proxy de sessão** que autentica a pessoa, injeta a credencial (ela nunca a vê) e **grava a sessão** (vídeo e comandos). Em nuvem, o log de auditoria do provedor cumpre parte desse papel. Proteja o registro contra adulteração e faça alguém revisar os alertas.",
          },
          {
            titulo: "6. Emergência, custo e operação",
            texto:
              "Mantenha **contas break-glass** para quando o IdP ou o MFA falharem, e meça a fricção: tempo para obter acesso e quantas vezes as pessoas contornam o processo. Revisões periódicas (veja Q119) e a auditoria fecham o ciclo.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Um pedido de acesso JIT, do início ao fim",
        etapas: [
          "A pessoa, conectada com a conta cotidiana, pede o papel `dba-producao` por duas horas e informa o número do chamado",
          "A política verifica elegibilidade, dispositivo gerenciado e uma autenticação forte e recente (step-up, veja Q99)",
          "O aprovador (gestor ou dono do sistema) aprova; em risco baixo, a política aprova sozinha e apenas registra",
          "O sistema concede: atribui o papel temporário no IdP ou na nuvem, ou libera o checkout da credencial no cofre",
          "A pessoa acessa pelo bastion; a sessão é gravada e atribuída a ela",
          "O prazo termina: o papel é removido e a credencial é trocada, sem depender de alguém lembrar",
          "O evento completo (pedido, aprovação, sessão, expiração) vai para o log de auditoria e alimenta a revisão",
        ],
        nota: "No zero trust (veja Q120) esse fluxo é o privilégio mínimo e a verificação por requisição aplicados às contas mais perigosas: a decisão considera pessoa, dispositivo, contexto e momento, e a concessão não sobrevive à necessidade.",
      },
      {
        tipo: "tabela",
        titulo: "Cada tipo de conta tem o seu tratamento",
        colunas: ["Tipo de conta", "Risco principal", "Controle central", "Observação"],
        linhas: [
          [
            "Administrador humano",
            "Credencial roubada com poder permanente",
            "Conta administrativa separada, JIT, MFA resistente a phishing, estação protegida",
            "Gravar a sessão e revisar os papéis elegíveis",
          ],
          [
            "Conta de serviço e automação",
            "Segredo antigo, sem dono, com permissão ampla",
            "Identidade gerenciada ou federada, credenciais curtas, escopo mínimo, dono registrado",
            "Se houver segredo, cofre com rotação automática (veja Q15)",
          ],
          [
            "Conta compartilhada (legado)",
            "Ninguém responde pelo que foi feito",
            "Cofre com checkout individual, motivo, sessão gravada e troca após cada uso",
            "Plano para eliminar: contas nominais sempre que o sistema permitir",
          ],
          [
            "Break-glass (emergência)",
            "Ficar sem acesso quando o IdP falha, ou abuso da própria conta",
            "Poucas contas, credencial longa sob dupla custódia, alerta imediato em qualquer uso",
            "Testar de tempos em tempos e trocar a credencial depois de cada uso",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Para cada acesso elevado, pergunte: **quem, para quê, por quanto tempo e o que ficou registrado**. Se alguma resposta for “qualquer um”, “para sempre” ou “não sabemos”, converta em JIT com aprovação e prazo. Use o cofre para o que ainda precisa de segredo, a gravação para o que é mais arriscado, e conceda automaticamente o que for de baixo risco.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Contas compartilhadas e break-glass são exceções vigiadas",
        texto:
          "Conta compartilhada destrói a rastreabilidade: se o sistema legado não aceita contas nominais, o cofre atribui cada checkout a uma pessoa e troca o segredo depois. A conta break-glass existe para o dia em que o IdP ou o MFA não funcionarem: use uma credencial que não dependa do mesmo IdP, guarde-a com dupla custódia, **alerte em qualquer uso**, teste de tempos em tempos e confira a recomendação do seu fornecedor de identidade. Fricção demais faz as pessoas contornarem o processo; meça o tempo para obter acesso e use papéis pré-aprovados, de prazo curto, para plantões.",
      },
    ],
    armadilhas: [
      "Manter o privilégio “por garantia” depois do trabalho: o acesso permanente acumula e vira o alvo ideal.",
      "Usar a mesma conta para ler e-mail e administrar servidores: um phishing comum vira comprometimento de administrador.",
      "Gravar sessões e nunca revisar, ou ter conta break-glass sem alerta nem teste: o controle existe no papel e falha no dia.",
      "Aprovar em massa, por rotina: o JIT vira carimbo (veja Q119). Aprovação com contexto e prazo curto vale mais que aprovação frequente.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre cofre e JIT?",
        resposta:
          "O cofre protege e rotaciona segredos e entrega a credencial sob controle. O JIT elimina o privilégio permanente, concedendo-o só quando necessário e por prazo curto. Os dois se complementam: o JIT reduz o tempo de exposição, e o cofre reduz o risco do segredo que ainda existe.",
      },
      {
        pergunta: "Como tratar uma conta compartilhada que não dá para eliminar?",
        resposta:
          "Colocá-la no cofre com checkout individual e motivo, gravar a sessão, trocar o segredo depois de cada uso e manter um plano para substituí-la por contas nominais. Assim a ação volta a ter uma pessoa responsável.",
      },
    ],
  },
  en: {
    titulo: "Privileged access (PAM and JIT)",
    pergunta:
      "How do you design privileged access management (PAM) for administrators and service accounts: vaulting, just-in-time access, session recording and break-glass?",
    porqueEsteMetodo:
      "PAM is a set of connected pieces (vault, elevation, recording, emergency), and the design script forces you to tie each piece to a requirement: what it protects, from whom and at what cost in friction.",
    resposta30s:
      "Privileged access is designed with **accounts separate from everyday ones**, **on-demand, time-limited elevation (just-in-time)**, a **vault with rotation** for the secrets that remain, **recorded sessions** and a monitored **emergency (break-glass) account**. The goal is **no standing privilege**: every elevated access is approved, justified, temporary and tied to a person. The cost is friction, which you control with automatic approval for low risk and pre-approved roles.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Privileged accounts (administrators, DBAs, cloud roles, service accounts) cause the most damage if compromised, which is why they are a priority for attackers, auditors and regulators (see Q138). Requirements: **traceability** (which person did what), **limited time**, least privilege (see Q109), audit evidence and availability in emergencies.",
          },
          {
            titulo: "2. Inventory and account separation",
            texto:
              "Find out who has privilege today, over what and why. Each administrator gets **two identities**: the everyday one (email, browsing, no privilege) and the administrative one, used only to administer, from a protected workstation and with phishing-resistant MFA. The shared local administrator goes away.",
          },
          {
            titulo: "3. On-demand elevation (JIT)",
            texto:
              "The person is **eligible** for a role but does not hold it: they request it, give a reason (a ticket), get approval (human for high risk, automatic for low) and receive the role **for a short time**, which expires on its own. This is “zero standing privilege”.",
          },
          {
            titulo: "4. Vault and rotation",
            texto:
              "The **vault** keeps what cannot be eliminated: local account passwords, keys, tokens. The person **checks out** the secret (assigned to them, with a reason), and the vault **changes it after use** and logs everything. For service accounts, prefer a managed or federated identity and short-lived credentials (see Q14 and Q16); any secret that remains is rotated automatically.",
          },
          {
            titulo: "5. Recorded and monitored sessions",
            texto:
              "Access to servers, databases and consoles goes through a **bastion or session proxy** that authenticates the person, injects the credential (they never see it) and **records the session** (video and commands). In the cloud, the provider’s audit log covers part of this role. Protect the record against tampering and make someone review the alerts.",
          },
          {
            titulo: "6. Emergency, cost and operations",
            texto:
              "Keep **break-glass accounts** for when the IdP or MFA fails, and measure the friction: time to obtain access and how often people work around the process. Periodic reviews (see Q119) and auditing close the loop.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "A JIT access request, start to finish",
        etapas: [
          "The person, signed in with the everyday account, requests the `prod-dba` role for two hours and gives the ticket number",
          "The policy checks eligibility, a managed device and a strong, recent authentication (step-up, see Q99)",
          "The approver (manager or system owner) approves; for low risk, the policy approves on its own and just records it",
          "The system grants: it assigns the temporary role in the IdP or cloud, or releases the credential checkout in the vault",
          "The person connects through the bastion; the session is recorded and attributed to them",
          "The time runs out: the role is removed and the credential is changed, without depending on anyone remembering",
          "The whole event (request, approval, session, expiry) goes to the audit log and feeds the review",
        ],
        nota: "In zero trust (see Q120) this flow is least privilege and per-request verification applied to the most dangerous accounts: the decision considers person, device, context and moment, and the grant does not outlive the need.",
      },
      {
        tipo: "tabela",
        titulo: "Each kind of account gets its own treatment",
        colunas: ["Account type", "Main risk", "Core control", "Note"],
        linhas: [
          [
            "Human administrator",
            "Stolen credential with permanent power",
            "Separate administrative account, JIT, phishing-resistant MFA, protected workstation",
            "Record the session and review eligible roles",
          ],
          [
            "Service and automation account",
            "Old secret, no owner, broad permission",
            "Managed or federated identity, short credentials, minimal scope, registered owner",
            "If a secret exists, a vault with automatic rotation (see Q15)",
          ],
          [
            "Shared account (legacy)",
            "Nobody answers for what was done",
            "Vault with individual checkout, reason, recorded session and a change after each use",
            "Plan to eliminate it: named accounts whenever the system allows",
          ],
          [
            "Break-glass (emergency)",
            "Being locked out when the IdP fails, or abuse of the account itself",
            "Few accounts, long credential under dual custody, immediate alert on any use",
            "Test from time to time and change the credential after each use",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "For every elevated access, ask: **who, for what, for how long and what was recorded**. If any answer is “anyone”, “forever” or “we don’t know”, convert it to JIT with approval and an expiry. Use the vault for what still needs a secret, recording for what is riskiest, and grant low-risk access automatically.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Shared accounts and break-glass are watched exceptions",
        texto:
          "A shared account destroys traceability: if the legacy system does not accept named accounts, the vault ties each checkout to a person and changes the secret afterwards. The break-glass account exists for the day the IdP or MFA does not work: use a credential that does not depend on the same IdP, keep it under dual custody, **alert on any use**, test it from time to time and check your identity vendor’s recommendation. Too much friction makes people work around the process; measure the time to get access and use pre-approved, short-lived roles for on-call shifts.",
      },
    ],
    armadilhas: [
      "Keeping the privilege “just in case” after the work is done: standing access accumulates and becomes the ideal target.",
      "Using the same account to read email and administer servers: an ordinary phishing becomes an administrator compromise.",
      "Recording sessions and never reviewing them, or having a break-glass account with no alert and no test: the control exists on paper and fails on the day.",
      "Approving in bulk, out of routine: JIT becomes a rubber stamp (see Q119). Approval with context and a short expiry is worth more than frequent approval.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a vault and JIT?",
        resposta:
          "The vault protects and rotates secrets and hands out the credential under control. JIT eliminates standing privilege, granting it only when needed and for a short time. They complement each other: JIT shortens the exposure time, and the vault reduces the risk of the secret that still exists.",
      },
      {
        pergunta: "How do you handle a shared account you cannot eliminate?",
        resposta:
          "Put it in the vault with individual checkout and a reason, record the session, change the secret after each use and keep a plan to replace it with named accounts. That way every action has a responsible person again.",
      },
    ],
  },
};
