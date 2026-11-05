import type { Pergunta } from "../../tipos";

// Q107 · Escolher RBAC, ABAC ou ReBAC
export const q107: Pergunta = {
  numero: 107,
  modulo: "autorizacao",
  metodo: "compare",
  pt: {
    titulo: "Escolher RBAC, ABAC ou ReBAC",
    pergunta:
      "Como escolher entre RBAC, ABAC e ReBAC, ou combiná-los? Dê critérios de decisão para um sistema de prontuários médicos.",
    porqueEsteMetodo:
      "Os três modelos respondem à mesma pergunta (“quem pode fazer o quê?”) com insumos diferentes, e a escolha vem de critérios, não de preferência. Uma matriz critério por critério deixa a decisão explícita e mostra por que, na prática, a resposta costuma ser um híbrido.",
    resposta30s:
      "**RBAC** decide pelo **papel** da pessoa (“médico pode ler prontuário”), **ABAC** decide por **atributos** do usuário, do recurso e do contexto (unidade, horário, sigilo) e **ReBAC** decide por **relações** entre objetos (“faz parte da equipe de cuidado deste paciente”). Use **RBAC como base**, **atributos** para restrições contextuais e **relações** para compartilhamento e vínculos, tudo avaliado numa **única fonte de verdade**. Num prontuário, o papel diz o que a pessoa faz; o vínculo e o contexto dizem em quais pacientes e quando.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Critério por critério",
        colunas: ["Critério", "RBAC (papéis)", "ABAC (atributos)", "ReBAC (relações)"],
        linhas: [
          [
            "Pergunta que responde",
            "Que função esta pessoa exerce?",
            "Os atributos do usuário, do recurso e do contexto satisfazem a política?",
            "Que relação existe entre esta pessoa e este objeto?",
          ],
          [
            "Número de regras",
            "Cresce com o número de papéis; vira explosão de papéis quando cada exceção ganha um papel",
            "Poucas políticas cobrem muitos casos, mas cada política é mais complexa",
            "Poucas regras de relação, mas muitos fatos (tuplas) para guardar e manter",
          ],
          [
            "Contexto (hora, local, dispositivo, sigilo)",
            "Não enxerga; precisa de papéis extras para simular",
            "Ponto forte: avalia o contexto a cada decisão",
            "Não enxerga sozinho; combina com atributos",
          ],
          [
            "Relações entre objetos (equipe, hierarquia, compartilhamento)",
            "Fraco: o papel não sabe de quem é o objeto",
            "Possível por atributos (lista da equipe no registro), porém desajeitado",
            "Ponto forte: herança por pasta, grupo ou equipe e “compartilhado com”",
          ],
          [
            "Auditoria (“quem tem acesso a quê?”)",
            "Fácil: lista quem tem o papel e o que o papel concede",
            "Mais difícil: depende de avaliar a política contra os atributos de hoje; exige simulação",
            "Consulta-se o grafo (quem alcança este objeto), mas o caminho da herança precisa ser explicável",
          ],
          [
            "Complexidade e custo operacional",
            "Baixa; familiar para o time e para auditores",
            "Média a alta; exige governança de atributos e de políticas",
            "Média a alta; exige um armazenamento de relações consistente com os dados de negócio",
          ],
          [
            "No prontuário médico",
            "Base: médico, enfermagem, recepção e faturamento, com o que cada papel pode fazer",
            "Restrições: mesma unidade, plantão, prontuário sigiloso, acesso de emergência",
            "Vínculo de cuidado: equipe do paciente, encaminhamento, compartilhamento com outro serviço",
          ],
        ],
        nota: "Veja Q104 (RBAC), Q105 (ABAC) e Q106 (ReBAC) para cada modelo em detalhe.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão e como combinar",
        texto:
          "Comece por **RBAC**: é simples, auditável e cobre o grosso. Acrescente **atributos** quando a restrição depende de contexto ou de dados do recurso e criaria papéis demais (mesma unidade, horário, nível de sigilo). Acrescente **relações** quando o acesso depende de quem se relaciona com quem (equipe do paciente, compartilhamento, herança). No híbrido, os três entram na **mesma decisão**: o papel dá o teto da ação, a relação restringe a quais objetos e os atributos aplicam as condições de contexto. **Negue por padrão**, avalie tudo num único ponto de decisão (veja Q114) e deixe cada insumo (papéis, vínculos, atributos) com **uma só fonte de verdade**.",
      },
      {
        tipo: "codigo",
        titulo: "Um híbrido numa só decisão",
        legenda: "TypeScript",
        codigo: `type Usuario = { id: string; papeis: string[]; unidadeId: string };
type Prontuario = { pacienteId: string; unidadeId: string; sigiloso: boolean };
type Contexto = { equipeDoPaciente: Set<string>; quebraVidro: boolean };

export function podeLerProntuario(u: Usuario, p: Prontuario, ctx: Contexto) {
  // RBAC: algum papel do usuário concede a ação?
  if (!u.papeis.some((papel) => PERMISSOES[papel]?.has("prontuario:ler"))) return negar("sem_papel");
  // ReBAC: há vínculo de cuidado com este paciente (ou emergência registrada)?
  if (!ctx.equipeDoPaciente.has(u.id) && !ctx.quebraVidro) return negar("sem_vinculo");
  // ABAC: prontuário sigiloso só na própria unidade, exceto em emergência
  if (p.sigiloso && u.unidadeId !== p.unidadeId && !ctx.quebraVidro) return negar("fora_da_unidade");
  return permitir({ auditoriaReforcada: ctx.quebraVidro });
}`,
        nota: "`PERMISSOES`, `negar` e `permitir` são auxiliares omitidos. O acesso de emergência (“quebra-vidro”) exige justificativa e auditoria reforçada, e cada negação devolve um motivo que ajuda a depurar.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Onde cada modelo falha",
        texto:
          "**RBAC inflado**: um papel por exceção (“médico-cardiologia-unidade-norte-plantão”) é o sinal de que a restrição deveria ser atributo ou relação. **ABAC sem governança**: atributos sem dono, desatualizados ou informados pelo cliente tornam a política imprevisível, e ninguém consegue explicar uma negação. **Híbrido sem fonte única de verdade**: papel num sistema, vínculo em outro e atributo num terceiro, que divergem, deixam o “quem tem acesso a quê?” sem resposta. Em saúde, onde o dado costuma ser pessoal sensível (como na LGPD ou no GDPR), prefira poucas regras claras, testadas e auditáveis a um motor sofisticado que ninguém revisa.",
      },
    ],
    armadilhas: [
      "Escolher o modelo pela moda (“ABAC é mais flexível”) em vez de pelos critérios: cada modelo cobra em governança, em dados e em auditoria.",
      "Criar um papel por exceção até a lista explodir: quando a restrição é de contexto ou de objeto, ela pede atributo ou relação.",
      "Confiar em atributos que o cliente pode informar (cabeçalho, campo do corpo) ou que ninguém mantém atualizados.",
      "Espalhar RBAC, ABAC e ReBAC em lugares diferentes do código e dos dados, sem decisão central: as regras divergem e a auditoria não fecha.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre RBAC e ABAC? Dê um exemplo de cada.",
        resposta:
          "No RBAC, a decisão vem do papel atribuído à pessoa (“enfermeiro pode registrar evolução”). No ABAC, vem de uma política sobre atributos do usuário, do recurso e do contexto (“pode ler se estiver na mesma unidade do prontuário e dentro do plantão”). O RBAC é mais simples e fácil de auditar; o ABAC é mais expressivo e exige governança dos atributos.",
      },
      {
        pergunta: "Por que só RBAC não basta num sistema de prontuários?",
        resposta:
          "Porque o papel diz o que a pessoa faz, não de quais pacientes ela cuida: um papel “médico” leria o prontuário de qualquer paciente. É preciso o vínculo de cuidado (relação) e condições como unidade, sigilo e emergência (atributos), sempre com auditoria.",
      },
    ],
  },
  en: {
    titulo: "Choosing RBAC, ABAC or ReBAC",
    pergunta:
      "How do you choose between RBAC, ABAC and ReBAC, or combine them? Give decision criteria for a medical records system.",
    porqueEsteMetodo:
      "The three models answer the same question (“who can do what?”) with different inputs, and the choice comes from criteria, not preference. A criterion-by-criterion matrix makes the decision explicit and shows why, in practice, the answer is usually a hybrid.",
    resposta30s:
      "**RBAC** decides by the person’s **role** (“a doctor can read a record”), **ABAC** decides by **attributes** of the user, the resource and the context (unit, time, confidentiality) and **ReBAC** decides by **relationships** between objects (“is part of this patient’s care team”). Use **RBAC as the base**, **attributes** for contextual restrictions and **relationships** for sharing and links, all evaluated against a **single source of truth**. In a medical record, the role says what the person does; the link and the context say for which patients and when.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Criterion by criterion",
        colunas: ["Criterion", "RBAC (roles)", "ABAC (attributes)", "ReBAC (relationships)"],
        linhas: [
          [
            "Question it answers",
            "What function does this person perform?",
            "Do the attributes of the user, the resource and the context satisfy the policy?",
            "What relationship exists between this person and this object?",
          ],
          [
            "Number of rules",
            "Grows with the number of roles; becomes role explosion when every exception gets its own role",
            "A few policies cover many cases, but each policy is more complex",
            "Few relationship rules, but many facts (tuples) to store and maintain",
          ],
          [
            "Context (time, location, device, confidentiality)",
            "Cannot see it; needs extra roles to simulate it",
            "Strength: evaluates context on every decision",
            "Cannot see it alone; combines with attributes",
          ],
          [
            "Relationships between objects (team, hierarchy, sharing)",
            "Weak: a role does not know whose object it is",
            "Possible through attributes (team list on the record), but awkward",
            "Strength: inheritance by folder, group or team, and “shared with”",
          ],
          [
            "Audit (“who has access to what?”)",
            "Easy: list who holds the role and what the role grants",
            "Harder: depends on evaluating the policy against today’s attributes; needs simulation",
            "You query the graph (who reaches this object), but the inheritance path must be explainable",
          ],
          [
            "Complexity and operating cost",
            "Low; familiar to the team and to auditors",
            "Medium to high; needs governance of attributes and policies",
            "Medium to high; needs a relationship store kept consistent with the business data",
          ],
          [
            "In a medical record system",
            "Base: doctor, nursing, front desk and billing, with what each role may do",
            "Restrictions: same unit, shift, confidential record, emergency access",
            "Care link: the patient’s team, referral, sharing with another service",
          ],
        ],
        nota: "See Q104 (RBAC), Q105 (ABAC) and Q106 (ReBAC) for each model in detail.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule and how to combine",
        texto:
          "Start with **RBAC**: it is simple, auditable and covers most needs. Add **attributes** when a restriction depends on context or on resource data and would create too many roles (same unit, time, confidentiality level). Add **relationships** when access depends on who is related to whom (the patient’s team, sharing, inheritance). In a hybrid, the three go into the **same decision**: the role sets the ceiling of the action, the relationship narrows it to which objects and the attributes apply the context conditions. **Deny by default**, evaluate everything at a single decision point (see Q114) and keep each input (roles, links, attributes) with **one source of truth**.",
      },
      {
        tipo: "codigo",
        titulo: "A hybrid in a single decision",
        legenda: "TypeScript",
        codigo: `type User = { id: string; roles: string[]; unitId: string };
type MedicalRecord = { patientId: string; unitId: string; confidential: boolean };
type Context = { patientTeam: Set<string>; breakGlass: boolean };

export function canReadRecord(u: User, r: MedicalRecord, ctx: Context) {
  // RBAC: does any of the user's roles grant the action?
  if (!u.roles.some((role) => PERMISSIONS[role]?.has("record:read"))) return deny("no_role");
  // ReBAC: is there a care link to this patient (or a logged emergency)?
  if (!ctx.patientTeam.has(u.id) && !ctx.breakGlass) return deny("no_link");
  // ABAC: confidential records only within the user's own unit, except in an emergency
  if (r.confidential && u.unitId !== r.unitId && !ctx.breakGlass) return deny("outside_unit");
  return allow({ extraAudit: ctx.breakGlass });
}`,
        nota: "`PERMISSIONS`, `deny` and `allow` are omitted helpers. Emergency access (“break-glass”) requires a justification and extra auditing, and every denial returns a reason that helps debugging.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Where each model fails",
        texto:
          "**Inflated RBAC**: one role per exception (“doctor-cardiology-north-unit-night-shift”) is the sign that the restriction should be an attribute or a relationship. **ABAC without governance**: attributes with no owner, out of date or supplied by the client make the policy unpredictable, and nobody can explain a denial. **A hybrid with no single source of truth**: roles in one system, links in another and attributes in a third, drifting apart, leave “who has access to what?” unanswerable. In healthcare, where data is usually sensitive personal data (as under LGPD or GDPR), prefer a few clear, tested and auditable rules over a sophisticated engine nobody reviews.",
      },
    ],
    armadilhas: [
      "Picking the model by fashion (“ABAC is more flexible”) instead of by criteria: each model costs something in governance, data and auditing.",
      "Creating one role per exception until the list explodes: when the restriction is about context or about the object, it calls for an attribute or a relationship.",
      "Trusting attributes the client can supply (a header, a body field) or that nobody keeps up to date.",
      "Scattering RBAC, ABAC and ReBAC across different places in code and data with no central decision: the rules drift apart and the audit does not add up.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between RBAC and ABAC? Give an example of each.",
        resposta:
          "In RBAC, the decision comes from the role assigned to the person (“a nurse can record progress notes”). In ABAC, it comes from a policy over attributes of the user, the resource and the context (“can read if in the same unit as the record and during their shift”). RBAC is simpler and easy to audit; ABAC is more expressive and requires governance of the attributes.",
      },
      {
        pergunta: "Why is RBAC alone not enough in a medical records system?",
        resposta:
          "Because a role says what the person does, not which patients they care for: a “doctor” role would read the record of any patient. You need the care link (a relationship) and conditions such as unit, confidentiality and emergency (attributes), always with auditing.",
      },
    ],
  },
};
