import type { Pergunta } from "../../tipos";

// Q138 · Movimento lateral com credenciais
export const q138: Pergunta = {
  numero: 138,
  modulo: "ataques-e-depuracao",
  metodo: "threat",
  pt: {
    titulo: "Movimento lateral com credenciais",
    pergunta:
      "Como credenciais roubadas viabilizam movimento lateral, e como identidade, privilégio mínimo e segmentação reduzem o impacto de um comprometimento?",
    porqueEsteMetodo:
      "Movimento lateral é uma cadeia de reutilizações. Ligar cada técnica do invasor à defesa que a corta mostra onde interromper a cadeia, em vez de listar controles soltos.",
    resposta30s:
      "Depois do primeiro acesso, o invasor usa **credenciais, hashes, tickets e tokens roubados** como se fosse a vítima para saltar entre sistemas, sem precisar de uma falha nova; o estrago cresce com **o que a identidade alcança, por quanto tempo vale e quanto demora a ser notada**. Reduza o impacto com **privilégio mínimo, credenciais efêmeras, contas administrativas separadas, MFA em acessos internos e segmentação** que exija autenticar a cada salto. Complete com **detecção de uso fora do padrão** e contenção rápida (veja Q140).",
    blocos: [
      {
        tipo: "pares",
        titulo: "Técnica do invasor → defesa",
        rotuloOrigem: "Técnica do invasor",
        rotuloDestino: "Defesa",
        pares: [
          {
            origem:
              "**Pass-the-hash**: usa o hash NTLM de uma conta, sem saber a senha, e a mesma senha de administrador local vale em muitas máquinas",
            destino:
              "Senha de administrador local **única por máquina e rotacionada** (por exemplo, com uma solução como o Windows LAPS), desativar protocolos legados como o NTLM onde for possível e proteger as credenciais em memória. Confira a documentação do fornecedor.",
          },
          {
            origem:
              "O administrador entra em máquinas comuns com a conta poderosa e deixa credenciais em memória, prontas para serem roubadas",
            destino:
              "**Contas administrativas separadas** das do dia a dia, em camadas (domínio, servidor, estação), usadas só em estações de administração reforçadas, e **acesso privilegiado sob demanda** (veja Q118).",
          },
          {
            origem:
              "Conta de serviço com senha estática, antiga e permissões amplas (por exemplo, **Kerberoasting**: pede tickets de serviço e quebra a senha offline)",
            destino:
              "**Identidades gerenciadas** ou contas de serviço gerenciadas, com segredo longo e rotacionado, permissões mínimas, dono definido e restrição de onde podem ser usadas (veja Q14 e Q15).",
          },
          {
            origem:
              "Chaves de API, segredos e tokens de longa vida achados em repositórios, arquivos de configuração, variáveis de ambiente ou no serviço de metadados de uma VM",
            destino:
              "**Credenciais efêmeras** emitidas por federação de identidade, tokens de curta duração, cofre de segredos, varredura de segredos e proteção do endpoint de metadados (veja Q16 e Q141).",
          },
          {
            origem: "Roubo e replay de token ou cookie de sessão a partir de outra máquina",
            destino:
              "Tokens curtos, **tokens vinculados ao remetente** (veja Q37), sessões atreladas ao dispositivo e reavaliação contínua do risco (veja Q123 e Q130).",
          },
          {
            origem: "Rede plana: qualquer máquina fala com qualquer outra por RDP, SSH ou compartilhamento de arquivos",
            destino:
              "**Segmentação e microssegmentação** com negação por padrão no tráfego leste-oeste, autenticação por serviço (mTLS com identidade de carga de trabalho), proxy ciente de identidade ou ZTNA em vez de confiar na rede (veja Q121 e Q122).",
          },
          {
            origem: "Ferramentas administrativas, jump hosts e consoles internos acessíveis só com senha",
            destino:
              "**MFA, de preferência resistente a phishing** (veja Q96), em todo acesso administrativo e interno, mais autenticação adicional para ações de risco (veja Q99).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Sinais de movimento lateral",
        colunas: ["Sinal", "Por que levanta suspeita", "Primeira resposta"],
        linhas: [
          [
            "Credencial usada numa máquina, serviço ou horário em que nunca apareceu",
            "Foge da linha de base da conta; pode ser a mesma credencial roubada",
            "Pedir nova autenticação, olhar a sessão e comparar com o dispositivo habitual da pessoa",
          ],
          [
            "Uma conta tocando muitos hosts em pouco tempo",
            "Típico de varredura para descobrir onde a credencial vale",
            "Isolar o host de origem e desabilitar a conta",
          ],
          [
            "Conta de serviço com logon interativo ou vinda de um host novo",
            "Contas de serviço têm comportamento previsível",
            "Bloquear, rotacionar o segredo e investigar o host",
          ],
          [
            "Pedidos em massa de tickets ou tokens, ou ferramenta administrativa usada por quem não é administrador",
            "Enumeração de contas e quebra offline de segredos",
            "Alertar, revisar a conta-alvo e trocar senhas fracas",
          ],
          [
            "Conta entrando em grupo ou papel privilegiado fora do processo de aprovação",
            "Escalonamento de privilégio e persistência",
            "Reverter a mudança e auditar quem a fez",
          ],
        ],
        nota: "Os dados vêm dos logs de autenticação do diretório e do IdP, dos logs de atividade da nuvem e da telemetria dos endpoints, reunidos num SIEM (veja Q139). O MITRE ATT&CK cataloga as técnicas de movimento lateral e serve de roteiro para criar regras.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que decide o tamanho do estrago",
        texto:
          "O impacto de uma credencial roubada cresce com o **alcance** (tudo o que a identidade e a rede permitem) e com a **duração** (por quanto tempo ela vale), e diminui com a **rapidez da detecção**. Cada defesa mexe em um desses fatores: privilégio mínimo e segmentação reduzem o alcance, credenciais efêmeras e tokens curtos reduzem a duração, detecção e contenção reduzem o tempo de permanência. É a premissa “assuma o comprometimento” do Zero Trust (NIST SP 800-207): projete para que o primeiro salto não leve ao segundo.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "MFA e segmentação têm limite",
        texto:
          "O MFA protege o login interativo, mas **não impede** o uso de um hash, ticket ou token que já foi emitido: por isso importam a vida curta, o vínculo ao dispositivo e a detecção. Segmentação sem identidade vira regras de firewall que ninguém revisa, e segmentação sem monitoramento deixa o invasor ficar quanto tempo quiser. Nenhum controle isolado basta; valem as camadas.",
      },
    ],
    armadilhas: [
      "Achar que o MFA resolve: ele não barra o pass-the-hash nem o replay de um token já emitido.",
      "Contas de serviço com senha eterna, permissões de administrador “para funcionar” e ninguém responsável por elas.",
      "Confiar na rede interna (a VPN dá acesso a tudo): um único endpoint comprometido passa a alcançar todo o resto.",
      "Detectar sem conseguir conter: sem roteiro, sem poder desabilitar a conta ou isolar o host rápido, o alerta chega e nada acontece.",
    ],
    autoteste: [
      {
        pergunta: "Por que credenciais de curta duração reduzem o impacto do movimento lateral?",
        resposta:
          "Porque o invasor só pode usar a credencial roubada por pouco tempo, e muitas só valem em certo contexto (dispositivo, serviço). Isso estreita a janela para saltar entre sistemas e dificulta a persistência.",
      },
      {
        pergunta: "Como o Zero Trust dificulta o movimento lateral numa rede?",
        resposta:
          "Ele não dá confiança pela localização: cada acesso entre serviços exige autenticação e autorização com privilégio mínimo, o tráfego leste-oeste é negado por padrão (microssegmentação) e o comportamento é reavaliado continuamente. Comprometer uma máquina não abre as outras.",
      },
    ],
  },
  en: {
    titulo: "Lateral movement with credentials",
    pergunta:
      "How do stolen credentials enable lateral movement, and how do identity, least privilege and segmentation reduce the impact of a compromise?",
    porqueEsteMetodo:
      "Lateral movement is a chain of reuses. Tying each attacker technique to the defense that breaks it shows where to cut the chain, instead of listing loose controls.",
    resposta30s:
      "After the first foothold, the attacker uses **stolen credentials, hashes, tickets and tokens** as if they were the victim to hop between systems, without needing a new vulnerability; the damage grows with **what the identity can reach, how long it stays valid and how long it takes to be noticed**. Cut the impact with **least privilege, ephemeral credentials, separate admin accounts, MFA on internal access and segmentation** that forces authentication at every hop. Complete it with **detection of out-of-pattern use** and fast containment (see Q140).",
    blocos: [
      {
        tipo: "pares",
        titulo: "Attacker technique → defense",
        rotuloOrigem: "Attacker technique",
        rotuloDestino: "Defense",
        pares: [
          {
            origem:
              "**Pass-the-hash**: uses an account’s NTLM hash without knowing the password, and the same local admin password works on many machines",
            destino:
              "Local admin password **unique per machine and rotated** (for example, with a solution such as Windows LAPS), disable legacy protocols such as NTLM where possible and protect credentials in memory. Check the vendor documentation.",
          },
          {
            origem:
              "The administrator logs into ordinary machines with the powerful account and leaves credentials in memory, ready to be stolen",
            destino:
              "**Admin accounts separate** from day-to-day ones, in tiers (domain, server, workstation), used only on hardened administration workstations, and **on-demand privileged access** (see Q118).",
          },
          {
            origem:
              "Service account with a static, old password and broad permissions (for example, **Kerberoasting**: requests service tickets and cracks the password offline)",
            destino:
              "**Managed identities** or managed service accounts, with a long rotated secret, minimal permissions, a defined owner and restrictions on where they can be used (see Q14 and Q15).",
          },
          {
            origem:
              "Long-lived API keys, secrets and tokens found in repositories, configuration files, environment variables or a VM’s metadata service",
            destino:
              "**Ephemeral credentials** issued through identity federation, short-lived tokens, a secrets vault, secret scanning and protection of the metadata endpoint (see Q16 and Q141).",
          },
          {
            origem: "Theft and replay of a token or session cookie from another machine",
            destino:
              "Short tokens, **sender-constrained tokens** (see Q37), sessions tied to the device and continuous risk re-evaluation (see Q123 and Q130).",
          },
          {
            origem: "Flat network: any machine talks to any other over RDP, SSH or file sharing",
            destino:
              "**Segmentation and microsegmentation** with deny-by-default east-west traffic, per-service authentication (mTLS with workload identity), an identity-aware proxy or ZTNA instead of trusting the network (see Q121 and Q122).",
          },
          {
            origem: "Administrative tools, jump hosts and internal consoles reachable with just a password",
            destino:
              "**MFA, preferably phishing-resistant** (see Q96), on every administrative and internal access, plus additional authentication for risky actions (see Q99).",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Signs of lateral movement",
        colunas: ["Signal", "Why it is suspicious", "First response"],
        linhas: [
          [
            "A credential used on a machine, service or hour where it never appeared",
            "Departs from the account’s baseline; it may be the same stolen credential",
            "Ask for re-authentication, look at the session and compare with the person’s usual device",
          ],
          [
            "One account touching many hosts in a short time",
            "Typical of scanning to find where the credential works",
            "Isolate the source host and disable the account",
          ],
          [
            "Service account with an interactive logon or coming from a new host",
            "Service accounts behave predictably",
            "Block, rotate the secret and investigate the host",
          ],
          [
            "Mass requests for tickets or tokens, or an admin tool used by a non-admin",
            "Account enumeration and offline secret cracking",
            "Alert, review the target account and replace weak passwords",
          ],
          [
            "An account joining a privileged group or role outside the approval process",
            "Privilege escalation and persistence",
            "Revert the change and audit who made it",
          ],
        ],
        nota: "The data comes from directory and IdP authentication logs, cloud activity logs and endpoint telemetry, gathered in a SIEM (see Q139). MITRE ATT&CK catalogs lateral movement techniques and works as a roadmap for writing rules.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What decides the size of the damage",
        texto:
          "The impact of a stolen credential grows with its **reach** (everything the identity and the network allow) and its **lifetime** (how long it stays valid), and shrinks with **speed of detection**. Each defense moves one of these factors: least privilege and segmentation reduce reach, ephemeral credentials and short tokens reduce lifetime, detection and containment reduce dwell time. It is the “assume breach” premise of Zero Trust (NIST SP 800-207): design so that the first hop does not lead to the second.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "MFA and segmentation have limits",
        texto:
          "MFA protects the interactive login, but it **does not stop** the use of a hash, ticket or token that has already been issued: that is why short lifetimes, device binding and detection matter. Segmentation without identity becomes firewall rules nobody reviews, and segmentation without monitoring lets the attacker stay as long as they like. No single control is enough; the layers are what count.",
      },
    ],
    armadilhas: [
      "Believing MFA solves it: it does not stop pass-the-hash or the replay of a token that was already issued.",
      "Service accounts with an eternal password, admin permissions “to make it work” and nobody responsible for them.",
      "Trusting the internal network (the VPN gives access to everything): one compromised endpoint then reaches everything else.",
      "Detecting without being able to contain: with no runbook and no quick way to disable the account or isolate the host, the alert arrives and nothing happens.",
    ],
    autoteste: [
      {
        pergunta: "Why do short-lived credentials reduce the impact of lateral movement?",
        resposta:
          "Because the attacker can use the stolen credential only briefly, and many are valid only in a certain context (device, service). That narrows the window to hop between systems and makes persistence harder.",
      },
      {
        pergunta: "How does Zero Trust make lateral movement harder on a network?",
        resposta:
          "It gives no trust based on location: each access between services requires authentication and authorization with least privilege, east-west traffic is denied by default (microsegmentation) and behavior is continuously re-evaluated. Compromising one machine does not open the others.",
      },
    ],
  },
};
