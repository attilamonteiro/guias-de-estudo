import type { Pergunta } from "../../tipos";

// L122 · Serviço de alta disponibilidade
export const l122: Pergunta = {
  numero: 222,
  modulo: "linkedin-producao",
  metodo: "design",
  pt: {
    titulo: "Serviço de alta disponibilidade",
    pergunta: "Como você projetaria um serviço Node.js altamente disponível?",
    porqueEsteMetodo:
      "É um desenho de sistema, e o risco é sair listando tecnologias. O roteiro (alvo, instâncias, borda, dependências, deploy, observabilidade) parte do quanto de indisponibilidade o negócio tolera e elimina os pontos únicos de falha, um por vez.",
    resposta30s:
      "Comece pelo **alvo de disponibilidade** (SLO) e elimine os **pontos únicos de falha**: serviço **sem estado**, em **várias instâncias e zonas**, atrás de um **balanceador com health checks**, com **timeouts, retentativas e circuit breakers** nas dependências. Some **deploy sem downtime** (graceful shutdown) e **observabilidade** para detectar e agir rápido. A disponibilidade final é a da **cadeia inteira**, banco incluído, e não só a do seu código.",
    blocos: [
      {
        tipo: "passos",
        titulo: "O roteiro aplicado",
        passos: [
          {
            titulo: "1. Defina o alvo de disponibilidade",
            texto:
              "Pergunte: disponibilidade de quê, para quem, e quanto custa ficar fora? Transforme o alvo em orçamento de indisponibilidade: 99,9% permite cerca de 43 minutos fora por mês; 99,99%, cerca de 4 minutos. Defina também quanto tempo para recuperar e quanta perda de dados se aceita. Cada “nove” a mais custa muito mais.",
          },
          {
            titulo: "2. Serviço sem estado, em várias instâncias",
            texto:
              "Sessões, cache e filas guardados na memória do processo vão para fora (Redis, banco). Assim qualquer instância atende qualquer requisição e perder uma não custa nada. Um erro fatal derruba o processo inteiro (veja L116), então o reinício automático e as réplicas são o plano. Mínimo de duas instâncias, em zonas de disponibilidade diferentes, e capacidade para sobreviver à perda de uma (N+1). Veja T45 e T50.",
          },
          {
            titulo: "3. Borda: balanceador e health checks",
            texto:
              "O balanceador distribui o tráfego e tira da rotação a instância doente. Separe liveness (reinicia o processo travado) de readiness (só recebe tráfego quando conectado ao banco e pronto). Ajuste os tempos: o `server.keepAliveTimeout` do Node.js deve ser maior que o tempo ocioso do balanceador, ou conexões reaproveitadas são cortadas e aparecem 502 esporádicos.",
          },
          {
            titulo: "4. Dependências que falham",
            texto:
              "Banco com réplica e failover automático; cache e fila redundantes. Toda chamada externa leva timeout, retentativa com backoff e idempotência (veja L105), e um circuit breaker para parar de insistir. Planeje a degradação: se um recurso secundário cai, a resposta sai sem ele em vez de falhar por inteiro.",
          },
          {
            titulo: "5. Deploy e encerramento sem downtime",
            texto:
              "Troca gradual (rolling), blue-green ou canary, com rollback rápido. No encerramento, `SIGTERM` tira a instância da readiness, drena as requisições em andamento e fecha as conexões (veja L115). Migrações de banco compatíveis com a versão anterior (expandir, migrar, contrair) para que as duas versões convivam durante a troca.",
          },
          {
            titulo: "6. Observabilidade e ensaio de falhas",
            texto:
              "Métricas, logs e traces (veja L118 e L117), alertas sobre sintomas e um roteiro de resposta (runbook) para cada um. Teste a falha antes de ela acontecer: derrube uma instância, uma zona, uma dependência. Backup só vale se a restauração foi ensaiada.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "O que acontece quando uma instância falha",
        etapas: [
          "Um processo trava ou cai (laço bloqueado, memória esgotada, erro fatal)",
          "O health check falha algumas vezes seguidas e o balanceador tira a instância da rotação",
          "As requisições novas vão para as demais instâncias; as que estavam na instância caída falham e o cliente tenta de novo com segurança (idempotência)",
          "O orquestrador reinicia ou substitui a instância, que só volta a receber tráfego quando a readiness confirma banco e cache",
          "O alerta dispara se a taxa de erros ou a capacidade passar do limite, e a instância volta à rotação",
        ],
        nota: "Com folga de capacidade (N+1), quase ninguém percebe. Sem folga, as instâncias restantes sobrecarregam e a falha vira cascata.",
      },
      {
        tipo: "tabela",
        titulo: "Ponto único de falha → defesa",
        colunas: ["Possível falha", "Defesa", "Custo ou limite"],
        linhas: [
          [
            "Uma instância ou processo",
            "Várias réplicas sem estado, health check e reinício automático",
            "Exige tirar o estado da memória do processo",
          ],
          [
            "Uma zona de disponibilidade",
            "Instâncias em zonas distintas, balanceador multizona, capacidade N+1",
            "Mais custo e latência entre zonas até o banco",
          ],
          [
            "Banco primário",
            "Réplica com failover automático; backups com restauração testada",
            "Tempo de promoção e, com replicação assíncrona, risco de perder as últimas escritas",
          ],
          [
            "Dependência externa lenta ou fora do ar",
            "Timeout, retentativa com backoff, circuit breaker e fallback",
            "Resposta degradada; exige operações idempotentes",
          ],
          [
            "Deploy defeituoso",
            "Troca gradual, canary, readiness e rollback rápido",
            "Compatibilidade entre versões durante a troca",
          ],
          [
            "Região inteira",
            "Implantação em mais de uma região (ativo-ativo ou em espera)",
            "Complexidade e custo altos: só se o requisito justificar",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Regra de decisão",
        texto:
          "Não existe 100%. Escolha o alvo pelo custo real da indisponibilidade e **comece simples**: duas ou mais instâncias sem estado atrás de um balanceador, em zonas diferentes. Elimine os pontos únicos de falha na ordem de probabilidade e impacto (processo, zona, dependências) e só suba de nível (várias regiões) se o requisito pedir.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Disponibilidade é a da cadeia",
        texto:
          "Componentes em série multiplicam as falhas: se a requisição depende de três componentes de 99,9% cada, o conjunto fica perto de 99,7%. Por isso reduza as dependências críticas no caminho da requisição e torne as não essenciais opcionais (degradação) ou assíncronas (fila).",
      },
    ],
    armadilhas: [
      "Replicar o processo mantendo sessões ou cache na memória: cada instância passa a ter um estado diferente e perder uma perde dados.",
      "Pôr todas as instâncias na mesma máquina ou zona e chamar de alta disponibilidade: a redundância é só aparente.",
      "Fazer o liveness checar o banco: uma oscilação dele reinicia todas as instâncias em cascata. O contrário também falha: um health check que sempre responde 200.",
      "Deploy que mata instâncias no meio das requisições (sem graceful shutdown) ou migração de banco que quebra a versão anterior ainda em execução.",
    ],
    autoteste: [
      {
        pergunta: "Por que o serviço precisa ser sem estado para ser altamente disponível?",
        resposta:
          "Porque, com o estado na memória, cada instância é insubstituível: perder uma perde sessões e dados, e o balanceador não pode mandar a requisição para qualquer uma. Sem estado, as instâncias são intercambiáveis e uma falha é invisível.",
      },
      {
        pergunta:
          "A API de pagamentos de que você depende ficou lenta. O que fazer para o seu serviço continuar disponível?",
        resposta:
          "Timeout curto, circuit breaker para parar de insistir, retentativa com backoff só para erros transitórios (com idempotência) e degradação: aceitar o pedido e processar o pagamento por fila, ou avisar claramente (veja L105).",
      },
    ],
  },
  en: {
    titulo: "Highly available service",
    pergunta: "How would you design a highly available Node.js service?",
    porqueEsteMetodo:
      "It is a system design, and the risk is to start listing technologies. The script (target, instances, edge, dependencies, deploy, observability) starts from how much downtime the business tolerates and removes the single points of failure, one at a time.",
    resposta30s:
      "Start with the **availability target** (SLO) and remove the **single points of failure**: a **stateless** service, in **several instances and zones**, behind a **load balancer with health checks**, with **timeouts, retries and circuit breakers** on its dependencies. Add **zero-downtime deploys** (graceful shutdown) and **observability** to detect and act fast. The final availability is that of the **whole chain**, database included, not just your code.",
    blocos: [
      {
        tipo: "passos",
        titulo: "The script applied",
        passos: [
          {
            titulo: "1. Define the availability target",
            texto:
              "Ask: availability of what, for whom, and what does downtime cost? Turn the target into a downtime budget: 99.9% allows about 43 minutes down per month; 99.99%, about 4 minutes. Also define how fast you must recover and how much data loss is acceptable. Each extra “nine” costs much more.",
          },
          {
            titulo: "2. Stateless service, several instances",
            texto:
              "Sessions, cache and queues kept in process memory move out (Redis, database). Then any instance can serve any request and losing one costs nothing. A fatal error takes down the whole process (see L116), so automatic restart and replicas are the plan. At least two instances, in different availability zones, with capacity to survive losing one (N+1). See T45 and T50.",
          },
          {
            titulo: "3. Edge: load balancer and health checks",
            texto:
              "The load balancer spreads traffic and pulls the sick instance out of rotation. Separate liveness (restarts the stuck process) from readiness (receives traffic only when connected to the database and ready). Tune the timeouts: Node.js `server.keepAliveTimeout` must be longer than the load balancer’s idle timeout, or reused connections are cut and sporadic 502s appear.",
          },
          {
            titulo: "4. Dependencies that fail",
            texto:
              "Database with a replica and automatic failover; redundant cache and queue. Every external call gets a timeout, a retry with backoff and idempotency (see L105), plus a circuit breaker to stop insisting. Plan for degradation: if a secondary resource goes down, the response goes out without it instead of failing entirely.",
          },
          {
            titulo: "5. Deploys and shutdown without downtime",
            texto:
              "Gradual replacement (rolling), blue-green or canary, with fast rollback. On shutdown, `SIGTERM` takes the instance out of readiness, drains in-flight requests and closes connections (see L115). Database migrations compatible with the previous version (expand, migrate, contract) so the two versions coexist during the switch.",
          },
          {
            titulo: "6. Observability and failure rehearsal",
            texto:
              "Metrics, logs and traces (see L118 and L117), alerts on symptoms and a response script (runbook) for each one. Test failure before it happens: kill an instance, a zone, a dependency. A backup only counts if the restore was rehearsed.",
          },
        ],
      },
      {
        tipo: "fluxo",
        titulo: "What happens when an instance fails",
        etapas: [
          "A process hangs or crashes (blocked loop, out of memory, fatal error)",
          "The health check fails several times in a row and the load balancer pulls the instance out of rotation",
          "New requests go to the other instances; those that were on the failed instance fail and the client retries safely (idempotency)",
          "The orchestrator restarts or replaces the instance, which receives traffic again only when readiness confirms the database and cache",
          "The alert fires if the error rate or capacity crosses the limit, and the instance returns to rotation",
        ],
        nota: "With spare capacity (N+1), almost nobody notices. Without it, the remaining instances overload and the failure becomes a cascade.",
      },
      {
        tipo: "tabela",
        titulo: "Single point of failure → defense",
        colunas: ["Possible failure", "Defense", "Cost or limit"],
        linhas: [
          [
            "One instance or process",
            "Several stateless replicas, health check and automatic restart",
            "Requires taking state out of process memory",
          ],
          [
            "One availability zone",
            "Instances in distinct zones, multi-zone load balancer, N+1 capacity",
            "More cost and cross-zone latency to the database",
          ],
          [
            "Primary database",
            "Replica with automatic failover; backups with a tested restore",
            "Promotion time and, with asynchronous replication, a risk of losing the latest writes",
          ],
          [
            "Slow or unavailable external dependency",
            "Timeout, retry with backoff, circuit breaker and fallback",
            "Degraded response; requires idempotent operations",
          ],
          [
            "Faulty deploy",
            "Gradual rollout, canary, readiness and fast rollback",
            "Compatibility between versions during the switch",
          ],
          [
            "An entire region",
            "Deployment in more than one region (active-active or standby)",
            "High complexity and cost: only if the requirement justifies it",
          ],
        ],
      },
      {
        tipo: "destaque",
        variante: "chave",
        titulo: "Decision rule",
        texto:
          "There is no 100%. Choose the target by the real cost of downtime and **start simple**: two or more stateless instances behind a load balancer, in different zones. Remove single points of failure in order of likelihood and impact (process, zone, dependencies) and move up a level (multiple regions) only if the requirement asks for it.",
      },
      {
        tipo: "destaque",
        variante: "aviso",
        titulo: "Availability is that of the chain",
        texto:
          "Components in series multiply their failures: if a request depends on three components at 99.9% each, the whole is near 99.7%. So reduce critical dependencies on the request path and make the non-essential ones optional (degradation) or asynchronous (queue).",
      },
    ],
    armadilhas: [
      "Replicating the process while keeping sessions or cache in memory: each instance ends up with different state and losing one loses data.",
      "Putting all instances on the same machine or zone and calling it high availability: the redundancy is only apparent.",
      "Making liveness check the database: a blip there restarts every instance in a cascade. The opposite also fails: a health check that always answers 200.",
      "A deploy that kills instances in the middle of requests (no graceful shutdown) or a database migration that breaks the previous version still running.",
    ],
    autoteste: [
      {
        pergunta: "Why must the service be stateless to be highly available?",
        resposta:
          "Because with state in memory each instance is irreplaceable: losing one loses sessions and data, and the load balancer cannot send a request to just any instance. Stateless instances are interchangeable and a failure goes unnoticed.",
      },
      {
        pergunta: "The payment API you depend on got slow. What do you do to keep your service available?",
        resposta:
          "A short timeout, a circuit breaker to stop insisting, retries with backoff only for transient errors (with idempotency) and degradation: accept the order and process the payment through a queue, or say so clearly (see L105).",
      },
    ],
  },
};
