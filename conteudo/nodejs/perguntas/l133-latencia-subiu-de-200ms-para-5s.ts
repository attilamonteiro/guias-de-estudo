import type { Pergunta } from "../../tipos";

// L133 · Latência subiu de repente
export const l133: Pergunta = {
  numero: 233,
  modulo: "linkedin-cenarios",
  metodo: "whys",
  pt: {
    titulo: "Latência subiu de repente",
    pergunta:
      "Cenário 1: o tempo de resposta da sua API sobe de repente de 200 ms para 5 segundos. O que você verificaria?",
    porqueEsteMetodo:
      "Em perguntas de cenário, o que se avalia é o raciocínio, não uma lista de ferramentas. Encadear “por quês” leva do sintoma até onde o tempo está sendo gasto, e é dessa cadeia que sai a ordem de investigação.",
    resposta30s:
      "Comece por **o que mudou** (deploy, configuração, tráfego) e por **onde o tempo está sendo gasto**, olhando métricas e traces por rota antes de qualquer palpite. Depois suba do mais barato ao mais caro: **dependências externas, banco, pools de conexão, event loop, CPU e memória, rede**. Um salto de 200 ms para 5 s quase sempre é **espera** (um recurso saturado ou um timeout), não trabalho a mais; mitigue primeiro (reverter, escalar) e só então ache a causa-raiz.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Por que a resposta passou de 200 ms para 5 s “de repente”?",
            resposta:
              "Porque código não fica lento sozinho. “De repente” aponta para uma mudança (deploy, configuração, migração, campanha que trouxe tráfego) ou para um limite que acabou de ser atingido (pool, memória, disco, cota).",
          },
          {
            pergunta: "Por que o efeito é de segundos e não de milissegundos a mais?",
            resposta:
              "Porque o tempo extra quase nunca é trabalho: é **espera**, numa fila ou num timeout. E 5 s é um número redondo, que lembra um timeout configurado (cliente HTTP, DNS, pool, balanceador). Procure um valor igual no código e na configuração.",
          },
          {
            pergunta: "Por que as requisições esperam em vez de trabalhar?",
            resposta:
              "Porque um recurso compartilhado saturou: o banco ficou lento e as conexões do pool ficam presas, uma API externa não responde, o laço de eventos está bloqueado (veja L30) ou o host está sem CPU ou memória.",
          },
          {
            pergunta: "Por que o recurso saturou justamente agora?",
            resposta:
              "Porque demanda e capacidade deixaram de se casar: mais tráfego, uma consulta mais cara (índice perdido, plano que mudou, N+1), uma dependência degradada, um vazamento de memória (veja L110) ou retentativas que multiplicam a carga.",
          },
          {
            pergunta: "Por que o usuário sentiu 5 s em vez de um erro rápido?",
            resposta:
              "Porque faltam limites: timeouts curtos, fila do pool limitada, circuit breaker, controle de carga. Sem eles o sistema degrada devagar, segura conexões e piora o próprio problema (veja L105).",
          },
        ],
        causaRaiz:
          "A latência explode quando as requisições passam a **esperar por um recurso saturado**. Descubra qual (banco, dependência, event loop, CPU ou rede) medindo onde o tempo vai, e adicione limites para falhar rápido da próxima vez.",
      },
      {
        tipo: "passos",
        titulo: "Triagem, do mais barato ao mais caro",
        passos: [
          {
            titulo: "O que mudou?",
            texto:
              "Compare o início da curva com deploys, feature flags, configuração, migrações, certificados e tarefas agendadas. Se bater, reverter é a ação mais barata e muitas vezes já resolve.",
          },
          {
            titulo: "Qual o alcance?",
            texto:
              "Latência por rota, p50, p95 e p99, taxa de erros e vazão. Todas as rotas lentas apontam para um recurso compartilhado; uma só aponta para a consulta ou o código dessa rota.",
          },
          {
            titulo: "Dependências externas",
            texto:
              "Tempos de chamada ao banco, ao cache e a APIs de terceiros, DNS e páginas de status. Um trace distribuído mostra qual trecho cresceu; um trecho que “bate no teto” de 5 s indica timeout.",
          },
          {
            titulo: "Banco de dados",
            texto:
              "Consultas lentas (log de consultas lentas, `EXPLAIN`), locks e transações penduradas, conexões ativas contra o limite, CPU e disco do banco.",
          },
          {
            titulo: "Pools e filas",
            texto:
              "Tempo para obter uma conexão do pool (veja L93), pool de threads do libuv saturado, sockets e keep-alive. Esperar por conexão é invisível se você só mede a consulta.",
          },
          {
            titulo: "O processo Node.js",
            texto:
              "Atraso do event loop (veja L30), um núcleo em 100% de CPU, memória e coleta de lixo crescendo (veja L110), logs de requisições lentas. Sinal: rotas que nem usam banco também ficaram lentas.",
          },
          {
            titulo: "Infraestrutura e rede",
            texto:
              "CPU e memória do host, limitação (throttling) do contêiner, disco, rede, balanceador, instâncias doentes e limite de descritores de arquivo. Confira se uma única instância está degradada.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Como responder na entrevista",
        texto:
          "Mostre método: faça perguntas de esclarecimento (desde quando? todas as rotas? alguma mudança?), **mitigue antes de explicar** (reverter, escalar, desviar tráfego) e **meça antes de mexer**. A ordem é do barato e reversível ao caro: mudanças e métricas primeiro, perfil de CPU e heap por último.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Não chute otimizações",
        texto:
          "Adicionar cache ou subir instâncias sem saber onde o tempo vai pode não ajudar, ou piorar (mais instâncias significam mais conexões no banco). Reiniciar o serviço pode esconder a causa: colete evidências (métricas, snapshot de heap, traces) antes. E cuidado com retentativas agressivas, que amplificam a degradação. Veja também T24 e L118.",
      },
    ],
    armadilhas: [
      "Começar por um palpite (cache, mais instâncias, outro banco) em vez de medir onde o tempo é gasto.",
      "Olhar só a média: p95 e p99 revelam a cauda que o usuário sente, e a média esconde o problema.",
      "Reiniciar o serviço para “resolver” e perder a evidência, deixando a causa voltar.",
      "Presumir que o Node.js é o culpado: o teto de 5 s costuma ser um timeout de dependência, e retentativas sem limite podem transformar uma lentidão em avalanche.",
    ],
    autoteste: [
      {
        pergunta: "O que sugere um valor redondo como 5 s, e o que você faria com isso?",
        resposta:
          "Sugere um timeout configurado (cliente HTTP, DNS, pool, balanceador). Procure no código e na configuração um valor igual e veja no trace qual chamada chega a esse teto: normalmente é uma dependência fora do ar ou um pool esgotado.",
      },
      {
        pergunta: "Como diferenciar banco lento de event loop bloqueado?",
        resposta:
          "Com banco lento, os trechos de consulta e a espera por conexão ficam longos, mas a CPU do Node.js e o atraso do event loop continuam baixos. Com o event loop bloqueado, o atraso é alto, um núcleo fica em 100% e até rotas sem banco ficam lentas.",
      },
    ],
  },
  en: {
    titulo: "Sudden latency spike",
    pergunta: "Scenario 1: Your API response time suddenly increases from 200ms to 5 seconds. What would you check?",
    porqueEsteMetodo:
      "In scenario questions, what gets judged is the reasoning, not a list of tools. Chaining “whys” leads from the symptom to where the time is being spent, and that chain produces the order of investigation.",
    resposta30s:
      "Start with **what changed** (a deploy, configuration, traffic) and **where the time is going**, reading metrics and traces per route before any guess. Then move from cheapest to most expensive: **external dependencies, the database, connection pools, the event loop, CPU and memory, the network**. A jump from 200 ms to 5 s is almost always **waiting** (a saturated resource or a timeout), not extra work; mitigate first (roll back, scale) and only then find the root cause.",
    blocos: [
      {
        tipo: "porques",
        cadeia: [
          {
            pergunta: "Why did the response go from 200 ms to 5 s “suddenly”?",
            resposta:
              "Because code does not get slow on its own. “Suddenly” points to a change (a deploy, configuration, a migration, a campaign that brought traffic) or to a limit that was just reached (pool, memory, disk, quota).",
          },
          {
            pergunta: "Why is the effect seconds rather than a few extra milliseconds?",
            resposta:
              "Because the extra time is almost never work: it is **waiting**, in a queue or on a timeout. And 5 s is a round number, which looks like a configured timeout (HTTP client, DNS, pool, load balancer). Look for an equal value in code and configuration.",
          },
          {
            pergunta: "Why are requests waiting instead of working?",
            resposta:
              "Because a shared resource saturated: the database slowed down and pool connections are stuck, an external API is not answering, the event loop is blocked (see L30) or the host is out of CPU or memory.",
          },
          {
            pergunta: "Why did the resource saturate right now?",
            resposta:
              "Because demand and capacity stopped matching: more traffic, a costlier query (lost index, changed plan, N+1), a degraded dependency, a memory leak (see L110) or retries that multiply the load.",
          },
          {
            pergunta: "Why did users feel 5 s instead of a fast error?",
            resposta:
              "Because limits are missing: short timeouts, a bounded pool queue, a circuit breaker, load shedding. Without them the system degrades slowly, holds on to connections and worsens its own problem (see L105).",
          },
        ],
        causaRaiz:
          "Latency explodes when requests start **waiting on a saturated resource**. Find which one (database, dependency, event loop, CPU or network) by measuring where the time goes, and add limits so it fails fast next time.",
      },
      {
        tipo: "passos",
        titulo: "Triage, cheapest to most expensive",
        passos: [
          {
            titulo: "What changed?",
            texto:
              "Line up the start of the curve with deploys, feature flags, configuration, migrations, certificates and scheduled jobs. If it matches, rolling back is the cheapest action and often fixes it outright.",
          },
          {
            titulo: "What is the scope?",
            texto:
              "Latency per route, p50, p95 and p99, error rate and throughput. Every route slow points to a shared resource; a single route points to that route’s query or code.",
          },
          {
            titulo: "External dependencies",
            texto:
              "Call times to the database, cache and third-party APIs, DNS and status pages. A distributed trace shows which span grew; a span that “hits the ceiling” at 5 s indicates a timeout.",
          },
          {
            titulo: "Database",
            texto:
              "Slow queries (slow query log, `EXPLAIN`), locks and hanging transactions, active connections against the limit, database CPU and disk.",
          },
          {
            titulo: "Pools and queues",
            texto:
              "Time to acquire a pool connection (see L93), a saturated libuv thread pool, sockets and keep-alive. Waiting for a connection is invisible if you only measure the query.",
          },
          {
            titulo: "The Node.js process",
            texto:
              "Event loop delay (see L30), one core at 100% CPU, memory and garbage collection growing (see L110), slow-request logs. A sign: routes that do not even use the database also became slow.",
          },
          {
            titulo: "Infrastructure and network",
            texto:
              "Host CPU and memory, container throttling, disk, network, load balancer, unhealthy instances and file-descriptor limits. Check whether a single instance is degraded.",
          },
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "How to answer in an interview",
        texto:
          "Show method: ask clarifying questions (since when? all routes? any change?), **mitigate before explaining** (roll back, scale, shift traffic) and **measure before changing**. The order runs from cheap and reversible to expensive: changes and metrics first, CPU and heap profiles last.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Don’t guess at optimizations",
        texto:
          "Adding a cache or more instances without knowing where the time goes may not help, or may make things worse (more instances mean more database connections). Restarting the service can hide the cause: collect evidence (metrics, heap snapshot, traces) first. And beware aggressive retries, which amplify the degradation. See also T24 and L118.",
      },
    ],
    armadilhas: [
      "Starting with a guess (cache, more instances, another database) instead of measuring where the time is spent.",
      "Looking only at the average: p95 and p99 reveal the tail users actually feel, while the average hides the problem.",
      "Restarting the service to “fix” it and losing the evidence, letting the cause come back.",
      "Assuming Node.js is to blame: the 5 s ceiling is often a dependency timeout, and unbounded retries can turn a slowdown into an avalanche.",
    ],
    autoteste: [
      {
        pergunta: "What does a round value like 5 s suggest, and what would you do with it?",
        resposta:
          "It suggests a configured timeout (HTTP client, DNS, pool, load balancer). Look in code and configuration for an equal value and see in the trace which call reaches that ceiling: usually a dependency that is down or an exhausted pool.",
      },
      {
        pergunta: "How do you tell a slow database from a blocked event loop?",
        resposta:
          "With a slow database, the query spans and the wait for a connection get long, but Node.js CPU and event loop delay stay low. With a blocked event loop, the delay is high, one core sits at 100% and even routes that skip the database become slow.",
      },
    ],
  },
};
