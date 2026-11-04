import type { Pergunta } from "../../tipos";

// Q15 · Milhões de requisições por segundo
export const q15: Pergunta = {
  numero: 15,
  modulo: "cache-e-desempenho",
  metodo: "firstprinciples",
  pt: {
    titulo: "Milhões de requisições por segundo",
    pergunta: "Como você escalaria um sistema backend para lidar com milhões de requisições por segundo?",
    porqueEsteMetodo:
      "Listar tecnologias não responde. Partindo de primeiros princípios (a conta da vazão) e acrescentando uma restrição por vez, cada componente aparece como remédio de um gargalo concreto.",
    resposta30s:
      "Parta da conta: **vazão = concorrência ÷ latência** (Lei de Little). 1 milhão de req/s a 50 ms são ~50 mil requisições em voo, muito além de uma máquina. Então: app **stateless** atrás de **load balancers** com autoscaling; **cache** e **CDN** para a maior parte nunca chegar ao banco; **réplicas de leitura**, **sharding** e filas para a escrita; e proteção (rate limit, backpressure, degradação graciosa). Meça, ache o gargalo, trate, repita.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "A conta antes das ferramentas (ordens de grandeza)",
        colunas: ["Item", "Valor"],
        linhas: [
          ["Meta", "1.000.000 req/s"],
          ["Latência média", "50 ms"],
          ["Requisições em voo (Lei de Little)", "1.000.000 × 0,05 = 50.000"],
          ["Um servidor (hipótese para trabalho simples)", "5.000 a 10.000 req/s"],
          ["Servidores só para a vazão", "100 a 200, mais folga de ~2× para picos e falhas"],
        ],
        nota: "Os números são hipóteses para mostrar o raciocínio; o que se mede de verdade é a capacidade do seu serviço em teste de carga.",
      },
      {
        tipo: "passos",
        titulo: "Construindo, uma restrição por vez",
        passos: [
          {
            titulo: "Defina o alvo e meça",
            texto:
              "Leitura ou escrita? Tamanho do payload, p99 de latência, picos (10×?), consistência exigida. Sem isso toda escolha é chute.",
          },
          {
            titulo: "Um servidor satura",
            texto:
              "CPU, memória ou rede chegam ao limite e ele é ponto único de falha. → Vários servidores **stateless** atrás de um load balancer (sessões em token ou Redis) e autoscaling.",
          },
          {
            titulo: "O banco vira o gargalo (quase sempre o primeiro)",
            texto:
              "→ Cache (Redis) na frente e réplicas de leitura: tiram 90% a 99% das leituras do primário. Indexação e queries otimizadas.",
          },
          {
            titulo: "O estático e o repetido não deveriam chegar à origem",
            texto: "→ CDN para arquivos, páginas e respostas cacheáveis; compressão, keep-alive, HTTP/2.",
          },
          {
            titulo: "A escrita não escala em um nó só",
            texto:
              "→ Sharding por chave bem distribuída (user_id), bancos que escalam escrita, gravações em lote, um log/fila (Kafka) para absorver picos; o que não é imediato vira assíncrono.",
          },
          {
            titulo: "Uma região é risco e é longe de parte dos usuários",
            texto: "→ Várias regiões ou zonas, DNS geográfico ou anycast, replicação entre regiões.",
          },
          {
            titulo: "Sob sobrecarga o sistema inteiro cai",
            texto:
              "→ Rate limit, timeouts, circuit breakers, bulkheads, backpressure e load shedding: descartar o menos importante para preservar o essencial.",
          },
          {
            titulo: "Você precisa saber antes que o tráfego chegue",
            texto:
              "→ Teste de carga (k6, Locust), métricas e tracing, planejamento de capacidade. Ache o próximo gargalo; a parte serial do sistema limita o ganho (Lei de Amdahl).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "O que a entrevista quer ouvir",
        texto:
          "Perguntas antes de tecnologias (leitura ou escrita? quanta consistência? quais picos?) e o raciocínio **gargalo → remédio**. Dizer “Kafka, Redis, Kubernetes” sem dizer qual problema cada um resolve é a resposta fraca.",
      },
    ],
    armadilhas: [
      "Listar tecnologias sem dizer qual gargalo cada uma resolve.",
      "Escalar a aplicação e esquecer o banco, que é quem satura primeiro.",
      "Shard desbalanceado ou hot key: um nó recebe a maior parte do tráfego e vira o gargalo.",
      "Cache vazio depois de uma falha: a enxurrada de misses derruba o banco (stampede).",
      "Otimizar antes de medir.",
    ],
    autoteste: [
      {
        pergunta: "Por que 1M req/s a 50 ms exigem ~50 mil requisições em voo?",
        resposta: "Lei de Little: concorrência = vazão × latência = 1.000.000 × 0,05 s = 50.000.",
      },
      {
        pergunta: "Qual costuma ser o primeiro gargalo ao escalar um backend?",
        resposta: "O banco de dados. Por isso cache, réplicas de leitura e CDN vêm antes de qualquer outra coisa.",
      },
    ],
  },
  en: {
    titulo: "Millions of requests per second",
    pergunta: "How would you scale a backend system to handle millions of requests per second?",
    porqueEsteMetodo:
      "Listing technologies does not answer it. Starting from first principles (the throughput arithmetic) and adding one constraint at a time, each component appears as the remedy for a concrete bottleneck.",
    resposta30s:
      "Start from the math: **throughput = concurrency ÷ latency** (Little’s Law). 1 million req/s at 50 ms is ~50 thousand requests in flight, far beyond one machine. So: **stateless** app behind **load balancers** with autoscaling; **cache** and **CDN** so most traffic never reaches the database; **read replicas**, **sharding** and queues for writes; and protection (rate limiting, backpressure, graceful degradation). Measure, find the bottleneck, treat it, repeat.",
    blocos: [
      {
        tipo: "tabela",
        titulo: "The math before the tools (orders of magnitude)",
        colunas: ["Item", "Value"],
        linhas: [
          ["Target", "1,000,000 req/s"],
          ["Average latency", "50 ms"],
          ["Requests in flight (Little’s Law)", "1,000,000 × 0.05 = 50,000"],
          ["One server (assumption for simple work)", "5,000 to 10,000 req/s"],
          ["Servers for throughput alone", "100 to 200, plus ~2× headroom for spikes and failures"],
        ],
        nota: "The numbers are assumptions to show the reasoning; what you really measure is your own service’s capacity in a load test.",
      },
      {
        tipo: "passos",
        titulo: "Building up, one constraint at a time",
        passos: [
          {
            titulo: "Define the target and measure",
            texto:
              "Read or write heavy? Payload size, p99 latency, spikes (10×?), required consistency. Without it every choice is a guess.",
          },
          {
            titulo: "One server saturates",
            texto:
              "CPU, memory or network hit the limit and it is a single point of failure. → Many **stateless** servers behind a load balancer (sessions in a token or Redis) and autoscaling.",
          },
          {
            titulo: "The database becomes the bottleneck (almost always first)",
            texto:
              "→ Cache (Redis) in front and read replicas: they remove 90% to 99% of reads from the primary. Indexing and optimized queries.",
          },
          {
            titulo: "Static and repeated content should not reach the origin",
            texto: "→ CDN for files, pages and cacheable responses; compression, keep-alive, HTTP/2.",
          },
          {
            titulo: "Writes do not scale on a single node",
            texto:
              "→ Sharding by a well-distributed key (user_id), databases that scale writes, batched writes, a log/queue (Kafka) to absorb spikes; whatever is not immediate becomes asynchronous.",
          },
          {
            titulo: "One region is a risk and far from some users",
            texto: "→ Several regions or zones, geo DNS or anycast, cross-region replication.",
          },
          {
            titulo: "Under overload the whole system falls over",
            texto:
              "→ Rate limiting, timeouts, circuit breakers, bulkheads, backpressure and load shedding: drop the least important to preserve the essential.",
          },
          {
            titulo: "You must know before the traffic arrives",
            texto:
              "→ Load testing (k6, Locust), metrics and tracing, capacity planning. Find the next bottleneck; the serial part of the system limits the gain (Amdahl’s Law).",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "What the interviewer wants to hear",
        texto:
          "Questions before technologies (read or write heavy? how much consistency? what spikes?) and the **bottleneck → remedy** reasoning. Saying “Kafka, Redis, Kubernetes” without saying which problem each solves is the weak answer.",
      },
    ],
    armadilhas: [
      "Listing technologies without saying which bottleneck each solves.",
      "Scaling the application and forgetting the database, which saturates first.",
      "Unbalanced shard or hot key: one node gets most of the traffic and becomes the bottleneck.",
      "An empty cache after a failure: the flood of misses takes the database down (stampede).",
      "Optimizing before measuring.",
    ],
    autoteste: [
      {
        pergunta: "Why does 1M req/s at 50 ms need ~50 thousand requests in flight?",
        resposta: "Little’s Law: concurrency = throughput × latency = 1,000,000 × 0.05 s = 50,000.",
      },
      {
        pergunta: "What is usually the first bottleneck when scaling a backend?",
        resposta: "The database. That is why cache, read replicas and a CDN come before anything else.",
      },
    ],
  },
};
