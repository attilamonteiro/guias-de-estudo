import type { Pergunta } from "../../tipos";

// Q12 · Ciclo de vida joiner-mover-leaver
export const q012: Pergunta = {
  numero: 12,
  modulo: "fundamentos",
  metodo: "trace",
  pt: {
    titulo: "Ciclo de vida joiner-mover-leaver",
    pergunta:
      "Descreva o ciclo de vida de identidade (joiner, mover, leaver). O que deve acontecer com contas, acessos e credenciais em cada etapa?",
    porqueEsteMetodo:
      "O ciclo de vida é uma história no tempo, e ela fica clara quando você acompanha uma pessoa do primeiro ao último dia: o que o sistema deve fazer em cada ponto e onde a história costuma sair dos trilhos (acúmulo de acessos, desligamento atrasado, contas órfãs).",
    resposta30s:
      "O ciclo de identidade tem três momentos: **joiner** (a pessoa entra: conta criada a partir do RH, com **acesso mínimo pelo papel** e credenciais fortes registradas), **mover** (muda de função: o acesso antigo é **removido** e o novo concedido, para não acumular privilégios) e **leaver** (sai: conta desabilitada, sessões e credenciais revogadas, propriedade dos recursos transferida). A **fonte da verdade é o RH**, a propagação é automatizada (por exemplo, por **SCIM**) e cada mudança deixa uma trilha de auditoria.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "Uma pessoa (hipotética), da contratação ao desligamento",
        etapas: [
          "Joiner: o RH registra a contratação (cargo, área, gestor, data de início). Esse registro é a fonte da verdade e dispara o evento",
          "O conector (por exemplo, SCIM) cria a identidade no IdP, ainda desabilitada, e atribui o acesso-base do papel (e-mail, chat, intranet): nada além do que o cargo exige",
          "No primeiro dia, a pessoa ativa a conta com verificação de identidade e registra o segundo fator (de preferência passkey ou chave de segurança); nenhuma senha viaja por e-mail",
          "Acessos extras (um sistema financeiro, um ambiente de produção) são pedidos à parte, aprovados pelo gestor e pelo dono do recurso, e ganham prazo de revisão",
          "Mover: meses depois, o RH registra a mudança de área. A regra recalcula os papéis: o acesso do cargo antigo sai, o do novo entra, e os acessos por exceção vão para recertificação",
          "Leaver: o RH registra o desligamento com data e hora. No momento previsto, o IdP desabilita a conta, revoga sessões e tokens e remove dispositivos e autenticadores (veja Q13)",
          "Depois: os recursos da pessoa passam a outro dono, a conta fica desabilitada pelo prazo de retenção e só então é excluída, preservando a trilha de auditoria",
        ],
        nota: "Cada etapa gera um evento de auditoria (quem pediu, quem aprovou, o que mudou, quando). É essa trilha que responde, meses depois, “por que esta pessoa tinha este acesso?”.",
      },
      {
        tipo: "tabela",
        titulo: "O que acontece com conta, acesso e credencial em cada etapa",
        colunas: ["Etapa", "Conta", "Acesso", "Credenciais"],
        linhas: [
          [
            "Joiner",
            "Criada a partir do RH, ligada a uma pessoa e a um gestor; habilitada na data de início",
            "Mínimo pelo papel; extras só com solicitação e aprovação",
            "Ativação com verificação de identidade; segundo fator ou passkey registrado; nada de senha compartilhada",
          ],
          [
            "Mover",
            "A mesma conta continua: a identidade é da pessoa, não do cargo",
            "Recalculado: sai o do papel antigo, entra o do novo; extras são revisados",
            "Autenticadores mantidos; segredos e chaves ligados ao cargo antigo são trocados ou revogados",
          ],
          [
            "Leaver",
            "Desabilitada no momento do desligamento; excluída só depois da retenção",
            "Tudo revogado, inclusive o que foi concedido por exceção",
            "Sessões e refresh tokens revogados; autenticadores, dispositivos, chaves de API e segredos pessoais removidos",
          ],
          [
            "Durante todo o ciclo",
            "Toda conta com um dono, sem duplicatas",
            "Revisão periódica (recertificação); acesso temporário e sob demanda quando possível",
            "Credenciais de curta duração e verificação a cada acesso",
          ],
        ],
        nota: "No Zero Trust, o ciclo de vida é contínuo: a identidade não é aprovada uma vez, é reavaliada a cada acesso (veja NIST SP 800-207). Por isso o ciclo termina em revogação rápida e credenciais de curta duração, não só em cadastro correto.",
      },
      {
        tipo: "passos",
        titulo: "Onde a história sai dos trilhos",
        passos: [
          {
            titulo: "Mover sem remover",
            texto:
              "O sistema só soma: cada troca de área acrescenta acessos e nenhuma os tira. Anos depois, a pessoa acumula privilégios (privilege creep) e pode reunir permissões que nunca deveriam estar juntas. Conserto: o evento de mudança recalcula o conjunto inteiro a partir do papel novo, e uma revisão periódica pega o que sobrou.",
          },
          {
            titulo: "Leaver atrasado",
            texto:
              "O RH avisa por e-mail dias depois, ou o evento fica preso numa fila, e a conta segue ativa. Conserto: o desligamento nasce no sistema do RH, com data e hora, e dispara a revogação sem depender de alguém lembrar.",
          },
          {
            titulo: "Conta órfã",
            texto:
              "Uma conta local numa aplicação sem SSO, uma conta de serviço sem dono ou a conta de um contratado que ninguém encerrou continua existindo sem uma pessoa por trás. Conserto: inventariar, exigir um dono para toda conta e reconciliar periodicamente as contas de cada sistema com o RH.",
          },
          {
            titulo: "Falha silenciosa da automação",
            texto:
              "O conector recusa uma atualização (erro de mapeamento, limite de requisições) e ninguém vê: o IdP diz uma coisa e a aplicação, outra. Conserto: monitorar os erros do conector e comparar, de tempos em tempos, o que está no destino com o que deveria estar.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Desligamento propagado por SCIM",
        legenda: "HTTP",
        codigo: `PATCH /scim/v2/Users/2819c223-7f76-453a-919d-413861904646 HTTP/1.1
Host: app.exemplo.com
Authorization: Bearer <token do conector>
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [
    { "op": "replace", "path": "active", "value": false }
  ]
}`,
        nota: "SCIM (RFC 7643 e RFC 7644) padroniza como o IdP fala com cada aplicação: criar, atualizar e desativar usuários. Desativar (`active: false`) preserva o registro e a trilha; apagar é uma etapa posterior.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra",
        texto:
          "A **identidade nasce e morre no RH**, o **acesso é calculado pelo papel** (e só somado por exceção aprovada, com prazo), a **remoção vem junto da concessão** e **tudo é registrado**. Se qualquer um desses quatro falta, o ciclo de vida vira cadastro manual.",
      },
    ],
    armadilhas: [
      "Mover sem remover: o acesso novo é somado ao antigo e a pessoa acumula privilégios a cada troca de área.",
      "Disparar o desligamento por e-mail ou chamado em vez de pelo evento do RH: o atraso deixa a conta ativa por dias.",
      "Deixar fora do fluxo as contas locais, compartilhadas, de serviço e de contratados, sem dono: elas viram contas órfãs que ninguém revisa.",
      "Excluir a conta no desligamento e perder a trilha de auditoria e a propriedade dos recursos, ou nunca excluir e acumular contas mortas: defina a retenção.",
    ],
    autoteste: [
      {
        pergunta: "Por que, no mover, o acesso antigo deve sair antes (ou junto) de o novo entrar?",
        resposta:
          "Sem isso os acessos se acumulam (privilege creep), o que fere o menor privilégio e pode reunir permissões conflitantes. O papel novo define o conjunto completo, não um acréscimo ao anterior.",
      },
      {
        pergunta: "O que é uma conta órfã e como encontrá-la?",
        resposta:
          "É uma conta ativa sem pessoa ou dono responsável, como a de quem saiu ou uma conta de serviço esquecida. Encontra-se cruzando as contas de cada sistema com o RH e com o inventário de donos, e revisando as que não casam.",
      },
    ],
  },
  en: {
    titulo: "Joiner-mover-leaver lifecycle",
    pergunta:
      "Describe the identity lifecycle (joiner, mover, leaver). What should happen to accounts, access and credentials at each stage?",
    porqueEsteMetodo:
      "The lifecycle is a story over time, and it becomes clear when you follow one person from the first day to the last: what the system should do at each point and where the story usually goes off the rails (piled-up access, late offboarding, orphaned accounts).",
    resposta30s:
      "The identity lifecycle has three moments: **joiner** (the person arrives: account created from HR data, with **least access for the role** and strong credentials enrolled), **mover** (changes role: the old access is **removed** and the new one granted, so privileges do not pile up) and **leaver** (leaves: account disabled, sessions and credentials revoked, resource ownership transferred). The **source of truth is HR**, propagation is automated (for example through **SCIM**) and every change leaves an audit trail.",
    blocos: [
      {
        tipo: "fluxo",
        titulo: "One (hypothetical) person, from hiring to leaving",
        etapas: [
          "Joiner: HR records the hire (job, department, manager, start date). That record is the source of truth and triggers the event",
          "The connector (for example, SCIM) creates the identity in the IdP, still disabled, and assigns the role’s baseline access (email, chat, intranet): nothing beyond what the job requires",
          "On day one, the person activates the account with identity verification and enrolls the second factor (preferably a passkey or security key); no password travels by email",
          "Extra access (a finance system, a production environment) is requested separately, approved by the manager and the resource owner, and gets a review date",
          "Mover: months later, HR records the change of department. The rule recalculates roles: the old job’s access goes, the new one’s comes in, and exception-based access goes to recertification",
          "Leaver: HR records the termination with date and time. At the planned moment, the IdP disables the account, revokes sessions and tokens and removes devices and authenticators (see Q13)",
          "Afterwards: the person’s resources move to another owner, the account stays disabled for the retention period and is only then deleted, keeping the audit trail",
        ],
        nota: "Every stage produces an audit event (who asked, who approved, what changed, when). That trail is what answers, months later, “why did this person have this access?”.",
      },
      {
        tipo: "tabela",
        titulo: "What happens to account, access and credentials at each stage",
        colunas: ["Stage", "Account", "Access", "Credentials"],
        linhas: [
          [
            "Joiner",
            "Created from HR data, tied to a person and a manager; enabled on the start date",
            "Least privilege for the role; extras only by request and approval",
            "Activation with identity verification; second factor or passkey enrolled; no shared passwords",
          ],
          [
            "Mover",
            "The same account carries on: identity belongs to the person, not the job",
            "Recalculated: the old role’s access goes, the new role’s comes in; extras are reviewed",
            "Authenticators kept; secrets and keys tied to the old job are rotated or revoked",
          ],
          [
            "Leaver",
            "Disabled at the moment of termination; deleted only after retention",
            "Everything revoked, including what was granted by exception",
            "Sessions and refresh tokens revoked; authenticators, devices, API keys and personal secrets removed",
          ],
          [
            "Throughout the lifecycle",
            "Every account has an owner, with no duplicates",
            "Periodic review (recertification); temporary, on-demand access where possible",
            "Short-lived credentials and verification on every access",
          ],
        ],
        nota: "In Zero Trust the lifecycle is continuous: identity is not approved once, it is re-evaluated on every access (see NIST SP 800-207). That is why the lifecycle ends in fast revocation and short-lived credentials, not just in a correct registration.",
      },
      {
        tipo: "passos",
        titulo: "Where the story goes off the rails",
        passos: [
          {
            titulo: "Moving without removing",
            texto:
              "The system only adds: every department change brings new access and none takes the old away. Years later the person has accumulated privileges (privilege creep) and may hold permissions that should never be together. Fix: the change event recalculates the whole set from the new role, and a periodic review catches what is left.",
          },
          {
            titulo: "Late leaver",
            texto:
              "HR sends an email days later, or the event sits in a queue, and the account stays active. Fix: the termination originates in the HR system, with date and time, and triggers revocation without depending on someone remembering.",
          },
          {
            titulo: "Orphaned account",
            texto:
              "A local account in an application without SSO, a service account with no owner or a contractor’s account nobody closed keeps existing with no person behind it. Fix: take an inventory, require an owner for every account and periodically reconcile each system’s accounts with HR.",
          },
          {
            titulo: "Silent automation failure",
            texto:
              "The connector rejects an update (mapping error, rate limit) and nobody sees it: the IdP says one thing and the application another. Fix: monitor connector errors and regularly compare what is in the target with what should be there.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Offboarding propagated through SCIM",
        legenda: "HTTP",
        codigo: `PATCH /scim/v2/Users/2819c223-7f76-453a-919d-413861904646 HTTP/1.1
Host: app.example.com
Authorization: Bearer <connector token>
Content-Type: application/scim+json

{
  "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
  "Operations": [
    { "op": "replace", "path": "active", "value": false }
  ]
}`,
        nota: "SCIM (RFC 7643 and RFC 7644) standardizes how the IdP talks to each application: create, update and deactivate users. Deactivating (`active: false`) keeps the record and the trail; deleting is a later step.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Rule",
        texto:
          "**Identity is born and dies in HR**, **access is computed from the role** (and only added by approved, time-limited exception), **removal comes with the grant** and **everything is recorded**. If any of the four is missing, the lifecycle turns into manual bookkeeping.",
      },
    ],
    armadilhas: [
      "Moving without removing: the new access is added to the old and the person accumulates privileges with every department change.",
      "Triggering offboarding by email or ticket instead of by the HR event: the delay leaves the account active for days.",
      "Leaving local, shared, service and contractor accounts outside the flow with no owner: they become orphaned accounts nobody reviews.",
      "Deleting the account at termination and losing the audit trail and resource ownership, or never deleting and piling up dead accounts: define the retention.",
    ],
    autoteste: [
      {
        pergunta: "Why must the old access go before (or together with) the new access in a mover event?",
        resposta:
          "Without that, access piles up (privilege creep), which breaks least privilege and can bring together conflicting permissions. The new role defines the complete set, not an addition to the previous one.",
      },
      {
        pergunta: "What is an orphaned account and how do you find one?",
        resposta:
          "It is an active account with no responsible person or owner, such as that of someone who left or a forgotten service account. You find them by matching each system’s accounts against HR and the owner inventory, and reviewing the ones that do not match.",
      },
    ],
  },
};
