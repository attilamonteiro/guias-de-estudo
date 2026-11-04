import type { Pergunta } from "../../tipos";

// P99 · API gateway
export const p099: Pergunta = {
  numero: 799,
  modulo: "pawanmkr-devops",
  metodo: "compare",
  pt: {
    titulo: "API gateway",
    pergunta: "Como um API gateway gerencia autenticação, rate limiting e logging?",
    porqueEsteMetodo:
      "O gateway divide responsabilidades com o proxy reverso, o BFF, o service mesh e os próprios serviços, e a entrevista quer saber o que fica onde. A matriz põe cada função e cada vizinho lado a lado, e a regra de decisão separa o que é do gateway do que é do serviço.",
    resposta30s:
      "Um **API gateway** é o **ponto de entrada único** na frente dos serviços: ele roteia cada requisição e aplica as políticas transversais antes de ela chegar ao serviço. Na **autenticação**, valida o token (assinatura, emissor, público, validade) e repassa a identidade; no **rate limiting**, conta as requisições por chave, usuário ou IP e responde 429 acima do limite; no **logging**, registra cada chamada com método, rota, status, latência e um id de correlação. Isso não substitui a validação nos próprios serviços (defesa em profundidade), e o gateway não deve conter regra de negócio.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "O que o gateway faz, e o que sobra para os serviços",
        colunas: ["Função", "Como o gateway faz", "O que fica com os serviços"],
        linhas: [
          [
            "Roteamento",
            "Mapeia host, caminho e método para o serviço certo, com balanceamento e novas tentativas",
            "Cada serviço cuida do seu domínio",
          ],
          [
            "Autenticação",
            "Valida o token (assinatura, `iss`, `aud`, `exp`) ou consulta o servidor de autorização, rejeita com 401 e repassa a identidade ao serviço (veja P29)",
            "Validar de novo o token ou a origem do tráfego (defesa em profundidade)",
          ],
          [
            "Autorização grossa",
            "Exige escopo, papel ou chave de API da rota e rejeita com 403",
            "Autorização fina: este usuário pode ver este pedido?",
          ],
          [
            "Rate limiting e cotas",
            "Conta requisições por chave, usuário ou IP numa janela (fixa, deslizante ou token bucket), guarda os contadores num armazenamento compartilhado quando há várias instâncias e responde 429 com `Retry-After`",
            "Limites do domínio (por exemplo, tentativas de login por conta) e proteção de operações caras",
          ],
          [
            "Logging, métricas e tracing",
            "Registra cada chamada (método, rota, status, latência, cliente), gera ou propaga o id de correlação (`X-Request-Id`, `traceparent`) e exporta métricas",
            "Logs de negócio, com o mesmo id de correlação (veja L117)",
          ],
          [
            "Cache, transformação e TLS",
            "Cache de respostas, compressão, reescrita de cabeçalhos e terminação de TLS",
            "O que é específico do domínio",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Gateway, proxy reverso, BFF e service mesh",
        colunas: ["Aspecto", "API gateway", "Proxy reverso", "BFF", "Service mesh"],
        linhas: [
          [
            "Foco",
            "A borda da API: um ponto de entrada para clientes externos",
            "Encaminhar tráfego: TLS, balanceamento, cache",
            "Servir um tipo de cliente com respostas sob medida",
            "A comunicação entre os serviços (tráfego interno)",
          ],
          [
            "Entende a API?",
            "Sim: consumidores, chaves, cotas e políticas por rota",
            "Em geral não: opera sobre HTTP",
            "Sim, para um cliente específico",
            "Opera na rede: mTLS, retentativas, políticas de tráfego",
          ],
          [
            "Lógica de negócio",
            "Nenhuma, só políticas transversais",
            "Nenhuma",
            "Composição e adaptação, não regra de negócio",
            "Nenhuma",
          ],
          [
            "Exemplo",
            "Validar o token, aplicar a cota e rotear `/pedidos`",
            "NGINX terminando TLS na frente do Node.js",
            "`/mobile/home`, que junta três serviços (veja P90)",
            "mTLS entre serviços sem mudar o código",
          ],
        ],
        nota: "O gateway é, na prática, um proxy reverso que entende de API, e muitos produtos fazem os dois papéis (veja D64). Opções: gateways gerenciados dos provedores de nuvem e produtos como Kong, KrakenD e NGINX; a escolha depende de recursos, operação e ecossistema, então confira a documentação e o estado de manutenção. Em Node.js dá para montar um gateway simples com Fastify ou Express e um proxy, mas costuma dar mais trabalho manter do que usar um produto pronto.",
      },
      {
        tipo: "codigo",
        titulo: "As três funções numa configuração de NGINX",
        legenda: "NGINX",
        codigo: [
          "# dentro de http { ... }",
          "limit_req_zone $binary_remote_addr zone=por_ip:10m rate=10r/s;",
          "log_format api '$remote_addr \"$request\" $status $request_time rid=$request_id';",
          "",
          "server {",
          "  access_log /var/log/nginx/api.log api;",
          "  limit_req_status 429; # o padrão seria 503",
          "",
          "  location /api/ {",
          "    auth_request /_validar_token; # delega a checagem do token",
          "    limit_req zone=por_ip burst=20 nodelay; # taxa por IP",
          "    proxy_set_header X-Request-Id $request_id; # id de correlação",
          "    proxy_pass http://servicos;",
          "  }",
          "",
          "  location = /_validar_token { internal; proxy_pass_request_body off; proxy_pass http://auth/validar; }",
          "}",
        ].join("\n"),
        nota: "Exemplo ilustrativo: a build do NGINX precisa incluir o módulo `auth_request`, e atrás de outro proxy `$binary_remote_addr` seria o IP do proxy, então é preciso configurar o IP real do cliente. Em Kong, KrakenD ou gateways de nuvem, as mesmas funções são plugins, políticas ou configuração declarativa, conforme o produto.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Autenticação no gateway ou nos serviços?",
        texto:
          "Nos dois, com papéis diferentes. O gateway faz a checagem **grossa** e barata, uma vez só: token válido, escopo mínimo da rota, cota. Cada serviço faz a checagem **fina**, que depende do domínio (este usuário pode ver este pedido?) e, por **defesa em profundidade**, não confia cegamente na rede interna: valida de novo o token (ou a origem do tráfego, por exemplo com mTLS) e nunca aceita cabeçalhos de identidade vindos de fora. Se o serviço aceita `X-Usuario: 42` de quem chegar até ele, quem alcançar a rede interna vira qualquer usuário. Em Node.js, valide o JWT com uma biblioteca como a `jose` e propague o id de correlação com `AsyncLocalStorage` (veja L84).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Armadilhas do gateway",
        texto:
          "**Ponto único de falha**: rode várias instâncias, com health checks e sem estado local. **Latência extra**: é um salto a mais por requisição; mantenha as políticas leves e meça. **Lógica de negócio no gateway**: vira um monólito disfarçado que todo time precisa editar; deixe só políticas transversais (a composição por cliente é papel do BFF, veja P90). **Limites por instância**: com N instâncias e contadores locais, o limite real é cerca de N vezes maior. **Logs com segredos**: não registre `Authorization`, corpos com senhas nem dados pessoais.",
      },
    ],
    armadilhas: [
      "Achar que, com um gateway, os serviços podem aceitar qualquer requisição interna: um serviço alcançável por outro caminho, ou uma rede comprometida, fica sem autenticação.",
      "Confiar em cabeçalhos de identidade (`X-Usuario`) sem garantir que só o gateway os define: o cliente pode forjá-los se o gateway não os sobrescrever ou removê-los.",
      "Fazer rate limit com contadores em memória em várias instâncias do gateway: o limite efetivo se multiplica; use um armazenamento compartilhado ou limites calculados por instância.",
      "Colocar regra de negócio e composição pesada no gateway: ele vira o gargalo e o monólito que todos editam.",
    ],
    autoteste: [
      {
        pergunta: "Qual é a diferença entre um API gateway e um proxy reverso?",
        resposta:
          "O proxy reverso encaminha tráfego (TLS, balanceamento, cache) sem entender a API. O gateway é um proxy com noção de API: consumidores, chaves, cotas, autenticação e políticas por rota. Muitos produtos fazem os dois papéis.",
      },
      {
        pergunta: "Se o gateway já valida o token, por que o serviço ainda precisa se proteger?",
        resposta:
          "Defesa em profundidade: a rede interna pode ser alcançada por outro caminho, o gateway pode ser contornado ou mal configurado, e a autorização fina (quem pode ver este pedido) é do domínio. O serviço valida de novo o token ou a origem do tráfego.",
      },
    ],
  },
  en: {
    titulo: "API gateway",
    pergunta: "How does an API gateway manage authentication, rate limiting, and logging?",
    porqueEsteMetodo:
      "The gateway shares responsibilities with the reverse proxy, the BFF, the service mesh and the services themselves, and an interview wants to know what lives where. The matrix puts each function and each neighbor side by side, and the decision rule separates what belongs to the gateway from what belongs to the service.",
    resposta30s:
      "An **API gateway** is the **single entry point** in front of the services: it routes each request and applies the cross-cutting policies before the request reaches the service. For **authentication**, it validates the token (signature, issuer, audience, expiry) and forwards the identity; for **rate limiting**, it counts requests per key, user or IP and answers 429 above the limit; for **logging**, it records each call with method, route, status, latency and a correlation id. That does not replace validation in the services themselves (defense in depth), and the gateway should hold no business logic.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "What the gateway does, and what is left to the services",
        colunas: ["Function", "How the gateway does it", "What stays with the services"],
        linhas: [
          [
            "Routing",
            "Maps host, path and method to the right service, with load balancing and retries",
            "Each service handles its own domain",
          ],
          [
            "Authentication",
            "Validates the token (signature, `iss`, `aud`, `exp`) or asks the authorization server, rejects with 401 and forwards the identity to the service (see P29)",
            "Validating the token or the traffic origin again (defense in depth)",
          ],
          [
            "Coarse authorization",
            "Requires the route’s scope, role or API key and rejects with 403",
            "Fine-grained authorization: can this user see this order?",
          ],
          [
            "Rate limiting and quotas",
            "Counts requests per key, user or IP in a window (fixed, sliding or token bucket), keeps the counters in shared storage when there are several instances and answers 429 with `Retry-After`",
            "Domain limits (for example, login attempts per account) and protection of expensive operations",
          ],
          [
            "Logging, metrics and tracing",
            "Records each call (method, route, status, latency, client), generates or propagates the correlation id (`X-Request-Id`, `traceparent`) and exports metrics",
            "Business logs, carrying the same correlation id (see L117)",
          ],
          [
            "Cache, transformation and TLS",
            "Response caching, compression, header rewriting and TLS termination",
            "Whatever is specific to the domain",
          ],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Gateway, reverse proxy, BFF and service mesh",
        colunas: ["Aspect", "API gateway", "Reverse proxy", "BFF", "Service mesh"],
        linhas: [
          [
            "Focus",
            "The API edge: one entry point for external clients",
            "Forwarding traffic: TLS, load balancing, caching",
            "Serving one type of client with tailored responses",
            "Communication between services (internal traffic)",
          ],
          [
            "Understands the API?",
            "Yes: consumers, keys, quotas and per-route policies",
            "Usually not: it operates on HTTP",
            "Yes, for one specific client",
            "Works at the network level: mTLS, retries, traffic policies",
          ],
          [
            "Business logic",
            "None, only cross-cutting policies",
            "None",
            "Composition and adaptation, not business rules",
            "None",
          ],
          [
            "Example",
            "Validate the token, apply the quota and route `/orders`",
            "NGINX terminating TLS in front of Node.js",
            "`/mobile/home`, which combines three services (see P90)",
            "mTLS between services with no code change",
          ],
        ],
        nota: "A gateway is, in practice, a reverse proxy that understands APIs, and many products play both roles (see D64). Options: managed gateways from cloud providers and products such as Kong, KrakenD and NGINX; the choice depends on features, operations and ecosystem, so check the documentation and maintenance status. In Node.js you can build a simple gateway with Fastify or Express and a proxy, but it is usually more work to maintain than using a ready-made product.",
      },
      {
        tipo: "codigo",
        titulo: "The three functions in an NGINX configuration",
        legenda: "NGINX",
        codigo: [
          "# inside http { ... }",
          "limit_req_zone $binary_remote_addr zone=per_ip:10m rate=10r/s;",
          "log_format api '$remote_addr \"$request\" $status $request_time rid=$request_id';",
          "",
          "server {",
          "  access_log /var/log/nginx/api.log api;",
          "  limit_req_status 429; # the default would be 503",
          "",
          "  location /api/ {",
          "    auth_request /_validate_token; # delegates the token check",
          "    limit_req zone=per_ip burst=20 nodelay; # rate per IP",
          "    proxy_set_header X-Request-Id $request_id; # correlation id",
          "    proxy_pass http://services;",
          "  }",
          "",
          "  location = /_validate_token { internal; proxy_pass_request_body off; proxy_pass http://auth/validate; }",
          "}",
        ].join("\n"),
        nota: "An illustrative example: your NGINX build must include the `auth_request` module, and behind another proxy `$binary_remote_addr` would be the proxy’s IP, so you need to configure the real client IP. In Kong, KrakenD or cloud gateways, the same functions are plugins, policies or declarative configuration, depending on the product.",
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Authentication in the gateway or in the services?",
        texto:
          "In both, with different roles. The gateway does the **coarse**, cheap check, once: valid token, minimum scope for the route, quota. Each service does the **fine** check, which depends on the domain (can this user see this order?) and, for **defense in depth**, does not blindly trust the internal network: it validates the token again (or the traffic origin, for example with mTLS) and never accepts identity headers coming from outside. If a service accepts `X-User: 42` from whoever reaches it, anyone who gets into the internal network becomes any user. In Node.js, validate the JWT with a library such as `jose` and propagate the correlation id with `AsyncLocalStorage` (see L84).",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Gateway pitfalls",
        texto:
          "**Single point of failure**: run several instances, with health checks and no local state. **Extra latency**: it is one more hop per request; keep policies light and measure. **Business logic in the gateway**: it becomes a disguised monolith that every team has to edit; keep only cross-cutting policies (per-client composition is the BFF’s job, see P90). **Per-instance limits**: with N instances and local counters, the real limit is about N times higher. **Secrets in logs**: do not record `Authorization`, bodies with passwords or personal data.",
      },
    ],
    armadilhas: [
      "Thinking that, with a gateway, services can accept any internal request: a service reachable by another path, or a compromised network, is left unauthenticated.",
      "Trusting identity headers (`X-User`) without guaranteeing that only the gateway sets them: the client can forge them if the gateway does not overwrite or remove them.",
      "Rate limiting with in-memory counters across several gateway instances: the effective limit multiplies; use shared storage or limits calculated per instance.",
      "Putting business logic and heavy composition in the gateway: it becomes the bottleneck and the monolith everyone edits.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between an API gateway and a reverse proxy?",
        resposta:
          "A reverse proxy forwards traffic (TLS, load balancing, caching) without understanding the API. A gateway is a proxy aware of the API: consumers, keys, quotas, authentication and per-route policies. Many products play both roles.",
      },
      {
        pergunta: "If the gateway already validates the token, why must the service still protect itself?",
        resposta:
          "Defense in depth: the internal network can be reached by another path, the gateway can be bypassed or misconfigured, and fine-grained authorization (who can see this order) belongs to the domain. The service validates the token or the traffic origin again.",
      },
    ],
  },
};
