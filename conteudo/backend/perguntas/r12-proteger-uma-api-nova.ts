import type { Pergunta } from "../../tipos";

// R12 · Proteger uma API nova
export const r12: Pergunta = {
  numero: 112,
  modulo: "roadmap-iniciante",
  metodo: "threat",
  pt: {
    titulo: "Proteger uma API nova",
    pergunta: "Que medidas você tomaria para proteger uma API recém-desenvolvida?",
    porqueEsteMetodo:
      "Proteger uma API é fechar cada risco com uma medida específica. O formato ameaça → defesa mostra o que cada medida impede, para você não aplicá-las por ritual.",
    resposta30s:
      "Combine **autenticação** (OAuth/OIDC, JWT de vida curta ou chave de API), **autorização por recurso em cada endpoint**, **HTTPS** em todo tráfego, **CORS** com allowlist, **validação de entrada** e consultas parametrizadas, **rate limiting**, respostas **sem dados em excesso**, **segredos em cofre** e **logs e testes de segurança**. O erro mais comum é autenticar e esquecer a **autorização por objeto**.",
    blocos: [
      {
        tipo: "pares",
        rotuloOrigem: "Risco",
        rotuloDestino: "Medida",
        pares: [
          {
            origem: "Qualquer um chama a API",
            destino: "**Autenticação**: OAuth 2.0/OIDC, JWT de vida curta ou chave de API; nunca credenciais na URL.",
          },
          {
            origem: "Um usuário acessa dados de outro",
            destino: "**Autorização** por recurso e por ação em cada endpoint, negando por padrão.",
          },
          {
            origem: "Dados interceptados",
            destino: "**HTTPS/TLS** em todo o tráfego e HSTS.",
          },
          {
            origem: "Sites de outras origens lendo respostas",
            destino: "**CORS** com allowlist explícita.",
          },
          {
            origem: "Entrada maliciosa",
            destino: "**Validação** de tipo, tamanho e formato, e consultas parametrizadas.",
          },
          {
            origem: "Abuso e força bruta",
            destino: "**Rate limiting** e cotas por cliente.",
          },
          {
            origem: "Dados em excesso e erros detalhados",
            destino: "Devolva só os campos necessários; não exponha stack traces, IDs internos nem dados sensíveis.",
          },
          {
            origem: "Segredos vazados",
            destino: "Segredos em cofre, não no repositório; rotação de chaves.",
          },
          {
            origem: "Falhas despercebidas",
            destino: "Logs de segurança, auditoria, alertas, e testes (SAST/DAST, varredura de dependências).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O risco nº 1 em APIs",
        texto:
          "No OWASP API Security Top 10 o primeiro item é a **quebra de autorização por objeto** (BOLA/IDOR): acessar `/pedidos/123` de outro usuário só trocando o ID. Autenticar não basta. Veja também a Q19.",
      },
    ],
    armadilhas: [
      "Autenticar e esquecer a autorização por objeto.",
      "`CORS: *` combinado com credenciais, ou em API sensível.",
      "Expor mensagens de erro detalhadas ao cliente.",
      "Segredos no código ou em variáveis de build públicas.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre autenticação e autorização?",
        resposta: "Autenticação confirma quem você é; autorização decide o que você pode fazer com cada recurso.",
      },
      {
        pergunta: "Qual o principal risco de APIs segundo o OWASP?",
        resposta: "A quebra de autorização por objeto (BOLA/IDOR): acessar o recurso de outro usuário ao trocar um ID.",
      },
    ],
  },
  en: {
    titulo: "Securing a new API",
    pergunta: "What measures would you take to secure a newly developed API?",
    porqueEsteMetodo:
      "Securing an API means closing each risk with a specific measure. The threat → defense format shows what each measure prevents, so you do not apply them as ritual.",
    resposta30s:
      "Combine **authentication** (OAuth/OIDC, short-lived JWT or an API key), **per-resource authorization on every endpoint**, **HTTPS** on all traffic, **CORS** with an allowlist, **input validation** and parameterized queries, **rate limiting**, responses **without excess data**, **secrets in a vault**, and **security logs and tests**. The most common mistake is authenticating and forgetting **object-level authorization**.",
    blocos: [
      {
        tipo: "pares",
        rotuloOrigem: "Risk",
        rotuloDestino: "Measure",
        pares: [
          {
            origem: "Anyone can call the API",
            destino: "**Authentication**: OAuth 2.0/OIDC, short-lived JWT or an API key; never credentials in the URL.",
          },
          {
            origem: "One user reads another’s data",
            destino: "**Authorization** per resource and action on every endpoint, deny by default.",
          },
          {
            origem: "Data intercepted",
            destino: "**HTTPS/TLS** on all traffic and HSTS.",
          },
          {
            origem: "Other origins reading responses",
            destino: "**CORS** with an explicit allowlist.",
          },
          {
            origem: "Malicious input",
            destino: "**Validation** of type, size and format, plus parameterized queries.",
          },
          {
            origem: "Abuse and brute force",
            destino: "**Rate limiting** and per-client quotas.",
          },
          {
            origem: "Excess data and detailed errors",
            destino: "Return only the needed fields; do not expose stack traces, internal IDs or sensitive data.",
          },
          {
            origem: "Leaked secrets",
            destino: "Secrets in a vault, not in the repository; key rotation.",
          },
          {
            origem: "Unnoticed failures",
            destino: "Security logs, auditing, alerts, and tests (SAST/DAST, dependency scanning).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "The #1 API risk",
        texto:
          "In the OWASP API Security Top 10 the first item is **broken object-level authorization** (BOLA/IDOR): reading another user’s `/orders/123` just by changing the ID. Authenticating is not enough. See also Q19.",
      },
    ],
    armadilhas: [
      "Authenticating and forgetting object-level authorization.",
      "`CORS: *` combined with credentials, or on a sensitive API.",
      "Exposing detailed error messages to the client.",
      "Secrets in code or in public build variables.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between authentication and authorization?",
        resposta: "Authentication confirms who you are; authorization decides what you may do with each resource.",
      },
      {
        pergunta: "What is the main API risk according to OWASP?",
        resposta: "Broken object-level authorization (BOLA/IDOR): reading another user’s resource by changing an ID.",
      },
    ],
  },
};
