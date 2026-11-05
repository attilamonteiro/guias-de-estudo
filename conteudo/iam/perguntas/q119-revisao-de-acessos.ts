import type { Pergunta } from "../../tipos";

// Q119 · Revisão de acessos
export const q119: Pergunta = {
  numero: 119,
  modulo: "autorizacao",
  metodo: "playbook",
  pt: {
    titulo: "Revisão de acessos",
    pergunta:
      "Como conduzir uma revisão (recertificação) de acessos de forma eficaz? Quem revisa, que evidências usa e como evita que vire um carimbo automático?",
    porqueEsteMetodo:
      "Revisão de acessos é um procedimento repetido, e a diferença entre uma boa e um carimbo está nos detalhes de cada etapa. Um playbook dá, para cada passo, o critério e o sinal de que ele funcionou.",
    resposta30s:
      "Uma revisão eficaz define **escopo e periodicidade por risco**, gera a lista de acessos **com contexto (último uso, quem concedeu, risco)**, entrega a **revisores que conhecem o acesso** (gestor e dono do recurso), exige decisão de manter ou remover, **aplica as remoções** e guarda a evidência. Evita-se o carimbo reduzindo o volume, mostrando o último uso e medindo a taxa de remoção efetiva. Como a revisão periódica é só um retrato, combine-a com revisão contínua e automação.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: uma campanha de revisão",
        passos: [
          {
            titulo: "1. Defina escopo e periodicidade por risco",
            texto:
              "Liste o que será revisado: aplicações, grupos, papéis, acesso a dados e à nuvem. Contas privilegiadas e dados sensíveis são revisados com mais frequência; acessos de baixo risco, com menos. Sinal de acerto: cada sistema tem dono, nível de risco e calendário.",
          },
          {
            titulo: "2. Gere a lista com contexto",
            texto:
              "Para cada acesso, mostre quem tem, o que ele dá, **quem concedeu e quando**, **o último uso** e se há conflito de funções (veja Q110). É assim que se verifica o acesso de uma pessoa: identidade, atribuições diretas e por grupo, permissões efetivas, uso real e comparação com a função. A fonte é o IdP e os logs, não planilhas montadas à mão.",
          },
          {
            titulo: "3. Escolha os revisores certos",
            texto:
              "O **gestor** conhece a função da pessoa; o **dono do recurso** conhece o risco do acesso. Para privilegiados, inclua a segurança. Ninguém revisa o próprio acesso. Se o revisor não entende o acesso, ele aprova por inércia.",
          },
          {
            titulo: "4. Decida: manter, remover ou ajustar",
            texto:
              "Cada item exige uma decisão explícita. **Manter um acesso de alto risco exige justificativa.** Sem resposta no prazo, o padrão do acesso sensível é ser removido (ou escalado), não renovado.",
          },
          {
            titulo: "5. Aplique as remoções",
            texto:
              "A decisão só vale quando o acesso some. Automatize a revogação a partir da campanha (ou abra tarefas rastreadas) e confira depois que o acesso foi mesmo removido. Sinal de acerto: a taxa de remoções aplicadas é próxima de 100%.",
          },
          {
            titulo: "6. Registre a evidência",
            texto:
              "Guarde, de forma que não se possa alterar, quem revisou, quando, o que viu, o que decidiu e quando foi aplicado: é o que o auditor pede (veja Q19). Exceções ficam documentadas, com dono, motivo, controle compensatório e data de fim.",
          },
          {
            titulo: "7. Automatize e monitore continuamente",
            texto:
              "O que mais é removido vira regra: acesso que expira por padrão, papéis mais enxutos. Eventos como mudança de cargo e desligamento disparam revisão na hora (veja Q12 e Q13), e acesso temporário (veja Q118) reduz o que precisa ser revisado. Em escala corporativa, a governança é central: papéis e grupos em vez de permissões individuais, políticas versionadas, detecção de contas órfãs e desvios, e relatórios de conformidade gerados dos mesmos dados.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um item da campanha, com a evidência que o revisor precisa",
        legenda: "JSON",
        codigo: `{
  "campanha": "2026-T4-financeiro",
  "revisor": "gestor-da-pessoa",
  "pessoa": "ana.souza",
  "acesso": { "recurso": "erp-financeiro", "papel": "aprovador-de-pagamentos", "via": "grupo:fin-aprovadores" },
  "concedido_por": "chamado 4521",
  "concedido_em": "2025-03-12",
  "ultimo_uso": "2026-01-08",
  "risco": "alto",
  "conflitos": ["criar-fornecedor"],
  "recomendacao": "remover",
  "decisao": null
}`,
        nota: "A recomendação ajuda, mas não decide: quem responde é o revisor, que pode ter um bom motivo para manter (por exemplo, acesso de contingência).",
      },
      {
        tipo: "tabela",
        titulo: "Quem revisa o quê",
        colunas: ["Tipo de acesso", "Quem revisa", "Evidência principal", "Cuidado"],
        linhas: [
          [
            "Aplicações de negócio",
            "Gestor da pessoa e dono da aplicação",
            "Papel atual, último uso, função do cargo",
            "O gestor aprova tudo por hábito; mostre o último uso",
          ],
          [
            "Acesso privilegiado e administrativo",
            "Dono do sistema e segurança",
            "Elegibilidade, uso no período, sessões gravadas",
            "Exigir justificativa para manter; preferir JIT (veja Q118)",
          ],
          [
            "Contas de serviço e de aplicação",
            "Dono técnico registrado",
            "Para que serve, permissões, último uso do segredo",
            "Conta sem dono é candidata a desativação",
          ],
          [
            "Convidados e terceiros",
            "Patrocinador interno",
            "Contrato vigente, data de término, último acesso",
            "Expirar por padrão no fim do contrato",
          ],
          [
            "Infraestrutura em nuvem",
            "Dono da plataforma e do projeto",
            "Atribuições de papéis, permissões nunca usadas, log de auditoria",
            "Revisar também políticas e atribuições herdadas, não só usuários",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como evitar o carimbo",
        texto:
          "Revisor que aprova 100% dos itens em poucos segundos não está revisando. Reduza o volume (revise por exceção e por risco), **mostre o último uso e uma recomendação**, agrupe itens parecidos, exija justificativa para manter o que é arriscado, escale e remova quando não houver resposta, e **meça**: taxa de remoção, tempo por decisão e proporção de aprovações. Se a taxa de remoção é quase zero, ou a lista é irrelevante, ou o revisor não está olhando.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Revisão fraca: o que olhar primeiro",
        texto:
          "(1) O escopo cobre os sistemas e contas que importam, inclusive as privilegiadas e as de serviço? (2) O revisor tem contexto para decidir? (3) As remoções decididas foram **de fato aplicadas**? (4) Qual a taxa de aprovação e o tempo por item? (5) Há evidência guardada e exceções com prazo? Na prática, quase sempre o problema está em (3) ou em (2).",
      },
    ],
    armadilhas: [
      "Enviar uma planilha enorme, sem contexto: o revisor aprova tudo para terminar logo.",
      "Decidir “remover” e não aplicar: a campanha termina “concluída” com os acessos intactos.",
      "Deixar o gestor revisar sozinho tudo, inclusive o que ele não entende (aplicações técnicas, nuvem): o dono do recurso precisa participar.",
      "Tratar a revisão como evento anual e ignorar mudanças de cargo e desligamentos no meio do ano.",
    ],
    autoteste: [
      {
        pergunta: "Cite sinais de que uma revisão virou carimbo.",
        resposta:
          "Aprovação próxima de 100%, tempo por decisão muito curto e quase nenhuma remoção aplicada. Também: revisor que não conhece o acesso e ausência de justificativa para manter acesso de alto risco.",
      },
      {
        pergunta: "Por que mostrar o último uso ajuda o revisor?",
        resposta:
          "Porque troca uma pergunta difícil (“esta pessoa ainda deveria ter isto?”) por um fato objetivo: acesso que ninguém usa há muito tempo costuma poder sair. Quem decide continua sendo o revisor, que pode ter razão para manter.",
      },
    ],
  },
  en: {
    titulo: "Access reviews",
    pergunta:
      "How do you run an effective access review (recertification)? Who reviews, what evidence do they use, and how do you keep it from becoming a rubber stamp?",
    porqueEsteMetodo:
      "An access review is a repeated procedure, and the difference between a good one and a rubber stamp lies in the details of each step. A playbook gives, for every step, the criterion and the signal that it worked.",
    resposta30s:
      "An effective review sets **scope and frequency by risk**, generates the list of accesses **with context (last use, who granted it, risk)**, hands it to **reviewers who know the access** (manager and resource owner), requires a keep-or-remove decision, **applies the removals** and keeps the evidence. You avoid the rubber stamp by reducing volume, showing last use and measuring the effective removal rate. Since a periodic review is only a snapshot, combine it with continuous review and automation.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: a review campaign",
        passos: [
          {
            titulo: "1. Set scope and frequency by risk",
            texto:
              "List what will be reviewed: applications, groups, roles, access to data and to the cloud. Privileged accounts and sensitive data are reviewed more often; low-risk access, less often. A sign of success: every system has an owner, a risk level and a calendar.",
          },
          {
            titulo: "2. Generate the list with context",
            texto:
              "For each access, show who has it, what it grants, **who granted it and when**, **the last use** and whether there is a conflict of duties (see Q110). This is how you check one person’s access: identity, direct and group assignments, effective permissions, actual use and a comparison with the job. The source is the IdP and the logs, not hand-built spreadsheets.",
          },
          {
            titulo: "3. Pick the right reviewers",
            texto:
              "The **manager** knows the person’s role; the **resource owner** knows the risk of the access. For privileged access, add security. Nobody reviews their own access. If the reviewer does not understand the access, they approve out of inertia.",
          },
          {
            titulo: "4. Decide: keep, remove or adjust",
            texto:
              "Each item requires an explicit decision. **Keeping a high-risk access requires a justification.** With no answer by the deadline, the default for sensitive access is to be removed (or escalated), not renewed.",
          },
          {
            titulo: "5. Apply the removals",
            texto:
              "A decision only counts once the access is gone. Automate revocation from the campaign (or open tracked tasks) and check afterwards that the access was really removed. A sign of success: the rate of applied removals is close to 100%.",
          },
          {
            titulo: "6. Record the evidence",
            texto:
              "Keep, in a tamper-proof way, who reviewed, when, what they saw, what they decided and when it was applied: this is what the auditor asks for (see Q19). Exceptions are documented, with an owner, a reason, a compensating control and an end date.",
          },
          {
            titulo: "7. Automate and monitor continuously",
            texto:
              "What gets removed most becomes a rule: access that expires by default, leaner roles. Events such as a job change and offboarding trigger a review on the spot (see Q12 and Q13), and temporary access (see Q118) reduces what needs reviewing. At enterprise scale, governance is central: roles and groups instead of individual permissions, versioned policies, detection of orphan accounts and drift, and compliance reports generated from the same data.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "A campaign item, with the evidence the reviewer needs",
        legenda: "JSON",
        codigo: `{
  "campaign": "2026-Q4-finance",
  "reviewer": "line-manager",
  "person": "ana.souza",
  "access": { "resource": "erp-finance", "role": "payment-approver", "via": "group:fin-approvers" },
  "granted_by": "ticket 4521",
  "granted_on": "2025-03-12",
  "last_used": "2026-01-08",
  "risk": "high",
  "conflicts": ["create-vendor"],
  "recommendation": "remove",
  "decision": null
}`,
        nota: "The recommendation helps but does not decide: the reviewer answers, and may have a good reason to keep it (for example, contingency access).",
      },
      {
        tipo: "tabela",
        titulo: "Who reviews what",
        colunas: ["Type of access", "Who reviews", "Main evidence", "Watch out for"],
        linhas: [
          [
            "Business applications",
            "The person’s manager and the application owner",
            "Current role, last use, job function",
            "The manager approves everything out of habit; show last use",
          ],
          [
            "Privileged and administrative access",
            "System owner and security",
            "Eligibility, use in the period, recorded sessions",
            "Require a justification to keep; prefer JIT (see Q118)",
          ],
          [
            "Service and application accounts",
            "Registered technical owner",
            "What it is for, permissions, last use of the secret",
            "An account with no owner is a candidate for deactivation",
          ],
          [
            "Guests and third parties",
            "Internal sponsor",
            "Current contract, end date, last access",
            "Expire by default at the end of the contract",
          ],
          [
            "Cloud infrastructure",
            "Platform and project owner",
            "Role assignments, never-used permissions, audit log",
            "Also review policies and inherited assignments, not just users",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to avoid the rubber stamp",
        texto:
          "A reviewer who approves 100% of the items in a few seconds is not reviewing. Reduce volume (review by exception and by risk), **show last use and a recommendation**, group similar items, require a justification to keep what is risky, escalate and remove when there is no answer, and **measure**: removal rate, time per decision and share of approvals. If the removal rate is near zero, either the list is irrelevant or the reviewer is not looking.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A weak review: what to check first",
        texto:
          "(1) Does the scope cover the systems and accounts that matter, including privileged and service accounts? (2) Does the reviewer have the context to decide? (3) Were the decided removals **actually applied**? (4) What are the approval rate and the time per item? (5) Is the evidence kept, and do exceptions have an expiry? In practice, the problem is almost always in (3) or (2).",
      },
    ],
    armadilhas: [
      "Sending a huge spreadsheet with no context: the reviewer approves everything to finish quickly.",
      "Deciding “remove” and not applying it: the campaign ends “complete” with the accesses intact.",
      "Letting the manager review everything alone, including what they do not understand (technical applications, cloud): the resource owner must take part.",
      "Treating review as an annual event and ignoring job changes and departures during the year.",
    ],
    autoteste: [
      {
        pergunta: "Name signs that a review has become a rubber stamp.",
        resposta:
          "An approval rate close to 100%, a very short time per decision and almost no removals applied. Also: a reviewer who does not know the access, and no justification for keeping high-risk access.",
      },
      {
        pergunta: "Why does showing last use help the reviewer?",
        resposta:
          "Because it swaps a hard question (“should this person still have this?”) for an objective fact: access nobody has used for a long time can usually go. The reviewer still decides, and may have a reason to keep it.",
      },
    ],
  },
};
