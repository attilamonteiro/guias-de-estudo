import type { Pergunta } from "../../tipos";

// Q121 · Arquitetura zero trust
export const q121: Pergunta = {
  numero: 121,
  modulo: "autorizacao",
  metodo: "design",
  pt: {
    titulo: "Arquitetura zero trust",
    pergunta:
      "Como seria uma arquitetura de zero trust centrada em identidade? Descreva os componentes (policy engine, policy administrator, PEP, sinais) e como uma requisição é decidida.",
    porqueEsteMetodo:
      "A arquitetura zero trust é um desenho de sistema com peças bem definidas pelo NIST. O roteiro leva dos requisitos aos componentes, à decisão por requisição e aos gargalos (disponibilidade e latência do motor de política), que é onde o desenho costuma falhar.",
    resposta30s:
      "Uma arquitetura zero trust centrada em identidade separa **quem decide** de **quem aplica**: o **policy engine** decide, o **policy administrator** abre ou fecha o caminho da sessão e o **PEP** (ponto de aplicação) fica na frente do recurso. A decisão usa **sinais** do IdP, do dispositivo, de risco e da telemetria, é tomada **por requisição ou sessão** e reavaliada quando os sinais mudam. O ponto crítico do projeto é a **disponibilidade e a latência do PDP** e a escolha entre falhar aberto ou fechado.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "Proteger **recursos** (aplicações, APIs, dados, cargas de trabalho) onde quer que estejam, com decisão por requisição, política única e auditável, sem depender da rede interna. Funcionar com nuvem, SaaS e legado, com disponibilidade e latência aceitáveis. Benefícios buscados: menor raio de explosão, visibilidade, políticas consistentes e acesso remoto sem VPN ampla.",
          },
          {
            titulo: "2. Componentes (NIST SP 800-207)",
            texto:
              "O **policy engine (PE)** decide conceder, negar ou revogar; o **policy administrator (PA)** executa a decisão, estabelecendo ou encerrando o caminho entre sujeito e recurso (por exemplo, emitindo credenciais ou tokens de sessão); o **policy enforcement point (PEP)** fica em linha, habilita, monitora e encerra a conexão. PE e PA juntos formam o **policy decision point (PDP)** (veja Q114).",
          },
          {
            titulo: "3. Fontes de sinal",
            texto:
              "**IdP** (identidade, força e idade da autenticação, grupos), **gestão de dispositivos e EDR** (postura), **risco** (anomalias de login, credencial vazada), **telemetria e SIEM**, inteligência de ameaças e **classificação do recurso**. O IdP é central: prova quem é a pessoa e aplica o acesso condicional (veja Q123); por isso é um alvo e exige alta disponibilidade e proteção reforçada.",
          },
          {
            titulo: "4. A decisão: por requisição e por sessão",
            texto:
              "O PEP consulta o PDP a cada acesso (ou a cada sessão curta, com reavaliação por eventos). O resultado não é só permitir ou negar: pode exigir autenticação mais forte (veja Q99), limitar a sessão ou revogá-la quando um sinal muda.",
          },
          {
            titulo: "5. Onde aplicar: nuvem, SaaS, legado",
            texto:
              "**Nuvem e cloud-native**: identidade de carga de trabalho, credenciais curtas, mTLS entre serviços e política por serviço (veja Q14 e Q84). **SaaS**: SSO e acesso condicional no IdP, provisionamento (SCIM) e menor privilégio no aplicativo. **Multi-cloud**: um IdP federado e políticas como código, versionadas e distribuídas aos PDPs de cada nuvem. **Legado**: um proxy de identidade ou ZTNA na frente (veja Q122).",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "Como uma requisição é decidida",
        etapas: [
          "O sujeito (pessoa, dispositivo ou serviço) tenta acessar um recurso; o PEP, que está no caminho, intercepta o pedido",
          "O PEP envia ao PDP o contexto: quem é, qual recurso e ação, estado do dispositivo e dados da rede",
          "O policy engine reúne os sinais (IdP, postura, risco, sensibilidade do recurso) e aplica a política",
          "A decisão sai: permitir, negar ou permitir com condições (autenticação mais forte, sessão limitada, somente leitura)",
          "O policy administrator prepara o caminho: emite o token ou a credencial de curta duração e instrui o PEP",
          "O PEP encaminha a requisição ao recurso, que ainda aplica a sua autorização fina (veja Q115)",
          "Durante a sessão, se um sinal muda (dispositivo fora da conformidade, risco alto, conta desativada), o motor reavalia e o PEP encerra ou reduz o acesso",
        ],
        nota: "O NIST descreve variações de implantação (agente no dispositivo, gateway de enclave, portal de recursos, sandbox de aplicação); em todas, o PEP fica perto do recurso e o PDP decide.",
      },
      {
        tipo: "tabela",
        titulo: "Centrada em rede × centrada em identidade",
        colunas: ["Aspecto", "Centrada em rede", "Centrada em identidade"],
        linhas: [
          [
            "Unidade de confiança",
            "Segmento, VLAN, faixa de IP",
            "Pessoa, dispositivo ou carga de trabalho, com contexto",
          ],
          [
            "Onde a política é aplicada",
            "Firewalls, ACLs e microssegmentação",
            "PEP por aplicação ou API (proxy de identidade, gateway, token validado no serviço)",
          ],
          [
            "Regra típica",
            "“A origem 10.1.0.0/16 acessa a porta 443 do servidor X”",
            "“O grupo Financeiro, em dispositivo conforme e com autenticação forte, exporta relatórios do aplicativo Y”",
          ],
          ["Funciona em nuvem e SaaS?", "Mal: a rede não é sua", "Sim: a identidade acompanha o acesso"],
          [
            "Limite",
            "IP muda, NAT e redes compartilhadas escondem quem é quem",
            "Depende da qualidade dos sinais e da disponibilidade do IdP",
          ],
        ],
        nota: "As duas se complementam: a microssegmentação contém o dano e a identidade decide o acesso. O NIST cita as duas entre as abordagens de implantação.",
      },
      {
        tipo: "codigo",
        titulo: "Um pedido de decisão e a resposta",
        legenda: "JSON",
        codigo: `{
  "pedido": {
    "sujeito": { "usuario": "ana.souza", "grupos": ["financeiro"], "mfa": "passkey", "autenticou_ha_min": 12 },
    "dispositivo": { "gerenciado": true, "conforme": true, "disco_cifrado": true },
    "contexto": { "pais": "BR", "risco_de_login": "baixo", "rede": "desconhecida" },
    "recurso": { "aplicacao": "folha-de-pagamento", "sensibilidade": "alta", "acao": "exportar" }
  },
  "decisao": {
    "resultado": "permitir_com_condicoes",
    "condicoes": ["sessao_de_15_min", "sem_download_local"],
    "motivo": "dispositivo conforme e autenticação forte; ação sensível"
  }
}`,
        nota: "Formato ilustrativo, de nenhum produto específico. Há esforços de padronizar essa conversa entre PEP e PDP (por exemplo, o grupo AuthZEN, da OpenID Foundation); confira o estado atual.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Gargalos: disponibilidade, latência e falha aberta ou fechada",
        texto:
          "O PDP e o IdP viram **pontos únicos de falha** se forem mal projetados. Use réplicas em várias zonas, **política e decisões em cache local com validade curta** (por exemplo, um PDP embutido como sidecar) e revogação por eventos em vez de consulta a cada chamada. Defina **por recurso** o que acontece se o PDP não responde: dados sensíveis **falham fechados** (negam); serviços críticos para a operação podem **falhar abertos** só por decisão explícita, com controles compensatórios e alerta. Em redes de alta latência ou intermitentes, use tokens de curta duração com validade offline limitada, política embarcada no PEP local e sincronização quando a conexão volta.",
      },
    ],
    armadilhas: [
      "Desenhar só o PEP (um proxy) sem política, sinais e governança: vira uma VPN com outro nome.",
      "Confiar em sinal sem prová-lo: postura de dispositivo declarada pelo próprio dispositivo, sem atestação, vale pouco.",
      "Consultar o PDP de forma síncrona a cada chamada, sem cache nem réplica: a latência e a queda do PDP derrubam tudo.",
      "Esquecer que a autorização fina continua no recurso: o PEP decide o acesso à aplicação, não cada linha de dado (veja Q115).",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre policy engine, policy administrator e PEP?",
        resposta:
          "O policy engine decide (permitir, negar, revogar). O policy administrator executa a decisão, abrindo ou fechando o caminho da sessão e emitindo credenciais. O PEP fica no caminho do tráfego e aplica: habilita, monitora e encerra a conexão. PE e PA juntos formam o PDP.",
      },
      {
        pergunta: "O que fazer quando o PDP fica indisponível?",
        resposta:
          "Decidir antes, por recurso: falhar fechado para o que é sensível, e só falhar aberto, com controles compensatórios e alerta, quando a disponibilidade vale mais. Reduza a chance com réplicas, cache local de decisões de validade curta e política embarcada.",
      },
    ],
  },
  en: {
    titulo: "Zero trust architecture",
    pergunta:
      "What would an identity-centric zero trust architecture look like? Describe the components (policy engine, policy administrator, PEP, signals) and how a request is decided.",
    porqueEsteMetodo:
      "Zero trust architecture is a system design with pieces well defined by NIST. The script moves from requirements to components, to the per-request decision and to the bottlenecks (availability and latency of the policy engine), which is where designs usually fail.",
    resposta30s:
      "An identity-centric zero trust architecture separates **who decides** from **who enforces**: the **policy engine** decides, the **policy administrator** opens or closes the session path and the **PEP** (enforcement point) sits in front of the resource. The decision uses **signals** from the IdP, the device, risk and telemetry, is made **per request or session** and is reevaluated when signals change. The critical design point is the **availability and latency of the PDP** and the choice between failing open or closed.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "Protect **resources** (applications, APIs, data, workloads) wherever they are, with per-request decisions and a single, auditable policy, without depending on the internal network. Work with cloud, SaaS and legacy, with acceptable availability and latency. Benefits sought: smaller blast radius, visibility, consistent policies and remote access without a broad VPN.",
          },
          {
            titulo: "2. Components (NIST SP 800-207)",
            texto:
              "The **policy engine (PE)** decides to grant, deny or revoke; the **policy administrator (PA)** carries out the decision, establishing or ending the path between subject and resource (for example, issuing credentials or session tokens); the **policy enforcement point (PEP)** sits in line, enables, monitors and ends the connection. PE and PA together form the **policy decision point (PDP)** (see Q114).",
          },
          {
            titulo: "3. Signal sources",
            texto:
              "The **IdP** (identity, strength and age of authentication, groups), **device management and EDR** (posture), **risk** (login anomalies, leaked credentials), **telemetry and SIEM**, threat intelligence and **resource classification**. The IdP is central: it proves who the person is and applies conditional access (see Q123); that makes it a target and demands high availability and reinforced protection.",
          },
          {
            titulo: "4. The decision: per request and per session",
            texto:
              "The PEP consults the PDP on each access (or on each short session, with reevaluation by events). The result is not just allow or deny: it can require stronger authentication (see Q99), limit the session or revoke it when a signal changes.",
          },
          {
            titulo: "5. Where to apply: cloud, SaaS, legacy",
            texto:
              "**Cloud and cloud-native**: workload identity, short credentials, mTLS between services and per-service policy (see Q14 and Q84). **SaaS**: SSO and conditional access in the IdP, provisioning (SCIM) and least privilege in the application. **Multi-cloud**: a federated IdP and policy as code, versioned and distributed to the PDPs of each cloud. **Legacy**: an identity proxy or ZTNA in front (see Q122).",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "How a request is decided",
        etapas: [
          "The subject (person, device or service) tries to reach a resource; the PEP, which is in the path, intercepts the request",
          "The PEP sends the PDP the context: who it is, which resource and action, device state and network data",
          "The policy engine gathers the signals (IdP, posture, risk, resource sensitivity) and applies the policy",
          "The decision comes out: allow, deny or allow with conditions (stronger authentication, limited session, read-only)",
          "The policy administrator prepares the path: it issues the short-lived token or credential and instructs the PEP",
          "The PEP forwards the request to the resource, which still applies its own fine-grained authorization (see Q115)",
          "During the session, if a signal changes (device out of compliance, high risk, account disabled), the engine reevaluates and the PEP ends or reduces the access",
        ],
        nota: "NIST describes deployment variations (device agent, enclave gateway, resource portal, application sandbox); in all of them the PEP sits near the resource and the PDP decides.",
      },
      {
        tipo: "tabela",
        titulo: "Network-centric vs identity-centric",
        colunas: ["Aspect", "Network-centric", "Identity-centric"],
        linhas: [
          ["Unit of trust", "Segment, VLAN, IP range", "Person, device or workload, with context"],
          [
            "Where policy is enforced",
            "Firewalls, ACLs and microsegmentation",
            "A PEP per application or API (identity proxy, gateway, token validated in the service)",
          ],
          [
            "Typical rule",
            "“Source 10.1.0.0/16 reaches port 443 of server X”",
            "“The Finance group, on a compliant device with strong authentication, exports reports from application Y”",
          ],
          ["Works in cloud and SaaS?", "Poorly: the network is not yours", "Yes: identity travels with the access"],
          [
            "Limit",
            "IPs change, and NAT and shared networks hide who is who",
            "Depends on the quality of the signals and the availability of the IdP",
          ],
        ],
        nota: "The two complement each other: microsegmentation contains the damage and identity decides the access. NIST lists both among its deployment approaches.",
      },
      {
        tipo: "codigo",
        titulo: "A decision request and the response",
        legenda: "JSON",
        codigo: `{
  "request": {
    "subject": { "user": "ana.souza", "groups": ["finance"], "mfa": "passkey", "authenticated_min_ago": 12 },
    "device": { "managed": true, "compliant": true, "disk_encrypted": true },
    "context": { "country": "BR", "sign_in_risk": "low", "network": "unknown" },
    "resource": { "application": "payroll", "sensitivity": "high", "action": "export" }
  },
  "decision": {
    "result": "allow_with_conditions",
    "conditions": ["15_minute_session", "no_local_download"],
    "reason": "compliant device and strong authentication; sensitive action"
  }
}`,
        nota: "Illustrative format, not from any specific product. There are efforts to standardize this conversation between PEP and PDP (for example, the AuthZEN group at the OpenID Foundation); check the current state.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Bottlenecks: availability, latency and failing open or closed",
        texto:
          "The PDP and the IdP become **single points of failure** if poorly designed. Use replicas across zones, **policy and decisions cached locally with a short lifetime** (for example, a PDP embedded as a sidecar) and revocation by events instead of a lookup on every call. Define **per resource** what happens if the PDP does not answer: sensitive data **fails closed** (denies); services critical to operations may **fail open** only by explicit decision, with compensating controls and an alert. On high-latency or intermittent networks, use short-lived tokens with limited offline validity, policy embedded in the local PEP and synchronization when the connection returns.",
      },
    ],
    armadilhas: [
      "Designing only the PEP (a proxy) with no policy, signals or governance: it becomes a VPN under another name.",
      "Trusting a signal without proving it: device posture declared by the device itself, with no attestation, is worth little.",
      "Calling the PDP synchronously on every call, with no cache or replica: the PDP’s latency and outages take everything down.",
      "Forgetting that fine-grained authorization stays in the resource: the PEP decides access to the application, not each row of data (see Q115).",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between the policy engine, the policy administrator and the PEP?",
        resposta:
          "The policy engine decides (allow, deny, revoke). The policy administrator carries out the decision, opening or closing the session path and issuing credentials. The PEP sits in the traffic path and enforces: it enables, monitors and ends the connection. PE and PA together form the PDP.",
      },
      {
        pergunta: "What do you do when the PDP becomes unavailable?",
        resposta:
          "Decide in advance, per resource: fail closed for what is sensitive, and fail open only, with compensating controls and an alert, where availability matters more. Reduce the chance with replicas, locally cached decisions with a short lifetime and embedded policy.",
      },
    ],
  },
};
