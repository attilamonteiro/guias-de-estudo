import type { Pergunta } from "../../tipos";

// Q110 · Separação de funções
export const q110: Pergunta = {
  numero: 110,
  modulo: "autorizacao",
  metodo: "feynman",
  pt: {
    titulo: "Separação de funções",
    pergunta:
      "O que é separação de funções (SoD) e como ela previne fraude e erro? Como implementá-la em fluxos como aprovação de pagamentos ou acesso à produção?",
    porqueEsteMetodo:
      "A separação de funções é uma ideia simples que uma imagem do cotidiano explica bem (um cofre com duas chaves). A entrevista quer o mecanismo por trás: o que se separa, como detectar o conflito e o que fazer quando não dá para separar.",
    resposta30s:
      "**Separação de funções (SoD)** é o princípio de que **nenhuma pessoa conclui sozinha um processo crítico** (criar e aprovar o mesmo pagamento, escrever e publicar código em produção): isso **previne fraude**, que exigiria conluio, e **reduz erro**, porque outra pessoa confere. Implementa-se com uma **matriz de conflitos** entre funções, bloqueio na atribuição (SoD **estática**) e na execução (SoD **dinâmica**), **aprovação em dois passos** e **exceções compensadas e registradas**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Um cofre que só abre com duas chaves, guardadas por pessoas diferentes. Quem tem uma chave não consegue abrir sozinho, e para fraudar seria preciso convencer a outra pessoa. Se uma delas usar a chave por engano, a outra percebe antes de abrir.",
        tecnico:
          "Em sistemas, as “chaves” são **funções** (papéis, permissões ou etapas de um processo) que, juntas na mesma pessoa, permitem fraude ou erro sem controle: cadastrar um fornecedor e aprovar pagamentos a ele; solicitar e aprovar; desenvolver e implantar em produção; conceder acesso e usá-lo. A SoD define quais combinações são **incompatíveis** (matriz de conflitos), e o sistema as impede: **estaticamente**, recusando atribuir os dois papéis à mesma pessoa, e **dinamicamente**, deixando a pessoa ter ambos mas recusando que participe das duas etapas **da mesma transação**. É um controle esperado por auditorias e frameworks de segurança e de controles internos, como a ISO/IEC 27001 e os controles financeiros ligados à SOX.",
        limite:
          "O cofre de duas chaves não pensa em **conluio**: duas pessoas que combinam abrem tudo, então a SoD reduz o risco, mas pede auditoria e monitoramento. E equipes pequenas nem sempre têm gente para separar tudo; é aí que entram os controles compensatórios.",
      },
      {
        tipo: "tabela",
        titulo: "Exemplos de pares incompatíveis",
        colunas: ["Par de funções", "Risco se estiverem na mesma pessoa", "Controle típico"],
        linhas: [
          [
            "Cadastrar fornecedor × aprovar pagamento",
            "Fornecedor fictício que recebe pagamentos aprovados pela própria pessoa",
            "SoD estática: os dois papéis não podem ser atribuídos à mesma pessoa",
          ],
          [
            "Criar o pagamento × aprová-lo",
            "Autoaprovação de um pagamento indevido",
            "SoD dinâmica: o aprovador não pode ser o criador; acima de um limite, dois aprovadores distintos",
          ],
          [
            "Aprovar × liberar no banco ou conciliar",
            "Fraude com ocultação: quem aprova também esconde o rastro",
            "Execução e conciliação com pessoas ou áreas diferentes da aprovação",
          ],
          [
            "Desenvolver × implantar em produção",
            "Código mal-intencionado ou com erro chega à produção sem ninguém conferir",
            "Revisão obrigatória por outra pessoa, implantação feita pelo pipeline, sem acesso permanente de desenvolvedores à produção",
          ],
          [
            "Conceder acesso × usar ou auditar o acesso",
            "Quem administra acessos concede privilégios a si mesmo e apaga a trilha",
            "Quem administra não aprova a própria solicitação; os registros são auditados de forma independente",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "SoD dinâmica na aprovação de um pagamento",
        legenda: "TypeScript",
        codigo: `type Pagamento = { id: string; criadoPor: string; valor: number; aprovacoes: string[] };

// O papel "aprovador" já foi exigido antes (RBAC). Aqui entra a regra de SoD, sempre no servidor.
function podeAprovar(p: Pagamento, aprovador: string, limiteIndividual: number) {
  if (aprovador === p.criadoPor) return { ok: false, motivo: "autoaprovacao" };
  if (p.aprovacoes.includes(aprovador)) return { ok: false, motivo: "aprovacao_duplicada" };

  // acima do limite, são necessárias duas aprovações de pessoas distintas
  const exigidas = p.valor > limiteIndividual ? 2 : 1;
  if (p.aprovacoes.length >= exigidas) return { ok: false, motivo: "ja_aprovado" };

  return { ok: true };
}`,
        nota: "A regra roda no servidor a cada operação e grava quem solicitou, quem aprovou e quando. Esconder o botão na tela não é SoD.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Estática × dinâmica, e como usar cada uma",
        texto:
          "**Estática** (na atribuição): proíbe a mesma pessoa de ter os dois papéis. É simples de auditar e a escolha certa para conflitos graves e permanentes (cadastrar fornecedor × aprovar pagamento). **Dinâmica** (na execução): a pessoa pode ter os dois papéis, mas não pode agir nas duas etapas da mesma transação (criou, então não aprova). Serve quando o papel duplo é legítimo em outras situações, mas exige que a regra rode a cada operação. Em produção, o equivalente é: ninguém implanta o que escreveu, o pipeline implanta e a aprovação vem de outra pessoa (revisão de código obrigatória e aprovação do ambiente), sem acesso permanente de desenvolvedores à produção (veja Q118).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Exceções, evidência e brechas",
        texto:
          "Quando a separação não é possível (equipe pequena, emergência), registre a exceção com dono, justificativa e prazo e **compense** com outro controle: revisão independente do gestor, aprovação a posteriori, alerta e relatório de revisão. Para o auditor, guarde evidências: a matriz de conflitos versionada, os registros de quem solicitou, aprovou e executou (com data, protegidos contra alteração), o relatório periódico de conflitos encontrados e as exceções com aprovação. Fique atento às brechas: regra só no front-end, contas compartilhadas, conflitos **entre sistemas** (cadastra no ERP e aprova no banco), que só uma visão unificada de identidades enxerga (veja Q119), e o conluio.",
      },
    ],
    armadilhas: [
      "Separar só na tela (esconder o botão “Aprovar”) enquanto a API aceita a autoaprovação: a regra precisa ser imposta no servidor.",
      "Conferir conflitos dentro de um sistema só e esquecer os que aparecem entre sistemas (quem cadastra no ERP e aprova no banco).",
      "Usar contas compartilhadas ou administradores com acesso a todas as etapas, e acesso de emergência sem registro: a responsabilização individual some.",
      "Achar que a SoD elimina fraude: ela impede a fraude solitária, não o conluio; combine com auditoria, rodízio e alertas.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre SoD estática e dinâmica? Dê um exemplo de cada.",
        resposta:
          "A estática impede, na atribuição, que a mesma pessoa tenha dois papéis incompatíveis (cadastrar fornecedor e aprovar pagamento). A dinâmica deixa a pessoa ter os dois papéis, mas impede que ela participe das duas etapas da mesma transação (quem criou o pagamento não pode aprová-lo).",
      },
      {
        pergunta: "Numa equipe de três pessoas não dá para separar tudo. O que fazer?",
        resposta:
          "Separar o que for mais crítico e compensar o resto: revisão independente (de um gestor ou de outra equipe), aprovação a posteriori, alertas, registros protegidos contra alteração e revisão periódica, tudo documentado como exceção com dono e prazo.",
      },
    ],
  },
  en: {
    titulo: "Segregation of duties",
    pergunta:
      "What is segregation of duties (SoD), and how does it prevent fraud and error? How do you implement it in flows such as payment approval or production access?",
    porqueEsteMetodo:
      "Segregation of duties is a simple idea that an everyday picture explains well (a vault with two keys). The interview wants the mechanism behind it: what gets separated, how to detect the conflict and what to do when separation is not possible.",
    resposta30s:
      "**Segregation of duties (SoD)** is the principle that **no single person completes a critical process alone** (creating and approving the same payment, writing and releasing code to production): it **prevents fraud**, which would require collusion, and **reduces error**, because someone else checks. You implement it with a **conflict matrix** between duties, blocking at assignment (**static** SoD) and at execution (**dynamic** SoD), **two-step approval** and **compensated, recorded exceptions**.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A vault that only opens with two keys, held by different people. Whoever holds one key cannot open it alone, and to commit fraud they would have to convince the other person. If one of them uses the key by mistake, the other notices before opening.",
        tecnico:
          "In systems, the “keys” are **duties** (roles, permissions or steps of a process) that, held by the same person, allow fraud or error without a check: registering a supplier and approving payments to it; requesting and approving; developing and deploying to production; granting access and using it. SoD defines which combinations are **incompatible** (a conflict matrix), and the system prevents them: **statically**, by refusing to assign both roles to the same person, and **dynamically**, by letting the person hold both but refusing to let them take part in both steps **of the same transaction**. It is a control that audits and security and internal-control frameworks expect, such as ISO/IEC 27001 and the financial controls tied to SOX.",
        limite:
          "The two-key vault does not account for **collusion**: two people who agree can open everything, so SoD reduces the risk but needs auditing and monitoring. And small teams do not always have enough people to separate everything; that is where compensating controls come in.",
      },
      {
        tipo: "tabela",
        titulo: "Examples of incompatible pairs",
        colunas: ["Pair of duties", "Risk if held by the same person", "Typical control"],
        linhas: [
          [
            "Register a supplier × approve a payment",
            "A fictitious supplier that receives payments approved by the same person",
            "Static SoD: the two roles cannot be assigned to the same person",
          ],
          [
            "Create the payment × approve it",
            "Self-approval of an improper payment",
            "Dynamic SoD: the approver cannot be the creator; above a limit, two distinct approvers",
          ],
          [
            "Approve × release at the bank or reconcile",
            "Fraud with concealment: whoever approves also hides the trail",
            "Execution and reconciliation by different people or teams than the approval",
          ],
          [
            "Develop × deploy to production",
            "Malicious or faulty code reaches production with nobody checking it",
            "Mandatory review by another person, deployment done by the pipeline, no standing developer access to production",
          ],
          [
            "Grant access × use or audit the access",
            "Whoever administers access grants themselves privileges and erases the trail",
            "The administrator does not approve their own request; the logs are audited independently",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Dynamic SoD in a payment approval",
        legenda: "TypeScript",
        codigo: `type Payment = { id: string; createdBy: string; amount: number; approvals: string[] };

// The "approver" role was already required earlier (RBAC). Here comes the SoD rule, always on the server.
function canApprove(p: Payment, approver: string, individualLimit: number) {
  if (approver === p.createdBy) return { ok: false, reason: "self_approval" };
  if (p.approvals.includes(approver)) return { ok: false, reason: "duplicate_approval" };

  // above the limit, two approvals from distinct people are required
  const required = p.amount > individualLimit ? 2 : 1;
  if (p.approvals.length >= required) return { ok: false, reason: "already_approved" };

  return { ok: true };
}`,
        nota: "The rule runs on the server on every operation and records who requested, who approved and when. Hiding the button on screen is not SoD.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Static vs dynamic, and how to use each",
        texto:
          "**Static** (at assignment): forbids the same person from holding both roles. It is simple to audit and the right choice for serious, permanent conflicts (register a supplier × approve a payment). **Dynamic** (at execution): the person may hold both roles but cannot act in both steps of the same transaction (they created it, so they cannot approve it). It fits when the dual role is legitimate in other situations, but the rule must run on every operation. In production, the equivalent is: nobody deploys what they wrote, the pipeline deploys and the approval comes from another person (mandatory code review and environment approval), with no standing developer access to production (see Q118).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Exceptions, evidence and loopholes",
        texto:
          "When separation is not possible (a small team, an emergency), record the exception with an owner, a justification and an expiry and **compensate** with another control: independent review by a manager, after-the-fact approval, alerts and a review report. For the auditor, keep evidence: the versioned conflict matrix, the records of who requested, approved and executed (dated and protected against tampering), the periodic report of conflicts found and the exceptions with their approval. Watch for loopholes: a rule only in the front end, shared accounts, conflicts **across systems** (registers in the ERP and approves at the bank), which only a unified view of identities can see (see Q119), and collusion.",
      },
    ],
    armadilhas: [
      "Separating only on screen (hiding the “Approve” button) while the API accepts self-approval: the rule must be enforced on the server.",
      "Checking conflicts inside a single system and missing the ones that appear across systems (whoever registers in the ERP and approves at the bank).",
      "Using shared accounts or administrators with access to every step, and emergency access with no record: individual accountability disappears.",
      "Believing SoD eliminates fraud: it stops solo fraud, not collusion; combine it with auditing, rotation and alerts.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between static and dynamic SoD? Give an example of each.",
        resposta:
          "Static prevents, at assignment, the same person from holding two incompatible roles (registering a supplier and approving a payment). Dynamic lets the person hold both roles but prevents them from taking part in both steps of the same transaction (whoever created the payment cannot approve it).",
      },
      {
        pergunta: "On a team of three people you cannot separate everything. What do you do?",
        resposta:
          "Separate what is most critical and compensate for the rest: independent review (by a manager or another team), after-the-fact approval, alerts, tamper-resistant logs and periodic review, all documented as an exception with an owner and an expiry.",
      },
    ],
  },
};
