import type { Pergunta } from "../../tipos";

// Q19 · IAM e conformidade
export const q019: Pergunta = {
  numero: 19,
  modulo: "fundamentos",
  metodo: "whys",
  pt: {
    titulo: "IAM e conformidade",
    pergunta:
      "Por que a conformidade (LGPD, HIPAA, ISO 27001) exige controles de IAM? Que evidências um auditor pede e como o sistema deve gerá-las?",
    porqueEsteMetodo:
      "Controles de IAM costumam aparecer como lista de exigências sem explicação. Perguntar “por quê” em cadeia mostra que cada controle nasce de um risco e de uma obrigação concreta, que é exatamente o que você precisa explicar a um auditor.",
    resposta30s:
      "A conformidade (LGPD, GDPR, HIPAA, ISO 27001) existe para proteger dados pessoais e sensíveis, e a primeira pergunta de qualquer proteção é **quem pode chegar a eles**. Por isso exige **acesso mínimo**, **rastreabilidade** (provar quem viu o quê e quando), **revisão periódica** e **segregação de funções**. O auditor pede **evidências** (listas de acessos, aprovações, revisões, logs) e o sistema deve **gerá-las como subproduto da operação**, não montá-las na véspera.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que leis e normas de proteção de dados falam de IAM?",
            resposta:
              "Porque proteger dado é, antes de tudo, controlar quem chega a ele. A LGPD e o GDPR exigem medidas de segurança adequadas ao risco e que o controlador consiga demonstrar que as aplica (prestação de contas). A regra de segurança do HIPAA lista controle de acesso, identificação única de cada usuário e controles de auditoria. A ISO 27001 pede política e controles de acesso dentro de um sistema de gestão de segurança. Sem controlar quem acessa, criptografia e rede não bastam.",
          },
          {
            pergunta: "Por que o acesso tem de ser mínimo?",
            resposta:
              "Porque cada permissão a mais é exposição sem finalidade. Os princípios de necessidade e finalidade da LGPD (a minimização, no GDPR) e o “mínimo necessário” do HIPAA dizem que só se acessa o que o trabalho exige. Na prática: papéis enxutos, acesso concedido por motivo e com prazo, e remoção na mudança de função e no desligamento (veja Q12 e Q13). Quanto menos gente alcança o dado, menor o estrago de uma conta roubada ou de um uso indevido interno.",
          },
          {
            pergunta: "Por que é preciso provar quem viu o quê (rastreabilidade)?",
            resposta:
              "Porque, num incidente, a organização precisa dizer quais dados foram expostos e a quem, para notificar autoridades e titulares dentro dos prazos legais, e porque o titular pode perguntar quem acessou os dados dele. Sem trilha de auditoria não há como responder nem se defender. A trilha precisa ser completa (ator, ação, recurso, hora, resultado), ter relógio sincronizado, ser protegida contra alteração (imutável ou com verificação de integridade) e ser retida pelo prazo que a norma e a política definem.",
          },
          {
            pergunta: "Por que revisar acessos periodicamente e separar funções?",
            resposta:
              "Porque o acesso envelhece: pessoas mudam de área, projetos acabam e ninguém tira o que sobrou. A recertificação periódica, em que o dono do recurso confirma ou remove cada acesso, prova que o controle funciona ao longo do tempo, não só que existiu no dia da implantação. A segregação de funções impede que uma só pessoa conclua os dois lados de uma operação sensível (pedir e aprovar um pagamento, desenvolver e publicar em produção) e reduz fraude e erro.",
          },
          {
            pergunta: "Por que o sistema deve gerar as evidências, e de forma contínua?",
            resposta:
              "Porque o auditor testa por amostra e quer o conjunto completo, com datas e responsáveis: todos os desligados do período e quando suas contas foram desabilitadas, por exemplo. Evidência montada à mão na véspera é lenta, incompleta e difícil de provar íntegra. Se aprovações, revisões e logs saem do próprio fluxo de trabalho, a evidência existe quando o auditor pede. No Zero Trust vale a mesma lógica: cada decisão de acesso é avaliada e registrada, e verificações automáticas apontam desvios (administrador sem MFA, conta órfã, revisão vencida) quando acontecem, não uma vez por ano.",
          },
        ],
        causaRaiz:
          "A conformidade é a obrigação de **provar** que o acesso a dados sensíveis é mínimo, controlado e rastreável. O IAM é o sistema que torna essa prova possível **como subproduto da operação**, e não um relatório montado para a auditoria.",
      },
      {
        tipo: "tabela",
        titulo: "O que o auditor pede e como o sistema produz",
        colunas: ["Evidência", "Pergunta do auditor", "Como o sistema gera"],
        linhas: [
          [
            "Lista de contas e acessos",
            "Quem tem acesso a este sistema, com qual papel?",
            "Exportação do IdP e da aplicação, com data, dono de cada conta e papel",
          ],
          [
            "Aprovação de concessão",
            "Quem aprovou este acesso e quando?",
            "Fluxo de solicitação com aprovação registrada e ligada ao chamado",
          ],
          [
            "Revisão periódica",
            "Os acessos foram recertificados?",
            "Campanha de recertificação com a decisão de cada revisor, a data e as remoções efetivadas",
          ],
          [
            "Desligamentos",
            "As contas de quem saiu foram desabilitadas a tempo?",
            "Cruzamento RH e IdP: data do desligamento contra data da desabilitação",
          ],
          [
            "Trilha de uso",
            "Quem acessou este dado e quando?",
            "Log de auditoria imutável: ator, ação, recurso, hora, origem e resultado",
          ],
          [
            "Segregação de funções",
            "Alguém reúne permissões conflitantes?",
            "Relatório de combinações proibidas e de exceções aprovadas, com prazo",
          ],
          [
            "Direitos do titular",
            "Quem acessou os dados desta pessoa? Ela pode pedir acesso, correção ou exclusão?",
            "Busca nos logs por titular e processo para atender os pedidos no prazo, sem apagar o que a lei manda reter",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um evento de auditoria útil",
        legenda: "JSON",
        codigo: `{
  "ts": "2026-11-04T14:32:08Z",
  "ator": { "id": "usr_8f3a", "tenant": "clinica-aurora", "ip": "203.0.113.10" },
  "acao": "prontuario.ler",
  "recurso": "prontuario/48213",
  "decisao": "permitido",
  "motivo": "papel=medico; vinculo-ativo-com-paciente",
  "autenticacao": { "mfa": true, "sessao": "ses_77c1" },
  "correlacao": "7b1e5c2a"
}`,
        nota: "Registre identificadores, não o conteúdo: o log não deve guardar o prontuário, senhas nem tokens. O log com dados pessoais também é dado pessoal, então minimize, proteja e defina a retenção com o jurídico.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como saber que a documentação de evidências funcionou",
        texto:
          "Faça um ensaio de auditoria: sorteie uma amostra (um desligado do trimestre, uma concessão de acesso privilegiado) e peça a alguém que não montou o processo para reconstruir a história só com o que o sistema guarda, em minutos. Se der certo, a evidência é **completa** (nenhum item da população falta), **consistente** (datas e responsáveis batem entre sistemas), **íntegra** (ninguém pôde editá-la depois) e **reproduzível**. Se for preciso procurar em e-mail, planilha ou memória, ela não funcionou.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "IAM entrega controles e evidências, não interpretação da lei",
        texto:
          "Dizer que uma organização “está em conformidade” é uma conclusão jurídica e de auditoria. O IAM implementa controles e produz evidências; o enquadramento legal (bases legais, prazos, retenção, direitos do titular) é do jurídico e do encarregado pelo tratamento de dados (DPO), e quem julga é o auditor. Trabalhe junto desde o desenho: traduza cada exigência num controle técnico testável. Atenção a um conflito real: o direito de eliminação do titular não apaga o que a lei obriga a reter, e os próprios logs contêm dados pessoais; defina retenção e finalidade e não guarde mais que o necessário.",
      },
    ],
    armadilhas: [
      "Montar as evidências à mão na véspera da auditoria: o conjunto sai incompleto, sem prova de integridade, e cada pedido novo vira uma corrida.",
      "Fazer a revisão de acessos como carimbo (aprovar tudo em lote): o controle existe no papel e não detecta nada.",
      "Registrar logs sem ator, hora ou resultado, com relógios dessincronizados ou editáveis por quem eles vigiam.",
      "Guardar dados pessoais ou segredos dentro do log, ou reter logs sem prazo nem finalidade: o log vira o próprio risco.",
    ],
    autoteste: [
      {
        pergunta: "Que evidências um auditor de IAM costuma pedir?",
        resposta:
          "Lista de contas e acessos, aprovações de concessão, revisões periódicas, comprovação de desligamentos, trilha de auditoria e relatório de segregação de funções, de preferência a população completa ou uma amostra, com datas e responsáveis.",
      },
      {
        pergunta: "Por que a trilha de auditoria precisa ser imutável?",
        resposta:
          "Porque ela vale como prova. Se quem é auditado (ou um atacante) pode editá-la, ela deixa de provar quem viu o quê; por isso se grava em armazenamento protegido contra alteração, com verificação de integridade.",
      },
    ],
  },
  en: {
    titulo: "IAM and compliance",
    pergunta:
      "Why does compliance (GDPR, HIPAA, ISO 27001) require IAM controls? What evidence does an auditor ask for, and how should the system produce it?",
    porqueEsteMetodo:
      "IAM controls often show up as a list of requirements with no explanation. Asking “why” in a chain shows that each control comes from a concrete risk and a concrete obligation, which is exactly what you need to explain to an auditor.",
    resposta30s:
      "Compliance (GDPR and, in Brazil, the LGPD; HIPAA; ISO 27001) exists to protect personal and sensitive data, and the first question of any protection is **who can reach it**. That is why it requires **least access**, **traceability** (proving who saw what and when), **periodic review** and **segregation of duties**. The auditor asks for **evidence** (access lists, approvals, reviews, logs) and the system should **produce it as a by-product of operation**, not assemble it the night before.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why do data protection laws and standards talk about IAM?",
            resposta:
              "Because protecting data is, first of all, controlling who reaches it. The GDPR and the LGPD require security measures appropriate to the risk and that the controller can demonstrate it applies them (accountability). The HIPAA security rule lists access control, unique user identification and audit controls. ISO 27001 asks for an access policy and controls inside a security management system. Without controlling who accesses, encryption and the network are not enough.",
          },
          {
            pergunta: "Why must access be minimal?",
            resposta:
              "Because every extra permission is exposure without a purpose. The necessity and purpose principles of the LGPD (data minimization in the GDPR) and HIPAA’s “minimum necessary” say that you only access what the job requires. In practice: lean roles, access granted for a reason and with an end date, and removal on role change and at termination (see Q12 and Q13). The fewer people who can reach the data, the smaller the damage from a stolen account or internal misuse.",
          },
          {
            pergunta: "Why must you prove who saw what (traceability)?",
            resposta:
              "Because, in an incident, the organization must say which data was exposed and to whom, to notify authorities and data subjects within legal deadlines, and because a data subject may ask who accessed their data. Without an audit trail there is no way to answer or to defend yourself. The trail must be complete (actor, action, resource, time, result), have a synchronized clock, be protected against alteration (immutable or with integrity checking) and be retained for the period the rules and policy define.",
          },
          {
            pergunta: "Why review access periodically and separate duties?",
            resposta:
              "Because access ages: people change departments, projects end and nobody removes what is left. Periodic recertification, in which the resource owner confirms or removes each access, proves the control works over time, not just that it existed on the day of rollout. Segregation of duties stops one person from completing both sides of a sensitive operation (requesting and approving a payment, developing and releasing to production) and reduces fraud and error.",
          },
          {
            pergunta: "Why should the system produce the evidence, and continuously?",
            resposta:
              "Because the auditor tests by sample and wants the complete set, with dates and owners: all leavers in the period and when their accounts were disabled, for example. Evidence assembled by hand the night before is slow, incomplete and hard to prove intact. If approvals, reviews and logs come out of the workflow itself, the evidence exists when the auditor asks. Zero Trust follows the same logic: every access decision is evaluated and recorded, and automated checks flag deviations (an admin without MFA, an orphaned account, an overdue review) when they happen, not once a year.",
          },
        ],
        causaRaiz:
          "Compliance is the obligation to **prove** that access to sensitive data is minimal, controlled and traceable. IAM is the system that makes that proof possible **as a by-product of operation**, not a report assembled for the audit.",
      },
      {
        tipo: "tabela",
        titulo: "What the auditor asks for and how the system produces it",
        colunas: ["Evidence", "Auditor’s question", "How the system produces it"],
        linhas: [
          [
            "List of accounts and access",
            "Who has access to this system, with which role?",
            "Export from the IdP and the application, with date, the owner of each account and the role",
          ],
          [
            "Approval of a grant",
            "Who approved this access and when?",
            "A request flow with recorded approval, linked to the ticket",
          ],
          [
            "Periodic review",
            "Was access recertified?",
            "A recertification campaign with each reviewer’s decision, the date and the removals carried out",
          ],
          [
            "Terminations",
            "Were leavers’ accounts disabled in time?",
            "HR and IdP cross-check: termination date against disabling date",
          ],
          [
            "Usage trail",
            "Who accessed this data and when?",
            "An immutable audit log: actor, action, resource, time, origin and result",
          ],
          [
            "Segregation of duties",
            "Does anyone hold conflicting permissions?",
            "A report of forbidden combinations and approved exceptions, with an end date",
          ],
          [
            "Data subject rights",
            "Who accessed this person’s data? Can they ask for access, correction or deletion?",
            "Log search by data subject and a process to meet requests on time, without deleting what the law requires you to retain",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "A useful audit event",
        legenda: "JSON",
        codigo: `{
  "ts": "2026-11-04T14:32:08Z",
  "actor": { "id": "usr_8f3a", "tenant": "aurora-clinic", "ip": "203.0.113.10" },
  "action": "medical-record.read",
  "resource": "medical-record/48213",
  "decision": "allowed",
  "reason": "role=physician; active-relationship-with-patient",
  "authentication": { "mfa": true, "session": "ses_77c1" },
  "correlation": "7b1e5c2a"
}`,
        nota: "Record identifiers, not content: the log must not hold the medical record, passwords or tokens. A log with personal data is personal data too, so minimize, protect and define retention with legal.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to know the evidence documentation worked",
        texto:
          "Run an audit rehearsal: draw a sample (a leaver from the quarter, a grant of privileged access) and ask someone who did not build the process to reconstruct the story from what the system stores alone, in minutes. If it works, the evidence is **complete** (no item of the population is missing), **consistent** (dates and owners match across systems), **intact** (nobody could edit it afterwards) and **reproducible**. If you have to dig through email, spreadsheets or memory, it did not work.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "IAM delivers controls and evidence, not an interpretation of the law",
        texto:
          "Saying an organization “is compliant” is a legal and audit conclusion. IAM implements controls and produces evidence; the legal framing (legal bases, deadlines, retention, data subject rights) belongs to legal and to the data protection officer (DPO), and the auditor is the one who judges. Work together from the design stage: translate each requirement into a testable technical control. Mind a real conflict: a data subject’s right to erasure does not delete what the law requires you to retain, and the logs themselves contain personal data; define retention and purpose and keep no more than necessary.",
      },
    ],
    armadilhas: [
      "Assembling evidence by hand the night before the audit: the set comes out incomplete, with no proof of integrity, and every new request becomes a scramble.",
      "Running access review as a rubber stamp (approving everything in bulk): the control exists on paper and detects nothing.",
      "Logging without actor, time or result, with unsynchronized clocks or logs editable by the people they watch.",
      "Storing personal data or secrets inside the log, or retaining logs with no deadline or purpose: the log becomes the risk itself.",
    ],
    autoteste: [
      {
        pergunta: "What evidence does an IAM auditor usually ask for?",
        resposta:
          "A list of accounts and access, grant approvals, periodic reviews, proof of terminations, the audit trail and a segregation-of-duties report, preferably the full population or a sample, with dates and owners.",
      },
      {
        pergunta: "Why must the audit trail be immutable?",
        resposta:
          "Because it works as proof. If the people being audited (or an attacker) can edit it, it no longer proves who saw what; that is why it is written to tamper-resistant storage with integrity checking.",
      },
    ],
  },
};
