import type { Pergunta } from "../../tipos";

// Q95 · Passkeys sincronizadas × ligadas ao dispositivo
export const q095: Pergunta = {
  numero: 95,
  modulo: "mfa-e-passkeys",
  metodo: "compare",
  pt: {
    titulo: "Passkeys sincronizadas × ligadas ao dispositivo",
    pergunta:
      "Compare passkeys sincronizadas (na nuvem do provedor) e passkeys ligadas ao dispositivo. Quais os trade-offs de segurança e recuperação, e qual é o risco de bypass pela conta do provedor?",
    porqueEsteMetodo:
      "As duas são passkeys e diferem em onde a chave vive, o que muda recuperação, risco e controle. Uma matriz lado a lado mostra o trade-off, e a regra de decisão diz quando cada uma serve.",
    resposta30s:
      "Na passkey **sincronizada**, a chave privada é replicada, cifrada, entre os aparelhos do usuário por um gerenciador (a conta da plataforma ou um gerenciador de senhas); na **ligada ao dispositivo**, ela nasce e fica no hardware e não sai dele. A primeira ganha em **recuperação e adoção**; a segunda, em **controle e resistência a clonagem**. O risco da sincronizada é que a **conta do provedor e a recuperação dela viram o elo fraco**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Sincronizada × ligada ao dispositivo",
        colunas: ["Aspecto", "Sincronizada (multidispositivo)", "Ligada ao dispositivo"],
        linhas: [
          [
            "Onde vive a chave privada",
            "No gerenciador do provedor (conta da plataforma ou gerenciador de senhas), cifrada de ponta a ponta entre os dispositivos do usuário (o modelo varia por fornecedor) e copiada em cada aparelho",
            "Gerada e guardada no hardware do dispositivo (chip seguro, TPM ou chave de segurança física), sem exportação",
          ],
          [
            "Perder o aparelho",
            "A passkey continua nos outros dispositivos e volta ao entrar na conta do provedor",
            "Perdida junto com o aparelho: é preciso outra credencial registrada ou um processo de recuperação",
          ],
          [
            "Resistência a clonagem e roubo",
            "Depende da conta do provedor, dos dispositivos e do processo de recuperação; a chave existe em vários lugares",
            "Alta: extrair a chave de um hardware seguro é muito difícil, e a posse física é exigida",
          ],
          [
            "Atestação e controle do serviço",
            "Em geral não identifica um modelo certificado; o serviço vê apenas as flags de elegibilidade e estado de backup (`BE` e `BS`)",
            "Permite atestação e uma lista de modelos aceitos, para exigir autenticadores específicos",
          ],
          [
            "Recuperação",
            "Delegada ao provedor: fácil para o usuário, mas é o processo do provedor que decide quem recupera",
            "Responsabilidade do serviço: registrar ao menos duas credenciais ou ter um processo de recuperação forte",
          ],
          [
            "Experiência e adoção",
            "Alta: funciona em aparelhos novos e entre ecossistemas compatíveis, com menos suporte",
            "Menor: exige carregar e cadastrar a chave, e uma segunda como reserva",
          ],
          [
            "Organizações reguladas",
            "Aceitável na maioria dos acessos de risco baixo e médio; as referências mais rígidas (como as revisões recentes do NIST SP 800-63B) tratam chaves sincronizáveis com cautela nos níveis de garantia mais altos: confira a revisão vigente",
            "Preferida para alta garantia: administradores, financeiro, dados sensíveis e níveis que exigem chave não exportável",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Escolha pela **garantia exigida** e pelo **custo de perder o acesso**. Consumo e a maior parte da força de trabalho: **sincronizadas**, que reduzem chamados de suporte e a dependência de senha e SMS. Alta garantia (administradores, financeiro, acesso privilegiado, setores regulados): **ligadas ao dispositivo**, com atestação ou lista de modelos, **duas ou mais credenciais por conta** e recuperação forte. Na prática, ofereça as duas e use as flags `BE` e `BS` e políticas por perfil para exigir o tipo certo em cada caso.",
      },
      {
        tipo: "pares",
        titulo: "Riscos de segurança → mitigação",
        rotuloOrigem: "Risco",
        rotuloDestino: "Mitigação",
        pares: [
          {
            origem:
              "**Tomada da conta do provedor** (engenharia social, recuperação de conta, SIM swap ou phishing das credenciais do provedor): o atacante contorna a passkey ao obter acesso a ela",
            destino:
              "Proteger a conta do provedor com MFA forte; para alto risco, exigir passkeys ligadas ao dispositivo; monitorar o registro de novas credenciais e avisar o usuário.",
          },
          {
            origem: "**Recuperação fraca no próprio serviço**: senha, SMS ou e-mail ainda aceitos como alternativa",
            destino:
              "O atacante usa o elo mais fraco, não a passkey: remova ou restrinja os fallbacks fracos, exija verificação forte e um prazo de segurança na recuperação e avise por todos os canais a cada fator novo.",
          },
          {
            origem: "**Dispositivo ou navegador comprometido**: malware que age depois do login ou rouba a sessão",
            destino:
              "A passkey não protege uma sessão já aberta: use sessões curtas, vínculo com o dispositivo, reautenticação em ações sensíveis e proteção do endpoint.",
          },
          {
            origem:
              "**Perda de acesso**: aparelho perdido sem reserva (ligada ao dispositivo) ou conta do provedor perdida (sincronizada)",
            destino:
              "Registrar mais de uma credencial, de tipos diferentes, e manter um processo de recuperação documentado e testado.",
          },
          {
            origem: "**Dependência de fornecedor**: portabilidade limitada entre ecossistemas",
            destino:
              "Não amarrar a conta a um só gerenciador, aceitar várias credenciais por usuário e acompanhar a evolução dos padrões de troca entre gerenciadores (confira a documentação do fornecedor).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O bypass pela conta do provedor",
        texto:
          "Uma passkey sincronizada **não é invulnerável**: se um atacante toma a conta do provedor, as passkeys podem chegar ao aparelho dele, sem phishing de passkey nenhum. E, se o seu serviço mantém recuperação por e-mail, SMS ou senha, o atacante nem precisa disso. O conjunto vale o que vale o **elo mais fraco**, que costuma ser a recuperação. A passkey melhora muito o login, mas só protege de verdade quando as saídas alternativas são tão fortes quanto ela.",
      },
    ],
    armadilhas: [
      "Achar que a sincronizada é “menos passkey”: a criptografia e a resistência a phishing são as mesmas; mudam a custódia da chave e a recuperação.",
      "Manter senha, SMS ou e-mail como fallback sem restrição: a recuperação enfraquece o conjunto inteiro.",
      "Exigir atestação de todo o público: afasta usuários, e as sincronizadas em geral não a fornecem. Use só onde a política pede.",
      "Permitir uma única credencial por conta: perdeu o aparelho ou a conta do provedor, perdeu o acesso.",
    ],
    autoteste: [
      {
        pergunta: "Onde fica a chave privada em cada tipo e o que isso muda na recuperação?",
        resposta:
          "Na sincronizada, replicada e cifrada pelo gerenciador do provedor, o que permite recuperar entrando na conta dele; na ligada ao dispositivo, só no hardware, então a perda exige outra credencial registrada ou a recuperação do serviço.",
      },
      {
        pergunta: "Como um atacante pode contornar uma passkey sincronizada?",
        resposta:
          "Sem quebrar a criptografia: tomando a conta do provedor e acessando as passkeys num novo aparelho, ou usando um fallback fraco (senha, SMS, e-mail) que o serviço mantém. A defesa é proteger a conta e a recuperação e exigir ligadas ao dispositivo em alto risco.",
      },
    ],
  },
  en: {
    titulo: "Synced vs device-bound passkeys",
    pergunta:
      "Compare synced passkeys (in the provider's cloud) with device-bound passkeys. What are the security and recovery trade-offs, and what is the bypass risk through the provider account?",
    porqueEsteMetodo:
      "Both are passkeys and differ in where the key lives, which changes recovery, risk and control. A side-by-side matrix shows the trade-off, and the decision rule says when each one fits.",
    resposta30s:
      "In a **synced** passkey, the private key is replicated, encrypted, across the user’s devices by a manager (the platform account or a password manager); in a **device-bound** one, it is born and stays in hardware and never leaves it. The first wins on **recovery and adoption**; the second on **control and resistance to cloning**. The synced one’s risk is that the **provider account and its recovery become the weak link**.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Synced vs device-bound",
        colunas: ["Aspect", "Synced (multi-device)", "Device-bound"],
        linhas: [
          [
            "Where the private key lives",
            "In the provider’s manager (platform account or password manager), end-to-end encrypted across the user’s devices (the model varies by vendor) and copied onto each device",
            "Generated and kept in the device’s hardware (secure chip, TPM or physical security key), with no export",
          ],
          [
            "Losing the device",
            "The passkey stays on the other devices and comes back when signing into the provider account",
            "Lost with the device: you need another registered credential or a recovery process",
          ],
          [
            "Resistance to cloning and theft",
            "Depends on the provider account, the devices and the recovery process; the key exists in several places",
            "High: extracting a key from secure hardware is very hard, and physical possession is required",
          ],
          [
            "Attestation and service control",
            "Generally does not identify a certified model; the service sees only the eligibility and backup-state flags (`BE` and `BS`)",
            "Allows attestation and a list of accepted models, to require specific authenticators",
          ],
          [
            "Recovery",
            "Delegated to the provider: easy for the user, but the provider’s process decides who recovers",
            "The service’s responsibility: register at least two credentials or have a strong recovery process",
          ],
          [
            "Experience and adoption",
            "High: works on new devices and across compatible ecosystems, with less support effort",
            "Lower: you must carry and enroll the key, plus a second one as backup",
          ],
          [
            "Regulated organizations",
            "Acceptable for most low- and medium-risk access; the stricter references (such as recent revisions of NIST SP 800-63B) treat syncable keys with caution at the highest assurance levels: check the current revision",
            "Preferred for high assurance: administrators, finance, sensitive data and levels that require a non-exportable key",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Choose by the **assurance required** and the **cost of losing access**. Consumers and most of the workforce: **synced**, which cut support tickets and reliance on passwords and SMS. High assurance (administrators, finance, privileged access, regulated sectors): **device-bound**, with attestation or a model list, **two or more credentials per account** and strong recovery. In practice, offer both and use the `BE` and `BS` flags and per-profile policies to require the right type in each case.",
      },
      {
        tipo: "pares",
        titulo: "Security risks → mitigation",
        rotuloOrigem: "Risk",
        rotuloDestino: "Mitigation",
        pares: [
          {
            origem:
              "**Takeover of the provider account** (social engineering, account recovery, SIM swap or phishing of the provider’s credentials): the attacker bypasses the passkey by gaining access to it",
            destino:
              "Protect the provider account with strong MFA; for high risk, require device-bound passkeys; monitor registration of new credentials and notify the user.",
          },
          {
            origem: "**Weak recovery in the service itself**: password, SMS or e-mail still accepted as an alternative",
            destino:
              "The attacker uses the weakest link, not the passkey: remove or restrict weak fallbacks, require strong verification and a safety delay on recovery, and notify through every channel for each new factor.",
          },
          {
            origem: "**Compromised device or browser**: malware that acts after login or steals the session",
            destino:
              "A passkey does not protect a session that is already open: use short sessions, device binding, re-authentication for sensitive actions and endpoint protection.",
          },
          {
            origem:
              "**Loss of access**: a lost device with no backup (device-bound) or a lost provider account (synced)",
            destino:
              "Register more than one credential, of different types, and keep a documented, tested recovery process.",
          },
          {
            origem: "**Vendor dependence**: limited portability across ecosystems",
            destino:
              "Do not tie the account to a single manager, accept several credentials per user and follow the evolution of the standards for moving credentials between managers (check the vendor’s documentation).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The bypass through the provider account",
        texto:
          "A synced passkey is **not invulnerable**: if an attacker takes over the provider account, the passkeys can reach their device, with no passkey phishing at all. And if your service keeps recovery by e-mail, SMS or password, the attacker does not even need that. The whole is worth only as much as its **weakest link**, which is usually recovery. A passkey greatly improves login, but it only truly protects when the alternative exits are as strong as it is.",
      },
    ],
    armadilhas: [
      "Thinking the synced one is “less of a passkey”: the cryptography and phishing resistance are the same; what changes is custody of the key and recovery.",
      "Keeping password, SMS or e-mail as an unrestricted fallback: recovery weakens the whole.",
      "Demanding attestation from the whole audience: it drives users away, and synced passkeys generally do not provide it. Use it only where the policy asks.",
      "Allowing a single credential per account: lose the device or the provider account and you lose access.",
    ],
    autoteste: [
      {
        pergunta: "Where does the private key live in each type, and what does that change for recovery?",
        resposta:
          "In the synced one, replicated and encrypted by the provider’s manager, which lets you recover by signing into that account; in the device-bound one, only in hardware, so a loss requires another registered credential or the service’s recovery.",
      },
      {
        pergunta: "How can an attacker get around a synced passkey?",
        resposta:
          "Without breaking the cryptography: by taking over the provider account and reaching the passkeys on a new device, or by using a weak fallback (password, SMS, e-mail) the service keeps. The defense is protecting the account and the recovery, and requiring device-bound passkeys for high risk.",
      },
    ],
  },
};
