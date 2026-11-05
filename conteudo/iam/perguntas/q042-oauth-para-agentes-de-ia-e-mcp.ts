import type { Pergunta } from "../../tipos";

// Q42 · OAuth para agentes de IA e MCP
export const q042: Pergunta = {
  numero: 42,
  modulo: "oauth",
  metodo: "design",
  pt: {
    titulo: "OAuth para agentes de IA e MCP",
    pergunta:
      "Como um agente de IA ou servidor MCP deve usar OAuth para agir em nome do usuário? Que riscos novos aparecem (prompt injection, escopo excessivo) e como mitigá-los?",
    porqueEsteMetodo:
      "É um problema de projeto novo sobre peças conhecidas: papéis, fluxo de autorização, cadeia de chamadas e controles. Um roteiro fixo evita misturar o que o OAuth já resolve com o que a IA acrescenta de risco.",
    resposta30s:
      "O agente (cliente MCP) é o **client OAuth** e o servidor MCP é o **resource server**: o usuário autoriza por **authorization code com PKCE**, o cliente descobre o authorization server pelos **metadados do recurso**, pede o token com o parâmetro `resource` e cada servidor só aceita tokens com a **sua audiência**, sem repassá-los adiante. O risco novo é que **texto não confiável** (uma página, um e-mail) pode induzir o agente a agir com a autoridade do usuário (**prompt injection**), e um token amplo multiplica o estrago. Por isso: menor privilégio, tokens curtos, consentimento por ação sensível, validação no servidor e auditoria.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Requisitos",
            texto:
              "O agente (um aplicativo de IA ou assistente) precisa chamar ferramentas e dados do usuário em servidores MCP ou APIs, **em nome do usuário**, com o mínimo de poder e com rastro de quem fez o quê. Decida primeiro se o agente age **como o usuário** (delegação) ou **como ele mesmo** (identidade de serviço, com client credentials).",
          },
          {
            titulo: "2. Papéis",
            texto:
              "O agente (aplicação host e cliente MCP) é o **client OAuth**; o servidor MCP é o **resource server**; o authorization server é separado (o provedor de identidade da empresa, por exemplo). O servidor MCP valida tokens como qualquer API (veja Q40).",
          },
          {
            titulo: "3. Autorização do usuário",
            texto:
              "Authorization code com **PKCE**. O cliente descobre o authorization server pelos metadados do recurso protegido (RFC 9728), anunciados em `WWW-Authenticate` na resposta `401`, e pelos metadados do servidor (RFC 8414); registra-se por registro dinâmico (RFC 7591), por cadastro prévio ou por outro mecanismo que o servidor aceite; e pede o token com o parâmetro `resource` (RFC 8707), para que o `aud` seja **aquele** servidor MCP. Um token por servidor.",
          },
          {
            titulo: "4. Chamadas a jusante",
            texto:
              "Se o servidor MCP precisa chamar outra API (agenda, repositório), ele **não repassa** o token que recebeu (*token passthrough*): usa Token Exchange ou OBO (veja Q36), ou uma autorização própria junto àquela API, com escopo mínimo.",
          },
          {
            titulo: "5. Riscos e controles",
            texto:
              "Veja a tabela: o risco novo é que **o que dispara a ação pode ser texto** (um e-mail, uma página, a saída de outra ferramenta), e o modelo pode ser induzido a agir com a autoridade do usuário.",
          },
          {
            titulo: "6. Operação",
            texto:
              "Auditoria que registra usuário, agente, servidor, ferramenta, parâmetros e decisão; uma tela em que o usuário vê e revoga o que cada agente pode (veja Q35); tokens curtos; limites de taxa e de volume por ação; alertas para padrões fora do normal.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Descoberta e autorização de um servidor MCP",
        legenda: "HTTP",
        codigo: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource"

GET /.well-known/oauth-protected-resource HTTP/1.1
Host: mcp.example.com

HTTP/1.1 200 OK
{ "resource": "https://mcp.example.com",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["calendar:read", "calendar:write"] }

GET /authorize?response_type=code&client_id=agent-app
    &redirect_uri=https%3A%2F%2Fagent.example.com%2Fcb
    &scope=calendar%3Aread&resource=https%3A%2F%2Fmcp.example.com
    &code_challenge=E9Melhoa...&code_challenge_method=S256&state=xyz`,
        nota: "O servidor MCP aponta para os próprios metadados, que apontam para o authorization server. O parâmetro `resource` faz o token nascer com `aud` igual ao servidor MCP, inútil em qualquer outro.",
      },
      {
        tipo: "tabela",
        titulo: "Riscos novos e o que fazer",
        colunas: ["Risco", "Como acontece", "Mitigação"],
        linhas: [
          [
            "Prompt injection",
            "Texto não confiável (e-mail, página, resultado de ferramenta) instrui o agente a usar ferramentas com a autoridade do usuário, por exemplo para enviar dados para fora",
            "Tratar todo conteúdo externo como dado, não como instrução; separar leitura de ação; **confirmação do usuário por ação sensível**, mostrada pelo aplicativo e não pelo modelo; limitar canais de saída",
          ],
          [
            "Escopo excessivo",
            "O agente pede e recebe `mail.readwrite` quando só precisava ler, e qualquer falha dele usa tudo",
            "Menor privilégio; escopos granulares; consentimento incremental quando a ação exigir; tokens curtos e por servidor",
          ],
          [
            "Confused deputy e passagem de token",
            "O servidor MCP usa o token do usuário em outra API, ou aceita tokens emitidos para outro serviço",
            "Validar `aud` no servidor MCP; proibir o *token passthrough*; trocar o token (Q36); consentimento por client quando houver proxy de autorização",
          ],
          [
            "Vazamento de credencial pelo contexto",
            "O token entra no prompt, nos logs da conversa ou na saída do modelo e vai parar onde não devia",
            "Token só no código do cliente ou do BFF, nunca no contexto do modelo; redigir logs; vida curta",
          ],
          [
            "Ação automática em escala",
            "Um laço do agente executa dezenas de operações destrutivas antes de alguém ver",
            "Limites de taxa e de volume; ações irreversíveis sempre com aprovação; simulação (*dry run*) e desfazer quando possível",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O modelo não é uma fronteira de segurança",
        texto:
          "A decisão de autorizar mora no **servidor** (token, escopo, audiência, política por ferramenta), nunca no texto que o modelo produz. Assuma que o agente **pode** ser induzido a chamar qualquer ferramenta que tenha, e dê a ele só as que o usuário aceitaria ver chamadas por engano. Quando o agente age por conta própria, sem usuário, use identidade de serviço com permissões próprias e auditáveis.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Como a IA amplia a superfície, e a especificação ainda muda",
        texto:
          "Além da injeção de prompt, a IA traz agência excessiva, vazamento de dados sensíveis pelo contexto, saídas do modelo usadas sem validação e dependência de ferramentas e servidores de terceiros (um servidor MCP malicioso pode descrever ferramentas de modo enganoso). O OWASP mantém uma lista de riscos para aplicações com LLMs; confira a versão atual. A autorização do MCP evolui entre revisões da especificação: confira a revisão vigente em modelcontextprotocol.io em vez de decorar detalhes.",
      },
    ],
    armadilhas: [
      "Dar ao agente um token de escopo amplo “para funcionar em tudo”: qualquer injeção de prompt passa a ter esse alcance.",
      "Deixar o servidor MCP repassar o token do usuário a outras APIs, ou aceitar tokens sem conferir `aud`: é o confused deputy.",
      "Pedir a confirmação do usuário pelo próprio modelo (“você confirma?” no texto gerado): a aprovação precisa vir de uma interface que o modelo não controla.",
      "Colocar tokens ou segredos no prompt, nos logs de conversa ou nas respostas de ferramentas.",
    ],
    autoteste: [
      {
        pergunta:
          "Como um cliente MCP descobre o authorization server de um servidor MCP, e por que usar o parâmetro `resource`?",
        resposta:
          "O servidor responde `401` com `WWW-Authenticate` apontando para os metadados do recurso (RFC 9728), que listam os authorization servers; o cliente lê os metadados do servidor (RFC 8414), registra-se e segue o authorization code com PKCE. O `resource` (RFC 8707) faz o token nascer com `aud` igual ao servidor MCP, para ser inútil em outros.",
      },
      {
        pergunta: "Por que a confirmação de uma ação sensível não pode ficar a cargo do modelo?",
        resposta:
          "Porque o modelo pode ser induzido por texto não confiável a “confirmar” por conta própria. A aprovação deve ser pedida pela interface do aplicativo, descrevendo a ação real, e a autorização final deve ser aplicada pelo servidor, com token e escopo.",
      },
    ],
  },
  en: {
    titulo: "OAuth for AI agents and MCP",
    pergunta:
      "How should an AI agent or MCP server use OAuth to act on a user's behalf? What new risks appear (prompt injection, excessive scopes) and how do you mitigate them?",
    porqueEsteMetodo:
      "It is a new design problem built on familiar pieces: roles, authorization flow, call chain and controls. A fixed script avoids mixing up what OAuth already solves with the risk AI adds.",
    resposta30s:
      "The agent (MCP client) is the **OAuth client** and the MCP server is the **resource server**: the user authorizes with **authorization code and PKCE**, the client discovers the authorization server from the **resource metadata**, requests the token with the `resource` parameter, and each server only accepts tokens with **its own audience**, without passing them on. The new risk is that **untrusted text** (a web page, an email) can induce the agent to act with the user’s authority (**prompt injection**), and a broad token multiplies the damage. Hence: least privilege, short tokens, consent per sensitive action, server-side validation and auditing.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Requirements",
            texto:
              "The agent (an AI application or assistant) needs to call tools and user data on MCP servers or APIs, **on the user’s behalf**, with minimum power and a trace of who did what. Decide first whether the agent acts **as the user** (delegation) or **as itself** (a service identity, with client credentials).",
          },
          {
            titulo: "2. Roles",
            texto:
              "The agent (host application and MCP client) is the **OAuth client**; the MCP server is the **resource server**; the authorization server is separate (the company’s identity provider, for example). The MCP server validates tokens like any API (see Q40).",
          },
          {
            titulo: "3. User authorization",
            texto:
              "Authorization code with **PKCE**. The client discovers the authorization server from the protected resource metadata (RFC 9728), announced in `WWW-Authenticate` on the `401` response, and from the server metadata (RFC 8414); it registers through dynamic registration (RFC 7591), prior registration or another mechanism the server accepts; and it requests the token with the `resource` parameter (RFC 8707), so the `aud` is **that** MCP server. One token per server.",
          },
          {
            titulo: "4. Downstream calls",
            texto:
              "If the MCP server needs to call another API (calendar, repository), it **does not pass along** the token it received (*token passthrough*): it uses Token Exchange or OBO (see Q36), or its own authorization with that API, with minimum scope.",
          },
          {
            titulo: "5. Risks and controls",
            texto:
              "See the table: the new risk is that **what triggers the action can be text** (an email, a web page, another tool’s output), and the model can be induced to act with the user’s authority.",
          },
          {
            titulo: "6. Operations",
            texto:
              "Auditing that records user, agent, server, tool, parameters and decision; a screen where the user sees and revokes what each agent can do (see Q35); short tokens; rate and volume limits per action; alerts for unusual patterns.",
          },
        ],
      },
      {
        tipo: "codigo",
        titulo: "Discovery and authorization of an MCP server",
        legenda: "HTTP",
        codigo: `HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer resource_metadata="https://mcp.example.com/.well-known/oauth-protected-resource"

GET /.well-known/oauth-protected-resource HTTP/1.1
Host: mcp.example.com

HTTP/1.1 200 OK
{ "resource": "https://mcp.example.com",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["calendar:read", "calendar:write"] }

GET /authorize?response_type=code&client_id=agent-app
    &redirect_uri=https%3A%2F%2Fagent.example.com%2Fcb
    &scope=calendar%3Aread&resource=https%3A%2F%2Fmcp.example.com
    &code_challenge=E9Melhoa...&code_challenge_method=S256&state=xyz`,
        nota: "The MCP server points to its own metadata, which points to the authorization server. The `resource` parameter makes the token born with `aud` equal to the MCP server, useless on any other.",
      },
      {
        tipo: "tabela",
        titulo: "New risks and what to do",
        colunas: ["Risk", "How it happens", "Mitigation"],
        linhas: [
          [
            "Prompt injection",
            "Untrusted text (an email, a web page, a tool result) instructs the agent to use tools with the user’s authority, for example to send data out",
            "Treat all external content as data, not instructions; separate reading from acting; **user confirmation per sensitive action**, shown by the application and not by the model; limit outbound channels",
          ],
          [
            "Excessive scope",
            "The agent asks for and receives `mail.readwrite` when it only needed to read, and any failure of the agent uses everything",
            "Least privilege; granular scopes; incremental consent when the action requires it; short tokens, one per server",
          ],
          [
            "Confused deputy and token passthrough",
            "The MCP server uses the user’s token on another API, or accepts tokens issued for another service",
            "Validate `aud` on the MCP server; forbid *token passthrough*; exchange the token (Q36); per-client consent when there is an authorization proxy",
          ],
          [
            "Credential leakage through context",
            "The token enters the prompt, the conversation logs or the model’s output and ends up where it should not",
            "Keep the token only in client or BFF code, never in the model’s context; redact logs; short lifetimes",
          ],
          [
            "Automatic action at scale",
            "An agent loop runs dozens of destructive operations before anyone notices",
            "Rate and volume limits; irreversible actions always with approval; a dry run and undo where possible",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The model is not a security boundary",
        texto:
          "The decision to authorize lives on the **server** (token, scope, audience, per-tool policy), never in the text the model produces. Assume the agent **can** be induced to call any tool it has, and give it only the tools the user would accept seeing called by mistake. When the agent acts on its own, without a user, use a service identity with its own auditable permissions.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "How AI widens the surface, and the specification still changes",
        texto:
          "Besides prompt injection, AI brings excessive agency, leakage of sensitive data through context, model outputs used without validation and dependence on third-party tools and servers (a malicious MCP server can describe tools in a misleading way). OWASP maintains a list of risks for LLM applications; check the current version. MCP authorization evolves between revisions of the specification: check the current revision at modelcontextprotocol.io instead of memorizing details.",
      },
    ],
    armadilhas: [
      "Giving the agent a broad-scope token “so it works on everything”: any prompt injection inherits that reach.",
      "Letting the MCP server pass the user’s token on to other APIs, or accept tokens without checking `aud`: that is the confused deputy.",
      "Asking for the user’s confirmation through the model itself (“do you confirm?” in generated text): approval has to come from an interface the model does not control.",
      "Putting tokens or secrets in the prompt, in conversation logs or in tool responses.",
    ],
    autoteste: [
      {
        pergunta:
          "How does an MCP client discover an MCP server’s authorization server, and why use the `resource` parameter?",
        resposta:
          "The server answers `401` with `WWW-Authenticate` pointing to the resource metadata (RFC 9728), which lists the authorization servers; the client reads the server metadata (RFC 8414), registers and follows authorization code with PKCE. The `resource` parameter (RFC 8707) makes the token born with `aud` equal to the MCP server, so it is useless elsewhere.",
      },
      {
        pergunta: "Why can’t confirmation of a sensitive action be left to the model?",
        resposta:
          "Because the model can be induced by untrusted text to “confirm” on its own. Approval should be requested by the application’s interface, describing the real action, and the final authorization should be enforced by the server, through token and scope.",
      },
    ],
  },
};
