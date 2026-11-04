import type { Pergunta } from "../../tipos";

// Q19 · Vulnerabilidades comuns
export const q19: Pergunta = {
  numero: 19,
  modulo: "seguranca",
  metodo: "threat",
  pt: {
    titulo: "Vulnerabilidades comuns",
    pergunta: "Quais são algumas vulnerabilidades de segurança comuns em aplicações backend e como mitigá-las?",
    porqueEsteMetodo:
      "É uma lista, e uma lista só fica na cabeça se cada item vier colado na sua defesa. O formato ameaça → defesa guarda os pares e destaca os princípios por trás deles.",
    resposta30s:
      "As mais comuns seguem o **OWASP Top 10**: **controle de acesso quebrado** (IDOR), falhas de **criptografia**, **injeção**, **má configuração**, **componentes vulneráveis**, falhas de **autenticação**, **SSRF**, falhas de **log e monitoramento**, além de XSS, CSRF e esgotamento de recursos. Quase todas se reduzem a quatro princípios: **nunca confiar na entrada**, **negar por padrão**, **privilégio mínimo** e **defesa em profundidade**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Ameaça → defesa",
        rotuloOrigem: "Vulnerabilidade",
        rotuloDestino: "Mitigação",
        pares: [
          {
            origem: "**Controle de acesso quebrado / IDOR**: `GET /pedidos/123` devolve o pedido de outro usuário",
            destino:
              "Autorização no servidor em **cada** acesso: conferir que o recurso pertence ao usuário; negar por padrão; IDs não sequenciais ajudam, mas não substituem a checagem.",
          },
          {
            origem: "**Falhas criptográficas**: tráfego em HTTP, segredos no código, algoritmos fracos",
            destino:
              "TLS em todo lugar, criptografia moderna, segredos em cofre (secrets manager) e fora do repositório, senhas com Argon2/bcrypt.",
          },
          {
            origem: "**Injeção** (SQL, NoSQL, comandos de shell, LDAP)",
            destino: "Consultas parametrizadas, allowlists, nunca montar comandos com entrada do usuário.",
          },
          {
            origem: "**Má configuração**: modo debug ligado, credenciais padrão, bucket público, CORS `*`",
            destino: "Configuração como código, defaults seguros, revisão e varredura automática, ambientes mínimos.",
          },
          {
            origem: "**Componentes vulneráveis** (dependências e cadeia de suprimentos)",
            destino: "Atualizar, `npm audit`/Dependabot/SCA, arquivos de lock, SBOM, remover dependência não usada.",
          },
          {
            origem: "**Falhas de autenticação**: força bruta, credential stuffing, sessão fixa",
            destino:
              "MFA, rate limit, hash forte, rotacionar a sessão no login, bloqueio progressivo, verificar senhas vazadas.",
          },
          {
            origem:
              "**SSRF**: o servidor busca uma URL fornecida pelo usuário e alcança a rede interna ou o serviço de metadados da nuvem",
            destino:
              "Allowlist de destinos, bloquear IPs internos e `169.254.169.254`, usar IMDSv2, segmentação de rede.",
          },
          {
            origem: "**XSS**: script injetado em página renderizada",
            destino:
              "Escapar a saída conforme o contexto, Content-Security-Policy, cookies `HttpOnly`, sanitizar HTML.",
          },
          {
            origem: "**CSRF**: outro site dispara ações com o cookie do usuário",
            destino: "Cookies `SameSite`, token anti-CSRF, exigir cabeçalho próprio em APIs.",
          },
          {
            origem: "**Exposição excessiva / mass assignment**: a API devolve ou aceita campos demais",
            destino: "DTOs com campos explícitos (allowlist), nunca gravar o corpo da requisição direto no modelo.",
          },
          {
            origem: "**Esgotamento de recursos / DoS**",
            destino: "Rate limit, timeouts, limite de tamanho de payload e de paginação, filas e circuit breakers.",
          },
          {
            origem: "**Falta de log e monitoramento**",
            destino:
              "Registrar eventos de segurança (logins, falhas de autorização), alertas, sem registrar dados sensíveis.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Os quatro princípios por trás de tudo",
        texto:
          "**Nunca confie na entrada** (valide e trate toda entrada como hostil). **Negue por padrão** (permissão explícita, não proibição explícita). **Privilégio mínimo** (cada conta e serviço só acessa o necessário). **Defesa em profundidade** (várias camadas: se uma falha, a próxima segura).",
      },
    ],
    armadilhas: [
      "Autorizar só no front-end: o botão some, mas a rota continua aceitando a chamada.",
      "Confiar em ID não sequencial (UUID) como se fosse controle de acesso.",
      "Tratar segurança como etapa final em vez de requisito do desenho (threat modeling desde o início).",
      "Mensagens de erro e logs que vazam dados sensíveis, tokens ou o esquema do banco.",
    ],
    autoteste: [
      {
        pergunta: "O que é um IDOR e como se corrige?",
        resposta:
          "Acessar o recurso de outro usuário trocando um ID na requisição. Corrige-se verificando no servidor, a cada acesso, se o recurso pertence ao usuário autenticado.",
      },
      {
        pergunta: "Por que o SSRF é perigoso em nuvem?",
        resposta:
          "O atacante faz o servidor buscar URLs internas, como o serviço de metadados, e pode roubar credenciais temporárias da máquina.",
      },
    ],
  },
  en: {
    titulo: "Common vulnerabilities",
    pergunta: "What are some common security vulnerabilities in backend applications and how do you mitigate them?",
    porqueEsteMetodo:
      "It is a list, and a list only sticks if each item is glued to its defense. The threat → defense format keeps the pairs and highlights the principles behind them.",
    resposta30s:
      "The most common follow the **OWASP Top 10**: **broken access control** (IDOR), **cryptographic** failures, **injection**, **misconfiguration**, **vulnerable components**, **authentication** failures, **SSRF**, **logging and monitoring** gaps, plus XSS, CSRF and resource exhaustion. Almost all reduce to four principles: **never trust input**, **deny by default**, **least privilege** and **defense in depth**.",
    blocos: [
      {
        tipo: "pares",
        titulo: "Threat → defense",
        rotuloOrigem: "Vulnerability",
        rotuloDestino: "Mitigation",
        pares: [
          {
            origem: "**Broken access control / IDOR**: `GET /orders/123` returns another user’s order",
            destino:
              "Server-side authorization on **every** access: verify the resource belongs to the user; deny by default; non-sequential IDs help but do not replace the check.",
          },
          {
            origem: "**Cryptographic failures**: HTTP traffic, secrets in code, weak algorithms",
            destino:
              "TLS everywhere, modern cryptography, secrets in a vault (secrets manager) and out of the repository, passwords with Argon2/bcrypt.",
          },
          {
            origem: "**Injection** (SQL, NoSQL, shell commands, LDAP)",
            destino: "Parameterized queries, allowlists, never build commands from user input.",
          },
          {
            origem: "**Misconfiguration**: debug mode on, default credentials, public bucket, CORS `*`",
            destino: "Configuration as code, secure defaults, review and automated scanning, minimal environments.",
          },
          {
            origem: "**Vulnerable components** (dependencies and supply chain)",
            destino: "Update, `npm audit`/Dependabot/SCA, lock files, SBOM, remove unused dependencies.",
          },
          {
            origem: "**Authentication failures**: brute force, credential stuffing, fixed sessions",
            destino:
              "MFA, rate limiting, strong hashing, rotate the session on login, progressive lockout, check for breached passwords.",
          },
          {
            origem:
              "**SSRF**: the server fetches a user-supplied URL and reaches the internal network or the cloud metadata service",
            destino:
              "Destination allowlist, block internal IPs and `169.254.169.254`, use IMDSv2, network segmentation.",
          },
          {
            origem: "**XSS**: script injected into a rendered page",
            destino: "Context-aware output escaping, Content-Security-Policy, `HttpOnly` cookies, sanitize HTML.",
          },
          {
            origem: "**CSRF**: another site triggers actions with the user’s cookie",
            destino: "`SameSite` cookies, anti-CSRF token, require a custom header on APIs.",
          },
          {
            origem: "**Excessive exposure / mass assignment**: the API returns or accepts too many fields",
            destino: "DTOs with explicit fields (allowlist), never write the request body straight into the model.",
          },
          {
            origem: "**Resource exhaustion / DoS**",
            destino: "Rate limiting, timeouts, payload-size and pagination limits, queues and circuit breakers.",
          },
          {
            origem: "**Missing logging and monitoring**",
            destino: "Record security events (logins, authorization failures), alerts, without logging sensitive data.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The four principles behind everything",
        texto:
          "**Never trust input** (validate and treat all input as hostile). **Deny by default** (explicit permission, not explicit prohibition). **Least privilege** (each account and service accesses only what it needs). **Defense in depth** (several layers: if one fails, the next holds).",
      },
    ],
    armadilhas: [
      "Authorizing only in the front end: the button disappears, but the route still accepts the call.",
      "Trusting a non-sequential ID (UUID) as if it were access control.",
      "Treating security as a final step instead of a design requirement (threat modeling from the start).",
      "Error messages and logs that leak sensitive data, tokens or the database schema.",
    ],
    autoteste: [
      {
        pergunta: "What is an IDOR and how is it fixed?",
        resposta:
          "Accessing another user’s resource by changing an ID in the request. It is fixed by checking on the server, at every access, that the resource belongs to the authenticated user.",
      },
      {
        pergunta: "Why is SSRF dangerous in the cloud?",
        resposta:
          "The attacker makes the server fetch internal URLs, like the metadata service, and can steal the machine’s temporary credentials.",
      },
    ],
  },
};
