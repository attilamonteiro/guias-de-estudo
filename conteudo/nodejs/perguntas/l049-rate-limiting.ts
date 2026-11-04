import type { Pergunta } from "../../tipos";

// L49 · Rate limiting
export const l049: Pergunta = {
  numero: 149,
  modulo: "linkedin-express",
  metodo: "playbook",
  pt: {
    titulo: "Rate limiting",
    pergunta: "Como você implementa rate limiting?",
    porqueEsteMetodo:
      "Limitar o ritmo de uma API tem decisões em sequência: o que proteger, por qual chave, com qual algoritmo e onde guardar os contadores. Um playbook dá a ordem certa, com o critério que confirma cada passo.",
    resposta30s:
      "**Rate limiting** limita quantas requisições uma identidade (IP, usuário ou chave de API) pode fazer em um período, para evitar abuso, esgotamento de recursos e **força bruta**. Escolha um algoritmo (**janela fixa**, **janela deslizante** ou **token bucket**), guarde o contador em um armazenamento **compartilhado** (Redis) quando houver várias instâncias, configure `trust proxy` para enxergar o IP real e responda `429` com `Retry-After`. No login, combine o limite com atraso progressivo, captcha e MFA.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: limitar o ritmo de uma API",
        passos: [
          {
            titulo: "Defina o que proteger, rota por rota",
            texto:
              "Login, redefinição de senha e envio de e-mail pedem limites bem mais estritos que uma leitura comum. Critério: cada limite tem uma razão (custo, abuso, força bruta) e um valor que um usuário legítimo não alcança.",
          },
          {
            titulo: "Escolha a chave do limite",
            texto:
              "IP para tráfego anônimo; id do usuário, token ou chave de API para quem está autenticado; no login, a combinação IP e e-mail. Critério: a chave identifica quem abusa sem punir quem só compartilha rede (muitos usuários atrás do mesmo NAT).",
          },
          {
            titulo: "Escolha o algoritmo",
            texto:
              "Janela fixa é a mais simples, a deslizante é mais justa e o token bucket permite rajadas curtas (veja a tabela abaixo). Critério: o comportamento na virada da janela e nas rajadas é aceitável para a sua rota.",
          },
          {
            titulo: "Guarde o contador em um lugar compartilhado",
            texto:
              "Na memória do processo, o contador só vale para uma instância; com várias instâncias ou `cluster` (veja T45) cada processo conta à parte e o limite real vira limite × instâncias. Use Redis (veja L100) com incremento atômico e expiração. Sinal de acerto: o limite vale igual, qualquer instância que atenda.",
          },
          {
            titulo: "Configure o proxy confiável",
            texto:
              "Atrás de um balanceador, `req.ip` é o IP dele e todos dividiriam o mesmo contador. Use `app.set('trust proxy', n)` com o número exato de saltos confiáveis, ou os endereços do proxy, nunca `true` às cegas: o cliente forja `X-Forwarded-For` e escapa do limite. Sinal de acerto: os logs mostram o IP real do cliente.",
          },
          {
            titulo: "Responda com 429 e diga quando tentar de novo",
            texto:
              "Ao estourar, devolva `429 Too Many Requests` com `Retry-After` (em segundos) e o corpo no formato padrão de erro da API. Bibliotecas como `express-rate-limit` fazem isso e podem enviar cabeçalhos informativos de cota; confira a convenção da sua versão. Registre os `429` para ajustar os limites com dados reais.",
          },
          {
            titulo: "Reforce o login contra força bruta",
            texto:
              "Limite por IP e por conta, aplique atraso ou bloqueio progressivo (backoff exponencial), exija captcha ou MFA depois de falhas seguidas e avise o dono da conta. Cuidado: bloquear a conta inteira após N falhas deixa um atacante trancar contas alheias, então prefira atraso, captcha e aviso. O hash lento de senha (veja L125) limita o dano de um vazamento do banco.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Algoritmos de limitação",
        colunas: ["Algoritmo", "Como funciona", "Vantagem", "Limitação"],
        linhas: [
          [
            "Janela fixa",
            "Conta as requisições em intervalos fixos (por exemplo, 100 por minuto) e zera na virada",
            "Simples e barato: um contador por chave",
            "Rajada na virada da janela: até o dobro do limite em poucos segundos",
          ],
          [
            "Janela deslizante",
            "Considera os últimos N segundos a partir de agora, pelo registro das requisições ou por uma média ponderada das janelas",
            "Mais justa, sem o efeito da virada",
            "Mais memória e cálculo (registro) ou uma aproximação (média ponderada)",
          ],
          [
            "Token bucket",
            "Um balde enche a uma taxa constante até um máximo; cada requisição gasta uma ficha",
            "Permite rajadas curtas e mantém a taxa média",
            "Dois parâmetros para calibrar: capacidade e taxa de reposição",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "Limite geral e limite de login",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import rateLimit from "express-rate-limit";',
          "",
          "const app = express();",
          'app.set("trust proxy", 1); // um proxy confiável à frente; nunca `true` às cegas',
          "",
          "const geral = rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: true, legacyHeaders: false });",
          "const login = rateLimit({",
          "  windowMs: 15 * 60_000,",
          "  limit: 5, // tentativas por janela e por IP",
          "  skipSuccessfulRequests: true, // só as falhas contam",
          '  message: { erro: "Muitas tentativas. Tente de novo mais tarde." }, // resposta 429',
          "});",
          "",
          "app.use(geral);",
          'app.post("/login", login, entrar);',
          "// com várias instâncias, passe `store:` com um armazenamento compartilhado (ex.: Redis)",
        ].join("\n"),
        nota: "O nome da opção `limit` vale para versões recentes da `express-rate-limit` (nas antigas, `max`). Confira a documentação da sua versão.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Limite **por rota e por identidade**, com contador **compartilhado**, e responda `429` com `Retry-After`. Faça o grosso do controle de tráfego bruto na borda (balanceador, API gateway, CDN ou WAF) e deixe na aplicação as regras que dependem de usuário, rota e conta. Para força bruta no login, o limite sozinho não basta: some atraso progressivo, captcha, MFA e alertas.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Rate limiting reduz abuso, não substitui defesa",
        texto:
          "Um atacante com muitos IPs (uma botnet, ou rotação de proxies) fica abaixo do limite por IP, e limitar só por IP pune quem divide uma rede. Por isso a chave certa muda conforme a rota, e o limite se soma à autenticação, à validação de entrada (veja L50) e a um corpo com tamanho limitado (veja L43), não os substitui.",
      },
    ],
    armadilhas: [
      "Limitar só por IP: usuários atrás do mesmo NAT são punidos juntos e atacantes com muitos IPs escapam; combine com uma chave por usuário ou conta.",
      "Contar em memória com várias instâncias ou `cluster`, ou perder o contador a cada reinício e deploy: o limite real fica muito maior que o configurado.",
      "Confiar cegamente em `X-Forwarded-For` (`trust proxy` ligado sem critério): o cliente forja o IP e contorna o limite.",
      "Bloquear a conta inteira após N falhas de login: um atacante consegue trancar contas alheias de propósito. Prefira atraso progressivo, captcha e aviso ao dono.",
    ],
    autoteste: [
      {
        pergunta: "Por que um contador em memória falha quando há várias instâncias da API?",
        resposta:
          "Cada processo conta só as requisições que recebe, então o limite efetivo vira o limite × o número de instâncias. Use um armazenamento compartilhado, como Redis, com operações atômicas.",
      },
      {
        pergunta: "Por que `trust proxy` importa para o rate limiting?",
        resposta:
          "Atrás de um proxy, `req.ip` seria o do próprio proxy e todos dividiriam um contador. Se `trust proxy` confia em qualquer `X-Forwarded-For`, o cliente forja o cabeçalho e escapa do limite. Configure apenas os saltos realmente confiáveis.",
      },
    ],
  },
  en: {
    titulo: "Rate limiting",
    pergunta: "How do you implement rate limiting?",
    porqueEsteMetodo:
      "Limiting an API’s pace involves decisions in sequence: what to protect, by which key, with which algorithm and where to keep the counters. A playbook gives the right order, with the criterion that confirms each step.",
    resposta30s:
      "**Rate limiting** caps how many requests an identity (IP, user or API key) can make in a period, to prevent abuse, resource exhaustion and **brute force**. Pick an algorithm (**fixed window**, **sliding window** or **token bucket**), keep the counter in **shared** storage (Redis) when there are several instances, set `trust proxy` so you see the real IP and answer with `429` and `Retry-After`. On login, combine the limit with progressive delays, captcha and MFA.",
    blocos: [
      {
        tipo: "passos",
        titulo: "Playbook: limiting an API’s pace",
        passos: [
          {
            titulo: "Define what to protect, route by route",
            texto:
              "Login, password reset and email sending need much stricter limits than an ordinary read. Criterion: each limit has a reason (cost, abuse, brute force) and a value a legitimate user will not reach.",
          },
          {
            titulo: "Choose the limit key",
            texto:
              "IP for anonymous traffic; user id, token or API key for authenticated callers; on login, the combination of IP and email. Criterion: the key identifies who abuses without punishing people who merely share a network (many users behind the same NAT).",
          },
          {
            titulo: "Choose the algorithm",
            texto:
              "Fixed window is the simplest, sliding window is fairer and token bucket allows short bursts (see the table below). Criterion: the behavior at the window boundary and during bursts is acceptable for your route.",
          },
          {
            titulo: "Keep the counter in a shared place",
            texto:
              "In process memory, the counter only covers one instance; with several instances or `cluster` (see T45) each process counts separately and the real limit becomes limit × instances. Use Redis (see L100) with atomic increment and expiry. A sign of success: the limit holds the same whichever instance answers.",
          },
          {
            titulo: "Configure the trusted proxy",
            texto:
              "Behind a load balancer, `req.ip` is its IP and everyone would share one counter. Use `app.set('trust proxy', n)` with the exact number of trusted hops, or the proxy’s addresses, never a blind `true`: the client forges `X-Forwarded-For` and escapes the limit. A sign of success: the logs show the client’s real IP.",
          },
          {
            titulo: "Answer with 429 and say when to retry",
            texto:
              "When the limit is exceeded, return `429 Too Many Requests` with `Retry-After` (in seconds) and the body in the API’s standard error shape. Libraries such as `express-rate-limit` do this and can send informational quota headers; check the convention for your version. Log the `429` responses to tune the limits with real data.",
          },
          {
            titulo: "Harden login against brute force",
            texto:
              "Limit by IP and by account, apply progressive delay or blocking (exponential backoff), require captcha or MFA after repeated failures and notify the account owner. Careful: locking the whole account after N failures lets an attacker lock other people out, so prefer delay, captcha and notification. A slow password hash (see L125) limits the damage of a database leak.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Rate-limiting algorithms",
        colunas: ["Algorithm", "How it works", "Advantage", "Limitation"],
        linhas: [
          [
            "Fixed window",
            "Counts requests in fixed intervals (for example, 100 per minute) and resets at the boundary",
            "Simple and cheap: one counter per key",
            "Burst at the window boundary: up to double the limit within a few seconds",
          ],
          [
            "Sliding window",
            "Looks at the last N seconds from now, using a log of requests or a weighted average of windows",
            "Fairer, without the boundary effect",
            "More memory and computation (log) or an approximation (weighted average)",
          ],
          [
            "Token bucket",
            "A bucket fills at a constant rate up to a maximum; each request spends a token",
            "Allows short bursts and keeps the average rate",
            "Two parameters to tune: capacity and refill rate",
          ],
        ],
      },
      {
        tipo: "codigo",
        titulo: "General limit and login limit",
        legenda: "JavaScript",
        codigo: [
          'import express from "express";',
          'import rateLimit from "express-rate-limit";',
          "",
          "const app = express();",
          'app.set("trust proxy", 1); // one trusted proxy in front; never a blind `true`',
          "",
          "const general = rateLimit({ windowMs: 60_000, limit: 100, standardHeaders: true, legacyHeaders: false });",
          "const login = rateLimit({",
          "  windowMs: 15 * 60_000,",
          "  limit: 5, // attempts per window and per IP",
          "  skipSuccessfulRequests: true, // only failures count",
          '  message: { error: "Too many attempts. Try again later." }, // 429 response',
          "});",
          "",
          "app.use(general);",
          'app.post("/login", login, signIn);',
          "// with several instances, pass `store:` with shared storage (e.g. Redis)",
        ].join("\n"),
        nota: "The option name `limit` applies to recent versions of `express-rate-limit` (older ones use `max`). Check the documentation for your version.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "Limit **per route and per identity**, with a **shared** counter, and answer `429` with `Retry-After`. Do the bulk of raw traffic control at the edge (load balancer, API gateway, CDN or WAF) and keep in the application the rules that depend on user, route and account. For brute force on login, the limit alone is not enough: add progressive delay, captcha, MFA and alerts.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Rate limiting reduces abuse, it is not a full defense",
        texto:
          "An attacker with many IPs (a botnet, or rotating proxies) stays under the per-IP limit, and limiting by IP alone punishes people who share a network. That is why the right key changes by route, and the limit adds to authentication, input validation (see L50) and a capped body size (see L43) rather than replacing them.",
      },
    ],
    armadilhas: [
      "Limiting by IP only: users behind the same NAT are punished together and attackers with many IPs get through; combine it with a per-user or per-account key.",
      "Counting in memory with several instances or `cluster`, or losing the counter on every restart and deploy: the real limit ends up far above the configured one.",
      "Blindly trusting `X-Forwarded-For` (`trust proxy` turned on without criteria): the client forges the IP and gets around the limit.",
      "Locking the whole account after N failed logins: an attacker can deliberately lock other people’s accounts. Prefer progressive delay, captcha and notifying the owner.",
    ],
    autoteste: [
      {
        pergunta: "Why does an in-memory counter fail when the API has several instances?",
        resposta:
          "Each process counts only the requests it receives, so the effective limit becomes the limit × the number of instances. Use shared storage, such as Redis, with atomic operations.",
      },
      {
        pergunta: "Why does `trust proxy` matter for rate limiting?",
        resposta:
          "Behind a proxy, `req.ip` would be the proxy’s own and everyone would share one counter. If `trust proxy` trusts any `X-Forwarded-For`, the client forges the header and escapes the limit. Configure only the hops you truly trust.",
      },
    ],
  },
};
