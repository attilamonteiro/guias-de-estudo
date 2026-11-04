import type { Pergunta } from "../../tipos";

// R32 · Reverse proxy
export const r32: Pergunta = {
  numero: 132,
  modulo: "roadmap-intermediario",
  metodo: "feynman",
  pt: {
    titulo: "Reverse proxy",
    pergunta: "O que é um reverse proxy e como ele é útil no desenvolvimento de backend?",
    porqueEsteMetodo:
      "O reverse proxy se entende pela analogia da recepção de um hotel. Ela mostra as funções, e o ponto onde quebra (ponto único de falha) mostra o cuidado necessário.",
    resposta30s:
      "Um **reverse proxy** fica na frente dos servidores de aplicação: o cliente fala só com ele, e ele **encaminha** para o servidor certo (por host, caminho ou cabeçalho). Serve para **balancear carga**, **terminar TLS**, **cachear**, **rotear** vários serviços sob um domínio, **proteger** (esconde a topologia, rate limit, WAF, DDoS) e **trocar serviços** sem mudar a URL pública. É diferente de um *forward proxy*, que fica na frente dos clientes.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A recepção de um hotel: você nunca vai direto ao quarto de ninguém. Fala com a recepção, que confere quem você é, direciona ao quarto certo e protege os hóspedes.",
        tecnico:
          "Exemplos: NGINX, HAProxy, Envoy, Traefik, Cloudflare. As regras de roteamento olham o host (`api.x.com`), o caminho (`/admin` vs `/loja`) ou cabeçalhos. Funções comuns: balanceamento de carga, terminação de TLS, compressão e cache, autenticação na borda, proteção contra ataques e deploys sem mudar a URL pública.",
        limite:
          "A recepção é um ponto só: se cair, ninguém entra. O reverse proxy também é um **ponto único de falha** (precisa de redundância) e acrescenta um salto de latência.",
      },
      {
        tipo: "tabela",
        titulo: "Forward vs reverse proxy",
        colunas: ["", "Forward", "Reverse"],
        linhas: [
          ["Fica na frente de", "Clientes", "Servidores"],
          ["Quem o configura", "O cliente ou a organização", "O dono do serviço"],
          ["Exemplo", "Proxy corporativo, VPN", "NGINX, Cloudflare, API gateway"],
          ["Esconde", "A identidade do cliente", "A topologia do servidor"],
        ],
      },
    ],
    armadilhas: [
      "Um proxy único sem redundância.",
      "Esquecer de repassar o IP real do cliente (`X-Forwarded-For`).",
      "Confiar em `X-Forwarded-*` vindo de fora do proxy.",
      "Cachear no proxy uma resposta específica de usuário.",
    ],
    autoteste: [
      {
        pergunta: "Qual a diferença entre proxy e reverse proxy?",
        resposta:
          "O proxy (forward) representa os clientes diante da internet; o reverse proxy representa os servidores diante dos clientes.",
      },
      {
        pergunta: "Cite três usos de um reverse proxy.",
        resposta: "Balanceamento de carga, terminação de TLS, cache, roteamento e proteção contra ataques.",
      },
    ],
  },
  en: {
    titulo: "Reverse proxy",
    pergunta: "What is a reverse proxy and how is it useful in backend development?",
    porqueEsteMetodo:
      "A reverse proxy is understood through the hotel front-desk analogy. It shows the functions, and the point where it breaks (a single point of failure) shows the care needed.",
    resposta30s:
      "A **reverse proxy** sits in front of the application servers: the client talks only to it, and it **forwards** to the right server (by host, path or header). It serves to **load balance**, **terminate TLS**, **cache**, **route** several services under one domain, **protect** (hides the topology, rate limiting, WAF, DDoS) and **swap services** without changing the public URL. It differs from a *forward proxy*, which sits in front of clients.",
    blocos: [
      {
        tipo: "analogia",
        simples:
          "A hotel front desk: you never go straight to anyone’s room. You talk to the desk, which checks who you are, sends you to the right room and protects the guests.",
        tecnico:
          "Examples: NGINX, HAProxy, Envoy, Traefik, Cloudflare. Routing rules look at the host (`api.x.com`), the path (`/admin` vs `/shop`) or headers. Common functions: load balancing, TLS termination, compression and caching, authentication at the edge, attack protection and deploys without changing the public URL.",
        limite:
          "The desk is a single point: if it falls, nobody gets in. The reverse proxy is also a **single point of failure** (it needs redundancy) and adds a latency hop.",
      },
      {
        tipo: "tabela",
        titulo: "Forward vs reverse proxy",
        colunas: ["", "Forward", "Reverse"],
        linhas: [
          ["Sits in front of", "Clients", "Servers"],
          ["Who configures it", "The client or the organization", "The service owner"],
          ["Example", "Corporate proxy, VPN", "NGINX, Cloudflare, API gateway"],
          ["Hides", "The client’s identity", "The server topology"],
        ],
      },
    ],
    armadilhas: [
      "A single proxy with no redundancy.",
      "Forgetting to pass on the client’s real IP (`X-Forwarded-For`).",
      "Trusting `X-Forwarded-*` coming from outside the proxy.",
      "Caching a user-specific response in the proxy.",
    ],
    autoteste: [
      {
        pergunta: "What is the difference between a proxy and a reverse proxy?",
        resposta:
          "The (forward) proxy represents clients to the internet; the reverse proxy represents servers to clients.",
      },
      {
        pergunta: "Name three uses of a reverse proxy.",
        resposta: "Load balancing, TLS termination, caching, routing and attack protection.",
      },
    ],
  },
};
