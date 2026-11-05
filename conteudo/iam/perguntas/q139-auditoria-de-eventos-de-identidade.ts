import type { Pergunta } from "../../tipos";

// Q139 · Auditoria de eventos de identidade
export const q139: Pergunta = {
  numero: 139,
  modulo: "ataques-e-depuracao",
  metodo: "design",
  pt: {
    titulo: "Auditoria de eventos de identidade",
    pergunta:
      "Como projetar observabilidade e auditoria de eventos de identidade (logins, falhas, MFA, concessões, mudanças de permissão) para detecção, investigação e conformidade?",
    porqueEsteMetodo:
      "É uma pergunta de projeto: um roteiro fixo (requisitos, eventos, esquema, transporte, guarda, privacidade, alertas) evita esquecer uma etapa e mostra onde nascem os trade-offs de volume e de ruído.",
    resposta30s:
      "Comece pelas perguntas que a trilha precisa responder (**quem fez o quê, quando, de onde e com que resultado**) e registre os eventos de autenticação, MFA, tokens, concessões e mudanças de permissão em **formato estruturado com ID de correlação**, sem segredos nem dados sensíveis. Envie tudo a um **SIEM** e guarde a trilha em armazenamento **imutável**, com retenção definida, alertando sobre poucos eventos de alto sinal (escalonamento de privilégio, login anômalo). A prova de que funciona vem de testes e de métricas de cobertura e de tempo de detecção, não de “alguém olhou os logs”.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Roteiro de projeto",
        passos: [
          {
            titulo: "1. Requisitos: as perguntas da trilha",
            texto:
              "Liste as perguntas antes de escolher ferramenta: **investigar** (o que esta conta fez nas últimas 24 horas?), **detectar** (algo fugiu do padrão?) e **provar** (quem aprovou este acesso e quando?). Cada uma diz quais eventos e quanto histórico você precisa.",
          },
          {
            titulo: "2. Eventos obrigatórios",
            texto:
              "Registre as decisões e as mudanças, não só os erros (veja a primeira tabela). Critério: para qualquer concessão de acesso dá para reconstruir quem pediu, quem aprovou, quando passou a valer e quando foi removida.",
          },
          {
            titulo: "3. Esquema e correlação",
            texto:
              "JSON estruturado, com hora em UTC (relógios sincronizados), tipo do evento, **ator** com identificador estável (o `sub`, não só o e-mail; veja Q52), alvo, resultado e motivo, IP, dispositivo, tenant, método de autenticação e um **ID de correlação** que une o login, o token e as chamadas seguintes. Um esquema comum entre IdP, aplicações e APIs é o que permite correlacionar.",
          },
          {
            titulo: "4. Transporte e SIEM",
            texto:
              "Envie os eventos do IdP, das aplicações e da infraestrutura a um **SIEM** por um coletor com buffer e reenvio. Monitore também o silêncio: uma fonte que parou de enviar é um alerta, não um dia tranquilo.",
          },
          {
            titulo: "5. Integridade e retenção",
            texto:
              "Armazenamento de escrita única (append-only ou WORM) ou com encadeamento por hash, num sistema que os administradores dos ambientes vigiados não controlam. Retenção em camadas (quente para busca, fria para guarda), com o prazo definido por conformidade e jurídico. Para o desenho geral de gestão de logs, veja o NIST SP 800-92.",
          },
          {
            titulo: "6. Privacidade",
            texto:
              "Minimize: nada de senhas, tokens, códigos de MFA, segredos ou dados pessoais sensíveis no log; mascare o que for possível, restrinja quem lê e defina finalidade e prazo conforme a legislação de proteção de dados aplicável.",
          },
          {
            titulo: "7. Alertas, painéis e revisão",
            texto:
              "Regras de alto sinal (papel privilegiado concedido, MFA removido, novo consentimento ou credencial, login impossível) mais uma linha de base de comportamento. Todo alerta tem **dono, severidade e roteiro de resposta**; ao revisá-lo, guarde a evidência: evento bruto, ID de correlação, contexto do usuário e do dispositivo, decisão e justificativa. Painéis úteis: falhas por tipo, adoção de MFA, tempo de aprovação de acessos, contas dormentes.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Eventos obrigatórios",
        colunas: ["Categoria", "Exemplos", "Por que registrar"],
        linhas: [
          [
            "Autenticação",
            "Login com sucesso e falha (com o motivo), logout, bloqueio de conta, redefinição de senha",
            "Revela credential stuffing, força bruta e contas comprometidas (veja Q134)",
          ],
          [
            "MFA",
            "Registro e remoção de fator, desafio aprovado ou negado, pedidos em série",
            "Enfraquecer o MFA costuma preparar um ataque; pedidos em série indicam fadiga (veja Q90)",
          ],
          [
            "Tokens e sessões",
            "Emissão, renovação, revogação, falha de validação (assinatura, `aud`, expiração)",
            "Mostra replay e abuso de token (veja Q130)",
          ],
          [
            "Concessões e consentimento",
            "Consentimento OAuth, novo aplicativo, segredo ou credencial criados",
            "É o meio mais comum de persistência (veja Q131)",
          ],
          [
            "Mudança de permissão",
            "Papel ou grupo alterado, quem aprovou, elevação JIT, uso de conta de emergência",
            "Prova de escalonamento de privilégio e trilha de aprovação para conformidade",
          ],
          [
            "Administração do diretório e do IdP",
            "Criar ou desabilitar usuário, mudar configuração, trocar certificado ou chave",
            "Protege a integridade da própria identidade",
          ],
          [
            "Negações e acesso a dados sensíveis",
            "Autorização negada, leitura de dado crítico, exportação",
            "Aponta tentativa de acesso indevido e IDOR (veja Q136)",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Termos que se confundem",
        colunas: ["Conceito", "O que é", "Pergunta que responde", "O que prova (e o que não prova)"],
        linhas: [
          [
            "Log",
            "Registro bruto de um evento",
            "O que aconteceu aqui?",
            "Que o evento foi registrado, não que o registro está completo",
          ],
          [
            "Auditoria",
            "Trilha íntegra, retida e revisável das ações de identidade e acesso",
            "Quem fez o quê, e dá para provar?",
            "Responsabilização e conformidade, se a trilha for completa e infalsificável",
          ],
          [
            "Monitoramento",
            "Observação contínua de sinais, com alertas",
            "Há algo fora do normal agora?",
            "Que o controle é observado; silêncio não prova ausência de ataque",
          ],
          [
            "Observabilidade",
            "Logs, métricas e traces para investigar o imprevisto",
            "Por que isto está acontecendo?",
            "Capacidade de investigar, não que a causa foi achada",
          ],
          [
            "SIEM",
            "Reúne, normaliza, correlaciona e alerta sobre eventos de várias fontes",
            "Estes eventos juntos indicam um ataque?",
            "Correlação, limitada pela cobertura das fontes",
          ],
          [
            "SOAR",
            "Automatiza a resposta por roteiros (desabilitar conta, revogar sessão, abrir chamado)",
            "Como reagir sem esperar uma pessoa?",
            "Rapidez; automação mal calibrada bloqueia gente legítima",
          ],
          [
            "UEBA e aprendizado de máquina",
            "Modelos que aprendem a linha de base e apontam desvios",
            "Isto é incomum para esta pessoa ou grupo?",
            "Um sinal estatístico, não uma prova; exige revisão humana",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Um evento de auditoria",
        legenda: "JSON",
        codigo: `{
  "timestamp": "2026-11-04T14:07:31.482Z",
  "event_type": "role.assigned",
  "outcome": "success",
  "actor": { "id": "usr_8f3a", "ip": "203.0.113.24", "device_id": "dev_41c9" },
  "target": { "type": "user", "id": "usr_1b72" },
  "details": {
    "role": "billing_admin",
    "approved_by": "usr_55de",
    "ticket": "CHG-1042",
    "expires_at": "2026-11-04T18:07:31Z"
  },
  "auth": { "method": "webauthn", "session_id": "sid_9c2e" },
  "tenant_id": "tnt_acme",
  "correlation_id": "req_7d41a0",
  "source": "idp-admin-api"
}`,
        nota: "Registre o motivo e a aprovação, nunca o segredo: nada de senha, token, código de MFA ou corpo de requisição. O `correlation_id` liga este evento ao pedido que o originou e ao login da sessão.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Trade-offs e como saber que funciona",
        texto:
          "**Sem log, sem evidência**: se uma decisão ou mudança não foi registrada, você não detecta, não investiga e não prova conformidade. Corte o volume de baixo valor (leituras repetidas, verificações de saúde), nunca as decisões e as mudanças. **Alerta demais, ninguém lê**: falso positivo frequente gera fadiga e faz ignorar o alerta verdadeiro; calibre com contexto, severidade e a medição da taxa de falsos positivos. Para saber se a revisão de logs funcionou, não basta ter olhado: meça a cobertura das fontes e o tempo até detectar e responder, simule um ataque (conta comprometida, escalonamento) e veja se o alerta dispara, quem age e em quanto tempo, e acompanhe os achados que viraram mudança de política. Monitorar prova que o controle é observado, não que o ambiente é seguro.",
      },
    ],
    armadilhas: [
      "Registrar senhas, tokens, códigos de MFA ou corpos de requisição “para depurar”: o log vira um segundo cofre de credenciais.",
      "Guardar o log só no servidor que ele vigia, onde quem o administra (ou o invasor) pode apagá-lo.",
      "Registrar apenas falhas: o sucesso depois de centenas de falhas, a concessão de um papel e a mudança de MFA são o que mais importa.",
      "Criar alertas sem dono nem roteiro e não monitorar o próprio pipeline: uma fonte que parou de enviar parece um dia calmo.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre log, auditoria e monitoramento?",
        resposta:
          "Log é o registro bruto do evento; auditoria é a trilha íntegra, retida e revisável que permite responsabilizar e provar conformidade; monitoramento é a observação contínua que gera alertas para agir rápido. Um alimenta o outro.",
      },
      {
        pergunta: "O que acontece se faltar log de auditoria, e o que acontece se houver alerta demais?",
        resposta:
          "Sem log não há como detectar, investigar nem provar; com alerta demais, a equipe se cansa e ignora o verdadeiro. O equilíbrio é registrar sempre decisões e mudanças e calibrar as regras com contexto e medição de falsos positivos.",
      },
    ],
  },
  en: {
    titulo: "Identity event auditing",
    pergunta:
      "How do you design observability and auditing of identity events (logins, failures, MFA, grants, permission changes) for detection, investigation and compliance?",
    porqueEsteMetodo:
      "This is a design question: a fixed script (requirements, events, schema, transport, custody, privacy, alerts) avoids forgetting a step and shows where the volume and noise trade-offs come from.",
    resposta30s:
      "Start from the questions the trail must answer (**who did what, when, from where and with what result**) and record authentication, MFA, token, grant and permission-change events in a **structured format with a correlation ID**, with no secrets or sensitive data. Ship everything to a **SIEM** and keep the trail in **immutable** storage with a defined retention, alerting on a few high-signal events (privilege escalation, anomalous login). The proof that it works comes from tests and from coverage and time-to-detect metrics, not from “somebody looked at the logs”.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Design script",
        passos: [
          {
            titulo: "1. Requirements: the questions of the trail",
            texto:
              "List the questions before choosing tools: **investigate** (what did this account do in the last 24 hours?), **detect** (did something leave the pattern?) and **prove** (who approved this access and when?). Each one tells you which events and how much history you need.",
          },
          {
            titulo: "2. Mandatory events",
            texto:
              "Record decisions and changes, not just errors (see the first table). Criterion: for any access grant you can reconstruct who asked, who approved, when it took effect and when it was removed.",
          },
          {
            titulo: "3. Schema and correlation",
            texto:
              "Structured JSON, with UTC time (synchronized clocks), event type, **actor** with a stable identifier (the `sub`, not just the email; see Q52), target, outcome and reason, IP, device, tenant, authentication method and a **correlation ID** that ties the login, the token and the calls that follow. A common schema across IdP, applications and APIs is what makes correlation possible.",
          },
          {
            titulo: "4. Transport and SIEM",
            texto:
              "Ship events from the IdP, applications and infrastructure to a **SIEM** through a collector with buffering and retry. Monitor silence too: a source that stopped sending is an alert, not a quiet day.",
          },
          {
            titulo: "5. Integrity and retention",
            texto:
              "Write-once storage (append-only or WORM) or hash chaining, on a system that the administrators of the watched environments do not control. Tiered retention (hot for search, cold for safekeeping), with the period set by compliance and legal. For the general design of log management, see NIST SP 800-92.",
          },
          {
            titulo: "6. Privacy",
            texto:
              "Minimize: no passwords, tokens, MFA codes, secrets or sensitive personal data in the log; mask what you can, restrict who reads it and define purpose and retention according to the applicable data protection law.",
          },
          {
            titulo: "7. Alerts, dashboards and review",
            texto:
              "High-signal rules (privileged role granted, MFA removed, new consent or credential, impossible login) plus a behavior baseline. Every alert has an **owner, a severity and a response runbook**; when reviewing one, keep the evidence: raw event, correlation ID, user and device context, decision and justification. Useful dashboards: failures by type, MFA adoption, access approval time, dormant accounts.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Mandatory events",
        colunas: ["Category", "Examples", "Why record them"],
        linhas: [
          [
            "Authentication",
            "Login success and failure (with the reason), logout, account lockout, password reset",
            "Reveals credential stuffing, brute force and compromised accounts (see Q134)",
          ],
          [
            "MFA",
            "Factor enrollment and removal, challenge approved or denied, bursts of prompts",
            "Weakening MFA often prepares an attack; bursts of prompts point to fatigue (see Q90)",
          ],
          [
            "Tokens and sessions",
            "Issuance, refresh, revocation, validation failure (signature, `aud`, expiry)",
            "Shows token replay and abuse (see Q130)",
          ],
          [
            "Grants and consent",
            "OAuth consent, new application, secret or credential created",
            "The most common means of persistence (see Q131)",
          ],
          [
            "Permission changes",
            "Role or group changed, who approved, JIT elevation, use of an emergency account",
            "Evidence of privilege escalation and an approval trail for compliance",
          ],
          [
            "Directory and IdP administration",
            "Create or disable a user, change configuration, rotate a certificate or key",
            "Protects the integrity of identity itself",
          ],
          [
            "Denials and sensitive data access",
            "Authorization denied, read of critical data, export",
            "Points to attempted improper access and IDOR (see Q136)",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Terms that get confused",
        colunas: ["Concept", "What it is", "Question it answers", "What it proves (and does not)"],
        linhas: [
          [
            "Log",
            "Raw record of an event",
            "What happened here?",
            "That the event was recorded, not that the record is complete",
          ],
          [
            "Audit",
            "Intact, retained and reviewable trail of identity and access actions",
            "Who did what, and can we prove it?",
            "Accountability and compliance, if the trail is complete and tamper-proof",
          ],
          [
            "Monitoring",
            "Continuous observation of signals, with alerts",
            "Is something out of the ordinary happening now?",
            "That the control is being watched; silence does not prove there is no attack",
          ],
          [
            "Observability",
            "Logs, metrics and traces for investigating the unexpected",
            "Why is this happening?",
            "The ability to investigate, not that the cause was found",
          ],
          [
            "SIEM",
            "Gathers, normalizes, correlates and alerts on events from many sources",
            "Do these events together indicate an attack?",
            "Correlation, limited by source coverage",
          ],
          [
            "SOAR",
            "Automates response through runbooks (disable account, revoke session, open a ticket)",
            "How do we react without waiting for a person?",
            "Speed; badly calibrated automation blocks legitimate people",
          ],
          [
            "UEBA and machine learning",
            "Models that learn the baseline and flag deviations",
            "Is this unusual for this person or group?",
            "A statistical signal, not proof; needs human review",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "An audit event",
        legenda: "JSON",
        codigo: `{
  "timestamp": "2026-11-04T14:07:31.482Z",
  "event_type": "role.assigned",
  "outcome": "success",
  "actor": { "id": "usr_8f3a", "ip": "203.0.113.24", "device_id": "dev_41c9" },
  "target": { "type": "user", "id": "usr_1b72" },
  "details": {
    "role": "billing_admin",
    "approved_by": "usr_55de",
    "ticket": "CHG-1042",
    "expires_at": "2026-11-04T18:07:31Z"
  },
  "auth": { "method": "webauthn", "session_id": "sid_9c2e" },
  "tenant_id": "tnt_acme",
  "correlation_id": "req_7d41a0",
  "source": "idp-admin-api"
}`,
        nota: "Record the reason and the approval, never the secret: no password, token, MFA code or request body. The `correlation_id` ties this event to the request that caused it and to the session’s login.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Trade-offs and how to know it works",
        texto:
          "**No log, no evidence**: if a decision or change was not recorded, you cannot detect, investigate or prove compliance. Cut low-value volume (repeated reads, health checks), never decisions and changes. **Too many alerts, nobody reads them**: frequent false positives cause fatigue and lead people to ignore the real alert; calibrate with context, severity and a measured false-positive rate. To know whether log review worked, having looked is not enough: measure source coverage and time to detect and respond, simulate an attack (compromised account, escalation) and check whether the alert fires, who acts and how fast, and follow the findings that turned into policy changes. Monitoring proves that the control is being watched, not that the environment is safe.",
      },
    ],
    armadilhas: [
      "Logging passwords, tokens, MFA codes or request bodies “to debug”: the log becomes a second vault of credentials.",
      "Keeping the log only on the server it watches, where whoever administers it (or the attacker) can delete it.",
      "Recording only failures: a success after hundreds of failures, a role grant and an MFA change are what matter most.",
      "Creating alerts with no owner or runbook and not monitoring the pipeline itself: a source that stopped sending looks like a calm day.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a log, an audit trail and monitoring?",
        resposta:
          "A log is the raw record of an event; an audit trail is the intact, retained, reviewable record that enables accountability and proof of compliance; monitoring is the continuous observation that raises alerts so you can act fast. Each feeds the other.",
      },
      {
        pergunta: "What happens if audit logs are missing, and what happens if there are too many alerts?",
        resposta:
          "Without logs you cannot detect, investigate or prove anything; with too many alerts the team gets tired and ignores the real one. The balance is to always record decisions and changes and to calibrate rules with context and measured false positives.",
      },
    ],
  },
};
