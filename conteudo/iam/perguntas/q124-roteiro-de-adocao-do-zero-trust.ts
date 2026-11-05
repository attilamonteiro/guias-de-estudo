import type { Pergunta } from "../../tipos";

// Q124 · Roteiro de adoção do zero trust
export const q124: Pergunta = {
  numero: 124,
  modulo: "autorizacao",
  metodo: "playbook",
  pt: {
    titulo: "Roteiro de adoção do zero trust",
    pergunta:
      "Como você conduziria a adoção gradual de zero trust em uma organização com aplicações legadas, nuvem e trabalho remoto? Como mede o avanço?",
    porqueEsteMetodo:
      "Adotar zero trust é um programa de meses ou anos, e o risco é tentar tudo ao mesmo tempo. Um playbook ordena as etapas pelo que reduz mais risco por esforço e dá, para cada uma, o sinal de que avançou.",
    resposta30s:
      "Comece por **inventariar ativos e fluxos**, **consolidar a identidade com SSO e MFA** e proteger primeiro o que é mais crítico (contas privilegiadas, acesso remoto, aplicações sensíveis). Em seguida aplique **acesso condicional e privilégio mínimo**, **segmente e proteja o legado** com proxies de identidade e monitore tudo. Meça por **cobertura de MFA, aplicações atrás de SSO, contas privilegiadas permanentes e tempo de detecção**, e trate a adoção como ciclos curtos, não como um projeto único.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: adoção em ciclos",
        passos: [
          {
            titulo: "1. Inventarie ativos e fluxos",
            texto:
              "Liste o que há para proteger: identidades (pessoas e contas de serviço), dispositivos, aplicações, APIs e SaaS, dados sensíveis, consoles de nuvem e pipelines de entrega. Mapeie quem acessa o quê e por qual caminho. Sinal de acerto: cada aplicação crítica tem dono, e as contas de serviço estão listadas.",
          },
          {
            titulo: "2. Consolide identidade e MFA",
            texto:
              "Um IdP central ou federado, SSO, MFA para todos (começando por administradores e acesso remoto), fim das contas locais e compartilhadas, e ciclo de vida de entrada, mudança e saída funcionando (veja Q12 e Q13). Sinal de acerto: sobe a proporção de aplicações atrás do SSO e de usuários com MFA forte.",
          },
          {
            titulo: "3. Comece pelo mais crítico, com vitórias rápidas",
            texto:
              "Contas privilegiadas (PAM e JIT, veja Q118), acesso remoto e aplicações com dados sensíveis vêm primeiro. Vitórias rápidas com pouca fricção: MFA nos administradores, bloqueio de protocolos legados de autenticação, desativação de contas sem uso, fim de exposições diretas à internet. Sinal de acerto: risco que cai logo e apoio da liderança.",
          },
          {
            titulo: "4. Dispositivo e acesso condicional",
            texto:
              "Inventário e gestão de dispositivos, postura por MDM e EDR, e políticas de acesso condicional em modo só-relatório antes de aplicar (veja Q123). Sinal de acerto: o acesso a dados sensíveis só ocorre por dispositivo conforme, com exceções documentadas e com prazo.",
          },
          {
            titulo: "5. Privilégio mínimo e segmentação",
            texto:
              "Revisões de acesso com remoções aplicadas (veja Q119), papéis enxutos e segmentação do restante da rede. Aplicações por ZTNA ou proxy de identidade no lugar da VPN ampla (veja Q122). O legado que não fala SSO fica atrás de um proxy, segmentado e com administração por PAM. Sinal de acerto: caem as regras “qualquer origem, qualquer destino”.",
          },
          {
            titulo: "6. Monitore e responda",
            texto:
              "Telemetria centralizada de identidade, dispositivo e rede, detecção e resposta, e os sinais de risco alimentando as decisões de acesso (veja Q121). Sinal de acerto: cai o tempo de detecção e de contenção, medido em incidentes reais e em exercícios.",
          },
          {
            titulo: "7. Meça, valide e repita",
            texto:
              "Revise as métricas a cada ciclo, valide a arquitetura de ponta a ponta com testes e exercícios de “assuma violação”, e ajuste a prioridade. Zero trust é melhoria contínua, não um marco final.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Como medir o avanço",
        colunas: ["Métrica", "O que mede", "Como obter", "Sinal de avanço"],
        linhas: [
          [
            "Cobertura de MFA forte",
            "Quem autentica com mais de uma prova, de preferência resistente a phishing",
            "Relatórios do IdP por usuário e método",
            "Administradores e acesso remoto primeiro; depois todos",
          ],
          [
            "Aplicações atrás de SSO e com acesso condicional",
            "Quanto do portfólio usa o IdP central",
            "Inventário de aplicações cruzado com o IdP",
            "A proporção sobe; contas locais caem",
          ],
          [
            "Contas privilegiadas permanentes",
            "Quantas contas mantêm poder o tempo todo",
            "Atribuições de papéis e dados do cofre ou PAM",
            "Cai à medida que o JIT cobre os papéis",
          ],
          [
            "Dispositivos gerenciados e conformes",
            "Parte do parque que informa uma postura confiável",
            "MDM e EDR",
            "Sobe; dados sensíveis só por dispositivo conforme",
          ],
          [
            "Tempo de detecção e de contenção",
            "Rapidez para perceber e conter um incidente",
            "SIEM, registro de incidentes e exercícios",
            "Cai ao longo dos ciclos",
          ],
          [
            "Segmentação e tráfego permitido",
            "Quanto do tráfego leste-oeste é só o necessário",
            "Regras de rede e logs de fluxo",
            "Regras amplas (“qualquer”) diminuem",
          ],
          [
            "Revisões de acesso com remoções aplicadas",
            "Se a limpeza de privilégios acontece de fato",
            "Campanhas de revisão (veja Q119)",
            "Há remoções efetivas, não só aprovações",
          ],
          [
            "Aplicações legadas protegidas",
            "Quanto do legado ganhou proxy, segmentação ou plano de saída",
            "Inventário do legado",
            "Nenhuma exposta diretamente",
          ],
        ],
        nota: "Metas absolutas dependem da organização; o que importa é a tendência e a ligação de cada métrica com um risco reduzido. Modelos de maturidade (como o da CISA) descrevem estágios, do tradicional ao ótimo, por pilar: use um deles para avaliar e comparar, e confira a versão atual do documento.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Ordem e escala",
        texto:
          "Ordem de ouro: **identidade primeiro, depois dispositivo, depois aplicação, depois rede e dados**, sempre começando pelo mais crítico. **Organização pequena**: use o IdP em nuvem e serviços gerenciados (SSO, MFA, acesso condicional, EDR gerenciado) e já está bem encaminhada, sem equipe grande. **Organização grande ou multinacional**: um programa com governança central, uma arquitetura de referência e políticas como código, implantadas por ondas (por unidade de negócio ou aplicação), com variações regionais para leis de dados e latência. **Maturidade**: avalie por pilar, defina o estágio-alvo de cada um e revise em ciclos.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Legado, resistência e o que não fazer",
        texto:
          "Aplicações que não falam SSO nem MFA ficam atrás de um **proxy de identidade ou ZTNA**, segmentadas, administradas por PAM, com plano de aposentadoria e controles compensatórios documentados; **não** as deixe como exceção eterna. Contra a **resistência** das pessoas, comece pelas vitórias rápidas que dão pouca fricção, use o modo só-relatório, faça pilotos, explique o motivo e meça a experiência. Evite o “big bang”: comprar uma plataforma “zero trust” e ligar tudo de uma vez costuma quebrar o negócio e perder o patrocínio.",
      },
    ],
    armadilhas: [
      "Comprar uma plataforma e declarar vitória: zero trust é estratégia, e ferramenta sem inventário e política não resolve.",
      "Começar pela rede (microssegmentação total) antes de consolidar a identidade: sem IdP confiável, não há o que decidir.",
      "Medir atividade (quantos projetos, quantas licenças) em vez de resultado (cobertura de MFA, contas privilegiadas permanentes, tempo de detecção).",
      "Tratar o legado como exceção sem prazo: ele vira o caminho mais fácil para o invasor.",
    ],
    autoteste: [
      {
        pergunta: "Por onde começar e por quê?",
        resposta:
          "Pelo inventário e pela identidade (SSO e MFA, começando por administradores e acesso remoto), porque quase toda decisão de zero trust depende de saber quem acessa o quê. Em seguida, o que é mais crítico, escolhendo vitórias rápidas que reduzem muito risco com pouca fricção.",
      },
      {
        pergunta: "Cite métricas para mostrar o progresso a uma diretoria.",
        resposta:
          "Cobertura de MFA forte, aplicações atrás de SSO e acesso condicional, contas privilegiadas permanentes, dispositivos conformes e tempo de detecção e contenção. Mostre a tendência e ligue cada uma a um risco reduzido.",
      },
    ],
  },
  en: {
    titulo: "Zero trust adoption roadmap",
    pergunta:
      "How would you lead a gradual zero trust adoption in an organization with legacy applications, cloud and remote work? How do you measure progress?",
    porqueEsteMetodo:
      "Adopting zero trust is a program of months or years, and the risk is trying everything at once. A playbook orders the steps by how much risk they remove per unit of effort and gives, for each one, the sign that it advanced.",
    resposta30s:
      "Start by **inventorying assets and flows**, **consolidating identity with SSO and MFA** and protecting the most critical things first (privileged accounts, remote access, sensitive applications). Then apply **conditional access and least privilege**, **segment and protect the legacy** with identity proxies and monitor everything. Measure by **MFA coverage, applications behind SSO, standing privileged accounts and time to detect**, and treat adoption as short cycles, not a single project.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: adoption in cycles",
        passos: [
          {
            titulo: "1. Inventory assets and flows",
            texto:
              "List what there is to protect: identities (people and service accounts), devices, applications, APIs and SaaS, sensitive data, cloud consoles and delivery pipelines. Map who accesses what and by which path. A sign of success: every critical application has an owner, and service accounts are listed.",
          },
          {
            titulo: "2. Consolidate identity and MFA",
            texto:
              "A central or federated IdP, SSO, MFA for everyone (starting with administrators and remote access), an end to local and shared accounts, and a working joiner-mover-leaver lifecycle (see Q12 and Q13). A sign of success: the share of applications behind SSO and of users with strong MFA goes up.",
          },
          {
            titulo: "3. Start with the most critical, with quick wins",
            texto:
              "Privileged accounts (PAM and JIT, see Q118), remote access and applications with sensitive data come first. Quick wins with little friction: MFA for administrators, blocking legacy authentication protocols, deactivating unused accounts, ending direct exposure to the internet. A sign of success: risk that drops early and support from leadership.",
          },
          {
            titulo: "4. Device and conditional access",
            texto:
              "Device inventory and management, posture through MDM and EDR, and conditional access policies in report-only mode before enforcing (see Q123). A sign of success: access to sensitive data only happens from compliant devices, with documented exceptions that have an expiry.",
          },
          {
            titulo: "5. Least privilege and segmentation",
            texto:
              "Access reviews with removals applied (see Q119), lean roles and segmentation of the rest of the network. Applications behind ZTNA or an identity proxy in place of the broad VPN (see Q122). Legacy that does not speak SSO sits behind a proxy, segmented and administered through PAM. A sign of success: “any source, any destination” rules fall.",
          },
          {
            titulo: "6. Monitor and respond",
            texto:
              "Centralized telemetry for identity, device and network, detection and response, and risk signals feeding access decisions (see Q121). A sign of success: time to detect and contain falls, measured in real incidents and in exercises.",
          },
          {
            titulo: "7. Measure, validate and repeat",
            texto:
              "Review the metrics each cycle, validate the architecture end to end with tests and “assume breach” exercises, and adjust priorities. Zero trust is continuous improvement, not a finish line.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "How to measure progress",
        colunas: ["Metric", "What it measures", "How to get it", "Sign of progress"],
        linhas: [
          [
            "Strong MFA coverage",
            "Who authenticates with more than one proof, preferably phishing-resistant",
            "IdP reports by user and method",
            "Administrators and remote access first; then everyone",
          ],
          [
            "Applications behind SSO and with conditional access",
            "How much of the portfolio uses the central IdP",
            "Application inventory cross-checked with the IdP",
            "The share rises; local accounts fall",
          ],
          [
            "Standing privileged accounts",
            "How many accounts keep power all the time",
            "Role assignments and vault or PAM data",
            "Falls as JIT covers the roles",
          ],
          [
            "Managed and compliant devices",
            "The share of the fleet that reports a trustworthy posture",
            "MDM and EDR",
            "Rises; sensitive data only from compliant devices",
          ],
          [
            "Time to detect and contain",
            "How fast an incident is noticed and contained",
            "SIEM, incident records and exercises",
            "Falls over the cycles",
          ],
          [
            "Segmentation and allowed traffic",
            "How much east-west traffic is only what is needed",
            "Network rules and flow logs",
            "Broad (“any”) rules decrease",
          ],
          [
            "Access reviews with removals applied",
            "Whether privilege cleanup actually happens",
            "Review campaigns (see Q119)",
            "There are effective removals, not just approvals",
          ],
          [
            "Legacy applications protected",
            "How much of the legacy got a proxy, segmentation or an exit plan",
            "Legacy inventory",
            "None directly exposed",
          ],
        ],
        nota: "Absolute targets depend on the organization; what matters is the trend and the link between each metric and a reduced risk. Maturity models (such as CISA’s) describe stages, from traditional to optimal, per pillar: use one to assess and compare, and check the current version of the document.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Order and scale",
        texto:
          "Golden order: **identity first, then device, then application, then network and data**, always starting with the most critical. **Small organization**: use the cloud IdP and managed services (SSO, MFA, conditional access, managed EDR) and you are well on your way, without a large team. **Large or multinational organization**: a program with central governance, a reference architecture and policy as code, rolled out in waves (by business unit or application), with regional variations for data laws and latency. **Maturity**: assess per pillar, set the target stage for each and review in cycles.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Legacy, resistance and what not to do",
        texto:
          "Applications that speak neither SSO nor MFA sit behind an **identity proxy or ZTNA**, segmented, administered through PAM, with a retirement plan and documented compensating controls; do **not** leave them as an eternal exception. Against people’s **resistance**, start with the quick wins that cause little friction, use report-only mode, run pilots, explain the reason and measure the experience. Avoid the “big bang”: buying a “zero trust” platform and switching everything on at once usually breaks the business and loses sponsorship.",
      },
    ],
    armadilhas: [
      "Buying a platform and declaring victory: zero trust is a strategy, and a tool without inventory and policy does not solve it.",
      "Starting with the network (full microsegmentation) before consolidating identity: without a trustworthy IdP, there is nothing to decide with.",
      "Measuring activity (how many projects, how many licenses) instead of outcome (MFA coverage, standing privileged accounts, time to detect).",
      "Treating legacy as an exception with no deadline: it becomes the easiest path for an attacker.",
    ],
    autoteste: [
      {
        pergunta: "Where do you start, and why?",
        resposta:
          "With inventory and identity (SSO and MFA, starting with administrators and remote access), because almost every zero trust decision depends on knowing who accesses what. Next, whatever is most critical, choosing quick wins that cut a lot of risk with little friction.",
      },
      {
        pergunta: "Name metrics to show progress to the board.",
        resposta:
          "Strong MFA coverage, applications behind SSO and conditional access, standing privileged accounts, compliant devices, and time to detect and contain. Show the trend and tie each one to a risk reduced.",
      },
    ],
  },
};
