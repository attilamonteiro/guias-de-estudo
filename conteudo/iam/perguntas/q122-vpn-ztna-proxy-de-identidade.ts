import type { Pergunta } from "../../tipos";

// Q122 · VPN × ZTNA × proxy de identidade
export const q122: Pergunta = {
  numero: 122,
  modulo: "autorizacao",
  metodo: "compare",
  pt: {
    titulo: "VPN × ZTNA × proxy de identidade",
    pergunta:
      "Compare VPN tradicional, ZTNA, proxy consciente de identidade (IAP) e reverse proxy para acesso remoto. Quando cada um é adequado e como protegem aplicações legadas?",
    porqueEsteMetodo:
      "VPN, ZTNA, IAP e reverse proxy se misturam na conversa, e a diferença está no que cada um verifica e no que expõe. A matriz coloca os quatro lado a lado, e a regra de decisão diz quando cada um cabe.",
    resposta30s:
      "A **VPN** coloca o dispositivo dentro da rede e, depois do login, costuma dar **confiança implícita** a tudo o que está lá. **ZTNA** e **proxy consciente de identidade (IAP)** dão acesso **por aplicação**, verificando identidade, dispositivo e contexto, e mantêm os aplicativos fora da internet. O **reverse proxy** é a peça de infraestrutura que fica na frente dos servidores; só vira IAP quando passa a autenticar e autorizar cada requisição.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Quatro formas de dar acesso remoto",
        colunas: ["Critério", "VPN tradicional", "ZTNA", "Proxy consciente de identidade (IAP)", "Reverse proxy"],
        linhas: [
          [
            "Unidade de acesso",
            "A rede (ou sub-rede) inteira",
            "Uma aplicação ou serviço por vez, para aquele usuário",
            "Uma aplicação web, por requisição",
            "O backend atrás dele, sem noção de usuário por padrão",
          ],
          [
            "Quando a identidade é verificada",
            "No login do túnel; depois, confiança implícita",
            "A cada conexão ou sessão, com reavaliação",
            "A cada requisição (cookie ou token assinado)",
            "Não é, a menos que se configure autenticação",
          ],
          [
            "O que fica exposto",
            "O gateway da VPN, na internet",
            "Nada do aplicativo: conectores abrem conexões de saída para o serviço",
            "Só o proxy; os aplicativos ficam atrás",
            "Só o proxy; os backends ficam escondidos",
          ],
          [
            "Dispositivo e contexto",
            "Possível, mas limitado",
            "Nativo (agente e sinais do IdP)",
            "Via acesso condicional do IdP",
            "Normalmente não",
          ],
          [
            "Aplicação legada",
            "Funciona com qualquer protocolo, ao custo de acesso amplo",
            "Cobre web e, com agente ou conector, protocolos não web (RDP, SSH, bancos)",
            "Ótimo para web legado sem SSO: o proxy autentica e repassa a identidade; difícil para não web",
            "Fachada para web legado (TLS, balanceamento, WAF), mas sem identidade",
          ],
          [
            "Quando escolher",
            "Transição, ou quando a rede inteira é mesmo necessária",
            "Padrão para acesso remoto a aplicações, web e não web",
            "Aplicações web internas e legadas",
            "Publicar e proteger serviços; base para um IAP",
          ],
        ],
        nota: "Exemplos de produtos de IAP e ZTNA, sem ranking (o mercado muda; confira a documentação de cada fornecedor): Google Cloud IAP, Cloudflare Access, Microsoft Entra Application Proxy, Zscaler Private Access e, em código aberto, Pomerium e oauth2-proxy.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Aplicação web com IdP: **IAP ou ZTNA, por aplicação**. SSH, RDP e bancos: ZTNA com conector ou um bastion com sessão gravada (veja Q118). **VPN**: só como transição ou quando a rede inteira é mesmo necessária (ligação entre sites), com segmentação e MFA. **Reverse proxy**: use sempre que publicar um serviço, mas não o chame de controle de acesso até ele verificar identidade a cada requisição. A ideia de fundo do ZTNA é o **software-defined perimeter**: a infraestrutura fica invisível até que identidade e dispositivo sejam verificados, e só então se abre uma conexão individual para a aplicação autorizada. No trabalho remoto, isso troca “estar na rede” por “ter direito a esta aplicação, agora”.",
      },
      {
        tipo: "codigo",
        titulo: "O backend não confia em cabeçalho solto",
        legenda: "HTTP",
        codigo: `# Pelo proxy: ele autenticou a pessoa no IdP e assinou a afirmação de identidade
GET /relatorios HTTP/1.1
Host: erp.interno.example
X-Identity-Assertion: eyJhbGciOiJFUzI1NiIsImtpZCI6InByb3h5LTEifQ...

# Direto ao backend, com um cabeçalho forjado: recusado
GET /relatorios HTTP/1.1
Host: erp.interno.example
X-User: admin

HTTP/1.1 401 Unauthorized`,
        nota: "Antes de usar a identidade, o backend confere a assinatura com a chave publicada do proxy (algoritmo fixo), o emissor (`iss`), a audiência (`aud`) e a validade (`exp`), e só aceita conexões vindas do proxy. O nome do cabeçalho varia por produto (por exemplo, `X-Goog-IAP-JWT-Assertion` no IAP do Google Cloud e `Cf-Access-Jwt-Assertion` no Cloudflare Access); confira a documentação.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Três armadilhas",
        texto:
          "**Túnel com confiança implícita**: depois de conectada, a VPN (ou um ZTNA com regra “qualquer destino”) abre caminho lateral para tudo. **Proxy sem identidade por requisição**: se o backend aceita um cabeçalho como `X-User` sem validar assinatura, ou continua alcançável sem passar pelo proxy, qualquer um se passa por outra pessoa. **Legado sem suporte a SSO**: não deixe a aplicação aberta “porque o proxy já autenticou”; proteja o caminho entre o proxy e o backend e use sessões curtas.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Legado e desafios de implantação",
        texto:
          "Para um ERP legado sem SSO: tire-o da exposição direta, coloque um IAP ou ZTNA na frente (o proxy faz o login no IdP e repassa a identidade por cabeçalho assinado ou sessão), segmente o servidor, administre-o por PAM (veja Q118), registre os acessos e modernize por etapas. Desafios do ZTNA: inventariar aplicações e fluxos, protocolos que não são web (e fluxos iniciados pelo servidor), distribuir e manter o agente (e o BYOD), definir políticas por aplicação, latência e disponibilidade do broker, e conviver com a VPN durante a migração. A VPN pode continuar como transporte cifrado, desde que não conceda confiança implícita: segmentação, postura do dispositivo e acesso por aplicação seguem valendo.",
      },
    ],
    armadilhas: [
      "Chamar de zero trust uma VPN com MFA: autentica na entrada e depois confia em tudo.",
      "Publicar a aplicação por um proxy e deixar o backend alcançável diretamente (por IP ou outra rota): o controle é contornado.",
      "Aceitar cabeçalho de identidade sem validar assinatura, emissor e audiência.",
      "Migrar tudo de uma vez: sem inventário de aplicações e protocolos, o ZTNA quebra o que o legado usa, e a VPN volta como solução de emergência.",
    ],
    autoteste: [
      {
        pergunta: "Em que um IAP difere de um reverse proxy comum?",
        resposta:
          "O reverse proxy encaminha requisições e pode terminar TLS, balancear carga e filtrar. O IAP faz isso e ainda autentica com o IdP e autoriza **cada requisição**, repassando uma identidade verificável ao backend. Sem a verificação de identidade, é só um reverse proxy.",
      },
      {
        pergunta: "Por que a VPN tradicional não basta para zero trust?",
        resposta:
          "Porque dá acesso à rede e depois confia no que está dentro: uma credencial roubada abre caminho lateral para tudo. ZTNA e IAP restringem o acesso à aplicação, reavaliam identidade e dispositivo e mantêm as aplicações fora da internet.",
      },
    ],
  },
  en: {
    titulo: "VPN vs ZTNA vs identity-aware proxy",
    pergunta:
      "Compare traditional VPN, ZTNA, identity-aware proxy (IAP) and reverse proxy for remote access. When is each appropriate, and how do they protect legacy applications?",
    porqueEsteMetodo:
      "VPN, ZTNA, IAP and reverse proxy get mixed up in conversation, and the difference lies in what each one verifies and what it exposes. The matrix puts the four side by side, and the decision rule says when each one fits.",
    resposta30s:
      "A **VPN** puts the device inside the network and, after login, usually gives **implicit trust** to everything there. **ZTNA** and the **identity-aware proxy (IAP)** give access **per application**, verifying identity, device and context, and keep the applications off the internet. The **reverse proxy** is the infrastructure piece that sits in front of servers; it only becomes an IAP when it starts to authenticate and authorize every request.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "Four ways to give remote access",
        colunas: ["Criterion", "Traditional VPN", "ZTNA", "Identity-aware proxy (IAP)", "Reverse proxy"],
        linhas: [
          [
            "Unit of access",
            "The whole network (or subnet)",
            "One application or service at a time, for that user",
            "One web application, per request",
            "The backend behind it, with no notion of a user by default",
          ],
          [
            "When identity is verified",
            "At tunnel login; afterwards, implicit trust",
            "On every connection or session, with reevaluation",
            "On every request (cookie or signed token)",
            "It is not, unless authentication is configured",
          ],
          [
            "What is exposed",
            "The VPN gateway, on the internet",
            "Nothing of the application: connectors open outbound connections to the service",
            "Only the proxy; the applications stay behind it",
            "Only the proxy; the backends stay hidden",
          ],
          [
            "Device and context",
            "Possible, but limited",
            "Native (agent and IdP signals)",
            "Through the IdP’s conditional access",
            "Normally not",
          ],
          [
            "Legacy application",
            "Works with any protocol, at the cost of broad access",
            "Covers web and, with an agent or connector, non-web protocols (RDP, SSH, databases)",
            "Great for legacy web without SSO: the proxy authenticates and passes the identity along; hard for non-web",
            "A front for legacy web (TLS, balancing, WAF), but with no identity",
          ],
          [
            "When to choose it",
            "Transition, or when the whole network is truly needed",
            "The default for remote access to applications, web and non-web",
            "Internal and legacy web applications",
            "Publishing and protecting services; the basis for an IAP",
          ],
        ],
        nota: "Examples of IAP and ZTNA products, with no ranking (the market changes; check each vendor’s documentation): Google Cloud IAP, Cloudflare Access, Microsoft Entra Application Proxy, Zscaler Private Access and, open source, Pomerium and oauth2-proxy.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Web application with an IdP: **IAP or ZTNA, per application**. SSH, RDP and databases: ZTNA with a connector or a bastion with recorded sessions (see Q118). **VPN**: only as a transition or when the whole network is truly needed (site-to-site links), with segmentation and MFA. **Reverse proxy**: use it whenever you publish a service, but do not call it access control until it verifies identity on every request. The idea behind ZTNA is the **software-defined perimeter**: the infrastructure stays invisible until identity and device are verified, and only then is an individual connection opened to the authorized application. For remote work, this swaps “being on the network” for “having the right to this application, now”.",
      },
      {
        tipo: "codigo",
        titulo: "The backend does not trust a loose header",
        legenda: "HTTP",
        codigo: `# Through the proxy: it authenticated the person at the IdP and signed the identity assertion
GET /reports HTTP/1.1
Host: erp.internal.example
X-Identity-Assertion: eyJhbGciOiJFUzI1NiIsImtpZCI6InByb3h5LTEifQ...

# Straight to the backend, with a forged header: refused
GET /reports HTTP/1.1
Host: erp.internal.example
X-User: admin

HTTP/1.1 401 Unauthorized`,
        nota: "Before using the identity, the backend checks the signature with the proxy’s published key (fixed algorithm), the issuer (`iss`), the audience (`aud`) and the expiry (`exp`), and only accepts connections coming from the proxy. The header name varies by product (for example, `X-Goog-IAP-JWT-Assertion` in Google Cloud IAP and `Cf-Access-Jwt-Assertion` in Cloudflare Access); check the documentation.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Three traps",
        texto:
          "**A tunnel with implicit trust**: once connected, the VPN (or a ZTNA with an “any destination” rule) opens a lateral path to everything. **A proxy with no per-request identity**: if the backend accepts a header such as `X-User` without validating a signature, or is still reachable without going through the proxy, anyone can pose as someone else. **Legacy with no SSO support**: do not leave the application open “because the proxy already authenticated”; protect the path between the proxy and the backend and use short sessions.",
      },
      {
        tipo: "destaque",
        variante: "dica",
        titulo: "Legacy and deployment challenges",
        texto:
          "For a legacy ERP with no SSO: take it off direct exposure, put an IAP or ZTNA in front (the proxy does the IdP login and passes the identity along in a signed header or a session), segment the server, administer it through PAM (see Q118), log the accesses and modernize in stages. ZTNA challenges: inventorying applications and flows, non-web protocols (and server-initiated flows), rolling out and maintaining the agent (and BYOD), defining per-application policies, broker latency and availability, and living with the VPN during migration. The VPN may remain as an encrypted transport, as long as it does not grant implicit trust: segmentation, device posture and per-application access still apply.",
      },
    ],
    armadilhas: [
      "Calling a VPN with MFA zero trust: it authenticates at the door and then trusts everything.",
      "Publishing the application through a proxy and leaving the backend directly reachable (by IP or another route): the control is bypassed.",
      "Accepting an identity header without validating signature, issuer and audience.",
      "Migrating everything at once: with no inventory of applications and protocols, ZTNA breaks what the legacy relies on, and the VPN comes back as an emergency fix.",
    ],
    autoteste: [
      {
        pergunta: "How does an IAP differ from an ordinary reverse proxy?",
        resposta:
          "A reverse proxy forwards requests and can terminate TLS, balance load and filter. An IAP does that and also authenticates with the IdP and authorizes **every request**, passing a verifiable identity to the backend. Without the identity check, it is just a reverse proxy.",
      },
      {
        pergunta: "Why is a traditional VPN not enough for zero trust?",
        resposta:
          "Because it gives access to the network and then trusts whatever is inside: a stolen credential opens a lateral path to everything. ZTNA and IAP restrict access to the application, reevaluate identity and device and keep applications off the internet.",
      },
    ],
  },
};
