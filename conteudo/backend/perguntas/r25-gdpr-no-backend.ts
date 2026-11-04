import type { Pergunta } from "../../tipos";

// R25 · GDPR no backend
export const r25: Pergunta = {
  numero: 125,
  modulo: "roadmap-intermediario",
  metodo: "playbook",
  pt: {
    titulo: "GDPR no backend",
    pergunta: "Que considerações devem ser feitas para a conformidade com o GDPR em um sistema backend?",
    porqueEsteMetodo:
      "Conformidade é uma lista de obrigações que se traduzem em capacidades técnicas. O playbook liga cada obrigação ao que o backend precisa ter.",
    resposta30s:
      "Colete **só o necessário** com **base legal e finalidade declarada**, **proteja os dados** (em trânsito e em repouso, acesso mínimo, auditoria), implemente os **direitos do titular** (acessar, corrigir, apagar, exportar), defina **retenção**, tenha um **plano para incidentes** (notificar a autoridade em até 72 horas, salvo risco improvável), controle **terceiros e transferências** e adote **privacidade desde o desenho**. No Brasil, a LGPD segue lógica parecida.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook técnico",
        passos: [
          {
            titulo: "Base legal e finalidade",
            texto:
              "Só colete dados com fundamento (consentimento, contrato, obrigação legal) e para uma finalidade declarada.",
          },
          {
            titulo: "Minimização",
            texto: "Colete apenas o necessário; evite campos “para o caso de precisar”.",
          },
          {
            titulo: "Segurança",
            texto:
              "Criptografia em trânsito e em repouso, controle de acesso mínimo, logs de acesso, pseudonimização quando possível e auditorias regulares.",
          },
          {
            titulo: "Direitos do titular",
            texto:
              "Fluxos e endpoints para **acessar**, **corrigir**, **apagar** (esquecimento), **exportar** (portabilidade) e revogar o consentimento.",
          },
          {
            titulo: "Retenção",
            texto:
              "Prazo por tipo de dado, com exclusão ou anonimização automática ao vencer; atenção a backups e logs.",
          },
          {
            titulo: "Incidentes",
            texto:
              "Plano de resposta: notificar a autoridade em até **72 horas** após tomar ciência da violação (salvo se improvável que cause risco) e os titulares quando o risco for alto.",
          },
          {
            titulo: "Terceiros e transferências",
            texto:
              "Contratos com operadores (DPA) e mapa de para onde os dados vão; cuidado com a transferência internacional.",
          },
          {
            titulo: "Privacidade desde o desenho",
            texto:
              "Privacy by design e by default, registro das atividades de tratamento e DPIA para tratamento de alto risco.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não é parecer jurídico",
        texto:
          "Este é o roteiro técnico para o backend. As decisões legais pertencem ao jurídico e ao DPO/encarregado.",
      },
    ],
    armadilhas: [
      "Guardar para sempre “porque pode ser útil”.",
      "Apagar do banco principal e esquecer backups, logs, caches e réplicas.",
      "Registrar dados pessoais em texto nos logs.",
      "Não saber onde cada dado pessoal está (sem inventário).",
    ],
    autoteste: [
      {
        pergunta: "Que direitos do titular o backend precisa suportar?",
        resposta: "Acesso, correção, exclusão (esquecimento), portabilidade e revogação do consentimento.",
      },
      {
        pergunta: "Qual o prazo para notificar a autoridade numa violação?",
        resposta:
          "Em até 72 horas depois de tomar conhecimento, a menos que seja improvável que haja risco para os titulares.",
      },
    ],
  },
  en: {
    titulo: "GDPR in the backend",
    pergunta: "What considerations must be taken into account for GDPR compliance in a backend system?",
    porqueEsteMetodo:
      "Compliance is a list of obligations that translate into technical capabilities. The playbook ties each obligation to what the backend must have.",
    resposta30s:
      "Collect **only what is necessary** with a **legal basis and a stated purpose**, **protect the data** (in transit and at rest, minimal access, auditing), implement **data-subject rights** (access, correct, erase, export), define **retention**, have an **incident plan** (notify the authority within 72 hours, unless risk is unlikely), control **third parties and transfers** and adopt **privacy by design**. In Brazil, the LGPD follows a similar logic.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Technical playbook",
        passos: [
          {
            titulo: "Legal basis and purpose",
            texto: "Only collect data with a basis (consent, contract, legal obligation) and for a stated purpose.",
          },
          {
            titulo: "Minimization",
            texto: "Collect only what is necessary; avoid fields “just in case”.",
          },
          {
            titulo: "Security",
            texto:
              "Encryption in transit and at rest, minimal access control, access logs, pseudonymization when possible and regular audits.",
          },
          {
            titulo: "Data-subject rights",
            texto:
              "Flows and endpoints to **access**, **correct**, **erase** (right to be forgotten), **export** (portability) and withdraw consent.",
          },
          {
            titulo: "Retention",
            texto: "A period per data type, with automatic deletion or anonymization at expiry; mind backups and logs.",
          },
          {
            titulo: "Incidents",
            texto:
              "A response plan: notify the authority within **72 hours** of becoming aware of the breach (unless risk is unlikely) and the subjects when risk is high.",
          },
          {
            titulo: "Third parties and transfers",
            texto:
              "Contracts with processors (DPA) and a map of where data goes; take care with international transfers.",
          },
          {
            titulo: "Privacy by design",
            texto:
              "Privacy by design and by default, a record of processing activities and a DPIA for high-risk processing.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Not legal advice",
        texto: "This is the technical roadmap for the backend. Legal decisions belong to the legal team and the DPO.",
      },
    ],
    armadilhas: [
      "Keeping data forever “because it may be useful”.",
      "Deleting from the main database and forgetting backups, logs, caches and replicas.",
      "Logging personal data in plain text.",
      "Not knowing where each piece of personal data lives (no inventory).",
    ],
    autoteste: [
      {
        pergunta: "Which data-subject rights must the backend support?",
        resposta: "Access, correction, erasure (right to be forgotten), portability and withdrawal of consent.",
      },
      {
        pergunta: "What is the deadline to notify the authority of a breach?",
        resposta: "Within 72 hours of becoming aware, unless the breach is unlikely to result in risk to the subjects.",
      },
    ],
  },
};
