import type { Pergunta } from "../../tipos";

// Q100 · Recuperação de conta
export const q100: Pergunta = {
  numero: 100,
  modulo: "mfa-e-passkeys",
  metodo: "design",
  pt: {
    titulo: "Recuperação de conta",
    pergunta:
      "Como você projetaria a recuperação de conta sem enfraquecer o MFA? Considere perda do dispositivo, códigos de backup, suporte e engenharia social.",
    porqueEsteMetodo:
      "Recuperação de conta é um problema de projeto com forças em conflito (disponibilidade contra segurança). Um roteiro fixo evita esquecer a engenharia social e o suporte, que é onde ela costuma falhar: requisitos, princípio, prevenção, métodos, atraso e aprovação humana, e auditoria.",
    resposta30s:
      "Projete a recuperação como o **caminho mais fraco que um atacante vai escolher**: ela precisa ter garantia equivalente à do login que substitui. Primeiro **previna** (dois métodos cadastrados e **códigos de backup**); depois ofereça métodos em ordem de força, com **atraso e notificação** em contas de valor alto, **aprovação humana com roteiro rígido** no suporte e **auditoria** completa, revogando sessões e tokens ao concluir. Os gargalos são o recuperador mais fraco (e-mail ou SMS) e o suporte enganado por engenharia social.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos e ameaças",
            texto:
              "Disponibilidade: quem perdeu o dispositivo precisa voltar sem esperar semanas. Segurança: o atacante também diz que “perdeu o dispositivo”. Ameaças a considerar: troca de chip (SIM swap), e-mail comprometido, engenharia social do suporte, documentos falsos e deepfakes. Defina o rigor por tipo de conta (consumidor, funcionário, administrador).",
          },
          {
            titulo: "2. Princípio: o recuperador mais fraco manda",
            texto:
              "Decida o nível mínimo da recuperação em função do que ela protege, e não do que é cômodo (veja a regra abaixo e Q102). Cada caminho de recuperação é um segundo login.",
          },
          {
            titulo: "3. Prevenir antes de recuperar",
            texto:
              "A melhor recuperação é não precisar dela: exigir ao menos dois métodos cadastrados (duas passkeys, ou passkey e chave de hardware), gerar **códigos de backup** no cadastro e lembrar o usuário de guardá-los em local seguro.",
          },
          {
            titulo: "4. Métodos, do mais forte ao mais fraco",
            texto:
              "Outro método já cadastrado, depois código de backup, depois verificação de identidade ou aprovação delegada, depois e-mail com atraso e, só em contas de baixo risco, SMS (veja a tabela).",
          },
          {
            titulo: "5. Atraso e notificação",
            texto:
              "Em contas de valor alto, a recuperação não é instantânea: há uma espera (de horas a dias, conforme o risco) e avisos a todos os canais conhecidos, com um link “não fui eu” que cancela o pedido. Durante a janela inicial, ações sensíveis (mudar o e-mail, sacar) ficam limitadas.",
          },
          {
            titulo: "6. Suporte e auditoria",
            texto:
              "Aprovação humana com roteiro rígido (veja o aviso abaixo). Ao concluir: revogar todas as sessões e tokens, exigir novo cadastro de MFA, invalidar os códigos de backup antigos, registrar tudo (quem pediu, quem aprovou, que prova foi usada) e acompanhar sinais de abuso, como muitos pedidos para a mesma conta.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Métodos de recuperação e de backup",
        colunas: ["Método", "Força", "Quando usar", "Cuidados"],
        linhas: [
          [
            "Outro autenticador ou outra passkey já cadastrada",
            "Alta",
            "Primeira opção; evita qualquer processo de recuperação",
            "Exigir o cadastro de pelo menos dois métodos e lembrar o usuário de mantê-los atualizados",
          ],
          [
            "Códigos de backup de uso único",
            "Alta, se bem guardados",
            "Perda do dispositivo, quando o usuário os guardou",
            "Mostrar uma vez, guardar só o hash, invalidar os antigos ao gerar novos e avisar quando um for usado",
          ],
          [
            "Verificação de identidade (documento e prova de vida)",
            "Média: depende da qualidade e pode sofrer fraude e deepfakes",
            "Contas de consumo de alto valor, como complemento",
            "Custo e privacidade (dado sensível; veja a LGPD); nunca como prova única; combinar com atraso e notificação",
          ],
          [
            "Aprovação delegada (gestor ou administrador do tenant)",
            "Alta, se o aprovador for verificado",
            "Funcionários e contas corporativas",
            "Credencial temporária de uso único e curta; ticket auditado; o aprovador não pode ser o próprio solicitante",
          ],
          [
            "E-mail de recuperação",
            "Baixa a média: vale o que vale a segurança da caixa",
            "Contas de baixo risco, sempre com atraso e notificação",
            "Nunca como caminho único para administradores; conferir se a caixa tem MFA",
          ],
          [
            "SMS ou voz",
            "Baixa: troca de chip e interceptação",
            "Contas de baixo risco ou como transição",
            "O NIST SP 800-63B trata a rede telefônica como autenticador restrito; checar sinais de troca de chip e limitar tentativas",
          ],
          [
            "Perguntas secretas",
            "Muito baixa: respostas públicas ou adivinháveis",
            "Não use",
            "Remover de fluxos existentes",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Recuperação de uma conta de alto valor",
        etapas: [
          "A pessoa diz que perdeu o acesso. A resposta é a mesma para conta existente e inexistente, para não revelar quem tem cadastro",
          "O sistema oferece primeiro o caminho mais seguro e mais simples: outra passkey ou outro autenticador já cadastrado e, depois, um código de backup",
          "Sem isso, abre um pedido de recuperação com verificação de identidade proporcional ao risco (documento e prova de vida, ou aprovação do gestor ou do administrador com ticket)",
          "Todos os canais conhecidos recebem o aviso, com o link “não fui eu” e o prazo de espera. Se alguém cancelar, o pedido é encerrado e a conta fica bloqueada para revisão manual",
          "Passado o prazo sem contestação, a pessoa prova o controle de um canal novo e cadastra um novo método de MFA (de preferência uma passkey)",
          "O sistema revoga sessões, tokens e códigos de backup antigos, limita as ações sensíveis por um período e registra o evento para auditoria",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O recuperador mais fraco define a segurança",
        texto:
          "Uma conta vale o que vale o caminho mais fácil para entrar nela. Se o login exige passkey, mas “esqueci o acesso” aceita um código por SMS ou e-mail, o seu login real é o SMS ou o e-mail, e a segurança do MFA vira teatro. A recuperação tem de ter garantia equivalente à do que substitui, ou compensar a diferença com atraso, notificação e aprovação humana. E o melhor desenho é o que reduz o uso da recuperação: dois métodos cadastrados e códigos de backup desde o primeiro dia.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O suporte é a porta dos fundos",
        texto:
          "O atacante liga, diz ser o titular, cria urgência e pede para “desligar o MFA”. Defenda com roteiro rígido e sem exceções por pressão, cargo ou “cliente importante”; nada de verificar por perguntas cujas respostas são públicas ou aparecem em vazamentos; retorno da ligação para o contato **já cadastrado**; uma ferramenta que deixe o atendente **iniciar** a recuperação, mas não concluí-la; dupla aprovação para contas privilegiadas; auditoria de cada caso e treinamento contra engenharia social.",
      },
    ],
    armadilhas: [
      "Permitir recuperação por e-mail ou SMS numa conta protegida por passkey: o caminho fraco vira o login real.",
      "Responder de forma diferente para conta existente e inexistente na tela de recuperação: isso revela quem tem cadastro e ajuda o atacante.",
      "Recuperar sem revogar as sessões e os tokens antigos: se o invasor já estava dentro, continua dentro.",
      "Dar ao suporte o poder de “desligar o MFA” a pedido, sem atraso, sem notificação e sem segundo aprovador.",
    ],
    autoteste: [
      {
        pergunta: "Por que perguntas secretas e SMS enfraquecem o MFA?",
        resposta:
          "Porque viram um caminho alternativo mais fácil que o próprio login: as respostas são públicas ou adivinháveis, e o SMS sofre troca de chip e interceptação. O atacante escolhe o recuperador mais fraco.",
      },
      {
        pergunta: "O que mais reduz a necessidade de recuperação com ajuda do suporte?",
        resposta:
          "A prevenção: exigir ao menos dois métodos cadastrados (duas passkeys, ou passkey e chave de hardware), gerar códigos de backup no cadastro e lembrar o usuário de guardá-los. Assim, a perda do dispositivo vira uma troca de método e não um incidente.",
      },
    ],
  },
  en: {
    titulo: "Account recovery",
    pergunta:
      "How would you design account recovery without weakening MFA? Consider lost devices, backup codes, support and social engineering.",
    porqueEsteMetodo:
      "Account recovery is a design problem with forces in conflict (availability against security). A fixed script avoids forgetting social engineering and support, which is where it tends to fail: requirements, principle, prevention, methods, delay and human approval, and audit.",
    resposta30s:
      "Design recovery as **the weakest path an attacker will pick**: it must carry assurance equivalent to the login it replaces. First **prevent** (two enrolled methods and **backup codes**); then offer methods in order of strength, with **delay and notification** on high-value accounts, **human approval with a rigid script** in support, and full **audit**, revoking sessions and tokens when it finishes. The bottlenecks are the weakest recoverer (email or SMS) and a support desk fooled by social engineering.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements and threats",
            texto:
              "Availability: someone who lost a device must get back in without waiting weeks. Security: the attacker also says they “lost the device”. Threats to consider: SIM swap, a compromised mailbox, social engineering of support, forged documents and deepfakes. Set the rigor by account type (consumer, employee, administrator).",
          },
          {
            titulo: "2. Principle: the weakest recoverer rules",
            texto:
              "Set the minimum level of recovery by what it protects, not by what is convenient (see the rule below and Q102). Every recovery path is a second login.",
          },
          {
            titulo: "3. Prevent before recovering",
            texto:
              "The best recovery is not needing it: require at least two enrolled methods (two passkeys, or a passkey and a hardware key), generate **backup codes** at enrollment and remind the user to keep them somewhere safe.",
          },
          {
            titulo: "4. Methods, strongest to weakest",
            texto:
              "Another enrolled method, then a backup code, then identity verification or delegated approval, then email with a delay and, only for low-risk accounts, SMS (see the table).",
          },
          {
            titulo: "5. Delay and notification",
            texto:
              "On high-value accounts, recovery is not instant: there is a waiting period (hours to days, depending on risk) and notices to every known channel, with a “this wasn’t me” link that cancels the request. During the initial window, sensitive actions (changing the email, withdrawing) are limited.",
          },
          {
            titulo: "6. Support and audit",
            texto:
              "Human approval with a rigid script (see the warning below). When it finishes: revoke all sessions and tokens, require new MFA enrollment, invalidate the old backup codes, log everything (who asked, who approved, which proof was used) and watch for abuse signals, such as many requests for the same account.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Recovery and backup methods",
        colunas: ["Method", "Strength", "When to use", "Cautions"],
        linhas: [
          [
            "Another enrolled authenticator or passkey",
            "High",
            "First choice; avoids any recovery process",
            "Require at least two enrolled methods and remind the user to keep them up to date",
          ],
          [
            "Single-use backup codes",
            "High, if stored well",
            "Device loss, when the user kept them",
            "Show once, store only the hash, invalidate the old ones when new ones are generated and notify when one is used",
          ],
          [
            "Identity verification (document and liveness check)",
            "Medium: depends on quality and can suffer fraud and deepfakes",
            "High-value consumer accounts, as a complement",
            "Cost and privacy (sensitive data; consider data-protection law); never as the only proof; combine with delay and notification",
          ],
          [
            "Delegated approval (manager or tenant administrator)",
            "High, if the approver is verified",
            "Employees and corporate accounts",
            "A short, single-use temporary credential; an audited ticket; the approver cannot be the requester",
          ],
          [
            "Recovery email",
            "Low to medium: worth only as much as the mailbox’s security",
            "Low-risk accounts, always with delay and notification",
            "Never the only path for administrators; check that the mailbox has MFA",
          ],
          [
            "SMS or voice",
            "Low: SIM swap and interception",
            "Low-risk accounts or as a transition",
            "NIST SP 800-63B treats the telephone network as a restricted authenticator; check for SIM-swap signals and limit attempts",
          ],
          [
            "Security questions",
            "Very low: answers are public or guessable",
            "Do not use",
            "Remove from existing flows",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Recovering a high-value account",
        etapas: [
          "The person says they lost access. The response is the same for an existing and a nonexistent account, so it does not reveal who has one",
          "The system first offers the safest and simplest path: another enrolled passkey or authenticator and, after that, a backup code",
          "Without those, it opens a recovery request with identity verification proportional to risk (document and liveness check, or approval by the manager or administrator with a ticket)",
          "Every known channel receives the notice, with the “this wasn’t me” link and the waiting period. If anyone cancels, the request is closed and the account is locked for manual review",
          "When the period passes without objection, the person proves control of a new channel and enrolls a new MFA method (preferably a passkey)",
          "The system revokes old sessions, tokens and backup codes, limits sensitive actions for a period and logs the event for audit",
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The weakest recoverer sets the security",
        texto:
          "An account is worth as much as the easiest way into it. If login requires a passkey but “I forgot my access” accepts a code by SMS or email, your real login is the SMS or the email, and the MFA security becomes theater. Recovery must carry assurance equivalent to what it replaces, or make up the difference with delay, notification and human approval. And the best design is the one that reduces the use of recovery: two enrolled methods and backup codes from day one.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Support is the back door",
        texto:
          "The attacker calls, claims to be the owner, creates urgency and asks to “turn off MFA”. Defend with a rigid script and no exceptions for pressure, rank or an “important customer”; no verification by questions whose answers are public or show up in leaks; call back on the contact **already on file**; a tool that lets the agent **start** recovery but not finish it; dual approval for privileged accounts; an audit of every case and training against social engineering.",
      },
    ],
    armadilhas: [
      "Allowing recovery by email or SMS on an account protected by a passkey: the weak path becomes the real login.",
      "Answering differently for an existing and a nonexistent account on the recovery screen: it reveals who has an account and helps the attacker.",
      "Recovering without revoking old sessions and tokens: if the intruder was already inside, they stay inside.",
      "Giving support the power to “turn off MFA” on request, with no delay, no notification and no second approver.",
    ],
    autoteste: [
      {
        pergunta: "Why do security questions and SMS weaken MFA?",
        resposta:
          "Because they become an alternative path that is easier than the login itself: the answers are public or guessable, and SMS suffers SIM swap and interception. The attacker picks the weakest recoverer.",
      },
      {
        pergunta: "What most reduces the need for recovery through support?",
        resposta:
          "Prevention: require at least two enrolled methods (two passkeys, or a passkey and a hardware key), generate backup codes at enrollment and remind the user to keep them. That way, losing a device becomes a method swap and not an incident.",
      },
    ],
  },
};
