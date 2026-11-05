import type { Pergunta } from "../../tipos";

// Q137 · Ameaça interna e abuso de acesso
export const q137: Pergunta = {
  numero: 137,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Ameaça interna e abuso de acesso",
    pergunta:
      "Como mitigar ameaças internas (insider threats) com IAM? Considere abuso de privilégio, contas compartilhadas e o desligamento de pessoas.",
    porqueEsteMetodo:
      "Defender-se de quem tem acesso legítimo só funciona quando cada abuso possível está ligado ao controle que o torna mais difícil ou mais visível. Pares risco → controle mostram esse mapa sem prometer que uma medida isolada resolve.",
    resposta30s:
      "Ameaça interna é uma pessoa (ou conta) com acesso legítimo que **abusa, erra ou foi comprometida**, e a causa costuma ser **privilégio em excesso com pouca visibilidade**. Reduza o que cada um pode fazer com **menor privilégio, separação de funções, contas nominais (nada de compartilhadas) e acesso privilegiado temporário com aprovação**, e enxergue o que faz com **logs imutáveis e alerta de comportamento anômalo**. Feche o ciclo cortando o acesso **no desligamento e na mudança de função**; o Zero Trust reforça tudo isso ao não dar confiança só por estar dentro da rede.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quem pode ser o “interno”",
        colunas: ["Tipo", "Exemplo", "O que mais ajuda"],
        linhas: [
          [
            "Malicioso",
            "Quem copia a base de clientes antes de sair, ou altera dados em benefício próprio",
            "Menor privilégio, separação de funções, registro e alerta de volume ou horário incomuns",
          ],
          [
            "Negligente",
            "Quem compartilha a senha do administrador, deixa um arquivo público por engano ou cai em phishing",
            "Contas nominais, padrões seguros, MFA resistente a phishing e treinamento",
          ],
          [
            "Comprometido ou coagido",
            "Um invasor com a credencial roubada de um funcionário, ou alguém pressionado a agir",
            "Verificação contínua do contexto (dispositivo, local), tokens curtos e aprovação de duas pessoas em ações críticas",
          ],
        ],
        nota: "O mesmo conjunto de controles cobre os três: para o sistema, uma conta roubada e um funcionário mal-intencionado fazem as mesmas chamadas.",
      },
      {
        tipo: "pares",
        titulo: "Risco → controle de IAM",
        rotuloOrigem: "Risco",
        rotuloDestino: "Controle de IAM",
        pares: [
          {
            origem: "Privilégio em excesso e acumulado: a pessoa muda de área e conserva os acessos antigos",
            destino:
              "**Menor privilégio** (veja Q109) e **revisão periódica de acessos** (veja Q119), com o gestor confirmando o que ainda é necessário. A mudança de função remove o acesso anterior, não só soma o novo (veja Q12).",
          },
          {
            origem: "Poder concentrado: a mesma pessoa cria o fornecedor, aprova o pagamento e apaga o registro",
            destino:
              "**Separação de funções** (veja Q110): ação crítica exige duas pessoas ou dois papéis, e quem administra um sistema não administra o próprio log.",
          },
          {
            origem:
              "Conta compartilhada (`admin`, `suporte`, uma senha de equipe): não há como saber quem fez o quê nem como tirar uma pessoa só",
            destino:
              "**Contas nominais** com MFA, sempre. Quando o acesso compartilhado é inevitável (conta de emergência, “break-glass”), a credencial fica num cofre, sai com aprovação e motivo, a sessão é gravada e cada uso gera alerta.",
          },
          {
            origem: "Privilégio permanente de administrador, disponível 24 horas mesmo sem uso",
            destino:
              "**Acesso privilegiado sob demanda** (JIT) com aprovação, prazo curto e gravação da sessão (veja Q118), e contas de administrador separadas das do dia a dia.",
          },
          {
            origem: "Exfiltração: download em massa, encaminhamento de e-mail, exportação de relatório",
            destino:
              "**Escopo estreito de dados**, limites e alertas de volume, prevenção de perda de dados onde couber e **linha de base de comportamento** por pessoa e por grupo (horário, volume, recursos novos), que alimenta um alerta ou exige nova verificação (veja Q123).",
          },
          {
            origem:
              "Desligamento: a conta do diretório é desativada, mas sessões, tokens de API, chaves e contas locais de SaaS continuam",
            destino:
              "**Desligamento orquestrado a partir do evento de RH**: desativar a conta, revogar sessões e refresh tokens, remover dos grupos, trocar segredos que a pessoa conhecia e transferir a posse de recursos e de contas de serviço (veja Q13 e Q15).",
          },
          {
            origem: "Adulteração de evidência: quem abusa apaga ou altera o registro",
            destino:
              "**Logs enviados a um sistema separado**, imutáveis e fora do controle de quem eles vigiam (veja Q139).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que o Zero Trust muda para o insider",
        texto:
          "O perímetro clássico confia em quem está dentro da rede, e a ameaça interna já está dentro. O Zero Trust (veja Q120 e o NIST SP 800-207) tira essa confiança implícita: cada acesso é decidido por identidade, dispositivo, contexto e risco **no momento do pedido**, com permissões mínimas e **avaliação contínua**. Na detecção, vira rotina: compare cada pessoa com a própria linha de base e com o grupo, some sinais de risco (horário, volume, recurso novo, muitas negações) e reaja de forma proporcional: pedir nova verificação, limitar a sessão ou abrir um alerta. Arquivos-isca (honeytokens) que ninguém deveria abrir são um sinal de alto valor.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Proporcionalidade e privacidade",
        texto:
          "Monitorar pessoas tem limites legais, trabalhistas e de confiança. Defina a finalidade, registre só o necessário, informe as pessoas, restrinja quem lê os dados e envolva RH e jurídico antes de agir sobre um alerta: comportamento anômalo é um indício, não uma prova, e falsos positivos acusam inocentes. Confira a legislação de proteção de dados e as normas internas aplicáveis.",
      },
    ],
    armadilhas: [
      "Tratar o insider só como funcionário mal-intencionado: a maioria dos incidentes vem de erro ou de conta roubada, e os controles precisam cobrir os três casos.",
      "Manter contas compartilhadas “porque é mais prático”: sem nome não há auditoria, e quando alguém sai a senha continua com todos.",
      "Desativar só a conta do diretório no desligamento e esquecer tokens de API, chaves, sessões abertas, contas locais de SaaS e contas de serviço que a pessoa criou.",
      "Investir só em detectar: o alerta chega depois do dano, e o privilégio menor reduz o dano antes que ele aconteça.",
    ],
    autoteste: [
      {
        pergunta: "Por que contas compartilhadas enfraquecem a defesa contra ameaças internas?",
        resposta:
          "Porque a ação não é atribuível a uma pessoa: não há auditoria confiável, o MFA e a revisão de acesso perdem o sentido e, quando alguém sai, a credencial de todos precisa ser trocada. A solução é a conta nominal; para emergência, um cofre com aprovação, gravação e alerta.",
      },
      {
        pergunta: "Como o Zero Trust ajuda contra alguém que já está dentro da rede?",
        resposta:
          "Ele deixa de dar confiança pela localização: cada acesso passa por identidade, dispositivo e contexto, com privilégio mínimo e reavaliação contínua. Isso limita o que a pessoa alcança e permite detectar desvios da linha de base e reagir com verificação adicional ou bloqueio.",
      },
    ],
  },
  en: {
    titulo: "Insider threats and access abuse",
    pergunta:
      "How do you mitigate insider threats with IAM? Consider privilege abuse, shared accounts and employee departures.",
    porqueEsteMetodo:
      "Defending against someone with legitimate access only works when each possible abuse is tied to the control that makes it harder or more visible. Risk → control pairs show that map without promising that any single measure solves it.",
    resposta30s:
      "An insider threat is a person (or account) with legitimate access who **abuses it, makes a mistake or has been compromised**, and the cause is usually **excess privilege with little visibility**. Shrink what each person can do with **least privilege, separation of duties, named accounts (no shared ones) and time-limited privileged access with approval**, and see what they do with **immutable logs and alerts on anomalous behavior**. Close the loop by cutting access **at departure and at role change**; Zero Trust reinforces all of it by not granting trust merely because someone is inside the network.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Who the “insider” can be",
        colunas: ["Type", "Example", "What helps most"],
        linhas: [
          [
            "Malicious",
            "Someone who copies the customer database before leaving, or changes data for personal gain",
            "Least privilege, separation of duties, logging and alerts on unusual volume or timing",
          ],
          [
            "Negligent",
            "Someone who shares the admin password, leaves a file public by mistake or falls for phishing",
            "Named accounts, secure defaults, phishing-resistant MFA and training",
          ],
          [
            "Compromised or coerced",
            "An attacker holding an employee’s stolen credential, or someone pressured to act",
            "Continuous checks on context (device, location), short-lived tokens and two-person approval for critical actions",
          ],
        ],
        nota: "The same set of controls covers all three: to the system, a stolen account and a malicious employee make the same calls.",
      },
      {
        tipo: "pares",
        titulo: "Risk → IAM control",
        rotuloOrigem: "Risk",
        rotuloDestino: "IAM control",
        pares: [
          {
            origem: "Excess and accumulated privilege: the person changes teams and keeps the old access",
            destino:
              "**Least privilege** (see Q109) and **periodic access reviews** (see Q119), with the manager confirming what is still needed. A role change removes the previous access, not just adds the new one (see Q12).",
          },
          {
            origem:
              "Concentrated power: the same person creates the supplier, approves the payment and deletes the record",
            destino:
              "**Separation of duties** (see Q110): a critical action needs two people or two roles, and whoever administers a system does not administer its own log.",
          },
          {
            origem:
              "Shared account (`admin`, `support`, a team password): there is no way to know who did what, or to remove just one person",
            destino:
              "**Named accounts** with MFA, always. When shared access is unavoidable (emergency “break-glass” account), the credential sits in a vault, is checked out with approval and a reason, the session is recorded and every use raises an alert.",
          },
          {
            origem: "Standing administrator privilege, available around the clock even when unused",
            destino:
              "**On-demand privileged access** (JIT) with approval, a short window and session recording (see Q118), and admin accounts separate from day-to-day ones.",
          },
          {
            origem: "Exfiltration: mass download, mail forwarding, report export",
            destino:
              "**Narrow data scope**, limits and volume alerts, data loss prevention where it fits and a **behavior baseline** per person and per group (hours, volume, new resources) that feeds an alert or forces re-verification (see Q123).",
          },
          {
            origem:
              "Departure: the directory account is disabled, but sessions, API tokens, keys and local SaaS accounts live on",
            destino:
              "**Offboarding orchestrated from the HR event**: disable the account, revoke sessions and refresh tokens, remove group memberships, rotate secrets the person knew and transfer ownership of resources and service accounts (see Q13 and Q15).",
          },
          {
            origem: "Tampering with evidence: the abuser deletes or edits the record",
            destino:
              "**Logs shipped to a separate system**, immutable and outside the control of the people they watch (see Q139).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What Zero Trust changes for the insider",
        texto:
          "The classic perimeter trusts whoever is inside the network, and the insider is already inside. Zero Trust (see Q120 and NIST SP 800-207) removes that implicit trust: every access is decided by identity, device, context and risk **at the moment of the request**, with minimal permissions and **continuous evaluation**. For detection it becomes routine: compare each person with their own baseline and with their group, add up risk signals (hours, volume, a new resource, many denials) and react proportionally: ask for re-verification, limit the session or raise an alert. Decoy files (honeytokens) that nobody should open are a high-value signal.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Proportionality and privacy",
        texto:
          "Monitoring people has legal, labor and trust limits. Define the purpose, record only what is needed, inform the people involved, restrict who reads the data and bring in HR and legal before acting on an alert: anomalous behavior is an indication, not proof, and false positives accuse innocent people. Check the applicable data protection law and internal policies.",
      },
    ],
    armadilhas: [
      "Treating the insider only as a malicious employee: most incidents come from mistakes or stolen accounts, and the controls must cover all three cases.",
      "Keeping shared accounts “because it is more practical”: without a name there is no audit, and when someone leaves the password stays with everybody.",
      "Disabling only the directory account at departure and forgetting API tokens, keys, open sessions, local SaaS accounts and service accounts the person created.",
      "Investing only in detection: the alert arrives after the damage, while lower privilege reduces the damage before it happens.",
    ],
    autoteste: [
      {
        pergunta: "Why do shared accounts weaken the defense against insider threats?",
        resposta:
          "Because the action cannot be attributed to one person: there is no reliable audit, MFA and access review lose their meaning, and when someone leaves everyone’s credential has to change. The fix is the named account; for emergencies, a vault with approval, recording and an alert.",
      },
      {
        pergunta: "How does Zero Trust help against someone who is already inside the network?",
        resposta:
          "It stops granting trust based on location: every access goes through identity, device and context, with least privilege and continuous re-evaluation. That limits what the person can reach and makes it possible to detect deviations from the baseline and react with extra verification or a block.",
      },
    ],
  },
};
