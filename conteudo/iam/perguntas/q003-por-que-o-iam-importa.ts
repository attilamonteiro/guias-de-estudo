import type { Pergunta } from "../../tipos";

// Q03 · Por que o IAM importa
export const q003: Pergunta = {
  numero: 3,
  modulo: "fundamentos",
  metodo: "whys",
  pt: {
    titulo: "Por que o IAM importa",
    pergunta:
      "Por que o IAM é essencial para uma organização? Que riscos e custos aparecem quando a gestão de identidade e acesso é fraca ou fragmentada?",
    porqueEsteMetodo:
      "“Porque é segurança” não convence ninguém. Encadear os porquês, do fim do perímetro de rede até a trilha de auditoria, leva ao motivo de fundo e dá argumentos concretos para a entrevista.",
    resposta30s:
      "O IAM é essencial porque a **identidade virou o novo perímetro**: com nuvem, SaaS e trabalho remoto, quem decide o acesso é quem você prova ser, e as **credenciais** são um dos vetores de ataque mais comuns. Quando a gestão é fraca ou fragmentada, sobram **contas órfãs e privilégios acumulados** que ampliam o estrago, além de custo de suporte, onboarding lento e auditoria feita à mão. O IAM é a fonte única de quem é quem, de quem pode o quê e das **evidências**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que o IAM virou essencial para quase toda organização?",
            resposta:
              "Porque o perímetro de rede deixou de ser uma fronteira. Aplicações em nuvem e SaaS, trabalho remoto, dispositivos pessoais, APIs e parceiros acessam recursos de fora de qualquer rede “interna”. Sem um lado de dentro confiável, a pergunta que resta em cada acesso é **quem está pedindo e o que ele pode fazer**. A identidade virou o novo perímetro, e o IAM é o sistema que responde a essa pergunta.",
          },
          {
            pergunta: "Por que as credenciais viraram o alvo dos atacantes?",
            resposta:
              "Porque é o caminho mais barato: quem entra com uma credencial válida parece um usuário legítimo e atravessa firewalls sem alarme. Phishing, reaproveitamento de senhas vazadas (credential stuffing), roubo de tokens e de sessões, engenharia social sobre o suporte e fadiga de MFA miram a identidade, não uma falha de software. Sem MFA forte e sem detecção, uma senha roubada é uma porta aberta.",
          },
          {
            pergunta: "Por que um acesso roubado causa tanto estrago?",
            resposta:
              "Porque o estrago depende do que a conta pode fazer, e nas organizações os privilégios só crescem: quem muda de área mantém os acessos antigos, o projeto acaba e o acesso fica, administradores permanentes existem “por precaução”, contas de serviço têm senha eterna e poder demais. **Contas órfãs**, de quem já saiu, seguem ativas sem ninguém olhando. O atacante herda tudo isso.",
          },
          {
            pergunta: "Por que esses acessos se acumulam sem ninguém perceber?",
            resposta:
              "Porque a identidade está **fragmentada**: cada aplicação tem o próprio cadastro, a própria senha e a própria regra de MFA; conceder acesso é manual e feito por muita gente; retirar acesso depende de alguém lembrar de cada sistema. Sem uma fonte única de quem é quem e de quem tem o quê, ninguém enxerga o conjunto. O custo aparece no dia a dia: redefinições de senha no suporte, onboarding lento, pessoas paradas esperando acesso.",
          },
          {
            pergunta: "Por que auditoria e conformidade dependem disso?",
            resposta:
              "Porque auditores e reguladores querem **evidência**: quem teve acesso a quê, quem aprovou, quando foi revisado, quando foi removido. Normas e leis de segurança e de proteção de dados (como a ISO/IEC 27001 e a LGPD) costumam exigir controle de acesso e a capacidade de demonstrá-lo. Com identidade fragmentada, montar essa trilha é um trabalho manual, caro e incompleto, e um incidente é investigado às cegas.",
          },
        ],
        causaRaiz:
          "O acesso é concedido por muita gente, em muitos sistemas, em momentos diferentes, e quase nunca é retirado. Sem um lugar central que saiba **quem é quem e o que cada um pode**, o risco cresce em silêncio. O IAM é esse lugar: uma fonte de verdade para identidades, acessos e evidências.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que uma boa gestão de identidade entrega",
        texto:
          "**Segurança:** MFA e passkeys, privilégio mínimo e desativação imediata reduzem a chance e o impacto de um acesso roubado. **Produtividade:** o SSO elimina senhas repetidas e acelera onboarding e mudanças de função. **Auditoria e conformidade:** uma trilha única mostra quem acessou o quê e quem aprovou. **Custo:** menos chamados de senha, menos acessos esquecidos e menos tempo montando evidência.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Um cenário típico (ilustrativo, não é um caso real)",
        texto:
          "Uma pessoa de TI muda de área e mantém o acesso de administrador a um sistema de produção, porque ninguém revisa. Meses depois, a senha corporativa dela, reaproveitada em outro site que vazou, é testada por um atacante. Sem MFA no sistema, ele entra, exporta dados de clientes e a equipe só descobre ao ver o vazamento. Cada elo é um item de IAM: senha reaproveitada, falta de MFA, privilégio acumulado, ausência de revisão de acessos e de alerta.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Como responder quando a pergunta pede a sua opinião",
        texto:
          "Estruture em três passos: a **tese** (a identidade virou o perímetro), **duas evidências** (credenciais como vetor de ataque; privilégio acumulado e contas órfãs) e a **consequência para o negócio** (risco, custo de suporte, conformidade). Feche dizendo como você mediria: percentual de contas com MFA, tempo para desativar quem sai, quantidade de contas órfãs, acessos revisados no prazo. Não invente casos pessoais; use exemplos genéricos ou públicos.",
      },
    ],
    armadilhas: [
      "Reduzir o IAM a “login e senha”: o ciclo de vida (entrada, mudança, saída), a revisão de acessos e a auditoria entregam metade do valor.",
      "Achar que o MFA resolve tudo: ele protege o login, mas não corrige privilégio excessivo nem conta órfã.",
      "Dizer que o firewall “não importa mais”: a rede continua sendo uma camada; o ponto é que deixou de bastar sozinha (veja Q05).",
      "Responder só com medo de “hackers”, sem ligar a custo e a negócio: a entrevista espera risco, custo e conformidade.",
    ],
    autoteste: [
      {
        pergunta: "Por que se diz que a identidade é o novo perímetro?",
        resposta:
          "Porque os recursos estão em nuvem e SaaS e as pessoas acessam de qualquer rede e dispositivo, então a rede interna deixou de ser uma fronteira confiável. A decisão de acesso passa a depender de quem pede, de qual dispositivo e em que contexto, ou seja, de identidade.",
      },
      {
        pergunta: "Dê dois custos de uma gestão de acesso fragmentada.",
        resposta:
          "Risco: contas órfãs e privilégios acumulados ampliam o estrago de uma credencial roubada. Custo: o suporte lida com redefinições de senha, onboarding e offboarding são manuais e a auditoria é montada à mão por falta de uma trilha única.",
      },
    ],
  },
  en: {
    titulo: "Why IAM matters",
    pergunta:
      "Why is IAM essential for an organization? What risks and costs appear when identity and access management is weak or fragmented?",
    porqueEsteMetodo:
      "“Because it is security” convinces nobody. Chaining the whys, from the end of the network perimeter to the audit trail, leads to the underlying reason and gives you concrete arguments for the interview.",
    resposta30s:
      "IAM is essential because **identity became the new perimeter**: with cloud, SaaS and remote work, what decides access is who you can prove you are, and **credentials** are one of the most common attack vectors. When management is weak or fragmented you are left with **orphaned accounts and accumulated privileges** that enlarge the damage, plus support costs, slow onboarding and hand-built audits. IAM is the single source of who is who, who can do what and the **evidence**.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why did IAM become essential for almost every organization?",
            resposta:
              "Because the network perimeter stopped being a boundary. Cloud and SaaS applications, remote work, personal devices, APIs and partners reach resources from outside any “internal” network. With no trustworthy inside, the question left at every access is **who is asking and what may they do**. Identity became the new perimeter, and IAM is the system that answers that question.",
          },
          {
            pergunta: "Why did credentials become the attackers’ target?",
            resposta:
              "Because it is the cheapest path: whoever gets in with a valid credential looks like a legitimate user and crosses firewalls without an alarm. Phishing, reuse of leaked passwords (credential stuffing), theft of tokens and sessions, social engineering of the help desk and MFA fatigue all target identity, not a software flaw. Without strong MFA and detection, a stolen password is an open door.",
          },
          {
            pergunta: "Why does a stolen access cause so much damage?",
            resposta:
              "Because the damage depends on what the account can do, and in organizations privileges only grow: someone who changes teams keeps the old access, the project ends and the access stays, permanent administrators exist “just in case”, service accounts have eternal passwords and too much power. **Orphaned accounts**, from people who have left, stay active with nobody watching. The attacker inherits all of it.",
          },
          {
            pergunta: "Why do these accesses pile up unnoticed?",
            resposta:
              "Because identity is **fragmented**: each application has its own directory, its own password and its own MFA rule; granting access is manual and done by many people; removing access depends on someone remembering every system. With no single source of who is who and who has what, nobody sees the whole. The cost shows up daily: password resets at the help desk, slow onboarding, people idle waiting for access.",
          },
          {
            pergunta: "Why do audit and compliance depend on this?",
            resposta:
              "Because auditors and regulators want **evidence**: who had access to what, who approved it, when it was reviewed, when it was removed. Security and data-protection standards and laws (such as ISO/IEC 27001 and the GDPR or Brazil’s LGPD) usually require access control and the ability to demonstrate it. With fragmented identity, building that trail is manual, expensive and incomplete, and an incident is investigated blind.",
          },
        ],
        causaRaiz:
          "Access is granted by many people, in many systems, at different times, and almost never taken back. Without a central place that knows **who is who and what each one can do**, risk grows in silence. IAM is that place: a source of truth for identities, access and evidence.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What good identity management delivers",
        texto:
          "**Security:** MFA and passkeys, least privilege and immediate deactivation reduce the chance and the impact of a stolen access. **Productivity:** SSO removes repeated passwords and speeds up onboarding and role changes. **Audit and compliance:** a single trail shows who accessed what and who approved it. **Cost:** fewer password tickets, fewer forgotten accesses and less time assembling evidence.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "A typical scenario (illustrative, not a real case)",
        texto:
          "An IT person changes teams and keeps administrator access to a production system, because nobody reviews it. Months later, their corporate password, reused on another site that leaked, is tried by an attacker. With no MFA on the system, the attacker gets in, exports customer data and the team only learns of it when the leak surfaces. Every link is an IAM item: reused password, missing MFA, accumulated privilege, no access review and no alert.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "How to answer when the question asks for your opinion",
        texto:
          "Structure it in three steps: the **thesis** (identity became the perimeter), **two pieces of evidence** (credentials as an attack vector; accumulated privilege and orphaned accounts) and the **business consequence** (risk, support cost, compliance). Close by saying how you would measure it: percentage of accounts with MFA, time to deactivate leavers, number of orphaned accounts, access reviews completed on time. Do not invent personal stories; use generic or public examples.",
      },
    ],
    armadilhas: [
      "Reducing IAM to “login and password”: the lifecycle (joiner, mover, leaver), access reviews and audit deliver half the value.",
      "Believing MFA solves everything: it protects the login, but does not fix excessive privilege or orphaned accounts.",
      "Saying the firewall “no longer matters”: the network is still a layer; the point is that it stopped being enough on its own (see Q05).",
      "Answering only with fear of “hackers”, without tying it to cost and business: the interview expects risk, cost and compliance.",
    ],
    autoteste: [
      {
        pergunta: "Why do people say identity is the new perimeter?",
        resposta:
          "Because resources live in the cloud and SaaS and people connect from any network and device, so the internal network stopped being a trustworthy boundary. The access decision now depends on who is asking, from which device and in what context, which is to say, on identity.",
      },
      {
        pergunta: "Give two costs of fragmented access management.",
        resposta:
          "Risk: orphaned accounts and accumulated privileges enlarge the damage of a stolen credential. Cost: support handles password resets, onboarding and offboarding are manual, and audits are assembled by hand for lack of a single trail.",
      },
    ],
  },
};
