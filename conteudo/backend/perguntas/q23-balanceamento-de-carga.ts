import type { Pergunta } from "../../tipos";

// Q23 · Balanceamento de carga
export const q23: Pergunta = {
  numero: 23,
  modulo: "design-de-sistemas",
  metodo: "compare",
  pt: {
    titulo: "Balanceamento de carga",
    pergunta: "Quais são os benefícios do balanceamento de carga e que tipos de balanceadores de carga existem?",
    porqueEsteMetodo:
      "A pergunta tem duas partes, benefícios e tipos, e os tipos se diferenciam em eixos diferentes (camada, forma de implantação, algoritmo). Tabelas por eixo evitam misturar as categorias.",
    resposta30s:
      "Um balanceador de carga distribui as requisições entre vários servidores. Benefícios: **escala horizontal**, **alta disponibilidade** (health checks tiram nós doentes), **deploys sem parada**, um **endpoint estável** com TLS terminado e um ponto para **proteção** (WAF, rate limit). Tipos: por camada (**L4** rápido e cego ao HTTP, **L7** que roteia por conteúdo), por implantação (hardware, software, gerenciado, DNS/GSLB) e por algoritmo (round robin, menos conexões, hash consistente…).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Benefícios",
        passos: [
          {
            titulo: "Escala horizontal",
            texto: "Adicionar servidores aumenta a capacidade, sem o cliente perceber.",
          },
          {
            titulo: "Alta disponibilidade",
            texto: "Health checks removem nós que falham da rotação; o tráfego segue para os saudáveis.",
          },
          {
            titulo: "Deploy sem parada",
            texto: "Rolling, blue-green e canary: tira um nó por vez, ou desvia 5% do tráfego para a versão nova.",
          },
          {
            titulo: "Um endpoint estável",
            texto:
              "Os clientes não conhecem os servidores; o balanceador pode terminar TLS, comprimir e reutilizar conexões.",
          },
          {
            titulo: "Ponto de proteção",
            texto: "Lugar natural para WAF, rate limiting e absorção de DDoS.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "Por camada",
        colunas: ["", "L4 (transporte)", "L7 (aplicação)"],
        linhas: [
          ["Decide por", "IP e porta (TCP/UDP)", "Host, path, cabeçalhos, cookies"],
          ["Enxerga HTTP?", "Não", "Sim"],
          [
            "Pontos fortes",
            "Muito rápido, baixa latência, qualquer protocolo",
            "Roteamento por URL, TLS offload, retries, A/B, WAF, cache",
          ],
          ["Custo", "Menor", "Maior (processa cada requisição)"],
          ["Exemplos", "AWS NLB, HAProxy (modo tcp), IPVS", "AWS ALB, NGINX, Envoy, HAProxy (modo http)"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Por forma de implantação",
        colunas: ["Tipo", "Exemplos", "Nota"],
        linhas: [
          ["Hardware", "F5 BIG-IP, Citrix ADC", "Alto desempenho e custo; ciclo de compra"],
          ["Software", "NGINX, HAProxy, Envoy", "Flexível e programável; você opera"],
          [
            "Gerenciado na nuvem",
            "AWS ALB/NLB, Google Cloud LB, Azure LB/App Gateway",
            "Sem operar; redundância embutida",
          ],
          ["DNS / GSLB", "Route 53, Cloudflare", "Distribui entre regiões; failover lento por causa do TTL"],
          ["Lado do cliente / service mesh", "gRPC, Istio, Linkerd", "O cliente (ou um proxy ao lado) escolhe o nó"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Algoritmos",
        colunas: ["Algoritmo", "Como decide", "Quando"],
        linhas: [
          ["Round robin", "Um de cada vez, em ordem", "Servidores iguais, requisições parecidas"],
          ["Round robin ponderado", "Round robin com pesos", "Servidores de capacidades diferentes"],
          ["Menos conexões", "Envia a quem tem menos conexões ativas", "Requisições de duração muito variável"],
          ["Menor tempo de resposta", "Envia ao mais rápido no momento", "Latências heterogêneas"],
          [
            "IP hash / hash consistente",
            "Mesmo cliente (ou chave) → mesmo servidor",
            "Afinidade e cache local; menos remanejamento ao mudar o conjunto",
          ],
          [
            "Dois escolhidos ao acaso",
            "Sorteia 2 nós e fica com o menos carregado",
            "Barato e evita sobrecarregar um nó",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "O balanceador também é ponto único de falha",
        texto:
          "Use pares ativo-ativo ou ativo-passivo (VRRP/keepalived), anycast, ou o balanceador gerenciado da nuvem, que já é redundante.",
      },
    ],
    armadilhas: [
      "Sticky sessions para esconder estado no servidor: ao cair o nó, a sessão se perde e a carga fica desigual.",
      "Health check raso (porta aberta): a aplicação pode estar travada ou sem banco. Use um endpoint que exercite o serviço.",
      "Round robin com requisições de custos muito diferentes: um nó fica sobrecarregado.",
      "Achar que o balanceador resolve gargalo de banco: ele só distribui a camada de aplicação.",
      "Retries no balanceador sem controle: multiplicam a carga de quem já está sofrendo.",
    ],
    autoteste: [
      {
        pergunta: "Quando escolher L7 em vez de L4?",
        resposta:
          "Quando é preciso decidir pelo conteúdo da requisição (path, host, cabeçalho, cookie), terminar TLS ou fazer retries e roteamento inteligente.",
      },
      {
        pergunta: "Por que um health check de porta aberta é frágil?",
        resposta:
          "Porque a porta pode estar aberta com a aplicação travada ou sem acesso ao banco; o check deve exercitar a aplicação.",
      },
    ],
  },
  en: {
    titulo: "Load balancing",
    pergunta: "What are the benefits of load balancing and what types of load balancers exist?",
    porqueEsteMetodo:
      "The question has two parts, benefits and types, and the types differ along different axes (layer, deployment form, algorithm). One table per axis avoids mixing the categories.",
    resposta30s:
      "A load balancer spreads requests across several servers. Benefits: **horizontal scaling**, **high availability** (health checks remove sick nodes), **zero-downtime deploys**, a **stable endpoint** with TLS terminated, and one place for **protection** (WAF, rate limiting). Types: by layer (**L4** fast and HTTP-blind, **L7** routing by content), by deployment (hardware, software, managed, DNS/GSLB) and by algorithm (round robin, least connections, consistent hash…).",
    blocos: [
      {
        tipo: "passos",
        titulo: "Benefits",
        passos: [
          {
            titulo: "Horizontal scaling",
            texto: "Adding servers raises capacity, without the client noticing.",
          },
          {
            titulo: "High availability",
            texto: "Health checks remove failing nodes from rotation; traffic flows to the healthy ones.",
          },
          {
            titulo: "Zero-downtime deploys",
            texto:
              "Rolling, blue-green and canary: take one node out at a time, or divert 5% of traffic to the new version.",
          },
          {
            titulo: "A stable endpoint",
            texto: "Clients do not know the servers; the balancer can terminate TLS, compress and reuse connections.",
          },
          {
            titulo: "A protection point",
            texto: "The natural place for a WAF, rate limiting and DDoS absorption.",
          },
        ],
      },
      {
        tipo: "tabela",
        titulo: "By layer",
        colunas: ["", "L4 (transport)", "L7 (application)"],
        linhas: [
          ["Decides by", "IP and port (TCP/UDP)", "Host, path, headers, cookies"],
          ["Sees HTTP?", "No", "Yes"],
          ["Strengths", "Very fast, low latency, any protocol", "URL routing, TLS offload, retries, A/B, WAF, cache"],
          ["Cost", "Lower", "Higher (processes every request)"],
          ["Examples", "AWS NLB, HAProxy (tcp mode), IPVS", "AWS ALB, NGINX, Envoy, HAProxy (http mode)"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "By deployment form",
        colunas: ["Type", "Examples", "Note"],
        linhas: [
          ["Hardware", "F5 BIG-IP, Citrix ADC", "High performance and cost; procurement cycle"],
          ["Software", "NGINX, HAProxy, Envoy", "Flexible and programmable; you operate it"],
          ["Managed cloud", "AWS ALB/NLB, Google Cloud LB, Azure LB/App Gateway", "No operations; built-in redundancy"],
          ["DNS / GSLB", "Route 53, Cloudflare", "Spreads across regions; slow failover because of TTL"],
          ["Client-side / service mesh", "gRPC, Istio, Linkerd", "The client (or a sidecar proxy) picks the node"],
        ],
      },
      {
        tipo: "tabela",
        titulo: "Algorithms",
        colunas: ["Algorithm", "How it decides", "When"],
        linhas: [
          ["Round robin", "One at a time, in order", "Equal servers, similar requests"],
          ["Weighted round robin", "Round robin with weights", "Servers of different capacities"],
          [
            "Least connections",
            "Sends to whoever has the fewest active connections",
            "Requests with very variable duration",
          ],
          ["Least response time", "Sends to the fastest right now", "Heterogeneous latencies"],
          [
            "IP hash / consistent hash",
            "Same client (or key) → same server",
            "Affinity and local cache; less reshuffling when the set changes",
          ],
          [
            "Power of two choices",
            "Picks 2 random nodes and takes the less loaded",
            "Cheap and avoids overloading one node",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "The balancer is also a single point of failure",
        texto:
          "Use active-active or active-passive pairs (VRRP/keepalived), anycast, or the cloud’s managed balancer, which is already redundant.",
      },
    ],
    armadilhas: [
      "Sticky sessions to hide state on the server: when the node dies the session is lost and load becomes uneven.",
      "A shallow health check (open port): the application may be stuck or have no database. Use an endpoint that exercises the service.",
      "Round robin with requests of very different cost: one node ends up overloaded.",
      "Believing the balancer fixes a database bottleneck: it only spreads the application tier.",
      "Uncontrolled retries at the balancer: they multiply load on a system that is already struggling.",
    ],
    autoteste: [
      {
        pergunta: "When would you choose L7 over L4?",
        resposta:
          "When you must decide by request content (path, host, header, cookie), terminate TLS or do retries and smart routing.",
      },
      {
        pergunta: "Why is an open-port health check fragile?",
        resposta:
          "Because the port may be open while the application is stuck or cannot reach the database; the check should exercise the application.",
      },
    ],
  },
};
