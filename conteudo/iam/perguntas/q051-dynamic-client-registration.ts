import type { Pergunta } from "../../tipos";

// Q51 · Dynamic Client Registration
export const q051: Pergunta = {
  numero: 51,
  modulo: "oidc",
  metodo: "feynman",
  pt: {
    titulo: "Dynamic Client Registration",
    pergunta:
      "O que é o Dynamic Client Registration do OIDC (RFC 7591) e quando faz sentido usá-lo? Que riscos ele traz?",
    porqueEsteMetodo:
      "O registro dinâmico é um “cadastro sem balcão”, e uma analogia de credenciamento deixa visível o que muda: quem cadastra, quem confia em quem e onde o controle precisa voltar.",
    resposta30s:
      "O **Dynamic Client Registration** (RFC 7591) deixa um cliente **se registrar sozinho por API**: ele envia seus metadados (`redirect_uris`, `client_name`, método de autenticação) ao `registration_endpoint` e recebe um `client_id` (e, às vezes, segredo e `registration_access_token`). Faz sentido com **muitos clientes, ou clientes desconhecidos de antemão** (ecossistemas abertos, plataformas com muitas integrações, servidores MCP); para poucos clientes conhecidos, o cadastro manual é mais seguro. O risco é o **abuso**: registro em massa, `redirect_uris` maliciosos e falsificação de identidade, controlados com token inicial, validação, limites e aprovação.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Pense no credenciamento de uma feira de negócios. No modelo manual, cada expositor liga para a organização, preenche uma ficha e espera alguém cadastrá-lo. No modelo automático há um quiosque de autoatendimento: o expositor informa os dados da empresa e recebe na hora o crachá, com um número de identificação. A organização decide quem pode usar o quiosque (só quem tem convite?), confere os dados que importam e pode exigir uma aprovação antes de liberar áreas sensíveis.",
        tecnico:
          "O **Dynamic Client Registration** (RFC 7591, com uma versão específica para o OIDC) permite que um cliente se **registre por API** no servidor de autorização. O cliente envia um `POST` ao `registration_endpoint` (anunciado no documento de descoberta, veja Q45) com seus **metadados**: `redirect_uris`, `client_name`, `grant_types`, `response_types`, `token_endpoint_auth_method`, `scope`, chaves públicas ou `jwks_uri` e, opcionalmente, uma `software_statement`, um JWT assinado que atesta os metadados. A resposta (201) traz o `client_id` e, se for o caso, o `client_secret`. Nas implementações que seguem o gerenciamento da RFC 7592 e o OIDC DCR, vêm também o `registration_access_token` e o `registration_client_uri`, com os quais o cliente lê, atualiza ou remove o próprio cadastro. O endpoint pode ser aberto ou exigir um **token de acesso inicial**, que define quem pode registrar.",
        limite:
          "O quiosque emite o crachá, mas **não prova quem é o expositor**: qualquer um pode se declarar “Banco Exemplo”, com logotipo e tudo. Um `client_id` recém-criado não é confiança; a confiança tem de vir de outro lugar (token inicial, `software_statement`, aprovação, política). E o crachá sozinho não abre portas: escopos, consentimento do usuário e políticas do servidor continuam valendo.",
      },
      {
        tipo: "tabela",
        titulo: "Cadastro manual × registro dinâmico",
        colunas: ["Aspecto", "Cadastro manual", "Registro dinâmico (DCR)"],
        linhas: [
          ["Quem cadastra", "Um administrador, num console ou por pedido", "O próprio cliente, por API, na hora"],
          ["Escala", "Poucos clientes conhecidos", "Muitos clientes, ou clientes desconhecidos de antemão"],
          [
            "Controle",
            "Total: alguém revisa cada cliente",
            "Depende dos controles que você impõe (token inicial, validação, aprovação)",
          ],
          [
            "Principal risco",
            "Lentidão e trabalho operacional",
            "Abuso: registro em massa, clientes maliciosos, falsificação de identidade",
          ],
          [
            "Quando faz sentido",
            "Aplicações internas, ambientes regulados, parceiros contratados",
            "Ecossistemas abertos, plataformas com muitas integrações, clientes de servidores MCP que não conhecem o servidor de antemão (confira a especificação vigente)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Pedido de registro",
        legenda: "HTTP",
        codigo:
          'POST /register HTTP/1.1\nHost: id.example.com\nContent-Type: application/json\nAuthorization: Bearer <token de acesso inicial>\n\n{\n  "client_name": "App de Exemplo",\n  "redirect_uris": ["https://app.example.com/callback"],\n  "grant_types": ["authorization_code"],\n  "response_types": ["code"],\n  "token_endpoint_auth_method": "none"\n}',
        nota: "O `token_endpoint_auth_method` igual a `none` descreve um cliente público, que usa PKCE; clientes confidenciais declaram outro método de autenticação. O token inicial é opcional e depende da política do servidor.",
      },
      {
        tipo: "codigo",
        titulo: "Resposta (201 Created)",
        legenda: "JSON",
        codigo:
          '{\n  "client_id": "s6BhdRkqt3",\n  "client_id_issued_at": 1760000000,\n  "client_name": "App de Exemplo",\n  "redirect_uris": ["https://app.example.com/callback"],\n  "registration_access_token": "<token>",\n  "registration_client_uri": "https://id.example.com/register/s6BhdRkqt3"\n}',
        nota: "O `registration_access_token` é um segredo do cliente: guarde-o com o mesmo cuidado do `client_secret`. Ele autoriza gerenciar este cliente (RFC 7592), não registrar outros.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Riscos e controles",
        texto:
          "O registro aberto é uma porta que qualquer um pode usar. **Riscos:** registro em massa (encher a base, esgotar quotas, negar serviço); `redirect_uris` maliciosos, que levam a roubo de código e tokens; **falsificação de identidade** (nome e logotipo de outra marca na tela de consentimento); e **SSRF**, porque o servidor passa a buscar URLs que o cliente informa (`jwks_uri`, `logo_uri`, `sector_identifier_uri`). **Controles:** exigir um token de acesso inicial ou uma `software_statement` de emissor confiável; validar os `redirect_uris` (HTTPS, sem curingas, comparação exata depois); limitar a taxa por origem; mostrar sempre o consentimento aos clientes dinâmicos e sinalizar os não verificados; pedir aprovação para escopos sensíveis; expirar clientes sem uso; e proteger as buscas de URL contra SSRF.",
      },
    ],
    armadilhas: [
      "Deixar o registro aberto à internet sem token inicial, limite de taxa ou expiração: abre caminho para registro em massa, base poluída e clientes fantasma.",
      "Aceitar `redirect_uris` sem validar (curingas, `http://`, esquemas perigosos): é a porta para o roubo de códigos e tokens.",
      "Tratar um cliente registrado dinamicamente como confiável: pular o consentimento ou deixá-lo usar o nome e o logotipo de outra marca vira phishing com tela legítima.",
      "Buscar URLs fornecidas pelo cliente (`jwks_uri`, `logo_uri`, `sector_identifier_uri`) sem proteção: o servidor passa a fazer requisições para onde o atacante mandar (SSRF).",
    ],
    autoteste: [
      {
        pergunta: "Quando o cadastro manual de clientes é melhor que o registro dinâmico?",
        resposta:
          "Quando há poucos clientes conhecidos, como aplicações internas e parceiros contratados, ou quando o ambiente é regulado e cada cliente precisa ser revisado. O custo operacional é pequeno e o controle é total.",
      },
      {
        pergunta: "Para que serve o `registration_access_token` e como ele difere do token de acesso inicial?",
        resposta:
          "O `registration_access_token` vem na resposta do registro e permite ao cliente ler, atualizar ou remover o próprio cadastro. O token de acesso inicial, ao contrário, é entregue antes e autoriza quem pode criar um registro novo.",
      },
    ],
  },
  en: {
    titulo: "Dynamic Client Registration",
    pergunta:
      "What is OIDC Dynamic Client Registration (RFC 7591), and when does it make sense to use it? What risks does it bring?",
    porqueEsteMetodo:
      "Dynamic registration is “registration without a front desk”, and an accreditation analogy makes visible what changes: who registers, who trusts whom and where control must come back in.",
    resposta30s:
      "**Dynamic Client Registration** (RFC 7591) lets a client **register itself through an API**: it sends its metadata (`redirect_uris`, `client_name`, authentication method) to the `registration_endpoint` and receives a `client_id` (and sometimes a secret and a `registration_access_token`). It makes sense with **many clients, or clients unknown in advance** (open ecosystems, platforms with many integrations, MCP servers); for a few known clients, manual registration is safer. The risk is **abuse**: mass registration, malicious `redirect_uris` and identity spoofing, controlled with an initial token, validation, limits and approval.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "Think of the accreditation desk at a trade fair. In the manual model, each exhibitor calls the organizers, fills in a form and waits for someone to register them. In the automatic model there is a self-service kiosk: the exhibitor enters the company’s details and gets a badge on the spot, with an ID number. The organizers decide who may use the kiosk (only people with an invitation?), check the details that matter and may require approval before opening sensitive areas.",
        tecnico:
          "**Dynamic Client Registration** (RFC 7591, with an OIDC-specific version) lets a client **register through an API** with the authorization server. The client sends a `POST` to the `registration_endpoint` (advertised in the discovery document, see Q45) with its **metadata**: `redirect_uris`, `client_name`, `grant_types`, `response_types`, `token_endpoint_auth_method`, `scope`, public keys or `jwks_uri` and, optionally, a `software_statement`, a signed JWT that vouches for the metadata. The response (201) carries the `client_id` and, where applicable, the `client_secret`. In implementations that follow the management protocol of RFC 7592 and OIDC DCR, it also carries the `registration_access_token` and the `registration_client_uri`, with which the client reads, updates or removes its own registration. The endpoint can be open or require an **initial access token**, which defines who may register.",
        limite:
          "The kiosk issues the badge but **does not prove who the exhibitor is**: anyone can claim to be “Example Bank”, logo and all. A freshly created `client_id` is not trust; trust must come from elsewhere (initial token, `software_statement`, approval, policy). And the badge alone does not open doors: scopes, user consent and server policies still apply.",
      },
      {
        tipo: "tabela",
        titulo: "Manual registration × dynamic registration",
        colunas: ["Aspect", "Manual registration", "Dynamic registration (DCR)"],
        linhas: [
          [
            "Who registers",
            "An administrator, in a console or on request",
            "The client itself, through an API, on the spot",
          ],
          ["Scale", "A few known clients", "Many clients, or clients unknown in advance"],
          [
            "Control",
            "Total: someone reviews each client",
            "Depends on the controls you impose (initial token, validation, approval)",
          ],
          [
            "Main risk",
            "Slowness and operational work",
            "Abuse: mass registration, malicious clients, identity spoofing",
          ],
          [
            "When it makes sense",
            "Internal applications, regulated environments, contracted partners",
            "Open ecosystems, platforms with many integrations, MCP server clients that do not know the server in advance (check the current specification)",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Registration request",
        legenda: "HTTP",
        codigo:
          'POST /register HTTP/1.1\nHost: id.example.com\nContent-Type: application/json\nAuthorization: Bearer <initial access token>\n\n{\n  "client_name": "Example App",\n  "redirect_uris": ["https://app.example.com/callback"],\n  "grant_types": ["authorization_code"],\n  "response_types": ["code"],\n  "token_endpoint_auth_method": "none"\n}',
        nota: "A `token_endpoint_auth_method` of `none` describes a public client, which uses PKCE; confidential clients declare another authentication method. The initial token is optional and depends on the server’s policy.",
      },
      {
        tipo: "codigo",
        titulo: "Response (201 Created)",
        legenda: "JSON",
        codigo:
          '{\n  "client_id": "s6BhdRkqt3",\n  "client_id_issued_at": 1760000000,\n  "client_name": "Example App",\n  "redirect_uris": ["https://app.example.com/callback"],\n  "registration_access_token": "<token>",\n  "registration_client_uri": "https://id.example.com/register/s6BhdRkqt3"\n}',
        nota: "The `registration_access_token` is a client secret: guard it with the same care as the `client_secret`. It authorizes managing this client (RFC 7592), not registering others.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Risks and controls",
        texto:
          "Open registration is a door anyone can use. **Risks:** mass registration (filling the database, exhausting quotas, denial of service); malicious `redirect_uris`, which lead to theft of codes and tokens; **identity spoofing** (another brand’s name and logo on the consent screen); and **SSRF**, because the server now fetches URLs the client supplies (`jwks_uri`, `logo_uri`, `sector_identifier_uri`). **Controls:** require an initial access token or a `software_statement` from a trusted issuer; validate the `redirect_uris` (HTTPS, no wildcards, exact comparison afterwards); rate-limit by origin; always show the consent screen to dynamic clients and flag unverified ones; require approval for sensitive scopes; expire unused clients; and protect URL fetches against SSRF.",
      },
    ],
    armadilhas: [
      "Leaving registration open to the internet with no initial token, rate limit or expiry: it invites mass registration, a polluted database and ghost clients.",
      "Accepting `redirect_uris` without validation (wildcards, `http://`, dangerous schemes): it is the door to theft of codes and tokens.",
      "Treating a dynamically registered client as trusted: skipping consent, or letting it use another brand’s name and logo, becomes phishing with a legitimate screen.",
      "Fetching client-supplied URLs (`jwks_uri`, `logo_uri`, `sector_identifier_uri`) without protection: the server starts making requests wherever the attacker points (SSRF).",
    ],
    autoteste: [
      {
        pergunta: "When is manual client registration better than dynamic registration?",
        resposta:
          "When there are few known clients, such as internal applications and contracted partners, or when the environment is regulated and each client must be reviewed. The operational cost is small and control is total.",
      },
      {
        pergunta: "What is the `registration_access_token` for, and how does it differ from the initial access token?",
        resposta:
          "The `registration_access_token` comes in the registration response and lets the client read, update or remove its own registration. The initial access token, by contrast, is handed out beforehand and authorizes who may create a new registration.",
      },
    ],
  },
};
