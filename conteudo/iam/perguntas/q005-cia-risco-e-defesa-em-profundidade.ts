import type { Pergunta } from "../../tipos";

// Q05 · CIA, risco e defesa em profundidade
export const q005: Pergunta = {
  numero: 5,
  modulo: "fundamentos",
  metodo: "feynman",
  pt: {
    titulo: "CIA, risco e defesa em profundidade",
    pergunta:
      "Explique a tríade CIA e a relação entre ativo, ameaça, vulnerabilidade, risco e controle. Onde a defesa em profundidade e o IAM se encaixam nesse vocabulário?",
    porqueEsteMetodo:
      "São termos de glossário que se confundem facilmente. A imagem do cofre de um banco dá a cada um um papel físico, e depois cada termo ganha um exemplo de IAM, que é o que a entrevista pede.",
    resposta30s:
      "A **tríade CIA** diz o que se protege: **confidencialidade**, **integridade** e **disponibilidade** de um **ativo**. Uma **ameaça** explora uma **vulnerabilidade** e gera **risco** (probabilidade × impacto), que se reduz com **controles** preventivos, detectivos e corretivos. A **defesa em profundidade** empilha camadas independentes para que a falha de uma não derrube tudo, e o **IAM** é uma família desses controles: quem entra, o que pode fazer e o que ficou registrado.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no cofre de um banco. O **ativo** é o que está dentro (dinheiro, dados). A **ameaça** é o ladrão, ou qualquer evento que possa causar dano (um funcionário descontente, um incêndio). A **vulnerabilidade** é a fraqueza da porta: uma fechadura velha, uma chave esquecida. O **risco** é a chance de o ladrão chegar ao cofre por essa fechadura, multiplicada pelo tamanho do prejuízo. O **controle** é o que reduz o risco: tranca nova, alarme, câmera, seguro, plano de resposta. E a **defesa em profundidade** é não depender de uma única porta: muro, portaria, porta do cofre, alarme e guarda, cada camada capaz de segurar o ladrão se a anterior falhar.",
        tecnico:
          "Em segurança da informação, **ativo** é tudo o que tem valor (dados, sistemas, contas, segredos); **ameaça** é a causa potencial de um incidente (um atacante, um erro, uma falha); **vulnerabilidade** é uma fraqueza que a ameaça pode explorar (senha fraca, falta de MFA, permissão excessiva); **risco** é a combinação da probabilidade de a ameaça explorar a vulnerabilidade com o impacto sobre o ativo; **controle** é a medida que reduz a probabilidade ou o impacto. A **tríade CIA** diz o que se protege: **confidencialidade** (só quem deve vê), **integridade** (ninguém altera sem autorização e sem ser notado) e **disponibilidade** (quem deve acessar consegue, quando precisa).",
        limite:
          "Risco como probabilidade × impacto parece exato, mas as entradas são estimativas: use a conta para comparar e priorizar, não como número oficial. E o cofre sugere um único bem a proteger; em IAM os ativos são muitos (contas, tokens, segredos, chaves de assinatura) e o atacante só precisa de um deles.",
      },
      {
        tipo: "tabela",
        titulo: "Cada termo, com um exemplo de IAM",
        colunas: ["Termo", "Em uma frase", "Exemplo de IAM"],
        linhas: [
          [
            "Ativo",
            "Algo que tem valor e precisa de proteção. O inventário de ativos é a lista do que você precisa proteger",
            "Contas (inclusive de serviço), tokens, chaves de assinatura, segredos, o diretório",
          ],
          [
            "Ameaça",
            "Causa potencial de dano: é o “quem” ou o “o quê”, não a fraqueza",
            "Atacante com credenciais vazadas, administrador que erra, IdP fora do ar",
          ],
          [
            "Vulnerabilidade",
            "Fraqueza que uma ameaça pode explorar",
            "Conta sem MFA, permissão excessiva, `redirect_uri` frouxo, conta órfã",
          ],
          [
            "Risco",
            "Probabilidade de a ameaça explorar a vulnerabilidade × impacto no ativo",
            "Administrador sem MFA exposto a phishing: provável e de impacto alto",
          ],
          [
            "Controle",
            "Medida que reduz probabilidade ou impacto: preventivo, detectivo ou corretivo",
            "Preventivo: MFA e privilégio mínimo. Detectivo: alerta de login anômalo e revisão de acessos. Corretivo: revogar tokens e redefinir credenciais",
          ],
          [
            "Confidencialidade",
            "Só quem está autorizado vê o dado",
            "Autorização por recurso, escopos mínimos, criptografia",
          ],
          [
            "Integridade",
            "Ninguém altera sem autorização ou sem ser detectado",
            "Tokens e assertions assinados, trilha de auditoria, aprovação de mudanças",
          ],
          [
            "Disponibilidade",
            "Quem pode acessar consegue, quando precisa",
            "IdP redundante, contas de emergência (break glass), limite de tentativas que não tranca usuários legítimos",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Defesa em profundidade num login de administrador",
        etapas: [
          "Prevenir: MFA resistente a phishing (passkey) no login",
          "Prevenir: acesso condicional, só de dispositivo gerenciado e de locais esperados",
          "Limitar o estrago: privilégio mínimo e elevação temporária (just-in-time), em vez de administrador permanente",
          "Detectar: log de cada login e de cada ação, com alerta para horário, local ou comportamento fora do padrão",
          "Corrigir: poder revogar sessões e tokens, desativar a conta e redefinir credenciais depressa",
          "Conter: segmentação, para que mesmo uma conta comprometida alcance só parte dos sistemas",
        ],
        nota: "Cada camada assume que a anterior pode falhar e não depende do mesmo ponto único de falha. Se todas dependessem, por exemplo, do mesmo token, seriam uma camada só com aparência de seis.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Onde o IAM e o Zero Trust se encaixam",
        texto:
          "O IAM é uma **família de controles** deste vocabulário. Autenticação forte, privilégio mínimo e revisão de acessos protegem sobretudo a **confidencialidade** e a **integridade** e reduzem tanto a probabilidade (MFA) quanto o impacto (privilégio mínimo) do risco. Ele também toca a **disponibilidade**, nos dois sentidos: um IdP fora do ar ou uma política mal escrita deixa todos de fora. O **Zero Trust** (veja NIST SP 800-207) leva a defesa em profundidade para a identidade: “nunca confie, sempre verifique”, assuma que a rede já foi invadida, avalie cada requisição por identidade, dispositivo e contexto e conceda o mínimo. As camadas típicas são identidade, dispositivo, rede, aplicação e dados, com visibilidade sobre todas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Os erros mais comuns",
        texto:
          "**Ameaça, vulnerabilidade e risco** não são sinônimos: ameaça é quem ou o que pode causar dano, vulnerabilidade é a fraqueza, e o risco só existe quando as duas se encontram num ativo de valor. Dizer que “o phishing é a vulnerabilidade” mistura os termos. **Controle não é prova:** ele só comprova algo com evidência de que funciona (relatório de MFA habilitado, teste de revogação, registro de revisão). **Defesa em profundidade** não é empilhar o mesmo controle nem usar camadas como desculpa para manter uma vulnerabilidade conhecida.",
      },
    ],
    armadilhas: [
      "Usar ameaça, vulnerabilidade e risco como sinônimos: o phishing é a ameaça, a conta sem MFA é a vulnerabilidade, e o risco é a combinação das duas com o impacto.",
      "Confiar em um único controle (só MFA, só firewall): quando ele falha ou é contornado, não sobra nada.",
      "Declarar um controle “implementado” sem evidência de que funciona e cobre todas as contas, inclusive as de serviço.",
      "Esquecer a disponibilidade: um controle de acesso tão rígido ou tão frágil que derruba o login de todos também é um incidente.",
    ],
    autoteste: [
      {
        pergunta: "Como se calcula o risco e como o IAM o reduz?",
        resposta:
          "Risco é a probabilidade de uma ameaça explorar uma vulnerabilidade multiplicada pelo impacto no ativo. O IAM reduz a probabilidade (MFA, bloqueio de credenciais vazadas) e o impacto (privilégio mínimo, desativação no desligamento, revisão de acessos).",
      },
      {
        pergunta: "Por que um inventário de ativos importa no IAM?",
        resposta:
          "Porque não se protege o que não se conhece. Sem listar contas (inclusive de serviço), aplicativos, segredos e chaves, ficam contas órfãs e acessos sem dono fora do MFA, das revisões e dos logs.",
      },
    ],
  },
  en: {
    titulo: "CIA, risk and defense in depth",
    pergunta:
      "Explain the CIA triad and the relationship between asset, threat, vulnerability, risk and control. Where do defense in depth and IAM fit in this vocabulary?",
    porqueEsteMetodo:
      "These are glossary terms that are easy to mix up. The picture of a bank vault gives each one a physical role, and then each term gets an IAM example, which is what the interview asks for.",
    resposta30s:
      "The **CIA triad** says what is being protected: the **confidentiality**, **integrity** and **availability** of an **asset**. A **threat** exploits a **vulnerability** and creates **risk** (likelihood × impact), which is reduced by preventive, detective and corrective **controls**. **Defense in depth** stacks independent layers so that one failing does not bring everything down, and **IAM** is a family of those controls: who gets in, what they can do and what was recorded.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of a bank vault. The **asset** is what is inside (money, data). The **threat** is the thief, or any event that can cause harm (a disgruntled employee, a fire). The **vulnerability** is the weakness of the door: an old lock, a forgotten key. The **risk** is the chance of the thief reaching the vault through that lock, multiplied by the size of the loss. The **control** is what lowers the risk: a new lock, an alarm, a camera, insurance, a response plan. And **defense in depth** is not depending on a single door: wall, front desk, vault door, alarm and guard, each layer able to hold the thief if the previous one fails.",
        tecnico:
          "In information security, an **asset** is anything of value (data, systems, accounts, secrets); a **threat** is the potential cause of an incident (an attacker, a mistake, a failure); a **vulnerability** is a weakness a threat can exploit (a weak password, missing MFA, excessive permission); **risk** combines the likelihood of the threat exploiting the vulnerability with the impact on the asset; a **control** is a measure that lowers the likelihood or the impact. The **CIA triad** says what is protected: **confidentiality** (only those who should, see it), **integrity** (no one changes it without authorization and without being noticed) and **availability** (whoever should have access gets it when needed).",
        limite:
          "Risk as likelihood × impact looks exact, but the inputs are estimates: use the calculation to compare and prioritize, not as an official number. And the vault suggests a single asset to protect; in IAM there are many (accounts, tokens, secrets, signing keys) and the attacker only needs one of them.",
      },
      {
        tipo: "tabela",
        titulo: "Each term, with an IAM example",
        colunas: ["Term", "In one sentence", "IAM example"],
        linhas: [
          [
            "Asset",
            "Something of value that needs protection. The asset inventory is the list of what you must protect",
            "Accounts (including service accounts), tokens, signing keys, secrets, the directory",
          ],
          [
            "Threat",
            "A potential cause of harm: the “who” or the “what”, not the weakness",
            "An attacker with leaked credentials, an administrator who makes a mistake, the IdP going down",
          ],
          [
            "Vulnerability",
            "A weakness a threat can exploit",
            "An account without MFA, excessive permission, a loose `redirect_uri`, an orphaned account",
          ],
          [
            "Risk",
            "Likelihood of the threat exploiting the vulnerability × impact on the asset",
            "An administrator without MFA exposed to phishing: likely and high impact",
          ],
          [
            "Control",
            "A measure that lowers likelihood or impact: preventive, detective or corrective",
            "Preventive: MFA and least privilege. Detective: anomalous-login alert and access review. Corrective: revoke tokens and reset credentials",
          ],
          [
            "Confidentiality",
            "Only authorized people see the data",
            "Per-resource authorization, minimal scopes, encryption",
          ],
          [
            "Integrity",
            "No one changes it without authorization or without being detected",
            "Signed tokens and assertions, audit trail, change approvals",
          ],
          [
            "Availability",
            "Whoever may access it can, when needed",
            "A redundant IdP, emergency (break-glass) accounts, attempt limits that do not lock out legitimate users",
          ],
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Defense in depth on an administrator login",
        etapas: [
          "Prevent: phishing-resistant MFA (a passkey) at login",
          "Prevent: conditional access, only from managed devices and expected locations",
          "Limit the damage: least privilege and temporary elevation (just-in-time) instead of a permanent administrator",
          "Detect: a log of every login and every action, with an alert for unusual time, place or behavior",
          "Correct: the ability to revoke sessions and tokens, disable the account and reset credentials quickly",
          "Contain: segmentation, so that even a compromised account reaches only part of the systems",
        ],
        nota: "Each layer assumes the previous one may fail and does not depend on the same single point of failure. If all of them depended on, say, the same token, they would be one layer that looks like six.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Where IAM and Zero Trust fit",
        texto:
          "IAM is a **family of controls** in this vocabulary. Strong authentication, least privilege and access review mainly protect **confidentiality** and **integrity**, and lower both the likelihood (MFA) and the impact (least privilege) of risk. It also touches **availability**, in both directions: an IdP that is down or a badly written policy locks everyone out. **Zero Trust** (see NIST SP 800-207) takes defense in depth to identity: “never trust, always verify”, assume the network is already breached, evaluate each request by identity, device and context, and grant the minimum. The typical layers are identity, device, network, application and data, with visibility across all of them.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The most common mistakes",
        texto:
          "**Threat, vulnerability and risk** are not synonyms: a threat is who or what can cause harm, a vulnerability is the weakness, and risk only exists when the two meet on an asset of value. Saying “phishing is the vulnerability” mixes the terms. **A control is not proof:** it only proves something with evidence that it works (a report of MFA enabled, a revocation test, a review record). **Defense in depth** is not stacking the same control, nor using layers as an excuse to keep a known vulnerability.",
      },
    ],
    armadilhas: [
      "Using threat, vulnerability and risk as synonyms: phishing is the threat, the account without MFA is the vulnerability, and the risk is the two combined with the impact.",
      "Relying on a single control (only MFA, only a firewall): when it fails or is bypassed, nothing is left.",
      "Declaring a control “implemented” with no evidence that it works and covers every account, service accounts included.",
      "Forgetting availability: an access control so strict or so fragile that it takes down everyone’s login is also an incident.",
    ],
    autoteste: [
      {
        pergunta: "How is risk calculated and how does IAM reduce it?",
        resposta:
          "Risk is the likelihood of a threat exploiting a vulnerability multiplied by the impact on the asset. IAM lowers the likelihood (MFA, blocking leaked credentials) and the impact (least privilege, deactivation at departure, access reviews).",
      },
      {
        pergunta: "Why does an asset inventory matter in IAM?",
        resposta:
          "Because you cannot protect what you do not know. Without listing accounts (service accounts included), applications, secrets and keys, orphaned accounts and unowned access stay outside MFA, reviews and logs.",
      },
    ],
  },
};
